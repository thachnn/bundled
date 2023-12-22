'use strict';

const path = require('path');
const fs = require('fs');
const { minify } = require('terser');
const { TerserPlugin, CopyPlugin, BannerPlugin, ReplaceCodePlugin } = require('webpack');

/**
 * @typedef {import('webpack').Configuration} Configuration
 * @typedef {{from: string, to?: (string|Function), context?: string, transform?: Function, transformPath?: Function}} ObjectPattern
 */

/** @type {import('terser').MinifyOptions} */
const baseTerserOpts = require('./scripts/terser.config.json');
const commentsCond = /(^\**\s*!(?!\s*\**$)|(^|\n|\r)\s*@(preserve|lic(ense)?|cc_on)\b)/i;

/**
 * @param {string} name
 * @param {Configuration} config
 * @param {boolean} [clean]
 * @returns {Configuration}
 */
const webpackConfig = (name, config, clean = name.charAt(0) !== '/') =>
  Object.assign(config, {
    mode: 'production',
    name: clean ? name : name.substring(1),
    output: Object.assign({ path: path.join(__dirname, 'dist', clean ? name : '') }, config.output),
    context: __dirname,
    target: config.target || 'node',
    node: { __filename: false, __dirname: false },
    cache: true,
    stats: { modules: true, maxModules: Infinity, children: true },
    optimization: Object.assign({ nodeEnv: false }, config.optimization, {
      // minimize: false,
      minimizer: ((config.optimization || {}).minimizer || [null]).map(newTerserPlugin),
    }),
    plugins: [
      new ReplaceCodePlugin({
        search: /(\n\/\*{6}\/[ \t]*__webpack_require__)\.d *= *function\b[\s\S]*?\1\.p *= *"";/,
        replace: '',
      }),
    ].concat(config.plugins || []),
  });

const newTerserPlugin = (opt) =>
  new TerserPlugin(
    Object.assign({ extractComments: { condition: commentsCond, banner: false }, cache: true }, opt, {
      // parallel: true,
      terserOptions: Object.assign({}, baseTerserOpts, (opt = opt || {}).terserOptions, {
        output: Object.assign({ comments: /^\s*\d+\s*$/ }, baseTerserOpts.output, (opt.terserOptions || {}).output),
      }),
    })
  );

const minifyContent = (content, opts = null) =>
  minify(String(content), Object.assign({}, baseTerserOpts, typeof opts === 'object' ? opts : null)).code;

/** @param {(Array.<(ObjectPattern|string)>|ObjectPattern)} patterns */
const newCopyPlugin = (patterns) => new CopyPlugin(Array.isArray(patterns) ? patterns : [patterns]);

// Helpers

/** @param {...Array.<(string|RegExp)>} _args */
String.prototype.replaceBulk = function (_args) {
  return Array.prototype.reduce.call(arguments, (s, i) => s.replace(i[0], i[1]), this);
};

//
module.exports = [
  webpackConfig('@terser', {
    entry: { 'bin/terser': './node_modules/terser/bin/terser' },
    output: { filename: '[name]' },
    externals: {
      '..': 'commonjs2 ..', // ../vendor/terser
      acorn: 'commonjs ../vendor/acorn',
      'source-map': 'commonjs2 ../vendor/source-map',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]terser\b.bin\b.terser$/i,
          loader: 'string-replace-loader',
          options: { search: /^#!.*/m, replace: '' },
        },
        {
          test: /\bnode_modules[\\/]terser\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"((description|author)":.*"|engines":[\s\S]*(?=}\s*$))/g, replace: '' },
        },
        {
          test: /\bnode_modules[\\/]source-map-support\b.source-map-support\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /(?<=\s)dynamicRequire\(module,/g, replace: '__non_webpack_require__(' },
        },
      ],
    },
    optimization: {
      minimizer: [{ test: /(\.m?js|[\\/][\w-]+)$/i }],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,!(CONTRIBUTING).md,tools/*.d.ts}', context: 'node_modules/terser' },
        {
          from: 'node_modules/terser/package.json',
          transform(content) {
            /** @type {Object.<string, *>} */
            const pkg = JSON.parse(String(content).replaceBulk(['.min.', '.'], [/"dist",$/m, '$&"vendor",']));
            ['dependencies', 'devDependencies', 'scripts', 'eslintConfig', 'pre-commit'].forEach((k) => delete pkg[k]);

            return (pkg.version += '-0'), (pkg.bin.decomment = 'bin/decomment'), JSON.stringify(pkg, null, 2) + '\n';
          },
        },
        // prettier-ignore
        {
          from: 'node_modules/acorn/dist/acorn.js', to: 'vendor/',
          transform: (s) => minifyContent(
            String(s).replaceBulk([/( pp)\$\d+([.\[])/g, '$1$2'], [/ var ([A-Z]\w+) =( function \1\()/g, '$2'])
          ),
        },
        { from: 'node_modules/source-map/dist/source-map.js', to: 'vendor/', transform: minifyContent },
        { from: 'node_modules/{acorn/dist,source-map}/*.d.ts', to: 'vendor/[name].[ext]' },
        {
          ...{ from: 'scripts/decomment.js', to: 'bin/[name]' },
          transform: (s) => minifyContent(String(s).replace(/( require\(['"])(acorn)\b/, '$1../vendor/$2')),
        },
      ]),
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
  }),
  //
  webpackConfig('/ajv', {
    entry: { 'vendor/ajv': './node_modules/ajv/lib/ajv' },
    output: { libraryTarget: 'commonjs2' },
    externals: { 'uri-js': 'commonjs ./uri-js' },
    plugins: [
      // prettier-ignore
      newCopyPlugin({
        from: 'node_modules/uri-js/dist/es5/uri.all.js', to: 'vendor/uri-js.js',
        transform: (s) => minifyContent(
          String(s).replaceBulk([/\bpunycode\.(\w+\()/g, '$1'], [/^var (\w+) *= *(function \1\()/gm, '$2'])
        ),
      }),
    ],
  }),
  webpackConfig('/ajv-keywords', {
    entry: { 'vendor/ajv-keywords': './node_modules/ajv-keywords/index' },
    output: { libraryTarget: 'commonjs2' },
  }),
  webpackConfig('/loader-utils', {
    entry: { 'lib/loader-utils': './node_modules/loader-utils/lib/index' },
    output: { libraryTarget: 'commonjs2' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]json5\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /(?<== *)_interopRequire\w+|\b_(?=typeof\()/g, replace: '' },
        },
      ],
    },
    resolve: {
      alias: { 'big.js$': path.resolve(__dirname, 'node_modules/big.js/big.js') },
    },
  }),
  //
  webpackConfig('/minimatch', {
    entry: { 'vendor/minimatch': './node_modules/minimatch/minimatch' },
    output: { libraryTarget: 'commonjs2' },
  }),
  webpackConfig('/glob', {
    entry: { 'vendor/glob': './node_modules/glob/glob' },
    output: { libraryTarget: 'commonjs2' },
    externals: { minimatch: 'commonjs2 ./minimatch' },
  }),
  webpackConfig('/find-cache-dir', {
    entry: { 'vendor/find-cache-dir': './node_modules/find-cache-dir/index' },
    output: { libraryTarget: 'commonjs2' },
  }),
  //
  /* TODO: /*-webpack-plugin\b.dist\b.*\.js$/i
    /\b_interopRequire\w+\(/g, '('
    /\brequire\(['"]\.[\/\w-]+\)/g, '$&.default'
    /\(0, (_[\w.$]+)\)/g, '$1'
    /\b(_[\w$]+)\.default([.(])/g, '$1$2'
    /\b_objectSpread\(/g, 'Object.assign('
  */
];

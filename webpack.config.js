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
    Object.assign({ extractComments: { condition: 'some', banner: false }, cache: true }, opt, {
      // parallel: true,
      terserOptions: Object.assign({}, baseTerserOpts, (opt || {}).terserOptions),
    })
  );

const minifyContent = (content, opts = null) =>
  minify(String(content), Object.assign({}, baseTerserOpts, typeof opts === 'object' ? opts : null)).code;

/** @param {Array.<(ObjectPattern|string)>} patterns */
const newCopyPlugin = (patterns) => new CopyPlugin(patterns);

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
          test: /\bnode_modules[\\/]terser\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"((description|author)":.*"|engines":[\s\S]*(?=\}\s*$))/g, replace: '' },
        },
        {
          test: /\bnode_modules[\\/]source-map-support\b.source-map-support\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /(?<=\s)dynamicRequire\(module,/g, replace: '__non_webpack_require__(' },
        },
      ],
    },
    optimization: {
      minimizer: [
        {
          include: /[\\/]terser$/i,
          terserOptions: { compress: { passes: 1 }, output: { comments: false, beautify: true, indent_level: 2 } },
        },
      ],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,*.md,tools/*.d.ts}', context: 'node_modules/terser' },
        {
          from: 'node_modules/terser/package.json',
          transform(content) {
            const pkg = JSON.parse(String(content).replaceBulk(['.min.', '.'], [/"dist",$/m, '$&"vendor",']));
            ['dependencies', 'devDependencies', 'scripts', 'eslintConfig', 'pre-commit'].forEach((k) => delete pkg[k]);

            return (pkg.version += '-0'), (pkg.bin.decomment = 'bin/decomment'), JSON.stringify(pkg, null, 2) + '\n';
          },
        },
        { from: 'node_modules/*/dist/{source-map,acorn}.js', to: 'vendor/[name].[ext]', transform: minifyContent },
        {
          from: 'scripts/decomment.js',
          to: 'bin/decomment',
          transform: (s) => minifyContent(s).replace(/\b(require\(['"])(acorn)\b/, '$1../vendor/$2'),
        },
      ]),
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
  }),
  //
  // TODO: /ajv
  webpackConfig('/ajv-keywords', {
    entry: { 'vendor/ajv-keywords': './node_modules/ajv-keywords/index' },
    output: { libraryTarget: 'commonjs2' },
  }),
];

'use strict';

const path = require('path');
const fs = require('fs');
const { minify } = require('webpack/vendor/terser');
const { TerserPlugin, CopyPlugin, BannerPlugin, ReplaceCodePlugin } = require('webpack');

/**
 * @typedef {import('webpack').Configuration} Configuration
 * @typedef {{from: string, to?: (string|Function), context?: string, transform?: Function, transformPath?: Function}} ObjectPattern
 */

const mergeDeep = require('./scripts/mergeDeep');

/** @type {import('terser').MinifyOptions} */
const baseTerserOpts = require('./scripts/terser.config.json');

/**
 * @param {string} name
 * @param {Configuration} config
 * @param {boolean} [clean]
 * @returns {Configuration}
 */
const webpackConfig = (name, config, clean = name.charAt(0) !== '/') => {
  config = {
    mode: 'production',
    name: clean ? name : name.substring(1),
    output: { path: path.join(__dirname, 'dist', clean ? name : '') },
    context: __dirname,
    target: 'node',
    node: { __filename: false, __dirname: false },
    cache: true,
    stats: { modules: true, maxModules: Infinity, children: true },
    optimization: {
      nodeEnv: false,
      // minimize: false,
      minimizer: [newTerserPlugin({ terserOptions: { output: { ecma: 2015 } } })],
    },
    plugins: [
      new ReplaceCodePlugin({
        search: /(\n\/\*{6}\/[ \t]*__webpack_require__)\.d *= *function\b[\s\S]*?\1\.p *= *"";/,
        replace: '',
      }),
    ],
  }.mergeDeep(config);

  config.optimization.minimizer.length > 1 && config.optimization.minimizer.shift();
  return config;
};

const newTerserPlugin = (opts = {}) =>
  new TerserPlugin(
    {
      cache: true,
      extractComments: { condition: /(^|\n)[\s*]*@(preserve|lic(ense)?|cc_on)\b|^\**\s*!(?!\s*\**$)/i, banner: false },
      // parallel: true,
      terserOptions: { output: { comments: /^\s*\d+\s*$/ } }.mergeDeep(baseTerserOpts),
    }.mergeDeep(opts)
  );

const minifyContent = (content, opts = null) =>
  minify(String(content), mergeDeep(baseTerserOpts, typeof opts == 'object' ? opts : null)).code;

/** @param {(Array.<(ObjectPattern|string)>|ObjectPattern)} patterns */
const newCopyPlugin = (patterns) => new CopyPlugin([].concat(patterns));

// Helpers

Object.defineProperty(String.prototype, 'replaceBulk', {
  value: /** @param {...Array.<(string|RegExp)>} _args */ function (_args) {
    return Array.prototype.reduce.call(arguments, (s, i) => s.replace(i[0], i[1]), this);
  },
});

const replaceModExport = (s, p1) => s.replace(/^\s*module\.exports *=/gm, p1);

Object.defineProperty(String.prototype, 'replaceWithFile', {
  value: function (/** @type {RegExp} */ re, p = null, cb = replaceModExport) {
    if (typeof p == 'function') (cb = p), (p = null);
    return this.replace(re, (_, p1, p2) => cb(fs.readFileSync(require.resolve(p || p2), 'utf8'), p1));
  },
});

const commonjs1Patches = [
  { search: /(?<!\bfunction )\b_interopRequire\w+\(/g, replace: '(' },
  {
    search: /\b(_[\w$]+) *= *\(?require\(['"]\.+\/((?!\.json['"]).)*?\)(?=[\s\S]*?\b\1\d*\.default\b)/g,
    replace: '$&.default',
  },
  { search: /\(0, *(_[\w.$]+)\)/g, replace: '$1' },
  { search: /\b(_[\w$]+)\.default([.,()])/g, replace: '$1$2' },
  { search: /(?<!\bfunction )\b_objectSpread\(/g, replace: 'Object.assign(' },
];

//
module.exports = [
  //
  // cross-spawn  /^[v=\s]*((4\.([8-9]|\d{2,})|5\.([7-9]|\d{2,}))\b|([6-9]|\d{2,})\.)/  '^4.8.0 || ^5.7.0 || >= 6.0.0'
  //
  webpackConfig('/loader-utils', {
    entry: { 'lib/loader-utils': './node_modules/loader-utils/lib/parseQuery' },
    output: { libraryTarget: 'commonjs2' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]json5\b.lib\b.*\.js$/i,
          loader: 'webpack/lib/replace-loader',
          // FIXME clean _iterator -> for...of
          options: { search: /(?<== *)_interopRequire\w+|\b_(?=typeof\()/g, replace: '' },
        },
      ],
    },
    optimization: { minimizer: [newTerserPlugin()] },
  }),
  webpackConfig('/yargs', {
    entry: { 'vendor/yargs': './node_modules/yargs/index' },
    output: { libraryTarget: 'commonjs2' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/](yargs\b.(\w*|lib\b.apply-.*)|(yargs-parser|require-main-.*)\b.index)\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /(^|[^\w.])require((\.resolve)?\(\w+|\)|;?$)/gm, replace: '$1__non_webpack_require__$2' },
        },
        // FIXME comment-out readFile in Y18N._readLocaleFile()
      ],
    },
  }),
  //
  webpackConfig('/webpack-cli', {
    entry: { 'bin/cli': './node_modules/webpack-cli/bin/cli' },
    externals: {
      webpack: 'commonjs2 webpack',
      'loader-utils': 'commonjs2 ../lib/loader-utils',
      'enhanced-resolve': 'commonjs2 ../lib/enhanced-resolve',
      micromatch: 'commonjs2 ../vendor/micromatch',
      yargs: 'commonjs2 ../vendor/yargs',
      '../config/optionsSchema.json': 'commonjs ./optionsSchema.json',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/](webpack-cli\b.bin.utils.(prompt|convert)-.*|(interpret|import-.*)\b.index)\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /\brequire((\.resolve)?\(\w+|\.extensions\b)/g, replace: '__non_webpack_require__$1' },
        },
        {
          test: /node_modules[\\/]webpack-cli\b.bin.cli\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              { search: /^#!/, replace: '//$&' }, // unwrap IIFE
              { search: /^\(function *\(\) *\{[\r\n]([\s\S]*)[\r\n]\}\)\(\);?/m, replace: '$1' },
              { search: /\brequire(\(['"])(v8-compile-)/, replace: '__non_webpack_require__$1../vendor/$2' },
            ],
          },
        },
        {
          test: /node_modules[\\/]webpack-cli\b.package\.json$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /,\s*"repository":[\s\S]*/, replace: '\n}' },
        },
      ],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,*.md}', context: 'node_modules/webpack-cli' },
        {
          from: 'node_modules/webpack-cli/package.json',
          transform(content) {
            const pkg = JSON.parse(String(content).replace(/(,\s*)"scripts"$/m, '$1"lib", "vendor"'));

            pkg.devDependencies = pkg.dependencies;
            ['dependencies', 'scripts', 'husky', 'lint-staged', 'jest', 'nyc', 'config'].forEach((k) => delete pkg[k]);

            return (pkg.version += '-0'), JSON.stringify(pkg, null, 2) + '\n';
          },
        },
        { from: 'node_modules/webpack-cli/bin/config/optionsSchema.json', to: 'bin/' },
        { from: 'node_modules/v8-compile-cache/v8-*.js', to: 'vendor/[name].[ext]', transform: minifyContent },
        {
          from: '{lib,vendor}/{enhanced-resolve,tapable,graceful-fs,micromatch,source-map}.*',
          context: 'node_modules/webpack',
        },
      ]),
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
  }),
];

'use strict';

const path = require('path');
const fs = require('fs');
const { minify } = require('webpack/vendor/terser');
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

/** @param {Array<(ObjectPattern|string)>} patterns */
const newCopyPlugin = (patterns) => new CopyPlugin(patterns);

//
module.exports = [
  /* TODO:
  webpackConfig('import-local', {
    entry: { index: './node_modules/import-local/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: { fsevents: 'commonjs2 fsevents' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]import-local\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /\brequire((\.resolve)?\(\w+)/g, replace: '__non_webpack_require__$1' },
        },
      ],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,*.md}', context: 'node_modules/import-local' },
        {
          from: 'node_modules/import-local/package.json',
          transform: (s) => String(s).replace(/,\s*"(d(evD)?ependencies|scripts)":\s*\{[^{}]*\}/g, ''),
        },
      ]),
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
  }),
  */
];

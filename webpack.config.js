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
  webpackConfig('/tape', {
    entry: { index: './node_modules/tape/index' },
    output: { libraryTarget: 'commonjs2' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]object-inspect\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            search: /\brequire\(['"]\.(\/[^'"]+)['"]\);?/g,
            replace: (m, p1) => m.replaceWithFile(/().*/, 'object-inspect' + p1),
          },
        },
      ],
    },
    optimization: { minimizer: [newTerserPlugin()] },
  }),
  webpackConfig('/glob', {
    entry: { 'lib/glob': './node_modules/glob/glob' },
    output: { libraryTarget: 'commonjs2' },
    externals: { minimatch: './minimatch' },
  }),
  webpackConfig('/tape-bin', {
    entry: { 'bin/tape': './node_modules/tape/bin/tape' },
    output: { filename: '[name]' },
    externals: { glob: 'commonjs2 ../lib/glob', minimatch: 'commonjs2 ../lib/minimatch' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]tape\b.bin\b.tape$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              { search: /^#!/, replace: '//$&' },
              { search: /\b(require\(['"]resolve)(['"]\))\.(\w+)/g, replace: '$1/lib/$3$2' },
              { search: /\brequire(\(\w+)/g, replace: '__non_webpack_require__$1' },
            ],
          },
        },
      ],
    },
    optimization: {
      minimizer: [newTerserPlugin({ test: /(\.m?js|[\\/][\w-]+)$/i })],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,*.{md,markdown}}', context: 'node_modules/tape' },
        {
          from: 'node_modules/tape/package.json',
          transform(pkg) {
            (pkg = JSON.parse(pkg)).devDependencies = pkg.dependencies;
            ['dependencies', 'scripts', 'testling'].forEach((k) => delete pkg[k]);

            return (pkg.version += '-0'), JSON.stringify(pkg, null, 4) + '\n';
          },
        },
        { from: 'node_modules/webpack/vendor/{glob,minimatch}.*', to: 'lib/[name].[ext]' },
      ]),
      new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    ],
  }),
];

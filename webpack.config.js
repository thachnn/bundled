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
const newCopyPlugin = (patterns) => new CopyPlugin([].concat(patterns));

// Helpers

/** @param {...Array.<(string|RegExp)>} _args */
String.prototype.replaceBulk = function (_args) {
  return Array.prototype.reduce.call(arguments, (s, i) => s.replace(i[0], i[1]), this);
};

const replaceModExport = (s, p1) => s.replace(/^\s*module\.exports *=/gm, p1);

/**
 * @param {RegExp} re
 * @param {(string|Function)} [p]
 * @param {Function} [cb]
 */
String.prototype.replaceWithFile = function (re, p = null, cb = replaceModExport) {
  if (typeof p == 'function') (cb = p), (p = null);
  return this.replace(re, (_, p1, p2) => cb(fs.readFileSync(require.resolve(p || p2), 'utf8'), p1));
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
  //
  webpackConfig('/browser-libs', {
    entry: {
      'crypto-browserify': './node_modules/crypto-browserify/index',
      buffer: './node_modules/buffer/index',
      'stream-http': './node_modules/stream-http/index',
      'readable-stream/readable': './node_modules/readable-stream/readable',
      'browserify-zlib': './node_modules/browserify-zlib/lib/index',
    },
    output: { path: path.join(__dirname, 'dist', 'web_modules'), libraryTarget: 'commonjs2' },
    externals: {
      'string_decoder/': 'commonjs2 ../string_decoder',
      'util/util': 'commonjs2 ../util',
      'readable-stream': 'commonjs2 ./readable-stream/readable',
      string_decoder: 'commonjs2 ./string_decoder',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]readable-stream\b.lib\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /\b(require\(['"])(util-)?(deprecate|inherits)(['"]\))/g, replace: '$1util/util$4.$3' },
        },
        {
          test: /\bnode_modules[\\/]elliptic\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"description":[\s\S]*/, replace: '\n}' },
        },
      ],
    },
    resolve: {
      // aliasFields: ['browser'],
      alias: [
        ...['create-hash', 'create-hmac', 'browserify-aes', 'browserify-cipher', 'browserify-sign'],
        ...['builtin-status-codes', 'randombytes', 'diffie-hellman'],
      ].reduce((o, v) => ((o[v + '$'] = require.resolve(v + '/browser')), o), {
        './internal/streams/stream': require.resolve('readable-stream/lib/internal/streams/stream-browser'),
        'browserify-sign/algos$': path.resolve(__dirname, 'node_modules/browserify-sign/browser/algorithms.json'),
      }),
    },
    plugins: [
      newCopyPlugin([
        { from: 'node_modules/node-libs-browser/mock/', to: 'mock/', transform: minifyContent },
        { from: 'node_modules/constants-browserify/constants.json', to: 'constants-browserify.json' },
        {
          from: 'node_modules/{string_decoder/lib/*,events/events,punycode/punycode,{domain-browser/source,{console,https,path,tty,vm}-browserify}/index,{os-browserify,process}/browser}.js',
          transform: minifyContent, // replace(/\b(require\(['"])((assert|util|events|url)['"])/g, '$1./$2')
          transformPath: (_, p) => `${p.replace(/^.*\bnode_modules[\\/]|[\\/].*$/g, '')}.js`,
        },
        { from: 'readable-stream/{pass*,duplex,transform}.js', context: 'node_modules', transform: minifyContent },
        {
          from: 'node_modules/readable-stream/duplex.js',
          to: 'readable-stream/writable.js',
          transform: (s) => minifyContent(String(s).replace(/\.Duplex;?$/m, '.Writable;')),
        },
        {
          from: 'node_modules/timers-browserify/main.js',
          to: 'timers-browserify.js',
          transform: (s) => minifyContent(String(s).replaceWithFile(/^(\s*)require\(['"](setimmediate)\b.*/m)),
        },
        {
          from: 'node_modules/stream-browserify/index.js',
          to: 'stream-browserify.js',
          transform: (s) =>
            minifyContent(String(s).replaceBulk([/\('(inherits)'\)/, "('./util').$1"], [/\('(readable-)/g, "('./$1"])),
        },
        // prettier-ignore
        {
          from: 'node_modules/util/util.js', to: 'util.js',
          transform: (content) => minifyContent(String(content)
            .replaceWithFile(/^(exports\.isBuffer *=) *require\(.*/m, 'util/support/isBufferBrowser')
            .replaceWithFile(/^(exports\.(inherits) *=) *require\(.*/m, (s, p1) =>
              replaceModExport(s.replaceWithFile(/^(.*\.exports *=) *require\(.*_.*/m, 'inherits/inherits_browser'), p1))
          ),
        },
      ]),
    ],
  }),
];

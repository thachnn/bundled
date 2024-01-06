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
    context: config.context || __dirname,
    target: config.target || 'node',
    node: { __filename: false, __dirname: false },
    cache: true,
    stats: Object.assign({ modules: true, maxModules: Infinity, children: true }, config.stats),
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
  webpackConfig('/copy-plugin', {
    entry: { 'lib/copy-plugin': './node_modules/copy-webpack-plugin/dist/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      cacache: 'commonjs2 ../vendor/cacache',
      'find-cache-dir': 'commonjs2 ../vendor/find-cache-dir',
      minimatch: 'commonjs2 ../vendor/minimatch',
      glob: 'commonjs2 ../vendor/glob',
      'schema-utils': 'commonjs2 ./schema-utils',
      'loader-utils': 'commonjs2 ./loader-utils',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]\w+-webpack-plugin\b.dist\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: { multiple: commonjs1Patches },
        },
        {
          test: /\bnode_modules[\\/]copy-webpack-plugin\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"license":[\s\S]*/, replace: '\n}' },
        },
      ],
    },
  }),
  //
  webpackConfig('/bluebird', {
    context: path.resolve(__dirname, 'node_modules/bluebird/js/release'),
    entry: { 'vendor/bluebird': './bluebird' },
    output: { libraryTarget: 'commonjs2' },
    // externals: ['async_hooks'],
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]bluebird\b.*\b(call_get|join|promisify)\.js$/i,
          loader: 'string-replace-loader',
          options: { search: / *(\\n\\\n +)+/g, replace: '\\n\\\n ' },
        },
      ],
    },
    stats: { modulesSort: 'index' },
    optimization: { moduleIds: 'named' },
    plugins: [
      new ReplaceCodePlugin({ search: /\b__webpack_require__\b/g, replace: '__wpreq__' }), //
    ],
  }),
  webpackConfig('/readable-stream', {
    entry: { 'vendor/readable-stream': './node_modules/readable-stream/readable' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      'safe-buffer': 'commonjs2 buffer',
      'string_decoder/': 'commonjs2 string_decoder',
      'core-util-is': 'commonjs2 util',
      './internal/streams/stream': 'commonjs2 stream',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]readable-stream\b.lib\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: /\brequire\(['"](process)-nextick-args\b.*?\)/, replace: '$1' },
              { search: /\b(internalUtil *= *)\{[^{}]*\brequire\(['"](util)-deprecate\b[^{}]*\}/, replace: '$1$2' },
              { search: /\brequire\(['"]isarray\b.*?\)/, replace: 'Array.isArray' },
              { search: /\bObject\.create(\(require)\b/, replace: '$1' },
              { search: /^ *util\.inherits *= *require\b/m, replace: '//$&' },
              { search: /\b(Object\.keys) *\|\| *(function)\b/, replace: '$1; 0 && $2' },
            ],
          },
        },
      ],
    },
  }),
  webpackConfig('/cacache', {
    entry: { 'vendor/cacache': './node_modules/cacache/locales/en.js' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      bluebird: 'commonjs2 ./bluebird',
      glob: 'commonjs2 ./glob',
      'readable-stream': 'commonjs2 ./readable-stream',
      'graceful-fs': 'commonjs2 ./graceful-fs',
      inherits: ['util', 'inherits'],
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]mississippi\b.index\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /^.*\bexports\.(each|duplex|parallel) *= *require\b/gm, replace: '//$&' },
        },
        {
          test: /\bnode_modules[\\/]cacache\b.\w+.+\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: /^(setLocale\(|(const (Y|setLocale)|x\.setLocale) *=)/gm, replace: '//$&' },
              { search: /(\(\s*)Y`/g, replace: '$1`' },
            ],
          },
        },
        {
          test: /\bnode_modules[\\/]cacache\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"main":[\s\S]*/, replace: '\n}' },
        },
      ],
    },
    resolve: {
      alias: { '../verify.js$': path.resolve(__dirname, 'node_modules/cacache/lib/verify.js') },
    },
  }),
  //
  webpackConfig('/webpack-sources', {
    entry: { 'lib/webpack-sources': './node_modules/webpack-sources/lib/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: { 'source-map': 'commonjs2 ../vendor/source-map' },
  }),
  webpackConfig('/terser-plugin', {
    entry: { 'lib/terser-plugin': './node_modules/terser-webpack-plugin/dist/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      cacache: 'commonjs2 ../vendor/cacache',
      'find-cache-dir': 'commonjs2 ../vendor/find-cache-dir',
      'source-map': 'commonjs2 ../vendor/source-map',
      terser: 'commonjs2 ../vendor/terser',
      'worker-farm': 'commonjs2 ../vendor/worker-farm',
      'schema-utils': 'commonjs2 ./schema-utils',
      'webpack-sources': 'commonjs2 ./webpack-sources',
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]\w+-webpack-plugin\b.dist\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: commonjs1Patches.concat({
              search: /\brequire(\.resolve\(['"])\.\/worker\b/,
              replace: '__non_webpack_require__$1./terser-worker',
            }),
          },
        },
        {
          test: /\bnode_modules[\\/]terser(-webpack-plugin)?\b.package\.json$/i,
          loader: 'string-replace-loader',
          options: { search: /,\s*"(repository|engines)":[\s\S]*/, replace: '\n}' },
        },
        {
          test: /\bnode_modules[\\/]webpack\b.lib.ModuleFilenameHelpers\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: [
              { search: /^const createHash *= *require\b/m, replace: '//$&' },
              { search: /^ModuleFilenameHelpers\.(?!match)(\w+ *=)/gm, replace: 'const $1' },
            ],
          },
        },
      ],
    },
  }),
  //
  webpackConfig('/terser-worker', {
    entry: { 'lib/terser-worker': './node_modules/terser-webpack-plugin/dist/worker' },
    output: { libraryTarget: 'commonjs2' },
    externals: { terser: 'commonjs2 ../vendor/terser' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]\w+-webpack-plugin\b.dist\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: commonjs1Patches.concat({
              search: /(, *['"]require['"],)(.*?,) *require,/m,
              replace: "$1 '__webpack_require__',$2 __non_webpack_require__, __webpack_require__,",
            }),
          },
        },
      ],
    },
  }),
  webpackConfig('/worker-farm', {
    entry: { 'vendor/worker-farm': './node_modules/worker-farm/lib/index' },
    output: { libraryTarget: 'commonjs2' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]worker-farm\b.lib.fork\.js$/i,
          loader: 'string-replace-loader',
          options: {
            search: /\brequire(\.resolve\(['"])\.\/child\/index\b/,
            replace: '__non_webpack_require__$1./worker-child',
          },
        },
      ],
    },
    plugins: [
      newCopyPlugin([
        { from: 'node_modules/worker-farm/lib/child/index.js', to: 'vendor/worker-child.js', transform: minifyContent },
      ]),
    ],
  }),
  //
  webpackConfig('/micromatch', {
    entry: { 'vendor/micromatch': './node_modules/micromatch/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: { 'source-map': 'commonjs2 ./source-map' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]((micro|nano)match|braces|fill|expand|extglob|(to-)?regex|snapdragon|set-value|split)\b.*\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /\brequire\(['"]extend-shallow\b.*?\)/, replace: 'Object.assign' },
        },
        {
          test: /\bnode_modules[\\/](snapdragon-util|object-copy|to-object-path|is-number)\b.index\.js$/i,
          loader: 'string-replace-loader',
          options: { search: /\b(require\(['"])(kind-of\b.*?\))/, replace: '$1has-values/node_modules/$2' },
        },
      ],
    },
  }),
  webpackConfig('/enhanced-resolve', {
    entry: { 'lib/enhanced-resolve': './node_modules/enhanced-resolve/lib/node' },
    output: { libraryTarget: 'commonjs2' },
    externals: { 'graceful-fs': 'commonjs2 ../vendor/graceful-fs' },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]tapable\b.lib.HookCodeFactory\.js$/i,
          loader: 'string-replace-loader',
          options: {
            multiple: Array(3).fill({ search: /^(([ \t]*)(var |let )?(\w+) \+?= .*);\n\2\4 \+= /gm, replace: '$1 + ' }),
          },
        },
      ],
    },
  }),
  webpackConfig('/picomatch', {
    entry: { 'vendor/picomatch': './node_modules/picomatch/lib/picomatch' },
    output: { libraryTarget: 'commonjs2' },
  }),
  webpackConfig('/chokidar', {
    entry: { 'vendor/chokidar': './node_modules/chokidar/index' },
    output: { libraryTarget: 'commonjs2' },
    externals: { picomatch: 'commonjs2 ./picomatch', fsevents: 'fsevents' },
    resolve: {
      alias: { 'binary-extensions$': require.resolve('binary-extensions/binary-extensions.json') },
    },
  }),
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

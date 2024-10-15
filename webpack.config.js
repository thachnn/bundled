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
const generateLibsIndex = () => {
  const yarnDeps = require('./scripts/yarn-deps.json');
  return (
    'module.exports = {\n  __proto__: null,\n' +
    yarnDeps
      .map((p) => [p.replace(/^@[^/]*\//, ''), p])
      .map(([k, v]) => `  get ${/\W/.test(k) ? `'${k}'` : k}() { return require('${v}'); }`)
      .join(',\n') +
    '\n};'
  );
};

const usedRxjsFn = (
  'Observable observable Subject Subscription Subscriber pipe defer empty from fromEvent of EMPTY config ' +
  'concatMap filter map flatMap publish reduce share take takeUntil'
).replace(/\s+/g, '|');

const usedLodashFn = (
  'assign assignIn constant defaults filter flatten keys keysIn map memoize omit property set uniq extend clone eq ' +
  'find findIndex get hasIn identity isArguments isArray isArrayLike isBoolean isBuffer isFunction isLength isMap ' +
  'isNumber isObject isObjectLike isPlainObject isSet isString isSymbol isTypedArray last stubArray stubFalse noop ' +
  'sum toFinite toInteger toNumber toString'
).split(/\s+/);

//
module.exports = [
  webpackConfig('/libs', {
    entry: { 'lib/vendors': './node_modules/yarn/src/api' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      'os-tmpdir': ['os', 'tmpdir'],
      'string_decoder/': 'string_decoder',
      inherits: ['util', 'inherits'],
    },
    module: {
      rules: [
        {
          test: /\bnode_modules[\\/]yarn\b.src\b.api\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /[\s\S]*/, replace: generateLibsIndex },
        },
        {
          test: /\bnode_modules[\\/](request-capture-har|tough-cookie)\b.package\.json$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /[\s\S]*/, replace: (m) => `{ ${m.match(/^  "(name|version|desc\w+)":.*"/gm).join()} }` },
        },
        // Optimize dependencies
        {
          test: /\bnode_modules[\\/]rxjs\b._esm\d*.(operators\b.)?index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: new RegExp(`^export *{[^{}]*\\b(?!(${usedRxjsFn})\\b)\\w+ *}`, 'gm'), replace: '//$&' },
        },
        {
          test: /\bnode_modules[\\/]lodash\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            search: /[\s\S]*/,
            replace: `module.exports = {\n${usedLodashFn.map((f) => `  ${f}: require('./${f}')`).join(',\n')}\n};`,
          },
        },
        {
          test: /\bnode_modules[\\/]jsprim\b.lib.jsprim\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            search: /^(.*= *require\(['"](verror|json|util)\b|exports\.(?!(rfc|iso|is|has|for|st|end|parseD))\w+ *=)/gm,
            replace: '//$&',
          },
        },
        // Too old packages
        {
          test: /\bnode_modules[\\/](mz\b.fs|thenify\b.index)\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /^var Promise *= *require\(['"]any-promise\b/m, replace: '//$&' },
        },
        // Output optimization
        {
          test: /\bnode_modules[\\/]ssri\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            search: /^(module\.)?exports\.(?!(parse|stringify|from(Hex|Data)|integrityStream)\b)\w+ *=/gm,
            replace: '//$&',
          },
        },
        {
          test: /\bnode_modules[\\/]external-editor\b.main.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              {
                search: /^Object\.defineProperty\(exports\b/m,
                replace: (m) =>
                  m.replaceWithFile(/^/, 'tslib', (s) =>
                    s.match(/^([ \t]*)var extendStatics *=[\s\S]*?\n\1};$/m)[0].replace(/;(\s+__extends *=)/, ',$1')
                  ),
              },
              { search: /\b\w+Error_1\./g, replace: '' },
              {
                search: /^var (\w+Error)_1 *= *require\(['"]\.(\/errors\/\1)\b.*/gm,
                replace: (m, p1, p2) =>
                  m.replaceWithFile(/.*/, 'external-editor/main' + p2, (s) =>
                    s.match(new RegExp(`^var ${p1} *=.*{\\n[\\s\\S]*?\\n}.*`, 'm')).toString()
                  ),
              },
            ],
          },
        },
        {
          test: /\bnode_modules[\\/]tmp\b.lib.tmp\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /^(module\.)?exports\.(file|dir)\w* *=/gm, replace: '//$&' },
        },
      ],
    },
    resolve: {
      mainFields: ['es2015', 'module', 'main'],
      alias: {
        retry$: path.resolve(__dirname, 'node_modules/retry/lib/retry.js'),
        'node-emoji$': path.resolve(__dirname, 'node_modules/node-emoji/lib/emoji.js'),
        lodash$: path.resolve(__dirname, 'node_modules/lodash/index.js'),
        'cli-table3$': path.resolve(__dirname, 'node_modules/cli-table3/src/table.js'),
        'mime-db$': path.resolve(__dirname, 'node_modules/mime-db/db.json'),
        'colors/safe$': path.resolve(__dirname, 'node_modules/colors/lib/colors.js'),
        'http-signature$': path.resolve(__dirname, 'node_modules/http-signature/lib/signer.js'),
      },
    },
    stats: { modulesSort: 'index' },
    optimization: {
      moduleIds: 'named',
      minimizer: [newTerserPlugin({ terserOptions: { output: { ascii_only: false, ecma: 2015 } } })],
    },
    plugins: [
      newCopyPlugin([
        { from: '{LICENSE*,README*,bin/!(*.js)}', context: 'node_modules/yarn' },
        {
          from: 'node_modules/yarn/package.json',
          transform(content) {
            const pkg = JSON.parse(String(content).replace(/^\s+"(babel-runtime|imports-loader)":.*/gm, ''));
            pkg.devDependencies = pkg.dependencies;
            ['dependencies', 'jest', 'resolutions', 'config'].forEach((k) => delete pkg[k]);

            Object.assign(pkg, { installationMethod: 'tar', scripts: { preinstall: 'node ./preinstall.js' } });
            return (pkg.version += '-0'), JSON.stringify(pkg, null, 2) + '\n';
          },
        },
        { from: 'preinstall.js', context: 'node_modules/yarn/scripts', transform: minifyContent },
        {
          from: 'node_modules/yarn/bin/*.js',
          to: 'bin/[name].js',
          transform: (s) => minifyContent(String(s).replace(/__dirname *\+ *('|")\//g, '$1')),
        },
        { from: 'node_modules/v8-compile-cache/v8-compile-cache.js', to: 'lib/', transform: minifyContent },
      ]),
      // __wpreq__
      /*new ReplaceCodePlugin({
        search: /(^\/\*{3}\/ |\b__webpack_require__\(.*?)"\.\/node_modules\/([^\n"]+)/gm,
        replace: (_, p1, p2) =>
          p1 + '"' + p2.replace(/(\/index\.js(on)?|\.js)$/, '').replace(/^([\w.-]+)\/(lib\/)?(?!request$)\1$/, '$1'),
      }),*/
    ],
  }),
];

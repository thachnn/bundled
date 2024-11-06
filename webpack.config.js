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
  const defaults = {
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
  };
  config = mergeDeep(defaults, config);

  config.optimization.minimizer.length > 1 && config.optimization.minimizer.shift();
  return config;
};

const newTerserPlugin = (opts = {}) => {
  const defaults = {
    cache: true,
    extractComments: { condition: /(^|\n)[\s*]*@(preserve|lic(ense)?|cc_on)\b|^\**\s*!\s*\S/i, banner: false },
    // parallel: true,
    terserOptions: mergeDeep({ output: { comments: /^\s*\d+\s*$/ } }, baseTerserOpts),
  };
  return new TerserPlugin(mergeDeep(defaults, opts));
};

const minifyContent = (content, opts = null) =>
  minify(String(content), mergeDeep({}, baseTerserOpts, typeof opts == 'object' ? opts : null)).code;

/** @param {(Array.<(ObjectPattern|string)>|ObjectPattern)} patterns */
const newCopyPlugin = (patterns) => new CopyPlugin([].concat(patterns));

// Helpers

Object.defineProperty(String.prototype, 'replaceBulk', {
  value: /** @param {...Array.<(string|RegExp)>} _args */ function (_args) {
    return Array.prototype.slice.call(arguments).reduce((s, i) => s.replace(i[0], i[1]), this);
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
      .map((v, k) => `  get ${/\W/.test((k = v.replace(/^@[^/]*\//, ''))) ? `'${k}'` : k}() { return require('${v}') }`)
      .join(',\n') +
    '\n};\nObject.defineProperty(module.exports, "__wpreq__", {value: __webpack_require__});'
  );
};

//
module.exports = [
  webpackConfig('/libs', {
    entry: { 'lib/vendors': './node_modules/yarn/src/api' },
    output: { libraryTarget: 'commonjs2' },
    externals: {
      'os-tmpdir': ['os', 'tmpdir'],
      'lodash.clone': 'var __webpack_require__("./node_modules/lodash/index.js").clone',
      'lodash.toarray': 'var __webpack_require__("./node_modules/lodash/index.js").toArray',
      inherits: ['util', 'inherits'],
      'path-parse': ['path', 'parse'],
      'rxjs/operators': 'var __webpack_require__("./node_modules/rxjs/index.js").operators',
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
        {
          test: /\bnode_modules[\\/]currently-unhandled\b.core\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /\brequire\(['"]array-find-index['"]\)/, replace: 'Function.call.bind([].findIndex)' },
        },
        {
          test: /\bnode_modules[\\/](cli-table3|query-string)\b.*\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /\brequire\(['"]object-assign['"]\)/, replace: 'Object.assign' },
        },
        {
          test: /\bnode_modules[\\/]readable-stream\b.lib\b.*\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              { search: /^(var (\w+) *=).*['"]core-util-is\b.*\n\2\.inherits *=.*/m, replace: "$1 require('util');" },
              { search: /\b(internal|debug)Util\b(?! *=)/g, replace: 'util' },
              { search: /\brequire\(['"]process-nextick-args\b.*?\)/, replace: 'process' },
              { search: /=\s*Object\.keys\s*\|\|/, replace: '$& null &&' },
              { search: /\b(require)\([^()]*\/stream\b.*?\)/, replace: "$1('stream')" },
            ],
          },
        },
        {
          test: /\bnode_modules[\\/]fill-range\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /\brequire\(['"](\w+)-string['"]\)/, replace: 'Function.call.bind(String.prototype.$1)' },
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
                  m.replaceWithFile(/^/, 'tslib/tslib.es6', (s) =>
                    s.replace(/^[\s\S]*\n(var extendStatics *=[\s\S]*?\n)export +([\s\S]*?\n};?)[\s\S]*/, '$1$2\n')
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
        /*{
          test: /\bnode_modules[\\/]mime-types\b.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /^exports\.(charsets?|contentType|extension) *=/gm, replace: '//$&' },
        },*/
        {
          test: /\bnode_modules[\\/]har-validator\b.lib.promise\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              {
                search: /^exports\.(\w+) *=\s*function ?\(data\) *{\s*return validate\(('|")\1\2, *data\);?\s*};?\n+/gm,
                replace: '',
              },
              {
                search: /$/,
                replace: 'Object.keys(schemas).forEach(name => {\n  exports[name] = data => validate(name, data)\n})\n',
              },
            ],
          },
        },
        {
          test: /\bnode_modules[\\/]har-schema\b.lib.index\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: { search: /^[ \t]*(?!(request|cookie|header|query|postData)\b)\w+: *require\b/gm, replace: '//$&' },
        },
        {
          test: /\bnode_modules[\\/]sshpk\b.lib.((private-)?key|formats.dnssec)\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            multiple: [
              { search: /= *(require\(['"]\.+\/dhe\b.*?\)|Key\.prototype\.createDiff\w+)/gm, replace: '= {}' },
              { search: /^(PrivateKey\.generate|Key\.\w+\.createDiff\w+) *=.*{\n[\s\S]*?\n};?$/m, replace: '/*$&*/' },
            ],
          },
        },
        {
          test: /\bnode_modules[\\/]http-signature\b.lib.(signer|utils)\.js$/i,
          loader: 'webpack/lib/replace-loader',
          options: {
            search:
              /^([ \t]*)(((is|create)Signer|(sshKey|finger|pemTo)\w+) *:|RequestSigner(\.\w+)+ *=).*{\n[\s\S]*?\n\1}[,;]?$/gm,
            replace: '/*$&*/',
          },
        },
      ],
    },
    resolve: {
      alias: {
        retry$: path.resolve(__dirname, 'node_modules/retry/lib/retry.js'),
        'node-emoji$': path.resolve(__dirname, 'node_modules/node-emoji/lib/emoji.js'),
        lodash$: path.resolve(__dirname, 'node_modules/lodash/index.js'),
        'cli-table3$': path.resolve(__dirname, 'node_modules/cli-table3/src/table.js'),
        'colors/safe$': path.resolve(__dirname, 'node_modules/colors/lib/colors.js'),
        'mime-db$': path.resolve(__dirname, 'node_modules/mime-db/db.json'),
        'http-signature$': path.resolve(__dirname, 'node_modules/http-signature/lib/signer.js'),
        //
        debug$: path.resolve(__dirname, 'node_modules/debug/src/node.js'),
        uuid$: path.resolve(__dirname, 'node_modules/uuid/v4.js'),
        resolve$: path.resolve(__dirname, 'node_modules/resolve/lib/sync.js'),
        sshpk$: path.resolve(__dirname, 'node_modules/sshpk/lib/private-key.js'),
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
        { from: 'node_modules/webpack-cli/vendor/v8-compile-cache.js', to: 'lib/' },
      ]),
      // Reduce the bundled size
      new ReplaceCodePlugin({
        search: /(^\/\*{3}\/ |\b__webpack_require__ *\(.*?)"\.\/node_modules\/([^\n"]+)/gm,
        replace: (_, p1, p2) => p1 + '"' + shortenModIds(p2),
      }),
      //new ReplaceCodePlugin({ search: /^(\/\*{3}\/ \()function ?(\(module\b.*?\))/gm, replace: '$1$2 =>' }),
      new ReplaceCodePlugin({ search: /\b__webpack_require__\b/g, replace: '__wpreq__' }),
    ],
  }),
];

function shortenModIds(p) {
  const alias = { 'node-emoji': 'lib/emoji.js', 'cli-table3': 'src/table.js', 'mime-db': 'db.json' };
  if (p === 'yarn/src/api.js') return 0;

  let m = p.match(/^(.*\bnode_modules\/)?(@[^/]*\/)?[^/]+/)[0];
  return (alias[m] ? `/${m}/${alias[m]}` : require.resolve(m).replace(/\\/g, '/')).endsWith('/' + p)
    ? m // .replace(/string_decoder$/, '$&/')
    : p.replaceBulk([/\/_esm\d*\b/, ''], [/(\/index\.js(on)?|\.js)$/, ''], [/^([^/]+)\/(lib\/)?(?!request$)\1$/, '$1']);
}

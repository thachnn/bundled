'use strict';

const { statSync } = require('fs');
const { dirname, resolve, sep } = require('path');

// prettier-ignore
function _try(cb) { try { return cb(); } catch (_) {} }
let minify = _try(() => require('terser').minify) || require('./scripts/decomment');

/**
 * @typedef {import('terser').MinifyOptions} MinifyOptions
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @typedef {import('rollup').Plugin} RollupPlugin
 * @typedef {{search: (string|RegExp), replace: (string|Function)}} TransformPattern
 * @typedef {(TransformPattern|TransformPattern[])} TransformPatterns
 */

const mergeDeep = require('./scripts/mergeDeep');
const baseTerserOpts = require('./scripts/terser.config.json');

/**
 * @param {(MinifyOptions|{transform?: TransformPatterns})} [options]
 * @returns {RollupPlugin}
 */
const terserPlugin = (options = {}) => ({
  name: 'terser',
  renderChunk(code, chunk, outputOpts) {
    let opts = { sourceMap: !!outputOpts.sourcemap };

    outputOpts.format !== 'es' || (opts.module = true);
    // outputOpts.format !== 'cjs' || (opts.toplevel = true);

    opts = mergeDeep(baseTerserOpts, opts, options);
    if (opts.transform) code = replaceBulk(code, opts.transform);

    return minify(code, (delete opts.transform, opts));
  },
});

const fileExists = (p) => _try(() => statSync(p).isFile());

/** @returns {RollupPlugin} */
const nodeResolve = () => ({
  name: 'node-resolve',
  resolveId(source, importer) {
    if (/\0/.test(source) || !importer) return null;

    let p;
    return source[0] === '.'
      ? [(p = resolve(dirname(importer), source)), p + '.js', p + sep + 'index.js'].find(fileExists) || null
      : (p = source.match(/[\\/]/g)) && (source[0] !== '@' || p.length > 1)
      ? require.resolve(source)
      : // prettier-ignore
        resolve(dirname(require.resolve((source += '/package.json'))), (p = require(source)).module || p.main || 'index.js');
  },
});

/**
 * @param {string} name
 * @param {RollupOptions} config
 * @returns {(RollupOptions|{name?: string})}
 */
const buildConfig = (name, config) => {
  config = {
    name,
    output: { format: 'cjs', interop: false },
    plugins: [nodeResolve(), terserPlugin()],
  }.mergeDeep(config);

  config.plugins = Object.values(config.plugins.reduce((o, p) => ((o[p.name] = p), o), {}));
  return config;
};

/** @param {Object.<string, *>} [args] */
module.exports = (args = {}) => {
  args.noMinify === undefined || (minify = (code) => code);
  const names = new Set(typeof args.configName == 'string' ? args.configName.split(',') : []);

  const set = names.size > 0 ? configSet.filter((cfg) => names.has(cfg.name)) : configSet;
  set.forEach((cfg) => delete cfg.name);

  return set;
};

// Execute replacement
function replaceBulk(str, arr) {
  return [].concat(arr).reduce((s, o) => s.replace(o.search, o.replace), str);
}

/**
 * @param {{name?: string, test: RegExp, patterns?: TransformPatterns}} [opts]
 * @returns {RollupPlugin}
 */
const transformCode = (opts = {}) => ({
  name: opts.name || 'transform-code',
  transform: (code, id) => (opts.patterns && opts.test.test(id) ? replaceBulk(code, opts.patterns) : null),
});

/**
 * @param {{test?: RegExp, transform?: TransformPatterns}} [opts]
 * @returns {RollupPlugin}
 */
const commonJS = (opts = {}) =>
  transformCode({
    name: 'commonjs',
    test: opts.test || /\.js$/i,
    patterns: [].concat(opts.transform || [], [
      { search: /^[^\S\r\n]*(module\.exports|exports\[['"]default['"]])\s*=/m, replace: 'export default ' },
      {
        search: /\b((?:(?:module\.)?exports\.[\w$]+\s*=\s*)+)(([\w$]+) *;?$|function +([\w$]+) *\()/gm,
        // prettier-ignore
        replace: (_, p1, p2, p3, p4) =>
          `export { ${p1.match(/(?<=\.)[\w$]+(?=\s*=)/g).map((k) => `${p3 || p4} as ${k}`).join(', ')} };\n${p4 ? p2 : ''}`,
      },
      {
        search: /\b((?:(?:module\.)?exports\.[\w$]+\s*=\s*)+)require *\( *(['"][^'"]+['"]) *\)(\s*\.([\w$]+))? *;?$/gm,
        // prettier-ignore
        replace: (_, p1, p2, p3, p4) =>
          `export { ${p1.match(/(?<=\.)[\w$]+(?=\s*=)/g).map((k) => `${p4 || 'default'} as ${k}`).join(', ')} } from ${p2}`,
      },
      {
        search:
          /(?<!{\s*)\b(?:const|let|var)\s+([\w$]+|{(?:[^{}]|{[^{}]+})+})\s*=\s*require *\( *(['"][^'"]+['"]) *\)(\s*\.([\w$]+))? *;?$/gm,
        replace: (_, p1, p2, p3, p4) => `import ${(p3 ? `{${p4}: ${p1}}` : p1).replace(/\s*:\s*/g, ' as ')} from ${p2}`,
      },
      { search: /^[^\S\r\n]*require *\( *(['"][^'"]+['"]) *\) *;?$/gm, replace: 'import $1' },
    ]),
  });

const wasmBuildPlugins = [
  transformCode({
    test: /\bnode_modules[\\/]@webassemblyjs\b.*\.js$/i,
    patterns: [
      { search: /^(import )(\w+ from ['"]@\w+\/helper-wasm-bytecode)\b/m, replace: '$1* as $2' },
      { search: /(?<!\bfunction )\b_(typeof\()/g, replace: '$1' },
      { search: /\b_extends(\([^)])/g, replace: 'Object.assign$1' },
      { search: /\b_slicedToArray\(([^,]+), \d+\)/g, replace: '$1' },
      { search: /(?<!\bfunction )\b_toConsumableArray\(/g, replace: '(' },
      { search: /\) \|\| ['"]unknown['"](\)\);)/g, replace: ')$1' },
    ],
  }),
  terserPlugin({
    transform: [
      { search: /(?<!\bfunction )\b_(createClass|classCallCheck)\$\d+\(/g, replace: '_$1(' },
      { search: /\b(require\(['"])@xtuc\//, replace: '$1./' },
      { search: /\b(require\(['"])@webassemblyjs\/(wasm-)?/g, replace: '$1./wasm-' },
    ],
  }),
];

//
const configSet = [
  buildConfig('terser', {
    input: 'node_modules/terser/main.js',
    output: { file: 'dist/vendor/terser.js', esModule: false },
    external: 'source-map',
  }),
  //
  buildConfig('long', {
    input: 'node_modules/@xtuc/long/src/long.js',
    output: { file: 'dist/vendor/long.js', strict: false },
    plugins: [commonJS()],
  }),
  buildConfig('wasm-ast', {
    input: 'node_modules/@webassemblyjs/ast/esm/index.js',
    output: { file: 'dist/vendor/wasm-ast.js' },
    external: '@xtuc/long',
    plugins: wasmBuildPlugins,
  }),
  buildConfig('wasm-parser', {
    input: 'node_modules/@webassemblyjs/wasm-parser/esm/index.js',
    output: { file: 'dist/vendor/wasm-parser.js' },
    external: ['@xtuc/long', '@webassemblyjs/ast'],
    plugins: wasmBuildPlugins,
  }),
  buildConfig('wasm-edit', {
    input: 'node_modules/@webassemblyjs/wasm-edit/esm/index.js',
    output: { file: 'dist/vendor/wasm-edit.js' },
    external: ['@xtuc/long', '@webassemblyjs/ast', '@webassemblyjs/wasm-parser'],
    plugins: wasmBuildPlugins,
  }),
  //
  buildConfig('schema-utils', {
    input: 'node_modules/schema-utils/src/validateOptions.js',
    output: { file: 'dist/lib/schema-utils.js' },
    external: ['fs', 'path', 'ajv', 'ajv-keywords'],
    plugins: [
      commonJS(),
      terserPlugin({ transform: { search: /\b(require\(['"])(ajv)\b/g, replace: '$1../vendor/$2' } }),
    ],
  }),
  buildConfig('replace-loader', {
    input: 'node_modules/string-replace-loader/lib/processChunk.js',
    output: { file: 'dist/lib/replace-loader.js', strict: false },
    external: ['loader-utils', 'schema-utils'],
    plugins: [
      commonJS(),
      terserPlugin({ transform: { search: /\b(require\(['"])(loader|schema)-/g, replace: '$1./$2-' } }),
    ],
  }),
  buildConfig('graceful-fs', {
    input: 'node_modules/graceful-fs/graceful-fs.js',
    output: { file: 'dist/vendor/graceful-fs.js' },
    external: ['fs', 'constants', 'stream', 'util', 'assert'],
    plugins: [
      commonJS({ transform: { search: /(\.exports *= *)(patch);?\n+(function) +\2\b/, replace: '$1$3 polyfills' } }),
    ],
  }),
  buildConfig('tapable', {
    input: 'node_modules/tapable/lib/index.js',
    output: { file: 'dist/lib/tapable.js', esModule: false },
    external: 'util',
    plugins: [
      commonJS({ transform: { search: /^[ \t]*exports\.(__esModule *=)/gm, replace: 'export const $1' } }),
      transformCode({
        test: /\bnode_modules[\\/]tapable\b.lib.(HookCodeFactory|\w+(Waterfall|ParallelBail)Hook)\.js$/i,
        patterns: Array(5).fill(
          { search: /^(([ \t]*)(?:(var|let) +)?(\w+) *\+?= *(.|\n\2[ \t})])*);\n\2\4 *\+=/gm, replace: '$1 +' } //
        ),
      }),
    ],
  }),
  buildConfig('enhanced-resolve', {
    input: 'node_modules/enhanced-resolve/lib/node.js',
    output: { file: 'dist/lib/enhanced-resolve.js', esModule: false },
    external: ['util', 'path', 'graceful-fs', 'tapable'],
    plugins: [
      transformCode({
        test: /\bnode_modules[\\/]enhanced-resolve\b.lib.SymlinkPlugin\.js$/i,
        patterns: {
          search: /^[ \t]*(const|var) +(\w+)\s*=\s*require *\( *(['"]\.\/forEachBail['"]) *\)(?!\s*\.)/m,
          replace: 'import * as $2 from $3',
        },
      }),
      commonJS({
        transform: [
          { search: /^[ \t]*(module\.)?exports\.([\w$]+)\s*=\s*(function) *\(/gm, replace: 'export $3 $2(' },
          {
            search:
              /^[ \t]*(const|var) +(\w+)\s*=\s*require *\( *(['"]\.\/(ResolverFactory|concord|DescriptionFileUtils)['"]) *\)(?!\s*\.)/gm,
            replace: 'import * as $2 from $3',
          },
          {
            search: /^[ \t]*(?:module\.)?exports\.(\w+)\.(\w+)\s*=\s*(function +(\w+) *\()/gm,
            replace: 'export { $4 as $1$$$2 };\n$3',
          },
          { search: /\b(require\(['"]tapable)\/lib\/(\w+)(['"]\))/g, replace: '$1$3.$2' },
        ],
      }),
    ],
  }),
  //
  buildConfig('assert', {
    input: 'node_modules/assert/assert.js',
    output: { file: 'dist/web_modules/assert.js' },
    external: 'util/',
    plugins: [commonJS(), terserPlugin({ transform: { search: /\b(require\(['"])(util)\//, replace: '$1./$2' } })],
  }),
  buildConfig('querystring', {
    input: 'node_modules/querystring-es3/index.js',
    output: { file: 'dist/web_modules/querystring-es3.js', esModule: false },
    plugins: [commonJS()],
  }),
  /*
  buildConfig('util', {
    input: 'node_modules/util/util.js',
    output: { file: 'dist/web_modules/util.js', esModule: false, strict: false },
    plugins: [
      commonJS({
        transform: [
          { search: /\brequire\(['"]\.\/support\/isBuffer\b/, replace: '$&Browser' },
          {
            search: /^([ \t]+module\.exports) *= *(function (inherits))\b([\s\S]*?\n)\1 *= *\2\b([\s\S]*?\n})$/m,
            replace: ' $3B = $2$4 $3B = $2$5\n var $3B;\n$1 = $3B;',
          },
          {
            search: /^([ \t]+module\.exports) *= *(util\.(inherits)\b.*)(\n\}.*\{\n)\1 *= *(require\b.*)(\n})$/m,
            replace: '$4 util = { $3: $3B };$6\n var $3B = $5\n$1 = $2',
          },
        ],
      }),
    ],
  }),
  */
  buildConfig('url', {
    input: 'node_modules/url/url.js',
    output: { file: 'dist/web_modules/url.js', esModule: false },
    external: ['punycode', 'querystring'],
    plugins: [
      commonJS({ transform: { search: /,(\s*)(\w+ *= *require\(['"].*;)$/gm, replace: ';\n$1var $2' } }),
      terserPlugin({
        transform: { search: /\b(require\(['"])((p)|q\w+)/g, replace: (_, r, q, p) => `${r}./${p || q + '-es3'}` },
      }),
    ],
  }),
];

'use strict';

const { statSync } = require('fs');
const { dirname, resolve, sep } = require('path');

const noTerser = ((r) => !fileExists(resolve(r)) && r)('node_modules/terser/' + require('terser/package.json').main);
let minify = !noTerser ? require('terser').minify : require('./scripts/decomment');

// prettier-ignore
function fileExists(p) { try { return statSync(p).isFile(); } catch (_) {} }

/**
 * @typedef {import('terser').MinifyOptions} MinifyOptions
 * @typedef {import('rollup').RollupOptions} RollupOptions
 * @typedef {import('rollup').Plugin} RollupPlugin
 * @typedef {{search: (string|RegExp), replace: (string|Function)}} TransformPattern
 * @typedef {(TransformPattern|TransformPattern[])} TransformPatterns
 */

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

    opts = Object.assign(opts, baseTerserOpts, options);
    !opts.transform || (code = replaceBulk(code, opts.transform));

    return minify(code, (delete opts.transform, opts));
  },
});

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
      : resolve(dirname(require.resolve((source += '/package.json'))), (p = require(source)).module || p.main);
  },
});

/**
 * @param {string} name
 * @param {RollupOptions} config
 * @returns {(RollupOptions|{name?: string})}
 */
const buildConfig = (name, config) =>
  Object.assign(config, {
    name,
    output: Object.assign({ format: 'cjs', interop: false }, config.output),
    plugins: Object.values(
      [nodeResolve(), terserPlugin()].concat(config.plugins || []).reduce((o, p) => ((o[p.name] = p), o), {})
    ),
  });

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
  return (Array.isArray(arr) ? arr : [arr]).reduce((s, o) => s.replace(o.search, o.replace), str);
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
      { search: /^[^\S\r\n]*(module\.exports|exports\[['"]default['"]\])\s*=/m, replace: 'export default ' },
      {
        search: /\b(?:module\.)?exports\.([\w$]+)\s*=\s*(([\w$]+)\s*;?$|function\s+([\w$]+)\s*\()/gm,
        replace: (_, p1, p2, p3, p4) => `export { ${p3 || p4} as ${p1} }; ${p4 ? p2 : ''}`,
      },
      {
        search: /\b(?:const|let|var)\s+([\w$]+|\{[^{}]+\})\s*=\s*require\s*\(\s*(['"][^'"]+['"])\s*\)\s*;?$/gm,
        replace: (_, p1, p2) => `import ${p1.replace(/\s*:\s*/g, ' as ')} from ${p2}`,
      },
      { search: /^[^\S\r\n]*require\s*\(\s*(['"][^'"]+['"])\s*\)\s*;?$/gm, replace: 'import $1' },
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
    output: { file: noTerser || 'dist/vendor/terser.js', esModule: false },
    external: 'source-map',
    plugins: [
      terserPlugin({
        transform: { search: /\b(require\(['"])(source-map)\b/, replace: '$1./$2' },
      }),
    ].filter(() => !noTerser),
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
      commonJS({ transform: { search: /\b(exports *= *)(patch);?\n+(function) +\2\b/, replace: '$1$3 polyfills' } }),
    ],
  }),
];

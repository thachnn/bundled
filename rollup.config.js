'use strict';

const { existsSync } = require('fs');
const { dirname, resolve } = require('path');

const noTerser = ((r) => !existsSync(resolve(r)) && r)('node_modules/terser/' + require('terser/package.json').main);
let minify = !noTerser ? require('terser').minify : require('./scripts/decomment');

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
    if (!source || /\bnode_modules[\\/]/i.test(source)) return null;

    if (source[0] === '.')
      return importer && existsSync((source = resolve(dirname(importer), source, 'index.js'))) ? source : null;

    return import((source += '/package.json')).then(
      (pkg) => resolve(dirname(require.resolve(source)), (pkg = pkg.default || pkg).module || pkg.main),
      (err) => (console.warn(String(err)), null)
    );
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
 * @param {{test: RegExp, patterns?: TransformPatterns}} [opts]
 * @returns {RollupPlugin}
 */
const transformCode = (opts = {}) => ({
  name: 'transform-code',
  transform: (code, id) => (opts.patterns && opts.test.test(id) ? replaceBulk(code, opts.patterns) : null),
});

const wasmBuildPlugins = [
  transformCode({
    test: /\bnode_modules[\\/]@webassemblyjs\b.[\w-]+\b.esm\b.*\.js$/i,
    patterns: [
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
];

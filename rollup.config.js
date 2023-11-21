const { existsSync } = require('fs');
const { dirname, resolve } = require('path');
let minify;
try {
  minify = require('terser').minify;
} catch (_) {
  minify = require('./scripts/decomment');
}

/**
 * @typedef {import('terser').MinifyOptions} MinifyOptions
 * @typedef {import('rollup').RollupOptions} RollupOptions
 */

const baseTerserOpts = require('./scripts/terser.config.json');

/** @param {MinifyOptions} [options] */
const terserPlugin = (options = {}) => ({
  name: 'terser',
  renderChunk(code, chunk, outputOpts) {
    const opts = { sourceMap: !!outputOpts.sourcemap };

    outputOpts.format !== 'es' || (opts.module = true);
    outputOpts.format !== 'cjs' || (opts.toplevel = true);

    return minify(code, Object.assign(opts, baseTerserOpts, options));
  },
});

const nodeResolve = () => ({
  name: 'node-resolve',
  resolveId(source, importer) {
    if (!source) return null;
    if (source[0] === '.') return existsSync((source = resolve(dirname(importer), source, 'index.js'))) ? source : null;

    source = resolve('node_modules', source, 'package.json');
    return !existsSync(source) ? null : import(source).then((pkg) => resolve(dirname(source), pkg.module || pkg.main));
  },
});

/**
 * @param {string} name
 * @param {RollupOptions} config
 * @returns {RollupOptions}
 */
const buildConfig = (name, config) =>
  Object.assign(config, {
    name,
    output: Object.assign({ format: 'cjs', interop: false }, config.output),
    plugins: Object.values(
      [nodeResolve(), { name: 'transform-code' }, { name: 'replace-code' }, terserPlugin()]
        .concat(config.plugins || [])
        .reduce((o, p) => ((o[p.name] = p), o), {})
    ),
  });

export default (args) => {
  const names = new Set(typeof args.configName == 'string' ? args.configName.split(',') : []);

  const set = names.size > 0 ? configSet.filter((cfg) => names.has(cfg.name)) : configSet;
  set.forEach((cfg) => delete cfg.name);

  return set;
};

// Execute replacement
const replaceBulk = (str, arr) =>
  (Array.isArray(arr) ? arr : [arr]).reduce((s, o) => s.replace(o.search, o.replace), str);

const transformCode = (options = {}) => ({
  name: 'transform-code',
  transform: (code, id) => (options.patterns && options.test.test(id) ? replaceBulk(code, options.patterns) : null),
});

const replaceCode = (options = {}) => ({
  name: 'replace-code',
  renderChunk: (code) => (options.patterns ? replaceBulk(code, options.patterns) : null),
});

//
const configSet = [
  buildConfig('terser', {
    input: 'node_modules/terser-es/main.js',
    output: { file: 'dist/vendor/terser.js', esModule: false },
    external: 'source-map',
  }),
  //
  buildConfig('long', {
    input: 'node_modules/@xtuc/long/src/long.js',
    output: { file: 'dist/vendor/long.js' },
  }),
  buildConfig('wasm-ast', {
    input: 'node_modules/@webassemblyjs/ast/esm/index.js',
    output: { file: 'dist/vendor/wasm-ast.js' },
  }),
  buildConfig('wasm-parser', {
    input: 'node_modules/@webassemblyjs/wasm-parser/esm/index.js',
    output: { file: 'dist/vendor/wasm-parser.js' },
    external: '@webassemblyjs/ast',
  }),
  buildConfig('wasm-edit', {
    input: 'node_modules/@webassemblyjs/wasm-edit/esm/index.js',
    output: { file: 'dist/vendor/wasm-edit.js' },
    external: ['@webassemblyjs/ast', '@webassemblyjs/wasm-parser'],
  }),
];

'use strict';

const { statSync } = require('fs');
const { dirname, resolve, sep } = require('path');

let { minify } = require('terser');

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

// prettier-ignore
const fileExists = (p) => { try { return statSync(p).isFile(); } catch (_) {} };

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

//
const configSet = [
  /*
  buildConfig('long', {
    input: 'node_modules/@xtuc/long/src/long.js',
    output: { file: 'dist/vendor/long.js', strict: false },
    plugins: [commonJS()],
  }),
  */
];

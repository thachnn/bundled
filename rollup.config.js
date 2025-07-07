'use strict';

const { statSync } = require('fs');
const { dirname, resolve, sep } = require('path');

let { minify } = require('webpack/vendor/terser');
const flowRemoveTypes = require('flow-remove-types');

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
    let opts = { sourceMap: !!outputOpts.sourcemap, output: { ecma: 2015 } };

    outputOpts.format !== 'es' || (opts.module = true);
    // outputOpts.format !== 'cjs' || (opts.toplevel = true);

    opts = mergeDeep({}, baseTerserOpts, opts, options);
    if (opts.transform) code = replaceBulk(code, opts.transform);

    return minify(code, (delete opts.transform, opts));
  },
});

// prettier-ignore
const fileExists = (p) => { try { return statSync(p).isFile(); } catch (_) {} };

/** @returns {RollupPlugin} */
const nodeResolve = (exts = ['.js', '.json']) => ({
  name: 'node-resolve',
  resolveId(source, importer) {
    if (/\0/.test(source) || !importer) return null;

    let p, o;
    return source[0] === '.'
      ? [(p = resolve(dirname(importer), source))]
          .concat(exts.concat(exts.map((e) => sep + 'index' + e)).map((e) => p + e))
          .find(fileExists) || null
      : (o = { paths: [importer] }) && (p = source.match(/[\\/]/g)) && (source[0] !== '@' || p.length > 1)
      ? require.resolve(source, o)
      : resolve(
          dirname((p = require.resolve(source + '/package.json', o))),
          (p = require(p)).module || ((o = p.exports) && findImport(o['.'] || o)) || p.main || 'index.js'
        );
  },
  load: (id) => (console.log(id), null),
});

const findImport = (o) => {
  if (o == null || typeof o != 'object') return o;
  if (!Array.isArray(o)) return findImport(o.import || o.node || o.require || o.default);

  for (let v of o) if ((v = findImport(v))) return v;
  return null;
};

/**
 * @param {string} name
 * @param {RollupOptions} config
 * @returns {(RollupOptions|{name?: string})}
 */
const buildConfig = (name, config) => {
  const defaults = {
    name,
    output: { format: 'cjs', interop: false },
    plugins: [nodeResolve(), terserPlugin()],
  };
  config = mergeDeep(defaults, config);

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

/** @returns {RollupPlugin} */
const packageJson = (opts = {}) =>
  transformCode({
    name: 'json',
    test: opts.test || /\bpackage\.json$/i,
    patterns: [].concat(opts.transform || [], [
      {
        search: /[\s\S]*/,
        replace(o) {
          const ks = Object.keys((o = JSON.parse(o))).filter((k) => !/\W/.test(k));
          // prettier-ignore
          return ks.map((k) => `export const ${k} = ${JSON.stringify(o[k])};\n`).join('') + `export default { ${ks.join()} }`;
        },
      },
    ]),
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

/** @returns {RollupPlugin} */
const flowPlugin = ({ name, test, transform, ...opts } = {}) =>
  transformCode({
    name: name || 'flow-remove-types',
    test: test || /\.js$/i,
    patterns: [].concat(transform || [], [
      { search: /[\s\S]*/, replace: (m) => flowRemoveTypes(m, Object.assign({ pretty: true }, opts)).toString() },
      { search: /^(\s*import\b[^,'"]*)(,\s*{\s*})+/gm, replace: '$1' },
      {
        search: /(?<!{\s*)\bconst\s+([\w$]+|{[^{}]+})\s*=\s*require *\( *(['"][^'"]+['"]) *\)(\s*\.([\w$]+))? *;?$/gm,
        replace: (_, p1, p2, p3, p4) => `import ${(p3 ? `{${p4}: ${p1}}` : p1).replace(/\s*:\s*/g, ' as ')} from ${p2}`,
      },
      { search: /^[^\S\n]*exports\.([\w$]+\s*=)/gm, replace: 'export const $1' },
    ]),
  });

//
const configSet = [
  /*
  buildConfig('long', {
    input: 'node_modules/@xtuc/long/src/long.js',
    output: { file: 'dist/vendor/long.js', strict: false },
    plugins: [packageJson(), commonJS()],
  }),
  */
];

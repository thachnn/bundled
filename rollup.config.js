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

const yarnDeps = require('./scripts/yarn-deps.json');

//
const configSet = [
  buildConfig('lockfile', {
    input: 'node_modules/yarn/src/lockfile/index.js',
    output: { file: 'dist/lib/lockfile.js', esModule: false },
    external: ['path', 'util', 'os', 'fs', 'buffer', 'crypto', 'stream'],
    plugins: [
      transformCode({
        name: 'unused-constants',
        test: /\byarn[\\/]src\b.constants\.js$/i,
        patterns: [
          { search: /^(const ([\w$]+|{[^{}]+})\s*=\s*require\b|export const \w+\s*=\s*[A-Za-z])/gm, replace: '//$&' },
        ],
      }),
      transformCode({
        name: 'unused-fs',
        test: /\byarn[\\/]src\b.util\b.fs\.js$/i,
        patterns: [
          { search: /^(import (glob|Block|{\s*copy)|export (const (?!exists)\w+.*;$|{\s*unlink))/gm, replace: '//$&' },
        ],
      }),
      flowPlugin({
        ignoreUninitializedFields: true,
        test: /\byarn[\\/].*\.js$/i,
        transform: [
          { search: /^const \w+\s*=\s*require\(['"]camelcase\b/m, replace: '//$&' },
          { search: /^const (\w+)\s*=\s*require\((['"]ssri['"])\)/m, replace: 'import * as $1 from $2' },
          { search: /\brequire\(['"]js-yaml\b/, replace: '$&/lib/js-yaml/loader' },
        ],
      }),
      packageJson(),
      commonJS({
        test: /\b(invariant|strip-bom|ssri|js-yaml)[\\/].*\.js$/i,
        transform: [
          { search: /^(  )(match|pickAlgorithm)\b.*{\n+(\1\1.*\n+)*\1}/gm, replace: '/*$&*/' },
          {
            search: /^var (\w+)\s*=\s*(require\(['"](\.\/schema)\/default_)safe\b.*(\nvar \w+\s*=\s*)\2full\b.*/m,
            replace: "import $1 from '$3/failsafe';$4$1;\nexport { $1 as FAILSAFE_SCHEMA };",
          },
          { search: /^var (\w+)\s*=\s*require\((['"]\.+\/common['"])\)/m, replace: 'import * as $1 from $2' },
        ],
      }),
    ],
  }),
  //
  buildConfig('cli', {
    input: 'node_modules/yarn/src/cli/index.js',
    output: { file: 'dist/lib/cli.js', esModule: false, banner: '#!/usr/bin/env node', freeze: false },
    external: yarnDeps.concat(
      'path fs http net util url os string_decoder tty crypto stream events child_process zlib readline'.split(' '),
      ['./lockfile', '../lockfile', '../../lockfile']
    ),
    plugins: [
      transformCode({
        name: 'inline-import',
        test: /\byarn[\\/].*\.tpl\.js$/i,
        patterns: [
          {
            search: /[\s\S]*/,
            replace: (m) =>
              `export default (() => {//${m}/*!__PURE__*/blacklistCheck(isStrictRegExp);\n}).toString().slice(9, -1)`,
          },
        ],
      }),
      flowPlugin({ name: 'flow-allow-fields', test: /\byarn[\\/]src\b.config\.js$/i }),
      flowPlugin({
        ignoreUninitializedFields: true,
        test: /\byarn[\\/](?!(.*\.tpl|src\b.config)\.).*\.js$/i,
        transform: [
          { search: /^import\b.* getGlobalBinFolder,.* globalRun\b.*\bfrom\b/m, replace: '//$&' }, // circular deps
          { search: /^(.*)\brequire *\( *(['"](\w+)['"]) *\)(\s*\.\w+ *\()/gm, replace: 'import $3 from $2;\n$1$3$4' },
        ],
      }),
      packageJson(),
      commonJS({
        test: /\b(hash-for-dep|is-ci|is-webpack-bundle|(is-)?builtin-modules?|invariant|strip-bom)[\\/].*\.js$/i,
      }),
      terserPlugin({
        output: { ascii_only: false, comments: /^(#!|\s*[@#]__|\**\s*!\s*\S)/ },
        transform: [
          {
            search: new RegExp(`\\brequire\\(['"](${yarnDeps.join('|')})['"]\\)`, 'g'),
            replace: (_, p1) => '_libs' + (/\W/.test((p1 = p1.replace(/^@[^/]*\//, ''))) ? `['${p1}']` : '.' + p1),
          },
          { search: /^.*\s_libs\b/m, replace: "var _libs = require('./vendors');\n$&" },
          // Circular dependencies
          { search: ' getGlobalBinFolder(', replace: ' getBinFolder(' },
          {
            search: / globalRun(\([\s\S]*{\s*run: *([\w$]+)[^{}]*} *= *buildSubCommands\(['"]global['"])/,
            replace: ' $2$1',
          },
          // Optimize output
          {
            search: /^([ \t]+)([\w$]+ *\+=).*;(?:\n+\1\2.*;)+/gm,
            replace: (m, p1) => m.replace(new RegExp(`;(\\n+${p1})[\\w$]+ *\\+=`, 'g'), ' +$1 '),
          },
        ],
      }),
    ],
  }),
];

'use strict';

const { ReplaceSource } = require('webpack-sources');
const validateOptions = require('schema-utils');

const schema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    additionalProperties: false,
    properties: {
      search: {
        anyOf: [{ type: 'string', minLength: 1 }, { instanceof: 'RegExp' }],
      },
      replace: {
        anyOf: [{ type: 'string' }, { instanceof: 'Function' }],
      },
      test: { instanceof: 'RegExp' },
    },
    required: ['search', 'replace'],
  },
};

/**
 * @typedef {{search: (string|RegExp), replace: (string|Function), test?: RegExp}} ReplacerOption
 * @typedef {{start: number, end: number, replace: string}} Replacement
 */

/**
 * @param {string} str
 * @param {ReplacerOption[]} patterns
 * @returns {Replacement[]}
 */
const searchReplacements = (str, patterns) => {
  /** @type {Replacement[]} */
  const indices = [];

  patterns.forEach(({ search, replace }) => {
    if (typeof search === 'string') {
      const i = str.indexOf(search);
      if (i >= 0) {
        indices.push({ start: i, end: i + search.length - 1, replace });
      }
    } else {
      const re = new RegExp(search.source, search.flags);

      str.replace(search, (m, ...args) => {
        if (typeof args.pop() === 'object') args.pop();
        const k = args.pop();

        indices.push({ start: k, end: k + m.length - 1, replace: m.replace(re, replace) });
        return '';
      });
    }
  });

  return indices;
};

class ReplaceCodePlugin {
  /** @param {(ReplacerOption|ReplacerOption[])} options */
  constructor(options) {
    this.options = Array.isArray(options) ? options : [options];

    validateOptions(schema, this.options, 'ReplaceCode Plugin');
  }

  /**
   * Apply the plugin
   * @param {import('webpack').Compiler} compiler the compiler instance
   */
  apply(compiler) {
    const options = this.options;

    compiler.hooks.compilation.tap('ReplaceCodePlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap('ReplaceCodePlugin', (chunks) => {
        for (const chunk of chunks) {
          for (const file of chunk.files) {
            // Test filename
            const filtered = options.filter(({ test }) => !test || test.test(file));
            if (!filtered.length) {
              continue;
            }

            const patterns = filtered.map(({ search, replace }) => ({ search, replace }));
            // const data = { chunk, filename: file };
            // patterns = compilation.getPath(() => patterns, data);

            compilation.updateAsset(file, (old) => {
              const indices = searchReplacements(old.source(), patterns);

              const source = new ReplaceSource(old);
              indices.forEach(({ start, end, replace }) => source.replace(start, end, replace));

              return source;
            });
          }
        }
      });
    });
  }
}

module.exports = ReplaceCodePlugin;

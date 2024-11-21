#!/usr/bin/env node
'use strict';

try {
  require('v8-compile-cache');
} catch (_) {}

const { readFileSync } = require('fs');

let transformSync;
try {
  ({ transform: transformSync } = require('@babel/standalone'));
} catch (_) {
  ({ transformSync } = require('@babel/core'));
}

const config = {
  assumptions: {
    ignoreFunctionLength: true,
  },
  presets: [
    [
      'env',
      {
        debug: false,
        targets: { node: '4' },
        loose: true,
        exclude: [/^transform-(classes|block-scoping|arrow|for-of|regenerator|function-name)\b/],
        modules: false,
      },
    ],
  ],
  plugins: [],
  compact: false,
  retainLines: true,
};

// Parse arguments
const args = new Set(process.argv.slice(2));

args.forEach((filename) => {
  let data = readFileSync(filename, 'utf8');

  data = transformSync(data, Object.assign({}, config, { filename, babelrc: false, configFile: false }));

  console.log(data.code);
});

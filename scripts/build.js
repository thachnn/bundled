#!/usr/bin/env node
'use strict';

const webpack = require('webpack');
let configSet = require('../webpack.config');

Array.isArray(configSet) || (configSet = [configSet]);

// Parse arguments
const names = new Set(process.argv.slice(2));

if (names.size > 0) {
  configSet = configSet.filter((cfg) => cfg.name && names.has(cfg.name));
}

configSet.forEach((cfg) => {
  webpack(cfg, (err, stats) => {
    // Error handling
    if (err) return console.error('\n', err);

    // Log result...
    console.log('\n', stats.toString(Object.assign({ colors: true }, cfg.stats)));
  });
});

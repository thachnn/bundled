'use strict';

const fs = require('fs');
const parse = require('acorn').parse;

function decomment(code, options = {}) {
  const ranges = [];
  const onComment = (block, text, start, end) => ranges.push([start, end]);
  parse(code, Object.assign({ sourceType: 'module' }, options, { onComment }));

  let cmt, s1, s2, m1, m2;
  while (ranges.length) {
    cmt = ranges.pop();

    s1 = code.substring(0, cmt[0]);
    s2 = code.substring(cmt[1]);

    // beginning of line?
    if ((m1 = /[\r\n][^\S\r\n]*$/.exec(s1)) && (m2 = /^[^\S\r\n]*\r?\n/.exec(s2))) {
      s2 = s2.substring(m2[0].length);
      m1[0].length < 2 || (s1 = s1.substring(0, s1.length - m1[0].length + 1));
    }

    code = s1 + s2;
  }

  // trailing spaces
  return code.replace(/[^\S\r\n]+$/gm, '');
}

if (!module.parent || require.main === module) {
  main(process.argv.slice(2));
} else {
  module.exports = decomment;
}

function help(status = 0) {
  const print = status === 0 ? console.log : console.error;
  print('Usage: decomment [--ecma[3-...|2015-...]] [-o|--output <outfile>] [-i|--inplace] [-h|--help] [--] [infile]');

  process.exit(status);
}

/** @param {string[]} args */
function parseOpts(args) {
  const cmd = { opts: {} };

  let arg, m;
  while (args.length) {
    if (!(arg = args.shift())) continue;

    if ((arg === '-' || arg[0] !== '-') && !cmd.infile) cmd.infile = arg;
    else if (arg === '--' && !cmd.infile && args.length === 1) cmd.forceFile = !!(cmd.infile = args.shift());
    else if (arg === '--help' || arg === '-h' || arg === '-?') return help();
    else if ((arg === '--output' || arg === '-o') && args.length) cmd.outfile = args.shift();
    else if (arg === '--inplace' || arg === '-i') cmd.inplace = true;
    else if (arg === '--script') cmd.opts.sourceType = 'script';
    else if ((m = arg.match(/^--((allow|preserve)[A-Za-z]+)$/))) cmd.opts[m[1]] = true;
    else if ((m = arg.match(/^--ecma(\d+)$/))) cmd.opts.ecmaVersion = +m[1];
    else return help(1);
  }

  return cmd;
}

function main(args) {
  const cmd = parseOpts(args);
  const run = (code) => {
    code = decomment(code, cmd.opts);

    if (!cmd.outfile && cmd.inplace && cmd.forceFile) cmd.outfile = cmd.infile;
    if (!cmd.outfile) return console.log(code);

    fs.writeFileSync(cmd.outfile, code);
  };

  if (cmd.forceFile || (cmd.infile && cmd.infile !== '-')) {
    cmd.forceFile = true;
    run(fs.readFileSync(cmd.infile, 'utf8'), cmd);
  } else {
    let data = '';
    process.stdin.resume();
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => run(data, cmd));
  }
}

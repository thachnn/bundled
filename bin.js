#!/usr/bin/env node
'use strict'

var fs = require('fs'),
  compiler = require('.'),
  package_ = require('./package.json'),
  //
  packageName = package_.name,
  packageVersion = package_.version

function ensureVersion() {
  try {
    var vueVersion = require('vue/package.json').version
  } catch (_) {}

  var match
  if (
    !vueVersion ||
    (match = vueVersion.replace(/^(.*?\..*?\.).*/, '$1')) ===
      packageVersion.substring(0, match.length)
  )
    return

  var vuePath = require.resolve('vue/package.json').slice(0, -13)
  throw new Error(
    [
      '\nVue packages version mismatch:',
      '',
      '- vue@' + vueVersion + ' (' + vuePath + ')',
      '- ' + packageName + '@' + packageVersion + ' (' + __dirname + ')',
      '',
      'This may cause things to work incorrectly. Make sure to use the same version for both.',
      'If you are using vue-loader@>=10.0, simply update ' + packageName + '.',
      'If you are using vue-loader@<10.0 or vueify, re-installing vue-loader/vueify should bump ' +
        packageName +
        ' to the latest.\n'
    ].join('\n')
  )
}

/** @param {number} [exitCode] */
function help(exitCode) {
  console[exitCode ? 'error' : 'log'](
    [
      'v' + packageVersion + ', ' + package_.description,
      'Usage: ' + packageName + ' [options] [[--] <vue file> | -]',
      '',
      'Options:',
      '  -h, --help           Output usage information',
      '  -o, --output <file>  Write to file instead of stdout',
      '  --condense-whitespace',
      '  --[no-]deindent      Deindent block content',
      '  --strip-with         Replace `with` statement'
    ].join('\n')
  )

  process.exit(exitCode)
}

/** @param {string[]} args */
function parseArgs(args) {
  var opts = { values: {} }

  for (var arg, match; args.length; ) {
    if (!(arg = args.shift())) continue

    if (arg === '--' && !opts.file && args.length > 0) opts.file = args.shift()
    else if ((arg === '-' || arg[0] !== '-') && !opts.file)
      opts.file = arg !== '-' ? arg : false // STDIN
    else if (arg === '--help' || arg === '-h' || arg === '-?') return help()
    else if (arg === '--output' || arg === '-o') opts.output = args.shift() || help(1)
    else if (/^--condense\b/.test(arg)) opts.values.whitespace = 'condense'
    else if ((match = arg.match(/^--(no-)?([a-z][a-z_-]*)$/)))
      opts.values[toCamelCase(match[2])] = !match[1]
    else return help(2)
  }

  return opts
}

/** @param {string} str */
function toCamelCase(str) {
  return str.replace(/[_-]+([a-z])/g, function (_, c) {
    return c.toUpperCase()
  })
}

/** @param {string[]} args */
function main(args) {
  try {
    ensureVersion()
  } catch (err) {
    console.warn(err.message)
  }

  var opts = parseArgs(args)
  if (opts.file) run(fs.readFileSync(opts.file, 'utf8'), opts)
  else {
    var data = []
    process.stdin.resume()
    process.stdin.on('data', function (chunk) {
      data.push(chunk)
    })
    process.stdin.on('end', function () {
      run(data.join(''), opts)
    })
  }
}

function run(source, opts) {
  var sfc = compiler.parseComponent(source, opts.values)
  if (sfc.errors && sfc.errors.length) return console.error(sfc.errors)

  var res = compiler.compile(sfc.template.content, opts.values)
  if (res.errors && res.errors.length) return console.error(res.errors)
  source =
    'render: ' +
    toFunction(res.render) +
    ', staticRenderFns: [' +
    res.staticRenderFns.map(toFunction) +
    '],\n'

  var code = (sfc.scriptSetup || sfc.script).content,
    found = code.match(/(?:^|\s)(?:export\s+default|new\s+Vue\s*\(|__sfc__\s*=)\s*{/)
  if (found) {
    var i = found.index + found[0].length
    source = code.substring(0, i) + source + code.substring(i)
  } else source = 'var __sfc__ = {\n' + source + '}\n' + code

  opts.output ? fs.writeFileSync(opts.output, source) : console.log(source)
}

function toFunction(code) {
  return 'function (){' + code + '\n}'
}

// Is running in CLI mode?
if (require.main === module) main(process.argv.slice(2))
else {
  ensureVersion()
  module.exports = compiler
}

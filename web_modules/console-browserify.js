var util = require("util"), assert = require("assert");

function now() {
  return (new Date).getTime();
}

var console, slice = Array.prototype.slice, times = {};

console = "undefined" != typeof global && global.console ? global.console : "undefined" != typeof window && window.console ? window.console : {};

for (var functions = [ [ log, "log" ], [ info, "info" ], [ warn, "warn" ], [ error, "error" ], [ time, "time" ], [ timeEnd, "timeEnd" ], [ trace, "trace" ], [ dir, "dir" ], [ consoleAssert, "assert" ] ], i = 0; i < functions.length; i++) {
  var tuple = functions[i], f = tuple[0], name = tuple[1];
  console[name] || (console[name] = f);
}

function log() {}

function info() {
  console.log.apply(console, arguments);
}

function warn() {
  console.log.apply(console, arguments);
}

function error() {
  console.warn.apply(console, arguments);
}

function time(label) {
  times[label] = now();
}

function timeEnd(label) {
  var time = times[label];
  if (!time) throw new Error("No such label: " + label);
  delete times[label];
  var duration = now() - time;
  console.log(label + ": " + duration + "ms");
}

function trace() {
  var err = new Error;
  err.name = "Trace", err.message = util.format.apply(null, arguments), console.error(err.stack);
}

function dir(object) {
  console.log(util.inspect(object) + "\n");
}

function consoleAssert(expression) {
  if (!expression) {
    var arr = slice.call(arguments, 1);
    assert.ok(!1, util.format.apply(null, arr));
  }
}

module.exports = console;
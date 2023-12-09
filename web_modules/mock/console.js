var console;

for (var name in console = "undefined" != typeof global && global.console ? global.console : "undefined" != typeof window && window.console ? window.console : window.console = {}, 
module.exports = console, {
  log: 1,
  info: 1,
  error: 1,
  warn: 1,
  dir: 1,
  trace: 1,
  assert: 1,
  time: 1,
  timeEnd: 1
}) console[name] || (console[name] = function() {});
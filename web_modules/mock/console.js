var console =
  (typeof global != "undefined" && global.console) ||
  (typeof window != "undefined" && window.console) ||
  (window.console = /** @type {Console} */ {});

module.exports = console;
for (var name in {log: 1, info: 1, error: 1, warn: 1, dir: 1, trace: 1, assert: 1, time: 1, timeEnd: 1})
  console[name] || (console[name] = function () {});

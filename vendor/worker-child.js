"use strict";

let $module;

function handle(data) {
  let exec, idx = data.idx, child = data.child, method = data.method, args = data.args;
  if (null == method && "function" == typeof $module ? exec = $module : "function" == typeof $module[method] && (exec = $module[method]), 
  !exec) return console.error("NO SUCH METHOD:", method);
  exec.apply(null, args.concat([ function() {
    let _args = Array.prototype.slice.call(arguments);
    if (_args[0] instanceof Error) {
      let e = _args[0];
      _args[0] = {
        $error: "$error",
        type: e.constructor.name,
        message: e.message,
        stack: e.stack
      }, Object.keys(e).forEach((function(key) {
        _args[0][key] = e[key];
      }));
    }
    process.send({
      owner: "farm",
      idx: idx,
      child: child,
      args: _args
    });
  } ]));
}

process.on("message", (function(data) {
  if ("farm" === data.owner) return $module ? "die" == data.event ? process.exit(0) : void handle(data) : $module = require(data.module);
}));
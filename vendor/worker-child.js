'use strict'

let $module

function handle(data) {
  let exec,
    idx = data.idx,
    child = data.child,
    method = data.method,
    args = data.args
  let callback = function () {
    let _args = Array.prototype.slice.call(arguments),
      e = _args[0]
    if (e instanceof Error) {
      _args[0] = {
        $error: '$error',
        type: e.constructor.name,
        message: e.message,
        stack: e.stack
      }
      Object.keys(e).forEach(function (key) {
        _args[0][key] = e[key]
      })
    }
    process.send({ owner: 'farm', idx: idx, child: child, args: _args })
  }

  if (method == null && typeof $module == 'function') exec = $module
  else if (typeof $module[method] == 'function') exec = $module[method]

  if (!exec) return console.error('NO SUCH METHOD:', method)

  exec.apply(null, args.concat([callback]))
}

process.on('message', function (data) {
  if (data.owner !== 'farm') return

  if (!$module) return ($module = require(data.module))
  if (data.event == 'die') return process.exit(0)
  handle(data)
})

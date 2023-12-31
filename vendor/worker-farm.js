'use strict';

module.exports = (function (modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    var module = installedModules[moduleId];
    if (module) return module.exports;

    installedModules[moduleId] = module = { i: moduleId, l: false, exports: {} };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;
    return module.exports;
  }

  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  return __webpack_require__(1);
})([
// 0
function (module, exports, __webpack_require__) {

var all = (module.exports.all = [
  { errno: -2, code: 'ENOENT', description: 'no such file or directory' },
  { errno: -1, code: 'UNKNOWN', description: 'unknown error' },
  { errno: 0, code: 'OK', description: 'success' },
  { errno: 1, code: 'EOF', description: 'end of file' },
  { errno: 2, code: 'EADDRINFO', description: 'getaddrinfo error' },
  { errno: 3, code: 'EACCES', description: 'permission denied' },
  { errno: 4, code: 'EAGAIN', description: 'resource temporarily unavailable' },
  { errno: 5, code: 'EADDRINUSE', description: 'address already in use' },
  { errno: 6, code: 'EADDRNOTAVAIL', description: 'address not available' },
  { errno: 7, code: 'EAFNOSUPPORT', description: 'address family not supported' },
  { errno: 8, code: 'EALREADY', description: 'connection already in progress' },
  { errno: 9, code: 'EBADF', description: 'bad file descriptor' },
  { errno: 10, code: 'EBUSY', description: 'resource busy or locked' },
  {
    errno: 11,
    code: 'ECONNABORTED',
    description: 'software caused connection abort'
  },
  { errno: 12, code: 'ECONNREFUSED', description: 'connection refused' },
  { errno: 13, code: 'ECONNRESET', description: 'connection reset by peer' },
  { errno: 14, code: 'EDESTADDRREQ', description: 'destination address required' },
  { errno: 15, code: 'EFAULT', description: 'bad address in system call argument' },
  { errno: 16, code: 'EHOSTUNREACH', description: 'host is unreachable' },
  { errno: 17, code: 'EINTR', description: 'interrupted system call' },
  { errno: 18, code: 'EINVAL', description: 'invalid argument' },
  { errno: 19, code: 'EISCONN', description: 'socket is already connected' },
  { errno: 20, code: 'EMFILE', description: 'too many open files' },
  { errno: 21, code: 'EMSGSIZE', description: 'message too long' },
  { errno: 22, code: 'ENETDOWN', description: 'network is down' },
  { errno: 23, code: 'ENETUNREACH', description: 'network is unreachable' },
  { errno: 24, code: 'ENFILE', description: 'file table overflow' },
  { errno: 25, code: 'ENOBUFS', description: 'no buffer space available' },
  { errno: 26, code: 'ENOMEM', description: 'not enough memory' },
  { errno: 27, code: 'ENOTDIR', description: 'not a directory' },
  { errno: 28, code: 'EISDIR', description: 'illegal operation on a directory' },
  { errno: 29, code: 'ENONET', description: 'machine is not on the network' },
  { errno: 31, code: 'ENOTCONN', description: 'socket is not connected' },
  { errno: 32, code: 'ENOTSOCK', description: 'socket operation on non-socket' },
  { errno: 33, code: 'ENOTSUP', description: 'operation not supported on socket' },
  { errno: 34, code: 'ENOENT', description: 'no such file or directory' },
  { errno: 35, code: 'ENOSYS', description: 'function not implemented' },
  { errno: 36, code: 'EPIPE', description: 'broken pipe' },
  { errno: 37, code: 'EPROTO', description: 'protocol error' },
  { errno: 38, code: 'EPROTONOSUPPORT', description: 'protocol not supported' },
  { errno: 39, code: 'EPROTOTYPE', description: 'protocol wrong type for socket' },
  { errno: 40, code: 'ETIMEDOUT', description: 'connection timed out' },
  { errno: 41, code: 'ECHARSET', description: 'invalid Unicode character' },
  {
    errno: 42,
    code: 'EAIFAMNOSUPPORT',
    description: 'address family for hostname not supported'
  },
  {
    errno: 44,
    code: 'EAISERVICE',
    description: 'servname not supported for ai_socktype'
  },
  { errno: 45, code: 'EAISOCKTYPE', description: 'ai_socktype not supported' },
  {
    errno: 46,
    code: 'ESHUTDOWN',
    description: 'cannot send after transport endpoint shutdown'
  },
  { errno: 47, code: 'EEXIST', description: 'file already exists' },
  { errno: 48, code: 'ESRCH', description: 'no such process' },
  { errno: 49, code: 'ENAMETOOLONG', description: 'name too long' },
  { errno: 50, code: 'EPERM', description: 'operation not permitted' },
  { errno: 51, code: 'ELOOP', description: 'too many symbolic links encountered' },
  { errno: 52, code: 'EXDEV', description: 'cross-device link not permitted' },
  { errno: 53, code: 'ENOTEMPTY', description: 'directory not empty' },
  { errno: 54, code: 'ENOSPC', description: 'no space left on device' },
  { errno: 55, code: 'EIO', description: 'i/o error' },
  { errno: 56, code: 'EROFS', description: 'read-only file system' },
  { errno: 57, code: 'ENODEV', description: 'no such device' },
  { errno: 58, code: 'ESPIPE', description: 'invalid seek' },
  { errno: 59, code: 'ECANCELED', description: 'operation canceled' }
])

module.exports.errno = {}
module.exports.code = {}

all.forEach(function (error) {
  module.exports.errno[error.errno] = error
  module.exports.code[error.code] = error
})

module.exports.custom = __webpack_require__(6)(module.exports)
module.exports.create = module.exports.custom.createError

},
// 1
function (module, exports, __webpack_require__) {

const Farm = __webpack_require__(2)

let farms = []

function farm(options, path, methods) {
  if (typeof options == 'string') {
    methods = path
    path = options
    options = {}
  }

  let f = new Farm(options, path),
    api = f.setup(methods)

  farms.push({ farm: f, api: api })

  return api
}

function end(api, callback) {
  for (let i = 0; i < farms.length; i++)
    if (farms[i] && farms[i].api === api) return farms[i].farm.end(callback)
  process.nextTick(callback.bind(null, new Error('Worker farm not found!')))
}

module.exports = farm
module.exports.end = end

},
// 2
function (module, exports, __webpack_require__) {

const DEFAULT_OPTIONS = {
  workerOptions: {},
  maxCallsPerWorker: Infinity,
  maxConcurrentWorkers: (__webpack_require__(3).cpus() || { length: 1 }).length,
  maxConcurrentCallsPerWorker: 10,
  maxConcurrentCalls: Infinity,
  maxCallTime: Infinity,
  maxRetries: Infinity,
  forcedKillTime: 100,
  autoStart: false,
  onChild: function () {}
}

const fork = __webpack_require__(4),
  TimeoutError = __webpack_require__(0).create('TimeoutError'),
  ProcessTerminatedError = __webpack_require__(0).create('ProcessTerminatedError'),
  MaxConcurrentCallsError = __webpack_require__(0).create('MaxConcurrentCallsError')

function Farm(options, path) {
  this.options = Object.assign({}, DEFAULT_OPTIONS, options)
  this.path = path
  this.activeCalls = 0
}

Farm.prototype.mkhandle = function (method) {
  return function () {
    let args = Array.prototype.slice.call(arguments)
    if (this.activeCalls + this.callQueue.length >= this.options.maxConcurrentCalls) {
      let err = new MaxConcurrentCallsError(
        'Too many concurrent calls (active: ' +
        this.activeCalls + ', queued: ' + this.callQueue.length + ')'
      )
      if (typeof args[args.length - 1] == 'function')
        return process.nextTick(args[args.length - 1].bind(null, err))
      throw err
    }
    this.addCall({ method: method, callback: args.pop(), args: args, retries: 0 })
  }.bind(this)
}

Farm.prototype.setup = function (methods) {
  let iface
  if (!methods) iface = this.mkhandle()
  else {
    iface = {}
    methods.forEach(function (m) {
      iface[m] = this.mkhandle(m)
    }.bind(this))
  }

  this.searchStart = -1
  this.childId = -1
  this.children = {}
  this.activeChildren = 0
  this.callQueue = []

  if (this.options.autoStart)
    while (this.activeChildren < this.options.maxConcurrentWorkers) this.startChild()

  return iface
}

Farm.prototype.onExit = function (childId) {
  setTimeout(function () {
    let doQueue = false
    this.children[childId] && this.children[childId].activeCalls &&
      this.children[childId].calls.forEach(function (call, i) {
        if (!call) return
        if (call.retries >= this.options.maxRetries)
          this.receive({
            idx: i,
            child: childId,
            args: [
              new ProcessTerminatedError('cancel after ' + call.retries + ' retries!')
            ]
          })
        else {
          call.retries++
          this.callQueue.unshift(call)
          doQueue = true
        }
      }.bind(this))

    this.stopChild(childId)
    doQueue && this.processQueue()
  }.bind(this), 10)
}

Farm.prototype.startChild = function () {
  this.childId++

  let forked = fork(this.path, this.options.workerOptions),
    id = this.childId
  let c = {
    send: forked.send,
    child: forked.child,
    calls: [],
    activeCalls: 0,
    exitCode: null
  }

  this.options.onChild(forked.child)

  forked.child.on('message', function (data) {
    if (data.owner !== 'farm') return

    this.receive(data)
  }.bind(this))
  forked.child.once('exit', function (code) {
    c.exitCode = code
    this.onExit(id)
  }.bind(this))

  this.activeChildren++
  this.children[id] = c
}

Farm.prototype.stopChild = function (childId) {
  let child = this.children[childId]
  if (!child) return

  child.send({ owner: 'farm', event: 'die' })
  setTimeout(function () {
    child.exitCode !== null || child.child.kill('SIGKILL')
  }, this.options.forcedKillTime).unref()
  delete this.children[childId]
  this.activeChildren--
}

Farm.prototype.receive = function (data) {
  let idx = data.idx,
    childId = data.child,
    args = data.args,
    child = this.children[childId]

  if (!child)
    return console.error(
      'Worker Farm: Received message for unknown child. This is likely as a result of premature child death, the operation will have been re-queued.'
    )

  let call = child.calls[idx]
  if (!call)
    return console.error(
      'Worker Farm: Received message for unknown index for existing child. This should not happen!'
    )

  this.options.maxCallTime === Infinity || clearTimeout(call.timer)

  let e = args[0]
  if (e && e.$error == '$error') {
    switch (e.type) {
      case 'TypeError': args[0] = new TypeError(e.message); break
      case 'RangeError': args[0] = new RangeError(e.message); break
      case 'EvalError': args[0] = new EvalError(e.message); break
      case 'ReferenceError': args[0] = new ReferenceError(e.message); break
      case 'SyntaxError': args[0] = new SyntaxError(e.message); break
      case 'URIError': args[0] = new URIError(e.message); break
      default: args[0] = new Error(e.message)
    }
    args[0].type = e.type
    args[0].stack = e.stack

    Object.keys(e).forEach(function (key) {
      args[0][key] = e[key]
    })
  }

  process.nextTick(function () {
    call.callback.apply(null, args)
  })

  delete child.calls[idx]
  child.activeCalls--
  this.activeCalls--

  child.calls.length < this.options.maxCallsPerWorker ||
    Object.keys(child.calls).length ||
    this.stopChild(childId)

  this.processQueue()
}

Farm.prototype.childTimeout = function (childId) {
  let child = this.children[childId]

  if (!child) return

  for (let i in child.calls)
    this.receive({
      idx: i,
      child: childId,
      args: [new TimeoutError('worker call timed out!')]
    })

  this.stopChild(childId)
}

Farm.prototype.send = function (childId, call) {
  let child = this.children[childId],
    idx = child.calls.length

  child.calls.push(call)
  child.activeCalls++
  this.activeCalls++

  child.send({
    owner: 'farm',
    idx: idx,
    child: childId,
    method: call.method,
    args: call.args
  })

  if (this.options.maxCallTime !== Infinity)
    call.timer = setTimeout(
      this.childTimeout.bind(this, childId),
      this.options.maxCallTime
    )
}

Farm.prototype.childKeys = function () {
  let cka = Object.keys(this.children)

  this.searchStart >= cka.length - 1 ? (this.searchStart = 0) : this.searchStart++

  let cks = cka.splice(0, this.searchStart)

  return cka.concat(cks)
}

Farm.prototype.processQueue = function () {
  if (!this.callQueue.length) return this.ending && this.end()

  this.activeChildren < this.options.maxConcurrentWorkers && this.startChild()

  for (let childId, i = 0, cka = this.childKeys(); i < cka.length; i++) {
    childId = +cka[i]
    if (
      this.children[childId].activeCalls < this.options.maxConcurrentCallsPerWorker &&
      this.children[childId].calls.length < this.options.maxCallsPerWorker
    ) {
      this.send(childId, this.callQueue.shift())
      if (!this.callQueue.length) return this.ending && this.end()
    }
  }

  this.ending && this.end()
}

Farm.prototype.addCall = function (call) {
  if (this.ending) return this.end()
  this.callQueue.push(call)
  this.processQueue()
}

Farm.prototype.end = function (callback) {
  let complete = true
  if (this.ending === false) return
  if (callback) this.ending = callback
  else if (this.ending == null) this.ending = true
  Object.keys(this.children).forEach(function (child) {
    if (!this.children[child]) return
    !this.children[child].activeCalls ? this.stopChild(child) : (complete = false)
  }.bind(this))

  complete && typeof this.ending == 'function' &&
    process.nextTick(function () {
      this.ending()
      this.ending = false
    }.bind(this))
}

module.exports = Farm
module.exports.TimeoutError = TimeoutError

},
// 3
function (module) {

module.exports = require('os');

},
// 4
function (module, exports, __webpack_require__) {

const childProcess = __webpack_require__(5),
  childModule = require.resolve('./worker-child')

function fork(forkModule, workerOptions) {
  let filteredArgs = process.execArgv.filter(function (v) {
    return !/^--(debug|inspect)/.test(v)
  })
  let options = Object.assign({
    execArgv: filteredArgs,
    env: process.env,
    cwd: process.cwd()
  }, workerOptions)
  let child = childProcess.fork(childModule, process.argv, options)

  child.on('error', function () {})

  child.send({ owner: 'farm', module: forkModule })

  return { send: child.send.bind(child), child: child }
}

module.exports = fork

},
// 5
function (module) {

module.exports = require('child_process');

},
// 6
function (module, exports, __webpack_require__) {

var prr = __webpack_require__(7)

function init(type, message, cause) {
  if (message && typeof message != 'string')
    message = message.message || message.name

  prr(this, {
    type: type,
    name: type,
    cause: typeof message != 'string' ? message : cause,
    message: message
  }, 'ewr')
}

function CustomError(message, cause) {
  Error.call(this)
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
  init.call(this, 'CustomError', message, cause)
}

CustomError.prototype = new Error()

function createError(errno, type, proto) {
  var err = function (message, cause) {
    init.call(this, type, message, cause)
    if (type == 'FilesystemError') {
      this.code = this.cause.code
      this.path = this.cause.path
      this.errno = this.cause.errno
      this.message =
        (errno.errno[this.cause.errno]
          ? errno.errno[this.cause.errno].description
          : this.cause.message) +
        (this.cause.path ? ' [' + this.cause.path + ']' : '')
    }
    Error.call(this)
    Error.captureStackTrace && Error.captureStackTrace(this, err)
  }
  err.prototype = proto ? new proto() : new CustomError()
  return err
}

module.exports = function (errno) {
  var ce = function (type, proto) {
    return createError(errno, type, proto)
  }
  return {
    CustomError: CustomError,
    FilesystemError: ce('FilesystemError'),
    createError: ce
  }
}

},
// 7
function (module) {

var setProperty = typeof Object.defineProperty == 'function'
  ? function (obj, key, options) {
      Object.defineProperty(obj, key, options)
      return obj
    }
  : function (obj, key, options) {
      obj[key] = options.value
      return obj
    }

var makeOptions = function (value, options) {
  var oo = typeof options == 'object',
    os = !oo && typeof options == 'string',
    op = function (p) {
      return oo ? !!options[p] : os && options.indexOf(p[0]) > -1
    }

  return {
    enumerable: op('enumerable'),
    configurable: op('configurable'),
    writable: op('writable'),
    value: value
  }
}

var prr = function (obj, key, value, options) {
  options = makeOptions(value, options)

  if (typeof key == 'object') {
    for (var k in key)
      if (Object.prototype.hasOwnProperty.call(key, k)) {
        options.value = key[k]
        setProperty(obj, k, options)
      }

    return obj
  }

  return setProperty(obj, key, options)
}

module.exports = prr

}
]);

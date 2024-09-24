'use strict'

var fs = require('fs'),

  constants = require('constants'),
  Stream = require('stream').Stream,

  util = require('util'),

  origCwd = process.cwd,
  cwd = null,

  platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function () {
  cwd || (cwd = origCwd.call(process))
  return cwd
}
try {
  process.cwd()
} catch (_) {}

if (typeof process.chdir == 'function') {
  var chdir = process.chdir
  process.chdir = function (d) {
    cwd = null
    chdir.call(process, d)
  }
  Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, chdir)
}

function polyfills(fs) {
  constants.hasOwnProperty('O_SYMLINK') && /^v?0\.(6\.[0-2]\b|5\.)/.test(process.version) &&
    patchLchmod(fs)

  fs.lutimes || patchLutimes(fs)

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  if (fs.chmod && !fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      cb && process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (fs.chown && !fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      cb && process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  if (platform === 'win32')
    fs.rename = typeof fs.rename != 'function' ? fs.rename : (function (fs$rename) {
      function rename(from, to, cb) {
        var start = Date.now(),
          backoff = 0
        fs$rename(from, to, function CB(er) {
          if (er &&
              (er.code === 'EACCES' || er.code === 'EPERM') &&
              Date.now() - start < 60000) {
            setTimeout(function () {
              fs.stat(to, function (stater, _st) {
                stater && stater.code === 'ENOENT' ? fs$rename(from, to, CB) : cb(er)
              })
            }, backoff)
            if (backoff < 100) backoff += 10
          } else cb && cb(er)
        })
      }
      Object.setPrototypeOf && Object.setPrototypeOf(rename, fs$rename)
      return rename
    })(fs.rename)

  fs.read = typeof fs.read != 'function' ? fs.read : (function (fs$read) {
    function read(fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ == 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    Object.setPrototypeOf && Object.setPrototypeOf(read, fs$read)
    return read
  })(fs.read)

  fs.readSync = typeof fs.readSync != 'function' ? fs.readSync : (function (fs$readSync) {
    return function (fd, buffer, offset, length, position) {
      for (var eagCounter = 0; ; )
        try {
          return fs$readSync.call(fs, fd, buffer, offset, length, position)
        } catch (er) {
          if (er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter++
            continue
          }
          throw er
        }
    }
  })(fs.readSync)

  function patchLchmod(fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function (err, fd) {
        if (err) {
          callback && callback(err)
          return
        }
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function (err2) {
            callback && callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var ret,
        fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode),

        threw = true
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw)
          try {
            fs.closeSync(fd)
          } catch (_) {}
        else fs.closeSync(fd)
      }
      return ret
    }
  }

  function patchLutimes(fs) {
    if (constants.hasOwnProperty('O_SYMLINK') && fs.futimes) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            cb && cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              cb && cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var ret,
          fd = fs.openSync(path, constants.O_SYMLINK),
          threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw)
            try {
              fs.closeSync(fd)
            } catch (_) {}
          else fs.closeSync(fd)
        }
        return ret
      }
    } else if (fs.futimes) {
      fs.lutimes = function (_a, _b, _c, cb) { cb && process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix(orig) {
    return !orig ? orig : function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        cb && cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync(orig) {
    return !orig ? orig : function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function chownFix(orig) {
    return !orig ? orig : function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        cb && cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync(orig) {
    return !orig ? orig : function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix(orig) {
    return !orig ? orig : function (target, options, cb) {
      if (typeof options == 'function') {
        cb = options
        options = null
      }
      function callback(er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        cb && cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync(orig) {
    return !orig ? orig : function (target, options) {
      var stats = options ? orig.call(fs, target, options) : orig.call(fs, target)
      if (stats) {
        if (stats.uid < 0) stats.uid += 0x100000000
        if (stats.gid < 0) stats.gid += 0x100000000
      }
      return stats
    }
  }

  function chownErOk(er) {
    return (!er ||
      er.code === 'ENOSYS' ||
      ((!process.getuid || process.getuid() !== 0) &&
        (er.code === 'EINVAL' || er.code === 'EPERM'))
    )
  }
}

function legacy(fs) {
  return { ReadStream: ReadStream, WriteStream: WriteStream }

  function ReadStream(path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options)

    Stream.call(this)

    var self = this

    this.path = path
    this.fd = null
    this.readable = true
    this.paused = false

    this.flags = 'r'
    this.mode = 438
    this.bufferSize = 65536

    options = options || {}

    var keys = Object.keys(options)
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index]
      this[key] = options[key]
    }

    this.encoding && this.setEncoding(this.encoding)

    if (this.start !== void 0) {
      if ('number' != typeof this.start) throw TypeError('start must be a Number')

      if (this.end === void 0) this.end = Infinity
      else if ('number' != typeof this.end) throw TypeError('end must be a Number')

      if (this.start > this.end) throw new Error('start must be <= end')

      this.pos = this.start
    }

    if (this.fd !== null) {
      process.nextTick(function () {
        self._read()
      })
      return
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err)
        self.readable = false
        return
      }

      self.fd = fd
      self.emit('open', fd)
      self._read()
    })
  }

  function WriteStream(path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options)

    Stream.call(this)

    this.path = path
    this.fd = null
    this.writable = true

    this.flags = 'w'
    this.encoding = 'binary'
    this.mode = 438
    this.bytesWritten = 0

    options = options || {}

    var keys = Object.keys(options)
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index]
      this[key] = options[key]
    }

    if (this.start !== void 0) {
      if ('number' != typeof this.start) throw TypeError('start must be a Number')

      if (this.start < 0) throw new Error('start must be >= zero')

      this.pos = this.start
    }

    this.busy = false
    this._queue = []

    if (this.fd === null) {
      this._open = fs.open
      this._queue.push([this._open, this.path, this.flags, this.mode, void 0])
      this.flush()
    }
  }
}

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
}

function clone(obj) {
  if (obj === null || typeof obj != 'object') return obj

  var copy = obj instanceof Object ? { __proto__: getPrototypeOf(obj) } : Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}

var gracefulQueue, previousSymbol

if (typeof Symbol == 'function' && typeof Symbol.for == 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop() {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function () {
      return queue
    }
  })
}

var debug = util.debuglog
  ? util.debuglog('gfs4')
  : /\bgfs4\b/i.test(process.env.NODE_DEBUG || '')
  ? function () {
      var m = util.format.apply(util, arguments)
      m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
      console.error(m)
    }
  : noop

if (!fs[gracefulQueue]) {
  var queue = global[gracefulQueue] || []
  publishQueue(fs, queue)

  fs.close = (function (fs$close) {
    function close(fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        err || resetQueue()

        typeof cb != 'function' || cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, { value: fs$close })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync(fd) {
      fs$closeSync.apply(fs, arguments)
      resetQueue()
    }

    Object.defineProperty(closeSync, previousSymbol, { value: fs$closeSync })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
    process.on('exit', function () {
      debug(fs[gracefulQueue])
      require('assert').equal(fs[gracefulQueue].length, 0)
    })
}

global[gracefulQueue] || publishQueue(global, fs[gracefulQueue])

module.exports = !process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH
  ? patch(clone(fs))
  : (fs.__patched || ((fs = patch(fs)).__patched = true), fs)

function patch(fs) {
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile(path, options, cb) {
    if (typeof options == 'function') (cb = options), (options = null)

    return go$readFile(path, options, cb)

    function go$readFile(path, options, cb, startTime) {
      return fs$readFile(path, options, function (err) {
        err && (err.code === 'EMFILE' || err.code === 'ENFILE')
          ? enqueue([go$readFile, [path, options, cb], err, startTime || Date.now(), Date.now()])
          : typeof cb != 'function' || cb.apply(this, arguments)
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile(path, data, options, cb) {
    if (typeof options == 'function') (cb = options), (options = null)

    return go$writeFile(path, data, options, cb)

    function go$writeFile(path, data, options, cb, startTime) {
      return fs$writeFile(path, data, options, function (err) {
        err && (err.code === 'EMFILE' || err.code === 'ENFILE')
          ? enqueue([go$writeFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()])
          : typeof cb != 'function' || cb.apply(this, arguments)
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile) fs.appendFile = appendFile
  function appendFile(path, data, options, cb) {
    if (typeof options == 'function') (cb = options), (options = null)

    return go$appendFile(path, data, options, cb)

    function go$appendFile(path, data, options, cb, startTime) {
      return fs$appendFile(path, data, options, function (err) {
        err && (err.code === 'EMFILE' || err.code === 'ENFILE')
          ? enqueue([go$appendFile, [path, data, options, cb], err, startTime || Date.now(), Date.now()])
          : typeof cb != 'function' || cb.apply(this, arguments)
      })
    }
  }

  var fs$copyFile = fs.copyFile
  if (fs$copyFile) fs.copyFile = copyFile
  function copyFile(src, dest, flags, cb) {
    if (typeof flags == 'function') {
      cb = flags
      flags = 0
    }
    return go$copyFile(src, dest, flags, cb)

    function go$copyFile(src, dest, flags, cb, startTime) {
      return fs$copyFile(src, dest, flags, function (err) {
        err && (err.code === 'EMFILE' || err.code === 'ENFILE')
          ? enqueue([go$copyFile, [src, dest, flags, cb], err, startTime || Date.now(), Date.now()])
          : typeof cb != 'function' || cb.apply(this, arguments)
      })
    }
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  var noReaddirOptionVersions = /^v?[0-5]\./
  function readdir(path, options, cb) {
    if (typeof options == 'function') (cb = options), (options = null)

    var go$readdir = noReaddirOptionVersions.test(process.version)
      ? function (path, options, cb, startTime) {
          return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime))
        }
      : function (path, options, cb, startTime) {
          return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime))
        }

    return go$readdir(path, options, cb)

    function fs$readdirCallback(path, options, cb, startTime) {
      return function (err, files) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readdir, [path, options, cb], err, startTime || Date.now(), Date.now()])
        else {
          files && files.sort && files.sort()

          typeof cb != 'function' || cb.call(this, err, files)
        }
      }
    }
  }

  if (/^v?0\.8\b/.test(process.version)) {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream(path, options) {
    return this instanceof ReadStream
      ? (fs$ReadStream.apply(this, arguments), this)
      : ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open() {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.autoClose && that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream(path, options) {
    return this instanceof WriteStream
      ? (fs$WriteStream.apply(this, arguments), this)
      : WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open() {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream(path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream(path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open(path, flags, mode, cb) {
    if (typeof mode == 'function') (cb = mode), (mode = null)

    return go$open(path, flags, mode, cb)

    function go$open(path, flags, mode, cb, startTime) {
      return fs$open(path, flags, mode, function (err, fd) {
        err && (err.code === 'EMFILE' || err.code === 'ENFILE')
          ? enqueue([go$open, [path, flags, mode, cb], err, startTime || Date.now(), Date.now()])
          : typeof cb != 'function' || cb.apply(this, arguments)
      })
    }
  }

  return fs
}

function enqueue(elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
  retry()
}

var retryTimer

function resetQueue() {
  for (var now = Date.now(), i = 0; i < fs[gracefulQueue].length; ++i)
    if (fs[gracefulQueue][i].length > 2) {
      fs[gracefulQueue][i][3] = now
      fs[gracefulQueue][i][4] = now
    }

  retry()
}

function retry() {
  clearTimeout(retryTimer)
  retryTimer = void 0

  if (fs[gracefulQueue].length === 0) return

  var elem = fs[gracefulQueue].shift(),
    fn = elem[0],
    args = elem[1],
    err = elem[2],
    startTime = elem[3],
    lastTime = elem[4]

  if (startTime === void 0) {
    debug('RETRY', fn.name, args)
    fn.apply(null, args)
  } else if (Date.now() - startTime >= 60000) {
    debug('TIMEOUT', fn.name, args)
    var cb = args.pop()
    typeof cb != 'function' || cb.call(null, err)
  } else {
    var sinceAttempt = Date.now() - lastTime,
      sinceStart = Math.max(lastTime - startTime, 1)
    if (sinceAttempt >= Math.min(sinceStart * 1.2, 100)) {
      debug('RETRY', fn.name, args)
      fn.apply(null, args.concat([startTime]))
    } else fs[gracefulQueue].push(elem)
  }

  if (retryTimer === void 0) retryTimer = setTimeout(retry, 0)
}

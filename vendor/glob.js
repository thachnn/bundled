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
  return __webpack_require__(5);
})([
// 0
function (module) {

module.exports = require('path');

},
// 1
function (module) {

module.exports = require('fs');

},
// 2
function (module) {

module.exports = require('./minimatch');

},
// 3
function (module) {

module.exports = require('util');

},
// 4
function (module) {

'use strict';

function posix(path) {
  return path.charAt(0) === '/';
}

function win32(path) {
  var result = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/.exec(path),
    device = result[1] || '',
    isUnc = Boolean(device && device.charAt(1) !== ':');

  return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;

},
// 5
function (module, exports, __webpack_require__) {

module.exports = glob

var rp = __webpack_require__(6),
  minimatch = __webpack_require__(2),
  inherits = __webpack_require__(3).inherits,
  EE = __webpack_require__(12).EventEmitter,
  path = __webpack_require__(0),
  assert = __webpack_require__(7),
  isAbsolute = __webpack_require__(4),
  globSync = __webpack_require__(13),
  common = __webpack_require__(8),
  setopts = common.setopts,
  ownProp = common.ownProp,
  inflight = __webpack_require__(14),
  childrenIgnored = common.childrenIgnored,
  isIgnored = common.isIgnored,

  once = __webpack_require__(10)

function glob(pattern, options, cb) {
  if (typeof options == 'function') (cb = options), (options = {})
  options || (options = {})

  if (options.sync) {
    if (cb) throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = (glob.GlobSync = globSync.GlobSync)

glob.glob = glob

function extend(origin, add) {
  if (add === null || typeof add != 'object') return origin

  for (var keys = Object.keys(add), i = keys.length; i--; ) origin[keys[i]] = add[keys[i]]

  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var set = new Glob(pattern, options).minimatch.set

  if (!pattern) return false

  if (set.length > 1) return true

  for (var j = 0; j < set[0].length; j++) if (typeof set[0][j] != 'string') return true

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob(pattern, options, cb) {
  if (typeof options == 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb) throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob)) return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  var n = this.minimatch.set.length

  this.matches = new Array(n)

  if (typeof cb == 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess) return this

  if (n === 0) return done()

  var sync = true
  for (var i = 0; i < n; i++) this._process(this.minimatch.set[i], i, false, done)

  sync = false

  function done() {
    --self._processing
    if (self._processing > 0) return
    sync
      ? process.nextTick(function () {
          self._finish()
        })
      : self._finish()
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted) return

  if (this.realpath && !this._didRealpath) return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath) return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0) return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++) this._realpathSet(i, next)

  function next() {
    --n != 0 || self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset) return cb()

  var found = Object.keys(matchset),
    self = this,
    n = found.length

  if (n === 0) return cb()

  var set = (this.matches[index] = Object.create(null))
  found.forEach(function (p, _i) {
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      !er
        ? (set[real] = true)
        : er.syscall === 'stat'
        ? (set[p] = true)
        : self.emit('error', er)

      if (--n == 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (this.paused) return

  this.paused = true
  this.emit('pause')
}

Glob.prototype.resume = function () {
  if (!this.paused) return

  this.emit('resume')
  this.paused = false
  if (this._emitQueue.length) {
    var eq = this._emitQueue.slice(0)
    this._emitQueue.length = 0
    for (var i = 0; i < eq.length; i++) {
      var e = eq[i]
      this._emitMatch(e[0], e[1])
    }
  }
  if (this._processQueue.length) {
    var pq = this._processQueue.slice(0)
    this._processQueue.length = 0
    for (i = 0; i < pq.length; i++) {
      var p = pq[i]
      this._processing--
      this._process(p[0], p[1], p[2], p[3])
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb == 'function')

  if (this.aborted) return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  var prefix,
    n = 0
  while (typeof pattern[n] == 'string') n++

  switch (n) {
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      prefix = null
      break

    default:
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var read,
    remain = pattern.slice(n)

  if (prefix === null) read = '.'
  else if (
    isAbsolute(prefix) ||
    isAbsolute(pattern.map(function (p) {
      return typeof p == 'string' ? p : '[*]'
    }).join('/'))
  ) {
    if (!prefix || !isAbsolute(prefix)) prefix = '/' + prefix
    read = prefix
  } else read = prefix

  var abs = this._makeAbs(read)

  if (childrenIgnored(this, read)) return cb()

  remain[0] === minimatch.GLOBSTAR
    ? this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
    : this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  if (!entries) return cb()

  var pn = remain[0],
    negate = !!this.minimatch.negate,
    rawGlob = pn._glob,
    dotOk = this.dot || rawGlob.charAt(0) === '.',

    matchedEntries = []
  for (var i = 0; i < entries.length; i++)
    ((e = entries[i]).charAt(0) !== '.' || dotOk) &&
      (negate && !prefix ? !e.match(pn) : e.match(pn)) &&
      matchedEntries.push(e)

  var len = matchedEntries.length
  if (len === 0) return cb()

  if (remain.length === 1 && !this.mark && !this.stat) {
    this.matches[index] || (this.matches[index] = Object.create(null))

    for (i = 0; i < len; i++) {
      var e = matchedEntries[i]
      if (prefix) e = prefix !== '/' ? prefix + '/' + e : prefix + e

      e.charAt(0) !== '/' || this.nomount || (e = path.join(this.root, e))

      this._emitMatch(index, e)
    }
    return cb()
  }

  remain.shift()
  for (i = 0; i < len; i++) {
    e = matchedEntries[i]
    if (prefix) e = prefix !== '/' ? prefix + '/' + e : prefix + e

    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted || isIgnored(this, e)) return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark) e = this._mark(e)

  if (this.absolute) e = abs

  if (this.matches[index][e]) return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c)) return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  st && this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted) return

  if (this.follow) return this._readdir(abs, false, cb)

  var self = this,
    lstatcb = inflight('lstat\0' + abs, lstatcb_)

  lstatcb && self.fs.lstat(abs, lstatcb)

  function lstatcb_(er, lstat) {
    if (er && er.code === 'ENOENT') return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted || !(cb = inflight('readdir\0' + abs + '\0' + inGlobStar, cb))) return

  if (inGlobStar && !ownProp(this.symlinks, abs)) return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE') return cb()

    if (Array.isArray(c)) return cb(null, c)
  }

  this.fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb(self, abs, cb) {
  return function (er, entries) {
    er ? self._readdirError(abs, er, cb) : self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted) return

  if (!this.mark && !this.stat)
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i]
      e = abs === '/' ? abs + e : abs + '/' + e
      this.cache[e] = true
    }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted) return

  switch (er.code) {
    case 'ENOTSUP':
    case 'ENOTDIR':
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT':
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default:
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        this.abort()
      }
      this.silent || console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  if (!entries) return cb()

  var remainWithoutGlobStar = remain.slice(1),
    gspref = prefix ? [prefix] : [],
    noGlobStar = gspref.concat(remainWithoutGlobStar)

  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs],
    len = entries.length

  if (isSym && inGlobStar) return cb()

  for (var i = 0; i < len; i++) {
    if (entries[i].charAt(0) === '.' && !this.dot) continue

    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {
  this.matches[index] || (this.matches[index] = Object.create(null))

  if (!exists) return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') prefix = path.join(this.root, prefix)
    else {
      prefix = path.resolve(this.root, prefix)
      if (trail) prefix += '/'
    }
  }

  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/')

  this._emitMatch(index, prefix)
  cb()
}

Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f),
    needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength) return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c)) c = 'DIR'

    if (!needDir || c === 'DIR') return cb(null, c)

    if (needDir && c === 'FILE') return cb()
  }

  var stat = this.statCache[abs]
  if (stat !== void 0) {
    if (stat === false) return cb(null, stat)

    var type = stat.isDirectory() ? 'DIR' : 'FILE'
    return needDir && type === 'FILE' ? cb() : cb(null, type, stat)
  }

  var self = this,
    statcb = inflight('stat\0' + abs, lstatcb_)
  statcb && self.fs.lstat(abs, statcb)

  function lstatcb_(er, lstat) {
    if (lstat && lstat.isSymbolicLink())
      return self.fs.stat(abs, function (er, stat) {
        er ? self._stat2(f, abs, null, lstat, cb) : self._stat2(f, abs, er, stat, cb)
      })

    self._stat2(f, abs, er, lstat, cb)
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory()) return cb(null, false, stat)

  var c = true
  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  return needDir && c === 'FILE' ? cb() : cb(null, c, stat)
}

},
// 6
function (module, exports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(1),
  origRealpath = fs.realpath,
  origRealpathSync = fs.realpathSync,

  version = process.version,
  ok = /^v[0-5]\./.test(version),
  old = __webpack_require__(11)

function newError(er) {
  return er && er.syscall === 'realpath' &&
    (er.code === 'ELOOP' || er.code === 'ENOMEM' || er.code === 'ENAMETOOLONG')
}

function realpath(p, cache, cb) {
  if (ok) return origRealpath(p, cache, cb)

  if (typeof cache == 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    newError(er) ? old.realpath(p, cache, cb) : cb(er, result)
  })
}

function realpathSync(p, cache) {
  if (ok) return origRealpathSync(p, cache)

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) return old.realpathSync(p, cache)

    throw er
  }
}

function monkeypatch() {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch() {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}

},
// 7
function (module) {

module.exports = require('assert');

},
// 8
function (module, exports, __webpack_require__) {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp(obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var fs = __webpack_require__(1),
  path = __webpack_require__(0),
  minimatch = __webpack_require__(2),
  isAbsolute = __webpack_require__(4),
  Minimatch = minimatch.Minimatch

function alphasort(a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores(self, options) {
  self.ignore = options.ignore || []

  Array.isArray(self.ignore) || (self.ignore = [self.ignore])

  if (self.ignore.length) self.ignore = self.ignore.map(ignoreMap)
}

function ignoreMap(pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return { matcher: new Minimatch(pattern, { dot: true }), gmatcher: gmatcher }
}

function setopts(self, pattern, options) {
  options || (options = {})

  if (options.matchBase && pattern.indexOf('/') < 0) {
    if (options.noglobstar) throw new Error('base matching requires globstar')

    pattern = '**/' + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir) self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute
  self.fs = options.fs || fs

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, 'cwd')) self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, '/')
  self.root = path.resolve(self.root)
  if (process.platform === 'win32') self.root = self.root.replace(/\\/g, '/')

  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === 'win32') self.cwdAbs = self.cwdAbs.replace(/\\/g, '/')
  self.nomount = !!options.nomount

  options.nonegate = true
  options.nocomment = true
  options.allowWindowsEscape = false

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish(self) {
  var nou = self.nounique,
    all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i++) {
    var matches = self.matches[i]
    if (matches && Object.keys(matches).length !== 0) {
      var m = Object.keys(matches)
      nou
        ? all.push.apply(all, m)
        : m.forEach(function (m) {
            all[m] = true
          })
    } else if (self.nonull) {
      var literal = self.minimatch.globSet[i]
      nou ? all.push(literal) : (all[literal] = true)
    }
  }

  nou || (all = Object.keys(all))

  self.nosort || (all = all.sort(alphasort))

  if (self.mark) {
    for (i = 0; i < all.length; i++) all[i] = self._mark(all[i])

    if (self.nodir)
      all = all.filter(function (e) {
        var notDir = !/\/$/.test(e),
          c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c) notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
  }

  if (self.ignore.length)
    all = all.filter(function (m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark(self, p) {
  var abs = makeAbs(self, p),
    c = self.cache[abs],
    m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c),
      slash = p.slice(-1) === '/'

    if (isDir && !slash) m += '/'
    else if (!isDir && slash) m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

function makeAbs(self, f) {
  var abs // = f
  abs = f.charAt(0) === '/'
    ? path.join(self.root, f)
    : isAbsolute(f) || f === ''
    ? f
    : self.changedCwd
    ? path.resolve(self.cwd, f)
    : path.resolve(f)

  if (process.platform === 'win32') abs = abs.replace(/\\/g, '/')

  return abs
}

function isIgnored(self, path) {
  return !!self.ignore.length &&
    self.ignore.some(function (item) {
      return item.matcher.match(path) || !(!item.gmatcher || !item.gmatcher.match(path))
    })
}

function childrenIgnored(self, path) {
  return !!self.ignore.length &&
    self.ignore.some(function (item) {
      return !(!item.gmatcher || !item.gmatcher.match(path))
    })
}

},
// 9
function (module) {

module.exports = wrappy
function wrappy(fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn != 'function') throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) args[i] = arguments[i]

    var ret = fn.apply(this, args),
      cb = args[args.length - 1]
    typeof ret != 'function' || ret === cb ||
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })

    return ret
  }
}

},
// 10
function (module, exports, __webpack_require__) {

var wrappy = __webpack_require__(9)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once(fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return (f.value = fn.apply(this, arguments))
  }
  f.called = false
  return f
}

function onceStrict(fn) {
  var f = function () {
    if (f.called) throw new Error(f.onceError)
    f.called = true
    return (f.value = fn.apply(this, arguments))
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}

},
// 11
function (module, exports, __webpack_require__) {

var pathModule = __webpack_require__(0),
  isWindows = process.platform === 'win32',
  fs = __webpack_require__(1),

  DEBUG = process.env.NODE_DEBUG && /fs\b/.test(process.env.NODE_DEBUG);

function rethrow() {
  var callback;
  if (DEBUG) {
    var backtrace = new Error();
    callback = debugCallback;
  } else callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (!err) return;

    backtrace.message = err.message;
    err = backtrace;
    missingCallback(err);
  }

  function missingCallback(err) {
    if (!err) return;

    if (process.throwDeprecation) throw err;
    if (!process.noDeprecation) {
      var msg = 'fs: missing callback ' + (err.stack || err.message);
      process.traceDeprecation ? console.trace(msg) : console.error(msg);
    }
  }
}

function maybeCallback(cb) {
  return typeof cb == 'function' ? cb : rethrow();
}

var nextPartRe = isWindows ? /(.*?)(?:[\/\\]+|$)/g : /(.*?)(?:[\/]+|$)/g,

  splitRootRe = isWindows ? /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/ : /^[\/]*/;

exports.realpathSync = function (p, cache) {
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) return cache[p];

  var original = p,
    seenLinks = {},
    knownHard = {};

  var pos = void 0, current = void 0, base, previous;

  start();

  function start() {
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  while (pos < p.length) {
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    if (knownHard[base] || (cache && cache[base] === base)) continue;

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base))
      resolvedLink = cache[base];
    else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) linkTarget = seenLinks[id];
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      if (cache) cache[base] = resolvedLink;
      isWindows || (seenLinks[id] = linkTarget);
    }

    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};

exports.realpath = function (p, cache, cb) {
  if (typeof cb != 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p))
    return process.nextTick(cb.bind(null, null, cache[p]));

  var original = p,
    seenLinks = {},
    knownHard = {};

  var pos, current, base, previous;

  start();

  function start() {
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    if (isWindows && !knownHard[base])
      fs.lstat(base, function (err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    else process.nextTick(LOOP);
  }

  function LOOP() {
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    return knownHard[base] || (cache && cache[base] === base)
      ? process.nextTick(LOOP)
      : cache && Object.prototype.hasOwnProperty.call(cache, base)
      ? gotResolvedLink(cache[base])
      : fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) return gotTarget(null, seenLinks[id], base);
    }
    fs.stat(base, function (err) {
      if (err) return cb(err);

      fs.readlink(base, function (err, target) {
        isWindows || (seenLinks[id] = target);
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};

},
// 12
function (module) {

module.exports = require('events');

},
// 13
function (module, exports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var rp = __webpack_require__(6),
  minimatch = __webpack_require__(2),
  path = __webpack_require__(0),
  assert = __webpack_require__(7),
  isAbsolute = __webpack_require__(4),
  common = __webpack_require__(8),
  setopts = common.setopts,
  ownProp = common.ownProp,
  childrenIgnored = common.childrenIgnored,
  isIgnored = common.isIgnored

function globSync(pattern, options) {
  if (typeof options == 'function' || arguments.length === 3)
    throw new TypeError(
      'callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167'
    )

  return new GlobSync(pattern, options).found
}

function GlobSync(pattern, options) {
  if (!pattern) throw new Error('must provide pattern')

  if (typeof options == 'function' || arguments.length === 3)
    throw new TypeError(
      'callback provided to sync glob\nSee: https://github.com/isaacs/node-glob/issues/167'
    )

  if (!(this instanceof GlobSync)) return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess) return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i++) this._process(this.minimatch.set[i], i, false)

  this._finish()
}

GlobSync.prototype._finish = function () {
  assert.ok(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = (self.matches[index] = Object.create(null))
      for (var p in matchset)
        try {
          p = self._makeAbs(p)
          set[rp.realpathSync(p, self.realpathCache)] = true
        } catch (er) {
          if (er.syscall !== 'stat') throw er

          set[self._makeAbs(p)] = true
        }
    })
  }
  common.finish(this)
}

GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert.ok(this instanceof GlobSync)

  var prefix,
    n = 0
  while (typeof pattern[n] == 'string') n++

  switch (n) {
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      prefix = null
      break

    default:
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var read,
    remain = pattern.slice(n)

  if (prefix === null) read = '.'
  else if (
    isAbsolute(prefix) ||
    isAbsolute(pattern.map(function (p) {
      return typeof p == 'string' ? p : '[*]'
    }).join('/'))
  ) {
    if (!prefix || !isAbsolute(prefix)) prefix = '/' + prefix
    read = prefix
  } else read = prefix

  var abs = this._makeAbs(read)

  if (childrenIgnored(this, read)) return

  remain[0] === minimatch.GLOBSTAR
    ? this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
    : this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}

GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  if (!entries) return

  var pn = remain[0],
    negate = !!this.minimatch.negate,
    rawGlob = pn._glob,
    dotOk = this.dot || rawGlob.charAt(0) === '.',

    matchedEntries = []
  for (var i = 0; i < entries.length; i++)
    ((e = entries[i]).charAt(0) !== '.' || dotOk) &&
      (negate && !prefix ? !e.match(pn) : e.match(pn)) &&
      matchedEntries.push(e)

  var len = matchedEntries.length
  if (len === 0) return

  if (remain.length === 1 && !this.mark && !this.stat) {
    this.matches[index] || (this.matches[index] = Object.create(null))

    for (i = 0; i < len; i++) {
      var e = matchedEntries[i]
      if (prefix) e = prefix.slice(-1) !== '/' ? prefix + '/' + e : prefix + e

      e.charAt(0) !== '/' || this.nomount || (e = path.join(this.root, e))

      this._emitMatch(index, e)
    }
    return
  }

  remain.shift()
  for (i = 0; i < len; i++) {
    e = matchedEntries[i]
    var newPattern = prefix ? [prefix, e] : [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}

GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e)) return

  var abs = this._makeAbs(e)

  if (this.mark) e = this._mark(e)

  if (this.absolute) e = abs

  if (this.matches[index][e]) return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c)) return
  }

  this.matches[index][e] = true

  this.stat && this._stat(e)
}

GlobSync.prototype._readdirInGlobStar = function (abs) {
  if (this.follow) return this._readdir(abs, false)

  var entries, lstat
  try {
    lstat = this.fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') return null
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  !isSym && lstat && !lstat.isDirectory()
    ? (this.cache[abs] = 'FILE')
    : (entries = this._readdir(abs, false))

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  if (inGlobStar && !ownProp(this.symlinks, abs)) return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE') return null

    if (Array.isArray(c)) return c
  }

  try {
    return this._readdirEntries(abs, this.fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  if (!this.mark && !this.stat)
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i]
      e = abs === '/' ? abs + e : abs + '/' + e
      this.cache[e] = true
    }

  this.cache[abs] = entries

  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  switch (er.code) {
    case 'ENOTSUP':
    case 'ENOTDIR':
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT':
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default:
      this.cache[this._makeAbs(f)] = false
      if (this.strict) throw er
      this.silent || console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  if (!entries) return

  var remainWithoutGlobStar = remain.slice(1),
    gspref = prefix ? [prefix] : [],
    noGlobStar = gspref.concat(remainWithoutGlobStar)

  this._process(noGlobStar, index, false)

  var len = entries.length

  if (this.symlinks[abs] && inGlobStar) return

  for (var i = 0; i < len; i++) {
    if (entries[i].charAt(0) === '.' && !this.dot) continue

    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  var exists = this._stat(prefix)

  this.matches[index] || (this.matches[index] = Object.create(null))

  if (!exists) return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') prefix = path.join(this.root, prefix)
    else {
      prefix = path.resolve(this.root, prefix)
      if (trail) prefix += '/'
    }
  }

  if (process.platform === 'win32') prefix = prefix.replace(/\\/g, '/')

  this._emitMatch(index, prefix)
}

GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f),
    needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength) return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c)) c = 'DIR'

    if (!needDir || c === 'DIR') return c

    if (needDir && c === 'FILE') return false
  }

  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = this.fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink())
      try {
        stat = this.fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    else stat = lstat
  }

  this.statCache[abs] = stat

  c = true
  if (stat) c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  return (!needDir || c !== 'FILE') && c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

},
// 14
function (module, exports, __webpack_require__) {

var wrappy = __webpack_require__(9),
  reqs = Object.create(null),
  once = __webpack_require__(10)

module.exports = wrappy(inflight)

function inflight(key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  }
  reqs[key] = [cb]
  return makeres(key)
}

function makeres(key) {
  return once(function RES() {
    var cbs = reqs[key],
      len = cbs.length,
      args = slice(arguments)

    try {
      for (var i = 0; i < len; i++) cbs[i].apply(null, args)
    } finally {
      if (cbs.length > len) {
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else delete reqs[key]
    }
  })
}

function slice(args) {
  var array = []

  for (var length = args.length, i = 0; i < length; i++) array[i] = args[i]
  return array
}

}
]);

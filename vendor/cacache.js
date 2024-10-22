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
  return __webpack_require__(30);
})([
// 0
function (module) {

module.exports = require('path');

},
// 1
function (module) {

module.exports = require('./bluebird');

},
// 2
function (module, exports, __webpack_require__) {

module.exports.pipe = __webpack_require__(23)
module.exports.pipeline = __webpack_require__(35)
module.exports.through = __webpack_require__(38)
module.exports.concat = __webpack_require__(40)
module.exports.finished = __webpack_require__(17)
module.exports.from = __webpack_require__(42)
module.exports.to = __webpack_require__(43)

},
// 3
function (module) {

module.exports = require('fs');

},
// 4
function (module, exports, __webpack_require__) {

class FiggyPudding {
  constructor(specs, opts, providers) {
    this.__specs = specs || {}
    Object.keys(this.__specs).forEach(alias => {
      if (typeof this.__specs[alias] != 'string') return

      const key = this.__specs[alias],
        realSpec = this.__specs[key]
      if (!realSpec) throw new Error(`Alias refers to invalid key: ${key} -> ${alias}`)

      const aliasArr = realSpec.aliases || []
      aliasArr.push(alias, key)
      realSpec.aliases = [...new Set(aliasArr)]
      this.__specs[alias] = realSpec
    })
    this.__opts = opts || {}
    this.__providers = reverse(providers.filter(x => x != null && typeof x == 'object'))
    this.__isFiggyPudding = true
  }
  get(key) {
    return pudGet(this, key, true)
  }
  get [Symbol.toStringTag]() { return 'FiggyPudding' }
  forEach(fn, thisArg = this) {
    for (let [key, value] of this.entries()) fn.call(thisArg, value, key, this)
  }
  toJSON() {
    const obj = {}
    this.forEach((val, key) => {
      obj[key] = val
    })
    return obj
  }
  *entries(_matcher) {
    for (let key of Object.keys(this.__specs)) yield [key, this.get(key)]

    const matcher = _matcher || this.__opts.other
    if (matcher) {
      const seen = new Set()
      for (let p of this.__providers) {
        const iter = p.entries ? p.entries(matcher) : entries(p)
        for (let [key, val] of iter)
          if (matcher(key) && !seen.has(key)) {
            seen.add(key)
            yield [key, val]
          }
      }
    }
  }
  *[Symbol.iterator]() {
    for (let [key, value] of this.entries()) yield [key, value]
  }
  *keys() {
    for (let [key] of this.entries()) yield key
  }
  *values() {
    for (let [, value] of this.entries()) yield value
  }
  concat(...moreConfig) {
    return new Proxy(
      new FiggyPudding(this.__specs, this.__opts, reverse(this.__providers).concat(moreConfig)),
      proxyHandler
    )
  }
}
try {
  const util = __webpack_require__(11)
  FiggyPudding.prototype[util.inspect.custom] = function (depth, opts) {
    return this[Symbol.toStringTag] + ' ' + util.inspect(this.toJSON(), opts)
  }
} catch (_) {}

function BadKeyError(key) {
  throw Object.assign(new Error('invalid config key requested: ' + key), { code: 'EBADKEY' })
}

function pudGet(pud, key, validate) {
  let spec = pud.__specs[key]
  if (validate && !spec && !(pud.__opts.other && pud.__opts.other(key)))
    return BadKeyError(key)

  spec || (spec = {})
  let ret
  for (let p of pud.__providers) {
    ret = tryGet(key, p)
    if (ret === void 0 && spec.aliases && spec.aliases.length)
      for (let alias of spec.aliases)
        if (alias !== key) {
          ret = tryGet(alias, p)
          if (ret !== void 0) break
        }

    if (ret !== void 0) break
  }
  return ret !== void 0 || spec.default === void 0
    ? ret
    : typeof spec.default == 'function'
    ? spec.default(pud)
    : spec.default
}

function tryGet(key, p) {
  return p.__isFiggyPudding
    ? pudGet(p, key, false)
    : typeof p.get == 'function'
    ? p.get(key)
    : p[key]
}

const proxyHandler = /** @type {ProxyHandler<FiggyPudding>} */ {
  has: (obj, prop) => prop in obj.__specs && pudGet(obj, prop, false) !== void 0,
  ownKeys: obj => Object.keys(obj.__specs),
  get: (obj, prop) =>
    typeof prop == 'symbol' || prop.slice(0, 2) === '__' || prop in FiggyPudding.prototype
      ? obj[prop]
      : obj.get(prop),
  set(obj, prop, value) {
    if (typeof prop == 'symbol' || prop.slice(0, 2) === '__') {
      obj[prop] = value
      return true
    }
    throw new Error('figgyPudding options cannot be modified. Use .concat() instead.')
  },
  deleteProperty() {
    throw new Error(
      'figgyPudding options cannot be deleted. Use .concat() and shadow them instead.'
    )
  }
}

module.exports = figgyPudding
function figgyPudding(specs, opts) {
  function factory(...providers) {
    return new Proxy(new FiggyPudding(specs, opts, providers), proxyHandler)
  }
  return factory
}

function reverse(arr) {
  const ret = []
  arr.forEach(x => ret.unshift(x))
  return ret
}

function entries(obj) {
  return Object.keys(obj).map(k => [k, obj[k]])
}

},
// 5
function (module, exports, __webpack_require__) {

module.exports = rimraf
rimraf.sync = rimrafSync

var assert = __webpack_require__(52),
  path = __webpack_require__(0),
  fs = __webpack_require__(3),
  glob = void 0
try {
  glob = __webpack_require__(26)
} catch (_) {}
var _0666 = parseInt('666', 8),

  defaultGlobOpts = { nosort: true, silent: true },
  timeout = 0,

  isWindows = process.platform === 'win32'

function defaults(options) {
  ;['unlink', 'chmod', 'stat', 'lstat', 'rmdir', 'readdir'].forEach(function (m) {
    options[m] = options[m] || fs[m]
    options[(m += 'Sync')] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
  options.emfileWait = options.emfileWait || 1000
  if (options.glob === false) options.disableGlob = true

  if (options.disableGlob !== true && glob === void 0)
    throw Error('glob dependency not found, set `options.disableGlob = true` if intentional')

  options.disableGlob = options.disableGlob || false
  options.glob = options.glob || defaultGlobOpts
}

function rimraf(p, options, cb) {
  if (typeof options == 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert.equal(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  var busyTries = 0,
    errState = null,
    n = 0

  if (options.disableGlob || !glob.hasMagic(p)) return afterGlob(null, [p])

  options.lstat(p, function (er, _stat) {
    if (!er) return afterGlob(null, [p])

    glob(p, options.glob, afterGlob)
  })

  function next(er) {
    errState = errState || er
    --n != 0 || cb(errState)
  }

  function afterGlob(er, results) {
    if (er) return cb(er)

    if ((n = results.length) === 0) return cb()

    results.forEach(function (p) {
      rimraf_(p, options, function CB(er) {
        if (er) {
          if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
              busyTries < options.maxBusyTries) {
            busyTries++
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, busyTries * 100)
          }

          if (er.code === 'EMFILE' && timeout < options.emfileWait)
            return setTimeout(function () {
              rimraf_(p, options, CB)
            }, timeout++)

          if (er.code === 'ENOENT') er = null
        }

        timeout = 0
        next(er)
      })
    })
  }
}

function rimraf_(p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb == 'function')

  options.lstat(p, function (er, st) {
    if (er && er.code === 'ENOENT') return cb(null)

    er && er.code === 'EPERM' && isWindows && fixWinEPERM(p, options, er, cb)

    if (st && st.isDirectory()) return rmdir(p, options, er, cb)

    options.unlink(p, function (er) {
      return !er
        ? cb(er)
        : er.code === 'ENOENT'
        ? cb(null)
        : er.code === 'EPERM'
        ? isWindows
          ? fixWinEPERM(p, options, er, cb)
          : rmdir(p, options, er, cb)
        : er.code === 'EISDIR'
        ? rmdir(p, options, er, cb)
        : cb(er)
    })
  })
}

function fixWinEPERM(p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb == 'function')
  er && assert(er instanceof Error)

  options.chmod(p, _0666, function (er2) {
    if (er2) cb(er2.code === 'ENOENT' ? null : er)
    else
      options.stat(p, function (er3, stats) {
        er3
          ? cb(er3.code === 'ENOENT' ? null : er)
          : stats.isDirectory()
          ? rmdir(p, options, er, cb)
          : options.unlink(p, cb)
      })
  })
}

function fixWinEPERMSync(p, options, er) {
  assert(p)
  assert(options)
  er && assert(er instanceof Error)

  try {
    options.chmodSync(p, _0666)
  } catch (er2) {
    if (er2.code === 'ENOENT') return
    throw er
  }

  try {
    var stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === 'ENOENT') return
    throw er
  }

  stats.isDirectory() ? rmdirSync(p, options, er) : options.unlinkSync(p)
}

function rmdir(p, options, originalEr, cb) {
  assert(p)
  assert(options)
  originalEr && assert(originalEr instanceof Error)
  assert(typeof cb == 'function')

  options.rmdir(p, function (er) {
    er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')
      ? rmkids(p, options, cb)
      : er && er.code === 'ENOTDIR'
      ? cb(originalEr)
      : cb(er)
  })
}

function rmkids(p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb == 'function')

  options.readdir(p, function (er, files) {
    if (er) return cb(er)
    var errState,
      n = files.length
    if (n === 0) return options.rmdir(p, cb)
    files.forEach(function (f) {
      rimraf(path.join(p, f), options, function (er) {
        if (errState) return
        if (er) return cb((errState = er))
        --n != 0 || options.rmdir(p, cb)
      })
    })
  })
}

function rimrafSync(p, options) {
  defaults((options = options || {}))

  assert(p, 'rimraf: missing path')
  assert.equal(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.equal(typeof options, 'object', 'rimraf: options should be object')

  var results

  if (options.disableGlob || !glob.hasMagic(p)) results = [p]
  else
    try {
      options.lstatSync(p)
      results = [p]
    } catch (_er) {
      results = glob.sync(p, options.glob)
    }

  if (!results.length) return

  for (var i = 0; i < results.length; i++) {
    p = results[i]

    try {
      var st = options.lstatSync(p)
    } catch (er) {
      if (er.code === 'ENOENT') return

      er.code === 'EPERM' && isWindows && fixWinEPERMSync(p, options, er)
    }

    try {
      st && st.isDirectory() ? rmdirSync(p, options, null) : options.unlinkSync(p)
    } catch (er) {
      if (er.code === 'ENOENT') return
      if (er.code === 'EPERM')
        return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
      if (er.code !== 'EISDIR') throw er

      rmdirSync(p, options, er)
    }
  }
}

function rmdirSync(p, options, originalEr) {
  assert(p)
  assert(options)
  originalEr && assert(originalEr instanceof Error)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') return
    if (er.code === 'ENOTDIR') throw originalEr
    if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')
      rmkidsSync(p, options)
  }
}

function rmkidsSync(p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(function (f) {
    rimrafSync(path.join(p, f), options)
  })

  for (var retries = isWindows ? 100 : 1, i = 0; ; ) {
    var threw = true
    try {
      var ret = options.rmdirSync(p, options)
      threw = false
      return ret
    } finally {
      if (++i < retries && threw) continue
    }
  }
}

},
// 6
function (module) {

module.exports = require('./graceful-fs');

},
// 7
function (module) {

module.exports = require('./readable-stream');

},
// 8
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  contentPath = __webpack_require__(9),
  crypto = __webpack_require__(15),
  figgyPudding = __webpack_require__(4),
  fixOwner = __webpack_require__(13),
  fs = __webpack_require__(6),
  hashToSegments = __webpack_require__(20),
  ms = __webpack_require__(2),
  path = __webpack_require__(0),
  ssri = __webpack_require__(10),

  indexV = __webpack_require__(19)['cache-version'].index,

  appendFileAsync = BB.promisify(fs.appendFile),
  readFileAsync = BB.promisify(fs.readFile),
  readdirAsync = BB.promisify(fs.readdir),
  concat = ms.concat,
  from = ms.from

module.exports.NotFoundError = class extends Error {
  constructor(cache, key) {
    super(`No cache entry for \`${key}\` found in \`${cache}\``)
    this.code = 'ENOENT'
    this.cache = cache
    this.key = key
  }
}

const IndexOpts = figgyPudding({ metadata: {}, size: {} })

module.exports.insert = insert
function insert(cache, key, integrity, opts) {
  opts = IndexOpts(opts)
  const bucket = bucketPath(cache, key)
  const entry = {
    key,
    integrity: integrity && ssri.stringify(integrity),
    time: Date.now(),
    size: opts.size,
    metadata: opts.metadata
  }
  return fixOwner
    .mkdirfix(cache, path.dirname(bucket))
    .then(() => {
      const stringified = JSON.stringify(entry)
      return appendFileAsync(bucket, `\n${hashEntry(stringified)}\t${stringified}`)
    })
    .then(() => fixOwner.chownr(cache, bucket))
    .catch({ code: 'ENOENT' }, () => {})
    .then(() => formatEntry(cache, entry))
}

module.exports.insert.sync = insertSync
function insertSync(cache, key, integrity, opts) {
  opts = IndexOpts(opts)
  const bucket = bucketPath(cache, key)
  const entry = {
    key,
    integrity: integrity && ssri.stringify(integrity),
    time: Date.now(),
    size: opts.size,
    metadata: opts.metadata
  }
  fixOwner.mkdirfix.sync(cache, path.dirname(bucket))
  const stringified = JSON.stringify(entry)
  fs.appendFileSync(bucket, `\n${hashEntry(stringified)}\t${stringified}`)
  try {
    fixOwner.chownr.sync(cache, bucket)
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }
  return formatEntry(cache, entry)
}

module.exports.find = find
function find(cache, key) {
  return bucketEntries(bucketPath(cache, key)).then(entries =>
    entries.reduce(
      (latest, next) => (next && next.key === key ? formatEntry(cache, next) : latest),
      null
    )
  ).catch(err => {
    if (err.code === 'ENOENT') return null

    throw err
  })
}

module.exports.find.sync = findSync
function findSync(cache, key) {
  const bucket = bucketPath(cache, key)
  try {
    return bucketEntriesSync(bucket).reduce(
      (latest, next) => (next && next.key === key ? formatEntry(cache, next) : latest),
      null
    )
  } catch (err) {
    if (err.code === 'ENOENT') return null

    throw err
  }
}

module.exports.delete = del
function del(cache, key, opts) {
  return insert(cache, key, null, opts)
}

module.exports.delete.sync = delSync
function delSync(cache, key, opts) {
  return insertSync(cache, key, null, opts)
}

module.exports.lsStream = lsStream
function lsStream(cache) {
  const indexDir = bucketDir(cache),
    stream = from.obj()

  readdirOrEmpty(indexDir).map(bucket => {
    const bucketPath = path.join(indexDir, bucket)

    return readdirOrEmpty(bucketPath).map(subbucket => {
      const subbucketPath = path.join(bucketPath, subbucket)

      return readdirOrEmpty(subbucketPath).map(entry =>
        bucketEntries(path.join(subbucketPath, entry)).reduce(
          (acc, entry) => (acc.set(entry.key, entry), acc),
          new Map()
        ).then(reduced => {
          for (let entry of reduced.values()) {
            const formatted = formatEntry(cache, entry)
            formatted && stream.push(formatted)
          }
        }).catch({ code: 'ENOENT' }, nop)
      )
    })
  }).then(() => {
    stream.push(null)
  }, err => {
    stream.emit('error', err)
  })

  return stream
}

module.exports.ls = ls
function ls(cache) {
  return BB.fromNode(cb => {
    lsStream(cache).on('error', cb).pipe(
      concat(entries => {
        cb(null, entries.reduce((acc, xs) => ((acc[xs.key] = xs), acc), {}))
      })
    )
  })
}

function bucketEntries(bucket, filter) {
  return readFileAsync(bucket, 'utf8').then(data => _bucketEntries(data, filter))
}

function bucketEntriesSync(bucket, filter) {
  return _bucketEntries(fs.readFileSync(bucket, 'utf8'), filter)
}

function _bucketEntries(data, _filter) {
  let entries = []
  data.split('\n').forEach(entry => {
    if (!entry) return
    const pieces = entry.split('\t')
    if (!pieces[1] || hashEntry(pieces[1]) !== pieces[0]) return

    let obj
    try {
      obj = JSON.parse(pieces[1])
    } catch (_) {
      return
    }
    obj && entries.push(obj)
  })
  return entries
}

module.exports._bucketDir = bucketDir
function bucketDir(cache) {
  return path.join(cache, 'index-v' + indexV)
}

module.exports._bucketPath = bucketPath
function bucketPath(cache, key) {
  const hashed = hashKey(key)
  return path.join.apply(path, [bucketDir(cache)].concat(hashToSegments(hashed)))
}

module.exports._hashKey = hashKey
function hashKey(key) {
  return hash(key, 'sha256')
}

module.exports._hashEntry = hashEntry
function hashEntry(str) {
  return hash(str, 'sha1')
}

function hash(str, digest) {
  return crypto.createHash(digest).update(str).digest('hex')
}

function formatEntry(cache, entry) {
  return !entry.integrity ? null : {
    key: entry.key,
    integrity: entry.integrity,
    path: contentPath(cache, entry.integrity),
    size: entry.size,
    time: entry.time,
    metadata: entry.metadata
  }
}

function readdirOrEmpty(dir) {
  return readdirAsync(dir)
    .catch({ code: 'ENOENT' }, () => [])
    .catch({ code: 'ENOTDIR' }, () => [])
}

function nop() {}

},
// 9
function (module, exports, __webpack_require__) {

const contentVer = __webpack_require__(19)['cache-version'].content,
  hashToSegments = __webpack_require__(20),
  path = __webpack_require__(0),
  ssri = __webpack_require__(10)

module.exports = contentPath
function contentPath(cache, integrity) {
  const sri = ssri.parse(integrity, { single: true })
  return path.join.apply(path,
    [contentDir(cache), sri.algorithm].concat(hashToSegments(sri.hexDigest()))
  )
}

module.exports._contentDir = contentDir
function contentDir(cache) {
  return path.join(cache, 'content-v' + contentVer)
}

},
// 10
function (module, exports, __webpack_require__) {

const crypto = __webpack_require__(15),
  figgyPudding = __webpack_require__(4),
  Transform = __webpack_require__(16).Transform,

  SPEC_ALGORITHMS = ['sha256', 'sha384', 'sha512'],

  BASE64_REGEX = /^[a-z0-9+/]+(?:=?=?)$/i,
  SRI_REGEX = /^([^-]+)-([^?]+)([?\S*]*)$/,
  STRICT_SRI_REGEX = /^([^-]+)-([A-Za-z0-9+/=]{44,88})(\?[\x21-\x7E]*)?$/,
  VCHAR_REGEX = /^[\x21-\x7E]+$/

const SsriOpts = figgyPudding({
  algorithms: { default: ['sha512'] },
  error: { default: false },
  integrity: {},
  options: { default: [] },
  pickAlgorithm: { default: () => getPrioritizedHash },
  Promise: { default: () => Promise },
  sep: { default: ' ' },
  single: { default: false },
  size: {},
  strict: { default: false }
})

class Hash {
  get isHash() { return true }
  constructor(hash, opts) {
    opts = SsriOpts(opts)
    const strict = !!opts.strict
    this.source = hash.trim()
    const match = this.source.match(strict ? STRICT_SRI_REGEX : SRI_REGEX)
    if (!match) return
    if (strict && !SPEC_ALGORITHMS.some(a => a === match[1])) return
    this.algorithm = match[1]
    this.digest = match[2]

    const rawOpts = match[3]
    this.options = rawOpts ? rawOpts.slice(1).split('?') : []
  }
  hexDigest() {
    return this.digest && Buffer.from(this.digest, 'base64').toString('hex')
  }
  toJSON() {
    return this.toString()
  }
  toString(opts) {
    opts = SsriOpts(opts)
    if (opts.strict && !(
        SPEC_ALGORITHMS.some(x => x === this.algorithm) &&
        this.digest.match(BASE64_REGEX) &&
        (this.options || []).every(opt => opt.match(VCHAR_REGEX))))
      return ''

    const options = this.options && this.options.length ? '?' + this.options.join('?') : ''
    return `${this.algorithm}-${this.digest}${options}`
  }
}

class Integrity {
  get isIntegrity() { return true }
  toJSON() {
    return this.toString()
  }
  toString(opts) {
    let sep = (opts = SsriOpts(opts)).sep || ' '
    if (opts.strict) sep = sep.replace(/\S+/g, ' ')

    return Object.keys(this).map(k =>
      this[k]
        .map(hash => Hash.prototype.toString.call(hash, opts))
        .filter(x => x.length).join(sep)
    ).filter(x => x.length).join(sep)
  }
  concat(integrity, opts) {
    opts = SsriOpts(opts)
    const other = typeof integrity == 'string' ? integrity : stringify(integrity, opts)
    return parse(`${this.toString(opts)} ${other}`, opts)
  }
  hexDigest() {
    return parse(this, { single: true }).hexDigest()
  }
  match(integrity, opts) {
    const other = parse(integrity, (opts = SsriOpts(opts))),
      algo = other.pickAlgorithm(opts)
    return (
      this[algo] &&
      other[algo] &&
      this[algo].find(hash => other[algo].find(otherhash => hash.digest === otherhash.digest))
    ) || false
  }
  pickAlgorithm(opts) {
    opts = SsriOpts(opts)
    const pickAlgorithm = opts.pickAlgorithm,
      keys = Object.keys(this)
    if (!keys.length)
      throw new Error('No algorithms available for ' + JSON.stringify(this.toString()))

    return keys.reduce((acc, algo) => pickAlgorithm(acc, algo) || acc)
  }
}

module.exports.parse = parse
function parse(sri, opts) {
  opts = SsriOpts(opts)
  if (typeof sri == 'string') return _parse(sri, opts)
  if (sri.algorithm && sri.digest) {
    const fullSri = new Integrity()
    fullSri[sri.algorithm] = [sri]
    return _parse(stringify(fullSri, opts), opts)
  }
  return _parse(stringify(sri, opts), opts)
}

function _parse(integrity, opts) {
  if (opts.single) return new Hash(integrity, opts)

  return integrity.trim().split(/\s+/).reduce((acc, string) => {
    const hash = new Hash(string, opts)
    if (hash.algorithm && hash.digest) {
      const algo = hash.algorithm
      acc[algo] || (acc[algo] = [])
      acc[algo].push(hash)
    }
    return acc
  }, new Integrity())
}

module.exports.stringify = stringify
function stringify(obj, opts) {
  opts = SsriOpts(opts)
  return obj.algorithm && obj.digest
    ? Hash.prototype.toString.call(obj, opts)
    : typeof obj == 'string'
    ? stringify(parse(obj, opts), opts)
    : Integrity.prototype.toString.call(obj, opts)
}

module.exports.fromHex = fromHex
function fromHex(hexDigest, algorithm, opts) {
  const optString =
    (opts = SsriOpts(opts)).options && opts.options.length ? '?' + opts.options.join('?') : ''
  return parse(
    `${algorithm}-${Buffer.from(hexDigest, 'hex').toString('base64')}${optString}`,
    opts
  )
}

module.exports.fromData = fromData
function fromData(data, opts) {
  const algorithms = (opts = SsriOpts(opts)).algorithms,
    optString = opts.options && opts.options.length ? '?' + opts.options.join('?') : ''
  return algorithms.reduce((acc, algo) => {
    const digest = crypto.createHash(algo).update(data).digest('base64'),
      hash = new Hash(`${algo}-${digest}${optString}`, opts)
    if (hash.algorithm && hash.digest) {
      const algo = hash.algorithm
      acc[algo] || (acc[algo] = [])
      acc[algo].push(hash)
    }
    return acc
  }, new Integrity())
}

module.exports.fromStream = fromStream
function fromStream(stream, opts) {
  const P = (opts = SsriOpts(opts)).Promise || Promise,
    istream = integrityStream(opts)
  return new P((resolve, reject) => {
    stream.pipe(istream)
    stream.on('error', reject)
    istream.on('error', reject)
    let sri
    istream.on('integrity', s => { sri = s })
    istream.on('end', () => resolve(sri))
    istream.on('data', () => {})
  })
}

module.exports.checkData = checkData
function checkData(data, sri, opts) {
  sri = parse(sri, (opts = SsriOpts(opts)))
  if (!Object.keys(sri).length) {
    if (opts.error)
      throw Object.assign(new Error('No valid integrity hashes to check against'), {
        code: 'EINTEGRITY'
      })

    return false
  }
  const algorithm = sri.pickAlgorithm(opts),
    newSri = parse({
      algorithm,
      digest: crypto.createHash(algorithm).update(data).digest('base64')
    }),
    match = newSri.match(sri, opts)
  if (match || !opts.error) return match
  if (typeof opts.size == 'number' && data.length !== opts.size) {
    const err = new Error(
      `data size mismatch when checking ${sri}.\n  Wanted: ${opts.size}\n  Found: ${data.length}`
    )
    err.code = 'EBADSIZE'
    err.found = data.length
    err.expected = opts.size
    err.sri = sri
    throw err
  }
  const err = new Error(
    `Integrity checksum failed when using ${algorithm}: Wanted ${sri}, but got ${newSri}. (${data.length} bytes)`
  )
  err.code = 'EINTEGRITY'
  err.found = newSri
  err.expected = sri
  err.algorithm = algorithm
  err.sri = sri
  throw err
}

module.exports.checkStream = checkStream
function checkStream(stream, sri, opts) {
  const P = (opts = SsriOpts(opts)).Promise || Promise,
    checker = integrityStream(opts.concat({ integrity: sri }))
  return new P((resolve, reject) => {
    stream.pipe(checker)
    stream.on('error', reject)
    checker.on('error', reject)
    let sri
    checker.on('verified', s => { sri = s })
    checker.on('end', () => resolve(sri))
    checker.on('data', () => {})
  })
}

module.exports.integrityStream = integrityStream
function integrityStream(opts) {
  const sri = (opts = SsriOpts(opts)).integrity && parse(opts.integrity, opts),
    goodSri = sri && Object.keys(sri).length,
    algorithm = goodSri && sri.pickAlgorithm(opts),
    digests = goodSri && sri[algorithm],
    algorithms = Array.from(new Set(opts.algorithms.concat(algorithm ? [algorithm] : []))),
    hashes = algorithms.map(crypto.createHash)
  let streamSize = 0
  const stream = new Transform({
    transform(chunk, enc, cb) {
      streamSize += chunk.length
      hashes.forEach(h => h.update(chunk, enc))
      cb(null, chunk, enc)
    }
  }).on('end', () => {
    const optString = opts.options && opts.options.length ? '?' + opts.options.join('?') : '',
      newSri = parse(
        hashes.map((h, i) => `${algorithms[i]}-${h.digest('base64')}${optString}`).join(' '),
        opts
      ),
      match = goodSri && newSri.match(sri, opts)
    if (typeof opts.size == 'number' && streamSize !== opts.size) {
      const err = new Error(
        `stream size mismatch when checking ${sri}.\n  Wanted: ${opts.size}\n  Found: ${streamSize}`
      )
      err.code = 'EBADSIZE'
      err.found = streamSize
      err.expected = opts.size
      err.sri = sri
      stream.emit('error', err)
    } else if (opts.integrity && !match) {
      const err = new Error(
        `${sri} integrity checksum failed when using ${algorithm}: wanted ${digests} but got ${newSri}. (${streamSize} bytes)`
      )
      err.code = 'EINTEGRITY'
      err.found = newSri
      err.expected = digests
      err.algorithm = algorithm
      err.sri = sri
      stream.emit('error', err)
    } else {
      stream.emit('size', streamSize)
      stream.emit('integrity', newSri)
      match && stream.emit('verified', match)
    }
  })
  return stream
}

module.exports.create = createIntegrity
function createIntegrity(opts) {
  const algorithms = (opts = SsriOpts(opts)).algorithms,
    optString = opts.options.length ? '?' + opts.options.join('?') : '',

    hashes = algorithms.map(crypto.createHash)

  return {
    update: function (chunk, enc) {
      hashes.forEach(h => h.update(chunk, enc))
      return this
    },
    digest: function (_enc) {
      return algorithms.reduce((acc, algo) => {
        const digest = hashes.shift().digest('base64'),
          hash = new Hash(`${algo}-${digest}${optString}`, opts)
        if (hash.algorithm && hash.digest) {
          const algo = hash.algorithm
          acc[algo] || (acc[algo] = [])
          acc[algo].push(hash)
        }
        return acc
      }, new Integrity())
    }
  }
}

const NODE_HASHES = new Set(crypto.getHashes())

const DEFAULT_PRIORITY = [
  'md5', 'whirlpool', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512',
  'sha3',
  'sha3-256', 'sha3-384', 'sha3-512',
  'sha3_256', 'sha3_384', 'sha3_512'
].filter(algo => NODE_HASHES.has(algo))

function getPrioritizedHash(algo1, algo2) {
  return DEFAULT_PRIORITY.indexOf(algo1.toLowerCase()) >=
    DEFAULT_PRIORITY.indexOf(algo2.toLowerCase())
    ? algo1
    : algo2
}

},
// 11
function (module) {

module.exports = require('util');

},
// 12
function (module) {

module.exports = require('util').inherits;

},
// 13
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  chownr = BB.promisify(__webpack_require__(32)),
  mkdirp = BB.promisify(__webpack_require__(21)),
  inflight = __webpack_require__(22),
  inferOwner = __webpack_require__(33),

  self = { uid: null, gid: null }
const getSelf = () => {
  if (typeof self.uid != 'number') {
    self.uid = process.getuid()
    const setuid = process.setuid
    process.setuid = (uid) => {
      self.uid = null
      process.setuid = setuid
      return process.setuid(uid)
    }
  }
  if (typeof self.gid != 'number') {
    self.gid = process.getgid()
    const setgid = process.setgid
    process.setgid = (gid) => {
      self.gid = null
      process.setgid = setgid
      return process.setgid(gid)
    }
  }
}

module.exports.chownr = fixOwner
function fixOwner(cache, filepath) {
  if (!process.getuid) return BB.resolve()

  getSelf()

  return self.uid !== 0 ? BB.resolve() : BB.resolve(inferOwner(cache)).then(owner => {
    const { uid, gid } = owner

    if (self.uid === uid && self.gid === gid) return

    return inflight('fixOwner: fixing ownership on ' + filepath, () =>
      chownr(
        filepath,
        typeof uid == 'number' ? uid : self.uid,
        typeof gid == 'number' ? gid : self.gid
      ).catch({ code: 'ENOENT' }, () => null)
    )
  })
}

module.exports.chownr.sync = fixOwnerSync
function fixOwnerSync(cache, filepath) {
  if (!process.getuid) return

  const { uid, gid } = inferOwner.sync(cache)
  getSelf()
  if (self.uid === uid && self.gid === gid) return

  try {
    chownr.sync(
      filepath,
      typeof uid == 'number' ? uid : self.uid,
      typeof gid == 'number' ? gid : self.gid
    )
  } catch (err) {
    if (err.code === 'ENOENT') return null

    throw err
  }
}

module.exports.mkdirfix = mkdirfix
function mkdirfix(cache, p, _cb) {
  return BB.resolve(inferOwner(cache)).then(() =>
    mkdirp(p).then(made => {
      if (made) return fixOwner(cache, made).then(() => made)
    }).catch({ code: 'EEXIST' }, () => fixOwner(cache, p).then(() => null))
  )
}

module.exports.mkdirfix.sync = mkdirfixSync
function mkdirfixSync(cache, p) {
  try {
    inferOwner.sync(cache)
    const made = mkdirp.sync(p)
    if (made) {
      fixOwnerSync(cache, made)
      return made
    }
  } catch (err) {
    if (err.code === 'EEXIST') {
      fixOwnerSync(cache, p)
      return null
    }
    throw err
  }
}

},
// 14
function (module, exports, __webpack_require__) {

let MEMOIZED = new (__webpack_require__(45))({
  max: 52428800,
  maxAge: 180000,
  length: (entry, key) =>
    key.startsWith('key:')
      ? entry.data.length
      : key.startsWith('digest:')
      ? entry.length
      : void 0
})

module.exports.clearMemoized = clearMemoized
function clearMemoized() {
  const old = {}
  MEMOIZED.forEach((v, k) => {
    old[k] = v
  })
  MEMOIZED.reset()
  return old
}

module.exports.put = put
function put(cache, entry, data, opts) {
  pickMem(opts).set(`key:${cache}:${entry.key}`, { entry, data })
  putDigest(cache, entry.integrity, data, opts)
}

module.exports.put.byDigest = putDigest
function putDigest(cache, integrity, data, opts) {
  pickMem(opts).set(`digest:${cache}:${integrity}`, data)
}

module.exports.get = get
function get(cache, key, opts) {
  return pickMem(opts).get(`key:${cache}:${key}`)
}

module.exports.get.byDigest = getDigest
function getDigest(cache, integrity, opts) {
  return pickMem(opts).get(`digest:${cache}:${integrity}`)
}

class ObjProxy {
  constructor(obj) {
    this.obj = obj
  }
  get(key) { return this.obj[key] }
  set(key, val) { this.obj[key] = val }
}

function pickMem(opts) {
  return !opts || !opts.memoize
    ? MEMOIZED
    : opts.memoize.get && opts.memoize.set
    ? opts.memoize
    : typeof opts.memoize == 'object'
    ? new ObjProxy(opts.memoize)
    : MEMOIZED
}

},
// 15
function (module) {

module.exports = require('crypto');

},
// 16
function (module) {

module.exports = require('stream');

},
// 17
function (module, exports, __webpack_require__) {

var once = __webpack_require__(24),

  noop = function () {};

var isRequest = function (stream) {
  return stream.setHeader && typeof stream.abort == 'function';
};

var isChildProcess = function (stream) {
  return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
};

var eos = function (stream, opts, callback) {
  if (typeof opts == 'function') return eos(stream, null, opts);
  opts || (opts = {});

  callback = once(callback || noop);

  var ws = stream._writableState,
    rs = stream._readableState,
    readable = opts.readable || (opts.readable !== false && stream.readable),
    writable = opts.writable || (opts.writable !== false && stream.writable),
    cancelled = false;

  var onlegacyfinish = function () {
    stream.writable || onfinish();
  };

  var onfinish = function () {
    writable = false;
    readable || callback.call(stream);
  };

  var onend = function () {
    readable = false;
    writable || callback.call(stream);
  };

  var onexit = function (exitCode) {
    callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
  };

  var onerror = function (err) {
    callback.call(stream, err);
  };

  var onclose = function () {
    process.nextTick(onclosenexttick);
  };

  var onclosenexttick = function () {
    if (cancelled) return;
    if ((readable && !(rs && rs.ended && !rs.destroyed)) ||
        (writable && !(ws && ws.ended && !ws.destroyed)))
      return callback.call(stream, new Error('premature close'));
  };

  var onrequest = function () {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    stream.req ? onrequest() : stream.on('request', onrequest);
  } else if (writable && !ws) {
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  isChildProcess(stream) && stream.on('exit', onexit);

  stream.on('end', onend);
  stream.on('finish', onfinish);
  opts.error === false || stream.on('error', onerror);
  stream.on('close', onclose);

  return function () {
    cancelled = true;
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    stream.req && stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('exit', onexit);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
};

module.exports = eos;

},
// 18
function (module) {

function isArguments(thingy) {
  return thingy != null && typeof thingy == 'object' && thingy.hasOwnProperty('callee')
}

var types = {
  '*': { label: 'any', check: function () { return true } },
  A: {
    label: 'array',
    check: function (thingy) { return Array.isArray(thingy) || isArguments(thingy) }
  },
  S: { label: 'string', check: function (thingy) { return typeof thingy == 'string' } },
  N: { label: 'number', check: function (thingy) { return typeof thingy == 'number' } },
  F: {
    label: 'function',
    check: function (thingy) { return typeof thingy == 'function' }
  },
  O: {
    label: 'object',
    check: function (thingy) {
      return typeof thingy == 'object' && thingy != null &&
        !types.A.check(thingy) && !types.E.check(thingy)
    }
  },
  B: {
    label: 'boolean',
    check: function (thingy) { return typeof thingy == 'boolean' }
  },
  E: { label: 'error', check: function (thingy) { return thingy instanceof Error } },
  Z: { label: 'null', check: function (thingy) { return thingy == null } }
}

function addSchema(schema, arity) {
  var group = (arity[schema.length] = arity[schema.length] || [])
  group.indexOf(schema) < 0 && group.push(schema)
}

var validate = (module.exports = function (rawSchemas, args) {
  if (arguments.length !== 2) throw wrongNumberOfArgs(['SA'], arguments.length)
  if (!rawSchemas) throw missingRequiredArg(0, 'rawSchemas')
  if (!args) throw missingRequiredArg(1, 'args')
  if (!types.S.check(rawSchemas)) throw invalidType(0, ['string'], rawSchemas)
  if (!types.A.check(args)) throw invalidType(1, ['array'], args)
  var schemas = rawSchemas.split('|'),
    arity = {}

  schemas.forEach(function (schema) {
    for (var ii = 0; ii < schema.length; ++ii) {
      var type = schema[ii]
      if (!types[type]) throw unknownType(ii, type)
    }
    if (/E.*E/.test(schema)) throw moreThanOneError(schema)
    addSchema(schema, arity)
    if (/E/.test(schema)) {
      addSchema(schema.replace(/E.*$/, 'E'), arity)
      addSchema(schema.replace(/E/, 'Z'), arity)
      schema.length !== 1 || addSchema('', arity)
    }
  })
  var matching = arity[args.length]
  if (!matching) throw wrongNumberOfArgs(Object.keys(arity), args.length)

  for (var ii = 0; ii < args.length; ++ii) {
    var newMatching = matching.filter(function (schema) {
      var type = schema[ii]
      return (0, types[type].check)(args[ii])
    })
    if (!newMatching.length) {
      var labels = matching.map(function (schema) {
        return types[schema[ii]].label
      }).filter(function (schema) { return schema != null })
      throw invalidType(ii, labels, args[ii])
    }
    matching = newMatching
  }
})

function missingRequiredArg(num) {
  return newException('EMISSINGARG', 'Missing required argument #' + (num + 1))
}

function unknownType(num, type) {
  return newException('EUNKNOWNTYPE', 'Unknown type ' + type + ' in argument #' + (num + 1))
}

function invalidType(num, expectedTypes, value) {
  var valueType = void 0
  Object.keys(types).forEach(function (typeCode) {
    if (types[typeCode].check(value)) valueType = types[typeCode].label
  })
  return newException('EINVALIDTYPE',
    'Argument #' + (num + 1) + ': Expected ' + englishList(expectedTypes) + ' but got ' + valueType
  )
}

function englishList(list) {
  return list.join(', ').replace(/, ([^,]+)$/, ' or $1')
}

function wrongNumberOfArgs(expected, got) {
  return newException('EWRONGARGCOUNT',
    'Expected ' + englishList(expected) + ' ' +
    (expected.every(function (ex) { return ex.length === 1 }) ? 'argument' : 'arguments') +
    ' but got ' + got
  )
}

function moreThanOneError(schema) {
  return newException('ETOOMANYERRORTYPES',
    'Only one error type per argument signature is allowed, more than one found in "' + schema + '"'
  )
}

function newException(code, msg) {
  var e = new Error(msg)
  e.code = code
  Error.captureStackTrace && Error.captureStackTrace(e, validate)
  return e
}

},
// 19
function (module) {

module.exports = {
  name: 'cacache',
  version: '12.0.4',
  'cache-version': { content: '2', index: '5' },
  description: 'Fast, fault-tolerant, disk-based, data-agnostic, content-addressable cache.'
};

},
// 20
function (module) {

module.exports = hashToSegments

function hashToSegments(hash) {
  return [hash.slice(0, 2), hash.slice(2, 4), hash.slice(4)]
}

},
// 21
function (module, exports, __webpack_require__) {

var path = __webpack_require__(0),
  fs = __webpack_require__(3),
  _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP(p, opts, f, made) {
  if (typeof opts == 'function') {
    f = opts;
    opts = {};
  } else if (!opts || typeof opts != 'object') opts = { mode: opts };

  var mode = opts.mode,
    xfs = opts.fs || fs;

  if (mode === void 0) mode = _0777;

  made || (made = null);

  var cb = f || function () {};
  p = path.resolve(p);

  xfs.mkdir(p, mode, function (er) {
    if (!er) return cb(null, (made = made || p));

    switch (er.code) {
      case 'ENOENT':
        var d = path.dirname(p);
        if (d === p) return cb(er);
        mkdirP(d, opts, function (er, made) {
          er ? cb(er, made) : mkdirP(p, opts, cb, made);
        });
        break;

      default:
        xfs.stat(p, function (er2, stat) {
          er2 || !stat.isDirectory() ? cb(er, made) : cb(null, made);
        });
        break;
    }
  });
}

mkdirP.sync = function sync(p, opts, made) {
  if (!opts || typeof opts != 'object') opts = { mode: opts };

  var mode = opts.mode,
    xfs = opts.fs || fs;

  if (mode === void 0) mode = _0777;

  made || (made = null);

  p = path.resolve(p);

  try {
    xfs.mkdirSync(p, mode);
    made = made || p;
  } catch (err0) {
    switch (err0.code) {
      case 'ENOENT':
        var d = path.dirname(p);
        if (d === p) throw err0;
        made = sync(d, opts, made);
        sync(p, opts, made);
        break;

      default:
        var stat;
        try {
          stat = xfs.statSync(p);
        } catch (_err1) {
          throw err0;
        }
        if (!stat.isDirectory()) throw err0;
        break;
    }
  }

  return made;
};

},
// 22
function (module, exports, __webpack_require__) {

module.exports = inflight

let Bluebird
try {
  Bluebird = __webpack_require__(1)
} catch (_) {
  Bluebird = Promise
}

const active = {}
inflight.active = active
function inflight(unique, doFly) {
  return Bluebird.all([unique, doFly]).then(function (args) {
    const unique = args[0],
      doFly = args[1]
    return Array.isArray(unique)
      ? Bluebird.all(unique).then(function (uniqueArr) {
          return _inflight(uniqueArr.join(''), doFly)
        })
      : _inflight(unique, doFly)
  })

  function _inflight(unique, doFly) {
    if (!active[unique]) {
      active[unique] = new Bluebird(function (resolve) {
        return resolve(doFly())
      })
      active[unique].then(cleanup, cleanup)
      function cleanup() { delete active[unique] }
    }
    return active[unique]
  }
}

},
// 23
function (module, exports, __webpack_require__) {

var once = __webpack_require__(24),
  eos = __webpack_require__(17),
  fs = __webpack_require__(3),

  noop = function () {},
  ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn == 'function'
}

var isFS = function (stream) {
  return !!ancient && !!fs &&
    (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) &&
    isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, { readable: reading, writable: writing }, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed || destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop)
    if (isRequest(stream)) return stream.abort()

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

module.exports = function () {
  var error,
    streams = Array.prototype.slice.call(arguments),
    callback = (isFn(streams[streams.length - 1] || noop) && streams.pop()) || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    return destroyer(stream, reading, i > 0, function (err) {
      error || (error = err)
      err && destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

},
// 24
function (module, exports, __webpack_require__) {

var wrappy = __webpack_require__(34)
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
// 25
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  contentPath = __webpack_require__(9),
  figgyPudding = __webpack_require__(4),
  /** @property {*} copyFileSync */ fs = __webpack_require__(6),
  PassThrough = __webpack_require__(16).PassThrough,
  pipe = BB.promisify(__webpack_require__(2).pipe),
  ssri = __webpack_require__(10),

  lstatAsync = BB.promisify(fs.lstat),
  readFileAsync = BB.promisify(fs.readFile),

  ReadOpts = figgyPudding({ size: {} })

module.exports = read
function read(cache, integrity, opts) {
  opts = ReadOpts(opts)
  return withContentSri(cache, integrity, (cpath, sri) =>
    readFileAsync(cpath, null).then(data => {
      if (typeof opts.size == 'number' && opts.size !== data.length)
        throw sizeError(opts.size, data.length)
      if (ssri.checkData(data, sri)) return data

      throw integrityError(sri, cpath)
    })
  )
}

module.exports.sync = readSync
function readSync(cache, integrity, opts) {
  opts = ReadOpts(opts)
  return withContentSriSync(cache, integrity, (cpath, sri) => {
    const data = fs.readFileSync(cpath)
    if (typeof opts.size == 'number' && opts.size !== data.length)
      throw sizeError(opts.size, data.length)
    if (ssri.checkData(data, sri)) return data

    throw integrityError(sri, cpath)
  })
}

module.exports.stream = readStream
module.exports.readStream = readStream
function readStream(cache, integrity, opts) {
  opts = ReadOpts(opts)
  const stream = new PassThrough()
  withContentSri(cache, integrity, (cpath, sri) =>
    lstatAsync(cpath).then(stat => ({ cpath, sri, stat }))
  ).then(({ cpath, sri, stat }) =>
    pipe(
      fs.createReadStream(cpath),
      ssri.integrityStream({ integrity: sri, size: opts.size }),
      stream
    )
  ).catch(err => {
    stream.emit('error', err)
  })
  return stream
}

let copyFileAsync
if (fs.copyFile) {
  module.exports.copy = copy
  module.exports.copy.sync = copySync
  copyFileAsync = BB.promisify(fs.copyFile)
}

function copy(cache, integrity, dest, opts) {
  opts = ReadOpts(opts)
  return withContentSri(cache, integrity, (cpath, _sri) => copyFileAsync(cpath, dest))
}

function copySync(cache, integrity, dest, opts) {
  opts = ReadOpts(opts)
  return withContentSriSync(cache, integrity, (cpath, _sri) => fs.copyFileSync(cpath, dest))
}

module.exports.hasContent = hasContent
function hasContent(cache, integrity) {
  if (!integrity) return BB.resolve(false)
  return withContentSri(cache, integrity, (cpath, sri) =>
    lstatAsync(cpath).then(stat => ({ size: stat.size, sri, stat }))
  ).catch(err => {
    if (err.code === 'ENOENT') return false
    if (err.code === 'EPERM') {
      if (process.platform !== 'win32') throw err

      return false
    }
  })
}

module.exports.hasContent.sync = hasContentSync
function hasContentSync(cache, integrity) {
  if (!integrity) return false
  return withContentSriSync(cache, integrity, (cpath, sri) => {
    try {
      const stat = fs.lstatSync(cpath)
      return { size: stat.size, sri, stat }
    } catch (err) {
      if (err.code === 'ENOENT') return false
      if (err.code === 'EPERM') {
        if (process.platform !== 'win32') throw err

        return false
      }
    }
  })
}

function withContentSri(cache, integrity, fn) {
  return BB.try(() => {
    const sri = ssri.parse(integrity),
      algo = sri.pickAlgorithm(),
      digests = sri[algo]
    if (digests.length <= 1) {
      const cpath = contentPath(cache, digests[0])
      return fn(cpath, digests[0])
    }
    return BB.any(
      sri[sri.pickAlgorithm()].map(meta => withContentSri(cache, meta, fn), { concurrency: 1 })
    ).catch(err => {
      throw [].some.call(err, e => e.code === 'ENOENT')
        ? Object.assign(new Error('No matching content found for ' + sri.toString()), {
            code: 'ENOENT'
          })
        : err[0]
    })
  })
}

function withContentSriSync(cache, integrity, fn) {
  const sri = ssri.parse(integrity),
    algo = sri.pickAlgorithm(),
    digests = sri[algo]
  if (digests.length <= 1) return fn(contentPath(cache, digests[0]), digests[0])

  let lastErr = null
  for (const meta of sri[sri.pickAlgorithm()])
    try {
      return withContentSriSync(cache, meta, fn)
    } catch (err) {
      lastErr = err
    }

  if (lastErr) throw lastErr
}

function sizeError(expected, found) {
  var err = new Error(
    `Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`
  )
  err.expected = expected
  err.found = found
  err.code = 'EBADSIZE'
  return err
}

function integrityError(sri, path) {
  var err = new Error(`Integrity verification failed for ${sri} (${path})`)
  err.code = 'EINTEGRITY'
  err.sri = sri
  err.path = path
  return err
}

},
// 26
function (module) {

module.exports = require('./glob');

},
// 27
function (module) {

var cache;

function MurmurHash3(key, seed) {
  var m = this instanceof MurmurHash3 ? this : cache;
  m.reset(seed);
  typeof key == 'string' && key.length > 0 && m.hash(key);

  if (m !== this) return m;
}

MurmurHash3.prototype.hash = function (key) {
  var h1, k1, i, top, len;

  len = key.length;
  this.len += len;

  k1 = this.k1;
  i = 0;
  switch (this.rem) {
    case 0: k1 ^= len > i ? key.charCodeAt(i++) & 0xffff : 0;
    case 1: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 8 : 0;
    case 2: k1 ^= len > i ? (key.charCodeAt(i++) & 0xffff) << 16 : 0;
    case 3:
      k1 ^= len > i ? (key.charCodeAt(i) & 0xff) << 24 : 0;
      k1 ^= len > i ? (key.charCodeAt(i++) & 0xff00) >> 8 : 0;
  }

  this.rem = (len + this.rem) & 3;
  if ((len -= this.rem) > 0) {
    h1 = this.h1;
    while (1) {
      k1 = (k1 * 0x2d51 + 0xcc9e0000 * (k1 & 0xffff)) & 0xffffffff;
      k1 = (0x3593 * (k1 = (k1 << 15) | (k1 >>> 17)) + 0x1b870000 * (k1 & 0xffff)) & 0xffffffff;

      h1 = (5 * (h1 = ((h1 ^= k1) << 13) | (h1 >>> 19)) + 0xe6546b64) & 0xffffffff;

      if (i >= len) break;

      k1 = (key.charCodeAt(i++) & 0xffff) ^
        ((key.charCodeAt(i++) & 0xffff) << 8) ^
        ((key.charCodeAt(i++) & 0xffff) << 16);
      k1 ^= (((top = key.charCodeAt(i++)) & 0xff) << 24) ^ ((top & 0xff00) >> 8);
    }

    k1 = 0;
    switch (this.rem) {
      case 3: k1 ^= (key.charCodeAt(i + 2) & 0xffff) << 16;
      case 2: k1 ^= (key.charCodeAt(i + 1) & 0xffff) << 8;
      case 1: k1 ^= key.charCodeAt(i) & 0xffff;
    }

    this.h1 = h1;
  }

  this.k1 = k1;
  return this;
};

MurmurHash3.prototype.result = function () {
  var k1, h1;

  k1 = this.k1;
  h1 = this.h1;

  if (k1 > 0) {
    k1 = (k1 * 0x2d51 + 0xcc9e0000 * (k1 & 0xffff)) & 0xffffffff;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = (0x3593 * k1 + 0x1b870000 * (k1 & 0xffff)) & 0xffffffff;
    h1 ^= k1;
  }

  h1 ^= this.len;

  h1 = (0xca6b * (h1 ^= h1 >>> 16) + 0x85eb0000 * (h1 & 0xffff)) & 0xffffffff;
  h1 = (0xae35 * (h1 ^= h1 >>> 13) + 0xc2b20000 * (h1 & 0xffff)) & 0xffffffff;

  h1 ^= h1 >>> 16;
  return h1 >>> 0;
};

MurmurHash3.prototype.reset = function (seed) {
  this.h1 = typeof seed == 'number' ? seed : 0;
  this.rem = this.k1 = this.len = 0;
  return this;
};

cache = new MurmurHash3();

module.exports = MurmurHash3;

},
// 28
function (module, exports, __webpack_require__) {

module.exports = RunQueue

var validate = __webpack_require__(18)

function RunQueue(opts) {
  validate('Z|O', [opts])
  opts || (opts = {})
  this.finished = false
  this.inflight = 0
  this.maxConcurrency = opts.maxConcurrency || 1
  this.queued = 0
  this.queue = []
  this.currentPrio = null
  this.currentQueue = null
  this.Promise = opts.Promise || global.Promise
  this.deferred = {}
}

RunQueue.prototype = {}

RunQueue.prototype.run = function () {
  if (arguments.length > 0) throw new Error('RunQueue.run takes no arguments')
  var self = this,
    deferred = this.deferred
  if (!deferred.promise)
    deferred.promise = new this.Promise(function (resolve, reject) {
      deferred.resolve = resolve
      deferred.reject = reject
      self._runQueue()
    })

  return deferred.promise
}

RunQueue.prototype._runQueue = function () {
  var self = this

  while (this.inflight < this.maxConcurrency && this.queued) {
    if (!this.currentQueue || this.currentQueue.length === 0) {
      if (this.inflight) return
      for (var prios = Object.keys(this.queue), ii = 0; ii < prios.length; ++ii) {
        var prioQueue = this.queue[prios[ii]]
        if (prioQueue.length) {
          this.currentQueue = prioQueue
          this.currentPrio = prios[ii]
          break
        }
      }
    }

    --this.queued
    ++this.inflight
    var next = this.currentQueue.shift(),
      args = next.args || []

    new this.Promise(function (resolve) {
      // noinspection JSReferencingMutableVariableFromClosure
      resolve(next.cmd.apply(null, args))
    }).then(function () {
      --self.inflight
      if (self.finished) return
      if (self.queued <= 0 && self.inflight <= 0) {
        self.finished = true
        self.deferred.resolve()
      }
      self._runQueue()
    }, function (err) {
      self.finished = true
      self.deferred.reject(err)
    })
  }
}

RunQueue.prototype.add = function (prio, cmd, args) {
  if (this.finished) throw new Error("Can't add to a finished queue. Create a new queue.")
  if (Math.abs(Math.floor(prio)) !== prio)
    throw new Error('Priorities must be a positive integer value.')
  validate('NFA|NFZ', [prio, cmd, args])
  prio = Number(prio)
  this.queue[prio] || (this.queue[prio] = [])
  ++this.queued
  this.queue[prio].push({ cmd: cmd, args: args })
  if (this.currentPrio > prio) {
    this.currentQueue = this.queue[prio]
    this.currentPrio = prio
  }
}

},
// 29
function (module, exports, __webpack_require__) {

var path = __webpack_require__(0),

  uniqueSlug = __webpack_require__(57)

module.exports = function (filepath, prefix, uniq) {
  return path.join(filepath, (prefix ? prefix + '-' : '') + uniqueSlug(uniq))
}

},
// 30
function (module, exports, __webpack_require__) {

const ls = __webpack_require__(31),
  get = __webpack_require__(44),
  put = __webpack_require__(48),
  rm = __webpack_require__(58),
  verify = __webpack_require__(60),
  clearMemoized = __webpack_require__(14).clearMemoized,
  tmp = __webpack_require__(61),

  x = module.exports

x.ls = cache => ls(cache)
x.ls.stream = cache => ls.stream(cache)

x.get = (cache, key, opts) => get(cache, key, opts)
x.get.byDigest = (cache, hash, opts) => get.byDigest(cache, hash, opts)
x.get.sync = (cache, key, opts) => get.sync(cache, key, opts)
x.get.sync.byDigest = (cache, key, opts) => get.sync.byDigest(cache, key, opts)
x.get.stream = (cache, key, opts) => get.stream(cache, key, opts)
x.get.stream.byDigest = (cache, hash, opts) => get.stream.byDigest(cache, hash, opts)
x.get.copy = (cache, key, dest, opts) => get.copy(cache, key, dest, opts)
x.get.copy.byDigest = (cache, hash, dest, opts) => get.copy.byDigest(cache, hash, dest, opts)
x.get.info = (cache, key) => get.info(cache, key)
x.get.hasContent = (cache, hash) => get.hasContent(cache, hash)
x.get.hasContent.sync = (cache, hash) => get.hasContent.sync(cache, hash)

x.put = (cache, key, data, opts) => put(cache, key, data, opts)
x.put.stream = (cache, key, opts) => put.stream(cache, key, opts)

x.rm = (cache, key) => rm.entry(cache, key)
x.rm.all = cache => rm.all(cache)
x.rm.entry = x.rm
x.rm.content = (cache, hash) => rm.content(cache, hash)

x.clearMemoized = () => clearMemoized()

x.tmp = {}
x.tmp.mkdir = (cache, opts) => tmp.mkdir(cache, opts)
x.tmp.withTmp = (cache, opts, cb) => tmp.withTmp(cache, opts, cb)

x.verify = (cache, opts) => verify(cache, opts)
x.verify.lastRun = cache => verify.lastRun(cache)

},
// 31
function (module, exports, __webpack_require__) {

var index = __webpack_require__(8)

module.exports = index.ls
module.exports.stream = index.lsStream

},
// 32
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(3),
  path = __webpack_require__(0),

  LCHOWN = fs.lchown ? 'lchown' : 'chown',
  LCHOWNSYNC = fs.lchownSync ? 'lchownSync' : 'chownSync',

  needEISDIRHandled = fs.lchown && /^v?(\d\.|10\.[0-5]\b)/.test(process.version)

const lchownSync = (path, uid, gid) => {
  try {
    return fs[LCHOWNSYNC](path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT') throw er
  }
}

const chownSync = (path, uid, gid) => {
  try {
    return fs.chownSync(path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT') throw er
  }
}

const handleEISDIR = needEISDIRHandled
  ? (path, uid, gid, cb) => er => {
      er && er.code === 'EISDIR' ? fs.chown(path, uid, gid, cb) : cb(er)
    }
  : (_, __, ___, cb) => cb

const handleEISDirSync = needEISDIRHandled
  ? (path, uid, gid) => {
      try {
        return lchownSync(path, uid, gid)
      } catch (er) {
        if (er.code !== 'EISDIR') throw er
        chownSync(path, uid, gid)
      }
    }
  : (path, uid, gid) => lchownSync(path, uid, gid)

const nodeVersion = process.version
let readdir = (path, options, cb) => fs.readdir(path, options, cb),
  readdirSync = (path, options) => fs.readdirSync(path, options)
if (/^v4\./.test(nodeVersion)) readdir = (path, options, cb) => fs.readdir(path, cb)

const chown = (cpath, uid, gid, cb) => {
  fs[LCHOWN](cpath, uid, gid, handleEISDIR(cpath, uid, gid, er => {
    cb(er && er.code !== 'ENOENT' ? er : null)
  }))
}

const chownrKid = (p, child, uid, gid, cb) => {
  if (typeof child == 'string')
    return fs.lstat(path.resolve(p, child), (er, stats) => {
      if (er) return cb(er.code !== 'ENOENT' ? er : null)
      stats.name = child
      chownrKid(p, stats, uid, gid, cb)
    })

  if (child.isDirectory())
    chownr(path.resolve(p, child.name), uid, gid, er => {
      if (er) return cb(er)
      const cpath = path.resolve(p, child.name)
      chown(cpath, uid, gid, cb)
    })
  else {
    const cpath = path.resolve(p, child.name)
    chown(cpath, uid, gid, cb)
  }
}

const chownr = (p, uid, gid, cb) => {
  readdir(p, { withFileTypes: true }, (er, children) => {
    if (er) {
      if (er.code === 'ENOENT') return cb()
      if (er.code !== 'ENOTDIR' && er.code !== 'ENOTSUP') return cb(er)
    }
    if (er || !children.length) return chown(p, uid, gid, cb)

    let len = children.length,
      errState = null
    const then = er => {
      if (errState) return
      return er ? cb((errState = er)) : --len == 0 ? chown(p, uid, gid, cb) : void 0
    }

    children.forEach(child => chownrKid(p, child, uid, gid, then))
  })
}

const chownrKidSync = (p, child, uid, gid) => {
  if (typeof child == 'string')
    try {
      const stats = fs.lstatSync(path.resolve(p, child))
      stats.name = child
      child = stats
    } catch (er) {
      if (er.code === 'ENOENT') return

      throw er
    }

  child.isDirectory() && chownrSync(path.resolve(p, child.name), uid, gid)

  handleEISDirSync(path.resolve(p, child.name), uid, gid)
}

const chownrSync = (p, uid, gid) => {
  let children
  try {
    children = readdirSync(p, { withFileTypes: true })
  } catch (er) {
    if (er.code === 'ENOENT') return
    if (er.code === 'ENOTDIR' || er.code === 'ENOTSUP') return handleEISDirSync(p, uid, gid)

    throw er
  }

  children && children.length && children.forEach(child => chownrKidSync(p, child, uid, gid))

  return handleEISDirSync(p, uid, gid)
}

module.exports = chownr
chownr.sync = chownrSync

},
// 33
function (module, exports, __webpack_require__) {

const cache = new Map(),
  fs = __webpack_require__(3),
  { dirname, resolve } = __webpack_require__(0)

const lstat = path =>
  new Promise((res, rej) => fs.lstat(path, (er, st) => (er ? rej(er) : res(st))))

const inferOwner = path => {
  path = resolve(path)
  if (cache.has(path)) return Promise.resolve(cache.get(path))

  const statThen = st => {
    const { uid, gid } = st
    cache.set(path, { uid, gid })
    return { uid, gid }
  }
  const parent = dirname(path)
  const parentTrap = parent === path ? null : _er =>
    inferOwner(parent).then((owner) => {
      cache.set(path, owner)
      return owner
    })

  return lstat(path).then(statThen, parentTrap)
}

const inferOwnerSync = path => {
  path = resolve(path)
  if (cache.has(path)) return cache.get(path)

  const parent = dirname(path)

  let threw = true
  try {
    const st = fs.lstatSync(path)
    threw = false
    const { uid, gid } = st
    cache.set(path, { uid, gid })
    return { uid, gid }
  } finally {
    if (threw && parent !== path) {
      const owner = inferOwnerSync(parent)
      cache.set(path, owner)
      return owner
    }
  }
}

const inflight = new Map()
module.exports = path => {
  path = resolve(path)
  if (inflight.has(path)) return Promise.resolve(inflight.get(path))
  const p = inferOwner(path).then(owner => {
    inflight.delete(path)
    return owner
  })
  inflight.set(path, p)
  return p
}
module.exports.sync = inferOwnerSync
module.exports.clearCache = () => {
  cache.clear()
  inflight.clear()
}

},
// 34
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
    var args = Array.prototype.slice.call(arguments),

      ret = fn.apply(this, args),
      cb = args[args.length - 1]
    typeof ret != 'function' || ret === cb ||
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })

    return ret
  }
}

},
// 35
function (module, exports, __webpack_require__) {

var pump = __webpack_require__(23),
  inherits = __webpack_require__(12),
  Duplexify = __webpack_require__(36)

var toArray = function (args) {
  return !args.length ? []
    : Array.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args)
}

var define = function (opts) {
  var Pumpify = function () {
    var streams = toArray(arguments)
    if (!(this instanceof Pumpify)) return new Pumpify(streams)
    Duplexify.call(this, null, null, opts)
    streams.length && this.setPipeline(streams)
  }

  inherits(Pumpify, Duplexify)

  /** @this (Pumpify|Duplexify|EventEmitter) */
  Pumpify.prototype.setPipeline = function () {
    var streams = toArray(arguments),
      self = this,
      ended = false,
      w = streams[0],
      r = streams[streams.length - 1]

    r = r.readable ? r : null
    w = w.writable ? w : null

    var onclose = function () {
      streams[0].emit('error', new Error('stream was destroyed'))
    }

    this.on('close', onclose)
    this.on('prefinish', function () {
      ended || self.cork()
    })

    pump(streams, function (err) {
      self.removeListener('close', onclose)
      if (err) return self.destroy(err.message === 'premature close' ? null : err)
      ended = true
      if (self._autoDestroy === false) self._autoDestroy = true
      self.uncork()
    })

    if (this.destroyed) return onclose()
    this.setWritable(w)
    this.setReadable(r)
  }

  return Pumpify
}

module.exports = define({ autoDestroy: false, destroy: false })
module.exports.obj = define({
  autoDestroy: false, destroy: false, objectMode: true, highWaterMark: 16
})
module.exports.ctor = define

},
// 36
function (module, exports, __webpack_require__) {

// noinspection JSIncompatibleTypesComparison
var stream = __webpack_require__(7),
  eos = __webpack_require__(17),
  inherits = __webpack_require__(12),
  shift = __webpack_require__(37),

  SIGNAL_FLUSH =
    Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0])

var onuncork = function (self, fn) {
  self._corked ? self.once('uncork', fn) : fn()
}

var autoDestroy = function (self, err) {
  self._autoDestroy && self.destroy(err)
}

var destroyer = function (self, end) {
  return function (err) {
    err ? autoDestroy(self, err.message === 'premature close' ? null : err)
      : !end || self._ended || self.end()
  }
}

var end = function (ws, fn) {
  if (!ws) return fn()
  if (ws._writableState && ws._writableState.finished) return fn()
  if (ws._writableState) return ws.end(fn)
  ws.end()
  fn()
}

var toStreams2 = function (rs) {
  return new stream.Readable({ objectMode: true, highWaterMark: 16 }).wrap(rs)
}

/** @constructor */
var Duplexify = function (writable, readable, opts) {
  if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts)
  stream.Duplex.call(this, opts)

  this._writable = null
  this._readable = null
  this._readable2 = null

  this._autoDestroy = !opts || opts.autoDestroy !== false
  this._forwardDestroy = !opts || opts.destroy !== false
  this._forwardEnd = !opts || opts.end !== false
  this._corked = 1
  this._ondrain = null
  this._drained = false
  this._forwarding = false
  this._unwrite = null
  this._unread = null
  this._ended = false

  this.destroyed = false

  writable && this.setWritable(writable)
  readable && this.setReadable(readable)
}

inherits(Duplexify, stream.Duplex)

Duplexify.obj = function (writable, readable, opts) {
  opts || (opts = {})
  opts.objectMode = true
  opts.highWaterMark = 16
  return new Duplexify(writable, readable, opts)
}

/** @this (Duplexify|EventEmitter) */
Duplexify.prototype.cork = function () {
  ++this._corked != 1 || this.emit('cork')
}

/** @this (Duplexify|EventEmitter) */
Duplexify.prototype.uncork = function () {
  this._corked && --this._corked == 0 && this.emit('uncork')
}

Duplexify.prototype.setWritable = function (writable) {
  this._unwrite && this._unwrite()

  if (this.destroyed) {
    writable && writable.destroy && writable.destroy()
    return
  }

  if (writable === null || writable === false) {
    this.end()
    return
  }

  var self = this
  var unend = eos(
    writable, { writable: true, readable: false }, destroyer(this, this._forwardEnd)
  )

  var ondrain = function () {
    var ondrain = self._ondrain
    self._ondrain = null
    ondrain && ondrain()
  }

  var clear = function () {
    self._writable.removeListener('drain', ondrain)
    unend()
  }

  this._unwrite && process.nextTick(ondrain)

  this._writable = writable
  this._writable.on('drain', ondrain)
  this._unwrite = clear

  this.uncork()
}

/** @this (Duplexify|Readable) */
Duplexify.prototype.setReadable = function (readable) {
  this._unread && this._unread()

  if (this.destroyed) {
    readable && readable.destroy && readable.destroy()
    return
  }

  if (readable === null || readable === false) {
    this.push(null)
    this.resume()
    return
  }

  var self = this,
    unend = eos(readable, { writable: false, readable: true }, destroyer(this))

  var onreadable = function () {
    self._forward()
  }

  var onend = function () {
    self.push(null)
  }

  var clear = function () {
    self._readable2.removeListener('readable', onreadable)
    self._readable2.removeListener('end', onend)
    unend()
  }

  this._drained = true
  this._readable = readable
  this._readable2 = readable._readableState ? readable : toStreams2(readable)
  this._readable2.on('readable', onreadable)
  this._readable2.on('end', onend)
  this._unread = clear

  this._forward()
}

Duplexify.prototype._read = function () {
  this._drained = true
  this._forward()
}

/** @this (Duplexify|Readable) */
Duplexify.prototype._forward = function () {
  if (this._forwarding || !this._readable2 || !this._drained) return
  this._forwarding = true

  for (var data; this._drained && (data = shift(this._readable2)) !== null; )
    this.destroyed || (this._drained = this.push(data))

  this._forwarding = false
}

Duplexify.prototype.destroy = function (err) {
  if (this.destroyed) return
  this.destroyed = true

  var self = this
  process.nextTick(function () {
    self._destroy(err)
  })
}

/** @this (Duplexify|EventEmitter) */
Duplexify.prototype._destroy = function (err) {
  if (err) {
    var ondrain = this._ondrain
    this._ondrain = null
    ondrain ? ondrain(err) : this.emit('error', err)
  }

  if (this._forwardDestroy) {
    this._readable && this._readable.destroy && this._readable.destroy()
    this._writable && this._writable.destroy && this._writable.destroy()
  }

  this.emit('close')
}

Duplexify.prototype._write = function (data, enc, cb) {
  if (this.destroyed) return cb()
  if (this._corked) return onuncork(this, this._write.bind(this, data, enc, cb))
  if (data === SIGNAL_FLUSH) return this._finish(cb)
  if (!this._writable) return cb()

  this._writable.write(data) === false ? (this._ondrain = cb) : cb()
}

/** @this (Duplexify|EventEmitter) */
Duplexify.prototype._finish = function (cb) {
  var self = this
  this.emit('preend')
  onuncork(this, function () {
    end(self._forwardEnd && self._writable, function () {
      if (self._writableState.prefinished === false) self._writableState.prefinished = true
      self.emit('prefinish')
      onuncork(self, cb)
    })
  })
}

/** @this (Duplexify|Writable) */
Duplexify.prototype.end = function (data, enc, cb) {
  if (typeof data == 'function') return this.end(null, null, data)
  if (typeof enc == 'function') return this.end(data, null, enc)
  this._ended = true
  data && this.write(data)
  this._writableState.ending || this.write(SIGNAL_FLUSH)
  return stream.Writable.prototype.end.call(this, cb)
}

module.exports = Duplexify

},
// 37
function (module) {

module.exports = shift

function shift(stream) {
  var rs = stream._readableState
  return !rs ? null
    : rs.objectMode || typeof stream._duplexState == 'number'
    ? stream.read()
    : stream.read(getStateLength(rs))
}

function getStateLength(state) {
  return state.buffer.length
    ? state.buffer.head
      ? state.buffer.head.data.length
      : state.buffer[0].length
    : state.length
}

},
// 38
function (module, exports, __webpack_require__) {

var Transform = __webpack_require__(7).Transform,
  inherits = __webpack_require__(11).inherits,
  xtend = __webpack_require__(39)

function DestroyableTransform(opts) {
  Transform.call(this, opts)
  this._destroyed = false
}

inherits(DestroyableTransform, Transform)

DestroyableTransform.prototype.destroy = function (err) {
  if (this._destroyed) return
  this._destroyed = true

  var self = this
  process.nextTick(function () {
    err && self.emit('error', err)
    self.emit('close')
  })
}

function noop(chunk, enc, callback) {
  callback(null, chunk)
}

function through2(construct) {
  return function (options, transform, flush) {
    if (typeof options == 'function') {
      flush = transform
      transform = options
      options = {}
    }

    if (typeof transform != 'function') transform = noop

    if (typeof flush != 'function') flush = null

    return construct(options, transform, flush)
  }
}

module.exports = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(options)

  t2._transform = transform

  if (flush) t2._flush = flush

  return t2
})

module.exports.ctor = through2(function (options, transform, flush) {
  function Through2(override) {
    if (!(this instanceof Through2)) return new Through2(override)

    this.options = xtend(options, override)

    DestroyableTransform.call(this, this.options)
  }

  inherits(Through2, DestroyableTransform)

  Through2.prototype._transform = transform

  if (flush) Through2.prototype._flush = flush

  return Through2
})

module.exports.obj = through2(function (options, transform, flush) {
  var t2 = new DestroyableTransform(xtend({ objectMode: true, highWaterMark: 16 }, options))

  t2._transform = transform

  if (flush) t2._flush = flush

  return t2
})

},
// 39
function (module) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty

function extend() {
  var target = {}

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i]

    for (var key in source)
      if (hasOwnProperty.call(source, key)) target[key] = source[key]
  }

  return target
}

},
// 40
function (module, exports, __webpack_require__) {

var Writable = __webpack_require__(7).Writable,
  inherits = __webpack_require__(12),
  bufferFrom = __webpack_require__(41),

  U8 = Uint8Array

function ConcatStream(opts, cb) {
  if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb)

  if (typeof opts == 'function') {
    cb = opts
    opts = {}
  }
  opts || (opts = {})

  var encoding = opts.encoding,
    shouldInferEncoding = false

  if (!encoding) shouldInferEncoding = true
  else if ((encoding = String(encoding).toLowerCase()) === 'u8' || encoding === 'uint8')
    encoding = 'uint8array'

  Writable.call(this, { objectMode: true })

  this.encoding = encoding
  this.shouldInferEncoding = shouldInferEncoding

  cb && this.on('finish', function () { cb(this.getBody()) })
  this.body = []
}

module.exports = ConcatStream
inherits(ConcatStream, Writable)

ConcatStream.prototype._write = function (chunk, enc, next) {
  this.body.push(chunk)
  next()
}

ConcatStream.prototype.inferEncoding = function (buff) {
  var firstBuffer = buff === void 0 ? this.body[0] : buff
  return Buffer.isBuffer(firstBuffer) ? 'buffer'
    : typeof Uint8Array != 'undefined' && firstBuffer instanceof Uint8Array ? 'uint8array'
    : Array.isArray(firstBuffer) ? 'array'
    : typeof firstBuffer == 'string' ? 'string'
    : Object.prototype.toString.call(firstBuffer) === '[object Object]' ? 'object'
    : 'buffer'
}

ConcatStream.prototype.getBody = function () {
  if (!this.encoding && this.body.length === 0) return []
  if (this.shouldInferEncoding) this.encoding = this.inferEncoding()
  return this.encoding === 'array' ? arrayConcat(this.body)
    : this.encoding === 'string' ? stringConcat(this.body)
    : this.encoding === 'buffer' ? bufferConcat(this.body)
    : this.encoding === 'uint8array' ? u8Concat(this.body)
    : this.body
}

function isArrayish(arr) {
  return /Array]$/.test(Object.prototype.toString.call(arr))
}

function isBufferish(p) {
  return typeof p == 'string' || isArrayish(p) || (p && typeof p.subarray == 'function')
}

function stringConcat(parts) {
  var strings = []
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]
    typeof p == 'string' || Buffer.isBuffer(p)
      ? strings.push(p)
      : isBufferish(p)
      ? strings.push(bufferFrom(p))
      : strings.push(bufferFrom(String(p)))
  }

  return Buffer.isBuffer(parts[0])
    ? Buffer.concat(strings).toString('utf8')
    : strings.join('')
}

function bufferConcat(parts) {
  var bufs = []
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i]
    Buffer.isBuffer(p)
      ? bufs.push(p)
      : isBufferish(p)
      ? bufs.push(bufferFrom(p))
      : bufs.push(bufferFrom(String(p)))
  }
  return Buffer.concat(bufs)
}

function arrayConcat(parts) {
  var res = []
  for (var i = 0; i < parts.length; i++) res.push.apply(res, parts[i])

  return res
}

function u8Concat(parts) {
  var len = 0
  for (i = 0; i < parts.length; i++) {
    if (typeof parts[i] == 'string') parts[i] = bufferFrom(parts[i])

    len += parts[i].length
  }
  var u8 = new U8(len)
  for (var i = 0, offset = 0; i < parts.length; i++)
    for (var part = parts[i], j = 0; j < part.length; j++) u8[offset++] = part[j]

  return u8
}

},
// 41
function (module) {

var toString = Object.prototype.toString

var isModern =
  typeof Buffer != 'undefined' &&
  typeof Buffer.alloc == 'function' &&
  typeof Buffer.allocUnsafe == 'function' &&
  typeof Buffer.from == 'function'

function isArrayBuffer(input) {
  return toString.call(input).slice(8, -1) === 'ArrayBuffer'
}

function fromArrayBuffer(obj, byteOffset, length) {
  byteOffset >>>= 0

  var maxLength = obj.byteLength - byteOffset

  if (maxLength < 0) throw new RangeError("'offset' is out of bounds")

  if (length === void 0) length = maxLength
  else if ((length >>>= 0) > maxLength) throw new RangeError("'length' is out of bounds")

  return isModern
    ? Buffer.from(obj.slice(byteOffset, byteOffset + length))
    : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)))
}

function fromString(string, encoding) {
  if (typeof encoding != 'string' || encoding === '') encoding = 'utf8'

  if (!Buffer.isEncoding(encoding))
    throw new TypeError('"encoding" must be a valid string encoding')

  return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding)
}

function bufferFrom(value, encodingOrOffset, length) {
  if (typeof value == 'number') throw new TypeError('"value" argument must not be a number')

  return isArrayBuffer(value)
    ? fromArrayBuffer(value, encodingOrOffset, length)

    : typeof value == 'string'
    ? fromString(value, encodingOrOffset)

    : isModern ? Buffer.from(value) : new Buffer(value)
}

module.exports = bufferFrom

},
// 42
function (module, exports, __webpack_require__) {

var Readable = __webpack_require__(7).Readable,
  inherits = __webpack_require__(12)

module.exports = from2

from2.ctor = ctor
from2.obj = obj

var Proto = ctor()

function toFunction(list) {
  list = list.slice()
  return function (_, cb) {
    var err = null,
      item = list.length ? list.shift() : null
    if (item instanceof Error) {
      err = item
      item = null
    }

    cb(err, item)
  }
}

function from2(opts, read) {
  if (typeof opts != 'object' || Array.isArray(opts)) {
    read = opts
    opts = {}
  }

  var rs = new Proto(opts)
  rs._from = Array.isArray(read) ? toFunction(read) : read || noop
  return rs
}

function ctor(opts, read) {
  if (typeof opts == 'function') {
    read = opts
    opts = {}
  }

  opts = defaults(opts)

  inherits(Class, Readable)
  function Class(override) {
    if (!(this instanceof Class)) return new Class(override)
    this._reading = false
    this._callback = check
    this.destroyed = false
    Readable.call(this, override || opts)

    var self = this,
      hwm = this._readableState.highWaterMark

    function check(err, data) {
      if (self.destroyed) return
      if (err) return self.destroy(err)
      if (data === null) return self.push(null)
      self._reading = false
      self.push(data) && self._read(hwm)
    }
  }

  Class.prototype._from = read || noop
  Class.prototype._read = function (size) {
    if (this._reading || this.destroyed) return
    this._reading = true
    this._from(size, this._callback)
  }

  Class.prototype.destroy = function (err) {
    if (this.destroyed) return
    this.destroyed = true

    var self = this
    process.nextTick(function () {
      err && self.emit('error', err)
      self.emit('close')
    })
  }

  return Class
}

function obj(opts, read) {
  if (typeof opts == 'function' || Array.isArray(opts)) {
    read = opts
    opts = {}
  }

  ;(opts = defaults(opts)).objectMode = true
  opts.highWaterMark = 16

  return from2(opts, read)
}

function noop() {}

function defaults(opts) {
  return opts || {}
}

},
// 43
function (module, exports, __webpack_require__) {

// noinspection JSIncompatibleTypesComparison
var stream = __webpack_require__(7),
  inherits = __webpack_require__(12),

  SIGNAL_FLUSH =
    Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([0]) : new Buffer([0])

module.exports = WriteStream

function WriteStream(opts, write, flush) {
  if (!(this instanceof WriteStream)) return new WriteStream(opts, write, flush)

  if (typeof opts == 'function') {
    flush = write
    write = opts
    opts = {}
  }

  stream.Writable.call(this, opts)

  this.destroyed = false
  this._worker = write || null
  this._flush = flush || null
}

inherits(WriteStream, stream.Writable)

WriteStream.obj = function (opts, worker, flush) {
  if (typeof opts == 'function') return WriteStream.obj(null, opts, worker)
  opts || (opts = {})
  opts.objectMode = true
  return new WriteStream(opts, worker, flush)
}

WriteStream.prototype._write = function (data, enc, cb) {
  SIGNAL_FLUSH === data ? this._flush(cb) : this._worker(data, enc, cb)
}

WriteStream.prototype.end = function (data, enc, cb) {
  if (!this._flush) return stream.Writable.prototype.end.apply(this, arguments)
  if (typeof data == 'function') return this.end(null, null, data)
  if (typeof enc == 'function') return this.end(data, null, enc)
  data && this.write(data)
  this._writableState.ending || this.write(SIGNAL_FLUSH)
  return stream.Writable.prototype.end.call(this, cb)
}

WriteStream.prototype.destroy = function (err) {
  if (this.destroyed) return
  this.destroyed = true
  err && this.emit('error', err)
  this.emit('close')
}

},
// 44
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  figgyPudding = __webpack_require__(4),
  fs = __webpack_require__(3),
  index = __webpack_require__(8),
  memo = __webpack_require__(14),
  pipe = __webpack_require__(2).pipe,
  pipeline = __webpack_require__(2).pipeline,
  read = __webpack_require__(25),
  through = __webpack_require__(2).through,

  writeFileAsync = BB.promisify(fs.writeFile),
  GetOpts = figgyPudding({ integrity: {}, memoize: {}, size: {} })

module.exports = function (cache, key, opts) {
  return getData(false, cache, key, opts)
}
module.exports.byDigest = function (cache, digest, opts) {
  return getData(true, cache, digest, opts)
}
function getData(byDigest, cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = byDigest
    ? memo.get.byDigest(cache, key, opts)
    : memo.get(cache, key, opts)

  if (memoized && opts.memoize !== false)
    return BB.resolve(byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    })

  return (byDigest ? BB.resolve(null) : index.find(cache, key, opts)).then(entry => {
    if (!entry && !byDigest) throw new index.NotFoundError(cache, key)

    return read(cache, byDigest ? key : entry.integrity, {
      integrity: opts.integrity,
      size: opts.size
    }).then(data =>
      byDigest ? data
        : { metadata: entry.metadata, data: data, size: entry.size, integrity: entry.integrity }
    ).then(res => {
      opts.memoize && byDigest
        ? memo.put.byDigest(cache, key, res, opts)
        : opts.memoize && memo.put(cache, entry, res.data, opts)

      return res
    })
  })
}

module.exports.sync = function (cache, key, opts) {
  return getDataSync(false, cache, key, opts)
}
module.exports.sync.byDigest = function (cache, digest, opts) {
  return getDataSync(true, cache, digest, opts)
}
function getDataSync(byDigest, cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = byDigest
    ? memo.get.byDigest(cache, key, opts)
    : memo.get(cache, key, opts)

  if (memoized && opts.memoize !== false)
    return byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    }

  const entry = !byDigest && index.find.sync(cache, key, opts)
  if (!entry && !byDigest) throw new index.NotFoundError(cache, key)

  const data = read.sync(cache, byDigest ? key : entry.integrity, {
    integrity: opts.integrity,
    size: opts.size
  })
  const res = byDigest
    ? data
    : { metadata: entry.metadata, data: data, size: entry.size, integrity: entry.integrity }
  opts.memoize && byDigest
    ? memo.put.byDigest(cache, key, res, opts)
    : opts.memoize && memo.put(cache, entry, res.data, opts)

  return res
}

module.exports.stream = getStream
function getStream(cache, key, opts) {
  opts = GetOpts(opts)
  let stream = through()
  const memoized = memo.get(cache, key, opts)
  if (memoized && opts.memoize !== false) {
    stream.on('newListener', function (ev, cb) {
      ev !== 'metadata' || cb(memoized.entry.metadata)
      ev !== 'integrity' || cb(memoized.entry.integrity)
      ev !== 'size' || cb(memoized.entry.size)
    })
    stream.write(memoized.data, () => stream.end())
    return stream
  }
  index.find(cache, key).then(entry => {
    if (!entry) return stream.emit('error', new index.NotFoundError(cache, key))

    let memoStream
    if (opts.memoize) {
      let memoData = [],
        memoLength = 0
      memoStream = through((c, en, cb) => {
        memoData && memoData.push(c)
        memoLength += c.length
        cb(null, c, en)
      }, cb => {
        memoData && memo.put(cache, entry, Buffer.concat(memoData, memoLength), opts)
        cb()
      })
    } else memoStream = through()

    stream.emit('metadata', entry.metadata)
    stream.emit('integrity', entry.integrity)
    stream.emit('size', entry.size)
    stream.on('newListener', function (ev, cb) {
      ev !== 'metadata' || cb(entry.metadata)
      ev !== 'integrity' || cb(entry.integrity)
      ev !== 'size' || cb(entry.size)
    })
    pipe(
      read.readStream(
        cache, entry.integrity,
        opts.concat({ size: opts.size == null ? entry.size : opts.size })
      ),
      memoStream,
      stream
    )
  }).catch(err => stream.emit('error', err))
  return stream
}

module.exports.stream.byDigest = getStreamDigest
function getStreamDigest(cache, integrity, opts) {
  opts = GetOpts(opts)
  const memoized = memo.get.byDigest(cache, integrity, opts)
  if (memoized && opts.memoize !== false) {
    const stream = through()
    stream.write(memoized, () => stream.end())
    return stream
  }
  let stream = read.readStream(cache, integrity, opts)
  if (opts.memoize) {
    let memoData = [],
      memoLength = 0
    const memoStream = through((c, en, cb) => {
      memoData && memoData.push(c)
      memoLength += c.length
      cb(null, c, en)
    }, cb => {
      memoData &&
        memo.put.byDigest(cache, integrity, Buffer.concat(memoData, memoLength), opts)
      cb()
    })
    stream = pipeline(stream, memoStream)
  }
  return stream
}

module.exports.info = info
function info(cache, key, opts) {
  opts = GetOpts(opts)
  const memoized = memo.get(cache, key, opts)
  return memoized && opts.memoize !== false
    ? BB.resolve(memoized.entry)
    : index.find(cache, key)
}

module.exports.hasContent = read.hasContent

module.exports.copy = function (cache, key, dest, opts) {
  return copy(false, cache, key, dest, opts)
}
module.exports.copy.byDigest = function (cache, digest, dest, opts) {
  return copy(true, cache, digest, dest, opts)
}
function copy(byDigest, cache, key, dest, opts) {
  opts = GetOpts(opts)
  if (read.copy)
    return (byDigest ? BB.resolve(null) : index.find(cache, key, opts)).then(entry => {
      if (!entry && !byDigest) throw new index.NotFoundError(cache, key)

      return read.copy(cache, byDigest ? key : entry.integrity, dest, opts).then(() =>
        byDigest ? key
          : { metadata: entry.metadata, size: entry.size, integrity: entry.integrity }
      )
    })

  return getData(byDigest, cache, key, opts).then(res =>
    writeFileAsync(dest, byDigest ? res : res.data).then(() =>
      byDigest ? key : { metadata: res.metadata, size: res.size, integrity: res.integrity }
    )
  )
}

},
// 45
function (module, exports, __webpack_require__) {

const Yallist = __webpack_require__(46),

  MAX = Symbol('max'),
  LENGTH = Symbol('length'),
  LENGTH_CALCULATOR = Symbol('lengthCalculator'),
  ALLOW_STALE = Symbol('allowStale'),
  MAX_AGE = Symbol('maxAge'),
  DISPOSE = Symbol('dispose'),
  NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet'),
  LRU_LIST = Symbol('lruList'),
  CACHE = Symbol('cache'),
  UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet'),

  naiveLength = () => 1

class LRUCache {
  constructor(options) {
    if (typeof options == 'number') options = { max: options }

    options || (options = {})

    if (options.max && (typeof options.max != 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = typeof lc != 'function' ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge != 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  set max(mL) {
    if (typeof mL != 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max() {
    return this[MAX]
  }

  set allowStale(allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale() {
    return this[ALLOW_STALE]
  }

  set maxAge(mA) {
    if (typeof mA != 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge() {
    return this[MAX_AGE]
  }

  set lengthCalculator(lC) {
    if (typeof lC != 'function') lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator() { return this[LENGTH_CALCULATOR] }

  get length() { return this[LENGTH] }
  get itemCount() { return this[LRU_LIST].length }

  rforEach(fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null; ) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach(fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null; ) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys() {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values() {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset() {
    this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length &&
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))

    this[CACHE] = new Map()
    this[LRU_LIST] = new Yallist()
    this[LENGTH] = 0
  }

  dump() {
    return this[LRU_LIST].map(hit =>
      !isStale(this, hit) && { k: hit.key, v: hit.value, e: hit.now + (hit.maxAge || 0) }
    ).toArray().filter(h => h)
  }

  dumpLru() {
    return this[LRU_LIST]
  }

  set(key, value, maxAge) {
    if ((maxAge = maxAge || this[MAX_AGE]) && typeof maxAge != 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0,
      len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const item = this[CACHE].get(key).value

      !this[DISPOSE] || this[NO_DISPOSE_ON_SET] || this[DISPOSE](key, item.value)

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    if (hit.length > this[MAX]) {
      this[DISPOSE] && this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has(key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get(key) {
    return get(this, key, true)
  }

  peek(key) {
    return get(this, key, false)
  }

  pop() {
    const node = this[LRU_LIST].tail
    if (!node) return null

    del(this, node)
    return node.value
  }

  del(key) {
    del(this, this[CACHE].get(key))
  }

  load(arr) {
    this.reset()

    const now = Date.now()
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l],
        expiresAt = hit.e || 0
      if (expiresAt === 0) this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        maxAge > 0 && this.set(hit.k, hit.v, maxAge)
      }
    }
  }

  prune() {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (!node) return

  const hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE]) return void 0
  } else if (doUse) {
    if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now()
    self[LRU_LIST].unshiftNode(node)
  }
  return hit.value
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE])) return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE]
}

const trim = self => {
  if (self[LENGTH] <= self[MAX]) return

  for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
    const prev = walker.prev
    del(self, walker)
    walker = prev
  }
}

const del = (self, node) => {
  if (!node) return

  const hit = node.value
  self[DISPOSE] && self[DISPOSE](hit.key, hit.value)

  self[LENGTH] -= hit.length
  self[CACHE].delete(hit.key)
  self[LRU_LIST].removeNode(node)
}

class Entry {
  constructor(key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    self[ALLOW_STALE] || (hit = void 0)
  }
  hit && fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache

},
// 46
function (module, exports, __webpack_require__) {

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist(list) {
  var self = this
  self instanceof Yallist || (self = new Yallist())

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach == 'function')
    list.forEach(function (item) {
      self.push(item)
    })
  else if (arguments.length > 0)
    for (var i = 0, l = arguments.length; i < l; i++) self.push(arguments[i])

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this)
    throw new Error('removing node which does not belong to this list')

  var next = node.next,
    prev = node.prev

  if (next) next.prev = prev

  if (prev) prev.next = next

  if (node === this.head) this.head = next

  if (node === this.tail) this.tail = prev

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) return

  node.list && node.list.removeNode(node)

  var head = this.head
  node.list = this
  node.next = head
  if (head) head.prev = node

  this.head = node
  this.tail || (this.tail = node)

  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) return

  node.list && node.list.removeNode(node)

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) tail.next = node

  this.tail = node
  this.head || (this.head = node)

  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) push(this, arguments[i])

  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) unshift(this, arguments[i])

  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) return void 0

  var res = this.tail.value
  this.tail = this.tail.prev
  this.tail ? (this.tail.next = null) : (this.head = null)

  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) return void 0

  var res = this.head.value
  this.head = this.head.next
  this.head ? (this.head.prev = null) : (this.tail = null)

  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++)
    walker = walker.next

  if (i === n && walker !== null) return walker.value
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++)
    walker = walker.prev

  if (i === n && walker !== null) return walker.value
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null; ) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null; ) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc,
    walker = this.head
  if (arguments.length > 1) acc = initial
  else {
    if (!this.head) throw new TypeError('Reduce of empty list with no initial value')

    walker = this.head.next
    acc = this.head.value
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc,
    walker = this.tail
  if (arguments.length > 1) acc = initial
  else {
    if (!this.tail) throw new TypeError('Reduce of empty list with no initial value')

    walker = this.tail.prev
    acc = this.tail.value
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  if ((to = to || this.length) < 0) to += this.length

  if ((from = from || 0) < 0) from += this.length

  var ret = new Yallist()
  if (to < from || to < 0) return ret

  if (from < 0) from = 0

  if (to > this.length) to = this.length

  for (var i = 0, walker = this.head; walker !== null && i < from; i++)
    walker = walker.next

  for (; walker !== null && i < to; i++, walker = walker.next) ret.push(walker.value)

  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  if ((to = to || this.length) < 0) to += this.length

  if ((from = from || 0) < 0) from += this.length

  var ret = new Yallist()
  if (to < from || to < 0) return ret

  if (from < 0) from = 0

  if (to > this.length) to = this.length

  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--)
    walker = walker.prev

  for (; walker !== null && i > from; i--, walker = walker.prev) ret.push(walker.value)

  return ret
}

Yallist.prototype.splice = function (start, deleteCount) {
  if (start > this.length) start = this.length - 1

  if (start < 0) start = this.length + start

  for (var i = 0, walker = this.head; walker !== null && i < start; i++)
    walker = walker.next

  var ret = []
  for (i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) walker = this.tail

  if (walker !== this.head && walker !== this.tail) walker = walker.prev

  for (i = 2; i < arguments.length; i++) walker = insert(this, walker, arguments[i])

  return ret
}

Yallist.prototype.reverse = function () {
  var head = this.head,
    tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert(self, node, value) {
  var inserted = node === self.head
    ? new Node(value, null, node, self)
    : new Node(value, node, node.next, self)

  if (inserted.next === null) self.tail = inserted

  if (inserted.prev === null) self.head = inserted

  self.length++

  return inserted
}

function push(self, item) {
  self.tail = new Node(item, self.tail, null, self)
  self.head || (self.head = self.tail)

  self.length++
}

function unshift(self, item) {
  self.head = new Node(item, null, self.head, self)
  self.tail || (self.tail = self.head)

  self.length++
}

function Node(value, prev, next, list) {
  if (!(this instanceof Node)) return new Node(value, prev, next, list)

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else this.prev = null

  if (next) {
    next.prev = this
    this.next = next
  } else this.next = null
}

try {
  __webpack_require__(47)(Yallist)
} catch (_) {}

},
// 47
function (module) {

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) yield walker.value
  }
}

},
// 48
function (module, exports, __webpack_require__) {

const figgyPudding = __webpack_require__(4),
  index = __webpack_require__(8),
  memo = __webpack_require__(14),
  write = __webpack_require__(49),
  to = __webpack_require__(2).to

const PutOpts = figgyPudding({
  algorithms: { default: ['sha512'] },
  integrity: {},
  memoize: {},
  metadata: {},
  pickAlgorithm: {},
  size: {},
  tmpPrefix: {},
  single: {},
  sep: {},
  error: {},
  strict: {}
})

module.exports = putData
function putData(cache, key, data, opts) {
  opts = PutOpts(opts)
  return write(cache, data, opts).then(res =>
    index.insert(cache, key, res.integrity, opts.concat({ size: res.size })).then(entry => {
      opts.memoize && memo.put(cache, entry, data, opts)

      return res.integrity
    })
  )
}

module.exports.stream = putStream
function putStream(cache, key, opts) {
  opts = PutOpts(opts)
  let integrity, size
  const contentStream = write.stream(cache, opts).on('integrity', int => {
    integrity = int
  }).on('size', s => {
    size = s
  })
  let memoData,
    memoTotal = 0
  const stream = to((chunk, enc, cb) => {
    contentStream.write(chunk, enc, () => {
      if (opts.memoize) {
        memoData || (memoData = [])
        memoData.push(chunk)
        memoTotal += chunk.length
      }
      cb()
    })
  }, cb => {
    contentStream.end(() => {
      index.insert(cache, key, integrity, opts.concat({ size })).then(entry => {
        opts.memoize && memo.put(cache, entry, Buffer.concat(memoData, memoTotal), opts)

        stream.emit('integrity', integrity)
        cb()
      })
    })
  })
  let erred = false
  stream.once('error', err => {
    if (erred) return
    erred = true
    contentStream.emit('error', err)
  })
  contentStream.once('error', err => {
    if (erred) return
    erred = true
    stream.emit('error', err)
  })
  return stream
}

},
// 49
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  contentPath = __webpack_require__(9),
  fixOwner = __webpack_require__(13),
  fs = __webpack_require__(6),
  moveFile = __webpack_require__(50),
  PassThrough = __webpack_require__(16).PassThrough,
  path = __webpack_require__(0),
  pipe = BB.promisify(__webpack_require__(2).pipe),
  rimraf = BB.promisify(__webpack_require__(5)),
  ssri = __webpack_require__(10),
  to = __webpack_require__(2).to,
  uniqueFilename = __webpack_require__(29),

  writeFileAsync = BB.promisify(fs.writeFile)

module.exports = write
function write(cache, data, opts) {
  if ((opts = opts || {}).algorithms && opts.algorithms.length > 1)
    throw new Error('opts.algorithms only supports a single algorithm for now')

  if (typeof opts.size == 'number' && data.length !== opts.size)
    return BB.reject(sizeError(opts.size, data.length))

  const sri = ssri.fromData(data, { algorithms: opts.algorithms })
  if (opts.integrity && !ssri.checkData(data, opts.integrity, opts))
    return BB.reject(checksumError(opts.integrity, sri))

  return BB.using(makeTmp(cache, opts), tmp =>
    writeFileAsync(tmp.target, data, { flag: 'wx' }).then(() =>
      moveToDestination(tmp, cache, sri, opts)
    )
  ).then(() => ({ integrity: sri, size: data.length }))
}

module.exports.stream = writeStream
function writeStream(cache, opts) {
  opts = opts || {}
  const inputStream = new PassThrough()
  let allDone,
    inputErr = false
  function errCheck() {
    if (inputErr) throw inputErr
  }

  const ret = to((c, n, cb) => {
    allDone || (allDone = handleContent(inputStream, cache, opts, errCheck))

    inputStream.write(c, n, cb)
  }, cb => {
    inputStream.end(() => {
      if (!allDone) {
        const e = new Error('Cache input stream was empty')
        e.code = 'ENODATA'
        return ret.emit('error', e)
      }
      allDone.then(res => {
        res.integrity && ret.emit('integrity', res.integrity)
        res.size === null || ret.emit('size', res.size)
        cb()
      }, e => {
        ret.emit('error', e)
      })
    })
  })
  ret.once('error', e => {
    inputErr = e
  })
  return ret
}

function handleContent(inputStream, cache, opts, errCheck) {
  return BB.using(makeTmp(cache, opts), tmp => {
    errCheck()
    return pipeToTmp(inputStream, cache, tmp.target, opts, errCheck).then(res =>
      moveToDestination(tmp, cache, res.integrity, opts, errCheck).then(() => res)
    )
  })
}

function pipeToTmp(inputStream, cache, tmpTarget, opts, errCheck) {
  return BB.resolve().then(() => {
    let integrity, size
    const hashStream = ssri.integrityStream({
      integrity: opts.integrity,
      algorithms: opts.algorithms,
      size: opts.size
    }).on('integrity', s => {
      integrity = s
    }).on('size', s => {
      size = s
    })
    const outStream = fs.createWriteStream(tmpTarget, { flags: 'wx' })
    errCheck()
    return pipe(inputStream, hashStream, outStream)
      .then(() => ({ integrity, size }))
      .catch(err => rimraf(tmpTarget).then(() => { throw err }))
  })
}

function makeTmp(cache, opts) {
  const tmpTarget = uniqueFilename(path.join(cache, 'tmp'), opts.tmpPrefix)
  return fixOwner.mkdirfix(cache, path.dirname(tmpTarget))
    .then(() => ({ target: tmpTarget, moved: false }))
    .disposer(tmp => !tmp.moved && rimraf(tmp.target))
}

function moveToDestination(tmp, cache, sri, opts, errCheck) {
  errCheck && errCheck()
  const destination = contentPath(cache, sri),
    destDir = path.dirname(destination)

  return fixOwner.mkdirfix(cache, destDir).then(() => {
    errCheck && errCheck()
    return moveFile(tmp.target, destination)
  }).then(() => {
    errCheck && errCheck()
    tmp.moved = true
    return fixOwner.chownr(cache, destination)
  })
}

function sizeError(expected, found) {
  var err = new Error(
    `Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`
  )
  err.expected = expected
  err.found = found
  err.code = 'EBADSIZE'
  return err
}

function checksumError(expected, found) {
  var err = new Error(`Integrity check failed:\n  Wanted: ${expected}\n   Found: ${found}`)
  err.code = 'EINTEGRITY'
  err.expected = expected
  err.found = found
  return err
}

},
// 50
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(6),
  BB = __webpack_require__(1),
  chmod = BB.promisify(fs.chmod),
  unlink = BB.promisify(fs.unlink)
let move, pinflight

module.exports = moveFile
function moveFile(src, dest) {
  return BB.fromNode(cb => {
    fs.link(src, dest, err =>
      err && err.code !== 'EEXIST' && err.code !== 'EBUSY' &&
      (err.code !== 'EPERM' || process.platform !== 'win32')
        ? cb(err)
        : cb()
    )
  }).then(() =>
    BB.join(unlink(src), process.platform !== 'win32' && chmod(dest, '0444'))
  ).catch(() => {
    pinflight || (pinflight = __webpack_require__(22))
    return pinflight('cacache-move-file:' + dest, () =>
      BB.promisify(fs.stat)(dest).catch(err => {
        if (err.code !== 'ENOENT') throw err

        move || (move = __webpack_require__(51))
        return move(src, dest, { BB, fs })
      })
    )
  })
}

},
// 51
function (module, exports, __webpack_require__) {

module.exports = move

var nodeFs = __webpack_require__(3),
  rimraf = __webpack_require__(5),
  validate = __webpack_require__(18),
  copy = __webpack_require__(53),
  RunQueue = __webpack_require__(28),
  extend = Object.assign || __webpack_require__(11)._extend

function promisify(Promise, fn) {
  return function () {
    var args = [].slice.call(arguments)
    return new Promise(function (resolve, reject) {
      return fn.apply(null, args.concat(function (err, value) {
        err ? reject(err) : resolve(value)
      }))
    })
  }
}

function move(from, to, opts) {
  validate('SSO|SS', arguments)

  var Promise = (opts = extend({}, opts || {})).Promise || global.Promise,
    fs = opts.fs || nodeFs,
    rimrafAsync = promisify(Promise, rimraf),
    renameAsync = promisify(Promise, fs.rename)

  opts.top = from

  var queue = new RunQueue({ maxConcurrency: opts.maxConcurrency, Promise: Promise })
  opts.queue = queue
  opts.recurseWith = rename

  queue.add(0, rename, [from, to, opts])

  return queue.run().then(function () {
    return remove(from)
  }, function (err) {
    return err.code === 'EEXIST' || err.code === 'EPERM'
      ? passThroughError()
      : remove(to).then(passThroughError, passThroughError)

    function passThroughError() {
      return Promise.reject(err)
    }
  })

  function remove(target) {
    var opts = {
      unlink: fs.unlink,
      chmod: fs.chmod,
      stat: fs.stat,
      lstat: fs.lstat,
      rmdir: fs.rmdir,
      readdir: fs.readdir,
      glob: false
    }
    return rimrafAsync(target, opts)
  }

  function rename(from, to, opts, _done) {
    return renameAsync(from, to).catch(function (err) {
      return err.code !== 'EXDEV'
        ? Promise.reject(err)
        : remove(to).then(function () {
            return copy.item(from, to, opts)
          })
    })
  }
}

},
// 52
function (module) {

module.exports = require('assert');

},
// 53
function (module, exports, __webpack_require__) {

module.exports = copy
module.exports.item = copyItem
module.exports.recurse = recurseDir
module.exports.symlink = copySymlink
module.exports.file = copyFile

var nodeFs = __webpack_require__(3),
  path = __webpack_require__(0),
  validate = __webpack_require__(18),
  stockWriteStreamAtomic = __webpack_require__(54),
  mkdirp = __webpack_require__(21),
  rimraf = __webpack_require__(5),
  isWindows = __webpack_require__(56),
  RunQueue = __webpack_require__(28),
  extend = Object.assign || __webpack_require__(11)._extend

function promisify(Promise, fn) {
  return function () {
    var args = [].slice.call(arguments)
    return new Promise(function (resolve, reject) {
      return fn.apply(null, args.concat(function (err, value) {
        err ? reject(err) : resolve(value)
      }))
    })
  }
}

function copy(from, to, opts) {
  validate('SSO|SS', arguments)

  var Promise = (opts = extend({}, opts || {})).Promise || global.Promise,
    fs = opts.fs || nodeFs

  if (opts.isWindows == null) opts.isWindows = isWindows
  opts.Promise || (opts.Promise = Promise)
  opts.fs || (opts.fs = fs)
  opts.recurseWith || (opts.recurseWith = copyItem)
  opts.lstat || (opts.lstat = promisify(opts.Promise, fs.lstat))
  opts.stat || (opts.stat = promisify(opts.Promise, fs.stat))
  opts.chown || (opts.chown = promisify(opts.Promise, fs.chown))
  opts.readdir || (opts.readdir = promisify(opts.Promise, fs.readdir))
  opts.readlink || (opts.readlink = promisify(opts.Promise, fs.readlink))
  opts.symlink || (opts.symlink = promisify(opts.Promise, fs.symlink))
  opts.chmod || (opts.chmod = promisify(opts.Promise, fs.chmod))

  opts.top = from
  opts.mkdirpAsync = promisify(opts.Promise, mkdirp)
  var rimrafAsync = promisify(opts.Promise, rimraf),

    queue = new RunQueue({ maxConcurrency: opts.maxConcurrency, Promise: Promise })
  opts.queue = queue

  queue.add(0, copyItem, [from, to, opts])

  return queue.run().catch(function (err) {
    return err.code === 'EEXIST' || err.code === 'EPERM'
      ? passThroughError()
      : remove(to).then(passThroughError, passThroughError)

    function passThroughError() {
      return Promise.reject(err)
    }
  })

  function remove(target) {
    var opts = {
      unlink: fs.unlink,
      chmod: fs.chmod,
      stat: fs.stat,
      lstat: fs.lstat,
      rmdir: fs.rmdir,
      readdir: fs.readdir,
      glob: false
    }
    return rimrafAsync(target, opts)
  }
}

function copyItem(from, to, opts) {
  validate('SSO', [from, to, opts])
  var fs = opts.fs || nodeFs,
    Promise = opts.Promise || global.Promise,
    lstat = opts.lstat || promisify(Promise, fs.lstat)

  return lstat(to).then(function () {
    return Promise.reject(eexists(from, to))
  }, function (err) {
    return err && err.code !== 'ENOENT' ? Promise.reject(err) : lstat(from)
  }).then(function (fromStat) {
    var cmdOpts = extend(extend({}, opts), fromStat)
    if (fromStat.isDirectory()) return recurseDir(from, to, cmdOpts)
    if (!fromStat.isSymbolicLink())
    return fromStat.isFile()
      ? copyFile(from, to, cmdOpts)
      : fromStat.isBlockDevice()
      ? Promise.reject(
          eunsupported(from + " is a block device, and we don't know how to copy those.")
        )
      : fromStat.isCharacterDevice()
      ? Promise.reject(
          eunsupported(from + " is a character device, and we don't know how to copy those.")
        )
      : fromStat.isFIFO()
      ? Promise.reject(eunsupported(from + " is a FIFO, and we don't know how to copy those."))
      : fromStat.isSocket()
      ? Promise.reject(eunsupported(from + " is a socket, and we don't know how to copy those."))
      : Promise.reject(
          eunsupported("We can't tell what " + from + " is and so we can't copy it.")
        )

    opts.queue.add(1, copySymlink, [from, to, cmdOpts])
  })
}

function recurseDir(from, to, opts) {
  validate('SSO', [from, to, opts])
  var recurseWith = opts.recurseWith || copyItem,
    fs = opts.fs || nodeFs,
    chown = opts.chown || promisify(Promise, fs.chown),
    readdir = opts.readdir || promisify(Promise, fs.readdir)

  return (opts.mkdirpAsync || promisify(Promise, mkdirp))(to, {
    fs: fs, mode: opts.mode
  }).then(function () {
    var getuid = opts.getuid || process.getuid
    if (getuid && opts.uid != null && getuid() === 0) return chown(to, opts.uid, opts.gid)
  }).then(function () {
    return readdir(from)
  }).then(function (files) {
    files.forEach(function (file) {
      opts.queue.add(0, recurseWith, [path.join(from, file), path.join(to, file), opts])
    })
  })
}

function copySymlink(from, to, opts) {
  validate('SSO', [from, to, opts])
  var fs = opts.fs || nodeFs,
    Promise = opts.Promise || global.Promise,
    readlink = opts.readlink || promisify(Promise, fs.readlink),
    stat = opts.stat || promisify(Promise, fs.symlink),
    symlink = opts.symlink || promisify(Promise, fs.symlink)

  return readlink(from).then(function (fromDest) {
    var absoluteDest = path.resolve(path.dirname(from), fromDest),
      linkFrom = path.relative(opts.top, absoluteDest).substr(0, 2) === '..'
        ? fromDest : path.relative(path.dirname(from), absoluteDest)

    return !opts.isWindows ? symlink(linkFrom, to) : stat(absoluteDest).catch(function () {
      return null
    }).then(function (destStat) {
      var type = destStat && destStat.isDirectory() ? 'dir' : 'file'
      return symlink(linkFrom, to, type).catch(function (err) {
        return type === 'dir' ? symlink(linkFrom, to, 'junction') : Promise.reject(err)
      })
    })
  })
}

function copyFile(from, to, opts) {
  validate('SSO', [from, to, opts])
  var fs = opts.fs || nodeFs,
    writeStreamAtomic = opts.writeStreamAtomic || stockWriteStreamAtomic,
    Promise = opts.Promise || global.Promise,
    chmod = opts.chmod || promisify(Promise, fs.chmod),

    writeOpts = {},
    getuid = opts.getuid || process.getuid
  if (getuid && opts.uid != null && getuid() === 0)
    writeOpts.chown = { uid: opts.uid, gid: opts.gid }

  return new Promise(function (resolve, reject) {
    var errored = false
    function onError(err) {
      errored = true
      reject(err)
    }
    fs.createReadStream(from)
      .once('error', onError)
      .pipe(writeStreamAtomic(to, writeOpts))
      .once('error', onError)
      .once('close', function () {
        errored || (opts.mode != null ? resolve(chmod(to, opts.mode)) : resolve())
      })
  })
}

function eexists(from, to) {
  var err = new Error('Could not move ' + from + ' to ' + to + ': destination already exists.')
  err.code = 'EEXIST'
  return err
}

function eunsupported(msg) {
  var err = new Error(msg)
  err.code = 'EUNSUPPORTED'
  return err
}

},
// 54
function (module, exports, __webpack_require__) {

var fs = __webpack_require__(6),
  Writable = __webpack_require__(7).Writable,
  util = __webpack_require__(11),
  MurmurHash3 = __webpack_require__(27),
  iferr = __webpack_require__(55),
  crypto = __webpack_require__(15)

function murmurhex() {
  var hash = MurmurHash3('')
  for (var ii = 0; ii < arguments.length; ++ii) hash.hash('' + arguments[ii])

  return hash.result()
}

var invocations = 0
function getTmpname(filename) {
  return filename + '.' + murmurhex(__filename, process.pid, ++invocations)
}

var setImmediate = global.setImmediate || setTimeout

module.exports = WriteStreamAtomic

util.inherits(WriteStreamAtomic, Writable)
function WriteStreamAtomic(path, options) {
  if (!(this instanceof WriteStreamAtomic)) return new WriteStreamAtomic(path, options)

  Writable.call(this, options)

  this.__isWin =
    options && options.hasOwnProperty('isWin') ? options.isWin : process.platform === 'win32'

  this.__atomicTarget = path
  this.__atomicTmp = getTmpname(path)

  this.__atomicChown = options && options.chown

  this.__atomicClosed = false

  this.__atomicStream = fs.WriteStream(this.__atomicTmp, options)

  this.__atomicStream.once('open', handleOpen(this))
  this.__atomicStream.once('close', handleClose(this))
  this.__atomicStream.once('error', handleError(this))
}

WriteStreamAtomic.prototype.emit = function (event) {
  return event === 'finish' ? this.__atomicStream.end()
    : Writable.prototype.emit.apply(this, arguments)
}

WriteStreamAtomic.prototype._write = function (buffer, encoding, cb) {
  if (this.__atomicStream.write(buffer, encoding)) return cb()
  this.__atomicStream.once('drain', cb)
}

function handleOpen(writeStream) {
  return function (fd) {
    writeStream.emit('open', fd)
  }
}

function handleClose(writeStream) {
  return function () {
    if (writeStream.__atomicClosed) return
    writeStream.__atomicClosed = true
    if (writeStream.__atomicChown) {
      var uid = writeStream.__atomicChown.uid,
        gid = writeStream.__atomicChown.gid
      return fs.chown(writeStream.__atomicTmp, uid, gid, iferr(cleanup, moveIntoPlace))
    }
    moveIntoPlace()
  }

  function moveIntoPlace() {
    fs.rename(writeStream.__atomicTmp, writeStream.__atomicTarget, iferr(trapWindowsEPERM, end))
  }

  function trapWindowsEPERM(err) {
    writeStream.__isWin &&
    err.syscall && err.syscall === 'rename' &&
    err.code && err.code === 'EPERM'
      ? checkFileHashes(err)
      : cleanup(err)
  }

  function checkFileHashes(eperm) {
    var inprocess = 2,
      tmpFileHash = crypto.createHash('sha512'),
      targetFileHash = crypto.createHash('sha512')

    fs.createReadStream(writeStream.__atomicTmp)
      .on('data', function (data, enc) { tmpFileHash.update(data, enc) })
      .on('error', fileHashError)
      .on('end', fileHashComplete)
    fs.createReadStream(writeStream.__atomicTarget)
      .on('data', function (data, enc) { targetFileHash.update(data, enc) })
      .on('error', fileHashError)
      .on('end', fileHashComplete)

    function fileHashError() {
      if (inprocess === 0) return
      inprocess = 0
      cleanup(eperm)
    }

    function fileHashComplete() {
      if (inprocess === 0 || --inprocess) return
      return tmpFileHash.digest('hex') === targetFileHash.digest('hex')
        ? cleanup()
        : cleanup(eperm)
    }
  }

  function cleanup(err) {
    fs.unlink(writeStream.__atomicTmp, function () {
      if (err) {
        writeStream.emit('error', err)
        writeStream.emit('close')
      } else end()
    })
  }

  function end() {
    Writable.prototype.emit.call(writeStream, 'finish')

    setImmediate(function () {
      writeStream.emit('close')
    })
  }
}

function handleError(writeStream) {
  return function (er) {
    cleanupSync()
    writeStream.emit('error', er)
    writeStream.__atomicClosed = true
    writeStream.emit('close')
  }
  function cleanupSync() {
    try {
      fs.unlinkSync(writeStream.__atomicTmp)
    } finally {
      return
    }
  }
}

},
// 55
function (module, exports) {

var iferr, printerr, throwerr, tiferr,
  __slice = [].slice;

iferr = function (fail, succ) {
  return function () {
    var err = arguments[0],
      a = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return err != null
      ? fail(err)
      : typeof succ == 'function' ? succ.apply(null, a) : void 0;
  };
};

tiferr = function (fail, succ) {
  return iferr(fail, function () {
    var a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    try {
      return succ.apply(null, a);
    } catch (_error) {
      return fail(_error);
    }
  });
};

throwerr = iferr.bind(null, function (err) {
  throw err;
});

printerr = iferr(function (err) {
  return console.error(err.stack || err);
});

module.exports = exports = iferr;

exports.iferr = iferr;
exports.tiferr = tiferr;
exports.throwerr = throwerr;
exports.printerr = printerr;

},
// 56
function (module) {

module.exports = process.platform === 'win32'

},
// 57
function (module, exports, __webpack_require__) {

var MurmurHash3 = __webpack_require__(27)

module.exports = function (uniq) {
  return uniq
    ? ('00000000' + new MurmurHash3(uniq).result().toString(16)).substr(-8)
    : (Math.random().toString(16) + '0000000').substr(2, 8)
}

},
// 58
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  index = __webpack_require__(8),
  memo = __webpack_require__(14),
  path = __webpack_require__(0),
  rimraf = BB.promisify(__webpack_require__(5)),
  rmContent = __webpack_require__(59)

module.exports = entry
module.exports.entry = entry
function entry(cache, key) {
  memo.clearMemoized()
  return index.delete(cache, key)
}

module.exports.content = content
function content(cache, integrity) {
  memo.clearMemoized()
  return rmContent(cache, integrity)
}

module.exports.all = all
function all(cache) {
  memo.clearMemoized()
  return rimraf(path.join(cache, '*(content-*|index-*)'))
}

},
// 59
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  contentPath = __webpack_require__(9),
  hasContent = __webpack_require__(25).hasContent,
  rimraf = BB.promisify(__webpack_require__(5))

module.exports = rm
function rm(cache, integrity) {
  return hasContent(cache, integrity).then(content => {
    if (!content) return false

    const sri = content.sri
    if (sri) return rimraf(contentPath(cache, sri)).then(() => true)
  })
}

},
// 60
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  contentPath = __webpack_require__(9),
  figgyPudding = __webpack_require__(4),
  finished = BB.promisify(__webpack_require__(2).finished),
  fixOwner = __webpack_require__(13),
  /** @type {Object.<string, *>} */ fs = __webpack_require__(6),
  glob = BB.promisify(__webpack_require__(26)),
  index = __webpack_require__(8),
  path = __webpack_require__(0),
  rimraf = BB.promisify(__webpack_require__(5)),
  ssri = __webpack_require__(10)

BB.promisifyAll(fs)

const VerifyOpts = figgyPudding({
  concurrency: { default: 20 },
  filter: {},
  log: { default: { silly() {} } }
})

module.exports = verify
function verify(cache, opts) {
  ;(opts = VerifyOpts(opts)).log.silly('verify', 'verifying cache at', cache)
  return BB.reduce([
    markStartTime,
    fixPerms,
    garbageCollect,
    rebuildIndex,
    cleanTmp,
    writeVerifile,
    markEndTime
  ], (stats, step, i) => {
    const label = step.name || 'step #' + i,
      start = new Date()
    return BB.resolve(step(cache, opts)).then(s => {
      s && Object.keys(s).forEach(k => {
        stats[k] = s[k]
      })
      const end = new Date()
      stats.runTime || (stats.runTime = {})
      stats.runTime[label] = end - start
      return stats
    })
  }, {}).tap(stats => {
    stats.runTime.total = stats.endTime - stats.startTime
    opts.log.silly(
      'verify', 'verification finished for', cache, 'in', stats.runTime.total + 'ms'
    )
  })
}

function markStartTime(cache, _opts) {
  return { startTime: new Date() }
}

function markEndTime(cache, _opts) {
  return { endTime: new Date() }
}

function fixPerms(cache, opts) {
  opts.log.silly('verify', 'fixing cache permissions')
  return fixOwner.mkdirfix(cache, cache)
    .then(() => fixOwner.chownr(cache, cache)).then(() => null)
}

function garbageCollect(cache, opts) {
  opts.log.silly('verify', 'garbage collecting content')
  const indexStream = index.lsStream(cache),
    liveContent = new Set()
  indexStream.on('data', entry => {
    if (opts.filter && !opts.filter(entry)) return
    liveContent.add(entry.integrity.toString())
  })
  return finished(indexStream).then(() => {
    const contentDir = contentPath._contentDir(cache)
    return glob(path.join(contentDir, '**'), {
      follow: false,
      nodir: true,
      nosort: true
    }).then(files =>
      BB.resolve({
        verifiedContent: 0,
        reclaimedCount: 0,
        reclaimedSize: 0,
        badContentCount: 0,
        keptSize: 0
      }).tap((stats) => BB.map(files, (f) => {
        const split = f.split(/[/\\]/),
          digest = split.slice(split.length - 3).join(''),
          algo = split[split.length - 4],
          integrity = ssri.fromHex(digest, algo)
        if (liveContent.has(integrity.toString()))
          return verifyContent(f, integrity).then(info => {
            if (!info.valid) {
              stats.reclaimedCount++
              stats.badContentCount++
              stats.reclaimedSize += info.size
            } else {
              stats.verifiedContent++
              stats.keptSize += info.size
            }
            return stats
          })

        stats.reclaimedCount++
        return fs.statAsync(f).then(s =>
          rimraf(f).then(() => {
            stats.reclaimedSize += s.size
            return stats
          })
        )
      }, { concurrency: opts.concurrency }))
    )
  })
}

function verifyContent(filepath, sri) {
  return fs.statAsync(filepath).then(stat => {
    const contentInfo = { size: stat.size, valid: true }
    return ssri.checkStream(fs.createReadStream(filepath), sri).catch(err => {
      if (err.code !== 'EINTEGRITY') throw err
      return rimraf(filepath).then(() => {
        contentInfo.valid = false
      })
    }).then(() => contentInfo)
  }).catch({ code: 'ENOENT' }, () => ({ size: 0, valid: false }))
}

function rebuildIndex(cache, opts) {
  opts.log.silly('verify', 'rebuilding index')
  return index.ls(cache).then(entries => {
    const stats = { missingContent: 0, rejectedEntries: 0, totalEntries: 0 },
      buckets = {}
    for (let k in entries)
      if (entries.hasOwnProperty(k)) {
        const hashed = index._hashKey(k),
          entry = entries[k],
          excluded = opts.filter && !opts.filter(entry)
        excluded && stats.rejectedEntries++
        if (buckets[hashed] && !excluded) buckets[hashed].push(entry)
        else if (buckets[hashed] && excluded);
        else if (excluded) {
          buckets[hashed] = []
          buckets[hashed]._path = index._bucketPath(cache, k)
        } else {
          buckets[hashed] = [entry]
          buckets[hashed]._path = index._bucketPath(cache, k)
        }
      }

    return BB.map(Object.keys(buckets), key => rebuildBucket(cache, buckets[key], stats, opts), {
      concurrency: opts.concurrency
    }).then(() => stats)
  })
}

function rebuildBucket(cache, bucket, stats, _opts) {
  return fs.truncateAsync(bucket._path).then(() =>
    BB.mapSeries(bucket, entry => {
      const content = contentPath(cache, entry.integrity)
      return fs.statAsync(content).then(() =>
        index.insert(cache, entry.key, entry.integrity, {
          metadata: entry.metadata,
          size: entry.size
        }).then(() => { stats.totalEntries++ })
      ).catch({ code: 'ENOENT' }, () => {
        stats.rejectedEntries++
        stats.missingContent++
      })
    })
  )
}

function cleanTmp(cache, opts) {
  opts.log.silly('verify', 'cleaning tmp directory')
  return rimraf(path.join(cache, 'tmp'))
}

function writeVerifile(cache, opts) {
  const verifile = path.join(cache, '_lastverified')
  opts.log.silly('verify', 'writing verifile to ' + verifile)
  try {
    return fs.writeFileAsync(verifile, '' + +new Date())
  } finally {
    fixOwner.chownr.sync(cache, verifile)
  }
}

module.exports.lastRun = lastRun
function lastRun(cache) {
  return fs.readFileAsync(path.join(cache, '_lastverified'), 'utf8')
    .then(data => new Date(+data))
}

},
// 61
function (module, exports, __webpack_require__) {

const BB = __webpack_require__(1),

  figgyPudding = __webpack_require__(4),
  fixOwner = __webpack_require__(13),
  path = __webpack_require__(0),
  rimraf = BB.promisify(__webpack_require__(5)),
  uniqueFilename = __webpack_require__(29),

  TmpOpts = figgyPudding({ tmpPrefix: {} })

module.exports.mkdir = mktmpdir
function mktmpdir(cache, opts) {
  opts = TmpOpts(opts)
  const tmpTarget = uniqueFilename(path.join(cache, 'tmp'), opts.tmpPrefix)
  return fixOwner.mkdirfix(cache, tmpTarget).then(() => tmpTarget)
}

module.exports.withTmp = withTmp
function withTmp(cache, opts, cb) {
  if (!cb) {
    cb = opts
    opts = null
  }
  opts = TmpOpts(opts)
  return BB.using(mktmpdir(cache, opts).disposer(rimraf), cb)
}

module.exports.fix = fixtmpdir
function fixtmpdir(cache) {
  return fixOwner(cache, path.join(cache, 'tmp'))
}

}
]);

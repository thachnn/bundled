"use strict";
module.exports = function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: !1,
      exports: {}
    };
    return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
    module.l = !0, module.exports;
  }
  return __webpack_require__(29);
}([ function(module, exports) {
  module.exports = require("path");
}, function(module, exports) {
  module.exports = require("./bluebird");
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports, __webpack_require__) {
  module.exports.pipe = __webpack_require__(22), module.exports.pipeline = __webpack_require__(34), 
  module.exports.through = __webpack_require__(37), module.exports.concat = __webpack_require__(39), 
  module.exports.finished = __webpack_require__(16), module.exports.from = __webpack_require__(41), 
  module.exports.to = __webpack_require__(42);
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  class FiggyPudding {
    constructor(specs, opts, providers) {
      this.__specs = specs || {}, Object.keys(this.__specs).forEach(alias => {
        if ("string" == typeof this.__specs[alias]) {
          const key = this.__specs[alias], realSpec = this.__specs[key];
          if (!realSpec) throw new Error(`Alias refers to invalid key: ${key} -> ${alias}`);
          {
            const aliasArr = realSpec.aliases || [];
            aliasArr.push(alias, key), realSpec.aliases = [ ...new Set(aliasArr) ], this.__specs[alias] = realSpec;
          }
        }
      }), this.__opts = opts || {}, this.__providers = reverse(providers.filter(x => null != x && "object" == typeof x)), 
      this.__isFiggyPudding = !0;
    }
    get(key) {
      return pudGet(this, key, !0);
    }
    get [Symbol.toStringTag]() {
      return "FiggyPudding";
    }
    forEach(fn, thisArg = this) {
      for (let [key, value] of this.entries()) fn.call(thisArg, value, key, this);
    }
    toJSON() {
      const obj = {};
      return this.forEach((val, key) => {
        obj[key] = val;
      }), obj;
    }
    * entries(_matcher) {
      for (let key of Object.keys(this.__specs)) yield [ key, this.get(key) ];
      const matcher = _matcher || this.__opts.other;
      if (matcher) {
        const seen = new Set;
        for (let p of this.__providers) {
          const iter = p.entries ? p.entries(matcher) : entries(p);
          for (let [key, val] of iter) matcher(key) && !seen.has(key) && (seen.add(key), yield [ key, val ]);
        }
      }
    }
    * [Symbol.iterator]() {
      for (let [key, value] of this.entries()) yield [ key, value ];
    }
    * keys() {
      for (let [key] of this.entries()) yield key;
    }
    * values() {
      for (let [, value] of this.entries()) yield value;
    }
    concat(...moreConfig) {
      return new Proxy(new FiggyPudding(this.__specs, this.__opts, reverse(this.__providers).concat(moreConfig)), proxyHandler);
    }
  }
  try {
    const util = __webpack_require__(2);
    FiggyPudding.prototype[util.inspect.custom] = function(depth, opts) {
      return this[Symbol.toStringTag] + " " + util.inspect(this.toJSON(), opts);
    };
  } catch (e) {}
  function pudGet(pud, key, validate) {
    let spec = pud.__specs[key];
    if (!validate || spec || pud.__opts.other && pud.__opts.other(key)) {
      let ret;
      spec || (spec = {});
      for (let p of pud.__providers) {
        if (ret = tryGet(key, p), void 0 === ret && spec.aliases && spec.aliases.length) for (let alias of spec.aliases) if (alias !== key && (ret = tryGet(alias, p), 
        void 0 !== ret)) break;
        if (void 0 !== ret) break;
      }
      return void 0 === ret && void 0 !== spec.default ? "function" == typeof spec.default ? spec.default(pud) : spec.default : ret;
    }
    !function(key) {
      throw Object.assign(new Error("invalid config key requested: " + key), {
        code: "EBADKEY"
      });
    }(key);
  }
  function tryGet(key, p) {
    let ret;
    return ret = p.__isFiggyPudding ? pudGet(p, key, !1) : "function" == typeof p.get ? p.get(key) : p[key], 
    ret;
  }
  const proxyHandler = {
    has: (obj, prop) => prop in obj.__specs && void 0 !== pudGet(obj, prop, !1),
    ownKeys: obj => Object.keys(obj.__specs),
    get: (obj, prop) => "symbol" == typeof prop || "__" === prop.slice(0, 2) || prop in FiggyPudding.prototype ? obj[prop] : obj.get(prop),
    set(obj, prop, value) {
      if ("symbol" == typeof prop || "__" === prop.slice(0, 2)) return obj[prop] = value, 
      !0;
      throw new Error("figgyPudding options cannot be modified. Use .concat() instead.");
    },
    deleteProperty() {
      throw new Error("figgyPudding options cannot be deleted. Use .concat() and shadow them instead.");
    }
  };
  function reverse(arr) {
    const ret = [];
    return arr.forEach(x => ret.unshift(x)), ret;
  }
  function entries(obj) {
    return Object.keys(obj).map(k => [ k, obj[k] ]);
  }
  module.exports = function(specs, opts) {
    return function(...providers) {
      return new Proxy(new FiggyPudding(specs, opts, providers), proxyHandler);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = rimraf, rimraf.sync = rimrafSync;
  var assert = __webpack_require__(51), path = __webpack_require__(0), fs = __webpack_require__(4), glob = void 0;
  try {
    glob = __webpack_require__(25);
  } catch (_err) {}
  var _0666 = parseInt("666", 8), defaultGlobOpts = {
    nosort: !0,
    silent: !0
  }, timeout = 0, isWindows = "win32" === process.platform;
  function defaults(options) {
    if ([ "unlink", "chmod", "stat", "lstat", "rmdir", "readdir" ].forEach((function(m) {
      options[m] = options[m] || fs[m], options[m += "Sync"] = options[m] || fs[m];
    })), options.maxBusyTries = options.maxBusyTries || 3, options.emfileWait = options.emfileWait || 1e3, 
    !1 === options.glob && (options.disableGlob = !0), !0 !== options.disableGlob && void 0 === glob) throw Error("glob dependency not found, set `options.disableGlob = true` if intentional");
    options.disableGlob = options.disableGlob || !1, options.glob = options.glob || defaultGlobOpts;
  }
  function rimraf(p, options, cb) {
    "function" == typeof options && (cb = options, options = {}), assert(p, "rimraf: missing path"), 
    assert.equal(typeof p, "string", "rimraf: path should be a string"), assert.equal(typeof cb, "function", "rimraf: callback function required"), 
    assert(options, "rimraf: invalid options argument provided"), assert.equal(typeof options, "object", "rimraf: options should be object"), 
    defaults(options);
    var busyTries = 0, errState = null, n = 0;
    if (options.disableGlob || !glob.hasMagic(p)) return afterGlob(null, [ p ]);
    function afterGlob(er, results) {
      return er ? cb(er) : 0 === (n = results.length) ? cb() : void results.forEach((function(p) {
        rimraf_(p, options, (function CB(er) {
          if (er) {
            if (("EBUSY" === er.code || "ENOTEMPTY" === er.code || "EPERM" === er.code) && busyTries < options.maxBusyTries) return busyTries++, 
            setTimeout((function() {
              rimraf_(p, options, CB);
            }), 100 * busyTries);
            if ("EMFILE" === er.code && timeout < options.emfileWait) return setTimeout((function() {
              rimraf_(p, options, CB);
            }), timeout++);
            "ENOENT" === er.code && (er = null);
          }
          timeout = 0, function(er) {
            errState = errState || er, 0 == --n && cb(errState);
          }(er);
        }));
      }));
    }
    options.lstat(p, (function(er, stat) {
      if (!er) return afterGlob(null, [ p ]);
      glob(p, options.glob, afterGlob);
    }));
  }
  function rimraf_(p, options, cb) {
    assert(p), assert(options), assert("function" == typeof cb), options.lstat(p, (function(er, st) {
      return er && "ENOENT" === er.code ? cb(null) : (er && "EPERM" === er.code && isWindows && fixWinEPERM(p, options, er, cb), 
      st && st.isDirectory() ? rmdir(p, options, er, cb) : void options.unlink(p, (function(er) {
        if (er) {
          if ("ENOENT" === er.code) return cb(null);
          if ("EPERM" === er.code) return isWindows ? fixWinEPERM(p, options, er, cb) : rmdir(p, options, er, cb);
          if ("EISDIR" === er.code) return rmdir(p, options, er, cb);
        }
        return cb(er);
      })));
    }));
  }
  function fixWinEPERM(p, options, er, cb) {
    assert(p), assert(options), assert("function" == typeof cb), er && assert(er instanceof Error), 
    options.chmod(p, _0666, (function(er2) {
      er2 ? cb("ENOENT" === er2.code ? null : er) : options.stat(p, (function(er3, stats) {
        er3 ? cb("ENOENT" === er3.code ? null : er) : stats.isDirectory() ? rmdir(p, options, er, cb) : options.unlink(p, cb);
      }));
    }));
  }
  function fixWinEPERMSync(p, options, er) {
    assert(p), assert(options), er && assert(er instanceof Error);
    try {
      options.chmodSync(p, _0666);
    } catch (er2) {
      if ("ENOENT" === er2.code) return;
      throw er;
    }
    try {
      var stats = options.statSync(p);
    } catch (er3) {
      if ("ENOENT" === er3.code) return;
      throw er;
    }
    stats.isDirectory() ? rmdirSync(p, options, er) : options.unlinkSync(p);
  }
  function rmdir(p, options, originalEr, cb) {
    assert(p), assert(options), originalEr && assert(originalEr instanceof Error), assert("function" == typeof cb), 
    options.rmdir(p, (function(er) {
      !er || "ENOTEMPTY" !== er.code && "EEXIST" !== er.code && "EPERM" !== er.code ? er && "ENOTDIR" === er.code ? cb(originalEr) : cb(er) : function(p, options, cb) {
        assert(p), assert(options), assert("function" == typeof cb), options.readdir(p, (function(er, files) {
          if (er) return cb(er);
          var errState, n = files.length;
          if (0 === n) return options.rmdir(p, cb);
          files.forEach((function(f) {
            rimraf(path.join(p, f), options, (function(er) {
              if (!errState) return er ? cb(errState = er) : void (0 == --n && options.rmdir(p, cb));
            }));
          }));
        }));
      }(p, options, cb);
    }));
  }
  function rimrafSync(p, options) {
    var results;
    if (defaults(options = options || {}), assert(p, "rimraf: missing path"), assert.equal(typeof p, "string", "rimraf: path should be a string"), 
    assert(options, "rimraf: missing options"), assert.equal(typeof options, "object", "rimraf: options should be object"), 
    options.disableGlob || !glob.hasMagic(p)) results = [ p ]; else try {
      options.lstatSync(p), results = [ p ];
    } catch (er) {
      results = glob.sync(p, options.glob);
    }
    if (results.length) for (var i = 0; i < results.length; i++) {
      p = results[i];
      try {
        var st = options.lstatSync(p);
      } catch (er) {
        if ("ENOENT" === er.code) return;
        "EPERM" === er.code && isWindows && fixWinEPERMSync(p, options, er);
      }
      try {
        st && st.isDirectory() ? rmdirSync(p, options, null) : options.unlinkSync(p);
      } catch (er) {
        if ("ENOENT" === er.code) return;
        if ("EPERM" === er.code) return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er);
        if ("EISDIR" !== er.code) throw er;
        rmdirSync(p, options, er);
      }
    }
  }
  function rmdirSync(p, options, originalEr) {
    assert(p), assert(options), originalEr && assert(originalEr instanceof Error);
    try {
      options.rmdirSync(p);
    } catch (er) {
      if ("ENOENT" === er.code) return;
      if ("ENOTDIR" === er.code) throw originalEr;
      "ENOTEMPTY" !== er.code && "EEXIST" !== er.code && "EPERM" !== er.code || function(p, options) {
        assert(p), assert(options), options.readdirSync(p).forEach((function(f) {
          rimrafSync(path.join(p, f), options);
        }));
        var retries = isWindows ? 100 : 1, i = 0;
        for (;;) {
          var threw = !0;
          try {
            var ret = options.rmdirSync(p, options);
            return threw = !1, ret;
          } finally {
            if (++i < retries && threw) continue;
          }
        }
      }(p, options);
    }
  }
}, function(module, exports) {
  module.exports = require("./graceful-fs");
}, function(module, exports) {
  module.exports = require("./readable-stream");
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), contentPath = __webpack_require__(10), crypto = __webpack_require__(14), figgyPudding = __webpack_require__(5), fixOwner = __webpack_require__(12), fs = __webpack_require__(7), hashToSegments = __webpack_require__(19), ms = __webpack_require__(3), path = __webpack_require__(0), ssri = __webpack_require__(11), indexV = __webpack_require__(18)["cache-version"].index, appendFileAsync = BB.promisify(fs.appendFile), readFileAsync = BB.promisify(fs.readFile), readdirAsync = BB.promisify(fs.readdir), concat = ms.concat, from = ms.from;
  module.exports.NotFoundError = class extends Error {
    constructor(cache, key) {
      super(`No cache entry for \`${key}\` found in \`${cache}\``), this.code = "ENOENT", 
      this.cache = cache, this.key = key;
    }
  };
  const IndexOpts = figgyPudding({
    metadata: {},
    size: {}
  });
  function insert(cache, key, integrity, opts) {
    opts = IndexOpts(opts);
    const bucket = bucketPath(cache, key), entry = {
      key: key,
      integrity: integrity && ssri.stringify(integrity),
      time: Date.now(),
      size: opts.size,
      metadata: opts.metadata
    };
    return fixOwner.mkdirfix(cache, path.dirname(bucket)).then(() => {
      const stringified = JSON.stringify(entry);
      return appendFileAsync(bucket, `\n${hashEntry(stringified)}\t${stringified}`);
    }).then(() => fixOwner.chownr(cache, bucket)).catch({
      code: "ENOENT"
    }, () => {}).then(() => formatEntry(cache, entry));
  }
  function insertSync(cache, key, integrity, opts) {
    opts = IndexOpts(opts);
    const bucket = bucketPath(cache, key), entry = {
      key: key,
      integrity: integrity && ssri.stringify(integrity),
      time: Date.now(),
      size: opts.size,
      metadata: opts.metadata
    };
    fixOwner.mkdirfix.sync(cache, path.dirname(bucket));
    const stringified = JSON.stringify(entry);
    fs.appendFileSync(bucket, `\n${hashEntry(stringified)}\t${stringified}`);
    try {
      fixOwner.chownr.sync(cache, bucket);
    } catch (err) {
      if ("ENOENT" !== err.code) throw err;
    }
    return formatEntry(cache, entry);
  }
  function lsStream(cache) {
    const indexDir = bucketDir(cache), stream = from.obj();
    return readdirOrEmpty(indexDir).map(bucket => {
      const bucketPath = path.join(indexDir, bucket);
      return readdirOrEmpty(bucketPath).map(subbucket => {
        const subbucketPath = path.join(bucketPath, subbucket);
        return readdirOrEmpty(subbucketPath).map(entry => bucketEntries(path.join(subbucketPath, entry)).reduce((acc, entry) => (acc.set(entry.key, entry), 
        acc), new Map).then(reduced => {
          for (let entry of reduced.values()) {
            const formatted = formatEntry(cache, entry);
            formatted && stream.push(formatted);
          }
        }).catch({
          code: "ENOENT"
        }, nop));
      });
    }).then(() => {
      stream.push(null);
    }, err => {
      stream.emit("error", err);
    }), stream;
  }
  function bucketEntries(bucket, filter) {
    return readFileAsync(bucket, "utf8").then(data => _bucketEntries(data, filter));
  }
  function _bucketEntries(data, filter) {
    let entries = [];
    return data.split("\n").forEach(entry => {
      if (!entry) return;
      const pieces = entry.split("\t");
      if (!pieces[1] || hashEntry(pieces[1]) !== pieces[0]) return;
      let obj;
      try {
        obj = JSON.parse(pieces[1]);
      } catch (e) {
        return;
      }
      obj && entries.push(obj);
    }), entries;
  }
  function bucketDir(cache) {
    return path.join(cache, "index-v" + indexV);
  }
  function bucketPath(cache, key) {
    const hashed = hashKey(key);
    return path.join.apply(path, [ bucketDir(cache) ].concat(hashToSegments(hashed)));
  }
  function hashKey(key) {
    return hash(key, "sha256");
  }
  function hashEntry(str) {
    return hash(str, "sha1");
  }
  function hash(str, digest) {
    return crypto.createHash(digest).update(str).digest("hex");
  }
  function formatEntry(cache, entry) {
    return entry.integrity ? {
      key: entry.key,
      integrity: entry.integrity,
      path: contentPath(cache, entry.integrity),
      size: entry.size,
      time: entry.time,
      metadata: entry.metadata
    } : null;
  }
  function readdirOrEmpty(dir) {
    return readdirAsync(dir).catch({
      code: "ENOENT"
    }, () => []).catch({
      code: "ENOTDIR"
    }, () => []);
  }
  function nop() {}
  module.exports.insert = insert, module.exports.insert.sync = insertSync, module.exports.find = function(cache, key) {
    return bucketEntries(bucketPath(cache, key)).then(entries => entries.reduce((latest, next) => next && next.key === key ? formatEntry(cache, next) : latest, null)).catch(err => {
      if ("ENOENT" === err.code) return null;
      throw err;
    });
  }, module.exports.find.sync = function(cache, key) {
    const bucket = bucketPath(cache, key);
    try {
      return function(bucket, filter) {
        return _bucketEntries(fs.readFileSync(bucket, "utf8"), filter);
      }(bucket).reduce((latest, next) => next && next.key === key ? formatEntry(cache, next) : latest, null);
    } catch (err) {
      if ("ENOENT" === err.code) return null;
      throw err;
    }
  }, module.exports.delete = function(cache, key, opts) {
    return insert(cache, key, null, opts);
  }, module.exports.delete.sync = function(cache, key, opts) {
    return insertSync(cache, key, null, opts);
  }, module.exports.lsStream = lsStream, module.exports.ls = function(cache) {
    return BB.fromNode(cb => {
      lsStream(cache).on("error", cb).pipe(concat(entries => {
        cb(null, entries.reduce((acc, xs) => (acc[xs.key] = xs, acc), {}));
      }));
    });
  }, module.exports._bucketDir = bucketDir, module.exports._bucketPath = bucketPath, 
  module.exports._hashKey = hashKey, module.exports._hashEntry = hashEntry;
}, function(module, exports, __webpack_require__) {
  const contentVer = __webpack_require__(18)["cache-version"].content, hashToSegments = __webpack_require__(19), path = __webpack_require__(0), ssri = __webpack_require__(11);
  function contentDir(cache) {
    return path.join(cache, "content-v" + contentVer);
  }
  module.exports = function(cache, integrity) {
    const sri = ssri.parse(integrity, {
      single: !0
    });
    return path.join.apply(path, [ contentDir(cache), sri.algorithm ].concat(hashToSegments(sri.hexDigest())));
  }, module.exports._contentDir = contentDir;
}, function(module, exports, __webpack_require__) {
  const crypto = __webpack_require__(14), figgyPudding = __webpack_require__(5), Transform = __webpack_require__(15).Transform, SPEC_ALGORITHMS = [ "sha256", "sha384", "sha512" ], BASE64_REGEX = /^[a-z0-9+/]+(?:=?=?)$/i, SRI_REGEX = /^([^-]+)-([^?]+)([?\S*]*)$/, STRICT_SRI_REGEX = /^([^-]+)-([A-Za-z0-9+/=]{44,88})(\?[\x21-\x7E]*)?$/, VCHAR_REGEX = /^[\x21-\x7E]+$/, SsriOpts = figgyPudding({
    algorithms: {
      default: [ "sha512" ]
    },
    error: {
      default: !1
    },
    integrity: {},
    options: {
      default: []
    },
    pickAlgorithm: {
      default: () => getPrioritizedHash
    },
    Promise: {
      default: () => Promise
    },
    sep: {
      default: " "
    },
    single: {
      default: !1
    },
    size: {},
    strict: {
      default: !1
    }
  });
  class Hash {
    get isHash() {
      return !0;
    }
    constructor(hash, opts) {
      const strict = !!(opts = SsriOpts(opts)).strict;
      this.source = hash.trim();
      const match = this.source.match(strict ? STRICT_SRI_REGEX : SRI_REGEX);
      if (!match) return;
      if (strict && !SPEC_ALGORITHMS.some(a => a === match[1])) return;
      this.algorithm = match[1], this.digest = match[2];
      const rawOpts = match[3];
      this.options = rawOpts ? rawOpts.slice(1).split("?") : [];
    }
    hexDigest() {
      return this.digest && Buffer.from(this.digest, "base64").toString("hex");
    }
    toJSON() {
      return this.toString();
    }
    toString(opts) {
      if ((opts = SsriOpts(opts)).strict && !(SPEC_ALGORITHMS.some(x => x === this.algorithm) && this.digest.match(BASE64_REGEX) && (this.options || []).every(opt => opt.match(VCHAR_REGEX)))) return "";
      const options = this.options && this.options.length ? "?" + this.options.join("?") : "";
      return `${this.algorithm}-${this.digest}${options}`;
    }
  }
  class Integrity {
    get isIntegrity() {
      return !0;
    }
    toJSON() {
      return this.toString();
    }
    toString(opts) {
      let sep = (opts = SsriOpts(opts)).sep || " ";
      return opts.strict && (sep = sep.replace(/\S+/g, " ")), Object.keys(this).map(k => this[k].map(hash => Hash.prototype.toString.call(hash, opts)).filter(x => x.length).join(sep)).filter(x => x.length).join(sep);
    }
    concat(integrity, opts) {
      opts = SsriOpts(opts);
      const other = "string" == typeof integrity ? integrity : stringify(integrity, opts);
      return parse(`${this.toString(opts)} ${other}`, opts);
    }
    hexDigest() {
      return parse(this, {
        single: !0
      }).hexDigest();
    }
    match(integrity, opts) {
      const other = parse(integrity, opts = SsriOpts(opts)), algo = other.pickAlgorithm(opts);
      return this[algo] && other[algo] && this[algo].find(hash => other[algo].find(otherhash => hash.digest === otherhash.digest)) || !1;
    }
    pickAlgorithm(opts) {
      const pickAlgorithm = (opts = SsriOpts(opts)).pickAlgorithm, keys = Object.keys(this);
      if (!keys.length) throw new Error("No algorithms available for " + JSON.stringify(this.toString()));
      return keys.reduce((acc, algo) => pickAlgorithm(acc, algo) || acc);
    }
  }
  function parse(sri, opts) {
    if (opts = SsriOpts(opts), "string" == typeof sri) return _parse(sri, opts);
    if (sri.algorithm && sri.digest) {
      const fullSri = new Integrity;
      return fullSri[sri.algorithm] = [ sri ], _parse(stringify(fullSri, opts), opts);
    }
    return _parse(stringify(sri, opts), opts);
  }
  function _parse(integrity, opts) {
    return opts.single ? new Hash(integrity, opts) : integrity.trim().split(/\s+/).reduce((acc, string) => {
      const hash = new Hash(string, opts);
      if (hash.algorithm && hash.digest) {
        const algo = hash.algorithm;
        acc[algo] || (acc[algo] = []), acc[algo].push(hash);
      }
      return acc;
    }, new Integrity);
  }
  function stringify(obj, opts) {
    return opts = SsriOpts(opts), obj.algorithm && obj.digest ? Hash.prototype.toString.call(obj, opts) : "string" == typeof obj ? stringify(parse(obj, opts), opts) : Integrity.prototype.toString.call(obj, opts);
  }
  function integrityStream(opts) {
    const sri = (opts = SsriOpts(opts)).integrity && parse(opts.integrity, opts), goodSri = sri && Object.keys(sri).length, algorithm = goodSri && sri.pickAlgorithm(opts), digests = goodSri && sri[algorithm], algorithms = Array.from(new Set(opts.algorithms.concat(algorithm ? [ algorithm ] : []))), hashes = algorithms.map(crypto.createHash);
    let streamSize = 0;
    const stream = new Transform({
      transform(chunk, enc, cb) {
        streamSize += chunk.length, hashes.forEach(h => h.update(chunk, enc)), cb(null, chunk, enc);
      }
    }).on("end", () => {
      const optString = opts.options && opts.options.length ? "?" + opts.options.join("?") : "", newSri = parse(hashes.map((h, i) => `${algorithms[i]}-${h.digest("base64")}${optString}`).join(" "), opts), match = goodSri && newSri.match(sri, opts);
      if ("number" == typeof opts.size && streamSize !== opts.size) {
        const err = new Error(`stream size mismatch when checking ${sri}.\n  Wanted: ${opts.size}\n  Found: ${streamSize}`);
        err.code = "EBADSIZE", err.found = streamSize, err.expected = opts.size, err.sri = sri, 
        stream.emit("error", err);
      } else if (opts.integrity && !match) {
        const err = new Error(`${sri} integrity checksum failed when using ${algorithm}: wanted ${digests} but got ${newSri}. (${streamSize} bytes)`);
        err.code = "EINTEGRITY", err.found = newSri, err.expected = digests, err.algorithm = algorithm, 
        err.sri = sri, stream.emit("error", err);
      } else stream.emit("size", streamSize), stream.emit("integrity", newSri), match && stream.emit("verified", match);
    });
    return stream;
  }
  module.exports.parse = parse, module.exports.stringify = stringify, module.exports.fromHex = function(hexDigest, algorithm, opts) {
    const optString = (opts = SsriOpts(opts)).options && opts.options.length ? "?" + opts.options.join("?") : "";
    return parse(`${algorithm}-${Buffer.from(hexDigest, "hex").toString("base64")}${optString}`, opts);
  }, module.exports.fromData = function(data, opts) {
    const algorithms = (opts = SsriOpts(opts)).algorithms, optString = opts.options && opts.options.length ? "?" + opts.options.join("?") : "";
    return algorithms.reduce((acc, algo) => {
      const digest = crypto.createHash(algo).update(data).digest("base64"), hash = new Hash(`${algo}-${digest}${optString}`, opts);
      if (hash.algorithm && hash.digest) {
        const algo = hash.algorithm;
        acc[algo] || (acc[algo] = []), acc[algo].push(hash);
      }
      return acc;
    }, new Integrity);
  }, module.exports.fromStream = function(stream, opts) {
    const P = (opts = SsriOpts(opts)).Promise || Promise, istream = integrityStream(opts);
    return new P((resolve, reject) => {
      let sri;
      stream.pipe(istream), stream.on("error", reject), istream.on("error", reject), istream.on("integrity", s => {
        sri = s;
      }), istream.on("end", () => resolve(sri)), istream.on("data", () => {});
    });
  }, module.exports.checkData = function(data, sri, opts) {
    if (opts = SsriOpts(opts), sri = parse(sri, opts), !Object.keys(sri).length) {
      if (opts.error) throw Object.assign(new Error("No valid integrity hashes to check against"), {
        code: "EINTEGRITY"
      });
      return !1;
    }
    const algorithm = sri.pickAlgorithm(opts), digest = crypto.createHash(algorithm).update(data).digest("base64"), newSri = parse({
      algorithm: algorithm,
      digest: digest
    }), match = newSri.match(sri, opts);
    if (match || !opts.error) return match;
    if ("number" == typeof opts.size && data.length !== opts.size) {
      const err = new Error(`data size mismatch when checking ${sri}.\n  Wanted: ${opts.size}\n  Found: ${data.length}`);
      throw err.code = "EBADSIZE", err.found = data.length, err.expected = opts.size, 
      err.sri = sri, err;
    }
    {
      const err = new Error(`Integrity checksum failed when using ${algorithm}: Wanted ${sri}, but got ${newSri}. (${data.length} bytes)`);
      throw err.code = "EINTEGRITY", err.found = newSri, err.expected = sri, err.algorithm = algorithm, 
      err.sri = sri, err;
    }
  }, module.exports.checkStream = function(stream, sri, opts) {
    const P = (opts = SsriOpts(opts)).Promise || Promise, checker = integrityStream(opts.concat({
      integrity: sri
    }));
    return new P((resolve, reject) => {
      let sri;
      stream.pipe(checker), stream.on("error", reject), checker.on("error", reject), checker.on("verified", s => {
        sri = s;
      }), checker.on("end", () => resolve(sri)), checker.on("data", () => {});
    });
  }, module.exports.integrityStream = integrityStream, module.exports.create = function(opts) {
    const algorithms = (opts = SsriOpts(opts)).algorithms, optString = opts.options.length ? "?" + opts.options.join("?") : "", hashes = algorithms.map(crypto.createHash);
    return {
      update: function(chunk, enc) {
        return hashes.forEach(h => h.update(chunk, enc)), this;
      },
      digest: function(enc) {
        return algorithms.reduce((acc, algo) => {
          const digest = hashes.shift().digest("base64"), hash = new Hash(`${algo}-${digest}${optString}`, opts);
          if (hash.algorithm && hash.digest) {
            const algo = hash.algorithm;
            acc[algo] || (acc[algo] = []), acc[algo].push(hash);
          }
          return acc;
        }, new Integrity);
      }
    };
  };
  const NODE_HASHES = new Set(crypto.getHashes()), DEFAULT_PRIORITY = [ "md5", "whirlpool", "sha1", "sha224", "sha256", "sha384", "sha512", "sha3", "sha3-256", "sha3-384", "sha3-512", "sha3_256", "sha3_384", "sha3_512" ].filter(algo => NODE_HASHES.has(algo));
  function getPrioritizedHash(algo1, algo2) {
    return DEFAULT_PRIORITY.indexOf(algo1.toLowerCase()) >= DEFAULT_PRIORITY.indexOf(algo2.toLowerCase()) ? algo1 : algo2;
  }
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), chownr = BB.promisify(__webpack_require__(31)), mkdirp = BB.promisify(__webpack_require__(20)), inflight = __webpack_require__(21), inferOwner = __webpack_require__(32), self = {
    uid: null,
    gid: null
  }, getSelf = () => {
    if ("number" != typeof self.uid) {
      self.uid = process.getuid();
      const setuid = process.setuid;
      process.setuid = uid => (self.uid = null, process.setuid = setuid, process.setuid(uid));
    }
    if ("number" != typeof self.gid) {
      self.gid = process.getgid();
      const setgid = process.setgid;
      process.setgid = gid => (self.gid = null, process.setgid = setgid, process.setgid(gid));
    }
  };
  function fixOwner(cache, filepath) {
    return process.getuid ? (getSelf(), 0 !== self.uid ? BB.resolve() : BB.resolve(inferOwner(cache)).then(owner => {
      const {uid: uid, gid: gid} = owner;
      if (self.uid !== uid || self.gid !== gid) return inflight("fixOwner: fixing ownership on " + filepath, () => chownr(filepath, "number" == typeof uid ? uid : self.uid, "number" == typeof gid ? gid : self.gid).catch({
        code: "ENOENT"
      }, () => null));
    })) : BB.resolve();
  }
  function fixOwnerSync(cache, filepath) {
    if (!process.getuid) return;
    const {uid: uid, gid: gid} = inferOwner.sync(cache);
    if (getSelf(), self.uid !== uid || self.gid !== gid) try {
      chownr.sync(filepath, "number" == typeof uid ? uid : self.uid, "number" == typeof gid ? gid : self.gid);
    } catch (err) {
      if ("ENOENT" === err.code) return null;
      throw err;
    }
  }
  module.exports.chownr = fixOwner, module.exports.chownr.sync = fixOwnerSync, module.exports.mkdirfix = function(cache, p, cb) {
    return BB.resolve(inferOwner(cache)).then(() => mkdirp(p).then(made => {
      if (made) return fixOwner(cache, made).then(() => made);
    }).catch({
      code: "EEXIST"
    }, () => fixOwner(cache, p).then(() => null)));
  }, module.exports.mkdirfix.sync = function(cache, p) {
    try {
      inferOwner.sync(cache);
      const made = mkdirp.sync(p);
      if (made) return fixOwnerSync(cache, made), made;
    } catch (err) {
      if ("EEXIST" === err.code) return fixOwnerSync(cache, p), null;
      throw err;
    }
  };
}, function(module, exports, __webpack_require__) {
  let MEMOIZED = new (__webpack_require__(44))({
    max: 52428800,
    maxAge: 18e4,
    length: (entry, key) => key.startsWith("key:") ? entry.data.length : key.startsWith("digest:") ? entry.length : void 0
  });
  function putDigest(cache, integrity, data, opts) {
    pickMem(opts).set(`digest:${cache}:${integrity}`, data);
  }
  module.exports.clearMemoized = function() {
    const old = {};
    return MEMOIZED.forEach((v, k) => {
      old[k] = v;
    }), MEMOIZED.reset(), old;
  }, module.exports.put = function(cache, entry, data, opts) {
    pickMem(opts).set(`key:${cache}:${entry.key}`, {
      entry: entry,
      data: data
    }), putDigest(cache, entry.integrity, data, opts);
  }, module.exports.put.byDigest = putDigest, module.exports.get = function(cache, key, opts) {
    return pickMem(opts).get(`key:${cache}:${key}`);
  }, module.exports.get.byDigest = function(cache, integrity, opts) {
    return pickMem(opts).get(`digest:${cache}:${integrity}`);
  };
  class ObjProxy {
    constructor(obj) {
      this.obj = obj;
    }
    get(key) {
      return this.obj[key];
    }
    set(key, val) {
      this.obj[key] = val;
    }
  }
  function pickMem(opts) {
    return opts && opts.memoize ? opts.memoize.get && opts.memoize.set ? opts.memoize : "object" == typeof opts.memoize ? new ObjProxy(opts.memoize) : MEMOIZED : MEMOIZED;
  }
}, function(module, exports) {
  module.exports = require("crypto");
}, function(module, exports) {
  module.exports = require("stream");
}, function(module, exports, __webpack_require__) {
  var once = __webpack_require__(23), noop = function() {}, eos = function(stream, opts, callback) {
    if ("function" == typeof opts) return eos(stream, null, opts);
    opts || (opts = {}), callback = once(callback || noop);
    var ws = stream._writableState, rs = stream._readableState, readable = opts.readable || !1 !== opts.readable && stream.readable, writable = opts.writable || !1 !== opts.writable && stream.writable, cancelled = !1, onlegacyfinish = function() {
      stream.writable || onfinish();
    }, onfinish = function() {
      writable = !1, readable || callback.call(stream);
    }, onend = function() {
      readable = !1, writable || callback.call(stream);
    }, onexit = function(exitCode) {
      callback.call(stream, exitCode ? new Error("exited with error code: " + exitCode) : null);
    }, onerror = function(err) {
      callback.call(stream, err);
    }, onclose = function() {
      process.nextTick(onclosenexttick);
    }, onclosenexttick = function() {
      if (!cancelled) return (!readable || rs && rs.ended && !rs.destroyed) && (!writable || ws && ws.ended && !ws.destroyed) ? void 0 : callback.call(stream, new Error("premature close"));
    }, onrequest = function() {
      stream.req.on("finish", onfinish);
    };
    return !function(stream) {
      return stream.setHeader && "function" == typeof stream.abort;
    }(stream) ? writable && !ws && (stream.on("end", onlegacyfinish), stream.on("close", onlegacyfinish)) : (stream.on("complete", onfinish), 
    stream.on("abort", onclose), stream.req ? onrequest() : stream.on("request", onrequest)), 
    function(stream) {
      return stream.stdio && Array.isArray(stream.stdio) && 3 === stream.stdio.length;
    }(stream) && stream.on("exit", onexit), stream.on("end", onend), stream.on("finish", onfinish), 
    !1 !== opts.error && stream.on("error", onerror), stream.on("close", onclose), function() {
      cancelled = !0, stream.removeListener("complete", onfinish), stream.removeListener("abort", onclose), 
      stream.removeListener("request", onrequest), stream.req && stream.req.removeListener("finish", onfinish), 
      stream.removeListener("end", onlegacyfinish), stream.removeListener("close", onlegacyfinish), 
      stream.removeListener("finish", onfinish), stream.removeListener("exit", onexit), 
      stream.removeListener("end", onend), stream.removeListener("error", onerror), stream.removeListener("close", onclose);
    };
  };
  module.exports = eos;
}, function(module, exports, __webpack_require__) {
  var types = {
    "*": {
      label: "any",
      check: function() {
        return !0;
      }
    },
    A: {
      label: "array",
      check: function(thingy) {
        return Array.isArray(thingy) || function(thingy) {
          return null != thingy && "object" == typeof thingy && thingy.hasOwnProperty("callee");
        }(thingy);
      }
    },
    S: {
      label: "string",
      check: function(thingy) {
        return "string" == typeof thingy;
      }
    },
    N: {
      label: "number",
      check: function(thingy) {
        return "number" == typeof thingy;
      }
    },
    F: {
      label: "function",
      check: function(thingy) {
        return "function" == typeof thingy;
      }
    },
    O: {
      label: "object",
      check: function(thingy) {
        return "object" == typeof thingy && null != thingy && !types.A.check(thingy) && !types.E.check(thingy);
      }
    },
    B: {
      label: "boolean",
      check: function(thingy) {
        return "boolean" == typeof thingy;
      }
    },
    E: {
      label: "error",
      check: function(thingy) {
        return thingy instanceof Error;
      }
    },
    Z: {
      label: "null",
      check: function(thingy) {
        return null == thingy;
      }
    }
  };
  function addSchema(schema, arity) {
    var group = arity[schema.length] = arity[schema.length] || [];
    -1 === group.indexOf(schema) && group.push(schema);
  }
  var validate = module.exports = function(rawSchemas, args) {
    if (2 !== arguments.length) throw wrongNumberOfArgs([ "SA" ], arguments.length);
    if (!rawSchemas) throw missingRequiredArg(0);
    if (!args) throw missingRequiredArg(1);
    if (!types.S.check(rawSchemas)) throw invalidType(0, [ "string" ], rawSchemas);
    if (!types.A.check(args)) throw invalidType(1, [ "array" ], args);
    var schemas = rawSchemas.split("|"), arity = {};
    schemas.forEach((function(schema) {
      for (var ii = 0; ii < schema.length; ++ii) {
        var type = schema[ii];
        if (!types[type]) throw unknownType(ii, type);
      }
      if (/E.*E/.test(schema)) throw moreThanOneError(schema);
      addSchema(schema, arity), /E/.test(schema) && (addSchema(schema.replace(/E.*$/, "E"), arity), 
      addSchema(schema.replace(/E/, "Z"), arity), 1 === schema.length && addSchema("", arity));
    }));
    var matching = arity[args.length];
    if (!matching) throw wrongNumberOfArgs(Object.keys(arity), args.length);
    for (var ii = 0; ii < args.length; ++ii) {
      var newMatching = matching.filter((function(schema) {
        var type = schema[ii];
        return (0, types[type].check)(args[ii]);
      }));
      if (!newMatching.length) {
        var labels = matching.map((function(schema) {
          return types[schema[ii]].label;
        })).filter((function(schema) {
          return null != schema;
        }));
        throw invalidType(ii, labels, args[ii]);
      }
      matching = newMatching;
    }
  };
  function missingRequiredArg(num) {
    return newException("EMISSINGARG", "Missing required argument #" + (num + 1));
  }
  function unknownType(num, type) {
    return newException("EUNKNOWNTYPE", "Unknown type " + type + " in argument #" + (num + 1));
  }
  function invalidType(num, expectedTypes, value) {
    var valueType;
    return Object.keys(types).forEach((function(typeCode) {
      types[typeCode].check(value) && (valueType = types[typeCode].label);
    })), newException("EINVALIDTYPE", "Argument #" + (num + 1) + ": Expected " + englishList(expectedTypes) + " but got " + valueType);
  }
  function englishList(list) {
    return list.join(", ").replace(/, ([^,]+)$/, " or $1");
  }
  function wrongNumberOfArgs(expected, got) {
    return newException("EWRONGARGCOUNT", "Expected " + englishList(expected) + " " + (expected.every((function(ex) {
      return 1 === ex.length;
    })) ? "argument" : "arguments") + " but got " + got);
  }
  function moreThanOneError(schema) {
    return newException("ETOOMANYERRORTYPES", 'Only one error type per argument signature is allowed, more than one found in "' + schema + '"');
  }
  function newException(code, msg) {
    var e = new Error(msg);
    return e.code = code, Error.captureStackTrace && Error.captureStackTrace(e, validate), 
    e;
  }
}, function(module) {
  module.exports = JSON.parse('{"name":"cacache","publishConfig":{"tag":"legacy"},"version":"12.0.4","cache-version":{"content":"2","index":"5"}}');
}, function(module, exports, __webpack_require__) {
  module.exports = function(hash) {
    return [ hash.slice(0, 2), hash.slice(2, 4), hash.slice(4) ];
  };
}, function(module, exports, __webpack_require__) {
  var path = __webpack_require__(0), fs = __webpack_require__(4), _0777 = parseInt("0777", 8);
  function mkdirP(p, opts, f, made) {
    "function" == typeof opts ? (f = opts, opts = {}) : opts && "object" == typeof opts || (opts = {
      mode: opts
    });
    var mode = opts.mode, xfs = opts.fs || fs;
    void 0 === mode && (mode = _0777), made || (made = null);
    var cb = f || function() {};
    p = path.resolve(p), xfs.mkdir(p, mode, (function(er) {
      if (!er) return cb(null, made = made || p);
      switch (er.code) {
       case "ENOENT":
        var d = path.dirname(p);
        if (d === p) return cb(er);
        mkdirP(d, opts, (function(er, made) {
          er ? cb(er, made) : mkdirP(p, opts, cb, made);
        }));
        break;

       default:
        xfs.stat(p, (function(er2, stat) {
          er2 || !stat.isDirectory() ? cb(er, made) : cb(null, made);
        }));
      }
    }));
  }
  module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP, mkdirP.sync = function sync(p, opts, made) {
    opts && "object" == typeof opts || (opts = {
      mode: opts
    });
    var mode = opts.mode, xfs = opts.fs || fs;
    void 0 === mode && (mode = _0777), made || (made = null), p = path.resolve(p);
    try {
      xfs.mkdirSync(p, mode), made = made || p;
    } catch (err0) {
      switch (err0.code) {
       case "ENOENT":
        var d = path.dirname(p);
        if (d === p) throw err0;
        made = sync(d, opts, made), sync(p, opts, made);
        break;

       default:
        var stat;
        try {
          stat = xfs.statSync(p);
        } catch (err1) {
          throw err0;
        }
        if (!stat.isDirectory()) throw err0;
      }
    }
    return made;
  };
}, function(module, exports, __webpack_require__) {
  let Bluebird;
  module.exports = inflight;
  try {
    Bluebird = __webpack_require__(1);
  } catch (_) {
    Bluebird = Promise;
  }
  const active = {};
  function inflight(unique, doFly) {
    return Bluebird.all([ unique, doFly ]).then((function(args) {
      const unique = args[0], doFly = args[1];
      return Array.isArray(unique) ? Bluebird.all(unique).then((function(uniqueArr) {
        return _inflight(uniqueArr.join(""), doFly);
      })) : _inflight(unique, doFly);
    }));
    function _inflight(unique, doFly) {
      if (!active[unique]) {
        function cleanup() {
          delete active[unique];
        }
        active[unique] = new Bluebird((function(resolve) {
          return resolve(doFly());
        })), active[unique].then(cleanup, cleanup);
      }
      return active[unique];
    }
  }
  inflight.active = active;
}, function(module, exports, __webpack_require__) {
  var once = __webpack_require__(23), eos = __webpack_require__(16), fs = __webpack_require__(4), noop = function() {}, ancient = /^v?\.0/.test(process.version), isFn = function(fn) {
    return "function" == typeof fn;
  }, destroyer = function(stream, reading, writing, callback) {
    callback = once(callback);
    var closed = !1;
    stream.on("close", (function() {
      closed = !0;
    })), eos(stream, {
      readable: reading,
      writable: writing
    }, (function(err) {
      if (err) return callback(err);
      closed = !0, callback();
    }));
    var destroyed = !1;
    return function(err) {
      if (!closed && !destroyed) return destroyed = !0, function(stream) {
        return !!ancient && (!!fs && ((stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)));
      }(stream) ? stream.close(noop) : function(stream) {
        return stream.setHeader && isFn(stream.abort);
      }(stream) ? stream.abort() : isFn(stream.destroy) ? stream.destroy() : void callback(err || new Error("stream was destroyed"));
    };
  }, call = function(fn) {
    fn();
  }, pipe = function(from, to) {
    return from.pipe(to);
  };
  module.exports = function() {
    var error, streams = Array.prototype.slice.call(arguments), callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;
    if (Array.isArray(streams[0]) && (streams = streams[0]), streams.length < 2) throw new Error("pump requires two streams per minimum");
    var destroys = streams.map((function(stream, i) {
      var reading = i < streams.length - 1;
      return destroyer(stream, reading, i > 0, (function(err) {
        error || (error = err), err && destroys.forEach(call), reading || (destroys.forEach(call), 
        callback(error));
      }));
    }));
    return streams.reduce(pipe);
  };
}, function(module, exports, __webpack_require__) {
  var wrappy = __webpack_require__(33);
  function once(fn) {
    var f = function() {
      return f.called ? f.value : (f.called = !0, f.value = fn.apply(this, arguments));
    };
    return f.called = !1, f;
  }
  function onceStrict(fn) {
    var f = function() {
      if (f.called) throw new Error(f.onceError);
      return f.called = !0, f.value = fn.apply(this, arguments);
    }, name = fn.name || "Function wrapped with `once`";
    return f.onceError = name + " shouldn't be called more than once", f.called = !1, 
    f;
  }
  module.exports = wrappy(once), module.exports.strict = wrappy(onceStrict), once.proto = once((function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: !0
    }), Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: !0
    });
  }));
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), contentPath = __webpack_require__(10), figgyPudding = __webpack_require__(5), fs = __webpack_require__(7), PassThrough = __webpack_require__(15).PassThrough, pipe = BB.promisify(__webpack_require__(3).pipe), ssri = __webpack_require__(11), lstatAsync = BB.promisify(fs.lstat), readFileAsync = BB.promisify(fs.readFile), ReadOpts = figgyPudding({
    size: {}
  });
  function readStream(cache, integrity, opts) {
    opts = ReadOpts(opts);
    const stream = new PassThrough;
    return withContentSri(cache, integrity, (cpath, sri) => lstatAsync(cpath).then(stat => ({
      cpath: cpath,
      sri: sri,
      stat: stat
    }))).then(({cpath: cpath, sri: sri, stat: stat}) => pipe(fs.createReadStream(cpath), ssri.integrityStream({
      integrity: sri,
      size: opts.size
    }), stream)).catch(err => {
      stream.emit("error", err);
    }), stream;
  }
  let copyFileAsync;
  function withContentSri(cache, integrity, fn) {
    return BB.try(() => {
      const sri = ssri.parse(integrity), algo = sri.pickAlgorithm(), digests = sri[algo];
      if (digests.length <= 1) {
        const cpath = contentPath(cache, digests[0]);
        return fn(cpath, digests[0]);
      }
      return BB.any(sri[sri.pickAlgorithm()].map(meta => withContentSri(cache, meta, fn), {
        concurrency: 1
      })).catch(err => {
        throw [].some.call(err, e => "ENOENT" === e.code) ? Object.assign(new Error("No matching content found for " + sri.toString()), {
          code: "ENOENT"
        }) : err[0];
      });
    });
  }
  function withContentSriSync(cache, integrity, fn) {
    const sri = ssri.parse(integrity), algo = sri.pickAlgorithm(), digests = sri[algo];
    if (digests.length <= 1) {
      return fn(contentPath(cache, digests[0]), digests[0]);
    }
    {
      let lastErr = null;
      for (const meta of sri[sri.pickAlgorithm()]) try {
        return withContentSriSync(cache, meta, fn);
      } catch (err) {
        lastErr = err;
      }
      if (lastErr) throw lastErr;
    }
  }
  function sizeError(expected, found) {
    var err = new Error(`Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`);
    return err.expected = expected, err.found = found, err.code = "EBADSIZE", err;
  }
  function integrityError(sri, path) {
    var err = new Error(`Integrity verification failed for ${sri} (${path})`);
    return err.code = "EINTEGRITY", err.sri = sri, err.path = path, err;
  }
  module.exports = function(cache, integrity, opts) {
    return opts = ReadOpts(opts), withContentSri(cache, integrity, (cpath, sri) => readFileAsync(cpath, null).then(data => {
      if ("number" == typeof opts.size && opts.size !== data.length) throw sizeError(opts.size, data.length);
      if (ssri.checkData(data, sri)) return data;
      throw integrityError(sri, cpath);
    }));
  }, module.exports.sync = function(cache, integrity, opts) {
    return opts = ReadOpts(opts), withContentSriSync(cache, integrity, (cpath, sri) => {
      const data = fs.readFileSync(cpath);
      if ("number" == typeof opts.size && opts.size !== data.length) throw sizeError(opts.size, data.length);
      if (ssri.checkData(data, sri)) return data;
      throw integrityError(sri, cpath);
    });
  }, module.exports.stream = readStream, module.exports.readStream = readStream, fs.copyFile && (module.exports.copy = function(cache, integrity, dest, opts) {
    return opts = ReadOpts(opts), withContentSri(cache, integrity, (cpath, sri) => copyFileAsync(cpath, dest));
  }, module.exports.copy.sync = function(cache, integrity, dest, opts) {
    return opts = ReadOpts(opts), withContentSriSync(cache, integrity, (cpath, sri) => fs.copyFileSync(cpath, dest));
  }, copyFileAsync = BB.promisify(fs.copyFile)), module.exports.hasContent = function(cache, integrity) {
    if (!integrity) return BB.resolve(!1);
    return withContentSri(cache, integrity, (cpath, sri) => lstatAsync(cpath).then(stat => ({
      size: stat.size,
      sri: sri,
      stat: stat
    }))).catch(err => {
      if ("ENOENT" === err.code) return !1;
      if ("EPERM" === err.code) {
        if ("win32" !== process.platform) throw err;
        return !1;
      }
    });
  }, module.exports.hasContent.sync = function(cache, integrity) {
    if (!integrity) return !1;
    return withContentSriSync(cache, integrity, (cpath, sri) => {
      try {
        const stat = fs.lstatSync(cpath);
        return {
          size: stat.size,
          sri: sri,
          stat: stat
        };
      } catch (err) {
        if ("ENOENT" === err.code) return !1;
        if ("EPERM" === err.code) {
          if ("win32" !== process.platform) throw err;
          return !1;
        }
      }
    });
  };
}, function(module, exports) {
  module.exports = require("./glob");
}, function(module, exports) {
  var cache;
  function MurmurHash3(key, seed) {
    var m = this instanceof MurmurHash3 ? this : cache;
    if (m.reset(seed), "string" == typeof key && key.length > 0 && m.hash(key), m !== this) return m;
  }
  MurmurHash3.prototype.hash = function(key) {
    var h1, k1, i, top, len;
    switch (len = key.length, this.len += len, k1 = this.k1, i = 0, this.rem) {
     case 0:
      k1 ^= len > i ? 65535 & key.charCodeAt(i++) : 0;

     case 1:
      k1 ^= len > i ? (65535 & key.charCodeAt(i++)) << 8 : 0;

     case 2:
      k1 ^= len > i ? (65535 & key.charCodeAt(i++)) << 16 : 0;

     case 3:
      k1 ^= len > i ? (255 & key.charCodeAt(i)) << 24 : 0, k1 ^= len > i ? (65280 & key.charCodeAt(i++)) >> 8 : 0;
    }
    if (this.rem = len + this.rem & 3, (len -= this.rem) > 0) {
      for (h1 = this.h1; h1 = 5 * (h1 = (h1 ^= k1 = 13715 * (k1 = (k1 = 11601 * k1 + 3432906752 * (65535 & k1) & 4294967295) << 15 | k1 >>> 17) + 461832192 * (65535 & k1) & 4294967295) << 13 | h1 >>> 19) + 3864292196 & 4294967295, 
      !(i >= len); ) k1 = 65535 & key.charCodeAt(i++) ^ (65535 & key.charCodeAt(i++)) << 8 ^ (65535 & key.charCodeAt(i++)) << 16, 
      k1 ^= (255 & (top = key.charCodeAt(i++))) << 24 ^ (65280 & top) >> 8;
      switch (k1 = 0, this.rem) {
       case 3:
        k1 ^= (65535 & key.charCodeAt(i + 2)) << 16;

       case 2:
        k1 ^= (65535 & key.charCodeAt(i + 1)) << 8;

       case 1:
        k1 ^= 65535 & key.charCodeAt(i);
      }
      this.h1 = h1;
    }
    return this.k1 = k1, this;
  }, MurmurHash3.prototype.result = function() {
    var k1, h1;
    return k1 = this.k1, h1 = this.h1, k1 > 0 && (h1 ^= k1 = 13715 * (k1 = (k1 = 11601 * k1 + 3432906752 * (65535 & k1) & 4294967295) << 15 | k1 >>> 17) + 461832192 * (65535 & k1) & 4294967295), 
    h1 ^= this.len, h1 = 51819 * (h1 ^= h1 >>> 16) + 2246770688 * (65535 & h1) & 4294967295, 
    h1 = 44597 * (h1 ^= h1 >>> 13) + 3266445312 * (65535 & h1) & 4294967295, (h1 ^= h1 >>> 16) >>> 0;
  }, MurmurHash3.prototype.reset = function(seed) {
    return this.h1 = "number" == typeof seed ? seed : 0, this.rem = this.k1 = this.len = 0, 
    this;
  }, cache = new MurmurHash3, module.exports = MurmurHash3;
}, function(module, exports, __webpack_require__) {
  module.exports = RunQueue;
  var validate = __webpack_require__(17);
  function RunQueue(opts) {
    validate("Z|O", [ opts ]), opts || (opts = {}), this.finished = !1, this.inflight = 0, 
    this.maxConcurrency = opts.maxConcurrency || 1, this.queued = 0, this.queue = [], 
    this.currentPrio = null, this.currentQueue = null, this.Promise = opts.Promise || global.Promise, 
    this.deferred = {};
  }
  RunQueue.prototype = {}, RunQueue.prototype.run = function() {
    if (0 !== arguments.length) throw new Error("RunQueue.run takes no arguments");
    var self = this, deferred = this.deferred;
    return deferred.promise || (deferred.promise = new this.Promise((function(resolve, reject) {
      deferred.resolve = resolve, deferred.reject = reject, self._runQueue();
    }))), deferred.promise;
  }, RunQueue.prototype._runQueue = function() {
    for (var self = this; this.inflight < this.maxConcurrency && this.queued; ) {
      if (!this.currentQueue || 0 === this.currentQueue.length) {
        if (this.inflight) return;
        for (var prios = Object.keys(this.queue), ii = 0; ii < prios.length; ++ii) {
          var prioQueue = this.queue[prios[ii]];
          if (prioQueue.length) {
            this.currentQueue = prioQueue, this.currentPrio = prios[ii];
            break;
          }
        }
      }
      --this.queued, ++this.inflight;
      var next = this.currentQueue.shift(), args = next.args || [];
      new this.Promise((function(resolve) {
        resolve(next.cmd.apply(null, args));
      })).then((function() {
        --self.inflight, self.finished || (self.queued <= 0 && self.inflight <= 0 && (self.finished = !0, 
        self.deferred.resolve()), self._runQueue());
      }), (function(err) {
        self.finished = !0, self.deferred.reject(err);
      }));
    }
  }, RunQueue.prototype.add = function(prio, cmd, args) {
    if (this.finished) throw new Error("Can't add to a finished queue. Create a new queue.");
    if (Math.abs(Math.floor(prio)) !== prio) throw new Error("Priorities must be a positive integer value.");
    validate("NFA|NFZ", [ prio, cmd, args ]), prio = Number(prio), this.queue[prio] || (this.queue[prio] = []), 
    ++this.queued, this.queue[prio].push({
      cmd: cmd,
      args: args
    }), this.currentPrio > prio && (this.currentQueue = this.queue[prio], this.currentPrio = prio);
  };
}, function(module, exports, __webpack_require__) {
  var path = __webpack_require__(0), uniqueSlug = __webpack_require__(56);
  module.exports = function(filepath, prefix, uniq) {
    return path.join(filepath, (prefix ? prefix + "-" : "") + uniqueSlug(uniq));
  };
}, function(module, exports, __webpack_require__) {
  const ls = __webpack_require__(30), get = __webpack_require__(43), put = __webpack_require__(47), rm = __webpack_require__(57), verify = __webpack_require__(59), clearMemoized = __webpack_require__(13).clearMemoized, tmp = __webpack_require__(60), x = module.exports;
  x.ls = cache => ls(cache), x.ls.stream = cache => ls.stream(cache), x.get = (cache, key, opts) => get(cache, key, opts), 
  x.get.byDigest = (cache, hash, opts) => get.byDigest(cache, hash, opts), x.get.sync = (cache, key, opts) => get.sync(cache, key, opts), 
  x.get.sync.byDigest = (cache, key, opts) => get.sync.byDigest(cache, key, opts), 
  x.get.stream = (cache, key, opts) => get.stream(cache, key, opts), x.get.stream.byDigest = (cache, hash, opts) => get.stream.byDigest(cache, hash, opts), 
  x.get.copy = (cache, key, dest, opts) => get.copy(cache, key, dest, opts), x.get.copy.byDigest = (cache, hash, dest, opts) => get.copy.byDigest(cache, hash, dest, opts), 
  x.get.info = (cache, key) => get.info(cache, key), x.get.hasContent = (cache, hash) => get.hasContent(cache, hash), 
  x.get.hasContent.sync = (cache, hash) => get.hasContent.sync(cache, hash), x.put = (cache, key, data, opts) => put(cache, key, data, opts), 
  x.put.stream = (cache, key, opts) => put.stream(cache, key, opts), x.rm = (cache, key) => rm.entry(cache, key), 
  x.rm.all = cache => rm.all(cache), x.rm.entry = x.rm, x.rm.content = (cache, hash) => rm.content(cache, hash), 
  x.clearMemoized = () => clearMemoized(), x.tmp = {}, x.tmp.mkdir = (cache, opts) => tmp.mkdir(cache, opts), 
  x.tmp.withTmp = (cache, opts, cb) => tmp.withTmp(cache, opts, cb), x.verify = (cache, opts) => verify(cache, opts), 
  x.verify.lastRun = cache => verify.lastRun(cache);
}, function(module, exports, __webpack_require__) {
  var index = __webpack_require__(9);
  module.exports = index.ls, module.exports.stream = index.lsStream;
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(4), path = __webpack_require__(0), LCHOWN = fs.lchown ? "lchown" : "chown", LCHOWNSYNC = fs.lchownSync ? "lchownSync" : "chownSync", needEISDIRHandled = fs.lchown && !process.version.match(/v1[1-9]+\./) && !process.version.match(/v10\.[6-9]/), lchownSync = (path, uid, gid) => {
    try {
      return fs[LCHOWNSYNC](path, uid, gid);
    } catch (er) {
      if ("ENOENT" !== er.code) throw er;
    }
  }, handleEISDIR = needEISDIRHandled ? (path, uid, gid, cb) => er => {
    er && "EISDIR" === er.code ? fs.chown(path, uid, gid, cb) : cb(er);
  } : (_, __, ___, cb) => cb, handleEISDirSync = needEISDIRHandled ? (path, uid, gid) => {
    try {
      return lchownSync(path, uid, gid);
    } catch (er) {
      if ("EISDIR" !== er.code) throw er;
      ((path, uid, gid) => {
        try {
          fs.chownSync(path, uid, gid);
        } catch (er) {
          if ("ENOENT" !== er.code) throw er;
        }
      })(path, uid, gid);
    }
  } : (path, uid, gid) => lchownSync(path, uid, gid), nodeVersion = process.version;
  let readdir = (path, options, cb) => fs.readdir(path, options, cb);
  /^v4\./.test(nodeVersion) && (readdir = (path, options, cb) => fs.readdir(path, cb));
  const chown = (cpath, uid, gid, cb) => {
    fs[LCHOWN](cpath, uid, gid, handleEISDIR(cpath, uid, gid, er => {
      cb(er && "ENOENT" !== er.code ? er : null);
    }));
  }, chownrKid = (p, child, uid, gid, cb) => {
    if ("string" == typeof child) return fs.lstat(path.resolve(p, child), (er, stats) => {
      if (er) return cb("ENOENT" !== er.code ? er : null);
      stats.name = child, chownrKid(p, stats, uid, gid, cb);
    });
    if (child.isDirectory()) chownr(path.resolve(p, child.name), uid, gid, er => {
      if (er) return cb(er);
      const cpath = path.resolve(p, child.name);
      chown(cpath, uid, gid, cb);
    }); else {
      const cpath = path.resolve(p, child.name);
      chown(cpath, uid, gid, cb);
    }
  }, chownr = (p, uid, gid, cb) => {
    readdir(p, {
      withFileTypes: !0
    }, (er, children) => {
      if (er) {
        if ("ENOENT" === er.code) return cb();
        if ("ENOTDIR" !== er.code && "ENOTSUP" !== er.code) return cb(er);
      }
      if (er || !children.length) return chown(p, uid, gid, cb);
      let len = children.length, errState = null;
      const then = er => {
        if (!errState) return er ? cb(errState = er) : 0 == --len ? chown(p, uid, gid, cb) : void 0;
      };
      children.forEach(child => chownrKid(p, child, uid, gid, then));
    });
  }, chownrSync = (p, uid, gid) => {
    let children;
    try {
      children = ((path, options) => fs.readdirSync(path, options))(p, {
        withFileTypes: !0
      });
    } catch (er) {
      if ("ENOENT" === er.code) return;
      if ("ENOTDIR" === er.code || "ENOTSUP" === er.code) return handleEISDirSync(p, uid, gid);
      throw er;
    }
    return children && children.length && children.forEach(child => ((p, child, uid, gid) => {
      if ("string" == typeof child) try {
        const stats = fs.lstatSync(path.resolve(p, child));
        stats.name = child, child = stats;
      } catch (er) {
        if ("ENOENT" === er.code) return;
        throw er;
      }
      child.isDirectory() && chownrSync(path.resolve(p, child.name), uid, gid), handleEISDirSync(path.resolve(p, child.name), uid, gid);
    })(p, child, uid, gid)), handleEISDirSync(p, uid, gid);
  };
  module.exports = chownr, chownr.sync = chownrSync;
}, function(module, exports, __webpack_require__) {
  const cache = new Map, fs = __webpack_require__(4), {dirname: dirname, resolve: resolve} = __webpack_require__(0), inferOwner = path => {
    if (path = resolve(path), cache.has(path)) return Promise.resolve(cache.get(path));
    const parent = dirname(path), parentTrap = parent === path ? null : er => inferOwner(parent).then(owner => (cache.set(path, owner), 
    owner));
    return (path => new Promise((res, rej) => fs.lstat(path, (er, st) => er ? rej(er) : res(st))))(path).then(st => {
      const {uid: uid, gid: gid} = st;
      return cache.set(path, {
        uid: uid,
        gid: gid
      }), {
        uid: uid,
        gid: gid
      };
    }, parentTrap);
  }, inferOwnerSync = path => {
    if (path = resolve(path), cache.has(path)) return cache.get(path);
    const parent = dirname(path);
    let threw = !0;
    try {
      const st = fs.lstatSync(path);
      threw = !1;
      const {uid: uid, gid: gid} = st;
      return cache.set(path, {
        uid: uid,
        gid: gid
      }), {
        uid: uid,
        gid: gid
      };
    } finally {
      if (threw && parent !== path) {
        const owner = inferOwnerSync(parent);
        return cache.set(path, owner), owner;
      }
    }
  }, inflight = new Map;
  module.exports = path => {
    if (path = resolve(path), inflight.has(path)) return Promise.resolve(inflight.get(path));
    const p = inferOwner(path).then(owner => (inflight.delete(path), owner));
    return inflight.set(path, p), p;
  }, module.exports.sync = inferOwnerSync, module.exports.clearCache = () => {
    cache.clear(), inflight.clear();
  };
}, function(module, exports) {
  module.exports = function wrappy(fn, cb) {
    if (fn && cb) return wrappy(fn)(cb);
    if ("function" != typeof fn) throw new TypeError("need wrapper function");
    return Object.keys(fn).forEach((function(k) {
      wrapper[k] = fn[k];
    })), wrapper;
    function wrapper() {
      for (var args = new Array(arguments.length), i = 0; i < args.length; i++) args[i] = arguments[i];
      var ret = fn.apply(this, args), cb = args[args.length - 1];
      return "function" == typeof ret && ret !== cb && Object.keys(cb).forEach((function(k) {
        ret[k] = cb[k];
      })), ret;
    }
  };
}, function(module, exports, __webpack_require__) {
  var pump = __webpack_require__(22), inherits = __webpack_require__(2).inherits, Duplexify = __webpack_require__(35), toArray = function(args) {
    return args.length ? Array.isArray(args[0]) ? args[0] : Array.prototype.slice.call(args) : [];
  }, define = function(opts) {
    var Pumpify = function() {
      var streams = toArray(arguments);
      if (!(this instanceof Pumpify)) return new Pumpify(streams);
      Duplexify.call(this, null, null, opts), streams.length && this.setPipeline(streams);
    };
    return inherits(Pumpify, Duplexify), Pumpify.prototype.setPipeline = function() {
      var streams = toArray(arguments), self = this, ended = !1, w = streams[0], r = streams[streams.length - 1];
      r = r.readable ? r : null, w = w.writable ? w : null;
      var onclose = function() {
        streams[0].emit("error", new Error("stream was destroyed"));
      };
      if (this.on("close", onclose), this.on("prefinish", (function() {
        ended || self.cork();
      })), pump(streams, (function(err) {
        if (self.removeListener("close", onclose), err) return self.destroy("premature close" === err.message ? null : err);
        ended = !0, !1 === self._autoDestroy && (self._autoDestroy = !0), self.uncork();
      })), this.destroyed) return onclose();
      this.setWritable(w), this.setReadable(r);
    }, Pumpify;
  };
  module.exports = define({
    autoDestroy: !1,
    destroy: !1
  }), module.exports.obj = define({
    autoDestroy: !1,
    destroy: !1,
    objectMode: !0,
    highWaterMark: 16
  }), module.exports.ctor = define;
}, function(module, exports, __webpack_require__) {
  var stream = __webpack_require__(8), eos = __webpack_require__(16), inherits = __webpack_require__(2).inherits, shift = __webpack_require__(36), SIGNAL_FLUSH = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([ 0 ]) : new Buffer([ 0 ]), onuncork = function(self, fn) {
    self._corked ? self.once("uncork", fn) : fn();
  }, destroyer = function(self, end) {
    return function(err) {
      err ? function(self, err) {
        self._autoDestroy && self.destroy(err);
      }(self, "premature close" === err.message ? null : err) : end && !self._ended && self.end();
    };
  }, Duplexify = function(writable, readable, opts) {
    if (!(this instanceof Duplexify)) return new Duplexify(writable, readable, opts);
    stream.Duplex.call(this, opts), this._writable = null, this._readable = null, this._readable2 = null, 
    this._autoDestroy = !opts || !1 !== opts.autoDestroy, this._forwardDestroy = !opts || !1 !== opts.destroy, 
    this._forwardEnd = !opts || !1 !== opts.end, this._corked = 1, this._ondrain = null, 
    this._drained = !1, this._forwarding = !1, this._unwrite = null, this._unread = null, 
    this._ended = !1, this.destroyed = !1, writable && this.setWritable(writable), readable && this.setReadable(readable);
  };
  inherits(Duplexify, stream.Duplex), Duplexify.obj = function(writable, readable, opts) {
    return opts || (opts = {}), opts.objectMode = !0, opts.highWaterMark = 16, new Duplexify(writable, readable, opts);
  }, Duplexify.prototype.cork = function() {
    1 == ++this._corked && this.emit("cork");
  }, Duplexify.prototype.uncork = function() {
    this._corked && 0 == --this._corked && this.emit("uncork");
  }, Duplexify.prototype.setWritable = function(writable) {
    if (this._unwrite && this._unwrite(), this.destroyed) writable && writable.destroy && writable.destroy(); else if (null !== writable && !1 !== writable) {
      var self = this, unend = eos(writable, {
        writable: !0,
        readable: !1
      }, destroyer(this, this._forwardEnd)), ondrain = function() {
        var ondrain = self._ondrain;
        self._ondrain = null, ondrain && ondrain();
      };
      this._unwrite && process.nextTick(ondrain), this._writable = writable, this._writable.on("drain", ondrain), 
      this._unwrite = function() {
        self._writable.removeListener("drain", ondrain), unend();
      }, this.uncork();
    } else this.end();
  }, Duplexify.prototype.setReadable = function(readable) {
    if (this._unread && this._unread(), this.destroyed) readable && readable.destroy && readable.destroy(); else {
      if (null === readable || !1 === readable) return this.push(null), void this.resume();
      var rs, self = this, unend = eos(readable, {
        writable: !1,
        readable: !0
      }, destroyer(this)), onreadable = function() {
        self._forward();
      }, onend = function() {
        self.push(null);
      };
      this._drained = !0, this._readable = readable, this._readable2 = readable._readableState ? readable : (rs = readable, 
      new stream.Readable({
        objectMode: !0,
        highWaterMark: 16
      }).wrap(rs)), this._readable2.on("readable", onreadable), this._readable2.on("end", onend), 
      this._unread = function() {
        self._readable2.removeListener("readable", onreadable), self._readable2.removeListener("end", onend), 
        unend();
      }, this._forward();
    }
  }, Duplexify.prototype._read = function() {
    this._drained = !0, this._forward();
  }, Duplexify.prototype._forward = function() {
    if (!this._forwarding && this._readable2 && this._drained) {
      var data;
      for (this._forwarding = !0; this._drained && null !== (data = shift(this._readable2)); ) this.destroyed || (this._drained = this.push(data));
      this._forwarding = !1;
    }
  }, Duplexify.prototype.destroy = function(err) {
    if (!this.destroyed) {
      this.destroyed = !0;
      var self = this;
      process.nextTick((function() {
        self._destroy(err);
      }));
    }
  }, Duplexify.prototype._destroy = function(err) {
    if (err) {
      var ondrain = this._ondrain;
      this._ondrain = null, ondrain ? ondrain(err) : this.emit("error", err);
    }
    this._forwardDestroy && (this._readable && this._readable.destroy && this._readable.destroy(), 
    this._writable && this._writable.destroy && this._writable.destroy()), this.emit("close");
  }, Duplexify.prototype._write = function(data, enc, cb) {
    return this.destroyed ? cb() : this._corked ? onuncork(this, this._write.bind(this, data, enc, cb)) : data === SIGNAL_FLUSH ? this._finish(cb) : this._writable ? void (!1 === this._writable.write(data) ? this._ondrain = cb : cb()) : cb();
  }, Duplexify.prototype._finish = function(cb) {
    var self = this;
    this.emit("preend"), onuncork(this, (function() {
      var ws, fn;
      ws = self._forwardEnd && self._writable, fn = function() {
        !1 === self._writableState.prefinished && (self._writableState.prefinished = !0), 
        self.emit("prefinish"), onuncork(self, cb);
      }, ws ? ws._writableState && ws._writableState.finished ? fn() : ws._writableState ? ws.end(fn) : (ws.end(), 
      fn()) : fn();
    }));
  }, Duplexify.prototype.end = function(data, enc, cb) {
    return "function" == typeof data ? this.end(null, null, data) : "function" == typeof enc ? this.end(data, null, enc) : (this._ended = !0, 
    data && this.write(data), this._writableState.ending || this.write(SIGNAL_FLUSH), 
    stream.Writable.prototype.end.call(this, cb));
  }, module.exports = Duplexify;
}, function(module, exports) {
  module.exports = function(stream) {
    var rs = stream._readableState;
    return rs ? rs.objectMode || "number" == typeof stream._duplexState ? stream.read() : stream.read(function(state) {
      if (state.buffer.length) return state.buffer.head ? state.buffer.head.data.length : state.buffer[0].length;
      return state.length;
    }(rs)) : null;
  };
}, function(module, exports, __webpack_require__) {
  var Transform = __webpack_require__(8).Transform, inherits = __webpack_require__(2).inherits, xtend = __webpack_require__(38);
  function DestroyableTransform(opts) {
    Transform.call(this, opts), this._destroyed = !1;
  }
  function noop(chunk, enc, callback) {
    callback(null, chunk);
  }
  function through2(construct) {
    return function(options, transform, flush) {
      return "function" == typeof options && (flush = transform, transform = options, 
      options = {}), "function" != typeof transform && (transform = noop), "function" != typeof flush && (flush = null), 
      construct(options, transform, flush);
    };
  }
  inherits(DestroyableTransform, Transform), DestroyableTransform.prototype.destroy = function(err) {
    if (!this._destroyed) {
      this._destroyed = !0;
      var self = this;
      process.nextTick((function() {
        err && self.emit("error", err), self.emit("close");
      }));
    }
  }, module.exports = through2((function(options, transform, flush) {
    var t2 = new DestroyableTransform(options);
    return t2._transform = transform, flush && (t2._flush = flush), t2;
  })), module.exports.ctor = through2((function(options, transform, flush) {
    function Through2(override) {
      if (!(this instanceof Through2)) return new Through2(override);
      this.options = xtend(options, override), DestroyableTransform.call(this, this.options);
    }
    return inherits(Through2, DestroyableTransform), Through2.prototype._transform = transform, 
    flush && (Through2.prototype._flush = flush), Through2;
  })), module.exports.obj = through2((function(options, transform, flush) {
    var t2 = new DestroyableTransform(xtend({
      objectMode: !0,
      highWaterMark: 16
    }, options));
    return t2._transform = transform, flush && (t2._flush = flush), t2;
  }));
}, function(module, exports) {
  module.exports = function() {
    for (var target = {}, i = 0; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
}, function(module, exports, __webpack_require__) {
  var Writable = __webpack_require__(8).Writable, inherits = __webpack_require__(2).inherits, bufferFrom = __webpack_require__(40), U8 = Uint8Array;
  function ConcatStream(opts, cb) {
    if (!(this instanceof ConcatStream)) return new ConcatStream(opts, cb);
    "function" == typeof opts && (cb = opts, opts = {}), opts || (opts = {});
    var encoding = opts.encoding, shouldInferEncoding = !1;
    encoding ? "u8" !== (encoding = String(encoding).toLowerCase()) && "uint8" !== encoding || (encoding = "uint8array") : shouldInferEncoding = !0, 
    Writable.call(this, {
      objectMode: !0
    }), this.encoding = encoding, this.shouldInferEncoding = shouldInferEncoding, cb && this.on("finish", (function() {
      cb(this.getBody());
    })), this.body = [];
  }
  module.exports = ConcatStream, inherits(ConcatStream, Writable), ConcatStream.prototype._write = function(chunk, enc, next) {
    this.body.push(chunk), next();
  }, ConcatStream.prototype.inferEncoding = function(buff) {
    var firstBuffer = void 0 === buff ? this.body[0] : buff;
    return Buffer.isBuffer(firstBuffer) ? "buffer" : "undefined" != typeof Uint8Array && firstBuffer instanceof Uint8Array ? "uint8array" : Array.isArray(firstBuffer) ? "array" : "string" == typeof firstBuffer ? "string" : "[object Object]" === Object.prototype.toString.call(firstBuffer) ? "object" : "buffer";
  }, ConcatStream.prototype.getBody = function() {
    return this.encoding || 0 !== this.body.length ? (this.shouldInferEncoding && (this.encoding = this.inferEncoding()), 
    "array" === this.encoding ? function(parts) {
      for (var res = [], i = 0; i < parts.length; i++) res.push.apply(res, parts[i]);
      return res;
    }(this.body) : "string" === this.encoding ? function(parts) {
      for (var strings = [], i = 0; i < parts.length; i++) {
        var p = parts[i];
        "string" == typeof p || Buffer.isBuffer(p) ? strings.push(p) : isBufferish(p) ? strings.push(bufferFrom(p)) : strings.push(bufferFrom(String(p)));
      }
      strings = Buffer.isBuffer(parts[0]) ? (strings = Buffer.concat(strings)).toString("utf8") : strings.join("");
      return strings;
    }(this.body) : "buffer" === this.encoding ? function(parts) {
      for (var bufs = [], i = 0; i < parts.length; i++) {
        var p = parts[i];
        Buffer.isBuffer(p) ? bufs.push(p) : isBufferish(p) ? bufs.push(bufferFrom(p)) : bufs.push(bufferFrom(String(p)));
      }
      return Buffer.concat(bufs);
    }(this.body) : "uint8array" === this.encoding ? function(parts) {
      for (var len = 0, i = 0; i < parts.length; i++) "string" == typeof parts[i] && (parts[i] = bufferFrom(parts[i])), 
      len += parts[i].length;
      for (var u8 = new U8(len), offset = (i = 0, 0); i < parts.length; i++) for (var part = parts[i], j = 0; j < part.length; j++) u8[offset++] = part[j];
      return u8;
    }(this.body) : this.body) : [];
  };
  Array.isArray;
  function isBufferish(p) {
    return "string" == typeof p || (arr = p, /Array\]$/.test(Object.prototype.toString.call(arr))) || p && "function" == typeof p.subarray;
    var arr;
  }
}, function(module, exports) {
  var toString = Object.prototype.toString, isModern = "undefined" != typeof Buffer && "function" == typeof Buffer.alloc && "function" == typeof Buffer.allocUnsafe && "function" == typeof Buffer.from;
  module.exports = function(value, encodingOrOffset, length) {
    if ("number" == typeof value) throw new TypeError('"value" argument must not be a number');
    return input = value, "ArrayBuffer" === toString.call(input).slice(8, -1) ? function(obj, byteOffset, length) {
      byteOffset >>>= 0;
      var maxLength = obj.byteLength - byteOffset;
      if (maxLength < 0) throw new RangeError("'offset' is out of bounds");
      if (void 0 === length) length = maxLength; else if ((length >>>= 0) > maxLength) throw new RangeError("'length' is out of bounds");
      return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
    }(value, encodingOrOffset, length) : "string" == typeof value ? function(string, encoding) {
      if ("string" == typeof encoding && "" !== encoding || (encoding = "utf8"), !Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
      return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
    }(value, encodingOrOffset) : isModern ? Buffer.from(value) : new Buffer(value);
    var input;
  };
}, function(module, exports, __webpack_require__) {
  var Readable = __webpack_require__(8).Readable, inherits = __webpack_require__(2).inherits;
  module.exports = from2, from2.ctor = ctor, from2.obj = function(opts, read) {
    ("function" == typeof opts || Array.isArray(opts)) && (read = opts, opts = {});
    return (opts = defaults(opts)).objectMode = !0, opts.highWaterMark = 16, from2(opts, read);
  };
  var Proto = ctor();
  function from2(opts, read) {
    ("object" != typeof opts || Array.isArray(opts)) && (read = opts, opts = {});
    var list, rs = new Proto(opts);
    return rs._from = Array.isArray(read) ? (list = (list = read).slice(), function(_, cb) {
      var err = null, item = list.length ? list.shift() : null;
      item instanceof Error && (err = item, item = null), cb(err, item);
    }) : read || noop, rs;
  }
  function ctor(opts, read) {
    function Class(override) {
      if (!(this instanceof Class)) return new Class(override);
      this._reading = !1, this._callback = function(err, data) {
        if (self.destroyed) return;
        if (err) return self.destroy(err);
        if (null === data) return self.push(null);
        self._reading = !1, self.push(data) && self._read(hwm);
      }, this.destroyed = !1, Readable.call(this, override || opts);
      var self = this, hwm = this._readableState.highWaterMark;
    }
    return "function" == typeof opts && (read = opts, opts = {}), opts = defaults(opts), 
    inherits(Class, Readable), Class.prototype._from = read || noop, Class.prototype._read = function(size) {
      this._reading || this.destroyed || (this._reading = !0, this._from(size, this._callback));
    }, Class.prototype.destroy = function(err) {
      if (!this.destroyed) {
        this.destroyed = !0;
        var self = this;
        process.nextTick((function() {
          err && self.emit("error", err), self.emit("close");
        }));
      }
    }, Class;
  }
  function noop() {}
  function defaults(opts) {
    return opts = opts || {};
  }
}, function(module, exports, __webpack_require__) {
  var stream = __webpack_require__(8), inherits = __webpack_require__(2).inherits, SIGNAL_FLUSH = Buffer.from && Buffer.from !== Uint8Array.from ? Buffer.from([ 0 ]) : new Buffer([ 0 ]);
  function WriteStream(opts, write, flush) {
    if (!(this instanceof WriteStream)) return new WriteStream(opts, write, flush);
    "function" == typeof opts && (flush = write, write = opts, opts = {}), stream.Writable.call(this, opts), 
    this.destroyed = !1, this._worker = write || null, this._flush = flush || null;
  }
  module.exports = WriteStream, inherits(WriteStream, stream.Writable), WriteStream.obj = function(opts, worker, flush) {
    return "function" == typeof opts ? WriteStream.obj(null, opts, worker) : (opts || (opts = {}), 
    opts.objectMode = !0, new WriteStream(opts, worker, flush));
  }, WriteStream.prototype._write = function(data, enc, cb) {
    SIGNAL_FLUSH === data ? this._flush(cb) : this._worker(data, enc, cb);
  }, WriteStream.prototype.end = function(data, enc, cb) {
    return this._flush ? "function" == typeof data ? this.end(null, null, data) : "function" == typeof enc ? this.end(data, null, enc) : (data && this.write(data), 
    this._writableState.ending || this.write(SIGNAL_FLUSH), stream.Writable.prototype.end.call(this, cb)) : stream.Writable.prototype.end.apply(this, arguments);
  }, WriteStream.prototype.destroy = function(err) {
    this.destroyed || (this.destroyed = !0, err && this.emit("error", err), this.emit("close"));
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), figgyPudding = __webpack_require__(5), fs = __webpack_require__(4), index = __webpack_require__(9), memo = __webpack_require__(13), pipe = __webpack_require__(3).pipe, pipeline = __webpack_require__(3).pipeline, read = __webpack_require__(24), through = __webpack_require__(3).through, GetOpts = figgyPudding({
    integrity: {},
    memoize: {},
    size: {}
  });
  function getData(byDigest, cache, key, opts) {
    opts = GetOpts(opts);
    const memoized = byDigest ? memo.get.byDigest(cache, key, opts) : memo.get(cache, key, opts);
    return memoized && !1 !== opts.memoize ? BB.resolve(byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    }) : (byDigest ? BB.resolve(null) : index.find(cache, key, opts)).then(entry => {
      if (!entry && !byDigest) throw new index.NotFoundError(cache, key);
      return read(cache, byDigest ? key : entry.integrity, {
        integrity: opts.integrity,
        size: opts.size
      }).then(data => byDigest ? data : {
        metadata: entry.metadata,
        data: data,
        size: entry.size,
        integrity: entry.integrity
      }).then(res => (opts.memoize && byDigest ? memo.put.byDigest(cache, key, res, opts) : opts.memoize && memo.put(cache, entry, res.data, opts), 
      res));
    });
  }
  function getDataSync(byDigest, cache, key, opts) {
    opts = GetOpts(opts);
    const memoized = byDigest ? memo.get.byDigest(cache, key, opts) : memo.get(cache, key, opts);
    if (memoized && !1 !== opts.memoize) return byDigest ? memoized : {
      metadata: memoized.entry.metadata,
      data: memoized.data,
      integrity: memoized.entry.integrity,
      size: memoized.entry.size
    };
    const entry = !byDigest && index.find.sync(cache, key, opts);
    if (!entry && !byDigest) throw new index.NotFoundError(cache, key);
    const data = read.sync(cache, byDigest ? key : entry.integrity, {
      integrity: opts.integrity,
      size: opts.size
    }), res = byDigest ? data : {
      metadata: entry.metadata,
      data: data,
      size: entry.size,
      integrity: entry.integrity
    };
    return opts.memoize && byDigest ? memo.put.byDigest(cache, key, res, opts) : opts.memoize && memo.put(cache, entry, res.data, opts), 
    res;
  }
  function copy(byDigest, cache, key, dest, opts) {
    return opts = GetOpts(opts), read.copy ? (byDigest ? BB.resolve(null) : index.find(cache, key, opts)).then(entry => {
      if (!entry && !byDigest) throw new index.NotFoundError(cache, key);
      return read.copy(cache, byDigest ? key : entry.integrity, dest, opts).then(() => byDigest ? key : {
        metadata: entry.metadata,
        size: entry.size,
        integrity: entry.integrity
      });
    }) : getData(byDigest, cache, key, opts).then(res => fs.writeFileAsync(dest, byDigest ? res : res.data).then(() => byDigest ? key : {
      metadata: res.metadata,
      size: res.size,
      integrity: res.integrity
    }));
  }
  module.exports = function(cache, key, opts) {
    return getData(!1, cache, key, opts);
  }, module.exports.byDigest = function(cache, digest, opts) {
    return getData(!0, cache, digest, opts);
  }, module.exports.sync = function(cache, key, opts) {
    return getDataSync(!1, cache, key, opts);
  }, module.exports.sync.byDigest = function(cache, digest, opts) {
    return getDataSync(!0, cache, digest, opts);
  }, module.exports.stream = function(cache, key, opts) {
    opts = GetOpts(opts);
    let stream = through();
    const memoized = memo.get(cache, key, opts);
    if (memoized && !1 !== opts.memoize) return stream.on("newListener", (function(ev, cb) {
      "metadata" === ev && cb(memoized.entry.metadata), "integrity" === ev && cb(memoized.entry.integrity), 
      "size" === ev && cb(memoized.entry.size);
    })), stream.write(memoized.data, () => stream.end()), stream;
    return index.find(cache, key).then(entry => {
      if (!entry) return stream.emit("error", new index.NotFoundError(cache, key));
      let memoStream;
      if (opts.memoize) {
        let memoData = [], memoLength = 0;
        memoStream = through((c, en, cb) => {
          memoData && memoData.push(c), memoLength += c.length, cb(null, c, en);
        }, cb => {
          memoData && memo.put(cache, entry, Buffer.concat(memoData, memoLength), opts), cb();
        });
      } else memoStream = through();
      stream.emit("metadata", entry.metadata), stream.emit("integrity", entry.integrity), 
      stream.emit("size", entry.size), stream.on("newListener", (function(ev, cb) {
        "metadata" === ev && cb(entry.metadata), "integrity" === ev && cb(entry.integrity), 
        "size" === ev && cb(entry.size);
      })), pipe(read.readStream(cache, entry.integrity, opts.concat({
        size: null == opts.size ? entry.size : opts.size
      })), memoStream, stream);
    }).catch(err => stream.emit("error", err)), stream;
  }, module.exports.stream.byDigest = function(cache, integrity, opts) {
    opts = GetOpts(opts);
    const memoized = memo.get.byDigest(cache, integrity, opts);
    if (memoized && !1 !== opts.memoize) {
      const stream = through();
      return stream.write(memoized, () => stream.end()), stream;
    }
    {
      let stream = read.readStream(cache, integrity, opts);
      if (opts.memoize) {
        let memoData = [], memoLength = 0;
        const memoStream = through((c, en, cb) => {
          memoData && memoData.push(c), memoLength += c.length, cb(null, c, en);
        }, cb => {
          memoData && memo.put.byDigest(cache, integrity, Buffer.concat(memoData, memoLength), opts), 
          cb();
        });
        stream = pipeline(stream, memoStream);
      }
      return stream;
    }
  }, module.exports.info = function(cache, key, opts) {
    opts = GetOpts(opts);
    const memoized = memo.get(cache, key, opts);
    return memoized && !1 !== opts.memoize ? BB.resolve(memoized.entry) : index.find(cache, key);
  }, module.exports.hasContent = read.hasContent, module.exports.copy = function(cache, key, dest, opts) {
    return copy(!1, cache, key, dest, opts);
  }, module.exports.copy.byDigest = function(cache, digest, dest, opts) {
    return copy(!0, cache, digest, dest, opts);
  };
}, function(module, exports, __webpack_require__) {
  const Yallist = __webpack_require__(45), MAX = Symbol("max"), LENGTH = Symbol("length"), LENGTH_CALCULATOR = Symbol("lengthCalculator"), ALLOW_STALE = Symbol("allowStale"), MAX_AGE = Symbol("maxAge"), DISPOSE = Symbol("dispose"), NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet"), LRU_LIST = Symbol("lruList"), CACHE = Symbol("cache"), UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet"), naiveLength = () => 1;
  const get = (self, key, doUse) => {
    const node = self[CACHE].get(key);
    if (node) {
      const hit = node.value;
      if (isStale(self, hit)) {
        if (del(self, node), !self[ALLOW_STALE]) return;
      } else doUse && (self[UPDATE_AGE_ON_GET] && (node.value.now = Date.now()), self[LRU_LIST].unshiftNode(node));
      return hit.value;
    }
  }, isStale = (self, hit) => {
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return !1;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
  }, trim = self => {
    if (self[LENGTH] > self[MAX]) for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && null !== walker; ) {
      const prev = walker.prev;
      del(self, walker), walker = prev;
    }
  }, del = (self, node) => {
    if (node) {
      const hit = node.value;
      self[DISPOSE] && self[DISPOSE](hit.key, hit.value), self[LENGTH] -= hit.length, 
      self[CACHE].delete(hit.key), self[LRU_LIST].removeNode(node);
    }
  };
  class Entry {
    constructor(key, value, length, now, maxAge) {
      this.key = key, this.value = value, this.length = length, this.now = now, this.maxAge = maxAge || 0;
    }
  }
  const forEachStep = (self, fn, node, thisp) => {
    let hit = node.value;
    isStale(self, hit) && (del(self, node), self[ALLOW_STALE] || (hit = void 0)), hit && fn.call(thisp, hit.value, hit.key, self);
  };
  module.exports = class {
    constructor(options) {
      if ("number" == typeof options && (options = {
        max: options
      }), options || (options = {}), options.max && ("number" != typeof options.max || options.max < 0)) throw new TypeError("max must be a non-negative number");
      this[MAX] = options.max || 1 / 0;
      const lc = options.length || naiveLength;
      if (this[LENGTH_CALCULATOR] = "function" != typeof lc ? naiveLength : lc, this[ALLOW_STALE] = options.stale || !1, 
      options.maxAge && "number" != typeof options.maxAge) throw new TypeError("maxAge must be a number");
      this[MAX_AGE] = options.maxAge || 0, this[DISPOSE] = options.dispose, this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || !1, 
      this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || !1, this.reset();
    }
    set max(mL) {
      if ("number" != typeof mL || mL < 0) throw new TypeError("max must be a non-negative number");
      this[MAX] = mL || 1 / 0, trim(this);
    }
    get max() {
      return this[MAX];
    }
    set allowStale(allowStale) {
      this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
      return this[ALLOW_STALE];
    }
    set maxAge(mA) {
      if ("number" != typeof mA) throw new TypeError("maxAge must be a non-negative number");
      this[MAX_AGE] = mA, trim(this);
    }
    get maxAge() {
      return this[MAX_AGE];
    }
    set lengthCalculator(lC) {
      "function" != typeof lC && (lC = naiveLength), lC !== this[LENGTH_CALCULATOR] && (this[LENGTH_CALCULATOR] = lC, 
      this[LENGTH] = 0, this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key), this[LENGTH] += hit.length;
      })), trim(this);
    }
    get lengthCalculator() {
      return this[LENGTH_CALCULATOR];
    }
    get length() {
      return this[LENGTH];
    }
    get itemCount() {
      return this[LRU_LIST].length;
    }
    rforEach(fn, thisp) {
      thisp = thisp || this;
      for (let walker = this[LRU_LIST].tail; null !== walker; ) {
        const prev = walker.prev;
        forEachStep(this, fn, walker, thisp), walker = prev;
      }
    }
    forEach(fn, thisp) {
      thisp = thisp || this;
      for (let walker = this[LRU_LIST].head; null !== walker; ) {
        const next = walker.next;
        forEachStep(this, fn, walker, thisp), walker = next;
      }
    }
    keys() {
      return this[LRU_LIST].toArray().map(k => k.key);
    }
    values() {
      return this[LRU_LIST].toArray().map(k => k.value);
    }
    reset() {
      this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length && this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value)), 
      this[CACHE] = new Map, this[LRU_LIST] = new Yallist, this[LENGTH] = 0;
    }
    dump() {
      return this[LRU_LIST].map(hit => !isStale(this, hit) && {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h);
    }
    dumpLru() {
      return this[LRU_LIST];
    }
    set(key, value, maxAge) {
      if ((maxAge = maxAge || this[MAX_AGE]) && "number" != typeof maxAge) throw new TypeError("maxAge must be a number");
      const now = maxAge ? Date.now() : 0, len = this[LENGTH_CALCULATOR](value, key);
      if (this[CACHE].has(key)) {
        if (len > this[MAX]) return del(this, this[CACHE].get(key)), !1;
        const item = this[CACHE].get(key).value;
        return this[DISPOSE] && (this[NO_DISPOSE_ON_SET] || this[DISPOSE](key, item.value)), 
        item.now = now, item.maxAge = maxAge, item.value = value, this[LENGTH] += len - item.length, 
        item.length = len, this.get(key), trim(this), !0;
      }
      const hit = new Entry(key, value, len, now, maxAge);
      return hit.length > this[MAX] ? (this[DISPOSE] && this[DISPOSE](key, value), !1) : (this[LENGTH] += hit.length, 
      this[LRU_LIST].unshift(hit), this[CACHE].set(key, this[LRU_LIST].head), trim(this), 
      !0);
    }
    has(key) {
      if (!this[CACHE].has(key)) return !1;
      const hit = this[CACHE].get(key).value;
      return !isStale(this, hit);
    }
    get(key) {
      return get(this, key, !0);
    }
    peek(key) {
      return get(this, key, !1);
    }
    pop() {
      const node = this[LRU_LIST].tail;
      return node ? (del(this, node), node.value) : null;
    }
    del(key) {
      del(this, this[CACHE].get(key));
    }
    load(arr) {
      this.reset();
      const now = Date.now();
      for (let l = arr.length - 1; l >= 0; l--) {
        const hit = arr[l], expiresAt = hit.e || 0;
        if (0 === expiresAt) this.set(hit.k, hit.v); else {
          const maxAge = expiresAt - now;
          maxAge > 0 && this.set(hit.k, hit.v, maxAge);
        }
      }
    }
    prune() {
      this[CACHE].forEach((value, key) => get(this, key, !1));
    }
  };
}, function(module, exports, __webpack_require__) {
  function Yallist(list) {
    var self = this;
    if (self instanceof Yallist || (self = new Yallist), self.tail = null, self.head = null, 
    self.length = 0, list && "function" == typeof list.forEach) list.forEach((function(item) {
      self.push(item);
    })); else if (arguments.length > 0) for (var i = 0, l = arguments.length; i < l; i++) self.push(arguments[i]);
    return self;
  }
  function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
    return null === inserted.next && (self.tail = inserted), null === inserted.prev && (self.head = inserted), 
    self.length++, inserted;
  }
  function push(self, item) {
    self.tail = new Node(item, self.tail, null, self), self.head || (self.head = self.tail), 
    self.length++;
  }
  function unshift(self, item) {
    self.head = new Node(item, null, self.head, self), self.tail || (self.tail = self.head), 
    self.length++;
  }
  function Node(value, prev, next, list) {
    if (!(this instanceof Node)) return new Node(value, prev, next, list);
    this.list = list, this.value = value, prev ? (prev.next = this, this.prev = prev) : this.prev = null, 
    next ? (next.prev = this, this.next = next) : this.next = null;
  }
  module.exports = Yallist, Yallist.Node = Node, Yallist.create = Yallist, Yallist.prototype.removeNode = function(node) {
    if (node.list !== this) throw new Error("removing node which does not belong to this list");
    var next = node.next, prev = node.prev;
    return next && (next.prev = prev), prev && (prev.next = next), node === this.head && (this.head = next), 
    node === this.tail && (this.tail = prev), node.list.length--, node.next = null, 
    node.prev = null, node.list = null, next;
  }, Yallist.prototype.unshiftNode = function(node) {
    if (node !== this.head) {
      node.list && node.list.removeNode(node);
      var head = this.head;
      node.list = this, node.next = head, head && (head.prev = node), this.head = node, 
      this.tail || (this.tail = node), this.length++;
    }
  }, Yallist.prototype.pushNode = function(node) {
    if (node !== this.tail) {
      node.list && node.list.removeNode(node);
      var tail = this.tail;
      node.list = this, node.prev = tail, tail && (tail.next = node), this.tail = node, 
      this.head || (this.head = node), this.length++;
    }
  }, Yallist.prototype.push = function() {
    for (var i = 0, l = arguments.length; i < l; i++) push(this, arguments[i]);
    return this.length;
  }, Yallist.prototype.unshift = function() {
    for (var i = 0, l = arguments.length; i < l; i++) unshift(this, arguments[i]);
    return this.length;
  }, Yallist.prototype.pop = function() {
    if (this.tail) {
      var res = this.tail.value;
      return this.tail = this.tail.prev, this.tail ? this.tail.next = null : this.head = null, 
      this.length--, res;
    }
  }, Yallist.prototype.shift = function() {
    if (this.head) {
      var res = this.head.value;
      return this.head = this.head.next, this.head ? this.head.prev = null : this.tail = null, 
      this.length--, res;
    }
  }, Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.head, i = 0; null !== walker; i++) fn.call(thisp, walker.value, i, this), 
    walker = walker.next;
  }, Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.tail, i = this.length - 1; null !== walker; i--) fn.call(thisp, walker.value, i, this), 
    walker = walker.prev;
  }, Yallist.prototype.get = function(n) {
    for (var i = 0, walker = this.head; null !== walker && i < n; i++) walker = walker.next;
    if (i === n && null !== walker) return walker.value;
  }, Yallist.prototype.getReverse = function(n) {
    for (var i = 0, walker = this.tail; null !== walker && i < n; i++) walker = walker.prev;
    if (i === n && null !== walker) return walker.value;
  }, Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    for (var res = new Yallist, walker = this.head; null !== walker; ) res.push(fn.call(thisp, walker.value, this)), 
    walker = walker.next;
    return res;
  }, Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    for (var res = new Yallist, walker = this.tail; null !== walker; ) res.push(fn.call(thisp, walker.value, this)), 
    walker = walker.prev;
    return res;
  }, Yallist.prototype.reduce = function(fn, initial) {
    var acc, walker = this.head;
    if (arguments.length > 1) acc = initial; else {
      if (!this.head) throw new TypeError("Reduce of empty list with no initial value");
      walker = this.head.next, acc = this.head.value;
    }
    for (var i = 0; null !== walker; i++) acc = fn(acc, walker.value, i), walker = walker.next;
    return acc;
  }, Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc, walker = this.tail;
    if (arguments.length > 1) acc = initial; else {
      if (!this.tail) throw new TypeError("Reduce of empty list with no initial value");
      walker = this.tail.prev, acc = this.tail.value;
    }
    for (var i = this.length - 1; null !== walker; i--) acc = fn(acc, walker.value, i), 
    walker = walker.prev;
    return acc;
  }, Yallist.prototype.toArray = function() {
    for (var arr = new Array(this.length), i = 0, walker = this.head; null !== walker; i++) arr[i] = walker.value, 
    walker = walker.next;
    return arr;
  }, Yallist.prototype.toArrayReverse = function() {
    for (var arr = new Array(this.length), i = 0, walker = this.tail; null !== walker; i++) arr[i] = walker.value, 
    walker = walker.prev;
    return arr;
  }, Yallist.prototype.slice = function(from, to) {
    (to = to || this.length) < 0 && (to += this.length), (from = from || 0) < 0 && (from += this.length);
    var ret = new Yallist;
    if (to < from || to < 0) return ret;
    from < 0 && (from = 0), to > this.length && (to = this.length);
    for (var i = 0, walker = this.head; null !== walker && i < from; i++) walker = walker.next;
    for (;null !== walker && i < to; i++, walker = walker.next) ret.push(walker.value);
    return ret;
  }, Yallist.prototype.sliceReverse = function(from, to) {
    (to = to || this.length) < 0 && (to += this.length), (from = from || 0) < 0 && (from += this.length);
    var ret = new Yallist;
    if (to < from || to < 0) return ret;
    from < 0 && (from = 0), to > this.length && (to = this.length);
    for (var i = this.length, walker = this.tail; null !== walker && i > to; i--) walker = walker.prev;
    for (;null !== walker && i > from; i--, walker = walker.prev) ret.push(walker.value);
    return ret;
  }, Yallist.prototype.splice = function(start, deleteCount) {
    start > this.length && (start = this.length - 1), start < 0 && (start = this.length + start);
    for (var i = 0, walker = this.head; null !== walker && i < start; i++) walker = walker.next;
    var ret = [];
    for (i = 0; walker && i < deleteCount; i++) ret.push(walker.value), walker = this.removeNode(walker);
    null === walker && (walker = this.tail), walker !== this.head && walker !== this.tail && (walker = walker.prev);
    for (i = 2; i < arguments.length; i++) walker = insert(this, walker, arguments[i]);
    return ret;
  }, Yallist.prototype.reverse = function() {
    for (var head = this.head, tail = this.tail, walker = head; null !== walker; walker = walker.prev) {
      var p = walker.prev;
      walker.prev = walker.next, walker.next = p;
    }
    return this.head = tail, this.tail = head, this;
  };
  try {
    __webpack_require__(46)(Yallist);
  } catch (er) {}
}, function(module, exports, __webpack_require__) {
  module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function*() {
      for (let walker = this.head; walker; walker = walker.next) yield walker.value;
    };
  };
}, function(module, exports, __webpack_require__) {
  const figgyPudding = __webpack_require__(5), index = __webpack_require__(9), memo = __webpack_require__(13), write = __webpack_require__(48), to = __webpack_require__(3).to, PutOpts = figgyPudding({
    algorithms: {
      default: [ "sha512" ]
    },
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
  });
  module.exports = function(cache, key, data, opts) {
    return opts = PutOpts(opts), write(cache, data, opts).then(res => index.insert(cache, key, res.integrity, opts.concat({
      size: res.size
    })).then(entry => (opts.memoize && memo.put(cache, entry, data, opts), res.integrity)));
  }, module.exports.stream = function(cache, key, opts) {
    let integrity, size;
    opts = PutOpts(opts);
    const contentStream = write.stream(cache, opts).on("integrity", int => {
      integrity = int;
    }).on("size", s => {
      size = s;
    });
    let memoData, memoTotal = 0;
    const stream = to((chunk, enc, cb) => {
      contentStream.write(chunk, enc, () => {
        opts.memoize && (memoData || (memoData = []), memoData.push(chunk), memoTotal += chunk.length), 
        cb();
      });
    }, cb => {
      contentStream.end(() => {
        index.insert(cache, key, integrity, opts.concat({
          size: size
        })).then(entry => {
          opts.memoize && memo.put(cache, entry, Buffer.concat(memoData, memoTotal), opts), 
          stream.emit("integrity", integrity), cb();
        });
      });
    });
    let erred = !1;
    return stream.once("error", err => {
      erred || (erred = !0, contentStream.emit("error", err));
    }), contentStream.once("error", err => {
      erred || (erred = !0, stream.emit("error", err));
    }), stream;
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), contentPath = __webpack_require__(10), fixOwner = __webpack_require__(12), fs = __webpack_require__(7), moveFile = __webpack_require__(49), PassThrough = __webpack_require__(15).PassThrough, path = __webpack_require__(0), pipe = BB.promisify(__webpack_require__(3).pipe), rimraf = BB.promisify(__webpack_require__(6)), ssri = __webpack_require__(11), to = __webpack_require__(3).to, uniqueFilename = __webpack_require__(28), writeFileAsync = BB.promisify(fs.writeFile);
  function makeTmp(cache, opts) {
    const tmpTarget = uniqueFilename(path.join(cache, "tmp"), opts.tmpPrefix);
    return fixOwner.mkdirfix(cache, path.dirname(tmpTarget)).then(() => ({
      target: tmpTarget,
      moved: !1
    })).disposer(tmp => !tmp.moved && rimraf(tmp.target));
  }
  function moveToDestination(tmp, cache, sri, opts, errCheck) {
    errCheck && errCheck();
    const destination = contentPath(cache, sri), destDir = path.dirname(destination);
    return fixOwner.mkdirfix(cache, destDir).then(() => (errCheck && errCheck(), moveFile(tmp.target, destination))).then(() => (errCheck && errCheck(), 
    tmp.moved = !0, fixOwner.chownr(cache, destination)));
  }
  module.exports = function(cache, data, opts) {
    if ((opts = opts || {}).algorithms && opts.algorithms.length > 1) throw new Error("opts.algorithms only supports a single algorithm for now");
    if ("number" == typeof opts.size && data.length !== opts.size) return BB.reject((expected = opts.size, 
    found = data.length, (err = new Error(`Bad data size: expected inserted data to be ${expected} bytes, but got ${found} instead`)).expected = expected, 
    err.found = found, err.code = "EBADSIZE", err));
    var expected, found, err;
    const sri = ssri.fromData(data, {
      algorithms: opts.algorithms
    });
    if (opts.integrity && !ssri.checkData(data, opts.integrity, opts)) return BB.reject(function(expected, found) {
      var err = new Error(`Integrity check failed:\n  Wanted: ${expected}\n   Found: ${found}`);
      return err.code = "EINTEGRITY", err.expected = expected, err.found = found, err;
    }(opts.integrity, sri));
    return BB.using(makeTmp(cache, opts), tmp => writeFileAsync(tmp.target, data, {
      flag: "wx"
    }).then(() => moveToDestination(tmp, cache, sri, opts))).then(() => ({
      integrity: sri,
      size: data.length
    }));
  }, module.exports.stream = function(cache, opts) {
    opts = opts || {};
    const inputStream = new PassThrough;
    let allDone, inputErr = !1;
    function errCheck() {
      if (inputErr) throw inputErr;
    }
    const ret = to((c, n, cb) => {
      allDone || (allDone = function(inputStream, cache, opts, errCheck) {
        return BB.using(makeTmp(cache, opts), tmp => (errCheck(), function(inputStream, cache, tmpTarget, opts, errCheck) {
          return BB.resolve().then(() => {
            let integrity, size;
            const hashStream = ssri.integrityStream({
              integrity: opts.integrity,
              algorithms: opts.algorithms,
              size: opts.size
            }).on("integrity", s => {
              integrity = s;
            }).on("size", s => {
              size = s;
            }), outStream = fs.createWriteStream(tmpTarget, {
              flags: "wx"
            });
            return errCheck(), pipe(inputStream, hashStream, outStream).then(() => ({
              integrity: integrity,
              size: size
            })).catch(err => rimraf(tmpTarget).then(() => {
              throw err;
            }));
          });
        }(inputStream, 0, tmp.target, opts, errCheck).then(res => moveToDestination(tmp, cache, res.integrity, opts, errCheck).then(() => res))));
      }(inputStream, cache, opts, errCheck)), inputStream.write(c, n, cb);
    }, cb => {
      inputStream.end(() => {
        if (!allDone) {
          const e = new Error("Cache input stream was empty");
          return e.code = "ENODATA", ret.emit("error", e);
        }
        allDone.then(res => {
          res.integrity && ret.emit("integrity", res.integrity), null !== res.size && ret.emit("size", res.size), 
          cb();
        }, e => {
          ret.emit("error", e);
        });
      });
    });
    return ret.once("error", e => {
      inputErr = e;
    }), ret;
  };
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(7), BB = __webpack_require__(1), chmod = BB.promisify(fs.chmod), unlink = BB.promisify(fs.unlink);
  let move, pinflight;
  module.exports = function(src, dest) {
    return BB.fromNode(cb => {
      fs.link(src, dest, err => {
        if (err) if ("EEXIST" === err.code || "EBUSY" === err.code) ; else if ("EPERM" !== err.code || "win32" !== process.platform) return cb(err);
        return cb();
      });
    }).then(() => BB.join(unlink(src), "win32" !== process.platform && chmod(dest, "0444"))).catch(() => (pinflight || (pinflight = __webpack_require__(21)), 
    pinflight("cacache-move-file:" + dest, () => BB.promisify(fs.stat)(dest).catch(err => {
      if ("ENOENT" !== err.code) throw err;
      return move || (move = __webpack_require__(50)), move(src, dest, {
        BB: BB,
        fs: fs
      });
    }))));
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(from, to, opts) {
    validate("SSO|SS", arguments);
    var Promise = (opts = extend({}, opts || {})).Promise || global.Promise, fs = opts.fs || nodeFs, rimrafAsync = promisify(Promise, rimraf), renameAsync = promisify(Promise, fs.rename);
    opts.top = from;
    var queue = new RunQueue({
      maxConcurrency: opts.maxConcurrency,
      Promise: Promise
    });
    return opts.queue = queue, opts.recurseWith = rename, queue.add(0, rename, [ from, to, opts ]), 
    queue.run().then((function() {
      return remove(from);
    }), (function(err) {
      return "EEXIST" === err.code || "EPERM" === err.code ? passThroughError() : remove(to).then(passThroughError, passThroughError);
      function passThroughError() {
        return Promise.reject(err);
      }
    }));
    function remove(target) {
      var opts = {
        unlink: fs.unlink,
        chmod: fs.chmod,
        stat: fs.stat,
        lstat: fs.lstat,
        rmdir: fs.rmdir,
        readdir: fs.readdir,
        glob: !1
      };
      return rimrafAsync(target, opts);
    }
    function rename(from, to, opts, done) {
      return renameAsync(from, to).catch((function(err) {
        return "EXDEV" !== err.code ? Promise.reject(err) : remove(to).then((function() {
          return copy.item(from, to, opts);
        }));
      }));
    }
  };
  var nodeFs = __webpack_require__(4), rimraf = __webpack_require__(6), validate = __webpack_require__(17), copy = __webpack_require__(52), RunQueue = __webpack_require__(27), extend = Object.assign || __webpack_require__(2)._extend;
  function promisify(Promise, fn) {
    return function() {
      var args = [].slice.call(arguments);
      return new Promise((function(resolve, reject) {
        return fn.apply(null, args.concat((function(err, value) {
          err ? reject(err) : resolve(value);
        })));
      }));
    };
  }
}, function(module, exports) {
  module.exports = require("assert");
}, function(module, exports, __webpack_require__) {
  module.exports = function(from, to, opts) {
    validate("SSO|SS", arguments);
    var Promise = (opts = extend({}, opts || {})).Promise || global.Promise, fs = opts.fs || nodeFs;
    null == opts.isWindows && (opts.isWindows = isWindows);
    opts.Promise || (opts.Promise = Promise);
    opts.fs || (opts.fs = fs);
    opts.recurseWith || (opts.recurseWith = copyItem);
    opts.lstat || (opts.lstat = promisify(opts.Promise, fs.lstat));
    opts.stat || (opts.stat = promisify(opts.Promise, fs.stat));
    opts.chown || (opts.chown = promisify(opts.Promise, fs.chown));
    opts.readdir || (opts.readdir = promisify(opts.Promise, fs.readdir));
    opts.readlink || (opts.readlink = promisify(opts.Promise, fs.readlink));
    opts.symlink || (opts.symlink = promisify(opts.Promise, fs.symlink));
    opts.chmod || (opts.chmod = promisify(opts.Promise, fs.chmod));
    opts.top = from, opts.mkdirpAsync = promisify(opts.Promise, mkdirp);
    var rimrafAsync = promisify(opts.Promise, rimraf), queue = new RunQueue({
      maxConcurrency: opts.maxConcurrency,
      Promise: Promise
    });
    return opts.queue = queue, queue.add(0, copyItem, [ from, to, opts ]), queue.run().catch((function(err) {
      return "EEXIST" === err.code || "EPERM" === err.code ? passThroughError() : remove(to).then(passThroughError, passThroughError);
      function passThroughError() {
        return Promise.reject(err);
      }
    }));
    function remove(target) {
      var opts = {
        unlink: fs.unlink,
        chmod: fs.chmod,
        stat: fs.stat,
        lstat: fs.lstat,
        rmdir: fs.rmdir,
        readdir: fs.readdir,
        glob: !1
      };
      return rimrafAsync(target, opts);
    }
  }, module.exports.item = copyItem, module.exports.recurse = recurseDir, module.exports.symlink = copySymlink, 
  module.exports.file = copyFile;
  var nodeFs = __webpack_require__(4), path = __webpack_require__(0), validate = __webpack_require__(17), stockWriteStreamAtomic = __webpack_require__(53), mkdirp = __webpack_require__(20), rimraf = __webpack_require__(6), isWindows = __webpack_require__(55), RunQueue = __webpack_require__(27), extend = Object.assign || __webpack_require__(2)._extend;
  function promisify(Promise, fn) {
    return function() {
      var args = [].slice.call(arguments);
      return new Promise((function(resolve, reject) {
        return fn.apply(null, args.concat((function(err, value) {
          err ? reject(err) : resolve(value);
        })));
      }));
    };
  }
  function copyItem(from, to, opts) {
    validate("SSO", [ from, to, opts ]);
    var fs = opts.fs || nodeFs, Promise = opts.Promise || global.Promise, lstat = opts.lstat || promisify(Promise, fs.lstat);
    return lstat(to).then((function() {
      return Promise.reject(function(from, to) {
        var err = new Error("Could not move " + from + " to " + to + ": destination already exists.");
        return err.code = "EEXIST", err;
      }(from, to));
    }), (function(err) {
      return err && "ENOENT" !== err.code ? Promise.reject(err) : lstat(from);
    })).then((function(fromStat) {
      var cmdOpts = extend(extend({}, opts), fromStat);
      return fromStat.isDirectory() ? recurseDir(from, to, cmdOpts) : fromStat.isSymbolicLink() ? void opts.queue.add(1, copySymlink, [ from, to, cmdOpts ]) : fromStat.isFile() ? copyFile(from, to, cmdOpts) : fromStat.isBlockDevice() ? Promise.reject(eunsupported(from + " is a block device, and we don't know how to copy those.")) : fromStat.isCharacterDevice() ? Promise.reject(eunsupported(from + " is a character device, and we don't know how to copy those.")) : fromStat.isFIFO() ? Promise.reject(eunsupported(from + " is a FIFO, and we don't know how to copy those.")) : fromStat.isSocket() ? Promise.reject(eunsupported(from + " is a socket, and we don't know how to copy those.")) : Promise.reject(eunsupported("We can't tell what " + from + " is and so we can't copy it."));
    }));
  }
  function recurseDir(from, to, opts) {
    validate("SSO", [ from, to, opts ]);
    var recurseWith = opts.recurseWith || copyItem, fs = opts.fs || nodeFs, chown = opts.chown || promisify(Promise, fs.chown), readdir = opts.readdir || promisify(Promise, fs.readdir);
    return (opts.mkdirpAsync || promisify(Promise, mkdirp))(to, {
      fs: fs,
      mode: opts.mode
    }).then((function() {
      var getuid = opts.getuid || process.getuid;
      if (getuid && null != opts.uid && 0 === getuid()) return chown(to, opts.uid, opts.gid);
    })).then((function() {
      return readdir(from);
    })).then((function(files) {
      files.forEach((function(file) {
        opts.queue.add(0, recurseWith, [ path.join(from, file), path.join(to, file), opts ]);
      }));
    }));
  }
  function copySymlink(from, to, opts) {
    validate("SSO", [ from, to, opts ]);
    var fs = opts.fs || nodeFs, readlink = opts.readlink || promisify(Promise, fs.readlink), stat = opts.stat || promisify(Promise, fs.symlink), symlink = opts.symlink || promisify(Promise, fs.symlink), Promise = opts.Promise || global.Promise;
    return readlink(from).then((function(fromDest) {
      var absoluteDest = path.resolve(path.dirname(from), fromDest), linkFrom = ".." === path.relative(opts.top, absoluteDest).substr(0, 2) ? fromDest : path.relative(path.dirname(from), absoluteDest);
      return opts.isWindows ? stat(absoluteDest).catch((function() {
        return null;
      })).then((function(destStat) {
        var type = destStat && destStat.isDirectory() ? "dir" : "file";
        return symlink(linkFrom, to, type).catch((function(err) {
          return "dir" === type ? symlink(linkFrom, to, "junction") : Promise.reject(err);
        }));
      })) : symlink(linkFrom, to);
    }));
  }
  function copyFile(from, to, opts) {
    validate("SSO", [ from, to, opts ]);
    var fs = opts.fs || nodeFs, writeStreamAtomic = opts.writeStreamAtomic || stockWriteStreamAtomic, Promise = opts.Promise || global.Promise, chmod = opts.chmod || promisify(Promise, fs.chmod), writeOpts = {}, getuid = opts.getuid || process.getuid;
    return getuid && null != opts.uid && 0 === getuid() && (writeOpts.chown = {
      uid: opts.uid,
      gid: opts.gid
    }), new Promise((function(resolve, reject) {
      var errored = !1;
      function onError(err) {
        errored = !0, reject(err);
      }
      fs.createReadStream(from).once("error", onError).pipe(writeStreamAtomic(to, writeOpts)).once("error", onError).once("close", (function() {
        errored || (null != opts.mode ? resolve(chmod(to, opts.mode)) : resolve());
      }));
    }));
  }
  function eunsupported(msg) {
    var err = new Error(msg);
    return err.code = "EUNSUPPORTED", err;
  }
}, function(module, exports, __webpack_require__) {
  var fs = __webpack_require__(7), Writable = __webpack_require__(8).Writable, util = __webpack_require__(2), MurmurHash3 = __webpack_require__(26), iferr = __webpack_require__(54), crypto = __webpack_require__(14);
  var invocations = 0;
  function getTmpname(filename) {
    return filename + "." + function() {
      for (var hash = MurmurHash3(""), ii = 0; ii < arguments.length; ++ii) hash.hash("" + arguments[ii]);
      return hash.result();
    }(__filename, process.pid, ++invocations);
  }
  var setImmediate = global.setImmediate || setTimeout;
  function WriteStreamAtomic(path, options) {
    if (!(this instanceof WriteStreamAtomic)) return new WriteStreamAtomic(path, options);
    var writeStream;
    Writable.call(this, options), this.__isWin = options && options.hasOwnProperty("isWin") ? options.isWin : "win32" === process.platform, 
    this.__atomicTarget = path, this.__atomicTmp = getTmpname(path), this.__atomicChown = options && options.chown, 
    this.__atomicClosed = !1, this.__atomicStream = fs.WriteStream(this.__atomicTmp, options), 
    this.__atomicStream.once("open", (writeStream = this, function(fd) {
      writeStream.emit("open", fd);
    })), this.__atomicStream.once("close", function(writeStream) {
      return function() {
        if (!writeStream.__atomicClosed) {
          if (writeStream.__atomicClosed = !0, writeStream.__atomicChown) {
            var uid = writeStream.__atomicChown.uid, gid = writeStream.__atomicChown.gid;
            return fs.chown(writeStream.__atomicTmp, uid, gid, iferr(cleanup, moveIntoPlace));
          }
          moveIntoPlace();
        }
      };
      function moveIntoPlace() {
        fs.rename(writeStream.__atomicTmp, writeStream.__atomicTarget, iferr(trapWindowsEPERM, end));
      }
      function trapWindowsEPERM(err) {
        writeStream.__isWin && err.syscall && "rename" === err.syscall && err.code && "EPERM" === err.code ? function(eperm) {
          var inprocess = 2, tmpFileHash = crypto.createHash("sha512"), targetFileHash = crypto.createHash("sha512");
          function fileHashError() {
            0 !== inprocess && (inprocess = 0, cleanup(eperm));
          }
          function fileHashComplete() {
            if (0 !== inprocess && !--inprocess) return tmpFileHash.digest("hex") === targetFileHash.digest("hex") ? cleanup() : cleanup(eperm);
          }
          fs.createReadStream(writeStream.__atomicTmp).on("data", (function(data, enc) {
            tmpFileHash.update(data, enc);
          })).on("error", fileHashError).on("end", fileHashComplete), fs.createReadStream(writeStream.__atomicTarget).on("data", (function(data, enc) {
            targetFileHash.update(data, enc);
          })).on("error", fileHashError).on("end", fileHashComplete);
        }(err) : cleanup(err);
      }
      function cleanup(err) {
        fs.unlink(writeStream.__atomicTmp, (function() {
          err ? (writeStream.emit("error", err), writeStream.emit("close")) : end();
        }));
      }
      function end() {
        Writable.prototype.emit.call(writeStream, "finish"), setImmediate((function() {
          writeStream.emit("close");
        }));
      }
    }(this)), this.__atomicStream.once("error", function(writeStream) {
      return function(er) {
        !function() {
          try {
            fs.unlinkSync(writeStream.__atomicTmp);
          } finally {
            return;
          }
        }(), writeStream.emit("error", er), writeStream.__atomicClosed = !0, writeStream.emit("close");
      };
    }(this));
  }
  module.exports = WriteStreamAtomic, util.inherits(WriteStreamAtomic, Writable), 
  WriteStreamAtomic.prototype.emit = function(event) {
    return "finish" === event ? this.__atomicStream.end() : Writable.prototype.emit.apply(this, arguments);
  }, WriteStreamAtomic.prototype._write = function(buffer, encoding, cb) {
    if (this.__atomicStream.write(buffer, encoding)) return cb();
    this.__atomicStream.once("drain", cb);
  };
}, function(module, exports) {
  var iferr, printerr, throwerr, tiferr, __slice = [].slice;
  tiferr = function(fail, succ) {
    return iferr(fail, (function() {
      var a;
      a = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      try {
        return succ.apply(null, a);
      } catch (_error) {
        return fail(_error);
      }
    }));
  }, throwerr = (iferr = function(fail, succ) {
    return function() {
      var a, err;
      return err = arguments[0], a = 2 <= arguments.length ? __slice.call(arguments, 1) : [], 
      null != err ? fail(err) : "function" == typeof succ ? succ.apply(null, a) : void 0;
    };
  }).bind(null, (function(err) {
    throw err;
  })), printerr = iferr((function(err) {
    return console.error(err.stack || err);
  })), module.exports = exports = iferr, exports.iferr = iferr, exports.tiferr = tiferr, 
  exports.throwerr = throwerr, exports.printerr = printerr;
}, function(module, exports, __webpack_require__) {
  module.exports = "win32" === process.platform;
}, function(module, exports, __webpack_require__) {
  var MurmurHash3 = __webpack_require__(26);
  module.exports = function(uniq) {
    return uniq ? ("00000000" + new MurmurHash3(uniq).result().toString(16)).substr(-8) : (Math.random().toString(16) + "0000000").substr(2, 8);
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), index = __webpack_require__(9), memo = __webpack_require__(13), path = __webpack_require__(0), rimraf = BB.promisify(__webpack_require__(6)), rmContent = __webpack_require__(58);
  function entry(cache, key) {
    return memo.clearMemoized(), index.delete(cache, key);
  }
  module.exports = entry, module.exports.entry = entry, module.exports.content = function(cache, integrity) {
    return memo.clearMemoized(), rmContent(cache, integrity);
  }, module.exports.all = function(cache) {
    return memo.clearMemoized(), rimraf(path.join(cache, "*(content-*|index-*)"));
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), contentPath = __webpack_require__(10), hasContent = __webpack_require__(24).hasContent, rimraf = BB.promisify(__webpack_require__(6));
  module.exports = function(cache, integrity) {
    return hasContent(cache, integrity).then(content => {
      if (!content) return !1;
      {
        const sri = content.sri;
        if (sri) return rimraf(contentPath(cache, sri)).then(() => !0);
      }
    });
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), contentPath = __webpack_require__(10), figgyPudding = __webpack_require__(5), finished = BB.promisify(__webpack_require__(3).finished), fixOwner = __webpack_require__(12), fs = __webpack_require__(7), glob = BB.promisify(__webpack_require__(25)), index = __webpack_require__(9), path = __webpack_require__(0), rimraf = BB.promisify(__webpack_require__(6)), ssri = __webpack_require__(11);
  BB.promisifyAll(fs);
  const VerifyOpts = figgyPudding({
    concurrency: {
      default: 20
    },
    filter: {},
    log: {
      default: {
        silly() {}
      }
    }
  });
  function markStartTime(cache, opts) {
    return {
      startTime: new Date
    };
  }
  function markEndTime(cache, opts) {
    return {
      endTime: new Date
    };
  }
  function fixPerms(cache, opts) {
    return opts.log.silly("verify", "fixing cache permissions"), fixOwner.mkdirfix(cache, cache).then(() => fixOwner.chownr(cache, cache)).then(() => null);
  }
  function garbageCollect(cache, opts) {
    opts.log.silly("verify", "garbage collecting content");
    const indexStream = index.lsStream(cache), liveContent = new Set;
    return indexStream.on("data", entry => {
      opts.filter && !opts.filter(entry) || liveContent.add(entry.integrity.toString());
    }), finished(indexStream).then(() => {
      const contentDir = contentPath._contentDir(cache);
      return glob(path.join(contentDir, "**"), {
        follow: !1,
        nodir: !0,
        nosort: !0
      }).then(files => BB.resolve({
        verifiedContent: 0,
        reclaimedCount: 0,
        reclaimedSize: 0,
        badContentCount: 0,
        keptSize: 0
      }).tap(stats => BB.map(files, f => {
        const split = f.split(/[/\\]/), digest = split.slice(split.length - 3).join(""), algo = split[split.length - 4], integrity = ssri.fromHex(digest, algo);
        return liveContent.has(integrity.toString()) ? (filepath = f, sri = integrity, fs.statAsync(filepath).then(stat => {
          const contentInfo = {
            size: stat.size,
            valid: !0
          };
          return ssri.checkStream(fs.createReadStream(filepath), sri).catch(err => {
            if ("EINTEGRITY" !== err.code) throw err;
            return rimraf(filepath).then(() => {
              contentInfo.valid = !1;
            });
          }).then(() => contentInfo);
        }).catch({
          code: "ENOENT"
        }, () => ({
          size: 0,
          valid: !1
        }))).then(info => (info.valid ? (stats.verifiedContent++, stats.keptSize += info.size) : (stats.reclaimedCount++, 
        stats.badContentCount++, stats.reclaimedSize += info.size), stats)) : (stats.reclaimedCount++, 
        fs.statAsync(f).then(s => rimraf(f).then(() => (stats.reclaimedSize += s.size, stats))));
        var filepath, sri;
      }, {
        concurrency: opts.concurrency
      })));
    });
  }
  function rebuildIndex(cache, opts) {
    return opts.log.silly("verify", "rebuilding index"), index.ls(cache).then(entries => {
      const stats = {
        missingContent: 0,
        rejectedEntries: 0,
        totalEntries: 0
      }, buckets = {};
      for (let k in entries) if (entries.hasOwnProperty(k)) {
        const hashed = index._hashKey(k), entry = entries[k], excluded = opts.filter && !opts.filter(entry);
        excluded && stats.rejectedEntries++, buckets[hashed] && !excluded ? buckets[hashed].push(entry) : buckets[hashed] && excluded || (excluded ? (buckets[hashed] = [], 
        buckets[hashed]._path = index._bucketPath(cache, k)) : (buckets[hashed] = [ entry ], 
        buckets[hashed]._path = index._bucketPath(cache, k)));
      }
      return BB.map(Object.keys(buckets), key => function(cache, bucket, stats, opts) {
        return fs.truncateAsync(bucket._path).then(() => BB.mapSeries(bucket, entry => {
          const content = contentPath(cache, entry.integrity);
          return fs.statAsync(content).then(() => index.insert(cache, entry.key, entry.integrity, {
            metadata: entry.metadata,
            size: entry.size
          }).then(() => {
            stats.totalEntries++;
          })).catch({
            code: "ENOENT"
          }, () => {
            stats.rejectedEntries++, stats.missingContent++;
          });
        }));
      }(cache, buckets[key], stats), {
        concurrency: opts.concurrency
      }).then(() => stats);
    });
  }
  function cleanTmp(cache, opts) {
    return opts.log.silly("verify", "cleaning tmp directory"), rimraf(path.join(cache, "tmp"));
  }
  function writeVerifile(cache, opts) {
    const verifile = path.join(cache, "_lastverified");
    opts.log.silly("verify", "writing verifile to " + verifile);
    try {
      return fs.writeFileAsync(verifile, "" + +new Date);
    } finally {
      fixOwner.chownr.sync(cache, verifile);
    }
  }
  module.exports = function(cache, opts) {
    return (opts = VerifyOpts(opts)).log.silly("verify", "verifying cache at", cache), 
    BB.reduce([ markStartTime, fixPerms, garbageCollect, rebuildIndex, cleanTmp, writeVerifile, markEndTime ], (stats, step, i) => {
      const label = step.name || "step #" + i, start = new Date;
      return BB.resolve(step(cache, opts)).then(s => {
        s && Object.keys(s).forEach(k => {
          stats[k] = s[k];
        });
        const end = new Date;
        return stats.runTime || (stats.runTime = {}), stats.runTime[label] = end - start, 
        stats;
      });
    }, {}).tap(stats => {
      stats.runTime.total = stats.endTime - stats.startTime, opts.log.silly("verify", "verification finished for", cache, "in", stats.runTime.total + "ms");
    });
  }, module.exports.lastRun = function(cache) {
    return fs.readFileAsync(path.join(cache, "_lastverified"), "utf8").then(data => new Date(+data));
  };
}, function(module, exports, __webpack_require__) {
  const BB = __webpack_require__(1), figgyPudding = __webpack_require__(5), fixOwner = __webpack_require__(12), path = __webpack_require__(0), rimraf = BB.promisify(__webpack_require__(6)), uniqueFilename = __webpack_require__(28), TmpOpts = figgyPudding({
    tmpPrefix: {}
  });
  function mktmpdir(cache, opts) {
    opts = TmpOpts(opts);
    const tmpTarget = uniqueFilename(path.join(cache, "tmp"), opts.tmpPrefix);
    return fixOwner.mkdirfix(cache, tmpTarget).then(() => tmpTarget);
  }
  module.exports.mkdir = mktmpdir, module.exports.withTmp = function(cache, opts, cb) {
    cb || (cb = opts, opts = null);
    return opts = TmpOpts(opts), BB.using(mktmpdir(cache, opts).disposer(rimraf), cb);
  }, module.exports.fix = function(cache) {
    return fixOwner(cache, path.join(cache, "tmp"));
  };
} ]);
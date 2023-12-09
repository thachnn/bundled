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
  return __webpack_require__(0);
}([ function(module, exports, __webpack_require__) {
  var gracefulQueue, previousSymbol, fs = __webpack_require__(1), polyfills = __webpack_require__(2), legacy = __webpack_require__(4), clone = __webpack_require__(6), util = __webpack_require__(7);
  function publishQueue(context, queue) {
    Object.defineProperty(context, gracefulQueue, {
      get: function() {
        return queue;
      }
    });
  }
  "function" == typeof Symbol && "function" == typeof Symbol.for ? (gracefulQueue = Symbol.for("graceful-fs.queue"), 
  previousSymbol = Symbol.for("graceful-fs.previous")) : (gracefulQueue = "___graceful-fs.queue", 
  previousSymbol = "___graceful-fs.previous");
  var retryTimer, debug = function() {};
  if (util.debuglog ? debug = util.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (debug = function() {
    var m = util.format.apply(util, arguments);
    m = "GFS4: " + m.split(/\n/).join("\nGFS4: "), console.error(m);
  }), !fs[gracefulQueue]) {
    var queue = global[gracefulQueue] || [];
    publishQueue(fs, queue), fs.close = function(fs$close) {
      function close(fd, cb) {
        return fs$close.call(fs, fd, (function(err) {
          err || resetQueue(), "function" == typeof cb && cb.apply(this, arguments);
        }));
      }
      return Object.defineProperty(close, previousSymbol, {
        value: fs$close
      }), close;
    }(fs.close), fs.closeSync = function(fs$closeSync) {
      function closeSync(fd) {
        fs$closeSync.apply(fs, arguments), resetQueue();
      }
      return Object.defineProperty(closeSync, previousSymbol, {
        value: fs$closeSync
      }), closeSync;
    }(fs.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", (function() {
      debug(fs[gracefulQueue]), __webpack_require__(8).equal(fs[gracefulQueue].length, 0);
    }));
  }
  function patch(fs) {
    polyfills(fs), fs.gracefulify = patch, fs.createReadStream = function(path, options) {
      return new fs.ReadStream(path, options);
    }, fs.createWriteStream = function(path, options) {
      return new fs.WriteStream(path, options);
    };
    var fs$readFile = fs.readFile;
    fs.readFile = function(path, options, cb) {
      "function" == typeof options && (cb = options, options = null);
      return function go$readFile(path, options, cb, startTime) {
        return fs$readFile(path, options, (function(err) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? "function" == typeof cb && cb.apply(this, arguments) : enqueue([ go$readFile, [ path, options, cb ], err, startTime || Date.now(), Date.now() ]);
        }));
      }(path, options, cb);
    };
    var fs$writeFile = fs.writeFile;
    fs.writeFile = function(path, data, options, cb) {
      "function" == typeof options && (cb = options, options = null);
      return function go$writeFile(path, data, options, cb, startTime) {
        return fs$writeFile(path, data, options, (function(err) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? "function" == typeof cb && cb.apply(this, arguments) : enqueue([ go$writeFile, [ path, data, options, cb ], err, startTime || Date.now(), Date.now() ]);
        }));
      }(path, data, options, cb);
    };
    var fs$appendFile = fs.appendFile;
    fs$appendFile && (fs.appendFile = function(path, data, options, cb) {
      "function" == typeof options && (cb = options, options = null);
      return function go$appendFile(path, data, options, cb, startTime) {
        return fs$appendFile(path, data, options, (function(err) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? "function" == typeof cb && cb.apply(this, arguments) : enqueue([ go$appendFile, [ path, data, options, cb ], err, startTime || Date.now(), Date.now() ]);
        }));
      }(path, data, options, cb);
    });
    var fs$copyFile = fs.copyFile;
    fs$copyFile && (fs.copyFile = function(src, dest, flags, cb) {
      "function" == typeof flags && (cb = flags, flags = 0);
      return function go$copyFile(src, dest, flags, cb, startTime) {
        return fs$copyFile(src, dest, flags, (function(err) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? "function" == typeof cb && cb.apply(this, arguments) : enqueue([ go$copyFile, [ src, dest, flags, cb ], err, startTime || Date.now(), Date.now() ]);
        }));
      }(src, dest, flags, cb);
    });
    var fs$readdir = fs.readdir;
    fs.readdir = function(path, options, cb) {
      "function" == typeof options && (cb = options, options = null);
      var go$readdir = noReaddirOptionVersions.test(process.version) ? function(path, options, cb, startTime) {
        return fs$readdir(path, fs$readdirCallback(path, options, cb, startTime));
      } : function(path, options, cb, startTime) {
        return fs$readdir(path, options, fs$readdirCallback(path, options, cb, startTime));
      };
      return go$readdir(path, options, cb);
      function fs$readdirCallback(path, options, cb, startTime) {
        return function(err, files) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? (files && files.sort && files.sort(), 
          "function" == typeof cb && cb.call(this, err, files)) : enqueue([ go$readdir, [ path, options, cb ], err, startTime || Date.now(), Date.now() ]);
        };
      }
    };
    var noReaddirOptionVersions = /^v[0-5]\./;
    if ("v0.8" === process.version.substr(0, 4)) {
      var legStreams = legacy(fs);
      ReadStream = legStreams.ReadStream, WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs.ReadStream;
    fs$ReadStream && (ReadStream.prototype = Object.create(fs$ReadStream.prototype), 
    ReadStream.prototype.open = function() {
      var that = this;
      open(that.path, that.flags, that.mode, (function(err, fd) {
        err ? (that.autoClose && that.destroy(), that.emit("error", err)) : (that.fd = fd, 
        that.emit("open", fd), that.read());
      }));
    });
    var fs$WriteStream = fs.WriteStream;
    fs$WriteStream && (WriteStream.prototype = Object.create(fs$WriteStream.prototype), 
    WriteStream.prototype.open = function() {
      var that = this;
      open(that.path, that.flags, that.mode, (function(err, fd) {
        err ? (that.destroy(), that.emit("error", err)) : (that.fd = fd, that.emit("open", fd));
      }));
    }), Object.defineProperty(fs, "ReadStream", {
      get: function() {
        return ReadStream;
      },
      set: function(val) {
        ReadStream = val;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(fs, "WriteStream", {
      get: function() {
        return WriteStream;
      },
      set: function(val) {
        WriteStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    var FileReadStream = ReadStream;
    Object.defineProperty(fs, "FileReadStream", {
      get: function() {
        return FileReadStream;
      },
      set: function(val) {
        FileReadStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    var FileWriteStream = WriteStream;
    function ReadStream(path, options) {
      return this instanceof ReadStream ? (fs$ReadStream.apply(this, arguments), this) : ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function WriteStream(path, options) {
      return this instanceof WriteStream ? (fs$WriteStream.apply(this, arguments), this) : WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    Object.defineProperty(fs, "FileWriteStream", {
      get: function() {
        return FileWriteStream;
      },
      set: function(val) {
        FileWriteStream = val;
      },
      enumerable: !0,
      configurable: !0
    });
    var fs$open = fs.open;
    function open(path, flags, mode, cb) {
      return "function" == typeof mode && (cb = mode, mode = null), function go$open(path, flags, mode, cb, startTime) {
        return fs$open(path, flags, mode, (function(err, fd) {
          !err || "EMFILE" !== err.code && "ENFILE" !== err.code ? "function" == typeof cb && cb.apply(this, arguments) : enqueue([ go$open, [ path, flags, mode, cb ], err, startTime || Date.now(), Date.now() ]);
        }));
      }(path, flags, mode, cb);
    }
    return fs.open = open, fs;
  }
  function enqueue(elem) {
    debug("ENQUEUE", elem[0].name, elem[1]), fs[gracefulQueue].push(elem), retry();
  }
  function resetQueue() {
    for (var now = Date.now(), i = 0; i < fs[gracefulQueue].length; ++i) fs[gracefulQueue][i].length > 2 && (fs[gracefulQueue][i][3] = now, 
    fs[gracefulQueue][i][4] = now);
    retry();
  }
  function retry() {
    if (clearTimeout(retryTimer), retryTimer = void 0, 0 !== fs[gracefulQueue].length) {
      var elem = fs[gracefulQueue].shift(), fn = elem[0], args = elem[1], err = elem[2], startTime = elem[3], lastTime = elem[4];
      if (void 0 === startTime) debug("RETRY", fn.name, args), fn.apply(null, args); else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn.name, args);
        var cb = args.pop();
        "function" == typeof cb && cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime, sinceStart = Math.max(lastTime - startTime, 1);
        sinceAttempt >= Math.min(1.2 * sinceStart, 100) ? (debug("RETRY", fn.name, args), 
        fn.apply(null, args.concat([ startTime ]))) : fs[gracefulQueue].push(elem);
      }
      void 0 === retryTimer && (retryTimer = setTimeout(retry, 0));
    }
  }
  global[gracefulQueue] || publishQueue(global, fs[gracefulQueue]), module.exports = patch(clone(fs)), 
  process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched && (module.exports = patch(fs), 
  fs.__patched = !0);
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  var constants = __webpack_require__(3), origCwd = process.cwd, cwd = null, platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
  process.cwd = function() {
    return cwd || (cwd = origCwd.call(process)), cwd;
  };
  try {
    process.cwd();
  } catch (er) {}
  if ("function" == typeof process.chdir) {
    var chdir = process.chdir;
    process.chdir = function(d) {
      cwd = null, chdir.call(process, d);
    }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, chdir);
  }
  module.exports = function(fs) {
    constants.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && function(fs) {
      fs.lchmod = function(path, mode, callback) {
        fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, (function(err, fd) {
          err ? callback && callback(err) : fs.fchmod(fd, mode, (function(err) {
            fs.close(fd, (function(err2) {
              callback && callback(err || err2);
            }));
          }));
        }));
      }, fs.lchmodSync = function(path, mode) {
        var ret, fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode), threw = !0;
        try {
          ret = fs.fchmodSync(fd, mode), threw = !1;
        } finally {
          if (threw) try {
            fs.closeSync(fd);
          } catch (er) {} else fs.closeSync(fd);
        }
        return ret;
      };
    }(fs);
    fs.lutimes || function(fs) {
      constants.hasOwnProperty("O_SYMLINK") && fs.futimes ? (fs.lutimes = function(path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, (function(er, fd) {
          er ? cb && cb(er) : fs.futimes(fd, at, mt, (function(er) {
            fs.close(fd, (function(er2) {
              cb && cb(er || er2);
            }));
          }));
        }));
      }, fs.lutimesSync = function(path, at, mt) {
        var ret, fd = fs.openSync(path, constants.O_SYMLINK), threw = !0;
        try {
          ret = fs.futimesSync(fd, at, mt), threw = !1;
        } finally {
          if (threw) try {
            fs.closeSync(fd);
          } catch (er) {} else fs.closeSync(fd);
        }
        return ret;
      }) : fs.futimes && (fs.lutimes = function(_a, _b, _c, cb) {
        cb && process.nextTick(cb);
      }, fs.lutimesSync = function() {});
    }(fs);
    fs.chown = chownFix(fs.chown), fs.fchown = chownFix(fs.fchown), fs.lchown = chownFix(fs.lchown), 
    fs.chmod = chmodFix(fs.chmod), fs.fchmod = chmodFix(fs.fchmod), fs.lchmod = chmodFix(fs.lchmod), 
    fs.chownSync = chownFixSync(fs.chownSync), fs.fchownSync = chownFixSync(fs.fchownSync), 
    fs.lchownSync = chownFixSync(fs.lchownSync), fs.chmodSync = chmodFixSync(fs.chmodSync), 
    fs.fchmodSync = chmodFixSync(fs.fchmodSync), fs.lchmodSync = chmodFixSync(fs.lchmodSync), 
    fs.stat = statFix(fs.stat), fs.fstat = statFix(fs.fstat), fs.lstat = statFix(fs.lstat), 
    fs.statSync = statFixSync(fs.statSync), fs.fstatSync = statFixSync(fs.fstatSync), 
    fs.lstatSync = statFixSync(fs.lstatSync), fs.chmod && !fs.lchmod && (fs.lchmod = function(path, mode, cb) {
      cb && process.nextTick(cb);
    }, fs.lchmodSync = function() {});
    fs.chown && !fs.lchown && (fs.lchown = function(path, uid, gid, cb) {
      cb && process.nextTick(cb);
    }, fs.lchownSync = function() {});
    "win32" === platform && (fs.rename = "function" != typeof fs.rename ? fs.rename : function(fs$rename) {
      function rename(from, to, cb) {
        var start = Date.now(), backoff = 0;
        fs$rename(from, to, (function CB(er) {
          if (er && ("EACCES" === er.code || "EPERM" === er.code) && Date.now() - start < 6e4) return setTimeout((function() {
            fs.stat(to, (function(stater, st) {
              stater && "ENOENT" === stater.code ? fs$rename(from, to, CB) : cb(er);
            }));
          }), backoff), void (backoff < 100 && (backoff += 10));
          cb && cb(er);
        }));
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(rename, fs$rename), rename;
    }(fs.rename));
    function chmodFix(orig) {
      return orig ? function(target, mode, cb) {
        return orig.call(fs, target, mode, (function(er) {
          chownErOk(er) && (er = null), cb && cb.apply(this, arguments);
        }));
      } : orig;
    }
    function chmodFixSync(orig) {
      return orig ? function(target, mode) {
        try {
          return orig.call(fs, target, mode);
        } catch (er) {
          if (!chownErOk(er)) throw er;
        }
      } : orig;
    }
    function chownFix(orig) {
      return orig ? function(target, uid, gid, cb) {
        return orig.call(fs, target, uid, gid, (function(er) {
          chownErOk(er) && (er = null), cb && cb.apply(this, arguments);
        }));
      } : orig;
    }
    function chownFixSync(orig) {
      return orig ? function(target, uid, gid) {
        try {
          return orig.call(fs, target, uid, gid);
        } catch (er) {
          if (!chownErOk(er)) throw er;
        }
      } : orig;
    }
    function statFix(orig) {
      return orig ? function(target, options, cb) {
        function callback(er, stats) {
          stats && (stats.uid < 0 && (stats.uid += 4294967296), stats.gid < 0 && (stats.gid += 4294967296)), 
          cb && cb.apply(this, arguments);
        }
        return "function" == typeof options && (cb = options, options = null), options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
      } : orig;
    }
    function statFixSync(orig) {
      return orig ? function(target, options) {
        var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
        return stats && (stats.uid < 0 && (stats.uid += 4294967296), stats.gid < 0 && (stats.gid += 4294967296)), 
        stats;
      } : orig;
    }
    function chownErOk(er) {
      return !er || ("ENOSYS" === er.code || !(process.getuid && 0 === process.getuid() || "EINVAL" !== er.code && "EPERM" !== er.code));
    }
    fs.read = "function" != typeof fs.read ? fs.read : function(fs$read) {
      function read(fd, buffer, offset, length, position, callback_) {
        var callback;
        if (callback_ && "function" == typeof callback_) {
          var eagCounter = 0;
          callback = function(er, _, __) {
            if (er && "EAGAIN" === er.code && eagCounter < 10) return eagCounter++, fs$read.call(fs, fd, buffer, offset, length, position, callback);
            callback_.apply(this, arguments);
          };
        }
        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
      }
      return Object.setPrototypeOf && Object.setPrototypeOf(read, fs$read), read;
    }(fs.read), fs.readSync = "function" != typeof fs.readSync ? fs.readSync : (fs$readSync = fs.readSync, 
    function(fd, buffer, offset, length, position) {
      for (var eagCounter = 0; ;) try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position);
      } catch (er) {
        if ("EAGAIN" === er.code && eagCounter < 10) {
          eagCounter++;
          continue;
        }
        throw er;
      }
    });
    var fs$readSync;
  };
}, function(module, exports) {
  module.exports = require("constants");
}, function(module, exports, __webpack_require__) {
  var Stream = __webpack_require__(5).Stream;
  module.exports = function(fs) {
    return {
      ReadStream: function ReadStream(path, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path, options);
        Stream.call(this);
        var self = this;
        this.path = path, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", 
        this.mode = 438, this.bufferSize = 65536, options = options || {};
        for (var keys = Object.keys(options), index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        this.encoding && this.setEncoding(this.encoding);
        if (void 0 !== this.start) {
          if ("number" != typeof this.start) throw TypeError("start must be a Number");
          if (void 0 === this.end) this.end = 1 / 0; else if ("number" != typeof this.end) throw TypeError("end must be a Number");
          if (this.start > this.end) throw new Error("start must be <= end");
          this.pos = this.start;
        }
        if (null !== this.fd) return void process.nextTick((function() {
          self._read();
        }));
        fs.open(this.path, this.flags, this.mode, (function(err, fd) {
          if (err) return self.emit("error", err), void (self.readable = !1);
          self.fd = fd, self.emit("open", fd), self._read();
        }));
      },
      WriteStream: function WriteStream(path, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path, options);
        Stream.call(this), this.path = path, this.fd = null, this.writable = !0, this.flags = "w", 
        this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, options = options || {};
        for (var keys = Object.keys(options), index = 0, length = keys.length; index < length; index++) {
          var key = keys[index];
          this[key] = options[key];
        }
        if (void 0 !== this.start) {
          if ("number" != typeof this.start) throw TypeError("start must be a Number");
          if (this.start < 0) throw new Error("start must be >= zero");
          this.pos = this.start;
        }
        this.busy = !1, this._queue = [], null === this.fd && (this._open = fs.open, this._queue.push([ this._open, this.path, this.flags, this.mode, void 0 ]), 
        this.flush());
      }
    };
  };
}, function(module, exports) {
  module.exports = require("stream");
}, function(module, exports, __webpack_require__) {
  "use strict";
  module.exports = function(obj) {
    if (null === obj || "object" != typeof obj) return obj;
    if (obj instanceof Object) var copy = {
      __proto__: getPrototypeOf(obj)
    }; else copy = Object.create(null);
    return Object.getOwnPropertyNames(obj).forEach((function(key) {
      Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    })), copy;
  };
  var getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
  };
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports) {
  module.exports = require("assert");
} ]);
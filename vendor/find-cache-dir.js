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
  return __webpack_require__(2);
}([ function(module, exports) {
  module.exports = require("path");
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), commonDir = __webpack_require__(3), pkgDir = __webpack_require__(4), makeDir = __webpack_require__(11);
  module.exports = (options = {}) => {
    const {name: name} = options;
    let directory = options.cwd;
    return directory = options.files ? commonDir(directory, options.files) : directory || process.cwd(), 
    directory = pkgDir.sync(directory), directory && (directory = path.join(directory, "node_modules", ".cache", name), 
    directory && options.create && makeDir.sync(directory), options.thunk) ? (...arguments_) => path.join(directory, ...arguments_) : directory;
  };
}, function(module, exports, __webpack_require__) {
  var path = __webpack_require__(0);
  module.exports = function(basedir, relfiles) {
    if (relfiles) var files = relfiles.map((function(r) {
      return path.resolve(basedir, r);
    })); else files = basedir;
    var res = files.slice(1).reduce((function(ps, file) {
      if (!file.match(/^([A-Za-z]:)?\/|\\/)) throw new Error("relative path without a basedir");
      for (var xs = file.split(/\/+|\\+/), i = 0; ps[i] === xs[i] && i < Math.min(ps.length, xs.length); i++) ;
      return ps.slice(0, i);
    }), files[0].split(/\/+|\\+/));
    return res.length > 1 ? res.join("/") : "/";
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), findUp = __webpack_require__(5);
  module.exports = cwd => findUp("package.json", {
    cwd: cwd
  }).then(fp => fp ? path.dirname(fp) : null), module.exports.sync = cwd => {
    const fp = findUp.sync("package.json", {
      cwd: cwd
    });
    return fp ? path.dirname(fp) : null;
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), locatePath = __webpack_require__(6);
  module.exports = (filename, opts = {}) => {
    const startDir = path.resolve(opts.cwd || ""), {root: root} = path.parse(startDir), filenames = [].concat(filename);
    return new Promise(resolve => {
      !function find(dir) {
        locatePath(filenames, {
          cwd: dir
        }).then(file => {
          file ? resolve(path.join(dir, file)) : dir === root ? resolve(null) : find(path.dirname(dir));
        });
      }(startDir);
    });
  }, module.exports.sync = (filename, opts = {}) => {
    let dir = path.resolve(opts.cwd || "");
    const {root: root} = path.parse(dir), filenames = [].concat(filename);
    for (;;) {
      const file = locatePath.sync(filenames, {
        cwd: dir
      });
      if (file) return path.join(dir, file);
      if (dir === root) return null;
      dir = path.dirname(dir);
    }
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), pathExists = __webpack_require__(7), pLocate = __webpack_require__(8);
  module.exports = (iterable, options) => (options = Object.assign({
    cwd: process.cwd()
  }, options), pLocate(iterable, el => pathExists(path.resolve(options.cwd, el)), options)), 
  module.exports.sync = (iterable, options) => {
    options = Object.assign({
      cwd: process.cwd()
    }, options);
    for (const el of iterable) if (pathExists.sync(path.resolve(options.cwd, el))) return el;
  };
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(1);
  module.exports = fp => new Promise(resolve => {
    fs.access(fp, err => {
      resolve(!err);
    });
  }), module.exports.sync = fp => {
    try {
      return fs.accessSync(fp), !0;
    } catch (err) {
      return !1;
    }
  };
}, function(module, exports, __webpack_require__) {
  const pLimit = __webpack_require__(9);
  class EndError extends Error {
    constructor(value) {
      super(), this.value = value;
    }
  }
  const testElement = (el, tester) => Promise.resolve(el).then(tester), finder = el => Promise.all(el).then(val => !0 === val[1] && Promise.reject(new EndError(val[0])));
  module.exports = (iterable, tester, opts) => {
    opts = Object.assign({
      concurrency: 1 / 0,
      preserveOrder: !0
    }, opts);
    const limit = pLimit(opts.concurrency), items = [ ...iterable ].map(el => [ el, limit(testElement, el, tester) ]), checkLimit = pLimit(opts.preserveOrder ? 1 : 1 / 0);
    return Promise.all(items.map(el => checkLimit(finder, el))).then(() => {}).catch(err => err instanceof EndError ? err.value : Promise.reject(err));
  };
}, function(module, exports, __webpack_require__) {
  const pTry = __webpack_require__(10), pLimit = concurrency => {
    if (!Number.isInteger(concurrency) && concurrency !== 1 / 0 || !(concurrency > 0)) return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
    const queue = [];
    let activeCount = 0;
    const next = () => {
      activeCount--, queue.length > 0 && queue.shift()();
    }, run = (fn, resolve, ...args) => {
      activeCount++;
      const result = pTry(fn, ...args);
      resolve(result), result.then(next, next);
    }, generator = (fn, ...args) => new Promise(resolve => ((fn, resolve, ...args) => {
      activeCount < concurrency ? run(fn, resolve, ...args) : queue.push(run.bind(null, fn, resolve, ...args));
    })(fn, resolve, ...args));
    return Object.defineProperties(generator, {
      activeCount: {
        get: () => activeCount
      },
      pendingCount: {
        get: () => queue.length
      },
      clearQueue: {
        value: () => {
          queue.length = 0;
        }
      }
    }), generator;
  };
  module.exports = pLimit, module.exports.default = pLimit;
}, function(module, exports, __webpack_require__) {
  const pTry = (fn, ...arguments_) => new Promise(resolve => {
    resolve(fn(...arguments_));
  });
  module.exports = pTry, module.exports.default = pTry;
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(1), path = __webpack_require__(0), pify = __webpack_require__(12), defaults = {
    mode: 511 & ~process.umask(),
    fs: fs
  }, useNativeRecursiveOption = /^\s*v?(10\.(1[2-9]|[2-9]\d|[1-9]\d\d+)|1[1-9]|[2-9]\d|[1-9]\d\d+)\./.test(process.version), checkPath = pth => {
    if ("win32" === process.platform) {
      if (/[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ""))) {
        const error = new Error("Path contains invalid characters: " + pth);
        throw error.code = "EINVAL", error;
      }
    }
  }, permissionError = pth => {
    const error = new Error(`operation not permitted, mkdir '${pth}'`);
    return error.code = "EPERM", error.errno = -4048, error.path = pth, error.syscall = "mkdir", 
    error;
  }, makeDir = (input, options) => Promise.resolve().then(() => {
    checkPath(input), options = Object.assign({}, defaults, options);
    const mkdir = pify(options.fs.mkdir), stat = pify(options.fs.stat);
    if (useNativeRecursiveOption && options.fs.mkdir === fs.mkdir) {
      const pth = path.resolve(input);
      return mkdir(pth, {
        mode: options.mode,
        recursive: !0
      }).then(() => pth);
    }
    const make = pth => mkdir(pth, options.mode).then(() => pth).catch(error => {
      if ("EPERM" === error.code) throw error;
      if ("ENOENT" === error.code) {
        if (path.dirname(pth) === pth) throw permissionError(pth);
        if (error.message.includes("null bytes")) throw error;
        return make(path.dirname(pth)).then(() => make(pth));
      }
      return stat(pth).then(stats => stats.isDirectory() ? pth : Promise.reject()).catch(() => {
        throw error;
      });
    });
    return make(path.resolve(input));
  });
  module.exports = makeDir, module.exports.default = makeDir, module.exports.sync = (input, options) => {
    if (checkPath(input), options = Object.assign({}, defaults, options), useNativeRecursiveOption && options.fs.mkdirSync === fs.mkdirSync) {
      const pth = path.resolve(input);
      return fs.mkdirSync(pth, {
        mode: options.mode,
        recursive: !0
      }), pth;
    }
    const make = pth => {
      try {
        options.fs.mkdirSync(pth, options.mode);
      } catch (error) {
        if ("EPERM" === error.code) throw error;
        if ("ENOENT" === error.code) {
          if (path.dirname(pth) === pth) throw permissionError(pth);
          if (error.message.includes("null bytes")) throw error;
          return make(path.dirname(pth)), make(pth);
        }
        try {
          if (!options.fs.statSync(pth).isDirectory()) throw new Error("The path is not a directory");
        } catch (_) {
          throw error;
        }
      }
      return pth;
    };
    return make(path.resolve(input));
  };
}, function(module, exports, __webpack_require__) {
  const processFn = (fn, options) => function(...args) {
    return new (0, options.promiseModule)((resolve, reject) => {
      options.multiArgs ? args.push((...result) => {
        options.errorFirst ? result[0] ? reject(result) : (result.shift(), resolve(result)) : resolve(result);
      }) : options.errorFirst ? args.push((error, result) => {
        error ? reject(error) : resolve(result);
      }) : args.push(resolve), fn.apply(this, args);
    });
  };
  module.exports = (input, options) => {
    options = Object.assign({
      exclude: [ /.+(Sync|Stream)$/ ],
      errorFirst: !0,
      promiseModule: Promise
    }, options);
    const objType = typeof input;
    if (null === input || "object" !== objType && "function" !== objType) throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${null === input ? "null" : objType}\``);
    const filter = key => {
      const match = pattern => "string" == typeof pattern ? key === pattern : pattern.test(key);
      return options.include ? options.include.some(match) : !options.exclude.some(match);
    };
    let ret;
    ret = "function" === objType ? function(...args) {
      return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
    } : Object.create(Object.getPrototypeOf(input));
    for (const key in input) {
      const property = input[key];
      ret[key] = "function" == typeof property && filter(key) ? processFn(property, options) : property;
    }
    return ret;
  };
} ]);
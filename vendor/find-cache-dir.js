'use strict';

module.exports = (function (modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    var module = installedModules[moduleId];
    if (module) return module.exports;

    installedModules[moduleId] = module = {i: moduleId, l: false, exports: {}};
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;
    return module.exports;
  }

  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  return __webpack_require__(2);
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
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  commonDir = __webpack_require__(3),
  pkgDir = __webpack_require__(4),
  makeDir = __webpack_require__(11);

module.exports = (options = {}) => {
  const {name} = options;
  let directory = options.cwd;

  directory = options.files ? commonDir(directory, options.files) : directory || process.cwd();

  directory = pkgDir.sync(directory);

  if (directory) {
    directory = path.join(directory, 'node_modules', '.cache', name);

    directory && options.create && makeDir.sync(directory);

    if (options.thunk) return (...arguments_) => path.join(directory, ...arguments_);
  }

  return directory;
};

},
// 3
function (module, exports, __webpack_require__) {

var path = __webpack_require__(0);

module.exports = function (basedir, relfiles) {
  var files = relfiles
    ? relfiles.map(function (r) {
        return path.resolve(basedir, r);
      })
    : basedir;

  var res = files.slice(1).reduce(function (ps, file) {
    if (!/^([A-Za-z]:)?\/|\\/.test(file)) throw new Error('relative path without a basedir');

    var xs = file.split(/\/+|\\+/);
    for (var i = 0; ps[i] === xs[i] && i < Math.min(ps.length, xs.length); i++);

    return ps.slice(0, i);
  }, files[0].split(/\/+|\\+/));

  return res.length > 1 ? res.join('/') : '/';
};

},
// 4
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  findUp = __webpack_require__(5);

module.exports = cwd => findUp('package.json', {cwd}).then(fp => (fp ? path.dirname(fp) : null));

module.exports.sync = cwd => {
  const fp = findUp.sync('package.json', {cwd});
  return fp ? path.dirname(fp) : null;
};

},
// 5
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  locatePath = __webpack_require__(6);

module.exports = (filename, opts = {}) => {
  const startDir = path.resolve(opts.cwd || ''),
    {root} = path.parse(startDir),

    filenames = [].concat(filename);

  return new Promise(resolve => {
    !(function find(dir) {
      locatePath(filenames, {cwd: dir}).then(file => {
        file
          ? resolve(path.join(dir, file))
          : dir === root
          ? resolve(null)
          : find(path.dirname(dir));
      });
    })(startDir);
  });
};

module.exports.sync = (filename, opts = {}) => {
  let dir = path.resolve(opts.cwd || '');
  const {root} = path.parse(dir),

    filenames = [].concat(filename);

  while (1) {
    const file = locatePath.sync(filenames, {cwd: dir});

    if (file) return path.join(dir, file);

    if (dir === root) return null;

    dir = path.dirname(dir);
  }
};

},
// 6
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  pathExists = __webpack_require__(7),
  pLocate = __webpack_require__(8);

module.exports = (iterable, options) => {
  options = Object.assign({cwd: process.cwd()}, options);

  return pLocate(iterable, el => pathExists(path.resolve(options.cwd, el)), options);
};

module.exports.sync = (iterable, options) => {
  options = Object.assign({cwd: process.cwd()}, options);

  for (const el of iterable) if (pathExists.sync(path.resolve(options.cwd, el))) return el;
};

},
// 7
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(1);

module.exports = fp => new Promise(resolve => {
  fs.access(fp, err => {
    resolve(!err);
  });
});

module.exports.sync = fp => {
  try {
    fs.accessSync(fp);
    return true;
  } catch (_) {
    return false;
  }
};

},
// 8
function (module, exports, __webpack_require__) {

const pLimit = __webpack_require__(9);

class EndError extends Error {
  constructor(value) {
    super();
    this.value = value;
  }
}

const testElement = (el, tester) => Promise.resolve(el).then(tester),

  finder = el =>
    Promise.all(el).then(val => val[1] === true && Promise.reject(new EndError(val[0])));

module.exports = (iterable, tester, opts) => {
  opts = Object.assign({concurrency: Infinity, preserveOrder: true}, opts);

  const limit = pLimit(opts.concurrency),

    items = [...iterable].map(el => [el, limit(testElement, el, tester)]),

    checkLimit = pLimit(opts.preserveOrder ? 1 : Infinity);

  return Promise.all(items.map(el => checkLimit(finder, el)))
    .then(() => {})
    .catch(err => (err instanceof EndError ? err.value : Promise.reject(err)));
};

},
// 9
function (module, exports, __webpack_require__) {

const pTry = __webpack_require__(10);

const pLimit = concurrency => {
  if ((!Number.isInteger(concurrency) && concurrency !== Infinity) || concurrency <= 0)
    return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));

  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    queue.length > 0 && queue.shift()();
  };

  const run = (fn, resolve, ...args) => {
    activeCount++;

    const result = pTry(fn, ...args);

    resolve(result);

    result.then(next, next);
  };

  const enqueue = (fn, resolve, ...args) => {
    activeCount < concurrency
      ? run(fn, resolve, ...args)
      : queue.push(run.bind(null, fn, resolve, ...args));
  };

  const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
  Object.defineProperties(generator, {
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
  });

  return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;

},
// 10
function (module) {

const pTry = (fn, ...arguments_) => new Promise(resolve => {
  resolve(fn(...arguments_));
});

module.exports = pTry;
module.exports.default = pTry;

},
// 11
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(1),
  path = __webpack_require__(0),
  pify = __webpack_require__(12);

const defaults = {mode: 0o777 & ~process.umask(), fs},

  useNativeRecursiveOption = // >=10.12.0
    /^\s*v?(10\.(1[2-9]|[2-9]\d|\d{3,})|1[1-9]|[2-9]\d|\d{3,})\./.test(process.version);

const checkPath = pth => {
  if (process.platform === 'win32' && /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''))) {
    const error = new Error('Path contains invalid characters: ' + pth);
    error.code = 'EINVAL';
    throw error;
  }
};

const permissionError = pth => {
  const error = new Error(`operation not permitted, mkdir '${pth}'`);
  error.code = 'EPERM';
  error.errno = -4048;
  error.path = pth;
  error.syscall = 'mkdir';
  return error;
};

const makeDir = (input, options) => Promise.resolve().then(() => {
  checkPath(input);
  options = Object.assign({}, defaults, options);

  const mkdir = pify(options.fs.mkdir),
    stat = pify(options.fs.stat);

  if (useNativeRecursiveOption && options.fs.mkdir === fs.mkdir) {
    const pth = path.resolve(input);

    return mkdir(pth, {mode: options.mode, recursive: true}).then(() => pth);
  }

  const make = pth =>
    mkdir(pth, options.mode)
      .then(() => pth)
      .catch(error => {
        if (error.code === 'EPERM') throw error;

        if (error.code === 'ENOENT') {
          if (path.dirname(pth) === pth) throw permissionError(pth);

          if (error.message.includes('null bytes')) throw error;

          return make(path.dirname(pth)).then(() => make(pth));
        }

        return stat(pth)
          .then(stats => (stats.isDirectory() ? pth : Promise.reject()))
          .catch(() => {
            throw error;
          });
      });

  return make(path.resolve(input));
});

module.exports = makeDir;
module.exports.default = makeDir;

module.exports.sync = (input, options) => {
  checkPath(input);
  options = Object.assign({}, defaults, options);

  if (useNativeRecursiveOption && options.fs.mkdirSync === fs.mkdirSync) {
    const pth = path.resolve(input);

    fs.mkdirSync(pth, {mode: options.mode, recursive: true});

    return pth;
  }

  const make = pth => {
    try {
      options.fs.mkdirSync(pth, options.mode);
    } catch (error) {
      if (error.code === 'EPERM') throw error;

      if (error.code === 'ENOENT') {
        if (path.dirname(pth) === pth) throw permissionError(pth);

        if (error.message.includes('null bytes')) throw error;

        make(path.dirname(pth));
        return make(pth);
      }

      try {
        if (!options.fs.statSync(pth).isDirectory())
          throw new Error('The path is not a directory');
      } catch (_) {
        throw error;
      }
    }

    return pth;
  };

  return make(path.resolve(input));
};

},
// 12
function (module) {

const processFn = (fn, options) => function (...args) {
  return new (0, options.promiseModule)((resolve, reject) => {
    if (options.multiArgs)
      args.push((...result) => {
        if (options.errorFirst)
          if (result[0]) reject(result);
          else {
            result.shift();
            resolve(result);
          }
        else resolve(result);
      });
    else if (options.errorFirst)
      args.push((error, result) => {
        error ? reject(error) : resolve(result);
      });
    else args.push(resolve);

    fn.apply(this, args);
  });
};

module.exports = (input, options) => {
  options = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise
  }, options);

  const objType = typeof input;
  if (input === null || (objType !== 'object' && objType !== 'function'))
    throw new TypeError(
      `Expected \`input\` to be a \`Function\` or \`Object\`, got \`${input === null ? 'null' : objType}\``
    );

  const filter = key => {
    const match = pattern => (typeof pattern == 'string' ? key === pattern : pattern.test(key));
    return options.include ? options.include.some(match) : !options.exclude.some(match);
  };

  let ret =
    objType === 'function'
    ? function (...args) {
        return options.excludeMain ? input(...args) : processFn(input, options).apply(this, args);
      }
    : Object.create(Object.getPrototypeOf(input));

  for (const key in input) {
    const property = input[key];
    ret[key] = typeof property == 'function' && filter(key) ? processFn(property, options) : property;
  }

  return ret;
};

}
]);

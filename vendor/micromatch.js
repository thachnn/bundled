'use strict';

module.exports = (function(modules) {
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
  return __webpack_require__(42);
})([
// 0
function(module, exports, __webpack_require__) {

var isobject = __webpack_require__(1),
  isDescriptor = __webpack_require__(47);
var define = typeof Reflect != 'undefined' && Reflect.defineProperty
  ? Reflect.defineProperty
  : Object.defineProperty;

module.exports = function(obj, key, val) {
  if (!isobject(obj) && typeof obj != 'function' && !Array.isArray(obj))
    throw new TypeError('expected an object, function, or array');

  if (typeof key != 'string') throw new TypeError('expected "key" to be a string');

  if (isDescriptor(val)) {
    define(obj, key, val);
    return obj;
  }

  define(obj, key, { configurable: true, enumerable: false, writable: true, value: val });

  return obj;
};

},
// 1
function(module) {

module.exports = function(val) {
  return val != null && typeof val == 'object' && Array.isArray(val) === false;
};

},
// 2
function(module) {

module.exports = require('util');

},
// 3
function(module, exports, __webpack_require__) {

var safe = __webpack_require__(17),
  define = __webpack_require__(0),
  extend = Object.assign,
  not = __webpack_require__(5),
  MAX_LENGTH = 65536,

  cache = {};

module.exports = function(patterns, options) {
  return Array.isArray(patterns)
    ? makeRe(patterns.join('|'), options)
    : makeRe(patterns, options);
};

function makeRe(pattern, options) {
  if (pattern instanceof RegExp) return pattern;

  if (typeof pattern != 'string') throw new TypeError('expected a string');

  if (pattern.length > MAX_LENGTH)
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');

  var key = pattern;
  if (!options || (options && options.cache !== false)) {
    key = createKey(pattern, options);

    if (cache.hasOwnProperty(key)) return cache[key];
  }

  var opts = extend({}, options);
  if (opts.contains === true)
    opts.negate === true ? (opts.strictNegate = false) : (opts.strict = false);

  if (opts.strict === false) {
    opts.strictOpen = false;
    opts.strictClose = false;
  }

  var regex,
    open = opts.strictOpen !== false ? '^' : '',
    close = opts.strictClose !== false ? '$' : '',
    flags = opts.flags || '';

  opts.nocase !== true || /i/.test(flags) || (flags += 'i');

  try {
    if (opts.negate || typeof opts.strictNegate == 'boolean')
      pattern = not.create(pattern, opts);

    regex = new RegExp(open + '(?:' + pattern + ')' + close, flags);

    if (opts.safe === true && safe(regex) === false)
      throw new Error('potentially unsafe regular expression: ' + regex.source);
  } catch (err) {
    if (opts.strictErrors === true || opts.safe === true) {
      err.key = key;
      err.pattern = pattern;
      err.originalOptions = options;
      err.createdOptions = opts;
      throw err;
    }

    try {
      regex = new RegExp('^' + pattern.replace(/(\W)/g, '\\$1') + '$');
    } catch (_) {
      regex = /.^/;
    }
  }

  opts.cache === false || memoize(regex, key, pattern, opts);

  return regex;
}

function memoize(regex, key, pattern, options) {
  define(regex, 'cached', true);
  define(regex, 'pattern', pattern);
  define(regex, 'options', options);
  define(regex, 'key', key);
  cache[key] = regex;
}

function createKey(pattern, options) {
  if (!options) return pattern;
  var key = pattern;
  for (var prop in options)
    if (options.hasOwnProperty(prop)) key += ';' + prop + '=' + String(options[prop]);

  return key;
}

module.exports.makeRe = makeRe;

},
// 4
function(module) {

var toString = Object.prototype.toString;

module.exports = function(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') return isGeneratorFn(val) ? 'generatorfunction' : 'function';

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) return 'generator';

  switch ((type = toString.call(val))) {
    case '[object Object]': return 'object';
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

/** @returns {?string} */
function ctorName(val) {
  return typeof val.constructor == 'function' ? val.constructor.name : null;
}

function isArray(val) {
  return Array.isArray ? Array.isArray(val) : val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (
    typeof val.message == 'string' &&
    val.constructor &&
    typeof val.constructor.stackTraceLimit == 'number'
  );
}

function isDate(val) {
  return val instanceof Date || (
    typeof val.toDateString == 'function' &&
    typeof val.getDate == 'function' &&
    typeof val.setDate == 'function'
  );
}

function isRegexp(val) {
  return val instanceof RegExp || (
    typeof val.flags == 'string' &&
    typeof val.ignoreCase == 'boolean' &&
    typeof val.multiline == 'boolean' &&
    typeof val.global == 'boolean'
  );
}

/**
 * @param {*} name
 * @param {*} [val]
 */
function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw == 'function' &&
    typeof val.return == 'function' &&
    typeof val.next == 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length == 'number' && typeof val.callee == 'function') return true;
  } catch (err) {
    if (err.message.indexOf('callee') > -1) return true;
  }
  return false;
}

function isBuffer(/** Buffer */ val) {
  return !!val.constructor && typeof val.constructor.isBuffer == 'function' &&
    val.constructor.isBuffer(val);
}

},
// 5
function(module, exports, __webpack_require__) {

var extend = Object.assign,
  safe = __webpack_require__(17);

function toRegex(pattern, options) {
  return new RegExp(toRegex.create(pattern, options));
}

toRegex.create = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  var opts = extend({}, options);
  if (opts.contains === true) opts.strictNegate = false;

  var open = opts.strictOpen !== false ? '^' : '',
    close = opts.strictClose !== false ? '$' : '',
    endChar = opts.endChar ? opts.endChar : '+';

  var res =
    open +
    (opts.strictNegate === false
      ? '(?:(?!(?:' + pattern + ')).)' + endChar
      : '(?:(?!^(?:' + pattern + ')$).)' + endChar) +
    close;

  if (opts.safe === true && safe(res) === false)
    throw new Error('potentially unsafe regular expression: ' + res);

  return res;
};

module.exports = toRegex;

},
// 6
function(module) {

module.exports = function(arr) {
  if (!Array.isArray(arr)) throw new TypeError('array-unique expects an array.');

  for (var len = arr.length, i = -1; i++ < len; )
    for (var j = i + 1; j < arr.length; ++j) arr[i] !== arr[j] || arr.splice(j--, 1);

  return arr;
};

module.exports.immutable = function(arr) {
  if (!Array.isArray(arr)) throw new TypeError('array-unique expects an array.');

  var arrLen = arr.length,
    newArr = new Array(arrLen);

  for (var i = 0; i < arrLen; i++) newArr[i] = arr[i];

  return module.exports(newArr);
};

},
// 7
function(module, exports, __webpack_require__) {

var isBuffer = __webpack_require__(52),
  toString = Object.prototype.toString;

module.exports = function(val) {
  var type;

  return val === void 0
    ? 'undefined'
    : val === null
    ? 'null'
    : val === true || val === false || val instanceof Boolean
    ? 'boolean'
    : typeof val == 'string' || val instanceof String
    ? 'string'
    : typeof val == 'number' || val instanceof Number
    ? 'number'
    : typeof val == 'function' || val instanceof Function
    ? 'function'
    : Array.isArray !== void 0 && Array.isArray(val)
    ? 'array'
    : val instanceof RegExp
    ? 'regexp'
    : val instanceof Date
    ? 'date'
    : (type = toString.call(val)) === '[object RegExp]'
    ? 'regexp'
    : type === '[object Date]'
    ? 'date'
    : type === '[object Arguments]'
    ? 'arguments'
    : type === '[object Error]'
    ? 'error'
    : type === '[object Promise]'
    ? 'promise'
    : isBuffer(val)
    ? 'buffer'
    : type === '[object Set]'
    ? 'set'
    : type === '[object WeakSet]'
    ? 'weakset'
    : type === '[object Map]'
    ? 'map'
    : type === '[object WeakMap]'
    ? 'weakmap'
    : type === '[object Symbol]'
    ? 'symbol'
    : type === '[object Int8Array]'
    ? 'int8array'
    : type === '[object Uint8Array]'
    ? 'uint8array'
    : type === '[object Uint8ClampedArray]'
    ? 'uint8clampedarray'
    : type === '[object Int16Array]'
    ? 'int16array'
    : type === '[object Uint16Array]'
    ? 'uint16array'
    : type === '[object Int32Array]'
    ? 'int32array'
    : type === '[object Uint32Array]'
    ? 'uint32array'
    : type === '[object Float32Array]'
    ? 'float32array'
    : type === '[object Float64Array]'
    ? 'float64array'
    : 'object';
};

},
// 8
function(module, exports, __webpack_require__) {

var Base = __webpack_require__(58),
  define = __webpack_require__(0),
  Compiler = __webpack_require__(74),
  Parser = __webpack_require__(90),
  utils = __webpack_require__(11);

function Snapdragon(options) {
  Base.call(this, null, options);
  this.options = utils.extend({source: 'string'}, this.options);
  this.compiler = new Compiler(this.options);
  this.parser = new Parser(this.options);

  Object.defineProperty(this, 'compilers', {
    get: function() {
      return this.compiler.compilers;
    }
  });

  Object.defineProperty(this, 'parsers', {
    get: function() {
      return this.parser.parsers;
    }
  });

  Object.defineProperty(this, 'regex', {
    get: function() {
      return this.parser.regex;
    }
  });
}

Base.extend(Snapdragon);

Snapdragon.prototype.capture = function() {
  return this.parser.capture.apply(this.parser, arguments);
};

Snapdragon.prototype.use = function(fn) {
  fn.call(this, this);
  return this;
};

Snapdragon.prototype.parse = function(str, options) {
  this.options = utils.extend({}, this.options, options);
  var parsed = this.parser.parse(str, this.options);

  define(parsed, 'parser', this.parser);
  return parsed;
};

Snapdragon.prototype.compile = function(ast, options) {
  this.options = utils.extend({}, this.options, options);
  var compiled = this.compiler.compile(ast, this.options);

  define(compiled, 'compiler', this.compiler);
  return compiled;
};

module.exports = Snapdragon;

module.exports.Compiler = Compiler;
module.exports.Parser = Parser;

},
// 9
function(module) {

module.exports = {
  ROOT: 0,
  GROUP: 1,
  POSITION: 2,
  SET: 3,
  RANGE: 4,
  REPETITION: 5,
  REFERENCE: 6,
  CHAR: 7
};

},
// 10
function(module, exports, __webpack_require__) {

var splitString = __webpack_require__(20),
  utils = module.exports;

utils.extend = Object.assign;
utils.flatten = __webpack_require__(50);
utils.isObject = __webpack_require__(1);
utils.fillRange = __webpack_require__(51);
utils.repeat = __webpack_require__(54);
utils.unique = __webpack_require__(6);

utils.define = function(obj, key, val) {
  Object.defineProperty(obj, key, {
    writable: true,
    configurable: true,
    enumerable: false,
    value: val
  });
};

utils.isEmptySets = function(str) {
  return /^(?:{,})+$/.test(str);
};

utils.isQuotedString = function(str) {
  var open = str.charAt(0);
  return (open === "'" || open === '"' || open === '`') && str.slice(-1) === open;
};

utils.createKey = function(pattern, options) {
  var id = pattern;
  if (options === void 0) return id;

  for (var keys = Object.keys(options), i = 0; i < keys.length; i++) {
    var key = keys[i];
    id += ';' + key + '=' + String(options[key]);
  }
  return id;
};

utils.createOptions = function(options) {
  var opts = utils.extend.apply(null, arguments);
  if (typeof opts.expand == 'boolean') opts.optimize = !opts.expand;

  if (typeof opts.optimize == 'boolean') opts.expand = !opts.optimize;

  if (opts.optimize === true) opts.makeRe = true;

  return opts;
};

utils.join = function(a, b, options) {
  options = options || {};
  a = utils.arrayify(a);
  b = utils.arrayify(b);

  if (!a.length) return b;
  if (!b.length) return a;

  var arr = [];

  for (var len = a.length, idx = -1; ++idx < len; ) {
    var val = a[idx];
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) val[i] = utils.join(val[i], b, options);

      arr.push(val);
      continue;
    }

    for (var j = 0; j < b.length; j++) {
      var bval = b[j];

      Array.isArray(bval)
        ? arr.push(utils.join(val, bval, options))
        : arr.push(val + bval);
    }
  }
  return arr;
};

utils.split = function(str, options) {
  var opts = utils.extend({sep: ','}, options);
  if (typeof opts.keepQuotes != 'boolean') opts.keepQuotes = true;

  if (opts.unescape === false) opts.keepEscaping = true;

  return splitString(str, opts, utils.escapeBrackets(opts));
};

utils.expand = function(str, options) {
  var opts = utils.extend({rangeLimit: 10000}, options),
    segs = utils.split(str, opts),
    tok = { segs: segs };

  if (utils.isQuotedString(str)) return tok;

  if (opts.rangeLimit === true) opts.rangeLimit = 10000;

  if (segs.length > 1) {
    if (opts.optimize === false) {
      tok.val = segs[0];
      return tok;
    }

    tok.segs = utils.stringifyArray(tok.segs);
  } else if (segs.length === 1) {
    var arr = str.split('..');

    if (arr.length === 1) {
      tok.val = tok.segs[tok.segs.length - 1] || tok.val || str;
      tok.segs = [];
      return tok;
    }

    if (arr.length === 2 && arr[0] === arr[1]) {
      tok.escaped = true;
      tok.val = arr[0];
      tok.segs = [];
      return tok;
    }

    if (arr.length > 1) {
      if (opts.optimize !== false) {
        opts.optimize = true;
        delete opts.expand;
      }

      if (opts.optimize !== true) {
        var min = Math.min(arr[0], arr[1]),
          max = Math.max(arr[0], arr[1]),
          step = arr[2] || 1;

        if (opts.rangeLimit !== false && (max - min) / step >= opts.rangeLimit)
          throw new RangeError(
            'expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.'
          );
      }

      arr.push(opts);
      tok.segs = utils.fillRange.apply(null, arr);

      if (!tok.segs.length) {
        tok.escaped = true;
        tok.val = str;
        return tok;
      }

      if (opts.optimize === true) tok.segs = utils.stringifyArray(tok.segs);

      tok.val = tok.segs === '' ? str : tok.segs[0];

      return tok;
    }
  } else tok.val = str;

  return tok;
};

utils.escapeBrackets = function(options) {
  return function(tok) {
    if (tok.escaped && tok.val === 'b') {
      tok.val = '\\b';
      return;
    }

    if (tok.val !== '(' && tok.val !== '[') return;
    // noinspection JSMismatchedCollectionQueryUpdate
    var opts = utils.extend({}, options),
      brackets = [],
      parens = [],
      stack = [],
      val = tok.val,
      str = tok.str,
      i = tok.idx - 1;

    while (++i < str.length) {
      var ch = str[i];

      if (ch === '\\') {
        val += (opts.keepEscaping === false ? '' : ch) + str[++i];
        continue;
      }

      if (ch === '(') {
        parens.push(ch);
        stack.push(ch);
      }

      if (ch === '[') {
        brackets.push(ch);
        stack.push(ch);
      }

      if (ch === ')') {
        parens.pop();
        stack.pop();
        if (!stack.length) {
          val += ch;
          break;
        }
      }

      if (ch === ']') {
        brackets.pop();
        stack.pop();
        if (!stack.length) {
          val += ch;
          break;
        }
      }
      val += ch;
    }

    tok.split = false;
    tok.val = val.slice(1);
    tok.idx = i;
  };
};

utils.isQuantifier = function(str) {
  return /^(?:[0-9]?,[0-9]|[0-9],)$/.test(str);
};

utils.stringifyArray = function(arr) {
  return [utils.arrayify(arr).join('|')];
};

utils.arrayify = function(arr) {
  return arr === void 0 ? [] : typeof arr == 'string' ? [arr] : arr;
};

utils.isString = function(str) {
  return str != null && typeof str == 'string';
};

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

utils.escapeRegex = function(str) {
  return str.replace(/\\?([!^*?()[\]{}+/])/g, '\\$1');
};

},
// 11
function(module, exports, __webpack_require__) {

exports.extend = Object.assign;
exports.SourceMap = __webpack_require__(80);
exports.sourceMapResolve = __webpack_require__(81);

exports.unixify = function(fp) {
  return fp.split(/\\+/).join('/');
};

exports.isString = function(str) {
  return str && typeof str == 'string';
};

exports.arrayify = function(val) {
  return typeof val == 'string' ? [val] : val ? (Array.isArray(val) ? val : [val]) : [];
};

exports.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

},
// 12
function(module) {

module.exports = require('path');

},
// 13
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(7);

module.exports = function(num) {
  var type = typeOf(num);

  if (type === 'string') {
    if (!num.trim()) return false;
  } else if (type !== 'number') return false;

  return num - num + 1 >= 0;
};

},
// 14
function(module) {

module.exports = function(obj, prop, a, b, c) {
  if (!isObject(obj) || !prop) return obj;

  prop = toString(prop);

  if (a) prop += '.' + toString(a);
  if (b) prop += '.' + toString(b);
  if (c) prop += '.' + toString(c);

  if (prop in obj) return obj[prop];

  for (var segs = prop.split('.'), len = segs.length, i = -1; obj && ++i < len; ) {
    var key = segs[i];
    while (key[key.length - 1] === '\\') key = key.slice(0, -1) + '.' + segs[++i];

    obj = obj[key];
  }
  return obj;
};

function isObject(val) {
  return val !== null && (typeof val == 'object' || typeof val == 'function');
}

function toString(val) {
  return !val ? '' : Array.isArray(val) ? val.join('.') : val;
}

},
// 15
function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(
  typeof process != 'undefined' && process.type === 'renderer' ? 75 : 77
);

},
// 16
function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(33);

function FragmentCache(caches) {
  this.caches = caches || {};
}

FragmentCache.prototype = {
  cache: function(cacheName) {
    return this.caches[cacheName] || (this.caches[cacheName] = new MapCache());
  },

  set: function(cacheName, key, val) {
    var cache = this.cache(cacheName);
    cache.set(key, val);
    return cache;
  },

  has: function(cacheName, key) {
    return this.get(cacheName, key) !== void 0;
  },

  get: function(name, key) {
    var cache = this.cache(name);
    return typeof key == 'string' ? cache.get(key) : cache;
  }
};

// noinspection JSUnusedAssignment
exports = module.exports = FragmentCache;

},
// 17
function(module, exports, __webpack_require__) {

var parse = __webpack_require__(44),
  types = parse.types;

module.exports = function(re, opts) {
  opts || (opts = {});
  var replimit = opts.limit === void 0 ? 25 : opts.limit;

  if (isRegExp(re)) re = re.source;
  else if (typeof re != 'string') re = String(re);

  try {
    re = parse(re);
  } catch (_) {
    return false;
  }

  var reps = 0;
  return (function walk(node, starHeight) {
    if (node.type === types.REPETITION) {
      starHeight++;
      reps++;
      if (starHeight > 1 || reps > replimit) return false;
    }

    if (node.options)
      for (var i = 0, len = node.options.length; i < len; i++)
        if (!walk({ stack: node.options[i] }, starHeight)) return false;

    var stack = node.stack || (node.value && node.value.stack);
    if (!stack) return true;

    for (i = 0; i < stack.length; i++) if (!walk(stack[i], starHeight)) return false;

    return true;
  })(re, 0);
};

function isRegExp(x) {
  return {}.toString.call(x) === '[object RegExp]';
}

},
// 18
function(module, exports, __webpack_require__) {

var types = __webpack_require__(9);

var INTS = function() {
  return [{ type: types.RANGE, from: 48, to: 57 }];
};

var WORDS = function() {
  return [
    { type: types.CHAR, value: 95 },
    { type: types.RANGE, from: 97, to: 122 },
    { type: types.RANGE, from: 65, to: 90 }
  ].concat(INTS());
};

var WHITESPACE = function() {
  return [
    { type: types.CHAR, value: 9 },
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 11 },
    { type: types.CHAR, value: 12 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 32 },
    { type: types.CHAR, value: 160 },
    { type: types.CHAR, value: 5760 },
    { type: types.CHAR, value: 6158 },
    { type: types.CHAR, value: 8192 },
    { type: types.CHAR, value: 8193 },
    { type: types.CHAR, value: 8194 },
    { type: types.CHAR, value: 8195 },
    { type: types.CHAR, value: 8196 },
    { type: types.CHAR, value: 8197 },
    { type: types.CHAR, value: 8198 },
    { type: types.CHAR, value: 8199 },
    { type: types.CHAR, value: 8200 },
    { type: types.CHAR, value: 8201 },
    { type: types.CHAR, value: 8202 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 },
    { type: types.CHAR, value: 8239 },
    { type: types.CHAR, value: 8287 },
    { type: types.CHAR, value: 12288 },
    { type: types.CHAR, value: 65279 }
  ];
};

var NOTANYCHAR = function() {
  return [
    { type: types.CHAR, value: 10 },
    { type: types.CHAR, value: 13 },
    { type: types.CHAR, value: 8232 },
    { type: types.CHAR, value: 8233 }
  ];
};

exports.words = function() {
  return { type: types.SET, set: WORDS(), not: false };
};

exports.notWords = function() {
  return { type: types.SET, set: WORDS(), not: true };
};

exports.ints = function() {
  return { type: types.SET, set: INTS(), not: false };
};

exports.notInts = function() {
  return { type: types.SET, set: INTS(), not: true };
};

exports.whitespace = function() {
  return { type: types.SET, set: WHITESPACE(), not: false };
};

exports.notWhitespace = function() {
  return { type: types.SET, set: WHITESPACE(), not: true };
};

exports.anyChar = function() {
  return { type: types.SET, set: NOTANYCHAR(), not: true };
};

},
// 19
function(module, exports, __webpack_require__) {

var utils = __webpack_require__(10);

module.exports = function(braces, options) {
  braces.compiler
    .set('bos', function() {
      if (this.output) return;
      this.ast.queue = isEscaped(this.ast) ? [this.ast.val] : [];
      this.ast.count = 1;
    })

    .set('bracket', function(node) {
      var close = node.close,
        open = !node.escaped ? '[' : '\\[',
        negated = node.negated,
        inner = node.inner;

      if ((inner = inner.replace(/\\(?=[\\\w]|$)/g, '\\\\')) === ']-') inner = '\\]\\-';

      if (negated && inner.indexOf('.') < 0) inner += '.';
      if (negated && inner.indexOf('/') < 0) inner += '/';

      var val = open + negated + inner + close,
        queue = node.parent.queue,
        last = utils.arrayify(queue.pop());

      queue.push(utils.join(last, val));
      queue.push.apply(queue, []);
    })

    .set('brace', function(node) {
      node.queue = isEscaped(node) ? [node.val] : [];
      node.count = 1;
      return this.mapVisit(node.nodes);
    })

    .set('brace.open', function(node) {
      node.parent.open = node.val;
    })

    .set('text', function(node) {
      var queue = node.parent.queue,
        escaped = node.escaped,
        segs = [node.val];

      if (node.optimize === false)
        options = utils.extend({}, options, {optimize: false});

      if (node.multiplier > 1) node.parent.count *= node.multiplier;

      if (options.quantifiers === true && utils.isQuantifier(node.val)) escaped = true;
      else if (node.val.length > 1) {
        if (isType(node.parent, 'brace') && !isEscaped(node)) {
          var expanded = utils.expand(node.val, options);
          segs = expanded.segs;

          if (expanded.isOptimized) node.parent.isOptimized = true;

          if (!segs.length) {
            var val = expanded.val || node.val;
            if (options.unescape !== false)
              val = val.replace(/\\([,.])/g, '$1').replace(/["'`]/g, '');

            segs = [val];
            escaped = true;
          }
        }
      } else if (node.val === ',')
        if (options.expand) {
          node.parent.queue.push(['']);
          segs = [''];
        } else segs = ['|'];
      else escaped = true;

      if (escaped && isType(node.parent, 'brace') &&
        ((node.parent.nodes.length <= 4 && node.parent.count === 1) ||
          node.parent.length <= 3))
        node.parent.escaped = true;

      if (!hasQueue(node.parent)) {
        node.parent.queue = segs;
        return;
      }

      var last = utils.arrayify(queue.pop());
      if (node.parent.count > 1 && options.expand) {
        last = multiply(last, node.parent.count);
        node.parent.count = 1;
      }

      queue.push(utils.join(utils.flatten(last), segs.shift()));
      queue.push.apply(queue, segs);
    })

    .set('brace.close', function(node) {
      var queue = node.parent.queue,
        prev = node.parent.parent,
        last = prev.queue.pop(),
        open = node.parent.open,
        close = node.val;

      if (open && close && isOptimized(node, options)) {
        open = '(';
        close = ')';
      }

      var ele = utils.last(queue);
      if (node.parent.count > 1 && options.expand) {
        ele = multiply(queue.pop(), node.parent.count);
        node.parent.count = 1;
        queue.push(ele);
      }

      if (close && typeof ele == 'string' && ele.length === 1) {
        open = '';
        close = '';
      }

      if ((isLiteralBrace(node, options) || noInner(node)) && !node.parent.hasEmpty) {
        queue.push(utils.join(open, queue.pop() || ''));
        queue = utils.flatten(utils.join(queue, close));
      }

      last === void 0
        ? (prev.queue = [queue])
        : prev.queue.push(utils.flatten(utils.join(last, queue)));
    })

    .set('eos', function(node) {
      if (this.input) return;

      this.output = options.optimize !== false
        ? utils.last(utils.flatten(this.ast.queue))
        : Array.isArray(utils.last(this.ast.queue))
        ? utils.flatten(this.ast.queue.pop())
        : utils.flatten(this.ast.queue);

      if (node.parent.count > 1 && options.expand)
        this.output = multiply(this.output, node.parent.count);

      this.output = utils.arrayify(this.output);
      this.ast.queue = [];
    });
};

function multiply(queue, n, _options) {
  return utils.flatten(utils.repeat(utils.arrayify(queue), n));
}

function isEscaped(node) {
  return node.escaped === true;
}

function isOptimized(node, options) {
  return !!node.parent.isOptimized ||
    (isType(node.parent, 'brace') && !isEscaped(node.parent) && options.expand !== true);
}

function isLiteralBrace(node, options) {
  return isEscaped(node.parent) || options.optimize !== false;
}

/**
 * @param {*} node
 * @param {*} [type]
 */
function noInner(node, type) {
  if (node.parent.queue.length === 1) return true;

  var nodes = node.parent.nodes;
  return nodes.length === 3 &&
    isType(nodes[0], 'brace.open') &&
    !isType(nodes[1], 'text') &&
    isType(nodes[2], 'brace.close');
}

function isType(node, type) {
  return node !== void 0 && node.type === type;
}

function hasQueue(node) {
  return Array.isArray(node.queue) && node.queue.length;
}

},
// 20
function(module) {

var extend = Object.assign;

module.exports = function(str, options, fn) {
  if (typeof str != 'string') throw new TypeError('expected a string');

  if (typeof options == 'function') {
    fn = options;
    options = null;
  }

  if (typeof options == 'string') options = { sep: options };

  var brackets,
    opts = extend({sep: '.'}, options),
    quotes = opts.quotes || ['"', "'", '`'];

  if (opts.brackets === true) brackets = { '<': '>', '(': ')', '[': ']', '{': '}' };
  else if (opts.brackets) brackets = opts.brackets;

  var closeIdx,
    tokens = [],
    stack = [],
    arr = [''],
    sep = opts.sep,
    len = str.length,
    idx = -1;

  function expected() {
    if (brackets && stack.length) return brackets[stack[stack.length - 1]];
  }

  while (++idx < len) {
    var ch = str[idx],
      next = str[idx + 1],
      tok = { val: ch, idx: idx, arr: arr, str: str };
    tokens.push(tok);

    if (ch === '\\') {
      tok.val = keepEscaping(opts, str, idx) === true ? ch + next : next;
      tok.escaped = true;
      typeof fn != 'function' || fn(tok);

      arr[arr.length - 1] += tok.val;
      idx++;
      continue;
    }

    if (brackets && brackets[ch]) {
      stack.push(ch);
      var e = expected(),
        i = idx + 1;

      if (str.indexOf(e, i + 1) > -1)
        while (stack.length && i < len) {
          var s = str[++i];
          if (s === '\\') s++;
          else if (quotes.indexOf(s) > -1) i = getClosingQuote(str, s, i + 1);
          else {
            e = expected();
            if (stack.length && str.indexOf(e, i + 1) < 0) break;

            brackets[s] ? stack.push(s) : e !== s || stack.pop();
          }
        }

      if ((closeIdx = i) === -1) {
        arr[arr.length - 1] += ch;
        continue;
      }

      ch = str.slice(idx, closeIdx + 1);
      tok.val = ch;
      tok.idx = idx = closeIdx;
    }

    if (quotes.indexOf(ch) > -1) {
      if ((closeIdx = getClosingQuote(str, ch, idx + 1)) === -1) {
        arr[arr.length - 1] += ch;
        continue;
      }

      ch = keepQuotes(ch, opts) === true
        ? str.slice(idx, closeIdx + 1)
        : str.slice(idx + 1, closeIdx);

      tok.val = ch;
      tok.idx = idx = closeIdx;
    }

    if (typeof fn == 'function') {
      fn(tok, tokens);
      ch = tok.val;
      idx = tok.idx;
    }

    tok.val === sep && tok.split !== false
      ? arr.push('')
      : (arr[arr.length - 1] += tok.val);
  }

  return arr;
};

function getClosingQuote(str, ch, i, _brackets) {
  var idx = str.indexOf(ch, i);
  return str.charAt(idx - 1) === '\\' ? getClosingQuote(str, ch, idx + 1) : idx;
}

function keepQuotes(ch, opts) {
  return (
    (opts.keepDoubleQuotes === true && ch === '"') ||
    (opts.keepSingleQuotes === true && ch === "'") ||
    opts.keepQuotes
  );
}

function keepEscaping(opts, str, idx) {
  return typeof opts.keepEscaping == 'function'
    ? opts.keepEscaping(str, idx)
    : opts.keepEscaping === true || str[idx + 1] === '\\';
}

},
// 21
function(module) {

var cache,
  res = '';

module.exports = repeat;

function repeat(str, num) {
  if (typeof str != 'string') throw new TypeError('expected a string');

  if (num === 1) return str;
  if (num === 2) return str + str;

  var max = str.length * num;
  if (cache !== str || cache === void 0) {
    cache = str;
    res = '';
  } else if (res.length >= max) return res.substr(0, max);

  while (max > res.length && num > 1) {
    if (num & 1) res += str;

    num >>= 1;
    str += str;
  }

  return (res = (res += str).substr(0, max));
}

},
// 22
function(module, exports, __webpack_require__) {

var Node = __webpack_require__(55),
  utils = __webpack_require__(10);

module.exports = function(braces, options) {
  braces.parser
    .set('bos', function() {
      this.parsed || (this.ast = this.nodes[0] = new Node(this.ast));
    })

    .set('escape', function() {
      var pos = this.position(),
        m = this.match(/^(?:\\(.)|\${)/);
      if (!m) return;

      var prev = this.prev(),
        last = utils.last(prev.nodes),

        node = pos(new Node({ type: 'text', multiplier: 1, val: m[0] }));

      if (node.val === '\\\\') return node;

      if (node.val === '${')
        for (var ch, str = this.input, idx = -1; (ch = str[++idx]); ) {
          this.consume(1);
          node.val += ch;
          if (ch === '\\') node.val += str[++idx];
          else if (ch === '}') break;
        }

      if (this.options.unescape !== false)
        node.val = node.val.replace(/\\([{}])/g, '$1');

      if (last.val !== '"' || this.input.charAt(0) !== '"')
        return concatNodes.call(this, pos, node, prev, options);

      last.val = node.val;
      this.consume(1);
    })

    .set('bracket', function() {
      var isInside = this.isInside('brace'),
        pos = this.position(),
        m = this.match(/^(?:\[([!^]?)([^\]]{2,}|]-)(]|[^*+?]+)|\[)/);
      if (!m) return;

      var prev = this.prev(),
        val = m[0],
        negated = m[1] ? '^' : '',
        inner = m[2] || '',
        close = m[3] || '';

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var esc = this.input.slice(0, 2);
      if (inner === '' && esc === '\\]') {
        inner += esc;
        this.consume(2);

        for (var ch, str = this.input, idx = -1; (ch = str[++idx]); ) {
          this.consume(1);
          if (ch === ']') {
            close = ch;
            break;
          }
          inner += ch;
        }
      }

      return pos(new Node({
        type: 'bracket',
        val: val,
        escaped: close !== ']',
        negated: negated,
        inner: inner,
        close: close
      }));
    })

    .set('multiplier', function() {
      var isInside = this.isInside('brace'),
        pos = this.position(),
        m = this.match(/^{((?:,|{,+})+)}/);
      if (!m) return;

      this.multiplier = true;
      var prev = this.prev(),
        val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var node = pos(new Node({ type: 'text', multiplier: 1, match: m, val: val }));

      return concatNodes.call(this, pos, node, prev, options);
    })

    .set('brace.open', function() {
      var pos = this.position(),
        m = this.match(/^{(?!(?:[^\\}]?|,+)})/);
      if (!m) return;

      var prev = this.prev(),
        last = utils.last(prev.nodes);

      if (last && last.val && isExtglobChar(last.val.slice(-1))) last.optimize = false;

      var open = pos(new Node({ type: 'brace.open', val: m[0] })),

        node = pos(new Node({ type: 'brace', nodes: [] }));

      node.push(open);
      prev.push(node);
      this.push('brace', node);
    })

    .set('brace.close', function() {
      var pos = this.position(),
        m = this.match(/^}/);
      if (!m || !m[0]) return;

      var brace = this.pop('brace'),
        node = pos(new Node({ type: 'brace.close', val: m[0] }));

      if (!this.isType(brace, 'brace')) {
        if (this.options.strict) throw new Error('missing opening "{"');

        node.type = 'text';
        node.multiplier = 0;
        node.escaped = true;
        return node;
      }

      var prev = this.prev(),
        last = utils.last(prev.nodes);
      if (last.text && utils.last(last.nodes).val === ')' && /[!@*?+]\(/.test(last.text)) {
        var open = last.nodes[0],
          text = last.nodes[1];
        if (open.type === 'brace.open' && text && text.type === 'text')
          text.optimize = false;
      }

      if (brace.nodes.length > 2) {
        var first = brace.nodes[1];
        if (first.type === 'text' && first.val === ',') {
          brace.nodes.splice(1, 1);
          brace.nodes.push(first);
        }
      }

      brace.push(node);
    })

    .set('boundary', function() {
      var pos = this.position(),
        m = this.match(/^[$^](?!{)/);
      if (m) return pos(new Node({ type: 'text', val: m[0] }));
    })

    .set('nobrace', function() {
      var isInside = this.isInside('brace'),
        pos = this.position(),
        m = this.match(/^{[^,]?}/);
      if (!m) return;

      var prev = this.prev(),
        val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      return pos(new Node({ type: 'text', multiplier: 0, val: val }));
    })

    .set('text', function() {
      var isInside = this.isInside('brace'),
        pos = this.position(),
        m = this.match(/^((?!\\)[^${}[\]])+/);
      if (!m) return;

      var prev = this.prev(),
        val = m[0];

      if (isInside && prev.type === 'brace') {
        prev.text = prev.text || '';
        prev.text += val;
      }

      var node = pos(new Node({ type: 'text', multiplier: 1, val: val }));

      return concatNodes.call(this, pos, node, prev, options);
    });
};

function isExtglobChar(ch) {
  return ch === '!' || ch === '@' || ch === '*' || ch === '?' || ch === '+';
}

function concatNodes(pos, node, parent, options) {
  node.orig = node.val;
  var prev = this.prev(),
    last = utils.last(prev.nodes),
    isEscaped = false;

  if (node.val.length > 1) {
    var a = node.val.charAt(0),
      b = node.val.slice(-1);

    isEscaped =
      (a === '"' && b === '"') || (a === "'" && b === "'") || (a === '`' && b === '`');
  }

  if (isEscaped && options.unescape !== false) {
    node.val = node.val.slice(1, node.val.length - 1);
    node.escaped = true;
  }

  if (node.match) {
    var match = node.match[1];
    if (!match || match.indexOf('}') < 0) match = node.match[0];

    var val = match.replace(/{/g, ',').replace(/}/g, '');
    node.multiplier *= val.length;
    node.val = '';
  }

  last.type === 'text' && last.multiplier === 1 && node.multiplier === 1 && node.val
    ? (last.val += node.val)
    : prev.push(node);
}

},
// 23
function(module) {

module.exports = Emitter;

function Emitter(obj) {
  if (obj) return mixin(obj);
}

function mixin(obj) {
  for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];

  return obj;
}

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || []).push(fn);
  return this;
};

Emitter.prototype.once = function(event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};

  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  for (var cb, i = 0; i < callbacks.length; i++)
    if ((cb = callbacks[i]) === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }

  callbacks.length !== 0 || delete this._callbacks['$' + event];

  return this;
};

Emitter.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};

  var args = [].slice.call(arguments, 1),
    callbacks = this._callbacks['$' + event];

  if (callbacks)
    for (var i = 0, len = (callbacks = callbacks.slice(0)).length; i < len; ++i)
      callbacks[i].apply(this, args);

  return this;
};

Emitter.prototype.listeners = function(event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

Emitter.prototype.hasListeners = function(event) {
  return !!this.listeners(event).length;
};

},
// 24
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);

module.exports = function(thisArg, method, target, val) {
  if (!isObject(thisArg) && typeof thisArg != 'function')
    throw new Error('object-visit expects `thisArg` to be an object.');

  if (typeof method != 'string')
    throw new Error('object-visit expects `method` name to be a string');

  if (typeof thisArg[method] != 'function') return thisArg;

  var args = [].slice.call(arguments, 3);
  target = target || {};

  for (var key in target) {
    var arr = [key, target[key]].concat(args);
    thisArg[method].apply(thisArg, arr);
  }
  return thisArg;
};

},
// 25
function(module) {

module.exports = function(val) {
  return val !== void 0 && val !== null &&
    (typeof val == 'object' || typeof val == 'function');
};

},
// 26
function(module) {

module.exports = function(init) {
  if (!Array.isArray(init))
    throw new TypeError('arr-union expects the first argument to be an array.');

  for (var len = arguments.length, i = 0; ++i < len; ) {
    var arg = arguments[i];
    if (!arg) continue;

    Array.isArray(arg) || (arg = [arg]);

    for (var j = 0; j < arg.length; j++) {
      var ele = arg[j];

      init.indexOf(ele) >= 0 || init.push(ele);
    }
  }
  return init;
};

},
// 27
function(module, exports, __webpack_require__) {

var split = __webpack_require__(20),
  extend = Object.assign,
  isPlainObject = __webpack_require__(28),
  isObject = __webpack_require__(25);

module.exports = function(obj, prop, val) {
  if (!isObject(obj)) return obj;

  if (Array.isArray(prop)) prop = [].concat.apply([], prop).join('.');

  if (typeof prop != 'string') return obj;

  var keys = split(prop, {sep: '.', brackets: true}).filter(isValidKey);

  for (var len = keys.length, idx = -1, current = obj; ++idx < len; ) {
    var key = keys[idx];
    if (idx !== len - 1) {
      isObject(current[key]) || (current[key] = {});

      current = current[key];
    } else
      isPlainObject(current[key]) && isPlainObject(val)
        ? (current[key] = extend({}, current[key], val))
        : (current[key] = val);
  }

  return obj;
};

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

},
// 28
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);

function isObjectObject(o) {
  return isObject(o) === true && Object.prototype.toString.call(o) === '[object Object]';
}

module.exports = function(o) {
  var ctor, prot;

  return (
    isObjectObject(o) !== false &&
    typeof (ctor = o.constructor) == 'function' &&
    isObjectObject((prot = ctor.prototype)) !== false &&
    prot.hasOwnProperty('isPrototypeOf') !== false
  );
};

},
// 29
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1),
  hasValues = __webpack_require__(65),
  get = __webpack_require__(14);

module.exports = function(val, prop) {
  return hasValues(isObject(val) && prop ? get(val, prop) : val);
};

},
// 30
function(module) {

module.exports = function base(app, options) {
  if (!isObject(app) && typeof app != 'function')
    throw new TypeError('expected an object or function');

  var opts = isObject(options) ? options : {},
    prop = typeof opts.prop == 'string' ? opts.prop : 'fns';
  Array.isArray(app[prop]) || define(app, prop, []);

  define(app, 'use', use);

  define(app, 'run', function(val) {
    if (!isObject(val)) return;

    if (!val.use || !val.run) {
      define(val, prop, val[prop] || []);
      define(val, 'use', use);
    }

    (val[prop] && val[prop].indexOf(base) > -1) || val.use(base);

    for (var fns = (this || app)[prop], len = fns.length, idx = -1; ++idx < len; )
      val.use(fns[idx]);

    return val;
  });

  function use(type, fn, options) {
    var offset = 1;

    if (typeof type == 'string' || Array.isArray(type)) {
      fn = wrap(type, fn);
      offset++;
    } else {
      options = fn;
      fn = type;
    }

    if (typeof fn != 'function') throw new TypeError('expected a function');

    var self = this || app,
      fns = self[prop],

      args = [].slice.call(arguments, offset);
    args.unshift(self);

    typeof opts.hook != 'function' || opts.hook.apply(self, args);

    var val = fn.apply(self, args);
    typeof val != 'function' || fns.indexOf(val) > -1 || fns.push(val);

    return self;
  }

  function wrap(type, fn) {
    return function plugin() {
      return this.type === type ? fn.apply(this, arguments) : plugin;
    };
  }

  return app;
};

function isObject(val) {
  return val && typeof val == 'object' && !Array.isArray(val);
}

function define(obj, key, val) {
  Object.defineProperty(obj, key, { configurable: true, writable: true, value: val });
}

},
// 31
function(module, exports, __webpack_require__) {

exports = module.exports = createDebug.debug = createDebug.default = createDebug;
/** @memberof exports */
exports.coerce = coerce;
exports.disable = disable;
/** @memberof exports */
exports.enable = enable;
/** @memberof exports */
exports.enabled = enabled;
/** @memberof exports */
exports.humanize = __webpack_require__(76);

exports.names = [];
exports.skips = [];

exports.formatters = {};

var prevTime;

function selectColor(namespace) {
  var hash = 0;

  for (var /** @type {number} */ i in namespace) {
    hash = (hash << 5) - hash + namespace.charCodeAt(i);
    hash |= 0;
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

function createDebug(namespace) {
  function debug() {
    if (!debug.enabled) return;

    // noinspection UnnecessaryLocalVariableJS
    var self = debug,

      curr = +new Date(),
      ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) args[i] = arguments[i];

    args[0] = exports.coerce(args[0]);

    'string' == typeof args[0] || args.unshift('%O');

    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' == typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        args.splice(index, 1);
        index--;
      }
      return match;
    });

    exports.formatArgs.call(self, args);

    (debug.log || exports.log || console.log.bind(console)).apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  'function' != typeof exports.init || exports.init(debug);

  return debug;
}

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces == 'string' ? namespaces : '').split(/[\s,]+/);

  for (var len = split.length, i = 0; i < len; i++)
    if (split[i])
      (namespaces = split[i].replace(/\*/g, '.*?'))[0] === '-'
        ? exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'))
        : exports.names.push(new RegExp('^' + namespaces + '$'));
}

function disable() {
  exports.enable('');
}

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++)
    if (exports.skips[i].test(name)) return false;

  for (i = 0, len = exports.names.length; i < len; i++)
    if (exports.names[i].test(name)) return true;

  return false;
}

function coerce(val) {
  return val instanceof Error ? val.stack || val.message : val;
}

},
// 32
function(module) {

module.exports = require('fs');

},
// 33
function(module) {

var hasOwn = Object.prototype.hasOwnProperty;

module.exports = MapCache;

function MapCache(data) {
  this.__data__ = data || {};
}

MapCache.prototype.set = function(key, value) {
  if (key !== '__proto__') this.__data__[key] = value;

  return this;
};

MapCache.prototype.get = function(key) {
  return key === '__proto__' ? void 0 : this.__data__[key];
};

MapCache.prototype.has = function(key) {
  return key !== '__proto__' && hasOwn.call(this.__data__, key);
};

MapCache.prototype.del = function(key) {
  return this.has(key) && delete this.__data__[key];
};

},
// 34
function(module, exports, __webpack_require__) {

var util = __webpack_require__(2),
  toRegex = __webpack_require__(3),
  extend = Object.assign,

  compilers = __webpack_require__(93),
  parsers = __webpack_require__(94),
  cache = __webpack_require__(95),
  utils = __webpack_require__(96),
  MAX_LENGTH = 65536;

function nanomatch(list, patterns, options) {
  patterns = utils.arrayify(patterns);
  list = utils.arrayify(list);

  var len = patterns.length;
  if (list.length === 0 || len === 0) return [];

  if (len === 1) return nanomatch.match(list, patterns[0], options);

  var negated = false,
    omit = [],
    keep = [];

  for (var idx = -1; ++idx < len; ) {
    var pattern = patterns[idx];

    if (typeof pattern == 'string' && pattern.charCodeAt(0) === 33) {
      omit.push.apply(omit, nanomatch.match(list, pattern.slice(1), options));
      negated = true;
    } else keep.push.apply(keep, nanomatch.match(list, pattern, options));
  }

  if (negated && keep.length === 0)
    if (options && options.unixify === false) keep = list.slice();
    else
      for (var unixify = utils.unixify(options), i = 0; i < list.length; i++)
        keep.push(unixify(list[i]));

  var matches = utils.diff(keep, omit);
  return !options || options.nodupes !== false ? utils.unique(matches) : matches;
}

nanomatch.match = function(list, pattern, options) {
  if (Array.isArray(pattern)) throw new TypeError('expected pattern to be a string');

  var unixify = utils.unixify(options),
    isMatch = memoize('match', pattern, options, nanomatch.matcher),
    matches = [];

  for (var len = (list = utils.arrayify(list)).length, idx = -1; ++idx < len; ) {
    var ele = list[idx];
    if (ele === pattern || isMatch(ele))
      matches.push(utils.value(ele, unixify, options));
  }

  if (options === void 0) return utils.unique(matches);

  if (matches.length === 0) {
    if (options.failglob === true)
      throw new Error('no matches found for "' + pattern + '"');

    if (options.nonull === true || options.nullglob === true)
      return [options.unescape ? utils.unescape(pattern) : pattern];
  }

  if (options.ignore) matches = nanomatch.not(matches, options.ignore, options);

  return options.nodupes !== false ? utils.unique(matches) : matches;
};

nanomatch.isMatch = function(str, pattern, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  return !utils.isEmptyString(str) && !utils.isEmptyString(pattern) &&
    (!!utils.equalsPattern(options)(str) ||
      memoize('isMatch', pattern, options, nanomatch.matcher)(str));
};

nanomatch.some = function(list, patterns, options) {
  if (typeof list == 'string') list = [list];

  for (var i = 0; i < list.length; i++)
    if (nanomatch(list[i], patterns, options).length === 1) return true;

  return false;
};

nanomatch.every = function(list, patterns, options) {
  if (typeof list == 'string') list = [list];

  for (var i = 0; i < list.length; i++)
    if (nanomatch(list[i], patterns, options).length !== 1) return false;

  return true;
};

nanomatch.any = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (utils.isEmptyString(str) || utils.isEmptyString(patterns)) return false;

  if (typeof patterns == 'string') patterns = [patterns];

  for (var i = 0; i < patterns.length; i++)
    if (nanomatch.isMatch(str, patterns[i], options)) return true;

  return false;
};

nanomatch.all = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (typeof patterns == 'string') patterns = [patterns];

  for (var i = 0; i < patterns.length; i++)
    if (!nanomatch.isMatch(str, patterns[i], options)) return false;

  return true;
};

nanomatch.not = function(list, patterns, options) {
  var opts = extend({}, options),
    ignore = opts.ignore;
  delete opts.ignore;

  list = utils.arrayify(list);

  var matches = utils.diff(list, nanomatch(list, patterns, opts));
  if (ignore) matches = utils.diff(matches, nanomatch(list, ignore));

  return opts.nodupes !== false ? utils.unique(matches) : matches;
};

nanomatch.contains = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (typeof patterns == 'string') {
    if (utils.isEmptyString(str) || utils.isEmptyString(patterns)) return false;

    if (utils.equalsPattern(patterns, options)(str) ||
        utils.containsPattern(patterns, options)(str)) return true;
  }

  var opts = extend({}, options, {contains: true});
  return nanomatch.any(str, patterns, opts);
};

nanomatch.matchBase = function(pattern, options) {
  return (!pattern || pattern.indexOf('/') < 0) && !!options &&
    (options.basename === true || options.matchBase === true);
};

nanomatch.matchKeys = function(obj, patterns, options) {
  if (!utils.isObject(obj))
    throw new TypeError('expected the first argument to be an object');

  var keys = nanomatch(Object.keys(obj), patterns, options);
  return utils.pick(obj, keys);
};

nanomatch.matcher = function matcher(pattern, options) {
  if (utils.isEmptyString(pattern))
    return function() {
      return false;
    };

  if (Array.isArray(pattern)) return compose(pattern, options, matcher);

  if (pattern instanceof RegExp) return test(pattern);

  if (!utils.isString(pattern))
    throw new TypeError('expected pattern to be an array, string or regex');

  if (!utils.hasSpecialChars(pattern)) {
    if (options && options.nocase === true) pattern = pattern.toLowerCase();

    return utils.matchPath(pattern, options);
  }

  var re = nanomatch.makeRe(pattern, options);

  if (nanomatch.matchBase(pattern, options)) return utils.matchBasename(re, options);

  function test(regex) {
    var equals = utils.equalsPattern(options),
      unixify = utils.unixify(options);

    return function(str) {
      return !!equals(str) || !!regex.test(unixify(str));
    };
  }

  var matcherFn = test(re);
  utils.define(matcherFn, 'result', re.result);
  return matcherFn;
};

nanomatch.capture = function(pattern, str, options) {
  var re = nanomatch.makeRe(pattern, extend({capture: true}, options)),
    unixify = utils.unixify(options);

  function match() {
    return function(string) {
      var match = re.exec(unixify(string));
      return match ? match.slice(1) : null;
    };
  }

  return memoize('capture', pattern, options, match)(str);
};

nanomatch.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) return pattern;

  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  if (pattern.length > MAX_LENGTH)
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');

  function makeRe() {
    var opts = utils.extend({wrap: false}, options),
      result = nanomatch.create(pattern, opts),
      regex = toRegex(result.output, opts);
    utils.define(regex, 'result', result);
    return regex;
  }

  return memoize('makeRe', pattern, options, makeRe);
};

nanomatch.create = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  function create() {
    return nanomatch.compile(nanomatch.parse(pattern, options), options);
  }
  return memoize('create', pattern, options, create);
};

nanomatch.parse = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  function parse() {
    var snapdragon = utils.instantiate(null, options);
    parsers(snapdragon, options);

    var ast = snapdragon.parse(pattern, options);
    utils.define(ast, 'snapdragon', snapdragon);
    ast.input = pattern;
    return ast;
  }

  return memoize('parse', pattern, options, parse);
};

nanomatch.compile = function(ast, options) {
  if (typeof ast == 'string') ast = nanomatch.parse(ast, options);

  function compile() {
    var snapdragon = utils.instantiate(ast, options);
    compilers(snapdragon, options);
    return snapdragon.compile(ast, options);
  }

  return memoize('compile', ast.input, options, compile);
};

nanomatch.clearCache = function() {
  nanomatch.cache.__data__ = {};
};

function compose(patterns, options, matcher) {
  var matchers;

  return memoize('compose', String(patterns), options, function() {
    return function(file) {
      if (!matchers) {
        matchers = [];
        for (var i = 0; i < patterns.length; i++)
          matchers.push(matcher(patterns[i], options));
      }

      for (var len = matchers.length; len--; )
        if (matchers[len](file) === true) return true;

      return false;
    };
  });
}

function memoize(type, pattern, options, fn) {
  var key = utils.createKey(type + '=' + pattern, options);

  if (options && options.cache === false) return fn(pattern, options);

  if (cache.has(type, key)) return cache.get(type, key);

  var val = fn(pattern, options);
  cache.set(type, key, val);
  return val;
}

nanomatch.compilers = compilers;
nanomatch.parsers = parsers;
nanomatch.cache = cache;

module.exports = nanomatch;

},
// 35
function(module) {

module.exports = function(arr) {
  for (var len = arguments.length, idx = 0; ++idx < len; )
    arr = diffArray(arr, arguments[idx]);

  return arr;
};

function diffArray(one, two) {
  if (!Array.isArray(two)) return one.slice();

  var arr = [];

  for (var tlen = two.length, olen = one.length, idx = -1; ++idx < olen; ) {
    var ele = one[idx],

      hasEle = false;
    for (var i = 0; i < tlen; i++)
      if (ele === two[i]) {
        hasEle = true;
        break;
      }

    hasEle !== false || arr.push(ele);
  }
  return arr;
}

},
// 36
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1);

module.exports = function(obj, keys) {
  if (!isObject(obj) && typeof obj != 'function') return {};

  var res = {};
  if (typeof keys == 'string') {
    if (keys in obj) res[keys] = obj[keys];

    return res;
  }

  for (var len = keys.length, idx = -1; ++idx < len; ) {
    var key = keys[idx];
    if (key in obj) res[key] = obj[key];
  }
  return res;
};

},
// 37
function(module, exports, __webpack_require__) {

var extend = Object.assign,
  unique = __webpack_require__(6),
  toRegex = __webpack_require__(3),

  compilers = __webpack_require__(38),
  parsers = __webpack_require__(40),
  Extglob = __webpack_require__(102),
  utils = __webpack_require__(41),
  MAX_LENGTH = 65536;

function extglob(pattern, options) {
  return extglob.create(pattern, options).output;
}

extglob.match = function(list, pattern, options) {
  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  list = utils.arrayify(list);
  var isMatch = extglob.matcher(pattern, options),
    matches = [];

  for (var len = list.length, idx = -1; ++idx < len; ) {
    var ele = list[idx];

    isMatch(ele) && matches.push(ele);
  }

  if (options === void 0) return unique(matches);

  if (matches.length === 0) {
    if (options.failglob === true)
      throw new Error('no matches found for "' + pattern + '"');

    if (options.nonull === true || options.nullglob === true)
      return [pattern.split('\\').join('')];
  }

  return options.nodupes !== false ? unique(matches) : matches;
};

extglob.isMatch = function(str, pattern, options) {
  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  if (typeof str != 'string') throw new TypeError('expected a string');

  return pattern === str ||
    (pattern === '' || pattern === ' ' || pattern === '.'
      ? pattern === str
      : utils.memoize('isMatch', pattern, options, extglob.matcher)(str));
};

extglob.contains = function(str, pattern, options) {
  if (typeof str != 'string') throw new TypeError('expected a string');

  if (pattern === '' || pattern === ' ' || pattern === '.') return pattern === str;

  var opts = extend({}, options, {contains: true});
  opts.strictClose = false;
  opts.strictOpen = false;
  return extglob.isMatch(str, pattern, opts);
};

extglob.matcher = function(pattern, options) {
  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  function matcher() {
    var re = extglob.makeRe(pattern, options);
    return function(str) {
      return re.test(str);
    };
  }

  return utils.memoize('matcher', pattern, options, matcher);
};

extglob.create = function(pattern, options) {
  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  function create() {
    var ext = new Extglob(options),
      ast = ext.parse(pattern, options);
    return ext.compile(ast, options);
  }

  return utils.memoize('create', pattern, options, create);
};

extglob.capture = function(pattern, str, options) {
  var re = extglob.makeRe(pattern, extend({capture: true}, options));

  function match() {
    return function(string) {
      var match = re.exec(string);
      return match ? match.slice(1) : null;
    };
  }

  return utils.memoize('capture', pattern, options, match)(str);
};

extglob.makeRe = function(pattern, options) {
  if (pattern instanceof RegExp) return pattern;

  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  if (pattern.length > MAX_LENGTH)
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');

  function makeRe() {
    var opts = extend({strictErrors: false}, options);
    if (opts.strictErrors === true) opts.strict = true;
    var res = extglob.create(pattern, opts);
    return toRegex(res.output, opts);
  }

  var regex = utils.memoize('makeRe', pattern, options, makeRe);
  if (regex.source.length > MAX_LENGTH)
    throw new SyntaxError('potentially malicious regex detected');

  return regex;
};

extglob.cache = utils.cache;
extglob.clearCache = function() {
  extglob.cache.__data__ = {};
};

extglob.Extglob = Extglob;
extglob.compilers = compilers;
extglob.parsers = parsers;

module.exports = extglob;

},
// 38
function(module, exports, __webpack_require__) {

var brackets = __webpack_require__(39);

module.exports = function(extglob) {
  function star() {
    return typeof extglob.options.star == 'function'
      ? extglob.options.star.apply(this, arguments)
      : typeof extglob.options.star == 'string'
      ? extglob.options.star
      : '.*?';
  }

  extglob.use(brackets.compilers);
  extglob.compiler
    .set('escape', function(node) {
      return this.emit(node.val, node);
    })

    .set('dot', function(node) {
      return this.emit('\\' + node.val, node);
    })

    .set('qmark', function(node) {
      var val = '[^\\\\/.]',
        prev = this.prev();

      if (node.parsed.slice(-1) === '(') {
        var ch = node.rest.charAt(0);
        return ch !== '!' && ch !== '=' && ch !== ':'
          ? this.emit(val, node)
          : this.emit(node.val, node);
      }

      if (prev.type === 'text' && prev.val) return this.emit(val, node);

      if (node.val.length > 1) val += '{' + node.val.length + '}';

      return this.emit(val, node);
    })

    .set('plus', function(node) {
      var prev = node.parsed.slice(-1);
      if (prev === ']' || prev === ')') return this.emit(node.val, node);

      var ch = this.output.slice(-1);
      return !this.output || (/[?*+]/.test(ch) && node.parent.type !== 'bracket')
        ? this.emit('\\+', node)
        : /\w/.test(ch) && !node.inside
        ? this.emit('+\\+?', node)
        : this.emit('+', node);
    })

    .set('star', function(node) {
      var prev = this.prev(),
        prefix = prev.type !== 'text' && prev.type !== 'escape' ? '(?!\\.)' : '';

      return this.emit(prefix + star.call(this, node), node);
    })

    .set('paren', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('paren.open', function(node) {
      var capture = this.options.capture ? '(' : '';

      switch (node.parent.prefix) {
        case '!':
        case '^':
          return this.emit(capture + '(?:(?!(?:', node);
        case '*':
        case '+':
        case '?':
        case '@':
          return this.emit(capture + '(?:', node);
        default:
          var val = node.val;
          this.options.bash === true
            ? (val = '\\' + val)
            : this.options.capture || val !== '(' || node.parent.rest[0] === '?' ||
              (val += '?:');

          return this.emit(val, node);
      }
    })
    .set('paren.close', function(node) {
      var capture = this.options.capture ? ')' : '';

      switch (node.prefix) {
        case '!':
        case '^':
          var prefix = /^(\)|$)/.test(node.rest) ? '$' : '',
            str = star.call(this, node);

          if (node.parent.hasSlash && !this.options.star && this.options.slash !== false)
            str = '.*?';

          return this.emit(prefix + '))' + str + ')' + capture, node);
        case '*':
        case '+':
        case '?':
          return this.emit(')' + node.prefix + capture, node);
        case '@':
          return this.emit(')' + capture, node);
        default:
          var val = (this.options.bash === true ? '\\' : '') + ')';
          return this.emit(val, node);
      }
    })

    .set('text', function(node) {
      var val = node.val.replace(/[\[\]]/g, '\\$&');
      return this.emit(val, node);
    });
};

},
// 39
function(module, exports, __webpack_require__) {

var compilers = __webpack_require__(98),
  parsers = __webpack_require__(100),

  debug = __webpack_require__(15)('expand-brackets'),
  extend = Object.assign,
  Snapdragon = __webpack_require__(8),
  toRegex = __webpack_require__(3);

function brackets(pattern, options) {
  debug('initializing from <%s>', __filename);
  return brackets.create(pattern, options).output;
}

brackets.match = function(arr, pattern, options) {
  arr = [].concat(arr);
  var opts = extend({}, options),
    isMatch = brackets.matcher(pattern, opts),
    res = [];

  for (var len = arr.length, idx = -1; ++idx < len; ) {
    var ele = arr[idx];
    isMatch(ele) && res.push(ele);
  }

  if (res.length === 0) {
    if (opts.failglob === true)
      throw new Error('no matches found for "' + pattern + '"');

    if (opts.nonull === true || opts.nullglob === true)
      return [pattern.split('\\').join('')];
  }
  return res;
};

brackets.isMatch = function(str, pattern, options) {
  return brackets.matcher(pattern, options)(str);
};

brackets.matcher = function(pattern, options) {
  var re = brackets.makeRe(pattern, options);
  return function(str) {
    return re.test(str);
  };
};

brackets.makeRe = function(pattern, options) {
  var res = brackets.create(pattern, options),
    opts = extend({strictErrors: false}, options);
  return toRegex(res.output, opts);
};

brackets.create = function(pattern, options) {
  var snapdragon = (options && options.snapdragon) || new Snapdragon(options);
  compilers(snapdragon);
  parsers(snapdragon);

  var ast = snapdragon.parse(pattern, options);
  ast.input = pattern;
  var res = snapdragon.compile(ast, options);
  res.input = pattern;
  return res;
};

brackets.compilers = compilers;
brackets.parsers = parsers;

module.exports = brackets;

},
// 40
function(module, exports, __webpack_require__) {

var brackets = __webpack_require__(39),
  define = __webpack_require__(0),

  TEXT_REGEX = '([!@*?+]?\\(|\\)|[*?.+\\\\]|\\[:?(?=.*\\])|:?\\])+',
  not = __webpack_require__(41).createRegex(TEXT_REGEX);

function parsers(extglob) {
  extglob.state = extglob.state || {};

  extglob.use(brackets.parsers);
  extglob.parser.sets.paren = extglob.parser.sets.paren || [];
  extglob.parser
    .capture('paren.open', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^([!@*?+])?\(/);
      if (!m) return;

      var prev = this.prev(),
        prefix = m[1],

        open = pos({ type: 'paren.open', parsed: parsed, val: m[0] }),

        node = pos({ type: 'paren', prefix: prefix, nodes: [open] });

      if (prefix === '!' && prev.type === 'paren' && prev.prefix === '!') {
        prev.prefix = '@';
        node.prefix = '@';
      }

      define(node, 'rest', this.input);
      define(node, 'parsed', parsed);
      define(node, 'parent', prev);
      define(open, 'parent', node);

      this.push('paren', node);
      prev.nodes.push(node);
    })

    .capture('paren.close', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^\)/);
      if (!m) return;

      var parent = this.pop('paren');
      var node = pos({
        type: 'paren.close',
        rest: this.input,
        parsed: parsed,
        val: m[0]
      });

      if (!this.isType(parent, 'paren')) {
        if (this.options.strict) throw new Error('missing opening paren: "("');

        node.escaped = true;
        return node;
      }

      node.prefix = parent.prefix;
      parent.nodes.push(node);
      define(node, 'parent', parent);
    })

    .capture('escape', function() {
      var pos = this.position(),
        m = this.match(/^\\(.)/);
      if (m) return pos({ type: 'escape', val: m[0], ch: m[1] });
    })

    .capture('qmark', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^\?+(?!\()/);
      if (!m) return;
      extglob.state.metachar = true;
      return pos({ type: 'qmark', rest: this.input, parsed: parsed, val: m[0] });
    })

    .capture('star', /^\*(?!\()/)
    .capture('plus', /^\+(?!\()/)
    .capture('dot', /^\./)
    .capture('text', not);
}

module.exports.TEXT_REGEX = TEXT_REGEX;

module.exports = parsers;

},
// 41
function(module, exports, __webpack_require__) {

var regex = __webpack_require__(5),
  Cache = __webpack_require__(16),

  utils = module.exports,
  cache = (utils.cache = new Cache());

utils.arrayify = function(val) {
  return Array.isArray(val) ? val : [val];
};

utils.memoize = function(type, pattern, options, fn) {
  var key = utils.createKey(type + pattern, options);

  if (cache.has(type, key)) return cache.get(type, key);

  var val = fn(pattern, options);
  if (options && options.cache === false) return val;

  cache.set(type, key, val);
  return val;
};

utils.createKey = function(pattern, options) {
  var key = pattern;
  if (options === void 0) return key;

  for (var prop in options) key += ';' + prop + '=' + String(options[prop]);

  return key;
};

utils.createRegex = function(str) {
  return regex(str, {contains: true, strictClose: false});
};

},
// 42
function(module, exports, __webpack_require__) {

var util = __webpack_require__(2),
  braces = __webpack_require__(43),
  toRegex = __webpack_require__(3),
  extend = Object.assign,

  compilers = __webpack_require__(92),
  parsers = __webpack_require__(103),
  cache = __webpack_require__(104),
  utils = __webpack_require__(105),
  MAX_LENGTH = 65536;

function micromatch(list, patterns, options) {
  patterns = utils.arrayify(patterns);
  list = utils.arrayify(list);

  var len = patterns.length;
  if (list.length === 0 || len === 0) return [];

  if (len === 1) return micromatch.match(list, patterns[0], options);

  var omit = [],
    keep = [];

  for (var idx = -1; ++idx < len; ) {
    var pattern = patterns[idx];

    typeof pattern == 'string' && pattern.charCodeAt(0) === 33
      ? omit.push.apply(omit, micromatch.match(list, pattern.slice(1), options))
      : keep.push.apply(keep, micromatch.match(list, pattern, options));
  }

  var matches = utils.diff(keep, omit);
  return !options || options.nodupes !== false ? utils.unique(matches) : matches;
}

micromatch.match = function(list, pattern, options) {
  if (Array.isArray(pattern)) throw new TypeError('expected pattern to be a string');

  var unixify = utils.unixify(options),
    isMatch = memoize('match', pattern, options, micromatch.matcher),
    matches = [];

  for (var len = (list = utils.arrayify(list)).length, idx = -1; ++idx < len; ) {
    var ele = list[idx];
    if (ele === pattern || isMatch(ele))
      matches.push(utils.value(ele, unixify, options));
  }

  if (options === void 0) return utils.unique(matches);

  if (matches.length === 0) {
    if (options.failglob === true)
      throw new Error('no matches found for "' + pattern + '"');

    if (options.nonull === true || options.nullglob === true)
      return [options.unescape ? utils.unescape(pattern) : pattern];
  }

  if (options.ignore) matches = micromatch.not(matches, options.ignore, options);

  return options.nodupes !== false ? utils.unique(matches) : matches;
};

micromatch.isMatch = function(str, pattern, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  return !isEmptyString(str) && !isEmptyString(pattern) &&
    (!!utils.equalsPattern(options)(str) ||
      memoize('isMatch', pattern, options, micromatch.matcher)(str));
};

micromatch.some = function(list, patterns, options) {
  if (typeof list == 'string') list = [list];

  for (var i = 0; i < list.length; i++)
    if (micromatch(list[i], patterns, options).length === 1) return true;

  return false;
};

micromatch.every = function(list, patterns, options) {
  if (typeof list == 'string') list = [list];

  for (var i = 0; i < list.length; i++)
    if (micromatch(list[i], patterns, options).length !== 1) return false;

  return true;
};

micromatch.any = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (isEmptyString(str) || isEmptyString(patterns)) return false;

  if (typeof patterns == 'string') patterns = [patterns];

  for (var i = 0; i < patterns.length; i++)
    if (micromatch.isMatch(str, patterns[i], options)) return true;

  return false;
};

micromatch.all = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (typeof patterns == 'string') patterns = [patterns];

  for (var i = 0; i < patterns.length; i++)
    if (!micromatch.isMatch(str, patterns[i], options)) return false;

  return true;
};

micromatch.not = function(list, patterns, options) {
  var opts = extend({}, options),
    ignore = opts.ignore;
  delete opts.ignore;

  var unixify = utils.unixify(opts);
  list = utils.arrayify(list).map(unixify);

  var matches = utils.diff(list, micromatch(list, patterns, opts));
  if (ignore) matches = utils.diff(matches, micromatch(list, ignore));

  return opts.nodupes !== false ? utils.unique(matches) : matches;
};

micromatch.contains = function(str, patterns, options) {
  if (typeof str != 'string')
    throw new TypeError('expected a string: "' + util.inspect(str) + '"');

  if (typeof patterns == 'string') {
    if (isEmptyString(str) || isEmptyString(patterns)) return false;

    if (utils.equalsPattern(patterns, options)(str) ||
        utils.containsPattern(patterns, options)(str)) return true;
  }

  var opts = extend({}, options, {contains: true});
  return micromatch.any(str, patterns, opts);
};

micromatch.matchBase = function(pattern, options) {
  return (!pattern || pattern.indexOf('/') < 0) && !!options &&
    (options.basename === true || options.matchBase === true);
};

micromatch.matchKeys = function(obj, patterns, options) {
  if (!utils.isObject(obj))
    throw new TypeError('expected the first argument to be an object');

  var keys = micromatch(Object.keys(obj), patterns, options);
  return utils.pick(obj, keys);
};

micromatch.matcher = function matcher(pattern, options) {
  if (Array.isArray(pattern)) return compose(pattern, options, matcher);

  if (pattern instanceof RegExp) return test(pattern);

  if (!utils.isString(pattern))
    throw new TypeError('expected pattern to be an array, string or regex');

  if (!utils.hasSpecialChars(pattern)) {
    if (options && options.nocase === true) pattern = pattern.toLowerCase();

    return utils.matchPath(pattern, options);
  }

  var re = micromatch.makeRe(pattern, options);

  if (micromatch.matchBase(pattern, options)) return utils.matchBasename(re, options);

  function test(regex) {
    var equals = utils.equalsPattern(options),
      unixify = utils.unixify(options);

    return function(str) {
      return !!equals(str) || !!regex.test(unixify(str));
    };
  }

  var fn = test(re);
  Object.defineProperty(fn, 'result', {
    configurable: true,
    enumerable: false,
    value: re.result
  });
  return fn;
};

micromatch.capture = function(pattern, str, options) {
  var re = micromatch.makeRe(pattern, extend({capture: true}, options)),
    unixify = utils.unixify(options);

  function match() {
    return function(string) {
      var match = re.exec(unixify(string));
      return match ? match.slice(1) : null;
    };
  }

  return memoize('capture', pattern, options, match)(str);
};

micromatch.makeRe = function(pattern, options) {
  if (typeof pattern != 'string')
    throw new TypeError('expected pattern to be a string');

  if (pattern.length > MAX_LENGTH)
    throw new Error('expected pattern to be less than ' + MAX_LENGTH + ' characters');

  function makeRe() {
    var result = micromatch.create(pattern, options),
      ast_array = [];
    var output = result.map(function(obj) {
      obj.ast.state = obj.state;
      ast_array.push(obj.ast);
      return obj.output;
    });

    var regex = toRegex(output.join('|'), options);
    Object.defineProperty(regex, 'result', {
      configurable: true,
      enumerable: false,
      value: ast_array
    });
    return regex;
  }

  return memoize('makeRe', pattern, options, makeRe);
};

micromatch.braces = function(pattern, options) {
  if (typeof pattern != 'string' && !Array.isArray(pattern))
    throw new TypeError('expected pattern to be an array or string');

  function expand() {
    return (options && options.nobrace === true) || !/{.*}/.test(pattern)
      ? utils.arrayify(pattern)
      : braces(pattern, options);
  }

  return memoize('braces', pattern, options, expand);
};

micromatch.braceExpand = function(pattern, options) {
  var opts = extend({}, options, {expand: true});
  return micromatch.braces(pattern, opts);
};

micromatch.create = function(pattern, options) {
  return memoize('create', pattern, options, function() {
    function create(str, opts) {
      return micromatch.compile(micromatch.parse(str, opts), opts);
    }

    pattern = micromatch.braces(pattern, options);
    var res = [];

    for (var len = pattern.length, idx = -1; ++idx < len; )
      res.push(create(pattern[idx], options));

    return res;
  });
};

micromatch.parse = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  function parse() {
    var snapdragon = utils.instantiate(null, options);
    parsers(snapdragon, options);

    var ast = snapdragon.parse(pattern, options);
    utils.define(ast, 'snapdragon', snapdragon);
    ast.input = pattern;
    return ast;
  }

  return memoize('parse', pattern, options, parse);
};

micromatch.compile = function(ast, options) {
  if (typeof ast == 'string') ast = micromatch.parse(ast, options);

  return memoize('compile', ast.input, options, function() {
    var snapdragon = utils.instantiate(ast, options);
    compilers(snapdragon, options);
    return snapdragon.compile(ast, options);
  });
};

micromatch.clearCache = function() {
  micromatch.cache.caches = {};
};

function isEmptyString(val) {
  return String(val) === '' || String(val) === './';
}

function compose(patterns, options, matcher) {
  var matchers;

  return memoize('compose', String(patterns), options, function() {
    return function(file) {
      if (!matchers) {
        matchers = [];
        for (var i = 0; i < patterns.length; i++)
          matchers.push(matcher(patterns[i], options));
      }

      for (var len = matchers.length; len--; )
        if (matchers[len](file) === true) return true;

      return false;
    };
  });
}

function memoize(type, pattern, options, fn) {
  var key = utils.createKey(type + '=' + pattern, options);

  if (options && options.cache === false) return fn(pattern, options);

  if (cache.has(type, key)) return cache.get(type, key);

  var val = fn(pattern, options);
  cache.set(type, key, val);
  return val;
}

micromatch.compilers = compilers;
micromatch.parsers = parsers;
micromatch.caches = cache.caches;

module.exports = micromatch;

},
// 43
function(module, exports, __webpack_require__) {

var toRegex = __webpack_require__(3),
  unique = __webpack_require__(6),
  extend = Object.assign,

  compilers = __webpack_require__(19),
  parsers = __webpack_require__(22),
  Braces = __webpack_require__(57),
  utils = __webpack_require__(10),
  MAX_LENGTH = 65536,
  cache = {};

function braces(pattern, options) {
  var key = utils.createKey(String(pattern), options),
    arr = [],

    disabled = options && options.cache === false;
  if (!disabled && cache.hasOwnProperty(key)) return cache[key];

  if (Array.isArray(pattern))
    for (var i = 0; i < pattern.length; i++)
      arr.push.apply(arr, braces.create(pattern[i], options));
  else arr = braces.create(pattern, options);

  if (options && options.nodupes === true) arr = unique(arr);

  disabled || (cache[key] = arr);

  return arr;
}

braces.expand = function(pattern, options) {
  return braces.create(pattern, extend({}, options, {expand: true}));
};

braces.optimize = function(pattern, options) {
  return braces.create(pattern, options);
};

braces.create = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  var maxLength = (options && options.maxLength) || MAX_LENGTH;
  if (pattern.length >= maxLength)
    throw new Error('expected pattern to be less than ' + maxLength + ' characters');

  function create() {
    if (pattern === '' || pattern.length < 3) return [pattern];

    if (utils.isEmptySets(pattern)) return [];

    if (utils.isQuotedString(pattern)) return [pattern.slice(1, -1)];

    var proto = new Braces(options),
      result = !options || options.expand !== true
        ? proto.optimize(pattern, options)
        : proto.expand(pattern, options),

      arr = result.output;

    if (options && options.noempty === true) arr = arr.filter(Boolean);

    if (options && options.nodupes === true) arr = unique(arr);

    Object.defineProperty(arr, 'result', { enumerable: false, value: result });

    return arr;
  }

  return memoize('create', pattern, options, create);
};

braces.makeRe = function(pattern, options) {
  if (typeof pattern != 'string') throw new TypeError('expected a string');

  var maxLength = (options && options.maxLength) || MAX_LENGTH;
  if (pattern.length >= maxLength)
    throw new Error('expected pattern to be less than ' + maxLength + ' characters');

  function makeRe() {
    var arr = braces(pattern, options),
      opts = extend({strictErrors: false}, options);
    return toRegex(arr, opts);
  }

  return memoize('makeRe', pattern, options, makeRe);
};

braces.parse = function(pattern, options) {
  return new Braces(options).parse(pattern, options);
};

braces.compile = function(ast, options) {
  return new Braces(options).compile(ast, options);
};

braces.clearCache = function() {
  cache = braces.cache = {};
};

function memoize(type, pattern, options, fn) {
  var key = utils.createKey(type + ':' + pattern, options);
  if (options && options.cache === false) {
    braces.clearCache();
    return fn(pattern, options);
  }

  if (cache.hasOwnProperty(key)) return cache[key];

  var res = fn(pattern, options);
  cache[key] = res;
  return res;
}

braces.Braces = Braces;
braces.compilers = compilers;
braces.parsers = parsers;
braces.cache = cache;

module.exports = braces;

},
// 44
function(module, exports, __webpack_require__) {

var util = __webpack_require__(45),
  types = __webpack_require__(9),
  sets = __webpack_require__(18),
  positions = __webpack_require__(46);

module.exports = function(regexpStr) {
  var start = { type: types.ROOT, stack: [] },

    lastGroup = start,
    last = start.stack,
    groupStack = [],

    repeatErr = function(i) {
      util.error(regexpStr, 'Nothing to repeat at column ' + (i - 1));
    },

    str = util.strToChars(regexpStr);

  for (var c, i = 0, l = str.length; i < l; )
    switch ((c = str[i++])) {
      case '\\':
        switch ((c = str[i++])) {
          case 'b':
            last.push(positions.wordBoundary());
            break;

          case 'B':
            last.push(positions.nonWordBoundary());
            break;

          case 'w':
            last.push(sets.words());
            break;

          case 'W':
            last.push(sets.notWords());
            break;

          case 'd':
            last.push(sets.ints());
            break;

          case 'D':
            last.push(sets.notInts());
            break;

          case 's':
            last.push(sets.whitespace());
            break;

          case 'S':
            last.push(sets.notWhitespace());
            break;

          default:
            /\d/.test(c)
              ? last.push({ type: types.REFERENCE, value: parseInt(c, 10) })
              : last.push({ type: types.CHAR, value: c.charCodeAt(0) });
        }

        break;

      case '^':
        last.push(positions.begin());
        break;

      case '$':
        last.push(positions.end());
        break;

      case '[':
        var not;
        if (str[i] === '^') {
          not = true;
          i++;
        } else not = false;

        var classTokens = util.tokenizeClass(str.slice(i), regexpStr);

        i += classTokens[1];
        last.push({ type: types.SET, set: classTokens[0], not: not });

        break;

      case '.':
        last.push(sets.anyChar());
        break;

      case '(':
        var group = { type: types.GROUP, stack: [], remember: true };

        if ((c = str[i]) === '?') {
          c = str[i + 1];
          i += 2;

          if (c === '=') group.followedBy = true;
          else if (c === '!') group.notFollowedBy = true;
          else if (c !== ':')
            util.error(
              regexpStr,
              "Invalid group, character '" + c + "' after '?' at column " + (i - 1)
            );

          group.remember = false;
        }

        last.push(group);

        groupStack.push(lastGroup);

        lastGroup = group;
        last = group.stack;
        break;

      case ')':
        groupStack.length !== 0 ||
          util.error(regexpStr, 'Unmatched ) at column ' + (i - 1));

        last = (lastGroup = groupStack.pop()).options
          ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
        break;

      case '|':
        if (!lastGroup.options) {
          lastGroup.options = [lastGroup.stack];
          delete lastGroup.stack;
        }

        var stack = [];
        lastGroup.options.push(stack);
        last = stack;
        break;

      case '{':
        var min, max, rs = /^(\d+)(,(\d+)?)?}/.exec(str.slice(i));
        if (rs !== null) {
          last.length !== 0 || repeatErr(i);

          min = parseInt(rs[1], 10);
          max = rs[2] ? (rs[3] ? parseInt(rs[3], 10) : Infinity) : min;
          i += rs[0].length;

          last.push({ type: types.REPETITION, min: min, max: max, value: last.pop() });
        } else last.push({ type: types.CHAR, value: 123 });

        break;

      case '?':
        last.length !== 0 || repeatErr(i);

        last.push({ type: types.REPETITION, min: 0, max: 1, value: last.pop() });
        break;

      case '+':
        last.length !== 0 || repeatErr(i);

        last.push({ type: types.REPETITION, min: 1, max: Infinity, value: last.pop() });
        break;

      case '*':
        last.length !== 0 || repeatErr(i);

        last.push({ type: types.REPETITION, min: 0, max: Infinity, value: last.pop() });
        break;

      default:
        last.push({ type: types.CHAR, value: c.charCodeAt(0) });
    }

  groupStack.length === 0 || util.error(regexpStr, 'Unterminated group');

  return start;
};

module.exports.types = types;

},
// 45
function(module, exports, __webpack_require__) {

var types = __webpack_require__(9),
  sets = __webpack_require__(18),

  CTRL = '@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?',
  SLSH = { 0: 0, t: 9, n: 10, v: 11, f: 12, r: 13 };

exports.strToChars = function(str) {
  var chars_regex =
    /(\[\\b])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]^?])|([0tnvfr]))/g;

  return str.replace(chars_regex, function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
    if (lbs) return s;

    var code = b ? 8
      : a16 ? parseInt(a16, 16)
      : b16 ? parseInt(b16, 16)
      : c8 ? parseInt(c8, 8)
      : dctrl ? CTRL.indexOf(dctrl)
      : SLSH[eslsh];

    var c = String.fromCharCode(code);

    if (/[\[\]{}^$.|?*+()]/.test(c)) c = '\\' + c;

    return c;
  });
};

exports.tokenizeClass = function(str, regexpStr) {
  var regexp =
    /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(])|(?:\\)?(.)/g;

  for (var rs, c, tokens = []; (rs = regexp.exec(str)) != null; )
    if (rs[1]) tokens.push(sets.words());
    else if (rs[2]) tokens.push(sets.ints());
    else if (rs[3]) tokens.push(sets.whitespace());
    else if (rs[4]) tokens.push(sets.notWords());
    else if (rs[5]) tokens.push(sets.notInts());
    else if (rs[6]) tokens.push(sets.notWhitespace());
    else if (rs[7])
      tokens.push({
        type: types.RANGE,
        from: (rs[8] || rs[9]).charCodeAt(0),
        to: rs[10].charCodeAt(0)
      });
    else if ((c = rs[12])) tokens.push({ type: types.CHAR, value: c.charCodeAt(0) });
    else return [tokens, regexp.lastIndex];

  exports.error(regexpStr, 'Unterminated character class');
};

exports.error = function(regexp, msg) {
  throw new SyntaxError('Invalid regular expression: /' + regexp + '/: ' + msg);
};

},
// 46
function(module, exports, __webpack_require__) {

var types = __webpack_require__(9);

exports.wordBoundary = function() {
  return { type: types.POSITION, value: 'b' };
};

exports.nonWordBoundary = function() {
  return { type: types.POSITION, value: 'B' };
};

exports.begin = function() {
  return { type: types.POSITION, value: '^' };
};

exports.end = function() {
  return { type: types.POSITION, value: '$' };
};

},
// 47
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(4),
  isAccessor = __webpack_require__(48),
  isData = __webpack_require__(49);

module.exports = function(obj, key) {
  return typeOf(obj) === 'object' &&
    ('get' in obj ? isAccessor(obj, key) : isData(obj, key));
};

},
// 48
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(4);

var accessor = {
  get: 'function',
  set: 'function',
  configurable: 'boolean',
  enumerable: 'boolean'
};

function isAccessorDescriptor(obj, prop) {
  if (typeof prop == 'string')
    return Object.getOwnPropertyDescriptor(obj, prop) !== void 0;

  if (
    typeOf(obj) !== 'object' ||
    has(obj, 'value') || has(obj, 'writable') ||
    !has(obj, 'get') || typeof obj.get != 'function' ||
    (has(obj, 'set') && typeof obj.set != 'function' && obj.set !== void 0)
  )
    return false;

  for (var key in obj)
    if (
      accessor.hasOwnProperty(key) &&
      typeOf(obj[key]) !== accessor[key] &&
      obj[key] !== void 0
    )
      return false;

  return true;
}

function has(obj, key) {
  return {}.hasOwnProperty.call(obj, key);
}

module.exports = isAccessorDescriptor;

},
// 49
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(4);

module.exports = function(obj, prop) {
  var data = { configurable: 'boolean', enumerable: 'boolean', writable: 'boolean' };

  if (typeOf(obj) !== 'object') return false;

  if (typeof prop == 'string')
    return Object.getOwnPropertyDescriptor(obj, prop) !== void 0;

  if (!('value' in obj || 'writable' in obj)) return false;

  for (var key in obj)
    if (
      key !== 'value' &&
      data.hasOwnProperty(key) &&
      typeOf(obj[key]) !== data[key] &&
      obj[key] !== void 0
    )
      return false;

  return true;
};

},
// 50
function(module) {

module.exports = function(arr) {
  return flat(arr, []);
};

function flat(arr, res) {
  for (var cur, i = 0, len = arr.length; i < len; i++) {
    cur = arr[i];
    Array.isArray(cur) ? flat(cur, res) : res.push(cur);
  }
  return res;
}

},
// 51
function(module, exports, __webpack_require__) {

var util = __webpack_require__(2),
  isNumber = __webpack_require__(13),
  extend = Object.assign,
  repeat = __webpack_require__(21),
  toRegex = __webpack_require__(53);

function fillRange(start, stop, step, options) {
  if (start === void 0) return [];

  if (stop === void 0 || start === stop) {
    var isString = typeof start == 'string';
    return isNumber(start) && !toNumber(start) ? [isString ? '0' : 0] : [start];
  }

  if (typeof step != 'number' && typeof step != 'string') {
    options = step;
    step = void 0;
  }

  if (typeof options == 'function') options = { transform: options };

  var opts = extend({step: step}, options);
  if (opts.step && !isValidNumber(opts.step)) {
    if (opts.strictRanges === true)
      throw new TypeError('expected options.step to be a number');

    return [];
  }

  opts.isNumber = isValidNumber(start) && isValidNumber(stop);
  if (!opts.isNumber && !isValid(start, stop)) {
    if (opts.strictRanges === true)
      throw new RangeError('invalid range arguments: ' + util.inspect([start, stop]));

    return [];
  }

  opts.isPadded = isPadded(start) || isPadded(stop);
  opts.toString = opts.stringify ||
    typeof opts.step == 'string' ||
    typeof start == 'string' ||
    typeof stop == 'string' ||
    !opts.isNumber;

  if (opts.isPadded)
    opts.maxLength = Math.max(String(start).length, String(stop).length);

  if (typeof opts.optimize == 'boolean') opts.toRegex = opts.optimize;
  if (typeof opts.makeRe == 'boolean') opts.toRegex = opts.makeRe;
  return expand(start, stop, opts);
}

function expand(start, stop, options) {
  var a = options.isNumber ? toNumber(start) : start.charCodeAt(0),
    b = options.isNumber ? toNumber(stop) : stop.charCodeAt(0),

    step = Math.abs(toNumber(options.step)) || 1;
  if (options.toRegex && step === 1) return toRange(a, b, start, stop, options);

  var zero = {greater: [], lesser: []},
    asc = a < b,
    arr = new Array(Math.round((asc ? b - a : a - b) / step));

  for (var idx = 0; asc ? a <= b : a >= b; ) {
    var val = options.isNumber ? a : String.fromCharCode(a);
    options.toRegex && (val >= 0 || !options.isNumber)
      ? zero.greater.push(val)
      : zero.lesser.push(Math.abs(val));

    if (options.isPadded) val = zeros(val, options);

    if (options.toString) val = String(val);

    arr[idx++] = typeof options.transform == 'function'
      ? options.transform(val, a, b, step, idx, arr, options)
      : val;

    asc ? (a += step) : (a -= step);
  }

  return options.toRegex === true ? toSequence(arr, zero, options) : arr;
}

function toRange(a, b, start, stop, options) {
  return options.isPadded
    ? toRegex(start, stop, options)
    : options.isNumber
    ? toRegex(Math.min(a, b), Math.max(a, b), options)
    : '[' + String.fromCharCode(Math.min(a, b)) +
      '-' + String.fromCharCode(Math.max(a, b)) + ']';
}

function toSequence(arr, zeros, options) {
  var greater = '', lesser = '';
  if (zeros.greater.length) greater = zeros.greater.join('|');

  if (zeros.lesser.length) lesser = '-(' + zeros.lesser.join('|') + ')';

  var res = greater && lesser ? greater + '|' + lesser : greater || lesser;

  return options.capture ? '(' + res + ')' : res;
}

function zeros(val, options) {
  if (options.isPadded) {
    var str = String(val),
      len = str.length,
      dash = '';
    if (str.charAt(0) === '-') {
      dash = '-';
      str = str.slice(1);
    }
    var diff = options.maxLength - len;
    val = dash + repeat('0', diff) + str;
  }
  return options.stringify ? String(val) : val;
}

function toNumber(val) {
  return Number(val) || 0;
}

function isPadded(str) {
  return /^-?0\d/.test(str);
}

function isValid(min, max) {
  return (isValidNumber(min) || isValidLetter(min)) &&
    (isValidNumber(max) || isValidLetter(max));
}

function isValidLetter(ch) {
  return typeof ch == 'string' && ch.length === 1 && /^\w+$/.test(ch);
}

function isValidNumber(n) {
  return isNumber(n) && !/\./.test(n);
}

module.exports = fillRange;

},
// 52
function(module) {

module.exports = function(obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer(/** Buffer */ obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer == 'function' &&
    obj.constructor.isBuffer(obj)
}

function isSlowBuffer(obj) {
  return typeof obj.readFloatLE == 'function' && typeof obj.slice == 'function' &&
    isBuffer(obj.slice(0, 0))
}

},
// 53
function(module, exports, __webpack_require__) {

var repeat = __webpack_require__(21),
  isNumber = __webpack_require__(13),
  cache = {};

function toRegexRange(min, max, options) {
  if (isNumber(min) === false)
    throw new RangeError('toRegexRange: first argument is invalid.');

  if (max === void 0 || min === max) return String(min);

  if (isNumber(max) === false)
    throw new RangeError('toRegexRange: second argument is invalid.');

  options = options || {};
  var key = min + ':' + max + '=' +
    String(options.relaxZeros) +
    String(options.shorthand) +
    String(options.capture);
  if (cache.hasOwnProperty(key)) return cache[key].result;

  var a = Math.min(min, max),
    b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    var result = min + '|' + max;
    return options.capture ? '(' + result + ')' : result;
  }

  var isPadded = padding(min) || padding(max),
    positives = [],
    negatives = [],

    tok = {min: min, max: max, a: a, b: b};
  if (isPadded) {
    tok.isPadded = isPadded;
    tok.maxLen = String(tok.max).length;
  }

  if (a < 0) {
    negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), tok, options);
    a = tok.a = 0;
  }

  if (b >= 0) positives = splitToPatterns(a, b, tok, options);

  tok.negatives = negatives;
  tok.positives = positives;
  tok.result = siftPatterns(negatives, positives, options);

  if (options.capture && positives.length + negatives.length > 1)
    tok.result = '(' + tok.result + ')';

  cache[key] = tok;
  return tok.result;
}

function siftPatterns(neg, pos, options) {
  var onlyNegative = filterPatterns(neg, pos, '-', false, options) || [],
    onlyPositive = filterPatterns(pos, neg, '', false, options) || [],
    intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  return onlyNegative.concat(intersected).concat(onlyPositive).join('|');
}

function splitToRanges(min, max) {
  min = Number(min);

  var nines = 1,
    stops = [(max = Number(max))],
    stop = +countNines(min, nines);

  while (min <= stop && stop <= max) {
    stops = push(stops, stop);
    stop = +countNines(min, (nines += 1));
  }

  var zeros = 1;
  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops = push(stops, stop);
    stop = countZeros(max + 1, (zeros += 1)) - 1;
  }

  stops.sort(compare);
  return stops;
}

function rangeToPattern(start, stop, options) {
  if (start === stop) return {pattern: String(start), digits: []};

  var zipped = zip(String(start), String(stop)),

    pattern = '',
    digits = 0;

  for (var len = zipped.length, i = -1; ++i < len; ) {
    var numbers = zipped[i],
      startDigit = numbers[0],
      stopDigit = numbers[1];

    startDigit === stopDigit
      ? (pattern += startDigit)
      : startDigit !== '0' || stopDigit !== '9'
      ? (pattern += toCharacterClass(startDigit, stopDigit))
      : (digits += 1);
  }

  if (digits) pattern += options.shorthand ? '\\d' : '[0-9]';

  return { pattern: pattern, digits: [digits] };
}

function splitToPatterns(min, max, tok, options) {
  var ranges = splitToRanges(min, max),
    tokens = [];

  for (var prev = void 0, len = ranges.length, idx = -1, start = min; ++idx < len; ) {
    var range = ranges[idx],
      obj = rangeToPattern(start, range, options),
      zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      prev.digits.length > 1 && prev.digits.pop();

      prev.digits.push(obj.digits[0]);
      prev.string = prev.pattern + toQuantifier(prev.digits);
      start = range + 1;
      continue;
    }

    if (tok.isPadded) zeros = padZeros(range, tok);

    obj.string = zeros + obj.pattern + toQuantifier(obj.digits);
    tokens.push(obj);
    start = range + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, options) {
  var res = [];

  for (var i = 0; i < arr.length; i++) {
    var ele = arr[i].string;

    if (options.relaxZeros !== false && prefix === '-' && ele.charAt(0) === '0')
      ele = ele.charAt(1) === '{'
        ? '0*' + ele.replace(/^0{\d+}/, '')
        : '0*' + ele.slice(1);

    intersection || contains(comparison, 'string', ele) || res.push(prefix + ele);

    intersection && contains(comparison, 'string', ele) && res.push(prefix + ele);
  }
  return res;
}

function zip(a, b) {
  var arr = [];
  for (var ch in a) arr.push([a[ch], b[ch]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function push(arr, ele) {
  arr.indexOf(ele) > -1 || arr.push(ele);
  return arr;
}

function contains(arr, key, val) {
  for (var i = 0; i < arr.length; i++) if (arr[i][key] === val) return true;

  return false;
}

function countNines(min, len) {
  return String(min).slice(0, -len) + repeat('9', len);
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  var start = digits[0],
    stop = digits[1] ? ',' + digits[1] : '';
  return stop || (start && start !== 1) ? '{' + start + stop + '}' : '';
}

function toCharacterClass(a, b) {
  return '[' + a + (b - a == 1 ? '' : '-') + b + ']';
}

function padding(str) {
  return /^-?(0+)\d/.exec(str);
}

function padZeros(val, tok) {
  if (tok.isPadded) {
    var diff = Math.abs(tok.maxLen - String(val).length);
    switch (diff) {
      case 0:
        return '';
      case 1:
        return '0';
      default:
        return '0{' + diff + '}';
    }
  }
  return val;
}

module.exports = toRegexRange;

},
// 54
function(module) {

module.exports = function(ele, num) {
  var arr = new Array(num);

  if (Array.prototype.fill) return arr.fill(ele);

  for (var i = 0; i < num; i++) arr[i] = ele;

  return arr;
};

},
// 55
function(module, exports, __webpack_require__) {

var ownNames,
  isObject = __webpack_require__(1),
  define = __webpack_require__(0),
  utils = __webpack_require__(56);

function Node(val, type, parent) {
  if (typeof type != 'string') {
    parent = type;
    type = null;
  }

  define(this, 'parent', parent);
  define(this, 'isNode', true);
  define(this, 'expect', null);

  if (typeof type != 'string' && isObject(val)) {
    lazyKeys();
    for (var keys = Object.keys(val), i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (ownNames.indexOf(key) < 0) this[key] = val[key];
    }
  } else {
    this.type = type;
    this.val = val;
  }
}

Node.isNode = function(node) {
  return utils.isNode(node);
};

Node.prototype.define = function(name, val) {
  define(this, name, val);
  return this;
};

Node.prototype.isEmpty = function(fn) {
  return utils.isEmpty(this, fn);
};

Node.prototype.push = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  define(node, 'parent', this);

  this.nodes = this.nodes || [];
  return this.nodes.push(node);
};

Node.prototype.unshift = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  define(node, 'parent', this);

  this.nodes = this.nodes || [];
  return this.nodes.unshift(node);
};

Node.prototype.pop = function() {
  return this.nodes && this.nodes.pop();
};

Node.prototype.shift = function() {
  return this.nodes && this.nodes.shift();
};

Node.prototype.remove = function(node) {
  assert(Node.isNode(node), 'expected node to be an instance of Node');
  this.nodes = this.nodes || [];
  var idx = node.index;
  if (idx !== -1) {
    node.index = -1;
    return this.nodes.splice(idx, 1);
  }
  return null;
};

Node.prototype.find = function(type) {
  return utils.findNode(this.nodes, type);
};

Node.prototype.isType = function(type) {
  return utils.isType(this, type);
};

Node.prototype.hasType = function(type) {
  return utils.hasType(this, type);
};

Object.defineProperty(Node.prototype, 'siblings', {
  set: function() {
    throw new Error('node.siblings is a getter and cannot be defined');
  },
  get: function() {
    return this.parent ? this.parent.nodes : null;
  }
});

Object.defineProperty(Node.prototype, 'index', {
  set: function(index) {
    define(this, 'idx', index);
  },
  get: function() {
    if (!Array.isArray(this.siblings)) return -1;

    if ((this.idx !== -1 ? this.siblings[this.idx] : null) !== this)
      this.idx = this.siblings.indexOf(this);

    return this.idx;
  }
});

Object.defineProperty(Node.prototype, 'prev', {
  set: function() {
    throw new Error('node.prev is a getter and cannot be defined');
  },
  get: function() {
    return Array.isArray(this.siblings)
      ? this.siblings[this.index - 1] || this.parent.prev
      : null;
  }
});

Object.defineProperty(Node.prototype, 'next', {
  set: function() {
    throw new Error('node.next is a getter and cannot be defined');
  },
  get: function() {
    return Array.isArray(this.siblings)
      ? this.siblings[this.index + 1] || this.parent.next
      : null;
  }
});

Object.defineProperty(Node.prototype, 'first', {
  get: function() {
    return this.nodes ? this.nodes[0] : null;
  }
});

Object.defineProperty(Node.prototype, 'last', {
  get: function() {
    return this.nodes ? utils.last(this.nodes) : null;
  }
});

Object.defineProperty(Node.prototype, 'scope', {
  get: function() {
    return this.isScope !== true && this.parent ? this.parent.scope : this;
  }
});

function lazyKeys() {
  ownNames || (ownNames = Object.getOwnPropertyNames(Node.prototype));
}

function assert(val, message) {
  if (!val) throw new Error(message);
}

// noinspection JSUnusedAssignment
exports = module.exports = Node;

},
// 56
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(7),
  utils = module.exports;

utils.isNode = function(node) {
  return typeOf(node) === 'object' && node.isNode === true;
};

utils.noop = function(node) {
  append(this, '', node);
};

utils.identity = function(node) {
  append(this, node.val, node);
};

utils.append = function(val) {
  return function(node) {
    append(this, val, node);
  };
};

utils.toNoop = function(node, nodes) {
  if (nodes) node.nodes = nodes;
  else {
    delete node.nodes;
    node.type = 'text';
    node.val = '';
  }
};

utils.visit = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(fn), 'expected a visitor function');
  fn(node);
  return node.nodes ? utils.mapVisit(node, fn) : node;
};

utils.mapVisit = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isArray(node.nodes), 'expected node.nodes to be an array');
  assert(isFunction(fn), 'expected a visitor function');

  for (var i = 0; i < node.nodes.length; i++) utils.visit(node.nodes[i], fn);

  return node;
};

utils.addOpen = function(node, Node, val, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  if (typeof val == 'function') {
    filter = val;
    val = '';
  }

  if (typeof filter == 'function' && !filter(node)) return;
  var open = new Node({ type: node.type + '.open', val: val }),
    unshift = node.unshift || node.unshiftNode;
  typeof unshift == 'function' ? unshift.call(node, open) : utils.unshiftNode(node, open);

  return open;
};

utils.addClose = function(node, Node, val, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  if (typeof val == 'function') {
    filter = val;
    val = '';
  }

  if (typeof filter == 'function' && !filter(node)) return;
  var close = new Node({ type: node.type + '.close', val: val }),
    push = node.push || node.pushNode;
  typeof push == 'function' ? push.call(node, close) : utils.pushNode(node, close);

  return close;
};

utils.wrapNodes = function(node, Node, filter) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isFunction(Node), 'expected Node to be a constructor function');

  utils.addOpen(node, Node, filter);
  utils.addClose(node, Node, filter);
  return node;
};

utils.pushNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  node.define('parent', parent);
  parent.nodes = parent.nodes || [];
  parent.nodes.push(node);
  return node;
};

utils.unshiftNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  node.define('parent', parent);
  parent.nodes = parent.nodes || [];
  parent.nodes.unshift(node);
};

utils.popNode = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return typeof node.pop == 'function' ? node.pop() : node.nodes && node.nodes.pop();
};

utils.shiftNode = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return typeof node.shift == 'function'
    ? node.shift()
    : node.nodes && node.nodes.shift();
};

utils.removeNode = function(parent, node) {
  assert(utils.isNode(parent), 'expected parent.node to be an instance of Node');
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  if (!parent.nodes) return null;

  if (typeof parent.remove == 'function') return parent.remove(node);

  var idx = parent.nodes.indexOf(node);
  if (idx > -1) return parent.nodes.splice(idx, 1);
};

utils.isType = function(node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  switch (typeOf(type)) {
    case 'array':
      for (var types = type.slice(), i = 0; i < types.length; i++)
        if (utils.isType(node, types[i])) return true;

      return false;
    case 'string':
      return node.type === type;
    case 'regexp':
      return type.test(node.type);
    default:
      throw new TypeError('expected "type" to be an array, string or regexp');
  }
};

utils.hasType = function(node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  if (!Array.isArray(node.nodes)) return false;
  for (var i = 0; i < node.nodes.length; i++)
    if (utils.isType(node.nodes[i], type)) return true;

  return false;
};

utils.firstOfType = function(nodes, type) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (utils.isType(node, type)) return node;
  }
};

utils.findNode = function(nodes, type) {
  return !Array.isArray(nodes)
    ? null
    : typeof type == 'number'
    ? nodes[type]
    : utils.firstOfType(nodes, type);
};

utils.isOpen = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return node.type.slice(-5) === '.open';
};

utils.isClose = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  return node.type.slice(-6) === '.close';
};

utils.hasOpen = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  var first = node.first || node.nodes ? node.nodes[0] : null;
  return !!utils.isNode(first) && first.type === node.type + '.open';
};

utils.hasClose = function(node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  var last = node.last || node.nodes ? node.nodes[node.nodes.length - 1] : null;
  return !!utils.isNode(last) && last.type === node.type + '.close';
};

utils.hasOpenAndClose = function(node) {
  return utils.hasOpen(node) && utils.hasClose(node);
};

utils.addType = function(state, node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  var type = node.parent ? node.parent.type : node.type.replace(/\.open$/, '');

  state.hasOwnProperty('inside') || (state.inside = {});
  state.inside.hasOwnProperty(type) || (state.inside[type] = []);

  var arr = state.inside[type];
  arr.push(node);
  return arr;
};

utils.removeType = function(state, node) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  var type = node.parent ? node.parent.type : node.type.replace(/\.close$/, '');

  if (state.inside.hasOwnProperty(type)) return state.inside[type].pop();
};

utils.isEmpty = function(node, fn) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');

  if (!Array.isArray(node.nodes))
    return node.type !== 'text' ||
      (typeof fn == 'function' ? fn(node, node.parent) : !utils.trim(node.val));

  for (var i = 0; i < node.nodes.length; i++) {
    var child = node.nodes[i];
    if (!utils.isOpen(child) && !utils.isClose(child) && !utils.isEmpty(child, fn))
      return false;
  }

  return true;
};

utils.isInsideType = function(state, type) {
  assert(isObject(state), 'expected state to be an object');
  assert(isString(type), 'expected type to be a string');

  return !!state.hasOwnProperty('inside') && !!state.inside.hasOwnProperty(type) &&
    state.inside[type].length > 0;
};

utils.isInside = function(state, node, type) {
  assert(utils.isNode(node), 'expected node to be an instance of Node');
  assert(isObject(state), 'expected state to be an object');

  if (Array.isArray(type)) {
    for (var i = 0; i < type.length; i++)
      if (utils.isInside(state, node, type[i])) return true;

    return false;
  }

  var parent = node.parent;
  if (typeof type == 'string')
    return (parent && parent.type === type) || utils.isInsideType(state, type);

  if (typeOf(type) === 'regexp') {
    if (parent && parent.type && type.test(parent.type)) return true;

    for (var keys = Object.keys(state.inside), len = keys.length, idx = -1; ++idx < len; ) {
      var key = keys[idx],
        val = state.inside[key];

      if (Array.isArray(val) && val.length !== 0 && type.test(key)) return true;
    }
  }
  return false;
};

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

utils.arrayify = function(val) {
  return typeof val == 'string' && val !== '' ? [val] : Array.isArray(val) ? val : [];
};

utils.stringify = function(val) {
  return utils.arrayify(val).join(',');
};

utils.trim = function(str) {
  return typeof str == 'string' ? str.trim() : '';
};

function isObject(val) {
  return typeOf(val) === 'object';
}

function isString(val) {
  return typeof val == 'string';
}

function isFunction(val) {
  return typeof val == 'function';
}

function isArray(val) {
  return Array.isArray(val);
}

function append(compiler, val, node) {
  return typeof compiler.append != 'function'
    ? compiler.emit(val, node)
    : compiler.append(val, node);
}

function assert(val, message) {
  if (!val) throw new Error(message);
}

},
// 57
function(module, exports, __webpack_require__) {

var extend = Object.assign,
  Snapdragon = __webpack_require__(8),
  compilers = __webpack_require__(19),
  parsers = __webpack_require__(22),
  utils = __webpack_require__(10);

function Braces(options) {
  this.options = extend({}, options);
}

Braces.prototype.init = function(options) {
  if (this.isInitialized) return;
  this.isInitialized = true;
  var opts = utils.createOptions({}, this.options, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(opts);
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon, opts);
  parsers(this.snapdragon, opts);

  utils.define(this.snapdragon, 'parse', /** @this Snapdragon */ function(pattern, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    this.parser.ast.input = pattern;

    for (var stack = this.parser.stack; stack.length; )
      addParent({type: 'brace.close', val: ''}, stack.pop());

    function addParent(node, parent) {
      utils.define(node, 'parent', parent);
      parent.nodes.push(node);
    }

    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });
};

Braces.prototype.parse = function(ast, options) {
  if (ast && typeof ast == 'object' && ast.nodes) return ast;
  this.init(options);
  return this.snapdragon.parse(ast, options);
};

Braces.prototype.compile = function(ast, options) {
  typeof ast == 'string' ? (ast = this.parse(ast, options)) : this.init(options);

  return this.snapdragon.compile(ast, options);
};

Braces.prototype.expand = function(pattern) {
  var ast = this.parse(pattern, {expand: true});
  return this.compile(ast, {expand: true});
};

Braces.prototype.optimize = function(pattern) {
  var ast = this.parse(pattern, {optimize: true});
  return this.compile(ast, {optimize: true});
};

module.exports = Braces;

},
// 58
function(module, exports, __webpack_require__) {

var util = __webpack_require__(2),
  define = __webpack_require__(0),
  CacheBase = __webpack_require__(59),
  Emitter = __webpack_require__(23),
  isObject = __webpack_require__(1),
  merge = __webpack_require__(66),
  pascal = __webpack_require__(69),
  cu = __webpack_require__(70);

function namespace(name) {
  var Cache = name ? CacheBase.namespace(name) : CacheBase,
    fns = [];

  function Base(config, options) {
    if (!(this instanceof Base)) return new Base(config, options);

    Cache.call(this, config);
    this.is('base');
    this.initBase(config, options);
  }

  util.inherits(Base, Cache);

  Emitter(Base);

  Base.prototype.initBase = function(config, options) {
    this.options = merge({}, this.options, options);
    this.cache = this.cache || {};
    this.define('registered', {});
    if (name) this[name] = {};

    this.define('_callbacks', this._callbacks);
    isObject(config) && this.visit('set', config);

    Base.run(this, 'use', fns);
  };

  Base.prototype.is = function(name) {
    if (typeof name != 'string') throw new TypeError('expected name to be a string');

    this.define('is' + pascal(name), true);
    this.define('_name', name);
    this.define('_appname', name);
    return this;
  };

  Base.prototype.isRegistered = function(name, register) {
    if (this.registered.hasOwnProperty(name)) return true;

    if (register !== false) {
      this.registered[name] = true;
      this.emit('plugin', name);
    }
    return false;
  };

  Base.prototype.use = function(fn) {
    fn.call(this, this);
    return this;
  };

  Base.prototype.define = function(key, val) {
    if (isObject(key)) return this.visit('define', key);

    define(this, key, val);
    return this;
  };

  Base.prototype.mixin = function(key, val) {
    Base.prototype[key] = val;
    return this;
  };

  Base.prototype.mixins = Base.prototype.mixins || [];

  Object.defineProperty(Base.prototype, 'base', {
    configurable: true,
    get: function() {
      return this.parent ? this.parent.base : this;
    }
  });

  define(Base, 'use', function(fn) {
    fns.push(fn);
    return Base;
  });

  define(Base, 'run', function(obj, prop, arr) {
    for (var len = arr.length, i = 0; len--; ) obj[prop](arr[i++]);

    return Base;
  });

  define(Base, 'extend', cu.extend(Base, function(Ctor, _Parent) {
    Ctor.prototype.mixins = Ctor.prototype.mixins || [];

    define(Ctor, 'mixin', function(fn) {
      var mixin = fn(Ctor.prototype, Ctor);
      typeof mixin != 'function' || Ctor.prototype.mixins.push(mixin);

      return Ctor;
    });

    define(Ctor, 'mixins', function(Child) {
      Base.run(Child, 'mixin', Ctor.prototype.mixins);
      return Ctor;
    });

    Ctor.prototype.mixin = function(key, value) {
      Ctor.prototype[key] = value;
      return this;
    };
    return Base;
  }));

  define(Base, 'mixin', function(fn) {
    var mixin = fn(Base.prototype, Base);
    typeof mixin != 'function' || Base.prototype.mixins.push(mixin);

    return Base;
  });

  define(Base, 'mixins', function(Child) {
    Base.run(Child, 'mixin', Base.prototype.mixins);
    return Base;
  });

  define(Base, 'inherit', cu.inherit);
  define(Base, 'bubble', cu.bubble);
  return Base;
}

module.exports = namespace();

module.exports.namespace = namespace;

},
// 59
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1),
  Emitter = __webpack_require__(23),
  visit = __webpack_require__(60),
  toPath = __webpack_require__(62),
  union = __webpack_require__(63),
  del = __webpack_require__(64),
  get = __webpack_require__(14),
  set = __webpack_require__(27);

function namespace(prop) {
  function Cache(cache) {
    if (prop) this[prop] = {};

    cache && this.set(cache);
  }

  Emitter(Cache.prototype);

  Cache.prototype.set = function(key, val) {
    if (Array.isArray(key) && arguments.length === 2) key = toPath(key);

    if (isObject(key) || Array.isArray(key)) this.visit('set', key);
    else {
      set(prop ? this[prop] : this, key, val);
      this.emit('set', key, val);
    }
    return this;
  };

  Cache.prototype.union = function(key, val) {
    if (Array.isArray(key) && arguments.length === 2) key = toPath(key);

    var ctx = prop ? this[prop] : this;
    union(ctx, key, arrayify(val));
    this.emit('union', val);
    return this;
  };

  Cache.prototype.get = function(key) {
    key = toPath(arguments);

    var ctx = prop ? this[prop] : this,
      val = get(ctx, key);

    this.emit('get', key, val);
    return val;
  };

  Cache.prototype.has = function(key) {
    key = toPath(arguments);

    var ctx = prop ? this[prop] : this,
      has = get(ctx, key) !== void 0;

    this.emit('has', key, has);
    return has;
  };

  Cache.prototype.del = function(key) {
    if (Array.isArray(key)) this.visit('del', key);
    else {
      del(prop ? this[prop] : this, key);
      this.emit('del', key);
    }
    return this;
  };

  Cache.prototype.clear = function() {
    if (prop) this[prop] = {};
  };

  Cache.prototype.visit = function(method, val) {
    visit(this, method, val);
    return this;
  };

  return Cache;
}

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

module.exports = namespace();

module.exports.namespace = namespace;

},
// 60
function(module, exports, __webpack_require__) {

var visit = __webpack_require__(24),
  mapVisit = __webpack_require__(61);

module.exports = function(collection, method, val) {
  var result;

  if (typeof val == 'string' && method in collection) {
    var args = [].slice.call(arguments, 2);
    result = collection[method].apply(collection, args);
  } else
    result = Array.isArray(val)
      ? mapVisit.apply(null, arguments)
      : visit.apply(null, arguments);

  return result !== void 0 ? result : collection;
};

},
// 61
function(module, exports, __webpack_require__) {

var util = __webpack_require__(2),
  visit = __webpack_require__(24);

module.exports = function(collection, method, val) {
  if (isObject(val)) return visit.apply(null, arguments);

  if (!Array.isArray(val))
    throw new TypeError('expected an array: ' + util.inspect(val));

  for (var args = [].slice.call(arguments, 3), i = 0; i < val.length; i++) {
    var ele = val[i];
    isObject(ele)
      ? visit.apply(null, [collection, method, ele].concat(args))
      : collection[method].apply(collection, [ele].concat(args));
  }
};

function isObject(val) {
  return val &&
    (typeof val == 'function' || (!Array.isArray(val) && typeof val == 'object'));
}

},
// 62
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(7);

module.exports = function(args) {
  if (typeOf(args) !== 'arguments') args = arguments;

  return filter(args).join('.');
};

function filter(arr) {
  var res = [];

  for (var len = arr.length, idx = -1; ++idx < len; ) {
    var ele = arr[idx];
    typeOf(ele) === 'arguments' || Array.isArray(ele)
      ? res.push.apply(res, filter(ele))
      : typeof ele != 'string' || res.push(ele);
  }
  return res;
}

},
// 63
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(25),
  union = __webpack_require__(26),
  get = __webpack_require__(14),
  set = __webpack_require__(27);

module.exports = function(obj, prop, value) {
  if (!isObject(obj))
    throw new TypeError('union-value expects the first argument to be an object.');

  if (typeof prop != 'string')
    throw new TypeError('union-value expects `prop` to be a string.');

  var arr = arrayify(get(obj, prop));
  set(obj, prop, union(arr, arrayify(value)));
  return obj;
};

function arrayify(val) {
  return val === null || val === void 0 ? [] : Array.isArray(val) ? val : [val];
}

},
// 64
function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(1),
  has = __webpack_require__(29);

module.exports = function(obj, prop) {
  if (!isObject(obj)) throw new TypeError('expected an object.');

  if (obj.hasOwnProperty(prop)) {
    delete obj[prop];
    return true;
  }

  if (has(obj, prop)) {
    var segs = prop.split('.'),
      last = segs.pop();
    while (segs.length && segs[segs.length - 1].slice(-1) === '\\')
      last = segs.pop().slice(0, -1) + '.' + last;

    while (segs.length) obj = obj[(prop = segs.shift())];
    return delete obj[last];
  }
  return true;
};

},
// 65
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(7),
  isNumber = __webpack_require__(13);

module.exports = function hasValue(val) {
  if (isNumber(val)) return true;

  switch (typeOf(val)) {
    case 'null':
    case 'boolean':
    case 'function':
      return true;
    case 'string':
    case 'arguments':
      return val.length !== 0;
    case 'error':
      return val.message !== '';
    case 'array':
      var len = val.length;
      if (len === 0) return false;

      for (var i = 0; i < len; i++) if (hasValue(val[i])) return true;
      return false;
    case 'file':
    case 'map':
    case 'set':
      return val.size !== 0;
    case 'object':
      var keys = Object.keys(val);
      if (keys.length === 0) return false;

      for (i = 0; i < keys.length; i++) if (hasValue(val[keys[i]])) return true;
      return false;
    default:
      return false;
  }
};

},
// 66
function(module, exports, __webpack_require__) {

var isExtendable = __webpack_require__(67),
  forIn = __webpack_require__(68);

function mixinDeep(target, objects) {
  for (var len = arguments.length, i = 0; ++i < len; ) {
    var obj = arguments[i];
    isObject(obj) && forIn(obj, copy, target);
  }
  return target;
}

function copy(val, key) {
  if (!isValidKey(key)) return;

  var obj = this[key];
  isObject(val) && isObject(obj) ? mixinDeep(obj, val) : (this[key] = val);
}

function isObject(val) {
  return isExtendable(val) && !Array.isArray(val);
}

function isValidKey(key) {
  return key !== '__proto__' && key !== 'constructor' && key !== 'prototype';
}

module.exports = mixinDeep;

},
// 67
function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(28);

module.exports = function(val) {
  return isPlainObject(val) || typeof val == 'function' || Array.isArray(val);
};

},
// 68
function(module) {

module.exports = function(obj, fn, thisArg) {
  for (var key in obj) if (fn.call(thisArg, obj[key], key, obj) === false) break;
};

},
// 69
function(module) {

function pascalcase(str) {
  if (typeof str != 'string') throw new TypeError('expected a string.');

  return (str = str.replace(/([A-Z])/g, ' $1')).length === 1
    ? str.toUpperCase()
    : ((str = str.replace(/^[\W_]+|[\W_]+$/g, '').toLowerCase()).charAt(0).toUpperCase() +
        str.slice(1)).replace(/[\W_]+(\w|$)/g, function(_, ch) {
        return ch.toUpperCase();
      });
}

module.exports = pascalcase;

},
// 70
function(module, exports, __webpack_require__) {

var union = __webpack_require__(26),
  define = __webpack_require__(0),
  staticExtend = __webpack_require__(71),
  isObj = __webpack_require__(1),

  cu = module.exports;

cu.isObject = function(val) {
  return isObj(val) || typeof val == 'function';
};

cu.has = function(obj, val) {
  var len = (val = cu.arrayify(val)).length;

  if (cu.isObject(obj)) {
    for (var key in obj) if (val.indexOf(key) > -1) return true;

    var keys = cu.nativeKeys(obj);
    return cu.has(keys, val);
  }

  if (Array.isArray(obj)) {
    while (len--) if (obj.indexOf(val[len]) > -1) return true;

    return false;
  }

  throw new TypeError('expected an array or object.');
};

cu.hasAll = function(val, values) {
  for (var len = (values = cu.arrayify(values)).length; len--; )
    if (!cu.has(val, values[len])) return false;

  return true;
};

cu.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

cu.noop = function() {};

cu.identity = function(val) {
  return val;
};

cu.hasConstructor = function(val) {
  return cu.isObject(val) && val.constructor !== void 0;
};

cu.nativeKeys = function(val) {
  if (!cu.hasConstructor(val)) return [];
  var keys = Object.getOwnPropertyNames(val);
  'caller' in val && keys.push('caller');
  return keys;
};

cu.getDescriptor = function(obj, key) {
  if (!cu.isObject(obj)) throw new TypeError('expected an object.');

  if (typeof key != 'string') throw new TypeError('expected key to be a string.');

  return Object.getOwnPropertyDescriptor(obj, key);
};

cu.copyDescriptor = function(receiver, provider, name) {
  if (!cu.isObject(receiver))
    throw new TypeError('expected receiving object to be an object.');

  if (!cu.isObject(provider))
    throw new TypeError('expected providing object to be an object.');

  if (typeof name != 'string') throw new TypeError('expected name to be a string.');

  var val = cu.getDescriptor(provider, name);
  val && Object.defineProperty(receiver, name, val);
};

cu.copy = function(receiver, provider, omit) {
  if (!cu.isObject(receiver))
    throw new TypeError('expected receiving object to be an object.');

  if (!cu.isObject(provider))
    throw new TypeError('expected providing object to be an object.');

  var key,
    props = Object.getOwnPropertyNames(provider),
    keys = Object.keys(provider),
    len = props.length;
  omit = cu.arrayify(omit);

  while (len--) {
    key = props[len];

    cu.has(keys, key)
      ? define(receiver, key, provider[key])
      : key in receiver || cu.has(omit, key) ||
        cu.copyDescriptor(receiver, provider, key);
  }
};

cu.inherit = function(receiver, provider, omit) {
  if (!cu.isObject(receiver))
    throw new TypeError('expected receiving object to be an object.');

  if (!cu.isObject(provider))
    throw new TypeError('expected providing object to be an object.');

  var keys = [];
  for (var key in provider) {
    keys.push(key);
    receiver[key] = provider[key];
  }

  keys = keys.concat(cu.arrayify(omit));

  var a = provider.prototype || provider,
    b = receiver.prototype || receiver;
  cu.copy(b, a, keys);
};

cu.extend = function() {
  return staticExtend.apply(null, arguments);
};

cu.bubble = function(Parent, events) {
  events = events || [];
  Parent.bubble = function(Child, arr) {
    if (Array.isArray(arr)) events = union([], events, arr);

    for (var len = events.length, idx = -1; ++idx < len; ) {
      var name = events[idx];
      Parent.on(name, Child.emit.bind(Child, name));
    }
    cu.bubble(Child, events);
  };
};

},
// 71
function(module, exports, __webpack_require__) {

var copy = __webpack_require__(72),
  define = __webpack_require__(0),
  util = __webpack_require__(2);

function extend(Parent, extendFn) {
  if (typeof Parent != 'function')
    throw new TypeError('expected Parent to be a function.');

  return function(Ctor, proto) {
    if (typeof Ctor != 'function')
      throw new TypeError('expected Ctor to be a function.');

    util.inherits(Ctor, Parent);
    copy(Ctor, Parent);

    if (typeof proto == 'object') {
      var obj = Object.create(proto);

      for (var k in obj) Ctor.prototype[k] = obj[k];
    }

    define(Ctor.prototype, '_parent_', {
      configurable: true,
      set: function() {},
      get: function() {
        return Parent.prototype;
      }
    });

    typeof extendFn != 'function' || extendFn(Ctor, Parent);

    Ctor.extend = extend(Ctor, extendFn);
  };
}

module.exports = extend;

},
// 72
function(module, exports, __webpack_require__) {

var typeOf = __webpack_require__(7),
  copyDescriptor = __webpack_require__(73),
  define = __webpack_require__(0);

function copy(receiver, provider, omit) {
  if (!isObject(receiver))
    throw new TypeError('expected receiving object to be an object.');

  if (!isObject(provider))
    throw new TypeError('expected providing object to be an object.');

  var props = nativeKeys(provider),
    keys = Object.keys(provider),
    len = props.length;
  omit = arrayify(omit);

  while (len--) {
    var key = props[len];

    has(keys, key)
      ? define(receiver, key, provider[key])
      : key in receiver || has(omit, key) || copyDescriptor(receiver, provider, key);
  }
}

function isObject(val) {
  return typeOf(val) === 'object' || typeof val == 'function';
}

function has(obj, val) {
  var len = (val = arrayify(val)).length;

  if (isObject(obj)) {
    for (var key in obj) if (val.indexOf(key) > -1) return true;

    return has(nativeKeys(obj), val);
  }

  if (Array.isArray(obj)) {
    while (len--) if (obj.indexOf(val[len]) > -1) return true;

    return false;
  }

  throw new TypeError('expected an array or object.');
}

function arrayify(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
}

function hasConstructor(val) {
  return isObject(val) && val.constructor !== void 0;
}

function nativeKeys(val) {
  return hasConstructor(val) ? Object.getOwnPropertyNames(val) : [];
}

module.exports = copy;

module.exports.has = has;

},
// 73
function(module) {

module.exports = function(receiver, provider, from, to) {
  if (!isObject(provider) && typeof provider != 'function') {
    to = from;
    from = provider;
    provider = receiver;
  }
  if (!isObject(receiver) && typeof receiver != 'function')
    throw new TypeError('expected the first argument to be an object');

  if (!isObject(provider) && typeof provider != 'function')
    throw new TypeError('expected provider to be an object');

  if (typeof to != 'string') to = from;

  if (typeof from != 'string') throw new TypeError('expected key to be a string');

  if (!(from in provider)) throw new Error('property "' + from + '" does not exist');

  var val = Object.getOwnPropertyDescriptor(provider, from);
  val && Object.defineProperty(receiver, to, val);
};

function isObject(val) {
  return {}.toString.call(val) === '[object Object]';
}

},
// 74
function(module, exports, __webpack_require__) {

var use = __webpack_require__(30),
  define = __webpack_require__(0),
  debug = __webpack_require__(15)('snapdragon:compiler'),
  utils = __webpack_require__(11);

function Compiler(options, state) {
  debug('initializing', __filename);
  this.options = utils.extend({source: 'string'}, options);
  this.state = state || {};
  this.compilers = {};
  this.output = '';
  this.set('eos', function(node) {
    return this.emit(node.val, node);
  });
  this.set('noop', function(node) {
    return this.emit(node.val, node);
  });
  this.set('bos', function(node) {
    return this.emit(node.val, node);
  });
  use(this);
}

Compiler.prototype = {
  error: function(msg, node) {
    var pos = node.position || {start: {column: 0}},
      message = this.options.source + ' column:' + pos.start.column + ': ' + msg,

      err = new Error(message);
    err.reason = msg;
    err.column = pos.start.column;
    err.source = this.pattern;

    if (!this.options.silent) throw err;

    this.errors.push(err);
  },

  define: function(key, val) {
    define(this, key, val);
    return this;
  },

  emit: function(str, _node) {
    this.output += str;
    return str;
  },

  set: function(name, fn) {
    this.compilers[name] = fn;
    return this;
  },

  get: function(name) {
    return this.compilers[name];
  },

  prev: function(n) {
    return this.ast.nodes[this.idx - (n || 1)] || { type: 'bos', val: '' };
  },

  next: function(n) {
    return this.ast.nodes[this.idx + (n || 1)] || { type: 'eos', val: '' };
  },

  visit: function(node, nodes, i) {
    var fn = this.compilers[node.type];
    this.idx = i;

    if (typeof fn != 'function')
      throw this.error('compiler "' + node.type + '" is not registered', node);

    return fn.call(this, node, nodes, i);
  },

  mapVisit: function(nodes) {
    if (!Array.isArray(nodes)) throw new TypeError('expected an array');

    for (var len = nodes.length, idx = -1; ++idx < len; )
      this.visit(nodes[idx], nodes, idx);

    return this;
  },

  compile: function(ast, options) {
    var opts = utils.extend({}, this.options, options);
    this.ast = ast;
    this.parsingErrors = this.ast.errors;
    this.output = '';

    if (opts.sourcemap) {
      __webpack_require__(89)(this);
      this.mapVisit(this.ast.nodes);
      this.applySourceMaps();
      this.map = opts.sourcemap === 'generator' ? this.map : this.map.toJSON();
      return this;
    }

    this.mapVisit(this.ast.nodes);
    return this;
  }
};

module.exports = Compiler;

},
// 75
function(module, exports, __webpack_require__) {

(exports = module.exports = __webpack_require__(31)).log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
/** @var {*} chrome */
exports.storage = 'undefined' != typeof chrome && void 0 !== chrome.storage
  ? chrome.storage.local
  : localstorage();

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

function useColors() {
  return (
    (typeof window != 'undefined' && !!window.process && window.process.type === 'renderer') ||
    (typeof document != 'undefined' && document.documentElement &&
      document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    (typeof window != 'undefined' && window.console &&
      (window.console.firebug || (window.console.exception && window.console.table))) ||
    (typeof navigator != 'undefined' && navigator.userAgent &&
      /Firefox\/(3[1-9]|[4-9]\d|\d{3,})|AppleWebKit\/\d+/i.test(navigator.userAgent))
  );
}

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '') +
    this.namespace +
    (useColors ? ' %c' : ' ') +
    args[0] +
    (useColors ? '%c ' : ' ') +
    '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  var index = 0,
    lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) lastC = index;
  });

  args.splice(lastC, 0, c);
}

function log() {
  return 'object' == typeof console &&
    console.log &&
    Function.prototype.apply.call(console.log, console, arguments);
}

function save(namespaces) {
  try {
    null == namespaces
      ? exports.storage.removeItem('debug')
      : (exports.storage.debug = namespaces);
  } catch (_) {}
}

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch (_) {}

  if (!r && typeof process != 'undefined' && 'env' in process)
    r = process.env.DEBUG;

  return r;
}

exports.enable(load());

function localstorage() {
  try {
    return window.localStorage;
  } catch (_) {}
}

},
// 76
function(module) {

var s = 1000,
  m = s * 60,
  h = m * 60,
  d = h * 24,
  y = d * 365.25;

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) return parse(val);
  if (type === 'number' && isNaN(val) === false)
    return options.long ? fmtLong(val) : fmtShort(val);

  throw new Error(
    'val is not a non-empty string or a valid number. val=' + JSON.stringify(val)
  );
};

function parse(str) {
  if ((str = String(str)).length > 100) return;

  var match =
    /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;

  var n = parseFloat(match[1]);
  switch ((match[2] || 'ms').toLowerCase()) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return void 0;
  }
}

function fmtShort(ms) {
  return ms >= d
    ? Math.round(ms / d) + 'd'
    : ms >= h
    ? Math.round(ms / h) + 'h'
    : ms >= m
    ? Math.round(ms / m) + 'm'
    : ms >= s
    ? Math.round(ms / s) + 's'
    : ms + 'ms';
}

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

function plural(ms, n, name) {
  if (ms >= n)
    return ms < n * 1.5
      ? Math.floor(ms / n) + ' ' + name
      : Math.ceil(ms / n) + ' ' + name + 's';
}

},
// 77
function(module, exports, __webpack_require__) {

var tty = __webpack_require__(78),
  util = __webpack_require__(2);

/** @memberof exports */
(exports = module.exports = __webpack_require__(31)).init = init;
exports.log = log;
exports.formatArgs = formatArgs;
/** @memberof exports */
exports.save = save;
exports.load = load;
/** @memberof exports */
exports.useColors = useColors;

exports.colors = [6, 2, 3, 4, 5, 1];

exports.inspectOpts = Object.keys(process.env).filter(function(key) {
  return /^debug_/i.test(key);
}).reduce(function(obj, key) {
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function(_, k) { return k.toUpperCase(); });

  var val = process.env[key];
  val = !!/^(yes|on|true|enabled)$/i.test(val) ||
    (!/^(no|off|false|disabled)$/i.test(val) && (val === 'null' ? null : Number(val)));

  obj[prop] = val;
  return obj;
}, {});

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

1 === fd || 2 === fd ||
  util.deprecate(function() {},
    'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)'
  )();

var stream =
  1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim();
    }).join(' ');
};

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

function formatArgs(args) {
  var name = this.namespace;

  if (this.useColors) {
    var c = this.color,
      prefix = '  \x1b[3' + c + ';1m' + name + ' \x1b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\x1b[3' + c + 'm+' + exports.humanize(this.diff) + '\x1b[0m');
  } else args[0] = new Date().toUTCString() + ' ' + name + ' ' + args[0];
}

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

function save(namespaces) {
  null == namespaces ? delete process.env.DEBUG : (process.env.DEBUG = namespaces);
}

function load() {
  return process.env.DEBUG;
}

function createWritableStdioStream(fd) {
  var stream;

  // noinspection JSUnresolvedFunction
  switch (process.binding('tty_wrap').guessHandleType(fd)) {
    case 'TTY':
      (stream = new tty.WriteStream(fd))._type = 'tty';

      stream._handle && stream._handle.unref && stream._handle.unref();

      break;

    case 'FILE':
      stream = new (__webpack_require__(32).SyncWriteStream)(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      stream = new (__webpack_require__(79).Socket)({ fd: fd, readable: false, writable: true });

      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      stream._handle && stream._handle.unref && stream._handle.unref();

      break;

    default:
      throw new Error('Implement me. Unknown stream file type!');
  }

  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

function init(debug) {
  debug.inspectOpts = {};

  for (var keys = Object.keys(exports.inspectOpts), i = 0; i < keys.length; i++)
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
}

exports.enable(load());

},
// 78
function(module) {

module.exports = require('tty');

},
// 79
function(module) {

module.exports = require('net');

},
// 80
function(module) {

module.exports = require('./source-map');

},
// 81
function(module, exports, __webpack_require__) {

var sourceMappingURL = __webpack_require__(82),

  resolveUrl = __webpack_require__(83),
  decodeUriComponent = __webpack_require__(85),
  urix = __webpack_require__(87),
  atob = __webpack_require__(88)

function callbackAsync(callback, error, result) {
  setImmediate(function() { callback(error, result) })
}

function parseMapToJSON(string, data) {
  try {
    return JSON.parse(string.replace(/^\)]}'/, ''))
  } catch (error) {
    error.sourceMapData = data
    throw error
  }
}

function readSync(read, url, data) {
  var readUrl = decodeUriComponent(url)
  try {
    return String(read(readUrl))
  } catch (error) {
    error.sourceMapData = data
    throw error
  }
}

function resolveSourceMap(code, codeUrl, read, callback) {
  var mapData
  try {
    mapData = resolveSourceMapHelper(code, codeUrl)
  } catch (error) {
    return callbackAsync(callback, error)
  }
  if (!mapData || mapData.map) return callbackAsync(callback, null, mapData)

  read(decodeUriComponent(mapData.url), function(error, result) {
    if (error) {
      error.sourceMapData = mapData
      return callback(error)
    }
    mapData.map = String(result)
    try {
      mapData.map = parseMapToJSON(mapData.map, mapData)
    } catch (error) {
      return callback(error)
    }
    callback(null, mapData)
  })
}

function resolveSourceMapSync(code, codeUrl, read) {
  var mapData = resolveSourceMapHelper(code, codeUrl)
  if (!mapData || mapData.map) return mapData

  mapData.map = readSync(read, mapData.url, mapData)
  mapData.map = parseMapToJSON(mapData.map, mapData)
  return mapData
}

var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/,

  jsonMimeTypeRegex = /^(?:application|text)\/json$/,

  jsonCharacterEncoding = 'utf-8'

function base64ToBuf(b64) {
  var binStr = atob(b64),
    len = binStr.length,
    arr = new Uint8Array(len)
  for (var i = 0; i < len; i++) arr[i] = binStr.charCodeAt(i)

  return arr
}

function decodeBase64String(b64) {
  if (typeof TextDecoder == 'undefined' || typeof Uint8Array == 'undefined')
    return atob(b64)

  var buf = base64ToBuf(b64)
  return new TextDecoder(jsonCharacterEncoding, {fatal: true}).decode(buf)
}

function resolveSourceMapHelper(code, codeUrl) {
  codeUrl = urix(codeUrl)

  var url = sourceMappingURL.getFrom(code)
  if (!url) return null

  var dataUri = url.match(dataUriRegex)
  if (dataUri) {
    var mimeType = dataUri[1] || 'text/plain',
      lastParameter = dataUri[2] || '',
      encoded = dataUri[3] || ''
    var data = {
      sourceMappingURL: url,
      url: null,
      sourcesRelativeTo: codeUrl,
      map: encoded
    }
    if (!jsonMimeTypeRegex.test(mimeType)) {
      var error = new Error('Unuseful data uri mime type: ' + mimeType)
      error.sourceMapData = data
      throw error
    }
    try {
      data.map = parseMapToJSON(
        lastParameter === ';base64' ? decodeBase64String(encoded) : decodeURIComponent(encoded),
        data
      )
    } catch (error) {
      error.sourceMapData = data
      throw error
    }
    return data
  }

  var mapUrl = resolveUrl(codeUrl, url)
  return { sourceMappingURL: url, url: mapUrl, sourcesRelativeTo: mapUrl, map: null }
}

function resolveSources(map, mapUrl, read, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }
  var pending = map.sources ? map.sources.length : 0,
    result = { sourcesResolved: [], sourcesContent: [] }

  if (pending === 0) {
    callbackAsync(callback, null, result)
    return
  }

  var done = function() {
    --pending != 0 || callback(null, result)
  }

  resolveSourcesHelper(map, mapUrl, options, function(fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl
    if (typeof sourceContent == 'string') {
      result.sourcesContent[index] = sourceContent
      callbackAsync(done, null)
    } else {
      var readUrl = decodeUriComponent(fullUrl)
      read(readUrl, function(error, source) {
        result.sourcesContent[index] = error || String(source)
        done()
      })
    }
  })
}

function resolveSourcesSync(map, mapUrl, read, options) {
  var result = { sourcesResolved: [], sourcesContent: [] }

  if (!map.sources || map.sources.length === 0) return result

  resolveSourcesHelper(map, mapUrl, options, function(fullUrl, sourceContent, index) {
    result.sourcesResolved[index] = fullUrl
    if (read !== null)
      if (typeof sourceContent == 'string')
        result.sourcesContent[index] = sourceContent
      else {
        var readUrl = decodeUriComponent(fullUrl)
        try {
          result.sourcesContent[index] = String(read(readUrl))
        } catch (error) {
          result.sourcesContent[index] = error
        }
      }
  })

  return result
}

var endingSlash = /\/?$/

function resolveSourcesHelper(map, mapUrl, options, fn) {
  options = options || {}
  mapUrl = urix(mapUrl)
  for (var sourceRoot, index = 0, len = map.sources.length; index < len; index++) {
    sourceRoot =
      typeof options.sourceRoot == 'string'
      ? options.sourceRoot
      : typeof map.sourceRoot == 'string' && options.sourceRoot !== false
      ? map.sourceRoot
      : null

    fn(
      sourceRoot === null || sourceRoot === ''
        ? resolveUrl(mapUrl, map.sources[index])
        : resolveUrl(mapUrl, sourceRoot.replace(endingSlash, '/'), map.sources[index]),
      (map.sourcesContent || [])[index],
      index
    )
  }
}

function resolve(code, codeUrl, read, options, callback) {
  if (typeof options == 'function') {
    callback = options
    options = {}
  }
  if (code === null) {
    var data = {
      sourceMappingURL: null,
      url: codeUrl,
      sourcesRelativeTo: codeUrl,
      map: null
    }
    var readUrl = decodeUriComponent(codeUrl)
    read(readUrl, function(error, result) {
      if (error) {
        error.sourceMapData = data
        return callback(error)
      }
      data.map = String(result)
      try {
        data.map = parseMapToJSON(data.map, data)
      } catch (error) {
        return callback(error)
      }
      _resolveSources(data)
    })
  } else
    resolveSourceMap(code, codeUrl, read, function(error, mapData) {
      if (error) return callback(error)

      if (!mapData) return callback(null, null)

      _resolveSources(mapData)
    })

  function _resolveSources(mapData) {
    resolveSources(mapData.map, mapData.sourcesRelativeTo, read, options, function(error, result) {
      if (error) return callback(error)

      mapData.sourcesResolved = result.sourcesResolved
      mapData.sourcesContent = result.sourcesContent
      callback(null, mapData)
    })
  }
}

function resolveSync(code, codeUrl, read, options) {
  var mapData
  if (code === null) {
    mapData = {
      sourceMappingURL: null,
      url: codeUrl,
      sourcesRelativeTo: codeUrl,
      map: null
    }
    mapData.map = readSync(read, codeUrl, mapData)
    mapData.map = parseMapToJSON(mapData.map, mapData)
  } else if (!(mapData = resolveSourceMapSync(code, codeUrl, read))) return null

  var result = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read, options)
  mapData.sourcesResolved = result.sourcesResolved
  mapData.sourcesContent = result.sourcesContent
  return mapData
}

module.exports = {
  resolveSourceMap: resolveSourceMap,
  resolveSourceMapSync: resolveSourceMapSync,
  resolveSources: resolveSources,
  resolveSourcesSync: resolveSourcesSync,
  resolve: resolve,
  resolveSync: resolveSync,
  parseMapToJSON: parseMapToJSON
}

},
// 82
function(module) {

var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/

var regex = RegExp(
  '(?:/\\*(?:\\s*\r?\n(?://)?)?(?:' + innerRegex.source +
  ')\\s*\\*/|//(?:' + innerRegex.source + '))\\s*'
)

module.exports = {
  regex: regex,
  _innerRegex: innerRegex,

  getFrom: function(code) {
    var match = code.match(regex)
    return match ? match[1] || match[2] || '' : null
  },

  existsIn: function(code) {
    return regex.test(code)
  },

  removeFrom: function(code) {
    return code.replace(regex, '')
  },

  insertBefore: function(code, string) {
    var match = code.match(regex)
    return match
      ? code.slice(0, match.index) + string + code.slice(match.index)
      : code + string
  }
}

},
// 83
function(module, exports, __webpack_require__) {

var url = __webpack_require__(84)

function resolveUrl() {
  return Array.prototype.reduce.call(arguments, function(resolved, nextUrl) {
    return url.resolve(resolved, nextUrl)
  })
}

module.exports = resolveUrl

},
// 84
function(module) {

module.exports = require('url');

},
// 85
function(module, exports, __webpack_require__) {

var decodeUriComponent = __webpack_require__(86)

function customDecodeUriComponent(string) {
  return decodeUriComponent(string.replace(/\+/g, '%2B'))
}

module.exports = customDecodeUriComponent

},
// 86
function(module) {

var token = '%[a-f0-9]{2}',
  singleMatcher = new RegExp(token, 'gi'),
  multiMatcher = new RegExp('(' + token + ')+', 'gi');

function decodeComponents(components, split) {
  try {
    return decodeURIComponent(components.join(''));
  } catch (_) {}

  if (components.length === 1) return components;

  split = split || 1;

  var left = components.slice(0, split),
    right = components.slice(split);

  return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
}

function decode(input) {
  try {
    return decodeURIComponent(input);
  } catch (_err) {
    for (var tokens = input.match(singleMatcher), i = 1; i < tokens.length; i++)
      tokens = (input = decodeComponents(tokens, i).join('')).match(singleMatcher);

    return input;
  }
}

function customDecodeURIComponent(input) {
  var replaceMap = { '%FE%FF': '\uFFFD\uFFFD', '%FF%FE': '\uFFFD\uFFFD' };

  for (var match = multiMatcher.exec(input); match; ) {
    try {
      replaceMap[match[0]] = decodeURIComponent(match[0]);
    } catch (_err) {
      var result = decode(match[0]);

      if (result !== match[0]) replaceMap[match[0]] = result;
    }

    match = multiMatcher.exec(input);
  }

  replaceMap['%C2'] = '\uFFFD';

  for (var entries = Object.keys(replaceMap), i = 0; i < entries.length; i++) {
    var key = entries[i];
    input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  }

  return input;
}

module.exports = function(encodedURI) {
  if (typeof encodedURI != 'string')
    throw new TypeError(
      'Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`'
    );

  try {
    encodedURI = encodedURI.replace(/\+/g, ' ');

    return decodeURIComponent(encodedURI);
  } catch (_err) {
    return customDecodeURIComponent(encodedURI);
  }
};

},
// 87
function(module, exports, __webpack_require__) {

var path = __webpack_require__(12)

function urix(aPath) {
  return path.sep === '\\'
    ? aPath.replace(/\\/g, '/').replace(/^[a-z]:\/?/i, '/')
    : aPath
}

module.exports = urix

},
// 88
function(module) {

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

module.exports = atob.atob = atob;

},
// 89
function(module, exports, __webpack_require__) {

var fs = __webpack_require__(32),
  path = __webpack_require__(12),
  define = __webpack_require__(0),
  utils = __webpack_require__(11);

module.exports = mixin;

function mixin(compiler) {
  /**
   * @method _comment
   * @memberof compiler
   */
  define(compiler, '_comment', compiler.comment);
  compiler.map = new utils.SourceMap.SourceMapGenerator();
  compiler.position = { line: 1, column: 1 };
  compiler.content = {};
  compiler.files = {};

  for (var key in exports) define(compiler, key, exports[key]);
}

exports.updatePosition = function(str) {
  var lines = str.match(/\n/g);
  if (lines) this.position.line += lines.length;
  var i = str.lastIndexOf('\n');
  this.position.column = ~i ? str.length - i : this.position.column + str.length;
};

exports.emit = function(str, node) {
  var position = node.position || {},
    source = position.source;
  if (source) {
    if (position.filepath) source = utils.unixify(position.filepath);

    this.map.addMapping({
      source: source,
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: { line: position.start.line, column: position.start.column - 1 }
    });

    position.content && this.addContent(source, position);
    position.filepath && this.addFile(source, position);

    this.updatePosition(str);
    this.output += str;
  }
  return str;
};

exports.addFile = function(file, position) {
  typeof position.content != 'string' ||
    Object.prototype.hasOwnProperty.call(this.files, file) ||
    (this.files[file] = position.content);
};

exports.addContent = function(source, position) {
  typeof position.content != 'string' ||
    Object.prototype.hasOwnProperty.call(this.content, source) ||
    this.map.setSourceContent(source, position.content);
};

exports.applySourceMaps = function() {
  Object.keys(this.files).forEach(function(file) {
    var content = this.files[file];
    this.map.setSourceContent(file, content);

    if (this.options.inputSourcemaps === true) {
      var originalMap = utils.sourceMapResolve.resolveSync(content, file, fs.readFileSync);
      if (originalMap) {
        var map = new utils.SourceMap.SourceMapConsumer(originalMap.map),
          relativeTo = originalMap.sourcesRelativeTo;
        this.map.applySourceMap(map, file, utils.unixify(path.dirname(relativeTo)));
      }
    }
  }, this);
};

exports.comment = function(node) {
  return /^# sourceMappingURL=/.test(node.comment)
    ? this.emit('', node.position)
    : this._comment(node);
};

},
// 90
function(module, exports, __webpack_require__) {

var use = __webpack_require__(30),
  util = __webpack_require__(2),
  Cache = __webpack_require__(33),
  define = __webpack_require__(0),
  debug = __webpack_require__(15)('snapdragon:parser'),
  Position = __webpack_require__(91),
  utils = __webpack_require__(11);

function Parser(options) {
  debug('initializing', __filename);
  this.options = utils.extend({source: 'string'}, options);
  this.init(this.options);
  use(this);
}

Parser.prototype = {
  constructor: Parser,

  init: function(_options) {
    this.orig = '';
    this.input = '';
    this.parsed = '';

    this.column = 1;
    this.line = 1;

    this.regex = new Cache();
    this.errors = this.errors || [];
    this.parsers = this.parsers || {};
    this.types = this.types || [];
    this.sets = this.sets || {};
    this.fns = this.fns || [];
    this.currentType = 'root';

    var pos = this.position();
    this.bos = pos({type: 'bos', val: ''});

    this.ast = { type: 'root', errors: this.errors, nodes: [this.bos] };

    define(this.bos, 'parent', this.ast);
    this.nodes = [this.ast];

    this.count = 0;
    this.setCount = 0;
    this.stack = [];
  },

  error: function(msg, node) {
    var pos = node.position || {start: {column: 0, line: 0}},
      line = pos.start.line,
      column = pos.start.column,
      source = this.options.source,

      err = new Error(source + ' <line:' + line + ' column:' + column + '>: ' + msg);
    err.source = source;
    err.reason = msg;
    err.pos = pos;

    if (!this.options.silent) throw err;

    this.errors.push(err);
  },

  define: function(key, val) {
    define(this, key, val);
    return this;
  },

  position: function() {
    var start = { line: this.line, column: this.column },
      self = this;

    return function(node) {
      define(node, 'position', new Position(start, self));
      return node;
    };
  },

  set: function(type, fn) {
    this.types.indexOf(type) > -1 || this.types.push(type);

    this.parsers[type] = fn.bind(this);
    return this;
  },

  get: function(name) {
    return this.parsers[name];
  },

  push: function(type, token) {
    this.sets[type] = this.sets[type] || [];
    this.count++;
    this.stack.push(token);
    return this.sets[type].push(token);
  },

  pop: function(type) {
    this.sets[type] = this.sets[type] || [];
    this.count--;
    this.stack.pop();
    return this.sets[type].pop();
  },

  isInside: function(type) {
    this.sets[type] = this.sets[type] || [];
    return this.sets[type].length > 0;
  },

  isType: function(node, type) {
    return node && node.type === type;
  },

  prev: function(n) {
    return this.stack.length > 0
      ? utils.last(this.stack, n)
      : utils.last(this.nodes, n);
  },

  consume: function(len) {
    this.input = this.input.substr(len);
  },

  updatePosition: function(str, len) {
    var lines = str.match(/\n/g);
    if (lines) this.line += lines.length;
    var i = str.lastIndexOf('\n');
    this.column = ~i ? len - i : this.column + len;
    this.parsed += str;
    this.consume(len);
  },

  match: function(regex) {
    var m = regex.exec(this.input);
    if (m) {
      this.updatePosition(m[0], m[0].length);
      return m;
    }
  },

  capture: function(type, regex) {
    if (typeof regex == 'function') return this.set.apply(this, arguments);

    this.regex.set(type, regex);
    this.set(type, function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(regex);
      if (!m || !m[0]) return;

      var prev = this.prev(),
        node = pos({ type: type, val: m[0], parsed: parsed, rest: this.input });

      if (m[1]) node.inner = m[1];

      define(node, 'inside', this.stack.length > 0);
      define(node, 'parent', prev);
      prev.nodes.push(node);
    }.bind(this));
    return this;
  },

  capturePair: function(type, openRegex, closeRegex, fn) {
    this.sets[type] = this.sets[type] || [];

    this.set(type + '.open', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(openRegex);
      if (!m || !m[0]) return;

      var val = m[0];
      this.setCount++;
      this.specialChars = true;
      var open = pos({ type: type + '.open', val: val, rest: this.input });

      if (m[1] !== void 0) open.inner = m[1];

      var prev = this.prev(),
        node = pos({ type: type, nodes: [open] });

      define(node, 'rest', this.input);
      define(node, 'parsed', parsed);
      define(node, 'prefix', m[1]);
      define(node, 'parent', prev);
      define(open, 'parent', node);

      typeof fn != 'function' || fn.call(this, open, node);

      this.push(type, node);
      prev.nodes.push(node);
    });

    this.set(type + '.close', function() {
      var pos = this.position(),
        m = this.match(closeRegex);
      if (!m || !m[0]) return;

      var parent = this.pop(type);
      var node = pos({
        type: type + '.close',
        rest: this.input,
        suffix: m[1],
        val: m[0]
      });

      if (!this.isType(parent, type)) {
        if (this.options.strict) throw new Error('missing opening "' + type + '"');

        this.setCount--;
        node.escaped = true;
        return node;
      }

      if (node.suffix === '\\') {
        parent.escaped = true;
        node.escaped = true;
      }

      parent.nodes.push(node);
      define(node, 'parent', parent);
    });

    return this;
  },

  eos: function() {
    var pos = this.position();
    if (this.input) return;

    for (var prev = this.prev(); prev.type !== 'root' && !prev.visited; ) {
      if (this.options.strict === true)
        throw new SyntaxError('invalid syntax:' + util.inspect(prev, null, 2));

      if (!hasDelims(prev)) {
        prev.parent.escaped = true;
        prev.escaped = true;
      }

      visit(prev, function(node) {
        if (!hasDelims(node.parent)) {
          node.parent.escaped = true;
          node.escaped = true;
        }
      });

      prev = prev.parent;
    }

    var tok = pos({ type: 'eos', val: this.append || '' });

    define(tok, 'parent', this.ast);
    return tok;
  },

  next: function() {
    for (var tok, parsed = this.parsed, len = this.types.length, idx = -1; ++idx < len; )
      if ((tok = this.parsers[this.types[idx]].call(this))) {
        define(tok, 'rest', this.input);
        define(tok, 'parsed', parsed);
        this.last = tok;
        return tok;
      }
  },

  parse: function(input) {
    if (typeof input != 'string') throw new TypeError('expected a string');

    this.init(this.options);
    this.orig = input;
    this.input = input;
    var self = this;

    function parse() {
      input = self.input;

      var node = self.next();
      if (node) {
        var prev = self.prev();
        if (prev) {
          define(node, 'parent', prev);
          prev.nodes && prev.nodes.push(node);
        }

        if (self.sets.hasOwnProperty(prev.type)) self.currentType = prev.type;
      }

      if (self.input && input === self.input)
        throw new Error('no parsers registered for: "' + self.input.slice(0, 5) + '"');
    }

    while (this.input) parse();
    if (this.stack.length && this.options.strict) {
      var node = this.stack.pop();
      throw this.error('missing opening ' + node.type + ': "' + this.orig + '"');
    }

    var eos = this.eos();
    this.prev().type === 'eos' || this.ast.nodes.push(eos);

    return this.ast;
  }
};

function visit(node, fn) {
  if (!node.visited) {
    define(node, 'visited', true);
    return node.nodes ? mapVisit(node.nodes, fn) : fn(node);
  }
  return node;
}

function mapVisit(nodes, fn) {
  for (var len = nodes.length, idx = -1; ++idx < len; ) visit(nodes[idx], fn);
}

function hasOpen(node) {
  return node.nodes && node.nodes[0].type === node.type + '.open';
}

function hasClose(node) {
  return node.nodes && utils.last(node.nodes).type === node.type + '.close';
}

function hasDelims(node) {
  return hasOpen(node) && hasClose(node);
}

module.exports = Parser;

},
// 91
function(module, exports, __webpack_require__) {

var define = __webpack_require__(0);

module.exports = function(start, parser) {
  this.start = start;
  this.end = { line: parser.line, column: parser.column };
  define(this, 'content', parser.orig);
  define(this, 'source', parser.options.source);
};

},
// 92
function(module, exports, __webpack_require__) {

var nanomatch = __webpack_require__(34),
  extglob = __webpack_require__(37);

module.exports = function(snapdragon) {
  var compilers = snapdragon.compiler.compilers,
    opts = snapdragon.options;

  snapdragon.use(nanomatch.compilers);

  var escape = compilers.escape,
    qmark = compilers.qmark,
    slash = compilers.slash,
    star = compilers.star,
    text = compilers.text,
    plus = compilers.plus,
    dot = compilers.dot;

  opts.extglob === false || opts.noext === true
    ? snapdragon.compiler.use(escapeExtglobs)
    : snapdragon.use(extglob.compilers);

  snapdragon.use(function() {
    this.options.star = this.options.star || function() {
      return '[^\\\\/]*?';
    };
  });

  snapdragon.compiler
    .set('dot', dot)
    .set('escape', escape)
    .set('plus', plus)
    .set('slash', slash)
    .set('qmark', qmark)
    .set('star', star)
    .set('text', text);
};

function escapeExtglobs(compiler) {
  compiler.set('paren', function(node) {
    var val = '';
    visit(node, function(tok) {
      if (tok.val) val += (/^\W/.test(tok.val) ? '\\' : '') + tok.val;
    });
    return this.emit(val, node);
  });

  function visit(node, fn) {
    return node.nodes ? mapVisit(node.nodes, fn) : fn(node);
  }

  function mapVisit(nodes, fn) {
    for (var len = nodes.length, idx = -1; ++idx < len; ) visit(nodes[idx], fn);
  }
}

},
// 93
function(module) {

module.exports = function(nanomatch, options) {
  function slash() {
    return options && typeof options.slash == 'string'
      ? options.slash
      : options && typeof options.slash == 'function'
      ? options.slash.call(nanomatch)
      : '\\\\/';
  }

  function star() {
    return options && typeof options.star == 'string'
      ? options.star
      : options && typeof options.star == 'function'
      ? options.star.call(nanomatch)
      : '[^' + slash() + ']*?';
  }

  var ast = (nanomatch.ast = nanomatch.parser.ast);
  ast.state = nanomatch.parser.state;
  nanomatch.compiler.state = ast.state;
  nanomatch.compiler
    .set('not', function(node) {
      var prev = this.prev();
      return this.options.nonegate === true || prev.type !== 'bos'
        ? this.emit('\\' + node.val, node)
        : this.emit(node.val, node);
    })
    .set('escape', function(node) {
      return this.options.unescape && /^[-\w_.]/.test(node.val)
        ? this.emit(node.val, node)
        : this.emit('\\' + node.val, node);
    })
    .set('quoted', function(node) {
      return this.emit(node.val, node);
    })

    .set('dollar', function(node) {
      return node.parent.type === 'bracket'
        ? this.emit(node.val, node)
        : this.emit('\\' + node.val, node);
    })

    .set('dot', function(node) {
      if (node.dotfiles === true) this.dotfiles = true;
      return this.emit('\\' + node.val, node);
    })

    .set('backslash', function(node) {
      return this.emit(node.val, node);
    })
    .set('slash', function(node, nodes, _i) {
      var val = '[' + slash() + ']',
        parent = node.parent,
        prev = this.prev();

      while (parent.type === 'paren' && !parent.hasSlash) {
        parent.hasSlash = true;
        parent = parent.parent;
      }

      if (prev.addQmark) val += '?';

      if (node.rest.slice(0, 2) === '\\b') return this.emit(val, node);

      if (node.parsed === '**' || node.parsed === './**') {
        this.output = '(?:' + this.output;
        return this.emit(val + ')?', node);
      }

      return node.parsed === '!**' && this.options.nonegate !== true
        ? this.emit(val + '?\\b', node)
        : this.emit(val, node);
    })

    .set('bracket', function(node) {
      var close = node.close,
        open = !node.escaped ? '[' : '\\[',
        negated = node.negated,
        inner = node.inner,
        val = node.val;

      if (node.escaped === true) {
        inner = inner.replace(/\\?(\W)/g, '\\$1');
        negated = '';
      }

      if (inner === ']-') inner = '\\]\\-';

      if (negated && inner.indexOf('.') < 0) inner += '.';
      if (negated && inner.indexOf('/') < 0) inner += '/';

      val = open + negated + inner + close;
      return this.emit(val, node);
    })

    .set('square', function(node) {
      var val = (/^\W/.test(node.val) ? '\\' : '') + node.val;
      return this.emit(val, node);
    })

    .set('qmark', function(node) {
      var prev = this.prev(),
        val = '[^.\\\\/]';
      if (this.options.dot || (prev.type !== 'bos' && prev.type !== 'slash'))
        val = '[^\\\\/]';

      if (node.parsed.slice(-1) === '(') {
        var ch = node.rest.charAt(0);
        if (ch === '!' || ch === '=' || ch === ':') return this.emit(node.val, node);
      }

      if (node.val.length > 1) val += '{' + node.val.length + '}';

      return this.emit(val, node);
    })

    .set('plus', function(node) {
      var prev = node.parsed.slice(-1);
      if (prev === ']' || prev === ')') return this.emit(node.val, node);

      var ch = this.output.slice(-1);
      if (!this.output || (/[?*+]/.test(ch) && node.parent.type !== 'bracket'))
        return this.emit('\\+', node);

      return /\w/.test(ch) && !node.inside
        ? this.emit('+\\+?', node)
        : this.emit('+', node);
    })

    .set('globstar', function(node, nodes, _i) {
      this.output || (this.state.leadingGlobstar = true);

      var prev = this.prev(),
        before = this.prev(2),
        next = this.next(),
        after = this.next(2),
        type = prev.type,
        val = node.val;

      if (prev.type === 'slash' && next.type === 'slash' && before.type === 'text') {
        this.output += '?';

        if (after.type !== 'text') this.output += '\\b';
      }

      var parsed = node.parsed;
      if (parsed.charAt(0) === '!') parsed = parsed.slice(1);

      var isInside = node.isInside.paren || node.isInside.brace;
      val = parsed && type !== 'slash' && type !== 'bos' && !isInside
        ? star()
        : this.options.dot !== true
        ? '(?:(?!(?:[' + slash() + ']|^)\\.).)*?'
        : '(?:(?!(?:[' + slash() + ']|^)(?:\\.{1,2})($|[' + slash() + ']))(?!\\.{2}).)*?';

      if ((type === 'slash' || type === 'bos') && this.options.dot !== true)
        val = '(?!\\.)' + val;

      prev.type !== 'slash' || next.type !== 'slash' || before.type === 'text' ||
        (after.type !== 'text' && after.type !== 'star') ||
        (node.addQmark = true);

      if (this.options.capture) val = '(' + val + ')';

      return this.emit(val, node);
    })

    .set('star', function(node, nodes, i) {
      var prior = nodes[i - 2] || {},
        prev = this.prev(),
        next = this.next(),
        type = prev.type;

      function isStart(n) {
        return n.type === 'bos' || n.type === 'slash';
      }

      if (this.output === '' && this.options.contains !== true)
        this.output = '(?![' + slash() + '])';

      if (type === 'bracket' && this.options.bash === false) {
        var str = next && next.type === 'bracket' ? star() : '*?';
        if (!prev.nodes || prev.nodes[1].type !== 'posix') return this.emit(str, node);
      }

      var prefix = this.dotfiles || type === 'text' || type === 'escape'
        ? ''
        : this.options.dot
        ? '(?!(?:^|[' + slash() + '])\\.{1,2}(?:$|[' + slash() + ']))'
        : '(?!\\.)';

      if (isStart(prev) || (isStart(prior) && type === 'not'))
        prefix += prefix !== '(?!\\.)' ? '(?!(\\.{2}|\\.[' + slash() + ']))(?=.)' : '(?=.)';
      else if (prefix === '(?!\\.)') prefix = '';

      if (prev.type === 'not' && prior.type === 'bos' && this.options.dot === true)
        this.output = '(?!\\.)' + this.output;

      var output = prefix + star();
      if (this.options.capture) output = '(' + output + ')';

      return this.emit(output, node);
    })

    .set('text', function(node) {
      return this.emit(node.val, node);
    })

    .set('eos', function(node) {
      var prev = this.prev(),
        val = node.val;

      this.output = '(?:\\.[' + slash() + '](?=.))?' + this.output;
      if (this.state.metachar && prev.type !== 'qmark' && prev.type !== 'slash')
        val += this.options.contains ? '[' + slash() + ']?' : '(?:[' + slash() + ']|$)';

      return this.emit(val, node);
    });

  options && typeof options.compilers == 'function' &&
    options.compilers(nanomatch.compiler);
};

},
// 94
function(module, exports, __webpack_require__) {

var cached,
  regexNot = __webpack_require__(5),
  toRegex = __webpack_require__(3),

  NOT_REGEX = '[\\[!*+?$^"\'.\\\\/]+',
  not = createTextRegex(NOT_REGEX);

module.exports = function(nanomatch, options) {
  var parser = nanomatch.parser,
    opts = parser.options;

  parser.state = { slashes: 0, paths: [] };

  parser.ast.state = parser.state;
  parser
    .capture('prefix', function() {
      if (this.parsed || !this.match(/^\.[\\/]/)) return;
      this.state.strictOpen = !!this.options.strictOpen;
      this.state.addPrefix = true;
    })

    .capture('escape', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(/^(?:\\(.)|([$^]))/);
      if (m) return pos({ type: 'escape', val: m[2] || m[1] });
    })

    .capture('quoted', function() {
      var pos = this.position(),
        m = this.match(/^["']/);
      if (!m) return;

      var quote = m[0];
      if (this.input.indexOf(quote) < 0) return pos({ type: 'escape', val: quote });

      var tok = advanceTo(this.input, quote);
      this.consume(tok.len);

      return pos({ type: 'quoted', val: tok.esc });
    })

    .capture('not', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(this.notRegex || /^!+/);
      if (!m) return;
      var val = m[0],

        isNegated = val.length % 2 == 1;
      parsed !== '' || isNegated || (val = '');

      if (parsed === '' && isNegated && this.options.nonegate !== true) {
        this.bos.val = '(?!^(?:';
        this.append = ')$).*';
        val = '';
      }
      return pos({ type: 'not', val: val });
    })

    .capture('dot', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^\.+/);
      if (!m) return;

      var val = m[0];
      this.state.dot = val === '.' && (parsed === '' || parsed.slice(-1) === '/');

      return pos({ type: 'dot', dotfiles: this.state.dot, val: val });
    })

    .capture('plus', /^\+(?!\()/)

    .capture('qmark', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^\?+(?!\()/);
      if (!m) return;

      this.state.metachar = true;
      this.state.qmark = true;

      return pos({ type: 'qmark', parsed: parsed, val: m[0] });
    })

    .capture('globstar', function() {
      var parsed = this.parsed,
        pos = this.position();
      if (!this.match(/^\*{2}(?![*(])(?=[,)/]|$)/)) return;

      var type = opts.noglobstar !== true ? 'globstar' : 'star',
        node = pos({type: type, parsed: parsed});
      this.state.metachar = true;

      while (this.input.slice(0, 4) === '/**/') this.input = this.input.slice(3);

      node.isInside = { brace: this.isInside('brace'), paren: this.isInside('paren') };

      if (type === 'globstar') {
        this.state.globstar = true;
        node.val = '**';
      } else {
        this.state.star = true;
        node.val = '*';
      }

      return node;
    })

    .capture('star', function() {
      var pos = this.position(),
        starRe = /^(?:\*(?![*(])|[*]{3,}(?!\()|[*]{2}(?![(/]|$)|\*(?=\*\())/,
        m = this.match(starRe);
      if (!m) return;

      this.state.metachar = true;
      this.state.star = true;
      return pos({ type: 'star', val: m[0] });
    })

    .capture('slash', function() {
      var pos = this.position(),
        m = this.match(/^\//);
      if (!m) return;

      this.state.slashes++;
      return pos({ type: 'slash', val: m[0] });
    })

    .capture('backslash', function() {
      var pos = this.position(),
        m = this.match(/^\\(?![*+?(){}[\]'"])/);
      if (!m) return;

      var val = m[0];

      this.isInside('bracket') ? (val = '\\') : val.length > 1 && (val = '\\\\');

      return pos({ type: 'backslash', val: val });
    })

    .capture('square', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(/^\[([^!^\\])]/);
      if (m) return pos({ type: 'square', val: m[1] });
    })

    .capture('bracket', function() {
      var pos = this.position(),
        m = this.match(/^(?:\[([!^]?)([^\]]+|]-)(]|[^*+?]+)|\[)/);
      if (!m) return;

      var val = m[0],
        negated = m[1] ? '^' : '',
        inner = (m[2] || '').replace(/\\\\+/, '\\\\'),
        close = m[3] || '';

      if (m[2] && inner.length < m[2].length) val = val.replace(/\\\\+/, '\\\\');

      var esc = this.input.slice(0, 2);
      if (inner === '' && esc === '\\]') {
        inner += esc;
        this.consume(2);

        for (var ch, str = this.input, idx = -1; (ch = str[++idx]); ) {
          this.consume(1);
          if (ch === ']') {
            close = ch;
            break;
          }
          inner += ch;
        }
      }

      return pos({
        type: 'bracket',
        val: val,
        escaped: close !== ']',
        negated: negated,
        inner: inner,
        close: close
      });
    })

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(not);
      if (m && m[0]) return pos({ type: 'text', val: m[0] });
    });

  options && typeof options.parsers == 'function' && options.parsers(nanomatch.parser);
};

function advanceTo(input, endChar) {
  var ch = input.charAt(0),
    tok = { len: 1, val: '', esc: '' },
    idx = 0;

  function advance() {
    if (ch !== '\\') {
      tok.esc += '\\' + ch;
      tok.val += ch;
    }

    ch = input.charAt(++idx);
    tok.len++;

    if (ch === '\\') {
      advance();
      advance();
    }
  }

  while (ch && ch !== endChar) advance();

  return tok;
}

function createTextRegex(pattern) {
  if (cached) return cached;
  var opts = {contains: true, strictClose: false},
    not = regexNot.create(pattern, opts),
    re = toRegex('^(?:[*]\\((?=.)|' + not + ')', opts);
  return (cached = re);
}

module.exports.not = NOT_REGEX;

},
// 95
function(module, exports, __webpack_require__) {

module.exports = new (__webpack_require__(16))();

},
// 96
function(module, exports, __webpack_require__) {

var utils = module.exports,
  path = __webpack_require__(12),

  isWindows = __webpack_require__(97)(),
  Snapdragon = __webpack_require__(8);
utils.define = __webpack_require__(0);
utils.diff = __webpack_require__(35);
utils.extend = Object.assign;
utils.pick = __webpack_require__(36);
utils.typeOf = __webpack_require__(4);
utils.unique = __webpack_require__(6);

utils.isEmptyString = function(val) {
  return String(val) === '' || String(val) === './';
};

utils.isWindows = function() {
  return path.sep === '\\' || isWindows === true;
};

utils.last = function(arr, n) {
  return arr[arr.length - (n || 1)];
};

utils.instantiate = function(ast, options) {
  var snapdragon =
    utils.typeOf(ast) === 'object' && ast.snapdragon
    ? ast.snapdragon
    : utils.typeOf(options) === 'object' && options.snapdragon
    ? options.snapdragon
    : new Snapdragon(options);

  utils.define(snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.call(this, str, options);
    parsed.input = str;

    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0],
        inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') inner.val = '\\' + inner.val;
      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') sibling.loose = true;
      }
    }

    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  return snapdragon;
};

utils.createKey = function(pattern, options) {
  if (options === void 0) return pattern;

  var key = pattern;
  for (var prop in options)
    if (options.hasOwnProperty(prop)) key += ';' + prop + '=' + String(options[prop]);

  return key;
};

utils.arrayify = function(val) {
  return typeof val == 'string' ? [val] : val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isString = function(val) {
  return typeof val == 'string';
};

utils.isRegex = function(val) {
  return utils.typeOf(val) === 'regexp';
};

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

utils.escapeRegex = function(str) {
  return str.replace(/[-[\]{}()^$|*+?.\\/\s]/g, '\\$&');
};

utils.combineDupes = function(input, patterns) {
  patterns = utils.arrayify(patterns).join('|').split('|').map(function(s) {
    return s.replace(/\\?([+*\\/])/g, '\\$1');
  });
  var substr = patterns.join('|'),
    regex = new RegExp('(' + substr + ')(?=\\1)', 'g');
  return input.replace(regex, '');
};

utils.hasSpecialChars = function(str) {
  return /(?:(?:(^|\/)[!.])|[*?+()|[\]{}]|[+@]\()/.test(str);
};

utils.toPosixPath = function(str) {
  return str.replace(/\\+/g, '/');
};

utils.unescape = function(str) {
  return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ''));
};

utils.stripDrive = function(fp) {
  return utils.isWindows() ? fp.replace(/^[a-z]:[\\/]+?/i, '/') : fp;
};

utils.stripPrefix = function(str) {
  return str.charAt(0) === '.' && (str.charAt(1) === '/' || str.charAt(1) === '\\')
    ? str.slice(2)
    : str;
};

utils.isSimpleChar = function(str) {
  return str.trim() === '' || str === '.';
};

utils.isSlash = function(str) {
  return str === '/' || str === '\\/' || str === '\\' || str === '\\\\';
};

utils.matchPath = function(pattern, options) {
  return options && options.contains
    ? utils.containsPattern(pattern, options)
    : utils.equalsPattern(pattern, options);
};

utils._equals = function(filepath, unixPath, pattern) {
  return pattern === filepath || pattern === unixPath;
};

utils._contains = function(filepath, unixPath, pattern) {
  return filepath.indexOf(pattern) > -1 || unixPath.indexOf(pattern) > -1;
};

utils.equalsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var equal = utils._equals(filepath, unixify(filepath), pattern);
    if (equal === true || options.nocase !== true) return equal;

    var lower = filepath.toLowerCase();
    return utils._equals(lower, unixify(lower), pattern);
  };
};

utils.containsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var contains = utils._contains(filepath, unixify(filepath), pattern);
    if (contains === true || options.nocase !== true) return contains;

    var lower = filepath.toLowerCase();
    return utils._contains(lower, unixify(lower), pattern);
  };
};

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(filepath) || re.test(path.basename(filepath));
  };
};

utils.identity = function(val) {
  return val;
};

utils.value = function(str, unixify, options) {
  return options && options.unixify === false
    ? str
    : options && typeof options.unixify == 'function'
    ? options.unixify(str)
    : unixify(str);
};

utils.unixify = function(options) {
  var opts = options || {};
  return function(filepath) {
    if (opts.stripPrefix !== false) filepath = utils.stripPrefix(filepath);

    if (opts.unescape === true) filepath = utils.unescape(filepath);

    if (opts.unixify === true || utils.isWindows())
      filepath = utils.toPosixPath(filepath);

    return filepath;
  };
};

},
// 97
function(module) {

module.exports = function() {
  return process &&
    (process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE));
};

},
// 98
function(module, exports, __webpack_require__) {

var posix = __webpack_require__(99);

module.exports = function(brackets) {
  brackets.compiler
    .set('escape', function(node) {
      return this.emit('\\' + node.val.replace(/^\\/, ''), node);
    })
    .set('text', function(node) {
      return this.emit(node.val.replace(/([{}])/g, '\\$1'), node);
    })
    .set('posix', function(node) {
      if (node.val === '[::]') return this.emit('\\[::\\]', node);

      var val = posix[node.inner];
      if (val === void 0) val = '[' + node.inner + ']';

      return this.emit(val, node);
    })
    .set('bracket', function(node) {
      return this.mapVisit(node.nodes);
    })
    .set('bracket.open', function(node) {
      return this.emit(node.val, node);
    })
    .set('bracket.inner', function(node) {
      var inner = node.val;

      if (inner === '[' || inner === ']') return this.emit('\\' + node.val, node);
      if (inner === '^]') return this.emit('^\\]', node);
      if (inner === '^') return this.emit('^', node);

      if (/-/.test(inner) && !/(\d-\d|\w-\w)/.test(inner))
        inner = inner.split('-').join('\\-');

      var isNegated = inner.charAt(0) === '^';
      if (isNegated && inner.indexOf('/') < 0) inner += '/';
      if (isNegated && inner.indexOf('.') < 0) inner += '.';

      inner = inner.replace(/\\([1-9])/g, '$1');
      return this.emit(inner, node);
    })
    .set('bracket.close', function(node) {
      var val = node.val.replace(/^\\/, '');
      return node.parent.escaped === true
        ? this.emit('\\' + val, node)
        : this.emit(val, node);
    });
};

},
// 99
function(module) {

module.exports = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

},
// 100
function(module, exports, __webpack_require__) {

var utils = __webpack_require__(101),
  define = __webpack_require__(0),

  TEXT_REGEX = '(\\[(?=.*\\])|\\])+',
  not = utils.createRegex(TEXT_REGEX);

function parsers(brackets) {
  brackets.state = brackets.state || {};
  brackets.parser.sets.bracket = brackets.parser.sets.bracket || [];
  brackets.parser
    .capture('escape', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(/^\\(.)/);
      if (m) return pos({ type: 'escape', val: m[0] });
    })

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(not);
      if (m && m[0]) return pos({ type: 'text', val: m[0] });
    })

    .capture('posix', function() {
      var pos = this.position(),
        m = this.match(/^\[:(.*?):](?=.*])/);
      if (!m) return;

      var inside = this.isInside('bracket');
      inside && brackets.posix++;

      return pos({ type: 'posix', insideBracket: inside, inner: m[1], val: m[0] });
    })

    .capture('bracket', function() {})

    .capture('bracket.open', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^\[(?=.*])/);
      if (!m) return;

      var prev = this.prev(),
        last = utils.last(prev.nodes);

      if (parsed.slice(-1) === '\\' && !this.isInside('bracket')) {
        last.val = last.val.slice(0, last.val.length - 1);
        return pos({ type: 'escape', val: m[0] });
      }

      var open = pos({ type: 'bracket.open', val: m[0] });

      if (last.type === 'bracket.open' || this.isInside('bracket')) {
        open.val = '\\' + open.val;
        open.type = 'bracket.inner';
        open.escaped = true;
        return open;
      }

      var node = pos({ type: 'bracket', nodes: [open] });

      define(node, 'parent', prev);
      define(open, 'parent', node);
      this.push('bracket', node);
      prev.nodes.push(node);
    })

    .capture('bracket.inner', function() {
      if (!this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(not);
      if (!m || !m[0]) return;

      var next = this.input.charAt(0),
        val = m[0],

        node = pos({ type: 'bracket.inner', val: val });

      if (val === '\\\\') return node;

      var first = val.charAt(0),
        last = val.slice(-1);

      if (first === '!') val = '^' + val.slice(1);

      if (last === '\\' || (val === '^' && next === ']')) {
        val += this.input[0];
        this.consume(1);
      }

      node.val = val;
      return node;
    })

    .capture('bracket.close', function() {
      var parsed = this.parsed,
        pos = this.position(),
        m = this.match(/^]/);
      if (!m) return;

      var prev = this.prev(),
        last = utils.last(prev.nodes);

      if (parsed.slice(-1) === '\\' && !this.isInside('bracket')) {
        last.val = last.val.slice(0, last.val.length - 1);

        return pos({ type: 'escape', val: m[0] });
      }

      var node = pos({ type: 'bracket.close', rest: this.input, val: m[0] });

      if (last.type === 'bracket.open') {
        node.type = 'bracket.inner';
        node.escaped = true;
        return node;
      }

      var bracket = this.pop('bracket');
      if (!this.isType(bracket, 'bracket')) {
        if (this.options.strict) throw new Error('missing opening "["');

        node.type = 'bracket.inner';
        node.escaped = true;
        return node;
      }

      bracket.nodes.push(node);
      define(node, 'parent', bracket);
    });
}

module.exports = parsers;

module.exports.TEXT_REGEX = TEXT_REGEX;

},
// 101
function(module, exports, __webpack_require__) {

var cached,
  toRegex = __webpack_require__(3),
  regexNot = __webpack_require__(5);

exports.last = function(arr) {
  return arr[arr.length - 1];
};

exports.createRegex = function(pattern, include) {
  if (cached) return cached;
  var opts = {contains: true, strictClose: false},
    not = regexNot.create(pattern, opts);

  var re = toRegex(
    typeof include == 'string' ? '^(?:' + include + '|' + not + ')' : not,
    opts
  );
  return (cached = re);
};

},
// 102
function(module, exports, __webpack_require__) {

var Snapdragon = __webpack_require__(8),
  define = __webpack_require__(0),
  extend = Object.assign,

  compilers = __webpack_require__(38),
  parsers = __webpack_require__(40);

function Extglob(options) {
  this.options = extend({source: 'extglob'}, options);
  this.snapdragon = this.options.snapdragon || new Snapdragon(this.options);
  this.snapdragon.patterns = this.snapdragon.patterns || {};
  this.compiler = this.snapdragon.compiler;
  this.parser = this.snapdragon.parser;

  compilers(this.snapdragon);
  parsers(this.snapdragon);

  define(this.snapdragon, 'parse', /** @this Snapdragon */ function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    var last = this.parser.stack.pop();
    if (last && this.options.strict !== true) {
      var node = last.nodes[0];
      node.val = '\\' + node.val;
      var sibling = node.parent.nodes[1];
      if (sibling.type === 'star') sibling.loose = true;
    }

    define(parsed, 'parser', this.parser);
    return parsed;
  });

  define(this, 'parse', /** @this Extglob */ function(ast, options) {
    return this.snapdragon.parse.apply(this.snapdragon, arguments);
  });

  define(this, 'compile', /** @this Extglob */ function(ast, options) {
    return this.snapdragon.compile.apply(this.snapdragon, arguments);
  });
}

module.exports = Extglob;

},
// 103
function(module, exports, __webpack_require__) {

var not,
  extglob = __webpack_require__(37),
  nanomatch = __webpack_require__(34),
  regexNot = __webpack_require__(5),
  toRegex = __webpack_require__(3),

  TEXT = '([!@*?+]?\\(|\\)|\\[:?(?=.*?:?\\])|:?\\]|[*+?!^$.\\\\/])+';
var createNotRegex = /** @param {*} opts */ function(opts) {
  return not || (not = textRegex(TEXT));
};

module.exports = function(snapdragon) {
  var parsers = snapdragon.parser.parsers;

  snapdragon.use(nanomatch.parsers);

  var escape = parsers.escape,
    slash = parsers.slash,
    qmark = parsers.qmark,
    plus = parsers.plus,
    star = parsers.star,
    dot = parsers.dot;

  snapdragon.use(extglob.parsers);

  snapdragon.parser
    .use(function() {
      this.notRegex = /^!+(?!\()/;
    })
    .capture('escape', escape)
    .capture('slash', slash)
    .capture('qmark', qmark)
    .capture('star', star)
    .capture('plus', plus)
    .capture('dot', dot)

    .capture('text', function() {
      if (this.isInside('bracket')) return;
      var pos = this.position(),
        m = this.match(createNotRegex(this.options));
      if (m && m[0])
        return pos({ type: 'text', val: m[0].replace(/([[\]^$])/g, '\\$1') });
    });
};

function textRegex(pattern) {
  var notStr = regexNot.create(pattern, {contains: true, strictClose: false});
  return toRegex('(?:[\\^]|\\\\|' + notStr + ')', {strictClose: false});
}

},
// 104
function(module, exports, __webpack_require__) {

module.exports = new (__webpack_require__(16))();

},
// 105
function(module, exports, __webpack_require__) {

var utils = module.exports,
  path = __webpack_require__(12),

  Snapdragon = __webpack_require__(8);
utils.define = __webpack_require__(0);
utils.diff = __webpack_require__(35);
utils.extend = Object.assign;
utils.pick = __webpack_require__(36);
utils.typeOf = __webpack_require__(4);
utils.unique = __webpack_require__(6);

utils.isWindows = function() {
  return path.sep === '\\' || process.platform === 'win32';
};

utils.instantiate = function(ast, options) {
  var snapdragon =
    utils.typeOf(ast) === 'object' && ast.snapdragon
    ? ast.snapdragon
    : utils.typeOf(options) === 'object' && options.snapdragon
    ? options.snapdragon
    : new Snapdragon(options);

  utils.define(snapdragon, 'parse', function(str, options) {
    var parsed = Snapdragon.prototype.parse.apply(this, arguments);
    parsed.input = str;

    var last = this.parser.stack.pop();
    if (last && this.options.strictErrors !== true) {
      var open = last.nodes[0],
        inner = last.nodes[1];
      if (last.type === 'bracket') {
        if (inner.val.charAt(0) === '[') inner.val = '\\' + inner.val;
      } else {
        open.val = '\\' + open.val;
        var sibling = open.parent.nodes[1];
        if (sibling.type === 'star') sibling.loose = true;
      }
    }

    utils.define(parsed, 'parser', this.parser);
    return parsed;
  });

  return snapdragon;
};

utils.createKey = function(pattern, options) {
  if (utils.typeOf(options) !== 'object') return pattern;

  var val = pattern;
  for (var keys = Object.keys(options), i = 0; i < keys.length; i++) {
    var key = keys[i];
    val += ';' + key + '=' + String(options[key]);
  }
  return val;
};

utils.arrayify = function(val) {
  return typeof val == 'string' ? [val] : val ? (Array.isArray(val) ? val : [val]) : [];
};

utils.isString = function(val) {
  return typeof val == 'string';
};

utils.isObject = function(val) {
  return utils.typeOf(val) === 'object';
};

utils.hasSpecialChars = function(str) {
  return /(?:(?:(^|\/)[!.])|[*?+()|\[\]{}]|[+@]\()/.test(str);
};

utils.escapeRegex = function(str) {
  return str.replace(/[-[\]{}()^$|*+?.\\\/\s]/g, '\\$&');
};

utils.toPosixPath = function(str) {
  return str.replace(/\\+/g, '/');
};

utils.unescape = function(str) {
  return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ''));
};

utils.stripPrefix = function(str) {
  if (str.charAt(0) !== '.') return str;

  var ch = str.charAt(1);
  return utils.isSlash(ch) ? str.slice(2) : str;
};

utils.isSlash = function(str) {
  return str === '/' || str === '\\/' || str === '\\' || str === '\\\\';
};

utils.matchPath = function(pattern, options) {
  return options && options.contains
    ? utils.containsPattern(pattern, options)
    : utils.equalsPattern(pattern, options);
};

utils._equals = function(filepath, unixPath, pattern) {
  return pattern === filepath || pattern === unixPath;
};

utils._contains = function(filepath, unixPath, pattern) {
  return filepath.indexOf(pattern) > -1 || unixPath.indexOf(pattern) > -1;
};

utils.equalsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var equal = utils._equals(filepath, unixify(filepath), pattern);
    if (equal === true || options.nocase !== true) return equal;

    var lower = filepath.toLowerCase();
    return utils._equals(lower, unixify(lower), pattern);
  };
};

utils.containsPattern = function(pattern, options) {
  var unixify = utils.unixify(options);
  options = options || {};

  return function(filepath) {
    var contains = utils._contains(filepath, unixify(filepath), pattern);
    if (contains === true || options.nocase !== true) return contains;

    var lower = filepath.toLowerCase();
    return utils._contains(lower, unixify(lower), pattern);
  };
};

utils.matchBasename = function(re) {
  return function(filepath) {
    return re.test(path.basename(filepath));
  };
};

utils.value = function(str, unixify, options) {
  return options && options.unixify === false ? str : unixify(str);
};

utils.unixify = function(options) {
  options = options || {};
  return function(filepath) {
    if (utils.isWindows() || options.unixify === true)
      filepath = utils.toPosixPath(filepath);

    if (options.stripPrefix !== false) filepath = utils.stripPrefix(filepath);

    if (options.unescape === true) filepath = utils.unescape(filepath);

    return filepath;
  };
};

}
]);

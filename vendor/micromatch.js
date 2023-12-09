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
  return __webpack_require__(43);
}([ function(module, exports, __webpack_require__) {
  var isobject = __webpack_require__(1), isDescriptor = __webpack_require__(48), define = "undefined" != typeof Reflect && Reflect.defineProperty ? Reflect.defineProperty : Object.defineProperty;
  module.exports = function(obj, key, val) {
    if (!isobject(obj) && "function" != typeof obj && !Array.isArray(obj)) throw new TypeError("expected an object, function, or array");
    if ("string" != typeof key) throw new TypeError('expected "key" to be a string');
    return isDescriptor(val) ? (define(obj, key, val), obj) : (define(obj, key, {
      configurable: !0,
      enumerable: !1,
      writable: !0,
      value: val
    }), obj);
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(val) {
    return null != val && "object" == typeof val && !1 === Array.isArray(val);
  };
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports, __webpack_require__) {
  var safe = __webpack_require__(17), define = __webpack_require__(0), extend = Object.assign, not = __webpack_require__(5), cache = {};
  function makeRe(pattern, options) {
    if (pattern instanceof RegExp) return pattern;
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    if (pattern.length > 65536) throw new Error("expected pattern to be less than 65536 characters");
    var key = pattern;
    if ((!options || options && !1 !== options.cache) && (key = function(pattern, options) {
      if (!options) return pattern;
      var key = pattern;
      for (var prop in options) options.hasOwnProperty(prop) && (key += ";" + prop + "=" + String(options[prop]));
      return key;
    }(pattern, options), cache.hasOwnProperty(key))) return cache[key];
    var opts = extend({}, options);
    !0 === opts.contains && (!0 === opts.negate ? opts.strictNegate = !1 : opts.strict = !1), 
    !1 === opts.strict && (opts.strictOpen = !1, opts.strictClose = !1);
    var regex, open = !1 !== opts.strictOpen ? "^" : "", close = !1 !== opts.strictClose ? "$" : "", flags = opts.flags || "";
    !0 !== opts.nocase || /i/.test(flags) || (flags += "i");
    try {
      if ((opts.negate || "boolean" == typeof opts.strictNegate) && (pattern = not.create(pattern, opts)), 
      regex = new RegExp(open + "(?:" + pattern + ")" + close, flags), !0 === opts.safe && !1 === safe(regex)) throw new Error("potentially unsafe regular expression: " + regex.source);
    } catch (err) {
      if (!0 === opts.strictErrors || !0 === opts.safe) throw err.key = key, err.pattern = pattern, 
      err.originalOptions = options, err.createdOptions = opts, err;
      try {
        regex = new RegExp("^" + pattern.replace(/(\W)/g, "\\$1") + "$");
      } catch (err) {
        regex = /.^/;
      }
    }
    return !1 !== opts.cache && function(regex, key, pattern, options) {
      define(regex, "cached", !0), define(regex, "pattern", pattern), define(regex, "options", options), 
      define(regex, "key", key), cache[key] = regex;
    }(regex, key, pattern, opts), regex;
  }
  module.exports = function(patterns, options) {
    return Array.isArray(patterns) ? makeRe(patterns.join("|"), options) : makeRe(patterns, options);
  }, module.exports.makeRe = makeRe;
}, function(module, exports) {
  var toString = Object.prototype.toString;
  function ctorName(val) {
    return "function" == typeof val.constructor ? val.constructor.name : null;
  }
  module.exports = function(val) {
    if (void 0 === val) return "undefined";
    if (null === val) return "null";
    var type = typeof val;
    if ("boolean" === type) return "boolean";
    if ("string" === type) return "string";
    if ("number" === type) return "number";
    if ("symbol" === type) return "symbol";
    if ("function" === type) return "GeneratorFunction" === ctorName(val) ? "generatorfunction" : "function";
    if (function(val) {
      return Array.isArray ? Array.isArray(val) : val instanceof Array;
    }(val)) return "array";
    if (function(val) {
      if (val.constructor && "function" == typeof val.constructor.isBuffer) return val.constructor.isBuffer(val);
      return !1;
    }(val)) return "buffer";
    if (function(val) {
      try {
        if ("number" == typeof val.length && "function" == typeof val.callee) return !0;
      } catch (err) {
        if (-1 !== err.message.indexOf("callee")) return !0;
      }
      return !1;
    }(val)) return "arguments";
    if (function(val) {
      return val instanceof Date || "function" == typeof val.toDateString && "function" == typeof val.getDate && "function" == typeof val.setDate;
    }(val)) return "date";
    if (function(val) {
      return val instanceof Error || "string" == typeof val.message && val.constructor && "number" == typeof val.constructor.stackTraceLimit;
    }(val)) return "error";
    if (function(val) {
      return val instanceof RegExp || "string" == typeof val.flags && "boolean" == typeof val.ignoreCase && "boolean" == typeof val.multiline && "boolean" == typeof val.global;
    }(val)) return "regexp";
    switch (ctorName(val)) {
     case "Symbol":
      return "symbol";

     case "Promise":
      return "promise";

     case "WeakMap":
      return "weakmap";

     case "WeakSet":
      return "weakset";

     case "Map":
      return "map";

     case "Set":
      return "set";

     case "Int8Array":
      return "int8array";

     case "Uint8Array":
      return "uint8array";

     case "Uint8ClampedArray":
      return "uint8clampedarray";

     case "Int16Array":
      return "int16array";

     case "Uint16Array":
      return "uint16array";

     case "Int32Array":
      return "int32array";

     case "Uint32Array":
      return "uint32array";

     case "Float32Array":
      return "float32array";

     case "Float64Array":
      return "float64array";
    }
    if (function(val) {
      return "function" == typeof val.throw && "function" == typeof val.return && "function" == typeof val.next;
    }(val)) return "generator";
    switch (type = toString.call(val)) {
     case "[object Object]":
      return "object";

     case "[object Map Iterator]":
      return "mapiterator";

     case "[object Set Iterator]":
      return "setiterator";

     case "[object String Iterator]":
      return "stringiterator";

     case "[object Array Iterator]":
      return "arrayiterator";
    }
    return type.slice(8, -1).toLowerCase().replace(/\s/g, "");
  };
}, function(module, exports, __webpack_require__) {
  var extend = Object.assign, safe = __webpack_require__(17);
  function toRegex(pattern, options) {
    return new RegExp(toRegex.create(pattern, options));
  }
  toRegex.create = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    var opts = extend({}, options);
    !0 === opts.contains && (opts.strictNegate = !1);
    var open = !1 !== opts.strictOpen ? "^" : "", close = !1 !== opts.strictClose ? "$" : "", endChar = opts.endChar ? opts.endChar : "+", res = open + (!1 === opts.strictNegate ? "(?:(?!(?:" + pattern + ")).)" + endChar : "(?:(?!^(?:" + pattern + ")$).)" + endChar) + close;
    if (!0 === opts.safe && !1 === safe(res)) throw new Error("potentially unsafe regular expression: " + res);
    return res;
  }, module.exports = toRegex;
}, function(module, exports, __webpack_require__) {
  module.exports = function(arr) {
    if (!Array.isArray(arr)) throw new TypeError("array-unique expects an array.");
    for (var len = arr.length, i = -1; i++ < len; ) for (var j = i + 1; j < arr.length; ++j) arr[i] === arr[j] && arr.splice(j--, 1);
    return arr;
  }, module.exports.immutable = function(arr) {
    if (!Array.isArray(arr)) throw new TypeError("array-unique expects an array.");
    for (var arrLen = arr.length, newArr = new Array(arrLen), i = 0; i < arrLen; i++) newArr[i] = arr[i];
    return module.exports(newArr);
  };
}, function(module, exports, __webpack_require__) {
  var Base = __webpack_require__(58), define = __webpack_require__(0), Compiler = __webpack_require__(75), Parser = __webpack_require__(91), utils = __webpack_require__(11);
  function Snapdragon(options) {
    Base.call(this, null, options), this.options = utils.extend({
      source: "string"
    }, this.options), this.compiler = new Compiler(this.options), this.parser = new Parser(this.options), 
    Object.defineProperty(this, "compilers", {
      get: function() {
        return this.compiler.compilers;
      }
    }), Object.defineProperty(this, "parsers", {
      get: function() {
        return this.parser.parsers;
      }
    }), Object.defineProperty(this, "regex", {
      get: function() {
        return this.parser.regex;
      }
    });
  }
  Base.extend(Snapdragon), Snapdragon.prototype.capture = function() {
    return this.parser.capture.apply(this.parser, arguments);
  }, Snapdragon.prototype.use = function(fn) {
    return fn.call(this, this), this;
  }, Snapdragon.prototype.parse = function(str, options) {
    this.options = utils.extend({}, this.options, options);
    var parsed = this.parser.parse(str, this.options);
    return define(parsed, "parser", this.parser), parsed;
  }, Snapdragon.prototype.compile = function(ast, options) {
    this.options = utils.extend({}, this.options, options);
    var compiled = this.compiler.compile(ast, this.options);
    return define(compiled, "compiler", this.compiler), compiled;
  }, module.exports = Snapdragon, module.exports.Compiler = Compiler, module.exports.Parser = Parser;
}, function(module, exports) {
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
}, function(module, exports, __webpack_require__) {
  var splitString = __webpack_require__(20), utils = module.exports;
  utils.extend = Object.assign, utils.flatten = __webpack_require__(51), utils.isObject = __webpack_require__(1), 
  utils.fillRange = __webpack_require__(52), utils.repeat = __webpack_require__(54), 
  utils.unique = __webpack_require__(6), utils.define = function(obj, key, val) {
    Object.defineProperty(obj, key, {
      writable: !0,
      configurable: !0,
      enumerable: !1,
      value: val
    });
  }, utils.isEmptySets = function(str) {
    return /^(?:\{,\})+$/.test(str);
  }, utils.isQuotedString = function(str) {
    var open = str.charAt(0);
    return ("'" === open || '"' === open || "`" === open) && str.slice(-1) === open;
  }, utils.createKey = function(pattern, options) {
    var id = pattern;
    if (void 0 === options) return id;
    for (var keys = Object.keys(options), i = 0; i < keys.length; i++) {
      var key = keys[i];
      id += ";" + key + "=" + String(options[key]);
    }
    return id;
  }, utils.createOptions = function(options) {
    var opts = utils.extend.apply(null, arguments);
    return "boolean" == typeof opts.expand && (opts.optimize = !opts.expand), "boolean" == typeof opts.optimize && (opts.expand = !opts.optimize), 
    !0 === opts.optimize && (opts.makeRe = !0), opts;
  }, utils.join = function(a, b, options) {
    if (options = options || {}, a = utils.arrayify(a), b = utils.arrayify(b), !a.length) return b;
    if (!b.length) return a;
    for (var len = a.length, idx = -1, arr = []; ++idx < len; ) {
      var val = a[idx];
      if (Array.isArray(val)) {
        for (var i = 0; i < val.length; i++) val[i] = utils.join(val[i], b, options);
        arr.push(val);
      } else for (var j = 0; j < b.length; j++) {
        var bval = b[j];
        Array.isArray(bval) ? arr.push(utils.join(val, bval, options)) : arr.push(val + bval);
      }
    }
    return arr;
  }, utils.split = function(str, options) {
    var opts = utils.extend({
      sep: ","
    }, options);
    return "boolean" != typeof opts.keepQuotes && (opts.keepQuotes = !0), !1 === opts.unescape && (opts.keepEscaping = !0), 
    splitString(str, opts, utils.escapeBrackets(opts));
  }, utils.expand = function(str, options) {
    var opts = utils.extend({
      rangeLimit: 1e4
    }, options), segs = utils.split(str, opts), tok = {
      segs: segs
    };
    if (utils.isQuotedString(str)) return tok;
    if (!0 === opts.rangeLimit && (opts.rangeLimit = 1e4), segs.length > 1) {
      if (!1 === opts.optimize) return tok.val = segs[0], tok;
      tok.segs = utils.stringifyArray(tok.segs);
    } else if (1 === segs.length) {
      var arr = str.split("..");
      if (1 === arr.length) return tok.val = tok.segs[tok.segs.length - 1] || tok.val || str, 
      tok.segs = [], tok;
      if (2 === arr.length && arr[0] === arr[1]) return tok.escaped = !0, tok.val = arr[0], 
      tok.segs = [], tok;
      if (arr.length > 1) {
        if (!1 !== opts.optimize && (opts.optimize = !0, delete opts.expand), !0 !== opts.optimize) {
          var min = Math.min(arr[0], arr[1]), max = Math.max(arr[0], arr[1]), step = arr[2] || 1;
          if (!1 !== opts.rangeLimit && (max - min) / step >= opts.rangeLimit) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
        }
        return arr.push(opts), tok.segs = utils.fillRange.apply(null, arr), tok.segs.length ? (!0 === opts.optimize && (tok.segs = utils.stringifyArray(tok.segs)), 
        "" === tok.segs ? tok.val = str : tok.val = tok.segs[0], tok) : (tok.escaped = !0, 
        tok.val = str, tok);
      }
    } else tok.val = str;
    return tok;
  }, utils.escapeBrackets = function(options) {
    return function(tok) {
      if (tok.escaped && "b" === tok.val) tok.val = "\\b"; else if ("(" === tok.val || "[" === tok.val) {
        for (var opts = utils.extend({}, options), brackets = [], parens = [], stack = [], val = tok.val, str = tok.str, i = tok.idx - 1; ++i < str.length; ) {
          var ch = str[i];
          if ("\\" !== ch) {
            if ("(" === ch && (parens.push(ch), stack.push(ch)), "[" === ch && (brackets.push(ch), 
            stack.push(ch)), ")" === ch && (parens.pop(), stack.pop(), !stack.length)) {
              val += ch;
              break;
            }
            if ("]" === ch && (brackets.pop(), stack.pop(), !stack.length)) {
              val += ch;
              break;
            }
            val += ch;
          } else val += (!1 === opts.keepEscaping ? "" : ch) + str[++i];
        }
        tok.split = !1, tok.val = val.slice(1), tok.idx = i;
      }
    };
  }, utils.isQuantifier = function(str) {
    return /^(?:[0-9]?,[0-9]|[0-9],)$/.test(str);
  }, utils.stringifyArray = function(arr) {
    return [ utils.arrayify(arr).join("|") ];
  }, utils.arrayify = function(arr) {
    return void 0 === arr ? [] : "string" == typeof arr ? [ arr ] : arr;
  }, utils.isString = function(str) {
    return null != str && "string" == typeof str;
  }, utils.last = function(arr, n) {
    return arr[arr.length - (n || 1)];
  }, utils.escapeRegex = function(str) {
    return str.replace(/\\?([!^*?()[\]{}+?/])/g, "\\$1");
  };
}, function(module, exports, __webpack_require__) {
  var isBuffer = __webpack_require__(21), toString = Object.prototype.toString;
  module.exports = function(val) {
    if (void 0 === val) return "undefined";
    if (null === val) return "null";
    if (!0 === val || !1 === val || val instanceof Boolean) return "boolean";
    if ("string" == typeof val || val instanceof String) return "string";
    if ("number" == typeof val || val instanceof Number) return "number";
    if ("function" == typeof val || val instanceof Function) return "function";
    if (void 0 !== Array.isArray && Array.isArray(val)) return "array";
    if (val instanceof RegExp) return "regexp";
    if (val instanceof Date) return "date";
    var type = toString.call(val);
    return "[object RegExp]" === type ? "regexp" : "[object Date]" === type ? "date" : "[object Arguments]" === type ? "arguments" : "[object Error]" === type ? "error" : isBuffer(val) ? "buffer" : "[object Set]" === type ? "set" : "[object WeakSet]" === type ? "weakset" : "[object Map]" === type ? "map" : "[object WeakMap]" === type ? "weakmap" : "[object Symbol]" === type ? "symbol" : "[object Int8Array]" === type ? "int8array" : "[object Uint8Array]" === type ? "uint8array" : "[object Uint8ClampedArray]" === type ? "uint8clampedarray" : "[object Int16Array]" === type ? "int16array" : "[object Uint16Array]" === type ? "uint16array" : "[object Int32Array]" === type ? "int32array" : "[object Uint32Array]" === type ? "uint32array" : "[object Float32Array]" === type ? "float32array" : "[object Float64Array]" === type ? "float64array" : "object";
  };
}, function(module, exports, __webpack_require__) {
  exports.extend = Object.assign, exports.SourceMap = __webpack_require__(81), exports.sourceMapResolve = __webpack_require__(82), 
  exports.unixify = function(fp) {
    return fp.split(/\\+/).join("/");
  }, exports.isString = function(str) {
    return str && "string" == typeof str;
  }, exports.arrayify = function(val) {
    return "string" == typeof val ? [ val ] : val ? Array.isArray(val) ? val : [ val ] : [];
  }, exports.last = function(arr, n) {
    return arr[arr.length - (n || 1)];
  };
}, function(module, exports) {
  module.exports = require("path");
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(10);
  module.exports = function(num) {
    var type = typeOf(num);
    if ("string" === type) {
      if (!num.trim()) return !1;
    } else if ("number" !== type) return !1;
    return num - num + 1 >= 0;
  };
}, function(module, exports) {
  function toString(val) {
    return val ? Array.isArray(val) ? val.join(".") : val : "";
  }
  module.exports = function(obj, prop, a, b, c) {
    if (null === (val = obj) || "object" != typeof val && "function" != typeof val || !prop) return obj;
    var val;
    if (prop = toString(prop), a && (prop += "." + toString(a)), b && (prop += "." + toString(b)), 
    c && (prop += "." + toString(c)), prop in obj) return obj[prop];
    for (var segs = prop.split("."), len = segs.length, i = -1; obj && ++i < len; ) {
      for (var key = segs[i]; "\\" === key[key.length - 1]; ) key = key.slice(0, -1) + "." + segs[++i];
      obj = obj[key];
    }
    return obj;
  };
}, function(module, exports, __webpack_require__) {
  "undefined" != typeof process && "renderer" === process.type ? module.exports = __webpack_require__(76) : module.exports = __webpack_require__(78);
}, function(module, exports, __webpack_require__) {
  var MapCache = __webpack_require__(34);
  function FragmentCache(caches) {
    this.caches = caches || {};
  }
  FragmentCache.prototype = {
    cache: function(cacheName) {
      return this.caches[cacheName] || (this.caches[cacheName] = new MapCache);
    },
    set: function(cacheName, key, val) {
      var cache = this.cache(cacheName);
      return cache.set(key, val), cache;
    },
    has: function(cacheName, key) {
      return void 0 !== this.get(cacheName, key);
    },
    get: function(name, key) {
      var cache = this.cache(name);
      return "string" == typeof key ? cache.get(key) : cache;
    }
  }, module.exports = FragmentCache;
}, function(module, exports, __webpack_require__) {
  var parse = __webpack_require__(45), types = parse.types;
  module.exports = function(re, opts) {
    opts || (opts = {});
    var x, replimit = void 0 === opts.limit ? 25 : opts.limit;
    x = re, "[object RegExp]" === {}.toString.call(x) ? re = re.source : "string" != typeof re && (re = String(re));
    try {
      re = parse(re);
    } catch (err) {
      return !1;
    }
    var reps = 0;
    return function walk(node, starHeight) {
      if (node.type === types.REPETITION) {
        if (starHeight++, reps++, starHeight > 1) return !1;
        if (reps > replimit) return !1;
      }
      if (node.options) for (var i = 0, len = node.options.length; i < len; i++) {
        if (!walk({
          stack: node.options[i]
        }, starHeight)) return !1;
      }
      var stack = node.stack || node.value && node.value.stack;
      if (!stack) return !0;
      for (i = 0; i < stack.length; i++) {
        if (!walk(stack[i], starHeight)) return !1;
      }
      return !0;
    }(re, 0);
  };
}, function(module, exports, __webpack_require__) {
  var types = __webpack_require__(8), INTS = function() {
    return [ {
      type: types.RANGE,
      from: 48,
      to: 57
    } ];
  }, WORDS = function() {
    return [ {
      type: types.CHAR,
      value: 95
    }, {
      type: types.RANGE,
      from: 97,
      to: 122
    }, {
      type: types.RANGE,
      from: 65,
      to: 90
    } ].concat(INTS());
  }, WHITESPACE = function() {
    return [ {
      type: types.CHAR,
      value: 9
    }, {
      type: types.CHAR,
      value: 10
    }, {
      type: types.CHAR,
      value: 11
    }, {
      type: types.CHAR,
      value: 12
    }, {
      type: types.CHAR,
      value: 13
    }, {
      type: types.CHAR,
      value: 32
    }, {
      type: types.CHAR,
      value: 160
    }, {
      type: types.CHAR,
      value: 5760
    }, {
      type: types.CHAR,
      value: 6158
    }, {
      type: types.CHAR,
      value: 8192
    }, {
      type: types.CHAR,
      value: 8193
    }, {
      type: types.CHAR,
      value: 8194
    }, {
      type: types.CHAR,
      value: 8195
    }, {
      type: types.CHAR,
      value: 8196
    }, {
      type: types.CHAR,
      value: 8197
    }, {
      type: types.CHAR,
      value: 8198
    }, {
      type: types.CHAR,
      value: 8199
    }, {
      type: types.CHAR,
      value: 8200
    }, {
      type: types.CHAR,
      value: 8201
    }, {
      type: types.CHAR,
      value: 8202
    }, {
      type: types.CHAR,
      value: 8232
    }, {
      type: types.CHAR,
      value: 8233
    }, {
      type: types.CHAR,
      value: 8239
    }, {
      type: types.CHAR,
      value: 8287
    }, {
      type: types.CHAR,
      value: 12288
    }, {
      type: types.CHAR,
      value: 65279
    } ];
  };
  exports.words = function() {
    return {
      type: types.SET,
      set: WORDS(),
      not: !1
    };
  }, exports.notWords = function() {
    return {
      type: types.SET,
      set: WORDS(),
      not: !0
    };
  }, exports.ints = function() {
    return {
      type: types.SET,
      set: INTS(),
      not: !1
    };
  }, exports.notInts = function() {
    return {
      type: types.SET,
      set: INTS(),
      not: !0
    };
  }, exports.whitespace = function() {
    return {
      type: types.SET,
      set: WHITESPACE(),
      not: !1
    };
  }, exports.notWhitespace = function() {
    return {
      type: types.SET,
      set: WHITESPACE(),
      not: !0
    };
  }, exports.anyChar = function() {
    return {
      type: types.SET,
      set: [ {
        type: types.CHAR,
        value: 10
      }, {
        type: types.CHAR,
        value: 13
      }, {
        type: types.CHAR,
        value: 8232
      }, {
        type: types.CHAR,
        value: 8233
      } ],
      not: !0
    };
  };
}, function(module, exports, __webpack_require__) {
  var utils = __webpack_require__(9);
  function multiply(queue, n, options) {
    return utils.flatten(utils.repeat(utils.arrayify(queue), n));
  }
  function isEscaped(node) {
    return !0 === node.escaped;
  }
  function isType(node, type) {
    return void 0 !== node && node.type === type;
  }
  module.exports = function(braces, options) {
    braces.compiler.set("bos", (function() {
      this.output || (this.ast.queue = isEscaped(this.ast) ? [ this.ast.val ] : [], this.ast.count = 1);
    })).set("bracket", (function(node) {
      var close = node.close, open = node.escaped ? "\\[" : "[", negated = node.negated, inner = node.inner;
      "]-" === (inner = inner.replace(/\\(?=[\\\w]|$)/g, "\\\\")) && (inner = "\\]\\-"), 
      negated && -1 === inner.indexOf(".") && (inner += "."), negated && -1 === inner.indexOf("/") && (inner += "/");
      var val = open + negated + inner + close, queue = node.parent.queue, last = utils.arrayify(queue.pop());
      queue.push(utils.join(last, val)), queue.push.apply(queue, []);
    })).set("brace", (function(node) {
      return node.queue = isEscaped(node) ? [ node.val ] : [], node.count = 1, this.mapVisit(node.nodes);
    })).set("brace.open", (function(node) {
      node.parent.open = node.val;
    })).set("text", (function(node) {
      var queue = node.parent.queue, escaped = node.escaped, segs = [ node.val ];
      if (!1 === node.optimize && (options = utils.extend({}, options, {
        optimize: !1
      })), node.multiplier > 1 && (node.parent.count *= node.multiplier), !0 === options.quantifiers && utils.isQuantifier(node.val)) escaped = !0; else if (node.val.length > 1) {
        if (isType(node.parent, "brace") && !isEscaped(node)) {
          var expanded = utils.expand(node.val, options);
          if (segs = expanded.segs, expanded.isOptimized && (node.parent.isOptimized = !0), 
          !segs.length) {
            var val = expanded.val || node.val;
            !1 !== options.unescape && (val = (val = val.replace(/\\([,.])/g, "$1")).replace(/["'`]/g, "")), 
            segs = [ val ], escaped = !0;
          }
        }
      } else "," === node.val ? options.expand ? (node.parent.queue.push([ "" ]), segs = [ "" ]) : segs = [ "|" ] : escaped = !0;
      if (escaped && isType(node.parent, "brace") && (node.parent.nodes.length <= 4 && 1 === node.parent.count || node.parent.length <= 3) && (node.parent.escaped = !0), 
      function(node) {
        return Array.isArray(node.queue) && node.queue.length;
      }(node.parent)) {
        var last = utils.arrayify(queue.pop());
        node.parent.count > 1 && options.expand && (last = multiply(last, node.parent.count), 
        node.parent.count = 1), queue.push(utils.join(utils.flatten(last), segs.shift())), 
        queue.push.apply(queue, segs);
      } else node.parent.queue = segs;
    })).set("brace.close", (function(node) {
      var queue = node.parent.queue, prev = node.parent.parent, last = prev.queue.pop(), open = node.parent.open, close = node.val;
      open && close && function(node, options) {
        return !!node.parent.isOptimized || isType(node.parent, "brace") && !isEscaped(node.parent) && !0 !== options.expand;
      }(node, options) && (open = "(", close = ")");
      var ele = utils.last(queue);
      node.parent.count > 1 && options.expand && (ele = multiply(queue.pop(), node.parent.count), 
      node.parent.count = 1, queue.push(ele)), close && "string" == typeof ele && 1 === ele.length && (open = "", 
      close = ""), !function(node, options) {
        return isEscaped(node.parent) || !1 !== options.optimize;
      }(node, options) && !function(node, type) {
        if (1 === node.parent.queue.length) return !0;
        var nodes = node.parent.nodes;
        return 3 === nodes.length && isType(nodes[0], "brace.open") && !isType(nodes[1], "text") && isType(nodes[2], "brace.close");
      }(node) || node.parent.hasEmpty || (queue.push(utils.join(open, queue.pop() || "")), 
      queue = utils.flatten(utils.join(queue, close))), void 0 === last ? prev.queue = [ queue ] : prev.queue.push(utils.flatten(utils.join(last, queue)));
    })).set("eos", (function(node) {
      this.input || (!1 !== options.optimize ? this.output = utils.last(utils.flatten(this.ast.queue)) : Array.isArray(utils.last(this.ast.queue)) ? this.output = utils.flatten(this.ast.queue.pop()) : this.output = utils.flatten(this.ast.queue), 
      node.parent.count > 1 && options.expand && (this.output = multiply(this.output, node.parent.count)), 
      this.output = utils.arrayify(this.output), this.ast.queue = []);
    }));
  };
}, function(module, exports, __webpack_require__) {
  var extend = Object.assign;
  function getClosingQuote(str, ch, i, brackets) {
    var idx = str.indexOf(ch, i);
    return "\\" === str.charAt(idx - 1) ? getClosingQuote(str, ch, idx + 1) : idx;
  }
  function keepQuotes(ch, opts) {
    return !0 === opts.keepDoubleQuotes && '"' === ch || (!0 === opts.keepSingleQuotes && "'" === ch || opts.keepQuotes);
  }
  function keepEscaping(opts, str, idx) {
    return "function" == typeof opts.keepEscaping ? opts.keepEscaping(str, idx) : !0 === opts.keepEscaping || "\\" === str[idx + 1];
  }
  module.exports = function(str, options, fn) {
    if ("string" != typeof str) throw new TypeError("expected a string");
    "function" == typeof options && (fn = options, options = null), "string" == typeof options && (options = {
      sep: options
    });
    var brackets, opts = extend({
      sep: "."
    }, options), quotes = opts.quotes || [ '"', "'", "`" ];
    !0 === opts.brackets ? brackets = {
      "<": ">",
      "(": ")",
      "[": "]",
      "{": "}"
    } : opts.brackets && (brackets = opts.brackets);
    var closeIdx, tokens = [], stack = [], arr = [ "" ], sep = opts.sep, len = str.length, idx = -1;
    function expected() {
      if (brackets && stack.length) return brackets[stack[stack.length - 1]];
    }
    for (;++idx < len; ) {
      var ch = str[idx], next = str[idx + 1], tok = {
        val: ch,
        idx: idx,
        arr: arr,
        str: str
      };
      if (tokens.push(tok), "\\" !== ch) {
        if (brackets && brackets[ch]) {
          stack.push(ch);
          var e = expected(), i = idx + 1;
          if (-1 !== str.indexOf(e, i + 1)) for (;stack.length && i < len; ) {
            var s = str[++i];
            if ("\\" !== s) if (-1 === quotes.indexOf(s)) {
              if (e = expected(), stack.length && -1 === str.indexOf(e, i + 1)) break;
              brackets[s] ? stack.push(s) : e === s && stack.pop();
            } else i = getClosingQuote(str, s, i + 1); else s++;
          }
          if (-1 === (closeIdx = i)) {
            arr[arr.length - 1] += ch;
            continue;
          }
          ch = str.slice(idx, closeIdx + 1), tok.val = ch, tok.idx = idx = closeIdx;
        }
        if (-1 !== quotes.indexOf(ch)) {
          if (-1 === (closeIdx = getClosingQuote(str, ch, idx + 1))) {
            arr[arr.length - 1] += ch;
            continue;
          }
          ch = !0 === keepQuotes(ch, opts) ? str.slice(idx, closeIdx + 1) : str.slice(idx + 1, closeIdx), 
          tok.val = ch, tok.idx = idx = closeIdx;
        }
        "function" == typeof fn && (fn(tok, tokens), ch = tok.val, idx = tok.idx), tok.val !== sep || !1 === tok.split ? arr[arr.length - 1] += tok.val : arr.push("");
      } else tok.val = !0 === keepEscaping(opts, str, idx) ? ch + next : next, tok.escaped = !0, 
      "function" == typeof fn && fn(tok), arr[arr.length - 1] += tok.val, idx++;
    }
    return arr;
  };
}, function(module, exports) {
  function isBuffer(obj) {
    return !!obj.constructor && "function" == typeof obj.constructor.isBuffer && obj.constructor.isBuffer(obj);
  }
  module.exports = function(obj) {
    return null != obj && (isBuffer(obj) || function(obj) {
      return "function" == typeof obj.readFloatLE && "function" == typeof obj.slice && isBuffer(obj.slice(0, 0));
    }(obj) || !!obj._isBuffer);
  };
}, function(module, exports, __webpack_require__) {
  var cache, res = "";
  module.exports = function(str, num) {
    if ("string" != typeof str) throw new TypeError("expected a string");
    if (1 === num) return str;
    if (2 === num) return str + str;
    var max = str.length * num;
    if (cache !== str || void 0 === cache) cache = str, res = ""; else if (res.length >= max) return res.substr(0, max);
    for (;max > res.length && num > 1; ) 1 & num && (res += str), num >>= 1, str += str;
    return res = (res += str).substr(0, max);
  };
}, function(module, exports, __webpack_require__) {
  var Node = __webpack_require__(55), utils = __webpack_require__(9);
  function concatNodes(pos, node, parent, options) {
    node.orig = node.val;
    var prev = this.prev(), last = utils.last(prev.nodes), isEscaped = !1;
    if (node.val.length > 1) {
      var a = node.val.charAt(0), b = node.val.slice(-1);
      isEscaped = '"' === a && '"' === b || "'" === a && "'" === b || "`" === a && "`" === b;
    }
    if (isEscaped && !1 !== options.unescape && (node.val = node.val.slice(1, node.val.length - 1), 
    node.escaped = !0), node.match) {
      var match = node.match[1];
      match && -1 !== match.indexOf("}") || (match = node.match[0]);
      var val = match.replace(/\{/g, ",").replace(/\}/g, "");
      node.multiplier *= val.length, node.val = "";
    }
    "text" === last.type && 1 === last.multiplier && 1 === node.multiplier && node.val ? last.val += node.val : prev.push(node);
  }
  module.exports = function(braces, options) {
    braces.parser.set("bos", (function() {
      this.parsed || (this.ast = this.nodes[0] = new Node(this.ast));
    })).set("escape", (function() {
      var pos = this.position(), m = this.match(/^(?:\\(.)|\$\{)/);
      if (m) {
        var prev = this.prev(), last = utils.last(prev.nodes), node = pos(new Node({
          type: "text",
          multiplier: 1,
          val: m[0]
        }));
        if ("\\\\" === node.val) return node;
        if ("${" === node.val) for (var ch, str = this.input, idx = -1; ch = str[++idx]; ) if (this.consume(1), 
        node.val += ch, "\\" !== ch) {
          if ("}" === ch) break;
        } else node.val += str[++idx];
        return !1 !== this.options.unescape && (node.val = node.val.replace(/\\([{}])/g, "$1")), 
        '"' === last.val && '"' === this.input.charAt(0) ? (last.val = node.val, void this.consume(1)) : concatNodes.call(this, pos, node, prev, options);
      }
    })).set("bracket", (function() {
      var isInside = this.isInside("brace"), pos = this.position(), m = this.match(/^(?:\[([!^]?)([^\]]{2,}|\]-)(\]|[^*+?]+)|\[)/);
      if (m) {
        var prev = this.prev(), val = m[0], negated = m[1] ? "^" : "", inner = m[2] || "", close = m[3] || "";
        isInside && "brace" === prev.type && (prev.text = prev.text || "", prev.text += val);
        var esc = this.input.slice(0, 2);
        if ("" === inner && "\\]" === esc) {
          inner += esc, this.consume(2);
          for (var ch, str = this.input, idx = -1; ch = str[++idx]; ) {
            if (this.consume(1), "]" === ch) {
              close = ch;
              break;
            }
            inner += ch;
          }
        }
        return pos(new Node({
          type: "bracket",
          val: val,
          escaped: "]" !== close,
          negated: negated,
          inner: inner,
          close: close
        }));
      }
    })).set("multiplier", (function() {
      var isInside = this.isInside("brace"), pos = this.position(), m = this.match(/^\{((?:,|\{,+\})+)\}/);
      if (m) {
        this.multiplier = !0;
        var prev = this.prev(), val = m[0];
        isInside && "brace" === prev.type && (prev.text = prev.text || "", prev.text += val);
        var node = pos(new Node({
          type: "text",
          multiplier: 1,
          match: m,
          val: val
        }));
        return concatNodes.call(this, pos, node, prev, options);
      }
    })).set("brace.open", (function() {
      var pos = this.position(), m = this.match(/^\{(?!(?:[^\\}]?|,+)\})/);
      if (m) {
        var ch, prev = this.prev(), last = utils.last(prev.nodes);
        last && last.val && ("!" === (ch = last.val.slice(-1)) || "@" === ch || "*" === ch || "?" === ch || "+" === ch) && (last.optimize = !1);
        var open = pos(new Node({
          type: "brace.open",
          val: m[0]
        })), node = pos(new Node({
          type: "brace",
          nodes: []
        }));
        node.push(open), prev.push(node), this.push("brace", node);
      }
    })).set("brace.close", (function() {
      var pos = this.position(), m = this.match(/^\}/);
      if (m && m[0]) {
        var brace = this.pop("brace"), node = pos(new Node({
          type: "brace.close",
          val: m[0]
        }));
        if (!this.isType(brace, "brace")) {
          if (this.options.strict) throw new Error('missing opening "{"');
          return node.type = "text", node.multiplier = 0, node.escaped = !0, node;
        }
        var prev = this.prev(), last = utils.last(prev.nodes);
        if (last.text) if (")" === utils.last(last.nodes).val && /[!@*?+]\(/.test(last.text)) {
          var open = last.nodes[0], text = last.nodes[1];
          "brace.open" === open.type && text && "text" === text.type && (text.optimize = !1);
        }
        if (brace.nodes.length > 2) {
          var first = brace.nodes[1];
          "text" === first.type && "," === first.val && (brace.nodes.splice(1, 1), brace.nodes.push(first));
        }
        brace.push(node);
      }
    })).set("boundary", (function() {
      var pos = this.position(), m = this.match(/^[$^](?!\{)/);
      if (m) return pos(new Node({
        type: "text",
        val: m[0]
      }));
    })).set("nobrace", (function() {
      var isInside = this.isInside("brace"), pos = this.position(), m = this.match(/^\{[^,]?\}/);
      if (m) {
        var prev = this.prev(), val = m[0];
        return isInside && "brace" === prev.type && (prev.text = prev.text || "", prev.text += val), 
        pos(new Node({
          type: "text",
          multiplier: 0,
          val: val
        }));
      }
    })).set("text", (function() {
      var isInside = this.isInside("brace"), pos = this.position(), m = this.match(/^((?!\\)[^${}[\]])+/);
      if (m) {
        var prev = this.prev(), val = m[0];
        isInside && "brace" === prev.type && (prev.text = prev.text || "", prev.text += val);
        var node = pos(new Node({
          type: "text",
          multiplier: 1,
          val: val
        }));
        return concatNodes.call(this, pos, node, prev, options);
      }
    }));
  };
}, function(module, exports, __webpack_require__) {
  function Emitter(obj) {
    if (obj) return function(obj) {
      for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
      return obj;
    }(obj);
  }
  module.exports = Emitter, Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn), 
    this;
  }, Emitter.prototype.once = function(event, fn) {
    function on() {
      this.off(event, on), fn.apply(this, arguments);
    }
    return on.fn = fn, this.on(event, on), this;
  }, Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
    this;
    var cb, callbacks = this._callbacks["$" + event];
    if (!callbacks) return this;
    if (1 == arguments.length) return delete this._callbacks["$" + event], this;
    for (var i = 0; i < callbacks.length; i++) if ((cb = callbacks[i]) === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
    return 0 === callbacks.length && delete this._callbacks["$" + event], this;
  }, Emitter.prototype.emit = function(event) {
    this._callbacks = this._callbacks || {};
    for (var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event], i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
    if (callbacks) {
      i = 0;
      for (var len = (callbacks = callbacks.slice(0)).length; i < len; ++i) callbacks[i].apply(this, args);
    }
    return this;
  }, Emitter.prototype.listeners = function(event) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + event] || [];
  }, Emitter.prototype.hasListeners = function(event) {
    return !!this.listeners(event).length;
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1);
  module.exports = function(thisArg, method, target, val) {
    if (!isObject(thisArg) && "function" != typeof thisArg) throw new Error("object-visit expects `thisArg` to be an object.");
    if ("string" != typeof method) throw new Error("object-visit expects `method` name to be a string");
    if ("function" != typeof thisArg[method]) return thisArg;
    var args = [].slice.call(arguments, 3);
    for (var key in target = target || {}) {
      var arr = [ key, target[key] ].concat(args);
      thisArg[method].apply(thisArg, arr);
    }
    return thisArg;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(val) {
    return null != val && ("object" == typeof val || "function" == typeof val);
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(init) {
    if (!Array.isArray(init)) throw new TypeError("arr-union expects the first argument to be an array.");
    for (var len = arguments.length, i = 0; ++i < len; ) {
      var arg = arguments[i];
      if (arg) {
        Array.isArray(arg) || (arg = [ arg ]);
        for (var j = 0; j < arg.length; j++) {
          var ele = arg[j];
          init.indexOf(ele) >= 0 || init.push(ele);
        }
      }
    }
    return init;
  };
}, function(module, exports, __webpack_require__) {
  var split = __webpack_require__(20), extend = Object.assign, isPlainObject = __webpack_require__(29), isObject = __webpack_require__(26);
  function isValidKey(key) {
    return "__proto__" !== key && "constructor" !== key && "prototype" !== key;
  }
  module.exports = function(obj, prop, val) {
    if (!isObject(obj)) return obj;
    if (Array.isArray(prop) && (prop = [].concat.apply([], prop).join(".")), "string" != typeof prop) return obj;
    for (var keys = split(prop, {
      sep: ".",
      brackets: !0
    }).filter(isValidKey), len = keys.length, idx = -1, current = obj; ++idx < len; ) {
      var key = keys[idx];
      idx === len - 1 ? isPlainObject(current[key]) && isPlainObject(val) ? current[key] = extend({}, current[key], val) : current[key] = val : (isObject(current[key]) || (current[key] = {}), 
      current = current[key]);
    }
    return obj;
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1);
  function isObjectObject(o) {
    return !0 === isObject(o) && "[object Object]" === Object.prototype.toString.call(o);
  }
  module.exports = function(o) {
    var ctor, prot;
    return !1 !== isObjectObject(o) && ("function" == typeof (ctor = o.constructor) && (!1 !== isObjectObject(prot = ctor.prototype) && !1 !== prot.hasOwnProperty("isPrototypeOf")));
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1), hasValues = __webpack_require__(65), get = __webpack_require__(14);
  module.exports = function(val, prop) {
    return hasValues(isObject(val) && prop ? get(val, prop) : val);
  };
}, function(module, exports, __webpack_require__) {
  function isObject(val) {
    return val && "object" == typeof val && !Array.isArray(val);
  }
  function define(obj, key, val) {
    Object.defineProperty(obj, key, {
      configurable: !0,
      writable: !0,
      value: val
    });
  }
  module.exports = function base(app, options) {
    if (!isObject(app) && "function" != typeof app) throw new TypeError("expected an object or function");
    var opts = isObject(options) ? options : {}, prop = "string" == typeof opts.prop ? opts.prop : "fns";
    function use(type, fn, options) {
      var offset = 1;
      if ("string" == typeof type || Array.isArray(type) ? (fn = wrap(type, fn), offset++) : (options = fn, 
      fn = type), "function" != typeof fn) throw new TypeError("expected a function");
      var self = this || app, fns = self[prop], args = [].slice.call(arguments, offset);
      args.unshift(self), "function" == typeof opts.hook && opts.hook.apply(self, args);
      var val = fn.apply(self, args);
      return "function" == typeof val && -1 === fns.indexOf(val) && fns.push(val), self;
    }
    function wrap(type, fn) {
      return function plugin() {
        return this.type === type ? fn.apply(this, arguments) : plugin;
      };
    }
    return Array.isArray(app[prop]) || define(app, prop, []), define(app, "use", use), 
    define(app, "run", (function(val) {
      if (isObject(val)) {
        val.use && val.run || (define(val, prop, val[prop] || []), define(val, "use", use)), 
        val[prop] && -1 !== val[prop].indexOf(base) || val.use(base);
        for (var fns = (this || app)[prop], len = fns.length, idx = -1; ++idx < len; ) val.use(fns[idx]);
        return val;
      }
    })), app;
  };
}, function(module, exports, __webpack_require__) {
  var prevTime;
  function createDebug(namespace) {
    function debug() {
      if (debug.enabled) {
        var self = debug, curr = +new Date, ms = curr - (prevTime || curr);
        self.diff = ms, self.prev = prevTime, self.curr = curr, prevTime = curr;
        for (var args = new Array(arguments.length), i = 0; i < args.length; i++) args[i] = arguments[i];
        args[0] = exports.coerce(args[0]), "string" != typeof args[0] && args.unshift("%O");
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, (function(match, format) {
          if ("%%" === match) return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" == typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val), args.splice(index, 1), index--;
          }
          return match;
        })), exports.formatArgs.call(self, args);
        var logFn = debug.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
    }
    return debug.namespace = namespace, debug.enabled = exports.enabled(namespace), 
    debug.useColors = exports.useColors(), debug.color = function(namespace) {
      var i, hash = 0;
      for (i in namespace) hash = (hash << 5) - hash + namespace.charCodeAt(i), hash |= 0;
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }(namespace), "function" == typeof exports.init && exports.init(debug), debug;
  }
  (exports = module.exports = createDebug.debug = createDebug.default = createDebug).coerce = function(val) {
    return val instanceof Error ? val.stack || val.message : val;
  }, exports.disable = function() {
    exports.enable("");
  }, exports.enable = function(namespaces) {
    exports.save(namespaces), exports.names = [], exports.skips = [];
    for (var split = ("string" == typeof namespaces ? namespaces : "").split(/[\s,]+/), len = split.length, i = 0; i < len; i++) split[i] && ("-" === (namespaces = split[i].replace(/\*/g, ".*?"))[0] ? exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$")) : exports.names.push(new RegExp("^" + namespaces + "$")));
  }, exports.enabled = function(name) {
    var i, len;
    for (i = 0, len = exports.skips.length; i < len; i++) if (exports.skips[i].test(name)) return !1;
    for (i = 0, len = exports.names.length; i < len; i++) if (exports.names[i].test(name)) return !0;
    return !1;
  }, exports.humanize = __webpack_require__(77), exports.names = [], exports.skips = [], 
  exports.formatters = {};
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  var hasOwn = Object.prototype.hasOwnProperty;
  function MapCache(data) {
    this.__data__ = data || {};
  }
  module.exports = MapCache, MapCache.prototype.set = function(key, value) {
    return "__proto__" !== key && (this.__data__[key] = value), this;
  }, MapCache.prototype.get = function(key) {
    return "__proto__" === key ? void 0 : this.__data__[key];
  }, MapCache.prototype.has = function(key) {
    return "__proto__" !== key && hasOwn.call(this.__data__, key);
  }, MapCache.prototype.del = function(key) {
    return this.has(key) && delete this.__data__[key];
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(2), toRegex = __webpack_require__(3), extend = Object.assign, compilers = __webpack_require__(94), parsers = __webpack_require__(95), cache = __webpack_require__(96), utils = __webpack_require__(97);
  function nanomatch(list, patterns, options) {
    patterns = utils.arrayify(patterns), list = utils.arrayify(list);
    var len = patterns.length;
    if (0 === list.length || 0 === len) return [];
    if (1 === len) return nanomatch.match(list, patterns[0], options);
    for (var negated = !1, omit = [], keep = [], idx = -1; ++idx < len; ) {
      var pattern = patterns[idx];
      "string" == typeof pattern && 33 === pattern.charCodeAt(0) ? (omit.push.apply(omit, nanomatch.match(list, pattern.slice(1), options)), 
      negated = !0) : keep.push.apply(keep, nanomatch.match(list, pattern, options));
    }
    if (negated && 0 === keep.length) if (options && !1 === options.unixify) keep = list.slice(); else for (var unixify = utils.unixify(options), i = 0; i < list.length; i++) keep.push(unixify(list[i]));
    var matches = utils.diff(keep, omit);
    return options && !1 === options.nodupes ? matches : utils.unique(matches);
  }
  function memoize(type, pattern, options, fn) {
    var key = utils.createKey(type + "=" + pattern, options);
    if (options && !1 === options.cache) return fn(pattern, options);
    if (cache.has(type, key)) return cache.get(type, key);
    var val = fn(pattern, options);
    return cache.set(type, key, val), val;
  }
  nanomatch.match = function(list, pattern, options) {
    if (Array.isArray(pattern)) throw new TypeError("expected pattern to be a string");
    for (var unixify = utils.unixify(options), isMatch = memoize("match", pattern, options, nanomatch.matcher), matches = [], len = (list = utils.arrayify(list)).length, idx = -1; ++idx < len; ) {
      var ele = list[idx];
      (ele === pattern || isMatch(ele)) && matches.push(utils.value(ele, unixify, options));
    }
    if (void 0 === options) return utils.unique(matches);
    if (0 === matches.length) {
      if (!0 === options.failglob) throw new Error('no matches found for "' + pattern + '"');
      if (!0 === options.nonull || !0 === options.nullglob) return [ options.unescape ? utils.unescape(pattern) : pattern ];
    }
    return options.ignore && (matches = nanomatch.not(matches, options.ignore, options)), 
    !1 !== options.nodupes ? utils.unique(matches) : matches;
  }, nanomatch.isMatch = function(str, pattern, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    return !utils.isEmptyString(str) && !utils.isEmptyString(pattern) && (!!utils.equalsPattern(options)(str) || memoize("isMatch", pattern, options, nanomatch.matcher)(str));
  }, nanomatch.some = function(list, patterns, options) {
    "string" == typeof list && (list = [ list ]);
    for (var i = 0; i < list.length; i++) if (1 === nanomatch(list[i], patterns, options).length) return !0;
    return !1;
  }, nanomatch.every = function(list, patterns, options) {
    "string" == typeof list && (list = [ list ]);
    for (var i = 0; i < list.length; i++) if (1 !== nanomatch(list[i], patterns, options).length) return !1;
    return !0;
  }, nanomatch.any = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    if (utils.isEmptyString(str) || utils.isEmptyString(patterns)) return !1;
    "string" == typeof patterns && (patterns = [ patterns ]);
    for (var i = 0; i < patterns.length; i++) if (nanomatch.isMatch(str, patterns[i], options)) return !0;
    return !1;
  }, nanomatch.all = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    "string" == typeof patterns && (patterns = [ patterns ]);
    for (var i = 0; i < patterns.length; i++) if (!nanomatch.isMatch(str, patterns[i], options)) return !1;
    return !0;
  }, nanomatch.not = function(list, patterns, options) {
    var opts = extend({}, options), ignore = opts.ignore;
    delete opts.ignore, list = utils.arrayify(list);
    var matches = utils.diff(list, nanomatch(list, patterns, opts));
    return ignore && (matches = utils.diff(matches, nanomatch(list, ignore))), !1 !== opts.nodupes ? utils.unique(matches) : matches;
  }, nanomatch.contains = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    if ("string" == typeof patterns) {
      if (utils.isEmptyString(str) || utils.isEmptyString(patterns)) return !1;
      if (utils.equalsPattern(patterns, options)(str)) return !0;
      if (utils.containsPattern(patterns, options)(str)) return !0;
    }
    var opts = extend({}, options, {
      contains: !0
    });
    return nanomatch.any(str, patterns, opts);
  }, nanomatch.matchBase = function(pattern, options) {
    return !(pattern && -1 !== pattern.indexOf("/") || !options) && (!0 === options.basename || !0 === options.matchBase);
  }, nanomatch.matchKeys = function(obj, patterns, options) {
    if (!utils.isObject(obj)) throw new TypeError("expected the first argument to be an object");
    var keys = nanomatch(Object.keys(obj), patterns, options);
    return utils.pick(obj, keys);
  }, nanomatch.matcher = function matcher(pattern, options) {
    if (utils.isEmptyString(pattern)) return function() {
      return !1;
    };
    if (Array.isArray(pattern)) return function(patterns, options, matcher) {
      var matchers;
      return memoize("compose", String(patterns), options, (function() {
        return function(file) {
          if (!matchers) {
            matchers = [];
            for (var i = 0; i < patterns.length; i++) matchers.push(matcher(patterns[i], options));
          }
          for (var len = matchers.length; len--; ) if (!0 === matchers[len](file)) return !0;
          return !1;
        };
      }));
    }(pattern, options, matcher);
    if (pattern instanceof RegExp) return test(pattern);
    if (!utils.isString(pattern)) throw new TypeError("expected pattern to be an array, string or regex");
    if (!utils.hasSpecialChars(pattern)) return options && !0 === options.nocase && (pattern = pattern.toLowerCase()), 
    utils.matchPath(pattern, options);
    var re = nanomatch.makeRe(pattern, options);
    if (nanomatch.matchBase(pattern, options)) return utils.matchBasename(re, options);
    function test(regex) {
      var equals = utils.equalsPattern(options), unixify = utils.unixify(options);
      return function(str) {
        return !!equals(str) || !!regex.test(unixify(str));
      };
    }
    var matcherFn = test(re);
    return utils.define(matcherFn, "result", re.result), matcherFn;
  }, nanomatch.capture = function(pattern, str, options) {
    var re = nanomatch.makeRe(pattern, extend({
      capture: !0
    }, options)), unixify = utils.unixify(options);
    return memoize("capture", pattern, options, (function() {
      return function(string) {
        var match = re.exec(unixify(string));
        return match ? match.slice(1) : null;
      };
    }))(str);
  }, nanomatch.makeRe = function(pattern, options) {
    if (pattern instanceof RegExp) return pattern;
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    if (pattern.length > 65536) throw new Error("expected pattern to be less than 65536 characters");
    return memoize("makeRe", pattern, options, (function() {
      var opts = utils.extend({
        wrap: !1
      }, options), result = nanomatch.create(pattern, opts), regex = toRegex(result.output, opts);
      return utils.define(regex, "result", result), regex;
    }));
  }, nanomatch.create = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    return memoize("create", pattern, options, (function() {
      return nanomatch.compile(nanomatch.parse(pattern, options), options);
    }));
  }, nanomatch.parse = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    return memoize("parse", pattern, options, (function() {
      var snapdragon = utils.instantiate(null, options);
      parsers(snapdragon, options);
      var ast = snapdragon.parse(pattern, options);
      return utils.define(ast, "snapdragon", snapdragon), ast.input = pattern, ast;
    }));
  }, nanomatch.compile = function(ast, options) {
    return "string" == typeof ast && (ast = nanomatch.parse(ast, options)), memoize("compile", ast.input, options, (function() {
      var snapdragon = utils.instantiate(ast, options);
      return compilers(snapdragon, options), snapdragon.compile(ast, options);
    }));
  }, nanomatch.clearCache = function() {
    nanomatch.cache.__data__ = {};
  }, nanomatch.compilers = compilers, nanomatch.parsers = parsers, nanomatch.cache = cache, 
  module.exports = nanomatch;
}, function(module, exports, __webpack_require__) {
  function diffArray(one, two) {
    if (!Array.isArray(two)) return one.slice();
    for (var tlen = two.length, olen = one.length, idx = -1, arr = []; ++idx < olen; ) {
      for (var ele = one[idx], hasEle = !1, i = 0; i < tlen; i++) {
        if (ele === two[i]) {
          hasEle = !0;
          break;
        }
      }
      !1 === hasEle && arr.push(ele);
    }
    return arr;
  }
  module.exports = function(arr) {
    for (var len = arguments.length, idx = 0; ++idx < len; ) arr = diffArray(arr, arguments[idx]);
    return arr;
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1);
  module.exports = function(obj, keys) {
    if (!isObject(obj) && "function" != typeof obj) return {};
    var res = {};
    if ("string" == typeof keys) return keys in obj && (res[keys] = obj[keys]), res;
    for (var len = keys.length, idx = -1; ++idx < len; ) {
      var key = keys[idx];
      key in obj && (res[key] = obj[key]);
    }
    return res;
  };
}, function(module, exports, __webpack_require__) {
  var extend = Object.assign, unique = __webpack_require__(6), toRegex = __webpack_require__(3), compilers = __webpack_require__(39), parsers = __webpack_require__(41), Extglob = __webpack_require__(103), utils = __webpack_require__(42);
  function extglob(pattern, options) {
    return extglob.create(pattern, options).output;
  }
  extglob.match = function(list, pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    list = utils.arrayify(list);
    for (var isMatch = extglob.matcher(pattern, options), len = list.length, idx = -1, matches = []; ++idx < len; ) {
      var ele = list[idx];
      isMatch(ele) && matches.push(ele);
    }
    if (void 0 === options) return unique(matches);
    if (0 === matches.length) {
      if (!0 === options.failglob) throw new Error('no matches found for "' + pattern + '"');
      if (!0 === options.nonull || !0 === options.nullglob) return [ pattern.split("\\").join("") ];
    }
    return !1 !== options.nodupes ? unique(matches) : matches;
  }, extglob.isMatch = function(str, pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    if ("string" != typeof str) throw new TypeError("expected a string");
    return pattern === str || ("" === pattern || " " === pattern || "." === pattern ? pattern === str : utils.memoize("isMatch", pattern, options, extglob.matcher)(str));
  }, extglob.contains = function(str, pattern, options) {
    if ("string" != typeof str) throw new TypeError("expected a string");
    if ("" === pattern || " " === pattern || "." === pattern) return pattern === str;
    var opts = extend({}, options, {
      contains: !0
    });
    return opts.strictClose = !1, opts.strictOpen = !1, extglob.isMatch(str, pattern, opts);
  }, extglob.matcher = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    return utils.memoize("matcher", pattern, options, (function() {
      var re = extglob.makeRe(pattern, options);
      return function(str) {
        return re.test(str);
      };
    }));
  }, extglob.create = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    return utils.memoize("create", pattern, options, (function() {
      var ext = new Extglob(options), ast = ext.parse(pattern, options);
      return ext.compile(ast, options);
    }));
  }, extglob.capture = function(pattern, str, options) {
    var re = extglob.makeRe(pattern, extend({
      capture: !0
    }, options));
    return utils.memoize("capture", pattern, options, (function() {
      return function(string) {
        var match = re.exec(string);
        return match ? match.slice(1) : null;
      };
    }))(str);
  }, extglob.makeRe = function(pattern, options) {
    if (pattern instanceof RegExp) return pattern;
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    if (pattern.length > 65536) throw new Error("expected pattern to be less than 65536 characters");
    var regex = utils.memoize("makeRe", pattern, options, (function() {
      var opts = extend({
        strictErrors: !1
      }, options);
      !0 === opts.strictErrors && (opts.strict = !0);
      var res = extglob.create(pattern, opts);
      return toRegex(res.output, opts);
    }));
    if (regex.source.length > 65536) throw new SyntaxError("potentially malicious regex detected");
    return regex;
  }, extglob.cache = utils.cache, extglob.clearCache = function() {
    extglob.cache.__data__ = {};
  }, extglob.Extglob = Extglob, extglob.compilers = compilers, extglob.parsers = parsers, 
  module.exports = extglob;
}, function(module, exports, __webpack_require__) {
  var brackets = __webpack_require__(40);
  module.exports = function(extglob) {
    function star() {
      return "function" == typeof extglob.options.star ? extglob.options.star.apply(this, arguments) : "string" == typeof extglob.options.star ? extglob.options.star : ".*?";
    }
    extglob.use(brackets.compilers), extglob.compiler.set("escape", (function(node) {
      return this.emit(node.val, node);
    })).set("dot", (function(node) {
      return this.emit("\\" + node.val, node);
    })).set("qmark", (function(node) {
      var val = "[^\\\\/.]", prev = this.prev();
      if ("(" === node.parsed.slice(-1)) {
        var ch = node.rest.charAt(0);
        return "!" !== ch && "=" !== ch && ":" !== ch ? this.emit(val, node) : this.emit(node.val, node);
      }
      return "text" === prev.type && prev.val || node.val.length > 1 && (val += "{" + node.val.length + "}"), 
      this.emit(val, node);
    })).set("plus", (function(node) {
      var prev = node.parsed.slice(-1);
      if ("]" === prev || ")" === prev) return this.emit(node.val, node);
      var ch = this.output.slice(-1);
      return !this.output || /[?*+]/.test(ch) && "bracket" !== node.parent.type ? this.emit("\\+", node) : /\w/.test(ch) && !node.inside ? this.emit("+\\+?", node) : this.emit("+", node);
    })).set("star", (function(node) {
      var prev = this.prev(), prefix = "text" !== prev.type && "escape" !== prev.type ? "(?!\\.)" : "";
      return this.emit(prefix + star.call(this, node), node);
    })).set("paren", (function(node) {
      return this.mapVisit(node.nodes);
    })).set("paren.open", (function(node) {
      var capture = this.options.capture ? "(" : "";
      switch (node.parent.prefix) {
       case "!":
       case "^":
        return this.emit(capture + "(?:(?!(?:", node);

       case "*":
       case "+":
       case "?":
       case "@":
        return this.emit(capture + "(?:", node);

       default:
        var val = node.val;
        return !0 === this.options.bash ? val = "\\" + val : this.options.capture || "(" !== val || "?" === node.parent.rest[0] || (val += "?:"), 
        this.emit(val, node);
      }
    })).set("paren.close", (function(node) {
      var capture = this.options.capture ? ")" : "";
      switch (node.prefix) {
       case "!":
       case "^":
        var prefix = /^(\)|$)/.test(node.rest) ? "$" : "", str = star.call(this, node);
        return node.parent.hasSlash && !this.options.star && !1 !== this.options.slash && (str = ".*?"), 
        this.emit(prefix + "))" + str + ")" + capture, node);

       case "*":
       case "+":
       case "?":
        return this.emit(")" + node.prefix + capture, node);

       case "@":
        return this.emit(")" + capture, node);

       default:
        var val = (!0 === this.options.bash ? "\\" : "") + ")";
        return this.emit(val, node);
      }
    })).set("text", (function(node) {
      var val = node.val.replace(/[\[\]]/g, "\\$&");
      return this.emit(val, node);
    }));
  };
}, function(module, exports, __webpack_require__) {
  var compilers = __webpack_require__(99), parsers = __webpack_require__(101), debug = __webpack_require__(15)("expand-brackets"), extend = Object.assign, Snapdragon = __webpack_require__(7), toRegex = __webpack_require__(3);
  function brackets(pattern, options) {
    return debug("initializing from <%s>", __filename), brackets.create(pattern, options).output;
  }
  brackets.match = function(arr, pattern, options) {
    arr = [].concat(arr);
    for (var opts = extend({}, options), isMatch = brackets.matcher(pattern, opts), len = arr.length, idx = -1, res = []; ++idx < len; ) {
      var ele = arr[idx];
      isMatch(ele) && res.push(ele);
    }
    if (0 === res.length) {
      if (!0 === opts.failglob) throw new Error('no matches found for "' + pattern + '"');
      if (!0 === opts.nonull || !0 === opts.nullglob) return [ pattern.split("\\").join("") ];
    }
    return res;
  }, brackets.isMatch = function(str, pattern, options) {
    return brackets.matcher(pattern, options)(str);
  }, brackets.matcher = function(pattern, options) {
    var re = brackets.makeRe(pattern, options);
    return function(str) {
      return re.test(str);
    };
  }, brackets.makeRe = function(pattern, options) {
    var res = brackets.create(pattern, options), opts = extend({
      strictErrors: !1
    }, options);
    return toRegex(res.output, opts);
  }, brackets.create = function(pattern, options) {
    var snapdragon = options && options.snapdragon || new Snapdragon(options);
    compilers(snapdragon), parsers(snapdragon);
    var ast = snapdragon.parse(pattern, options);
    ast.input = pattern;
    var res = snapdragon.compile(ast, options);
    return res.input = pattern, res;
  }, brackets.compilers = compilers, brackets.parsers = parsers, module.exports = brackets;
}, function(module, exports, __webpack_require__) {
  var brackets = __webpack_require__(40), define = __webpack_require__(0), TEXT_REGEX = "([!@*?+]?\\(|\\)|[*?.+\\\\]|\\[:?(?=.*\\])|:?\\])+", not = __webpack_require__(42).createRegex(TEXT_REGEX);
  module.exports.TEXT_REGEX = TEXT_REGEX, module.exports = function(extglob) {
    extglob.state = extglob.state || {}, extglob.use(brackets.parsers), extglob.parser.sets.paren = extglob.parser.sets.paren || [], 
    extglob.parser.capture("paren.open", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^([!@*?+])?\(/);
      if (m) {
        var prev = this.prev(), prefix = m[1], open = pos({
          type: "paren.open",
          parsed: parsed,
          val: m[0]
        }), node = pos({
          type: "paren",
          prefix: prefix,
          nodes: [ open ]
        });
        "!" === prefix && "paren" === prev.type && "!" === prev.prefix && (prev.prefix = "@", 
        node.prefix = "@"), define(node, "rest", this.input), define(node, "parsed", parsed), 
        define(node, "parent", prev), define(open, "parent", node), this.push("paren", node), 
        prev.nodes.push(node);
      }
    })).capture("paren.close", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\)/);
      if (m) {
        var parent = this.pop("paren"), node = pos({
          type: "paren.close",
          rest: this.input,
          parsed: parsed,
          val: m[0]
        });
        if (!this.isType(parent, "paren")) {
          if (this.options.strict) throw new Error('missing opening paren: "("');
          return node.escaped = !0, node;
        }
        node.prefix = parent.prefix, parent.nodes.push(node), define(node, "parent", parent);
      }
    })).capture("escape", (function() {
      var pos = this.position(), m = this.match(/^\\(.)/);
      if (m) return pos({
        type: "escape",
        val: m[0],
        ch: m[1]
      });
    })).capture("qmark", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\?+(?!\()/);
      if (m) return extglob.state.metachar = !0, pos({
        type: "qmark",
        rest: this.input,
        parsed: parsed,
        val: m[0]
      });
    })).capture("star", /^\*(?!\()/).capture("plus", /^\+(?!\()/).capture("dot", /^\./).capture("text", not);
  };
}, function(module, exports, __webpack_require__) {
  var regex = __webpack_require__(5), Cache = __webpack_require__(16), utils = module.exports, cache = utils.cache = new Cache;
  utils.arrayify = function(val) {
    return Array.isArray(val) ? val : [ val ];
  }, utils.memoize = function(type, pattern, options, fn) {
    var key = utils.createKey(type + pattern, options);
    if (cache.has(type, key)) return cache.get(type, key);
    var val = fn(pattern, options);
    return options && !1 === options.cache || cache.set(type, key, val), val;
  }, utils.createKey = function(pattern, options) {
    var key = pattern;
    if (void 0 === options) return key;
    for (var prop in options) key += ";" + prop + "=" + String(options[prop]);
    return key;
  }, utils.createRegex = function(str) {
    return regex(str, {
      contains: !0,
      strictClose: !1
    });
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(2), braces = __webpack_require__(44), toRegex = __webpack_require__(3), extend = Object.assign, compilers = __webpack_require__(93), parsers = __webpack_require__(104), cache = __webpack_require__(105), utils = __webpack_require__(106);
  function micromatch(list, patterns, options) {
    patterns = utils.arrayify(patterns), list = utils.arrayify(list);
    var len = patterns.length;
    if (0 === list.length || 0 === len) return [];
    if (1 === len) return micromatch.match(list, patterns[0], options);
    for (var omit = [], keep = [], idx = -1; ++idx < len; ) {
      var pattern = patterns[idx];
      "string" == typeof pattern && 33 === pattern.charCodeAt(0) ? omit.push.apply(omit, micromatch.match(list, pattern.slice(1), options)) : keep.push.apply(keep, micromatch.match(list, pattern, options));
    }
    var matches = utils.diff(keep, omit);
    return options && !1 === options.nodupes ? matches : utils.unique(matches);
  }
  function isEmptyString(val) {
    return "" === String(val) || "./" === String(val);
  }
  function memoize(type, pattern, options, fn) {
    var key = utils.createKey(type + "=" + pattern, options);
    if (options && !1 === options.cache) return fn(pattern, options);
    if (cache.has(type, key)) return cache.get(type, key);
    var val = fn(pattern, options);
    return cache.set(type, key, val), val;
  }
  micromatch.match = function(list, pattern, options) {
    if (Array.isArray(pattern)) throw new TypeError("expected pattern to be a string");
    for (var unixify = utils.unixify(options), isMatch = memoize("match", pattern, options, micromatch.matcher), matches = [], len = (list = utils.arrayify(list)).length, idx = -1; ++idx < len; ) {
      var ele = list[idx];
      (ele === pattern || isMatch(ele)) && matches.push(utils.value(ele, unixify, options));
    }
    if (void 0 === options) return utils.unique(matches);
    if (0 === matches.length) {
      if (!0 === options.failglob) throw new Error('no matches found for "' + pattern + '"');
      if (!0 === options.nonull || !0 === options.nullglob) return [ options.unescape ? utils.unescape(pattern) : pattern ];
    }
    return options.ignore && (matches = micromatch.not(matches, options.ignore, options)), 
    !1 !== options.nodupes ? utils.unique(matches) : matches;
  }, micromatch.isMatch = function(str, pattern, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    return !isEmptyString(str) && !isEmptyString(pattern) && (!!utils.equalsPattern(options)(str) || memoize("isMatch", pattern, options, micromatch.matcher)(str));
  }, micromatch.some = function(list, patterns, options) {
    "string" == typeof list && (list = [ list ]);
    for (var i = 0; i < list.length; i++) if (1 === micromatch(list[i], patterns, options).length) return !0;
    return !1;
  }, micromatch.every = function(list, patterns, options) {
    "string" == typeof list && (list = [ list ]);
    for (var i = 0; i < list.length; i++) if (1 !== micromatch(list[i], patterns, options).length) return !1;
    return !0;
  }, micromatch.any = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    if (isEmptyString(str) || isEmptyString(patterns)) return !1;
    "string" == typeof patterns && (patterns = [ patterns ]);
    for (var i = 0; i < patterns.length; i++) if (micromatch.isMatch(str, patterns[i], options)) return !0;
    return !1;
  }, micromatch.all = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    "string" == typeof patterns && (patterns = [ patterns ]);
    for (var i = 0; i < patterns.length; i++) if (!micromatch.isMatch(str, patterns[i], options)) return !1;
    return !0;
  }, micromatch.not = function(list, patterns, options) {
    var opts = extend({}, options), ignore = opts.ignore;
    delete opts.ignore;
    var unixify = utils.unixify(opts);
    list = utils.arrayify(list).map(unixify);
    var matches = utils.diff(list, micromatch(list, patterns, opts));
    return ignore && (matches = utils.diff(matches, micromatch(list, ignore))), !1 !== opts.nodupes ? utils.unique(matches) : matches;
  }, micromatch.contains = function(str, patterns, options) {
    if ("string" != typeof str) throw new TypeError('expected a string: "' + util.inspect(str) + '"');
    if ("string" == typeof patterns) {
      if (isEmptyString(str) || isEmptyString(patterns)) return !1;
      if (utils.equalsPattern(patterns, options)(str)) return !0;
      if (utils.containsPattern(patterns, options)(str)) return !0;
    }
    var opts = extend({}, options, {
      contains: !0
    });
    return micromatch.any(str, patterns, opts);
  }, micromatch.matchBase = function(pattern, options) {
    return !(pattern && -1 !== pattern.indexOf("/") || !options) && (!0 === options.basename || !0 === options.matchBase);
  }, micromatch.matchKeys = function(obj, patterns, options) {
    if (!utils.isObject(obj)) throw new TypeError("expected the first argument to be an object");
    var keys = micromatch(Object.keys(obj), patterns, options);
    return utils.pick(obj, keys);
  }, micromatch.matcher = function matcher(pattern, options) {
    if (Array.isArray(pattern)) return function(patterns, options, matcher) {
      var matchers;
      return memoize("compose", String(patterns), options, (function() {
        return function(file) {
          if (!matchers) {
            matchers = [];
            for (var i = 0; i < patterns.length; i++) matchers.push(matcher(patterns[i], options));
          }
          for (var len = matchers.length; len--; ) if (!0 === matchers[len](file)) return !0;
          return !1;
        };
      }));
    }(pattern, options, matcher);
    if (pattern instanceof RegExp) return test(pattern);
    if (!utils.isString(pattern)) throw new TypeError("expected pattern to be an array, string or regex");
    if (!utils.hasSpecialChars(pattern)) return options && !0 === options.nocase && (pattern = pattern.toLowerCase()), 
    utils.matchPath(pattern, options);
    var re = micromatch.makeRe(pattern, options);
    if (micromatch.matchBase(pattern, options)) return utils.matchBasename(re, options);
    function test(regex) {
      var equals = utils.equalsPattern(options), unixify = utils.unixify(options);
      return function(str) {
        return !!equals(str) || !!regex.test(unixify(str));
      };
    }
    var fn = test(re);
    return Object.defineProperty(fn, "result", {
      configurable: !0,
      enumerable: !1,
      value: re.result
    }), fn;
  }, micromatch.capture = function(pattern, str, options) {
    var re = micromatch.makeRe(pattern, extend({
      capture: !0
    }, options)), unixify = utils.unixify(options);
    return memoize("capture", pattern, options, (function() {
      return function(string) {
        var match = re.exec(unixify(string));
        return match ? match.slice(1) : null;
      };
    }))(str);
  }, micromatch.makeRe = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected pattern to be a string");
    if (pattern.length > 65536) throw new Error("expected pattern to be less than 65536 characters");
    return memoize("makeRe", pattern, options, (function() {
      var result = micromatch.create(pattern, options), ast_array = [], output = result.map((function(obj) {
        return obj.ast.state = obj.state, ast_array.push(obj.ast), obj.output;
      })), regex = toRegex(output.join("|"), options);
      return Object.defineProperty(regex, "result", {
        configurable: !0,
        enumerable: !1,
        value: ast_array
      }), regex;
    }));
  }, micromatch.braces = function(pattern, options) {
    if ("string" != typeof pattern && !Array.isArray(pattern)) throw new TypeError("expected pattern to be an array or string");
    return memoize("braces", pattern, options, (function() {
      return options && !0 === options.nobrace || !/\{.*\}/.test(pattern) ? utils.arrayify(pattern) : braces(pattern, options);
    }));
  }, micromatch.braceExpand = function(pattern, options) {
    var opts = extend({}, options, {
      expand: !0
    });
    return micromatch.braces(pattern, opts);
  }, micromatch.create = function(pattern, options) {
    return memoize("create", pattern, options, (function() {
      for (var str, opts, len = (pattern = micromatch.braces(pattern, options)).length, idx = -1, res = []; ++idx < len; ) res.push((str = pattern[idx], 
      opts = options, micromatch.compile(micromatch.parse(str, opts), opts)));
      return res;
    }));
  }, micromatch.parse = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    return memoize("parse", pattern, options, (function() {
      var snapdragon = utils.instantiate(null, options);
      parsers(snapdragon, options);
      var ast = snapdragon.parse(pattern, options);
      return utils.define(ast, "snapdragon", snapdragon), ast.input = pattern, ast;
    }));
  }, micromatch.compile = function(ast, options) {
    return "string" == typeof ast && (ast = micromatch.parse(ast, options)), memoize("compile", ast.input, options, (function() {
      var snapdragon = utils.instantiate(ast, options);
      return compilers(snapdragon, options), snapdragon.compile(ast, options);
    }));
  }, micromatch.clearCache = function() {
    micromatch.cache.caches = {};
  }, micromatch.compilers = compilers, micromatch.parsers = parsers, micromatch.caches = cache.caches, 
  module.exports = micromatch;
}, function(module, exports, __webpack_require__) {
  var toRegex = __webpack_require__(3), unique = __webpack_require__(6), extend = Object.assign, compilers = __webpack_require__(19), parsers = __webpack_require__(23), Braces = __webpack_require__(57), utils = __webpack_require__(9), cache = {};
  function braces(pattern, options) {
    var key = utils.createKey(String(pattern), options), arr = [], disabled = options && !1 === options.cache;
    if (!disabled && cache.hasOwnProperty(key)) return cache[key];
    if (Array.isArray(pattern)) for (var i = 0; i < pattern.length; i++) arr.push.apply(arr, braces.create(pattern[i], options)); else arr = braces.create(pattern, options);
    return options && !0 === options.nodupes && (arr = unique(arr)), disabled || (cache[key] = arr), 
    arr;
  }
  function memoize(type, pattern, options, fn) {
    var key = utils.createKey(type + ":" + pattern, options);
    if (options && !1 === options.cache) return braces.clearCache(), fn(pattern, options);
    if (cache.hasOwnProperty(key)) return cache[key];
    var res = fn(pattern, options);
    return cache[key] = res, res;
  }
  braces.expand = function(pattern, options) {
    return braces.create(pattern, extend({}, options, {
      expand: !0
    }));
  }, braces.optimize = function(pattern, options) {
    return braces.create(pattern, options);
  }, braces.create = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    var maxLength = options && options.maxLength || 65536;
    if (pattern.length >= maxLength) throw new Error("expected pattern to be less than " + maxLength + " characters");
    return memoize("create", pattern, options, (function() {
      if ("" === pattern || pattern.length < 3) return [ pattern ];
      if (utils.isEmptySets(pattern)) return [];
      if (utils.isQuotedString(pattern)) return [ pattern.slice(1, -1) ];
      var proto = new Braces(options), result = options && !0 === options.expand ? proto.expand(pattern, options) : proto.optimize(pattern, options), arr = result.output;
      return options && !0 === options.noempty && (arr = arr.filter(Boolean)), options && !0 === options.nodupes && (arr = unique(arr)), 
      Object.defineProperty(arr, "result", {
        enumerable: !1,
        value: result
      }), arr;
    }));
  }, braces.makeRe = function(pattern, options) {
    if ("string" != typeof pattern) throw new TypeError("expected a string");
    var maxLength = options && options.maxLength || 65536;
    if (pattern.length >= maxLength) throw new Error("expected pattern to be less than " + maxLength + " characters");
    return memoize("makeRe", pattern, options, (function() {
      var arr = braces(pattern, options), opts = extend({
        strictErrors: !1
      }, options);
      return toRegex(arr, opts);
    }));
  }, braces.parse = function(pattern, options) {
    return new Braces(options).parse(pattern, options);
  }, braces.compile = function(ast, options) {
    return new Braces(options).compile(ast, options);
  }, braces.clearCache = function() {
    cache = braces.cache = {};
  }, braces.Braces = Braces, braces.compilers = compilers, braces.parsers = parsers, 
  braces.cache = cache, module.exports = braces;
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(46), types = __webpack_require__(8), sets = __webpack_require__(18), positions = __webpack_require__(47);
  module.exports = function(regexpStr) {
    var l, c, i = 0, start = {
      type: types.ROOT,
      stack: []
    }, lastGroup = start, last = start.stack, groupStack = [], repeatErr = function(i) {
      util.error(regexpStr, "Nothing to repeat at column " + (i - 1));
    }, str = util.strToChars(regexpStr);
    for (l = str.length; i < l; ) switch (c = str[i++]) {
     case "\\":
      switch (c = str[i++]) {
       case "b":
        last.push(positions.wordBoundary());
        break;

       case "B":
        last.push(positions.nonWordBoundary());
        break;

       case "w":
        last.push(sets.words());
        break;

       case "W":
        last.push(sets.notWords());
        break;

       case "d":
        last.push(sets.ints());
        break;

       case "D":
        last.push(sets.notInts());
        break;

       case "s":
        last.push(sets.whitespace());
        break;

       case "S":
        last.push(sets.notWhitespace());
        break;

       default:
        /\d/.test(c) ? last.push({
          type: types.REFERENCE,
          value: parseInt(c, 10)
        }) : last.push({
          type: types.CHAR,
          value: c.charCodeAt(0)
        });
      }
      break;

     case "^":
      last.push(positions.begin());
      break;

     case "$":
      last.push(positions.end());
      break;

     case "[":
      var not;
      "^" === str[i] ? (not = !0, i++) : not = !1;
      var classTokens = util.tokenizeClass(str.slice(i), regexpStr);
      i += classTokens[1], last.push({
        type: types.SET,
        set: classTokens[0],
        not: not
      });
      break;

     case ".":
      last.push(sets.anyChar());
      break;

     case "(":
      var group = {
        type: types.GROUP,
        stack: [],
        remember: !0
      };
      "?" === (c = str[i]) && (c = str[i + 1], i += 2, "=" === c ? group.followedBy = !0 : "!" === c ? group.notFollowedBy = !0 : ":" !== c && util.error(regexpStr, "Invalid group, character '" + c + "' after '?' at column " + (i - 1)), 
      group.remember = !1), last.push(group), groupStack.push(lastGroup), lastGroup = group, 
      last = group.stack;
      break;

     case ")":
      0 === groupStack.length && util.error(regexpStr, "Unmatched ) at column " + (i - 1)), 
      last = (lastGroup = groupStack.pop()).options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
      break;

     case "|":
      lastGroup.options || (lastGroup.options = [ lastGroup.stack ], delete lastGroup.stack);
      var stack = [];
      lastGroup.options.push(stack), last = stack;
      break;

     case "{":
      var min, max, rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i));
      null !== rs ? (0 === last.length && repeatErr(i), min = parseInt(rs[1], 10), max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : 1 / 0 : min, 
      i += rs[0].length, last.push({
        type: types.REPETITION,
        min: min,
        max: max,
        value: last.pop()
      })) : last.push({
        type: types.CHAR,
        value: 123
      });
      break;

     case "?":
      0 === last.length && repeatErr(i), last.push({
        type: types.REPETITION,
        min: 0,
        max: 1,
        value: last.pop()
      });
      break;

     case "+":
      0 === last.length && repeatErr(i), last.push({
        type: types.REPETITION,
        min: 1,
        max: 1 / 0,
        value: last.pop()
      });
      break;

     case "*":
      0 === last.length && repeatErr(i), last.push({
        type: types.REPETITION,
        min: 0,
        max: 1 / 0,
        value: last.pop()
      });
      break;

     default:
      last.push({
        type: types.CHAR,
        value: c.charCodeAt(0)
      });
    }
    return 0 !== groupStack.length && util.error(regexpStr, "Unterminated group"), start;
  }, module.exports.types = types;
}, function(module, exports, __webpack_require__) {
  var types = __webpack_require__(8), sets = __webpack_require__(18), SLSH = {
    0: 0,
    t: 9,
    n: 10,
    v: 11,
    f: 12,
    r: 13
  };
  exports.strToChars = function(str) {
    return str = str.replace(/(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|(0?[0-7]{2})|c([@A-Z\[\\\]\^?])|([0tnvfr]))/g, (function(s, b, lbs, a16, b16, c8, dctrl, eslsh) {
      if (lbs) return s;
      var code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : c8 ? parseInt(c8, 8) : dctrl ? "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?".indexOf(dctrl) : SLSH[eslsh], c = String.fromCharCode(code);
      return /[\[\]{}\^$.|?*+()]/.test(c) && (c = "\\" + c), c;
    }));
  }, exports.tokenizeClass = function(str, regexpStr) {
    for (var rs, c, tokens = [], regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(?:\\)?([^\]]))|(\])|(?:\\)?(.)/g; null != (rs = regexp.exec(str)); ) if (rs[1]) tokens.push(sets.words()); else if (rs[2]) tokens.push(sets.ints()); else if (rs[3]) tokens.push(sets.whitespace()); else if (rs[4]) tokens.push(sets.notWords()); else if (rs[5]) tokens.push(sets.notInts()); else if (rs[6]) tokens.push(sets.notWhitespace()); else if (rs[7]) tokens.push({
      type: types.RANGE,
      from: (rs[8] || rs[9]).charCodeAt(0),
      to: rs[10].charCodeAt(0)
    }); else {
      if (!(c = rs[12])) return [ tokens, regexp.lastIndex ];
      tokens.push({
        type: types.CHAR,
        value: c.charCodeAt(0)
      });
    }
    exports.error(regexpStr, "Unterminated character class");
  }, exports.error = function(regexp, msg) {
    throw new SyntaxError("Invalid regular expression: /" + regexp + "/: " + msg);
  };
}, function(module, exports, __webpack_require__) {
  var types = __webpack_require__(8);
  exports.wordBoundary = function() {
    return {
      type: types.POSITION,
      value: "b"
    };
  }, exports.nonWordBoundary = function() {
    return {
      type: types.POSITION,
      value: "B"
    };
  }, exports.begin = function() {
    return {
      type: types.POSITION,
      value: "^"
    };
  }, exports.end = function() {
    return {
      type: types.POSITION,
      value: "$"
    };
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(4), isAccessor = __webpack_require__(49), isData = __webpack_require__(50);
  module.exports = function(obj, key) {
    return "object" === typeOf(obj) && ("get" in obj ? isAccessor(obj, key) : isData(obj, key));
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(4), accessor = {
    get: "function",
    set: "function",
    configurable: "boolean",
    enumerable: "boolean"
  };
  function has(obj, key) {
    return {}.hasOwnProperty.call(obj, key);
  }
  module.exports = function(obj, prop) {
    if ("string" == typeof prop) return void 0 !== Object.getOwnPropertyDescriptor(obj, prop);
    if ("object" !== typeOf(obj)) return !1;
    if (has(obj, "value") || has(obj, "writable")) return !1;
    if (!has(obj, "get") || "function" != typeof obj.get) return !1;
    if (has(obj, "set") && "function" != typeof obj[key] && void 0 !== obj[key]) return !1;
    for (var key in obj) if (accessor.hasOwnProperty(key) && typeOf(obj[key]) !== accessor[key] && void 0 !== obj[key]) return !1;
    return !0;
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(4);
  module.exports = function(obj, prop) {
    var data = {
      configurable: "boolean",
      enumerable: "boolean",
      writable: "boolean"
    };
    if ("object" !== typeOf(obj)) return !1;
    if ("string" == typeof prop) return void 0 !== Object.getOwnPropertyDescriptor(obj, prop);
    if (!("value" in obj) && !("writable" in obj)) return !1;
    for (var key in obj) if ("value" !== key && data.hasOwnProperty(key) && typeOf(obj[key]) !== data[key] && void 0 !== obj[key]) return !1;
    return !0;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(arr) {
    return function flat(arr, res) {
      for (var cur, i = 0, len = arr.length; i < len; i++) cur = arr[i], Array.isArray(cur) ? flat(cur, res) : res.push(cur);
      return res;
    }(arr, []);
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(2), isNumber = __webpack_require__(13), extend = Object.assign, repeat = __webpack_require__(22), toRegex = __webpack_require__(53);
  function zeros(val, options) {
    if (options.isPadded) {
      var str = String(val), len = str.length, dash = "";
      "-" === str.charAt(0) && (dash = "-", str = str.slice(1));
      var diff = options.maxLength - len;
      val = dash + repeat("0", diff) + str;
    }
    return options.stringify ? String(val) : val;
  }
  function toNumber(val) {
    return Number(val) || 0;
  }
  function isPadded(str) {
    return /^-?0\d/.test(str);
  }
  function isValidLetter(ch) {
    return "string" == typeof ch && 1 === ch.length && /^\w+$/.test(ch);
  }
  function isValidNumber(n) {
    return isNumber(n) && !/\./.test(n);
  }
  module.exports = function(start, stop, step, options) {
    if (void 0 === start) return [];
    if (void 0 === stop || start === stop) {
      var isString = "string" == typeof start;
      return isNumber(start) && !toNumber(start) ? [ isString ? "0" : 0 ] : [ start ];
    }
    "number" != typeof step && "string" != typeof step && (options = step, step = void 0), 
    "function" == typeof options && (options = {
      transform: options
    });
    var min, max, opts = extend({
      step: step
    }, options);
    if (opts.step && !isValidNumber(opts.step)) {
      if (!0 === opts.strictRanges) throw new TypeError("expected options.step to be a number");
      return [];
    }
    if (opts.isNumber = isValidNumber(start) && isValidNumber(stop), !opts.isNumber && (max = stop, 
    !isValidNumber(min = start) && !isValidLetter(min) || !isValidNumber(max) && !isValidLetter(max))) {
      if (!0 === opts.strictRanges) throw new RangeError("invalid range arguments: " + util.inspect([ start, stop ]));
      return [];
    }
    return opts.isPadded = isPadded(start) || isPadded(stop), opts.toString = opts.stringify || "string" == typeof opts.step || "string" == typeof start || "string" == typeof stop || !opts.isNumber, 
    opts.isPadded && (opts.maxLength = Math.max(String(start).length, String(stop).length)), 
    "boolean" == typeof opts.optimize && (opts.toRegex = opts.optimize), "boolean" == typeof opts.makeRe && (opts.toRegex = opts.makeRe), 
    function(start, stop, options) {
      var a = options.isNumber ? toNumber(start) : start.charCodeAt(0), b = options.isNumber ? toNumber(stop) : stop.charCodeAt(0), step = Math.abs(toNumber(options.step)) || 1;
      if (options.toRegex && 1 === step) return function(a, b, start, stop, options) {
        if (options.isPadded) return toRegex(start, stop, options);
        if (options.isNumber) return toRegex(Math.min(a, b), Math.max(a, b), options);
        start = String.fromCharCode(Math.min(a, b)), stop = String.fromCharCode(Math.max(a, b));
        return "[" + start + "-" + stop + "]";
      }(a, b, start, stop, options);
      var zero = {
        greater: [],
        lesser: []
      }, asc = a < b, arr = new Array(Math.round((asc ? b - a : a - b) / step)), idx = 0;
      for (;asc ? a <= b : a >= b; ) {
        var val = options.isNumber ? a : String.fromCharCode(a);
        options.toRegex && (val >= 0 || !options.isNumber) ? zero.greater.push(val) : zero.lesser.push(Math.abs(val)), 
        options.isPadded && (val = zeros(val, options)), options.toString && (val = String(val)), 
        "function" == typeof options.transform ? arr[idx++] = options.transform(val, a, b, step, idx, arr, options) : arr[idx++] = val, 
        asc ? a += step : a -= step;
      }
      if (!0 === options.toRegex) return function(arr, zeros, options) {
        var greater = "", lesser = "";
        zeros.greater.length && (greater = zeros.greater.join("|"));
        zeros.lesser.length && (lesser = "-(" + zeros.lesser.join("|") + ")");
        var res = greater && lesser ? greater + "|" + lesser : greater || lesser;
        if (options.capture) return "(" + res + ")";
        return res;
      }(0, zero, options);
      return arr;
    }(start, stop, opts);
  };
}, function(module, exports, __webpack_require__) {
  var repeat = __webpack_require__(22), isNumber = __webpack_require__(13), cache = {};
  function rangeToPattern(start, stop, options) {
    if (start === stop) return {
      pattern: String(start),
      digits: []
    };
    for (var a, b, zipped = function(a, b) {
      var arr = [];
      for (var ch in a) arr.push([ a[ch], b[ch] ]);
      return arr;
    }(String(start), String(stop)), len = zipped.length, i = -1, pattern = "", digits = 0; ++i < len; ) {
      var numbers = zipped[i], startDigit = numbers[0], stopDigit = numbers[1];
      startDigit === stopDigit ? pattern += startDigit : "0" !== startDigit || "9" !== stopDigit ? pattern += "[" + (a = startDigit) + ((b = stopDigit) - a == 1 ? "" : "-") + b + "]" : digits += 1;
    }
    return digits && (pattern += options.shorthand ? "\\d" : "[0-9]"), {
      pattern: pattern,
      digits: [ digits ]
    };
  }
  function splitToPatterns(min, max, tok, options) {
    for (var prev, ranges = function(min, max) {
      min = Number(min);
      for (var nines = 1, stops = [ max = Number(max) ], stop = +countNines(min, nines); min <= stop && stop <= max; ) stops = push(stops, stop), 
      stop = +countNines(min, nines += 1);
      var zeros = 1;
      for (stop = countZeros(max + 1, zeros) - 1; min < stop && stop <= max; ) stops = push(stops, stop), 
      stop = countZeros(max + 1, zeros += 1) - 1;
      return stops.sort(compare), stops;
    }(min, max), len = ranges.length, idx = -1, tokens = [], start = min; ++idx < len; ) {
      var range = ranges[idx], obj = rangeToPattern(start, range, options), zeros = "";
      tok.isPadded || !prev || prev.pattern !== obj.pattern ? (tok.isPadded && (zeros = padZeros(range, tok)), 
      obj.string = zeros + obj.pattern + toQuantifier(obj.digits), tokens.push(obj), start = range + 1, 
      prev = obj) : (prev.digits.length > 1 && prev.digits.pop(), prev.digits.push(obj.digits[0]), 
      prev.string = prev.pattern + toQuantifier(prev.digits), start = range + 1);
    }
    return tokens;
  }
  function filterPatterns(arr, comparison, prefix, intersection, options) {
    for (var res = [], i = 0; i < arr.length; i++) {
      var ele = arr[i].string;
      !1 !== options.relaxZeros && "-" === prefix && "0" === ele.charAt(0) && (ele = "{" === ele.charAt(1) ? "0*" + ele.replace(/^0\{\d+\}/, "") : "0*" + ele.slice(1)), 
      intersection || contains(comparison, "string", ele) || res.push(prefix + ele), intersection && contains(comparison, "string", ele) && res.push(prefix + ele);
    }
    return res;
  }
  function compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  function push(arr, ele) {
    return -1 === arr.indexOf(ele) && arr.push(ele), arr;
  }
  function contains(arr, key, val) {
    for (var i = 0; i < arr.length; i++) if (arr[i][key] === val) return !0;
    return !1;
  }
  function countNines(min, len) {
    return String(min).slice(0, -len) + repeat("9", len);
  }
  function countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
  }
  function toQuantifier(digits) {
    var start = digits[0], stop = digits[1] ? "," + digits[1] : "";
    return stop || start && 1 !== start ? "{" + start + stop + "}" : "";
  }
  function padding(str) {
    return /^-?(0+)\d/.exec(str);
  }
  function padZeros(val, tok) {
    if (tok.isPadded) {
      var diff = Math.abs(tok.maxLen - String(val).length);
      switch (diff) {
       case 0:
        return "";

       case 1:
        return "0";

       default:
        return "0{" + diff + "}";
      }
    }
    return val;
  }
  module.exports = function(min, max, options) {
    if (!1 === isNumber(min)) throw new RangeError("toRegexRange: first argument is invalid.");
    if (void 0 === max || min === max) return String(min);
    if (!1 === isNumber(max)) throw new RangeError("toRegexRange: second argument is invalid.");
    options = options || {};
    var key = min + ":" + max + "=" + String(options.relaxZeros) + String(options.shorthand) + String(options.capture);
    if (cache.hasOwnProperty(key)) return cache[key].result;
    var a = Math.min(min, max), b = Math.max(min, max);
    if (1 === Math.abs(a - b)) {
      var result = min + "|" + max;
      return options.capture ? "(" + result + ")" : result;
    }
    var isPadded = padding(min) || padding(max), positives = [], negatives = [], tok = {
      min: min,
      max: max,
      a: a,
      b: b
    };
    return isPadded && (tok.isPadded = isPadded, tok.maxLen = String(tok.max).length), 
    a < 0 && (negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), tok, options), 
    a = tok.a = 0), b >= 0 && (positives = splitToPatterns(a, b, tok, options)), tok.negatives = negatives, 
    tok.positives = positives, tok.result = function(neg, pos, options) {
      var onlyNegative = filterPatterns(neg, pos, "-", !1, options) || [], onlyPositive = filterPatterns(pos, neg, "", !1, options) || [], intersected = filterPatterns(neg, pos, "-?", !0, options) || [];
      return onlyNegative.concat(intersected).concat(onlyPositive).join("|");
    }(negatives, positives, options), options.capture && positives.length + negatives.length > 1 && (tok.result = "(" + tok.result + ")"), 
    cache[key] = tok, tok.result;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(ele, num) {
    if (Array.prototype.fill) return new Array(num).fill(ele);
    for (var arr = new Array(num), i = 0; i < num; i++) arr[i] = ele;
    return arr;
  };
}, function(module, exports, __webpack_require__) {
  var ownNames, isObject = __webpack_require__(1), define = __webpack_require__(0), utils = __webpack_require__(56);
  function Node(val, type, parent) {
    if ("string" != typeof type && (parent = type, type = null), define(this, "parent", parent), 
    define(this, "isNode", !0), define(this, "expect", null), "string" != typeof type && isObject(val)) {
      ownNames || (ownNames = Object.getOwnPropertyNames(Node.prototype));
      for (var keys = Object.keys(val), i = 0; i < keys.length; i++) {
        var key = keys[i];
        -1 === ownNames.indexOf(key) && (this[key] = val[key]);
      }
    } else this.type = type, this.val = val;
  }
  function assert(val, message) {
    if (!val) throw new Error(message);
  }
  Node.isNode = function(node) {
    return utils.isNode(node);
  }, Node.prototype.define = function(name, val) {
    return define(this, name, val), this;
  }, Node.prototype.isEmpty = function(fn) {
    return utils.isEmpty(this, fn);
  }, Node.prototype.push = function(node) {
    return assert(Node.isNode(node), "expected node to be an instance of Node"), define(node, "parent", this), 
    this.nodes = this.nodes || [], this.nodes.push(node);
  }, Node.prototype.unshift = function(node) {
    return assert(Node.isNode(node), "expected node to be an instance of Node"), define(node, "parent", this), 
    this.nodes = this.nodes || [], this.nodes.unshift(node);
  }, Node.prototype.pop = function() {
    return this.nodes && this.nodes.pop();
  }, Node.prototype.shift = function() {
    return this.nodes && this.nodes.shift();
  }, Node.prototype.remove = function(node) {
    assert(Node.isNode(node), "expected node to be an instance of Node"), this.nodes = this.nodes || [];
    var idx = node.index;
    return -1 !== idx ? (node.index = -1, this.nodes.splice(idx, 1)) : null;
  }, Node.prototype.find = function(type) {
    return utils.findNode(this.nodes, type);
  }, Node.prototype.isType = function(type) {
    return utils.isType(this, type);
  }, Node.prototype.hasType = function(type) {
    return utils.hasType(this, type);
  }, Object.defineProperty(Node.prototype, "siblings", {
    set: function() {
      throw new Error("node.siblings is a getter and cannot be defined");
    },
    get: function() {
      return this.parent ? this.parent.nodes : null;
    }
  }), Object.defineProperty(Node.prototype, "index", {
    set: function(index) {
      define(this, "idx", index);
    },
    get: function() {
      return Array.isArray(this.siblings) ? ((-1 !== this.idx ? this.siblings[this.idx] : null) !== this && (this.idx = this.siblings.indexOf(this)), 
      this.idx) : -1;
    }
  }), Object.defineProperty(Node.prototype, "prev", {
    set: function() {
      throw new Error("node.prev is a getter and cannot be defined");
    },
    get: function() {
      return Array.isArray(this.siblings) ? this.siblings[this.index - 1] || this.parent.prev : null;
    }
  }), Object.defineProperty(Node.prototype, "next", {
    set: function() {
      throw new Error("node.next is a getter and cannot be defined");
    },
    get: function() {
      return Array.isArray(this.siblings) ? this.siblings[this.index + 1] || this.parent.next : null;
    }
  }), Object.defineProperty(Node.prototype, "first", {
    get: function() {
      return this.nodes ? this.nodes[0] : null;
    }
  }), Object.defineProperty(Node.prototype, "last", {
    get: function() {
      return this.nodes ? utils.last(this.nodes) : null;
    }
  }), Object.defineProperty(Node.prototype, "scope", {
    get: function() {
      return !0 !== this.isScope && this.parent ? this.parent.scope : this;
    }
  }), module.exports = Node;
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(10), utils = module.exports;
  function isObject(val) {
    return "object" === typeOf(val);
  }
  function isFunction(val) {
    return "function" == typeof val;
  }
  function append(compiler, val, node) {
    return "function" != typeof compiler.append ? compiler.emit(val, node) : compiler.append(val, node);
  }
  function assert(val, message) {
    if (!val) throw new Error(message);
  }
  utils.isNode = function(node) {
    return "object" === typeOf(node) && !0 === node.isNode;
  }, utils.noop = function(node) {
    append(this, "", node);
  }, utils.identity = function(node) {
    append(this, node.val, node);
  }, utils.append = function(val) {
    return function(node) {
      append(this, val, node);
    };
  }, utils.toNoop = function(node, nodes) {
    nodes ? node.nodes = nodes : (delete node.nodes, node.type = "text", node.val = "");
  }, utils.visit = function(node, fn) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isFunction(fn), "expected a visitor function"), 
    fn(node), node.nodes ? utils.mapVisit(node, fn) : node;
  }, utils.mapVisit = function(node, fn) {
    var val;
    assert(utils.isNode(node), "expected node to be an instance of Node"), assert((val = node.nodes, 
    Array.isArray(val)), "expected node.nodes to be an array"), assert(isFunction(fn), "expected a visitor function");
    for (var i = 0; i < node.nodes.length; i++) utils.visit(node.nodes[i], fn);
    return node;
  }, utils.addOpen = function(node, Node, val, filter) {
    if (assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isFunction(Node), "expected Node to be a constructor function"), 
    "function" == typeof val && (filter = val, val = ""), "function" != typeof filter || filter(node)) {
      var open = new Node({
        type: node.type + ".open",
        val: val
      }), unshift = node.unshift || node.unshiftNode;
      return "function" == typeof unshift ? unshift.call(node, open) : utils.unshiftNode(node, open), 
      open;
    }
  }, utils.addClose = function(node, Node, val, filter) {
    if (assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isFunction(Node), "expected Node to be a constructor function"), 
    "function" == typeof val && (filter = val, val = ""), "function" != typeof filter || filter(node)) {
      var close = new Node({
        type: node.type + ".close",
        val: val
      }), push = node.push || node.pushNode;
      return "function" == typeof push ? push.call(node, close) : utils.pushNode(node, close), 
      close;
    }
  }, utils.wrapNodes = function(node, Node, filter) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isFunction(Node), "expected Node to be a constructor function"), 
    utils.addOpen(node, Node, filter), utils.addClose(node, Node, filter), node;
  }, utils.pushNode = function(parent, node) {
    return assert(utils.isNode(parent), "expected parent node to be an instance of Node"), 
    assert(utils.isNode(node), "expected node to be an instance of Node"), node.define("parent", parent), 
    parent.nodes = parent.nodes || [], parent.nodes.push(node), node;
  }, utils.unshiftNode = function(parent, node) {
    assert(utils.isNode(parent), "expected parent node to be an instance of Node"), 
    assert(utils.isNode(node), "expected node to be an instance of Node"), node.define("parent", parent), 
    parent.nodes = parent.nodes || [], parent.nodes.unshift(node);
  }, utils.popNode = function(node) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), "function" == typeof node.pop ? node.pop() : node.nodes && node.nodes.pop();
  }, utils.shiftNode = function(node) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), "function" == typeof node.shift ? node.shift() : node.nodes && node.nodes.shift();
  }, utils.removeNode = function(parent, node) {
    if (assert(utils.isNode(parent), "expected parent.node to be an instance of Node"), 
    assert(utils.isNode(node), "expected node to be an instance of Node"), !parent.nodes) return null;
    if ("function" == typeof parent.remove) return parent.remove(node);
    var idx = parent.nodes.indexOf(node);
    return -1 !== idx ? parent.nodes.splice(idx, 1) : void 0;
  }, utils.isType = function(node, type) {
    switch (assert(utils.isNode(node), "expected node to be an instance of Node"), typeOf(type)) {
     case "array":
      for (var types = type.slice(), i = 0; i < types.length; i++) if (utils.isType(node, types[i])) return !0;
      return !1;

     case "string":
      return node.type === type;

     case "regexp":
      return type.test(node.type);

     default:
      throw new TypeError('expected "type" to be an array, string or regexp');
    }
  }, utils.hasType = function(node, type) {
    if (assert(utils.isNode(node), "expected node to be an instance of Node"), !Array.isArray(node.nodes)) return !1;
    for (var i = 0; i < node.nodes.length; i++) if (utils.isType(node.nodes[i], type)) return !0;
    return !1;
  }, utils.firstOfType = function(nodes, type) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (utils.isType(node, type)) return node;
    }
  }, utils.findNode = function(nodes, type) {
    return Array.isArray(nodes) ? "number" == typeof type ? nodes[type] : utils.firstOfType(nodes, type) : null;
  }, utils.isOpen = function(node) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), ".open" === node.type.slice(-5);
  }, utils.isClose = function(node) {
    return assert(utils.isNode(node), "expected node to be an instance of Node"), ".close" === node.type.slice(-6);
  }, utils.hasOpen = function(node) {
    assert(utils.isNode(node), "expected node to be an instance of Node");
    var first = node.first || node.nodes ? node.nodes[0] : null;
    return !!utils.isNode(first) && first.type === node.type + ".open";
  }, utils.hasClose = function(node) {
    assert(utils.isNode(node), "expected node to be an instance of Node");
    var last = node.last || node.nodes ? node.nodes[node.nodes.length - 1] : null;
    return !!utils.isNode(last) && last.type === node.type + ".close";
  }, utils.hasOpenAndClose = function(node) {
    return utils.hasOpen(node) && utils.hasClose(node);
  }, utils.addType = function(state, node) {
    assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isObject(state), "expected state to be an object");
    var type = node.parent ? node.parent.type : node.type.replace(/\.open$/, "");
    state.hasOwnProperty("inside") || (state.inside = {}), state.inside.hasOwnProperty(type) || (state.inside[type] = []);
    var arr = state.inside[type];
    return arr.push(node), arr;
  }, utils.removeType = function(state, node) {
    assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isObject(state), "expected state to be an object");
    var type = node.parent ? node.parent.type : node.type.replace(/\.close$/, "");
    if (state.inside.hasOwnProperty(type)) return state.inside[type].pop();
  }, utils.isEmpty = function(node, fn) {
    if (assert(utils.isNode(node), "expected node to be an instance of Node"), !Array.isArray(node.nodes)) return "text" !== node.type || ("function" == typeof fn ? fn(node, node.parent) : !utils.trim(node.val));
    for (var i = 0; i < node.nodes.length; i++) {
      var child = node.nodes[i];
      if (!utils.isOpen(child) && !utils.isClose(child) && !utils.isEmpty(child, fn)) return !1;
    }
    return !0;
  }, utils.isInsideType = function(state, type) {
    return assert(isObject(state), "expected state to be an object"), assert("string" == typeof type, "expected type to be a string"), 
    !!state.hasOwnProperty("inside") && (!!state.inside.hasOwnProperty(type) && state.inside[type].length > 0);
  }, utils.isInside = function(state, node, type) {
    if (assert(utils.isNode(node), "expected node to be an instance of Node"), assert(isObject(state), "expected state to be an object"), 
    Array.isArray(type)) {
      for (var i = 0; i < type.length; i++) if (utils.isInside(state, node, type[i])) return !0;
      return !1;
    }
    var parent = node.parent;
    if ("string" == typeof type) return parent && parent.type === type || utils.isInsideType(state, type);
    if ("regexp" === typeOf(type)) {
      if (parent && parent.type && type.test(parent.type)) return !0;
      for (var keys = Object.keys(state.inside), len = keys.length, idx = -1; ++idx < len; ) {
        var key = keys[idx], val = state.inside[key];
        if (Array.isArray(val) && 0 !== val.length && type.test(key)) return !0;
      }
    }
    return !1;
  }, utils.last = function(arr, n) {
    return arr[arr.length - (n || 1)];
  }, utils.arrayify = function(val) {
    return "string" == typeof val && "" !== val ? [ val ] : Array.isArray(val) ? val : [];
  }, utils.stringify = function(val) {
    return utils.arrayify(val).join(",");
  }, utils.trim = function(str) {
    return "string" == typeof str ? str.trim() : "";
  };
}, function(module, exports, __webpack_require__) {
  var extend = Object.assign, Snapdragon = __webpack_require__(7), compilers = __webpack_require__(19), parsers = __webpack_require__(23), utils = __webpack_require__(9);
  function Braces(options) {
    this.options = extend({}, options);
  }
  Braces.prototype.init = function(options) {
    if (!this.isInitialized) {
      this.isInitialized = !0;
      var opts = utils.createOptions({}, this.options, options);
      this.snapdragon = this.options.snapdragon || new Snapdragon(opts), this.compiler = this.snapdragon.compiler, 
      this.parser = this.snapdragon.parser, compilers(this.snapdragon, opts), parsers(this.snapdragon, opts), 
      utils.define(this.snapdragon, "parse", (function(pattern, options) {
        var parsed = Snapdragon.prototype.parse.apply(this, arguments);
        this.parser.ast.input = pattern;
        for (var stack = this.parser.stack; stack.length; ) addParent({
          type: "brace.close",
          val: ""
        }, stack.pop());
        function addParent(node, parent) {
          utils.define(node, "parent", parent), parent.nodes.push(node);
        }
        return utils.define(parsed, "parser", this.parser), parsed;
      }));
    }
  }, Braces.prototype.parse = function(ast, options) {
    return ast && "object" == typeof ast && ast.nodes ? ast : (this.init(options), this.snapdragon.parse(ast, options));
  }, Braces.prototype.compile = function(ast, options) {
    return "string" == typeof ast ? ast = this.parse(ast, options) : this.init(options), 
    this.snapdragon.compile(ast, options);
  }, Braces.prototype.expand = function(pattern) {
    var ast = this.parse(pattern, {
      expand: !0
    });
    return this.compile(ast, {
      expand: !0
    });
  }, Braces.prototype.optimize = function(pattern) {
    var ast = this.parse(pattern, {
      optimize: !0
    });
    return this.compile(ast, {
      optimize: !0
    });
  }, module.exports = Braces;
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(2), define = __webpack_require__(0), CacheBase = __webpack_require__(59), Emitter = __webpack_require__(24), isObject = __webpack_require__(1), merge = __webpack_require__(67), pascal = __webpack_require__(70), cu = __webpack_require__(71);
  function namespace(name) {
    var Cache = name ? CacheBase.namespace(name) : CacheBase, fns = [];
    function Base(config, options) {
      if (!(this instanceof Base)) return new Base(config, options);
      Cache.call(this, config), this.is("base"), this.initBase(config, options);
    }
    return util.inherits(Base, Cache), Emitter(Base), Base.prototype.initBase = function(config, options) {
      this.options = merge({}, this.options, options), this.cache = this.cache || {}, 
      this.define("registered", {}), name && (this[name] = {}), this.define("_callbacks", this._callbacks), 
      isObject(config) && this.visit("set", config), Base.run(this, "use", fns);
    }, Base.prototype.is = function(name) {
      if ("string" != typeof name) throw new TypeError("expected name to be a string");
      return this.define("is" + pascal(name), !0), this.define("_name", name), this.define("_appname", name), 
      this;
    }, Base.prototype.isRegistered = function(name, register) {
      return !!this.registered.hasOwnProperty(name) || (!1 !== register && (this.registered[name] = !0, 
      this.emit("plugin", name)), !1);
    }, Base.prototype.use = function(fn) {
      return fn.call(this, this), this;
    }, Base.prototype.define = function(key, val) {
      return isObject(key) ? this.visit("define", key) : (define(this, key, val), this);
    }, Base.prototype.mixin = function(key, val) {
      return Base.prototype[key] = val, this;
    }, Base.prototype.mixins = Base.prototype.mixins || [], Object.defineProperty(Base.prototype, "base", {
      configurable: !0,
      get: function() {
        return this.parent ? this.parent.base : this;
      }
    }), define(Base, "use", (function(fn) {
      return fns.push(fn), Base;
    })), define(Base, "run", (function(obj, prop, arr) {
      for (var len = arr.length, i = 0; len--; ) obj[prop](arr[i++]);
      return Base;
    })), define(Base, "extend", cu.extend(Base, (function(Ctor, Parent) {
      return Ctor.prototype.mixins = Ctor.prototype.mixins || [], define(Ctor, "mixin", (function(fn) {
        var mixin = fn(Ctor.prototype, Ctor);
        return "function" == typeof mixin && Ctor.prototype.mixins.push(mixin), Ctor;
      })), define(Ctor, "mixins", (function(Child) {
        return Base.run(Child, "mixin", Ctor.prototype.mixins), Ctor;
      })), Ctor.prototype.mixin = function(key, value) {
        return Ctor.prototype[key] = value, this;
      }, Base;
    }))), define(Base, "mixin", (function(fn) {
      var mixin = fn(Base.prototype, Base);
      return "function" == typeof mixin && Base.prototype.mixins.push(mixin), Base;
    })), define(Base, "mixins", (function(Child) {
      return Base.run(Child, "mixin", Base.prototype.mixins), Base;
    })), define(Base, "inherit", cu.inherit), define(Base, "bubble", cu.bubble), Base;
  }
  module.exports = namespace(), module.exports.namespace = namespace;
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1), Emitter = __webpack_require__(24), visit = __webpack_require__(60), toPath = __webpack_require__(62), union = __webpack_require__(63), del = __webpack_require__(64), get = __webpack_require__(14), set = (__webpack_require__(30), 
  __webpack_require__(28));
  function namespace(prop) {
    function Cache(cache) {
      prop && (this[prop] = {}), cache && this.set(cache);
    }
    return Emitter(Cache.prototype), Cache.prototype.set = function(key, val) {
      return Array.isArray(key) && 2 === arguments.length && (key = toPath(key)), isObject(key) || Array.isArray(key) ? this.visit("set", key) : (set(prop ? this[prop] : this, key, val), 
      this.emit("set", key, val)), this;
    }, Cache.prototype.union = function(key, val) {
      Array.isArray(key) && 2 === arguments.length && (key = toPath(key));
      var ctx = prop ? this[prop] : this;
      return union(ctx, key, arrayify(val)), this.emit("union", val), this;
    }, Cache.prototype.get = function(key) {
      key = toPath(arguments);
      var ctx = prop ? this[prop] : this, val = get(ctx, key);
      return this.emit("get", key, val), val;
    }, Cache.prototype.has = function(key) {
      key = toPath(arguments);
      var ctx = prop ? this[prop] : this, val = get(ctx, key), has = void 0 !== val;
      return this.emit("has", key, has), has;
    }, Cache.prototype.del = function(key) {
      return Array.isArray(key) ? this.visit("del", key) : (del(prop ? this[prop] : this, key), 
      this.emit("del", key)), this;
    }, Cache.prototype.clear = function() {
      prop && (this[prop] = {});
    }, Cache.prototype.visit = function(method, val) {
      return visit(this, method, val), this;
    }, Cache;
  }
  function arrayify(val) {
    return val ? Array.isArray(val) ? val : [ val ] : [];
  }
  module.exports = namespace(), module.exports.namespace = namespace;
}, function(module, exports, __webpack_require__) {
  var visit = __webpack_require__(25), mapVisit = __webpack_require__(61);
  module.exports = function(collection, method, val) {
    var result;
    if ("string" == typeof val && method in collection) {
      var args = [].slice.call(arguments, 2);
      result = collection[method].apply(collection, args);
    } else result = Array.isArray(val) ? mapVisit.apply(null, arguments) : visit.apply(null, arguments);
    return void 0 !== result ? result : collection;
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(2), visit = __webpack_require__(25);
  function isObject(val) {
    return val && ("function" == typeof val || !Array.isArray(val) && "object" == typeof val);
  }
  module.exports = function(collection, method, val) {
    if (isObject(val)) return visit.apply(null, arguments);
    if (!Array.isArray(val)) throw new TypeError("expected an array: " + util.inspect(val));
    for (var args = [].slice.call(arguments, 3), i = 0; i < val.length; i++) {
      var ele = val[i];
      isObject(ele) ? visit.apply(null, [ collection, method, ele ].concat(args)) : collection[method].apply(collection, [ ele ].concat(args));
    }
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(10);
  function filter(arr) {
    for (var len = arr.length, idx = -1, res = []; ++idx < len; ) {
      var ele = arr[idx];
      "arguments" === typeOf(ele) || Array.isArray(ele) ? res.push.apply(res, filter(ele)) : "string" == typeof ele && res.push(ele);
    }
    return res;
  }
  module.exports = function(args) {
    return "arguments" !== typeOf(args) && (args = arguments), filter(args).join(".");
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(26), union = __webpack_require__(27), get = __webpack_require__(14), set = __webpack_require__(28);
  function arrayify(val) {
    return null == val ? [] : Array.isArray(val) ? val : [ val ];
  }
  module.exports = function(obj, prop, value) {
    if (!isObject(obj)) throw new TypeError("union-value expects the first argument to be an object.");
    if ("string" != typeof prop) throw new TypeError("union-value expects `prop` to be a string.");
    var arr = arrayify(get(obj, prop));
    return set(obj, prop, union(arr, arrayify(value))), obj;
  };
}, function(module, exports, __webpack_require__) {
  var isObject = __webpack_require__(1), has = __webpack_require__(30);
  module.exports = function(obj, prop) {
    if (!isObject(obj)) throw new TypeError("expected an object.");
    if (obj.hasOwnProperty(prop)) return delete obj[prop], !0;
    if (has(obj, prop)) {
      for (var segs = prop.split("."), last = segs.pop(); segs.length && "\\" === segs[segs.length - 1].slice(-1); ) last = segs.pop().slice(0, -1) + "." + last;
      for (;segs.length; ) obj = obj[prop = segs.shift()];
      return delete obj[last];
    }
    return !0;
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(66), isNumber = __webpack_require__(13);
  module.exports = function hasValue(val) {
    if (isNumber(val)) return !0;
    switch (typeOf(val)) {
     case "null":
     case "boolean":
     case "function":
      return !0;

     case "string":
     case "arguments":
      return 0 !== val.length;

     case "error":
      return "" !== val.message;

     case "array":
      var len = val.length;
      if (0 === len) return !1;
      for (var i = 0; i < len; i++) if (hasValue(val[i])) return !0;
      return !1;

     case "file":
     case "map":
     case "set":
      return 0 !== val.size;

     case "object":
      var keys = Object.keys(val);
      if (0 === keys.length) return !1;
      for (i = 0; i < keys.length; i++) {
        if (hasValue(val[keys[i]])) return !0;
      }
      return !1;

     default:
      return !1;
    }
  };
}, function(module, exports, __webpack_require__) {
  var isBuffer = __webpack_require__(21), toString = Object.prototype.toString;
  module.exports = function(val) {
    if (void 0 === val) return "undefined";
    if (null === val) return "null";
    if (!0 === val || !1 === val || val instanceof Boolean) return "boolean";
    if ("string" == typeof val || val instanceof String) return "string";
    if ("number" == typeof val || val instanceof Number) return "number";
    if ("function" == typeof val || val instanceof Function) return "function";
    if (void 0 !== Array.isArray && Array.isArray(val)) return "array";
    if (val instanceof RegExp) return "regexp";
    if (val instanceof Date) return "date";
    var type = toString.call(val);
    return "[object RegExp]" === type ? "regexp" : "[object Date]" === type ? "date" : "[object Arguments]" === type ? "arguments" : "[object Error]" === type ? "error" : "[object Promise]" === type ? "promise" : isBuffer(val) ? "buffer" : "[object Set]" === type ? "set" : "[object WeakSet]" === type ? "weakset" : "[object Map]" === type ? "map" : "[object WeakMap]" === type ? "weakmap" : "[object Symbol]" === type ? "symbol" : "[object Int8Array]" === type ? "int8array" : "[object Uint8Array]" === type ? "uint8array" : "[object Uint8ClampedArray]" === type ? "uint8clampedarray" : "[object Int16Array]" === type ? "int16array" : "[object Uint16Array]" === type ? "uint16array" : "[object Int32Array]" === type ? "int32array" : "[object Uint32Array]" === type ? "uint32array" : "[object Float32Array]" === type ? "float32array" : "[object Float64Array]" === type ? "float64array" : "object";
  };
}, function(module, exports, __webpack_require__) {
  var isExtendable = __webpack_require__(68), forIn = __webpack_require__(69);
  function mixinDeep(target, objects) {
    for (var len = arguments.length, i = 0; ++i < len; ) {
      var obj = arguments[i];
      isObject(obj) && forIn(obj, copy, target);
    }
    return target;
  }
  function copy(val, key) {
    if (function(key) {
      return "__proto__" !== key && "constructor" !== key && "prototype" !== key;
    }(key)) {
      var obj = this[key];
      isObject(val) && isObject(obj) ? mixinDeep(obj, val) : this[key] = val;
    }
  }
  function isObject(val) {
    return isExtendable(val) && !Array.isArray(val);
  }
  module.exports = mixinDeep;
}, function(module, exports, __webpack_require__) {
  var isPlainObject = __webpack_require__(29);
  module.exports = function(val) {
    return isPlainObject(val) || "function" == typeof val || Array.isArray(val);
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(obj, fn, thisArg) {
    for (var key in obj) if (!1 === fn.call(thisArg, obj[key], key, obj)) break;
  };
}, function(module, exports) {
  module.exports = function(str) {
    if ("string" != typeof str) throw new TypeError("expected a string.");
    return 1 === (str = str.replace(/([A-Z])/g, " $1")).length ? str.toUpperCase() : (str = (str = str.replace(/^[\W_]+|[\W_]+$/g, "").toLowerCase()).charAt(0).toUpperCase() + str.slice(1)).replace(/[\W_]+(\w|$)/g, (function(_, ch) {
      return ch.toUpperCase();
    }));
  };
}, function(module, exports, __webpack_require__) {
  __webpack_require__(2);
  var union = __webpack_require__(27), define = __webpack_require__(0), staticExtend = __webpack_require__(72), isObj = __webpack_require__(1), cu = module.exports;
  cu.isObject = function(val) {
    return isObj(val) || "function" == typeof val;
  }, cu.has = function(obj, val) {
    var len = (val = cu.arrayify(val)).length;
    if (cu.isObject(obj)) {
      for (var key in obj) if (val.indexOf(key) > -1) return !0;
      var keys = cu.nativeKeys(obj);
      return cu.has(keys, val);
    }
    if (Array.isArray(obj)) {
      for (var arr = obj; len--; ) if (arr.indexOf(val[len]) > -1) return !0;
      return !1;
    }
    throw new TypeError("expected an array or object.");
  }, cu.hasAll = function(val, values) {
    for (var len = (values = cu.arrayify(values)).length; len--; ) if (!cu.has(val, values[len])) return !1;
    return !0;
  }, cu.arrayify = function(val) {
    return val ? Array.isArray(val) ? val : [ val ] : [];
  }, cu.noop = function() {}, cu.identity = function(val) {
    return val;
  }, cu.hasConstructor = function(val) {
    return cu.isObject(val) && void 0 !== val.constructor;
  }, cu.nativeKeys = function(val) {
    if (!cu.hasConstructor(val)) return [];
    var keys = Object.getOwnPropertyNames(val);
    return "caller" in val && keys.push("caller"), keys;
  }, cu.getDescriptor = function(obj, key) {
    if (!cu.isObject(obj)) throw new TypeError("expected an object.");
    if ("string" != typeof key) throw new TypeError("expected key to be a string.");
    return Object.getOwnPropertyDescriptor(obj, key);
  }, cu.copyDescriptor = function(receiver, provider, name) {
    if (!cu.isObject(receiver)) throw new TypeError("expected receiving object to be an object.");
    if (!cu.isObject(provider)) throw new TypeError("expected providing object to be an object.");
    if ("string" != typeof name) throw new TypeError("expected name to be a string.");
    var val = cu.getDescriptor(provider, name);
    val && Object.defineProperty(receiver, name, val);
  }, cu.copy = function(receiver, provider, omit) {
    if (!cu.isObject(receiver)) throw new TypeError("expected receiving object to be an object.");
    if (!cu.isObject(provider)) throw new TypeError("expected providing object to be an object.");
    var key, props = Object.getOwnPropertyNames(provider), keys = Object.keys(provider), len = props.length;
    for (omit = cu.arrayify(omit); len--; ) key = props[len], cu.has(keys, key) ? define(receiver, key, provider[key]) : key in receiver || cu.has(omit, key) || cu.copyDescriptor(receiver, provider, key);
  }, cu.inherit = function(receiver, provider, omit) {
    if (!cu.isObject(receiver)) throw new TypeError("expected receiving object to be an object.");
    if (!cu.isObject(provider)) throw new TypeError("expected providing object to be an object.");
    var keys = [];
    for (var key in provider) keys.push(key), receiver[key] = provider[key];
    keys = keys.concat(cu.arrayify(omit));
    var a = provider.prototype || provider, b = receiver.prototype || receiver;
    cu.copy(b, a, keys);
  }, cu.extend = function() {
    return staticExtend.apply(null, arguments);
  }, cu.bubble = function(Parent, events) {
    events = events || [], Parent.bubble = function(Child, arr) {
      Array.isArray(arr) && (events = union([], events, arr));
      for (var len = events.length, idx = -1; ++idx < len; ) {
        var name = events[idx];
        Parent.on(name, Child.emit.bind(Child, name));
      }
      cu.bubble(Child, events);
    };
  };
}, function(module, exports, __webpack_require__) {
  var copy = __webpack_require__(73), define = __webpack_require__(0), util = __webpack_require__(2);
  module.exports = function extend(Parent, extendFn) {
    if ("function" != typeof Parent) throw new TypeError("expected Parent to be a function.");
    return function(Ctor, proto) {
      if ("function" != typeof Ctor) throw new TypeError("expected Ctor to be a function.");
      if (util.inherits(Ctor, Parent), copy(Ctor, Parent), "object" == typeof proto) {
        var obj = Object.create(proto);
        for (var k in obj) Ctor.prototype[k] = obj[k];
      }
      define(Ctor.prototype, "_parent_", {
        configurable: !0,
        set: function() {},
        get: function() {
          return Parent.prototype;
        }
      }), "function" == typeof extendFn && extendFn(Ctor, Parent), Ctor.extend = extend(Ctor, extendFn);
    };
  };
}, function(module, exports, __webpack_require__) {
  var typeOf = __webpack_require__(10), copyDescriptor = __webpack_require__(74), define = __webpack_require__(0);
  function isObject(val) {
    return "object" === typeOf(val) || "function" == typeof val;
  }
  function has(obj, val) {
    var len = (val = arrayify(val)).length;
    if (isObject(obj)) {
      for (var key in obj) if (val.indexOf(key) > -1) return !0;
      return has(nativeKeys(obj), val);
    }
    if (Array.isArray(obj)) {
      for (var arr = obj; len--; ) if (arr.indexOf(val[len]) > -1) return !0;
      return !1;
    }
    throw new TypeError("expected an array or object.");
  }
  function arrayify(val) {
    return val ? Array.isArray(val) ? val : [ val ] : [];
  }
  function nativeKeys(val) {
    return function(val) {
      return isObject(val) && void 0 !== val.constructor;
    }(val) ? Object.getOwnPropertyNames(val) : [];
  }
  module.exports = function(receiver, provider, omit) {
    if (!isObject(receiver)) throw new TypeError("expected receiving object to be an object.");
    if (!isObject(provider)) throw new TypeError("expected providing object to be an object.");
    var props = nativeKeys(provider), keys = Object.keys(provider), len = props.length;
    for (omit = arrayify(omit); len--; ) {
      var key = props[len];
      has(keys, key) ? define(receiver, key, provider[key]) : key in receiver || has(omit, key) || copyDescriptor(receiver, provider, key);
    }
  }, module.exports.has = has;
}, function(module, exports, __webpack_require__) {
  function isObject(val) {
    return "[object Object]" === {}.toString.call(val);
  }
  module.exports = function(receiver, provider, from, to) {
    if (isObject(provider) || "function" == typeof provider || (to = from, from = provider, 
    provider = receiver), !isObject(receiver) && "function" != typeof receiver) throw new TypeError("expected the first argument to be an object");
    if (!isObject(provider) && "function" != typeof provider) throw new TypeError("expected provider to be an object");
    if ("string" != typeof to && (to = from), "string" != typeof from) throw new TypeError("expected key to be a string");
    if (!(from in provider)) throw new Error('property "' + from + '" does not exist');
    var val = Object.getOwnPropertyDescriptor(provider, from);
    val && Object.defineProperty(receiver, to, val);
  };
}, function(module, exports, __webpack_require__) {
  var use = __webpack_require__(31), define = __webpack_require__(0), debug = __webpack_require__(15)("snapdragon:compiler"), utils = __webpack_require__(11);
  function Compiler(options, state) {
    debug("initializing", __filename), this.options = utils.extend({
      source: "string"
    }, options), this.state = state || {}, this.compilers = {}, this.output = "", this.set("eos", (function(node) {
      return this.emit(node.val, node);
    })), this.set("noop", (function(node) {
      return this.emit(node.val, node);
    })), this.set("bos", (function(node) {
      return this.emit(node.val, node);
    })), use(this);
  }
  Compiler.prototype = {
    error: function(msg, node) {
      var pos = node.position || {
        start: {
          column: 0
        }
      }, message = this.options.source + " column:" + pos.start.column + ": " + msg, err = new Error(message);
      if (err.reason = msg, err.column = pos.start.column, err.source = this.pattern, 
      !this.options.silent) throw err;
      this.errors.push(err);
    },
    define: function(key, val) {
      return define(this, key, val), this;
    },
    emit: function(str, node) {
      return this.output += str, str;
    },
    set: function(name, fn) {
      return this.compilers[name] = fn, this;
    },
    get: function(name) {
      return this.compilers[name];
    },
    prev: function(n) {
      return this.ast.nodes[this.idx - (n || 1)] || {
        type: "bos",
        val: ""
      };
    },
    next: function(n) {
      return this.ast.nodes[this.idx + (n || 1)] || {
        type: "eos",
        val: ""
      };
    },
    visit: function(node, nodes, i) {
      var fn = this.compilers[node.type];
      if (this.idx = i, "function" != typeof fn) throw this.error('compiler "' + node.type + '" is not registered', node);
      return fn.call(this, node, nodes, i);
    },
    mapVisit: function(nodes) {
      if (!Array.isArray(nodes)) throw new TypeError("expected an array");
      for (var len = nodes.length, idx = -1; ++idx < len; ) this.visit(nodes[idx], nodes, idx);
      return this;
    },
    compile: function(ast, options) {
      var opts = utils.extend({}, this.options, options);
      return this.ast = ast, this.parsingErrors = this.ast.errors, this.output = "", opts.sourcemap ? (__webpack_require__(90)(this), 
      this.mapVisit(this.ast.nodes), this.applySourceMaps(), this.map = "generator" === opts.sourcemap ? this.map : this.map.toJSON(), 
      this) : (this.mapVisit(this.ast.nodes), this);
    }
  }, module.exports = Compiler;
}, function(module, exports, __webpack_require__) {
  function load() {
    var r;
    try {
      r = exports.storage.debug;
    } catch (e) {}
    return !r && "undefined" != typeof process && "env" in process && (r = process.env.DEBUG), 
    r;
  }
  (exports = module.exports = __webpack_require__(32)).log = function() {
    return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }, exports.formatArgs = function(args) {
    var useColors = this.useColors;
    if (args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff), 
    !useColors) return;
    var c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    var index = 0, lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (function(match) {
      "%%" !== match && (index++, "%c" === match && (lastC = index));
    })), args.splice(lastC, 0, c);
  }, exports.save = function(namespaces) {
    try {
      null == namespaces ? exports.storage.removeItem("debug") : exports.storage.debug = namespaces;
    } catch (e) {}
  }, exports.load = load, exports.useColors = function() {
    if ("undefined" != typeof window && window.process && "renderer" === window.process.type) return !0;
    return "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception && window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }, exports.storage = "undefined" != typeof chrome && void 0 !== chrome.storage ? chrome.storage.local : function() {
    try {
      return window.localStorage;
    } catch (e) {}
  }(), exports.colors = [ "lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson" ], 
  exports.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return "[UnexpectedJSONParseError]: " + err.message;
    }
  }, exports.enable(load());
}, function(module, exports) {
  var s = 1e3, m = 6e4, h = 60 * m, d = 24 * h;
  function plural(ms, n, name) {
    if (!(ms < n)) return ms < 1.5 * n ? Math.floor(ms / n) + " " + name : Math.ceil(ms / n) + " " + name + "s";
  }
  module.exports = function(val, options) {
    options = options || {};
    var ms, type = typeof val;
    if ("string" === type && val.length > 0) return function(str) {
      if ((str = String(str)).length > 100) return;
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
      if (!match) return;
      var n = parseFloat(match[1]);
      switch ((match[2] || "ms").toLowerCase()) {
       case "years":
       case "year":
       case "yrs":
       case "yr":
       case "y":
        return 315576e5 * n;

       case "days":
       case "day":
       case "d":
        return n * d;

       case "hours":
       case "hour":
       case "hrs":
       case "hr":
       case "h":
        return n * h;

       case "minutes":
       case "minute":
       case "mins":
       case "min":
       case "m":
        return n * m;

       case "seconds":
       case "second":
       case "secs":
       case "sec":
       case "s":
        return n * s;

       case "milliseconds":
       case "millisecond":
       case "msecs":
       case "msec":
       case "ms":
        return n;

       default:
        return;
      }
    }(val);
    if ("number" === type && !1 === isNaN(val)) return options.long ? plural(ms = val, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms" : function(ms) {
      if (ms >= d) return Math.round(ms / d) + "d";
      if (ms >= h) return Math.round(ms / h) + "h";
      if (ms >= m) return Math.round(ms / m) + "m";
      if (ms >= s) return Math.round(ms / s) + "s";
      return ms + "ms";
    }(val);
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
}, function(module, exports, __webpack_require__) {
  var tty = __webpack_require__(79), util = __webpack_require__(2);
  (exports = module.exports = __webpack_require__(32)).init = function(debug) {
    debug.inspectOpts = {};
    for (var keys = Object.keys(exports.inspectOpts), i = 0; i < keys.length; i++) debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }, exports.log = function() {
    return stream.write(util.format.apply(util, arguments) + "\n");
  }, exports.formatArgs = function(args) {
    var name = this.namespace;
    if (this.useColors) {
      var c = this.color, prefix = "  [3" + c + ";1m" + name + " [0m";
      args[0] = prefix + args[0].split("\n").join("\n" + prefix), args.push("[3" + c + "m+" + exports.humanize(this.diff) + "[0m");
    } else args[0] = (new Date).toUTCString() + " " + name + " " + args[0];
  }, exports.save = function(namespaces) {
    null == namespaces ? delete process.env.DEBUG : process.env.DEBUG = namespaces;
  }, exports.load = load, exports.useColors = function() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
  }, exports.colors = [ 6, 2, 3, 4, 5, 1 ], exports.inspectOpts = Object.keys(process.env).filter((function(key) {
    return /^debug_/i.test(key);
  })).reduce((function(obj, key) {
    var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (function(_, k) {
      return k.toUpperCase();
    })), val = process.env[key];
    return val = !!/^(yes|on|true|enabled)$/i.test(val) || !/^(no|off|false|disabled)$/i.test(val) && ("null" === val ? null : Number(val)), 
    obj[prop] = val, obj;
  }), {});
  var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
  1 !== fd && 2 !== fd && util.deprecate((function() {}), "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
  var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : function(fd) {
    var stream;
    switch (process.binding("tty_wrap").guessHandleType(fd)) {
     case "TTY":
      (stream = new tty.WriteStream(fd))._type = "tty", stream._handle && stream._handle.unref && stream._handle.unref();
      break;

     case "FILE":
      var fs = __webpack_require__(33);
      (stream = new fs.SyncWriteStream(fd, {
        autoClose: !1
      }))._type = "fs";
      break;

     case "PIPE":
     case "TCP":
      var net = __webpack_require__(80);
      (stream = new net.Socket({
        fd: fd,
        readable: !1,
        writable: !0
      })).readable = !1, stream.read = null, stream._type = "pipe", stream._handle && stream._handle.unref && stream._handle.unref();
      break;

     default:
      throw new Error("Implement me. Unknown stream file type!");
    }
    return stream.fd = fd, stream._isStdio = !0, stream;
  }(fd);
  function load() {
    return process.env.DEBUG;
  }
  exports.formatters.o = function(v) {
    return this.inspectOpts.colors = this.useColors, util.inspect(v, this.inspectOpts).split("\n").map((function(str) {
      return str.trim();
    })).join(" ");
  }, exports.formatters.O = function(v) {
    return this.inspectOpts.colors = this.useColors, util.inspect(v, this.inspectOpts);
  }, exports.enable(load());
}, function(module, exports) {
  module.exports = require("tty");
}, function(module, exports) {
  module.exports = require("net");
}, function(module, exports) {
  module.exports = require("./source-map");
}, function(module, exports, __webpack_require__) {
  var sourceMappingURL = __webpack_require__(83), resolveUrl = __webpack_require__(84), decodeUriComponent = __webpack_require__(86), urix = __webpack_require__(88), atob = __webpack_require__(89);
  function callbackAsync(callback, error, result) {
    setImmediate((function() {
      callback(error, result);
    }));
  }
  function parseMapToJSON(string, data) {
    try {
      return JSON.parse(string.replace(/^\)\]\}'/, ""));
    } catch (error) {
      throw error.sourceMapData = data, error;
    }
  }
  function readSync(read, url, data) {
    var readUrl = decodeUriComponent(url);
    try {
      return String(read(readUrl));
    } catch (error) {
      throw error.sourceMapData = data, error;
    }
  }
  function resolveSourceMap(code, codeUrl, read, callback) {
    var mapData;
    try {
      mapData = resolveSourceMapHelper(code, codeUrl);
    } catch (error) {
      return callbackAsync(callback, error);
    }
    if (!mapData || mapData.map) return callbackAsync(callback, null, mapData);
    read(decodeUriComponent(mapData.url), (function(error, result) {
      if (error) return error.sourceMapData = mapData, callback(error);
      mapData.map = String(result);
      try {
        mapData.map = parseMapToJSON(mapData.map, mapData);
      } catch (error) {
        return callback(error);
      }
      callback(null, mapData);
    }));
  }
  function resolveSourceMapSync(code, codeUrl, read) {
    var mapData = resolveSourceMapHelper(code, codeUrl);
    return !mapData || mapData.map || (mapData.map = readSync(read, mapData.url, mapData), 
    mapData.map = parseMapToJSON(mapData.map, mapData)), mapData;
  }
  var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/, jsonMimeTypeRegex = /^(?:application|text)\/json$/;
  function decodeBase64String(b64) {
    if ("undefined" == typeof TextDecoder || "undefined" == typeof Uint8Array) return atob(b64);
    var buf = function(b64) {
      for (var binStr = atob(b64), len = binStr.length, arr = new Uint8Array(len), i = 0; i < len; i++) arr[i] = binStr.charCodeAt(i);
      return arr;
    }(b64);
    return new TextDecoder("utf-8", {
      fatal: !0
    }).decode(buf);
  }
  function resolveSourceMapHelper(code, codeUrl) {
    codeUrl = urix(codeUrl);
    var url = sourceMappingURL.getFrom(code);
    if (!url) return null;
    var dataUri = url.match(dataUriRegex);
    if (dataUri) {
      var mimeType = dataUri[1] || "text/plain", lastParameter = dataUri[2] || "", encoded = dataUri[3] || "", data = {
        sourceMappingURL: url,
        url: null,
        sourcesRelativeTo: codeUrl,
        map: encoded
      };
      if (!jsonMimeTypeRegex.test(mimeType)) {
        var error = new Error("Unuseful data uri mime type: " + mimeType);
        throw error.sourceMapData = data, error;
      }
      try {
        data.map = parseMapToJSON(";base64" === lastParameter ? decodeBase64String(encoded) : decodeURIComponent(encoded), data);
      } catch (error) {
        throw error.sourceMapData = data, error;
      }
      return data;
    }
    var mapUrl = resolveUrl(codeUrl, url);
    return {
      sourceMappingURL: url,
      url: mapUrl,
      sourcesRelativeTo: mapUrl,
      map: null
    };
  }
  function resolveSources(map, mapUrl, read, options, callback) {
    "function" == typeof options && (callback = options, options = {});
    var pending = map.sources ? map.sources.length : 0, result = {
      sourcesResolved: [],
      sourcesContent: []
    };
    if (0 !== pending) {
      var done = function() {
        0 === --pending && callback(null, result);
      };
      resolveSourcesHelper(map, mapUrl, options, (function(fullUrl, sourceContent, index) {
        if (result.sourcesResolved[index] = fullUrl, "string" == typeof sourceContent) result.sourcesContent[index] = sourceContent, 
        callbackAsync(done, null); else {
          var readUrl = decodeUriComponent(fullUrl);
          read(readUrl, (function(error, source) {
            result.sourcesContent[index] = error || String(source), done();
          }));
        }
      }));
    } else callbackAsync(callback, null, result);
  }
  function resolveSourcesSync(map, mapUrl, read, options) {
    var result = {
      sourcesResolved: [],
      sourcesContent: []
    };
    return map.sources && 0 !== map.sources.length ? (resolveSourcesHelper(map, mapUrl, options, (function(fullUrl, sourceContent, index) {
      if (result.sourcesResolved[index] = fullUrl, null !== read) if ("string" == typeof sourceContent) result.sourcesContent[index] = sourceContent; else {
        var readUrl = decodeUriComponent(fullUrl);
        try {
          result.sourcesContent[index] = String(read(readUrl));
        } catch (error) {
          result.sourcesContent[index] = error;
        }
      }
    })), result) : result;
  }
  var endingSlash = /\/?$/;
  function resolveSourcesHelper(map, mapUrl, options, fn) {
    var sourceRoot;
    options = options || {}, mapUrl = urix(mapUrl);
    for (var index = 0, len = map.sources.length; index < len; index++) sourceRoot = null, 
    "string" == typeof options.sourceRoot ? sourceRoot = options.sourceRoot : "string" == typeof map.sourceRoot && !1 !== options.sourceRoot && (sourceRoot = map.sourceRoot), 
    fn(null === sourceRoot || "" === sourceRoot ? resolveUrl(mapUrl, map.sources[index]) : resolveUrl(mapUrl, sourceRoot.replace(endingSlash, "/"), map.sources[index]), (map.sourcesContent || [])[index], index);
  }
  module.exports = {
    resolveSourceMap: resolveSourceMap,
    resolveSourceMapSync: resolveSourceMapSync,
    resolveSources: resolveSources,
    resolveSourcesSync: resolveSourcesSync,
    resolve: function(code, codeUrl, read, options, callback) {
      if ("function" == typeof options && (callback = options, options = {}), null === code) {
        var data = {
          sourceMappingURL: null,
          url: codeUrl,
          sourcesRelativeTo: codeUrl,
          map: null
        }, readUrl = decodeUriComponent(codeUrl);
        read(readUrl, (function(error, result) {
          if (error) return error.sourceMapData = data, callback(error);
          data.map = String(result);
          try {
            data.map = parseMapToJSON(data.map, data);
          } catch (error) {
            return callback(error);
          }
          _resolveSources(data);
        }));
      } else resolveSourceMap(code, codeUrl, read, (function(error, mapData) {
        return error ? callback(error) : mapData ? void _resolveSources(mapData) : callback(null, null);
      }));
      function _resolveSources(mapData) {
        resolveSources(mapData.map, mapData.sourcesRelativeTo, read, options, (function(error, result) {
          if (error) return callback(error);
          mapData.sourcesResolved = result.sourcesResolved, mapData.sourcesContent = result.sourcesContent, 
          callback(null, mapData);
        }));
      }
    },
    resolveSync: function(code, codeUrl, read, options) {
      var mapData;
      if (null === code) {
        (mapData = {
          sourceMappingURL: null,
          url: codeUrl,
          sourcesRelativeTo: codeUrl,
          map: null
        }).map = readSync(read, codeUrl, mapData), mapData.map = parseMapToJSON(mapData.map, mapData);
      } else if (!(mapData = resolveSourceMapSync(code, codeUrl, read))) return null;
      var result = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read, options);
      return mapData.sourcesResolved = result.sourcesResolved, mapData.sourcesContent = result.sourcesContent, 
      mapData;
    },
    parseMapToJSON: parseMapToJSON
  };
}, function(module, exports, __webpack_require__) {
  var innerRegex, regex;
  module.exports = (innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/, {
    regex: regex = RegExp("(?:/\\*(?:\\s*\r?\n(?://)?)?(?:" + innerRegex.source + ")\\s*\\*/|//(?:" + innerRegex.source + "))\\s*"),
    _innerRegex: innerRegex,
    getFrom: function(code) {
      var match = code.match(regex);
      return match ? match[1] || match[2] || "" : null;
    },
    existsIn: function(code) {
      return regex.test(code);
    },
    removeFrom: function(code) {
      return code.replace(regex, "");
    },
    insertBefore: function(code, string) {
      var match = code.match(regex);
      return match ? code.slice(0, match.index) + string + code.slice(match.index) : code + string;
    }
  });
}, function(module, exports, __webpack_require__) {
  var url = __webpack_require__(85);
  module.exports = function() {
    return Array.prototype.reduce.call(arguments, (function(resolved, nextUrl) {
      return url.resolve(resolved, nextUrl);
    }));
  };
}, function(module, exports) {
  module.exports = require("url");
}, function(module, exports, __webpack_require__) {
  var decodeUriComponent = __webpack_require__(87);
  module.exports = function(string) {
    return decodeUriComponent(string.replace(/\+/g, "%2B"));
  };
}, function(module, exports, __webpack_require__) {
  var singleMatcher = new RegExp("%[a-f0-9]{2}", "gi"), multiMatcher = new RegExp("(%[a-f0-9]{2})+", "gi");
  function decodeComponents(components, split) {
    try {
      return decodeURIComponent(components.join(""));
    } catch (err) {}
    if (1 === components.length) return components;
    split = split || 1;
    var left = components.slice(0, split), right = components.slice(split);
    return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }
  function decode(input) {
    try {
      return decodeURIComponent(input);
    } catch (err) {
      for (var tokens = input.match(singleMatcher), i = 1; i < tokens.length; i++) tokens = (input = decodeComponents(tokens, i).join("")).match(singleMatcher);
      return input;
    }
  }
  module.exports = function(encodedURI) {
    if ("string" != typeof encodedURI) throw new TypeError("Expected `encodedURI` to be of type `string`, got `" + typeof encodedURI + "`");
    try {
      return encodedURI = encodedURI.replace(/\+/g, " "), decodeURIComponent(encodedURI);
    } catch (err) {
      return function(input) {
        for (var replaceMap = {
          "%FE%FF": "��",
          "%FF%FE": "��"
        }, match = multiMatcher.exec(input); match; ) {
          try {
            replaceMap[match[0]] = decodeURIComponent(match[0]);
          } catch (err) {
            var result = decode(match[0]);
            result !== match[0] && (replaceMap[match[0]] = result);
          }
          match = multiMatcher.exec(input);
        }
        replaceMap["%C2"] = "�";
        for (var entries = Object.keys(replaceMap), i = 0; i < entries.length; i++) {
          var key = entries[i];
          input = input.replace(new RegExp(key, "g"), replaceMap[key]);
        }
        return input;
      }(encodedURI);
    }
  };
}, function(module, exports, __webpack_require__) {
  var path = __webpack_require__(12);
  module.exports = function(aPath) {
    return "\\" === path.sep ? aPath.replace(/\\/g, "/").replace(/^[a-z]:\/?/i, "/") : aPath;
  };
}, function(module, exports, __webpack_require__) {
  function atob(str) {
    return Buffer.from(str, "base64").toString("binary");
  }
  module.exports = atob.atob = atob;
}, function(module, exports, __webpack_require__) {
  var fs = __webpack_require__(33), path = __webpack_require__(12), define = __webpack_require__(0), utils = __webpack_require__(11);
  module.exports = function(compiler) {
    for (var key in define(compiler, "_comment", compiler.comment), compiler.map = new utils.SourceMap.SourceMapGenerator, 
    compiler.position = {
      line: 1,
      column: 1
    }, compiler.content = {}, compiler.files = {}, exports) define(compiler, key, exports[key]);
  }, exports.updatePosition = function(str) {
    var lines = str.match(/\n/g);
    lines && (this.position.line += lines.length);
    var i = str.lastIndexOf("\n");
    this.position.column = ~i ? str.length - i : this.position.column + str.length;
  }, exports.emit = function(str, node) {
    var position = node.position || {}, source = position.source;
    return source && (position.filepath && (source = utils.unixify(position.filepath)), 
    this.map.addMapping({
      source: source,
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: position.start.line,
        column: position.start.column - 1
      }
    }), position.content && this.addContent(source, position), position.filepath && this.addFile(source, position), 
    this.updatePosition(str), this.output += str), str;
  }, exports.addFile = function(file, position) {
    "string" == typeof position.content && (Object.prototype.hasOwnProperty.call(this.files, file) || (this.files[file] = position.content));
  }, exports.addContent = function(source, position) {
    "string" == typeof position.content && (Object.prototype.hasOwnProperty.call(this.content, source) || this.map.setSourceContent(source, position.content));
  }, exports.applySourceMaps = function() {
    Object.keys(this.files).forEach((function(file) {
      var content = this.files[file];
      if (this.map.setSourceContent(file, content), !0 === this.options.inputSourcemaps) {
        var originalMap = utils.sourceMapResolve.resolveSync(content, file, fs.readFileSync);
        if (originalMap) {
          var map = new utils.SourceMap.SourceMapConsumer(originalMap.map), relativeTo = originalMap.sourcesRelativeTo;
          this.map.applySourceMap(map, file, utils.unixify(path.dirname(relativeTo)));
        }
      }
    }), this);
  }, exports.comment = function(node) {
    return /^# sourceMappingURL=/.test(node.comment) ? this.emit("", node.position) : this._comment(node);
  };
}, function(module, exports, __webpack_require__) {
  var use = __webpack_require__(31), util = __webpack_require__(2), Cache = __webpack_require__(34), define = __webpack_require__(0), debug = __webpack_require__(15)("snapdragon:parser"), Position = __webpack_require__(92), utils = __webpack_require__(11);
  function Parser(options) {
    debug("initializing", __filename), this.options = utils.extend({
      source: "string"
    }, options), this.init(this.options), use(this);
  }
  function visit(node, fn) {
    return node.visited ? node : (define(node, "visited", !0), node.nodes ? function(nodes, fn) {
      var len = nodes.length, idx = -1;
      for (;++idx < len; ) visit(nodes[idx], fn);
    }(node.nodes, fn) : fn(node));
  }
  function hasDelims(node) {
    return function(node) {
      return node.nodes && node.nodes[0].type === node.type + ".open";
    }(node) && function(node) {
      return node.nodes && utils.last(node.nodes).type === node.type + ".close";
    }(node);
  }
  Parser.prototype = {
    constructor: Parser,
    init: function(options) {
      this.orig = "", this.input = "", this.parsed = "", this.column = 1, this.line = 1, 
      this.regex = new Cache, this.errors = this.errors || [], this.parsers = this.parsers || {}, 
      this.types = this.types || [], this.sets = this.sets || {}, this.fns = this.fns || [], 
      this.currentType = "root";
      var pos = this.position();
      this.bos = pos({
        type: "bos",
        val: ""
      }), this.ast = {
        type: "root",
        errors: this.errors,
        nodes: [ this.bos ]
      }, define(this.bos, "parent", this.ast), this.nodes = [ this.ast ], this.count = 0, 
      this.setCount = 0, this.stack = [];
    },
    error: function(msg, node) {
      var pos = node.position || {
        start: {
          column: 0,
          line: 0
        }
      }, line = pos.start.line, column = pos.start.column, source = this.options.source, err = new Error(source + " <line:" + line + " column:" + column + ">: " + msg);
      if (err.source = source, err.reason = msg, err.pos = pos, !this.options.silent) throw err;
      this.errors.push(err);
    },
    define: function(key, val) {
      return define(this, key, val), this;
    },
    position: function() {
      var start = {
        line: this.line,
        column: this.column
      }, self = this;
      return function(node) {
        return define(node, "position", new Position(start, self)), node;
      };
    },
    set: function(type, fn) {
      return -1 === this.types.indexOf(type) && this.types.push(type), this.parsers[type] = fn.bind(this), 
      this;
    },
    get: function(name) {
      return this.parsers[name];
    },
    push: function(type, token) {
      return this.sets[type] = this.sets[type] || [], this.count++, this.stack.push(token), 
      this.sets[type].push(token);
    },
    pop: function(type) {
      return this.sets[type] = this.sets[type] || [], this.count--, this.stack.pop(), 
      this.sets[type].pop();
    },
    isInside: function(type) {
      return this.sets[type] = this.sets[type] || [], this.sets[type].length > 0;
    },
    isType: function(node, type) {
      return node && node.type === type;
    },
    prev: function(n) {
      return this.stack.length > 0 ? utils.last(this.stack, n) : utils.last(this.nodes, n);
    },
    consume: function(len) {
      this.input = this.input.substr(len);
    },
    updatePosition: function(str, len) {
      var lines = str.match(/\n/g);
      lines && (this.line += lines.length);
      var i = str.lastIndexOf("\n");
      this.column = ~i ? len - i : this.column + len, this.parsed += str, this.consume(len);
    },
    match: function(regex) {
      var m = regex.exec(this.input);
      if (m) return this.updatePosition(m[0], m[0].length), m;
    },
    capture: function(type, regex) {
      return "function" == typeof regex ? this.set.apply(this, arguments) : (this.regex.set(type, regex), 
      this.set(type, function() {
        var parsed = this.parsed, pos = this.position(), m = this.match(regex);
        if (m && m[0]) {
          var prev = this.prev(), node = pos({
            type: type,
            val: m[0],
            parsed: parsed,
            rest: this.input
          });
          m[1] && (node.inner = m[1]), define(node, "inside", this.stack.length > 0), define(node, "parent", prev), 
          prev.nodes.push(node);
        }
      }.bind(this)), this);
    },
    capturePair: function(type, openRegex, closeRegex, fn) {
      return this.sets[type] = this.sets[type] || [], this.set(type + ".open", (function() {
        var parsed = this.parsed, pos = this.position(), m = this.match(openRegex);
        if (m && m[0]) {
          var val = m[0];
          this.setCount++, this.specialChars = !0;
          var open = pos({
            type: type + ".open",
            val: val,
            rest: this.input
          });
          void 0 !== m[1] && (open.inner = m[1]);
          var prev = this.prev(), node = pos({
            type: type,
            nodes: [ open ]
          });
          define(node, "rest", this.input), define(node, "parsed", parsed), define(node, "prefix", m[1]), 
          define(node, "parent", prev), define(open, "parent", node), "function" == typeof fn && fn.call(this, open, node), 
          this.push(type, node), prev.nodes.push(node);
        }
      })), this.set(type + ".close", (function() {
        var pos = this.position(), m = this.match(closeRegex);
        if (m && m[0]) {
          var parent = this.pop(type), node = pos({
            type: type + ".close",
            rest: this.input,
            suffix: m[1],
            val: m[0]
          });
          if (!this.isType(parent, type)) {
            if (this.options.strict) throw new Error('missing opening "' + type + '"');
            return this.setCount--, node.escaped = !0, node;
          }
          "\\" === node.suffix && (parent.escaped = !0, node.escaped = !0), parent.nodes.push(node), 
          define(node, "parent", parent);
        }
      })), this;
    },
    eos: function() {
      var pos = this.position();
      if (!this.input) {
        for (var prev = this.prev(); "root" !== prev.type && !prev.visited; ) {
          if (!0 === this.options.strict) throw new SyntaxError("invalid syntax:" + util.inspect(prev, null, 2));
          hasDelims(prev) || (prev.parent.escaped = !0, prev.escaped = !0), visit(prev, (function(node) {
            hasDelims(node.parent) || (node.parent.escaped = !0, node.escaped = !0);
          })), prev = prev.parent;
        }
        var tok = pos({
          type: "eos",
          val: this.append || ""
        });
        return define(tok, "parent", this.ast), tok;
      }
    },
    next: function() {
      for (var tok, parsed = this.parsed, len = this.types.length, idx = -1; ++idx < len; ) if (tok = this.parsers[this.types[idx]].call(this)) return define(tok, "rest", this.input), 
      define(tok, "parsed", parsed), this.last = tok, tok;
    },
    parse: function(input) {
      if ("string" != typeof input) throw new TypeError("expected a string");
      this.init(this.options), this.orig = input, this.input = input;
      var self = this;
      function parse() {
        input = self.input;
        var node = self.next();
        if (node) {
          var prev = self.prev();
          prev && (define(node, "parent", prev), prev.nodes && prev.nodes.push(node)), self.sets.hasOwnProperty(prev.type) && (self.currentType = prev.type);
        }
        if (self.input && input === self.input) throw new Error('no parsers registered for: "' + self.input.slice(0, 5) + '"');
      }
      for (;this.input; ) parse();
      if (this.stack.length && this.options.strict) {
        var node = this.stack.pop();
        throw this.error("missing opening " + node.type + ': "' + this.orig + '"');
      }
      var eos = this.eos();
      return "eos" !== this.prev().type && this.ast.nodes.push(eos), this.ast;
    }
  }, module.exports = Parser;
}, function(module, exports, __webpack_require__) {
  var define = __webpack_require__(0);
  module.exports = function(start, parser) {
    this.start = start, this.end = {
      line: parser.line,
      column: parser.column
    }, define(this, "content", parser.orig), define(this, "source", parser.options.source);
  };
}, function(module, exports, __webpack_require__) {
  var nanomatch = __webpack_require__(35), extglob = __webpack_require__(38);
  function escapeExtglobs(compiler) {
    function visit(node, fn) {
      return node.nodes ? function(nodes, fn) {
        var len = nodes.length, idx = -1;
        for (;++idx < len; ) visit(nodes[idx], fn);
      }(node.nodes, fn) : fn(node);
    }
    compiler.set("paren", (function(node) {
      var val = "";
      return visit(node, (function(tok) {
        tok.val && (val += (/^\W/.test(tok.val) ? "\\" : "") + tok.val);
      })), this.emit(val, node);
    }));
  }
  module.exports = function(snapdragon) {
    var compilers = snapdragon.compiler.compilers, opts = snapdragon.options;
    snapdragon.use(nanomatch.compilers);
    var escape = compilers.escape, qmark = compilers.qmark, slash = compilers.slash, star = compilers.star, text = compilers.text, plus = compilers.plus, dot = compilers.dot;
    !1 === opts.extglob || !0 === opts.noext ? snapdragon.compiler.use(escapeExtglobs) : snapdragon.use(extglob.compilers), 
    snapdragon.use((function() {
      this.options.star = this.options.star || function() {
        return "[^\\\\/]*?";
      };
    })), snapdragon.compiler.set("dot", dot).set("escape", escape).set("plus", plus).set("slash", slash).set("qmark", qmark).set("star", star).set("text", text);
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(nanomatch, options) {
    function slash() {
      return options && "string" == typeof options.slash ? options.slash : options && "function" == typeof options.slash ? options.slash.call(nanomatch) : "\\\\/";
    }
    function star() {
      return options && "string" == typeof options.star ? options.star : options && "function" == typeof options.star ? options.star.call(nanomatch) : "[^" + slash() + "]*?";
    }
    var ast = nanomatch.ast = nanomatch.parser.ast;
    ast.state = nanomatch.parser.state, nanomatch.compiler.state = ast.state, nanomatch.compiler.set("not", (function(node) {
      var prev = this.prev();
      return !0 === this.options.nonegate || "bos" !== prev.type ? this.emit("\\" + node.val, node) : this.emit(node.val, node);
    })).set("escape", (function(node) {
      return this.options.unescape && /^[-\w_.]/.test(node.val) ? this.emit(node.val, node) : this.emit("\\" + node.val, node);
    })).set("quoted", (function(node) {
      return this.emit(node.val, node);
    })).set("dollar", (function(node) {
      return "bracket" === node.parent.type ? this.emit(node.val, node) : this.emit("\\" + node.val, node);
    })).set("dot", (function(node) {
      return !0 === node.dotfiles && (this.dotfiles = !0), this.emit("\\" + node.val, node);
    })).set("backslash", (function(node) {
      return this.emit(node.val, node);
    })).set("slash", (function(node, nodes, i) {
      for (var val = "[" + slash() + "]", parent = node.parent, prev = this.prev(); "paren" === parent.type && !parent.hasSlash; ) parent.hasSlash = !0, 
      parent = parent.parent;
      return prev.addQmark && (val += "?"), "\\b" === node.rest.slice(0, 2) ? this.emit(val, node) : "**" === node.parsed || "./**" === node.parsed ? (this.output = "(?:" + this.output, 
      this.emit(val + ")?", node)) : "!**" === node.parsed && !0 !== this.options.nonegate ? this.emit(val + "?\\b", node) : this.emit(val, node);
    })).set("bracket", (function(node) {
      var close = node.close, open = node.escaped ? "\\[" : "[", negated = node.negated, inner = node.inner, val = node.val;
      return !0 === node.escaped && (inner = inner.replace(/\\?(\W)/g, "\\$1"), negated = ""), 
      "]-" === inner && (inner = "\\]\\-"), negated && -1 === inner.indexOf(".") && (inner += "."), 
      negated && -1 === inner.indexOf("/") && (inner += "/"), val = open + negated + inner + close, 
      this.emit(val, node);
    })).set("square", (function(node) {
      var val = (/^\W/.test(node.val) ? "\\" : "") + node.val;
      return this.emit(val, node);
    })).set("qmark", (function(node) {
      var prev = this.prev(), val = "[^.\\\\/]";
      if ((this.options.dot || "bos" !== prev.type && "slash" !== prev.type) && (val = "[^\\\\/]"), 
      "(" === node.parsed.slice(-1)) {
        var ch = node.rest.charAt(0);
        if ("!" === ch || "=" === ch || ":" === ch) return this.emit(node.val, node);
      }
      return node.val.length > 1 && (val += "{" + node.val.length + "}"), this.emit(val, node);
    })).set("plus", (function(node) {
      var prev = node.parsed.slice(-1);
      if ("]" === prev || ")" === prev) return this.emit(node.val, node);
      if (!this.output || /[?*+]/.test(ch) && "bracket" !== node.parent.type) return this.emit("\\+", node);
      var ch = this.output.slice(-1);
      return /\w/.test(ch) && !node.inside ? this.emit("+\\+?", node) : this.emit("+", node);
    })).set("globstar", (function(node, nodes, i) {
      this.output || (this.state.leadingGlobstar = !0);
      var prev = this.prev(), before = this.prev(2), next = this.next(), after = this.next(2), type = prev.type, val = node.val;
      "slash" === prev.type && "slash" === next.type && "text" === before.type && (this.output += "?", 
      "text" !== after.type && (this.output += "\\b"));
      var parsed = node.parsed;
      "!" === parsed.charAt(0) && (parsed = parsed.slice(1));
      var isInside = node.isInside.paren || node.isInside.brace;
      return val = parsed && "slash" !== type && "bos" !== type && !isInside ? star() : !0 !== this.options.dot ? "(?:(?!(?:[" + slash() + "]|^)\\.).)*?" : "(?:(?!(?:[" + slash() + "]|^)(?:\\.{1,2})($|[" + slash() + "]))(?!\\.{2}).)*?", 
      "slash" !== type && "bos" !== type || !0 === this.options.dot || (val = "(?!\\.)" + val), 
      "slash" === prev.type && "slash" === next.type && "text" !== before.type && ("text" !== after.type && "star" !== after.type || (node.addQmark = !0)), 
      this.options.capture && (val = "(" + val + ")"), this.emit(val, node);
    })).set("star", (function(node, nodes, i) {
      var prior = nodes[i - 2] || {}, prev = this.prev(), next = this.next(), type = prev.type;
      function isStart(n) {
        return "bos" === n.type || "slash" === n.type;
      }
      if ("" === this.output && !0 !== this.options.contains && (this.output = "(?![" + slash() + "])"), 
      "bracket" === type && !1 === this.options.bash) {
        var str = next && "bracket" === next.type ? star() : "*?";
        if (!prev.nodes || "posix" !== prev.nodes[1].type) return this.emit(str, node);
      }
      var prefix = this.dotfiles || "text" === type || "escape" === type ? "" : this.options.dot ? "(?!(?:^|[" + slash() + "])\\.{1,2}(?:$|[" + slash() + "]))" : "(?!\\.)";
      isStart(prev) || isStart(prior) && "not" === type ? prefix += "(?!\\.)" !== prefix ? "(?!(\\.{2}|\\.[" + slash() + "]))(?=.)" : "(?=.)" : "(?!\\.)" === prefix && (prefix = ""), 
      "not" === prev.type && "bos" === prior.type && !0 === this.options.dot && (this.output = "(?!\\.)" + this.output);
      var output = prefix + star();
      return this.options.capture && (output = "(" + output + ")"), this.emit(output, node);
    })).set("text", (function(node) {
      return this.emit(node.val, node);
    })).set("eos", (function(node) {
      var prev = this.prev(), val = node.val;
      return this.output = "(?:\\.[" + slash() + "](?=.))?" + this.output, this.state.metachar && "qmark" !== prev.type && "slash" !== prev.type && (val += this.options.contains ? "[" + slash() + "]?" : "(?:[" + slash() + "]|$)"), 
      this.emit(val, node);
    })), options && "function" == typeof options.compilers && options.compilers(nanomatch.compiler);
  };
}, function(module, exports, __webpack_require__) {
  var cached, regexNot = __webpack_require__(5), toRegex = __webpack_require__(3), not = function(pattern) {
    if (cached) return cached;
    var opts = {
      contains: !0,
      strictClose: !1
    }, not = regexNot.create(pattern, opts), re = toRegex("^(?:[*]\\((?=.)|" + not + ")", opts);
    return cached = re;
  }("[\\[!*+?$^\"'.\\\\/]+");
  module.exports = function(nanomatch, options) {
    var parser = nanomatch.parser, opts = parser.options;
    parser.state = {
      slashes: 0,
      paths: []
    }, parser.ast.state = parser.state, parser.capture("prefix", (function() {
      this.parsed || this.match(/^\.[\\/]/) && (this.state.strictOpen = !!this.options.strictOpen, 
      this.state.addPrefix = !0);
    })).capture("escape", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(/^(?:\\(.)|([$^]))/);
        if (m) return pos({
          type: "escape",
          val: m[2] || m[1]
        });
      }
    })).capture("quoted", (function() {
      var pos = this.position(), m = this.match(/^["']/);
      if (m) {
        var quote = m[0];
        if (-1 === this.input.indexOf(quote)) return pos({
          type: "escape",
          val: quote
        });
        var tok = function(input, endChar) {
          var ch = input.charAt(0), tok = {
            len: 1,
            val: "",
            esc: ""
          }, idx = 0;
          function advance() {
            "\\" !== ch && (tok.esc += "\\" + ch, tok.val += ch), ch = input.charAt(++idx), 
            tok.len++, "\\" === ch && (advance(), advance());
          }
          for (;ch && ch !== endChar; ) advance();
          return tok;
        }(this.input, quote);
        return this.consume(tok.len), pos({
          type: "quoted",
          val: tok.esc
        });
      }
    })).capture("not", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(this.notRegex || /^!+/);
      if (m) {
        var val = m[0], isNegated = val.length % 2 == 1;
        return "" !== parsed || isNegated || (val = ""), "" === parsed && isNegated && !0 !== this.options.nonegate && (this.bos.val = "(?!^(?:", 
        this.append = ")$).*", val = ""), pos({
          type: "not",
          val: val
        });
      }
    })).capture("dot", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\.+/);
      if (m) {
        var val = m[0];
        return this.state.dot = "." === val && ("" === parsed || "/" === parsed.slice(-1)), 
        pos({
          type: "dot",
          dotfiles: this.state.dot,
          val: val
        });
      }
    })).capture("plus", /^\+(?!\()/).capture("qmark", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\?+(?!\()/);
      if (m) return this.state.metachar = !0, this.state.qmark = !0, pos({
        type: "qmark",
        parsed: parsed,
        val: m[0]
      });
    })).capture("globstar", (function() {
      var parsed = this.parsed, pos = this.position();
      if (this.match(/^\*{2}(?![*(])(?=[,)/]|$)/)) {
        var type = !0 !== opts.noglobstar ? "globstar" : "star", node = pos({
          type: type,
          parsed: parsed
        });
        for (this.state.metachar = !0; "/**/" === this.input.slice(0, 4); ) this.input = this.input.slice(3);
        return node.isInside = {
          brace: this.isInside("brace"),
          paren: this.isInside("paren")
        }, "globstar" === type ? (this.state.globstar = !0, node.val = "**") : (this.state.star = !0, 
        node.val = "*"), node;
      }
    })).capture("star", (function() {
      var pos = this.position(), m = this.match(/^(?:\*(?![*(])|[*]{3,}(?!\()|[*]{2}(?![(/]|$)|\*(?=\*\())/);
      if (m) return this.state.metachar = !0, this.state.star = !0, pos({
        type: "star",
        val: m[0]
      });
    })).capture("slash", (function() {
      var pos = this.position(), m = this.match(/^\//);
      if (m) return this.state.slashes++, pos({
        type: "slash",
        val: m[0]
      });
    })).capture("backslash", (function() {
      var pos = this.position(), m = this.match(/^\\(?![*+?(){}[\]'"])/);
      if (m) {
        var val = m[0];
        return this.isInside("bracket") ? val = "\\" : val.length > 1 && (val = "\\\\"), 
        pos({
          type: "backslash",
          val: val
        });
      }
    })).capture("square", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(/^\[([^!^\\])\]/);
        if (m) return pos({
          type: "square",
          val: m[1]
        });
      }
    })).capture("bracket", (function() {
      var pos = this.position(), m = this.match(/^(?:\[([!^]?)([^\]]+|\]-)(\]|[^*+?]+)|\[)/);
      if (m) {
        var val = m[0], negated = m[1] ? "^" : "", inner = (m[2] || "").replace(/\\\\+/, "\\\\"), close = m[3] || "";
        m[2] && inner.length < m[2].length && (val = val.replace(/\\\\+/, "\\\\"));
        var esc = this.input.slice(0, 2);
        if ("" === inner && "\\]" === esc) {
          inner += esc, this.consume(2);
          for (var ch, str = this.input, idx = -1; ch = str[++idx]; ) {
            if (this.consume(1), "]" === ch) {
              close = ch;
              break;
            }
            inner += ch;
          }
        }
        return pos({
          type: "bracket",
          val: val,
          escaped: "]" !== close,
          negated: negated,
          inner: inner,
          close: close
        });
      }
    })).capture("text", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(not);
        if (m && m[0]) return pos({
          type: "text",
          val: m[0]
        });
      }
    })), options && "function" == typeof options.parsers && options.parsers(nanomatch.parser);
  }, module.exports.not = "[\\[!*+?$^\"'.\\\\/]+";
}, function(module, exports, __webpack_require__) {
  module.exports = new (__webpack_require__(16));
}, function(module, exports, __webpack_require__) {
  var utils = module.exports, path = __webpack_require__(12), isWindows = __webpack_require__(98)(), Snapdragon = __webpack_require__(7);
  utils.define = __webpack_require__(0), utils.diff = __webpack_require__(36), utils.extend = Object.assign, 
  utils.pick = __webpack_require__(37), utils.typeOf = __webpack_require__(4), utils.unique = __webpack_require__(6), 
  utils.isEmptyString = function(val) {
    return "" === String(val) || "./" === String(val);
  }, utils.isWindows = function() {
    return "\\" === path.sep || !0 === isWindows;
  }, utils.last = function(arr, n) {
    return arr[arr.length - (n || 1)];
  }, utils.instantiate = function(ast, options) {
    var snapdragon;
    return snapdragon = "object" === utils.typeOf(ast) && ast.snapdragon ? ast.snapdragon : "object" === utils.typeOf(options) && options.snapdragon ? options.snapdragon : new Snapdragon(options), 
    utils.define(snapdragon, "parse", (function(str, options) {
      var parsed = Snapdragon.prototype.parse.call(this, str, options);
      parsed.input = str;
      var last = this.parser.stack.pop();
      if (last && !0 !== this.options.strictErrors) {
        var open = last.nodes[0], inner = last.nodes[1];
        if ("bracket" === last.type) "[" === inner.val.charAt(0) && (inner.val = "\\" + inner.val); else {
          open.val = "\\" + open.val;
          var sibling = open.parent.nodes[1];
          "star" === sibling.type && (sibling.loose = !0);
        }
      }
      return utils.define(parsed, "parser", this.parser), parsed;
    })), snapdragon;
  }, utils.createKey = function(pattern, options) {
    if (void 0 === options) return pattern;
    var key = pattern;
    for (var prop in options) options.hasOwnProperty(prop) && (key += ";" + prop + "=" + String(options[prop]));
    return key;
  }, utils.arrayify = function(val) {
    return "string" == typeof val ? [ val ] : val ? Array.isArray(val) ? val : [ val ] : [];
  }, utils.isString = function(val) {
    return "string" == typeof val;
  }, utils.isRegex = function(val) {
    return "regexp" === utils.typeOf(val);
  }, utils.isObject = function(val) {
    return "object" === utils.typeOf(val);
  }, utils.escapeRegex = function(str) {
    return str.replace(/[-[\]{}()^$|*+?.\\/\s]/g, "\\$&");
  }, utils.combineDupes = function(input, patterns) {
    var substr = (patterns = (patterns = utils.arrayify(patterns).join("|").split("|")).map((function(s) {
      return s.replace(/\\?([+*\\/])/g, "\\$1");
    }))).join("|"), regex = new RegExp("(" + substr + ")(?=\\1)", "g");
    return input.replace(regex, "");
  }, utils.hasSpecialChars = function(str) {
    return /(?:(?:(^|\/)[!.])|[*?+()|[\]{}]|[+@]\()/.test(str);
  }, utils.toPosixPath = function(str) {
    return str.replace(/\\+/g, "/");
  }, utils.unescape = function(str) {
    return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ""));
  }, utils.stripDrive = function(fp) {
    return utils.isWindows() ? fp.replace(/^[a-z]:[\\/]+?/i, "/") : fp;
  }, utils.stripPrefix = function(str) {
    return "." !== str.charAt(0) || "/" !== str.charAt(1) && "\\" !== str.charAt(1) ? str : str.slice(2);
  }, utils.isSimpleChar = function(str) {
    return "" === str.trim() || "." === str;
  }, utils.isSlash = function(str) {
    return "/" === str || "\\/" === str || "\\" === str || "\\\\" === str;
  }, utils.matchPath = function(pattern, options) {
    return options && options.contains ? utils.containsPattern(pattern, options) : utils.equalsPattern(pattern, options);
  }, utils._equals = function(filepath, unixPath, pattern) {
    return pattern === filepath || pattern === unixPath;
  }, utils._contains = function(filepath, unixPath, pattern) {
    return -1 !== filepath.indexOf(pattern) || -1 !== unixPath.indexOf(pattern);
  }, utils.equalsPattern = function(pattern, options) {
    var unixify = utils.unixify(options);
    return options = options || {}, function(filepath) {
      var equal = utils._equals(filepath, unixify(filepath), pattern);
      if (!0 === equal || !0 !== options.nocase) return equal;
      var lower = filepath.toLowerCase();
      return utils._equals(lower, unixify(lower), pattern);
    };
  }, utils.containsPattern = function(pattern, options) {
    var unixify = utils.unixify(options);
    return options = options || {}, function(filepath) {
      var contains = utils._contains(filepath, unixify(filepath), pattern);
      if (!0 === contains || !0 !== options.nocase) return contains;
      var lower = filepath.toLowerCase();
      return utils._contains(lower, unixify(lower), pattern);
    };
  }, utils.matchBasename = function(re) {
    return function(filepath) {
      return re.test(filepath) || re.test(path.basename(filepath));
    };
  }, utils.identity = function(val) {
    return val;
  }, utils.value = function(str, unixify, options) {
    return options && !1 === options.unixify ? str : options && "function" == typeof options.unixify ? options.unixify(str) : unixify(str);
  }, utils.unixify = function(options) {
    var opts = options || {};
    return function(filepath) {
      return !1 !== opts.stripPrefix && (filepath = utils.stripPrefix(filepath)), !0 === opts.unescape && (filepath = utils.unescape(filepath)), 
      (!0 === opts.unixify || utils.isWindows()) && (filepath = utils.toPosixPath(filepath)), 
      filepath;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function() {
    return process && ("win32" === process.platform || /^(msys|cygwin)$/.test(process.env.OSTYPE));
  };
}, function(module, exports, __webpack_require__) {
  var posix = __webpack_require__(100);
  module.exports = function(brackets) {
    brackets.compiler.set("escape", (function(node) {
      return this.emit("\\" + node.val.replace(/^\\/, ""), node);
    })).set("text", (function(node) {
      return this.emit(node.val.replace(/([{}])/g, "\\$1"), node);
    })).set("posix", (function(node) {
      if ("[::]" === node.val) return this.emit("\\[::\\]", node);
      var val = posix[node.inner];
      return void 0 === val && (val = "[" + node.inner + "]"), this.emit(val, node);
    })).set("bracket", (function(node) {
      return this.mapVisit(node.nodes);
    })).set("bracket.open", (function(node) {
      return this.emit(node.val, node);
    })).set("bracket.inner", (function(node) {
      var inner = node.val;
      if ("[" === inner || "]" === inner) return this.emit("\\" + node.val, node);
      if ("^]" === inner) return this.emit("^\\]", node);
      if ("^" === inner) return this.emit("^", node);
      /-/.test(inner) && !/(\d-\d|\w-\w)/.test(inner) && (inner = inner.split("-").join("\\-"));
      var isNegated = "^" === inner.charAt(0);
      return isNegated && -1 === inner.indexOf("/") && (inner += "/"), isNegated && -1 === inner.indexOf(".") && (inner += "."), 
      inner = inner.replace(/\\([1-9])/g, "$1"), this.emit(inner, node);
    })).set("bracket.close", (function(node) {
      var val = node.val.replace(/^\\/, "");
      return !0 === node.parent.escaped ? this.emit("\\" + val, node) : this.emit(val, node);
    }));
  };
}, function(module, exports, __webpack_require__) {
  module.exports = {
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  };
}, function(module, exports, __webpack_require__) {
  var utils = __webpack_require__(102), define = __webpack_require__(0), not = utils.createRegex("(\\[(?=.*\\])|\\])+");
  module.exports = function(brackets) {
    brackets.state = brackets.state || {}, brackets.parser.sets.bracket = brackets.parser.sets.bracket || [], 
    brackets.parser.capture("escape", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(/^\\(.)/);
        if (m) return pos({
          type: "escape",
          val: m[0]
        });
      }
    })).capture("text", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(not);
        if (m && m[0]) return pos({
          type: "text",
          val: m[0]
        });
      }
    })).capture("posix", (function() {
      var pos = this.position(), m = this.match(/^\[:(.*?):\](?=.*\])/);
      if (m) {
        var inside = this.isInside("bracket");
        return inside && brackets.posix++, pos({
          type: "posix",
          insideBracket: inside,
          inner: m[1],
          val: m[0]
        });
      }
    })).capture("bracket", (function() {})).capture("bracket.open", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\[(?=.*\])/);
      if (m) {
        var prev = this.prev(), last = utils.last(prev.nodes);
        if ("\\" === parsed.slice(-1) && !this.isInside("bracket")) return last.val = last.val.slice(0, last.val.length - 1), 
        pos({
          type: "escape",
          val: m[0]
        });
        var open = pos({
          type: "bracket.open",
          val: m[0]
        });
        if ("bracket.open" === last.type || this.isInside("bracket")) return open.val = "\\" + open.val, 
        open.type = "bracket.inner", open.escaped = !0, open;
        var node = pos({
          type: "bracket",
          nodes: [ open ]
        });
        define(node, "parent", prev), define(open, "parent", node), this.push("bracket", node), 
        prev.nodes.push(node);
      }
    })).capture("bracket.inner", (function() {
      if (this.isInside("bracket")) {
        var pos = this.position(), m = this.match(not);
        if (m && m[0]) {
          var next = this.input.charAt(0), val = m[0], node = pos({
            type: "bracket.inner",
            val: val
          });
          if ("\\\\" === val) return node;
          var first = val.charAt(0), last = val.slice(-1);
          return "!" === first && (val = "^" + val.slice(1)), ("\\" === last || "^" === val && "]" === next) && (val += this.input[0], 
          this.consume(1)), node.val = val, node;
        }
      }
    })).capture("bracket.close", (function() {
      var parsed = this.parsed, pos = this.position(), m = this.match(/^\]/);
      if (m) {
        var prev = this.prev(), last = utils.last(prev.nodes);
        if ("\\" === parsed.slice(-1) && !this.isInside("bracket")) return last.val = last.val.slice(0, last.val.length - 1), 
        pos({
          type: "escape",
          val: m[0]
        });
        var node = pos({
          type: "bracket.close",
          rest: this.input,
          val: m[0]
        });
        if ("bracket.open" === last.type) return node.type = "bracket.inner", node.escaped = !0, 
        node;
        var bracket = this.pop("bracket");
        if (!this.isType(bracket, "bracket")) {
          if (this.options.strict) throw new Error('missing opening "["');
          return node.type = "bracket.inner", node.escaped = !0, node;
        }
        bracket.nodes.push(node), define(node, "parent", bracket);
      }
    }));
  }, module.exports.TEXT_REGEX = "(\\[(?=.*\\])|\\])+";
}, function(module, exports, __webpack_require__) {
  var cached, toRegex = __webpack_require__(3), regexNot = __webpack_require__(5);
  exports.last = function(arr) {
    return arr[arr.length - 1];
  }, exports.createRegex = function(pattern, include) {
    if (cached) return cached;
    var re, opts = {
      contains: !0,
      strictClose: !1
    }, not = regexNot.create(pattern, opts);
    return re = toRegex("string" == typeof include ? "^(?:" + include + "|" + not + ")" : not, opts), 
    cached = re;
  };
}, function(module, exports, __webpack_require__) {
  var Snapdragon = __webpack_require__(7), define = __webpack_require__(0), extend = Object.assign, compilers = __webpack_require__(39), parsers = __webpack_require__(41);
  module.exports = function(options) {
    this.options = extend({
      source: "extglob"
    }, options), this.snapdragon = this.options.snapdragon || new Snapdragon(this.options), 
    this.snapdragon.patterns = this.snapdragon.patterns || {}, this.compiler = this.snapdragon.compiler, 
    this.parser = this.snapdragon.parser, compilers(this.snapdragon), parsers(this.snapdragon), 
    define(this.snapdragon, "parse", (function(str, options) {
      var parsed = Snapdragon.prototype.parse.apply(this, arguments);
      parsed.input = str;
      var last = this.parser.stack.pop();
      if (last && !0 !== this.options.strict) {
        var node = last.nodes[0];
        node.val = "\\" + node.val;
        var sibling = node.parent.nodes[1];
        "star" === sibling.type && (sibling.loose = !0);
      }
      return define(parsed, "parser", this.parser), parsed;
    })), define(this, "parse", (function(ast, options) {
      return this.snapdragon.parse.apply(this.snapdragon, arguments);
    })), define(this, "compile", (function(ast, options) {
      return this.snapdragon.compile.apply(this.snapdragon, arguments);
    }));
  };
}, function(module, exports, __webpack_require__) {
  var not, extglob = __webpack_require__(38), nanomatch = __webpack_require__(35), regexNot = __webpack_require__(5), toRegex = __webpack_require__(3), createNotRegex = function(opts) {
    return not || (pattern = "([!@*?+]?\\(|\\)|\\[:?(?=.*?:?\\])|:?\\]|[*+?!^$.\\\\/])+", 
    notStr = regexNot.create(pattern, {
      contains: !0,
      strictClose: !1
    }), not = toRegex("(?:[\\^]|\\\\|" + notStr + ")", {
      strictClose: !1
    }));
    var pattern, notStr;
  };
  module.exports = function(snapdragon) {
    var parsers = snapdragon.parser.parsers;
    snapdragon.use(nanomatch.parsers);
    var escape = parsers.escape, slash = parsers.slash, qmark = parsers.qmark, plus = parsers.plus, star = parsers.star, dot = parsers.dot;
    snapdragon.use(extglob.parsers), snapdragon.parser.use((function() {
      this.notRegex = /^\!+(?!\()/;
    })).capture("escape", escape).capture("slash", slash).capture("qmark", qmark).capture("star", star).capture("plus", plus).capture("dot", dot).capture("text", (function() {
      if (!this.isInside("bracket")) {
        var pos = this.position(), m = this.match(createNotRegex(this.options));
        if (m && m[0]) return pos({
          type: "text",
          val: m[0].replace(/([[\]^$])/g, "\\$1")
        });
      }
    }));
  };
}, function(module, exports, __webpack_require__) {
  module.exports = new (__webpack_require__(16));
}, function(module, exports, __webpack_require__) {
  var utils = module.exports, path = __webpack_require__(12), Snapdragon = __webpack_require__(7);
  utils.define = __webpack_require__(0), utils.diff = __webpack_require__(36), utils.extend = Object.assign, 
  utils.pick = __webpack_require__(37), utils.typeOf = __webpack_require__(4), utils.unique = __webpack_require__(6), 
  utils.isWindows = function() {
    return "\\" === path.sep || "win32" === process.platform;
  }, utils.instantiate = function(ast, options) {
    var snapdragon;
    return snapdragon = "object" === utils.typeOf(ast) && ast.snapdragon ? ast.snapdragon : "object" === utils.typeOf(options) && options.snapdragon ? options.snapdragon : new Snapdragon(options), 
    utils.define(snapdragon, "parse", (function(str, options) {
      var parsed = Snapdragon.prototype.parse.apply(this, arguments);
      parsed.input = str;
      var last = this.parser.stack.pop();
      if (last && !0 !== this.options.strictErrors) {
        var open = last.nodes[0], inner = last.nodes[1];
        if ("bracket" === last.type) "[" === inner.val.charAt(0) && (inner.val = "\\" + inner.val); else {
          open.val = "\\" + open.val;
          var sibling = open.parent.nodes[1];
          "star" === sibling.type && (sibling.loose = !0);
        }
      }
      return utils.define(parsed, "parser", this.parser), parsed;
    })), snapdragon;
  }, utils.createKey = function(pattern, options) {
    if ("object" !== utils.typeOf(options)) return pattern;
    for (var val = pattern, keys = Object.keys(options), i = 0; i < keys.length; i++) {
      var key = keys[i];
      val += ";" + key + "=" + String(options[key]);
    }
    return val;
  }, utils.arrayify = function(val) {
    return "string" == typeof val ? [ val ] : val ? Array.isArray(val) ? val : [ val ] : [];
  }, utils.isString = function(val) {
    return "string" == typeof val;
  }, utils.isObject = function(val) {
    return "object" === utils.typeOf(val);
  }, utils.hasSpecialChars = function(str) {
    return /(?:(?:(^|\/)[!.])|[*?+()|\[\]{}]|[+@]\()/.test(str);
  }, utils.escapeRegex = function(str) {
    return str.replace(/[-[\]{}()^$|*+?.\\\/\s]/g, "\\$&");
  }, utils.toPosixPath = function(str) {
    return str.replace(/\\+/g, "/");
  }, utils.unescape = function(str) {
    return utils.toPosixPath(str.replace(/\\(?=[*+?!.])/g, ""));
  }, utils.stripPrefix = function(str) {
    if ("." !== str.charAt(0)) return str;
    var ch = str.charAt(1);
    return utils.isSlash(ch) ? str.slice(2) : str;
  }, utils.isSlash = function(str) {
    return "/" === str || "\\/" === str || "\\" === str || "\\\\" === str;
  }, utils.matchPath = function(pattern, options) {
    return options && options.contains ? utils.containsPattern(pattern, options) : utils.equalsPattern(pattern, options);
  }, utils._equals = function(filepath, unixPath, pattern) {
    return pattern === filepath || pattern === unixPath;
  }, utils._contains = function(filepath, unixPath, pattern) {
    return -1 !== filepath.indexOf(pattern) || -1 !== unixPath.indexOf(pattern);
  }, utils.equalsPattern = function(pattern, options) {
    var unixify = utils.unixify(options);
    return options = options || {}, function(filepath) {
      var equal = utils._equals(filepath, unixify(filepath), pattern);
      if (!0 === equal || !0 !== options.nocase) return equal;
      var lower = filepath.toLowerCase();
      return utils._equals(lower, unixify(lower), pattern);
    };
  }, utils.containsPattern = function(pattern, options) {
    var unixify = utils.unixify(options);
    return options = options || {}, function(filepath) {
      var contains = utils._contains(filepath, unixify(filepath), pattern);
      if (!0 === contains || !0 !== options.nocase) return contains;
      var lower = filepath.toLowerCase();
      return utils._contains(lower, unixify(lower), pattern);
    };
  }, utils.matchBasename = function(re) {
    return function(filepath) {
      return re.test(path.basename(filepath));
    };
  }, utils.value = function(str, unixify, options) {
    return options && !1 === options.unixify ? str : unixify(str);
  }, utils.unixify = function(options) {
    return options = options || {}, function(filepath) {
      return (utils.isWindows() || !0 === options.unixify) && (filepath = utils.toPosixPath(filepath)), 
      !1 !== options.stripPrefix && (filepath = utils.stripPrefix(filepath)), !0 === options.unescape && (filepath = utils.unescape(filepath)), 
      filepath;
    };
  };
} ]);
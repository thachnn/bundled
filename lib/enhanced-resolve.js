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
  return __webpack_require__(11);
}([ function(module, exports, __webpack_require__) {
  const forEachBail = __webpack_require__(3);
  function cdUp(directory) {
    if ("/" === directory) return null;
    const i = directory.lastIndexOf("/"), j = directory.lastIndexOf("\\"), p = i < 0 ? j : j < 0 ? i : i < j ? j : i;
    return p < 0 ? null : directory.substr(0, p || 1);
  }
  exports.loadDescriptionFile = function(resolver, directory, filenames, resolveContext, callback) {
    !function findDescriptionFile() {
      forEachBail(filenames, (filename, callback) => {
        const descriptionFilePath = resolver.join(directory, filename);
        function onJson(err, content) {
          if (err) return resolveContext.log ? resolveContext.log(descriptionFilePath + " (directory description file): " + err) : err.message = descriptionFilePath + " (directory description file): " + err, 
          callback(err);
          callback(null, {
            content: content,
            directory: directory,
            path: descriptionFilePath
          });
        }
        resolver.fileSystem.readJson ? resolver.fileSystem.readJson(descriptionFilePath, (err, content) => {
          if (err) return void 0 !== err.code ? callback() : onJson(err);
          onJson(null, content);
        }) : resolver.fileSystem.readFile(descriptionFilePath, (err, content) => {
          if (err) return callback();
          let json;
          try {
            json = JSON.parse(content);
          } catch (e) {
            onJson(e);
          }
          onJson(null, json);
        });
      }, (err, result) => err ? callback(err) : result ? callback(null, result) : (directory = cdUp(directory)) ? findDescriptionFile() : callback());
    }();
  }, exports.getField = function(content, field) {
    if (content) if (Array.isArray(field)) {
      let current = content;
      for (let j = 0; j < field.length; j++) {
        if (null === current || "object" != typeof current) {
          current = null;
          break;
        }
        current = current[field[j]];
      }
      if ("object" == typeof current) return current;
    } else if ("object" == typeof content[field]) return content[field];
  }, exports.cdUp = cdUp;
}, function(module, exports, __webpack_require__) {
  class Hook {
    constructor(args) {
      Array.isArray(args) || (args = []), this._args = args, this.taps = [], this.interceptors = [], 
      this.call = this._call, this.promise = this._promise, this.callAsync = this._callAsync, 
      this._x = void 0;
    }
    compile(options) {
      throw new Error("Abstract: should be overriden");
    }
    _createCall(type) {
      return this.compile({
        taps: this.taps,
        interceptors: this.interceptors,
        args: this._args,
        type: type
      });
    }
    tap(options, fn) {
      if ("string" == typeof options && (options = {
        name: options
      }), "object" != typeof options || null === options) throw new Error("Invalid arguments to tap(options: Object, fn: function)");
      if ("string" != typeof (options = Object.assign({
        type: "sync",
        fn: fn
      }, options)).name || "" === options.name) throw new Error("Missing name for tap");
      options = this._runRegisterInterceptors(options), this._insert(options);
    }
    tapAsync(options, fn) {
      if ("string" == typeof options && (options = {
        name: options
      }), "object" != typeof options || null === options) throw new Error("Invalid arguments to tapAsync(options: Object, fn: function)");
      if ("string" != typeof (options = Object.assign({
        type: "async",
        fn: fn
      }, options)).name || "" === options.name) throw new Error("Missing name for tapAsync");
      options = this._runRegisterInterceptors(options), this._insert(options);
    }
    tapPromise(options, fn) {
      if ("string" == typeof options && (options = {
        name: options
      }), "object" != typeof options || null === options) throw new Error("Invalid arguments to tapPromise(options: Object, fn: function)");
      if ("string" != typeof (options = Object.assign({
        type: "promise",
        fn: fn
      }, options)).name || "" === options.name) throw new Error("Missing name for tapPromise");
      options = this._runRegisterInterceptors(options), this._insert(options);
    }
    _runRegisterInterceptors(options) {
      for (const interceptor of this.interceptors) if (interceptor.register) {
        const newOptions = interceptor.register(options);
        void 0 !== newOptions && (options = newOptions);
      }
      return options;
    }
    withOptions(options) {
      const mergeOptions = opt => Object.assign({}, options, "string" == typeof opt ? {
        name: opt
      } : opt);
      options = Object.assign({}, options, this._withOptions);
      const base = this._withOptionsBase || this, newHook = Object.create(base);
      return newHook.tapAsync = (opt, fn) => base.tapAsync(mergeOptions(opt), fn), newHook.tap = (opt, fn) => base.tap(mergeOptions(opt), fn), 
      newHook.tapPromise = (opt, fn) => base.tapPromise(mergeOptions(opt), fn), newHook._withOptions = options, 
      newHook._withOptionsBase = base, newHook;
    }
    isUsed() {
      return this.taps.length > 0 || this.interceptors.length > 0;
    }
    intercept(interceptor) {
      if (this._resetCompilation(), this.interceptors.push(Object.assign({}, interceptor)), 
      interceptor.register) for (let i = 0; i < this.taps.length; i++) this.taps[i] = interceptor.register(this.taps[i]);
    }
    _resetCompilation() {
      this.call = this._call, this.callAsync = this._callAsync, this.promise = this._promise;
    }
    _insert(item) {
      let before;
      this._resetCompilation(), "string" == typeof item.before ? before = new Set([ item.before ]) : Array.isArray(item.before) && (before = new Set(item.before));
      let stage = 0;
      "number" == typeof item.stage && (stage = item.stage);
      let i = this.taps.length;
      for (;i > 0; ) {
        i--;
        const x = this.taps[i];
        this.taps[i + 1] = x;
        const xStage = x.stage || 0;
        if (before) {
          if (before.has(x.name)) {
            before.delete(x.name);
            continue;
          }
          if (before.size > 0) continue;
        }
        if (!(xStage > stage)) {
          i++;
          break;
        }
      }
      this.taps[i] = item;
    }
  }
  function createCompileDelegate(name, type) {
    return function(...args) {
      return this[name] = this._createCall(type), this[name](...args);
    };
  }
  Object.defineProperties(Hook.prototype, {
    _call: {
      value: createCompileDelegate("call", "sync"),
      configurable: !0,
      writable: !0
    },
    _promise: {
      value: createCompileDelegate("promise", "promise"),
      configurable: !0,
      writable: !0
    },
    _callAsync: {
      value: createCompileDelegate("callAsync", "async"),
      configurable: !0,
      writable: !0
    }
  }), module.exports = Hook;
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(config) {
      this.config = config, this.options = void 0, this._args = void 0;
    }
    create(options) {
      let fn;
      switch (this.init(options), this.options.type) {
       case "sync":
        fn = new Function(this.args(), '"use strict";\n' + this.header() + this.content({
          onError: err => `throw ${err};\n`,
          onResult: result => `return ${result};\n`,
          resultReturns: !0,
          onDone: () => "",
          rethrowIfPossible: !0
        }));
        break;

       case "async":
        fn = new Function(this.args({
          after: "_callback"
        }), '"use strict";\n' + this.header() + this.content({
          onError: err => `_callback(${err});\n`,
          onResult: result => `_callback(null, ${result});\n`,
          onDone: () => "_callback();\n"
        }));
        break;

       case "promise":
        let errorHelperUsed = !1;
        const content = this.content({
          onError: err => (errorHelperUsed = !0, `_error(${err});\n`),
          onResult: result => `_resolve(${result});\n`,
          onDone: () => "_resolve();\n"
        });
        let code = "";
        code += '"use strict";\n', code += "return new Promise((_resolve, _reject) => {\n", 
        errorHelperUsed && (code += "var _sync = true;\n", code += "function _error(_err) {\n", 
        code += "if(_sync)\n", code += "_resolve(Promise.resolve().then(() => { throw _err; }));\n", 
        code += "else\n", code += "_reject(_err);\n", code += "};\n"), code += this.header(), 
        code += content, errorHelperUsed && (code += "_sync = false;\n"), code += "});\n", 
        fn = new Function(this.args(), code);
      }
      return this.deinit(), fn;
    }
    setup(instance, options) {
      instance._x = options.taps.map(t => t.fn);
    }
    init(options) {
      this.options = options, this._args = options.args.slice();
    }
    deinit() {
      this.options = void 0, this._args = void 0;
    }
    header() {
      let code = "";
      this.needContext() ? code += "var _context = {};\n" : code += "var _context;\n", 
      code += "var _x = this._x;\n", this.options.interceptors.length > 0 && (code += "var _taps = this.taps;\n", 
      code += "var _interceptors = this.interceptors;\n");
      for (let i = 0; i < this.options.interceptors.length; i++) {
        const interceptor = this.options.interceptors[i];
        interceptor.call && (code += `${this.getInterceptor(i)}.call(${this.args({
          before: interceptor.context ? "_context" : void 0
        })});\n`);
      }
      return code;
    }
    needContext() {
      for (const tap of this.options.taps) if (tap.context) return !0;
      return !1;
    }
    callTap(tapIndex, {onError: onError, onResult: onResult, onDone: onDone, rethrowIfPossible: rethrowIfPossible}) {
      let code = "", hasTapCached = !1;
      for (let i = 0; i < this.options.interceptors.length; i++) {
        const interceptor = this.options.interceptors[i];
        interceptor.tap && (hasTapCached || (code += `var _tap${tapIndex} = ${this.getTap(tapIndex)};\n`, 
        hasTapCached = !0), code += `${this.getInterceptor(i)}.tap(${interceptor.context ? "_context, " : ""}_tap${tapIndex});\n`);
      }
      code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
      const tap = this.options.taps[tapIndex];
      switch (tap.type) {
       case "sync":
        rethrowIfPossible || (code += `var _hasError${tapIndex} = false;\n`, code += "try {\n"), 
        code += onResult ? `var _result${tapIndex} = _fn${tapIndex}(${this.args({
          before: tap.context ? "_context" : void 0
        })});\n` : `_fn${tapIndex}(${this.args({
          before: tap.context ? "_context" : void 0
        })});\n`, rethrowIfPossible || (code += "} catch(_err) {\n", code += `_hasError${tapIndex} = true;\n`, 
        code += onError("_err"), code += "}\n", code += `if(!_hasError${tapIndex}) {\n`), 
        onResult && (code += onResult("_result" + tapIndex)), onDone && (code += onDone()), 
        rethrowIfPossible || (code += "}\n");
        break;

       case "async":
        let cbCode = "";
        cbCode += onResult ? `(_err${tapIndex}, _result${tapIndex}) => {\n` : `_err${tapIndex} => {\n`, 
        cbCode += `if(_err${tapIndex}) {\n`, cbCode += onError("_err" + tapIndex), cbCode += "} else {\n", 
        onResult && (cbCode += onResult("_result" + tapIndex)), onDone && (cbCode += onDone()), 
        cbCode += "}\n", cbCode += "}", code += `_fn${tapIndex}(${this.args({
          before: tap.context ? "_context" : void 0,
          after: cbCode
        })});\n`;
        break;

       case "promise":
        code += `var _hasResult${tapIndex} = false;\n`, code += `var _promise${tapIndex} = _fn${tapIndex}(${this.args({
          before: tap.context ? "_context" : void 0
        })});\n`, code += `if (!_promise${tapIndex} || !_promise${tapIndex}.then)\n`, code += `  throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise${tapIndex} + ')');\n`, 
        code += `_promise${tapIndex}.then(_result${tapIndex} => {\n`, code += `_hasResult${tapIndex} = true;\n`, 
        onResult && (code += onResult("_result" + tapIndex)), onDone && (code += onDone()), 
        code += `}, _err${tapIndex} => {\n`, code += `if(_hasResult${tapIndex}) throw _err${tapIndex};\n`, 
        code += onError("_err" + tapIndex), code += "});\n";
      }
      return code;
    }
    callTapsSeries({onError: onError, onResult: onResult, resultReturns: resultReturns, onDone: onDone, doneReturns: doneReturns, rethrowIfPossible: rethrowIfPossible}) {
      if (0 === this.options.taps.length) return onDone();
      const firstAsync = this.options.taps.findIndex(t => "sync" !== t.type), somethingReturns = resultReturns || doneReturns || !1;
      let code = "", current = onDone;
      for (let j = this.options.taps.length - 1; j >= 0; j--) {
        const i = j;
        current !== onDone && "sync" !== this.options.taps[i].type && (code += `function _next${i}() {\n`, 
        code += current(), code += "}\n", current = () => `${somethingReturns ? "return " : ""}_next${i}();\n`);
        const done = current, doneBreak = skipDone => skipDone ? "" : onDone(), content = this.callTap(i, {
          onError: error => onError(i, error, done, doneBreak),
          onResult: onResult && (result => onResult(i, result, done, doneBreak)),
          onDone: !onResult && done,
          rethrowIfPossible: rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
        });
        current = () => content;
      }
      return code += current(), code;
    }
    callTapsLooping({onError: onError, onDone: onDone, rethrowIfPossible: rethrowIfPossible}) {
      if (0 === this.options.taps.length) return onDone();
      const syncOnly = this.options.taps.every(t => "sync" === t.type);
      let code = "";
      syncOnly || (code += "var _looper = () => {\n", code += "var _loopAsync = false;\n"), 
      code += "var _loop;\n", code += "do {\n", code += "_loop = false;\n";
      for (let i = 0; i < this.options.interceptors.length; i++) {
        const interceptor = this.options.interceptors[i];
        interceptor.loop && (code += `${this.getInterceptor(i)}.loop(${this.args({
          before: interceptor.context ? "_context" : void 0
        })});\n`);
      }
      return code += this.callTapsSeries({
        onError: onError,
        onResult: (i, result, next, doneBreak) => {
          let code = "";
          return code += `if(${result} !== undefined) {\n`, code += "_loop = true;\n", syncOnly || (code += "if(_loopAsync) _looper();\n"), 
          code += doneBreak(!0), code += "} else {\n", code += next(), code += "}\n", code;
        },
        onDone: onDone && (() => {
          let code = "";
          return code += "if(!_loop) {\n", code += onDone(), code += "}\n", code;
        }),
        rethrowIfPossible: rethrowIfPossible && syncOnly
      }), code += "} while(_loop);\n", syncOnly || (code += "_loopAsync = true;\n", code += "};\n", 
      code += "_looper();\n"), code;
    }
    callTapsParallel({onError: onError, onResult: onResult, onDone: onDone, rethrowIfPossible: rethrowIfPossible, onTap: onTap = ((i, run) => run())}) {
      if (this.options.taps.length <= 1) return this.callTapsSeries({
        onError: onError,
        onResult: onResult,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
      let code = "";
      code += "do {\n", code += `var _counter = ${this.options.taps.length};\n`, onDone && (code += "var _done = () => {\n", 
      code += onDone(), code += "};\n");
      for (let i = 0; i < this.options.taps.length; i++) {
        const done = () => onDone ? "if(--_counter === 0) _done();\n" : "--_counter;", doneBreak = skipDone => skipDone || !onDone ? "_counter = 0;\n" : "_counter = 0;\n_done();\n";
        code += "if(_counter <= 0) break;\n", code += onTap(i, () => this.callTap(i, {
          onError: error => {
            let code = "";
            return code += "if(_counter > 0) {\n", code += onError(i, error, done, doneBreak), 
            code += "}\n", code;
          },
          onResult: onResult && (result => {
            let code = "";
            return code += "if(_counter > 0) {\n", code += onResult(i, result, done, doneBreak), 
            code += "}\n", code;
          }),
          onDone: !onResult && (() => done()),
          rethrowIfPossible: rethrowIfPossible
        }), done, doneBreak);
      }
      return code += "} while(false);\n", code;
    }
    args({before: before, after: after} = {}) {
      let allArgs = this._args;
      return before && (allArgs = [ before ].concat(allArgs)), after && (allArgs = allArgs.concat(after)), 
      0 === allArgs.length ? "" : allArgs.join(", ");
    }
    getTapFn(idx) {
      return `_x[${idx}]`;
    }
    getTap(idx) {
      return `_taps[${idx}]`;
    }
    getInterceptor(idx) {
      return `_interceptors[${idx}]`;
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(array, iterator, callback) {
    if (0 === array.length) return callback();
    let currentResult, currentPos = array.length, done = [];
    for (let i = 0; i < array.length; i++) {
      const itCb = createIteratorCallback(i);
      if (iterator(array[i], itCb), 0 === currentPos) break;
    }
    function createIteratorCallback(i) {
      return (...args) => {
        i >= currentPos || (done.push(i), args.length > 0 && (currentPos = i + 1, done = done.filter(item => item <= i), 
        currentResult = args), done.length === currentPos && (callback.apply(null, currentResult), 
        currentPos = 0));
      };
    }
  }, module.exports.withIndex = function(array, iterator, callback) {
    if (0 === array.length) return callback();
    let currentResult, currentPos = array.length, done = [];
    for (let i = 0; i < array.length; i++) {
      const itCb = createIteratorCallback(i);
      if (iterator(array[i], i, itCb), 0 === currentPos) break;
    }
    function createIteratorCallback(i) {
      return (...args) => {
        i >= currentPos || (done.push(i), args.length > 0 && (currentPos = i + 1, done = done.filter(item => item <= i), 
        currentResult = args), done.length === currentPos && (callback.apply(null, currentResult), 
        currentPos = 0));
      };
    }
  };
}, function(module, exports, __webpack_require__) {
  const globToRegExp = __webpack_require__(33).globToRegExp;
  function parseType(type) {
    const items = type.split("+"), t = items.shift();
    return {
      type: "*" === t ? null : t,
      features: items
    };
  }
  function isTypeMatched(baseType, testedType) {
    return "string" == typeof baseType && (baseType = parseType(baseType)), "string" == typeof testedType && (testedType = parseType(testedType)), 
    (!testedType.type || testedType.type === baseType.type) && testedType.features.every(requiredFeature => baseType.features.indexOf(requiredFeature) >= 0);
  }
  function isResourceTypeSupported(context, type) {
    return context.supportedResourceTypes && context.supportedResourceTypes.some(supportedType => function(baseType, testedType) {
      if (baseType = baseType.split("/"), testedType = testedType.split("/"), baseType.length !== testedType.length) return !1;
      for (let i = 0; i < baseType.length; i++) if (!isTypeMatched(baseType[i], testedType[i])) return !1;
      return !0;
    }(supportedType, type));
  }
  function isEnvironment(context, env) {
    return context.environments && context.environments.every(environment => isTypeMatched(environment, env));
  }
  const globCache = {};
  function getGlobRegExp(glob) {
    return globCache[glob] || (globCache[glob] = globToRegExp(glob));
  }
  function matchGlob(glob, relativePath) {
    return getGlobRegExp(glob).exec(relativePath);
  }
  function isGlobMatched(glob, relativePath) {
    return !!matchGlob(glob, relativePath);
  }
  function isConditionMatched(context, condition) {
    return condition.split("|").some((function testFn(item) {
      item = item.trim();
      if (/^!/.test(item)) return !testFn(item.substr(1));
      if (!/^[a-z]+:/.test(item)) return item.indexOf("/") >= 0 ? isResourceTypeSupported(context, item) : isEnvironment(context, item);
      {
        const match = /^([a-z]+):\s*/.exec(item), value = item.substr(match[0].length);
        switch (match[1]) {
         case "referrer":
          return isGlobMatched(value, context.referrer);

         default:
          return !1;
        }
      }
    }));
  }
  function isKeyMatched(context, key) {
    for (;;) {
      const match = /^\[([^\]]+)\]\s*/.exec(key);
      if (!match) return key;
      key = key.substr(match[0].length);
      if (!isConditionMatched(context, match[1])) return !1;
    }
  }
  function getField(context, configuration, field) {
    let value;
    return Object.keys(configuration).forEach(key => {
      isKeyMatched(context, key) === field && (value = configuration[key]);
    }), value;
  }
  exports.parseType = parseType, exports.isTypeMatched = isTypeMatched, exports.isResourceTypeSupported = isResourceTypeSupported, 
  exports.isEnvironment = isEnvironment, exports.isGlobMatched = isGlobMatched, exports.isConditionMatched = isConditionMatched, 
  exports.isKeyMatched = isKeyMatched, exports.getField = getField, exports.getMain = function(context, configuration) {
    return getField(context, configuration, "main");
  }, exports.getExtensions = function(context, configuration) {
    return getField(context, configuration, "extensions");
  }, exports.matchModule = function(context, configuration, request) {
    const modulesField = getField(context, configuration, "modules");
    if (!modulesField) return request;
    let newRequest = request;
    const keys = Object.keys(modulesField);
    let match, index, iteration = 0;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i], pureKey = isKeyMatched(context, key);
      if (match = matchGlob(pureKey, newRequest), match) {
        const value = modulesField[key];
        if ("string" != typeof value) return value;
        if (/^\(.+\)$/.test(pureKey) ? newRequest = newRequest.replace(getGlobRegExp(pureKey), value) : (index = 1, 
        newRequest = value.replace(/(\/?\*)?\*/g, replaceMatcher)), i = -1, iteration++ > keys.length) throw new Error("Request '" + request + "' matches recursively");
      }
    }
    return newRequest;
    function replaceMatcher(find) {
      switch (find) {
       case "/**":
        {
          const m = match[index++];
          return m ? "/" + m : "";
        }

       case "**":
       case "*":
        return match[index++];
      }
    }
  }, exports.matchType = function(context, configuration, relativePath) {
    const typesField = getField(context, configuration, "types");
    if (!typesField) return;
    let type;
    return Object.keys(typesField).forEach(key => {
      if (isGlobMatched(isKeyMatched(context, key), relativePath)) {
        const value = typesField[key];
        if (!type && /\/\*$/.test(value)) throw new Error("value ('" + value + "') of key '" + key + "' contains '*', but there is no previous value defined");
        type = value.replace(/\/\*$/, "/" + type);
      }
    }), type;
  };
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports, __webpack_require__) {
  module.exports = function(path) {
    var parts = path.split(/(\\+|\/+)/);
    if (1 === parts.length) return path;
    for (var result = [], absolutePathStart = 0, i = 0, sep = !1; i < parts.length; i += 1, 
    sep = !sep) {
      var part = parts[i];
      if (0 === i && /^([A-Z]:)?$/i.test(part)) result.push(part), absolutePathStart = 2; else if (sep) 1 === i && 0 === parts[0].length && "\\\\" === part ? result.push(part) : result.push(part[0]); else if (".." === part) switch (result.length) {
       case 0:
        result.push(part);
        break;

       case 2:
        "." !== result[0] ? (i += 1, sep = !sep, result.length = absolutePathStart) : (result.length = 0, 
        result.push(part));
        break;

       case 4:
        0 === absolutePathStart ? result.length -= 3 : (i += 1, sep = !sep, result.length = 2);
        break;

       default:
        result.length -= 3;
      } else if ("." === part) switch (result.length) {
       case 0:
        result.push(part);
        break;

       case 2:
        0 === absolutePathStart ? result.length -= 1 : (i += 1, sep = !sep);
        break;

       default:
        result.length -= 1;
      } else part && result.push(part);
    }
    return 1 === result.length && /^[A-Za-z]:$/.test(result[0]) ? result[0] + "\\" : result.join("");
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(path) {
    const parts = path.split(/(.*?[\\/]+)/), paths = [ path ], seqments = [ parts[parts.length - 1] ];
    let part = parts[parts.length - 1];
    path = path.substr(0, path.length - part.length - 1);
    for (let i = parts.length - 2; i > 2; i -= 2) paths.push(path), part = parts[i], 
    path = path.substr(0, path.length - part.length) || "/", seqments.push(part.substr(0, part.length - 1));
    return part = parts[1], seqments.push(part), paths.push(part), {
      paths: paths,
      seqments: seqments
    };
  }, module.exports.basename = function(path) {
    const i = path.lastIndexOf("/"), j = path.lastIndexOf("\\"), p = i < 0 ? j : j < 0 ? i : i < j ? j : i;
    if (p < 0) return null;
    return path.substr(p + 1);
  };
}, function(module, exports, __webpack_require__) {
  function startsWith(string, searchString) {
    const stringLength = string.length, searchLength = searchString.length;
    if (searchLength > stringLength) return !1;
    let index = -1;
    for (;++index < searchLength; ) if (string.charCodeAt(index) !== searchString.charCodeAt(index)) return !1;
    return !0;
  }
  module.exports = class {
    constructor(source, options, target) {
      this.source = source, this.options = Array.isArray(options) ? options : [ options ], 
      this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("AliasPlugin", (request, resolveContext, callback) => {
        const innerRequest = request.request || request.path;
        if (!innerRequest) return callback();
        for (const item of this.options) if ((innerRequest === item.name || !item.onlyModule && startsWith(innerRequest, item.name + "/")) && innerRequest !== item.alias && !startsWith(innerRequest, item.alias + "/")) {
          const newRequestStr = item.alias + innerRequest.substr(item.name.length), obj = Object.assign({}, request, {
            request: newRequestStr
          });
          return resolver.doResolve(target, obj, "aliased with mapping '" + item.name + "': '" + item.alias + "' to '" + newRequestStr + "'", resolveContext, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
        }
        return callback();
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(resolver, request) {
    if ("string" == typeof request.__innerRequest && request.__innerRequest_request === request.request && request.__innerRequest_relativePath === request.relativePath) return request.__innerRequest;
    let innerRequest;
    return request.request ? (innerRequest = request.request, /^\.\.?\//.test(innerRequest) && request.relativePath && (innerRequest = resolver.join(request.relativePath, innerRequest))) : innerRequest = request.relativePath, 
    request.__innerRequest_request = request.request, request.__innerRequest_relativePath = request.relativePath, 
    request.__innerRequest = innerRequest;
  };
}, function(module, exports) {
  module.exports = require("path");
}, function(module, exports, __webpack_require__) {
  const ResolverFactory = __webpack_require__(12), NodeJsInputFileSystem = __webpack_require__(47), CachedInputFileSystem = __webpack_require__(49), nodeFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem, 4e3), nodeContext = {
    environments: [ "node+es3+es5+process+native" ]
  }, asyncResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    fileSystem: nodeFileSystem
  });
  module.exports = function(context, path, request, resolveContext, callback) {
    "string" == typeof context && (callback = resolveContext, resolveContext = request, 
    request = path, path = context, context = nodeContext), "function" != typeof callback && (callback = resolveContext), 
    asyncResolver.resolve(context, path, request, resolveContext, callback);
  };
  const syncResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    useSyncFileSystemCalls: !0,
    fileSystem: nodeFileSystem
  });
  module.exports.sync = function(context, path, request) {
    return "string" == typeof context && (request = path, path = context, context = nodeContext), 
    syncResolver.resolveSync(context, path, request);
  };
  const asyncContextResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    resolveToContext: !0,
    fileSystem: nodeFileSystem
  });
  module.exports.context = function(context, path, request, resolveContext, callback) {
    "string" == typeof context && (callback = resolveContext, resolveContext = request, 
    request = path, path = context, context = nodeContext), "function" != typeof callback && (callback = resolveContext), 
    asyncContextResolver.resolve(context, path, request, resolveContext, callback);
  };
  const syncContextResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    resolveToContext: !0,
    useSyncFileSystemCalls: !0,
    fileSystem: nodeFileSystem
  });
  module.exports.context.sync = function(context, path, request) {
    return "string" == typeof context && (request = path, path = context, context = nodeContext), 
    syncContextResolver.resolveSync(context, path, request);
  };
  const asyncLoaderResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    moduleExtensions: [ "-loader" ],
    mainFields: [ "loader", "main" ],
    fileSystem: nodeFileSystem
  });
  module.exports.loader = function(context, path, request, resolveContext, callback) {
    "string" == typeof context && (callback = resolveContext, resolveContext = request, 
    request = path, path = context, context = nodeContext), "function" != typeof callback && (callback = resolveContext), 
    asyncLoaderResolver.resolve(context, path, request, resolveContext, callback);
  };
  const syncLoaderResolver = ResolverFactory.createResolver({
    extensions: [ ".js", ".json", ".node" ],
    moduleExtensions: [ "-loader" ],
    mainFields: [ "loader", "main" ],
    useSyncFileSystemCalls: !0,
    fileSystem: nodeFileSystem
  });
  module.exports.loader.sync = function(context, path, request) {
    return "string" == typeof context && (request = path, path = context, context = nodeContext), 
    syncLoaderResolver.resolveSync(context, path, request);
  }, module.exports.create = function(options) {
    options = Object.assign({
      fileSystem: nodeFileSystem
    }, options);
    const resolver = ResolverFactory.createResolver(options);
    return function(context, path, request, resolveContext, callback) {
      "string" == typeof context && (callback = resolveContext, resolveContext = request, 
      request = path, path = context, context = nodeContext), "function" != typeof callback && (callback = resolveContext), 
      resolver.resolve(context, path, request, resolveContext, callback);
    };
  }, module.exports.create.sync = function(options) {
    options = Object.assign({
      useSyncFileSystemCalls: !0,
      fileSystem: nodeFileSystem
    }, options);
    const resolver = ResolverFactory.createResolver(options);
    return function(context, path, request) {
      return "string" == typeof context && (request = path, path = context, context = nodeContext), 
      resolver.resolveSync(context, path, request);
    };
  }, module.exports.ResolverFactory = ResolverFactory, module.exports.AliasPlugin = __webpack_require__(8), 
  module.exports.NodeJsInputFileSystem = NodeJsInputFileSystem, module.exports.CachedInputFileSystem = CachedInputFileSystem;
}, function(module, exports, __webpack_require__) {
  const Resolver = __webpack_require__(13), SyncAsyncFileSystemDecorator = __webpack_require__(21), ParsePlugin = __webpack_require__(22), DescriptionFilePlugin = __webpack_require__(23), NextPlugin = __webpack_require__(24), TryNextPlugin = __webpack_require__(25), ModuleKindPlugin = __webpack_require__(26), FileKindPlugin = __webpack_require__(27), JoinRequestPlugin = __webpack_require__(28), ModulesInHierachicDirectoriesPlugin = __webpack_require__(29), ModulesInRootPlugin = __webpack_require__(30), AliasPlugin = __webpack_require__(8), AliasFieldPlugin = __webpack_require__(31), ConcordExtensionsPlugin = __webpack_require__(32), ConcordMainPlugin = __webpack_require__(34), ConcordModulesPlugin = __webpack_require__(35), DirectoryExistsPlugin = __webpack_require__(36), FileExistsPlugin = __webpack_require__(37), SymlinkPlugin = __webpack_require__(38), MainFieldPlugin = __webpack_require__(39), UseFilePlugin = __webpack_require__(40), AppendPlugin = __webpack_require__(41), RootPlugin = __webpack_require__(42), RestrictionsPlugin = __webpack_require__(43), ResultPlugin = __webpack_require__(44), ModuleAppendPlugin = __webpack_require__(45), UnsafeCachePlugin = __webpack_require__(46);
  exports.createResolver = function(options) {
    let modules = options.modules || [ "node_modules" ];
    const descriptionFiles = options.descriptionFiles || [ "package.json" ], plugins = options.plugins && options.plugins.slice() || [];
    let mainFields = options.mainFields || [ "main" ];
    const aliasFields = options.aliasFields || [], mainFiles = options.mainFiles || [ "index" ];
    let extensions = options.extensions || [ ".js", ".json", ".node" ];
    const enforceExtension = options.enforceExtension || !1;
    let moduleExtensions = options.moduleExtensions || [];
    const enforceModuleExtension = options.enforceModuleExtension || !1;
    let alias = options.alias || [];
    const symlinks = void 0 === options.symlinks || options.symlinks, resolveToContext = options.resolveToContext || !1, roots = options.roots || [], ignoreRootsErrors = options.ignoreRootsErrors || !1, preferAbsolute = options.preferAbsolute || !1, restrictions = options.restrictions || [];
    let unsafeCache = options.unsafeCache || !1;
    const cacheWithContext = void 0 === options.cacheWithContext || options.cacheWithContext, enableConcord = options.concord || !1, cachePredicate = options.cachePredicate || function() {
      return !0;
    }, fileSystem = options.fileSystem, useSyncFileSystemCalls = options.useSyncFileSystemCalls;
    let resolver = options.resolver;
    var array, filter;
    return resolver || (resolver = new Resolver(useSyncFileSystemCalls ? new SyncAsyncFileSystemDecorator(fileSystem) : fileSystem)), 
    extensions = [].concat(extensions), moduleExtensions = [].concat(moduleExtensions), 
    array = [].concat(modules), filter = item => !/^[A-Z]:|^\//.test(item), modules = array.reduce((array, item) => {
      if (filter(item)) {
        const lastElement = array[array.length - 1];
        return Array.isArray(lastElement) ? lastElement.push(item) : array.push([ item ]), 
        array;
      }
      return array.push(item), array;
    }, []), mainFields = mainFields.map(item => (("string" == typeof item || Array.isArray(item)) && (item = {
      name: item,
      forceRelative: !0
    }), item)), "object" != typeof alias || Array.isArray(alias) || (alias = Object.keys(alias).map(key => {
      let onlyModule = !1, obj = alias[key];
      return /\$$/.test(key) && (onlyModule = !0, key = key.substr(0, key.length - 1)), 
      "string" == typeof obj && (obj = {
        alias: obj
      }), obj = Object.assign({
        name: key,
        onlyModule: onlyModule
      }, obj), obj;
    })), unsafeCache && "object" != typeof unsafeCache && (unsafeCache = {}), resolver.ensureHook("resolve"), 
    resolver.ensureHook("parsedResolve"), resolver.ensureHook("describedResolve"), resolver.ensureHook("rawModule"), 
    resolver.ensureHook("module"), resolver.ensureHook("relative"), resolver.ensureHook("describedRelative"), 
    resolver.ensureHook("directory"), resolver.ensureHook("existingDirectory"), resolver.ensureHook("undescribedRawFile"), 
    resolver.ensureHook("rawFile"), resolver.ensureHook("file"), resolver.ensureHook("existingFile"), 
    resolver.ensureHook("resolved"), unsafeCache ? (plugins.push(new UnsafeCachePlugin("resolve", cachePredicate, unsafeCache, cacheWithContext, "new-resolve")), 
    plugins.push(new ParsePlugin("new-resolve", "parsed-resolve"))) : plugins.push(new ParsePlugin("resolve", "parsed-resolve")), 
    plugins.push(new DescriptionFilePlugin("parsed-resolve", descriptionFiles, "described-resolve")), 
    plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve")), alias.length > 0 && plugins.push(new AliasPlugin("described-resolve", alias, "resolve")), 
    enableConcord && plugins.push(new ConcordModulesPlugin("described-resolve", {}, "resolve")), 
    aliasFields.forEach(item => {
      plugins.push(new AliasFieldPlugin("described-resolve", item, "resolve"));
    }), plugins.push(new ModuleKindPlugin("after-described-resolve", "raw-module")), 
    preferAbsolute && plugins.push(new JoinRequestPlugin("after-described-resolve", "relative")), 
    roots.forEach(root => {
      plugins.push(new RootPlugin("after-described-resolve", root, "relative", ignoreRootsErrors));
    }), preferAbsolute || plugins.push(new JoinRequestPlugin("after-described-resolve", "relative")), 
    moduleExtensions.forEach(item => {
      plugins.push(new ModuleAppendPlugin("raw-module", item, "module"));
    }), enforceModuleExtension || plugins.push(new TryNextPlugin("raw-module", null, "module")), 
    modules.forEach(item => {
      Array.isArray(item) ? plugins.push(new ModulesInHierachicDirectoriesPlugin("module", item, "resolve")) : plugins.push(new ModulesInRootPlugin("module", item, "resolve"));
    }), plugins.push(new DescriptionFilePlugin("relative", descriptionFiles, "described-relative")), 
    plugins.push(new NextPlugin("after-relative", "described-relative")), plugins.push(new FileKindPlugin("described-relative", "raw-file")), 
    plugins.push(new TryNextPlugin("described-relative", "as directory", "directory")), 
    plugins.push(new DirectoryExistsPlugin("directory", "existing-directory")), resolveToContext ? plugins.push(new NextPlugin("existing-directory", "resolved")) : (enableConcord && plugins.push(new ConcordMainPlugin("existing-directory", {}, "resolve")), 
    mainFields.forEach(item => {
      plugins.push(new MainFieldPlugin("existing-directory", item, "resolve"));
    }), mainFiles.forEach(item => {
      plugins.push(new UseFilePlugin("existing-directory", item, "undescribed-raw-file"));
    }), plugins.push(new DescriptionFilePlugin("undescribed-raw-file", descriptionFiles, "raw-file")), 
    plugins.push(new NextPlugin("after-undescribed-raw-file", "raw-file")), enforceExtension || plugins.push(new TryNextPlugin("raw-file", "no extension", "file")), 
    enableConcord && plugins.push(new ConcordExtensionsPlugin("raw-file", {}, "file")), 
    extensions.forEach(item => {
      plugins.push(new AppendPlugin("raw-file", item, "file"));
    }), alias.length > 0 && plugins.push(new AliasPlugin("file", alias, "resolve")), 
    enableConcord && plugins.push(new ConcordModulesPlugin("file", {}, "resolve")), 
    aliasFields.forEach(item => {
      plugins.push(new AliasFieldPlugin("file", item, "resolve"));
    }), symlinks && plugins.push(new SymlinkPlugin("file", "relative")), plugins.push(new FileExistsPlugin("file", "existing-file")), 
    plugins.push(new NextPlugin("existing-file", "resolved"))), restrictions.length > 0 && plugins.push(new RestrictionsPlugin(resolver.hooks.resolved, restrictions)), 
    plugins.push(new ResultPlugin(resolver.hooks.resolved)), plugins.forEach(plugin => {
      plugin.apply(resolver);
    }), resolver;
  };
}, function(module, exports, __webpack_require__) {
  const util = __webpack_require__(5), Tapable = __webpack_require__(14), SyncHook = __webpack_require__(16), AsyncSeriesBailHook = __webpack_require__(17), AsyncSeriesHook = __webpack_require__(18), createInnerContext = __webpack_require__(19), REGEXP_NOT_MODULE = /^\.$|^\.[\\/]|^\.\.$|^\.\.[\\/]|^\/|^[A-Z]:[\\/]/i, REGEXP_DIRECTORY = /[\\/]$/i, memoryFsJoin = __webpack_require__(20), memoizedJoin = new Map, memoryFsNormalize = __webpack_require__(6);
  function withName(name, hook) {
    return hook.name = name, hook;
  }
  function toCamelCase(str) {
    return str.replace(/-([a-z])/g, str => str.substr(1).toUpperCase());
  }
  const deprecatedPushToMissing = util.deprecate((set, item) => {
    set.add(item);
  }, "Resolver: 'missing' is now a Set. Use add instead of push."), deprecatedResolveContextInCallback = util.deprecate(x => x, "Resolver: The callback argument was splitted into resolveContext and callback."), deprecatedHookAsString = util.deprecate(x => x, "Resolver#doResolve: The type arguments (string) is now a hook argument (Hook). Pass a reference to the hook instead.");
  module.exports = class extends Tapable {
    constructor(fileSystem) {
      super(), this.fileSystem = fileSystem, this.hooks = {
        resolveStep: withName("resolveStep", new SyncHook([ "hook", "request" ])),
        noResolve: withName("noResolve", new SyncHook([ "request", "error" ])),
        resolve: withName("resolve", new AsyncSeriesBailHook([ "request", "resolveContext" ])),
        result: new AsyncSeriesHook([ "result", "resolveContext" ])
      }, this._pluginCompat.tap("Resolver: before/after", options => {
        /^before-/.test(options.name) ? (options.name = options.name.substr(7), options.stage = -10) : /^after-/.test(options.name) && (options.name = options.name.substr(6), 
        options.stage = 10);
      }), this._pluginCompat.tap("Resolver: step hooks", options => {
        const name = options.name;
        if (!/^resolve(-s|S)tep$|^no(-r|R)esolve$/.test(name)) {
          options.async = !0, this.ensureHook(name);
          const fn = options.fn;
          options.fn = (request, resolverContext, callback) => {
            const innerCallback = (err, result) => err ? callback(err) : void 0 !== result ? callback(null, result) : void callback();
            for (const key in resolverContext) innerCallback[key] = resolverContext[key];
            fn.call(this, request, innerCallback);
          };
        }
      });
    }
    ensureHook(name) {
      if ("string" != typeof name) return name;
      if (name = toCamelCase(name), /^before/.test(name)) return this.ensureHook(name[6].toLowerCase() + name.substr(7)).withOptions({
        stage: -10
      });
      if (/^after/.test(name)) return this.ensureHook(name[5].toLowerCase() + name.substr(6)).withOptions({
        stage: 10
      });
      const hook = this.hooks[name];
      return hook || (this.hooks[name] = withName(name, new AsyncSeriesBailHook([ "request", "resolveContext" ])));
    }
    getHook(name) {
      if ("string" != typeof name) return name;
      if (name = toCamelCase(name), /^before/.test(name)) return this.getHook(name[6].toLowerCase() + name.substr(7)).withOptions({
        stage: -10
      });
      if (/^after/.test(name)) return this.getHook(name[5].toLowerCase() + name.substr(6)).withOptions({
        stage: 10
      });
      const hook = this.hooks[name];
      if (!hook) throw new Error(`Hook ${name} doesn't exist`);
      return hook;
    }
    resolveSync(context, path, request) {
      let err, result, sync = !1;
      if (this.resolve(context, path, request, {}, (e, r) => {
        err = e, result = r, sync = !0;
      }), !sync) throw new Error("Cannot 'resolveSync' because the fileSystem is not sync. Use 'resolve'!");
      if (err) throw err;
      return result;
    }
    resolve(context, path, request, resolveContext, callback) {
      "function" != typeof callback && (callback = deprecatedResolveContextInCallback(resolveContext));
      const obj = {
        context: context,
        path: path,
        request: request
      }, message = "resolve '" + request + "' in '" + path + "'";
      return this.doResolve(this.hooks.resolve, obj, message, {
        missing: resolveContext.missing,
        stack: resolveContext.stack
      }, (err, result) => {
        if (!err && result) return callback(null, !1 !== result.path && result.path + (result.query || ""), result);
        const localMissing = new Set;
        localMissing.push = item => deprecatedPushToMissing(localMissing, item);
        const log = [];
        return this.doResolve(this.hooks.resolve, obj, message, {
          log: msg => {
            resolveContext.log && resolveContext.log(msg), log.push(msg);
          },
          missing: localMissing,
          stack: resolveContext.stack
        }, (err, result) => {
          if (err) return callback(err);
          const error = new Error("Can't " + message);
          return error.details = log.join("\n"), error.missing = Array.from(localMissing), 
          this.hooks.noResolve.call(obj, error), callback(error);
        });
      });
    }
    doResolve(hook, request, message, resolveContext, callback) {
      if ("function" != typeof callback && (callback = deprecatedResolveContextInCallback(resolveContext)), 
      "string" == typeof hook) {
        const name = toCamelCase(hook);
        if (!(hook = deprecatedHookAsString(this.hooks[name]))) throw new Error(`Hook "${name}" doesn't exist`);
      }
      if ("function" != typeof callback) throw new Error("callback is not a function " + Array.from(arguments));
      if (!resolveContext) throw new Error("resolveContext is not an object " + Array.from(arguments));
      const stackLine = hook.name + ": (" + request.path + ") " + (request.request || "") + (request.query || "") + (request.directory ? " directory" : "") + (request.module ? " module" : "");
      let newStack;
      if (resolveContext.stack) {
        if (newStack = new Set(resolveContext.stack), resolveContext.stack.has(stackLine)) {
          const recursionError = new Error("Recursion in resolving\nStack:\n  " + Array.from(newStack).join("\n  "));
          return recursionError.recursion = !0, resolveContext.log && resolveContext.log("abort resolving because of recursion"), 
          callback(recursionError);
        }
        newStack.add(stackLine);
      } else newStack = new Set([ stackLine ]);
      if (this.hooks.resolveStep.call(hook, request), hook.isUsed()) {
        const innerContext = createInnerContext({
          log: resolveContext.log,
          missing: resolveContext.missing,
          stack: newStack
        }, message);
        return hook.callAsync(request, innerContext, (err, result) => err ? callback(err) : result ? callback(null, result) : void callback());
      }
      callback();
    }
    parse(identifier) {
      if ("" === identifier) return null;
      const part = {
        request: "",
        query: "",
        module: !1,
        directory: !1,
        file: !1
      }, idxQuery = identifier.indexOf("?");
      return 0 === idxQuery ? part.query = identifier : idxQuery > 0 ? (part.request = identifier.slice(0, idxQuery), 
      part.query = identifier.slice(idxQuery)) : part.request = identifier, part.request && (part.module = this.isModule(part.request), 
      part.directory = this.isDirectory(part.request), part.directory && (part.request = part.request.substr(0, part.request.length - 1))), 
      part;
    }
    isModule(path) {
      return !REGEXP_NOT_MODULE.test(path);
    }
    isDirectory(path) {
      return REGEXP_DIRECTORY.test(path);
    }
    join(path, request) {
      let cacheEntry, pathCache = memoizedJoin.get(path);
      if (void 0 === pathCache) memoizedJoin.set(path, pathCache = new Map); else if (cacheEntry = pathCache.get(request), 
      void 0 !== cacheEntry) return cacheEntry;
      return cacheEntry = memoryFsJoin(path, request), pathCache.set(request, cacheEntry), 
      cacheEntry;
    }
    normalize(path) {
      return memoryFsNormalize(path);
    }
  };
}, function(module, exports, __webpack_require__) {
  const util = __webpack_require__(5), SyncBailHook = __webpack_require__(15);
  function Tapable() {
    this._pluginCompat = new SyncBailHook([ "options" ]), this._pluginCompat.tap({
      name: "Tapable camelCase",
      stage: 100
    }, options => {
      options.names.add(options.name.replace(/[- ]([a-z])/g, (str, ch) => ch.toUpperCase()));
    }), this._pluginCompat.tap({
      name: "Tapable this.hooks",
      stage: 200
    }, options => {
      let hook;
      for (const name of options.names) if (hook = this.hooks[name], void 0 !== hook) break;
      if (void 0 !== hook) {
        const tapOpt = {
          name: options.fn.name || "unnamed compat plugin",
          stage: options.stage || 0
        };
        return options.async ? hook.tapAsync(tapOpt, options.fn) : hook.tap(tapOpt, options.fn), 
        !0;
      }
    });
  }
  module.exports = Tapable, Tapable.addCompatLayer = function(instance) {
    Tapable.call(instance), instance.plugin = Tapable.prototype.plugin, instance.apply = Tapable.prototype.apply;
  }, Tapable.prototype.plugin = util.deprecate((function(name, fn) {
    if (Array.isArray(name)) return void name.forEach((function(name) {
      this.plugin(name, fn);
    }), this);
    if (!this._pluginCompat.call({
      name: name,
      fn: fn,
      names: new Set([ name ])
    })) throw new Error(`Plugin could not be registered at '${name}'. Hook was not found.\nBREAKING CHANGE: There need to exist a hook at 'this.hooks'. To create a compatibility layer for this hook, hook into 'this._pluginCompat'.`);
  }), "Tapable.plugin is deprecated. Use new API on `.hooks` instead"), Tapable.prototype.apply = util.deprecate((function() {
    for (var i = 0; i < arguments.length; i++) arguments[i].apply(this);
  }), "Tapable.apply is deprecated. Call apply on the plugin directly instead");
}, function(module, exports, __webpack_require__) {
  const Hook = __webpack_require__(1), HookCodeFactory = __webpack_require__(2);
  const factory = new class extends HookCodeFactory {
    content({onError: onError, onResult: onResult, resultReturns: resultReturns, onDone: onDone, rethrowIfPossible: rethrowIfPossible}) {
      return this.callTapsSeries({
        onError: (i, err) => onError(err),
        onResult: (i, result, next) => `if(${result} !== undefined) {\n${onResult(result)};\n} else {\n${next()}}\n`,
        resultReturns: resultReturns,
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  };
  module.exports = class extends Hook {
    tapAsync() {
      throw new Error("tapAsync is not supported on a SyncBailHook");
    }
    tapPromise() {
      throw new Error("tapPromise is not supported on a SyncBailHook");
    }
    compile(options) {
      return factory.setup(this, options), factory.create(options);
    }
  };
}, function(module, exports, __webpack_require__) {
  const Hook = __webpack_require__(1), HookCodeFactory = __webpack_require__(2);
  const factory = new class extends HookCodeFactory {
    content({onError: onError, onDone: onDone, rethrowIfPossible: rethrowIfPossible}) {
      return this.callTapsSeries({
        onError: (i, err) => onError(err),
        onDone: onDone,
        rethrowIfPossible: rethrowIfPossible
      });
    }
  };
  module.exports = class extends Hook {
    tapAsync() {
      throw new Error("tapAsync is not supported on a SyncHook");
    }
    tapPromise() {
      throw new Error("tapPromise is not supported on a SyncHook");
    }
    compile(options) {
      return factory.setup(this, options), factory.create(options);
    }
  };
}, function(module, exports, __webpack_require__) {
  const Hook = __webpack_require__(1), HookCodeFactory = __webpack_require__(2);
  const factory = new class extends HookCodeFactory {
    content({onError: onError, onResult: onResult, resultReturns: resultReturns, onDone: onDone}) {
      return this.callTapsSeries({
        onError: (i, err, next, doneBreak) => onError(err) + doneBreak(!0),
        onResult: (i, result, next) => `if(${result} !== undefined) {\n${onResult(result)};\n} else {\n${next()}}\n`,
        resultReturns: resultReturns,
        onDone: onDone
      });
    }
  };
  class AsyncSeriesBailHook extends Hook {
    compile(options) {
      return factory.setup(this, options), factory.create(options);
    }
  }
  Object.defineProperties(AsyncSeriesBailHook.prototype, {
    _call: {
      value: void 0,
      configurable: !0,
      writable: !0
    }
  }), module.exports = AsyncSeriesBailHook;
}, function(module, exports, __webpack_require__) {
  const Hook = __webpack_require__(1), HookCodeFactory = __webpack_require__(2);
  const factory = new class extends HookCodeFactory {
    content({onError: onError, onDone: onDone}) {
      return this.callTapsSeries({
        onError: (i, err, next, doneBreak) => onError(err) + doneBreak(!0),
        onDone: onDone
      });
    }
  };
  class AsyncSeriesHook extends Hook {
    compile(options) {
      return factory.setup(this, options), factory.create(options);
    }
  }
  Object.defineProperties(AsyncSeriesHook.prototype, {
    _call: {
      value: void 0,
      configurable: !0,
      writable: !0
    }
  }), module.exports = AsyncSeriesHook;
}, function(module, exports, __webpack_require__) {
  module.exports = function(options, message, messageOptional) {
    let messageReported = !1;
    return {
      log: (() => {
        if (!options.log) return;
        if (!message) return options.log;
        return msg => {
          messageReported || (options.log(message), messageReported = !0), options.log("  " + msg);
        };
      })(),
      stack: options.stack,
      missing: options.missing
    };
  };
}, function(module, exports, __webpack_require__) {
  const normalize = __webpack_require__(6), absoluteWinRegExp = /^[A-Z]:([\\\/]|$)/i, absoluteNixRegExp = /^\//i;
  module.exports = function(path, request) {
    return request ? absoluteWinRegExp.test(request) ? normalize(request.replace(/\//g, "\\")) : absoluteNixRegExp.test(request) ? normalize(request) : "/" == path ? normalize(path + request) : absoluteWinRegExp.test(path) ? normalize(path.replace(/\//g, "\\") + "\\" + request.replace(/\//g, "\\")) : (absoluteNixRegExp.test(path), 
    normalize(path + "/" + request)) : normalize(path);
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(fs) {
    this.fs = fs, fs.statSync && (this.stat = function(arg, callback) {
      let result;
      try {
        result = fs.statSync(arg);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    }), fs.readdirSync && (this.readdir = function(arg, callback) {
      let result;
      try {
        result = fs.readdirSync(arg);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    }), fs.readFileSync && (this.readFile = function(arg, callback) {
      let result;
      try {
        result = fs.readFileSync(arg);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    }), fs.readlinkSync && (this.readlink = function(arg, callback) {
      let result;
      try {
        result = fs.readlinkSync(arg);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    }), fs.readJsonSync && (this.readJson = function(arg, callback) {
      let result;
      try {
        result = fs.readJsonSync(arg);
      } catch (e) {
        return callback(e);
      }
      callback(null, result);
    });
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ParsePlugin", (request, resolveContext, callback) => {
        const parsed = resolver.parse(request.request), obj = Object.assign({}, request, parsed);
        request.query && !parsed.query && (obj.query = request.query), parsed && resolveContext.log && (parsed.module && resolveContext.log("Parsed request is a module"), 
        parsed.directory && resolveContext.log("Parsed request is a directory")), resolver.doResolve(target, obj, null, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const DescriptionFileUtils = __webpack_require__(0);
  module.exports = class {
    constructor(source, filenames, target) {
      this.source = source, this.filenames = [].concat(filenames), this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("DescriptionFilePlugin", (request, resolveContext, callback) => {
        const directory = request.path;
        DescriptionFileUtils.loadDescriptionFile(resolver, directory, this.filenames, resolveContext, (err, result) => {
          if (err) return callback(err);
          if (!result) return resolveContext.missing && this.filenames.forEach(filename => {
            resolveContext.missing.add(resolver.join(directory, filename));
          }), resolveContext.log && resolveContext.log("No description file found"), callback();
          const relativePath = "." + request.path.substr(result.directory.length).replace(/\\/g, "/"), obj = Object.assign({}, request, {
            descriptionFilePath: result.path,
            descriptionFileData: result.content,
            descriptionFileRoot: result.directory,
            relativePath: relativePath
          });
          resolver.doResolve(target, obj, "using description file: " + result.path + " (relative path: " + relativePath + ")", resolveContext, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
        });
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("NextPlugin", (request, resolveContext, callback) => {
        resolver.doResolve(target, request, null, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, message, target) {
      this.source = source, this.message = message, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("TryNextPlugin", (request, resolveContext, callback) => {
        resolver.doResolve(target, request, this.message, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ModuleKindPlugin", (request, resolveContext, callback) => {
        if (!request.module) return callback();
        const obj = Object.assign({}, request);
        delete obj.module, resolver.doResolve(target, obj, "resolve as module", resolveContext, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("FileKindPlugin", (request, resolveContext, callback) => {
        if (request.directory) return callback();
        const obj = Object.assign({}, request);
        delete obj.directory, resolver.doResolve(target, obj, null, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("JoinRequestPlugin", (request, resolveContext, callback) => {
        const obj = Object.assign({}, request, {
          path: resolver.join(request.path, request.request),
          relativePath: request.relativePath && resolver.join(request.relativePath, request.request),
          request: void 0
        });
        resolver.doResolve(target, obj, null, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const forEachBail = __webpack_require__(3), getPaths = __webpack_require__(7);
  module.exports = class {
    constructor(source, directories, target) {
      this.source = source, this.directories = [].concat(directories), this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ModulesInHierachicDirectoriesPlugin", (request, resolveContext, callback) => {
        const fs = resolver.fileSystem, addrs = getPaths(request.path).paths.map(p => this.directories.map(d => resolver.join(p, d))).reduce((array, p) => (array.push.apply(array, p), 
        array), []);
        forEachBail(addrs, (addr, callback) => {
          fs.stat(addr, (err, stat) => {
            if (!err && stat && stat.isDirectory()) {
              const obj = Object.assign({}, request, {
                path: addr,
                request: "./" + request.request
              }), message = "looking for modules in " + addr;
              return resolver.doResolve(target, obj, message, resolveContext, callback);
            }
            return resolveContext.log && resolveContext.log(addr + " doesn't exist or is not a directory"), 
            resolveContext.missing && resolveContext.missing.add(addr), callback();
          });
        }, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, path, target) {
      this.source = source, this.path = path, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ModulesInRootPlugin", (request, resolveContext, callback) => {
        const obj = Object.assign({}, request, {
          path: this.path,
          request: "./" + request.request
        });
        resolver.doResolve(target, obj, "looking for modules in " + this.path, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const DescriptionFileUtils = __webpack_require__(0), getInnerRequest = __webpack_require__(9);
  module.exports = class {
    constructor(source, field, target) {
      this.source = source, this.field = field, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("AliasFieldPlugin", (request, resolveContext, callback) => {
        if (!request.descriptionFileData) return callback();
        const innerRequest = getInnerRequest(resolver, request);
        if (!innerRequest) return callback();
        const fieldData = DescriptionFileUtils.getField(request.descriptionFileData, this.field);
        if ("object" != typeof fieldData) return resolveContext.log && resolveContext.log("Field '" + this.field + "' doesn't contain a valid alias configuration"), 
        callback();
        const data1 = fieldData[innerRequest], data2 = fieldData[innerRequest.replace(/^\.\//, "")], data = void 0 !== data1 ? data1 : data2;
        if (data === innerRequest) return callback();
        if (void 0 === data) return callback();
        if (!1 === data) {
          const ignoreObj = Object.assign({}, request, {
            path: !1
          });
          return callback(null, ignoreObj);
        }
        const obj = Object.assign({}, request, {
          path: request.descriptionFileRoot,
          request: data
        });
        resolver.doResolve(target, obj, "aliased from description file " + request.descriptionFilePath + " with mapping '" + innerRequest + "' to '" + data + "'", resolveContext, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const concord = __webpack_require__(4), DescriptionFileUtils = __webpack_require__(0), forEachBail = __webpack_require__(3);
  module.exports = class {
    constructor(source, options, target) {
      this.source = source, this.options = options, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ConcordExtensionsPlugin", (request, resolveContext, callback) => {
        const concordField = DescriptionFileUtils.getField(request.descriptionFileData, "concord");
        if (!concordField) return callback();
        const extensions = concord.getExtensions(request.context, concordField);
        if (!extensions) return callback();
        forEachBail(extensions, (appending, callback) => {
          const obj = Object.assign({}, request, {
            path: request.path + appending,
            relativePath: request.relativePath && request.relativePath + appending
          });
          resolver.doResolve(target, obj, "concord extension: " + appending, resolveContext, callback);
        }, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const SIMPLE_TOKENS = {
    "@(": "one",
    "?(": "zero-one",
    "+(": "one-many",
    "*(": "zero-many",
    "|": "segment-sep",
    "/**/": "any-path-segments",
    "**": "any-path",
    "*": "any-path-segment",
    "?": "any-char",
    "{": "or",
    "/": "path-sep",
    ",": "comma",
    ")": "closing-segment",
    "}": "closing-or"
  };
  exports.globToRegExp = function(glob) {
    if (/^\(.+\)$/.test(glob)) return new RegExp(glob.substr(1, glob.length - 2));
    const tokens = function(glob) {
      return glob.split(/([@?+*]\(|\/\*\*\/|\*\*|[?*]|\[[!^]?(?:[^\]\\]|\\.)+\]|\{|,|\/|[|)}])/g).map(item => {
        if (!item) return null;
        const t = SIMPLE_TOKENS[item];
        return t ? {
          type: t
        } : "[" === item[0] ? "^" === item[1] || "!" === item[1] ? {
          type: "inverted-char-set",
          value: item.substr(2, item.length - 3)
        } : {
          type: "char-set",
          value: item.substr(1, item.length - 2)
        } : {
          type: "string",
          value: item
        };
      }).filter(Boolean).concat({
        type: "end"
      });
    }(glob), process = function() {
      const inOr = [], process = function() {
        const inSeqment = [], process = function(token, initial) {
          switch (token.type) {
           case "path-sep":
            return "[\\\\/]+";

           case "any-path-segments":
            return "[\\\\/]+(?:(.+)[\\\\/]+)?";

           case "any-path":
            return "(.*)";

           case "any-path-segment":
            return initial ? "\\.[\\\\/]+(?:.*[\\\\/]+)?([^\\\\/]+)" : "([^\\\\/]*)";

           case "any-char":
            return "[^\\\\/]";

           case "inverted-char-set":
            return "[^" + token.value + "]";

           case "char-set":
            return "[" + token.value + "]";

           case "string":
            return token.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

           case "end":
            return "";

           default:
            throw new Error("Unsupported token '" + token.type + "'");
          }
        };
        return function(token, initial) {
          switch (token.type) {
           case "one":
           case "one-many":
           case "zero-many":
           case "zero-one":
            return inSeqment.push(token.type), "(";

           case "segment-sep":
            return inSeqment.length ? "|" : process({
              type: "string",
              value: "|"
            }, initial);

           case "closing-segment":
            {
              const segment = inSeqment.pop();
              switch (segment) {
               case "one":
                return ")";

               case "one-many":
                return ")+";

               case "zero-many":
                return ")*";

               case "zero-one":
                return ")?";
              }
              throw new Error("Unexcepted segment " + segment);
            }

           case "end":
            if (inSeqment.length > 0) throw new Error("Unmatched segment, missing ')'");
            return process(token, initial);

           default:
            return process(token, initial);
          }
        };
      }();
      let initial = !0;
      return function(token) {
        switch (token.type) {
         case "or":
          return inOr.push(initial), "(";

         case "comma":
          return inOr.length ? (initial = inOr[inOr.length - 1], "|") : process({
            type: "string",
            value: ","
          }, initial);

         case "closing-or":
          if (0 === inOr.length) throw new Error("Unmatched '}'");
          return inOr.pop(), ")";

         case "end":
          if (inOr.length) throw new Error("Unmatched '{'");
          return process(token, initial);

         default:
          {
            const result = process(token, initial);
            return initial = !1, result;
          }
        }
      };
    }(), regExpStr = tokens.map(process).join("");
    return new RegExp("^" + regExpStr + "$");
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(10), concord = __webpack_require__(4), DescriptionFileUtils = __webpack_require__(0);
  module.exports = class {
    constructor(source, options, target) {
      this.source = source, this.options = options, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ConcordMainPlugin", (request, resolveContext, callback) => {
        if (request.path !== request.descriptionFileRoot) return callback();
        const concordField = DescriptionFileUtils.getField(request.descriptionFileData, "concord");
        if (!concordField) return callback();
        const mainModule = concord.getMain(request.context, concordField);
        if (!mainModule) return callback();
        const obj = Object.assign({}, request, {
          request: mainModule
        }), filename = path.basename(request.descriptionFilePath);
        return resolver.doResolve(target, obj, "use " + mainModule + " from " + filename, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const concord = __webpack_require__(4), DescriptionFileUtils = __webpack_require__(0), getInnerRequest = __webpack_require__(9);
  module.exports = class {
    constructor(source, options, target) {
      this.source = source, this.options = options, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ConcordModulesPlugin", (request, resolveContext, callback) => {
        const innerRequest = getInnerRequest(resolver, request);
        if (!innerRequest) return callback();
        const concordField = DescriptionFileUtils.getField(request.descriptionFileData, "concord");
        if (!concordField) return callback();
        const data = concord.matchModule(request.context, concordField, innerRequest);
        if (data === innerRequest) return callback();
        if (void 0 === data) return callback();
        if (!1 === data) {
          const ignoreObj = Object.assign({}, request, {
            path: !1
          });
          return callback(null, ignoreObj);
        }
        const obj = Object.assign({}, request, {
          path: request.descriptionFileRoot,
          request: data
        });
        resolver.doResolve(target, obj, "aliased from description file " + request.descriptionFilePath + " with mapping '" + innerRequest + "' to '" + data + "'", resolveContext, (err, result) => err ? callback(err) : void 0 === result ? callback(null, null) : void callback(null, result));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("DirectoryExistsPlugin", (request, resolveContext, callback) => {
        const fs = resolver.fileSystem, directory = request.path;
        fs.stat(directory, (err, stat) => err || !stat ? (resolveContext.missing && resolveContext.missing.add(directory), 
        resolveContext.log && resolveContext.log(directory + " doesn't exist"), callback()) : stat.isDirectory() ? void resolver.doResolve(target, request, "existing directory", resolveContext, callback) : (resolveContext.missing && resolveContext.missing.add(directory), 
        resolveContext.log && resolveContext.log(directory + " is not a directory"), callback()));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target), fs = resolver.fileSystem;
      resolver.getHook(this.source).tapAsync("FileExistsPlugin", (request, resolveContext, callback) => {
        const file = request.path;
        fs.stat(file, (err, stat) => err || !stat ? (resolveContext.missing && resolveContext.missing.add(file), 
        resolveContext.log && resolveContext.log(file + " doesn't exist"), callback()) : stat.isFile() ? void resolver.doResolve(target, request, "existing file: " + file, resolveContext, callback) : (resolveContext.missing && resolveContext.missing.add(file), 
        resolveContext.log && resolveContext.log(file + " is not a file"), callback()));
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const getPaths = __webpack_require__(7), forEachBail = __webpack_require__(3);
  module.exports = class {
    constructor(source, target) {
      this.source = source, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target), fs = resolver.fileSystem;
      resolver.getHook(this.source).tapAsync("SymlinkPlugin", (request, resolveContext, callback) => {
        const pathsResult = getPaths(request.path), pathSeqments = pathsResult.seqments, paths = pathsResult.paths;
        let containsSymlink = !1;
        forEachBail.withIndex(paths, (path, idx, callback) => {
          fs.readlink(path, (err, result) => {
            if (!err && result && (pathSeqments[idx] = result, containsSymlink = !0, /^(\/|[a-zA-Z]:($|\\))/.test(result))) return callback(null, idx);
            callback();
          });
        }, (err, idx) => {
          if (!containsSymlink) return callback();
          const result = ("number" == typeof idx ? pathSeqments.slice(0, idx + 1) : pathSeqments.slice()).reverse().reduce((a, b) => resolver.join(a, b)), obj = Object.assign({}, request, {
            path: result
          });
          resolver.doResolve(target, obj, "resolved symlink to " + result, resolveContext, callback);
        });
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(10);
  module.exports = class {
    constructor(source, options, target) {
      this.source = source, this.options = options, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("MainFieldPlugin", (request, resolveContext, callback) => {
        if (request.path !== request.descriptionFileRoot) return callback();
        if (request.alreadyTriedMainField === request.descriptionFilePath) return callback();
        const content = request.descriptionFileData, filename = path.basename(request.descriptionFilePath);
        let mainModule;
        const field = this.options.name;
        if (Array.isArray(field)) {
          let current = content;
          for (let j = 0; j < field.length; j++) {
            if (null === current || "object" != typeof current) {
              current = null;
              break;
            }
            current = current[field[j]];
          }
          "string" == typeof current && (mainModule = current);
        } else "string" == typeof content[field] && (mainModule = content[field]);
        if (!mainModule) return callback();
        this.options.forceRelative && !/^\.\.?\//.test(mainModule) && (mainModule = "./" + mainModule);
        const obj = Object.assign({}, request, {
          request: mainModule,
          alreadyTriedMainField: request.descriptionFilePath
        });
        return resolver.doResolve(target, obj, "use " + mainModule + " from " + this.options.name + " in " + filename, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, filename, target) {
      this.source = source, this.filename = filename, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("UseFilePlugin", (request, resolveContext, callback) => {
        const filePath = resolver.join(request.path, this.filename), obj = Object.assign({}, request, {
          path: filePath,
          relativePath: request.relativePath && resolver.join(request.relativePath, this.filename)
        });
        resolver.doResolve(target, obj, "using path: " + filePath, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, appending, target) {
      this.source = source, this.appending = appending, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("AppendPlugin", (request, resolveContext, callback) => {
        const obj = Object.assign({}, request, {
          path: request.path + this.appending,
          relativePath: request.relativePath && request.relativePath + this.appending
        });
        resolver.doResolve(target, obj, this.appending, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, root, target, ignoreErrors) {
      this.root = root, this.source = source, this.target = target, this._ignoreErrors = ignoreErrors;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("RootPlugin", (request, resolveContext, callback) => {
        const req = request.request;
        if (!req) return callback();
        if (!req.startsWith("/")) return callback();
        const path = resolver.join(this.root, req.slice(1)), obj = Object.assign(request, {
          path: path,
          relativePath: request.relativePath && path
        });
        resolver.doResolve(target, obj, "root path " + this.root, resolveContext, this._ignoreErrors ? (err, result) => err ? (resolveContext.log && resolveContext.log("Ignored fatal error while resolving root path:\n" + err), 
        callback()) : result ? callback(null, result) : void callback() : callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const slashCode = "/".charCodeAt(0), backslashCode = "\\".charCodeAt(0), isInside = (path, parent) => {
    if (!path.startsWith(parent)) return !1;
    if (path.length === parent.length) return !0;
    const charCode = path.charCodeAt(parent.length);
    return charCode === slashCode || charCode === backslashCode;
  };
  module.exports = class {
    constructor(source, restrictions) {
      this.source = source, this.restrictions = restrictions;
    }
    apply(resolver) {
      resolver.getHook(this.source).tapAsync("RestrictionsPlugin", (request, resolveContext, callback) => {
        if ("string" == typeof request.path) {
          const path = request.path;
          for (let i = 0; i < this.restrictions.length; i++) {
            const rule = this.restrictions[i];
            if ("string" == typeof rule) {
              if (!isInside(path, rule)) return resolveContext.log && resolveContext.log(`${path} is not inside of the restriction ${rule}`), 
              callback(null, null);
            } else if (!rule.test(path)) return resolveContext.log && resolveContext.log(`${path} doesn't match the restriction ${rule}`), 
            callback(null, null);
          }
        }
        callback();
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source) {
      this.source = source;
    }
    apply(resolver) {
      this.source.tapAsync("ResultPlugin", (request, resolverContext, callback) => {
        const obj = Object.assign({}, request);
        resolverContext.log && resolverContext.log("reporting result " + obj.path), resolver.hooks.result.callAsync(obj, resolverContext, err => {
          if (err) return callback(err);
          callback(null, obj);
        });
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, appending, target) {
      this.source = source, this.appending = appending, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("ModuleAppendPlugin", (request, resolveContext, callback) => {
        const i = request.request.indexOf("/"), j = request.request.indexOf("\\"), p = i < 0 ? j : j < 0 || i < j ? i : j;
        let moduleName, remainingRequest;
        if (p < 0 ? (moduleName = request.request, remainingRequest = "") : (moduleName = request.request.substr(0, p), 
        remainingRequest = request.request.substr(p)), "." === moduleName || ".." === moduleName) return callback();
        const moduleFinalName = moduleName + this.appending, obj = Object.assign({}, request, {
          request: moduleFinalName + remainingRequest
        });
        resolver.doResolve(target, obj, "module variation " + moduleFinalName, resolveContext, callback);
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor(source, filterPredicate, cache, withContext, target) {
      this.source = source, this.filterPredicate = filterPredicate, this.withContext = withContext, 
      this.cache = cache || {}, this.target = target;
    }
    apply(resolver) {
      const target = resolver.ensureHook(this.target);
      resolver.getHook(this.source).tapAsync("UnsafeCachePlugin", (request, resolveContext, callback) => {
        if (!this.filterPredicate(request)) return callback();
        const cacheId = function(request, withContext) {
          return JSON.stringify({
            context: withContext ? request.context : "",
            path: request.path,
            query: request.query,
            request: request.request
          });
        }(request, this.withContext), cacheEntry = this.cache[cacheId];
        if (cacheEntry) return callback(null, cacheEntry);
        resolver.doResolve(target, request, null, resolveContext, (err, result) => err ? callback(err) : result ? callback(null, this.cache[cacheId] = result) : void callback());
      });
    }
  };
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(48);
  class NodeJsInputFileSystem {
    readdir(path, callback) {
      fs.readdir(path, (err, files) => {
        callback(err, files && files.map(file => file.normalize ? file.normalize("NFC") : file));
      });
    }
    readdirSync(path) {
      const files = fs.readdirSync(path);
      return files && files.map(file => file.normalize ? file.normalize("NFC") : file);
    }
  }
  const fsMethods = [ "stat", "statSync", "readFile", "readFileSync", "readlink", "readlinkSync" ];
  for (const key of fsMethods) Object.defineProperty(NodeJsInputFileSystem.prototype, key, {
    configurable: !0,
    writable: !0,
    value: fs[key].bind(fs)
  });
  module.exports = NodeJsInputFileSystem;
}, function(module, exports) {
  module.exports = require("../vendor/graceful-fs");
}, function(module, exports, __webpack_require__) {
  class Storage {
    constructor(duration) {
      if (this.duration = duration, this.running = new Map, this.data = new Map, this.levels = [], 
      duration > 0) {
        this.levels.push(new Set, new Set, new Set, new Set, new Set, new Set, new Set, new Set, new Set);
        for (let i = 8e3; i < duration; i += 500) this.levels.push(new Set);
      }
      this.count = 0, this.interval = null, this.needTickCheck = !1, this.nextTick = null, 
      this.passive = !0, this.tick = this.tick.bind(this);
    }
    ensureTick() {
      !this.interval && this.duration > 0 && !this.nextTick && (this.interval = setInterval(this.tick, Math.floor(this.duration / this.levels.length)));
    }
    finished(name, err, result) {
      const callbacks = this.running.get(name);
      if (this.running.delete(name), this.duration > 0) {
        this.data.set(name, [ err, result ]);
        const levelData = this.levels[0];
        this.count -= levelData.size, levelData.add(name), this.count += levelData.size, 
        this.ensureTick();
      }
      for (let i = 0; i < callbacks.length; i++) callbacks[i](err, result);
    }
    finishedSync(name, err, result) {
      if (this.duration > 0) {
        this.data.set(name, [ err, result ]);
        const levelData = this.levels[0];
        this.count -= levelData.size, levelData.add(name), this.count += levelData.size, 
        this.ensureTick();
      }
    }
    provide(name, provider, callback) {
      if ("string" != typeof name) return void callback(new TypeError("path must be a string"));
      let running = this.running.get(name);
      if (running) running.push(callback); else {
        if (this.duration > 0) {
          this.checkTicks();
          const data = this.data.get(name);
          if (data) return process.nextTick(() => {
            callback.apply(null, data);
          });
        }
        this.running.set(name, running = [ callback ]), provider(name, (err, result) => {
          this.finished(name, err, result);
        });
      }
    }
    provideSync(name, provider) {
      if ("string" != typeof name) throw new TypeError("path must be a string");
      if (this.duration > 0) {
        this.checkTicks();
        const data = this.data.get(name);
        if (data) {
          if (data[0]) throw data[0];
          return data[1];
        }
      }
      let result;
      try {
        result = provider(name);
      } catch (e) {
        throw this.finishedSync(name, e), e;
      }
      return this.finishedSync(name, null, result), result;
    }
    tick() {
      const decay = this.levels.pop();
      for (let item of decay) this.data.delete(item);
      if (this.count -= decay.size, decay.clear(), this.levels.unshift(decay), 0 === this.count) return clearInterval(this.interval), 
      this.interval = null, this.nextTick = null, !0;
      if (this.nextTick) {
        this.nextTick += Math.floor(this.duration / this.levels.length);
        const time = (new Date).getTime();
        if (this.nextTick > time) return this.nextTick = null, this.interval = setInterval(this.tick, Math.floor(this.duration / this.levels.length)), 
        !0;
      } else this.passive ? (clearInterval(this.interval), this.interval = null, this.nextTick = (new Date).getTime() + Math.floor(this.duration / this.levels.length)) : this.passive = !0;
    }
    checkTicks() {
      if (this.passive = !1, this.nextTick) for (;!this.tick(); ) ;
    }
    purge(what) {
      if (what) if ("string" == typeof what) for (let key of this.data.keys()) key.startsWith(what) && this.data.delete(key); else for (let i = what.length - 1; i >= 0; i--) this.purge(what[i]); else this.count = 0, 
      clearInterval(this.interval), this.nextTick = null, this.data.clear(), this.levels.forEach(level => {
        level.clear();
      });
    }
  }
  module.exports = class {
    constructor(fileSystem, duration) {
      this.fileSystem = fileSystem, this._statStorage = new Storage(duration), this._readdirStorage = new Storage(duration), 
      this._readFileStorage = new Storage(duration), this._readJsonStorage = new Storage(duration), 
      this._readlinkStorage = new Storage(duration), this._stat = this.fileSystem.stat ? this.fileSystem.stat.bind(this.fileSystem) : null, 
      this._stat || (this.stat = null), this._statSync = this.fileSystem.statSync ? this.fileSystem.statSync.bind(this.fileSystem) : null, 
      this._statSync || (this.statSync = null), this._readdir = this.fileSystem.readdir ? this.fileSystem.readdir.bind(this.fileSystem) : null, 
      this._readdir || (this.readdir = null), this._readdirSync = this.fileSystem.readdirSync ? this.fileSystem.readdirSync.bind(this.fileSystem) : null, 
      this._readdirSync || (this.readdirSync = null), this._readFile = this.fileSystem.readFile ? this.fileSystem.readFile.bind(this.fileSystem) : null, 
      this._readFile || (this.readFile = null), this._readFileSync = this.fileSystem.readFileSync ? this.fileSystem.readFileSync.bind(this.fileSystem) : null, 
      this._readFileSync || (this.readFileSync = null), this.fileSystem.readJson ? this._readJson = this.fileSystem.readJson.bind(this.fileSystem) : this.readFile ? this._readJson = (path, callback) => {
        this.readFile(path, (err, buffer) => {
          if (err) return callback(err);
          let data;
          try {
            data = JSON.parse(buffer.toString("utf-8"));
          } catch (e) {
            return callback(e);
          }
          callback(null, data);
        });
      } : this.readJson = null, this.fileSystem.readJsonSync ? this._readJsonSync = this.fileSystem.readJsonSync.bind(this.fileSystem) : this.readFileSync ? this._readJsonSync = path => {
        const buffer = this.readFileSync(path);
        return JSON.parse(buffer.toString("utf-8"));
      } : this.readJsonSync = null, this._readlink = this.fileSystem.readlink ? this.fileSystem.readlink.bind(this.fileSystem) : null, 
      this._readlink || (this.readlink = null), this._readlinkSync = this.fileSystem.readlinkSync ? this.fileSystem.readlinkSync.bind(this.fileSystem) : null, 
      this._readlinkSync || (this.readlinkSync = null);
    }
    stat(path, callback) {
      this._statStorage.provide(path, this._stat, callback);
    }
    readdir(path, callback) {
      this._readdirStorage.provide(path, this._readdir, callback);
    }
    readFile(path, callback) {
      this._readFileStorage.provide(path, this._readFile, callback);
    }
    readJson(path, callback) {
      this._readJsonStorage.provide(path, this._readJson, callback);
    }
    readlink(path, callback) {
      this._readlinkStorage.provide(path, this._readlink, callback);
    }
    statSync(path) {
      return this._statStorage.provideSync(path, this._statSync);
    }
    readdirSync(path) {
      return this._readdirStorage.provideSync(path, this._readdirSync);
    }
    readFileSync(path) {
      return this._readFileStorage.provideSync(path, this._readFileSync);
    }
    readJsonSync(path) {
      return this._readJsonStorage.provideSync(path, this._readJsonSync);
    }
    readlinkSync(path) {
      return this._readlinkStorage.provideSync(path, this._readlinkSync);
    }
    purge(what) {
      this._statStorage.purge(what), this._readdirStorage.purge(what), this._readFileStorage.purge(what), 
      this._readlinkStorage.purge(what), this._readJsonStorage.purge(what);
    }
  };
} ]);
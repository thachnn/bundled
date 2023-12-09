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
  return __webpack_require__(6);
}([ function(module, exports, __webpack_require__) {
  var es5 = __webpack_require__(2), canEvaluate = "undefined" == typeof navigator, errorObj = {
    e: {}
  }, tryCatchTarget, globalObject = "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : void 0 !== this ? this : null;
  function tryCatcher() {
    try {
      var target = tryCatchTarget;
      return tryCatchTarget = null, target.apply(this, arguments);
    } catch (e) {
      return errorObj.e = e, errorObj;
    }
  }
  function tryCatch(fn) {
    return tryCatchTarget = fn, tryCatcher;
  }
  var inherits = function(Child, Parent) {
    var hasProp = {}.hasOwnProperty;
    function T() {
      for (var propertyName in this.constructor = Child, this.constructor$ = Parent, Parent.prototype) hasProp.call(Parent.prototype, propertyName) && "$" !== propertyName.charAt(propertyName.length - 1) && (this[propertyName + "$"] = Parent.prototype[propertyName]);
    }
    return T.prototype = Parent.prototype, Child.prototype = new T, Child.prototype;
  };
  function isPrimitive(val) {
    return null == val || !0 === val || !1 === val || "string" == typeof val || "number" == typeof val;
  }
  function isObject(value) {
    return "function" == typeof value || "object" == typeof value && null !== value;
  }
  function maybeWrapAsError(maybeError) {
    return isPrimitive(maybeError) ? new Error(safeToString(maybeError)) : maybeError;
  }
  function withAppended(target, appendee) {
    var i, len = target.length, ret = new Array(len + 1);
    for (i = 0; i < len; ++i) ret[i] = target[i];
    return ret[i] = appendee, ret;
  }
  function getDataPropertyOrDefault(obj, key, defaultValue) {
    if (!es5.isES5) return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;
    var desc = Object.getOwnPropertyDescriptor(obj, key);
    return null != desc ? null == desc.get && null == desc.set ? desc.value : defaultValue : void 0;
  }
  function notEnumerableProp(obj, name, value) {
    if (isPrimitive(obj)) return obj;
    var descriptor = {
      value: value,
      configurable: !0,
      enumerable: !1,
      writable: !0
    };
    return es5.defineProperty(obj, name, descriptor), obj;
  }
  function thrower(r) {
    throw r;
  }
  var inheritedDataKeys = function() {
    var excludedPrototypes = [ Array.prototype, Object.prototype, Function.prototype ], isExcludedProto = function(val) {
      for (var i = 0; i < excludedPrototypes.length; ++i) if (excludedPrototypes[i] === val) return !0;
      return !1;
    };
    if (es5.isES5) {
      var getKeys = Object.getOwnPropertyNames;
      return function(obj) {
        for (var ret = [], visitedKeys = Object.create(null); null != obj && !isExcludedProto(obj); ) {
          var keys;
          try {
            keys = getKeys(obj);
          } catch (e) {
            return ret;
          }
          for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!visitedKeys[key]) {
              visitedKeys[key] = !0;
              var desc = Object.getOwnPropertyDescriptor(obj, key);
              null != desc && null == desc.get && null == desc.set && ret.push(key);
            }
          }
          obj = es5.getPrototypeOf(obj);
        }
        return ret;
      };
    }
    var hasProp = {}.hasOwnProperty;
    return function(obj) {
      if (isExcludedProto(obj)) return [];
      var ret = [];
      enumeration: for (var key in obj) if (hasProp.call(obj, key)) ret.push(key); else {
        for (var i = 0; i < excludedPrototypes.length; ++i) if (hasProp.call(excludedPrototypes[i], key)) continue enumeration;
        ret.push(key);
      }
      return ret;
    };
  }(), thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
  function isClass(fn) {
    try {
      if ("function" == typeof fn) {
        var keys = es5.names(fn.prototype), hasMethods = es5.isES5 && keys.length > 1, hasMethodsOtherThanConstructor = keys.length > 0 && !(1 === keys.length && "constructor" === keys[0]), hasThisAssignmentAndStaticMethods = thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;
        if (hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods) return !0;
      }
      return !1;
    } catch (e) {
      return !1;
    }
  }
  function toFastProperties(obj) {
    function FakeConstructor() {}
    FakeConstructor.prototype = obj;
    var receiver = new FakeConstructor;
    function ic() {
      return typeof receiver.foo;
    }
    return ic(), ic(), obj;
  }
  var rident = /^[a-z$_][a-z$_0-9]*$/i;
  function isIdentifier(str) {
    return rident.test(str);
  }
  function filledRange(count, prefix, suffix) {
    for (var ret = new Array(count), i = 0; i < count; ++i) ret[i] = prefix + i + suffix;
    return ret;
  }
  function safeToString(obj) {
    try {
      return obj + "";
    } catch (e) {
      return "[no string representation]";
    }
  }
  function isError(obj) {
    return obj instanceof Error || null !== obj && "object" == typeof obj && "string" == typeof obj.message && "string" == typeof obj.name;
  }
  function markAsOriginatingFromRejection(e) {
    try {
      notEnumerableProp(e, "isOperational", !0);
    } catch (ignore) {}
  }
  function originatesFromRejection(e) {
    return null != e && (e instanceof Error.__BluebirdErrorTypes__.OperationalError || !0 === e.isOperational);
  }
  function canAttachTrace(obj) {
    return isError(obj) && es5.propertyIsWritable(obj, "stack");
  }
  var ensureErrorObject = "stack" in new Error ? function(value) {
    return canAttachTrace(value) ? value : new Error(safeToString(value));
  } : function(value) {
    if (canAttachTrace(value)) return value;
    try {
      throw new Error(safeToString(value));
    } catch (err) {
      return err;
    }
  };
  function classString(obj) {
    return {}.toString.call(obj);
  }
  function copyDescriptors(from, to, filter) {
    for (var keys = es5.names(from), i = 0; i < keys.length; ++i) {
      var key = keys[i];
      if (filter(key)) try {
        es5.defineProperty(to, key, es5.getDescriptor(from, key));
      } catch (ignore) {}
    }
  }
  var asArray = function(v) {
    return es5.isArray(v) ? v : null;
  };
  if ("undefined" != typeof Symbol && Symbol.iterator) {
    var ArrayFrom = "function" == typeof Array.from ? function(v) {
      return Array.from(v);
    } : function(v) {
      for (var itResult, ret = [], it = v[Symbol.iterator](); !(itResult = it.next()).done; ) ret.push(itResult.value);
      return ret;
    };
    asArray = function(v) {
      return es5.isArray(v) ? v : null != v && "function" == typeof v[Symbol.iterator] ? ArrayFrom(v) : null;
    };
  }
  var isNode = "undefined" != typeof process && "[object process]" === classString(process).toLowerCase(), hasEnvVariables = "undefined" != typeof process && void 0 !== process.env, reflectHandler;
  function env(key) {
    return hasEnvVariables ? process.env[key] : void 0;
  }
  function getNativePromise() {
    if ("function" == typeof Promise) try {
      if ("[object Promise]" === classString(new Promise((function() {})))) return Promise;
    } catch (e) {}
  }
  function contextBind(ctx, cb) {
    if (null === ctx || "function" != typeof cb || cb === reflectHandler) return cb;
    null !== ctx.domain && (cb = ctx.domain.bind(cb));
    var async = ctx.async;
    if (null !== async) {
      var old = cb;
      cb = function() {
        for (var $_len = arguments.length + 2, args = new Array($_len), $_i = 2; $_i < $_len; ++$_i) args[$_i] = arguments[$_i - 2];
        return args[0] = old, args[1] = this, async.runInAsyncScope.apply(async, args);
      };
    }
    return cb;
  }
  var ret = {
    setReflectHandler: function(fn) {
      reflectHandler = fn;
    },
    isClass: isClass,
    isIdentifier: isIdentifier,
    inheritedDataKeys: inheritedDataKeys,
    getDataPropertyOrDefault: getDataPropertyOrDefault,
    thrower: thrower,
    isArray: es5.isArray,
    asArray: asArray,
    notEnumerableProp: notEnumerableProp,
    isPrimitive: isPrimitive,
    isObject: isObject,
    isError: isError,
    canEvaluate: canEvaluate,
    errorObj: errorObj,
    tryCatch: tryCatch,
    inherits: inherits,
    withAppended: withAppended,
    maybeWrapAsError: maybeWrapAsError,
    toFastProperties: toFastProperties,
    filledRange: filledRange,
    toString: safeToString,
    canAttachTrace: canAttachTrace,
    ensureErrorObject: ensureErrorObject,
    originatesFromRejection: originatesFromRejection,
    markAsOriginatingFromRejection: markAsOriginatingFromRejection,
    classString: classString,
    copyDescriptors: copyDescriptors,
    isNode: isNode,
    hasEnvVariables: hasEnvVariables,
    env: env,
    global: globalObject,
    getNativePromise: getNativePromise,
    contextBind: contextBind
  }, version;
  ret.isRecentNode = ret.isNode && (process.versions && process.versions.node ? version = process.versions.node.split(".").map(Number) : process.version && (version = process.version.split(".").map(Number)), 
  0 === version[0] && version[1] > 10 || version[0] > 0), ret.nodeSupportsAsyncResource = ret.isNode && function() {
    var supportsAsync = !1;
    try {
      supportsAsync = "function" == typeof __webpack_require__(3).AsyncResource.prototype.runInAsyncScope;
    } catch (e) {
      supportsAsync = !1;
    }
    return supportsAsync;
  }(), ret.isNode && ret.toFastProperties(process);
  try {
    throw new Error;
  } catch (e) {
    ret.lastLineError = e;
  }
  module.exports = ret;
}, function(module, exports, __webpack_require__) {
  var _TypeError, _RangeError, es5 = __webpack_require__(2), Objectfreeze = es5.freeze, util = __webpack_require__(0), inherits = util.inherits, notEnumerableProp = util.notEnumerableProp;
  function subError(nameProperty, defaultMessage) {
    function SubError(message) {
      if (!(this instanceof SubError)) return new SubError(message);
      notEnumerableProp(this, "message", "string" == typeof message ? message : defaultMessage), 
      notEnumerableProp(this, "name", nameProperty), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this);
    }
    return inherits(SubError, Error), SubError;
  }
  var Warning = subError("Warning", "warning"), CancellationError = subError("CancellationError", "cancellation error"), TimeoutError = subError("TimeoutError", "timeout error"), AggregateError = subError("AggregateError", "aggregate error");
  try {
    _TypeError = TypeError, _RangeError = RangeError;
  } catch (e) {
    _TypeError = subError("TypeError", "type error"), _RangeError = subError("RangeError", "range error");
  }
  for (var methods = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), i = 0; i < methods.length; ++i) "function" == typeof Array.prototype[methods[i]] && (AggregateError.prototype[methods[i]] = Array.prototype[methods[i]]);
  es5.defineProperty(AggregateError.prototype, "length", {
    value: 0,
    configurable: !1,
    writable: !0,
    enumerable: !0
  }), AggregateError.prototype.isOperational = !0;
  var level = 0;
  function OperationalError(message) {
    if (!(this instanceof OperationalError)) return new OperationalError(message);
    notEnumerableProp(this, "name", "OperationalError"), notEnumerableProp(this, "message", message), 
    this.cause = message, this.isOperational = !0, message instanceof Error ? (notEnumerableProp(this, "message", message.message), 
    notEnumerableProp(this, "stack", message.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  }
  AggregateError.prototype.toString = function() {
    var indent = Array(4 * level + 1).join(" "), ret = "\n" + indent + "AggregateError of:\n";
    level++, indent = Array(4 * level + 1).join(" ");
    for (var i = 0; i < this.length; ++i) {
      for (var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "", lines = str.split("\n"), j = 0; j < lines.length; ++j) lines[j] = indent + lines[j];
      ret += (str = lines.join("\n")) + "\n";
    }
    return level--, ret;
  }, inherits(OperationalError, Error);
  var errorTypes = Error.__BluebirdErrorTypes__;
  errorTypes || (errorTypes = Objectfreeze({
    CancellationError: CancellationError,
    TimeoutError: TimeoutError,
    OperationalError: OperationalError,
    RejectionError: OperationalError,
    AggregateError: AggregateError
  }), es5.defineProperty(Error, "__BluebirdErrorTypes__", {
    value: errorTypes,
    writable: !1,
    enumerable: !1,
    configurable: !1
  })), module.exports = {
    Error: Error,
    TypeError: _TypeError,
    RangeError: _RangeError,
    CancellationError: errorTypes.CancellationError,
    OperationalError: errorTypes.OperationalError,
    TimeoutError: errorTypes.TimeoutError,
    AggregateError: errorTypes.AggregateError,
    Warning: Warning
  };
}, function(module, exports) {
  var isES5 = function() {
    return void 0 === this;
  }();
  if (isES5) module.exports = {
    freeze: Object.freeze,
    defineProperty: Object.defineProperty,
    getDescriptor: Object.getOwnPropertyDescriptor,
    keys: Object.keys,
    names: Object.getOwnPropertyNames,
    getPrototypeOf: Object.getPrototypeOf,
    isArray: Array.isArray,
    isES5: isES5,
    propertyIsWritable: function(obj, prop) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      return !(descriptor && !descriptor.writable && !descriptor.set);
    }
  }; else {
    var has = {}.hasOwnProperty, str = {}.toString, proto = {}.constructor.prototype, ObjectKeys = function(o) {
      var ret = [];
      for (var key in o) has.call(o, key) && ret.push(key);
      return ret;
    };
    module.exports = {
      isArray: function(obj) {
        try {
          return "[object Array]" === str.call(obj);
        } catch (e) {
          return !1;
        }
      },
      keys: ObjectKeys,
      names: ObjectKeys,
      defineProperty: function(o, key, desc) {
        return o[key] = desc.value, o;
      },
      getDescriptor: function(o, key) {
        return {
          value: o[key]
        };
      },
      freeze: function(obj) {
        return obj;
      },
      getPrototypeOf: function(obj) {
        try {
          return Object(obj).constructor.prototype;
        } catch (e) {
          return proto;
        }
      },
      isES5: isES5,
      propertyIsWritable: function() {
        return !0;
      }
    };
  }
}, function(module, exports) {
  module.exports = require("async_hooks");
}, function(module, exports, __webpack_require__) {
  module.exports = function(NEXT_FILTER) {
    var util = __webpack_require__(0), getKeys = __webpack_require__(2).keys, tryCatch = util.tryCatch, errorObj = util.errorObj;
    return function(instances, cb, promise) {
      return function(e) {
        var boundTo = promise._boundValue();
        predicateLoop: for (var i = 0; i < instances.length; ++i) {
          var item = instances[i];
          if (item === Error || null != item && item.prototype instanceof Error) {
            if (e instanceof item) return tryCatch(cb).call(boundTo, e);
          } else if ("function" == typeof item) {
            var matchesPredicate = tryCatch(item).call(boundTo, e);
            if (matchesPredicate === errorObj) return matchesPredicate;
            if (matchesPredicate) return tryCatch(cb).call(boundTo, e);
          } else if (util.isObject(e)) {
            for (var keys = getKeys(item), j = 0; j < keys.length; ++j) {
              var key = keys[j];
              if (item[key] != e[key]) continue predicateLoop;
            }
            return tryCatch(cb).call(boundTo, e);
          }
        }
        return NEXT_FILTER;
      };
    };
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(0), maybeWrapAsError = util.maybeWrapAsError, OperationalError = __webpack_require__(1).OperationalError, es5 = __webpack_require__(2);
  var rErrorKey = /^(?:name|message|stack|cause)$/;
  function wrapAsOperationalError(obj) {
    var ret;
    if (function(obj) {
      return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
    }(obj)) {
      (ret = new OperationalError(obj)).name = obj.name, ret.message = obj.message, ret.stack = obj.stack;
      for (var keys = es5.keys(obj), i = 0; i < keys.length; ++i) {
        var key = keys[i];
        rErrorKey.test(key) || (ret[key] = obj[key]);
      }
      return ret;
    }
    return util.markAsOriginatingFromRejection(obj), obj;
  }
  module.exports = function(promise, multiArgs) {
    return function(err, value) {
      if (null !== promise) {
        if (err) {
          var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
          promise._attachExtraTrace(wrapped), promise._reject(wrapped);
        } else if (multiArgs) {
          for (var $_len = arguments.length, args = new Array(Math.max($_len - 1, 0)), $_i = 1; $_i < $_len; ++$_i) args[$_i - 1] = arguments[$_i];
          promise._fulfill(args);
        } else promise._fulfill(value);
        promise = null;
      }
    };
  };
}, function(module, exports, __webpack_require__) {
  var old;
  "undefined" != typeof Promise && (old = Promise);
  var bluebird = __webpack_require__(7)();
  bluebird.noConflict = function() {
    try {
      Promise === bluebird && (Promise = old);
    } catch (e) {}
    return bluebird;
  }, module.exports = bluebird;
}, function(module, exports, __webpack_require__) {
  module.exports = function() {
    var makeSelfResolutionError = function() {
      return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
    }, reflectHandler = function() {
      return new Promise.PromiseInspection(this._target());
    }, apiRejection = function(msg) {
      return Promise.reject(new TypeError(msg));
    };
    function Proxyable() {}
    var UNDEFINED_BINDING = {}, util = __webpack_require__(0);
    util.setReflectHandler(reflectHandler);
    var getDomain = function() {
      var domain = process.domain;
      return void 0 === domain ? null : domain;
    }, getContextDomain = function() {
      return {
        domain: getDomain(),
        async: null
      };
    }, AsyncResource = util.isNode && util.nodeSupportsAsyncResource ? __webpack_require__(3).AsyncResource : null, getContextAsyncHooks = function() {
      return {
        domain: getDomain(),
        async: new AsyncResource("Bluebird::Promise")
      };
    }, getContext = util.isNode ? getContextDomain : function() {
      return null;
    };
    util.notEnumerableProp(Promise, "_getContext", getContext);
    var es5 = __webpack_require__(2), Async = __webpack_require__(8), async = new Async;
    es5.defineProperty(Promise, "_async", {
      value: async
    });
    var errors = __webpack_require__(1), TypeError = Promise.TypeError = errors.TypeError;
    Promise.RangeError = errors.RangeError;
    var CancellationError = Promise.CancellationError = errors.CancellationError;
    Promise.TimeoutError = errors.TimeoutError, Promise.OperationalError = errors.OperationalError, 
    Promise.RejectionError = errors.OperationalError, Promise.AggregateError = errors.AggregateError;
    var INTERNAL = function() {}, APPLY = {}, NEXT_FILTER = {}, tryConvertToPromise = __webpack_require__(11)(Promise, INTERNAL), PromiseArray = __webpack_require__(12)(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable), Context = __webpack_require__(13)(Promise), createContext = Context.create, debug = __webpack_require__(14)(Promise, Context, (function() {
      getContext = getContextAsyncHooks, util.notEnumerableProp(Promise, "_getContext", getContextAsyncHooks);
    }), (function() {
      getContext = getContextDomain, util.notEnumerableProp(Promise, "_getContext", getContextDomain);
    })), PassThroughHandlerContext = (debug.CapturedTrace, __webpack_require__(15)(Promise, tryConvertToPromise, NEXT_FILTER)), catchFilter = __webpack_require__(4)(NEXT_FILTER), nodebackForPromise = __webpack_require__(5), errorObj = util.errorObj, tryCatch = util.tryCatch;
    function Promise(executor) {
      executor !== INTERNAL && function(self, executor) {
        if (null == self || self.constructor !== Promise) throw new TypeError("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");
        if ("function" != typeof executor) throw new TypeError("expecting a function but got " + util.classString(executor));
      }(this, executor), this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, 
      this._promise0 = void 0, this._receiver0 = void 0, this._resolveFromExecutor(executor), 
      this._promiseCreated(), this._fireEvent("promiseCreated", this);
    }
    function deferResolve(v) {
      this.promise._resolveCallback(v);
    }
    function deferReject(v) {
      this.promise._rejectCallback(v, !1);
    }
    function fillTypes(value) {
      var p = new Promise(INTERNAL);
      p._fulfillmentHandler0 = value, p._rejectionHandler0 = value, p._promise0 = value, 
      p._receiver0 = value;
    }
    return Promise.prototype.toString = function() {
      return "[object Promise]";
    }, Promise.prototype.caught = Promise.prototype.catch = function(fn) {
      var len = arguments.length;
      if (len > 1) {
        var i, catchInstances = new Array(len - 1), j = 0;
        for (i = 0; i < len - 1; ++i) {
          var item = arguments[i];
          if (!util.isObject(item)) return apiRejection("Catch statement predicate: expecting an object but got " + util.classString(item));
          catchInstances[j++] = item;
        }
        if (catchInstances.length = j, "function" != typeof (fn = arguments[i])) throw new TypeError("The last argument to .catch() must be a function, got " + util.toString(fn));
        return this.then(void 0, catchFilter(catchInstances, fn, this));
      }
      return this.then(void 0, fn);
    }, Promise.prototype.reflect = function() {
      return this._then(reflectHandler, reflectHandler, void 0, this, void 0);
    }, Promise.prototype.then = function(didFulfill, didReject) {
      if (debug.warnings() && arguments.length > 0 && "function" != typeof didFulfill && "function" != typeof didReject) {
        var msg = ".then() only accepts functions but was passed: " + util.classString(didFulfill);
        arguments.length > 1 && (msg += ", " + util.classString(didReject)), this._warn(msg);
      }
      return this._then(didFulfill, didReject, void 0, void 0, void 0);
    }, Promise.prototype.done = function(didFulfill, didReject) {
      this._then(didFulfill, didReject, void 0, void 0, void 0)._setIsFinal();
    }, Promise.prototype.spread = function(fn) {
      return "function" != typeof fn ? apiRejection("expecting a function but got " + util.classString(fn)) : this.all()._then(fn, void 0, void 0, APPLY, void 0);
    }, Promise.prototype.toJSON = function() {
      var ret = {
        isFulfilled: !1,
        isRejected: !1,
        fulfillmentValue: void 0,
        rejectionReason: void 0
      };
      return this.isFulfilled() ? (ret.fulfillmentValue = this.value(), ret.isFulfilled = !0) : this.isRejected() && (ret.rejectionReason = this.reason(), 
      ret.isRejected = !0), ret;
    }, Promise.prototype.all = function() {
      return arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any"), 
      new PromiseArray(this).promise();
    }, Promise.prototype.error = function(fn) {
      return this.caught(util.originatesFromRejection, fn);
    }, Promise.getNewLibraryCopy = module.exports, Promise.is = function(val) {
      return val instanceof Promise;
    }, Promise.fromNode = Promise.fromCallback = function(fn) {
      var ret = new Promise(INTERNAL);
      ret._captureStackTrace();
      var multiArgs = arguments.length > 1 && !!Object(arguments[1]).multiArgs, result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
      return result === errorObj && ret._rejectCallback(result.e, !0), ret._isFateSealed() || ret._setAsyncGuaranteed(), 
      ret;
    }, Promise.all = function(promises) {
      return new PromiseArray(promises).promise();
    }, Promise.cast = function(obj) {
      var ret = tryConvertToPromise(obj);
      return ret instanceof Promise || ((ret = new Promise(INTERNAL))._captureStackTrace(), 
      ret._setFulfilled(), ret._rejectionHandler0 = obj), ret;
    }, Promise.resolve = Promise.fulfilled = Promise.cast, Promise.reject = Promise.rejected = function(reason) {
      var ret = new Promise(INTERNAL);
      return ret._captureStackTrace(), ret._rejectCallback(reason, !0), ret;
    }, Promise.setScheduler = function(fn) {
      if ("function" != typeof fn) throw new TypeError("expecting a function but got " + util.classString(fn));
      return async.setScheduler(fn);
    }, Promise.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
      var haveInternalData = void 0 !== internalData, promise = haveInternalData ? internalData : new Promise(INTERNAL), target = this._target(), bitField = target._bitField;
      haveInternalData || (promise._propagateFrom(this, 3), promise._captureStackTrace(), 
      void 0 === receiver && 0 != (2097152 & this._bitField) && (receiver = 0 != (50397184 & bitField) ? this._boundValue() : target === this ? void 0 : this._boundTo), 
      this._fireEvent("promiseChained", this, promise));
      var context = getContext();
      if (0 != (50397184 & bitField)) {
        var handler, value, settler = target._settlePromiseCtx;
        0 != (33554432 & bitField) ? (value = target._rejectionHandler0, handler = didFulfill) : 0 != (16777216 & bitField) ? (value = target._fulfillmentHandler0, 
        handler = didReject, target._unsetRejectionIsUnhandled()) : (settler = target._settlePromiseLateCancellationObserver, 
        value = new CancellationError("late cancellation observer"), target._attachExtraTrace(value), 
        handler = didReject), async.invoke(settler, target, {
          handler: util.contextBind(context, handler),
          promise: promise,
          receiver: receiver,
          value: value
        });
      } else target._addCallbacks(didFulfill, didReject, promise, receiver, context);
      return promise;
    }, Promise.prototype._length = function() {
      return 65535 & this._bitField;
    }, Promise.prototype._isFateSealed = function() {
      return 0 != (117506048 & this._bitField);
    }, Promise.prototype._isFollowing = function() {
      return 67108864 == (67108864 & this._bitField);
    }, Promise.prototype._setLength = function(len) {
      this._bitField = -65536 & this._bitField | 65535 & len;
    }, Promise.prototype._setFulfilled = function() {
      this._bitField = 33554432 | this._bitField, this._fireEvent("promiseFulfilled", this);
    }, Promise.prototype._setRejected = function() {
      this._bitField = 16777216 | this._bitField, this._fireEvent("promiseRejected", this);
    }, Promise.prototype._setFollowing = function() {
      this._bitField = 67108864 | this._bitField, this._fireEvent("promiseResolved", this);
    }, Promise.prototype._setIsFinal = function() {
      this._bitField = 4194304 | this._bitField;
    }, Promise.prototype._isFinal = function() {
      return (4194304 & this._bitField) > 0;
    }, Promise.prototype._unsetCancelled = function() {
      this._bitField = -65537 & this._bitField;
    }, Promise.prototype._setCancelled = function() {
      this._bitField = 65536 | this._bitField, this._fireEvent("promiseCancelled", this);
    }, Promise.prototype._setWillBeCancelled = function() {
      this._bitField = 8388608 | this._bitField;
    }, Promise.prototype._setAsyncGuaranteed = function() {
      if (!async.hasCustomScheduler()) {
        var bitField = this._bitField;
        this._bitField = bitField | (536870912 & bitField) >> 2 ^ 134217728;
      }
    }, Promise.prototype._setNoAsyncGuarantee = function() {
      this._bitField = -134217729 & (536870912 | this._bitField);
    }, Promise.prototype._receiverAt = function(index) {
      var ret = 0 === index ? this._receiver0 : this[4 * index - 4 + 3];
      if (ret !== UNDEFINED_BINDING) return void 0 === ret && this._isBound() ? this._boundValue() : ret;
    }, Promise.prototype._promiseAt = function(index) {
      return this[4 * index - 4 + 2];
    }, Promise.prototype._fulfillmentHandlerAt = function(index) {
      return this[4 * index - 4 + 0];
    }, Promise.prototype._rejectionHandlerAt = function(index) {
      return this[4 * index - 4 + 1];
    }, Promise.prototype._boundValue = function() {}, Promise.prototype._migrateCallback0 = function(follower) {
      follower._bitField;
      var fulfill = follower._fulfillmentHandler0, reject = follower._rejectionHandler0, promise = follower._promise0, receiver = follower._receiverAt(0);
      void 0 === receiver && (receiver = UNDEFINED_BINDING), this._addCallbacks(fulfill, reject, promise, receiver, null);
    }, Promise.prototype._migrateCallbackAt = function(follower, index) {
      var fulfill = follower._fulfillmentHandlerAt(index), reject = follower._rejectionHandlerAt(index), promise = follower._promiseAt(index), receiver = follower._receiverAt(index);
      void 0 === receiver && (receiver = UNDEFINED_BINDING), this._addCallbacks(fulfill, reject, promise, receiver, null);
    }, Promise.prototype._addCallbacks = function(fulfill, reject, promise, receiver, context) {
      var index = this._length();
      if (index >= 65531 && (index = 0, this._setLength(0)), 0 === index) this._promise0 = promise, 
      this._receiver0 = receiver, "function" == typeof fulfill && (this._fulfillmentHandler0 = util.contextBind(context, fulfill)), 
      "function" == typeof reject && (this._rejectionHandler0 = util.contextBind(context, reject)); else {
        var base = 4 * index - 4;
        this[base + 2] = promise, this[base + 3] = receiver, "function" == typeof fulfill && (this[base + 0] = util.contextBind(context, fulfill)), 
        "function" == typeof reject && (this[base + 1] = util.contextBind(context, reject));
      }
      return this._setLength(index + 1), index;
    }, Promise.prototype._proxy = function(proxyable, arg) {
      this._addCallbacks(void 0, void 0, arg, proxyable, null);
    }, Promise.prototype._resolveCallback = function(value, shouldBind) {
      if (0 == (117506048 & this._bitField)) {
        if (value === this) return this._rejectCallback(makeSelfResolutionError(), !1);
        var maybePromise = tryConvertToPromise(value, this);
        if (!(maybePromise instanceof Promise)) return this._fulfill(value);
        shouldBind && this._propagateFrom(maybePromise, 2);
        var promise = maybePromise._target();
        if (promise !== this) {
          var bitField = promise._bitField;
          if (0 == (50397184 & bitField)) {
            var len = this._length();
            len > 0 && promise._migrateCallback0(this);
            for (var i = 1; i < len; ++i) promise._migrateCallbackAt(this, i);
            this._setFollowing(), this._setLength(0), this._setFollowee(maybePromise);
          } else if (0 != (33554432 & bitField)) this._fulfill(promise._value()); else if (0 != (16777216 & bitField)) this._reject(promise._reason()); else {
            var reason = new CancellationError("late cancellation observer");
            promise._attachExtraTrace(reason), this._reject(reason);
          }
        } else this._reject(makeSelfResolutionError());
      }
    }, Promise.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
      var trace = util.ensureErrorObject(reason), hasStack = trace === reason;
      if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
        var message = "a promise was rejected with a non-error: " + util.classString(reason);
        this._warn(message, !0);
      }
      this._attachExtraTrace(trace, !!synchronous && hasStack), this._reject(reason);
    }, Promise.prototype._resolveFromExecutor = function(executor) {
      if (executor !== INTERNAL) {
        var promise = this;
        this._captureStackTrace(), this._pushContext();
        var synchronous = !0, r = this._execute(executor, (function(value) {
          promise._resolveCallback(value);
        }), (function(reason) {
          promise._rejectCallback(reason, synchronous);
        }));
        synchronous = !1, this._popContext(), void 0 !== r && promise._rejectCallback(r, !0);
      }
    }, Promise.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
      var bitField = promise._bitField;
      if (0 == (65536 & bitField)) {
        var x;
        promise._pushContext(), receiver === APPLY ? value && "number" == typeof value.length ? x = tryCatch(handler).apply(this._boundValue(), value) : (x = errorObj).e = new TypeError("cannot .spread() a non-array: " + util.classString(value)) : x = tryCatch(handler).call(receiver, value);
        var promiseCreated = promise._popContext();
        0 == (65536 & (bitField = promise._bitField)) && (x === NEXT_FILTER ? promise._reject(value) : x === errorObj ? promise._rejectCallback(x.e, !1) : (debug.checkForgottenReturns(x, promiseCreated, "", promise, this), 
        promise._resolveCallback(x)));
      }
    }, Promise.prototype._target = function() {
      for (var ret = this; ret._isFollowing(); ) ret = ret._followee();
      return ret;
    }, Promise.prototype._followee = function() {
      return this._rejectionHandler0;
    }, Promise.prototype._setFollowee = function(promise) {
      this._rejectionHandler0 = promise;
    }, Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
      var isPromise = promise instanceof Promise, bitField = this._bitField, asyncGuaranteed = 0 != (134217728 & bitField);
      0 != (65536 & bitField) ? (isPromise && promise._invokeInternalOnCancel(), receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler() ? (receiver.cancelPromise = promise, 
      tryCatch(handler).call(receiver, value) === errorObj && promise._reject(errorObj.e)) : handler === reflectHandler ? promise._fulfill(reflectHandler.call(receiver)) : receiver instanceof Proxyable ? receiver._promiseCancelled(promise) : isPromise || promise instanceof PromiseArray ? promise._cancel() : receiver.cancel()) : "function" == typeof handler ? isPromise ? (asyncGuaranteed && promise._setAsyncGuaranteed(), 
      this._settlePromiseFromHandler(handler, receiver, value, promise)) : handler.call(receiver, value, promise) : receiver instanceof Proxyable ? receiver._isResolved() || (0 != (33554432 & bitField) ? receiver._promiseFulfilled(value, promise) : receiver._promiseRejected(value, promise)) : isPromise && (asyncGuaranteed && promise._setAsyncGuaranteed(), 
      0 != (33554432 & bitField) ? promise._fulfill(value) : promise._reject(value));
    }, Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
      var handler = ctx.handler, promise = ctx.promise, receiver = ctx.receiver, value = ctx.value;
      "function" == typeof handler ? promise instanceof Promise ? this._settlePromiseFromHandler(handler, receiver, value, promise) : handler.call(receiver, value, promise) : promise instanceof Promise && promise._reject(value);
    }, Promise.prototype._settlePromiseCtx = function(ctx) {
      this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
    }, Promise.prototype._settlePromise0 = function(handler, value, bitField) {
      var promise = this._promise0, receiver = this._receiverAt(0);
      this._promise0 = void 0, this._receiver0 = void 0, this._settlePromise(promise, handler, receiver, value);
    }, Promise.prototype._clearCallbackDataAtIndex = function(index) {
      var base = 4 * index - 4;
      this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
    }, Promise.prototype._fulfill = function(value) {
      var bitField = this._bitField;
      if (!((117506048 & bitField) >>> 16)) {
        if (value === this) {
          var err = makeSelfResolutionError();
          return this._attachExtraTrace(err), this._reject(err);
        }
        this._setFulfilled(), this._rejectionHandler0 = value, (65535 & bitField) > 0 && (0 != (134217728 & bitField) ? this._settlePromises() : async.settlePromises(this), 
        this._dereferenceTrace());
      }
    }, Promise.prototype._reject = function(reason) {
      var bitField = this._bitField;
      if (!((117506048 & bitField) >>> 16)) {
        if (this._setRejected(), this._fulfillmentHandler0 = reason, this._isFinal()) return async.fatalError(reason, util.isNode);
        (65535 & bitField) > 0 ? async.settlePromises(this) : this._ensurePossibleRejectionHandled();
      }
    }, Promise.prototype._fulfillPromises = function(len, value) {
      for (var i = 1; i < len; i++) {
        var handler = this._fulfillmentHandlerAt(i), promise = this._promiseAt(i), receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i), this._settlePromise(promise, handler, receiver, value);
      }
    }, Promise.prototype._rejectPromises = function(len, reason) {
      for (var i = 1; i < len; i++) {
        var handler = this._rejectionHandlerAt(i), promise = this._promiseAt(i), receiver = this._receiverAt(i);
        this._clearCallbackDataAtIndex(i), this._settlePromise(promise, handler, receiver, reason);
      }
    }, Promise.prototype._settlePromises = function() {
      var bitField = this._bitField, len = 65535 & bitField;
      if (len > 0) {
        if (0 != (16842752 & bitField)) {
          var reason = this._fulfillmentHandler0;
          this._settlePromise0(this._rejectionHandler0, reason, bitField), this._rejectPromises(len, reason);
        } else {
          var value = this._rejectionHandler0;
          this._settlePromise0(this._fulfillmentHandler0, value, bitField), this._fulfillPromises(len, value);
        }
        this._setLength(0);
      }
      this._clearCancellationData();
    }, Promise.prototype._settledValue = function() {
      var bitField = this._bitField;
      return 0 != (33554432 & bitField) ? this._rejectionHandler0 : 0 != (16777216 & bitField) ? this._fulfillmentHandler0 : void 0;
    }, "undefined" != typeof Symbol && Symbol.toStringTag && es5.defineProperty(Promise.prototype, Symbol.toStringTag, {
      get: function() {
        return "Object";
      }
    }), Promise.defer = Promise.pending = function() {
      return debug.deprecated("Promise.defer", "new Promise"), {
        promise: new Promise(INTERNAL),
        resolve: deferResolve,
        reject: deferReject
      };
    }, util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError), 
    __webpack_require__(16)(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug), 
    __webpack_require__(17)(Promise, INTERNAL, tryConvertToPromise, debug), __webpack_require__(18)(Promise, PromiseArray, apiRejection, debug), 
    __webpack_require__(19)(Promise), __webpack_require__(20)(Promise), __webpack_require__(21)(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async), 
    Promise.Promise = Promise, Promise.version = "3.7.2", __webpack_require__(22)(Promise), 
    __webpack_require__(23)(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug), 
    __webpack_require__(24)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), 
    __webpack_require__(25)(Promise), __webpack_require__(26)(Promise, INTERNAL), __webpack_require__(27)(Promise, PromiseArray, tryConvertToPromise, apiRejection), 
    __webpack_require__(28)(Promise, INTERNAL, tryConvertToPromise, apiRejection), __webpack_require__(29)(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug), 
    __webpack_require__(30)(Promise, PromiseArray, debug), __webpack_require__(31)(Promise, PromiseArray, apiRejection), 
    __webpack_require__(32)(Promise, INTERNAL, debug), __webpack_require__(33)(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug), 
    __webpack_require__(34)(Promise), __webpack_require__(35)(Promise, INTERNAL), __webpack_require__(36)(Promise, INTERNAL), 
    util.toFastProperties(Promise), util.toFastProperties(Promise.prototype), fillTypes({
      a: 1
    }), fillTypes({
      b: 2
    }), fillTypes({
      c: 3
    }), fillTypes(1), fillTypes((function() {})), fillTypes(void 0), fillTypes(!1), 
    fillTypes(new Promise(INTERNAL)), debug.setBounds(Async.firstLineError, util.lastLineError), 
    Promise;
  };
}, function(module, exports, __webpack_require__) {
  var firstLineError;
  try {
    throw new Error;
  } catch (e) {
    firstLineError = e;
  }
  var schedule = __webpack_require__(9), Queue = __webpack_require__(10);
  function Async() {
    this._customScheduler = !1, this._isTickUsed = !1, this._lateQueue = new Queue(16), 
    this._normalQueue = new Queue(16), this._haveDrainedQueues = !1;
    var self = this;
    this.drainQueues = function() {
      self._drainQueues();
    }, this._schedule = schedule;
  }
  function _drainQueue(queue) {
    for (;queue.length() > 0; ) _drainQueueStep(queue);
  }
  function _drainQueueStep(queue) {
    var fn = queue.shift();
    if ("function" != typeof fn) fn._settlePromises(); else {
      var receiver = queue.shift(), arg = queue.shift();
      fn.call(receiver, arg);
    }
  }
  Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    return this._schedule = fn, this._customScheduler = !0, prev;
  }, Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
  }, Async.prototype.haveItemsQueued = function() {
    return this._isTickUsed || this._haveDrainedQueues;
  }, Async.prototype.fatalError = function(e, isNode) {
    isNode ? (process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n"), 
    process.exit(2)) : this.throwLater(e);
  }, Async.prototype.throwLater = function(fn, arg) {
    if (1 === arguments.length && (arg = fn, fn = function() {
      throw arg;
    }), "undefined" != typeof setTimeout) setTimeout((function() {
      fn(arg);
    }), 0); else try {
      this._schedule((function() {
        fn(arg);
      }));
    } catch (e) {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    }
  }, Async.prototype.invokeLater = function(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg), this._queueTick();
  }, Async.prototype.invoke = function(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg), this._queueTick();
  }, Async.prototype.settlePromises = function(promise) {
    this._normalQueue._pushOne(promise), this._queueTick();
  }, Async.prototype._drainQueues = function() {
    _drainQueue(this._normalQueue), this._reset(), this._haveDrainedQueues = !0, _drainQueue(this._lateQueue);
  }, Async.prototype._queueTick = function() {
    this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues));
  }, Async.prototype._reset = function() {
    this._isTickUsed = !1;
  }, module.exports = Async, module.exports.firstLineError = firstLineError;
}, function(module, exports, __webpack_require__) {
  var schedule, util = __webpack_require__(0), NativePromise = util.getNativePromise();
  if (util.isNode && "undefined" == typeof MutationObserver) {
    var GlobalSetImmediate = global.setImmediate, ProcessNextTick = process.nextTick;
    schedule = util.isRecentNode ? function(fn) {
      GlobalSetImmediate.call(global, fn);
    } : function(fn) {
      ProcessNextTick.call(process, fn);
    };
  } else if ("function" == typeof NativePromise && "function" == typeof NativePromise.resolve) {
    var nativePromise = NativePromise.resolve();
    schedule = function(fn) {
      nativePromise.then(fn);
    };
  } else schedule = "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && (window.navigator.standalone || window.cordova) || !("classList" in document.documentElement) ? "undefined" != typeof setImmediate ? function(fn) {
    setImmediate(fn);
  } : "undefined" != typeof setTimeout ? function(fn) {
    setTimeout(fn, 0);
  } : function() {
    throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
  } : function() {
    var div = document.createElement("div"), opts = {
      attributes: !0
    }, toggleScheduled = !1, div2 = document.createElement("div");
    new MutationObserver((function() {
      div.classList.toggle("foo"), toggleScheduled = !1;
    })).observe(div2, opts);
    return function(fn) {
      var o = new MutationObserver((function() {
        o.disconnect(), fn();
      }));
      o.observe(div, opts), toggleScheduled || (toggleScheduled = !0, div2.classList.toggle("foo"));
    };
  }();
  module.exports = schedule;
}, function(module, exports, __webpack_require__) {
  function Queue(capacity) {
    this._capacity = capacity, this._length = 0, this._front = 0;
  }
  Queue.prototype._willBeOverCapacity = function(size) {
    return this._capacity < size;
  }, Queue.prototype._pushOne = function(arg) {
    var length = this.length();
    this._checkCapacity(length + 1), this[this._front + length & this._capacity - 1] = arg, 
    this._length = length + 1;
  }, Queue.prototype.push = function(fn, receiver, arg) {
    var length = this.length() + 3;
    if (this._willBeOverCapacity(length)) return this._pushOne(fn), this._pushOne(receiver), 
    void this._pushOne(arg);
    var j = this._front + length - 3;
    this._checkCapacity(length);
    var wrapMask = this._capacity - 1;
    this[j + 0 & wrapMask] = fn, this[j + 1 & wrapMask] = receiver, this[j + 2 & wrapMask] = arg, 
    this._length = length;
  }, Queue.prototype.shift = function() {
    var front = this._front, ret = this[front];
    return this[front] = void 0, this._front = front + 1 & this._capacity - 1, this._length--, 
    ret;
  }, Queue.prototype.length = function() {
    return this._length;
  }, Queue.prototype._checkCapacity = function(size) {
    this._capacity < size && this._resizeTo(this._capacity << 1);
  }, Queue.prototype._resizeTo = function(capacity) {
    var oldCapacity = this._capacity;
    this._capacity = capacity, function(src, srcIndex, dst, dstIndex, len) {
      for (var j = 0; j < len; ++j) dst[j + dstIndex] = src[j + srcIndex], src[j + srcIndex] = void 0;
    }(this, 0, this, oldCapacity, this._front + this._length & oldCapacity - 1);
  }, module.exports = Queue;
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL) {
    var util = __webpack_require__(0), errorObj = util.errorObj, isObject = util.isObject;
    var hasProp = {}.hasOwnProperty;
    return function(obj, context) {
      if (isObject(obj)) {
        if (obj instanceof Promise) return obj;
        var then = function(obj) {
          try {
            return function(obj) {
              return obj.then;
            }(obj);
          } catch (e) {
            return errorObj.e = e, errorObj;
          }
        }(obj);
        if (then === errorObj) {
          context && context._pushContext();
          var ret = Promise.reject(then.e);
          return context && context._popContext(), ret;
        }
        if ("function" == typeof then) {
          if (function(obj) {
            try {
              return hasProp.call(obj, "_promise0");
            } catch (e) {
              return !1;
            }
          }(obj)) {
            ret = new Promise(INTERNAL);
            return obj._then(ret._fulfill, ret._reject, void 0, ret, null), ret;
          }
          return function(x, then, context) {
            var promise = new Promise(INTERNAL), ret = promise;
            context && context._pushContext();
            promise._captureStackTrace(), context && context._popContext();
            var result = util.tryCatch(then).call(x, (function(value) {
              if (!promise) return;
              promise._resolveCallback(value), promise = null;
            }), (function(reason) {
              if (!promise) return;
              promise._rejectCallback(reason, !1, !0), promise = null;
            }));
            !1, promise && result === errorObj && (promise._rejectCallback(result.e, !0, !0), 
            promise = null);
            return ret;
          }(obj, then, context);
        }
      }
      return obj;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
    var util = __webpack_require__(0);
    util.isArray;
    function PromiseArray(values) {
      var promise = this._promise = new Promise(INTERNAL);
      values instanceof Promise && (promise._propagateFrom(values, 3), values.suppressUnhandledRejections()), 
      promise._setOnCancel(this), this._values = values, this._length = 0, this._totalResolved = 0, 
      this._init(void 0, -2);
    }
    return util.inherits(PromiseArray, Proxyable), PromiseArray.prototype.length = function() {
      return this._length;
    }, PromiseArray.prototype.promise = function() {
      return this._promise;
    }, PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
      var values = tryConvertToPromise(this._values, this._promise);
      if (values instanceof Promise) {
        var bitField = (values = values._target())._bitField;
        if (this._values = values, 0 == (50397184 & bitField)) return this._promise._setAsyncGuaranteed(), 
        values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
        if (0 == (33554432 & bitField)) return 0 != (16777216 & bitField) ? this._reject(values._reason()) : this._cancel();
        values = values._value();
      }
      if (null !== (values = util.asArray(values))) 0 !== values.length ? this._iterate(values) : -5 === resolveValueIfEmpty ? this._resolveEmptyArray() : this._resolve(function(val) {
        switch (val) {
         case -2:
          return [];

         case -3:
          return {};

         case -6:
          return new Map;
        }
      }(resolveValueIfEmpty)); else {
        var err = apiRejection("expecting an array or an iterable object but got " + util.classString(values)).reason();
        this._promise._rejectCallback(err, !1);
      }
    }, PromiseArray.prototype._iterate = function(values) {
      var len = this.getActualLength(values.length);
      this._length = len, this._values = this.shouldCopyValues() ? new Array(len) : this._values;
      for (var result = this._promise, isResolved = !1, bitField = null, i = 0; i < len; ++i) {
        var maybePromise = tryConvertToPromise(values[i], result);
        bitField = maybePromise instanceof Promise ? (maybePromise = maybePromise._target())._bitField : null, 
        isResolved ? null !== bitField && maybePromise.suppressUnhandledRejections() : null !== bitField ? 0 == (50397184 & bitField) ? (maybePromise._proxy(this, i), 
        this._values[i] = maybePromise) : isResolved = 0 != (33554432 & bitField) ? this._promiseFulfilled(maybePromise._value(), i) : 0 != (16777216 & bitField) ? this._promiseRejected(maybePromise._reason(), i) : this._promiseCancelled(i) : isResolved = this._promiseFulfilled(maybePromise, i);
      }
      isResolved || result._setAsyncGuaranteed();
    }, PromiseArray.prototype._isResolved = function() {
      return null === this._values;
    }, PromiseArray.prototype._resolve = function(value) {
      this._values = null, this._promise._fulfill(value);
    }, PromiseArray.prototype._cancel = function() {
      !this._isResolved() && this._promise._isCancellable() && (this._values = null, this._promise._cancel());
    }, PromiseArray.prototype._reject = function(reason) {
      this._values = null, this._promise._rejectCallback(reason, !1);
    }, PromiseArray.prototype._promiseFulfilled = function(value, index) {
      return this._values[index] = value, ++this._totalResolved >= this._length && (this._resolve(this._values), 
      !0);
    }, PromiseArray.prototype._promiseCancelled = function() {
      return this._cancel(), !0;
    }, PromiseArray.prototype._promiseRejected = function(reason) {
      return this._totalResolved++, this._reject(reason), !0;
    }, PromiseArray.prototype._resultCancelled = function() {
      if (!this._isResolved()) {
        var values = this._values;
        if (this._cancel(), values instanceof Promise) values.cancel(); else for (var i = 0; i < values.length; ++i) values[i] instanceof Promise && values[i].cancel();
      }
    }, PromiseArray.prototype.shouldCopyValues = function() {
      return !0;
    }, PromiseArray.prototype.getActualLength = function(len) {
      return len;
    }, PromiseArray;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise) {
    var longStackTraces = !1, contextStack = [];
    function Context() {
      this._trace = new Context.CapturedTrace(peekContext());
    }
    function peekContext() {
      var lastIndex = contextStack.length - 1;
      if (lastIndex >= 0) return contextStack[lastIndex];
    }
    return Promise.prototype._promiseCreated = function() {}, Promise.prototype._pushContext = function() {}, 
    Promise.prototype._popContext = function() {
      return null;
    }, Promise._peekContext = Promise.prototype._peekContext = function() {}, Context.prototype._pushContext = function() {
      void 0 !== this._trace && (this._trace._promiseCreated = null, contextStack.push(this._trace));
    }, Context.prototype._popContext = function() {
      if (void 0 !== this._trace) {
        var trace = contextStack.pop(), ret = trace._promiseCreated;
        return trace._promiseCreated = null, ret;
      }
      return null;
    }, Context.CapturedTrace = null, Context.create = function() {
      if (longStackTraces) return new Context;
    }, Context.deactivateLongStackTraces = function() {}, Context.activateLongStackTraces = function() {
      var Promise_pushContext = Promise.prototype._pushContext, Promise_popContext = Promise.prototype._popContext, Promise_PeekContext = Promise._peekContext, Promise_peekContext = Promise.prototype._peekContext, Promise_promiseCreated = Promise.prototype._promiseCreated;
      Context.deactivateLongStackTraces = function() {
        Promise.prototype._pushContext = Promise_pushContext, Promise.prototype._popContext = Promise_popContext, 
        Promise._peekContext = Promise_PeekContext, Promise.prototype._peekContext = Promise_peekContext, 
        Promise.prototype._promiseCreated = Promise_promiseCreated, longStackTraces = !1;
      }, longStackTraces = !0, Promise.prototype._pushContext = Context.prototype._pushContext, 
      Promise.prototype._popContext = Context.prototype._popContext, Promise._peekContext = Promise.prototype._peekContext = peekContext, 
      Promise.prototype._promiseCreated = function() {
        var ctx = this._peekContext();
        ctx && null == ctx._promiseCreated && (ctx._promiseCreated = this);
      };
    }, Context;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, Context, enableAsyncHooks, disableAsyncHooks) {
    var unhandledRejectionHandled, possiblyUnhandledRejection, printWarning, deferUnhandledRejectionCheck, async = Promise._async, Warning = __webpack_require__(1).Warning, util = __webpack_require__(0), es5 = __webpack_require__(2), canAttachTrace = util.canAttachTrace, bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/, nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/, parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/, stackFramePattern = null, formatStack = null, indentStackFrames = !1, debugging = !(0 == util.env("BLUEBIRD_DEBUG") || !util.env("BLUEBIRD_DEBUG") && "development" !== util.env("NODE_ENV")), warnings = !(0 == util.env("BLUEBIRD_WARNINGS") || !debugging && !util.env("BLUEBIRD_WARNINGS")), longStackTraces = !(0 == util.env("BLUEBIRD_LONG_STACK_TRACES") || !debugging && !util.env("BLUEBIRD_LONG_STACK_TRACES")), wForgottenReturn = 0 != util.env("BLUEBIRD_W_FORGOTTEN_RETURN") && (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));
    !function() {
      var promises = [];
      function unhandledRejectionCheck() {
        for (var i = 0; i < promises.length; ++i) promises[i]._notifyUnhandledRejection();
        unhandledRejectionClear();
      }
      function unhandledRejectionClear() {
        promises.length = 0;
      }
      deferUnhandledRejectionCheck = function(promise) {
        promises.push(promise), setTimeout(unhandledRejectionCheck, 1);
      }, es5.defineProperty(Promise, "_unhandledRejectionCheck", {
        value: unhandledRejectionCheck
      }), es5.defineProperty(Promise, "_unhandledRejectionClear", {
        value: unhandledRejectionClear
      });
    }(), Promise.prototype.suppressUnhandledRejections = function() {
      var target = this._target();
      target._bitField = -1048577 & target._bitField | 524288;
    }, Promise.prototype._ensurePossibleRejectionHandled = function() {
      0 == (524288 & this._bitField) && (this._setRejectionIsUnhandled(), deferUnhandledRejectionCheck(this));
    }, Promise.prototype._notifyUnhandledRejectionIsHandled = function() {
      fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, void 0, this);
    }, Promise.prototype._setReturnedNonUndefined = function() {
      this._bitField = 268435456 | this._bitField;
    }, Promise.prototype._returnedNonUndefined = function() {
      return 0 != (268435456 & this._bitField);
    }, Promise.prototype._notifyUnhandledRejection = function() {
      if (this._isRejectionUnhandled()) {
        var reason = this._settledValue();
        this._setUnhandledRejectionIsNotified(), fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
      }
    }, Promise.prototype._setUnhandledRejectionIsNotified = function() {
      this._bitField = 262144 | this._bitField;
    }, Promise.prototype._unsetUnhandledRejectionIsNotified = function() {
      this._bitField = -262145 & this._bitField;
    }, Promise.prototype._isUnhandledRejectionNotified = function() {
      return (262144 & this._bitField) > 0;
    }, Promise.prototype._setRejectionIsUnhandled = function() {
      this._bitField = 1048576 | this._bitField;
    }, Promise.prototype._unsetRejectionIsUnhandled = function() {
      this._bitField = -1048577 & this._bitField, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), 
      this._notifyUnhandledRejectionIsHandled());
    }, Promise.prototype._isRejectionUnhandled = function() {
      return (1048576 & this._bitField) > 0;
    }, Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
      return warn(message, shouldUseOwnTrace, promise || this);
    }, Promise.onPossiblyUnhandledRejection = function(fn) {
      var context = Promise._getContext();
      possiblyUnhandledRejection = util.contextBind(context, fn);
    }, Promise.onUnhandledRejectionHandled = function(fn) {
      var context = Promise._getContext();
      unhandledRejectionHandled = util.contextBind(context, fn);
    };
    var disableLongStackTraces = function() {};
    Promise.longStackTraces = function() {
      if (async.haveItemsQueued() && !config.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
      if (!config.longStackTraces && longStackTracesIsSupported()) {
        var Promise_captureStackTrace = Promise.prototype._captureStackTrace, Promise_attachExtraTrace = Promise.prototype._attachExtraTrace, Promise_dereferenceTrace = Promise.prototype._dereferenceTrace;
        config.longStackTraces = !0, disableLongStackTraces = function() {
          if (async.haveItemsQueued() && !config.longStackTraces) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");
          Promise.prototype._captureStackTrace = Promise_captureStackTrace, Promise.prototype._attachExtraTrace = Promise_attachExtraTrace, 
          Promise.prototype._dereferenceTrace = Promise_dereferenceTrace, Context.deactivateLongStackTraces(), 
          config.longStackTraces = !1;
        }, Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace, Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace, 
        Promise.prototype._dereferenceTrace = longStackTracesDereferenceTrace, Context.activateLongStackTraces();
      }
    }, Promise.hasLongStackTraces = function() {
      return config.longStackTraces && longStackTracesIsSupported();
    };
    var legacyHandlers = {
      unhandledrejection: {
        before: function() {
          var ret = util.global.onunhandledrejection;
          return util.global.onunhandledrejection = null, ret;
        },
        after: function(fn) {
          util.global.onunhandledrejection = fn;
        }
      },
      rejectionhandled: {
        before: function() {
          var ret = util.global.onrejectionhandled;
          return util.global.onrejectionhandled = null, ret;
        },
        after: function(fn) {
          util.global.onrejectionhandled = fn;
        }
      }
    }, fireDomEvent = function() {
      var dispatch = function(legacy, e) {
        if (!legacy) return !util.global.dispatchEvent(e);
        var fn;
        try {
          return fn = legacy.before(), !util.global.dispatchEvent(e);
        } finally {
          legacy.after(fn);
        }
      };
      try {
        if ("function" == typeof CustomEvent) {
          var event = new CustomEvent("CustomEvent");
          return util.global.dispatchEvent(event), function(name, event) {
            name = name.toLowerCase();
            var domEvent = new CustomEvent(name, {
              detail: event,
              cancelable: !0
            });
            return es5.defineProperty(domEvent, "promise", {
              value: event.promise
            }), es5.defineProperty(domEvent, "reason", {
              value: event.reason
            }), dispatch(legacyHandlers[name], domEvent);
          };
        }
        if ("function" == typeof Event) {
          event = new Event("CustomEvent");
          return util.global.dispatchEvent(event), function(name, event) {
            name = name.toLowerCase();
            var domEvent = new Event(name, {
              cancelable: !0
            });
            return domEvent.detail = event, es5.defineProperty(domEvent, "promise", {
              value: event.promise
            }), es5.defineProperty(domEvent, "reason", {
              value: event.reason
            }), dispatch(legacyHandlers[name], domEvent);
          };
        }
        return (event = document.createEvent("CustomEvent")).initCustomEvent("testingtheevent", !1, !0, {}), 
        util.global.dispatchEvent(event), function(name, event) {
          name = name.toLowerCase();
          var domEvent = document.createEvent("CustomEvent");
          return domEvent.initCustomEvent(name, !1, !0, event), dispatch(legacyHandlers[name], domEvent);
        };
      } catch (e) {}
      return function() {
        return !1;
      };
    }(), fireGlobalEvent = util.isNode ? function() {
      return process.emit.apply(process, arguments);
    } : util.global ? function(name) {
      var methodName = "on" + name.toLowerCase(), method = util.global[methodName];
      return !!method && (method.apply(util.global, [].slice.call(arguments, 1)), !0);
    } : function() {
      return !1;
    };
    function generatePromiseLifecycleEventObject(name, promise) {
      return {
        promise: promise
      };
    }
    var eventToObjectGenerator = {
      promiseCreated: generatePromiseLifecycleEventObject,
      promiseFulfilled: generatePromiseLifecycleEventObject,
      promiseRejected: generatePromiseLifecycleEventObject,
      promiseResolved: generatePromiseLifecycleEventObject,
      promiseCancelled: generatePromiseLifecycleEventObject,
      promiseChained: function(name, promise, child) {
        return {
          promise: promise,
          child: child
        };
      },
      warning: function(name, warning) {
        return {
          warning: warning
        };
      },
      unhandledRejection: function(name, reason, promise) {
        return {
          reason: reason,
          promise: promise
        };
      },
      rejectionHandled: generatePromiseLifecycleEventObject
    }, activeFireEvent = function(name) {
      var globalEventFired = !1;
      try {
        globalEventFired = fireGlobalEvent.apply(null, arguments);
      } catch (e) {
        async.throwLater(e), globalEventFired = !0;
      }
      var domEventFired = !1;
      try {
        domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
      } catch (e) {
        async.throwLater(e), domEventFired = !0;
      }
      return domEventFired || globalEventFired;
    };
    function defaultFireEvent() {
      return !1;
    }
    function cancellationExecute(executor, resolve, reject) {
      var promise = this;
      try {
        executor(resolve, reject, (function(onCancel) {
          if ("function" != typeof onCancel) throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));
          promise._attachCancellationCallback(onCancel);
        }));
      } catch (e) {
        return e;
      }
    }
    function cancellationAttachCancellationCallback(onCancel) {
      if (!this._isCancellable()) return this;
      var previousOnCancel = this._onCancel();
      void 0 !== previousOnCancel ? util.isArray(previousOnCancel) ? previousOnCancel.push(onCancel) : this._setOnCancel([ previousOnCancel, onCancel ]) : this._setOnCancel(onCancel);
    }
    function cancellationOnCancel() {
      return this._onCancelField;
    }
    function cancellationSetOnCancel(onCancel) {
      this._onCancelField = onCancel;
    }
    function cancellationClearCancellationData() {
      this._cancellationParent = void 0, this._onCancelField = void 0;
    }
    function cancellationPropagateFrom(parent, flags) {
      if (0 != (1 & flags)) {
        this._cancellationParent = parent;
        var branchesRemainingToCancel = parent._branchesRemainingToCancel;
        void 0 === branchesRemainingToCancel && (branchesRemainingToCancel = 0), parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
      }
      0 != (2 & flags) && parent._isBound() && this._setBoundTo(parent._boundTo);
    }
    Promise.config = function(opts) {
      if ("longStackTraces" in (opts = Object(opts)) && (opts.longStackTraces ? Promise.longStackTraces() : !opts.longStackTraces && Promise.hasLongStackTraces() && disableLongStackTraces()), 
      "warnings" in opts) {
        var warningsOption = opts.warnings;
        config.warnings = !!warningsOption, wForgottenReturn = config.warnings, util.isObject(warningsOption) && "wForgottenReturn" in warningsOption && (wForgottenReturn = !!warningsOption.wForgottenReturn);
      }
      if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
        if (async.haveItemsQueued()) throw new Error("cannot enable cancellation after promises are in use");
        Promise.prototype._clearCancellationData = cancellationClearCancellationData, Promise.prototype._propagateFrom = cancellationPropagateFrom, 
        Promise.prototype._onCancel = cancellationOnCancel, Promise.prototype._setOnCancel = cancellationSetOnCancel, 
        Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback, 
        Promise.prototype._execute = cancellationExecute, propagateFromFunction = cancellationPropagateFrom, 
        config.cancellation = !0;
      }
      if ("monitoring" in opts && (opts.monitoring && !config.monitoring ? (config.monitoring = !0, 
      Promise.prototype._fireEvent = activeFireEvent) : !opts.monitoring && config.monitoring && (config.monitoring = !1, 
      Promise.prototype._fireEvent = defaultFireEvent)), "asyncHooks" in opts && util.nodeSupportsAsyncResource) {
        var prev = config.asyncHooks, cur = !!opts.asyncHooks;
        prev !== cur && (config.asyncHooks = cur, cur ? enableAsyncHooks() : disableAsyncHooks());
      }
      return Promise;
    }, Promise.prototype._fireEvent = defaultFireEvent, Promise.prototype._execute = function(executor, resolve, reject) {
      try {
        executor(resolve, reject);
      } catch (e) {
        return e;
      }
    }, Promise.prototype._onCancel = function() {}, Promise.prototype._setOnCancel = function(handler) {}, 
    Promise.prototype._attachCancellationCallback = function(onCancel) {}, Promise.prototype._captureStackTrace = function() {}, 
    Promise.prototype._attachExtraTrace = function() {}, Promise.prototype._dereferenceTrace = function() {}, 
    Promise.prototype._clearCancellationData = function() {}, Promise.prototype._propagateFrom = function(parent, flags) {};
    var propagateFromFunction = function(parent, flags) {
      0 != (2 & flags) && parent._isBound() && this._setBoundTo(parent._boundTo);
    };
    function boundValueFunction() {
      var ret = this._boundTo;
      return void 0 !== ret && ret instanceof Promise ? ret.isFulfilled() ? ret.value() : void 0 : ret;
    }
    function longStackTracesCaptureStackTrace() {
      this._trace = new CapturedTrace(this._peekContext());
    }
    function longStackTracesAttachExtraTrace(error, ignoreSelf) {
      if (canAttachTrace(error)) {
        var trace = this._trace;
        if (void 0 !== trace && ignoreSelf && (trace = trace._parent), void 0 !== trace) trace.attachExtraTrace(error); else if (!error.__stackCleaned__) {
          var parsed = parseStackAndMessage(error);
          util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n")), 
          util.notEnumerableProp(error, "__stackCleaned__", !0);
        }
      }
    }
    function longStackTracesDereferenceTrace() {
      this._trace = void 0;
    }
    function warn(message, shouldUseOwnTrace, promise) {
      if (config.warnings) {
        var ctx, warning = new Warning(message);
        if (shouldUseOwnTrace) promise._attachExtraTrace(warning); else if (config.longStackTraces && (ctx = Promise._peekContext())) ctx.attachExtraTrace(warning); else {
          var parsed = parseStackAndMessage(warning);
          warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
        }
        activeFireEvent("warning", warning) || formatAndLogError(warning, "", !0);
      }
    }
    function cleanStack(stack) {
      for (var ret = [], i = 0; i < stack.length; ++i) {
        var line = stack[i], isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line), isInternalFrame = isTraceLine && shouldIgnore(line);
        isTraceLine && !isInternalFrame && (indentStackFrames && " " !== line.charAt(0) && (line = "    " + line), 
        ret.push(line));
      }
      return ret;
    }
    function parseStackAndMessage(error) {
      var stack = error.stack, message = error.toString();
      return stack = "string" == typeof stack && stack.length > 0 ? function(error) {
        for (var stack = error.stack.replace(/\s+$/g, "").split("\n"), i = 0; i < stack.length; ++i) {
          var line = stack[i];
          if ("    (No stack trace)" === line || stackFramePattern.test(line)) break;
        }
        return i > 0 && "SyntaxError" != error.name && (stack = stack.slice(i)), stack;
      }(error) : [ "    (No stack trace)" ], {
        message: message,
        stack: "SyntaxError" == error.name ? stack : cleanStack(stack)
      };
    }
    function formatAndLogError(error, title, isSoft) {
      if ("undefined" != typeof console) {
        var message;
        if (util.isObject(error)) {
          var stack = error.stack;
          message = title + formatStack(stack, error);
        } else message = title + String(error);
        "function" == typeof printWarning ? printWarning(message, isSoft) : "function" != typeof console.log && "object" != typeof console.log || console.log(message);
      }
    }
    function fireRejectionEvent(name, localHandler, reason, promise) {
      var localEventFired = !1;
      try {
        "function" == typeof localHandler && (localEventFired = !0, "rejectionHandled" === name ? localHandler(promise) : localHandler(reason, promise));
      } catch (e) {
        async.throwLater(e);
      }
      "unhandledRejection" === name ? activeFireEvent(name, reason, promise) || localEventFired || formatAndLogError(reason, "Unhandled rejection ") : activeFireEvent(name, promise);
    }
    function formatNonError(obj) {
      var str;
      if ("function" == typeof obj) str = "[function " + (obj.name || "anonymous") + "]"; else {
        str = obj && "function" == typeof obj.toString ? obj.toString() : util.toString(obj);
        if (/\[object [a-zA-Z0-9$_]+\]/.test(str)) try {
          str = JSON.stringify(obj);
        } catch (e) {}
        0 === str.length && (str = "(empty array)");
      }
      return "(<" + function(str) {
        if (str.length < 41) return str;
        return str.substr(0, 38) + "...";
      }(str) + ">, no stack trace)";
    }
    function longStackTracesIsSupported() {
      return "function" == typeof captureStackTrace;
    }
    var shouldIgnore = function() {
      return !1;
    }, parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
    function parseLineInfo(line) {
      var matches = line.match(parseLineInfoRegex);
      if (matches) return {
        fileName: matches[1],
        line: parseInt(matches[2], 10)
      };
    }
    function CapturedTrace(parent) {
      this._parent = parent, this._promisesCreated = 0;
      var length = this._length = 1 + (void 0 === parent ? 0 : parent._length);
      captureStackTrace(this, CapturedTrace), length > 32 && this.uncycle();
    }
    util.inherits(CapturedTrace, Error), Context.CapturedTrace = CapturedTrace, CapturedTrace.prototype.uncycle = function() {
      var length = this._length;
      if (!(length < 2)) {
        for (var nodes = [], stackToIndex = {}, i = 0, node = this; void 0 !== node; ++i) nodes.push(node), 
        node = node._parent;
        for (i = (length = this._length = i) - 1; i >= 0; --i) {
          var stack = nodes[i].stack;
          void 0 === stackToIndex[stack] && (stackToIndex[stack] = i);
        }
        for (i = 0; i < length; ++i) {
          var index = stackToIndex[nodes[i].stack];
          if (void 0 !== index && index !== i) {
            index > 0 && (nodes[index - 1]._parent = void 0, nodes[index - 1]._length = 1), 
            nodes[i]._parent = void 0, nodes[i]._length = 1;
            var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;
            index < length - 1 ? (cycleEdgeNode._parent = nodes[index + 1], cycleEdgeNode._parent.uncycle(), 
            cycleEdgeNode._length = cycleEdgeNode._parent._length + 1) : (cycleEdgeNode._parent = void 0, 
            cycleEdgeNode._length = 1);
            for (var currentChildLength = cycleEdgeNode._length + 1, j = i - 2; j >= 0; --j) nodes[j]._length = currentChildLength, 
            currentChildLength++;
            return;
          }
        }
      }
    }, CapturedTrace.prototype.attachExtraTrace = function(error) {
      if (!error.__stackCleaned__) {
        this.uncycle();
        for (var parsed = parseStackAndMessage(error), message = parsed.message, stacks = [ parsed.stack ], trace = this; void 0 !== trace; ) stacks.push(cleanStack(trace.stack.split("\n"))), 
        trace = trace._parent;
        !function(stacks) {
          for (var current = stacks[0], i = 1; i < stacks.length; ++i) {
            for (var prev = stacks[i], currentLastIndex = current.length - 1, currentLastLine = current[currentLastIndex], commonRootMeetPoint = -1, j = prev.length - 1; j >= 0; --j) if (prev[j] === currentLastLine) {
              commonRootMeetPoint = j;
              break;
            }
            for (j = commonRootMeetPoint; j >= 0; --j) {
              var line = prev[j];
              if (current[currentLastIndex] !== line) break;
              current.pop(), currentLastIndex--;
            }
            current = prev;
          }
        }(stacks), function(stacks) {
          for (var i = 0; i < stacks.length; ++i) (0 === stacks[i].length || i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0]) && (stacks.splice(i, 1), 
          i--);
        }(stacks), util.notEnumerableProp(error, "stack", function(message, stacks) {
          for (var i = 0; i < stacks.length - 1; ++i) stacks[i].push("From previous event:"), 
          stacks[i] = stacks[i].join("\n");
          return i < stacks.length && (stacks[i] = stacks[i].join("\n")), message + "\n" + stacks.join("\n");
        }(message, stacks)), util.notEnumerableProp(error, "__stackCleaned__", !0);
      }
    };
    var captureStackTrace = function() {
      var v8stackFramePattern = /^\s*at\s*/, v8stackFormatter = function(stack, error) {
        return "string" == typeof stack ? stack : void 0 !== error.name && void 0 !== error.message ? error.toString() : formatNonError(error);
      };
      if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
        Error.stackTraceLimit += 6, stackFramePattern = v8stackFramePattern, formatStack = v8stackFormatter;
        var captureStackTrace = Error.captureStackTrace;
        return shouldIgnore = function(line) {
          return bluebirdFramePattern.test(line);
        }, function(receiver, ignoreUntil) {
          Error.stackTraceLimit += 6, captureStackTrace(receiver, ignoreUntil), Error.stackTraceLimit -= 6;
        };
      }
      var hasStackAfterThrow, err = new Error;
      if ("string" == typeof err.stack && err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return stackFramePattern = /@/, 
      formatStack = v8stackFormatter, indentStackFrames = !0, function(o) {
        o.stack = (new Error).stack;
      };
      try {
        throw new Error;
      } catch (e) {
        hasStackAfterThrow = "stack" in e;
      }
      return !("stack" in err) && hasStackAfterThrow && "number" == typeof Error.stackTraceLimit ? (stackFramePattern = v8stackFramePattern, 
      formatStack = v8stackFormatter, function(o) {
        Error.stackTraceLimit += 6;
        try {
          throw new Error;
        } catch (e) {
          o.stack = e.stack;
        }
        Error.stackTraceLimit -= 6;
      }) : (formatStack = function(stack, error) {
        return "string" == typeof stack ? stack : "object" != typeof error && "function" != typeof error || void 0 === error.name || void 0 === error.message ? formatNonError(error) : error.toString();
      }, null);
    }();
    "undefined" != typeof console && void 0 !== console.warn && (printWarning = function(message) {
      console.warn(message);
    }, util.isNode && process.stderr.isTTY ? printWarning = function(message, isSoft) {
      var color = isSoft ? "[33m" : "[31m";
      console.warn(color + message + "[0m\n");
    } : util.isNode || "string" != typeof (new Error).stack || (printWarning = function(message, isSoft) {
      console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
    }));
    var config = {
      warnings: warnings,
      longStackTraces: !1,
      cancellation: !1,
      monitoring: !1,
      asyncHooks: !1
    };
    return longStackTraces && Promise.longStackTraces(), {
      asyncHooks: function() {
        return config.asyncHooks;
      },
      longStackTraces: function() {
        return config.longStackTraces;
      },
      warnings: function() {
        return config.warnings;
      },
      cancellation: function() {
        return config.cancellation;
      },
      monitoring: function() {
        return config.monitoring;
      },
      propagateFromFunction: function() {
        return propagateFromFunction;
      },
      boundValueFunction: function() {
        return boundValueFunction;
      },
      checkForgottenReturns: function(returnValue, promiseCreated, name, promise, parent) {
        if (void 0 === returnValue && null !== promiseCreated && wForgottenReturn) {
          if (void 0 !== parent && parent._returnedNonUndefined()) return;
          if (0 == (65535 & promise._bitField)) return;
          name && (name += " ");
          var handlerLine = "", creatorLine = "";
          if (promiseCreated._trace) {
            for (var traceLines = promiseCreated._trace.stack.split("\n"), stack = cleanStack(traceLines), i = stack.length - 1; i >= 0; --i) {
              var line = stack[i];
              if (!nodeFramePattern.test(line)) {
                var lineMatches = line.match(parseLinePattern);
                lineMatches && (handlerLine = "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ");
                break;
              }
            }
            if (stack.length > 0) {
              var firstUserLine = stack[0];
              for (i = 0; i < traceLines.length; ++i) if (traceLines[i] === firstUserLine) {
                i > 0 && (creatorLine = "\n" + traceLines[i - 1]);
                break;
              }
            }
          }
          var msg = "a promise was created in a " + name + "handler " + handlerLine + "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
          promise._warn(msg, !0, promiseCreated);
        }
      },
      setBounds: function(firstLineError, lastLineError) {
        if (longStackTracesIsSupported()) {
          for (var firstFileName, lastFileName, firstStackLines = (firstLineError.stack || "").split("\n"), lastStackLines = (lastLineError.stack || "").split("\n"), firstIndex = -1, lastIndex = -1, i = 0; i < firstStackLines.length; ++i) {
            if (result = parseLineInfo(firstStackLines[i])) {
              firstFileName = result.fileName, firstIndex = result.line;
              break;
            }
          }
          for (i = 0; i < lastStackLines.length; ++i) {
            var result;
            if (result = parseLineInfo(lastStackLines[i])) {
              lastFileName = result.fileName, lastIndex = result.line;
              break;
            }
          }
          firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName || firstFileName !== lastFileName || firstIndex >= lastIndex || (shouldIgnore = function(line) {
            if (bluebirdFramePattern.test(line)) return !0;
            var info = parseLineInfo(line);
            return !!(info && info.fileName === firstFileName && firstIndex <= info.line && info.line <= lastIndex);
          });
        }
      },
      warn: warn,
      deprecated: function(name, replacement) {
        var message = name + " is deprecated and will be removed in a future version.";
        return replacement && (message += " Use " + replacement + " instead."), warn(message);
      },
      CapturedTrace: CapturedTrace,
      fireDomEvent: fireDomEvent,
      fireGlobalEvent: fireGlobalEvent
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
    var util = __webpack_require__(0), CancellationError = Promise.CancellationError, errorObj = util.errorObj, catchFilter = __webpack_require__(4)(NEXT_FILTER);
    function PassThroughHandlerContext(promise, type, handler) {
      this.promise = promise, this.type = type, this.handler = handler, this.called = !1, 
      this.cancelPromise = null;
    }
    function FinallyHandlerCancelReaction(finallyHandler) {
      this.finallyHandler = finallyHandler;
    }
    function checkCancel(ctx, reason) {
      return null != ctx.cancelPromise && (arguments.length > 1 ? ctx.cancelPromise._reject(reason) : ctx.cancelPromise._cancel(), 
      ctx.cancelPromise = null, !0);
    }
    function succeed() {
      return finallyHandler.call(this, this.promise._target()._settledValue());
    }
    function fail(reason) {
      if (!checkCancel(this, reason)) return errorObj.e = reason, errorObj;
    }
    function finallyHandler(reasonOrValue) {
      var promise = this.promise, handler = this.handler;
      if (!this.called) {
        this.called = !0;
        var ret = this.isFinallyHandler() ? handler.call(promise._boundValue()) : handler.call(promise._boundValue(), reasonOrValue);
        if (ret === NEXT_FILTER) return ret;
        if (void 0 !== ret) {
          promise._setReturnedNonUndefined();
          var maybePromise = tryConvertToPromise(ret, promise);
          if (maybePromise instanceof Promise) {
            if (null != this.cancelPromise) {
              if (maybePromise._isCancelled()) {
                var reason = new CancellationError("late cancellation observer");
                return promise._attachExtraTrace(reason), errorObj.e = reason, errorObj;
              }
              maybePromise.isPending() && maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
            }
            return maybePromise._then(succeed, fail, void 0, this, void 0);
          }
        }
      }
      return promise.isRejected() ? (checkCancel(this), errorObj.e = reasonOrValue, errorObj) : (checkCancel(this), 
      reasonOrValue);
    }
    return PassThroughHandlerContext.prototype.isFinallyHandler = function() {
      return 0 === this.type;
    }, FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
      checkCancel(this.finallyHandler);
    }, Promise.prototype._passThrough = function(handler, type, success, fail) {
      return "function" != typeof handler ? this.then() : this._then(success, fail, void 0, new PassThroughHandlerContext(this, type, handler), void 0);
    }, Promise.prototype.lastly = Promise.prototype.finally = function(handler) {
      return this._passThrough(handler, 0, finallyHandler, finallyHandler);
    }, Promise.prototype.tap = function(handler) {
      return this._passThrough(handler, 1, finallyHandler);
    }, Promise.prototype.tapCatch = function(handlerOrPredicate) {
      var len = arguments.length;
      if (1 === len) return this._passThrough(handlerOrPredicate, 1, void 0, finallyHandler);
      var i, catchInstances = new Array(len - 1), j = 0;
      for (i = 0; i < len - 1; ++i) {
        var item = arguments[i];
        if (!util.isObject(item)) return Promise.reject(new TypeError("tapCatch statement predicate: expecting an object but got " + util.classString(item)));
        catchInstances[j++] = item;
      }
      catchInstances.length = j;
      var handler = arguments[i];
      return this._passThrough(catchFilter(catchInstances, handler, this), 1, void 0, finallyHandler);
    }, PassThroughHandlerContext;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
    var util = __webpack_require__(0), tryCatch = util.tryCatch;
    Promise.method = function(fn) {
      if ("function" != typeof fn) throw new Promise.TypeError("expecting a function but got " + util.classString(fn));
      return function() {
        var ret = new Promise(INTERNAL);
        ret._captureStackTrace(), ret._pushContext();
        var value = tryCatch(fn).apply(this, arguments), promiseCreated = ret._popContext();
        return debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret), 
        ret._resolveFromSyncValue(value), ret;
      };
    }, Promise.attempt = Promise.try = function(fn) {
      if ("function" != typeof fn) return apiRejection("expecting a function but got " + util.classString(fn));
      var value, ret = new Promise(INTERNAL);
      if (ret._captureStackTrace(), ret._pushContext(), arguments.length > 1) {
        debug.deprecated("calling Promise.try with more than 1 argument");
        var arg = arguments[1], ctx = arguments[2];
        value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
      } else value = tryCatch(fn)();
      var promiseCreated = ret._popContext();
      return debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret), ret._resolveFromSyncValue(value), 
      ret;
    }, Promise.prototype._resolveFromSyncValue = function(value) {
      value === util.errorObj ? this._rejectCallback(value.e, !1) : this._resolveCallback(value, !0);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
    var calledBind = !1, rejectThis = function(_, e) {
      this._reject(e);
    }, targetRejected = function(e, context) {
      context.promiseRejectionQueued = !0, context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
    }, bindingResolved = function(thisArg, context) {
      0 == (50397184 & this._bitField) && this._resolveCallback(context.target);
    }, bindingRejected = function(e, context) {
      context.promiseRejectionQueued || this._reject(e);
    };
    Promise.prototype.bind = function(thisArg) {
      calledBind || (calledBind = !0, Promise.prototype._propagateFrom = debug.propagateFromFunction(), 
      Promise.prototype._boundValue = debug.boundValueFunction());
      var maybePromise = tryConvertToPromise(thisArg), ret = new Promise(INTERNAL);
      ret._propagateFrom(this, 1);
      var target = this._target();
      if (ret._setBoundTo(maybePromise), maybePromise instanceof Promise) {
        var context = {
          promiseRejectionQueued: !1,
          promise: ret,
          target: target,
          bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, void 0, ret, context), maybePromise._then(bindingResolved, bindingRejected, void 0, ret, context), 
        ret._setOnCancel(maybePromise);
      } else ret._resolveCallback(target);
      return ret;
    }, Promise.prototype._setBoundTo = function(obj) {
      void 0 !== obj ? (this._bitField = 2097152 | this._bitField, this._boundTo = obj) : this._bitField = -2097153 & this._bitField;
    }, Promise.prototype._isBound = function() {
      return 2097152 == (2097152 & this._bitField);
    }, Promise.bind = function(thisArg, value) {
      return Promise.resolve(value).bind(thisArg);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, apiRejection, debug) {
    var util = __webpack_require__(0), tryCatch = util.tryCatch, errorObj = util.errorObj, async = Promise._async;
    Promise.prototype.break = Promise.prototype.cancel = function() {
      if (!debug.cancellation()) return this._warn("cancellation is disabled");
      for (var promise = this, child = promise; promise._isCancellable(); ) {
        if (!promise._cancelBy(child)) {
          child._isFollowing() ? child._followee().cancel() : child._cancelBranched();
          break;
        }
        var parent = promise._cancellationParent;
        if (null == parent || !parent._isCancellable()) {
          promise._isFollowing() ? promise._followee().cancel() : promise._cancelBranched();
          break;
        }
        promise._isFollowing() && promise._followee().cancel(), promise._setWillBeCancelled(), 
        child = promise, promise = parent;
      }
    }, Promise.prototype._branchHasCancelled = function() {
      this._branchesRemainingToCancel--;
    }, Promise.prototype._enoughBranchesHaveCancelled = function() {
      return void 0 === this._branchesRemainingToCancel || this._branchesRemainingToCancel <= 0;
    }, Promise.prototype._cancelBy = function(canceller) {
      return canceller === this ? (this._branchesRemainingToCancel = 0, this._invokeOnCancel(), 
      !0) : (this._branchHasCancelled(), !!this._enoughBranchesHaveCancelled() && (this._invokeOnCancel(), 
      !0));
    }, Promise.prototype._cancelBranched = function() {
      this._enoughBranchesHaveCancelled() && this._cancel();
    }, Promise.prototype._cancel = function() {
      this._isCancellable() && (this._setCancelled(), async.invoke(this._cancelPromises, this, void 0));
    }, Promise.prototype._cancelPromises = function() {
      this._length() > 0 && this._settlePromises();
    }, Promise.prototype._unsetOnCancel = function() {
      this._onCancelField = void 0;
    }, Promise.prototype._isCancellable = function() {
      return this.isPending() && !this._isCancelled();
    }, Promise.prototype.isCancellable = function() {
      return this.isPending() && !this.isCancelled();
    }, Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
      if (util.isArray(onCancelCallback)) for (var i = 0; i < onCancelCallback.length; ++i) this._doInvokeOnCancel(onCancelCallback[i], internalOnly); else if (void 0 !== onCancelCallback) if ("function" == typeof onCancelCallback) {
        if (!internalOnly) {
          var e = tryCatch(onCancelCallback).call(this._boundValue());
          e === errorObj && (this._attachExtraTrace(e.e), async.throwLater(e.e));
        }
      } else onCancelCallback._resultCancelled(this);
    }, Promise.prototype._invokeOnCancel = function() {
      var onCancelCallback = this._onCancel();
      this._unsetOnCancel(), async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
    }, Promise.prototype._invokeInternalOnCancel = function() {
      this._isCancellable() && (this._doInvokeOnCancel(this._onCancel(), !0), this._unsetOnCancel());
    }, Promise.prototype._resultCancelled = function() {
      this.cancel();
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise) {
    function returner() {
      return this.value;
    }
    function thrower() {
      throw this.reason;
    }
    Promise.prototype.return = Promise.prototype.thenReturn = function(value) {
      return value instanceof Promise && value.suppressUnhandledRejections(), this._then(returner, void 0, void 0, {
        value: value
      }, void 0);
    }, Promise.prototype.throw = Promise.prototype.thenThrow = function(reason) {
      return this._then(thrower, void 0, void 0, {
        reason: reason
      }, void 0);
    }, Promise.prototype.catchThrow = function(reason) {
      if (arguments.length <= 1) return this._then(void 0, thrower, void 0, {
        reason: reason
      }, void 0);
      var _reason = arguments[1], handler = function() {
        throw _reason;
      };
      return this.caught(reason, handler);
    }, Promise.prototype.catchReturn = function(value) {
      if (arguments.length <= 1) return value instanceof Promise && value.suppressUnhandledRejections(), 
      this._then(void 0, returner, void 0, {
        value: value
      }, void 0);
      var _value = arguments[1];
      _value instanceof Promise && _value.suppressUnhandledRejections();
      var handler = function() {
        return _value;
      };
      return this.caught(value, handler);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise) {
    function PromiseInspection(promise) {
      void 0 !== promise ? (promise = promise._target(), this._bitField = promise._bitField, 
      this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0) : (this._bitField = 0, 
      this._settledValueField = void 0);
    }
    PromiseInspection.prototype._settledValue = function() {
      return this._settledValueField;
    };
    var value = PromiseInspection.prototype.value = function() {
      if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");
      return this._settledValue();
    }, reason = PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
      if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");
      return this._settledValue();
    }, isFulfilled = PromiseInspection.prototype.isFulfilled = function() {
      return 0 != (33554432 & this._bitField);
    }, isRejected = PromiseInspection.prototype.isRejected = function() {
      return 0 != (16777216 & this._bitField);
    }, isPending = PromiseInspection.prototype.isPending = function() {
      return 0 == (50397184 & this._bitField);
    }, isResolved = PromiseInspection.prototype.isResolved = function() {
      return 0 != (50331648 & this._bitField);
    };
    PromiseInspection.prototype.isCancelled = function() {
      return 0 != (8454144 & this._bitField);
    }, Promise.prototype.__isCancelled = function() {
      return 65536 == (65536 & this._bitField);
    }, Promise.prototype._isCancelled = function() {
      return this._target().__isCancelled();
    }, Promise.prototype.isCancelled = function() {
      return 0 != (8454144 & this._target()._bitField);
    }, Promise.prototype.isPending = function() {
      return isPending.call(this._target());
    }, Promise.prototype.isRejected = function() {
      return isRejected.call(this._target());
    }, Promise.prototype.isFulfilled = function() {
      return isFulfilled.call(this._target());
    }, Promise.prototype.isResolved = function() {
      return isResolved.call(this._target());
    }, Promise.prototype.value = function() {
      return value.call(this._target());
    }, Promise.prototype.reason = function() {
      var target = this._target();
      return target._unsetRejectionIsUnhandled(), reason.call(target);
    }, Promise.prototype._value = function() {
      return this._settledValue();
    }, Promise.prototype._reason = function() {
      return this._unsetRejectionIsUnhandled(), this._settledValue();
    }, Promise.PromiseInspection = PromiseInspection;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async) {
    var reject, util = __webpack_require__(0), canEvaluate = util.canEvaluate, tryCatch = util.tryCatch, errorObj = util.errorObj;
    if (canEvaluate) {
      for (var thenCallback = function(i) {
        return new Function("value", "holder", "\n 'use strict';\n holder.pIndex = value;\n holder.checkFulfillment(this);\n ".replace(/Index/g, i));
      }, promiseSetter = function(i) {
        return new Function("promise", "holder", "\n 'use strict';\n holder.pIndex = promise;\n ".replace(/Index/g, i));
      }, generateHolderClass = function(total) {
        for (var props = new Array(total), i = 0; i < props.length; ++i) props[i] = "this.p" + (i + 1);
        var assignment = props.join(" = ") + " = null;", cancellationCode = "var promise;\n" + props.map((function(prop) {
          return "\n promise = " + prop + ";\n if (promise instanceof Promise) {\n promise.cancel();\n }\n ";
        })).join("\n"), passedArguments = props.join(", "), name = "Holder$" + total, code = "return function(tryCatch, errorObj, Promise, async) {\n 'use strict';\n function [TheName](fn) {\n [TheProperties]\n this.fn = fn;\n this.asyncNeeded = true;\n this.now = 0;\n }\n [TheName].prototype._callFunction = function(promise) {\n promise._pushContext();\n var ret = tryCatch(this.fn)([ThePassedArguments]);\n promise._popContext();\n if (ret === errorObj) {\n promise._rejectCallback(ret.e, false);\n } else {\n promise._resolveCallback(ret);\n }\n };\n [TheName].prototype.checkFulfillment = function(promise) {\n var now = ++this.now;\n if (now === [TheTotal]) {\n if (this.asyncNeeded) {\n async.invoke(this._callFunction, this, promise);\n } else {\n this._callFunction(promise);\n }\n }\n };\n [TheName].prototype._resultCancelled = function() {\n [CancellationCode]\n };\n return [TheName];\n }(tryCatch, errorObj, Promise, async);\n ";
        return code = code.replace(/\[TheName\]/g, name).replace(/\[TheTotal\]/g, total).replace(/\[ThePassedArguments\]/g, passedArguments).replace(/\[TheProperties\]/g, assignment).replace(/\[CancellationCode\]/g, cancellationCode), 
        new Function("tryCatch", "errorObj", "Promise", "async", code)(tryCatch, errorObj, Promise, async);
      }, holderClasses = [], thenCallbacks = [], promiseSetters = [], i = 0; i < 8; ++i) holderClasses.push(generateHolderClass(i + 1)), 
      thenCallbacks.push(thenCallback(i + 1)), promiseSetters.push(promiseSetter(i + 1));
      reject = function(reason) {
        this._reject(reason);
      };
    }
    Promise.join = function() {
      var fn, last = arguments.length - 1;
      if (last > 0 && "function" == typeof arguments[last] && (fn = arguments[last], last <= 8 && canEvaluate)) {
        (ret = new Promise(INTERNAL))._captureStackTrace();
        for (var HolderClass = holderClasses[last - 1], holder = new HolderClass(fn), callbacks = thenCallbacks, i = 0; i < last; ++i) {
          var maybePromise = tryConvertToPromise(arguments[i], ret);
          if (maybePromise instanceof Promise) {
            var bitField = (maybePromise = maybePromise._target())._bitField;
            0 == (50397184 & bitField) ? (maybePromise._then(callbacks[i], reject, void 0, ret, holder), 
            promiseSetters[i](maybePromise, holder), holder.asyncNeeded = !1) : 0 != (33554432 & bitField) ? callbacks[i].call(ret, maybePromise._value(), holder) : 0 != (16777216 & bitField) ? ret._reject(maybePromise._reason()) : ret._cancel();
          } else callbacks[i].call(ret, maybePromise, holder);
        }
        if (!ret._isFateSealed()) {
          if (holder.asyncNeeded) {
            var context = Promise._getContext();
            holder.fn = util.contextBind(context, holder.fn);
          }
          ret._setAsyncGuaranteed(), ret._setOnCancel(holder);
        }
        return ret;
      }
      for (var $_len = arguments.length, args = new Array($_len), $_i = 0; $_i < $_len; ++$_i) args[$_i] = arguments[$_i];
      fn && args.pop();
      var ret = new PromiseArray(args).promise();
      return void 0 !== fn ? ret.spread(fn) : ret;
    };
  };
}, function(module, exports, __webpack_require__) {
  var cr = Object.create;
  if (cr) {
    var callerCache = cr(null), getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
  }
  module.exports = function(Promise) {
    var getMethodCaller, getGetter, util = __webpack_require__(0), canEvaluate = util.canEvaluate, isIdentifier = util.isIdentifier, makeMethodCaller = function(methodName) {
      return new Function("ensureMethod", "\n return function(obj) {\n 'use strict'\n var len = this.length;\n ensureMethod(obj, 'methodName');\n switch(len) {\n case 1: return obj.methodName(this[0]);\n case 2: return obj.methodName(this[0], this[1]);\n case 3: return obj.methodName(this[0], this[1], this[2]);\n case 0: return obj.methodName();\n default:\n return obj.methodName.apply(obj, this);\n }\n };\n ".replace(/methodName/g, methodName))(ensureMethod);
    }, makeGetter = function(propertyName) {
      return new Function("obj", "\n 'use strict';\n return obj.propertyName;\n ".replace("propertyName", propertyName));
    }, getCompiled = function(name, compiler, cache) {
      var ret = cache[name];
      if ("function" != typeof ret) {
        if (!isIdentifier(name)) return null;
        if (ret = compiler(name), cache[name] = ret, cache[" size"]++, cache[" size"] > 512) {
          for (var keys = Object.keys(cache), i = 0; i < 256; ++i) delete cache[keys[i]];
          cache[" size"] = keys.length - 256;
        }
      }
      return ret;
    };
    function ensureMethod(obj, methodName) {
      var fn;
      if (null != obj && (fn = obj[methodName]), "function" != typeof fn) {
        var message = "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
        throw new Promise.TypeError(message);
      }
      return fn;
    }
    function caller(obj) {
      return ensureMethod(obj, this.pop()).apply(obj, this);
    }
    function namedGetter(obj) {
      return obj[this];
    }
    function indexedGetter(obj) {
      var index = +this;
      return index < 0 && (index = Math.max(0, index + obj.length)), obj[index];
    }
    getMethodCaller = function(name) {
      return getCompiled(name, makeMethodCaller, callerCache);
    }, getGetter = function(name) {
      return getCompiled(name, makeGetter, getterCache);
    }, Promise.prototype.call = function(methodName) {
      for (var $_len = arguments.length, args = new Array(Math.max($_len - 1, 0)), $_i = 1; $_i < $_len; ++$_i) args[$_i - 1] = arguments[$_i];
      if (canEvaluate) {
        var maybeCaller = getMethodCaller(methodName);
        if (null !== maybeCaller) return this._then(maybeCaller, void 0, void 0, args, void 0);
      }
      return args.push(methodName), this._then(caller, void 0, void 0, args, void 0);
    }, Promise.prototype.get = function(propertyName) {
      var getter;
      if ("number" == typeof propertyName) getter = indexedGetter; else if (canEvaluate) {
        var maybeGetter = getGetter(propertyName);
        getter = null !== maybeGetter ? maybeGetter : namedGetter;
      } else getter = namedGetter;
      return this._then(getter, void 0, void 0, propertyName, void 0);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug) {
    var TypeError = __webpack_require__(1).TypeError, util = __webpack_require__(0), errorObj = util.errorObj, tryCatch = util.tryCatch, yieldHandlers = [];
    function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
      if (debug.cancellation()) {
        var internal = new Promise(INTERNAL), _finallyPromise = this._finallyPromise = new Promise(INTERNAL);
        this._promise = internal.lastly((function() {
          return _finallyPromise;
        })), internal._captureStackTrace(), internal._setOnCancel(this);
      } else {
        (this._promise = new Promise(INTERNAL))._captureStackTrace();
      }
      this._stack = stack, this._generatorFunction = generatorFunction, this._receiver = receiver, 
      this._generator = void 0, this._yieldHandlers = "function" == typeof yieldHandler ? [ yieldHandler ].concat(yieldHandlers) : yieldHandlers, 
      this._yieldedPromise = null, this._cancellationPhase = !1;
    }
    util.inherits(PromiseSpawn, Proxyable), PromiseSpawn.prototype._isResolved = function() {
      return null === this._promise;
    }, PromiseSpawn.prototype._cleanup = function() {
      this._promise = this._generator = null, debug.cancellation() && null !== this._finallyPromise && (this._finallyPromise._fulfill(), 
      this._finallyPromise = null);
    }, PromiseSpawn.prototype._promiseCancelled = function() {
      if (!this._isResolved()) {
        var result;
        if (void 0 !== this._generator.return) this._promise._pushContext(), result = tryCatch(this._generator.return).call(this._generator, void 0), 
        this._promise._popContext(); else {
          var reason = new Promise.CancellationError("generator .return() sentinel");
          Promise.coroutine.returnSentinel = reason, this._promise._attachExtraTrace(reason), 
          this._promise._pushContext(), result = tryCatch(this._generator.throw).call(this._generator, reason), 
          this._promise._popContext();
        }
        this._cancellationPhase = !0, this._yieldedPromise = null, this._continue(result);
      }
    }, PromiseSpawn.prototype._promiseFulfilled = function(value) {
      this._yieldedPromise = null, this._promise._pushContext();
      var result = tryCatch(this._generator.next).call(this._generator, value);
      this._promise._popContext(), this._continue(result);
    }, PromiseSpawn.prototype._promiseRejected = function(reason) {
      this._yieldedPromise = null, this._promise._attachExtraTrace(reason), this._promise._pushContext();
      var result = tryCatch(this._generator.throw).call(this._generator, reason);
      this._promise._popContext(), this._continue(result);
    }, PromiseSpawn.prototype._resultCancelled = function() {
      if (this._yieldedPromise instanceof Promise) {
        var promise = this._yieldedPromise;
        this._yieldedPromise = null, promise.cancel();
      }
    }, PromiseSpawn.prototype.promise = function() {
      return this._promise;
    }, PromiseSpawn.prototype._run = function() {
      this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, 
      this._promiseFulfilled(void 0);
    }, PromiseSpawn.prototype._continue = function(result) {
      var promise = this._promise;
      if (result === errorObj) return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._rejectCallback(result.e, !1);
      var value = result.value;
      if (!0 === result.done) return this._cleanup(), this._cancellationPhase ? promise.cancel() : promise._resolveCallback(value);
      var maybePromise = tryConvertToPromise(value, this._promise);
      if (maybePromise instanceof Promise || null !== (maybePromise = function(value, yieldHandlers, traceParent) {
        for (var i = 0; i < yieldHandlers.length; ++i) {
          traceParent._pushContext();
          var result = tryCatch(yieldHandlers[i])(value);
          if (traceParent._popContext(), result === errorObj) {
            traceParent._pushContext();
            var ret = Promise.reject(errorObj.e);
            return traceParent._popContext(), ret;
          }
          var maybePromise = tryConvertToPromise(result, traceParent);
          if (maybePromise instanceof Promise) return maybePromise;
        }
        return null;
      }(maybePromise, this._yieldHandlers, this._promise))) {
        var bitField = (maybePromise = maybePromise._target())._bitField;
        0 == (50397184 & bitField) ? (this._yieldedPromise = maybePromise, maybePromise._proxy(this, null)) : 0 != (33554432 & bitField) ? Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value()) : 0 != (16777216 & bitField) ? Promise._async.invoke(this._promiseRejected, this, maybePromise._reason()) : this._promiseCancelled();
      } else this._promiseRejected(new TypeError("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
    }, Promise.coroutine = function(generatorFunction, options) {
      if ("function" != typeof generatorFunction) throw new TypeError("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
      var yieldHandler = Object(options).yieldHandler, PromiseSpawn$ = PromiseSpawn, stack = (new Error).stack;
      return function() {
        var generator = generatorFunction.apply(this, arguments), spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack), ret = spawn.promise();
        return spawn._generator = generator, spawn._promiseFulfilled(void 0), ret;
      };
    }, Promise.coroutine.addYieldHandler = function(fn) {
      if ("function" != typeof fn) throw new TypeError("expecting a function but got " + util.classString(fn));
      yieldHandlers.push(fn);
    }, Promise.spawn = function(generatorFunction) {
      if (debug.deprecated("Promise.spawn()", "Promise.coroutine()"), "function" != typeof generatorFunction) return apiRejection("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");
      var spawn = new PromiseSpawn(generatorFunction, this), ret = spawn.promise();
      return spawn._run(Promise.spawn), ret;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
    var util = __webpack_require__(0), tryCatch = util.tryCatch, errorObj = util.errorObj, async = Promise._async;
    function MappingPromiseArray(promises, fn, limit, _filter) {
      this.constructor$(promises), this._promise._captureStackTrace();
      var context = Promise._getContext();
      if (this._callback = util.contextBind(context, fn), this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null, 
      this._limit = limit, this._inFlight = 0, this._queue = [], async.invoke(this._asyncInit, this, void 0), 
      util.isArray(promises)) for (var i = 0; i < promises.length; ++i) {
        var maybePromise = promises[i];
        maybePromise instanceof Promise && maybePromise.suppressUnhandledRejections();
      }
    }
    function map(promises, fn, options, _filter) {
      if ("function" != typeof fn) return apiRejection("expecting a function but got " + util.classString(fn));
      var limit = 0;
      if (void 0 !== options) {
        if ("object" != typeof options || null === options) return Promise.reject(new TypeError("options argument must be an object but it is " + util.classString(options)));
        if ("number" != typeof options.concurrency) return Promise.reject(new TypeError("'concurrency' must be a number but it is " + util.classString(options.concurrency)));
        limit = options.concurrency;
      }
      return new MappingPromiseArray(promises, fn, limit = "number" == typeof limit && isFinite(limit) && limit >= 1 ? limit : 0, _filter).promise();
    }
    util.inherits(MappingPromiseArray, PromiseArray), MappingPromiseArray.prototype._asyncInit = function() {
      this._init$(void 0, -2);
    }, MappingPromiseArray.prototype._init = function() {}, MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
      var values = this._values, length = this.length(), preservedValues = this._preservedValues, limit = this._limit;
      if (index < 0) {
        if (values[index = -1 * index - 1] = value, limit >= 1 && (this._inFlight--, this._drainQueue(), 
        this._isResolved())) return !0;
      } else {
        if (limit >= 1 && this._inFlight >= limit) return values[index] = value, this._queue.push(index), 
        !1;
        null !== preservedValues && (preservedValues[index] = value);
        var promise = this._promise, callback = this._callback, receiver = promise._boundValue();
        promise._pushContext();
        var ret = tryCatch(callback).call(receiver, value, index, length), promiseCreated = promise._popContext();
        if (debug.checkForgottenReturns(ret, promiseCreated, null !== preservedValues ? "Promise.filter" : "Promise.map", promise), 
        ret === errorObj) return this._reject(ret.e), !0;
        var maybePromise = tryConvertToPromise(ret, this._promise);
        if (maybePromise instanceof Promise) {
          var bitField = (maybePromise = maybePromise._target())._bitField;
          if (0 == (50397184 & bitField)) return limit >= 1 && this._inFlight++, values[index] = maybePromise, 
          maybePromise._proxy(this, -1 * (index + 1)), !1;
          if (0 == (33554432 & bitField)) return 0 != (16777216 & bitField) ? (this._reject(maybePromise._reason()), 
          !0) : (this._cancel(), !0);
          ret = maybePromise._value();
        }
        values[index] = ret;
      }
      return ++this._totalResolved >= length && (null !== preservedValues ? this._filter(values, preservedValues) : this._resolve(values), 
      !0);
    }, MappingPromiseArray.prototype._drainQueue = function() {
      for (var queue = this._queue, limit = this._limit, values = this._values; queue.length > 0 && this._inFlight < limit; ) {
        if (this._isResolved()) return;
        var index = queue.pop();
        this._promiseFulfilled(values[index], index);
      }
    }, MappingPromiseArray.prototype._filter = function(booleans, values) {
      for (var len = values.length, ret = new Array(len), j = 0, i = 0; i < len; ++i) booleans[i] && (ret[j++] = values[i]);
      ret.length = j, this._resolve(ret);
    }, MappingPromiseArray.prototype.preservedValues = function() {
      return this._preservedValues;
    }, Promise.prototype.map = function(fn, options) {
      return map(this, fn, options, null);
    }, Promise.map = function(promises, fn, options, _filter) {
      return map(promises, fn, options, _filter);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise) {
    var util = __webpack_require__(0), async = Promise._async, tryCatch = util.tryCatch, errorObj = util.errorObj;
    function spreadAdapter(val, nodeback) {
      if (!util.isArray(val)) return successAdapter.call(this, val, nodeback);
      var ret = tryCatch(nodeback).apply(this._boundValue(), [ null ].concat(val));
      ret === errorObj && async.throwLater(ret.e);
    }
    function successAdapter(val, nodeback) {
      var receiver = this._boundValue(), ret = void 0 === val ? tryCatch(nodeback).call(receiver, null) : tryCatch(nodeback).call(receiver, null, val);
      ret === errorObj && async.throwLater(ret.e);
    }
    function errorAdapter(reason, nodeback) {
      if (!reason) {
        var newReason = new Error(reason + "");
        newReason.cause = reason, reason = newReason;
      }
      var ret = tryCatch(nodeback).call(this._boundValue(), reason);
      ret === errorObj && async.throwLater(ret.e);
    }
    Promise.prototype.asCallback = Promise.prototype.nodeify = function(nodeback, options) {
      if ("function" == typeof nodeback) {
        var adapter = successAdapter;
        void 0 !== options && Object(options).spread && (adapter = spreadAdapter), this._then(adapter, errorAdapter, void 0, this, nodeback);
      }
      return this;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL) {
    var THIS = {}, util = __webpack_require__(0), nodebackForPromise = __webpack_require__(5), withAppended = util.withAppended, maybeWrapAsError = util.maybeWrapAsError, canEvaluate = util.canEvaluate, TypeError = __webpack_require__(1).TypeError, defaultPromisified = {
      __isPromisified__: !0
    }, noCopyPropsPattern = new RegExp("^(?:" + [ "arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__" ].join("|") + ")$"), defaultFilter = function(name) {
      return util.isIdentifier(name) && "_" !== name.charAt(0) && "constructor" !== name;
    };
    function propsFilter(key) {
      return !noCopyPropsPattern.test(key);
    }
    function isPromisified(fn) {
      try {
        return !0 === fn.__isPromisified__;
      } catch (e) {
        return !1;
      }
    }
    function hasPromisified(obj, key, suffix) {
      var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
      return !!val && isPromisified(val);
    }
    function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
      for (var keys = util.inheritedDataKeys(obj), ret = [], i = 0; i < keys.length; ++i) {
        var key = keys[i], value = obj[key], passesDefaultFilter = filter === defaultFilter || defaultFilter(key);
        "function" != typeof value || isPromisified(value) || hasPromisified(obj, key, suffix) || !filter(key, value, obj, passesDefaultFilter) || ret.push(key, value);
      }
      return function(ret, suffix, suffixRegexp) {
        for (var i = 0; i < ret.length; i += 2) {
          var key = ret[i];
          if (suffixRegexp.test(key)) for (var keyWithoutAsyncSuffix = key.replace(suffixRegexp, ""), j = 0; j < ret.length; j += 2) if (ret[j] === keyWithoutAsyncSuffix) throw new TypeError("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix));
        }
      }(ret, suffix, suffixRegexp), ret;
    }
    var makeNodePromisified = canEvaluate ? function(callback, receiver, originalName, fn, _, multiArgs) {
      var newParameterCount = Math.max(0, function(fn) {
        return "number" == typeof fn.length ? Math.max(Math.min(fn.length, 1024), 0) : 0;
      }(fn) - 1), argumentOrder = function(likelyArgumentCount) {
        for (var ret = [ likelyArgumentCount ], min = Math.max(0, likelyArgumentCount - 1 - 3), i = likelyArgumentCount - 1; i >= min; --i) ret.push(i);
        for (i = likelyArgumentCount + 1; i <= 3; ++i) ret.push(i);
        return ret;
      }(newParameterCount), shouldProxyThis = "string" == typeof callback || receiver === THIS;
      function generateCallForArgumentCount(count) {
        var argumentCount, args = (argumentCount = count, util.filledRange(argumentCount, "_arg", "")).join(", "), comma = count > 0 ? ", " : "";
        return (shouldProxyThis ? "ret = callback.call(this, {{args}}, nodeback); break;\n" : void 0 === receiver ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n").replace("{{args}}", args).replace(", ", comma);
      }
      var getFunctionCode = "string" == typeof callback ? "this != null ? this['" + callback + "'] : fn" : "fn", body = "'use strict';\n var ret = function (Parameters) {\n 'use strict';\n var len = arguments.length;\n var promise = new Promise(INTERNAL);\n promise._captureStackTrace();\n var nodeback = nodebackForPromise(promise, " + multiArgs + ");\n var ret;\n var callback = tryCatch([GetFunctionCode]);\n switch(len) {\n [CodeForSwitchCase]\n }\n if (ret === errorObj) {\n promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n }\n if (!promise._isFateSealed()) promise._setAsyncGuaranteed();\n return promise;\n };\n notEnumerableProp(ret, '__isPromisified__', true);\n return ret;\n ".replace("[CodeForSwitchCase]", function() {
        for (var ret = "", i = 0; i < argumentOrder.length; ++i) ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);
        return ret += "\n default:\n var args = new Array(len + 1);\n var i = 0;\n for (var i = 0; i < len; ++i) {\n args[i] = arguments[i];\n }\n args[i] = nodeback;\n [CodeForCall]\n break;\n ".replace("[CodeForCall]", shouldProxyThis ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
      }()).replace("[GetFunctionCode]", getFunctionCode);
      return body = body.replace("Parameters", function(parameterCount) {
        return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
      }(newParameterCount)), new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", body)(Promise, fn, receiver, withAppended, maybeWrapAsError, nodebackForPromise, util.tryCatch, util.errorObj, util.notEnumerableProp, INTERNAL);
    } : function(callback, receiver, _, fn, __, multiArgs) {
      var defaultThis = function() {
        return this;
      }(), method = callback;
      function promisified() {
        var _receiver = receiver;
        receiver === THIS && (_receiver = this);
        var promise = new Promise(INTERNAL);
        promise._captureStackTrace();
        var cb = "string" == typeof method && this !== defaultThis ? this[method] : callback, fn = nodebackForPromise(promise, multiArgs);
        try {
          cb.apply(_receiver, withAppended(arguments, fn));
        } catch (e) {
          promise._rejectCallback(maybeWrapAsError(e), !0, !0);
        }
        return promise._isFateSealed() || promise._setAsyncGuaranteed(), promise;
      }
      return "string" == typeof method && (callback = fn), util.notEnumerableProp(promisified, "__isPromisified__", !0), 
      promisified;
    };
    function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
      for (var suffixRegexp = new RegExp(suffix.replace(/([$])/, "\\$") + "$"), methods = promisifiableMethods(obj, suffix, suffixRegexp, filter), i = 0, len = methods.length; i < len; i += 2) {
        var key = methods[i], fn = methods[i + 1], promisifiedKey = key + suffix;
        if (promisifier === makeNodePromisified) obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs); else {
          var promisified = promisifier(fn, (function() {
            return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
          }));
          util.notEnumerableProp(promisified, "__isPromisified__", !0), obj[promisifiedKey] = promisified;
        }
      }
      return util.toFastProperties(obj), obj;
    }
    Promise.promisify = function(fn, options) {
      if ("function" != typeof fn) throw new TypeError("expecting a function but got " + util.classString(fn));
      if (isPromisified(fn)) return fn;
      var ret = function(callback, receiver, multiArgs) {
        return makeNodePromisified(callback, receiver, void 0, callback, null, multiArgs);
      }(fn, void 0 === (options = Object(options)).context ? THIS : options.context, !!options.multiArgs);
      return util.copyDescriptors(fn, ret, propsFilter), ret;
    }, Promise.promisifyAll = function(target, options) {
      if ("function" != typeof target && "object" != typeof target) throw new TypeError("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");
      var multiArgs = !!(options = Object(options)).multiArgs, suffix = options.suffix;
      "string" != typeof suffix && (suffix = "Async");
      var filter = options.filter;
      "function" != typeof filter && (filter = defaultFilter);
      var promisifier = options.promisifier;
      if ("function" != typeof promisifier && (promisifier = makeNodePromisified), !util.isIdentifier(suffix)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");
      for (var keys = util.inheritedDataKeys(target), i = 0; i < keys.length; ++i) {
        var value = target[keys[i]];
        "constructor" !== keys[i] && util.isClass(value) && (promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs), 
        promisifyAll(value, suffix, filter, promisifier, multiArgs));
      }
      return promisifyAll(target, suffix, filter, promisifier, multiArgs);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, tryConvertToPromise, apiRejection) {
    var Es6Map, util = __webpack_require__(0), isObject = util.isObject, es5 = __webpack_require__(2);
    "function" == typeof Map && (Es6Map = Map);
    var mapToEntries = function() {
      var index = 0, size = 0;
      function extractEntry(value, key) {
        this[index] = value, this[index + size] = key, index++;
      }
      return function(map) {
        size = map.size, index = 0;
        var ret = new Array(2 * map.size);
        return map.forEach(extractEntry, ret), ret;
      };
    }();
    function PropertiesPromiseArray(obj) {
      var entries, isMap = !1;
      if (void 0 !== Es6Map && obj instanceof Es6Map) entries = mapToEntries(obj), isMap = !0; else {
        var keys = es5.keys(obj), len = keys.length;
        entries = new Array(2 * len);
        for (var i = 0; i < len; ++i) {
          var key = keys[i];
          entries[i] = obj[key], entries[i + len] = key;
        }
      }
      this.constructor$(entries), this._isMap = isMap, this._init$(void 0, isMap ? -6 : -3);
    }
    function props(promises) {
      var ret, castValue = tryConvertToPromise(promises);
      return isObject(castValue) ? (ret = castValue instanceof Promise ? castValue._then(Promise.props, void 0, void 0, void 0, void 0) : new PropertiesPromiseArray(castValue).promise(), 
      castValue instanceof Promise && ret._propagateFrom(castValue, 2), ret) : apiRejection("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n");
    }
    util.inherits(PropertiesPromiseArray, PromiseArray), PropertiesPromiseArray.prototype._init = function() {}, 
    PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
      if (this._values[index] = value, ++this._totalResolved >= this._length) {
        var val;
        if (this._isMap) val = function(entries) {
          for (var ret = new Es6Map, length = entries.length / 2 | 0, i = 0; i < length; ++i) {
            var key = entries[length + i], value = entries[i];
            ret.set(key, value);
          }
          return ret;
        }(this._values); else {
          val = {};
          for (var keyOffset = this.length(), i = 0, len = this.length(); i < len; ++i) val[this._values[i + keyOffset]] = this._values[i];
        }
        return this._resolve(val), !0;
      }
      return !1;
    }, PropertiesPromiseArray.prototype.shouldCopyValues = function() {
      return !1;
    }, PropertiesPromiseArray.prototype.getActualLength = function(len) {
      return len >> 1;
    }, Promise.prototype.props = function() {
      return props(this);
    }, Promise.props = function(promises) {
      return props(promises);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
    var util = __webpack_require__(0);
    function race(promises, parent) {
      var promise, maybePromise = tryConvertToPromise(promises);
      if (maybePromise instanceof Promise) return (promise = maybePromise).then((function(array) {
        return race(array, promise);
      }));
      if (null === (promises = util.asArray(promises))) return apiRejection("expecting an array or an iterable object but got " + util.classString(promises));
      var ret = new Promise(INTERNAL);
      void 0 !== parent && ret._propagateFrom(parent, 3);
      for (var fulfill = ret._fulfill, reject = ret._reject, i = 0, len = promises.length; i < len; ++i) {
        var val = promises[i];
        (void 0 !== val || i in promises) && Promise.cast(val)._then(fulfill, reject, void 0, ret, null);
      }
      return ret;
    }
    Promise.race = function(promises) {
      return race(promises, void 0);
    }, Promise.prototype.race = function() {
      return race(this, void 0);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug) {
    var util = __webpack_require__(0), tryCatch = util.tryCatch;
    function ReductionPromiseArray(promises, fn, initialValue, _each) {
      this.constructor$(promises);
      var context = Promise._getContext();
      this._fn = util.contextBind(context, fn), void 0 !== initialValue && (initialValue = Promise.resolve(initialValue))._attachCancellationCallback(this), 
      this._initialValue = initialValue, this._currentCancellable = null, this._eachValues = _each === INTERNAL ? Array(this._length) : 0 === _each ? null : void 0, 
      this._promise._captureStackTrace(), this._init$(void 0, -5);
    }
    function completed(valueOrReason, array) {
      this.isFulfilled() ? array._resolve(valueOrReason) : array._reject(valueOrReason);
    }
    function reduce(promises, fn, initialValue, _each) {
      return "function" != typeof fn ? apiRejection("expecting a function but got " + util.classString(fn)) : new ReductionPromiseArray(promises, fn, initialValue, _each).promise();
    }
    function gotAccum(accum) {
      this.accum = accum, this.array._gotAccum(accum);
      var value = tryConvertToPromise(this.value, this.array._promise);
      return value instanceof Promise ? (this.array._currentCancellable = value, value._then(gotValue, void 0, void 0, this, void 0)) : gotValue.call(this, value);
    }
    function gotValue(value) {
      var ret, array = this.array, promise = array._promise, fn = tryCatch(array._fn);
      promise._pushContext(), (ret = void 0 !== array._eachValues ? fn.call(promise._boundValue(), value, this.index, this.length) : fn.call(promise._boundValue(), this.accum, value, this.index, this.length)) instanceof Promise && (array._currentCancellable = ret);
      var promiseCreated = promise._popContext();
      return debug.checkForgottenReturns(ret, promiseCreated, void 0 !== array._eachValues ? "Promise.each" : "Promise.reduce", promise), 
      ret;
    }
    util.inherits(ReductionPromiseArray, PromiseArray), ReductionPromiseArray.prototype._gotAccum = function(accum) {
      void 0 !== this._eachValues && null !== this._eachValues && accum !== INTERNAL && this._eachValues.push(accum);
    }, ReductionPromiseArray.prototype._eachComplete = function(value) {
      return null !== this._eachValues && this._eachValues.push(value), this._eachValues;
    }, ReductionPromiseArray.prototype._init = function() {}, ReductionPromiseArray.prototype._resolveEmptyArray = function() {
      this._resolve(void 0 !== this._eachValues ? this._eachValues : this._initialValue);
    }, ReductionPromiseArray.prototype.shouldCopyValues = function() {
      return !1;
    }, ReductionPromiseArray.prototype._resolve = function(value) {
      this._promise._resolveCallback(value), this._values = null;
    }, ReductionPromiseArray.prototype._resultCancelled = function(sender) {
      if (sender === this._initialValue) return this._cancel();
      this._isResolved() || (this._resultCancelled$(), this._currentCancellable instanceof Promise && this._currentCancellable.cancel(), 
      this._initialValue instanceof Promise && this._initialValue.cancel());
    }, ReductionPromiseArray.prototype._iterate = function(values) {
      var value, i;
      this._values = values;
      var length = values.length;
      void 0 !== this._initialValue ? (value = this._initialValue, i = 0) : (value = Promise.resolve(values[0]), 
      i = 1), this._currentCancellable = value;
      for (var j = i; j < length; ++j) {
        var maybePromise = values[j];
        maybePromise instanceof Promise && maybePromise.suppressUnhandledRejections();
      }
      if (!value.isRejected()) for (;i < length; ++i) {
        var ctx = {
          accum: null,
          value: values[i],
          index: i,
          length: length,
          array: this
        };
        value = value._then(gotAccum, void 0, void 0, ctx, void 0), 0 == (127 & i) && value._setNoAsyncGuarantee();
      }
      void 0 !== this._eachValues && (value = value._then(this._eachComplete, void 0, void 0, this, void 0)), 
      value._then(completed, completed, void 0, value, this);
    }, Promise.prototype.reduce = function(fn, initialValue) {
      return reduce(this, fn, initialValue, null);
    }, Promise.reduce = function(promises, fn, initialValue, _each) {
      return reduce(promises, fn, initialValue, _each);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, debug) {
    var PromiseInspection = Promise.PromiseInspection;
    function SettledPromiseArray(values) {
      this.constructor$(values);
    }
    __webpack_require__(0).inherits(SettledPromiseArray, PromiseArray), SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
      return this._values[index] = inspection, ++this._totalResolved >= this._length && (this._resolve(this._values), 
      !0);
    }, SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
      var ret = new PromiseInspection;
      return ret._bitField = 33554432, ret._settledValueField = value, this._promiseResolved(index, ret);
    }, SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
      var ret = new PromiseInspection;
      return ret._bitField = 16777216, ret._settledValueField = reason, this._promiseResolved(index, ret);
    }, Promise.settle = function(promises) {
      return debug.deprecated(".settle()", ".reflect()"), new SettledPromiseArray(promises).promise();
    }, Promise.allSettled = function(promises) {
      return new SettledPromiseArray(promises).promise();
    }, Promise.prototype.settle = function() {
      return Promise.settle(this);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, PromiseArray, apiRejection) {
    var util = __webpack_require__(0), RangeError = __webpack_require__(1).RangeError, AggregateError = __webpack_require__(1).AggregateError, isArray = util.isArray, CANCELLATION = {};
    function SomePromiseArray(values) {
      this.constructor$(values), this._howMany = 0, this._unwrap = !1, this._initialized = !1;
    }
    function some(promises, howMany) {
      if ((0 | howMany) !== howMany || howMany < 0) return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");
      var ret = new SomePromiseArray(promises), promise = ret.promise();
      return ret.setHowMany(howMany), ret.init(), promise;
    }
    util.inherits(SomePromiseArray, PromiseArray), SomePromiseArray.prototype._init = function() {
      if (this._initialized) if (0 !== this._howMany) {
        this._init$(void 0, -5);
        var isArrayResolved = isArray(this._values);
        !this._isResolved() && isArrayResolved && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()));
      } else this._resolve([]);
    }, SomePromiseArray.prototype.init = function() {
      this._initialized = !0, this._init();
    }, SomePromiseArray.prototype.setUnwrap = function() {
      this._unwrap = !0;
    }, SomePromiseArray.prototype.howMany = function() {
      return this._howMany;
    }, SomePromiseArray.prototype.setHowMany = function(count) {
      this._howMany = count;
    }, SomePromiseArray.prototype._promiseFulfilled = function(value) {
      return this._addFulfilled(value), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 
      1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values), 
      !0);
    }, SomePromiseArray.prototype._promiseRejected = function(reason) {
      return this._addRejected(reason), this._checkOutcome();
    }, SomePromiseArray.prototype._promiseCancelled = function() {
      return this._values instanceof Promise || null == this._values ? this._cancel() : (this._addRejected(CANCELLATION), 
      this._checkOutcome());
    }, SomePromiseArray.prototype._checkOutcome = function() {
      if (this.howMany() > this._canPossiblyFulfill()) {
        for (var e = new AggregateError, i = this.length(); i < this._values.length; ++i) this._values[i] !== CANCELLATION && e.push(this._values[i]);
        return e.length > 0 ? this._reject(e) : this._cancel(), !0;
      }
      return !1;
    }, SomePromiseArray.prototype._fulfilled = function() {
      return this._totalResolved;
    }, SomePromiseArray.prototype._rejected = function() {
      return this._values.length - this.length();
    }, SomePromiseArray.prototype._addRejected = function(reason) {
      this._values.push(reason);
    }, SomePromiseArray.prototype._addFulfilled = function(value) {
      this._values[this._totalResolved++] = value;
    }, SomePromiseArray.prototype._canPossiblyFulfill = function() {
      return this.length() - this._rejected();
    }, SomePromiseArray.prototype._getRangeError = function(count) {
      var message = "Input array must contain at least " + this._howMany + " items but contains only " + count + " items";
      return new RangeError(message);
    }, SomePromiseArray.prototype._resolveEmptyArray = function() {
      this._reject(this._getRangeError(0));
    }, Promise.some = function(promises, howMany) {
      return some(promises, howMany);
    }, Promise.prototype.some = function(howMany) {
      return some(this, howMany);
    }, Promise._SomePromiseArray = SomePromiseArray;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL, debug) {
    var util = __webpack_require__(0), TimeoutError = Promise.TimeoutError;
    function HandleWrapper(handle) {
      this.handle = handle;
    }
    HandleWrapper.prototype._resultCancelled = function() {
      clearTimeout(this.handle);
    };
    var afterValue = function(value) {
      return delay(+this).thenReturn(value);
    }, delay = Promise.delay = function(ms, value) {
      var ret, handle;
      return void 0 !== value ? (ret = Promise.resolve(value)._then(afterValue, null, null, ms, void 0), 
      debug.cancellation() && value instanceof Promise && ret._setOnCancel(value)) : (ret = new Promise(INTERNAL), 
      handle = setTimeout((function() {
        ret._fulfill();
      }), +ms), debug.cancellation() && ret._setOnCancel(new HandleWrapper(handle)), ret._captureStackTrace()), 
      ret._setAsyncGuaranteed(), ret;
    };
    Promise.prototype.delay = function(ms) {
      return delay(ms, this);
    };
    function successClear(value) {
      return clearTimeout(this.handle), value;
    }
    function failureClear(reason) {
      throw clearTimeout(this.handle), reason;
    }
    Promise.prototype.timeout = function(ms, message) {
      var ret, parent;
      ms = +ms;
      var handleWrapper = new HandleWrapper(setTimeout((function() {
        ret.isPending() && function(promise, message, parent) {
          var err;
          err = "string" != typeof message ? message instanceof Error ? message : new TimeoutError("operation timed out") : new TimeoutError(message), 
          util.markAsOriginatingFromRejection(err), promise._attachExtraTrace(err), promise._reject(err), 
          null != parent && parent.cancel();
        }(ret, message, parent);
      }), ms));
      return debug.cancellation() ? (parent = this.then(), (ret = parent._then(successClear, failureClear, void 0, handleWrapper, void 0))._setOnCancel(handleWrapper)) : ret = this._then(successClear, failureClear, void 0, handleWrapper, void 0), 
      ret;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug) {
    var util = __webpack_require__(0), TypeError = __webpack_require__(1).TypeError, inherits = __webpack_require__(0).inherits, errorObj = util.errorObj, tryCatch = util.tryCatch, NULL = {};
    function thrower(e) {
      setTimeout((function() {
        throw e;
      }), 0);
    }
    function dispose(resources, inspection) {
      var i = 0, len = resources.length, ret = new Promise(INTERNAL);
      return function iterator() {
        if (i >= len) return ret._fulfill();
        var maybePromise = function(thenable) {
          var maybePromise = tryConvertToPromise(thenable);
          return maybePromise !== thenable && "function" == typeof thenable._isDisposable && "function" == typeof thenable._getDisposer && thenable._isDisposable() && maybePromise._setDisposable(thenable._getDisposer()), 
          maybePromise;
        }(resources[i++]);
        if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
          try {
            maybePromise = tryConvertToPromise(maybePromise._getDisposer().tryDispose(inspection), resources.promise);
          } catch (e) {
            return thrower(e);
          }
          if (maybePromise instanceof Promise) return maybePromise._then(iterator, thrower, null, null, null);
        }
        iterator();
      }(), ret;
    }
    function Disposer(data, promise, context) {
      this._data = data, this._promise = promise, this._context = context;
    }
    function FunctionDisposer(fn, promise, context) {
      this.constructor$(fn, promise, context);
    }
    function maybeUnwrapDisposer(value) {
      return Disposer.isDisposer(value) ? (this.resources[this.index]._setDisposable(value), 
      value.promise()) : value;
    }
    function ResourceList(length) {
      this.length = length, this.promise = null, this[length - 1] = null;
    }
    Disposer.prototype.data = function() {
      return this._data;
    }, Disposer.prototype.promise = function() {
      return this._promise;
    }, Disposer.prototype.resource = function() {
      return this.promise().isFulfilled() ? this.promise().value() : NULL;
    }, Disposer.prototype.tryDispose = function(inspection) {
      var resource = this.resource(), context = this._context;
      void 0 !== context && context._pushContext();
      var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
      return void 0 !== context && context._popContext(), this._promise._unsetDisposable(), 
      this._data = null, ret;
    }, Disposer.isDisposer = function(d) {
      return null != d && "function" == typeof d.resource && "function" == typeof d.tryDispose;
    }, inherits(FunctionDisposer, Disposer), FunctionDisposer.prototype.doDispose = function(resource, inspection) {
      return this.data().call(resource, resource, inspection);
    }, ResourceList.prototype._resultCancelled = function() {
      for (var len = this.length, i = 0; i < len; ++i) {
        var item = this[i];
        item instanceof Promise && item.cancel();
      }
    }, Promise.using = function() {
      var len = arguments.length;
      if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
      var input, fn = arguments[len - 1];
      if ("function" != typeof fn) return apiRejection("expecting a function but got " + util.classString(fn));
      var spreadArgs = !0;
      2 === len && Array.isArray(arguments[0]) ? (len = (input = arguments[0]).length, 
      spreadArgs = !1) : (input = arguments, len--);
      for (var resources = new ResourceList(len), i = 0; i < len; ++i) {
        var resource = input[i];
        if (Disposer.isDisposer(resource)) {
          var disposer = resource;
          (resource = resource.promise())._setDisposable(disposer);
        } else {
          var maybePromise = tryConvertToPromise(resource);
          maybePromise instanceof Promise && (resource = maybePromise._then(maybeUnwrapDisposer, null, null, {
            resources: resources,
            index: i
          }, void 0));
        }
        resources[i] = resource;
      }
      var reflectedResources = new Array(resources.length);
      for (i = 0; i < reflectedResources.length; ++i) reflectedResources[i] = Promise.resolve(resources[i]).reflect();
      var resultPromise = Promise.all(reflectedResources).then((function(inspections) {
        for (var i = 0; i < inspections.length; ++i) {
          var inspection = inspections[i];
          if (inspection.isRejected()) return errorObj.e = inspection.error(), errorObj;
          if (!inspection.isFulfilled()) return void resultPromise.cancel();
          inspections[i] = inspection.value();
        }
        promise._pushContext(), fn = tryCatch(fn);
        var ret = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections), promiseCreated = promise._popContext();
        return debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise), 
        ret;
      })), promise = resultPromise.lastly((function() {
        var inspection = new Promise.PromiseInspection(resultPromise);
        return dispose(resources, inspection);
      }));
      return resources.promise = promise, promise._setOnCancel(resources), promise;
    }, Promise.prototype._setDisposable = function(disposer) {
      this._bitField = 131072 | this._bitField, this._disposer = disposer;
    }, Promise.prototype._isDisposable = function() {
      return (131072 & this._bitField) > 0;
    }, Promise.prototype._getDisposer = function() {
      return this._disposer;
    }, Promise.prototype._unsetDisposable = function() {
      this._bitField = -131073 & this._bitField, this._disposer = void 0;
    }, Promise.prototype.disposer = function(fn) {
      if ("function" == typeof fn) return new FunctionDisposer(fn, this, createContext());
      throw new TypeError;
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise) {
    var SomePromiseArray = Promise._SomePromiseArray;
    function any(promises) {
      var ret = new SomePromiseArray(promises), promise = ret.promise();
      return ret.setHowMany(1), ret.setUnwrap(), ret.init(), promise;
    }
    Promise.any = function(promises) {
      return any(promises);
    }, Promise.prototype.any = function() {
      return any(this);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL) {
    var PromiseReduce = Promise.reduce, PromiseAll = Promise.all;
    function promiseAllThis() {
      return PromiseAll(this);
    }
    Promise.prototype.each = function(fn) {
      return PromiseReduce(this, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, this, void 0);
    }, Promise.prototype.mapSeries = function(fn) {
      return PromiseReduce(this, fn, INTERNAL, INTERNAL);
    }, Promise.each = function(promises, fn) {
      return PromiseReduce(promises, fn, INTERNAL, 0)._then(promiseAllThis, void 0, void 0, promises, void 0);
    }, Promise.mapSeries = function(promises, fn) {
      return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
    };
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(Promise, INTERNAL) {
    var PromiseMap = Promise.map;
    Promise.prototype.filter = function(fn, options) {
      return PromiseMap(this, fn, options, INTERNAL);
    }, Promise.filter = function(promises, fn, options) {
      return PromiseMap(promises, fn, options, INTERNAL);
    };
  };
} ]);
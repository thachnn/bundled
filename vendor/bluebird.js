"use strict";

module.exports = (function(modules) {
  var installedModules = {};

  function __wpreq__(moduleId) {
    var module = installedModules[moduleId];
    if (module) return module.exports;

    installedModules[moduleId] = module = {i: moduleId, l: false, exports: {}};
    modules[moduleId].call(module.exports, module, module.exports, __wpreq__);

    return (module.l = true), module.exports;
  }

  return (__wpreq__.m = modules), (__wpreq__.c = installedModules), __wpreq__("./bluebird");
})({
"./bluebird":
function(module, exports, __wpreq__) {

var old;
if (typeof Promise != "undefined") old = Promise;
function noConflict() {
  try {
    if (Promise === bluebird) Promise = old;
  } catch (_) {}
  return bluebird;
}
var bluebird = __wpreq__("./promise")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},
"./promise":
function(module, exports, __wpreq__) {

module.exports = function() {
var makeSelfResolutionError = function() {
  return new TypeError("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n");
};
var reflectHandler = function() {
  return new Promise.PromiseInspection(this._target());
};
var apiRejection = function(msg) {
  return Promise.reject(new TypeError(msg));
};
function Proxyable() {}
var UNDEFINED_BINDING = {},
  util = __wpreq__("./util");
util.setReflectHandler(reflectHandler);

var getDomain = function() {
  var domain = process.domain;
  return domain === void 0 ? null : domain;
};
var getContextDefault = function() {
  return null;
};
var getContextDomain = function() {
  return {domain: getDomain(), async: null};
};
var AsyncResource = util.isNode && util.nodeSupportsAsyncResource
  ? __wpreq__("async_hooks").AsyncResource : null;
var getContextAsyncHooks = function() {
  return {domain: getDomain(), async: new AsyncResource("Bluebird::Promise")};
};
var getContext = util.isNode ? getContextDomain : getContextDefault;
util.notEnumerableProp(Promise, "_getContext", getContext);
var enableAsyncHooks = function() {
  getContext = getContextAsyncHooks;
  util.notEnumerableProp(Promise, "_getContext", getContextAsyncHooks);
};
var disableAsyncHooks = function() {
  getContext = getContextDomain;
  util.notEnumerableProp(Promise, "_getContext", getContextDomain);
};

var es5 = __wpreq__("./es5"),
  Async = __wpreq__("./async"),
  async = new Async();
es5.defineProperty(Promise, "_async", {value: async});
var errors = __wpreq__("./errors"),
  TypeError = (Promise.TypeError = errors.TypeError);
Promise.RangeError = errors.RangeError;
var CancellationError = (Promise.CancellationError = errors.CancellationError);
Promise.TimeoutError = errors.TimeoutError;
Promise.OperationalError = errors.OperationalError;
Promise.RejectionError = errors.OperationalError;
Promise.AggregateError = errors.AggregateError;
var INTERNAL = function() {},
  APPLY = {},
  NEXT_FILTER = {},
  tryConvertToPromise = __wpreq__("./thenables")(Promise, INTERNAL);
var PromiseArray = __wpreq__("./promise_array")(
  Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable
);
var Context = __wpreq__("./context")(Promise),
  createContext = Context.create;

var debug = __wpreq__("./debuggability")(
  Promise, Context, enableAsyncHooks, disableAsyncHooks
);
var PassThroughHandlerContext = __wpreq__("./finally")(
  Promise, tryConvertToPromise, NEXT_FILTER
);
var catchFilter = __wpreq__("./catch_filter")(NEXT_FILTER),
  nodebackForPromise = __wpreq__("./nodeback"),
  errorObj = util.errorObj,
  tryCatch = util.tryCatch;
function check(self, executor) {
  if (self == null || self.constructor !== Promise)
    throw new TypeError(
      "the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n"
    );

  if (typeof executor != "function")
    throw new TypeError("expecting a function but got " + util.classString(executor));
}

function Promise(executor) {
  executor === INTERNAL || check(this, executor);

  this._bitField = 0;
  this._fulfillmentHandler0 = void 0;
  this._rejectionHandler0 = void 0;
  this._promise0 = void 0;
  this._receiver0 = void 0;
  this._resolveFromExecutor(executor);
  this._promiseCreated();
  this._fireEvent("promiseCreated", this);
}

Promise.prototype.toString = function() {
  return "[object Promise]";
};

Promise.prototype.caught = Promise.prototype.catch = function(fn) {
  var len = arguments.length;
  if (len <= 1) return this.then(void 0, fn);

  var catchInstances = new Array(len - 1),
    j = 0;
  for (var i = 0; i < len - 1; ++i) {
    var item = arguments[i];
    if (!util.isObject(item))
      return apiRejection(
        "Catch statement predicate: expecting an object but got " + util.classString(item)
      );

    catchInstances[j++] = item;
  }
  catchInstances.length = j;

  if (typeof (fn = arguments[i]) != "function")
    throw new TypeError(
      "The last argument to .catch() must be a function, got " + util.toString(fn)
    );

  return this.then(void 0, catchFilter(catchInstances, fn, this));
};

Promise.prototype.reflect = function() {
  return this._then(reflectHandler, reflectHandler, void 0, this, void 0);
};

Promise.prototype.then = function(didFulfill, didReject) {
  if (
    debug.warnings() && arguments.length > 0 &&
    typeof didFulfill != "function" &&
    typeof didReject != "function"
  ) {
    var msg =
      ".then() only accepts functions but was passed: " + util.classString(didFulfill);
    if (arguments.length > 1) msg += ", " + util.classString(didReject);

    this._warn(msg);
  }
  return this._then(didFulfill, didReject, void 0, void 0, void 0);
};

Promise.prototype.done = function(didFulfill, didReject) {
  this._then(didFulfill, didReject, void 0, void 0, void 0)._setIsFinal();
};

Promise.prototype.spread = function(fn) {
  return typeof fn != "function"
    ? apiRejection("expecting a function but got " + util.classString(fn))
    : this.all()._then(fn, void 0, void 0, APPLY, void 0);
};

Promise.prototype.toJSON = function() {
  var ret = {
    isFulfilled: false,
    isRejected: false,
    fulfillmentValue: void 0,
    rejectionReason: void 0
  };
  if (this.isFulfilled()) {
    ret.fulfillmentValue = this.value();
    ret.isFulfilled = true;
  } else if (this.isRejected()) {
    ret.rejectionReason = this.reason();
    ret.isRejected = true;
  }
  return ret;
};

Promise.prototype.all = function() {
  arguments.length > 0 && this._warn(".all() was passed arguments but it does not take any");

  return new PromiseArray(this).promise();
};

Promise.prototype.error = function(fn) {
  return this.caught(util.originatesFromRejection, fn);
};

Promise.getNewLibraryCopy = module.exports;

Promise.is = function(val) {
  return val instanceof Promise;
};

Promise.fromNode = Promise.fromCallback = function(fn) {
  var ret = new Promise(INTERNAL);
  ret._captureStackTrace();
  var multiArgs = arguments.length > 1 && !!Object(arguments[1]).multiArgs,
    result = tryCatch(fn)(nodebackForPromise(ret, multiArgs));
  result !== errorObj || ret._rejectCallback(result.e, true);

  ret._isFateSealed() || ret._setAsyncGuaranteed();
  return ret;
};

Promise.all = function(promises) {
  return new PromiseArray(promises).promise();
};

Promise.cast = function(obj) {
  var ret = tryConvertToPromise(obj);
  if (!(ret instanceof Promise)) {
    (ret = new Promise(INTERNAL))._captureStackTrace();
    ret._setFulfilled();
    ret._rejectionHandler0 = obj;
  }
  return ret;
};

Promise.resolve = Promise.fulfilled = Promise.cast;

Promise.reject = Promise.rejected = function(reason) {
  var ret = new Promise(INTERNAL);
  ret._captureStackTrace();
  ret._rejectCallback(reason, true);
  return ret;
};

Promise.setScheduler = function(fn) {
  if (typeof fn != "function")
    throw new TypeError("expecting a function but got " + util.classString(fn));

  return async.setScheduler(fn);
};

Promise.prototype._then = function(didFulfill, didReject, _, receiver, internalData) {
  var haveInternalData = internalData !== void 0,
    promise = haveInternalData ? internalData : new Promise(INTERNAL),
    target = this._target(),
    bitField = target._bitField;

  if (!haveInternalData) {
    promise._propagateFrom(this, 3);
    promise._captureStackTrace();
    if (receiver === void 0 && (this._bitField & 2097152) != 0)
      receiver = (bitField & 50397184) != 0
        ? this._boundValue()
        : target === this ? void 0 : this._boundTo;

    this._fireEvent("promiseChained", this, promise);
  }

  var context = getContext();
  if ((bitField & 50397184) == 0) {
    target._addCallbacks(didFulfill, didReject, promise, receiver, context);
    return promise;
  }

  var handler, value, settler = target._settlePromiseCtx;
  if ((bitField & 33554432) != 0) {
    value = target._rejectionHandler0;
    handler = didFulfill;
  } else if ((bitField & 16777216) != 0) {
    value = target._fulfillmentHandler0;
    handler = didReject;
    target._unsetRejectionIsUnhandled();
  } else {
    settler = target._settlePromiseLateCancellationObserver;
    value = new CancellationError("late cancellation observer");
    target._attachExtraTrace(value);
    handler = didReject;
  }

  async.invoke(settler, target, {
    handler: util.contextBind(context, handler),
    promise: promise,
    receiver: receiver,
    value: value
  });

  return promise;
};

Promise.prototype._length = function() {
  return this._bitField & 65535;
};

Promise.prototype._isFateSealed = function() {
  return (this._bitField & 117506048) != 0;
};

Promise.prototype._isFollowing = function() {
  return (this._bitField & 67108864) == 67108864;
};

Promise.prototype._setLength = function(len) {
  this._bitField = (this._bitField & -65536) | (len & 65535);
};

Promise.prototype._setFulfilled = function() {
  this._bitField = this._bitField | 33554432;
  this._fireEvent("promiseFulfilled", this);
};

Promise.prototype._setRejected = function() {
  this._bitField = this._bitField | 16777216;
  this._fireEvent("promiseRejected", this);
};

Promise.prototype._setFollowing = function() {
  this._bitField = this._bitField | 67108864;
  this._fireEvent("promiseResolved", this);
};

Promise.prototype._setIsFinal = function() {
  this._bitField = this._bitField | 4194304;
};

Promise.prototype._isFinal = function() {
  return (this._bitField & 4194304) > 0;
};

Promise.prototype._unsetCancelled = function() {
  this._bitField = this._bitField & ~65536;
};

Promise.prototype._setCancelled = function() {
  this._bitField = this._bitField | 65536;
  this._fireEvent("promiseCancelled", this);
};

Promise.prototype._setWillBeCancelled = function() {
  this._bitField = this._bitField | 8388608;
};

Promise.prototype._setAsyncGuaranteed = function() {
  if (async.hasCustomScheduler()) return;
  var bitField = this._bitField;
  this._bitField = bitField | (((bitField & 536870912) >> 2) ^ 134217728);
};

Promise.prototype._setNoAsyncGuarantee = function() {
  this._bitField = (this._bitField | 536870912) & ~134217728;
};

Promise.prototype._receiverAt = function(index) {
  var ret = index === 0 ? this._receiver0 : this[index * 4 - 4 + 3];
  return ret === UNDEFINED_BINDING
    ? void 0
    : ret === void 0 && this._isBound()
    ? this._boundValue()
    : ret;
};

Promise.prototype._promiseAt = function(index) {
  return this[index * 4 - 4 + 2];
};

Promise.prototype._fulfillmentHandlerAt = function(index) {
  return this[index * 4 - 4 + 0];
};

Promise.prototype._rejectionHandlerAt = function(index) {
  return this[index * 4 - 4 + 1];
};

Promise.prototype._boundValue = function() {};

Promise.prototype._migrateCallback0 = function(follower) {
  var fulfill = follower._fulfillmentHandler0,
    reject = follower._rejectionHandler0,
    promise = follower._promise0,
    receiver = follower._receiverAt(0);
  if (receiver === void 0) receiver = UNDEFINED_BINDING;
  this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._migrateCallbackAt = function(follower, index) {
  var fulfill = follower._fulfillmentHandlerAt(index),
    reject = follower._rejectionHandlerAt(index),
    promise = follower._promiseAt(index),
    receiver = follower._receiverAt(index);
  if (receiver === void 0) receiver = UNDEFINED_BINDING;
  this._addCallbacks(fulfill, reject, promise, receiver, null);
};

Promise.prototype._addCallbacks = function(fulfill, reject, promise, receiver, context) {
  var index = this._length();

  if (index >= 65531) {
    index = 0;
    this._setLength(0);
  }

  if (index === 0) {
    this._promise0 = promise;
    this._receiver0 = receiver;
    if (typeof fulfill == "function")
      this._fulfillmentHandler0 = util.contextBind(context, fulfill);

    if (typeof reject == "function")
      this._rejectionHandler0 = util.contextBind(context, reject);
  } else {
    var base = index * 4 - 4;
    this[base + 2] = promise;
    this[base + 3] = receiver;
    if (typeof fulfill == "function") this[base + 0] = util.contextBind(context, fulfill);

    if (typeof reject == "function") this[base + 1] = util.contextBind(context, reject);
  }
  this._setLength(index + 1);
  return index;
};

Promise.prototype._proxy = function(proxyable, arg) {
  this._addCallbacks(void 0, void 0, arg, proxyable, null);
};

Promise.prototype._resolveCallback = function(value, shouldBind) {
  if ((this._bitField & 117506048) != 0) return;
  if (value === this) return this._rejectCallback(makeSelfResolutionError(), false);
  var maybePromise = tryConvertToPromise(value, this);
  if (!(maybePromise instanceof Promise)) return this._fulfill(value);

  shouldBind && this._propagateFrom(maybePromise, 2);

  var promise = maybePromise._target();

  if (promise === this) {
    this._reject(makeSelfResolutionError());
    return;
  }

  var bitField = promise._bitField;
  if ((bitField & 50397184) == 0) {
    var len = this._length();
    len > 0 && promise._migrateCallback0(this);
    for (var i = 1; i < len; ++i) promise._migrateCallbackAt(this, i);

    this._setFollowing();
    this._setLength(0);
    this._setFollowee(maybePromise);
  } else if ((bitField & 33554432) != 0) this._fulfill(promise._value());
  else if ((bitField & 16777216) != 0) this._reject(promise._reason());
  else {
    var reason = new CancellationError("late cancellation observer");
    promise._attachExtraTrace(reason);
    this._reject(reason);
  }
};

Promise.prototype._rejectCallback = function(reason, synchronous, ignoreNonErrorWarnings) {
  var trace = util.ensureErrorObject(reason),
    hasStack = trace === reason;
  if (!hasStack && !ignoreNonErrorWarnings && debug.warnings()) {
    var message = "a promise was rejected with a non-error: " + util.classString(reason);
    this._warn(message, true);
  }
  this._attachExtraTrace(trace, !!synchronous && hasStack);
  this._reject(reason);
};

Promise.prototype._resolveFromExecutor = function(executor) {
  if (executor === INTERNAL) return;
  var promise = this;
  this._captureStackTrace();
  this._pushContext();
  var synchronous = true;
  var r = this._execute(executor, function(value) {
    promise._resolveCallback(value);
  }, function(reason) {
    promise._rejectCallback(reason, synchronous);
  });
  synchronous = false;
  this._popContext();

  r === void 0 || promise._rejectCallback(r, true);
};

Promise.prototype._settlePromiseFromHandler = function(handler, receiver, value, promise) {
  var bitField = promise._bitField;
  if ((bitField & 65536) != 0) return;
  promise._pushContext();
  var x;
  receiver !== APPLY
    ? (x = tryCatch(handler).call(receiver, value))
    : !value || typeof value.length != "number"
    ? ((x = errorObj).e = new TypeError(
        "cannot .spread() a non-array: " + util.classString(value)
      ))
    : (x = tryCatch(handler).apply(this._boundValue(), value));

  var promiseCreated = promise._popContext();
  if (((bitField = promise._bitField) & 65536) != 0) return;

  if (x === NEXT_FILTER) promise._reject(value);
  else if (x === errorObj) promise._rejectCallback(x.e, false);
  else {
    debug.checkForgottenReturns(x, promiseCreated, "", promise, this);
    promise._resolveCallback(x);
  }
};

Promise.prototype._target = function() {
  var ret = this;
  while (ret._isFollowing()) ret = ret._followee();
  return ret;
};

Promise.prototype._followee = function() {
  return this._rejectionHandler0;
};

Promise.prototype._setFollowee = function(promise) {
  this._rejectionHandler0 = promise;
};

Promise.prototype._settlePromise = function(promise, handler, receiver, value) {
  var isPromise = promise instanceof Promise,
    bitField = this._bitField,
    asyncGuaranteed = (bitField & 134217728) != 0;
  if ((bitField & 65536) != 0) {
    isPromise && promise._invokeInternalOnCancel();

    if (receiver instanceof PassThroughHandlerContext && receiver.isFinallyHandler()) {
      receiver.cancelPromise = promise;
      tryCatch(handler).call(receiver, value) !== errorObj || promise._reject(errorObj.e);
    } else
      handler === reflectHandler
        ? promise._fulfill(reflectHandler.call(receiver))
        : receiver instanceof Proxyable
        ? receiver._promiseCancelled(promise)
        : isPromise || promise instanceof PromiseArray
        ? promise._cancel()
        : receiver.cancel();
  } else if (typeof handler == "function")
    if (!isPromise) handler.call(receiver, value, promise);
    else {
      asyncGuaranteed && promise._setAsyncGuaranteed();
      this._settlePromiseFromHandler(handler, receiver, value, promise);
    }
  else if (receiver instanceof Proxyable)
    receiver._isResolved() ||
      ((bitField & 33554432) != 0
        ? receiver._promiseFulfilled(value, promise)
        : receiver._promiseRejected(value, promise));
  else if (isPromise) {
    asyncGuaranteed && promise._setAsyncGuaranteed();
    (bitField & 33554432) != 0 ? promise._fulfill(value) : promise._reject(value);
  }
};

Promise.prototype._settlePromiseLateCancellationObserver = function(ctx) {
  var handler = ctx.handler,
    promise = ctx.promise,
    receiver = ctx.receiver,
    value = ctx.value;
  typeof handler != "function"
    ? promise instanceof Promise && promise._reject(value)
    : promise instanceof Promise
    ? this._settlePromiseFromHandler(handler, receiver, value, promise)
    : handler.call(receiver, value, promise);
};

Promise.prototype._settlePromiseCtx = function(ctx) {
  this._settlePromise(ctx.promise, ctx.handler, ctx.receiver, ctx.value);
};

Promise.prototype._settlePromise0 = function(handler, value, bitField) {
  var promise = this._promise0,
    receiver = this._receiverAt(0);
  this._promise0 = void 0;
  this._receiver0 = void 0;
  this._settlePromise(promise, handler, receiver, value);
};

Promise.prototype._clearCallbackDataAtIndex = function(index) {
  var base = index * 4 - 4;
  this[base + 2] = this[base + 3] = this[base + 0] = this[base + 1] = void 0;
};

Promise.prototype._fulfill = function(value) {
  var bitField = this._bitField;
  if ((bitField & 117506048) >>> 16) return;
  if (value === this) {
    var err = makeSelfResolutionError();
    this._attachExtraTrace(err);
    return this._reject(err);
  }
  this._setFulfilled();
  this._rejectionHandler0 = value;

  if ((bitField & 65535) > 0) {
    (bitField & 134217728) != 0 ? this._settlePromises() : async.settlePromises(this);

    this._dereferenceTrace();
  }
};

Promise.prototype._reject = function(reason) {
  var bitField = this._bitField;
  if ((bitField & 117506048) >>> 16) return;
  this._setRejected();
  this._fulfillmentHandler0 = reason;

  if (this._isFinal()) return async.fatalError(reason, util.isNode);

  (bitField & 65535) > 0
    ? async.settlePromises(this)
    : this._ensurePossibleRejectionHandled();
};

Promise.prototype._fulfillPromises = function(len, value) {
  for (var i = 1; i < len; i++) {
    var handler = this._fulfillmentHandlerAt(i),
      promise = this._promiseAt(i),
      receiver = this._receiverAt(i);
    this._clearCallbackDataAtIndex(i);
    this._settlePromise(promise, handler, receiver, value);
  }
};

Promise.prototype._rejectPromises = function(len, reason) {
  for (var i = 1; i < len; i++) {
    var handler = this._rejectionHandlerAt(i),
      promise = this._promiseAt(i),
      receiver = this._receiverAt(i);
    this._clearCallbackDataAtIndex(i);
    this._settlePromise(promise, handler, receiver, reason);
  }
};

Promise.prototype._settlePromises = function() {
  var bitField = this._bitField,
    len = bitField & 65535;

  if (len > 0) {
    if ((bitField & 16842752) != 0) {
      var reason = this._fulfillmentHandler0;
      this._settlePromise0(this._rejectionHandler0, reason, bitField);
      this._rejectPromises(len, reason);
    } else {
      var value = this._rejectionHandler0;
      this._settlePromise0(this._fulfillmentHandler0, value, bitField);
      this._fulfillPromises(len, value);
    }
    this._setLength(0);
  }
  this._clearCancellationData();
};

Promise.prototype._settledValue = function() {
  var bitField = this._bitField;
  return (bitField & 33554432) != 0
    ? this._rejectionHandler0
    : (bitField & 16777216) != 0
    ? this._fulfillmentHandler0
    : void 0;
};

typeof Symbol != "undefined" && Symbol.toStringTag &&
  es5.defineProperty(Promise.prototype, Symbol.toStringTag, {
    get: function() {
      return "Object";
    }
  });

function deferResolve(v) { this.promise._resolveCallback(v); }
function deferReject(v) { this.promise._rejectCallback(v, false); }

Promise.defer = Promise.pending = function() {
  debug.deprecated("Promise.defer", "new Promise");
  return {promise: new Promise(INTERNAL), resolve: deferResolve, reject: deferReject};
};

util.notEnumerableProp(Promise, "_makeSelfResolutionError", makeSelfResolutionError);

__wpreq__("./method")(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug);
__wpreq__("./bind")(Promise, INTERNAL, tryConvertToPromise, debug);
__wpreq__("./cancel")(Promise, PromiseArray, apiRejection, debug);
__wpreq__("./direct_resolve")(Promise);
__wpreq__("./synchronous_inspection")(Promise);
__wpreq__("./join")(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async);
Promise.Promise = Promise;
Promise.version = "3.7.2";
__wpreq__("./call_get")(Promise);
__wpreq__("./generators")(
  Promise, apiRejection, INTERNAL, tryConvertToPromise, Proxyable, debug
);
__wpreq__("./map")(Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug);
__wpreq__("./nodeify")(Promise);
__wpreq__("./promisify")(Promise, INTERNAL);
__wpreq__("./props")(Promise, PromiseArray, tryConvertToPromise, apiRejection);
__wpreq__("./race")(Promise, INTERNAL, tryConvertToPromise, apiRejection);
__wpreq__("./reduce")(
  Promise, PromiseArray, apiRejection, tryConvertToPromise, INTERNAL, debug
);
__wpreq__("./settle")(Promise, PromiseArray, debug);
__wpreq__("./some")(Promise, PromiseArray, apiRejection);
__wpreq__("./timers")(Promise, INTERNAL, debug);
__wpreq__("./using")(
  Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug
);
__wpreq__("./any")(Promise);
__wpreq__("./each")(Promise, INTERNAL);
__wpreq__("./filter")(Promise, INTERNAL);

util.toFastProperties(Promise);
util.toFastProperties(Promise.prototype);
function fillTypes(value) {
  var p = new Promise(INTERNAL);
  p._fulfillmentHandler0 = value;
  p._rejectionHandler0 = value;
  p._promise0 = value;
  p._receiver0 = value;
}
fillTypes({a: 1});
fillTypes({b: 2});
fillTypes({c: 3});
fillTypes(1);
fillTypes(function() {});
fillTypes(void 0);
fillTypes(false);
fillTypes(new Promise(INTERNAL));
debug.setBounds(Async.firstLineError, util.lastLineError);

return Promise;
};

},
"./util":
function(module, exports, __wpreq__) {

var tryCatchTarget,
  es5 = __wpreq__("./es5"),
  canEvaluate = typeof navigator == "undefined",

  errorObj = {e: {}};
var globalObject = typeof self != "undefined" ? self
  : typeof window != "undefined" ? window
  : typeof global != "undefined" ? global
  : this !== void 0 ? this : null;

function tryCatcher() {
  try {
    var target = tryCatchTarget;
    tryCatchTarget = null;
    return target.apply(this, arguments);
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}
function tryCatch(fn) {
  tryCatchTarget = fn;
  return tryCatcher;
}

var inherits = function(Child, Parent) {
  var hasProp = {}.hasOwnProperty;

  function T() {
    this.constructor = Child;
    this.constructor$ = Parent;
    for (var propertyName in Parent.prototype)
      hasProp.call(Parent.prototype, propertyName) &&
        propertyName.charAt(propertyName.length - 1) !== "$" &&
        (this[propertyName + "$"] = Parent.prototype[propertyName]);
  }
  T.prototype = Parent.prototype;
  Child.prototype = new T();
  return Child.prototype;
};

function isPrimitive(val) {
  return val == null || val === true || val === false ||
    typeof val == "string" || typeof val == "number";
}

function isObject(value) {
  return typeof value == "function" || (typeof value == "object" && value !== null);
}

function maybeWrapAsError(maybeError) {
  return !isPrimitive(maybeError) ? maybeError : new Error(safeToString(maybeError));
}

function withAppended(target, appendee) {
  var len = target.length,
    ret = new Array(len + 1);
  for (var i = 0; i < len; ++i) ret[i] = target[i];

  ret[i] = appendee;
  return ret;
}

function getDataPropertyOrDefault(obj, key, defaultValue) {
  if (!es5.isES5) return {}.hasOwnProperty.call(obj, key) ? obj[key] : void 0;

  var desc = Object.getOwnPropertyDescriptor(obj, key);

  if (desc != null) return desc.get == null && desc.set == null ? desc.value : defaultValue;
}

function notEnumerableProp(obj, name, value) {
  if (isPrimitive(obj)) return obj;
  var descriptor = {value: value, configurable: true, enumerable: false, writable: true};
  es5.defineProperty(obj, name, descriptor);
  return obj;
}

function thrower(r) {
  throw r;
}

var inheritedDataKeys = (function() {
  var excludedPrototypes = [Array.prototype, Object.prototype, Function.prototype];

  var isExcludedProto = function(val) {
    for (var i = 0; i < excludedPrototypes.length; ++i)
      if (excludedPrototypes[i] === val) return true;

    return false;
  };

  if (es5.isES5) {
    var getKeys = Object.getOwnPropertyNames;
    return function(obj) {
      var ret = [];
      for (var visitedKeys = Object.create(null); obj != null && !isExcludedProto(obj); ) {
        var keys;
        try {
          keys = getKeys(obj);
        } catch (_) {
          return ret;
        }
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          if (visitedKeys[key]) continue;
          visitedKeys[key] = true;
          var desc = Object.getOwnPropertyDescriptor(obj, key);
          desc == null || desc.get != null || desc.set != null || ret.push(key);
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

    enumeration: for (var key in obj)
      if (hasProp.call(obj, key)) ret.push(key);
      else {
        for (var i = 0; i < excludedPrototypes.length; ++i)
          if (hasProp.call(excludedPrototypes[i], key)) continue enumeration;

        ret.push(key);
      }

    return ret;
  };
})();

var thisAssignmentPattern = /this\s*\.\s*\S+\s*=/;
function isClass(fn) {
  try {
    if (typeof fn != "function") return false;

    var keys = es5.names(fn.prototype),

      hasMethods = es5.isES5 && keys.length > 1,
      hasMethodsOtherThanConstructor =
        keys.length > 0 && (keys.length !== 1 || keys[0] !== "constructor"),
      hasThisAssignmentAndStaticMethods =
        thisAssignmentPattern.test(fn + "") && es5.names(fn).length > 0;

    return !!(
      hasMethods || hasMethodsOtherThanConstructor || hasThisAssignmentAndStaticMethods
    );
  } catch (_) {
    return false;
  }
}

function toFastProperties(obj) {
  function FakeConstructor() {}
  FakeConstructor.prototype = obj;
  var receiver = new FakeConstructor();
  function ic() {
    return typeof receiver.foo;
  }
  ic();
  ic();
  return obj;
  eval(obj);
}

var rident = /^[a-z$_][a-z$_0-9]*$/i;
function isIdentifier(str) {
  return rident.test(str);
}

function filledRange(count, prefix, suffix) {
  var ret = new Array(count);
  for (var i = 0; i < count; ++i) ret[i] = prefix + i + suffix;

  return ret;
}

function safeToString(obj) {
  try {
    return obj + "";
  } catch (_) {
    return "[no string representation]";
  }
}

function isError(obj) {
  return obj instanceof Error ||
    (obj !== null &&
      typeof obj == "object" &&
      typeof obj.message == "string" &&
      typeof obj.name == "string");
}

function markAsOriginatingFromRejection(e) {
  try {
    notEnumerableProp(e, "isOperational", true);
  } catch (_) {}
}

function originatesFromRejection(e) {
  return e != null &&
    (e instanceof Error.__BluebirdErrorTypes__.OperationalError || e.isOperational === true);
}

function canAttachTrace(obj) {
  return isError(obj) && es5.propertyIsWritable(obj, "stack");
}

var ensureErrorObject = (function() {
  return "stack" in new Error() ? function(value) {
    return canAttachTrace(value) ? value : new Error(safeToString(value));
  } : function(value) {
    if (canAttachTrace(value)) return value;
    try {
      throw new Error(safeToString(value));
    } catch (err) {
      return err;
    }
  };
})();

function classString(obj) {
  return {}.toString.call(obj);
}

function copyDescriptors(from, to, filter) {
  for (var keys = es5.names(from), i = 0; i < keys.length; ++i) {
    var key = keys[i];
    if (filter(key))
      try {
        es5.defineProperty(to, key, es5.getDescriptor(from, key));
      } catch (_) {}
  }
}

var asArray = function(v) {
  return es5.isArray(v) ? v : null;
};

if (typeof Symbol != "undefined" && Symbol.iterator) {
  var ArrayFrom = typeof Array.from == "function" ? function(v) {
    return Array.from(v);
  } : function(v) {
    var ret = [];
    for (var itResult, it = v[Symbol.iterator](); !(itResult = it.next()).done; )
      ret.push(itResult.value);

    return ret;
  };

  asArray = function(v) {
    return es5.isArray(v)
      ? v
      : v != null && typeof v[Symbol.iterator] == "function"
      ? ArrayFrom(v)
      : null;
  };
}

var reflectHandler,
  isNode =
    typeof process != "undefined" && classString(process).toLowerCase() === "[object process]",

  hasEnvVariables = typeof process != "undefined" && process.env !== void 0;

function env(key) {
  return hasEnvVariables ? process.env[key] : void 0;
}

function getNativePromise() {
  if (typeof Promise == "function")
    try {
      if (classString(new Promise(function() {})) === "[object Promise]") return Promise;
    } catch (_) {}
}

function contextBind(ctx, cb) {
  if (ctx === null || typeof cb != "function" || cb === reflectHandler) return cb;

  if (ctx.domain !== null) cb = ctx.domain.bind(cb);

  var async = ctx.async;
  if (async !== null) {
    var old = cb;
    cb = function() {
      var args = [].slice.call(arguments);
      args.unshift(old, this);
      return async.runInAsyncScope.apply(async, args);
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
};
ret.isRecentNode = ret.isNode && (function() {
  var version;
  if (process.versions && process.versions.node)
    version = process.versions.node.split(".").map(Number);
  else if (process.version) version = process.version.slice(1).split(".").map(Number);

  return version[0] > 0 || (version[0] === 0 && version[1] > 10);
})();
ret.nodeSupportsAsyncResource = ret.isNode && (function() {
  var supportsAsync = false;
  try {
    supportsAsync =
      typeof __wpreq__("async_hooks").AsyncResource.prototype.runInAsyncScope == "function";
  } catch (_) {
    supportsAsync = false;
  }
  return supportsAsync;
})();

ret.isNode && ret.toFastProperties(process);

try {
  throw new Error();
} catch (e) {
  ret.lastLineError = e;
}
module.exports = ret;

},
"./es5":
function(module) {

var isES5 = (function() {
  return this === void 0;
})();

if (isES5)
  module.exports = {
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
  };
else {
  var has = {}.hasOwnProperty,
    str = {}.toString,
    proto = {}.constructor.prototype;

  var ObjectKeys = function(o) {
    var ret = [];
    for (var key in o) has.call(o, key) && ret.push(key);

    return ret;
  };

  var ObjectGetDescriptor = function(o, key) {
    return {value: o[key]};
  };

  var ObjectDefineProperty = function(o, key, desc) {
    o[key] = desc.value;
    return o;
  };

  var ObjectFreeze = function(obj) {
    return obj;
  };

  var ObjectGetPrototypeOf = function(obj) {
    try {
      return Object(obj).constructor.prototype;
    } catch (_) {
      return proto;
    }
  };

  var ArrayIsArray = function(obj) {
    try {
      return str.call(obj) === "[object Array]";
    } catch (_) {
      return false;
    }
  };

  module.exports = {
    isArray: ArrayIsArray,
    keys: ObjectKeys,
    names: ObjectKeys,
    defineProperty: ObjectDefineProperty,
    getDescriptor: ObjectGetDescriptor,
    freeze: ObjectFreeze,
    getPrototypeOf: ObjectGetPrototypeOf,
    isES5: isES5,
    propertyIsWritable: function() {
      return true;
    }
  };
}

},
async_hooks:
function(module) {

module.exports = require("async_hooks");

},
"./async":
function(module, exports, __wpreq__) {

var firstLineError;
try {
  throw new Error();
} catch (e) {
  firstLineError = e;
}
var schedule = __wpreq__("./schedule"),
  Queue = __wpreq__("./queue");

function Async() {
  this._customScheduler = false;
  this._isTickUsed = false;
  this._lateQueue = new Queue(16);
  this._normalQueue = new Queue(16);
  this._haveDrainedQueues = false;
  var self = this;
  this.drainQueues = function() {
    self._drainQueues();
  };
  this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
  var prev = this._schedule;
  this._schedule = fn;
  this._customScheduler = true;
  return prev;
};

Async.prototype.hasCustomScheduler = function() {
  return this._customScheduler;
};

Async.prototype.haveItemsQueued = function() {
  return this._isTickUsed || this._haveDrainedQueues;
};

Async.prototype.fatalError = function(e, isNode) {
  if (isNode) {
    process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) + "\n");
    process.exit(2);
  } else this.throwLater(e);
};

Async.prototype.throwLater = function(fn, arg) {
  if (arguments.length === 1) {
    arg = fn;
    fn = function() { throw arg; };
  }
  if (typeof setTimeout != "undefined")
    setTimeout(function() {
      fn(arg);
    }, 0);
  else
    try {
      this._schedule(function() {
        fn(arg);
      });
    } catch (_) {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
  this._lateQueue.push(fn, receiver, arg);
  this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
  this._normalQueue.push(fn, receiver, arg);
  this._queueTick();
}

function AsyncSettlePromises(promise) {
  this._normalQueue._pushOne(promise);
  this._queueTick();
}

Async.prototype.invokeLater = AsyncInvokeLater;
Async.prototype.invoke = AsyncInvoke;
Async.prototype.settlePromises = AsyncSettlePromises;

function _drainQueue(queue) {
  while (queue.length() > 0) _drainQueueStep(queue);
}

function _drainQueueStep(queue) {
  var fn = queue.shift();
  if (typeof fn != "function") fn._settlePromises();
  else {
    var receiver = queue.shift(),
      arg = queue.shift();
    fn.call(receiver, arg);
  }
}

Async.prototype._drainQueues = function() {
  _drainQueue(this._normalQueue);
  this._reset();
  this._haveDrainedQueues = true;
  _drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function() {
  if (!this._isTickUsed) {
    this._isTickUsed = true;
    this._schedule(this.drainQueues);
  }
};

Async.prototype._reset = function() {
  this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;

},
"./schedule":
function(module, exports, __wpreq__) {

var schedule,
  util = __wpreq__("./util");
var noAsyncScheduler = function() {
  throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n");
};
var NativePromise = util.getNativePromise();
if (util.isNode && typeof MutationObserver == "undefined") {
  var GlobalSetImmediate = global.setImmediate,
    ProcessNextTick = process.nextTick;
  schedule = util.isRecentNode
    ? function(fn) { GlobalSetImmediate.call(global, fn); }
    : function(fn) { ProcessNextTick.call(process, fn); };
} else if (typeof NativePromise == "function" && typeof NativePromise.resolve == "function") {
  var nativePromise = NativePromise.resolve();
  schedule = function(fn) {
    nativePromise.then(fn);
  };
} else if (
  typeof MutationObserver != "undefined" &&
  !(typeof window != "undefined" &&
  window.navigator &&
  (window.navigator.standalone || window.cordova)) &&
  "classList" in document.documentElement
)
  schedule = (function() {
    var div = document.createElement("div"),
      opts = {attributes: true},
      toggleScheduled = false,
      div2 = document.createElement("div");
    new MutationObserver(function() {
      div.classList.toggle("foo");
      toggleScheduled = false;
    }).observe(div2, opts);

    var scheduleToggle = function() {
      if (toggleScheduled) return;
      toggleScheduled = true;
      div2.classList.toggle("foo");
    };

    return function(fn) {
      var o = new MutationObserver(function() {
        o.disconnect();
        fn();
      });
      o.observe(div, opts);
      scheduleToggle();
    };
  })();
else
  schedule = typeof setImmediate != "undefined"
    ? function(fn) {
        setImmediate(fn);
      }
    : typeof setTimeout != "undefined"
    ? function(fn) {
        setTimeout(fn, 0);
      }
    : noAsyncScheduler;

module.exports = schedule;

},
"./queue":
function(module) {

function arrayMove(src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex];
    src[j + srcIndex] = void 0;
  }
}

function Queue(capacity) {
  this._capacity = capacity;
  this._length = 0;
  this._front = 0;
}

Queue.prototype._willBeOverCapacity = function(size) {
  return this._capacity < size;
};

Queue.prototype._pushOne = function(arg) {
  var length = this.length();
  this._checkCapacity(length + 1);
  this[(this._front + length) & (this._capacity - 1)] = arg;
  this._length = length + 1;
};

Queue.prototype.push = function(fn, receiver, arg) {
  var length = this.length() + 3;
  if (this._willBeOverCapacity(length)) {
    this._pushOne(fn);
    this._pushOne(receiver);
    this._pushOne(arg);
    return;
  }
  var j = this._front + length - 3;
  this._checkCapacity(length);
  var wrapMask = this._capacity - 1;
  this[(j + 0) & wrapMask] = fn;
  this[(j + 1) & wrapMask] = receiver;
  this[(j + 2) & wrapMask] = arg;
  this._length = length;
};

Queue.prototype.shift = function() {
  var front = this._front,
    ret = this[front];

  this[front] = void 0;
  this._front = (front + 1) & (this._capacity - 1);
  this._length--;
  return ret;
};

Queue.prototype.length = function() {
  return this._length;
};

Queue.prototype._checkCapacity = function(size) {
  this._capacity < size && this._resizeTo(this._capacity << 1);
};

Queue.prototype._resizeTo = function(capacity) {
  var oldCapacity = this._capacity;
  this._capacity = capacity;
  arrayMove(this, 0, this, oldCapacity, (this._front + this._length) & (oldCapacity - 1));
};

module.exports = Queue;

},
"./errors":
function(module, exports, __wpreq__) {

var _TypeError, _RangeError,
  es5 = __wpreq__("./es5"),
  Objectfreeze = es5.freeze,
  util = __wpreq__("./util"),
  inherits = util.inherits,
  notEnumerableProp = util.notEnumerableProp;

function subError(nameProperty, defaultMessage) {
  function SubError(message) {
    if (!(this instanceof SubError)) return new SubError(message);
    notEnumerableProp(this, "message", typeof message == "string" ? message : defaultMessage);
    notEnumerableProp(this, "name", nameProperty);
    Error.captureStackTrace
      ? Error.captureStackTrace(this, this.constructor)
      : Error.call(this);
  }
  inherits(SubError, Error);
  return SubError;
}

var Warning = subError("Warning", "warning"),
  CancellationError = subError("CancellationError", "cancellation error"),
  TimeoutError = subError("TimeoutError", "timeout error"),
  AggregateError = subError("AggregateError", "aggregate error");
try {
  _TypeError = TypeError;
  _RangeError = RangeError;
} catch (_) {
  _TypeError = subError("TypeError", "type error");
  _RangeError = subError("RangeError", "range error");
}

var methods =
  "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" ");

for (var i = 0; i < methods.length; ++i)
  if (typeof Array.prototype[methods[i]] == "function")
    AggregateError.prototype[methods[i]] = Array.prototype[methods[i]];

es5.defineProperty(AggregateError.prototype, "length", {
  value: 0,
  configurable: false,
  writable: true,
  enumerable: true
});
AggregateError.prototype.isOperational = true;
var level = 0;
AggregateError.prototype.toString = function() {
  var indent = Array(level * 4 + 1).join(" "),
    ret = "\n" + indent + "AggregateError of:\n";
  level++;
  indent = Array(level * 4 + 1).join(" ");
  for (var i = 0; i < this.length; ++i) {
    var str = this[i] === this ? "[Circular AggregateError]" : this[i] + "",
      lines = str.split("\n");
    for (var j = 0; j < lines.length; ++j) lines[j] = indent + lines[j];

    ret += (str = lines.join("\n")) + "\n";
  }
  level--;
  return ret;
};

function OperationalError(message) {
  if (!(this instanceof OperationalError)) return new OperationalError(message);
  notEnumerableProp(this, "name", "OperationalError");
  notEnumerableProp(this, "message", message);
  this.cause = message;
  this.isOperational = true;

  if (message instanceof Error) {
    notEnumerableProp(this, "message", message.message);
    notEnumerableProp(this, "stack", message.stack);
  } else Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
}
inherits(OperationalError, Error);

var errorTypes = Error.__BluebirdErrorTypes__;
if (!errorTypes) {
  errorTypes = Objectfreeze({
    CancellationError: CancellationError,
    TimeoutError: TimeoutError,
    OperationalError: OperationalError,
    RejectionError: OperationalError,
    AggregateError: AggregateError
  });
  es5.defineProperty(Error, "__BluebirdErrorTypes__", {
    value: errorTypes,
    writable: false,
    enumerable: false,
    configurable: false
  });
}

module.exports = {
  Error: Error,
  TypeError: _TypeError,
  RangeError: _RangeError,
  CancellationError: errorTypes.CancellationError,
  OperationalError: errorTypes.OperationalError,
  TimeoutError: errorTypes.TimeoutError,
  AggregateError: errorTypes.AggregateError,
  Warning: Warning
};

},
"./thenables":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL) {
var util = __wpreq__("./util"),
  errorObj = util.errorObj,
  isObject = util.isObject;

function tryConvertToPromise(obj, context) {
  if (!isObject(obj) || obj instanceof Promise) return obj;

  var then = getThen(obj);
  if (then === errorObj) {
    context && context._pushContext();
    var ret = Promise.reject(then.e);
    context && context._popContext();
    return ret;
  }
  if (typeof then != "function") return obj;

  if (isAnyBluebirdPromise(obj)) {
    ret = new Promise(INTERNAL);
    obj._then(ret._fulfill, ret._reject, void 0, ret, null);
    return ret;
  }
  return doThenable(obj, then, context);
}

function doGetThen(obj) {
  return obj.then;
}

function getThen(obj) {
  try {
    return doGetThen(obj);
  } catch (e) {
    errorObj.e = e;
    return errorObj;
  }
}

var hasProp = {}.hasOwnProperty;
function isAnyBluebirdPromise(obj) {
  try {
    return hasProp.call(obj, "_promise0");
  } catch (_) {
    return false;
  }
}

function doThenable(x, then, context) {
  var promise = new Promise(INTERNAL),
    ret = promise;
  context && context._pushContext();
  promise._captureStackTrace();
  context && context._popContext();
  var synchronous = true,
    result = util.tryCatch(then).call(x, resolve, reject);
  synchronous = false;

  if (promise && result === errorObj) {
    promise._rejectCallback(result.e, true, true);
    promise = null;
  }

  function resolve(value) {
    if (!promise) return;
    promise._resolveCallback(value);
    promise = null;
  }

  function reject(reason) {
    if (!promise) return;
    promise._rejectCallback(reason, synchronous, true);
    promise = null;
  }
  return ret;
}

return tryConvertToPromise;
};

},
"./promise_array":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, Proxyable) {
var util = __wpreq__("./util");

function toResolutionValue(val) {
  switch (val) {
  case -2: return [];
  case -3: return {};
  case -6: return new Map();
  }
}

function PromiseArray(values) {
  var promise = (this._promise = new Promise(INTERNAL));
  if (values instanceof Promise) {
    promise._propagateFrom(values, 3);
    values.suppressUnhandledRejections();
  }
  promise._setOnCancel(this);
  this._values = values;
  this._length = 0;
  this._totalResolved = 0;
  this._init(void 0, -2);
}
util.inherits(PromiseArray, Proxyable);

PromiseArray.prototype.length = function() {
  return this._length;
};

PromiseArray.prototype.promise = function() {
  return this._promise;
};

PromiseArray.prototype._init = function init(_, resolveValueIfEmpty) {
  var values = tryConvertToPromise(this._values, this._promise);
  if (values instanceof Promise) {
    var bitField = (values = values._target())._bitField;

    this._values = values;

    if ((bitField & 50397184) == 0) {
      this._promise._setAsyncGuaranteed();
      return values._then(init, this._reject, void 0, this, resolveValueIfEmpty);
    }
    if ((bitField & 33554432) == 0)
      return (bitField & 16777216) != 0 ? this._reject(values._reason()) : this._cancel();

    values = values._value();
  }
  if ((values = util.asArray(values)) === null) {
    var err = apiRejection(
      "expecting an array or an iterable object but got " + util.classString(values)
    ).reason();
    this._promise._rejectCallback(err, false);
    return;
  }

  values.length !== 0
    ? this._iterate(values)

    : resolveValueIfEmpty === -5
    ? this._resolveEmptyArray()
    : this._resolve(toResolutionValue(resolveValueIfEmpty));
};

PromiseArray.prototype._iterate = function(values) {
  var len = this.getActualLength(values.length);
  this._length = len;
  this._values = this.shouldCopyValues() ? new Array(len) : this._values;
  var result = this._promise,
    isResolved = false;
  for (var bitField = null, i = 0; i < len; ++i) {
    var maybePromise = tryConvertToPromise(values[i], result);

    bitField = maybePromise instanceof Promise
      ? (maybePromise = maybePromise._target())._bitField
      : null;

    if (isResolved) bitField === null || maybePromise.suppressUnhandledRejections();
    else if (bitField !== null)
      if ((bitField & 50397184) == 0) {
        maybePromise._proxy(this, i);
        this._values[i] = maybePromise;
      } else
        isResolved = (bitField & 33554432) != 0
          ? this._promiseFulfilled(maybePromise._value(), i)
          : (bitField & 16777216) != 0
          ? this._promiseRejected(maybePromise._reason(), i)
          : this._promiseCancelled(i);
    else isResolved = this._promiseFulfilled(maybePromise, i);
  }
  isResolved || result._setAsyncGuaranteed();
};

PromiseArray.prototype._isResolved = function() {
  return this._values === null;
};

PromiseArray.prototype._resolve = function(value) {
  this._values = null;
  this._promise._fulfill(value);
};

PromiseArray.prototype._cancel = function() {
  if (this._isResolved() || !this._promise._isCancellable()) return;
  this._values = null;
  this._promise._cancel();
};

PromiseArray.prototype._reject = function(reason) {
  this._values = null;
  this._promise._rejectCallback(reason, false);
};

PromiseArray.prototype._promiseFulfilled = function(value, index) {
  this._values[index] = value;
  if (++this._totalResolved >= this._length) {
    this._resolve(this._values);
    return true;
  }
  return false;
};

PromiseArray.prototype._promiseCancelled = function() {
  this._cancel();
  return true;
};

PromiseArray.prototype._promiseRejected = function(reason) {
  this._totalResolved++;
  this._reject(reason);
  return true;
};

PromiseArray.prototype._resultCancelled = function() {
  if (this._isResolved()) return;
  var values = this._values;
  this._cancel();
  if (values instanceof Promise) values.cancel();
  else for (var i = 0; i < values.length; ++i)
      values[i] instanceof Promise && values[i].cancel();
};

PromiseArray.prototype.shouldCopyValues = function() {
  return true;
};

PromiseArray.prototype.getActualLength = function(len) {
  return len;
};

return PromiseArray;
};

},
"./context":
function(module) {

module.exports = function(Promise) {
var longStackTraces = false,
  contextStack = [];

Promise.prototype._promiseCreated = function() {};
Promise.prototype._pushContext = function() {};
Promise.prototype._popContext = function() { return null; };
Promise._peekContext = Promise.prototype._peekContext = function() {};

function Context() {
  this._trace = new Context.CapturedTrace(peekContext());
}
Context.prototype._pushContext = function() {
  if (this._trace !== void 0) {
    this._trace._promiseCreated = null;
    contextStack.push(this._trace);
  }
};

Context.prototype._popContext = function() {
  if (this._trace === void 0) return null;

  var trace = contextStack.pop(),
    ret = trace._promiseCreated;
  trace._promiseCreated = null;
  return ret;
};

function createContext() {
  if (longStackTraces) return new Context();
}

function peekContext() {
  var lastIndex = contextStack.length - 1;
  return lastIndex >= 0 ? contextStack[lastIndex] : void 0;
}
Context.CapturedTrace = null;
Context.create = createContext;
Context.deactivateLongStackTraces = function() {};
Context.activateLongStackTraces = function() {
  var Promise_pushContext = Promise.prototype._pushContext,
    Promise_popContext = Promise.prototype._popContext,
    Promise_PeekContext = Promise._peekContext,
    Promise_peekContext = Promise.prototype._peekContext,
    Promise_promiseCreated = Promise.prototype._promiseCreated;
  Context.deactivateLongStackTraces = function() {
    Promise.prototype._pushContext = Promise_pushContext;
    Promise.prototype._popContext = Promise_popContext;
    Promise._peekContext = Promise_PeekContext;
    Promise.prototype._peekContext = Promise_peekContext;
    Promise.prototype._promiseCreated = Promise_promiseCreated;
    longStackTraces = false;
  };
  longStackTraces = true;
  Promise.prototype._pushContext = Context.prototype._pushContext;
  Promise.prototype._popContext = Context.prototype._popContext;
  Promise._peekContext = Promise.prototype._peekContext = peekContext;
  Promise.prototype._promiseCreated = function() {
    var ctx = this._peekContext();
    if (ctx && ctx._promiseCreated == null) ctx._promiseCreated = this;
  };
};
return Context;
};

},
"./debuggability":
function(module, exports, __wpreq__) {

module.exports = function(Promise, Context, enableAsyncHooks, disableAsyncHooks) {
var unhandledRejectionHandled,
  possiblyUnhandledRejection,
  printWarning,
  deferUnhandledRejectionCheck,
  async = Promise._async,
  Warning = __wpreq__("./errors").Warning,
  util = __wpreq__("./util"),
  es5 = __wpreq__("./es5"),
  canAttachTrace = util.canAttachTrace,
  bluebirdFramePattern = /[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,
  nodeFramePattern = /\((?:timers\.js):\d+:\d+\)/,
  parseLinePattern = /[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,
  stackFramePattern = null,
  formatStack = null,
  indentStackFrames = false,
  debugging = util.env("BLUEBIRD_DEBUG") != 0 &&
    (!!util.env("BLUEBIRD_DEBUG") || util.env("NODE_ENV") === "development"),

  warnings = util.env("BLUEBIRD_WARNINGS") != 0 &&
    (debugging || !!util.env("BLUEBIRD_WARNINGS")),

  longStackTraces = util.env("BLUEBIRD_LONG_STACK_TRACES") != 0 &&
    (debugging || !!util.env("BLUEBIRD_LONG_STACK_TRACES")),

  wForgottenReturn = util.env("BLUEBIRD_W_FORGOTTEN_RETURN") != 0 &&
    (warnings || !!util.env("BLUEBIRD_W_FORGOTTEN_RETURN"));

!(function() {
  var promises = [];

  function unhandledRejectionCheck() {
    for (var i = 0; i < promises.length; ++i) promises[i]._notifyUnhandledRejection();

    unhandledRejectionClear();
  }

  function unhandledRejectionClear() {
    promises.length = 0;
  }

  deferUnhandledRejectionCheck = function(promise) {
    promises.push(promise);
    setTimeout(unhandledRejectionCheck, 1);
  };

  es5.defineProperty(Promise, "_unhandledRejectionCheck", {value: unhandledRejectionCheck});
  es5.defineProperty(Promise, "_unhandledRejectionClear", {value: unhandledRejectionClear});
})();

Promise.prototype.suppressUnhandledRejections = function() {
  var target = this._target();
  target._bitField = (target._bitField & ~1048576) | 524288;
};

Promise.prototype._ensurePossibleRejectionHandled = function() {
  if ((this._bitField & 524288) != 0) return;
  this._setRejectionIsUnhandled();
  deferUnhandledRejectionCheck(this);
};

Promise.prototype._notifyUnhandledRejectionIsHandled = function() {
  fireRejectionEvent("rejectionHandled", unhandledRejectionHandled, void 0, this);
};

Promise.prototype._setReturnedNonUndefined = function() {
  this._bitField = this._bitField | 268435456;
};

Promise.prototype._returnedNonUndefined = function() {
  return (this._bitField & 268435456) != 0;
};

Promise.prototype._notifyUnhandledRejection = function() {
  if (this._isRejectionUnhandled()) {
    var reason = this._settledValue();
    this._setUnhandledRejectionIsNotified();
    fireRejectionEvent("unhandledRejection", possiblyUnhandledRejection, reason, this);
  }
};

Promise.prototype._setUnhandledRejectionIsNotified = function() {
  this._bitField = this._bitField | 262144;
};

Promise.prototype._unsetUnhandledRejectionIsNotified = function() {
  this._bitField = this._bitField & ~262144;
};

Promise.prototype._isUnhandledRejectionNotified = function() {
  return (this._bitField & 262144) > 0;
};

Promise.prototype._setRejectionIsUnhandled = function() {
  this._bitField = this._bitField | 1048576;
};

Promise.prototype._unsetRejectionIsUnhandled = function() {
  this._bitField = this._bitField & ~1048576;
  if (this._isUnhandledRejectionNotified()) {
    this._unsetUnhandledRejectionIsNotified();
    this._notifyUnhandledRejectionIsHandled();
  }
};

Promise.prototype._isRejectionUnhandled = function() {
  return (this._bitField & 1048576) > 0;
};

Promise.prototype._warn = function(message, shouldUseOwnTrace, promise) {
  return warn(message, shouldUseOwnTrace, promise || this);
};

Promise.onPossiblyUnhandledRejection = function(fn) {
  var context = Promise._getContext();
  possiblyUnhandledRejection = util.contextBind(context, fn);
};

Promise.onUnhandledRejectionHandled = function(fn) {
  var context = Promise._getContext();
  unhandledRejectionHandled = util.contextBind(context, fn);
};

var disableLongStackTraces = function() {};
Promise.longStackTraces = function() {
  if (async.haveItemsQueued() && !config.longStackTraces)
    throw new Error(
      "cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n"
    );

  if (config.longStackTraces || !longStackTracesIsSupported()) return;

  var Promise_captureStackTrace = Promise.prototype._captureStackTrace,
    Promise_attachExtraTrace = Promise.prototype._attachExtraTrace,
    Promise_dereferenceTrace = Promise.prototype._dereferenceTrace;
  config.longStackTraces = true;
  disableLongStackTraces = function() {
    if (async.haveItemsQueued() && !config.longStackTraces)
      throw new Error(
        "cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n"
      );

    Promise.prototype._captureStackTrace = Promise_captureStackTrace;
    Promise.prototype._attachExtraTrace = Promise_attachExtraTrace;
    Promise.prototype._dereferenceTrace = Promise_dereferenceTrace;
    Context.deactivateLongStackTraces();
    config.longStackTraces = false;
  };
  Promise.prototype._captureStackTrace = longStackTracesCaptureStackTrace;
  Promise.prototype._attachExtraTrace = longStackTracesAttachExtraTrace;
  Promise.prototype._dereferenceTrace = longStackTracesDereferenceTrace;
  Context.activateLongStackTraces();
};

Promise.hasLongStackTraces = function() {
  return config.longStackTraces && longStackTracesIsSupported();
};

var legacyHandlers = {
  unhandledrejection: {
    before: function() {
      var ret = util.global.onunhandledrejection;
      util.global.onunhandledrejection = null;
      return ret;
    },
    after: function(fn) {
      util.global.onunhandledrejection = fn;
    }
  },
  rejectionhandled: {
    before: function() {
      var ret = util.global.onrejectionhandled;
      util.global.onrejectionhandled = null;
      return ret;
    },
    after: function(fn) {
      util.global.onrejectionhandled = fn;
    }
  }
};

var fireDomEvent = (function() {
  var dispatch = function(legacy, e) {
    if (!legacy) return !util.global.dispatchEvent(e);

    var fn;
    try {
      fn = legacy.before();
      return !util.global.dispatchEvent(e);
    } finally {
      legacy.after(fn);
    }
  };
  try {
    if (typeof CustomEvent == "function") {
      var event = new CustomEvent("CustomEvent");
      util.global.dispatchEvent(event);
      return function(name, event) {
        name = name.toLowerCase();
        var domEvent = new CustomEvent(name, {detail: event, cancelable: true});
        es5.defineProperty(domEvent, "promise", {value: event.promise});
        es5.defineProperty(domEvent, "reason", {value: event.reason});

        return dispatch(legacyHandlers[name], domEvent);
      };
    }
    if (typeof Event == "function") {
      event = new Event("CustomEvent");
      util.global.dispatchEvent(event);
      return function(name, event) {
        name = name.toLowerCase();
        var domEvent = new Event(name, {cancelable: true});
        domEvent.detail = event;
        es5.defineProperty(domEvent, "promise", {value: event.promise});
        es5.defineProperty(domEvent, "reason", {value: event.reason});
        return dispatch(legacyHandlers[name], domEvent);
      };
    }

    event = document.createEvent("CustomEvent");
    event.initCustomEvent("testingtheevent", false, true, {});
    util.global.dispatchEvent(event);
    return function(name, event) {
      name = name.toLowerCase();
      var domEvent = document.createEvent("CustomEvent");
      domEvent.initCustomEvent(name, false, true, event);
      return dispatch(legacyHandlers[name], domEvent);
    };
  } catch (_) {}
  return function() {
    return false;
  };
})();

var fireGlobalEvent = (function() {
  return util.isNode
    ? function() {
        return process.emit.apply(process, arguments);
      }
    : !util.global
    ? function() {
        return false;
      }
    : function(name) {
        var methodName = "on" + name.toLowerCase(),
          method = util.global[methodName];
        if (!method) return false;
        method.apply(util.global, [].slice.call(arguments, 1));
        return true;
      };
})();

function generatePromiseLifecycleEventObject(name, promise) {
  return {promise: promise};
}

var eventToObjectGenerator = {
  promiseCreated: generatePromiseLifecycleEventObject,
  promiseFulfilled: generatePromiseLifecycleEventObject,
  promiseRejected: generatePromiseLifecycleEventObject,
  promiseResolved: generatePromiseLifecycleEventObject,
  promiseCancelled: generatePromiseLifecycleEventObject,
  promiseChained: function(name, promise, child) {
    return {promise: promise, child: child};
  },
  warning: function(name, warning) {
    return {warning: warning};
  },
  unhandledRejection: function(name, reason, promise) {
    return {reason: reason, promise: promise};
  },
  rejectionHandled: generatePromiseLifecycleEventObject
};

var activeFireEvent = function(name) {
  var globalEventFired = false;
  try {
    globalEventFired = fireGlobalEvent.apply(null, arguments);
  } catch (e) {
    async.throwLater(e);
    globalEventFired = true;
  }

  var domEventFired = false;
  try {
    domEventFired = fireDomEvent(name, eventToObjectGenerator[name].apply(null, arguments));
  } catch (e) {
    async.throwLater(e);
    domEventFired = true;
  }

  return domEventFired || globalEventFired;
};

Promise.config = function(opts) {
  if ("longStackTraces" in (opts = Object(opts)))
    opts.longStackTraces
      ? Promise.longStackTraces()
      : opts.longStackTraces || !Promise.hasLongStackTraces() || disableLongStackTraces();

  if ("warnings" in opts) {
    var warningsOption = opts.warnings;
    config.warnings = !!warningsOption;
    wForgottenReturn = config.warnings;

    if (util.isObject(warningsOption) && "wForgottenReturn" in warningsOption)
      wForgottenReturn = !!warningsOption.wForgottenReturn;
  }
  if ("cancellation" in opts && opts.cancellation && !config.cancellation) {
    if (async.haveItemsQueued())
      throw new Error("cannot enable cancellation after promises are in use");

    Promise.prototype._clearCancellationData = cancellationClearCancellationData;
    Promise.prototype._propagateFrom = cancellationPropagateFrom;
    Promise.prototype._onCancel = cancellationOnCancel;
    Promise.prototype._setOnCancel = cancellationSetOnCancel;
    Promise.prototype._attachCancellationCallback = cancellationAttachCancellationCallback;
    Promise.prototype._execute = cancellationExecute;
    propagateFromFunction = cancellationPropagateFrom;
    config.cancellation = true;
  }
  if ("monitoring" in opts)
    if (opts.monitoring && !config.monitoring) {
      config.monitoring = true;
      Promise.prototype._fireEvent = activeFireEvent;
    } else if (!opts.monitoring && config.monitoring) {
      config.monitoring = false;
      Promise.prototype._fireEvent = defaultFireEvent;
    }

  if ("asyncHooks" in opts && util.nodeSupportsAsyncResource) {
    var prev = config.asyncHooks,
      cur = !!opts.asyncHooks;
    if (prev !== cur) {
      config.asyncHooks = cur;
      cur ? enableAsyncHooks() : disableAsyncHooks();
    }
  }
  return Promise;
};

function defaultFireEvent() { return false; }

Promise.prototype._fireEvent = defaultFireEvent;
Promise.prototype._execute = function(executor, resolve, reject) {
  try {
    executor(resolve, reject);
  } catch (e) {
    return e;
  }
};
Promise.prototype._onCancel = function() {};
Promise.prototype._setOnCancel = function(handler) {};
Promise.prototype._attachCancellationCallback = function(onCancel) {};
Promise.prototype._captureStackTrace = function() {};
Promise.prototype._attachExtraTrace = function() {};
Promise.prototype._dereferenceTrace = function() {};
Promise.prototype._clearCancellationData = function() {};
Promise.prototype._propagateFrom = function(parent, flags) {};

function cancellationExecute(executor, resolve, reject) {
  var promise = this;
  try {
    executor(resolve, reject, function(onCancel) {
      if (typeof onCancel != "function")
        throw new TypeError("onCancel must be a function, got: " + util.toString(onCancel));

      promise._attachCancellationCallback(onCancel);
    });
  } catch (e) {
    return e;
  }
}

function cancellationAttachCancellationCallback(onCancel) {
  if (!this._isCancellable()) return this;

  var previousOnCancel = this._onCancel();
  previousOnCancel === void 0
    ? this._setOnCancel(onCancel)

    : util.isArray(previousOnCancel)
    ? previousOnCancel.push(onCancel)
    : this._setOnCancel([previousOnCancel, onCancel]);
}

function cancellationOnCancel() {
  return this._onCancelField;
}

function cancellationSetOnCancel(onCancel) {
  this._onCancelField = onCancel;
}

function cancellationClearCancellationData() {
  this._cancellationParent = void 0;
  this._onCancelField = void 0;
}

function cancellationPropagateFrom(parent, flags) {
  if ((flags & 1) != 0) {
    this._cancellationParent = parent;
    var branchesRemainingToCancel = parent._branchesRemainingToCancel;
    if (branchesRemainingToCancel === void 0) branchesRemainingToCancel = 0;

    parent._branchesRemainingToCancel = branchesRemainingToCancel + 1;
  }
  (flags & 2) != 0 && parent._isBound() && this._setBoundTo(parent._boundTo);
}

function bindingPropagateFrom(parent, flags) {
  (flags & 2) != 0 && parent._isBound() && this._setBoundTo(parent._boundTo);
}
var propagateFromFunction = bindingPropagateFrom;

function boundValueFunction() {
  var ret = this._boundTo;
  return ret !== void 0 && ret instanceof Promise
    ? ret.isFulfilled() ? ret.value() : void 0
    : ret;
}

function longStackTracesCaptureStackTrace() {
  this._trace = new CapturedTrace(this._peekContext());
}

function longStackTracesAttachExtraTrace(error, ignoreSelf) {
  if (!canAttachTrace(error)) return;

  var trace = this._trace;
  if (trace !== void 0 && ignoreSelf) trace = trace._parent;

  if (trace !== void 0) trace.attachExtraTrace(error);
  else if (!error.__stackCleaned__) {
    var parsed = parseStackAndMessage(error);
    util.notEnumerableProp(error, "stack", parsed.message + "\n" + parsed.stack.join("\n"));
    util.notEnumerableProp(error, "__stackCleaned__", true);
  }
}

function longStackTracesDereferenceTrace() {
  this._trace = void 0;
}

function checkForgottenReturns(returnValue, promiseCreated, name, promise, parent) {
  if (returnValue !== void 0 || promiseCreated === null || !wForgottenReturn ||
      (parent !== void 0 && parent._returnedNonUndefined()) ||
      (promise._bitField & 65535) == 0)
    return;

  if (name) name += " ";
  var handlerLine = "",
    creatorLine = "";
  if (promiseCreated._trace) {
    var traceLines = promiseCreated._trace.stack.split("\n"),
      stack = cleanStack(traceLines);
    for (var i = stack.length - 1; i >= 0; --i) {
      var line = stack[i];
      if (nodeFramePattern.test(line)) continue;

      var lineMatches = line.match(parseLinePattern);
      if (lineMatches) handlerLine =
          "at " + lineMatches[1] + ":" + lineMatches[2] + ":" + lineMatches[3] + " ";

      break;
    }

    if (stack.length > 0) {
      var firstUserLine = stack[0];
      for (i = 0; i < traceLines.length; ++i)
        if (traceLines[i] === firstUserLine) {
          if (i > 0) creatorLine = "\n" + traceLines[i - 1];

          break;
        }
    }
  }
  var msg =
    "a promise was created in a " + name + "handler " + handlerLine +
    "but was not returned from it, see http://goo.gl/rRqMUw" + creatorLine;
  promise._warn(msg, true, promiseCreated);
}

function deprecated(name, replacement) {
  var message = name + " is deprecated and will be removed in a future version.";
  if (replacement) message += " Use " + replacement + " instead.";
  return warn(message);
}

function warn(message, shouldUseOwnTrace, promise) {
  if (!config.warnings) return;
  var ctx,
    warning = new Warning(message);
  if (shouldUseOwnTrace) promise._attachExtraTrace(warning);
  else if (config.longStackTraces && (ctx = Promise._peekContext()))
    ctx.attachExtraTrace(warning);
  else {
    var parsed = parseStackAndMessage(warning);
    warning.stack = parsed.message + "\n" + parsed.stack.join("\n");
  }

  activeFireEvent("warning", warning) || formatAndLogError(warning, "", true);
}

function reconstructStack(message, stacks) {
  for (var i = 0; i < stacks.length - 1; ++i) {
    stacks[i].push("From previous event:");
    stacks[i] = stacks[i].join("\n");
  }
  if (i < stacks.length) stacks[i] = stacks[i].join("\n");

  return message + "\n" + stacks.join("\n");
}

function removeDuplicateOrEmptyJumps(stacks) {
  for (var i = 0; i < stacks.length; ++i)
    if (stacks[i].length === 0 ||
        (i + 1 < stacks.length && stacks[i][0] === stacks[i + 1][0])) {
      stacks.splice(i, 1);
      i--;
    }
}

function removeCommonRoots(stacks) {
  for (var current = stacks[0], i = 1; i < stacks.length; ++i) {
    var prev = stacks[i],
      currentLastIndex = current.length - 1,
      commonRootMeetPoint = -1;

    for (var currentLastLine = current[currentLastIndex], j = prev.length - 1; j >= 0; --j)
      if (prev[j] === currentLastLine) {
        commonRootMeetPoint = j;
        break;
      }

    for (j = commonRootMeetPoint; j >= 0; --j) {
      var line = prev[j];
      if (current[currentLastIndex] !== line) break;

      current.pop();
      currentLastIndex--;
    }
    current = prev;
  }
}

function cleanStack(stack) {
  var ret = [];
  for (var i = 0; i < stack.length; ++i) {
    var line = stack[i],
      isTraceLine = "    (No stack trace)" === line || stackFramePattern.test(line),
      isInternalFrame = isTraceLine && shouldIgnore(line);
    if (isTraceLine && !isInternalFrame) {
      if (indentStackFrames && line.charAt(0) !== " ") line = "    " + line;

      ret.push(line);
    }
  }
  return ret;
}

function stackFramesAsArray(error) {
  var stack = error.stack.replace(/\s+$/g, "").split("\n");
  for (var i = 0; i < stack.length; ++i) {
    var line = stack[i];
    if ("    (No stack trace)" === line || stackFramePattern.test(line)) break;
  }
  if (i > 0 && error.name != "SyntaxError") stack = stack.slice(i);

  return stack;
}

function parseStackAndMessage(error) {
  var stack = error.stack,
    message = error.toString();
  stack = typeof stack == "string" && stack.length > 0
    ? stackFramesAsArray(error) : ["    (No stack trace)"];
  return {
    message: message,
    stack: error.name == "SyntaxError" ? stack : cleanStack(stack)
  };
}

function formatAndLogError(error, title, isSoft) {
  if (typeof console == "undefined") return;

  var message;
  if (util.isObject(error)) {
    var stack = error.stack;
    message = title + formatStack(stack, error);
  } else message = title + String(error);

  typeof printWarning == "function"
    ? printWarning(message, isSoft)
    : (typeof console.log != "function" && typeof console.log != "object") ||
      console.log(message);
}

function fireRejectionEvent(name, localHandler, reason, promise) {
  var localEventFired = false;
  try {
    if (typeof localHandler == "function") {
      localEventFired = true;
      name === "rejectionHandled" ? localHandler(promise) : localHandler(reason, promise);
    }
  } catch (e) {
    async.throwLater(e);
  }

  name === "unhandledRejection"
    ? activeFireEvent(name, reason, promise) || localEventFired ||
      formatAndLogError(reason, "Unhandled rejection ")
    : activeFireEvent(name, promise);
}

function formatNonError(obj) {
  var str;
  if (typeof obj == "function") str = "[function " + (obj.name || "anonymous") + "]";
  else {
    str = obj && typeof obj.toString == "function" ? obj.toString() : util.toString(obj);
    if (/\[object [a-zA-Z0-9$_]+\]/.test(str))
      try {
        str = JSON.stringify(obj);
      } catch (_) {}

    if (str.length === 0) str = "(empty array)";
  }
  return "(<" + snip(str) + ">, no stack trace)";
}

function snip(str) {
  var maxChars = 41;
  return str.length < maxChars ? str : str.substr(0, maxChars - 3) + "...";
}

function longStackTracesIsSupported() {
  return typeof captureStackTrace == "function";
}

var shouldIgnore = function() { return false; },
  parseLineInfoRegex = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;
function parseLineInfo(line) {
  var matches = line.match(parseLineInfoRegex);
  if (matches) return {fileName: matches[1], line: parseInt(matches[2], 10)};
}

function setBounds(firstLineError, lastLineError) {
  if (!longStackTracesIsSupported()) return;
  var firstFileName,
    lastFileName,
    firstStackLines = (firstLineError.stack || "").split("\n"),
    lastStackLines = (lastLineError.stack || "").split("\n"),
    firstIndex = -1,
    lastIndex = -1;
  for (var result, i = 0; i < firstStackLines.length; ++i)
    if ((result = parseLineInfo(firstStackLines[i]))) {
      firstFileName = result.fileName;
      firstIndex = result.line;
      break;
    }

  for (i = 0; i < lastStackLines.length; ++i)
    if ((result = parseLineInfo(lastStackLines[i]))) {
      lastFileName = result.fileName;
      lastIndex = result.line;
      break;
    }

  if (firstIndex < 0 || lastIndex < 0 || !firstFileName || !lastFileName ||
      firstFileName !== lastFileName || firstIndex >= lastIndex)
    return;

  shouldIgnore = function(line) {
    if (bluebirdFramePattern.test(line)) return true;
    var info = parseLineInfo(line);
    return !!info && info.fileName === firstFileName &&
      firstIndex <= info.line && info.line <= lastIndex;
  };
}

function CapturedTrace(parent) {
  this._parent = parent;
  this._promisesCreated = 0;
  var length = (this._length = 1 + (parent === void 0 ? 0 : parent._length));
  captureStackTrace(this, CapturedTrace);
  length > 32 && this.uncycle();
}
util.inherits(CapturedTrace, Error);
Context.CapturedTrace = CapturedTrace;

CapturedTrace.prototype.uncycle = function() {
  var length = this._length;
  if (length < 2) return;
  var nodes = [],
    stackToIndex = {};

  for (var i = 0, node = this; node !== void 0; ++i) {
    nodes.push(node);
    node = node._parent;
  }
  length = this._length = i;
  for (i = length - 1; i >= 0; --i) {
    var stack = nodes[i].stack;
    if (stackToIndex[stack] === void 0) stackToIndex[stack] = i;
  }
  for (i = 0; i < length; ++i) {
    var index = stackToIndex[nodes[i].stack];
    if (index === void 0 || index === i) continue;

    if (index > 0) {
      nodes[index - 1]._parent = void 0;
      nodes[index - 1]._length = 1;
    }
    nodes[i]._parent = void 0;
    nodes[i]._length = 1;
    var cycleEdgeNode = i > 0 ? nodes[i - 1] : this;

    if (index < length - 1) {
      cycleEdgeNode._parent = nodes[index + 1];
      cycleEdgeNode._parent.uncycle();
      cycleEdgeNode._length = cycleEdgeNode._parent._length + 1;
    } else {
      cycleEdgeNode._parent = void 0;
      cycleEdgeNode._length = 1;
    }
    for (var currentChildLength = cycleEdgeNode._length + 1, j = i - 2; j >= 0; --j) {
      nodes[j]._length = currentChildLength;
      currentChildLength++;
    }
    return;
  }
};

CapturedTrace.prototype.attachExtraTrace = function(error) {
  if (error.__stackCleaned__) return;
  this.uncycle();
  var parsed = parseStackAndMessage(error),
    message = parsed.message,
    stacks = [parsed.stack];

  for (var trace = this; trace !== void 0; ) {
    stacks.push(cleanStack(trace.stack.split("\n")));
    trace = trace._parent;
  }
  removeCommonRoots(stacks);
  removeDuplicateOrEmptyJumps(stacks);
  util.notEnumerableProp(error, "stack", reconstructStack(message, stacks));
  util.notEnumerableProp(error, "__stackCleaned__", true);
};

var captureStackTrace = (function stackDetection() {
  var v8stackFramePattern = /^\s*at\s*/;
  var v8stackFormatter = function(stack, error) {
    return typeof stack == "string"
      ? stack
      : error.name !== void 0 && error.message !== void 0
      ? error.toString()
      : formatNonError(error);
  };

  if (typeof Error.stackTraceLimit == "number" &&
      typeof Error.captureStackTrace == "function") {
    Error.stackTraceLimit += 6;
    stackFramePattern = v8stackFramePattern;
    formatStack = v8stackFormatter;
    var captureStackTrace = Error.captureStackTrace;

    shouldIgnore = function(line) {
      return bluebirdFramePattern.test(line);
    };
    return function(receiver, ignoreUntil) {
      Error.stackTraceLimit += 6;
      captureStackTrace(receiver, ignoreUntil);
      Error.stackTraceLimit -= 6;
    };
  }
  var hasStackAfterThrow,
    err = new Error();

  if (typeof err.stack == "string" &&
      err.stack.split("\n")[0].indexOf("stackDetection@") >= 0) {
    stackFramePattern = /@/;
    formatStack = v8stackFormatter;
    indentStackFrames = true;
    return function(o) {
      o.stack = new Error().stack;
    };
  }

  try {
    throw new Error();
  } catch (e) {
    hasStackAfterThrow = "stack" in e;
  }
  if (!("stack" in err) && hasStackAfterThrow && typeof Error.stackTraceLimit == "number") {
    stackFramePattern = v8stackFramePattern;
    formatStack = v8stackFormatter;
    return function(o) {
      Error.stackTraceLimit += 6;
      try {
        throw new Error();
      } catch (e) {
        o.stack = e.stack;
      }
      Error.stackTraceLimit -= 6;
    };
  }

  formatStack = function(stack, error) {
    return typeof stack == "string"
      ? stack
      : (typeof error == "object" || typeof error == "function") &&
        error.name !== void 0 && error.message !== void 0
      ? error.toString()
      : formatNonError(error);
  };

  return null;
})();

if (typeof console != "undefined" && console.warn !== void 0)
  printWarning = util.isNode && process.stderr.isTTY
    ? function(message, isSoft) {
        var color = isSoft ? "\x1b[33m" : "\x1b[31m";
        console.warn(color + message + "\x1b[0m\n");
      }
    : util.isNode || typeof new Error().stack != "string"
    ? function(message) {
        console.warn(message);
      }
    : function(message, isSoft) {
        console.warn("%c" + message, isSoft ? "color: darkorange" : "color: red");
      };

var config = {
  warnings: warnings,
  longStackTraces: false,
  cancellation: false,
  monitoring: false,
  asyncHooks: false
};

longStackTraces && Promise.longStackTraces();

return {
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
  checkForgottenReturns: checkForgottenReturns,
  setBounds: setBounds,
  warn: warn,
  deprecated: deprecated,
  CapturedTrace: CapturedTrace,
  fireDomEvent: fireDomEvent,
  fireGlobalEvent: fireGlobalEvent
};
};

},
"./finally":
function(module, exports, __wpreq__) {

module.exports = function(Promise, tryConvertToPromise, NEXT_FILTER) {
var util = __wpreq__("./util"),
  CancellationError = Promise.CancellationError,
  errorObj = util.errorObj,
  catchFilter = __wpreq__("./catch_filter")(NEXT_FILTER);

function PassThroughHandlerContext(promise, type, handler) {
  this.promise = promise;
  this.type = type;
  this.handler = handler;
  this.called = false;
  this.cancelPromise = null;
}

PassThroughHandlerContext.prototype.isFinallyHandler = function() {
  return this.type === 0;
};

function FinallyHandlerCancelReaction(finallyHandler) {
  this.finallyHandler = finallyHandler;
}

FinallyHandlerCancelReaction.prototype._resultCancelled = function() {
  checkCancel(this.finallyHandler);
};

function checkCancel(ctx, reason) {
  if (ctx.cancelPromise == null) return false;

  arguments.length > 1 ? ctx.cancelPromise._reject(reason) : ctx.cancelPromise._cancel();

  ctx.cancelPromise = null;
  return true;
}

function succeed() {
  return finallyHandler.call(this, this.promise._target()._settledValue());
}
function fail(reason) {
  if (checkCancel(this, reason)) return;
  errorObj.e = reason;
  return errorObj;
}
function finallyHandler(reasonOrValue) {
  var promise = this.promise,
    handler = this.handler;

  if (!this.called) {
    this.called = true;
    var ret = this.isFinallyHandler()
      ? handler.call(promise._boundValue())
      : handler.call(promise._boundValue(), reasonOrValue);
    if (ret === NEXT_FILTER) return ret;
    if (ret !== void 0) {
      promise._setReturnedNonUndefined();
      var maybePromise = tryConvertToPromise(ret, promise);
      if (maybePromise instanceof Promise) {
        if (this.cancelPromise != null) {
          if (maybePromise._isCancelled()) {
            var reason = new CancellationError("late cancellation observer");
            promise._attachExtraTrace(reason);
            errorObj.e = reason;
            return errorObj;
          }
          maybePromise.isPending() &&
            maybePromise._attachCancellationCallback(new FinallyHandlerCancelReaction(this));
        }
        return maybePromise._then(succeed, fail, void 0, this, void 0);
      }
    }
  }

  if (promise.isRejected()) {
    checkCancel(this);
    errorObj.e = reasonOrValue;
    return errorObj;
  }
  checkCancel(this);
  return reasonOrValue;
}

Promise.prototype._passThrough = function(handler, type, success, fail) {
  return typeof handler != "function"
    ? this.then()
    : this._then(
        success, fail, void 0, new PassThroughHandlerContext(this, type, handler), void 0
      );
};

Promise.prototype.lastly = Promise.prototype.finally = function(handler) {
  return this._passThrough(handler, 0, finallyHandler, finallyHandler);
};

Promise.prototype.tap = function(handler) {
  return this._passThrough(handler, 1, finallyHandler);
};

Promise.prototype.tapCatch = function(handlerOrPredicate) {
  var len = arguments.length;
  if (len === 1) return this._passThrough(handlerOrPredicate, 1, void 0, finallyHandler);

  var catchInstances = new Array(len - 1),
    j = 0;
  for (var i = 0; i < len - 1; ++i) {
    var item = arguments[i];
    if (!util.isObject(item))
      return Promise.reject(new TypeError(
        "tapCatch statement predicate: expecting an object but got " + util.classString(item)
      ));

    catchInstances[j++] = item;
  }
  catchInstances.length = j;
  var handler = arguments[i];
  return this._passThrough(
    catchFilter(catchInstances, handler, this), 1, void 0, finallyHandler
  );
};

return PassThroughHandlerContext;
};

},
"./catch_filter":
function(module, exports, __wpreq__) {

module.exports = function(NEXT_FILTER) {
var util = __wpreq__("./util"),
  getKeys = __wpreq__("./es5").keys,
  tryCatch = util.tryCatch,
  errorObj = util.errorObj;

function catchFilter(instances, cb, promise) {
  return function(e) {
    var boundTo = promise._boundValue();
    predicateLoop: for (var i = 0; i < instances.length; ++i) {
      var item = instances[i];

      if (item === Error || (item != null && item.prototype instanceof Error)) {
        if (e instanceof item) return tryCatch(cb).call(boundTo, e);
      } else if (typeof item == "function") {
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
}

return catchFilter;
};

},
"./nodeback":
function(module, exports, __wpreq__) {

var util = __wpreq__("./util"),
  maybeWrapAsError = util.maybeWrapAsError,
  OperationalError = __wpreq__("./errors").OperationalError,
  es5 = __wpreq__("./es5");

function isUntypedError(obj) {
  return obj instanceof Error && es5.getPrototypeOf(obj) === Error.prototype;
}

var rErrorKey = /^(?:name|message|stack|cause)$/;
function wrapAsOperationalError(obj) {
  var ret;
  if (isUntypedError(obj)) {
    (ret = new OperationalError(obj)).name = obj.name;
    ret.message = obj.message;
    ret.stack = obj.stack;
    for (var keys = es5.keys(obj), i = 0; i < keys.length; ++i) {
      var key = keys[i];
      rErrorKey.test(key) || (ret[key] = obj[key]);
    }
    return ret;
  }
  util.markAsOriginatingFromRejection(obj);
  return obj;
}

function nodebackForPromise(promise, multiArgs) {
  return function(err, value) {
    if (promise === null) return;
    if (err) {
      var wrapped = wrapAsOperationalError(maybeWrapAsError(err));
      promise._attachExtraTrace(wrapped);
      promise._reject(wrapped);
    } else if (!multiArgs) promise._fulfill(value);
    else {
      var args = [].slice.call(arguments, 1);
      promise._fulfill(args);
    }
    promise = null;
  };
}

module.exports = nodebackForPromise;

},
"./method":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection, debug) {
var util = __wpreq__("./util"),
  tryCatch = util.tryCatch;

Promise.method = function(fn) {
  if (typeof fn != "function")
    throw new Promise.TypeError("expecting a function but got " + util.classString(fn));

  return function() {
    var ret = new Promise(INTERNAL);
    ret._captureStackTrace();
    ret._pushContext();
    var value = tryCatch(fn).apply(this, arguments),
      promiseCreated = ret._popContext();
    debug.checkForgottenReturns(value, promiseCreated, "Promise.method", ret);
    ret._resolveFromSyncValue(value);
    return ret;
  };
};

Promise.attempt = Promise.try = function(fn) {
  if (typeof fn != "function")
    return apiRejection("expecting a function but got " + util.classString(fn));

  var value,
    ret = new Promise(INTERNAL);
  ret._captureStackTrace();
  ret._pushContext();
  if (arguments.length > 1) {
    debug.deprecated("calling Promise.try with more than 1 argument");
    var arg = arguments[1],
      ctx = arguments[2];
    value = util.isArray(arg) ? tryCatch(fn).apply(ctx, arg) : tryCatch(fn).call(ctx, arg);
  } else value = tryCatch(fn)();

  var promiseCreated = ret._popContext();
  debug.checkForgottenReturns(value, promiseCreated, "Promise.try", ret);
  ret._resolveFromSyncValue(value);
  return ret;
};

Promise.prototype._resolveFromSyncValue = function(value) {
  value === util.errorObj
    ? this._rejectCallback(value.e, false)
    : this._resolveCallback(value, true);
};
};

},
"./bind":
function(module) {

module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
  this._reject(e);
};

var targetRejected = function(e, context) {
  context.promiseRejectionQueued = true;
  context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
  (this._bitField & 50397184) != 0 || this._resolveCallback(context.target);
};

var bindingRejected = function(e, context) {
  context.promiseRejectionQueued || this._reject(e);
};

Promise.prototype.bind = function(thisArg) {
  if (!calledBind) {
    calledBind = true;
    Promise.prototype._propagateFrom = debug.propagateFromFunction();
    Promise.prototype._boundValue = debug.boundValueFunction();
  }
  var maybePromise = tryConvertToPromise(thisArg),
    ret = new Promise(INTERNAL);
  ret._propagateFrom(this, 1);
  var target = this._target();
  ret._setBoundTo(maybePromise);
  if (maybePromise instanceof Promise) {
    var context = {
      promiseRejectionQueued: false,
      promise: ret,
      target: target,
      bindingPromise: maybePromise
    };
    target._then(INTERNAL, targetRejected, void 0, ret, context);
    maybePromise._then(bindingResolved, bindingRejected, void 0, ret, context);
    ret._setOnCancel(maybePromise);
  } else ret._resolveCallback(target);

  return ret;
};

Promise.prototype._setBoundTo = function(obj) {
  if (obj !== void 0) {
    this._bitField = this._bitField | 2097152;
    this._boundTo = obj;
  } else this._bitField = this._bitField & ~2097152;
};

Promise.prototype._isBound = function() {
  return (this._bitField & 2097152) == 2097152;
};

Promise.bind = function(thisArg, value) {
  return Promise.resolve(value).bind(thisArg);
};
};

},
"./cancel":
function(module, exports, __wpreq__) {

module.exports = function(Promise, PromiseArray, apiRejection, debug) {
var util = __wpreq__("./util"),
  tryCatch = util.tryCatch,
  errorObj = util.errorObj,
  async = Promise._async;

Promise.prototype.break = Promise.prototype.cancel = function() {
  if (!debug.cancellation()) return this._warn("cancellation is disabled");

  for (var promise = this, child = promise; promise._isCancellable(); ) {
    if (!promise._cancelBy(child)) {
      child._isFollowing() ? child._followee().cancel() : child._cancelBranched();

      break;
    }

    var parent = promise._cancellationParent;
    if (parent == null || !parent._isCancellable()) {
      promise._isFollowing() ? promise._followee().cancel() : promise._cancelBranched();

      break;
    }
    promise._isFollowing() && promise._followee().cancel();
    promise._setWillBeCancelled();
    child = promise;
    promise = parent;
  }
};

Promise.prototype._branchHasCancelled = function() {
  this._branchesRemainingToCancel--;
};

Promise.prototype._enoughBranchesHaveCancelled = function() {
  return this._branchesRemainingToCancel === void 0 || this._branchesRemainingToCancel <= 0;
};

Promise.prototype._cancelBy = function(canceller) {
  if (canceller === this) {
    this._branchesRemainingToCancel = 0;
    this._invokeOnCancel();
    return true;
  }

  this._branchHasCancelled();
  if (this._enoughBranchesHaveCancelled()) {
    this._invokeOnCancel();
    return true;
  }

  return false;
};

Promise.prototype._cancelBranched = function() {
  this._enoughBranchesHaveCancelled() && this._cancel();
};

Promise.prototype._cancel = function() {
  if (!this._isCancellable()) return;
  this._setCancelled();
  async.invoke(this._cancelPromises, this, void 0);
};

Promise.prototype._cancelPromises = function() {
  this._length() > 0 && this._settlePromises();
};

Promise.prototype._unsetOnCancel = function() {
  this._onCancelField = void 0;
};

Promise.prototype._isCancellable = function() {
  return this.isPending() && !this._isCancelled();
};

Promise.prototype.isCancellable = function() {
  return this.isPending() && !this.isCancelled();
};

Promise.prototype._doInvokeOnCancel = function(onCancelCallback, internalOnly) {
  if (util.isArray(onCancelCallback))
    for (var i = 0; i < onCancelCallback.length; ++i)
      this._doInvokeOnCancel(onCancelCallback[i], internalOnly);
  else if (onCancelCallback !== void 0)
    if (typeof onCancelCallback != "function") onCancelCallback._resultCancelled(this);
    else if (!internalOnly) {
      var e = tryCatch(onCancelCallback).call(this._boundValue());
      if (e === errorObj) {
        this._attachExtraTrace(e.e);
        async.throwLater(e.e);
      }
    }
};

Promise.prototype._invokeOnCancel = function() {
  var onCancelCallback = this._onCancel();
  this._unsetOnCancel();
  async.invoke(this._doInvokeOnCancel, this, onCancelCallback);
};

Promise.prototype._invokeInternalOnCancel = function() {
  if (this._isCancellable()) {
    this._doInvokeOnCancel(this._onCancel(), true);
    this._unsetOnCancel();
  }
};

Promise.prototype._resultCancelled = function() {
  this.cancel();
};
};

},
"./direct_resolve":
function(module) {

module.exports = function(Promise) {
function returner() {
  return this.value;
}
function thrower() {
  throw this.reason;
}

Promise.prototype.return = Promise.prototype.thenReturn = function(value) {
  value instanceof Promise && value.suppressUnhandledRejections();
  return this._then(returner, void 0, void 0, {value: value}, void 0);
};

Promise.prototype.throw = Promise.prototype.thenThrow = function(reason) {
  return this._then(thrower, void 0, void 0, {reason: reason}, void 0);
};

Promise.prototype.catchThrow = function(reason) {
  if (arguments.length <= 1)
    return this._then(void 0, thrower, void 0, {reason: reason}, void 0);

  var _reason = arguments[1],
    handler = function() { throw _reason; };
  return this.caught(reason, handler);
};

Promise.prototype.catchReturn = function(value) {
  if (arguments.length <= 1) {
    value instanceof Promise && value.suppressUnhandledRejections();
    return this._then(void 0, returner, void 0, {value: value}, void 0);
  }
  var _value = arguments[1];
  _value instanceof Promise && _value.suppressUnhandledRejections();
  var handler = function() { return _value; };
  return this.caught(value, handler);
};
};

},
"./synchronous_inspection":
function(module) {

module.exports = function(Promise) {
function PromiseInspection(promise) {
  if (promise !== void 0) {
    promise = promise._target();
    this._bitField = promise._bitField;
    this._settledValueField = promise._isFateSealed() ? promise._settledValue() : void 0;
  } else {
    this._bitField = 0;
    this._settledValueField = void 0;
  }
}

PromiseInspection.prototype._settledValue = function() {
  return this._settledValueField;
};

var value = (PromiseInspection.prototype.value = function() {
  if (!this.isFulfilled())
    throw new TypeError(
      "cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n"
    );

  return this._settledValue();
});

var reason =
(PromiseInspection.prototype.error = PromiseInspection.prototype.reason = function() {
  if (!this.isRejected())
    throw new TypeError(
      "cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n"
    );

  return this._settledValue();
});

var isFulfilled = (PromiseInspection.prototype.isFulfilled = function() {
  return (this._bitField & 33554432) != 0;
});

var isRejected = (PromiseInspection.prototype.isRejected = function() {
  return (this._bitField & 16777216) != 0;
});

var isPending = (PromiseInspection.prototype.isPending = function() {
  return (this._bitField & 50397184) == 0;
});

var isResolved = (PromiseInspection.prototype.isResolved = function() {
  return (this._bitField & 50331648) != 0;
});

PromiseInspection.prototype.isCancelled = function() {
  return (this._bitField & 8454144) != 0;
};

Promise.prototype.__isCancelled = function() {
  return (this._bitField & 65536) == 65536;
};

Promise.prototype._isCancelled = function() {
  return this._target().__isCancelled();
};

Promise.prototype.isCancelled = function() {
  return (this._target()._bitField & 8454144) != 0;
};

Promise.prototype.isPending = function() {
  return isPending.call(this._target());
};

Promise.prototype.isRejected = function() {
  return isRejected.call(this._target());
};

Promise.prototype.isFulfilled = function() {
  return isFulfilled.call(this._target());
};

Promise.prototype.isResolved = function() {
  return isResolved.call(this._target());
};

Promise.prototype.value = function() {
  return value.call(this._target());
};

Promise.prototype.reason = function() {
  var target = this._target();
  target._unsetRejectionIsUnhandled();
  return reason.call(target);
};

Promise.prototype._value = function() {
  return this._settledValue();
};

Promise.prototype._reason = function() {
  this._unsetRejectionIsUnhandled();
  return this._settledValue();
};

Promise.PromiseInspection = PromiseInspection;
};

},
"./join":
function(module, exports, __wpreq__) {

module.exports = function(Promise, PromiseArray, tryConvertToPromise, INTERNAL, async) {
var reject,
  util = __wpreq__("./util"),
  canEvaluate = util.canEvaluate,
  tryCatch = util.tryCatch,
  errorObj = util.errorObj;

if (canEvaluate) {
  var thenCallback = function(i) {
    return new Function("value", "holder",
      "\n 'use strict';\n holder.pIndex = value;\n holder.checkFulfillment(this);\n ".replace(/Index/g, i)
    );
  };

  var promiseSetter = function(i) {
    return new Function("promise", "holder",
      "\n 'use strict';\n holder.pIndex = promise;\n ".replace(/Index/g, i)
    );
  };

  var generateHolderClass = function(total) {
    var props = new Array(total);
    for (var i = 0; i < props.length; ++i) props[i] = "this.p" + (i + 1);

    var assignment = props.join(" = ") + " = null;";
    var cancellationCode = "var promise;\n" + props.map(function(prop) {
      return "\n promise = " + prop +
        ";\n if (promise instanceof Promise) {\n promise.cancel();\n }\n ";
    }).join("\n");
    var passedArguments = props.join(", "),
      name = "Holder$" + total;

    var code =
      "return function(tryCatch, errorObj, Promise, async) {\n 'use strict';\n function [TheName](fn) {\n [TheProperties]\n this.fn = fn;\n this.asyncNeeded = true;\n this.now = 0;\n }\n [TheName].prototype._callFunction = function(promise) {\n promise._pushContext();\n var ret = tryCatch(this.fn)([ThePassedArguments]);\n promise._popContext();\n if (ret === errorObj) {\n promise._rejectCallback(ret.e, false);\n } else {\n promise._resolveCallback(ret);\n }\n };\n [TheName].prototype.checkFulfillment = function(promise) {\n var now = ++this.now;\n if (now === [TheTotal]) {\n if (this.asyncNeeded) {\n async.invoke(this._callFunction, this, promise);\n } else {\n this._callFunction(promise);\n }\n }\n };\n [TheName].prototype._resultCancelled = function() {\n [CancellationCode]\n };\n return [TheName];\n }(tryCatch, errorObj, Promise, async);\n ";

    code = code.replace(/\[TheName\]/g, name)
      .replace(/\[TheTotal\]/g, total)
      .replace(/\[ThePassedArguments\]/g, passedArguments)
      .replace(/\[TheProperties\]/g, assignment)
      .replace(/\[CancellationCode\]/g, cancellationCode);

    return new Function("tryCatch", "errorObj", "Promise", "async", code)(
      tryCatch, errorObj, Promise, async
    );
  };

  var holderClasses = [],
    thenCallbacks = [],
    promiseSetters = [];

  for (var i = 0; i < 8; ++i) {
    holderClasses.push(generateHolderClass(i + 1));
    thenCallbacks.push(thenCallback(i + 1));
    promiseSetters.push(promiseSetter(i + 1));
  }

  reject = function(reason) {
    this._reject(reason);
  };
}

Promise.join = function() {
  var fn,
    last = arguments.length - 1;
  if (last > 0 && typeof arguments[last] == "function") {
    fn = arguments[last];
    if (last <= 8 && canEvaluate) {
      (ret = new Promise(INTERNAL))._captureStackTrace();
      var holder = new (0, holderClasses[last - 1])(fn);

      for (var callbacks = thenCallbacks, i = 0; i < last; ++i) {
        var maybePromise = tryConvertToPromise(arguments[i], ret);
        if (maybePromise instanceof Promise) {
          var bitField = (maybePromise = maybePromise._target())._bitField;

          if ((bitField & 50397184) == 0) {
            maybePromise._then(callbacks[i], reject, void 0, ret, holder);
            promiseSetters[i](maybePromise, holder);
            holder.asyncNeeded = false;
          } else
            (bitField & 33554432) != 0
              ? callbacks[i].call(ret, maybePromise._value(), holder)
              : (bitField & 16777216) != 0
              ? ret._reject(maybePromise._reason())
              : ret._cancel();
        } else callbacks[i].call(ret, maybePromise, holder);
      }

      if (!ret._isFateSealed()) {
        if (holder.asyncNeeded) {
          var context = Promise._getContext();
          holder.fn = util.contextBind(context, holder.fn);
        }
        ret._setAsyncGuaranteed();
        ret._setOnCancel(holder);
      }
      return ret;
    }
  }
  var args = [].slice.call(arguments);
  fn && args.pop();
  var ret = new PromiseArray(args).promise();
  return fn !== void 0 ? ret.spread(fn) : ret;
};
};

},
"./call_get":
function(module, exports, __wpreq__) {

var cr = Object.create;
if (cr) {
  var callerCache = cr(null),
    getterCache = cr(null);
  callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = __wpreq__("./util"),
  canEvaluate = util.canEvaluate,
  isIdentifier = util.isIdentifier;

var makeMethodCaller = function(methodName) {
  return new Function(
    "ensureMethod",
    "\n return function(obj) {\n 'use strict'\n var len = this.length;\n ensureMethod(obj, 'methodName');\n switch(len) {\n case 1: return obj.methodName(this[0]);\n case 2: return obj.methodName(this[0], this[1]);\n case 3: return obj.methodName(this[0], this[1], this[2]);\n case 0: return obj.methodName();\n default:\n return obj.methodName.apply(obj, this);\n }\n };\n ".replace(/methodName/g, methodName)
  )(ensureMethod);
};

var makeGetter = function(propertyName) {
  return new Function("obj",
    "\n 'use strict';\n return obj.propertyName;\n ".replace("propertyName", propertyName)
  );
};

var getCompiled = function(name, compiler, cache) {
  var ret = cache[name];
  if (typeof ret == "function") return ret;

  if (!isIdentifier(name)) return null;

  ret = compiler(name);
  cache[name] = ret;
  cache[" size"]++;
  if (cache[" size"] > 512) {
    var keys = Object.keys(cache);
    for (var i = 0; i < 256; ++i) delete cache[keys[i]];
    cache[" size"] = keys.length - 256;
  }

  return ret;
};

var getMethodCaller = function(name) {
  return getCompiled(name, makeMethodCaller, callerCache);
};

var getGetter = function(name) {
  return getCompiled(name, makeGetter, getterCache);
};

function ensureMethod(obj, methodName) {
  var fn;
  if (obj != null) fn = obj[methodName];
  if (typeof fn != "function") {
    var message =
      "Object " + util.classString(obj) + " has no method '" + util.toString(methodName) + "'";
    throw new Promise.TypeError(message);
  }
  return fn;
}

function caller(obj) {
  return ensureMethod(obj, this.pop()).apply(obj, this);
}
Promise.prototype.call = function(methodName) {
  var args = [].slice.call(arguments, 1);
  if (canEvaluate) {
    var maybeCaller = getMethodCaller(methodName);
    if (maybeCaller !== null) return this._then(maybeCaller, void 0, void 0, args, void 0);
  }
  args.push(methodName);
  return this._then(caller, void 0, void 0, args, void 0);
};

function namedGetter(obj) {
  return obj[this];
}
function indexedGetter(obj) {
  var index = +this;
  if (index < 0) index = Math.max(0, index + obj.length);
  return obj[index];
}
Promise.prototype.get = function(propertyName) {
  var maybeGetter;
  var getter =
    typeof propertyName == "number"
    ? indexedGetter
    : canEvaluate && (maybeGetter = getGetter(propertyName)) !== null
    ? maybeGetter
    : namedGetter;

  return this._then(getter, void 0, void 0, propertyName, void 0);
};
};

},
"./generators":
function(module, exports, __wpreq__) {

module.exports = function(
  Promise,
  apiRejection,
  INTERNAL,
  tryConvertToPromise,
  Proxyable,
  debug
) {
var TypeError = __wpreq__("./errors").TypeError,
  util = __wpreq__("./util"),
  errorObj = util.errorObj,
  tryCatch = util.tryCatch,
  yieldHandlers = [];

function promiseFromYieldHandler(value, yieldHandlers, traceParent) {
  for (var i = 0; i < yieldHandlers.length; ++i) {
    traceParent._pushContext();
    var result = tryCatch(yieldHandlers[i])(value);
    traceParent._popContext();
    if (result === errorObj) {
      traceParent._pushContext();
      var ret = Promise.reject(errorObj.e);
      traceParent._popContext();
      return ret;
    }
    var maybePromise = tryConvertToPromise(result, traceParent);
    if (maybePromise instanceof Promise) return maybePromise;
  }
  return null;
}

function PromiseSpawn(generatorFunction, receiver, yieldHandler, stack) {
  if (debug.cancellation()) {
    var internal = new Promise(INTERNAL),
      _finallyPromise = (this._finallyPromise = new Promise(INTERNAL));
    this._promise = internal.lastly(function() {
      return _finallyPromise;
    });
    internal._captureStackTrace();
    internal._setOnCancel(this);
  } else (this._promise = new Promise(INTERNAL))._captureStackTrace();

  this._stack = stack;
  this._generatorFunction = generatorFunction;
  this._receiver = receiver;
  this._generator = void 0;
  this._yieldHandlers =
    typeof yieldHandler == "function" ? [yieldHandler].concat(yieldHandlers) : yieldHandlers;
  this._yieldedPromise = null;
  this._cancellationPhase = false;
}
util.inherits(PromiseSpawn, Proxyable);

PromiseSpawn.prototype._isResolved = function() {
  return this._promise === null;
};

PromiseSpawn.prototype._cleanup = function() {
  this._promise = this._generator = null;
  if (debug.cancellation() && this._finallyPromise !== null) {
    this._finallyPromise._fulfill();
    this._finallyPromise = null;
  }
};

PromiseSpawn.prototype._promiseCancelled = function() {
  if (this._isResolved()) return;

  var result;
  if (this._generator.return === void 0) {
    var reason = new Promise.CancellationError("generator .return() sentinel");
    Promise.coroutine.returnSentinel = reason;
    this._promise._attachExtraTrace(reason);
    this._promise._pushContext();
    result = tryCatch(this._generator.throw).call(this._generator, reason);
    this._promise._popContext();
  } else {
    this._promise._pushContext();
    result = tryCatch(this._generator.return).call(this._generator, void 0);
    this._promise._popContext();
  }
  this._cancellationPhase = true;
  this._yieldedPromise = null;
  this._continue(result);
};

PromiseSpawn.prototype._promiseFulfilled = function(value) {
  this._yieldedPromise = null;
  this._promise._pushContext();
  var result = tryCatch(this._generator.next).call(this._generator, value);
  this._promise._popContext();
  this._continue(result);
};

PromiseSpawn.prototype._promiseRejected = function(reason) {
  this._yieldedPromise = null;
  this._promise._attachExtraTrace(reason);
  this._promise._pushContext();
  var result = tryCatch(this._generator.throw).call(this._generator, reason);
  this._promise._popContext();
  this._continue(result);
};

PromiseSpawn.prototype._resultCancelled = function() {
  if (this._yieldedPromise instanceof Promise) {
    var promise = this._yieldedPromise;
    this._yieldedPromise = null;
    promise.cancel();
  }
};

PromiseSpawn.prototype.promise = function() {
  return this._promise;
};

PromiseSpawn.prototype._run = function() {
  this._generator = this._generatorFunction.call(this._receiver);
  this._receiver = this._generatorFunction = void 0;
  this._promiseFulfilled(void 0);
};

PromiseSpawn.prototype._continue = function(result) {
  var promise = this._promise;
  if (result === errorObj) {
    this._cleanup();
    return this._cancellationPhase
      ? promise.cancel()
      : promise._rejectCallback(result.e, false);
  }

  var value = result.value;
  if (result.done === true) {
    this._cleanup();
    return this._cancellationPhase ? promise.cancel() : promise._resolveCallback(value);
  }

  var maybePromise = tryConvertToPromise(value, this._promise);
  if (!(maybePromise instanceof Promise)) {
    maybePromise = promiseFromYieldHandler(maybePromise, this._yieldHandlers, this._promise);
    if (maybePromise === null) {
      this._promiseRejected(
        new TypeError(
          "A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s", String(value)) +
          "From coroutine:\n" +
          this._stack.split("\n").slice(1, -7).join("\n")
        )
      );
      return;
    }
  }
  var bitField = (maybePromise = maybePromise._target())._bitField;

  if ((bitField & 50397184) == 0) {
    this._yieldedPromise = maybePromise;
    maybePromise._proxy(this, null);
  } else
    (bitField & 33554432) != 0
      ? Promise._async.invoke(this._promiseFulfilled, this, maybePromise._value())
      : (bitField & 16777216) != 0
      ? Promise._async.invoke(this._promiseRejected, this, maybePromise._reason())
      : this._promiseCancelled();
};

Promise.coroutine = function(generatorFunction, options) {
  if (typeof generatorFunction != "function")
    throw new TypeError(
      "generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n"
    );

  var yieldHandler = Object(options).yieldHandler,
    PromiseSpawn$ = PromiseSpawn,
    stack = new Error().stack;
  return function() {
    var generator = generatorFunction.apply(this, arguments),
      spawn = new PromiseSpawn$(void 0, void 0, yieldHandler, stack),
      ret = spawn.promise();
    spawn._generator = generator;
    spawn._promiseFulfilled(void 0);
    return ret;
  };
};

Promise.coroutine.addYieldHandler = function(fn) {
  if (typeof fn != "function")
    throw new TypeError("expecting a function but got " + util.classString(fn));

  yieldHandlers.push(fn);
};

Promise.spawn = function(generatorFunction) {
  debug.deprecated("Promise.spawn()", "Promise.coroutine()");
  if (typeof generatorFunction != "function")
    return apiRejection(
      "generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n"
    );

  var spawn = new PromiseSpawn(generatorFunction, this),
    ret = spawn.promise();
  spawn._run(Promise.spawn);
  return ret;
};
};

},
"./map":
function(module, exports, __wpreq__) {

module.exports = function(
  Promise,
  PromiseArray,
  apiRejection,
  tryConvertToPromise,
  INTERNAL,
  debug
) {
var util = __wpreq__("./util"),
  tryCatch = util.tryCatch,
  errorObj = util.errorObj,
  async = Promise._async;

function MappingPromiseArray(promises, fn, limit, _filter) {
  this.constructor$(promises);
  this._promise._captureStackTrace();
  var context = Promise._getContext();
  this._callback = util.contextBind(context, fn);
  this._preservedValues = _filter === INTERNAL ? new Array(this.length()) : null;
  this._limit = limit;
  this._inFlight = 0;
  this._queue = [];
  async.invoke(this._asyncInit, this, void 0);
  if (util.isArray(promises))
    for (var i = 0; i < promises.length; ++i) {
      var maybePromise = promises[i];
      maybePromise instanceof Promise && maybePromise.suppressUnhandledRejections();
    }
}
util.inherits(MappingPromiseArray, PromiseArray);

MappingPromiseArray.prototype._asyncInit = function() {
  this._init$(void 0, -2);
};

MappingPromiseArray.prototype._init = function() {};

MappingPromiseArray.prototype._promiseFulfilled = function(value, index) {
  var values = this._values,
    length = this.length(),
    preservedValues = this._preservedValues,
    limit = this._limit;

  if (index < 0) {
    values[(index = index * -1 - 1)] = value;
    if (limit >= 1) {
      this._inFlight--;
      this._drainQueue();
      if (this._isResolved()) return true;
    }
  } else {
    if (limit >= 1 && this._inFlight >= limit) {
      values[index] = value;
      this._queue.push(index);
      return false;
    }
    if (preservedValues !== null) preservedValues[index] = value;

    var promise = this._promise,
      callback = this._callback,
      receiver = promise._boundValue();
    promise._pushContext();
    var ret = tryCatch(callback).call(receiver, value, index, length),
      promiseCreated = promise._popContext();
    debug.checkForgottenReturns(
      ret,
      promiseCreated,
      preservedValues !== null ? "Promise.filter" : "Promise.map",
      promise
    );
    if (ret === errorObj) {
      this._reject(ret.e);
      return true;
    }

    var maybePromise = tryConvertToPromise(ret, this._promise);
    if (maybePromise instanceof Promise) {
      var bitField = (maybePromise = maybePromise._target())._bitField;

      if ((bitField & 50397184) == 0) {
        limit < 1 || this._inFlight++;
        values[index] = maybePromise;
        maybePromise._proxy(this, (index + 1) * -1);
        return false;
      }
      if ((bitField & 33554432) != 0) ret = maybePromise._value();
      else if ((bitField & 16777216) != 0) {
        this._reject(maybePromise._reason());
        return true;
      } else {
        this._cancel();
        return true;
      }
    }
    values[index] = ret;
  }
  if (++this._totalResolved >= length) {
    preservedValues !== null ? this._filter(values, preservedValues) : this._resolve(values);

    return true;
  }
  return false;
};

MappingPromiseArray.prototype._drainQueue = function() {
  var queue = this._queue,
    limit = this._limit,
    values = this._values;
  while (queue.length > 0 && this._inFlight < limit) {
    if (this._isResolved()) return;
    var index = queue.pop();
    this._promiseFulfilled(values[index], index);
  }
};

MappingPromiseArray.prototype._filter = function(booleans, values) {
  var len = values.length,
    ret = new Array(len),
    j = 0;
  for (var i = 0; i < len; ++i) if (booleans[i]) ret[j++] = values[i];

  ret.length = j;
  this._resolve(ret);
};

MappingPromiseArray.prototype.preservedValues = function() {
  return this._preservedValues;
};

function map(promises, fn, options, _filter) {
  if (typeof fn != "function")
    return apiRejection("expecting a function but got " + util.classString(fn));

  var limit = 0;
  if (options !== void 0) {
    if (typeof options != "object" || options === null)
      return Promise.reject(new TypeError(
        "options argument must be an object but it is " + util.classString(options)
      ));

    if (typeof options.concurrency != "number")
      return Promise.reject(new TypeError(
        "'concurrency' must be a number but it is " + util.classString(options.concurrency)
      ));

    limit = options.concurrency;
  }
  limit = typeof limit == "number" && isFinite(limit) && limit >= 1 ? limit : 0;
  return new MappingPromiseArray(promises, fn, limit, _filter).promise();
}

Promise.prototype.map = function(fn, options) {
  return map(this, fn, options, null);
};

Promise.map = function(promises, fn, options, _filter) {
  return map(promises, fn, options, _filter);
};
};

},
"./nodeify":
function(module, exports, __wpreq__) {

module.exports = function(Promise) {
var util = __wpreq__("./util"),
  async = Promise._async,
  tryCatch = util.tryCatch,
  errorObj = util.errorObj;

function spreadAdapter(val, nodeback) {
  var promise = this;
  if (!util.isArray(val)) return successAdapter.call(promise, val, nodeback);
  var ret = tryCatch(nodeback).apply(promise._boundValue(), [null].concat(val));
  ret !== errorObj || async.throwLater(ret.e);
}

function successAdapter(val, nodeback) {
  var receiver = this._boundValue();
  var ret = val === void 0
    ? tryCatch(nodeback).call(receiver, null)
    : tryCatch(nodeback).call(receiver, null, val);
  ret !== errorObj || async.throwLater(ret.e);
}
function errorAdapter(reason, nodeback) {
  var promise = this;
  if (!reason) {
    var newReason = new Error(reason + "");
    newReason.cause = reason;
    reason = newReason;
  }
  var ret = tryCatch(nodeback).call(promise._boundValue(), reason);
  ret !== errorObj || async.throwLater(ret.e);
}

Promise.prototype.asCallback = Promise.prototype.nodeify = function(nodeback, options) {
  if (typeof nodeback == "function") {
    var adapter = successAdapter;
    if (options !== void 0 && Object(options).spread) adapter = spreadAdapter;

    this._then(adapter, errorAdapter, void 0, this, nodeback);
  }
  return this;
};
};

},
"./promisify":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL) {
var THIS = {},
  util = __wpreq__("./util"),
  nodebackForPromise = __wpreq__("./nodeback"),
  withAppended = util.withAppended,
  maybeWrapAsError = util.maybeWrapAsError,
  canEvaluate = util.canEvaluate,
  TypeError = __wpreq__("./errors").TypeError,
  defaultSuffix = "Async",
  defaultPromisified = {__isPromisified__: true};
var noCopyProps = [
  "arity",
  "length",
  "name",
  "arguments",
  "caller",
  "callee",
  "prototype",
  "__isPromisified__"
];
var noCopyPropsPattern = new RegExp("^(?:" + noCopyProps.join("|") + ")$");

var defaultFilter = function(name) {
  return util.isIdentifier(name) && name.charAt(0) !== "_" && name !== "constructor";
};

function propsFilter(key) {
  return !noCopyPropsPattern.test(key);
}

function isPromisified(fn) {
  try {
    return fn.__isPromisified__ === true;
  } catch (_) {
    return false;
  }
}

function hasPromisified(obj, key, suffix) {
  var val = util.getDataPropertyOrDefault(obj, key + suffix, defaultPromisified);
  return !!val && isPromisified(val);
}
function checkValid(ret, suffix, suffixRegexp) {
  for (var i = 0; i < ret.length; i += 2) {
    var key = ret[i];
    if (!suffixRegexp.test(key)) continue;

    var keyWithoutAsyncSuffix = key.replace(suffixRegexp, "");
    for (var j = 0; j < ret.length; j += 2)
      if (ret[j] === keyWithoutAsyncSuffix)
        throw new TypeError(
          "Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s", suffix)
        );
  }
}

function promisifiableMethods(obj, suffix, suffixRegexp, filter) {
  var ret = [];
  for (var keys = util.inheritedDataKeys(obj), i = 0; i < keys.length; ++i) {
    var key = keys[i],
      value = obj[key],
      passesDefaultFilter = filter === defaultFilter || defaultFilter(key, value, obj);
    typeof value != "function" ||
      isPromisified(value) ||
      hasPromisified(obj, key, suffix) ||
      !filter(key, value, obj, passesDefaultFilter) ||
      ret.push(key, value);
  }
  checkValid(ret, suffix, suffixRegexp);
  return ret;
}

var escapeIdentRegex = function(str) {
  return str.replace(/([$])/, "\\$");
};

var switchCaseArgumentOrder = function(likelyArgumentCount) {
  var ret = [likelyArgumentCount],
    min = Math.max(0, likelyArgumentCount - 1 - 3);
  for (var i = likelyArgumentCount - 1; i >= min; --i) ret.push(i);

  for (i = likelyArgumentCount + 1; i <= 3; ++i) ret.push(i);

  return ret;
};

var argumentSequence = function(argumentCount) {
  return util.filledRange(argumentCount, "_arg", "");
};

var parameterDeclaration = function(parameterCount) {
  return util.filledRange(Math.max(parameterCount, 3), "_arg", "");
};

var parameterCount = function(fn) {
  return typeof fn.length == "number" ? Math.max(Math.min(fn.length, 1024), 0) : 0;
};

var makeNodePromisifiedEval = function(callback, receiver, originalName, fn, _, multiArgs) {
  var newParameterCount = Math.max(0, parameterCount(fn) - 1),
    argumentOrder = switchCaseArgumentOrder(newParameterCount),
    shouldProxyThis = typeof callback == "string" || receiver === THIS;

  function generateCallForArgumentCount(count) {
    var args = argumentSequence(count).join(", "),
      comma = count > 0 ? ", " : "";
    var ret = shouldProxyThis
      ? "ret = callback.call(this, {{args}}, nodeback); break;\n"
      : receiver === void 0
      ? "ret = callback({{args}}, nodeback); break;\n"
      : "ret = callback.call(receiver, {{args}}, nodeback); break;\n";

    return ret.replace("{{args}}", args).replace(", ", comma);
  }

  function generateArgumentSwitchCase() {
    var ret = "";
    for (var i = 0; i < argumentOrder.length; ++i)
      ret += "case " + argumentOrder[i] + ":" + generateCallForArgumentCount(argumentOrder[i]);

    return ret +
      "\n default:\n var args = new Array(len + 1);\n var i = 0;\n for (var i = 0; i < len; ++i) {\n args[i] = arguments[i];\n }\n args[i] = nodeback;\n [CodeForCall]\n break;\n ".replace(
        "[CodeForCall]",
        shouldProxyThis
          ? "ret = callback.apply(this, args);\n"
          : "ret = callback.apply(receiver, args);\n"
      );
  }

  var getFunctionCode =
    typeof callback == "string" ? "this != null ? this['" + callback + "'] : fn" : "fn";
  var body =
    "'use strict';\n var ret = function (Parameters) {\n 'use strict';\n var len = arguments.length;\n var promise = new Promise(INTERNAL);\n promise._captureStackTrace();\n var nodeback = nodebackForPromise(promise, " +
    multiArgs +
    ");\n var ret;\n var callback = tryCatch([GetFunctionCode]);\n switch(len) {\n [CodeForSwitchCase]\n }\n if (ret === errorObj) {\n promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n }\n if (!promise._isFateSealed()) promise._setAsyncGuaranteed();\n return promise;\n };\n notEnumerableProp(ret, '__isPromisified__', true);\n return ret;\n ";
  body = body
    .replace("[CodeForSwitchCase]", generateArgumentSwitchCase())
    .replace("[GetFunctionCode]", getFunctionCode)
    .replace("Parameters", parameterDeclaration(newParameterCount));
  return new Function(
    "Promise",
    "fn",
    "receiver",
    "withAppended",
    "maybeWrapAsError",
    "nodebackForPromise",
    "tryCatch",
    "errorObj",
    "notEnumerableProp",
    "INTERNAL",
    body
  )(
    Promise,
    fn,
    receiver,
    withAppended,
    maybeWrapAsError,
    nodebackForPromise,
    util.tryCatch,
    util.errorObj,
    util.notEnumerableProp,
    INTERNAL
  );
};

function makeNodePromisifiedClosure(callback, receiver, _, fn, __, multiArgs) {
  var defaultThis = (function() { return this; })(),
    method = callback;
  if (typeof method == "string") callback = fn;

  function promisified() {
    var _receiver = receiver;
    if (receiver === THIS) _receiver = this;
    var promise = new Promise(INTERNAL);
    promise._captureStackTrace();
    var cb = typeof method == "string" && this !== defaultThis ? this[method] : callback,
      fn = nodebackForPromise(promise, multiArgs);
    try {
      cb.apply(_receiver, withAppended(arguments, fn));
    } catch (e) {
      promise._rejectCallback(maybeWrapAsError(e), true, true);
    }
    promise._isFateSealed() || promise._setAsyncGuaranteed();
    return promise;
  }
  util.notEnumerableProp(promisified, "__isPromisified__", true);
  return promisified;
}

var makeNodePromisified = canEvaluate ? makeNodePromisifiedEval : makeNodePromisifiedClosure;

function promisifyAll(obj, suffix, filter, promisifier, multiArgs) {
  var suffixRegexp = new RegExp(escapeIdentRegex(suffix) + "$"),
    methods = promisifiableMethods(obj, suffix, suffixRegexp, filter);

  for (var i = 0, len = methods.length; i < len; i += 2) {
    var key = methods[i],
      fn = methods[i + 1],
      promisifiedKey = key + suffix;
    if (promisifier === makeNodePromisified)
      obj[promisifiedKey] = makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
    else {
      var promisified = promisifier(fn, function() {
        return makeNodePromisified(key, THIS, key, fn, suffix, multiArgs);
      });
      util.notEnumerableProp(promisified, "__isPromisified__", true);
      obj[promisifiedKey] = promisified;
    }
  }
  util.toFastProperties(obj);
  return obj;
}

function promisify(callback, receiver, multiArgs) {
  return makeNodePromisified(callback, receiver, void 0, callback, null, multiArgs);
}

Promise.promisify = function(fn, options) {
  if (typeof fn != "function")
    throw new TypeError("expecting a function but got " + util.classString(fn));

  if (isPromisified(fn)) return fn;

  var receiver = (options = Object(options)).context === void 0 ? THIS : options.context,
    ret = promisify(fn, receiver, !!options.multiArgs);
  util.copyDescriptors(fn, ret, propsFilter);
  return ret;
};

Promise.promisifyAll = function(target, options) {
  if (typeof target != "function" && typeof target != "object")
    throw new TypeError(
      "the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n"
    );

  var multiArgs = !!(options = Object(options)).multiArgs,
    suffix = options.suffix;
  if (typeof suffix != "string") suffix = defaultSuffix;
  var filter = options.filter;
  if (typeof filter != "function") filter = defaultFilter;
  var promisifier = options.promisifier;
  if (typeof promisifier != "function") promisifier = makeNodePromisified;

  if (!util.isIdentifier(suffix))
    throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");

  for (var keys = util.inheritedDataKeys(target), i = 0; i < keys.length; ++i) {
    var value = target[keys[i]];
    if (keys[i] !== "constructor" && util.isClass(value)) {
      promisifyAll(value.prototype, suffix, filter, promisifier, multiArgs);
      promisifyAll(value, suffix, filter, promisifier, multiArgs);
    }
  }

  return promisifyAll(target, suffix, filter, promisifier, multiArgs);
};
};

},
"./props":
function(module, exports, __wpreq__) {

module.exports = function(Promise, PromiseArray, tryConvertToPromise, apiRejection) {
var Es6Map,
  util = __wpreq__("./util"),
  isObject = util.isObject,
  es5 = __wpreq__("./es5");
if (typeof Map == "function") Es6Map = Map;

var mapToEntries = (function() {
  var index = 0,
    size = 0;

  function extractEntry(value, key) {
    this[index] = value;
    this[index + size] = key;
    index++;
  }

  return function(map) {
    size = map.size;
    index = 0;
    var ret = new Array(map.size * 2);
    map.forEach(extractEntry, ret);
    return ret;
  };
})();

var entriesToMap = function(entries) {
  var ret = new Es6Map();
  for (var length = (entries.length / 2) | 0, i = 0; i < length; ++i) {
    var key = entries[length + i],
      value = entries[i];
    ret.set(key, value);
  }
  return ret;
};

function PropertiesPromiseArray(obj) {
  var entries,
    isMap = false;
  if (Es6Map !== void 0 && obj instanceof Es6Map) {
    entries = mapToEntries(obj);
    isMap = true;
  } else {
    var keys = es5.keys(obj),
      len = keys.length;
    entries = new Array(len * 2);
    for (var i = 0; i < len; ++i) {
      var key = keys[i];
      entries[i] = obj[key];
      entries[i + len] = key;
    }
  }
  this.constructor$(entries);
  this._isMap = isMap;
  this._init$(void 0, isMap ? -6 : -3);
}
util.inherits(PropertiesPromiseArray, PromiseArray);

PropertiesPromiseArray.prototype._init = function() {};

PropertiesPromiseArray.prototype._promiseFulfilled = function(value, index) {
  this._values[index] = value;
  if (++this._totalResolved < this._length) return false;

  var val;
  if (this._isMap) val = entriesToMap(this._values);
  else {
    val = {};
    for (var keyOffset = this.length(), i = 0, len = this.length(); i < len; ++i)
      val[this._values[i + keyOffset]] = this._values[i];
  }
  this._resolve(val);
  return true;
};

PropertiesPromiseArray.prototype.shouldCopyValues = function() {
  return false;
};

PropertiesPromiseArray.prototype.getActualLength = function(len) {
  return len >> 1;
};

function props(promises) {
  var ret,
    castValue = tryConvertToPromise(promises);

  if (!isObject(castValue))
    return apiRejection(
      "cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n"
    );
  ret = castValue instanceof Promise
    ? castValue._then(Promise.props, void 0, void 0, void 0, void 0)
    : new PropertiesPromiseArray(castValue).promise();

  castValue instanceof Promise && ret._propagateFrom(castValue, 2);

  return ret;
}

Promise.prototype.props = function() {
  return props(this);
};

Promise.props = function(promises) {
  return props(promises);
};
};

},
"./race":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL, tryConvertToPromise, apiRejection) {
var util = __wpreq__("./util");

var raceLater = function(promise) {
  return promise.then(function(array) {
    return race(array, promise);
  });
};

function race(promises, parent) {
  var maybePromise = tryConvertToPromise(promises);

  if (maybePromise instanceof Promise) return raceLater(maybePromise);
  if ((promises = util.asArray(promises)) === null)
    return apiRejection(
      "expecting an array or an iterable object but got " + util.classString(promises)
    );

  var ret = new Promise(INTERNAL);
  parent === void 0 || ret._propagateFrom(parent, 3);

  var fulfill = ret._fulfill,
    reject = ret._reject;
  for (var i = 0, len = promises.length; i < len; ++i) {
    var val = promises[i];

    if (val !== void 0 || i in promises)
      Promise.cast(val)._then(fulfill, reject, void 0, ret, null);
  }
  return ret;
}

Promise.race = function(promises) {
  return race(promises, void 0);
};

Promise.prototype.race = function() {
  return race(this, void 0);
};
};

},
"./reduce":
function(module, exports, __wpreq__) {

module.exports = function(
  Promise,
  PromiseArray,
  apiRejection,
  tryConvertToPromise,
  INTERNAL,
  debug
) {
var util = __wpreq__("./util"),
  tryCatch = util.tryCatch;

function ReductionPromiseArray(promises, fn, initialValue, _each) {
  this.constructor$(promises);
  var context = Promise._getContext();
  this._fn = util.contextBind(context, fn);
  initialValue === void 0 ||
    (initialValue = Promise.resolve(initialValue))._attachCancellationCallback(this);

  this._initialValue = initialValue;
  this._currentCancellable = null;
  this._eachValues = _each === INTERNAL ? Array(this._length) : _each === 0 ? null : void 0;

  this._promise._captureStackTrace();
  this._init$(void 0, -5);
}
util.inherits(ReductionPromiseArray, PromiseArray);

ReductionPromiseArray.prototype._gotAccum = function(accum) {
  this._eachValues === void 0 ||
    this._eachValues === null ||
    accum === INTERNAL ||
    this._eachValues.push(accum);
};

ReductionPromiseArray.prototype._eachComplete = function(value) {
  this._eachValues === null || this._eachValues.push(value);

  return this._eachValues;
};

ReductionPromiseArray.prototype._init = function() {};

ReductionPromiseArray.prototype._resolveEmptyArray = function() {
  this._resolve(this._eachValues !== void 0 ? this._eachValues : this._initialValue);
};

ReductionPromiseArray.prototype.shouldCopyValues = function() {
  return false;
};

ReductionPromiseArray.prototype._resolve = function(value) {
  this._promise._resolveCallback(value);
  this._values = null;
};

ReductionPromiseArray.prototype._resultCancelled = function(sender) {
  if (sender === this._initialValue) return this._cancel();
  if (this._isResolved()) return;
  this._resultCancelled$();
  this._currentCancellable instanceof Promise && this._currentCancellable.cancel();

  this._initialValue instanceof Promise && this._initialValue.cancel();
};

ReductionPromiseArray.prototype._iterate = function(values) {
  this._values = values;
  var value, i,
    length = values.length;
  if (this._initialValue !== void 0) {
    value = this._initialValue;
    i = 0;
  } else {
    value = Promise.resolve(values[0]);
    i = 1;
  }

  this._currentCancellable = value;

  for (var j = i; j < length; ++j) {
    var maybePromise = values[j];
    maybePromise instanceof Promise && maybePromise.suppressUnhandledRejections();
  }

  if (!value.isRejected())
    for (; i < length; ++i) {
      var ctx = {accum: null, value: values[i], index: i, length: length, array: this};

      value = value._then(gotAccum, void 0, void 0, ctx, void 0);

      (i & 127) != 0 || value._setNoAsyncGuarantee();
    }

  if (this._eachValues !== void 0)
    value = value._then(this._eachComplete, void 0, void 0, this, void 0);

  value._then(completed, completed, void 0, value, this);
};

Promise.prototype.reduce = function(fn, initialValue) {
  return reduce(this, fn, initialValue, null);
};

Promise.reduce = function(promises, fn, initialValue, _each) {
  return reduce(promises, fn, initialValue, _each);
};

function completed(valueOrReason, array) {
  this.isFulfilled() ? array._resolve(valueOrReason) : array._reject(valueOrReason);
}

function reduce(promises, fn, initialValue, _each) {
  return typeof fn != "function"
    ? apiRejection("expecting a function but got " + util.classString(fn))
    : new ReductionPromiseArray(promises, fn, initialValue, _each).promise();
}

function gotAccum(accum) {
  this.accum = accum;
  this.array._gotAccum(accum);
  var value = tryConvertToPromise(this.value, this.array._promise);
  if (value instanceof Promise) {
    this.array._currentCancellable = value;
    return value._then(gotValue, void 0, void 0, this, void 0);
  }
  return gotValue.call(this, value);
}

function gotValue(value) {
  var array = this.array,
    promise = array._promise,
    fn = tryCatch(array._fn);
  promise._pushContext();
  var ret =
    array._eachValues !== void 0
    ? fn.call(promise._boundValue(), value, this.index, this.length)
    : fn.call(promise._boundValue(), this.accum, value, this.index, this.length);

  if (ret instanceof Promise) array._currentCancellable = ret;

  var promiseCreated = promise._popContext();
  debug.checkForgottenReturns(
    ret,
    promiseCreated,
    array._eachValues !== void 0 ? "Promise.each" : "Promise.reduce",
    promise
  );
  return ret;
}
};

},
"./settle":
function(module, exports, __wpreq__) {

module.exports = function(Promise, PromiseArray, debug) {
var PromiseInspection = Promise.PromiseInspection;

function SettledPromiseArray(values) {
  this.constructor$(values);
}
__wpreq__("./util").inherits(SettledPromiseArray, PromiseArray);

SettledPromiseArray.prototype._promiseResolved = function(index, inspection) {
  this._values[index] = inspection;
  if (++this._totalResolved >= this._length) {
    this._resolve(this._values);
    return true;
  }
  return false;
};

SettledPromiseArray.prototype._promiseFulfilled = function(value, index) {
  var ret = new PromiseInspection();
  ret._bitField = 33554432;
  ret._settledValueField = value;
  return this._promiseResolved(index, ret);
};
SettledPromiseArray.prototype._promiseRejected = function(reason, index) {
  var ret = new PromiseInspection();
  ret._bitField = 16777216;
  ret._settledValueField = reason;
  return this._promiseResolved(index, ret);
};

Promise.settle = function(promises) {
  debug.deprecated(".settle()", ".reflect()");
  return new SettledPromiseArray(promises).promise();
};

Promise.allSettled = function(promises) {
  return new SettledPromiseArray(promises).promise();
};

Promise.prototype.settle = function() {
  return Promise.settle(this);
};
};

},
"./some":
function(module, exports, __wpreq__) {

module.exports = function(Promise, PromiseArray, apiRejection) {
var util = __wpreq__("./util"),
  RangeError = __wpreq__("./errors").RangeError,
  AggregateError = __wpreq__("./errors").AggregateError,
  isArray = util.isArray,
  CANCELLATION = {};

function SomePromiseArray(values) {
  this.constructor$(values);
  this._howMany = 0;
  this._unwrap = false;
  this._initialized = false;
}
util.inherits(SomePromiseArray, PromiseArray);

SomePromiseArray.prototype._init = function() {
  if (!this._initialized) return;

  if (this._howMany === 0) {
    this._resolve([]);
    return;
  }
  this._init$(void 0, -5);
  var isArrayResolved = isArray(this._values);
  this._isResolved() ||
    !isArrayResolved ||
    this._howMany <= this._canPossiblyFulfill() ||
    this._reject(this._getRangeError(this.length()));
};

SomePromiseArray.prototype.init = function() {
  this._initialized = true;
  this._init();
};

SomePromiseArray.prototype.setUnwrap = function() {
  this._unwrap = true;
};

SomePromiseArray.prototype.howMany = function() {
  return this._howMany;
};

SomePromiseArray.prototype.setHowMany = function(count) {
  this._howMany = count;
};

SomePromiseArray.prototype._promiseFulfilled = function(value) {
  this._addFulfilled(value);
  if (this._fulfilled() !== this.howMany()) return false;

  this._values.length = this.howMany();
  this.howMany() === 1 && this._unwrap
    ? this._resolve(this._values[0])
    : this._resolve(this._values);

  return true;
};
SomePromiseArray.prototype._promiseRejected = function(reason) {
  this._addRejected(reason);
  return this._checkOutcome();
};

SomePromiseArray.prototype._promiseCancelled = function() {
  if (this._values instanceof Promise || this._values == null) return this._cancel();

  this._addRejected(CANCELLATION);
  return this._checkOutcome();
};

SomePromiseArray.prototype._checkOutcome = function() {
  if (this.howMany() <= this._canPossiblyFulfill()) return false;

  var e = new AggregateError();
  for (var i = this.length(); i < this._values.length; ++i)
    this._values[i] === CANCELLATION || e.push(this._values[i]);

  e.length > 0 ? this._reject(e) : this._cancel();

  return true;
};

SomePromiseArray.prototype._fulfilled = function() {
  return this._totalResolved;
};

SomePromiseArray.prototype._rejected = function() {
  return this._values.length - this.length();
};

SomePromiseArray.prototype._addRejected = function(reason) {
  this._values.push(reason);
};

SomePromiseArray.prototype._addFulfilled = function(value) {
  this._values[this._totalResolved++] = value;
};

SomePromiseArray.prototype._canPossiblyFulfill = function() {
  return this.length() - this._rejected();
};

SomePromiseArray.prototype._getRangeError = function(count) {
  var message =
    "Input array must contain at least " +
    this._howMany + " items but contains only " + count + " items";
  return new RangeError(message);
};

SomePromiseArray.prototype._resolveEmptyArray = function() {
  this._reject(this._getRangeError(0));
};

function some(promises, howMany) {
  if ((howMany | 0) !== howMany || howMany < 0)
    return apiRejection("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");

  var ret = new SomePromiseArray(promises),
    promise = ret.promise();
  ret.setHowMany(howMany);
  ret.init();
  return promise;
}

Promise.some = function(promises, howMany) {
  return some(promises, howMany);
};

Promise.prototype.some = function(howMany) {
  return some(this, howMany);
};

Promise._SomePromiseArray = SomePromiseArray;
};

},
"./timers":
function(module, exports, __wpreq__) {

module.exports = function(Promise, INTERNAL, debug) {
var util = __wpreq__("./util"),
  TimeoutError = Promise.TimeoutError;

function HandleWrapper(handle) {
  this.handle = handle;
}

HandleWrapper.prototype._resultCancelled = function() {
  clearTimeout(this.handle);
};

var afterValue = function(value) { return delay(+this).thenReturn(value); };
var delay = (Promise.delay = function(ms, value) {
  var ret, handle;
  if (value !== void 0) {
    ret = Promise.resolve(value)._then(afterValue, null, null, ms, void 0);
    debug.cancellation() && value instanceof Promise && ret._setOnCancel(value);
  } else {
    ret = new Promise(INTERNAL);
    handle = setTimeout(function() { ret._fulfill(); }, +ms);
    debug.cancellation() && ret._setOnCancel(new HandleWrapper(handle));

    ret._captureStackTrace();
  }
  ret._setAsyncGuaranteed();
  return ret;
});

Promise.prototype.delay = function(ms) {
  return delay(ms, this);
};

var afterTimeout = function(promise, message, parent) {
  var err =
    typeof message == "string"
    ? new TimeoutError(message)
    : message instanceof Error
    ? message
    : new TimeoutError("operation timed out");

  util.markAsOriginatingFromRejection(err);
  promise._attachExtraTrace(err);
  promise._reject(err);

  parent == null || parent.cancel();
};

function successClear(value) {
  clearTimeout(this.handle);
  return value;
}

function failureClear(reason) {
  clearTimeout(this.handle);
  throw reason;
}

Promise.prototype.timeout = function(ms, message) {
  ms = +ms;
  var ret, parent;

  var handleWrapper = new HandleWrapper(setTimeout(function() {
    ret.isPending() && afterTimeout(ret, message, parent);
  }, ms));

  if (debug.cancellation()) {
    parent = this.then();
    ret = parent._then(successClear, failureClear, void 0, handleWrapper, void 0);
    ret._setOnCancel(handleWrapper);
  } else ret = this._then(successClear, failureClear, void 0, handleWrapper, void 0);

  return ret;
};
};

},
"./using":
function(module, exports, __wpreq__) {

module.exports = function(
  Promise, apiRejection, tryConvertToPromise, createContext, INTERNAL, debug
) {
  var util = __wpreq__("./util"),
    TypeError = __wpreq__("./errors").TypeError,
    inherits = __wpreq__("./util").inherits,
    errorObj = util.errorObj,
    tryCatch = util.tryCatch,
    NULL = {};

  function thrower(e) {
    setTimeout(function() { throw e; }, 0);
  }

  function castPreservingDisposable(thenable) {
    var maybePromise = tryConvertToPromise(thenable);
    maybePromise === thenable ||
      typeof thenable._isDisposable != "function" ||
      typeof thenable._getDisposer != "function" ||
      !thenable._isDisposable() ||
      maybePromise._setDisposable(thenable._getDisposer());

    return maybePromise;
  }
  function dispose(resources, inspection) {
    var i = 0,
      len = resources.length,
      ret = new Promise(INTERNAL);
    function iterator() {
      if (i >= len) return ret._fulfill();
      var maybePromise = castPreservingDisposable(resources[i++]);
      if (maybePromise instanceof Promise && maybePromise._isDisposable()) {
        try {
          maybePromise = tryConvertToPromise(
            maybePromise._getDisposer().tryDispose(inspection),
            resources.promise
          );
        } catch (e) {
          return thrower(e);
        }
        if (maybePromise instanceof Promise)
          return maybePromise._then(iterator, thrower, null, null, null);
      }
      iterator();
    }
    iterator();
    return ret;
  }

  function Disposer(data, promise, context) {
    this._data = data;
    this._promise = promise;
    this._context = context;
  }

  Disposer.prototype.data = function() {
    return this._data;
  };

  Disposer.prototype.promise = function() {
    return this._promise;
  };

  Disposer.prototype.resource = function() {
    return this.promise().isFulfilled() ? this.promise().value() : NULL;
  };

  Disposer.prototype.tryDispose = function(inspection) {
    var resource = this.resource(),
      context = this._context;
    context === void 0 || context._pushContext();
    var ret = resource !== NULL ? this.doDispose(resource, inspection) : null;
    context === void 0 || context._popContext();
    this._promise._unsetDisposable();
    this._data = null;
    return ret;
  };

  Disposer.isDisposer = function(d) {
    return d != null && typeof d.resource == "function" && typeof d.tryDispose == "function";
  };

  function FunctionDisposer(fn, promise, context) {
    this.constructor$(fn, promise, context);
  }
  inherits(FunctionDisposer, Disposer);

  FunctionDisposer.prototype.doDispose = function(resource, inspection) {
    return this.data().call(resource, resource, inspection);
  };

  function maybeUnwrapDisposer(value) {
    if (Disposer.isDisposer(value)) {
      this.resources[this.index]._setDisposable(value);
      return value.promise();
    }
    return value;
  }

  function ResourceList(length) {
    this.length = length;
    this.promise = null;
    this[length - 1] = null;
  }

  ResourceList.prototype._resultCancelled = function() {
    for (var len = this.length, i = 0; i < len; ++i) {
      var item = this[i];
      item instanceof Promise && item.cancel();
    }
  };

  Promise.using = function() {
    var len = arguments.length;
    if (len < 2) return apiRejection("you must pass at least 2 arguments to Promise.using");
    var input,
      fn = arguments[len - 1];
    if (typeof fn != "function")
      return apiRejection("expecting a function but got " + util.classString(fn));

    var spreadArgs = true;
    if (len === 2 && Array.isArray(arguments[0])) {
      len = (input = arguments[0]).length;
      spreadArgs = false;
    } else {
      input = arguments;
      len--;
    }
    var resources = new ResourceList(len);
    for (var i = 0; i < len; ++i) {
      var resource = input[i];
      if (Disposer.isDisposer(resource)) {
        var disposer = resource;
        (resource = resource.promise())._setDisposable(disposer);
      } else {
        var maybePromise = tryConvertToPromise(resource);
        if (maybePromise instanceof Promise)
          resource = maybePromise._then(
            maybeUnwrapDisposer, null, null, {resources: resources, index: i}, void 0
          );
      }
      resources[i] = resource;
    }

    var reflectedResources = new Array(resources.length);
    for (i = 0; i < reflectedResources.length; ++i)
      reflectedResources[i] = Promise.resolve(resources[i]).reflect();

    var resultPromise = Promise.all(reflectedResources).then(function(inspections) {
      for (var i = 0; i < inspections.length; ++i) {
        var inspection = inspections[i];
        if (inspection.isRejected()) {
          errorObj.e = inspection.error();
          return errorObj;
        }
        if (!inspection.isFulfilled()) {
          resultPromise.cancel();
          return;
        }
        inspections[i] = inspection.value();
      }
      promise._pushContext();

      fn = tryCatch(fn);
      var ret = spreadArgs ? fn.apply(void 0, inspections) : fn(inspections),
        promiseCreated = promise._popContext();
      debug.checkForgottenReturns(ret, promiseCreated, "Promise.using", promise);
      return ret;
    });

    var promise = resultPromise.lastly(function() {
      var inspection = new Promise.PromiseInspection(resultPromise);
      return dispose(resources, inspection);
    });
    resources.promise = promise;
    promise._setOnCancel(resources);
    return promise;
  };

  Promise.prototype._setDisposable = function(disposer) {
    this._bitField = this._bitField | 131072;
    this._disposer = disposer;
  };

  Promise.prototype._isDisposable = function() {
    return (this._bitField & 131072) > 0;
  };

  Promise.prototype._getDisposer = function() {
    return this._disposer;
  };

  Promise.prototype._unsetDisposable = function() {
    this._bitField = this._bitField & ~131072;
    this._disposer = void 0;
  };

  Promise.prototype.disposer = function(fn) {
    if (typeof fn == "function") return new FunctionDisposer(fn, this, createContext());

    throw new TypeError();
  };
};

},
"./any":
function(module) {

module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
  var ret = new SomePromiseArray(promises),
    promise = ret.promise();
  ret.setHowMany(1);
  ret.setUnwrap();
  ret.init();
  return promise;
}

Promise.any = function(promises) {
  return any(promises);
};

Promise.prototype.any = function() {
  return any(this);
};
};

},
"./each":
function(module) {

module.exports = function(Promise, INTERNAL) {
var PromiseReduce = Promise.reduce,
  PromiseAll = Promise.all;

function promiseAllThis() {
  return PromiseAll(this);
}

function PromiseMapSeries(promises, fn) {
  return PromiseReduce(promises, fn, INTERNAL, INTERNAL);
}

Promise.prototype.each = function(fn) {
  return PromiseReduce(this, fn, INTERNAL, 0)._then(
    promiseAllThis, void 0, void 0, this, void 0
  );
};

Promise.prototype.mapSeries = function(fn) {
  return PromiseReduce(this, fn, INTERNAL, INTERNAL);
};

Promise.each = function(promises, fn) {
  return PromiseReduce(promises, fn, INTERNAL, 0)._then(
    promiseAllThis, void 0, void 0, promises, void 0
  );
};

Promise.mapSeries = PromiseMapSeries;
};

},
"./filter":
function(module) {

module.exports = function(Promise, INTERNAL) {
var PromiseMap = Promise.map;

Promise.prototype.filter = function(fn, options) {
  return PromiseMap(this, fn, options, INTERNAL);
};

Promise.filter = function(promises, fn, options) {
  return PromiseMap(promises, fn, options, INTERNAL);
};
};

}
});

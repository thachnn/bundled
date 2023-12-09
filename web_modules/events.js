"use strict";

var ReflectOwnKeys, R = "object" == typeof Reflect ? Reflect : null, ReflectApply = R && "function" == typeof R.apply ? R.apply : function(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};

function ProcessEmitWarning(warning) {
  console && console.warn && console.warn(warning);
}

ReflectOwnKeys = R && "function" == typeof R.ownKeys ? R.ownKeys : Object.getOwnPropertySymbols ? function(target) {
  return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
} : function(target) {
  return Object.getOwnPropertyNames(target);
};

var NumberIsNaN = Number.isNaN || function(value) {
  return value != value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}

module.exports = EventEmitter, module.exports.once = once, EventEmitter.EventEmitter = EventEmitter, 
EventEmitter.prototype._events = void 0, EventEmitter.prototype._eventsCount = 0, 
EventEmitter.prototype._maxListeners = void 0;

var defaultMaxListeners = 10;

function checkListener(listener) {
  if ("function" != typeof listener) throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
}

function _getMaxListeners(that) {
  return void 0 === that._maxListeners ? EventEmitter.defaultMaxListeners : that._maxListeners;
}

function _addListener(target, type, listener, prepend) {
  var m, events, existing;
  if (checkListener(listener), void 0 === (events = target._events) ? (events = target._events = Object.create(null), 
  target._eventsCount = 0) : (void 0 !== events.newListener && (target.emit("newListener", type, listener.listener ? listener.listener : listener), 
  events = target._events), existing = events[type]), void 0 === existing) existing = events[type] = listener, 
  ++target._eventsCount; else if ("function" == typeof existing ? existing = events[type] = prepend ? [ listener, existing ] : [ existing, listener ] : prepend ? existing.unshift(listener) : existing.push(listener), 
  (m = _getMaxListeners(target)) > 0 && existing.length > m && !existing.warned) {
    existing.warned = !0;
    var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    w.name = "MaxListenersExceededWarning", w.emitter = target, w.type = type, w.count = existing.length, 
    ProcessEmitWarning(w);
  }
  return target;
}

function onceWrapper() {
  if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 
  0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}

function _onceWrap(target, type, listener) {
  var state = {
    fired: !1,
    wrapFn: void 0,
    target: target,
    type: type,
    listener: listener
  }, wrapped = onceWrapper.bind(state);
  return wrapped.listener = listener, state.wrapFn = wrapped, wrapped;
}

function _listeners(target, type, unwrap) {
  var events = target._events;
  if (void 0 === events) return [];
  var evlistener = events[type];
  return void 0 === evlistener ? [] : "function" == typeof evlistener ? unwrap ? [ evlistener.listener || evlistener ] : [ evlistener ] : unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

function listenerCount(type) {
  var events = this._events;
  if (void 0 !== events) {
    var evlistener = events[type];
    if ("function" == typeof evlistener) return 1;
    if (void 0 !== evlistener) return evlistener.length;
  }
  return 0;
}

function arrayClone(arr, n) {
  for (var copy = new Array(n), i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (;index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  for (var ret = new Array(arr.length), i = 0; i < ret.length; ++i) ret[i] = arr[i].listener || arr[i];
  return ret;
}

function once(emitter, name) {
  return new Promise((function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver), reject(err);
    }
    function resolver() {
      "function" == typeof emitter.removeListener && emitter.removeListener("error", errorListener), 
      resolve([].slice.call(arguments));
    }
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: !0
    }), "error" !== name && addErrorHandlerIfEventEmitter(emitter, errorListener, {
      once: !0
    });
  }));
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  "function" == typeof emitter.on && eventTargetAgnosticAddListener(emitter, "error", handler, flags);
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if ("function" == typeof emitter.on) flags.once ? emitter.once(name, listener) : emitter.on(name, listener); else {
    if ("function" != typeof emitter.addEventListener) throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    emitter.addEventListener(name, (function wrapListener(arg) {
      flags.once && emitter.removeEventListener(name, wrapListener), listener(arg);
    }));
  }
}

Object.defineProperty(EventEmitter, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if ("number" != typeof arg || arg < 0 || NumberIsNaN(arg)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
    defaultMaxListeners = arg;
  }
}), EventEmitter.init = function() {
  void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), 
  this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
}, EventEmitter.prototype.setMaxListeners = function(n) {
  if ("number" != typeof n || n < 0 || NumberIsNaN(n)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
  return this._maxListeners = n, this;
}, EventEmitter.prototype.getMaxListeners = function() {
  return _getMaxListeners(this);
}, EventEmitter.prototype.emit = function(type) {
  for (var args = [], i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = "error" === type, events = this._events;
  if (void 0 !== events) doError = doError && void 0 === events.error; else if (!doError) return !1;
  if (doError) {
    var er;
    if (args.length > 0 && (er = args[0]), er instanceof Error) throw er;
    var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
    throw err.context = er, err;
  }
  var handler = events[type];
  if (void 0 === handler) return !1;
  if ("function" == typeof handler) ReflectApply(handler, this, args); else {
    var len = handler.length, listeners = arrayClone(handler, len);
    for (i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }
  return !0;
}, EventEmitter.prototype.addListener = function(type, listener) {
  return _addListener(this, type, listener, !1);
}, EventEmitter.prototype.on = EventEmitter.prototype.addListener, EventEmitter.prototype.prependListener = function(type, listener) {
  return _addListener(this, type, listener, !0);
}, EventEmitter.prototype.once = function(type, listener) {
  return checkListener(listener), this.on(type, _onceWrap(this, type, listener)), 
  this;
}, EventEmitter.prototype.prependOnceListener = function(type, listener) {
  return checkListener(listener), this.prependListener(type, _onceWrap(this, type, listener)), 
  this;
}, EventEmitter.prototype.removeListener = function(type, listener) {
  var list, events, position, i, originalListener;
  if (checkListener(listener), void 0 === (events = this._events)) return this;
  if (void 0 === (list = events[type])) return this;
  if (list === listener || list.listener === listener) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete events[type], 
  events.removeListener && this.emit("removeListener", type, list.listener || listener)); else if ("function" != typeof list) {
    for (position = -1, i = list.length - 1; i >= 0; i--) if (list[i] === listener || list[i].listener === listener) {
      originalListener = list[i].listener, position = i;
      break;
    }
    if (position < 0) return this;
    0 === position ? list.shift() : spliceOne(list, position), 1 === list.length && (events[type] = list[0]), 
    void 0 !== events.removeListener && this.emit("removeListener", type, originalListener || listener);
  }
  return this;
}, EventEmitter.prototype.off = EventEmitter.prototype.removeListener, EventEmitter.prototype.removeAllListeners = function(type) {
  var listeners, events, i;
  if (void 0 === (events = this._events)) return this;
  if (void 0 === events.removeListener) return 0 === arguments.length ? (this._events = Object.create(null), 
  this._eventsCount = 0) : void 0 !== events[type] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete events[type]), 
  this;
  if (0 === arguments.length) {
    var key, keys = Object.keys(events);
    for (i = 0; i < keys.length; ++i) "removeListener" !== (key = keys[i]) && this.removeAllListeners(key);
    return this.removeAllListeners("removeListener"), this._events = Object.create(null), 
    this._eventsCount = 0, this;
  }
  if ("function" == typeof (listeners = events[type])) this.removeListener(type, listeners); else if (void 0 !== listeners) for (i = listeners.length - 1; i >= 0; i--) this.removeListener(type, listeners[i]);
  return this;
}, EventEmitter.prototype.listeners = function(type) {
  return _listeners(this, type, !0);
}, EventEmitter.prototype.rawListeners = function(type) {
  return _listeners(this, type, !1);
}, EventEmitter.listenerCount = function(emitter, type) {
  return "function" == typeof emitter.listenerCount ? emitter.listenerCount(type) : listenerCount.call(emitter, type);
}, EventEmitter.prototype.listenerCount = listenerCount, EventEmitter.prototype.eventNames = function() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
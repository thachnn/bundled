'use strict';

var R = typeof Reflect == 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply == 'function'
  ? R.apply
  : function(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };

var ReflectOwnKeys = R && typeof R.ownKeys == 'function'
  ? R.ownKeys
  : Object.getOwnPropertySymbols
  ? function(target) {
      return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
    }
  : function(target) {
      return Object.getOwnPropertyNames(target);
    };

function ProcessEmitWarning(warning) {
  console && console.warn && console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function(value) {
  return value !== value;
};

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = void 0;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = void 0;

var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener != 'function')
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg != 'number' || arg < 0 || NumberIsNaN(arg))
      throw new RangeError(
        'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.'
      );

    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {
  if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners || (this._maxListeners = void 0);
};

EventEmitter.prototype.setMaxListeners = function(n) {
  if (typeof n != 'number' || n < 0 || NumberIsNaN(n))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');

  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  return that._maxListeners === void 0 ? EventEmitter.defaultMaxListeners : that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function(type) {
  var args = [].slice.call(arguments, 1),
    doError = type === 'error',

    events = this._events;
  if (events !== void 0) doError = doError && events.error === void 0;
  else if (!doError) return false;

  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) throw er;

    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err;
  }

  var handler = events[type];
  if (handler === void 0) return false;

  if (typeof handler == 'function') ReflectApply(handler, this, args);
  else
    for (var len = handler.length, listeners = arrayClone(handler, len), i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m, events, existing;

  checkListener(listener);

  if ((events = target._events) === void 0) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    if (events.newListener !== void 0) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      events = target._events;
    }
    existing = events[type];
  }

  if (existing === void 0) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    typeof existing == 'function'
      ? (existing = events[type] = prepend ? [listener, existing] : [existing, listener])
      : prepend
      ? existing.unshift(listener)
      : existing.push(listener);

    if ((m = _getMaxListeners(target)) > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      var w = new Error(
        'Possible EventEmitter memory leak detected. ' +
        existing.length + ' ' + String(type) +
        ' listeners added. Use emitter.setMaxListeners() to increase limit'
      );
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener = function(type, listener) {
  return _addListener(this, type, listener, true);
};

function onceWrapper() {
  if (this.fired) return;
  this.target.removeListener(this.type, this.wrapFn);
  this.fired = true;
  return arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: void 0, target: target, type: type, listener: listener },
    wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener = function(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  var list, events, position, i, originalListener;

  checkListener(listener);

  if ((events = this._events) === void 0) return this;

  if ((list = events[type]) === void 0) return this;

  if (list === listener || list.listener === listener)
    if (--this._eventsCount == 0) this._events = Object.create(null);
    else {
      delete events[type];
      events.removeListener && this.emit('removeListener', type, list.listener || listener);
    }
  else if (typeof list != 'function') {
    position = -1;

    for (i = list.length - 1; i >= 0; i--)
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }

    if (position < 0) return this;

    position === 0 ? list.shift() : spliceOne(list, position);

    if (list.length === 1) events[type] = list[0];

    events.removeListener === void 0 || this.emit('removeListener', type, originalListener || listener);
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners = function(type) {
  var listeners, events, i;

  if ((events = this._events) === void 0) return this;

  if (events.removeListener === void 0) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== void 0)
      --this._eventsCount == 0 ? (this._events = Object.create(null)) : delete events[type];

    return this;
  }

  if (arguments.length === 0) {
    var key,
      keys = Object.keys(events);
    for (i = 0; i < keys.length; ++i) (key = keys[i]) === 'removeListener' || this.removeAllListeners(key);

    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }

  if (typeof (listeners = events[type]) == 'function') this.removeListener(type, listeners);
  else if (listeners !== void 0)
    for (i = listeners.length - 1; i >= 0; i--) this.removeListener(type, listeners[i]);

  return this;
};

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === void 0) return [];

  var evlistener = events[type];
  return evlistener === void 0
    ? []
    : typeof evlistener == 'function'
    ? unwrap ? [evlistener.listener || evlistener] : [evlistener]
    : unwrap
    ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  return typeof emitter.listenerCount == 'function'
    ? emitter.listenerCount(type)
    : listenerCount.call(emitter, type);
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== void 0) {
    var evlistener = events[type];

    if (typeof evlistener == 'function') return 1;
    if (evlistener !== void 0) return evlistener.length;
  }

  return 0;
}

EventEmitter.prototype.eventNames = function() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) ret[i] = arr[i].listener || arr[i];

  return ret;
}

function once(emitter, name) {
  return new Promise(function(resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      typeof emitter.removeListener != 'function' || emitter.removeListener('error', errorListener);

      resolve([].slice.call(arguments));
    }

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    name === 'error' || addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  typeof emitter.on != 'function' || eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on == 'function') flags.once ? emitter.once(name, listener) : emitter.on(name, listener);
  else {
    if (typeof emitter.addEventListener != 'function')
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);

    emitter.addEventListener(name, function wrapListener(arg) {
      flags.once && emitter.removeEventListener(name, wrapListener);

      listener(arg);
    });
  }
}

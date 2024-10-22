'use strict';

module.exports = (function (modules) {
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
  return __webpack_require__(13);
})([
// 0
function (module) {

module.exports = require('../util');

},
// 1
function (module, exports, __webpack_require__) {

var pna = __webpack_require__(3);

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
};

module.exports = Duplex;

var util = Object.create(__webpack_require__(2));
util.inherits = __webpack_require__(0).inherits;

var Readable = __webpack_require__(5),
  Writable = __webpack_require__(10);

util.inherits(Duplex, Readable);

for (var keys = objectKeys(Writable.prototype), v = 0; v < keys.length; v++) {
  var method = keys[v];
  Duplex.prototype[method] || (Duplex.prototype[method] = Writable.prototype[method]);
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = !options || options.allowHalfOpen !== false;

  this.once('end', onend);
}

Object.defineProperty(Duplex.prototype, 'writableHighWaterMark', {
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

function onend() {
  if (this.allowHalfOpen || this._writableState.ended) return;

  pna.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex.prototype, 'destroyed', {
  get: function () {
    return this._readableState !== void 0 && this._writableState !== void 0 &&
      this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function (value) {
    if (this._readableState === void 0 || this._writableState === void 0) return;

    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});

Duplex.prototype._destroy = function (err, cb) {
  this.push(null);
  this.end();

  pna.nextTick(cb, err);
};

},
// 2
function (module, exports, __webpack_require__) {

function isArray(arg) {
  return Array.isArray ? Array.isArray(arg) : objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg == 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg == 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg == 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg == 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg == 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return objectToString(e) === '[object Error]' || e instanceof Error;
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg == 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
    typeof arg == 'boolean' ||
    typeof arg == 'number' ||
    typeof arg == 'string' ||
    typeof arg == 'symbol' ||
    arg === void 0;
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(7).Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

},
// 3
function (module) {

module.exports =
  typeof process == 'undefined' || !process.version || /^v?(0|1\.[0-7])\./.test(process.version)
    ? { nextTick: nextTick }
    : process;

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn != 'function') throw new TypeError('"callback" argument must be a function');

  var len = arguments.length;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function () {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function () {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function () {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    var args = new Array(len - 1);
    for (var i = 0; i < args.length; ) args[i++] = arguments[i];

    return process.nextTick(function () {
      fn.apply(null, args);
    });
  }
}

},
// 4
function (module, exports, __webpack_require__) {

var buffer = __webpack_require__(7),
  Buffer = buffer.Buffer

function copyProps(src, dst) {
  for (var key in src) dst[key] = src[key]
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow)
  module.exports = buffer
else {
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer(arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg == 'number') throw new TypeError('Argument must not be a number')

  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size != 'number') throw new TypeError('Argument must be a number')

  var buf = Buffer(size)
  fill === void 0
    ? buf.fill(0)
    : typeof encoding == 'string'
    ? buf.fill(fill, encoding)
    : buf.fill(fill)

  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size != 'number') throw new TypeError('Argument must be a number')

  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size != 'number') throw new TypeError('Argument must be a number')

  return buffer.SlowBuffer(size)
}

},
// 5
function (module, exports, __webpack_require__) {

var pna = __webpack_require__(3);

module.exports = Readable;

var Duplex,

  isArray = __webpack_require__(15);

Readable.ReadableState = ReadableState;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};

var Stream = __webpack_require__(6),

  Buffer = __webpack_require__(4).Buffer,
  OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var util = Object.create(__webpack_require__(2));
util.inherits = __webpack_require__(0).inherits;

var debugUtil = __webpack_require__(8),
  debug = debugUtil && debugUtil.debuglog ? debugUtil.debuglog('stream') : function () {};

var StringDecoder,
  BufferList = __webpack_require__(16),
  destroyImpl = __webpack_require__(9);

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  if (typeof emitter.prependListener == 'function') return emitter.prependListener(event, fn);

  !emitter._events || !emitter._events[event] ? emitter.on(event, fn)
    : isArray(emitter._events[event]) ? emitter._events[event].unshift(fn)
    : (emitter._events[event] = [fn, emitter._events[event]]);
}

function ReadableState(options, stream) {
  options = options || {};

  var isDuplex = stream instanceof (Duplex = Duplex || __webpack_require__(1));

  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  var hwm = options.highWaterMark,
    readableHwm = options.readableHighWaterMark,
    defaultHwm = this.objectMode ? 16 : 16384;

  this.highWaterMark = hwm || hwm === 0 ? hwm
    : isDuplex && (readableHwm || readableHwm === 0) ? readableHwm
    : defaultHwm;

  this.highWaterMark = Math.floor(this.highWaterMark);

  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  this.sync = true;

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  this.destroyed = false;

  this.defaultEncoding = options.defaultEncoding || 'utf8';

  this.awaitDrain = 0;

  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    StringDecoder || (StringDecoder = __webpack_require__(11).StringDecoder);
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || __webpack_require__(1);

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  this.readable = true;

  if (options) {
    if (typeof options.read == 'function') this._read = options.read;

    if (typeof options.destroy == 'function') this._destroy = options.destroy;
  }

  Stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  get: function () {
    return this._readableState !== void 0 && this._readableState.destroyed;
  },
  set: function (value) {
    if (!this._readableState) return;

    this._readableState.destroyed = value;
  }
});

Readable.prototype.destroy = destroyImpl.destroy;
Readable.prototype._undestroy = destroyImpl.undestroy;
Readable.prototype._destroy = function (err, cb) {
  this.push(null);
  cb(err);
};

Readable.prototype.push = function (chunk, encoding) {
  var skipChunkCheck,
    state = this._readableState;

  if (state.objectMode) skipChunkCheck = true;
  else if (typeof chunk == 'string') {
    if ((encoding = encoding || state.defaultEncoding) !== state.encoding) {
      chunk = Buffer.from(chunk, encoding);
      encoding = '';
    }
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
};

Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  var state = stream._readableState;
  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
    return needMoreData(state);
  }

  var er;
  skipChunkCheck || (er = chunkInvalid(state, chunk));
  if (er) stream.emit('error', er);
  else if (state.objectMode || (chunk && chunk.length > 0)) {
    typeof chunk == 'string' || state.objectMode ||
      Object.getPrototypeOf(chunk) === Buffer.prototype ||
      (chunk = _uint8ArrayToBuffer(chunk));

    if (addToFront)
      state.endEmitted
        ? stream.emit('error', new Error('stream.unshift() after end event'))
        : addChunk(stream, state, chunk, true);
    else if (state.ended) stream.emit('error', new Error('stream.push() after EOF'));
    else {
      state.reading = false;
      if (state.decoder && !encoding) {
        chunk = state.decoder.write(chunk);
        state.objectMode || chunk.length > 0
          ? addChunk(stream, state, chunk, false)
          : maybeReadMore(stream, state);
      } else addChunk(stream, state, chunk, false);
    }
  } else addToFront || (state.reading = false);

  return needMoreData(state);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    stream.emit('data', chunk);
    stream.read(0);
  } else {
    state.length += state.objectMode ? 1 : chunk.length;
    addToFront ? state.buffer.unshift(chunk) : state.buffer.push(chunk);

    state.needReadable && emitReadable(stream);
  }
  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;
  _isUint8Array(chunk) || typeof chunk == 'string' || chunk === void 0 || state.objectMode ||
    (er = new TypeError('Invalid non-string/buffer chunk'));

  return er;
}

function needMoreData(state) {
  return !state.ended &&
    (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

Readable.prototype.setEncoding = function (enc) {
  StringDecoder || (StringDecoder = __webpack_require__(11).StringDecoder);
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) n = MAX_HWM;
  else {
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (n <= 0 || (state.length === 0 && state.ended)) return 0;
  if (state.objectMode) return 1;
  if (n !== n)
    return state.flowing && state.length ? state.buffer.head.data.length : state.length;

  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState,
    nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    state.length === 0 && state.ended ? endReadable(this) : emitReadable(this);
    return null;
  }

  if ((n = howMuchToRead(n, state)) === 0 && state.ended) {
    state.length > 0 || endReadable(this);
    return null;
  }

  var doRead = state.needReadable;
  debug('need readable', doRead);

  if (state.length === 0 || state.length - n < state.highWaterMark)
    debug('length less than watermark', (doRead = true));

  if (state.ended || state.reading) debug('reading or ended', (doRead = false));
  else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    if (state.length === 0) state.needReadable = true;
    this._read(state.highWaterMark);
    state.sync = false;
    state.reading || (n = howMuchToRead(nOrig, state));
  }

  var ret = n > 0 ? fromList(n, state) : null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else state.length -= n;

  if (state.length === 0) {
    state.ended || (state.needReadable = true);

    nOrig !== n && state.ended && endReadable(this);
  }

  ret === null || this.emit('data', ret);

  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  emitReadable(stream);
}

function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    state.sync ? pna.nextTick(emitReadable_, stream) : emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    pna.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) break;
    len = state.length;
  }
  state.readingMore = false;
}

Readable.prototype._read = /** @param {number} n */ function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this,
    state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var endFn =
    (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr
      ? onend : unpipe;
  state.endEmitted ? pna.nextTick(endFn) : src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable, unpipeInfo) {
    debug('onunpipe');
    if (readable === src && unpipeInfo && unpipeInfo.hasUnpiped === false) {
      unpipeInfo.hasUnpiped = true;
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);

    cleanedUp = true;

    !state.awaitDrain || (dest._writableState && !dest._writableState.needDrain) || ondrain();
  }

  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    if (false !== dest.write(chunk) || increasedAwaitDrain) return;

    if (((state.pipesCount === 1 && state.pipes === dest) ||
        (state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1)) && !cleanedUp) {
      debug('false write response, pause', src._readableState.awaitDrain);
      src._readableState.awaitDrain++;
      increasedAwaitDrain = true;
    }
    src.pause();
  }

  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    EElistenerCount(dest, 'error') !== 0 || dest.emit('error', er);
  }

  prependListener(dest, 'error', onerror);

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  dest.emit('pipe', src);

  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    state.awaitDrain && state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState,
    unpipeInfo = { hasUnpiped: false };

  if (state.pipesCount === 0) return this;

  if (state.pipesCount === 1) {
    if (dest && dest !== state.pipes) return this;

    dest || (dest = state.pipes);

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    dest && dest.emit('unpipe', this, unpipeInfo);
    return this;
  }

  if (!dest) {
    var dests = state.pipes,
      len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) dests[i].emit('unpipe', this, unpipeInfo);
    return this;
  }

  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this, unpipeInfo);

  return this;
};

Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') this._readableState.flowing === false || this.resume();
  else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      !state.reading ? pna.nextTick(nReadingNextTick, this) : state.length && emitReadable(this);
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    pna.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  !state.flowing || state.reading || stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null);
}

Readable.prototype.wrap = function (stream) {
  var _this = this,

    state = this._readableState,
    paused = false;

  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      chunk && chunk.length && _this.push(chunk);
    }

    _this.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    if ((!state.objectMode || (chunk !== null && chunk !== void 0)) &&
        (state.objectMode || (chunk && chunk.length)) &&

        !_this.push(chunk)) {
      paused = true;
      stream.pause();
    }
  });

  for (var i in stream)
    if (this[i] === void 0 && typeof stream[i] == 'function')
      this[i] = (function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      })(i);

  for (var n = 0; n < kProxyEvents.length; n++)
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));

  this._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  enumerable: false,
  get: function () {
    return this._readableState.highWaterMark;
  }
});

Readable._fromList = fromList;

function fromList(n, state) {
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();
  else if (!n || n >= state.length) {
    ret = state.decoder ? state.buffer.join('')
      : state.buffer.length === 1 ? state.buffer.head.data
      : state.buffer.concat(state.length);
    state.buffer.clear();
  } else ret = fromListPartial(n, state.buffer, state.decoder);

  return ret;
}

function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else
    ret = n === list.head.data.length ? list.shift()
      : hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);

  return ret;
}

function copyFromBufferString(n, list) {
  var p = list.head,
    c = 1,
    ret = p.data;
  n -= ret.length;
  while ((p = p.next)) {
    var str = p.data,
      nb = n > str.length ? str.length : n;
    ret += nb === str.length ? str : str.slice(0, n);
    if ((n -= nb) == 0) {
      if (nb === str.length) {
        ++c;
        list.head = p.next || (list.tail = null);
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n),
    p = list.head,
    c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while ((p = p.next)) {
    var buf = p.data,
      nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    if ((n -= nb) == 0) {
      if (nb === buf.length) {
        ++c;
        list.head = p.next || (list.tail = null);
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    pna.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;

  return -1;
}

},
// 6
function (module) {

module.exports = require('events').EventEmitter;

},
// 7
function (module) {

module.exports = require('buffer');

},
// 8
function (module) {

module.exports = require('util');

},
// 9
function (module, exports, __webpack_require__) {

var pna = __webpack_require__(3);

function destroy(err, cb) {
  var _this = this,

    readableDestroyed = this._readableState && this._readableState.destroyed,
    writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    cb ? cb(err)
      : !err || (this._writableState && this._writableState.errorEmitted) ||
        pna.nextTick(emitErrorNT, this, err);

    return this;
  }

  if (this._readableState) this._readableState.destroyed = true;

  if (this._writableState) this._writableState.destroyed = true;

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      pna.nextTick(emitErrorNT, _this, err);
      if (_this._writableState) _this._writableState.errorEmitted = true;
    } else cb && cb(err);
  });

  return this;
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = { destroy: destroy, undestroy: undestroy };

},
// 10
function (module, exports, __webpack_require__) {

var pna = __webpack_require__(3);

module.exports = Writable;

function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}

var Duplex,

  asyncWrite = process.browser || /^v?0\.[0-8]\b/.test(process.version) ? pna.nextTick : setImmediate;

Writable.WritableState = WritableState;

var util = Object.create(__webpack_require__(2));
util.inherits = __webpack_require__(0).inherits;

var internalUtil = { deprecate: __webpack_require__(0).deprecate },

  Stream = __webpack_require__(6),

  Buffer = __webpack_require__(4).Buffer,
  OurUint8Array = global.Uint8Array || function () {};
function _uint8ArrayToBuffer(chunk) {
  return Buffer.from(chunk);
}
function _isUint8Array(obj) {
  return Buffer.isBuffer(obj) || obj instanceof OurUint8Array;
}

var realHasInstance,
  destroyImpl = __webpack_require__(9);

util.inherits(Writable, Stream);

function nop() {}

function WritableState(options, stream) {
  Duplex = Duplex || __webpack_require__(1);

  options = options || {};

  var isDuplex = stream instanceof Duplex;

  this.objectMode = !!options.objectMode;

  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  var hwm = options.highWaterMark,
    writableHwm = options.writableHighWaterMark,
    defaultHwm = this.objectMode ? 16 : 16384;

  this.highWaterMark = hwm || hwm === 0 ? hwm
    : isDuplex && (writableHwm || writableHwm === 0) ? writableHwm
    : defaultHwm;

  this.highWaterMark = Math.floor(this.highWaterMark);

  this.finalCalled = false;

  this.needDrain = false;
  this.ending = false;
  this.ended = false;
  this.finished = false;

  this.destroyed = false;

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  this.defaultEncoding = options.defaultEncoding || 'utf8';

  this.length = 0;

  this.writing = false;

  this.corked = 0;

  this.sync = true;

  this.bufferProcessing = false;

  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  this.writecb = null;

  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  this.pendingcb = 0;

  this.prefinished = false;

  this.errorEmitted = false;

  this.bufferedRequestCount = 0;

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function () {
  var out = [];
  for (var current = this.bufferedRequest; current; ) {
    out.push(current);
    current = current.next;
  }
  return out;
};

!(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer instead.', 'DEP0003')
    });
  } catch (_) {}
})();

if (typeof Symbol == 'function' && Symbol.hasInstance &&
    typeof Function.prototype[Symbol.hasInstance] == 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      return !!realHasInstance.call(this, object) ||
        (this === Writable && object && object._writableState instanceof WritableState);
    }
  });
} else
  realHasInstance = function (object) {
    return object instanceof this;
  };

function Writable(options) {
  Duplex = Duplex || __webpack_require__(1);

  if (!(realHasInstance.call(Writable, this) || this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  this.writable = true;

  if (options) {
    if (typeof options.write == 'function') this._write = options.write;

    if (typeof options.writev == 'function') this._writev = options.writev;

    if (typeof options.destroy == 'function') this._destroy = options.destroy;

    if (typeof options.final == 'function') this._final = options.final;
  }

  Stream.call(this);
}

Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  stream.emit('error', er);
  pna.nextTick(cb, er);
}

function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er =
    chunk === null
    ? new TypeError('May not write null values to stream')
    : typeof chunk != 'string' && chunk !== void 0 && !state.objectMode &&
      new TypeError('Invalid non-string/buffer chunk');

  if (er) {
    stream.emit('error', er);
    pna.nextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState,
    ret = false,
    isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer.isBuffer(chunk)) chunk = _uint8ArrayToBuffer(chunk);

  if (typeof encoding == 'function') {
    cb = encoding;
    encoding = null;
  }

  isBuf ? (encoding = 'buffer') : encoding || (encoding = state.defaultEncoding);

  if (typeof cb != 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);
  else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  this._writableState.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    state.writing || state.corked || state.finished || state.bufferProcessing || !state.bufferedRequest ||
      clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function (encoding) {
  if (typeof encoding == 'string') encoding = encoding.toLowerCase();
  if (['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'
      ].indexOf((encoding + '').toLowerCase()) < 0)
    throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk == 'string')
    chunk = Buffer.from(chunk, encoding);

  return chunk;
}

Object.defineProperty(Writable.prototype, 'writableHighWaterMark', {
  enumerable: false,
  get: function () {
    return this._writableState.highWaterMark;
  }
});

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);
    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  ret || (state.needDrain = true);

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };
    if (last) last.next = state.lastBufferedRequest;
    else state.bufferedRequest = state.lastBufferedRequest;

    state.bufferedRequestCount += 1;
  } else doWrite(stream, state, false, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  writev ? stream._writev(chunk, state.onwrite) : stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    pna.nextTick(cb, er);
    pna.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState,
    sync = state.sync,
    cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);
  else {
    var finished = needFinish(state);

    finished || state.corked || state.bufferProcessing || !state.bufferedRequest ||
      clearBuffer(stream, state);

    sync
      ? asyncWrite(afterWrite, stream, state, finished, cb)
      : afterWrite(stream, state, finished, cb);
  }
}

function afterWrite(stream, state, finished, cb) {
  finished || onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    var l = state.bufferedRequestCount,
      buffer = new Array(l),
      holder = state.corkedRequestsFree;
    holder.entry = entry;

    var allBuffers = true;
    for (var count = 0; entry; ) {
      buffer[count] = entry;
      entry.isBuf || (allBuffers = false);
      entry = entry.next;
      count += 1;
    }
    buffer.allBuffers = allBuffers;

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else state.corkedRequestsFree = new CorkedRequest(state);

    state.bufferedRequestCount = 0;
  } else {
    while (entry) {
      var chunk = entry.chunk,
        encoding = entry.encoding,
        cb = entry.callback;

      doWrite(stream, state, false, state.objectMode ? 1 : chunk.length, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--;
      if (state.writing) break;
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk == 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding == 'function') {
    cb = encoding;
    encoding = null;
  }

  chunk === null || chunk === void 0 || this.write(chunk, encoding);

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  state.ending || state.finished || endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null &&
    !state.finished && !state.writing;
}
function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;
    err && stream.emit('error', err);

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}
function prefinish(stream, state) {
  if (state.prefinished || state.finalCalled) return;

  if (typeof stream._final == 'function') {
    state.pendingcb++;
    state.finalCalled = true;
    pna.nextTick(callFinal, stream, state);
  } else {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    prefinish(stream, state);
    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) state.finished ? pna.nextTick(cb) : stream.once('finish', cb);

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;
  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  }
  state.corkedRequestsFree
    ? (state.corkedRequestsFree.next = corkReq)
    : (state.corkedRequestsFree = corkReq);
}

Object.defineProperty(Writable.prototype, 'destroyed', {
  get: function () {
    return this._writableState !== void 0 && this._writableState.destroyed;
  },
  set: function (value) {
    if (!this._writableState) return;

    this._writableState.destroyed = value;
  }
});

Writable.prototype.destroy = destroyImpl.destroy;
Writable.prototype._undestroy = destroyImpl.undestroy;
Writable.prototype._destroy = function (err, cb) {
  this.end();
  cb(err);
};

},
// 11
function (module) {

module.exports = require('../string_decoder');

},
// 12
function (module, exports, __webpack_require__) {

module.exports = Transform;

var Duplex = __webpack_require__(1),

  util = Object.create(__webpack_require__(2));
util.inherits = __webpack_require__(0).inherits;

util.inherits(Transform, Duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return this.emit('error', new Error('write callback called multiple times'));

  ts.writechunk = null;
  ts.writecb = null;

  data == null || this.push(data);

  cb(er);

  var rs = this._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  };

  this._readableState.needReadable = true;

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform == 'function') this._transform = options.transform;

    if (typeof options.flush == 'function') this._flush = options.flush;
  }

  this.on('prefinish', prefinish);
}

function prefinish() {
  var _this = this;

  typeof this._flush == 'function'
    ? this._flush(function (er, data) {
        done(_this, er, data);
      })
    : done(this, null, null);
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// noinspection JSUnusedLocalSymbols
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

Transform.prototype._read = /** @param {number} n */ function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else ts.needTransform = true;
};

Transform.prototype._destroy = function (err, cb) {
  var _this2 = this;

  Duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
    _this2.emit('close');
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  data == null || stream.push(data);

  if (stream._writableState.length) throw new Error('Calling transform done when ws.length != 0');

  if (stream._transformState.transforming)
    throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}

},
// 13
function (module, exports, __webpack_require__) {

var Stream = __webpack_require__(14);
if (process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
  (exports = module.exports = Stream.Readable).Readable = Stream.Readable;
  exports.Writable = Stream.Writable;
  exports.Duplex = Stream.Duplex;
  exports.Transform = Stream.Transform;
  exports.PassThrough = Stream.PassThrough;
  exports.Stream = Stream;
} else {
  (exports = module.exports = __webpack_require__(5)).Stream = Stream || exports;
  exports.Readable = exports;
  exports.Writable = __webpack_require__(10);
  exports.Duplex = __webpack_require__(1);
  exports.Transform = __webpack_require__(12);
  exports.PassThrough = __webpack_require__(17);
}

},
// 14
function (module) {

module.exports = require('stream');

},
// 15
function (module) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},
// 16
function (module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError('Cannot call a class as a function');
}

var Buffer = __webpack_require__(4).Buffer,
  util = __webpack_require__(8);

function copyBuffer(src, target, offset) {
  src.copy(target, offset);
}

module.exports = (function () {
  function BufferList() {
    _classCallCheck(this, BufferList);

    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  BufferList.prototype.push = function (v) {
    var entry = { data: v, next: null };
    this.length > 0 ? (this.tail.next = entry) : (this.head = entry);
    this.tail = entry;
    ++this.length;
  };

  BufferList.prototype.unshift = function (v) {
    var entry = { data: v, next: this.head };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  BufferList.prototype.shift = function () {
    if (this.length === 0) return;
    var ret = this.head.data;
    this.head = this.length === 1 ? (this.tail = null) : this.head.next;
    --this.length;
    return ret;
  };

  BufferList.prototype.clear = function () {
    this.head = this.tail = null;
    this.length = 0;
  };

  BufferList.prototype.join = function (s) {
    if (this.length === 0) return '';
    var p = this.head,
      ret = '' + p.data;
    while ((p = p.next)) ret += s + p.data;
    return ret;
  };

  BufferList.prototype.concat = function (n) {
    if (this.length === 0) return Buffer.alloc(0);
    if (this.length === 1) return this.head.data;
    var ret = Buffer.allocUnsafe(n >>> 0);
    for (var p = this.head, i = 0; p; ) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }
    return ret;
  };

  return BufferList;
})();

if (util && util.inspect && util.inspect.custom)
  module.exports.prototype[util.inspect.custom] = function () {
    var obj = util.inspect({ length: this.length });
    return this.constructor.name + ' ' + obj;
  };

},
// 17
function (module, exports, __webpack_require__) {

module.exports = PassThrough;

var Transform = __webpack_require__(12),

  util = Object.create(__webpack_require__(2));
util.inherits = __webpack_require__(0).inherits;

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};

}
]);

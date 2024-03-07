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
  return __webpack_require__(5);
})([
// 0
function (module, exports) {

var TYPED_OK =
  typeof Uint8Array != 'undefined' && typeof Uint16Array != 'undefined' && typeof Int32Array != 'undefined';

function _has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

exports.assign = function (obj) {
  for (var sources = Array.prototype.slice.call(arguments, 1); sources.length; ) {
    var source = sources.shift();
    if (!source) continue;

    if (typeof source != 'object') throw new TypeError(source + 'must be non-object');

    for (var p in source) if (_has(source, p)) obj[p] = source[p];
  }

  return obj;
};

exports.shrinkBuf = function (buf, size) {
  if (buf.length === size) return buf;
  if (buf.subarray) return buf.subarray(0, size);
  buf.length = size;
  return buf;
};

var fnTyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    if (src.subarray && dest.subarray) {
      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
      return;
    }
    for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
  },
  flattenChunks: function (chunks) {
    var i, l, len, pos, chunk, result;

    len = 0;
    for (i = 0, l = chunks.length; i < l; i++) len += chunks[i].length;

    result = new Uint8Array(len);
    pos = 0;
    for (i = 0, l = chunks.length; i < l; i++) {
      chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }

    return result;
  }
};

var fnUntyped = {
  arraySet: function (dest, src, src_offs, len, dest_offs) {
    for (var i = 0; i < len; i++) dest[dest_offs + i] = src[src_offs + i];
  },
  flattenChunks: function (chunks) {
    return Array.prototype.concat.apply([], chunks);
  }
};

exports.setTyped = function (on) {
  if (on) {
    exports.Buf8 = Uint8Array;
    exports.Buf16 = Uint16Array;
    exports.Buf32 = Int32Array;
    exports.assign(exports, fnTyped);
  } else {
    exports.Buf8 = Array;
    exports.Buf16 = Array;
    exports.Buf32 = Array;
    exports.assign(exports, fnUntyped);
  }
};

exports.setTyped(TYPED_OK);

},
// 1
function (module) {

module.exports = require('buffer');

},
// 2
function (module) {

module.exports = require('assert');

},
// 3
function (module) {

function adler32(adler, buf, len, pos) {
  var s1 = (adler & 0xffff) | 0,
    s2 = ((adler >>> 16) & 0xffff) | 0;

  for (var n = 0; len !== 0; ) {
    len -= n = len > 2000 ? 2000 : len;

    do {
      s2 = (s2 + (s1 = (s1 + buf[pos++]) | 0)) | 0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return s1 | (s2 << 16) | 0;
}

module.exports = adler32;

},
// 4
function (module) {

function makeTable() {
  var table = [];

  for (var c, n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;

    table[n] = c;
  }

  return table;
}

var crcTable = makeTable();

function crc32(crc, buf, len, pos) {
  var t = crcTable,
    end = pos + len;

  crc ^= -1;

  for (var i = pos; i < end; i++) crc = (crc >>> 8) ^ t[0xFF & (crc ^ buf[i])];

  return crc ^ -1;
}

module.exports = crc32;

},
// 5
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(1).Buffer,
  Transform = __webpack_require__(6).Transform,
  binding = __webpack_require__(7),
  util = __webpack_require__(16),
  assert = __webpack_require__(2).ok,
  kMaxLength = __webpack_require__(1).kMaxLength,
  kRangeErrorMessage = 'Cannot create final Buffer. It would be larger than 0x' + kMaxLength.toString(16) + ' bytes';

binding.Z_MIN_WINDOWBITS = 8;
binding.Z_MAX_WINDOWBITS = 15;
binding.Z_DEFAULT_WINDOWBITS = 15;

binding.Z_MIN_CHUNK = 64;
binding.Z_MAX_CHUNK = Infinity;
binding.Z_DEFAULT_CHUNK = 16384;

binding.Z_MIN_MEMLEVEL = 1;
binding.Z_MAX_MEMLEVEL = 9;
binding.Z_DEFAULT_MEMLEVEL = 8;

binding.Z_MIN_LEVEL = -1;
binding.Z_MAX_LEVEL = 9;
binding.Z_DEFAULT_LEVEL = binding.Z_DEFAULT_COMPRESSION;

for (var bkeys = Object.keys(binding), bk = 0; bk < bkeys.length; bk++) {
  var bkey = bkeys[bk];
  bkey.match(/^Z/) &&
    Object.defineProperty(exports, bkey, { enumerable: true, value: binding[bkey], writable: false });
}

var codes = {
  Z_OK: binding.Z_OK,
  Z_STREAM_END: binding.Z_STREAM_END,
  Z_NEED_DICT: binding.Z_NEED_DICT,
  Z_ERRNO: binding.Z_ERRNO,
  Z_STREAM_ERROR: binding.Z_STREAM_ERROR,
  Z_DATA_ERROR: binding.Z_DATA_ERROR,
  Z_MEM_ERROR: binding.Z_MEM_ERROR,
  Z_BUF_ERROR: binding.Z_BUF_ERROR,
  Z_VERSION_ERROR: binding.Z_VERSION_ERROR
};

for (var ckeys = Object.keys(codes), ck = 0; ck < ckeys.length; ck++) {
  var ckey = ckeys[ck];
  codes[codes[ckey]] = ckey;
}

Object.defineProperty(exports, 'codes', { enumerable: true, value: Object.freeze(codes), writable: false });

exports.Deflate = Deflate;
exports.Inflate = Inflate;
exports.Gzip = Gzip;
exports.Gunzip = Gunzip;
exports.DeflateRaw = DeflateRaw;
exports.InflateRaw = InflateRaw;
exports.Unzip = Unzip;

exports.createDeflate = function (o) {
  return new Deflate(o);
};

exports.createInflate = function (o) {
  return new Inflate(o);
};

exports.createDeflateRaw = function (o) {
  return new DeflateRaw(o);
};

exports.createInflateRaw = function (o) {
  return new InflateRaw(o);
};

exports.createGzip = function (o) {
  return new Gzip(o);
};

exports.createGunzip = function (o) {
  return new Gunzip(o);
};

exports.createUnzip = function (o) {
  return new Unzip(o);
};

exports.deflate = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Deflate(opts), buffer, callback);
};

exports.deflateSync = function (buffer, opts) {
  return zlibBufferSync(new Deflate(opts), buffer);
};

exports.gzip = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gzip(opts), buffer, callback);
};

exports.gzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gzip(opts), buffer);
};

exports.deflateRaw = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new DeflateRaw(opts), buffer, callback);
};

exports.deflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new DeflateRaw(opts), buffer);
};

exports.unzip = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Unzip(opts), buffer, callback);
};

exports.unzipSync = function (buffer, opts) {
  return zlibBufferSync(new Unzip(opts), buffer);
};

exports.inflate = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Inflate(opts), buffer, callback);
};

exports.inflateSync = function (buffer, opts) {
  return zlibBufferSync(new Inflate(opts), buffer);
};

exports.gunzip = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new Gunzip(opts), buffer, callback);
};

exports.gunzipSync = function (buffer, opts) {
  return zlibBufferSync(new Gunzip(opts), buffer);
};

exports.inflateRaw = function (buffer, opts, callback) {
  if (typeof opts == 'function') {
    callback = opts;
    opts = {};
  }
  return zlibBuffer(new InflateRaw(opts), buffer, callback);
};

exports.inflateRawSync = function (buffer, opts) {
  return zlibBufferSync(new InflateRaw(opts), buffer);
};

function zlibBuffer(engine, buffer, callback) {
  var buffers = [],
    nread = 0;

  engine.on('error', onError);
  engine.on('end', onEnd);

  engine.end(buffer);
  flow();

  function flow() {
    for (var chunk; null !== (chunk = engine.read()); ) {
      buffers.push(chunk);
      nread += chunk.length;
    }
    engine.once('readable', flow);
  }

  function onError(err) {
    engine.removeListener('end', onEnd);
    engine.removeListener('readable', flow);
    callback(err);
  }

  function onEnd() {
    var buf,
      err = null;

    if (nread >= kMaxLength) err = new RangeError(kRangeErrorMessage);
    else buf = Buffer.concat(buffers, nread);

    buffers = [];
    engine.close();
    callback(err, buf);
  }
}

function zlibBufferSync(engine, buffer) {
  if (typeof buffer == 'string') buffer = Buffer.from(buffer);

  if (!Buffer.isBuffer(buffer)) throw new TypeError('Not a string or buffer');

  var flushFlag = engine._finishFlushFlag;

  return engine._processChunk(buffer, flushFlag);
}

function Deflate(opts) {
  if (!(this instanceof Deflate)) return new Deflate(opts);
  Zlib.call(this, opts, binding.DEFLATE);
}

function Inflate(opts) {
  if (!(this instanceof Inflate)) return new Inflate(opts);
  Zlib.call(this, opts, binding.INFLATE);
}

function Gzip(opts) {
  if (!(this instanceof Gzip)) return new Gzip(opts);
  Zlib.call(this, opts, binding.GZIP);
}

function Gunzip(opts) {
  if (!(this instanceof Gunzip)) return new Gunzip(opts);
  Zlib.call(this, opts, binding.GUNZIP);
}

function DeflateRaw(opts) {
  if (!(this instanceof DeflateRaw)) return new DeflateRaw(opts);
  Zlib.call(this, opts, binding.DEFLATERAW);
}

function InflateRaw(opts) {
  if (!(this instanceof InflateRaw)) return new InflateRaw(opts);
  Zlib.call(this, opts, binding.INFLATERAW);
}

function Unzip(opts) {
  if (!(this instanceof Unzip)) return new Unzip(opts);
  Zlib.call(this, opts, binding.UNZIP);
}

function isValidFlushFlag(flag) {
  return (
    flag === binding.Z_NO_FLUSH || flag === binding.Z_PARTIAL_FLUSH ||
    flag === binding.Z_SYNC_FLUSH || flag === binding.Z_FULL_FLUSH ||
    flag === binding.Z_FINISH || flag === binding.Z_BLOCK
  );
}

function Zlib(opts, mode) {
  var _this = this;

  this._opts = opts = opts || {};
  this._chunkSize = opts.chunkSize || exports.Z_DEFAULT_CHUNK;

  Transform.call(this, opts);

  if (opts.flush && !isValidFlushFlag(opts.flush)) throw new Error('Invalid flush flag: ' + opts.flush);

  if (opts.finishFlush && !isValidFlushFlag(opts.finishFlush))
    throw new Error('Invalid flush flag: ' + opts.finishFlush);

  this._flushFlag = opts.flush || binding.Z_NO_FLUSH;
  this._finishFlushFlag = opts.finishFlush !== void 0 ? opts.finishFlush : binding.Z_FINISH;

  if (opts.chunkSize && (opts.chunkSize < exports.Z_MIN_CHUNK || opts.chunkSize > exports.Z_MAX_CHUNK))
    throw new Error('Invalid chunk size: ' + opts.chunkSize);

  if (opts.windowBits && (opts.windowBits < exports.Z_MIN_WINDOWBITS || opts.windowBits > exports.Z_MAX_WINDOWBITS))
    throw new Error('Invalid windowBits: ' + opts.windowBits);

  if (opts.level && (opts.level < exports.Z_MIN_LEVEL || opts.level > exports.Z_MAX_LEVEL))
    throw new Error('Invalid compression level: ' + opts.level);

  if (opts.memLevel && (opts.memLevel < exports.Z_MIN_MEMLEVEL || opts.memLevel > exports.Z_MAX_MEMLEVEL))
    throw new Error('Invalid memLevel: ' + opts.memLevel);

  if (opts.strategy && opts.strategy != exports.Z_FILTERED &&
      opts.strategy != exports.Z_HUFFMAN_ONLY && opts.strategy != exports.Z_RLE &&
      opts.strategy != exports.Z_FIXED && opts.strategy != exports.Z_DEFAULT_STRATEGY)
    throw new Error('Invalid strategy: ' + opts.strategy);

  if (opts.dictionary && !Buffer.isBuffer(opts.dictionary))
    throw new Error('Invalid dictionary: it should be a Buffer instance');

  this._handle = new binding.Zlib(mode);

  var self = this;
  this._hadError = false;
  this._handle.onerror = function (message, errno) {
    _close(self);
    self._hadError = true;

    var error = new Error(message);
    error.errno = errno;
    error.code = exports.codes[errno];
    self.emit('error', error);
  };

  var level = exports.Z_DEFAULT_COMPRESSION;
  if (typeof opts.level == 'number') level = opts.level;

  var strategy = exports.Z_DEFAULT_STRATEGY;
  if (typeof opts.strategy == 'number') strategy = opts.strategy;

  this._handle.init(
    opts.windowBits || exports.Z_DEFAULT_WINDOWBITS,
    level,
    opts.memLevel || exports.Z_DEFAULT_MEMLEVEL,
    strategy,
    opts.dictionary
  );

  this._buffer = Buffer.allocUnsafe(this._chunkSize);
  this._offset = 0;
  this._level = level;
  this._strategy = strategy;

  this.once('end', this.close);

  Object.defineProperty(this, '_closed', {
    get: function () {
      return !_this._handle;
    },
    configurable: true,
    enumerable: true
  });
}

util.inherits(Zlib, Transform);

Zlib.prototype.params = function (level, strategy, callback) {
  if (level < exports.Z_MIN_LEVEL || level > exports.Z_MAX_LEVEL)
    throw new RangeError('Invalid compression level: ' + level);

  if (strategy != exports.Z_FILTERED && strategy != exports.Z_HUFFMAN_ONLY &&
      strategy != exports.Z_RLE && strategy != exports.Z_FIXED && strategy != exports.Z_DEFAULT_STRATEGY)
    throw new TypeError('Invalid strategy: ' + strategy);

  if (this._level !== level || this._strategy !== strategy) {
    var self = this;
    this.flush(binding.Z_SYNC_FLUSH, function () {
      assert(self._handle, 'zlib binding closed');
      self._handle.params(level, strategy);
      if (!self._hadError) {
        self._level = level;
        self._strategy = strategy;
        callback && callback();
      }
    });
  } else process.nextTick(callback);
};

Zlib.prototype.reset = function () {
  assert(this._handle, 'zlib binding closed');
  return this._handle.reset();
};

Zlib.prototype._flush = function (callback) {
  this._transform(Buffer.alloc(0), '', callback);
};

Zlib.prototype.flush = function (kind, callback) {
  var _this2 = this,
    ws = this._writableState;

  if (typeof kind == 'function' || (kind === void 0 && !callback)) {
    callback = kind;
    kind = binding.Z_FULL_FLUSH;
  }

  if (ws.ended) callback && process.nextTick(callback);
  else if (ws.ending) callback && this.once('end', callback);
  else if (ws.needDrain)
    callback &&
      this.once('drain', function () {
        return _this2.flush(kind, callback);
      });
  else {
    this._flushFlag = kind;
    this.write(Buffer.alloc(0), '', callback);
  }
};

Zlib.prototype.close = function (callback) {
  _close(this, callback);
  process.nextTick(emitCloseNT, this);
};

function _close(engine, callback) {
  callback && process.nextTick(callback);

  if (!engine._handle) return;

  engine._handle.close();
  engine._handle = null;
}

function emitCloseNT(self) {
  self.emit('close');
}

Zlib.prototype._transform = function (chunk, encoding, cb) {
  var flushFlag,
    ws = this._writableState,
    last = (ws.ending || ws.ended) && (!chunk || ws.length === chunk.length);

  if (chunk !== null && !Buffer.isBuffer(chunk)) return cb(new Error('invalid input'));

  if (!this._handle) return cb(new Error('zlib binding closed'));

  if (last) flushFlag = this._finishFlushFlag;
  else {
    flushFlag = this._flushFlag;
    if (chunk.length >= ws.length) this._flushFlag = this._opts.flush || binding.Z_NO_FLUSH;
  }

  this._processChunk(chunk, flushFlag, cb);
};

Zlib.prototype._processChunk = function (chunk, flushFlag, cb) {
  var availInBefore = chunk && chunk.length,
    availOutBefore = this._chunkSize - this._offset,
    inOff = 0,

    self = this,
    async = typeof cb == 'function';

  if (!async) {
    var error,
      buffers = [],
      nread = 0;

    this.on('error', function (er) {
      error = er;
    });

    assert(this._handle, 'zlib binding closed');
    do {
      var res = this._handle.writeSync(
        flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore
      );
    } while (!this._hadError && callback(res[0], res[1]));

    if (this._hadError) throw error;

    if (nread >= kMaxLength) {
      _close(this);
      throw new RangeError(kRangeErrorMessage);
    }

    var buf = Buffer.concat(buffers, nread);
    _close(this);

    return buf;
  }

  assert(this._handle, 'zlib binding closed');
  var req = this._handle.write(flushFlag, chunk, inOff, availInBefore, this._buffer, this._offset, availOutBefore);

  req.buffer = chunk;
  req.callback = callback;

  function callback(availInAfter, availOutAfter) {
    if (this) {
      this.buffer = null;
      this.callback = null;
    }

    if (self._hadError) return;

    var have = availOutBefore - availOutAfter;
    assert(have >= 0, 'have should not go down');

    if (have > 0) {
      var out = self._buffer.slice(self._offset, self._offset + have);
      self._offset += have;
      if (async) self.push(out);
      else {
        buffers.push(out);
        nread += out.length;
      }
    }

    if (availOutAfter === 0 || self._offset >= self._chunkSize) {
      availOutBefore = self._chunkSize;
      self._offset = 0;
      self._buffer = Buffer.allocUnsafe(self._chunkSize);
    }

    if (availOutAfter === 0) {
      inOff += availInBefore - availInAfter;
      availInBefore = availInAfter;

      if (!async) return true;

      var newReq = self._handle.write(
        flushFlag, chunk, inOff, availInBefore, self._buffer, self._offset, self._chunkSize
      );
      newReq.callback = callback;
      newReq.buffer = chunk;
      return;
    }

    if (!async) return false;

    cb();
  }
};

util.inherits(Deflate, Zlib);
util.inherits(Inflate, Zlib);
util.inherits(Gzip, Zlib);
util.inherits(Gunzip, Zlib);
util.inherits(DeflateRaw, Zlib);
util.inherits(InflateRaw, Zlib);
util.inherits(Unzip, Zlib);

},
// 6
function (module) {

module.exports = require('stream');

},
// 7
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(2),

  Zstream = __webpack_require__(8),
  zlib_deflate = __webpack_require__(9),
  zlib_inflate = __webpack_require__(12),
  constants = __webpack_require__(15);

for (var key in constants) exports[key] = constants[key];

exports.NONE = 0;
exports.DEFLATE = 1;
exports.INFLATE = 2;
exports.GZIP = 3;
exports.GUNZIP = 4;
exports.DEFLATERAW = 5;
exports.INFLATERAW = 6;
exports.UNZIP = 7;

var GZIP_HEADER_ID1 = 0x1f,
  GZIP_HEADER_ID2 = 0x8b;

function Zlib(mode) {
  if (typeof mode != 'number' || mode < exports.DEFLATE || mode > exports.UNZIP)
    throw new TypeError('Bad argument');

  this.dictionary = null;
  this.err = 0;
  this.flush = 0;
  this.init_done = false;
  this.level = 0;
  this.memLevel = 0;
  this.mode = mode;
  this.strategy = 0;
  this.windowBits = 0;
  this.write_in_progress = false;
  this.pending_close = false;
  this.gzip_id_bytes_read = 0;
}

Zlib.prototype.close = function () {
  if (this.write_in_progress) {
    this.pending_close = true;
    return;
  }

  this.pending_close = false;

  assert(this.init_done, 'close before init');
  assert(this.mode <= exports.UNZIP);

  this.mode === exports.DEFLATE || this.mode === exports.GZIP || this.mode === exports.DEFLATERAW
    ? zlib_deflate.deflateEnd(this.strm)
    : (this.mode !== exports.INFLATE && this.mode !== exports.GUNZIP &&
        this.mode !== exports.INFLATERAW && this.mode !== exports.UNZIP) ||
      zlib_inflate.inflateEnd(this.strm);

  this.mode = exports.NONE;

  this.dictionary = null;
};

Zlib.prototype.write = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(true, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype.writeSync = function (flush, input, in_off, in_len, out, out_off, out_len) {
  return this._write(false, flush, input, in_off, in_len, out, out_off, out_len);
};

Zlib.prototype._write = function (async, flush, input, in_off, in_len, out, out_off, out_len) {
  assert.equal(arguments.length, 8);

  assert(this.init_done, 'write before init');
  assert(this.mode !== exports.NONE, 'already finalized');
  assert.equal(false, this.write_in_progress, 'write already in progress');
  assert.equal(false, this.pending_close, 'close is pending');

  this.write_in_progress = true;

  assert.equal(false, flush === void 0, 'must provide flush value');

  this.write_in_progress = true;

  if (flush !== exports.Z_NO_FLUSH && flush !== exports.Z_PARTIAL_FLUSH &&
      flush !== exports.Z_SYNC_FLUSH && flush !== exports.Z_FULL_FLUSH &&
      flush !== exports.Z_FINISH && flush !== exports.Z_BLOCK)
    throw new Error('Invalid flush value');

  if (input == null) {
    input = Buffer.alloc(0);
    in_len = 0;
    in_off = 0;
  }

  this.strm.avail_in = in_len;
  this.strm.input = input;
  this.strm.next_in = in_off;
  this.strm.avail_out = out_len;
  this.strm.output = out;
  this.strm.next_out = out_off;
  this.flush = flush;

  if (!async) {
    this._process();

    return this._checkError() ? this._afterSync() : void 0;
  }

  var self = this;
  process.nextTick(function () {
    self._process();
    self._after();
  });

  return this;
};

Zlib.prototype._afterSync = function () {
  var avail_out = this.strm.avail_out,
    avail_in = this.strm.avail_in;

  this.write_in_progress = false;

  return [avail_in, avail_out];
};

Zlib.prototype._process = function () {
  var next_expected_header_byte = null;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflate(this.strm, this.flush);
      break;
    case exports.UNZIP:
      if (this.strm.avail_in > 0) next_expected_header_byte = this.strm.next_in;

      switch (this.gzip_id_bytes_read) {
        case 0:
          if (next_expected_header_byte === null) break;

          if (this.strm.input[next_expected_header_byte] !== GZIP_HEADER_ID1) {
            this.mode = exports.INFLATE;
            break;
          }
          this.gzip_id_bytes_read = 1;
          next_expected_header_byte++;

          if (this.strm.avail_in === 1) break;

        case 1:
          if (next_expected_header_byte === null) break;

          if (this.strm.input[next_expected_header_byte] === GZIP_HEADER_ID2) {
            this.gzip_id_bytes_read = 2;
            this.mode = exports.GUNZIP;
          } else this.mode = exports.INFLATE;

          break;
        default:
          throw new Error('invalid number of gzip magic number bytes read');
      }

    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
      this.err = zlib_inflate.inflate(this.strm, this.flush);
      if (this.err === exports.Z_NEED_DICT && this.dictionary) {
        this.err = zlib_inflate.inflateSetDictionary(this.strm, this.dictionary);
        this.err === exports.Z_OK
          ? (this.err = zlib_inflate.inflate(this.strm, this.flush))
          : this.err !== exports.Z_DATA_ERROR || (this.err = exports.Z_NEED_DICT);
      }
      while (this.strm.avail_in > 0 && this.mode === exports.GUNZIP &&
          this.err === exports.Z_STREAM_END && this.strm.next_in[0] !== 0x00) {
        this.reset();
        this.err = zlib_inflate.inflate(this.strm, this.flush);
      }
      break;
    default:
      throw new Error('Unknown mode ' + this.mode);
  }
};

Zlib.prototype._checkError = function () {
  switch (this.err) {
    case exports.Z_OK:
    case exports.Z_BUF_ERROR:
      if (this.strm.avail_out !== 0 && this.flush === exports.Z_FINISH) {
        this._error('unexpected end of file');
        return false;
      }
      break;
    case exports.Z_STREAM_END:
      break;
    case exports.Z_NEED_DICT:
      this.dictionary == null ? this._error('Missing dictionary') : this._error('Bad dictionary');

      return false;
    default:
      this._error('Zlib error');
      return false;
  }

  return true;
};

Zlib.prototype._after = function () {
  if (!this._checkError()) return;

  var avail_out = this.strm.avail_out,
    avail_in = this.strm.avail_in;

  this.write_in_progress = false;

  this.callback(avail_in, avail_out);

  this.pending_close && this.close();
};

Zlib.prototype._error = function (message) {
  if (this.strm.msg) message = this.strm.msg;

  this.onerror(message, this.err);
  this.write_in_progress = false;
  this.pending_close && this.close();
};

Zlib.prototype.init = function (windowBits, level, memLevel, strategy, dictionary) {
  assert(
    arguments.length === 4 || arguments.length === 5,
    'init(windowBits, level, memLevel, strategy, [dictionary])'
  );

  assert(windowBits >= 8 && windowBits <= 15, 'invalid windowBits');
  assert(level >= -1 && level <= 9, 'invalid compression level');

  assert(memLevel >= 1 && memLevel <= 9, 'invalid memlevel');

  assert(
    strategy === exports.Z_FILTERED || strategy === exports.Z_HUFFMAN_ONLY || strategy === exports.Z_RLE ||
      strategy === exports.Z_FIXED || strategy === exports.Z_DEFAULT_STRATEGY,
    'invalid strategy'
  );

  this._init(level, windowBits, memLevel, strategy, dictionary);
  this._setDictionary();
};

Zlib.prototype.params = function () {
  throw new Error('deflateParams Not supported');
};

Zlib.prototype.reset = function () {
  this._reset();
  this._setDictionary();
};

Zlib.prototype._init = function (level, windowBits, memLevel, strategy, dictionary) {
  this.level = level;
  this.windowBits = windowBits;
  this.memLevel = memLevel;
  this.strategy = strategy;

  this.flush = exports.Z_NO_FLUSH;

  this.err = exports.Z_OK;

  if (this.mode === exports.GZIP || this.mode === exports.GUNZIP) this.windowBits += 16;

  if (this.mode === exports.UNZIP) this.windowBits += 32;

  if (this.mode === exports.DEFLATERAW || this.mode === exports.INFLATERAW) this.windowBits = -1 * this.windowBits;

  this.strm = new Zstream();

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.GZIP:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateInit2(
        this.strm, this.level, exports.Z_DEFLATED, this.windowBits, this.memLevel, this.strategy
      );
      break;
    case exports.INFLATE:
    case exports.GUNZIP:
    case exports.INFLATERAW:
    case exports.UNZIP:
      this.err = zlib_inflate.inflateInit2(this.strm, this.windowBits);
      break;
    default:
      throw new Error('Unknown mode ' + this.mode);
  }

  this.err === exports.Z_OK || this._error('Init error');

  this.dictionary = dictionary;

  this.write_in_progress = false;
  this.init_done = true;
};

Zlib.prototype._setDictionary = function () {
  if (this.dictionary == null) return;

  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
      this.err = zlib_deflate.deflateSetDictionary(this.strm, this.dictionary);
      break;
  }

  this.err === exports.Z_OK || this._error('Failed to set dictionary');
};

Zlib.prototype._reset = function () {
  this.err = exports.Z_OK;

  switch (this.mode) {
    case exports.DEFLATE:
    case exports.DEFLATERAW:
    case exports.GZIP:
      this.err = zlib_deflate.deflateReset(this.strm);
      break;
    case exports.INFLATE:
    case exports.INFLATERAW:
    case exports.GUNZIP:
      this.err = zlib_inflate.inflateReset(this.strm);
      break;
  }

  this.err === exports.Z_OK || this._error('Failed to reset stream');
};

exports.Zlib = Zlib;

},
// 8
function (module) {

function ZStream() {
  this.input = null;
  this.next_in = 0;
  this.avail_in = 0;
  this.total_in = 0;
  this.output = null;
  this.next_out = 0;
  this.avail_out = 0;
  this.total_out = 0;
  this.msg = '';
  this.state = null;
  this.data_type = 2;
  this.adler = 0;
}

module.exports = ZStream;

},
// 9
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(0),
  trees = __webpack_require__(10),
  adler32 = __webpack_require__(3),
  crc32 = __webpack_require__(4),
  msg = __webpack_require__(11);

var Z_NO_FLUSH = 0,
  Z_PARTIAL_FLUSH = 1,
  Z_FULL_FLUSH = 3,
  Z_FINISH = 4,
  Z_BLOCK = 5,

  Z_OK = 0,
  Z_STREAM_END = 1,
  Z_STREAM_ERROR = -2,
  Z_DATA_ERROR = -3,
  Z_BUF_ERROR = -5,

  Z_DEFAULT_COMPRESSION = -1,

  Z_FILTERED = 1,
  Z_HUFFMAN_ONLY = 2,
  Z_RLE = 3,
  Z_FIXED = 4,
  Z_DEFAULT_STRATEGY = 0,

  Z_UNKNOWN = 2,

  Z_DEFLATED = 8;

var MAX_MEM_LEVEL = 9,
  MAX_WBITS = 15,
  DEF_MEM_LEVEL = 8,

  L_CODES = 286,
  D_CODES = 30,
  BL_CODES = 19,
  HEAP_SIZE = 2 * L_CODES + 1,
  MAX_BITS = 15,

  MIN_MATCH = 3,
  MAX_MATCH = 258,
  MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1,

  PRESET_DICT = 0x20,

  INIT_STATE = 42,
  EXTRA_STATE = 69,
  NAME_STATE = 73,
  COMMENT_STATE = 91,
  HCRC_STATE = 103,
  BUSY_STATE = 113,
  FINISH_STATE = 666,

  BS_NEED_MORE = 1,
  BS_BLOCK_DONE = 2,
  BS_FINISH_STARTED = 3,
  BS_FINISH_DONE = 4,

  OS_CODE = 0x03;

function err(strm, errorCode) {
  strm.msg = msg[errorCode];
  return errorCode;
}

function rank(f) {
  return (f << 1) - (f > 4 ? 9 : 0);
}

function zero(buf) {
  for (var len = buf.length; --len >= 0; ) buf[len] = 0;
}

function flush_pending(strm) {
  var s = strm.state,

    len = s.pending;
  if (len > strm.avail_out) len = strm.avail_out;

  if (len === 0) return;

  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
  strm.next_out += len;
  s.pending_out += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending -= len;
  if (s.pending === 0) s.pending_out = 0;
}

function flush_block_only(s, last) {
  trees._tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
}

function put_byte(s, b) {
  s.pending_buf[s.pending++] = b;
}

function putShortMSB(s, b) {
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
}

function read_buf(strm, buf, start, size) {
  var len = strm.avail_in;

  if (len > size) len = size;
  if (len === 0) return 0;

  strm.avail_in -= len;

  utils.arraySet(buf, strm.input, strm.next_in, len, start);
  strm.state.wrap === 1
    ? (strm.adler = adler32(strm.adler, buf, len, start))
    : strm.state.wrap !== 2 || (strm.adler = crc32(strm.adler, buf, len, start));

  strm.next_in += len;
  strm.total_in += len;

  return len;
}

function longest_match(s, cur_match) {
  var match,
    len,
    chain_length = s.max_chain_length,
    scan = s.strstart,
    best_len = s.prev_length,
    nice_match = s.nice_match,
    limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0,

    _win = s.window,

    wmask = s.w_mask,
    prev = s.prev,

    strend = s.strstart + MAX_MATCH,
    scan_end1 = _win[scan + best_len - 1],
    scan_end = _win[scan + best_len];

  if (s.prev_length >= s.good_match) chain_length >>= 2;

  if (nice_match > s.lookahead) nice_match = s.lookahead;

  do {
    if (_win[(match = cur_match) + best_len] !== scan_end ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match] !== _win[scan] ||
        _win[++match] !== _win[scan + 1])
      continue;

    scan += 2;
    match++;

    do {} while (
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
      scan < strend
    );

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) break;

      scan_end1 = _win[scan + best_len - 1];
      scan_end = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length != 0);

  return best_len <= s.lookahead ? best_len : s.lookahead;
}

function fill_window(s) {
  var p, n, m, more, str;
  var _w_size = s.w_size;

  do {
    more = s.window_size - s.lookahead - s.strstart;

    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      s.block_start -= _w_size;

      p = n = s.hash_size;
      do {
        m = s.head[--p];
        s.head[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);

      p = n = _w_size;
      do {
        m = s.prev[--p];
        s.prev[p] = m >= _w_size ? m - _w_size : 0;
      } while (--n);

      more += _w_size;
    }
    if (s.strm.avail_in === 0) break;

    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
      while (s.insert) {
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) break;
      }
    }
  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
}

function deflate_stored(s, flush) {
  var max_block_size = 0xffff;

  if (max_block_size > s.pending_buf_size - 5) max_block_size = s.pending_buf_size - 5;

  for (;;) {
    if (s.lookahead <= 1) {
      fill_window(s);
      if (s.lookahead === 0 && flush === Z_NO_FLUSH) return BS_NEED_MORE;

      if (s.lookahead === 0) break;
    }

    s.strstart += s.lookahead;
    s.lookahead = 0;

    var max_start = s.block_start + max_block_size;

    if (s.strstart === 0 || s.strstart >= max_start) {
      s.lookahead = s.strstart - max_start;
      s.strstart = max_start;
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
    if (s.strstart - s.block_start >= s.w_size - MIN_LOOKAHEAD) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
  }

  s.insert = 0;

  if (flush === Z_FINISH) {
    flush_block_only(s, true);

    return s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE;
  }

  if (s.strstart > s.block_start) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) return BS_NEED_MORE;
  }

  return BS_NEED_MORE;
}

function deflate_fast(s, flush) {
  for (var hash_head, bflush; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;

      if (s.lookahead === 0) break;
    }

    hash_head = 0;
    if (s.lookahead >= MIN_MATCH) {
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }

    if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD)
      s.match_length = longest_match(s, hash_head);

    if (s.match_length >= MIN_MATCH) {
      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
        s.match_length--;
        do {
          s.strstart++;
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        } while (--s.match_length != 0);
        s.strstart++;
      } else {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;
      }
    } else {
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);

    return s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) return BS_NEED_MORE;
  }
  return BS_BLOCK_DONE;
}

function deflate_slow(s, flush) {
  for (var hash_head, bflush, max_insert; ; ) {
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) return BS_NEED_MORE;

      if (s.lookahead === 0) break;
    }

    hash_head = 0;
    if (s.lookahead >= MIN_MATCH) {
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
    }

    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
      s.match_length = longest_match(s, hash_head);

      if (s.match_length <= 5 &&
          (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)))
        s.match_length = MIN_MATCH - 1;
    }
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;

      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
        }
      } while (--s.prev_length != 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) return BS_NEED_MORE;
      }
    } else if (s.match_available) {
      (bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1])) && flush_block_only(s, false);

      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    } else {
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  if (s.match_available) {
    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);

    return s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) return BS_NEED_MORE;
  }

  return BS_BLOCK_DONE;
}

function deflate_rle(s, flush) {
  for (var bflush, prev, scan, strend, _win = s.window; ; ) {
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) return BS_NEED_MORE;

      if (s.lookahead === 0) break;
    }

    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0 &&
        (prev = _win[(scan = s.strstart - 1)]) === _win[++scan] &&
        prev === _win[++scan] && prev === _win[++scan]) {
      strend = s.strstart + MAX_MATCH;
      do {} while (
        prev === _win[++scan] && prev === _win[++scan] &&
        prev === _win[++scan] && prev === _win[++scan] &&
        prev === _win[++scan] && prev === _win[++scan] &&
        prev === _win[++scan] && prev === _win[++scan] &&
        scan < strend
      );
      s.match_length = MAX_MATCH - (strend - scan);
      if (s.match_length > s.lookahead) s.match_length = s.lookahead;
    }

    if (s.match_length >= MIN_MATCH) {
      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);

    return s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) return BS_NEED_MORE;
  }
  return BS_BLOCK_DONE;
}

function deflate_huff(s, flush) {
  for (var bflush; ; ) {
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) return BS_NEED_MORE;

        break;
      }
    }

    s.match_length = 0;
    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) return BS_NEED_MORE;
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    flush_block_only(s, true);

    return s.strm.avail_out === 0 ? BS_FINISH_STARTED : BS_FINISH_DONE;
  }
  if (s.last_lit) {
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) return BS_NEED_MORE;
  }
  return BS_BLOCK_DONE;
}

function Config(good_length, max_lazy, nice_length, max_chain, func) {
  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

var configuration_table = [
  new Config(0, 0, 0, 0, deflate_stored),
  new Config(4, 4, 8, 4, deflate_fast),
  new Config(4, 5, 16, 8, deflate_fast),
  new Config(4, 6, 32, 32, deflate_fast),

  new Config(4, 4, 16, 16, deflate_slow),
  new Config(8, 16, 32, 32, deflate_slow),
  new Config(8, 16, 128, 128, deflate_slow),
  new Config(8, 32, 128, 256, deflate_slow),
  new Config(32, 128, 258, 1024, deflate_slow),
  new Config(32, 258, 258, 4096, deflate_slow)
];

function lm_init(s) {
  s.window_size = 2 * s.w_size;

  zero(s.head);

  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
}

function DeflateState() {
  this.strm = null;
  this.status = 0;
  this.pending_buf = null;
  this.pending_buf_size = 0;
  this.pending_out = 0;
  this.pending = 0;
  this.wrap = 0;
  this.gzhead = null;
  this.gzindex = 0;
  this.method = Z_DEFLATED;
  this.last_flush = -1;

  this.w_size = 0;
  this.w_bits = 0;
  this.w_mask = 0;

  this.window = null;

  this.window_size = 0;

  this.prev = null;

  this.head = null;

  this.ins_h = 0;
  this.hash_size = 0;
  this.hash_bits = 0;
  this.hash_mask = 0;

  this.hash_shift = 0;

  this.block_start = 0;

  this.match_length = 0;
  this.prev_match = 0;
  this.match_available = 0;
  this.strstart = 0;
  this.match_start = 0;
  this.lookahead = 0;

  this.prev_length = 0;

  this.max_chain_length = 0;

  this.max_lazy_match = 0;

  this.level = 0;
  this.strategy = 0;

  this.good_match = 0;

  this.nice_match = 0;

  this.dyn_ltree = new utils.Buf16(HEAP_SIZE * 2);
  this.dyn_dtree = new utils.Buf16(2 * (2 * D_CODES + 1));
  this.bl_tree = new utils.Buf16(2 * (2 * BL_CODES + 1));
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc = null;
  this.d_desc = null;
  this.bl_desc = null;

  this.bl_count = new utils.Buf16(MAX_BITS + 1);

  this.heap = new utils.Buf16(2 * L_CODES + 1);
  zero(this.heap);

  this.heap_len = 0;
  this.heap_max = 0;

  this.depth = new utils.Buf16(2 * L_CODES + 1);
  zero(this.depth);

  this.l_buf = 0;

  this.lit_bufsize = 0;

  this.last_lit = 0;

  this.d_buf = 0;

  this.opt_len = 0;
  this.static_len = 0;
  this.matches = 0;
  this.insert = 0;

  this.bi_buf = 0;
  this.bi_valid = 0;
}

function deflateResetKeep(strm) {
  var s;

  if (!strm || !strm.state) return err(strm, Z_STREAM_ERROR);

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  (s = strm.state).pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) s.wrap = -s.wrap;

  s.status = s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = s.wrap === 2 ? 0 : 1;
  s.last_flush = Z_NO_FLUSH;
  trees._tr_init(s);
  return Z_OK;
}

function deflateReset(strm) {
  var ret = deflateResetKeep(strm);
  ret !== Z_OK || lm_init(strm.state);

  return ret;
}

function deflateSetHeader(strm, head) {
  if (!strm || !strm.state) return Z_STREAM_ERROR;
  if (strm.state.wrap !== 2) return Z_STREAM_ERROR;
  strm.state.gzhead = head;
  return Z_OK;
}

function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
  if (!strm) return Z_STREAM_ERROR;

  var wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) level = 6;

  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else if (windowBits > 15) {
    wrap = 2;
    windowBits -= 16;
  }

  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
      windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED)
    return err(strm, Z_STREAM_ERROR);

  if (windowBits === 8) windowBits = 9;

  var s = new DeflateState();

  strm.state = s;
  s.strm = strm;

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new utils.Buf8(s.w_size * 2);
  s.head = new utils.Buf16(s.hash_size);
  s.prev = new utils.Buf16(s.w_size);

  s.lit_bufsize = 1 << (memLevel + 6);

  s.pending_buf_size = s.lit_bufsize * 4;

  s.pending_buf = new utils.Buf8(s.pending_buf_size);

  s.d_buf = 1 * s.lit_bufsize;

  s.l_buf = 3 * s.lit_bufsize;

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
}

function deflateInit(strm, level) {
  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
}

function deflate(strm, flush) {
  var old_flush, s, beg, val;

  if (!strm || !strm.state || flush > Z_BLOCK || flush < 0)
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;

  s = strm.state;

  if (!strm.output || (!strm.input && strm.avail_in !== 0) || (s.status === FINISH_STATE && flush !== Z_FINISH))
    return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR : Z_STREAM_ERROR);

  s.strm = strm;
  old_flush = s.last_flush;
  s.last_flush = flush;

  if (s.status === INIT_STATE)
    if (s.wrap === 2) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
      } else {
        put_byte(s, (s.gzhead.text ? 1 : 0) +
          (s.gzhead.hcrc ? 2 : 0) +
          (!s.gzhead.extra ? 0 : 4) +
          (!s.gzhead.name ? 0 : 8) +
          (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 0xff);
        put_byte(s, (s.gzhead.time >> 8) & 0xff);
        put_byte(s, (s.gzhead.time >> 16) & 0xff);
        put_byte(s, (s.gzhead.time >> 24) & 0xff);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 0xff);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 0xff);
          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
        }
        if (s.gzhead.hcrc) strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);

        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    } else {
      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;

      header |= (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 0 : s.level < 6 ? 1 : s.level === 6 ? 2 : 3) << 6;

      if (s.strstart !== 0) header |= PRESET_DICT;
      header += 31 - (header % 31);

      s.status = BUSY_STATE;
      putShortMSB(s, header);

      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 0xffff);
      }
      strm.adler = 1;
    }

  if (s.status === EXTRA_STATE)
    if (s.gzhead.extra) {
      beg = s.pending;

      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) break;
        }
        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
        s.gzindex++;
      }
      if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

      if (s.gzindex === s.gzhead.extra.length) {
        s.gzindex = 0;
        s.status = NAME_STATE;
      }
    } else s.status = NAME_STATE;

  if (s.status === NAME_STATE)
    if (s.gzhead.name) {
      beg = s.pending;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        val = s.gzindex < s.gzhead.name.length ? s.gzhead.name.charCodeAt(s.gzindex++) & 0xff : 0;

        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

      if (val === 0) {
        s.gzindex = 0;
        s.status = COMMENT_STATE;
      }
    } else s.status = COMMENT_STATE;

  if (s.status === COMMENT_STATE)
    if (s.gzhead.comment) {
      beg = s.pending;

      do {
        if (s.pending === s.pending_buf_size) {
          if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

          flush_pending(strm);
          beg = s.pending;
          if (s.pending === s.pending_buf_size) {
            val = 1;
            break;
          }
        }
        val = s.gzindex < s.gzhead.comment.length ? s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff : 0;

        put_byte(s, val);
      } while (val !== 0);

      if (s.gzhead.hcrc && s.pending > beg) strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);

      if (val === 0) s.status = HCRC_STATE;
    } else s.status = HCRC_STATE;

  if (s.status === HCRC_STATE)
    if (s.gzhead.hcrc) {
      s.pending + 2 > s.pending_buf_size && flush_pending(strm);

      if (s.pending + 2 <= s.pending_buf_size) {
        put_byte(s, strm.adler & 0xff);
        put_byte(s, (strm.adler >> 8) & 0xff);
        strm.adler = 0;
        s.status = BUSY_STATE;
      }
    } else s.status = BUSY_STATE;

  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      s.last_flush = -1;
      return Z_OK;
    }
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH)
    return err(strm, Z_BUF_ERROR);

  if (s.status === FINISH_STATE && strm.avail_in !== 0) return err(strm, Z_BUF_ERROR);

  if (strm.avail_in !== 0 || s.lookahead !== 0 || (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    var bstate = s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush)
      : s.strategy === Z_RLE ? deflate_rle(s, flush)
      : configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) s.status = FINISH_STATE;

    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) s.last_flush = -1;

      return Z_OK;
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) trees._tr_align(s);
      else if (flush !== Z_BLOCK) {
        trees._tr_stored_block(s, 0, 0, false);
        if (flush === Z_FULL_FLUSH) {
          zero(s.head);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK;
      }
    }
  }

  if (flush !== Z_FINISH) return Z_OK;
  if (s.wrap <= 0) return Z_STREAM_END;

  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  } else {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  if (s.wrap > 0) s.wrap = -s.wrap;
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
}

function deflateEnd(strm) {
  var status;

  if (!strm || !strm.state) return Z_STREAM_ERROR;

  if (
    (status = strm.state.status) !== INIT_STATE &&
    status !== EXTRA_STATE &&
    status !== NAME_STATE &&
    status !== COMMENT_STATE &&
    status !== HCRC_STATE &&
    status !== BUSY_STATE &&
    status !== FINISH_STATE
  )
    return err(strm, Z_STREAM_ERROR);

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
}

function deflateSetDictionary(strm, dictionary) {
  var s, str, n, wrap, avail, next, input, tmpDict;

  var dictLength = dictionary.length;

  if (!strm || !strm.state) return Z_STREAM_ERROR;

  if ((wrap = (s = strm.state).wrap) === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead)
    return Z_STREAM_ERROR;

  if (wrap === 1) strm.adler = adler32(strm.adler, dictionary, dictLength, 0);

  s.wrap = 0;

  if (dictLength >= s.w_size) {
    if (wrap === 0) {
      zero(s.head);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    tmpDict = new utils.Buf8(s.w_size);
    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  avail = strm.avail_in;
  next = strm.next_in;
  input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    str = s.strstart;
    n = s.lookahead - (MIN_MATCH - 1);
    do {
      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
}

exports.deflateInit = deflateInit;
exports.deflateInit2 = deflateInit2;
exports.deflateReset = deflateReset;
exports.deflateResetKeep = deflateResetKeep;
exports.deflateSetHeader = deflateSetHeader;
exports.deflate = deflate;
exports.deflateEnd = deflateEnd;
exports.deflateSetDictionary = deflateSetDictionary;
exports.deflateInfo = 'pako deflate (from Nodeca project)';

},
// 10
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var Z_FIXED = 4,

  Z_BINARY = 0,
  Z_TEXT = 1,
  Z_UNKNOWN = 2;

function zero(buf) {
  for (var len = buf.length; --len >= 0; ) buf[len] = 0;
}

var STORED_BLOCK = 0,
  STATIC_TREES = 1,
  DYN_TREES = 2,

  MIN_MATCH = 3,
  MAX_MATCH = 258,

  LENGTH_CODES = 29,

  LITERALS = 256,

  L_CODES = LITERALS + 1 + LENGTH_CODES,

  D_CODES = 30,
  BL_CODES = 19,

  HEAP_SIZE = 2 * L_CODES + 1,

  MAX_BITS = 15,

  Buf_size = 16,

  MAX_BL_BITS = 7,

  END_BLOCK = 256,

  REP_3_6 = 16,
  REPZ_3_10 = 17,
  REPZ_11_138 = 18;

var extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
  extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
  extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],

  bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],

  DIST_CODE_LEN = 512;

var static_ltree = new Array((L_CODES + 2) * 2);
zero(static_ltree);

var static_dtree = new Array(D_CODES * 2);
zero(static_dtree);

var _dist_code = new Array(DIST_CODE_LEN);
zero(_dist_code);

var _length_code = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);

var base_length = new Array(LENGTH_CODES);
zero(base_length);

var base_dist = new Array(D_CODES);
zero(base_dist);

function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
  this.static_tree = static_tree;
  this.extra_bits = extra_bits;
  this.extra_base = extra_base;
  this.elems = elems;
  this.max_length = max_length;

  this.has_stree = static_tree && static_tree.length;
}

var static_l_desc, static_d_desc, static_bl_desc;

function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;
  this.max_code = 0;
  this.stat_desc = stat_desc;
}

function d_code(dist) {
  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
}

function put_short(s, w) {
  s.pending_buf[s.pending++] = w & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
}

function send_bits(s, value, length) {
  if (s.bi_valid > Buf_size - length) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
}

function send_code(s, c, tree) {
  send_bits(s, tree[c * 2], tree[c * 2 + 1]);
}

function bi_reverse(code, len) {
  var res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
}

function bi_flush(s) {
  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;
  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
}

function gen_bitlen(s, desc) {
  var h, n, m, bits, xbits, f;
  var tree = desc.dyn_tree,
    max_code = desc.max_code,
    stree = desc.stat_desc.static_tree,
    has_stree = desc.stat_desc.has_stree,
    extra = desc.stat_desc.extra_bits,
    base = desc.stat_desc.extra_base,
    max_length = desc.stat_desc.max_length,
    overflow = 0;

  for (bits = 0; bits <= MAX_BITS; bits++) s.bl_count[bits] = 0;

  tree[s.heap[s.heap_max] * 2 + 1] = 0;

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    if ((bits = tree[tree[(n = s.heap[h]) * 2 + 1] * 2 + 1] + 1) > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1] = bits;

    if (n > max_code) continue;

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) xbits = extra[n - base];

    f = tree[n * 2];
    s.opt_len += f * (bits + xbits);
    if (has_stree) s.static_len += f * (stree[n * 2 + 1] + xbits);
  }
  if (overflow === 0) return;

  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) bits--;
    s.bl_count[bits]--;
    s.bl_count[bits + 1] += 2;
    s.bl_count[max_length]--;
    overflow -= 2;
  } while (overflow > 0);

  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      if ((m = s.heap[--h]) > max_code) continue;
      if (tree[m * 2 + 1] !== bits) {
        s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
        tree[m * 2 + 1] = bits;
      }
      n--;
    }
  }
}

function gen_codes(tree, max_code, bl_count) {
  var bits, n,
    next_code = new Array(MAX_BITS + 1),
    code = 0;

  for (bits = 1; bits <= MAX_BITS; bits++) next_code[bits] = code = (code + bl_count[bits - 1]) << 1;

  for (n = 0; n <= max_code; n++) {
    var len = tree[n * 2 + 1];
    if (len !== 0) tree[n * 2] = bi_reverse(next_code[len]++, len);
  }
}

function tr_static_init() {
  var n, bits, length, code, dist;
  var bl_count = new Array(MAX_BITS + 1);

  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < 1 << extra_lbits[code]; n++) _length_code[length++] = code;
  }
  _length_code[length - 1] = code;

  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < 1 << extra_dbits[code]; n++) _dist_code[dist++] = code;
  }
  dist >>= 7;
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < 1 << (extra_dbits[code] - 7); n++) _dist_code[256 + dist++] = code;
  }

  for (bits = 0; bits <= MAX_BITS; bits++) bl_count[bits] = 0;

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1] = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1] = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1] = 8;
    n++;
    bl_count[8]++;
  }
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1] = 5;
    static_dtree[n * 2] = bi_reverse(n, 5);
  }

  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES, MAX_BL_BITS);
}

function init_block(s) {
  var n;

  for (n = 0; n < L_CODES; n++) s.dyn_ltree[n * 2] = 0;
  for (n = 0; n < D_CODES; n++) s.dyn_dtree[n * 2] = 0;
  for (n = 0; n < BL_CODES; n++) s.bl_tree[n * 2] = 0;

  s.dyn_ltree[END_BLOCK * 2] = 1;
  s.opt_len = s.static_len = 0;
  s.last_lit = s.matches = 0;
}

function bi_windup(s) {
  s.bi_valid > 8 ? put_short(s, s.bi_buf)
    : s.bi_valid > 0 && (s.pending_buf[s.pending++] = s.bi_buf);

  s.bi_buf = 0;
  s.bi_valid = 0;
}

function copy_block(s, buf, len, header) {
  bi_windup(s);

  if (header) {
    put_short(s, len);
    put_short(s, ~len);
  }
  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
  s.pending += len;
}

function smaller(tree, n, m, depth) {
  var _n2 = n * 2,
    _m2 = m * 2;
  return tree[_n2] < tree[_m2] || (tree[_n2] === tree[_m2] && depth[n] <= depth[m]);
}

function pqdownheap(s, tree, k) {
  var v = s.heap[k];
  for (var j = k << 1; j <= s.heap_len; ) {
    j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth) && j++;

    if (smaller(tree, v, s.heap[j], s.depth)) break;

    s.heap[k] = s.heap[j];
    k = j;

    j <<= 1;
  }
  s.heap[k] = v;
}

function compress_block(s, ltree, dtree) {
  var dist, lc, code, extra;
  var lx = 0;

  if (s.last_lit !== 0)
    do {
      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | s.pending_buf[s.d_buf + lx * 2 + 1];
      lc = s.pending_buf[s.l_buf + lx];
      lx++;

      if (dist === 0) send_code(s, lc, ltree);
      else {
        send_code(s, (code = _length_code[lc]) + LITERALS + 1, ltree);
        (extra = extra_lbits[code]) === 0 || send_bits(s, (lc -= base_length[code]), extra);

        send_code(s, (code = d_code(--dist)), dtree);
        (extra = extra_dbits[code]) === 0 || send_bits(s, (dist -= base_dist[code]), extra);
      }
    } while (lx < s.last_lit);

  send_code(s, END_BLOCK, ltree);
}

function build_tree(s, desc) {
  var n, m, node,
    tree = desc.dyn_tree,
    stree = desc.stat_desc.static_tree,
    has_stree = desc.stat_desc.has_stree,
    elems = desc.stat_desc.elems,
    max_code = -1;

  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++)
    if (tree[n * 2] !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;
    } else tree[n * 2 + 1] = 0;

  while (s.heap_len < 2) {
    tree[2 * (node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0)] = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) s.static_len -= stree[node * 2 + 1];
  }
  desc.max_code = max_code;

  for (n = s.heap_len >> 1; n >= 1; n--) pqdownheap(s, tree, n);

  node = elems;
  do {
    n = s.heap[1];
    s.heap[1] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1);

    m = s.heap[1];

    s.heap[--s.heap_max] = n;
    s.heap[--s.heap_max] = m;

    tree[node * 2] = tree[n * 2] + tree[m * 2];
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1] = tree[m * 2 + 1] = node;

    s.heap[1] = node++;
    pqdownheap(s, tree, 1);
  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1];

  gen_bitlen(s, desc);

  gen_codes(tree, max_code, s.bl_count);
}

function scan_tree(s, tree, max_code) {
  var n, curlen,
    prevlen = -1,

    nextlen = tree[1],

    count = 0,
    max_count = 7,
    min_count = 4;

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1] = 0xffff;

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];

    if (++count < max_count && curlen === nextlen) continue;
    if (count < min_count) s.bl_tree[curlen * 2] += count;
    else if (curlen !== 0) {
      curlen === prevlen || s.bl_tree[curlen * 2]++;
      s.bl_tree[REP_3_6 * 2]++;
    } else count <= 10 ? s.bl_tree[REPZ_3_10 * 2]++ : s.bl_tree[REPZ_11_138 * 2]++;

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}

function send_tree(s, tree, max_code) {
  var n, curlen,
    prevlen = -1,

    nextlen = tree[1],

    count = 0,
    max_count = 7,
    min_count = 4;

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1];

    if (++count < max_count && curlen === nextlen) continue;
    if (count < min_count)
      do {
        send_code(s, curlen, s.bl_tree);
      } while (--count != 0);
    else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);
    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);
    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;
    } else {
      max_count = 7;
      min_count = 4;
    }
  }
}

function build_bl_tree(s) {
  var max_blindex;

  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  build_tree(s, s.bl_desc);

  for (max_blindex = BL_CODES - 1;
    max_blindex >= 3 && s.bl_tree[bl_order[max_blindex] * 2 + 1] === 0; max_blindex--);

  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;

  return max_blindex;
}

function send_all_trees(s, lcodes, dcodes, blcodes) {
  var rank;

  send_bits(s, lcodes - 257, 5);
  send_bits(s, dcodes - 1, 5);
  send_bits(s, blcodes - 4, 4);
  for (rank = 0; rank < blcodes; rank++) send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1], 3);

  send_tree(s, s.dyn_ltree, lcodes - 1);

  send_tree(s, s.dyn_dtree, dcodes - 1);
}

function detect_data_type(s) {
  var n,
    black_mask = 0xf3ffc07f;

  for (n = 0; n <= 31; n++, black_mask >>>= 1)
    if (black_mask & 1 && s.dyn_ltree[n * 2] !== 0) return Z_BINARY;

  if (s.dyn_ltree[18] !== 0 || s.dyn_ltree[20] !== 0 || s.dyn_ltree[26] !== 0) return Z_TEXT;

  for (n = 32; n < LITERALS; n++) if (s.dyn_ltree[n * 2] !== 0) return Z_TEXT;

  return Z_BINARY;
}

var static_init_done = false;

function _tr_init(s) {
  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  init_block(s);
}

function _tr_stored_block(s, buf, stored_len, last) {
  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
  copy_block(s, buf, stored_len, true);
}

function _tr_align(s) {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
}

function _tr_flush_block(s, buf, stored_len, last) {
  var opt_lenb, static_lenb,
    max_blindex = 0;

  if (s.level > 0) {
    if (s.strm.data_type === Z_UNKNOWN) s.strm.data_type = detect_data_type(s);

    build_tree(s, s.l_desc);

    build_tree(s, s.d_desc);

    max_blindex = build_bl_tree(s);

    opt_lenb = (s.opt_len + 3 + 7) >>> 3;

    if ((static_lenb = (s.static_len + 3 + 7) >>> 3) <= opt_lenb) opt_lenb = static_lenb;
  } else opt_lenb = static_lenb = stored_len + 5;

  if (stored_len + 4 <= opt_lenb && buf !== -1) _tr_stored_block(s, buf, stored_len, last);
  else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);
  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  init_block(s);

  last && bi_windup(s);
}

function _tr_tally(s, dist, lc) {
  s.pending_buf[s.d_buf + s.last_lit * 2] = (dist >>> 8) & 0xff;
  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;

  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
  s.last_lit++;

  if (dist === 0) s.dyn_ltree[lc * 2]++;
  else {
    s.matches++;
    dist--;

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]++;
    s.dyn_dtree[d_code(dist) * 2]++;
  }

  return s.last_lit === s.lit_bufsize - 1;
}

exports._tr_init = _tr_init;
exports._tr_stored_block = _tr_stored_block;
exports._tr_flush_block = _tr_flush_block;
exports._tr_tally = _tr_tally;
exports._tr_align = _tr_align;

},
// 11
function (module) {

module.exports = {
  2: 'need dictionary',
  1: 'stream end',
  0: '',
  '-1': 'file error',
  '-2': 'stream error',
  '-3': 'data error',
  '-4': 'insufficient memory',
  '-5': 'buffer error',
  '-6': 'incompatible version'
};

},
// 12
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(0),
  adler32 = __webpack_require__(3),
  crc32 = __webpack_require__(4),
  inflate_fast = __webpack_require__(13),
  inflate_table = __webpack_require__(14);

var CODES = 0,
  LENS = 1,
  DISTS = 2,

  Z_FINISH = 4,
  Z_BLOCK = 5,
  Z_TREES = 6,

  Z_OK = 0,
  Z_STREAM_END = 1,
  Z_NEED_DICT = 2,
  Z_STREAM_ERROR = -2,
  Z_DATA_ERROR = -3,
  Z_MEM_ERROR = -4,
  Z_BUF_ERROR = -5,

  Z_DEFLATED = 8,

  HEAD = 1,
  FLAGS = 2,
  TIME = 3,
  OS = 4,
  EXLEN = 5,
  EXTRA = 6,
  NAME = 7,
  COMMENT = 8,
  HCRC = 9,
  DICTID = 10,
  DICT = 11,
  TYPE = 12,
  TYPEDO = 13,
  STORED = 14,
  COPY_ = 15,
  COPY = 16,
  TABLE = 17,
  LENLENS = 18,
  CODELENS = 19,
  LEN_ = 20,
  LEN = 21,
  LENEXT = 22,
  DIST = 23,
  DISTEXT = 24,
  MATCH = 25,
  LIT = 26,
  CHECK = 27,
  LENGTH = 28,
  DONE = 29,
  BAD = 30,
  MEM = 31,
  SYNC = 32,

  ENOUGH_LENS = 852,
  ENOUGH_DISTS = 592,

  DEF_WBITS = 15;

function zswap32(q) {
  return ((q >>> 24) & 0xff) + ((q >>> 8) & 0xff00) + ((q & 0xff00) << 8) + ((q & 0xff) << 24);
}

function InflateState() {
  this.mode = 0;
  this.last = false;
  this.wrap = 0;
  this.havedict = false;
  this.flags = 0;
  this.dmax = 0;
  this.check = 0;
  this.total = 0;
  this.head = null;

  this.wbits = 0;
  this.wsize = 0;
  this.whave = 0;
  this.wnext = 0;
  this.window = null;

  this.hold = 0;
  this.bits = 0;

  this.length = 0;
  this.offset = 0;

  this.extra = 0;

  this.lencode = null;
  this.distcode = null;
  this.lenbits = 0;
  this.distbits = 0;

  this.ncode = 0;
  this.nlen = 0;
  this.ndist = 0;
  this.have = 0;
  this.next = null;

  this.lens = new utils.Buf16(320);
  this.work = new utils.Buf16(288);

  this.lendyn = null;
  this.distdyn = null;
  this.sane = 0;
  this.back = 0;
  this.was = 0;
}

function inflateResetKeep(strm) {
  var state;

  if (!strm || !strm.state) return Z_STREAM_ERROR;
  state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = '';
  if (state.wrap) strm.adler = state.wrap & 1;

  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.dmax = 32768;
  state.head = null;
  state.hold = 0;
  state.bits = 0;
  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  return Z_OK;
}

function inflateReset(strm) {
  var state;

  if (!strm || !strm.state) return Z_STREAM_ERROR;
  (state = strm.state).wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);
}

function inflateReset2(strm, windowBits) {
  var wrap, state;

  if (!strm || !strm.state) return Z_STREAM_ERROR;
  state = strm.state;

  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  } else {
    wrap = 1 + (windowBits >> 4);
    if (windowBits < 48) windowBits &= 15;
  }

  if (windowBits && (windowBits < 8 || windowBits > 15)) return Z_STREAM_ERROR;

  if (state.window !== null && state.wbits !== windowBits) state.window = null;

  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
}

function inflateInit2(strm, windowBits) {
  var ret, state;

  if (!strm) return Z_STREAM_ERROR;

  state = new InflateState();

  strm.state = state;
  state.window = null;
  if ((ret = inflateReset2(strm, windowBits)) !== Z_OK) strm.state = null;

  return ret;
}

function inflateInit(strm) {
  return inflateInit2(strm, DEF_WBITS);
}

var lenfix, distfix,
  virgin = true;

function fixedtables(state) {
  if (virgin) {
    var sym;

    lenfix = new utils.Buf32(512);
    distfix = new utils.Buf32(32);

    sym = 0;
    while (sym < 144) state.lens[sym++] = 8;
    while (sym < 256) state.lens[sym++] = 9;
    while (sym < 280) state.lens[sym++] = 7;
    while (sym < 288) state.lens[sym++] = 8;

    inflate_table(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });

    sym = 0;
    while (sym < 32) state.lens[sym++] = 5;

    inflate_table(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });

    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
}

function updatewindow(strm, src, end, copy) {
  var dist,
    state = strm.state;

  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new utils.Buf8(state.wsize);
  }

  if (copy >= state.wsize) {
    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
    state.wnext = 0;
    state.whave = state.wsize;
  } else {
    if ((dist = state.wsize - state.wnext) > copy) dist = copy;

    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
    if ((copy -= dist)) {
      utils.arraySet(state.window, src, end - copy, copy, 0);
      state.wnext = copy;
      state.whave = state.wsize;
    } else {
      state.wnext += dist;
      if (state.wnext === state.wsize) state.wnext = 0;
      if (state.whave < state.wsize) state.whave += dist;
    }
  }
  return 0;
}

function inflate(strm, flush) {
  var state, input, output, next, put, have, left, hold, bits, _in, _out, copy, from, from_source;
  var here_bits, here_op, here_val, last_bits, last_op, last_val, len, ret, opts, n;

  var here = 0,
    hbuf = new utils.Buf8(4),
    order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];

  if (!strm || !strm.state || !strm.output || (!strm.input && strm.avail_in !== 0)) return Z_STREAM_ERROR;

  if ((state = strm.state).mode === TYPE) state.mode = TYPEDO;

  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: for (;;)
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if (state.wrap & 2 && hold === 0x8b1f) {
          state.check = 0;
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);

          hold = 0;
          bits = 0;
          state.mode = FLAGS;
          break;
        }
        state.flags = 0;
        if (state.head) state.head.done = false;

        if (!(state.wrap & 1) || (((hold & 0xff) << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        bits -= 4;
        len = 8 + (0x0f & (hold >>>= 4));
        if (state.wbits === 0) state.wbits = len;
        else if (len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }
        state.dmax = 1 << len;
        strm.adler = state.check = 1;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        hold = 0;
        bits = 0;
        break;
      case FLAGS:
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) state.head.text = (hold >> 8) & 1;

        if (state.flags & 0x0200) {
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = TIME;
      case TIME:
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if (state.head) state.head.time = hold;

        if (state.flags & 0x0200) {
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = OS;
      case OS:
        while (bits < 16) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if (state.head) {
          state.head.xflags = hold & 0xff;
          state.head.os = hold >> 8;
        }
        if (state.flags & 0x0200) {
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
        }
        hold = 0;
        bits = 0;
        state.mode = EXLEN;
      case EXLEN:
        if (state.flags & 0x0400) {
          while (bits < 16) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.length = hold;
          if (state.head) state.head.extra_len = hold;

          if (state.flags & 0x0200) {
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
          }
          hold = 0;
          bits = 0;
        } else if (state.head) state.head.extra = null;

        state.mode = EXTRA;
      case EXTRA:
        if (state.flags & 0x0400) {
          if ((copy = state.length) > have) copy = have;
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              state.head.extra || (state.head.extra = new Array(state.head.extra_len));

              utils.arraySet(state.head.extra, input, next, copy, len);
            }
            if (state.flags & 0x0200) state.check = crc32(state.check, input, copy, next);

            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) break inf_leave;
        }
        state.length = 0;
        state.mode = NAME;
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) break inf_leave;
          copy = 0;
          do {
            len = input[next + copy++];
            if (state.head && len && state.length < 65536) state.head.name += String.fromCharCode(len);
          } while (len && copy < have);

          if (state.flags & 0x0200) state.check = crc32(state.check, input, copy, next);

          have -= copy;
          next += copy;
          if (len) break inf_leave;
        } else if (state.head) state.head.name = null;

        state.length = 0;
        state.mode = COMMENT;
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) break inf_leave;
          copy = 0;
          do {
            len = input[next + copy++];
            if (state.head && len && state.length < 65536) state.head.comment += String.fromCharCode(len);
          } while (len && copy < have);
          if (state.flags & 0x0200) state.check = crc32(state.check, input, copy, next);

          have -= copy;
          next += copy;
          if (len) break inf_leave;
        } else if (state.head) state.head.comment = null;

        state.mode = HCRC;
      case HCRC:
        if (state.flags & 0x0200) {
          while (bits < 16) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        if (state.head) {
          state.head.hcrc = (state.flags >> 9) & 1;
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        strm.adler = state.check = zswap32(hold);
        hold = 0;
        bits = 0;
        state.mode = DICT;
      case DICT:
        if (state.havedict === 0) {
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1;
        state.mode = TYPE;
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) break inf_leave;
      case TYPEDO:
        if (state.last) {
          hold >>>= bits & 7;
          bits -= bits & 7;
          state.mode = CHECK;
          break;
        }
        while (bits < 3) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        state.last = hold & 0x01;
        bits -= 1;

        switch (0x03 & (hold >>>= 1)) {
          case 0:
            state.mode = STORED;
            break;
          case 1:
            fixedtables(state);
            state.mode = LEN_;
            if (flush === Z_TREES) {
              hold >>>= 2;
              bits -= 2;
              break inf_leave;
            }
            break;
          case 2:
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        hold >>>= 2;
        bits -= 2;
        break;
      case STORED:
        hold >>>= bits & 7;
        bits -= bits & 7;
        while (bits < 32) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if ((hold & 0xffff) != ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        hold = 0;
        bits = 0;
        state.mode = COPY_;
        if (flush === Z_TREES) break inf_leave;
      case COPY_:
        state.mode = COPY;
      case COPY:
        if ((copy = state.length)) {
          if (copy > have) copy = have;
          if (copy > left) copy = left;
          if (copy === 0) break inf_leave;
          utils.arraySet(output, input, next, copy, put);
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        state.mode = TYPE;
        break;
      case TABLE:
        while (bits < 14) {
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        state.nlen = 257 + (hold & 0x1f);
        hold >>>= 5;
        bits -= 5;
        state.ndist = 1 + (hold & 0x1f);
        hold >>>= 5;
        bits -= 5;
        state.ncode = 4 + (hold & 0x0f);
        hold >>>= 4;
        bits -= 4;
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
        state.have = 0;
        state.mode = LENLENS;
      case LENLENS:
        while (state.have < state.ncode) {
          while (bits < 3) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.lens[order[state.have++]] = hold & 0x07;
          hold >>>= 3;
          bits -= 3;
        }
        while (state.have < 19) state.lens[order[state.have++]] = 0;

        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        state.have = 0;
        state.mode = CODELENS;
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here_op = ((here = state.lencode[hold & ((1 << state.lenbits) - 1)]) >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits = here >>> 24) <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (here_val < 16) {
            hold >>>= here_bits;
            bits -= here_bits;
            state.lens[state.have++] = here_val;
          } else {
            if (here_val === 16) {
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= here_bits;
              bits -= here_bits;
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);
              hold >>>= 2;
              bits -= 2;
            } else if (here_val === 17) {
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              bits -= here_bits;
              len = 0;
              copy = 3 + (0x07 & (hold >>>= here_bits));
              hold >>>= 3;
              bits -= 3;
            } else {
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) break inf_leave;
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              bits -= here_bits;
              len = 0;
              copy = 11 + (0x7f & (hold >>>= here_bits));
              hold >>>= 7;
              bits -= 7;
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) state.lens[state.have++] = len;
          }
        }

        if (state.mode === BAD) break;

        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        state.distbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        state.mode = LEN_;
        if (flush === Z_TREES) break inf_leave;
      case LEN_:
        state.mode = LEN;
      case LEN:
        if (have >= 6 && left >= 258) {
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          inflate_fast(strm, _out);
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;

          if (state.mode === TYPE) state.back = -1;
          break;
        }
        state.back = 0;
        for (;;) {
          here_op = ((here = state.lencode[hold & ((1 << state.lenbits) - 1)]) >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits = here >>> 24) <= bits) break;
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if (here_op && (here_op & 0xf0) == 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val + ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)];
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if (last_bits + (here_bits = here >>> 24) <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          hold >>>= last_bits;
          bits -= last_bits;
          state.back += last_bits;
        }
        hold >>>= here_bits;
        bits -= here_bits;
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
      case LENEXT:
        if (state.extra) {
          n = state.extra;
          while (bits < n) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.length += hold & ((1 << state.extra) - 1);
          hold >>>= state.extra;
          bits -= state.extra;
          state.back += state.extra;
        }
        state.was = state.length;
        state.mode = DIST;
      case DIST:
        for (;;) {
          here_op = ((here = state.distcode[hold & ((1 << state.distbits) - 1)]) >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits = here >>> 24) <= bits) break;
          if (have === 0) break inf_leave;
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        if ((here_op & 0xf0) == 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val + ((hold & ((1 << (last_bits + last_op)) - 1)) >> last_bits)];
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if (last_bits + (here_bits = here >>> 24) <= bits) break;
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          hold >>>= last_bits;
          bits -= last_bits;
          state.back += last_bits;
        }
        hold >>>= here_bits;
        bits -= here_bits;
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = here_op & 15;
        state.mode = DISTEXT;
      case DISTEXT:
        if (state.extra) {
          n = state.extra;
          while (bits < n) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          state.offset += hold & ((1 << state.extra) - 1);
          hold >>>= state.extra;
          bits -= state.extra;
          state.back += state.extra;
        }
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
        state.mode = MATCH;
      case MATCH:
        if (left === 0) break inf_leave;
        copy = _out - left;
        if (state.offset > copy) {
          if ((copy = state.offset - copy) > state.whave && state.sane) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break;
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          } else from = state.wnext - copy;

          if (copy > state.length) copy = state.length;
          from_source = state.window;
        } else {
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) copy = left;
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) state.mode = LEN;
        break;
      case LIT:
        if (left === 0) break inf_leave;
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          while (bits < 32) {
            if (have === 0) break inf_leave;
            have--;
            hold |= input[next++] << bits;
            bits += 8;
          }
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if (_out)
            strm.adler = state.check = state.flags
              ? crc32(state.check, output, _out, put - _out)
              : adler32(state.check, output, _out, put - _out);

          _out = left;
          if ((state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        state.mode = LENGTH;
      case LENGTH:
        if (state.wrap && state.flags) {
          while (bits < 32) {
            if (have === 0) break inf_leave;
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          if (hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          hold = 0;
          bits = 0;
        }
        state.mode = DONE;
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
      default:
        return Z_STREAM_ERROR;
    }

  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;

  if ((state.wsize || (_out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH))) &&
      updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if (state.wrap && _out)
    strm.adler = state.check = state.flags
      ? crc32(state.check, output, _out, strm.next_out - _out)
      : adler32(state.check, output, _out, strm.next_out - _out);

  strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) +
    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) ret = Z_BUF_ERROR;

  return ret;
}

function inflateEnd(strm) {
  if (!strm || !strm.state) return Z_STREAM_ERROR;

  var state = strm.state;
  if (state.window) state.window = null;

  strm.state = null;
  return Z_OK;
}

function inflateGetHeader(strm, head) {
  var state;

  if (!strm || !strm.state) return Z_STREAM_ERROR;
  if (((state = strm.state).wrap & 2) == 0) return Z_STREAM_ERROR;

  state.head = head;
  head.done = false;
  return Z_OK;
}

function inflateSetDictionary(strm, dictionary) {
  var state,
    dictLength = dictionary.length;

  if (!strm || !strm.state) return Z_STREAM_ERROR;

  if ((state = strm.state).wrap !== 0 && state.mode !== DICT) return Z_STREAM_ERROR;

  if (state.mode === DICT && adler32(1, dictionary, dictLength, 0) !== state.check) return Z_DATA_ERROR;

  if (updatewindow(strm, dictionary, dictLength, dictLength)) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  return Z_OK;
}

exports.inflateReset = inflateReset;
exports.inflateReset2 = inflateReset2;
exports.inflateResetKeep = inflateResetKeep;
exports.inflateInit = inflateInit;
exports.inflateInit2 = inflateInit2;
exports.inflate = inflate;
exports.inflateEnd = inflateEnd;
exports.inflateGetHeader = inflateGetHeader;
exports.inflateSetDictionary = inflateSetDictionary;
exports.inflateInfo = 'pako inflate (from Nodeca project)';

},
// 13
function (module) {

var BAD = 30,
  TYPE = 12;

module.exports = function (strm, start) {
  var state, _in, last, _out, beg, end, dmax, wsize, whave, wnext, s_window, hold, bits;
  var lcode, dcode, lmask, dmask, here, op, len, dist, from, from_source, input, output;

  state = strm.state;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
  dmax = state.dmax;
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;

  top: do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen: for (;;) {
      hold >>>= op = here >>> 24;
      bits -= op;
      if ((op = (here >>> 16) & 0xff) == 0) output[_out++] = here & 0xffff;
      else if (op & 16) {
        len = here & 0xffff;
        if ((op &= 15)) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist: for (;;) {
          hold >>>= op = here >>> 24;
          bits -= op;

          if (!(16 & (op = (here >>> 16) & 0xff))) {
            if ((op & 64) == 0) {
              here = dcode[(here & 0xffff) + (hold & ((1 << op) - 1))];
              continue dodist;
            }
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          dist = here & 0xffff;
          if (bits < (op &= 15)) {
            hold += input[_in++] << bits;
            if ((bits += 8) < op) {
              hold += input[_in++] << bits;
              bits += 8;
            }
          }
          if ((dist += hold & ((1 << op) - 1)) > dmax) {
            strm.msg = 'invalid distance too far back';
            state.mode = BAD;
            break top;
          }
          hold >>>= op;
          bits -= op;
          if (dist > (op = _out - beg)) {
            if ((op = dist - op) > whave && state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
            from = 0;
            from_source = s_window;
            if (wnext === 0) {
              from += wsize - op;
              if (op < len) {
                len -= op;
                do {
                  output[_out++] = s_window[from++];
                } while (--op);
                from = _out - dist;
                from_source = output;
              }
            } else if (wnext < op) {
              from += wsize + wnext - op;
              if ((op -= wnext) < len) {
                len -= op;
                do {
                  output[_out++] = s_window[from++];
                } while (--op);
                from = 0;
                if (wnext < len) {
                  len -= op = wnext;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;
                  from_source = output;
                }
              }
            } else {
              from += wnext - op;
              if (op < len) {
                len -= op;
                do {
                  output[_out++] = s_window[from++];
                } while (--op);
                from = _out - dist;
                from_source = output;
              }
            }
            while (len > 2) {
              output[_out++] = from_source[from++];
              output[_out++] = from_source[from++];
              output[_out++] = from_source[from++];
              len -= 3;
            }
            if (len) {
              output[_out++] = from_source[from++];
              if (len > 1) output[_out++] = from_source[from++];
            }
          } else {
            from = _out - dist;
            do {
              output[_out++] = output[from++];
              output[_out++] = output[from++];
              output[_out++] = output[from++];
              len -= 3;
            } while (len > 2);
            if (len) {
              output[_out++] = output[from++];
              if (len > 1) output[_out++] = output[from++];
            }
          }

          break;
        }
      } else if ((op & 64) == 0) {
        here = lcode[(here & 0xffff) + (hold & ((1 << op) - 1))];
        continue dolen;
      } else if (op & 32) {
        state.mode = TYPE;
        break top;
      } else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break;
    }
  } while (_in < last && _out < end);

  _in -= len = bits >> 3;
  hold &= (1 << (bits -= len << 3)) - 1;

  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = _in < last ? last - _in + 5 : 5 - (_in - last);
  strm.avail_out = _out < end ? end - _out + 257 : 257 - (_out - end);
  state.hold = hold;
  state.bits = bits;
  // return;
};

},
// 14
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var MAXBITS = 15,
  ENOUGH_LENS = 852,
  ENOUGH_DISTS = 592,

  CODES = 0,
  LENS = 1,
  DISTS = 2;

var lbase = [
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258,
  0, 0
];

var lext = [
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21,
  16, 72, 78
];

var dbase = [
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
];

var dext = [
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28,
  29, 29, 64, 64
];

module.exports = function (type, lens, lens_index, codes, table, table_index, work, opts) {
  var incr, fill, low, mask, next, end, here_bits, here_op, here_val;
  var bits = opts.bits,

    len, // = 0
    sym, // = 0
    min = 0, max, // = 0
    root, // = 0
    curr = 0,
    drop = 0,
    left = 0,
    used = 0,
    huff = 0,
    base = null,
    base_index = 0,
    count = new utils.Buf16(MAXBITS + 1),
    offs = new utils.Buf16(MAXBITS + 1),
    extra = null,
    extra_index = 0;

  for (len = 0; len <= MAXBITS; len++) count[len] = 0;

  for (sym = 0; sym < codes; sym++) count[lens[lens_index + sym]]++;

  root = bits;
  for (max = MAXBITS; max >= 1 && count[max] === 0; max--);

  if (root > max) root = max;

  if (max === 0) {
    table[table_index++] = 20971520; // (1 << 24) | (64 << 16) | 0

    table[table_index++] = 20971520;

    opts.bits = 1;
    return 0;
  }
  for (min = 1; min < max && count[min] === 0; min++);

  if (root < min) root = min;

  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    if ((left -= count[len]) < 0) return -1;
  }
  if (left > 0 && (type === CODES || max !== 1)) return -1;

  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) offs[len + 1] = offs[len] + count[len];

  for (sym = 0; sym < codes; sym++)
    if (lens[lens_index + sym] !== 0) work[offs[lens[lens_index + sym]]++] = sym;

  if (type === CODES) {
    base = extra = work;
    end = 19;
  } else if (type === LENS) {
    base = lbase;
    base_index -= 257;
    extra = lext;
    extra_index -= 257;
    end = 256;
  } else {
    base = dbase;
    extra = dext;
    end = -1;
  }

  huff = 0;
  sym = 0;
  len = min;
  next = table_index;
  curr = root;
  drop = 0;
  low = -1;
  mask = (used = 1 << root) - 1;

  if ((type === LENS && used > ENOUGH_LENS) || (type === DISTS && used > ENOUGH_DISTS)) return 1;

  for (;;) {
    here_bits = len - drop;
    if (work[sym] < end) {
      here_op = 0;
      here_val = work[sym];
    } else if (work[sym] > end) {
      here_op = extra[extra_index + work[sym]];
      here_val = base[base_index + work[sym]];
    } else {
      here_op = 96;
      here_val = 0;
    }

    incr = 1 << (len - drop);
    min = fill = 1 << curr;
    do {
      table[next + (huff >> drop) + (fill -= incr)] = (here_bits << 24) | (here_op << 16) | here_val | 0;
    } while (fill !== 0);

    incr = 1 << (len - 1);
    while (huff & incr) incr >>= 1;

    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else huff = 0;

    sym++;
    if (--count[len] == 0) {
      if (len === max) break;
      len = lens[lens_index + work[sym]];
    }

    if (len > root && (huff & mask) !== low) {
      if (drop === 0) drop = root;

      next += min;

      left = 1 << (curr = len - drop);
      while (curr + drop < max && (left -= count[curr + drop]) > 0) {
        curr++;
        left <<= 1;
      }

      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) || (type === DISTS && used > ENOUGH_DISTS)) return 1;

      table[(low = huff & mask)] = (root << 24) | (curr << 16) | (next - table_index) | 0;
    }
  }

  if (huff !== 0) table[next + huff] = ((len - drop) << 24) | (64 << 16) | 0;

  opts.bits = root;
  return 0;
};

},
// 15
function (module) {

module.exports = {
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,

  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_BUF_ERROR: -5,

  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,

  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,

  Z_BINARY: 0,
  Z_TEXT: 1,
  Z_UNKNOWN: 2,

  Z_DEFLATED: 8
};

},
// 16
function (module) {

module.exports = require('util');

}
]);

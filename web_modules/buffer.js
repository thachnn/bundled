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
  return __webpack_require__(0);
})([
// 0
function (module, exports, __webpack_require__) {

var base64 = __webpack_require__(1),
  ieee754 = __webpack_require__(2),
  isArray = __webpack_require__(3)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

Buffer.TYPED_ARRAY_SUPPORT =
  global.TYPED_ARRAY_SUPPORT !== void 0 ? global.TYPED_ARRAY_SUPPORT : typedArraySupport()

exports.kMaxLength = kMaxLength()

function typedArraySupport() {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 &&
      typeof arr.subarray == 'function' &&
      arr.subarray(1, 1).byteLength === 0
  } catch (_) {
    return false
  }
}

function kMaxLength() {
  return Buffer.TYPED_ARRAY_SUPPORT ? 0x7fffffff : 0x3fffffff
}

function createBuffer(that, length) {
  if (kMaxLength() < length) throw new RangeError('Invalid typed array length')

  if (Buffer.TYPED_ARRAY_SUPPORT)
    (that = new Uint8Array(length)).__proto__ = Buffer.prototype
  else {
    if (that === null) that = new Buffer(length)

    that.length = length
  }

  return that
}

function Buffer(arg, encodingOrOffset, length) {
  if (!(Buffer.TYPED_ARRAY_SUPPORT || this instanceof Buffer))
    return new Buffer(arg, encodingOrOffset, length)

  if (typeof arg == 'number') {
    if (typeof encodingOrOffset == 'string')
      throw new Error('If encoding is specified then the first argument must be a string')

    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192

Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from(that, value, encodingOrOffset, length) {
  if (typeof value == 'number') throw new TypeError('"value" argument must not be a number')

  return typeof ArrayBuffer != 'undefined' && value instanceof ArrayBuffer
    ? fromArrayBuffer(that, value, encodingOrOffset, length)
    : typeof value == 'string'
    ? fromString(that, value, encodingOrOffset)
    : fromObject(that, value)
}

Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  typeof Symbol != 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer &&
    Object.defineProperty(Buffer, Symbol.species, {value: null, configurable: true})
}

function assertSize(size) {
  if (typeof size != 'number') throw new TypeError('"size" argument must be a number')
  if (size < 0) throw new RangeError('"size" argument must not be negative')
}

function alloc(that, size, fill, encoding) {
  assertSize(size)

  return size <= 0 || fill === void 0
    ? createBuffer(that, size)
    : typeof encoding == 'string'
    ? createBuffer(that, size).fill(fill, encoding)
    : createBuffer(that, size).fill(fill)
}

Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe(that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0

  return that
}

Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString(that, string, encoding) {
  if (typeof encoding != 'string' || encoding === '') encoding = 'utf8'

  if (!Buffer.isEncoding(encoding))
    throw new TypeError('"encoding" must be a valid string encoding')

  var length = byteLength(string, encoding) | 0,

    actual = (that = createBuffer(that, length)).write(string, encoding)

  if (actual !== length) that = that.slice(0, actual)

  return that
}

function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) that[i] = array[i] & 255

  return that
}

function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength

  if (byteOffset < 0 || array.byteLength < byteOffset)
    throw new RangeError("'offset' is out of bounds")

  if (array.byteLength < byteOffset + (length || 0))
    throw new RangeError("'length' is out of bounds")

  array = byteOffset === void 0 && length === void 0
    ? new Uint8Array(array)
    : length === void 0
    ? new Uint8Array(array, byteOffset)
    : new Uint8Array(array, byteOffset, length)

  if (Buffer.TYPED_ARRAY_SUPPORT) (that = array).__proto__ = Buffer.prototype
  else that = fromArrayLike(that, array)

  return that
}

function fromObject(that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0

    if ((that = createBuffer(that, len)).length === 0) return that

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer != 'undefined' && obj.buffer instanceof ArrayBuffer) || 'length' in obj)
      return typeof obj.length != 'number' || isnan(obj.length)
        ? createBuffer(that, 0)
        : fromArrayLike(that, obj)

    if (obj.type === 'Buffer' && isArray(obj.data)) return fromArrayLike(that, obj.data)
  }

  throw new TypeError(
    'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
  )
}

function checked(length) {
  if (length >= kMaxLength())
    throw new RangeError(
      'Attempt to allocate Buffer larger than maximum size: 0x' + kMaxLength().toString(16) + ' bytes'
    )

  return length | 0
}

function SlowBuffer(length) {
  if (+length != length) length = 0

  return Buffer.alloc(+length)
}

Buffer.isBuffer = function (b) {
  return !(b == null || !b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  if (a === b) return 0

  var x = a.length,
    y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i)
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }

  return x < y ? -1 : y < x ? 1 : 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, length) {
  if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers')

  if (list.length === 0) return Buffer.alloc(0)

  var i
  if (length === void 0) {
    length = 0
    for (i = 0; i < list.length; ++i) length += list[i].length
  }
  var buffer = Buffer.allocUnsafe(length),
    pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf))
      throw new TypeError('"list" argument must be an Array of Buffers')

    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength(string, encoding) {
  if (Buffer.isBuffer(string)) return string.length

  if (typeof ArrayBuffer != 'undefined' && typeof ArrayBuffer.isView == 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer))
    return string.byteLength

  if (typeof string != 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  for (var loweredCase = false; ; )
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case void 0:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
}
Buffer.byteLength = byteLength

function slowToString(encoding, start, end) {
  var loweredCase = false

  if (start === void 0 || start < 0) start = 0

  if (start > this.length) return ''

  if (end === void 0 || end > this.length) end = this.length

  if (end <= 0) return ''

  if ((end >>>= 0) <= (start >>>= 0)) return ''

  encoding || (encoding = 'utf8')

  while (1)
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
}

Buffer.prototype._isBuffer = true

function swap(b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function () {
  var len = this.length
  if (len % 2 != 0) throw new RangeError('Buffer size must be a multiple of 16-bits')

  for (var i = 0; i < len; i += 2) swap(this, i, i + 1)

  return this
}

Buffer.prototype.swap32 = function () {
  var len = this.length
  if (len % 4 != 0) throw new RangeError('Buffer size must be a multiple of 32-bits')

  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function () {
  var len = this.length
  if (len % 8 != 0) throw new RangeError('Buffer size must be a multiple of 64-bits')

  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function () {
  var length = this.length | 0
  return length === 0 ? ''
    : arguments.length === 0 ? utf8Slice(this, 0, length)
    : slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return this === b || Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = '',
    max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) throw new TypeError('Argument must be a Buffer')

  if (start === void 0) start = 0
  if (end === void 0) end = target ? target.length : 0

  if (thisStart === void 0) thisStart = 0
  if (thisEnd === void 0) thisEnd = this.length

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length)
    throw new RangeError('out of range index')

  if (thisStart >= thisEnd && start >= end) return 0
  if (thisStart >= thisEnd) return -1
  if (start >= end) return 1

  if (this === target) return 0

  var x = (thisEnd >>>= 0) - (thisStart >>>= 0),
    y = (end >>>= 0) - (start >>>= 0),
    len = Math.min(x, y),

    thisCopy = this.slice(thisStart, thisEnd),
    targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i)
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }

  return x < y ? -1 : y < x ? 1 : 0
}

function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0) return -1

  if (typeof byteOffset == 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000

  byteOffset = +byteOffset
  if (isNaN(byteOffset)) byteOffset = dir ? 0 : buffer.length - 1

  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (!dir) return -1
    byteOffset = 0
  }

  if (typeof val == 'string') val = Buffer.from(val, encoding)

  if (Buffer.isBuffer(val))
    return val.length === 0 ? -1 : arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  if (typeof val == 'number') {
    val &= 0xFF
    return !Buffer.TYPED_ARRAY_SUPPORT || typeof Uint8Array.prototype.indexOf != 'function'
      ? arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
      : dir
      ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var i,
    indexSize = 1,
    arrLength = arr.length,
    valLength = val.length

  if (encoding !== void 0 && ((encoding = String(encoding).toLowerCase()) === 'ucs2' ||
      encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le')) {
    if (arr.length < 2 || val.length < 2) return -1

    indexSize = 2
    arrLength /= 2
    valLength /= 2
    byteOffset /= 2
  }

  function read(buf, i) {
    return indexSize === 1 ? buf[i] : buf.readUInt16BE(i * indexSize)
  }

  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++)
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++)
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }

      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) length = remaining
  else if ((length = Number(length)) > remaining) length = remaining

  var strLen = string.length
  if (strLen % 2 != 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) length = strLen / 2

  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  if (offset === void 0) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  } else if (length === void 0 && typeof offset == 'string') {
    encoding = offset
    length = this.length
    offset = 0
  } else if (isFinite(offset)) {
    offset |= 0
    if (isFinite(length)) {
      length |= 0
      if (encoding === void 0) encoding = 'utf8'
    } else {
      encoding = length
      length = void 0
    }
  } else
    throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported')

  var remaining = this.length - offset
  if (length === void 0 || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length)
    throw new RangeError('Attempt to write outside buffer bounds')

  encoding || (encoding = 'utf8')

  for (var loweredCase = false; ; )
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
}

Buffer.prototype.toJSON = function () {
  return {type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0)}
}

function base64Slice(buf, start, end) {
  return start === 0 && end === buf.length
    ? base64.fromByteArray(buf)
    : base64.fromByteArray(buf.slice(start, end))
}

function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  for (var i = start; i < end; ) {
    var firstByte = buf[i],
      codePoint = null,
      bytesPerSequence = firstByte > 0xEF ? 4 : firstByte > 0xDF ? 3 : firstByte > 0xBF ? 2 : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) codePoint = firstByte

          break
        case 2:
          if (((secondByte = buf[i + 1]) & 0xC0) == 0x80) {
            tempCodePoint = ((firstByte & 0x1F) << 0x6) | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) codePoint = tempCodePoint
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) == 0x80 && (thirdByte & 0xC0) == 0x80) {
            tempCodePoint =
              ((firstByte & 0xF) << 0xC) | ((secondByte & 0x3F) << 0x6) | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF))
              codePoint = tempCodePoint
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) == 0x80 && (thirdByte & 0xC0) == 0x80 && (fourthByte & 0xC0) == 0x80) {
            tempCodePoint =
              ((firstByte & 0xF) << 0x12) |
              ((secondByte & 0x3F) << 0xC) |
              ((thirdByte & 0x3F) << 0x6) |
              (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) codePoint = tempCodePoint
          }
      }
    }

    if (codePoint === null) {
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      codePoint -= 0x10000
      res.push(((codePoint >>> 10) & 0x3FF) | 0xD800)
      codePoint = 0xDC00 | (codePoint & 0x3FF)
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray(codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints)

  var res = ''
  for (var i = 0; i < len; )
    res += String.fromCharCode.apply(String, codePoints.slice(i, (i += MAX_ARGUMENTS_LENGTH)))

  return res
}

function asciiSlice(buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i] & 0x7F)

  return ret
}

function latin1Slice(buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i])

  return ret
}

function hexSlice(buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) out += toHex(buf[i])

  return out
}

function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end),
    res = ''
  for (var i = 0; i < bytes.length; i += 2)
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)

  return res
}

Buffer.prototype.slice = function (start, end) {
  var newBuf,
    len = this.length

  if ((start = ~~start) < 0) (start += len) < 0 && (start = 0)
  else if (start > len) start = len

  if ((end = end === void 0 ? len : ~~end) < 0) (end += len) < 0 && (end = 0)
  else if (end > len) end = len

  if (end < start) end = start

  if (Buffer.TYPED_ARRAY_SUPPORT)
    (newBuf = this.subarray(start, end)).__proto__ = Buffer.prototype
  else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, void 0)
    for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start]
  }

  return newBuf
}

function checkOffset(offset, ext, length) {
  if (offset % 1 != 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function (offset, byteLength, noAssert) {
  offset |= 0
  byteLength |= 0
  noAssert || checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  for (var mul = 1, i = 0; ++i < byteLength && (mul *= 0x100); ) val += this[offset + i] * mul

  return val
}

Buffer.prototype.readUIntBE = function (offset, byteLength, noAssert) {
  offset |= 0
  byteLength |= 0
  noAssert || checkOffset(offset, byteLength, this.length)

  var val = this[offset + --byteLength]
  for (var mul = 1; byteLength > 0 && (mul *= 0x100); ) val += this[offset + --byteLength] * mul

  return val
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  noAssert || checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)

  return (
    (this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16)) +
    this[offset + 3] * 0x1000000
  )
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)

  return (
    this[offset] * 0x1000000 +
    ((this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3])
  )
}

Buffer.prototype.readIntLE = function (offset, byteLength, noAssert) {
  offset |= 0
  byteLength |= 0
  noAssert || checkOffset(offset, byteLength, this.length)

  var val = this[offset],
    mul = 1
  for (var i = 0; ++i < byteLength && (mul *= 0x100); ) val += this[offset + i] * mul

  if (val >= (mul *= 0x80)) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function (offset, byteLength, noAssert) {
  offset |= 0
  byteLength |= 0
  noAssert || checkOffset(offset, byteLength, this.length)

  var i = byteLength,
    mul = 1,
    val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) val += this[offset + --i] * mul

  if (val >= (mul *= 0x80)) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  noAssert || checkOffset(offset, 1, this.length)
  return !(this[offset] & 0x80) ? this[offset] : (0xff - this[offset] + 1) * -1
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return val & 0x8000 ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return val & 0x8000 ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)

  return (
    this[offset] | (this[offset + 1] << 8) | (this[offset + 2] << 16) | (this[offset + 3] << 24)
  )
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)

  return (
    (this[offset] << 24) | (this[offset + 1] << 16) | (this[offset + 2] << 8) | this[offset + 3]
  )
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  noAssert || checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt(buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset |= 0
  byteLength |= 0
  noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0)

  var mul = 1,
    i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) this[offset + i] = (value / mul) & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset |= 0
  byteLength |= 0
  noAssert || checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength) - 1, 0)

  var i = byteLength - 1,
    mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) this[offset + i] = (value / mul) & 0xFF

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 1, 0xff, 0)
  Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value))
  this[offset] = value & 0xff
  return offset + 1
}

function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i)
    buf[offset + i] =
      (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>> ((littleEndian ? i : 1 - i) * 8)
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff
    this[offset + 1] = value >>> 8
  } else objectWriteUInt16(this, value, offset, true)

  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8
    this[offset + 1] = value & 0xff
  } else objectWriteUInt16(this, value, offset, false)

  return offset + 2
}

function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i)
    buf[offset + i] = (value >>> ((littleEndian ? i : 3 - i) * 8)) & 0xff
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = value >>> 24
    this[offset + 2] = value >>> 16
    this[offset + 1] = value >>> 8
    this[offset] = value & 0xff
  } else objectWriteUInt32(this, value, offset, true)

  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24
    this[offset + 1] = value >>> 16
    this[offset + 2] = value >>> 8
    this[offset + 3] = value & 0xff
  } else objectWriteUInt32(this, value, offset, false)

  return offset + 4
}

Buffer.prototype.writeIntLE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset |= 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0,
    mul = 1,
    sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1

    this[offset + i] = (((value / mul) >> 0) - sub) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function (value, offset, byteLength, noAssert) {
  value = +value
  offset |= 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1,
    mul = 1,
    sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1

    this[offset + i] = (((value / mul) >> 0) - sub) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 1, 0x7f, -0x80)
  Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value))
  if (value < 0) value = 0xff + value + 1
  this[offset] = value & 0xff
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff
    this[offset + 1] = value >>> 8
  } else objectWriteUInt16(this, value, offset, true)

  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 8
    this[offset + 1] = value & 0xff
  } else objectWriteUInt16(this, value, offset, false)

  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value & 0xff
    this[offset + 1] = value >>> 8
    this[offset + 2] = value >>> 16
    this[offset + 3] = value >>> 24
  } else objectWriteUInt32(this, value, offset, true)

  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset |= 0
  noAssert || checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value >>> 24
    this[offset + 1] = value >>> 16
    this[offset + 2] = value >>> 8
    this[offset + 3] = value & 0xff
  } else objectWriteUInt32(this, value, offset, false)

  return offset + 4
}

function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat(buf, value, offset, littleEndian, noAssert) {
  noAssert ||
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble(buf, value, offset, littleEndian, noAssert) {
  noAssert ||
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

Buffer.prototype.copy = function (target, targetStart, start, end) {
  start || (start = 0)
  end || end === 0 || (end = this.length)
  if (targetStart >= target.length) targetStart = target.length
  targetStart || (targetStart = 0)
  if (end > 0 && end < start) end = start

  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  if (targetStart < 0) throw new RangeError('targetStart out of bounds')

  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) end = target.length - targetStart + start

  var i,
    len = end - start

  if (this === target && start < targetStart && targetStart < end)
    for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]
  else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT)
    for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]
  else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart)

  return len
}

Buffer.prototype.fill = function (val, start, end, encoding) {
  if (typeof val == 'string') {
    if (typeof start == 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end == 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) val = code
    }
    if (encoding !== void 0 && typeof encoding != 'string')
      throw new TypeError('encoding must be a string')

    if (typeof encoding == 'string' && !Buffer.isEncoding(encoding))
      throw new TypeError('Unknown encoding: ' + encoding)
  } else if (typeof val == 'number') val &= 255

  if (start < 0 || this.length < start || this.length < end)
    throw new RangeError('Out of range index')

  if (end <= start) return this

  start >>>= 0
  end = end === void 0 ? this.length : end >>> 0

  val || (val = 0)

  var i
  if (typeof val == 'number') for (i = start; i < end; ++i) this[i] = val
  else {
    var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString()),
      len = bytes.length
    for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len]
  }

  return this
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean(str) {
  if ((str = stringtrim(str).replace(INVALID_BASE64_RE, '')).length < 2) return ''
  while (str.length % 4 != 0) str += '='

  return str
}

function stringtrim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}

function toHex(n) {
  return n < 16 ? '0' + n.toString(16) : n.toString(16)
}

function utf8ToBytes(string, units) {
  units = units || Infinity
  var bytes = []

  for (var codePoint, length = string.length, leadSurrogate = null, i = 0; i < length; ++i) {
    if ((codePoint = string.charCodeAt(i)) > 0xD7FF && codePoint < 0xE000) {
      if (!leadSurrogate) {
        if (codePoint > 0xDBFF) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }
        if (i + 1 === length) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        leadSurrogate = codePoint
        continue
      }

      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      codePoint = 0x10000 + (((leadSurrogate - 0xD800) << 10) | (codePoint - 0xDC00))
    } else leadSurrogate && (units -= 3) > -1 && bytes.push(0xEF, 0xBF, 0xBD)

    leadSurrogate = null

    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push((codePoint >> 0x6) | 0xC0, (codePoint & 0x3F) | 0x80)
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        (codePoint >> 0xC) | 0xE0,
        ((codePoint >> 0x6) & 0x3F) | 0x80,
        (codePoint & 0x3F) | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        (codePoint >> 0x12) | 0xF0,
        ((codePoint >> 0xC) & 0x3F) | 0x80,
        ((codePoint >> 0x6) & 0x3F) | 0x80,
        (codePoint & 0x3F) | 0x80
      )
    } else throw new Error('Invalid code point')
  }

  return bytes
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) byteArray.push(str.charCodeAt(i) & 0xFF)

  return byteArray
}

function utf16leToBytes(str, units) {
  var byteArray = []
  for (var c, hi, lo, i = 0; i < str.length && (units -= 2) >= 0; ++i) {
    hi = (c = str.charCodeAt(i)) >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes(str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length && i + offset < dst.length && i < src.length; ++i)
    dst[i + offset] = src[i]

  return i
}

function isnan(val) {
  return val !== val
}

},
// 1
function (module, exports) {

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = [],
  revLookup = [],
  Arr = typeof Uint8Array != 'undefined' ? Uint8Array : Array,

  code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens(b64) {
  var len = b64.length

  if (len % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4')

  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  return [validLen, validLen === len ? 0 : 4 - (validLen % 4)]
}

function byteLength(b64) {
  var lens = getLens(b64),
    validLen = lens[0],
    placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
}

function _byteLength(b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
}

function toByteArray(b64) {
  var tmp, i,
    lens = getLens(b64),
    validLen = lens[0],
    placeHoldersLen = lens[1],

    arr = new Arr(_byteLength(b64, validLen, placeHoldersLen)),

    curByte = 0,

    len = placeHoldersLen > 0 ? validLen - 4 : validLen

  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64(num) {
  return lookup[(num >> 18) & 0x3F] +
    lookup[(num >> 12) & 0x3F] +
    lookup[(num >> 6) & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk(uint8, start, end) {
  var tmp,
    output = []
  for (var i = start; i < end; i += 3) {
    tmp = ((uint8[i] << 16) & 0xFF0000) + ((uint8[i + 1] << 8) & 0xFF00) + (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray(uint8) {
  var tmp,
    len = uint8.length,
    extraBytes = len % 3,
    parts = [],
    maxChunkLength = 16383

  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength))

  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3F] + '==')
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3F] + lookup[(tmp << 2) & 0x3F] + '=')
  }

  return parts.join('')
}

},
// 2
function (module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m,
    eLen = nBytes * 8 - mLen - 1,
    eMax = (1 << eLen) - 1,
    eBias = eMax >> 1,
    nBits = -7,
    i = isLE ? nBytes - 1 : 0,
    d = isLE ? -1 : 1,
    s = buffer[offset + i]

  i += d

  e = s & ((1 << -nBits) - 1)
  s >>= -nBits
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << -nBits) - 1)
  e >>= -nBits
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) e = 1 - eBias
  else {
    if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity

    m += Math.pow(2, mLen)
    e -= eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
    eLen = nBytes * 8 - mLen - 1,
    eMax = (1 << eLen) - 1,
    eBias = eMax >> 1,
    rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
    i = isLE ? 0 : nBytes - 1,
    d = isLE ? 1 : -1,
    s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }

    value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias)
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e += eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128
}

},
// 3
function (module) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

}
]);
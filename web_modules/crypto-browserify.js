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
  return __webpack_require__(65);
})([
// 0
function (module, exports, __webpack_require__) {

var buffer = __webpack_require__(8),
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
// 1
function (module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(66);
  if (typeof util.inherits != 'function') throw '';
  module.exports = util.inherits;
} catch (_) {
  module.exports = __webpack_require__(67);
}

},
// 2
function (module, exports, __webpack_require__) {

function assert(val, msg) {
  if (!val) throw new Error(msg || 'Assertion failed');
}

function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  var TempCtor = function () {};
  TempCtor.prototype = superCtor.prototype;
  ctor.prototype = new TempCtor();
  ctor.prototype.constructor = ctor;
}

function BN(number, base, endian) {
  if (BN.isBN(number)) return number;

  this.negative = 0;
  this.words = null;
  this.length = 0;

  this.red = null;

  if (number !== null) {
    if (base === 'le' || base === 'be') {
      endian = base;
      base = 10;
    }

    this._init(number || 0, base || 10, endian || 'be');
  }
}

module.exports = BN;

BN.BN = BN;
BN.wordSize = 26;

var Buffer;
try {
  Buffer = typeof window != 'undefined' && window.Buffer !== void 0
    ? window.Buffer
    : __webpack_require__(8).Buffer;
} catch (_) {}

BN.isBN = function (num) {
  if (num instanceof BN) return true;

  return num !== null && typeof num == 'object' &&
    num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
};

BN.max = function (left, right) {
  return left.cmp(right) > 0 ? left : right;
};

BN.min = function (left, right) {
  return left.cmp(right) < 0 ? left : right;
};

BN.prototype._init = function (number, base, endian) {
  if (typeof number == 'number') return this._initNumber(number, base, endian);

  if (typeof number == 'object') return this._initArray(number, base, endian);

  if (base === 'hex') base = 16;

  assert(base === (base | 0) && base >= 2 && base <= 36);

  var start = 0;
  if ((number = number.toString().replace(/\s+/g, ''))[0] === '-') {
    start++;
    this.negative = 1;
  }

  if (start < number.length)
    if (base === 16) this._parseHex(number, start, endian);
    else {
      this._parseBase(number, base, start);
      endian !== 'le' || this._initArray(this.toArray(), base, endian);
    }
};

BN.prototype._initNumber = function (number, base, endian) {
  if (number < 0) {
    this.negative = 1;
    number = -number;
  }
  if (number < 0x4000000) {
    this.words = [number & 0x3ffffff];
    this.length = 1;
  } else if (number < 0x10000000000000) {
    this.words = [number & 0x3ffffff, (number / 0x4000000) & 0x3ffffff];
    this.length = 2;
  } else {
    assert(number < 0x20000000000000);
    this.words = [number & 0x3ffffff, (number / 0x4000000) & 0x3ffffff, 1];
    this.length = 3;
  }

  endian !== 'le' || this._initArray(this.toArray(), base, endian);
};

BN.prototype._initArray = function (number, base, endian) {
  assert(typeof number.length == 'number');
  if (number.length <= 0) {
    this.words = [0];
    this.length = 1;
    return this;
  }

  this.length = Math.ceil(number.length / 3);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++) this.words[i] = 0;

  var j, w,
    off = 0;
  if (endian === 'be')
    for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
      w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      if ((off += 24) >= 26) {
        off -= 26;
        j++;
      }
    }
  else if (endian === 'le')
    for (i = 0, j = 0; i < number.length; i += 3) {
      w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
      this.words[j] |= (w << off) & 0x3ffffff;
      this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
      if ((off += 24) >= 26) {
        off -= 26;
        j++;
      }
    }

  return this.strip();
};

function parseHex4Bits(string, index) {
  var c = string.charCodeAt(index);
  return c >= 65 && c <= 70
    ? c - 55
    : c >= 97 && c <= 102
    ? c - 87
    : (c - 48) & 0xf;
}

function parseHexByte(string, lowerBound, index) {
  var r = parseHex4Bits(string, index);
  if (index - 1 >= lowerBound) r |= parseHex4Bits(string, index - 1) << 4;

  return r;
}

BN.prototype._parseHex = function (number, start, endian) {
  this.length = Math.ceil((number.length - start) / 6);
  this.words = new Array(this.length);
  for (var i = 0; i < this.length; i++) this.words[i] = 0;

  var w,
    off = 0,
    j = 0;

  if (endian === 'be')
    for (i = number.length - 1; i >= start; i -= 2) {
      w = parseHexByte(number, start, i) << off;
      this.words[j] |= w & 0x3ffffff;
      if (off >= 18) {
        off -= 18;
        j += 1;
        this.words[j] |= w >>> 26;
      } else off += 8;
    }
  else {
    i = (number.length - start) % 2 == 0 ? start + 1 : start;
    for (; i < number.length; i += 2) {
      w = parseHexByte(number, start, i) << off;
      this.words[j] |= w & 0x3ffffff;
      if (off >= 18) {
        off -= 18;
        j += 1;
        this.words[j] |= w >>> 26;
      } else off += 8;
    }
  }

  this.strip();
};

function parseBase(str, start, end, mul) {
  var r = 0;
  for (var len = Math.min(str.length, end), i = start; i < len; i++) {
    var c = str.charCodeAt(i) - 48;

    r *= mul;

    r += c >= 49 ? c - 49 + 0xa : c >= 17 ? c - 17 + 0xa : c;
  }
  return r;
}

BN.prototype._parseBase = function (number, base, start) {
  this.words = [0];
  this.length = 1;

  for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base)
    limbLen++;

  limbLen--;
  limbPow = (limbPow / base) | 0;

  var total = number.length - start,
    mod = total % limbLen,
    end = Math.min(total, total - mod) + start,

    word = 0;
  for (var i = start; i < end; i += limbLen) {
    word = parseBase(number, i, i + limbLen, base);

    this.imuln(limbPow);
    this.words[0] + word < 0x4000000 ? (this.words[0] += word) : this._iaddn(word);
  }

  if (mod !== 0) {
    var pow = 1;
    word = parseBase(number, i, number.length, base);

    for (i = 0; i < mod; i++) pow *= base;

    this.imuln(pow);
    this.words[0] + word < 0x4000000 ? (this.words[0] += word) : this._iaddn(word);
  }

  this.strip();
};

BN.prototype.copy = function (dest) {
  dest.words = new Array(this.length);
  for (var i = 0; i < this.length; i++) dest.words[i] = this.words[i];

  dest.length = this.length;
  dest.negative = this.negative;
  dest.red = this.red;
};

BN.prototype.clone = function () {
  var r = new BN(null);
  this.copy(r);
  return r;
};

BN.prototype._expand = function (size) {
  while (this.length < size) this.words[this.length++] = 0;

  return this;
};

BN.prototype.strip = function () {
  while (this.length > 1 && this.words[this.length - 1] === 0) this.length--;

  return this._normSign();
};

BN.prototype._normSign = function () {
  if (this.length === 1 && this.words[0] === 0) this.negative = 0;

  return this;
};

BN.prototype.inspect = function () {
  return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
};

var zeros = [
  '',
  '0',
  '00',
  '000',
  '0000',
  '00000',
  '000000',
  '0000000',
  '00000000',
  '000000000',
  '0000000000',
  '00000000000',
  '000000000000',
  '0000000000000',
  '00000000000000',
  '000000000000000',
  '0000000000000000',
  '00000000000000000',
  '000000000000000000',
  '0000000000000000000',
  '00000000000000000000',
  '000000000000000000000',
  '0000000000000000000000',
  '00000000000000000000000',
  '000000000000000000000000',
  '0000000000000000000000000'
];

var groupSizes = [
  0, 0,
  25, 16, 12, 11, 10, 9, 8,
  8, 7, 7, 7, 7, 6, 6,
  6, 6, 6, 6, 6, 5, 5,
  5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5
];

var groupBases = [
  0, 0,
  33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
  43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
  16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
  6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
  24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
];

BN.prototype.toString = function (base, padding) {
  padding = padding | 0 || 1;

  var out;
  if ((base = base || 10) === 16 || base === 'hex') {
    out = '';
    var carry = 0;
    for (var off = 0, i = 0; i < this.length; i++) {
      var w = this.words[i],
        word = (0xffffff & ((w << off) | carry)).toString(16);
      out =
        (carry = (w >>> (24 - off)) & 0xffffff) != 0 || i !== this.length - 1
          ? zeros[6 - word.length] + word + out
          : word + out;

      if ((off += 2) >= 26) {
        off -= 26;
        i--;
      }
    }
    if (carry !== 0) out = carry.toString(16) + out;

    while (out.length % padding != 0) out = '0' + out;

    if (this.negative !== 0) out = '-' + out;
    return out;
  }

  if (base === (base | 0) && base >= 2 && base <= 36) {
    var groupSize = groupSizes[base],
      groupBase = groupBases[base];
    out = '';
    var c = this.clone();
    c.negative = 0;
    while (!c.isZero()) {
      var r = c.modn(groupBase).toString(base);
      c = c.idivn(groupBase);

      out = !c.isZero() ? zeros[groupSize - r.length] + r + out : r + out;
    }
    if (this.isZero()) out = '0' + out;

    while (out.length % padding != 0) out = '0' + out;

    if (this.negative !== 0) out = '-' + out;
    return out;
  }

  assert(false, 'Base should be between 2 and 36');
};

BN.prototype.toNumber = function () {
  var ret = this.words[0];
  this.length === 2
    ? (ret += this.words[1] * 0x4000000)
    : this.length === 3 && this.words[2] === 0x01
    ? (ret += 0x10000000000000 + this.words[1] * 0x4000000)
    : this.length > 2 && assert(false, 'Number can only safely store up to 53 bits');

  return this.negative !== 0 ? -ret : ret;
};

BN.prototype.toJSON = function () {
  return this.toString(16);
};

BN.prototype.toBuffer = function (endian, length) {
  assert(Buffer !== void 0);
  return this.toArrayLike(Buffer, endian, length);
};

BN.prototype.toArray = function (endian, length) {
  return this.toArrayLike(Array, endian, length);
};

BN.prototype.toArrayLike = function (ArrayType, endian, length) {
  var byteLength = this.byteLength(),
    reqLength = length || Math.max(1, byteLength);
  assert(byteLength <= reqLength, 'byte array longer than desired length');
  assert(reqLength > 0, 'Requested array length <= 0');

  this.strip();
  var b, i,
    littleEndian = endian === 'le',
    res = new ArrayType(reqLength),

    q = this.clone();
  if (!littleEndian) {
    for (i = 0; i < reqLength - byteLength; i++) res[i] = 0;

    for (i = 0; !q.isZero(); i++) {
      b = q.andln(0xff);
      q.iushrn(8);

      res[reqLength - i - 1] = b;
    }
  } else {
    for (i = 0; !q.isZero(); i++) {
      b = q.andln(0xff);
      q.iushrn(8);

      res[i] = b;
    }

    for (; i < reqLength; i++) res[i] = 0;
  }

  return res;
};

if (Math.clz32)
  BN.prototype._countBits = function (w) {
    return 32 - Math.clz32(w);
  };
else
  BN.prototype._countBits = function (w) {
    var t = w,
      r = 0;
    if (t >= 0x1000) {
      r += 13;
      t >>>= 13;
    }
    if (t >= 0x40) {
      r += 7;
      t >>>= 7;
    }
    if (t >= 0x8) {
      r += 4;
      t >>>= 4;
    }
    if (t >= 0x02) {
      r += 2;
      t >>>= 2;
    }
    return r + t;
  };

BN.prototype._zeroBits = function (w) {
  if (w === 0) return 26;

  var t = w,
    r = 0;
  if ((t & 0x1fff) == 0) {
    r += 13;
    t >>>= 13;
  }
  if ((t & 0x7f) == 0) {
    r += 7;
    t >>>= 7;
  }
  if ((t & 0xf) == 0) {
    r += 4;
    t >>>= 4;
  }
  if ((t & 0x3) == 0) {
    r += 2;
    t >>>= 2;
  }
  (t & 0x1) != 0 || r++;

  return r;
};

BN.prototype.bitLength = function () {
  var w = this.words[this.length - 1],
    hi = this._countBits(w);
  return 26 * (this.length - 1) + hi;
};

function toBitArray(num) {
  var w = new Array(num.bitLength());

  for (var bit = 0; bit < w.length; bit++) {
    var off = (bit / 26) | 0,
      wbit = bit % 26;

    w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
  }

  return w;
}

BN.prototype.zeroBits = function () {
  if (this.isZero()) return 0;

  var r = 0;
  for (var i = 0; i < this.length; i++) {
    var b = this._zeroBits(this.words[i]);
    r += b;
    if (b !== 26) break;
  }
  return r;
};

BN.prototype.byteLength = function () {
  return Math.ceil(this.bitLength() / 8);
};

BN.prototype.toTwos = function (width) {
  return this.negative !== 0 ? this.abs().inotn(width).iaddn(1) : this.clone();
};

BN.prototype.fromTwos = function (width) {
  return this.testn(width - 1) ? this.notn(width).iaddn(1).ineg() : this.clone();
};

BN.prototype.isNeg = function () {
  return this.negative !== 0;
};

BN.prototype.neg = function () {
  return this.clone().ineg();
};

BN.prototype.ineg = function () {
  this.isZero() || (this.negative ^= 1);

  return this;
};

BN.prototype.iuor = function (num) {
  while (this.length < num.length) this.words[this.length++] = 0;

  for (var i = 0; i < num.length; i++) this.words[i] = this.words[i] | num.words[i];

  return this.strip();
};

BN.prototype.ior = function (num) {
  assert((this.negative | num.negative) == 0);
  return this.iuor(num);
};

BN.prototype.or = function (num) {
  return this.length > num.length ? this.clone().ior(num) : num.clone().ior(this);
};

BN.prototype.uor = function (num) {
  return this.length > num.length ? this.clone().iuor(num) : num.clone().iuor(this);
};

BN.prototype.iuand = function (num) {
  var b = this.length > num.length ? num : this;

  for (var i = 0; i < b.length; i++) this.words[i] = this.words[i] & num.words[i];

  this.length = b.length;

  return this.strip();
};

BN.prototype.iand = function (num) {
  assert((this.negative | num.negative) == 0);
  return this.iuand(num);
};

BN.prototype.and = function (num) {
  return this.length > num.length ? this.clone().iand(num) : num.clone().iand(this);
};

BN.prototype.uand = function (num) {
  return this.length > num.length ? this.clone().iuand(num) : num.clone().iuand(this);
};

BN.prototype.iuxor = function (num) {
  var a, b;
  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  for (var i = 0; i < b.length; i++) this.words[i] = a.words[i] ^ b.words[i];

  if (this !== a) for (; i < a.length; i++) this.words[i] = a.words[i];

  this.length = a.length;

  return this.strip();
};

BN.prototype.ixor = function (num) {
  assert((this.negative | num.negative) == 0);
  return this.iuxor(num);
};

BN.prototype.xor = function (num) {
  return this.length > num.length ? this.clone().ixor(num) : num.clone().ixor(this);
};

BN.prototype.uxor = function (num) {
  return this.length > num.length ? this.clone().iuxor(num) : num.clone().iuxor(this);
};

BN.prototype.inotn = function (width) {
  assert(typeof width == 'number' && width >= 0);

  var bytesNeeded = Math.ceil(width / 26) | 0,
    bitsLeft = width % 26;

  this._expand(bytesNeeded);

  bitsLeft > 0 && bytesNeeded--;

  for (var i = 0; i < bytesNeeded; i++) this.words[i] = 0x3ffffff & ~this.words[i];

  if (bitsLeft > 0) this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));

  return this.strip();
};

BN.prototype.notn = function (width) {
  return this.clone().inotn(width);
};

BN.prototype.setn = function (bit, val) {
  assert(typeof bit == 'number' && bit >= 0);

  var off = (bit / 26) | 0,
    wbit = bit % 26;

  this._expand(off + 1);

  val ? (this.words[off] |= 1 << wbit) : (this.words[off] &= ~(1 << wbit));

  return this.strip();
};

BN.prototype.iadd = function (num) {
  var r, a, b;

  if (this.negative !== 0 && num.negative === 0) {
    this.negative = 0;
    r = this.isub(num);
    this.negative ^= 1;
    return this._normSign();
  }
  if (this.negative === 0 && num.negative !== 0) {
    num.negative = 0;
    r = this.isub(num);
    num.negative = 1;
    return r._normSign();
  }

  if (this.length > num.length) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }
  for (; carry !== 0 && i < a.length; i++) {
    r = (a.words[i] | 0) + carry;
    this.words[i] = r & 0x3ffffff;
    carry = r >>> 26;
  }

  this.length = a.length;
  if (carry !== 0) {
    this.words[this.length] = carry;
    this.length++;
  } else if (a !== this) for (; i < a.length; i++) this.words[i] = a.words[i];

  return this;
};

BN.prototype.add = function (num) {
  var res;
  if (num.negative !== 0 && this.negative === 0) {
    num.negative = 0;
    res = this.sub(num);
    num.negative ^= 1;
    return res;
  }
  if (num.negative === 0 && this.negative !== 0) {
    this.negative = 0;
    res = num.sub(this);
    this.negative = 1;
    return res;
  }

  return this.length > num.length ? this.clone().iadd(num) : num.clone().iadd(this);
};

BN.prototype.isub = function (num) {
  if (num.negative !== 0) {
    num.negative = 0;
    var r = this.iadd(num);
    num.negative = 1;
    return r._normSign();
  }
  if (this.negative !== 0) {
    this.negative = 0;
    this.iadd(num);
    this.negative = 1;
    return this._normSign();
  }

  var a, b,
    cmp = this.cmp(num);

  if (cmp === 0) {
    this.negative = 0;
    this.length = 1;
    this.words[0] = 0;
    return this;
  }

  if (cmp > 0) {
    a = this;
    b = num;
  } else {
    a = num;
    b = this;
  }

  var carry = 0;
  for (var i = 0; i < b.length; i++) {
    carry = (r = (a.words[i] | 0) - (b.words[i] | 0) + carry) >> 26;
    this.words[i] = r & 0x3ffffff;
  }
  for (; carry !== 0 && i < a.length; i++) {
    carry = (r = (a.words[i] | 0) + carry) >> 26;
    this.words[i] = r & 0x3ffffff;
  }

  if (carry === 0 && i < a.length && a !== this)
    for (; i < a.length; i++) this.words[i] = a.words[i];

  this.length = Math.max(this.length, i);

  if (a !== this) this.negative = 1;

  return this.strip();
};

BN.prototype.sub = function (num) {
  return this.clone().isub(num);
};

function smallMulTo(self, num, out) {
  out.negative = num.negative ^ self.negative;
  var len = (self.length + num.length) | 0;
  out.length = len;
  len = (len - 1) | 0;

  var a = self.words[0] | 0,
    b = num.words[0] | 0,
    r = a * b,

    lo = r & 0x3ffffff,
    carry = (r / 0x4000000) | 0;
  out.words[0] = lo;

  for (var k = 1; k < len; k++) {
    var ncarry = carry >>> 26,
      rword = carry & 0x3ffffff,
      maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
      var i = (k - j) | 0;
      r = (a = self.words[i] | 0) * (b = num.words[j] | 0) + rword;
      ncarry += (r / 0x4000000) | 0;
      rword = r & 0x3ffffff;
    }
    out.words[k] = rword | 0;
    carry = ncarry | 0;
  }
  carry !== 0 ? (out.words[k] = carry | 0) : out.length--;

  return out.strip();
}

var comb10MulTo = function (self, num, out) {
  var lo, mid, hi,
    a = self.words,
    b = num.words,
    o = out.words,
    c = 0,
    a0 = a[0] | 0,
    al0 = a0 & 0x1fff,
    ah0 = a0 >>> 13,
    a1 = a[1] | 0,
    al1 = a1 & 0x1fff,
    ah1 = a1 >>> 13,
    a2 = a[2] | 0,
    al2 = a2 & 0x1fff,
    ah2 = a2 >>> 13,
    a3 = a[3] | 0,
    al3 = a3 & 0x1fff,
    ah3 = a3 >>> 13,
    a4 = a[4] | 0,
    al4 = a4 & 0x1fff,
    ah4 = a4 >>> 13,
    a5 = a[5] | 0,
    al5 = a5 & 0x1fff,
    ah5 = a5 >>> 13,
    a6 = a[6] | 0,
    al6 = a6 & 0x1fff,
    ah6 = a6 >>> 13,
    a7 = a[7] | 0,
    al7 = a7 & 0x1fff,
    ah7 = a7 >>> 13,
    a8 = a[8] | 0,
    al8 = a8 & 0x1fff,
    ah8 = a8 >>> 13,
    a9 = a[9] | 0,
    al9 = a9 & 0x1fff,
    ah9 = a9 >>> 13,
    b0 = b[0] | 0,
    bl0 = b0 & 0x1fff,
    bh0 = b0 >>> 13,
    b1 = b[1] | 0,
    bl1 = b1 & 0x1fff,
    bh1 = b1 >>> 13,
    b2 = b[2] | 0,
    bl2 = b2 & 0x1fff,
    bh2 = b2 >>> 13,
    b3 = b[3] | 0,
    bl3 = b3 & 0x1fff,
    bh3 = b3 >>> 13,
    b4 = b[4] | 0,
    bl4 = b4 & 0x1fff,
    bh4 = b4 >>> 13,
    b5 = b[5] | 0,
    bl5 = b5 & 0x1fff,
    bh5 = b5 >>> 13,
    b6 = b[6] | 0,
    bl6 = b6 & 0x1fff,
    bh6 = b6 >>> 13,
    b7 = b[7] | 0,
    bl7 = b7 & 0x1fff,
    bh7 = b7 >>> 13,
    b8 = b[8] | 0,
    bl8 = b8 & 0x1fff,
    bh8 = b8 >>> 13,
    b9 = b[9] | 0,
    bl9 = b9 & 0x1fff,
    bh9 = b9 >>> 13;

  out.negative = self.negative ^ num.negative;
  out.length = 19;
  lo = Math.imul(al0, bl0);
  mid = (Math.imul(al0, bh0) + Math.imul(ah0, bl0)) | 0;
  hi = Math.imul(ah0, bh0);
  var w0 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
  w0 &= 0x3ffffff;
  lo = Math.imul(al1, bl0);
  mid = (Math.imul(al1, bh0) + Math.imul(ah1, bl0)) | 0;
  hi = Math.imul(ah1, bh0);
  lo = (lo + Math.imul(al0, bl1)) | 0;
  mid = (((mid + Math.imul(al0, bh1)) | 0) + Math.imul(ah0, bl1)) | 0;
  hi = (hi + Math.imul(ah0, bh1)) | 0;
  var w1 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
  w1 &= 0x3ffffff;
  lo = Math.imul(al2, bl0);
  mid = (Math.imul(al2, bh0) + Math.imul(ah2, bl0)) | 0;
  hi = Math.imul(ah2, bh0);
  lo = (lo + Math.imul(al1, bl1)) | 0;
  mid = (((mid + Math.imul(al1, bh1)) | 0) + Math.imul(ah1, bl1)) | 0;
  hi = (hi + Math.imul(ah1, bh1)) | 0;
  lo = (lo + Math.imul(al0, bl2)) | 0;
  mid = (((mid + Math.imul(al0, bh2)) | 0) + Math.imul(ah0, bl2)) | 0;
  hi = (hi + Math.imul(ah0, bh2)) | 0;
  var w2 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
  w2 &= 0x3ffffff;
  lo = Math.imul(al3, bl0);
  mid = (Math.imul(al3, bh0) + Math.imul(ah3, bl0)) | 0;
  hi = Math.imul(ah3, bh0);
  lo = (lo + Math.imul(al2, bl1)) | 0;
  mid = (((mid + Math.imul(al2, bh1)) | 0) + Math.imul(ah2, bl1)) | 0;
  hi = (hi + Math.imul(ah2, bh1)) | 0;
  lo = (lo + Math.imul(al1, bl2)) | 0;
  mid = (((mid + Math.imul(al1, bh2)) | 0) + Math.imul(ah1, bl2)) | 0;
  hi = (hi + Math.imul(ah1, bh2)) | 0;
  lo = (lo + Math.imul(al0, bl3)) | 0;
  mid = (((mid + Math.imul(al0, bh3)) | 0) + Math.imul(ah0, bl3)) | 0;
  hi = (hi + Math.imul(ah0, bh3)) | 0;
  var w3 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
  w3 &= 0x3ffffff;
  lo = Math.imul(al4, bl0);
  mid = (Math.imul(al4, bh0) + Math.imul(ah4, bl0)) | 0;
  hi = Math.imul(ah4, bh0);
  lo = (lo + Math.imul(al3, bl1)) | 0;
  mid = (((mid + Math.imul(al3, bh1)) | 0) + Math.imul(ah3, bl1)) | 0;
  hi = (hi + Math.imul(ah3, bh1)) | 0;
  lo = (lo + Math.imul(al2, bl2)) | 0;
  mid = (((mid + Math.imul(al2, bh2)) | 0) + Math.imul(ah2, bl2)) | 0;
  hi = (hi + Math.imul(ah2, bh2)) | 0;
  lo = (lo + Math.imul(al1, bl3)) | 0;
  mid = (((mid + Math.imul(al1, bh3)) | 0) + Math.imul(ah1, bl3)) | 0;
  hi = (hi + Math.imul(ah1, bh3)) | 0;
  lo = (lo + Math.imul(al0, bl4)) | 0;
  mid = (((mid + Math.imul(al0, bh4)) | 0) + Math.imul(ah0, bl4)) | 0;
  hi = (hi + Math.imul(ah0, bh4)) | 0;
  var w4 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
  w4 &= 0x3ffffff;
  lo = Math.imul(al5, bl0);
  mid = (Math.imul(al5, bh0) + Math.imul(ah5, bl0)) | 0;
  hi = Math.imul(ah5, bh0);
  lo = (lo + Math.imul(al4, bl1)) | 0;
  mid = (((mid + Math.imul(al4, bh1)) | 0) + Math.imul(ah4, bl1)) | 0;
  hi = (hi + Math.imul(ah4, bh1)) | 0;
  lo = (lo + Math.imul(al3, bl2)) | 0;
  mid = (((mid + Math.imul(al3, bh2)) | 0) + Math.imul(ah3, bl2)) | 0;
  hi = (hi + Math.imul(ah3, bh2)) | 0;
  lo = (lo + Math.imul(al2, bl3)) | 0;
  mid = (((mid + Math.imul(al2, bh3)) | 0) + Math.imul(ah2, bl3)) | 0;
  hi = (hi + Math.imul(ah2, bh3)) | 0;
  lo = (lo + Math.imul(al1, bl4)) | 0;
  mid = (((mid + Math.imul(al1, bh4)) | 0) + Math.imul(ah1, bl4)) | 0;
  hi = (hi + Math.imul(ah1, bh4)) | 0;
  lo = (lo + Math.imul(al0, bl5)) | 0;
  mid = (((mid + Math.imul(al0, bh5)) | 0) + Math.imul(ah0, bl5)) | 0;
  hi = (hi + Math.imul(ah0, bh5)) | 0;
  var w5 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
  w5 &= 0x3ffffff;
  lo = Math.imul(al6, bl0);
  mid = (Math.imul(al6, bh0) + Math.imul(ah6, bl0)) | 0;
  hi = Math.imul(ah6, bh0);
  lo = (lo + Math.imul(al5, bl1)) | 0;
  mid = (((mid + Math.imul(al5, bh1)) | 0) + Math.imul(ah5, bl1)) | 0;
  hi = (hi + Math.imul(ah5, bh1)) | 0;
  lo = (lo + Math.imul(al4, bl2)) | 0;
  mid = (((mid + Math.imul(al4, bh2)) | 0) + Math.imul(ah4, bl2)) | 0;
  hi = (hi + Math.imul(ah4, bh2)) | 0;
  lo = (lo + Math.imul(al3, bl3)) | 0;
  mid = (((mid + Math.imul(al3, bh3)) | 0) + Math.imul(ah3, bl3)) | 0;
  hi = (hi + Math.imul(ah3, bh3)) | 0;
  lo = (lo + Math.imul(al2, bl4)) | 0;
  mid = (((mid + Math.imul(al2, bh4)) | 0) + Math.imul(ah2, bl4)) | 0;
  hi = (hi + Math.imul(ah2, bh4)) | 0;
  lo = (lo + Math.imul(al1, bl5)) | 0;
  mid = (((mid + Math.imul(al1, bh5)) | 0) + Math.imul(ah1, bl5)) | 0;
  hi = (hi + Math.imul(ah1, bh5)) | 0;
  lo = (lo + Math.imul(al0, bl6)) | 0;
  mid = (((mid + Math.imul(al0, bh6)) | 0) + Math.imul(ah0, bl6)) | 0;
  hi = (hi + Math.imul(ah0, bh6)) | 0;
  var w6 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
  w6 &= 0x3ffffff;
  lo = Math.imul(al7, bl0);
  mid = (Math.imul(al7, bh0) + Math.imul(ah7, bl0)) | 0;
  hi = Math.imul(ah7, bh0);
  lo = (lo + Math.imul(al6, bl1)) | 0;
  mid = (((mid + Math.imul(al6, bh1)) | 0) + Math.imul(ah6, bl1)) | 0;
  hi = (hi + Math.imul(ah6, bh1)) | 0;
  lo = (lo + Math.imul(al5, bl2)) | 0;
  mid = (((mid + Math.imul(al5, bh2)) | 0) + Math.imul(ah5, bl2)) | 0;
  hi = (hi + Math.imul(ah5, bh2)) | 0;
  lo = (lo + Math.imul(al4, bl3)) | 0;
  mid = (((mid + Math.imul(al4, bh3)) | 0) + Math.imul(ah4, bl3)) | 0;
  hi = (hi + Math.imul(ah4, bh3)) | 0;
  lo = (lo + Math.imul(al3, bl4)) | 0;
  mid = (((mid + Math.imul(al3, bh4)) | 0) + Math.imul(ah3, bl4)) | 0;
  hi = (hi + Math.imul(ah3, bh4)) | 0;
  lo = (lo + Math.imul(al2, bl5)) | 0;
  mid = (((mid + Math.imul(al2, bh5)) | 0) + Math.imul(ah2, bl5)) | 0;
  hi = (hi + Math.imul(ah2, bh5)) | 0;
  lo = (lo + Math.imul(al1, bl6)) | 0;
  mid = (((mid + Math.imul(al1, bh6)) | 0) + Math.imul(ah1, bl6)) | 0;
  hi = (hi + Math.imul(ah1, bh6)) | 0;
  lo = (lo + Math.imul(al0, bl7)) | 0;
  mid = (((mid + Math.imul(al0, bh7)) | 0) + Math.imul(ah0, bl7)) | 0;
  hi = (hi + Math.imul(ah0, bh7)) | 0;
  var w7 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
  w7 &= 0x3ffffff;
  lo = Math.imul(al8, bl0);
  mid = (Math.imul(al8, bh0) + Math.imul(ah8, bl0)) | 0;
  hi = Math.imul(ah8, bh0);
  lo = (lo + Math.imul(al7, bl1)) | 0;
  mid = (((mid + Math.imul(al7, bh1)) | 0) + Math.imul(ah7, bl1)) | 0;
  hi = (hi + Math.imul(ah7, bh1)) | 0;
  lo = (lo + Math.imul(al6, bl2)) | 0;
  mid = (((mid + Math.imul(al6, bh2)) | 0) + Math.imul(ah6, bl2)) | 0;
  hi = (hi + Math.imul(ah6, bh2)) | 0;
  lo = (lo + Math.imul(al5, bl3)) | 0;
  mid = (((mid + Math.imul(al5, bh3)) | 0) + Math.imul(ah5, bl3)) | 0;
  hi = (hi + Math.imul(ah5, bh3)) | 0;
  lo = (lo + Math.imul(al4, bl4)) | 0;
  mid = (((mid + Math.imul(al4, bh4)) | 0) + Math.imul(ah4, bl4)) | 0;
  hi = (hi + Math.imul(ah4, bh4)) | 0;
  lo = (lo + Math.imul(al3, bl5)) | 0;
  mid = (((mid + Math.imul(al3, bh5)) | 0) + Math.imul(ah3, bl5)) | 0;
  hi = (hi + Math.imul(ah3, bh5)) | 0;
  lo = (lo + Math.imul(al2, bl6)) | 0;
  mid = (((mid + Math.imul(al2, bh6)) | 0) + Math.imul(ah2, bl6)) | 0;
  hi = (hi + Math.imul(ah2, bh6)) | 0;
  lo = (lo + Math.imul(al1, bl7)) | 0;
  mid = (((mid + Math.imul(al1, bh7)) | 0) + Math.imul(ah1, bl7)) | 0;
  hi = (hi + Math.imul(ah1, bh7)) | 0;
  lo = (lo + Math.imul(al0, bl8)) | 0;
  mid = (((mid + Math.imul(al0, bh8)) | 0) + Math.imul(ah0, bl8)) | 0;
  hi = (hi + Math.imul(ah0, bh8)) | 0;
  var w8 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
  w8 &= 0x3ffffff;
  lo = Math.imul(al9, bl0);
  mid = (Math.imul(al9, bh0) + Math.imul(ah9, bl0)) | 0;
  hi = Math.imul(ah9, bh0);
  lo = (lo + Math.imul(al8, bl1)) | 0;
  mid = (((mid + Math.imul(al8, bh1)) | 0) + Math.imul(ah8, bl1)) | 0;
  hi = (hi + Math.imul(ah8, bh1)) | 0;
  lo = (lo + Math.imul(al7, bl2)) | 0;
  mid = (((mid + Math.imul(al7, bh2)) | 0) + Math.imul(ah7, bl2)) | 0;
  hi = (hi + Math.imul(ah7, bh2)) | 0;
  lo = (lo + Math.imul(al6, bl3)) | 0;
  mid = (((mid + Math.imul(al6, bh3)) | 0) + Math.imul(ah6, bl3)) | 0;
  hi = (hi + Math.imul(ah6, bh3)) | 0;
  lo = (lo + Math.imul(al5, bl4)) | 0;
  mid = (((mid + Math.imul(al5, bh4)) | 0) + Math.imul(ah5, bl4)) | 0;
  hi = (hi + Math.imul(ah5, bh4)) | 0;
  lo = (lo + Math.imul(al4, bl5)) | 0;
  mid = (((mid + Math.imul(al4, bh5)) | 0) + Math.imul(ah4, bl5)) | 0;
  hi = (hi + Math.imul(ah4, bh5)) | 0;
  lo = (lo + Math.imul(al3, bl6)) | 0;
  mid = (((mid + Math.imul(al3, bh6)) | 0) + Math.imul(ah3, bl6)) | 0;
  hi = (hi + Math.imul(ah3, bh6)) | 0;
  lo = (lo + Math.imul(al2, bl7)) | 0;
  mid = (((mid + Math.imul(al2, bh7)) | 0) + Math.imul(ah2, bl7)) | 0;
  hi = (hi + Math.imul(ah2, bh7)) | 0;
  lo = (lo + Math.imul(al1, bl8)) | 0;
  mid = (((mid + Math.imul(al1, bh8)) | 0) + Math.imul(ah1, bl8)) | 0;
  hi = (hi + Math.imul(ah1, bh8)) | 0;
  lo = (lo + Math.imul(al0, bl9)) | 0;
  mid = (((mid + Math.imul(al0, bh9)) | 0) + Math.imul(ah0, bl9)) | 0;
  hi = (hi + Math.imul(ah0, bh9)) | 0;
  var w9 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
  w9 &= 0x3ffffff;
  lo = Math.imul(al9, bl1);
  mid = (Math.imul(al9, bh1) + Math.imul(ah9, bl1)) | 0;
  hi = Math.imul(ah9, bh1);
  lo = (lo + Math.imul(al8, bl2)) | 0;
  mid = (((mid + Math.imul(al8, bh2)) | 0) + Math.imul(ah8, bl2)) | 0;
  hi = (hi + Math.imul(ah8, bh2)) | 0;
  lo = (lo + Math.imul(al7, bl3)) | 0;
  mid = (((mid + Math.imul(al7, bh3)) | 0) + Math.imul(ah7, bl3)) | 0;
  hi = (hi + Math.imul(ah7, bh3)) | 0;
  lo = (lo + Math.imul(al6, bl4)) | 0;
  mid = (((mid + Math.imul(al6, bh4)) | 0) + Math.imul(ah6, bl4)) | 0;
  hi = (hi + Math.imul(ah6, bh4)) | 0;
  lo = (lo + Math.imul(al5, bl5)) | 0;
  mid = (((mid + Math.imul(al5, bh5)) | 0) + Math.imul(ah5, bl5)) | 0;
  hi = (hi + Math.imul(ah5, bh5)) | 0;
  lo = (lo + Math.imul(al4, bl6)) | 0;
  mid = (((mid + Math.imul(al4, bh6)) | 0) + Math.imul(ah4, bl6)) | 0;
  hi = (hi + Math.imul(ah4, bh6)) | 0;
  lo = (lo + Math.imul(al3, bl7)) | 0;
  mid = (((mid + Math.imul(al3, bh7)) | 0) + Math.imul(ah3, bl7)) | 0;
  hi = (hi + Math.imul(ah3, bh7)) | 0;
  lo = (lo + Math.imul(al2, bl8)) | 0;
  mid = (((mid + Math.imul(al2, bh8)) | 0) + Math.imul(ah2, bl8)) | 0;
  hi = (hi + Math.imul(ah2, bh8)) | 0;
  lo = (lo + Math.imul(al1, bl9)) | 0;
  mid = (((mid + Math.imul(al1, bh9)) | 0) + Math.imul(ah1, bl9)) | 0;
  hi = (hi + Math.imul(ah1, bh9)) | 0;
  var w10 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
  w10 &= 0x3ffffff;
  lo = Math.imul(al9, bl2);
  mid = (Math.imul(al9, bh2) + Math.imul(ah9, bl2)) | 0;
  hi = Math.imul(ah9, bh2);
  lo = (lo + Math.imul(al8, bl3)) | 0;
  mid = (((mid + Math.imul(al8, bh3)) | 0) + Math.imul(ah8, bl3)) | 0;
  hi = (hi + Math.imul(ah8, bh3)) | 0;
  lo = (lo + Math.imul(al7, bl4)) | 0;
  mid = (((mid + Math.imul(al7, bh4)) | 0) + Math.imul(ah7, bl4)) | 0;
  hi = (hi + Math.imul(ah7, bh4)) | 0;
  lo = (lo + Math.imul(al6, bl5)) | 0;
  mid = (((mid + Math.imul(al6, bh5)) | 0) + Math.imul(ah6, bl5)) | 0;
  hi = (hi + Math.imul(ah6, bh5)) | 0;
  lo = (lo + Math.imul(al5, bl6)) | 0;
  mid = (((mid + Math.imul(al5, bh6)) | 0) + Math.imul(ah5, bl6)) | 0;
  hi = (hi + Math.imul(ah5, bh6)) | 0;
  lo = (lo + Math.imul(al4, bl7)) | 0;
  mid = (((mid + Math.imul(al4, bh7)) | 0) + Math.imul(ah4, bl7)) | 0;
  hi = (hi + Math.imul(ah4, bh7)) | 0;
  lo = (lo + Math.imul(al3, bl8)) | 0;
  mid = (((mid + Math.imul(al3, bh8)) | 0) + Math.imul(ah3, bl8)) | 0;
  hi = (hi + Math.imul(ah3, bh8)) | 0;
  lo = (lo + Math.imul(al2, bl9)) | 0;
  mid = (((mid + Math.imul(al2, bh9)) | 0) + Math.imul(ah2, bl9)) | 0;
  hi = (hi + Math.imul(ah2, bh9)) | 0;
  var w11 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
  w11 &= 0x3ffffff;
  lo = Math.imul(al9, bl3);
  mid = (Math.imul(al9, bh3) + Math.imul(ah9, bl3)) | 0;
  hi = Math.imul(ah9, bh3);
  lo = (lo + Math.imul(al8, bl4)) | 0;
  mid = (((mid + Math.imul(al8, bh4)) | 0) + Math.imul(ah8, bl4)) | 0;
  hi = (hi + Math.imul(ah8, bh4)) | 0;
  lo = (lo + Math.imul(al7, bl5)) | 0;
  mid = (((mid + Math.imul(al7, bh5)) | 0) + Math.imul(ah7, bl5)) | 0;
  hi = (hi + Math.imul(ah7, bh5)) | 0;
  lo = (lo + Math.imul(al6, bl6)) | 0;
  mid = (((mid + Math.imul(al6, bh6)) | 0) + Math.imul(ah6, bl6)) | 0;
  hi = (hi + Math.imul(ah6, bh6)) | 0;
  lo = (lo + Math.imul(al5, bl7)) | 0;
  mid = (((mid + Math.imul(al5, bh7)) | 0) + Math.imul(ah5, bl7)) | 0;
  hi = (hi + Math.imul(ah5, bh7)) | 0;
  lo = (lo + Math.imul(al4, bl8)) | 0;
  mid = (((mid + Math.imul(al4, bh8)) | 0) + Math.imul(ah4, bl8)) | 0;
  hi = (hi + Math.imul(ah4, bh8)) | 0;
  lo = (lo + Math.imul(al3, bl9)) | 0;
  mid = (((mid + Math.imul(al3, bh9)) | 0) + Math.imul(ah3, bl9)) | 0;
  hi = (hi + Math.imul(ah3, bh9)) | 0;
  var w12 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
  w12 &= 0x3ffffff;
  lo = Math.imul(al9, bl4);
  mid = (Math.imul(al9, bh4) + Math.imul(ah9, bl4)) | 0;
  hi = Math.imul(ah9, bh4);
  lo = (lo + Math.imul(al8, bl5)) | 0;
  mid = (((mid + Math.imul(al8, bh5)) | 0) + Math.imul(ah8, bl5)) | 0;
  hi = (hi + Math.imul(ah8, bh5)) | 0;
  lo = (lo + Math.imul(al7, bl6)) | 0;
  mid = (((mid + Math.imul(al7, bh6)) | 0) + Math.imul(ah7, bl6)) | 0;
  hi = (hi + Math.imul(ah7, bh6)) | 0;
  lo = (lo + Math.imul(al6, bl7)) | 0;
  mid = (((mid + Math.imul(al6, bh7)) | 0) + Math.imul(ah6, bl7)) | 0;
  hi = (hi + Math.imul(ah6, bh7)) | 0;
  lo = (lo + Math.imul(al5, bl8)) | 0;
  mid = (((mid + Math.imul(al5, bh8)) | 0) + Math.imul(ah5, bl8)) | 0;
  hi = (hi + Math.imul(ah5, bh8)) | 0;
  lo = (lo + Math.imul(al4, bl9)) | 0;
  mid = (((mid + Math.imul(al4, bh9)) | 0) + Math.imul(ah4, bl9)) | 0;
  hi = (hi + Math.imul(ah4, bh9)) | 0;
  var w13 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
  w13 &= 0x3ffffff;
  lo = Math.imul(al9, bl5);
  mid = (Math.imul(al9, bh5) + Math.imul(ah9, bl5)) | 0;
  hi = Math.imul(ah9, bh5);
  lo = (lo + Math.imul(al8, bl6)) | 0;
  mid = (((mid + Math.imul(al8, bh6)) | 0) + Math.imul(ah8, bl6)) | 0;
  hi = (hi + Math.imul(ah8, bh6)) | 0;
  lo = (lo + Math.imul(al7, bl7)) | 0;
  mid = (((mid + Math.imul(al7, bh7)) | 0) + Math.imul(ah7, bl7)) | 0;
  hi = (hi + Math.imul(ah7, bh7)) | 0;
  lo = (lo + Math.imul(al6, bl8)) | 0;
  mid = (((mid + Math.imul(al6, bh8)) | 0) + Math.imul(ah6, bl8)) | 0;
  hi = (hi + Math.imul(ah6, bh8)) | 0;
  lo = (lo + Math.imul(al5, bl9)) | 0;
  mid = (((mid + Math.imul(al5, bh9)) | 0) + Math.imul(ah5, bl9)) | 0;
  hi = (hi + Math.imul(ah5, bh9)) | 0;
  var w14 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
  w14 &= 0x3ffffff;
  lo = Math.imul(al9, bl6);
  mid = (Math.imul(al9, bh6) + Math.imul(ah9, bl6)) | 0;
  hi = Math.imul(ah9, bh6);
  lo = (lo + Math.imul(al8, bl7)) | 0;
  mid = (((mid + Math.imul(al8, bh7)) | 0) + Math.imul(ah8, bl7)) | 0;
  hi = (hi + Math.imul(ah8, bh7)) | 0;
  lo = (lo + Math.imul(al7, bl8)) | 0;
  mid = (((mid + Math.imul(al7, bh8)) | 0) + Math.imul(ah7, bl8)) | 0;
  hi = (hi + Math.imul(ah7, bh8)) | 0;
  lo = (lo + Math.imul(al6, bl9)) | 0;
  mid = (((mid + Math.imul(al6, bh9)) | 0) + Math.imul(ah6, bl9)) | 0;
  hi = (hi + Math.imul(ah6, bh9)) | 0;
  var w15 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
  w15 &= 0x3ffffff;
  lo = Math.imul(al9, bl7);
  mid = (Math.imul(al9, bh7) + Math.imul(ah9, bl7)) | 0;
  hi = Math.imul(ah9, bh7);
  lo = (lo + Math.imul(al8, bl8)) | 0;
  mid = (((mid + Math.imul(al8, bh8)) | 0) + Math.imul(ah8, bl8)) | 0;
  hi = (hi + Math.imul(ah8, bh8)) | 0;
  lo = (lo + Math.imul(al7, bl9)) | 0;
  mid = (((mid + Math.imul(al7, bh9)) | 0) + Math.imul(ah7, bl9)) | 0;
  hi = (hi + Math.imul(ah7, bh9)) | 0;
  var w16 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
  w16 &= 0x3ffffff;
  lo = Math.imul(al9, bl8);
  mid = (Math.imul(al9, bh8) + Math.imul(ah9, bl8)) | 0;
  hi = Math.imul(ah9, bh8);
  lo = (lo + Math.imul(al8, bl9)) | 0;
  mid = (((mid + Math.imul(al8, bh9)) | 0) + Math.imul(ah8, bl9)) | 0;
  hi = (hi + Math.imul(ah8, bh9)) | 0;
  var w17 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
  w17 &= 0x3ffffff;
  lo = Math.imul(al9, bl9);
  mid = (Math.imul(al9, bh9) + Math.imul(ah9, bl9)) | 0;
  hi = Math.imul(ah9, bh9);
  var w18 = (((c + lo) | 0) + ((0x1fff & mid) << 13)) | 0;
  c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
  w18 &= 0x3ffffff;
  o[0] = w0;
  o[1] = w1;
  o[2] = w2;
  o[3] = w3;
  o[4] = w4;
  o[5] = w5;
  o[6] = w6;
  o[7] = w7;
  o[8] = w8;
  o[9] = w9;
  o[10] = w10;
  o[11] = w11;
  o[12] = w12;
  o[13] = w13;
  o[14] = w14;
  o[15] = w15;
  o[16] = w16;
  o[17] = w17;
  o[18] = w18;
  if (c !== 0) {
    o[19] = c;
    out.length++;
  }
  return out;
};

Math.imul || (comb10MulTo = smallMulTo);

function bigMulTo(self, num, out) {
  out.negative = num.negative ^ self.negative;
  out.length = self.length + num.length;

  var carry = 0;
  for (var hncarry = 0, k = 0; k < out.length - 1; k++) {
    var ncarry = hncarry;
    hncarry = 0;
    var rword = carry & 0x3ffffff,
      maxJ = Math.min(k, num.length - 1);
    for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
      var i = k - j,
        r = (self.words[i] | 0) * (num.words[j] | 0),

        lo = r & 0x3ffffff;
      ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
      rword = 0x3ffffff & (lo = (lo + rword) | 0);

      hncarry += (ncarry = (ncarry + (lo >>> 26)) | 0) >>> 26;
      ncarry &= 0x3ffffff;
    }
    out.words[k] = rword;
    carry = ncarry;
    ncarry = hncarry;
  }
  carry !== 0 ? (out.words[k] = carry) : out.length--;

  return out.strip();
}

function jumboMulTo(self, num, out) {
  return new FFTM().mulp(self, num, out);
}

BN.prototype.mulTo = function (num, out) {
  var len = this.length + num.length;

  return this.length === 10 && num.length === 10
    ? comb10MulTo(this, num, out)
    : len < 63
    ? smallMulTo(this, num, out)
    : len < 1024
    ? bigMulTo(this, num, out)
    : jumboMulTo(this, num, out);
};

function FFTM(x, y) {
  this.x = x;
  this.y = y;
}

FFTM.prototype.makeRBT = function (N) {
  var t = new Array(N);
  for (var l = BN.prototype._countBits(N) - 1, i = 0; i < N; i++)
    t[i] = this.revBin(i, l, N);

  return t;
};

FFTM.prototype.revBin = function (x, l, N) {
  if (x === 0 || x === N - 1) return x;

  var rb = 0;
  for (var i = 0; i < l; i++) {
    rb |= (x & 1) << (l - i - 1);
    x >>= 1;
  }

  return rb;
};

FFTM.prototype.permute = function (rbt, rws, iws, rtws, itws, N) {
  for (var i = 0; i < N; i++) {
    rtws[i] = rws[rbt[i]];
    itws[i] = iws[rbt[i]];
  }
};

FFTM.prototype.transform = function (rws, iws, rtws, itws, N, rbt) {
  this.permute(rbt, rws, iws, rtws, itws, N);

  for (var s = 1; s < N; s <<= 1) {
    var l = s << 1,

      rtwdf = Math.cos((2 * Math.PI) / l),
      itwdf = Math.sin((2 * Math.PI) / l);

    for (var p = 0; p < N; p += l)
      for (var rtwdf_ = rtwdf, itwdf_ = itwdf, j = 0; j < s; j++) {
        var re = rtws[p + j],
          ie = itws[p + j],

          ro = rtws[p + j + s],
          io = itws[p + j + s],

          rx = rtwdf_ * ro - itwdf_ * io;

        io = rtwdf_ * io + itwdf_ * ro;
        ro = rx;

        rtws[p + j] = re + ro;
        itws[p + j] = ie + io;

        rtws[p + j + s] = re - ro;
        itws[p + j + s] = ie - io;

        if (j !== l) {
          rx = rtwdf * rtwdf_ - itwdf * itwdf_;

          itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
          rtwdf_ = rx;
        }
      }
  }
};

FFTM.prototype.guessLen13b = function (n, m) {
  var N = Math.max(m, n) | 1,
    odd = N & 1,
    i = 0;
  for (N = (N / 2) | 0; N; N >>>= 1) i++;

  return 1 << (i + 1 + odd);
};

FFTM.prototype.conjugate = function (rws, iws, N) {
  if (N <= 1) return;

  for (var i = 0; i < N / 2; i++) {
    var t = rws[i];

    rws[i] = rws[N - i - 1];
    rws[N - i - 1] = t;

    t = iws[i];

    iws[i] = -iws[N - i - 1];
    iws[N - i - 1] = -t;
  }
};

FFTM.prototype.normalize13b = function (ws, N) {
  for (var carry = 0, i = 0; i < N / 2; i++) {
    var w =
      Math.round(ws[2 * i + 1] / N) * 0x2000 + Math.round(ws[2 * i] / N) + carry;

    ws[i] = w & 0x3ffffff;

    carry = w < 0x4000000 ? 0 : (w / 0x4000000) | 0;
  }

  return ws;
};

FFTM.prototype.convert13b = function (ws, len, rws, N) {
  var carry = 0;
  for (var i = 0; i < len; i++) {
    carry += ws[i] | 0;

    rws[2 * i] = carry & 0x1fff;
    carry >>>= 13;
    rws[2 * i + 1] = carry & 0x1fff;
    carry >>>= 13;
  }

  for (i = 2 * len; i < N; ++i) rws[i] = 0;

  assert(carry === 0);
  assert((carry & ~0x1fff) == 0);
};

FFTM.prototype.stub = function (N) {
  var ph = new Array(N);
  for (var i = 0; i < N; i++) ph[i] = 0;

  return ph;
};

FFTM.prototype.mulp = function (x, y, out) {
  var N = 2 * this.guessLen13b(x.length, y.length),

    rbt = this.makeRBT(N),

    _ = this.stub(N),

    rws = new Array(N),
    rwst = new Array(N),
    iwst = new Array(N),

    nrws = new Array(N),
    nrwst = new Array(N),
    niwst = new Array(N),

    rmws = out.words;
  rmws.length = N;

  this.convert13b(x.words, x.length, rws, N);
  this.convert13b(y.words, y.length, nrws, N);

  this.transform(rws, _, rwst, iwst, N, rbt);
  this.transform(nrws, _, nrwst, niwst, N, rbt);

  for (var i = 0; i < N; i++) {
    var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
    iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
    rwst[i] = rx;
  }

  this.conjugate(rwst, iwst, N);
  this.transform(rwst, iwst, rmws, _, N, rbt);
  this.conjugate(rmws, _, N);
  this.normalize13b(rmws, N);

  out.negative = x.negative ^ y.negative;
  out.length = x.length + y.length;
  return out.strip();
};

BN.prototype.mul = function (num) {
  var out = new BN(null);
  out.words = new Array(this.length + num.length);
  return this.mulTo(num, out);
};

BN.prototype.mulf = function (num) {
  var out = new BN(null);
  out.words = new Array(this.length + num.length);
  return jumboMulTo(this, num, out);
};

BN.prototype.imul = function (num) {
  return this.clone().mulTo(num, this);
};

BN.prototype.imuln = function (num) {
  assert(typeof num == 'number');
  assert(num < 0x4000000);

  var carry = 0;
  for (var i = 0; i < this.length; i++) {
    var w = (this.words[i] | 0) * num,
      lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
    carry >>= 26;
    carry += (w / 0x4000000) | 0;
    carry += lo >>> 26;
    this.words[i] = lo & 0x3ffffff;
  }

  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }

  return this;
};

BN.prototype.muln = function (num) {
  return this.clone().imuln(num);
};

BN.prototype.sqr = function () {
  return this.mul(this);
};

BN.prototype.isqr = function () {
  return this.imul(this.clone());
};

BN.prototype.pow = function (num) {
  var w = toBitArray(num);
  if (w.length === 0) return new BN(1);

  var res = this;
  for (var i = 0; i < w.length && w[i] === 0; i++, res = res.sqr());

  if (++i < w.length)
    for (var q = res.sqr(); i < w.length; i++, q = q.sqr())
      if (w[i] !== 0) res = res.mul(q);

  return res;
};

BN.prototype.iushln = function (bits) {
  assert(typeof bits == 'number' && bits >= 0);
  var i,
    r = bits % 26,
    s = (bits - r) / 26,
    carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);

  if (r !== 0) {
    var carry = 0;

    for (i = 0; i < this.length; i++) {
      var newCarry = this.words[i] & carryMask,
        c = ((this.words[i] | 0) - newCarry) << r;
      this.words[i] = c | carry;
      carry = newCarry >>> (26 - r);
    }

    if (carry) {
      this.words[i] = carry;
      this.length++;
    }
  }

  if (s !== 0) {
    for (i = this.length - 1; i >= 0; i--) this.words[i + s] = this.words[i];

    for (i = 0; i < s; i++) this.words[i] = 0;

    this.length += s;
  }

  return this.strip();
};

BN.prototype.ishln = function (bits) {
  assert(this.negative === 0);
  return this.iushln(bits);
};

BN.prototype.iushrn = function (bits, hint, extended) {
  assert(typeof bits == 'number' && bits >= 0);
  var h = hint ? (hint - (hint % 26)) / 26 : 0,

    r = bits % 26,
    s = Math.min((bits - r) / 26, this.length),
    mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r),
    maskedWords = extended;

  h -= s;
  h = Math.max(0, h);

  if (maskedWords) {
    for (var i = 0; i < s; i++) maskedWords.words[i] = this.words[i];

    maskedWords.length = s;
  }

  if (s === 0);
  else if (this.length > s) {
    this.length -= s;
    for (i = 0; i < this.length; i++) this.words[i] = this.words[i + s];
  } else {
    this.words[0] = 0;
    this.length = 1;
  }

  var carry = 0;
  for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
    var word = this.words[i] | 0;
    this.words[i] = (carry << (26 - r)) | (word >>> r);
    carry = word & mask;
  }

  if (maskedWords && carry !== 0) maskedWords.words[maskedWords.length++] = carry;

  if (this.length === 0) {
    this.words[0] = 0;
    this.length = 1;
  }

  return this.strip();
};

BN.prototype.ishrn = function (bits, hint, extended) {
  assert(this.negative === 0);
  return this.iushrn(bits, hint, extended);
};

BN.prototype.shln = function (bits) {
  return this.clone().ishln(bits);
};

BN.prototype.ushln = function (bits) {
  return this.clone().iushln(bits);
};

BN.prototype.shrn = function (bits) {
  return this.clone().ishrn(bits);
};

BN.prototype.ushrn = function (bits) {
  return this.clone().iushrn(bits);
};

BN.prototype.testn = function (bit) {
  assert(typeof bit == 'number' && bit >= 0);
  var r = bit % 26,
    s = (bit - r) / 26,
    q = 1 << r;

  return !(this.length <= s || !(this.words[s] & q));
};

BN.prototype.imaskn = function (bits) {
  assert(typeof bits == 'number' && bits >= 0);
  var r = bits % 26,
    s = (bits - r) / 26;

  assert(this.negative === 0, 'imaskn works only with positive numbers');

  if (this.length <= s) return this;

  r === 0 || s++;

  this.length = Math.min(s, this.length);

  if (r !== 0) {
    var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
    this.words[this.length - 1] &= mask;
  }

  return this.strip();
};

BN.prototype.maskn = function (bits) {
  return this.clone().imaskn(bits);
};

BN.prototype.iaddn = function (num) {
  assert(typeof num == 'number');
  assert(num < 0x4000000);
  if (num < 0) return this.isubn(-num);

  if (this.negative !== 0) {
    if (this.length === 1 && (this.words[0] | 0) < num) {
      this.words[0] = num - (this.words[0] | 0);
      this.negative = 0;
      return this;
    }

    this.negative = 0;
    this.isubn(num);
    this.negative = 1;
    return this;
  }

  return this._iaddn(num);
};

BN.prototype._iaddn = function (num) {
  this.words[0] += num;

  for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
    this.words[i] -= 0x4000000;
    i === this.length - 1 ? (this.words[i + 1] = 1) : this.words[i + 1]++;
  }
  this.length = Math.max(this.length, i + 1);

  return this;
};

BN.prototype.isubn = function (num) {
  assert(typeof num == 'number');
  assert(num < 0x4000000);
  if (num < 0) return this.iaddn(-num);

  if (this.negative !== 0) {
    this.negative = 0;
    this.iaddn(num);
    this.negative = 1;
    return this;
  }

  this.words[0] -= num;

  if (this.length === 1 && this.words[0] < 0) {
    this.words[0] = -this.words[0];
    this.negative = 1;
  } else
    for (var i = 0; i < this.length && this.words[i] < 0; i++) {
      this.words[i] += 0x4000000;
      this.words[i + 1] -= 1;
    }

  return this.strip();
};

BN.prototype.addn = function (num) {
  return this.clone().iaddn(num);
};

BN.prototype.subn = function (num) {
  return this.clone().isubn(num);
};

BN.prototype.iabs = function () {
  this.negative = 0;

  return this;
};

BN.prototype.abs = function () {
  return this.clone().iabs();
};

BN.prototype._ishlnsubmul = function (num, mul, shift) {
  var i, w,
    len = num.length + shift;

  this._expand(len);

  var carry = 0;
  for (i = 0; i < num.length; i++) {
    w = (this.words[i + shift] | 0) + carry;
    var right = (num.words[i] | 0) * mul;
    carry = ((w -= right & 0x3ffffff) >> 26) - ((right / 0x4000000) | 0);
    this.words[i + shift] = w & 0x3ffffff;
  }
  for (; i < this.length - shift; i++) {
    carry = (w = (this.words[i + shift] | 0) + carry) >> 26;
    this.words[i + shift] = w & 0x3ffffff;
  }

  if (carry === 0) return this.strip();

  assert(carry === -1);
  carry = 0;
  for (i = 0; i < this.length; i++) {
    carry = (w = -(this.words[i] | 0) + carry) >> 26;
    this.words[i] = w & 0x3ffffff;
  }
  this.negative = 1;

  return this.strip();
};

BN.prototype._wordDiv = function (num, mode) {
  var shift = this.length - num.length,

    a = this.clone(),
    b = num,

    bhi = b.words[b.length - 1] | 0;
  if ((shift = 26 - this._countBits(bhi)) != 0) {
    b = b.ushln(shift);
    a.iushln(shift);
    bhi = b.words[b.length - 1] | 0;
  }

  var q,
    m = a.length - b.length;

  if (mode !== 'mod') {
    (q = new BN(null)).length = m + 1;
    q.words = new Array(q.length);
    for (var i = 0; i < q.length; i++) q.words[i] = 0;
  }

  var diff = a.clone()._ishlnsubmul(b, 1, m);
  if (diff.negative === 0) {
    a = diff;
    if (q) q.words[m] = 1;
  }

  for (var j = m - 1; j >= 0; j--) {
    var qj =
      0x4000000 * (a.words[b.length + j] | 0) + (a.words[b.length + j - 1] | 0);

    qj = Math.min((qj / bhi) | 0, 0x3ffffff);

    a._ishlnsubmul(b, qj, j);
    while (a.negative !== 0) {
      qj--;
      a.negative = 0;
      a._ishlnsubmul(b, 1, j);
      a.isZero() || (a.negative ^= 1);
    }
    if (q) q.words[j] = qj;
  }
  q && q.strip();

  a.strip();

  mode === 'div' || shift === 0 || a.iushrn(shift);

  return { div: q || null, mod: a };
};

BN.prototype.divmod = function (num, mode, positive) {
  assert(!num.isZero());

  if (this.isZero()) return { div: new BN(0), mod: new BN(0) };

  var div, mod, res;
  if (this.negative !== 0 && num.negative === 0) {
    res = this.neg().divmod(num, mode);

    if (mode !== 'mod') div = res.div.neg();

    if (mode !== 'div') {
      mod = res.mod.neg();
      positive && mod.negative !== 0 && mod.iadd(num);
    }

    return { div: div, mod: mod };
  }

  if (this.negative === 0 && num.negative !== 0) {
    res = this.divmod(num.neg(), mode);

    if (mode !== 'mod') div = res.div.neg();

    return { div: div, mod: res.mod };
  }

  if ((this.negative & num.negative) != 0) {
    res = this.neg().divmod(num.neg(), mode);

    if (mode !== 'div') {
      mod = res.mod.neg();
      positive && mod.negative !== 0 && mod.isub(num);
    }

    return { div: res.div, mod: mod };
  }

  return num.length > this.length || this.cmp(num) < 0
    ? { div: new BN(0), mod: this }
    : num.length !== 1
    ? this._wordDiv(num, mode)
    : mode === 'div'
    ? { div: this.divn(num.words[0]), mod: null }
    : mode === 'mod'
    ? { div: null, mod: new BN(this.modn(num.words[0])) }
    : { div: this.divn(num.words[0]), mod: new BN(this.modn(num.words[0])) };
};

BN.prototype.div = function (num) {
  return this.divmod(num, 'div', false).div;
};

BN.prototype.mod = function (num) {
  return this.divmod(num, 'mod', false).mod;
};

BN.prototype.umod = function (num) {
  return this.divmod(num, 'mod', true).mod;
};

BN.prototype.divRound = function (num) {
  var dm = this.divmod(num);

  if (dm.mod.isZero()) return dm.div;

  var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod,

    half = num.ushrn(1),
    r2 = num.andln(1),
    cmp = mod.cmp(half);

  return cmp < 0 || (r2 === 1 && cmp === 0) ? dm.div
    : dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
};

BN.prototype.modn = function (num) {
  assert(num <= 0x3ffffff);

  var acc = 0;
  for (var p = (1 << 26) % num, i = this.length - 1; i >= 0; i--)
    acc = (p * acc + (this.words[i] | 0)) % num;

  return acc;
};

BN.prototype.idivn = function (num) {
  assert(num <= 0x3ffffff);

  for (var carry = 0, i = this.length - 1; i >= 0; i--) {
    var w = (this.words[i] | 0) + carry * 0x4000000;
    this.words[i] = (w / num) | 0;
    carry = w % num;
  }

  return this.strip();
};

BN.prototype.divn = function (num) {
  return this.clone().idivn(num);
};

BN.prototype.egcd = function (p) {
  assert(p.negative === 0);
  assert(!p.isZero());

  var x = this,
    y = p.clone();

  x = x.negative !== 0 ? x.umod(p) : x.clone();

  var A = new BN(1),
    B = new BN(0),

    C = new BN(0),
    D = new BN(1),

    g = 0;

  while (x.isEven() && y.isEven()) {
    x.iushrn(1);
    y.iushrn(1);
    ++g;
  }

  for (var yp = y.clone(), xp = x.clone(); !x.isZero(); ) {
    for (var i = 0, im = 1; (x.words[0] & im) == 0 && i < 26; ++i, im <<= 1);
    if (i > 0) {
      x.iushrn(i);
      while (i-- > 0) {
        if (A.isOdd() || B.isOdd()) {
          A.iadd(yp);
          B.isub(xp);
        }

        A.iushrn(1);
        B.iushrn(1);
      }
    }

    for (var j = 0, jm = 1; (y.words[0] & jm) == 0 && j < 26; ++j, jm <<= 1);
    if (j > 0) {
      y.iushrn(j);
      while (j-- > 0) {
        if (C.isOdd() || D.isOdd()) {
          C.iadd(yp);
          D.isub(xp);
        }

        C.iushrn(1);
        D.iushrn(1);
      }
    }

    if (x.cmp(y) >= 0) {
      x.isub(y);
      A.isub(C);
      B.isub(D);
    } else {
      y.isub(x);
      C.isub(A);
      D.isub(B);
    }
  }

  return { a: C, b: D, gcd: y.iushln(g) };
};

BN.prototype._invmp = function (p) {
  assert(p.negative === 0);
  assert(!p.isZero());

  var a = this,
    b = p.clone();

  a = a.negative !== 0 ? a.umod(p) : a.clone();

  var x1 = new BN(1),
    x2 = new BN(0);

  for (var delta = b.clone(); a.cmpn(1) > 0 && b.cmpn(1) > 0; ) {
    for (var i = 0, im = 1; (a.words[0] & im) == 0 && i < 26; ++i, im <<= 1);
    if (i > 0) {
      a.iushrn(i);
      while (i-- > 0) {
        x1.isOdd() && x1.iadd(delta);

        x1.iushrn(1);
      }
    }

    for (var j = 0, jm = 1; (b.words[0] & jm) == 0 && j < 26; ++j, jm <<= 1);
    if (j > 0) {
      b.iushrn(j);
      while (j-- > 0) {
        x2.isOdd() && x2.iadd(delta);

        x2.iushrn(1);
      }
    }

    if (a.cmp(b) >= 0) {
      a.isub(b);
      x1.isub(x2);
    } else {
      b.isub(a);
      x2.isub(x1);
    }
  }

  var res = a.cmpn(1) === 0 ? x1 : x2;

  res.cmpn(0) < 0 && res.iadd(p);

  return res;
};

BN.prototype.gcd = function (num) {
  if (this.isZero()) return num.abs();
  if (num.isZero()) return this.abs();

  var a = this.clone(),
    b = num.clone();
  a.negative = 0;
  b.negative = 0;

  for (var shift = 0; a.isEven() && b.isEven(); shift++) {
    a.iushrn(1);
    b.iushrn(1);
  }

  while (1) {
    while (a.isEven()) a.iushrn(1);
    while (b.isEven()) b.iushrn(1);

    var r = a.cmp(b);
    if (r < 0) {
      var t = a;
      a = b;
      b = t;
    } else if (r === 0 || b.cmpn(1) === 0) break;

    a.isub(b);
  }

  return b.iushln(shift);
};

BN.prototype.invm = function (num) {
  return this.egcd(num).a.umod(num);
};

BN.prototype.isEven = function () {
  return (this.words[0] & 1) == 0;
};

BN.prototype.isOdd = function () {
  return (this.words[0] & 1) == 1;
};

BN.prototype.andln = function (num) {
  return this.words[0] & num;
};

BN.prototype.bincn = function (bit) {
  assert(typeof bit == 'number');
  var r = bit % 26,
    s = (bit - r) / 26,
    q = 1 << r;

  if (this.length <= s) {
    this._expand(s + 1);
    this.words[s] |= q;
    return this;
  }

  var carry = q;
  for (var i = s; carry !== 0 && i < this.length; i++) {
    var w = this.words[i] | 0;
    carry = (w += carry) >>> 26;
    w &= 0x3ffffff;
    this.words[i] = w;
  }
  if (carry !== 0) {
    this.words[i] = carry;
    this.length++;
  }
  return this;
};

BN.prototype.isZero = function () {
  return this.length === 1 && this.words[0] === 0;
};

BN.prototype.cmpn = function (num) {
  var res,
    negative = num < 0;

  if (this.negative !== 0 && !negative) return -1;
  if (this.negative === 0 && negative) return 1;

  this.strip();

  if (this.length > 1) res = 1;
  else {
    if (negative) num = -num;

    assert(num <= 0x3ffffff, 'Number is too big');

    var w = this.words[0] | 0;
    res = w === num ? 0 : w < num ? -1 : 1;
  }
  return this.negative !== 0 ? 0 | -res : res;
};

BN.prototype.cmp = function (num) {
  if (this.negative !== 0 && num.negative === 0) return -1;
  if (this.negative === 0 && num.negative !== 0) return 1;

  var res = this.ucmp(num);
  return this.negative !== 0 ? 0 | -res : res;
};

BN.prototype.ucmp = function (num) {
  if (this.length > num.length) return 1;
  if (this.length < num.length) return -1;

  var res = 0;
  for (var i = this.length - 1; i >= 0; i--) {
    var a = this.words[i] | 0,
      b = num.words[i] | 0;

    if (a === b) continue;
    a < b ? (res = -1) : a > b && (res = 1);

    break;
  }
  return res;
};

BN.prototype.gtn = function (num) {
  return this.cmpn(num) === 1;
};

BN.prototype.gt = function (num) {
  return this.cmp(num) === 1;
};

BN.prototype.gten = function (num) {
  return this.cmpn(num) >= 0;
};

BN.prototype.gte = function (num) {
  return this.cmp(num) >= 0;
};

BN.prototype.ltn = function (num) {
  return this.cmpn(num) === -1;
};

BN.prototype.lt = function (num) {
  return this.cmp(num) === -1;
};

BN.prototype.lten = function (num) {
  return this.cmpn(num) <= 0;
};

BN.prototype.lte = function (num) {
  return this.cmp(num) <= 0;
};

BN.prototype.eqn = function (num) {
  return this.cmpn(num) === 0;
};

BN.prototype.eq = function (num) {
  return this.cmp(num) === 0;
};

BN.red = function (num) {
  return new Red(num);
};

BN.prototype.toRed = function (ctx) {
  assert(!this.red, 'Already a number in reduction context');
  assert(this.negative === 0, 'red works only with positives');
  return ctx.convertTo(this)._forceRed(ctx);
};

BN.prototype.fromRed = function () {
  assert(this.red, 'fromRed works only with numbers in reduction context');
  return this.red.convertFrom(this);
};

BN.prototype._forceRed = function (ctx) {
  this.red = ctx;
  return this;
};

BN.prototype.forceRed = function (ctx) {
  assert(!this.red, 'Already a number in reduction context');
  return this._forceRed(ctx);
};

BN.prototype.redAdd = function (num) {
  assert(this.red, 'redAdd works only with red numbers');
  return this.red.add(this, num);
};

BN.prototype.redIAdd = function (num) {
  assert(this.red, 'redIAdd works only with red numbers');
  return this.red.iadd(this, num);
};

BN.prototype.redSub = function (num) {
  assert(this.red, 'redSub works only with red numbers');
  return this.red.sub(this, num);
};

BN.prototype.redISub = function (num) {
  assert(this.red, 'redISub works only with red numbers');
  return this.red.isub(this, num);
};

BN.prototype.redShl = function (num) {
  assert(this.red, 'redShl works only with red numbers');
  return this.red.shl(this, num);
};

BN.prototype.redMul = function (num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.mul(this, num);
};

BN.prototype.redIMul = function (num) {
  assert(this.red, 'redMul works only with red numbers');
  this.red._verify2(this, num);
  return this.red.imul(this, num);
};

BN.prototype.redSqr = function () {
  assert(this.red, 'redSqr works only with red numbers');
  this.red._verify1(this);
  return this.red.sqr(this);
};

BN.prototype.redISqr = function () {
  assert(this.red, 'redISqr works only with red numbers');
  this.red._verify1(this);
  return this.red.isqr(this);
};

BN.prototype.redSqrt = function () {
  assert(this.red, 'redSqrt works only with red numbers');
  this.red._verify1(this);
  return this.red.sqrt(this);
};

BN.prototype.redInvm = function () {
  assert(this.red, 'redInvm works only with red numbers');
  this.red._verify1(this);
  return this.red.invm(this);
};

BN.prototype.redNeg = function () {
  assert(this.red, 'redNeg works only with red numbers');
  this.red._verify1(this);
  return this.red.neg(this);
};

BN.prototype.redPow = function (num) {
  assert(this.red && !num.red, 'redPow(normalNum)');
  this.red._verify1(this);
  return this.red.pow(this, num);
};

var primes = { k256: null, p224: null, p192: null, p25519: null };

function MPrime(name, p) {
  this.name = name;
  this.p = new BN(p, 16);
  this.n = this.p.bitLength();
  this.k = new BN(1).iushln(this.n).isub(this.p);

  this.tmp = this._tmp();
}

MPrime.prototype._tmp = function () {
  var tmp = new BN(null);
  tmp.words = new Array(Math.ceil(this.n / 13));
  return tmp;
};

MPrime.prototype.ireduce = function (num) {
  var rlen,
    r = num;

  do {
    this.split(r, this.tmp);
    rlen = (r = this.imulK(r).iadd(this.tmp)).bitLength();
  } while (rlen > this.n);

  var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
  if (cmp === 0) {
    r.words[0] = 0;
    r.length = 1;
  } else cmp > 0 ? r.isub(this.p) : r.strip !== void 0 ? r.strip() : r._strip();

  return r;
};

MPrime.prototype.split = function (input, out) {
  input.iushrn(this.n, 0, out);
};

MPrime.prototype.imulK = function (num) {
  return num.imul(this.k);
};

function K256() {
  MPrime.call(
    this,
    'k256',
    'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f'
  );
}
inherits(K256, MPrime);

K256.prototype.split = function (input, output) {
  var mask = 0x3fffff,

    outLen = Math.min(input.length, 9);
  for (var i = 0; i < outLen; i++) output.words[i] = input.words[i];

  output.length = outLen;

  if (input.length <= 9) {
    input.words[0] = 0;
    input.length = 1;
    return;
  }

  var prev = input.words[9];
  output.words[output.length++] = prev & mask;

  for (i = 10; i < input.length; i++) {
    var next = input.words[i] | 0;
    input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
    prev = next;
  }
  prev >>>= 22;
  input.words[i - 10] = prev;
  input.length -= prev === 0 && input.length > 10 ? 10 : 9;
};

K256.prototype.imulK = function (num) {
  num.words[num.length] = 0;
  num.words[num.length + 1] = 0;
  num.length += 2;

  for (var lo = 0, i = 0; i < num.length; i++) {
    var w = num.words[i] | 0;
    lo += w * 0x3d1;
    num.words[i] = lo & 0x3ffffff;
    lo = w * 0x40 + ((lo / 0x4000000) | 0);
  }

  if (num.words[num.length - 1] === 0) {
    num.length--;
    num.words[num.length - 1] !== 0 || num.length--;
  }
  return num;
};

function P224() {
  MPrime.call(
    this, 'p224', 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001'
  );
}
inherits(P224, MPrime);

function P192() {
  MPrime.call(this, 'p192', 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
}
inherits(P192, MPrime);

function P25519() {
  MPrime.call(
    this,
    '25519',
    '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed'
  );
}
inherits(P25519, MPrime);

P25519.prototype.imulK = function (num) {
  var carry = 0;
  for (var i = 0; i < num.length; i++) {
    var hi = 0x13 * (num.words[i] | 0) + carry,
      lo = hi & 0x3ffffff;
    hi >>>= 26;

    num.words[i] = lo;
    carry = hi;
  }
  if (carry !== 0) num.words[num.length++] = carry;

  return num;
};

BN._prime = function (name) {
  if (primes[name]) return primes[name];

  var prime;
  if (name === 'k256') prime = new K256();
  else if (name === 'p224') prime = new P224();
  else if (name === 'p192') prime = new P192();
  else if (name === 'p25519') prime = new P25519();
  else throw new Error('Unknown prime ' + name);

  primes[name] = prime;

  return prime;
};

function Red(m) {
  if (typeof m == 'string') {
    var prime = BN._prime(m);
    this.m = prime.p;
    this.prime = prime;
  } else {
    assert(m.gtn(1), 'modulus must be greater than 1');
    this.m = m;
    this.prime = null;
  }
}

Red.prototype._verify1 = function (a) {
  assert(a.negative === 0, 'red works only with positives');
  assert(a.red, 'red works only with red numbers');
};

Red.prototype._verify2 = function (a, b) {
  assert((a.negative | b.negative) == 0, 'red works only with positives');
  assert(a.red && a.red === b.red, 'red works only with red numbers');
};

Red.prototype.imod = function (a) {
  return this.prime ? this.prime.ireduce(a)._forceRed(this)
    : a.umod(this.m)._forceRed(this);
};

Red.prototype.neg = function (a) {
  return a.isZero() ? a.clone() : this.m.sub(a)._forceRed(this);
};

Red.prototype.add = function (a, b) {
  this._verify2(a, b);

  var res = a.add(b);
  res.cmp(this.m) < 0 || res.isub(this.m);

  return res._forceRed(this);
};

Red.prototype.iadd = function (a, b) {
  this._verify2(a, b);

  var res = a.iadd(b);
  res.cmp(this.m) < 0 || res.isub(this.m);

  return res;
};

Red.prototype.sub = function (a, b) {
  this._verify2(a, b);

  var res = a.sub(b);
  res.cmpn(0) < 0 && res.iadd(this.m);

  return res._forceRed(this);
};

Red.prototype.isub = function (a, b) {
  this._verify2(a, b);

  var res = a.isub(b);
  res.cmpn(0) < 0 && res.iadd(this.m);

  return res;
};

Red.prototype.shl = function (a, num) {
  this._verify1(a);
  return this.imod(a.ushln(num));
};

Red.prototype.imul = function (a, b) {
  this._verify2(a, b);
  return this.imod(a.imul(b));
};

Red.prototype.mul = function (a, b) {
  this._verify2(a, b);
  return this.imod(a.mul(b));
};

Red.prototype.isqr = function (a) {
  return this.imul(a, a.clone());
};

Red.prototype.sqr = function (a) {
  return this.mul(a, a);
};

Red.prototype.sqrt = function (a) {
  if (a.isZero()) return a.clone();

  var mod3 = this.m.andln(3);
  assert(mod3 % 2 == 1);

  if (mod3 === 3) {
    var pow = this.m.add(new BN(1)).iushrn(2);
    return this.pow(a, pow);
  }

  var q = this.m.subn(1),
    s = 0;
  while (!q.isZero() && q.andln(1) === 0) {
    s++;
    q.iushrn(1);
  }
  assert(!q.isZero());

  var one = new BN(1).toRed(this),
    nOne = one.redNeg(),

    lpow = this.m.subn(1).iushrn(1),
    z = this.m.bitLength();
  z = new BN(2 * z * z).toRed(this);

  while (this.pow(z, lpow).cmp(nOne) !== 0) z.redIAdd(nOne);

  var c = this.pow(z, q),
    r = this.pow(a, q.addn(1).iushrn(1));
  for (var t = this.pow(a, q), m = s; t.cmp(one) !== 0; ) {
    for (var tmp = t, i = 0; tmp.cmp(one) !== 0; i++) tmp = tmp.redSqr();

    assert(i < m);
    var b = this.pow(c, new BN(1).iushln(m - i - 1));

    r = r.redMul(b);
    c = b.redSqr();
    t = t.redMul(c);
    m = i;
  }

  return r;
};

Red.prototype.invm = function (a) {
  var inv = a._invmp(this.m);
  if (inv.negative !== 0) {
    inv.negative = 0;
    return this.imod(inv).redNeg();
  }
  return this.imod(inv);
};

Red.prototype.pow = function (a, num) {
  if (num.isZero()) return new BN(1).toRed(this);
  if (num.cmpn(1) === 0) return a.clone();

  var windowSize = 4,
    wnd = new Array(1 << windowSize);
  wnd[0] = new BN(1).toRed(this);
  wnd[1] = a;
  for (var i = 2; i < wnd.length; i++) wnd[i] = this.mul(wnd[i - 1], a);

  var res = wnd[0],
    current = 0,
    currentLen = 0,
    start = num.bitLength() % 26;
  if (start === 0) start = 26;

  for (i = num.length - 1; i >= 0; i--) {
    for (var word = num.words[i], j = start - 1; j >= 0; j--) {
      var bit = (word >> j) & 1;
      if (res !== wnd[0]) res = this.sqr(res);

      if (bit === 0 && current === 0) {
        currentLen = 0;
        continue;
      }

      current <<= 1;
      current |= bit;
      if (++currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

      res = this.mul(res, wnd[current]);
      currentLen = 0;
      current = 0;
    }
    start = 26;
  }

  return res;
};

Red.prototype.convertTo = function (num) {
  var r = num.umod(this.m);

  return r === num ? r.clone() : r;
};

Red.prototype.convertFrom = function (num) {
  var res = num.clone();
  res.red = null;
  return res;
};

BN.mont = function (num) {
  return new Mont(num);
};

function Mont(m) {
  Red.call(this, m);

  this.shift = this.m.bitLength();
  if (this.shift % 26 != 0) this.shift += 26 - (this.shift % 26);

  this.r = new BN(1).iushln(this.shift);
  this.r2 = this.imod(this.r.sqr());
  this.rinv = this.r._invmp(this.m);

  this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
  this.minv = this.minv.umod(this.r);
  this.minv = this.r.sub(this.minv);
}
inherits(Mont, Red);

Mont.prototype.convertTo = function (num) {
  return this.imod(num.ushln(this.shift));
};

Mont.prototype.convertFrom = function (num) {
  var r = this.imod(num.mul(this.rinv));
  r.red = null;
  return r;
};

Mont.prototype.imul = function (a, b) {
  if (a.isZero() || b.isZero()) {
    a.words[0] = 0;
    a.length = 1;
    return a;
  }

  var t = a.imul(b),
    c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
    u = t.isub(c).iushrn(this.shift),
    res = u;

  if (u.cmp(this.m) >= 0) res = u.isub(this.m);
  else if (u.cmpn(0) < 0) res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.mul = function (a, b) {
  if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

  var t = a.mul(b),
    c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
    u = t.isub(c).iushrn(this.shift),
    res = u;
  if (u.cmp(this.m) >= 0) res = u.isub(this.m);
  else if (u.cmpn(0) < 0) res = u.iadd(this.m);

  return res._forceRed(this);
};

Mont.prototype.invm = function (a) {
  return this.imod(a._invmp(this.m).mul(this.r2))._forceRed(this);
};

},
// 3
function (module) {

module.exports = assert;

function assert(val, msg) {
  if (!val) throw new Error(msg || 'Assertion failed');
}

assert.equal = function (l, r, msg) {
  if (l != r) throw new Error(msg || 'Assertion failed: ' + l + ' != ' + r);
};

},
// 4
function (module, exports, __webpack_require__) {

var utils = exports,
  BN = __webpack_require__(2),
  minAssert = __webpack_require__(3),
  minUtils = __webpack_require__(52);

utils.assert = minAssert;
utils.toArray = minUtils.toArray;
utils.zero2 = minUtils.zero2;
utils.toHex = minUtils.toHex;
utils.encode = minUtils.encode;

function getNAF(num, w, bits) {
  var naf = new Array(Math.max(num.bitLength(), bits) + 1);
  naf.fill(0);

  for (var ws = 1 << (w + 1), k = num.clone(), i = 0; i < naf.length; i++) {
    var z,
      mod = k.andln(ws - 1);
    if (k.isOdd()) {
      z = mod > (ws >> 1) - 1 ? (ws >> 1) - mod : mod;
      k.isubn(z);
    } else z = 0;

    naf[i] = z;
    k.iushrn(1);
  }

  return naf;
}
utils.getNAF = getNAF;

function getJSF(k1, k2) {
  var jsf = [[], []];

  k1 = k1.clone();
  k2 = k2.clone();
  for (var d1 = 0, d2 = 0; k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0; ) {
    var u1, u2, m8,
      m14 = (k1.andln(3) + d1) & 3,
      m24 = (k2.andln(3) + d2) & 3;
    if (m14 === 3) m14 = -1;
    if (m24 === 3) m24 = -1;
    u1 = (m14 & 1) == 0 ? 0
      : ((m8 = (k1.andln(7) + d1) & 7) == 3 || m8 === 5) && m24 === 2 ? -m14 : m14;

    jsf[0].push(u1);

    u2 = (m24 & 1) == 0 ? 0
      : ((m8 = (k2.andln(7) + d2) & 7) == 3 || m8 === 5) && m14 === 2 ? -m24 : m24;

    jsf[1].push(u2);

    if (2 * d1 === u1 + 1) d1 = 1 - d1;
    if (2 * d2 === u2 + 1) d2 = 1 - d2;
    k1.iushrn(1);
    k2.iushrn(1);
  }

  return jsf;
}
utils.getJSF = getJSF;

function cachedProperty(obj, name, computer) {
  var key = '_' + name;
  obj.prototype[name] = function () {
    return this[key] !== void 0 ? this[key] : (this[key] = computer.call(this));
  };
}
utils.cachedProperty = cachedProperty;

function parseBytes(bytes) {
  return typeof bytes == 'string' ? utils.toArray(bytes, 'hex') : bytes;
}
utils.parseBytes = parseBytes;

function intFromLE(bytes) {
  return new BN(bytes, 'hex', 'le');
}
utils.intFromLE = intFromLE;

},
// 5
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(3),
  inherits = __webpack_require__(1);

exports.inherits = inherits;

function isSurrogatePair(msg, i) {
  return (msg.charCodeAt(i) & 0xFC00) == 0xD800 &&
    i >= 0 && i + 1 < msg.length &&
    (msg.charCodeAt(i + 1) & 0xFC00) == 0xDC00;
}

function toArray(msg, enc) {
  if (Array.isArray(msg)) return msg.slice();
  if (!msg) return [];
  var res = [];
  if (typeof msg == 'string') {
    if (!enc)
      for (var p = 0, i = 0; i < msg.length; i++) {
        var c = msg.charCodeAt(i);
        if (c < 128) res[p++] = c;
        else if (c < 2048) {
          res[p++] = (c >> 6) | 192;
          res[p++] = (c & 63) | 128;
        } else if (isSurrogatePair(msg, i)) {
          c = 0x10000 + ((c & 0x03FF) << 10) + (msg.charCodeAt(++i) & 0x03FF);
          res[p++] = (c >> 18) | 240;
          res[p++] = ((c >> 12) & 63) | 128;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        } else {
          res[p++] = (c >> 12) | 224;
          res[p++] = ((c >> 6) & 63) | 128;
          res[p++] = (c & 63) | 128;
        }
      }
    else if (enc === 'hex') {
      if ((msg = msg.replace(/[^a-z0-9]+/gi, '')).length % 2 != 0) msg = '0' + msg;
      for (i = 0; i < msg.length; i += 2)
        res.push(parseInt(msg[i] + msg[i + 1], 16));
    }
  } else for (i = 0; i < msg.length; i++) res[i] = msg[i] | 0;

  return res;
}
exports.toArray = toArray;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
  return res;
}
exports.toHex = toHex;

function htonl(w) {
  var res =
    (w >>> 24) | ((w >>> 8) & 0xff00) | ((w << 8) & 0xff0000) | ((w & 0xff) << 24);
  return res >>> 0;
}
exports.htonl = htonl;

function toHex32(msg, endian) {
  var res = '';
  for (var i = 0; i < msg.length; i++) {
    var w = msg[i];
    if (endian === 'little') w = htonl(w);
    res += zero8(w.toString(16));
  }
  return res;
}
exports.toHex32 = toHex32;

function zero2(word) {
  return word.length === 1 ? '0' + word : word;
}
exports.zero2 = zero2;

function zero8(word) {
  return word.length === 7
    ? '0' + word
    : word.length === 6
    ? '00' + word
    : word.length === 5
    ? '000' + word
    : word.length === 4
    ? '0000' + word
    : word.length === 3
    ? '00000' + word
    : word.length === 2
    ? '000000' + word
    : word.length === 1
    ? '0000000' + word
    : word;
}
exports.zero8 = zero8;

function join32(msg, start, end, endian) {
  var len = end - start;
  assert(len % 4 == 0);
  var res = new Array(len / 4);
  for (var i = 0, k = start; i < res.length; i++, k += 4) {
    var w = endian === 'big'
      ? (msg[k] << 24) | (msg[k + 1] << 16) | (msg[k + 2] << 8) | msg[k + 3]
      : (msg[k + 3] << 24) | (msg[k + 2] << 16) | (msg[k + 1] << 8) | msg[k];
    res[i] = w >>> 0;
  }
  return res;
}
exports.join32 = join32;

function split32(msg, endian) {
  var res = new Array(msg.length * 4);
  for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
    var m = msg[i];
    if (endian === 'big') {
      res[k] = m >>> 24;
      res[k + 1] = (m >>> 16) & 0xff;
      res[k + 2] = (m >>> 8) & 0xff;
      res[k + 3] = m & 0xff;
    } else {
      res[k + 3] = m >>> 24;
      res[k + 2] = (m >>> 16) & 0xff;
      res[k + 1] = (m >>> 8) & 0xff;
      res[k] = m & 0xff;
    }
  }
  return res;
}
exports.split32 = split32;

function rotr32(w, b) {
  return (w >>> b) | (w << (32 - b));
}
exports.rotr32 = rotr32;

function rotl32(w, b) {
  return (w << b) | (w >>> (32 - b));
}
exports.rotl32 = rotl32;

function sum32(a, b) {
  return (a + b) >>> 0;
}
exports.sum32 = sum32;

function sum32_3(a, b, c) {
  return (a + b + c) >>> 0;
}
exports.sum32_3 = sum32_3;

function sum32_4(a, b, c, d) {
  return (a + b + c + d) >>> 0;
}
exports.sum32_4 = sum32_4;

function sum32_5(a, b, c, d, e) {
  return (a + b + c + d + e) >>> 0;
}
exports.sum32_5 = sum32_5;

function sum64(buf, pos, ah, al) {
  var bh = buf[pos],

    lo = (al + buf[pos + 1]) >>> 0,
    hi = (lo < al ? 1 : 0) + ah + bh;
  buf[pos] = hi >>> 0;
  buf[pos + 1] = lo;
}
exports.sum64 = sum64;

function sum64_hi(ah, al, bh, bl) {
  return (((al + bl) >>> 0 < al ? 1 : 0) + ah + bh) >>> 0;
}
exports.sum64_hi = sum64_hi;

function sum64_lo(ah, al, bh, bl) {
  return (al + bl) >>> 0;
}
exports.sum64_lo = sum64_lo;

function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
  var carry = 0,
    lo = al;
  carry += (lo = (lo + bl) >>> 0) < al ? 1 : 0;
  carry += (lo = (lo + cl) >>> 0) < cl ? 1 : 0;
  carry += (lo = (lo + dl) >>> 0) < dl ? 1 : 0;

  return (ah + bh + ch + dh + carry) >>> 0;
}
exports.sum64_4_hi = sum64_4_hi;

function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
  return (al + bl + cl + dl) >>> 0;
}
exports.sum64_4_lo = sum64_4_lo;

function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  var carry = 0,
    lo = al;
  carry += (lo = (lo + bl) >>> 0) < al ? 1 : 0;
  carry += (lo = (lo + cl) >>> 0) < cl ? 1 : 0;
  carry += (lo = (lo + dl) >>> 0) < dl ? 1 : 0;
  carry += (lo = (lo + el) >>> 0) < el ? 1 : 0;

  return (ah + bh + ch + dh + eh + carry) >>> 0;
}
exports.sum64_5_hi = sum64_5_hi;

function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
  return (al + bl + cl + dl + el) >>> 0;
}
exports.sum64_5_lo = sum64_5_lo;

function rotr64_hi(ah, al, num) {
  return ((al << (32 - num)) | (ah >>> num)) >>> 0;
}
exports.rotr64_hi = rotr64_hi;

function rotr64_lo(ah, al, num) {
  return ((ah << (32 - num)) | (al >>> num)) >>> 0;
}
exports.rotr64_lo = rotr64_lo;

function shr64_hi(ah, al, num) {
  return ah >>> num;
}
exports.shr64_hi = shr64_hi;

function shr64_lo(ah, al, num) {
  return ((ah << (32 - num)) | (al >>> num)) >>> 0;
}
exports.shr64_lo = shr64_lo;

},
// 6
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer,
  Transform = __webpack_require__(21).Transform,
  StringDecoder = __webpack_require__(72).StringDecoder

function CipherBase(hashMode) {
  Transform.call(this)
  this.hashMode = typeof hashMode == 'string'
  if (this.hashMode) this[hashMode] = this._finalOrDigest
  else this.final = this._finalOrDigest

  if (this._final) {
    this.__final = this._final
    this._final = null
  }
  this._decoder = null
  this._encoding = null
}
__webpack_require__(1)(CipherBase, Transform)

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data == 'string') data = Buffer.from(data, inputEnc)

  var outData = this._update(data)
  if (this.hashMode) return this

  if (outputEnc) outData = this._toString(outData, outputEnc)

  return outData
}

CipherBase.prototype.setAutoPadding = function () {}
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state')
}

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state')
}

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state')
}

CipherBase.prototype._transform = function (data, _, next) {
  var err
  try {
    this.hashMode ? this._update(data) : this.push(this._update(data))
  } catch (e) {
    err = e
  } finally {
    next(err)
  }
}
CipherBase.prototype._flush = function (done) {
  var err
  try {
    this.push(this.__final())
  } catch (e) {
    err = e
  }

  done(err)
}
CipherBase.prototype._finalOrDigest = function (outputEnc) {
  var outData = this.__final() || Buffer.alloc(0)
  if (outputEnc) outData = this._toString(outData, outputEnc, true)

  return outData
}

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc)
    this._encoding = enc
  }

  if (this._encoding !== enc) throw new Error("can't switch encodings")

  var out = this._decoder.write(value)
  if (fin) out += this._decoder.end()

  return out
}

module.exports = CipherBase

},
// 7
function (module, exports, __webpack_require__) {

var MAX_BYTES = 65536,
  MAX_UINT32 = 4294967295

function oldBrowser() {
  throw new Error(
    'Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11'
  )
}

var Buffer = __webpack_require__(0).Buffer,
  crypto = global.crypto || global.msCrypto

module.exports = crypto && crypto.getRandomValues ? randomBytes : oldBrowser

function randomBytes(size, cb) {
  if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

  var bytes = Buffer.allocUnsafe(size)

  if (size > 0)
    if (size > MAX_BYTES)
      for (var generated = 0; generated < size; generated += MAX_BYTES)
        crypto.getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
    else crypto.getRandomValues(bytes)

  return typeof cb == 'function'
    ? process.nextTick(function () {
        cb(null, bytes)
      })
    : bytes
}

},
// 8
function (module) {

module.exports = require('buffer');

},
// 9
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer

function Hash(blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data == 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block,
    blockSize = this._blockSize,
    length = data.length,
    accum = this._len

  for (var offset = 0; offset < length; ) {
    var assigned = accum % blockSize,
      remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) block[assigned + i] = data[offset + i]

    offset += remainder

    (accum += remainder) % blockSize != 0 || this._update(block)
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  if (bits <= 0xffffffff) this._block.writeUInt32BE(bits, this._blockSize - 4)
  else {
    var lowBits = (bits & 0xffffffff) >>> 0,
      highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash

},
// 10
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  MD5 = __webpack_require__(20),
  RIPEMD160 = __webpack_require__(36),
  sha = __webpack_require__(37),
  Base = __webpack_require__(6)

function Hash(hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function (data) {
  this._hash.update(data)
}

Hash.prototype._final = function () {
  return this._hash.digest()
}

module.exports = function (alg) {
  return (alg = alg.toLowerCase()) === 'md5' ? new MD5()
    : alg === 'rmd160' || alg === 'ripemd160' ? new RIPEMD160()
    : new Hash(sha(alg))
}

},
// 11
function (module) {

module.exports = require('crypto');

},
// 12
function (module) {

module.exports = function (a, b) {
  var length = Math.min(a.length, b.length),
    buffer = new Buffer(length)

  for (var i = 0; i < length; ++i) buffer[i] = a[i] ^ b[i]

  return buffer
}

},
// 13
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  assert = __webpack_require__(3);

function BlockHash() {
  this.pending = null;
  this.pendingTotal = 0;
  this.blockSize = this.constructor.blockSize;
  this.outSize = this.constructor.outSize;
  this.hmacStrength = this.constructor.hmacStrength;
  this.padLength = this.constructor.padLength / 8;
  this.endian = 'big';

  this._delta8 = this.blockSize / 8;
  this._delta32 = this.blockSize / 32;
}
exports.BlockHash = BlockHash;

BlockHash.prototype.update = function (msg, enc) {
  msg = utils.toArray(msg, enc);
  this.pending = !this.pending ? msg : this.pending.concat(msg);
  this.pendingTotal += msg.length;

  if (this.pending.length >= this._delta8) {
    var r = (msg = this.pending).length % this._delta8;

    this.pending = msg.slice(msg.length - r, msg.length);
    if (this.pending.length === 0) this.pending = null;

    msg = utils.join32(msg, 0, msg.length - r, this.endian);
    for (var i = 0; i < msg.length; i += this._delta32)
      this._update(msg, i, i + this._delta32);
  }

  return this;
};

BlockHash.prototype.digest = function (enc) {
  this.update(this._pad());
  assert(this.pending === null);

  return this._digest(enc);
};

BlockHash.prototype._pad = function () {
  var len = this.pendingTotal,
    bytes = this._delta8,
    k = bytes - ((len + this.padLength) % bytes),
    res = new Array(k + this.padLength);
  res[0] = 0x80;
  for (var i = 1; i < k; i++) res[i] = 0;

  len <<= 3;
  if (this.endian === 'big') {
    for (var t = 8; t < this.padLength; t++) res[i++] = 0;

    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = len & 0xff;
  } else {
    res[i++] = len & 0xff;
    res[i++] = (len >>> 8) & 0xff;
    res[i++] = (len >>> 16) & 0xff;
    res[i++] = (len >>> 24) & 0xff;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;
    res[i++] = 0;

    for (t = 8; t < this.padLength; t++) res[i++] = 0;
  }

  return res;
};

},
// 14
function (module, exports, __webpack_require__) {

var asn1 = exports;

asn1.bignum = __webpack_require__(2);

asn1.define = __webpack_require__(115).define;
asn1.base = __webpack_require__(15);
asn1.constants = __webpack_require__(58);
asn1.decoders = __webpack_require__(120);
asn1.encoders = __webpack_require__(122);

},
// 15
function (module, exports, __webpack_require__) {

var base = exports;

base.Reporter = __webpack_require__(117).Reporter;
base.DecoderBuffer = __webpack_require__(57).DecoderBuffer;
base.EncoderBuffer = __webpack_require__(57).EncoderBuffer;
base.Node = __webpack_require__(118);

},
// 16
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer

function asUInt32Array(buf) {
  Buffer.isBuffer(buf) || (buf = Buffer.from(buf))

  var len = (buf.length / 4) | 0,
    out = new Array(len)

  for (var i = 0; i < len; i++) out[i] = buf.readUInt32BE(i * 4)

  return out
}

function scrubVec(v) {
  for (var i = 0; i < v.length; v++) v[i] = 0
}

function cryptBlock(M, keySchedule, SUB_MIX, SBOX, nRounds) {
  var t0, t1, t2, t3
  var SUB_MIX0 = SUB_MIX[0],
    SUB_MIX1 = SUB_MIX[1],
    SUB_MIX2 = SUB_MIX[2],
    SUB_MIX3 = SUB_MIX[3],

    s0 = M[0] ^ keySchedule[0],
    s1 = M[1] ^ keySchedule[1],
    s2 = M[2] ^ keySchedule[2],
    s3 = M[3] ^ keySchedule[3],
    ksRow = 4

  for (var round = 1; round < nRounds; round++) {
    t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[(s1 >>> 16) & 0xff] ^
      SUB_MIX2[(s2 >>> 8) & 0xff] ^ SUB_MIX3[s3 & 0xff] ^ keySchedule[ksRow++]
    t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[(s2 >>> 16) & 0xff] ^
      SUB_MIX2[(s3 >>> 8) & 0xff] ^ SUB_MIX3[s0 & 0xff] ^ keySchedule[ksRow++]
    t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[(s3 >>> 16) & 0xff] ^
      SUB_MIX2[(s0 >>> 8) & 0xff] ^ SUB_MIX3[s1 & 0xff] ^ keySchedule[ksRow++]
    t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[(s0 >>> 16) & 0xff] ^
      SUB_MIX2[(s1 >>> 8) & 0xff] ^ SUB_MIX3[s2 & 0xff] ^ keySchedule[ksRow++]
    s0 = t0
    s1 = t1
    s2 = t2
    s3 = t3
  }

  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) |
      (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++]
  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) |
      (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++]
  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) |
      (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++]
  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) |
      (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]

  return [(t0 >>>= 0), (t1 >>>= 0), (t2 >>>= 0), (t3 >>>= 0)] // redundant
}

var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]
var G = (function () {
  var d = new Array(256)
  for (var j = 0; j < 256; j++) d[j] = j < 128 ? j << 1 : (j << 1) ^ 0x11b

  var SBOX = [],
    INV_SBOX = [],
    SUB_MIX = [[], [], [], []],
    INV_SUB_MIX = [[], [], [], []]

  for (var x = 0, xi = 0, i = 0; i < 256; ++i) {
    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63
    SBOX[x] = sx
    INV_SBOX[sx] = x

    var x2 = d[x],
      x4 = d[x2],
      x8 = d[x4],

      t = (d[sx] * 0x101) ^ (sx * 0x1010100)
    SUB_MIX[0][x] = (t << 24) | (t >>> 8)
    SUB_MIX[1][x] = (t << 16) | (t >>> 16)
    SUB_MIX[2][x] = (t << 8) | (t >>> 24)
    SUB_MIX[3][x] = t

    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)
    INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8)
    INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16)
    INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24)
    INV_SUB_MIX[3][sx] = t

    if (x === 0) x = xi = 1
    else {
      x = x2 ^ d[d[d[x8 ^ x2]]]
      xi ^= d[d[xi]]
    }
  }

  return {
    SBOX: SBOX,
    INV_SBOX: INV_SBOX,
    SUB_MIX: SUB_MIX,
    INV_SUB_MIX: INV_SUB_MIX
  }
})()

function AES(key) {
  this._key = asUInt32Array(key)
  this._reset()
}

AES.blockSize = 16
AES.keySize = 32
AES.prototype.blockSize = AES.blockSize
AES.prototype.keySize = AES.keySize
AES.prototype._reset = function () {
  var keyWords = this._key,
    keySize = keyWords.length,
    nRounds = keySize + 6,
    ksRows = (nRounds + 1) * 4,

    keySchedule = []
  for (var k = 0; k < keySize; k++) keySchedule[k] = keyWords[k]

  for (k = keySize; k < ksRows; k++) {
    var t = keySchedule[k - 1]

    if (k % keySize == 0) {
      t = (t << 8) | (t >>> 24)
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        G.SBOX[t & 0xff]

      t ^= RCON[(k / keySize) | 0] << 24
    } else if (keySize > 6 && k % keySize == 4)
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        G.SBOX[t & 0xff]

    keySchedule[k] = keySchedule[k - keySize] ^ t
  }

  var invKeySchedule = []
  for (var ik = 0; ik < ksRows; ik++) {
    var ksR = ksRows - ik,
      tt = keySchedule[ksR - (ik % 4 ? 0 : 4)]

    invKeySchedule[ik] = ik < 4 || ksR <= 4
      ? tt
      : G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^
        G.INV_SUB_MIX[1][G.SBOX[(tt >>> 16) & 0xff]] ^
        G.INV_SUB_MIX[2][G.SBOX[(tt >>> 8) & 0xff]] ^
        G.INV_SUB_MIX[3][G.SBOX[tt & 0xff]]
  }

  this._nRounds = nRounds
  this._keySchedule = keySchedule
  this._invKeySchedule = invKeySchedule
}

AES.prototype.encryptBlockRaw = function (M) {
  M = asUInt32Array(M)
  return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds)
}

AES.prototype.encryptBlock = function (M) {
  var out = this.encryptBlockRaw(M),
    buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[1], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[3], 12)
  return buf
}

AES.prototype.decryptBlock = function (M) {
  var m1 = (M = asUInt32Array(M))[1]

  M[1] = M[3]
  M[3] = m1

  var out =
    cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds)
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[3], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[1], 12)
  return buf
}

AES.prototype.scrub = function () {
  scrubVec(this._keySchedule)
  scrubVec(this._invKeySchedule)
  scrubVec(this._key)
}

module.exports.AES = AES

},
// 17
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer,
  MD5 = __webpack_require__(20)

function EVP_BytesToKey(password, salt, keyBits, ivLen) {
  Buffer.isBuffer(password) || (password = Buffer.from(password, 'binary'))
  if (salt) {
    Buffer.isBuffer(salt) || (salt = Buffer.from(salt, 'binary'))
    if (salt.length !== 8)
      throw new RangeError('salt should be Buffer with 8 byte length')
  }

  var keyLen = keyBits / 8,
    key = Buffer.alloc(keyLen),
    iv = Buffer.alloc(ivLen || 0),
    tmp = Buffer.alloc(0)

  while (keyLen > 0 || ivLen > 0) {
    var hash = new MD5()
    hash.update(tmp)
    hash.update(password)
    salt && hash.update(salt)
    tmp = hash.digest()

    var used = 0

    if (keyLen > 0) {
      var keyStart = key.length - keyLen
      used = Math.min(keyLen, tmp.length)
      tmp.copy(key, keyStart, 0, used)
      keyLen -= used
    }

    if (used < tmp.length && ivLen > 0) {
      var ivStart = iv.length - ivLen,
        length = Math.min(ivLen, tmp.length - used)
      tmp.copy(iv, ivStart, used, used + length)
      ivLen -= length
    }
  }

  tmp.fill(0)
  return { key: key, iv: iv }
}

module.exports = EVP_BytesToKey

},
// 18
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  utils = __webpack_require__(4),
  getNAF = utils.getNAF,
  getJSF = utils.getJSF,
  assert = utils.assert;

function BaseCurve(type, conf) {
  this.type = type;
  this.p = new BN(conf.p, 16);

  this.red = conf.prime ? BN.red(conf.prime) : BN.mont(this.p);

  this.zero = new BN(0).toRed(this.red);
  this.one = new BN(1).toRed(this.red);
  this.two = new BN(2).toRed(this.red);

  this.n = conf.n && new BN(conf.n, 16);
  this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);

  this._wnafT1 = new Array(4);
  this._wnafT2 = new Array(4);
  this._wnafT3 = new Array(4);
  this._wnafT4 = new Array(4);

  this._bitLength = this.n ? this.n.bitLength() : 0;

  var adjustCount = this.n && this.p.div(this.n);
  if (!adjustCount || adjustCount.cmpn(100) > 0) this.redN = null;
  else {
    this._maxwellTrick = true;
    this.redN = this.n.toRed(this.red);
  }
}
module.exports = BaseCurve;

BaseCurve.prototype.point = function () {
  throw new Error('Not implemented');
};

BaseCurve.prototype.validate = function () {
  throw new Error('Not implemented');
};

BaseCurve.prototype._fixedNafMul = function (p, k) {
  assert(p.precomputed);
  var doubles = p._getDoubles(),

    naf = getNAF(k, 1, this._bitLength),
    I = (1 << (doubles.step + 1)) - (doubles.step % 2 == 0 ? 2 : 1);
  I /= 3;

  var repr = [];
  for (var j = 0; j < naf.length; j += doubles.step) {
    var nafW = 0;
    for (k = j + doubles.step - 1; k >= j; k--) nafW = (nafW << 1) + naf[k];
    repr.push(nafW);
  }

  var a = this.jpoint(null, null, null);
  for (var b = this.jpoint(null, null, null), i = I; i > 0; i--) {
    for (j = 0; j < repr.length; j++)
      if ((nafW = repr[j]) === i) b = b.mixedAdd(doubles.points[j]);
      else if (nafW === -i) b = b.mixedAdd(doubles.points[j].neg());

    a = a.add(b);
  }
  return a.toP();
};

BaseCurve.prototype._wnafMul = function (p, k) {
  var w = 4,

    nafPoints = p._getNAFPoints(w);
  w = nafPoints.wnd;
  var wnd = nafPoints.points,

    naf = getNAF(k, w, this._bitLength),

    acc = this.jpoint(null, null, null);
  for (var i = naf.length - 1; i >= 0; i--) {
    for (k = 0; i >= 0 && naf[i] === 0; i--) k++;
    i < 0 || k++;
    acc = acc.dblp(k);

    if (i < 0) break;
    var z = naf[i];
    assert(z !== 0);
    acc = p.type === 'affine'
      ? z > 0
        ? acc.mixedAdd(wnd[(z - 1) >> 1])
        : acc.mixedAdd(wnd[(-z - 1) >> 1].neg())
      : z > 0
        ? acc.add(wnd[(z - 1) >> 1])
        : acc.add(wnd[(-z - 1) >> 1].neg());
  }
  return p.type === 'affine' ? acc.toP() : acc;
};

BaseCurve.prototype._wnafMulAdd = function (defW, points, coeffs, len, jacobianResult) {
  var wndWidth = this._wnafT1,
    wnd = this._wnafT2,
    naf = this._wnafT3,

    max = 0;
  for (var i = 0; i < len; i++) {
    var p = points[i],
      nafPoints = p._getNAFPoints(defW);
    wndWidth[i] = nafPoints.wnd;
    wnd[i] = nafPoints.points;
  }

  for (i = len - 1; i >= 1; i -= 2) {
    var a = i - 1,
      b = i;
    if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
      naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
      naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
      max = Math.max(naf[a].length, max);
      max = Math.max(naf[b].length, max);
      continue;
    }

    var comb = [points[a], null, null, points[b]];

    if (points[a].y.cmp(points[b].y) === 0) {
      comb[1] = points[a].add(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].add(points[b].neg());
    } else {
      comb[1] = points[a].toJ().mixedAdd(points[b]);
      comb[2] = points[a].toJ().mixedAdd(points[b].neg());
    }

    var index = [-3, -1, -5, -7, 0, 7, 5, 1, 3],

      jsf = getJSF(coeffs[a], coeffs[b]);
    max = Math.max(jsf[0].length, max);
    naf[a] = new Array(max);
    naf[b] = new Array(max);
    for (var j = 0; j < max; j++) {
      var ja = jsf[0][j] | 0,
        jb = jsf[1][j] | 0;

      naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
      naf[b][j] = 0;
      wnd[a] = comb;
    }
  }

  var acc = this.jpoint(null, null, null),
    tmp = this._wnafT4;
  for (i = max; i >= 0; i--) {
    var k = 0;

    while (i >= 0) {
      var zero = true;
      for (j = 0; j < len; j++) {
        tmp[j] = naf[j][i] | 0;
        if (tmp[j] !== 0) zero = false;
      }
      if (!zero) break;
      k++;
      i--;
    }
    i < 0 || k++;
    acc = acc.dblp(k);
    if (i < 0) break;

    for (j = 0; j < len; j++) {
      var z = tmp[j];
      if (z === 0) continue;
      if (z > 0) p = wnd[j][(z - 1) >> 1];
      else if (z < 0) p = wnd[j][(-z - 1) >> 1].neg();

      acc = p.type === 'affine' ? acc.mixedAdd(p) : acc.add(p);
    }
  }
  for (i = 0; i < len; i++) wnd[i] = null;

  return jacobianResult ? acc : acc.toP();
};

function BasePoint(curve, type) {
  this.curve = curve;
  this.type = type;
  this.precomputed = null;
}
BaseCurve.BasePoint = BasePoint;

BasePoint.prototype.eq = function () {
  throw new Error('Not implemented');
};

BasePoint.prototype.validate = function () {
  return this.curve.validate(this);
};

BaseCurve.prototype.decodePoint = function (bytes, enc) {
  bytes = utils.toArray(bytes, enc);

  var len = this.p.byteLength();

  if ((bytes[0] === 0x04 || bytes[0] === 0x06 || bytes[0] === 0x07) &&
      bytes.length - 1 == 2 * len) {
    bytes[0] === 0x06
      ? assert(bytes[bytes.length - 1] % 2 == 0)
      : bytes[0] !== 0x07 || assert(bytes[bytes.length - 1] % 2 == 1);

    return this.point(bytes.slice(1, 1 + len), bytes.slice(1 + len, 1 + 2 * len));
  }
  if ((bytes[0] === 0x02 || bytes[0] === 0x03) && bytes.length - 1 === len)
    return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 0x03);

  throw new Error('Unknown point format');
};

BasePoint.prototype.encodeCompressed = function (enc) {
  return this.encode(enc, true);
};

BasePoint.prototype._encode = function (compact) {
  var len = this.curve.p.byteLength(),
    x = this.getX().toArray('be', len);

  return compact
    ? [this.getY().isEven() ? 0x02 : 0x03].concat(x)
    : [0x04].concat(x, this.getY().toArray('be', len));
};

BasePoint.prototype.encode = function (enc, compact) {
  return utils.encode(this._encode(compact), enc);
};

BasePoint.prototype.precompute = function (power) {
  if (this.precomputed) return this;

  var precomputed = { doubles: null, naf: null, beta: null };
  precomputed.naf = this._getNAFPoints(8);
  precomputed.doubles = this._getDoubles(4, power);
  precomputed.beta = this._getBeta();
  this.precomputed = precomputed;

  return this;
};

BasePoint.prototype._hasDoubles = function (k) {
  if (!this.precomputed) return false;

  var doubles = this.precomputed.doubles;
  return !!doubles &&
    doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
};

BasePoint.prototype._getDoubles = function (step, power) {
  if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;

  var doubles = [this];
  for (var acc = this, i = 0; i < power; i += step) {
    for (var j = 0; j < step; j++) acc = acc.dbl();
    doubles.push(acc);
  }
  return { step: step, points: doubles };
};

BasePoint.prototype._getNAFPoints = function (wnd) {
  if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;

  var res = [this],
    max = (1 << wnd) - 1,
    dbl = max === 1 ? null : this.dbl();
  for (var i = 1; i < max; i++) res[i] = res[i - 1].add(dbl);
  return { wnd: wnd, points: res };
};

BasePoint.prototype._getBeta = function () {
  return null;
};

BasePoint.prototype.dblp = function (k) {
  var r = this;
  for (var i = 0; i < k; i++) r = r.dbl();
  return r;
};

},
// 19
function (module, exports, __webpack_require__) {

var asn1 = __webpack_require__(114),
  aesid = __webpack_require__(125),
  fixProc = __webpack_require__(126),
  ciphers = __webpack_require__(27),
  compat = __webpack_require__(41),
  Buffer = __webpack_require__(0).Buffer
module.exports = parseKeys

function parseKeys(buffer) {
  var password
  if (typeof buffer == 'object' && !Buffer.isBuffer(buffer)) {
    password = buffer.passphrase
    buffer = buffer.key
  }
  if (typeof buffer == 'string') buffer = Buffer.from(buffer)

  var subtype, ndata,
    stripped = fixProc(buffer, password),

    type = stripped.tag,
    data = stripped.data
  switch (type) {
    case 'CERTIFICATE':
      ndata = asn1.certificate.decode(data, 'der').tbsCertificate.subjectPublicKeyInfo
    case 'PUBLIC KEY':
      ndata || (ndata = asn1.PublicKey.decode(data, 'der'))

      switch ((subtype = ndata.algorithm.algorithm.join('.'))) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPublicKey.decode(ndata.subjectPublicKey.data, 'der')
        case '1.2.840.10045.2.1':
          ndata.subjectPrivateKey = ndata.subjectPublicKey
          return { type: 'ec', data: ndata }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.pub_key =
            asn1.DSAparam.decode(ndata.subjectPublicKey.data, 'der')
          return { type: 'dsa', data: ndata.algorithm.params }
        default:
          throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'ENCRYPTED PRIVATE KEY':
      data = decrypt(asn1.EncryptedPrivateKey.decode(data, 'der'), password)
    case 'PRIVATE KEY':
      ndata = asn1.PrivateKey.decode(data, 'der')
      switch ((subtype = ndata.algorithm.algorithm.join('.'))) {
        case '1.2.840.113549.1.1.1':
          return asn1.RSAPrivateKey.decode(ndata.subjectPrivateKey, 'der')
        case '1.2.840.10045.2.1':
          return {
            curve: ndata.algorithm.curve,
            privateKey:
              asn1.ECPrivateKey.decode(ndata.subjectPrivateKey, 'der').privateKey
          }
        case '1.2.840.10040.4.1':
          ndata.algorithm.params.priv_key =
            asn1.DSAparam.decode(ndata.subjectPrivateKey, 'der')
          return { type: 'dsa', params: ndata.algorithm.params }
        default:
          throw new Error('unknown key id ' + subtype)
      }
      throw new Error('unknown key type ' + type)
    case 'RSA PUBLIC KEY':
      return asn1.RSAPublicKey.decode(data, 'der')
    case 'RSA PRIVATE KEY':
      return asn1.RSAPrivateKey.decode(data, 'der')
    case 'DSA PRIVATE KEY':
      return { type: 'dsa', params: asn1.DSAPrivateKey.decode(data, 'der') }
    case 'EC PRIVATE KEY':
      data = asn1.ECPrivateKey.decode(data, 'der')
      return { curve: data.parameters.value, privateKey: data.privateKey }
    default:
      throw new Error('unknown key type ' + type)
  }
}
parseKeys.signature = asn1.signature
function decrypt(data, password) {
  var salt = data.algorithm.decrypt.kde.kdeparams.salt,
    iters = parseInt(data.algorithm.decrypt.kde.kdeparams.iters.toString(), 10),
    algo = aesid[data.algorithm.decrypt.cipher.algo.join('.')],
    iv = data.algorithm.decrypt.cipher.iv,
    cipherText = data.subjectPrivateKey,
    keylen = parseInt(algo.split('-')[1], 10) / 8,
    key = compat.pbkdf2Sync(password, salt, iters, keylen, 'sha1'),
    cipher = ciphers.createDecipheriv(algo, key, iv),
    out = []
  out.push(cipher.update(cipherText))
  out.push(cipher.final())
  return Buffer.concat(out)
}

},
// 20
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  HashBase = __webpack_require__(35),
  Buffer = __webpack_require__(0).Buffer,

  ARRAY16 = new Array(16)

function MD5() {
  HashBase.call(this, 64)

  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
}

inherits(MD5, HashBase)

MD5.prototype._update = function () {
  var M = ARRAY16
  for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4)

  var a = this._a,
    b = this._b,
    c = this._c,
    d = this._d

  a = fnF(a, b, c, d, M[0], 0xd76aa478, 7)
  d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12)
  c = fnF(c, d, a, b, M[2], 0x242070db, 17)
  b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22)
  a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7)
  d = fnF(d, a, b, c, M[5], 0x4787c62a, 12)
  c = fnF(c, d, a, b, M[6], 0xa8304613, 17)
  b = fnF(b, c, d, a, M[7], 0xfd469501, 22)
  a = fnF(a, b, c, d, M[8], 0x698098d8, 7)
  d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12)
  c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17)
  b = fnF(b, c, d, a, M[11], 0x895cd7be, 22)
  a = fnF(a, b, c, d, M[12], 0x6b901122, 7)
  d = fnF(d, a, b, c, M[13], 0xfd987193, 12)
  c = fnF(c, d, a, b, M[14], 0xa679438e, 17)

  a = fnG(a, (b = fnF(b, c, d, a, M[15], 0x49b40821, 22)), c, d, M[1], 0xf61e2562, 5)
  d = fnG(d, a, b, c, M[6], 0xc040b340, 9)
  c = fnG(c, d, a, b, M[11], 0x265e5a51, 14)
  b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20)
  a = fnG(a, b, c, d, M[5], 0xd62f105d, 5)
  d = fnG(d, a, b, c, M[10], 0x02441453, 9)
  c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14)
  b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20)
  a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5)
  d = fnG(d, a, b, c, M[14], 0xc33707d6, 9)
  c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14)
  b = fnG(b, c, d, a, M[8], 0x455a14ed, 20)
  a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5)
  d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9)
  c = fnG(c, d, a, b, M[7], 0x676f02d9, 14)

  a = fnH(a, (b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20)), c, d, M[5], 0xfffa3942, 4)
  d = fnH(d, a, b, c, M[8], 0x8771f681, 11)
  c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16)
  b = fnH(b, c, d, a, M[14], 0xfde5380c, 23)
  a = fnH(a, b, c, d, M[1], 0xa4beea44, 4)
  d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11)
  c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16)
  b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23)
  a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4)
  d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11)
  c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16)
  b = fnH(b, c, d, a, M[6], 0x04881d05, 23)
  a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4)
  d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11)
  c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16)

  a = fnI(a, (b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23)), c, d, M[0], 0xf4292244, 6)
  d = fnI(d, a, b, c, M[7], 0x432aff97, 10)
  c = fnI(c, d, a, b, M[14], 0xab9423a7, 15)
  b = fnI(b, c, d, a, M[5], 0xfc93a039, 21)
  a = fnI(a, b, c, d, M[12], 0x655b59c3, 6)
  d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10)
  c = fnI(c, d, a, b, M[10], 0xffeff47d, 15)
  b = fnI(b, c, d, a, M[1], 0x85845dd1, 21)
  a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6)
  d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10)
  c = fnI(c, d, a, b, M[6], 0xa3014314, 15)
  b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21)
  a = fnI(a, b, c, d, M[4], 0xf7537e82, 6)
  d = fnI(d, a, b, c, M[11], 0xbd3af235, 10)
  c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15)
  b = fnI(b, c, d, a, M[9], 0xeb86d391, 21)

  this._a = (this._a + a) | 0
  this._b = (this._b + b) | 0
  this._c = (this._c + c) | 0
  this._d = (this._d + d) | 0
}

MD5.prototype._digest = function () {
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  var buffer = Buffer.allocUnsafe(16)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  return buffer
}

function rotl(x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fnF(a, b, c, d, m, k, s) {
  return (rotl((a + ((b & c) | (~b & d)) + m + k) | 0, s) + b) | 0
}

function fnG(a, b, c, d, m, k, s) {
  return (rotl((a + ((b & d) | (c & ~d)) + m + k) | 0, s) + b) | 0
}

function fnH(a, b, c, d, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0
}

function fnI(a, b, c, d, m, k, s) {
  return (rotl((a + (c ^ (b | ~d)) + m + k) | 0, s) + b) | 0
}

module.exports = MD5

},
// 21
function (module) {

module.exports = require('stream');

},
// 22
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Legacy = __webpack_require__(73),
  Base = __webpack_require__(6),
  Buffer = __webpack_require__(0).Buffer,
  md5 = __webpack_require__(74),
  RIPEMD160 = __webpack_require__(36),

  sha = __webpack_require__(37),

  ZEROS = Buffer.alloc(128)

function Hmac(alg, key) {
  Base.call(this, 'digest')
  if (typeof key == 'string') key = Buffer.from(key)

  var blocksize = alg === 'sha512' || alg === 'sha384' ? 128 : 64

  this._alg = alg
  this._key = key
  if (key.length > blocksize)
    key = (alg === 'rmd160' ? new RIPEMD160() : sha(alg)).update(key).digest()
  else if (key.length < blocksize) key = Buffer.concat([key, ZEROS], blocksize)

  var ipad = (this._ipad = Buffer.allocUnsafe(blocksize)),
    opad = (this._opad = Buffer.allocUnsafe(blocksize))

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }
  this._hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
  this._hash.update(ipad)
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.update(data)
}

Hmac.prototype._final = function () {
  var h = this._hash.digest(),
    hash = this._alg === 'rmd160' ? new RIPEMD160() : sha(this._alg)
  return hash.update(this._opad).update(h).digest()
}

module.exports = function (alg, key) {
  return (alg = alg.toLowerCase()) === 'rmd160' || alg === 'ripemd160'
    ? new Hmac('rmd160', key)
    : alg === 'md5'
    ? new Legacy(md5, key)
    : new Hmac(alg, key)
}

},
// 23
function (module) {

var MAX_ALLOC = Math.pow(2, 30) - 1

module.exports = function (iterations, keylen) {
  if (typeof iterations != 'number') throw new TypeError('Iterations not a number')

  if (iterations < 0) throw new TypeError('Bad iterations')

  if (typeof keylen != 'number') throw new TypeError('Key length not a number')

  if (keylen < 0 || keylen > MAX_ALLOC || keylen !== keylen)
    throw new TypeError('Bad key length')
}

},
// 24
function (module) {

module.exports = global.process && global.process.browser
  ? 'utf-8'
  : global.process && global.process.version
  ? /^v?([6-9]|\d\d+)\./.test(process.version) ? 'utf-8' : 'binary'
  : 'utf-8'

},
// 25
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer

module.exports = function (thing, encoding, name) {
  if (Buffer.isBuffer(thing)) return thing
  if (typeof thing == 'string') return Buffer.from(thing, encoding)
  if (ArrayBuffer.isView(thing)) return Buffer.from(thing.buffer)

  throw new TypeError(
    name + ' must be a string, a Buffer, a typed array or a DataView'
  )
}

},
// 26
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(3);

function Cipher(options) {
  this.options = options;

  this.type = this.options.type;
  this.blockSize = 8;
  this._init();

  this.buffer = new Array(this.blockSize);
  this.bufferOff = 0;
}
module.exports = Cipher;

Cipher.prototype._init = function () {};

Cipher.prototype.update = function (data) {
  return data.length === 0
    ? []
    : this.type === 'decrypt'
    ? this._updateDecrypt(data)
    : this._updateEncrypt(data);
};

Cipher.prototype._buffer = function (data, off) {
  var min = Math.min(this.buffer.length - this.bufferOff, data.length - off);
  for (var i = 0; i < min; i++) this.buffer[this.bufferOff + i] = data[off + i];
  this.bufferOff += min;

  return min;
};

Cipher.prototype._flushBuffer = function (out, off) {
  this._update(this.buffer, 0, out, off);
  this.bufferOff = 0;
  return this.blockSize;
};

Cipher.prototype._updateEncrypt = function (data) {
  var inputOff = 0,
    outputOff = 0,

    count = ((this.bufferOff + data.length) / this.blockSize) | 0,
    out = new Array(count * this.blockSize);

  if (this.bufferOff !== 0) {
    inputOff += this._buffer(data, inputOff);

    if (this.bufferOff === this.buffer.length)
      outputOff += this._flushBuffer(out, outputOff);
  }

  var max = data.length - ((data.length - inputOff) % this.blockSize);
  for (; inputOff < max; inputOff += this.blockSize) {
    this._update(data, inputOff, out, outputOff);
    outputOff += this.blockSize;
  }

  for (; inputOff < data.length; inputOff++, this.bufferOff++)
    this.buffer[this.bufferOff] = data[inputOff];

  return out;
};

Cipher.prototype._updateDecrypt = function (data) {
  var inputOff = 0,
    outputOff = 0,

    count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1,
    out = new Array(count * this.blockSize);

  for (; count > 0; count--) {
    inputOff += this._buffer(data, inputOff);
    outputOff += this._flushBuffer(out, outputOff);
  }

  inputOff += this._buffer(data, inputOff);

  return out;
};

Cipher.prototype.final = function (buffer) {
  var first;
  if (buffer) first = this.update(buffer);

  var last = this.type === 'encrypt' ? this._finalEncrypt() : this._finalDecrypt();

  return first ? first.concat(last) : last;
};

Cipher.prototype._pad = function (buffer, off) {
  if (off === 0) return false;

  while (off < buffer.length) buffer[off++] = 0;

  return true;
};

Cipher.prototype._finalEncrypt = function () {
  if (!this._pad(this.buffer, this.bufferOff)) return [];

  var out = new Array(this.blockSize);
  this._update(this.buffer, 0, out, 0);
  return out;
};

Cipher.prototype._unpad = function (buffer) {
  return buffer;
};

Cipher.prototype._finalDecrypt = function () {
  assert.equal(this.bufferOff, this.blockSize, 'Not enough data to decrypt');
  var out = new Array(this.blockSize);
  this._flushBuffer(out, 0);

  return this._unpad(out);
};

},
// 27
function (module, exports, __webpack_require__) {

var ciphers = __webpack_require__(81),
  deciphers = __webpack_require__(89),
  modes = __webpack_require__(47)

function getCiphers() {
  return Object.keys(modes)
}

exports.createCipher = exports.Cipher = ciphers.createCipher
exports.createCipheriv = exports.Cipheriv = ciphers.createCipheriv
exports.createDecipher = exports.Decipher = deciphers.createDecipher
exports.createDecipheriv = exports.Decipheriv = deciphers.createDecipheriv
exports.listCiphers = exports.getCiphers = getCiphers

},
// 28
function (module, exports, __webpack_require__) {

var modeModules = {
  ECB: __webpack_require__(82),
  CBC: __webpack_require__(83),
  CFB: __webpack_require__(84),
  CFB8: __webpack_require__(85),
  CFB1: __webpack_require__(86),
  OFB: __webpack_require__(87),
  CTR: __webpack_require__(45),
  GCM: __webpack_require__(45)
}

var modes = __webpack_require__(47)

for (var key in modes) modes[key].module = modeModules[modes[key].mode]

module.exports = modes

},
// 29
function (module, exports, __webpack_require__) {

var r;

module.exports = function (len) {
  r || (r = new Rand(null));

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;

Rand.prototype.generate = function (len) {
  return this._rand(len);
};

Rand.prototype._rand = function (n) {
  if (this.rand.getBytes) return this.rand.getBytes(n);

  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++) res[i] = this.rand.getByte();
  return res;
};

if (typeof self == 'object') {
  if (self.crypto && self.crypto.getRandomValues)
    Rand.prototype._rand = function (n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  else if (self.msCrypto && self.msCrypto.getRandomValues)
    Rand.prototype._rand = function (n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };
  else if (typeof window == 'object')
    Rand.prototype._rand = function () {
      throw new Error('Not implemented yet');
    };
} else
  try {
    var crypto = __webpack_require__(11);
    if (typeof crypto.randomBytes != 'function') throw new Error('Not supported');

    Rand.prototype._rand = function (n) {
      return crypto.randomBytes(n);
    };
  } catch (_) {}

},
// 30
function (module, exports, __webpack_require__) {

var bn = __webpack_require__(2),
  randomBytes = __webpack_require__(7);
module.exports = crt;
function blind(priv) {
  var r = getr(priv);
  var blinder =
    r.toRed(bn.mont(priv.modulus)).redPow(new bn(priv.publicExponent)).fromRed();
  return { blinder: blinder, unblinder: r.invm(priv.modulus) };
}
function crt(msg, priv) {
  var blinds = blind(priv),
    len = priv.modulus.byteLength(),
    blinded = new bn(msg).mul(blinds.blinder).umod(priv.modulus),
    c1 = blinded.toRed(bn.mont(priv.prime1)),
    c2 = blinded.toRed(bn.mont(priv.prime2)),
    qinv = priv.coefficient,
    p = priv.prime1,
    q = priv.prime2,
    m1 = c1.redPow(priv.exponent1),
    m2 = c2.redPow(priv.exponent2);
  m1 = m1.fromRed();
  m2 = m2.fromRed();
  var h = m1.isub(m2).imul(qinv).umod(p);
  h.imul(q);
  m2.iadd(h);
  return new Buffer(m2.imul(blinds.unblinder).umod(priv.modulus).toArray(false, len));
}
crt.getr = getr;
function getr(priv) {
  var len = priv.modulus.byteLength(),
    r = new bn(randomBytes(len));
  while (r.cmp(priv.modulus) >= 0 || !r.umod(priv.prime1) || !r.umod(priv.prime2))
    r = new bn(randomBytes(len));

  return r;
}

},
// 31
function (module, exports, __webpack_require__) {

var elliptic = exports;

elliptic.version = __webpack_require__(96).version;
elliptic.utils = __webpack_require__(4);
elliptic.rand = __webpack_require__(29);
elliptic.curve = __webpack_require__(53);
elliptic.curves = __webpack_require__(32);

elliptic.ec = __webpack_require__(107);
elliptic.eddsa = __webpack_require__(111);

},
// 32
function (module, exports, __webpack_require__) {

var pre,
  curves = exports,

  hash = __webpack_require__(33),
  curve = __webpack_require__(53),

  assert = __webpack_require__(4).assert;

function PresetCurve(options) {
  this.curve = options.type === 'short'
    ? new curve.short(options)
    : options.type === 'edwards'
    ? new curve.edwards(options)
    : new curve.mont(options);
  this.g = this.curve.g;
  this.n = this.curve.n;
  this.hash = options.hash;

  assert(this.g.validate(), 'Invalid curve');
  assert(this.g.mul(this.n).isInfinity(), 'Invalid curve, G*N != O');
}
curves.PresetCurve = PresetCurve;

function defineCurve(name, options) {
  Object.defineProperty(curves, name, {
    configurable: true,
    enumerable: true,
    get: function () {
      var curve = new PresetCurve(options);
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        value: curve
      });
      return curve;
    }
  });
}

defineCurve('p192', {
  type: 'short',
  prime: 'p192',
  p: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',
  b: '64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',
  n: 'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',
  hash: hash.sha256,
  gRed: false,
  g: [
    '188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012',
    '07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811'
  ]
});

defineCurve('p224', {
  type: 'short',
  prime: 'p224',
  p: 'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',
  a: 'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',
  b: 'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',
  n: 'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',
  hash: hash.sha256,
  gRed: false,
  g: [
    'b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21',
    'bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34'
  ]
});

defineCurve('p256', {
  type: 'short',
  prime: null,
  p: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',
  a: 'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',
  b: '5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',
  n: 'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',
  hash: hash.sha256,
  gRed: false,
  g: [
    '6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296',
    '4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5'
  ]
});

defineCurve('p384', {
  type: 'short',
  prime: null,
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff',
  a: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc',
  b: 'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',
  n: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',
  hash: hash.sha384,
  gRed: false,
  g: [
    'aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7',
    '3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f'
  ]
});

defineCurve('p521', {
  type: 'short',
  prime: null,
  p: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff',
  a: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc',
  b: '00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',
  n: '000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',
  hash: hash.sha512,
  gRed: false,
  g: [
    '000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66',
    '00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650'
  ]
});

defineCurve('curve25519', {
  type: 'mont',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '76d06',
  b: '1',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: ['9']
});

defineCurve('ed25519', {
  type: 'edwards',
  prime: 'p25519',
  p: '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',
  a: '-1',
  c: '1',
  d: '52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',
  n: '1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',
  hash: hash.sha256,
  gRed: false,
  g: [
    '216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a',

    '6666666666666666666666666666666666666666666666666666666666666658'
  ]
});

try {
  pre = __webpack_require__(106);
} catch (_) {
  pre = void 0;
}

defineCurve('secp256k1', {
  type: 'short',
  prime: 'k256',
  p: 'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',
  a: '0',
  b: '7',
  n: 'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',
  h: '1',
  hash: hash.sha256,

  beta: '7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',
  lambda: '5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',
  basis: [
    { a: '3086d221a7d46bcde86c90e49284eb15', b: '-e4437ed6010e88286f547fa90abfe4c3' },
    { a: '114ca50f7a8e2f3f657c1108d9d44cfd8', b: '3086d221a7d46bcde86c90e49284eb15' }
  ],

  gRed: false,
  g: [
    '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',
    pre
  ]
});

},
// 33
function (module, exports, __webpack_require__) {

var hash = exports;

hash.utils = __webpack_require__(5);
hash.common = __webpack_require__(13);
hash.sha = __webpack_require__(100);
hash.ripemd = __webpack_require__(104);
hash.hmac = __webpack_require__(105);

hash.sha1 = hash.sha.sha1;
hash.sha256 = hash.sha.sha256;
hash.sha224 = hash.sha.sha224;
hash.sha384 = hash.sha.sha384;
hash.sha512 = hash.sha.sha512;
hash.ripemd160 = hash.ripemd.ripemd160;

},
// 34
function (module, exports, __webpack_require__) {

exports.publicEncrypt = __webpack_require__(131)
exports.privateDecrypt = __webpack_require__(132)

exports.privateEncrypt = function (key, buf) {
  return exports.publicEncrypt(key, buf, true)
}

exports.publicDecrypt = function (key, buf) {
  return exports.privateDecrypt(key, buf, true)
}

},
// 35
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer,
  Transform = __webpack_require__(21).Transform

function throwIfNotStringOrBuffer(val, prefix) {
  if (!Buffer.isBuffer(val) && typeof val != 'string')
    throw new TypeError(prefix + ' must be a string or a buffer')
}

function HashBase(blockSize) {
  Transform.call(this)

  this._block = Buffer.allocUnsafe(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

__webpack_require__(1)(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    this.update(chunk, encoding)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this.digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  throwIfNotStringOrBuffer(data, 'Data')
  if (this._finalized) throw new Error('Digest already called')
  Buffer.isBuffer(data) || (data = Buffer.from(data, encoding))

  var block = this._block,
    offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize; ) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function () {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== void 0) digest = digest.toString(encoding)

  this._block.fill(0)
  this._blockOffset = 0
  for (var i = 0; i < 4; ++i) this._length[i] = 0

  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase

},
// 36
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(8).Buffer,
  inherits = __webpack_require__(1),
  HashBase = __webpack_require__(35),

  ARRAY16 = new Array(16)

var zl = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
]

var zr = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
]

var sl = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
]

var sr = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
]

var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e],
  hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]

function RIPEMD160() {
  HashBase.call(this, 64)

  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(RIPEMD160, HashBase)

RIPEMD160.prototype._update = function () {
  var words = ARRAY16
  for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(j * 4)

  var al = this._a | 0,
    bl = this._b | 0,
    cl = this._c | 0,
    dl = this._d | 0,
    el = this._e | 0,

    ar = this._a | 0,
    br = this._b | 0,
    cr = this._c | 0,
    dr = this._d | 0,
    er = this._e | 0

  for (var i = 0; i < 80; i += 1) {
    var tl, tr
    if (i < 16) {
      tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i])
      tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i])
    } else if (i < 32) {
      tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i])
      tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i])
    } else if (i < 48) {
      tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i])
      tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i])
    } else if (i < 64) {
      tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i])
      tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i])
    } else {
      tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i])
      tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i])
    }

    al = el
    el = dl
    dl = rotl(cl, 10)
    cl = bl
    bl = tl

    ar = er
    er = dr
    dr = rotl(cr, 10)
    cr = br
    br = tr
  }

  var t = (this._b + cl + dr) | 0
  this._b = (this._c + dl + er) | 0
  this._c = (this._d + el + ar) | 0
  this._d = (this._e + al + br) | 0
  this._e = (this._a + bl + cr) | 0
  this._a = t
}

RIPEMD160.prototype._digest = function () {
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  var buffer = Buffer.alloc ? Buffer.alloc(20) : new Buffer(20)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  buffer.writeInt32LE(this._e, 16)
  return buffer
}

function rotl(x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fn1(a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
}

function fn2(a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & c) | (~b & d)) + m + k) | 0, s) + e) | 0
}

function fn3(a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b | ~c) ^ d) + m + k) | 0, s) + e) | 0
}

function fn4(a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & d) | (c & ~d)) + m + k) | 0, s) + e) | 0
}

function fn5(a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ (c | ~d)) + m + k) | 0, s) + e) | 0
}

module.exports = RIPEMD160

},
// 37
function (module, exports, __webpack_require__) {

exports = module.exports = function (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm)
    throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = __webpack_require__(68)
exports.sha1 = __webpack_require__(69)
exports.sha224 = __webpack_require__(70)
exports.sha256 = __webpack_require__(38)
exports.sha384 = __webpack_require__(71)
exports.sha512 = __webpack_require__(39)

},
// 38
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256() {
  this.init()

  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch(x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj(x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0(x) {
  return ((x >>> 2) | (x << 30)) ^ ((x >>> 13) | (x << 19)) ^ ((x >>> 22) | (x << 10))
}

function sigma1(x) {
  return ((x >>> 6) | (x << 26)) ^ ((x >>> 11) | (x << 21)) ^ ((x >>> 25) | (x << 7))
}

function gamma0(x) {
  return ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)
}

function gamma1(x) {
  return ((x >>> 17) | (x << 15)) ^ ((x >>> 19) | (x << 13)) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w,

    a = this._a | 0,
    b = this._b | 0,
    c = this._c | 0,
    d = this._d | 0,
    e = this._e | 0,
    f = this._f | 0,
    g = this._g | 0,
    h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i)
    W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0,
      T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256

},
// 39
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512() {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch(x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj(x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0(x, xl) {
  return ((x >>> 28) | (xl << 4)) ^ ((xl >>> 2) | (x << 30)) ^ ((xl >>> 7) | (x << 25))
}

function sigma1(x, xl) {
  return ((x >>> 14) | (xl << 18)) ^ ((x >>> 18) | (xl << 14)) ^ ((xl >>> 9) | (x << 23))
}

function Gamma0(x, xl) {
  return ((x >>> 1) | (xl << 31)) ^ ((x >>> 8) | (xl << 24)) ^ (x >>> 7)
}

function Gamma0l(x, xl) {
  return ((x >>> 1) | (xl << 31)) ^ ((x >>> 8) | (xl << 24)) ^ ((x >>> 7) | (xl << 25))
}

function Gamma1(x, xl) {
  return ((x >>> 19) | (xl << 13)) ^ ((xl >>> 29) | (x << 3)) ^ (x >>> 6)
}

function Gamma1l(x, xl) {
  return ((x >>> 19) | (xl << 13)) ^ ((xl >>> 29) | (x << 3)) ^ ((x >>> 6) | (xl << 26))
}

function getCarry(a, b) {
  return a >>> 0 < b >>> 0 ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w,

    ah = this._ah | 0,
    bh = this._bh | 0,
    ch = this._ch | 0,
    dh = this._dh | 0,
    eh = this._eh | 0,
    fh = this._fh | 0,
    gh = this._gh | 0,
    hh = this._hh | 0,

    al = this._al | 0,
    bl = this._bl | 0,
    cl = this._cl | 0,
    dl = this._dl | 0,
    el = this._el | 0,
    fl = this._fl | 0,
    gl = this._gl | 0,
    hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 30],
      xl = W[i - 30 + 1],
      gamma0 = Gamma0(xh, xl),
      gamma0l = Gamma0l(xl, xh),

      gamma1 = Gamma1((xh = W[i - 4]), (xl = W[i - 4 + 1])),
      gamma1l = Gamma1l(xl, xh),

      Wi7h = W[i - 14],
      Wi7l = W[i - 14 + 1],

      Wi16h = W[i - 32],
      Wi16l = W[i - 32 + 1],

      Wil = (gamma0l + Wi7l) | 0,
      Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wih = (Wih + gamma1 + getCarry((Wil = (Wil + gamma1l) | 0), gamma1l)) | 0
    Wih = (Wih + Wi16h + getCarry((Wil = (Wil + Wi16l) | 0), Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch),
      majl = maj(al, bl, cl),

      sigma0h = sigma0(ah, al),
      sigma0l = sigma0(al, ah),
      sigma1h = sigma1(eh, el),
      sigma1l = sigma1(el, eh),

      Kih = K[j],
      Kil = K[j + 1],

      chh = Ch(eh, fh, gh),
      chl = Ch(el, fl, gl),

      t1l = (hl + sigma1l) | 0,
      t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1h = (t1h + chh + getCarry((t1l = (t1l + chl) | 0), chl)) | 0
    t1h = (t1h + Kih + getCarry((t1l = (t1l + Kil) | 0), Kil)) | 0
    t1h = (t1h + Wih + getCarry((t1l = (t1l + Wil) | 0), Wil)) | 0

    var t2l = (sigma0l + majl) | 0,
      t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    eh = (dh + t1h + getCarry((el = (dl + t1l) | 0), dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    ah = (t1h + t2h + getCarry((al = (t1l + t2l) | 0), t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE(h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512

},
// 40
function (module) {

module.exports = JSON.parse(
  '{"sha224WithRSAEncryption":{"sign":"rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"RSA-SHA224":{"sign":"ecdsa/rsa","hash":"sha224","id":"302d300d06096086480165030402040500041c"},"sha256WithRSAEncryption":{"sign":"rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"RSA-SHA256":{"sign":"ecdsa/rsa","hash":"sha256","id":"3031300d060960864801650304020105000420"},"sha384WithRSAEncryption":{"sign":"rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"RSA-SHA384":{"sign":"ecdsa/rsa","hash":"sha384","id":"3041300d060960864801650304020205000430"},"sha512WithRSAEncryption":{"sign":"rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA512":{"sign":"ecdsa/rsa","hash":"sha512","id":"3051300d060960864801650304020305000440"},"RSA-SHA1":{"sign":"rsa","hash":"sha1","id":"3021300906052b0e03021a05000414"},"ecdsa-with-SHA1":{"sign":"ecdsa","hash":"sha1","id":""},"sha256":{"sign":"ecdsa","hash":"sha256","id":""},"sha224":{"sign":"ecdsa","hash":"sha224","id":""},"sha384":{"sign":"ecdsa","hash":"sha384","id":""},"sha512":{"sign":"ecdsa","hash":"sha512","id":""},"DSA-SHA":{"sign":"dsa","hash":"sha1","id":""},"DSA-SHA1":{"sign":"dsa","hash":"sha1","id":""},"DSA":{"sign":"dsa","hash":"sha1","id":""},"DSA-WITH-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-SHA224":{"sign":"dsa","hash":"sha224","id":""},"DSA-WITH-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-SHA256":{"sign":"dsa","hash":"sha256","id":""},"DSA-WITH-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-SHA384":{"sign":"dsa","hash":"sha384","id":""},"DSA-WITH-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-SHA512":{"sign":"dsa","hash":"sha512","id":""},"DSA-RIPEMD160":{"sign":"dsa","hash":"rmd160","id":""},"ripemd160WithRSA":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"RSA-RIPEMD160":{"sign":"rsa","hash":"rmd160","id":"3021300906052b2403020105000414"},"md5WithRSAEncryption":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"},"RSA-MD5":{"sign":"rsa","hash":"md5","id":"3020300c06082a864886f70d020505000410"}}'
);

},
// 41
function (module, exports, __webpack_require__) {

var native = __webpack_require__(11),

  checkParameters = __webpack_require__(23),
  defaultEncoding = __webpack_require__(24),
  toBuffer = __webpack_require__(25)

function nativePBKDF2(password, salt, iterations, keylen, digest, callback) {
  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')

  if (typeof digest == 'function') {
    callback = digest
    digest = 'sha1'
  }
  if (typeof callback != 'function') throw new Error('No callback provided to pbkdf2')

  return native.pbkdf2(password, salt, iterations, keylen, digest, callback)
}

function nativePBKDF2Sync(password, salt, iterations, keylen, digest) {
  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')
  digest = digest || 'sha1'
  return native.pbkdf2Sync(password, salt, iterations, keylen, digest)
}

if (!native.pbkdf2Sync || native.pbkdf2Sync.toString().indexOf('keylen, digest') < 0) {
  exports.pbkdf2Sync = __webpack_require__(42)
  exports.pbkdf2 = __webpack_require__(75)
} else {
  exports.pbkdf2Sync = nativePBKDF2Sync
  exports.pbkdf2 = nativePBKDF2
}

},
// 42
function (module, exports, __webpack_require__) {

var sizes = {
  md5: 16,
  sha1: 20,
  sha224: 28,
  sha256: 32,
  sha384: 48,
  sha512: 64,
  rmd160: 20,
  ripemd160: 20
}

var createHmac = __webpack_require__(22),
  Buffer = __webpack_require__(0).Buffer,

  checkParameters = __webpack_require__(23),
  defaultEncoding = __webpack_require__(24),
  toBuffer = __webpack_require__(25)

function pbkdf2(password, salt, iterations, keylen, digest) {
  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')

  digest = digest || 'sha1'

  var DK = Buffer.allocUnsafe(keylen),
    block1 = Buffer.allocUnsafe(salt.length + 4)
  salt.copy(block1, 0, 0, salt.length)

  var hLen = sizes[digest],
    l = Math.ceil(keylen / hLen)

  for (var destPos = 0, i = 1; i <= l; i++) {
    block1.writeUInt32BE(i, salt.length)

    var T = createHmac(digest, password).update(block1).digest()

    for (var U = T, j = 1; j < iterations; j++) {
      U = createHmac(digest, password).update(U).digest()
      for (var k = 0; k < hLen; k++) T[k] ^= U[k]
    }

    T.copy(DK, destPos)
    destPos += hLen
  }

  return DK
}

module.exports = pbkdf2

},
// 43
function (module, exports) {

exports.readUInt32BE = function (bytes, off) {
  var res = (bytes[0 + off] << 24) |
    (bytes[1 + off] << 16) |
    (bytes[2 + off] << 8) |
    bytes[3 + off];
  return res >>> 0;
};

exports.writeUInt32BE = function (bytes, value, off) {
  bytes[0 + off] = value >>> 24;
  bytes[1 + off] = (value >>> 16) & 0xff;
  bytes[2 + off] = (value >>> 8) & 0xff;
  bytes[3 + off] = value & 0xff;
};

exports.ip = function (inL, inR, out, off) {
  var outL = 0,
    outR = 0;

  for (var i = 6; i >= 0; i -= 2) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
    }
    for (j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }
  }

  for (i = 6; i >= 0; i -= 2) {
    for (j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
    }
    for (j = 1; j <= 25; j += 8) {
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.rip = function (inL, inR, out, off) {
  var outL = 0,
    outR = 0;

  for (var i = 0; i < 4; i++)
    for (var j = 24; j >= 0; j -= 8) {
      outL <<= 1;
      outL |= (inR >>> (j + i)) & 1;
      outL <<= 1;
      outL |= (inL >>> (j + i)) & 1;
    }

  for (i = 4; i < 8; i++)
    for (j = 24; j >= 0; j -= 8) {
      outR <<= 1;
      outR |= (inR >>> (j + i)) & 1;
      outR <<= 1;
      outR |= (inL >>> (j + i)) & 1;
    }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.pc1 = function (inL, inR, out, off) {
  var outL = 0,
    outR = 0;

  for (var i = 7; i >= 5; i--) {
    for (var j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inR >> (j + i)) & 1;
    }
    for (j = 0; j <= 24; j += 8) {
      outL <<= 1;
      outL |= (inL >> (j + i)) & 1;
    }
  }
  for (j = 0; j <= 24; j += 8) {
    outL <<= 1;
    outL |= (inR >> (j + i)) & 1;
  }

  for (i = 1; i <= 3; i++) {
    for (j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inR >> (j + i)) & 1;
    }
    for (j = 0; j <= 24; j += 8) {
      outR <<= 1;
      outR |= (inL >> (j + i)) & 1;
    }
  }
  for (j = 0; j <= 24; j += 8) {
    outR <<= 1;
    outR |= (inL >> (j + i)) & 1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.r28shl = function (num, shift) {
  return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
};

var pc2table = [
  14, 11, 17, 4, 27, 23, 25, 0,
  13, 22, 7, 18, 5, 9, 16, 24,
  2, 20, 12, 21, 1, 8, 15, 26,

  15, 4, 25, 19, 9, 1, 26, 16,
  5, 11, 23, 8, 12, 7, 17, 0,
  22, 3, 10, 14, 6, 20, 27, 24
];

exports.pc2 = function (inL, inR, out, off) {
  var outL = 0,
    outR = 0,

    len = pc2table.length >>> 1;
  for (var i = 0; i < len; i++) {
    outL <<= 1;
    outL |= (inL >>> pc2table[i]) & 0x1;
  }
  for (i = len; i < pc2table.length; i++) {
    outR <<= 1;
    outR |= (inR >>> pc2table[i]) & 0x1;
  }

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

exports.expand = function (r, out, off) {
  var outL = 0,
    outR = 0;

  outL = ((r & 1) << 5) | (r >>> 27);
  for (var i = 23; i >= 15; i -= 4) {
    outL <<= 6;
    outL |= (r >>> i) & 0x3f;
  }
  for (i = 11; i >= 3; i -= 4) {
    outR |= (r >>> i) & 0x3f;
    outR <<= 6;
  }
  outR |= ((r & 0x1f) << 1) | (r >>> 31);

  out[off + 0] = outL >>> 0;
  out[off + 1] = outR >>> 0;
};

var sTable = [
  14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1,
  3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8,
  4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7,
  15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13,

  15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14,
  9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5,
  0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2,
  5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9,

  10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10,
  1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1,
  13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7,
  11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12,

  7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3,
  1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9,
  10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8,
  15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14,

  2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1,
  8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6,
  4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13,
  15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3,

  12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5,
  0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8,
  9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10,
  7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13,

  4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10,
  3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6,
  1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7,
  10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12,

  13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4,
  10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2,
  7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13,
  0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11
];

exports.substitute = function (inL, inR) {
  var out = 0;
  for (var i = 0; i < 4; i++) {
    out <<= 4;
    out |= sTable[i * 0x40 + ((inL >>> (18 - i * 6)) & 0x3f)];
  }
  for (i = 0; i < 4; i++) {
    out <<= 4;
    out |= sTable[256 + i * 0x40 + ((inR >>> (18 - i * 6)) & 0x3f)];
  }
  return out >>> 0;
};

var permuteTable = [
  16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22,
  30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7
];

exports.permute = function (num) {
  var out = 0;
  for (var i = 0; i < permuteTable.length; i++) {
    out <<= 1;
    out |= (num >>> permuteTable[i]) & 0x1;
  }
  return out >>> 0;
};

exports.padSplit = function (num, size, group) {
  var str = num.toString(2);
  while (str.length < size) str = '0' + str;

  var out = [];
  for (var i = 0; i < size; i += group) out.push(str.slice(i, i + group));
  return out.join(' ');
};

},
// 44
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(3),
  inherits = __webpack_require__(1),

  utils = __webpack_require__(43),
  Cipher = __webpack_require__(26);

function DESState() {
  this.tmp = new Array(2);
  this.keys = null;
}

function DES(options) {
  Cipher.call(this, options);

  var state = new DESState();
  this._desState = state;

  this.deriveKeys(state, options.key);
}
inherits(DES, Cipher);
module.exports = DES;

DES.create = function (options) {
  return new DES(options);
};

var shiftTable = [
  1, 1, 2, 2, 2, 2, 2, 2,
  1, 2, 2, 2, 2, 2, 2, 1
];

DES.prototype.deriveKeys = function (state, key) {
  state.keys = new Array(32);

  assert.equal(key.length, this.blockSize, 'Invalid key length');

  var kL = utils.readUInt32BE(key, 0),
    kR = utils.readUInt32BE(key, 4);

  utils.pc1(kL, kR, state.tmp, 0);
  kL = state.tmp[0];
  kR = state.tmp[1];
  for (var i = 0; i < state.keys.length; i += 2) {
    var shift = shiftTable[i >>> 1];
    kL = utils.r28shl(kL, shift);
    kR = utils.r28shl(kR, shift);
    utils.pc2(kL, kR, state.keys, i);
  }
};

DES.prototype._update = function (inp, inOff, out, outOff) {
  var state = this._desState,

    l = utils.readUInt32BE(inp, inOff),
    r = utils.readUInt32BE(inp, inOff + 4);

  utils.ip(l, r, state.tmp, 0);
  l = state.tmp[0];
  r = state.tmp[1];

  this.type === 'encrypt'
    ? this._encrypt(state, l, r, state.tmp, 0)
    : this._decrypt(state, l, r, state.tmp, 0);

  l = state.tmp[0];
  r = state.tmp[1];

  utils.writeUInt32BE(out, l, outOff);
  utils.writeUInt32BE(out, r, outOff + 4);
};

DES.prototype._pad = function (buffer, off) {
  for (var value = buffer.length - off, i = off; i < buffer.length; i++)
    buffer[i] = value;

  return true;
};

DES.prototype._unpad = function (buffer) {
  var pad = buffer[buffer.length - 1];
  for (var i = buffer.length - pad; i < buffer.length; i++)
    assert.equal(buffer[i], pad);

  return buffer.slice(0, buffer.length - pad);
};

DES.prototype._encrypt = function (state, lStart, rStart, out, off) {
  var l = lStart,
    r = rStart;

  for (var i = 0; i < state.keys.length; i += 2) {
    var keyL = state.keys[i],
      keyR = state.keys[i + 1];

    utils.expand(r, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR),

      t = r;
    r = (l ^ utils.permute(s)) >>> 0;
    l = t;
  }

  utils.rip(r, l, out, off);
};

DES.prototype._decrypt = function (state, lStart, rStart, out, off) {
  var l = rStart,
    r = lStart;

  for (var i = state.keys.length - 2; i >= 0; i -= 2) {
    var keyL = state.keys[i],
      keyR = state.keys[i + 1];

    utils.expand(l, state.tmp, 0);

    keyL ^= state.tmp[0];
    keyR ^= state.tmp[1];
    var s = utils.substitute(keyL, keyR),

      t = l;
    l = (r ^ utils.permute(s)) >>> 0;
    r = t;
  }

  utils.rip(l, r, out, off);
};

},
// 45
function (module, exports, __webpack_require__) {

var xor = __webpack_require__(12),
  Buffer = __webpack_require__(0).Buffer,
  incr32 = __webpack_require__(46)

function getBlock(self) {
  var out = self._cipher.encryptBlockRaw(self._prev)
  incr32(self._prev)
  return out
}

var blockSize = 16
exports.encrypt = function (self, chunk) {
  var chunkNum = Math.ceil(chunk.length / blockSize),
    start = self._cache.length
  self._cache = Buffer.concat([self._cache, Buffer.allocUnsafe(chunkNum * blockSize)])
  for (var i = 0; i < chunkNum; i++) {
    var out = getBlock(self),
      offset = start + i * blockSize
    self._cache.writeUInt32BE(out[0], offset + 0)
    self._cache.writeUInt32BE(out[1], offset + 4)
    self._cache.writeUInt32BE(out[2], offset + 8)
    self._cache.writeUInt32BE(out[3], offset + 12)
  }
  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}

},
// 46
function (module) {

function incr32(iv) {
  for (var item, len = iv.length; len--; )
    if ((item = iv.readUInt8(len)) === 255) iv.writeUInt8(0, len)
    else {
      item++
      iv.writeUInt8(item, len)
      break
    }
}
module.exports = incr32

},
// 47
function (module) {

module.exports = JSON.parse(
  '{"aes-128-ecb":{"cipher":"AES","key":128,"iv":0,"mode":"ECB","type":"block"},"aes-192-ecb":{"cipher":"AES","key":192,"iv":0,"mode":"ECB","type":"block"},"aes-256-ecb":{"cipher":"AES","key":256,"iv":0,"mode":"ECB","type":"block"},"aes-128-cbc":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes-192-cbc":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes-256-cbc":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes128":{"cipher":"AES","key":128,"iv":16,"mode":"CBC","type":"block"},"aes192":{"cipher":"AES","key":192,"iv":16,"mode":"CBC","type":"block"},"aes256":{"cipher":"AES","key":256,"iv":16,"mode":"CBC","type":"block"},"aes-128-cfb":{"cipher":"AES","key":128,"iv":16,"mode":"CFB","type":"stream"},"aes-192-cfb":{"cipher":"AES","key":192,"iv":16,"mode":"CFB","type":"stream"},"aes-256-cfb":{"cipher":"AES","key":256,"iv":16,"mode":"CFB","type":"stream"},"aes-128-cfb8":{"cipher":"AES","key":128,"iv":16,"mode":"CFB8","type":"stream"},"aes-192-cfb8":{"cipher":"AES","key":192,"iv":16,"mode":"CFB8","type":"stream"},"aes-256-cfb8":{"cipher":"AES","key":256,"iv":16,"mode":"CFB8","type":"stream"},"aes-128-cfb1":{"cipher":"AES","key":128,"iv":16,"mode":"CFB1","type":"stream"},"aes-192-cfb1":{"cipher":"AES","key":192,"iv":16,"mode":"CFB1","type":"stream"},"aes-256-cfb1":{"cipher":"AES","key":256,"iv":16,"mode":"CFB1","type":"stream"},"aes-128-ofb":{"cipher":"AES","key":128,"iv":16,"mode":"OFB","type":"stream"},"aes-192-ofb":{"cipher":"AES","key":192,"iv":16,"mode":"OFB","type":"stream"},"aes-256-ofb":{"cipher":"AES","key":256,"iv":16,"mode":"OFB","type":"stream"},"aes-128-ctr":{"cipher":"AES","key":128,"iv":16,"mode":"CTR","type":"stream"},"aes-192-ctr":{"cipher":"AES","key":192,"iv":16,"mode":"CTR","type":"stream"},"aes-256-ctr":{"cipher":"AES","key":256,"iv":16,"mode":"CTR","type":"stream"},"aes-128-gcm":{"cipher":"AES","key":128,"iv":12,"mode":"GCM","type":"auth"},"aes-192-gcm":{"cipher":"AES","key":192,"iv":12,"mode":"GCM","type":"auth"},"aes-256-gcm":{"cipher":"AES","key":256,"iv":12,"mode":"GCM","type":"auth"}}'
);

},
// 48
function (module, exports, __webpack_require__) {

var aes = __webpack_require__(16),
  Buffer = __webpack_require__(0).Buffer,
  Transform = __webpack_require__(6),
  inherits = __webpack_require__(1),
  GHASH = __webpack_require__(88),
  xor = __webpack_require__(12),
  incr32 = __webpack_require__(46)

function xorTest(a, b) {
  var out = 0
  a.length === b.length || out++

  var len = Math.min(a.length, b.length)
  for (var i = 0; i < len; ++i) out += a[i] ^ b[i]

  return out
}

function calcIv(self, iv, ck) {
  if (iv.length === 12) {
    self._finID = Buffer.concat([iv, Buffer.from([0, 0, 0, 1])])
    return Buffer.concat([iv, Buffer.from([0, 0, 0, 2])])
  }
  var ghash = new GHASH(ck),
    len = iv.length,
    toPad = len % 16
  ghash.update(iv)
  if (toPad) {
    toPad = 16 - toPad
    ghash.update(Buffer.alloc(toPad, 0))
  }
  ghash.update(Buffer.alloc(8, 0))
  var ivBits = len * 8,
    tail = Buffer.alloc(8)
  tail.writeUIntBE(ivBits, 0, 8)
  ghash.update(tail)
  self._finID = ghash.state
  var out = Buffer.from(self._finID)
  incr32(out)
  return out
}
function StreamCipher(mode, key, iv, decrypt) {
  Transform.call(this)

  var h = Buffer.alloc(4, 0)

  this._cipher = new aes.AES(key)
  var ck = this._cipher.encryptBlock(h)
  this._ghash = new GHASH(ck)
  iv = calcIv(this, iv, ck)

  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._alen = 0
  this._len = 0
  this._mode = mode

  this._authTag = null
  this._called = false
}

inherits(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  if (!this._called && this._alen) {
    var rump = 16 - (this._alen % 16)
    if (rump < 16) {
      rump = Buffer.alloc(rump, 0)
      this._ghash.update(rump)
    }
  }

  this._called = true
  var out = this._mode.encrypt(this, chunk)
  this._decrypt ? this._ghash.update(chunk) : this._ghash.update(out)

  this._len += chunk.length
  return out
}

StreamCipher.prototype._final = function () {
  if (this._decrypt && !this._authTag)
    throw new Error('Unsupported state or unable to authenticate data')

  var tag = xor(
    this._ghash.final(this._alen * 8, this._len * 8),
    this._cipher.encryptBlock(this._finID)
  )
  if (this._decrypt && xorTest(tag, this._authTag))
    throw new Error('Unsupported state or unable to authenticate data')

  this._authTag = tag
  this._cipher.scrub()
}

StreamCipher.prototype.getAuthTag = function () {
  if (this._decrypt || !Buffer.isBuffer(this._authTag))
    throw new Error('Attempting to get auth tag in unsupported state')

  return this._authTag
}

StreamCipher.prototype.setAuthTag = function (tag) {
  if (!this._decrypt)
    throw new Error('Attempting to set auth tag in unsupported state')

  this._authTag = tag
}

StreamCipher.prototype.setAAD = function (buf) {
  if (this._called) throw new Error('Attempting to set AAD in unsupported state')

  this._ghash.update(buf)
  this._alen += buf.length
}

module.exports = StreamCipher

},
// 49
function (module, exports, __webpack_require__) {

var aes = __webpack_require__(16),
  Buffer = __webpack_require__(0).Buffer,
  Transform = __webpack_require__(6)

function StreamCipher(mode, key, iv, decrypt) {
  Transform.call(this)

  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._cache = Buffer.allocUnsafe(0)
  this._secCache = Buffer.allocUnsafe(0)
  this._decrypt = decrypt
  this._mode = mode
}

__webpack_require__(1)(StreamCipher, Transform)

StreamCipher.prototype._update = function (chunk) {
  return this._mode.encrypt(this, chunk, this._decrypt)
}

StreamCipher.prototype._final = function () {
  this._cipher.scrub()
}

module.exports = StreamCipher

},
// 50
function (module, exports, __webpack_require__) {

var randomBytes = __webpack_require__(7);
module.exports = findPrime;
findPrime.simpleSieve = simpleSieve;
findPrime.fermatTest = fermatTest;
var BN = __webpack_require__(2),
  TWENTYFOUR = new BN(24),
  millerRabin = new (__webpack_require__(51))(),
  ONE = new BN(1),
  TWO = new BN(2),
  FIVE = new BN(5),
  TEN = new BN(10),
  THREE = new BN(3),
  ELEVEN = new BN(11),
  FOUR = new BN(4),
  primes = null;

function _getPrimes() {
  if (primes !== null) return primes;

  var limit = 0x100000,
    res = [];
  res[0] = 2;
  for (var i = 1, k = 3; k < limit; k += 2) {
    var sqrt = Math.ceil(Math.sqrt(k));
    for (var j = 0; j < i && res[j] <= sqrt && k % res[j] != 0; j++);

    if (i !== j && res[j] <= sqrt) continue;

    res[i++] = k;
  }
  primes = res;
  return res;
}

function simpleSieve(p) {
  for (var primes = _getPrimes(), i = 0; i < primes.length; i++)
    if (p.modn(primes[i]) === 0) return p.cmpn(primes[i]) === 0;

  return true;
}

function fermatTest(p) {
  var red = BN.mont(p);
  return TWO.toRed(red).redPow(p.subn(1)).fromRed().cmpn(1) === 0;
}

function findPrime(bits, gen) {
  if (bits < 16)
    return new BN(gen === 2 || gen === 5 ? [0x8c, 0x7b] : [0x8c, 0x27]);

  gen = new BN(gen);

  for (var num, n2; ; ) {
    num = new BN(randomBytes(Math.ceil(bits / 8)));
    while (num.bitLength() > bits) num.ishrn(1);

    num.isEven() && num.iadd(ONE);
    num.testn(1) || num.iadd(TWO);

    if (!gen.cmp(TWO)) while (num.mod(TWENTYFOUR).cmp(ELEVEN)) num.iadd(FOUR);
    else if (!gen.cmp(FIVE)) while (num.mod(TEN).cmp(THREE)) num.iadd(FOUR);

    if (simpleSieve((n2 = num.shrn(1))) && simpleSieve(num) &&
        fermatTest(n2) && fermatTest(num) &&
        millerRabin.test(n2) && millerRabin.test(num))
      return num;
  }
}

},
// 51
function (module, exports, __webpack_require__) {

var bn = __webpack_require__(2),
  brorand = __webpack_require__(29);

function MillerRabin(rand) {
  this.rand = rand || new brorand.Rand();
}
module.exports = MillerRabin;

MillerRabin.create = function (rand) {
  return new MillerRabin(rand);
};

MillerRabin.prototype._randbelow = function (n) {
  var len = n.bitLength(),
    min_bytes = Math.ceil(len / 8);

  do {
    var a = new bn(this.rand.generate(min_bytes));
  } while (a.cmp(n) >= 0);

  return a;
};

MillerRabin.prototype._randrange = function (start, stop) {
  var size = stop.sub(start);
  return start.add(this._randbelow(size));
};

MillerRabin.prototype.test = function (n, k, cb) {
  var len = n.bitLength(),
    red = bn.mont(n),
    rone = new bn(1).toRed(red);

  k || (k = Math.max(1, (len / 48) | 0));

  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++);

  var prime = true;
  for (var d = n.shrn(s), rn1 = n1.toRed(red); k > 0; k--) {
    var a = this._randrange(new bn(2), n1);
    cb && cb(a);

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0) continue;

    for (var i = 1; i < s; i++) {
      if ((x = x.redSqr()).cmp(rone) === 0) return false;
      if (x.cmp(rn1) === 0) break;
    }

    if (i === s) return false;
  }

  return prime;
};

MillerRabin.prototype.getDivisor = function (n, k) {
  var len = n.bitLength(),
    red = bn.mont(n),
    rone = new bn(1).toRed(red);

  k || (k = Math.max(1, (len / 48) | 0));

  var n1 = n.subn(1);
  for (var s = 0; !n1.testn(s); s++);

  for (var d = n.shrn(s), rn1 = n1.toRed(red); k > 0; k--) {
    var a = this._randrange(new bn(2), n1),

      g = n.gcd(a);
    if (g.cmpn(1) !== 0) return g;

    var x = a.toRed(red).redPow(d);
    if (x.cmp(rone) === 0 || x.cmp(rn1) === 0) continue;

    for (var i = 1; i < s; i++) {
      if ((x = x.redSqr()).cmp(rone) === 0) return x.fromRed().subn(1).gcd(n);
      if (x.cmp(rn1) === 0) break;
    }

    if (i === s) return (x = x.redSqr()).fromRed().subn(1).gcd(n);
  }

  return false;
};

},
// 52
function (module, exports) {

var utils = exports;

function toArray(msg, enc) {
  if (Array.isArray(msg)) return msg.slice();
  if (!msg) return [];
  var res = [];
  if (typeof msg != 'string') {
    for (var i = 0; i < msg.length; i++) res[i] = msg[i] | 0;
    return res;
  }
  if (enc === 'hex') {
    if ((msg = msg.replace(/[^a-z0-9]+/gi, '')).length % 2 != 0) msg = '0' + msg;
    for (i = 0; i < msg.length; i += 2)
      res.push(parseInt(msg[i] + msg[i + 1], 16));
  } else
    for (i = 0; i < msg.length; i++) {
      var c = msg.charCodeAt(i),
        hi = c >> 8,
        lo = c & 0xff;
      hi ? res.push(hi, lo) : res.push(lo);
    }

  return res;
}
utils.toArray = toArray;

function zero2(word) {
  return word.length === 1 ? '0' + word : word;
}
utils.zero2 = zero2;

function toHex(msg) {
  var res = '';
  for (var i = 0; i < msg.length; i++) res += zero2(msg[i].toString(16));
  return res;
}
utils.toHex = toHex;

utils.encode = function (arr, enc) {
  return enc === 'hex' ? toHex(arr) : arr;
};

},
// 53
function (module, exports, __webpack_require__) {

var curve = exports;

curve.base = __webpack_require__(18);
curve.short = __webpack_require__(97);
curve.mont = __webpack_require__(98);
curve.edwards = __webpack_require__(99);

},
// 54
function (module, exports, __webpack_require__) {

var rotr32 = __webpack_require__(5).rotr32;

function ft_1(s, x, y, z) {
  return s === 0
    ? ch32(x, y, z)
    : s === 1 || s === 3
    ? p32(x, y, z)
    : s === 2
    ? maj32(x, y, z)
    : void 0;
}
exports.ft_1 = ft_1;

function ch32(x, y, z) {
  return (x & y) ^ (~x & z);
}
exports.ch32 = ch32;

function maj32(x, y, z) {
  return (x & y) ^ (x & z) ^ (y & z);
}
exports.maj32 = maj32;

function p32(x, y, z) {
  return x ^ y ^ z;
}
exports.p32 = p32;

function s0_256(x) {
  return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
}
exports.s0_256 = s0_256;

function s1_256(x) {
  return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
}
exports.s1_256 = s1_256;

function g0_256(x) {
  return rotr32(x, 7) ^ rotr32(x, 18) ^ (x >>> 3);
}
exports.g0_256 = g0_256;

function g1_256(x) {
  return rotr32(x, 17) ^ rotr32(x, 19) ^ (x >>> 10);
}
exports.g1_256 = g1_256;

},
// 55
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  common = __webpack_require__(13),
  shaCommon = __webpack_require__(54),
  assert = __webpack_require__(3),

  sum32 = utils.sum32,
  sum32_4 = utils.sum32_4,
  sum32_5 = utils.sum32_5,
  ch32 = shaCommon.ch32,
  maj32 = shaCommon.maj32,
  s0_256 = shaCommon.s0_256,
  s1_256 = shaCommon.s1_256,
  g0_256 = shaCommon.g0_256,
  g1_256 = shaCommon.g1_256,

  BlockHash = common.BlockHash;

var sha256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
  0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
  0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
  0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function SHA256() {
  if (!(this instanceof SHA256)) return new SHA256();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  this.k = sha256_K;
  this.W = new Array(64);
}
utils.inherits(SHA256, BlockHash);
module.exports = SHA256;

SHA256.blockSize = 512;
SHA256.outSize = 256;
SHA256.hmacStrength = 192;
SHA256.padLength = 64;

SHA256.prototype._update = function (msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++) W[i] = msg[start + i];
  for (; i < W.length; i++)
    W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);

  var a = this.h[0],
    b = this.h[1],
    c = this.h[2],
    d = this.h[3],
    e = this.h[4],
    f = this.h[5],
    g = this.h[6],
    h = this.h[7];

  assert(this.k.length === W.length);
  for (i = 0; i < W.length; i++) {
    var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]),
      T2 = sum32(s0_256(a), maj32(a, b, c));
    h = g;
    g = f;
    f = e;
    e = sum32(d, T1);
    d = c;
    c = b;
    b = a;
    a = sum32(T1, T2);
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
  this.h[5] = sum32(this.h[5], f);
  this.h[6] = sum32(this.h[6], g);
  this.h[7] = sum32(this.h[7], h);
};

SHA256.prototype._digest = function (enc) {
  return enc === 'hex' ? utils.toHex32(this.h, 'big') : utils.split32(this.h, 'big');
};

},
// 56
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  common = __webpack_require__(13),
  assert = __webpack_require__(3),

  rotr64_hi = utils.rotr64_hi,
  rotr64_lo = utils.rotr64_lo,
  shr64_hi = utils.shr64_hi,
  shr64_lo = utils.shr64_lo,
  sum64 = utils.sum64,
  sum64_hi = utils.sum64_hi,
  sum64_lo = utils.sum64_lo,
  sum64_4_hi = utils.sum64_4_hi,
  sum64_4_lo = utils.sum64_4_lo,
  sum64_5_hi = utils.sum64_5_hi,
  sum64_5_lo = utils.sum64_5_lo,

  BlockHash = common.BlockHash;

var sha512_K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
];

function SHA512() {
  if (!(this instanceof SHA512)) return new SHA512();

  BlockHash.call(this);
  this.h = [
    0x6a09e667, 0xf3bcc908, 0xbb67ae85, 0x84caa73b,
    0x3c6ef372, 0xfe94f82b, 0xa54ff53a, 0x5f1d36f1,
    0x510e527f, 0xade682d1, 0x9b05688c, 0x2b3e6c1f,
    0x1f83d9ab, 0xfb41bd6b, 0x5be0cd19, 0x137e2179
  ];
  this.k = sha512_K;
  this.W = new Array(160);
}
utils.inherits(SHA512, BlockHash);
module.exports = SHA512;

SHA512.blockSize = 1024;
SHA512.outSize = 512;
SHA512.hmacStrength = 192;
SHA512.padLength = 128;

SHA512.prototype._prepareBlock = function (msg, start) {
  var W = this.W;

  for (var i = 0; i < 32; i++) W[i] = msg[start + i];
  for (; i < W.length; i += 2) {
    var c0_hi = g1_512_hi(W[i - 4], W[i - 3]),
      c0_lo = g1_512_lo(W[i - 4], W[i - 3]),
      c1_hi = W[i - 14],
      c1_lo = W[i - 13],
      c2_hi = g0_512_hi(W[i - 30], W[i - 29]),
      c2_lo = g0_512_lo(W[i - 30], W[i - 29]),
      c3_hi = W[i - 32],
      c3_lo = W[i - 31];

    W[i] = sum64_4_hi(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
    W[i + 1] = sum64_4_lo(c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo);
  }
};

SHA512.prototype._update = function (msg, start) {
  this._prepareBlock(msg, start);

  var W = this.W,

    ah = this.h[0],
    al = this.h[1],
    bh = this.h[2],
    bl = this.h[3],
    ch = this.h[4],
    cl = this.h[5],
    dh = this.h[6],
    dl = this.h[7],
    eh = this.h[8],
    el = this.h[9],
    fh = this.h[10],
    fl = this.h[11],
    gh = this.h[12],
    gl = this.h[13],
    hh = this.h[14],
    hl = this.h[15];

  assert(this.k.length === W.length);
  for (var i = 0; i < W.length; i += 2) {
    var c0_hi = hh,
      c0_lo = hl,
      c1_hi = s1_512_hi(eh, el),
      c1_lo = s1_512_lo(eh, el),
      c2_hi = ch64_hi(eh, el, fh, fl, gh, gl),
      c2_lo = ch64_lo(eh, el, fh, fl, gh, gl),
      c3_hi = this.k[i],
      c3_lo = this.k[i + 1],
      c4_hi = W[i],
      c4_lo = W[i + 1];

    var T1_hi = sum64_5_hi(
      c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo
    );
    var T1_lo = sum64_5_lo(
      c0_hi, c0_lo, c1_hi, c1_lo, c2_hi, c2_lo, c3_hi, c3_lo, c4_hi, c4_lo
    );

    c0_hi = s0_512_hi(ah, al);
    c0_lo = s0_512_lo(ah, al);
    c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
    c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);

    var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo),
      T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);

    hh = gh;
    hl = gl;

    gh = fh;
    gl = fl;

    fh = eh;
    fl = el;

    eh = sum64_hi(dh, dl, T1_hi, T1_lo);
    el = sum64_lo(dl, dl, T1_hi, T1_lo);

    dh = ch;
    dl = cl;

    ch = bh;
    cl = bl;

    bh = ah;
    bl = al;

    ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
    al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
  }

  sum64(this.h, 0, ah, al);
  sum64(this.h, 2, bh, bl);
  sum64(this.h, 4, ch, cl);
  sum64(this.h, 6, dh, dl);
  sum64(this.h, 8, eh, el);
  sum64(this.h, 10, fh, fl);
  sum64(this.h, 12, gh, gl);
  sum64(this.h, 14, hh, hl);
};

SHA512.prototype._digest = function (enc) {
  return enc === 'hex' ? utils.toHex32(this.h, 'big') : utils.split32(this.h, 'big');
};

function ch64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (~xh & zh);
  if (r < 0) r += 0x100000000;
  return r;
}

function ch64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (~xl & zl);
  if (r < 0) r += 0x100000000;
  return r;
}

function maj64_hi(xh, xl, yh, yl, zh) {
  var r = (xh & yh) ^ (xh & zh) ^ (yh & zh);
  if (r < 0) r += 0x100000000;
  return r;
}

function maj64_lo(xh, xl, yh, yl, zh, zl) {
  var r = (xl & yl) ^ (xl & zl) ^ (yl & zl);
  if (r < 0) r += 0x100000000;
  return r;
}

function s0_512_hi(xh, xl) {
  var r = rotr64_hi(xh, xl, 28) ^ rotr64_hi(xl, xh, 2) ^ rotr64_hi(xl, xh, 7);
  if (r < 0) r += 0x100000000;
  return r;
}

function s0_512_lo(xh, xl) {
  var r = rotr64_lo(xh, xl, 28) ^ rotr64_lo(xl, xh, 2) ^ rotr64_lo(xl, xh, 7);
  if (r < 0) r += 0x100000000;
  return r;
}

function s1_512_hi(xh, xl) {
  var r = rotr64_hi(xh, xl, 14) ^ rotr64_hi(xh, xl, 18) ^ rotr64_hi(xl, xh, 9);
  if (r < 0) r += 0x100000000;
  return r;
}

function s1_512_lo(xh, xl) {
  var r = rotr64_lo(xh, xl, 14) ^ rotr64_lo(xh, xl, 18) ^ rotr64_lo(xl, xh, 9);
  if (r < 0) r += 0x100000000;
  return r;
}

function g0_512_hi(xh, xl) {
  var r = rotr64_hi(xh, xl, 1) ^ rotr64_hi(xh, xl, 8) ^ shr64_hi(xh, xl, 7);
  if (r < 0) r += 0x100000000;
  return r;
}

function g0_512_lo(xh, xl) {
  var r = rotr64_lo(xh, xl, 1) ^ rotr64_lo(xh, xl, 8) ^ shr64_lo(xh, xl, 7);
  if (r < 0) r += 0x100000000;
  return r;
}

function g1_512_hi(xh, xl) {
  var r = rotr64_hi(xh, xl, 19) ^ rotr64_hi(xl, xh, 29) ^ shr64_hi(xh, xl, 6);
  if (r < 0) r += 0x100000000;
  return r;
}

function g1_512_lo(xh, xl) {
  var r = rotr64_lo(xh, xl, 19) ^ rotr64_lo(xl, xh, 29) ^ shr64_lo(xh, xl, 6);
  if (r < 0) r += 0x100000000;
  return r;
}

},
// 57
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Reporter = __webpack_require__(15).Reporter,
  Buffer = __webpack_require__(8).Buffer;

function DecoderBuffer(base, options) {
  Reporter.call(this, options);
  if (!Buffer.isBuffer(base)) {
    this.error('Input not Buffer');
    return;
  }

  this.base = base;
  this.offset = 0;
  this.length = base.length;
}
inherits(DecoderBuffer, Reporter);
exports.DecoderBuffer = DecoderBuffer;

DecoderBuffer.prototype.save = function () {
  return { offset: this.offset, reporter: Reporter.prototype.save.call(this) };
};

DecoderBuffer.prototype.restore = function (save) {
  var res = new DecoderBuffer(this.base);
  res.offset = save.offset;
  res.length = this.offset;

  this.offset = save.offset;
  Reporter.prototype.restore.call(this, save.reporter);

  return res;
};

DecoderBuffer.prototype.isEmpty = function () {
  return this.offset === this.length;
};

DecoderBuffer.prototype.readUInt8 = function (fail) {
  return this.offset + 1 <= this.length
    ? this.base.readUInt8(this.offset++, true)
    : this.error(fail || 'DecoderBuffer overrun');
};

DecoderBuffer.prototype.skip = function (bytes, fail) {
  if (!(this.offset + bytes <= this.length))
    return this.error(fail || 'DecoderBuffer overrun');

  var res = new DecoderBuffer(this.base);

  res._reporterState = this._reporterState;

  res.offset = this.offset;
  res.length = this.offset + bytes;
  this.offset += bytes;
  return res;
};

DecoderBuffer.prototype.raw = function (save) {
  return this.base.slice(save ? save.offset : this.offset, this.length);
};

function EncoderBuffer(value, reporter) {
  if (Array.isArray(value)) {
    this.length = 0;
    this.value = value.map(function (item) {
      item instanceof EncoderBuffer || (item = new EncoderBuffer(item, reporter));
      this.length += item.length;
      return item;
    }, this);
  } else if (typeof value == 'number') {
    if (0 > value || value > 0xff)
      return reporter.error('non-byte EncoderBuffer value');
    this.value = value;
    this.length = 1;
  } else if (typeof value == 'string') {
    this.value = value;
    this.length = Buffer.byteLength(value);
  } else if (Buffer.isBuffer(value)) {
    this.value = value;
    this.length = value.length;
  } else return reporter.error('Unsupported type: ' + typeof value);
}
exports.EncoderBuffer = EncoderBuffer;

EncoderBuffer.prototype.join = function (out, offset) {
  out || (out = new Buffer(this.length));
  offset || (offset = 0);

  if (this.length === 0) return out;

  if (Array.isArray(this.value))
    this.value.forEach(function (item) {
      item.join(out, offset);
      offset += item.length;
    });
  else {
    typeof this.value == 'number'
      ? (out[offset] = this.value)
      : typeof this.value == 'string'
      ? out.write(this.value, offset)
      : Buffer.isBuffer(this.value) && this.value.copy(out, offset);
    offset += this.length;
  }

  return out;
};

},
// 58
function (module, exports, __webpack_require__) {

var constants = exports;

constants._reverse = function (map) {
  var res = {};

  Object.keys(map).forEach(function (key) {
    if ((key | 0) == key) key |= 0;

    var value = map[key];
    res[value] = key;
  });

  return res;
};

constants.der = __webpack_require__(119);

},
// 59
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),

  asn1 = __webpack_require__(14),
  base = asn1.base,
  bignum = asn1.bignum,

  der = asn1.constants.der;

function DERDecoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  this.tree = new DERNode();
  this.tree._init(entity.body);
}
module.exports = DERDecoder;

DERDecoder.prototype.decode = function (data, options) {
  data instanceof base.DecoderBuffer ||
    (data = new base.DecoderBuffer(data, options));

  return this.tree._decode(data, options);
};

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._peekTag = function (buffer, tag, any) {
  if (buffer.isEmpty()) return false;

  var state = buffer.save(),
    decodedTag = derDecodeTag(buffer, 'Failed to peek tag: "' + tag + '"');
  if (buffer.isError(decodedTag)) return decodedTag;

  buffer.restore(state);

  return decodedTag.tag === tag || decodedTag.tagStr === tag ||
    decodedTag.tagStr + 'of' === tag || any;
};

DERNode.prototype._decodeTag = function (buffer, tag, any) {
  var decodedTag = derDecodeTag(buffer, 'Failed to decode tag of "' + tag + '"');
  if (buffer.isError(decodedTag)) return decodedTag;

  var len = derDecodeLen(buffer, decodedTag.primitive,
      'Failed to get length of "' + tag + '"');

  if (buffer.isError(len)) return len;

  if (!any &&
      decodedTag.tag !== tag &&
      decodedTag.tagStr !== tag &&
      decodedTag.tagStr + 'of' !== tag)
    return buffer.error('Failed to match tag: "' + tag + '"');

  if (decodedTag.primitive || len !== null)
    return buffer.skip(len, 'Failed to match body of: "' + tag + '"');

  var state = buffer.save();
  var res = this._skipUntilEnd(buffer,
      'Failed to skip indefinite length body: "' + this.tag + '"');
  if (buffer.isError(res)) return res;

  len = buffer.offset - state.offset;
  buffer.restore(state);
  return buffer.skip(len, 'Failed to match body of: "' + tag + '"');
};

DERNode.prototype._skipUntilEnd = function (buffer, fail) {
  while (1) {
    var tag = derDecodeTag(buffer, fail);
    if (buffer.isError(tag)) return tag;
    var len = derDecodeLen(buffer, tag.primitive, fail);
    if (buffer.isError(len)) return len;

    var res = tag.primitive || len !== null
      ? buffer.skip(len)
      : this._skipUntilEnd(buffer, fail);

    if (buffer.isError(res)) return res;

    if (tag.tagStr === 'end') break;
  }
};

DERNode.prototype._decodeList = function (buffer, tag, decoder, options) {
  var result = [];
  while (!buffer.isEmpty()) {
    var possibleEnd = this._peekTag(buffer, 'end');
    if (buffer.isError(possibleEnd)) return possibleEnd;

    var res = decoder.decode(buffer, 'der', options);
    if (buffer.isError(res) && possibleEnd) break;
    result.push(res);
  }
  return result;
};

DERNode.prototype._decodeStr = function (buffer, tag) {
  if (tag === 'bitstr') {
    var unused = buffer.readUInt8();
    return buffer.isError(unused) ? unused : { unused: unused, data: buffer.raw() };
  }
  if (tag === 'bmpstr') {
    var raw = buffer.raw();
    if (raw.length % 2 == 1)
      return buffer.error('Decoding of string type: bmpstr length mismatch');

    var str = '';
    for (var i = 0; i < raw.length / 2; i++)
      str += String.fromCharCode(raw.readUInt16BE(i * 2));

    return str;
  }
  if (tag === 'numstr') {
    var numstr = buffer.raw().toString('ascii');
    return !this._isNumstr(numstr)
      ? buffer.error('Decoding of string type: numstr unsupported characters')
      : numstr;
  }
  if (tag === 'octstr') return buffer.raw();
  if (tag === 'objDesc') return buffer.raw();
  if (tag === 'printstr') {
    var printstr = buffer.raw().toString('ascii');
    return !this._isPrintstr(printstr)
      ? buffer.error('Decoding of string type: printstr unsupported characters')
      : printstr;
  }
  return /str$/.test(tag)
    ? buffer.raw().toString()
    : buffer.error('Decoding of string type: ' + tag + ' unsupported');
};

DERNode.prototype._decodeObjid = function (buffer, values, relative) {
  var result,
    identifiers = [],
    ident = 0;
  while (!buffer.isEmpty()) {
    var subident = buffer.readUInt8();
    ident <<= 7;
    ident |= subident & 0x7f;
    if ((subident & 0x80) == 0) {
      identifiers.push(ident);
      ident = 0;
    }
  }
  subident & 0x80 && identifiers.push(ident);

  var first = (identifiers[0] / 40) | 0,
    second = identifiers[0] % 40;

  result = relative ? identifiers : [first, second].concat(identifiers.slice(1));

  if (values) {
    var tmp = values[result.join(' ')];
    if (tmp === void 0) tmp = values[result.join('.')];
    if (tmp !== void 0) result = tmp;
  }

  return result;
};

DERNode.prototype._decodeTime = function (buffer, tag) {
  var str = buffer.raw().toString();
  if (tag === 'gentime')
    var year = str.slice(0, 4) | 0,
      mon = str.slice(4, 6) | 0,
      day = str.slice(6, 8) | 0,
      hour = str.slice(8, 10) | 0,
      min = str.slice(10, 12) | 0,
      sec = str.slice(12, 14) | 0;
  else if (tag === 'utctime') {
    year = str.slice(0, 2) | 0;
    mon = str.slice(2, 4) | 0;
    day = str.slice(4, 6) | 0;
    hour = str.slice(6, 8) | 0;
    min = str.slice(8, 10) | 0;
    sec = str.slice(10, 12) | 0;
    year = year < 70 ? 2000 + year : 1900 + year;
  } else return buffer.error('Decoding ' + tag + ' time is not supported yet');

  return Date.UTC(year, mon - 1, day, hour, min, sec, 0);
};

DERNode.prototype._decodeNull = function (buffer) {
  return null;
};

DERNode.prototype._decodeBool = function (buffer) {
  var res = buffer.readUInt8();
  return buffer.isError(res) ? res : res !== 0;
};

DERNode.prototype._decodeInt = function (buffer, values) {
  var raw = buffer.raw(),
    res = new bignum(raw);

  if (values) res = values[res.toString(10)] || res;

  return res;
};

DERNode.prototype._use = function (entity, obj) {
  if (typeof entity == 'function') entity = entity(obj);
  return entity._getDecoder('der').tree;
};

function derDecodeTag(buf, fail) {
  var tag = buf.readUInt8(fail);
  if (buf.isError(tag)) return tag;

  var cls = der.tagClass[tag >> 6],
    primitive = (tag & 0x20) == 0;

  if ((tag & 0x1f) == 0x1f) {
    var oct = tag;
    tag = 0;
    while ((oct & 0x80) == 0x80) {
      oct = buf.readUInt8(fail);
      if (buf.isError(oct)) return oct;

      tag <<= 7;
      tag |= oct & 0x7f;
    }
  } else tag &= 0x1f;

  return { cls: cls, primitive: primitive, tag: tag, tagStr: der.tag[tag] };
}

function derDecodeLen(buf, primitive, fail) {
  var len = buf.readUInt8(fail);
  if (buf.isError(len)) return len;

  if (!primitive && len === 0x80) return null;

  if ((len & 0x80) == 0) return len;

  var num = len & 0x7f;
  if (num > 4) return buf.error('length octect is too long');

  len = 0;
  for (var i = 0; i < num; i++) {
    len <<= 8;
    var j = buf.readUInt8(fail);
    if (buf.isError(j)) return j;
    len |= j;
  }

  return len;
}

},
// 60
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Buffer = __webpack_require__(8).Buffer,

  asn1 = __webpack_require__(14),
  base = asn1.base,

  der = asn1.constants.der;

function DEREncoder(entity) {
  this.enc = 'der';
  this.name = entity.name;
  this.entity = entity;

  this.tree = new DERNode();
  this.tree._init(entity.body);
}
module.exports = DEREncoder;

DEREncoder.prototype.encode = function (data, reporter) {
  return this.tree._encode(data, reporter).join();
};

function DERNode(parent) {
  base.Node.call(this, 'der', parent);
}
inherits(DERNode, base.Node);

DERNode.prototype._encodeComposite = function (tag, primitive, cls, content) {
  var encodedTag = encodeTag(tag, primitive, cls, this.reporter);

  if (content.length < 0x80) {
    var header = new Buffer(2);
    header[0] = encodedTag;
    header[1] = content.length;
    return this._createEncoderBuffer([header, content]);
  }

  var lenOctets = 1;
  for (var i = content.length; i >= 0x100; i >>= 8) lenOctets++;

  (header = new Buffer(2 + lenOctets))[0] = encodedTag;
  header[1] = 0x80 | lenOctets;

  i = 1 + lenOctets;
  for (var j = content.length; j > 0; i--, j >>= 8) header[i] = j & 0xff;

  return this._createEncoderBuffer([header, content]);
};

DERNode.prototype._encodeStr = function (str, tag) {
  if (tag === 'bitstr') return this._createEncoderBuffer([str.unused | 0, str.data]);
  if (tag === 'bmpstr') {
    var buf = new Buffer(str.length * 2);
    for (var i = 0; i < str.length; i++) buf.writeUInt16BE(str.charCodeAt(i), i * 2);

    return this._createEncoderBuffer(buf);
  }
  return tag === 'numstr'
    ? !this._isNumstr(str)
      ? this.reporter.error(
          'Encoding of string type: numstr supports only digits and space'
        )
      : this._createEncoderBuffer(str)
    : tag === 'printstr'
    ? !this._isPrintstr(str)
      ? this.reporter.error(
          'Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark'
        )
      : this._createEncoderBuffer(str)
    : /str$/.test(tag) || tag === 'objDesc'
    ? this._createEncoderBuffer(str)
    : this.reporter.error('Encoding of string type: ' + tag + ' unsupported');
};

DERNode.prototype._encodeObjid = function (id, values, relative) {
  if (typeof id == 'string') {
    if (!values)
      return this.reporter.error('string objid given, but no values map found');
    if (!values.hasOwnProperty(id))
      return this.reporter.error('objid not found in values map');
    id = values[id].split(/[\s\.]+/g);
    for (var i = 0; i < id.length; i++) id[i] |= 0;
  } else if (Array.isArray(id)) {
    id = id.slice();
    for (i = 0; i < id.length; i++) id[i] |= 0;
  }

  if (!Array.isArray(id))
    return this.reporter.error(
      'objid() should be either array or string, got: ' + JSON.stringify(id)
    );

  if (!relative) {
    if (id[1] >= 40) return this.reporter.error('Second objid identifier OOB');
    id.splice(0, 2, id[0] * 40 + id[1]);
  }

  var size = 0;
  for (i = 0; i < id.length; i++) {
    var ident = id[i];
    for (size++; ident >= 0x80; ident >>= 7) size++;
  }

  var objid = new Buffer(size),
    offset = objid.length - 1;
  for (i = id.length - 1; i >= 0; i--) {
    ident = id[i];
    objid[offset--] = ident & 0x7f;
    while ((ident >>= 7) > 0) objid[offset--] = 0x80 | (ident & 0x7f);
  }

  return this._createEncoderBuffer(objid);
};

function two(num) {
  return num < 10 ? '0' + num : num;
}

DERNode.prototype._encodeTime = function (time, tag) {
  var str,
    date = new Date(time);

  if (tag === 'gentime')
    str = [
      two(date.getFullYear()),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  else if (tag === 'utctime')
    str = [
      two(date.getFullYear() % 100),
      two(date.getUTCMonth() + 1),
      two(date.getUTCDate()),
      two(date.getUTCHours()),
      two(date.getUTCMinutes()),
      two(date.getUTCSeconds()),
      'Z'
    ].join('');
  else this.reporter.error('Encoding ' + tag + ' time is not supported yet');

  return this._encodeStr(str, 'octstr');
};

DERNode.prototype._encodeNull = function () {
  return this._createEncoderBuffer('');
};

DERNode.prototype._encodeInt = function (num, values) {
  if (typeof num == 'string') {
    if (!values)
      return this.reporter.error('String int or enum given, but no values map');
    if (!values.hasOwnProperty(num))
      return this.reporter.error("Values map doesn't contain: " + JSON.stringify(num));

    num = values[num];
  }

  if (typeof num != 'number' && !Buffer.isBuffer(num)) {
    var numArray = num.toArray();
    !num.sign && numArray[0] & 0x80 && numArray.unshift(0);

    num = new Buffer(numArray);
  }

  if (Buffer.isBuffer(num)) {
    var size = num.length;
    num.length !== 0 || size++;

    var out = new Buffer(size);
    num.copy(out);
    if (num.length === 0) out[0] = 0;
    return this._createEncoderBuffer(out);
  }

  if (num < 0x80) return this._createEncoderBuffer(num);

  if (num < 0x100) return this._createEncoderBuffer([0, num]);

  size = 1;
  for (var i = num; i >= 0x100; i >>= 8) size++;

  for (i = (out = new Array(size)).length - 1; i >= 0; i--) {
    out[i] = num & 0xff;
    num >>= 8;
  }
  out[0] & 0x80 && out.unshift(0);

  return this._createEncoderBuffer(new Buffer(out));
};

DERNode.prototype._encodeBool = function (value) {
  return this._createEncoderBuffer(value ? 0xff : 0);
};

DERNode.prototype._use = function (entity, obj) {
  if (typeof entity == 'function') entity = entity(obj);
  return entity._getEncoder('der').tree;
};

DERNode.prototype._skipDefault = function (dataBuffer, reporter, parent) {
  var state = this._baseState;
  if (state.default === null) return false;

  var data = dataBuffer.join();
  if (state.defaultBuffer === void 0)
    state.defaultBuffer = this._encodeValue(state.default, reporter, parent).join();

  if (data.length !== state.defaultBuffer.length) return false;

  for (var i = 0; i < data.length; i++)
    if (data[i] !== state.defaultBuffer[i]) return false;

  return true;
};

function encodeTag(tag, primitive, cls, reporter) {
  var res;

  tag === 'seqof' ? (tag = 'seq') : tag !== 'setof' || (tag = 'set');

  if (der.tagByName.hasOwnProperty(tag)) res = der.tagByName[tag];
  else if (typeof tag == 'number' && (tag | 0) === tag) res = tag;
  else return reporter.error('Unknown tag: ' + tag);

  if (res >= 0x1f) return reporter.error('Multi-octet tag encoding unsupported');

  primitive || (res |= 0x20);

  return res | (der.tagClassByName[cls || 'universal'] << 6);
}

},
// 61
function (module) {

module.exports = JSON.parse(
  '{"1.3.132.0.10":"secp256k1","1.3.132.0.33":"p224","1.2.840.10045.3.1.1":"p192","1.2.840.10045.3.1.7":"p256","1.3.132.0.34":"p384","1.3.132.0.35":"p521"}'
);

},
// 62
function (module, exports, __webpack_require__) {

var createHash = __webpack_require__(10),
  Buffer = __webpack_require__(0).Buffer

module.exports = function (seed, len) {
  var t = Buffer.alloc(0)
  for (var c, i = 0; t.length < len; ) {
    c = i2ops(i++)
    t = Buffer.concat([t, createHash('sha1').update(seed).update(c).digest()])
  }
  return t.slice(0, len)
}

function i2ops(c) {
  var out = Buffer.allocUnsafe(4)
  out.writeUInt32BE(c, 0)
  return out
}

},
// 63
function (module) {

module.exports = function (a, b) {
  for (var len = a.length, i = -1; ++i < len; ) a[i] ^= b[i]

  return a
}

},
// 64
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  Buffer = __webpack_require__(0).Buffer

function withPublic(paddedMsg, key) {
  return Buffer.from(
    paddedMsg
      .toRed(BN.mont(key.modulus))
      .redPow(new BN(key.publicExponent))
      .fromRed()
      .toArray()
  )
}

module.exports = withPublic

},
// 65
function (module, exports, __webpack_require__) {

exports.randomBytes = exports.rng = exports.pseudoRandomBytes = exports.prng =
  __webpack_require__(7)
exports.createHash = exports.Hash = __webpack_require__(10)
exports.createHmac = exports.Hmac = __webpack_require__(22)

var algos = __webpack_require__(40),
  algoKeys = Object.keys(algos)
var hashes =
  ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(algoKeys)
exports.getHashes = function () {
  return hashes
}

var p = __webpack_require__(41)
exports.pbkdf2 = p.pbkdf2
exports.pbkdf2Sync = p.pbkdf2Sync

var aes = __webpack_require__(76)

exports.Cipher = aes.Cipher
exports.createCipher = aes.createCipher
exports.Cipheriv = aes.Cipheriv
exports.createCipheriv = aes.createCipheriv
exports.Decipher = aes.Decipher
exports.createDecipher = aes.createDecipher
exports.Decipheriv = aes.Decipheriv
exports.createDecipheriv = aes.createDecipheriv
exports.getCiphers = aes.getCiphers
exports.listCiphers = aes.listCiphers

var dh = __webpack_require__(91)

exports.DiffieHellmanGroup = dh.DiffieHellmanGroup
exports.createDiffieHellmanGroup = dh.createDiffieHellmanGroup
exports.getDiffieHellman = dh.getDiffieHellman
exports.createDiffieHellman = dh.createDiffieHellman
exports.DiffieHellman = dh.DiffieHellman

var sign = __webpack_require__(94)

exports.createSign = sign.createSign
exports.Sign = sign.Sign
exports.createVerify = sign.createVerify
exports.Verify = sign.Verify

exports.createECDH = __webpack_require__(128)

var publicEncrypt = __webpack_require__(130)

exports.publicEncrypt = publicEncrypt.publicEncrypt
exports.privateEncrypt = publicEncrypt.privateEncrypt
exports.publicDecrypt = publicEncrypt.publicDecrypt
exports.privateDecrypt = publicEncrypt.privateDecrypt

var rf = __webpack_require__(133)

exports.randomFill = rf.randomFill
exports.randomFillSync = rf.randomFillSync

exports.createCredentials = function () {
  throw new Error(
    'sorry, createCredentials is not implemented yet\nwe accept pull requests\nhttps://github.com/crypto-browserify/crypto-browserify'
  )
}

exports.constants = {
  DH_CHECK_P_NOT_SAFE_PRIME: 2,
  DH_CHECK_P_NOT_PRIME: 1,
  DH_UNABLE_TO_CHECK_GENERATOR: 4,
  DH_NOT_SUITABLE_GENERATOR: 8,
  NPN_ENABLED: 1,
  ALPN_ENABLED: 1,
  RSA_PKCS1_PADDING: 1,
  RSA_SSLV23_PADDING: 2,
  RSA_NO_PADDING: 3,
  RSA_PKCS1_OAEP_PADDING: 4,
  RSA_X931_PADDING: 5,
  RSA_PKCS1_PSS_PADDING: 6,
  POINT_CONVERSION_COMPRESSED: 2,
  POINT_CONVERSION_UNCOMPRESSED: 4,
  POINT_CONVERSION_HYBRID: 6
}

},
// 66
function (module) {

module.exports = require('util');

},
// 67
function (module) {

if (typeof Object.create == 'function')
  module.exports = function (ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
  }
else
  module.exports = function (ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }

},
// 68
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer,

  K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0],

  W = new Array(80)

function Sha() {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5(num) {
  return (num << 5) | (num >>> 27)
}

function rotl30(num) {
  return (num << 30) | (num >>> 2)
}

function ft(s, b, c, d) {
  return s === 0 ? (b & c) | (~b & d)
    : s === 2 ? (b & c) | (b & d) | (c & d)
    : b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w,

    a = this._a | 0,
    b = this._b | 0,
    c = this._c | 0,
    d = this._d | 0,
    e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20),
      t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha

},
// 69
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer,

  K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0],

  W = new Array(80)

function Sha1() {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1(num) {
  return (num << 1) | (num >>> 31)
}

function rotl5(num) {
  return (num << 5) | (num >>> 27)
}

function rotl30(num) {
  return (num << 30) | (num >>> 2)
}

function ft(s, b, c, d) {
  return s === 0 ? (b & c) | (~b & d)
    : s === 2 ? (b & c) | (b & d) | (c & d)
    : b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w,

    a = this._a | 0,
    b = this._b | 0,
    c = this._c | 0,
    d = this._d | 0,
    e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20),
      t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1

},
// 70
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Sha256 = __webpack_require__(38),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer,

  W = new Array(64)

function Sha224() {
  this.init()

  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224

},
// 71
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  SHA512 = __webpack_require__(39),
  Hash = __webpack_require__(9),
  Buffer = __webpack_require__(0).Buffer,

  W = new Array(160)

function Sha384() {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE(h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384

},
// 72
function (module) {

module.exports = require('./string_decoder');

},
// 73
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Buffer = __webpack_require__(0).Buffer,

  Base = __webpack_require__(6),

  ZEROS = Buffer.alloc(128),
  blocksize = 64

function Hmac(alg, key) {
  Base.call(this, 'digest')
  if (typeof key == 'string') key = Buffer.from(key)

  this._alg = alg
  this._key = key

  if (key.length > blocksize) key = alg(key)
  else if (key.length < blocksize) key = Buffer.concat([key, ZEROS], blocksize)

  var ipad = (this._ipad = Buffer.allocUnsafe(blocksize)),
    opad = (this._opad = Buffer.allocUnsafe(blocksize))

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = [ipad]
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.push(data)
}

Hmac.prototype._final = function () {
  var h = this._alg(Buffer.concat(this._hash))
  return this._alg(Buffer.concat([this._opad, h]))
}
module.exports = Hmac

},
// 74
function (module, exports, __webpack_require__) {

var MD5 = __webpack_require__(20)

module.exports = function (buffer) {
  return new MD5().update(buffer).digest()
}

},
// 75
function (module, exports, __webpack_require__) {

var ZERO_BUF,
  Buffer = __webpack_require__(0).Buffer,

  checkParameters = __webpack_require__(23),
  defaultEncoding = __webpack_require__(24),
  sync = __webpack_require__(42),
  toBuffer = __webpack_require__(25),

  subtle = global.crypto && global.crypto.subtle
var toBrowser = {
  sha: 'SHA-1',
  'sha-1': 'SHA-1',
  sha1: 'SHA-1',
  sha256: 'SHA-256',
  'sha-256': 'SHA-256',
  sha384: 'SHA-384',
  'sha-384': 'SHA-384',
  'sha-512': 'SHA-512',
  sha512: 'SHA-512'
}
var nextTick,
  checks = []
function checkNative(algo) {
  if ((global.process && !global.process.browser) ||
      !subtle || !subtle.importKey || !subtle.deriveBits)
    return Promise.resolve(false)

  if (checks[algo] !== void 0) return checks[algo]

  ZERO_BUF = ZERO_BUF || Buffer.alloc(8)
  var prom = browserPbkdf2(ZERO_BUF, ZERO_BUF, 10, 128, algo).then(function () {
    return true
  }).catch(function () {
    return false
  })
  checks[algo] = prom
  return prom
}
function getNextTick() {
  return nextTick || (
    nextTick =
      global.process && global.process.nextTick
      ? global.process.nextTick
      : global.queueMicrotask
      ? global.queueMicrotask
      : global.setImmediate
      ? global.setImmediate
      : global.setTimeout
  )
}
function browserPbkdf2(password, salt, iterations, length, algo) {
  return subtle.importKey(
    'raw', password, { name: 'PBKDF2' }, false, ['deriveBits']
  ).then(function (key) {
    return subtle.deriveBits({
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: { name: algo }
    }, key, length << 3)
  }).then(function (res) {
    return Buffer.from(res)
  })
}

function resolvePromise(promise, callback) {
  promise.then(function (out) {
    getNextTick()(function () {
      callback(null, out)
    })
  }, function (e) {
    getNextTick()(function () {
      callback(e)
    })
  })
}
module.exports = function (password, salt, iterations, keylen, digest, callback) {
  if (typeof digest == 'function') {
    callback = digest
    digest = void 0
  }

  var algo = toBrowser[(digest = digest || 'sha1').toLowerCase()]

  if (!algo || typeof global.Promise != 'function') {
    getNextTick()(function () {
      var out
      try {
        out = sync(password, salt, iterations, keylen, digest)
      } catch (e) {
        return callback(e)
      }
      callback(null, out)
    })
    return
  }

  checkParameters(iterations, keylen)
  password = toBuffer(password, defaultEncoding, 'Password')
  salt = toBuffer(salt, defaultEncoding, 'Salt')
  if (typeof callback != 'function') throw new Error('No callback provided to pbkdf2')

  resolvePromise(checkNative(algo).then(function (resp) {
    return resp
      ? browserPbkdf2(password, salt, iterations, keylen, algo)
      : sync(password, salt, iterations, keylen, digest)
  }), callback)
}

},
// 76
function (module, exports, __webpack_require__) {

var DES = __webpack_require__(77),
  aes = __webpack_require__(27),
  aesModes = __webpack_require__(28),
  desModes = __webpack_require__(90),
  ebtk = __webpack_require__(17)

function createCipher(suite, password) {
  suite = suite.toLowerCase()

  var keyLen, ivLen
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, keyLen, ivLen)
  return createCipheriv(suite, keys.key, keys.iv)
}

function createDecipher(suite, password) {
  suite = suite.toLowerCase()

  var keyLen, ivLen
  if (aesModes[suite]) {
    keyLen = aesModes[suite].key
    ivLen = aesModes[suite].iv
  } else if (desModes[suite]) {
    keyLen = desModes[suite].key * 8
    ivLen = desModes[suite].iv
  } else throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, keyLen, ivLen)
  return createDecipheriv(suite, keys.key, keys.iv)
}

function createCipheriv(suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) return aes.createCipheriv(suite, key, iv)
  if (desModes[suite]) return new DES({ key: key, iv: iv, mode: suite })

  throw new TypeError('invalid suite type')
}

function createDecipheriv(suite, key, iv) {
  suite = suite.toLowerCase()
  if (aesModes[suite]) return aes.createDecipheriv(suite, key, iv)
  if (desModes[suite]) return new DES({ key: key, iv: iv, mode: suite, decrypt: true })

  throw new TypeError('invalid suite type')
}

function getCiphers() {
  return Object.keys(desModes).concat(aes.getCiphers())
}

exports.createCipher = exports.Cipher = createCipher
exports.createCipheriv = exports.Cipheriv = createCipheriv
exports.createDecipher = exports.Decipher = createDecipher
exports.createDecipheriv = exports.Decipheriv = createDecipheriv
exports.listCiphers = exports.getCiphers = getCiphers

},
// 77
function (module, exports, __webpack_require__) {

var CipherBase = __webpack_require__(6),
  des = __webpack_require__(78),
  inherits = __webpack_require__(1),
  Buffer = __webpack_require__(0).Buffer

var modes = {
  'des-ede3-cbc': des.CBC.instantiate(des.EDE),
  'des-ede3': des.EDE,
  'des-ede-cbc': des.CBC.instantiate(des.EDE),
  'des-ede': des.EDE,
  'des-cbc': des.CBC.instantiate(des.DES),
  'des-ecb': des.DES
}
modes.des = modes['des-cbc']
modes.des3 = modes['des-ede3-cbc']
module.exports = DES
inherits(DES, CipherBase)
function DES(opts) {
  CipherBase.call(this)
  var modeName = opts.mode.toLowerCase(),
    mode = modes[modeName],
    type = opts.decrypt ? 'decrypt' : 'encrypt',

    key = opts.key
  Buffer.isBuffer(key) || (key = Buffer.from(key))

  if (modeName === 'des-ede' || modeName === 'des-ede-cbc')
    key = Buffer.concat([key, key.slice(0, 8)])

  var iv = opts.iv
  Buffer.isBuffer(iv) || (iv = Buffer.from(iv))

  this._des = mode.create({ key: key, iv: iv, type: type })
}
DES.prototype._update = function (data) {
  return Buffer.from(this._des.update(data))
}
DES.prototype._final = function () {
  return Buffer.from(this._des.final())
}

},
// 78
function (module, exports, __webpack_require__) {

exports.utils = __webpack_require__(43);
exports.Cipher = __webpack_require__(26);
exports.DES = __webpack_require__(44);
exports.CBC = __webpack_require__(79);
exports.EDE = __webpack_require__(80);

},
// 79
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(3),
  inherits = __webpack_require__(1),

  proto = {};

function CBCState(iv) {
  assert.equal(iv.length, 8, 'Invalid IV length');

  this.iv = new Array(8);
  for (var i = 0; i < this.iv.length; i++) this.iv[i] = iv[i];
}

function instantiate(Base) {
  function CBC(options) {
    Base.call(this, options);
    this._cbcInit();
  }
  inherits(CBC, Base);

  for (var keys = Object.keys(proto), i = 0; i < keys.length; i++) {
    var key = keys[i];
    CBC.prototype[key] = proto[key];
  }

  CBC.create = function (options) {
    return new CBC(options);
  };

  return CBC;
}

exports.instantiate = instantiate;

proto._cbcInit = function () {
  var state = new CBCState(this.options.iv);
  this._cbcState = state;
};

proto._update = function (inp, inOff, out, outOff) {
  var state = this._cbcState,
    superProto = this.constructor.super_.prototype,

    iv = state.iv;
  if (this.type === 'encrypt') {
    for (var i = 0; i < this.blockSize; i++) iv[i] ^= inp[inOff + i];

    superProto._update.call(this, iv, 0, out, outOff);

    for (i = 0; i < this.blockSize; i++) iv[i] = out[outOff + i];
  } else {
    superProto._update.call(this, inp, inOff, out, outOff);

    for (i = 0; i < this.blockSize; i++) out[outOff + i] ^= iv[i];

    for (i = 0; i < this.blockSize; i++) iv[i] = inp[inOff + i];
  }
};

},
// 80
function (module, exports, __webpack_require__) {

var assert = __webpack_require__(3),
  inherits = __webpack_require__(1),

  Cipher = __webpack_require__(26),
  DES = __webpack_require__(44);

function EDEState(type, key) {
  assert.equal(key.length, 24, 'Invalid key length');

  var k1 = key.slice(0, 8),
    k2 = key.slice(8, 16),
    k3 = key.slice(16, 24);

  this.ciphers =
    type === 'encrypt' ? [
      DES.create({ type: 'encrypt', key: k1 }),
      DES.create({ type: 'decrypt', key: k2 }),
      DES.create({ type: 'encrypt', key: k3 })
    ] : [
      DES.create({ type: 'decrypt', key: k3 }),
      DES.create({ type: 'encrypt', key: k2 }),
      DES.create({ type: 'decrypt', key: k1 })
    ];
}

function EDE(options) {
  Cipher.call(this, options);

  var state = new EDEState(this.type, this.options.key);
  this._edeState = state;
}
inherits(EDE, Cipher);

module.exports = EDE;

EDE.create = function (options) {
  return new EDE(options);
};

EDE.prototype._update = function (inp, inOff, out, outOff) {
  var state = this._edeState;

  state.ciphers[0]._update(inp, inOff, out, outOff);
  state.ciphers[1]._update(out, outOff, out, outOff);
  state.ciphers[2]._update(out, outOff, out, outOff);
};

EDE.prototype._pad = DES.prototype._pad;
EDE.prototype._unpad = DES.prototype._unpad;

},
// 81
function (module, exports, __webpack_require__) {

var MODES = __webpack_require__(28),
  AuthCipher = __webpack_require__(48),
  Buffer = __webpack_require__(0).Buffer,
  StreamCipher = __webpack_require__(49),
  Transform = __webpack_require__(6),
  aes = __webpack_require__(16),
  ebtk = __webpack_require__(17)

function Cipher(mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

__webpack_require__(1)(Cipher, Transform)

Cipher.prototype._update = function (data) {
  this._cache.add(data)
  var out = []

  for (var chunk, thing; (chunk = this._cache.get()); ) {
    thing = this._mode.encrypt(this, chunk)
    out.push(thing)
  }

  return Buffer.concat(out)
}

var PADDING = Buffer.alloc(16, 0x10)

Cipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) {
    chunk = this._mode.encrypt(this, chunk)
    this._cipher.scrub()
    return chunk
  }

  if (!chunk.equals(PADDING)) {
    this._cipher.scrub()
    throw new Error('data not multiple of block length')
  }
}

Cipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter() {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function () {
  if (this.cache.length > 15) {
    var out = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    return out
  }
  return null
}

Splitter.prototype.flush = function () {
  var len = 16 - this.cache.length,
    padBuff = Buffer.allocUnsafe(len)

  for (var i = -1; ++i < len; ) padBuff.writeUInt8(len, i)

  return Buffer.concat([this.cache, padBuff])
}

function createCipheriv(suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof password == 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8)
    throw new TypeError('invalid key length ' + password.length)

  if (typeof iv == 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv)
    throw new TypeError('invalid iv length ' + iv.length)

  return config.type === 'stream'
    ? new StreamCipher(config.module, password, iv)
    : config.type === 'auth'
    ? new AuthCipher(config.module, password, iv)
    : new Cipher(config.module, password, iv)
}

function createCipher(suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createCipheriv(suite, keys.key, keys.iv)
}

exports.createCipheriv = createCipheriv
exports.createCipher = createCipher

},
// 82
function (module, exports) {

exports.encrypt = function (self, block) {
  return self._cipher.encryptBlock(block)
}

exports.decrypt = function (self, block) {
  return self._cipher.decryptBlock(block)
}

},
// 83
function (module, exports, __webpack_require__) {

var xor = __webpack_require__(12)

exports.encrypt = function (self, block) {
  var data = xor(block, self._prev)

  self._prev = self._cipher.encryptBlock(data)
  return self._prev
}

exports.decrypt = function (self, block) {
  var pad = self._prev

  self._prev = block
  var out = self._cipher.decryptBlock(block)

  return xor(out, pad)
}

},
// 84
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer,
  xor = __webpack_require__(12)

function encryptStart(self, data, decrypt) {
  var len = data.length,
    out = xor(data, self._cache)
  self._cache = self._cache.slice(len)
  self._prev = Buffer.concat([self._prev, decrypt ? data : out])
  return out
}

exports.encrypt = function (self, data, decrypt) {
  var out = Buffer.allocUnsafe(0)

  for (var len; data.length; ) {
    if (self._cache.length === 0) {
      self._cache = self._cipher.encryptBlock(self._prev)
      self._prev = Buffer.allocUnsafe(0)
    }

    if (self._cache.length > data.length) {
      out = Buffer.concat([out, encryptStart(self, data, decrypt)])
      break
    }
    len = self._cache.length
    out = Buffer.concat([out, encryptStart(self, data.slice(0, len), decrypt)])
    data = data.slice(len)
  }

  return out
}

},
// 85
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer

function encryptByte(self, byteParam, decrypt) {
  var out = self._cipher.encryptBlock(self._prev)[0] ^ byteParam

  self._prev = Buffer.concat([
    self._prev.slice(1),
    Buffer.from([decrypt ? byteParam : out])
  ])

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length,
    out = Buffer.allocUnsafe(len)

  for (var i = -1; ++i < len; ) out[i] = encryptByte(self, chunk[i], decrypt)

  return out
}

},
// 86
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer

function encryptByte(self, byteParam, decrypt) {
  var out = 0
  for (var bit, value, i = -1, len = 8; ++i < len; ) {
    bit = byteParam & (1 << (7 - i)) ? 0x80 : 0
    out += (0x80 & (value = self._cipher.encryptBlock(self._prev)[0] ^ bit)) >> i % 8
    self._prev = shiftIn(self._prev, decrypt ? bit : value)
  }
  return out
}

function shiftIn(buffer, value) {
  var len = buffer.length,
    out = Buffer.allocUnsafe(len)
  buffer = Buffer.concat([buffer, Buffer.from([value])])

  for (var i = -1; ++i < len; ) out[i] = (buffer[i] << 1) | (buffer[i + 1] >> 7)

  return out
}

exports.encrypt = function (self, chunk, decrypt) {
  var len = chunk.length,
    out = Buffer.allocUnsafe(len)

  for (var i = -1; ++i < len; ) out[i] = encryptByte(self, chunk[i], decrypt)

  return out
}

},
// 87
function (module, exports, __webpack_require__) {

var xor = __webpack_require__(12)

function getBlock(self) {
  self._prev = self._cipher.encryptBlock(self._prev)
  return self._prev
}

exports.encrypt = function (self, chunk) {
  while (self._cache.length < chunk.length)
    self._cache = Buffer.concat([self._cache, getBlock(self)])

  var pad = self._cache.slice(0, chunk.length)
  self._cache = self._cache.slice(chunk.length)
  return xor(chunk, pad)
}

},
// 88
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(0).Buffer,
  ZEROES = Buffer.alloc(16, 0)

function toArray(buf) {
  return [
    buf.readUInt32BE(0),
    buf.readUInt32BE(4),
    buf.readUInt32BE(8),
    buf.readUInt32BE(12)
  ]
}

function fromArray(out) {
  var buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0] >>> 0, 0)
  buf.writeUInt32BE(out[1] >>> 0, 4)
  buf.writeUInt32BE(out[2] >>> 0, 8)
  buf.writeUInt32BE(out[3] >>> 0, 12)
  return buf
}

function GHASH(key) {
  this.h = key
  this.state = Buffer.alloc(16, 0)
  this.cache = Buffer.allocUnsafe(0)
}

GHASH.prototype.ghash = function (block) {
  for (var i = -1; ++i < block.length; ) this.state[i] ^= block[i]

  this._multiply()
}

GHASH.prototype._multiply = function () {
  var Zi = [0, 0, 0, 0]
  for (var j, lsbVi, Vi = toArray(this.h), i = -1; ++i < 128; ) {
    if ((this.state[~~(i / 8)] & (1 << (7 - (i % 8)))) != 0) {
      Zi[0] ^= Vi[0]
      Zi[1] ^= Vi[1]
      Zi[2] ^= Vi[2]
      Zi[3] ^= Vi[3]
    }

    lsbVi = (Vi[3] & 1) != 0

    for (j = 3; j > 0; j--) Vi[j] = (Vi[j] >>> 1) | ((Vi[j - 1] & 1) << 31)

    Vi[0] = Vi[0] >>> 1

    if (lsbVi) Vi[0] = Vi[0] ^ (0xe1 << 24)
  }
  this.state = fromArray(Zi)
}

GHASH.prototype.update = function (buf) {
  this.cache = Buffer.concat([this.cache, buf])
  for (var chunk; this.cache.length >= 16; ) {
    chunk = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    this.ghash(chunk)
  }
}

GHASH.prototype.final = function (abl, bl) {
  this.cache.length && this.ghash(Buffer.concat([this.cache, ZEROES], 16))

  this.ghash(fromArray([0, abl, 0, bl]))
  return this.state
}

module.exports = GHASH

},
// 89
function (module, exports, __webpack_require__) {

var AuthCipher = __webpack_require__(48),
  Buffer = __webpack_require__(0).Buffer,
  MODES = __webpack_require__(28),
  StreamCipher = __webpack_require__(49),
  Transform = __webpack_require__(6),
  aes = __webpack_require__(16),
  ebtk = __webpack_require__(17)

function Decipher(mode, key, iv) {
  Transform.call(this)

  this._cache = new Splitter()
  this._last = void 0
  this._cipher = new aes.AES(key)
  this._prev = Buffer.from(iv)
  this._mode = mode
  this._autopadding = true
}

__webpack_require__(1)(Decipher, Transform)

Decipher.prototype._update = function (data) {
  this._cache.add(data)
  var out = []
  for (var chunk, thing; (chunk = this._cache.get(this._autopadding)); ) {
    thing = this._mode.decrypt(this, chunk)
    out.push(thing)
  }
  return Buffer.concat(out)
}

Decipher.prototype._final = function () {
  var chunk = this._cache.flush()
  if (this._autopadding) return unpad(this._mode.decrypt(this, chunk))
  if (chunk) throw new Error('data not multiple of block length')
}

Decipher.prototype.setAutoPadding = function (setTo) {
  this._autopadding = !!setTo
  return this
}

function Splitter() {
  this.cache = Buffer.allocUnsafe(0)
}

Splitter.prototype.add = function (data) {
  this.cache = Buffer.concat([this.cache, data])
}

Splitter.prototype.get = function (autoPadding) {
  var out
  if (autoPadding) {
    if (this.cache.length > 16) {
      out = this.cache.slice(0, 16)
      this.cache = this.cache.slice(16)
      return out
    }
  } else if (this.cache.length >= 16) {
    out = this.cache.slice(0, 16)
    this.cache = this.cache.slice(16)
    return out
  }

  return null
}

Splitter.prototype.flush = function () {
  if (this.cache.length) return this.cache
}

function unpad(last) {
  var padded = last[15]
  if (padded < 1 || padded > 16) throw new Error('unable to decrypt data')

  for (var i = -1; ++i < padded; )
    if (last[i + (16 - padded)] !== padded) throw new Error('unable to decrypt data')

  if (padded !== 16) return last.slice(0, 16 - padded)
}

function createDecipheriv(suite, password, iv) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  if (typeof iv == 'string') iv = Buffer.from(iv)
  if (config.mode !== 'GCM' && iv.length !== config.iv)
    throw new TypeError('invalid iv length ' + iv.length)

  if (typeof password == 'string') password = Buffer.from(password)
  if (password.length !== config.key / 8)
    throw new TypeError('invalid key length ' + password.length)

  return config.type === 'stream'
    ? new StreamCipher(config.module, password, iv, true)
    : config.type === 'auth'
    ? new AuthCipher(config.module, password, iv, true)
    : new Decipher(config.module, password, iv)
}

function createDecipher(suite, password) {
  var config = MODES[suite.toLowerCase()]
  if (!config) throw new TypeError('invalid suite type')

  var keys = ebtk(password, false, config.key, config.iv)
  return createDecipheriv(suite, keys.key, keys.iv)
}

exports.createDecipher = createDecipher
exports.createDecipheriv = createDecipheriv

},
// 90
function (module, exports) {

exports['des-ecb'] = { key: 8, iv: 0 }
exports['des-cbc'] = exports.des = { key: 8, iv: 8 }
exports['des-ede3-cbc'] = exports.des3 = { key: 24, iv: 8 }
exports['des-ede3'] = { key: 24, iv: 0 }
exports['des-ede-cbc'] = { key: 16, iv: 8 }
exports['des-ede'] = { key: 16, iv: 0 }

},
// 91
function (module, exports, __webpack_require__) {

var generatePrime = __webpack_require__(50),
  primes = __webpack_require__(92),

  DH = __webpack_require__(93)

function getDiffieHellman(mod) {
  var prime = new Buffer(primes[mod].prime, 'hex'),
    gen = new Buffer(primes[mod].gen, 'hex')

  return new DH(prime, gen)
}

var ENCODINGS = { binary: true, hex: true, base64: true }

function createDiffieHellman(prime, enc, generator, genc) {
  if (Buffer.isBuffer(enc) || ENCODINGS[enc] === void 0)
    return createDiffieHellman(prime, 'binary', enc, generator)

  enc = enc || 'binary'
  genc = genc || 'binary'
  generator = generator || new Buffer([2])

  Buffer.isBuffer(generator) || (generator = new Buffer(generator, genc))

  if (typeof prime == 'number')
    return new DH(generatePrime(prime, generator), generator, true)

  Buffer.isBuffer(prime) || (prime = new Buffer(prime, enc))

  return new DH(prime, generator, true)
}

exports.DiffieHellmanGroup = exports.createDiffieHellmanGroup =
  exports.getDiffieHellman = getDiffieHellman
exports.createDiffieHellman = exports.DiffieHellman = createDiffieHellman

},
// 92
function (module) {

module.exports = JSON.parse(
  '{"modp1":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"},"modp2":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"},"modp5":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"},"modp14":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"},"modp15":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"},"modp16":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"},"modp17":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"},"modp18":{"gen":"02","prime":"ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"}}'
);

},
// 93
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  millerRabin = new (__webpack_require__(51))(),
  TWENTYFOUR = new BN(24),
  ELEVEN = new BN(11),
  TEN = new BN(10),
  THREE = new BN(3),
  SEVEN = new BN(7),
  primes = __webpack_require__(50),
  randomBytes = __webpack_require__(7);
module.exports = DH;

function setPublicKey(pub, enc) {
  enc = enc || 'utf8';
  Buffer.isBuffer(pub) || (pub = new Buffer(pub, enc));

  this._pub = new BN(pub);
  return this;
}

function setPrivateKey(priv, enc) {
  enc = enc || 'utf8';
  Buffer.isBuffer(priv) || (priv = new Buffer(priv, enc));

  this._priv = new BN(priv);
  return this;
}

var primeCache = {};
function checkPrime(prime, generator) {
  var gen = generator.toString('hex'),
    hex = [gen, prime.toString(16)].join('_');
  if (hex in primeCache) return primeCache[hex];

  var rem,
    error = 0;

  if (
    prime.isEven() ||
    !primes.simpleSieve ||
    !primes.fermatTest(prime) ||
    !millerRabin.test(prime)
  ) {
    error += 1;

    error += gen === '02' || gen === '05' ? 8 : 4;

    primeCache[hex] = error;
    return error;
  }
  millerRabin.test(prime.shrn(1)) || (error += 2);

  switch (gen) {
    case '02':
      if (prime.mod(TWENTYFOUR).cmp(ELEVEN)) error += 8;

      break;
    case '05':
      if ((rem = prime.mod(TEN)).cmp(THREE) && rem.cmp(SEVEN)) error += 8;

      break;
    default:
      error += 4;
  }
  primeCache[hex] = error;
  return error;
}

function DH(prime, generator, malleable) {
  this.setGenerator(generator);
  this.__prime = new BN(prime);
  this._prime = BN.mont(this.__prime);
  this._primeLen = prime.length;
  this._pub = void 0;
  this._priv = void 0;
  this._primeCode = void 0;
  if (malleable) {
    this.setPublicKey = setPublicKey;
    this.setPrivateKey = setPrivateKey;
  } else this._primeCode = 8;
}
Object.defineProperty(DH.prototype, 'verifyError', {
  enumerable: true,
  get: function () {
    if (typeof this._primeCode != 'number')
      this._primeCode = checkPrime(this.__prime, this.__gen);

    return this._primeCode;
  }
});
DH.prototype.generateKeys = function () {
  this._priv || (this._priv = new BN(randomBytes(this._primeLen)));

  this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
  return this.getPublicKey();
};

DH.prototype.computeSecret = function (other) {
  var secret = (other = new BN(other).toRed(this._prime)).redPow(this._priv).fromRed(),
    out = new Buffer(secret.toArray()),
    prime = this.getPrime();
  if (out.length < prime.length) {
    var front = new Buffer(prime.length - out.length);
    front.fill(0);
    out = Buffer.concat([front, out]);
  }
  return out;
};

DH.prototype.getPublicKey = function (enc) {
  return formatReturnValue(this._pub, enc);
};

DH.prototype.getPrivateKey = function (enc) {
  return formatReturnValue(this._priv, enc);
};

DH.prototype.getPrime = function (enc) {
  return formatReturnValue(this.__prime, enc);
};

DH.prototype.getGenerator = function (enc) {
  return formatReturnValue(this._gen, enc);
};

DH.prototype.setGenerator = function (gen, enc) {
  enc = enc || 'utf8';
  Buffer.isBuffer(gen) || (gen = new Buffer(gen, enc));

  this.__gen = gen;
  this._gen = new BN(gen);
  return this;
};

function formatReturnValue(bn, enc) {
  var buf = new Buffer(bn.toArray());
  return !enc ? buf : buf.toString(enc);
}

},
// 94
function (module, exports, __webpack_require__) {

var createHash = __webpack_require__(10),
  stream = __webpack_require__(21),
  inherits = __webpack_require__(1),
  sign = __webpack_require__(95),
  verify = __webpack_require__(127),

  algorithms = __webpack_require__(40)
Object.keys(algorithms).forEach(function (key) {
  algorithms[key].id = new Buffer(algorithms[key].id, 'hex')
  algorithms[key.toLowerCase()] = algorithms[key]
})

function Sign(algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hashType = data.hash
  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Sign, stream.Writable)

Sign.prototype._write = function (data, _, done) {
  this._hash.update(data)
  done()
}

Sign.prototype.update = function (data, enc) {
  if (typeof data == 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Sign.prototype.sign = function (key, enc) {
  this.end()
  var hash = this._hash.digest(),
    sig = sign(hash, key, this._hashType, this._signType, this._tag)

  return enc ? sig.toString(enc) : sig
}

function Verify(algorithm) {
  stream.Writable.call(this)

  var data = algorithms[algorithm]
  if (!data) throw new Error('Unknown message digest')

  this._hash = createHash(data.hash)
  this._tag = data.id
  this._signType = data.sign
}
inherits(Verify, stream.Writable)

Verify.prototype._write = function (data, _, done) {
  this._hash.update(data)
  done()
}

Verify.prototype.update = function (data, enc) {
  if (typeof data == 'string') data = new Buffer(data, enc)

  this._hash.update(data)
  return this
}

Verify.prototype.verify = function (key, sig, enc) {
  if (typeof sig == 'string') sig = new Buffer(sig, enc)

  this.end()
  var hash = this._hash.digest()
  return verify(sig, hash, key, this._signType, this._tag)
}

function createSign(algorithm) {
  return new Sign(algorithm)
}

function createVerify(algorithm) {
  return new Verify(algorithm)
}

module.exports = {
  Sign: createSign,
  Verify: createVerify,
  createSign: createSign,
  createVerify: createVerify
}

},
// 95
function (module, exports, __webpack_require__) {

var createHmac = __webpack_require__(22),
  crt = __webpack_require__(30),
  EC = __webpack_require__(31).ec,
  BN = __webpack_require__(2),
  parseKeys = __webpack_require__(19),
  curves = __webpack_require__(61)

function sign(hash, key, hashType, signType, tag) {
  var priv = parseKeys(key)
  if (priv.curve) {
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa')
      throw new Error('wrong private key type')
    return ecSign(hash, priv)
  }
  if (priv.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong private key type')
    return dsaSign(hash, priv, hashType)
  }
  if (signType !== 'rsa' && signType !== 'ecdsa/rsa')
    throw new Error('wrong private key type')

  hash = Buffer.concat([tag, hash])
  var len = priv.modulus.byteLength(),
    pad = [0, 1]
  while (hash.length + pad.length + 1 < len) pad.push(0xff)
  pad.push(0x00)
  for (var i = -1; ++i < hash.length; ) pad.push(hash[i])

  return crt(pad, priv)
}

function ecSign(hash, priv) {
  var curveId = curves[priv.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + priv.curve.join('.'))

  var out = new EC(curveId).keyFromPrivate(priv.privateKey).sign(hash)

  return new Buffer(out.toDER())
}

function dsaSign(hash, priv, algo) {
  var k,
    x = priv.params.priv_key,
    p = priv.params.p,
    q = priv.params.q,
    g = priv.params.g,
    r = new BN(0),
    H = bits2int(hash, q).mod(q),
    s = false,
    kv = getKey(x, q, hash, algo)
  while (s === false) {
    r = makeR(g, (k = makeKey(q, kv, algo)), p, q)
    if ((s = k.invm(q).imul(H.add(x.mul(r))).mod(q)).cmpn(0) === 0) {
      s = false
      r = new BN(0)
    }
  }
  return toDER(r, s)
}

function toDER(r, s) {
  r = r.toArray()
  s = s.toArray()

  if (r[0] & 0x80) r = [0].concat(r)
  if (s[0] & 0x80) s = [0].concat(s)

  var res = [0x30, r.length + s.length + 4, 0x02, r.length]
  res = res.concat(r, [0x02, s.length], s)
  return new Buffer(res)
}

function getKey(x, q, hash, algo) {
  if ((x = new Buffer(x.toArray())).length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - x.length)
    zeros.fill(0)
    x = Buffer.concat([zeros, x])
  }
  var hlen = hash.length,
    hbits = bits2octets(hash, q),
    v = new Buffer(hlen)
  v.fill(1)
  var k = new Buffer(hlen)
  k.fill(0)
  k = createHmac(algo, k)
    .update(v).update(new Buffer([0])).update(x).update(hbits).digest()
  v = createHmac(algo, k).update(v).digest()
  k = createHmac(algo, k)
    .update(v).update(new Buffer([1])).update(x).update(hbits).digest()
  return { k: k, v: createHmac(algo, k).update(v).digest() }
}

function bits2int(obits, q) {
  var bits = new BN(obits),
    shift = (obits.length << 3) - q.bitLength()
  shift > 0 && bits.ishrn(shift)
  return bits
}

function bits2octets(bits, q) {
  bits = bits2int(bits, q).mod(q)
  var out = new Buffer(bits.toArray())
  if (out.length < q.byteLength()) {
    var zeros = new Buffer(q.byteLength() - out.length)
    zeros.fill(0)
    out = Buffer.concat([zeros, out])
  }
  return out
}

function makeKey(q, kv, algo) {
  var t, k

  do {
    t = new Buffer(0)

    while (t.length * 8 < q.bitLength()) {
      kv.v = createHmac(algo, kv.k).update(kv.v).digest()
      t = Buffer.concat([t, kv.v])
    }

    k = bits2int(t, q)
    kv.k = createHmac(algo, kv.k).update(kv.v).update(new Buffer([0])).digest()
    kv.v = createHmac(algo, kv.k).update(kv.v).digest()
  } while (k.cmp(q) !== -1)

  return k
}

function makeR(g, k, p, q) {
  return g.toRed(BN.mont(p)).redPow(k).fromRed().mod(q)
}

module.exports = sign
module.exports.getKey = getKey
module.exports.makeKey = makeKey

},
// 96
function (module) {

module.exports = { name: 'elliptic', version: '6.5.3' };

},
// 97
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(4),
  BN = __webpack_require__(2),
  inherits = __webpack_require__(1),
  Base = __webpack_require__(18),

  assert = utils.assert;

function ShortCurve(conf) {
  Base.call(this, 'short', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.tinv = this.two.redInvm();

  this.zeroA = this.a.fromRed().cmpn(0) === 0;
  this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;

  this.endo = this._getEndomorphism(conf);
  this._endoWnafT1 = new Array(4);
  this._endoWnafT2 = new Array(4);
}
inherits(ShortCurve, Base);
module.exports = ShortCurve;

ShortCurve.prototype._getEndomorphism = function (conf) {
  if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1) return;

  var beta, lambda;
  if (conf.beta) beta = new BN(conf.beta, 16).toRed(this.red);
  else {
    var betas = this._getEndoRoots(this.p);
    beta = (betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1]).toRed(this.red);
  }
  if (conf.lambda) lambda = new BN(conf.lambda, 16);
  else {
    var lambdas = this._getEndoRoots(this.n);
    if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0)
      lambda = lambdas[0];
    else {
      lambda = lambdas[1];
      assert(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
    }
  }

  var basis = conf.basis
    ? conf.basis.map(function (vec) {
        return { a: new BN(vec.a, 16), b: new BN(vec.b, 16) };
      })
    : this._getEndoBasis(lambda);

  return { beta: beta, lambda: lambda, basis: basis };
};

ShortCurve.prototype._getEndoRoots = function (num) {
  var red = num === this.p ? this.red : BN.mont(num),
    tinv = new BN(2).toRed(red).redInvm(),
    ntinv = tinv.redNeg(),

    s = new BN(3).toRed(red).redNeg().redSqrt().redMul(tinv);

  return [ntinv.redAdd(s).fromRed(), ntinv.redSub(s).fromRed()];
};

ShortCurve.prototype._getEndoBasis = function (lambda) {
  var a0, b0, a1, b1, a2, b2, prevR, r, x;
  var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),

    u = lambda,
    v = this.n.clone(),
    x1 = new BN(1),
    y1 = new BN(0),
    x2 = new BN(0),
    y2 = new BN(1);

  for (var i = 0; u.cmpn(0) !== 0; ) {
    var q = v.div(u);
    r = v.sub(q.mul(u));
    x = x2.sub(q.mul(x1));
    var y = y2.sub(q.mul(y1));

    if (!a1 && r.cmp(aprxSqrt) < 0) {
      a0 = prevR.neg();
      b0 = x1;
      a1 = r.neg();
      b1 = x;
    } else if (a1 && ++i == 2) break;

    prevR = r;

    v = u;
    u = r;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
  }
  a2 = r.neg();
  b2 = x;

  var len1 = a1.sqr().add(b1.sqr());
  if (a2.sqr().add(b2.sqr()).cmp(len1) >= 0) {
    a2 = a0;
    b2 = b0;
  }

  if (a1.negative) {
    a1 = a1.neg();
    b1 = b1.neg();
  }
  if (a2.negative) {
    a2 = a2.neg();
    b2 = b2.neg();
  }

  return [
    { a: a1, b: b1 },
    { a: a2, b: b2 }
  ];
};

ShortCurve.prototype._endoSplit = function (k) {
  var basis = this.endo.basis,
    v1 = basis[0],
    v2 = basis[1],

    c1 = v2.b.mul(k).divRound(this.n),
    c2 = v1.b.neg().mul(k).divRound(this.n),

    p1 = c1.mul(v1.a),
    p2 = c2.mul(v2.a),
    q1 = c1.mul(v1.b),
    q2 = c2.mul(v2.b);

  return { k1: k.sub(p1).sub(p2), k2: q1.add(q2).neg() };
};

ShortCurve.prototype.pointFromX = function (x, odd) {
  (x = new BN(x, 16)).red || (x = x.toRed(this.red));

  var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b),
    y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0) throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if ((odd && !isOdd) || (!odd && isOdd)) y = y.redNeg();

  return this.point(x, y);
};

ShortCurve.prototype.validate = function (point) {
  if (point.inf) return true;

  var x = point.x,
    y = point.y,

    ax = this.a.redMul(x),
    rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
  return y.redSqr().redISub(rhs).cmpn(0) === 0;
};

ShortCurve.prototype._endoWnafMulAdd = function (points, coeffs, jacobianResult) {
  var npoints = this._endoWnafT1,
    ncoeffs = this._endoWnafT2;
  for (var i = 0; i < points.length; i++) {
    var split = this._endoSplit(coeffs[i]),
      p = points[i],
      beta = p._getBeta();

    if (split.k1.negative) {
      split.k1.ineg();
      p = p.neg(true);
    }
    if (split.k2.negative) {
      split.k2.ineg();
      beta = beta.neg(true);
    }

    npoints[i * 2] = p;
    npoints[i * 2 + 1] = beta;
    ncoeffs[i * 2] = split.k1;
    ncoeffs[i * 2 + 1] = split.k2;
  }
  var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);

  for (var j = 0; j < i * 2; j++) {
    npoints[j] = null;
    ncoeffs[j] = null;
  }
  return res;
};

function Point(curve, x, y, isRed) {
  Base.BasePoint.call(this, curve, 'affine');
  if (x === null && y === null) {
    this.x = null;
    this.y = null;
    this.inf = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    if (isRed) {
      this.x.forceRed(this.curve.red);
      this.y.forceRed(this.curve.red);
    }
    this.x.red || (this.x = this.x.toRed(this.curve.red));
    this.y.red || (this.y = this.y.toRed(this.curve.red));
    this.inf = false;
  }
}
inherits(Point, Base.BasePoint);

ShortCurve.prototype.point = function (x, y, isRed) {
  return new Point(this, x, y, isRed);
};

ShortCurve.prototype.pointFromJSON = function (obj, red) {
  return Point.fromJSON(this, obj, red);
};

Point.prototype._getBeta = function () {
  if (!this.curve.endo) return;

  var pre = this.precomputed;
  if (pre && pre.beta) return pre.beta;

  var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
  if (pre) {
    var curve = this.curve;
    var endoMul = function (p) {
      return curve.point(p.x.redMul(curve.endo.beta), p.y);
    };
    pre.beta = beta;
    beta.precomputed = {
      beta: null,
      naf: pre.naf && { wnd: pre.naf.wnd, points: pre.naf.points.map(endoMul) },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(endoMul)
      }
    };
  }
  return beta;
};

Point.prototype.toJSON = function () {
  if (!this.precomputed) return [this.x, this.y];

  return [this.x, this.y, this.precomputed && {
    doubles: this.precomputed.doubles && {
      step: this.precomputed.doubles.step,
      points: this.precomputed.doubles.points.slice(1)
    },
    naf: this.precomputed.naf && {
      wnd: this.precomputed.naf.wnd,
      points: this.precomputed.naf.points.slice(1)
    }
  }];
};

Point.fromJSON = function (curve, obj, red) {
  if (typeof obj == 'string') obj = JSON.parse(obj);
  var res = curve.point(obj[0], obj[1], red);
  if (!obj[2]) return res;

  function obj2point(obj) {
    return curve.point(obj[0], obj[1], red);
  }

  var pre = obj[2];
  res.precomputed = {
    beta: null,
    doubles: pre.doubles && {
      step: pre.doubles.step,
      points: [res].concat(pre.doubles.points.map(obj2point))
    },
    naf: pre.naf && {
      wnd: pre.naf.wnd,
      points: [res].concat(pre.naf.points.map(obj2point))
    }
  };
  return res;
};

Point.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function () {
  return this.inf;
};

Point.prototype.add = function (p) {
  if (this.inf) return p;

  if (p.inf) return this;

  if (this.eq(p)) return this.dbl();

  if (this.neg().eq(p)) return this.curve.point(null, null);

  if (this.x.cmp(p.x) === 0) return this.curve.point(null, null);

  var c = this.y.redSub(p.y);
  if (c.cmpn(0) !== 0) c = c.redMul(this.x.redSub(p.x).redInvm());
  var nx = c.redSqr().redISub(this.x).redISub(p.x),
    ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.dbl = function () {
  if (this.inf) return this;

  var ys1 = this.y.redAdd(this.y);
  if (ys1.cmpn(0) === 0) return this.curve.point(null, null);

  var a = this.curve.a,

    x2 = this.x.redSqr(),
    dyinv = ys1.redInvm(),
    c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv),

    nx = c.redSqr().redISub(this.x.redAdd(this.x)),
    ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
  return this.curve.point(nx, ny);
};

Point.prototype.getX = function () {
  return this.x.fromRed();
};

Point.prototype.getY = function () {
  return this.y.fromRed();
};

Point.prototype.mul = function (k) {
  k = new BN(k, 16);
  return this.isInfinity()
    ? this
    : this._hasDoubles(k)
    ? this.curve._fixedNafMul(this, k)
    : this.curve.endo
    ? this.curve._endoWnafMulAdd([this], [k])
    : this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function (k1, p2, k2) {
  var points = [this, p2],
    coeffs = [k1, k2];
  return this.curve.endo
    ? this.curve._endoWnafMulAdd(points, coeffs)
    : this.curve._wnafMulAdd(1, points, coeffs, 2);
};

Point.prototype.jmulAdd = function (k1, p2, k2) {
  var points = [this, p2],
    coeffs = [k1, k2];
  return this.curve.endo
    ? this.curve._endoWnafMulAdd(points, coeffs, true)
    : this.curve._wnafMulAdd(1, points, coeffs, 2, true);
};

Point.prototype.eq = function (p) {
  return this === p || (this.inf === p.inf &&
      (this.inf || (this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0)));
};

Point.prototype.neg = function (_precompute) {
  if (this.inf) return this;

  var res = this.curve.point(this.x, this.y.redNeg());
  if (_precompute && this.precomputed) {
    var pre = this.precomputed;
    var negate = function (p) {
      return p.neg();
    };
    res.precomputed = {
      naf: pre.naf && { wnd: pre.naf.wnd, points: pre.naf.points.map(negate) },
      doubles: pre.doubles && {
        step: pre.doubles.step,
        points: pre.doubles.points.map(negate)
      }
    };
  }
  return res;
};

Point.prototype.toJ = function () {
  return this.inf
    ? this.curve.jpoint(null, null, null)
    : this.curve.jpoint(this.x, this.y, this.curve.one);
};

function JPoint(curve, x, y, z) {
  Base.BasePoint.call(this, curve, 'jacobian');
  if (x === null && y === null && z === null) {
    this.x = this.curve.one;
    this.y = this.curve.one;
    this.z = new BN(0);
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = new BN(z, 16);
  }
  this.x.red || (this.x = this.x.toRed(this.curve.red));
  this.y.red || (this.y = this.y.toRed(this.curve.red));
  this.z.red || (this.z = this.z.toRed(this.curve.red));

  this.zOne = this.z === this.curve.one;
}
inherits(JPoint, Base.BasePoint);

ShortCurve.prototype.jpoint = function (x, y, z) {
  return new JPoint(this, x, y, z);
};

JPoint.prototype.toP = function () {
  if (this.isInfinity()) return this.curve.point(null, null);

  var zinv = this.z.redInvm(),
    zinv2 = zinv.redSqr(),
    ax = this.x.redMul(zinv2),
    ay = this.y.redMul(zinv2).redMul(zinv);

  return this.curve.point(ax, ay);
};

JPoint.prototype.neg = function () {
  return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
};

JPoint.prototype.add = function (p) {
  if (this.isInfinity()) return p;

  if (p.isInfinity()) return this;

  var pz2 = p.z.redSqr(),
    z2 = this.z.redSqr(),
    u1 = this.x.redMul(pz2),
    u2 = p.x.redMul(z2),
    s1 = this.y.redMul(pz2.redMul(p.z)),
    s2 = p.y.redMul(z2.redMul(this.z)),

    h = u1.redSub(u2),
    r = s1.redSub(s2);
  if (h.cmpn(0) === 0)
    return r.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();

  var h2 = h.redSqr(),
    h3 = h2.redMul(h),
    v = u1.redMul(h2),

    nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v),
    ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3)),
    nz = this.z.redMul(p.z).redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mixedAdd = function (p) {
  if (this.isInfinity()) return p.toJ();

  if (p.isInfinity()) return this;

  var z2 = this.z.redSqr(),
    u1 = this.x,
    u2 = p.x.redMul(z2),
    s1 = this.y,
    s2 = p.y.redMul(z2).redMul(this.z),

    h = u1.redSub(u2),
    r = s1.redSub(s2);
  if (h.cmpn(0) === 0)
    return r.cmpn(0) !== 0 ? this.curve.jpoint(null, null, null) : this.dbl();

  var h2 = h.redSqr(),
    h3 = h2.redMul(h),
    v = u1.redMul(h2),

    nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v),
    ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3)),
    nz = this.z.redMul(h);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.dblp = function (pow) {
  if (pow === 0 || this.isInfinity()) return this;
  if (!pow) return this.dbl();

  if (this.curve.zeroA || this.curve.threeA) {
    var r = this;
    for (var i = 0; i < pow; i++) r = r.dbl();
    return r;
  }

  var a = this.curve.a,
    tinv = this.curve.tinv,

    jx = this.x,
    jy = this.y,
    jz = this.z,
    jz4 = jz.redSqr().redSqr(),

    jyd = jy.redAdd(jy);
  for (i = 0; i < pow; i++) {
    var jx2 = jx.redSqr(),
      jyd2 = jyd.redSqr(),
      jyd4 = jyd2.redSqr(),
      c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4)),

      t1 = jx.redMul(jyd2),
      nx = c.redSqr().redISub(t1.redAdd(t1)),
      t2 = t1.redISub(nx),
      dny = c.redMul(t2);
    dny = dny.redIAdd(dny).redISub(jyd4);
    var nz = jyd.redMul(jz);
    if (i + 1 < pow) jz4 = jz4.redMul(jyd4);

    jx = nx;
    jz = nz;
    jyd = dny;
  }

  return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
};

JPoint.prototype.dbl = function () {
  return this.isInfinity()
    ? this
    : this.curve.zeroA
    ? this._zeroDbl()
    : this.curve.threeA
    ? this._threeDbl()
    : this._dbl();
};

JPoint.prototype._zeroDbl = function () {
  var nx, ny, nz;
  if (this.zOne) {
    var xx = this.x.redSqr(),
      yy = this.y.redSqr(),
      yyyy = yy.redSqr(),
      s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    var m = xx.redAdd(xx).redIAdd(xx),
      t = m.redSqr().redISub(s).redISub(s),

      yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = (yyyy8 = yyyy8.redIAdd(yyyy8)).redIAdd(yyyy8);

    nx = t;
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    nz = this.y.redAdd(this.y);
  } else {
    var a = this.x.redSqr(),
      b = this.y.redSqr(),
      c = b.redSqr(),
      d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
    d = d.redIAdd(d);
    var e = a.redAdd(a).redIAdd(a),
      f = e.redSqr(),

      c8 = c.redIAdd(c);
    c8 = (c8 = c8.redIAdd(c8)).redIAdd(c8);

    nx = f.redISub(d).redISub(d);
    ny = e.redMul(d.redISub(nx)).redISub(c8);
    nz = (nz = this.y.redMul(this.z)).redIAdd(nz);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._threeDbl = function () {
  var nx, ny, nz;
  if (this.zOne) {
    var xx = this.x.redSqr(),
      yy = this.y.redSqr(),
      yyyy = yy.redSqr(),
      s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
    s = s.redIAdd(s);
    var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a),
      t = m.redSqr().redISub(s).redISub(s);
    nx = t;
    var yyyy8 = yyyy.redIAdd(yyyy);
    yyyy8 = (yyyy8 = yyyy8.redIAdd(yyyy8)).redIAdd(yyyy8);
    ny = m.redMul(s.redISub(t)).redISub(yyyy8);
    nz = this.y.redAdd(this.y);
  } else {
    var delta = this.z.redSqr(),
      gamma = this.y.redSqr(),
      beta = this.x.redMul(gamma),
      alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
    alpha = alpha.redAdd(alpha).redIAdd(alpha);
    var beta4 = beta.redIAdd(beta),
      beta8 = (beta4 = beta4.redIAdd(beta4)).redAdd(beta4);
    nx = alpha.redSqr().redISub(beta8);
    nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
    var ggamma8 = gamma.redSqr();
    ggamma8 = (ggamma8 = ggamma8.redIAdd(ggamma8)).redIAdd(ggamma8);
    ggamma8 = ggamma8.redIAdd(ggamma8);
    ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
  }

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype._dbl = function () {
  var a = this.curve.a,

    jx = this.x,
    jy = this.y,
    jz = this.z,
    jz4 = jz.redSqr().redSqr(),

    jx2 = jx.redSqr(),
    jy2 = jy.redSqr(),

    c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4)),

    jxd4 = jx.redAdd(jx),
    t1 = (jxd4 = jxd4.redIAdd(jxd4)).redMul(jy2),
    nx = c.redSqr().redISub(t1.redAdd(t1)),
    t2 = t1.redISub(nx),

    jyd8 = jy2.redSqr();
  jyd8 = (jyd8 = (jyd8 = jyd8.redIAdd(jyd8)).redIAdd(jyd8)).redIAdd(jyd8);
  var ny = c.redMul(t2).redISub(jyd8),
    nz = jy.redAdd(jy).redMul(jz);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.trpl = function () {
  if (!this.curve.zeroA) return this.dbl().add(this);

  var xx = this.x.redSqr(),
    yy = this.y.redSqr(),
    zz = this.z.redSqr(),
    yyyy = yy.redSqr(),
    m = xx.redAdd(xx).redIAdd(xx),
    mm = m.redSqr(),
    e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy),
    ee = (e = (e = (e = e.redIAdd(e)).redAdd(e).redIAdd(e)).redISub(mm)).redSqr(),
    t = yyyy.redIAdd(yyyy);
  t = (t = (t = t.redIAdd(t)).redIAdd(t)).redIAdd(t);
  var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t),
    yyu4 = yy.redMul(u);
  yyu4 = (yyu4 = yyu4.redIAdd(yyu4)).redIAdd(yyu4);
  var nx = this.x.redMul(ee).redISub(yyu4);
  nx = (nx = nx.redIAdd(nx)).redIAdd(nx);
  var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
  ny = (ny = (ny = ny.redIAdd(ny)).redIAdd(ny)).redIAdd(ny);
  var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);

  return this.curve.jpoint(nx, ny, nz);
};

JPoint.prototype.mul = function (k, kbase) {
  k = new BN(k, kbase);

  return this.curve._wnafMul(this, k);
};

JPoint.prototype.eq = function (p) {
  if (p.type === 'affine') return this.eq(p.toJ());

  if (this === p) return true;

  var z2 = this.z.redSqr(),
    pz2 = p.z.redSqr();
  if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0) return false;

  var z3 = z2.redMul(this.z),
    pz3 = pz2.redMul(p.z);
  return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
};

JPoint.prototype.eqXToP = function (x) {
  var zs = this.z.redSqr(),
    rx = x.toRed(this.curve.red).redMul(zs);
  if (this.x.cmp(rx) === 0) return true;

  for (var xc = x.clone(), t = this.curve.redN.redMul(zs); ; ) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0) return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0) return true;
  }
};

JPoint.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC JPoint Infinity>'
    : '<EC JPoint x: ' + this.x.toString(16, 2) +
      ' y: ' + this.y.toString(16, 2) +
      ' z: ' + this.z.toString(16, 2) + '>';
};

JPoint.prototype.isInfinity = function () {
  return this.z.cmpn(0) === 0;
};

},
// 98
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  inherits = __webpack_require__(1),
  Base = __webpack_require__(18),

  utils = __webpack_require__(4);

function MontCurve(conf) {
  Base.call(this, 'mont', conf);

  this.a = new BN(conf.a, 16).toRed(this.red);
  this.b = new BN(conf.b, 16).toRed(this.red);
  this.i4 = new BN(4).toRed(this.red).redInvm();
  this.two = new BN(2).toRed(this.red);
  this.a24 = this.i4.redMul(this.a.redAdd(this.two));
}
inherits(MontCurve, Base);
module.exports = MontCurve;

MontCurve.prototype.validate = function (point) {
  var x = point.normalize().x,
    x2 = x.redSqr(),
    rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);

  return rhs.redSqrt().redSqr().cmp(rhs) === 0;
};

function Point(curve, x, z) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && z === null) {
    this.x = this.curve.one;
    this.z = this.curve.zero;
  } else {
    this.x = new BN(x, 16);
    this.z = new BN(z, 16);
    this.x.red || (this.x = this.x.toRed(this.curve.red));
    this.z.red || (this.z = this.z.toRed(this.curve.red));
  }
}
inherits(Point, Base.BasePoint);

MontCurve.prototype.decodePoint = function (bytes, enc) {
  return this.point(utils.toArray(bytes, enc), 1);
};

MontCurve.prototype.point = function (x, z) {
  return new Point(this, x, z);
};

MontCurve.prototype.pointFromJSON = function (obj) {
  return Point.fromJSON(this, obj);
};

Point.prototype.precompute = function () {};

Point.prototype._encode = function () {
  return this.getX().toArray('be', this.curve.p.byteLength());
};

Point.fromJSON = function (curve, obj) {
  return new Point(curve, obj[0], obj[1] || curve.one);
};

Point.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function () {
  return this.z.cmpn(0) === 0;
};

Point.prototype.dbl = function () {
  var aa = this.x.redAdd(this.z).redSqr(),
    bb = this.x.redSub(this.z).redSqr(),
    c = aa.redSub(bb),
    nx = aa.redMul(bb),
    nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
  return this.curve.point(nx, nz);
};

Point.prototype.add = function () {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.diffAdd = function (p, diff) {
  var a = this.x.redAdd(this.z),
    b = this.x.redSub(this.z),
    c = p.x.redAdd(p.z),
    da = p.x.redSub(p.z).redMul(a),
    cb = c.redMul(b),
    nx = diff.z.redMul(da.redAdd(cb).redSqr()),
    nz = diff.x.redMul(da.redISub(cb).redSqr());
  return this.curve.point(nx, nz);
};

Point.prototype.mul = function (k) {
  var t = k.clone(),
    a = this,
    b = this.curve.point(null, null),
    c = this;

  for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1)) bits.push(t.andln(1));

  for (var i = bits.length - 1; i >= 0; i--)
    if (bits[i] === 0) {
      a = a.diffAdd(b, c);
      b = b.dbl();
    } else {
      b = a.diffAdd(b, c);
      a = a.dbl();
    }

  return b;
};

Point.prototype.mulAdd = function () {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.jumlAdd = function () {
  throw new Error('Not supported on Montgomery curve');
};

Point.prototype.eq = function (other) {
  return this.getX().cmp(other.getX()) === 0;
};

Point.prototype.normalize = function () {
  this.x = this.x.redMul(this.z.redInvm());
  this.z = this.curve.one;
  return this;
};

Point.prototype.getX = function () {
  this.normalize();

  return this.x.fromRed();
};

},
// 99
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(4),
  BN = __webpack_require__(2),
  inherits = __webpack_require__(1),
  Base = __webpack_require__(18),

  assert = utils.assert;

function EdwardsCurve(conf) {
  this.twisted = (conf.a | 0) != 1;
  this.mOneA = this.twisted && (conf.a | 0) == -1;
  this.extended = this.mOneA;

  Base.call(this, 'edwards', conf);

  this.a = new BN(conf.a, 16).umod(this.red.m);
  this.a = this.a.toRed(this.red);
  this.c = new BN(conf.c, 16).toRed(this.red);
  this.c2 = this.c.redSqr();
  this.d = new BN(conf.d, 16).toRed(this.red);
  this.dd = this.d.redAdd(this.d);

  assert(!this.twisted || this.c.fromRed().cmpn(1) === 0);
  this.oneC = (conf.c | 0) == 1;
}
inherits(EdwardsCurve, Base);
module.exports = EdwardsCurve;

EdwardsCurve.prototype._mulA = function (num) {
  return this.mOneA ? num.redNeg() : this.a.redMul(num);
};

EdwardsCurve.prototype._mulC = function (num) {
  return this.oneC ? num : this.c.redMul(num);
};

EdwardsCurve.prototype.jpoint = function (x, y, z, t) {
  return this.point(x, y, z, t);
};

EdwardsCurve.prototype.pointFromX = function (x, odd) {
  (x = new BN(x, 16)).red || (x = x.toRed(this.red));

  var x2 = x.redSqr(),
    rhs = this.c2.redSub(this.a.redMul(x2)),
    lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2)),

    y2 = rhs.redMul(lhs.redInvm()),
    y = y2.redSqrt();
  if (y.redSqr().redSub(y2).cmp(this.zero) !== 0) throw new Error('invalid point');

  var isOdd = y.fromRed().isOdd();
  if ((odd && !isOdd) || (!odd && isOdd)) y = y.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.pointFromY = function (y, odd) {
  (y = new BN(y, 16)).red || (y = y.toRed(this.red));

  var y2 = y.redSqr(),
    lhs = y2.redSub(this.c2),
    rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a),
    x2 = lhs.redMul(rhs.redInvm());

  if (x2.cmp(this.zero) === 0) {
    if (odd) throw new Error('invalid point');

    return this.point(this.zero, y);
  }

  var x = x2.redSqrt();
  if (x.redSqr().redSub(x2).cmp(this.zero) !== 0) throw new Error('invalid point');

  if (x.fromRed().isOdd() !== odd) x = x.redNeg();

  return this.point(x, y);
};

EdwardsCurve.prototype.validate = function (point) {
  if (point.isInfinity()) return true;

  point.normalize();

  var x2 = point.x.redSqr(),
    y2 = point.y.redSqr(),
    lhs = x2.redMul(this.a).redAdd(y2),
    rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));

  return lhs.cmp(rhs) === 0;
};

function Point(curve, x, y, z, t) {
  Base.BasePoint.call(this, curve, 'projective');
  if (x === null && y === null && z === null) {
    this.x = this.curve.zero;
    this.y = this.curve.one;
    this.z = this.curve.one;
    this.t = this.curve.zero;
    this.zOne = true;
  } else {
    this.x = new BN(x, 16);
    this.y = new BN(y, 16);
    this.z = z ? new BN(z, 16) : this.curve.one;
    this.t = t && new BN(t, 16);
    this.x.red || (this.x = this.x.toRed(this.curve.red));
    this.y.red || (this.y = this.y.toRed(this.curve.red));
    this.z.red || (this.z = this.z.toRed(this.curve.red));
    if (this.t && !this.t.red) this.t = this.t.toRed(this.curve.red);
    this.zOne = this.z === this.curve.one;

    if (this.curve.extended && !this.t) {
      this.t = this.x.redMul(this.y);
      this.zOne || (this.t = this.t.redMul(this.z.redInvm()));
    }
  }
}
inherits(Point, Base.BasePoint);

EdwardsCurve.prototype.pointFromJSON = function (obj) {
  return Point.fromJSON(this, obj);
};

EdwardsCurve.prototype.point = function (x, y, z, t) {
  return new Point(this, x, y, z, t);
};

Point.fromJSON = function (curve, obj) {
  return new Point(curve, obj[0], obj[1], obj[2]);
};

Point.prototype.inspect = function () {
  return this.isInfinity()
    ? '<EC Point Infinity>'
    : '<EC Point x: ' + this.x.fromRed().toString(16, 2) +
      ' y: ' + this.y.fromRed().toString(16, 2) +
      ' z: ' + this.z.fromRed().toString(16, 2) + '>';
};

Point.prototype.isInfinity = function () {
  return this.x.cmpn(0) === 0 &&
    (this.y.cmp(this.z) === 0 || (this.zOne && this.y.cmp(this.curve.c) === 0));
};

Point.prototype._extDbl = function () {
  var a = this.x.redSqr(),
    b = this.y.redSqr(),
    c = this.z.redSqr();
  c = c.redIAdd(c);
  var d = this.curve._mulA(a),
    e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b),
    g = d.redAdd(b),
    f = g.redSub(c),
    h = d.redSub(b),
    nx = e.redMul(f),
    ny = g.redMul(h),
    nt = e.redMul(h),
    nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projDbl = function () {
  var nx, ny, nz,

    b = this.x.redAdd(this.y).redSqr(),
    c = this.x.redSqr(),
    d = this.y.redSqr();

  if (this.curve.twisted) {
    var f = (e = this.curve._mulA(c)).redAdd(d);
    if (this.zOne) {
      nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
      ny = f.redMul(e.redSub(d));
      nz = f.redSqr().redSub(f).redSub(f);
    } else {
      var h = this.z.redSqr(),
        j = f.redSub(h).redISub(h);
      nx = b.redSub(c).redISub(d).redMul(j);
      ny = f.redMul(e.redSub(d));
      nz = f.redMul(j);
    }
  } else {
    var e = c.redAdd(d);
    h = this.curve._mulC(this.z).redSqr();
    j = e.redSub(h).redSub(h);
    nx = this.curve._mulC(b.redISub(e)).redMul(j);
    ny = this.curve._mulC(e).redMul(c.redISub(d));
    nz = e.redMul(j);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.dbl = function () {
  return this.isInfinity()
    ? this
    : this.curve.extended
    ? this._extDbl()
    : this._projDbl();
};

Point.prototype._extAdd = function (p) {
  var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x)),
    b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x)),
    c = this.t.redMul(this.curve.dd).redMul(p.t),
    d = this.z.redMul(p.z.redAdd(p.z)),
    e = b.redSub(a),
    f = d.redSub(c),
    g = d.redAdd(c),
    h = b.redAdd(a),
    nx = e.redMul(f),
    ny = g.redMul(h),
    nt = e.redMul(h),
    nz = f.redMul(g);
  return this.curve.point(nx, ny, nz, nt);
};

Point.prototype._projAdd = function (p) {
  var ny, nz,
    a = this.z.redMul(p.z),
    b = a.redSqr(),
    c = this.x.redMul(p.x),
    d = this.y.redMul(p.y),
    e = this.curve.d.redMul(c).redMul(d),
    f = b.redSub(e),
    g = b.redAdd(e),
    tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d),
    nx = a.redMul(f).redMul(tmp);
  if (this.curve.twisted) {
    ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
    nz = f.redMul(g);
  } else {
    ny = a.redMul(g).redMul(d.redSub(c));
    nz = this.curve._mulC(f).redMul(g);
  }
  return this.curve.point(nx, ny, nz);
};

Point.prototype.add = function (p) {
  return this.isInfinity()
    ? p
    : p.isInfinity()
    ? this
    : this.curve.extended
    ? this._extAdd(p)
    : this._projAdd(p);
};

Point.prototype.mul = function (k) {
  return this._hasDoubles(k)
    ? this.curve._fixedNafMul(this, k)
    : this.curve._wnafMul(this, k);
};

Point.prototype.mulAdd = function (k1, p, k2) {
  return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, false);
};

Point.prototype.jmulAdd = function (k1, p, k2) {
  return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, true);
};

Point.prototype.normalize = function () {
  if (this.zOne) return this;

  var zi = this.z.redInvm();
  this.x = this.x.redMul(zi);
  this.y = this.y.redMul(zi);
  if (this.t) this.t = this.t.redMul(zi);
  this.z = this.curve.one;
  this.zOne = true;
  return this;
};

Point.prototype.neg = function () {
  return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg());
};

Point.prototype.getX = function () {
  this.normalize();
  return this.x.fromRed();
};

Point.prototype.getY = function () {
  this.normalize();
  return this.y.fromRed();
};

Point.prototype.eq = function (other) {
  return this === other ||
    (this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0);
};

Point.prototype.eqXToP = function (x) {
  var rx = x.toRed(this.curve.red).redMul(this.z);
  if (this.x.cmp(rx) === 0) return true;

  for (var xc = x.clone(), t = this.curve.redN.redMul(this.z); ; ) {
    xc.iadd(this.curve.n);
    if (xc.cmp(this.curve.p) >= 0) return false;

    rx.redIAdd(t);
    if (this.x.cmp(rx) === 0) return true;
  }
};

Point.prototype.toP = Point.prototype.normalize;
Point.prototype.mixedAdd = Point.prototype.add;

},
// 100
function (module, exports, __webpack_require__) {

exports.sha1 = __webpack_require__(101);
exports.sha224 = __webpack_require__(102);
exports.sha256 = __webpack_require__(55);
exports.sha384 = __webpack_require__(103);
exports.sha512 = __webpack_require__(56);

},
// 101
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  common = __webpack_require__(13),
  shaCommon = __webpack_require__(54),

  rotl32 = utils.rotl32,
  sum32 = utils.sum32,
  sum32_5 = utils.sum32_5,
  ft_1 = shaCommon.ft_1,
  BlockHash = common.BlockHash,

  sha1_K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];

function SHA1() {
  if (!(this instanceof SHA1)) return new SHA1();

  BlockHash.call(this);
  this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  this.W = new Array(80);
}

utils.inherits(SHA1, BlockHash);
module.exports = SHA1;

SHA1.blockSize = 512;
SHA1.outSize = 160;
SHA1.hmacStrength = 80;
SHA1.padLength = 64;

SHA1.prototype._update = function (msg, start) {
  var W = this.W;

  for (var i = 0; i < 16; i++) W[i] = msg[start + i];

  for (; i < W.length; i++)
    W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

  var a = this.h[0],
    b = this.h[1],
    c = this.h[2],
    d = this.h[3],
    e = this.h[4];

  for (i = 0; i < W.length; i++) {
    var s = ~~(i / 20),
      t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
    e = d;
    d = c;
    c = rotl32(b, 30);
    b = a;
    a = t;
  }

  this.h[0] = sum32(this.h[0], a);
  this.h[1] = sum32(this.h[1], b);
  this.h[2] = sum32(this.h[2], c);
  this.h[3] = sum32(this.h[3], d);
  this.h[4] = sum32(this.h[4], e);
};

SHA1.prototype._digest = function (enc) {
  return enc === 'hex' ? utils.toHex32(this.h, 'big') : utils.split32(this.h, 'big');
};

},
// 102
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  SHA256 = __webpack_require__(55);

function SHA224() {
  if (!(this instanceof SHA224)) return new SHA224();

  SHA256.call(this);
  this.h = [
    0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
    0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
  ];
}
utils.inherits(SHA224, SHA256);
module.exports = SHA224;

SHA224.blockSize = 512;
SHA224.outSize = 224;
SHA224.hmacStrength = 192;
SHA224.padLength = 64;

SHA224.prototype._digest = function (enc) {
  return enc === 'hex'
    ? utils.toHex32(this.h.slice(0, 7), 'big')
    : utils.split32(this.h.slice(0, 7), 'big');
};

},
// 103
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),

  SHA512 = __webpack_require__(56);

function SHA384() {
  if (!(this instanceof SHA384)) return new SHA384();

  SHA512.call(this);
  this.h = [
    0xcbbb9d5d, 0xc1059ed8, 0x629a292a, 0x367cd507,
    0x9159015a, 0x3070dd17, 0x152fecd8, 0xf70e5939,
    0x67332667, 0xffc00b31, 0x8eb44a87, 0x68581511,
    0xdb0c2e0d, 0x64f98fa7, 0x47b5481d, 0xbefa4fa4
  ];
}
utils.inherits(SHA384, SHA512);
module.exports = SHA384;

SHA384.blockSize = 1024;
SHA384.outSize = 384;
SHA384.hmacStrength = 192;
SHA384.padLength = 128;

SHA384.prototype._digest = function (enc) {
  return enc === 'hex'
    ? utils.toHex32(this.h.slice(0, 12), 'big')
    : utils.split32(this.h.slice(0, 12), 'big');
};

},
// 104
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  common = __webpack_require__(13),

  rotl32 = utils.rotl32,
  sum32 = utils.sum32,
  sum32_3 = utils.sum32_3,
  sum32_4 = utils.sum32_4,
  BlockHash = common.BlockHash;

function RIPEMD160() {
  if (!(this instanceof RIPEMD160)) return new RIPEMD160();

  BlockHash.call(this);

  this.h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  this.endian = 'little';
}
utils.inherits(RIPEMD160, BlockHash);
exports.ripemd160 = RIPEMD160;

RIPEMD160.blockSize = 512;
RIPEMD160.outSize = 160;
RIPEMD160.hmacStrength = 192;
RIPEMD160.padLength = 64;

RIPEMD160.prototype._update = function (msg, start) {
  var A = this.h[0],
    B = this.h[1],
    C = this.h[2],
    D = this.h[3],
    E = this.h[4],
    Ah = A,
    Bh = B,
    Ch = C,
    Dh = D,
    Eh = E;
  for (var j = 0; j < 80; j++) {
    var T =
      sum32(rotl32(sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)), s[j]), E);
    A = E;
    E = D;
    D = rotl32(C, 10);
    C = B;
    B = T;
    T = sum32(
      rotl32(sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)), sh[j]),
      Eh
    );
    Ah = Eh;
    Eh = Dh;
    Dh = rotl32(Ch, 10);
    Ch = Bh;
    Bh = T;
  }
  T = sum32_3(this.h[1], C, Dh);
  this.h[1] = sum32_3(this.h[2], D, Eh);
  this.h[2] = sum32_3(this.h[3], E, Ah);
  this.h[3] = sum32_3(this.h[4], A, Bh);
  this.h[4] = sum32_3(this.h[0], B, Ch);
  this.h[0] = T;
};

RIPEMD160.prototype._digest = function (enc) {
  return enc === 'hex'
    ? utils.toHex32(this.h, 'little')
    : utils.split32(this.h, 'little');
};

function f(j, x, y, z) {
  return j <= 15
    ? x ^ y ^ z
    : j <= 31
    ? (x & y) | (~x & z)
    : j <= 47
    ? (x | ~y) ^ z
    : j <= 63
    ? (x & z) | (y & ~z)
    : x ^ (y | ~z);
}

function K(j) {
  return j <= 15
    ? 0x00000000
    : j <= 31
    ? 0x5a827999
    : j <= 47
    ? 0x6ed9eba1
    : j <= 63
    ? 0x8f1bbcdc
    : 0xa953fd4e;
}

function Kh(j) {
  return j <= 15
    ? 0x50a28be6
    : j <= 31
    ? 0x5c4dd124
    : j <= 47
    ? 0x6d703ef3
    : j <= 63
    ? 0x7a6d76e9
    : 0x00000000;
}

var r = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15,
  3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11,
  5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7,
  12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
];

var rh = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5,
  10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0,
  4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1,
  5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
];

var s = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7,
  15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5,
  12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5,
  11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
];

var sh = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8,
  9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14,
  13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5,
  12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
];

},
// 105
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(5),
  assert = __webpack_require__(3);

function Hmac(hash, key, enc) {
  if (!(this instanceof Hmac)) return new Hmac(hash, key, enc);
  this.Hash = hash;
  this.blockSize = hash.blockSize / 8;
  this.outSize = hash.outSize / 8;
  this.inner = null;
  this.outer = null;

  this._init(utils.toArray(key, enc));
}
module.exports = Hmac;

Hmac.prototype._init = function (key) {
  if (key.length > this.blockSize) key = new this.Hash().update(key).digest();
  assert(key.length <= this.blockSize);

  for (var i = key.length; i < this.blockSize; i++) key.push(0);

  for (i = 0; i < key.length; i++) key[i] ^= 0x36;
  this.inner = new this.Hash().update(key);

  for (i = 0; i < key.length; i++) key[i] ^= 0x6a;
  this.outer = new this.Hash().update(key);
};

Hmac.prototype.update = function (msg, enc) {
  this.inner.update(msg, enc);
  return this;
};

Hmac.prototype.digest = function (enc) {
  this.outer.update(this.inner.digest());
  return this.outer.digest(enc);
};

},
// 106
function (module) {

module.exports = {
  doubles: {
    step: 4,
    points: [
      [
        'e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a',
        'f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'
      ],
      [
        '8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508',
        '11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'
      ],
      [
        '175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739',
        'd3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'
      ],
      [
        '363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640',
        '4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'
      ],
      [
        '8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c',
        '4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'
      ],
      [
        '723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda',
        '96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'
      ],
      [
        'eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa',
        '5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'
      ],
      [
        '100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0',
        'cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'
      ],
      [
        'e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d',
        '9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'
      ],
      [
        'feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d',
        'e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'
      ],
      [
        'da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1',
        '9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'
      ],
      [
        '53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0',
        '5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'
      ],
      [
        '8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047',
        '10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'
      ],
      [
        '385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862',
        '283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'
      ],
      [
        '6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7',
        '7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'
      ],
      [
        '3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd',
        '56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'
      ],
      [
        '85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83',
        '7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'
      ],
      [
        '948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a',
        '53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'
      ],
      [
        '6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8',
        'bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'
      ],
      [
        'e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d',
        '4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'
      ],
      [
        'e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725',
        '7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'
      ],
      [
        '213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754',
        '4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'
      ],
      [
        '4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c',
        '17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'
      ],
      [
        'fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6',
        '6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'
      ],
      [
        '76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39',
        'c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'
      ],
      [
        'c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891',
        '893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'
      ],
      [
        'd895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b',
        'febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'
      ],
      [
        'b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03',
        '2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'
      ],
      [
        'e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d',
        'eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'
      ],
      [
        'a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070',
        '7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'
      ],
      [
        '90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4',
        'e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'
      ],
      [
        '8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da',
        '662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'
      ],
      [
        'e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11',
        '1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'
      ],
      [
        '8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e',
        'efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'
      ],
      [
        'e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41',
        '2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'
      ],
      [
        'b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef',
        '67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'
      ],
      [
        'd68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8',
        'db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'
      ],
      [
        '324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d',
        '648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'
      ],
      [
        '4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96',
        '35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'
      ],
      [
        '9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd',
        'ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'
      ],
      [
        '6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5',
        '9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'
      ],
      [
        'a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266',
        '40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'
      ],
      [
        '7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71',
        '34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'
      ],
      [
        '928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac',
        'c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'
      ],
      [
        '85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751',
        '1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'
      ],
      [
        'ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e',
        '493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'
      ],
      [
        '827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241',
        'c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'
      ],
      [
        'eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3',
        'be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'
      ],
      [
        'e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f',
        '4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'
      ],
      [
        '1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19',
        'aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'
      ],
      [
        '146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be',
        'b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'
      ],
      [
        'fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9',
        '6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'
      ],
      [
        'da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2',
        '8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'
      ],
      [
        'a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13',
        '7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'
      ],
      [
        '174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c',
        'ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'
      ],
      [
        '959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba',
        '2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'
      ],
      [
        'd2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151',
        'e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'
      ],
      [
        '64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073',
        'd99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'
      ],
      [
        '8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458',
        '38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'
      ],
      [
        '13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b',
        '69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'
      ],
      [
        'bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366',
        'd3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'
      ],
      [
        '8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa',
        '40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'
      ],
      [
        '8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0',
        '620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'
      ],
      [
        'dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787',
        '7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'
      ],
      [
        'f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e',
        'ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82'
      ]
    ]
  },
  naf: {
    wnd: 7,
    points: [
      [
        'f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9',
        '388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'
      ],
      [
        '2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4',
        'd8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'
      ],
      [
        '5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc',
        '6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'
      ],
      [
        'acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe',
        'cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'
      ],
      [
        '774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb',
        'd984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'
      ],
      [
        'f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8',
        'ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'
      ],
      [
        'd7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e',
        '581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'
      ],
      [
        'defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34',
        '4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'
      ],
      [
        '2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c',
        '85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'
      ],
      [
        '352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5',
        '321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'
      ],
      [
        '2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f',
        '2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'
      ],
      [
        '9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714',
        '73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'
      ],
      [
        'daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729',
        'a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'
      ],
      [
        'c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db',
        '2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'
      ],
      [
        '6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4',
        'e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'
      ],
      [
        '1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5',
        'b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'
      ],
      [
        '605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479',
        '2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'
      ],
      [
        '62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d',
        '80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'
      ],
      [
        '80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f',
        '1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'
      ],
      [
        '7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb',
        'd0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'
      ],
      [
        'd528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9',
        'eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'
      ],
      [
        '49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963',
        '758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'
      ],
      [
        '77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74',
        '958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'
      ],
      [
        'f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530',
        'e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'
      ],
      [
        '463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b',
        '5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'
      ],
      [
        'f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247',
        'cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'
      ],
      [
        'caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1',
        'cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'
      ],
      [
        '2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120',
        '4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'
      ],
      [
        '7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435',
        '91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'
      ],
      [
        '754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18',
        '673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'
      ],
      [
        'e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8',
        '59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'
      ],
      [
        '186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb',
        '3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'
      ],
      [
        'df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f',
        '55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'
      ],
      [
        '5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143',
        'efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'
      ],
      [
        '290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba',
        'e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'
      ],
      [
        'af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45',
        'f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'
      ],
      [
        '766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a',
        '744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'
      ],
      [
        '59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e',
        'c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'
      ],
      [
        'f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8',
        'e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'
      ],
      [
        '7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c',
        '30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'
      ],
      [
        '948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519',
        'e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'
      ],
      [
        '7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab',
        '100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'
      ],
      [
        '3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca',
        'ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'
      ],
      [
        'd3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf',
        '8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'
      ],
      [
        '1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610',
        '68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'
      ],
      [
        '733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4',
        'f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'
      ],
      [
        '15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c',
        'd56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'
      ],
      [
        'a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940',
        'edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'
      ],
      [
        'e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980',
        'a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'
      ],
      [
        '311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3',
        '66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'
      ],
      [
        '34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf',
        '9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'
      ],
      [
        'f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63',
        '4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'
      ],
      [
        'd7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448',
        'fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'
      ],
      [
        '32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf',
        '5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'
      ],
      [
        '7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5',
        '8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'
      ],
      [
        'ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6',
        '8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'
      ],
      [
        '16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5',
        '5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'
      ],
      [
        'eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99',
        'f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'
      ],
      [
        '78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51',
        'f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'
      ],
      [
        '494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5',
        '42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'
      ],
      [
        'a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5',
        '204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'
      ],
      [
        'c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997',
        '4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'
      ],
      [
        '841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881',
        '73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'
      ],
      [
        '5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5',
        '39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'
      ],
      [
        '36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66',
        'd2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'
      ],
      [
        '336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726',
        'ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'
      ],
      [
        '8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede',
        '6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'
      ],
      [
        '1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94',
        '60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'
      ],
      [
        '85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31',
        '3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'
      ],
      [
        '29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51',
        'b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'
      ],
      [
        'a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252',
        'ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'
      ],
      [
        '4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5',
        'cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'
      ],
      [
        'd24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b',
        '6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'
      ],
      [
        'ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4',
        '322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'
      ],
      [
        'af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f',
        '6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'
      ],
      [
        'e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889',
        '2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'
      ],
      [
        '591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246',
        'b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'
      ],
      [
        '11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984',
        '998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'
      ],
      [
        '3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a',
        'b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'
      ],
      [
        'cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030',
        'bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'
      ],
      [
        'c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197',
        '6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'
      ],
      [
        'c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593',
        'c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'
      ],
      [
        'a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef',
        '21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'
      ],
      [
        '347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38',
        '60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'
      ],
      [
        'da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a',
        '49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'
      ],
      [
        'c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111',
        '5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'
      ],
      [
        '4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502',
        '7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'
      ],
      [
        '3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea',
        'be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'
      ],
      [
        'cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26',
        '8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'
      ],
      [
        'b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986',
        '39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'
      ],
      [
        'd4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e',
        '62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'
      ],
      [
        '48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4',
        '25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'
      ],
      [
        'dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda',
        'ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'
      ],
      [
        '6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859',
        'cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'
      ],
      [
        'e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f',
        'f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'
      ],
      [
        'eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c',
        '6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'
      ],
      [
        '13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942',
        'fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'
      ],
      [
        'ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a',
        '1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'
      ],
      [
        'b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80',
        '5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'
      ],
      [
        'ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d',
        '438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'
      ],
      [
        '8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1',
        'cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'
      ],
      [
        '52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63',
        'c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'
      ],
      [
        'e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352',
        '6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'
      ],
      [
        '7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193',
        'ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'
      ],
      [
        '5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00',
        '9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'
      ],
      [
        '32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58',
        'ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'
      ],
      [
        'e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7',
        'd3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'
      ],
      [
        '8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8',
        'c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'
      ],
      [
        '4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e',
        '67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'
      ],
      [
        '3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d',
        'cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'
      ],
      [
        '674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b',
        '299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'
      ],
      [
        'd32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f',
        'f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'
      ],
      [
        '30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6',
        '462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'
      ],
      [
        'be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297',
        '62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'
      ],
      [
        '93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a',
        '7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'
      ],
      [
        'b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c',
        'ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'
      ],
      [
        'd5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52',
        '4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'
      ],
      [
        'd3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb',
        'bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'
      ],
      [
        '463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065',
        'bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'
      ],
      [
        '7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917',
        '603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'
      ],
      [
        '74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9',
        'cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'
      ],
      [
        '30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3',
        '553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'
      ],
      [
        '9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57',
        '712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'
      ],
      [
        '176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66',
        'ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'
      ],
      [
        '75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8',
        '9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'
      ],
      [
        '809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721',
        '9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'
      ],
      [
        '1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180',
        '4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9'
      ]
    ]
  }
};

},
// 107
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  HmacDRBG = __webpack_require__(108),
  utils = __webpack_require__(4),
  curves = __webpack_require__(32),
  rand = __webpack_require__(29),
  assert = utils.assert,

  KeyPair = __webpack_require__(109),
  Signature = __webpack_require__(110);

function EC(options) {
  if (!(this instanceof EC)) return new EC(options);

  if (typeof options == 'string') {
    assert(curves.hasOwnProperty(options), 'Unknown curve ' + options);

    options = curves[options];
  }

  if (options instanceof curves.PresetCurve) options = { curve: options };

  this.curve = options.curve.curve;
  this.n = this.curve.n;
  this.nh = this.n.ushrn(1);
  this.g = this.curve.g;

  this.g = options.curve.g;
  this.g.precompute(options.curve.n.bitLength() + 1);

  this.hash = options.hash || options.curve.hash;
}
module.exports = EC;

EC.prototype.keyPair = function (options) {
  return new KeyPair(this, options);
};

EC.prototype.keyFromPrivate = function (priv, enc) {
  return KeyPair.fromPrivate(this, priv, enc);
};

EC.prototype.keyFromPublic = function (pub, enc) {
  return KeyPair.fromPublic(this, pub, enc);
};

EC.prototype.genKeyPair = function (options) {
  options || (options = {});

  var drbg = new HmacDRBG({
    hash: this.hash,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8',
    entropy: options.entropy || rand(this.hash.hmacStrength),
    entropyEnc: (options.entropy && options.entropyEnc) || 'utf8',
    nonce: this.n.toArray()
  });

  for (var bytes = this.n.byteLength(), ns2 = this.n.sub(new BN(2)); ; ) {
    var priv = new BN(drbg.generate(bytes));
    if (priv.cmp(ns2) > 0) continue;

    priv.iaddn(1);
    return this.keyFromPrivate(priv);
  }
};

EC.prototype._truncateToN = function (msg, truncOnly) {
  var delta = msg.byteLength() * 8 - this.n.bitLength();
  if (delta > 0) msg = msg.ushrn(delta);
  return !truncOnly && msg.cmp(this.n) >= 0 ? msg.sub(this.n) : msg;
};

EC.prototype.sign = function (msg, key, enc, options) {
  if (typeof enc == 'object') {
    options = enc;
    enc = null;
  }
  options || (options = {});

  key = this.keyFromPrivate(key, enc);
  msg = this._truncateToN(new BN(msg, 16));

  var bytes = this.n.byteLength(),
    bkey = key.getPrivate().toArray('be', bytes),

    nonce = msg.toArray('be', bytes);

  var drbg = new HmacDRBG({
    hash: this.hash,
    entropy: bkey,
    nonce: nonce,
    pers: options.pers,
    persEnc: options.persEnc || 'utf8'
  });

  for (var ns1 = this.n.sub(new BN(1)), iter = 0; ; iter++) {
    var k = options.k ? options.k(iter) : new BN(drbg.generate(this.n.byteLength()));
    if ((k = this._truncateToN(k, true)).cmpn(1) <= 0 || k.cmp(ns1) >= 0) continue;

    var kp = this.g.mul(k);
    if (kp.isInfinity()) continue;

    var kpX = kp.getX(),
      r = kpX.umod(this.n);
    if (r.cmpn(0) === 0) continue;

    var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
    if ((s = s.umod(this.n)).cmpn(0) === 0) continue;

    var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r) !== 0 ? 2 : 0);

    if (options.canonical && s.cmp(this.nh) > 0) {
      s = this.n.sub(s);
      recoveryParam ^= 1;
    }

    return new Signature({ r: r, s: s, recoveryParam: recoveryParam });
  }
};

EC.prototype.verify = function (msg, signature, key, enc) {
  msg = this._truncateToN(new BN(msg, 16));
  key = this.keyFromPublic(key, enc);
  var r = (signature = new Signature(signature, 'hex')).r,

    s = signature.s;
  if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0 || s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
    return false;

  var sinv = s.invm(this.n),
    u1 = sinv.mul(msg).umod(this.n),
    u2 = sinv.mul(r).umod(this.n);

  if (!this.curve._maxwellTrick) {
    var p = this.g.mulAdd(u1, key.getPublic(), u2);
    return !p.isInfinity() && p.getX().umod(this.n).cmp(r) === 0;
  }

  p = this.g.jmulAdd(u1, key.getPublic(), u2);
  return !p.isInfinity() && p.eqXToP(r);
};

EC.prototype.recoverPubKey = function (msg, signature, j, enc) {
  assert((3 & j) === j, 'The recovery param is more than two bits');
  signature = new Signature(signature, enc);

  var n = this.n,
    e = new BN(msg),
    r = signature.r,
    s = signature.s,

    isYOdd = j & 1,
    isSecondKey = j >> 1;
  if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
    throw new Error('Unable to find sencond key candinate');

  r = isSecondKey
    ? this.curve.pointFromX(r.add(this.curve.n), isYOdd)
    : this.curve.pointFromX(r, isYOdd);

  var rInv = signature.r.invm(n),
    s1 = n.sub(e).mul(rInv).umod(n),
    s2 = s.mul(rInv).umod(n);

  return this.g.mulAdd(s1, r, s2);
};

EC.prototype.getKeyRecoveryParam = function (e, signature, Q, enc) {
  signature = new Signature(signature, enc);
  if (signature.recoveryParam !== null) return signature.recoveryParam;

  for (var i = 0; i < 4; i++) {
    var Qprime;
    try {
      Qprime = this.recoverPubKey(e, signature, i);
    } catch (_) {
      continue;
    }

    if (Qprime.eq(Q)) return i;
  }
  throw new Error('Unable to find valid recovery factor');
};

},
// 108
function (module, exports, __webpack_require__) {

var hash = __webpack_require__(33),
  utils = __webpack_require__(52),
  assert = __webpack_require__(3);

function HmacDRBG(options) {
  if (!(this instanceof HmacDRBG)) return new HmacDRBG(options);
  this.hash = options.hash;
  this.predResist = !!options.predResist;

  this.outLen = this.hash.outSize;
  this.minEntropy = options.minEntropy || this.hash.hmacStrength;

  this._reseed = null;
  this.reseedInterval = null;
  this.K = null;
  this.V = null;

  var entropy = utils.toArray(options.entropy, options.entropyEnc || 'hex'),
    nonce = utils.toArray(options.nonce, options.nonceEnc || 'hex'),
    pers = utils.toArray(options.pers, options.persEnc || 'hex');
  assert(entropy.length >= this.minEntropy / 8,
      'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');
  this._init(entropy, nonce, pers);
}
module.exports = HmacDRBG;

HmacDRBG.prototype._init = function (entropy, nonce, pers) {
  var seed = entropy.concat(nonce).concat(pers);

  this.K = new Array(this.outLen / 8);
  this.V = new Array(this.outLen / 8);
  for (var i = 0; i < this.V.length; i++) {
    this.K[i] = 0x00;
    this.V[i] = 0x01;
  }

  this._update(seed);
  this._reseed = 1;
  this.reseedInterval = 0x1000000000000;
};

HmacDRBG.prototype._hmac = function () {
  return new hash.hmac(this.hash, this.K);
};

HmacDRBG.prototype._update = function (seed) {
  var kmac = this._hmac().update(this.V).update([0x00]);
  if (seed) kmac = kmac.update(seed);
  this.K = kmac.digest();
  this.V = this._hmac().update(this.V).digest();
  if (!seed) return;

  this.K = this._hmac().update(this.V).update([0x01]).update(seed).digest();
  this.V = this._hmac().update(this.V).digest();
};

HmacDRBG.prototype.reseed = function (entropy, entropyEnc, add, addEnc) {
  if (typeof entropyEnc != 'string') {
    addEnc = add;
    add = entropyEnc;
    entropyEnc = null;
  }

  entropy = utils.toArray(entropy, entropyEnc);
  add = utils.toArray(add, addEnc);

  assert(entropy.length >= this.minEntropy / 8,
      'Not enough entropy. Minimum is: ' + this.minEntropy + ' bits');

  this._update(entropy.concat(add || []));
  this._reseed = 1;
};

HmacDRBG.prototype.generate = function (len, enc, add, addEnc) {
  if (this._reseed > this.reseedInterval) throw new Error('Reseed is required');

  if (typeof enc != 'string') {
    addEnc = add;
    add = enc;
    enc = null;
  }

  if (add) {
    add = utils.toArray(add, addEnc || 'hex');
    this._update(add);
  }

  var temp = [];
  while (temp.length < len) {
    this.V = this._hmac().update(this.V).digest();
    temp = temp.concat(this.V);
  }

  var res = temp.slice(0, len);
  this._update(add);
  this._reseed++;
  return utils.encode(res, enc);
};

},
// 109
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  assert = __webpack_require__(4).assert;

function KeyPair(ec, options) {
  this.ec = ec;
  this.priv = null;
  this.pub = null;

  options.priv && this._importPrivate(options.priv, options.privEnc);
  options.pub && this._importPublic(options.pub, options.pubEnc);
}
module.exports = KeyPair;

KeyPair.fromPublic = function (ec, pub, enc) {
  return pub instanceof KeyPair ? pub : new KeyPair(ec, { pub: pub, pubEnc: enc });
};

KeyPair.fromPrivate = function (ec, priv, enc) {
  return priv instanceof KeyPair
    ? priv
    : new KeyPair(ec, { priv: priv, privEnc: enc });
};

KeyPair.prototype.validate = function () {
  var pub = this.getPublic();

  return pub.isInfinity()
    ? { result: false, reason: 'Invalid public key' }
    : !pub.validate()
    ? { result: false, reason: 'Public key is not a point' }
    : !pub.mul(this.ec.curve.n).isInfinity()
    ? { result: false, reason: 'Public key * N != O' }
    : { result: true, reason: null };
};

KeyPair.prototype.getPublic = function (compact, enc) {
  if (typeof compact == 'string') {
    enc = compact;
    compact = null;
  }

  this.pub || (this.pub = this.ec.g.mul(this.priv));

  return !enc ? this.pub : this.pub.encode(enc, compact);
};

KeyPair.prototype.getPrivate = function (enc) {
  return enc === 'hex' ? this.priv.toString(16, 2) : this.priv;
};

KeyPair.prototype._importPrivate = function (key, enc) {
  this.priv = new BN(key, enc || 16);

  this.priv = this.priv.umod(this.ec.curve.n);
};

KeyPair.prototype._importPublic = function (key, enc) {
  if (key.x || key.y) {
    this.ec.curve.type === 'mont'
      ? assert(key.x, 'Need x coordinate')
      : (this.ec.curve.type !== 'short' && this.ec.curve.type !== 'edwards') ||
        assert(key.x && key.y, 'Need both x and y coordinate');

    this.pub = this.ec.curve.point(key.x, key.y);
    return;
  }
  this.pub = this.ec.curve.decodePoint(key, enc);
};

KeyPair.prototype.derive = function (pub) {
  return pub.mul(this.priv).getX();
};

KeyPair.prototype.sign = function (msg, enc, options) {
  return this.ec.sign(msg, this, enc, options);
};

KeyPair.prototype.verify = function (msg, signature) {
  return this.ec.verify(msg, signature, this);
};

KeyPair.prototype.inspect = function () {
  return '<Key priv: ' + (this.priv && this.priv.toString(16, 2)) +
      ' pub: ' + (this.pub && this.pub.inspect()) + ' >';
};

},
// 110
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),

  utils = __webpack_require__(4),
  assert = utils.assert;

function Signature(options, enc) {
  if (options instanceof Signature) return options;

  if (this._importDER(options, enc)) return;

  assert(options.r && options.s, 'Signature without r or s');
  this.r = new BN(options.r, 16);
  this.s = new BN(options.s, 16);
  this.recoveryParam =
    options.recoveryParam === void 0 ? null : options.recoveryParam;
}
module.exports = Signature;

function Position() {
  this.place = 0;
}

function getLength(buf, p) {
  var initial = buf[p.place++];
  if (!(initial & 0x80)) return initial;

  var octetLen = initial & 0xf;

  if (octetLen === 0 || octetLen > 4) return false;

  var val = 0;
  for (var i = 0, off = p.place; i < octetLen; i++, off++) {
    val <<= 8;
    val |= buf[off];
    val >>>= 0;
  }

  if (val <= 0x7f) return false;

  p.place = off;
  return val;
}

function rmPadding(buf) {
  var i = 0;
  for (var len = buf.length - 1; !buf[i] && !(buf[i + 1] & 0x80) && i < len; ) i++;

  return i === 0 ? buf : buf.slice(i);
}

Signature.prototype._importDER = function (data, enc) {
  data = utils.toArray(data, enc);
  var p = new Position();
  if (data[p.place++] !== 0x30) return false;

  var len = getLength(data, p);
  if (len === false || len + p.place !== data.length || data[p.place++] !== 0x02)
    return false;

  var rlen = getLength(data, p);
  if (rlen === false) return false;

  var r = data.slice(p.place, rlen + p.place);
  p.place += rlen;
  if (data[p.place++] !== 0x02) return false;

  var slen = getLength(data, p);
  if (slen === false || data.length !== slen + p.place) return false;

  var s = data.slice(p.place, slen + p.place);
  if (r[0] === 0)
    if (r[1] & 0x80) r = r.slice(1);
    else return false;

  if (s[0] === 0)
    if (s[1] & 0x80) s = s.slice(1);
    else return false;

  this.r = new BN(r);
  this.s = new BN(s);
  this.recoveryParam = null;

  return true;
};

function constructLength(arr, len) {
  if (len < 0x80) {
    arr.push(len);
    return;
  }
  var octets = 1 + ((Math.log(len) / Math.LN2) >>> 3);
  arr.push(octets | 0x80);
  while (--octets) arr.push((len >>> (octets << 3)) & 0xff);

  arr.push(len);
}

Signature.prototype.toDER = function (enc) {
  var r = this.r.toArray(),
    s = this.s.toArray();

  if (r[0] & 0x80) r = [0].concat(r);
  if (s[0] & 0x80) s = [0].concat(s);

  r = rmPadding(r);
  s = rmPadding(s);

  while (!(s[0] || s[1] & 0x80)) s = s.slice(1);

  var arr = [0x02];
  constructLength(arr, r.length);
  (arr = arr.concat(r)).push(0x02);
  constructLength(arr, s.length);
  var backHalf = arr.concat(s),
    res = [0x30];
  constructLength(res, backHalf.length);
  res = res.concat(backHalf);
  return utils.encode(res, enc);
};

},
// 111
function (module, exports, __webpack_require__) {

var hash = __webpack_require__(33),
  curves = __webpack_require__(32),
  utils = __webpack_require__(4),
  assert = utils.assert,
  parseBytes = utils.parseBytes,
  KeyPair = __webpack_require__(112),
  Signature = __webpack_require__(113);

function EDDSA(curve) {
  assert(curve === 'ed25519', 'only tested with ed25519 so far');

  if (!(this instanceof EDDSA)) return new EDDSA(curve);

  curve = curves[curve].curve;
  this.curve = curve;
  this.g = curve.g;
  this.g.precompute(curve.n.bitLength() + 1);

  this.pointClass = curve.point().constructor;
  this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
  this.hash = hash.sha512;
}

module.exports = EDDSA;

EDDSA.prototype.sign = function (message, secret) {
  message = parseBytes(message);
  var key = this.keyFromSecret(secret),
    r = this.hashInt(key.messagePrefix(), message),
    R = this.g.mul(r),
    Rencoded = this.encodePoint(R),
    s_ = this.hashInt(Rencoded, key.pubBytes(), message).mul(key.priv()),
    S = r.add(s_).umod(this.curve.n);
  return this.makeSignature({ R: R, S: S, Rencoded: Rencoded });
};

EDDSA.prototype.verify = function (message, sig, pub) {
  message = parseBytes(message);
  sig = this.makeSignature(sig);
  var key = this.keyFromPublic(pub),
    h = this.hashInt(sig.Rencoded(), key.pubBytes(), message),
    SG = this.g.mul(sig.S());
  return sig.R().add(key.pub().mul(h)).eq(SG);
};

EDDSA.prototype.hashInt = function () {
  var hash = this.hash();
  for (var i = 0; i < arguments.length; i++) hash.update(arguments[i]);
  return utils.intFromLE(hash.digest()).umod(this.curve.n);
};

EDDSA.prototype.keyFromPublic = function (pub) {
  return KeyPair.fromPublic(this, pub);
};

EDDSA.prototype.keyFromSecret = function (secret) {
  return KeyPair.fromSecret(this, secret);
};

EDDSA.prototype.makeSignature = function (sig) {
  return sig instanceof Signature ? sig : new Signature(this, sig);
};

EDDSA.prototype.encodePoint = function (point) {
  var enc = point.getY().toArray('le', this.encodingLength);
  enc[this.encodingLength - 1] |= point.getX().isOdd() ? 0x80 : 0;
  return enc;
};

EDDSA.prototype.decodePoint = function (bytes) {
  var lastIx = (bytes = utils.parseBytes(bytes)).length - 1,

    normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~0x80),
    xIsOdd = (bytes[lastIx] & 0x80) != 0,

    y = utils.intFromLE(normed);
  return this.curve.pointFromY(y, xIsOdd);
};

EDDSA.prototype.encodeInt = function (num) {
  return num.toArray('le', this.encodingLength);
};

EDDSA.prototype.decodeInt = function (bytes) {
  return utils.intFromLE(bytes);
};

EDDSA.prototype.isPoint = function (val) {
  return val instanceof this.pointClass;
};

},
// 112
function (module, exports, __webpack_require__) {

var utils = __webpack_require__(4),
  assert = utils.assert,
  parseBytes = utils.parseBytes,
  cachedProperty = utils.cachedProperty;

function KeyPair(eddsa, params) {
  this.eddsa = eddsa;
  this._secret = parseBytes(params.secret);
  if (eddsa.isPoint(params.pub)) this._pub = params.pub;
  else this._pubBytes = parseBytes(params.pub);
}

KeyPair.fromPublic = function (eddsa, pub) {
  return pub instanceof KeyPair ? pub : new KeyPair(eddsa, { pub: pub });
};

KeyPair.fromSecret = function (eddsa, secret) {
  return secret instanceof KeyPair ? secret : new KeyPair(eddsa, { secret: secret });
};

KeyPair.prototype.secret = function () {
  return this._secret;
};

cachedProperty(KeyPair, 'pubBytes', function () {
  return this.eddsa.encodePoint(this.pub());
});

cachedProperty(KeyPair, 'pub', function () {
  return this._pubBytes
    ? this.eddsa.decodePoint(this._pubBytes)
    : this.eddsa.g.mul(this.priv());
});

cachedProperty(KeyPair, 'privBytes', function () {
  var eddsa = this.eddsa,
    hash = this.hash(),
    lastIx = eddsa.encodingLength - 1,

    a = hash.slice(0, eddsa.encodingLength);
  a[0] &= 248;
  a[lastIx] &= 127;
  a[lastIx] |= 64;

  return a;
});

cachedProperty(KeyPair, 'priv', function () {
  return this.eddsa.decodeInt(this.privBytes());
});

cachedProperty(KeyPair, 'hash', function () {
  return this.eddsa.hash().update(this.secret()).digest();
});

cachedProperty(KeyPair, 'messagePrefix', function () {
  return this.hash().slice(this.eddsa.encodingLength);
});

KeyPair.prototype.sign = function (message) {
  assert(this._secret, 'KeyPair can only verify');
  return this.eddsa.sign(message, this);
};

KeyPair.prototype.verify = function (message, sig) {
  return this.eddsa.verify(message, sig, this);
};

KeyPair.prototype.getSecret = function (enc) {
  assert(this._secret, 'KeyPair is public only');
  return utils.encode(this.secret(), enc);
};

KeyPair.prototype.getPublic = function (enc) {
  return utils.encode(this.pubBytes(), enc);
};

module.exports = KeyPair;

},
// 113
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  utils = __webpack_require__(4),
  assert = utils.assert,
  cachedProperty = utils.cachedProperty,
  parseBytes = utils.parseBytes;

function Signature(eddsa, sig) {
  this.eddsa = eddsa;

  if (typeof sig != 'object') sig = parseBytes(sig);

  if (Array.isArray(sig))
    sig = {
      R: sig.slice(0, eddsa.encodingLength),
      S: sig.slice(eddsa.encodingLength)
    };

  assert(sig.R && sig.S, 'Signature without R or S');

  if (eddsa.isPoint(sig.R)) this._R = sig.R;
  if (sig.S instanceof BN) this._S = sig.S;

  this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
  this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
}

cachedProperty(Signature, 'S', function () {
  return this.eddsa.decodeInt(this.Sencoded());
});

cachedProperty(Signature, 'R', function () {
  return this.eddsa.decodePoint(this.Rencoded());
});

cachedProperty(Signature, 'Rencoded', function () {
  return this.eddsa.encodePoint(this.R());
});

cachedProperty(Signature, 'Sencoded', function () {
  return this.eddsa.encodeInt(this.S());
});

Signature.prototype.toBytes = function () {
  return this.Rencoded().concat(this.Sencoded());
};

Signature.prototype.toHex = function () {
  return utils.encode(this.toBytes(), 'hex').toUpperCase();
};

module.exports = Signature;

},
// 114
function (module, exports, __webpack_require__) {

var asn1 = __webpack_require__(14)

exports.certificate = __webpack_require__(124)

var RSAPrivateKey = asn1.define('RSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('modulus').int(),
    this.key('publicExponent').int(),
    this.key('privateExponent').int(),
    this.key('prime1').int(),
    this.key('prime2').int(),
    this.key('exponent1').int(),
    this.key('exponent2').int(),
    this.key('coefficient').int()
  )
})
exports.RSAPrivateKey = RSAPrivateKey

var RSAPublicKey = asn1.define('RSAPublicKey', function () {
  this.seq().obj(this.key('modulus').int(), this.key('publicExponent').int())
})
exports.RSAPublicKey = RSAPublicKey

var PublicKey = asn1.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})
exports.PublicKey = PublicKey

var AlgorithmIdentifier = asn1.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('none').null_().optional(),
    this.key('curve').objid().optional(),
    this.key('params').seq()
      .obj(this.key('p').int(), this.key('q').int(), this.key('g').int())
      .optional()
  )
})

var PrivateKeyInfo = asn1.define('PrivateKeyInfo', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPrivateKey').octstr()
  )
})
exports.PrivateKey = PrivateKeyInfo
var EncryptedPrivateKeyInfo = asn1.define('EncryptedPrivateKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').seq().obj(
      this.key('id').objid(),
      this.key('decrypt').seq().obj(
        this.key('kde').seq().obj(
          this.key('id').objid(),
          this.key('kdeparams').seq()
            .obj(this.key('salt').octstr(), this.key('iters').int())
        ),
        this.key('cipher').seq()
          .obj(this.key('algo').objid(), this.key('iv').octstr())
      )
    ),
    this.key('subjectPrivateKey').octstr()
  )
})

exports.EncryptedPrivateKey = EncryptedPrivateKeyInfo

var DSAPrivateKey = asn1.define('DSAPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('p').int(),
    this.key('q').int(),
    this.key('g').int(),
    this.key('pub_key').int(),
    this.key('priv_key').int()
  )
})
exports.DSAPrivateKey = DSAPrivateKey

exports.DSAparam = asn1.define('DSAparam', function () {
  this.int()
})

var ECPrivateKey = asn1.define('ECPrivateKey', function () {
  this.seq().obj(
    this.key('version').int(),
    this.key('privateKey').octstr(),
    this.key('parameters').optional().explicit(0).use(ECParameters),
    this.key('publicKey').optional().explicit(1).bitstr()
  )
})
exports.ECPrivateKey = ECPrivateKey

var ECParameters = asn1.define('ECParameters', function () {
  this.choice({ namedCurve: this.objid() })
})

exports.signature = asn1.define('signature', function () {
  this.seq().obj(this.key('r').int(), this.key('s').int())
})

},
// 115
function (module, exports, __webpack_require__) {

var asn1 = __webpack_require__(14),
  inherits = __webpack_require__(1);

exports.define = function (name, body) {
  return new Entity(name, body);
};

function Entity(name, body) {
  this.name = name;
  this.body = body;

  this.decoders = {};
  this.encoders = {};
}

Entity.prototype._createNamed = function (base) {
  var named;
  try {
    named = __webpack_require__(116).runInThisContext(
      '(function ' + this.name + '(entity) {\n  this._initNamed(entity);\n})'
    );
  } catch (_) {
    named = function (entity) {
      this._initNamed(entity);
    };
  }
  inherits(named, base);
  named.prototype._initNamed = function (entity) {
    base.call(this, entity);
  };

  return new named(this);
};

Entity.prototype._getDecoder = function (enc) {
  enc = enc || 'der';
  this.decoders.hasOwnProperty(enc) ||
    (this.decoders[enc] = this._createNamed(asn1.decoders[enc]));
  return this.decoders[enc];
};

Entity.prototype.decode = function (data, enc, options) {
  return this._getDecoder(enc).decode(data, options);
};

Entity.prototype._getEncoder = function (enc) {
  enc = enc || 'der';
  this.encoders.hasOwnProperty(enc) ||
    (this.encoders[enc] = this._createNamed(asn1.encoders[enc]));
  return this.encoders[enc];
};

Entity.prototype.encode = function (data, enc, reporter) {
  return this._getEncoder(enc).encode(data, reporter);
};

},
// 116
function (module) {

module.exports = require('vm');

},
// 117
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1);

function Reporter(options) {
  this._reporterState = { obj: null, path: [], options: options || {}, errors: [] };
}
exports.Reporter = Reporter;

Reporter.prototype.isError = function (obj) {
  return obj instanceof ReporterError;
};

Reporter.prototype.save = function () {
  var state = this._reporterState;

  return { obj: state.obj, pathLen: state.path.length };
};

Reporter.prototype.restore = function (data) {
  var state = this._reporterState;

  state.obj = data.obj;
  state.path = state.path.slice(0, data.pathLen);
};

Reporter.prototype.enterKey = function (key) {
  return this._reporterState.path.push(key);
};

Reporter.prototype.exitKey = function (index) {
  var state = this._reporterState;

  state.path = state.path.slice(0, index - 1);
};

Reporter.prototype.leaveKey = function (index, key, value) {
  var state = this._reporterState;

  this.exitKey(index);
  if (state.obj !== null) state.obj[key] = value;
};

Reporter.prototype.path = function () {
  return this._reporterState.path.join('/');
};

Reporter.prototype.enterObject = function () {
  var state = this._reporterState,

    prev = state.obj;
  state.obj = {};
  return prev;
};

Reporter.prototype.leaveObject = function (prev) {
  var state = this._reporterState,

    now = state.obj;
  state.obj = prev;
  return now;
};

Reporter.prototype.error = function (msg) {
  var err,
    state = this._reporterState,

    inherited = msg instanceof ReporterError;
  err = inherited
    ? msg
    : new ReporterError(state.path.map(function (elem) {
        return '[' + JSON.stringify(elem) + ']';
      }).join(''), msg.message || msg, msg.stack);

  if (!state.options.partial) throw err;

  inherited || state.errors.push(err);

  return err;
};

Reporter.prototype.wrapResult = function (result) {
  var state = this._reporterState;
  return !state.options.partial
    ? result
    : { result: this.isError(result) ? null : result, errors: state.errors };
};

function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
}
inherits(ReporterError, Error);

ReporterError.prototype.rethrow = function (msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  Error.captureStackTrace && Error.captureStackTrace(this, ReporterError);

  if (!this.stack)
    try {
      throw new Error(this.message);
    } catch (e) {
      this.stack = e.stack;
    }

  return this;
};

},
// 118
function (module, exports, __webpack_require__) {

var Reporter = __webpack_require__(15).Reporter,
  EncoderBuffer = __webpack_require__(15).EncoderBuffer,
  DecoderBuffer = __webpack_require__(15).DecoderBuffer,
  assert = __webpack_require__(3);

var tags = [
  'seq', 'seqof', 'set', 'setof', 'objid', 'bool',
  'gentime', 'utctime', 'null_', 'enum', 'int', 'objDesc',
  'bitstr', 'bmpstr', 'charstr', 'genstr', 'graphstr', 'ia5str', 'iso646str',
  'numstr', 'octstr', 'printstr', 't61str', 'unistr', 'utf8str', 'videostr'
];

var methods = [
  'key', 'obj', 'use', 'optional', 'explicit', 'implicit', 'def', 'choice',
  'any', 'contains'
].concat(tags);

var overrided = [
  '_peekTag', '_decodeTag', '_use', '_decodeStr', '_decodeObjid', '_decodeTime',
  '_decodeNull', '_decodeInt', '_decodeBool', '_decodeList',

  '_encodeComposite', '_encodeStr', '_encodeObjid', '_encodeTime',
  '_encodeNull', '_encodeInt', '_encodeBool'
];

function Node(enc, parent) {
  var state = {};
  this._baseState = state;

  state.enc = enc;

  state.parent = parent || null;
  state.children = null;

  state.tag = null;
  state.args = null;
  state.reverseArgs = null;
  state.choice = null;
  state.optional = false;
  state.any = false;
  state.obj = false;
  state.use = null;
  state.useDecoder = null;
  state.key = null;
  state.default = null;
  state.explicit = null;
  state.implicit = null;
  state.contains = null;

  if (!state.parent) {
    state.children = [];
    this._wrap();
  }
}
module.exports = Node;

var stateProps = [
  'enc', 'parent', 'children', 'tag', 'args', 'reverseArgs', 'choice',
  'optional', 'any', 'obj', 'use', 'alteredUse', 'key', 'default', 'explicit',
  'implicit', 'contains'
];

Node.prototype.clone = function () {
  var state = this._baseState,
    cstate = {};
  stateProps.forEach(function (prop) {
    cstate[prop] = state[prop];
  });
  var res = new this.constructor(cstate.parent);
  res._baseState = cstate;
  return res;
};

Node.prototype._wrap = function () {
  var state = this._baseState;
  methods.forEach(function (method) {
    this[method] = function () {
      var clone = new this.constructor(this);
      state.children.push(clone);
      return clone[method].apply(clone, arguments);
    };
  }, this);
};

Node.prototype._init = function (body) {
  var state = this._baseState;

  assert(state.parent === null);
  body.call(this);

  state.children = state.children.filter(function (child) {
    return child._baseState.parent === this;
  }, this);
  assert.equal(state.children.length, 1, 'Root node can have only one child');
};

Node.prototype._useArgs = function (args) {
  var state = this._baseState;

  var children = args.filter(function (arg) {
    return arg instanceof this.constructor;
  }, this);
  args = args.filter(function (arg) {
    return !(arg instanceof this.constructor);
  }, this);

  if (children.length !== 0) {
    assert(state.children === null);
    state.children = children;

    children.forEach(function (child) {
      child._baseState.parent = this;
    }, this);
  }
  if (args.length !== 0) {
    assert(state.args === null);
    state.args = args;
    state.reverseArgs = args.map(function (arg) {
      if (typeof arg != 'object' || arg.constructor !== Object) return arg;

      var res = {};
      Object.keys(arg).forEach(function (key) {
        if (key == (key | 0)) key |= 0;
        var value = arg[key];
        res[value] = key;
      });
      return res;
    });
  }
};

overrided.forEach(function (method) {
  Node.prototype[method] = function () {
    var state = this._baseState;
    throw new Error(method + ' not implemented for encoding: ' + state.enc);
  };
});

tags.forEach(function (tag) {
  Node.prototype[tag] = function () {
    var state = this._baseState,
      args = Array.prototype.slice.call(arguments);

    assert(state.tag === null);
    state.tag = tag;

    this._useArgs(args);

    return this;
  };
});

Node.prototype.use = function (item) {
  assert(item);
  var state = this._baseState;

  assert(state.use === null);
  state.use = item;

  return this;
};

Node.prototype.optional = function () {
  this._baseState.optional = true;

  return this;
};

Node.prototype.def = function (val) {
  var state = this._baseState;

  assert(state.default === null);
  state.default = val;
  state.optional = true;

  return this;
};

Node.prototype.explicit = function (num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.explicit = num;

  return this;
};

Node.prototype.implicit = function (num) {
  var state = this._baseState;

  assert(state.explicit === null && state.implicit === null);
  state.implicit = num;

  return this;
};

Node.prototype.obj = function () {
  var state = this._baseState,
    args = Array.prototype.slice.call(arguments);

  state.obj = true;

  args.length === 0 || this._useArgs(args);

  return this;
};

Node.prototype.key = function (newKey) {
  var state = this._baseState;

  assert(state.key === null);
  state.key = newKey;

  return this;
};

Node.prototype.any = function () {
  this._baseState.any = true;

  return this;
};

Node.prototype.choice = function (obj) {
  var state = this._baseState;

  assert(state.choice === null);
  state.choice = obj;
  this._useArgs(Object.keys(obj).map(function (key) {
    return obj[key];
  }));

  return this;
};

Node.prototype.contains = function (item) {
  var state = this._baseState;

  assert(state.use === null);
  state.contains = item;

  return this;
};

Node.prototype._decode = function (input, options) {
  var state = this._baseState;

  if (state.parent === null)
    return input.wrapResult(state.children[0]._decode(input, options));

  var prevObj,
    result = state.default,
    present = true,

    prevKey = null;
  if (state.key !== null) prevKey = input.enterKey(state.key);

  if (state.optional) {
    var tag =
      state.explicit !== null
      ? state.explicit
      : state.implicit !== null
      ? state.implicit
      : state.tag !== null
      ? state.tag
      : null;

    if (tag === null && !state.any) {
      var save = input.save();
      try {
        state.choice === null
          ? this._decodeGeneric(state.tag, input, options)
          : this._decodeChoice(input, options);
        present = true;
      } catch (_) {
        present = false;
      }
      input.restore(save);
    } else {
      present = this._peekTag(input, tag, state.any);

      if (input.isError(present)) return present;
    }
  }

  if (state.obj && present) prevObj = input.enterObject();

  if (present) {
    if (state.explicit !== null) {
      var explicit = this._decodeTag(input, state.explicit);
      if (input.isError(explicit)) return explicit;
      input = explicit;
    }

    var start = input.offset;

    if (state.use === null && state.choice === null) {
      if (state.any) save = input.save();
      var body = this._decodeTag(
        input,
        state.implicit !== null ? state.implicit : state.tag,
        state.any
      );
      if (input.isError(body)) return body;

      state.any ? (result = input.raw(save)) : (input = body);
    }

    options && options.track && state.tag !== null &&
      options.track(input.path(), start, input.length, 'tagged');

    options && options.track && state.tag !== null &&
      options.track(input.path(), input.offset, input.length, 'content');

    result = state.any
      ? result
      : state.choice === null
      ? this._decodeGeneric(state.tag, input, options)
      : this._decodeChoice(input, options);

    if (input.isError(result)) return result;

    state.any || state.choice !== null || state.children === null ||
      state.children.forEach(function (child) {
        child._decode(input, options);
      });

    if (state.contains && (state.tag === 'octstr' || state.tag === 'bitstr')) {
      var data = new DecoderBuffer(result);
      result =
        this._getUse(state.contains, input._reporterState.obj)._decode(data, options);
    }
  }

  if (state.obj && present) result = input.leaveObject(prevObj);

  state.key !== null && (result !== null || present === true)
    ? input.leaveKey(prevKey, state.key, result)
    : prevKey === null || input.exitKey(prevKey);

  return result;
};

Node.prototype._decodeGeneric = function (tag, input, options) {
  var state = this._baseState;

  return tag === 'seq' || tag === 'set'
    ? null
    : tag === 'seqof' || tag === 'setof'
    ? this._decodeList(input, tag, state.args[0], options)
    : /str$/.test(tag)
    ? this._decodeStr(input, tag, options)
    : tag === 'objid' && state.args
    ? this._decodeObjid(input, state.args[0], state.args[1], options)
    : tag === 'objid'
    ? this._decodeObjid(input, null, null, options)
    : tag === 'gentime' || tag === 'utctime'
    ? this._decodeTime(input, tag, options)
    : tag === 'null_'
    ? this._decodeNull(input, options)
    : tag === 'bool'
    ? this._decodeBool(input, options)
    : tag === 'objDesc'
    ? this._decodeStr(input, tag, options)
    : tag === 'int' || tag === 'enum'
    ? this._decodeInt(input, state.args && state.args[0], options)

    : state.use !== null
    ? this._getUse(state.use, input._reporterState.obj)._decode(input, options)
    : input.error('unknown tag: ' + tag);
};

Node.prototype._getUse = function (entity, obj) {
  var state = this._baseState;
  state.useDecoder = this._use(entity, obj);
  assert(state.useDecoder._baseState.parent === null);
  state.useDecoder = state.useDecoder._baseState.children[0];
  if (state.implicit !== state.useDecoder._baseState.implicit) {
    state.useDecoder = state.useDecoder.clone();
    state.useDecoder._baseState.implicit = state.implicit;
  }
  return state.useDecoder;
};

Node.prototype._decodeChoice = function (input, options) {
  var state = this._baseState,
    result = null,
    match = false;

  Object.keys(state.choice).some(function (key) {
    var save = input.save(),
      node = state.choice[key];
    try {
      var value = node._decode(input, options);
      if (input.isError(value)) return false;

      result = { type: key, value: value };
      match = true;
    } catch (_) {
      input.restore(save);
      return false;
    }
    return true;
  }, this);

  return !match ? input.error('Choice not matched') : result;
};

Node.prototype._createEncoderBuffer = function (data) {
  return new EncoderBuffer(data, this.reporter);
};

Node.prototype._encode = function (data, reporter, parent) {
  var state = this._baseState;
  if (state.default !== null && state.default === data) return;

  var result = this._encodeValue(data, reporter, parent);
  if (result !== void 0 && !this._skipDefault(result, reporter, parent))
    return result;
};

Node.prototype._encodeValue = function (data, reporter, parent) {
  var state = this._baseState;

  if (state.parent === null)
    return state.children[0]._encode(data, reporter || new Reporter());

  var result = null;

  this.reporter = reporter;

  if (state.optional && data === void 0) {
    if (state.default === null) return;

    data = state.default;
  }

  var content = null,
    primitive = false;
  if (state.any) result = this._createEncoderBuffer(data);
  else if (state.choice) result = this._encodeChoice(data, reporter);
  else if (state.contains) {
    content = this._getUse(state.contains, parent)._encode(data, reporter);
    primitive = true;
  } else if (state.children) {
    content = state.children.map(function (child) {
      if (child._baseState.tag === 'null_')
        return child._encode(null, reporter, data);

      if (child._baseState.key === null)
        return reporter.error('Child should have a key');
      var prevKey = reporter.enterKey(child._baseState.key);

      if (typeof data != 'object')
        return reporter.error('Child expected, but input is not object');

      var res = child._encode(data[child._baseState.key], reporter, data);
      reporter.leaveKey(prevKey);

      return res;
    }, this).filter(function (child) {
      return child;
    });
    content = this._createEncoderBuffer(content);
  } else if (state.tag === 'seqof' || state.tag === 'setof') {
    if (!state.args || state.args.length !== 1)
      return reporter.error('Too many args for : ' + state.tag);

    if (!Array.isArray(data))
      return reporter.error('seqof/setof, but data is not Array');

    var child = this.clone();
    child._baseState.implicit = null;
    content = this._createEncoderBuffer(data.map(function (item) {
      var state = this._baseState;

      return this._getUse(state.args[0], data)._encode(item, reporter);
    }, child));
  } else if (state.use !== null)
    result = this._getUse(state.use, parent)._encode(data, reporter);
  else {
    content = this._encodePrimitive(state.tag, data);
    primitive = true;
  }

  if (!state.any && state.choice === null) {
    var tag = state.implicit !== null ? state.implicit : state.tag,
      cls = state.implicit === null ? 'universal' : 'context';

    tag === null
      ? state.use !== null || reporter.error('Tag could be omitted only for .use()')
      : state.use !== null ||
        (result = this._encodeComposite(tag, primitive, cls, content));
  }

  if (state.explicit !== null)
    result = this._encodeComposite(state.explicit, false, 'context', result);

  return result;
};

Node.prototype._encodeChoice = function (data, reporter) {
  var state = this._baseState,

    node = state.choice[data.type];
  node ||
    assert(
      false,
      data.type + ' not found in ' + JSON.stringify(Object.keys(state.choice))
    );

  return node._encode(data.value, reporter);
};

Node.prototype._encodePrimitive = function (tag, data) {
  var state = this._baseState;

  if (/str$/.test(tag)) return this._encodeStr(data, tag);
  if (tag === 'objid' && state.args)
    return this._encodeObjid(data, state.reverseArgs[0], state.args[1]);
  if (tag === 'objid') return this._encodeObjid(data, null, null);
  if (tag === 'gentime' || tag === 'utctime') return this._encodeTime(data, tag);
  if (tag === 'null_') return this._encodeNull();
  if (tag === 'int' || tag === 'enum')
    return this._encodeInt(data, state.args && state.reverseArgs[0]);
  if (tag === 'bool') return this._encodeBool(data);
  if (tag === 'objDesc') return this._encodeStr(data, tag);

  throw new Error('Unsupported tag: ' + tag);
};

Node.prototype._isNumstr = function (str) {
  return /^[0-9 ]*$/.test(str);
};

Node.prototype._isPrintstr = function (str) {
  return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(str);
};

},
// 119
function (module, exports, __webpack_require__) {

var constants = __webpack_require__(58);

exports.tagClass = {
  0: 'universal',
  1: 'application',
  2: 'context',
  3: 'private'
};
exports.tagClassByName = constants._reverse(exports.tagClass);

exports.tag = {
  0: 'end',
  1: 'bool',
  2: 'int',
  3: 'bitstr',
  4: 'octstr',
  5: 'null_',
  6: 'objid',
  7: 'objDesc',
  8: 'external',
  9: 'real',
  10: 'enum',
  11: 'embed',
  12: 'utf8str',
  13: 'relativeOid',
  16: 'seq',
  17: 'set',
  18: 'numstr',
  19: 'printstr',
  20: 't61str',
  21: 'videostr',
  22: 'ia5str',
  23: 'utctime',
  24: 'gentime',
  25: 'graphstr',
  26: 'iso646str',
  27: 'genstr',
  28: 'unistr',
  29: 'charstr',
  30: 'bmpstr'
};
exports.tagByName = constants._reverse(exports.tag);

},
// 120
function (module, exports, __webpack_require__) {

var decoders = exports;

decoders.der = __webpack_require__(59);
decoders.pem = __webpack_require__(121);

},
// 121
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),
  Buffer = __webpack_require__(8).Buffer,

  DERDecoder = __webpack_require__(59);

function PEMDecoder(entity) {
  DERDecoder.call(this, entity);
  this.enc = 'pem';
}
inherits(PEMDecoder, DERDecoder);
module.exports = PEMDecoder;

PEMDecoder.prototype.decode = function (data, options) {
  var lines = data.toString().split(/[\r\n]+/g),

    label = options.label.toUpperCase(),

    re = /^-----(BEGIN|END) ([^-]+)-----$/,
    start = -1,
    end = -1;
  for (var i = 0; i < lines.length; i++) {
    var match = lines[i].match(re);
    if (match === null || match[2] !== label) continue;

    if (start !== -1) {
      if (match[1] !== 'END') break;
      end = i;
      break;
    }
    if (match[1] !== 'BEGIN') break;
    start = i;
  }
  if (start === -1 || end === -1)
    throw new Error('PEM section not found for: ' + label);

  var base64 = lines.slice(start + 1, end).join('');
  base64.replace(/[^a-z0-9\+\/=]+/gi, '');

  var input = new Buffer(base64, 'base64');
  return DERDecoder.prototype.decode.call(this, input, options);
};

},
// 122
function (module, exports, __webpack_require__) {

var encoders = exports;

encoders.der = __webpack_require__(60);
encoders.pem = __webpack_require__(123);

},
// 123
function (module, exports, __webpack_require__) {

var inherits = __webpack_require__(1),

  DEREncoder = __webpack_require__(60);

function PEMEncoder(entity) {
  DEREncoder.call(this, entity);
  this.enc = 'pem';
}
inherits(PEMEncoder, DEREncoder);
module.exports = PEMEncoder;

PEMEncoder.prototype.encode = function (data, options) {
  var p = DEREncoder.prototype.encode.call(this, data).toString('base64'),

    out = ['-----BEGIN ' + options.label + '-----'];
  for (var i = 0; i < p.length; i += 64) out.push(p.slice(i, i + 64));
  out.push('-----END ' + options.label + '-----');
  return out.join('\n');
};

},
// 124
function (module, exports, __webpack_require__) {

var asn = __webpack_require__(14)

var Time = asn.define('Time', function () {
  this.choice({ utcTime: this.utctime(), generalTime: this.gentime() })
})

var AttributeTypeValue = asn.define('AttributeTypeValue', function () {
  this.seq().obj(this.key('type').objid(), this.key('value').any())
})

var AlgorithmIdentifier = asn.define('AlgorithmIdentifier', function () {
  this.seq().obj(
    this.key('algorithm').objid(),
    this.key('parameters').optional(),
    this.key('curve').objid().optional()
  )
})

var SubjectPublicKeyInfo = asn.define('SubjectPublicKeyInfo', function () {
  this.seq().obj(
    this.key('algorithm').use(AlgorithmIdentifier),
    this.key('subjectPublicKey').bitstr()
  )
})

var RelativeDistinguishedName = asn.define('RelativeDistinguishedName', function () {
  this.setof(AttributeTypeValue)
})

var RDNSequence = asn.define('RDNSequence', function () {
  this.seqof(RelativeDistinguishedName)
})

var Name = asn.define('Name', function () {
  this.choice({ rdnSequence: this.use(RDNSequence) })
})

var Validity = asn.define('Validity', function () {
  this.seq().obj(this.key('notBefore').use(Time), this.key('notAfter').use(Time))
})

var Extension = asn.define('Extension', function () {
  this.seq().obj(
    this.key('extnID').objid(),
    this.key('critical').bool().def(false),
    this.key('extnValue').octstr()
  )
})

var TBSCertificate = asn.define('TBSCertificate', function () {
  this.seq().obj(
    this.key('version').explicit(0).int().optional(),
    this.key('serialNumber').int(),
    this.key('signature').use(AlgorithmIdentifier),
    this.key('issuer').use(Name),
    this.key('validity').use(Validity),
    this.key('subject').use(Name),
    this.key('subjectPublicKeyInfo').use(SubjectPublicKeyInfo),
    this.key('issuerUniqueID').implicit(1).bitstr().optional(),
    this.key('subjectUniqueID').implicit(2).bitstr().optional(),
    this.key('extensions').explicit(3).seqof(Extension).optional()
  )
})

var X509Certificate = asn.define('X509Certificate', function () {
  this.seq().obj(
    this.key('tbsCertificate').use(TBSCertificate),
    this.key('signatureAlgorithm').use(AlgorithmIdentifier),
    this.key('signatureValue').bitstr()
  )
})

module.exports = X509Certificate

},
// 125
function (module) {

module.exports = JSON.parse(
  '{"2.16.840.1.101.3.4.1.1":"aes-128-ecb","2.16.840.1.101.3.4.1.2":"aes-128-cbc","2.16.840.1.101.3.4.1.3":"aes-128-ofb","2.16.840.1.101.3.4.1.4":"aes-128-cfb","2.16.840.1.101.3.4.1.21":"aes-192-ecb","2.16.840.1.101.3.4.1.22":"aes-192-cbc","2.16.840.1.101.3.4.1.23":"aes-192-ofb","2.16.840.1.101.3.4.1.24":"aes-192-cfb","2.16.840.1.101.3.4.1.41":"aes-256-ecb","2.16.840.1.101.3.4.1.42":"aes-256-cbc","2.16.840.1.101.3.4.1.43":"aes-256-ofb","2.16.840.1.101.3.4.1.44":"aes-256-cfb"}'
);

},
// 126
function (module, exports, __webpack_require__) {

var findProc =
  /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m
var startRegex = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m
var fullRegex =
  /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m
var evp = __webpack_require__(17),
  ciphers = __webpack_require__(27),
  Buffer = __webpack_require__(0).Buffer
module.exports = function (okey, password) {
  var decrypted,
    key = okey.toString(),
    match = key.match(findProc)
  if (!match) {
    var match2 = key.match(fullRegex)
    decrypted = new Buffer(match2[2].replace(/[\r\n]/g, ''), 'base64')
  } else {
    var suite = 'aes' + match[1],
      iv = Buffer.from(match[2], 'hex'),
      cipherText = Buffer.from(match[3].replace(/[\r\n]/g, ''), 'base64'),
      cipherKey = evp(password, iv.slice(0, 8), parseInt(match[1], 10)).key,
      out = [],
      cipher = ciphers.createDecipheriv(suite, cipherKey, iv)
    out.push(cipher.update(cipherText))
    out.push(cipher.final())
    decrypted = Buffer.concat(out)
  }
  return { tag: key.match(startRegex)[1], data: decrypted }
}

},
// 127
function (module, exports, __webpack_require__) {

var BN = __webpack_require__(2),
  EC = __webpack_require__(31).ec,
  parseKeys = __webpack_require__(19),
  curves = __webpack_require__(61)

function verify(sig, hash, key, signType, tag) {
  var pub = parseKeys(key)
  if (pub.type === 'ec') {
    if (signType !== 'ecdsa' && signType !== 'ecdsa/rsa')
      throw new Error('wrong public key type')
    return ecVerify(sig, hash, pub)
  }
  if (pub.type === 'dsa') {
    if (signType !== 'dsa') throw new Error('wrong public key type')
    return dsaVerify(sig, hash, pub)
  }
  if (signType !== 'rsa' && signType !== 'ecdsa/rsa')
    throw new Error('wrong public key type')

  hash = Buffer.concat([tag, hash])
  var len = pub.modulus.byteLength(),
    pad = [1]
  for (var padNum = 0; hash.length + pad.length + 2 < len; ) {
    pad.push(0xff)
    padNum++
  }
  pad.push(0x00)
  for (var i = -1; ++i < hash.length; ) pad.push(hash[i])

  pad = new Buffer(pad)
  var red = BN.mont(pub.modulus)
  sig = new BN(sig).toRed(red).redPow(new BN(pub.publicExponent))

  sig = new Buffer(sig.fromRed().toArray())
  var out = padNum < 8 ? 1 : 0
  len = Math.min(sig.length, pad.length)
  if (sig.length !== pad.length) out = 1

  for (i = -1; ++i < len; ) out |= sig[i] ^ pad[i]
  return out === 0
}

function ecVerify(sig, hash, pub) {
  var curveId = curves[pub.data.algorithm.curve.join('.')]
  if (!curveId) throw new Error('unknown curve ' + pub.data.algorithm.curve.join('.'))

  var curve = new EC(curveId),
    pubkey = pub.data.subjectPrivateKey.data

  return curve.verify(hash, sig, pubkey)
}

function dsaVerify(sig, hash, pub) {
  var p = pub.data.p,
    q = pub.data.q,
    g = pub.data.g,
    y = pub.data.pub_key,
    unpacked = parseKeys.signature.decode(sig, 'der'),
    s = unpacked.s,
    r = unpacked.r
  checkValue(s, q)
  checkValue(r, q)
  var montp = BN.mont(p),
    w = s.invm(q)
  var v = g.toRed(montp)
    .redPow(new BN(hash).mul(w).mod(q))
    .fromRed()
    .mul(y.toRed(montp).redPow(r.mul(w).mod(q)).fromRed())
    .mod(p)
    .mod(q)
  return v.cmp(r) === 0
}

function checkValue(b, q) {
  if (b.cmpn(0) <= 0) throw new Error('invalid sig')
  if (b.cmp(q) >= q) throw new Error('invalid sig')
}

module.exports = verify

},
// 128
function (module, exports, __webpack_require__) {

var createECDH = __webpack_require__(11).createECDH

module.exports = createECDH || __webpack_require__(129)

},
// 129
function (module, exports, __webpack_require__) {

var elliptic = __webpack_require__(31),
  BN = __webpack_require__(2)

module.exports = function (curve) {
  return new ECDH(curve)
}

var aliases = {
  secp256k1: { name: 'secp256k1', byteLength: 32 },
  secp224r1: { name: 'p224', byteLength: 28 },
  prime256v1: { name: 'p256', byteLength: 32 },
  prime192v1: { name: 'p192', byteLength: 24 },
  ed25519: { name: 'ed25519', byteLength: 32 },
  secp384r1: { name: 'p384', byteLength: 48 },
  secp521r1: { name: 'p521', byteLength: 66 }
}

aliases.p224 = aliases.secp224r1
aliases.p256 = aliases.secp256r1 = aliases.prime256v1
aliases.p192 = aliases.secp192r1 = aliases.prime192v1
aliases.p384 = aliases.secp384r1
aliases.p521 = aliases.secp521r1

function ECDH(curve) {
  this.curveType = aliases[curve]
  this.curveType || (this.curveType = { name: curve })

  this.curve = new elliptic.ec(this.curveType.name)
  this.keys = void 0
}

ECDH.prototype.generateKeys = function (enc, format) {
  this.keys = this.curve.genKeyPair()
  return this.getPublicKey(enc, format)
}

ECDH.prototype.computeSecret = function (other, inenc, enc) {
  inenc = inenc || 'utf8'
  Buffer.isBuffer(other) || (other = new Buffer(other, inenc))

  var out = this.curve.keyFromPublic(other).getPublic()
    .mul(this.keys.getPrivate()).getX()
  return formatReturnValue(out, enc, this.curveType.byteLength)
}

ECDH.prototype.getPublicKey = function (enc, format) {
  var key = this.keys.getPublic(format === 'compressed', true)
  if (format === 'hybrid') key[0] = key[key.length - 1] % 2 ? 7 : 6

  return formatReturnValue(key, enc)
}

ECDH.prototype.getPrivateKey = function (enc) {
  return formatReturnValue(this.keys.getPrivate(), enc)
}

ECDH.prototype.setPublicKey = function (pub, enc) {
  enc = enc || 'utf8'
  Buffer.isBuffer(pub) || (pub = new Buffer(pub, enc))

  this.keys._importPublic(pub)
  return this
}

ECDH.prototype.setPrivateKey = function (priv, enc) {
  enc = enc || 'utf8'
  Buffer.isBuffer(priv) || (priv = new Buffer(priv, enc))

  var _priv = new BN(priv)
  _priv = _priv.toString(16)
  this.keys = this.curve.genKeyPair()
  this.keys._importPrivate(_priv)
  return this
}

function formatReturnValue(bn, enc, len) {
  Array.isArray(bn) || (bn = bn.toArray())

  var buf = new Buffer(bn)
  if (len && buf.length < len) {
    var zeros = new Buffer(len - buf.length)
    zeros.fill(0)
    buf = Buffer.concat([zeros, buf])
  }
  return !enc ? buf : buf.toString(enc)
}

},
// 130
function (module, exports, __webpack_require__) {

var crypto = __webpack_require__(11)
if (typeof crypto.publicEncrypt != 'function') crypto = __webpack_require__(34)

exports.publicEncrypt = crypto.publicEncrypt
exports.privateDecrypt = crypto.privateDecrypt

exports.privateEncrypt = typeof crypto.privateEncrypt != 'function'
  ? __webpack_require__(34).privateEncrypt
  : crypto.privateEncrypt

exports.publicDecrypt = typeof crypto.publicDecrypt != 'function'
  ? __webpack_require__(34).publicDecrypt
  : crypto.publicDecrypt

},
// 131
function (module, exports, __webpack_require__) {

var parseKeys = __webpack_require__(19),
  randomBytes = __webpack_require__(7),
  createHash = __webpack_require__(10),
  mgf = __webpack_require__(62),
  xor = __webpack_require__(63),
  BN = __webpack_require__(2),
  withPublic = __webpack_require__(64),
  crt = __webpack_require__(30),
  Buffer = __webpack_require__(0).Buffer

module.exports = function (publicKey, msg, reverse) {
  var paddedMsg,
    padding = publicKey.padding ? publicKey.padding : reverse ? 1 : 4,

    key = parseKeys(publicKey)
  if (padding === 4) paddedMsg = oaep(key, msg)
  else if (padding === 1) paddedMsg = pkcs1(key, msg, reverse)
  else if (padding !== 3) throw new Error('unknown padding')
  else if ((paddedMsg = new BN(msg)).cmp(key.modulus) >= 0)
    throw new Error('data too long for modulus')

  return reverse ? crt(paddedMsg, key) : withPublic(paddedMsg, key)
}

function oaep(key, msg) {
  var k = key.modulus.byteLength(),
    mLen = msg.length,
    iHash = createHash('sha1').update(Buffer.alloc(0)).digest(),
    hLen = iHash.length,
    hLen2 = 2 * hLen
  if (mLen > k - hLen2 - 2) throw new Error('message too long')

  var ps = Buffer.alloc(k - mLen - hLen2 - 2),
    dblen = k - hLen - 1,
    seed = randomBytes(hLen),
    maskedDb = xor(
      Buffer.concat([iHash, ps, Buffer.alloc(1, 1), msg], dblen), mgf(seed, dblen)
    ),
    maskedSeed = xor(seed, mgf(maskedDb, hLen))
  return new BN(Buffer.concat([Buffer.alloc(1), maskedSeed, maskedDb], k))
}
function pkcs1(key, msg, reverse) {
  var mLen = msg.length,
    k = key.modulus.byteLength()
  if (mLen > k - 11) throw new Error('message too long')

  var ps = reverse ? Buffer.alloc(k - mLen - 3, 0xff) : nonZero(k - mLen - 3)

  return new BN(
    Buffer.concat([Buffer.from([0, reverse ? 1 : 2]), ps, Buffer.alloc(1), msg], k)
  )
}
function nonZero(len) {
  var out = Buffer.allocUnsafe(len)
  for (var num, i = 0, cache = randomBytes(len * 2), cur = 0; i < len; ) {
    if (cur === cache.length) {
      cache = randomBytes(len * 2)
      cur = 0
    }
    if ((num = cache[cur++])) out[i++] = num
  }
  return out
}

},
// 132
function (module, exports, __webpack_require__) {

var parseKeys = __webpack_require__(19),
  mgf = __webpack_require__(62),
  xor = __webpack_require__(63),
  BN = __webpack_require__(2),
  crt = __webpack_require__(30),
  createHash = __webpack_require__(10),
  withPublic = __webpack_require__(64),
  Buffer = __webpack_require__(0).Buffer

module.exports = function (privateKey, enc, reverse) {
  var padding = privateKey.padding ? privateKey.padding : reverse ? 1 : 4,

    key = parseKeys(privateKey),
    k = key.modulus.byteLength()
  if (enc.length > k || new BN(enc).cmp(key.modulus) >= 0)
    throw new Error('decryption error')

  var msg = reverse ? withPublic(new BN(enc), key) : crt(enc, key),

    zBuffer = Buffer.alloc(k - msg.length)
  msg = Buffer.concat([zBuffer, msg], k)
  if (padding === 4) return oaep(key, msg)
  if (padding === 1) return pkcs1(key, msg, reverse)
  if (padding === 3) return msg

  throw new Error('unknown padding')
}

function oaep(key, msg) {
  var k = key.modulus.byteLength(),
    iHash = createHash('sha1').update(Buffer.alloc(0)).digest(),
    hLen = iHash.length
  if (msg[0] !== 0) throw new Error('decryption error')

  var maskedSeed = msg.slice(1, hLen + 1),
    maskedDb = msg.slice(hLen + 1),
    seed = xor(maskedSeed, mgf(maskedDb, hLen)),
    db = xor(maskedDb, mgf(seed, k - hLen - 1))
  if (compare(iHash, db.slice(0, hLen))) throw new Error('decryption error')

  var i = hLen
  while (db[i] === 0) i++

  if (db[i++] !== 1) throw new Error('decryption error')

  return db.slice(i)
}

function pkcs1(key, msg, reverse) {
  var p1 = msg.slice(0, 2),
    i = 2,
    status = 0
  while (msg[i++] !== 0)
    if (i >= msg.length) {
      status++
      break
    }

  var ps = msg.slice(2, i - 1)

  if ((p1.toString('hex') !== '0002' && !reverse) ||
      (p1.toString('hex') !== '0001' && reverse))
    status++

  ps.length < 8 && status++

  if (status) throw new Error('decryption error')

  return msg.slice(i)
}
function compare(a, b) {
  a = Buffer.from(a)
  b = Buffer.from(b)
  var dif = 0,
    len = a.length
  if (a.length !== b.length) {
    dif++
    len = Math.min(a.length, b.length)
  }
  for (var i = -1; ++i < len; ) dif += a[i] ^ b[i]

  return dif
}

},
// 133
function (module, exports, __webpack_require__) {

var crypto = __webpack_require__(11)
if (typeof crypto.randomFill != 'function' ||
    typeof crypto.randomFillSync != 'function')
  module.exports = __webpack_require__(134)
else {
  exports.randomFill = crypto.randomFill
  exports.randomFillSync = crypto.randomFillSync
}

},
// 134
function (module, exports, __webpack_require__) {

function oldBrowser() {
  throw new Error(
    'secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11'
  )
}
var safeBuffer = __webpack_require__(0),
  randombytes = __webpack_require__(7),
  Buffer = safeBuffer.Buffer,
  kBufferMaxLength = safeBuffer.kMaxLength,
  crypto = global.crypto || global.msCrypto,
  kMaxUint32 = Math.pow(2, 32) - 1
function assertOffset(offset, length) {
  if (typeof offset != 'number' || offset !== offset)
    throw new TypeError('offset must be a number')

  if (offset > kMaxUint32 || offset < 0)
    throw new TypeError('offset must be a uint32')

  if (offset > kBufferMaxLength || offset > length)
    throw new RangeError('offset out of range')
}

function assertSize(size, offset, length) {
  if (typeof size != 'number' || size !== size)
    throw new TypeError('size must be a number')

  if (size > kMaxUint32 || size < 0) throw new TypeError('size must be a uint32')

  if (size + offset > length || size > kBufferMaxLength)
    throw new RangeError('buffer too small')
}
if ((crypto && crypto.getRandomValues) || !process.browser) {
  exports.randomFill = randomFill
  exports.randomFillSync = randomFillSync
} else {
  exports.randomFill = oldBrowser
  exports.randomFillSync = oldBrowser
}
function randomFill(buf, offset, size, cb) {
  if (!(Buffer.isBuffer(buf) || buf instanceof global.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array')

  if (typeof offset == 'function') {
    cb = offset
    offset = 0
    size = buf.length
  } else if (typeof size == 'function') {
    cb = size
    size = buf.length - offset
  } else if (typeof cb != 'function')
    throw new TypeError('"cb" argument must be a function')

  assertOffset(offset, buf.length)
  assertSize(size, offset, buf.length)
  return actualFill(buf, offset, size, cb)
}

function actualFill(buf, offset, size, cb) {
  if (process.browser) {
    var ourBuf = buf.buffer,
      uint = new Uint8Array(ourBuf, offset, size)
    crypto.getRandomValues(uint)
    if (cb) {
      process.nextTick(function () {
        cb(null, buf)
      })
      return
    }
    return buf
  }
  if (!cb) {
    randombytes(size).copy(buf, offset)
    return buf
  }
  randombytes(size, function (err, bytes) {
    if (err) return cb(err)

    bytes.copy(buf, offset)
    cb(null, buf)
  })
}
function randomFillSync(buf, offset, size) {
  if (offset === void 0) offset = 0

  if (!(Buffer.isBuffer(buf) || buf instanceof global.Uint8Array))
    throw new TypeError('"buf" argument must be a Buffer or Uint8Array')

  assertOffset(offset, buf.length)

  if (size === void 0) size = buf.length - offset

  assertSize(size, offset, buf.length)

  return actualFill(buf, offset, size)
}

}
]);
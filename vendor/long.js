module.exports = Long;

var wasm = null;
try {
  wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([
    0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11
  ])), {}).exports;
} catch (_) {}

function Long(low, high, unsigned) {
  this.low = low | 0;
  this.high = high | 0;
  this.unsigned = !!unsigned;
}

Long.prototype.__isLong__;
Object.defineProperty(Long.prototype, "__isLong__", { value: true });

function isLong(obj) {
  return (obj && obj.__isLong__) === true;
}
Long.isLong = isLong;

var INT_CACHE = {},
  UINT_CACHE = {};

function fromInt(value, unsigned) {
  var obj, cachedObj, cache;
  if (unsigned) {
    if ((cache = 0 <= (value >>>= 0) && value < 256) && (cachedObj = UINT_CACHE[value])) return cachedObj;

    obj = fromBits(value, (value | 0) < 0 ? -1 : 0, true);
    if (cache) UINT_CACHE[value] = obj;
    return obj;
  }
  if ((cache = -128 <= (value |= 0) && value < 128) && (cachedObj = INT_CACHE[value])) return cachedObj;

  obj = fromBits(value, value < 0 ? -1 : 0, false);
  if (cache) INT_CACHE[value] = obj;
  return obj;
}
Long.fromInt = fromInt;

function fromNumber(value, unsigned) {
  if (isNaN(value)) return unsigned ? UZERO : ZERO;
  if (unsigned) {
    if (value < 0) return UZERO;
    if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
  } else {
    if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
    if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
  }
  return value < 0
    ? fromNumber(-value, unsigned).neg()
    : fromBits(value % TWO_PWR_32_DBL | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
}
Long.fromNumber = fromNumber;

function fromBits(lowBits, highBits, unsigned) {
  return new Long(lowBits, highBits, unsigned);
}
Long.fromBits = fromBits;

var pow_dbl = Math.pow;

function fromString(str, unsigned, radix) {
  if (str.length === 0) throw Error('empty string');
  if (str === "NaN" || str === "Infinity" || str === "+Infinity" || str === "-Infinity") return ZERO;
  typeof unsigned == 'number' ? ((radix = unsigned), (unsigned = false)) : (unsigned = !!unsigned);

  if ((radix = radix || 10) < 2 || 36 < radix) throw RangeError('radix');

  var p = str.indexOf('-');
  if (p > 0) throw Error('interior hyphen');
  if (p === 0) return fromString(str.substring(1), unsigned, radix).neg();

  for (var radixToPower = fromNumber(pow_dbl(radix, 8)), result = ZERO, i = 0; i < str.length; i += 8) {
    var size = Math.min(8, str.length - i),
      value = parseInt(str.substring(i, i + size), radix),
      power = size < 8 ? fromNumber(pow_dbl(radix, size)) : radixToPower;
    result = result.mul(power).add(fromNumber(value));
  }
  result.unsigned = unsigned;
  return result;
}
Long.fromString = fromString;

function fromValue(val, unsigned) {
  return typeof val == 'number'
    ? fromNumber(val, unsigned)
    : typeof val == 'string'
    ? fromString(val, unsigned)
    : fromBits(val.low, val.high, typeof unsigned == 'boolean' ? unsigned : val.unsigned);
}
Long.fromValue = fromValue;

var TWO_PWR_16_DBL = 1 << 16,
  TWO_PWR_24_DBL = 1 << 24,
  TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL,
  TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL,
  TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2,
  TWO_PWR_24 = fromInt(TWO_PWR_24_DBL);

var ZERO = fromInt(0);
Long.ZERO = ZERO;

var UZERO = fromInt(0, true);
Long.UZERO = UZERO;

var ONE = fromInt(1);
Long.ONE = ONE;

var UONE = fromInt(1, true);
Long.UONE = UONE;

var NEG_ONE = fromInt(-1);
Long.NEG_ONE = NEG_ONE;

var MAX_VALUE = fromBits(0xFFFFFFFF|0, 0x7FFFFFFF|0, false);
Long.MAX_VALUE = MAX_VALUE;

var MAX_UNSIGNED_VALUE = fromBits(0xFFFFFFFF|0, 0xFFFFFFFF|0, true);
Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;

var MIN_VALUE = fromBits(0, 0x80000000|0, false);
Long.MIN_VALUE = MIN_VALUE;

var LongPrototype = Long.prototype;

LongPrototype.toInt = function() {
  return this.unsigned ? this.low >>> 0 : this.low;
};

LongPrototype.toNumber = function() {
  return this.unsigned
    ? (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0)
    : this.high * TWO_PWR_32_DBL + (this.low >>> 0);
};

LongPrototype.toString = function(radix) {
  if ((radix = radix || 10) < 2 || 36 < radix) throw RangeError('radix');
  if (this.isZero()) return '0';
  if (this.isNegative()) {
    if (this.eq(MIN_VALUE)) {
      var radixLong = fromNumber(radix),
        div = this.div(radixLong),
        rem1 = div.mul(radixLong).sub(this);
      return div.toString(radix) + rem1.toInt().toString(radix);
    }
    return '-' + this.neg().toString(radix);
  }

  for (var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this, result = ''; ; ) {
    var remDiv = rem.div(radixToPower),
      digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
    if ((rem = remDiv).isZero()) return digits + result;

    while (digits.length < 6) digits = '0' + digits;
    result = '' + digits + result;
  }
};

LongPrototype.getHighBits = function() {
  return this.high;
};

LongPrototype.getHighBitsUnsigned = function() {
  return this.high >>> 0;
};

LongPrototype.getLowBits = function() {
  return this.low;
};

LongPrototype.getLowBitsUnsigned = function() {
  return this.low >>> 0;
};

LongPrototype.getNumBitsAbs = function() {
  if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
  for (var val = this.high != 0 ? this.high : this.low, bit = 31; bit > 0 && (val & (1 << bit)) == 0; bit--);
  return this.high != 0 ? bit + 33 : bit + 1;
};

LongPrototype.isZero = function() {
  return this.high === 0 && this.low === 0;
};
LongPrototype.eqz = LongPrototype.isZero;

LongPrototype.isNegative = function() {
  return !this.unsigned && this.high < 0;
};

LongPrototype.isPositive = function() {
  return this.unsigned || this.high >= 0;
};

LongPrototype.isOdd = function() {
  return (this.low & 1) == 1;
};

LongPrototype.isEven = function() {
  return (this.low & 1) == 0;
};

LongPrototype.equals = function(other) {
  isLong(other) || (other = fromValue(other));
  return (this.unsigned === other.unsigned || this.high >>> 31 != 1 || other.high >>> 31 != 1) &&
    this.high === other.high && this.low === other.low;
};
LongPrototype.eq = LongPrototype.equals;

LongPrototype.notEquals = function(other) {
  return !this.eq(other);
};
LongPrototype.neq = LongPrototype.notEquals;
LongPrototype.ne = LongPrototype.notEquals;

LongPrototype.lessThan = function(other) {
  return this.comp(other) < 0;
};
LongPrototype.lt = LongPrototype.lessThan;

LongPrototype.lessThanOrEqual = function(other) {
  return this.comp(other) <= 0;
};
LongPrototype.lte = LongPrototype.lessThanOrEqual;
LongPrototype.le = LongPrototype.lessThanOrEqual;

LongPrototype.greaterThan = function(other) {
  return this.comp(other) > 0;
};
LongPrototype.gt = LongPrototype.greaterThan;

LongPrototype.greaterThanOrEqual = function(other) {
  return this.comp(other) >= 0;
};
LongPrototype.gte = LongPrototype.greaterThanOrEqual;
LongPrototype.ge = LongPrototype.greaterThanOrEqual;

LongPrototype.compare = function(other) {
  isLong(other) || (other = fromValue(other));
  if (this.eq(other)) return 0;
  var thisNeg = this.isNegative(),
    otherNeg = other.isNegative();
  return thisNeg && !otherNeg
    ? -1
    : !thisNeg && otherNeg
    ? 1
    : !this.unsigned
    ? this.sub(other).isNegative() ? -1 : 1
    : other.high >>> 0 > this.high >>> 0 || (other.high === this.high && other.low >>> 0 > this.low >>> 0) ? -1 : 1;
};
LongPrototype.comp = LongPrototype.compare;

LongPrototype.negate = function() {
  return !this.unsigned && this.eq(MIN_VALUE) ? MIN_VALUE : this.not().add(ONE);
};
LongPrototype.neg = LongPrototype.negate;

LongPrototype.add = function(addend) {
  isLong(addend) || (addend = fromValue(addend));

  var a48 = this.high >>> 16,
    a32 = this.high & 0xFFFF,
    a16 = this.low >>> 16,
    a00 = this.low & 0xFFFF,

    b48 = addend.high >>> 16,
    b32 = addend.high & 0xFFFF,
    b16 = addend.low >>> 16,

    c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c16 += (c00 += a00 + (addend.low & 0xFFFF)) >>> 16;
  c00 &= 0xFFFF;
  c32 += (c16 += a16 + b16) >>> 16;
  c16 &= 0xFFFF;
  c48 += (c32 += a32 + b32) >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 + b48;
  c48 &= 0xFFFF;
  return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};

LongPrototype.subtract = function(subtrahend) {
  isLong(subtrahend) || (subtrahend = fromValue(subtrahend));
  return this.add(subtrahend.neg());
};
LongPrototype.sub = LongPrototype.subtract;

LongPrototype.multiply = function(multiplier) {
  if (this.isZero()) return ZERO;
  isLong(multiplier) || (multiplier = fromValue(multiplier));

  if (wasm)
    return fromBits(wasm.mul(this.low, this.high, multiplier.low, multiplier.high), wasm.get_high(), this.unsigned);

  if (multiplier.isZero()) return ZERO;
  if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
  if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;

  if (this.isNegative())
    return multiplier.isNegative() ? this.neg().mul(multiplier.neg()) : this.neg().mul(multiplier).neg();
  if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();

  if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24))
    return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);

  var a48 = this.high >>> 16,
    a32 = this.high & 0xFFFF,
    a16 = this.low >>> 16,
    a00 = this.low & 0xFFFF,

    b48 = multiplier.high >>> 16,
    b32 = multiplier.high & 0xFFFF,
    b16 = multiplier.low >>> 16,
    b00 = multiplier.low & 0xFFFF,

    c48 = 0, c32 = 0, c16 = 0, c00 = 0;
  c16 += (c00 += a00 * b00) >>> 16;
  c00 &= 0xFFFF;
  c32 += (c16 += a16 * b00) >>> 16;
  c16 &= 0xFFFF;
  c32 += (c16 += a00 * b16) >>> 16;
  c16 &= 0xFFFF;
  c48 += (c32 += a32 * b00) >>> 16;
  c32 &= 0xFFFF;
  c48 += (c32 += a16 * b16) >>> 16;
  c32 &= 0xFFFF;
  c48 += (c32 += a00 * b32) >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
};
LongPrototype.mul = LongPrototype.multiply;

LongPrototype.divide = function(divisor) {
  isLong(divisor) || (divisor = fromValue(divisor));
  if (divisor.isZero()) throw Error('division by zero');

  if (wasm)
    return !this.unsigned && this.high === -0x80000000 && divisor.low === -1 && divisor.high === -1
      ? this
      : fromBits(
          (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high),
          wasm.get_high(), this.unsigned
        );

  if (this.isZero()) return this.unsigned ? UZERO : ZERO;
  var approx, rem, res;
  if (!this.unsigned) {
    if (this.eq(MIN_VALUE)) {
      if (divisor.eq(ONE) || divisor.eq(NEG_ONE)) return MIN_VALUE;
      if (divisor.eq(MIN_VALUE)) return ONE;

      if ((approx = this.shr(1).div(divisor).shl(1)).eq(ZERO)) return divisor.isNegative() ? ONE : NEG_ONE;

      rem = this.sub(divisor.mul(approx));
      return approx.add(rem.div(divisor));
    }
    if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
    if (this.isNegative()) return divisor.isNegative() ? this.neg().div(divisor.neg()) : this.neg().div(divisor).neg();
    if (divisor.isNegative()) return this.div(divisor.neg()).neg();
    res = ZERO;
  } else {
    divisor.unsigned || (divisor = divisor.toUnsigned());
    if (divisor.gt(this)) return UZERO;
    if (divisor.gt(this.shru(1))) return UONE;
    res = UZERO;
  }

  rem = this;
  while (rem.gte(divisor)) {
    approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));

    var log2 = Math.ceil(Math.log(approx) / Math.LN2),
      delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48),

      approxRes = fromNumber(approx),
      approxRem = approxRes.mul(divisor);
    while (approxRem.isNegative() || approxRem.gt(rem))
      approxRem = (approxRes = fromNumber((approx -= delta), this.unsigned)).mul(divisor);

    if (approxRes.isZero()) approxRes = ONE;

    res = res.add(approxRes);
    rem = rem.sub(approxRem);
  }
  return res;
};
LongPrototype.div = LongPrototype.divide;

LongPrototype.modulo = function(divisor) {
  isLong(divisor) || (divisor = fromValue(divisor));

  return wasm
    ? fromBits(
        (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high),
        wasm.get_high(), this.unsigned
      )
    : this.sub(this.div(divisor).mul(divisor));
};
LongPrototype.mod = LongPrototype.modulo;
LongPrototype.rem = LongPrototype.modulo;

LongPrototype.not = function() {
  return fromBits(~this.low, ~this.high, this.unsigned);
};

LongPrototype.and = function(other) {
  isLong(other) || (other = fromValue(other));
  return fromBits(this.low & other.low, this.high & other.high, this.unsigned);
};

LongPrototype.or = function(other) {
  isLong(other) || (other = fromValue(other));
  return fromBits(this.low | other.low, this.high | other.high, this.unsigned);
};

LongPrototype.xor = function(other) {
  isLong(other) || (other = fromValue(other));
  return fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
};

LongPrototype.shiftLeft = function(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  return (numBits &= 63) == 0
    ? this
    : numBits < 32
    ? fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned)
    : fromBits(0, this.low << (numBits - 32), this.unsigned);
};
LongPrototype.shl = LongPrototype.shiftLeft;

LongPrototype.shiftRight = function(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  return (numBits &= 63) == 0
    ? this
    : numBits < 32
    ? fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned)
    : fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
};
LongPrototype.shr = LongPrototype.shiftRight;

LongPrototype.shiftRightUnsigned = function(numBits) {
  if (isLong(numBits)) numBits = numBits.toInt();
  return (numBits &= 63) == 0 ? this
    : numBits < 32 ? fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >>> numBits, this.unsigned)
    : fromBits(numBits === 32 ? this.high : this.high >>> (numBits - 32), 0, this.unsigned);
};
LongPrototype.shru = LongPrototype.shiftRightUnsigned;
LongPrototype.shr_u = LongPrototype.shiftRightUnsigned;

LongPrototype.rotateLeft = function(numBits) {
  var b;
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) == 0) return this;
  if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits((this.low << numBits) | (this.high >>> b), (this.high << numBits) | (this.low >>> b), this.unsigned);
  }
  b = 32 - (numBits -= 32);
  return fromBits((this.high << numBits) | (this.low >>> b), (this.low << numBits) | (this.high >>> b), this.unsigned);
};
LongPrototype.rotl = LongPrototype.rotateLeft;

LongPrototype.rotateRight = function(numBits) {
  var b;
  if (isLong(numBits)) numBits = numBits.toInt();
  if ((numBits &= 63) == 0) return this;
  if (numBits === 32) return fromBits(this.high, this.low, this.unsigned);
  if (numBits < 32) {
    b = 32 - numBits;
    return fromBits((this.high << b) | (this.low >>> numBits), (this.low << b) | (this.high >>> numBits), this.unsigned);
  }
  b = 32 - (numBits -= 32);
  return fromBits((this.low << b) | (this.high >>> numBits), (this.high << b) | (this.low >>> numBits), this.unsigned);
};
LongPrototype.rotr = LongPrototype.rotateRight;

LongPrototype.toSigned = function() {
  return !this.unsigned ? this : fromBits(this.low, this.high, false);
};

LongPrototype.toUnsigned = function() {
  return this.unsigned ? this : fromBits(this.low, this.high, true);
};

LongPrototype.toBytes = function(le) {
  return le ? this.toBytesLE() : this.toBytesBE();
};

LongPrototype.toBytesLE = function() {
  var hi = this.high,
    lo = this.low;
  return [
    lo & 0xff,
    (lo >>> 8) & 0xff,
    (lo >>> 16) & 0xff,
    lo >>> 24,
    hi & 0xff,
    (hi >>> 8) & 0xff,
    (hi >>> 16) & 0xff,
    hi >>> 24
  ];
};

LongPrototype.toBytesBE = function() {
  var hi = this.high,
    lo = this.low;
  return [
    hi >>> 24,
    (hi >>> 16) & 0xff,
    (hi >>> 8) & 0xff,
    hi & 0xff,
    lo >>> 24,
    (lo >>> 16) & 0xff,
    (lo >>> 8) & 0xff,
    lo & 0xff
  ];
};

Long.fromBytes = function(bytes, unsigned, le) {
  return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
};

Long.fromBytesLE = function(bytes, unsigned) {
  return new Long(
    bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24),
    bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24),
    unsigned
  );
};

Long.fromBytesBE = function(bytes, unsigned) {
  return new Long(
    (bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7],
    (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3],
    unsigned
  );
};

"use strict";
!function(e, a) {
  for (var i in a) e[i] = a[i];
  a.__esModule && Object.defineProperty(e, "__esModule", {
    value: !0
  });
}(exports, function(modules) {
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
  return __webpack_require__.d = function(exports, definition) {
    for (var key in definition) __webpack_require__.o(exports, key) || Object.defineProperty(exports, key, {
      enumerable: !0,
      get: definition[key]
    });
  }, __webpack_require__.r = function(exports) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(exports, "__esModule", {
      value: !0
    });
  }, __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }, __webpack_require__(2);
}([ function(module, exports) {
  module.exports = require("./wasm-ast");
}, function(module, exports) {
  module.exports = require("./wasm-parser");
}, function(module, __webpack_exports__, __webpack_require__) {
  __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, {
    edit: () => edit,
    editWithAST: () => editWithAST,
    add: () => add,
    addWithAST: () => addWithAST
  });
  var external_wasm_parser_ = __webpack_require__(1), external_wasm_ast_ = __webpack_require__(0), wasm = null;
  try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([ 0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11 ])), {}).exports;
  } catch (e) {}
  function Long(low, high, unsigned) {
    this.low = 0 | low, this.high = 0 | high, this.unsigned = !!unsigned;
  }
  function isLong(obj) {
    return !0 === (obj && obj.__isLong__);
  }
  Long.prototype.__isLong__, Object.defineProperty(Long.prototype, "__isLong__", {
    value: !0
  }), Long.isLong = isLong;
  var INT_CACHE = {}, UINT_CACHE = {};
  function fromInt(value, unsigned) {
    var obj, cachedObj, cache;
    return unsigned ? (cache = 0 <= (value >>>= 0) && value < 256) && (cachedObj = UINT_CACHE[value]) ? cachedObj : (obj = fromBits(value, (0 | value) < 0 ? -1 : 0, !0), 
    cache && (UINT_CACHE[value] = obj), obj) : (cache = -128 <= (value |= 0) && value < 128) && (cachedObj = INT_CACHE[value]) ? cachedObj : (obj = fromBits(value, value < 0 ? -1 : 0, !1), 
    cache && (INT_CACHE[value] = obj), obj);
  }
  function fromNumber(value, unsigned) {
    if (isNaN(value)) return unsigned ? UZERO : ZERO;
    if (unsigned) {
      if (value < 0) return UZERO;
      if (value >= TWO_PWR_64_DBL) return MAX_UNSIGNED_VALUE;
    } else {
      if (value <= -TWO_PWR_63_DBL) return MIN_VALUE;
      if (value + 1 >= TWO_PWR_63_DBL) return MAX_VALUE;
    }
    return value < 0 ? fromNumber(-value, unsigned).neg() : fromBits(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0, unsigned);
  }
  function fromBits(lowBits, highBits, unsigned) {
    return new Long(lowBits, highBits, unsigned);
  }
  Long.fromInt = fromInt, Long.fromNumber = fromNumber, Long.fromBits = fromBits;
  var pow_dbl = Math.pow;
  function fromString(str, unsigned, radix) {
    if (0 === str.length) throw Error("empty string");
    if ("NaN" === str || "Infinity" === str || "+Infinity" === str || "-Infinity" === str) return ZERO;
    if ("number" == typeof unsigned ? (radix = unsigned, unsigned = !1) : unsigned = !!unsigned, 
    (radix = radix || 10) < 2 || 36 < radix) throw RangeError("radix");
    var p;
    if ((p = str.indexOf("-")) > 0) throw Error("interior hyphen");
    if (0 === p) return fromString(str.substring(1), unsigned, radix).neg();
    for (var radixToPower = fromNumber(pow_dbl(radix, 8)), result = ZERO, i = 0; i < str.length; i += 8) {
      var size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
      if (size < 8) {
        var power = fromNumber(pow_dbl(radix, size));
        result = result.mul(power).add(fromNumber(value));
      } else result = (result = result.mul(radixToPower)).add(fromNumber(value));
    }
    return result.unsigned = unsigned, result;
  }
  function fromValue(val, unsigned) {
    return "number" == typeof val ? fromNumber(val, unsigned) : "string" == typeof val ? fromString(val, unsigned) : fromBits(val.low, val.high, "boolean" == typeof unsigned ? unsigned : val.unsigned);
  }
  Long.fromString = fromString, Long.fromValue = fromValue;
  var TWO_PWR_32_DBL = 4294967296, TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL, TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2, TWO_PWR_24 = fromInt(1 << 24), ZERO = fromInt(0);
  Long.ZERO = ZERO;
  var UZERO = fromInt(0, !0);
  Long.UZERO = UZERO;
  var ONE = fromInt(1);
  Long.ONE = ONE;
  var UONE = fromInt(1, !0);
  Long.UONE = UONE;
  var NEG_ONE = fromInt(-1);
  Long.NEG_ONE = NEG_ONE;
  var MAX_VALUE = fromBits(-1, 2147483647, !1);
  Long.MAX_VALUE = MAX_VALUE;
  var MAX_UNSIGNED_VALUE = fromBits(-1, -1, !0);
  Long.MAX_UNSIGNED_VALUE = MAX_UNSIGNED_VALUE;
  var MIN_VALUE = fromBits(0, -2147483648, !1);
  Long.MIN_VALUE = MIN_VALUE;
  var LongPrototype = Long.prototype;
  function extract(buffer, bitIndex, bitLength, defaultBit) {
    if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");
    if (void 0 === defaultBit) defaultBit = 0; else if (0 !== defaultBit && 1 !== defaultBit) throw new Error("Bad value for defaultBit.");
    var defaultByte = 255 * defaultBit, result = 0, lastBit = bitIndex + bitLength, startByte = Math.floor(bitIndex / 8), startBit = bitIndex % 8, endByte = Math.floor(lastBit / 8), endBit = lastBit % 8;
    for (0 !== endBit && (result = get(endByte) & (1 << endBit) - 1); endByte > startByte; ) result = result << 8 | get(--endByte);
    return result >>>= startBit;
    function get(index) {
      var result = buffer[index];
      return void 0 === result ? defaultByte : result;
    }
  }
  function inject(buffer, bitIndex, bitLength, value) {
    if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");
    var lastByte = Math.floor((bitIndex + bitLength - 1) / 8);
    if (bitIndex < 0 || lastByte >= buffer.length) throw new Error("Index out of range.");
    for (var atByte = Math.floor(bitIndex / 8), atBit = bitIndex % 8; bitLength > 0; ) 1 & value ? buffer[atByte] |= 1 << atBit : buffer[atByte] &= ~(1 << atBit), 
    value >>= 1, bitLength--, 0 === (atBit = (atBit + 1) % 8) && atByte++;
  }
  function getSign(buffer) {
    return buffer[buffer.length - 1] >>> 7;
  }
  function highOrder(bit, buffer) {
    for (var length = buffer.length, fullyWrongByte = 255 * (1 ^ bit); length > 0 && buffer[length - 1] === fullyWrongByte; ) length--;
    if (0 === length) return -1;
    for (var byteToCheck = buffer[length - 1], result = 8 * length - 1, i = 7; i > 0 && (byteToCheck >> i & 1) !== bit; i--) result--;
    return result;
  }
  LongPrototype.toInt = function() {
    return this.unsigned ? this.low >>> 0 : this.low;
  }, LongPrototype.toNumber = function() {
    return this.unsigned ? (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0) : this.high * TWO_PWR_32_DBL + (this.low >>> 0);
  }, LongPrototype.toString = function(radix) {
    if ((radix = radix || 10) < 2 || 36 < radix) throw RangeError("radix");
    if (this.isZero()) return "0";
    if (this.isNegative()) {
      if (this.eq(MIN_VALUE)) {
        var radixLong = fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
        return div.toString(radix) + rem1.toInt().toString(radix);
      }
      return "-" + this.neg().toString(radix);
    }
    for (var radixToPower = fromNumber(pow_dbl(radix, 6), this.unsigned), rem = this, result = ""; ;) {
      var remDiv = rem.div(radixToPower), digits = (rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0).toString(radix);
      if ((rem = remDiv).isZero()) return digits + result;
      for (;digits.length < 6; ) digits = "0" + digits;
      result = "" + digits + result;
    }
  }, LongPrototype.getHighBits = function() {
    return this.high;
  }, LongPrototype.getHighBitsUnsigned = function() {
    return this.high >>> 0;
  }, LongPrototype.getLowBits = function() {
    return this.low;
  }, LongPrototype.getLowBitsUnsigned = function() {
    return this.low >>> 0;
  }, LongPrototype.getNumBitsAbs = function() {
    if (this.isNegative()) return this.eq(MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
    for (var val = 0 != this.high ? this.high : this.low, bit = 31; bit > 0 && 0 == (val & 1 << bit); bit--) ;
    return 0 != this.high ? bit + 33 : bit + 1;
  }, LongPrototype.isZero = function() {
    return 0 === this.high && 0 === this.low;
  }, LongPrototype.eqz = LongPrototype.isZero, LongPrototype.isNegative = function() {
    return !this.unsigned && this.high < 0;
  }, LongPrototype.isPositive = function() {
    return this.unsigned || this.high >= 0;
  }, LongPrototype.isOdd = function() {
    return 1 == (1 & this.low);
  }, LongPrototype.isEven = function() {
    return 0 == (1 & this.low);
  }, LongPrototype.equals = function(other) {
    return isLong(other) || (other = fromValue(other)), (this.unsigned === other.unsigned || this.high >>> 31 != 1 || other.high >>> 31 != 1) && (this.high === other.high && this.low === other.low);
  }, LongPrototype.eq = LongPrototype.equals, LongPrototype.notEquals = function(other) {
    return !this.eq(other);
  }, LongPrototype.neq = LongPrototype.notEquals, LongPrototype.ne = LongPrototype.notEquals, 
  LongPrototype.lessThan = function(other) {
    return this.comp(other) < 0;
  }, LongPrototype.lt = LongPrototype.lessThan, LongPrototype.lessThanOrEqual = function(other) {
    return this.comp(other) <= 0;
  }, LongPrototype.lte = LongPrototype.lessThanOrEqual, LongPrototype.le = LongPrototype.lessThanOrEqual, 
  LongPrototype.greaterThan = function(other) {
    return this.comp(other) > 0;
  }, LongPrototype.gt = LongPrototype.greaterThan, LongPrototype.greaterThanOrEqual = function(other) {
    return this.comp(other) >= 0;
  }, LongPrototype.gte = LongPrototype.greaterThanOrEqual, LongPrototype.ge = LongPrototype.greaterThanOrEqual, 
  LongPrototype.compare = function(other) {
    if (isLong(other) || (other = fromValue(other)), this.eq(other)) return 0;
    var thisNeg = this.isNegative(), otherNeg = other.isNegative();
    return thisNeg && !otherNeg ? -1 : !thisNeg && otherNeg ? 1 : this.unsigned ? other.high >>> 0 > this.high >>> 0 || other.high === this.high && other.low >>> 0 > this.low >>> 0 ? -1 : 1 : this.sub(other).isNegative() ? -1 : 1;
  }, LongPrototype.comp = LongPrototype.compare, LongPrototype.negate = function() {
    return !this.unsigned && this.eq(MIN_VALUE) ? MIN_VALUE : this.not().add(ONE);
  }, LongPrototype.neg = LongPrototype.negate, LongPrototype.add = function(addend) {
    isLong(addend) || (addend = fromValue(addend));
    var a48 = this.high >>> 16, a32 = 65535 & this.high, a16 = this.low >>> 16, a00 = 65535 & this.low, b48 = addend.high >>> 16, b32 = 65535 & addend.high, b16 = addend.low >>> 16, c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    return c16 += (c00 += a00 + (65535 & addend.low)) >>> 16, c32 += (c16 += a16 + b16) >>> 16, 
    c48 += (c32 += a32 + b32) >>> 16, c48 += a48 + b48, fromBits((c16 &= 65535) << 16 | (c00 &= 65535), (c48 &= 65535) << 16 | (c32 &= 65535), this.unsigned);
  }, LongPrototype.subtract = function(subtrahend) {
    return isLong(subtrahend) || (subtrahend = fromValue(subtrahend)), this.add(subtrahend.neg());
  }, LongPrototype.sub = LongPrototype.subtract, LongPrototype.multiply = function(multiplier) {
    if (this.isZero()) return ZERO;
    if (isLong(multiplier) || (multiplier = fromValue(multiplier)), wasm) return fromBits(wasm.mul(this.low, this.high, multiplier.low, multiplier.high), wasm.get_high(), this.unsigned);
    if (multiplier.isZero()) return ZERO;
    if (this.eq(MIN_VALUE)) return multiplier.isOdd() ? MIN_VALUE : ZERO;
    if (multiplier.eq(MIN_VALUE)) return this.isOdd() ? MIN_VALUE : ZERO;
    if (this.isNegative()) return multiplier.isNegative() ? this.neg().mul(multiplier.neg()) : this.neg().mul(multiplier).neg();
    if (multiplier.isNegative()) return this.mul(multiplier.neg()).neg();
    if (this.lt(TWO_PWR_24) && multiplier.lt(TWO_PWR_24)) return fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
    var a48 = this.high >>> 16, a32 = 65535 & this.high, a16 = this.low >>> 16, a00 = 65535 & this.low, b48 = multiplier.high >>> 16, b32 = 65535 & multiplier.high, b16 = multiplier.low >>> 16, b00 = 65535 & multiplier.low, c48 = 0, c32 = 0, c16 = 0, c00 = 0;
    return c16 += (c00 += a00 * b00) >>> 16, c32 += (c16 += a16 * b00) >>> 16, c16 &= 65535, 
    c32 += (c16 += a00 * b16) >>> 16, c48 += (c32 += a32 * b00) >>> 16, c32 &= 65535, 
    c48 += (c32 += a16 * b16) >>> 16, c32 &= 65535, c48 += (c32 += a00 * b32) >>> 16, 
    c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48, fromBits((c16 &= 65535) << 16 | (c00 &= 65535), (c48 &= 65535) << 16 | (c32 &= 65535), this.unsigned);
  }, LongPrototype.mul = LongPrototype.multiply, LongPrototype.divide = function(divisor) {
    if (isLong(divisor) || (divisor = fromValue(divisor)), divisor.isZero()) throw Error("division by zero");
    var approx, rem, res;
    if (wasm) return this.unsigned || -2147483648 !== this.high || -1 !== divisor.low || -1 !== divisor.high ? fromBits((this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high), wasm.get_high(), this.unsigned) : this;
    if (this.isZero()) return this.unsigned ? UZERO : ZERO;
    if (this.unsigned) {
      if (divisor.unsigned || (divisor = divisor.toUnsigned()), divisor.gt(this)) return UZERO;
      if (divisor.gt(this.shru(1))) return UONE;
      res = UZERO;
    } else {
      if (this.eq(MIN_VALUE)) return divisor.eq(ONE) || divisor.eq(NEG_ONE) ? MIN_VALUE : divisor.eq(MIN_VALUE) ? ONE : (approx = this.shr(1).div(divisor).shl(1)).eq(ZERO) ? divisor.isNegative() ? ONE : NEG_ONE : (rem = this.sub(divisor.mul(approx)), 
      res = approx.add(rem.div(divisor)));
      if (divisor.eq(MIN_VALUE)) return this.unsigned ? UZERO : ZERO;
      if (this.isNegative()) return divisor.isNegative() ? this.neg().div(divisor.neg()) : this.neg().div(divisor).neg();
      if (divisor.isNegative()) return this.div(divisor.neg()).neg();
      res = ZERO;
    }
    for (rem = this; rem.gte(divisor); ) {
      approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
      for (var log2 = Math.ceil(Math.log(approx) / Math.LN2), delta = log2 <= 48 ? 1 : pow_dbl(2, log2 - 48), approxRes = fromNumber(approx), approxRem = approxRes.mul(divisor); approxRem.isNegative() || approxRem.gt(rem); ) approxRem = (approxRes = fromNumber(approx -= delta, this.unsigned)).mul(divisor);
      approxRes.isZero() && (approxRes = ONE), res = res.add(approxRes), rem = rem.sub(approxRem);
    }
    return res;
  }, LongPrototype.div = LongPrototype.divide, LongPrototype.modulo = function(divisor) {
    return isLong(divisor) || (divisor = fromValue(divisor)), wasm ? fromBits((this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high), wasm.get_high(), this.unsigned) : this.sub(this.div(divisor).mul(divisor));
  }, LongPrototype.mod = LongPrototype.modulo, LongPrototype.rem = LongPrototype.modulo, 
  LongPrototype.not = function() {
    return fromBits(~this.low, ~this.high, this.unsigned);
  }, LongPrototype.and = function(other) {
    return isLong(other) || (other = fromValue(other)), fromBits(this.low & other.low, this.high & other.high, this.unsigned);
  }, LongPrototype.or = function(other) {
    return isLong(other) || (other = fromValue(other)), fromBits(this.low | other.low, this.high | other.high, this.unsigned);
  }, LongPrototype.xor = function(other) {
    return isLong(other) || (other = fromValue(other)), fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
  }, LongPrototype.shiftLeft = function(numBits) {
    return isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63) ? this : numBits < 32 ? fromBits(this.low << numBits, this.high << numBits | this.low >>> 32 - numBits, this.unsigned) : fromBits(0, this.low << numBits - 32, this.unsigned);
  }, LongPrototype.shl = LongPrototype.shiftLeft, LongPrototype.shiftRight = function(numBits) {
    return isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63) ? this : numBits < 32 ? fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >> numBits, this.unsigned) : fromBits(this.high >> numBits - 32, this.high >= 0 ? 0 : -1, this.unsigned);
  }, LongPrototype.shr = LongPrototype.shiftRight, LongPrototype.shiftRightUnsigned = function(numBits) {
    return isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63) ? this : numBits < 32 ? fromBits(this.low >>> numBits | this.high << 32 - numBits, this.high >>> numBits, this.unsigned) : fromBits(32 === numBits ? this.high : this.high >>> numBits - 32, 0, this.unsigned);
  }, LongPrototype.shru = LongPrototype.shiftRightUnsigned, LongPrototype.shr_u = LongPrototype.shiftRightUnsigned, 
  LongPrototype.rotateLeft = function(numBits) {
    var b;
    return isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63) ? this : 32 === numBits ? fromBits(this.high, this.low, this.unsigned) : numBits < 32 ? (b = 32 - numBits, 
    fromBits(this.low << numBits | this.high >>> b, this.high << numBits | this.low >>> b, this.unsigned)) : (b = 32 - (numBits -= 32), 
    fromBits(this.high << numBits | this.low >>> b, this.low << numBits | this.high >>> b, this.unsigned));
  }, LongPrototype.rotl = LongPrototype.rotateLeft, LongPrototype.rotateRight = function(numBits) {
    var b;
    return isLong(numBits) && (numBits = numBits.toInt()), 0 == (numBits &= 63) ? this : 32 === numBits ? fromBits(this.high, this.low, this.unsigned) : numBits < 32 ? (b = 32 - numBits, 
    fromBits(this.high << b | this.low >>> numBits, this.low << b | this.high >>> numBits, this.unsigned)) : (b = 32 - (numBits -= 32), 
    fromBits(this.low << b | this.high >>> numBits, this.high << b | this.low >>> numBits, this.unsigned));
  }, LongPrototype.rotr = LongPrototype.rotateRight, LongPrototype.toSigned = function() {
    return this.unsigned ? fromBits(this.low, this.high, !1) : this;
  }, LongPrototype.toUnsigned = function() {
    return this.unsigned ? this : fromBits(this.low, this.high, !0);
  }, LongPrototype.toBytes = function(le) {
    return le ? this.toBytesLE() : this.toBytesBE();
  }, LongPrototype.toBytesLE = function() {
    var hi = this.high, lo = this.low;
    return [ 255 & lo, lo >>> 8 & 255, lo >>> 16 & 255, lo >>> 24, 255 & hi, hi >>> 8 & 255, hi >>> 16 & 255, hi >>> 24 ];
  }, LongPrototype.toBytesBE = function() {
    var hi = this.high, lo = this.low;
    return [ hi >>> 24, hi >>> 16 & 255, hi >>> 8 & 255, 255 & hi, lo >>> 24, lo >>> 16 & 255, lo >>> 8 & 255, 255 & lo ];
  }, Long.fromBytes = function(bytes, unsigned, le) {
    return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
  }, Long.fromBytesLE = function(bytes, unsigned) {
    return new Long(bytes[0] | bytes[1] << 8 | bytes[2] << 16 | bytes[3] << 24, bytes[4] | bytes[5] << 8 | bytes[6] << 16 | bytes[7] << 24, unsigned);
  }, Long.fromBytesBE = function(bytes, unsigned) {
    return new Long(bytes[4] << 24 | bytes[5] << 16 | bytes[6] << 8 | bytes[7], bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], unsigned);
  };
  var bufPool = [];
  function isLossyToAdd(accum, num) {
    if (0 === num) return !1;
    var lowBit = function(num) {
      return num & -num;
    }(num), added = accum + lowBit;
    return added === accum || added - lowBit !== accum;
  }
  function alloc(length) {
    var result = bufPool[length];
    return result ? bufPool[length] = void 0 : result = new Buffer(length), result.fill(0), 
    result;
  }
  function free(buffer) {
    var length = buffer.length;
    length < 20 && (bufPool[length] = buffer);
  }
  function writeUInt64(value, buffer) {
    if (value < 0 || value > 0xfffffffffffff800) throw new Error("Value out of range.");
    var lowWord = value % 4294967296, highWord = Math.floor(value / 4294967296);
    buffer.writeUInt32LE(lowWord, 0), buffer.writeUInt32LE(highWord, 4);
  }
  function encodeBufferCommon(buffer, signed) {
    var signBit, bitCount;
    signed ? (signBit = getSign(buffer), bitCount = function(buffer) {
      return highOrder(1 ^ getSign(buffer), buffer) + 2;
    }(buffer)) : (signBit = 0, bitCount = function(buffer) {
      var result = highOrder(1, buffer) + 1;
      return result || 1;
    }(buffer));
    for (var byteCount = Math.ceil(bitCount / 7), result = alloc(byteCount), i = 0; i < byteCount; i++) {
      var payload = extract(buffer, 7 * i, 7, signBit);
      result[i] = 128 | payload;
    }
    return result[byteCount - 1] &= 127, result;
  }
  function decodeBufferCommon(encodedBuffer, index, signed) {
    for (var signBit, signByte, length = function(encodedBuffer, index) {
      for (var result = 0; encodedBuffer[index + result] >= 128; ) result++;
      return result++, encodedBuffer.length, result;
    }(encodedBuffer, index = void 0 === index ? 0 : index), bitLength = 7 * length, byteLength = Math.ceil(bitLength / 8), result = alloc(byteLength), outIndex = 0; length > 0; ) inject(result, outIndex, 7, encodedBuffer[index]), 
    outIndex += 7, index++, length--;
    if (signed) {
      var lastByte = result[byteLength - 1], endBit = outIndex % 8;
      if (0 !== endBit) {
        var shift = 32 - endBit;
        lastByte = result[byteLength - 1] = lastByte << shift >> shift & 255;
      }
      signByte = 255 * (signBit = lastByte >> 7);
    } else signBit = 0, signByte = 0;
    for (;byteLength > 1 && result[byteLength - 1] === signByte && (!signed || result[byteLength - 2] >> 7 === signBit); ) byteLength--;
    return {
      value: result = function(buffer, length) {
        if (length === buffer.length) return buffer;
        var newBuf = alloc(length);
        return buffer.copy(newBuf), free(buffer), newBuf;
      }(result, byteLength),
      nextIndex: index
    };
  }
  function encodeIntBuffer(buffer) {
    return encodeBufferCommon(buffer, !0);
  }
  function decodeIntBuffer(encodedBuffer, index) {
    return decodeBufferCommon(encodedBuffer, index, !0);
  }
  function encodeUIntBuffer(buffer) {
    return encodeBufferCommon(buffer, !1);
  }
  function decodeUIntBuffer(encodedBuffer, index) {
    return decodeBufferCommon(encodedBuffer, index, !1);
  }
  var leb = {
    decodeInt32: function(encodedBuffer, index) {
      var result = decodeIntBuffer(encodedBuffer, index), value = function(buffer) {
        var length = buffer.length, result = buffer[length - 1] < 128 ? 0 : -1, lossy = !1;
        if (length < 7) for (var i = length - 1; i >= 0; i--) result = 256 * result + buffer[i]; else for (var _i = length - 1; _i >= 0; _i--) {
          var one = buffer[_i];
          isLossyToAdd(result *= 256, one) && (lossy = !0), result += one;
        }
        return {
          value: result,
          lossy: lossy
        };
      }(result.value).value;
      if (free(result.value), value < -2147483648 || value > 2147483647) throw new Error("integer too large");
      return {
        value: value,
        nextIndex: result.nextIndex
      };
    },
    decodeInt64: function(encodedBuffer, index) {
      var result = decodeIntBuffer(encodedBuffer, index), value = Long.fromBytesLE(result.value, !1);
      return free(result.value), {
        value: value,
        nextIndex: result.nextIndex,
        lossy: !1
      };
    },
    decodeIntBuffer: decodeIntBuffer,
    decodeUInt32: function(encodedBuffer, index) {
      var result = decodeUIntBuffer(encodedBuffer, index), value = function(buffer) {
        var length = buffer.length, result = 0, lossy = !1;
        if (length < 7) for (var i = length - 1; i >= 0; i--) result = 256 * result + buffer[i]; else for (var _i2 = length - 1; _i2 >= 0; _i2--) {
          var one = buffer[_i2];
          isLossyToAdd(result *= 256, one) && (lossy = !0), result += one;
        }
        return {
          value: result,
          lossy: lossy
        };
      }(result.value).value;
      if (free(result.value), value > 4294967295) throw new Error("integer too large");
      return {
        value: value,
        nextIndex: result.nextIndex
      };
    },
    decodeUInt64: function(encodedBuffer, index) {
      var result = decodeUIntBuffer(encodedBuffer, index), value = Long.fromBytesLE(result.value, !0);
      return free(result.value), {
        value: value,
        nextIndex: result.nextIndex,
        lossy: !1
      };
    },
    decodeUIntBuffer: decodeUIntBuffer,
    encodeInt32: function(num) {
      var buf = alloc(4);
      buf.writeInt32LE(num, 0);
      var result = encodeIntBuffer(buf);
      return free(buf), result;
    },
    encodeInt64: function(num) {
      var buf = alloc(8);
      !function(value, buffer) {
        if (value < -0x8000000000000000 || value > 0x7ffffffffffffc00) throw new Error("Value out of range.");
        value < 0 && (value += 0x10000000000000000), writeUInt64(value, buffer);
      }(num, buf);
      var result = encodeIntBuffer(buf);
      return free(buf), result;
    },
    encodeIntBuffer: encodeIntBuffer,
    encodeUInt32: function(num) {
      var buf = alloc(4);
      buf.writeUInt32LE(num, 0);
      var result = encodeUIntBuffer(buf);
      return free(buf), result;
    },
    encodeUInt64: function(num) {
      var buf = alloc(8);
      writeUInt64(num, buf);
      var result = encodeUIntBuffer(buf);
      return free(buf), result;
    },
    encodeUIntBuffer: encodeUIntBuffer
  };
  function write(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0, i = isLE ? 0 : nBytes - 1, d = isLE ? 1 : -1, s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
    for (value = Math.abs(value), isNaN(value) || value === 1 / 0 ? (m = isNaN(value) ? 1 : 0, 
    e = eMax) : (e = Math.floor(Math.log(value) / Math.LN2), value * (c = Math.pow(2, -e)) < 1 && (e--, 
    c *= 2), (value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias)) * c >= 2 && (e++, 
    c /= 2), e + eBias >= eMax ? (m = 0, e = eMax) : e + eBias >= 1 ? (m = (value * c - 1) * Math.pow(2, mLen), 
    e += eBias) : (m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen), e = 0)); mLen >= 8; buffer[offset + i] = 255 & m, 
    i += d, m /= 256, mLen -= 8) ;
    for (e = e << mLen | m, eLen += mLen; eLen > 0; buffer[offset + i] = 255 & e, i += d, 
    e /= 256, eLen -= 8) ;
    buffer[offset + i - d] |= 128 * s;
  }
  function encodeF32(v) {
    var buffer = [];
    return write(buffer, v, 0, !0, 23, 4), buffer;
  }
  function encodeF64(v) {
    var buffer = [];
    return write(buffer, v, 0, !0, 52, 8), buffer;
  }
  function encoder_con(n) {
    return 128 | 63 & n;
  }
  function encode(str) {
    return function _encode(arr) {
      if (0 === arr.length) return [];
      var _arr = function(arr) {
        return Array.isArray(arr) ? arr : Array.from(arr);
      }(arr), n = _arr[0], ns = _arr.slice(1);
      if (n < 0) throw new Error("utf8");
      if (n < 128) return [ n ].concat(_encode(ns));
      if (n < 2048) return [ 192 | n >>> 6, encoder_con(n) ].concat(_encode(ns));
      if (n < 65536) return [ 224 | n >>> 12, encoder_con(n >>> 6), encoder_con(n) ].concat(_encode(ns));
      if (n < 1114112) return [ 240 | n >>> 18, encoder_con(n >>> 12), encoder_con(n >>> 6), encoder_con(n) ].concat(_encode(ns));
      throw new Error("utf8");
    }(str.split("").map((function(x) {
      return x.charCodeAt(0);
    })));
  }
  function getSectionForNode(n) {
    switch (n.type) {
     case "ModuleImport":
      return "import";

     case "CallInstruction":
     case "CallIndirectInstruction":
     case "Func":
     case "Instr":
      return "code";

     case "ModuleExport":
      return "export";

     case "Start":
      return "start";

     case "TypeInstruction":
      return "type";

     case "IndexInFuncSection":
      return "func";

     case "Global":
      return "global";

     default:
      return;
    }
  }
  function invertMap(obj) {
    for (var keyModifierFn = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : function(k) {
      return k;
    }, result = {}, keys = Object.keys(obj), i = 0, length = keys.length; i < length; i++) result[keyModifierFn(obj[keys[i]])] = keys[i];
    return result;
  }
  function createSymbolObject(name, object) {
    var numberOfArgs = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
    return {
      name: name,
      object: object,
      numberOfArgs: numberOfArgs
    };
  }
  function createSymbol(name) {
    var numberOfArgs = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
    return {
      name: name,
      numberOfArgs: numberOfArgs
    };
  }
  var exportTypes = {
    0: "Func",
    1: "Table",
    2: "Mem",
    3: "Global"
  }, exportTypesByName = invertMap(exportTypes), valtypes = {
    127: "i32",
    126: "i64",
    125: "f32",
    124: "f64",
    123: "v128"
  }, valtypesByString = invertMap(valtypes), blockTypes = Object.assign({}, valtypes, {
    64: null,
    127: "i32",
    126: "i64",
    125: "f32",
    124: "f64"
  }), globalTypes = {
    0: "const",
    1: "var"
  }, globalTypesByString = invertMap(globalTypes), symbolsByByte = {
    0: createSymbol("unreachable"),
    1: createSymbol("nop"),
    2: createSymbol("block"),
    3: createSymbol("loop"),
    4: createSymbol("if"),
    5: createSymbol("else"),
    6: "illegal",
    7: "illegal",
    8: "illegal",
    9: "illegal",
    10: "illegal",
    11: createSymbol("end"),
    12: createSymbol("br", 1),
    13: createSymbol("br_if", 1),
    14: createSymbol("br_table"),
    15: createSymbol("return"),
    16: createSymbol("call", 1),
    17: createSymbol("call_indirect", 2),
    18: "illegal",
    19: "illegal",
    20: "illegal",
    21: "illegal",
    22: "illegal",
    23: "illegal",
    24: "illegal",
    25: "illegal",
    26: createSymbol("drop"),
    27: createSymbol("select"),
    28: "illegal",
    29: "illegal",
    30: "illegal",
    31: "illegal",
    32: createSymbol("get_local", 1),
    33: createSymbol("set_local", 1),
    34: createSymbol("tee_local", 1),
    35: createSymbol("get_global", 1),
    36: createSymbol("set_global", 1),
    37: "illegal",
    38: "illegal",
    39: "illegal",
    40: createSymbolObject("load", "u32", 1),
    41: createSymbolObject("load", "u64", 1),
    42: createSymbolObject("load", "f32", 1),
    43: createSymbolObject("load", "f64", 1),
    44: createSymbolObject("load8_s", "u32", 1),
    45: createSymbolObject("load8_u", "u32", 1),
    46: createSymbolObject("load16_s", "u32", 1),
    47: createSymbolObject("load16_u", "u32", 1),
    48: createSymbolObject("load8_s", "u64", 1),
    49: createSymbolObject("load8_u", "u64", 1),
    50: createSymbolObject("load16_s", "u64", 1),
    51: createSymbolObject("load16_u", "u64", 1),
    52: createSymbolObject("load32_s", "u64", 1),
    53: createSymbolObject("load32_u", "u64", 1),
    54: createSymbolObject("store", "u32", 1),
    55: createSymbolObject("store", "u64", 1),
    56: createSymbolObject("store", "f32", 1),
    57: createSymbolObject("store", "f64", 1),
    58: createSymbolObject("store8", "u32", 1),
    59: createSymbolObject("store16", "u32", 1),
    60: createSymbolObject("store8", "u64", 1),
    61: createSymbolObject("store16", "u64", 1),
    62: createSymbolObject("store32", "u64", 1),
    63: createSymbolObject("current_memory"),
    64: createSymbolObject("grow_memory"),
    65: createSymbolObject("const", "i32", 1),
    66: createSymbolObject("const", "i64", 1),
    67: createSymbolObject("const", "f32", 1),
    68: createSymbolObject("const", "f64", 1),
    69: createSymbolObject("eqz", "i32"),
    70: createSymbolObject("eq", "i32"),
    71: createSymbolObject("ne", "i32"),
    72: createSymbolObject("lt_s", "i32"),
    73: createSymbolObject("lt_u", "i32"),
    74: createSymbolObject("gt_s", "i32"),
    75: createSymbolObject("gt_u", "i32"),
    76: createSymbolObject("le_s", "i32"),
    77: createSymbolObject("le_u", "i32"),
    78: createSymbolObject("ge_s", "i32"),
    79: createSymbolObject("ge_u", "i32"),
    80: createSymbolObject("eqz", "i64"),
    81: createSymbolObject("eq", "i64"),
    82: createSymbolObject("ne", "i64"),
    83: createSymbolObject("lt_s", "i64"),
    84: createSymbolObject("lt_u", "i64"),
    85: createSymbolObject("gt_s", "i64"),
    86: createSymbolObject("gt_u", "i64"),
    87: createSymbolObject("le_s", "i64"),
    88: createSymbolObject("le_u", "i64"),
    89: createSymbolObject("ge_s", "i64"),
    90: createSymbolObject("ge_u", "i64"),
    91: createSymbolObject("eq", "f32"),
    92: createSymbolObject("ne", "f32"),
    93: createSymbolObject("lt", "f32"),
    94: createSymbolObject("gt", "f32"),
    95: createSymbolObject("le", "f32"),
    96: createSymbolObject("ge", "f32"),
    97: createSymbolObject("eq", "f64"),
    98: createSymbolObject("ne", "f64"),
    99: createSymbolObject("lt", "f64"),
    100: createSymbolObject("gt", "f64"),
    101: createSymbolObject("le", "f64"),
    102: createSymbolObject("ge", "f64"),
    103: createSymbolObject("clz", "i32"),
    104: createSymbolObject("ctz", "i32"),
    105: createSymbolObject("popcnt", "i32"),
    106: createSymbolObject("add", "i32"),
    107: createSymbolObject("sub", "i32"),
    108: createSymbolObject("mul", "i32"),
    109: createSymbolObject("div_s", "i32"),
    110: createSymbolObject("div_u", "i32"),
    111: createSymbolObject("rem_s", "i32"),
    112: createSymbolObject("rem_u", "i32"),
    113: createSymbolObject("and", "i32"),
    114: createSymbolObject("or", "i32"),
    115: createSymbolObject("xor", "i32"),
    116: createSymbolObject("shl", "i32"),
    117: createSymbolObject("shr_s", "i32"),
    118: createSymbolObject("shr_u", "i32"),
    119: createSymbolObject("rotl", "i32"),
    120: createSymbolObject("rotr", "i32"),
    121: createSymbolObject("clz", "i64"),
    122: createSymbolObject("ctz", "i64"),
    123: createSymbolObject("popcnt", "i64"),
    124: createSymbolObject("add", "i64"),
    125: createSymbolObject("sub", "i64"),
    126: createSymbolObject("mul", "i64"),
    127: createSymbolObject("div_s", "i64"),
    128: createSymbolObject("div_u", "i64"),
    129: createSymbolObject("rem_s", "i64"),
    130: createSymbolObject("rem_u", "i64"),
    131: createSymbolObject("and", "i64"),
    132: createSymbolObject("or", "i64"),
    133: createSymbolObject("xor", "i64"),
    134: createSymbolObject("shl", "i64"),
    135: createSymbolObject("shr_s", "i64"),
    136: createSymbolObject("shr_u", "i64"),
    137: createSymbolObject("rotl", "i64"),
    138: createSymbolObject("rotr", "i64"),
    139: createSymbolObject("abs", "f32"),
    140: createSymbolObject("neg", "f32"),
    141: createSymbolObject("ceil", "f32"),
    142: createSymbolObject("floor", "f32"),
    143: createSymbolObject("trunc", "f32"),
    144: createSymbolObject("nearest", "f32"),
    145: createSymbolObject("sqrt", "f32"),
    146: createSymbolObject("add", "f32"),
    147: createSymbolObject("sub", "f32"),
    148: createSymbolObject("mul", "f32"),
    149: createSymbolObject("div", "f32"),
    150: createSymbolObject("min", "f32"),
    151: createSymbolObject("max", "f32"),
    152: createSymbolObject("copysign", "f32"),
    153: createSymbolObject("abs", "f64"),
    154: createSymbolObject("neg", "f64"),
    155: createSymbolObject("ceil", "f64"),
    156: createSymbolObject("floor", "f64"),
    157: createSymbolObject("trunc", "f64"),
    158: createSymbolObject("nearest", "f64"),
    159: createSymbolObject("sqrt", "f64"),
    160: createSymbolObject("add", "f64"),
    161: createSymbolObject("sub", "f64"),
    162: createSymbolObject("mul", "f64"),
    163: createSymbolObject("div", "f64"),
    164: createSymbolObject("min", "f64"),
    165: createSymbolObject("max", "f64"),
    166: createSymbolObject("copysign", "f64"),
    167: createSymbolObject("wrap/i64", "i32"),
    168: createSymbolObject("trunc_s/f32", "i32"),
    169: createSymbolObject("trunc_u/f32", "i32"),
    170: createSymbolObject("trunc_s/f64", "i32"),
    171: createSymbolObject("trunc_u/f64", "i32"),
    172: createSymbolObject("extend_s/i32", "i64"),
    173: createSymbolObject("extend_u/i32", "i64"),
    174: createSymbolObject("trunc_s/f32", "i64"),
    175: createSymbolObject("trunc_u/f32", "i64"),
    176: createSymbolObject("trunc_s/f64", "i64"),
    177: createSymbolObject("trunc_u/f64", "i64"),
    178: createSymbolObject("convert_s/i32", "f32"),
    179: createSymbolObject("convert_u/i32", "f32"),
    180: createSymbolObject("convert_s/i64", "f32"),
    181: createSymbolObject("convert_u/i64", "f32"),
    182: createSymbolObject("demote/f64", "f32"),
    183: createSymbolObject("convert_s/i32", "f64"),
    184: createSymbolObject("convert_u/i32", "f64"),
    185: createSymbolObject("convert_s/i64", "f64"),
    186: createSymbolObject("convert_u/i64", "f64"),
    187: createSymbolObject("promote/f32", "f64"),
    188: createSymbolObject("reinterpret/f32", "i32"),
    189: createSymbolObject("reinterpret/f64", "i64"),
    190: createSymbolObject("reinterpret/i32", "f32"),
    191: createSymbolObject("reinterpret/i64", "f64")
  }, esm = {
    symbolsByByte: symbolsByByte,
    sections: {
      custom: 0,
      type: 1,
      import: 2,
      func: 3,
      table: 4,
      memory: 5,
      global: 6,
      export: 7,
      start: 8,
      element: 9,
      code: 10,
      data: 11
    },
    magicModuleHeader: [ 0, 97, 115, 109 ],
    moduleVersion: [ 1, 0, 0, 0 ],
    types: {
      func: 96,
      result: 64
    },
    valtypes: valtypes,
    exportTypes: exportTypes,
    blockTypes: blockTypes,
    tableTypes: {
      112: "anyfunc"
    },
    globalTypes: globalTypes,
    importTypes: {
      0: "func",
      1: "table",
      2: "mem",
      3: "global"
    },
    valtypesByString: valtypesByString,
    globalTypesByString: globalTypesByString,
    exportTypesByName: exportTypesByName,
    symbolsByName: invertMap(symbolsByByte, (function(obj) {
      return "string" == typeof obj.object ? "".concat(obj.object, ".").concat(obj.name) : obj.name;
    }))
  };
  function assertNotIdentifierNode(n) {
    if ("Identifier" === n.type) throw new Error("Unsupported node Identifier");
  }
  function encoder_encodeU32(v) {
    var uint8view = new Uint8Array(function(v) {
      return leb.encodeUInt32(v);
    }(v));
    return Array.from(uint8view);
  }
  function encoder_encodeI32(v) {
    var uint8view = new Uint8Array(function(v) {
      return leb.encodeInt32(v);
    }(v));
    return Array.from(uint8view);
  }
  function encoder_encodeI64(v) {
    var uint8view = new Uint8Array(function(v) {
      return leb.encodeInt64(v);
    }(v));
    return Array.from(uint8view);
  }
  function encodeVec(elements) {
    return encoder_encodeU32(elements.length).concat(elements);
  }
  function encodeValtype(v) {
    var byte = esm.valtypesByString[v];
    if (void 0 === byte) throw new Error("Unknown valtype: " + v);
    return parseInt(byte, 10);
  }
  function encodeMutability(v) {
    var byte = esm.globalTypesByString[v];
    if (void 0 === byte) throw new Error("Unknown mutability: " + v);
    return parseInt(byte, 10);
  }
  function encodeUTF8Vec(str) {
    return encodeVec(encode(str));
  }
  function encodeLimits(n) {
    var out = [];
    return "number" == typeof n.max ? (out.push(1), out.push.apply(out, encoder_encodeU32(n.min)), 
    out.push.apply(out, encoder_encodeU32(n.max))) : (out.push(0), out.push.apply(out, encoder_encodeU32(n.min))), 
    out;
  }
  function encodeExpr(instrs) {
    var out = [];
    return instrs.forEach((function(instr) {
      var n = encodeNode(instr);
      out.push.apply(out, n);
    })), out;
  }
  function encodeNode(n) {
    switch (n.type) {
     case "ModuleImport":
      return function(n) {
        var out = [];
        switch (out.push.apply(out, encodeUTF8Vec(n.module)), out.push.apply(out, encodeUTF8Vec(n.name)), 
        n.descr.type) {
         case "GlobalType":
          out.push(3), out.push(encodeValtype(n.descr.valtype)), out.push(encodeMutability(n.descr.mutability));
          break;

         case "Memory":
          out.push(2), out.push.apply(out, encodeLimits(n.descr.limits));
          break;

         case "Table":
          out.push(1), out.push(112), out.push.apply(out, encodeLimits(n.descr.limits));
          break;

         case "FuncImportDescr":
          out.push(0), assertNotIdentifierNode(n.descr.id), out.push.apply(out, encoder_encodeU32(n.descr.id.value));
          break;

         default:
          throw new Error("Unsupport operation: encode module import of type: " + n.descr.type);
        }
        return out;
      }(n);

     case "SectionMetadata":
      return function(n) {
        var out = [], sectionId = esm.sections[n.section];
        if (void 0 === sectionId) throw new Error("Unknown section: " + n.section);
        if ("start" === n.section) throw new Error("Unsupported section encoding of type start");
        return out.push(sectionId), out.push.apply(out, encoder_encodeU32(n.size.value)), 
        out.push.apply(out, encoder_encodeU32(n.vectorOfSize.value)), out;
      }(n);

     case "CallInstruction":
      return function(n) {
        var out = [];
        return assertNotIdentifierNode(n.index), out.push(16), out.push.apply(out, encoder_encodeU32(n.index.value)), 
        out;
      }(n);

     case "CallIndirectInstruction":
      return function(n) {
        var out = [];
        return assertNotIdentifierNode(n.index), out.push(17), out.push.apply(out, encoder_encodeU32(n.index.value)), 
        out.push(0), out;
      }(n);

     case "TypeInstruction":
      return function(n) {
        var out = [ 96 ], params = n.functype.params.map((function(x) {
          return x.valtype;
        })).map(encodeValtype), results = n.functype.results.map(encodeValtype);
        return out.push.apply(out, encodeVec(params)), out.push.apply(out, encodeVec(results)), 
        out;
      }(n);

     case "Instr":
      return function(n) {
        var out = [], instructionName = n.id;
        "string" == typeof n.object && (instructionName = "".concat(n.object, ".").concat(String(n.id)));
        var byteString = esm.symbolsByName[instructionName];
        if (void 0 === byteString) throw new Error("encodeInstr: unknown instruction " + JSON.stringify(instructionName));
        var byte = parseInt(byteString, 10);
        return out.push(byte), n.args && n.args.forEach((function(arg) {
          var encoder = encoder_encodeU32;
          if ("i32" === n.object && (encoder = encoder_encodeI32), "i64" === n.object && (encoder = encoder_encodeI64), 
          "f32" === n.object && (encoder = encodeF32), "f64" === n.object && (encoder = encodeF64), 
          "NumberLiteral" !== arg.type && "FloatLiteral" !== arg.type && "LongNumberLiteral" !== arg.type) throw new Error("Unsupported instruction argument encoding " + JSON.stringify(arg.type));
          out.push.apply(out, encoder(arg.value));
        })), out;
      }(n);

     case "ModuleExport":
      return function(n) {
        var out = [];
        assertNotIdentifierNode(n.descr.id);
        var exportTypeByteString = esm.exportTypesByName[n.descr.exportType];
        if (void 0 === exportTypeByteString) throw new Error("Unknown export of type: " + n.descr.exportType);
        var exportTypeByte = parseInt(exportTypeByteString, 10);
        return out.push.apply(out, encodeUTF8Vec(n.name)), out.push(exportTypeByte), out.push.apply(out, encoder_encodeU32(n.descr.id.value)), 
        out;
      }(n);

     case "Global":
      return function(n) {
        var out = [], _n$globalType = n.globalType, valtype = _n$globalType.valtype, mutability = _n$globalType.mutability;
        return out.push(encodeValtype(valtype)), out.push(encodeMutability(mutability)), 
        out.push.apply(out, encodeExpr(n.init)), out;
      }(n);

     case "Func":
      return function(n) {
        var out = [];
        out.push(-1);
        var localBytes = encodeVec([]);
        out.push.apply(out, localBytes);
        var funcBodyBytes = encodeExpr(n.body);
        return out[0] = funcBodyBytes.length + localBytes.length, out.push.apply(out, funcBodyBytes), 
        out;
      }(n);

     case "IndexInFuncSection":
      return function(n) {
        return assertNotIdentifierNode(n.index), encoder_encodeU32(n.index.value);
      }(n);

     case "StringLiteral":
      return function(n) {
        return encodeUTF8Vec(n.value);
      }(n);

     case "Elem":
      return function(n) {
        var out = [];
        assertNotIdentifierNode(n.table), out.push.apply(out, encoder_encodeU32(n.table.value)), 
        out.push.apply(out, encodeExpr(n.offset));
        var funcs = n.funcs.reduce((function(acc, x) {
          return acc.concat(encoder_encodeU32(x.value));
        }), []);
        return out.push.apply(out, encodeVec(funcs)), out;
      }(n);

     default:
      throw new Error("Unsupported encoding for node of type: " + JSON.stringify(n.type));
    }
  }
  var esm_encodeU32 = encoder_encodeU32;
  function concatUint8Arrays() {
    for (var arrays = Array.prototype.slice.call(arguments), totalLength = arrays.reduce((function(a, b) {
      return a + b.length;
    }), 0), result = new Uint8Array(totalLength), offset = 0, _i = 0; _i < arrays.length; _i++) {
      var arr = arrays[_i];
      if (arr instanceof Uint8Array == !1) throw new Error("arr must be of type Uint8Array");
      result.set(arr, offset), offset += arr.length;
    }
    return result;
  }
  function overrideBytesInBuffer(buffer, startLoc, endLoc, newBytes) {
    var beforeBytes = buffer.slice(0, startLoc), afterBytes = buffer.slice(endLoc, buffer.length);
    return 0 === newBytes.length ? concatUint8Arrays(beforeBytes, afterBytes) : concatUint8Arrays(beforeBytes, Uint8Array.from(newBytes), afterBytes);
  }
  function shrinkPaddedLEB128(ast, uint8Buffer) {
    return Object(external_wasm_ast_.traverse)(ast, {
      SectionMetadata: function(_ref2) {
        var node = _ref2.node, newu32Encoded = esm_encodeU32(node.size.value), newu32EncodedLen = newu32Encoded.length, start = node.size.loc.start.column, end = node.size.loc.end.column, oldu32EncodedLen = end - start;
        if (newu32EncodedLen !== oldu32EncodedLen) {
          var deltaInSizeEncoding = oldu32EncodedLen - newu32EncodedLen;
          uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, end, newu32Encoded), function(ast, _ref, deltaInSizeEncoding) {
            var section = _ref.section, encounteredSection = !1;
            Object(external_wasm_ast_.traverse)(ast, {
              SectionMetadata: function(path) {
                path.node.section !== section ? !0 === encounteredSection && Object(external_wasm_ast_.shiftSection)(ast, path.node, deltaInSizeEncoding) : encounteredSection = !0;
              }
            });
          }(ast, node, -deltaInSizeEncoding);
        }
      }
    }), uint8Buffer;
  }
  var OptimizerError = function(_Error) {
    function OptimizerError(name, initalError) {
      var _this;
      return function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
      }(this, OptimizerError), (_this = function(self, call) {
        if (call && ("object" == typeof call || "function" == typeof call)) return call;
        if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return self;
      }(this, (OptimizerError.__proto__ || Object.getPrototypeOf(OptimizerError)).call(this, "Error while optimizing: " + name + ": " + initalError.message))).stack = initalError.stack, 
      _this;
    }
    return function(subClass, superClass) {
      if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
    }(OptimizerError, Error), OptimizerError;
  }(), decoderOpts = {
    ignoreCodeSection: !0,
    ignoreDataSection: !0
  };
  function createEmptySection(ast, uint8Buffer, section) {
    var start, end, lastSection = function(ast, forSection) {
      for (var lastSection, targetSectionId = esm.sections[forSection], moduleSections = ast.body[0].metadata.sections, lastId = 0, i = 0, len = moduleSections.length; i < len; i++) {
        var section = moduleSections[i];
        if ("custom" !== section.section) {
          var sectionId = esm.sections[section.section];
          if (targetSectionId > lastId && targetSectionId < sectionId) return lastSection;
          lastId = sectionId, lastSection = section;
        }
      }
      return lastSection;
    }(ast, section);
    end = start = null == lastSection || "custom" === lastSection.section ? 8 : lastSection.startOffset + lastSection.size.value + 1;
    var sizeStartLoc = {
      line: -1,
      column: start += 1
    }, sizeEndLoc = {
      line: -1,
      column: start + 1
    }, size = external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(1), sizeEndLoc, sizeStartLoc), vectorOfSizeStartLoc = {
      line: -1,
      column: sizeEndLoc.column
    }, vectorOfSizeEndLoc = {
      line: -1,
      column: sizeEndLoc.column + 1
    }, vectorOfSize = external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(0), vectorOfSizeEndLoc, vectorOfSizeStartLoc), sectionMetadata = external_wasm_ast_.sectionMetadata(section, start, size, vectorOfSize), sectionBytes = encodeNode(sectionMetadata);
    uint8Buffer = overrideBytesInBuffer(uint8Buffer, start - 1, end, sectionBytes), 
    "object" == typeof ast.body[0].metadata && (ast.body[0].metadata.sections.push(sectionMetadata), 
    external_wasm_ast_.sortSectionMetadata(ast.body[0]));
    var deltaBytes = +sectionBytes.length, encounteredSection = !1;
    return external_wasm_ast_.traverse(ast, {
      SectionMetadata: function(path) {
        path.node.section !== section ? !0 === encounteredSection && external_wasm_ast_.shiftSection(ast, path.node, deltaBytes) : encounteredSection = !0;
      }
    }), {
      uint8Buffer: uint8Buffer,
      sectionMetadata: sectionMetadata
    };
  }
  function shiftLocNodeByDelta(node, delta) {
    Object(external_wasm_ast_.assertHasLoc)(node), node.loc.start.column += delta, node.loc.end.column += delta;
  }
  function applyDelete(ast, uint8Buffer, node) {
    if (Object(external_wasm_ast_.assertHasLoc)(node), "start" === getSectionForNode(node)) {
      var sectionMetadata = Object(external_wasm_ast_.getSectionMetadata)(ast, "start");
      return {
        uint8Buffer: uint8Buffer = function(ast, uint8Buffer, section) {
          var sectionMetadatas = Object(external_wasm_ast_.getSectionMetadatas)(ast, section);
          if (0 === sectionMetadatas.length) throw new Error("Section metadata not found");
          return sectionMetadatas.reverse().reduce((function(uint8Buffer, sectionMetadata) {
            var startsIncludingId = sectionMetadata.startOffset - 1, ends = "start" === section ? sectionMetadata.size.loc.end.column + 1 : sectionMetadata.startOffset + sectionMetadata.size.value + 1, delta = -(ends - startsIncludingId), encounteredSection = !1;
            Object(external_wasm_ast_.traverse)(ast, {
              SectionMetadata: function(path) {
                if (path.node.section === section) return encounteredSection = !0, path.remove();
                !0 === encounteredSection && Object(external_wasm_ast_.shiftSection)(ast, path.node, delta);
              }
            });
            return overrideBytesInBuffer(uint8Buffer, startsIncludingId, ends, []);
          }), uint8Buffer);
        }(ast, uint8Buffer, "start"),
        deltaBytes: -(sectionMetadata.size.value + 1),
        deltaElements: -1
      };
    }
    return {
      uint8Buffer: uint8Buffer = overrideBytesInBuffer(uint8Buffer, node.loc.start.column, node.loc.end.column, []),
      deltaBytes: -(node.loc.end.column - node.loc.start.column),
      deltaElements: -1
    };
  }
  function applyOperations(ast, uint8Buffer, ops) {
    return ops.forEach((function(op) {
      var state, sectionName;
      switch (op.kind) {
       case "update":
        state = function(ast, uint8Buffer, _ref) {
          var _ref2 = _ref, oldNode = _ref2[0], newNode = _ref2[1];
          Object(external_wasm_ast_.assertHasLoc)(oldNode);
          var sectionName = getSectionForNode(newNode), replacementByteArray = encodeNode(newNode);
          uint8Buffer = overrideBytesInBuffer(uint8Buffer, oldNode.loc.start.column, oldNode.loc.end.column, replacementByteArray), 
          "code" === sectionName && Object(external_wasm_ast_.traverse)(ast, {
            Func: function(_ref3) {
              var node = _ref3.node;
              if (!0 === (void 0 !== node.body.find((function(n) {
                return n === newNode;
              })))) {
                Object(external_wasm_ast_.assertHasLoc)(node);
                var oldNodeSize = encodeNode(oldNode).length, bodySizeDeltaBytes = replacementByteArray.length - oldNodeSize;
                if (0 !== bodySizeDeltaBytes) {
                  var newValue = node.metadata.bodySize + bodySizeDeltaBytes, newByteArray = esm_encodeU32(newValue), start = node.loc.start.column;
                  uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, start + 1, newByteArray);
                }
              }
            }
          });
          var deltaBytes = replacementByteArray.length - (oldNode.loc.end.column - oldNode.loc.start.column);
          return newNode.loc = {
            start: {
              line: -1,
              column: -1
            },
            end: {
              line: -1,
              column: -1
            }
          }, newNode.loc.start.column = oldNode.loc.start.column, newNode.loc.end.column = oldNode.loc.start.column + replacementByteArray.length, 
          {
            uint8Buffer: uint8Buffer,
            deltaBytes: deltaBytes,
            deltaElements: 0
          };
        }(ast, uint8Buffer, [ op.oldNode, op.node ]), sectionName = getSectionForNode(op.node);
        break;

       case "delete":
        state = applyDelete(ast, uint8Buffer, op.node), sectionName = getSectionForNode(op.node);
        break;

       case "add":
        state = function(ast, uint8Buffer, node) {
          var body, sectionName = getSectionForNode(node), sectionMetadata = Object(external_wasm_ast_.getSectionMetadata)(ast, sectionName);
          if (void 0 === sectionMetadata) {
            var res = createEmptySection(ast, uint8Buffer, sectionName);
            uint8Buffer = res.uint8Buffer, sectionMetadata = res.sectionMetadata;
          }
          if (Object(external_wasm_ast_.isFunc)(node) && (0 === (body = node.body).length || "end" !== body[body.length - 1].id)) throw new Error("expressions must be ended");
          if (Object(external_wasm_ast_.isGlobal)(node) && (0 === (body = node.init).length || "end" !== body[body.length - 1].id)) throw new Error("expressions must be ended");
          var newByteArray = encodeNode(node), start = Object(external_wasm_ast_.getEndOfSection)(sectionMetadata), end = start, deltaBytes = newByteArray.length;
          if (uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, end, newByteArray), 
          node.loc = {
            start: {
              line: -1,
              column: start
            },
            end: {
              line: -1,
              column: start + deltaBytes
            }
          }, "Func" === node.type) {
            var bodySize = newByteArray[0];
            node.metadata = {
              bodySize: bodySize
            };
          }
          return "IndexInFuncSection" !== node.type && Object(external_wasm_ast_.orderedInsertNode)(ast.body[0], node), 
          {
            uint8Buffer: uint8Buffer,
            deltaBytes: deltaBytes,
            deltaElements: 1
          };
        }(ast, uint8Buffer, op.node), sectionName = getSectionForNode(op.node);
        break;

       default:
        throw new Error("Unknown operation");
      }
      if (0 !== state.deltaElements && "start" !== sectionName) {
        var oldBufferLength = state.uint8Buffer.length;
        state.uint8Buffer = function(ast, uint8Buffer, section, deltaElements) {
          var sectionMetadata = Object(external_wasm_ast_.getSectionMetadata)(ast, section);
          if (void 0 === sectionMetadata) throw new Error("Section metadata not found");
          if (void 0 === sectionMetadata.vectorOfSize.loc) throw new Error("SectionMetadata " + section + " has no loc");
          if (-1 === sectionMetadata.vectorOfSize.value) return uint8Buffer;
          var start = sectionMetadata.vectorOfSize.loc.start.column, end = sectionMetadata.vectorOfSize.loc.end.column, newValue = sectionMetadata.vectorOfSize.value + deltaElements, newBytes = esm_encodeU32(newValue);
          return sectionMetadata.vectorOfSize.value = newValue, sectionMetadata.vectorOfSize.loc.end.column = start + newBytes.length, 
          overrideBytesInBuffer(uint8Buffer, start, end, newBytes);
        }(ast, state.uint8Buffer, sectionName, state.deltaElements), state.deltaBytes += state.uint8Buffer.length - oldBufferLength;
      }
      if (0 !== state.deltaBytes && "start" !== sectionName) {
        var _oldBufferLength = state.uint8Buffer.length;
        state.uint8Buffer = function(ast, uint8Buffer, section, deltaBytes) {
          var sectionMetadata = Object(external_wasm_ast_.getSectionMetadata)(ast, section);
          if (void 0 === sectionMetadata) throw new Error("Section metadata not found");
          if (void 0 === sectionMetadata.size.loc) throw new Error("SectionMetadata " + section + " has no loc");
          var start = sectionMetadata.size.loc.start.column, end = sectionMetadata.size.loc.end.column, newSectionSize = sectionMetadata.size.value + deltaBytes, newBytes = esm_encodeU32(newSectionSize);
          sectionMetadata.size.value = newSectionSize;
          var oldu32EncodedLen = end - start, newu32EncodedLen = newBytes.length;
          if (newu32EncodedLen !== oldu32EncodedLen) {
            var deltaInSizeEncoding = newu32EncodedLen - oldu32EncodedLen;
            sectionMetadata.size.loc.end.column = start + newu32EncodedLen, deltaBytes += deltaInSizeEncoding, 
            sectionMetadata.vectorOfSize.loc.start.column += deltaInSizeEncoding, sectionMetadata.vectorOfSize.loc.end.column += deltaInSizeEncoding;
          }
          var encounteredSection = !1;
          return Object(external_wasm_ast_.traverse)(ast, {
            SectionMetadata: function(path) {
              path.node.section !== section ? !0 === encounteredSection && Object(external_wasm_ast_.shiftSection)(ast, path.node, deltaBytes) : encounteredSection = !0;
            }
          }), overrideBytesInBuffer(uint8Buffer, start, end, newBytes);
        }(ast, state.uint8Buffer, sectionName, state.deltaBytes), state.deltaBytes += state.uint8Buffer.length - _oldBufferLength;
      }
      0 !== state.deltaBytes && ops.forEach((function(op) {
        switch (op.kind) {
         case "update":
          shiftLocNodeByDelta(op.oldNode, state.deltaBytes);
          break;

         case "delete":
          shiftLocNodeByDelta(op.node, state.deltaBytes);
        }
      })), uint8Buffer = state.uint8Buffer;
    })), uint8Buffer;
  }
  function hashNode(node) {
    return JSON.stringify(node);
  }
  function preprocess(ab) {
    return function(uint8Buffer) {
      try {
        return shrinkPaddedLEB128(Object(external_wasm_parser_.decode)(uint8Buffer.buffer, decoderOpts), uint8Buffer);
      } catch (e) {
        throw new OptimizerError("shrinkPaddedLEB128", e);
      }
    }(new Uint8Array(ab)).buffer;
  }
  function edit(ab, visitors) {
    return ab = preprocess(ab), editWithAST(Object(external_wasm_parser_.decode)(ab), ab, visitors);
  }
  function editWithAST(ast, ab, visitors) {
    var nodeBefore, operations = [], uint8Buffer = new Uint8Array(ab);
    return Object(external_wasm_ast_.traverse)(ast, visitors, (function(type, path) {
      nodeBefore = Object(external_wasm_ast_.cloneNode)(path.node);
    }), (function(type, path) {
      !0 === path.node._deleted ? operations.push({
        kind: "delete",
        node: path.node
      }) : hashNode(nodeBefore) !== hashNode(path.node) && operations.push({
        kind: "update",
        oldNode: nodeBefore,
        node: path.node
      });
    })), (uint8Buffer = applyOperations(ast, uint8Buffer, operations)).buffer;
  }
  function add(ab, newNodes) {
    return ab = preprocess(ab), addWithAST(Object(external_wasm_parser_.decode)(ab), ab, newNodes);
  }
  function addWithAST(ast, ab, newNodes) {
    !function(nodes) {
      var originalOrder = new Map;
      for (var _node of nodes) originalOrder.set(_node, originalOrder.size);
      nodes.sort((function(a, b) {
        var sectionA = getSectionForNode(a), sectionB = getSectionForNode(b), aId = esm.sections[sectionA], bId = esm.sections[sectionB];
        if ("number" != typeof aId || "number" != typeof bId) throw new Error("Section id not found");
        return aId === bId ? originalOrder.get(a) - originalOrder.get(b) : aId - bId;
      }));
    }(newNodes);
    var uint8Buffer = new Uint8Array(ab);
    return (uint8Buffer = applyOperations(ast, uint8Buffer, newNodes.map((function(n) {
      return {
        kind: "add",
        node: n
      };
    })))).buffer;
  }
} ]));
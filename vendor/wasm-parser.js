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
  return __webpack_require__.d = function(exports, name, getter) {
    __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
      enumerable: !0,
      get: getter
    });
  }, __webpack_require__.r = function(exports) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(exports, "__esModule", {
      value: !0
    });
  }, __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }, __webpack_require__(1);
}([ function(module, exports) {
  module.exports = require("./wasm-ast");
}, function(module, __webpack_exports__, __webpack_require__) {
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
  }
  function _possibleConstructorReturn(self, call) {
    if (call && ("object" == typeof call || "function" == typeof call)) return call;
    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
  }
  function _inherits(subClass, superClass) {
    if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function");
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
  }
  __webpack_require__.r(__webpack_exports__), __webpack_require__.d(__webpack_exports__, "decode", (function() {
    return esm_decode;
  }));
  var CompileError = function(_Error2) {
    function CompileError() {
      return _classCallCheck(this, CompileError), _possibleConstructorReturn(this, (CompileError.__proto__ || Object.getPrototypeOf(CompileError)).apply(this, arguments));
    }
    return _inherits(CompileError, Error), CompileError;
  }();
  function read(buffer, offset, isLE, mLen, nBytes) {
    var e, m, eLen = 8 * nBytes - mLen - 1, eMax = (1 << eLen) - 1, eBias = eMax >> 1, nBits = -7, i = isLE ? nBytes - 1 : 0, d = isLE ? -1 : 1, s = buffer[offset + i];
    for (i += d, e = s & (1 << -nBits) - 1, s >>= -nBits, nBits += eLen; nBits > 0; e = 256 * e + buffer[offset + i], 
    i += d, nBits -= 8) ;
    for (m = e & (1 << -nBits) - 1, e >>= -nBits, nBits += mLen; nBits > 0; m = 256 * m + buffer[offset + i], 
    i += d, nBits -= 8) ;
    if (0 === e) e = 1 - eBias; else {
      if (e === eMax) return m ? NaN : 1 / 0 * (s ? -1 : 1);
      m += Math.pow(2, mLen), e -= eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
  }
  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }
  function con(b) {
    if (128 == (192 & b)) return 63 & b;
    throw new Error("invalid UTF-8 encoding");
  }
  function decoder_code(min, n) {
    if (n < min || 55296 <= n && n < 57344 || n >= 65536) throw new Error("invalid UTF-8 encoding");
    return n;
  }
  function decode(bytes) {
    return function _decode(bytes) {
      if (0 === bytes.length) return [];
      var _bytes = _toArray(bytes), b1 = _bytes[0], bs = _bytes.slice(1);
      if (b1 < 128) return [ decoder_code(0, b1) ].concat(_decode(bs));
      if (b1 < 192) throw new Error("invalid UTF-8 encoding");
      var _bytes2 = _toArray(bytes), _b = _bytes2[0], b2 = _bytes2[1], _bs = _bytes2.slice(2);
      if (_b < 224) return [ decoder_code(128, ((31 & _b) << 6) + con(b2)) ].concat(_decode(_bs));
      var _bytes3 = _toArray(bytes), _b2 = _bytes3[0], _b3 = _bytes3[1], b3 = _bytes3[2], _bs2 = _bytes3.slice(3);
      if (_b2 < 240) return [ decoder_code(2048, ((15 & _b2) << 12) + (con(_b3) << 6) + con(b3)) ].concat(_decode(_bs2));
      var _bytes4 = _toArray(bytes), _b4 = _bytes4[0], _b5 = _bytes4[1], _b6 = _bytes4[2], b4 = _bytes4[3], _bs3 = _bytes4.slice(4);
      if (_b4 < 248) return [ decoder_code(65536, (((7 & _b4) << 18) + con(_b5) << 12) + (con(_b6) << 6) + con(b4)) ].concat(_decode(_bs3));
      throw new Error("invalid UTF-8 encoding");
    }(bytes).map((function(x) {
      return String.fromCharCode(x);
    })).join("");
  }
  var external_wasm_ast_ = __webpack_require__(0), wasm = null;
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
  function esm_decodeUInt32(encodedBuffer, index) {
    return leb.decodeUInt32(encodedBuffer, index);
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
  function toHex(n) {
    return "0x" + Number(n).toString(16);
  }
  function byteArrayEq(l, r) {
    if (l.length !== r.length) return !1;
    for (var i = 0; i < l.length; i++) if (l[i] !== r[i]) return !1;
    return !0;
  }
  function decoder_decode(ab, opts) {
    var buf = new Uint8Array(ab), getUniqueName = external_wasm_ast_.getUniqueNameGenerator(), offset = 0;
    function getPosition() {
      return {
        line: -1,
        column: offset
      };
    }
    function dump(b, msg) {
      if (!1 !== opts.dump) {
        var str = "";
        str = b.length < 5 ? b.map(toHex).join(" ") : "...", console.log(toHex(offset) + ":\t", str, "\t\t\t\t\t\t\t\t\t\t", ";", msg);
      }
    }
    function dumpSep(msg) {
      !1 !== opts.dump && console.log(";", msg);
    }
    var state = {
      elementsInFuncSection: [],
      elementsInExportSection: [],
      elementsInCodeSection: [],
      memoriesInModule: [],
      typesInModule: [],
      functionsInModule: [],
      tablesInModule: [],
      globalsInModule: []
    };
    function isEOF() {
      return offset >= buf.length;
    }
    function eatBytes(n) {
      offset += n;
    }
    function readBytesAtOffset(_offset, numberOfBytes) {
      for (var arr = [], i = 0; i < numberOfBytes; i++) arr.push(buf[_offset + i]);
      return arr;
    }
    function readBytes(numberOfBytes) {
      return readBytesAtOffset(offset, numberOfBytes);
    }
    function readF64() {
      var bytes = readBytes(8), value = function(bytes) {
        return read(Buffer.from(bytes), 0, !0, 52, 8);
      }(bytes);
      if (Math.sign(value) * value == 1 / 0) return {
        value: Math.sign(value),
        inf: !0,
        nextIndex: 8
      };
      if (isNaN(value)) {
        for (var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1, mantissa = 0, i = 0; i < bytes.length - 2; ++i) mantissa += bytes[i] * Math.pow(256, i);
        return {
          value: sign * (mantissa += bytes[bytes.length - 2] % 16 * Math.pow(256, bytes.length - 2)),
          nan: !0,
          nextIndex: 8
        };
      }
      return {
        value: value,
        nextIndex: 8
      };
    }
    function readF32() {
      var bytes = readBytes(4), value = function(bytes) {
        return read(Buffer.from(bytes), 0, !0, 23, 4);
      }(bytes);
      if (Math.sign(value) * value == 1 / 0) return {
        value: Math.sign(value),
        inf: !0,
        nextIndex: 4
      };
      if (isNaN(value)) {
        for (var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1, mantissa = 0, i = 0; i < bytes.length - 2; ++i) mantissa += bytes[i] * Math.pow(256, i);
        return {
          value: sign * (mantissa += bytes[bytes.length - 2] % 128 * Math.pow(256, bytes.length - 2)),
          nan: !0,
          nextIndex: 4
        };
      }
      return {
        value: value,
        nextIndex: 4
      };
    }
    function readUTF8String() {
      var lenu32 = readU32(), strlen = lenu32.value;
      return dump([ strlen ], "string length"), {
        value: decode(readBytesAtOffset(offset + lenu32.nextIndex, strlen)),
        nextIndex: strlen + lenu32.nextIndex
      };
    }
    function readU32() {
      var bytes = readBytes(5);
      return esm_decodeUInt32(Buffer.from(bytes));
    }
    function readVaruint32() {
      var bytes = readBytes(4);
      return esm_decodeUInt32(Buffer.from(bytes));
    }
    function read32() {
      var encodedBuffer, index, bytes = readBytes(5), buffer = Buffer.from(bytes);
      return encodedBuffer = buffer, leb.decodeInt32(encodedBuffer, index);
    }
    function read64() {
      var encodedBuffer, index, bytes = readBytes(10), buffer = Buffer.from(bytes);
      return encodedBuffer = buffer, leb.decodeInt64(encodedBuffer, index);
    }
    function readU64() {
      var encodedBuffer, index, bytes = readBytes(10), buffer = Buffer.from(bytes);
      return encodedBuffer = buffer, leb.decodeUInt64(encodedBuffer, index);
    }
    function readByte() {
      return readBytes(1)[0];
    }
    function parseVec(cast) {
      var u32 = readU32(), length = u32.value;
      if (eatBytes(u32.nextIndex), dump([ length ], "number"), 0 === length) return [];
      for (var elements = [], i = 0; i < length; i++) {
        var byte = readByte();
        eatBytes(1);
        var value = cast(byte);
        if (dump([ byte ], value), void 0 === value) throw new CompileError("Internal failure: parseVec could not cast the value");
        elements.push(value);
      }
      return elements;
    }
    function parseInstructionBlock(code) {
      for (;;) {
        var _startLoc6 = getPosition(), instructionAlreadyCreated = !1, instructionByte = readByte();
        if (eatBytes(1), 254 === instructionByte) throw new CompileError("Atomic instructions are not implemented");
        var instruction = esm.symbolsByByte[instructionByte];
        if (void 0 === instruction) throw new CompileError("Unexpected instruction: " + toHex(instructionByte));
        if ("string" == typeof instruction.object ? dump([ instructionByte ], "".concat(instruction.object, ".").concat(instruction.name)) : dump([ instructionByte ], instruction.name), 
        "end" === instruction.name) {
          var node = (endLoc = void 0, endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.instruction(instruction.name), endLoc, _startLoc6));
          code.push(node);
          break;
        }
        var args = [];
        if ("loop" === instruction.name) {
          var _startLoc7 = getPosition(), blocktypeByte = readByte();
          eatBytes(1);
          var blocktype = esm.blockTypes[blocktypeByte];
          if (dump([ blocktypeByte ], "blocktype"), void 0 === blocktype) throw new CompileError("Unexpected blocktype: " + toHex(blocktypeByte));
          var instr = [];
          parseInstructionBlock(instr);
          var label = external_wasm_ast_.withRaw(external_wasm_ast_.identifier(getUniqueName("loop")), ""), loopNode = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.loopInstruction(label, blocktype, instr), endLoc, _startLoc7);
          }();
          code.push(loopNode), instructionAlreadyCreated = !0;
        } else if ("if" === instruction.name) {
          var _startLoc8 = getPosition(), _blocktypeByte = readByte();
          eatBytes(1);
          var _blocktype = esm.blockTypes[_blocktypeByte];
          if (dump([ _blocktypeByte ], "blocktype"), void 0 === _blocktype) throw new CompileError("Unexpected blocktype: " + toHex(_blocktypeByte));
          var testIndex = external_wasm_ast_.withRaw(external_wasm_ast_.identifier(getUniqueName("if")), ""), ifBody = [];
          parseInstructionBlock(ifBody);
          var elseIndex = 0;
          for (elseIndex = 0; elseIndex < ifBody.length; ++elseIndex) {
            var _instr = ifBody[elseIndex];
            if ("Instr" === _instr.type && "else" === _instr.id) break;
          }
          var consequentInstr = ifBody.slice(0, elseIndex), alternate = ifBody.slice(elseIndex + 1), testInstrs = [], ifNode = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.ifInstruction(testIndex, testInstrs, _blocktype, consequentInstr, alternate), endLoc, _startLoc8);
          }();
          code.push(ifNode), instructionAlreadyCreated = !0;
        } else if ("block" === instruction.name) {
          var _startLoc9 = getPosition(), _blocktypeByte2 = readByte();
          eatBytes(1);
          var _blocktype2 = esm.blockTypes[_blocktypeByte2];
          if (dump([ _blocktypeByte2 ], "blocktype"), void 0 === _blocktype2) throw new CompileError("Unexpected blocktype: " + toHex(_blocktypeByte2));
          var _instr2 = [];
          parseInstructionBlock(_instr2);
          var _label = external_wasm_ast_.withRaw(external_wasm_ast_.identifier(getUniqueName("block")), ""), blockNode = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.blockInstruction(_label, _instr2, _blocktype2), endLoc, _startLoc9);
          }();
          code.push(blockNode), instructionAlreadyCreated = !0;
        } else if ("call" === instruction.name) {
          var indexu32 = readU32(), index = indexu32.value;
          eatBytes(indexu32.nextIndex), dump([ index ], "index");
          var callNode = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.callInstruction(external_wasm_ast_.indexLiteral(index)), endLoc, _startLoc6);
          }();
          code.push(callNode), instructionAlreadyCreated = !0;
        } else if ("call_indirect" === instruction.name) {
          var _startLoc10 = getPosition(), indexU32 = readU32(), typeindex = indexU32.value;
          eatBytes(indexU32.nextIndex), dump([ typeindex ], "type index");
          var signature = state.typesInModule[typeindex];
          if (void 0 === signature) throw new CompileError("call_indirect signature not found (".concat(typeindex, ")"));
          var _callNode = external_wasm_ast_.callIndirectInstruction(external_wasm_ast_.signature(signature.params, signature.result), []), flagU32 = readU32(), flag = flagU32.value;
          if (eatBytes(flagU32.nextIndex), 0 !== flag) throw new CompileError("zero flag expected");
          code.push(function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(_callNode, endLoc, _startLoc10);
          }()), instructionAlreadyCreated = !0;
        } else if ("br_table" === instruction.name) {
          var indicesu32 = readU32(), indices = indicesu32.value;
          eatBytes(indicesu32.nextIndex), dump([ indices ], "num indices");
          for (var i = 0; i <= indices; i++) {
            var _indexu = readU32(), _index = _indexu.value;
            eatBytes(_indexu.nextIndex), dump([ _index ], "index"), args.push(external_wasm_ast_.numberLiteralFromRaw(_indexu.value.toString(), "u32"));
          }
        } else if (instructionByte >= 40 && instructionByte <= 64) if ("grow_memory" === instruction.name || "current_memory" === instruction.name) {
          var _indexU = readU32(), _index2 = _indexU.value;
          if (eatBytes(_indexU.nextIndex), 0 !== _index2) throw new Error("zero flag expected");
          dump([ _index2 ], "index");
        } else {
          var aligun32 = readU32(), align = aligun32.value;
          eatBytes(aligun32.nextIndex), dump([ align ], "align");
          var offsetu32 = readU32(), _offset2 = offsetu32.value;
          eatBytes(offsetu32.nextIndex), dump([ _offset2 ], "offset");
        } else if (instructionByte >= 65 && instructionByte <= 68) {
          if ("i32" === instruction.object) {
            var value32 = read32(), value = value32.value;
            eatBytes(value32.nextIndex), dump([ value ], "i32 value"), args.push(external_wasm_ast_.numberLiteralFromRaw(value));
          }
          if ("u32" === instruction.object) {
            var valueu32 = readU32(), _value = valueu32.value;
            eatBytes(valueu32.nextIndex), dump([ _value ], "u32 value"), args.push(external_wasm_ast_.numberLiteralFromRaw(_value));
          }
          if ("i64" === instruction.object) {
            var value64 = read64(), _value2 = value64.value;
            eatBytes(value64.nextIndex), dump([ Number(_value2.toString()) ], "i64 value");
            var _node = {
              type: "LongNumberLiteral",
              value: {
                high: _value2.high,
                low: _value2.low
              }
            };
            args.push(_node);
          }
          if ("u64" === instruction.object) {
            var valueu64 = readU64(), _value3 = valueu64.value;
            eatBytes(valueu64.nextIndex), dump([ Number(_value3.toString()) ], "u64 value");
            var _node2 = {
              type: "LongNumberLiteral",
              value: {
                high: _value3.high,
                low: _value3.low
              }
            };
            args.push(_node2);
          }
          if ("f32" === instruction.object) {
            var valuef32 = readF32(), _value4 = valuef32.value;
            eatBytes(valuef32.nextIndex), dump([ _value4 ], "f32 value"), args.push(external_wasm_ast_.floatLiteral(_value4, valuef32.nan, valuef32.inf, String(_value4)));
          }
          if ("f64" === instruction.object) {
            var valuef64 = readF64(), _value5 = valuef64.value;
            eatBytes(valuef64.nextIndex), dump([ _value5 ], "f64 value"), args.push(external_wasm_ast_.floatLiteral(_value5, valuef64.nan, valuef64.inf, String(_value5)));
          }
        } else for (var _i3 = 0; _i3 < instruction.numberOfArgs; _i3++) {
          var u32 = readU32();
          eatBytes(u32.nextIndex), dump([ u32.value ], "argument " + _i3), args.push(external_wasm_ast_.numberLiteralFromRaw(u32.value));
        }
        if (!1 === instructionAlreadyCreated) if ("string" == typeof instruction.object) {
          var _node3 = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.objectInstruction(instruction.name, instruction.object, args), endLoc, _startLoc6);
          }();
          code.push(_node3);
        } else {
          var _node4 = function() {
            var endLoc = getPosition();
            return external_wasm_ast_.withLoc(external_wasm_ast_.instruction(instruction.name, args), endLoc, _startLoc6);
          }();
          code.push(_node4);
        }
      }
      var endLoc;
    }
    function parseLimits() {
      var min, max, limitType = readByte();
      if (eatBytes(1), dump([ limitType ], "limit type"), 1 === limitType || 3 === limitType) {
        var u32min = readU32();
        min = parseInt(u32min.value), eatBytes(u32min.nextIndex), dump([ min ], "min");
        var u32max = readU32();
        max = parseInt(u32max.value), eatBytes(u32max.nextIndex), dump([ max ], "max");
      }
      if (0 === limitType) {
        var _u32min = readU32();
        min = parseInt(_u32min.value), eatBytes(_u32min.nextIndex), dump([ min ], "min");
      }
      return external_wasm_ast_.limit(min, max);
    }
    function parseTableType(index) {
      var name = external_wasm_ast_.withRaw(external_wasm_ast_.identifier(getUniqueName("table")), String(index)), elementTypeByte = readByte();
      eatBytes(1), dump([ elementTypeByte ], "element type");
      var elementType = esm.tableTypes[elementTypeByte];
      if (void 0 === elementType) throw new CompileError("Unknown element type in table: " + toHex(elementType));
      var limits = parseLimits();
      return external_wasm_ast_.table(elementType, limits, name);
    }
    function parseGlobalType() {
      var valtypeByte = readByte();
      eatBytes(1);
      var type = esm.valtypes[valtypeByte];
      if (dump([ valtypeByte ], type), void 0 === type) throw new CompileError("Unknown valtype: " + toHex(valtypeByte));
      var globalTypeByte = readByte();
      eatBytes(1);
      var globalType = esm.globalTypes[globalTypeByte];
      if (dump([ globalTypeByte ], "global type (".concat(globalType, ")")), void 0 === globalType) throw new CompileError("Invalid mutability: " + toHex(globalTypeByte));
      return external_wasm_ast_.globalType(type, globalType);
    }
    function parseNameSectionFunctions() {
      var functionNames = [], numberOfFunctionsu32 = readU32(), numbeOfFunctions = numberOfFunctionsu32.value;
      eatBytes(numberOfFunctionsu32.nextIndex);
      for (var i = 0; i < numbeOfFunctions; i++) {
        var indexu32 = readU32(), index = indexu32.value;
        eatBytes(indexu32.nextIndex);
        var name = readUTF8String();
        eatBytes(name.nextIndex), functionNames.push(external_wasm_ast_.functionNameMetadata(name.value, index));
      }
      return functionNames;
    }
    function parseNameSectionLocals() {
      var localNames = [], numbeOfFunctionsu32 = readU32(), numbeOfFunctions = numbeOfFunctionsu32.value;
      eatBytes(numbeOfFunctionsu32.nextIndex);
      for (var i = 0; i < numbeOfFunctions; i++) {
        var functionIndexu32 = readU32(), functionIndex = functionIndexu32.value;
        eatBytes(functionIndexu32.nextIndex);
        var numLocalsu32 = readU32(), numLocals = numLocalsu32.value;
        eatBytes(numLocalsu32.nextIndex);
        for (var _i4 = 0; _i4 < numLocals; _i4++) {
          var localIndexu32 = readU32(), localIndex = localIndexu32.value;
          eatBytes(localIndexu32.nextIndex);
          var name = readUTF8String();
          eatBytes(name.nextIndex), localNames.push(external_wasm_ast_.localNameMetadata(name.value, localIndex, functionIndex));
        }
      }
      return localNames;
    }
    function parseMemoryType(i) {
      var limits = parseLimits();
      return external_wasm_ast_.memory(limits, external_wasm_ast_.indexLiteral(i));
    }
    function parseStartSection() {
      var endLoc, startLoc = getPosition(), u32 = readU32(), startFuncIndex = u32.value;
      return eatBytes(u32.nextIndex), dump([ startFuncIndex ], "index"), endLoc = getPosition(), 
      external_wasm_ast_.withLoc(external_wasm_ast_.start(external_wasm_ast_.indexLiteral(startFuncIndex)), endLoc, startLoc);
    }
    function parseSection(sectionIndex) {
      var sectionId = readByte();
      if (eatBytes(1), sectionId >= sectionIndex || sectionIndex === esm.sections.custom) sectionIndex = sectionId + 1; else if (sectionId !== esm.sections.custom) throw new CompileError("Unexpected section: " + toHex(sectionId));
      var nextSectionIndex = sectionIndex, startOffset = offset, startLoc = getPosition(), u32 = readU32(), sectionSizeInBytes = u32.value;
      eatBytes(u32.nextIndex);
      var endLoc, sectionSizeInBytesNode = (endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(sectionSizeInBytes), endLoc, startLoc));
      switch (sectionId) {
       case esm.sections.type:
        dumpSep("section Type"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc13 = getPosition(), _u = readU32(), numberOfTypes = _u.value;
        eatBytes(_u.nextIndex);
        var _metadata = external_wasm_ast_.sectionMetadata("type", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfTypes), endLoc, _startLoc13);
        }());
        return {
          nodes: function(numberOfTypes) {
            var endLoc, typeInstructionNodes = [];
            dump([ numberOfTypes ], "num types");
            for (var i = 0; i < numberOfTypes; i++) {
              var _startLoc = getPosition();
              dumpSep("type " + i);
              var type = readByte();
              if (eatBytes(1), type != esm.types.func) throw new Error("Unsupported type: " + toHex(type));
              dump([ type ], "func");
              var params = parseVec((function(b) {
                return esm.valtypes[b];
              })).map((function(v) {
                return external_wasm_ast_.funcParam(v);
              })), result = parseVec((function(b) {
                return esm.valtypes[b];
              }));
              typeInstructionNodes.push((endLoc = void 0, endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.typeInstruction(void 0, external_wasm_ast_.signature(params, result)), endLoc, _startLoc))), 
              state.typesInModule.push({
                params: params,
                result: result
              });
            }
            return typeInstructionNodes;
          }(numberOfTypes),
          metadata: _metadata,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.table:
        dumpSep("section Table"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc14 = getPosition(), _u2 = readU32(), numberOfTable = _u2.value;
        eatBytes(_u2.nextIndex), dump([ numberOfTable ], "num tables");
        var _metadata2 = external_wasm_ast_.sectionMetadata("table", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfTable), endLoc, _startLoc14);
        }());
        return {
          nodes: function(numberOfElements) {
            var tables = [];
            dump([ numberOfElements ], "num elements");
            for (var i = 0; i < numberOfElements; i++) {
              var tablesNode = parseTableType(i);
              state.tablesInModule.push(tablesNode), tables.push(tablesNode);
            }
            return tables;
          }(numberOfTable),
          metadata: _metadata2,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.import:
        dumpSep("section Import"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc15 = getPosition(), numberOfImportsu32 = readU32(), numberOfImports = numberOfImportsu32.value;
        eatBytes(numberOfImportsu32.nextIndex), dump([ numberOfImports ], "number of imports");
        var _metadata3 = external_wasm_ast_.sectionMetadata("import", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfImports), endLoc, _startLoc15);
        }());
        return {
          nodes: function(numberOfImports) {
            for (var endLoc, imports = [], i = 0; i < numberOfImports; i++) {
              dumpSep("import header " + i);
              var _startLoc2 = getPosition(), moduleName = readUTF8String();
              eatBytes(moduleName.nextIndex), dump([], "module name (".concat(moduleName.value, ")"));
              var name = readUTF8String();
              eatBytes(name.nextIndex), dump([], "name (".concat(name.value, ")"));
              var descrTypeByte = readByte();
              eatBytes(1);
              var descrType = esm.importTypes[descrTypeByte];
              if (dump([ descrTypeByte ], "import kind"), void 0 === descrType) throw new CompileError("Unknown import description type: " + toHex(descrTypeByte));
              var importDescr = void 0;
              if ("func" === descrType) {
                var indexU32 = readU32(), typeindex = indexU32.value;
                eatBytes(indexU32.nextIndex), dump([ typeindex ], "type index");
                var signature = state.typesInModule[typeindex];
                if (void 0 === signature) throw new CompileError("function signature not found (".concat(typeindex, ")"));
                var id = getUniqueName("func");
                importDescr = external_wasm_ast_.funcImportDescr(id, external_wasm_ast_.signature(signature.params, signature.result)), 
                state.functionsInModule.push({
                  id: external_wasm_ast_.identifier(name.value),
                  signature: signature,
                  isExternal: !0
                });
              } else if ("global" === descrType) {
                importDescr = parseGlobalType();
                var globalNode = external_wasm_ast_.global(importDescr, []);
                state.globalsInModule.push(globalNode);
              } else if ("table" === descrType) importDescr = parseTableType(i); else {
                if ("mem" !== descrType) throw new CompileError("Unsupported import of type: " + descrType);
                var memoryNode = parseMemoryType(0);
                state.memoriesInModule.push(memoryNode), importDescr = memoryNode;
              }
              imports.push((endLoc = void 0, endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.moduleImport(moduleName.value, name.value, importDescr), endLoc, _startLoc2)));
            }
            return imports;
          }(numberOfImports),
          metadata: _metadata3,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.func:
        dumpSep("section Function"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc16 = getPosition(), numberOfFunctionsu32 = readU32(), numberOfFunctions = numberOfFunctionsu32.value;
        eatBytes(numberOfFunctionsu32.nextIndex);
        var _metadata4 = external_wasm_ast_.sectionMetadata("func", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfFunctions), endLoc, _startLoc16);
        }());
        !function(numberOfFunctions) {
          dump([ numberOfFunctions ], "num funcs");
          for (var i = 0; i < numberOfFunctions; i++) {
            var indexU32 = readU32(), typeindex = indexU32.value;
            eatBytes(indexU32.nextIndex), dump([ typeindex ], "type index");
            var signature = state.typesInModule[typeindex];
            if (void 0 === signature) throw new CompileError("function signature not found (".concat(typeindex, ")"));
            var id = external_wasm_ast_.withRaw(external_wasm_ast_.identifier(getUniqueName("func")), "");
            state.functionsInModule.push({
              id: id,
              signature: signature,
              isExternal: !1
            });
          }
        }(numberOfFunctions);
        return {
          nodes: [],
          metadata: _metadata4,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.export:
        dumpSep("section Export"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc17 = getPosition(), _u3 = readU32(), numberOfExport = _u3.value;
        eatBytes(_u3.nextIndex);
        var _metadata5 = external_wasm_ast_.sectionMetadata("export", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfExport), endLoc, _startLoc17);
        }());
        !function(numberOfExport) {
          dump([ numberOfExport ], "num exports");
          for (var i = 0; i < numberOfExport; i++) {
            var _startLoc3 = getPosition(), name = readUTF8String();
            eatBytes(name.nextIndex), dump([], "export name (".concat(name.value, ")"));
            var typeIndex = readByte();
            eatBytes(1), dump([ typeIndex ], "export kind");
            var indexu32 = readU32(), index = indexu32.value;
            eatBytes(indexu32.nextIndex), dump([ index ], "export index");
            var id = void 0, signature = void 0;
            if ("Func" === esm.exportTypes[typeIndex]) {
              var func = state.functionsInModule[index];
              if (void 0 === func) throw new CompileError("unknown function (".concat(index, ")"));
              id = external_wasm_ast_.numberLiteralFromRaw(index, String(index)), signature = func.signature;
            } else if ("Table" === esm.exportTypes[typeIndex]) {
              if (void 0 === state.tablesInModule[index]) throw new CompileError("unknown table ".concat(index));
              id = external_wasm_ast_.numberLiteralFromRaw(index, String(index)), signature = null;
            } else if ("Mem" === esm.exportTypes[typeIndex]) {
              if (void 0 === state.memoriesInModule[index]) throw new CompileError("unknown memory ".concat(index));
              id = external_wasm_ast_.numberLiteralFromRaw(index, String(index)), signature = null;
            } else {
              if ("Global" !== esm.exportTypes[typeIndex]) return void console.warn("Unsupported export type: " + toHex(typeIndex));
              if (void 0 === state.globalsInModule[index]) throw new CompileError("unknown global ".concat(index));
              id = external_wasm_ast_.numberLiteralFromRaw(index, String(index)), signature = null;
            }
            var endLoc = getPosition();
            state.elementsInExportSection.push({
              name: name.value,
              type: esm.exportTypes[typeIndex],
              signature: signature,
              id: id,
              index: index,
              endLoc: endLoc,
              startLoc: _startLoc3
            });
          }
        }(numberOfExport);
        return {
          nodes: [],
          metadata: _metadata5,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.code:
        dumpSep("section Code"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc18 = getPosition(), _u4 = readU32(), numberOfFuncs = _u4.value;
        eatBytes(_u4.nextIndex);
        var _metadata6 = external_wasm_ast_.sectionMetadata("code", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfFuncs), endLoc, _startLoc18);
        }());
        if (!0 === opts.ignoreCodeSection) eatBytes(sectionSizeInBytes - _u4.nextIndex); else !function(numberOfFuncs) {
          dump([ numberOfFuncs ], "number functions");
          for (var i = 0; i < numberOfFuncs; i++) {
            var _startLoc4 = getPosition();
            dumpSep("function body " + i);
            var bodySizeU32 = readU32();
            eatBytes(bodySizeU32.nextIndex), dump([ bodySizeU32.value ], "function body size");
            var code = [], funcLocalNumU32 = readU32(), funcLocalNum = funcLocalNumU32.value;
            eatBytes(funcLocalNumU32.nextIndex), dump([ funcLocalNum ], "num locals");
            for (var locals = [], _i = 0; _i < funcLocalNum; _i++) {
              var _startLoc5 = getPosition(), localCountU32 = readU32(), localCount = localCountU32.value;
              eatBytes(localCountU32.nextIndex), dump([ localCount ], "num local");
              var valtypeByte = readByte();
              eatBytes(1);
              for (var type = esm.valtypes[valtypeByte], args = [], _i2 = 0; _i2 < localCount; _i2++) args.push(external_wasm_ast_.valtypeLiteral(type));
              var localNode = function() {
                var endLoc = getPosition();
                return external_wasm_ast_.withLoc(external_wasm_ast_.instruction("local", args), endLoc, _startLoc5);
              }();
              if (locals.push(localNode), dump([ valtypeByte ], type), void 0 === type) throw new CompileError("Unexpected valtype: " + toHex(valtypeByte));
            }
            code.push.apply(code, locals), parseInstructionBlock(code);
            var endLoc = getPosition();
            state.elementsInCodeSection.push({
              code: code,
              locals: locals,
              endLoc: endLoc,
              startLoc: _startLoc4,
              bodySize: bodySizeU32.value
            });
          }
        }(numberOfFuncs);
        return {
          nodes: [],
          metadata: _metadata6,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.start:
        dumpSep("section Start"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _metadata7 = external_wasm_ast_.sectionMetadata("start", startOffset, sectionSizeInBytesNode);
        return {
          nodes: [ parseStartSection() ],
          metadata: _metadata7,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.element:
        dumpSep("section Element"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc19 = getPosition(), numberOfElementsu32 = readU32(), numberOfElements = numberOfElementsu32.value;
        eatBytes(numberOfElementsu32.nextIndex);
        var _metadata8 = external_wasm_ast_.sectionMetadata("element", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfElements), endLoc, _startLoc19);
        }());
        return {
          nodes: function(numberOfElements) {
            var endLoc, elems = [];
            dump([ numberOfElements ], "num elements");
            for (var i = 0; i < numberOfElements; i++) {
              var _startLoc12 = getPosition(), tableindexu32 = readU32(), tableindex = tableindexu32.value;
              eatBytes(tableindexu32.nextIndex), dump([ tableindex ], "table index");
              var instr = [];
              parseInstructionBlock(instr);
              var indicesu32 = readU32(), indices = indicesu32.value;
              eatBytes(indicesu32.nextIndex), dump([ indices ], "num indices");
              for (var indexValues = [], _i5 = 0; _i5 < indices; _i5++) {
                var indexu32 = readU32(), index = indexu32.value;
                eatBytes(indexu32.nextIndex), dump([ index ], "index"), indexValues.push(external_wasm_ast_.indexLiteral(index));
              }
              var elemNode = (endLoc = void 0, endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.elem(external_wasm_ast_.indexLiteral(tableindex), instr, indexValues), endLoc, _startLoc12));
              elems.push(elemNode);
            }
            return elems;
          }(numberOfElements),
          metadata: _metadata8,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.global:
        dumpSep("section Global"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc20 = getPosition(), numberOfGlobalsu32 = readU32(), numberOfGlobals = numberOfGlobalsu32.value;
        eatBytes(numberOfGlobalsu32.nextIndex);
        var _metadata9 = external_wasm_ast_.sectionMetadata("global", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(numberOfGlobals), endLoc, _startLoc20);
        }());
        return {
          nodes: function(numberOfGlobals) {
            var endLoc, globals = [];
            dump([ numberOfGlobals ], "num globals");
            for (var i = 0; i < numberOfGlobals; i++) {
              var _startLoc11 = getPosition(), globalType = parseGlobalType(), init = [];
              parseInstructionBlock(init);
              var node = (endLoc = void 0, endLoc = getPosition(), external_wasm_ast_.withLoc(external_wasm_ast_.global(globalType, init), endLoc, _startLoc11));
              globals.push(node), state.globalsInModule.push(node);
            }
            return globals;
          }(numberOfGlobals),
          metadata: _metadata9,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.memory:
        dumpSep("section Memory"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _startLoc21 = getPosition(), _numberOfElementsu = readU32(), _numberOfElements = _numberOfElementsu.value;
        eatBytes(_numberOfElementsu.nextIndex);
        var _metadata10 = external_wasm_ast_.sectionMetadata("memory", startOffset, sectionSizeInBytesNode, function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(_numberOfElements), endLoc, _startLoc21);
        }());
        return {
          nodes: function(numberOfElements) {
            var memories = [];
            dump([ numberOfElements ], "num elements");
            for (var i = 0; i < numberOfElements; i++) {
              var memoryNode = parseMemoryType(i);
              state.memoriesInModule.push(memoryNode), memories.push(memoryNode);
            }
            return memories;
          }(_numberOfElements),
          metadata: _metadata10,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.data:
        dumpSep("section Data"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _metadata11 = external_wasm_ast_.sectionMetadata("data", startOffset, sectionSizeInBytesNode), _startLoc22 = getPosition(), _numberOfElementsu2 = readU32(), _numberOfElements2 = _numberOfElementsu2.value;
        return eatBytes(_numberOfElementsu2.nextIndex), _metadata11.vectorOfSize = function() {
          var endLoc = getPosition();
          return external_wasm_ast_.withLoc(external_wasm_ast_.numberLiteralFromRaw(_numberOfElements2), endLoc, _startLoc22);
        }(), !0 === opts.ignoreDataSection ? (eatBytes(sectionSizeInBytes - _numberOfElementsu2.nextIndex), 
        dumpSep("ignore data (" + sectionSizeInBytes + " bytes)"), {
          nodes: [],
          metadata: _metadata11,
          nextSectionIndex: nextSectionIndex
        }) : {
          nodes: function(numberOfElements) {
            var dataEntries = [];
            dump([ numberOfElements ], "num elements");
            for (var i = 0; i < numberOfElements; i++) {
              var memoryIndexu32 = readU32(), memoryIndex = memoryIndexu32.value;
              eatBytes(memoryIndexu32.nextIndex), dump([ memoryIndex ], "memory index");
              var instrs = [];
              if (parseInstructionBlock(instrs), 1 !== instrs.filter((function(i) {
                return "end" !== i.id;
              })).length) throw new CompileError("data section offset must be a single instruction");
              var bytes = parseVec((function(b) {
                return b;
              }));
              dump([], "init"), dataEntries.push(external_wasm_ast_.data(external_wasm_ast_.memIndexLiteral(memoryIndex), instrs[0], external_wasm_ast_.byteArray(bytes)));
            }
            return dataEntries;
          }(_numberOfElements2),
          metadata: _metadata11,
          nextSectionIndex: nextSectionIndex
        };

       case esm.sections.custom:
        dumpSep("section Custom"), dump([ sectionId ], "section code"), dump([ sectionSizeInBytes ], "section size");
        var _metadata12 = [ external_wasm_ast_.sectionMetadata("custom", startOffset, sectionSizeInBytesNode) ], sectionName = readUTF8String();
        eatBytes(sectionName.nextIndex), dump([], "section name (".concat(sectionName.value, ")"));
        var _remainingBytes2 = sectionSizeInBytes - sectionName.nextIndex;
        if ("name" === sectionName.value) {
          var initialOffset = offset;
          try {
            _metadata12.push.apply(_metadata12, function(remainingBytes) {
              for (var bytes, nameMetadata = [], initialOffset = offset; offset - initialOffset < remainingBytes; ) {
                var sectionTypeByte = (bytes = void 0, bytes = readBytes(1), esm_decodeUInt32(Buffer.from(bytes)));
                eatBytes(sectionTypeByte.nextIndex);
                var subSectionSizeInBytesu32 = readVaruint32();
                switch (eatBytes(subSectionSizeInBytesu32.nextIndex), sectionTypeByte.value) {
                 case 1:
                  nameMetadata.push.apply(nameMetadata, parseNameSectionFunctions());
                  break;

                 case 2:
                  nameMetadata.push.apply(nameMetadata, parseNameSectionLocals());
                  break;

                 default:
                  eatBytes(subSectionSizeInBytesu32.value);
                }
              }
              return nameMetadata;
            }(_remainingBytes2));
          } catch (e) {
            console.warn('Failed to decode custom "name" section @'.concat(offset, "; ignoring (").concat(e.message, ").")), 
            eatBytes(offset - (initialOffset + _remainingBytes2));
          }
        } else if ("producers" === sectionName.value) {
          var _initialOffset = offset;
          try {
            _metadata12.push(function() {
              var metadata = external_wasm_ast_.producersSectionMetadata([]), sectionTypeByte = readVaruint32();
              eatBytes(sectionTypeByte.nextIndex), dump([ sectionTypeByte.value ], "num of producers");
              for (var fields = {
                language: [],
                "processed-by": [],
                sdk: []
              }, fieldI = 0; fieldI < sectionTypeByte.value; fieldI++) {
                var fieldName = readUTF8String();
                eatBytes(fieldName.nextIndex);
                var valueCount = readVaruint32();
                eatBytes(valueCount.nextIndex);
                for (var producerI = 0; producerI < valueCount.value; producerI++) {
                  var producerName = readUTF8String();
                  eatBytes(producerName.nextIndex);
                  var producerVersion = readUTF8String();
                  eatBytes(producerVersion.nextIndex), fields[fieldName.value].push(external_wasm_ast_.producerMetadataVersionedName(producerName.value, producerVersion.value));
                }
                metadata.producers.push(fields[fieldName.value]);
              }
              return metadata;
            }());
          } catch (e) {
            console.warn('Failed to decode custom "producers" section @'.concat(offset, "; ignoring (").concat(e.message, ").")), 
            eatBytes(offset - (_initialOffset + _remainingBytes2));
          }
        } else eatBytes(_remainingBytes2), dumpSep("ignore custom " + JSON.stringify(sectionName.value) + " section (" + _remainingBytes2 + " bytes)");
        return {
          nodes: [],
          metadata: _metadata12,
          nextSectionIndex: nextSectionIndex
        };
      }
      throw new CompileError("Unexpected section: " + toHex(sectionId));
    }
    !function() {
      if (!0 === isEOF() || offset + 4 > buf.length) throw new Error("unexpected end");
      var header = readBytes(4);
      if (!1 === byteArrayEq(esm.magicModuleHeader, header)) throw new CompileError("magic header not detected");
      dump(header, "wasm magic header"), eatBytes(4);
    }(), function() {
      if (!0 === isEOF() || offset + 4 > buf.length) throw new Error("unexpected end");
      var version = readBytes(4);
      if (!1 === byteArrayEq(esm.moduleVersion, version)) throw new CompileError("unknown binary version");
      dump(version, "wasm version"), eatBytes(4);
    }();
    for (var moduleFields = [], sectionIndex = 0, moduleMetadata = {
      sections: [],
      functionNames: [],
      localNames: [],
      producers: []
    }; offset < buf.length; ) {
      var _parseSection = parseSection(sectionIndex), _nodes12 = _parseSection.nodes, _metadata13 = _parseSection.metadata, nextSectionIndex = _parseSection.nextSectionIndex;
      moduleFields.push.apply(moduleFields, _nodes12), (Array.isArray(_metadata13) ? _metadata13 : [ _metadata13 ]).forEach((function(metadataItem) {
        "FunctionNameMetadata" === metadataItem.type ? moduleMetadata.functionNames.push(metadataItem) : "LocalNameMetadata" === metadataItem.type ? moduleMetadata.localNames.push(metadataItem) : "ProducersSectionMetadata" === metadataItem.type ? moduleMetadata.producers.push(metadataItem) : moduleMetadata.sections.push(metadataItem);
      })), nextSectionIndex && (sectionIndex = nextSectionIndex);
    }
    var funcIndex = 0;
    state.functionsInModule.forEach((function(func) {
      var params = func.signature.params, result = func.signature.result, body = [];
      if (!0 !== func.isExternal) {
        var decodedElementInCodeSection = state.elementsInCodeSection[funcIndex];
        if (!1 === opts.ignoreCodeSection) {
          if (void 0 === decodedElementInCodeSection) throw new CompileError("func " + toHex(funcIndex) + " code not found");
          body = decodedElementInCodeSection.code;
        }
        funcIndex++;
        var funcNode = external_wasm_ast_.func(func.id, external_wasm_ast_.signature(params, result), body);
        if (!0 === func.isExternal && (funcNode.isExternal = func.isExternal), !1 === opts.ignoreCodeSection) {
          var _startLoc23 = decodedElementInCodeSection.startLoc, endLoc = decodedElementInCodeSection.endLoc, bodySize = decodedElementInCodeSection.bodySize;
          (funcNode = external_wasm_ast_.withLoc(funcNode, endLoc, _startLoc23)).metadata = {
            bodySize: bodySize
          };
        }
        moduleFields.push(funcNode);
      }
    })), state.elementsInExportSection.forEach((function(moduleExport) {
      null != moduleExport.id && moduleFields.push(external_wasm_ast_.withLoc(external_wasm_ast_.moduleExport(moduleExport.name, external_wasm_ast_.moduleExportDescr(moduleExport.type, moduleExport.id)), moduleExport.endLoc, moduleExport.startLoc));
    })), dumpSep("end of program");
    var module = external_wasm_ast_.module(null, moduleFields, external_wasm_ast_.moduleMetadata(moduleMetadata.sections, moduleMetadata.functionNames, moduleMetadata.localNames, moduleMetadata.producers));
    return external_wasm_ast_.program([ module ]);
  }
  var defaultDecoderOpts = {
    dump: !1,
    ignoreCodeSection: !1,
    ignoreDataSection: !1,
    ignoreCustomNameSection: !1
  };
  function esm_decode(buf, customOpts) {
    var opts = Object.assign({}, defaultDecoderOpts, customOpts), ast = decoder_decode(buf, opts);
    return !1 === opts.ignoreCustomNameSection && (function(ast) {
      var functionNames = [];
      external_wasm_ast_.traverse(ast, {
        FunctionNameMetadata: function(_ref) {
          var node = _ref.node;
          functionNames.push({
            name: node.value,
            index: node.index
          });
        }
      }), 0 !== functionNames.length && external_wasm_ast_.traverse(ast, {
        Func: function(_Func) {
          function Func(_x) {
            return _Func.apply(this, arguments);
          }
          return Func.toString = function() {
            return _Func.toString();
          }, Func;
        }((function(_ref2) {
          var nodeName = _ref2.node.name, indexBasedFunctionName = nodeName.value, index = Number(indexBasedFunctionName.replace("func_", "")), functionName = functionNames.find((function(f) {
            return f.index === index;
          }));
          if (functionName) {
            var oldValue = nodeName.value;
            nodeName.value = functionName.name, nodeName.numeric = oldValue, delete nodeName.raw;
          }
        })),
        ModuleExport: function(_ModuleExport) {
          function ModuleExport(_x2) {
            return _ModuleExport.apply(this, arguments);
          }
          return ModuleExport.toString = function() {
            return _ModuleExport.toString();
          }, ModuleExport;
        }((function(_ref3) {
          var node = _ref3.node;
          if ("Func" === node.descr.exportType) {
            var index = node.descr.id.value, functionName = functionNames.find((function(f) {
              return f.index === index;
            }));
            functionName && (node.descr.id = external_wasm_ast_.identifier(functionName.name));
          }
        })),
        ModuleImport: function(_ModuleImport) {
          function ModuleImport(_x3) {
            return _ModuleImport.apply(this, arguments);
          }
          return ModuleImport.toString = function() {
            return _ModuleImport.toString();
          }, ModuleImport;
        }((function(_ref4) {
          var node = _ref4.node;
          if ("FuncImportDescr" === node.descr.type) {
            var indexBasedFunctionName = node.descr.id, index = Number(indexBasedFunctionName.replace("func_", "")), functionName = functionNames.find((function(f) {
              return f.index === index;
            }));
            functionName && (node.descr.id = external_wasm_ast_.identifier(functionName.name));
          }
        })),
        CallInstruction: function(_CallInstruction) {
          function CallInstruction(_x4) {
            return _CallInstruction.apply(this, arguments);
          }
          return CallInstruction.toString = function() {
            return _CallInstruction.toString();
          }, CallInstruction;
        }((function(nodePath) {
          var node = nodePath.node, index = node.index.value, functionName = functionNames.find((function(f) {
            return f.index === index;
          }));
          if (functionName) {
            var oldValue = node.index;
            node.index = external_wasm_ast_.identifier(functionName.name), node.numeric = oldValue, 
            delete node.raw;
          }
        }))
      });
    }(ast), function(ast) {
      var localNames = [];
      external_wasm_ast_.traverse(ast, {
        LocalNameMetadata: function(_ref5) {
          var node = _ref5.node;
          localNames.push({
            name: node.value,
            localIndex: node.localIndex,
            functionIndex: node.functionIndex
          });
        }
      }), 0 !== localNames.length && external_wasm_ast_.traverse(ast, {
        Func: function(_Func2) {
          function Func(_x5) {
            return _Func2.apply(this, arguments);
          }
          return Func.toString = function() {
            return _Func2.toString();
          }, Func;
        }((function(_ref6) {
          var node = _ref6.node, signature = node.signature;
          if ("Signature" === signature.type) {
            var indexBasedFunctionName = node.name.value, functionIndex = Number(indexBasedFunctionName.replace("func_", ""));
            signature.params.forEach((function(param, paramIndex) {
              var paramName = localNames.find((function(f) {
                return f.localIndex === paramIndex && f.functionIndex === functionIndex;
              }));
              paramName && "" !== paramName.name && (param.id = paramName.name);
            }));
          }
        }))
      });
    }(ast), function(ast) {
      external_wasm_ast_.traverse(ast, {
        ModuleNameMetadata: function(_ModuleNameMetadata) {
          function ModuleNameMetadata(_x6) {
            return _ModuleNameMetadata.apply(this, arguments);
          }
          return ModuleNameMetadata.toString = function() {
            return _ModuleNameMetadata.toString();
          }, ModuleNameMetadata;
        }((function(moduleNameMetadataPath) {
          external_wasm_ast_.traverse(ast, {
            Module: function(_Module) {
              function Module(_x7) {
                return _Module.apply(this, arguments);
              }
              return Module.toString = function() {
                return _Module.toString();
              }, Module;
            }((function(_ref7) {
              var node = _ref7.node, name = moduleNameMetadataPath.node.value;
              "" === name && (name = null), node.id = name;
            }))
          });
        }))
      });
    }(ast)), ast;
  }
} ]));
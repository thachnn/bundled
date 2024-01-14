"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var t = require("./wasm-ast"),
  Long = require("./long");

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call == "object" || typeof call == "function")) return call;
  if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass != "function" && superClass !== null)
    throw new TypeError("Super expression must either be null or a function");
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass);
}

var CompileError = /*#__PURE__*/ (function () {
  _inherits(CompileError, Error);

  function CompileError() {
    _classCallCheck(this, CompileError);

    return _possibleConstructorReturn(this, (CompileError.__proto__ || Object.getPrototypeOf(CompileError)).apply(this, arguments));
  }

  return CompileError;
})();

function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
    eLen = nBytes * 8 - mLen - 1,
    eMax = (1 << eLen) - 1,
    eBias = eMax >> 1,
    nBits = -7,
    i = isLE ? nBytes - 1 : 0,
    d = isLE ? -1 : 1,
    s = buffer[offset + i];

  i += d;

  e = s & ((1 << -nBits) - 1);
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << -nBits) - 1);
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) e = 1 - eBias;
  else {
    if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;

    m += Math.pow(2, mLen);
    e -= eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}

var NUMBER_OF_BYTE_F32 = 4,
  NUMBER_OF_BYTE_F64 = 8,
  SINGLE_PRECISION_MANTISSA = 23,
  DOUBLE_PRECISION_MANTISSA = 52;
function decodeF32(bytes) {
  return read(Buffer.from(bytes), 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
}
function decodeF64(bytes) {
  return read(Buffer.from(bytes), 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
}

function _toArray(arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
}

function con(b) {
  if ((b & 0xc0) == 0x80) return b & 0x3f;

  throw new Error("invalid UTF-8 encoding");
}

function code(min, n) {
  if (n < min || (0xd800 <= n && n < 0xe000) || n >= 0x10000) throw new Error("invalid UTF-8 encoding");

  return n;
}

function decode(bytes) {
  return _decode(bytes).map(function (x) {
    return String.fromCharCode(x);
  }).join("");
}

function _decode(bytes) {
  if (bytes.length === 0) return [];

  var _bytes = _toArray(bytes),
    b1 = _bytes[0],
    bs = _bytes.slice(1);

  if (b1 < 0x80) return [code(0x0, b1)].concat(_decode(bs));

  if (b1 < 0xc0) throw new Error("invalid UTF-8 encoding");

  var b2 = _bytes[1];
  bs = _bytes.slice(2);

  if (b1 < 0xe0) return [code(0x80, ((b1 & 0x1f) << 6) + con(b2))].concat(_decode(bs));

  var b3 = _bytes[2];
  bs = _bytes.slice(3);

  if (b1 < 0xf0) return [code(0x800, ((b1 & 0x0f) << 12) + (con(b2) << 6) + con(b3))].concat(_decode(bs));

  var b4 = _bytes[3];
  bs = _bytes.slice(4);

  if (b1 < 0xf8)
    return [code(0x10000, ((((b1 & 0x07) << 18) + con(b2)) << 12) + (con(b3) << 6) + con(b4))].concat(_decode(bs));

  throw new Error("invalid UTF-8 encoding");
}

function inject(buffer, bitIndex, bitLength, value) {
  if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");

  var lastByte = Math.floor((bitIndex + bitLength - 1) / 8);

  if (bitIndex < 0 || lastByte >= buffer.length) throw new Error("Index out of range.");

  for (var atByte = Math.floor(bitIndex / 8), atBit = bitIndex % 8; bitLength > 0; ) {
    value & 1 ? (buffer[atByte] |= 1 << atBit) : (buffer[atByte] &= ~(1 << atBit));

    value >>= 1;
    bitLength--;

    (atBit = (atBit + 1) % 8) != 0 || atByte++;
  }
}

var bufPool = [],

  TEMP_BUF_MAXIMUM_LENGTH = 20;

function lowestBit(num) {
  return num & -num;
}

function isLossyToAdd(accum, num) {
  if (num === 0) return false;

  var lowBit = lowestBit(num),
    added = accum + lowBit;

  return added === accum || added - lowBit !== accum;
}

function alloc(length) {
  var result = bufPool[length];

  result ? (bufPool[length] = void 0) : (result = new Buffer(length));

  result.fill(0);
  return result;
}

function free(buffer) {
  var length = buffer.length;

  if (length < TEMP_BUF_MAXIMUM_LENGTH) bufPool[length] = buffer;
}

function resize(buffer, length) {
  if (length === buffer.length) return buffer;

  var newBuf = alloc(length);
  buffer.copy(newBuf);
  free(buffer);
  return newBuf;
}

function readInt(buffer) {
  var length = buffer.length,
    result = buffer[length - 1] < 0x80 ? 0 : -1,
    lossy = false;

  if (length < 7) for (var i = length - 1; i >= 0; i--) result = result * 0x100 + buffer[i];
  else
    for (var _i = length - 1; _i >= 0; _i--) {
      var one = buffer[_i];

      if (isLossyToAdd((result *= 0x100), one)) lossy = true;

      result += one;
    }

  return { value: result, lossy: lossy };
}

function readUInt(buffer) {
  var length = buffer.length,
    result = 0,
    lossy = false;

  if (length < 7) for (var i = length - 1; i >= 0; i--) result = result * 0x100 + buffer[i];
  else
    for (var _i2 = length - 1; _i2 >= 0; _i2--) {
      var one = buffer[_i2];

      if (isLossyToAdd((result *= 0x100), one)) lossy = true;

      result += one;
    }

  return { value: result, lossy: lossy };
}

var MIN_INT32 = -0x80000000,
  MAX_INT32 = 0x7fffffff,
  MAX_UINT32 = 0xffffffff;

function encodedLength(encodedBuffer, index) {
  var result = 0;

  while (encodedBuffer[index + result] >= 0x80) result++;

  result++;

  /* FIXME if (index + result > ...); */ encodedBuffer.length;

  return result;
}

function decodeBufferCommon(encodedBuffer, index, signed) {
  var signBit, signByte,
    length = encodedLength(encodedBuffer, (index = index === void 0 ? 0 : index)),
    bitLength = length * 7,
    byteLength = Math.ceil(bitLength / 8),
    result = alloc(byteLength),
    outIndex = 0;

  while (length > 0) {
    inject(result, outIndex, 7, encodedBuffer[index]);
    outIndex += 7;
    index++;
    length--;
  }

  if (signed) {
    var lastByte = result[byteLength - 1],
      endBit = outIndex % 8;

    if (endBit !== 0) {
      var shift = 32 - endBit;

      lastByte = result[byteLength - 1] = ((lastByte << shift) >> shift) & 0xff;
    }

    signByte = 0xff * (signBit = lastByte >> 7);
  } else {
    signBit = 0;
    signByte = 0;
  }

  while (byteLength > 1 && result[byteLength - 1] === signByte && (!signed || result[byteLength - 2] >> 7 === signBit))
    byteLength--;

  return { value: resize(result, byteLength), nextIndex: index };
}

function decodeIntBuffer(encodedBuffer, index) {
  return decodeBufferCommon(encodedBuffer, index, true);
}

function decodeInt32(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index),
    value = readInt(result.value).value;
  free(result.value);

  if (value < MIN_INT32 || value > MAX_INT32) throw new Error("integer too large");

  return { value: value, nextIndex: result.nextIndex };
}

function decodeInt64(encodedBuffer, index) {
  var result = decodeIntBuffer(encodedBuffer, index),
    value = Long.fromBytesLE(result.value, false);
  free(result.value);
  return { value: value, nextIndex: result.nextIndex, lossy: false };
}

function decodeUIntBuffer(encodedBuffer, index) {
  return decodeBufferCommon(encodedBuffer, index, false);
}

function decodeUInt32(encodedBuffer, index) {
  var result = decodeUIntBuffer(encodedBuffer, index),
    value = readUInt(result.value).value;
  free(result.value);

  if (value > MAX_UINT32) throw new Error("integer too large");

  return { value: value, nextIndex: result.nextIndex };
}

function decodeUInt64(encodedBuffer, index) {
  var result = decodeUIntBuffer(encodedBuffer, index),
    value = Long.fromBytesLE(result.value, true);
  free(result.value);
  return { value: value, nextIndex: result.nextIndex, lossy: false };
}

var MAX_NUMBER_OF_BYTE_U32 = 5,
  MAX_NUMBER_OF_BYTE_U64 = 10;

var illegalop = "illegal",
  magicModuleHeader = [0, 0x61, 0x73, 0x6d],
  moduleVersion = [1, 0, 0, 0];

function createSymbolObject(name, object) {
  return { name: name, object: object, numberOfArgs: arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0 };
}

function createSymbol(name) {
  return { name: name, numberOfArgs: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0 };
}

var types = { func: 0x60, result: 0x40 },
  exportTypes = { 0: "Func", 1: "Table", 2: "Mem", 3: "Global" },
  valtypes = { 0x7f: "i32", 0x7e: "i64", 0x7d: "f32", 0x7c: "f64", 0x7b: "v128" },
  tableTypes = { 0x70: "anyfunc" },
  blockTypes = Object.assign({}, valtypes, { 0x40: null, 0x7f: "i32", 0x7e: "i64", 0x7d: "f32", 0x7c: "f64" }),
  globalTypes = { 0: "const", 1: "var" },
  importTypes = { 0: "func", 1: "table", 2: "mem", 3: "global" };
var sections = {
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
};
var symbolsByByte = {
  0: createSymbol("unreachable"),
  1: createSymbol("nop"),
  2: createSymbol("block"),
  3: createSymbol("loop"),
  4: createSymbol("if"),
  5: createSymbol("else"),
  6: illegalop,
  7: illegalop,
  8: illegalop,
  9: illegalop,
  10: illegalop,
  11: createSymbol("end"),
  12: createSymbol("br", 1),
  13: createSymbol("br_if", 1),
  14: createSymbol("br_table"),
  15: createSymbol("return"),
  16: createSymbol("call", 1),
  17: createSymbol("call_indirect", 2),
  18: illegalop,
  19: illegalop,
  20: illegalop,
  21: illegalop,
  22: illegalop,
  23: illegalop,
  24: illegalop,
  25: illegalop,
  26: createSymbol("drop"),
  27: createSymbol("select"),
  28: illegalop,
  29: illegalop,
  30: illegalop,
  31: illegalop,
  32: createSymbol("get_local", 1),
  33: createSymbol("set_local", 1),
  34: createSymbol("tee_local", 1),
  35: createSymbol("get_global", 1),
  36: createSymbol("set_global", 1),
  37: illegalop,
  38: illegalop,
  39: illegalop,
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
};

function toHex(n) {
  return "0x" + Number(n).toString(16);
}

function byteArrayEq(l, r) {
  if (l.length !== r.length) return false;

  for (var i = 0; i < l.length; i++) if (l[i] !== r[i]) return false;

  return true;
}

function decode$1(ab, opts) {
  var buf = new Uint8Array(ab),
    getUniqueName = t.getUniqueNameGenerator(),
    offset = 0;

  function getPosition() {
    return { line: -1, column: offset };
  }

  function dump(b, msg) {
    if (opts.dump === false) return;
    var pad = "\t\t\t\t\t\t\t\t\t\t",

      str = b.length < 5 ? b.map(toHex).join(" ") : "...";

    console.log(toHex(offset) + ":\t", str, pad, ";", msg);
  }

  function dumpSep(msg) {
    opts.dump === false || console.log(";", msg);
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
    var arr = [];

    for (var i = 0; i < numberOfBytes; i++) arr.push(buf[_offset + i]);

    return arr;
  }

  function readBytes(numberOfBytes) {
    return readBytesAtOffset(offset, numberOfBytes);
  }

  function readF64() {
    var bytes = readBytes(NUMBER_OF_BYTE_F64),
      value = decodeF64(bytes);

    if (Math.sign(value) * value === Infinity)
      return { value: Math.sign(value), inf: true, nextIndex: NUMBER_OF_BYTE_F64 };

    if (isNaN(value)) {
      var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1,
        mantissa = 0;

      for (var i = 0; i < bytes.length - 2; ++i) mantissa += bytes[i] * Math.pow(256, i);

      mantissa += (bytes[bytes.length - 2] % 16) * Math.pow(256, bytes.length - 2);
      return { value: sign * mantissa, nan: true, nextIndex: NUMBER_OF_BYTE_F64 };
    }

    return { value: value, nextIndex: NUMBER_OF_BYTE_F64 };
  }

  function readF32() {
    var bytes = readBytes(NUMBER_OF_BYTE_F32),
      value = decodeF32(bytes);

    if (Math.sign(value) * value === Infinity)
      return { value: Math.sign(value), inf: true, nextIndex: NUMBER_OF_BYTE_F32 };

    if (isNaN(value)) {
      var sign = bytes[bytes.length - 1] >> 7 ? -1 : 1,
        mantissa = 0;

      for (var i = 0; i < bytes.length - 2; ++i) mantissa += bytes[i] * Math.pow(256, i);

      mantissa += (bytes[bytes.length - 2] % 128) * Math.pow(256, bytes.length - 2);
      return { value: sign * mantissa, nan: true, nextIndex: NUMBER_OF_BYTE_F32 };
    }

    return { value: value, nextIndex: NUMBER_OF_BYTE_F32 };
  }

  function readUTF8String() {
    var lenu32 = readU32(),

      strlen = lenu32.value;
    dump([strlen], "string length");
    return { value: decode(readBytesAtOffset(offset + lenu32.nextIndex, strlen)), nextIndex: strlen + lenu32.nextIndex };
  }

  function readU32() {
    var bytes = readBytes(MAX_NUMBER_OF_BYTE_U32);
    return decodeUInt32(Buffer.from(bytes));
  }

  function readVaruint32() {
    var bytes = readBytes(4);
    return decodeUInt32(Buffer.from(bytes));
  }

  function readVaruint7() {
    var bytes = readBytes(1);
    return decodeUInt32(Buffer.from(bytes));
  }

  function read32() {
    var bytes = readBytes(MAX_NUMBER_OF_BYTE_U32);
    return decodeInt32(Buffer.from(bytes));
  }

  function read64() {
    var bytes = readBytes(MAX_NUMBER_OF_BYTE_U64);
    return decodeInt64(Buffer.from(bytes));
  }

  function readU64() {
    var bytes = readBytes(MAX_NUMBER_OF_BYTE_U64);
    return decodeUInt64(Buffer.from(bytes));
  }

  function readByte() {
    return readBytes(1)[0];
  }

  function parseModuleHeader() {
    if (isEOF() === true || offset + 4 > buf.length) throw new Error("unexpected end");

    var header = readBytes(4);

    if (byteArrayEq(magicModuleHeader, header) === false) throw new CompileError("magic header not detected");

    dump(header, "wasm magic header");
    eatBytes(4);
  }

  function parseVersion() {
    if (isEOF() === true || offset + 4 > buf.length) throw new Error("unexpected end");

    var version = readBytes(4);

    if (byteArrayEq(moduleVersion, version) === false) throw new CompileError("unknown binary version");

    dump(version, "wasm version");
    eatBytes(4);
  }

  function parseVec(cast) {
    var u32 = readU32(),
      length = u32.value;
    eatBytes(u32.nextIndex);
    dump([length], "number");

    if (length === 0) return [];

    var elements = [];

    for (var i = 0; i < length; i++) {
      var byte = readByte();
      eatBytes(1);
      var value = cast(byte);
      dump([byte], value);

      if (value === void 0) throw new CompileError("Internal failure: parseVec could not cast the value");

      elements.push(value);
    }

    return elements;
  }

  function parseTypeSection(numberOfTypes) {
    var typeInstructionNodes = [];
    dump([numberOfTypes], "num types");

    for (var i = 0; i < numberOfTypes; i++) {
      var _startLoc = getPosition();

      dumpSep("type " + i);
      var type = readByte();
      eatBytes(1);

      if (type != types.func) throw new Error("Unsupported type: " + toHex(type));

      dump([type], "func");
      var params = parseVec(function (b) {
        return valtypes[b];
      }).map(function (v) {
        return t.funcParam(v);
      });
      var result = parseVec(function (b) {
        return valtypes[b];
      });
      typeInstructionNodes.push((function () {
        var endLoc = getPosition();
        return t.withLoc(t.typeInstruction(void 0, t.signature(params, result)), endLoc, _startLoc);
      })());
      state.typesInModule.push({ params: params, result: result });
    }

    return typeInstructionNodes;
  }

  function parseImportSection(numberOfImports) {
    var imports = [];

    for (var i = 0; i < numberOfImports; i++) {
      dumpSep("import header " + i);

      var _startLoc2 = getPosition(),

        moduleName = readUTF8String();
      eatBytes(moduleName.nextIndex);
      dump([], "module name (" + moduleName.value + ")");

      var name = readUTF8String();
      eatBytes(name.nextIndex);
      dump([], "name (" + name.value + ")");

      var descrTypeByte = readByte();
      eatBytes(1);
      var descrType = importTypes[descrTypeByte];
      dump([descrTypeByte], "import kind");

      if (descrType === void 0) throw new CompileError("Unknown import description type: " + toHex(descrTypeByte));

      var importDescr = void 0;

      if (descrType === "func") {
        var indexU32 = readU32(),
          typeindex = indexU32.value;
        eatBytes(indexU32.nextIndex);
        dump([typeindex], "type index");
        var signature = state.typesInModule[typeindex];

        if (signature === void 0) throw new CompileError("function signature not found (" + typeindex + ")");

        var id = getUniqueName("func");
        importDescr = t.funcImportDescr(id, t.signature(signature.params, signature.result));
        state.functionsInModule.push({ id: t.identifier(name.value), signature: signature, isExternal: true });
      } else if (descrType === "global") {
        importDescr = parseGlobalType();
        var globalNode = t.global(importDescr, []);
        state.globalsInModule.push(globalNode);
      } else if (descrType === "table") importDescr = parseTableType(i);
      else {
        if (descrType !== "mem") throw new CompileError("Unsupported import of type: " + descrType);
        var memoryNode = parseMemoryType(0);
        state.memoriesInModule.push(memoryNode);
        importDescr = memoryNode;
      }

      imports.push((function () {
        var endLoc = getPosition();
        return t.withLoc(t.moduleImport(moduleName.value, name.value, importDescr), endLoc, _startLoc2);
      })());
    }

    return imports;
  }

  function parseFuncSection(numberOfFunctions) {
    dump([numberOfFunctions], "num funcs");

    for (var i = 0; i < numberOfFunctions; i++) {
      var indexU32 = readU32(),
        typeindex = indexU32.value;
      eatBytes(indexU32.nextIndex);
      dump([typeindex], "type index");
      var signature = state.typesInModule[typeindex];

      if (signature === void 0) throw new CompileError("function signature not found (" + typeindex + ")");

      var id = t.withRaw(t.identifier(getUniqueName("func")), "");
      state.functionsInModule.push({ id: id, signature: signature, isExternal: false });
    }
  }

  function parseExportSection(numberOfExport) {
    dump([numberOfExport], "num exports");

    for (var i = 0; i < numberOfExport; i++) {
      var _startLoc3 = getPosition(),

        name = readUTF8String();
      eatBytes(name.nextIndex);
      dump([], "export name (" + name.value + ")");

      var typeIndex = readByte();
      eatBytes(1);
      dump([typeIndex], "export kind");
      var indexu32 = readU32(),
        index = indexu32.value;
      eatBytes(indexu32.nextIndex);
      dump([index], "export index");
      var id = void 0,
        signature = void 0;

      if (exportTypes[typeIndex] === "Func") {
        var func = state.functionsInModule[index];

        if (func === void 0) throw new CompileError("unknown function (" + index + ")");

        id = t.numberLiteralFromRaw(index, String(index));
        signature = func.signature;
      } else if (exportTypes[typeIndex] === "Table") {
        if (state.tablesInModule[index] === void 0) throw new CompileError("unknown table " + index);

        id = t.numberLiteralFromRaw(index, String(index));
        signature = null;
      } else if (exportTypes[typeIndex] === "Mem") {
        if (state.memoriesInModule[index] === void 0) throw new CompileError("unknown memory " + index);

        id = t.numberLiteralFromRaw(index, String(index));
        signature = null;
      } else if (exportTypes[typeIndex] === "Global") {
        if (state.globalsInModule[index] === void 0) throw new CompileError("unknown global " + index);

        id = t.numberLiteralFromRaw(index, String(index));
        signature = null;
      } else {
        console.warn("Unsupported export type: " + toHex(typeIndex));
        return;
      }

      var endLoc = getPosition();
      state.elementsInExportSection.push({
        name: name.value,
        type: exportTypes[typeIndex],
        signature: signature,
        id: id,
        index: index,
        endLoc: endLoc,
        startLoc: _startLoc3
      });
    }
  }

  function parseCodeSection(numberOfFuncs) {
    dump([numberOfFuncs], "number functions");

    for (var i = 0; i < numberOfFuncs; i++) {
      var _startLoc4 = getPosition();

      dumpSep("function body " + i);

      var bodySizeU32 = readU32();
      eatBytes(bodySizeU32.nextIndex);
      dump([bodySizeU32.value], "function body size");
      var code = [],

        funcLocalNumU32 = readU32(),
        funcLocalNum = funcLocalNumU32.value;
      eatBytes(funcLocalNumU32.nextIndex);
      dump([funcLocalNum], "num locals");
      var locals = [];

      for (var _i = 0; _i < funcLocalNum; _i++) {
        var _startLoc5 = getPosition(),

          localCountU32 = readU32(),
          localCount = localCountU32.value;
        eatBytes(localCountU32.nextIndex);
        dump([localCount], "num local");
        var valtypeByte = readByte();
        eatBytes(1);
        var type = valtypes[valtypeByte],
          args = [];

        for (var _i2 = 0; _i2 < localCount; _i2++) args.push(t.valtypeLiteral(type));

        var localNode = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.instruction("local", args), endLoc, _startLoc5);
        })();

        locals.push(localNode);
        dump([valtypeByte], type);

        if (type === void 0) throw new CompileError("Unexpected valtype: " + toHex(valtypeByte));
      }

      code.push.apply(code, locals);

      parseInstructionBlock(code);
      var endLoc = getPosition();
      state.elementsInCodeSection.push({
        code: code,
        locals: locals,
        endLoc: endLoc,
        startLoc: _startLoc4,
        bodySize: bodySizeU32.value
      });
    }
  }

  function parseInstructionBlock(code) {
    while (1) {
      var _startLoc6 = getPosition(),

        instructionAlreadyCreated = false,
        instructionByte = readByte();
      eatBytes(1);

      if (instructionByte === 0xfe) throw new CompileError("Atomic instructions are not implemented");

      var instruction = symbolsByByte[instructionByte];

      if (instruction === void 0) throw new CompileError("Unexpected instruction: " + toHex(instructionByte));

      typeof instruction.object == "string"
        ? dump([instructionByte], "" + instruction.object + "." + instruction.name)
        : dump([instructionByte], instruction.name);

      if (instruction.name === "end") {
        var node = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.instruction(instruction.name), endLoc, _startLoc6);
        })();

        code.push(node);
        break;
      }

      var args = [];

      if (instruction.name === "loop") {
        var _startLoc7 = getPosition(),

          blocktypeByte = readByte();
        eatBytes(1);
        var blocktype = blockTypes[blocktypeByte];
        dump([blocktypeByte], "blocktype");

        if (blocktype === void 0) throw new CompileError("Unexpected blocktype: " + toHex(blocktypeByte));

        var instr = [];
        parseInstructionBlock(instr);

        var label = t.withRaw(t.identifier(getUniqueName("loop")), "");

        var loopNode = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.loopInstruction(label, blocktype, instr), endLoc, _startLoc7);
        })();

        code.push(loopNode);
        instructionAlreadyCreated = true;
      } else if (instruction.name === "if") {
        var _startLoc8 = getPosition(),

          _blocktypeByte = readByte();

        eatBytes(1);
        var _blocktype = blockTypes[_blocktypeByte];
        dump([_blocktypeByte], "blocktype");

        if (_blocktype === void 0) throw new CompileError("Unexpected blocktype: " + toHex(_blocktypeByte));

        var testIndex = t.withRaw(t.identifier(getUniqueName("if")), ""),
          ifBody = [];
        parseInstructionBlock(ifBody);

        var elseIndex = 0;

        for (var _instr; elseIndex < ifBody.length; ++elseIndex)
          if ((_instr = ifBody[elseIndex]).type === "Instr" && _instr.id === "else") break;

        var consequentInstr = ifBody.slice(0, elseIndex),
          alternate = ifBody.slice(elseIndex + 1),

          testInstrs = [];

        var ifNode = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.ifInstruction(testIndex, testInstrs, _blocktype, consequentInstr, alternate), endLoc, _startLoc8);
        })();

        code.push(ifNode);
        instructionAlreadyCreated = true;
      } else if (instruction.name === "block") {
        var _startLoc9 = getPosition(),

          _blocktypeByte2 = readByte();

        eatBytes(1);
        var _blocktype2 = blockTypes[_blocktypeByte2];
        dump([_blocktypeByte2], "blocktype");

        if (_blocktype2 === void 0) throw new CompileError("Unexpected blocktype: " + toHex(_blocktypeByte2));

        var _instr2 = [];
        parseInstructionBlock(_instr2);

        var _label = t.withRaw(t.identifier(getUniqueName("block")), "");

        var blockNode = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.blockInstruction(_label, _instr2, _blocktype2), endLoc, _startLoc9);
        })();

        code.push(blockNode);
        instructionAlreadyCreated = true;
      } else if (instruction.name === "call") {
        var indexu32 = readU32(),
          index = indexu32.value;
        eatBytes(indexu32.nextIndex);
        dump([index], "index");

        var callNode = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.callInstruction(t.indexLiteral(index)), endLoc, _startLoc6);
        })();

        code.push(callNode);
        instructionAlreadyCreated = true;
      } else if (instruction.name === "call_indirect") {
        var _startLoc10 = getPosition(),

          indexU32 = readU32(),
          typeindex = indexU32.value;
        eatBytes(indexU32.nextIndex);
        dump([typeindex], "type index");
        var signature = state.typesInModule[typeindex];

        if (signature === void 0) throw new CompileError("call_indirect signature not found (" + typeindex + ")");

        var _callNode = t.callIndirectInstruction(t.signature(signature.params, signature.result), []),

          flagU32 = readU32(),
          flag = flagU32.value;

        eatBytes(flagU32.nextIndex);

        if (flag !== 0) throw new CompileError("zero flag expected");

        code.push((function () {
          var endLoc = getPosition();
          return t.withLoc(_callNode, endLoc, _startLoc10);
        })());
        instructionAlreadyCreated = true;
      } else if (instruction.name === "br_table") {
        var indicesu32 = readU32(),
          indices = indicesu32.value;
        eatBytes(indicesu32.nextIndex);
        dump([indices], "num indices");

        for (var i = 0; i <= indices; i++) {
          var _indexu = readU32(),

            _index = _indexu.value;
          eatBytes(_indexu.nextIndex);
          dump([_index], "index");
          args.push(t.numberLiteralFromRaw(_indexu.value.toString(), "u32"));
        }
      } else if (instructionByte >= 0x28 && instructionByte <= 0x40)
        if (instruction.name === "grow_memory" || instruction.name === "current_memory") {
          var _indexU = readU32(),

            _index2 = _indexU.value;
          eatBytes(_indexU.nextIndex);

          if (_index2 !== 0) throw new Error("zero flag expected");

          dump([_index2], "index");
        } else {
          var aligun32 = readU32(),
            align = aligun32.value;
          eatBytes(aligun32.nextIndex);
          dump([align], "align");
          var offsetu32 = readU32(),
            _offset2 = offsetu32.value;
          eatBytes(offsetu32.nextIndex);
          dump([_offset2], "offset");
        }
      else if (instructionByte >= 0x41 && instructionByte <= 0x44) {
        if (instruction.object === "i32") {
          var value32 = read32(),
            value = value32.value;
          eatBytes(value32.nextIndex);
          dump([value], "i32 value");
          args.push(t.numberLiteralFromRaw(value));
        }

        if (instruction.object === "u32") {
          var valueu32 = readU32(),
            _value = valueu32.value;
          eatBytes(valueu32.nextIndex);
          dump([_value], "u32 value");
          args.push(t.numberLiteralFromRaw(_value));
        }

        if (instruction.object === "i64") {
          var value64 = read64(),
            _value2 = value64.value;
          eatBytes(value64.nextIndex);
          dump([Number(_value2.toString())], "i64 value");

          var _node = { type: "LongNumberLiteral", value: { high: _value2.high, low: _value2.low } };
          args.push(_node);
        }

        if (instruction.object === "u64") {
          var valueu64 = readU64(),
            _value3 = valueu64.value;
          eatBytes(valueu64.nextIndex);
          dump([Number(_value3.toString())], "u64 value");

          var _node2 = { type: "LongNumberLiteral", value: { high: _value3.high, low: _value3.low } };
          args.push(_node2);
        }

        if (instruction.object === "f32") {
          var valuef32 = readF32(),
            _value4 = valuef32.value;
          eatBytes(valuef32.nextIndex);
          dump([_value4], "f32 value");
          args.push(t.floatLiteral(_value4, valuef32.nan, valuef32.inf, String(_value4)));
        }

        if (instruction.object === "f64") {
          var valuef64 = readF64(),
            _value5 = valuef64.value;
          eatBytes(valuef64.nextIndex);
          dump([_value5], "f64 value");
          args.push(t.floatLiteral(_value5, valuef64.nan, valuef64.inf, String(_value5)));
        }
      } else
        for (var _i3 = 0; _i3 < instruction.numberOfArgs; _i3++) {
          var u32 = readU32();
          eatBytes(u32.nextIndex);
          dump([u32.value], "argument " + _i3);
          args.push(t.numberLiteralFromRaw(u32.value));
        }

      if (instructionAlreadyCreated === false)
        if (typeof instruction.object == "string") {
          var _node3 = (function () {
            var endLoc = getPosition();
            return t.withLoc(t.objectInstruction(instruction.name, instruction.object, args), endLoc, _startLoc6);
          })();

          code.push(_node3);
        } else {
          var _node4 = (function () {
            var endLoc = getPosition();
            return t.withLoc(t.instruction(instruction.name, args), endLoc, _startLoc6);
          })();

          code.push(_node4);
        }
    }
  }

  function parseLimits() {
    var min, max,
      limitType = readByte();
    eatBytes(1);
    dump([limitType], "limit type");

    if (limitType === 1 || limitType === 3) {
      var u32min = readU32();
      min = parseInt(u32min.value);
      eatBytes(u32min.nextIndex);
      dump([min], "min");
      var u32max = readU32();
      max = parseInt(u32max.value);
      eatBytes(u32max.nextIndex);
      dump([max], "max");
    }

    if (limitType === 0) {
      var _u32min = readU32();

      min = parseInt(_u32min.value);
      eatBytes(_u32min.nextIndex);
      dump([min], "min");
    }

    return t.limit(min, max);
  }

  function parseTableType(index) {
    var name = t.withRaw(t.identifier(getUniqueName("table")), String(index)),
      elementTypeByte = readByte();
    eatBytes(1);
    dump([elementTypeByte], "element type");
    var elementType = tableTypes[elementTypeByte];

    if (elementType === void 0) throw new CompileError("Unknown element type in table: " + toHex(elementType));

    var limits = parseLimits();
    return t.table(elementType, limits, name);
  }

  function parseGlobalType() {
    var valtypeByte = readByte();
    eatBytes(1);
    var type = valtypes[valtypeByte];
    dump([valtypeByte], type);

    if (type === void 0) throw new CompileError("Unknown valtype: " + toHex(valtypeByte));

    var globalTypeByte = readByte();
    eatBytes(1);
    var globalType = globalTypes[globalTypeByte];
    dump([globalTypeByte], "global type (" + globalType + ")");

    if (globalType === void 0) throw new CompileError("Invalid mutability: " + toHex(globalTypeByte));

    return t.globalType(type, globalType);
  }

  function parseNameSectionFunctions() {
    var functionNames = [],
      numberOfFunctionsu32 = readU32(),
      numbeOfFunctions = numberOfFunctionsu32.value;
    eatBytes(numberOfFunctionsu32.nextIndex);

    for (var i = 0; i < numbeOfFunctions; i++) {
      var indexu32 = readU32(),
        index = indexu32.value;
      eatBytes(indexu32.nextIndex);
      var name = readUTF8String();
      eatBytes(name.nextIndex);
      functionNames.push(t.functionNameMetadata(name.value, index));
    }

    return functionNames;
  }

  function parseNameSectionLocals() {
    var localNames = [],
      numbeOfFunctionsu32 = readU32(),
      numbeOfFunctions = numbeOfFunctionsu32.value;
    eatBytes(numbeOfFunctionsu32.nextIndex);

    for (var i = 0; i < numbeOfFunctions; i++) {
      var functionIndexu32 = readU32(),
        functionIndex = functionIndexu32.value;
      eatBytes(functionIndexu32.nextIndex);
      var numLocalsu32 = readU32(),
        numLocals = numLocalsu32.value;
      eatBytes(numLocalsu32.nextIndex);

      for (var _i4 = 0; _i4 < numLocals; _i4++) {
        var localIndexu32 = readU32(),
          localIndex = localIndexu32.value;
        eatBytes(localIndexu32.nextIndex);
        var name = readUTF8String();
        eatBytes(name.nextIndex);
        localNames.push(t.localNameMetadata(name.value, localIndex, functionIndex));
      }
    }

    return localNames;
  }

  function parseNameSection(remainingBytes) {
    var nameMetadata = [],
      initialOffset = offset;

    while (offset - initialOffset < remainingBytes) {
      var sectionTypeByte = readVaruint7();
      eatBytes(sectionTypeByte.nextIndex);

      var subSectionSizeInBytesu32 = readVaruint32();
      eatBytes(subSectionSizeInBytesu32.nextIndex);

      switch (sectionTypeByte.value) {
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
  }

  function parseProducersSection() {
    var metadata = t.producersSectionMetadata([]),

      sectionTypeByte = readVaruint32();
    eatBytes(sectionTypeByte.nextIndex);
    dump([sectionTypeByte.value], "num of producers");

    for (var fields = { language: [], "processed-by": [], sdk: [] }, fieldI = 0; fieldI < sectionTypeByte.value; fieldI++) {
      var fieldName = readUTF8String();
      eatBytes(fieldName.nextIndex);

      var valueCount = readVaruint32();
      eatBytes(valueCount.nextIndex);

      for (var producerI = 0; producerI < valueCount.value; producerI++) {
        var producerName = readUTF8String();
        eatBytes(producerName.nextIndex);
        var producerVersion = readUTF8String();
        eatBytes(producerVersion.nextIndex);
        fields[fieldName.value].push(t.producerMetadataVersionedName(producerName.value, producerVersion.value));
      }

      metadata.producers.push(fields[fieldName.value]);
    }

    return metadata;
  }

  function parseGlobalSection(numberOfGlobals) {
    var globals = [];
    dump([numberOfGlobals], "num globals");

    for (var i = 0; i < numberOfGlobals; i++) {
      var _startLoc11 = getPosition(),
        globalType = parseGlobalType(),

        init = [];
      parseInstructionBlock(init);

      var node = (function () {
        var endLoc = getPosition();
        return t.withLoc(t.global(globalType, init), endLoc, _startLoc11);
      })();

      globals.push(node);
      state.globalsInModule.push(node);
    }

    return globals;
  }

  function parseElemSection(numberOfElements) {
    var elems = [];
    dump([numberOfElements], "num elements");

    for (var i = 0; i < numberOfElements; i++) {
      var _startLoc12 = getPosition(),

        tableindexu32 = readU32(),
        tableindex = tableindexu32.value;
      eatBytes(tableindexu32.nextIndex);
      dump([tableindex], "table index");

      var instr = [];
      parseInstructionBlock(instr);

      var indicesu32 = readU32(),
        indices = indicesu32.value;
      eatBytes(indicesu32.nextIndex);
      dump([indices], "num indices");
      var indexValues = [];

      for (var _i5 = 0; _i5 < indices; _i5++) {
        var indexu32 = readU32(),
          index = indexu32.value;
        eatBytes(indexu32.nextIndex);
        dump([index], "index");
        indexValues.push(t.indexLiteral(index));
      }

      var elemNode = (function () {
        var endLoc = getPosition();
        return t.withLoc(t.elem(t.indexLiteral(tableindex), instr, indexValues), endLoc, _startLoc12);
      })();

      elems.push(elemNode);
    }

    return elems;
  }

  function parseMemoryType(i) {
    var limits = parseLimits();
    return t.memory(limits, t.indexLiteral(i));
  }

  function parseTableSection(numberOfElements) {
    var tables = [];
    dump([numberOfElements], "num elements");

    for (var i = 0; i < numberOfElements; i++) {
      var tablesNode = parseTableType(i);
      state.tablesInModule.push(tablesNode);
      tables.push(tablesNode);
    }

    return tables;
  }

  function parseMemorySection(numberOfElements) {
    var memories = [];
    dump([numberOfElements], "num elements");

    for (var i = 0; i < numberOfElements; i++) {
      var memoryNode = parseMemoryType(i);
      state.memoriesInModule.push(memoryNode);
      memories.push(memoryNode);
    }

    return memories;
  }

  function parseStartSection() {
    var startLoc = getPosition(),
      u32 = readU32(),
      startFuncIndex = u32.value;
    eatBytes(u32.nextIndex);
    dump([startFuncIndex], "index");
    return (function () {
      var endLoc = getPosition();
      return t.withLoc(t.start(t.indexLiteral(startFuncIndex)), endLoc, startLoc);
    })();
  }

  function parseDataSection(numberOfElements) {
    var dataEntries = [];
    dump([numberOfElements], "num elements");

    for (var i = 0; i < numberOfElements; i++) {
      var memoryIndexu32 = readU32(),
        memoryIndex = memoryIndexu32.value;
      eatBytes(memoryIndexu32.nextIndex);
      dump([memoryIndex], "memory index");
      var instrs = [];
      parseInstructionBlock(instrs);

      if (instrs.filter(function (i) { return i.id !== "end"; }).length !== 1)
        throw new CompileError("data section offset must be a single instruction");

      var bytes = parseVec(function (b) {
        return b;
      });
      dump([], "init");
      dataEntries.push(t.data(t.memIndexLiteral(memoryIndex), instrs[0], t.byteArray(bytes)));
    }

    return dataEntries;
  }

  function parseSection(sectionIndex) {
    var sectionId = readByte();
    eatBytes(1);

    if (sectionId >= sectionIndex || sectionIndex === sections.custom) sectionIndex = sectionId + 1;
    else if (sectionId !== sections.custom) throw new CompileError("Unexpected section: " + toHex(sectionId));

    var nextSectionIndex = sectionIndex,
      startOffset = offset,
      startLoc = getPosition(),
      u32 = readU32(),
      sectionSizeInBytes = u32.value;
    eatBytes(u32.nextIndex);

    var sectionSizeInBytesNode = (function () {
      var endLoc = getPosition();
      return t.withLoc(t.numberLiteralFromRaw(sectionSizeInBytes), endLoc, startLoc);
    })();

    switch (sectionId) {
      case sections.type:
        dumpSep("section Type");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc13 = getPosition(),
          _u = readU32(),

          numberOfTypes = _u.value;
        eatBytes(_u.nextIndex);

        var _metadata = t.sectionMetadata("type", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfTypes), endLoc, _startLoc13);
        })());

        return { nodes: parseTypeSection(numberOfTypes), metadata: _metadata, nextSectionIndex: nextSectionIndex };

      case sections.table:
        dumpSep("section Table");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc14 = getPosition(),
          _u2 = readU32(),

          numberOfTable = _u2.value;
        eatBytes(_u2.nextIndex);
        dump([numberOfTable], "num tables");

        var _metadata2 = t.sectionMetadata("table", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfTable), endLoc, _startLoc14);
        })());

        return { nodes: parseTableSection(numberOfTable), metadata: _metadata2, nextSectionIndex: nextSectionIndex };

      case sections.import:
        dumpSep("section Import");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc15 = getPosition(),

          numberOfImportsu32 = readU32(),
          numberOfImports = numberOfImportsu32.value;
        eatBytes(numberOfImportsu32.nextIndex);
        dump([numberOfImports], "number of imports");

        var _metadata3 = t.sectionMetadata("import", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfImports), endLoc, _startLoc15);
        })());

        return { nodes: parseImportSection(numberOfImports), metadata: _metadata3, nextSectionIndex: nextSectionIndex };

      case sections.func:
        dumpSep("section Function");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc16 = getPosition(),

          numberOfFunctionsu32 = readU32(),
          numberOfFunctions = numberOfFunctionsu32.value;
        eatBytes(numberOfFunctionsu32.nextIndex);

        var _metadata4 = t.sectionMetadata("func", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfFunctions), endLoc, _startLoc16);
        })());

        parseFuncSection(numberOfFunctions);
        return { nodes: [], metadata: _metadata4, nextSectionIndex: nextSectionIndex };

      case sections.export:
        dumpSep("section Export");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc17 = getPosition(),
          _u3 = readU32(),

          numberOfExport = _u3.value;
        eatBytes(_u3.nextIndex);

        var _metadata5 = t.sectionMetadata("export", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfExport), endLoc, _startLoc17);
        })());

        parseExportSection(numberOfExport);
        return { nodes: [], metadata: _metadata5, nextSectionIndex: nextSectionIndex };

      case sections.code:
        dumpSep("section Code");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc18 = getPosition(),
          _u4 = readU32(),

          numberOfFuncs = _u4.value;
        eatBytes(_u4.nextIndex);

        var _metadata6 = t.sectionMetadata("code", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfFuncs), endLoc, _startLoc18);
        })());

        opts.ignoreCodeSection === true ? eatBytes(sectionSizeInBytes - _u4.nextIndex) : parseCodeSection(numberOfFuncs);

        return { nodes: [], metadata: _metadata6, nextSectionIndex: nextSectionIndex };

      case sections.start:
        dumpSep("section Start");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _metadata7 = t.sectionMetadata("start", startOffset, sectionSizeInBytesNode);

        return { nodes: [parseStartSection()], metadata: _metadata7, nextSectionIndex: nextSectionIndex };

      case sections.element:
        dumpSep("section Element");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc19 = getPosition(),

          numberOfElementsu32 = readU32(),
          numberOfElements = numberOfElementsu32.value;
        eatBytes(numberOfElementsu32.nextIndex);

        var _metadata8 = t.sectionMetadata("element", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfElements), endLoc, _startLoc19);
        })());

        return { nodes: parseElemSection(numberOfElements), metadata: _metadata8, nextSectionIndex: nextSectionIndex };

      case sections.global:
        dumpSep("section Global");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc20 = getPosition(),

          numberOfGlobalsu32 = readU32(),
          numberOfGlobals = numberOfGlobalsu32.value;
        eatBytes(numberOfGlobalsu32.nextIndex);

        var _metadata9 = t.sectionMetadata("global", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(numberOfGlobals), endLoc, _startLoc20);
        })());

        return { nodes: parseGlobalSection(numberOfGlobals), metadata: _metadata9, nextSectionIndex: nextSectionIndex };

      case sections.memory:
        dumpSep("section Memory");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _startLoc21 = getPosition(),
          _numberOfElementsu = readU32(),

          _numberOfElements = _numberOfElementsu.value;
        eatBytes(_numberOfElementsu.nextIndex);

        var _metadata10 = t.sectionMetadata("memory", startOffset, sectionSizeInBytesNode, (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(_numberOfElements), endLoc, _startLoc21);
        })());

        return { nodes: parseMemorySection(_numberOfElements), metadata: _metadata10, nextSectionIndex: nextSectionIndex };

      case sections.data:
        dumpSep("section Data");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");

        var _metadata11 = t.sectionMetadata("data", startOffset, sectionSizeInBytesNode),

          _startLoc22 = getPosition(),
          _numberOfElementsu2 = readU32(),

          _numberOfElements2 = _numberOfElementsu2.value;
        eatBytes(_numberOfElementsu2.nextIndex);

        _metadata11.vectorOfSize = (function () {
          var endLoc = getPosition();
          return t.withLoc(t.numberLiteralFromRaw(_numberOfElements2), endLoc, _startLoc22);
        })();

        if (opts.ignoreDataSection === true) {
          eatBytes(sectionSizeInBytes - _numberOfElementsu2.nextIndex);

          dumpSep("ignore data (" + sectionSizeInBytes + " bytes)");
          return { nodes: [], metadata: _metadata11, nextSectionIndex: nextSectionIndex };
        }

        return { nodes: parseDataSection(_numberOfElements2), metadata: _metadata11, nextSectionIndex: nextSectionIndex };

      case sections.custom:
        dumpSep("section Custom");
        dump([sectionId], "section code");
        dump([sectionSizeInBytes], "section size");
        var _metadata12 = [t.sectionMetadata("custom", startOffset, sectionSizeInBytesNode)],
          sectionName = readUTF8String();
        eatBytes(sectionName.nextIndex);
        dump([], "section name (" + sectionName.value + ")");

        var _remainingBytes2 = sectionSizeInBytes - sectionName.nextIndex;

        if (sectionName.value === "name") {
          var initialOffset = offset;

          try {
            _metadata12.push.apply(_metadata12, parseNameSection(_remainingBytes2));
          } catch (e) {
            console.warn('Failed to decode custom "name" section @' + offset + "; ignoring (" + e.message + ").");
            eatBytes(offset - (initialOffset + _remainingBytes2));
          }
        } else if (sectionName.value === "producers") {
          var _initialOffset = offset;

          try {
            _metadata12.push(parseProducersSection());
          } catch (e) {
            console.warn('Failed to decode custom "producers" section @' + offset + "; ignoring (" + e.message + ").");
            eatBytes(offset - (_initialOffset + _remainingBytes2));
          }
        } else {
          eatBytes(_remainingBytes2);
          dumpSep("ignore custom " + JSON.stringify(sectionName.value) + " section (" + _remainingBytes2 + " bytes)");
        }

        return { nodes: [], metadata: _metadata12, nextSectionIndex: nextSectionIndex };
    }

    throw new CompileError("Unexpected section: " + toHex(sectionId));
  }

  parseModuleHeader();
  parseVersion();
  var moduleFields = [],
    sectionIndex = 0,
    moduleMetadata = { sections: [], functionNames: [], localNames: [], producers: [] };

  while (offset < buf.length) {
    var _parseSection = parseSection(sectionIndex),
      _nodes12 = _parseSection.nodes,
      _metadata13 = _parseSection.metadata,
      nextSectionIndex = _parseSection.nextSectionIndex;

    moduleFields.push.apply(moduleFields, _nodes12);
    (Array.isArray(_metadata13) ? _metadata13 : [_metadata13]).forEach(function (metadataItem) {
      metadataItem.type === "FunctionNameMetadata"
        ? moduleMetadata.functionNames.push(metadataItem)
        : metadataItem.type === "LocalNameMetadata"
        ? moduleMetadata.localNames.push(metadataItem)
        : metadataItem.type === "ProducersSectionMetadata"
        ? moduleMetadata.producers.push(metadataItem)
        : moduleMetadata.sections.push(metadataItem);
    });

    if (nextSectionIndex) sectionIndex = nextSectionIndex;
  }

  var funcIndex = 0;
  state.functionsInModule.forEach(function (func) {
    var params = func.signature.params,
      result = func.signature.result,
      body = [];

    if (func.isExternal === true) return;

    var decodedElementInCodeSection = state.elementsInCodeSection[funcIndex];

    if (opts.ignoreCodeSection === false) {
      if (decodedElementInCodeSection === void 0) throw new CompileError("func " + toHex(funcIndex) + " code not found");

      body = decodedElementInCodeSection.code;
    }

    funcIndex++;
    var funcNode = t.func(func.id, t.signature(params, result), body);

    if (func.isExternal === true) funcNode.isExternal = func.isExternal;

    if (opts.ignoreCodeSection === false) {
      var _startLoc23 = decodedElementInCodeSection.startLoc,
        endLoc = decodedElementInCodeSection.endLoc,
        bodySize = decodedElementInCodeSection.bodySize;
      (funcNode = t.withLoc(funcNode, endLoc, _startLoc23)).metadata = { bodySize: bodySize };
    }

    moduleFields.push(funcNode);
  });
  state.elementsInExportSection.forEach(function (moduleExport) {
    moduleExport.id == null ||
      moduleFields.push(t.withLoc(
        t.moduleExport(moduleExport.name, t.moduleExportDescr(moduleExport.type, moduleExport.id)),
        moduleExport.endLoc,
        moduleExport.startLoc
      ));
  });
  dumpSep("end of program");
  var module = t.module(
    null,
    moduleFields,
    t.moduleMetadata(moduleMetadata.sections, moduleMetadata.functionNames, moduleMetadata.localNames, moduleMetadata.producers)
  );
  return t.program([module]);
}

var defaultDecoderOpts = {
  dump: false,
  ignoreCodeSection: false,
  ignoreDataSection: false,
  ignoreCustomNameSection: false
};

function restoreFunctionNames(ast) {
  var functionNames = [];
  t.traverse(ast, {
    FunctionNameMetadata: function (_ref) {
      var node = _ref.node;
      functionNames.push({ name: node.value, index: node.index });
    }
  });

  if (functionNames.length === 0) return;

  t.traverse(ast, {
    Func: (function (_Func) {
      function Func() {
        return _Func.apply(this, arguments);
      }

      Func.toString = function () {
        return _Func.toString();
      };

      return Func;
    })(function (_ref2) {
      var nodeName = _ref2.node.name,
        indexBasedFunctionName = nodeName.value,
        index = Number(indexBasedFunctionName.replace("func_", "")),
        functionName = functionNames.find(function (f) {
          return f.index === index;
        });

      if (functionName) {
        var oldValue = nodeName.value;
        nodeName.value = functionName.name;
        nodeName.numeric = oldValue;

        delete nodeName.raw;
      }
    }),
    ModuleExport: (function (_ModuleExport) {
      function ModuleExport() {
        return _ModuleExport.apply(this, arguments);
      }

      ModuleExport.toString = function () {
        return _ModuleExport.toString();
      };

      return ModuleExport;
    })(function (_ref3) {
      var node = _ref3.node;

      if (node.descr.exportType === "Func") {
        var index = node.descr.id.value,
          functionName = functionNames.find(function (f) {
            return f.index === index;
          });

        if (functionName) node.descr.id = t.identifier(functionName.name);
      }
    }),
    ModuleImport: (function (_ModuleImport) {
      function ModuleImport() {
        return _ModuleImport.apply(this, arguments);
      }

      ModuleImport.toString = function () {
        return _ModuleImport.toString();
      };

      return ModuleImport;
    })(function (_ref4) {
      var node = _ref4.node;

      if (node.descr.type === "FuncImportDescr") {
        var indexBasedFunctionName = node.descr.id,
          index = Number(indexBasedFunctionName.replace("func_", "")),
          functionName = functionNames.find(function (f) {
            return f.index === index;
          });

        if (functionName) node.descr.id = t.identifier(functionName.name);
      }
    }),
    CallInstruction: (function (_CallInstruction) {
      function CallInstruction() {
        return _CallInstruction.apply(this, arguments);
      }

      CallInstruction.toString = function () {
        return _CallInstruction.toString();
      };

      return CallInstruction;
    })(function (nodePath) {
      var node = nodePath.node,
        index = node.index.value,
        functionName = functionNames.find(function (f) {
          return f.index === index;
        });

      if (functionName) {
        var oldValue = node.index;
        node.index = t.identifier(functionName.name);
        node.numeric = oldValue;

        delete node.raw;
      }
    })
  });
}

function restoreLocalNames(ast) {
  var localNames = [];
  t.traverse(ast, {
    LocalNameMetadata: function (_ref5) {
      var node = _ref5.node;
      localNames.push({ name: node.value, localIndex: node.localIndex, functionIndex: node.functionIndex });
    }
  });

  if (localNames.length === 0) return;

  t.traverse(ast, {
    Func: (function (_Func2) {
      function Func() {
        return _Func2.apply(this, arguments);
      }

      Func.toString = function () {
        return _Func2.toString();
      };

      return Func;
    })(function (_ref6) {
      var node = _ref6.node,
        signature = node.signature;

      if (signature.type !== "Signature") return;

      var indexBasedFunctionName = node.name.value,
        functionIndex = Number(indexBasedFunctionName.replace("func_", ""));
      signature.params.forEach(function (param, paramIndex) {
        var paramName = localNames.find(function (f) {
          return f.localIndex === paramIndex && f.functionIndex === functionIndex;
        });

        if (paramName && paramName.name !== "") param.id = paramName.name;
      });
    })
  });
}

function restoreModuleName(ast) {
  t.traverse(ast, {
    ModuleNameMetadata: (function (_ModuleNameMetadata) {
      function ModuleNameMetadata() {
        return _ModuleNameMetadata.apply(this, arguments);
      }

      ModuleNameMetadata.toString = function () {
        return _ModuleNameMetadata.toString();
      };

      return ModuleNameMetadata;
    })(function (moduleNameMetadataPath) {
      t.traverse(ast, {
        Module: (function (_Module) {
          function Module() {
            return _Module.apply(this, arguments);
          }

          Module.toString = function () {
            return _Module.toString();
          };

          return Module;
        })(function (_ref7) {
          var node = _ref7.node,
            name = moduleNameMetadataPath.node.value;

          if (name === "") name = null;

          node.id = name;
        })
      });
    })
  });
}

function decode$2(buf, customOpts) {
  var opts = Object.assign({}, defaultDecoderOpts, customOpts),
    ast = decode$1(buf, opts);

  if (opts.ignoreCustomNameSection === false) {
    restoreFunctionNames(ast);
    restoreLocalNames(ast);
    restoreModuleName(ast);
  }

  return ast;
}

exports.decode = decode$2;

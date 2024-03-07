"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var wasmParser = require("./wasm-parser"),
  t = require("./wasm-ast");

function extract(buffer, bitIndex, bitLength, defaultBit) {
  if (bitLength < 0 || bitLength > 32) throw new Error("Bad value for bitLength.");

  if (defaultBit === void 0) defaultBit = 0;
  else if (defaultBit !== 0 && defaultBit !== 1) throw new Error("Bad value for defaultBit.");

  var defaultByte = defaultBit * 0xff,
    result = 0,

    lastBit = bitIndex + bitLength,
    startByte = Math.floor(bitIndex / 8),
    startBit = bitIndex % 8,
    endByte = Math.floor(lastBit / 8),
    endBit = lastBit % 8;

  if (endBit !== 0) result = get(endByte) & ((1 << endBit) - 1);

  while (endByte > startByte) result = (result << 8) | get(--endByte);

  return result >>> startBit;

  function get(index) {
    var result = buffer[index];
    return result === void 0 ? defaultByte : result;
  }
}

function getSign(buffer) {
  return buffer[buffer.length - 1] >>> 7;
}

function highOrder(bit, buffer) {
  var length = buffer.length,
    fullyWrongByte = 0xff * (bit ^ 1);

  while (length > 0 && buffer[length - 1] === fullyWrongByte) length--;

  if (length === 0) return -1;

  var byteToCheck = buffer[length - 1],
    result = length * 8 - 1;

  for (var i = 7; i > 0 && ((byteToCheck >> i) & 1) !== bit; i--) result--;

  return result;
}

var bufPool = [],

  TEMP_BUF_MAXIMUM_LENGTH = 20,
  MIN_EXACT_INT64 = -0x8000000000000000,
  MAX_EXACT_INT64 = 0x7ffffffffffffc00,
  MAX_EXACT_UINT64 = 0xfffffffffffff800,
  BIT_32 = 0x100000000,
  BIT_64 = 0x10000000000000000;

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

function writeInt64(value, buffer) {
  if (value < MIN_EXACT_INT64 || value > MAX_EXACT_INT64) throw new Error("Value out of range.");

  if (value < 0) value += BIT_64;

  writeUInt64(value, buffer);
}

function writeUInt64(value, buffer) {
  if (value < 0 || value > MAX_EXACT_UINT64) throw new Error("Value out of range.");

  var lowWord = value % BIT_32,
    highWord = Math.floor(value / BIT_32);
  buffer.writeUInt32LE(lowWord, 0);
  buffer.writeUInt32LE(highWord, 4);
}

function signedBitCount(buffer) {
  return highOrder(getSign(buffer) ^ 1, buffer) + 2;
}

function unsignedBitCount(buffer) {
  return highOrder(1, buffer) + 1 || 1;
}

function encodeBufferCommon(buffer, signed) {
  var signBit, bitCount;

  if (signed) {
    signBit = getSign(buffer);
    bitCount = signedBitCount(buffer);
  } else {
    signBit = 0;
    bitCount = unsignedBitCount(buffer);
  }

  var byteCount = Math.ceil(bitCount / 7),
    result = alloc(byteCount);

  for (var i = 0; i < byteCount; i++) {
    var payload = extract(buffer, i * 7, 7, signBit);
    result[i] = payload | 0x80;
  }

  result[byteCount - 1] &= 0x7f;
  return result;
}

function encodeIntBuffer(buffer) {
  return encodeBufferCommon(buffer, true);
}

function encodeInt32(num) {
  var buf = alloc(4);
  buf.writeInt32LE(num, 0);
  var result = encodeIntBuffer(buf);
  free(buf);
  return result;
}

function encodeInt64(num) {
  var buf = alloc(8);
  writeInt64(num, buf);
  var result = encodeIntBuffer(buf);
  free(buf);
  return result;
}

function encodeUIntBuffer(buffer) {
  return encodeBufferCommon(buffer, false);
}

function encodeUInt32(num) {
  var buf = alloc(4);
  buf.writeUInt32LE(num, 0);
  var result = encodeUIntBuffer(buf);
  free(buf);
  return result;
}

function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
    eLen = nBytes * 8 - mLen - 1,
    eMax = (1 << eLen) - 1,
    eBias = eMax >> 1,
    rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
    i = isLE ? 0 : nBytes - 1,
    d = isLE ? 1 : -1,
    s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }

    if ((value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias)) * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e += eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
}

var NUMBER_OF_BYTE_F32 = 4,
  NUMBER_OF_BYTE_F64 = 8,
  SINGLE_PRECISION_MANTISSA = 23,
  DOUBLE_PRECISION_MANTISSA = 52;
function encodeF32(v) {
  var buffer = [];
  write(buffer, v, 0, true, SINGLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F32);
  return buffer;
}
function encodeF64(v) {
  var buffer = [];
  write(buffer, v, 0, true, DOUBLE_PRECISION_MANTISSA, NUMBER_OF_BYTE_F64);
  return buffer;
}

function _toArray(arr) {
  return Array.isArray(arr) ? arr : Array.from(arr);
}

function con(n) {
  return 0x80 | (n & 0x3f);
}

function encode(str) {
  return _encode(str.split("").map(function (x) {
    return x.charCodeAt(0);
  }));
}

function _encode(arr) {
  if (arr.length === 0) return [];

  var _arr = _toArray(arr),
    n = _arr[0],
    ns = _arr.slice(1);

  if (n < 0) throw new Error("utf8");

  if (n < 0x80) return [n].concat(_encode(ns));

  if (n < 0x800) return [0xc0 | (n >>> 6), con(n)].concat(_encode(ns));

  if (n < 0x10000) return [0xe0 | (n >>> 12), con(n >>> 6), con(n)].concat(_encode(ns));

  if (n < 0x110000) return [0xf0 | (n >>> 18), con(n >>> 12), con(n >>> 6), con(n)].concat(_encode(ns));

  throw new Error("utf8");
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

var illegalop = "illegal";

function invertMap(obj) {
  var keyModifierFn = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function (k) { return k; },
    result = {},
    keys = Object.keys(obj);

  for (var i = 0, length = keys.length; i < length; i++) result[keyModifierFn(obj[keys[i]])] = keys[i];

  return result;
}

function createSymbolObject(name, object) {
  return { name: name, object: object, numberOfArgs: arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0 };
}

function createSymbol(name) {
  return { name: name, numberOfArgs: arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0 };
}
var exportTypes = { 0: "Func", 1: "Table", 2: "Mem", 3: "Global" },
  exportTypesByName = invertMap(exportTypes),
  valtypes = { 0x7f: "i32", 0x7e: "i64", 0x7d: "f32", 0x7c: "f64", 0x7b: "v128" },
  valtypesByString = invertMap(valtypes),
  globalTypes = { 0: "const", 1: "var" },
  globalTypesByString = invertMap(globalTypes);
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
var symbolsByName = invertMap(symbolsByByte, function (obj) {
  return typeof obj.object == "string" ? "" + obj.object + "." + obj.name : obj.name;
});

function assertNotIdentifierNode(n) {
  if (n.type === "Identifier") throw new Error("Unsupported node Identifier");
}
function encodeU32(v) {
  var uint8view = new Uint8Array(encodeUInt32(v));
  return Array.from(uint8view);
}
function encodeI32(v) {
  var uint8view = new Uint8Array(encodeInt32(v));
  return Array.from(uint8view);
}
function encodeI64(v) {
  var uint8view = new Uint8Array(encodeInt64(v));
  return Array.from(uint8view);
}
function encodeVec(elements) {
  return encodeU32(elements.length).concat(elements);
}
function encodeValtype(v) {
  var byte = valtypesByString[v];

  if (byte === void 0) throw new Error("Unknown valtype: " + v);

  return parseInt(byte, 10);
}
function encodeMutability(v) {
  var byte = globalTypesByString[v];

  if (byte === void 0) throw new Error("Unknown mutability: " + v);

  return parseInt(byte, 10);
}
function encodeUTF8Vec(str) {
  return encodeVec(encode(str));
}
function encodeLimits(n) {
  var out = [];

  if (typeof n.max == "number") {
    out.push(0x01);
    out.push.apply(out, encodeU32(n.min));

    out.push.apply(out, encodeU32(n.max));
  } else {
    out.push(0x00);
    out.push.apply(out, encodeU32(n.min));
  }

  return out;
}
function encodeModuleImport(n) {
  var out = [];
  out.push.apply(out, encodeUTF8Vec(n.module));
  out.push.apply(out, encodeUTF8Vec(n.name));

  switch (n.descr.type) {
    case "GlobalType":
      out.push(0x03);

      out.push(encodeValtype(n.descr.valtype));

      out.push(encodeMutability(n.descr.mutability));
      break;

    case "Memory":
      out.push(0x02);

      out.push.apply(out, encodeLimits(n.descr.limits));
      break;

    case "Table":
      out.push(0x01);
      out.push(0x70);

      out.push.apply(out, encodeLimits(n.descr.limits));
      break;

    case "FuncImportDescr":
      out.push(0x00);

      assertNotIdentifierNode(n.descr.id);

      out.push.apply(out, encodeU32(n.descr.id.value));
      break;

    default:
      throw new Error("Unsupport operation: encode module import of type: " + n.descr.type);
  }

  return out;
}
function encodeSectionMetadata(n) {
  var out = [],
    sectionId = sections[n.section];

  if (sectionId === void 0) throw new Error("Unknown section: " + n.section);

  if (n.section === "start") throw new Error("Unsupported section encoding of type start");

  out.push(sectionId);
  out.push.apply(out, encodeU32(n.size.value));
  out.push.apply(out, encodeU32(n.vectorOfSize.value));
  return out;
}
function encodeCallInstruction(n) {
  var out = [];
  assertNotIdentifierNode(n.index);
  out.push(0x10);

  out.push.apply(out, encodeU32(n.index.value));
  return out;
}
function encodeCallIndirectInstruction(n) {
  var out = [];

  assertNotIdentifierNode(n.index);
  out.push(0x11);

  out.push.apply(out, encodeU32(n.index.value));

  out.push(0x00);
  return out;
}
function encodeModuleExport(n) {
  var out = [];
  assertNotIdentifierNode(n.descr.id);
  var exportTypeByteString = exportTypesByName[n.descr.exportType];

  if (exportTypeByteString === void 0) throw new Error("Unknown export of type: " + n.descr.exportType);

  var exportTypeByte = parseInt(exportTypeByteString, 10);
  out.push.apply(out, encodeUTF8Vec(n.name));
  out.push(exportTypeByte);

  out.push.apply(out, encodeU32(n.descr.id.value));
  return out;
}
function encodeTypeInstruction(n) {
  var out = [0x60],
    params = n.functype.params.map(function (x) {
      return x.valtype;
    }).map(encodeValtype),
    results = n.functype.results.map(encodeValtype);
  out.push.apply(out, encodeVec(params));
  out.push.apply(out, encodeVec(results));
  return out;
}
function encodeInstr(n) {
  var out = [],
    instructionName = n.id;

  if (typeof n.object == "string") instructionName = "" + n.object + "." + String(n.id);

  var byteString = symbolsByName[instructionName];

  if (byteString === void 0) throw new Error("encodeInstr: unknown instruction " + JSON.stringify(instructionName));

  var byte = parseInt(byteString, 10);
  out.push(byte);

  n.args &&
    n.args.forEach(function (arg) {
      var encoder = n.object === "i32" ? encodeI32
        : n.object === "i64" ? encodeI64
        : n.object === "f32" ? encodeF32
        : n.object === "f64" ? encodeF64
        : encodeU32;

      if (arg.type !== "NumberLiteral" && arg.type !== "FloatLiteral" && arg.type !== "LongNumberLiteral")
        throw new Error("Unsupported instruction argument encoding " + JSON.stringify(arg.type));

      out.push.apply(out, encoder(arg.value));
    });

  return out;
}

function encodeExpr(instrs) {
  var out = [];
  instrs.forEach(function (instr) {
    var n = encodeNode(instr);
    out.push.apply(out, n);
  });
  return out;
}

function encodeStringLiteral(n) {
  return encodeUTF8Vec(n.value);
}
function encodeGlobal(n) {
  var out = [],
    _n$globalType = n.globalType,
    valtype = _n$globalType.valtype,
    mutability = _n$globalType.mutability;
  out.push(encodeValtype(valtype));
  out.push(encodeMutability(mutability));
  out.push.apply(out, encodeExpr(n.init));
  return out;
}
function encodeFuncBody(n) {
  var out = [];
  out.push(-1);

  var localBytes = encodeVec([]);
  out.push.apply(out, localBytes);
  var funcBodyBytes = encodeExpr(n.body);
  out[0] = funcBodyBytes.length + localBytes.length;
  out.push.apply(out, funcBodyBytes);
  return out;
}
function encodeIndexInFuncSection(n) {
  assertNotIdentifierNode(n.index);

  return encodeU32(n.index.value);
}
function encodeElem(n) {
  var out = [];
  assertNotIdentifierNode(n.table);

  out.push.apply(out, encodeU32(n.table.value));
  out.push.apply(out, encodeExpr(n.offset));

  var funcs = n.funcs.reduce(function (acc, x) {
    return acc.concat(encodeU32(x.value));
  }, []);
  out.push.apply(out, encodeVec(funcs));
  return out;
}

function encodeNode(n) {
  switch (n.type) {
    case "ModuleImport":
      return encodeModuleImport(n);

    case "SectionMetadata":
      return encodeSectionMetadata(n);

    case "CallInstruction":
      return encodeCallInstruction(n);

    case "CallIndirectInstruction":
      return encodeCallIndirectInstruction(n);

    case "TypeInstruction":
      return encodeTypeInstruction(n);

    case "Instr":
      return encodeInstr(n);

    case "ModuleExport":
      return encodeModuleExport(n);

    case "Global":
      return encodeGlobal(n);

    case "Func":
      return encodeFuncBody(n);

    case "IndexInFuncSection":
      return encodeIndexInFuncSection(n);

    case "StringLiteral":
      return encodeStringLiteral(n);

    case "Elem":
      return encodeElem(n);

    default:
      throw new Error("Unsupported encoding for node of type: " + JSON.stringify(n.type));
  }
}

function concatUint8Arrays() {
  var arrays = Array.prototype.slice.call(arguments),

    totalLength = arrays.reduce(function (a, b) {
      return a + b.length;
    }, 0),
    result = new Uint8Array(totalLength),
    offset = 0;

  for (var _i = 0; _i < arrays.length; _i++) {
    var arr = arrays[_i];

    if (!(arr instanceof Uint8Array)) throw new Error("arr must be of type Uint8Array");

    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

function overrideBytesInBuffer(buffer, startLoc, endLoc, newBytes) {
  var beforeBytes = buffer.slice(0, startLoc),
    afterBytes = buffer.slice(endLoc, buffer.length);

  return newBytes.length === 0
    ? concatUint8Arrays(beforeBytes, afterBytes)

    : concatUint8Arrays(beforeBytes, Uint8Array.from(newBytes), afterBytes);
}

function shiftFollowingSections(ast, _ref, deltaInSizeEncoding) {
  var section = _ref.section,
    encounteredSection = false;
  t.traverse(ast, {
    SectionMetadata: function (path) {
      path.node.section === section
        ? (encounteredSection = true)

        : encounteredSection !== true || t.shiftSection(ast, path.node, deltaInSizeEncoding);
    }
  });
}

function shrinkPaddedLEB128(ast, uint8Buffer) {
  t.traverse(ast, {
    SectionMetadata: function (_ref2) {
      var node = _ref2.node,

        newu32Encoded = encodeU32(node.size.value),
        newu32EncodedLen = newu32Encoded.length,
        start = node.size.loc.start.column,
        end = node.size.loc.end.column,
        oldu32EncodedLen = end - start;

      if (newu32EncodedLen !== oldu32EncodedLen) {
        var deltaInSizeEncoding = oldu32EncodedLen - newu32EncodedLen;
        uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, end, newu32Encoded);
        shiftFollowingSections(ast, node, -deltaInSizeEncoding);
      }
    }
  });
  return uint8Buffer;
}

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

var OptimizerError = /*#__PURE__*/ (function () {
  _inherits(OptimizerError, Error);

  function OptimizerError(name, initialError) {
    _classCallCheck(this, OptimizerError);

    var _this = OptimizerError.__proto__ || Object.getPrototypeOf(OptimizerError);
    _this = _possibleConstructorReturn(this, _this.call(this, "Error while optimizing: " + name + ": " + initialError.message));
    _this.stack = initialError.stack;
    return _this;
  }

  return OptimizerError;
})();

var decoderOpts = {
  ignoreCodeSection: true,
  ignoreDataSection: true
};
function shrinkPaddedLEB128$1(uint8Buffer) {
  try {
    var ast = wasmParser.decode(uint8Buffer.buffer, decoderOpts);
    return shrinkPaddedLEB128(ast, uint8Buffer);
  } catch (e) {
    throw new OptimizerError("shrinkPaddedLEB128", e);
  }
}

function resizeSectionByteSize(ast, uint8Buffer, section, deltaBytes) {
  var sectionMetadata = t.getSectionMetadata(ast, section);

  if (sectionMetadata === void 0) throw new Error("Section metadata not found");

  if (sectionMetadata.size.loc === void 0) throw new Error("SectionMetadata " + section + " has no loc");

  var start = sectionMetadata.size.loc.start.column,
    end = sectionMetadata.size.loc.end.column,
    newSectionSize = sectionMetadata.size.value + deltaBytes,
    newBytes = encodeU32(newSectionSize);

  sectionMetadata.size.value = newSectionSize;
  var oldu32EncodedLen = end - start,
    newu32EncodedLen = newBytes.length;

  if (newu32EncodedLen !== oldu32EncodedLen) {
    var deltaInSizeEncoding = newu32EncodedLen - oldu32EncodedLen;
    sectionMetadata.size.loc.end.column = start + newu32EncodedLen;
    deltaBytes += deltaInSizeEncoding;

    sectionMetadata.vectorOfSize.loc.start.column += deltaInSizeEncoding;
    sectionMetadata.vectorOfSize.loc.end.column += deltaInSizeEncoding;
  }

  var encounteredSection = false;
  t.traverse(ast, {
    SectionMetadata: function (path) {
      path.node.section === section
        ? (encounteredSection = true)

        : encounteredSection !== true || t.shiftSection(ast, path.node, deltaBytes);
    }
  });
  return overrideBytesInBuffer(uint8Buffer, start, end, newBytes);
}
function resizeSectionVecSize(ast, uint8Buffer, section, deltaElements) {
  var sectionMetadata = t.getSectionMetadata(ast, section);

  if (sectionMetadata === void 0) throw new Error("Section metadata not found");

  if (sectionMetadata.vectorOfSize.loc === void 0) throw new Error("SectionMetadata " + section + " has no loc");

  if (sectionMetadata.vectorOfSize.value === -1) return uint8Buffer;

  var start = sectionMetadata.vectorOfSize.loc.start.column,
    end = sectionMetadata.vectorOfSize.loc.end.column,
    newValue = sectionMetadata.vectorOfSize.value + deltaElements,
    newBytes = encodeU32(newValue);

  sectionMetadata.vectorOfSize.value = newValue;
  sectionMetadata.vectorOfSize.loc.end.column = start + newBytes.length;
  return overrideBytesInBuffer(uint8Buffer, start, end, newBytes);
}

function findLastSection(ast, forSection) {
  var lastSection,
    targetSectionId = sections[forSection],

    moduleSections = ast.body[0].metadata.sections,
    lastId = 0;

  for (var i = 0, len = moduleSections.length; i < len; i++) {
    var section = moduleSections[i];

    if (section.section === "custom") continue;

    var sectionId = sections[section.section];

    if (targetSectionId > lastId && targetSectionId < sectionId) return lastSection;

    lastId = sectionId;
    lastSection = section;
  }

  return lastSection;
}

function createEmptySection(ast, uint8Buffer, section) {
  var start, end,
    lastSection = findLastSection(ast, section);

  end = start =
    lastSection == null || lastSection.section === "custom" ? 8 : lastSection.startOffset + lastSection.size.value + 1;

  var sizeStartLoc = { line: -1, column: (start += 1) },
    sizeEndLoc = { line: -1, column: start + 1 },

    size = t.withLoc(t.numberLiteralFromRaw(1), sizeEndLoc, sizeStartLoc),
    vectorOfSizeStartLoc = { line: -1, column: sizeEndLoc.column },
    vectorOfSizeEndLoc = { line: -1, column: sizeEndLoc.column + 1 },
    vectorOfSize = t.withLoc(t.numberLiteralFromRaw(0), vectorOfSizeEndLoc, vectorOfSizeStartLoc),
    sectionMetadata = t.sectionMetadata(section, start, size, vectorOfSize),
    sectionBytes = encodeNode(sectionMetadata);
  uint8Buffer = overrideBytesInBuffer(uint8Buffer, start - 1, end, sectionBytes);

  if (typeof ast.body[0].metadata == "object") {
    ast.body[0].metadata.sections.push(sectionMetadata);
    t.sortSectionMetadata(ast.body[0]);
  }

  var deltaBytes = +sectionBytes.length,
    encounteredSection = false;
  t.traverse(ast, {
    SectionMetadata: function (path) {
      path.node.section === section
        ? (encounteredSection = true)

        : encounteredSection !== true || t.shiftSection(ast, path.node, deltaBytes);
    }
  });
  return { uint8Buffer: uint8Buffer, sectionMetadata: sectionMetadata };
}

function removeSections(ast, uint8Buffer, section) {
  var sectionMetadatas = t.getSectionMetadatas(ast, section);

  if (sectionMetadatas.length === 0) throw new Error("Section metadata not found");

  return sectionMetadatas.reverse().reduce(function (uint8Buffer, sectionMetadata) {
    var startsIncludingId = sectionMetadata.startOffset - 1,
      ends = section === "start"
        ? sectionMetadata.size.loc.end.column + 1
        : sectionMetadata.startOffset + sectionMetadata.size.value + 1,
      delta = -(ends - startsIncludingId),

      encounteredSection = false;
    t.traverse(ast, {
      SectionMetadata: function (path) {
        if (path.node.section === section) {
          encounteredSection = true;
          return path.remove();
        }

        encounteredSection !== true || t.shiftSection(ast, path.node, delta);
      }
    });

    return overrideBytesInBuffer(uint8Buffer, startsIncludingId, ends, []);
  }, uint8Buffer);
}

function shiftLocNodeByDelta(node, delta) {
  t.assertHasLoc(node);

  node.loc.start.column += delta;

  node.loc.end.column += delta;
}

function applyUpdate(ast, uint8Buffer, _ref) {
  var _ref2 = _ref,
    oldNode = _ref2[0],
    newNode = _ref2[1],

    deltaElements = 0;
  t.assertHasLoc(oldNode);
  var sectionName = getSectionForNode(newNode),
    replacementByteArray = encodeNode(newNode);

  uint8Buffer = overrideBytesInBuffer(uint8Buffer, oldNode.loc.start.column, oldNode.loc.end.column, replacementByteArray);

  sectionName !== "code" ||
    t.traverse(ast, {
      Func: function (_ref3) {
        var node = _ref3.node;

        if (node.body.find(function (n) { return n === newNode; }) === void 0) return;
        t.assertHasLoc(node);
        var oldNodeSize = encodeNode(oldNode).length,
          bodySizeDeltaBytes = replacementByteArray.length - oldNodeSize;

        if (bodySizeDeltaBytes === 0) return;
        var newValue = node.metadata.bodySize + bodySizeDeltaBytes,
          newByteArray = encodeU32(newValue),

          start = node.loc.start.column;
        uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, start + 1, newByteArray);
      }
    });

  var deltaBytes = replacementByteArray.length - (oldNode.loc.end.column - oldNode.loc.start.column);

  newNode.loc = { start: { line: -1, column: -1 }, end: { line: -1, column: -1 } };

  newNode.loc.start.column = oldNode.loc.start.column;

  newNode.loc.end.column = oldNode.loc.start.column + replacementByteArray.length;
  return { uint8Buffer: uint8Buffer, deltaBytes: deltaBytes, deltaElements: deltaElements };
}

function applyDelete(ast, uint8Buffer, node) {
  var deltaElements = -1;

  t.assertHasLoc(node);

  if (getSectionForNode(node) === "start") {
    var sectionMetadata = t.getSectionMetadata(ast, "start");

    return {
      uint8Buffer: removeSections(ast, uint8Buffer, "start"),
      deltaBytes: -(sectionMetadata.size.value + 1),
      deltaElements: deltaElements
    };
  }

  var replacement = [];

  return {
    uint8Buffer: overrideBytesInBuffer(uint8Buffer, node.loc.start.column, node.loc.end.column, replacement),
    deltaBytes: -(node.loc.end.column - node.loc.start.column),
    deltaElements: deltaElements
  };
}

function applyAdd(ast, uint8Buffer, node) {
  var body,
    deltaElements = 1,

    sectionName = getSectionForNode(node),
    sectionMetadata = t.getSectionMetadata(ast, sectionName);

  if (sectionMetadata === void 0) {
    var res = createEmptySection(ast, uint8Buffer, sectionName);
    uint8Buffer = res.uint8Buffer;
    sectionMetadata = res.sectionMetadata;
  }

  if (t.isFunc(node) && ((body = node.body).length === 0 || body[body.length - 1].id !== "end"))
    throw new Error("expressions must be ended");

  if (t.isGlobal(node) && ((body = node.init).length === 0 || body[body.length - 1].id !== "end"))
    throw new Error("expressions must be ended");

  // noinspection UnnecessaryLocalVariableJS
  var newByteArray = encodeNode(node),

    start = t.getEndOfSection(sectionMetadata),
    end = start,

    deltaBytes = newByteArray.length;
  uint8Buffer = overrideBytesInBuffer(uint8Buffer, start, end, newByteArray);
  node.loc = { start: { line: -1, column: start }, end: { line: -1, column: start + deltaBytes } };

  if (node.type === "Func") {
    var bodySize = newByteArray[0];
    node.metadata = { bodySize: bodySize };
  }

  node.type === "IndexInFuncSection" || t.orderedInsertNode(ast.body[0], node);

  return { uint8Buffer: uint8Buffer, deltaBytes: deltaBytes, deltaElements: deltaElements };
}

function applyOperations(ast, uint8Buffer, ops) {
  ops.forEach(function (op) {
    var state, sectionName;

    switch (op.kind) {
      case "update":
        state = applyUpdate(ast, uint8Buffer, [op.oldNode, op.node]);
        sectionName = getSectionForNode(op.node);
        break;

      case "delete":
        state = applyDelete(ast, uint8Buffer, op.node);
        sectionName = getSectionForNode(op.node);
        break;

      case "add":
        state = applyAdd(ast, uint8Buffer, op.node);
        sectionName = getSectionForNode(op.node);
        break;

      default:
        throw new Error("Unknown operation");
    }

    if (state.deltaElements !== 0 && sectionName !== "start") {
      var oldBufferLength = state.uint8Buffer.length;
      state.uint8Buffer = resizeSectionVecSize(ast, state.uint8Buffer, sectionName, state.deltaElements);

      state.deltaBytes += state.uint8Buffer.length - oldBufferLength;
    }

    if (state.deltaBytes !== 0 && sectionName !== "start") {
      var _oldBufferLength = state.uint8Buffer.length;
      state.uint8Buffer = resizeSectionByteSize(ast, state.uint8Buffer, sectionName, state.deltaBytes);

      state.deltaBytes += state.uint8Buffer.length - _oldBufferLength;
    }

    state.deltaBytes === 0 ||
      ops.forEach(function (op) {
        switch (op.kind) {
          case "update":
            shiftLocNodeByDelta(op.oldNode, state.deltaBytes);
            break;

          case "delete":
            shiftLocNodeByDelta(op.node, state.deltaBytes);
            break;
        }
      });

    uint8Buffer = state.uint8Buffer;
  });
  return uint8Buffer;
}

function hashNode(node) {
  return JSON.stringify(node);
}

function preprocess(ab) {
  return shrinkPaddedLEB128$1(new Uint8Array(ab)).buffer;
}

function sortBySectionOrder(nodes) {
  var originalOrder = new Map();
  for (var _node of nodes) originalOrder.set(_node, originalOrder.size);

  nodes.sort(function (a, b) {
    var sectionA = getSectionForNode(a),
      sectionB = getSectionForNode(b),
      aId = sections[sectionA],
      bId = sections[sectionB];

    if (typeof aId != "number" || typeof bId != "number") throw new Error("Section id not found");

    return aId === bId ? originalOrder.get(a) - originalOrder.get(b) : aId - bId;
  });
}

function edit(ab, visitors) {
  ab = preprocess(ab);
  return editWithAST(wasmParser.decode(ab), ab, visitors);
}
function editWithAST(ast, ab, visitors) {
  var nodeBefore,
    operations = [],
    uint8Buffer = new Uint8Array(ab);

  function before(type, path) {
    nodeBefore = t.cloneNode(path.node);
  }

  function after(type, path) {
    path.node._deleted === true
      ? operations.push({ kind: "delete", node: path.node })
      : hashNode(nodeBefore) === hashNode(path.node) || operations.push({ kind: "update", oldNode: nodeBefore, node: path.node });
  }

  t.traverse(ast, visitors, before, after);
  return applyOperations(ast, uint8Buffer, operations).buffer;
}
function add(ab, newNodes) {
  ab = preprocess(ab);
  return addWithAST(wasmParser.decode(ab), ab, newNodes);
}
function addWithAST(ast, ab, newNodes) {
  sortBySectionOrder(newNodes);
  var uint8Buffer = new Uint8Array(ab);

  return applyOperations(
    ast,
    uint8Buffer,
    newNodes.map(function (n) {
      return { kind: "add", node: n };
    })
  ).buffer;
}

exports.add = add;
exports.addWithAST = addWithAST;
exports.edit = edit;
exports.editWithAST = editWithAST;

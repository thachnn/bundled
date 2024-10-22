"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var Long = require("./long");

function isTypeOf(t) {
  return function (n) {
    return n.type === t;
  };
}

function assertTypeOf(t) {
  return function (n) {
    return (function () {
      if (n.type !== t) throw new Error("n.type === t error: unknown");
    })();
  };
}

function module$1(id, fields, metadata) {
  if (id !== null && id !== void 0 && typeof id != "string")
    throw new Error('typeof id === "string" error: Argument id must be of type string, given: ' + typeof id);

  if (typeof fields != "object" || fields.length === void 0)
    throw new Error('typeof fields === "object" && typeof fields.length !== "undefined" error: unknown');

  var node = { type: "Module", id: id, fields: fields };

  if (metadata !== void 0) node.metadata = metadata;

  return node;
}
function moduleMetadata(sections, functionNames, localNames, producers) {
  if (typeof sections != "object" || sections.length === void 0)
    throw new Error('typeof sections === "object" && typeof sections.length !== "undefined" error: unknown');

  if (functionNames !== null && functionNames !== void 0 && (typeof functionNames != "object" || functionNames.length === void 0))
    throw new Error('typeof functionNames === "object" && typeof functionNames.length !== "undefined" error: unknown');

  if (localNames !== null && localNames !== void 0 && (typeof localNames != "object" || localNames.length === void 0))
    throw new Error('typeof localNames === "object" && typeof localNames.length !== "undefined" error: unknown');

  if (producers !== null && producers !== void 0 && (typeof producers != "object" || producers.length === void 0))
    throw new Error('typeof producers === "object" && typeof producers.length !== "undefined" error: unknown');

  var node = { type: "ModuleMetadata", sections: sections };

  if (functionNames !== void 0 && functionNames.length > 0) node.functionNames = functionNames;

  if (localNames !== void 0 && localNames.length > 0) node.localNames = localNames;

  if (producers !== void 0 && producers.length > 0) node.producers = producers;

  return node;
}
function moduleNameMetadata(value) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  return { type: "ModuleNameMetadata", value: value };
}
function functionNameMetadata(value, index) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  if (typeof index != "number")
    throw new Error('typeof index === "number" error: Argument index must be of type number, given: ' + typeof index);

  return { type: "FunctionNameMetadata", value: value, index: index };
}
function localNameMetadata(value, localIndex, functionIndex) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  if (typeof localIndex != "number")
    throw new Error('typeof localIndex === "number" error: Argument localIndex must be of type number, given: ' + typeof localIndex);

  if (typeof functionIndex != "number")
    throw new Error('typeof functionIndex === "number" error: Argument functionIndex must be of type number, given: ' + typeof functionIndex);

  return { type: "LocalNameMetadata", value: value, localIndex: localIndex, functionIndex: functionIndex };
}
function binaryModule(id, blob) {
  if (id !== null && id !== void 0 && typeof id != "string")
    throw new Error('typeof id === "string" error: Argument id must be of type string, given: ' + typeof id);

  if (typeof blob != "object" || blob.length === void 0)
    throw new Error('typeof blob === "object" && typeof blob.length !== "undefined" error: unknown');

  return { type: "BinaryModule", id: id, blob: blob };
}
function quoteModule(id, string) {
  if (id !== null && id !== void 0 && typeof id != "string")
    throw new Error('typeof id === "string" error: Argument id must be of type string, given: ' + typeof id);

  if (typeof string != "object" || string.length === void 0)
    throw new Error('typeof string === "object" && typeof string.length !== "undefined" error: unknown');

  return { type: "QuoteModule", id: id, string: string };
}
function sectionMetadata(section, startOffset, size, vectorOfSize) {
  if (typeof startOffset != "number")
    throw new Error('typeof startOffset === "number" error: Argument startOffset must be of type number, given: ' + typeof startOffset);

  return { type: "SectionMetadata", section: section, startOffset: startOffset, size: size, vectorOfSize: vectorOfSize };
}
function producersSectionMetadata(producers) {
  if (typeof producers != "object" || producers.length === void 0)
    throw new Error('typeof producers === "object" && typeof producers.length !== "undefined" error: unknown');

  return { type: "ProducersSectionMetadata", producers: producers };
}
function producerMetadata(language, processedBy, sdk) {
  if (typeof language != "object" || language.length === void 0)
    throw new Error('typeof language === "object" && typeof language.length !== "undefined" error: unknown');

  if (typeof processedBy != "object" || processedBy.length === void 0)
    throw new Error('typeof processedBy === "object" && typeof processedBy.length !== "undefined" error: unknown');

  if (typeof sdk != "object" || sdk.length === void 0)
    throw new Error('typeof sdk === "object" && typeof sdk.length !== "undefined" error: unknown');

  return { type: "ProducerMetadata", language: language, processedBy: processedBy, sdk: sdk };
}
function producerMetadataVersionedName(name, version) {
  if (typeof name != "string")
    throw new Error('typeof name === "string" error: Argument name must be of type string, given: ' + typeof name);

  if (typeof version != "string")
    throw new Error('typeof version === "string" error: Argument version must be of type string, given: ' + typeof version);

  return { type: "ProducerMetadataVersionedName", name: name, version: version };
}
function loopInstruction(label, resulttype, instr) {
  if (typeof instr != "object" || instr.length === void 0)
    throw new Error('typeof instr === "object" && typeof instr.length !== "undefined" error: unknown');

  return { type: "LoopInstruction", id: "loop", label: label, resulttype: resulttype, instr: instr };
}
function instr(id, object, args, namedArgs) {
  if (typeof id != "string") throw new Error('typeof id === "string" error: Argument id must be of type string, given: ' + typeof id);

  if (typeof args != "object" || args.length === void 0)
    throw new Error('typeof args === "object" && typeof args.length !== "undefined" error: unknown');

  var node = { type: "Instr", id: id, args: args };

  if (object !== void 0) node.object = object;

  if (namedArgs !== void 0 && Object.keys(namedArgs).length > 0) node.namedArgs = namedArgs;

  return node;
}
function ifInstruction(testLabel, test, result, consequent, alternate) {
  if (typeof test != "object" || test.length === void 0)
    throw new Error('typeof test === "object" && typeof test.length !== "undefined" error: unknown');

  if (typeof consequent != "object" || consequent.length === void 0)
    throw new Error('typeof consequent === "object" && typeof consequent.length !== "undefined" error: unknown');

  if (typeof alternate != "object" || alternate.length === void 0)
    throw new Error('typeof alternate === "object" && typeof alternate.length !== "undefined" error: unknown');

  return {
    type: "IfInstruction",
    id: "if",
    testLabel: testLabel,
    test: test,
    result: result,
    consequent: consequent,
    alternate: alternate
  };
}
function stringLiteral(value) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  return { type: "StringLiteral", value: value };
}
function numberLiteral(value, raw) {
  if (typeof value != "number")
    throw new Error('typeof value === "number" error: Argument value must be of type number, given: ' + typeof value);

  if (typeof raw != "string")
    throw new Error('typeof raw === "string" error: Argument raw must be of type string, given: ' + typeof raw);

  return { type: "NumberLiteral", value: value, raw: raw };
}
function longNumberLiteral(value, raw) {
  if (typeof raw != "string")
    throw new Error('typeof raw === "string" error: Argument raw must be of type string, given: ' + typeof raw);

  return { type: "LongNumberLiteral", value: value, raw: raw };
}
function floatLiteral(value, nan, inf, raw) {
  if (typeof value != "number")
    throw new Error('typeof value === "number" error: Argument value must be of type number, given: ' + typeof value);

  if (nan !== null && nan !== void 0 && typeof nan != "boolean")
    throw new Error('typeof nan === "boolean" error: Argument nan must be of type boolean, given: ' + typeof nan);

  if (inf !== null && inf !== void 0 && typeof inf != "boolean")
    throw new Error('typeof inf === "boolean" error: Argument inf must be of type boolean, given: ' + typeof inf);

  if (typeof raw != "string")
    throw new Error('typeof raw === "string" error: Argument raw must be of type string, given: ' + typeof raw);

  var node = { type: "FloatLiteral", value: value, raw: raw };

  if (nan === true) node.nan = true;

  if (inf === true) node.inf = true;

  return node;
}
function elem(table, offset, funcs) {
  if (typeof offset != "object" || offset.length === void 0)
    throw new Error('typeof offset === "object" && typeof offset.length !== "undefined" error: unknown');

  if (typeof funcs != "object" || funcs.length === void 0)
    throw new Error('typeof funcs === "object" && typeof funcs.length !== "undefined" error: unknown');

  return { type: "Elem", table: table, offset: offset, funcs: funcs };
}
function indexInFuncSection(index) {
  return { type: "IndexInFuncSection", index: index };
}
function valtypeLiteral(name) {
  return { type: "ValtypeLiteral", name: name };
}
function typeInstruction(id, functype) {
  return { type: "TypeInstruction", id: id, functype: functype };
}
function start(index) {
  return { type: "Start", index: index };
}
function globalType(valtype, mutability) {
  return { type: "GlobalType", valtype: valtype, mutability: mutability };
}
function leadingComment(value) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  return { type: "LeadingComment", value: value };
}
function blockComment(value) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  return { type: "BlockComment", value: value };
}
function data(memoryIndex, offset, init) {
  return { type: "Data", memoryIndex: memoryIndex, offset: offset, init: init };
}
function global(globalType, init, name) {
  if (typeof init != "object" || init.length === void 0)
    throw new Error('typeof init === "object" && typeof init.length !== "undefined" error: unknown');

  return { type: "Global", globalType: globalType, init: init, name: name };
}
function table(elementType, limits, name, elements) {
  if (limits.type !== "Limit")
    throw new Error('limits.type === "Limit" error: Argument limits must be of type Limit, given: ' + limits.type);

  if (elements !== null && elements !== void 0 && (typeof elements != "object" || elements.length === void 0))
    throw new Error('typeof elements === "object" && typeof elements.length !== "undefined" error: unknown');

  var node = { type: "Table", elementType: elementType, limits: limits, name: name };

  if (elements !== void 0 && elements.length > 0) node.elements = elements;

  return node;
}
function memory(limits, id) {
  return { type: "Memory", limits: limits, id: id };
}
function funcImportDescr(id, signature) {
  return { type: "FuncImportDescr", id: id, signature: signature };
}
function moduleImport(module, name, descr) {
  if (typeof module != "string")
    throw new Error('typeof module === "string" error: Argument module must be of type string, given: ' + typeof module);

  if (typeof name != "string")
    throw new Error('typeof name === "string" error: Argument name must be of type string, given: ' + typeof name);

  return { type: "ModuleImport", module: module, name: name, descr: descr };
}
function moduleExportDescr(exportType, id) {
  return { type: "ModuleExportDescr", exportType: exportType, id: id };
}
function moduleExport(name, descr) {
  if (typeof name != "string")
    throw new Error('typeof name === "string" error: Argument name must be of type string, given: ' + typeof name);

  return { type: "ModuleExport", name: name, descr: descr };
}
function limit(min, max) {
  if (typeof min != "number")
    throw new Error('typeof min === "number" error: Argument min must be of type number, given: ' + typeof min);

  if (max !== null && max !== void 0 && typeof max != "number")
    throw new Error('typeof max === "number" error: Argument max must be of type number, given: ' + typeof max);

  var node = { type: "Limit", min: min };

  if (max !== void 0) node.max = max;

  return node;
}
function signature(params, results) {
  if (typeof params != "object" || params.length === void 0)
    throw new Error('typeof params === "object" && typeof params.length !== "undefined" error: unknown');

  if (typeof results != "object" || results.length === void 0)
    throw new Error('typeof results === "object" && typeof results.length !== "undefined" error: unknown');

  return { type: "Signature", params: params, results: results };
}
function program(body) {
  if (typeof body != "object" || body.length === void 0)
    throw new Error('typeof body === "object" && typeof body.length !== "undefined" error: unknown');

  return { type: "Program", body: body };
}
function identifier(value, raw) {
  if (typeof value != "string")
    throw new Error('typeof value === "string" error: Argument value must be of type string, given: ' + typeof value);

  if (raw !== null && raw !== void 0 && typeof raw != "string")
    throw new Error('typeof raw === "string" error: Argument raw must be of type string, given: ' + typeof raw);

  var node = { type: "Identifier", value: value };

  if (raw !== void 0) node.raw = raw;

  return node;
}
function blockInstruction(label, instr, result) {
  if (typeof instr != "object" || instr.length === void 0)
    throw new Error('typeof instr === "object" && typeof instr.length !== "undefined" error: unknown');

  return { type: "BlockInstruction", id: "block", label: label, instr: instr, result: result };
}
function callInstruction(index, instrArgs, numeric) {
  if (instrArgs !== null && instrArgs !== void 0 && (typeof instrArgs != "object" || instrArgs.length === void 0))
    throw new Error('typeof instrArgs === "object" && typeof instrArgs.length !== "undefined" error: unknown');

  var node = { type: "CallInstruction", id: "call", index: index };

  if (instrArgs !== void 0 && instrArgs.length > 0) node.instrArgs = instrArgs;

  if (numeric !== void 0) node.numeric = numeric;

  return node;
}
function callIndirectInstruction(signature, intrs) {
  if (intrs !== null && intrs !== void 0 && (typeof intrs != "object" || intrs.length === void 0))
    throw new Error('typeof intrs === "object" && typeof intrs.length !== "undefined" error: unknown');

  var node = { type: "CallIndirectInstruction", id: "call_indirect", signature: signature };

  if (intrs !== void 0 && intrs.length > 0) node.intrs = intrs;

  return node;
}
function byteArray(values) {
  if (typeof values != "object" || values.length === void 0)
    throw new Error('typeof values === "object" && typeof values.length !== "undefined" error: unknown');

  return { type: "ByteArray", values: values };
}
function func(name, signature, body, isExternal, metadata) {
  if (typeof body != "object" || body.length === void 0)
    throw new Error('typeof body === "object" && typeof body.length !== "undefined" error: unknown');

  if (isExternal !== null && isExternal !== void 0 && typeof isExternal != "boolean")
    throw new Error('typeof isExternal === "boolean" error: Argument isExternal must be of type boolean, given: ' + typeof isExternal);

  var node = { type: "Func", name: name, signature: signature, body: body };

  if (isExternal === true) node.isExternal = true;

  if (metadata !== void 0) node.metadata = metadata;

  return node;
}
function internalBrUnless(target) {
  if (typeof target != "number")
    throw new Error('typeof target === "number" error: Argument target must be of type number, given: ' + typeof target);

  return { type: "InternalBrUnless", target: target };
}
function internalGoto(target) {
  if (typeof target != "number")
    throw new Error('typeof target === "number" error: Argument target must be of type number, given: ' + typeof target);

  return { type: "InternalGoto", target: target };
}
function internalCallExtern(target) {
  if (typeof target != "number")
    throw new Error('typeof target === "number" error: Argument target must be of type number, given: ' + typeof target);

  return { type: "InternalCallExtern", target: target };
}
function internalEndAndReturn() {
  return { type: "InternalEndAndReturn" };
}
var isModule = isTypeOf("Module"),
  isModuleMetadata = isTypeOf("ModuleMetadata"),
  isModuleNameMetadata = isTypeOf("ModuleNameMetadata"),
  isFunctionNameMetadata = isTypeOf("FunctionNameMetadata"),
  isLocalNameMetadata = isTypeOf("LocalNameMetadata"),
  isBinaryModule = isTypeOf("BinaryModule"),
  isQuoteModule = isTypeOf("QuoteModule"),
  isSectionMetadata = isTypeOf("SectionMetadata"),
  isProducersSectionMetadata = isTypeOf("ProducersSectionMetadata"),
  isProducerMetadata = isTypeOf("ProducerMetadata"),
  isProducerMetadataVersionedName = isTypeOf("ProducerMetadataVersionedName"),
  isLoopInstruction = isTypeOf("LoopInstruction"),
  isInstr = isTypeOf("Instr"),
  isIfInstruction = isTypeOf("IfInstruction"),
  isStringLiteral = isTypeOf("StringLiteral"),
  isNumberLiteral = isTypeOf("NumberLiteral"),
  isLongNumberLiteral = isTypeOf("LongNumberLiteral"),
  isFloatLiteral = isTypeOf("FloatLiteral"),
  isElem = isTypeOf("Elem"),
  isIndexInFuncSection = isTypeOf("IndexInFuncSection"),
  isValtypeLiteral = isTypeOf("ValtypeLiteral"),
  isTypeInstruction = isTypeOf("TypeInstruction"),
  isStart = isTypeOf("Start"),
  isGlobalType = isTypeOf("GlobalType"),
  isLeadingComment = isTypeOf("LeadingComment"),
  isBlockComment = isTypeOf("BlockComment"),
  isData = isTypeOf("Data"),
  isGlobal = isTypeOf("Global"),
  isTable = isTypeOf("Table"),
  isMemory = isTypeOf("Memory"),
  isFuncImportDescr = isTypeOf("FuncImportDescr"),
  isModuleImport = isTypeOf("ModuleImport"),
  isModuleExportDescr = isTypeOf("ModuleExportDescr"),
  isModuleExport = isTypeOf("ModuleExport"),
  isLimit = isTypeOf("Limit"),
  isSignature = isTypeOf("Signature"),
  isProgram = isTypeOf("Program"),
  isIdentifier = isTypeOf("Identifier"),
  isBlockInstruction = isTypeOf("BlockInstruction"),
  isCallInstruction = isTypeOf("CallInstruction"),
  isCallIndirectInstruction = isTypeOf("CallIndirectInstruction"),
  isByteArray = isTypeOf("ByteArray"),
  isFunc = isTypeOf("Func"),
  isInternalBrUnless = isTypeOf("InternalBrUnless"),
  isInternalGoto = isTypeOf("InternalGoto"),
  isInternalCallExtern = isTypeOf("InternalCallExtern"),
  isInternalEndAndReturn = isTypeOf("InternalEndAndReturn");
var isNode = function (node) {
  return (
    isModule(node) ||
    isModuleMetadata(node) ||
    isModuleNameMetadata(node) ||
    isFunctionNameMetadata(node) ||
    isLocalNameMetadata(node) ||
    isBinaryModule(node) ||
    isQuoteModule(node) ||
    isSectionMetadata(node) ||
    isProducersSectionMetadata(node) ||
    isProducerMetadata(node) ||
    isProducerMetadataVersionedName(node) ||
    isLoopInstruction(node) ||
    isInstr(node) ||
    isIfInstruction(node) ||
    isStringLiteral(node) ||
    isNumberLiteral(node) ||
    isLongNumberLiteral(node) ||
    isFloatLiteral(node) ||
    isElem(node) ||
    isIndexInFuncSection(node) ||
    isValtypeLiteral(node) ||
    isTypeInstruction(node) ||
    isStart(node) ||
    isGlobalType(node) ||
    isLeadingComment(node) ||
    isBlockComment(node) ||
    isData(node) ||
    isGlobal(node) ||
    isTable(node) ||
    isMemory(node) ||
    isFuncImportDescr(node) ||
    isModuleImport(node) ||
    isModuleExportDescr(node) ||
    isModuleExport(node) ||
    isLimit(node) ||
    isSignature(node) ||
    isProgram(node) ||
    isIdentifier(node) ||
    isBlockInstruction(node) ||
    isCallInstruction(node) ||
    isCallIndirectInstruction(node) ||
    isByteArray(node) ||
    isFunc(node) ||
    isInternalBrUnless(node) ||
    isInternalGoto(node) ||
    isInternalCallExtern(node) ||
    isInternalEndAndReturn(node)
  );
};
var isBlock = function (node) {
  return isLoopInstruction(node) || isBlockInstruction(node) || isFunc(node);
};
var isInstruction = function (node) {
  return (
    isLoopInstruction(node) ||
    isInstr(node) ||
    isIfInstruction(node) ||
    isTypeInstruction(node) ||
    isBlockInstruction(node) ||
    isCallInstruction(node) ||
    isCallIndirectInstruction(node)
  );
};
var isExpression = function (node) {
  return (
    isInstr(node) ||
    isStringLiteral(node) ||
    isNumberLiteral(node) ||
    isLongNumberLiteral(node) ||
    isFloatLiteral(node) ||
    isValtypeLiteral(node) ||
    isIdentifier(node)
  );
};
var isNumericLiteral = function (node) {
  return isNumberLiteral(node) || isLongNumberLiteral(node) || isFloatLiteral(node);
};
var isImportDescr = function (node) {
  return isGlobalType(node) || isTable(node) || isMemory(node) || isFuncImportDescr(node);
};
var isIntrinsic = function (node) {
  return isInternalBrUnless(node) || isInternalGoto(node) || isInternalCallExtern(node) || isInternalEndAndReturn(node);
};
var assertModule = assertTypeOf("Module"),
  assertModuleMetadata = assertTypeOf("ModuleMetadata"),
  assertModuleNameMetadata = assertTypeOf("ModuleNameMetadata"),
  assertFunctionNameMetadata = assertTypeOf("FunctionNameMetadata"),
  assertLocalNameMetadata = assertTypeOf("LocalNameMetadata"),
  assertBinaryModule = assertTypeOf("BinaryModule"),
  assertQuoteModule = assertTypeOf("QuoteModule"),
  assertSectionMetadata = assertTypeOf("SectionMetadata"),
  assertProducersSectionMetadata = assertTypeOf("ProducersSectionMetadata"),
  assertProducerMetadata = assertTypeOf("ProducerMetadata"),
  assertProducerMetadataVersionedName = assertTypeOf("ProducerMetadataVersionedName"),
  assertLoopInstruction = assertTypeOf("LoopInstruction"),
  assertInstr = assertTypeOf("Instr"),
  assertIfInstruction = assertTypeOf("IfInstruction"),
  assertStringLiteral = assertTypeOf("StringLiteral"),
  assertNumberLiteral = assertTypeOf("NumberLiteral"),
  assertLongNumberLiteral = assertTypeOf("LongNumberLiteral"),
  assertFloatLiteral = assertTypeOf("FloatLiteral"),
  assertElem = assertTypeOf("Elem"),
  assertIndexInFuncSection = assertTypeOf("IndexInFuncSection"),
  assertValtypeLiteral = assertTypeOf("ValtypeLiteral"),
  assertTypeInstruction = assertTypeOf("TypeInstruction"),
  assertStart = assertTypeOf("Start"),
  assertGlobalType = assertTypeOf("GlobalType"),
  assertLeadingComment = assertTypeOf("LeadingComment"),
  assertBlockComment = assertTypeOf("BlockComment"),
  assertData = assertTypeOf("Data"),
  assertGlobal = assertTypeOf("Global"),
  assertTable = assertTypeOf("Table"),
  assertMemory = assertTypeOf("Memory"),
  assertFuncImportDescr = assertTypeOf("FuncImportDescr"),
  assertModuleImport = assertTypeOf("ModuleImport"),
  assertModuleExportDescr = assertTypeOf("ModuleExportDescr"),
  assertModuleExport = assertTypeOf("ModuleExport"),
  assertLimit = assertTypeOf("Limit"),
  assertSignature = assertTypeOf("Signature"),
  assertProgram = assertTypeOf("Program"),
  assertIdentifier = assertTypeOf("Identifier"),
  assertBlockInstruction = assertTypeOf("BlockInstruction"),
  assertCallInstruction = assertTypeOf("CallInstruction"),
  assertCallIndirectInstruction = assertTypeOf("CallIndirectInstruction"),
  assertByteArray = assertTypeOf("ByteArray"),
  assertFunc = assertTypeOf("Func"),
  assertInternalBrUnless = assertTypeOf("InternalBrUnless"),
  assertInternalGoto = assertTypeOf("InternalGoto"),
  assertInternalCallExtern = assertTypeOf("InternalCallExtern"),
  assertInternalEndAndReturn = assertTypeOf("InternalEndAndReturn");
var unionTypesMap = {
  Module: ["Node"],
  ModuleMetadata: ["Node"],
  ModuleNameMetadata: ["Node"],
  FunctionNameMetadata: ["Node"],
  LocalNameMetadata: ["Node"],
  BinaryModule: ["Node"],
  QuoteModule: ["Node"],
  SectionMetadata: ["Node"],
  ProducersSectionMetadata: ["Node"],
  ProducerMetadata: ["Node"],
  ProducerMetadataVersionedName: ["Node"],
  LoopInstruction: ["Node", "Block", "Instruction"],
  Instr: ["Node", "Expression", "Instruction"],
  IfInstruction: ["Node", "Instruction"],
  StringLiteral: ["Node", "Expression"],
  NumberLiteral: ["Node", "NumericLiteral", "Expression"],
  LongNumberLiteral: ["Node", "NumericLiteral", "Expression"],
  FloatLiteral: ["Node", "NumericLiteral", "Expression"],
  Elem: ["Node"],
  IndexInFuncSection: ["Node"],
  ValtypeLiteral: ["Node", "Expression"],
  TypeInstruction: ["Node", "Instruction"],
  Start: ["Node"],
  GlobalType: ["Node", "ImportDescr"],
  LeadingComment: ["Node"],
  BlockComment: ["Node"],
  Data: ["Node"],
  Global: ["Node"],
  Table: ["Node", "ImportDescr"],
  Memory: ["Node", "ImportDescr"],
  FuncImportDescr: ["Node", "ImportDescr"],
  ModuleImport: ["Node"],
  ModuleExportDescr: ["Node"],
  ModuleExport: ["Node"],
  Limit: ["Node"],
  Signature: ["Node"],
  Program: ["Node"],
  Identifier: ["Node", "Expression"],
  BlockInstruction: ["Node", "Block", "Instruction"],
  CallInstruction: ["Node", "Instruction"],
  CallIndirectInstruction: ["Node", "Instruction"],
  ByteArray: ["Node"],
  Func: ["Node", "Block"],
  InternalBrUnless: ["Node", "Intrinsic"],
  InternalGoto: ["Node", "Intrinsic"],
  InternalCallExtern: ["Node", "Intrinsic"],
  InternalEndAndReturn: ["Node", "Intrinsic"]
};
var nodeAndUnionTypes = [
  "Module",
  "ModuleMetadata",
  "ModuleNameMetadata",
  "FunctionNameMetadata",
  "LocalNameMetadata",
  "BinaryModule",
  "QuoteModule",
  "SectionMetadata",
  "ProducersSectionMetadata",
  "ProducerMetadata",
  "ProducerMetadataVersionedName",
  "LoopInstruction",
  "Instr",
  "IfInstruction",
  "StringLiteral",
  "NumberLiteral",
  "LongNumberLiteral",
  "FloatLiteral",
  "Elem",
  "IndexInFuncSection",
  "ValtypeLiteral",
  "TypeInstruction",
  "Start",
  "GlobalType",
  "LeadingComment",
  "BlockComment",
  "Data",
  "Global",
  "Table",
  "Memory",
  "FuncImportDescr",
  "ModuleImport",
  "ModuleExportDescr",
  "ModuleExport",
  "Limit",
  "Signature",
  "Program",
  "Identifier",
  "BlockInstruction",
  "CallInstruction",
  "CallIndirectInstruction",
  "ByteArray",
  "Func",
  "InternalBrUnless",
  "InternalGoto",
  "InternalCallExtern",
  "InternalEndAndReturn",
  "Node",
  "Block",
  "Instruction",
  "Expression",
  "NumericLiteral",
  "ImportDescr",
  "Intrinsic"
];

function parse(input) {
  var mantissa, exponent,
    splitIndex = (input = input.toUpperCase()).indexOf("P");

  if (splitIndex !== -1) {
    mantissa = input.substring(0, splitIndex);
    exponent = parseInt(input.substring(splitIndex + 1));
  } else {
    mantissa = input;
    exponent = 0;
  }

  var dotIndex = mantissa.indexOf(".");

  if (dotIndex !== -1) {
    var integerPart = parseInt(mantissa.substring(0, dotIndex), 16),
      sign = Math.sign(integerPart);
    integerPart *= sign;
    var fractionLength = mantissa.length - dotIndex - 1,
      fractionalPart = parseInt(mantissa.substring(dotIndex + 1), 16),
      fraction = fractionLength > 0 ? fractionalPart / Math.pow(16, fractionLength) : 0;

    mantissa = sign === 0
      ? (fraction === 0 ? sign : Object.is(sign, -0) ? -fraction : fraction)
      : sign * (integerPart + fraction);
  } else mantissa = parseInt(mantissa, 16);

  return mantissa * (splitIndex !== -1 ? Math.pow(2, exponent) : 1);
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
  if (typeof superClass != "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function");
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

function parse32F(sourceString) {
  return isHexLiteral(sourceString)
    ? parse(sourceString)
    : isInfLiteral(sourceString)
    ? sourceString[0] === "-" ? -1 : 1
    : isNanLiteral(sourceString)
    ? (sourceString[0] === "-" ? -1 : 1) *
      (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 0x400000)
    : parseFloat(sourceString);
}
function parse64F(sourceString) {
  return isHexLiteral(sourceString)
    ? parse(sourceString)
    : isInfLiteral(sourceString)
    ? sourceString[0] === "-" ? -1 : 1
    : isNanLiteral(sourceString)
    ? (sourceString[0] === "-" ? -1 : 1) *
      (sourceString.includes(":") ? parseInt(sourceString.substring(sourceString.indexOf(":") + 1), 16) : 0x8000000000000)
    : isHexLiteral(sourceString)
    ? parse(sourceString)
    : parseFloat(sourceString);
}
function parse32I(sourceString) {
  var value = 0;

  if (isHexLiteral(sourceString)) value = ~~parseInt(sourceString, 16);
  else {
    if (isDecimalExponentLiteral(sourceString)) throw new Error("This number literal format is yet to be implemented.");

    value = parseInt(sourceString, 10);
  }

  return value;
}
function parseU32(sourceString) {
  var value = parse32I(sourceString);

  if (value < 0) throw new CompileError("Illegal value for u32: " + sourceString);

  return value;
}
function parse64I(sourceString) {
  var long;

  if (isHexLiteral(sourceString)) long = Long.fromString(sourceString, false, 16);
  else {
    if (isDecimalExponentLiteral(sourceString)) throw new Error("This number literal format is yet to be implemented.");

    long = Long.fromString(sourceString);
  }

  return { high: long.high, low: long.low };
}
var NAN_WORD = /^\+?-?nan/,
  INF_WORD = /^\+?-?inf/;
function isInfLiteral(sourceString) {
  return INF_WORD.test(sourceString.toLowerCase());
}
function isNanLiteral(sourceString) {
  return NAN_WORD.test(sourceString.toLowerCase());
}

function isDecimalExponentLiteral(sourceString) {
  return !isHexLiteral(sourceString) && sourceString.toUpperCase().includes("E");
}

function isHexLiteral(sourceString) {
  return sourceString.substring(0, 2).toUpperCase() === "0X" || sourceString.substring(0, 3).toUpperCase() === "-0X";
}

function numberLiteralFromRaw(rawValue) {
  var instructionType = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "i32",
    original = rawValue;

  if (typeof rawValue == "string") rawValue = rawValue.replace(/_/g, "");

  if (typeof rawValue == "number") return numberLiteral(rawValue, String(original));

  switch (instructionType) {
    case "i32":
      return numberLiteral(parse32I(rawValue), String(original));

    case "u32":
      return numberLiteral(parseU32(rawValue), String(original));

    case "i64":
      return longNumberLiteral(parse64I(rawValue), String(original));

    case "f32":
      return floatLiteral(parse32F(rawValue), isNanLiteral(rawValue), isInfLiteral(rawValue), String(original));

    default:
      return floatLiteral(parse64F(rawValue), isNanLiteral(rawValue), isInfLiteral(rawValue), String(original));
  }
}
function instruction(id) {
  return instr(
    id,
    void 0,
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [],
    arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}
  );
}
function objectInstruction(id, object) {
  return instr(
    id,
    object,
    arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [],
    arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}
  );
}

function withLoc(n, end, start) {
  n.loc = { start: start, end: end };
  return n;
}
function withRaw(n, raw) {
  n.raw = raw;
  return n;
}
function funcParam(valtype, id) {
  return { id: id, valtype: valtype };
}
function indexLiteral(value) {
  return numberLiteralFromRaw(value, "u32");
}
function memIndexLiteral(value) {
  return numberLiteralFromRaw(value, "u32");
}

function findParent(_ref, cb) {
  var parentPath = _ref.parentPath;

  if (parentPath == null) throw new Error("node is root");

  var currentPath = parentPath;

  while (cb(currentPath) !== false) {
    if (currentPath.parentPath == null) return null;

    currentPath = currentPath.parentPath;
  }

  return currentPath.node;
}

function insertBefore(context, newNode) {
  return insert(context, newNode);
}

function insertAfter(context, newNode) {
  return insert(context, newNode, 1);
}

function insert(_ref2, newNode) {
  var node = _ref2.node,
    inList = _ref2.inList,
    parentPath = _ref2.parentPath,
    parentKey = _ref2.parentKey,
    indexOffset = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;

  if (!inList) throw new Error("inList error: insert can only be used for nodes that are within lists");

  if (parentPath == null) throw new Error("parentPath != null error: Can not remove root node");

  var parentList = parentPath.node[parentKey],
    indexInList = parentList.findIndex(function (n) {
      return n === node;
    });
  parentList.splice(indexInList + indexOffset, 0, newNode);
}

function remove(_ref3) {
  var node = _ref3.node,
    parentKey = _ref3.parentKey,
    parentPath = _ref3.parentPath;

  if (parentPath == null) throw new Error("parentPath != null error: Can not remove root node");

  var parentNode = parentPath.node,

    parentProperty = parentNode[parentKey];

  Array.isArray(parentProperty)
    ? (parentNode[parentKey] = parentProperty.filter(function (n) {
        return n !== node;
      }))
    : delete parentNode[parentKey];

  node._deleted = true;
}

function stop(context) {
  context.shouldStop = true;
}

function replaceWith(context, newNode) {
  var parentNode = context.parentPath.node,

    parentProperty = parentNode[context.parentKey];

  if (Array.isArray(parentProperty)) {
    var indexInList = parentProperty.findIndex(function (n) {
      return n === context.node;
    });
    parentProperty.splice(indexInList, 1, newNode);
  } else parentNode[context.parentKey] = newNode;

  context.node._deleted = true;
  context.node = newNode;
}

function bindNodeOperations(operations, context) {
  var keys = Object.keys(operations),
    boundOperations = {};
  keys.forEach(function (key) {
    boundOperations[key] = operations[key].bind(null, context);
  });
  return boundOperations;
}

function createPathOperations(context) {
  return bindNodeOperations({
    findParent: findParent,
    replaceWith: replaceWith,
    remove: remove,
    insertBefore: insertBefore,
    insertAfter: insertAfter,
    stop: stop
  }, context);
}

function createPath(context) {
  var path = Object.assign({}, context);

  Object.assign(path, createPathOperations(path));

  return path;
}

function walk(context, callback) {
  var stop = false;

  function innerWalk(context, callback) {
    if (stop) return;

    var node = context.node;

    if (node === void 0) {
      console.warn("traversing with an empty context");
      return;
    }

    if (node._deleted === true) return;

    var path = createPath(context);
    callback(node.type, path);

    if (path.shouldStop) {
      stop = true;
      return;
    }

    Object.keys(node).forEach(function (prop) {
      var value = node[prop];

      if (value === null || value === void 0) return;

      (Array.isArray(value) ? value : [value]).forEach(function (childNode) {
        typeof childNode.type != "string" ||
          innerWalk(
            { node: childNode, parentKey: prop, parentPath: path, shouldStop: false, inList: Array.isArray(value) },
            callback
          );
      });
    });
  }

  innerWalk(context, callback);
}

var noop = function () {};

function traverse(node, visitors) {
  var before = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : noop,
    after = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : noop;
  Object.keys(visitors).forEach(function (visitor) {
    if (!nodeAndUnionTypes.includes(visitor)) throw new Error("Unexpected visitor " + visitor);
  });
  walk({ node: node, inList: false, shouldStop: false, parentPath: null, parentKey: null }, function (type, path) {
    if (typeof visitors[type] == "function") {
      before(type, path);
      visitors[type](path);
      after(type, path);
    }

    var unionTypes = unionTypesMap[type];

    if (!unionTypes) throw new Error("Unexpected node type " + type);

    unionTypes.forEach(function (unionType) {
      if (typeof visitors[unionType] == "function") {
        before(unionType, path);
        visitors[unionType](path);
        after(unionType, path);
      }
    });
  });
}

function sign(input, output) {
  return [input, output];
}

var u32 = "u32",
  i32 = "i32",
  i64 = "i64",
  f32 = "f32",
  f64 = "f64";

var vector = function (t) {
  var vecType = [t];

  vecType.vector = true;
  return vecType;
};

var controlInstructions = {
  unreachable: sign([], []),
  nop: sign([], []),
  br: sign([u32], []),
  br_if: sign([u32], []),
  br_table: sign(vector(u32), []),
  return: sign([], []),
  call: sign([u32], []),
  call_indirect: sign([u32], [])
};
var parametricInstructions = { drop: sign([], []), select: sign([], []) };
var variableInstructions = {
  get_local: sign([u32], []),
  set_local: sign([u32], []),
  tee_local: sign([u32], []),
  get_global: sign([u32], []),
  set_global: sign([u32], [])
};
var memoryInstructions = {
  "i32.load": sign([u32, u32], [i32]),
  "i64.load": sign([u32, u32], []),
  "f32.load": sign([u32, u32], []),
  "f64.load": sign([u32, u32], []),
  "i32.load8_s": sign([u32, u32], [i32]),
  "i32.load8_u": sign([u32, u32], [i32]),
  "i32.load16_s": sign([u32, u32], [i32]),
  "i32.load16_u": sign([u32, u32], [i32]),
  "i64.load8_s": sign([u32, u32], [i64]),
  "i64.load8_u": sign([u32, u32], [i64]),
  "i64.load16_s": sign([u32, u32], [i64]),
  "i64.load16_u": sign([u32, u32], [i64]),
  "i64.load32_s": sign([u32, u32], [i64]),
  "i64.load32_u": sign([u32, u32], [i64]),
  "i32.store": sign([u32, u32], []),
  "i64.store": sign([u32, u32], []),
  "f32.store": sign([u32, u32], []),
  "f64.store": sign([u32, u32], []),
  "i32.store8": sign([u32, u32], []),
  "i32.store16": sign([u32, u32], []),
  "i64.store8": sign([u32, u32], []),
  "i64.store16": sign([u32, u32], []),
  "i64.store32": sign([u32, u32], []),
  current_memory: sign([], []),
  grow_memory: sign([], [])
};
var numericInstructions = {
  "i32.const": sign([i32], [i32]),
  "i64.const": sign([i64], [i64]),
  "f32.const": sign([f32], [f32]),
  "f64.const": sign([f64], [f64]),
  "i32.eqz": sign([i32], [i32]),
  "i32.eq": sign([i32, i32], [i32]),
  "i32.ne": sign([i32, i32], [i32]),
  "i32.lt_s": sign([i32, i32], [i32]),
  "i32.lt_u": sign([i32, i32], [i32]),
  "i32.gt_s": sign([i32, i32], [i32]),
  "i32.gt_u": sign([i32, i32], [i32]),
  "i32.le_s": sign([i32, i32], [i32]),
  "i32.le_u": sign([i32, i32], [i32]),
  "i32.ge_s": sign([i32, i32], [i32]),
  "i32.ge_u": sign([i32, i32], [i32]),
  "i64.eqz": sign([i64], [i64]),
  "i64.eq": sign([i64, i64], [i32]),
  "i64.ne": sign([i64, i64], [i32]),
  "i64.lt_s": sign([i64, i64], [i32]),
  "i64.lt_u": sign([i64, i64], [i32]),
  "i64.gt_s": sign([i64, i64], [i32]),
  "i64.gt_u": sign([i64, i64], [i32]),
  "i64.le_s": sign([i64, i64], [i32]),
  "i64.le_u": sign([i64, i64], [i32]),
  "i64.ge_s": sign([i64, i64], [i32]),
  "i64.ge_u": sign([i64, i64], [i32]),
  "f32.eq": sign([f32, f32], [i32]),
  "f32.ne": sign([f32, f32], [i32]),
  "f32.lt": sign([f32, f32], [i32]),
  "f32.gt": sign([f32, f32], [i32]),
  "f32.le": sign([f32, f32], [i32]),
  "f32.ge": sign([f32, f32], [i32]),
  "f64.eq": sign([f64, f64], [i32]),
  "f64.ne": sign([f64, f64], [i32]),
  "f64.lt": sign([f64, f64], [i32]),
  "f64.gt": sign([f64, f64], [i32]),
  "f64.le": sign([f64, f64], [i32]),
  "f64.ge": sign([f64, f64], [i32]),
  "i32.clz": sign([i32], [i32]),
  "i32.ctz": sign([i32], [i32]),
  "i32.popcnt": sign([i32], [i32]),
  "i32.add": sign([i32, i32], [i32]),
  "i32.sub": sign([i32, i32], [i32]),
  "i32.mul": sign([i32, i32], [i32]),
  "i32.div_s": sign([i32, i32], [i32]),
  "i32.div_u": sign([i32, i32], [i32]),
  "i32.rem_s": sign([i32, i32], [i32]),
  "i32.rem_u": sign([i32, i32], [i32]),
  "i32.and": sign([i32, i32], [i32]),
  "i32.or": sign([i32, i32], [i32]),
  "i32.xor": sign([i32, i32], [i32]),
  "i32.shl": sign([i32, i32], [i32]),
  "i32.shr_s": sign([i32, i32], [i32]),
  "i32.shr_u": sign([i32, i32], [i32]),
  "i32.rotl": sign([i32, i32], [i32]),
  "i32.rotr": sign([i32, i32], [i32]),
  "i64.clz": sign([i64], [i64]),
  "i64.ctz": sign([i64], [i64]),
  "i64.popcnt": sign([i64], [i64]),
  "i64.add": sign([i64, i64], [i64]),
  "i64.sub": sign([i64, i64], [i64]),
  "i64.mul": sign([i64, i64], [i64]),
  "i64.div_s": sign([i64, i64], [i64]),
  "i64.div_u": sign([i64, i64], [i64]),
  "i64.rem_s": sign([i64, i64], [i64]),
  "i64.rem_u": sign([i64, i64], [i64]),
  "i64.and": sign([i64, i64], [i64]),
  "i64.or": sign([i64, i64], [i64]),
  "i64.xor": sign([i64, i64], [i64]),
  "i64.shl": sign([i64, i64], [i64]),
  "i64.shr_s": sign([i64, i64], [i64]),
  "i64.shr_u": sign([i64, i64], [i64]),
  "i64.rotl": sign([i64, i64], [i64]),
  "i64.rotr": sign([i64, i64], [i64]),
  "f32.abs": sign([f32], [f32]),
  "f32.neg": sign([f32], [f32]),
  "f32.ceil": sign([f32], [f32]),
  "f32.floor": sign([f32], [f32]),
  "f32.trunc": sign([f32], [f32]),
  "f32.nearest": sign([f32], [f32]),
  "f32.sqrt": sign([f32], [f32]),
  "f32.add": sign([f32, f32], [f32]),
  "f32.sub": sign([f32, f32], [f32]),
  "f32.mul": sign([f32, f32], [f32]),
  "f32.div": sign([f32, f32], [f32]),
  "f32.min": sign([f32, f32], [f32]),
  "f32.max": sign([f32, f32], [f32]),
  "f32.copysign": sign([f32, f32], [f32]),
  "f64.abs": sign([f64], [f64]),
  "f64.neg": sign([f64], [f64]),
  "f64.ceil": sign([f64], [f64]),
  "f64.floor": sign([f64], [f64]),
  "f64.trunc": sign([f64], [f64]),
  "f64.nearest": sign([f64], [f64]),
  "f64.sqrt": sign([f64], [f64]),
  "f64.add": sign([f64, f64], [f64]),
  "f64.sub": sign([f64, f64], [f64]),
  "f64.mul": sign([f64, f64], [f64]),
  "f64.div": sign([f64, f64], [f64]),
  "f64.min": sign([f64, f64], [f64]),
  "f64.max": sign([f64, f64], [f64]),
  "f64.copysign": sign([f64, f64], [f64]),
  "i32.wrap/i64": sign([i64], [i32]),
  "i32.trunc_s/f32": sign([f32], [i32]),
  "i32.trunc_u/f32": sign([f32], [i32]),
  "i32.trunc_s/f64": sign([f32], [i32]),
  "i32.trunc_u/f64": sign([f64], [i32]),
  "i64.extend_s/i32": sign([i32], [i64]),
  "i64.extend_u/i32": sign([i32], [i64]),
  "i64.trunc_s/f32": sign([f32], [i64]),
  "i64.trunc_u/f32": sign([f32], [i64]),
  "i64.trunc_s/f64": sign([f64], [i64]),
  "i64.trunc_u/f64": sign([f64], [i64]),
  "f32.convert_s/i32": sign([i32], [f32]),
  "f32.convert_u/i32": sign([i32], [f32]),
  "f32.convert_s/i64": sign([i64], [f32]),
  "f32.convert_u/i64": sign([i64], [f32]),
  "f32.demote/f64": sign([f64], [f32]),
  "f64.convert_s/i32": sign([i32], [f64]),
  "f64.convert_u/i32": sign([i32], [f64]),
  "f64.convert_s/i64": sign([i64], [f64]),
  "f64.convert_u/i64": sign([i64], [f64]),
  "f64.promote/f32": sign([f32], [f64]),
  "i32.reinterpret/f32": sign([f32], [i32]),
  "i64.reinterpret/f64": sign([f64], [i64]),
  "f32.reinterpret/i32": sign([i32], [f32]),
  "f64.reinterpret/i64": sign([i64], [f64])
};
var signatures = Object.assign({}, controlInstructions, parametricInstructions, variableInstructions, memoryInstructions, numericInstructions);

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

function isAnonymous(ident) {
  return ident.raw === "";
}
function getSectionMetadata(ast, name) {
  var section = void 0;
  traverse(ast, {
    SectionMetadata: (function (_SectionMetadata) {
      function SectionMetadata() {
        return _SectionMetadata.apply(this, arguments);
      }

      SectionMetadata.toString = function () {
        return _SectionMetadata.toString();
      };

      return SectionMetadata;
    })(function (_ref) {
      var node = _ref.node;

      if (node.section === name) section = node;
    })
  });
  return section;
}
function getSectionMetadatas(ast, name) {
  var sections = [];
  traverse(ast, {
    SectionMetadata: (function (_SectionMetadata2) {
      function SectionMetadata() {
        return _SectionMetadata2.apply(this, arguments);
      }

      SectionMetadata.toString = function () {
        return _SectionMetadata2.toString();
      };

      return SectionMetadata;
    })(function (_ref2) {
      var node = _ref2.node;

      node.section !== name || sections.push(node);
    })
  });
  return sections;
}
function sortSectionMetadata(m) {
  if (m.metadata == null) {
    console.warn("sortSectionMetadata: no metadata to sort");
    return;
  }

  m.metadata.sections.sort(function (a, b) {
    var aId = sections[a.section],
      bId = sections[b.section];

    if (typeof aId != "number" || typeof bId != "number") throw new Error("Section id not found");

    return aId - bId;
  });
}
function orderedInsertNode(m, n) {
  assertHasLoc(n);
  var didInsert = false;

  if (n.type === "ModuleExport") {
    m.fields.push(n);
    return;
  }

  m.fields = m.fields.reduce(function (acc, field) {
    var fieldEndCol = Infinity;

    if (field.loc != null) fieldEndCol = field.loc.end.column;

    if (didInsert === false && n.loc.start.column < fieldEndCol) {
      didInsert = true;
      acc.push(n);
    }

    acc.push(field);
    return acc;
  }, []);

  didInsert !== false || m.fields.push(n);
}
function assertHasLoc(n) {
  if (n.loc == null || n.loc.start == null || n.loc.end == null)
    throw new Error("Internal failure: node (" + JSON.stringify(n.type) + ") has no location information");
}
function getEndOfSection(s) {
  assertHasLoc(s.size);
  return s.startOffset + s.size.value + (s.size.loc.end.column - s.size.loc.start.column);
}
function shiftLoc(node, delta) {
  node.loc.start.column += delta;

  node.loc.end.column += delta;
}
function shiftSection(ast, node, delta) {
  if (node.type !== "SectionMetadata") throw new Error("Can not shift node " + JSON.stringify(node.type));

  node.startOffset += delta;

  typeof node.size.loc != "object" || shiftLoc(node.size, delta);

  typeof node.vectorOfSize != "object" || typeof node.vectorOfSize.loc != "object" || shiftLoc(node.vectorOfSize, delta);

  var sectionName = node.section;

  traverse(ast, {
    Node: function (_ref3) {
      var node = _ref3.node;

      getSectionForNode(node) !== sectionName || typeof node.loc != "object" || shiftLoc(node, delta);
    }
  });
}
function signatureForOpcode(object, name) {
  var opcodeName = name;

  if (object !== void 0 && object !== "") opcodeName = object + "." + name;

  var sign = signatures[opcodeName];

  return sign == null ? [object, object] : sign[0];
}
function getUniqueNameGenerator() {
  var inc = {};
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "temp";

    inc[prefix] = prefix in inc ? inc[prefix] + 1 : 0;

    return prefix + "_" + inc[prefix];
  };
}
function getStartByteOffset(n) {
  if (n.loc === void 0 || n.loc.start === void 0)
    throw new Error("Can not get byte offset without loc informations, node: " + String(n.id));

  return n.loc.start.column;
}
function getEndByteOffset(n) {
  if (n.loc === void 0 || n.loc.end === void 0) throw new Error("Can not get byte offset without loc informations, node: " + n.type);

  return n.loc.end.column;
}
function getFunctionBeginingByteOffset(n) {
  if (!(n.body.length > 0)) throw new Error("n.body.length > 0 error: unknown");

  return getStartByteOffset(n.body[0]);
}
function getEndBlockByteOffset(n) {
  if (!(n.instr.length > 0 || n.body.length > 0)) throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");

  var lastInstruction;

  if (n.instr) lastInstruction = n.instr[n.instr.length - 1];

  if (n.body) lastInstruction = n.body[n.body.length - 1];

  if (typeof lastInstruction != "object") throw new Error('typeof lastInstruction === "object" error: unknown');

  return getStartByteOffset(lastInstruction);
}
function getStartBlockByteOffset(n) {
  if (!(n.instr.length > 0 || n.body.length > 0)) throw new Error("n.instr.length > 0 || n.body.length > 0 error: unknown");

  var fistInstruction;

  if (n.instr) fistInstruction = n.instr[0];

  if (n.body) fistInstruction = n.body[0];

  if (typeof fistInstruction != "object") throw new Error('typeof fistInstruction === "object" error: unknown');

  return getStartByteOffset(fistInstruction);
}

function cloneNode(n) {
  var newObj = {};

  for (var k in n) newObj[k] = n[k];

  return newObj;
}

exports.assertBinaryModule = assertBinaryModule;
exports.assertBlockComment = assertBlockComment;
exports.assertBlockInstruction = assertBlockInstruction;
exports.assertByteArray = assertByteArray;
exports.assertCallIndirectInstruction = assertCallIndirectInstruction;
exports.assertCallInstruction = assertCallInstruction;
exports.assertData = assertData;
exports.assertElem = assertElem;
exports.assertFloatLiteral = assertFloatLiteral;
exports.assertFunc = assertFunc;
exports.assertFuncImportDescr = assertFuncImportDescr;
exports.assertFunctionNameMetadata = assertFunctionNameMetadata;
exports.assertGlobal = assertGlobal;
exports.assertGlobalType = assertGlobalType;
exports.assertHasLoc = assertHasLoc;
exports.assertIdentifier = assertIdentifier;
exports.assertIfInstruction = assertIfInstruction;
exports.assertIndexInFuncSection = assertIndexInFuncSection;
exports.assertInstr = assertInstr;
exports.assertInternalBrUnless = assertInternalBrUnless;
exports.assertInternalCallExtern = assertInternalCallExtern;
exports.assertInternalEndAndReturn = assertInternalEndAndReturn;
exports.assertInternalGoto = assertInternalGoto;
exports.assertLeadingComment = assertLeadingComment;
exports.assertLimit = assertLimit;
exports.assertLocalNameMetadata = assertLocalNameMetadata;
exports.assertLongNumberLiteral = assertLongNumberLiteral;
exports.assertLoopInstruction = assertLoopInstruction;
exports.assertMemory = assertMemory;
exports.assertModule = assertModule;
exports.assertModuleExport = assertModuleExport;
exports.assertModuleExportDescr = assertModuleExportDescr;
exports.assertModuleImport = assertModuleImport;
exports.assertModuleMetadata = assertModuleMetadata;
exports.assertModuleNameMetadata = assertModuleNameMetadata;
exports.assertNumberLiteral = assertNumberLiteral;
exports.assertProducerMetadata = assertProducerMetadata;
exports.assertProducerMetadataVersionedName = assertProducerMetadataVersionedName;
exports.assertProducersSectionMetadata = assertProducersSectionMetadata;
exports.assertProgram = assertProgram;
exports.assertQuoteModule = assertQuoteModule;
exports.assertSectionMetadata = assertSectionMetadata;
exports.assertSignature = assertSignature;
exports.assertStart = assertStart;
exports.assertStringLiteral = assertStringLiteral;
exports.assertTable = assertTable;
exports.assertTypeInstruction = assertTypeInstruction;
exports.assertValtypeLiteral = assertValtypeLiteral;
exports.binaryModule = binaryModule;
exports.blockComment = blockComment;
exports.blockInstruction = blockInstruction;
exports.byteArray = byteArray;
exports.callIndirectInstruction = callIndirectInstruction;
exports.callInstruction = callInstruction;
exports.cloneNode = cloneNode;
exports.data = data;
exports.elem = elem;
exports.floatLiteral = floatLiteral;
exports.func = func;
exports.funcImportDescr = funcImportDescr;
exports.funcParam = funcParam;
exports.functionNameMetadata = functionNameMetadata;
exports.getEndBlockByteOffset = getEndBlockByteOffset;
exports.getEndByteOffset = getEndByteOffset;
exports.getEndOfSection = getEndOfSection;
exports.getFunctionBeginingByteOffset = getFunctionBeginingByteOffset;
exports.getSectionMetadata = getSectionMetadata;
exports.getSectionMetadatas = getSectionMetadatas;
exports.getStartBlockByteOffset = getStartBlockByteOffset;
exports.getStartByteOffset = getStartByteOffset;
exports.getUniqueNameGenerator = getUniqueNameGenerator;
exports.global = global;
exports.globalType = globalType;
exports.identifier = identifier;
exports.ifInstruction = ifInstruction;
exports.indexInFuncSection = indexInFuncSection;
exports.indexLiteral = indexLiteral;
exports.instr = instr;
exports.instruction = instruction;
exports.internalBrUnless = internalBrUnless;
exports.internalCallExtern = internalCallExtern;
exports.internalEndAndReturn = internalEndAndReturn;
exports.internalGoto = internalGoto;
exports.isAnonymous = isAnonymous;
exports.isBinaryModule = isBinaryModule;
exports.isBlock = isBlock;
exports.isBlockComment = isBlockComment;
exports.isBlockInstruction = isBlockInstruction;
exports.isByteArray = isByteArray;
exports.isCallIndirectInstruction = isCallIndirectInstruction;
exports.isCallInstruction = isCallInstruction;
exports.isData = isData;
exports.isElem = isElem;
exports.isExpression = isExpression;
exports.isFloatLiteral = isFloatLiteral;
exports.isFunc = isFunc;
exports.isFuncImportDescr = isFuncImportDescr;
exports.isFunctionNameMetadata = isFunctionNameMetadata;
exports.isGlobal = isGlobal;
exports.isGlobalType = isGlobalType;
exports.isIdentifier = isIdentifier;
exports.isIfInstruction = isIfInstruction;
exports.isImportDescr = isImportDescr;
exports.isIndexInFuncSection = isIndexInFuncSection;
exports.isInstr = isInstr;
exports.isInstruction = isInstruction;
exports.isInternalBrUnless = isInternalBrUnless;
exports.isInternalCallExtern = isInternalCallExtern;
exports.isInternalEndAndReturn = isInternalEndAndReturn;
exports.isInternalGoto = isInternalGoto;
exports.isIntrinsic = isIntrinsic;
exports.isLeadingComment = isLeadingComment;
exports.isLimit = isLimit;
exports.isLocalNameMetadata = isLocalNameMetadata;
exports.isLongNumberLiteral = isLongNumberLiteral;
exports.isLoopInstruction = isLoopInstruction;
exports.isMemory = isMemory;
exports.isModule = isModule;
exports.isModuleExport = isModuleExport;
exports.isModuleExportDescr = isModuleExportDescr;
exports.isModuleImport = isModuleImport;
exports.isModuleMetadata = isModuleMetadata;
exports.isModuleNameMetadata = isModuleNameMetadata;
exports.isNode = isNode;
exports.isNumberLiteral = isNumberLiteral;
exports.isNumericLiteral = isNumericLiteral;
exports.isProducerMetadata = isProducerMetadata;
exports.isProducerMetadataVersionedName = isProducerMetadataVersionedName;
exports.isProducersSectionMetadata = isProducersSectionMetadata;
exports.isProgram = isProgram;
exports.isQuoteModule = isQuoteModule;
exports.isSectionMetadata = isSectionMetadata;
exports.isSignature = isSignature;
exports.isStart = isStart;
exports.isStringLiteral = isStringLiteral;
exports.isTable = isTable;
exports.isTypeInstruction = isTypeInstruction;
exports.isValtypeLiteral = isValtypeLiteral;
exports.leadingComment = leadingComment;
exports.limit = limit;
exports.localNameMetadata = localNameMetadata;
exports.longNumberLiteral = longNumberLiteral;
exports.loopInstruction = loopInstruction;
exports.memIndexLiteral = memIndexLiteral;
exports.memory = memory;
exports.module = module$1;
exports.moduleExport = moduleExport;
exports.moduleExportDescr = moduleExportDescr;
exports.moduleImport = moduleImport;
exports.moduleMetadata = moduleMetadata;
exports.moduleNameMetadata = moduleNameMetadata;
exports.nodeAndUnionTypes = nodeAndUnionTypes;
exports.numberLiteral = numberLiteral;
exports.numberLiteralFromRaw = numberLiteralFromRaw;
exports.objectInstruction = objectInstruction;
exports.orderedInsertNode = orderedInsertNode;
exports.producerMetadata = producerMetadata;
exports.producerMetadataVersionedName = producerMetadataVersionedName;
exports.producersSectionMetadata = producersSectionMetadata;
exports.program = program;
exports.quoteModule = quoteModule;
exports.sectionMetadata = sectionMetadata;
exports.shiftLoc = shiftLoc;
exports.shiftSection = shiftSection;
exports.signature = signature;
exports.signatureForOpcode = signatureForOpcode;
exports.signatures = signatures;
exports.sortSectionMetadata = sortSectionMetadata;
exports.start = start;
exports.stringLiteral = stringLiteral;
exports.table = table;
exports.traverse = traverse;
exports.typeInstruction = typeInstruction;
exports.unionTypesMap = unionTypesMap;
exports.valtypeLiteral = valtypeLiteral;
exports.withLoc = withLoc;
exports.withRaw = withRaw;

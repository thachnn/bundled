"use strict";

module.exports = (function(modules) {
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
  return __webpack_require__(11);
})([
// 0
function(module) {

module.exports = require("../vendor/source-map");

},
// 1
function(module) {

class Source {
  source() {
    throw new Error("Abstract");
  }

  size() {
    return Buffer.from.length === 1 ? new Buffer(this.source()).length
      : Buffer.byteLength(this.source());
  }

  map(options) {
    return null;
  }

  sourceAndMap(options) {
    return { source: this.source(), map: this.map() };
  }

  node() {
    throw new Error("Abstract");
  }

  listNode() {
    throw new Error("Abstract");
  }

  updateHash(hash) {
    var source = this.source();
    hash.update(source || "");
  }
}

module.exports = Source;

},
// 2
function(module, exports) {

exports.getNumberOfLines = function(str) {
  let nr = -1,
    idx = -1;
  do {
    nr++;
    idx = str.indexOf("\n", idx + 1);
  } while (idx >= 0);
  return nr;
};

exports.getUnfinishedLine = function(str) {
  const idx = str.lastIndexOf("\n");
  return idx < 0 ? str.length : str.length - idx - 1;
};

},
// 3
function(module, exports, __webpack_require__) {

exports.SourceListMap = __webpack_require__(8);
exports.SourceNode = __webpack_require__(5);
exports.SingleLineNode = __webpack_require__(9);
exports.CodeNode = __webpack_require__(6);
exports.MappingsContext = __webpack_require__(10);
exports.fromStringWithSourceMap = __webpack_require__(13);

},
// 4
function(module) {

module.exports = function(proto) {
  proto.map = function(options) {
    return (options = options || {}).columns === false
      ? this.listMap(options).toStringWithSourceMap({ file: "x" }).map

      : this.node(options).toStringWithSourceMap({ file: "x" }).map.toJSON();
  };

  proto.sourceAndMap = function(options) {
    if ((options = options || {}).columns === false)
      return this.listMap(options).toStringWithSourceMap({ file: "x" });

    var res = this.node(options).toStringWithSourceMap({ file: "x" });
    return { source: res.code, map: res.map.toJSON() };
  };
};

},
// 5
function(module, exports, __webpack_require__) {

const base64VLQ = __webpack_require__(7),
  getNumberOfLines = __webpack_require__(2).getNumberOfLines,
  getUnfinishedLine = __webpack_require__(2).getUnfinishedLine,

  LINE_MAPPING = ";AACA";

class SourceNode {
  constructor(generatedCode, source, originalSource, startingLine) {
    this.generatedCode = generatedCode;
    this.originalSource = originalSource;
    this.source = source;
    this.startingLine = startingLine || 1;
    this._numberOfLines = getNumberOfLines(this.generatedCode);
    this._endsWithNewLine = generatedCode[generatedCode.length - 1] === "\n";
  }

  clone() {
    return new SourceNode(this.generatedCode, this.source, this.originalSource, this.startingLine);
  }

  getGeneratedCode() {
    return this.generatedCode;
  }

  addGeneratedCode(code) {
    this.generatedCode += code;
    this._numberOfLines += getNumberOfLines(code);
    this._endsWithNewLine = code[code.length - 1] === "\n";
  }

  getMappings(mappingsContext) {
    if (!this.generatedCode) return "";
    const lines = this._numberOfLines,
      sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
    let mappings = "A";
    if (mappingsContext.unfinishedGeneratedLine)
      mappings = "," + base64VLQ.encode(mappingsContext.unfinishedGeneratedLine);
    mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource);
    mappings += base64VLQ.encode(this.startingLine - mappingsContext.currentOriginalLine);
    mappings += "A";
    mappingsContext.currentSource = sourceIdx;
    mappingsContext.currentOriginalLine = this.startingLine + lines - 1;
    const unfinishedGeneratedLine =
      (mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode));
    mappings += Array(lines).join(LINE_MAPPING);
    if (unfinishedGeneratedLine === 0) mappings += ";";
    else {
      if (lines !== 0) mappings += LINE_MAPPING;

      mappingsContext.currentOriginalLine++;
    }
    return mappings;
  }

  mapGeneratedCode(fn) {
    throw new Error("Cannot map generated code on a SourceMap. Normalize to SingleLineNode first.");
  }

  getNormalizedNodes() {
    var results = [],
      currentLine = this.startingLine,
      generatedCode = this.generatedCode;
    for (var index = 0, indexEnd = generatedCode.length; index < indexEnd; ) {
      var nextLine = generatedCode.indexOf("\n", index) + 1;
      if (nextLine === 0) nextLine = indexEnd;
      var lineGenerated = generatedCode.substr(index, nextLine - index);

      results.push(new SingleLineNode(lineGenerated, this.source, this.originalSource, currentLine));

      index = nextLine;
      currentLine++;
    }
    return results;
  }

  merge(otherNode) {
    return otherNode instanceof SourceNode
      ? this.mergeSourceNode(otherNode)
      : otherNode instanceof SingleLineNode && this.mergeSingleLineNode(otherNode);
  }

  mergeSourceNode(otherNode) {
    if (this.source === otherNode.source &&
        this._endsWithNewLine &&
        this.startingLine + this._numberOfLines === otherNode.startingLine) {
      this.generatedCode += otherNode.generatedCode;
      this._numberOfLines += otherNode._numberOfLines;
      this._endsWithNewLine = otherNode._endsWithNewLine;
      return this;
    }
    return false;
  }

  mergeSingleLineNode(otherNode) {
    if (this.source === otherNode.source &&
        this._endsWithNewLine &&
        this.startingLine + this._numberOfLines === otherNode.line &&
        otherNode._numberOfLines <= 1) {
      this.addSingleLineNode(otherNode);
      return this;
    }
    return false;
  }

  addSingleLineNode(otherNode) {
    this.generatedCode += otherNode.generatedCode;
    this._numberOfLines += otherNode._numberOfLines;
    this._endsWithNewLine = otherNode._endsWithNewLine;
  }
}

module.exports = SourceNode;
const SingleLineNode = __webpack_require__(9);

},
// 6
function(module, exports, __webpack_require__) {

const getNumberOfLines = __webpack_require__(2).getNumberOfLines,
  getUnfinishedLine = __webpack_require__(2).getUnfinishedLine;

class CodeNode {
  constructor(generatedCode) {
    this.generatedCode = generatedCode;
  }

  clone() {
    return new CodeNode(this.generatedCode);
  }

  getGeneratedCode() {
    return this.generatedCode;
  }

  getMappings(mappingsContext) {
    const lines = getNumberOfLines(this.generatedCode),
      mapping = Array(lines + 1).join(";");
    if (lines > 0) {
      mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode);
      return mappingsContext.unfinishedGeneratedLine > 0 ? mapping + "A" : mapping;
    }
    const prevUnfinished = mappingsContext.unfinishedGeneratedLine;
    mappingsContext.unfinishedGeneratedLine += getUnfinishedLine(this.generatedCode);
    return prevUnfinished === 0 && mappingsContext.unfinishedGeneratedLine > 0 ? "A" : "";
  }

  addGeneratedCode(generatedCode) {
    this.generatedCode += generatedCode;
  }

  mapGeneratedCode(fn) {
    const generatedCode = fn(this.generatedCode);
    return new CodeNode(generatedCode);
  }

  getNormalizedNodes() {
    return [this];
  }

  merge(otherNode) {
    if (otherNode instanceof CodeNode) {
      this.generatedCode += otherNode.generatedCode;
      return this;
    }
    return false;
  }
}

module.exports = CodeNode;

},
// 7
function(module, exports) {

var charToIntMap = {},
  intToCharMap = {};

"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  .split("")
  .forEach(function(ch, index) {
    charToIntMap[ch] = index;
    intToCharMap[index] = ch;
  });

var base64 = {
  encode: function(aNumber) {
    if (aNumber in intToCharMap) return intToCharMap[aNumber];

    throw new TypeError("Must be between 0 and 63: " + aNumber);
  },

  decode: function(aChar) {
    if (aChar in charToIntMap) return charToIntMap[aChar];

    throw new TypeError("Not a valid base 64 digit: " + aChar);
  }
};

var VLQ_BASE_SHIFT = 5,
  VLQ_BASE = 1 << VLQ_BASE_SHIFT,

  VLQ_BASE_MASK = VLQ_BASE - 1,
  VLQ_CONTINUATION_BIT = VLQ_BASE;

function toVLQSigned(aValue) {
  return aValue < 0 ? 1 + (-aValue << 1) : 0 + (aValue << 1);
}

function fromVLQSigned(aValue) {
  var shifted = aValue >> 1;
  return (aValue & 1) == 1 ? -shifted : shifted;
}

exports.encode = function(aValue) {
  var digit,
    encoded = "",

    vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    if ((vlq >>>= VLQ_BASE_SHIFT) > 0) digit |= VLQ_CONTINUATION_BIT;

    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

exports.decode = function(aStr, aOutParam) {
  var continuation, digit,
    i = 0,
    strLen = aStr.length,
    result = 0,
    shift = 0;

  do {
    if (i >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");

    continuation = !!((digit = base64.decode(aStr.charAt(i++))) & VLQ_CONTINUATION_BIT);
    result += (digit &= VLQ_BASE_MASK) << shift;
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aStr.slice(i);
};

},
// 8
function(module, exports, __webpack_require__) {

const CodeNode = __webpack_require__(6),
  SourceNode = __webpack_require__(5),
  MappingsContext = __webpack_require__(10);

class SourceListMap {
  constructor(generatedCode, source, originalSource) {
    if (Array.isArray(generatedCode)) this.children = generatedCode;
    else {
      this.children = [];
      if (generatedCode || source) this.add(generatedCode, source, originalSource);
    }
  }

  add(generatedCode, source, originalSource) {
    if (typeof generatedCode == "string")
      source
        ? this.children.push(new SourceNode(generatedCode, source, originalSource))
        : this.children.length > 0 && this.children[this.children.length - 1] instanceof CodeNode
        ? this.children[this.children.length - 1].addGeneratedCode(generatedCode)
        : this.children.push(new CodeNode(generatedCode));
    else if (generatedCode.getMappings && generatedCode.getGeneratedCode)
      this.children.push(generatedCode);
    else if (generatedCode.children)
      generatedCode.children.forEach(function(sln) {
        this.children.push(sln);
      }, this);
    else
      throw new Error(
        "Invalid arguments to SourceListMap.prototype.add: Expected string, Node or SourceListMap"
      );
  }

  preprend(generatedCode, source, originalSource) {
    if (typeof generatedCode == "string")
      source
        ? this.children.unshift(new SourceNode(generatedCode, source, originalSource))
        : this.children.length > 0 && this.children[this.children.length - 1].preprendGeneratedCode
        ? this.children[this.children.length - 1].preprendGeneratedCode(generatedCode)
        : this.children.unshift(new CodeNode(generatedCode));
    else if (generatedCode.getMappings && generatedCode.getGeneratedCode)
      this.children.unshift(generatedCode);
    else if (generatedCode.children)
      generatedCode.children.slice().reverse().forEach(function(sln) {
        this.children.unshift(sln);
      }, this);
    else
      throw new Error(
        "Invalid arguments to SourceListMap.prototype.prepend: Expected string, Node or SourceListMap"
      );
  }

  mapGeneratedCode(fn) {
    const normalizedNodes = [];
    this.children.forEach(function(sln) {
      sln.getNormalizedNodes().forEach(function(newNode) {
        normalizedNodes.push(newNode);
      });
    });
    const optimizedNodes = [];
    normalizedNodes.forEach(function(sln) {
      sln = sln.mapGeneratedCode(fn);
      if (optimizedNodes.length === 0) optimizedNodes.push(sln);
      else {
        const mergedNode = optimizedNodes[optimizedNodes.length - 1].merge(sln);
        mergedNode
          ? (optimizedNodes[optimizedNodes.length - 1] = mergedNode)
          : optimizedNodes.push(sln);
      }
    });
    return new SourceListMap(optimizedNodes);
  }

  toString() {
    return this.children.map(function(sln) {
      return sln.getGeneratedCode();
    }).join("");
  }

  toStringWithSourceMap(options) {
    const mappingsContext = new MappingsContext(),
      source = this.children.map(function(sln) {
        return sln.getGeneratedCode();
      }).join(""),
      mappings = this.children.map(function(sln) {
        return sln.getMappings(mappingsContext);
      }).join(""),
      arrays = mappingsContext.getArrays();
    return {
      source,
      map: {
        version: 3,
        file: options && options.file,
        sources: arrays.sources,
        sourcesContent: mappingsContext.hasSourceContent ? arrays.sourcesContent : void 0,
        mappings: mappings
      }
    };
  }
}

module.exports = SourceListMap;

},
// 9
function(module, exports, __webpack_require__) {

const base64VLQ = __webpack_require__(7),
  getNumberOfLines = __webpack_require__(2).getNumberOfLines,
  getUnfinishedLine = __webpack_require__(2).getUnfinishedLine,

  LINE_MAPPING = ";AAAA";

class SingleLineNode {
  constructor(generatedCode, source, originalSource, line) {
    this.generatedCode = generatedCode;
    this.originalSource = originalSource;
    this.source = source;
    this.line = line || 1;
    this._numberOfLines = getNumberOfLines(this.generatedCode);
    this._endsWithNewLine = generatedCode[generatedCode.length - 1] === "\n";
  }

  clone() {
    return new SingleLineNode(this.generatedCode, this.source, this.originalSource, this.line);
  }

  getGeneratedCode() {
    return this.generatedCode;
  }

  getMappings(mappingsContext) {
    if (!this.generatedCode) return "";
    const lines = this._numberOfLines,
      sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
    let mappings = "A";
    if (mappingsContext.unfinishedGeneratedLine)
      mappings = "," + base64VLQ.encode(mappingsContext.unfinishedGeneratedLine);
    mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource);
    mappings += base64VLQ.encode(this.line - mappingsContext.currentOriginalLine);
    mappings += "A";
    mappingsContext.currentSource = sourceIdx;
    mappingsContext.currentOriginalLine = this.line;
    const unfinishedGeneratedLine =
      (mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode));
    mappings += Array(lines).join(LINE_MAPPING);
    if (unfinishedGeneratedLine === 0) mappings += ";";
    else if (lines !== 0) mappings += LINE_MAPPING;

    return mappings;
  }

  getNormalizedNodes() {
    return [this];
  }

  mapGeneratedCode(fn) {
    const generatedCode = fn(this.generatedCode);
    return new SingleLineNode(generatedCode, this.source, this.originalSource, this.line);
  }

  merge(otherNode) {
    return otherNode instanceof SingleLineNode && this.mergeSingleLineNode(otherNode);
  }

  mergeSingleLineNode(otherNode) {
    if (this.source !== otherNode.source || this.originalSource !== otherNode.originalSource)
      return false;

    if (this.line === otherNode.line) {
      this.generatedCode += otherNode.generatedCode;
      this._numberOfLines += otherNode._numberOfLines;
      this._endsWithNewLine = otherNode._endsWithNewLine;
      return this;
    }
    return this.line + 1 === otherNode.line &&
      !!this._endsWithNewLine &&
      this._numberOfLines === 1 &&
      otherNode._numberOfLines <= 1 &&
      new SourceNode(
        this.generatedCode + otherNode.generatedCode, this.source, this.originalSource, this.line
      );
  }
}

module.exports = SingleLineNode;

const SourceNode = __webpack_require__(5);

},
// 10
function(module) {

class MappingsContext {
  constructor() {
    this.sourcesIndices = new Map();
    this.sourcesContent = new Map();
    this.hasSourceContent = false;
    this.currentOriginalLine = 1;
    this.currentSource = 0;
    this.unfinishedGeneratedLine = false;
  }

  ensureSource(source, originalSource) {
    let idx = this.sourcesIndices.get(source);
    if (typeof idx == "number") return idx;

    idx = this.sourcesIndices.size;
    this.sourcesIndices.set(source, idx);
    this.sourcesContent.set(source, originalSource);
    if (typeof originalSource == "string") this.hasSourceContent = true;
    return idx;
  }

  getArrays() {
    const sources = [],
      sourcesContent = [];

    for (const pair of this.sourcesContent) {
      sources.push(pair[0]);
      sourcesContent.push(pair[1]);
    }

    return { sources, sourcesContent };
  }
}
module.exports = MappingsContext;

},
// 11
function(module, exports, __webpack_require__) {

exports.Source = __webpack_require__(1);

exports.RawSource = __webpack_require__(12);
exports.OriginalSource = __webpack_require__(14);
exports.SourceMapSource = __webpack_require__(15);
exports.LineToLineMappedSource = __webpack_require__(17);

exports.CachedSource = __webpack_require__(18);
exports.ConcatSource = __webpack_require__(19);
exports.ReplaceSource = __webpack_require__(20);
exports.PrefixSource = __webpack_require__(21);

},
// 12
function(module, exports, __webpack_require__) {

var Source = __webpack_require__(1),
  SourceNode = __webpack_require__(0).SourceNode,
  SourceListMap = __webpack_require__(3).SourceListMap;

class RawSource extends Source {
  constructor(value) {
    super();
    this._value = value;
  }

  source() {
    return this._value;
  }

  map(options) {
    return null;
  }

  node(options) {
    return new SourceNode(null, null, null, this._value);
  }

  listMap(options) {
    return new SourceListMap(this._value);
  }

  updateHash(hash) {
    hash.update(this._value);
  }
}

module.exports = RawSource;

},
// 13
function(module, exports, __webpack_require__) {

const base64VLQ = __webpack_require__(7),
  SourceNode = __webpack_require__(5),
  CodeNode = __webpack_require__(6),
  SourceListMap = __webpack_require__(8);

module.exports = function(code, map) {
  const sources = map.sources,
    sourcesContent = map.sourcesContent,
    mappings = map.mappings.split(";"),
    lines = code.split("\n"),
    nodes = [];
  let currentSourceNodeLine,
    currentNode = null,
    currentLine = 1,
    currentSourceIdx = 0;
  function addCode(generatedCode) {
    if (currentNode && currentNode instanceof CodeNode)
      currentNode.addGeneratedCode(generatedCode);
    else if (currentNode && currentNode instanceof SourceNode && !generatedCode.trim()) {
      currentNode.addGeneratedCode(generatedCode);
      currentSourceNodeLine++;
    } else {
      currentNode = new CodeNode(generatedCode);
      nodes.push(currentNode);
    }
  }
  function addSource(generatedCode, source, originalSource, linePosition) {
    if (currentNode && currentNode instanceof SourceNode &&
        currentNode.source === source &&
        currentSourceNodeLine === linePosition) {
      currentNode.addGeneratedCode(generatedCode);
      currentSourceNodeLine++;
    } else {
      currentNode = new SourceNode(generatedCode, source, originalSource, linePosition);
      currentSourceNodeLine = linePosition + 1;
      nodes.push(currentNode);
    }
  }
  mappings.forEach(function(mapping, idx) {
    let line = lines[idx];
    if (line === void 0) return;
    if (idx !== lines.length - 1) line += "\n";
    if (!mapping) return addCode(line);
    mapping = { value: 0, rest: mapping };
    let lineAdded = false;
    while (mapping.rest) lineAdded = processMapping(mapping, line, lineAdded) || lineAdded;
    lineAdded || addCode(line);
  });
  if (mappings.length < lines.length) {
    let idx = mappings.length;
    while (!lines[idx].trim() && idx < lines.length - 1) {
      addCode(lines[idx] + "\n");
      idx++;
    }
    addCode(lines.slice(idx).join("\n"));
  }
  return new SourceListMap(nodes);
  function processMapping(mapping, line, ignore) {
    mapping.rest && mapping.rest[0] !== "," && base64VLQ.decode(mapping.rest, mapping);

    if (!mapping.rest) return false;
    if (mapping.rest[0] === ",") {
      mapping.rest = mapping.rest.substr(1);
      return false;
    }

    base64VLQ.decode(mapping.rest, mapping);
    const sourceIdx = mapping.value + currentSourceIdx;
    currentSourceIdx = sourceIdx;

    let linePosition;
    if (mapping.rest && mapping.rest[0] !== ",") {
      base64VLQ.decode(mapping.rest, mapping);
      linePosition = mapping.value + currentLine;
      currentLine = linePosition;
    } else linePosition = currentLine;

    if (mapping.rest) {
      const next = mapping.rest.indexOf(",");
      mapping.rest = next < 0 ? "" : mapping.rest.substr(next);
    }

    if (!ignore) {
      addSource(
        line,
        sources ? sources[sourceIdx] : null,
        sourcesContent ? sourcesContent[sourceIdx] : null,
        linePosition
      );
      return true;
    }
  }
};

},
// 14
function(module, exports, __webpack_require__) {

var SourceNode = __webpack_require__(0).SourceNode,
  SourceListMap = __webpack_require__(3).SourceListMap,
  Source = __webpack_require__(1),

  SPLIT_REGEX = /(?!$)[^\n\r;{}]*[\n\r;{}]*/g;

function _splitCode(code) {
  return code.match(SPLIT_REGEX) || [];
}

class OriginalSource extends Source {
  constructor(value, name) {
    super();
    this._value = value;
    this._name = name;
  }

  source() {
    return this._value;
  }

  node(options) {
    options = options || {};
    var value = this._value,
      name = this._name,
      lines = value.split("\n");
    var node = new SourceNode(null, null, null,
      lines.map(function(line, idx) {
        var pos = 0;
        if (options.columns === false) {
          var content = line + (idx != lines.length - 1 ? "\n" : "");
          return new SourceNode(idx + 1, 0, name, content);
        }
        return new SourceNode(null, null, null,
          _splitCode(line + (idx != lines.length - 1 ? "\n" : "")).map(function(item) {
            if (/^\s*$/.test(item)) {
              pos += item.length;
              return item;
            }
            var res = new SourceNode(idx + 1, pos, name, item);
            pos += item.length;
            return res;
          })
        );
      })
    );
    node.setSourceContent(name, value);
    return node;
  }

  listMap(options) {
    return new SourceListMap(this._value, this._name, this._value);
  }

  updateHash(hash) {
    hash.update(this._value);
  }
}

__webpack_require__(4)(OriginalSource.prototype);

module.exports = OriginalSource;

},
// 15
function(module, exports, __webpack_require__) {

var SourceNode = __webpack_require__(0).SourceNode,
  SourceMapConsumer = __webpack_require__(0).SourceMapConsumer,
  SourceListMap = __webpack_require__(3).SourceListMap,
  fromStringWithSourceMap = __webpack_require__(3).fromStringWithSourceMap,
  Source = __webpack_require__(1),
  applySourceMap = __webpack_require__(16);

class SourceMapSource extends Source {
  constructor(value, name, sourceMap, originalSource, innerSourceMap, removeOriginalSource) {
    super();
    this._value = value;
    this._name = name;
    this._sourceMap = sourceMap;
    this._originalSource = originalSource;
    this._innerSourceMap = innerSourceMap;
    this._removeOriginalSource = removeOriginalSource;
  }

  source() {
    return this._value;
  }

  node(options) {
    var sourceMap = this._sourceMap,
      node = SourceNode.fromStringWithSourceMap(this._value, new SourceMapConsumer(sourceMap));
    node.setSourceContent(this._name, this._originalSource);
    var innerSourceMap = this._innerSourceMap;
    if (innerSourceMap)
      node = applySourceMap(
        node, new SourceMapConsumer(innerSourceMap), this._name, this._removeOriginalSource
      );

    return node;
  }

  listMap(options) {
    return (options = options || {}).module === false
      ? new SourceListMap(this._value, this._name, this._value)
      : fromStringWithSourceMap(
          this._value,
          typeof this._sourceMap == "string" ? JSON.parse(this._sourceMap) : this._sourceMap
        );
  }

  updateHash(hash) {
    hash.update(this._value);
    this._originalSource && hash.update(this._originalSource);
  }
}

__webpack_require__(4)(SourceMapSource.prototype);

module.exports = SourceMapSource;

},
// 16
function(module, exports, __webpack_require__) {

var SourceNode = __webpack_require__(0).SourceNode,
  SourceMapConsumer = __webpack_require__(0).SourceMapConsumer;

var applySourceMap = function(
  sourceNode,
  sourceMapConsumer,
  sourceFile,
  removeGeneratedCodeForSourceFile
) {
  var l2rResult = new SourceNode(),
    l2rOutput = [],

    middleSourceContents = {},

    m2rMappingsByLine = {},

    rightSourceContentsSet = {},
    rightSourceContentsLines = {};

  sourceMapConsumer.eachMapping(
    function(mapping) {
      (m2rMappingsByLine[mapping.generatedLine] =
        m2rMappingsByLine[mapping.generatedLine] || []).push(mapping);
    },
    null,
    SourceMapConsumer.GENERATED_ORDER
  );

  sourceNode.walkSourceContents(function(source, content) {
    middleSourceContents["$" + source] = content;
  });

  var middleSource = middleSourceContents["$" + sourceFile],
    middleSourceLines = middleSource ? middleSource.split("\n") : void 0;

  sourceNode.walk(function(chunk, middleMapping) {
    var source;

    if (
      middleMapping.source === sourceFile &&
      middleMapping.line &&
      m2rMappingsByLine[middleMapping.line]
    ) {
      var m2rBestFit,
        m2rMappings = m2rMappingsByLine[middleMapping.line];
      for (var i = 0; i < m2rMappings.length; i++)
        if (m2rMappings[i].generatedColumn <= middleMapping.column) m2rBestFit = m2rMappings[i];

      if (m2rBestFit) {
        var middleLine,
          rightSourceContent,
          rightSourceContentLines,
          allowMiddleName = false,
          rightSource = m2rBestFit.source;
        if (
          middleSourceLines &&
          rightSource &&
          (middleLine = middleSourceLines[m2rBestFit.generatedLine - 1]) &&
          ((rightSourceContentLines = rightSourceContentsLines[rightSource]) ||
            (rightSourceContent = sourceMapConsumer.sourceContentFor(rightSource, true)))
        ) {
          rightSourceContentLines ||
            (rightSourceContentLines = rightSourceContentsLines[rightSource] =
              rightSourceContent.split("\n"));

          var rightLine = rightSourceContentLines[m2rBestFit.originalLine - 1];
          if (rightLine) {
            var offset = middleMapping.column - m2rBestFit.generatedColumn;
            if (offset > 0 &&
                middleLine.slice(m2rBestFit.generatedColumn, middleMapping.column) ===
                  rightLine.slice(m2rBestFit.originalColumn, m2rBestFit.originalColumn + offset))
              m2rBestFit = Object.assign({}, m2rBestFit, {
                originalColumn: m2rBestFit.originalColumn + offset,
                generatedColumn: middleMapping.column
              });

            if (!m2rBestFit.name && middleMapping.name)
              allowMiddleName =
                rightLine.slice(
                  m2rBestFit.originalColumn,
                  m2rBestFit.originalColumn + middleMapping.name.length
                ) === middleMapping.name;
          }
        }

        source = m2rBestFit.source;
        l2rOutput.push(
          new SourceNode(
            m2rBestFit.originalLine,
            m2rBestFit.originalColumn,
            source,
            chunk,
            allowMiddleName ? middleMapping.name : m2rBestFit.name
          )
        );

        if (!("$" + source in rightSourceContentsSet)) {
          rightSourceContentsSet["$" + source] = true;
          var sourceContent = sourceMapConsumer.sourceContentFor(source, true);
          sourceContent && l2rResult.setSourceContent(source, sourceContent);
        }
        return;
      }
    }

    if ((removeGeneratedCodeForSourceFile && middleMapping.source === sourceFile) ||
        !middleMapping.source) {
      l2rOutput.push(chunk);
      return;
    }

    source = middleMapping.source;
    l2rOutput.push(
      new SourceNode(middleMapping.line, middleMapping.column, source, chunk, middleMapping.name)
    );
    if ("$" + source in middleSourceContents && !("$" + source in rightSourceContentsSet)) {
      l2rResult.setSourceContent(source, middleSourceContents["$" + source]);
      delete middleSourceContents["$" + source];
    }
  });

  l2rResult.add(l2rOutput);
  return l2rResult;
};

module.exports = applySourceMap;

},
// 17
function(module, exports, __webpack_require__) {

var SourceNode = __webpack_require__(0).SourceNode,
  SourceListMap = __webpack_require__(3).SourceListMap,
  Source = __webpack_require__(1);

class LineToLineMappedSource extends Source {
  constructor(value, name, originalSource) {
    super();
    this._value = value;
    this._name = name;
    this._originalSource = originalSource;
  }

  source() {
    return this._value;
  }

  node(options) {
    var value = this._value,
      name = this._name,
      lines = value.split("\n");
    var node = new SourceNode(null, null, null,
      lines.map(function(line, idx) {
        return new SourceNode(idx + 1, 0, name, line + (idx != lines.length - 1 ? "\n" : ""));
      })
    );
    node.setSourceContent(name, this._originalSource);
    return node;
  }

  listMap(options) {
    return new SourceListMap(this._value, this._name, this._originalSource);
  }

  updateHash(hash) {
    hash.update(this._value);
    hash.update(this._originalSource);
  }
}

__webpack_require__(4)(LineToLineMappedSource.prototype);

module.exports = LineToLineMappedSource;

},
// 18
function(module, exports, __webpack_require__) {

const Source = __webpack_require__(1);

class CachedSource extends Source {
  constructor(source) {
    super();
    this._source = source;
    this._cachedSource = void 0;
    this._cachedSize = void 0;
    this._cachedMaps = {};

    if (source.node) this.node = function(options) {
      return this._source.node(options);
    };

    if (source.listMap) this.listMap = function(options) {
      return this._source.listMap(options);
    };
  }

  source() {
    return this._cachedSource !== void 0 ? this._cachedSource
      : (this._cachedSource = this._source.source());
  }

  size() {
    return this._cachedSize !== void 0 ? this._cachedSize
      : this._cachedSource !== void 0
      ? Buffer.from.length === 1 ? new Buffer(this._cachedSource).length
        : (this._cachedSize = Buffer.byteLength(this._cachedSource))

      : (this._cachedSize = this._source.size());
  }

  sourceAndMap(options) {
    const key = JSON.stringify(options);
    if (this._cachedSource !== void 0 && key in this._cachedMaps)
      return { source: this._cachedSource, map: this._cachedMaps[key] };
    if (this._cachedSource !== void 0)
      return {
        source: this._cachedSource,
        map: (this._cachedMaps[key] = this._source.map(options))
      };
    if (key in this._cachedMaps)
      return { source: (this._cachedSource = this._source.source()), map: this._cachedMaps[key] };

    const result = this._source.sourceAndMap(options);
    this._cachedSource = result.source;
    this._cachedMaps[key] = result.map;
    return { source: this._cachedSource, map: this._cachedMaps[key] };
  }

  map(options) {
    options || (options = {});
    const key = JSON.stringify(options);
    return key in this._cachedMaps
      ? this._cachedMaps[key]
      : (this._cachedMaps[key] = this._source.map());
  }

  updateHash(hash) {
    this._source.updateHash(hash);
  }
}

module.exports = CachedSource;

},
// 19
function(module, exports, __webpack_require__) {

const SourceNode = __webpack_require__(0).SourceNode,
  SourceListMap = __webpack_require__(3).SourceListMap,
  Source = __webpack_require__(1);

class ConcatSource extends Source {
  constructor() {
    super();
    this.children = [];
    for (var i = 0; i < arguments.length; i++) {
      var item = arguments[i];
      if (item instanceof ConcatSource)
        for (var children = item.children, j = 0; j < children.length; j++)
          this.children.push(children[j]);
      else this.children.push(item);
    }
  }

  add(item) {
    if (item instanceof ConcatSource)
      for (var children = item.children, j = 0; j < children.length; j++)
        this.children.push(children[j]);
    else this.children.push(item);
  }

  source() {
    let source = "";
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      source += typeof child == "string" ? child : child.source();
    }
    return source;
  }

  size() {
    let size = 0;
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      size += typeof child == "string" ? child.length : child.size();
    }
    return size;
  }

  node(options) {
    return new SourceNode(null, null, null, this.children.map(function(item) {
      return typeof item == "string" ? item : item.node(options);
    }));
  }

  listMap(options) {
    const map = new SourceListMap();
    for (var children = this.children, i = 0; i < children.length; i++) {
      var item = children[i];
      typeof item == "string" ? map.add(item) : map.add(item.listMap(options));
    }
    return map;
  }

  updateHash(hash) {
    for (var children = this.children, i = 0; i < children.length; i++) {
      var item = children[i];
      typeof item == "string" ? hash.update(item) : item.updateHash(hash);
    }
  }
}

__webpack_require__(4)(ConcatSource.prototype);

module.exports = ConcatSource;

},
// 20
function(module, exports, __webpack_require__) {

var Source = __webpack_require__(1),
  SourceNode = __webpack_require__(0).SourceNode;

class Replacement {
  constructor(start, end, content, insertIndex, name) {
    this.start = start;
    this.end = end;
    this.content = content;
    this.insertIndex = insertIndex;
    this.name = name;
  }
}

class ReplaceSource extends Source {
  constructor(source, name) {
    super();
    this._source = source;
    this._name = name;
    this.replacements = [];
  }

  replace(start, end, newValue, name) {
    if (typeof newValue != "string")
      throw new Error("insertion must be a string, but is a " + typeof newValue);
    this.replacements.push(new Replacement(start, end, newValue, this.replacements.length, name));
  }

  insert(pos, newValue, name) {
    if (typeof newValue != "string")
      throw new Error("insertion must be a string, but is a " + typeof newValue + ": " + newValue);
    this.replacements.push(new Replacement(pos, pos - 1, newValue, this.replacements.length, name));
  }

  source(options) {
    return this._replaceString(this._source.source());
  }

  original() {
    return this._source;
  }

  _sortReplacements() {
    this.replacements.sort(function(a, b) {
      var diff = b.end - a.end;
      return diff !== 0 || (diff = b.start - a.start) != 0 ? diff : b.insertIndex - a.insertIndex;
    });
  }

  _replaceString(str) {
    if (typeof str != "string")
      throw new Error("str must be a string, but is a " + typeof str + ": " + str);
    this._sortReplacements();
    var result = [str];
    this.replacements.forEach(function(repl) {
      var remSource = result.pop(),
        splitted1 = this._splitString(remSource, Math.floor(repl.end + 1)),
        splitted2 = this._splitString(splitted1[0], Math.floor(repl.start));
      result.push(splitted1[1], repl.content, splitted2[0]);
    }, this);

    let resultStr = "";
    for (let i = result.length - 1; i >= 0; --i) resultStr += result[i];

    return resultStr;
  }

  node(options) {
    var node = this._source.node(options);
    if (this.replacements.length === 0) return node;

    this._sortReplacements();
    var replace = new ReplacementEnumerator(this.replacements),
      output = [],
      position = 0,
      sources = Object.create(null),
      sourcesInLines = Object.create(null),

      result = new SourceNode();

    node.walkSourceContents(function(sourceFile, sourceContent) {
      result.setSourceContent(sourceFile, sourceContent);
      sources["$" + sourceFile] = sourceContent;
    });

    var replaceInStringNode = this._replaceInStringNode.bind(this, output, replace, function(mapping) {
      var key = "$" + mapping.source,
        lines = sourcesInLines[key];
      if (!lines) {
        var source = sources[key];
        if (!source) return null;
        lines = source.split("\n").map(function(line) {
          return line + "\n";
        });
        sourcesInLines[key] = lines;
      }
      return mapping.line > lines.length ? null : lines[mapping.line - 1].substr(mapping.column);
    });

    node.walk(function(chunk, mapping) {
      position = replaceInStringNode(chunk, position, mapping);
    });

    var remaining = replace.footer();
    remaining && output.push(remaining);

    result.add(output);

    return result;
  }

  listMap(options) {
    this._sortReplacements();
    var map = this._source.listMap(options),
      currentIndex = 0,
      replacements = this.replacements,
      idxReplacement = replacements.length - 1,
      removeChars = 0;
    map = map.mapGeneratedCode(function(str) {
      var newCurrentIndex = currentIndex + str.length;
      if (removeChars > str.length) {
        removeChars -= str.length;
        str = "";
      } else {
        if (removeChars > 0) {
          str = str.substr(removeChars);
          currentIndex += removeChars;
          removeChars = 0;
        }
        var finalStr = "";
        while (idxReplacement >= 0 && replacements[idxReplacement].start < newCurrentIndex) {
          var repl = replacements[idxReplacement],
            start = Math.floor(repl.start),
            end = Math.floor(repl.end + 1),
            before = str.substr(0, Math.max(0, start - currentIndex));
          if (end <= newCurrentIndex) {
            var after = str.substr(Math.max(0, end - currentIndex));
            finalStr += before + repl.content;
            str = after;
            currentIndex = Math.max(currentIndex, end);
          } else {
            finalStr += before + repl.content;
            str = "";
            removeChars = end - newCurrentIndex;
          }
          idxReplacement--;
        }
        str = finalStr + str;
      }
      currentIndex = newCurrentIndex;
      return str;
    });
    var extraCode = "";
    while (idxReplacement >= 0) {
      extraCode += replacements[idxReplacement].content;
      idxReplacement--;
    }
    extraCode && map.add(extraCode);

    return map;
  }

  _splitString(str, position) {
    return position <= 0 ? ["", str] : [str.substr(0, position), str.substr(position)];
  }

  _replaceInStringNode(output, replace, getOriginalSource, node, position, mapping) {
    for (var original = void 0; ; ) {
      var splitPosition = replace.position - position;
      if (splitPosition < 0) splitPosition = 0;

      if (splitPosition >= node.length || replace.done) {
        if (replace.emit) {
          var nodeEnd = new SourceNode(
            mapping.line,
            mapping.column,
            mapping.source,
            node,
            mapping.name
          );
          output.push(nodeEnd);
        }
        return position + node.length;
      }

      var nodePart,
        originalColumn = mapping.column;

      if (splitPosition > 0) {
        nodePart = node.slice(0, splitPosition);
        if (original === void 0) original = getOriginalSource(mapping);

        if (original && original.length >= splitPosition && original.startsWith(nodePart)) {
          mapping.column += splitPosition;
          original = original.substr(splitPosition);
        }
      }

      if (!replace.next()) {
        if (splitPosition > 0) {
          var nodeStart = new SourceNode(
            mapping.line,
            originalColumn,
            mapping.source,
            nodePart,
            mapping.name
          );
          output.push(nodeStart);
        }

        replace.value &&
          output.push(new SourceNode(
            mapping.line,
            mapping.column,
            mapping.source,
            replace.value,
            mapping.name || replace.name
          ));
      }

      node = node.substr(splitPosition);
      position += splitPosition;
    }
  }
}

class ReplacementEnumerator {
  constructor(replacements) {
    this.replacements = replacements || [];
    this.index = this.replacements.length;
    this.done = false;
    this.emit = false;
    this.next();
  }

  next() {
    if (this.done) return true;
    if (this.emit) {
      var repl = this.replacements[this.index],
        end = Math.floor(repl.end + 1);
      this.position = end;
      this.value = repl.content;
      this.name = repl.name;
    } else {
      this.index--;
      if (this.index < 0) this.done = true;
      else {
        var nextRepl = this.replacements[this.index],
          start = Math.floor(nextRepl.start);
        this.position = start;
      }
    }
    if (this.position < 0) this.position = 0;
    this.emit = !this.emit;
    return this.emit;
  }

  footer() {
    this.done || this.emit || this.next();
    if (this.done) return [];

    var resultStr = "";
    for (var i = this.index; i >= 0; i--) resultStr += this.replacements[i].content;

    return resultStr;
  }
}

__webpack_require__(4)(ReplaceSource.prototype);

module.exports = ReplaceSource;

},
// 21
function(module, exports, __webpack_require__) {

var Source = __webpack_require__(1),
  SourceNode = __webpack_require__(0).SourceNode,

  REPLACE_REGEX = /\n(?=.|\s)/g;

class PrefixSource extends Source {
  constructor(prefix, source) {
    super();
    this._source = source;
    this._prefix = prefix;
  }

  source() {
    var node = typeof this._source == "string" ? this._source : this._source.source(),
      prefix = this._prefix;
    return prefix + node.replace(REPLACE_REGEX, "\n" + prefix);
  }

  node(options) {
    var node = this._source.node(options),
      prefix = this._prefix,
      output = [],
      result = new SourceNode();
    node.walkSourceContents(function(source, content) {
      result.setSourceContent(source, content);
    });
    var needPrefix = true;
    node.walk(function(chunk, mapping) {
      for (var parts = chunk.split(/(\n)/), i = 0; i < parts.length; i += 2) {
        var nl = i + 1 < parts.length,
          part = parts[i] + (nl ? "\n" : "");
        if (!part) continue;

        needPrefix && output.push(prefix);

        output.push(
          new SourceNode(mapping.line, mapping.column, mapping.source, part, mapping.name)
        );
        needPrefix = nl;
      }
    });
    result.add(output);
    return result;
  }

  listMap(options) {
    var prefix = this._prefix;
    return this._source.listMap(options).mapGeneratedCode(function(code) {
      return prefix + code.replace(REPLACE_REGEX, "\n" + prefix);
    });
  }

  updateHash(hash) {
    typeof this._source == "string" ? hash.update(this._source) : this._source.updateHash(hash);
    typeof this._prefix == "string" ? hash.update(this._prefix) : this._prefix.updateHash(hash);
  }
}

__webpack_require__(4)(PrefixSource.prototype);

module.exports = PrefixSource;

}
]);

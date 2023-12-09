"use strict";
module.exports = function(modules) {
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
  return __webpack_require__(11);
}([ function(module, exports) {
  module.exports = require("../vendor/source-map");
}, function(module, exports, __webpack_require__) {
  __webpack_require__(0).SourceNode, __webpack_require__(0).SourceMapConsumer;
  module.exports = class {
    source() {
      throw new Error("Abstract");
    }
    size() {
      return 1 === Buffer.from.length ? new Buffer(this.source()).length : Buffer.byteLength(this.source());
    }
    map(options) {
      return null;
    }
    sourceAndMap(options) {
      return {
        source: this.source(),
        map: this.map()
      };
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
  };
}, function(module, exports, __webpack_require__) {
  exports.getNumberOfLines = function(str) {
    let nr = -1, idx = -1;
    do {
      nr++, idx = str.indexOf("\n", idx + 1);
    } while (idx >= 0);
    return nr;
  }, exports.getUnfinishedLine = function(str) {
    const idx = str.lastIndexOf("\n");
    return -1 === idx ? str.length : str.length - idx - 1;
  };
}, function(module, exports, __webpack_require__) {
  exports.SourceListMap = __webpack_require__(8), exports.SourceNode = __webpack_require__(5), 
  exports.SingleLineNode = __webpack_require__(9), exports.CodeNode = __webpack_require__(6), 
  exports.MappingsContext = __webpack_require__(10), exports.fromStringWithSourceMap = __webpack_require__(13);
}, function(module, exports, __webpack_require__) {
  module.exports = function(proto) {
    proto.map = function(options) {
      return !1 === (options = options || {}).columns ? this.listMap(options).toStringWithSourceMap({
        file: "x"
      }).map : this.node(options).toStringWithSourceMap({
        file: "x"
      }).map.toJSON();
    }, proto.sourceAndMap = function(options) {
      if (!1 === (options = options || {}).columns) return this.listMap(options).toStringWithSourceMap({
        file: "x"
      });
      var res = this.node(options).toStringWithSourceMap({
        file: "x"
      });
      return {
        source: res.code,
        map: res.map.toJSON()
      };
    };
  };
}, function(module, exports, __webpack_require__) {
  const base64VLQ = __webpack_require__(7), getNumberOfLines = __webpack_require__(2).getNumberOfLines, getUnfinishedLine = __webpack_require__(2).getUnfinishedLine;
  class SourceNode {
    constructor(generatedCode, source, originalSource, startingLine) {
      this.generatedCode = generatedCode, this.originalSource = originalSource, this.source = source, 
      this.startingLine = startingLine || 1, this._numberOfLines = getNumberOfLines(this.generatedCode), 
      this._endsWithNewLine = "\n" === generatedCode[generatedCode.length - 1];
    }
    clone() {
      return new SourceNode(this.generatedCode, this.source, this.originalSource, this.startingLine);
    }
    getGeneratedCode() {
      return this.generatedCode;
    }
    addGeneratedCode(code) {
      this.generatedCode += code, this._numberOfLines += getNumberOfLines(code), this._endsWithNewLine = "\n" === code[code.length - 1];
    }
    getMappings(mappingsContext) {
      if (!this.generatedCode) return "";
      const lines = this._numberOfLines, sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
      let mappings = "A";
      mappingsContext.unfinishedGeneratedLine && (mappings = "," + base64VLQ.encode(mappingsContext.unfinishedGeneratedLine)), 
      mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource), mappings += base64VLQ.encode(this.startingLine - mappingsContext.currentOriginalLine), 
      mappings += "A", mappingsContext.currentSource = sourceIdx, mappingsContext.currentOriginalLine = this.startingLine + lines - 1;
      const unfinishedGeneratedLine = mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode);
      return mappings += Array(lines).join(";AACA"), 0 === unfinishedGeneratedLine ? mappings += ";" : (0 !== lines && (mappings += ";AACA"), 
      mappingsContext.currentOriginalLine++), mappings;
    }
    mapGeneratedCode(fn) {
      throw new Error("Cannot map generated code on a SourceMap. Normalize to SingleLineNode first.");
    }
    getNormalizedNodes() {
      for (var results = [], currentLine = this.startingLine, generatedCode = this.generatedCode, index = 0, indexEnd = generatedCode.length; index < indexEnd; ) {
        var nextLine = generatedCode.indexOf("\n", index) + 1;
        0 === nextLine && (nextLine = indexEnd);
        var lineGenerated = generatedCode.substr(index, nextLine - index);
        results.push(new SingleLineNode(lineGenerated, this.source, this.originalSource, currentLine)), 
        index = nextLine, currentLine++;
      }
      return results;
    }
    merge(otherNode) {
      return otherNode instanceof SourceNode ? this.mergeSourceNode(otherNode) : otherNode instanceof SingleLineNode && this.mergeSingleLineNode(otherNode);
    }
    mergeSourceNode(otherNode) {
      return !(this.source !== otherNode.source || !this._endsWithNewLine || this.startingLine + this._numberOfLines !== otherNode.startingLine) && (this.generatedCode += otherNode.generatedCode, 
      this._numberOfLines += otherNode._numberOfLines, this._endsWithNewLine = otherNode._endsWithNewLine, 
      this);
    }
    mergeSingleLineNode(otherNode) {
      return !!(this.source === otherNode.source && this._endsWithNewLine && this.startingLine + this._numberOfLines === otherNode.line && otherNode._numberOfLines <= 1) && (this.addSingleLineNode(otherNode), 
      this);
    }
    addSingleLineNode(otherNode) {
      this.generatedCode += otherNode.generatedCode, this._numberOfLines += otherNode._numberOfLines, 
      this._endsWithNewLine = otherNode._endsWithNewLine;
    }
  }
  module.exports = SourceNode;
  const SingleLineNode = __webpack_require__(9);
}, function(module, exports, __webpack_require__) {
  const getNumberOfLines = __webpack_require__(2).getNumberOfLines, getUnfinishedLine = __webpack_require__(2).getUnfinishedLine;
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
      const lines = getNumberOfLines(this.generatedCode), mapping = Array(lines + 1).join(";");
      if (lines > 0) return mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode), 
      mappingsContext.unfinishedGeneratedLine > 0 ? mapping + "A" : mapping;
      {
        const prevUnfinished = mappingsContext.unfinishedGeneratedLine;
        return mappingsContext.unfinishedGeneratedLine += getUnfinishedLine(this.generatedCode), 
        0 === prevUnfinished && mappingsContext.unfinishedGeneratedLine > 0 ? "A" : "";
      }
    }
    addGeneratedCode(generatedCode) {
      this.generatedCode += generatedCode;
    }
    mapGeneratedCode(fn) {
      const generatedCode = fn(this.generatedCode);
      return new CodeNode(generatedCode);
    }
    getNormalizedNodes() {
      return [ this ];
    }
    merge(otherNode) {
      return otherNode instanceof CodeNode && (this.generatedCode += otherNode.generatedCode, 
      this);
    }
  }
  module.exports = CodeNode;
}, function(module, exports) {
  var charToIntMap = {}, intToCharMap = {};
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("").forEach((function(ch, index) {
    charToIntMap[ch] = index, intToCharMap[index] = ch;
  }));
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
  exports.encode = function(aValue) {
    var digit, encoded = "", vlq = function(aValue) {
      return aValue < 0 ? 1 + (-aValue << 1) : 0 + (aValue << 1);
    }(aValue);
    do {
      digit = 31 & vlq, (vlq >>>= 5) > 0 && (digit |= 32), encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  }, exports.decode = function(aStr, aOutParam) {
    var continuation, digit, aValue, shifted, i = 0, strLen = aStr.length, result = 0, shift = 0;
    do {
      if (i >= strLen) throw new Error("Expected more digits in base 64 VLQ value.");
      continuation = !!(32 & (digit = base64.decode(aStr.charAt(i++)))), result += (digit &= 31) << shift, 
      shift += 5;
    } while (continuation);
    aOutParam.value = (shifted = (aValue = result) >> 1, 1 == (1 & aValue) ? -shifted : shifted), 
    aOutParam.rest = aStr.slice(i);
  };
}, function(module, exports, __webpack_require__) {
  const CodeNode = __webpack_require__(6), SourceNode = __webpack_require__(5), MappingsContext = __webpack_require__(10);
  __webpack_require__(2).getNumberOfLines;
  class SourceListMap {
    constructor(generatedCode, source, originalSource) {
      Array.isArray(generatedCode) ? this.children = generatedCode : (this.children = [], 
      (generatedCode || source) && this.add(generatedCode, source, originalSource));
    }
    add(generatedCode, source, originalSource) {
      if ("string" == typeof generatedCode) source ? this.children.push(new SourceNode(generatedCode, source, originalSource)) : this.children.length > 0 && this.children[this.children.length - 1] instanceof CodeNode ? this.children[this.children.length - 1].addGeneratedCode(generatedCode) : this.children.push(new CodeNode(generatedCode)); else if (generatedCode.getMappings && generatedCode.getGeneratedCode) this.children.push(generatedCode); else {
        if (!generatedCode.children) throw new Error("Invalid arguments to SourceListMap.protfotype.add: Expected string, Node or SourceListMap");
        generatedCode.children.forEach((function(sln) {
          this.children.push(sln);
        }), this);
      }
    }
    preprend(generatedCode, source, originalSource) {
      if ("string" == typeof generatedCode) source ? this.children.unshift(new SourceNode(generatedCode, source, originalSource)) : this.children.length > 0 && this.children[this.children.length - 1].preprendGeneratedCode ? this.children[this.children.length - 1].preprendGeneratedCode(generatedCode) : this.children.unshift(new CodeNode(generatedCode)); else if (generatedCode.getMappings && generatedCode.getGeneratedCode) this.children.unshift(generatedCode); else {
        if (!generatedCode.children) throw new Error("Invalid arguments to SourceListMap.protfotype.prerend: Expected string, Node or SourceListMap");
        generatedCode.children.slice().reverse().forEach((function(sln) {
          this.children.unshift(sln);
        }), this);
      }
    }
    mapGeneratedCode(fn) {
      const normalizedNodes = [];
      this.children.forEach((function(sln) {
        sln.getNormalizedNodes().forEach((function(newNode) {
          normalizedNodes.push(newNode);
        }));
      }));
      const optimizedNodes = [];
      return normalizedNodes.forEach((function(sln) {
        if (sln = sln.mapGeneratedCode(fn), 0 === optimizedNodes.length) optimizedNodes.push(sln); else {
          const mergedNode = optimizedNodes[optimizedNodes.length - 1].merge(sln);
          mergedNode ? optimizedNodes[optimizedNodes.length - 1] = mergedNode : optimizedNodes.push(sln);
        }
      })), new SourceListMap(optimizedNodes);
    }
    toString() {
      return this.children.map((function(sln) {
        return sln.getGeneratedCode();
      })).join("");
    }
    toStringWithSourceMap(options) {
      const mappingsContext = new MappingsContext, source = this.children.map((function(sln) {
        return sln.getGeneratedCode();
      })).join(""), mappings = this.children.map((function(sln) {
        return sln.getMappings(mappingsContext);
      })).join(""), arrays = mappingsContext.getArrays();
      return {
        source: source,
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
}, function(module, exports, __webpack_require__) {
  const base64VLQ = __webpack_require__(7), getNumberOfLines = __webpack_require__(2).getNumberOfLines, getUnfinishedLine = __webpack_require__(2).getUnfinishedLine;
  class SingleLineNode {
    constructor(generatedCode, source, originalSource, line) {
      this.generatedCode = generatedCode, this.originalSource = originalSource, this.source = source, 
      this.line = line || 1, this._numberOfLines = getNumberOfLines(this.generatedCode), 
      this._endsWithNewLine = "\n" === generatedCode[generatedCode.length - 1];
    }
    clone() {
      return new SingleLineNode(this.generatedCode, this.source, this.originalSource, this.line);
    }
    getGeneratedCode() {
      return this.generatedCode;
    }
    getMappings(mappingsContext) {
      if (!this.generatedCode) return "";
      const lines = this._numberOfLines, sourceIdx = mappingsContext.ensureSource(this.source, this.originalSource);
      let mappings = "A";
      mappingsContext.unfinishedGeneratedLine && (mappings = "," + base64VLQ.encode(mappingsContext.unfinishedGeneratedLine)), 
      mappings += base64VLQ.encode(sourceIdx - mappingsContext.currentSource), mappings += base64VLQ.encode(this.line - mappingsContext.currentOriginalLine), 
      mappings += "A", mappingsContext.currentSource = sourceIdx, mappingsContext.currentOriginalLine = this.line;
      const unfinishedGeneratedLine = mappingsContext.unfinishedGeneratedLine = getUnfinishedLine(this.generatedCode);
      return mappings += Array(lines).join(";AAAA"), 0 === unfinishedGeneratedLine ? mappings += ";" : 0 !== lines && (mappings += ";AAAA"), 
      mappings;
    }
    getNormalizedNodes() {
      return [ this ];
    }
    mapGeneratedCode(fn) {
      const generatedCode = fn(this.generatedCode);
      return new SingleLineNode(generatedCode, this.source, this.originalSource, this.line);
    }
    merge(otherNode) {
      return otherNode instanceof SingleLineNode && this.mergeSingleLineNode(otherNode);
    }
    mergeSingleLineNode(otherNode) {
      if (this.source === otherNode.source && this.originalSource === otherNode.originalSource) {
        if (this.line === otherNode.line) return this.generatedCode += otherNode.generatedCode, 
        this._numberOfLines += otherNode._numberOfLines, this._endsWithNewLine = otherNode._endsWithNewLine, 
        this;
        if (this.line + 1 === otherNode.line && this._endsWithNewLine && 1 === this._numberOfLines && otherNode._numberOfLines <= 1) return new SourceNode(this.generatedCode + otherNode.generatedCode, this.source, this.originalSource, this.line);
      }
      return !1;
    }
  }
  module.exports = SingleLineNode;
  const SourceNode = __webpack_require__(5);
}, function(module, exports, __webpack_require__) {
  module.exports = class {
    constructor() {
      this.sourcesIndices = new Map, this.sourcesContent = new Map, this.hasSourceContent = !1, 
      this.currentOriginalLine = 1, this.currentSource = 0, this.unfinishedGeneratedLine = !1;
    }
    ensureSource(source, originalSource) {
      let idx = this.sourcesIndices.get(source);
      return "number" == typeof idx || (idx = this.sourcesIndices.size, this.sourcesIndices.set(source, idx), 
      this.sourcesContent.set(source, originalSource), "string" == typeof originalSource && (this.hasSourceContent = !0)), 
      idx;
    }
    getArrays() {
      const sources = [], sourcesContent = [];
      for (const pair of this.sourcesContent) sources.push(pair[0]), sourcesContent.push(pair[1]);
      return {
        sources: sources,
        sourcesContent: sourcesContent
      };
    }
  };
}, function(module, exports, __webpack_require__) {
  exports.Source = __webpack_require__(1), exports.RawSource = __webpack_require__(12), 
  exports.OriginalSource = __webpack_require__(14), exports.SourceMapSource = __webpack_require__(15), 
  exports.LineToLineMappedSource = __webpack_require__(17), exports.CachedSource = __webpack_require__(18), 
  exports.ConcatSource = __webpack_require__(19), exports.ReplaceSource = __webpack_require__(20), 
  exports.PrefixSource = __webpack_require__(21);
}, function(module, exports, __webpack_require__) {
  var Source = __webpack_require__(1), SourceNode = __webpack_require__(0).SourceNode, SourceListMap = __webpack_require__(3).SourceListMap;
  module.exports = class extends Source {
    constructor(value) {
      super(), this._value = value;
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
  };
}, function(module, exports, __webpack_require__) {
  const base64VLQ = __webpack_require__(7), SourceNode = __webpack_require__(5), CodeNode = __webpack_require__(6), SourceListMap = __webpack_require__(8);
  module.exports = function(code, map) {
    const sources = map.sources, sourcesContent = map.sourcesContent, mappings = map.mappings.split(";"), lines = code.split("\n"), nodes = [];
    let currentSourceNodeLine, currentNode = null, currentLine = 1, currentSourceIdx = 0;
    function addCode(generatedCode) {
      currentNode && currentNode instanceof CodeNode ? currentNode.addGeneratedCode(generatedCode) : currentNode && currentNode instanceof SourceNode && !generatedCode.trim() ? (currentNode.addGeneratedCode(generatedCode), 
      currentSourceNodeLine++) : (currentNode = new CodeNode(generatedCode), nodes.push(currentNode));
    }
    if (mappings.forEach((function(mapping, idx) {
      let line = lines[idx];
      if (void 0 === line) return;
      if (idx !== lines.length - 1 && (line += "\n"), !mapping) return addCode(line);
      mapping = {
        value: 0,
        rest: mapping
      };
      let lineAdded = !1;
      for (;mapping.rest; ) lineAdded = processMapping(mapping, line, lineAdded) || lineAdded;
      lineAdded || addCode(line);
    })), mappings.length < lines.length) {
      let idx = mappings.length;
      for (;!lines[idx].trim() && idx < lines.length - 1; ) addCode(lines[idx] + "\n"), 
      idx++;
      addCode(lines.slice(idx).join("\n"));
    }
    return new SourceListMap(nodes);
    function processMapping(mapping, line, ignore) {
      if (mapping.rest && "," !== mapping.rest[0] && base64VLQ.decode(mapping.rest, mapping), 
      !mapping.rest) return !1;
      if ("," === mapping.rest[0]) return mapping.rest = mapping.rest.substr(1), !1;
      base64VLQ.decode(mapping.rest, mapping);
      const sourceIdx = mapping.value + currentSourceIdx;
      let linePosition;
      if (currentSourceIdx = sourceIdx, mapping.rest && "," !== mapping.rest[0] ? (base64VLQ.decode(mapping.rest, mapping), 
      linePosition = mapping.value + currentLine, currentLine = linePosition) : linePosition = currentLine, 
      mapping.rest) {
        const next = mapping.rest.indexOf(",");
        mapping.rest = -1 === next ? "" : mapping.rest.substr(next);
      }
      return ignore ? void 0 : (function(generatedCode, source, originalSource, linePosition) {
        currentNode && currentNode instanceof SourceNode && currentNode.source === source && currentSourceNodeLine === linePosition ? (currentNode.addGeneratedCode(generatedCode), 
        currentSourceNodeLine++) : (currentNode = new SourceNode(generatedCode, source, originalSource, linePosition), 
        currentSourceNodeLine = linePosition + 1, nodes.push(currentNode));
      }(line, sources ? sources[sourceIdx] : null, sourcesContent ? sourcesContent[sourceIdx] : null, linePosition), 
      !0);
    }
  };
}, function(module, exports, __webpack_require__) {
  var SourceNode = __webpack_require__(0).SourceNode, SourceListMap = (__webpack_require__(0).SourceMapConsumer, 
  __webpack_require__(3).SourceListMap), Source = __webpack_require__(1), SPLIT_REGEX = /(?!$)[^\n\r;{}]*[\n\r;{}]*/g;
  class OriginalSource extends Source {
    constructor(value, name) {
      super(), this._value = value, this._name = name;
    }
    source() {
      return this._value;
    }
    node(options) {
      options = options || {};
      this._sourceMap;
      var value = this._value, name = this._name, lines = value.split("\n"), node = new SourceNode(null, null, null, lines.map((function(line, idx) {
        var code, pos = 0;
        if (!1 === options.columns) {
          var content = line + (idx != lines.length - 1 ? "\n" : "");
          return new SourceNode(idx + 1, 0, name, content);
        }
        return new SourceNode(null, null, null, (code = line + (idx != lines.length - 1 ? "\n" : ""), 
        code.match(SPLIT_REGEX) || []).map((function(item) {
          if (/^\s*$/.test(item)) return pos += item.length, item;
          var res = new SourceNode(idx + 1, pos, name, item);
          return pos += item.length, res;
        })));
      })));
      return node.setSourceContent(name, value), node;
    }
    listMap(options) {
      return new SourceListMap(this._value, this._name, this._value);
    }
    updateHash(hash) {
      hash.update(this._value);
    }
  }
  __webpack_require__(4)(OriginalSource.prototype), module.exports = OriginalSource;
}, function(module, exports, __webpack_require__) {
  var SourceNode = __webpack_require__(0).SourceNode, SourceMapConsumer = __webpack_require__(0).SourceMapConsumer, SourceListMap = (__webpack_require__(0).SourceMapGenerator, 
  __webpack_require__(3).SourceListMap), fromStringWithSourceMap = __webpack_require__(3).fromStringWithSourceMap, Source = __webpack_require__(1), applySourceMap = __webpack_require__(16);
  class SourceMapSource extends Source {
    constructor(value, name, sourceMap, originalSource, innerSourceMap, removeOriginalSource) {
      super(), this._value = value, this._name = name, this._sourceMap = sourceMap, this._originalSource = originalSource, 
      this._innerSourceMap = innerSourceMap, this._removeOriginalSource = removeOriginalSource;
    }
    source() {
      return this._value;
    }
    node(options) {
      var sourceMap = this._sourceMap, node = SourceNode.fromStringWithSourceMap(this._value, new SourceMapConsumer(sourceMap));
      node.setSourceContent(this._name, this._originalSource);
      var innerSourceMap = this._innerSourceMap;
      return innerSourceMap && (node = applySourceMap(node, new SourceMapConsumer(innerSourceMap), this._name, this._removeOriginalSource)), 
      node;
    }
    listMap(options) {
      return !1 === (options = options || {}).module ? new SourceListMap(this._value, this._name, this._value) : fromStringWithSourceMap(this._value, "string" == typeof this._sourceMap ? JSON.parse(this._sourceMap) : this._sourceMap);
    }
    updateHash(hash) {
      hash.update(this._value), this._originalSource && hash.update(this._originalSource);
    }
  }
  __webpack_require__(4)(SourceMapSource.prototype), module.exports = SourceMapSource;
}, function(module, exports, __webpack_require__) {
  var SourceNode = __webpack_require__(0).SourceNode, SourceMapConsumer = __webpack_require__(0).SourceMapConsumer;
  module.exports = function(sourceNode, sourceMapConsumer, sourceFile, removeGeneratedCodeForSourceFile) {
    var l2rResult = new SourceNode, l2rOutput = [], middleSourceContents = {}, m2rMappingsByLine = {}, rightSourceContentsSet = {}, rightSourceContentsLines = {};
    sourceMapConsumer.eachMapping((function(mapping) {
      (m2rMappingsByLine[mapping.generatedLine] = m2rMappingsByLine[mapping.generatedLine] || []).push(mapping);
    }), null, SourceMapConsumer.GENERATED_ORDER), sourceNode.walkSourceContents((function(source, content) {
      middleSourceContents["$" + source] = content;
    }));
    var middleSource = middleSourceContents["$" + sourceFile], middleSourceLines = middleSource ? middleSource.split("\n") : void 0;
    return sourceNode.walk((function(chunk, middleMapping) {
      var source;
      if (middleMapping.source === sourceFile && middleMapping.line && m2rMappingsByLine[middleMapping.line]) {
        for (var m2rBestFit, m2rMappings = m2rMappingsByLine[middleMapping.line], i = 0; i < m2rMappings.length; i++) m2rMappings[i].generatedColumn <= middleMapping.column && (m2rBestFit = m2rMappings[i]);
        if (m2rBestFit) {
          var middleLine, rightSourceContent, rightSourceContentLines, allowMiddleName = !1, rightSource = m2rBestFit.source;
          if (middleSourceLines && rightSource && (middleLine = middleSourceLines[m2rBestFit.generatedLine - 1]) && ((rightSourceContentLines = rightSourceContentsLines[rightSource]) || (rightSourceContent = sourceMapConsumer.sourceContentFor(rightSource, !0)))) {
            rightSourceContentLines || (rightSourceContentLines = rightSourceContentsLines[rightSource] = rightSourceContent.split("\n"));
            var rightLine = rightSourceContentLines[m2rBestFit.originalLine - 1];
            if (rightLine) {
              var offset = middleMapping.column - m2rBestFit.generatedColumn;
              if (offset > 0) middleLine.slice(m2rBestFit.generatedColumn, middleMapping.column) === rightLine.slice(m2rBestFit.originalColumn, m2rBestFit.originalColumn + offset) && (m2rBestFit = Object.assign({}, m2rBestFit, {
                originalColumn: m2rBestFit.originalColumn + offset,
                generatedColumn: middleMapping.column
              }));
              !m2rBestFit.name && middleMapping.name && (allowMiddleName = rightLine.slice(m2rBestFit.originalColumn, m2rBestFit.originalColumn + middleMapping.name.length) === middleMapping.name);
            }
          }
          if (source = m2rBestFit.source, l2rOutput.push(new SourceNode(m2rBestFit.originalLine, m2rBestFit.originalColumn, source, chunk, allowMiddleName ? middleMapping.name : m2rBestFit.name)), 
          !("$" + source in rightSourceContentsSet)) {
            rightSourceContentsSet["$" + source] = !0;
            var sourceContent = sourceMapConsumer.sourceContentFor(source, !0);
            sourceContent && l2rResult.setSourceContent(source, sourceContent);
          }
          return;
        }
      }
      removeGeneratedCodeForSourceFile && middleMapping.source === sourceFile || !middleMapping.source ? l2rOutput.push(chunk) : (source = middleMapping.source, 
      l2rOutput.push(new SourceNode(middleMapping.line, middleMapping.column, source, chunk, middleMapping.name)), 
      "$" + source in middleSourceContents && ("$" + source in rightSourceContentsSet || (l2rResult.setSourceContent(source, middleSourceContents["$" + source]), 
      delete middleSourceContents["$" + source])));
    })), l2rResult.add(l2rOutput), l2rResult;
  };
}, function(module, exports, __webpack_require__) {
  var SourceNode = __webpack_require__(0).SourceNode, SourceListMap = (__webpack_require__(0).SourceMapConsumer, 
  __webpack_require__(3).SourceListMap), Source = __webpack_require__(1);
  class LineToLineMappedSource extends Source {
    constructor(value, name, originalSource) {
      super(), this._value = value, this._name = name, this._originalSource = originalSource;
    }
    source() {
      return this._value;
    }
    node(options) {
      var value = this._value, name = this._name, lines = value.split("\n"), node = new SourceNode(null, null, null, lines.map((function(line, idx) {
        return new SourceNode(idx + 1, 0, name, line + (idx != lines.length - 1 ? "\n" : ""));
      })));
      return node.setSourceContent(name, this._originalSource), node;
    }
    listMap(options) {
      return new SourceListMap(this._value, this._name, this._originalSource);
    }
    updateHash(hash) {
      hash.update(this._value), hash.update(this._originalSource);
    }
  }
  __webpack_require__(4)(LineToLineMappedSource.prototype), module.exports = LineToLineMappedSource;
}, function(module, exports, __webpack_require__) {
  const Source = __webpack_require__(1);
  module.exports = class extends Source {
    constructor(source) {
      super(), this._source = source, this._cachedSource = void 0, this._cachedSize = void 0, 
      this._cachedMaps = {}, source.node && (this.node = function(options) {
        return this._source.node(options);
      }), source.listMap && (this.listMap = function(options) {
        return this._source.listMap(options);
      });
    }
    source() {
      return void 0 !== this._cachedSource ? this._cachedSource : this._cachedSource = this._source.source();
    }
    size() {
      return void 0 !== this._cachedSize ? this._cachedSize : void 0 !== this._cachedSource ? 1 === Buffer.from.length ? new Buffer(this._cachedSource).length : this._cachedSize = Buffer.byteLength(this._cachedSource) : this._cachedSize = this._source.size();
    }
    sourceAndMap(options) {
      const key = JSON.stringify(options);
      if (void 0 !== this._cachedSource && key in this._cachedMaps) return {
        source: this._cachedSource,
        map: this._cachedMaps[key]
      };
      if (void 0 !== this._cachedSource) return {
        source: this._cachedSource,
        map: this._cachedMaps[key] = this._source.map(options)
      };
      if (key in this._cachedMaps) return {
        source: this._cachedSource = this._source.source(),
        map: this._cachedMaps[key]
      };
      const result = this._source.sourceAndMap(options);
      return this._cachedSource = result.source, this._cachedMaps[key] = result.map, {
        source: this._cachedSource,
        map: this._cachedMaps[key]
      };
    }
    map(options) {
      options || (options = {});
      const key = JSON.stringify(options);
      return key in this._cachedMaps ? this._cachedMaps[key] : this._cachedMaps[key] = this._source.map();
    }
    updateHash(hash) {
      this._source.updateHash(hash);
    }
  };
}, function(module, exports, __webpack_require__) {
  const SourceNode = __webpack_require__(0).SourceNode, SourceListMap = __webpack_require__(3).SourceListMap, Source = __webpack_require__(1);
  class ConcatSource extends Source {
    constructor() {
      super(), this.children = [];
      for (var i = 0; i < arguments.length; i++) {
        var item = arguments[i];
        if (item instanceof ConcatSource) for (var children = item.children, j = 0; j < children.length; j++) this.children.push(children[j]); else this.children.push(item);
      }
    }
    add(item) {
      if (item instanceof ConcatSource) for (var children = item.children, j = 0; j < children.length; j++) this.children.push(children[j]); else this.children.push(item);
    }
    source() {
      let source = "";
      const children = this.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        source += "string" == typeof child ? child : child.source();
      }
      return source;
    }
    size() {
      let size = 0;
      const children = this.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        size += "string" == typeof child ? child.length : child.size();
      }
      return size;
    }
    node(options) {
      return new SourceNode(null, null, null, this.children.map((function(item) {
        return "string" == typeof item ? item : item.node(options);
      })));
    }
    listMap(options) {
      const map = new SourceListMap;
      for (var children = this.children, i = 0; i < children.length; i++) {
        var item = children[i];
        "string" == typeof item ? map.add(item) : map.add(item.listMap(options));
      }
      return map;
    }
    updateHash(hash) {
      for (var children = this.children, i = 0; i < children.length; i++) {
        var item = children[i];
        "string" == typeof item ? hash.update(item) : item.updateHash(hash);
      }
    }
  }
  __webpack_require__(4)(ConcatSource.prototype), module.exports = ConcatSource;
}, function(module, exports, __webpack_require__) {
  var Source = __webpack_require__(1), SourceNode = __webpack_require__(0).SourceNode;
  class Replacement {
    constructor(start, end, content, insertIndex, name) {
      this.start = start, this.end = end, this.content = content, this.insertIndex = insertIndex, 
      this.name = name;
    }
  }
  class ReplaceSource extends Source {
    constructor(source, name) {
      super(), this._source = source, this._name = name, this.replacements = [];
    }
    replace(start, end, newValue, name) {
      if ("string" != typeof newValue) throw new Error("insertion must be a string, but is a " + typeof newValue);
      this.replacements.push(new Replacement(start, end, newValue, this.replacements.length, name));
    }
    insert(pos, newValue, name) {
      if ("string" != typeof newValue) throw new Error("insertion must be a string, but is a " + typeof newValue + ": " + newValue);
      this.replacements.push(new Replacement(pos, pos - 1, newValue, this.replacements.length, name));
    }
    source(options) {
      return this._replaceString(this._source.source());
    }
    original() {
      return this._source;
    }
    _sortReplacements() {
      this.replacements.sort((function(a, b) {
        var diff = b.end - a.end;
        return 0 !== diff || 0 !== (diff = b.start - a.start) ? diff : b.insertIndex - a.insertIndex;
      }));
    }
    _replaceString(str) {
      if ("string" != typeof str) throw new Error("str must be a string, but is a " + typeof str + ": " + str);
      this._sortReplacements();
      var result = [ str ];
      this.replacements.forEach((function(repl) {
        var remSource = result.pop(), splitted1 = this._splitString(remSource, Math.floor(repl.end + 1)), splitted2 = this._splitString(splitted1[0], Math.floor(repl.start));
        result.push(splitted1[1], repl.content, splitted2[0]);
      }), this);
      let resultStr = "";
      for (let i = result.length - 1; i >= 0; --i) resultStr += result[i];
      return resultStr;
    }
    node(options) {
      var node = this._source.node(options);
      if (0 === this.replacements.length) return node;
      this._sortReplacements();
      var replace = new ReplacementEnumerator(this.replacements), output = [], position = 0, sources = Object.create(null), sourcesInLines = Object.create(null), result = new SourceNode;
      node.walkSourceContents((function(sourceFile, sourceContent) {
        result.setSourceContent(sourceFile, sourceContent), sources["$" + sourceFile] = sourceContent;
      }));
      var replaceInStringNode = this._replaceInStringNode.bind(this, output, replace, (function(mapping) {
        var key = "$" + mapping.source, lines = sourcesInLines[key];
        if (!lines) {
          var source = sources[key];
          if (!source) return null;
          lines = source.split("\n").map((function(line) {
            return line + "\n";
          })), sourcesInLines[key] = lines;
        }
        return mapping.line > lines.length ? null : lines[mapping.line - 1].substr(mapping.column);
      }));
      node.walk((function(chunk, mapping) {
        position = replaceInStringNode(chunk, position, mapping);
      }));
      var remaining = replace.footer();
      return remaining && output.push(remaining), result.add(output), result;
    }
    listMap(options) {
      this._sortReplacements();
      var map = this._source.listMap(options), currentIndex = 0, replacements = this.replacements, idxReplacement = replacements.length - 1, removeChars = 0;
      map = map.mapGeneratedCode((function(str) {
        var newCurrentIndex = currentIndex + str.length;
        if (removeChars > str.length) removeChars -= str.length, str = ""; else {
          removeChars > 0 && (str = str.substr(removeChars), currentIndex += removeChars, 
          removeChars = 0);
          for (var finalStr = ""; idxReplacement >= 0 && replacements[idxReplacement].start < newCurrentIndex; ) {
            var repl = replacements[idxReplacement], start = Math.floor(repl.start), end = Math.floor(repl.end + 1), before = str.substr(0, Math.max(0, start - currentIndex));
            if (end <= newCurrentIndex) {
              var after = str.substr(Math.max(0, end - currentIndex));
              finalStr += before + repl.content, str = after, currentIndex = Math.max(currentIndex, end);
            } else finalStr += before + repl.content, str = "", removeChars = end - newCurrentIndex;
            idxReplacement--;
          }
          str = finalStr + str;
        }
        return currentIndex = newCurrentIndex, str;
      }));
      for (var extraCode = ""; idxReplacement >= 0; ) extraCode += replacements[idxReplacement].content, 
      idxReplacement--;
      return extraCode && map.add(extraCode), map;
    }
    _splitString(str, position) {
      return position <= 0 ? [ "", str ] : [ str.substr(0, position), str.substr(position) ];
    }
    _replaceInStringNode(output, replace, getOriginalSource, node, position, mapping) {
      for (var original = void 0; ;) {
        var splitPosition = replace.position - position;
        if (splitPosition < 0 && (splitPosition = 0), splitPosition >= node.length || replace.done) {
          if (replace.emit) {
            var nodeEnd = new SourceNode(mapping.line, mapping.column, mapping.source, node, mapping.name);
            output.push(nodeEnd);
          }
          return position + node.length;
        }
        var nodePart, originalColumn = mapping.column;
        if (splitPosition > 0 && (nodePart = node.slice(0, splitPosition), void 0 === original && (original = getOriginalSource(mapping)), 
        original && original.length >= splitPosition && original.startsWith(nodePart) && (mapping.column += splitPosition, 
        original = original.substr(splitPosition))), !replace.next()) {
          if (splitPosition > 0) {
            var nodeStart = new SourceNode(mapping.line, originalColumn, mapping.source, nodePart, mapping.name);
            output.push(nodeStart);
          }
          replace.value && output.push(new SourceNode(mapping.line, mapping.column, mapping.source, replace.value, mapping.name || replace.name));
        }
        node = node.substr(splitPosition), position += splitPosition;
      }
    }
  }
  class ReplacementEnumerator {
    constructor(replacements) {
      this.replacements = replacements || [], this.index = this.replacements.length, this.done = !1, 
      this.emit = !1, this.next();
    }
    next() {
      if (this.done) return !0;
      if (this.emit) {
        var repl = this.replacements[this.index], end = Math.floor(repl.end + 1);
        this.position = end, this.value = repl.content, this.name = repl.name;
      } else if (this.index--, this.index < 0) this.done = !0; else {
        var nextRepl = this.replacements[this.index], start = Math.floor(nextRepl.start);
        this.position = start;
      }
      return this.position < 0 && (this.position = 0), this.emit = !this.emit, this.emit;
    }
    footer() {
      if (this.done || this.emit || this.next(), this.done) return [];
      for (var resultStr = "", i = this.index; i >= 0; i--) {
        resultStr += this.replacements[i].content;
      }
      return resultStr;
    }
  }
  __webpack_require__(4)(ReplaceSource.prototype), module.exports = ReplaceSource;
}, function(module, exports, __webpack_require__) {
  var Source = __webpack_require__(1), SourceNode = __webpack_require__(0).SourceNode, REPLACE_REGEX = /\n(?=.|\s)/g;
  class PrefixSource extends Source {
    constructor(prefix, source) {
      super(), this._source = source, this._prefix = prefix;
    }
    source() {
      var node = "string" == typeof this._source ? this._source : this._source.source(), prefix = this._prefix;
      return prefix + node.replace(REPLACE_REGEX, "\n" + prefix);
    }
    node(options) {
      var node = this._source.node(options), prefix = this._prefix, output = [], result = new SourceNode;
      node.walkSourceContents((function(source, content) {
        result.setSourceContent(source, content);
      }));
      var needPrefix = !0;
      return node.walk((function(chunk, mapping) {
        for (var parts = chunk.split(/(\n)/), i = 0; i < parts.length; i += 2) {
          var nl = i + 1 < parts.length, part = parts[i] + (nl ? "\n" : "");
          part && (needPrefix && output.push(prefix), output.push(new SourceNode(mapping.line, mapping.column, mapping.source, part, mapping.name)), 
          needPrefix = nl);
        }
      })), result.add(output), result;
    }
    listMap(options) {
      var prefix = this._prefix;
      return this._source.listMap(options).mapGeneratedCode((function(code) {
        return prefix + code.replace(REPLACE_REGEX, "\n" + prefix);
      }));
    }
    updateHash(hash) {
      "string" == typeof this._source ? hash.update(this._source) : this._source.updateHash(hash), 
      "string" == typeof this._prefix ? hash.update(this._prefix) : this._prefix.updateHash(hash);
    }
  }
  __webpack_require__(4)(PrefixSource.prototype), module.exports = PrefixSource;
} ]);
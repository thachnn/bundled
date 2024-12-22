"use strict";

var _t = require('./types');

let get, put;
class SetArray {
  constructor() {
    this._indexes = { __proto__: null };
    this.array = [];
  }
}
(() => {
  get = (strarr, key) => strarr._indexes[key];
  put = (strarr, key) => {
    const index = get(strarr, key);
    if (index !== void 0) return index;
    const { array, _indexes: indexes } = strarr;
    return (indexes[key] = array.push(key) - 1);
  };
})();

const comma = ','.charCodeAt(0),
  semicolon = ';'.charCodeAt(0),
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  intToChar = new Uint8Array(64),
  charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
  const c = chars.charCodeAt(i);
  intToChar[i] = c;
  charToInt[c] = i;
}
const td = typeof TextDecoder != 'undefined'
  ? new TextDecoder()
  : typeof Buffer != 'undefined'
  ? { decode: buf => Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString() }
  : {
      decode(buf) {
        let out = '';
        for (let i = 0; i < buf.length; i++) out += String.fromCharCode(buf[i]);

        return out;
      }
    };
function decode(mappings) {
  const state = new Int32Array(5),
    decoded = [];
  let index = 0;
  do {
    const semi = indexOf(mappings, index),
      line = [];
    let sorted = true,
      lastCol = 0;
    state[0] = 0;
    for (let i = index; i < semi; i++) {
      let seg;
      i = decodeInteger(mappings, i, state, 0);
      const col = state[0];
      if (col < lastCol) sorted = false;
      lastCol = col;
      if (hasMoreVlq(mappings, i, semi)) {
        i = decodeInteger(mappings, i, state, 1);
        i = decodeInteger(mappings, i, state, 2);
        i = decodeInteger(mappings, i, state, 3);
        if (hasMoreVlq(mappings, i, semi)) {
          i = decodeInteger(mappings, i, state, 4);
          seg = [col, state[1], state[2], state[3], state[4]];
        } else seg = [col, state[1], state[2], state[3]];
      } else seg = [col];

      line.push(seg);
    }
    sorted || sort(line);
    decoded.push(line);
    index = semi + 1;
  } while (index <= mappings.length);
  return decoded;
}
function indexOf(mappings, index) {
  const idx = mappings.indexOf(';', index);
  return idx < 0 ? mappings.length : idx;
}
function decodeInteger(mappings, pos, state, j) {
  let value = 0,
    shift = 0,
    integer = 0;
  do {
    const c = mappings.charCodeAt(pos++);
    integer = charToInt[c];
    value |= (integer & 31) << shift;
    shift += 5;
  } while (integer & 32);
  const shouldNegate = value & 1;
  value >>>= 1;
  if (shouldNegate) value = -0x80000000 | -value;

  state[j] += value;
  return pos;
}
function hasMoreVlq(mappings, i, length) {
  return i < length && mappings.charCodeAt(i) !== comma;
}
function sort(line) {
  line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
  return a[0] - b[0];
}
function encode(decoded) {
  const state = new Int32Array(5),
    bufLength = 16384,
    subLength = bufLength - 36,
    buf = new Uint8Array(bufLength),
    sub = buf.subarray(0, subLength);
  let pos = 0,
    out = '';
  for (let i = 0; i < decoded.length; i++) {
    const line = decoded[i];
    if (i > 0) {
      if (pos === bufLength) {
        out += td.decode(buf);
        pos = 0;
      }
      buf[pos++] = semicolon;
    }
    if (line.length === 0) continue;
    state[0] = 0;
    for (let j = 0; j < line.length; j++) {
      const segment = line[j];
      if (pos > subLength) {
        out += td.decode(sub);
        buf.copyWithin(0, subLength, pos);
        pos -= subLength;
      }
      if (j > 0) buf[pos++] = comma;
      pos = encodeInteger(buf, pos, state, segment, 0);
      if (segment.length === 1) continue;
      pos = encodeInteger(buf, pos, state, segment, 1);
      pos = encodeInteger(buf, pos, state, segment, 2);
      pos = encodeInteger(buf, pos, state, segment, 3);
      if (segment.length !== 4) pos = encodeInteger(buf, pos, state, segment, 4);
    }
  }
  return out + td.decode(buf.subarray(0, pos));
}
function encodeInteger(buf, pos, state, segment, j) {
  const next = segment[j];
  let num = next - state[j];
  state[j] = next;
  num = num < 0 ? (-num << 1) | 1 : num << 1;
  do {
    let clamped = num & 0b011111;
    num >>>= 5;
    if (num > 0) clamped |= 0b100000;
    buf[pos++] = intToChar[clamped];
  } while (num > 0);
  return pos;
}

const schemeRegex = /^[\w+.-]+:\/\//,
  urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/,
  fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
var UrlType;
!(function (UrlType) {
  UrlType[(UrlType.Empty = 1)] = "Empty";
  UrlType[(UrlType.Hash = 2)] = "Hash";
  UrlType[(UrlType.Query = 3)] = "Query";
  UrlType[(UrlType.RelativePath = 4)] = "RelativePath";
  UrlType[(UrlType.AbsolutePath = 5)] = "AbsolutePath";
  UrlType[(UrlType.SchemeRelative = 6)] = "SchemeRelative";
  UrlType[(UrlType.Absolute = 7)] = "Absolute";
})(UrlType || (UrlType = {}));
function isAbsoluteUrl(input) {
  return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
  return input.startsWith('//');
}
function isAbsolutePath(input) {
  return input.startsWith('/');
}
function isFileUrl(input) {
  return input.startsWith('file:');
}
function isRelative(input) {
  return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
  const match = urlRegex.exec(input);
  return makeUrl(match[1], match[2] || '', match[3], match[4] || '', match[5] || '/', match[6] || '', match[7] || '');
}
function parseFileUrl(input) {
  const match = fileRegex.exec(input),
    path = match[2];
  return makeUrl(
    'file:',
    '',
    match[1] || '',
    '',
    isAbsolutePath(path) ? path : '/' + path,
    match[3] || '',
    match[4] || ''
  );
}
function makeUrl(scheme, user, host, port, path, query, hash) {
  return { scheme, user, host, port, path, query, hash, type: UrlType.Absolute };
}
function parseUrl(input) {
  if (isSchemeRelativeUrl(input)) {
    const url = parseAbsoluteUrl('http:' + input);
    url.scheme = '';
    url.type = UrlType.SchemeRelative;
    return url;
  }
  if (isAbsolutePath(input)) {
    const url = parseAbsoluteUrl('http://foo.com' + input);
    url.scheme = '';
    url.host = '';
    url.type = UrlType.AbsolutePath;
    return url;
  }
  if (isFileUrl(input)) return parseFileUrl(input);
  if (isAbsoluteUrl(input)) return parseAbsoluteUrl(input);
  const url = parseAbsoluteUrl('http://foo.com/' + input);
  url.scheme = '';
  url.host = '';
  url.type = input
    ? input.startsWith('?')
      ? UrlType.Query
      : input.startsWith('#')
      ? UrlType.Hash
      : UrlType.RelativePath
    : UrlType.Empty;
  return url;
}
function stripPathFilename(path) {
  if (path.endsWith('/..')) return path;
  const index = path.lastIndexOf('/');
  return path.slice(0, index + 1);
}
function mergePaths(url, base) {
  normalizePath(base, base.type);
  url.path === '/' ? (url.path = base.path) : (url.path = stripPathFilename(base.path) + url.path);
}
function normalizePath(url, type) {
  const rel = type <= UrlType.RelativePath,
    pieces = url.path.split('/');
  let pointer = 1,
    positive = 0,
    addTrailingSlash = false;
  for (let i = 1; i < pieces.length; i++) {
    const piece = pieces[i];
    if (!piece) {
      addTrailingSlash = true;
      continue;
    }
    addTrailingSlash = false;
    if (piece === '.') continue;
    if (piece !== '..') {
      pieces[pointer++] = piece;
      positive++;
    } else if (positive) {
      addTrailingSlash = true;
      positive--;
      pointer--;
    } else if (rel) pieces[pointer++] = piece;
  }
  let path = '';
  for (let i = 1; i < pointer; i++) path += '/' + pieces[i];

  if (!path || (addTrailingSlash && !path.endsWith('/..'))) path += '/';

  url.path = path;
}
function resolve$1(input, base) {
  if (!input && !base) return '';
  const url = parseUrl(input);
  let inputType = url.type;
  if (base && inputType !== UrlType.Absolute) {
    const baseUrl = parseUrl(base),
      baseType = baseUrl.type;
    switch (inputType) {
      case UrlType.Empty:
        url.hash = baseUrl.hash;
      case UrlType.Hash:
        url.query = baseUrl.query;
      case UrlType.Query:
      case UrlType.RelativePath:
        mergePaths(url, baseUrl);
      case UrlType.AbsolutePath:
        url.user = baseUrl.user;
        url.host = baseUrl.host;
        url.port = baseUrl.port;
      case UrlType.SchemeRelative:
        url.scheme = baseUrl.scheme;
    }
    if (baseType > inputType) inputType = baseType;
  }
  normalizePath(url, inputType);
  const queryHash = url.query + url.hash;
  switch (inputType) {
    case UrlType.Hash:
    case UrlType.Query:
      return queryHash;
    case UrlType.RelativePath: {
      const path = url.path.slice(1);
      return !path
        ? queryHash || '.'
        : isRelative(base || input) && !isRelative(path)
        ? './' + path + queryHash
        : path + queryHash;
    }
    case UrlType.AbsolutePath:
      return url.path + queryHash;
    default:
      return url.scheme + '//' + url.user + url.host + url.port + url.path + queryHash;
  }
}

function resolve(input, base) {
  if (base && !base.endsWith('/')) base += '/';
  return resolve$1(input, base);
}
function stripFilename(path) {
  if (!path) return '';
  const index = path.lastIndexOf('/');
  return path.slice(0, index + 1);
}
const COLUMN$1 = 0,
  SOURCES_INDEX$1 = 1,
  SOURCE_LINE$1 = 2,
  SOURCE_COLUMN$1 = 3,
  NAMES_INDEX$1 = 4;
function maybeSort(mappings, owned) {
  const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
  if (unsortedIndex === mappings.length) return mappings;
  owned || (mappings = mappings.slice());
  for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1))
    mappings[i] = sortSegments(mappings[i], owned);

  return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
  for (let i = start; i < mappings.length; i++) if (!isSorted(mappings[i])) return i;

  return mappings.length;
}
function isSorted(line) {
  for (let j = 1; j < line.length; j++) if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) return false;

  return true;
}
function sortSegments(line, owned) {
  owned || (line = line.slice());
  return line.sort(sortComparator);
}
function sortComparator(a, b) {
  return a[COLUMN$1] - b[COLUMN$1];
}
let found = false;
function binarySearch(haystack, needle, low, high) {
  while (low <= high) {
    const mid = low + ((high - low) >> 1),
      cmp = haystack[mid][COLUMN$1] - needle;
    if (cmp === 0) {
      found = true;
      return mid;
    }
    cmp < 0 ? (low = mid + 1) : (high = mid - 1);
  }
  found = false;
  return low - 1;
}
function upperBound(haystack, needle, index) {
  for (let i = index + 1; i < haystack.length && haystack[i][COLUMN$1] === needle; index = i++);

  return index;
}
function lowerBound(haystack, needle, index) {
  for (let i = index - 1; i >= 0 && haystack[i][COLUMN$1] === needle; index = i--);

  return index;
}
function memoizedState() {
  return { lastKey: -1, lastNeedle: -1, lastIndex: -1 };
}
function memoizedBinarySearch(haystack, needle, state, key) {
  const { lastKey, lastNeedle, lastIndex } = state;
  let low = 0,
    high = haystack.length - 1;
  if (key === lastKey) {
    if (needle === lastNeedle) {
      found = lastIndex !== -1 && haystack[lastIndex][COLUMN$1] === needle;
      return lastIndex;
    }
    needle >= lastNeedle ? (low = lastIndex === -1 ? 0 : lastIndex) : (high = lastIndex);
  }
  state.lastKey = key;
  state.lastNeedle = needle;
  return (state.lastIndex = binarySearch(haystack, needle, low, high));
}
const LINE_GTR_ZERO = '`line` must be greater than 0 (lines start at line 1)',
  COL_GTR_EQ_ZERO = '`column` must be greater than or equal to 0 (columns start at column 0)',
  LEAST_UPPER_BOUND = -1,
  GREATEST_LOWER_BOUND = 1;
let decodedMappings, originalPositionFor;
class TraceMap {
  constructor(map, mapUrl) {
    const isString = typeof map == 'string';
    if (!isString && map._decodedMemo) return map;
    const parsed = isString ? JSON.parse(map) : map,
      { version, file, names, sourceRoot, sources, sourcesContent } = parsed;
    this.version = version;
    this.file = file;
    this.names = names;
    this.sourceRoot = sourceRoot;
    this.sources = sources;
    this.sourcesContent = sourcesContent;
    const from = resolve(sourceRoot || '', stripFilename(mapUrl));
    this.resolvedSources = sources.map(s => resolve(s || '', from));
    const { mappings } = parsed;
    if (typeof mappings == 'string') {
      this._encoded = mappings;
      this._decoded = void 0;
    } else {
      this._encoded = void 0;
      this._decoded = maybeSort(mappings, isString);
    }
    this._decodedMemo = memoizedState();
    this._bySources = void 0;
    this._bySourceMemos = void 0;
  }
}
(() => {
  decodedMappings = map => map._decoded || (map._decoded = decode(map._encoded));
  originalPositionFor = (map, { line, column, bias }) => {
    if (--line < 0) throw new Error(LINE_GTR_ZERO);
    if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
    const decoded = decodedMappings(map);
    if (line >= decoded.length) return OMapping(null, null, null, null);
    const segments = decoded[line],
      index = traceSegmentInternal(segments, map._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
    if (index === -1) return OMapping(null, null, null, null);
    const segment = segments[index];
    if (segment.length === 1) return OMapping(null, null, null, null);
    const { names, resolvedSources } = map;
    return OMapping(
      resolvedSources[segment[SOURCES_INDEX$1]],
      segment[SOURCE_LINE$1] + 1,
      segment[SOURCE_COLUMN$1],
      segment.length === 5 ? names[segment[NAMES_INDEX$1]] : null
    );
  };
})();
function OMapping(source, line, column, name) {
  return { source, line, column, name };
}
function traceSegmentInternal(segments, memo, line, column, bias) {
  let index = memoizedBinarySearch(segments, column, memo, line);
  found
    ? (index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index))
    : bias !== LEAST_UPPER_BOUND || index++;
  return index === -1 || index === segments.length ? -1 : index;
}

const COLUMN = 0,
  SOURCES_INDEX = 1,
  SOURCE_LINE = 2,
  SOURCE_COLUMN = 3,
  NAMES_INDEX = 4,
  NO_NAME = -1;
let maybeAddMapping, setSourceContent, toDecodedMap, toEncodedMap, allMappings, addSegmentInternal;
class GenMapping {
  constructor({ file, sourceRoot } = {}) {
    this._names = new SetArray();
    this._sources = new SetArray();
    this._sourcesContent = [];
    this._mappings = [];
    this.file = file;
    this.sourceRoot = sourceRoot;
  }
}
(() => {
  maybeAddMapping = (map, mapping) => addMappingInternal(true, map, mapping);
  setSourceContent = (map, source, content) => {
    const { _sources: sources, _sourcesContent: sourcesContent } = map;
    sourcesContent[put(sources, source)] = content;
  };
  toDecodedMap = map => {
    const {
      file,
      sourceRoot,
      _mappings: mappings,
      _sources: sources,
      _sourcesContent: sourcesContent,
      _names: names
    } = map;
    removeEmptyFinalLines(mappings);
    return {
      version: 3,
      file: file || void 0,
      names: names.array,
      sourceRoot: sourceRoot || void 0,
      sources: sources.array,
      sourcesContent,
      mappings
    };
  };
  toEncodedMap = map => {
    const decoded = toDecodedMap(map);
    return Object.assign(Object.assign({}, decoded), { mappings: encode(decoded.mappings) });
  };
  allMappings = map => {
    const out = [],
      { _mappings: mappings, _sources: sources, _names: names } = map;
    for (let i = 0; i < mappings.length; i++) {
      const line = mappings[i];
      for (let j = 0; j < line.length; j++) {
        const seg = line[j],
          generated = { line: i + 1, column: seg[COLUMN] };
        let source = void 0,
          original = void 0,
          name = void 0;
        if (seg.length !== 1) {
          source = sources.array[seg[SOURCES_INDEX]];
          original = { line: seg[SOURCE_LINE] + 1, column: seg[SOURCE_COLUMN] };
          if (seg.length === 5) name = names.array[seg[NAMES_INDEX]];
        }
        out.push({ generated, source, original, name });
      }
    }
    return out;
  };
  addSegmentInternal = (skipable, map, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
    const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = map,
      line = getLine(mappings, genLine),
      index = getColumnIndex(line, genColumn);
    if (!source) {
      if (skipable && skipSourceless(line, index)) return;
      return insert(line, index, [genColumn]);
    }
    const sourcesIndex = put(sources, source),
      namesIndex = name ? put(names, name) : NO_NAME;
    if (sourcesIndex === sourcesContent.length)
      sourcesContent[sourcesIndex] = content !== null && content !== void 0 ? content : null;
    if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) return;

    return insert(
      line,
      index,
      name
        ? [genColumn, sourcesIndex, sourceLine, sourceColumn, namesIndex]
        : [genColumn, sourcesIndex, sourceLine, sourceColumn]
    );
  };
})();
function getLine(mappings, index) {
  for (let i = mappings.length; i <= index; i++) mappings[i] = [];

  return mappings[index];
}
function getColumnIndex(line, genColumn) {
  let index = line.length;
  for (let i = index - 1; i >= 0 && genColumn < line[i][COLUMN]; index = i--);

  return index;
}
function insert(array, index, value) {
  for (let i = array.length; i > index; i--) array[i] = array[i - 1];

  array[index] = value;
}
function removeEmptyFinalLines(mappings) {
  const { length } = mappings;
  let len = length;
  for (let i = len - 1; i >= 0 && mappings[i].length <= 0; len = i, i--);

  if (len < length) mappings.length = len;
}
function skipSourceless(line, index) {
  return index === 0 || line[index - 1].length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
  if (index === 0) return false;
  const prev = line[index - 1];
  return (
    prev.length !== 1 &&
    sourcesIndex === prev[SOURCES_INDEX] &&
    sourceLine === prev[SOURCE_LINE] &&
    sourceColumn === prev[SOURCE_COLUMN] &&
    namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME)
  );
}
function addMappingInternal(skipable, map, mapping) {
  const { generated, source, original, name, content } = mapping;
  if (!source)
    return addSegmentInternal(skipable, map, generated.line - 1, generated.column, null, null, null, null, null);

  return addSegmentInternal(
    skipable,
    map,
    generated.line - 1,
    generated.column,
    source,
    original.line - 1,
    original.column,
    name,
    content
  );
}

class SourceMap {
  constructor(opts, code) {
    var _opts$sourceFileName;
    this._map = void 0;
    this._rawMappings = void 0;
    this._sourceFileName = void 0;
    this._lastGenLine = 0;
    this._lastSourceLine = 0;
    this._lastSourceColumn = 0;
    this._inputMap = void 0;
    const map = (this._map = new GenMapping({ sourceRoot: opts.sourceRoot }));
    this._sourceFileName =
      (_opts$sourceFileName = opts.sourceFileName) == null ? void 0 : _opts$sourceFileName.replace(/\\/g, "/");
    this._rawMappings = void 0;
    if (opts.inputSourceMap) {
      this._inputMap = new TraceMap(opts.inputSourceMap);
      const resolvedSources = this._inputMap.resolvedSources;
      if (resolvedSources.length)
        for (let i = 0; i < resolvedSources.length; i++) {
          var _this$_inputMap$sourc;
          setSourceContent(
            map,
            resolvedSources[i],
            (_this$_inputMap$sourc = this._inputMap.sourcesContent) == null ? void 0 : _this$_inputMap$sourc[i]
          );
        }
    }
    if (typeof code == "string" && !opts.inputSourceMap) setSourceContent(map, this._sourceFileName, code);
    else if (typeof code == "object")
      for (const sourceFileName of Object.keys(code))
        setSourceContent(map, sourceFileName.replace(/\\/g, "/"), code[sourceFileName]);
  }
  get() {
    return toEncodedMap(this._map);
  }
  getDecoded() {
    return toDecodedMap(this._map);
  }
  getRawMappings() {
    return this._rawMappings || (this._rawMappings = allMappings(this._map));
  }
  mark(generated, line, column, identifierName, identifierNamePos, filename) {
    var _originalMapping;
    this._rawMappings = void 0;
    let originalMapping;
    if (line != null)
      if (this._inputMap) {
        originalMapping = originalPositionFor(this._inputMap, { line, column });
        if (!originalMapping.name && identifierNamePos) {
          const originalIdentifierMapping = originalPositionFor(this._inputMap, identifierNamePos);
          if (originalIdentifierMapping.name) identifierName = originalIdentifierMapping.name;
        }
      } else
        originalMapping = {
          source: (filename == null ? void 0 : filename.replace(/\\/g, "/")) || this._sourceFileName,
          line,
          column
        };

    maybeAddMapping(this._map, {
      name: identifierName,
      generated,
      source: (_originalMapping = originalMapping) == null ? void 0 : _originalMapping.source,
      original: originalMapping
    });
  }
}

let Buffer$1 = class {
  constructor(map) {
    this._map = null;
    this._buf = "";
    this._str = "";
    this._appendCount = 0;
    this._last = 0;
    this._queue = [];
    this._queueCursor = 0;
    this._canMarkIdName = true;
    this._position = { line: 1, column: 0 };
    this._sourcePosition = {
      identifierName: void 0,
      identifierNamePos: void 0,
      line: void 0,
      column: void 0,
      filename: void 0
    };
    this._map = map;
    this._allocQueue();
  }
  _allocQueue() {
    const queue = this._queue;
    for (let i = 0; i < 16; i++)
      queue.push({
        char: 0,
        repeat: 1,
        line: void 0,
        column: void 0,
        identifierName: void 0,
        identifierNamePos: void 0,
        filename: ""
      });
  }
  _pushQueue(char, repeat, line, column, filename) {
    const cursor = this._queueCursor;
    cursor !== this._queue.length || this._allocQueue();

    const item = this._queue[cursor];
    item.char = char;
    item.repeat = repeat;
    item.line = line;
    item.column = column;
    item.filename = filename;
    this._queueCursor++;
  }
  // noinspection JSUnusedGlobalSymbols
  _popQueue() {
    if (this._queueCursor === 0) throw new Error("Cannot pop from empty queue");

    return this._queue[--this._queueCursor];
  }
  get() {
    this._flush();
    const map = this._map;
    const result = {
      code: (this._buf + this._str).trimRight(),
      decodedMap: map == null ? void 0 : map.getDecoded(),
      get __mergedMap() {
        return this.map;
      },
      get map() {
        const resultMap = map ? map.get() : null;
        result.map = resultMap;
        return resultMap;
      },
      set map(value) {
        Object.defineProperty(result, "map", { value, writable: true });
      },
      get rawMappings() {
        const mappings = map == null ? void 0 : map.getRawMappings();
        result.rawMappings = mappings;
        return mappings;
      },
      set rawMappings(value) {
        Object.defineProperty(result, "rawMappings", { value, writable: true });
      }
    };
    return result;
  }
  append(str, maybeNewline) {
    this._flush();
    this._append(str, this._sourcePosition, maybeNewline);
  }
  appendChar(char) {
    this._flush();
    this._appendChar(char, 1, this._sourcePosition);
  }
  queue(char) {
    if (char === 10)
      while (this._queueCursor !== 0) {
        const char = this._queue[this._queueCursor - 1].char;
        if (char !== 32 && char !== 9) break;

        this._queueCursor--;
      }

    const sourcePosition = this._sourcePosition;
    this._pushQueue(char, 1, sourcePosition.line, sourcePosition.column, sourcePosition.filename);
  }
  queueIndentation(char, repeat) {
    this._pushQueue(char, repeat, void 0, void 0, void 0);
  }
  _flush() {
    const queueCursor = this._queueCursor,
      queue = this._queue;
    for (let i = 0; i < queueCursor; i++) {
      const item = queue[i];
      this._appendChar(item.char, item.repeat, item);
    }
    this._queueCursor = 0;
  }
  _appendChar(char, repeat, sourcePos) {
    this._last = char;
    this._str += repeat > 1 ? String.fromCharCode(char).repeat(repeat) : String.fromCharCode(char);
    if (char !== 10) {
      this._mark(
        sourcePos.line,
        sourcePos.column,
        sourcePos.identifierName,
        sourcePos.identifierNamePos,
        sourcePos.filename
      );
      this._position.column += repeat;
    } else {
      this._position.line++;
      this._position.column = 0;
    }
    if (this._canMarkIdName) {
      sourcePos.identifierName = void 0;
      sourcePos.identifierNamePos = void 0;
    }
  }
  _append(str, sourcePos, maybeNewline) {
    const len = str.length,
      position = this._position;
    this._last = str.charCodeAt(len - 1);
    if (++this._appendCount > 4096) {
      // noinspection BadExpressionStatementJS
      +this._str; // huge performance boost
      this._buf += this._str;
      this._str = str;
      this._appendCount = 0;
    } else this._str += str;

    if (!maybeNewline && !this._map) {
      position.column += len;
      return;
    }
    const { column, identifierName, identifierNamePos, filename } = sourcePos;
    let line = sourcePos.line;
    if ((identifierName != null || identifierNamePos != null) && this._canMarkIdName) {
      sourcePos.identifierName = void 0;
      sourcePos.identifierNamePos = void 0;
    }
    let i = str.indexOf("\n"),
      last = 0;
    i === 0 || this._mark(line, column, identifierName, identifierNamePos, filename);

    while (i > -1) {
      position.line++;
      position.column = 0;
      last = i + 1;
      last < len && line !== void 0 && this._mark(++line, 0, null, null, filename);

      i = str.indexOf("\n", last);
    }
    position.column += len - last;
  }
  _mark(line, column, identifierName, identifierNamePos, filename) {
    var _this$_map;
    (_this$_map = this._map) == null ||
      _this$_map.mark(this._position, line, column, identifierName, identifierNamePos, filename);
  }
  removeTrailingNewline() {
    const queueCursor = this._queueCursor;
    queueCursor === 0 || this._queue[queueCursor - 1].char !== 10 || this._queueCursor--;
  }
  removeLastSemicolon() {
    const queueCursor = this._queueCursor;
    queueCursor === 0 || this._queue[queueCursor - 1].char !== 59 || this._queueCursor--;
  }
  getLastChar() {
    const queueCursor = this._queueCursor;
    return queueCursor !== 0 ? this._queue[queueCursor - 1].char : this._last;
  }
  getNewlineCount() {
    const queueCursor = this._queueCursor;
    let count = 0;
    if (queueCursor === 0) return this._last === 10 ? 1 : 0;
    for (let i = queueCursor - 1; i >= 0 && this._queue[i].char === 10; i--) count++;

    return count === queueCursor && this._last === 10 ? count + 1 : count;
  }
  endsWithCharAndNewline() {
    const queue = this._queue,
      queueCursor = this._queueCursor;
    if (queueCursor !== 0) {
      if (queue[queueCursor - 1].char !== 10) return;
      return queueCursor > 1 ? queue[queueCursor - 2].char : this._last;
    }
  }
  hasContent() {
    return this._queueCursor !== 0 || !!this._last;
  }
  exactSource(loc, cb) {
    if (!this._map) {
      cb();
      return;
    }
    this.source("start", loc);
    const identifierName = loc.identifierName,
      sourcePos = this._sourcePosition;
    if (identifierName) {
      this._canMarkIdName = false;
      sourcePos.identifierName = identifierName;
    }
    cb();
    if (identifierName) {
      this._canMarkIdName = true;
      sourcePos.identifierName = void 0;
      sourcePos.identifierNamePos = void 0;
    }
    this.source("end", loc);
  }
  source(prop, loc) {
    this._map && this._normalizePosition(prop, loc, 0);
  }
  sourceWithOffset(prop, loc, columnOffset) {
    this._map && this._normalizePosition(prop, loc, columnOffset);
  }
  withSource(prop, loc, cb) {
    this._map && this.source(prop, loc);

    cb();
  }
  _normalizePosition(prop, loc, columnOffset) {
    const pos = loc[prop],
      target = this._sourcePosition;
    if (pos) {
      target.line = pos.line;
      target.column = Math.max(pos.column + columnOffset, 0);
      target.filename = loc.filename;
    }
  }
  getCurrentColumn() {
    const queue = this._queue,
      queueCursor = this._queueCursor;
    let lastIndex = -1,
      len = 0;
    for (let i = 0; i < queueCursor; i++) {
      const item = queue[i];
      if (item.char === 10) lastIndex = len;

      len += item.repeat;
    }
    return lastIndex === -1 ? this._position.column + len : len - 1 - lastIndex;
  }
  getCurrentLine() {
    let count = 0;
    const queue = this._queue;
    for (let i = 0; i < this._queueCursor; i++) queue[i].char !== 10 || count++;

    return this._position.line + count;
  }
};

const {
  FLIPPED_ALIAS_KEYS: FLIPPED_ALIAS_KEYS$1,
  isArrayExpression,
  isAssignmentExpression: isAssignmentExpression$1,
  isBinary: isBinary$1,
  isBlockStatement,
  isCallExpression: isCallExpression$3,
  isFunction: isFunction$2,
  isIdentifier: isIdentifier$2,
  isLiteral: isLiteral$1,
  isMemberExpression: isMemberExpression$3,
  isObjectExpression,
  isOptionalCallExpression: isOptionalCallExpression$1,
  isOptionalMemberExpression: isOptionalMemberExpression$1,
  isStringLiteral
} = _t;
function crawlInternal(node, state) {
  if (!node) return state;
  if (isMemberExpression$3(node) || isOptionalMemberExpression$1(node)) {
    crawlInternal(node.object, state);
    node.computed && crawlInternal(node.property, state);
  } else if (isBinary$1(node) || isAssignmentExpression$1(node)) {
    crawlInternal(node.left, state);
    crawlInternal(node.right, state);
  } else if (isCallExpression$3(node) || isOptionalCallExpression$1(node)) {
    state.hasCall = true;
    crawlInternal(node.callee, state);
  } else if (isFunction$2(node)) state.hasFunction = true;
  else if (isIdentifier$2(node)) state.hasHelper = state.hasHelper || (node.callee && isHelper(node.callee));

  return state;
}
function crawl(node) {
  return crawlInternal(node, { hasCall: false, hasFunction: false, hasHelper: false });
}
function isHelper(node) {
  if (!node) return false;
  return isMemberExpression$3(node)
    ? isHelper(node.object) || isHelper(node.property)
    : isIdentifier$2(node)
    ? node.name === "require" || node.name.charCodeAt(0) === 95
    : isCallExpression$3(node)
    ? isHelper(node.callee)
    : !(!isBinary$1(node) && !isAssignmentExpression$1(node)) &&
      ((isIdentifier$2(node.left) && isHelper(node.left)) || isHelper(node.right));
}
function isType(node) {
  return (
    isLiteral$1(node) ||
    isObjectExpression(node) ||
    isArrayExpression(node) ||
    isIdentifier$2(node) ||
    isMemberExpression$3(node)
  );
}
const nodes = {
  AssignmentExpression(node) {
    const state = crawl(node.right);
    if ((state.hasCall && state.hasHelper) || state.hasFunction) return state.hasFunction ? 3 : 2;
  },
  SwitchCase: (node, parent) =>
    (node.consequent.length || parent.cases[0] === node ? 1 : 0) |
    (node.consequent.length || parent.cases[parent.cases.length - 1] !== node ? 0 : 2),
  LogicalExpression(node) {
    if (isFunction$2(node.left) || isFunction$2(node.right)) return 2;
  },
  Literal(node) {
    if (isStringLiteral(node) && node.value === "use strict") return 2;
  },
  CallExpression(node) {
    if (isFunction$2(node.callee) || isHelper(node)) return 3;
  },
  OptionalCallExpression(node) {
    if (isFunction$2(node.callee)) return 3;
  },
  VariableDeclaration(node) {
    for (let i = 0; i < node.declarations.length; i++) {
      const declar = node.declarations[i];
      let enabled = isHelper(declar.id) && !isType(declar.init);
      if (!enabled && declar.init) {
        const state = crawl(declar.init);
        enabled = (isHelper(declar.init) && state.hasCall) || state.hasFunction;
      }
      if (enabled) return 3;
    }
  },
  IfStatement(node) {
    if (isBlockStatement(node.consequent)) return 3;
  }
};
nodes.ObjectProperty = nodes.ObjectTypeProperty = nodes.ObjectMethod = function (node, parent) {
  if (parent.properties[0] === node) return 1;
};
nodes.ObjectTypeCallProperty = function (node, parent) {
  var _parent$properties;
  if (
    parent.callProperties[0] === node &&
    ((_parent$properties = parent.properties) == null || !_parent$properties.length)
  )
    return 1;
};
nodes.ObjectTypeIndexer = function (node, parent) {
  var _parent$properties2, _parent$callPropertie;
  if (!(
    parent.indexers[0] !== node ||
    ((_parent$properties2 = parent.properties) != null && _parent$properties2.length) ||
    ((_parent$callPropertie = parent.callProperties) != null && _parent$callPropertie.length)
  ))
    return 1;
};
nodes.ObjectTypeInternalSlot = function (node, parent) {
  var _parent$properties3, _parent$callPropertie2, _parent$indexers;
  if (!(
    parent.internalSlots[0] !== node ||
    ((_parent$properties3 = parent.properties) != null && _parent$properties3.length) ||
    ((_parent$callPropertie2 = parent.callProperties) != null && _parent$callPropertie2.length) ||
    ((_parent$indexers = parent.indexers) != null && _parent$indexers.length)
  ))
    return 1;
};
[
  ["Function", true],
  ["Class", true],
  ["Loop", true],
  ["LabeledStatement", true],
  ["SwitchStatement", true],
  ["TryStatement", true]
].forEach(function ([type, amounts]) {
  [type].concat(FLIPPED_ALIAS_KEYS$1[type] || []).forEach(function (type) {
    const ret = amounts ? 3 : 0;
    nodes[type] = () => ret;
  });
});

const {
  isArrayTypeAnnotation,
  isArrowFunctionExpression,
  isAssignmentExpression,
  isAwaitExpression,
  isBinary,
  isBinaryExpression,
  isUpdateExpression,
  isCallExpression: isCallExpression$2,
  isClass,
  isClassExpression,
  isConditional,
  isConditionalExpression,
  isExportDeclaration,
  isExportDefaultDeclaration: isExportDefaultDeclaration$1,
  isExpressionStatement: isExpressionStatement$1,
  isFor: isFor$1,
  isForInStatement,
  isForOfStatement,
  isForStatement: isForStatement$1,
  isFunctionExpression,
  isIfStatement: isIfStatement$1,
  isIndexedAccessType,
  isIntersectionTypeAnnotation,
  isLogicalExpression,
  isMemberExpression: isMemberExpression$2,
  isNewExpression: isNewExpression$2,
  isNullableTypeAnnotation,
  isObjectPattern,
  isOptionalCallExpression,
  isOptionalMemberExpression,
  isReturnStatement,
  isSequenceExpression,
  isSwitchStatement,
  isTSArrayType,
  isTSAsExpression,
  isTSInstantiationExpression,
  isTSIntersectionType,
  isTSNonNullExpression,
  isTSOptionalType,
  isTSRestType,
  isTSTypeAssertion,
  isTSUnionType,
  isTaggedTemplateExpression,
  isThrowStatement,
  isTypeAnnotation,
  isUnaryLike,
  isUnionTypeAnnotation,
  isVariableDeclarator,
  isWhileStatement,
  isYieldExpression,
  isTSSatisfiesExpression
} = _t;
const PRECEDENCE = {
  "||": 0,
  "??": 0,
  "|>": 0,
  "&&": 1,
  "|": 2,
  "^": 3,
  "&": 4,
  "==": 5,
  "===": 5,
  "!=": 5,
  "!==": 5,
  "<": 6,
  ">": 6,
  "<=": 6,
  ">=": 6,
  in: 6,
  instanceof: 6,
  ">>": 7,
  "<<": 7,
  ">>>": 7,
  "+": 8,
  "-": 8,
  "*": 9,
  "/": 9,
  "%": 9,
  "**": 10
};
function isTSTypeExpression(node) {
  return isTSAsExpression(node) || isTSSatisfiesExpression(node) || isTSTypeAssertion(node);
}
const isClassExtendsClause = (node, parent) => isClass(parent, { superClass: node });
const hasPostfixPart = (node, parent) =>
  ((isMemberExpression$2(parent) || isOptionalMemberExpression(parent)) && parent.object === node) ||
  ((isCallExpression$2(parent) || isOptionalCallExpression(parent) || isNewExpression$2(parent)) &&
    parent.callee === node) ||
  (isTaggedTemplateExpression(parent) && parent.tag === node) ||
  isTSNonNullExpression(parent);
function NullableTypeAnnotation$1(node, parent) {
  return isArrayTypeAnnotation(parent);
}
function FunctionTypeAnnotation$1(node, parent, printStack) {
  if (printStack.length < 3) return;
  return (
    isUnionTypeAnnotation(parent) ||
    isIntersectionTypeAnnotation(parent) ||
    isArrayTypeAnnotation(parent) ||
    (isTypeAnnotation(parent) && isArrowFunctionExpression(printStack[printStack.length - 3]))
  );
}
function UpdateExpression$1(node, parent) {
  return hasPostfixPart(node, parent) || isClassExtendsClause(node, parent);
}
function ObjectExpression$1(node, parent, printStack) {
  return isFirstInContext(printStack, 3);
}
function DoExpression$1(node, parent, printStack) {
  return !node.async && isFirstInContext(printStack, 1);
}
function Binary(node, parent) {
  if (node.operator === "**" && isBinaryExpression(parent, { operator: "**" })) return parent.left === node;

  if (isClassExtendsClause(node, parent)) return true;
  if (hasPostfixPart(node, parent) || isUnaryLike(parent) || isAwaitExpression(parent)) return true;

  if (isBinary(parent)) {
    const parentOp = parent.operator,
      parentPos = PRECEDENCE[parentOp],
      nodeOp = node.operator,
      nodePos = PRECEDENCE[nodeOp];
    if ((parentPos === nodePos && parent.right === node && !isLogicalExpression(parent)) || parentPos > nodePos)
      return true;
  }
}
function UnionTypeAnnotation$1(node, parent) {
  return (
    isArrayTypeAnnotation(parent) ||
    isNullableTypeAnnotation(parent) ||
    isIntersectionTypeAnnotation(parent) ||
    isUnionTypeAnnotation(parent)
  );
}
function OptionalIndexedAccessType$1(node, parent) {
  return isIndexedAccessType(parent, { objectType: node });
}
function TSAsExpression() {
  return true;
}
function TSUnionType$1(node, parent) {
  return (
    isTSArrayType(parent) ||
    isTSOptionalType(parent) ||
    isTSIntersectionType(parent) ||
    isTSUnionType(parent) ||
    isTSRestType(parent)
  );
}
function TSInferType$1(node, parent) {
  return isTSArrayType(parent) || isTSOptionalType(parent);
}
function TSInstantiationExpression$1(node, parent) {
  return (
    (isCallExpression$2(parent) ||
      isOptionalCallExpression(parent) ||
      isNewExpression$2(parent) ||
      isTSInstantiationExpression(parent)) &&
    !!parent.typeParameters
  );
}
function BinaryExpression(node, parent) {
  return node.operator === "in" && (isVariableDeclarator(parent) || isFor$1(parent));
}
function SequenceExpression$1(node, parent) {
  return !(
    isForStatement$1(parent) ||
    isThrowStatement(parent) ||
    isReturnStatement(parent) ||
    (isIfStatement$1(parent) && parent.test === node) ||
    (isWhileStatement(parent) && parent.test === node) ||
    (isForInStatement(parent) && parent.right === node) ||
    (isSwitchStatement(parent) && parent.discriminant === node) ||
    (isExpressionStatement$1(parent) && parent.expression === node)
  );
}
function YieldExpression$1(node, parent) {
  return (
    isBinary(parent) ||
    isUnaryLike(parent) ||
    hasPostfixPart(node, parent) ||
    (isAwaitExpression(parent) && isYieldExpression(node)) ||
    (isConditionalExpression(parent) && node === parent.test) ||
    isClassExtendsClause(node, parent)
  );
}
function ClassExpression(node, parent, printStack) {
  return isFirstInContext(printStack, 5);
}
function UnaryLike(node, parent) {
  return (
    hasPostfixPart(node, parent) ||
    isBinaryExpression(parent, { operator: "**", left: node }) ||
    isClassExtendsClause(node, parent)
  );
}
function FunctionExpression$1(node, parent, printStack) {
  return isFirstInContext(printStack, 5);
}
function ArrowFunctionExpression$1(node, parent) {
  return isExportDeclaration(parent) || ConditionalExpression$1(node, parent);
}
function ConditionalExpression$1(node, parent) {
  return !!(
    isUnaryLike(parent) ||
    isBinary(parent) ||
    isConditionalExpression(parent, { test: node }) ||
    isAwaitExpression(parent) ||
    isTSTypeExpression(parent)
  ) || UnaryLike(node, parent);
}
function OptionalMemberExpression$1(node, parent) {
  return isCallExpression$2(parent, { callee: node }) || isMemberExpression$2(parent, { object: node });
}
function AssignmentExpression$1(node, parent) {
  return !!isObjectPattern(node.left) || ConditionalExpression$1(node, parent);
}
function LogicalExpression(node, parent) {
  if (isTSTypeExpression(parent)) return true;
  switch (node.operator) {
    case "||":
      return !!isLogicalExpression(parent) && (parent.operator === "??" || parent.operator === "&&");
    case "&&":
      return isLogicalExpression(parent, { operator: "??" });
    case "??":
      return isLogicalExpression(parent) && parent.operator !== "??";
  }
}
function Identifier$1(node, parent, printStack) {
  var _node$extra;
  if (
    (_node$extra = node.extra) != null &&
    _node$extra.parenthesized &&
    isAssignmentExpression(parent, { left: node }) &&
    (isFunctionExpression(parent.right) || isClassExpression(parent.right)) &&
    parent.right.id == null
  )
    return true;

  return node.name === "let"
    ? isFirstInContext(
        printStack,
        isMemberExpression$2(parent, { object: node, computed: true }) ||
          isOptionalMemberExpression(parent, { object: node, computed: true, optional: false })
          ? 57 : 32
      )
    : node.name === "async" && isForOfStatement(parent) && node === parent.left;
}
function isFirstInContext(printStack, checkParam) {
  const expressionStatement = checkParam & 1,
    arrowBody = checkParam & 2,
    exportDefault = checkParam & 4,
    forHead = checkParam & 8,
    forInHead = checkParam & 16,
    forOfHead = checkParam & 32;
  let i = printStack.length - 1;
  if (i <= 0) return;
  let node = printStack[i];
  i--;
  for (let parent = printStack[i]; i >= 0; ) {
    if (
      (expressionStatement && isExpressionStatement$1(parent, { expression: node })) ||
      (exportDefault && isExportDefaultDeclaration$1(parent, { declaration: node })) ||
      (arrowBody && isArrowFunctionExpression(parent, { body: node })) ||
      (forHead && isForStatement$1(parent, { init: node })) ||
      (forInHead && isForInStatement(parent, { left: node })) ||
      (forOfHead && isForOfStatement(parent, { left: node }))
    )
      return true;

    if (!(
      i > 0 &&
      ((hasPostfixPart(node, parent) && !isNewExpression$2(parent)) ||
        (isSequenceExpression(parent) && parent.expressions[0] === node) ||
        (isUpdateExpression(parent) && !parent.prefix) ||
        isConditional(parent, { test: node }) ||
        isBinary(parent, { left: node }) ||
        isAssignmentExpression(parent, { left: node }))
    ))
      return false;

    node = parent;
    i--;
    parent = printStack[i];
  }
  return false;
}

var parens = Object.freeze({
  __proto__: null,
  ArrowFunctionExpression: ArrowFunctionExpression$1,
  AssignmentExpression: AssignmentExpression$1,
  AwaitExpression: YieldExpression$1,
  Binary,
  BinaryExpression,
  ClassExpression,
  ConditionalExpression: ConditionalExpression$1,
  DoExpression: DoExpression$1,
  FunctionExpression: FunctionExpression$1,
  FunctionTypeAnnotation: FunctionTypeAnnotation$1,
  Identifier: Identifier$1,
  IntersectionTypeAnnotation: UnionTypeAnnotation$1,
  LogicalExpression,
  NullableTypeAnnotation: NullableTypeAnnotation$1,
  ObjectExpression: ObjectExpression$1,
  OptionalCallExpression: OptionalMemberExpression$1,
  OptionalIndexedAccessType: OptionalIndexedAccessType$1,
  OptionalMemberExpression: OptionalMemberExpression$1,
  SequenceExpression: SequenceExpression$1,
  TSAsExpression,
  TSInferType: TSInferType$1,
  TSInstantiationExpression: TSInstantiationExpression$1,
  TSIntersectionType: TSUnionType$1,
  TSSatisfiesExpression: TSAsExpression,
  TSTypeAssertion: TSAsExpression,
  TSUnionType: TSUnionType$1,
  UnaryLike,
  UnionTypeAnnotation: UnionTypeAnnotation$1,
  UpdateExpression: UpdateExpression$1,
  YieldExpression: YieldExpression$1
});

const {
  FLIPPED_ALIAS_KEYS,
  isCallExpression: isCallExpression$1,
  isExpressionStatement,
  isMemberExpression: isMemberExpression$1,
  isNewExpression: isNewExpression$1
} = _t;
function expandAliases(obj) {
  const newObj = {};
  function add(type, func) {
    const fn = newObj[type];
    newObj[type] = fn
      ? function (node, parent, stack) {
          const result = fn(node, parent, stack);
          return result == null ? func(node, parent, stack) : result;
        }
      : func;
  }
  for (const type of Object.keys(obj)) {
    const aliases = FLIPPED_ALIAS_KEYS[type];
    if (aliases) for (const alias of aliases) add(alias, obj[type]);
    else add(type, obj[type]);
  }
  return newObj;
}
const expandedParens = expandAliases(parens),
  expandedWhitespaceNodes = expandAliases(nodes);
function find(obj, node, parent, printStack) {
  const fn = obj[node.type];
  return fn ? fn(node, parent, printStack) : null;
}
function isOrHasCallExpression(node) {
  return !!isCallExpression$1(node) || (isMemberExpression$1(node) && isOrHasCallExpression(node.object));
}
function needsWhitespace(node, parent, type) {
  if (!node) return false;
  if (isExpressionStatement(node)) node = node.expression;

  const flag = find(expandedWhitespaceNodes, node, parent);
  return typeof flag == "number" && (flag & type) != 0;
}
function needsWhitespaceBefore(node, parent) {
  return needsWhitespace(node, parent, 1);
}
function needsWhitespaceAfter(node, parent) {
  return needsWhitespace(node, parent, 2);
}
function needsParens$1(node, parent, printStack) {
  return (
    !!parent &&
    (!(!isNewExpression$1(parent) || parent.callee !== node || !isOrHasCallExpression(node)) ||
      find(expandedParens, node, parent, printStack))
  );
}

// noinspection JSUnusedGlobalSymbols
var n = Object.freeze({
  __proto__: null,
  needsParens: needsParens$1,
  needsWhitespace,
  needsWhitespaceAfter,
  needsWhitespaceBefore
});

function TaggedTemplateExpression(node) {
  this.print(node.tag, node);
  this.print(node.typeParameters, node);
  this.print(node.quasi, node);
}
function TemplateElement(node, parent) {
  const isFirst = parent.quasis[0] === node,
    isLast = parent.quasis[parent.quasis.length - 1] === node,
    value = (isFirst ? "`" : "}") + node.value.raw + (isLast ? "`" : "${");
  this.token(value, true);
}
function TemplateLiteral(node) {
  const quasis = node.quasis;
  for (let i = 0; i < quasis.length; i++) {
    this.print(quasis[i], node);
    i + 1 < quasis.length && this.print(node.expressions[i], node);
  }
}

const { isCallExpression, isLiteral, isMemberExpression, isNewExpression } = _t;
function UnaryExpression(node) {
  const { operator } = node;
  if (operator === "void" || operator === "delete" || operator === "typeof" || operator === "throw") {
    this.word(operator);
    this.space();
  } else this.token(operator);

  this.print(node.argument, node);
}
function DoExpression(node) {
  if (node.async) {
    this.word("async", true);
    this.space();
  }
  this.word("do");
  this.space();
  this.print(node.body, node);
}
function ParenthesizedExpression(node) {
  this.tokenChar(40);
  this.print(node.expression, node);
  this.rightParens(node);
}
function UpdateExpression(node) {
  if (node.prefix) {
    this.token(node.operator);
    this.print(node.argument, node);
  } else {
    this.printTerminatorless(node.argument, node, true);
    this.token(node.operator);
  }
}
function ConditionalExpression(node) {
  this.print(node.test, node);
  this.space();
  this.tokenChar(63);
  this.space();
  this.print(node.consequent, node);
  this.space();
  this.tokenChar(58);
  this.space();
  this.print(node.alternate, node);
}
function NewExpression(node, parent) {
  this.word("new");
  this.space();
  this.print(node.callee, node);
  if (
    this.format.minified &&
    node.arguments.length === 0 &&
    !node.optional &&
    !isCallExpression(parent, { callee: node }) &&
    !isMemberExpression(parent) &&
    !isNewExpression(parent)
  )
    return;

  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);
  node.optional && this.token("?.");

  this.tokenChar(40);
  this.printList(node.arguments, node);
  this.rightParens(node);
}
function SequenceExpression(node) {
  this.printList(node.expressions, node);
}
function ThisExpression() {
  this.word("this");
}
function Super() {
  this.word("super");
}
function isDecoratorMemberExpression(node) {
  switch (node.type) {
    case "Identifier":
      return true;
    case "MemberExpression":
      return !node.computed && node.property.type === "Identifier" && isDecoratorMemberExpression(node.object);
    default:
      return false;
  }
}
function shouldParenthesizeDecoratorExpression(node) {
  return (
    node.type !== "ParenthesizedExpression" &&
    !isDecoratorMemberExpression(node.type === "CallExpression" ? node.callee : node)
  );
}
function _shouldPrintDecoratorsBeforeExport(node) {
  return typeof this.format.decoratorsBeforeExport == "boolean"
    ? this.format.decoratorsBeforeExport
    : typeof node.start == "number" && node.start === node.declaration.start;
}
function Decorator(node) {
  this.tokenChar(64);
  const { expression } = node;
  if (shouldParenthesizeDecoratorExpression(expression)) {
    this.tokenChar(40);
    this.print(expression, node);
    this.tokenChar(41);
  } else this.print(expression, node);

  this.newline();
}
function OptionalMemberExpression(node) {
  let { computed } = node;
  const { optional, property } = node;
  this.print(node.object, node);
  if (!computed && isMemberExpression(property))
    throw new TypeError("Got a MemberExpression for MemberExpression property");

  if (isLiteral(property) && typeof property.value == "number") computed = true;
  optional && this.token("?.");

  if (computed) {
    this.tokenChar(91);
    this.print(property, node);
    this.tokenChar(93);
  } else {
    optional || this.tokenChar(46);

    this.print(property, node);
  }
}
function OptionalCallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeParameters, node);
  node.optional && this.token("?.");

  this.print(node.typeArguments, node);
  this.tokenChar(40);
  this.printList(node.arguments, node);
  this.rightParens(node);
}
function CallExpression(node) {
  this.print(node.callee, node);
  this.print(node.typeArguments, node);
  this.print(node.typeParameters, node);
  this.tokenChar(40);
  this.printList(node.arguments, node);
  this.rightParens(node);
}
function Import() {
  this.word("import");
}
function AwaitExpression(node) {
  this.word("await");
  if (node.argument) {
    this.space();
    this.printTerminatorless(node.argument, node, false);
  }
}
function YieldExpression(node) {
  this.word("yield", true);
  if (node.delegate) {
    this.tokenChar(42);
    if (node.argument) {
      this.space();
      this.print(node.argument, node);
    }
  } else if (node.argument) {
    this.space();
    this.printTerminatorless(node.argument, node, false);
  }
}
function EmptyStatement() {
  this.semicolon(true);
}
function ExpressionStatement(node) {
  this.print(node.expression, node);
  this.semicolon();
}
function AssignmentPattern(node) {
  this.print(node.left, node);
  node.left.optional && this.tokenChar(63);
  this.print(node.left.typeAnnotation, node);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(node.right, node);
}
function AssignmentExpression(node, parent) {
  const parens = this.inForStatementInitCounter && node.operator === "in" && !needsParens$1(node, parent);
  parens && this.tokenChar(40);

  this.print(node.left, node);
  this.space();
  node.operator === "in" || node.operator === "instanceof" ? this.word(node.operator) : this.token(node.operator);

  this.space();
  this.print(node.right, node);
  parens && this.tokenChar(41);
}
function BindExpression(node) {
  this.print(node.object, node);
  this.token("::");
  this.print(node.callee, node);
}
function MemberExpression(node) {
  this.print(node.object, node);
  if (!node.computed && isMemberExpression(node.property))
    throw new TypeError("Got a MemberExpression for MemberExpression property");

  let computed = node.computed;
  if (isLiteral(node.property) && typeof node.property.value == "number") computed = true;

  if (computed) {
    this.tokenChar(91);
    this.print(node.property, node);
    this.tokenChar(93);
  } else {
    this.tokenChar(46);
    this.print(node.property, node);
  }
}
function MetaProperty(node) {
  this.print(node.meta, node);
  this.tokenChar(46);
  this.print(node.property, node);
}
function PrivateName(node) {
  this.tokenChar(35);
  this.print(node.id, node);
}
function V8IntrinsicIdentifier(node) {
  this.tokenChar(37);
  this.word(node.name);
}
function ModuleExpression(node) {
  this.word("module", true);
  this.space();
  this.tokenChar(123);
  this.indent();
  const { body } = node;
  if (body.body.length || body.directives.length) this.newline();

  this.print(body, node);
  this.dedent();
  this.rightBrace(node);
}

const { isFor, isForStatement, isIfStatement, isStatement: isStatement$3 } = _t;
function WithStatement(node) {
  this.word("with");
  this.space();
  this.tokenChar(40);
  this.print(node.object, node);
  this.tokenChar(41);
  this.printBlock(node);
}
function IfStatement(node) {
  this.word("if");
  this.space();
  this.tokenChar(40);
  this.print(node.test, node);
  this.tokenChar(41);
  this.space();
  const needsBlock = node.alternate && isIfStatement(getLastStatement(node.consequent));
  if (needsBlock) {
    this.tokenChar(123);
    this.newline();
    this.indent();
  }
  this.printAndIndentOnComments(node.consequent, node);
  if (needsBlock) {
    this.dedent();
    this.newline();
    this.tokenChar(125);
  }
  if (node.alternate) {
    this.endsWith(125) && this.space();
    this.word("else");
    this.space();
    this.printAndIndentOnComments(node.alternate, node);
  }
}
function getLastStatement(statement) {
  const { body } = statement;
  return isStatement$3(body) === false ? statement : getLastStatement(body);
}
function ForStatement(node) {
  this.word("for");
  this.space();
  this.tokenChar(40);
  this.inForStatementInitCounter++;
  this.print(node.init, node);
  this.inForStatementInitCounter--;
  this.tokenChar(59);
  if (node.test) {
    this.space();
    this.print(node.test, node);
  }
  this.tokenChar(59);
  if (node.update) {
    this.space();
    this.print(node.update, node);
  }
  this.tokenChar(41);
  this.printBlock(node);
}
function WhileStatement(node) {
  this.word("while");
  this.space();
  this.tokenChar(40);
  this.print(node.test, node);
  this.tokenChar(41);
  this.printBlock(node);
}
function ForXStatement(node) {
  this.word("for");
  this.space();
  const isForOf = node.type === "ForOfStatement";
  if (isForOf && node.await) {
    this.word("await");
    this.space();
  }
  this.noIndentInnerCommentsHere();
  this.tokenChar(40);
  this.print(node.left, node);
  this.space();
  this.word(isForOf ? "of" : "in");
  this.space();
  this.print(node.right, node);
  this.tokenChar(41);
  this.printBlock(node);
}
const ForInStatement = ForXStatement,
  ForOfStatement = ForXStatement;
function DoWhileStatement(node) {
  this.word("do");
  this.space();
  this.print(node.body, node);
  this.space();
  this.word("while");
  this.space();
  this.tokenChar(40);
  this.print(node.test, node);
  this.tokenChar(41);
  this.semicolon();
}
function printStatementAfterKeyword(printer, node, parent, isLabel) {
  if (node) {
    printer.space();
    printer.printTerminatorless(node, parent, isLabel);
  }
  printer.semicolon();
}
function BreakStatement(node) {
  this.word("break");
  printStatementAfterKeyword(this, node.label, node, true);
}
function ContinueStatement(node) {
  this.word("continue");
  printStatementAfterKeyword(this, node.label, node, true);
}
function ReturnStatement(node) {
  this.word("return");
  printStatementAfterKeyword(this, node.argument, node, false);
}
function ThrowStatement(node) {
  this.word("throw");
  printStatementAfterKeyword(this, node.argument, node, false);
}
function LabeledStatement(node) {
  this.print(node.label, node);
  this.tokenChar(58);
  this.space();
  this.print(node.body, node);
}
/** @param {({handlers: ?Array}|*)} node */
function TryStatement(node) {
  this.word("try");
  this.space();
  this.print(node.block, node);
  this.space();
  node.handlers ? this.print(node.handlers[0], node) : this.print(node.handler, node);

  if (node.finalizer) {
    this.space();
    this.word("finally");
    this.space();
    this.print(node.finalizer, node);
  }
}
function CatchClause(node) {
  this.word("catch");
  this.space();
  if (node.param) {
    this.tokenChar(40);
    this.print(node.param, node);
    this.print(node.param.typeAnnotation, node);
    this.tokenChar(41);
    this.space();
  }
  this.print(node.body, node);
}
function SwitchStatement(node) {
  this.word("switch");
  this.space();
  this.tokenChar(40);
  this.print(node.discriminant, node);
  this.tokenChar(41);
  this.space();
  this.tokenChar(123);
  this.printSequence(node.cases, node, {
    indent: true,
    addNewlines(leading, cas) {
      if (!leading && node.cases[node.cases.length - 1] === cas) return -1;
    }
  });
  this.rightBrace(node);
}
function SwitchCase(node) {
  if (node.test) {
    this.word("case");
    this.space();
    this.print(node.test, node);
    this.tokenChar(58);
  } else {
    this.word("default");
    this.tokenChar(58);
  }
  if (node.consequent.length) {
    this.newline();
    this.printSequence(node.consequent, node, { indent: true });
  }
}
function DebuggerStatement() {
  this.word("debugger");
  this.semicolon();
}
function VariableDeclaration(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  const { kind } = node;
  this.word(kind, kind === "using" || kind === "await using");
  this.space();
  let hasInits = false;
  if (!isFor(parent)) for (const declar of node.declarations) if (declar.init) hasInits = true;

  this.printList(node.declarations, node, {
    separator: hasInits
      ? function () {
          this.tokenChar(44);
          this.newline();
        }
      : void 0,
    indent: node.declarations.length > 1
  });
  if (isFor(parent))
    if (isForStatement(parent)) {
      if (parent.init === node) return;
    } else if (parent.left === node) return;

  this.semicolon();
}
function VariableDeclarator(node) {
  this.print(node.id, node);
  node.definite && this.tokenChar(33);
  this.print(node.id.typeAnnotation, node);
  if (node.init) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.init, node);
  }
}

const { isExportDefaultDeclaration, isExportNamedDeclaration } = _t;
function ClassDeclaration(node, parent) {
  ((isExportDefaultDeclaration(parent) || isExportNamedDeclaration(parent)) &&
    this._shouldPrintDecoratorsBeforeExport(parent)) ||
    this.printJoin(node.decorators, node);

  if (node.declare) {
    this.word("declare");
    this.space();
  }
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  this.word("class");
  if (node.id) {
    this.space();
    this.print(node.id, node);
  }
  this.print(node.typeParameters, node);
  if (node.superClass) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.superClass, node);
    this.print(node.superTypeParameters, node);
  }
  if (node.implements) {
    this.space();
    this.word("implements");
    this.space();
    this.printList(node.implements, node);
  }
  this.space();
  this.print(node.body, node);
}
function ClassBody(node) {
  this.tokenChar(123);
  if (node.body.length === 0) this.tokenChar(125);
  else {
    this.newline();
    this.printSequence(node.body, node, { indent: true });
    this.endsWith(10) || this.newline();
    this.rightBrace(node);
  }
}
function ClassProperty(node) {
  var _node$key$loc;
  this.printJoin(node.decorators, node);
  const endLine =
    (_node$key$loc = node.key.loc) == null || (_node$key$loc = _node$key$loc.end) == null ? void 0 : _node$key$loc.line;
  endLine && this.catchUp(endLine);
  this.tsPrintClassMemberModifiers(node);
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key, node);
    this.tokenChar(93);
  } else {
    this._variance(node);
    this.print(node.key, node);
  }
  node.optional && this.tokenChar(63);
  node.definite && this.tokenChar(33);

  this.print(node.typeAnnotation, node);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value, node);
  }
  this.semicolon();
}
function ClassAccessorProperty(node) {
  var _node$key$loc2;
  this.printJoin(node.decorators, node);
  const endLine =
    (_node$key$loc2 = node.key.loc) == null || (_node$key$loc2 = _node$key$loc2.end) == null
      ? void 0
      : _node$key$loc2.line;
  endLine && this.catchUp(endLine);
  this.tsPrintClassMemberModifiers(node);
  this.word("accessor", true);
  this.space();
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key, node);
    this.tokenChar(93);
  } else {
    this._variance(node);
    this.print(node.key, node);
  }
  node.optional && this.tokenChar(63);
  node.definite && this.tokenChar(33);

  this.print(node.typeAnnotation, node);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value, node);
  }
  this.semicolon();
}
function ClassPrivateProperty(node) {
  this.printJoin(node.decorators, node);
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.print(node.key, node);
  this.print(node.typeAnnotation, node);
  if (node.value) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.value, node);
  }
  this.semicolon();
}
function ClassMethod(node) {
  this._classMethodHead(node);
  this.space();
  this.print(node.body, node);
}
function ClassPrivateMethod(node) {
  this._classMethodHead(node);
  this.space();
  this.print(node.body, node);
}
function _classMethodHead(node) {
  var _node$key$loc3;
  this.printJoin(node.decorators, node);
  const endLine =
    (_node$key$loc3 = node.key.loc) == null || (_node$key$loc3 = _node$key$loc3.end) == null
      ? void 0
      : _node$key$loc3.line;
  endLine && this.catchUp(endLine);
  this.tsPrintClassMemberModifiers(node);
  this._methodHead(node);
}
function StaticBlock(node) {
  this.word("static");
  this.space();
  this.tokenChar(123);
  if (node.body.length === 0) this.tokenChar(125);
  else {
    this.newline();
    this.printSequence(node.body, node, { indent: true });
    this.rightBrace(node);
  }
}

const { isIdentifier: isIdentifier$1 } = _t;
function _params(node, idNode, parentNode) {
  this.print(node.typeParameters, node);
  const nameInfo = _getFuncIdName.call(this, idNode, parentNode);
  nameInfo && this.sourceIdentifierName(nameInfo.name, nameInfo.pos);

  this.tokenChar(40);
  this._parameters(node.params, node);
  this.tokenChar(41);
  const noLineTerminator = node.type === "ArrowFunctionExpression";
  this.print(node.returnType, node, noLineTerminator);
  this._noLineTerminator = noLineTerminator;
}
function _parameters(parameters, parent) {
  const paramLength = parameters.length;
  for (let i = 0; i < paramLength; i++) {
    this._param(parameters[i], parent);
    if (i < parameters.length - 1) {
      this.tokenChar(44);
      this.space();
    }
  }
}
function _param(parameter, parent) {
  this.printJoin(parameter.decorators, parameter);
  this.print(parameter, parent);
  parameter.optional && this.tokenChar(63);

  this.print(parameter.typeAnnotation, parameter);
}
function _methodHead(node) {
  const kind = node.kind,
    key = node.key;
  if (kind === "get" || kind === "set") {
    this.word(kind);
    this.space();
  }
  if (node.async) {
    this.word("async", true);
    this.space();
  }
  (kind !== "method" && kind !== "init") || !node.generator || this.tokenChar(42);

  if (node.computed) {
    this.tokenChar(91);
    this.print(key, node);
    this.tokenChar(93);
  } else this.print(key, node);

  node.optional && this.tokenChar(63);

  this._params(node, node.computed && node.key.type !== "StringLiteral" ? void 0 : node.key, void 0);
}
function _predicate(node, noLineTerminatorAfter) {
  if (node.predicate) {
    node.returnType || this.tokenChar(58);

    this.space();
    this.print(node.predicate, node, noLineTerminatorAfter);
  }
}
function _functionHead(node, parent) {
  if (node.async) {
    this.word("async");
    this._endsWithInnerRaw = false;
    this.space();
  }
  this.word("function");
  if (node.generator) {
    this._endsWithInnerRaw = false;
    this.tokenChar(42);
  }
  this.space();
  node.id && this.print(node.id, node);

  this._params(node, node.id, parent);
  node.type === "TSDeclareFunction" || this._predicate(node);
}
function FunctionExpression(node, parent) {
  this._functionHead(node, parent);
  this.space();
  this.print(node.body, node);
}
function ArrowFunctionExpression(node, parent) {
  if (node.async) {
    this.word("async", true);
    this.space();
  }
  let firstParam;

  this.format.retainLines ||
  node.params.length !== 1 ||
  !isIdentifier$1((firstParam = node.params[0])) ||
  hasTypesOrComments(node, firstParam)
    ? this._params(node, void 0, parent)
    : this.print(firstParam, node, true);

  this._predicate(node, true);
  this.space();
  this.printInnerComments();
  this.token("=>");
  this.space();
  this.print(node.body, node);
}
function hasTypesOrComments(node, param) {
  var _param$leadingComment, _param$trailingCommen;
  return !!(
    node.typeParameters ||
    node.returnType ||
    node.predicate ||
    param.typeAnnotation ||
    param.optional ||
    ((_param$leadingComment = param.leadingComments) != null && _param$leadingComment.length) ||
    ((_param$trailingCommen = param.trailingComments) != null && _param$trailingCommen.length)
  );
}
function _getFuncIdName(idNode, parent) {
  let nameInfo,
    id = idNode;
  if (!id && parent) {
    const parentType = parent.type;
    parentType === "VariableDeclarator"
      ? (id = parent.id)
      : parentType === "AssignmentExpression" || parentType === "AssignmentPattern"
      ? (id = parent.left)
      : parentType === "ObjectProperty" || parentType === "ClassProperty"
      ? (parent.computed && parent.key.type !== "StringLiteral") || (id = parent.key)
      : (parentType !== "ClassPrivateProperty" && parentType !== "ClassAccessorProperty") || (id = parent.key);
  }
  if (!id) return;
  if (id.type === "Identifier") {
    var _id$loc, _id$loc2;
    nameInfo = {
      pos: (_id$loc = id.loc) == null ? void 0 : _id$loc.start,
      name: ((_id$loc2 = id.loc) == null ? void 0 : _id$loc2.identifierName) || id.name
    };
  } else if (id.type === "PrivateName") {
    var _id$loc3;
    nameInfo = { pos: (_id$loc3 = id.loc) == null ? void 0 : _id$loc3.start, name: "#" + id.id.name };
  } else if (id.type === "StringLiteral") {
    var _id$loc4;
    nameInfo = { pos: (_id$loc4 = id.loc) == null ? void 0 : _id$loc4.start, name: id.value };
  }
  return nameInfo;
}

const {
  isClassDeclaration,
  isExportDefaultSpecifier,
  isExportNamespaceSpecifier,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isStatement: isStatement$2
} = _t;
function ImportSpecifier(node) {
  if (node.importKind === "type" || node.importKind === "typeof") {
    this.word(node.importKind);
    this.space();
  }
  this.print(node.imported, node);
  if (node.local && node.local.name !== node.imported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.local, node);
  }
}
function ImportDefaultSpecifier(node) {
  this.print(node.local, node);
}
function ExportDefaultSpecifier(node) {
  this.print(node.exported, node);
}
function ExportSpecifier(node) {
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }
  this.print(node.local, node);
  if (node.exported && node.local.name !== node.exported.name) {
    this.space();
    this.word("as");
    this.space();
    this.print(node.exported, node);
  }
}
function ExportNamespaceSpecifier(node) {
  this.tokenChar(42);
  this.space();
  this.word("as");
  this.space();
  this.print(node.exported, node);
}
let warningShown = false;
function _printAttributes(node) {
  const { importAttributesKeyword } = this.format,
    { attributes, assertions } = node;
  if (attributes && !importAttributesKeyword && !warningShown) {
    warningShown = true;
    console.warn(`\
You are using import attributes, without specifying the desired output syntax.
Please specify the "importAttributesKeyword" generator option, whose value can be one of:
 - "with"        : \`import { a } from "b" with { type: "json" };\`
 - "assert"      : \`import { a } from "b" assert { type: "json" };\`
 - "with-legacy" : \`import { a } from "b" with type: "json";\`\n`);
  }
  const useAssertKeyword = importAttributesKeyword === "assert" || (!importAttributesKeyword && assertions);
  this.word(useAssertKeyword ? "assert" : "with");
  this.space();
  if (!useAssertKeyword && importAttributesKeyword !== "with") {
    this.printList(attributes || assertions, node);
    return;
  }
  this.tokenChar(123);
  this.space();
  this.printList(attributes || assertions, node);
  this.space();
  this.tokenChar(125);
}
function ExportAllDeclaration(node) {
  var _node$attributes, _node$assertions;
  this.word("export");
  this.space();
  if (node.exportKind === "type") {
    this.word("type");
    this.space();
  }
  this.tokenChar(42);
  this.space();
  this.word("from");
  this.space();
  if (
    ((_node$attributes = node.attributes) != null && _node$attributes.length) ||
    ((_node$assertions = node.assertions) != null && _node$assertions.length)
  ) {
    this.print(node.source, node, true);
    this.space();
    this._printAttributes(node);
  } else this.print(node.source, node);

  this.semicolon();
}
function maybePrintDecoratorsBeforeExport(printer, node) {
  isClassDeclaration(node.declaration) && printer._shouldPrintDecoratorsBeforeExport(node) &&
    printer.printJoin(node.declaration.decorators, node);
}
function ExportNamedDeclaration(node) {
  maybePrintDecoratorsBeforeExport(this, node);
  this.word("export");
  this.space();
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    isStatement$2(declar) || this.semicolon();
  } else {
    if (node.exportKind === "type") {
      this.word("type");
      this.space();
    }
    const specifiers = node.specifiers.slice(0);
    let hasSpecial = false;
    for (;;) {
      const first = specifiers[0];
      if (!isExportDefaultSpecifier(first) && !isExportNamespaceSpecifier(first)) break;

      hasSpecial = true;
      this.print(specifiers.shift(), node);
      if (specifiers.length) {
        this.tokenChar(44);
        this.space();
      }
    }
    if (specifiers.length || (!specifiers.length && !hasSpecial)) {
      this.tokenChar(123);
      if (specifiers.length) {
        this.space();
        this.printList(specifiers, node);
        this.space();
      }
      this.tokenChar(125);
    }
    if (node.source) {
      var _node$attributes2, _node$assertions2;
      this.space();
      this.word("from");
      this.space();
      if (
        ((_node$attributes2 = node.attributes) != null && _node$attributes2.length) ||
        ((_node$assertions2 = node.assertions) != null && _node$assertions2.length)
      ) {
        this.print(node.source, node, true);
        this.space();
        this._printAttributes(node);
      } else this.print(node.source, node);
    }
    this.semicolon();
  }
}
function ExportDefaultDeclaration(node) {
  maybePrintDecoratorsBeforeExport(this, node);
  this.word("export");
  this.noIndentInnerCommentsHere();
  this.space();
  this.word("default");
  this.space();
  const declar = node.declaration;
  this.print(declar, node);
  isStatement$2(declar) || this.semicolon();
}
function ImportDeclaration(node) {
  var _node$attributes3, _node$assertions3;
  this.word("import");
  this.space();
  const isTypeKind = node.importKind === "type" || node.importKind === "typeof";
  if (isTypeKind) {
    this.noIndentInnerCommentsHere();
    this.word(node.importKind);
    this.space();
  } else if (node.module) {
    this.noIndentInnerCommentsHere();
    this.word("module");
    this.space();
  }
  const specifiers = node.specifiers.slice(0),
    hasSpecifiers = !!specifiers.length;
  while (hasSpecifiers) {
    const first = specifiers[0];
    if (!isImportDefaultSpecifier(first) && !isImportNamespaceSpecifier(first)) break;

    this.print(specifiers.shift(), node);
    if (specifiers.length) {
      this.tokenChar(44);
      this.space();
    }
  }
  if (specifiers.length) {
    this.tokenChar(123);
    this.space();
    this.printList(specifiers, node);
    this.space();
    this.tokenChar(125);
  } else if (isTypeKind && !hasSpecifiers) {
    this.tokenChar(123);
    this.tokenChar(125);
  }
  if (hasSpecifiers || isTypeKind) {
    this.space();
    this.word("from");
    this.space();
  }
  if (
    ((_node$attributes3 = node.attributes) != null && _node$attributes3.length) ||
    ((_node$assertions3 = node.assertions) != null && _node$assertions3.length)
  ) {
    this.print(node.source, node, true);
    this.space();
    this._printAttributes(node);
  } else this.print(node.source, node);

  this.semicolon();
}
function ImportAttribute(node) {
  this.print(node.key);
  this.tokenChar(58);
  this.space();
  this.print(node.value);
}
function ImportNamespaceSpecifier(node) {
  this.tokenChar(42);
  this.space();
  this.word("as");
  this.space();
  this.print(node.local, node);
}

const object = {},
  hasOwnProperty = object.hasOwnProperty;
const forOwn = (object, callback) => {
  for (const key in object) hasOwnProperty.call(object, key) && callback(key, object[key]);
};
const extend = (destination, source) => {
  if (!source) return destination;

  forOwn(source, (key, value) => {
    destination[key] = value;
  });
  return destination;
};
const forEach = (array, callback) => {
  const length = array.length;
  for (let index = -1; ++index < length; ) callback(array[index]);
};
const toString = object.toString,
  isArray = Array.isArray,
  isBuffer = Buffer.isBuffer,
  isObject = value => toString.call(value) == '[object Object]',
  isString = value => typeof value == 'string' || toString.call(value) == '[object String]',
  isNumber = value => typeof value == 'number' || toString.call(value) == '[object Number]',
  isFunction$1 = value => typeof value == 'function',
  isMap = value => toString.call(value) == '[object Map]',
  isSet = value => toString.call(value) == '[object Set]';

const singleEscapes = {
  '"': '\\"',
  "'": "\\'",
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t'
};
const regexSingleEscape = /["'\\\b\f\n\r\t]/,
  regexDigit = /[0-9]/,
  regexWhitelist = /[ !#-&(-\[\]-_a-~]/;
const jsesc = (/** (number|*) */ argument, options) => {
  const increaseIndentation = () => {
    oldIndent = indent;
    ++options.indentLevel;
    indent = options.indent.repeat(options.indentLevel);
  };
  const defaults = {
    escapeEverything: false,
    minimal: false,
    isScriptContext: false,
    quotes: 'single',
    wrap: false,
    es6: false,
    json: false,
    compact: true,
    lowercaseHex: false,
    numbers: 'decimal',
    indent: '\t',
    indentLevel: 0,
    __inline1__: false,
    __inline2__: false
  };
  const json = options && options.json;
  if (json) {
    defaults.quotes = 'double';
    defaults.wrap = true;
  }
  options = extend(defaults, options);
  if (options.quotes != 'single' && options.quotes != 'double' && options.quotes != 'backtick')
    options.quotes = 'single';

  const quote = options.quotes == 'double' ? '"' : options.quotes == 'backtick' ? '`' : "'",
    compact = options.compact,
    lowercaseHex = options.lowercaseHex;
  let indent = options.indent.repeat(options.indentLevel),
    oldIndent = '';
  const inline1 = options.__inline1__,
    inline2 = options.__inline2__,
    newLine = compact ? '' : '\n';
  let result,
    isEmpty = true;
  const useBinNumbers = options.numbers == 'binary',
    useOctNumbers = options.numbers == 'octal',
    useDecNumbers = options.numbers == 'decimal',
    useHexNumbers = options.numbers == 'hexadecimal';
  if (json && argument && isFunction$1(argument.toJSON)) argument = argument.toJSON();

  if (!isString(argument)) {
    if (isMap(argument)) {
      if (argument.size == 0) return 'new Map()';

      if (!compact) {
        options.__inline1__ = true;
        options.__inline2__ = false;
      }
      return 'new Map(' + jsesc(Array.from(argument), options) + ')';
    }
    if (isSet(argument))
      return argument.size == 0 ? 'new Set()' : 'new Set(' + jsesc(Array.from(argument), options) + ')';

    if (isBuffer(argument))
      return argument.length == 0 ? 'Buffer.from([])' : 'Buffer.from(' + jsesc(Array.from(argument), options) + ')';

    if (isArray(argument)) {
      result = [];
      options.wrap = true;
      if (inline1) {
        options.__inline1__ = false;
        options.__inline2__ = true;
      }
      inline2 || increaseIndentation();

      forEach(argument, value => {
        isEmpty = false;
        if (inline2) options.__inline2__ = false;

        result.push((compact || inline2 ? '' : indent) + jsesc(value, options));
      });
      return isEmpty
        ? '[]'
        : inline2
        ? '[' + result.join(', ') + ']'
        : '[' + newLine + result.join(',' + newLine) + newLine + (compact ? '' : oldIndent) + ']';
    }
    if (!isNumber(argument)) {
      if (!isObject(argument)) return json ? JSON.stringify(argument) || 'null' : String(argument);

      result = [];
      options.wrap = true;
      increaseIndentation();
      forOwn(argument, (key, value) => {
        isEmpty = false;
        result.push(
          (compact ? '' : indent) + jsesc(key, options) + ':' + (compact ? '' : ' ') + jsesc(value, options)
        );
      });
      return isEmpty ? '{}' : '{' + newLine + result.join(',' + newLine) + newLine + (compact ? '' : oldIndent) + '}';
    }
    if (json) return JSON.stringify(argument);
    if (useDecNumbers) return String(argument);

    if (useHexNumbers) {
      let hexadecimal = argument.toString(16);
      lowercaseHex || (hexadecimal = hexadecimal.toUpperCase());

      return '0x' + hexadecimal;
    }
    if (useBinNumbers) return '0b' + argument.toString(2);
    if (useOctNumbers) return '0o' + argument.toString(8);
  }
  const string = argument;
  let index = -1;
  const length = string.length;
  result = '';
  while (++index < length) {
    const character = string.charAt(index);
    if (options.es6) {
      const first = string.charCodeAt(index);
      if (first >= 0xD800 && first <= 0xDBFF && length > index + 1) {
        const second = string.charCodeAt(index + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
          let hexadecimal = (0x400 * (first - 0xD800) + second - 0xDC00 + 0x10000).toString(16);
          lowercaseHex || (hexadecimal = hexadecimal.toUpperCase());

          result += '\\u{' + hexadecimal + '}';
          ++index;
          continue;
        }
      }
    }
    if (!options.escapeEverything) {
      if (regexWhitelist.test(character)) {
        result += character;
        continue;
      }
      if (character == '"') {
        result += quote == character ? '\\"' : character;
        continue;
      }
      if (character == '`') {
        result += quote == character ? '\\`' : character;
        continue;
      }
      if (character == "'") {
        result += quote == character ? "\\'" : character;
        continue;
      }
    }
    if (character == '\0' && !json && !regexDigit.test(string.charAt(index + 1))) {
      result += '\\0';
      continue;
    }
    if (regexSingleEscape.test(character)) {
      result += singleEscapes[character];
      continue;
    }
    const charCode = character.charCodeAt(0);
    if (options.minimal && charCode != 0x2028 && charCode != 0x2029) {
      result += character;
      continue;
    }
    let hexadecimal = charCode.toString(16);
    lowercaseHex || (hexadecimal = hexadecimal.toUpperCase());

    const longhand = hexadecimal.length > 2 || json,
      escaped = '\\' + (longhand ? 'u' : 'x') + ('0000' + hexadecimal).slice(longhand ? -4 : -2);
    result += escaped;
  }
  if (options.wrap) result = quote + result + quote;
  if (quote == '`') result = result.replace(/\${/g, '\\${');

  return options.isScriptContext
    ? result.replace(/<\/(script|style)/gi, '<\\/$1').replace(/<!--/g, json ? '\\u003C!--' : '\\x3C!--')
    : result;
};
jsesc.version = '2.5.2';
var jsesc_1 = jsesc;

const { isAssignmentPattern, isIdentifier } = _t;
function Identifier(node) {
  var _node$loc;
  this.sourceIdentifierName(((_node$loc = node.loc) == null ? void 0 : _node$loc.identifierName) || node.name);
  this.word(node.name);
}
function ArgumentPlaceholder() {
  this.tokenChar(63);
}
function RestElement(node) {
  this.token("...");
  this.print(node.argument, node);
}
function ObjectExpression(node) {
  const props = node.properties;
  this.tokenChar(123);
  if (props.length) {
    this.space();
    this.printList(props, node, { indent: true, statement: true });
    this.space();
  }
  this.sourceWithOffset("end", node.loc, -1);
  this.tokenChar(125);
}
function ObjectMethod(node) {
  this.printJoin(node.decorators, node);
  this._methodHead(node);
  this.space();
  this.print(node.body, node);
}
function ObjectProperty(node) {
  this.printJoin(node.decorators, node);
  if (node.computed) {
    this.tokenChar(91);
    this.print(node.key, node);
    this.tokenChar(93);
  } else {
    if (isAssignmentPattern(node.value) && isIdentifier(node.key) && node.key.name === node.value.left.name) {
      this.print(node.value, node);
      return;
    }
    this.print(node.key, node);
    if (node.shorthand && isIdentifier(node.key) && isIdentifier(node.value) && node.key.name === node.value.name)
      return;
  }
  this.tokenChar(58);
  this.space();
  this.print(node.value, node);
}
function ArrayExpression(node) {
  const elems = node.elements,
    len = elems.length;
  this.tokenChar(91);
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem) {
      i > 0 && this.space();
      this.print(elem, node);
      i < len - 1 && this.tokenChar(44);
    } else this.tokenChar(44);
  }
  this.tokenChar(93);
}
function RecordExpression(node) {
  const props = node.properties;
  let startToken, endToken;
  if (this.format.recordAndTupleSyntaxType === "bar") {
    startToken = "{|";
    endToken = "|}";
  } else if (this.format.recordAndTupleSyntaxType !== "hash" && this.format.recordAndTupleSyntaxType != null)
    throw new Error(
      `The "recordAndTupleSyntaxType" generator option must be "bar" or "hash" (${JSON.stringify(
        this.format.recordAndTupleSyntaxType
      )} received).`
    );
  else {
    startToken = "#{";
    endToken = "}";
  }
  this.token(startToken);
  if (props.length) {
    this.space();
    this.printList(props, node, { indent: true, statement: true });
    this.space();
  }
  this.token(endToken);
}
function TupleExpression(node) {
  const elems = node.elements,
    len = elems.length;
  let startToken, endToken;
  if (this.format.recordAndTupleSyntaxType === "bar") {
    startToken = "[|";
    endToken = "|]";
  } else if (this.format.recordAndTupleSyntaxType === "hash") {
    startToken = "#[";
    endToken = "]";
  } else throw new Error(this.format.recordAndTupleSyntaxType + " is not a valid recordAndTuple syntax type");

  this.token(startToken);
  for (let i = 0; i < elems.length; i++) {
    const elem = elems[i];
    if (elem) {
      i > 0 && this.space();
      this.print(elem, node);
      i < len - 1 && this.tokenChar(44);
    }
  }
  this.token(endToken);
}
function RegExpLiteral(node) {
  this.word(`/${node.pattern}/${node.flags}`);
}
function BooleanLiteral(node) {
  this.word(node.value ? "true" : "false");
}
function NullLiteral() {
  this.word("null");
}
function NumericLiteral(node) {
  const raw = this.getPossibleRaw(node),
    opts = this.format.jsescOption,
    value = node.value + "";
  opts.numbers
    ? this.number(jsesc_1(node.value, opts))
    : raw == null
    ? this.number(value)
    : this.format.minified
    ? this.number(raw.length < value.length ? raw : value)
    : this.number(raw);
}
function StringLiteral(node) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== void 0) {
    this.token(raw);
    return;
  }
  const val = jsesc_1(node.value, this.format.jsescOption);
  this.token(val);
}
function BigIntLiteral(node) {
  const raw = this.getPossibleRaw(node);
  this.format.minified || raw === void 0 ? this.word(node.value + "n") : this.word(raw);
}
function DecimalLiteral(node) {
  const raw = this.getPossibleRaw(node);
  this.format.minified || raw === void 0 ? this.word(node.value + "m") : this.word(raw);
}
const validTopicTokenSet = new Set(["^^", "@@", "^", "%", "#"]);
function TopicReference() {
  const { topicToken } = this.format;
  if (!validTopicTokenSet.has(topicToken)) {
    const givenTopicTokenJSON = JSON.stringify(topicToken),
      validTopics = Array.from(validTopicTokenSet, v => JSON.stringify(v));
    throw new Error(
      `The "topicToken" generator option must be one of ${validTopics.join(
        ", "
      )} (${givenTopicTokenJSON} received instead).`
    );
  }
  this.token(topicToken);
}
function PipelineTopicExpression(node) {
  this.print(node.expression, node);
}
function PipelineBareFunction(node) {
  this.print(node.callee, node);
}
function PipelinePrimaryTopicReference() {
  this.tokenChar(35);
}

const { isDeclareExportDeclaration, isStatement: isStatement$1 } = _t;
function AnyTypeAnnotation() {
  this.word("any");
}
function ArrayTypeAnnotation(node) {
  this.print(node.elementType, node, true);
  this.tokenChar(91);
  this.tokenChar(93);
}
function BooleanTypeAnnotation() {
  this.word("boolean");
}
function BooleanLiteralTypeAnnotation(node) {
  this.word(node.value ? "true" : "false");
}
function NullLiteralTypeAnnotation() {
  this.word("null");
}
function DeclareClass(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("class");
  this.space();
  this._interfaceish(node);
}
function DeclareFunction(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("function");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation.typeAnnotation, node);
  if (node.predicate) {
    this.space();
    this.print(node.predicate, node);
  }
  this.semicolon();
}
function InferredPredicate() {
  this.tokenChar(37);
  this.word("checks");
}
function DeclaredPredicate(node) {
  this.tokenChar(37);
  this.word("checks");
  this.tokenChar(40);
  this.print(node.value, node);
  this.tokenChar(41);
}
function DeclareInterface(node) {
  this.word("declare");
  this.space();
  this.InterfaceDeclaration(node);
}
function DeclareModule(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.space();
  this.print(node.id, node);
  this.space();
  this.print(node.body, node);
}
function DeclareModuleExports(node) {
  this.word("declare");
  this.space();
  this.word("module");
  this.tokenChar(46);
  this.word("exports");
  this.print(node.typeAnnotation, node);
}
function DeclareTypeAlias(node) {
  this.word("declare");
  this.space();
  this.TypeAlias(node);
}
function DeclareOpaqueType(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.OpaqueType(node);
}
function DeclareVariable(node, parent) {
  if (!isDeclareExportDeclaration(parent)) {
    this.word("declare");
    this.space();
  }
  this.word("var");
  this.space();
  this.print(node.id, node);
  this.print(node.id.typeAnnotation, node);
  this.semicolon();
}
function DeclareExportDeclaration(node) {
  this.word("declare");
  this.space();
  this.word("export");
  this.space();
  if (node.default) {
    this.word("default");
    this.space();
  }
  FlowExportDeclaration.call(this, node);
}
function DeclareExportAllDeclaration(node) {
  this.word("declare");
  this.space();
  ExportAllDeclaration.call(this, node);
}
function EnumDeclaration(node) {
  const { id, body } = node;
  this.word("enum");
  this.space();
  this.print(id, node);
  this.print(body, node);
}
function enumExplicitType(context, name, hasExplicitType) {
  if (hasExplicitType) {
    context.space();
    context.word("of");
    context.space();
    context.word(name);
  }
  context.space();
}
function enumBody(context, node) {
  const { members } = node;
  context.token("{");
  context.indent();
  context.newline();
  for (const member of members) {
    context.print(member, node);
    context.newline();
  }
  if (node.hasUnknownMembers) {
    context.token("...");
    context.newline();
  }
  context.dedent();
  context.token("}");
}
function EnumBooleanBody(node) {
  const { explicitType } = node;
  enumExplicitType(this, "boolean", explicitType);
  enumBody(this, node);
}
function EnumNumberBody(node) {
  const { explicitType } = node;
  enumExplicitType(this, "number", explicitType);
  enumBody(this, node);
}
function EnumStringBody(node) {
  const { explicitType } = node;
  enumExplicitType(this, "string", explicitType);
  enumBody(this, node);
}
function EnumSymbolBody(node) {
  enumExplicitType(this, "symbol", true);
  enumBody(this, node);
}
function EnumDefaultedMember(node) {
  const { id } = node;
  this.print(id, node);
  this.tokenChar(44);
}
function enumInitializedMember(context, node) {
  const { id, init } = node;
  context.print(id, node);
  context.space();
  context.token("=");
  context.space();
  context.print(init, node);
  context.token(",");
}
function EnumBooleanMember(node) {
  enumInitializedMember(this, node);
}
function EnumNumberMember(node) {
  enumInitializedMember(this, node);
}
function EnumStringMember(node) {
  enumInitializedMember(this, node);
}
function FlowExportDeclaration(node) {
  if (node.declaration) {
    const declar = node.declaration;
    this.print(declar, node);
    isStatement$1(declar) || this.semicolon();
  } else {
    this.tokenChar(123);
    if (node.specifiers.length) {
      this.space();
      this.printList(node.specifiers, node);
      this.space();
    }
    this.tokenChar(125);
    if (node.source) {
      this.space();
      this.word("from");
      this.space();
      this.print(node.source, node);
    }
    this.semicolon();
  }
}
function ExistsTypeAnnotation() {
  this.tokenChar(42);
}
function FunctionTypeAnnotation(node, parent) {
  this.print(node.typeParameters, node);
  this.tokenChar(40);
  if (node.this) {
    this.word("this");
    this.tokenChar(58);
    this.space();
    this.print(node.this.typeAnnotation, node);
    if (node.params.length || node.rest) {
      this.tokenChar(44);
      this.space();
    }
  }
  this.printList(node.params, node);
  if (node.rest) {
    if (node.params.length) {
      this.tokenChar(44);
      this.space();
    }
    this.token("...");
    this.print(node.rest, node);
  }
  this.tokenChar(41);
  const type = parent == null ? void 0 : parent.type;
  if (
    type == null ||
    (type !== "ObjectTypeCallProperty" &&
      type !== "ObjectTypeInternalSlot" &&
      type !== "DeclareFunction" &&
      (type !== "ObjectTypeProperty" || !parent.method))
  ) {
    this.space();
    this.token("=>");
  } else this.tokenChar(58);

  this.space();
  this.print(node.returnType, node);
}
function FunctionTypeParam(node) {
  this.print(node.name, node);
  node.optional && this.tokenChar(63);
  if (node.name) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.typeAnnotation, node);
}
function InterfaceExtends(node) {
  this.print(node.id, node);
  this.print(node.typeParameters, node, true);
}
function _interfaceish(node) {
  var _node$extends;
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  if ((_node$extends = node.extends) != null && _node$extends.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }
  if (node.type === "DeclareClass") {
    var _node$mixins, _node$implements;
    if ((_node$mixins = node.mixins) != null && _node$mixins.length) {
      this.space();
      this.word("mixins");
      this.space();
      this.printList(node.mixins, node);
    }
    if ((_node$implements = node.implements) != null && _node$implements.length) {
      this.space();
      this.word("implements");
      this.space();
      this.printList(node.implements, node);
    }
  }
  this.space();
  this.print(node.body, node);
}
function _variance(node) {
  var _node$variance;
  const kind = (_node$variance = node.variance) == null ? void 0 : _node$variance.kind;
  if (kind != null) kind === "plus" ? this.tokenChar(43) : kind !== "minus" || this.tokenChar(45);
}
function InterfaceDeclaration(node) {
  this.word("interface");
  this.space();
  this._interfaceish(node);
}
function andSeparator() {
  this.space();
  this.tokenChar(38);
  this.space();
}
function InterfaceTypeAnnotation(node) {
  var _node$extends2;
  this.word("interface");
  if ((_node$extends2 = node.extends) != null && _node$extends2.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(node.extends, node);
  }
  this.space();
  this.print(node.body, node);
}
function IntersectionTypeAnnotation(node) {
  this.printJoin(node.types, node, { separator: andSeparator });
}
function MixedTypeAnnotation() {
  this.word("mixed");
}
function EmptyTypeAnnotation() {
  this.word("empty");
}
function NullableTypeAnnotation(node) {
  this.tokenChar(63);
  this.print(node.typeAnnotation, node);
}
function NumberTypeAnnotation() {
  this.word("number");
}
function StringTypeAnnotation() {
  this.word("string");
}
function ThisTypeAnnotation() {
  this.word("this");
}
function TupleTypeAnnotation(node) {
  this.tokenChar(91);
  this.printList(node.types, node);
  this.tokenChar(93);
}
function TypeofTypeAnnotation(node) {
  this.word("typeof");
  this.space();
  this.print(node.argument, node);
}
function TypeAlias(node) {
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(node.right, node);
  this.semicolon();
}
function TypeAnnotation(node) {
  this.tokenChar(58);
  this.space();
  node.optional && this.tokenChar(63);
  this.print(node.typeAnnotation, node);
}
function TypeParameterInstantiation(node) {
  this.tokenChar(60);
  this.printList(node.params, node, {});
  this.tokenChar(62);
}
function TypeParameter(node) {
  this._variance(node);
  this.word(node.name);
  node.bound && this.print(node.bound, node);

  if (node.default) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.default, node);
  }
}
function OpaqueType(node) {
  this.word("opaque");
  this.space();
  this.word("type");
  this.space();
  this.print(node.id, node);
  this.print(node.typeParameters, node);
  if (node.supertype) {
    this.tokenChar(58);
    this.space();
    this.print(node.supertype, node);
  }
  if (node.impltype) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.impltype, node);
  }
  this.semicolon();
}
function ObjectTypeAnnotation(node) {
  node.exact ? this.token("{|") : this.tokenChar(123);

  const props = [
    ...node.properties,
    ...(node.callProperties || []),
    ...(node.indexers || []),
    ...(node.internalSlots || [])
  ];
  if (props.length) {
    this.newline();
    this.space();
    this.printJoin(props, node, {
      addNewlines(leading) {
        if (leading && !props[0]) return 1;
      },
      indent: true,
      statement: true,
      iterator: () => {
        if (props.length !== 1 || node.inexact) {
          this.tokenChar(44);
          this.space();
        }
      }
    });
    this.space();
  }
  if (node.inexact) {
    this.indent();
    this.token("...");
    props.length && this.newline();

    this.dedent();
  }
  node.exact ? this.token("|}") : this.tokenChar(125);
}
function ObjectTypeInternalSlot(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.tokenChar(91);
  this.tokenChar(91);
  this.print(node.id, node);
  this.tokenChar(93);
  this.tokenChar(93);
  node.optional && this.tokenChar(63);
  if (!node.method) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.value, node);
}
function ObjectTypeCallProperty(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  this.print(node.value, node);
}
function ObjectTypeIndexer(node) {
  if (node.static) {
    this.word("static");
    this.space();
  }
  this._variance(node);
  this.tokenChar(91);
  if (node.id) {
    this.print(node.id, node);
    this.tokenChar(58);
    this.space();
  }
  this.print(node.key, node);
  this.tokenChar(93);
  this.tokenChar(58);
  this.space();
  this.print(node.value, node);
}
function ObjectTypeProperty(node) {
  if (node.proto) {
    this.word("proto");
    this.space();
  }
  if (node.static) {
    this.word("static");
    this.space();
  }
  if (node.kind === "get" || node.kind === "set") {
    this.word(node.kind);
    this.space();
  }
  this._variance(node);
  this.print(node.key, node);
  node.optional && this.tokenChar(63);
  if (!node.method) {
    this.tokenChar(58);
    this.space();
  }
  this.print(node.value, node);
}
function ObjectTypeSpreadProperty(node) {
  this.token("...");
  this.print(node.argument, node);
}
function QualifiedTypeIdentifier(node) {
  this.print(node.qualification, node);
  this.tokenChar(46);
  this.print(node.id, node);
}
function SymbolTypeAnnotation() {
  this.word("symbol");
}
function orSeparator() {
  this.space();
  this.tokenChar(124);
  this.space();
}
function UnionTypeAnnotation(node) {
  this.printJoin(node.types, node, { separator: orSeparator });
}
function TypeCastExpression(node) {
  this.tokenChar(40);
  this.print(node.expression, node);
  this.print(node.typeAnnotation, node);
  this.tokenChar(41);
}
function Variance(node) {
  node.kind === "plus" ? this.tokenChar(43) : this.tokenChar(45);
}
function VoidTypeAnnotation() {
  this.word("void");
}
function IndexedAccessType(node) {
  this.print(node.objectType, node, true);
  this.tokenChar(91);
  this.print(node.indexType, node);
  this.tokenChar(93);
}
function OptionalIndexedAccessType(node) {
  this.print(node.objectType, node);
  node.optional && this.token("?.");

  this.tokenChar(91);
  this.print(node.indexType, node);
  this.tokenChar(93);
}

function File(node) {
  node.program && this.print(node.program.interpreter, node);

  this.print(node.program, node);
}
function Program(node) {
  var _node$directives;
  this.noIndentInnerCommentsHere();
  this.printInnerComments();
  const directivesLen = (_node$directives = node.directives) == null ? void 0 : _node$directives.length;
  if (directivesLen) {
    var _node$directives$trai;
    const newline = node.body.length ? 2 : 1;
    this.printSequence(node.directives, node, { trailingCommentsLineOffset: newline });

    ((_node$directives$trai = node.directives[directivesLen - 1].trailingComments) != null &&
      _node$directives$trai.length) ||
      this.newline(newline);
  }
  this.printSequence(node.body, node);
}
function BlockStatement(node) {
  var _node$directives2;
  this.tokenChar(123);
  const directivesLen = (_node$directives2 = node.directives) == null ? void 0 : _node$directives2.length;
  if (directivesLen) {
    var _node$directives$trai2;
    const newline = node.body.length ? 2 : 1;
    this.printSequence(node.directives, node, { indent: true, trailingCommentsLineOffset: newline });

    ((_node$directives$trai2 = node.directives[directivesLen - 1].trailingComments) != null &&
      _node$directives$trai2.length) ||
      this.newline(newline);
  }
  this.printSequence(node.body, node, { indent: true });
  this.rightBrace(node);
}
function Directive(node) {
  this.print(node.value, node);
  this.semicolon();
}
const unescapedSingleQuoteRE = /(?:^|[^\\])(?:\\\\)*'/,
  unescapedDoubleQuoteRE = /(?:^|[^\\])(?:\\\\)*"/;
function DirectiveLiteral(node) {
  const raw = this.getPossibleRaw(node);
  if (!this.format.minified && raw !== void 0) {
    this.token(raw);
    return;
  }
  const { value } = node;
  if (!unescapedDoubleQuoteRE.test(value)) this.token(`"${value}"`);
  else if (!unescapedSingleQuoteRE.test(value)) this.token(`'${value}'`);
  else
    throw new Error(
      "Malformed AST: it is not possible to print a directive containing both unescaped single and double quotes."
    );
}
function InterpreterDirective(node) {
  this.token("#!" + node.value);
  this.newline(1, true);
}
function Placeholder(node) {
  this.token("%%");
  this.print(node.name);
  this.token("%%");
  node.expectedNode !== "Statement" || this.semicolon();
}

function JSXAttribute(node) {
  this.print(node.name, node);
  if (node.value) {
    this.tokenChar(61);
    this.print(node.value, node);
  }
}
function JSXIdentifier(node) {
  this.word(node.name);
}
function JSXNamespacedName(node) {
  this.print(node.namespace, node);
  this.tokenChar(58);
  this.print(node.name, node);
}
function JSXMemberExpression(node) {
  this.print(node.object, node);
  this.tokenChar(46);
  this.print(node.property, node);
}
function JSXSpreadAttribute(node) {
  this.tokenChar(123);
  this.token("...");
  this.print(node.argument, node);
  this.tokenChar(125);
}
function JSXExpressionContainer(node) {
  this.tokenChar(123);
  this.print(node.expression, node);
  this.tokenChar(125);
}
function JSXSpreadChild(node) {
  this.tokenChar(123);
  this.token("...");
  this.print(node.expression, node);
  this.tokenChar(125);
}
function JSXText(node) {
  const raw = this.getPossibleRaw(node);
  raw !== void 0 ? this.token(raw, true) : this.token(node.value, true);
}
function JSXElement(node) {
  const open = node.openingElement;
  this.print(open, node);
  if (open.selfClosing) return;
  this.indent();
  for (const child of node.children) this.print(child, node);

  this.dedent();
  this.print(node.closingElement, node);
}
function spaceSeparator() {
  this.space();
}
function JSXOpeningElement(node) {
  this.tokenChar(60);
  this.print(node.name, node);
  this.print(node.typeParameters, node);
  if (node.attributes.length > 0) {
    this.space();
    this.printJoin(node.attributes, node, { separator: spaceSeparator });
  }
  if (node.selfClosing) {
    this.space();
    this.token("/>");
  } else this.tokenChar(62);
}
function JSXClosingElement(node) {
  this.token("</");
  this.print(node.name, node);
  this.tokenChar(62);
}
function JSXEmptyExpression() {
  this.printInnerComments();
}
function JSXFragment(node) {
  this.print(node.openingFragment, node);
  this.indent();
  for (const child of node.children) this.print(child, node);

  this.dedent();
  this.print(node.closingFragment, node);
}
function JSXOpeningFragment() {
  this.tokenChar(60);
  this.tokenChar(62);
}
function JSXClosingFragment() {
  this.token("</");
  this.tokenChar(62);
}

function TSTypeAnnotation(node) {
  this.tokenChar(58);
  this.space();
  node.optional && this.tokenChar(63);
  this.print(node.typeAnnotation, node);
}
function TSTypeParameterInstantiation(node, parent) {
  this.tokenChar(60);
  this.printList(node.params, node, {});
  parent.type !== "ArrowFunctionExpression" || node.params.length !== 1 || this.tokenChar(44);

  this.tokenChar(62);
}
function TSTypeParameter(node) {
  if (node.in) {
    this.word("in");
    this.space();
  }
  if (node.out) {
    this.word("out");
    this.space();
  }
  this.word(node.name);
  if (node.constraint) {
    this.space();
    this.word("extends");
    this.space();
    this.print(node.constraint, node);
  }
  if (node.default) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(node.default, node);
  }
}
function TSParameterProperty(node) {
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }
  if (node.readonly) {
    this.word("readonly");
    this.space();
  }
  this._param(node.parameter);
}
function TSDeclareFunction(node, parent) {
  if (node.declare) {
    this.word("declare");
    this.space();
  }
  this._functionHead(node, parent);
  this.tokenChar(59);
}
function TSDeclareMethod(node) {
  this._classMethodHead(node);
  this.tokenChar(59);
}
function TSQualifiedName(node) {
  this.print(node.left, node);
  this.tokenChar(46);
  this.print(node.right, node);
}
function TSCallSignatureDeclaration(node) {
  this.tsPrintSignatureDeclarationBase(node);
  this.tokenChar(59);
}
function TSConstructSignatureDeclaration(node) {
  this.word("new");
  this.space();
  this.tsPrintSignatureDeclarationBase(node);
  this.tokenChar(59);
}
function TSPropertySignature(node) {
  const { readonly, initializer } = node;
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  this.tsPrintPropertyOrMethodName(node);
  this.print(node.typeAnnotation, node);
  if (initializer) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(initializer, node);
  }
  this.tokenChar(59);
}
function tsPrintPropertyOrMethodName(node) {
  node.computed && this.tokenChar(91);

  this.print(node.key, node);
  node.computed && this.tokenChar(93);

  node.optional && this.tokenChar(63);
}
function TSMethodSignature(node) {
  const { kind } = node;
  if (kind === "set" || kind === "get") {
    this.word(kind);
    this.space();
  }
  this.tsPrintPropertyOrMethodName(node);
  this.tsPrintSignatureDeclarationBase(node);
  this.tokenChar(59);
}
function TSIndexSignature(node) {
  const { readonly, static: isStatic } = node;
  if (isStatic) {
    this.word("static");
    this.space();
  }
  if (readonly) {
    this.word("readonly");
    this.space();
  }
  this.tokenChar(91);
  this._parameters(node.parameters, node);
  this.tokenChar(93);
  this.print(node.typeAnnotation, node);
  this.tokenChar(59);
}
function TSAnyKeyword() {
  this.word("any");
}
function TSBigIntKeyword() {
  this.word("bigint");
}
function TSUnknownKeyword() {
  this.word("unknown");
}
function TSNumberKeyword() {
  this.word("number");
}
function TSObjectKeyword() {
  this.word("object");
}
function TSBooleanKeyword() {
  this.word("boolean");
}
function TSStringKeyword() {
  this.word("string");
}
function TSSymbolKeyword() {
  this.word("symbol");
}
function TSVoidKeyword() {
  this.word("void");
}
function TSUndefinedKeyword() {
  this.word("undefined");
}
function TSNullKeyword() {
  this.word("null");
}
function TSNeverKeyword() {
  this.word("never");
}
function TSIntrinsicKeyword() {
  this.word("intrinsic");
}
function TSThisType() {
  this.word("this");
}
function TSFunctionType(node) {
  this.tsPrintFunctionOrConstructorType(node);
}
function TSConstructorType(node) {
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  this.word("new");
  this.space();
  this.tsPrintFunctionOrConstructorType(node);
}
function tsPrintFunctionOrConstructorType(node) {
  const { typeParameters } = node,
    parameters = node.parameters;
  this.print(typeParameters, node);
  this.tokenChar(40);
  this._parameters(parameters, node);
  this.tokenChar(41);
  this.space();
  this.token("=>");
  this.space();
  const returnType = node.typeAnnotation;
  this.print(returnType.typeAnnotation, node);
}
function TSTypeReference(node) {
  this.print(node.typeName, node, true);
  this.print(node.typeParameters, node, true);
}
function TSTypePredicate(node) {
  if (node.asserts) {
    this.word("asserts");
    this.space();
  }
  this.print(node.parameterName);
  if (node.typeAnnotation) {
    this.space();
    this.word("is");
    this.space();
    this.print(node.typeAnnotation.typeAnnotation);
  }
}
function TSTypeQuery(node) {
  this.word("typeof");
  this.space();
  this.print(node.exprName);
  node.typeParameters && this.print(node.typeParameters, node);
}
function TSTypeLiteral(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.members, node);
}
function tsPrintTypeLiteralOrInterfaceBody(members, node) {
  tsPrintBraced(this, members, node);
}
function tsPrintBraced(printer, members, node) {
  printer.token("{");
  if (members.length) {
    printer.indent();
    printer.newline();
    for (const member of members) {
      printer.print(member, node);
      printer.newline();
    }
    printer.dedent();
  }
  printer.rightBrace(node);
}
function TSArrayType(node) {
  this.print(node.elementType, node, true);
  this.token("[]");
}
function TSTupleType(node) {
  this.tokenChar(91);
  this.printList(node.elementTypes, node);
  this.tokenChar(93);
}
function TSOptionalType(node) {
  this.print(node.typeAnnotation, node);
  this.tokenChar(63);
}
function TSRestType(node) {
  this.token("...");
  this.print(node.typeAnnotation, node);
}
function TSNamedTupleMember(node) {
  this.print(node.label, node);
  node.optional && this.tokenChar(63);
  this.tokenChar(58);
  this.space();
  this.print(node.elementType, node);
}
function TSUnionType(node) {
  tsPrintUnionOrIntersectionType(this, node, "|");
}
function TSIntersectionType(node) {
  tsPrintUnionOrIntersectionType(this, node, "&");
}
function tsPrintUnionOrIntersectionType(printer, node, sep) {
  printer.printJoin(node.types, node, {
    separator() {
      this.space();
      this.token(sep);
      this.space();
    }
  });
}
function TSConditionalType(node) {
  this.print(node.checkType);
  this.space();
  this.word("extends");
  this.space();
  this.print(node.extendsType);
  this.space();
  this.tokenChar(63);
  this.space();
  this.print(node.trueType);
  this.space();
  this.tokenChar(58);
  this.space();
  this.print(node.falseType);
}
function TSInferType(node) {
  this.token("infer");
  this.space();
  this.print(node.typeParameter);
}
function TSParenthesizedType(node) {
  this.tokenChar(40);
  this.print(node.typeAnnotation, node);
  this.tokenChar(41);
}
function TSTypeOperator(node) {
  this.word(node.operator);
  this.space();
  this.print(node.typeAnnotation, node);
}
function TSIndexedAccessType(node) {
  this.print(node.objectType, node, true);
  this.tokenChar(91);
  this.print(node.indexType, node);
  this.tokenChar(93);
}
function TSMappedType(node) {
  const { nameType, optional, readonly, typeParameter } = node;
  this.tokenChar(123);
  this.space();
  if (readonly) {
    tokenIfPlusMinus(this, readonly);
    this.word("readonly");
    this.space();
  }
  this.tokenChar(91);
  this.word(typeParameter.name);
  this.space();
  this.word("in");
  this.space();
  this.print(typeParameter.constraint, typeParameter);
  if (nameType) {
    this.space();
    this.word("as");
    this.space();
    this.print(nameType, node);
  }
  this.tokenChar(93);
  if (optional) {
    tokenIfPlusMinus(this, optional);
    this.tokenChar(63);
  }
  this.tokenChar(58);
  this.space();
  this.print(node.typeAnnotation, node);
  this.space();
  this.tokenChar(125);
}
function tokenIfPlusMinus(self, tok) {
  tok === true || self.token(tok);
}
function TSLiteralType(node) {
  this.print(node.literal, node);
}
function TSExpressionWithTypeArguments(node) {
  this.print(node.expression, node);
  this.print(node.typeParameters, node);
}
function TSInterfaceDeclaration(node) {
  const { declare, id, typeParameters, extends: extendz, body } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("interface");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);
  if (extendz != null && extendz.length) {
    this.space();
    this.word("extends");
    this.space();
    this.printList(extendz, node);
  }
  this.space();
  this.print(body, node);
}
function TSInterfaceBody(node) {
  this.tsPrintTypeLiteralOrInterfaceBody(node.body, node);
}
function TSTypeAliasDeclaration(node) {
  const { declare, id, typeParameters, typeAnnotation } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  this.word("type");
  this.space();
  this.print(id, node);
  this.print(typeParameters, node);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(typeAnnotation, node);
  this.tokenChar(59);
}
function TSTypeExpression(node) {
  var _expression$trailingC;
  const { type, expression, typeAnnotation } = node,
    forceParens = !((_expression$trailingC = expression.trailingComments) == null || !_expression$trailingC.length);
  this.print(expression, node, true, void 0, forceParens);
  this.space();
  this.word(type === "TSAsExpression" ? "as" : "satisfies");
  this.space();
  this.print(typeAnnotation, node);
}
function TSTypeAssertion(node) {
  const { typeAnnotation, expression } = node;
  this.tokenChar(60);
  this.print(typeAnnotation, node);
  this.tokenChar(62);
  this.space();
  this.print(expression, node);
}
function TSInstantiationExpression(node) {
  this.print(node.expression, node);
  this.print(node.typeParameters, node);
}
function TSEnumDeclaration(node) {
  const { declare, const: isConst, id, members } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  if (isConst) {
    this.word("const");
    this.space();
  }
  this.word("enum");
  this.space();
  this.print(id, node);
  this.space();
  tsPrintBraced(this, members, node);
}
function TSEnumMember(node) {
  const { id, initializer } = node;
  this.print(id, node);
  if (initializer) {
    this.space();
    this.tokenChar(61);
    this.space();
    this.print(initializer, node);
  }
  this.tokenChar(44);
}
function TSModuleDeclaration(node) {
  const { declare, id } = node;
  if (declare) {
    this.word("declare");
    this.space();
  }
  if (!node.global) {
    this.word(id.type === "Identifier" ? "namespace" : "module");
    this.space();
  }
  this.print(id, node);
  if (!node.body) {
    this.tokenChar(59);
    return;
  }
  let body = node.body;
  while (body.type === "TSModuleDeclaration") {
    this.tokenChar(46);
    this.print(body.id, body);
    body = body.body;
  }
  this.space();
  this.print(body, node);
}
function TSModuleBlock(node) {
  tsPrintBraced(this, node.body, node);
}
function TSImportType(node) {
  const { argument, qualifier, typeParameters } = node;
  this.word("import");
  this.tokenChar(40);
  this.print(argument, node);
  this.tokenChar(41);
  if (qualifier) {
    this.tokenChar(46);
    this.print(qualifier, node);
  }
  typeParameters && this.print(typeParameters, node);
}
function TSImportEqualsDeclaration(node) {
  const { isExport, id, moduleReference } = node;
  if (isExport) {
    this.word("export");
    this.space();
  }
  this.word("import");
  this.space();
  this.print(id, node);
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(moduleReference, node);
  this.tokenChar(59);
}
function TSExternalModuleReference(node) {
  this.token("require(");
  this.print(node.expression, node);
  this.tokenChar(41);
}
function TSNonNullExpression(node) {
  this.print(node.expression, node);
  this.tokenChar(33);
}
function TSExportAssignment(node) {
  this.word("export");
  this.space();
  this.tokenChar(61);
  this.space();
  this.print(node.expression, node);
  this.tokenChar(59);
}
function TSNamespaceExportDeclaration(node) {
  this.word("export");
  this.space();
  this.word("as");
  this.space();
  this.word("namespace");
  this.space();
  this.print(node.id, node);
}
function tsPrintSignatureDeclarationBase(node) {
  const { typeParameters } = node,
    parameters = node.parameters;
  this.print(typeParameters, node);
  this.tokenChar(40);
  this._parameters(parameters, node);
  this.tokenChar(41);
  const returnType = node.typeAnnotation;
  this.print(returnType, node);
}
function tsPrintClassMemberModifiers(node) {
  const isField = node.type === "ClassAccessorProperty" || node.type === "ClassProperty";
  if (isField && node.declare) {
    this.word("declare");
    this.space();
  }
  if (node.accessibility) {
    this.word(node.accessibility);
    this.space();
  }
  if (node.static) {
    this.word("static");
    this.space();
  }
  if (node.override) {
    this.word("override");
    this.space();
  }
  if (node.abstract) {
    this.word("abstract");
    this.space();
  }
  if (isField && node.readonly) {
    this.word("readonly");
    this.space();
  }
}

var generatorFunctions = Object.freeze({
  __proto__: null,
  AnyTypeAnnotation,
  ArgumentPlaceholder,
  ArrayExpression,
  ArrayPattern: ArrayExpression,
  ArrayTypeAnnotation,
  ArrowFunctionExpression,
  AssignmentExpression,
  AssignmentPattern,
  AwaitExpression,
  BigIntLiteral,
  BinaryExpression: AssignmentExpression,
  BindExpression,
  BlockStatement,
  BooleanLiteral,
  BooleanLiteralTypeAnnotation,
  BooleanTypeAnnotation,
  BreakStatement,
  CallExpression,
  CatchClause,
  ClassAccessorProperty,
  ClassBody,
  ClassDeclaration,
  ClassExpression: ClassDeclaration,
  ClassImplements: InterfaceExtends,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  ConditionalExpression,
  ContinueStatement,
  DebuggerStatement,
  DecimalLiteral,
  DeclareClass,
  DeclareExportAllDeclaration,
  DeclareExportDeclaration,
  DeclareFunction,
  DeclareInterface,
  DeclareModule,
  DeclareModuleExports,
  DeclareOpaqueType,
  DeclareTypeAlias,
  DeclareVariable,
  DeclaredPredicate,
  Decorator,
  Directive,
  DirectiveLiteral,
  DoExpression,
  DoWhileStatement,
  EmptyStatement,
  EmptyTypeAnnotation,
  EnumBooleanBody,
  EnumBooleanMember,
  EnumDeclaration,
  EnumDefaultedMember,
  EnumNumberBody,
  EnumNumberMember,
  EnumStringBody,
  EnumStringMember,
  EnumSymbolBody,
  ExistsTypeAnnotation,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultSpecifier,
  ExportNamedDeclaration,
  ExportNamespaceSpecifier,
  ExportSpecifier,
  ExpressionStatement,
  File,
  ForInStatement,
  ForOfStatement,
  ForStatement,
  FunctionDeclaration: FunctionExpression,
  FunctionExpression,
  FunctionTypeAnnotation,
  FunctionTypeParam,
  GenericTypeAnnotation: InterfaceExtends,
  Identifier,
  IfStatement,
  Import,
  ImportAttribute,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
  IndexedAccessType,
  InferredPredicate,
  InterfaceDeclaration,
  InterfaceExtends,
  InterfaceTypeAnnotation,
  InterpreterDirective,
  IntersectionTypeAnnotation,
  JSXAttribute,
  JSXClosingElement,
  JSXClosingFragment,
  JSXElement,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXFragment,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  JSXOpeningFragment,
  JSXSpreadAttribute,
  JSXSpreadChild,
  JSXText,
  LabeledStatement,
  LogicalExpression: AssignmentExpression,
  MemberExpression,
  MetaProperty,
  MixedTypeAnnotation,
  ModuleExpression,
  NewExpression,
  NullLiteral,
  NullLiteralTypeAnnotation,
  NullableTypeAnnotation,
  NumberLiteralTypeAnnotation: NumericLiteral,
  NumberTypeAnnotation,
  NumericLiteral,
  ObjectExpression,
  ObjectMethod,
  ObjectPattern: ObjectExpression,
  ObjectProperty,
  ObjectTypeAnnotation,
  ObjectTypeCallProperty,
  ObjectTypeIndexer,
  ObjectTypeInternalSlot,
  ObjectTypeProperty,
  ObjectTypeSpreadProperty,
  OpaqueType,
  OptionalCallExpression,
  OptionalIndexedAccessType,
  OptionalMemberExpression,
  ParenthesizedExpression,
  PipelineBareFunction,
  PipelinePrimaryTopicReference,
  PipelineTopicExpression,
  Placeholder,
  PrivateName,
  Program,
  QualifiedTypeIdentifier,
  RecordExpression,
  RegExpLiteral,
  RestElement,
  ReturnStatement,
  SequenceExpression,
  SpreadElement: RestElement,
  StaticBlock,
  StringLiteral,
  StringLiteralTypeAnnotation: StringLiteral,
  StringTypeAnnotation,
  Super,
  SwitchCase,
  SwitchStatement,
  SymbolTypeAnnotation,
  TSAnyKeyword,
  TSArrayType,
  TSAsExpression: TSTypeExpression,
  TSBigIntKeyword,
  TSBooleanKeyword,
  TSCallSignatureDeclaration,
  TSConditionalType,
  TSConstructSignatureDeclaration,
  TSConstructorType,
  TSDeclareFunction,
  TSDeclareMethod,
  TSEnumDeclaration,
  TSEnumMember,
  TSExportAssignment,
  TSExpressionWithTypeArguments,
  TSExternalModuleReference,
  TSFunctionType,
  TSImportEqualsDeclaration,
  TSImportType,
  TSIndexSignature,
  TSIndexedAccessType,
  TSInferType,
  TSInstantiationExpression,
  TSInterfaceBody,
  TSInterfaceDeclaration,
  TSIntersectionType,
  TSIntrinsicKeyword,
  TSLiteralType,
  TSMappedType,
  TSMethodSignature,
  TSModuleBlock,
  TSModuleDeclaration,
  TSNamedTupleMember,
  TSNamespaceExportDeclaration,
  TSNeverKeyword,
  TSNonNullExpression,
  TSNullKeyword,
  TSNumberKeyword,
  TSObjectKeyword,
  TSOptionalType,
  TSParameterProperty,
  TSParenthesizedType,
  TSPropertySignature,
  TSQualifiedName,
  TSRestType,
  TSSatisfiesExpression: TSTypeExpression,
  TSStringKeyword,
  TSSymbolKeyword,
  TSThisType,
  TSTupleType,
  TSTypeAliasDeclaration,
  TSTypeAnnotation,
  TSTypeAssertion,
  TSTypeLiteral,
  TSTypeOperator,
  TSTypeParameter,
  TSTypeParameterDeclaration: TSTypeParameterInstantiation,
  TSTypeParameterInstantiation,
  TSTypePredicate,
  TSTypeQuery,
  TSTypeReference,
  TSUndefinedKeyword,
  TSUnionType,
  TSUnknownKeyword,
  TSVoidKeyword,
  TaggedTemplateExpression,
  TemplateElement,
  TemplateLiteral,
  ThisExpression,
  ThisTypeAnnotation,
  ThrowStatement,
  TopicReference,
  TryStatement,
  TupleExpression,
  TupleTypeAnnotation,
  TypeAlias,
  TypeAnnotation,
  TypeCastExpression,
  TypeParameter,
  TypeParameterDeclaration: TypeParameterInstantiation,
  TypeParameterInstantiation,
  TypeofTypeAnnotation,
  UnaryExpression,
  UnionTypeAnnotation,
  UpdateExpression,
  V8IntrinsicIdentifier,
  VariableDeclaration,
  VariableDeclarator,
  Variance,
  VoidTypeAnnotation,
  WhileStatement,
  WithStatement,
  YieldExpression,
  _classMethodHead,
  _functionHead,
  _interfaceish,
  _methodHead,
  _param,
  _parameters,
  _params,
  _predicate,
  _printAttributes,
  _shouldPrintDecoratorsBeforeExport,
  _variance,
  tsPrintClassMemberModifiers,
  tsPrintFunctionOrConstructorType,
  tsPrintPropertyOrMethodName,
  tsPrintSignatureDeclarationBase,
  tsPrintTypeLiteralOrInterfaceBody
});

const { isFunction, isStatement, isClassBody, isTSInterfaceBody, isTSEnumDeclaration } = _t,
  SCIENTIFIC_NOTATION = /e/i,
  ZERO_DECIMAL_INTEGER = /\.0+$/,
  NON_DECIMAL_LITERAL = /^0[box]/,
  PURE_ANNOTATION_RE = /^\s*[@#]__PURE__\s*$/,
  HAS_NEWLINE = /[\n\r\u2028\u2029]/,
  HAS_BlOCK_COMMENT_END = /\*\//,
  { needsParens } = n;
// noinspection JSUnusedGlobalSymbols
class Printer {
  constructor(format, map) {
    this.inForStatementInitCounter = 0;
    this._printStack = [];
    this._indent = 0;
    this._indentChar = 0;
    this._indentRepeat = 0;
    this._insideAux = false;
    this._parenPushNewlineState = null;
    this._noLineTerminator = false;
    this._printAuxAfterOnNextUserNode = false;
    this._printedComments = new Set();
    this._endsWithInteger = false;
    this._endsWithWord = false;
    this._lastCommentLine = 0;
    this._endsWithInnerRaw = false;
    this._indentInnerComments = true;
    this.format = format;
    this._buf = new Buffer$1(map);
    this._indentChar = format.indent.style.charCodeAt(0);
    this._indentRepeat = format.indent.style.length;
    this._inputMap = map == null ? void 0 : map._inputMap;
  }
  generate(ast) {
    this.print(ast);
    this._maybeAddAuxComment();
    return this._buf.get();
  }
  indent() {
    this.format.compact || this.format.concise || this._indent++;
  }
  dedent() {
    this.format.compact || this.format.concise || this._indent--;
  }
  semicolon(force = false) {
    this._maybeAddAuxComment();
    force ? this._appendChar(59) : this._queue(59);

    this._noLineTerminator = false;
  }
  rightBrace(node) {
    this.format.minified && this._buf.removeLastSemicolon();

    this.sourceWithOffset("end", node.loc, -1);
    this.tokenChar(125);
  }
  rightParens(node) {
    this.sourceWithOffset("end", node.loc, -1);
    this.tokenChar(41);
  }
  space(force = false) {
    if (this.format.compact) return;
    if (force) this._space();
    else if (this._buf.hasContent()) {
      const lastCp = this.getLastChar();
      lastCp === 32 || lastCp === 10 || this._space();
    }
  }
  word(str, noLineTerminatorAfter = false) {
    this._maybePrintInnerComments();
    if (this._endsWithWord || (str.charCodeAt(0) === 47 && this.endsWith(47))) this._space();

    this._maybeAddAuxComment();
    this._append(str, false);
    this._endsWithWord = true;
    this._noLineTerminator = noLineTerminatorAfter;
  }
  number(str) {
    this.word(str);
    this._endsWithInteger =
      Number.isInteger(+str) &&
      !NON_DECIMAL_LITERAL.test(str) &&
      !SCIENTIFIC_NOTATION.test(str) &&
      !ZERO_DECIMAL_INTEGER.test(str) &&
      str.charCodeAt(str.length - 1) !== 46;
  }
  token(str, maybeNewline = false) {
    this._maybePrintInnerComments();
    const lastChar = this.getLastChar(),
      strFirst = str.charCodeAt(0);

    ((lastChar === 33 && (str === "--" || strFirst === 61)) ||
      (strFirst === 43 && lastChar === 43) ||
      (strFirst === 45 && lastChar === 45) ||
      (strFirst === 46 && this._endsWithInteger)) &&
      this._space();

    this._maybeAddAuxComment();
    this._append(str, maybeNewline);
    this._noLineTerminator = false;
  }
  tokenChar(char) {
    this._maybePrintInnerComments();
    const lastChar = this.getLastChar();
    if ((char === 43 && lastChar === 43) || (char === 45 && lastChar === 45) || (char === 46 && this._endsWithInteger))
      this._space();

    this._maybeAddAuxComment();
    this._appendChar(char);
    this._noLineTerminator = false;
  }
  newline(i = 1, force) {
    if (i <= 0) return;
    if (!force) {
      if (this.format.retainLines || this.format.compact) return;
      if (this.format.concise) {
        this.space();
        return;
      }
    }
    if (i > 2) i = 2;
    i -= this._buf.getNewlineCount();
    for (let j = 0; j < i; j++) this._newline();
  }
  endsWith(char) {
    return this.getLastChar() === char;
  }
  getLastChar() {
    return this._buf.getLastChar();
  }
  endsWithCharAndNewline() {
    return this._buf.endsWithCharAndNewline();
  }
  removeTrailingNewline() {
    this._buf.removeTrailingNewline();
  }
  exactSource(loc, cb) {
    if (loc) {
      this._catchUp("start", loc);
      this._buf.exactSource(loc, cb);
    } else cb();
  }
  source(prop, loc) {
    if (!loc) return;
    this._catchUp(prop, loc);
    this._buf.source(prop, loc);
  }
  sourceWithOffset(prop, loc, columnOffset) {
    if (!loc) return;
    this._catchUp(prop, loc);
    this._buf.sourceWithOffset(prop, loc, columnOffset);
  }
  withSource(prop, loc, cb) {
    if (loc) {
      this._catchUp(prop, loc);
      this._buf.withSource(prop, loc, cb);
    } else cb();
  }
  sourceIdentifierName(identifierName, pos) {
    if (!this._buf._canMarkIdName) return;
    const sourcePosition = this._buf._sourcePosition;
    sourcePosition.identifierNamePos = pos;
    sourcePosition.identifierName = identifierName;
  }
  _space() {
    this._queue(32);
  }
  _newline() {
    this._queue(10);
  }
  _append(str, maybeNewline) {
    this._maybeAddParen(str);
    this._maybeIndent(str.charCodeAt(0));
    this._buf.append(str, maybeNewline);
    this._endsWithWord = false;
    this._endsWithInteger = false;
  }
  _appendChar(char) {
    this._maybeAddParenChar(char);
    this._maybeIndent(char);
    this._buf.appendChar(char);
    this._endsWithWord = false;
    this._endsWithInteger = false;
  }
  _queue(char) {
    this._maybeAddParenChar(char);
    this._maybeIndent(char);
    this._buf.queue(char);
    this._endsWithWord = false;
    this._endsWithInteger = false;
  }
  _maybeIndent(firstChar) {
    this._indent && firstChar !== 10 && this.endsWith(10) &&
      this._buf.queueIndentation(this._indentChar, this._getIndent());
  }
  _shouldIndent(firstChar) {
    if (this._indent && firstChar !== 10 && this.endsWith(10)) return true;
  }
  _maybeAddParenChar(char) {
    const parenPushNewlineState = this._parenPushNewlineState;
    if (!parenPushNewlineState || char === 32) return;

    if (char === 10) {
      this.tokenChar(40);
      this.indent();
      parenPushNewlineState.printed = true;
    } else this._parenPushNewlineState = null;
  }
  _maybeAddParen(str) {
    const parenPushNewlineState = this._parenPushNewlineState;
    if (!parenPushNewlineState) return;
    const len = str.length;
    let i;
    for (i = 0; i < len && str.charCodeAt(i) === 32; i++); //continue
    if (i === len) return;

    const cha = str.charCodeAt(i);
    if (cha !== 10) {
      if (cha !== 47 || i + 1 === len) {
        this._parenPushNewlineState = null;
        return;
      }
      const chaPost = str.charCodeAt(i + 1);
      if (chaPost === 42) {
        if (PURE_ANNOTATION_RE.test(str.slice(i + 2, len - 2))) return;
      } else if (chaPost !== 47) {
        this._parenPushNewlineState = null;
        return;
      }
    }
    this.tokenChar(40);
    this.indent();
    parenPushNewlineState.printed = true;
  }
  catchUp(line) {
    if (!this.format.retainLines) return;
    const count = line - this._buf.getCurrentLine();
    for (let i = 0; i < count; i++) this._newline();
  }
  _catchUp(prop, loc) {
    var _loc$prop;
    if (!this.format.retainLines) return;
    const line = loc == null || (_loc$prop = loc[prop]) == null ? void 0 : _loc$prop.line;
    if (line != null) {
      const count = line - this._buf.getCurrentLine();
      for (let i = 0; i < count; i++) this._newline();
    }
  }
  _getIndent() {
    return this._indentRepeat * this._indent;
  }
  printTerminatorless(node, parent, isLabel) {
    if (isLabel) {
      this._noLineTerminator = true;
      this.print(node, parent);
    } else {
      const terminatorState = { printed: false };
      this._parenPushNewlineState = terminatorState;
      this.print(node, parent);
      if (terminatorState.printed) {
        this.dedent();
        this.newline();
        this.tokenChar(41);
      }
    }
  }
  print(node, parent, noLineTerminatorAfter, trailingCommentsLineOffset, forceParens) {
    var _node$extra;
    if (!node) return;
    this._endsWithInnerRaw = false;
    const nodeType = node.type,
      format = this.format,
      oldConcise = format.concise;
    if (node._compact) format.concise = true;

    const printMethod = this[nodeType];
    if (printMethod === void 0)
      throw new ReferenceError(
        `unknown node of type ${JSON.stringify(nodeType)} with constructor ${JSON.stringify(node.constructor.name)}`
      );

    this._printStack.push(node);
    const oldInAux = this._insideAux;
    this._insideAux = node.loc == null;
    this._maybeAddAuxComment(this._insideAux && !oldInAux);
    const shouldPrintParens =
      forceParens ||
      (format.retainFunctionParens &&
        nodeType === "FunctionExpression" &&
        ((_node$extra = node.extra) == null ? void 0 : _node$extra.parenthesized)) ||
      needsParens(node, parent, this._printStack);
    if (shouldPrintParens) {
      this.tokenChar(40);
      this._endsWithInnerRaw = false;
    }
    this._lastCommentLine = 0;
    this._printLeadingComments(node, parent);
    const loc = nodeType === "Program" || nodeType === "File" ? null : node.loc;
    this.exactSource(loc, printMethod.bind(this, node, parent));
    if (shouldPrintParens) {
      this._printTrailingComments(node, parent);
      this.tokenChar(41);
      this._noLineTerminator = noLineTerminatorAfter;
    } else if (noLineTerminatorAfter && !this._noLineTerminator) {
      this._noLineTerminator = true;
      this._printTrailingComments(node, parent);
    } else this._printTrailingComments(node, parent, trailingCommentsLineOffset);

    this._printStack.pop();
    format.concise = oldConcise;
    this._insideAux = oldInAux;
    this._endsWithInnerRaw = false;
  }
  _maybeAddAuxComment(enteredPositionlessNode) {
    enteredPositionlessNode && this._printAuxBeforeComment();
    this._insideAux || this._printAuxAfterComment();
  }
  _printAuxBeforeComment() {
    if (this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = true;
    const comment = this.format.auxiliaryCommentBefore;
    comment && this._printComment({ type: "CommentBlock", value: comment }, 0);
  }
  _printAuxAfterComment() {
    if (!this._printAuxAfterOnNextUserNode) return;
    this._printAuxAfterOnNextUserNode = false;
    const comment = this.format.auxiliaryCommentAfter;
    comment && this._printComment({ type: "CommentBlock", value: comment }, 0);
  }
  getPossibleRaw(node) {
    const extra = node.extra;
    if ((extra == null ? void 0 : extra.raw) != null && extra.rawValue != null && node.value === extra.rawValue)
      return extra.raw;
  }
  printJoin(nodes, parent, opts = {}) {
    if (nodes == null || !nodes.length) return;
    let { indent } = opts;
    if (indent == null && this.format.retainLines) {
      var _nodes$0$loc;
      const startLine = (_nodes$0$loc = nodes[0].loc) == null ? void 0 : _nodes$0$loc.start.line;
      if (startLine != null && startLine !== this._buf.getCurrentLine()) indent = true;
    }
    indent && this.indent();
    const newlineOpts = { addNewlines: opts.addNewlines, nextNodeStartLine: 0 },
      separator = opts.separator ? opts.separator.bind(this) : null,
      len = nodes.length;
    for (let i = 0; i < len; i++) {
      const node = nodes[i];
      if (!node) continue;
      opts.statement && this._printNewline(i === 0, newlineOpts);
      this.print(node, parent, void 0, opts.trailingCommentsLineOffset || 0);
      opts.iterator == null || opts.iterator(node, i);
      if (i < len - 1) separator == null || separator();
      if (opts.statement)
        if (i + 1 === len) this.newline(1);
        else {
          var _nextNode$loc;
          const nextNode = nodes[i + 1];
          newlineOpts.nextNodeStartLine =
            ((_nextNode$loc = nextNode.loc) == null ? void 0 : _nextNode$loc.start.line) || 0;
          this._printNewline(true, newlineOpts);
        }
    }
    indent && this.dedent();
  }
  printAndIndentOnComments(node, parent) {
    const indent = node.leadingComments && node.leadingComments.length > 0;
    indent && this.indent();
    this.print(node, parent);
    indent && this.dedent();
  }
  printBlock(parent) {
    const node = parent.body;
    node.type === "EmptyStatement" || this.space();

    this.print(node, parent);
  }
  _printTrailingComments(node, parent, lineOffset) {
    const { innerComments, trailingComments } = node;
    innerComments != null && innerComments.length &&
      this._printComments(2, innerComments, node, parent, lineOffset);

    trailingComments != null && trailingComments.length &&
      this._printComments(2, trailingComments, node, parent, lineOffset);
  }
  _printLeadingComments(node, parent) {
    const comments = node.leadingComments;
    comments != null && comments.length && this._printComments(0, comments, node, parent);
  }
  _maybePrintInnerComments() {
    this._endsWithInnerRaw && this.printInnerComments();
    this._endsWithInnerRaw = true;
    this._indentInnerComments = true;
  }
  printInnerComments() {
    const node = this._printStack[this._printStack.length - 1],
      comments = node.innerComments;
    if (comments == null || !comments.length) return;
    const hasSpace = this.endsWith(32),
      indent = this._indentInnerComments,
      printedCommentsCount = this._printedComments.size;
    indent && this.indent();
    this._printComments(1, comments, node);
    hasSpace && printedCommentsCount !== this._printedComments.size && this.space();

    indent && this.dedent();
  }
  noIndentInnerCommentsHere() {
    this._indentInnerComments = false;
  }
  printSequence(nodes, parent, opts = {}) {
    opts.statement = true;
    opts.indent != null || (opts.indent = false);
    this.printJoin(nodes, parent, opts);
  }
  printList(items, parent, opts = {}) {
    if (opts.separator == null) opts.separator = commaSeparator;

    this.printJoin(items, parent, opts);
  }
  _printNewline(newLine, opts) {
    const format = this.format;
    if (format.retainLines || format.compact) return;
    if (format.concise) {
      this.space();
      return;
    }
    if (!newLine) return;

    const startLine = opts.nextNodeStartLine,
      lastCommentLine = this._lastCommentLine;
    if (startLine > 0 && lastCommentLine > 0) {
      const offset = startLine - lastCommentLine;
      if (offset >= 0) {
        this.newline(offset || 1);
        return;
      }
    }
    this._buf.hasContent() && this.newline(1);
  }
  _shouldPrintComment(comment) {
    if (comment.ignore || this._printedComments.has(comment)) return 0;

    if (this._noLineTerminator && (HAS_NEWLINE.test(comment.value) || HAS_BlOCK_COMMENT_END.test(comment.value)))
      return 2;

    this._printedComments.add(comment);
    return this.format.shouldPrintComment(comment.value) ? 1 : 0;
  }
  _printComment(comment, skipNewLines) {
    const noLineTerminator = this._noLineTerminator,
      isBlockComment = comment.type === "CommentBlock",
      printNewLines = isBlockComment && skipNewLines !== 1 && !this._noLineTerminator;
    printNewLines && this._buf.hasContent() && skipNewLines !== 2 && this.newline(1);

    const lastCharCode = this.getLastChar();
    lastCharCode === 91 || lastCharCode === 123 || this.space();

    let val;
    if (isBlockComment) {
      val = `/*${comment.value}*/`;
      if (this.format.indent.adjustMultilineComment) {
        var _comment$loc;
        const offset = (_comment$loc = comment.loc) == null ? void 0 : _comment$loc.start.column;
        if (offset) {
          const newlineRegex = new RegExp("\\n\\s{1," + offset + "}", "g");
          val = val.replace(newlineRegex, "\n");
        }
        let indentSize = this.format.retainLines ? 0 : this._buf.getCurrentColumn();
        if (this._shouldIndent(47) || this.format.retainLines) indentSize += this._getIndent();

        val = val.replace(/\n(?!$)/g, "\n" + " ".repeat(indentSize));
      }
    } else val = noLineTerminator ? `/*${comment.value}*/` : "//" + comment.value;

    this.endsWith(47) && this._space();
    this.source("start", comment.loc);
    this._append(val, isBlockComment);
    isBlockComment || noLineTerminator || this.newline(1, true);

    printNewLines && skipNewLines !== 3 && this.newline(1);
  }
  _printComments(type, comments, node, parent, lineOffset = 0) {
    const nodeLoc = node.loc,
      len = comments.length;
    let hasLoc = !!nodeLoc;
    const nodeStartLine = hasLoc ? nodeLoc.start.line : 0,
      nodeEndLine = hasLoc ? nodeLoc.end.line : 0;
    let lastLine = 0,
      leadingCommentNewline = 0;
    const maybeNewline = this._noLineTerminator ? function () {} : this.newline.bind(this);
    for (let i = 0; i < len; i++) {
      const comment = comments[i],
        shouldPrint = this._shouldPrintComment(comment);
      if (shouldPrint === 2) {
        hasLoc = false;
        break;
      }
      if (hasLoc && comment.loc && shouldPrint === 1) {
        const commentStartLine = comment.loc.start.line,
          commentEndLine = comment.loc.end.line;
        if (type === 0) {
          let offset = 0;
          i === 0
            ? !this._buf.hasContent() || (comment.type !== "CommentLine" && commentStartLine == commentEndLine) ||
              (offset = leadingCommentNewline = 1)
            : (offset = commentStartLine - lastLine);

          lastLine = commentEndLine;
          maybeNewline(offset);
          this._printComment(comment, 1);
          if (i + 1 === len) {
            maybeNewline(Math.max(nodeStartLine - lastLine, leadingCommentNewline));
            lastLine = nodeStartLine;
          }
        } else if (type === 1) {
          const offset = commentStartLine - (i === 0 ? nodeStartLine : lastLine);
          lastLine = commentEndLine;
          maybeNewline(offset);
          this._printComment(comment, 1);
          if (i + 1 === len) {
            maybeNewline(Math.min(1, nodeEndLine - lastLine));
            lastLine = nodeEndLine;
          }
        } else {
          const offset = commentStartLine - (i === 0 ? nodeEndLine - lineOffset : lastLine);
          lastLine = commentEndLine;
          maybeNewline(offset);
          this._printComment(comment, 1);
        }
      } else {
        hasLoc = false;
        if (shouldPrint !== 1) continue;

        if (len === 1) {
          const singleLine = comment.loc
            ? comment.loc.start.line === comment.loc.end.line
            : !HAS_NEWLINE.test(comment.value);
          const shouldSkipNewline =
            singleLine &&
            !isStatement(node) &&
            !isClassBody(parent) &&
            !isTSInterfaceBody(parent) &&
            !isTSEnumDeclaration(parent);
          type === 0
            ? this._printComment(
                comment,
                (shouldSkipNewline && node.type !== "ObjectExpression") ||
                  (singleLine && isFunction(parent, { body: node }))
                  ? 1 : 0
              )
            : shouldSkipNewline && type === 2
            ? this._printComment(comment, 1)
            : this._printComment(comment, 0);
        } else
          type !== 1 ||
          (node.type === "ObjectExpression" && node.properties.length > 1) ||
          node.type === "ClassBody" ||
          node.type === "TSInterfaceBody"
            ? this._printComment(comment, 0)
            : this._printComment(comment, i === 0 ? 2 : i === len - 1 ? 3 : 0);
      }
    }
    if (type === 2 && hasLoc && lastLine) this._lastCommentLine = lastLine;
  }
}
Object.assign(Printer.prototype, generatorFunctions);
Printer.prototype.Noop = function () {};

function commaSeparator() {
  this.tokenChar(44);
  this.space();
}

class Generator extends Printer {
  constructor(ast, opts = {}, code) {
    super(normalizeOptions(code, opts), opts.sourceMaps ? new SourceMap(opts, code) : null);
    this.ast = void 0;
    this.ast = ast;
  }
  generate() {
    return super.generate(this.ast);
  }
}
function normalizeOptions(code, /** Object.<string, *> */ opts) {
  var _opts$recordAndTupleS;
  const format = {
    auxiliaryCommentBefore: opts.auxiliaryCommentBefore,
    auxiliaryCommentAfter: opts.auxiliaryCommentAfter,
    shouldPrintComment: opts.shouldPrintComment,
    retainLines: opts.retainLines,
    retainFunctionParens: opts.retainFunctionParens,
    comments: opts.comments == null || opts.comments,
    compact: opts.compact,
    minified: opts.minified,
    concise: opts.concise,
    indent: { adjustMultilineComment: true, style: "  " },
    jsescOption: Object.assign({ quotes: "double", wrap: true, minimal: false }, opts.jsescOption),
    recordAndTupleSyntaxType:
      (_opts$recordAndTupleS = opts.recordAndTupleSyntaxType) != null ? _opts$recordAndTupleS : "hash",
    topicToken: opts.topicToken,
    importAttributesKeyword: opts.importAttributesKeyword
  };

  format.decoratorsBeforeExport = opts.decoratorsBeforeExport;
  format.jsescOption.json = opts.jsonCompatibleStrings;

  if (format.minified) {
    format.compact = true;
    format.shouldPrintComment = format.shouldPrintComment || (() => format.comments);
  } else
    format.shouldPrintComment =
      format.shouldPrintComment ||
      (value => format.comments || value.includes("@license") || value.includes("@preserve"));

  if (format.compact === "auto") {
    format.compact = typeof code == "string" && code.length > 500000;
    format.compact &&
      console.error(
        `[BABEL] Note: The code generator has deoptimised the styling of ${opts.filename} as it exceeds the max of 500KB.`
      );
  }
  if (format.compact) format.indent.adjustMultilineComment = false;

  const { auxiliaryCommentBefore, auxiliaryCommentAfter, shouldPrintComment } = format;
  if (auxiliaryCommentBefore && !shouldPrintComment(auxiliaryCommentBefore)) format.auxiliaryCommentBefore = void 0;

  if (auxiliaryCommentAfter && !shouldPrintComment(auxiliaryCommentAfter)) format.auxiliaryCommentAfter = void 0;

  return format;
}
class CodeGenerator {
  constructor(ast, opts, code) {
    this._generator = void 0;
    this._generator = new Generator(ast, opts, code);
  }
  generate() {
    return this._generator.generate();
  }
}
function generate(ast, opts, code) {
  return new Generator(ast, opts, code).generate();
}

exports = module.exports = generate;
exports.CodeGenerator = CodeGenerator;
exports.default = generate;

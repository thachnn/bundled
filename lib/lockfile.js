'use strict';

var util = require('util'),
  fs = require('fs'),
  path = require('path'),
  Buffer = require('buffer').Buffer;

function sortAlpha(a, b) {
  const shortLen = Math.min(a.length, b.length);
  for (let i = 0; i < shortLen; i++) {
    const aChar = a.charCodeAt(i),
      bChar = b.charCodeAt(i);
    if (aChar !== bChar) return aChar - bChar;
  }
  return a.length - b.length;
}

function normalizePattern(pattern) {
  let hasVersion = false,
    range = 'latest',
    name = pattern,

    isScoped = false;
  if (name[0] === '@') {
    isScoped = true;
    name = name.slice(1);
  }

  const parts = name.split('@');
  if (parts.length > 1) {
    name = parts.shift();
    range = parts.join('@');

    range ? (hasVersion = true) : (range = '*');
  }

  if (isScoped) name = '@' + name;

  return {name, range, hasVersion};
}

var NODE_ENV = process.env.NODE_ENV;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production' && format === void 0)
    throw new Error('invariant requires an error message argument');

  if (!condition) {
    var error;
    if (format === void 0)
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
      );
    else {
      var args = [a, b, c, d, e, f],
        argIndex = 0;
      (error = new Error(format.replace(/%s/g, () => args[argIndex++]))).name = 'Invariant Violation';
    }

    error.framesToPop = 1;
    throw error;
  }
};

var stripBOM = x => {
  if (typeof x != 'string') throw new TypeError('Expected a string, got ' + typeof x);

  return x.charCodeAt(0) === 0xFEFF ? x.slice(1) : x;
};

const LOCKFILE_VERSION = 1,
  LOCKFILE_FILENAME = 'yarn.lock';

class MessageError extends Error {
  constructor(msg, code) {
    super(msg);
    this.code = code;
  }
}

function nullify(obj) {
  obj !== void 0 || (obj = {});

  if (Array.isArray(obj)) for (const item of obj) nullify(item);
  else if ((obj !== null && typeof obj == 'object') || typeof obj == 'function') {
    Object.setPrototypeOf(obj, null);

    if (typeof obj == 'object') for (const key in obj) nullify(obj[key]);
  }

  return obj;
}

function isNothing(subject) {
  return subject === void 0 || subject === null;
}

function isObject(subject) {
  return typeof subject == 'object' && subject !== null;
}

function toArray(sequence) {
  return Array.isArray(sequence) ? sequence : isNothing(sequence) ? [] : [sequence];
}

function extend(target, source) {
  var key, sourceKeys;

  if (source)
    for (var index = 0, length = (sourceKeys = Object.keys(source)).length; index < length; index++)
      target[(key = sourceKeys[index])] = source[key];

  return target;
}

function repeat(string, count) {
  var result = '';

  for (var cycle = 0; cycle < count; cycle++) result += string;

  return result;
}

function YAMLException(reason, mark) {
  Error.call(this);

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');

  Error.captureStackTrace
    ? Error.captureStackTrace(this, this.constructor)
    : (this.stack = new Error().stack || '');
}

YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;

YAMLException.prototype.toString = function (compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) result += ' ' + this.mark.toString();

  return result;
};

function Mark(name, buffer, position, line, column) {
  this.name = name;
  this.buffer = buffer;
  this.position = position;
  this.line = line;
  this.column = column;
}

Mark.prototype.getSnippet = function (indent, maxLength) {
  if (!this.buffer) return null;

  indent = indent || 4;
  maxLength = maxLength || 75;

  var head = '',
    start = this.position;

  while (start > 0 && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) < 0) {
    start -= 1;
    if (this.position - start > maxLength / 2 - 1) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  var tail = '',
    end = this.position;

  while (end < this.buffer.length && '\0\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) < 0)
    if ((end += 1) - this.position > maxLength / 2 - 1) {
      tail = ' ... ';
      end -= 5;
      break;
    }

  var snippet = this.buffer.slice(start, end);

  return (
    repeat(' ', indent) + head + snippet + tail + '\n' +
    repeat(' ', indent + this.position - start + head.length) + '^'
  );
};

Mark.prototype.toString = function (compact) {
  var snippet, where = '';

  if (this.name) where += 'in "' + this.name + '" ';

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact && (snippet = this.getSnippet())) where += ':\n' + snippet;

  return where;
};

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases',
];

var YAML_NODE_KINDS = ['scalar', 'sequence', 'mapping'];

function compileStyleAliases(map) {
  var result = {};

  map === null ||
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) < 0)
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
  });

  this.tag = tag;
  this.kind = options.kind || null;
  this.resolve = options.resolve || (() => true);
  this.construct = options.construct || (data => data);
  this.instanceOf = options.instanceOf || null;
  this.predicate = options.predicate || null;
  this.represent = options.represent || null;
  this.defaultStyle = options.defaultStyle || null;
  this.styleAliases = compileStyleAliases(options.styleAliases || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) < 0)
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
}

function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      previousType.tag === currentType.tag && previousType.kind === currentType.kind &&
        exclude.push(previousIndex);
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return exclude.indexOf(index) < 0;
  });
}

function compileMap() {
  var result = {scalar: {}, sequence: {}, mapping: {}, fallback: {}};

  function collectType(type) {
    result[type.kind][type.tag] = result.fallback[type.tag] = type;
  }

  for (var index = 0, length = arguments.length; index < length; index++)
    arguments[index].forEach(collectType);

  return result;
}

function Schema(definition) {
  this.include = definition.include || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && type.loadKind !== 'scalar')
      throw new YAMLException(
        'There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.'
      );
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap = compileMap(this.compiledImplicit, this.compiledExplicit);
}

Schema.DEFAULT = null;

Schema.create = function () {
  var schemas, types;

  switch (arguments.length) {
    case 1:
      schemas = Schema.DEFAULT;
      types = arguments[0];
      break;

    case 2:
      schemas = arguments[0];
      types = arguments[1];
      break;

    default:
      throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = toArray(schemas);
  types = toArray(types);

  if (!schemas.every(schema => schema instanceof Schema))
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');

  if (!types.every(type => type instanceof Type))
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');

  return new Schema({include: schemas, explicit: types});
};

var FAILSAFE_SCHEMA = new Schema({
  explicit: [
    new Type('tag:yaml.org,2002:str', {
      kind: 'scalar',
      construct: data => (data !== null ? data : ''),
    }),
    new Type('tag:yaml.org,2002:seq', {
      kind: 'sequence',
      construct: data => (data !== null ? data : []),
    }),
    new Type('tag:yaml.org,2002:map', {
      kind: 'mapping',
      construct: data => (data !== null ? data : {}),
    }),
  ],
});

var _hasOwnProperty = Object.prototype.hasOwnProperty,

  CONTEXT_FLOW_IN = 1,
  CONTEXT_FLOW_OUT = 2,
  CONTEXT_BLOCK_IN = 3,
  CONTEXT_BLOCK_OUT = 4,

  CHOMPING_CLIP = 1,
  CHOMPING_STRIP = 2,
  CHOMPING_KEEP = 3,

  PATTERN_NON_PRINTABLE =
    /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,
  PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/,
  PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/,
  PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i,
  PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;

function _class(obj) {
  return Object.prototype.toString.call(obj);
}

function is_EOL(c) {
  return c === 0x0A || c === 0x0D;
}

function is_WHITE_SPACE(c) {
  return c === 0x09 || c === 0x20;
}

function is_WS_OR_EOL(c) {
  return c === 0x09 || c === 0x20 || c === 0x0A || c === 0x0D;
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C || c === 0x5B || c === 0x5D || c === 0x7B || c === 0x7D;
}

function fromHexCode(c) {
  var lc;
  return 0x30 <= c && c <= 0x39 ? c - 0x30 : 0x61 <= (lc = c | 0x20) && lc <= 0x66 ? lc - 0x61 + 10 : -1;
}

function escapedHexLen(c) {
  return c === 0x78 ? 2 : c === 0x75 ? 4 : c === 0x55 ? 8 : 0;
}

function fromDecimalCode(c) {
  return 0x30 <= c && c <= 0x39 ? c - 0x30 : -1;
}

function simpleEscapeSequence(c) {
  return c === 0x30 ? '\0'
    : c === 0x61 ? '\x07'
    : c === 0x62 ? '\b'
    : c === 0x74 || c === 0x09 ? '\t'
    : c === 0x6E ? '\n'
    : c === 0x76 ? '\v'
    : c === 0x66 ? '\f'
    : c === 0x72 ? '\r'
    : c === 0x65 ? '\x1B'
    : c === 0x20 ? ' '
    : c === 0x22 ? '"'
    : c === 0x2F ? '/'
    : c === 0x5C ? '\\'
    : c === 0x4E ? '\x85'
    : c === 0x5F ? '\xA0'
    : c === 0x4C ? '\u2028'
    : c === 0x50 ? '\u2029' : '';
}

function charFromCodepoint(c) {
  return c <= 0xFFFF
    ? String.fromCharCode(c)
    : String.fromCharCode(0xD800 + ((c - 0x010000) >> 10), 0xDC00 + ((c - 0x010000) & 0x03FF));
}

var simpleEscapeCheck = new Array(256),
  simpleEscapeMap = new Array(256);
for (let i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}

function State(input, options) {
  this.input = input;

  this.filename = options.filename || null;
  this.schema = options.schema || FAILSAFE_SCHEMA;
  this.onWarning = options.onWarning || null;
  this.legacy = options.legacy || false;
  this.json = options.json || false;
  this.listener = options.listener || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap = this.schema.compiledTypeMap;

  this.length = input.length;
  this.position = 0;
  this.line = 0;
  this.lineStart = 0;
  this.lineIndent = 0;

  this.documents = [];
}

function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, state.position - state.lineStart)
  );
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  state.onWarning && state.onWarning.call(null, generateError(state, message));
}

var directiveHandlers = {
  YAML: function (state, name, args) {
    state.version === null || throwError(state, 'duplication of %YAML directive');

    args.length === 1 || throwError(state, 'YAML directive accepts exactly one argument');

    var match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    match !== null || throwError(state, 'ill-formed argument of the YAML directive');

    var major = parseInt(match[1], 10),
      minor = parseInt(match[2], 10);

    major === 1 || throwError(state, 'unacceptable YAML version of the document');

    state.version = args[0];
    state.checkLineBreaks = minor < 2;

    minor === 1 || minor === 2 || throwWarning(state, 'unsupported YAML version of the document');
  },

  TAG: function (state, name, args) {
    args.length === 2 || throwError(state, 'TAG directive accepts exactly two arguments');

    var handle = args[0],
      prefix = args[1];

    PATTERN_TAG_HANDLE.test(handle) ||
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');

    _hasOwnProperty.call(state.tagMap, handle) &&
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');

    PATTERN_TAG_URI.test(prefix) ||
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');

    state.tagMap[handle] = prefix;
  },
};

function captureSegment(state, start, end, checkJson) {
  if (start < end) {
    var _result = state.input.slice(start, end);

    if (checkJson)
      for (var _character, _position = 0, _length = _result.length; _position < _length; _position++)
        (_character = _result.charCodeAt(_position)) === 0x09 ||
          (0x20 <= _character && _character <= 0x10FFFF) ||
          throwError(state, 'expected valid JSON character');
    else
      PATTERN_NON_PRINTABLE.test(_result) && throwError(state, 'the stream contains non-printable characters');

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  isObject(source) || throwError(state, 'cannot merge mappings; the provided source object is unacceptable');

  var sourceKeys = Object.keys(source);

  for (var index = 0, quantity = sourceKeys.length; index < quantity; index++) {
    var key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startPos) {
  var index, quantity;

  if (Array.isArray(keyNode))
    for (index = 0, quantity = (keyNode = Array.prototype.slice.call(keyNode)).length; index < quantity; index++) {
      Array.isArray(keyNode[index]) && throwError(state, 'nested arrays are not supported inside keys');

      if (typeof keyNode == 'object' && _class(keyNode[index]) === '[object Object]')
        keyNode[index] = '[object Object]';
    }

  if (typeof keyNode == 'object' && _class(keyNode) === '[object Object]') keyNode = '[object Object]';

  keyNode = String(keyNode);

  if (_result === null) _result = {};

  if (keyTag === 'tag:yaml.org,2002:merge')
    if (Array.isArray(valueNode))
      for (index = 0, quantity = valueNode.length; index < quantity; index++)
        mergeMappings(state, _result, valueNode[index], overridableKeys);
    else mergeMappings(state, _result, valueNode, overridableKeys);
  else {
    if (!state.json && !_hasOwnProperty.call(overridableKeys, keyNode) && _hasOwnProperty.call(_result, keyNode)) {
      state.line = startLine || state.line;
      state.position = startPos || state.position;
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A) state.position++;
  else if (ch === 0x0D) {
    state.position++;
    state.input.charCodeAt(state.position) !== 0x0A || state.position++;
  } else throwError(state, 'a line break is expected');

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0;

  for (var ch = state.input.charCodeAt(state.position); ch !== 0; ) {
    while (is_WHITE_SPACE(ch)) ch = state.input.charCodeAt(++state.position);

    if (allowComments && ch === 0x23)
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A && ch !== 0x0D && ch !== 0);

    if (!is_EOL(ch)) break;

    readLineBreak(state);

    ch = state.input.charCodeAt(state.position);
    lineBreaks++;
    state.lineIndent = 0;

    while (ch === 0x20) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }
  }

  checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent &&
    throwWarning(state, 'deficient indentation');

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,

    ch = state.input.charCodeAt(_position);

  if (
    (ch === 0x2D || ch === 0x2E) &&
    ch === state.input.charCodeAt(_position + 1) &&
    ch === state.input.charCodeAt(_position + 2)
  ) {
    _position += 3;

    if ((ch = state.input.charCodeAt(_position)) === 0 || is_WS_OR_EOL(ch)) return true;
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) state.result += ' ';
  else if (count > 1) state.result += repeat('\n', count - 1);
}

function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var following,
    captureStart,
    captureEnd,
    hasPendingContent,
    _line,
    _lineStart,
    _lineIndent,
    _kind = state.kind,
    _result = state.result,

    ch = state.input.charCodeAt(state.position);

  if (
    is_WS_OR_EOL(ch) ||
    is_FLOW_INDICATOR(ch) ||
    ch === 0x23 ||
    ch === 0x26 ||
    ch === 0x2A ||
    ch === 0x21 ||
    ch === 0x7C ||
    ch === 0x3E ||
    ch === 0x27 ||
    ch === 0x22 ||
    ch === 0x25 ||
    ch === 0x40 ||
    ch === 0x60
  )
    return false;

  if ((ch === 0x3F || ch === 0x2D) && (
    is_WS_OR_EOL((following = state.input.charCodeAt(state.position + 1))) ||
    (withinFlowCollection && is_FLOW_INDICATOR(following))
  ))
    return false;

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A) {
      if (
        is_WS_OR_EOL((following = state.input.charCodeAt(state.position + 1))) ||
        (withinFlowCollection && is_FLOW_INDICATOR(following))
      )
        break;
    } else if (ch === 0x23) {
      if (is_WS_OR_EOL(state.input.charCodeAt(state.position - 1))) break;
    } else if (
      (state.position === state.lineStart && testDocumentSeparator(state)) ||
      (withinFlowCollection && is_FLOW_INDICATOR(ch))
    )
      break;
    else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      }

      state.position = captureEnd;
      state.line = _line;
      state.lineStart = _lineStart;
      state.lineIndent = _lineIndent;
      break;
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    is_WHITE_SPACE(ch) || (captureEnd = state.position + 1);

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) return true;

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch, captureStart, captureEnd;

  if ((ch = state.input.charCodeAt(state.position)) !== 0x27) return false;

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0)
    if (ch === 0x27) {
      captureSegment(state, captureStart, state.position, true);

      if ((ch = state.input.charCodeAt(++state.position)) !== 0x27) return true;

      captureStart = state.position;
      state.position++;
      captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state))
      throwError(state, 'unexpected end of the document within a single quoted scalar');
    else {
      state.position++;
      captureEnd = state.position;
    }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart, captureEnd, hexLength, hexResult, tmp, ch;

  if ((ch = state.input.charCodeAt(state.position)) !== 0x22) return false;

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;
    }
    if (ch === 0x5C) {
      captureSegment(state, captureStart, state.position, true);

      if (is_EOL((ch = state.input.charCodeAt(++state.position))))
        skipSeparationSpace(state, false, nodeIndent);
      else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;
      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--)
          (tmp = fromHexCode((ch = state.input.charCodeAt(++state.position)))) >= 0
            ? (hexResult = (hexResult << 4) + tmp)
            : throwError(state, 'expected hexadecimal character');

        state.result += charFromCodepoint(hexResult);

        state.position++;
      } else throwError(state, 'unknown escape sequence');

      captureStart = captureEnd = state.position;
    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;
    } else if (state.position === state.lineStart && testDocumentSeparator(state))
      throwError(state, 'unexpected end of the document within a double quoted scalar');
    else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var _line,
    _result,
    terminator,
    isPair,
    isExplicitPair,
    isMapping,
    keyNode,
    keyTag,
    valueNode,
    readNext = true,
    _tag = state.tag,
    _anchor = state.anchor,
    overridableKeys = {},

    ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B) {
    terminator = 0x5D;
    isMapping = false;
    _result = [];
  } else {
    if (ch !== 0x7B) return false;
    terminator = 0x7D;
    isMapping = true;
    _result = {};
  }

  if (state.anchor !== null) state.anchorMap[state.anchor] = _result;

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    if ((ch = state.input.charCodeAt(state.position)) === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    }
    readNext || throwError(state, 'missed comma between flow collection entries');

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F && is_WS_OR_EOL(state.input.charCodeAt(state.position + 1))) {
      isPair = isExplicitPair = true;
      state.position++;
      skipSeparationSpace(state, true, nodeIndent);
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    isMapping
      ? storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode)
      : isPair
      ? _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode))
      : _result.push(keyNode);

    skipSeparationSpace(state, true, nodeIndent);

    if ((ch = state.input.charCodeAt(state.position)) === 0x2C) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else readNext = false;
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
    folding,
    tmp,
    chomping = CHOMPING_CLIP,
    didReadContent = false,
    detectedIndent = false,
    textIndent = nodeIndent,
    emptyLines = 0,
    atMoreIndented = false,

    ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C) folding = false;
  else if (ch === 0x3E) folding = true;
  else return false;

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0)
    if ((ch = state.input.charCodeAt(++state.position)) === 0x2B || ch === 0x2D)
      CHOMPING_CLIP === chomping
        ? (chomping = ch === 0x2B ? CHOMPING_KEEP : CHOMPING_STRIP)
        : throwError(state, 'repeat of a chomping mode identifier');
    else {
      if ((tmp = fromDecimalCode(ch)) < 0) break;

      if (tmp === 0)
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else throwError(state, 'repeat of an indentation width identifier');
    }

  if (is_WHITE_SPACE(ch)) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (is_WHITE_SPACE(ch));

    if (ch === 0x23)
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (!is_EOL(ch) && ch !== 0);
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) && ch === 0x20) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) textIndent = state.lineIndent;

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    if (state.lineIndent < textIndent) {
      if (chomping === CHOMPING_KEEP)
        state.result += repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      else if (chomping === CHOMPING_CLIP && didReadContent) state.result += '\n';

      break;
    }

    if (folding)
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        state.result += repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += repeat('\n', emptyLines + 1);
      } else if (emptyLines === 0) {
        if (didReadContent) state.result += ' ';
      } else state.result += repeat('\n', emptyLines);
    else state.result += repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && ch !== 0) ch = state.input.charCodeAt(++state.position);

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
    ch,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = [],
    detected = false;

  if (state.anchor !== null) state.anchorMap[state.anchor] = _result;

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0 && ch === 0x2D && is_WS_OR_EOL(state.input.charCodeAt(state.position + 1))) {
    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1) && state.lineIndent <= nodeIndent) {
      _result.push(null);
      ch = state.input.charCodeAt(state.position);
      continue;
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0)
      throwError(state, 'bad indentation of a sequence entry');
    else if (state.lineIndent < nodeIndent) break;
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
    allowCompact,
    _line,
    _pos,
    ch,
    _tag = state.tag,
    _anchor = state.anchor,
    _result = {},
    overridableKeys = {},
    keyTag = null,
    keyNode = null,
    valueNode = null,
    atExplicitKey = false,
    detected = false;

  if (state.anchor !== null) state.anchorMap[state.anchor] = _result;

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line;
    _pos = state.position;

    if ((ch === 0x3F || ch === 0x3A) && is_WS_OR_EOL(following)) {
      if (ch === 0x3F) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;
      } else if (atExplicitKey) {
        atExplicitKey = false;
        allowCompact = true;
      } else
        throwError(state, 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line');

      state.position += 1;
      ch = following;
    } else if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) break;
    else if (state.line === _line) {
      ch = state.input.charCodeAt(state.position);

      while (is_WHITE_SPACE(ch)) ch = state.input.charCodeAt(++state.position);

      if (ch === 0x3A) {
        is_WS_OR_EOL((ch = state.input.charCodeAt(++state.position))) ||
          throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');

        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = false;
        allowCompact = false;
        keyTag = state.tag;
        keyNode = state.result;
      } else if (detected) throwError(state, 'can not read an implicit mapping pair; a colon is missed');
      else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true;
      }
    } else if (detected)
      throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');
    else {
      state.tag = _tag;
      state.anchor = _anchor;
      return true;
    }

    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact))
        atExplicitKey ? (keyNode = state.result) : (valueNode = state.result);

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _pos);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && ch !== 0) throwError(state, 'bad indentation of a mapping entry');
    else if (state.lineIndent < nodeIndent) break;
  }

  atExplicitKey && storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
    tagHandle,
    tagName,
    isVerbatim = false,
    isNamed = false,

    ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21) return false;

  state.tag === null || throwError(state, 'duplication of a tag property');

  if ((ch = state.input.charCodeAt(++state.position)) === 0x3C) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);
  } else if (ch === 0x21) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);
  } else tagHandle = '!';

  _position = state.position;

  if (isVerbatim) {
    do {
      ch = state.input.charCodeAt(++state.position);
    } while (ch !== 0 && ch !== 0x3E);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else throwError(state, 'unexpected end of the stream within a verbatim tag');
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      if (ch === 0x21)
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          PATTERN_TAG_HANDLE.test(tagHandle) ||
            throwError(state, 'named tag handle cannot contain such characters');

          isNamed = true;
          _position = state.position + 1;
        } else throwError(state, 'tag suffix cannot contain exclamation marks');

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    PATTERN_FLOW_INDICATORS.test(tagName) &&
      throwError(state, 'tag suffix cannot contain flow indicator characters');
  }

  !tagName || PATTERN_TAG_URI.test(tagName) ||
    throwError(state, 'tag name cannot contain such characters: ' + tagName);

  isVerbatim
    ? (state.tag = tagName)
    : _hasOwnProperty.call(state.tagMap, tagHandle)
    ? (state.tag = state.tagMap[tagHandle] + tagName)
    : tagHandle === '!'
    ? (state.tag = '!' + tagName)
    : tagHandle === '!!'
    ? (state.tag = 'tag:yaml.org,2002:' + tagName)
    : throwError(state, 'undeclared tag handle "' + tagHandle + '"');

  return true;
}

function readAnchorProperty(state) {
  var ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26) return false;

  state.anchor === null || throwError(state, 'duplication of an anchor property');

  ch = state.input.charCodeAt(++state.position);
  var _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) ch = state.input.charCodeAt(++state.position);

  state.position !== _position || throwError(state, 'name of an anchor node must contain at least one character');

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A) return false;

  ch = state.input.charCodeAt(++state.position);
  var _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) ch = state.input.charCodeAt(++state.position);

  state.position !== _position || throwError(state, 'name of an alias node must contain at least one character');

  var alias = state.input.slice(_position, state.position);

  state.anchorMap.hasOwnProperty(alias) || throwError(state, 'unidentified alias "' + alias + '"');

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
    allowBlockScalars,
    allowBlockCollections,
    typeIndex,
    typeQuantity,
    type,
    flowIndent,
    blockIndent,
    indentStatus = 1,
    atNewLine = false,
    hasContent = false;

  state.listener === null || state.listener('open', state);

  state.tag = null;
  state.anchor = null;
  state.kind = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;

  if (allowToSeek && skipSeparationSpace(state, true, -1)) {
    atNewLine = true;

    if (state.lineIndent > parentIndent) indentStatus = 1;
    else if (state.lineIndent === parentIndent) indentStatus = 0;
    else if (state.lineIndent < parentIndent) indentStatus = -1;
  }

  if (indentStatus === 1)
    while (readTagProperty(state) || readAnchorProperty(state))
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) indentStatus = 1;
        else if (state.lineIndent === parentIndent) indentStatus = 0;
        else if (state.lineIndent < parentIndent) indentStatus = -1;
      } else allowBlockCollections = false;

  if (allowBlockCollections) allowBlockCollections = atNewLine || allowCompact;

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    flowIndent =
      CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext ? parentIndent : parentIndent + 1;

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1)
      if (
        (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent))) ||
        readFlowCollection(state, flowIndent)
      )
        hasContent = true;
      else {
        if (
          (allowBlockScalars && readBlockScalar(state, flowIndent)) ||
          readSingleQuotedScalar(state, flowIndent) ||
          readDoubleQuotedScalar(state, flowIndent)
        )
          hasContent = true;
        else if (readAlias(state)) {
          hasContent = true;

          (state.tag === null && state.anchor === null) ||
            throwError(state, 'alias node should not have any properties');
        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) state.tag = '?';
        }

        if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
      }
    else if (indentStatus === 0) hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
  }

  if (state.tag !== null && state.tag !== '!')
    if (state.tag === '?') {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex++)
        if ((type = state.implicitTypes[typeIndex]).resolve(state.result)) {
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;

          break;
        }
    } else if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];

      state.result === null || type.kind === state.kind ||
        throwError(
          state,
          'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"'
        );

      if (type.resolve(state.result)) {
        state.result = type.construct(state.result);
        if (state.anchor !== null) state.anchorMap[state.anchor] = state.result;
      } else throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
    } else throwError(state, 'unknown tag !<' + state.tag + '>');

  state.listener === null || state.listener('close', state);

  return state.tag !== null || state.anchor !== null || hasContent;
}

function readDocument(state) {
  var _position,
    directiveName,
    directiveArgs,
    ch,
    documentStart = state.position,
    hasDirectives = false;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25) break;

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) ch = state.input.charCodeAt(++state.position);

    directiveArgs = [];

    (directiveName = state.input.slice(_position, state.position)).length < 1 &&
      throwError(state, 'directive name must not be less than one character in length');

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) ch = state.input.charCodeAt(++state.position);

      if (ch === 0x23) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) ch = state.input.charCodeAt(++state.position);

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    ch === 0 || readLineBreak(state);

    _hasOwnProperty.call(directiveHandlers, directiveName)
      ? directiveHandlers[directiveName](state, directiveName, directiveArgs)
      : throwWarning(state, 'unknown document directive "' + directiveName + '"');
  }

  skipSeparationSpace(state, true, -1);

  if (
    state.lineIndent === 0 &&
    state.input.charCodeAt(state.position) === 0x2D &&
    state.input.charCodeAt(state.position + 1) === 0x2D &&
    state.input.charCodeAt(state.position + 2) === 0x2D
  ) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);
  } else hasDirectives && throwError(state, 'directives end mark is expected');

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  state.checkLineBreaks &&
    PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position)) &&
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {
    if (state.input.charCodeAt(state.position) === 0x2E) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  state.position < state.length - 1 &&
    throwError(state, 'end of the stream or a document separator is expected');
  //else return;
}

function loadDocuments(input, options) {
  options = options || {};

  if ((input = String(input)).length > 0) {
    if (input.charCodeAt(input.length - 1) !== 0x0A && input.charCodeAt(input.length - 1) !== 0x0D)
      input += '\n';

    if (input.charCodeAt(0) === 0xFEFF) input = input.slice(1);
  }

  var state = new State(input, options);
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < state.length - 1) readDocument(state);

  return state.documents;
}

function load(input, options) {
  var documents = loadDocuments(input, options);

  if (!documents.length) return void 0;
  if (documents.length === 1) return documents[0];

  throw new YAMLException('expected a single document in the stream, but found more');
}

function safeLoad(input, options) {
  return load(input, extend({schema: FAILSAFE_SCHEMA}, options));
}

const VERSION_REGEX = /^yarn lockfile v(\d+)$/;

const TOKEN_TYPES = {
  boolean: 'BOOLEAN',
  string: 'STRING',
  identifier: 'IDENTIFIER',
  eof: 'EOF',
  colon: 'COLON',
  newline: 'NEWLINE',
  comment: 'COMMENT',
  indent: 'INDENT',
  invalid: 'INVALID',
  number: 'NUMBER',
  comma: 'COMMA',
};

const VALID_PROP_VALUE_TOKENS = [TOKEN_TYPES.boolean, TOKEN_TYPES.string, TOKEN_TYPES.number];

function isValidPropValueToken(token) {
  return VALID_PROP_VALUE_TOKENS.indexOf(token.type) >= 0;
}

function* tokenise(input) {
  let line = 1,
    col = 0;

  function buildToken(type, value) {
    return {line, col, type, value};
  }

  for (let lastNewline = false; input.length; ) {
    let chop = 0;

    if (input[0] === '\n' || input[0] === '\r') {
      chop++;
      input[1] !== '\n' || chop++;

      line++;
      col = 0;
      yield buildToken(TOKEN_TYPES.newline);
    } else if (input[0] === '#') {
      chop++;

      let nextNewline = input.indexOf('\n', chop);
      if (nextNewline < 0) nextNewline = input.length;

      const val = input.substring(chop, nextNewline);
      chop = nextNewline;
      yield buildToken(TOKEN_TYPES.comment, val);
    } else if (input[0] === ' ')
      if (lastNewline) {
        let indentSize = 1;
        for (let i = 1; input[i] === ' '; i++) indentSize++;

        if (indentSize % 2) throw new TypeError('Invalid number of spaces');

        chop = indentSize;
        yield buildToken(TOKEN_TYPES.indent, indentSize / 2);
      } else chop++;
    else if (input[0] === '"') {
      let i = 1;
      for (; i < input.length; i++)
        if (input[i] === '"' && (input[i - 1] !== '\\' || input[i - 2] === '\\')) {
          i++;
          break;
        }

      const val = input.substring(0, i);
      chop = i;

      try {
        yield buildToken(TOKEN_TYPES.string, JSON.parse(val));
      } catch (err) {
        if (!(err instanceof SyntaxError)) throw err;

        yield buildToken(TOKEN_TYPES.invalid);
      }
    } else if (/^[0-9]/.test(input)) {
      const val = /^[0-9]+/.exec(input)[0];
      chop = val.length;

      yield buildToken(TOKEN_TYPES.number, +val);
    } else if (/^true/.test(input)) {
      yield buildToken(TOKEN_TYPES.boolean, true);
      chop = 4;
    } else if (/^false/.test(input)) {
      yield buildToken(TOKEN_TYPES.boolean, false);
      chop = 5;
    } else if (input[0] === ':') {
      yield buildToken(TOKEN_TYPES.colon);
      chop++;
    } else if (input[0] === ',') {
      yield buildToken(TOKEN_TYPES.comma);
      chop++;
    } else if (/^[a-zA-Z\/.-]/g.test(input)) {
      let i = 0;
      for (; i < input.length; i++) {
        const char = input[i];
        if (char === ':' || char === ' ' || char === '\n' || char === '\r' || char === ',') break;
      }
      const name = input.substring(0, i);
      chop = i;

      yield buildToken(TOKEN_TYPES.string, name);
    } else yield buildToken(TOKEN_TYPES.invalid);

    chop || (yield buildToken(TOKEN_TYPES.invalid));

    col += chop;
    lastNewline = input[0] === '\n' || (input[0] === '\r' && input[1] === '\n');
    input = input.slice(chop);
  }

  yield buildToken(TOKEN_TYPES.eof);
}

class Parser {
  constructor(input, fileLoc) {
    fileLoc !== void 0 || (fileLoc = 'lockfile');

    this.comments = [];
    this.tokens = tokenise(input);
    this.fileLoc = fileLoc;
  }

  onComment(token) {
    const value = token.value;
    invariant(typeof value == 'string', 'expected token value to be a string');

    const comment = value.trim(),

      versionMatch = comment.match(VERSION_REGEX);
    if (versionMatch) {
      const version = +versionMatch[1];
      if (version > LOCKFILE_VERSION)
        throw new MessageError(
          `Can't install from a lockfile of version ${version} as you're on an old yarn version that only supports versions up to ${LOCKFILE_VERSION}. Run \`$ yarn self-update\` to upgrade to the latest version.`
        );
    }

    this.comments.push(comment);
  }

  next() {
    const item = this.tokens.next();
    invariant(item, 'expected a token');

    const value = item.value;
    if (item.done || !value) throw new Error('No more tokens');

    if (value.type === TOKEN_TYPES.comment) {
      this.onComment(value);
      return this.next();
    }

    return (this.token = value);
  }

  unexpected(msg) {
    msg !== void 0 || (msg = 'Unexpected token');

    throw new SyntaxError(`${msg} ${this.token.line}:${this.token.col} in ${this.fileLoc}`);
  }

  expect(tokType) {
    this.token.type === tokType ? this.next() : this.unexpected();
  }

  eat(tokType) {
    if (this.token.type === tokType) {
      this.next();
      return true;
    }
    return false;
  }

  parse(indent) {
    indent !== void 0 || (indent = 0);
    const obj = nullify();

    while (1) {
      const propToken = this.token;

      if (propToken.type === TOKEN_TYPES.newline) {
        const nextToken = this.next();
        if (!indent) continue;

        if (nextToken.type !== TOKEN_TYPES.indent || nextToken.value !== indent) break;

        this.next();
      } else if (propToken.type === TOKEN_TYPES.indent) {
        if (propToken.value !== indent) break;

        this.next();
      } else if (propToken.type === TOKEN_TYPES.eof) break;
      else if (propToken.type === TOKEN_TYPES.string) {
        const key = propToken.value;
        invariant(key, 'Expected a key');

        const keys = [key];
        this.next();

        while (this.token.type === TOKEN_TYPES.comma) {
          this.next();

          const keyToken = this.token;
          keyToken.type === TOKEN_TYPES.string || this.unexpected('Expected string');

          const key = keyToken.value;
          invariant(key, 'Expected a key');
          keys.push(key);
          this.next();
        }

        const wasColon = this.token.type === TOKEN_TYPES.colon;
        wasColon && this.next();

        if (isValidPropValueToken(this.token)) {
          for (const key of keys) obj[key] = this.token.value;

          this.next();
        } else if (wasColon) {
          const val = this.parse(indent + 1);

          for (const key of keys) obj[key] = val;

          if (indent && this.token.type !== TOKEN_TYPES.indent) break;
        } else this.unexpected('Invalid value type');
      } else this.unexpected('Unknown token: ' + util.inspect(propToken));
    }

    return obj;
  }
}

const MERGE_CONFLICT_ANCESTOR = '|||||||',
  MERGE_CONFLICT_END = '>>>>>>>',
  MERGE_CONFLICT_SEP = '=======',
  MERGE_CONFLICT_START = '<<<<<<<';

function extractConflictVariants(str) {
  const variants = [[], []],
    lines = str.split(/\r?\n/g);

  for (let skip = false; lines.length; ) {
    const line = lines.shift();
    if (line.startsWith(MERGE_CONFLICT_START)) {
      while (lines.length) {
        const conflictLine = lines.shift();
        if (conflictLine === MERGE_CONFLICT_SEP) {
          skip = false;
          break;
        }
        if (skip || conflictLine.startsWith(MERGE_CONFLICT_ANCESTOR)) {
          skip = true;
          continue;
        }
        variants[0].push(conflictLine);
      }

      while (lines.length) {
        const conflictLine = lines.shift();
        if (conflictLine.startsWith(MERGE_CONFLICT_END)) break;

        variants[1].push(conflictLine);
      }
    } else {
      variants[0].push(line);
      variants[1].push(line);
    }
  }

  return [variants[0].join('\n'), variants[1].join('\n')];
}

function hasMergeConflicts(str) {
  return str.includes(MERGE_CONFLICT_START) && str.includes(MERGE_CONFLICT_SEP) && str.includes(MERGE_CONFLICT_END);
}

function parse(str, fileLoc) {
  const parser = new Parser(str, fileLoc);
  parser.next();

  let error;
  if (!fileLoc.endsWith('.yml'))
    try {
      return parser.parse();
    } catch (error1) {
      error = error1;
    }

  try {
    const result = safeLoad(str, {schema: FAILSAFE_SCHEMA});
    return typeof result == 'object' ? result : {};
  } catch (error2) {
    throw error || error2;
  }
}

function parseWithConflict(str, fileLoc) {
  const variants = extractConflictVariants(str);
  try {
    return {type: 'merge', object: Object.assign({}, parse(variants[0], fileLoc), parse(variants[1], fileLoc))};
  } catch (err) {
    if (err instanceof SyntaxError) return {type: 'conflict', object: {}};

    throw err;
  }
}

function parse$1(str, fileLoc) {
  fileLoc !== void 0 || (fileLoc = 'lockfile');

  return hasMergeConflicts((str = stripBOM(str)))
    ? parseWithConflict(str, fileLoc)
    : {type: 'success', object: parse(str, fileLoc)};
}

function promisify(fn, firstData) {
  return function () {
    var args = Array.prototype.slice.call(arguments);

    return new Promise(function (resolve, reject) {
      args.push(function (err) {
        let res;

        if (firstData) {
          res = err;
          err = null;
        } else
          res = arguments.length <= 2 ? arguments[1] : Array.prototype.slice.call(arguments, 1);

        err ? reject(err) : resolve(res);
      });

      fn.apply(null, args);
    });
  };
}

const exists = promisify(fs.exists, true),
  _readFile = promisify(fs.readFile);

function readFile(loc) {
  return _readFile(loc, 'utf8').then(normalizeOS);
}

function normalizeOS(body) {
  return body.replace(/\r\n/g, '\n');
}

const SPEC_ALGORITHMS = ['sha256', 'sha384', 'sha512'],

  BASE64_REGEX = /^[a-z0-9+/]+(?:=?=?)$/i,
  SRI_REGEX = /^([^-]+)-([^?]+)([?\S*]*)$/,
  STRICT_SRI_REGEX = /^([^-]+)-([A-Za-z0-9+/=]{44,88})(\?[\x21-\x7E]*)*$/,
  VCHAR_REGEX = /^[\x21-\x7E]+$/;

class Hash {
  get isHash() { return true; }
  constructor(hash, opts) {
    const strict = !(!opts || !opts.strict);
    this.source = hash.trim();
    const match = this.source.match(strict ? STRICT_SRI_REGEX : SRI_REGEX);
    if (!match || (strict && SPEC_ALGORITHMS.indexOf(match[1]) < 0)) return;
    this.algorithm = match[1];
    this.digest = match[2];

    const rawOpts = match[3];
    this.options = rawOpts ? rawOpts.slice(1).split('?') : [];
  }
  hexDigest() {
    return this.digest && (Buffer.from || Buffer)(this.digest, 'base64').toString('hex');
  }
  toJSON() {
    return this.toString();
  }
  toString(opts) {
    if (opts && opts.strict && !(
      SPEC_ALGORITHMS.indexOf(this.algorithm) >= 0 &&
      this.digest.match(BASE64_REGEX) &&
      (this.options || []).every(opt => opt.match(VCHAR_REGEX))
    ))
      return '';

    const options = this.options && this.options.length ? '?' + this.options.join('?') : '';
    return `${this.algorithm}-${this.digest}${options}`;
  }
}

class Integrity {
  get isIntegrity() { return true; }
  toJSON() {
    return this.toString();
  }
  toString(opts) {
    let sep = (opts = opts || {}).sep || ' ';
    if (opts.strict) sep = sep.replace(/\S+/g, ' ');

    return Object.keys(this)
      .map(k =>
        this[k].map(hash => Hash.prototype.toString.call(hash, opts)).filter(x => x.length).join(sep)
      )
      .filter(x => x.length).join(sep);
  }
  concat(integrity, opts) {
    const other = typeof integrity == 'string' ? integrity : stringify(integrity, opts);
    return parse$2(`${this.toString(opts)} ${other}`, opts);
  }
  hexDigest() {
    return parse$2(this, {single: true}).hexDigest();
  }
}

function parse$2(sri, opts) {
  opts = opts || {};
  if (typeof sri == 'string') return _parse(sri, opts);

  if (sri.algorithm && sri.digest) {
    const fullSri = new Integrity();
    fullSri[sri.algorithm] = [sri];
    return _parse(stringify(fullSri, opts), opts);
  }

  return _parse(stringify(sri, opts), opts);
}

function _parse(integrity, opts) {
  if (opts.single) return new Hash(integrity, opts);

  return integrity.trim().split(/\s+/).reduce((acc, string) => {
    const hash = new Hash(string, opts);
    if (hash.algorithm && hash.digest) {
      const algo = hash.algorithm;
      acc[algo] || (acc[algo] = []);
      acc[algo].push(hash);
    }
    return acc;
  }, new Integrity());
}

function stringify(obj, opts) {
  return obj.algorithm && obj.digest
    ? Hash.prototype.toString.call(obj, opts)
    : typeof obj == 'string'
    ? stringify(parse$2(obj, opts), opts)
    : Integrity.prototype.toString.call(obj, opts);
}

const YARN_VERSION = '1.22.19',
  NODE_VERSION = process.version;

function shouldWrapKey(str) {
  return (
    str.indexOf('true') === 0 ||
    str.indexOf('false') === 0 ||
    /[:\s\n\\",\[\]]/g.test(str) ||
    /^[0-9]/g.test(str) ||
    !/^[a-zA-Z]/g.test(str)
  );
}

function maybeWrap(str) {
  return typeof str == 'boolean' || typeof str == 'number' || shouldWrapKey(str) ? JSON.stringify(str) : str;
}

const priorities = {
  name: 1,
  version: 2,
  uid: 3,
  resolved: 4,
  integrity: 5,
  registry: 6,
  dependencies: 7,
};

function priorityThenAlphaSort(a, b) {
  return priorities[a] || priorities[b]
    ? ((priorities[a] || 100) > (priorities[b] || 100) ? 1 : -1)
    : sortAlpha(a, b);
}

function _stringify(obj, options) {
  if (typeof obj != 'object') throw new TypeError();

  const indent = options.indent,
    lines = [],

    keys = Object.keys(obj).sort(priorityThenAlphaSort);

  for (let addedKeys = [], i = 0; i < keys.length; i++) {
    const key = keys[i],
      val = obj[key];
    if (val == null || addedKeys.indexOf(key) >= 0) continue;

    const valKeys = [key];

    if (typeof val == 'object')
      for (let j = i + 1; j < keys.length; j++) {
        const key = keys[j];
        val !== obj[key] || valKeys.push(key);
      }

    const keyLine = valKeys.sort(sortAlpha).map(maybeWrap).join(', ');

    if (typeof val == 'string' || typeof val == 'boolean' || typeof val == 'number')
      lines.push(`${keyLine} ${maybeWrap(val)}`);
    else if (typeof val == 'object')
      lines.push(`${keyLine}:\n${_stringify(val, {indent: indent + '  '})}` + (options.topLevel ? '\n' : ''));
    else throw new TypeError();

    addedKeys = addedKeys.concat(valKeys);
  }

  return indent + lines.join('\n' + indent);
}

function stringify$1(obj, noHeader, enableVersions) {
  const val = _stringify(obj, {indent: '', topLevel: true});
  if (noHeader) return val;

  const lines = [
    '# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.',
    '# yarn lockfile v' + LOCKFILE_VERSION,
  ];
  if (enableVersions) {
    lines.push('# yarn v' + YARN_VERSION);
    lines.push('# node ' + NODE_VERSION);
  }
  lines.push('\n');
  lines.push(val);

  return lines.join('\n');
}

function getName(pattern) {
  return normalizePattern(pattern).name;
}

function blankObjectUndefined(obj) {
  return obj && Object.keys(obj).length ? obj : void 0;
}

function keyForRemote(remote) {
  return remote.resolved || (remote.reference && remote.hash ? `${remote.reference}#${remote.hash}` : null);
}

function serializeIntegrity(integrity) {
  return integrity.toString().split(' ').sort().join(' ');
}

function implodeEntry(pattern, obj) {
  const inferredName = getName(pattern),
    integrity = obj.integrity ? serializeIntegrity(obj.integrity) : '';
  const imploded = {
    name: inferredName === obj.name ? void 0 : obj.name,
    version: obj.version,
    uid: obj.uid === obj.version ? void 0 : obj.uid,
    resolved: obj.resolved,
    registry: obj.registry === 'npm' ? void 0 : obj.registry,
    dependencies: blankObjectUndefined(obj.dependencies),
    optionalDependencies: blankObjectUndefined(obj.optionalDependencies),
    permissions: blankObjectUndefined(obj.permissions),
    prebuiltVariants: blankObjectUndefined(obj.prebuiltVariants),
  };
  if (integrity) imploded.integrity = integrity;

  return imploded;
}

function explodeEntry(pattern, obj) {
  obj.optionalDependencies = obj.optionalDependencies || {};
  obj.dependencies = obj.dependencies || {};
  obj.uid = obj.uid || obj.version;
  obj.permissions = obj.permissions || {};
  obj.registry = obj.registry || 'npm';
  obj.name = obj.name || getName(pattern);
  const integrity = obj.integrity;
  if (integrity && integrity.isIntegrity) obj.integrity = parse$2(integrity);

  return obj;
}

class Lockfile {
  constructor(opts) {
    opts !== void 0 || (opts = {});

    this.source = opts.source || '';
    this.cache = opts.cache;
    this.parseResultType = opts.parseResultType;
  }

  hasEntriesExistWithoutIntegrity() {
    if (!this.cache) return false;

    for (const key in this.cache)
      if (!/^.*@(file:|http)/.test(key) && this.cache[key] && !this.cache[key].integrity) return true;

    return false;
  }

  static fromDirectory(dir, reporter) {
    const lockfileLoc = path.join(dir, LOCKFILE_FILENAME);

    return exists(lockfileLoc).then(ok => {
      if (!ok) {
        reporter && reporter.info(reporter.lang('noLockfileFound'));
        return Promise.resolve(new Lockfile());
      }
      return readFile(lockfileLoc).then(rawLockfile => {
        let parseResult = parse$1(rawLockfile, lockfileLoc);

        if (reporter)
          parseResult.type === 'merge'
            ? reporter.info(reporter.lang('lockfileMerged'))
            : parseResult.type !== 'conflict' || reporter.warn(reporter.lang('lockfileConflict'));

        let lockfile = parseResult.object;
        if (lockfile && lockfile.__metadata) lockfile = {};

        return new Lockfile({cache: lockfile, source: rawLockfile, parseResultType: parseResult.type});
      });
    });
  }

  getLocked(pattern) {
    const cache = this.cache;
    if (!cache) return void 0;

    const shrunk = pattern in cache && cache[pattern];

    if (typeof shrunk == 'string') return this.getLocked(shrunk);
    if (shrunk) {
      explodeEntry(pattern, shrunk);
      return shrunk;
    }

    return void 0;
  }

  removePattern(pattern) {
    const cache = this.cache;
    cache && delete cache[pattern];
  }

  getLockfile(patterns) {
    const lockfile = {},
      seen = new Map(),

      sortedPatternsKeys = Object.keys(patterns).sort(sortAlpha);

    for (const pattern of sortedPatternsKeys) {
      const pkg = patterns[pattern],
        remote = pkg._remote, ref = pkg._reference;
      invariant(ref, 'Package is missing a reference');
      invariant(remote, 'Package is missing a remote');

      const remoteKey = keyForRemote(remote),
        seenPattern = remoteKey && seen.get(remoteKey);
      if (seenPattern) {
        lockfile[pattern] = seenPattern;

        seenPattern.name || getName(pattern) === pkg.name || (seenPattern.name = pkg.name);

        continue;
      }
      const obj = implodeEntry(pattern, {
        name: pkg.name,
        version: pkg.version,
        uid: pkg._uid,
        resolved: remote.resolved,
        integrity: remote.integrity,
        registry: remote.registry,
        dependencies: pkg.dependencies,
        peerDependencies: pkg.peerDependencies,
        optionalDependencies: pkg.optionalDependencies,
        permissions: ref.permissions,
        prebuiltVariants: pkg.prebuiltVariants,
      });

      lockfile[pattern] = obj;

      remoteKey && seen.set(remoteKey, obj);
    }

    return lockfile;
  }
}

exports = module.exports = Lockfile;
exports.default = Lockfile;
exports.explodeEntry = explodeEntry;
exports.implodeEntry = implodeEntry;
exports.parse = parse$1;
exports.stringify = stringify$1;

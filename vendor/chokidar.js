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
  return __webpack_require__(12);
}([ function(module, exports) {
  module.exports = require("path");
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), POSIX_CHARS = {
    DOT_LITERAL: "\\.",
    PLUS_LITERAL: "\\+",
    QMARK_LITERAL: "\\?",
    SLASH_LITERAL: "\\/",
    ONE_CHAR: "(?=.)",
    QMARK: "[^/]",
    END_ANCHOR: "(?:\\/|$)",
    DOTS_SLASH: "\\.{1,2}(?:\\/|$)",
    NO_DOT: "(?!\\.)",
    NO_DOTS: "(?!(?:^|\\/)\\.{1,2}(?:\\/|$))",
    NO_DOT_SLASH: "(?!\\.{0,1}(?:\\/|$))",
    NO_DOTS_SLASH: "(?!\\.{1,2}(?:\\/|$))",
    QMARK_NO_DOT: "[^.\\/]",
    STAR: "[^/]*?",
    START_ANCHOR: "(?:^|\\/)"
  }, WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: "[\\\\/]",
    QMARK: "[^\\\\/]",
    STAR: "[^\\\\/]*?",
    DOTS_SLASH: "\\.{1,2}(?:[\\\\/]|$)",
    NO_DOT: "(?!\\.)",
    NO_DOTS: "(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))",
    NO_DOT_SLASH: "(?!\\.{0,1}(?:[\\\\/]|$))",
    NO_DOTS_SLASH: "(?!\\.{1,2}(?:[\\\\/]|$))",
    QMARK_NO_DOT: "[^.\\\\/]",
    START_ANCHOR: "(?:^|[\\\\/])",
    END_ANCHOR: "(?:[\\\\/]|$)"
  };
  module.exports = {
    MAX_LENGTH: 65536,
    POSIX_REGEX_SOURCE: {
      alnum: "a-zA-Z0-9",
      alpha: "a-zA-Z",
      ascii: "\\x00-\\x7F",
      blank: " \\t",
      cntrl: "\\x00-\\x1F\\x7F",
      digit: "0-9",
      graph: "\\x21-\\x7E",
      lower: "a-z",
      print: "\\x20-\\x7E ",
      punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
      space: " \\t\\r\\n\\v\\f",
      upper: "A-Z",
      word: "A-Za-z0-9_",
      xdigit: "A-Fa-f0-9"
    },
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    SEP: path.sep,
    extglobChars: chars => ({
      "!": {
        type: "negate",
        open: "(?:(?!(?:",
        close: `))${chars.STAR})`
      },
      "?": {
        type: "qmark",
        open: "(?:",
        close: ")?"
      },
      "+": {
        type: "plus",
        open: "(?:",
        close: ")+"
      },
      "*": {
        type: "star",
        open: "(?:",
        close: ")*"
      },
      "@": {
        type: "at",
        open: "(?:",
        close: ")"
      }
    }),
    globChars: win32 => !0 === win32 ? WINDOWS_CHARS : POSIX_CHARS
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), win32 = "win32" === process.platform, {REGEX_BACKSLASH: REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH: REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS: REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL: REGEX_SPECIAL_CHARS_GLOBAL} = __webpack_require__(3);
  exports.isObject = val => null !== val && "object" == typeof val && !Array.isArray(val), 
  exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str), exports.isRegexChar = str => 1 === str.length && exports.hasRegexChars(str), 
  exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1"), exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, "/"), 
  exports.removeBackslashes = str => str.replace(REGEX_REMOVE_BACKSLASH, match => "\\" === match ? "" : match), 
  exports.supportsLookbehinds = () => {
    const segs = process.version.slice(1).split(".").map(Number);
    return 3 === segs.length && segs[0] >= 9 || 8 === segs[0] && segs[1] >= 10;
  }, exports.isWindows = options => options && "boolean" == typeof options.windows ? options.windows : !0 === win32 || "\\" === path.sep, 
  exports.escapeLast = (input, char, lastIdx) => {
    const idx = input.lastIndexOf(char, lastIdx);
    return -1 === idx ? input : "\\" === input[idx - 1] ? exports.escapeLast(input, char, idx - 1) : `${input.slice(0, idx)}\\${input.slice(idx)}`;
  }, exports.removePrefix = (input, state = {}) => {
    let output = input;
    return output.startsWith("./") && (output = output.slice(2), state.prefix = "./"), 
    output;
  }, exports.wrapOutput = (input, state = {}, options = {}) => {
    let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
    return !0 === state.negated && (output = `(?:^(?!${output}).*$)`), output;
  };
}, function(module, exports, __webpack_require__) {
  const utils = __webpack_require__(6);
  module.exports = (ast, options = {}) => {
    let stringify = (node, parent = {}) => {
      let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent), invalidNode = !0 === node.invalid && !0 === options.escapeInvalid, output = "";
      if (node.value) return (invalidBlock || invalidNode) && utils.isOpenOrClose(node) ? "\\" + node.value : node.value;
      if (node.value) return node.value;
      if (node.nodes) for (let child of node.nodes) output += stringify(child);
      return output;
    };
    return stringify(ast);
  };
}, function(module, exports, __webpack_require__) {
  exports.isInteger = num => "number" == typeof num ? Number.isInteger(num) : "string" == typeof num && "" !== num.trim() && Number.isInteger(Number(num)), 
  exports.find = (node, type) => node.nodes.find(node => node.type === type), exports.exceedsLimit = (min, max, step = 1, limit) => !1 !== limit && (!(!exports.isInteger(min) || !exports.isInteger(max)) && (Number(max) - Number(min)) / Number(step) >= limit), 
  exports.escapeNode = (block, n = 0, type) => {
    let node = block.nodes[n];
    node && (type && node.type === type || "open" === node.type || "close" === node.type) && !0 !== node.escaped && (node.value = "\\" + node.value, 
    node.escaped = !0);
  }, exports.encloseBrace = node => "brace" === node.type && (node.commas >> 0 + node.ranges >> 0 == 0 && (node.invalid = !0, 
  !0)), exports.isInvalidBrace = block => "brace" === block.type && (!(!0 !== block.invalid && !block.dollar) || (block.commas >> 0 + block.ranges >> 0 == 0 || !0 !== block.open || !0 !== block.close) && (block.invalid = !0, 
  !0)), exports.isOpenOrClose = node => "open" === node.type || "close" === node.type || (!0 === node.open || !0 === node.close), 
  exports.reduce = nodes => nodes.reduce((acc, node) => ("text" === node.type && acc.push(node.value), 
  "range" === node.type && (node.type = "text"), acc), []), exports.flatten = (...args) => {
    const result = [], flat = arr => {
      for (let i = 0; i < arr.length; i++) {
        let ele = arr[i];
        Array.isArray(ele) ? flat(ele, result) : void 0 !== ele && result.push(ele);
      }
      return result;
    };
    return flat(args), result;
  };
}, function(module, exports, __webpack_require__) {
  const {sep: sep} = __webpack_require__(0), {platform: platform} = process;
  exports.EV_ALL = "all", exports.EV_READY = "ready", exports.EV_ADD = "add", exports.EV_CHANGE = "change", 
  exports.EV_ADD_DIR = "addDir", exports.EV_UNLINK = "unlink", exports.EV_UNLINK_DIR = "unlinkDir", 
  exports.EV_RAW = "raw", exports.EV_ERROR = "error", exports.STR_DATA = "data", exports.STR_END = "end", 
  exports.STR_CLOSE = "close", exports.FSEVENT_CREATED = "created", exports.FSEVENT_MODIFIED = "modified", 
  exports.FSEVENT_DELETED = "deleted", exports.FSEVENT_MOVED = "moved", exports.FSEVENT_CLONED = "cloned", 
  exports.FSEVENT_UNKNOWN = "unknown", exports.FSEVENT_TYPE_FILE = "file", exports.FSEVENT_TYPE_DIRECTORY = "directory", 
  exports.FSEVENT_TYPE_SYMLINK = "symlink", exports.KEY_LISTENERS = "listeners", exports.KEY_ERR = "errHandlers", 
  exports.KEY_RAW = "rawEmitters", exports.HANDLER_KEYS = [ exports.KEY_LISTENERS, exports.KEY_ERR, exports.KEY_RAW ], 
  exports.DOT_SLASH = "." + sep, exports.BACK_SLASH_RE = /\\/g, exports.DOUBLE_SLASH_RE = /\/\//, 
  exports.SLASH_OR_BACK_SLASH_RE = /[/\\]/, exports.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, 
  exports.REPLACER_RE = /^\.[/\\]/, exports.SLASH = "/", exports.SLASH_SLASH = "//", 
  exports.BRACE_START = "{", exports.BANG = "!", exports.ONE_DOT = ".", exports.TWO_DOTS = "..", 
  exports.STAR = "*", exports.GLOBSTAR = "**", exports.ROOT_GLOBSTAR = "/**/*", exports.SLASH_GLOBSTAR = "/**", 
  exports.DIR_SUFFIX = "Dir", exports.ANYMATCH_OPTS = {
    dot: !0
  }, exports.STRING_TYPE = "string", exports.FUNCTION_TYPE = "function", exports.EMPTY_STR = "", 
  exports.EMPTY_FN = () => {}, exports.IDENTITY_FN = val => val, exports.isWindows = "win32" === platform, 
  exports.isMacos = "darwin" === platform, exports.isLinux = "linux" === platform;
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), scan = __webpack_require__(16), parse = __webpack_require__(17), utils = __webpack_require__(4), constants = __webpack_require__(3), picomatch = (glob, options, returnState = !1) => {
    if (Array.isArray(glob)) {
      const fns = glob.map(input => picomatch(input, options, returnState));
      return str => {
        for (const isMatch of fns) {
          const state = isMatch(str);
          if (state) return state;
        }
        return !1;
      };
    }
    const isState = (val = glob) && "object" == typeof val && !Array.isArray(val) && glob.tokens && glob.input;
    var val;
    if ("" === glob || "string" != typeof glob && !isState) throw new TypeError("Expected pattern to be a non-empty string");
    const opts = options || {}, posix = utils.isWindows(options), regex = isState ? picomatch.compileRe(glob, options) : picomatch.makeRe(glob, options, !1, !0), state = regex.state;
    delete regex.state;
    let isIgnored = () => !1;
    if (opts.ignore) {
      const ignoreOpts = {
        ...options,
        ignore: null,
        onMatch: null,
        onResult: null
      };
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = !1) => {
      const {isMatch: isMatch, match: match, output: output} = picomatch.test(input, regex, options, {
        glob: glob,
        posix: posix
      }), result = {
        glob: glob,
        state: state,
        regex: regex,
        posix: posix,
        input: input,
        output: output,
        match: match,
        isMatch: isMatch
      };
      return "function" == typeof opts.onResult && opts.onResult(result), !1 === isMatch ? (result.isMatch = !1, 
      !!returnObject && result) : isIgnored(input) ? ("function" == typeof opts.onIgnore && opts.onIgnore(result), 
      result.isMatch = !1, !!returnObject && result) : ("function" == typeof opts.onMatch && opts.onMatch(result), 
      !returnObject || result);
    };
    return returnState && (matcher.state = state), matcher;
  };
  picomatch.test = (input, regex, options, {glob: glob, posix: posix} = {}) => {
    if ("string" != typeof input) throw new TypeError("Expected input to be a string");
    if ("" === input) return {
      isMatch: !1,
      output: ""
    };
    const opts = options || {}, format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match = input === glob, output = match && format ? format(input) : input;
    return !1 === match && (output = format ? format(input) : input, match = output === glob), 
    !1 !== match && !0 !== opts.capture || (match = !0 === opts.matchBase || !0 === opts.basename ? picomatch.matchBase(input, regex, options, posix) : regex.exec(output)), 
    {
      isMatch: Boolean(match),
      match: match,
      output: output
    };
  }, picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options)).test(path.basename(input)), 
  picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str), 
  picomatch.parse = (pattern, options) => Array.isArray(pattern) ? pattern.map(p => picomatch.parse(p, options)) : parse(pattern, {
    ...options,
    fastpaths: !1
  }), picomatch.scan = (input, options) => scan(input, options), picomatch.compileRe = (state, options, returnOutput = !1, returnState = !1) => {
    if (!0 === returnOutput) return state.output;
    const opts = options || {}, prepend = opts.contains ? "" : "^", append = opts.contains ? "" : "$";
    let source = `${prepend}(?:${state.output})${append}`;
    state && !0 === state.negated && (source = `^(?!${source}).*$`);
    const regex = picomatch.toRegex(source, options);
    return !0 === returnState && (regex.state = state), regex;
  }, picomatch.makeRe = (input, options = {}, returnOutput = !1, returnState = !1) => {
    if (!input || "string" != typeof input) throw new TypeError("Expected a non-empty string");
    let parsed = {
      negated: !1,
      fastpaths: !0
    };
    return !1 === options.fastpaths || "." !== input[0] && "*" !== input[0] || (parsed.output = parse.fastpaths(input, options)), 
    parsed.output || (parsed = parse(input, options)), picomatch.compileRe(parsed, options, returnOutput, returnState);
  }, picomatch.toRegex = (source, options) => {
    try {
      const opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && !0 === options.debug) throw err;
      return /$^/;
    }
  }, picomatch.constants = constants, module.exports = picomatch;
}, function(module, exports) {
  module.exports = function(path, stripTrailing) {
    if ("string" != typeof path) throw new TypeError("expected path to be a string");
    if ("\\" === path || "/" === path) return "/";
    var len = path.length;
    if (len <= 1) return path;
    var prefix = "";
    if (len > 4 && "\\" === path[3]) {
      var ch = path[2];
      "?" !== ch && "." !== ch || "\\\\" !== path.slice(0, 2) || (path = path.slice(2), 
      prefix = "//");
    }
    var segs = path.split(/[/\\]+/);
    return !1 !== stripTrailing && "" === segs[segs.length - 1] && segs.pop(), prefix + segs.join("/");
  };
}, function(module, exports, __webpack_require__) {
  var isExtglob = __webpack_require__(20), chars = {
    "{": "}",
    "(": ")",
    "[": "]"
  }, strictCheck = function(str) {
    if ("!" === str[0]) return !0;
    for (var index = 0, pipeIndex = -2, closeSquareIndex = -2, closeCurlyIndex = -2, closeParenIndex = -2, backSlashIndex = -2; index < str.length; ) {
      if ("*" === str[index]) return !0;
      if ("?" === str[index + 1] && /[\].+)]/.test(str[index])) return !0;
      if (-1 !== closeSquareIndex && "[" === str[index] && "]" !== str[index + 1] && (closeSquareIndex < index && (closeSquareIndex = str.indexOf("]", index)), 
      closeSquareIndex > index)) {
        if (-1 === backSlashIndex || backSlashIndex > closeSquareIndex) return !0;
        if (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeSquareIndex) return !0;
      }
      if (-1 !== closeCurlyIndex && "{" === str[index] && "}" !== str[index + 1] && (closeCurlyIndex = str.indexOf("}", index)) > index && (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeCurlyIndex)) return !0;
      if (-1 !== closeParenIndex && "(" === str[index] && "?" === str[index + 1] && /[:!=]/.test(str[index + 2]) && ")" !== str[index + 3] && (closeParenIndex = str.indexOf(")", index)) > index && (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeParenIndex)) return !0;
      if (-1 !== pipeIndex && "(" === str[index] && "|" !== str[index + 1] && (pipeIndex < index && (pipeIndex = str.indexOf("|", index)), 
      -1 !== pipeIndex && ")" !== str[pipeIndex + 1] && (closeParenIndex = str.indexOf(")", pipeIndex)) > pipeIndex && (-1 === (backSlashIndex = str.indexOf("\\", pipeIndex)) || backSlashIndex > closeParenIndex))) return !0;
      if ("\\" === str[index]) {
        var open = str[index + 1];
        index += 2;
        var close = chars[open];
        if (close) {
          var n = str.indexOf(close, index);
          -1 !== n && (index = n + 1);
        }
        if ("!" === str[index]) return !0;
      } else index++;
    }
    return !1;
  }, relaxedCheck = function(str) {
    if ("!" === str[0]) return !0;
    for (var index = 0; index < str.length; ) {
      if (/[*?{}()[\]]/.test(str[index])) return !0;
      if ("\\" === str[index]) {
        var open = str[index + 1];
        index += 2;
        var close = chars[open];
        if (close) {
          var n = str.indexOf(close, index);
          -1 !== n && (index = n + 1);
        }
        if ("!" === str[index]) return !0;
      } else index++;
    }
    return !1;
  };
  module.exports = function(str, options) {
    if ("string" != typeof str || "" === str) return !1;
    if (isExtglob(str)) return !0;
    var check = strictCheck;
    return options && !1 === options.strict && (check = relaxedCheck), check(str);
  };
}, function(module, exports, __webpack_require__) {
  const util = __webpack_require__(1), toRegexRange = __webpack_require__(24), isObject = val => null !== val && "object" == typeof val && !Array.isArray(val), isValidValue = value => "number" == typeof value || "string" == typeof value && "" !== value, isNumber = num => Number.isInteger(+num), zeros = input => {
    let value = "" + input, index = -1;
    if ("-" === value[0] && (value = value.slice(1)), "0" === value) return !1;
    for (;"0" === value[++index]; ) ;
    return index > 0;
  }, pad = (input, maxLength, toNumber) => {
    if (maxLength > 0) {
      let dash = "-" === input[0] ? "-" : "";
      dash && (input = input.slice(1)), input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
    }
    return !1 === toNumber ? String(input) : input;
  }, toMaxLen = (input, maxLength) => {
    let negative = "-" === input[0] ? "-" : "";
    for (negative && (input = input.slice(1), maxLength--); input.length < maxLength; ) input = "0" + input;
    return negative ? "-" + input : input;
  }, toRange = (a, b, isNumbers, options) => {
    if (isNumbers) return toRegexRange(a, b, {
      wrap: !1,
      ...options
    });
    let start = String.fromCharCode(a);
    return a === b ? start : `[${start}-${String.fromCharCode(b)}]`;
  }, toRegex = (start, end, options) => {
    if (Array.isArray(start)) {
      let wrap = !0 === options.wrap, prefix = options.capture ? "" : "?:";
      return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
    }
    return toRegexRange(start, end, options);
  }, rangeError = (...args) => new RangeError("Invalid range arguments: " + util.inspect(...args)), invalidRange = (start, end, options) => {
    if (!0 === options.strictRanges) throw rangeError([ start, end ]);
    return [];
  }, fillNumbers = (start, end, step = 1, options = {}) => {
    let a = Number(start), b = Number(end);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      if (!0 === options.strictRanges) throw rangeError([ start, end ]);
      return [];
    }
    0 === a && (a = 0), 0 === b && (b = 0);
    let descending = a > b, startString = String(start), endString = String(end), stepString = String(step);
    step = Math.max(Math.abs(step), 1);
    let padded = zeros(startString) || zeros(endString) || zeros(stepString), maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0, toNumber = !1 === padded && !1 === ((start, end, options) => "string" == typeof start || "string" == typeof end || !0 === options.stringify)(start, end, options), format = options.transform || (toNumber => value => !0 === toNumber ? Number(value) : String(value))(toNumber);
    if (options.toRegex && 1 === step) return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), !0, options);
    let parts = {
      negatives: [],
      positives: []
    }, range = [], index = 0;
    for (;descending ? a >= b : a <= b; ) !0 === options.toRegex && step > 1 ? parts[(num = a) < 0 ? "negatives" : "positives"].push(Math.abs(num)) : range.push(pad(format(a, index), maxLen, toNumber)), 
    a = descending ? a - step : a + step, index++;
    var num;
    return !0 === options.toRegex ? step > 1 ? ((parts, options) => {
      parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0), parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
      let result, prefix = options.capture ? "" : "?:", positives = "", negatives = "";
      return parts.positives.length && (positives = parts.positives.join("|")), parts.negatives.length && (negatives = `-(${prefix}${parts.negatives.join("|")})`), 
      result = positives && negatives ? `${positives}|${negatives}` : positives || negatives, 
      options.wrap ? `(${prefix}${result})` : result;
    })(parts, options) : toRegex(range, null, {
      wrap: !1,
      ...options
    }) : range;
  }, fill = (start, end, step, options = {}) => {
    if (null == end && isValidValue(start)) return [ start ];
    if (!isValidValue(start) || !isValidValue(end)) return invalidRange(start, end, options);
    if ("function" == typeof step) return fill(start, end, 1, {
      transform: step
    });
    if (isObject(step)) return fill(start, end, 0, step);
    let opts = {
      ...options
    };
    return !0 === opts.capture && (opts.wrap = !0), step = step || opts.step || 1, isNumber(step) ? isNumber(start) && isNumber(end) ? fillNumbers(start, end, step, opts) : ((start, end, step = 1, options = {}) => {
      if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) return invalidRange(start, end, options);
      let format = options.transform || (val => String.fromCharCode(val)), a = ("" + start).charCodeAt(0), b = ("" + end).charCodeAt(0), descending = a > b, min = Math.min(a, b), max = Math.max(a, b);
      if (options.toRegex && 1 === step) return toRange(min, max, !1, options);
      let range = [], index = 0;
      for (;descending ? a >= b : a <= b; ) range.push(format(a, index)), a = descending ? a - step : a + step, 
      index++;
      return !0 === options.toRegex ? toRegex(range, null, {
        wrap: !1,
        options: options
      }) : range;
    })(start, end, Math.max(Math.abs(step), 1), opts) : null == step || isObject(step) ? fill(start, end, 1, step) : ((step, options) => {
      if (!0 === options.strictRanges) throw new TypeError(`Expected step "${step}" to be a number`);
      return [];
    })(step, opts);
  };
  module.exports = fill;
}, function(module, exports, __webpack_require__) {
  const {EventEmitter: EventEmitter} = __webpack_require__(13), fs = __webpack_require__(2), sysPath = __webpack_require__(0), {promisify: promisify} = __webpack_require__(1), readdirp = __webpack_require__(14), anymatch = __webpack_require__(18).default, globParent = __webpack_require__(19), isGlob = __webpack_require__(10), braces = __webpack_require__(22), normalizePath = __webpack_require__(9), NodeFsHandler = __webpack_require__(29), FsEventsHandler = __webpack_require__(32), {EV_ALL: EV_ALL, EV_READY: EV_READY, EV_ADD: EV_ADD, EV_CHANGE: EV_CHANGE, EV_UNLINK: EV_UNLINK, EV_ADD_DIR: EV_ADD_DIR, EV_UNLINK_DIR: EV_UNLINK_DIR, EV_RAW: EV_RAW, EV_ERROR: EV_ERROR, STR_CLOSE: STR_CLOSE, STR_END: STR_END, BACK_SLASH_RE: BACK_SLASH_RE, DOUBLE_SLASH_RE: DOUBLE_SLASH_RE, SLASH_OR_BACK_SLASH_RE: SLASH_OR_BACK_SLASH_RE, DOT_RE: DOT_RE, REPLACER_RE: REPLACER_RE, SLASH: SLASH, SLASH_SLASH: SLASH_SLASH, BRACE_START: BRACE_START, BANG: BANG, ONE_DOT: ONE_DOT, TWO_DOTS: TWO_DOTS, GLOBSTAR: GLOBSTAR, SLASH_GLOBSTAR: SLASH_GLOBSTAR, ANYMATCH_OPTS: ANYMATCH_OPTS, STRING_TYPE: STRING_TYPE, FUNCTION_TYPE: FUNCTION_TYPE, EMPTY_STR: EMPTY_STR, EMPTY_FN: EMPTY_FN, isWindows: isWindows, isMacos: isMacos} = __webpack_require__(7), stat = promisify(fs.stat), readdir = promisify(fs.readdir), arrify = (value = []) => Array.isArray(value) ? value : [ value ], flatten = (list, result = []) => (list.forEach(item => {
    Array.isArray(item) ? flatten(item, result) : result.push(item);
  }), result), unifyPaths = paths_ => {
    const paths = flatten(arrify(paths_));
    if (!paths.every(p => typeof p === STRING_TYPE)) throw new TypeError("Non-string provided as watch path: " + paths);
    return paths.map(normalizePathToUnix);
  }, toUnix = string => {
    let str = string.replace(BACK_SLASH_RE, SLASH), prepend = !1;
    for (str.startsWith(SLASH_SLASH) && (prepend = !0); str.match(DOUBLE_SLASH_RE); ) str = str.replace(DOUBLE_SLASH_RE, SLASH);
    return prepend && (str = SLASH + str), str;
  }, normalizePathToUnix = path => toUnix(sysPath.normalize(toUnix(path))), normalizeIgnored = (cwd = EMPTY_STR) => path => typeof path !== STRING_TYPE ? path : normalizePathToUnix(sysPath.isAbsolute(path) ? path : sysPath.join(cwd, path)), undef = (opts, key) => void 0 === opts[key];
  class DirEntry {
    constructor(dir, removeWatcher) {
      this.path = dir, this._removeWatcher = removeWatcher, this.items = new Set;
    }
    add(item) {
      const {items: items} = this;
      items && item !== ONE_DOT && item !== TWO_DOTS && items.add(item);
    }
    async remove(item) {
      const {items: items} = this;
      if (!items) return;
      if (items.delete(item), items.size > 0) return;
      const dir = this.path;
      try {
        await readdir(dir);
      } catch (err) {
        this._removeWatcher && this._removeWatcher(sysPath.dirname(dir), sysPath.basename(dir));
      }
    }
    has(item) {
      const {items: items} = this;
      if (items) return items.has(item);
    }
    getChildren() {
      const {items: items} = this;
      if (items) return [ ...items.values() ];
    }
    dispose() {
      this.items.clear(), delete this.path, delete this._removeWatcher, delete this.items, 
      Object.freeze(this);
    }
  }
  class WatchHelper {
    constructor(path, watchPath, follow, fsw) {
      this.fsw = fsw, this.path = path = path.replace(REPLACER_RE, EMPTY_STR), this.watchPath = watchPath, 
      this.fullWatchPath = sysPath.resolve(watchPath), this.hasGlob = watchPath !== path, 
      path === EMPTY_STR && (this.hasGlob = !1), this.globSymlink = !(!this.hasGlob || !follow) && void 0, 
      this.globFilter = !!this.hasGlob && anymatch(path, void 0, ANYMATCH_OPTS), this.dirParts = this.getDirParts(path), 
      this.dirParts.forEach(parts => {
        parts.length > 1 && parts.pop();
      }), this.followSymlinks = follow, this.statMethod = follow ? "stat" : "lstat";
    }
    checkGlobSymlink(entry) {
      return void 0 === this.globSymlink && (this.globSymlink = entry.fullParentDir !== this.fullWatchPath && {
        realPath: entry.fullParentDir,
        linkPath: this.fullWatchPath
      }), this.globSymlink ? entry.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath) : entry.fullPath;
    }
    entryPath(entry) {
      return sysPath.join(this.watchPath, sysPath.relative(this.watchPath, this.checkGlobSymlink(entry)));
    }
    filterPath(entry) {
      const {stats: stats} = entry;
      if (stats && stats.isSymbolicLink()) return this.filterDir(entry);
      const resolvedPath = this.entryPath(entry);
      return (!this.hasGlob || typeof this.globFilter !== FUNCTION_TYPE || this.globFilter(resolvedPath)) && this.fsw._isntIgnored(resolvedPath, stats) && this.fsw._hasReadPermissions(stats);
    }
    getDirParts(path) {
      if (!this.hasGlob) return [];
      const parts = [];
      return (path.includes(BRACE_START) ? braces.expand(path) : [ path ]).forEach(path => {
        parts.push(sysPath.relative(this.watchPath, path).split(SLASH_OR_BACK_SLASH_RE));
      }), parts;
    }
    filterDir(entry) {
      if (this.hasGlob) {
        const entryParts = this.getDirParts(this.checkGlobSymlink(entry));
        let globstar = !1;
        this.unmatchedGlob = !this.dirParts.some(parts => parts.every((part, i) => (part === GLOBSTAR && (globstar = !0), 
        globstar || !entryParts[0][i] || anymatch(part, entryParts[0][i], ANYMATCH_OPTS))));
      }
      return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
    }
  }
  class FSWatcher extends EventEmitter {
    constructor(_opts) {
      super();
      const opts = {};
      _opts && Object.assign(opts, _opts), this._watched = new Map, this._closers = new Map, 
      this._ignoredPaths = new Set, this._throttled = new Map, this._symlinkPaths = new Map, 
      this._streams = new Set, this.closed = !1, undef(opts, "persistent") && (opts.persistent = !0), 
      undef(opts, "ignoreInitial") && (opts.ignoreInitial = !1), undef(opts, "ignorePermissionErrors") && (opts.ignorePermissionErrors = !1), 
      undef(opts, "interval") && (opts.interval = 100), undef(opts, "binaryInterval") && (opts.binaryInterval = 300), 
      undef(opts, "disableGlobbing") && (opts.disableGlobbing = !1), opts.enableBinaryInterval = opts.binaryInterval !== opts.interval, 
      undef(opts, "useFsEvents") && (opts.useFsEvents = !opts.usePolling);
      FsEventsHandler.canUse() || (opts.useFsEvents = !1), undef(opts, "usePolling") && !opts.useFsEvents && (opts.usePolling = isMacos);
      const envPoll = process.env.CHOKIDAR_USEPOLLING;
      if (void 0 !== envPoll) {
        const envLower = envPoll.toLowerCase();
        opts.usePolling = "false" !== envLower && "0" !== envLower && ("true" === envLower || "1" === envLower || !!envLower);
      }
      const envInterval = process.env.CHOKIDAR_INTERVAL;
      envInterval && (opts.interval = Number.parseInt(envInterval, 10)), undef(opts, "atomic") && (opts.atomic = !opts.usePolling && !opts.useFsEvents), 
      opts.atomic && (this._pendingUnlinks = new Map), undef(opts, "followSymlinks") && (opts.followSymlinks = !0), 
      undef(opts, "awaitWriteFinish") && (opts.awaitWriteFinish = !1), !0 === opts.awaitWriteFinish && (opts.awaitWriteFinish = {});
      const awf = opts.awaitWriteFinish;
      awf && (awf.stabilityThreshold || (awf.stabilityThreshold = 2e3), awf.pollInterval || (awf.pollInterval = 100), 
      this._pendingWrites = new Map), opts.ignored && (opts.ignored = arrify(opts.ignored));
      let readyCalls = 0;
      this._emitReady = () => {
        readyCalls++, readyCalls >= this._readyCount && (this._emitReady = EMPTY_FN, this._readyEmitted = !0, 
        process.nextTick(() => this.emit(EV_READY)));
      }, this._emitRaw = (...args) => this.emit(EV_RAW, ...args), this._readyEmitted = !1, 
      this.options = opts, opts.useFsEvents ? this._fsEventsHandler = new FsEventsHandler(this) : this._nodeFsHandler = new NodeFsHandler(this), 
      Object.freeze(opts);
    }
    add(paths_, _origAdd, _internal) {
      const {cwd: cwd, disableGlobbing: disableGlobbing} = this.options;
      this.closed = !1;
      let paths = unifyPaths(paths_);
      return cwd && (paths = paths.map(path => {
        const absPath = ((path, cwd) => sysPath.isAbsolute(path) ? path : path.startsWith(BANG) ? BANG + sysPath.join(cwd, path.slice(1)) : sysPath.join(cwd, path))(path, cwd);
        return disableGlobbing || !isGlob(path) ? absPath : normalizePath(absPath);
      })), paths = paths.filter(path => path.startsWith(BANG) ? (this._ignoredPaths.add(path.slice(1)), 
      !1) : (this._ignoredPaths.delete(path), this._ignoredPaths.delete(path + SLASH_GLOBSTAR), 
      this._userIgnored = void 0, !0)), this.options.useFsEvents && this._fsEventsHandler ? (this._readyCount || (this._readyCount = paths.length), 
      this.options.persistent && (this._readyCount *= 2), paths.forEach(path => this._fsEventsHandler._addToFsEvents(path))) : (this._readyCount || (this._readyCount = 0), 
      this._readyCount += paths.length, Promise.all(paths.map(async path => {
        const res = await this._nodeFsHandler._addToNodeFs(path, !_internal, 0, 0, _origAdd);
        return res && this._emitReady(), res;
      })).then(results => {
        this.closed || results.filter(item => item).forEach(item => {
          this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
        });
      })), this;
    }
    unwatch(paths_) {
      if (this.closed) return this;
      const paths = unifyPaths(paths_), {cwd: cwd} = this.options;
      return paths.forEach(path => {
        sysPath.isAbsolute(path) || this._closers.has(path) || (cwd && (path = sysPath.join(cwd, path)), 
        path = sysPath.resolve(path)), this._closePath(path), this._ignoredPaths.add(path), 
        this._watched.has(path) && this._ignoredPaths.add(path + SLASH_GLOBSTAR), this._userIgnored = void 0;
      }), this;
    }
    close() {
      if (this.closed) return this._closePromise;
      this.closed = !0, this.removeAllListeners();
      const closers = [];
      return this._closers.forEach(closerList => closerList.forEach(closer => {
        const promise = closer();
        promise instanceof Promise && closers.push(promise);
      })), this._streams.forEach(stream => stream.destroy()), this._userIgnored = void 0, 
      this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach(dirent => dirent.dispose()), 
      [ "closers", "watched", "streams", "symlinkPaths", "throttled" ].forEach(key => {
        this["_" + key].clear();
      }), this._closePromise = closers.length ? Promise.all(closers).then(() => {}) : Promise.resolve(), 
      this._closePromise;
    }
    getWatched() {
      const watchList = {};
      return this._watched.forEach((entry, dir) => {
        const key = this.options.cwd ? sysPath.relative(this.options.cwd, dir) : dir;
        watchList[key || ONE_DOT] = entry.getChildren().sort();
      }), watchList;
    }
    emitWithAll(event, args) {
      this.emit(...args), event !== EV_ERROR && this.emit(EV_ALL, ...args);
    }
    async _emit(event, path, val1, val2, val3) {
      if (this.closed) return;
      const opts = this.options;
      isWindows && (path = sysPath.normalize(path)), opts.cwd && (path = sysPath.relative(opts.cwd, path));
      const args = [ event, path ];
      void 0 !== val3 ? args.push(val1, val2, val3) : void 0 !== val2 ? args.push(val1, val2) : void 0 !== val1 && args.push(val1);
      const awf = opts.awaitWriteFinish;
      let pw;
      if (awf && (pw = this._pendingWrites.get(path))) return pw.lastChange = new Date, 
      this;
      if (opts.atomic) {
        if (event === EV_UNLINK) return this._pendingUnlinks.set(path, args), setTimeout(() => {
          this._pendingUnlinks.forEach((entry, path) => {
            this.emit(...entry), this.emit(EV_ALL, ...entry), this._pendingUnlinks.delete(path);
          });
        }, "number" == typeof opts.atomic ? opts.atomic : 100), this;
        event === EV_ADD && this._pendingUnlinks.has(path) && (event = args[0] = EV_CHANGE, 
        this._pendingUnlinks.delete(path));
      }
      if (awf && (event === EV_ADD || event === EV_CHANGE) && this._readyEmitted) {
        const awfEmit = (err, stats) => {
          err ? (event = args[0] = EV_ERROR, args[1] = err, this.emitWithAll(event, args)) : stats && (args.length > 2 ? args[2] = stats : args.push(stats), 
          this.emitWithAll(event, args));
        };
        return this._awaitWriteFinish(path, awf.stabilityThreshold, event, awfEmit), this;
      }
      if (event === EV_CHANGE) {
        if (!this._throttle(EV_CHANGE, path, 50)) return this;
      }
      if (opts.alwaysStat && void 0 === val1 && (event === EV_ADD || event === EV_ADD_DIR || event === EV_CHANGE)) {
        const fullPath = opts.cwd ? sysPath.join(opts.cwd, path) : path;
        let stats;
        try {
          stats = await stat(fullPath);
        } catch (err) {}
        if (!stats || this.closed) return;
        args.push(stats);
      }
      return this.emitWithAll(event, args), this;
    }
    _handleError(error) {
      const code = error && error.code;
      return error && "ENOENT" !== code && "ENOTDIR" !== code && (!this.options.ignorePermissionErrors || "EPERM" !== code && "EACCES" !== code) && this.emit(EV_ERROR, error), 
      error || this.closed;
    }
    _throttle(actionType, path, timeout) {
      this._throttled.has(actionType) || this._throttled.set(actionType, new Map);
      const action = this._throttled.get(actionType), actionPath = action.get(path);
      if (actionPath) return actionPath.count++, !1;
      let timeoutObject;
      const clear = () => {
        const item = action.get(path), count = item ? item.count : 0;
        return action.delete(path), clearTimeout(timeoutObject), item && clearTimeout(item.timeoutObject), 
        count;
      };
      timeoutObject = setTimeout(clear, timeout);
      const thr = {
        timeoutObject: timeoutObject,
        clear: clear,
        count: 0
      };
      return action.set(path, thr), thr;
    }
    _incrReadyCount() {
      return this._readyCount++;
    }
    _awaitWriteFinish(path, threshold, event, awfEmit) {
      let timeoutHandler, fullPath = path;
      this.options.cwd && !sysPath.isAbsolute(path) && (fullPath = sysPath.join(this.options.cwd, path));
      const now = new Date, awaitWriteFinish = prevStat => {
        fs.stat(fullPath, (err, curStat) => {
          if (err || !this._pendingWrites.has(path)) return void (err && "ENOENT" !== err.code && awfEmit(err));
          const now = Number(new Date);
          prevStat && curStat.size !== prevStat.size && (this._pendingWrites.get(path).lastChange = now);
          now - this._pendingWrites.get(path).lastChange >= threshold ? (this._pendingWrites.delete(path), 
          awfEmit(void 0, curStat)) : timeoutHandler = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval, curStat);
        });
      };
      this._pendingWrites.has(path) || (this._pendingWrites.set(path, {
        lastChange: now,
        cancelWait: () => (this._pendingWrites.delete(path), clearTimeout(timeoutHandler), 
        event)
      }), timeoutHandler = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval));
    }
    _getGlobIgnored() {
      return [ ...this._ignoredPaths.values() ];
    }
    _isIgnored(path, stats) {
      if (this.options.atomic && DOT_RE.test(path)) return !0;
      if (!this._userIgnored) {
        const {cwd: cwd} = this.options, ign = this.options.ignored, ignored = ign && ign.map(normalizeIgnored(cwd)), paths = arrify(ignored).filter(path => typeof path === STRING_TYPE && !isGlob(path)).map(path => path + SLASH_GLOBSTAR), list = this._getGlobIgnored().map(normalizeIgnored(cwd)).concat(ignored, paths);
        this._userIgnored = anymatch(list, void 0, ANYMATCH_OPTS);
      }
      return this._userIgnored([ path, stats ]);
    }
    _isntIgnored(path, stat) {
      return !this._isIgnored(path, stat);
    }
    _getWatchHelpers(path, depth) {
      const watchPath = depth || this.options.disableGlobbing || !isGlob(path) ? path : globParent(path), follow = this.options.followSymlinks;
      return new WatchHelper(path, watchPath, follow, this);
    }
    _getWatchedDir(directory) {
      this._boundRemove || (this._boundRemove = this._remove.bind(this));
      const dir = sysPath.resolve(directory);
      return this._watched.has(dir) || this._watched.set(dir, new DirEntry(dir, this._boundRemove)), 
      this._watched.get(dir);
    }
    _hasReadPermissions(stats) {
      if (this.options.ignorePermissionErrors) return !0;
      const st = 511 & (stats && Number.parseInt(stats.mode, 10)), it = Number.parseInt(st.toString(8)[0], 10);
      return Boolean(4 & it);
    }
    _remove(directory, item, isDirectory) {
      const path = sysPath.join(directory, item), fullPath = sysPath.resolve(path);
      if (isDirectory = null != isDirectory ? isDirectory : this._watched.has(path) || this._watched.has(fullPath), 
      !this._throttle("remove", path, 100)) return;
      isDirectory || this.options.useFsEvents || 1 !== this._watched.size || this.add(directory, item, !0);
      this._getWatchedDir(path).getChildren().forEach(nested => this._remove(path, nested));
      const parent = this._getWatchedDir(directory), wasTracked = parent.has(item);
      parent.remove(item);
      let relPath = path;
      if (this.options.cwd && (relPath = sysPath.relative(this.options.cwd, path)), this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
        if (this._pendingWrites.get(relPath).cancelWait() === EV_ADD) return;
      }
      this._watched.delete(path), this._watched.delete(fullPath);
      const eventName = isDirectory ? EV_UNLINK_DIR : EV_UNLINK;
      wasTracked && !this._isIgnored(path) && this._emit(eventName, path), this.options.useFsEvents || this._closePath(path);
    }
    _closePath(path) {
      this._closeFile(path);
      const dir = sysPath.dirname(path);
      this._getWatchedDir(dir).remove(sysPath.basename(path));
    }
    _closeFile(path) {
      const closers = this._closers.get(path);
      closers && (closers.forEach(closer => closer()), this._closers.delete(path));
    }
    _addPathCloser(path, closer) {
      if (!closer) return;
      let list = this._closers.get(path);
      list || (list = [], this._closers.set(path, list)), list.push(closer);
    }
    _readdirp(root, opts) {
      if (this.closed) return;
      const options = {
        type: EV_ALL,
        alwaysStat: !0,
        lstat: !0,
        ...opts
      };
      let stream = readdirp(root, options);
      return this._streams.add(stream), stream.once(STR_CLOSE, () => {
        stream = void 0;
      }), stream.once(STR_END, () => {
        stream && (this._streams.delete(stream), stream = void 0);
      }), stream;
    }
  }
  exports.FSWatcher = FSWatcher;
  exports.watch = (paths, options) => {
    const watcher = new FSWatcher(options);
    return watcher.add(paths), watcher;
  };
}, function(module, exports) {
  module.exports = require("events");
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(2), {Readable: Readable} = __webpack_require__(15), sysPath = __webpack_require__(0), {promisify: promisify} = __webpack_require__(1), picomatch = __webpack_require__(8), readdir = promisify(fs.readdir), stat = promisify(fs.stat), lstat = promisify(fs.lstat), realpath = promisify(fs.realpath), NORMAL_FLOW_ERRORS = new Set([ "ENOENT", "EPERM", "EACCES", "ELOOP" ]), FILE_TYPE = "files", DIR_TYPE = "directories", FILE_DIR_TYPE = "files_directories", EVERYTHING_TYPE = "all", ALL_TYPES = [ FILE_TYPE, DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE ], normalizeFilter = filter => {
    if (void 0 !== filter) {
      if ("function" == typeof filter) return filter;
      if ("string" == typeof filter) {
        const glob = picomatch(filter.trim());
        return entry => glob(entry.basename);
      }
      if (Array.isArray(filter)) {
        const positive = [], negative = [];
        for (const item of filter) {
          const trimmed = item.trim();
          "!" === trimmed.charAt(0) ? negative.push(picomatch(trimmed.slice(1))) : positive.push(picomatch(trimmed));
        }
        return negative.length > 0 ? positive.length > 0 ? entry => positive.some(f => f(entry.basename)) && !negative.some(f => f(entry.basename)) : entry => !negative.some(f => f(entry.basename)) : entry => positive.some(f => f(entry.basename));
      }
    }
  };
  class ReaddirpStream extends Readable {
    static get defaultOptions() {
      return {
        root: ".",
        fileFilter: path => !0,
        directoryFilter: path => !0,
        type: FILE_TYPE,
        lstat: !1,
        depth: 2147483648,
        alwaysStat: !1
      };
    }
    constructor(options = {}) {
      super({
        objectMode: !0,
        autoDestroy: !0,
        highWaterMark: options.highWaterMark || 4096
      });
      const opts = {
        ...ReaddirpStream.defaultOptions,
        ...options
      }, {root: root, type: type} = opts;
      this._fileFilter = normalizeFilter(opts.fileFilter), this._directoryFilter = normalizeFilter(opts.directoryFilter);
      const statMethod = opts.lstat ? lstat : stat;
      "win32" === process.platform && 3 === stat.length ? this._stat = path => statMethod(path, {
        bigint: !0
      }) : this._stat = statMethod, this._maxDepth = opts.depth, this._wantsDir = [ DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE ].includes(type), 
      this._wantsFile = [ FILE_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE ].includes(type), 
      this._wantsEverything = type === EVERYTHING_TYPE, this._root = sysPath.resolve(root), 
      this._isDirent = "Dirent" in fs && !opts.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", 
      this._rdOptions = {
        encoding: "utf8",
        withFileTypes: this._isDirent
      }, this.parents = [ this._exploreDir(root, 1) ], this.reading = !1, this.parent = void 0;
    }
    async _read(batch) {
      if (!this.reading) {
        this.reading = !0;
        try {
          for (;!this.destroyed && batch > 0; ) {
            const {path: path, depth: depth, files: files = []} = this.parent || {};
            if (files.length > 0) {
              const slice = files.splice(0, batch).map(dirent => this._formatEntry(dirent, path));
              for (const entry of await Promise.all(slice)) {
                if (this.destroyed) return;
                const entryType = await this._getEntryType(entry);
                "directory" === entryType && this._directoryFilter(entry) ? (depth <= this._maxDepth && this.parents.push(this._exploreDir(entry.fullPath, depth + 1)), 
                this._wantsDir && (this.push(entry), batch--)) : ("file" === entryType || this._includeAsFile(entry)) && this._fileFilter(entry) && this._wantsFile && (this.push(entry), 
                batch--);
              }
            } else {
              const parent = this.parents.pop();
              if (!parent) {
                this.push(null);
                break;
              }
              if (this.parent = await parent, this.destroyed) return;
            }
          }
        } catch (error) {
          this.destroy(error);
        } finally {
          this.reading = !1;
        }
      }
    }
    async _exploreDir(path, depth) {
      let files;
      try {
        files = await readdir(path, this._rdOptions);
      } catch (error) {
        this._onError(error);
      }
      return {
        files: files,
        depth: depth,
        path: path
      };
    }
    async _formatEntry(dirent, path) {
      let entry;
      try {
        const basename = this._isDirent ? dirent.name : dirent, fullPath = sysPath.resolve(sysPath.join(path, basename));
        entry = {
          path: sysPath.relative(this._root, fullPath),
          fullPath: fullPath,
          basename: basename
        }, entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
      } catch (err) {
        this._onError(err);
      }
      return entry;
    }
    _onError(err) {
      var error;
      error = err, NORMAL_FLOW_ERRORS.has(error.code) && !this.destroyed ? this.emit("warn", err) : this.destroy(err);
    }
    async _getEntryType(entry) {
      const stats = entry && entry[this._statsProp];
      if (stats) {
        if (stats.isFile()) return "file";
        if (stats.isDirectory()) return "directory";
        if (stats && stats.isSymbolicLink()) try {
          const entryRealPath = await realpath(entry.fullPath), entryRealPathStats = await lstat(entryRealPath);
          if (entryRealPathStats.isFile()) return "file";
          if (entryRealPathStats.isDirectory()) return "directory";
        } catch (error) {
          this._onError(error);
        }
      }
    }
    _includeAsFile(entry) {
      const stats = entry && entry[this._statsProp];
      return stats && this._wantsEverything && !stats.isDirectory();
    }
  }
  const readdirp = (root, options = {}) => {
    let type = options.entryType || options.type;
    if ("both" === type && (type = FILE_DIR_TYPE), type && (options.type = type), !root) throw new Error("readdirp: root argument is required. Usage: readdirp(root, options)");
    if ("string" != typeof root) throw new TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
    if (type && !ALL_TYPES.includes(type)) throw new Error("readdirp: Invalid type passed. Use one of " + ALL_TYPES.join(", "));
    return options.root = root, new ReaddirpStream(options);
  };
  readdirp.promise = (root, options = {}) => new Promise((resolve, reject) => {
    const files = [];
    readdirp(root, options).on("data", entry => files.push(entry)).on("end", () => resolve(files)).on("error", error => reject(error));
  }), readdirp.ReaddirpStream = ReaddirpStream, readdirp.default = readdirp, module.exports = readdirp;
}, function(module, exports) {
  module.exports = require("stream");
}, function(module, exports, __webpack_require__) {
  const utils = __webpack_require__(4), {CHAR_ASTERISK: CHAR_ASTERISK, CHAR_AT: CHAR_AT, CHAR_BACKWARD_SLASH: CHAR_BACKWARD_SLASH, CHAR_COMMA: CHAR_COMMA, CHAR_DOT: CHAR_DOT, CHAR_EXCLAMATION_MARK: CHAR_EXCLAMATION_MARK, CHAR_FORWARD_SLASH: CHAR_FORWARD_SLASH, CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE, CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES, CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET, CHAR_PLUS: CHAR_PLUS, CHAR_QUESTION_MARK: CHAR_QUESTION_MARK, CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE, CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES, CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET} = __webpack_require__(3), isPathSeparator = code => code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH, depth = token => {
    !0 !== token.isPrefix && (token.depth = token.isGlobstar ? 1 / 0 : 1);
  };
  module.exports = (input, options) => {
    const opts = options || {}, length = input.length - 1, scanToEnd = !0 === opts.parts || !0 === opts.scanToEnd, slashes = [], tokens = [], parts = [];
    let prev, code, str = input, index = -1, start = 0, lastIndex = 0, isBrace = !1, isBracket = !1, isGlob = !1, isExtglob = !1, isGlobstar = !1, braceEscaped = !1, backslashes = !1, negated = !1, negatedExtglob = !1, finished = !1, braces = 0, token = {
      value: "",
      depth: 0,
      isGlob: !1
    };
    const eos = () => index >= length, advance = () => (prev = code, str.charCodeAt(++index));
    for (;index < length; ) {
      let next;
      if (code = advance(), code !== CHAR_BACKWARD_SLASH) {
        if (!0 === braceEscaped || code === CHAR_LEFT_CURLY_BRACE) {
          for (braces++; !0 !== eos() && (code = advance()); ) if (code !== CHAR_BACKWARD_SLASH) if (code !== CHAR_LEFT_CURLY_BRACE) {
            if (!0 !== braceEscaped && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              if (isBrace = token.isBrace = !0, isGlob = token.isGlob = !0, finished = !0, !0 === scanToEnd) continue;
              break;
            }
            if (!0 !== braceEscaped && code === CHAR_COMMA) {
              if (isBrace = token.isBrace = !0, isGlob = token.isGlob = !0, finished = !0, !0 === scanToEnd) continue;
              break;
            }
            if (code === CHAR_RIGHT_CURLY_BRACE && (braces--, 0 === braces)) {
              braceEscaped = !1, isBrace = token.isBrace = !0, finished = !0;
              break;
            }
          } else braces++; else backslashes = token.backslashes = !0, advance();
          if (!0 === scanToEnd) continue;
          break;
        }
        if (code !== CHAR_FORWARD_SLASH) {
          if (!0 !== opts.noext) {
            if (!0 === (code === CHAR_PLUS || code === CHAR_AT || code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK || code === CHAR_EXCLAMATION_MARK) && str.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES) {
              if (isGlob = token.isGlob = !0, isExtglob = token.isExtglob = !0, finished = !0, 
              code === CHAR_EXCLAMATION_MARK && index === start && (negatedExtglob = !0), !0 === scanToEnd) {
                for (;!0 !== eos() && (code = advance()); ) if (code !== CHAR_BACKWARD_SLASH) {
                  if (code === CHAR_RIGHT_PARENTHESES) {
                    isGlob = token.isGlob = !0, finished = !0;
                    break;
                  }
                } else backslashes = token.backslashes = !0, code = advance();
                continue;
              }
              break;
            }
          }
          if (code === CHAR_ASTERISK) {
            if (prev === CHAR_ASTERISK && (isGlobstar = token.isGlobstar = !0), isGlob = token.isGlob = !0, 
            finished = !0, !0 === scanToEnd) continue;
            break;
          }
          if (code === CHAR_QUESTION_MARK) {
            if (isGlob = token.isGlob = !0, finished = !0, !0 === scanToEnd) continue;
            break;
          }
          if (code === CHAR_LEFT_SQUARE_BRACKET) {
            for (;!0 !== eos() && (next = advance()); ) if (next !== CHAR_BACKWARD_SLASH) {
              if (next === CHAR_RIGHT_SQUARE_BRACKET) {
                isBracket = token.isBracket = !0, isGlob = token.isGlob = !0, finished = !0;
                break;
              }
            } else backslashes = token.backslashes = !0, advance();
            if (!0 === scanToEnd) continue;
            break;
          }
          if (!0 === opts.nonegate || code !== CHAR_EXCLAMATION_MARK || index !== start) {
            if (!0 !== opts.noparen && code === CHAR_LEFT_PARENTHESES) {
              if (isGlob = token.isGlob = !0, !0 === scanToEnd) {
                for (;!0 !== eos() && (code = advance()); ) if (code !== CHAR_LEFT_PARENTHESES) {
                  if (code === CHAR_RIGHT_PARENTHESES) {
                    finished = !0;
                    break;
                  }
                } else backslashes = token.backslashes = !0, code = advance();
                continue;
              }
              break;
            }
            if (!0 === isGlob) {
              if (finished = !0, !0 === scanToEnd) continue;
              break;
            }
          } else negated = token.negated = !0, start++;
        } else {
          if (slashes.push(index), tokens.push(token), token = {
            value: "",
            depth: 0,
            isGlob: !1
          }, !0 === finished) continue;
          if (prev === CHAR_DOT && index === start + 1) {
            start += 2;
            continue;
          }
          lastIndex = index + 1;
        }
      } else backslashes = token.backslashes = !0, code = advance(), code === CHAR_LEFT_CURLY_BRACE && (braceEscaped = !0);
    }
    !0 === opts.noext && (isExtglob = !1, isGlob = !1);
    let base = str, prefix = "", glob = "";
    start > 0 && (prefix = str.slice(0, start), str = str.slice(start), lastIndex -= start), 
    base && !0 === isGlob && lastIndex > 0 ? (base = str.slice(0, lastIndex), glob = str.slice(lastIndex)) : !0 === isGlob ? (base = "", 
    glob = str) : base = str, base && "" !== base && "/" !== base && base !== str && isPathSeparator(base.charCodeAt(base.length - 1)) && (base = base.slice(0, -1)), 
    !0 === opts.unescape && (glob && (glob = utils.removeBackslashes(glob)), base && !0 === backslashes && (base = utils.removeBackslashes(base)));
    const state = {
      prefix: prefix,
      input: input,
      start: start,
      base: base,
      glob: glob,
      isBrace: isBrace,
      isBracket: isBracket,
      isGlob: isGlob,
      isExtglob: isExtglob,
      isGlobstar: isGlobstar,
      negated: negated,
      negatedExtglob: negatedExtglob
    };
    if (!0 === opts.tokens && (state.maxDepth = 0, isPathSeparator(code) || tokens.push(token), 
    state.tokens = tokens), !0 === opts.parts || !0 === opts.tokens) {
      let prevIndex;
      for (let idx = 0; idx < slashes.length; idx++) {
        const n = prevIndex ? prevIndex + 1 : start, i = slashes[idx], value = input.slice(n, i);
        opts.tokens && (0 === idx && 0 !== start ? (tokens[idx].isPrefix = !0, tokens[idx].value = prefix) : tokens[idx].value = value, 
        depth(tokens[idx]), state.maxDepth += tokens[idx].depth), 0 === idx && "" === value || parts.push(value), 
        prevIndex = i;
      }
      if (prevIndex && prevIndex + 1 < input.length) {
        const value = input.slice(prevIndex + 1);
        parts.push(value), opts.tokens && (tokens[tokens.length - 1].value = value, depth(tokens[tokens.length - 1]), 
        state.maxDepth += tokens[tokens.length - 1].depth);
      }
      state.slashes = slashes, state.parts = parts;
    }
    return state;
  };
}, function(module, exports, __webpack_require__) {
  const constants = __webpack_require__(3), utils = __webpack_require__(4), {MAX_LENGTH: MAX_LENGTH, POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE, REGEX_NON_SPECIAL_CHARS: REGEX_NON_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_BACKREF: REGEX_SPECIAL_CHARS_BACKREF, REPLACEMENTS: REPLACEMENTS} = constants, expandRange = (args, options) => {
    if ("function" == typeof options.expandRange) return options.expandRange(...args, options);
    args.sort();
    const value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map(v => utils.escapeRegex(v)).join("..");
    }
    return value;
  }, syntaxError = (type, char) => `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`, parse = (input, options) => {
    if ("string" != typeof input) throw new TypeError("Expected a string");
    input = REPLACEMENTS[input] || input;
    const opts = {
      ...options
    }, max = "number" == typeof opts.maxLength ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    const bos = {
      type: "bos",
      value: "",
      output: opts.prepend || ""
    }, tokens = [ bos ], capture = opts.capture ? "" : "?:", win32 = utils.isWindows(options), PLATFORM_CHARS = constants.globChars(win32), EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS), {DOT_LITERAL: DOT_LITERAL, PLUS_LITERAL: PLUS_LITERAL, SLASH_LITERAL: SLASH_LITERAL, ONE_CHAR: ONE_CHAR, DOTS_SLASH: DOTS_SLASH, NO_DOT: NO_DOT, NO_DOT_SLASH: NO_DOT_SLASH, NO_DOTS_SLASH: NO_DOTS_SLASH, QMARK: QMARK, QMARK_NO_DOT: QMARK_NO_DOT, STAR: STAR, START_ANCHOR: START_ANCHOR} = PLATFORM_CHARS, globstar = opts => `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`, nodot = opts.dot ? "" : NO_DOT, qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    let star = !0 === opts.bash ? globstar(opts) : STAR;
    opts.capture && (star = `(${star})`), "boolean" == typeof opts.noext && (opts.noextglob = opts.noext);
    const state = {
      input: input,
      index: -1,
      start: 0,
      dot: !0 === opts.dot,
      consumed: "",
      output: "",
      prefix: "",
      backtrack: !1,
      negated: !1,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      globstar: !1,
      tokens: tokens
    };
    input = utils.removePrefix(input, state), len = input.length;
    const extglobs = [], braces = [], stack = [];
    let value, prev = bos;
    const eos = () => state.index === len - 1, peek = state.peek = (n = 1) => input[state.index + n], advance = state.advance = () => input[++state.index] || "", remaining = () => input.slice(state.index + 1), consume = (value = "", num = 0) => {
      state.consumed += value, state.index += num;
    }, append = token => {
      state.output += null != token.output ? token.output : token.value, consume(token.value);
    }, negate = () => {
      let count = 1;
      for (;"!" === peek() && ("(" !== peek(2) || "?" === peek(3)); ) advance(), state.start++, 
      count++;
      return count % 2 != 0 && (state.negated = !0, state.start++, !0);
    }, increment = type => {
      state[type]++, stack.push(type);
    }, decrement = type => {
      state[type]--, stack.pop();
    }, push = tok => {
      if ("globstar" === prev.type) {
        const isBrace = state.braces > 0 && ("comma" === tok.type || "brace" === tok.type), isExtglob = !0 === tok.extglob || extglobs.length && ("pipe" === tok.type || "paren" === tok.type);
        "slash" === tok.type || "paren" === tok.type || isBrace || isExtglob || (state.output = state.output.slice(0, -prev.output.length), 
        prev.type = "star", prev.value = "*", prev.output = star, state.output += prev.output);
      }
      if (extglobs.length && "paren" !== tok.type && (extglobs[extglobs.length - 1].inner += tok.value), 
      (tok.value || tok.output) && append(tok), prev && "text" === prev.type && "text" === tok.type) return prev.value += tok.value, 
      void (prev.output = (prev.output || "") + tok.value);
      tok.prev = prev, tokens.push(tok), prev = tok;
    }, extglobOpen = (type, value) => {
      const token = {
        ...EXTGLOB_CHARS[value],
        conditions: 1,
        inner: ""
      };
      token.prev = prev, token.parens = state.parens, token.output = state.output;
      const output = (opts.capture ? "(" : "") + token.open;
      increment("parens"), push({
        type: type,
        value: value,
        output: state.output ? "" : ONE_CHAR
      }), push({
        type: "paren",
        extglob: !0,
        value: advance(),
        output: output
      }), extglobs.push(token);
    }, extglobClose = token => {
      let rest, output = token.close + (opts.capture ? ")" : "");
      if ("negate" === token.type) {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/") && (extglobStar = globstar(opts)), 
        (extglobStar !== star || eos() || /^\)+$/.test(remaining())) && (output = token.close = ")$))" + extglobStar), 
        token.inner.includes("*") && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
          const expression = parse(rest, {
            ...options,
            fastpaths: !1
          }).output;
          output = token.close = `)${expression})${extglobStar})`;
        }
        "bos" === token.prev.type && (state.negatedExtglob = !0);
      }
      push({
        type: "paren",
        extglob: !0,
        value: value,
        output: output
      }), decrement("parens");
    };
    if (!1 !== opts.fastpaths && !/(^[*!]|[/()[\]{}"])/.test(input)) {
      let backslashes = !1, output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => "\\" === first ? (backslashes = !0, 
      m) : "?" === first ? esc ? esc + first + (rest ? QMARK.repeat(rest.length) : "") : 0 === index ? qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "") : QMARK.repeat(chars.length) : "." === first ? DOT_LITERAL.repeat(chars.length) : "*" === first ? esc ? esc + first + (rest ? star : "") : star : esc ? m : "\\" + m);
      return !0 === backslashes && (output = !0 === opts.unescape ? output.replace(/\\/g, "") : output.replace(/\\+/g, m => m.length % 2 == 0 ? "\\\\" : m ? "\\" : "")), 
      output === input && !0 === opts.contains ? (state.output = input, state) : (state.output = utils.wrapOutput(output, state, options), 
      state);
    }
    for (;!eos(); ) {
      if (value = advance(), "\0" === value) continue;
      if ("\\" === value) {
        const next = peek();
        if ("/" === next && !0 !== opts.bash) continue;
        if ("." === next || ";" === next) continue;
        if (!next) {
          value += "\\", push({
            type: "text",
            value: value
          });
          continue;
        }
        const match = /^\\+/.exec(remaining());
        let slashes = 0;
        if (match && match[0].length > 2 && (slashes = match[0].length, state.index += slashes, 
        slashes % 2 != 0 && (value += "\\")), !0 === opts.unescape ? value = advance() : value += advance(), 
        0 === state.brackets) {
          push({
            type: "text",
            value: value
          });
          continue;
        }
      }
      if (state.brackets > 0 && ("]" !== value || "[" === prev.value || "[^" === prev.value)) {
        if (!1 !== opts.posix && ":" === value) {
          const inner = prev.value.slice(1);
          if (inner.includes("[") && (prev.posix = !0, inner.includes(":"))) {
            const idx = prev.value.lastIndexOf("["), pre = prev.value.slice(0, idx), rest = prev.value.slice(idx + 2), posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix, state.backtrack = !0, advance(), bos.output || 1 !== tokens.indexOf(prev) || (bos.output = ONE_CHAR);
              continue;
            }
          }
        }
        ("[" === value && ":" !== peek() || "-" === value && "]" === peek()) && (value = "\\" + value), 
        "]" !== value || "[" !== prev.value && "[^" !== prev.value || (value = "\\" + value), 
        !0 === opts.posix && "!" === value && "[" === prev.value && (value = "^"), prev.value += value, 
        append({
          value: value
        });
        continue;
      }
      if (1 === state.quotes && '"' !== value) {
        value = utils.escapeRegex(value), prev.value += value, append({
          value: value
        });
        continue;
      }
      if ('"' === value) {
        state.quotes = 1 === state.quotes ? 0 : 1, !0 === opts.keepQuotes && push({
          type: "text",
          value: value
        });
        continue;
      }
      if ("(" === value) {
        increment("parens"), push({
          type: "paren",
          value: value
        });
        continue;
      }
      if (")" === value) {
        if (0 === state.parens && !0 === opts.strictBrackets) throw new SyntaxError(syntaxError("opening", "("));
        const extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({
          type: "paren",
          value: value,
          output: state.parens ? ")" : "\\)"
        }), decrement("parens");
        continue;
      }
      if ("[" === value) {
        if (!0 !== opts.nobracket && remaining().includes("]")) increment("brackets"); else {
          if (!0 !== opts.nobracket && !0 === opts.strictBrackets) throw new SyntaxError(syntaxError("closing", "]"));
          value = "\\" + value;
        }
        push({
          type: "bracket",
          value: value
        });
        continue;
      }
      if ("]" === value) {
        if (!0 === opts.nobracket || prev && "bracket" === prev.type && 1 === prev.value.length) {
          push({
            type: "text",
            value: value,
            output: "\\" + value
          });
          continue;
        }
        if (0 === state.brackets) {
          if (!0 === opts.strictBrackets) throw new SyntaxError(syntaxError("opening", "["));
          push({
            type: "text",
            value: value,
            output: "\\" + value
          });
          continue;
        }
        decrement("brackets");
        const prevValue = prev.value.slice(1);
        if (!0 === prev.posix || "^" !== prevValue[0] || prevValue.includes("/") || (value = "/" + value), 
        prev.value += value, append({
          value: value
        }), !1 === opts.literalBrackets || utils.hasRegexChars(prevValue)) continue;
        const escaped = utils.escapeRegex(prev.value);
        if (state.output = state.output.slice(0, -prev.value.length), !0 === opts.literalBrackets) {
          state.output += escaped, prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`, state.output += prev.value;
        continue;
      }
      if ("{" === value && !0 !== opts.nobrace) {
        increment("braces");
        const open = {
          type: "brace",
          value: value,
          output: "(",
          outputIndex: state.output.length,
          tokensIndex: state.tokens.length
        };
        braces.push(open), push(open);
        continue;
      }
      if ("}" === value) {
        const brace = braces[braces.length - 1];
        if (!0 === opts.nobrace || !brace) {
          push({
            type: "text",
            value: value,
            output: value
          });
          continue;
        }
        let output = ")";
        if (!0 === brace.dots) {
          const arr = tokens.slice(), range = [];
          for (let i = arr.length - 1; i >= 0 && (tokens.pop(), "brace" !== arr[i].type); i--) "dots" !== arr[i].type && range.unshift(arr[i].value);
          output = expandRange(range, opts), state.backtrack = !0;
        }
        if (!0 !== brace.comma && !0 !== brace.dots) {
          const out = state.output.slice(0, brace.outputIndex), toks = state.tokens.slice(brace.tokensIndex);
          brace.value = brace.output = "\\{", value = output = "\\}", state.output = out;
          for (const t of toks) state.output += t.output || t.value;
        }
        push({
          type: "brace",
          value: value,
          output: output
        }), decrement("braces"), braces.pop();
        continue;
      }
      if ("|" === value) {
        extglobs.length > 0 && extglobs[extglobs.length - 1].conditions++, push({
          type: "text",
          value: value
        });
        continue;
      }
      if ("," === value) {
        let output = value;
        const brace = braces[braces.length - 1];
        brace && "braces" === stack[stack.length - 1] && (brace.comma = !0, output = "|"), 
        push({
          type: "comma",
          value: value,
          output: output
        });
        continue;
      }
      if ("/" === value) {
        if ("dot" === prev.type && state.index === state.start + 1) {
          state.start = state.index + 1, state.consumed = "", state.output = "", tokens.pop(), 
          prev = bos;
          continue;
        }
        push({
          type: "slash",
          value: value,
          output: SLASH_LITERAL
        });
        continue;
      }
      if ("." === value) {
        if (state.braces > 0 && "dot" === prev.type) {
          "." === prev.value && (prev.output = DOT_LITERAL);
          const brace = braces[braces.length - 1];
          prev.type = "dots", prev.output += value, prev.value += value, brace.dots = !0;
          continue;
        }
        if (state.braces + state.parens === 0 && "bos" !== prev.type && "slash" !== prev.type) {
          push({
            type: "text",
            value: value,
            output: DOT_LITERAL
          });
          continue;
        }
        push({
          type: "dot",
          value: value,
          output: DOT_LITERAL
        });
        continue;
      }
      if ("?" === value) {
        if (!(prev && "(" === prev.value) && !0 !== opts.noextglob && "(" === peek() && "?" !== peek(2)) {
          extglobOpen("qmark", value);
          continue;
        }
        if (prev && "paren" === prev.type) {
          const next = peek();
          let output = value;
          if ("<" === next && !utils.supportsLookbehinds()) throw new Error("Node.js v10 or higher is required for regex lookbehinds");
          ("(" === prev.value && !/[!=<:]/.test(next) || "<" === next && !/<([!=]|\w+>)/.test(remaining())) && (output = "\\" + value), 
          push({
            type: "text",
            value: value,
            output: output
          });
          continue;
        }
        if (!0 !== opts.dot && ("slash" === prev.type || "bos" === prev.type)) {
          push({
            type: "qmark",
            value: value,
            output: QMARK_NO_DOT
          });
          continue;
        }
        push({
          type: "qmark",
          value: value,
          output: QMARK
        });
        continue;
      }
      if ("!" === value) {
        if (!0 !== opts.noextglob && "(" === peek() && ("?" !== peek(2) || !/[!=<:]/.test(peek(3)))) {
          extglobOpen("negate", value);
          continue;
        }
        if (!0 !== opts.nonegate && 0 === state.index) {
          negate();
          continue;
        }
      }
      if ("+" === value) {
        if (!0 !== opts.noextglob && "(" === peek() && "?" !== peek(2)) {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && "(" === prev.value || !1 === opts.regex) {
          push({
            type: "plus",
            value: value,
            output: PLUS_LITERAL
          });
          continue;
        }
        if (prev && ("bracket" === prev.type || "paren" === prev.type || "brace" === prev.type) || state.parens > 0) {
          push({
            type: "plus",
            value: value
          });
          continue;
        }
        push({
          type: "plus",
          value: PLUS_LITERAL
        });
        continue;
      }
      if ("@" === value) {
        if (!0 !== opts.noextglob && "(" === peek() && "?" !== peek(2)) {
          push({
            type: "at",
            extglob: !0,
            value: value,
            output: ""
          });
          continue;
        }
        push({
          type: "text",
          value: value
        });
        continue;
      }
      if ("*" !== value) {
        "$" !== value && "^" !== value || (value = "\\" + value);
        const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
        match && (value += match[0], state.index += match[0].length), push({
          type: "text",
          value: value
        });
        continue;
      }
      if (prev && ("globstar" === prev.type || !0 === prev.star)) {
        prev.type = "star", prev.star = !0, prev.value += value, prev.output = star, state.backtrack = !0, 
        state.globstar = !0, consume(value);
        continue;
      }
      let rest = remaining();
      if (!0 !== opts.noextglob && /^\([^?]/.test(rest)) {
        extglobOpen("star", value);
        continue;
      }
      if ("star" === prev.type) {
        if (!0 === opts.noglobstar) {
          consume(value);
          continue;
        }
        const prior = prev.prev, before = prior.prev, isStart = "slash" === prior.type || "bos" === prior.type, afterStar = before && ("star" === before.type || "globstar" === before.type);
        if (!0 === opts.bash && (!isStart || rest[0] && "/" !== rest[0])) {
          push({
            type: "star",
            value: value,
            output: ""
          });
          continue;
        }
        const isBrace = state.braces > 0 && ("comma" === prior.type || "brace" === prior.type), isExtglob = extglobs.length && ("pipe" === prior.type || "paren" === prior.type);
        if (!isStart && "paren" !== prior.type && !isBrace && !isExtglob) {
          push({
            type: "star",
            value: value,
            output: ""
          });
          continue;
        }
        for (;"/**" === rest.slice(0, 3); ) {
          const after = input[state.index + 4];
          if (after && "/" !== after) break;
          rest = rest.slice(3), consume("/**", 3);
        }
        if ("bos" === prior.type && eos()) {
          prev.type = "globstar", prev.value += value, prev.output = globstar(opts), state.output = prev.output, 
          state.globstar = !0, consume(value);
          continue;
        }
        if ("slash" === prior.type && "bos" !== prior.prev.type && !afterStar && eos()) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length), prior.output = "(?:" + prior.output, 
          prev.type = "globstar", prev.output = globstar(opts) + (opts.strictSlashes ? ")" : "|$)"), 
          prev.value += value, state.globstar = !0, state.output += prior.output + prev.output, 
          consume(value);
          continue;
        }
        if ("slash" === prior.type && "bos" !== prior.prev.type && "/" === rest[0]) {
          const end = void 0 !== rest[1] ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length), prior.output = "(?:" + prior.output, 
          prev.type = "globstar", prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`, 
          prev.value += value, state.output += prior.output + prev.output, state.globstar = !0, 
          consume(value + advance()), push({
            type: "slash",
            value: "/",
            output: ""
          });
          continue;
        }
        if ("bos" === prior.type && "/" === rest[0]) {
          prev.type = "globstar", prev.value += value, prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`, 
          state.output = prev.output, state.globstar = !0, consume(value + advance()), push({
            type: "slash",
            value: "/",
            output: ""
          });
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length), prev.type = "globstar", 
        prev.output = globstar(opts), prev.value += value, state.output += prev.output, 
        state.globstar = !0, consume(value);
        continue;
      }
      const token = {
        type: "star",
        value: value,
        output: star
      };
      !0 !== opts.bash ? !prev || "bracket" !== prev.type && "paren" !== prev.type || !0 !== opts.regex ? (state.index !== state.start && "slash" !== prev.type && "dot" !== prev.type || ("dot" === prev.type ? (state.output += NO_DOT_SLASH, 
      prev.output += NO_DOT_SLASH) : !0 === opts.dot ? (state.output += NO_DOTS_SLASH, 
      prev.output += NO_DOTS_SLASH) : (state.output += nodot, prev.output += nodot), "*" !== peek() && (state.output += ONE_CHAR, 
      prev.output += ONE_CHAR)), push(token)) : (token.output = value, push(token)) : (token.output = ".*?", 
      "bos" !== prev.type && "slash" !== prev.type || (token.output = nodot + token.output), 
      push(token));
    }
    for (;state.brackets > 0; ) {
      if (!0 === opts.strictBrackets) throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "["), decrement("brackets");
    }
    for (;state.parens > 0; ) {
      if (!0 === opts.strictBrackets) throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "("), decrement("parens");
    }
    for (;state.braces > 0; ) {
      if (!0 === opts.strictBrackets) throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{"), decrement("braces");
    }
    if (!0 === opts.strictSlashes || "star" !== prev.type && "bracket" !== prev.type || push({
      type: "maybe_slash",
      value: "",
      output: SLASH_LITERAL + "?"
    }), !0 === state.backtrack) {
      state.output = "";
      for (const token of state.tokens) state.output += null != token.output ? token.output : token.value, 
      token.suffix && (state.output += token.suffix);
    }
    return state;
  };
  parse.fastpaths = (input, options) => {
    const opts = {
      ...options
    }, max = "number" == typeof opts.maxLength ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH, len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    input = REPLACEMENTS[input] || input;
    const win32 = utils.isWindows(options), {DOT_LITERAL: DOT_LITERAL, SLASH_LITERAL: SLASH_LITERAL, ONE_CHAR: ONE_CHAR, DOTS_SLASH: DOTS_SLASH, NO_DOT: NO_DOT, NO_DOTS: NO_DOTS, NO_DOTS_SLASH: NO_DOTS_SLASH, STAR: STAR, START_ANCHOR: START_ANCHOR} = constants.globChars(win32), nodot = opts.dot ? NO_DOTS : NO_DOT, slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT, capture = opts.capture ? "" : "?:";
    let star = !0 === opts.bash ? ".*?" : STAR;
    opts.capture && (star = `(${star})`);
    const globstar = opts => !0 === opts.noglobstar ? star : `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`, create = str => {
      switch (str) {
       case "*":
        return `${nodot}${ONE_CHAR}${star}`;

       case ".*":
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

       case "*.*":
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

       case "*/*":
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

       case "**":
        return nodot + globstar(opts);

       case "**/*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

       case "**/*.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

       case "**/.*":
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

       default:
        {
          const match = /^(.*?)\.(\w+)$/.exec(str);
          if (!match) return;
          const source = create(match[1]);
          if (!source) return;
          return source + DOT_LITERAL + match[2];
        }
      }
    }, output = utils.removePrefix(input, {
      negated: !1,
      prefix: ""
    });
    let source = create(output);
    return source && !0 !== opts.strictSlashes && (source += SLASH_LITERAL + "?"), source;
  }, module.exports = parse;
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  const picomatch = __webpack_require__(8), normalizePath = __webpack_require__(9), DEFAULT_OPTIONS = {
    returnIndex: !1
  }, matchPatterns = (patterns, negPatterns, args, returnIndex) => {
    const isList = Array.isArray(args), _path = isList ? args[0] : args;
    if (!isList && "string" != typeof _path) throw new TypeError("anymatch: second argument must be a string: got " + Object.prototype.toString.call(_path));
    const path = normalizePath(_path);
    for (let index = 0; index < negPatterns.length; index++) {
      if ((0, negPatterns[index])(path)) return !!returnIndex && -1;
    }
    const applied = isList && [ path ].concat(args.slice(1));
    for (let index = 0; index < patterns.length; index++) {
      const pattern = patterns[index];
      if (isList ? pattern(...applied) : pattern(path)) return !returnIndex || index;
    }
    return !!returnIndex && -1;
  }, anymatch = (matchers, testString, options = DEFAULT_OPTIONS) => {
    if (null == matchers) throw new TypeError("anymatch: specify first argument");
    const opts = "boolean" == typeof options ? {
      returnIndex: options
    } : options, returnIndex = opts.returnIndex || !1, mtchers = (item = matchers, Array.isArray(item) ? item : [ item ]);
    var item;
    const negatedGlobs = mtchers.filter(item => "string" == typeof item && "!" === item.charAt(0)).map(item => item.slice(1)).map(item => picomatch(item, opts)), patterns = mtchers.filter(item => "string" != typeof item || "string" == typeof item && "!" !== item.charAt(0)).map(matcher => ((matcher, options) => {
      if ("function" == typeof matcher) return matcher;
      if ("string" == typeof matcher) {
        const glob = picomatch(matcher, options);
        return string => matcher === string || glob(string);
      }
      return matcher instanceof RegExp ? string => matcher.test(string) : string => !1;
    })(matcher, opts));
    return null == testString ? (testString, ri = !1) => matchPatterns(patterns, negatedGlobs, testString, "boolean" == typeof ri && ri) : matchPatterns(patterns, negatedGlobs, testString, returnIndex);
  };
  anymatch.default = anymatch, module.exports = anymatch;
}, function(module, exports, __webpack_require__) {
  var isGlob = __webpack_require__(10), pathPosixDirname = __webpack_require__(0).posix.dirname, isWin32 = "win32" === __webpack_require__(21).platform(), backslash = /\\/g, enclosure = /[\{\[].*[\}\]]$/, globby = /(^|[^\\])([\{\[]|\([^\)]+$)/, escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
  module.exports = function(str, opts) {
    Object.assign({
      flipBackslashes: !0
    }, opts).flipBackslashes && isWin32 && str.indexOf("/") < 0 && (str = str.replace(backslash, "/")), 
    enclosure.test(str) && (str += "/"), str += "a";
    do {
      str = pathPosixDirname(str);
    } while (isGlob(str) || globby.test(str));
    return str.replace(escaped, "$1");
  };
}, function(module, exports) {
  module.exports = function(str) {
    if ("string" != typeof str || "" === str) return !1;
    for (var match; match = /(\\).|([@?!+*]\(.*\))/g.exec(str); ) {
      if (match[2]) return !0;
      str = str.slice(match.index + match[0].length);
    }
    return !1;
  };
}, function(module, exports) {
  module.exports = require("os");
}, function(module, exports, __webpack_require__) {
  const stringify = __webpack_require__(5), compile = __webpack_require__(23), expand = __webpack_require__(26), parse = __webpack_require__(27), braces = (input, options = {}) => {
    let output = [];
    if (Array.isArray(input)) for (let pattern of input) {
      let result = braces.create(pattern, options);
      Array.isArray(result) ? output.push(...result) : output.push(result);
    } else output = [].concat(braces.create(input, options));
    return options && !0 === options.expand && !0 === options.nodupes && (output = [ ...new Set(output) ]), 
    output;
  };
  braces.parse = (input, options = {}) => parse(input, options), braces.stringify = (input, options = {}) => stringify("string" == typeof input ? braces.parse(input, options) : input, options), 
  braces.compile = (input, options = {}) => ("string" == typeof input && (input = braces.parse(input, options)), 
  compile(input, options)), braces.expand = (input, options = {}) => {
    "string" == typeof input && (input = braces.parse(input, options));
    let result = expand(input, options);
    return !0 === options.noempty && (result = result.filter(Boolean)), !0 === options.nodupes && (result = [ ...new Set(result) ]), 
    result;
  }, braces.create = (input, options = {}) => "" === input || input.length < 3 ? [ input ] : !0 !== options.expand ? braces.compile(input, options) : braces.expand(input, options), 
  module.exports = braces;
}, function(module, exports, __webpack_require__) {
  const fill = __webpack_require__(11), utils = __webpack_require__(6);
  module.exports = (ast, options = {}) => {
    let walk = (node, parent = {}) => {
      let invalidBlock = utils.isInvalidBrace(parent), invalidNode = !0 === node.invalid && !0 === options.escapeInvalid, invalid = !0 === invalidBlock || !0 === invalidNode, prefix = !0 === options.escapeInvalid ? "\\" : "", output = "";
      if (!0 === node.isOpen) return prefix + node.value;
      if (!0 === node.isClose) return prefix + node.value;
      if ("open" === node.type) return invalid ? prefix + node.value : "(";
      if ("close" === node.type) return invalid ? prefix + node.value : ")";
      if ("comma" === node.type) return "comma" === node.prev.type ? "" : invalid ? node.value : "|";
      if (node.value) return node.value;
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes), range = fill(...args, {
          ...options,
          wrap: !1,
          toRegex: !0
        });
        if (0 !== range.length) return args.length > 1 && range.length > 1 ? `(${range})` : range;
      }
      if (node.nodes) for (let child of node.nodes) output += walk(child, node);
      return output;
    };
    return walk(ast);
  };
}, function(module, exports, __webpack_require__) {
  const isNumber = __webpack_require__(25), toRegexRange = (min, max, options) => {
    if (!1 === isNumber(min)) throw new TypeError("toRegexRange: expected the first argument to be a number");
    if (void 0 === max || min === max) return String(min);
    if (!1 === isNumber(max)) throw new TypeError("toRegexRange: expected the second argument to be a number.");
    let opts = {
      relaxZeros: !0,
      ...options
    };
    "boolean" == typeof opts.strictZeros && (opts.relaxZeros = !1 === opts.strictZeros);
    let cacheKey = min + ":" + max + "=" + String(opts.relaxZeros) + String(opts.shorthand) + String(opts.capture) + String(opts.wrap);
    if (toRegexRange.cache.hasOwnProperty(cacheKey)) return toRegexRange.cache[cacheKey].result;
    let a = Math.min(min, max), b = Math.max(min, max);
    if (1 === Math.abs(a - b)) {
      let result = min + "|" + max;
      return opts.capture ? `(${result})` : !1 === opts.wrap ? result : `(?:${result})`;
    }
    let isPadded = hasPadding(min) || hasPadding(max), state = {
      min: min,
      max: max,
      a: a,
      b: b
    }, positives = [], negatives = [];
    if (isPadded && (state.isPadded = isPadded, state.maxLen = String(state.max).length), 
    a < 0) {
      negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), state, opts), 
      a = state.a = 0;
    }
    return b >= 0 && (positives = splitToPatterns(a, b, state, opts)), state.negatives = negatives, 
    state.positives = positives, state.result = function(neg, pos, options) {
      let onlyNegative = filterPatterns(neg, pos, "-", !1, options) || [], onlyPositive = filterPatterns(pos, neg, "", !1, options) || [], intersected = filterPatterns(neg, pos, "-?", !0, options) || [];
      return onlyNegative.concat(intersected).concat(onlyPositive).join("|");
    }(negatives, positives, opts), !0 === opts.capture ? state.result = `(${state.result})` : !1 !== opts.wrap && positives.length + negatives.length > 1 && (state.result = `(?:${state.result})`), 
    toRegexRange.cache[cacheKey] = state, state.result;
  };
  function rangeToPattern(start, stop, options) {
    if (start === stop) return {
      pattern: start,
      count: [],
      digits: 0
    };
    let zipped = function(a, b) {
      let arr = [];
      for (let i = 0; i < a.length; i++) arr.push([ a[i], b[i] ]);
      return arr;
    }(start, stop), digits = zipped.length, pattern = "", count = 0;
    for (let i = 0; i < digits; i++) {
      let [startDigit, stopDigit] = zipped[i];
      startDigit === stopDigit ? pattern += startDigit : "0" !== startDigit || "9" !== stopDigit ? pattern += toCharacterClass(startDigit, stopDigit, options) : count++;
    }
    return count && (pattern += !0 === options.shorthand ? "\\d" : "[0-9]"), {
      pattern: pattern,
      count: [ count ],
      digits: digits
    };
  }
  function splitToPatterns(min, max, tok, options) {
    let prev, ranges = function(min, max) {
      let nines = 1, zeros = 1, stop = countNines(min, nines), stops = new Set([ max ]);
      for (;min <= stop && stop <= max; ) stops.add(stop), nines += 1, stop = countNines(min, nines);
      for (stop = countZeros(max + 1, zeros) - 1; min < stop && stop <= max; ) stops.add(stop), 
      zeros += 1, stop = countZeros(max + 1, zeros) - 1;
      return stops = [ ...stops ], stops.sort(compare), stops;
    }(min, max), tokens = [], start = min;
    for (let i = 0; i < ranges.length; i++) {
      let max = ranges[i], obj = rangeToPattern(String(start), String(max), options), zeros = "";
      tok.isPadded || !prev || prev.pattern !== obj.pattern ? (tok.isPadded && (zeros = padZeros(max, tok, options)), 
      obj.string = zeros + obj.pattern + toQuantifier(obj.count), tokens.push(obj), start = max + 1, 
      prev = obj) : (prev.count.length > 1 && prev.count.pop(), prev.count.push(obj.count[0]), 
      prev.string = prev.pattern + toQuantifier(prev.count), start = max + 1);
    }
    return tokens;
  }
  function filterPatterns(arr, comparison, prefix, intersection, options) {
    let result = [];
    for (let ele of arr) {
      let {string: string} = ele;
      intersection || contains(comparison, "string", string) || result.push(prefix + string), 
      intersection && contains(comparison, "string", string) && result.push(prefix + string);
    }
    return result;
  }
  function compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  function contains(arr, key, val) {
    return arr.some(ele => ele[key] === val);
  }
  function countNines(min, len) {
    return Number(String(min).slice(0, -len) + "9".repeat(len));
  }
  function countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
  }
  function toQuantifier(digits) {
    let [start = 0, stop = ""] = digits;
    return stop || start > 1 ? `{${start + (stop ? "," + stop : "")}}` : "";
  }
  function toCharacterClass(a, b, options) {
    return `[${a}${b - a == 1 ? "" : "-"}${b}]`;
  }
  function hasPadding(str) {
    return /^-?(0+)\d/.test(str);
  }
  function padZeros(value, tok, options) {
    if (!tok.isPadded) return value;
    let diff = Math.abs(tok.maxLen - String(value).length), relax = !1 !== options.relaxZeros;
    switch (diff) {
     case 0:
      return "";

     case 1:
      return relax ? "0?" : "0";

     case 2:
      return relax ? "0{0,2}" : "00";

     default:
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
  }
  toRegexRange.cache = {}, toRegexRange.clearCache = () => toRegexRange.cache = {}, 
  module.exports = toRegexRange;
}, function(module, exports, __webpack_require__) {
  module.exports = function(num) {
    return "number" == typeof num ? num - num == 0 : "string" == typeof num && "" !== num.trim() && (Number.isFinite ? Number.isFinite(+num) : isFinite(+num));
  };
}, function(module, exports, __webpack_require__) {
  const fill = __webpack_require__(11), stringify = __webpack_require__(5), utils = __webpack_require__(6), append = (queue = "", stash = "", enclose = !1) => {
    let result = [];
    if (queue = [].concat(queue), !(stash = [].concat(stash)).length) return queue;
    if (!queue.length) return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
    for (let item of queue) if (Array.isArray(item)) for (let value of item) result.push(append(value, stash, enclose)); else for (let ele of stash) !0 === enclose && "string" == typeof ele && (ele = `{${ele}}`), 
    result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
    return utils.flatten(result);
  };
  module.exports = (ast, options = {}) => {
    let rangeLimit = void 0 === options.rangeLimit ? 1e3 : options.rangeLimit, walk = (node, parent = {}) => {
      node.queue = [];
      let p = parent, q = parent.queue;
      for (;"brace" !== p.type && "root" !== p.type && p.parent; ) p = p.parent, q = p.queue;
      if (node.invalid || node.dollar) return void q.push(append(q.pop(), stringify(node, options)));
      if ("brace" === node.type && !0 !== node.invalid && 2 === node.nodes.length) return void q.push(append(q.pop(), [ "{}" ]));
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        if (utils.exceedsLimit(...args, options.step, rangeLimit)) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
        let range = fill(...args, options);
        return 0 === range.length && (range = stringify(node, options)), q.push(append(q.pop(), range)), 
        void (node.nodes = []);
      }
      let enclose = utils.encloseBrace(node), queue = node.queue, block = node;
      for (;"brace" !== block.type && "root" !== block.type && block.parent; ) block = block.parent, 
      queue = block.queue;
      for (let i = 0; i < node.nodes.length; i++) {
        let child = node.nodes[i];
        "comma" !== child.type || "brace" !== node.type ? "close" !== child.type ? child.value && "open" !== child.type ? queue.push(append(queue.pop(), child.value)) : child.nodes && walk(child, node) : q.push(append(q.pop(), queue, enclose)) : (1 === i && queue.push(""), 
        queue.push(""));
      }
      return queue;
    };
    return utils.flatten(walk(ast));
  };
}, function(module, exports, __webpack_require__) {
  const stringify = __webpack_require__(5), {MAX_LENGTH: MAX_LENGTH, CHAR_BACKSLASH: CHAR_BACKSLASH, CHAR_BACKTICK: CHAR_BACKTICK, CHAR_COMMA: CHAR_COMMA, CHAR_DOT: CHAR_DOT, CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES, CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES, CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE, CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE, CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET, CHAR_DOUBLE_QUOTE: CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE: CHAR_SINGLE_QUOTE, CHAR_NO_BREAK_SPACE: CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE: CHAR_ZERO_WIDTH_NOBREAK_SPACE} = __webpack_require__(28);
  module.exports = (input, options = {}) => {
    if ("string" != typeof input) throw new TypeError("Expected a string");
    let opts = options || {}, max = "number" == typeof opts.maxLength ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    if (input.length > max) throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
    let value, ast = {
      type: "root",
      input: input,
      nodes: []
    }, stack = [ ast ], block = ast, prev = ast, brackets = 0, length = input.length, index = 0, depth = 0;
    const advance = () => input[index++], push = node => {
      if ("text" === node.type && "dot" === prev.type && (prev.type = "text"), !prev || "text" !== prev.type || "text" !== node.type) return block.nodes.push(node), 
      node.parent = block, node.prev = prev, prev = node, node;
      prev.value += node.value;
    };
    for (push({
      type: "bos"
    }); index < length; ) if (block = stack[stack.length - 1], value = advance(), value !== CHAR_ZERO_WIDTH_NOBREAK_SPACE && value !== CHAR_NO_BREAK_SPACE) if (value !== CHAR_BACKSLASH) if (value !== CHAR_RIGHT_SQUARE_BRACKET) if (value !== CHAR_LEFT_SQUARE_BRACKET) if (value !== CHAR_LEFT_PARENTHESES) if (value !== CHAR_RIGHT_PARENTHESES) if (value !== CHAR_DOUBLE_QUOTE && value !== CHAR_SINGLE_QUOTE && value !== CHAR_BACKTICK) if (value !== CHAR_LEFT_CURLY_BRACE) if (value !== CHAR_RIGHT_CURLY_BRACE) if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [ open, {
          type: "text",
          value: stringify(block)
        } ];
      }
      push({
        type: "comma",
        value: value
      }), block.commas++;
    } else if (value === CHAR_DOT && depth > 0 && 0 === block.commas) {
      let siblings = block.nodes;
      if (0 === depth || 0 === siblings.length) {
        push({
          type: "text",
          value: value
        });
        continue;
      }
      if ("dot" === prev.type) {
        if (block.range = [], prev.value += value, prev.type = "range", 3 !== block.nodes.length && 5 !== block.nodes.length) {
          block.invalid = !0, block.ranges = 0, prev.type = "text";
          continue;
        }
        block.ranges++, block.args = [];
        continue;
      }
      if ("range" === prev.type) {
        siblings.pop();
        let before = siblings[siblings.length - 1];
        before.value += prev.value + value, prev = before, block.ranges--;
        continue;
      }
      push({
        type: "dot",
        value: value
      });
    } else push({
      type: "text",
      value: value
    }); else {
      if ("brace" !== block.type) {
        push({
          type: "text",
          value: value
        });
        continue;
      }
      let type = "close";
      block = stack.pop(), block.close = !0, push({
        type: type,
        value: value
      }), depth--, block = stack[stack.length - 1];
    } else {
      depth++;
      let dollar = prev.value && "$" === prev.value.slice(-1) || !0 === block.dollar;
      block = push({
        type: "brace",
        open: !0,
        close: !1,
        dollar: dollar,
        depth: depth,
        commas: 0,
        ranges: 0,
        nodes: []
      }), stack.push(block), push({
        type: "open",
        value: value
      });
    } else {
      let next, open = value;
      for (!0 !== options.keepQuotes && (value = ""); index < length && (next = advance()); ) if (next !== CHAR_BACKSLASH) {
        if (next === open) {
          !0 === options.keepQuotes && (value += next);
          break;
        }
        value += next;
      } else value += next + advance();
      push({
        type: "text",
        value: value
      });
    } else {
      if ("paren" !== block.type) {
        push({
          type: "text",
          value: value
        });
        continue;
      }
      block = stack.pop(), push({
        type: "text",
        value: value
      }), block = stack[stack.length - 1];
    } else block = push({
      type: "paren",
      nodes: []
    }), stack.push(block), push({
      type: "text",
      value: value
    }); else {
      brackets++;
      let next;
      for (;index < length && (next = advance()); ) if (value += next, next !== CHAR_LEFT_SQUARE_BRACKET) if (next !== CHAR_BACKSLASH) {
        if (next === CHAR_RIGHT_SQUARE_BRACKET && (brackets--, 0 === brackets)) break;
      } else value += advance(); else brackets++;
      push({
        type: "text",
        value: value
      });
    } else push({
      type: "text",
      value: "\\" + value
    }); else push({
      type: "text",
      value: (options.keepEscaping ? value : "") + advance()
    });
    do {
      if (block = stack.pop(), "root" !== block.type) {
        block.nodes.forEach(node => {
          node.nodes || ("open" === node.type && (node.isOpen = !0), "close" === node.type && (node.isClose = !0), 
          node.nodes || (node.type = "text"), node.invalid = !0);
        });
        let parent = stack[stack.length - 1], index = parent.nodes.indexOf(block);
        parent.nodes.splice(index, 1, ...block.nodes);
      }
    } while (stack.length > 0);
    return push({
      type: "eos"
    }), ast;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = {
    MAX_LENGTH: 65536,
    CHAR_0: "0",
    CHAR_9: "9",
    CHAR_UPPERCASE_A: "A",
    CHAR_LOWERCASE_A: "a",
    CHAR_UPPERCASE_Z: "Z",
    CHAR_LOWERCASE_Z: "z",
    CHAR_LEFT_PARENTHESES: "(",
    CHAR_RIGHT_PARENTHESES: ")",
    CHAR_ASTERISK: "*",
    CHAR_AMPERSAND: "&",
    CHAR_AT: "@",
    CHAR_BACKSLASH: "\\",
    CHAR_BACKTICK: "`",
    CHAR_CARRIAGE_RETURN: "\r",
    CHAR_CIRCUMFLEX_ACCENT: "^",
    CHAR_COLON: ":",
    CHAR_COMMA: ",",
    CHAR_DOLLAR: "$",
    CHAR_DOT: ".",
    CHAR_DOUBLE_QUOTE: '"',
    CHAR_EQUAL: "=",
    CHAR_EXCLAMATION_MARK: "!",
    CHAR_FORM_FEED: "\f",
    CHAR_FORWARD_SLASH: "/",
    CHAR_HASH: "#",
    CHAR_HYPHEN_MINUS: "-",
    CHAR_LEFT_ANGLE_BRACKET: "<",
    CHAR_LEFT_CURLY_BRACE: "{",
    CHAR_LEFT_SQUARE_BRACKET: "[",
    CHAR_LINE_FEED: "\n",
    CHAR_NO_BREAK_SPACE: " ",
    CHAR_PERCENT: "%",
    CHAR_PLUS: "+",
    CHAR_QUESTION_MARK: "?",
    CHAR_RIGHT_ANGLE_BRACKET: ">",
    CHAR_RIGHT_CURLY_BRACE: "}",
    CHAR_RIGHT_SQUARE_BRACKET: "]",
    CHAR_SEMICOLON: ";",
    CHAR_SINGLE_QUOTE: "'",
    CHAR_SPACE: " ",
    CHAR_TAB: "\t",
    CHAR_UNDERSCORE: "_",
    CHAR_VERTICAL_LINE: "|",
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\ufeff"
  };
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(2), sysPath = __webpack_require__(0), {promisify: promisify} = __webpack_require__(1), isBinaryPath = __webpack_require__(30), {isWindows: isWindows, isLinux: isLinux, EMPTY_FN: EMPTY_FN, EMPTY_STR: EMPTY_STR, KEY_LISTENERS: KEY_LISTENERS, KEY_ERR: KEY_ERR, KEY_RAW: KEY_RAW, HANDLER_KEYS: HANDLER_KEYS, EV_CHANGE: EV_CHANGE, EV_ADD: EV_ADD, EV_ADD_DIR: EV_ADD_DIR, EV_ERROR: EV_ERROR, STR_DATA: STR_DATA, STR_END: STR_END, BRACE_START: BRACE_START, STAR: STAR} = __webpack_require__(7), open = promisify(fs.open), stat = promisify(fs.stat), lstat = promisify(fs.lstat), close = promisify(fs.close), fsrealpath = promisify(fs.realpath), statMethods = {
    lstat: lstat,
    stat: stat
  }, foreach = (val, fn) => {
    val instanceof Set ? val.forEach(fn) : fn(val);
  }, addAndConvert = (main, prop, item) => {
    let container = main[prop];
    container instanceof Set || (main[prop] = container = new Set([ container ])), container.add(item);
  }, delFromSet = (main, prop, item) => {
    const container = main[prop];
    container instanceof Set ? container.delete(item) : container === item && delete main[prop];
  }, isEmptySet = val => val instanceof Set ? 0 === val.size : !val, FsWatchInstances = new Map;
  function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
    const handleEvent = (rawEvent, evPath) => {
      listener(path), emitRaw(rawEvent, evPath, {
        watchedPath: path
      }), evPath && path !== evPath && fsWatchBroadcast(sysPath.resolve(path, evPath), KEY_LISTENERS, sysPath.join(path, evPath));
    };
    try {
      return fs.watch(path, options, handleEvent);
    } catch (error) {
      errHandler(error);
    }
  }
  const fsWatchBroadcast = (fullPath, type, val1, val2, val3) => {
    const cont = FsWatchInstances.get(fullPath);
    cont && foreach(cont[type], listener => {
      listener(val1, val2, val3);
    });
  }, setFsWatchListener = (path, fullPath, options, handlers) => {
    const {listener: listener, errHandler: errHandler, rawEmitter: rawEmitter} = handlers;
    let watcher, cont = FsWatchInstances.get(fullPath);
    if (!options.persistent) return watcher = createFsWatchInstance(path, options, listener, errHandler, rawEmitter), 
    watcher.close.bind(watcher);
    if (cont) addAndConvert(cont, KEY_LISTENERS, listener), addAndConvert(cont, KEY_ERR, errHandler), 
    addAndConvert(cont, KEY_RAW, rawEmitter); else {
      if (watcher = createFsWatchInstance(path, options, fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS), errHandler, fsWatchBroadcast.bind(null, fullPath, KEY_RAW)), 
      !watcher) return;
      watcher.on(EV_ERROR, async error => {
        const broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
        if (cont.watcherUnusable = !0, isWindows && "EPERM" === error.code) try {
          const fd = await open(path, "r");
          await close(fd), broadcastErr(error);
        } catch (err) {} else broadcastErr(error);
      }), cont = {
        listeners: listener,
        errHandlers: errHandler,
        rawEmitters: rawEmitter,
        watcher: watcher
      }, FsWatchInstances.set(fullPath, cont);
    }
    return () => {
      delFromSet(cont, KEY_LISTENERS, listener), delFromSet(cont, KEY_ERR, errHandler), 
      delFromSet(cont, KEY_RAW, rawEmitter), isEmptySet(cont.listeners) && (cont.watcher.close(), 
      FsWatchInstances.delete(fullPath), HANDLER_KEYS.forEach((cont => key => {
        const set = cont[key];
        set instanceof Set ? set.clear() : delete cont[key];
      })(cont)), cont.watcher = void 0, Object.freeze(cont));
    };
  }, FsWatchFileInstances = new Map;
  module.exports = class {
    constructor(fsW) {
      this.fsw = fsW, this._boundHandleError = error => fsW._handleError(error);
    }
    _watchWithNodeFs(path, listener) {
      const opts = this.fsw.options, directory = sysPath.dirname(path), basename = sysPath.basename(path);
      this.fsw._getWatchedDir(directory).add(basename);
      const absolutePath = sysPath.resolve(path), options = {
        persistent: opts.persistent
      };
      let closer;
      return listener || (listener = EMPTY_FN), opts.usePolling ? (options.interval = opts.enableBinaryInterval && isBinaryPath(basename) ? opts.binaryInterval : opts.interval, 
      closer = ((path, fullPath, options, handlers) => {
        const {listener: listener, rawEmitter: rawEmitter} = handlers;
        let cont = FsWatchFileInstances.get(fullPath), listeners = new Set, rawEmitters = new Set;
        const copts = cont && cont.options;
        return copts && (copts.persistent < options.persistent || copts.interval > options.interval) && (listeners = cont.listeners, 
        rawEmitters = cont.rawEmitters, fs.unwatchFile(fullPath), cont = void 0), cont ? (addAndConvert(cont, KEY_LISTENERS, listener), 
        addAndConvert(cont, KEY_RAW, rawEmitter)) : (cont = {
          listeners: listener,
          rawEmitters: rawEmitter,
          options: options,
          watcher: fs.watchFile(fullPath, options, (curr, prev) => {
            foreach(cont.rawEmitters, rawEmitter => {
              rawEmitter(EV_CHANGE, fullPath, {
                curr: curr,
                prev: prev
              });
            });
            const currmtime = curr.mtimeMs;
            (curr.size !== prev.size || currmtime > prev.mtimeMs || 0 === currmtime) && foreach(cont.listeners, listener => listener(path, curr));
          })
        }, FsWatchFileInstances.set(fullPath, cont)), () => {
          delFromSet(cont, KEY_LISTENERS, listener), delFromSet(cont, KEY_RAW, rawEmitter), 
          isEmptySet(cont.listeners) && (FsWatchFileInstances.delete(fullPath), fs.unwatchFile(fullPath), 
          cont.options = cont.watcher = void 0, Object.freeze(cont));
        };
      })(path, absolutePath, options, {
        listener: listener,
        rawEmitter: this.fsw._emitRaw
      })) : closer = setFsWatchListener(path, absolutePath, options, {
        listener: listener,
        errHandler: this._boundHandleError,
        rawEmitter: this.fsw._emitRaw
      }), closer;
    }
    _handleFile(file, stats, initialAdd) {
      if (this.fsw.closed) return;
      const dirname = sysPath.dirname(file), basename = sysPath.basename(file), parent = this.fsw._getWatchedDir(dirname);
      let prevStats = stats;
      if (parent.has(basename)) return;
      const listener = async (path, newStats) => {
        if (this.fsw._throttle("watch", file, 5)) if (newStats && 0 !== newStats.mtimeMs) {
          if (parent.has(basename)) {
            const at = newStats.atimeMs, mt = newStats.mtimeMs;
            (!at || at <= mt || mt !== prevStats.mtimeMs) && this.fsw._emit(EV_CHANGE, file, newStats), 
            prevStats = newStats;
          }
        } else try {
          const newStats = await stat(file);
          if (this.fsw.closed) return;
          const at = newStats.atimeMs, mt = newStats.mtimeMs;
          (!at || at <= mt || mt !== prevStats.mtimeMs) && this.fsw._emit(EV_CHANGE, file, newStats), 
          isLinux && prevStats.ino !== newStats.ino ? (this.fsw._closeFile(path), prevStats = newStats, 
          this.fsw._addPathCloser(path, this._watchWithNodeFs(file, listener))) : prevStats = newStats;
        } catch (error) {
          this.fsw._remove(dirname, basename);
        }
      }, closer = this._watchWithNodeFs(file, listener);
      if ((!initialAdd || !this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
        if (!this.fsw._throttle(EV_ADD, file, 0)) return;
        this.fsw._emit(EV_ADD, file, stats);
      }
      return closer;
    }
    async _handleSymlink(entry, directory, path, item) {
      if (this.fsw.closed) return;
      const full = entry.fullPath, dir = this.fsw._getWatchedDir(directory);
      if (!this.fsw.options.followSymlinks) {
        this.fsw._incrReadyCount();
        const linkPath = await fsrealpath(path);
        if (this.fsw.closed) return;
        return dir.has(item) ? this.fsw._symlinkPaths.get(full) !== linkPath && (this.fsw._symlinkPaths.set(full, linkPath), 
        this.fsw._emit(EV_CHANGE, path, entry.stats)) : (dir.add(item), this.fsw._symlinkPaths.set(full, linkPath), 
        this.fsw._emit(EV_ADD, path, entry.stats)), this.fsw._emitReady(), !0;
      }
      if (this.fsw._symlinkPaths.has(full)) return !0;
      this.fsw._symlinkPaths.set(full, !0);
    }
    _handleRead(directory, initialAdd, wh, target, dir, depth, throttler) {
      if (directory = sysPath.join(directory, EMPTY_STR), !wh.hasGlob && !(throttler = this.fsw._throttle("readdir", directory, 1e3))) return;
      const previous = this.fsw._getWatchedDir(wh.path), current = new Set;
      let stream = this.fsw._readdirp(directory, {
        fileFilter: entry => wh.filterPath(entry),
        directoryFilter: entry => wh.filterDir(entry),
        depth: 0
      }).on(STR_DATA, async entry => {
        if (this.fsw.closed) return void (stream = void 0);
        const item = entry.path;
        let path = sysPath.join(directory, item);
        current.add(item), entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory, path, item) || (this.fsw.closed ? stream = void 0 : item !== target && (target || previous.has(item)) || (this.fsw._incrReadyCount(), 
        path = sysPath.join(dir, sysPath.relative(dir, path)), this._addToNodeFs(path, initialAdd, wh, depth + 1)));
      }).on(EV_ERROR, this._boundHandleError);
      return new Promise(resolve => stream.once(STR_END, () => {
        if (this.fsw.closed) return void (stream = void 0);
        const wasThrottled = !!throttler && throttler.clear();
        resolve(), previous.getChildren().filter(item => item !== directory && !current.has(item) && (!wh.hasGlob || wh.filterPath({
          fullPath: sysPath.resolve(directory, item)
        }))).forEach(item => {
          this.fsw._remove(directory, item);
        }), stream = void 0, wasThrottled && this._handleRead(directory, !1, wh, target, dir, depth, throttler);
      }));
    }
    async _handleDir(dir, stats, initialAdd, depth, target, wh, realpath) {
      const parentDir = this.fsw._getWatchedDir(sysPath.dirname(dir)), tracked = parentDir.has(sysPath.basename(dir));
      let closer;
      initialAdd && this.fsw.options.ignoreInitial || target || tracked || wh.hasGlob && !wh.globFilter(dir) || this.fsw._emit(EV_ADD_DIR, dir, stats), 
      parentDir.add(sysPath.basename(dir)), this.fsw._getWatchedDir(dir);
      const oDepth = this.fsw.options.depth;
      if ((null == oDepth || depth <= oDepth) && !this.fsw._symlinkPaths.has(realpath)) {
        if (!target && (await this._handleRead(dir, initialAdd, wh, target, dir, depth, void 0), 
        this.fsw.closed)) return;
        closer = this._watchWithNodeFs(dir, (dirPath, stats) => {
          stats && 0 === stats.mtimeMs || this._handleRead(dirPath, !1, wh, target, dir, depth, void 0);
        });
      }
      return closer;
    }
    async _addToNodeFs(path, initialAdd, priorWh, depth, target) {
      const ready = this.fsw._emitReady;
      if (this.fsw._isIgnored(path) || this.fsw.closed) return ready(), !1;
      const wh = this.fsw._getWatchHelpers(path, depth);
      !wh.hasGlob && priorWh && (wh.hasGlob = priorWh.hasGlob, wh.globFilter = priorWh.globFilter, 
      wh.filterPath = entry => priorWh.filterPath(entry), wh.filterDir = entry => priorWh.filterDir(entry));
      try {
        const stats = await statMethods[wh.statMethod](wh.watchPath);
        if (this.fsw.closed) return;
        if (this.fsw._isIgnored(wh.watchPath, stats)) return ready(), !1;
        const follow = this.fsw.options.followSymlinks && !path.includes(STAR) && !path.includes(BRACE_START);
        let closer;
        if (stats.isDirectory()) {
          const targetPath = follow ? await fsrealpath(path) : path;
          if (this.fsw.closed) return;
          if (closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth, target, wh, targetPath), 
          this.fsw.closed) return;
          path !== targetPath && void 0 !== targetPath && this.fsw._symlinkPaths.set(targetPath, !0);
        } else if (stats.isSymbolicLink()) {
          const targetPath = follow ? await fsrealpath(path) : path;
          if (this.fsw.closed) return;
          const parent = sysPath.dirname(wh.watchPath);
          if (this.fsw._getWatchedDir(parent).add(wh.watchPath), this.fsw._emit(EV_ADD, wh.watchPath, stats), 
          closer = await this._handleDir(parent, stats, initialAdd, depth, path, wh, targetPath), 
          this.fsw.closed) return;
          void 0 !== targetPath && this.fsw._symlinkPaths.set(sysPath.resolve(path), targetPath);
        } else closer = this._handleFile(wh.watchPath, stats, initialAdd);
        return ready(), this.fsw._addPathCloser(path, closer), !1;
      } catch (error) {
        if (this.fsw._handleError(error)) return ready(), path;
      }
    }
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), binaryExtensions = __webpack_require__(31), extensions = new Set(binaryExtensions);
  module.exports = filePath => extensions.has(path.extname(filePath).slice(1).toLowerCase());
}, function(module) {
  module.exports = JSON.parse('["3dm","3ds","3g2","3gp","7z","a","aac","adp","ai","aif","aiff","alz","ape","apk","appimage","ar","arj","asf","au","avi","bak","baml","bh","bin","bk","bmp","btif","bz2","bzip2","cab","caf","cgm","class","cmx","cpio","cr2","cur","dat","dcm","deb","dex","djvu","dll","dmg","dng","doc","docm","docx","dot","dotm","dra","DS_Store","dsk","dts","dtshd","dvb","dwg","dxf","ecelp4800","ecelp7470","ecelp9600","egg","eol","eot","epub","exe","f4v","fbs","fh","fla","flac","flatpak","fli","flv","fpx","fst","fvt","g3","gh","gif","graffle","gz","gzip","h261","h263","h264","icns","ico","ief","img","ipa","iso","jar","jpeg","jpg","jpgv","jpm","jxr","key","ktx","lha","lib","lvp","lz","lzh","lzma","lzo","m3u","m4a","m4v","mar","mdi","mht","mid","midi","mj2","mka","mkv","mmr","mng","mobi","mov","movie","mp3","mp4","mp4a","mpeg","mpg","mpga","mxu","nef","npx","numbers","nupkg","o","odp","ods","odt","oga","ogg","ogv","otf","ott","pages","pbm","pcx","pdb","pdf","pea","pgm","pic","png","pnm","pot","potm","potx","ppa","ppam","ppm","pps","ppsm","ppsx","ppt","pptm","pptx","psd","pya","pyc","pyo","pyv","qt","rar","ras","raw","resources","rgb","rip","rlc","rmf","rmvb","rpm","rtf","rz","s3m","s7z","scpt","sgi","shar","snap","sil","sketch","slk","smv","snk","so","stl","suo","sub","swf","tar","tbz","tbz2","tga","tgz","thmx","tif","tiff","tlz","ttc","ttf","txz","udf","uvh","uvi","uvm","uvp","uvs","uvu","viv","vob","war","wav","wax","wbmp","wdp","weba","webm","webp","whl","wim","wm","wma","wmv","wmx","woff","woff2","wrm","wvx","xbm","xif","xla","xlam","xls","xlsb","xlsm","xlsx","xlt","xltm","xltx","xm","xmind","xpi","xpm","xwd","xz","z","zip","zipx"]');
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(2), sysPath = __webpack_require__(0), {promisify: promisify} = __webpack_require__(1);
  let fsevents;
  try {
    fsevents = __webpack_require__(33);
  } catch (error) {
    process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR && console.error(error);
  }
  if (fsevents) {
    const mtch = process.version.match(/v(\d+)\.(\d+)/);
    if (mtch && mtch[1] && mtch[2]) {
      const maj = Number.parseInt(mtch[1], 10), min = Number.parseInt(mtch[2], 10);
      8 === maj && min < 16 && (fsevents = void 0);
    }
  }
  const {EV_ADD: EV_ADD, EV_CHANGE: EV_CHANGE, EV_ADD_DIR: EV_ADD_DIR, EV_UNLINK: EV_UNLINK, EV_ERROR: EV_ERROR, STR_DATA: STR_DATA, STR_END: STR_END, FSEVENT_CREATED: FSEVENT_CREATED, FSEVENT_MODIFIED: FSEVENT_MODIFIED, FSEVENT_DELETED: FSEVENT_DELETED, FSEVENT_MOVED: FSEVENT_MOVED, FSEVENT_UNKNOWN: FSEVENT_UNKNOWN, FSEVENT_TYPE_FILE: FSEVENT_TYPE_FILE, FSEVENT_TYPE_DIRECTORY: FSEVENT_TYPE_DIRECTORY, FSEVENT_TYPE_SYMLINK: FSEVENT_TYPE_SYMLINK, ROOT_GLOBSTAR: ROOT_GLOBSTAR, DIR_SUFFIX: DIR_SUFFIX, DOT_SLASH: DOT_SLASH, FUNCTION_TYPE: FUNCTION_TYPE, EMPTY_FN: EMPTY_FN, IDENTITY_FN: IDENTITY_FN} = __webpack_require__(7), stat = promisify(fs.stat), lstat = promisify(fs.lstat), realpath = promisify(fs.realpath), statMethods = {
    stat: stat,
    lstat: lstat
  }, FSEventsWatchers = new Map, wrongEventFlags = new Set([ 69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912 ]), createFSEventsInstance = (path, callback) => ({
    stop: fsevents.watch(path, callback)
  });
  const couldConsolidate = path => {
    let count = 0;
    for (const watchPath of FSEventsWatchers.keys()) if (0 === watchPath.indexOf(path) && (count++, 
    count >= 10)) return !0;
    return !1;
  }, calcDepth = (path, root) => {
    let i = 0;
    for (;!path.indexOf(root) && (path = sysPath.dirname(path)) !== root; ) i++;
    return i;
  }, sameTypes = (info, stats) => info.type === FSEVENT_TYPE_DIRECTORY && stats.isDirectory() || info.type === FSEVENT_TYPE_SYMLINK && stats.isSymbolicLink() || info.type === FSEVENT_TYPE_FILE && stats.isFile();
  module.exports = class {
    constructor(fsw) {
      this.fsw = fsw;
    }
    checkIgnored(path, stats) {
      const ipaths = this.fsw._ignoredPaths;
      if (this.fsw._isIgnored(path, stats)) return ipaths.add(path), stats && stats.isDirectory() && ipaths.add(path + ROOT_GLOBSTAR), 
      !0;
      ipaths.delete(path), ipaths.delete(path + ROOT_GLOBSTAR);
    }
    addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
      const event = watchedDir.has(item) ? EV_CHANGE : EV_ADD;
      this.handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts);
    }
    async checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
      try {
        const stats = await stat(path);
        if (this.fsw.closed) return;
        sameTypes(info, stats) ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
      } catch (error) {
        "EACCES" === error.code ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
    }
    handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts) {
      if (!this.fsw.closed && !this.checkIgnored(path)) if (event === EV_UNLINK) {
        const isDirectory = info.type === FSEVENT_TYPE_DIRECTORY;
        (isDirectory || watchedDir.has(item)) && this.fsw._remove(parent, item, isDirectory);
      } else {
        if (event === EV_ADD) {
          if (info.type === FSEVENT_TYPE_DIRECTORY && this.fsw._getWatchedDir(path), info.type === FSEVENT_TYPE_SYMLINK && opts.followSymlinks) {
            const curDepth = void 0 === opts.depth ? void 0 : calcDepth(fullPath, realPath) + 1;
            return this._addToFsEvents(path, !1, !0, curDepth);
          }
          this.fsw._getWatchedDir(parent).add(item);
        }
        const eventName = info.type === FSEVENT_TYPE_DIRECTORY ? event + DIR_SUFFIX : event;
        this.fsw._emit(eventName, path), eventName === EV_ADD_DIR && this._addToFsEvents(path, !1, !0);
      }
    }
    _watchWithFsEvents(watchPath, realPath, transform, globFilter) {
      if (this.fsw.closed) return;
      if (this.fsw._isIgnored(watchPath)) return;
      const opts = this.fsw.options, closer = function(path, realPath, listener, rawEmitter) {
        let watchPath = sysPath.extname(path) ? sysPath.dirname(path) : path;
        const parentPath = sysPath.dirname(watchPath);
        let cont = FSEventsWatchers.get(watchPath);
        couldConsolidate(parentPath) && (watchPath = parentPath);
        const resolvedPath = sysPath.resolve(path), hasSymlink = resolvedPath !== realPath, filteredListener = (fullPath, flags, info) => {
          hasSymlink && (fullPath = fullPath.replace(realPath, resolvedPath)), fullPath !== resolvedPath && fullPath.indexOf(resolvedPath + sysPath.sep) || listener(fullPath, flags, info);
        };
        let watchedParent = !1;
        for (const watchedPath of FSEventsWatchers.keys()) if (0 === realPath.indexOf(sysPath.resolve(watchedPath) + sysPath.sep)) {
          watchPath = watchedPath, cont = FSEventsWatchers.get(watchPath), watchedParent = !0;
          break;
        }
        return cont || watchedParent ? cont.listeners.add(filteredListener) : (cont = {
          listeners: new Set([ filteredListener ]),
          rawEmitter: rawEmitter,
          watcher: createFSEventsInstance(watchPath, (fullPath, flags) => {
            if (!cont.listeners.size) return;
            const info = fsevents.getInfo(fullPath, flags);
            cont.listeners.forEach(list => {
              list(fullPath, flags, info);
            }), cont.rawEmitter(info.event, fullPath, info);
          })
        }, FSEventsWatchers.set(watchPath, cont)), () => {
          const lst = cont.listeners;
          if (lst.delete(filteredListener), !lst.size && (FSEventsWatchers.delete(watchPath), 
          cont.watcher)) return cont.watcher.stop().then(() => {
            cont.rawEmitter = cont.watcher = void 0, Object.freeze(cont);
          });
        };
      }(watchPath, realPath, async (fullPath, flags, info) => {
        if (this.fsw.closed) return;
        if (void 0 !== opts.depth && calcDepth(fullPath, realPath) > opts.depth) return;
        const path = transform(sysPath.join(watchPath, sysPath.relative(watchPath, fullPath)));
        if (globFilter && !globFilter(path)) return;
        const parent = sysPath.dirname(path), item = sysPath.basename(path), watchedDir = this.fsw._getWatchedDir(info.type === FSEVENT_TYPE_DIRECTORY ? path : parent);
        if (wrongEventFlags.has(flags) || info.event === FSEVENT_UNKNOWN) if (typeof opts.ignored === FUNCTION_TYPE) {
          let stats;
          try {
            stats = await stat(path);
          } catch (error) {}
          if (this.fsw.closed) return;
          if (this.checkIgnored(path, stats)) return;
          sameTypes(info, stats) ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
        } else this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts); else switch (info.event) {
         case FSEVENT_CREATED:
         case FSEVENT_MODIFIED:
          return this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);

         case FSEVENT_DELETED:
         case FSEVENT_MOVED:
          return this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts);
        }
      }, this.fsw._emitRaw);
      return this.fsw._emitReady(), closer;
    }
    async _handleFsEventsSymlink(linkPath, fullPath, transform, curDepth) {
      if (!this.fsw.closed && !this.fsw._symlinkPaths.has(fullPath)) {
        this.fsw._symlinkPaths.set(fullPath, !0), this.fsw._incrReadyCount();
        try {
          const linkTarget = await realpath(linkPath);
          if (this.fsw.closed) return;
          if (this.fsw._isIgnored(linkTarget)) return this.fsw._emitReady();
          this.fsw._incrReadyCount(), this._addToFsEvents(linkTarget || linkPath, path => {
            let aliasedPath = linkPath;
            return linkTarget && linkTarget !== DOT_SLASH ? aliasedPath = path.replace(linkTarget, linkPath) : path !== DOT_SLASH && (aliasedPath = sysPath.join(linkPath, path)), 
            transform(aliasedPath);
          }, !1, curDepth);
        } catch (error) {
          if (this.fsw._handleError(error)) return this.fsw._emitReady();
        }
      }
    }
    emitAdd(newPath, stats, processPath, opts, forceAdd) {
      const pp = processPath(newPath), isDir = stats.isDirectory(), dirObj = this.fsw._getWatchedDir(sysPath.dirname(pp)), base = sysPath.basename(pp);
      isDir && this.fsw._getWatchedDir(pp), dirObj.has(base) || (dirObj.add(base), opts.ignoreInitial && !0 !== forceAdd || this.fsw._emit(isDir ? EV_ADD_DIR : EV_ADD, pp, stats));
    }
    initWatch(realPath, path, wh, processPath) {
      if (this.fsw.closed) return;
      const closer = this._watchWithFsEvents(wh.watchPath, sysPath.resolve(realPath || wh.watchPath), processPath, wh.globFilter);
      this.fsw._addPathCloser(path, closer);
    }
    async _addToFsEvents(path, transform, forceAdd, priorDepth) {
      if (this.fsw.closed) return;
      const opts = this.fsw.options, processPath = typeof transform === FUNCTION_TYPE ? transform : IDENTITY_FN, wh = this.fsw._getWatchHelpers(path);
      try {
        const stats = await statMethods[wh.statMethod](wh.watchPath);
        if (this.fsw.closed) return;
        if (this.fsw._isIgnored(wh.watchPath, stats)) throw null;
        if (stats.isDirectory()) {
          if (wh.globFilter || this.emitAdd(processPath(path), stats, processPath, opts, forceAdd), 
          priorDepth && priorDepth > opts.depth) return;
          this.fsw._readdirp(wh.watchPath, {
            fileFilter: entry => wh.filterPath(entry),
            directoryFilter: entry => wh.filterDir(entry),
            ...(value = opts.depth - (priorDepth || 0), isNaN(value) ? {} : {
              depth: value
            })
          }).on(STR_DATA, entry => {
            if (this.fsw.closed) return;
            if (entry.stats.isDirectory() && !wh.filterPath(entry)) return;
            const joinedPath = sysPath.join(wh.watchPath, entry.path), {fullPath: fullPath} = entry;
            if (wh.followSymlinks && entry.stats.isSymbolicLink()) {
              const curDepth = void 0 === opts.depth ? void 0 : calcDepth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;
              this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
            } else this.emitAdd(joinedPath, entry.stats, processPath, opts, forceAdd);
          }).on(EV_ERROR, EMPTY_FN).on(STR_END, () => {
            this.fsw._emitReady();
          });
        } else this.emitAdd(wh.watchPath, stats, processPath, opts, forceAdd), this.fsw._emitReady();
      } catch (error) {
        error && !this.fsw._handleError(error) || (this.fsw._emitReady(), this.fsw._emitReady());
      }
      var value;
      if (opts.persistent && !0 !== forceAdd) if (typeof transform === FUNCTION_TYPE) this.initWatch(void 0, path, wh, processPath); else {
        let realPath;
        try {
          realPath = await realpath(wh.watchPath);
        } catch (e) {}
        this.initWatch(realPath, path, wh, processPath);
      }
    }
  }, module.exports.canUse = () => fsevents && FSEventsWatchers.size < 128;
}, function(module, exports) {
  module.exports = require("fsevents");
} ]);
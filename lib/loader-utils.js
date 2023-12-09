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
  return __webpack_require__(3);
}([ function(module, exports) {
  module.exports = require("path");
}, function(module, exports, __webpack_require__) {
  const JSON5 = {
    parse: __webpack_require__(5)
  }, specialValues = {
    null: null,
    true: !0,
    false: !1
  };
  module.exports = function(query) {
    if ("?" !== query.substr(0, 1)) throw new Error("A valid query string passed to parseQuery should begin with '?'");
    if (!(query = query.substr(1))) return {};
    if ("{" === query.substr(0, 1) && "}" === query.substr(-1)) return JSON5.parse(query);
    const queryArgs = query.split(/[,&]/g), result = {};
    return queryArgs.forEach(arg => {
      const idx = arg.indexOf("=");
      if (idx >= 0) {
        let name = arg.substr(0, idx), value = decodeURIComponent(arg.substr(idx + 1));
        specialValues.hasOwnProperty(value) && (value = specialValues[value]), "[]" === name.substr(-2) ? (name = decodeURIComponent(name.substr(0, name.length - 2)), 
        Array.isArray(result[name]) || (result[name] = []), result[name].push(value)) : (name = decodeURIComponent(name), 
        result[name] = value);
      } else "-" === arg.substr(0, 1) ? result[decodeURIComponent(arg.substr(1))] = !1 : "+" === arg.substr(0, 1) ? result[decodeURIComponent(arg.substr(1))] = !0 : result[decodeURIComponent(arg)] = !0;
    }), result;
  };
}, function(module, exports, __webpack_require__) {
  const baseEncodeTables = {
    26: "abcdefghijklmnopqrstuvwxyz",
    32: "123456789abcdefghjkmnpqrstuvwxyz",
    36: "0123456789abcdefghijklmnopqrstuvwxyz",
    49: "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
    52: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    58: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",
    62: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    64: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
  };
  module.exports = function(buffer, hashType, digestType, maxLength) {
    hashType = hashType || "md5", maxLength = maxLength || 9999;
    const hash = __webpack_require__(15).createHash(hashType);
    return hash.update(buffer), "base26" === digestType || "base32" === digestType || "base36" === digestType || "base49" === digestType || "base52" === digestType || "base58" === digestType || "base62" === digestType || "base64" === digestType ? function(buffer, base) {
      const encodeTable = baseEncodeTables[base];
      if (!encodeTable) throw new Error("Unknown encoding base" + base);
      const readLength = buffer.length, Big = __webpack_require__(14);
      Big.RM = Big.DP = 0;
      let b = new Big(0);
      for (let i = readLength - 1; i >= 0; i--) b = b.times(256).plus(buffer[i]);
      let output = "";
      for (;b.gt(0); ) output = encodeTable[b.mod(base)] + output, b = b.div(base);
      return Big.DP = 20, Big.RM = 1, output;
    }(hash.digest(), digestType.substr(4)).substr(0, maxLength) : hash.digest(digestType || "hex").substr(0, maxLength);
  };
}, function(module, exports, __webpack_require__) {
  const getOptions = __webpack_require__(4), parseQuery = __webpack_require__(1), stringifyRequest = __webpack_require__(8), getRemainingRequest = __webpack_require__(9), getCurrentRequest = __webpack_require__(10), isUrlRequest = __webpack_require__(11), urlToRequest = __webpack_require__(12), parseString = __webpack_require__(13), getHashDigest = __webpack_require__(2), interpolateName = __webpack_require__(16);
  exports.getOptions = getOptions, exports.parseQuery = parseQuery, exports.stringifyRequest = stringifyRequest, 
  exports.getRemainingRequest = getRemainingRequest, exports.getCurrentRequest = getCurrentRequest, 
  exports.isUrlRequest = isUrlRequest, exports.urlToRequest = urlToRequest, exports.parseString = parseString, 
  exports.getHashDigest = getHashDigest, exports.interpolateName = interpolateName;
}, function(module, exports, __webpack_require__) {
  const parseQuery = __webpack_require__(1);
  module.exports = function(loaderContext) {
    const query = loaderContext.query;
    return "string" == typeof query && "" !== query ? parseQuery(loaderContext.query) : query && "object" == typeof query ? query : null;
  };
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  exports.default = function(text, reviver) {
    source = String(text), parseState = "start", stack = [], pos = 0, line = 1, column = 0, 
    token = void 0, key = void 0, root = void 0;
    do {
      token = lex(), parseStates[parseState]();
    } while ("eof" !== token.type);
    if ("function" == typeof reviver) return function internalize(holder, name, reviver) {
      var value = holder[name];
      if (null != value && "object" === (void 0 === value ? "undefined" : _typeof(value))) for (var _key in value) {
        var replacement = internalize(value, _key, reviver);
        void 0 === replacement ? delete value[_key] : value[_key] = replacement;
      }
      return reviver.call(holder, name, value);
    }({
      "": root
    }, "", reviver);
    return root;
  };
  var util = __webpack_require__(6);
  var source = void 0, parseState = void 0, stack = void 0, pos = void 0, line = void 0, column = void 0, token = void 0, key = void 0, root = void 0;
  var lexState = void 0, buffer = void 0, doubleQuote = void 0, _sign = void 0, c = void 0;
  function lex() {
    for (lexState = "default", buffer = "", doubleQuote = !1, _sign = 1; ;) {
      c = peek();
      var _token = lexStates[lexState]();
      if (_token) return _token;
    }
  }
  function peek() {
    if (source[pos]) return String.fromCodePoint(source.codePointAt(pos));
  }
  function read() {
    var c = peek();
    return "\n" === c ? (line++, column = 0) : c ? column += c.length : column++, c && (pos += c.length), 
    c;
  }
  var lexStates = {
    default: function() {
      switch (c) {
       case "\t":
       case "\v":
       case "\f":
       case " ":
       case " ":
       case "\ufeff":
       case "\n":
       case "\r":
       case "\u2028":
       case "\u2029":
        return void read();

       case "/":
        return read(), void (lexState = "comment");

       case void 0:
        return read(), newToken("eof");
      }
      if (!util.isSpaceSeparator(c)) return lexStates[parseState]();
      read();
    },
    comment: function() {
      switch (c) {
       case "*":
        return read(), void (lexState = "multiLineComment");

       case "/":
        return read(), void (lexState = "singleLineComment");
      }
      throw invalidChar(read());
    },
    multiLineComment: function() {
      switch (c) {
       case "*":
        return read(), void (lexState = "multiLineCommentAsterisk");

       case void 0:
        throw invalidChar(read());
      }
      read();
    },
    multiLineCommentAsterisk: function() {
      switch (c) {
       case "*":
        return void read();

       case "/":
        return read(), void (lexState = "default");

       case void 0:
        throw invalidChar(read());
      }
      read(), lexState = "multiLineComment";
    },
    singleLineComment: function() {
      switch (c) {
       case "\n":
       case "\r":
       case "\u2028":
       case "\u2029":
        return read(), void (lexState = "default");

       case void 0:
        return read(), newToken("eof");
      }
      read();
    },
    value: function() {
      switch (c) {
       case "{":
       case "[":
        return newToken("punctuator", read());

       case "n":
        return read(), literal("ull"), newToken("null", null);

       case "t":
        return read(), literal("rue"), newToken("boolean", !0);

       case "f":
        return read(), literal("alse"), newToken("boolean", !1);

       case "-":
       case "+":
        return "-" === read() && (_sign = -1), void (lexState = "sign");

       case ".":
        return buffer = read(), void (lexState = "decimalPointLeading");

       case "0":
        return buffer = read(), void (lexState = "zero");

       case "1":
       case "2":
       case "3":
       case "4":
       case "5":
       case "6":
       case "7":
       case "8":
       case "9":
        return buffer = read(), void (lexState = "decimalInteger");

       case "I":
        return read(), literal("nfinity"), newToken("numeric", 1 / 0);

       case "N":
        return read(), literal("aN"), newToken("numeric", NaN);

       case '"':
       case "'":
        return doubleQuote = '"' === read(), buffer = "", void (lexState = "string");
      }
      throw invalidChar(read());
    },
    identifierNameStartEscape: function() {
      if ("u" !== c) throw invalidChar(read());
      read();
      var u = unicodeEscape();
      switch (u) {
       case "$":
       case "_":
        break;

       default:
        if (!util.isIdStartChar(u)) throw invalidIdentifier();
      }
      buffer += u, lexState = "identifierName";
    },
    identifierName: function() {
      switch (c) {
       case "$":
       case "_":
       case "‌":
       case "‍":
        return void (buffer += read());

       case "\\":
        return read(), void (lexState = "identifierNameEscape");
      }
      if (!util.isIdContinueChar(c)) return newToken("identifier", buffer);
      buffer += read();
    },
    identifierNameEscape: function() {
      if ("u" !== c) throw invalidChar(read());
      read();
      var u = unicodeEscape();
      switch (u) {
       case "$":
       case "_":
       case "‌":
       case "‍":
        break;

       default:
        if (!util.isIdContinueChar(u)) throw invalidIdentifier();
      }
      buffer += u, lexState = "identifierName";
    },
    sign: function() {
      switch (c) {
       case ".":
        return buffer = read(), void (lexState = "decimalPointLeading");

       case "0":
        return buffer = read(), void (lexState = "zero");

       case "1":
       case "2":
       case "3":
       case "4":
       case "5":
       case "6":
       case "7":
       case "8":
       case "9":
        return buffer = read(), void (lexState = "decimalInteger");

       case "I":
        return read(), literal("nfinity"), newToken("numeric", _sign * (1 / 0));

       case "N":
        return read(), literal("aN"), newToken("numeric", NaN);
      }
      throw invalidChar(read());
    },
    zero: function() {
      switch (c) {
       case ".":
        return buffer += read(), void (lexState = "decimalPoint");

       case "e":
       case "E":
        return buffer += read(), void (lexState = "decimalExponent");

       case "x":
       case "X":
        return buffer += read(), void (lexState = "hexadecimal");
      }
      return newToken("numeric", 0 * _sign);
    },
    decimalInteger: function() {
      switch (c) {
       case ".":
        return buffer += read(), void (lexState = "decimalPoint");

       case "e":
       case "E":
        return buffer += read(), void (lexState = "decimalExponent");
      }
      if (!util.isDigit(c)) return newToken("numeric", _sign * Number(buffer));
      buffer += read();
    },
    decimalPointLeading: function() {
      if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalFraction");
      throw invalidChar(read());
    },
    decimalPoint: function() {
      switch (c) {
       case "e":
       case "E":
        return buffer += read(), void (lexState = "decimalExponent");
      }
      return util.isDigit(c) ? (buffer += read(), void (lexState = "decimalFraction")) : newToken("numeric", _sign * Number(buffer));
    },
    decimalFraction: function() {
      switch (c) {
       case "e":
       case "E":
        return buffer += read(), void (lexState = "decimalExponent");
      }
      if (!util.isDigit(c)) return newToken("numeric", _sign * Number(buffer));
      buffer += read();
    },
    decimalExponent: function() {
      switch (c) {
       case "+":
       case "-":
        return buffer += read(), void (lexState = "decimalExponentSign");
      }
      if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalExponentInteger");
      throw invalidChar(read());
    },
    decimalExponentSign: function() {
      if (util.isDigit(c)) return buffer += read(), void (lexState = "decimalExponentInteger");
      throw invalidChar(read());
    },
    decimalExponentInteger: function() {
      if (!util.isDigit(c)) return newToken("numeric", _sign * Number(buffer));
      buffer += read();
    },
    hexadecimal: function() {
      if (util.isHexDigit(c)) return buffer += read(), void (lexState = "hexadecimalInteger");
      throw invalidChar(read());
    },
    hexadecimalInteger: function() {
      if (!util.isHexDigit(c)) return newToken("numeric", _sign * Number(buffer));
      buffer += read();
    },
    string: function() {
      switch (c) {
       case "\\":
        return read(), void (buffer += function() {
          switch (peek()) {
           case "b":
            return read(), "\b";

           case "f":
            return read(), "\f";

           case "n":
            return read(), "\n";

           case "r":
            return read(), "\r";

           case "t":
            return read(), "\t";

           case "v":
            return read(), "\v";

           case "0":
            if (read(), util.isDigit(peek())) throw invalidChar(read());
            return "\0";

           case "x":
            return read(), function() {
              var buffer = "", c = peek();
              if (!util.isHexDigit(c)) throw invalidChar(read());
              if (buffer += read(), c = peek(), !util.isHexDigit(c)) throw invalidChar(read());
              return buffer += read(), String.fromCodePoint(parseInt(buffer, 16));
            }();

           case "u":
            return read(), unicodeEscape();

           case "\n":
           case "\u2028":
           case "\u2029":
            return read(), "";

           case "\r":
            return read(), "\n" === peek() && read(), "";

           case "1":
           case "2":
           case "3":
           case "4":
           case "5":
           case "6":
           case "7":
           case "8":
           case "9":
           case void 0:
            throw invalidChar(read());
          }
          return read();
        }());

       case '"':
        return doubleQuote ? (read(), newToken("string", buffer)) : void (buffer += read());

       case "'":
        return doubleQuote ? void (buffer += read()) : (read(), newToken("string", buffer));

       case "\n":
       case "\r":
        throw invalidChar(read());

       case "\u2028":
       case "\u2029":
        !function(c) {
          console.warn("JSON5: '" + c + "' is not valid ECMAScript; consider escaping");
        }(c);
        break;

       case void 0:
        throw invalidChar(read());
      }
      buffer += read();
    },
    start: function() {
      switch (c) {
       case "{":
       case "[":
        return newToken("punctuator", read());
      }
      lexState = "value";
    },
    beforePropertyName: function() {
      switch (c) {
       case "$":
       case "_":
        return buffer = read(), void (lexState = "identifierName");

       case "\\":
        return read(), void (lexState = "identifierNameStartEscape");

       case "}":
        return newToken("punctuator", read());

       case '"':
       case "'":
        return doubleQuote = '"' === read(), void (lexState = "string");
      }
      if (util.isIdStartChar(c)) return buffer += read(), void (lexState = "identifierName");
      throw invalidChar(read());
    },
    afterPropertyName: function() {
      if (":" === c) return newToken("punctuator", read());
      throw invalidChar(read());
    },
    beforePropertyValue: function() {
      lexState = "value";
    },
    afterPropertyValue: function() {
      switch (c) {
       case ",":
       case "}":
        return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    beforeArrayValue: function() {
      if ("]" === c) return newToken("punctuator", read());
      lexState = "value";
    },
    afterArrayValue: function() {
      switch (c) {
       case ",":
       case "]":
        return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    end: function() {
      throw invalidChar(read());
    }
  };
  function newToken(type, value) {
    return {
      type: type,
      value: value,
      line: line,
      column: column
    };
  }
  function literal(s) {
    for (var _c of s) {
      if (peek() !== _c) throw invalidChar(read());
      read();
    }
  }
  function unicodeEscape() {
    for (var buffer = "", count = 4; count-- > 0; ) {
      var _c2 = peek();
      if (!util.isHexDigit(_c2)) throw invalidChar(read());
      buffer += read();
    }
    return String.fromCodePoint(parseInt(buffer, 16));
  }
  var parseStates = {
    start: function() {
      if ("eof" === token.type) throw invalidEOF();
      push();
    },
    beforePropertyName: function() {
      switch (token.type) {
       case "identifier":
       case "string":
        return key = token.value, void (parseState = "afterPropertyName");

       case "punctuator":
        return void pop();

       case "eof":
        throw invalidEOF();
      }
    },
    afterPropertyName: function() {
      if ("eof" === token.type) throw invalidEOF();
      parseState = "beforePropertyValue";
    },
    beforePropertyValue: function() {
      if ("eof" === token.type) throw invalidEOF();
      push();
    },
    beforeArrayValue: function() {
      if ("eof" === token.type) throw invalidEOF();
      "punctuator" !== token.type || "]" !== token.value ? push() : pop();
    },
    afterPropertyValue: function() {
      if ("eof" === token.type) throw invalidEOF();
      switch (token.value) {
       case ",":
        return void (parseState = "beforePropertyName");

       case "}":
        pop();
      }
    },
    afterArrayValue: function() {
      if ("eof" === token.type) throw invalidEOF();
      switch (token.value) {
       case ",":
        return void (parseState = "beforeArrayValue");

       case "]":
        pop();
      }
    },
    end: function() {}
  };
  function push() {
    var value = void 0;
    switch (token.type) {
     case "punctuator":
      switch (token.value) {
       case "{":
        value = {};
        break;

       case "[":
        value = [];
      }
      break;

     case "null":
     case "boolean":
     case "numeric":
     case "string":
      value = token.value;
    }
    if (void 0 === root) root = value; else {
      var parent = stack[stack.length - 1];
      Array.isArray(parent) ? parent.push(value) : parent[key] = value;
    }
    if (null !== value && "object" === (void 0 === value ? "undefined" : _typeof(value))) stack.push(value), 
    parseState = Array.isArray(value) ? "beforeArrayValue" : "beforePropertyName"; else {
      var current = stack[stack.length - 1];
      parseState = null == current ? "end" : Array.isArray(current) ? "afterArrayValue" : "afterPropertyValue";
    }
  }
  function pop() {
    stack.pop();
    var current = stack[stack.length - 1];
    parseState = null == current ? "end" : Array.isArray(current) ? "afterArrayValue" : "afterPropertyValue";
  }
  function invalidChar(c) {
    return syntaxError(void 0 === c ? "JSON5: invalid end of input at " + line + ":" + column : "JSON5: invalid character '" + function(c) {
      var replacements = {
        "'": "\\'",
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\v": "\\v",
        "\0": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      if (replacements[c]) return replacements[c];
      if (c < " ") {
        var hexString = c.charCodeAt(0).toString(16);
        return "\\x" + ("00" + hexString).substring(hexString.length);
      }
      return c;
    }(c) + "' at " + line + ":" + column);
  }
  function invalidEOF() {
    return syntaxError("JSON5: invalid end of input at " + line + ":" + column);
  }
  function invalidIdentifier() {
    return syntaxError("JSON5: invalid identifier character at " + line + ":" + (column -= 5));
  }
  function syntaxError(message) {
    var err = new SyntaxError(message);
    return err.lineNumber = line, err.columnNumber = column, err;
  }
  module.exports = exports.default;
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.isSpaceSeparator = function(c) {
    return unicode.Space_Separator.test(c);
  }, exports.isIdStartChar = function(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || "$" === c || "_" === c || unicode.ID_Start.test(c);
  }, exports.isIdContinueChar = function(c) {
    return c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || "$" === c || "_" === c || "‌" === c || "‍" === c || unicode.ID_Continue.test(c);
  }, exports.isDigit = function(c) {
    return /[0-9]/.test(c);
  }, exports.isHexDigit = function(c) {
    return /[0-9A-Fa-f]/.test(c);
  };
  var unicode = __webpack_require__(7);
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/, 
  exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), matchRelativePath = /^\.\.?[/\\]/;
  function isAbsolutePath(str) {
    return path.posix.isAbsolute(str) || path.win32.isAbsolute(str);
  }
  module.exports = function(loaderContext, request) {
    const splitted = request.split("!"), context = loaderContext.context || loaderContext.options && loaderContext.options.context;
    return JSON.stringify(splitted.map(part => {
      const splittedPart = part.match(/^(.*?)(\?.*)/), query = splittedPart ? splittedPart[2] : "";
      let singlePath = splittedPart ? splittedPart[1] : part;
      if (isAbsolutePath(singlePath) && context) {
        if (singlePath = path.relative(context, singlePath), isAbsolutePath(singlePath)) return singlePath + query;
        !1 === (str = singlePath, matchRelativePath.test(str)) && (singlePath = "./" + singlePath);
      }
      var str;
      return singlePath.replace(/\\/g, "/") + query;
    }).join("!"));
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(loaderContext) {
    return loaderContext.remainingRequest ? loaderContext.remainingRequest : loaderContext.loaders.slice(loaderContext.loaderIndex + 1).map(obj => obj.request).concat([ loaderContext.resource ]).join("!");
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(loaderContext) {
    return loaderContext.currentRequest ? loaderContext.currentRequest : loaderContext.loaders.slice(loaderContext.loaderIndex).map(obj => obj.request).concat([ loaderContext.resource ]).join("!");
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0);
  module.exports = function(url, root) {
    return !(/^[a-z][a-z0-9+.-]*:/i.test(url) && !path.win32.isAbsolute(url)) && (!/^\/\//.test(url) && (!/^[{}[\]#*;,'§$%&(=?`´^°<>]/.test(url) && (void 0 !== root && !1 !== root || !/^\//.test(url))));
  };
}, function(module, exports, __webpack_require__) {
  const matchNativeWin32Path = /^[A-Z]:[/\\]|^\\\\/i;
  module.exports = function(url, root) {
    if ("" === url) return "";
    const moduleRequestRegex = /^[^?]*~/;
    let request;
    if (matchNativeWin32Path.test(url)) request = url; else if (void 0 !== root && !1 !== root && /^\//.test(url)) switch (typeof root) {
     case "string":
      request = moduleRequestRegex.test(root) ? root.replace(/([^~/])$/, "$1/") + url.slice(1) : root + url;
      break;

     case "boolean":
      request = url;
      break;

     default:
      throw new Error("Unexpected parameters to loader-utils 'urlToRequest': url = " + url + ", root = " + root + ".");
    } else request = /^\.\.?\//.test(url) ? url : "./" + url;
    return moduleRequestRegex.test(request) && (request = request.replace(moduleRequestRegex, "")), 
    request;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function parseString(str) {
    try {
      return '"' === str[0] ? JSON.parse(str) : "'" === str[0] && "'" === str.substr(str.length - 1) ? parseString(str.replace(/\\.|"/g, x => '"' === x ? '\\"' : x).replace(/^'|'$/g, '"')) : JSON.parse('"' + str + '"');
    } catch (e) {
      return str;
    }
  };
}, function(module, exports, __webpack_require__) {
  var Big, NAME = "[big.js] ", INVALID = NAME + "Invalid ", INVALID_DP = INVALID + "decimal places", P = {}, NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  function round(x, dp, rm, more) {
    var xc = x.c, i = x.e + dp + 1;
    if (i < xc.length) {
      if (1 === rm) more = xc[i] >= 5; else if (2 === rm) more = xc[i] > 5 || 5 == xc[i] && (more || i < 0 || void 0 !== xc[i + 1] || 1 & xc[i - 1]); else if (3 === rm) more = more || !!xc[0]; else if (more = !1, 
      0 !== rm) throw Error("[big.js] Invalid rounding mode");
      if (i < 1) xc.length = 1, more ? (x.e = -dp, xc[0] = 1) : xc[0] = x.e = 0; else {
        if (xc.length = i--, more) for (;++xc[i] > 9; ) xc[i] = 0, i-- || (++x.e, xc.unshift(1));
        for (i = xc.length; !xc[--i]; ) xc.pop();
      }
    } else if (rm < 0 || rm > 3 || rm !== ~~rm) throw Error("[big.js] Invalid rounding mode");
    return x;
  }
  function stringify(x, id, n, k) {
    var e, s, Big = x.constructor, z = !x.c[0];
    if (void 0 !== n) {
      if (n !== ~~n || n < (3 == id) || n > 1e6) throw Error(3 == id ? INVALID + "precision" : INVALID_DP);
      for (n = k - (x = new Big(x)).e, x.c.length > ++k && round(x, n, Big.RM), 2 == id && (k = x.e + n + 1); x.c.length < k; ) x.c.push(0);
    }
    if (e = x.e, n = (s = x.c.join("")).length, 2 != id && (1 == id || 3 == id && k <= e || e <= Big.NE || e >= Big.PE)) s = s.charAt(0) + (n > 1 ? "." + s.slice(1) : "") + (e < 0 ? "e" : "e+") + e; else if (e < 0) {
      for (;++e; ) s = "0" + s;
      s = "0." + s;
    } else if (e > 0) if (++e > n) for (e -= n; e--; ) s += "0"; else e < n && (s = s.slice(0, e) + "." + s.slice(e)); else n > 1 && (s = s.charAt(0) + "." + s.slice(1));
    return x.s < 0 && (!z || 4 == id) ? "-" + s : s;
  }
  P.abs = function() {
    var x = new this.constructor(this);
    return x.s = 1, x;
  }, P.cmp = function(y) {
    var isneg, x = this, xc = x.c, yc = (y = new x.constructor(y)).c, i = x.s, j = y.s, k = x.e, l = y.e;
    if (!xc[0] || !yc[0]) return xc[0] ? i : yc[0] ? -j : 0;
    if (i != j) return i;
    if (isneg = i < 0, k != l) return k > l ^ isneg ? 1 : -1;
    for (j = (k = xc.length) < (l = yc.length) ? k : l, i = -1; ++i < j; ) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  }, P.div = function(y) {
    var x = this, Big = x.constructor, a = x.c, b = (y = new Big(y)).c, k = x.s == y.s ? 1 : -1, dp = Big.DP;
    if (dp !== ~~dp || dp < 0 || dp > 1e6) throw Error(INVALID_DP);
    if (!b[0]) throw Error("[big.js] Division by zero");
    if (!a[0]) return new Big(0 * k);
    var bl, bt, n, cmp, ri, bz = b.slice(), ai = bl = b.length, al = a.length, r = a.slice(0, bl), rl = r.length, q = y, qc = q.c = [], qi = 0, d = dp + (q.e = x.e - y.e) + 1;
    for (q.s = k, k = d < 0 ? 0 : d, bz.unshift(0); rl++ < bl; ) r.push(0);
    do {
      for (n = 0; n < 10; n++) {
        if (bl != (rl = r.length)) cmp = bl > rl ? 1 : -1; else for (ri = -1, cmp = 0; ++ri < bl; ) if (b[ri] != r[ri]) {
          cmp = b[ri] > r[ri] ? 1 : -1;
          break;
        }
        if (!(cmp < 0)) break;
        for (bt = rl == bl ? b : bz; rl; ) {
          if (r[--rl] < bt[rl]) {
            for (ri = rl; ri && !r[--ri]; ) r[ri] = 9;
            --r[ri], r[rl] += 10;
          }
          r[rl] -= bt[rl];
        }
        for (;!r[0]; ) r.shift();
      }
      qc[qi++] = cmp ? n : ++n, r[0] && cmp ? r[rl] = a[ai] || 0 : r = [ a[ai] ];
    } while ((ai++ < al || void 0 !== r[0]) && k--);
    return qc[0] || 1 == qi || (qc.shift(), q.e--), qi > d && round(q, dp, Big.RM, void 0 !== r[0]), 
    q;
  }, P.eq = function(y) {
    return !this.cmp(y);
  }, P.gt = function(y) {
    return this.cmp(y) > 0;
  }, P.gte = function(y) {
    return this.cmp(y) > -1;
  }, P.lt = function(y) {
    return this.cmp(y) < 0;
  }, P.lte = function(y) {
    return this.cmp(y) < 1;
  }, P.minus = P.sub = function(y) {
    var i, j, t, xlty, x = this, Big = x.constructor, a = x.s, b = (y = new Big(y)).s;
    if (a != b) return y.s = -b, x.plus(y);
    var xc = x.c.slice(), xe = x.e, yc = y.c, ye = y.e;
    if (!xc[0] || !yc[0]) return yc[0] ? (y.s = -b, y) : new Big(xc[0] ? x : 0);
    if (a = xe - ye) {
      for ((xlty = a < 0) ? (a = -a, t = xc) : (ye = xe, t = yc), t.reverse(), b = a; b--; ) t.push(0);
      t.reverse();
    } else for (j = ((xlty = xc.length < yc.length) ? xc : yc).length, a = b = 0; b < j; b++) if (xc[b] != yc[b]) {
      xlty = xc[b] < yc[b];
      break;
    }
    if (xlty && (t = xc, xc = yc, yc = t, y.s = -y.s), (b = (j = yc.length) - (i = xc.length)) > 0) for (;b--; ) xc[i++] = 0;
    for (b = i; j > a; ) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; ) xc[i] = 9;
        --xc[i], xc[j] += 10;
      }
      xc[j] -= yc[j];
    }
    for (;0 === xc[--b]; ) xc.pop();
    for (;0 === xc[0]; ) xc.shift(), --ye;
    return xc[0] || (y.s = 1, xc = [ ye = 0 ]), y.c = xc, y.e = ye, y;
  }, P.mod = function(y) {
    var ygtx, x = this, Big = x.constructor, a = x.s, b = (y = new Big(y)).s;
    if (!y.c[0]) throw Error("[big.js] Division by zero");
    return x.s = y.s = 1, ygtx = 1 == y.cmp(x), x.s = a, y.s = b, ygtx ? new Big(x) : (a = Big.DP, 
    b = Big.RM, Big.DP = Big.RM = 0, x = x.div(y), Big.DP = a, Big.RM = b, this.minus(x.times(y)));
  }, P.plus = P.add = function(y) {
    var t, x = this, Big = x.constructor, a = x.s, b = (y = new Big(y)).s;
    if (a != b) return y.s = -b, x.minus(y);
    var xe = x.e, xc = x.c, ye = y.e, yc = y.c;
    if (!xc[0] || !yc[0]) return yc[0] ? y : new Big(xc[0] ? x : 0 * a);
    if (xc = xc.slice(), a = xe - ye) {
      for (a > 0 ? (ye = xe, t = yc) : (a = -a, t = xc), t.reverse(); a--; ) t.push(0);
      t.reverse();
    }
    for (xc.length - yc.length < 0 && (t = yc, yc = xc, xc = t), a = yc.length, b = 0; a; xc[a] %= 10) b = (xc[--a] = xc[a] + yc[a] + b) / 10 | 0;
    for (b && (xc.unshift(b), ++ye), a = xc.length; 0 === xc[--a]; ) xc.pop();
    return y.c = xc, y.e = ye, y;
  }, P.pow = function(n) {
    var x = this, one = new x.constructor(1), y = one, isneg = n < 0;
    if (n !== ~~n || n < -1e6 || n > 1e6) throw Error(INVALID + "exponent");
    for (isneg && (n = -n); 1 & n && (y = y.times(x)), n >>= 1; ) x = x.times(x);
    return isneg ? one.div(y) : y;
  }, P.round = function(dp, rm) {
    var Big = this.constructor;
    if (void 0 === dp) dp = 0; else if (dp !== ~~dp || dp < -1e6 || dp > 1e6) throw Error(INVALID_DP);
    return round(new Big(this), dp, void 0 === rm ? Big.RM : rm);
  }, P.sqrt = function() {
    var r, c, t, x = this, Big = x.constructor, s = x.s, e = x.e, half = new Big(.5);
    if (!x.c[0]) return new Big(x);
    if (s < 0) throw Error(NAME + "No square root");
    0 === (s = Math.sqrt(x + "")) || s === 1 / 0 ? ((c = x.c.join("")).length + e & 1 || (c += "0"), 
    e = ((e + 1) / 2 | 0) - (e < 0 || 1 & e), r = new Big(((s = Math.sqrt(c)) == 1 / 0 ? "1e" : (s = s.toExponential()).slice(0, s.indexOf("e") + 1)) + e)) : r = new Big(s), 
    e = r.e + (Big.DP += 4);
    do {
      t = r, r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join("") !== r.c.slice(0, e).join(""));
    return round(r, Big.DP -= 4, Big.RM);
  }, P.times = P.mul = function(y) {
    var c, x = this, Big = x.constructor, xc = x.c, yc = (y = new Big(y)).c, a = xc.length, b = yc.length, i = x.e, j = y.e;
    if (y.s = x.s == y.s ? 1 : -1, !xc[0] || !yc[0]) return new Big(0 * y.s);
    for (y.e = i + j, a < b && (c = xc, xc = yc, yc = c, j = a, a = b, b = j), c = new Array(j = a + b); j--; ) c[j] = 0;
    for (i = b; i--; ) {
      for (b = 0, j = a + i; j > i; ) b = c[j] + yc[i] * xc[j - i - 1] + b, c[j--] = b % 10, 
      b = b / 10 | 0;
      c[j] = (c[j] + b) % 10;
    }
    for (b ? ++y.e : c.shift(), i = c.length; !c[--i]; ) c.pop();
    return y.c = c, y;
  }, P.toExponential = function(dp) {
    return stringify(this, 1, dp, dp);
  }, P.toFixed = function(dp) {
    return stringify(this, 2, dp, this.e + dp);
  }, P.toPrecision = function(sd) {
    return stringify(this, 3, sd, sd - 1);
  }, P.toString = function() {
    return stringify(this);
  }, P.valueOf = P.toJSON = function() {
    return stringify(this, 4);
  }, (Big = function _Big_() {
    function Big(n) {
      var x = this;
      if (!(x instanceof Big)) return void 0 === n ? _Big_() : new Big(n);
      n instanceof Big ? (x.s = n.s, x.e = n.e, x.c = n.c.slice()) : function(x, n) {
        var e, i, nl;
        if (0 === n && 1 / n < 0) n = "-0"; else if (!NUMERIC.test(n += "")) throw Error(INVALID + "number");
        x.s = "-" == n.charAt(0) ? (n = n.slice(1), -1) : 1, (e = n.indexOf(".")) > -1 && (n = n.replace(".", ""));
        (i = n.search(/e/i)) > 0 ? (e < 0 && (e = i), e += +n.slice(i + 1), n = n.substring(0, i)) : e < 0 && (e = n.length);
        for (nl = n.length, i = 0; i < nl && "0" == n.charAt(i); ) ++i;
        if (i == nl) x.c = [ x.e = 0 ]; else {
          for (;nl > 0 && "0" == n.charAt(--nl); ) ;
          for (x.e = e - i - 1, x.c = [], e = 0; i <= nl; ) x.c[e++] = +n.charAt(i++);
        }
      }(x, n), x.constructor = Big;
    }
    return Big.prototype = P, Big.DP = 20, Big.RM = 1, Big.NE = -7, Big.PE = 21, Big.version = "5.2.2", 
    Big;
  }()).default = Big.Big = Big, module.exports = Big;
}, function(module, exports) {
  module.exports = require("crypto");
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), emojisList = __webpack_require__(17), getHashDigest = __webpack_require__(2), emojiRegex = /[\uD800-\uDFFF]./, emojiList = emojisList.filter(emoji => emojiRegex.test(emoji)), emojiCache = {};
  module.exports = function(loaderContext, name, options) {
    let filename;
    const hasQuery = loaderContext.resourceQuery && loaderContext.resourceQuery.length > 1;
    filename = "function" == typeof name ? name(loaderContext.resourcePath, hasQuery ? loaderContext.resourceQuery : void 0) : name || "[hash].[ext]";
    const context = options.context, content = options.content, regExp = options.regExp;
    let ext = "bin", basename = "file", directory = "", folder = "", query = "";
    if (loaderContext.resourcePath) {
      const parsed = path.parse(loaderContext.resourcePath);
      let resourcePath = loaderContext.resourcePath;
      parsed.ext && (ext = parsed.ext.substr(1)), parsed.dir && (basename = parsed.name, 
      resourcePath = parsed.dir + path.sep), void 0 !== context ? (directory = path.relative(context, resourcePath + "_").replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1"), 
      directory = directory.substr(0, directory.length - 1)) : directory = resourcePath.replace(/\\/g, "/").replace(/\.\.(\/)?/g, "_$1"), 
      1 === directory.length ? directory = "" : directory.length > 1 && (folder = path.basename(directory));
    }
    if (loaderContext.resourceQuery && loaderContext.resourceQuery.length > 1) {
      query = loaderContext.resourceQuery;
      const hashIdx = query.indexOf("#");
      hashIdx >= 0 && (query = query.substr(0, hashIdx));
    }
    let url = filename;
    if (content && (url = url.replace(/\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi, (all, hashType, digestType, maxLength) => getHashDigest(content, hashType, digestType, parseInt(maxLength, 10))).replace(/\[emoji(?::(\d+))?\]/gi, (all, length) => function(content, length) {
      if (emojiCache[content]) return emojiCache[content];
      length = length || 1;
      const emojis = [];
      do {
        if (!emojiList.length) throw new Error("Ran out of emoji");
        const index = Math.floor(Math.random() * emojiList.length);
        emojis.push(emojiList[index]), emojiList.splice(index, 1);
      } while (--length > 0);
      const emojiEncoding = emojis.join("");
      return emojiCache[content] = emojiEncoding, emojiEncoding;
    }(content, parseInt(length, 10)))), url = url.replace(/\[ext\]/gi, () => ext).replace(/\[name\]/gi, () => basename).replace(/\[path\]/gi, () => directory).replace(/\[folder\]/gi, () => folder).replace(/\[query\]/gi, () => query), 
    regExp && loaderContext.resourcePath) {
      const match = loaderContext.resourcePath.match(new RegExp(regExp));
      match && match.forEach((matched, i) => {
        url = url.replace(new RegExp("\\[" + i + "\\]", "ig"), matched);
      });
    }
    return "object" == typeof loaderContext.options && "function" == typeof loaderContext.options.customInterpolateName && (url = loaderContext.options.customInterpolateName.call(loaderContext, url, name, options)), 
    url;
  };
}, function(module, exports) {
  module.exports = [ "🀄️", "🃏", "🅰️", "🅱️", "🅾️", "🅿️", "🆎", "🆑", "🆒", "🆓", "🆔", "🆕", "🆖", "🆗", "🆘", "🆙", "🆚", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇦", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫", "🇧🇬", "🇧🇭", "🇧🇮", "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷", "🇧🇸", "🇧🇹", "🇧🇻", "🇧🇼", "🇧🇾", "🇧🇿", "🇧", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫", "🇨🇬", "🇨🇭", "🇨🇮", "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷", "🇨🇺", "🇨🇻", "🇨🇼", "🇨🇽", "🇨🇾", "🇨🇿", "🇨", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰", "🇩🇲", "🇩🇴", "🇩🇿", "🇩", "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸", "🇪🇹", "🇪🇺", "🇪", "🇫🇮", "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇫", "🇬🇦", "🇬🇧", "🇬🇩", "🇬🇪", "🇬🇫", "🇬🇬", "🇬🇭", "🇬🇮", "🇬🇱", "🇬🇲", "🇬🇳", "🇬🇵", "🇬🇶", "🇬🇷", "🇬🇸", "🇬🇹", "🇬🇺", "🇬🇼", "🇬🇾", "🇬", "🇭🇰", "🇭🇲", "🇭🇳", "🇭🇷", "🇭🇹", "🇭🇺", "🇭", "🇮🇨", "🇮🇩", "🇮🇪", "🇮🇱", "🇮🇲", "🇮🇳", "🇮🇴", "🇮🇶", "🇮🇷", "🇮🇸", "🇮🇹", "🇮", "🇯🇪", "🇯🇲", "🇯🇴", "🇯🇵", "🇯", "🇰🇪", "🇰🇬", "🇰🇭", "🇰🇮", "🇰🇲", "🇰🇳", "🇰🇵", "🇰🇷", "🇰🇼", "🇰🇾", "🇰🇿", "🇰", "🇱🇦", "🇱🇧", "🇱🇨", "🇱🇮", "🇱🇰", "🇱🇷", "🇱🇸", "🇱🇹", "🇱🇺", "🇱🇻", "🇱🇾", "🇱", "🇲🇦", "🇲🇨", "🇲🇩", "🇲🇪", "🇲🇫", "🇲🇬", "🇲🇭", "🇲🇰", "🇲🇱", "🇲🇲", "🇲🇳", "🇲🇴", "🇲🇵", "🇲🇶", "🇲🇷", "🇲🇸", "🇲🇹", "🇲🇺", "🇲🇻", "🇲🇼", "🇲🇽", "🇲🇾", "🇲🇿", "🇲", "🇳🇦", "🇳🇨", "🇳🇪", "🇳🇫", "🇳🇬", "🇳🇮", "🇳🇱", "🇳🇴", "🇳🇵", "🇳🇷", "🇳🇺", "🇳🇿", "🇳", "🇴🇲", "🇴", "🇵🇦", "🇵🇪", "🇵🇫", "🇵🇬", "🇵🇭", "🇵🇰", "🇵🇱", "🇵🇲", "🇵🇳", "🇵🇷", "🇵🇸", "🇵🇹", "🇵🇼", "🇵🇾", "🇵", "🇶🇦", "🇶", "🇷🇪", "🇷🇴", "🇷🇸", "🇷🇺", "🇷🇼", "🇷", "🇸🇦", "🇸🇧", "🇸🇨", "🇸🇩", "🇸🇪", "🇸🇬", "🇸🇭", "🇸🇮", "🇸🇯", "🇸🇰", "🇸🇱", "🇸🇲", "🇸🇳", "🇸🇴", "🇸🇷", "🇸🇸", "🇸🇹", "🇸🇻", "🇸🇽", "🇸🇾", "🇸🇿", "🇸", "🇹🇦", "🇹🇨", "🇹🇩", "🇹🇫", "🇹🇬", "🇹🇭", "🇹🇯", "🇹🇰", "🇹🇱", "🇹🇲", "🇹🇳", "🇹🇴", "🇹🇷", "🇹🇹", "🇹🇻", "🇹🇼", "🇹🇿", "🇹", "🇺🇦", "🇺🇬", "🇺🇲", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇺", "🇻🇦", "🇻🇨", "🇻🇪", "🇻🇬", "🇻🇮", "🇻🇳", "🇻🇺", "🇻", "🇼🇫", "🇼🇸", "🇼", "🇽🇰", "🇽", "🇾🇪", "🇾🇹", "🇾", "🇿🇦", "🇿🇲", "🇿🇼", "🇿", "🈁", "🈂️", "🈚️", "🈯️", "🈲", "🈳", "🈴", "🈵", "🈶", "🈷️", "🈸", "🈹", "🈺", "🉐", "🉑", "🌀", "🌁", "🌂", "🌃", "🌄", "🌅", "🌆", "🌇", "🌈", "🌉", "🌊", "🌋", "🌌", "🌍", "🌎", "🌏", "🌐", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "🌝", "🌞", "🌟", "🌠", "🌡️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌭", "🌮", "🌯", "🌰", "🌱", "🌲", "🌳", "🌴", "🌵", "🌶️", "🌷", "🌸", "🌹", "🌺", "🌻", "🌼", "🌽", "🌾", "🌿", "🍀", "🍁", "🍂", "🍃", "🍄", "🍅", "🍆", "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🍔", "🍕", "🍖", "🍗", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍞", "🍟", "🍠", "🍡", "🍢", "🍣", "🍤", "🍥", "🍦", "🍧", "🍨", "🍩", "🍪", "🍫", "🍬", "🍭", "🍮", "🍯", "🍰", "🍱", "🍲", "🍳", "🍴", "🍵", "🍶", "🍷", "🍸", "🍹", "🍺", "🍻", "🍼", "🍽️", "🍾", "🍿", "🎀", "🎁", "🎂", "🎃", "🎄", "🎅🏻", "🎅🏼", "🎅🏽", "🎅🏾", "🎅🏿", "🎅", "🎆", "🎇", "🎈", "🎉", "🎊", "🎋", "🎌", "🎍", "🎎", "🎏", "🎐", "🎑", "🎒", "🎓", "🎖️", "🎗️", "🎙️", "🎚️", "🎛️", "🎞️", "🎟️", "🎠", "🎡", "🎢", "🎣", "🎤", "🎥", "🎦", "🎧", "🎨", "🎩", "🎪", "🎫", "🎬", "🎭", "🎮", "🎯", "🎰", "🎱", "🎲", "🎳", "🎴", "🎵", "🎶", "🎷", "🎸", "🎹", "🎺", "🎻", "🎼", "🎽", "🎾", "🎿", "🏀", "🏁", "🏂🏻", "🏂🏼", "🏂🏽", "🏂🏾", "🏂🏿", "🏂", "🏃🏻‍♀️", "🏃🏻‍♂️", "🏃🏻", "🏃🏼‍♀️", "🏃🏼‍♂️", "🏃🏼", "🏃🏽‍♀️", "🏃🏽‍♂️", "🏃🏽", "🏃🏾‍♀️", "🏃🏾‍♂️", "🏃🏾", "🏃🏿‍♀️", "🏃🏿‍♂️", "🏃🏿", "🏃‍♀️", "🏃‍♂️", "🏃", "🏄🏻‍♀️", "🏄🏻‍♂️", "🏄🏻", "🏄🏼‍♀️", "🏄🏼‍♂️", "🏄🏼", "🏄🏽‍♀️", "🏄🏽‍♂️", "🏄🏽", "🏄🏾‍♀️", "🏄🏾‍♂️", "🏄🏾", "🏄🏿‍♀️", "🏄🏿‍♂️", "🏄🏿", "🏄‍♀️", "🏄‍♂️", "🏄", "🏅", "🏆", "🏇🏻", "🏇🏼", "🏇🏽", "🏇🏾", "🏇🏿", "🏇", "🏈", "🏉", "🏊🏻‍♀️", "🏊🏻‍♂️", "🏊🏻", "🏊🏼‍♀️", "🏊🏼‍♂️", "🏊🏼", "🏊🏽‍♀️", "🏊🏽‍♂️", "🏊🏽", "🏊🏾‍♀️", "🏊🏾‍♂️", "🏊🏾", "🏊🏿‍♀️", "🏊🏿‍♂️", "🏊🏿", "🏊‍♀️", "🏊‍♂️", "🏊", "🏋🏻‍♀️", "🏋🏻‍♂️", "🏋🏻", "🏋🏼‍♀️", "🏋🏼‍♂️", "🏋🏼", "🏋🏽‍♀️", "🏋🏽‍♂️", "🏋🏽", "🏋🏾‍♀️", "🏋🏾‍♂️", "🏋🏾", "🏋🏿‍♀️", "🏋🏿‍♂️", "🏋🏿", "🏋️‍♀️", "🏋️‍♂️", "🏋️", "🏌🏻‍♀️", "🏌🏻‍♂️", "🏌🏻", "🏌🏼‍♀️", "🏌🏼‍♂️", "🏌🏼", "🏌🏽‍♀️", "🏌🏽‍♂️", "🏌🏽", "🏌🏾‍♀️", "🏌🏾‍♂️", "🏌🏾", "🏌🏿‍♀️", "🏌🏿‍♂️", "🏌🏿", "🏌️‍♀️", "🏌️‍♂️", "🏌️", "🏍️", "🏎️", "🏏", "🏐", "🏑", "🏒", "🏓", "🏔️", "🏕️", "🏖️", "🏗️", "🏘️", "🏙️", "🏚️", "🏛️", "🏜️", "🏝️", "🏞️", "🏟️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏧", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏮", "🏯", "🏰", "🏳️‍🌈", "🏳️", "🏴‍☠️", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "🏴", "🏵️", "🏷️", "🏸", "🏹", "🏺", "🏻", "🏼", "🏽", "🏾", "🏿", "🐀", "🐁", "🐂", "🐃", "🐄", "🐅", "🐆", "🐇", "🐈", "🐉", "🐊", "🐋", "🐌", "🐍", "🐎", "🐏", "🐐", "🐑", "🐒", "🐓", "🐔", "🐕‍🦺", "🐕", "🐖", "🐗", "🐘", "🐙", "🐚", "🐛", "🐜", "🐝", "🐞", "🐟", "🐠", "🐡", "🐢", "🐣", "🐤", "🐥", "🐦", "🐧", "🐨", "🐩", "🐪", "🐫", "🐬", "🐭", "🐮", "🐯", "🐰", "🐱", "🐲", "🐳", "🐴", "🐵", "🐶", "🐷", "🐸", "🐹", "🐺", "🐻", "🐼", "🐽", "🐾", "🐿️", "👀", "👁‍🗨", "👁️", "👂🏻", "👂🏼", "👂🏽", "👂🏾", "👂🏿", "👂", "👃🏻", "👃🏼", "👃🏽", "👃🏾", "👃🏿", "👃", "👄", "👅", "👆🏻", "👆🏼", "👆🏽", "👆🏾", "👆🏿", "👆", "👇🏻", "👇🏼", "👇🏽", "👇🏾", "👇🏿", "👇", "👈🏻", "👈🏼", "👈🏽", "👈🏾", "👈🏿", "👈", "👉🏻", "👉🏼", "👉🏽", "👉🏾", "👉🏿", "👉", "👊🏻", "👊🏼", "👊🏽", "👊🏾", "👊🏿", "👊", "👋🏻", "👋🏼", "👋🏽", "👋🏾", "👋🏿", "👋", "👌🏻", "👌🏼", "👌🏽", "👌🏾", "👌🏿", "👌", "👍🏻", "👍🏼", "👍🏽", "👍🏾", "👍🏿", "👍", "👎🏻", "👎🏼", "👎🏽", "👎🏾", "👎🏿", "👎", "👏🏻", "👏🏼", "👏🏽", "👏🏾", "👏🏿", "👏", "👐🏻", "👐🏼", "👐🏽", "👐🏾", "👐🏿", "👐", "👑", "👒", "👓", "👔", "👕", "👖", "👗", "👘", "👙", "👚", "👛", "👜", "👝", "👞", "👟", "👠", "👡", "👢", "👣", "👤", "👥", "👦🏻", "👦🏼", "👦🏽", "👦🏾", "👦🏿", "👦", "👧🏻", "👧🏼", "👧🏽", "👧🏾", "👧🏿", "👧", "👨🏻‍🌾", "👨🏻‍🍳", "👨🏻‍🎓", "👨🏻‍🎤", "👨🏻‍🎨", "👨🏻‍🏫", "👨🏻‍🏭", "👨🏻‍💻", "👨🏻‍💼", "👨🏻‍🔧", "👨🏻‍🔬", "👨🏻‍🚀", "👨🏻‍🚒", "👨🏻‍🦯", "👨🏻‍🦰", "👨🏻‍🦱", "👨🏻‍🦲", "👨🏻‍🦳", "👨🏻‍🦼", "👨🏻‍🦽", "👨🏻‍⚕️", "👨🏻‍⚖️", "👨🏻‍✈️", "👨🏻", "👨🏼‍🌾", "👨🏼‍🍳", "👨🏼‍🎓", "👨🏼‍🎤", "👨🏼‍🎨", "👨🏼‍🏫", "👨🏼‍🏭", "👨🏼‍💻", "👨🏼‍💼", "👨🏼‍🔧", "👨🏼‍🔬", "👨🏼‍🚀", "👨🏼‍🚒", "👨🏼‍🤝‍👨🏻", "👨🏼‍🦯", "👨🏼‍🦰", "👨🏼‍🦱", "👨🏼‍🦲", "👨🏼‍🦳", "👨🏼‍🦼", "👨🏼‍🦽", "👨🏼‍⚕️", "👨🏼‍⚖️", "👨🏼‍✈️", "👨🏼", "👨🏽‍🌾", "👨🏽‍🍳", "👨🏽‍🎓", "👨🏽‍🎤", "👨🏽‍🎨", "👨🏽‍🏫", "👨🏽‍🏭", "👨🏽‍💻", "👨🏽‍💼", "👨🏽‍🔧", "👨🏽‍🔬", "👨🏽‍🚀", "👨🏽‍🚒", "👨🏽‍🤝‍👨🏻", "👨🏽‍🤝‍👨🏼", "👨🏽‍🦯", "👨🏽‍🦰", "👨🏽‍🦱", "👨🏽‍🦲", "👨🏽‍🦳", "👨🏽‍🦼", "👨🏽‍🦽", "👨🏽‍⚕️", "👨🏽‍⚖️", "👨🏽‍✈️", "👨🏽", "👨🏾‍🌾", "👨🏾‍🍳", "👨🏾‍🎓", "👨🏾‍🎤", "👨🏾‍🎨", "👨🏾‍🏫", "👨🏾‍🏭", "👨🏾‍💻", "👨🏾‍💼", "👨🏾‍🔧", "👨🏾‍🔬", "👨🏾‍🚀", "👨🏾‍🚒", "👨🏾‍🤝‍👨🏻", "👨🏾‍🤝‍👨🏼", "👨🏾‍🤝‍👨🏽", "👨🏾‍🦯", "👨🏾‍🦰", "👨🏾‍🦱", "👨🏾‍🦲", "👨🏾‍🦳", "👨🏾‍🦼", "👨🏾‍🦽", "👨🏾‍⚕️", "👨🏾‍⚖️", "👨🏾‍✈️", "👨🏾", "👨🏿‍🌾", "👨🏿‍🍳", "👨🏿‍🎓", "👨🏿‍🎤", "👨🏿‍🎨", "👨🏿‍🏫", "👨🏿‍🏭", "👨🏿‍💻", "👨🏿‍💼", "👨🏿‍🔧", "👨🏿‍🔬", "👨🏿‍🚀", "👨🏿‍🚒", "👨🏿‍🤝‍👨🏻", "👨🏿‍🤝‍👨🏼", "👨🏿‍🤝‍👨🏽", "👨🏿‍🤝‍👨🏾", "👨🏿‍🦯", "👨🏿‍🦰", "👨🏿‍🦱", "👨🏿‍🦲", "👨🏿‍🦳", "👨🏿‍🦼", "👨🏿‍🦽", "👨🏿‍⚕️", "👨🏿‍⚖️", "👨🏿‍✈️", "👨🏿", "👨‍🌾", "👨‍🍳", "👨‍🎓", "👨‍🎤", "👨‍🎨", "👨‍🏫", "👨‍🏭", "👨‍👦‍👦", "👨‍👦", "👨‍👧‍👦", "👨‍👧‍👧", "👨‍👧", "👨‍👨‍👦‍👦", "👨‍👨‍👦", "👨‍👨‍👧‍👦", "👨‍👨‍👧‍👧", "👨‍👨‍👧", "👨‍👩‍👦‍👦", "👨‍👩‍👦", "👨‍👩‍👧‍👦", "👨‍👩‍👧‍👧", "👨‍👩‍👧", "👨‍💻", "👨‍💼", "👨‍🔧", "👨‍🔬", "👨‍🚀", "👨‍🚒", "👨‍🦯", "👨‍🦰", "👨‍🦱", "👨‍🦲", "👨‍🦳", "👨‍🦼", "👨‍🦽", "👨‍⚕️", "👨‍⚖️", "👨‍✈️", "👨‍❤️‍👨", "👨‍❤️‍💋‍👨", "👨", "👩🏻‍🌾", "👩🏻‍🍳", "👩🏻‍🎓", "👩🏻‍🎤", "👩🏻‍🎨", "👩🏻‍🏫", "👩🏻‍🏭", "👩🏻‍💻", "👩🏻‍💼", "👩🏻‍🔧", "👩🏻‍🔬", "👩🏻‍🚀", "👩🏻‍🚒", "👩🏻‍🤝‍👨🏼", "👩🏻‍🤝‍👨🏽", "👩🏻‍🤝‍👨🏾", "👩🏻‍🤝‍👨🏿", "👩🏻‍🦯", "👩🏻‍🦰", "👩🏻‍🦱", "👩🏻‍🦲", "👩🏻‍🦳", "👩🏻‍🦼", "👩🏻‍🦽", "👩🏻‍⚕️", "👩🏻‍⚖️", "👩🏻‍✈️", "👩🏻", "👩🏼‍🌾", "👩🏼‍🍳", "👩🏼‍🎓", "👩🏼‍🎤", "👩🏼‍🎨", "👩🏼‍🏫", "👩🏼‍🏭", "👩🏼‍💻", "👩🏼‍💼", "👩🏼‍🔧", "👩🏼‍🔬", "👩🏼‍🚀", "👩🏼‍🚒", "👩🏼‍🤝‍👨🏻", "👩🏼‍🤝‍👨🏽", "👩🏼‍🤝‍👨🏾", "👩🏼‍🤝‍👨🏿", "👩🏼‍🤝‍👩🏻", "👩🏼‍🦯", "👩🏼‍🦰", "👩🏼‍🦱", "👩🏼‍🦲", "👩🏼‍🦳", "👩🏼‍🦼", "👩🏼‍🦽", "👩🏼‍⚕️", "👩🏼‍⚖️", "👩🏼‍✈️", "👩🏼", "👩🏽‍🌾", "👩🏽‍🍳", "👩🏽‍🎓", "👩🏽‍🎤", "👩🏽‍🎨", "👩🏽‍🏫", "👩🏽‍🏭", "👩🏽‍💻", "👩🏽‍💼", "👩🏽‍🔧", "👩🏽‍🔬", "👩🏽‍🚀", "👩🏽‍🚒", "👩🏽‍🤝‍👨🏻", "👩🏽‍🤝‍👨🏼", "👩🏽‍🤝‍👨🏾", "👩🏽‍🤝‍👨🏿", "👩🏽‍🤝‍👩🏻", "👩🏽‍🤝‍👩🏼", "👩🏽‍🦯", "👩🏽‍🦰", "👩🏽‍🦱", "👩🏽‍🦲", "👩🏽‍🦳", "👩🏽‍🦼", "👩🏽‍🦽", "👩🏽‍⚕️", "👩🏽‍⚖️", "👩🏽‍✈️", "👩🏽", "👩🏾‍🌾", "👩🏾‍🍳", "👩🏾‍🎓", "👩🏾‍🎤", "👩🏾‍🎨", "👩🏾‍🏫", "👩🏾‍🏭", "👩🏾‍💻", "👩🏾‍💼", "👩🏾‍🔧", "👩🏾‍🔬", "👩🏾‍🚀", "👩🏾‍🚒", "👩🏾‍🤝‍👨🏻", "👩🏾‍🤝‍👨🏼", "👩🏾‍🤝‍👨🏽", "👩🏾‍🤝‍👨🏿", "👩🏾‍🤝‍👩🏻", "👩🏾‍🤝‍👩🏼", "👩🏾‍🤝‍👩🏽", "👩🏾‍🦯", "👩🏾‍🦰", "👩🏾‍🦱", "👩🏾‍🦲", "👩🏾‍🦳", "👩🏾‍🦼", "👩🏾‍🦽", "👩🏾‍⚕️", "👩🏾‍⚖️", "👩🏾‍✈️", "👩🏾", "👩🏿‍🌾", "👩🏿‍🍳", "👩🏿‍🎓", "👩🏿‍🎤", "👩🏿‍🎨", "👩🏿‍🏫", "👩🏿‍🏭", "👩🏿‍💻", "👩🏿‍💼", "👩🏿‍🔧", "👩🏿‍🔬", "👩🏿‍🚀", "👩🏿‍🚒", "👩🏿‍🤝‍👨🏻", "👩🏿‍🤝‍👨🏼", "👩🏿‍🤝‍👨🏽", "👩🏿‍🤝‍👨🏾", "👩🏿‍🤝‍👩🏻", "👩🏿‍🤝‍👩🏼", "👩🏿‍🤝‍👩🏽", "👩🏿‍🤝‍👩🏾", "👩🏿‍🦯", "👩🏿‍🦰", "👩🏿‍🦱", "👩🏿‍🦲", "👩🏿‍🦳", "👩🏿‍🦼", "👩🏿‍🦽", "👩🏿‍⚕️", "👩🏿‍⚖️", "👩🏿‍✈️", "👩🏿", "👩‍🌾", "👩‍🍳", "👩‍🎓", "👩‍🎤", "👩‍🎨", "👩‍🏫", "👩‍🏭", "👩‍👦‍👦", "👩‍👦", "👩‍👧‍👦", "👩‍👧‍👧", "👩‍👧", "👩‍👩‍👦‍👦", "👩‍👩‍👦", "👩‍👩‍👧‍👦", "👩‍👩‍👧‍👧", "👩‍👩‍👧", "👩‍💻", "👩‍💼", "👩‍🔧", "👩‍🔬", "👩‍🚀", "👩‍🚒", "👩‍🦯", "👩‍🦰", "👩‍🦱", "👩‍🦲", "👩‍🦳", "👩‍🦼", "👩‍🦽", "👩‍⚕️", "👩‍⚖️", "👩‍✈️", "👩‍❤️‍👨", "👩‍❤️‍👩", "👩‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", "👩", "👪", "👫🏻", "👫🏼", "👫🏽", "👫🏾", "👫🏿", "👫", "👬🏻", "👬🏼", "👬🏽", "👬🏾", "👬🏿", "👬", "👭🏻", "👭🏼", "👭🏽", "👭🏾", "👭🏿", "👭", "👮🏻‍♀️", "👮🏻‍♂️", "👮🏻", "👮🏼‍♀️", "👮🏼‍♂️", "👮🏼", "👮🏽‍♀️", "👮🏽‍♂️", "👮🏽", "👮🏾‍♀️", "👮🏾‍♂️", "👮🏾", "👮🏿‍♀️", "👮🏿‍♂️", "👮🏿", "👮‍♀️", "👮‍♂️", "👮", "👯‍♀️", "👯‍♂️", "👯", "👰🏻", "👰🏼", "👰🏽", "👰🏾", "👰🏿", "👰", "👱🏻‍♀️", "👱🏻‍♂️", "👱🏻", "👱🏼‍♀️", "👱🏼‍♂️", "👱🏼", "👱🏽‍♀️", "👱🏽‍♂️", "👱🏽", "👱🏾‍♀️", "👱🏾‍♂️", "👱🏾", "👱🏿‍♀️", "👱🏿‍♂️", "👱🏿", "👱‍♀️", "👱‍♂️", "👱", "👲🏻", "👲🏼", "👲🏽", "👲🏾", "👲🏿", "👲", "👳🏻‍♀️", "👳🏻‍♂️", "👳🏻", "👳🏼‍♀️", "👳🏼‍♂️", "👳🏼", "👳🏽‍♀️", "👳🏽‍♂️", "👳🏽", "👳🏾‍♀️", "👳🏾‍♂️", "👳🏾", "👳🏿‍♀️", "👳🏿‍♂️", "👳🏿", "👳‍♀️", "👳‍♂️", "👳", "👴🏻", "👴🏼", "👴🏽", "👴🏾", "👴🏿", "👴", "👵🏻", "👵🏼", "👵🏽", "👵🏾", "👵🏿", "👵", "👶🏻", "👶🏼", "👶🏽", "👶🏾", "👶🏿", "👶", "👷🏻‍♀️", "👷🏻‍♂️", "👷🏻", "👷🏼‍♀️", "👷🏼‍♂️", "👷🏼", "👷🏽‍♀️", "👷🏽‍♂️", "👷🏽", "👷🏾‍♀️", "👷🏾‍♂️", "👷🏾", "👷🏿‍♀️", "👷🏿‍♂️", "👷🏿", "👷‍♀️", "👷‍♂️", "👷", "👸🏻", "👸🏼", "👸🏽", "👸🏾", "👸🏿", "👸", "👹", "👺", "👻", "👼🏻", "👼🏼", "👼🏽", "👼🏾", "👼🏿", "👼", "👽", "👾", "👿", "💀", "💁🏻‍♀️", "💁🏻‍♂️", "💁🏻", "💁🏼‍♀️", "💁🏼‍♂️", "💁🏼", "💁🏽‍♀️", "💁🏽‍♂️", "💁🏽", "💁🏾‍♀️", "💁🏾‍♂️", "💁🏾", "💁🏿‍♀️", "💁🏿‍♂️", "💁🏿", "💁‍♀️", "💁‍♂️", "💁", "💂🏻‍♀️", "💂🏻‍♂️", "💂🏻", "💂🏼‍♀️", "💂🏼‍♂️", "💂🏼", "💂🏽‍♀️", "💂🏽‍♂️", "💂🏽", "💂🏾‍♀️", "💂🏾‍♂️", "💂🏾", "💂🏿‍♀️", "💂🏿‍♂️", "💂🏿", "💂‍♀️", "💂‍♂️", "💂", "💃🏻", "💃🏼", "💃🏽", "💃🏾", "💃🏿", "💃", "💄", "💅🏻", "💅🏼", "💅🏽", "💅🏾", "💅🏿", "💅", "💆🏻‍♀️", "💆🏻‍♂️", "💆🏻", "💆🏼‍♀️", "💆🏼‍♂️", "💆🏼", "💆🏽‍♀️", "💆🏽‍♂️", "💆🏽", "💆🏾‍♀️", "💆🏾‍♂️", "💆🏾", "💆🏿‍♀️", "💆🏿‍♂️", "💆🏿", "💆‍♀️", "💆‍♂️", "💆", "💇🏻‍♀️", "💇🏻‍♂️", "💇🏻", "💇🏼‍♀️", "💇🏼‍♂️", "💇🏼", "💇🏽‍♀️", "💇🏽‍♂️", "💇🏽", "💇🏾‍♀️", "💇🏾‍♂️", "💇🏾", "💇🏿‍♀️", "💇🏿‍♂️", "💇🏿", "💇‍♀️", "💇‍♂️", "💇", "💈", "💉", "💊", "💋", "💌", "💍", "💎", "💏", "💐", "💑", "💒", "💓", "💔", "💕", "💖", "💗", "💘", "💙", "💚", "💛", "💜", "💝", "💞", "💟", "💠", "💡", "💢", "💣", "💤", "💥", "💦", "💧", "💨", "💩", "💪🏻", "💪🏼", "💪🏽", "💪🏾", "💪🏿", "💪", "💫", "💬", "💭", "💮", "💯", "💰", "💱", "💲", "💳", "💴", "💵", "💶", "💷", "💸", "💹", "💺", "💻", "💼", "💽", "💾", "💿", "📀", "📁", "📂", "📃", "📄", "📅", "📆", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "📏", "📐", "📑", "📒", "📓", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📛", "📜", "📝", "📞", "📟", "📠", "📡", "📢", "📣", "📤", "📥", "📦", "📧", "📨", "📩", "📪", "📫", "📬", "📭", "📮", "📯", "📰", "📱", "📲", "📳", "📴", "📵", "📶", "📷", "📸", "📹", "📺", "📻", "📼", "📽️", "📿", "🔀", "🔁", "🔂", "🔃", "🔄", "🔅", "🔆", "🔇", "🔈", "🔉", "🔊", "🔋", "🔌", "🔍", "🔎", "🔏", "🔐", "🔑", "🔒", "🔓", "🔔", "🔕", "🔖", "🔗", "🔘", "🔙", "🔚", "🔛", "🔜", "🔝", "🔞", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🔥", "🔦", "🔧", "🔨", "🔩", "🔪", "🔫", "🔬", "🔭", "🔮", "🔯", "🔰", "🔱", "🔲", "🔳", "🔴", "🔵", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "🔼", "🔽", "🕉️", "🕊️", "🕋", "🕌", "🕍", "🕎", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚", "🕛", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦", "🕧", "🕯️", "🕰️", "🕳️", "🕴🏻‍♀️", "🕴🏻‍♂️", "🕴🏻", "🕴🏼‍♀️", "🕴🏼‍♂️", "🕴🏼", "🕴🏽‍♀️", "🕴🏽‍♂️", "🕴🏽", "🕴🏾‍♀️", "🕴🏾‍♂️", "🕴🏾", "🕴🏿‍♀️", "🕴🏿‍♂️", "🕴🏿", "🕴️‍♀️", "🕴️‍♂️", "🕴️", "🕵🏻‍♀️", "🕵🏻‍♂️", "🕵🏻", "🕵🏼‍♀️", "🕵🏼‍♂️", "🕵🏼", "🕵🏽‍♀️", "🕵🏽‍♂️", "🕵🏽", "🕵🏾‍♀️", "🕵🏾‍♂️", "🕵🏾", "🕵🏿‍♀️", "🕵🏿‍♂️", "🕵🏿", "🕵️‍♀️", "🕵️‍♂️", "🕵️", "🕶️", "🕷️", "🕸️", "🕹️", "🕺🏻", "🕺🏼", "🕺🏽", "🕺🏾", "🕺🏿", "🕺", "🖇️", "🖊️", "🖋️", "🖌️", "🖍️", "🖐🏻", "🖐🏼", "🖐🏽", "🖐🏾", "🖐🏿", "🖐️", "🖕🏻", "🖕🏼", "🖕🏽", "🖕🏾", "🖕🏿", "🖕", "🖖🏻", "🖖🏼", "🖖🏽", "🖖🏾", "🖖🏿", "🖖", "🖤", "🖥️", "🖨️", "🖱️", "🖲️", "🖼️", "🗂️", "🗃️", "🗄️", "🗑️", "🗒️", "🗓️", "🗜️", "🗝️", "🗞️", "🗡️", "🗣️", "🗨️", "🗯️", "🗳️", "🗺️", "🗻", "🗼", "🗽", "🗾", "🗿", "😀", "😁", "😂", "😃", "😄", "😅", "😆", "😇", "😈", "😉", "😊", "😋", "😌", "😍", "😎", "😏", "😐", "😑", "😒", "😓", "😔", "😕", "😖", "😗", "😘", "😙", "😚", "😛", "😜", "😝", "😞", "😟", "😠", "😡", "😢", "😣", "😤", "😥", "😦", "😧", "😨", "😩", "😪", "😫", "😬", "😭", "😮", "😯", "😰", "😱", "😲", "😳", "😴", "😵", "😶", "😷", "😸", "😹", "😺", "😻", "😼", "😽", "😾", "😿", "🙀", "🙁", "🙂", "🙃", "🙄", "🙅🏻‍♀️", "🙅🏻‍♂️", "🙅🏻", "🙅🏼‍♀️", "🙅🏼‍♂️", "🙅🏼", "🙅🏽‍♀️", "🙅🏽‍♂️", "🙅🏽", "🙅🏾‍♀️", "🙅🏾‍♂️", "🙅🏾", "🙅🏿‍♀️", "🙅🏿‍♂️", "🙅🏿", "🙅‍♀️", "🙅‍♂️", "🙅", "🙆🏻‍♀️", "🙆🏻‍♂️", "🙆🏻", "🙆🏼‍♀️", "🙆🏼‍♂️", "🙆🏼", "🙆🏽‍♀️", "🙆🏽‍♂️", "🙆🏽", "🙆🏾‍♀️", "🙆🏾‍♂️", "🙆🏾", "🙆🏿‍♀️", "🙆🏿‍♂️", "🙆🏿", "🙆‍♀️", "🙆‍♂️", "🙆", "🙇🏻‍♀️", "🙇🏻‍♂️", "🙇🏻", "🙇🏼‍♀️", "🙇🏼‍♂️", "🙇🏼", "🙇🏽‍♀️", "🙇🏽‍♂️", "🙇🏽", "🙇🏾‍♀️", "🙇🏾‍♂️", "🙇🏾", "🙇🏿‍♀️", "🙇🏿‍♂️", "🙇🏿", "🙇‍♀️", "🙇‍♂️", "🙇", "🙈", "🙉", "🙊", "🙋🏻‍♀️", "🙋🏻‍♂️", "🙋🏻", "🙋🏼‍♀️", "🙋🏼‍♂️", "🙋🏼", "🙋🏽‍♀️", "🙋🏽‍♂️", "🙋🏽", "🙋🏾‍♀️", "🙋🏾‍♂️", "🙋🏾", "🙋🏿‍♀️", "🙋🏿‍♂️", "🙋🏿", "🙋‍♀️", "🙋‍♂️", "🙋", "🙌🏻", "🙌🏼", "🙌🏽", "🙌🏾", "🙌🏿", "🙌", "🙍🏻‍♀️", "🙍🏻‍♂️", "🙍🏻", "🙍🏼‍♀️", "🙍🏼‍♂️", "🙍🏼", "🙍🏽‍♀️", "🙍🏽‍♂️", "🙍🏽", "🙍🏾‍♀️", "🙍🏾‍♂️", "🙍🏾", "🙍🏿‍♀️", "🙍🏿‍♂️", "🙍🏿", "🙍‍♀️", "🙍‍♂️", "🙍", "🙎🏻‍♀️", "🙎🏻‍♂️", "🙎🏻", "🙎🏼‍♀️", "🙎🏼‍♂️", "🙎🏼", "🙎🏽‍♀️", "🙎🏽‍♂️", "🙎🏽", "🙎🏾‍♀️", "🙎🏾‍♂️", "🙎🏾", "🙎🏿‍♀️", "🙎🏿‍♂️", "🙎🏿", "🙎‍♀️", "🙎‍♂️", "🙎", "🙏🏻", "🙏🏼", "🙏🏽", "🙏🏾", "🙏🏿", "🙏", "🚀", "🚁", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚋", "🚌", "🚍", "🚎", "🚏", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🚝", "🚞", "🚟", "🚠", "🚡", "🚢", "🚣🏻‍♀️", "🚣🏻‍♂️", "🚣🏻", "🚣🏼‍♀️", "🚣🏼‍♂️", "🚣🏼", "🚣🏽‍♀️", "🚣🏽‍♂️", "🚣🏽", "🚣🏾‍♀️", "🚣🏾‍♂️", "🚣🏾", "🚣🏿‍♀️", "🚣🏿‍♂️", "🚣🏿", "🚣‍♀️", "🚣‍♂️", "🚣", "🚤", "🚥", "🚦", "🚧", "🚨", "🚩", "🚪", "🚫", "🚬", "🚭", "🚮", "🚯", "🚰", "🚱", "🚲", "🚳", "🚴🏻‍♀️", "🚴🏻‍♂️", "🚴🏻", "🚴🏼‍♀️", "🚴🏼‍♂️", "🚴🏼", "🚴🏽‍♀️", "🚴🏽‍♂️", "🚴🏽", "🚴🏾‍♀️", "🚴🏾‍♂️", "🚴🏾", "🚴🏿‍♀️", "🚴🏿‍♂️", "🚴🏿", "🚴‍♀️", "🚴‍♂️", "🚴", "🚵🏻‍♀️", "🚵🏻‍♂️", "🚵🏻", "🚵🏼‍♀️", "🚵🏼‍♂️", "🚵🏼", "🚵🏽‍♀️", "🚵🏽‍♂️", "🚵🏽", "🚵🏾‍♀️", "🚵🏾‍♂️", "🚵🏾", "🚵🏿‍♀️", "🚵🏿‍♂️", "🚵🏿", "🚵‍♀️", "🚵‍♂️", "🚵", "🚶🏻‍♀️", "🚶🏻‍♂️", "🚶🏻", "🚶🏼‍♀️", "🚶🏼‍♂️", "🚶🏼", "🚶🏽‍♀️", "🚶🏽‍♂️", "🚶🏽", "🚶🏾‍♀️", "🚶🏾‍♂️", "🚶🏾", "🚶🏿‍♀️", "🚶🏿‍♂️", "🚶🏿", "🚶‍♀️", "🚶‍♂️", "🚶", "🚷", "🚸", "🚹", "🚺", "🚻", "🚼", "🚽", "🚾", "🚿", "🛀🏻", "🛀🏼", "🛀🏽", "🛀🏾", "🛀🏿", "🛀", "🛁", "🛂", "🛃", "🛄", "🛅", "🛋️", "🛌🏻", "🛌🏼", "🛌🏽", "🛌🏾", "🛌🏿", "🛌", "🛍️", "🛎️", "🛏️", "🛐", "🛑", "🛒", "🛕", "🛠️", "🛡️", "🛢️", "🛣️", "🛤️", "🛥️", "🛩️", "🛫", "🛬", "🛰️", "🛳️", "🛴", "🛵", "🛶", "🛷", "🛸", "🛹", "🛺", "🟠", "🟡", "🟢", "🟣", "🟤", "🟥", "🟦", "🟧", "🟨", "🟩", "🟪", "🟫", "🤍", "🤎", "🤏🏻", "🤏🏼", "🤏🏽", "🤏🏾", "🤏🏿", "🤏", "🤐", "🤑", "🤒", "🤓", "🤔", "🤕", "🤖", "🤗", "🤘🏻", "🤘🏼", "🤘🏽", "🤘🏾", "🤘🏿", "🤘", "🤙🏻", "🤙🏼", "🤙🏽", "🤙🏾", "🤙🏿", "🤙", "🤚🏻", "🤚🏼", "🤚🏽", "🤚🏾", "🤚🏿", "🤚", "🤛🏻", "🤛🏼", "🤛🏽", "🤛🏾", "🤛🏿", "🤛", "🤜🏻", "🤜🏼", "🤜🏽", "🤜🏾", "🤜🏿", "🤜", "🤝", "🤞🏻", "🤞🏼", "🤞🏽", "🤞🏾", "🤞🏿", "🤞", "🤟🏻", "🤟🏼", "🤟🏽", "🤟🏾", "🤟🏿", "🤟", "🤠", "🤡", "🤢", "🤣", "🤤", "🤥", "🤦🏻‍♀️", "🤦🏻‍♂️", "🤦🏻", "🤦🏼‍♀️", "🤦🏼‍♂️", "🤦🏼", "🤦🏽‍♀️", "🤦🏽‍♂️", "🤦🏽", "🤦🏾‍♀️", "🤦🏾‍♂️", "🤦🏾", "🤦🏿‍♀️", "🤦🏿‍♂️", "🤦🏿", "🤦‍♀️", "🤦‍♂️", "🤦", "🤧", "🤨", "🤩", "🤪", "🤫", "🤬", "🤭", "🤮", "🤯", "🤰🏻", "🤰🏼", "🤰🏽", "🤰🏾", "🤰🏿", "🤰", "🤱🏻", "🤱🏼", "🤱🏽", "🤱🏾", "🤱🏿", "🤱", "🤲🏻", "🤲🏼", "🤲🏽", "🤲🏾", "🤲🏿", "🤲", "🤳🏻", "🤳🏼", "🤳🏽", "🤳🏾", "🤳🏿", "🤳", "🤴🏻", "🤴🏼", "🤴🏽", "🤴🏾", "🤴🏿", "🤴", "🤵🏻‍♀️", "🤵🏻‍♂️", "🤵🏻", "🤵🏼‍♀️", "🤵🏼‍♂️", "🤵🏼", "🤵🏽‍♀️", "🤵🏽‍♂️", "🤵🏽", "🤵🏾‍♀️", "🤵🏾‍♂️", "🤵🏾", "🤵🏿‍♀️", "🤵🏿‍♂️", "🤵🏿", "🤵‍♀️", "🤵‍♂️", "🤵", "🤶🏻", "🤶🏼", "🤶🏽", "🤶🏾", "🤶🏿", "🤶", "🤷🏻‍♀️", "🤷🏻‍♂️", "🤷🏻", "🤷🏼‍♀️", "🤷🏼‍♂️", "🤷🏼", "🤷🏽‍♀️", "🤷🏽‍♂️", "🤷🏽", "🤷🏾‍♀️", "🤷🏾‍♂️", "🤷🏾", "🤷🏿‍♀️", "🤷🏿‍♂️", "🤷🏿", "🤷‍♀️", "🤷‍♂️", "🤷", "🤸🏻‍♀️", "🤸🏻‍♂️", "🤸🏻", "🤸🏼‍♀️", "🤸🏼‍♂️", "🤸🏼", "🤸🏽‍♀️", "🤸🏽‍♂️", "🤸🏽", "🤸🏾‍♀️", "🤸🏾‍♂️", "🤸🏾", "🤸🏿‍♀️", "🤸🏿‍♂️", "🤸🏿", "🤸‍♀️", "🤸‍♂️", "🤸", "🤹🏻‍♀️", "🤹🏻‍♂️", "🤹🏻", "🤹🏼‍♀️", "🤹🏼‍♂️", "🤹🏼", "🤹🏽‍♀️", "🤹🏽‍♂️", "🤹🏽", "🤹🏾‍♀️", "🤹🏾‍♂️", "🤹🏾", "🤹🏿‍♀️", "🤹🏿‍♂️", "🤹🏿", "🤹‍♀️", "🤹‍♂️", "🤹", "🤺", "🤼‍♀️", "🤼‍♂️", "🤼", "🤽🏻‍♀️", "🤽🏻‍♂️", "🤽🏻", "🤽🏼‍♀️", "🤽🏼‍♂️", "🤽🏼", "🤽🏽‍♀️", "🤽🏽‍♂️", "🤽🏽", "🤽🏾‍♀️", "🤽🏾‍♂️", "🤽🏾", "🤽🏿‍♀️", "🤽🏿‍♂️", "🤽🏿", "🤽‍♀️", "🤽‍♂️", "🤽", "🤾🏻‍♀️", "🤾🏻‍♂️", "🤾🏻", "🤾🏼‍♀️", "🤾🏼‍♂️", "🤾🏼", "🤾🏽‍♀️", "🤾🏽‍♂️", "🤾🏽", "🤾🏾‍♀️", "🤾🏾‍♂️", "🤾🏾", "🤾🏿‍♀️", "🤾🏿‍♂️", "🤾🏿", "🤾‍♀️", "🤾‍♂️", "🤾", "🤿", "🥀", "🥁", "🥂", "🥃", "🥄", "🥅", "🥇", "🥈", "🥉", "🥊", "🥋", "🥌", "🥍", "🥎", "🥏", "🥐", "🥑", "🥒", "🥓", "🥔", "🥕", "🥖", "🥗", "🥘", "🥙", "🥚", "🥛", "🥜", "🥝", "🥞", "🥟", "🥠", "🥡", "🥢", "🥣", "🥤", "🥥", "🥦", "🥧", "🥨", "🥩", "🥪", "🥫", "🥬", "🥭", "🥮", "🥯", "🥰", "🥱", "🥳", "🥴", "🥵", "🥶", "🥺", "🥻", "🥼", "🥽", "🥾", "🥿", "🦀", "🦁", "🦂", "🦃", "🦄", "🦅", "🦆", "🦇", "🦈", "🦉", "🦊", "🦋", "🦌", "🦍", "🦎", "🦏", "🦐", "🦑", "🦒", "🦓", "🦔", "🦕", "🦖", "🦗", "🦘", "🦙", "🦚", "🦛", "🦜", "🦝", "🦞", "🦟", "🦠", "🦡", "🦢", "🦥", "🦦", "🦧", "🦨", "🦩", "🦪", "🦮", "🦯", "🦰", "🦱", "🦲", "🦳", "🦴", "🦵🏻", "🦵🏼", "🦵🏽", "🦵🏾", "🦵🏿", "🦵", "🦶🏻", "🦶🏼", "🦶🏽", "🦶🏾", "🦶🏿", "🦶", "🦷", "🦸🏻‍♀️", "🦸🏻‍♂️", "🦸🏻", "🦸🏼‍♀️", "🦸🏼‍♂️", "🦸🏼", "🦸🏽‍♀️", "🦸🏽‍♂️", "🦸🏽", "🦸🏾‍♀️", "🦸🏾‍♂️", "🦸🏾", "🦸🏿‍♀️", "🦸🏿‍♂️", "🦸🏿", "🦸‍♀️", "🦸‍♂️", "🦸", "🦹🏻‍♀️", "🦹🏻‍♂️", "🦹🏻", "🦹🏼‍♀️", "🦹🏼‍♂️", "🦹🏼", "🦹🏽‍♀️", "🦹🏽‍♂️", "🦹🏽", "🦹🏾‍♀️", "🦹🏾‍♂️", "🦹🏾", "🦹🏿‍♀️", "🦹🏿‍♂️", "🦹🏿", "🦹‍♀️", "🦹‍♂️", "🦹", "🦺", "🦻🏻", "🦻🏼", "🦻🏽", "🦻🏾", "🦻🏿", "🦻", "🦼", "🦽", "🦾", "🦿", "🧀", "🧁", "🧂", "🧃", "🧄", "🧅", "🧆", "🧇", "🧈", "🧉", "🧊", "🧍🏻‍♀️", "🧍🏻‍♂️", "🧍🏻", "🧍🏼‍♀️", "🧍🏼‍♂️", "🧍🏼", "🧍🏽‍♀️", "🧍🏽‍♂️", "🧍🏽", "🧍🏾‍♀️", "🧍🏾‍♂️", "🧍🏾", "🧍🏿‍♀️", "🧍🏿‍♂️", "🧍🏿", "🧍‍♀️", "🧍‍♂️", "🧍", "🧎🏻‍♀️", "🧎🏻‍♂️", "🧎🏻", "🧎🏼‍♀️", "🧎🏼‍♂️", "🧎🏼", "🧎🏽‍♀️", "🧎🏽‍♂️", "🧎🏽", "🧎🏾‍♀️", "🧎🏾‍♂️", "🧎🏾", "🧎🏿‍♀️", "🧎🏿‍♂️", "🧎🏿", "🧎‍♀️", "🧎‍♂️", "🧎", "🧏🏻‍♀️", "🧏🏻‍♂️", "🧏🏻", "🧏🏼‍♀️", "🧏🏼‍♂️", "🧏🏼", "🧏🏽‍♀️", "🧏🏽‍♂️", "🧏🏽", "🧏🏾‍♀️", "🧏🏾‍♂️", "🧏🏾", "🧏🏿‍♀️", "🧏🏿‍♂️", "🧏🏿", "🧏‍♀️", "🧏‍♂️", "🧏", "🧐", "🧑🏻‍🤝‍🧑🏻", "🧑🏻", "🧑🏼‍🤝‍🧑🏻", "🧑🏼‍🤝‍🧑🏼", "🧑🏼", "🧑🏽‍🤝‍🧑🏻", "🧑🏽‍🤝‍🧑🏼", "🧑🏽‍🤝‍🧑🏽", "🧑🏽", "🧑🏾‍🤝‍🧑🏻", "🧑🏾‍🤝‍🧑🏼", "🧑🏾‍🤝‍🧑🏽", "🧑🏾‍🤝‍🧑🏾", "🧑🏾", "🧑🏿‍🤝‍🧑🏻", "🧑🏿‍🤝‍🧑🏼", "🧑🏿‍🤝‍🧑🏽", "🧑🏿‍🤝‍🧑🏾", "🧑🏿‍🤝‍🧑🏿", "🧑🏿", "🧑‍🤝‍🧑", "🧑", "🧒🏻", "🧒🏼", "🧒🏽", "🧒🏾", "🧒🏿", "🧒", "🧓🏻", "🧓🏼", "🧓🏽", "🧓🏾", "🧓🏿", "🧓", "🧔🏻", "🧔🏼", "🧔🏽", "🧔🏾", "🧔🏿", "🧔", "🧕🏻", "🧕🏼", "🧕🏽", "🧕🏾", "🧕🏿", "🧕", "🧖🏻‍♀️", "🧖🏻‍♂️", "🧖🏻", "🧖🏼‍♀️", "🧖🏼‍♂️", "🧖🏼", "🧖🏽‍♀️", "🧖🏽‍♂️", "🧖🏽", "🧖🏾‍♀️", "🧖🏾‍♂️", "🧖🏾", "🧖🏿‍♀️", "🧖🏿‍♂️", "🧖🏿", "🧖‍♀️", "🧖‍♂️", "🧖", "🧗🏻‍♀️", "🧗🏻‍♂️", "🧗🏻", "🧗🏼‍♀️", "🧗🏼‍♂️", "🧗🏼", "🧗🏽‍♀️", "🧗🏽‍♂️", "🧗🏽", "🧗🏾‍♀️", "🧗🏾‍♂️", "🧗🏾", "🧗🏿‍♀️", "🧗🏿‍♂️", "🧗🏿", "🧗‍♀️", "🧗‍♂️", "🧗", "🧘🏻‍♀️", "🧘🏻‍♂️", "🧘🏻", "🧘🏼‍♀️", "🧘🏼‍♂️", "🧘🏼", "🧘🏽‍♀️", "🧘🏽‍♂️", "🧘🏽", "🧘🏾‍♀️", "🧘🏾‍♂️", "🧘🏾", "🧘🏿‍♀️", "🧘🏿‍♂️", "🧘🏿", "🧘‍♀️", "🧘‍♂️", "🧘", "🧙🏻‍♀️", "🧙🏻‍♂️", "🧙🏻", "🧙🏼‍♀️", "🧙🏼‍♂️", "🧙🏼", "🧙🏽‍♀️", "🧙🏽‍♂️", "🧙🏽", "🧙🏾‍♀️", "🧙🏾‍♂️", "🧙🏾", "🧙🏿‍♀️", "🧙🏿‍♂️", "🧙🏿", "🧙‍♀️", "🧙‍♂️", "🧙", "🧚🏻‍♀️", "🧚🏻‍♂️", "🧚🏻", "🧚🏼‍♀️", "🧚🏼‍♂️", "🧚🏼", "🧚🏽‍♀️", "🧚🏽‍♂️", "🧚🏽", "🧚🏾‍♀️", "🧚🏾‍♂️", "🧚🏾", "🧚🏿‍♀️", "🧚🏿‍♂️", "🧚🏿", "🧚‍♀️", "🧚‍♂️", "🧚", "🧛🏻‍♀️", "🧛🏻‍♂️", "🧛🏻", "🧛🏼‍♀️", "🧛🏼‍♂️", "🧛🏼", "🧛🏽‍♀️", "🧛🏽‍♂️", "🧛🏽", "🧛🏾‍♀️", "🧛🏾‍♂️", "🧛🏾", "🧛🏿‍♀️", "🧛🏿‍♂️", "🧛🏿", "🧛‍♀️", "🧛‍♂️", "🧛", "🧜🏻‍♀️", "🧜🏻‍♂️", "🧜🏻", "🧜🏼‍♀️", "🧜🏼‍♂️", "🧜🏼", "🧜🏽‍♀️", "🧜🏽‍♂️", "🧜🏽", "🧜🏾‍♀️", "🧜🏾‍♂️", "🧜🏾", "🧜🏿‍♀️", "🧜🏿‍♂️", "🧜🏿", "🧜‍♀️", "🧜‍♂️", "🧜", "🧝🏻‍♀️", "🧝🏻‍♂️", "🧝🏻", "🧝🏼‍♀️", "🧝🏼‍♂️", "🧝🏼", "🧝🏽‍♀️", "🧝🏽‍♂️", "🧝🏽", "🧝🏾‍♀️", "🧝🏾‍♂️", "🧝🏾", "🧝🏿‍♀️", "🧝🏿‍♂️", "🧝🏿", "🧝‍♀️", "🧝‍♂️", "🧝", "🧞‍♀️", "🧞‍♂️", "🧞", "🧟‍♀️", "🧟‍♂️", "🧟", "🧠", "🧡", "🧢", "🧣", "🧤", "🧥", "🧦", "🧧", "🧨", "🧩", "🧪", "🧫", "🧬", "🧭", "🧮", "🧯", "🧰", "🧱", "🧲", "🧳", "🧴", "🧵", "🧶", "🧷", "🧸", "🧹", "🧺", "🧻", "🧼", "🧽", "🧾", "🧿", "🩰", "🩱", "🩲", "🩳", "🩸", "🩹", "🩺", "🪀", "🪁", "🪂", "🪐", "🪑", "🪒", "🪓", "🪔", "🪕", "‼️", "⁉️", "™️", "ℹ️", "↔️", "↕️", "↖️", "↗️", "↘️", "↙️", "↩️", "↪️", "#⃣", "⌚️", "⌛️", "⌨️", "⏏️", "⏩", "⏪", "⏫", "⏬", "⏭️", "⏮️", "⏯️", "⏰", "⏱️", "⏲️", "⏳", "⏸️", "⏹️", "⏺️", "Ⓜ️", "▪️", "▫️", "▶️", "◀️", "◻️", "◼️", "◽️", "◾️", "☀️", "☁️", "☂️", "☃️", "☄️", "☎️", "☑️", "☔️", "☕️", "☘️", "☝🏻", "☝🏼", "☝🏽", "☝🏾", "☝🏿", "☝️", "☠️", "☢️", "☣️", "☦️", "☪️", "☮️", "☯️", "☸️", "☹️", "☺️", "♀️", "♂️", "♈️", "♉️", "♊️", "♋️", "♌️", "♍️", "♎️", "♏️", "♐️", "♑️", "♒️", "♓️", "♟️", "♠️", "♣️", "♥️", "♦️", "♨️", "♻️", "♾", "♿️", "⚒️", "⚓️", "⚔️", "⚕️", "⚖️", "⚗️", "⚙️", "⚛️", "⚜️", "⚠️", "⚡️", "⚪️", "⚫️", "⚰️", "⚱️", "⚽️", "⚾️", "⛄️", "⛅️", "⛈️", "⛎", "⛏️", "⛑️", "⛓️", "⛔️", "⛩️", "⛪️", "⛰️", "⛱️", "⛲️", "⛳️", "⛴️", "⛵️", "⛷🏻", "⛷🏼", "⛷🏽", "⛷🏾", "⛷🏿", "⛷️", "⛸️", "⛹🏻‍♀️", "⛹🏻‍♂️", "⛹🏻", "⛹🏼‍♀️", "⛹🏼‍♂️", "⛹🏼", "⛹🏽‍♀️", "⛹🏽‍♂️", "⛹🏽", "⛹🏾‍♀️", "⛹🏾‍♂️", "⛹🏾", "⛹🏿‍♀️", "⛹🏿‍♂️", "⛹🏿", "⛹️‍♀️", "⛹️‍♂️", "⛹️", "⛺️", "⛽️", "✂️", "✅", "✈️", "✉️", "✊🏻", "✊🏼", "✊🏽", "✊🏾", "✊🏿", "✊", "✋🏻", "✋🏼", "✋🏽", "✋🏾", "✋🏿", "✋", "✌🏻", "✌🏼", "✌🏽", "✌🏾", "✌🏿", "✌️", "✍🏻", "✍🏼", "✍🏽", "✍🏾", "✍🏿", "✍️", "✏️", "✒️", "✔️", "✖️", "✝️", "✡️", "✨", "✳️", "✴️", "❄️", "❇️", "❌", "❎", "❓", "❔", "❕", "❗️", "❣️", "❤️", "➕", "➖", "➗", "➡️", "➰", "➿", "⤴️", "⤵️", "*⃣", "⬅️", "⬆️", "⬇️", "⬛️", "⬜️", "⭐️", "⭕️", "0⃣", "〰️", "〽️", "1⃣", "2⃣", "㊗️", "㊙️", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "©️", "®️", "" ];
} ]);
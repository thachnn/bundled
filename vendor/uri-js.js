/** @license URI.js v4.4.1 (c) 2011 Gary Court. License: http://github.com/garycourt/uri-js */
"use strict";

function merge() {
  var sets = Array.prototype.slice.call(arguments);

  if (sets.length > 1) {
    sets[0] = sets[0].slice(0, -1);
    var xl = sets.length - 1;
    for (var x = 1; x < xl; ++x) sets[x] = sets[x].slice(1, -1);

    sets[xl] = sets[xl].slice(1);
    return sets.join('');
  }
  return sets[0];
}
function subexp(str) {
  return "(?:" + str + ")";
}
function typeOf(o) {
  return o === void 0 ? "undefined" : o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase();
}
function toUpperCase(str) {
  return str.toUpperCase();
}
function toArray(obj) {
  return obj !== void 0 && obj !== null ? (obj instanceof Array ? obj : typeof obj.length != "number" || obj.split || obj.setInterval || obj.call ? [obj] : Array.prototype.slice.call(obj)) : [];
}
function assign(target, source) {
  var obj = target;
  if (source) for (var key in source) obj[key] = source[key];

  return obj;
}

function buildExps(isIRI) {
  var ALPHA$$ = "[A-Za-z]",
    DIGIT$$ = "[0-9]",
    HEXDIG$$ = merge(DIGIT$$, "[A-Fa-f]"),
    PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)),
  GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]",
    SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
    RESERVED$$ = merge(GEN_DELIMS$$, SUB_DELIMS$$),
    UCSCHAR$$ = isIRI ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]",
  IPRIVATE$$ = isIRI ? "[\\uE000-\\uF8FF]" : "[]",
  UNRESERVED$$ = merge(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]", UCSCHAR$$),
    DEC_OCTET_RELAXED$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("0?[1-9]" + DIGIT$$) + "|0?0?" + DIGIT$$),
  IPV4ADDRESS$ = subexp(DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$ + "\\." + DEC_OCTET_RELAXED$),
    H16$ = subexp(HEXDIG$$ + "{1,4}"),
    LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$),
    IPV6ADDRESS1$ = subexp(subexp(H16$ + "\\:") + "{6}" + LS32$),
  IPV6ADDRESS2$ = subexp("\\:\\:" + subexp(H16$ + "\\:") + "{5}" + LS32$),
  IPV6ADDRESS3$ = subexp(subexp(H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{4}" + LS32$),
  IPV6ADDRESS4$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,1}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{3}" + LS32$),
  IPV6ADDRESS5$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,2}" + H16$) + "?\\:\\:" + subexp(H16$ + "\\:") + "{2}" + LS32$),
  IPV6ADDRESS6$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,3}" + H16$) + "?\\:\\:" + H16$ + "\\:" + LS32$),
  IPV6ADDRESS7$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,4}" + H16$) + "?\\:\\:" + LS32$),
  IPV6ADDRESS8$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,5}" + H16$) + "?\\:\\:" + H16$),
  IPV6ADDRESS9$ = subexp(subexp(subexp(H16$ + "\\:") + "{0,6}" + H16$) + "?\\:\\:"),
  IPV6ADDRESS$ = subexp([IPV6ADDRESS1$, IPV6ADDRESS2$, IPV6ADDRESS3$, IPV6ADDRESS4$, IPV6ADDRESS5$, IPV6ADDRESS6$, IPV6ADDRESS7$, IPV6ADDRESS8$, IPV6ADDRESS9$].join("|")),
    ZONEID$ = subexp(subexp(UNRESERVED$$ + "|" + PCT_ENCODED$) + "+");
  return {
    NOT_SCHEME: new RegExp(merge("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
    NOT_USERINFO: new RegExp(merge("[^\\%\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
    NOT_HOST: new RegExp(merge("[^\\%\\[\\]\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
    NOT_PATH: new RegExp(merge("[^\\%\\/\\:\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
    NOT_PATH_NOSCHEME: new RegExp(merge("[^\\%\\/\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
    NOT_QUERY: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]", IPRIVATE$$), "g"),
    NOT_FRAGMENT: new RegExp(merge("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
    ESCAPE: new RegExp(merge("[^]", UNRESERVED$$, SUB_DELIMS$$), "g"),
    UNRESERVED: new RegExp(UNRESERVED$$, "g"),
    OTHER_CHARS: new RegExp(merge("[^\\%]", UNRESERVED$$, RESERVED$$), "g"),
    PCT_ENCODED: new RegExp(PCT_ENCODED$, "g"),
    IPV4ADDRESS: new RegExp("^(" + IPV4ADDRESS$ + ")$"),
    IPV6ADDRESS: new RegExp("^\\[?(" + IPV6ADDRESS$ + ")" + subexp(subexp("\\%25|\\%(?!" + HEXDIG$$ + "{2})") + "(" + ZONEID$ + ")") + "?\\]?$")
  };
}
var URI_PROTOCOL = buildExps(false),
  IRI_PROTOCOL = buildExps(true),

  maxInt = 2147483647,
  base = 36,
  tMin = 1,
  tMax = 26,
  skew = 38,
  damp = 700,
  initialBias = 72,
  initialN = 128,
  delimiter = '-',

  regexPunycode = /^xn--/,
  regexNonASCII = /[^\0-\x7E]/,
  regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;

var errors = {
  overflow: 'Overflow: input needs wider integers to process',
  'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  'invalid-input': 'Invalid input'
};

var baseMinusTMin = base - tMin,
  floor = Math.floor,
  stringFromCharCode = String.fromCharCode;

function error$1(type) {
  throw new RangeError(errors[type]);
}

function map(array, fn) {
  var result = [];
  for (var length = array.length; length--; ) result[length] = fn(array[length]);

  return result;
}

function mapDomain(string, fn) {
  var parts = string.split('@'),
    result = '';
  if (parts.length > 1) {
    result = parts[0] + '@';
    string = parts[1];
  }
  string = string.replace(regexSeparators, '.');
  return result + map(string.split('.'), fn).join('.');
}

function ucs2decode(string) {
  var output = [];
  for (var counter = 0, length = string.length; counter < length; ) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      else {
        output.push(value);
        counter--;
      }
    } else output.push(value);
  }
  return output;
}

function basicToDigit(codePoint) {
  return codePoint - 0x30 < 0x0A
    ? codePoint - 0x16
    : codePoint - 0x41 < 0x1A
    ? codePoint - 0x41
    : codePoint - 0x61 < 0x1A
    ? codePoint - 0x61
    : base;
}

function digitToBasic(digit, flag) {
  return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
}

function adapt(delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor(delta / damp) : delta >> 1;
  delta += floor(delta / numPoints);
  for (; delta > (baseMinusTMin * tMax) >> 1; k += base) delta = floor(delta / baseMinusTMin);

  return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
}

function decode(input) {
  var output = [],
    inputLength = input.length,
    i = 0,
    n = initialN,
    bias = initialBias,

    basic = input.lastIndexOf(delimiter);
  if (basic < 0) basic = 0;

  for (var j = 0; j < basic; ++j) {
    if (input.charCodeAt(j) >= 0x80) error$1('not-basic');

    output.push(input.charCodeAt(j));
  }

  for (var index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    var oldi = i;
    for (var w = 1, k = base; ; k += base) {
      if (index >= inputLength) error$1('invalid-input');

      var digit = basicToDigit(input.charCodeAt(index++));

      if (digit >= base || digit > floor((maxInt - i) / w)) error$1('overflow');

      i += digit * w;
      var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;

      if (digit < t) break;

      var baseMinusT = base - t;
      if (w > floor(maxInt / baseMinusT)) error$1('overflow');

      w *= baseMinusT;
    }

    var out = output.length + 1;
    bias = adapt(i - oldi, out, oldi == 0);

    if (floor(i / out) > maxInt - n) error$1('overflow');

    n += floor(i / out);
    i %= out;

    output.splice(i++, 0, n);
  }

  return String.fromCodePoint.apply(String, output);
}

function encode(input) {
  var output = [],

    inputLength = (input = ucs2decode(input)).length,

    n = initialN,
    delta = 0,
    bias = initialBias;

  for (var _currentValue2 of input) _currentValue2 < 0x80 && output.push(stringFromCharCode(_currentValue2));

  var basicLength = output.length,
    handledCPCount = basicLength;

  basicLength && output.push(delimiter);

  while (handledCPCount < inputLength) {
    var m = maxInt;
    for (var currentValue of input) if (currentValue >= n && currentValue < m) m = currentValue;

    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error$1('overflow');

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (var _currentValue of input) {
      if (_currentValue < n && ++delta > maxInt) error$1('overflow');

      if (_currentValue != n) continue;
      var q = delta;
      for (var k = base; ; k += base) {
        var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (q < t) break;

        var qMinusT = q - t,
          baseMinusT = base - t;
        output.push(stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0)));
        q = floor(qMinusT / baseMinusT);
      }

      output.push(stringFromCharCode(digitToBasic(q, 0)));
      bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
      delta = 0;
      ++handledCPCount;
    }

    ++delta;
    ++n;
  }
  return output.join('');
}

function toUnicode(input) {
  return mapDomain(input, function (string) {
    return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  });
}

function toASCII(input) {
  return mapDomain(input, function (string) {
    return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
  });
}

var SCHEMES = {};
function pctEncChar(chr) {
  var c = chr.charCodeAt(0);
  return c < 16
    ? "%0" + c.toString(16).toUpperCase()
    : c < 128
    ? "%" + c.toString(16).toUpperCase()
    : c < 2048
    ? "%" + ((c >> 6) | 192).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase()
    : "%" + ((c >> 12) | 224).toString(16).toUpperCase() + "%" + (((c >> 6) & 63) | 128).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
}
function pctDecChars(str) {
  var newStr = "";
  for (var i = 0, il = str.length; i < il; ) {
    var c = parseInt(str.substr(i + 1, 2), 16);
    if (c < 128) {
      newStr += String.fromCharCode(c);
      i += 3;
    } else if (c >= 194 && c < 224) {
      if (il - i >= 6) {
        var c2 = parseInt(str.substr(i + 4, 2), 16);
        newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
      } else newStr += str.substr(i, 6);

      i += 6;
    } else if (c >= 224) {
      if (il - i >= 9) {
        var _c = parseInt(str.substr(i + 4, 2), 16),
          c3 = parseInt(str.substr(i + 7, 2), 16);
        newStr += String.fromCharCode(((c & 15) << 12) | ((_c & 63) << 6) | (c3 & 63));
      } else newStr += str.substr(i, 9);

      i += 9;
    } else {
      newStr += str.substr(i, 3);
      i += 3;
    }
  }
  return newStr;
}
function _normalizeComponentEncoding(components, protocol) {
  function decodeUnreserved(str) {
    var decStr = pctDecChars(str);
    return !decStr.match(protocol.UNRESERVED) ? str : decStr;
  }
  if (components.scheme) components.scheme = String(components.scheme).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_SCHEME, "");
  if (components.userinfo !== void 0) components.userinfo = String(components.userinfo).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_USERINFO, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
  if (components.host !== void 0) components.host = String(components.host).replace(protocol.PCT_ENCODED, decodeUnreserved).toLowerCase().replace(protocol.NOT_HOST, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
  if (components.path !== void 0) components.path = String(components.path).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(components.scheme ? protocol.NOT_PATH : protocol.NOT_PATH_NOSCHEME, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
  if (components.query !== void 0) components.query = String(components.query).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_QUERY, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
  if (components.fragment !== void 0) components.fragment = String(components.fragment).replace(protocol.PCT_ENCODED, decodeUnreserved).replace(protocol.NOT_FRAGMENT, pctEncChar).replace(protocol.PCT_ENCODED, toUpperCase);
  return components;
}

function _stripLeadingZeros(str) {
  return str.replace(/^0*(.*)/, "$1") || "0";
}
function _normalizeIPv4(host, protocol) {
  var address = (host.match(protocol.IPV4ADDRESS) || [])[1];

  return address ? address.split(".").map(_stripLeadingZeros).join(".") : host;
}
function _normalizeIPv6(host, protocol) {
  var _matches2 = host.match(protocol.IPV6ADDRESS) || [],

    address = _matches2[1],
    zone = _matches2[2];

  if (!address) return host;

  var _address$toLowerCase$2 = address.toLowerCase().split('::').reverse(),
    last = _address$toLowerCase$2[0],
    first = _address$toLowerCase$2[1],

    firstFields = first ? first.split(":").map(_stripLeadingZeros) : [],
    lastFields = last.split(":").map(_stripLeadingZeros),
    isLastFieldIPv4Address = protocol.IPV4ADDRESS.test(lastFields[lastFields.length - 1]),
    fieldCount = isLastFieldIPv4Address ? 7 : 8,
    lastFieldsStart = lastFields.length - fieldCount,
    fields = Array(fieldCount);
  for (var x = 0; x < fieldCount; ++x) fields[x] = firstFields[x] || lastFields[lastFieldsStart + x] || '';

  if (isLastFieldIPv4Address) fields[fieldCount - 1] = _normalizeIPv4(fields[fieldCount - 1], protocol);

  var allZeroFields = fields.reduce(function (acc, field, index) {
    if (!field || field === "0") {
      var lastLongest = acc[acc.length - 1];
      lastLongest && lastLongest.index + lastLongest.length === index ? lastLongest.length++ : acc.push({ index: index, length: 1 });
    }
    return acc;
  }, []);
  var longestZeroFields = allZeroFields.sort((a, b) => b.length - a.length)[0],
    newHost = void 0;
  if (longestZeroFields && longestZeroFields.length > 1) {
    var newFirst = fields.slice(0, longestZeroFields.index),
      newLast = fields.slice(longestZeroFields.index + longestZeroFields.length);
    newHost = newFirst.join(":") + "::" + newLast.join(":");
  } else newHost = fields.join(":");

  if (zone) newHost += "%" + zone;

  return newHost;
}
var URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,
  NO_MATCH_IS_UNDEFINED = "".match(/(){0}/)[1] === void 0;
function parse(uriString) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},

    components = {},
    protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL;
  if (options.reference === "suffix") uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
  var matches = uriString.match(URI_PARSE);
  if (!matches) {
    components.error = components.error || "URI can not be parsed.";
    return components;
  }
  if (NO_MATCH_IS_UNDEFINED) {
    components.scheme = matches[1];
    components.userinfo = matches[3];
    components.host = matches[4];
    components.port = parseInt(matches[5], 10);
    components.path = matches[6] || "";
    components.query = matches[7];
    components.fragment = matches[8];
    if (isNaN(components.port)) components.port = matches[5];
  } else {
    components.scheme = matches[1] || void 0;
    components.userinfo = uriString.indexOf("@") !== -1 ? matches[3] : void 0;
    components.host = uriString.indexOf("//") !== -1 ? matches[4] : void 0;
    components.port = parseInt(matches[5], 10);
    components.path = matches[6] || "";
    components.query = uriString.indexOf("?") !== -1 ? matches[7] : void 0;
    components.fragment = uriString.indexOf("#") !== -1 ? matches[8] : void 0;
    if (isNaN(components.port)) components.port = uriString.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? matches[4] : void 0;
  }
  if (components.host) components.host = _normalizeIPv6(_normalizeIPv4(components.host, protocol), protocol);

  components.reference =
    components.scheme === void 0 && components.userinfo === void 0 && components.host === void 0 && components.port === void 0 && !components.path && components.query === void 0
    ? "same-document"
    : components.scheme === void 0
    ? "relative"
    : components.fragment === void 0
    ? "absolute"
    : "uri";

  if (options.reference && options.reference !== "suffix" && options.reference !== components.reference)
    components.error = components.error || "URI is not a " + options.reference + " reference.";

  var schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
  if (!options.unicodeSupport && !(schemeHandler && schemeHandler.unicodeSupport)) {
    if (components.host && (options.domainHost || (schemeHandler && schemeHandler.domainHost)))
      try {
        components.host = toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase());
      } catch (e) {
        components.error = components.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
      }

    _normalizeComponentEncoding(components, URI_PROTOCOL);
  } else _normalizeComponentEncoding(components, protocol);

  schemeHandler && schemeHandler.parse && schemeHandler.parse(components, options);

  return components;
}

function _recomposeAuthority(components, options) {
  var protocol = options.iri !== false ? IRI_PROTOCOL : URI_PROTOCOL,
    uriTokens = [];
  components.userinfo === void 0 || uriTokens.push(components.userinfo, "@");

  components.host === void 0 ||
    uriTokens.push(_normalizeIPv6(_normalizeIPv4(String(components.host), protocol), protocol).replace(protocol.IPV6ADDRESS, function (_, $1, $2) {
      return "[" + $1 + ($2 ? "%25" + $2 : "") + "]";
    }));

  if (typeof components.port == "number" || typeof components.port == "string") uriTokens.push(":", String(components.port));

  return uriTokens.length ? uriTokens.join("") : void 0;
}

var RDS1 = /^\.\.?\//,
  RDS2 = /^\/\.(\/|$)/,
  RDS3 = /^\/\.\.(\/|$)/,
  RDS5 = /^\/?(?:.|\n)*?(?=\/|$)/;
function removeDotSegments(input) {
  var output = [];
  while (input.length)
    if (input.match(RDS1)) input = input.replace(RDS1, "");
    else if (input.match(RDS2)) input = input.replace(RDS2, "/");
    else if (input.match(RDS3)) {
      input = input.replace(RDS3, "/");
      output.pop();
    } else if (input === "." || input === "..") input = "";
    else {
      var im = input.match(RDS5);
      if (!im) throw new Error("Unexpected dot segment condition");

      var s = im[0];
      input = input.slice(s.length);
      output.push(s);
    }

  return output.join("");
}

function serialize(components) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},

    protocol = options.iri ? IRI_PROTOCOL : URI_PROTOCOL,
    uriTokens = [],
    schemeHandler = SCHEMES[(options.scheme || components.scheme || "").toLowerCase()];
  schemeHandler && schemeHandler.serialize && schemeHandler.serialize(components, options);
  if (components.host && !protocol.IPV6ADDRESS.test(components.host) && (options.domainHost || (schemeHandler && schemeHandler.domainHost)))
    try {
      components.host = !options.iri ? toASCII(components.host.replace(protocol.PCT_ENCODED, pctDecChars).toLowerCase()) : toUnicode(components.host);
    } catch (e) {
      components.error = components.error || "Host's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
    }

  _normalizeComponentEncoding(components, protocol);
  options.reference !== "suffix" && components.scheme && uriTokens.push(components.scheme, ":");

  var authority = _recomposeAuthority(components, options);
  if (authority !== void 0) {
    options.reference === "suffix" || uriTokens.push("//");

    uriTokens.push(authority);
    components.path && components.path.charAt(0) !== "/" && uriTokens.push("/");
  }
  if (components.path !== void 0) {
    var s = components.path;
    options.absolutePath || (schemeHandler && schemeHandler.absolutePath) || (s = removeDotSegments(s));

    if (authority === void 0) s = s.replace(/^\/\//, "/%2F");

    uriTokens.push(s);
  }
  components.query === void 0 || uriTokens.push("?", components.query);
  components.fragment === void 0 || uriTokens.push("#", components.fragment);

  return uriTokens.join("");
}

function resolveComponents(base, relative) {
  var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {},

    target = {};
  if (!arguments[3]) {
    base = parse(serialize(base, options), options);
    relative = parse(serialize(relative, options), options);
  }
  if (!(options = options || {}).tolerant && relative.scheme) {
    target.scheme = relative.scheme;
    target.userinfo = relative.userinfo;
    target.host = relative.host;
    target.port = relative.port;
    target.path = removeDotSegments(relative.path || "");
    target.query = relative.query;
  } else if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
    target.userinfo = relative.userinfo;
    target.host = relative.host;
    target.port = relative.port;
    target.path = removeDotSegments(relative.path || "");
    target.query = relative.query;
    target.scheme = base.scheme;
  } else {
    if (!relative.path) {
      target.path = base.path;
      target.query = relative.query !== void 0 ? relative.query : base.query;
    } else {
      if (relative.path.charAt(0) === "/") target.path = removeDotSegments(relative.path);
      else {
        target.path = (base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path
          ? "/" + relative.path
          : !base.path
          ? relative.path
          : base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;

        target.path = removeDotSegments(target.path);
      }
      target.query = relative.query;
    }
    target.userinfo = base.userinfo;
    target.host = base.host;
    target.port = base.port;
    target.scheme = base.scheme;
  }
  target.fragment = relative.fragment;
  return target;
}

function resolve(baseURI, relativeURI, options) {
  var schemelessOptions = assign({ scheme: 'null' }, options);
  return serialize(resolveComponents(parse(baseURI, schemelessOptions), parse(relativeURI, schemelessOptions), schemelessOptions, true), schemelessOptions);
}

function normalize(uri, options) {
  typeof uri == "string" ? (uri = serialize(parse(uri, options), options))
    : typeOf(uri) !== "object" || (uri = parse(serialize(uri, options), options));

  return uri;
}

function equal(uriA, uriB, options) {
  typeof uriA == "string"
    ? (uriA = serialize(parse(uriA, options), options))
    : typeOf(uriA) !== "object" || (uriA = serialize(uriA, options));

  typeof uriB == "string"
    ? (uriB = serialize(parse(uriB, options), options))
    : typeOf(uriB) !== "object" || (uriB = serialize(uriB, options));

  return uriA === uriB;
}

function escapeComponent(str, options) {
  return str && str.toString().replace(options && options.iri ? IRI_PROTOCOL.ESCAPE : URI_PROTOCOL.ESCAPE, pctEncChar);
}

function unescapeComponent(str, options) {
  return str && str.toString().replace(options && options.iri ? IRI_PROTOCOL.PCT_ENCODED : URI_PROTOCOL.PCT_ENCODED, pctDecChars);
}

var handler = {
  scheme: "http",
  domainHost: true,
  parse: function (components, options) {
    components.host || (components.error = components.error || "HTTP URIs must have a host.");

    return components;
  },
  serialize: function (components, options) {
    var secure = String(components.scheme).toLowerCase() === "https";
    if (components.port === (secure ? 443 : 80) || components.port === "") components.port = void 0;

    components.path || (components.path = "/");

    return components;
  }
};

var handler$1 = {
  scheme: "https",
  domainHost: handler.domainHost,
  parse: handler.parse,
  serialize: handler.serialize
};

function isSecure(wsComponents) {
  return typeof wsComponents.secure == 'boolean' ? wsComponents.secure : String(wsComponents.scheme).toLowerCase() === "wss";
}
var handler$2 = {
  scheme: "ws",
  domainHost: true,
  parse: function (components, options) {
    var wsComponents = components;
    wsComponents.secure = isSecure(wsComponents);
    wsComponents.resourceName = (wsComponents.path || '/') + (wsComponents.query ? '?' + wsComponents.query : '');
    wsComponents.path = void 0;
    wsComponents.query = void 0;
    return wsComponents;
  },
  serialize: function (wsComponents, options) {
    if (wsComponents.port === (isSecure(wsComponents) ? 443 : 80) || wsComponents.port === "") wsComponents.port = void 0;

    if (typeof wsComponents.secure == 'boolean') {
      wsComponents.scheme = wsComponents.secure ? 'wss' : 'ws';
      wsComponents.secure = void 0;
    }
    if (wsComponents.resourceName) {
      var _wsComponents$resourc2 = wsComponents.resourceName.split('?'),
        path = _wsComponents$resourc2[0],
        query = _wsComponents$resourc2[1];

      wsComponents.path = path && path !== '/' ? path : void 0;
      wsComponents.query = query;
      wsComponents.resourceName = void 0;
    }
    wsComponents.fragment = void 0;
    return wsComponents;
  }
};

var handler$3 = {
  scheme: "wss",
  domainHost: handler$2.domainHost,
  parse: handler$2.parse,
  serialize: handler$2.serialize
};

var O = {},
  isIRI = true,
  UNRESERVED$$ = "[A-Za-z0-9\\-\\.\\_\\~" + (isIRI ? "\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF" : "") + "]",
  HEXDIG$$ = "[0-9A-Fa-f]",
  PCT_ENCODED$ = subexp(subexp("%[EFef]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%[89A-Fa-f]" + HEXDIG$$ + "%" + HEXDIG$$ + HEXDIG$$) + "|" + subexp("%" + HEXDIG$$ + HEXDIG$$)),
  ATEXT$$ = "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]",
  QTEXT$$ = "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]",
  VCHAR$$ = merge(QTEXT$$, '[\\"\\\\]'),
  SOME_DELIMS$$ = "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]",
  UNRESERVED = new RegExp(UNRESERVED$$, "g"),
  PCT_ENCODED = new RegExp(PCT_ENCODED$, "g"),
  NOT_LOCAL_PART = new RegExp(merge("[^]", ATEXT$$, "[\\.]", '[\\"]', VCHAR$$), "g"),
  NOT_HFNAME = new RegExp(merge("[^]", UNRESERVED$$, SOME_DELIMS$$), "g"),
  NOT_HFVALUE = NOT_HFNAME;
function decodeUnreserved(str) {
  var decStr = pctDecChars(str);
  return !decStr.match(UNRESERVED) ? str : decStr;
}
var handler$4 = {
  scheme: "mailto",
  parse: function (components, options) {
    var mailtoComponents = components,
      to = (mailtoComponents.to = mailtoComponents.path ? mailtoComponents.path.split(",") : []);
    mailtoComponents.path = void 0;
    if (mailtoComponents.query) {
      var unknownHeaders = false,
        headers = {};
      for (var hfields = mailtoComponents.query.split("&"), x = 0, xl = hfields.length; x < xl; ++x) {
        var hfield = hfields[x].split("=");
        switch (hfield[0]) {
          case "to":
            for (var toAddrs = hfield[1].split(","), _x = 0, _xl = toAddrs.length; _x < _xl; ++_x) to.push(toAddrs[_x]);

            break;
          case "subject":
            mailtoComponents.subject = unescapeComponent(hfield[1], options);
            break;
          case "body":
            mailtoComponents.body = unescapeComponent(hfield[1], options);
            break;
          default:
            unknownHeaders = true;
            headers[unescapeComponent(hfield[0], options)] = unescapeComponent(hfield[1], options);
            break;
        }
      }
      if (unknownHeaders) mailtoComponents.headers = headers;
    }
    mailtoComponents.query = void 0;
    for (var _x2 = 0, _xl2 = to.length; _x2 < _xl2; ++_x2) {
      var addr = to[_x2].split("@");
      addr[0] = unescapeComponent(addr[0]);
      if (!options.unicodeSupport)
        try {
          addr[1] = toASCII(unescapeComponent(addr[1], options).toLowerCase());
        } catch (e) {
          mailtoComponents.error = mailtoComponents.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
        }
      else addr[1] = unescapeComponent(addr[1], options).toLowerCase();

      to[_x2] = addr.join("@");
    }
    return mailtoComponents;
  },
  serialize: function (mailtoComponents, options) {
    var components = mailtoComponents,
      to = toArray(mailtoComponents.to);
    if (to) {
      for (var x = 0, xl = to.length; x < xl; ++x) {
        var toAddr = String(to[x]),
          atIdx = toAddr.lastIndexOf("@"),
          localPart = toAddr.slice(0, atIdx).replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_LOCAL_PART, pctEncChar),
          domain = toAddr.slice(atIdx + 1);
        try {
          domain = !options.iri ? toASCII(unescapeComponent(domain, options).toLowerCase()) : toUnicode(domain);
        } catch (e) {
          components.error = components.error || "Email address's domain name can not be converted to " + (!options.iri ? "ASCII" : "Unicode") + " via punycode: " + e;
        }
        to[x] = localPart + "@" + domain;
      }
      components.path = to.join(",");
    }
    var headers = (mailtoComponents.headers = mailtoComponents.headers || {});
    if (mailtoComponents.subject) headers.subject = mailtoComponents.subject;
    if (mailtoComponents.body) headers.body = mailtoComponents.body;
    var fields = [];
    for (var name in headers) headers[name] === O[name] ||
      fields.push(name.replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFNAME, pctEncChar) + "=" + headers[name].replace(PCT_ENCODED, decodeUnreserved).replace(PCT_ENCODED, toUpperCase).replace(NOT_HFVALUE, pctEncChar));

    if (fields.length) components.query = fields.join("&");

    return components;
  }
};

var URN_PARSE = /^([^\:]+)\:(.*)/;
var handler$5 = {
  scheme: "urn",
  parse: function (components, options) {
    var matches = components.path && components.path.match(URN_PARSE),
      urnComponents = components;
    if (matches) {
      var scheme = options.scheme || urnComponents.scheme || "urn",
        nid = matches[1].toLowerCase(),
        nss = matches[2],
        urnScheme = scheme + ":" + (options.nid || nid),
        schemeHandler = SCHEMES[urnScheme];
      urnComponents.nid = nid;
      urnComponents.nss = nss;
      urnComponents.path = void 0;
      if (schemeHandler) urnComponents = schemeHandler.parse(urnComponents, options);
    } else urnComponents.error = urnComponents.error || "URN can not be parsed.";

    return urnComponents;
  },
  serialize: function (urnComponents, options) {
    var scheme = options.scheme || urnComponents.scheme || "urn",
      nid = urnComponents.nid,
      urnScheme = scheme + ":" + (options.nid || nid),
      schemeHandler = SCHEMES[urnScheme];
    if (schemeHandler) urnComponents = schemeHandler.serialize(urnComponents, options);

    var uriComponents = urnComponents,
      nss = urnComponents.nss;
    uriComponents.path = (nid || options.nid) + ":" + nss;
    return uriComponents;
  }
};

var UUID = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
var handler$6 = {
  scheme: "urn:uuid",
  parse: function (urnComponents, options) {
    var uuidComponents = urnComponents;
    uuidComponents.uuid = uuidComponents.nss;
    uuidComponents.nss = void 0;
    options.tolerant || (uuidComponents.uuid && uuidComponents.uuid.match(UUID)) ||
      (uuidComponents.error = uuidComponents.error || "UUID is not valid.");

    return uuidComponents;
  },
  serialize: function (uuidComponents, options) {
    var urnComponents = uuidComponents;
    urnComponents.nss = (uuidComponents.uuid || "").toLowerCase();
    return urnComponents;
  }
};

SCHEMES[handler.scheme] = handler;
SCHEMES[handler$1.scheme] = handler$1;
SCHEMES[handler$2.scheme] = handler$2;
SCHEMES[handler$3.scheme] = handler$3;
SCHEMES[handler$4.scheme] = handler$4;
SCHEMES[handler$5.scheme] = handler$5;
SCHEMES[handler$6.scheme] = handler$6;

exports.SCHEMES = SCHEMES;
exports.pctEncChar = pctEncChar;
exports.pctDecChars = pctDecChars;
exports.parse = parse;
exports.removeDotSegments = removeDotSegments;
exports.serialize = serialize;
exports.resolveComponents = resolveComponents;
exports.resolve = resolve;
exports.normalize = normalize;
exports.equal = equal;
exports.escapeComponent = escapeComponent;
exports.unescapeComponent = unescapeComponent;

Object.defineProperty(exports, "__esModule", { value: true });
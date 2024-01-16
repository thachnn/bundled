/*! https://mths.be/punycode v1.3.2 by @mathias */
!(function(root) {

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports,
  freeModule = typeof module == 'object' && module && !module.nodeType && module,
  freeGlobal = typeof global == 'object' && global;
if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)
  root = freeGlobal;

var punycode,
  key,

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
  regexNonASCII = /[^\x20-\x7E]/,
  regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,

  errors = {
    overflow: 'Overflow: input needs wider integers to process',
    'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
    'invalid-input': 'Invalid input'
  },

  baseMinusTMin = base - tMin,
  floor = Math.floor,
  stringFromCharCode = String.fromCharCode;

function error(type) {
  throw RangeError(errors[type]);
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
  return result + map(string.replace(regexSeparators, '.').split('.'), fn).join('.');
}

function ucs2decode(string) {
  var output = [];
  for (var value, extra, counter = 0, length = string.length; counter < length; )
    if ((value = string.charCodeAt(counter++)) >= 0xD800 && value <= 0xDBFF && counter < length)
      if (((extra = string.charCodeAt(counter++)) & 0xFC00) == 0xDC00)
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      else {
        output.push(value);
        counter--;
      }
    else output.push(value);

  return output;
}

function ucs2encode(array) {
  return map(array, function(value) {
    var output = '';
    if (value > 0xFFFF) {
      output += stringFromCharCode((((value -= 0x10000) >>> 10) & 0x3FF) | 0xD800);
      value = 0xDC00 | (value & 0x3FF);
    }
    return output + stringFromCharCode(value);
  }).join('');
}

function basicToDigit(codePoint) {
  return codePoint - 48 < 10
    ? codePoint - 22
    : codePoint - 65 < 26
    ? codePoint - 65
    : codePoint - 97 < 26
    ? codePoint - 97
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
  var out, j, index, oldi, w, k, digit, t, baseMinusT,
    output = [],
    inputLength = input.length,
    i = 0,
    n = initialN,
    bias = initialBias,
    basic = input.lastIndexOf(delimiter);

  if (basic < 0) basic = 0;

  for (j = 0; j < basic; ++j) {
    input.charCodeAt(j) < 0x80 || error('not-basic');

    output.push(input.charCodeAt(j));
  }

  for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
    for (oldi = i, w = 1, k = base; ; k += base) {
      index < inputLength || error('invalid-input');

      if ((digit = basicToDigit(input.charCodeAt(index++))) >= base || digit > floor((maxInt - i) / w))
        error('overflow');

      i += digit * w;

      if (digit < (t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias)) break;

      w > floor(maxInt / (baseMinusT = base - t)) && error('overflow');

      w *= baseMinusT;
    }

    bias = adapt(i - oldi, (out = output.length + 1), oldi == 0);

    floor(i / out) > maxInt - n && error('overflow');

    n += floor(i / out);
    i %= out;

    output.splice(i++, 0, n);
  }

  return ucs2encode(output);
}

function encode(input) {
  var handledCPCount, basicLength, j, m, q, k, t, currentValue, handledCPCountPlusOne, baseMinusT, qMinusT,
    output = [],
    inputLength = (input = ucs2decode(input)).length,
    n = initialN,
    delta = 0,
    bias = initialBias;

  for (j = 0; j < inputLength; ++j)
    (currentValue = input[j]) < 0x80 && output.push(stringFromCharCode(currentValue));

  handledCPCount = basicLength = output.length;

  basicLength && output.push(delimiter);

  while (handledCPCount < inputLength) {
    for (m = maxInt, j = 0; j < inputLength; ++j)
      if ((currentValue = input[j]) >= n && currentValue < m) m = currentValue;

    m - n > floor((maxInt - delta) / (handledCPCountPlusOne = handledCPCount + 1)) && error('overflow');

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (j = 0; j < inputLength; ++j) {
      (currentValue = input[j]) < n && ++delta > maxInt && error('overflow');

      if (currentValue != n) continue;
      for (q = delta, k = base; q >= (t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias); k += base) {
        qMinusT = q - t;
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
  return mapDomain(input, function(string) {
    return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
  });
}

function toASCII(input) {
  return mapDomain(input, function(string) {
    return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
  });
}

punycode = {
  version: '1.3.2',
  ucs2: { decode: ucs2decode, encode: ucs2encode },
  decode: decode,
  encode: encode,
  toASCII: toASCII,
  toUnicode: toUnicode
};

if (typeof define == 'function' && typeof define.amd == 'object' && define.amd)
  define('punycode', function() { return punycode; });
else if (freeExports && freeModule)
  if (module.exports == freeExports) freeModule.exports = punycode;
  else for (key in punycode) punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
else root.punycode = punycode;

})(this);

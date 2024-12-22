"use strict";

var _t = require('./types'),
  parser = require('./parser'),
  common = require('./common.js');

const { assertExpressionStatement } = _t;
function makeStatementFormatter(fn) {
  return {
    code: str => "/* @babel/template */;\n" + str,
    validate: () => {},
    unwrap: ast => fn(ast.program.body.slice(1))
  };
}
const smart$1 = makeStatementFormatter(body => (body.length > 1 ? body : body[0])),
  statements$1 = makeStatementFormatter(body => body);
const statement$1 = makeStatementFormatter(body => {
  if (body.length === 0) throw new Error("Found nothing to return.");

  if (body.length > 1) throw new Error("Found multiple statements but wanted one");

  return body[0];
});
const expression$1 = {
  code: str => `(\n${str}\n)`,
  validate: ast => {
    if (ast.program.body.length > 1) throw new Error("Found multiple statements but wanted one");

    if (expression$1.unwrap(ast).start === 0) throw new Error("Parse result included parens.");
  },
  unwrap: ({ program }) => {
    const [stmt] = program.body;
    assertExpressionStatement(stmt);
    return stmt.expression;
  }
};
const program$1 = { code: str => str, validate: () => {}, unwrap: ast => ast.program };

function _objectWithoutPropertiesLoose(source, excluded) {
  return source == null ? {} : Object.keys(source).reduce(function (target, key) {
    if (excluded.indexOf(key) < 0) target[key] = source[key];
    return target;
  }, {});
}

function merge(a, b) {
  const {
    placeholderWhitelist = a.placeholderWhitelist,
    placeholderPattern = a.placeholderPattern,
    preserveComments = a.preserveComments,
    syntacticPlaceholders = a.syntacticPlaceholders
  } = b;
  return {
    parser: Object.assign({}, a.parser, b.parser),
    placeholderWhitelist,
    placeholderPattern,
    preserveComments,
    syntacticPlaceholders
  };
}
function validate$1(opts) {
  if (opts != null && typeof opts != "object") throw new Error("Unknown template options.");

  const _ref = opts || {},
    { placeholderWhitelist, placeholderPattern, preserveComments, syntacticPlaceholders } = _ref;
  const parser = _objectWithoutPropertiesLoose(_ref, [
    "placeholderWhitelist",
    "placeholderPattern",
    "preserveComments",
    "syntacticPlaceholders"
  ]);
  if (placeholderWhitelist != null && !(placeholderWhitelist instanceof Set))
    throw new Error("'.placeholderWhitelist' must be a Set, null, or undefined");

  if (placeholderPattern != null && !(placeholderPattern instanceof RegExp) && placeholderPattern !== false)
    throw new Error("'.placeholderPattern' must be a RegExp, false, null, or undefined");

  if (preserveComments != null && typeof preserveComments != "boolean")
    throw new Error("'.preserveComments' must be a boolean, null, or undefined");

  if (syntacticPlaceholders != null && typeof syntacticPlaceholders != "boolean")
    throw new Error("'.syntacticPlaceholders' must be a boolean, null, or undefined");

  if (syntacticPlaceholders === true && (placeholderWhitelist != null || placeholderPattern != null))
    throw new Error(
      "'.placeholderWhitelist' and '.placeholderPattern' aren't compatible with '.syntacticPlaceholders: true'"
    );

  return {
    parser,
    placeholderWhitelist: placeholderWhitelist || void 0,
    placeholderPattern: placeholderPattern == null ? void 0 : placeholderPattern,
    preserveComments: preserveComments == null ? void 0 : preserveComments,
    syntacticPlaceholders: syntacticPlaceholders == null ? void 0 : syntacticPlaceholders
  };
}
function normalizeReplacements(replacements) {
  if (Array.isArray(replacements))
    return replacements.reduce((acc, replacement, i) => {
      acc["$" + i] = replacement;
      return acc;
    }, {});
  if (typeof replacements == "object" || replacements == null) return replacements || void 0;

  throw new Error("Template replacements must be an array, object, null, or undefined");
}

var jsTokens = {};

Object.defineProperty(jsTokens, "__esModule", { value: true });
jsTokens.default =
  /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!{)|\${(?:[^{}]|{[^}]*}?)*}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u{[\da-fA-F]+})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g;
jsTokens.matchToToken = function (match) {
  var token = { type: "invalid", value: match[0], closed: void 0 };
  if (match[1]) {
    token.type = "string";
    token.closed = !(!match[3] && !match[4]);
  } else if (match[5]) token.type = "comment";
  else if (match[6]) {
    token.type = "comment";
    token.closed = !!match[7];
  } else if (match[8]) token.type = "regex";
  else if (match[9]) token.type = "number";
  else if (match[10]) token.type = "name";
  else if (match[11]) token.type = "punctuator";
  else if (match[12]) token.type = "whitespace";
  return token;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp$1 = function (str) {
  if (typeof str != 'string') throw new TypeError('Expected a string');

  return str.replace(matchOperatorsRe, '\\$&');
};

var colorName = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
};

var cssKeywords = colorName,
  reverseKeywords = {};
for (var key in cssKeywords) if (cssKeywords.hasOwnProperty(key)) reverseKeywords[cssKeywords[key]] = key;

var convert$1;
var conversions$2 = (convert$1 = {
  rgb: { channels: 3, labels: 'rgb' },
  hsl: { channels: 3, labels: 'hsl' },
  hsv: { channels: 3, labels: 'hsv' },
  hwb: { channels: 3, labels: 'hwb' },
  cmyk: { channels: 4, labels: 'cmyk' },
  xyz: { channels: 3, labels: 'xyz' },
  lab: { channels: 3, labels: 'lab' },
  lch: { channels: 3, labels: 'lch' },
  hex: { channels: 1, labels: ['hex'] },
  keyword: { channels: 1, labels: ['keyword'] },
  ansi16: { channels: 1, labels: ['ansi16'] },
  ansi256: { channels: 1, labels: ['ansi256'] },
  hcg: { channels: 3, labels: ['h', 'c', 'g'] },
  apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
  gray: { channels: 1, labels: ['gray'] }
});
for (var model in convert$1)
  if (convert$1.hasOwnProperty(model)) {
    if (!('channels' in convert$1[model])) throw new Error('missing channels property: ' + model);

    if (!('labels' in convert$1[model])) throw new Error('missing channel labels property: ' + model);

    if (convert$1[model].labels.length !== convert$1[model].channels)
      throw new Error('channel and label counts mismatch: ' + model);

    var channels = convert$1[model].channels,
      labels = convert$1[model].labels;
    delete convert$1[model].channels;
    delete convert$1[model].labels;
    Object.defineProperty(convert$1[model], 'channels', { value: channels });
    Object.defineProperty(convert$1[model], 'labels', { value: labels });
  }

convert$1.rgb.hsl = function (rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    min = Math.min(r, g, b),
    max = Math.max(r, g, b),
    delta = max - min;
  var h, l;
  if (max === min) h = 0;
  else if (r === max) h = (g - b) / delta;
  else if (g === max) h = 2 + (b - r) / delta;
  else if (b === max) h = 4 + (r - g) / delta;

  if ((h = Math.min(h * 60, 360)) < 0) h += 360;

  l = (min + max) / 2;

  return [h, 100 * (max === min ? 0 : l <= 0.5 ? delta / (max + min) : delta / (2 - max - min)), l * 100];
};
convert$1.rgb.hsv = function (rgb) {
  var rdif, gdif, bdif, h, s;
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    v = Math.max(r, g, b),
    diff = v - Math.min(r, g, b);
  var diffc = function (c) {
    return (v - c) / 6 / diff + 0.5;
  };
  if (diff === 0) h = s = 0;
  else {
    s = diff / v;
    rdif = diffc(r);
    gdif = diffc(g);
    bdif = diffc(b);
    if (r === v) h = bdif - gdif;
    else if (g === v) h = 1 / 3 + rdif - bdif;
    else if (b === v) h = 2 / 3 + gdif - rdif;

    if (h < 0) h += 1;
    else if (h > 1) h -= 1;
  }
  return [h * 360, s * 100, v * 100];
};
convert$1.rgb.hwb = function (rgb) {
  var r = rgb[0],
    g = rgb[1],
    b = rgb[2];
  return [
    convert$1.rgb.hsl(rgb)[0],
    (1 / 255) * Math.min(r, g, b) * 100,
    100 * (1 - (1 / 255) * Math.max(r, g, b))
  ];
};
convert$1.rgb.cmyk = function (rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    k = Math.min(1 - r, 1 - g, 1 - b);
  return [
    ((1 - r - k) / (1 - k) || 0) * 100,
    ((1 - g - k) / (1 - k) || 0) * 100,
    ((1 - b - k) / (1 - k) || 0) * 100,
    k * 100
  ];
};
function comparativeDistance(x, y) {
  return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
}
convert$1.rgb.keyword = function (rgb) {
  var reversed = reverseKeywords[rgb];
  if (reversed) return reversed;

  var currentClosestKeyword,
    currentClosestDistance = Infinity;
  for (var keyword in cssKeywords)
    if (cssKeywords.hasOwnProperty(keyword)) {
      var distance = comparativeDistance(rgb, cssKeywords[keyword]);
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance;
        currentClosestKeyword = keyword;
      }
    }

  return currentClosestKeyword;
};
convert$1.keyword.rgb = function (keyword) {
  return cssKeywords[keyword];
};
convert$1.rgb.xyz = function (rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  return [
    100 * (r * 0.4124 + g * 0.3576 + b * 0.1805),
    100 * (r * 0.2126 + g * 0.7152 + b * 0.0722),
    100 * (r * 0.0193 + g * 0.1192 + b * 0.9505)
  ];
};
convert$1.rgb.lab = function (rgb) {
  var xyz = convert$1.rgb.xyz(rgb);
  return convert$1.xyz.lab(xyz);
};
convert$1.hsl.rgb = function (hsl) {
  var h = hsl[0] / 360,
    s = hsl[1] / 100,
    l = hsl[2] / 100;
  var t1, t2, t3, rgb, val;
  if (s === 0) return [(val = l * 255), val, val];

  t1 = 2 * l - (t2 = l < 0.5 ? l * (1 + s) : l + s - l * s);

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    (t3 = h + (1 / 3) * -(i - 1)) < 0 && t3++;

    t3 > 1 && t3--;

    val = 6 * t3 < 1 ? t1 + 6 * (t2 - t1) * t3
      : 2 * t3 < 1 ? t2
      : 3 * t3 < 2 ? t1 + (t2 - t1) * (2 / 3 - t3) * 6
      : t1;

    rgb[i] = val * 255;
  }
  return rgb;
};
convert$1.hsl.hsv = function (hsl) {
  var h = hsl[0],
    s = hsl[1] / 100,
    l = hsl[2] / 100,
    smin = s,
    lmin = Math.max(l, 0.01);
  s *= (l *= 2) <= 1 ? l : 2 - l;
  smin *= lmin <= 1 ? lmin : 2 - lmin;
  return [h, 100 * (l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)), ((l + s) / 2) * 100];
};
convert$1.hsv.rgb = function (hsv) {
  var h = hsv[0] / 60,
    s = hsv[1] / 100,
    v = hsv[2] / 100,
    hi = Math.floor(h) % 6,
    f = h - Math.floor(h),
    p = 255 * v * (1 - s),
    q = 255 * v * (1 - s * f),
    t = 255 * v * (1 - s * (1 - f));
  v *= 255;
  switch (hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
};
convert$1.hsv.hsl = function (hsv) {
  var h = hsv[0],
    s = hsv[1] / 100,
    v = hsv[2] / 100,
    vmin = Math.max(v, 0.01);
  var lmin, sl, l;
  l = (2 - s) * v;
  sl = s * vmin;
  return [h, ((sl / ((lmin = (2 - s) * vmin) <= 1 ? lmin : 2 - lmin)) || 0) * 100, 100 * (l / 2)];
};
convert$1.hwb.rgb = function (hwb) {
  var h = hwb[0] / 360,
    wh = hwb[1] / 100,
    bl = hwb[2] / 100,
    ratio = wh + bl;
  var i, v, f, n, r, g, b;
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }
  f = 6 * h - (i = Math.floor(6 * h));
  if ((i & 0x01) != 0) f = 1 - f;

  n = wh + f * ((v = 1 - bl) - wh);
  switch (i) {
    default:
    case 6:
    case 0:
      r = v;
      g = n;
      b = wh;
      break;
    case 1:
      r = n;
      g = v;
      b = wh;
      break;
    case 2:
      r = wh;
      g = v;
      b = n;
      break;
    case 3:
      r = wh;
      g = n;
      b = v;
      break;
    case 4:
      r = n;
      g = wh;
      b = v;
      break;
    case 5:
      r = v;
      g = wh;
      b = n;
      break;
  }
  return [r * 255, g * 255, b * 255];
};
convert$1.cmyk.rgb = function (cmyk) {
  var c = cmyk[0] / 100,
    m = cmyk[1] / 100,
    y = cmyk[2] / 100,
    k = cmyk[3] / 100;
  return [
    255 * (1 - Math.min(1, c * (1 - k) + k)),
    255 * (1 - Math.min(1, m * (1 - k) + k)),
    255 * (1 - Math.min(1, y * (1 - k) + k))
  ];
};
convert$1.xyz.rgb = function (xyz) {
  var x = xyz[0] / 100,
    y = xyz[1] / 100,
    z = xyz[2] / 100;
  var r, g, b;
  r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  b = x * 0.0557 + y * -0.204 + z * 1.057;
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : r * 12.92;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : g * 12.92;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : b * 12.92;
  return [
    Math.min(Math.max(0, r), 1) * 255,
    Math.min(Math.max(0, g), 1) * 255,
    Math.min(Math.max(0, b), 1) * 255
  ];
};
convert$1.xyz.lab = function (xyz) {
  var x = xyz[0],
    y = xyz[1],
    z = xyz[2];
  x /= 95.047;
  y /= 100;
  z /= 108.883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};
convert$1.lab.xyz = function (lab) {
  var l = lab[0],
    y = (l + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200,
    y2 = Math.pow(y, 3),
    x2 = Math.pow(x, 3),
    z2 = Math.pow(z, 3);
  y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
  return [x * 95.047, y * 100, z * 108.883];
};
convert$1.lab.lch = function (lab) {
  var l = lab[0],
    a = lab[1],
    b = lab[2],
    h = (Math.atan2(b, a) * 360) / 2 / Math.PI;
  if (h < 0) h += 360;

  return [l, Math.sqrt(a * a + b * b), h];
};
convert$1.lch.lab = function (lch) {
  var l = lch[0],
    c = lch[1],
    hr = (lch[2] / 360) * 2 * Math.PI;
  return [l, c * Math.cos(hr), c * Math.sin(hr)];
};
convert$1.rgb.ansi16 = function (args) {
  var r = args[0],
    g = args[1],
    b = args[2],
    value = 1 in arguments ? arguments[1] : convert$1.rgb.hsv(args)[2];
  if ((value = Math.round(value / 50)) === 0) return 30;

  var ansi = 30 + ((Math.round(b / 255) << 2) | (Math.round(g / 255) << 1) | Math.round(r / 255));
  if (value === 2) ansi += 60;

  return ansi;
};
convert$1.hsv.ansi16 = function (args) {
  return convert$1.rgb.ansi16(convert$1.hsv.rgb(args), args[2]);
};
convert$1.rgb.ansi256 = function (args) {
  var r = args[0],
    g = args[1],
    b = args[2];
  return r === g && g === b
    ? r < 8 ? 16
      : r > 248 ? 231
      : Math.round(((r - 8) / 247) * 24) + 232
    : 16 + 36 * Math.round((r / 255) * 5) + 6 * Math.round((g / 255) * 5) + Math.round((b / 255) * 5);
};
convert$1.ansi16.rgb = function (args) {
  var color = args % 10;
  if (color === 0 || color === 7) {
    if (args > 50) color += 3.5;

    return [(color = (color / 10.5) * 255), color, color];
  }
  var mult = 0.5 * (1 + ~~(args > 50));
  return [(color & 1) * mult * 255, ((color >> 1) & 1) * mult * 255, ((color >> 2) & 1) * mult * 255];
};
convert$1.ansi256.rgb = function (args) {
  if (args >= 232) {
    var c = 10 * (args - 232) + 8;
    return [c, c, c];
  }
  args -= 16;
  var rem;
  return [(Math.floor(args / 36) / 5) * 255, (Math.floor((rem = args % 36) / 6) / 5) * 255, ((rem % 6) / 5) * 255];
};
convert$1.rgb.hex = function (args) {
  var string = (
    ((Math.round(args[0]) & 0xFF) << 16) + ((Math.round(args[1]) & 0xFF) << 8) + (Math.round(args[2]) & 0xFF)
  ).toString(16).toUpperCase();
  return '000000'.substring(string.length) + string;
};
convert$1.hex.rgb = function (/** number */ args) {
  var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) return [0, 0, 0];

  var colorString = match[0];
  if (match[0].length === 3)
    colorString = colorString.split('').map(function (char) {
      return char + char;
    }).join('');

  var integer = parseInt(colorString, 16);
  return [(integer >> 16) & 0xFF, (integer >> 8) & 0xFF, integer & 0xFF];
};
convert$1.rgb.hcg = function (rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    chroma = max - min;

  var hue = chroma <= 0 ? 0
    : max === r ? ((g - b) / chroma) % 6
    : max === g ? 2 + (b - r) / chroma
    : 4 + (r - g) / chroma + 4;

  hue /= 6;
  return [360 * (hue % 1), chroma * 100, 100 * (chroma < 1 ? min / (1 - chroma) : 0)];
};
convert$1.hsl.hcg = function (hsl) {
  var s = hsl[1] / 100,
    l = hsl[2] / 100,
    f = 0,
    c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l);

  if (c < 1.0) f = (l - 0.5 * c) / (1.0 - c);

  return [hsl[0], c * 100, f * 100];
};
convert$1.hsv.hcg = function (hsv) {
  var s = hsv[1] / 100,
    v = hsv[2] / 100,
    c = s * v,
    f = 0;
  if (c < 1.0) f = (v - c) / (1 - c);

  return [hsv[0], c * 100, f * 100];
};
convert$1.hcg.rgb = function (hcg) {
  var h = hcg[0] / 360,
    c = hcg[1] / 100,
    g = hcg[2] / 100;
  if (c === 0.0) return [g * 255, g * 255, g * 255];

  var pure = [0, 0, 0],
    hi = (h % 1) * 6,
    v = hi % 1,
    w = 1 - v,
    mg; //= 0
  switch (Math.floor(hi)) {
    case 0:
      pure[0] = 1;
      pure[1] = v;
      pure[2] = 0;
      break;
    case 1:
      pure[0] = w;
      pure[1] = 1;
      pure[2] = 0;
      break;
    case 2:
      pure[0] = 0;
      pure[1] = 1;
      pure[2] = v;
      break;
    case 3:
      pure[0] = 0;
      pure[1] = w;
      pure[2] = 1;
      break;
    case 4:
      pure[0] = v;
      pure[1] = 0;
      pure[2] = 1;
      break;
    default:
      pure[0] = 1;
      pure[1] = 0;
      pure[2] = w;
  }
  mg = (1.0 - c) * g;
  return [(c * pure[0] + mg) * 255, (c * pure[1] + mg) * 255, (c * pure[2] + mg) * 255];
};
convert$1.hcg.hsv = function (hcg) {
  var c = hcg[1] / 100,
    v = c + (hcg[2] / 100) * (1.0 - c),
    f = 0;
  if (v > 0.0) f = c / v;

  return [hcg[0], f * 100, v * 100];
};
convert$1.hcg.hsl = function (hcg) {
  var c = hcg[1] / 100,
    l = (hcg[2] / 100) * (1.0 - c) + 0.5 * c,
    s = 0;
  if (l > 0.0 && l < 0.5) s = c / (2 * l);
  else if (l >= 0.5 && l < 1.0) s = c / (2 * (1 - l));

  return [hcg[0], s * 100, l * 100];
};
convert$1.hcg.hwb = function (hcg) {
  var c = hcg[1] / 100,
    v = c + (hcg[2] / 100) * (1.0 - c);
  return [hcg[0], 100 * (v - c), 100 * (1 - v)];
};
convert$1.hwb.hcg = function (hwb) {
  var w = hwb[1] / 100,
    v = 1 - hwb[2] / 100,
    c = v - w,
    g = 0;
  if (c < 1) g = (v - c) / (1 - c);

  return [hwb[0], c * 100, g * 100];
};
convert$1.apple.rgb = function (apple) {
  return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};
convert$1.rgb.apple = function (rgb) {
  return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};
convert$1.gray.rgb = function (args) {
  return [(args[0] / 100) * 255, (args[0] / 100) * 255, (args[0] / 100) * 255];
};
convert$1.gray.hsl = convert$1.gray.hsv = function (args) {
  return [0, 0, args[0]];
};
convert$1.gray.hwb = function (gray) {
  return [0, 100, gray[0]];
};
convert$1.gray.cmyk = function (gray) {
  return [0, 0, 0, gray[0]];
};
convert$1.gray.lab = function (gray) {
  return [gray[0], 0, 0];
};
convert$1.gray.hex = function (gray) {
  var val = Math.round((gray[0] / 100) * 255) & 0xFF,
    string = ((val << 16) + (val << 8) + val).toString(16).toUpperCase();
  return '000000'.substring(string.length) + string;
};
convert$1.rgb.gray = function (rgb) {
  return [((rgb[0] + rgb[1] + rgb[2]) / 3 / 255) * 100];
};

var conversions$1 = conversions$2;
function buildGraph() {
  var graph = {};
  for (var models = Object.keys(conversions$1), len = models.length, i = 0; i < len; i++)
    graph[models[i]] = { distance: -1, parent: null };

  return graph;
}
function deriveBFS(fromModel) {
  var graph = buildGraph(),
    queue = [fromModel];
  graph[fromModel].distance = 0;
  while (queue.length) {
    var current = queue.pop(),
      adjacents = Object.keys(conversions$1[current]);
    for (var len = adjacents.length, i = 0; i < len; i++) {
      var adjacent = adjacents[i],
        node = graph[adjacent];
      if (node.distance === -1) {
        node.distance = graph[current].distance + 1;
        node.parent = current;
        queue.unshift(adjacent);
      }
    }
  }
  return graph;
}
function link(from, to) {
  return function (args) {
    return to(from(args));
  };
}
function wrapConversion(toModel, graph) {
  var path = [graph[toModel].parent, toModel],
    fn = conversions$1[graph[toModel].parent][toModel];
  for (var cur = graph[toModel].parent; graph[cur].parent; ) {
    path.unshift(graph[cur].parent);
    fn = link(conversions$1[graph[cur].parent][cur], fn);
    cur = graph[cur].parent;
  }
  fn.conversion = path;
  return fn;
}
var route$1 = function (fromModel) {
  var graph = deriveBFS(fromModel),
    conversion = {};
  for (var models = Object.keys(graph), len = models.length, i = 0; i < len; i++) {
    var toModel = models[i];

    if (graph[toModel].parent !== null) conversion[toModel] = wrapConversion(toModel, graph);
  }
  return conversion;
};

var conversions = conversions$2,
  route = route$1,
  convert = {},
  models = Object.keys(conversions);
function wrapRaw(fn) {
  var wrappedFn = function (args) {
    if (args === void 0 || args === null) return args;

    if (arguments.length > 1) args = Array.prototype.slice.call(arguments);

    return fn(args);
  };
  if ('conversion' in fn) wrappedFn.conversion = fn.conversion;

  return wrappedFn;
}
function wrapRounded(fn) {
  var wrappedFn = function (args) {
    if (args === void 0 || args === null) return args;

    if (arguments.length > 1) args = Array.prototype.slice.call(arguments);

    var result = fn(args);
    if (typeof result == 'object')
      for (var len = result.length, i = 0; i < len; i++) result[i] = Math.round(result[i]);

    return result;
  };
  if ('conversion' in fn) wrappedFn.conversion = fn.conversion;

  return wrappedFn;
}
models.forEach(function (fromModel) {
  convert[fromModel] = {};
  Object.defineProperty(convert[fromModel], 'channels', { value: conversions[fromModel].channels });
  Object.defineProperty(convert[fromModel], 'labels', { value: conversions[fromModel].labels });
  var routes = route(fromModel);
  Object.keys(routes).forEach(function (toModel) {
    var fn = routes[toModel];
    convert[fromModel][toModel] = wrapRounded(fn);
    convert[fromModel][toModel].raw = wrapRaw(fn);
  });
});

const colorConvert = convert;
const wrapAnsi16 = (fn, offset) => function () {
  return `\x1B[${fn.apply(colorConvert, arguments) + offset}m`;
};
const wrapAnsi256 = (fn, offset) => function () {
  const code = fn.apply(colorConvert, arguments);
  return `\x1B[${38 + offset};5;${code}m`;
};
const wrapAnsi16m = (fn, offset) => function () {
  const rgb = fn.apply(colorConvert, arguments);
  return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};
function assembleStyles() {
  const codes = new Map();
  const styles = {
    modifier: {
      reset: [0, 0],
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      gray: [90, 39],
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      bgBlackBright: [100, 49],
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  styles.color.grey = styles.color.gray;
  for (const groupName of Object.keys(styles)) {
    const group = styles[groupName];
    for (const styleName of Object.keys(group)) {
      const style = group[styleName];
      styles[styleName] = { open: `\x1B[${style[0]}m`, close: `\x1B[${style[1]}m` };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, { value: group, enumerable: false });
    Object.defineProperty(styles, 'codes', { value: codes, enumerable: false });
  }
  const ansi2ansi = n => n,
    rgb2rgb = (r, g, b) => [r, g, b];
  styles.color.close = '\x1B[39m';
  styles.bgColor.close = '\x1B[49m';
  styles.color.ansi = { ansi: wrapAnsi16(ansi2ansi, 0) };
  styles.color.ansi256 = { ansi256: wrapAnsi256(ansi2ansi, 0) };
  styles.color.ansi16m = { rgb: wrapAnsi16m(rgb2rgb, 0) };
  styles.bgColor.ansi = { ansi: wrapAnsi16(ansi2ansi, 10) };
  styles.bgColor.ansi256 = { ansi256: wrapAnsi256(ansi2ansi, 10) };
  styles.bgColor.ansi16m = { rgb: wrapAnsi16m(rgb2rgb, 10) };
  for (let key of Object.keys(colorConvert)) {
    if (typeof colorConvert[key] != 'object') continue;

    const suite = colorConvert[key];
    if (key === 'ansi16') key = 'ansi';

    if ('ansi16' in suite) {
      styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
      styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
    }
    if ('ansi256' in suite) {
      styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
      styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
    }
    if ('rgb' in suite) {
      styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
      styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
    }
  }
  return styles;
}
var ansiStyles$1 = assembleStyles();

var supportsColor_1 = {
  stdout: false,
  stderr: false
};

const TEMPLATE_REGEX =
    /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(})|((?:.|[\r\n\f])+?)/gi,
  STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
  STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
  ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi;
const ESCAPES = new Map([
  ['n', '\n'],
  ['r', '\r'],
  ['t', '\t'],
  ['b', '\b'],
  ['f', '\f'],
  ['v', '\v'],
  ['0', '\0'],
  ['\\', '\\'],
  ['e', '\x1B'],
  ['a', '\x07']
]);
function unescape(c) {
  return (c[0] === 'u' && c.length === 5) || (c[0] === 'x' && c.length === 3)
    ? String.fromCharCode(parseInt(c.slice(1), 16))
    : ESCAPES.get(c) || c;
}
function parseArguments(name, args) {
  const results = [],
    chunks = args.trim().split(/\s*,\s*/g);
  let matches;
  for (const /** @type {(string|number)} */ chunk of chunks)
    if (!isNaN(chunk)) results.push(Number(chunk));
    else if ((matches = chunk.match(STRING_REGEX)))
      results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, chr) => (escape ? unescape(escape) : chr)));
    else throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);

  return results;
}
function parseStyle(style) {
  STYLE_REGEX.lastIndex = 0;
  const results = [];
  for (let matches; (matches = STYLE_REGEX.exec(style)) !== null; ) {
    const name = matches[1];
    if (matches[2]) {
      const args = parseArguments(name, matches[2]);
      results.push([name].concat(args));
    } else results.push([name]);
  }
  return results;
}
function buildStyle(chalk, styles) {
  const enabled = {};
  for (const layer of styles)
    for (const style of layer.styles) enabled[style[0]] = layer.inverse ? null : style.slice(1);

  let current = chalk;
  for (const styleName of Object.keys(enabled))
    if (Array.isArray(enabled[styleName])) {
      if (!(styleName in current)) throw new Error("Unknown Chalk style: " + styleName);

      current =
        enabled[styleName].length > 0 ? current[styleName].apply(current, enabled[styleName]) : current[styleName];
    }

  return current;
}
var templates = (chalk, tmp) => {
  const styles = [],
    chunks = [];
  let chunk = [];
  tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
    if (escapeChar) chunk.push(unescape(escapeChar));
    else if (style) {
      const str = chunk.join('');
      chunk = [];
      chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str));
      styles.push({ inverse, styles: parseStyle(style) });
    } else if (close) {
      if (styles.length === 0) throw new Error('Found extraneous } in Chalk template literal');

      chunks.push(buildStyle(chalk, styles)(chunk.join('')));
      chunk = [];
      styles.pop();
    } else chunk.push(chr);
  });
  chunks.push(chunk.join(''));
  if (styles.length > 0) {
    const errMsg = `Chalk template literal is missing ${styles.length} closing bracket${
      styles.length === 1 ? '' : 's'
    } (\`}\`)`;
    throw new Error(errMsg);
  }
  return chunks.join('');
};

const escapeStringRegexp = escapeStringRegexp$1,
  ansiStyles = ansiStyles$1,
  stdoutColor = supportsColor_1.stdout,
  template = templates,
  isSimpleWindowsTerm = process.platform === 'win32' && !(process.env.TERM || '').toLowerCase().startsWith('xterm'),
  levelMapping = ['ansi', 'ansi', 'ansi256', 'ansi16m'],
  skipModels = new Set(['gray']),
  styles = Object.create(null);
function applyOptions(obj, options) {
  options = options || {};
  const scLevel = stdoutColor ? stdoutColor.level : 0;
  obj.level = options.level === void 0 ? scLevel : options.level;
  obj.enabled = 'enabled' in options ? options.enabled : obj.level > 0;
}
function Chalk(options) {
  if (!this || !(this instanceof Chalk) || this.template) {
    const chalk = {};
    applyOptions(chalk, options);
    chalk.template = function () {
      const args = [].slice.call(arguments);
      return chalkTag.apply(null, [chalk.template].concat(args));
    };
    Object.setPrototypeOf(chalk, Chalk.prototype);
    Object.setPrototypeOf(chalk.template, chalk);
    chalk.template.constructor = Chalk;
    return chalk.template;
  }
  applyOptions(this, options);
}
if (isSimpleWindowsTerm) ansiStyles.blue.open = '\x1B[94m';

for (const key of Object.keys(ansiStyles)) {
  ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
  styles[key] = {
    get() {
      const codes = ansiStyles[key];
      return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, key);
    }
  };
}
styles.visible = {
  get() {
    return build.call(this, this._styles || [], true, 'visible');
  }
};
ansiStyles.color.closeRe = new RegExp(escapeStringRegexp(ansiStyles.color.close), 'g');
for (const model of Object.keys(ansiStyles.color.ansi)) {
  if (skipModels.has(model)) continue;

  styles[model] = {
    get() {
      const level = this.level;
      return function () {
        const open = ansiStyles.color[levelMapping[level]][model].apply(null, arguments),
          codes = { open, close: ansiStyles.color.close, closeRe: ansiStyles.color.closeRe };
        return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
      };
    }
  };
}
ansiStyles.bgColor.closeRe = new RegExp(escapeStringRegexp(ansiStyles.bgColor.close), 'g');
for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
  if (skipModels.has(model)) continue;

  styles['bg' + model[0].toUpperCase() + model.slice(1)] = {
    get() {
      const level = this.level;
      return function () {
        const open = ansiStyles.bgColor[levelMapping[level]][model].apply(null, arguments),
          codes = { open, close: ansiStyles.bgColor.close, closeRe: ansiStyles.bgColor.closeRe };
        return build.call(this, this._styles ? this._styles.concat(codes) : [codes], this._empty, model);
      };
    }
  };
}
const proto = Object.defineProperties(() => {}, styles);
function build(_styles, _empty, key) {
  const builder = function () {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  builder._empty = _empty;
  const self = this;
  Object.defineProperty(builder, 'level', {
    enumerable: true,
    get: () => self.level,
    set(level) {
      self.level = level;
    }
  });
  Object.defineProperty(builder, 'enabled', {
    enumerable: true,
    get: () => self.enabled,
    set(enabled) {
      self.enabled = enabled;
    }
  });
  builder.hasGrey = this.hasGrey || key === 'gray' || key === 'grey';
  builder.__proto__ = proto;
  return builder;
}
function applyStyle() {
  const args = arguments,
    argsLen = args.length;
  let str = String(arguments[0]);
  if (argsLen === 0) return '';

  if (argsLen > 1) for (let a = 1; a < argsLen; a++) str += ' ' + args[a];

  if (!this.enabled || this.level <= 0 || !str) return this._empty ? '' : str;

  const originalDim = ansiStyles.dim.open;
  if (isSimpleWindowsTerm && this.hasGrey) ansiStyles.dim.open = '';

  for (const code of this._styles.slice().reverse()) {
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`);
  }
  ansiStyles.dim.open = originalDim;
  return str;
}
function chalkTag(chalk, strings) {
  if (!Array.isArray(strings)) return [].slice.call(arguments, 1).join(' ');

  const args = [].slice.call(arguments, 2),
    parts = [strings.raw[0]];
  for (let i = 1; i < strings.length; i++) {
    parts.push(String(args[i - 1]).replace(/[{}\\]/g, '\\$&'));
    parts.push(String(strings.raw[i]));
  }
  return template(chalk, parts.join(''));
}
Object.defineProperties(Chalk.prototype, styles);
// noinspection JSPotentiallyInvalidConstructorUsage
var _chalk = Chalk();
_chalk.supportsColor = stdoutColor;
var chalk = (_chalk.default = _chalk);

const sometimesKeywords = new Set(["as", "async", "from", "get", "of", "set"]);
function getDefs$1(chalk) {
  return {
    keyword: chalk.cyan,
    capitalized: chalk.yellow,
    jsxIdentifier: chalk.yellow,
    punctuator: chalk.yellow,
    number: chalk.magenta,
    string: chalk.green,
    regex: chalk.magenta,
    comment: chalk.grey,
    invalid: chalk.white.bgRed.bold
  };
}
const NEWLINE$1 = /\r\n|[\n\r\u2028\u2029]/,
  BRACKET = /^[()[\]{}]$/;
let tokenize;
{
  const JSX_TAG = /^[a-z][\w-]*$/i;
  const getTokenType = function (token, offset, text) {
    if (token.type === "name") {
      if (
        common.isKeyword(token.value) ||
        common.isStrictReservedWord(token.value, true) ||
        sometimesKeywords.has(token.value)
      )
        return "keyword";

      if (JSX_TAG.test(token.value) && (text[offset - 1] === "<" || text.slice(offset - 2, offset) == "</"))
        return "jsxIdentifier";

      if (token.value[0] !== token.value[0].toLowerCase()) return "capitalized";
    }

    return token.type === "punctuator" && BRACKET.test(token.value)
      ? "bracket"
      : token.type !== "invalid" || (token.value !== "@" && token.value !== "#")
      ? token.type
      : "punctuator";
  };
  tokenize = function* (text) {
    for (let match; (match = jsTokens.default.exec(text)); ) {
      const token = jsTokens.matchToToken(match);
      yield { type: getTokenType(token, match.index, text), value: token.value };
    }
  };
}
function highlightTokens(defs, text) {
  let highlighted = "";
  for (const { type, value } of tokenize(text)) {
    const colorize = defs[type];
    highlighted += colorize
      ? value.split(NEWLINE$1).map(str => colorize(str)).join("\n")
      : value;
  }
  return highlighted;
}
function shouldHighlight(/** @prop {boolean} forceColor */ options) {
  return chalk.level > 0 || options.forceColor;
}
let chalkWithForcedColor = void 0;
function getChalk(forceColor) {
  if (forceColor) {
    chalkWithForcedColor != null || (chalkWithForcedColor = new chalk.constructor({ enabled: true, level: 1 }));
    return chalkWithForcedColor;
  }
  return chalk;
}
function highlight(code, options = {}) {
  return code !== "" && shouldHighlight(options)
    ? highlightTokens(getDefs$1(getChalk(options.forceColor)), code)
    : code;
}

function getDefs(chalk) {
  return { gutter: chalk.grey, marker: chalk.red.bold, message: chalk.red.bold };
}
const NEWLINE = /\r\n|[\n\r\u2028\u2029]/;
function getMarkerLines(loc, source, opts) {
  const startLoc = Object.assign({ column: 0, line: -1 }, loc.start),
    endLoc = Object.assign({}, startLoc, loc.end),
    { linesAbove = 2, linesBelow = 3 } = opts || {},
    startLine = startLoc.line,
    startColumn = startLoc.column,
    endLine = endLoc.line,
    endColumn = endLoc.column;
  let start = Math.max(startLine - (linesAbove + 1), 0),
    end = Math.min(source.length, endLine + linesBelow);
  if (startLine === -1) start = 0;

  if (endLine === -1) end = source.length;

  const lineDiff = endLine - startLine,
    markerLines = {};
  if (lineDiff)
    for (let i = 0; i <= lineDiff; i++) {
      const lineNumber = i + startLine;
      if (!startColumn) markerLines[lineNumber] = true;
      else if (i === 0) {
        const sourceLength = source[lineNumber - 1].length;
        markerLines[lineNumber] = [startColumn, sourceLength - startColumn + 1];
      } else if (i === lineDiff) markerLines[lineNumber] = [0, endColumn];
      else {
        const sourceLength = source[lineNumber - i].length;
        markerLines[lineNumber] = [0, sourceLength];
      }
    }
  else
    markerLines[startLine] =
      startColumn === endColumn ? !startColumn || [startColumn, 0] : [startColumn, endColumn - startColumn];

  return { start, end, markerLines };
}
function codeFrameColumns(rawLines, loc, opts = {}) {
  const highlighted = (opts.highlightCode || opts.forceColor) && shouldHighlight(opts),
    chalk = getChalk(opts.forceColor),
    defs = getDefs(chalk),
    maybeHighlight = (chalkFn, string) => (highlighted ? chalkFn(string) : string),
    lines = rawLines.split(NEWLINE),
    { start, end, markerLines } = getMarkerLines(loc, lines, opts),
    hasColumns = loc.start && typeof loc.start.column == "number",
    numberMaxWidth = String(end).length;
  let frame = (
    highlighted ? highlight(rawLines, opts) : rawLines
  ).split(NEWLINE, end).slice(start, end).map((line, index) => {
    const number = start + 1 + index,
      gutter = ` ${(" " + number).slice(-numberMaxWidth)} |`,
      hasMarker = markerLines[number],
      lastMarkerLine = !markerLines[number + 1];
    if (hasMarker) {
      let markerLine = "";
      if (Array.isArray(hasMarker)) {
        const markerSpacing = line.slice(0, Math.max(hasMarker[0] - 1, 0)).replace(/[^\t]/g, " "),
          numberOfMarkers = hasMarker[1] || 1;
        markerLine = [
          "\n ",
          maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")),
          " ",
          markerSpacing,
          maybeHighlight(defs.marker, "^").repeat(numberOfMarkers)
        ].join("");
        if (lastMarkerLine && opts.message) markerLine += " " + maybeHighlight(defs.message, opts.message);
      }
      return [
        maybeHighlight(defs.marker, ">"),
        maybeHighlight(defs.gutter, gutter),
        line.length > 0 ? " " + line : "",
        markerLine
      ].join("");
    }
    return ` ${maybeHighlight(defs.gutter, gutter)}${line.length > 0 ? " " + line : ""}`;
  }).join("\n");
  if (opts.message && !hasColumns) frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}\n${frame}`;

  return highlighted ? chalk.reset(frame) : frame;
}

const {
  isCallExpression,
  isExpressionStatement,
  isFunction,
  isIdentifier,
  isJSXIdentifier,
  isNewExpression,
  isPlaceholder,
  isStatement: isStatement$1,
  isStringLiteral: isStringLiteral$1,
  removePropertiesDeep,
  traverse
} = _t;
const PATTERN = /^[_$A-Z0-9]+$/;
function parseAndBuildMetadata(formatter, code, opts) {
  const { placeholderWhitelist, placeholderPattern, preserveComments, syntacticPlaceholders } = opts,
    ast = parseWithCodeFrame(code, opts.parser, syntacticPlaceholders);
  removePropertiesDeep(ast, { preserveComments });
  formatter.validate(ast);
  const state = {
    syntactic: { placeholders: [], placeholderNames: new Set() },
    legacy: { placeholders: [], placeholderNames: new Set() },
    placeholderWhitelist,
    placeholderPattern,
    syntacticPlaceholders
  };
  traverse(ast, placeholderVisitorHandler, state);
  return Object.assign({ ast }, state.syntactic.placeholders.length ? state.syntactic : state.legacy);
}
function placeholderVisitorHandler(node, ancestors, state) {
  var _state$placeholderWhi;
  let name,
    hasSyntacticPlaceholders = state.syntactic.placeholders.length > 0;
  if (isPlaceholder(node)) {
    if (state.syntacticPlaceholders === false)
      throw new Error("%%foo%%-style placeholders can't be used when '.syntacticPlaceholders' is false.");

    name = node.name.name;
    hasSyntacticPlaceholders = true;
  } else if (hasSyntacticPlaceholders || state.syntacticPlaceholders) return;
  else if (isIdentifier(node) || isJSXIdentifier(node)) name = node.name;
  else if (isStringLiteral$1(node)) name = node.value;
  else return;

  if (hasSyntacticPlaceholders && (state.placeholderPattern != null || state.placeholderWhitelist != null))
    throw new Error(
      "'.placeholderWhitelist' and '.placeholderPattern' aren't compatible with '.syntacticPlaceholders: true'"
    );

  if (!(
    hasSyntacticPlaceholders ||
    (state.placeholderPattern !== false && (state.placeholderPattern || PATTERN).test(name)) ||
    ((_state$placeholderWhi = state.placeholderWhitelist) != null && _state$placeholderWhi.has(name))
  ))
    return;

  ancestors = ancestors.slice();
  const { node: parent, key } = ancestors[ancestors.length - 1];
  let type;
  if (isStringLiteral$1(node) || isPlaceholder(node, { expectedNode: "StringLiteral" })) type = "string";
  else if (
    (isNewExpression(parent) && key === "arguments") ||
    (isCallExpression(parent) && key === "arguments") ||
    (isFunction(parent) && key === "params")
  )
    type = "param";
  else if (isExpressionStatement(parent) && !isPlaceholder(node)) {
    type = "statement";
    ancestors = ancestors.slice(0, -1);
  } else type = isStatement$1(node) && isPlaceholder(node) ? "statement" : "other";

  const { placeholders, placeholderNames } = hasSyntacticPlaceholders ? state.syntactic : state.legacy;
  placeholders.push({
    name,
    type,
    resolve: ast => resolveAncestors(ast, ancestors),
    isDuplicate: placeholderNames.has(name)
  });
  placeholderNames.add(name);
}
function resolveAncestors(ast, ancestors) {
  let parent = ast;
  for (let i = 0; i < ancestors.length - 1; i++) {
    const { key, index } = ancestors[i];
    parent = index === void 0 ? parent[key] : parent[key][index];
  }
  const { key, index } = ancestors[ancestors.length - 1];
  return { parent, key, index };
}
function parseWithCodeFrame(code, parserOpts, syntacticPlaceholders) {
  const plugins = (parserOpts.plugins || []).slice();
  syntacticPlaceholders === false || plugins.push("placeholders");

  parserOpts = Object.assign(
    { allowReturnOutsideFunction: true, allowSuperOutsideMethod: true, sourceType: "module" },
    parserOpts,
    { plugins }
  );
  try {
    return parser.parse(code, parserOpts);
  } catch (err) {
    const loc = err.loc;
    if (loc) {
      err.message += "\n" + codeFrameColumns(code, { start: loc });
      err.code = "BABEL_TEMPLATE_PARSE_ERROR";
    }
    throw err;
  }
}

const {
  blockStatement,
  cloneNode,
  emptyStatement,
  expressionStatement,
  identifier,
  isStatement,
  isStringLiteral,
  stringLiteral,
  validate
} = _t;
function populatePlaceholders(metadata, replacements) {
  const ast = cloneNode(metadata.ast);
  if (replacements) {
    metadata.placeholders.forEach(placeholder => {
      if (!Object.prototype.hasOwnProperty.call(replacements, placeholder.name)) {
        const placeholderName = placeholder.name;
        throw new Error(`Error: No substitution given for "${placeholderName}". If this is not meant to be a
            placeholder you may want to consider passing one of the following options to @babel/template:
            - { placeholderPattern: false, placeholderWhitelist: new Set(['${placeholderName}'])}
            - { placeholderPattern: /^${placeholderName}$/ }`);
      }
    });
    Object.keys(replacements).forEach(key => {
      if (!metadata.placeholderNames.has(key)) throw new Error(`Unknown substitution "${key}" given`);
    });
  }
  metadata.placeholders.slice().reverse().forEach(placeholder => {
    try {
      applyReplacement(placeholder, ast, (replacements && replacements[placeholder.name]) || null);
    } catch (e) {
      e.message = `@babel/template placeholder "${placeholder.name}": ${e.message}`;
      throw e;
    }
  });
  return ast;
}
function applyReplacement(placeholder, ast, replacement) {
  if (placeholder.isDuplicate)
    if (Array.isArray(replacement)) replacement = replacement.map(node => cloneNode(node));
    else if (typeof replacement == "object") replacement = cloneNode(replacement);

  const { parent, key, index } = placeholder.resolve(ast);
  if (placeholder.type === "string") {
    if (typeof replacement == "string") replacement = stringLiteral(replacement);

    if (!replacement || !isStringLiteral(replacement)) throw new Error("Expected string substitution");
  } else if (placeholder.type === "statement") {
    if (index === void 0)
      !replacement
        ? (replacement = emptyStatement())
        : Array.isArray(replacement)
        ? (replacement = blockStatement(replacement))
        : typeof replacement == "string"
        ? (replacement = expressionStatement(identifier(replacement)))
        : isStatement(replacement) || (replacement = expressionStatement(replacement));
    else if (replacement && !Array.isArray(replacement)) {
      if (typeof replacement == "string") replacement = identifier(replacement);

      isStatement(replacement) || (replacement = expressionStatement(replacement));
    }
  } else if (placeholder.type === "param") {
    if (typeof replacement == "string") replacement = identifier(replacement);

    if (index === void 0) throw new Error("Assertion failure.");
  } else {
    if (typeof replacement == "string") replacement = identifier(replacement);

    if (Array.isArray(replacement)) throw new Error("Cannot replace single expression with an array.");
  }
  if (index === void 0) {
    validate(parent, key, replacement);
    parent[key] = replacement;
  } else {
    const items = parent[key].slice();
    placeholder.type === "statement" || placeholder.type === "param"
      ? replacement == null
        ? items.splice(index, 1)
        : Array.isArray(replacement)
        ? items.splice(index, 1, ...replacement)
        : (items[index] = replacement)
      : (items[index] = replacement);

    validate(parent, key, items);
    parent[key] = items;
  }
}

function stringTemplate(formatter, code, opts) {
  code = formatter.code(code);
  let metadata;
  return arg => {
    const replacements = normalizeReplacements(arg);
    metadata || (metadata = parseAndBuildMetadata(formatter, code, opts));
    return formatter.unwrap(populatePlaceholders(metadata, replacements));
  };
}

function literalTemplate(formatter, tpl, opts) {
  const { metadata, names } = buildLiteralData(formatter, tpl, opts);
  return arg => {
    const defaultReplacements = {};
    arg.forEach((replacement, i) => {
      defaultReplacements[names[i]] = replacement;
    });
    return arg => {
      const replacements = normalizeReplacements(arg);
      replacements &&
        Object.keys(replacements).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(defaultReplacements, key))
            throw new Error("Unexpected replacement overlap.");
        });

      return formatter.unwrap(populatePlaceholders(
        metadata,
        replacements ? Object.assign(replacements, defaultReplacements) : defaultReplacements
      ));
    };
  };
}
function buildLiteralData(formatter, tpl, opts) {
  let prefix = "BABEL_TPL$";
  const raw = tpl.join("");
  do {
    prefix = "$$" + prefix;
  } while (raw.includes(prefix));
  const { names, code } = buildTemplateCode(tpl, prefix);
  const metadata = parseAndBuildMetadata(formatter, formatter.code(code), {
    parser: opts.parser,
    placeholderWhitelist: new Set(names.concat(opts.placeholderWhitelist ? Array.from(opts.placeholderWhitelist) : [])),
    placeholderPattern: opts.placeholderPattern,
    preserveComments: opts.preserveComments,
    syntacticPlaceholders: opts.syntacticPlaceholders
  });
  return { metadata, names };
}
function buildTemplateCode(tpl, prefix) {
  const names = [];
  let code = tpl[0];
  for (let i = 1; i < tpl.length; i++) {
    const value = `${prefix}${i - 1}`;
    names.push(value);
    code += value + tpl[i];
  }
  return { names, code };
}

const NO_PLACEHOLDER = validate$1({ placeholderPattern: false });
function createTemplateBuilder(formatter, defaultOpts) {
  const templateFnCache = new WeakMap(),
    templateAstCache = new WeakMap(),
    cachedOpts = defaultOpts || validate$1(null);
  return Object.assign((tpl, ...args) => {
    if (typeof tpl == "string") {
      if (args.length > 1) throw new Error("Unexpected extra params.");
      return extendedTrace(stringTemplate(formatter, tpl, merge(cachedOpts, validate$1(args[0]))));
    }
    if (Array.isArray(tpl)) {
      let builder = templateFnCache.get(tpl);
      if (!builder) {
        builder = literalTemplate(formatter, tpl, cachedOpts);
        templateFnCache.set(tpl, builder);
      }
      return extendedTrace(builder(args));
    }
    if (typeof tpl == "object" && tpl) {
      if (args.length > 0) throw new Error("Unexpected extra params.");
      return createTemplateBuilder(formatter, merge(cachedOpts, validate$1(tpl)));
    }
    throw new Error("Unexpected template param " + typeof tpl);
  }, {
    ast: (tpl, ...args) => {
      if (typeof tpl == "string") {
        if (args.length > 1) throw new Error("Unexpected extra params.");
        return stringTemplate(formatter, tpl, merge(merge(cachedOpts, validate$1(args[0])), NO_PLACEHOLDER))();
      }
      if (Array.isArray(tpl)) {
        let builder = templateAstCache.get(tpl);
        if (!builder) {
          builder = literalTemplate(formatter, tpl, merge(cachedOpts, NO_PLACEHOLDER));
          templateAstCache.set(tpl, builder);
        }
        return builder(args)();
      }
      throw new Error("Unexpected template param " + typeof tpl);
    }
  });
}
function extendedTrace(fn) {
  let rootStack = "";
  try {
    // noinspection ExceptionCaughtLocallyJS
    throw new Error();
  } catch (error) {
    if (error.stack) rootStack = error.stack.split("\n").slice(3).join("\n");
  }
  return arg => {
    try {
      return fn(arg);
    } catch (err) {
      err.stack += "\n    =============\n" + rootStack;
      throw err;
    }
  };
}

const smart = createTemplateBuilder(smart$1),
  statement = createTemplateBuilder(statement$1),
  statements = createTemplateBuilder(statements$1),
  expression = createTemplateBuilder(expression$1),
  program = createTemplateBuilder(program$1);
var index = Object.assign(smart.bind(void 0), {
  smart,
  statement,
  statements,
  expression,
  program,
  ast: smart.ast
});

exports = module.exports = index;
exports.codeFrameColumns = codeFrameColumns;
exports.default = index;
exports.expression = expression;
exports.program = program;
exports.smart = smart;
exports.statement = statement;
exports.statements = statements;

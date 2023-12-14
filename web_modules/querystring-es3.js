'use strict';

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

exports.decode = exports.parse = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs != 'string' || qs.length === 0) return obj;

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys == 'number') maxKeys = options.maxKeys;

  var len = qs.length;
  if (maxKeys > 0 && len > maxKeys) len = maxKeys;

  for (var i = 0; i < len; ++i) {
    var kstr, vstr, k, v,
      x = qs[i].replace(regexp, '%20'),
      idx = x.indexOf(eq);

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    !hasOwnProperty(obj, k)
      ? (obj[k] = v)
      : isArray(obj[k])
      ? obj[k].push(v)
      : (obj[k] = [obj[k], v]);
  }

  return obj;
};

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

exports.encode = exports.stringify = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) obj = void 0;

  if (typeof obj != 'object')
    return !name ? ''
      : encodeURIComponent(stringifyPrimitive(name)) + eq +
        encodeURIComponent(stringifyPrimitive(obj));

  return map(objectKeys(obj), function(k) {
    var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
    return isArray(obj[k])
      ? map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep)

      : ks + encodeURIComponent(stringifyPrimitive(obj[k]));
  }).join(sep);
};

var isArray = Array.isArray || function(xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map(xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) res.push(f(xs[i], i));

  return res;
}

var objectKeys = Object.keys || function(obj) {
  var res = [];
  for (var key in obj) hasOwnProperty(obj, key) && res.push(key);

  return res;
};

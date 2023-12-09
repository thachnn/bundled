function normalizeArray(parts, allowAboveRoot) {
  for (var up = 0, i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    "." === last ? parts.splice(i, 1) : ".." === last ? (parts.splice(i, 1), up++) : up && (parts.splice(i, 1), 
    up--);
  }
  if (allowAboveRoot) for (;up--; up) parts.unshift("..");
  return parts;
}

function basename(path) {
  "string" != typeof path && (path += "");
  var i, start = 0, end = -1, matchedSlash = !0;
  for (i = path.length - 1; i >= 0; --i) if (47 === path.charCodeAt(i)) {
    if (!matchedSlash) {
      start = i + 1;
      break;
    }
  } else -1 === end && (matchedSlash = !1, end = i + 1);
  return -1 === end ? "" : path.slice(start, end);
}

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  for (var res = [], i = 0; i < xs.length; i++) f(xs[i], i, xs) && res.push(xs[i]);
  return res;
}

exports.resolve = function() {
  for (var resolvedPath = "", resolvedAbsolute = !1, i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();
    if ("string" != typeof path) throw new TypeError("Arguments to path.resolve must be strings");
    path && (resolvedPath = path + "/" + resolvedPath, resolvedAbsolute = "/" === path.charAt(0));
  }
  return (resolvedAbsolute ? "/" : "") + (resolvedPath = normalizeArray(filter(resolvedPath.split("/"), (function(p) {
    return !!p;
  })), !resolvedAbsolute).join("/")) || ".";
}, exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path), trailingSlash = "/" === substr(path, -1);
  return (path = normalizeArray(filter(path.split("/"), (function(p) {
    return !!p;
  })), !isAbsolute).join("/")) || isAbsolute || (path = "."), path && trailingSlash && (path += "/"), 
  (isAbsolute ? "/" : "") + path;
}, exports.isAbsolute = function(path) {
  return "/" === path.charAt(0);
}, exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, (function(p, index) {
    if ("string" != typeof p) throw new TypeError("Arguments to path.join must be strings");
    return p;
  })).join("/"));
}, exports.relative = function(from, to) {
  function trim(arr) {
    for (var start = 0; start < arr.length && "" === arr[start]; start++) ;
    for (var end = arr.length - 1; end >= 0 && "" === arr[end]; end--) ;
    return start > end ? [] : arr.slice(start, end - start + 1);
  }
  from = exports.resolve(from).substr(1), to = exports.resolve(to).substr(1);
  for (var fromParts = trim(from.split("/")), toParts = trim(to.split("/")), length = Math.min(fromParts.length, toParts.length), samePartsLength = length, i = 0; i < length; i++) if (fromParts[i] !== toParts[i]) {
    samePartsLength = i;
    break;
  }
  var outputParts = [];
  for (i = samePartsLength; i < fromParts.length; i++) outputParts.push("..");
  return (outputParts = outputParts.concat(toParts.slice(samePartsLength))).join("/");
}, exports.sep = "/", exports.delimiter = ":", exports.dirname = function(path) {
  if ("string" != typeof path && (path += ""), 0 === path.length) return ".";
  for (var code = path.charCodeAt(0), hasRoot = 47 === code, end = -1, matchedSlash = !0, i = path.length - 1; i >= 1; --i) if (47 === (code = path.charCodeAt(i))) {
    if (!matchedSlash) {
      end = i;
      break;
    }
  } else matchedSlash = !1;
  return -1 === end ? hasRoot ? "/" : "." : hasRoot && 1 === end ? "/" : path.slice(0, end);
}, exports.basename = function(path, ext) {
  var f = basename(path);
  return ext && f.substr(-1 * ext.length) === ext && (f = f.substr(0, f.length - ext.length)), 
  f;
}, exports.extname = function(path) {
  "string" != typeof path && (path += "");
  for (var startDot = -1, startPart = 0, end = -1, matchedSlash = !0, preDotState = 0, i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (47 !== code) -1 === end && (matchedSlash = !1, end = i + 1), 46 === code ? -1 === startDot ? startDot = i : 1 !== preDotState && (preDotState = 1) : -1 !== startDot && (preDotState = -1); else if (!matchedSlash) {
      startPart = i + 1;
      break;
    }
  }
  return -1 === startDot || -1 === end || 0 === preDotState || 1 === preDotState && startDot === end - 1 && startDot === startPart + 1 ? "" : path.slice(startDot, end);
};

var substr = "b" === "ab".substr(-1) ? function(str, start, len) {
  return str.substr(start, len);
} : function(str, start, len) {
  return start < 0 && (start = str.length + start), str.substr(start, len);
};
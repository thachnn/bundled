function normalizeArray(parts, allowAboveRoot) {
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') parts.splice(i, 1);
    else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  if (allowAboveRoot) while (up--) parts.unshift('..');

  return parts;
}

exports.resolve = function() {
  var resolvedPath = '',
    resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = i >= 0 ? arguments[i] : process.cwd();

    if (typeof path != 'string')
      throw new TypeError('Arguments to path.resolve must be strings');
    if (!path) continue;

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  return (resolvedAbsolute ? '/' : '') +
    normalizeArray(filter(resolvedPath.split('/'), function(p) {
      return !!p;
    }), !resolvedAbsolute).join('/') || '.';
};

exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
    trailingSlash = substr(path, -1) === '/';

  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  path || isAbsolute || (path = '.');

  if (path && trailingSlash) path += '/';

  return (isAbsolute ? '/' : '') + path;
};

exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, _index) {
    if (typeof p != 'string')
      throw new TypeError('Arguments to path.join must be strings');

    return p;
  }).join('/'));
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length && arr[start] === ''; start++);

    var end = arr.length - 1;
    for (; end >= 0 && arr[end] === ''; end--);

    return start > end ? [] : arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/')),
    toParts = trim(to.split('/')),

    length = Math.min(fromParts.length, toParts.length),
    samePartsLength = length;
  for (var i = 0; i < length; i++)
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }

  var outputParts = [];
  for (i = samePartsLength; i < fromParts.length; i++) outputParts.push('..');

  return outputParts.concat(toParts.slice(samePartsLength)).join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  if (typeof path != 'string') path += '';
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0),
    hasRoot = code === 47,
    end = -1,
    matchedSlash = true;
  for (var i = path.length - 1; i >= 1; --i)
    if ((code = path.charCodeAt(i)) !== 47) matchedSlash = false;
    else if (!matchedSlash) {
      end = i;
      break;
    }

  return end === -1 ? (hasRoot ? '/' : '.')
    : hasRoot && end === 1
    ? '/'
    : path.slice(0, end);
};

function basename(path) {
  if (typeof path != 'string') path += '';

  var start = 0,
    end = -1,
    matchedSlash = true;

  for (var i = path.length - 1; i >= 0; --i)
    if (path.charCodeAt(i) === 47) {
      if (!matchedSlash) {
        start = i + 1;
        break;
      }
    } else if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }

  return end === -1 ? '' : path.slice(start, end);
}

exports.basename = function(path, ext) {
  var f = basename(path);
  if (ext && f.substr(-1 * ext.length) === ext)
    f = f.substr(0, f.length - ext.length);

  return f;
};

exports.extname = function(path) {
  if (typeof path != 'string') path += '';
  var startDot = -1,
    startPart = 0,
    end = -1,
    matchedSlash = true,
    preDotState = 0;
  for (var i = path.length - 1; i >= 0; --i) {
    var code = path.charCodeAt(i);
    if (code === 47) {
      if (matchedSlash) continue;

      startPart = i + 1;
      break;
    }
    if (end === -1) {
      matchedSlash = false;
      end = i + 1;
    }
    code !== 46
      ? startDot === -1 || (preDotState = -1)
      : startDot === -1
      ? (startDot = i)
      : preDotState === 1 || (preDotState = 1);
  }

  return startDot === -1 || end === -1 ||
    preDotState === 0 ||
    (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)
    ? ''
    : path.slice(startDot, end);
};

function filter(xs, f) {
  if (xs.filter) return xs.filter(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) f(xs[i], i, xs) && res.push(xs[i]);

  return res;
}

var substr = 'ab'.substr(-1) === 'b'
  ? function(str, start, len) { return str.substr(start, len); }
  : function(str, start, len) {
      return str.substr(start < 0 ? str.length + start : start, len);
    };

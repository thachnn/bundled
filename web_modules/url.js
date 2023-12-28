'use strict';

var punycode = require('./punycode'),
  querystring = require('./querystring-es3');

var util = {
  isString: function(arg) {
    return typeof arg == 'string';
  },
  isObject: function(arg) {
    return typeof arg == 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,
  simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

  autoEscape = ["'"].concat(unwise),
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  unsafeProtocol = { javascript: true, 'javascript:': true },
  hostlessProtocol = { javascript: true, 'javascript:': true };
var slashedProtocol = {
  http: true,
  https: true,
  ftp: true,
  gopher: true,
  file: true,
  'http:': true,
  'https:': true,
  'ftp:': true,
  'gopher:': true,
  'file:': true
};

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url))
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);

  var queryIndex = url.indexOf('?'),
    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');

  var rest = (url = uSplit.join(splitter)).trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        this.query = parseQueryString
          ? querystring.parse(this.search.substr(1))
          : this.search.substr(1);
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    var lowerProto = (proto = proto[0]).toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  if (slashesDenoteHost || proto || /^\/\/[^@\/]+@[^@\/]+/.test(rest)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] && (slashes || (proto && !slashedProtocol[proto]))) {
    var auth, atSign,
      hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }

    atSign = hostEnd === -1 ? rest.lastIndexOf('@') : rest.lastIndexOf('@', hostEnd);

    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
    }
    if (hostEnd === -1) hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    this.parseHost();

    this.hostname = this.hostname || '';

    var ipv6Hostname =
      this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var l = ((i = 0), hostparts.length); i < l; i++) {
        var part = hostparts[i];
        if (!part || part.match(hostnamePartPattern)) continue;
        var newpart = '';
        for (var j = 0, k = part.length; j < k; j++)
          newpart += part.charCodeAt(j) > 127 ? 'x' : part[j];

        if (newpart.match(hostnamePartPattern)) continue;
        var validParts = hostparts.slice(0, i),
          notHost = hostparts.slice(i + 1),
          bit = part.match(hostnamePartStart);
        if (bit) {
          validParts.push(bit[1]);
          notHost.unshift(bit[2]);
        }
        if (notHost.length) rest = '/' + notHost.join('.') + rest;

        this.hostname = validParts.join('.');
        break;
      }
    }

    this.hostname =
      this.hostname.length > hostnameMaxLen ? '' : this.hostname.toLowerCase();

    ipv6Hostname || (this.hostname = punycode.toASCII(this.hostname));

    var p = this.port ? ':' + this.port : '',
      h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') rest = '/' + rest;
    }
  }

  if (!unsafeProtocol[lowerProto])
    for (i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) esc = escape(ae);

      rest = rest.split(ae).join(esc);
    }

  var hash = rest.indexOf('#');
  if (hash !== -1) {
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) this.query = querystring.parse(this.query);

    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname)
    this.pathname = '/';

  if (this.pathname || this.search) {
    p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  this.href = this.format();
  return this;
};

function urlFormat(obj) {
  if (util.isString(obj)) obj = urlParse(obj);
  return obj instanceof Url ? obj.format() : Url.prototype.format.call(obj);
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth).replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
    pathname = this.pathname || '',
    hash = this.hash || '',
    host = false,
    query = '';

  if (this.host) host = auth + this.host;
  else if (this.hostname) {
    host = auth +
      (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) host += ':' + this.port;
  }

  if (this.query && util.isObject(this.query) && Object.keys(this.query).length)
    query = querystring.stringify(this.query);

  var search = this.search || (query && '?' + query) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  if (this.slashes || ((!protocol || slashedProtocol[protocol]) && host !== false)) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else host || (host = '');

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });

  return protocol + host + pathname + search.replace('#', '%23') + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  return !source ? relative : urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  for (var tkeys = Object.keys(this), tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  result.hash = relative.hash;

  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  if (relative.slashes && !relative.protocol) {
    for (var rkeys = Object.keys(relative), rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') result[rkey] = relative[rkey];
    }

    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname)
      result.path = result.pathname = '/';

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    if (!slashedProtocol[relative.protocol]) {
      for (var keys = Object.keys(relative), v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      relative.host || (relative.host = '');
      relative.hostname || (relative.hostname = '');
      relPath[0] === '' || relPath.unshift('');
      relPath.length > 1 || relPath.unshift('');
      result.pathname = relPath.join('/');
    } else result.pathname = relative.pathname;

    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    if (result.pathname || result.search) {
      var p = result.pathname || '',
        s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
    isRelAbs =
      relative.host || (relative.pathname && relative.pathname.charAt(0) === '/'),
    mustEndAbs = isRelAbs || isSourceAbs || (result.host && relative.pathname),
    removeAllDots = mustEndAbs,
    srcPath = (result.pathname && result.pathname.split('/')) || [];
  relPath = (relative.pathname && relative.pathname.split('/')) || [];
  var psychotic = result.protocol && !slashedProtocol[result.protocol];

  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host)
      srcPath[0] === '' ? (srcPath[0] = result.host) : srcPath.unshift(result.host);

    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host)
        relPath[0] === '' ? (relPath[0] = relative.host) : relPath.unshift(relative.host);

      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname =
      relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
  } else if (relPath.length) {
    srcPath || (srcPath = []);
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      authInHost =
        !!result.host && result.host.indexOf('@') > 0 && result.host.split('@');
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    if (!util.isNull(result.pathname) || !util.isNull(result.search))
      result.path =
        (result.pathname ? result.pathname : '') + (result.search ? result.search : '');

    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = result.search ? '/' + result.search : null;

    result.href = result.format();
    return result;
  }

  var last = srcPath.slice(-1)[0],
    hasTrailingSlash = ((result.host || relative.host || srcPath.length > 1) &&
        (last === '.' || last === '..')) || last === '',

    up = 0;
  for (var i = srcPath.length; i >= 0; i--)
    if ((last = srcPath[i]) === '.') srcPath.splice(i, 1);
    else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }

  if (!mustEndAbs && !removeAllDots) while (up--) srcPath.unshift('..');

  !mustEndAbs || srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/') ||
    srcPath.unshift('');

  hasTrailingSlash && srcPath.join('/').substr(-1) !== '/' && srcPath.push('');

  var isAbsolute = srcPath[0] === '' || (srcPath[0] && srcPath[0].charAt(0) === '/');

  if (psychotic) {
    result.hostname = result.host = isAbsolute ? ''
      : srcPath.length ? srcPath.shift() : '';
    var authInHost =
      !!result.host && result.host.indexOf('@') > 0 && result.host.split('@');
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  !mustEndAbs || isAbsolute || srcPath.unshift('');

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else result.pathname = srcPath.join('/');

  if (!util.isNull(result.pathname) || !util.isNull(result.search))
    result.path =
      (result.pathname ? result.pathname : '') + (result.search ? result.search : '');

  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host,
    port = portPattern.exec(host);
  if (port) {
    if ((port = port[0]) !== ':') this.port = port.substr(1);

    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};
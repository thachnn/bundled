module.exports = (function (modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    var module = installedModules[moduleId];
    if (module) return module.exports;

    installedModules[moduleId] = module = { i: moduleId, l: false, exports: {} };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;
    return module.exports;
  }

  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  return __webpack_require__(4);
})([
// 0
function (module, exports) {

exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream)

exports.writableStream = isFunction(global.WritableStream)

exports.abortController = isFunction(global.AbortController)

exports.blobConstructor = false
try {
  new Blob([new ArrayBuffer(1)])
  exports.blobConstructor = true
} catch (_) {}

var xhr
function getXHR() {
  if (xhr !== void 0) return xhr

  if (global.XMLHttpRequest) {
    xhr = new global.XMLHttpRequest()
    try {
      xhr.open('GET', global.XDomainRequest ? '/' : 'https://example.com')
    } catch (_) {
      xhr = null
    }
  } else xhr = null

  return xhr
}

function checkTypeSupport(type) {
  var xhr = getXHR()
  if (!xhr) return false
  try {
    xhr.responseType = type
    return xhr.responseType === type
  } catch (_) {}
  return false
}

var haveArrayBuffer = global.ArrayBuffer !== void 0,
  haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice)

exports.arraybuffer = exports.fetch || (haveArrayBuffer && checkTypeSupport('arraybuffer'))

exports.msstream = !exports.fetch && haveSlice && checkTypeSupport('ms-stream')
exports.mozchunkedarraybuffer =
  !exports.fetch && haveArrayBuffer && checkTypeSupport('moz-chunked-arraybuffer')

exports.overrideMimeType = exports.fetch || (!!getXHR() && isFunction(getXHR().overrideMimeType))

exports.vbArray = isFunction(global.VBArray)

function isFunction(value) {
  return typeof value == 'function'
}

xhr = null

},
// 1
function (module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(6);
  if (typeof util.inherits != 'function') throw '';
  module.exports = util.inherits;
} catch (_) {
  module.exports = __webpack_require__(7);
}

},
// 2
function (module, exports, __webpack_require__) {

var capability = __webpack_require__(0),
  inherits = __webpack_require__(1),
  stream = __webpack_require__(3)

var rStates = (exports.readyStates = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
})

var IncomingMessage = (exports.IncomingMessage = function (xhr, response, mode, fetchTimer) {
  var self = this
  stream.Readable.call(self)

  self._mode = mode
  self.headers = {}
  self.rawHeaders = []
  self.trailers = {}
  self.rawTrailers = []

  self.on('end', function () {
    process.nextTick(function () {
      self.emit('close')
    })
  })

  if (mode === 'fetch') {
    self._fetchResponse = response

    self.url = response.url
    self.statusCode = response.status
    self.statusMessage = response.statusText

    response.headers.forEach(function (header, key) {
      self.headers[key.toLowerCase()] = header
      self.rawHeaders.push(key, header)
    })

    if (capability.writableStream) {
      var writable = new WritableStream({
        write: function (chunk) {
          return new Promise(function (resolve, reject) {
            self._destroyed
              ? reject()
              : self.push(new Buffer(chunk))
              ? resolve()
              : (self._resumeFetch = resolve)
          })
        },
        close: function () {
          global.clearTimeout(fetchTimer)
          self._destroyed || self.push(null)
        },
        abort: function (err) {
          self._destroyed || self.emit('error', err)
        }
      })

      try {
        response.body.pipeTo(writable).catch(function (err) {
          global.clearTimeout(fetchTimer)
          self._destroyed || self.emit('error', err)
        })
        return
      } catch (_) {}
    }
    var reader = response.body.getReader()
    function read() {
      reader.read().then(function (result) {
        if (self._destroyed) return
        if (result.done) {
          global.clearTimeout(fetchTimer)
          self.push(null)
          return
        }
        self.push(new Buffer(result.value))
        read()
      }).catch(function (err) {
        global.clearTimeout(fetchTimer)
        self._destroyed || self.emit('error', err)
      })
    }
    read()
  } else {
    self._xhr = xhr
    self._pos = 0

    self.url = xhr.responseURL
    self.statusCode = xhr.status
    self.statusMessage = xhr.statusText
    xhr.getAllResponseHeaders().split(/\r?\n/).forEach(function (header) {
      var matches = header.match(/^([^:]+):\s*(.*)/)
      if (!matches) return

      var key = matches[1].toLowerCase()
      if (key === 'set-cookie') {
        if (self.headers[key] === void 0) self.headers[key] = []

        self.headers[key].push(matches[2])
      } else
        self.headers[key] !== void 0 ? (self.headers[key] += ', ' + matches[2])
          : (self.headers[key] = matches[2])

      self.rawHeaders.push(matches[1], matches[2])
    })

    self._charset = 'x-user-defined'
    if (!capability.overrideMimeType) {
      var mimeType = self.rawHeaders['mime-type']
      if (mimeType) {
        var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/)
        if (charsetMatch) self._charset = charsetMatch[1].toLowerCase()
      }
      self._charset || (self._charset = 'utf-8')
    }
  }
})

inherits(IncomingMessage, stream.Readable)

IncomingMessage.prototype._read = function () {
  var self = this,

    resolve = self._resumeFetch
  if (resolve) {
    self._resumeFetch = null
    resolve()
  }
}

IncomingMessage.prototype._onXHRProgress = function () {
  var self = this,

    xhr = self._xhr,

    response = null
  switch (self._mode) {
    case 'text:vbarray':
      if (xhr.readyState !== rStates.DONE) break
      try {
        response = new global.VBArray(xhr.responseBody).toArray()
      } catch (_) {}
      if (response !== null) {
        self.push(new Buffer(response))
        break
      }
    case 'text':
      try {
        response = xhr.responseText
      } catch (_) {
        self._mode = 'text:vbarray'
        break
      }
      if (response.length <= self._pos) break

      var newData = response.substr(self._pos)
      if (self._charset === 'x-user-defined') {
        var buffer = new Buffer(newData.length)
        for (var i = 0; i < newData.length; i++) buffer[i] = newData.charCodeAt(i) & 0xff

        self.push(buffer)
      } else self.push(newData, self._charset)

      self._pos = response.length
      break
    case 'arraybuffer':
      if (xhr.readyState !== rStates.DONE || !xhr.response) break
      response = xhr.response
      self.push(new Buffer(new Uint8Array(response)))
      break
    case 'moz-chunked-arraybuffer':
      response = xhr.response
      if (xhr.readyState !== rStates.LOADING || !response) break
      self.push(new Buffer(new Uint8Array(response)))
      break
    case 'ms-stream':
      response = xhr.response
      if (xhr.readyState !== rStates.LOADING) break
      var reader = new global.MSStreamReader()
      reader.onprogress = function () {
        if (reader.result.byteLength <= self._pos) return

        self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos))))
        self._pos = reader.result.byteLength
      }
      reader.onload = function () {
        self.push(null)
      }
      reader.readAsArrayBuffer(response)
      break
  }

  self._xhr.readyState !== rStates.DONE || self._mode === 'ms-stream' || self.push(null)
}

},
// 3
function (module) {

module.exports = require('./readable-stream/readable');

},
// 4
function (module, exports, __webpack_require__) {

var ClientRequest = __webpack_require__(5),
  response = __webpack_require__(2),
  extend = __webpack_require__(10),
  statusCodes = __webpack_require__(11),
  url = __webpack_require__(12),

  http = exports

http.request = function (opts, cb) {
  opts = typeof opts == 'string' ? url.parse(opts) : extend(opts)

  var defaultProtocol = global.location.protocol.search(/^https?:$/) === -1 ? 'http:' : '',

    protocol = opts.protocol || defaultProtocol,
    host = opts.hostname || opts.host,
    port = opts.port,
    path = opts.path || '/'

  if (host && host.indexOf(':') !== -1) host = '[' + host + ']'

  opts.url = (host ? protocol + '//' + host : '') + (port ? ':' + port : '') + path
  opts.method = (opts.method || 'GET').toUpperCase()
  opts.headers = opts.headers || {}

  var req = new ClientRequest(opts)
  cb && req.on('response', cb)
  return req
}

http.get = function (opts, cb) {
  var req = http.request(opts, cb)
  req.end()
  return req
}

http.ClientRequest = ClientRequest
http.IncomingMessage = response.IncomingMessage

http.Agent = function () {}
http.Agent.defaultMaxSockets = 4

http.globalAgent = new http.Agent()

http.STATUS_CODES = statusCodes

http.METHODS = [
  'CHECKOUT',
  'CONNECT',
  'COPY',
  'DELETE',
  'GET',
  'HEAD',
  'LOCK',
  'M-SEARCH',
  'MERGE',
  'MKACTIVITY',
  'MKCOL',
  'MOVE',
  'NOTIFY',
  'OPTIONS',
  'PATCH',
  'POST',
  'PROPFIND',
  'PROPPATCH',
  'PURGE',
  'PUT',
  'REPORT',
  'SEARCH',
  'SUBSCRIBE',
  'TRACE',
  'UNLOCK',
  'UNSUBSCRIBE'
]

},
// 5
function (module, exports, __webpack_require__) {

var capability = __webpack_require__(0),
  inherits = __webpack_require__(1),
  response = __webpack_require__(2),
  stream = __webpack_require__(3),
  toArrayBuffer = __webpack_require__(8),

  IncomingMessage = response.IncomingMessage,
  rStates = response.readyStates

function decideMode(preferBinary, useFetch) {
  return capability.fetch && useFetch
    ? 'fetch'
    : capability.mozchunkedarraybuffer
    ? 'moz-chunked-arraybuffer'
    : capability.msstream
    ? 'ms-stream'
    : capability.arraybuffer && preferBinary
    ? 'arraybuffer'
    : capability.vbArray && preferBinary
    ? 'text:vbarray'
    : 'text'
}

var ClientRequest = (module.exports = function (opts) {
  var preferBinary,
    self = this
  stream.Writable.call(self)

  self._opts = opts
  self._body = []
  self._headers = {}
  opts.auth && self.setHeader('Authorization', 'Basic ' + new Buffer(opts.auth).toString('base64'))
  Object.keys(opts.headers).forEach(function (name) {
    self.setHeader(name, opts.headers[name])
  })

  var useFetch = true
  if (opts.mode === 'disable-fetch' || ('requestTimeout' in opts && !capability.abortController)) {
    useFetch = false
    preferBinary = true
  } else if (opts.mode === 'prefer-streaming') preferBinary = false
  else if (opts.mode === 'allow-wrong-content-type') preferBinary = !capability.overrideMimeType
  else if (!opts.mode || opts.mode === 'default' || opts.mode === 'prefer-fast')
    preferBinary = true
  else throw new Error('Invalid value for opts.mode')

  self._mode = decideMode(preferBinary, useFetch)
  self._fetchTimer = null

  self.on('finish', function () {
    self._onFinish()
  })
})

inherits(ClientRequest, stream.Writable)

ClientRequest.prototype.setHeader = function (name, value) {
  var self = this,
    lowerName = name.toLowerCase()
  if (unsafeHeaders.indexOf(lowerName) !== -1) return

  self._headers[lowerName] = { name: name, value: value }
}

ClientRequest.prototype.getHeader = function (name) {
  var header = this._headers[name.toLowerCase()]
  return header ? header.value : null
}

ClientRequest.prototype.removeHeader = function (name) {
  delete this._headers[name.toLowerCase()]
}

ClientRequest.prototype._onFinish = function () {
  var self = this

  if (self._destroyed) return
  var opts = self._opts,

    headersObj = self._headers,
    body = null
  if (opts.method !== 'GET' && opts.method !== 'HEAD')
    body = capability.arraybuffer
      ? toArrayBuffer(Buffer.concat(self._body))
      : capability.blobConstructor
      ? new global.Blob(self._body.map(function (buffer) {
          return toArrayBuffer(buffer)
        }), { type: (headersObj['content-type'] || {}).value || '' })
      : Buffer.concat(self._body).toString()

  var headersList = []
  Object.keys(headersObj).forEach(function (keyName) {
    var name = headersObj[keyName].name,
      value = headersObj[keyName].value
    Array.isArray(value)
      ? value.forEach(function (v) {
          headersList.push([name, v])
        })
      : headersList.push([name, value])
  })

  if (self._mode === 'fetch') {
    var signal = null
    if (capability.abortController) {
      var controller = new AbortController()
      signal = controller.signal
      self._fetchAbortController = controller

      if ('requestTimeout' in opts && opts.requestTimeout !== 0)
        self._fetchTimer = global.setTimeout(function () {
          self.emit('requestTimeout')
          self._fetchAbortController && self._fetchAbortController.abort()
        }, opts.requestTimeout)
    }

    global.fetch(self._opts.url, {
      method: self._opts.method,
      headers: headersList,
      body: body || void 0,
      mode: 'cors',
      credentials: opts.withCredentials ? 'include' : 'same-origin',
      signal: signal
    }).then(function (response) {
      self._fetchResponse = response
      self._connect()
    }, function (reason) {
      global.clearTimeout(self._fetchTimer)
      self._destroyed || self.emit('error', reason)
    })
  } else {
    var xhr = (self._xhr = new global.XMLHttpRequest())
    try {
      xhr.open(self._opts.method, self._opts.url, true)
    } catch (err) {
      process.nextTick(function () {
        self.emit('error', err)
      })
      return
    }

    if ('responseType' in xhr) xhr.responseType = self._mode.split(':')[0]

    if ('withCredentials' in xhr) xhr.withCredentials = !!opts.withCredentials

    self._mode === 'text' && 'overrideMimeType' in xhr &&
      xhr.overrideMimeType('text/plain; charset=x-user-defined')

    if ('requestTimeout' in opts) {
      xhr.timeout = opts.requestTimeout
      xhr.ontimeout = function () {
        self.emit('requestTimeout')
      }
    }

    headersList.forEach(function (header) {
      xhr.setRequestHeader(header[0], header[1])
    })

    self._response = null
    xhr.onreadystatechange = function () {
      switch (xhr.readyState) {
        case rStates.LOADING:
        case rStates.DONE:
          self._onXHRProgress()
          break
      }
    }
    if (self._mode === 'moz-chunked-arraybuffer')
      xhr.onprogress = function () {
        self._onXHRProgress()
      }

    xhr.onerror = function () {
      if (self._destroyed) return
      self.emit('error', new Error('XHR error'))
    }

    try {
      xhr.send(body)
    } catch (err) {
      process.nextTick(function () {
        self.emit('error', err)
      })
      return
    }
  }
}

function statusValid(xhr) {
  try {
    var status = xhr.status
    return status !== null && status !== 0
  } catch (_) {
    return false
  }
}

ClientRequest.prototype._onXHRProgress = function () {
  var self = this

  if (!statusValid(self._xhr) || self._destroyed) return

  self._response || self._connect()

  self._response._onXHRProgress()
}

ClientRequest.prototype._connect = function () {
  var self = this

  if (self._destroyed) return

  self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer)
  self._response.on('error', function (err) {
    self.emit('error', err)
  })

  self.emit('response', self._response)
}

ClientRequest.prototype._write = function (chunk, encoding, cb) {
  this._body.push(chunk)
  cb()
}

ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function () {
  var self = this
  self._destroyed = true
  global.clearTimeout(self._fetchTimer)
  if (self._response) self._response._destroyed = true
  self._xhr ? self._xhr.abort() : self._fetchAbortController && self._fetchAbortController.abort()
}

ClientRequest.prototype.end = function (data, encoding, cb) {
  var self = this
  if (typeof data == 'function') {
    cb = data
    data = void 0
  }

  stream.Writable.prototype.end.call(self, data, encoding, cb)
}

ClientRequest.prototype.flushHeaders = function () {}
ClientRequest.prototype.setTimeout = function () {}
ClientRequest.prototype.setNoDelay = function () {}
ClientRequest.prototype.setSocketKeepAlive = function () {}

var unsafeHeaders = [
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via'
]

},
// 6
function (module) {

module.exports = require('util');

},
// 7
function (module) {

module.exports =
  typeof Object.create == 'function' ? function (ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
  } : function (ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }

},
// 8
function (module, exports, __webpack_require__) {

var Buffer = __webpack_require__(9).Buffer

module.exports = function (buf) {
  if (buf instanceof Uint8Array) {
    if (buf.byteOffset === 0 && buf.byteLength === buf.buffer.byteLength) return buf.buffer
    if (typeof buf.buffer.slice == 'function')
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  }

  if (!Buffer.isBuffer(buf)) throw new Error('Argument must be a Buffer')

  var arrayCopy = new Uint8Array(buf.length)
  for (var len = buf.length, i = 0; i < len; i++) arrayCopy[i] = buf[i]

  return arrayCopy.buffer
}

},
// 9
function (module) {

module.exports = require('buffer');

},
// 10
function (module) {

module.exports = extend

var hasOwnProperty = Object.prototype.hasOwnProperty

function extend() {
  var target = {}

  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i]

    for (var key in source) if (hasOwnProperty.call(source, key)) target[key] = source[key]
  }

  return target
}

},
// 11
function (module) {

module.exports = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Unordered Collection',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',
  511: 'Network Authentication Required'
}

},
// 12
function (module) {

module.exports = require('url');

}
]);

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
  return __webpack_require__(4);
}([ function(module, exports) {
  exports.fetch = isFunction(global.fetch) && isFunction(global.ReadableStream), exports.writableStream = isFunction(global.WritableStream), 
  exports.abortController = isFunction(global.AbortController), exports.blobConstructor = !1;
  try {
    new Blob([ new ArrayBuffer(1) ]), exports.blobConstructor = !0;
  } catch (e) {}
  var xhr;
  function getXHR() {
    if (void 0 !== xhr) return xhr;
    if (global.XMLHttpRequest) {
      xhr = new global.XMLHttpRequest;
      try {
        xhr.open("GET", global.XDomainRequest ? "/" : "https://example.com");
      } catch (e) {
        xhr = null;
      }
    } else xhr = null;
    return xhr;
  }
  function checkTypeSupport(type) {
    var xhr = getXHR();
    if (!xhr) return !1;
    try {
      return xhr.responseType = type, xhr.responseType === type;
    } catch (e) {}
    return !1;
  }
  var haveArrayBuffer = void 0 !== global.ArrayBuffer, haveSlice = haveArrayBuffer && isFunction(global.ArrayBuffer.prototype.slice);
  function isFunction(value) {
    return "function" == typeof value;
  }
  exports.arraybuffer = exports.fetch || haveArrayBuffer && checkTypeSupport("arraybuffer"), 
  exports.msstream = !exports.fetch && haveSlice && checkTypeSupport("ms-stream"), 
  exports.mozchunkedarraybuffer = !exports.fetch && haveArrayBuffer && checkTypeSupport("moz-chunked-arraybuffer"), 
  exports.overrideMimeType = exports.fetch || !!getXHR() && isFunction(getXHR().overrideMimeType), 
  exports.vbArray = isFunction(global.VBArray), xhr = null;
}, function(module, exports, __webpack_require__) {
  try {
    var util = __webpack_require__(6);
    if ("function" != typeof util.inherits) throw "";
    module.exports = util.inherits;
  } catch (e) {
    module.exports = __webpack_require__(7);
  }
}, function(module, exports, __webpack_require__) {
  var capability = __webpack_require__(0), inherits = __webpack_require__(1), stream = __webpack_require__(3), rStates = exports.readyStates = {
    UNSENT: 0,
    OPENED: 1,
    HEADERS_RECEIVED: 2,
    LOADING: 3,
    DONE: 4
  }, IncomingMessage = exports.IncomingMessage = function(xhr, response, mode, fetchTimer) {
    var self = this;
    if (stream.Readable.call(self), self._mode = mode, self.headers = {}, self.rawHeaders = [], 
    self.trailers = {}, self.rawTrailers = [], self.on("end", (function() {
      process.nextTick((function() {
        self.emit("close");
      }));
    })), "fetch" === mode) {
      if (self._fetchResponse = response, self.url = response.url, self.statusCode = response.status, 
      self.statusMessage = response.statusText, response.headers.forEach((function(header, key) {
        self.headers[key.toLowerCase()] = header, self.rawHeaders.push(key, header);
      })), capability.writableStream) {
        var writable = new WritableStream({
          write: function(chunk) {
            return new Promise((function(resolve, reject) {
              self._destroyed ? reject() : self.push(new Buffer(chunk)) ? resolve() : self._resumeFetch = resolve;
            }));
          },
          close: function() {
            global.clearTimeout(fetchTimer), self._destroyed || self.push(null);
          },
          abort: function(err) {
            self._destroyed || self.emit("error", err);
          }
        });
        try {
          return void response.body.pipeTo(writable).catch((function(err) {
            global.clearTimeout(fetchTimer), self._destroyed || self.emit("error", err);
          }));
        } catch (e) {}
      }
      var reader = response.body.getReader();
      !function read() {
        reader.read().then((function(result) {
          if (!self._destroyed) {
            if (result.done) return global.clearTimeout(fetchTimer), void self.push(null);
            self.push(new Buffer(result.value)), read();
          }
        })).catch((function(err) {
          global.clearTimeout(fetchTimer), self._destroyed || self.emit("error", err);
        }));
      }();
    } else {
      if (self._xhr = xhr, self._pos = 0, self.url = xhr.responseURL, self.statusCode = xhr.status, 
      self.statusMessage = xhr.statusText, xhr.getAllResponseHeaders().split(/\r?\n/).forEach((function(header) {
        var matches = header.match(/^([^:]+):\s*(.*)/);
        if (matches) {
          var key = matches[1].toLowerCase();
          "set-cookie" === key ? (void 0 === self.headers[key] && (self.headers[key] = []), 
          self.headers[key].push(matches[2])) : void 0 !== self.headers[key] ? self.headers[key] += ", " + matches[2] : self.headers[key] = matches[2], 
          self.rawHeaders.push(matches[1], matches[2]);
        }
      })), self._charset = "x-user-defined", !capability.overrideMimeType) {
        var mimeType = self.rawHeaders["mime-type"];
        if (mimeType) {
          var charsetMatch = mimeType.match(/;\s*charset=([^;])(;|$)/);
          charsetMatch && (self._charset = charsetMatch[1].toLowerCase());
        }
        self._charset || (self._charset = "utf-8");
      }
    }
  };
  inherits(IncomingMessage, stream.Readable), IncomingMessage.prototype._read = function() {
    var resolve = this._resumeFetch;
    resolve && (this._resumeFetch = null, resolve());
  }, IncomingMessage.prototype._onXHRProgress = function() {
    var self = this, xhr = self._xhr, response = null;
    switch (self._mode) {
     case "text:vbarray":
      if (xhr.readyState !== rStates.DONE) break;
      try {
        response = new global.VBArray(xhr.responseBody).toArray();
      } catch (e) {}
      if (null !== response) {
        self.push(new Buffer(response));
        break;
      }

     case "text":
      try {
        response = xhr.responseText;
      } catch (e) {
        self._mode = "text:vbarray";
        break;
      }
      if (response.length > self._pos) {
        var newData = response.substr(self._pos);
        if ("x-user-defined" === self._charset) {
          for (var buffer = new Buffer(newData.length), i = 0; i < newData.length; i++) buffer[i] = 255 & newData.charCodeAt(i);
          self.push(buffer);
        } else self.push(newData, self._charset);
        self._pos = response.length;
      }
      break;

     case "arraybuffer":
      if (xhr.readyState !== rStates.DONE || !xhr.response) break;
      response = xhr.response, self.push(new Buffer(new Uint8Array(response)));
      break;

     case "moz-chunked-arraybuffer":
      if (response = xhr.response, xhr.readyState !== rStates.LOADING || !response) break;
      self.push(new Buffer(new Uint8Array(response)));
      break;

     case "ms-stream":
      if (response = xhr.response, xhr.readyState !== rStates.LOADING) break;
      var reader = new global.MSStreamReader;
      reader.onprogress = function() {
        reader.result.byteLength > self._pos && (self.push(new Buffer(new Uint8Array(reader.result.slice(self._pos)))), 
        self._pos = reader.result.byteLength);
      }, reader.onload = function() {
        self.push(null);
      }, reader.readAsArrayBuffer(response);
    }
    self._xhr.readyState === rStates.DONE && "ms-stream" !== self._mode && self.push(null);
  };
}, function(module, exports) {
  module.exports = require("./readable-stream/readable");
}, function(module, exports, __webpack_require__) {
  var ClientRequest = __webpack_require__(5), response = __webpack_require__(2), extend = __webpack_require__(10), statusCodes = __webpack_require__(11), url = __webpack_require__(12), http = exports;
  http.request = function(opts, cb) {
    opts = "string" == typeof opts ? url.parse(opts) : extend(opts);
    var defaultProtocol = -1 === global.location.protocol.search(/^https?:$/) ? "http:" : "", protocol = opts.protocol || defaultProtocol, host = opts.hostname || opts.host, port = opts.port, path = opts.path || "/";
    host && -1 !== host.indexOf(":") && (host = "[" + host + "]"), opts.url = (host ? protocol + "//" + host : "") + (port ? ":" + port : "") + path, 
    opts.method = (opts.method || "GET").toUpperCase(), opts.headers = opts.headers || {};
    var req = new ClientRequest(opts);
    return cb && req.on("response", cb), req;
  }, http.get = function(opts, cb) {
    var req = http.request(opts, cb);
    return req.end(), req;
  }, http.ClientRequest = ClientRequest, http.IncomingMessage = response.IncomingMessage, 
  http.Agent = function() {}, http.Agent.defaultMaxSockets = 4, http.globalAgent = new http.Agent, 
  http.STATUS_CODES = statusCodes, http.METHODS = [ "CHECKOUT", "CONNECT", "COPY", "DELETE", "GET", "HEAD", "LOCK", "M-SEARCH", "MERGE", "MKACTIVITY", "MKCOL", "MOVE", "NOTIFY", "OPTIONS", "PATCH", "POST", "PROPFIND", "PROPPATCH", "PURGE", "PUT", "REPORT", "SEARCH", "SUBSCRIBE", "TRACE", "UNLOCK", "UNSUBSCRIBE" ];
}, function(module, exports, __webpack_require__) {
  var capability = __webpack_require__(0), inherits = __webpack_require__(1), response = __webpack_require__(2), stream = __webpack_require__(3), toArrayBuffer = __webpack_require__(8), IncomingMessage = response.IncomingMessage, rStates = response.readyStates;
  var ClientRequest = module.exports = function(opts) {
    var preferBinary, self = this;
    stream.Writable.call(self), self._opts = opts, self._body = [], self._headers = {}, 
    opts.auth && self.setHeader("Authorization", "Basic " + new Buffer(opts.auth).toString("base64")), 
    Object.keys(opts.headers).forEach((function(name) {
      self.setHeader(name, opts.headers[name]);
    }));
    var useFetch = !0;
    if ("disable-fetch" === opts.mode || "requestTimeout" in opts && !capability.abortController) useFetch = !1, 
    preferBinary = !0; else if ("prefer-streaming" === opts.mode) preferBinary = !1; else if ("allow-wrong-content-type" === opts.mode) preferBinary = !capability.overrideMimeType; else {
      if (opts.mode && "default" !== opts.mode && "prefer-fast" !== opts.mode) throw new Error("Invalid value for opts.mode");
      preferBinary = !0;
    }
    self._mode = function(preferBinary, useFetch) {
      return capability.fetch && useFetch ? "fetch" : capability.mozchunkedarraybuffer ? "moz-chunked-arraybuffer" : capability.msstream ? "ms-stream" : capability.arraybuffer && preferBinary ? "arraybuffer" : capability.vbArray && preferBinary ? "text:vbarray" : "text";
    }(preferBinary, useFetch), self._fetchTimer = null, self.on("finish", (function() {
      self._onFinish();
    }));
  };
  inherits(ClientRequest, stream.Writable), ClientRequest.prototype.setHeader = function(name, value) {
    var lowerName = name.toLowerCase();
    -1 === unsafeHeaders.indexOf(lowerName) && (this._headers[lowerName] = {
      name: name,
      value: value
    });
  }, ClientRequest.prototype.getHeader = function(name) {
    var header = this._headers[name.toLowerCase()];
    return header ? header.value : null;
  }, ClientRequest.prototype.removeHeader = function(name) {
    delete this._headers[name.toLowerCase()];
  }, ClientRequest.prototype._onFinish = function() {
    var self = this;
    if (!self._destroyed) {
      var opts = self._opts, headersObj = self._headers, body = null;
      "GET" !== opts.method && "HEAD" !== opts.method && (body = capability.arraybuffer ? toArrayBuffer(Buffer.concat(self._body)) : capability.blobConstructor ? new global.Blob(self._body.map((function(buffer) {
        return toArrayBuffer(buffer);
      })), {
        type: (headersObj["content-type"] || {}).value || ""
      }) : Buffer.concat(self._body).toString());
      var headersList = [];
      if (Object.keys(headersObj).forEach((function(keyName) {
        var name = headersObj[keyName].name, value = headersObj[keyName].value;
        Array.isArray(value) ? value.forEach((function(v) {
          headersList.push([ name, v ]);
        })) : headersList.push([ name, value ]);
      })), "fetch" === self._mode) {
        var signal = null;
        if (capability.abortController) {
          var controller = new AbortController;
          signal = controller.signal, self._fetchAbortController = controller, "requestTimeout" in opts && 0 !== opts.requestTimeout && (self._fetchTimer = global.setTimeout((function() {
            self.emit("requestTimeout"), self._fetchAbortController && self._fetchAbortController.abort();
          }), opts.requestTimeout));
        }
        global.fetch(self._opts.url, {
          method: self._opts.method,
          headers: headersList,
          body: body || void 0,
          mode: "cors",
          credentials: opts.withCredentials ? "include" : "same-origin",
          signal: signal
        }).then((function(response) {
          self._fetchResponse = response, self._connect();
        }), (function(reason) {
          global.clearTimeout(self._fetchTimer), self._destroyed || self.emit("error", reason);
        }));
      } else {
        var xhr = self._xhr = new global.XMLHttpRequest;
        try {
          xhr.open(self._opts.method, self._opts.url, !0);
        } catch (err) {
          return void process.nextTick((function() {
            self.emit("error", err);
          }));
        }
        "responseType" in xhr && (xhr.responseType = self._mode.split(":")[0]), "withCredentials" in xhr && (xhr.withCredentials = !!opts.withCredentials), 
        "text" === self._mode && "overrideMimeType" in xhr && xhr.overrideMimeType("text/plain; charset=x-user-defined"), 
        "requestTimeout" in opts && (xhr.timeout = opts.requestTimeout, xhr.ontimeout = function() {
          self.emit("requestTimeout");
        }), headersList.forEach((function(header) {
          xhr.setRequestHeader(header[0], header[1]);
        })), self._response = null, xhr.onreadystatechange = function() {
          switch (xhr.readyState) {
           case rStates.LOADING:
           case rStates.DONE:
            self._onXHRProgress();
          }
        }, "moz-chunked-arraybuffer" === self._mode && (xhr.onprogress = function() {
          self._onXHRProgress();
        }), xhr.onerror = function() {
          self._destroyed || self.emit("error", new Error("XHR error"));
        };
        try {
          xhr.send(body);
        } catch (err) {
          return void process.nextTick((function() {
            self.emit("error", err);
          }));
        }
      }
    }
  }, ClientRequest.prototype._onXHRProgress = function() {
    (function(xhr) {
      try {
        var status = xhr.status;
        return null !== status && 0 !== status;
      } catch (e) {
        return !1;
      }
    })(this._xhr) && !this._destroyed && (this._response || this._connect(), this._response._onXHRProgress());
  }, ClientRequest.prototype._connect = function() {
    var self = this;
    self._destroyed || (self._response = new IncomingMessage(self._xhr, self._fetchResponse, self._mode, self._fetchTimer), 
    self._response.on("error", (function(err) {
      self.emit("error", err);
    })), self.emit("response", self._response));
  }, ClientRequest.prototype._write = function(chunk, encoding, cb) {
    this._body.push(chunk), cb();
  }, ClientRequest.prototype.abort = ClientRequest.prototype.destroy = function() {
    this._destroyed = !0, global.clearTimeout(this._fetchTimer), this._response && (this._response._destroyed = !0), 
    this._xhr ? this._xhr.abort() : this._fetchAbortController && this._fetchAbortController.abort();
  }, ClientRequest.prototype.end = function(data, encoding, cb) {
    "function" == typeof data && (cb = data, data = void 0), stream.Writable.prototype.end.call(this, data, encoding, cb);
  }, ClientRequest.prototype.flushHeaders = function() {}, ClientRequest.prototype.setTimeout = function() {}, 
  ClientRequest.prototype.setNoDelay = function() {}, ClientRequest.prototype.setSocketKeepAlive = function() {};
  var unsafeHeaders = [ "accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "date", "dnt", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "via" ];
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports) {
  "function" == typeof Object.create ? module.exports = function(ctor, superCtor) {
    ctor.super_ = superCtor, ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    });
  } : module.exports = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    var TempCtor = function() {};
    TempCtor.prototype = superCtor.prototype, ctor.prototype = new TempCtor, ctor.prototype.constructor = ctor;
  };
}, function(module, exports, __webpack_require__) {
  var Buffer = __webpack_require__(9).Buffer;
  module.exports = function(buf) {
    if (buf instanceof Uint8Array) {
      if (0 === buf.byteOffset && buf.byteLength === buf.buffer.byteLength) return buf.buffer;
      if ("function" == typeof buf.buffer.slice) return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    if (Buffer.isBuffer(buf)) {
      for (var arrayCopy = new Uint8Array(buf.length), len = buf.length, i = 0; i < len; i++) arrayCopy[i] = buf[i];
      return arrayCopy.buffer;
    }
    throw new Error("Argument must be a Buffer");
  };
}, function(module, exports) {
  module.exports = require("buffer");
}, function(module, exports) {
  module.exports = function() {
    for (var target = {}, i = 0; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) hasOwnProperty.call(source, key) && (target[key] = source[key]);
    }
    return target;
  };
  var hasOwnProperty = Object.prototype.hasOwnProperty;
}, function(module, exports) {
  module.exports = {
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-Authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi-Status",
    208: "Already Reported",
    226: "IM Used",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    425: "Unordered Collection",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    509: "Bandwidth Limit Exceeded",
    510: "Not Extended",
    511: "Network Authentication Required"
  };
}, function(module, exports) {
  module.exports = require("url");
} ]);
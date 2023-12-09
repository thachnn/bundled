"use strict";
var scope = "undefined" != typeof global && global || "undefined" != typeof self && self || window, apply = Function.prototype.apply;

function Timeout(id, clearFn) {
  this._id = id, this._clearFn = clearFn;
}

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
}, exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
}, exports.clearTimeout = exports.clearInterval = function(timeout) {
  timeout && timeout.close();
}, Timeout.prototype.unref = Timeout.prototype.ref = function() {}, Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
}, exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId), item._idleTimeout = msecs;
}, exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId), item._idleTimeout = -1;
}, exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;
  msecs >= 0 && (item._idleTimeoutId = setTimeout((function() {
    item._onTimeout && item._onTimeout();
  }), msecs));
}, function(global, undefined) {
  if (!global.setImmediate) {
    var registerImmediate, html, channel, messagePrefix, onGlobalMessage, nextHandle = 1, tasksByHandle = {}, currentlyRunningATask = !1, doc = global.document, attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global, "[object process]" === {}.toString.call(global.process) ? registerImmediate = function(handle) {
      process.nextTick((function() {
        runIfPresent(handle);
      }));
    } : !function() {
      if (global.postMessage && !global.importScripts) {
        var postMessageIsAsynchronous = !0, oldOnMessage = global.onmessage;
        return global.onmessage = function() {
          postMessageIsAsynchronous = !1;
        }, global.postMessage("", "*"), global.onmessage = oldOnMessage, postMessageIsAsynchronous;
      }
    }() ? global.MessageChannel ? ((channel = new MessageChannel).port1.onmessage = function(event) {
      runIfPresent(event.data);
    }, registerImmediate = function(handle) {
      channel.port2.postMessage(handle);
    }) : doc && "onreadystatechange" in doc.createElement("script") ? (html = doc.documentElement, 
    registerImmediate = function(handle) {
      var script = doc.createElement("script");
      script.onreadystatechange = function() {
        runIfPresent(handle), script.onreadystatechange = null, html.removeChild(script), 
        script = null;
      }, html.appendChild(script);
    }) : registerImmediate = function(handle) {
      setTimeout(runIfPresent, 0, handle);
    } : (messagePrefix = "setImmediate$" + Math.random() + "$", onGlobalMessage = function(event) {
      event.source === global && "string" == typeof event.data && 0 === event.data.indexOf(messagePrefix) && runIfPresent(+event.data.slice(messagePrefix.length));
    }, global.addEventListener ? global.addEventListener("message", onGlobalMessage, !1) : global.attachEvent("onmessage", onGlobalMessage), 
    registerImmediate = function(handle) {
      global.postMessage(messagePrefix + handle, "*");
    }), attachTo.setImmediate = function(callback) {
      "function" != typeof callback && (callback = new Function("" + callback));
      for (var args = new Array(arguments.length - 1), i = 0; i < args.length; i++) args[i] = arguments[i + 1];
      var task = {
        callback: callback,
        args: args
      };
      return tasksByHandle[nextHandle] = task, registerImmediate(nextHandle), nextHandle++;
    }, attachTo.clearImmediate = clearImmediate;
  }
  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }
  function runIfPresent(handle) {
    if (currentlyRunningATask) setTimeout(runIfPresent, 0, handle); else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunningATask = !0;
        try {
          !function(task) {
            var callback = task.callback, args = task.args;
            switch (args.length) {
             case 0:
              callback();
              break;

             case 1:
              callback(args[0]);
              break;

             case 2:
              callback(args[0], args[1]);
              break;

             case 3:
              callback(args[0], args[1], args[2]);
              break;

             default:
              callback.apply(void 0, args);
            }
          }(task);
        } finally {
          clearImmediate(handle), currentlyRunningATask = !1;
        }
      }
    }
  }
}("undefined" == typeof self ? "undefined" == typeof global ? this : global : self), 
exports.setImmediate = "undefined" != typeof self && self.setImmediate || "undefined" != typeof global && global.setImmediate || this && this.setImmediate, 
exports.clearImmediate = "undefined" != typeof self && self.clearImmediate || "undefined" != typeof global && global.clearImmediate || this && this.clearImmediate;
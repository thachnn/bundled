"use strict";

var scope =
  (typeof global != "undefined" && global) ||
  (typeof self != "undefined" && self) ||
  window;
var apply = Function.prototype.apply;

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function(timeout) {
  timeout && timeout.close();
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0)
    item._idleTimeoutId = setTimeout(function() {
      item._onTimeout && item._onTimeout();
    }, msecs);
};

!(function(global, undefined) {
  if (global.setImmediate) return;

  var registerImmediate,
    nextHandle = 1,
    tasksByHandle = {},
    currentlyRunningATask = false,
    doc = global.document;

  function setImmediate(callback) {
    if (typeof callback != "function") callback = new Function("" + callback);

    var args = [].slice.call(arguments, 1);

    tasksByHandle[nextHandle] = { callback: callback, args: args };
    registerImmediate(nextHandle);
    return nextHandle++;
  }

  function clearImmediate(handle) {
    delete tasksByHandle[handle];
  }

  function run(task) {
    var callback = task.callback,
      args = task.args;
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
      callback.apply(undefined, args);
      break;
    }
  }

  function runIfPresent(handle) {
    if (currentlyRunningATask) setTimeout(runIfPresent, 0, handle);
    else {
      var task = tasksByHandle[handle];
      if (task) {
        currentlyRunningATask = true;
        try {
          run(task);
        } finally {
          clearImmediate(handle);
          currentlyRunningATask = false;
        }
      }
    }
  }

  function installNextTickImplementation() {
    registerImmediate = function(handle) {
      process.nextTick(function() { runIfPresent(handle); });
    };
  }

  function canUsePostMessage() {
    if (!global.postMessage || global.importScripts) return;
    var postMessageIsAsynchronous = true,
      oldOnMessage = global.onmessage;
    global.onmessage = function() {
      postMessageIsAsynchronous = false;
    };
    global.postMessage("", "*");
    global.onmessage = oldOnMessage;
    return postMessageIsAsynchronous;
  }

  function installPostMessageImplementation() {
    var messagePrefix = "setImmediate$" + Math.random() + "$";
    var onGlobalMessage = function(event) {
      event.source === global &&
        typeof event.data == "string" &&
        event.data.indexOf(messagePrefix) === 0 &&
        runIfPresent(+event.data.slice(messagePrefix.length));
    };

    global.addEventListener
      ? global.addEventListener("message", onGlobalMessage, false)
      : global.attachEvent("onmessage", onGlobalMessage);

    registerImmediate = function(handle) {
      global.postMessage(messagePrefix + handle, "*");
    };
  }

  function installMessageChannelImplementation() {
    var channel = new MessageChannel();
    channel.port1.onmessage = function(event) {
      runIfPresent(event.data);
    };

    registerImmediate = function(handle) {
      channel.port2.postMessage(handle);
    };
  }

  function installReadyStateChangeImplementation() {
    var html = doc.documentElement;
    registerImmediate = function(handle) {
      var script = doc.createElement("script");
      script.onreadystatechange = function() {
        runIfPresent(handle);
        script.onreadystatechange = null;
        html.removeChild(script);
        script = null;
      };
      html.appendChild(script);
    };
  }

  function installSetTimeoutImplementation() {
    registerImmediate = function(handle) {
      setTimeout(runIfPresent, 0, handle);
    };
  }

  var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
  (attachTo && attachTo.setTimeout) || (attachTo = global);

  ({}).toString.call(global.process) === "[object process]"
    ? installNextTickImplementation()
    : canUsePostMessage()
    ? installPostMessageImplementation()
    : global.MessageChannel
    ? installMessageChannelImplementation()
    : doc && "onreadystatechange" in doc.createElement("script")
    ? installReadyStateChangeImplementation()
    : installSetTimeoutImplementation();

  attachTo.setImmediate = setImmediate;
  attachTo.clearImmediate = clearImmediate;
})(typeof self != "undefined" ? self : typeof global == "undefined" ? this : global);

exports.setImmediate =
  (typeof self != "undefined" && self.setImmediate) ||
  (typeof global != "undefined" && global.setImmediate) ||
  (this && this.setImmediate);
exports.clearImmediate =
  (typeof self != "undefined" && self.clearImmediate) ||
  (typeof global != "undefined" && global.clearImmediate) ||
  (this && this.clearImmediate);

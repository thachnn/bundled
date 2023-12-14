var cachedSetTimeout, cachedClearTimeout,

  process = (module.exports = {});

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
!(function () {
  try {
    cachedSetTimeout = typeof setTimeout == 'function' ? setTimeout : defaultSetTimout;
  } catch (_) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    cachedClearTimeout = typeof clearTimeout == 'function' ? clearTimeout : defaultClearTimeout;
  } catch (_) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);

  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (_) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (_) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);

  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (_) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (_) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var currentQueue,
  queue = [],
  draining = false,
  queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) return;

  draining = false;
  currentQueue.length ? (queue = currentQueue.concat(queue)) : (queueIndex = -1);

  queue.length && drainQueue();
}

function drainQueue() {
  if (draining) return;

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;

  for (var len = queue.length; len; ) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();

    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = Array.prototype.slice.call(arguments, 1);

  queue.push(new Item(fun, args));
  queue.length !== 1 || draining || runTimeout(drainQueue);
};

function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = '';
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return []; };

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/'; };
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () { return 0; };

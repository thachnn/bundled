var indexOf = function (xs, item) {
  if (xs.indexOf) return xs.indexOf(item);
  for (var i = 0; i < xs.length; i++) if (xs[i] === item) return i;

  return -1;
};
var Object_keys = function (obj) {
  if (Object.keys) return Object.keys(obj);

  var res = [];
  for (var key in obj) res.push(key);
  return res;
};

var forEach = function (xs, fn) {
  if (xs.forEach) return xs.forEach(fn);
  for (var i = 0; i < xs.length; i++) fn(xs[i], i, xs);
};

var defineProp = (function () {
  try {
    Object.defineProperty({}, '_', {});
    return function (obj, name, value) {
      Object.defineProperty(obj, name, {
        writable: true,
        enumerable: false,
        configurable: true,
        value: value
      });
    };
  } catch (_e) {
    return function (obj, name, value) {
      obj[name] = value;
    };
  }
})();

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = (exports.Script = function (code) {
  if (!(this instanceof Script)) return new Script(code);
  this.code = code;
});

Script.prototype.runInContext = function (context) {
  if (!(context instanceof Context))
    throw new TypeError("needs a 'context' argument.");

  var iframe = document.createElement('iframe');
  iframe.style || (iframe.style = {});
  iframe.style.display = 'none';

  document.body.appendChild(iframe);

  var win = iframe.contentWindow,
    wEval = win.eval, wExecScript = win.execScript;

  if (!wEval && wExecScript) {
    wExecScript.call(win, 'null');
    wEval = win.eval;
  }

  forEach(Object_keys(context), function (key) {
    win[key] = context[key];
  });
  forEach(globals, function (key) {
    if (context[key]) win[key] = context[key];
  });

  var winKeys = Object_keys(win),

    res = wEval.call(win, this.code);

  forEach(Object_keys(win), function (key) {
    if (key in context || indexOf(winKeys, key) === -1) context[key] = win[key];
  });

  forEach(globals, function (key) {
    key in context || defineProp(context, key, win[key]);
  });

  document.body.removeChild(iframe);

  return res;
};

Script.prototype.runInThisContext = function () {
  return eval(this.code);
};

Script.prototype.runInNewContext = function (context) {
  var ctx = Script.createContext(context),
    res = this.runInContext(ctx);

  context &&
    forEach(Object_keys(ctx), function (key) {
      context[key] = ctx[key];
    });

  return res;
};

forEach(Object_keys(Script.prototype), function (name) {
  exports[name] = Script[name] = function (code) {
    var s = Script(code);
    return s[name].apply(s, [].slice.call(arguments, 1));
  };
});

exports.isContext = function (context) {
  return context instanceof Context;
};

exports.createScript = function (code) {
  return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
  var copy = new Context();
  typeof context != 'object' ||
    forEach(Object_keys(context), function (key) {
      copy[key] = context[key];
    });

  return copy;
};

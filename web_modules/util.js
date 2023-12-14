var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors || function(obj) {
  var keys = Object.keys(obj),
    descriptors = {};
  for (var i = 0; i < keys.length; i++)
    descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);

  return descriptors;
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  var i,
    args = arguments,
    len = args.length;
  if (!isString(f)) {
    var objects = [];
    for (i = 0; i < len; i++) objects.push(inspect(args[i]));

    return objects.join(' ');
  }

  i = 1;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i])
    str += isNull(x) || !isObject(x) ? ' ' + x : ' ' + inspect(x);

  return str;
};

exports.deprecate = function(fn, msg) {
  if (typeof process != 'undefined' && process.noDeprecation === true) return fn;

  if (typeof process == 'undefined')
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) throw new Error(msg);
      process.traceDeprecation ? console.trace(msg) : console.error(msg);

      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};

var debugEnviron,
  debugs = {};
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron)) debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set])
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else debugs[set] = function() {};

  return debugs[set];
};

function inspect(obj, opts) {
  var ctx = { seen: [], stylize: stylizeNoColor };
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  isBoolean(opts) ? (ctx.showHidden = opts) : opts && exports._extend(ctx, opts);

  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;

inspect.colors = {
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  white: [37, 39],
  grey: [90, 39],
  black: [30, 39],
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39]
};

inspect.styles = {
  special: 'cyan',
  number: 'yellow',
  boolean: 'yellow',
  undefined: 'grey',
  null: 'bold',
  string: 'green',
  date: 'magenta',
  regexp: 'red'
};

function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  return style
    ? '\x1b[' + inspect.colors[style][0] + 'm' + str +
      '\x1b[' + inspect.colors[style][1] + 'm'
    : str;
}

function stylizeNoColor(str, styleType) {
  return str;
}

function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val) {
    hash[val] = true;
  });

  return hash;
}

function formatValue(ctx, value, recurseTimes) {
  if (
    ctx.customInspect &&
    value &&
    isFunction(value.inspect) &&
    value.inspect !== exports.inspect &&
    (!value.constructor || value.constructor.prototype !== value)
  ) {
    var ret = value.inspect(recurseTimes, ctx);
    isString(ret) || (ret = formatValue(ctx, ret, recurseTimes));

    return ret;
  }

  var primitive = formatPrimitive(ctx, value);
  if (primitive) return primitive;

  var keys = Object.keys(value),
    visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) keys = Object.getOwnPropertyNames(value);

  if (isError(value) && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0))
    return formatError(value);

  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value))
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');

    if (isDate(value))
      return ctx.stylize(Date.prototype.toString.call(value), 'date');

    if (isError(value)) return formatError(value);
  }

  var base = '', array = false, braces = ['{', '}'];

  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  if (isFunction(value))
    base = ' [Function' + (value.name ? ': ' + value.name : '') + ']';

  if (isRegExp(value)) base = ' ' + RegExp.prototype.toString.call(value);

  if (isDate(value)) base = ' ' + Date.prototype.toUTCString.call(value);

  if (isError(value)) base = ' ' + formatError(value);

  if (keys.length === 0 && (!array || value.length == 0))
    return braces[0] + base + braces[1];

  if (recurseTimes < 0)
    return isRegExp(value)
      ? ctx.stylize(RegExp.prototype.toString.call(value), 'regexp')
      : ctx.stylize('[Object]', 'special');

  ctx.seen.push(value);

  var output = array
    ? formatArray(ctx, value, recurseTimes, visibleKeys, keys)
    : keys.map(function(key) {
        return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
      });

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}

function formatPrimitive(ctx, value) {
  if (isUndefined(value)) return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = "'" +
      JSON.stringify(value)
        .replace(/^"|"$/g, '')
        .replace(/'/g, "\\'")
        .replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, 'string');
  }
  return isNumber(value)
    ? ctx.stylize('' + value, 'number')
    : isBoolean(value)
    ? ctx.stylize('' + value, 'boolean')
    : isNull(value)
    ? ctx.stylize('null', 'null') : void 0;
}

function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}

function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i)
    hasOwnProperty(value, String(i))
      ? output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true))
      : output.push('');

  keys.forEach(function(key) {
    key.match(/^\d+$/) ||
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
  });
  return output;
}

function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get)
    str = desc.set
      ? ctx.stylize('[Getter/Setter]', 'special')
      : ctx.stylize('[Getter]', 'special');
  else if (desc.set) str = ctx.stylize('[Setter]', 'special');

  hasOwnProperty(visibleKeys, key) || (name = '[' + key + ']');

  if (!str)
    if (ctx.seen.indexOf(desc.value) < 0) {
      str = isNull(recurseTimes)
        ? formatValue(ctx, desc.value, null)
        : formatValue(ctx, desc.value, recurseTimes - 1);

      if (str.indexOf('\n') >= 0)
        str = array
          ? str.split('\n').map(function(line) {
              return '  ' + line;
            }).join('\n').substr(2)
          : '\n' + str.split('\n').map(function(line) {
              return '   ' + line;
            }).join('\n');
    } else str = ctx.stylize('[Circular]', 'special');

  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) return str;

    if ((name = JSON.stringify('' + key)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}

function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    cur.indexOf('\n') < 0 || numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  return length > 60
    ? braces[0] +
      (base === '' ? '' : base + '\n ') +
      ' ' +
      output.join(',\n  ') +
      ' ' +
      braces[1]
    : braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}

function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg == 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg == 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg == 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg == 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg == 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) && (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg == 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
    typeof arg == 'boolean' ||
    typeof arg == 'number' ||
    typeof arg == 'string' ||
    typeof arg == 'symbol' ||
    arg === void 0;
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = function(arg) {
  return arg && typeof arg == 'object' &&
    typeof arg.copy == 'function' &&
    typeof arg.fill == 'function' &&
    typeof arg.readUInt8 == 'function';
};

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months =
  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function timestamp() {
  var d = new Date(),
    time = [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};

try {
  exports.inherits = require('util').inherits;
  if (typeof exports.inherits != 'function') throw '';
} catch (_) {
  if (typeof Object.create == 'function')
    exports.inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    };
  else
    exports.inherits = function(ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function() {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    };
}

exports._extend = function(origin, add) {
  if (!add || !isObject(add)) return origin;

  for (var keys = Object.keys(add), i = keys.length; i--; )
    origin[keys[i]] = add[keys[i]];

  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

var kCustomPromisifiedSymbol =
  typeof Symbol != 'undefined' ? Symbol('util.promisify.custom') : void 0;

exports.promisify = function(original) {
  if (typeof original != 'function')
    throw new TypeError('The "original" argument must be of type Function');

  if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
    var fn = original[kCustomPromisifiedSymbol];
    if (typeof fn != 'function')
      throw new TypeError('The "util.promisify.custom" argument must be of type Function');

    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
    return fn;
  }

  function fn() {
    var args = Array.prototype.slice.call(arguments),
      self = this;

    return new Promise(function(resolve, reject) {
      args.push(function(err, value) {
        err ? reject(err) : resolve(value);
      });

      try {
        original.apply(self, args);
      } catch (err) {
        reject(err);
      }
    });
  }

  Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

  kCustomPromisifiedSymbol &&
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
      value: fn, enumerable: false, writable: false, configurable: true
    });
  return Object.defineProperties(fn, getOwnPropertyDescriptors(original));
};

exports.promisify.custom = kCustomPromisifiedSymbol;

function callbackifyOnRejected(reason, cb) {
  if (!reason) {
    var newReason = new Error('Promise was rejected with a falsy value');
    newReason.reason = reason;
    reason = newReason;
  }
  return cb(reason);
}

function callbackify(original) {
  if (typeof original != 'function')
    throw new TypeError('The "original" argument must be of type Function');

  function callbackified() {
    var args = Array.prototype.slice.call(arguments),

      maybeCb = args.pop();
    if (typeof maybeCb != 'function')
      throw new TypeError('The last argument must be of type Function');

    var self = this;
    var cb = function() {
      return maybeCb.apply(self, arguments);
    };
    original.apply(this, args).then(
      function(ret) { process.nextTick(cb, null, ret); },
      function(rej) { process.nextTick(callbackifyOnRejected, rej, cb); }
    );
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
  Object.defineProperties(callbackified, getOwnPropertyDescriptors(original));
  return callbackified;
}
exports.callbackify = callbackify;

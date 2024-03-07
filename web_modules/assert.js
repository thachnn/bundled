'use strict';

var util = require('./util'),

  getOwnPropertySymbols = Object.getOwnPropertySymbols,
  hasOwnProperty = Object.prototype.hasOwnProperty,
  propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
  if (val === null || val === void 0)
    throw new TypeError('Object.assign cannot be called with null or undefined');

  return Object(val);
}

function shouldUseNative() {
  try {
    if (!Object.assign) return false;

    // noinspection JSPrimitiveTypeWrapperUsage
    var test1 = new String('abc');
    test1[5] = 'de';
    if (Object.getOwnPropertyNames(test1)[0] === '5') return false;

    var test2 = {};
    for (var i = 0; i < 10; i++) test2['_' + String.fromCharCode(i)] = i;

    if (
      Object.getOwnPropertyNames(test2).map(function (n) {
        return test2[n];
      }).join('') !== '0123456789'
    )
      return false;

    var test3 = {};
    'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
      test3[letter] = letter;
    });
    return Object.keys(Object.assign({}, test3)).join('') === 'abcdefghijklmnopqrst';
  } catch (_) {
    return false;
  }
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  var to = toObject(target);

  for (var from, symbols, s = 1; s < arguments.length; s++) {
    from = Object(arguments[s]);

    for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];

    if (getOwnPropertySymbols) {
      symbols = getOwnPropertySymbols(from);
      for (var i = 0; i < symbols.length; i++)
        if (propIsEnumerable.call(from, symbols[i]))
          to[symbols[i]] = from[symbols[i]];
    }
  }

  return to;
};

function compare(a, b) {
  if (a === b) return 0;

  var x = a.length,
    y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i)
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }

  return x < y ? -1 : y < x ? 1 : 0;
}
function isBuffer(b) {
  return global.Buffer && typeof global.Buffer.isBuffer == 'function'
    ? global.Buffer.isBuffer(b)
    : b != null && !!b._isBuffer;
}

var hasOwn = Object.prototype.hasOwnProperty,
  pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
})();
function pToString(obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  return !isBuffer(arrbuf) && typeof global.ArrayBuffer == 'function' &&

    (typeof ArrayBuffer.isView == 'function'
      ? ArrayBuffer.isView(arrbuf)
      : !!arrbuf &&
        (arrbuf instanceof DataView ||
        !!(arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer)));
}

var assert = (module.exports = ok),

  regex = /\s*function\s+([^(\s]*)\s*/;
function getName(func) {
  if (!util.isFunction(func)) return;

  if (functionsHaveNames) return func.name;

  var match = func.toString().match(regex);
  return match && match[1];
}
assert.AssertionError = function (options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var err,
    stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) Error.captureStackTrace(this, stackStartFunction);
  else if ((err = new Error()).stack) {
    var out = err.stack,

      fn_name = getName(stackStartFunction),
      idx = out.indexOf('\n' + fn_name);
    if (idx >= 0) {
      var next_line = out.indexOf('\n', idx + 1);
      out = out.substring(next_line + 1);
    }

    this.stack = out;
  }
};

util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  return typeof s == 'string' ? (s.length < n ? s : s.slice(0, n)) : s;
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something))
    return util.inspect(something);

  var rawname = getName(something);
  return '[Function' + (rawname ? ': ' + rawname : '') + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
    self.operator + ' ' +
    truncate(inspect(self.expected), 128);
}

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

assert.fail = fail;

function ok(value, message) {
  value || fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

assert.equal = function (actual, expected, message) {
  actual == expected || fail(actual, expected, message, '==', assert.equal);
};

assert.notEqual = function (actual, expected, message) {
  actual != expected || fail(actual, expected, message, '!=', assert.notEqual);
};

assert.deepEqual = function (actual, expected, message) {
  _deepEqual(actual, expected, false) ||
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
};

assert.deepStrictEqual = function (actual, expected, message) {
  _deepEqual(actual, expected, true) ||
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
};

function _deepEqual(actual, expected, strict, memos) {
  if (actual === expected) return true;
  if (isBuffer(actual) && isBuffer(expected))
    return compare(actual, expected) === 0;

  if (util.isDate(actual) && util.isDate(expected))
    return actual.getTime() === expected.getTime();

  if (util.isRegExp(actual) && util.isRegExp(expected))
    return actual.source === expected.source &&
      actual.global === expected.global &&
      actual.multiline === expected.multiline &&
      actual.lastIndex === expected.lastIndex &&
      actual.ignoreCase === expected.ignoreCase;

  if ((actual === null || typeof actual != 'object') &&
      (expected === null || typeof expected != 'object'))
    return strict ? actual === expected : actual == expected;

  if (isView(actual) && isView(expected) &&
      pToString(actual) === pToString(expected) &&
      !(actual instanceof Float32Array || actual instanceof Float64Array))
    return (
      compare(new Uint8Array(actual.buffer), new Uint8Array(expected.buffer)) === 0
    );

  if (isBuffer(actual) !== isBuffer(expected)) return false;

  memos || (memos = {actual: [], expected: []});

  var actualIndex = memos.actual.indexOf(actual);
  if (actualIndex !== -1 && actualIndex === memos.expected.indexOf(expected))
    return true;

  memos.actual.push(actual);
  memos.expected.push(expected);

  return objEquiv(actual, expected, strict, memos);
}

function isArguments(object) {
  return pToString(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === void 0 || b === null || b === void 0) return false;
  if (util.isPrimitive(a) || util.isPrimitive(b)) return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a),
    bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) return false;
  if (aIsArgs) return _deepEqual(pSlice.call(a), pSlice.call(b), strict);

  var key, i,
    ka = objectKeys(a),
    kb = objectKeys(b);
  if (ka.length !== kb.length) return false;
  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) if (ka[i] !== kb[i]) return false;

  for (i = ka.length - 1; i >= 0; i--)
    if (!_deepEqual(a[(key = ka[i])], b[key], strict, actualVisitedObjects))
      return false;

  return true;
}

assert.notDeepEqual = function (actual, expected, message) {
  _deepEqual(actual, expected, false) &&
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  _deepEqual(actual, expected, true) &&
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
}

assert.strictEqual = function (actual, expected, message) {
  actual === expected ||
    fail(actual, expected, message, '===', assert.strictEqual);
};

assert.notStrictEqual = function (actual, expected, message) {
  actual !== expected ||
    fail(actual, expected, message, '!==', assert.notStrictEqual);
};

function expectedException(actual, expected) {
  if (!actual || !expected) return false;

  if (pToString(expected) == '[object RegExp]') return expected.test(actual);

  try {
    if (actual instanceof expected) return true;
  } catch (_) {}

  return !Error.isPrototypeOf(expected) && expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  if (typeof block != 'function')
    throw new TypeError('"block" argument must be a function');

  if (typeof expected == 'string') {
    message = expected;
    expected = null;
  }

  var actual = _tryBlock(block);

  message =
    (expected && expected.name ? ' (' + expected.name + ').' : '.') +
    (message ? ' ' + message : '.');

  !shouldThrow || actual ||
    fail(actual, expected, 'Missing expected exception' + message);

  ((shouldThrow || !util.isError(actual) ||
    typeof message != 'string' ||
    !expectedException(actual, expected)) &&
    (shouldThrow || !actual || expected)) ||
    fail(actual, expected, 'Got unwanted exception' + message);

  if ((shouldThrow && actual && expected && !expectedException(actual, expected)) ||
      (!shouldThrow && actual))
    throw actual;
}

assert.throws = function (block, error, message) {
  _throws(true, block, error, message);
};

assert.doesNotThrow = function (block, error, message) {
  _throws(false, block, error, message);
};

assert.ifError = function (err) { if (err) throw err; };

function strict(value, message) {
  value || fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) hasOwn.call(obj, key) && keys.push(key);

  return keys;
};

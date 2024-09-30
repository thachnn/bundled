"use strict";

module.exports = (function(modules) {
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
return __webpack_require__(7);
})([
// 0
function(module, exports, __webpack_require__) {

var Stream = __webpack_require__(9)

exports = module.exports = through
through.through = through

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end()
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}

},
// 1
function(module, exports, __webpack_require__) {

module.exports = function defined() {
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] !== 'undefined') {
			return arguments[i];
		}
	}
};

},
// 2
function(module, exports, __webpack_require__) {

var callBound = function (fn) { return Function.call.bind(fn); };
var hasToStringTag = typeof Symbol == 'function' && !!Symbol.toStringTag;
var has;
var $exec;
var isRegexMarker;
var badStringifier;

if (hasToStringTag) {
	has = callBound(Object.prototype.hasOwnProperty);
	$exec = callBound(RegExp.prototype.exec);
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = {
		toString: throwRegexMarker,
		valueOf: throwRegexMarker
	};

	if (typeof Symbol.toPrimitive === 'symbol') {
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
	}
}

var $toString = callBound(Object.prototype.toString);
var gOPD = Object.getOwnPropertyDescriptor;
var regexClass = '[object RegExp]';

module.exports = hasToStringTag
	? function isRegex(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}

		var descriptor = gOPD(value, 'lastIndex');
		var hasLastIndexDataProperty = descriptor && has(descriptor, 'value');
		if (!hasLastIndexDataProperty) {
			return false;
		}

		try {
			$exec(value, badStringifier);
		} catch (e) {
			return e === isRegexMarker;
		}
	}
	: function isRegex(value) {
		if (!value || (typeof value !== 'object' && typeof value !== 'function')) {
			return false;
		}

		return $toString(value) === regexClass;
	};

},
// 3
function(module, exports, __webpack_require__) {

try {
  var util = __webpack_require__(4);
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  module.exports = __webpack_require__(18);
}

},
// 4
function(module) {

module.exports = require("util");

},
// 5
function(module) {

module.exports = require("events");

},
// 6
function(module, exports, __webpack_require__) {

var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && typeof Symbol.iterator === 'object';
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? 'object' : 'symbol')
    ? Symbol.toStringTag
    : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || (
    [].__proto__ === Array.prototype
        ? function (O) {
            return O.__proto__;
        }
        : null
);

function addNumericSeparator(num, str) {
    if (
        num === Infinity
        || num === -Infinity
        || num !== num
        || (num && num > -1000 && num < 1000)
        || $test.call(/e/, str)
    ) {
        return str;
    }
    var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
    if (typeof num === 'number') {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
        }
    }
    return $replace.call(str, sepRegex, '$&_');
}

var utilInspect =  __webpack_require__(4).inspect;
;
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
    var opts = options || {};

    if (has(opts, 'quoteStyle') && (opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
    }
    if (
        has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number'
            ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
            : opts.maxStringLength !== null
        )
    ) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
    }
    var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
    if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
        throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
    }

    if (
        has(opts, 'indent')
        && opts.indent !== null
        && opts.indent !== '\t'
        && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
    ) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
    }
    if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
    }
    var numericSeparator = opts.numericSeparator;

    if (typeof obj === 'undefined') {
        return 'undefined';
    }
    if (obj === null) {
        return 'null';
    }
    if (typeof obj === 'boolean') {
        return obj ? 'true' : 'false';
    }

    if (typeof obj === 'string') {
        return inspectString(obj, opts);
    }
    if (typeof obj === 'number') {
        if (obj === 0) {
            return Infinity / obj > 0 ? '0' : '-0';
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
    }
    if (typeof obj === 'bigint') {
        var bigIntStr = String(obj) + 'n';
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
    }

    var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
    if (typeof depth === 'undefined') { depth = 0; }
    if (depth >= maxDepth && maxDepth > 0 && typeof obj === 'object') {
        return isArray(obj) ? '[Array]' : '[Object]';
    }

    var indent = getIndent(opts, depth);

    if (typeof seen === 'undefined') {
        seen = [];
    } else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }

    function inspect(value, from, noIndent) {
        if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
        }
        if (noIndent) {
            var newOpts = {
                depth: opts.depth
            };
            if (has(opts, 'quoteStyle')) {
                newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
    }

    if (typeof obj === 'function' && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
    }
    if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
        return typeof obj === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
    }
    if (isElement(obj)) {
        var s = '<' + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) { s += '...'; }
        s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
        return s;
    }
    if (isArray(obj)) {
        if (obj.length === 0) { return '[]'; }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
            return '[' + indentedJoin(xs, indent) + ']';
        }
        return '[ ' + $join.call(xs, ', ') + ' ]';
    }
    if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
            return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
        }
        if (parts.length === 0) { return '[' + String(obj) + ']'; }
        return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
    }
    if (typeof obj === 'object' && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
            return obj.inspect();
        }
    }
    if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
            mapForEach.call(obj, function (value, key) {
                mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
            });
        }
        return collectionOf('Map', mapSize.call(obj), mapParts, indent);
    }
    if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
            setForEach.call(obj, function (value) {
                setParts.push(inspect(value, obj));
            });
        }
        return collectionOf('Set', setSize.call(obj), setParts, indent);
    }
    if (isWeakMap(obj)) {
        return weakCollectionOf('WeakMap');
    }
    if (isWeakSet(obj)) {
        return weakCollectionOf('WeakSet');
    }
    if (isWeakRef(obj)) {
        return weakCollectionOf('WeakRef');
    }
    if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
    }
    if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
    }
    if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
    }
    if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
    }
    if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? '' : 'null prototype';
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
        var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
        var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
        if (ys.length === 0) { return tag + '{}'; }
        if (indent) {
            return tag + '{' + indentedJoin(ys, indent) + '}';
        }
        return tag + '{ ' + $join.call(ys, ', ') + ' }';
    }
    return String(obj);
};

function wrapQuotes(s, defaultStyle, opts) {
    var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
    return quoteChar + s + quoteChar;
}

function quote(s) {
    return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) { return toStr(obj) === '[object Array]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isDate(obj) { return toStr(obj) === '[object Date]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isRegExp(obj) { return toStr(obj) === '[object RegExp]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isError(obj) { return toStr(obj) === '[object Error]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isString(obj) { return toStr(obj) === '[object String]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isNumber(obj) { return toStr(obj) === '[object Number]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }
function isBoolean(obj) { return toStr(obj) === '[object Boolean]' && (!toStringTag || !(typeof obj === 'object' && toStringTag in obj)); }

function isSymbol(obj) {
    if (hasShammedSymbols) {
        return obj && typeof obj === 'object' && obj instanceof Symbol;
    }
    if (typeof obj === 'symbol') {
        return true;
    }
    if (!obj || typeof obj !== 'object' || !symToString) {
        return false;
    }
    try {
        symToString.call(obj);
        return true;
    } catch (e) {}
    return false;
}

function isBigInt(obj) {
    if (!obj || typeof obj !== 'object' || !bigIntValueOf) {
        return false;
    }
    try {
        bigIntValueOf.call(obj);
        return true;
    } catch (e) {}
    return false;
}

var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
function has(obj, key) {
    return hasOwn.call(obj, key);
}

function toStr(obj) {
    return objectToString.call(obj);
}

function nameOf(f) {
    if (f.name) { return f.name; }
    var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
    if (m) { return m[1]; }
    return null;
}

function indexOf(xs, x) {
    if (xs.indexOf) { return xs.indexOf(x); }
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) { return i; }
    }
    return -1;
}

function isMap(x) {
    if (!mapSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        mapSize.call(x);
        try {
            setSize.call(x);
        } catch (s) {
            return true;
        }
        return x instanceof Map;
    } catch (e) {}
    return false;
}

function isWeakMap(x) {
    if (!weakMapHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakMapHas.call(x, weakMapHas);
        try {
            weakSetHas.call(x, weakSetHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakMap;
    } catch (e) {}
    return false;
}

function isWeakRef(x) {
    if (!weakRefDeref || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakRefDeref.call(x);
        return true;
    } catch (e) {}
    return false;
}

function isSet(x) {
    if (!setSize || !x || typeof x !== 'object') {
        return false;
    }
    try {
        setSize.call(x);
        try {
            mapSize.call(x);
        } catch (m) {
            return true;
        }
        return x instanceof Set;
    } catch (e) {}
    return false;
}

function isWeakSet(x) {
    if (!weakSetHas || !x || typeof x !== 'object') {
        return false;
    }
    try {
        weakSetHas.call(x, weakSetHas);
        try {
            weakMapHas.call(x, weakMapHas);
        } catch (s) {
            return true;
        }
        return x instanceof WeakSet;
    } catch (e) {}
    return false;
}

function isElement(x) {
    if (!x || typeof x !== 'object') { return false; }
    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
        return true;
    }
    return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}

function inspectString(str, opts) {
    if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
    }
    var s = $replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte);
    return wrapQuotes(s, 'single', opts);
}

function lowbyte(c) {
    var n = c.charCodeAt(0);
    var x = {
        8: 'b',
        9: 't',
        10: 'n',
        12: 'f',
        13: 'r'
    }[n];
    if (x) { return '\\' + x; }
    return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
    return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
    return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
    var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
    return type + ' (' + size + ') {' + joinedEntries + '}';
}

function singleLineValues(xs) {
    for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], '\n') >= 0) {
            return false;
        }
    }
    return true;
}

function getIndent(opts, depth) {
    var baseIndent;
    if (opts.indent === '\t') {
        baseIndent = '\t';
    } else if (typeof opts.indent === 'number' && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), ' ');
    } else {
        return null;
    }
    return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
    };
}

function indentedJoin(xs, indent) {
    if (xs.length === 0) { return ''; }
    var lineJoiner = '\n' + indent.prev + indent.base;
    return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
    var isArr = isArray(obj);
    var xs = [];
    if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
    }
    var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
    var symMap;
    if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
            symMap['$' + syms[k]] = syms[k];
        }
    }

    for (var key in obj) {
        if (!has(obj, key)) { continue; }
        if (isArr && String(Number(key)) === key && key < obj.length) { continue; }
        if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
            continue;
        } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
        } else {
            xs.push(key + ': ' + inspect(obj[key], obj));
        }
    }
    if (typeof gOPS === 'function') {
        for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
                xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
            }
        }
    }
    return xs;
}

},
// 7
function(module, exports, __webpack_require__) {

var defined = __webpack_require__(1);
var createDefaultStream = __webpack_require__(8);
var Test = __webpack_require__(11);
var createResult = __webpack_require__(19);
var through = __webpack_require__(0);

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function';

module.exports = (function () {
	var harness;

	function getHarness(opts) {
		if (!opts) { opts = {}; }
		opts.autoclose = !canEmitExit;
		if (!harness) { harness = createExitHarness(opts); }
		return harness;
	}

	function lazyLoad() {
		return getHarness().apply(this, arguments);
	}

	lazyLoad.only = function () {
		return getHarness().only.apply(this, arguments);
	};

	lazyLoad.createStream = function (opts) {
		var options = opts || {};
		if (!harness) {
			var output = through();
			getHarness({ stream: output, objectMode: options.objectMode });
			return output;
		}
		return harness.createStream(options);
	};

	lazyLoad.onFinish = function () {
		return getHarness().onFinish.apply(this, arguments);
	};

	lazyLoad.onFailure = function () {
		return getHarness().onFailure.apply(this, arguments);
	};

	lazyLoad.getHarness = getHarness;

	return lazyLoad;
}());

function createHarness(conf_) {
	var results = createResult();
	if (!conf_ || conf_.autoclose !== false) {
		results.once('done', function () { results.close(); });
	}

	function test(name, conf, cb) {
		var t = new Test(name, conf, cb);
		test._tests.push(t);

		(function inspectCode(st) {
			st.on('test', function sub(st_) {
				inspectCode(st_);
			});
			st.on('result', function (r) {
				if (!r.todo && !r.ok && typeof r !== 'string') { test._exitCode = 1; }
			});
		}(t));

		results.push(t);
		return t;
	}
	test._results = results;

	test._tests = [];

	test.createStream = function (opts) {
		return results.createStream(opts);
	};

	test.onFinish = function (cb) {
		results.on('done', cb);
	};

	test.onFailure = function (cb) {
		results.on('fail', cb);
	};

	var only = false;
	test.only = function () {
		if (only) { throw new Error('there can only be one only test'); }
		if (conf_.noOnly) { throw new Error('`only` tests are prohibited'); }
		only = true;
		var t = test.apply(null, arguments);
		results.only(t);
		return t;
	};
	test._exitCode = 0;

	test.close = function () { results.close(); };

	return test;
}

function createExitHarness(conf) {
	var config = conf || {};
	var harness = createHarness({
		autoclose: defined(config.autoclose, false),
		noOnly: defined(conf.noOnly, defined(process.env.NODE_TAPE_NO_ONLY_TEST, false))
	});

	var stream = harness.createStream({ objectMode: conf.objectMode });
	var es = stream.pipe(conf.stream || createDefaultStream());
	if (canEmitExit) {
		es.on('error', function (err) { harness._exitCode = 1; });
	}

	var ended = false;
	stream.on('end', function () { ended = true; });

	if (config.exit === false) { return harness; }
	if (!canEmitExit || !canExit) { return harness; }

	process.on('exit', function (code) {
		if (code !== 0) {
			return;
		}

		if (!ended) {
			var only = harness._results._only;
			for (var i = 0; i < harness._tests.length; i++) {
				var t = harness._tests[i];
				if (!only || t === only) {
					t._exit();
				}
			}
		}
		harness.close();
		process.exit(code || harness._exitCode);
	});

	return harness;
}

module.exports.createHarness = createHarness;
module.exports.Test = Test;
module.exports.test = module.exports;
module.exports.test.skip = Test.skip;

},
// 8
function(module, exports, __webpack_require__) {

var through = __webpack_require__(0);
var fs = __webpack_require__(10);

module.exports = function () {
	var line = '';
	var stream = through(write, flush);
	return stream;

	function write(buf) {
		for (var i = 0; i < buf.length; i++) {
			var c = typeof buf === 'string'
				? buf.charAt(i)
				: String.fromCharCode(buf[i]);
			if (c === '\n') {
				flush();
			} else {
				line += c;
			}
		}
	}

	function flush() {
		if (fs.writeSync && (/^win/).test(process.platform)) {
			try {
				fs.writeSync(1, line + '\n');
			} catch (e) {
				stream.emit('error', e);
			}
		} else {
			try {
				console.log(line);
			} catch (e) {
				stream.emit('error', e);
			}
		}
		line = '';
	}
};

},
// 9
function(module) {

module.exports = require("stream");

},
// 10
function(module) {

module.exports = require("fs");

},
// 11
function(module, exports, __webpack_require__) {

var deepEqual = __webpack_require__(12);
var defined = __webpack_require__(1);
var path = __webpack_require__(17);
var inherits = __webpack_require__(3);
var EventEmitter = __webpack_require__(5).EventEmitter;
var callBound = function (fn) { return Function.call.bind(fn); };
var has = callBound(Object.prototype.hasOwnProperty);
var isRegExp = __webpack_require__(2);
var trim = callBound(String.prototype.trim);
var forEach = callBound(Array.prototype.forEach);
var inspect = __webpack_require__(6);
var isEnumerable = callBound(Object.prototype.propertyIsEnumerable);
var toLowerCase = callBound(String.prototype.toLowerCase);
var $exec = callBound(RegExp.prototype.exec);
var objectToString = callBound(Object.prototype.toString);

var nextTick = typeof setImmediate !== 'undefined'
	? setImmediate
	: process.nextTick;
var safeSetTimeout = setTimeout;
var safeClearTimeout = clearTimeout;

function getTestArgs(name_, opts_, cb_) {
	var name = '(anonymous)';
	var opts = {};
	var cb;

	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		var t = typeof arg;
		if (t === 'string') {
			name = arg;
		} else if (t === 'object') {
			opts = arg || opts;
		} else if (t === 'function') {
			cb = arg;
		}
	}
	return {
		name: name,
		opts: opts,
		cb: cb
	};
}

function Test(name_, opts_, cb_) {
	if (!(this instanceof Test)) {
		return new Test(name_, opts_, cb_);
	}

	var args = getTestArgs(name_, opts_, cb_);

	this.readable = true;
	this.name = args.name || '(anonymous)';
	this.assertCount = 0;
	this.pendingCount = 0;
	this._skip = args.opts.skip || false;
	this._todo = args.opts.todo || false;
	this._timeout = args.opts.timeout;
	this._plan = undefined;
	this._cb = args.cb;
	this._progeny = [];
	this._teardown = [];
	this._ok = true;
	var depthEnvVar = process.env.NODE_TAPE_OBJECT_PRINT_DEPTH;
	if (args.opts.objectPrintDepth) {
		this._objectPrintDepth = args.opts.objectPrintDepth;
	} else if (depthEnvVar) {
		if (toLowerCase(depthEnvVar) === 'infinity') {
			this._objectPrintDepth = Infinity;
		} else {
			this._objectPrintDepth = depthEnvVar;
		}
	} else {
		this._objectPrintDepth = 5;
	}

	for (var prop in this) {
		this[prop] = (function bind(self, val) {
			if (typeof val === 'function') {
				return function bound() {
					return val.apply(self, arguments);
				};
			}
			return val;
		}(this, this[prop]));
	}
}

inherits(Test, EventEmitter);

Test.prototype.run = function run() {
	this.emit('prerun');
	if (!this._cb || this._skip) {
		this._end();
		return;
	}
	if (this._timeout != null) {
		this.timeoutAfter(this._timeout);
	}
	this._cb(this);
	this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
	var self = this;
	var t = new Test(name, opts, cb);
	this._progeny.push(t);
	this.pendingCount++;
	this.emit('test', t);
	t.on('prerun', function () {
		self.assertCount++;
	});

	if (!self._pendingAsserts()) {
		nextTick(function () {
			self._end();
		});
	}

	nextTick(function () {
		if (!self._plan && self.pendingCount == self._progeny.length) {
			self._end();
		}
	});
};

Test.prototype.comment = function (msg) {
	var that = this;
	forEach(trim(msg).split('\n'), function (aMsg) {
		that.emit('result', trim(aMsg).replace(/^#\s*/, ''));
	});
};

Test.prototype.plan = function (n) {
	this._plan = n;
	this.emit('plan', n);
};

Test.prototype.timeoutAfter = function (ms) {
	if (!ms) { throw new Error('timeoutAfter requires a timespan'); }
	var self = this;
	var timeout = safeSetTimeout(function () {
		self.fail(self.name + ' timed out after ' + ms + 'ms');
		self.end();
	}, ms);
	this.once('end', function () {
		safeClearTimeout(timeout);
	});
};

Test.prototype.end = function end(err) {
	if (arguments.length >= 1 && !!err) {
		this.ifError(err);
	}

	if (this.calledEnd) {
		this.fail('.end() already called');
	}
	this.calledEnd = true;
	this._end();
};

Test.prototype.teardown = function (fn) {
	if (typeof fn !== 'function') {
		this.fail('teardown: ' + inspect(fn) + ' is not a function');
	} else {
		this._teardown.push(fn);
	}
};

Test.prototype._end = function (err) {
	var self = this;
	if (this._progeny.length) {
		var t = this._progeny.shift();
		t.on('end', function () { self._end(); });
		t.run();
		return;
	}

	function completeEnd() {
		if (!self.ended) { self.emit('end'); }
		var pendingAsserts = self._pendingAsserts();
		if (!self._planError && self._plan !== undefined && pendingAsserts) {
			self._planError = true;
			self.fail('plan != count', {
				expected: self._plan,
				actual: self.assertCount
			});
		}
		self.ended = true;
	}

	function next(i) {
		if (i === self._teardown.length) {
			completeEnd();
			return;
		}
		var fn = self._teardown[i];
		var res;
		try {
			res = fn();
		} catch (e) {
			self.fail(e);
		}
		if (res && typeof res.then === 'function') {
			res.then(function () {
				next(++i);
			}, function (_err) {
				err = err || _err;
			});
		} else {
			next(++i);
		}
	}

	if (this._teardown.length > 0) {
		next(0);
	} else {
		completeEnd();
	}
};

Test.prototype._exit = function () {
	if (this._plan !== undefined && !this._planError && this.assertCount !== this._plan) {
		this._planError = true;
		this.fail('plan != count', {
			expected: this._plan,
			actual: this.assertCount,
			exiting: true
		});
	} else if (!this.ended) {
		this.fail('test exited without ending: ' + this.name, {
			exiting: true
		});
	}
};

Test.prototype._pendingAsserts = function () {
	if (this._plan === undefined) {
		return 1;
	}
	return this._plan - (this._progeny.length + this.assertCount);
};

Test.prototype._assert = function assert(ok, opts) {
	var self = this;
	var extra = opts.extra || {};

	ok = !!ok || !!extra.skip;

	var res = {
		id: self.assertCount++,
		ok: ok,
		skip: defined(extra.skip, opts.skip),
		todo: defined(extra.todo, opts.todo, self._todo),
		name: defined(extra.message, opts.message, '(unnamed assert)'),
		operator: defined(extra.operator, opts.operator),
		objectPrintDepth: self._objectPrintDepth
	};
	if (has(opts, 'actual') || has(extra, 'actual')) {
		res.actual = defined(extra.actual, opts.actual);
	}
	if (has(opts, 'expected') || has(extra, 'expected')) {
		res.expected = defined(extra.expected, opts.expected);
	}
	this._ok = !!(this._ok && ok);

	if (!ok && !res.todo) {
		res.error = defined(extra.error, opts.error, new Error(res.name));
	}

	if (!ok) {
		var e = new Error('exception');
		var err = (e.stack || '').split('\n');
		var dir = __dirname + path.sep;

		for (var i = 0; i < err.length; i++) {
			var re = /^(?:[^\s]*\s*\bat\s+)(?:(.*)\s+\()?((?:\/|[a-zA-Z]:\\)[^:)]+:(\d+)(?::(\d+))?)\)?$/;
			var lineWithTokens = err[i].replace(process.cwd(), '/$CWD').replace(__dirname, '/$TEST');
			var m = re.exec(lineWithTokens);

			if (!m) {
				continue;
			}

			var callDescription = m[1] || '<anonymous>';
			var filePath = m[2].replace('/$CWD', process.cwd()).replace('/$TEST', __dirname);

			if (filePath.slice(0, dir.length) === dir) {
				continue;
			}

			res.functionName = callDescription.split(/\s+/)[0];
			res.file = filePath;
			res.line = Number(m[3]);
			if (m[4]) { res.column = Number(m[4]); }

			res.at = callDescription + ' (' + filePath + ')';
			break;
		}
	}

	self.emit('result', res);

	var pendingAsserts = self._pendingAsserts();
	if (!pendingAsserts) {
		if (extra.exiting) {
			self._end();
		} else {
			nextTick(function () {
				self._end();
			});
		}
	}

	if (!self._planError && pendingAsserts < 0) {
		self._planError = true;
		self.fail('plan != count', {
			expected: self._plan,
			actual: self._plan - pendingAsserts
		});
	}
};

Test.prototype.fail = function (msg, extra) {
	this._assert(false, {
		message: msg,
		operator: 'fail',
		extra: extra
	});
};

Test.prototype.pass = function (msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'pass',
		extra: extra
	});
};

Test.prototype.skip = function (msg, extra) {
	this._assert(true, {
		message: msg,
		operator: 'skip',
		skip: true,
		extra: extra
	});
};

var tapeAssert = function assert(value, msg, extra) {
	this._assert(value, {
		message: defined(msg, 'should be truthy'),
		operator: 'ok',
		expected: true,
		actual: value,
		extra: extra
	});
};
Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= tapeAssert;

function notOK(value, msg, extra) {
	this._assert(!value, {
		message: defined(msg, 'should be falsy'),
		operator: 'notOk',
		expected: false,
		actual: value,
		extra: extra
	});
}
Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= notOK;

function error(err, msg, extra) {
	this._assert(!err, {
		message: defined(msg, String(err)),
		operator: 'error',
		actual: err,
		extra: extra
	});
}
Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= error;

function equal(a, b, msg, extra) {
	this._assert(a === b, {
		message: defined(msg, 'should be equal'),
		operator: 'equal',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= equal;

function notEqual(a, b, msg, extra) {
	this._assert(a !== b, {
		message: defined(msg, 'should not be equal'),
		operator: 'notEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= notEqual;

function tapeDeepEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= tapeDeepEqual;

function deepLooseEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= deepLooseEqual;

function notDeepEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should not be equivalent'),
		operator: 'notDeepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepEqual
= Test.prototype.notDeepEquals
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= notDeepEqual;

function notDeepLooseEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'notDeepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= notDeepLooseEqual;

Test.prototype['throws'] = function (fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}

	var caught;

	try {
		fn();
	} catch (err) {
		caught = { error: err };
		if (Object(err) === err && 'message' in err && (!isEnumerable(err, 'message') || !has(err, 'message'))) {
			try {
				var message = err.message;
				delete err.message;
				err.message = message;
			} catch (e) { }
		}
	}

	var passed = caught;

	if (isRegExp(expected)) {
		passed = $exec(expected, caught && caught.error) !== null;
		expected = String(expected);
	}

	if (typeof expected === 'function' && caught) {
		passed = caught.error instanceof expected;
	}

	this._assert(typeof fn === 'function' && passed, {
		message: defined(msg, 'should throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: !passed && caught && caught.error,
		extra: extra
	});
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
	if (typeof expected === 'string') {
		msg = expected;
		expected = undefined;
	}
	var caught;
	try {
		fn();
	} catch (err) {
		caught = { error: err };
	}
	this._assert(!caught, {
		message: defined(msg, 'should not throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: caught && caught.error,
		extra: extra
	});
};

Test.prototype.match = function match(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'match',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'match',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'matched' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(matches, {
			message: message,
			operator: 'match',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

Test.prototype.doesNotMatch = function doesNotMatch(string, regexp, msg, extra) {
	if (!isRegExp(regexp)) {
		this._assert(false, {
			message: defined(msg, 'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'),
			operator: 'doesNotMatch',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	} else if (typeof string !== 'string') {
		this._assert(false, {
			message: defined(msg, 'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'),
			operator: 'doesNotMatch',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	} else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'was expected to not match' : 'did not match') + ' the regular expression ' + inspect(regexp) + '. Input: ' + inspect(string)
		);
		this._assert(!matches, {
			message: message,
			operator: 'doesNotMatch',
			actual: string,
			expected: regexp,
			extra: extra
		});
	}
};

Test.skip = function (name_, _opts, _cb) {
	var args = getTestArgs.apply(null, arguments);
	args.opts.skip = true;
	return new Test(args.name, args.opts, args.cb);
};

module.exports = Test;

},
// 12
function(module, exports, __webpack_require__) {

var objectKeys = Object.keys;
var isArguments = __webpack_require__(13);
var is = typeof Object.is == 'function' ? Object.is : __webpack_require__(14);
var isRegex = __webpack_require__(2);
var flags = Function.call.bind((/./mi.flags === 'im' && Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get) || __webpack_require__(15));
var isDate = __webpack_require__(16);

var getTime = Date.prototype.getTime;

function deepEqual(actual, expected, options) {
  var opts = options || {};

  if (opts.strict ? is(actual, expected) : actual === expected) {
    return true;
  }

  if (!actual || !expected || (typeof actual !== 'object' && typeof expected !== 'object')) {
    return opts.strict ? is(actual, expected) : actual == expected;
  }

  return objEquiv(actual, expected, opts);
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') {
    return false;
  }
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') {
    return false;
  }
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (typeof a !== typeof b) { return false; }
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) { return false; }

  if (a.prototype !== b.prototype) { return false; }

  if (isArguments(a) !== isArguments(b)) { return false; }

  var aIsRegex = isRegex(a);
  var bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) { return false; }
  if (aIsRegex || bIsRegex) {
    return a.source === b.source && flags(a) === flags(b);
  }

  if (isDate(a) && isDate(b)) {
    return getTime.call(a) === getTime.call(b);
  }

  var aIsBuffer = isBuffer(a);
  var bIsBuffer = isBuffer(b);
  if (aIsBuffer !== bIsBuffer) { return false; }
  if (aIsBuffer || bIsBuffer) {
    if (a.length !== b.length) { return false; }
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) { return false; }
    }
    return true;
  }

  if (typeof a !== typeof b) { return false; }

  try {
    var ka = objectKeys(a);
    var kb = objectKeys(b);
  } catch (e) {
    return false;
  }
  if (ka.length !== kb.length) { return false; }

  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) { return false; }
  }
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) { return false; }
  }

  return true;
}

module.exports = deepEqual;

},
// 13
function(module, exports, __webpack_require__) {

var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var toStr = Object.prototype.toString;

var isStandardArguments = function isArguments(value) {
	if (hasToStringTag && value && typeof value === 'object' && Symbol.toStringTag in value) {
		return false;
	}
	return toStr.call(value) === '[object Arguments]';
};

var isLegacyArguments = function isArguments(value) {
	if (isStandardArguments(value)) {
		return true;
	}
	return value !== null &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]';
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
}());

isStandardArguments.isLegacyArguments = isLegacyArguments;

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},
// 14
function(module, exports, __webpack_require__) {

var numberIsNaN = function (value) {
	return value !== value;
};

module.exports = function is(a, b) {
	if (a === 0 && b === 0) {
		return 1 / a === 1 / b;
	}
	if (a === b) {
		return true;
	}
	if (numberIsNaN(a) && numberIsNaN(b)) {
		return true;
	}
	return false;
};

},
// 15
function(module, exports, __webpack_require__) {

var $Object = Object;
var $TypeError = TypeError;

module.exports = function flags() {
	if (this != null && this !== $Object(this)) {
		throw new $TypeError('RegExp.prototype.flags getter called on non-object');
	}
	var result = '';
	if (this.hasIndices) {
		result += 'd';
	}
	if (this.global) {
		result += 'g';
	}
	if (this.ignoreCase) {
		result += 'i';
	}
	if (this.multiline) {
		result += 'm';
	}
	if (this.dotAll) {
		result += 's';
	}
	if (this.unicode) {
		result += 'u';
	}
	if (this.sticky) {
		result += 'y';
	}
	return result;
};

if (module.exports.name && Object.getOwnPropertyDescriptor(module.exports, 'name').configurable) {
	Object.defineProperty(module.exports, 'name', { value: 'get flags' });
}

},
// 16
function(module, exports, __webpack_require__) {

var getDay = Date.prototype.getDay;
var tryDateObject = function tryDateGetDayCall(value) {
	try {
		getDay.call(value);
		return true;
	} catch (e) {
		return false;
	}
};

var toStr = Object.prototype.toString;
var dateClass = '[object Date]';
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

module.exports = function isDateObject(value) {
	if (typeof value !== 'object' || value === null) {
		return false;
	}
	return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
};

},
// 17
function(module) {

module.exports = require("path");

},
// 18
function(module, exports) {

if (typeof Object.create === 'function') {
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}

},
// 19
function(module, exports, __webpack_require__) {

var defined = __webpack_require__(1);
var EventEmitter = __webpack_require__(5).EventEmitter;
var inherits = __webpack_require__(3);
var through = __webpack_require__(0);
var resumer = __webpack_require__(20);
var inspect = __webpack_require__(6);
var callBound = function (fn) { return Function.call.bind(fn); };
var has = callBound(Object.prototype.hasOwnProperty);
var $exec = callBound(RegExp.prototype.exec);
var yamlIndicators = /:|-|\?/;
var nextTick = typeof setImmediate !== 'undefined' ? setImmediate : process.nextTick;

function coalesceWhiteSpaces(str) {
	return String(str).replace(/\s+/g, ' ');
}

function invalidYaml(str) {
	return $exec(yamlIndicators, str) !== null;
}

function encodeResult(res, count) {
	var output = '';
	output += (res.ok ? 'ok ' : 'not ok ') + count;
	output += res.name ? ' ' + coalesceWhiteSpaces(res.name) : '';

	if (res.skip) {
		output += ' # SKIP' + (typeof res.skip === 'string' ? ' ' + coalesceWhiteSpaces(res.skip) : '');
	} else if (res.todo) {
		output += ' # TODO' + (typeof res.todo === 'string' ? ' ' + coalesceWhiteSpaces(res.todo) : '');
	}

	output += '\n';
	if (res.ok) { return output; }

	var outer = '  ';
	var inner = outer + '  ';
	output += outer + '---\n';
	output += inner + 'operator: ' + res.operator + '\n';

	if (has(res, 'expected') || has(res, 'actual')) {
		var ex = inspect(res.expected, { depth: res.objectPrintDepth });
		var ac = inspect(res.actual, { depth: res.objectPrintDepth });

		if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
			output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
			output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
		} else {
			output += inner + 'expected: ' + ex + '\n';
			output += inner + 'actual:   ' + ac + '\n';
		}
	}
	if (res.at) {
		output += inner + 'at: ' + res.at + '\n';
	}

	var actualStack = res.actual && (typeof res.actual === 'object' || typeof res.actual === 'function') ? res.actual.stack : undefined;
	var errorStack = res.error && res.error.stack;
	var stack = defined(actualStack, errorStack);
	if (stack) {
		var lines = String(stack).split('\n');
		output += inner + 'stack: |-\n';
		for (var i = 0; i < lines.length; i++) {
			output += inner + '  ' + lines[i] + '\n';
		}
	}

	output += outer + '...\n';
	return output;
}

function getNextTest(results) {
	if (!results._only) {
		return results.tests.shift();
	}

	do {
		var t = results.tests.shift();
		if (t && results._only === t) {
			return t;
		}
	} while (results.tests.length !== 0);

	return void undefined;
}

function Results() {
	if (!(this instanceof Results)) { return new Results(); }
	this.count = 0;
	this.fail = 0;
	this.pass = 0;
	this.todo = 0;
	this._stream = through();
	this.tests = [];
	this._only = null;
	this._isRunning = false;
}

inherits(Results, EventEmitter);

Results.prototype.createStream = function (opts) {
	if (!opts) { opts = {}; }
	var self = this;
	var output;
	var testId = 0;
	if (opts.objectMode) {
		output = through();
		self.on('_push', function ontest(t, extra) {
			if (!extra) { extra = {}; }
			var id = testId++;
			t.once('prerun', function () {
				var row = {
					type: 'test',
					name: t.name,
					id: id,
					skip: t._skip,
					todo: t._todo
				};
				if (has(extra, 'parent')) {
					row.parent = extra.parent;
				}
				output.queue(row);
			});
			t.on('test', function (st) {
				ontest(st, { parent: id });
			});
			t.on('result', function (res) {
				if (res && typeof res === 'object') {
					res.test = id;
					res.type = 'assert';
				}
				output.queue(res);
			});
			t.on('end', function () {
				output.queue({ type: 'end', test: id });
			});
		});
		self.on('done', function () { output.queue(null); });
	} else {
		output = resumer();
		output.queue('TAP version 13\n');
		self._stream.pipe(output);
	}

	if (!this._isRunning) {
		this._isRunning = true;
		nextTick(function next() {
			var t;
			while (t = getNextTest(self)) {
				t.run();
				if (!t.ended) {
					t.once('end', function () { nextTick(next); });
					return;
				}
			}
			self.emit('done');
		});
	}

	return output;
};

Results.prototype.push = function (t) {
	var self = this;
	self.tests.push(t);
	self._watch(t);
	self.emit('_push', t);
};

Results.prototype.only = function (t) {
	this._only = t;
};

Results.prototype._watch = function (t) {
	var self = this;
	function write(s) { self._stream.queue(s); }
	t.once('prerun', function () {
		var premsg = '';
		if (t._skip) {
			premsg = 'SKIP ';
		} else if (t._todo) {
			premsg = 'TODO ';
		}
		write('# ' + premsg + coalesceWhiteSpaces(t.name) + '\n');
	});

	t.on('result', function (res) {
		if (typeof res === 'string') {
			write('# ' + res + '\n');
			return;
		}
		write(encodeResult(res, self.count + 1));
		self.count++;

		if (res.ok || res.todo) {
			self.pass++;
		} else {
			self.fail++;
			self.emit('fail');
		}
	});

	t.on('test', function (st) { self._watch(st); });
};

Results.prototype.close = function () {
	var self = this;
	if (self.closed) { self._stream.emit('error', new Error('ALREADY CLOSED')); }
	self.closed = true;
	function write(s) { self._stream.queue(s); }

	write('\n1..' + self.count + '\n');
	write('# tests ' + self.count + '\n');
	write('# pass  ' + (self.pass + self.todo) + '\n');
	if (self.todo) {
		write('# todo  ' + self.todo + '\n');
	} if (self.fail) {
		write('# fail  ' + self.fail + '\n');
	} else {
		write('\n# ok\n');
	}

	self._stream.queue(null);
};

module.exports = Results;

},
// 20
function(module, exports, __webpack_require__) {

var through = __webpack_require__(0);
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (write, end) {
    var tr = through(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;

    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };

    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };

    nextTick(function () {
        if (!paused) tr.resume();
    });

    return tr;
};

}
]);

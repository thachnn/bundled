'use strict';

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
	return __webpack_require__(7);
})([
// 0
function (module, exports, __webpack_require__) {

var Stream = __webpack_require__(9)

module.exports = through
through.through = through

function through(write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false,
    stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

  stream.autoDestroy = !opts || opts.autoDestroy !== false

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while (buffer.length && !stream.paused) {
      var data = buffer.shift()
      if (null === data) return stream.emit('end')

      stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
    if (_ended) return stream
    if (data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  stream.on('end', function () {
    stream.readable = false
    stream.writable || !stream.autoDestroy ||
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end() {
    stream.writable = false
    end.call(stream)
    stream.readable || !stream.autoDestroy || stream.destroy()
  }

  stream.end = function (data) {
    if (ended) return
    ended = true
    arguments.length && stream.write(data)
    _end()
    return stream
  }

  stream.destroy = function () {
    if (destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if (stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if (stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    stream.paused || stream.emit('drain')
    return stream
  }
  return stream
}

},
// 1
function (module) {

module.exports = function () {
	for (var i = 0; i < arguments.length; i++) if (arguments[i] !== void 0) return arguments[i];
};

},
// 2
function (module) {

var has,
	$exec,
	isRegexMarker,
	badStringifier,
	callBound = function (fn) { return Function.call.bind(fn); },
	hasToStringTag = typeof Symbol == 'function' && !!Symbol.toStringTag;

if (hasToStringTag) {
	has = callBound(Object.prototype.hasOwnProperty);
	$exec = callBound(RegExp.prototype.exec);
	isRegexMarker = {};

	var throwRegexMarker = function () {
		throw isRegexMarker;
	};
	badStringifier = { toString: throwRegexMarker, valueOf: throwRegexMarker };

	if (typeof Symbol.toPrimitive == 'symbol')
		badStringifier[Symbol.toPrimitive] = throwRegexMarker;
}

var $toString = callBound(Object.prototype.toString),
	gOPD = Object.getOwnPropertyDescriptor,
	regexClass = '[object RegExp]';

module.exports = hasToStringTag
	? function (value) {
			if (!value || typeof value != 'object') return false;

			var descriptor = gOPD(value, 'lastIndex');
			if (!descriptor || !has(descriptor, 'value')) return false;

			try {
				$exec(value, badStringifier);
			} catch (e) {
				return e === isRegexMarker;
			}
	  }
	: function (value) {
			return !!value && (typeof value == 'object' || typeof value == 'function') &&
				$toString(value) === regexClass;
	  };

},
// 3
function (module, exports, __webpack_require__) {

try {
  module.exports = __webpack_require__(4).inherits;
  if (typeof module.exports == 'function') return;
} catch (_) {}
module.exports = __webpack_require__(18);

},
// 4
function (module) {

module.exports = require('util');

},
// 5
function (module) {

module.exports = require('events');

},
// 6
function (module, exports, __webpack_require__) {

var hasMap = typeof Map == 'function' && Map.prototype,
	mapSizeDescriptor =
		Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null,
	mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get == 'function' ? mapSizeDescriptor.get : null,
	mapForEach = hasMap && Map.prototype.forEach,
	hasSet = typeof Set == 'function' && Set.prototype,
	setSizeDescriptor =
		Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null,
	setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get == 'function' ? setSizeDescriptor.get : null,
	setForEach = hasSet && Set.prototype.forEach,
	weakMapHas = typeof WeakMap == 'function' && WeakMap.prototype ? WeakMap.prototype.has : null,
	weakSetHas = typeof WeakSet == 'function' && WeakSet.prototype ? WeakSet.prototype.has : null,
	weakRefDeref = typeof WeakRef == 'function' && WeakRef.prototype ? WeakRef.prototype.deref : null,
	booleanValueOf = Boolean.prototype.valueOf,
	objectToString = Object.prototype.toString,
	functionToString = Function.prototype.toString,
	$match = String.prototype.match,
	$slice = String.prototype.slice,
	$replace = String.prototype.replace,
	$toUpperCase = String.prototype.toUpperCase,
	$toLowerCase = String.prototype.toLowerCase,
	$test = RegExp.prototype.test,
	$concat = Array.prototype.concat,
	$join = Array.prototype.join,
	$arrSlice = Array.prototype.slice,
	$floor = Math.floor,
	bigIntValueOf = typeof BigInt == 'function' ? BigInt.prototype.valueOf : null,
	gOPS = Object.getOwnPropertySymbols,
	symToString = typeof Symbol == 'function' && typeof Symbol.iterator == 'symbol' ? Symbol.prototype.toString : null,
	hasShammedSymbols = typeof Symbol == 'function' && typeof Symbol.iterator == 'object';
var toStringTag =
	typeof Symbol == 'function' && Symbol.toStringTag &&
	typeof Symbol.toStringTag == (hasShammedSymbols ? 'object' : 'symbol')
		? Symbol.toStringTag
		: null;
var isEnumerable = Object.prototype.propertyIsEnumerable;

var gPO =
	(typeof Reflect == 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) ||
	([].__proto__ === Array.prototype
		? function (O) { return O.__proto__; }
		: null);

function addNumericSeparator(num, str) {
	if (
		num === Infinity ||
		num === -Infinity ||
		num !== num ||
		(num && num > -1000 && num < 1000) ||
		$test.call(/e/, str)
	)
		return str;

	var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
	if (typeof num == 'number') {
		var int = num < 0 ? -$floor(-num) : $floor(num);
		if (int !== num) {
			var intStr = String(int),
				dec = $slice.call(str, intStr.length + 1);
			return $replace.call(intStr, sepRegex, '$&_') + '.' +
				$replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
		}
	}
	return $replace.call(str, sepRegex, '$&_');
}

var utilInspect = __webpack_require__(4).inspect,
	inspectCustom = utilInspect.custom,
	inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;

module.exports = function inspect_(obj, options, depth, seen) {
	var opts = options || {};

	if (has(opts, 'quoteStyle') && opts.quoteStyle !== 'single' && opts.quoteStyle !== 'double')
		throw new TypeError('option "quoteStyle" must be "single" or "double"');

	if (
		has(opts, 'maxStringLength') &&
		(typeof opts.maxStringLength == 'number'
			? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity
			: opts.maxStringLength !== null)
	)
		throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');

	var customInspect = !has(opts, 'customInspect') || opts.customInspect;
	if (typeof customInspect != 'boolean' && customInspect !== 'symbol')
		throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');

	if (
		has(opts, 'indent') &&
		opts.indent !== null &&
		opts.indent !== '\t' &&
		!(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)
	)
		throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');

	if (has(opts, 'numericSeparator') && typeof opts.numericSeparator != 'boolean')
		throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');

	var numericSeparator = opts.numericSeparator;

	if (obj === void 0) return 'undefined';
	if (obj === null) return 'null';
	if (typeof obj == 'boolean') return obj ? 'true' : 'false';

	if (typeof obj == 'string') return inspectString(obj, opts);

	if (typeof obj == 'number') {
		if (obj === 0) return Infinity / obj > 0 ? '0' : '-0';

		var str = String(obj);
		return numericSeparator ? addNumericSeparator(obj, str) : str;
	}
	if (typeof obj == 'bigint') {
		var bigIntStr = String(obj) + 'n';
		return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
	}

	var maxDepth = opts.depth === void 0 ? 5 : opts.depth;
	if (depth === void 0) depth = 0;
	if (depth >= maxDepth && maxDepth > 0 && typeof obj == 'object')
		return isArray(obj) ? '[Array]' : '[Object]';

	var indent = getIndent(opts, depth);

	if (seen === void 0) seen = [];
	else if (indexOf(seen, obj) >= 0) return '[Circular]';

	function inspect(value, from, noIndent) {
		from && (seen = $arrSlice.call(seen)).push(from);

		if (noIndent) {
			var newOpts = { depth: opts.depth };
			if (has(opts, 'quoteStyle')) newOpts.quoteStyle = opts.quoteStyle;

			return inspect_(value, newOpts, depth + 1, seen);
		}
		return inspect_(value, opts, depth + 1, seen);
	}

	if (typeof obj == 'function' && !isRegExp(obj)) {
		var name = nameOf(obj),
			keys = arrObjKeys(obj, inspect);
		return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' +
			(keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
	}
	if (isSymbol(obj)) {
		var symString = hasShammedSymbols
			? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1')
			: symToString.call(obj);
		return typeof obj != 'object' || hasShammedSymbols ? symString : markBoxed(symString);
	}
	if (isElement(obj)) {
		var s = '<' + $toLowerCase.call(String(obj.nodeName));
		for (var attrs = obj.attributes || [], i = 0; i < attrs.length; i++)
			s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);

		s += '>';
		if (obj.childNodes && obj.childNodes.length) s += '...';
		return s + '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
	}
	if (isArray(obj)) {
		if (obj.length === 0) return '[]';
		var xs = arrObjKeys(obj, inspect);
		return indent && !singleLineValues(xs)
			? '[' + indentedJoin(xs, indent) + ']'
			: '[ ' + $join.call(xs, ', ') + ' ]';
	}
	if (isError(obj)) {
		var parts = arrObjKeys(obj, inspect);
		return !('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')
			? '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }'

			: parts.length === 0 ? '[' + String(obj) + ']'
			: '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
	}
	if (typeof obj == 'object' && customInspect) {
		if (inspectSymbol && typeof obj[inspectSymbol] == 'function' && utilInspect)
			return utilInspect(obj, { depth: maxDepth - depth });
		if (customInspect !== 'symbol' && typeof obj.inspect == 'function') return obj.inspect();
	}
	if (isMap(obj)) {
		var mapParts = [];
		mapForEach &&
			mapForEach.call(obj, function (value, key) {
				mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
			});

		return collectionOf('Map', mapSize.call(obj), mapParts, indent);
	}
	if (isSet(obj)) {
		var setParts = [];
		setForEach &&
			setForEach.call(obj, function (value) {
				setParts.push(inspect(value, obj));
			});

		return collectionOf('Set', setSize.call(obj), setParts, indent);
	}
	if (isWeakMap(obj)) return weakCollectionOf('WeakMap');
	if (isWeakSet(obj)) return weakCollectionOf('WeakSet');
	if (isWeakRef(obj)) return weakCollectionOf('WeakRef');

	if (isNumber(obj)) return markBoxed(inspect(Number(obj)));
	if (isBigInt(obj)) return markBoxed(inspect(bigIntValueOf.call(obj)));
	if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
	if (isString(obj)) return markBoxed(inspect(String(obj)));

	if (isDate(obj) || isRegExp(obj)) return String(obj);

	var ys = arrObjKeys(obj, inspect),
		isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object,
		protoTag = obj instanceof Object ? '' : 'null prototype',
		stringTag =
			!isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj
				? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '',
		tag =
			(isPlainObject || typeof obj.constructor != 'function'
				? '' : obj.constructor.name ? obj.constructor.name + ' ' : '') +
			(stringTag || protoTag
				? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
	return ys.length === 0 ? tag + '{}'
		: indent
		? tag + '{' + indentedJoin(ys, indent) + '}'

		: tag + '{ ' + $join.call(ys, ', ') + ' }';
};

function wrapQuotes(s, defaultStyle, opts) {
	var quoteChar = (opts.quoteStyle || defaultStyle) === 'double' ? '"' : "'";
	return quoteChar + s + quoteChar;
}

function quote(s) {
	return $replace.call(String(s), /"/g, '&quot;');
}

function isArray(obj) {
	return toStr(obj) === '[object Array]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isDate(obj) {
	return toStr(obj) === '[object Date]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isRegExp(obj) {
	return toStr(obj) === '[object RegExp]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isError(obj) {
	return toStr(obj) === '[object Error]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isString(obj) {
	return toStr(obj) === '[object String]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isNumber(obj) {
	return toStr(obj) === '[object Number]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}
function isBoolean(obj) {
	return toStr(obj) === '[object Boolean]' && !(toStringTag && typeof obj == 'object' && toStringTag in obj);
}

function isSymbol(obj) {
	if (hasShammedSymbols) return obj && typeof obj == 'object' && obj instanceof Symbol;

	if (typeof obj == 'symbol') return true;
	if (!obj || typeof obj != 'object' || !symToString) return false;

	try {
		symToString.call(obj);
		return true;
	} catch (_) {}
	return false;
}

function isBigInt(obj) {
	if (!obj || typeof obj != 'object' || !bigIntValueOf) return false;

	try {
		bigIntValueOf.call(obj);
		return true;
	} catch (_) {}
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
	if (f.name) return f.name;
	var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
	return m ? m[1] : null;
}

function indexOf(xs, x) {
	if (xs.indexOf) return xs.indexOf(x);
	for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;

	return -1;
}

function isMap(x) {
	if (!mapSize || !x || typeof x != 'object') return false;

	try {
		mapSize.call(x);
		try {
			setSize.call(x);
		} catch (_s) {
			return true;
		}
		return x instanceof Map;
	} catch (_) {}
	return false;
}

function isWeakMap(x) {
	if (!weakMapHas || !x || typeof x != 'object') return false;

	try {
		weakMapHas.call(x, weakMapHas);
		try {
			weakSetHas.call(x, weakSetHas);
		} catch (_s) {
			return true;
		}
		return x instanceof WeakMap;
	} catch (_) {}
	return false;
}

function isWeakRef(x) {
	if (!weakRefDeref || !x || typeof x != 'object') return false;

	try {
		weakRefDeref.call(x);
		return true;
	} catch (_) {}
	return false;
}

function isSet(x) {
	if (!setSize || !x || typeof x != 'object') return false;

	try {
		setSize.call(x);
		try {
			mapSize.call(x);
		} catch (_m) {
			return true;
		}
		return x instanceof Set;
	} catch (_) {}
	return false;
}

function isWeakSet(x) {
	if (!weakSetHas || !x || typeof x != 'object') return false;

	try {
		weakSetHas.call(x, weakSetHas);
		try {
			weakMapHas.call(x, weakMapHas);
		} catch (_s) {
			return true;
		}
		return x instanceof WeakSet;
	} catch (_) {}
	return false;
}

function isElement(x) {
	return !!x && typeof x == 'object' && (
		(typeof HTMLElement != 'undefined' && x instanceof HTMLElement) ||
		(typeof x.nodeName == 'string' && typeof x.getAttribute == 'function')
	);
}

function inspectString(str, opts) {
	if (str.length > opts.maxStringLength) {
		var remaining = str.length - opts.maxStringLength,
			trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
		return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
	}
	return wrapQuotes($replace.call($replace.call(str, /(['\\])/g, '\\$1'), /[\x00-\x1f]/g, lowbyte), 'single', opts);
}

function lowbyte(c) {
	var n = c.charCodeAt(0),
		x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
	return x ? '\\' + x : '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}

function markBoxed(str) {
	return 'Object(' + str + ')';
}

function weakCollectionOf(type) {
	return type + ' { ? }';
}

function collectionOf(type, size, entries, indent) {
	return type + ' (' + size + ') {' + (indent ? indentedJoin(entries, indent) : $join.call(entries, ', ')) + '}';
}

function singleLineValues(xs) {
	for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], '\n') >= 0) return false;

	return true;
}

function getIndent(opts, depth) {
	var baseIndent;
	if (opts.indent === '\t') baseIndent = '\t';
	else if (typeof opts.indent != 'number' || opts.indent <= 0) return null;
	else baseIndent = $join.call(Array(opts.indent + 1), ' ');

	return { base: baseIndent, prev: $join.call(Array(depth + 1), baseIndent) };
}

function indentedJoin(xs, indent) {
	if (xs.length === 0) return '';
	var lineJoiner = '\n' + indent.prev + indent.base;
	return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}

function arrObjKeys(obj, inspect) {
	var isArr = isArray(obj),
		xs = [];
	if (isArr) {
		xs.length = obj.length;
		for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
	}
	var symMap,
		syms = typeof gOPS == 'function' ? gOPS(obj) : [];
	if (hasShammedSymbols) {
		symMap = {};
		for (var k = 0; k < syms.length; k++) symMap['$' + syms[k]] = syms[k];
	}

	for (var key in obj) {
		if (
			!has(obj, key) ||
			(isArr && String(Number(key)) === key && key < obj.length) ||
			(hasShammedSymbols && symMap['$' + key] instanceof Symbol)
		)
			continue;
		$test.call(/[^\w$]/, key)
			? xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj))
			: xs.push(key + ': ' + inspect(obj[key], obj));
	}
	if (typeof gOPS == 'function')
		for (var j = 0; j < syms.length; j++)
			isEnumerable.call(obj, syms[j]) && xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));

	return xs;
}

},
// 7
function (module, exports, __webpack_require__) {

var defined = __webpack_require__(1),
	createDefaultStream = __webpack_require__(8),
	Test = __webpack_require__(11),
	createResult = __webpack_require__(19),
	through = __webpack_require__(0),

	canEmitExit =
		typeof process != 'undefined' && process && typeof process.on == 'function' && process.browser !== true,
	canExit = typeof process != 'undefined' && process && typeof process.exit == 'function';

exports = module.exports = (function () {
	var harness;

	function getHarness(opts) {
		opts || (opts = {});
		opts.autoclose = !canEmitExit;
		harness || (harness = createExitHarness(opts));
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
		if (harness) return harness.createStream(options);

		var output = through();
		getHarness({ stream: output, objectMode: options.objectMode });
		return output;
	};

	lazyLoad.onFinish = function () {
		return getHarness().onFinish.apply(this, arguments);
	};

	lazyLoad.onFailure = function () {
		return getHarness().onFailure.apply(this, arguments);
	};

	lazyLoad.getHarness = getHarness;

	return lazyLoad;
})();

function createHarness(conf_) {
	var results = createResult();
	(conf_ && conf_.autoclose === false) ||
		results.once('done', function () { results.close(); });

	function test(name, conf, cb) {
		var t = new Test(name, conf, cb);
		test._tests.push(t);

		!(function inspectCode(st) {
			st.on('test', function (st_) {
				inspectCode(st_);
			});
			st.on('result', function (r) {
				r.todo || r.ok || typeof r == 'string' || (test._exitCode = 1);
			});
		})(t);

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
		if (only) throw new Error('there can only be one only test');
		if (conf_.noOnly) throw new Error('`only` tests are prohibited');
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

	var stream = harness.createStream({ objectMode: conf.objectMode }),
		es = stream.pipe(conf.stream || createDefaultStream());
	canEmitExit &&
		es.on('error', function (_err) { harness._exitCode = 1; });

	var ended = false;
	stream.on('end', function () { ended = true; });

	if (config.exit === false || !canEmitExit || !canExit) return harness;

	process.on('exit', function (code) {
		if (code !== 0) return;

		if (!ended)
			for (var only = harness._results._only, i = 0; i < harness._tests.length; i++) {
				var t = harness._tests[i];
				(only && t !== only) || t._exit();
			}

		harness.close();
		process.exit(code || harness._exitCode);
	});

	return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = module.exports;
exports.test.skip = Test.skip;

},
// 8
function (module, exports, __webpack_require__) {

var through = __webpack_require__(0),
	fs = __webpack_require__(10);

module.exports = function () {
	var line = '',
		stream = through(write, flush);
	return stream;

	function write(buf) {
		for (var i = 0; i < buf.length; i++) {
			var c = typeof buf == 'string' ? buf.charAt(i) : String.fromCharCode(buf[i]);
			c === '\n' ? flush() : (line += c);
		}
	}

	function flush() {
		if (fs.writeSync && /^win/.test(process.platform))
			try {
				fs.writeSync(1, line + '\n');
			} catch (e) {
				stream.emit('error', e);
			}
		else
			try {
				console.log(line);
			} catch (e) {
				stream.emit('error', e);
			}

		line = '';
	}
};

},
// 9
function (module) {

module.exports = require('stream');

},
// 10
function (module) {

module.exports = require('fs');

},
// 11
function (module, exports, __webpack_require__) {

var deepEqual = __webpack_require__(12),
	defined = __webpack_require__(1),
	path = __webpack_require__(17),
	inherits = __webpack_require__(3),
	EventEmitter = __webpack_require__(5).EventEmitter,
	callBound = function (fn) { return Function.call.bind(fn); },
	has = callBound(Object.prototype.hasOwnProperty),
	isRegExp = __webpack_require__(2),
	trim = callBound(String.prototype.trim),
	forEach = callBound(Array.prototype.forEach),
	inspect = __webpack_require__(6),
	isEnumerable = callBound(Object.prototype.propertyIsEnumerable),
	toLowerCase = callBound(String.prototype.toLowerCase),
	$exec = callBound(RegExp.prototype.exec),
	objectToString = callBound(Object.prototype.toString),

	nextTick = typeof setImmediate != 'undefined' ? setImmediate : process.nextTick,
	safeSetTimeout = setTimeout,
	safeClearTimeout = clearTimeout;

function getTestArgs(name_, opts_, cb_) {
	var cb,
		name = '(anonymous)',
		opts = {};

	for (var i = 0; i < arguments.length; i++) {
		var arg = arguments[i],
			t = typeof arg;
		if (t === 'string') name = arg;
		else if (t === 'object') opts = arg || opts;
		else if (t === 'function') cb = arg;
	}
	return { name: name, opts: opts, cb: cb };
}

function Test(name_, opts_, cb_) {
	if (!(this instanceof Test)) return new Test(name_, opts_, cb_);

	var args = getTestArgs(name_, opts_, cb_);

	this.readable = true;
	this.name = args.name || '(anonymous)';
	this.assertCount = 0;
	this.pendingCount = 0;
	this._skip = args.opts.skip || false;
	this._todo = args.opts.todo || false;
	this._timeout = args.opts.timeout;
	this._plan = void 0;
	this._cb = args.cb;
	this._progeny = [];
	this._teardown = [];
	this._ok = true;
	var depthEnvVar = process.env.NODE_TAPE_OBJECT_PRINT_DEPTH;
	this._objectPrintDepth = args.opts.objectPrintDepth
		? args.opts.objectPrintDepth
		: depthEnvVar
		? toLowerCase(depthEnvVar) === 'infinity'
			? Infinity
			: depthEnvVar
		: 5;

	for (var prop in this)
		this[prop] = (function (self, val) {
			return typeof val == 'function'
				? function () { return val.apply(self, arguments); }
				: val;
		})(this, this[prop]);
}

inherits(Test, EventEmitter);

Test.prototype.run = function () {
	this.emit('prerun');
	if (!this._cb || this._skip) {
		this._end();
		return;
	}
	this._timeout == null || this.timeoutAfter(this._timeout);

	this._cb(this);
	this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
	var self = this,
		t = new Test(name, opts, cb);
	this._progeny.push(t);
	this.pendingCount++;
	this.emit('test', t);
	t.on('prerun', function () {
		self.assertCount++;
	});

	self._pendingAsserts() ||
		nextTick(function () {
			self._end();
		});

	nextTick(function () {
		self._plan || self.pendingCount != self._progeny.length || self._end();
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
	if (!ms) throw new Error('timeoutAfter requires a timespan');
	var self = this;
	var timeout = safeSetTimeout(function () {
		self.fail(self.name + ' timed out after ' + ms + 'ms');
		self.end();
	}, ms);
	this.once('end', function () {
		safeClearTimeout(timeout);
	});
};

Test.prototype.end = function (err) {
	arguments.length > 0 && err && this.ifError(err);

	this.calledEnd && this.fail('.end() already called');

	this.calledEnd = true;
	this._end();
};

Test.prototype.teardown = function (fn) {
	typeof fn != 'function'
		? this.fail('teardown: ' + inspect(fn) + ' is not a function')
		: this._teardown.push(fn);
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
		self.ended || self.emit('end');
		var pendingAsserts = self._pendingAsserts();
		if (!self._planError && self._plan !== void 0 && pendingAsserts) {
			self._planError = true;
			self.fail('plan != count', { expected: self._plan, actual: self.assertCount });
		}
		self.ended = true;
	}

	function next(i) {
		if (i === self._teardown.length) {
			completeEnd();
			return;
		}
		var res,
			fn = self._teardown[i];
		try {
			res = fn();
		} catch (e) {
			self.fail(e);
		}
		res && typeof res.then == 'function'
			? res.then(function () {
					next(++i);
				}, function (_err) {
					err = err || _err;
			  })
			: next(++i);
	}

	this._teardown.length > 0 ? next(0) : completeEnd();
};

Test.prototype._exit = function () {
	if (this._plan !== void 0 && !this._planError && this.assertCount !== this._plan) {
		this._planError = true;
		this.fail('plan != count', { expected: this._plan, actual: this.assertCount, exiting: true });
	} else this.ended || this.fail('test exited without ending: ' + this.name, { exiting: true });
};

Test.prototype._pendingAsserts = function () {
	return this._plan === void 0 ? 1 : this._plan - (this._progeny.length + this.assertCount);
};

Test.prototype._assert = function (ok, opts) {
	var self = this,
		extra = opts.extra || {};

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
	if (has(opts, 'actual') || has(extra, 'actual')) res.actual = defined(extra.actual, opts.actual);

	if (has(opts, 'expected') || has(extra, 'expected')) res.expected = defined(extra.expected, opts.expected);

	this._ok = !(!this._ok || !ok);

	ok || res.todo || (res.error = defined(extra.error, opts.error, new Error(res.name)));

	if (!ok) {
		var err = (new Error('exception').stack || '').split('\n'),
			dir = __dirname + path.sep;

		for (var i = 0; i < err.length; i++) {
			var re = /^(?:[^\s]*\s*\bat\s+)(?:(.*)\s+\()?((?:\/|[a-zA-Z]:\\)[^:)]+:(\d+)(?::(\d+))?)\)?$/,
				lineWithTokens = err[i].replace(process.cwd(), '/$CWD').replace(__dirname, '/$TEST'),
				m = re.exec(lineWithTokens);

			if (!m) continue;

			var callDescription = m[1] || '<anonymous>',
				filePath = m[2].replace('/$CWD', process.cwd()).replace('/$TEST', __dirname);

			if (filePath.slice(0, dir.length) === dir) continue;

			res.functionName = callDescription.split(/\s+/)[0];
			res.file = filePath;
			res.line = Number(m[3]);
			if (m[4]) res.column = Number(m[4]);

			res.at = callDescription + ' (' + filePath + ')';
			break;
		}
	}

	self.emit('result', res);

	var pendingAsserts = self._pendingAsserts();
	pendingAsserts ||
		(extra.exiting
			? self._end()
			: nextTick(function () {
					self._end();
			  }));

	if (!self._planError && pendingAsserts < 0) {
		self._planError = true;
		self.fail('plan != count', { expected: self._plan, actual: self._plan - pendingAsserts });
	}
};

Test.prototype.fail = function (msg, extra) {
	this._assert(false, { message: msg, operator: 'fail', extra: extra });
};

Test.prototype.pass = function (msg, extra) {
	this._assert(true, { message: msg, operator: 'pass', extra: extra });
};

Test.prototype.skip = function (msg, extra) {
	this._assert(true, { message: msg, operator: 'skip', skip: true, extra: extra });
};

var tapeAssert = function (value, msg, extra) {
	this._assert(value, {
		message: defined(msg, 'should be truthy'),
		operator: 'ok',
		expected: true,
		actual: value,
		extra: extra
	});
};
Test.prototype.ok = Test.prototype.true = Test.prototype.assert = tapeAssert;

function notOK(value, msg, extra) {
	this._assert(!value, {
		message: defined(msg, 'should be falsy'),
		operator: 'notOk',
		expected: false,
		actual: value,
		extra: extra
	});
}
Test.prototype.notOk = Test.prototype.false = Test.prototype.notok = notOK;

function error(err, msg, extra) {
	this._assert(!err, { message: defined(msg, String(err)), operator: 'error', actual: err, extra: extra });
}
Test.prototype.error = Test.prototype.ifError = Test.prototype.ifErr = Test.prototype.iferror = error;

function equal(a, b, msg, extra) {
	this._assert(a === b, {
		message: defined(msg, 'should be equal'),
		operator: 'equal',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.equal =
	Test.prototype.equals =
	Test.prototype.isEqual =
	Test.prototype.is =
	Test.prototype.strictEqual =
	Test.prototype.strictEquals = equal;

function notEqual(a, b, msg, extra) {
	this._assert(a !== b, {
		message: defined(msg, 'should not be equal'),
		operator: 'notEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notEqual =
	Test.prototype.notEquals =
	Test.prototype.notStrictEqual =
	Test.prototype.notStrictEquals =
	Test.prototype.isNotEqual =
	Test.prototype.isNot =
	Test.prototype.not =
	Test.prototype.doesNotEqual =
	Test.prototype.isInequal = notEqual;

function tapeDeepEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepEqual =
	Test.prototype.deepEquals =
	Test.prototype.isEquivalent =
	Test.prototype.same = tapeDeepEqual;

function deepLooseEqual(a, b, msg, extra) {
	this._assert(deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'deepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.deepLooseEqual = Test.prototype.looseEqual = Test.prototype.looseEquals = deepLooseEqual;

function notDeepEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b, { strict: true }), {
		message: defined(msg, 'should not be equivalent'),
		operator: 'notDeepEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepEqual =
	Test.prototype.notDeepEquals =
	Test.prototype.notEquivalent =
	Test.prototype.notDeeply =
	Test.prototype.notSame =
	Test.prototype.isNotDeepEqual =
	Test.prototype.isNotDeeply =
	Test.prototype.isNotEquivalent =
	Test.prototype.isInequivalent = notDeepEqual;

function notDeepLooseEqual(a, b, msg, extra) {
	this._assert(!deepEqual(a, b), {
		message: defined(msg, 'should be equivalent'),
		operator: 'notDeepLooseEqual',
		actual: a,
		expected: b,
		extra: extra
	});
}
Test.prototype.notDeepLooseEqual =
	Test.prototype.notLooseEqual =
	Test.prototype.notLooseEquals = notDeepLooseEqual;

Test.prototype.throws = function (fn, expected, msg, extra) {
	if (typeof expected == 'string') {
		msg = expected;
		expected = void 0;
	}

	var caught;

	try {
		fn();
	} catch (err) {
		caught = { error: err };
		if (Object(err) === err && 'message' in err && (!isEnumerable(err, 'message') || !has(err, 'message')))
			try {
				var message = err.message;
				delete err.message;
				err.message = message;
			} catch (_) {}
	}

	var passed = caught;

	if (isRegExp(expected)) {
		passed = $exec(expected, caught && caught.error) !== null;
		expected = String(expected);
	}

	if (typeof expected == 'function' && caught) passed = caught.error instanceof expected;

	this._assert(typeof fn == 'function' && passed, {
		message: defined(msg, 'should throw'),
		operator: 'throws',
		actual: caught && caught.error,
		expected: expected,
		error: !passed && caught && caught.error,
		extra: extra
	});
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
	if (typeof expected == 'string') {
		msg = expected;
		expected = void 0;
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

Test.prototype.match = function (string, regexp, msg, extra) {
	if (!isRegExp(regexp))
		this._assert(false, {
			message: defined(
				msg,
				'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'
			),
			operator: 'match',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	else if (typeof string != 'string')
		this._assert(false, {
			message: defined(
				msg,
				'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'
			),
			operator: 'match',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'matched' : 'did not match') + ' the regular expression ' + inspect(regexp) +
				'. Input: ' + inspect(string)
		);
		this._assert(matches, { message: message, operator: 'match', actual: string, expected: regexp, extra: extra });
	}
};

Test.prototype.doesNotMatch = function (string, regexp, msg, extra) {
	if (!isRegExp(regexp))
		this._assert(false, {
			message: defined(
				msg,
				'The "regexp" argument must be an instance of RegExp. Received type ' + typeof regexp + ' (' + inspect(regexp) + ')'
			),
			operator: 'doesNotMatch',
			actual: objectToString(regexp),
			expected: '[object RegExp]',
			extra: extra
		});
	else if (typeof string != 'string')
		this._assert(false, {
			message: defined(
				msg,
				'The "string" argument must be of type string. Received type ' + typeof string + ' (' + inspect(string) + ')'
			),
			operator: 'doesNotMatch',
			actual: string === null ? null : typeof string,
			expected: 'string',
			extra: extra
		});
	else {
		var matches = $exec(regexp, string) !== null;
		var message = defined(
			msg,
			'The input ' + (matches ? 'was expected to not match' : 'did not match') + ' the regular expression ' +
				inspect(regexp) + '. Input: ' + inspect(string)
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
function (module, exports, __webpack_require__) {

var objectKeys = Object.keys,
  isArguments = __webpack_require__(13),
  is = typeof Object.is == 'function' ? Object.is : __webpack_require__(14),
  isRegex = __webpack_require__(2),
  flags = Function.call.bind(
    (/./mi.flags === 'im' && Object.getOwnPropertyDescriptor(RegExp.prototype, 'flags').get) || __webpack_require__(15)
  ),
  isDate = __webpack_require__(16),

  getTime = Date.prototype.getTime;

function deepEqual(actual, expected, options) {
  var opts = options || {};

  return (
    (opts.strict ? is(actual, expected) : actual === expected) ||
    (actual && expected && (typeof actual == 'object' || typeof expected == 'object')
      ? objEquiv(actual, expected, opts)
      : opts.strict ? is(actual, expected) : actual == expected)
  );
}

function isUndefinedOrNull(value) {
  return value === null || value === void 0;
}

function isBuffer(x) {
  return (
    !!x && typeof x == 'object' && typeof x.length == 'number' &&
    typeof x.copy == 'function' && typeof x.slice == 'function' &&
    !(x.length > 0 && typeof x[0] != 'number')
  );
}

function objEquiv(a, b, opts) {
  var i, key;
  if (
    typeof a != typeof b ||
    isUndefinedOrNull(a) || isUndefinedOrNull(b) ||
    a.prototype !== b.prototype ||
    isArguments(a) !== isArguments(b)
  )
    return false;

  var aIsRegex = isRegex(a),
    bIsRegex = isRegex(b);
  if (aIsRegex !== bIsRegex) return false;
  if (aIsRegex || bIsRegex) return a.source === b.source && flags(a) === flags(b);

  if (isDate(a) && isDate(b)) return getTime.call(a) === getTime.call(b);

  var aIsBuffer = isBuffer(a),
    bIsBuffer = isBuffer(b);
  if (aIsBuffer !== bIsBuffer) return false;
  if (aIsBuffer || bIsBuffer) {
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;

    return true;
  }

  if (typeof a != typeof b) return false;

  var ka, kb;
  try {
    ka = objectKeys(a);
    kb = objectKeys(b);
  } catch (_) {
    return false;
  }
  if (ka.length !== kb.length) return false;

  ka.sort();
  kb.sort();
  for (i = ka.length - 1; i >= 0; i--) if (ka[i] != kb[i]) return false;

  for (i = ka.length - 1; i >= 0; i--) if (!deepEqual(a[(key = ka[i])], b[key], opts)) return false;

  return true;
}

module.exports = deepEqual;

},
// 13
function (module) {

var hasToStringTag = typeof Symbol == 'function' && typeof Symbol.toStringTag == 'symbol',
	toStr = Object.prototype.toString;

var isStandardArguments = function (value) {
	return (
		!(hasToStringTag && value && typeof value == 'object' && Symbol.toStringTag in value) &&
		toStr.call(value) === '[object Arguments]'
	);
};

var isLegacyArguments = function (value) {
	return isStandardArguments(value) || (
		value !== null &&
		typeof value == 'object' &&
		typeof value.length == 'number' &&
		value.length >= 0 &&
		toStr.call(value) !== '[object Array]' &&
		toStr.call(value.callee) === '[object Function]'
	);
};

var supportsStandardArguments = (function () {
	return isStandardArguments(arguments);
})();

isStandardArguments.isLegacyArguments = isLegacyArguments;

module.exports = supportsStandardArguments ? isStandardArguments : isLegacyArguments;

},
// 14
function (module) {

var numberIsNaN = function (value) {
	return value !== value;
};

module.exports = function (a, b) {
	return a === 0 && b === 0 ? 1 / a == 1 / b : a === b || (numberIsNaN(a) && numberIsNaN(b));
};

},
// 15
function (module, exports) {

exports = module.exports = function () {
	if (this != null && this !== Object(this))
		throw new TypeError('RegExp.prototype.flags getter called on non-object');

	var result = '';
	if (this.hasIndices) result += 'd';

	if (this.global) result += 'g';
	if (this.ignoreCase) result += 'i';
	if (this.multiline) result += 'm';
	if (this.dotAll) result += 's';

	if (this.unicode) result += 'u';
	if (this.sticky) result += 'y';

	return result;
};

exports.name && Object.getOwnPropertyDescriptor(exports, 'name').configurable &&
	Object.defineProperty(exports, 'name', { value: 'get flags' });

},
// 16
function (module) {

var getDay = Date.prototype.getDay;
var tryDateObject = function (value) {
	try {
		getDay.call(value);
		return true;
	} catch (_) {
		return false;
	}
};

var toStr = Object.prototype.toString,
	dateClass = '[object Date]',
	hasToStringTag = typeof Symbol == 'function' && typeof Symbol.toStringTag == 'symbol';

module.exports = function (value) {
	return typeof value == 'object' && value !== null &&
		(hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass);
};

},
// 17
function (module) {

module.exports = require('path');

},
// 18
function (module) {

module.exports = typeof Object.create == 'function'
  ? function (ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
        })
      }
    }
  : function (ctor, superCtor) {
      if (superCtor) {
        ctor.super_ = superCtor
        var TempCtor = function () {}
        TempCtor.prototype = superCtor.prototype
        ctor.prototype = new TempCtor()
        ctor.prototype.constructor = ctor
      }
    }

},
// 19
function (module, exports, __webpack_require__) {

var defined = __webpack_require__(1),
	EventEmitter = __webpack_require__(5).EventEmitter,
	inherits = __webpack_require__(3),
	through = __webpack_require__(0),
	resumer = __webpack_require__(20),
	inspect = __webpack_require__(6),
	callBound = function (fn) { return Function.call.bind(fn); },
	has = callBound(Object.prototype.hasOwnProperty),
	$exec = callBound(RegExp.prototype.exec),
	yamlIndicators = /[:\-?]/,
	nextTick = typeof setImmediate != 'undefined' ? setImmediate : process.nextTick;

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

	if (res.skip)
		output += ' # SKIP' + (typeof res.skip == 'string' ? ' ' + coalesceWhiteSpaces(res.skip) : '');
	else if (res.todo)
		output += ' # TODO' + (typeof res.todo == 'string' ? ' ' + coalesceWhiteSpaces(res.todo) : '');

	output += '\n';
	if (res.ok) return output;

	var outer = '  ',
		inner = outer + '  ';
	output += outer + '---\n';
	output += inner + 'operator: ' + res.operator + '\n';

	if (has(res, 'expected') || has(res, 'actual')) {
		var ex = inspect(res.expected, { depth: res.objectPrintDepth }),
			ac = inspect(res.actual, { depth: res.objectPrintDepth });

		if (Math.max(ex.length, ac.length) > 65 || invalidYaml(ex) || invalidYaml(ac)) {
			output += inner + 'expected: |-\n' + inner + '  ' + ex + '\n';
			output += inner + 'actual: |-\n' + inner + '  ' + ac + '\n';
		} else {
			output += inner + 'expected: ' + ex + '\n';
			output += inner + 'actual:   ' + ac + '\n';
		}
	}
	if (res.at) output += inner + 'at: ' + res.at + '\n';

	var actualStack =
			res.actual && (typeof res.actual == 'object' || typeof res.actual == 'function') ? res.actual.stack : void 0,
		errorStack = res.error && res.error.stack,
		stack = defined(actualStack, errorStack);
	if (stack) {
		var lines = String(stack).split('\n');
		output += inner + 'stack: |-\n';
		for (var i = 0; i < lines.length; i++) output += inner + '  ' + lines[i] + '\n';
	}

	return output + (outer + '...\n');
}

function getNextTest(results) {
	if (!results._only) return results.tests.shift();

	do {
		var t = results.tests.shift();
		if (t && results._only === t) return t;
	} while (results.tests.length > 0);

	return void 0; // FIXME void undefined
}

function Results() {
	if (!(this instanceof Results)) return new Results();
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
	opts || (opts = {});
	var output,
		self = this,
		testId = 0;
	if (opts.objectMode) {
		output = through();
		self.on('_push', function ontest(t, extra) {
			extra || (extra = {});
			var id = testId++;
			t.once('prerun', function () {
				var row = { type: 'test', name: t.name, id: id, skip: t._skip, todo: t._todo };
				if (has(extra, 'parent')) row.parent = extra.parent;

				output.queue(row);
			});
			t.on('test', function (st) {
				ontest(st, { parent: id });
			});
			t.on('result', function (res) {
				if (res && typeof res == 'object') {
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
		(output = resumer()).queue('TAP version 13\n');
		self._stream.pipe(output);
	}

	if (!this._isRunning) {
		this._isRunning = true;
		nextTick(function next() {
			for (var t; (t = getNextTest(self)); ) {
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
		if (t._skip) premsg = 'SKIP ';
		else if (t._todo) premsg = 'TODO ';

		write('# ' + premsg + coalesceWhiteSpaces(t.name) + '\n');
	});

	t.on('result', function (res) {
		if (typeof res == 'string') {
			write('# ' + res + '\n');
			return;
		}
		write(encodeResult(res, self.count + 1));
		self.count++;

		if (res.ok || res.todo) self.pass++;
		else {
			self.fail++;
			self.emit('fail');
		}
	});

	t.on('test', function (st) { self._watch(st); });
};

Results.prototype.close = function () {
	var self = this;
	self.closed && self._stream.emit('error', new Error('ALREADY CLOSED'));
	self.closed = true;
	function write(s) { self._stream.queue(s); }

	write('\n1..' + self.count + '\n');
	write('# tests ' + self.count + '\n');
	write('# pass  ' + (self.pass + self.todo) + '\n');
	self.todo && write('# todo  ' + self.todo + '\n');
	self.fail ? write('# fail  ' + self.fail + '\n') : write('\n# ok\n');

	self._stream.queue(null);
};

module.exports = Results;

},
// 20
function (module, exports, __webpack_require__) {

var through = __webpack_require__(0),
	nextTick = typeof setImmediate != 'undefined' ? setImmediate : process.nextTick;

module.exports = function (write, end) {
	var tr = through(write, end);
	tr.pause();
	var resume = tr.resume,
		pause = tr.pause,
		paused = false;

	tr.pause = function () {
		paused = true;
		return pause.apply(this, arguments);
	};

	tr.resume = function () {
		paused = false;
		return resume.apply(this, arguments);
	};

	nextTick(function () {
		paused || tr.resume();
	});

	return tr;
};

}
]);

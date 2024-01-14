"use strict";

const util = require("util");

class Hook {
	constructor(args) {
		Array.isArray(args) || (args = []);
		this._args = args;
		this.taps = [];
		this.interceptors = [];
		this.call = this._call;
		this.promise = this._promise;
		this.callAsync = this._callAsync;
		this._x = void 0;
	}

	compile(options) {
		throw new Error("Abstract: should be overridden");
	}

	_createCall(type) {
		return this.compile({
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		});
	}

	tap(options, fn) {
		if (typeof options == "string") options = { name: options };
		if (typeof options != "object" || options === null)
			throw new Error("Invalid arguments to tap(options: Object, fn: function)");
		options = Object.assign({ type: "sync", fn: fn }, options);
		if (typeof options.name != "string" || options.name === "")
			throw new Error("Missing name for tap");
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tapAsync(options, fn) {
		if (typeof options == "string") options = { name: options };
		if (typeof options != "object" || options === null)
			throw new Error("Invalid arguments to tapAsync(options: Object, fn: function)");
		options = Object.assign({ type: "async", fn: fn }, options);
		if (typeof options.name != "string" || options.name === "")
			throw new Error("Missing name for tapAsync");
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tapPromise(options, fn) {
		if (typeof options == "string") options = { name: options };
		if (typeof options != "object" || options === null)
			throw new Error("Invalid arguments to tapPromise(options: Object, fn: function)");
		options = Object.assign({ type: "promise", fn: fn }, options);
		if (typeof options.name != "string" || options.name === "")
			throw new Error("Missing name for tapPromise");
		options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	_runRegisterInterceptors(options) {
		for (const interceptor of this.interceptors)
			if (interceptor.register) {
				const newOptions = interceptor.register(options);
				if (newOptions !== void 0) options = newOptions;
			}

		return options;
	}

	withOptions(options) {
		const mergeOptions = opt =>
			Object.assign({}, options, typeof opt == "string" ? { name: opt } : opt);

		options = Object.assign({}, options, this._withOptions);
		const base = this._withOptionsBase || this,
			newHook = Object.create(base);

		newHook.tapAsync = (opt, fn) => base.tapAsync(mergeOptions(opt), fn);
		newHook.tap = (opt, fn) => base.tap(mergeOptions(opt), fn);
		newHook.tapPromise = (opt, fn) => base.tapPromise(mergeOptions(opt), fn);
		newHook._withOptions = options;
		newHook._withOptionsBase = base;
		return newHook;
	}

	isUsed() {
		return this.taps.length > 0 || this.interceptors.length > 0;
	}

	intercept(interceptor) {
		this._resetCompilation();
		this.interceptors.push(Object.assign({}, interceptor));
		if (interceptor.register)
			for (let i = 0; i < this.taps.length; i++)
				this.taps[i] = interceptor.register(this.taps[i]);
	}

	_resetCompilation() {
		this.call = this._call;
		this.callAsync = this._callAsync;
		this.promise = this._promise;
	}

	_insert(item) {
		this._resetCompilation();
		let before;
		if (typeof item.before == "string") before = new Set([item.before]);
		else if (Array.isArray(item.before)) before = new Set(item.before);

		let stage = 0;
		if (typeof item.stage == "number") stage = item.stage;
		let i = this.taps.length;
		while (i > 0) {
			i--;
			const x = this.taps[i];
			this.taps[i + 1] = x;
			const xStage = x.stage || 0;
			if (before) {
				if (before.has(x.name)) {
					before.delete(x.name);
					continue;
				}
				if (before.size > 0) continue;
			}
			if (xStage > stage) continue;

			i++;
			break;
		}
		this.taps[i] = item;
	}
}

function createCompileDelegate(name, type) {
	return function(...args) {
		this[name] = this._createCall(type);
		return this[name](...args);
	};
}

Object.defineProperties(Hook.prototype, {
	_call: {
		value: createCompileDelegate("call", "sync"),
		configurable: true,
		writable: true
	},
	_promise: {
		value: createCompileDelegate("promise", "promise"),
		configurable: true,
		writable: true
	},
	_callAsync: {
		value: createCompileDelegate("callAsync", "async"),
		configurable: true,
		writable: true
	}
});

class HookCodeFactory {
	constructor(config) {
		this.config = config;
		this.options = void 0;
		this._args = void 0;
	}

	create(options) {
		this.init(options);
		let fn;
		switch (this.options.type) {
			case "sync":
				fn = new Function(
					this.args(),
					'"use strict";\n' +
						this.header() +
						this.content({
							onError: err => `throw ${err};\n`,
							onResult: result => `return ${result};\n`,
							resultReturns: true,
							onDone: () => "",
							rethrowIfPossible: true
						})
				);
				break;
			case "async":
				fn = new Function(
					this.args({ after: "_callback" }),
					'"use strict";\n' +
						this.header() +
						this.content({
							onError: err => `_callback(${err});\n`,
							onResult: result => `_callback(null, ${result});\n`,
							onDone: () => "_callback();\n"
						})
				);
				break;
			case "promise":
				let errorHelperUsed = false;
				const content = this.content({
					onError: err => ((errorHelperUsed = true), `_error(${err});\n`),
					onResult: result => `_resolve(${result});\n`,
					onDone: () => "_resolve();\n"
				});
				let code = '"use strict";\nreturn new Promise((_resolve, _reject) => {\n';
				if (errorHelperUsed)
					code +=
						"var _sync = true;\nfunction _error(_err) {\nif(_sync)\n_resolve(Promise.resolve().then(() => { throw _err; }));\nelse\n_reject(_err);\n};\n";

				code += this.header() + content;
				if (errorHelperUsed) code += "_sync = false;\n";

				code += "});\n";
				fn = new Function(this.args(), code);
				break;
		}
		this.deinit();
		return fn;
	}

	setup(instance, options) {
		instance._x = options.taps.map(t => t.fn);
	}

	init(options) {
		this.options = options;
		this._args = options.args.slice();
	}

	deinit() {
		this.options = void 0;
		this._args = void 0;
	}

	header() {
		let code = this.needContext() ? "var _context = {};\n" : "var _context;\n";

		code += "var _x = this._x;\n";
		if (this.options.interceptors.length > 0)
			code += "var _taps = this.taps;\nvar _interceptors = this.interceptors;\n";

		for (let i = 0; i < this.options.interceptors.length; i++) {
			const interceptor = this.options.interceptors[i];
			if (interceptor.call)
				code += `${this.getInterceptor(i)}.call(${this.args({
					before: interceptor.context ? "_context" : void 0
				})});\n`;
		}
		return code;
	}

	needContext() {
		for (const tap of this.options.taps) if (tap.context) return true;
		return false;
	}

	callTap(tapIndex, { onError, onResult, onDone, rethrowIfPossible }) {
		let code = "";
		for (let hasTapCached = false, i = 0; i < this.options.interceptors.length; i++) {
			const interceptor = this.options.interceptors[i];
			if (interceptor.tap) {
				if (!hasTapCached) {
					code += `var _tap${tapIndex} = ${this.getTap(tapIndex)};\n`;
					hasTapCached = true;
				}
				code += `${this.getInterceptor(i)}.tap(${
					interceptor.context ? "_context, " : ""
				}_tap${tapIndex});\n`;
			}
		}
		code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
		const tap = this.options.taps[tapIndex];
		switch (tap.type) {
			case "sync":
				rethrowIfPossible || (code += `var _hasError${tapIndex} = false;\ntry {\n`);

				code += onResult
					? `var _result${tapIndex} = _fn${tapIndex}(${this.args({
							before: tap.context ? "_context" : void 0
					  })});\n`
					: `_fn${tapIndex}(${this.args({
							before: tap.context ? "_context" : void 0
					  })});\n`;

				if (!rethrowIfPossible)
					code += `} catch(_err) {\n_hasError${tapIndex} = true;\n${onError(
						"_err"
					)}}\nif(!_hasError${tapIndex}) {\n`;

				if (onResult) code += onResult("_result" + tapIndex);
				if (onDone) code += onDone();

				rethrowIfPossible || (code += "}\n");
				break;
			case "async":
				let cbCode = onResult
					? `(_err${tapIndex}, _result${tapIndex}) => {\n`
					: `_err${tapIndex} => {\n`;
				cbCode += `if(_err${tapIndex}) {\n${onError("_err" + tapIndex)}} else {\n`;

				if (onResult) cbCode += onResult("_result" + tapIndex);
				if (onDone) cbCode += onDone();

				cbCode += "}\n}";
				code += `_fn${tapIndex}(${this.args({
					before: tap.context ? "_context" : void 0,
					after: cbCode
				})});\n`;
				break;
			case "promise":
				code += `var _hasResult${tapIndex} = false;\nvar _promise${tapIndex} = _fn${tapIndex}(${this.args(
					{ before: tap.context ? "_context" : void 0 }
				)});\nif (!_promise${tapIndex} || !_promise${tapIndex}.then)\n  throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise${tapIndex} + ')');\n_promise${tapIndex}.then(_result${tapIndex} => {\n_hasResult${tapIndex} = true;\n`;

				if (onResult) code += onResult("_result" + tapIndex);
				if (onDone) code += onDone();

				code += `}, _err${tapIndex} => {\nif(_hasResult${tapIndex}) throw _err${tapIndex};\n${onError(
					"_err" + tapIndex
				)}});\n`;
				break;
		}
		return code;
	}

	callTapsSeries({
		onError,
		onResult,
		resultReturns,
		onDone,
		doneReturns,
		rethrowIfPossible
	}) {
		if (this.options.taps.length === 0) return onDone();
		const firstAsync = this.options.taps.findIndex(t => t.type !== "sync"),
			somethingReturns = resultReturns || doneReturns || false;
		let code = "",
			current = onDone;
		for (let j = this.options.taps.length - 1; j >= 0; j--) {
			const i = j;
			if (current !== onDone && this.options.taps[i].type !== "sync") {
				code += `function _next${i}() {\n${current()}}\n`;
				current = () => `${somethingReturns ? "return " : ""}_next${i}();\n`;
			}
			const done = current,
				doneBreak = skipDone => (skipDone ? "" : onDone());
			const content = this.callTap(i, {
				onError: error => onError(i, error, done, doneBreak),
				onResult: onResult && (result => onResult(i, result, done, doneBreak)),
				onDone: !onResult && done,
				rethrowIfPossible: rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
			});
			current = () => content;
		}
		code += current();
		return code;
	}

	callTapsLooping({ onError, onDone, rethrowIfPossible }) {
		if (this.options.taps.length === 0) return onDone();
		const syncOnly = this.options.taps.every(t => t.type === "sync");
		let code = "";
		syncOnly || (code += "var _looper = () => {\nvar _loopAsync = false;\n");

		code += "var _loop;\ndo {\n_loop = false;\n";
		for (let i = 0; i < this.options.interceptors.length; i++) {
			const interceptor = this.options.interceptors[i];
			if (interceptor.loop)
				code += `${this.getInterceptor(i)}.loop(${this.args({
					before: interceptor.context ? "_context" : void 0
				})});\n`;
		}
		code += this.callTapsSeries({
			onError,
			onResult: (i, result, next, doneBreak) => {
				let code = `if(${result} !== undefined) {\n_loop = true;\n`;
				syncOnly || (code += "if(_loopAsync) _looper();\n");
				code += doneBreak(true) + "} else {\n" + next() + "}\n";
				return code;
			},
			onDone: onDone && (() => "if(!_loop) {\n" + onDone() + "}\n"),
			rethrowIfPossible: rethrowIfPossible && syncOnly
		});
		code += "} while(_loop);\n";
		syncOnly || (code += "_loopAsync = true;\n};\n_looper();\n");

		return code;
	}

	callTapsParallel({
		onError,
		onResult,
		onDone,
		rethrowIfPossible,
		onTap = (i, run) => run()
	}) {
		if (this.options.taps.length <= 1)
			return this.callTapsSeries({ onError, onResult, onDone, rethrowIfPossible });

		let code = `do {\nvar _counter = ${this.options.taps.length};\n`;
		if (onDone) code += "var _done = () => {\n" + onDone() + "};\n";

		for (let i = 0; i < this.options.taps.length; i++) {
			const done = () => (onDone ? "if(--_counter === 0) _done();\n" : "--_counter;"),
				doneBreak = skipDone =>
					skipDone || !onDone ? "_counter = 0;\n" : "_counter = 0;\n_done();\n";
			code += "if(_counter <= 0) break;\n";
			code += onTap(
				i,
				() =>
					this.callTap(i, {
						onError: error =>
							"if(_counter > 0) {\n" + onError(i, error, done, doneBreak) + "}\n",
						onResult:
							onResult &&
							(result =>
								"if(_counter > 0) {\n" + onResult(i, result, done, doneBreak) + "}\n"),
						onDone: !onResult && (() => done()),
						rethrowIfPossible
					}),
				done,
				doneBreak
			);
		}
		code += "} while(false);\n";
		return code;
	}

	args({ before, after } = {}) {
		let allArgs = this._args;
		if (before) allArgs = [before].concat(allArgs);
		if (after) allArgs = allArgs.concat(after);
		return allArgs.length === 0 ? "" : allArgs.join(", ");
	}

	getTapFn(idx) {
		return `_x[${idx}]`;
	}

	getTap(idx) {
		return `_taps[${idx}]`;
	}

	getInterceptor(idx) {
		return `_interceptors[${idx}]`;
	}
}

class SyncBailHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, resultReturns, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${onResult(result)};\n} else {\n${next()}}\n`,
			resultReturns,
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncBailHookCodeFactory();

class SyncBailHook extends Hook {
	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncBailHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncBailHook");
	}

	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}

function Tapable() {
	this._pluginCompat = new SyncBailHook(["options"]);
	this._pluginCompat.tap({ name: "Tapable camelCase", stage: 100 }, options => {
		options.names.add(
			options.name.replace(/[- ]([a-z])/g, (str, ch) => ch.toUpperCase())
		);
	});
	this._pluginCompat.tap({ name: "Tapable this.hooks", stage: 200 }, options => {
		let hook;
		for (const name of options.names) {
			hook = this.hooks[name];
			if (hook !== void 0) break;
		}
		if (hook !== void 0) {
			const tapOpt = {
				name: options.fn.name || "unnamed compat plugin",
				stage: options.stage || 0
			};
			options.async ? hook.tapAsync(tapOpt, options.fn) : hook.tap(tapOpt, options.fn);
			return true;
		}
	});
}

Tapable.addCompatLayer = function(instance) {
	Tapable.call(instance);
	instance.plugin = Tapable.prototype.plugin;
	instance.apply = Tapable.prototype.apply;
};

Tapable.prototype.plugin = util.deprecate(function(name, fn) {
	if (Array.isArray(name))
		name.forEach(function(name) {
			this.plugin(name, fn);
		}, this);
	else if (!this._pluginCompat.call({ name: name, fn: fn, names: new Set([name]) }))
		throw new Error(
			`Plugin could not be registered at '${name}'. Hook was not found.\nBREAKING CHANGE: There need to exist a hook at 'this.hooks'. To create a compatibility layer for this hook, hook into 'this._pluginCompat'.`
		);
}, "Tapable.plugin is deprecated. Use new API on `.hooks` instead");

Tapable.prototype.apply = util.deprecate(function() {
	for (var i = 0; i < arguments.length; i++) arguments[i].apply(this);
}, "Tapable.apply is deprecated. Call apply on the plugin directly instead");

class SyncHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory$1 = new SyncHookCodeFactory();

class SyncHook extends Hook {
	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncHook");
	}

	compile(options) {
		factory$1.setup(this, options);
		return factory$1.create(options);
	}
}

class SyncWaterfallHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, resultReturns, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${this._args[0]} = ${result};\n}\n${next()}`,
			onDone: () => onResult(this._args[0]),
			doneReturns: resultReturns,
			rethrowIfPossible
		});
	}
}

const factory$2 = new SyncWaterfallHookCodeFactory();

class SyncWaterfallHook extends Hook {
	constructor(args) {
		super(args);
		if (args.length < 1)
			throw new Error("Waterfall hooks must have at least one argument");
	}

	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncWaterfallHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncWaterfallHook");
	}

	compile(options) {
		factory$2.setup(this, options);
		return factory$2.create(options);
	}
}

class SyncLoopHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone, rethrowIfPossible }) {
		return this.callTapsLooping({
			onError: (i, err) => onError(err),
			onDone,
			rethrowIfPossible
		});
	}
}

const factory$3 = new SyncLoopHookCodeFactory();

class SyncLoopHook extends Hook {
	tapAsync() {
		throw new Error("tapAsync is not supported on a SyncLoopHook");
	}

	tapPromise() {
		throw new Error("tapPromise is not supported on a SyncLoopHook");
	}

	compile(options) {
		factory$3.setup(this, options);
		return factory$3.create(options);
	}
}

class AsyncParallelHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone }) {
		return this.callTapsParallel({
			onError: (i, err, done, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory$4 = new AsyncParallelHookCodeFactory();

class AsyncParallelHook extends Hook {
	compile(options) {
		factory$4.setup(this, options);
		return factory$4.create(options);
	}
}

Object.defineProperties(AsyncParallelHook.prototype, {
	_call: { value: void 0, configurable: true, writable: true }
});

class AsyncParallelBailHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, onDone }) {
		let code = `var _results = new Array(${
			this.options.taps.length
		});\nvar _checkDone = () => {\nfor(var i = 0; i < _results.length; i++) {\nvar item = _results[i];\nif(item === undefined) return false;\nif(item.result !== undefined) {\n${onResult(
			"item.result"
		)}return true;\n}\nif(item.error) {\n${onError(
			"item.error"
		)}return true;\n}\n}\nreturn false;\n}\n`;
		code += this.callTapsParallel({
			onError: (i, err, done, doneBreak) =>
				`if(${i} < _results.length && ((_results.length = ${
					i + 1
				}), (_results[${i}] = { error: ${err} }), _checkDone())) {\n${doneBreak(
					true
				)}} else {\n${done()}}\n`,
			onResult: (i, result, done, doneBreak) =>
				`if(${i} < _results.length && (${result} !== undefined && (_results.length = ${
					i + 1
				}), (_results[${i}] = { result: ${result} }), _checkDone())) {\n${doneBreak(
					true
				)}} else {\n${done()}}\n`,
			onTap: (i, run, done, doneBreak) => {
				let code = "";
				if (i > 0) code += `if(${i} >= _results.length) {\n${done()}} else {\n`;

				code += run();
				if (i > 0) code += "}\n";
				return code;
			},
			onDone
		});
		return code;
	}
}

const factory$5 = new AsyncParallelBailHookCodeFactory();

class AsyncParallelBailHook extends Hook {
	compile(options) {
		factory$5.setup(this, options);
		return factory$5.create(options);
	}
}

Object.defineProperties(AsyncParallelBailHook.prototype, {
	_call: { value: void 0, configurable: true, writable: true }
});

class AsyncSeriesHookCodeFactory extends HookCodeFactory {
	content({ onError, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory$6 = new AsyncSeriesHookCodeFactory();

class AsyncSeriesHook extends Hook {
	compile(options) {
		factory$6.setup(this, options);
		return factory$6.create(options);
	}
}

Object.defineProperties(AsyncSeriesHook.prototype, {
	_call: { value: void 0, configurable: true, writable: true }
});

class AsyncSeriesBailHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, resultReturns, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${onResult(result)};\n} else {\n${next()}}\n`,
			resultReturns,
			onDone
		});
	}
}

const factory$7 = new AsyncSeriesBailHookCodeFactory();

class AsyncSeriesBailHook extends Hook {
	compile(options) {
		factory$7.setup(this, options);
		return factory$7.create(options);
	}
}

Object.defineProperties(AsyncSeriesBailHook.prototype, {
	_call: { value: void 0, configurable: true, writable: true }
});

class AsyncSeriesWaterfallHookCodeFactory extends HookCodeFactory {
	content({ onError, onResult, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${this._args[0]} = ${result};\n}\n${next()}`,
			onDone: () => onResult(this._args[0])
		});
	}
}

const factory$8 = new AsyncSeriesWaterfallHookCodeFactory();

class AsyncSeriesWaterfallHook extends Hook {
	constructor(args) {
		super(args);
		if (args.length < 1)
			throw new Error("Waterfall hooks must have at least one argument");
	}

	compile(options) {
		factory$8.setup(this, options);
		return factory$8.create(options);
	}
}

Object.defineProperties(AsyncSeriesWaterfallHook.prototype, {
	_call: { value: void 0, configurable: true, writable: true }
});

class HookMap {
	constructor(factory) {
		this._map = new Map();
		this._factory = factory;
		this._interceptors = [];
	}

	get(key) {
		return this._map.get(key);
	}

	for(key) {
		const hook = this.get(key);
		if (hook !== void 0) return hook;

		let newHook = this._factory(key);
		const interceptors = this._interceptors;
		for (let i = 0; i < interceptors.length; i++)
			newHook = interceptors[i].factory(key, newHook);

		this._map.set(key, newHook);
		return newHook;
	}

	intercept(interceptor) {
		this._interceptors.push(
			Object.assign({ factory: (key, hook) => hook }, interceptor)
		);
	}

	tap(key, options, fn) {
		return this.for(key).tap(options, fn);
	}

	tapAsync(key, options, fn) {
		return this.for(key).tapAsync(options, fn);
	}

	tapPromise(key, options, fn) {
		return this.for(key).tapPromise(options, fn);
	}
}

class MultiHook {
	constructor(hooks) {
		this.hooks = hooks;
	}

	tap(options, fn) {
		for (const hook of this.hooks) hook.tap(options, fn);
	}

	tapAsync(options, fn) {
		for (const hook of this.hooks) hook.tapAsync(options, fn);
	}

	tapPromise(options, fn) {
		for (const hook of this.hooks) hook.tapPromise(options, fn);
	}

	isUsed() {
		for (const hook of this.hooks) if (hook.isUsed()) return true;

		return false;
	}

	intercept(interceptor) {
		for (const hook of this.hooks) hook.intercept(interceptor);
	}

	withOptions(options) {
		return new MultiHook(this.hooks.map(h => h.withOptions(options)));
	}
}

exports.__esModule = true;
exports.Tapable = Tapable;
exports.SyncHook = SyncHook;
exports.SyncBailHook = SyncBailHook;
exports.SyncWaterfallHook = SyncWaterfallHook;
exports.SyncLoopHook = SyncLoopHook;
exports.AsyncParallelHook = AsyncParallelHook;
exports.AsyncParallelBailHook = AsyncParallelBailHook;
exports.AsyncSeriesHook = AsyncSeriesHook;
exports.AsyncSeriesBailHook = AsyncSeriesBailHook;
exports.AsyncSeriesWaterfallHook = AsyncSeriesWaterfallHook;
exports.HookMap = HookMap;
exports.MultiHook = MultiHook;

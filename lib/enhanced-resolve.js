"use strict";

const util = require("util"),
	tapable = require("./tapable"),
	path = require("path"),
	fs = require("../vendor/graceful-fs");

function createInnerContext(options, message, messageOptional) {
	let messageReported = false;
	return {
		log: (() =>
			!options.log ? void 0 : !message ? options.log : msg => {
				if (!messageReported) {
					options.log(message);
					messageReported = true;
				}
				options.log("  " + msg);
			})(),
		stack: options.stack,
		missing: options.missing
	};
}

function normalize(path) {
	var parts = path.split(/(\\+|\/+)/);
	if (parts.length === 1) return path;
	var result = [],
		absolutePathStart = 0;
	for (var i = 0, sep = false; i < parts.length; i += 1, sep = !sep) {
		var part = parts[i];
		if (i === 0 && /^([A-Z]:)?$/i.test(part)) {
			result.push(part);
			absolutePathStart = 2;
		} else if (sep)
			i === 1 && parts[0].length === 0 && part === "\\\\"
				? result.push(part)
				: result.push(part[0]);
		else if (part === "..")
			switch (result.length) {
				case 0:
					result.push(part);
					break;
				case 2:
					if (result[0] !== ".") {
						i += 1;
						sep = !sep;
						result.length = absolutePathStart;
					} else {
						result.length = 0;
						result.push(part);
					}
					break;
				case 4:
					if (absolutePathStart === 0) result.length -= 3;
					else {
						i += 1;
						sep = !sep;
						result.length = 2;
					}
					break;
				default:
					result.length -= 3;
					break;
			}
		else if (part === ".")
			switch (result.length) {
				case 0:
					result.push(part);
					break;
				case 2:
					if (absolutePathStart === 0) result.length -= 1;
					else {
						i += 1;
						sep = !sep;
					}
					break;
				default:
					result.length -= 1;
					break;
			}
		else part && result.push(part);
	}
	return result.length === 1 && /^[A-Za-z]:$/.test(result[0])
		? result[0] + "\\"
		: result.join("");
}

const absoluteWinRegExp = /^[A-Z]:([\\\/]|$)/i,
	absoluteNixRegExp = /^\//i;

function join(path, request) {
	return !request ? normalize(path)
		: absoluteWinRegExp.test(request) ? normalize(request.replace(/\//g, "\\"))
		: absoluteNixRegExp.test(request) ? normalize(request)
		: path == "/" ? normalize(path + request)
		: absoluteWinRegExp.test(path)
		? normalize(path.replace(/\//g, "\\") + "\\" + request.replace(/\//g, "\\"))
		: normalize(path + "/" + request);
}

const REGEXP_NOT_MODULE = /^\.$|^\.[\\/]|^\.\.$|^\.\.[\\/]|^\/|^[A-Z]:[\\/]/i,
	REGEXP_DIRECTORY = /[\\/]$/i,

	memoizedJoin = new Map();

function withName(name, hook) {
	hook.name = name;
	return hook;
}

function toCamelCase(str) {
	return str.replace(/-([a-z])/g, str => str.substr(1).toUpperCase());
}

const deprecatedPushToMissing = util.deprecate((set, item) => {
	set.add(item);
}, "Resolver: 'missing' is now a Set. Use add instead of push.");

const deprecatedResolveContextInCallback = util.deprecate(
	x => x,
	"Resolver: The callback argument was splitted into resolveContext and callback."
);

const deprecatedHookAsString = util.deprecate(
	x => x,
	"Resolver#doResolve: The type arguments (string) is now a hook argument (Hook). Pass a reference to the hook instead."
);

class Resolver extends tapable.Tapable {
	constructor(fileSystem) {
		super();
		this.fileSystem = fileSystem;
		this.hooks = {
			resolveStep: withName("resolveStep", new tapable.SyncHook(["hook", "request"])),
			noResolve: withName("noResolve", new tapable.SyncHook(["request", "error"])),
			resolve: withName(
				"resolve",
				new tapable.AsyncSeriesBailHook(["request", "resolveContext"])
			),
			result: new tapable.AsyncSeriesHook(["result", "resolveContext"])
		};
		this._pluginCompat.tap("Resolver: before/after", options => {
			if (/^before-/.test(options.name)) {
				options.name = options.name.substr(7);
				options.stage = -10;
			} else if (/^after-/.test(options.name)) {
				options.name = options.name.substr(6);
				options.stage = 10;
			}
		});
		this._pluginCompat.tap("Resolver: step hooks", options => {
			const name = options.name;
			if (!/^resolve(-s|S)tep$|^no(-r|R)esolve$/.test(name)) {
				options.async = true;
				this.ensureHook(name);
				const fn = options.fn;
				options.fn = (request, resolverContext, callback) => {
					const innerCallback = (err, result) => {
						if (err) return callback(err);
						if (result !== void 0) return callback(null, result);
						callback();
					};
					for (const key in resolverContext) innerCallback[key] = resolverContext[key];

					fn.call(this, request, innerCallback);
				};
			}
		});
	}

	ensureHook(name) {
		if (typeof name != "string") return name;
		name = toCamelCase(name);
		return /^before/.test(name)
			? this.ensureHook(name[6].toLowerCase() + name.substr(7)).withOptions({
					stage: -10
				})
			: /^after/.test(name)
			? this.ensureHook(name[5].toLowerCase() + name.substr(6)).withOptions({
					stage: 10
				})
			: this.hooks[name] ||
				(this.hooks[name] = withName(
					name,
					new tapable.AsyncSeriesBailHook(["request", "resolveContext"])
				));
	}

	getHook(name) {
		if (typeof name != "string") return name;
		name = toCamelCase(name);
		if (/^before/.test(name))
			return this.getHook(name[6].toLowerCase() + name.substr(7)).withOptions({
				stage: -10
			});

		if (/^after/.test(name))
			return this.getHook(name[5].toLowerCase() + name.substr(6)).withOptions({
				stage: 10
			});

		const hook = this.hooks[name];
		if (!hook) throw new Error(`Hook ${name} doesn't exist`);

		return hook;
	}

	resolveSync(context, path, request) {
		let err,
			result,
			sync = false;
		this.resolve(context, path, request, {}, (e, r) => {
			err = e;
			result = r;
			sync = true;
		});
		if (!sync)
			throw new Error(
				"Cannot 'resolveSync' because the fileSystem is not sync. Use 'resolve'!"
			);
		if (err) throw err;
		return result;
	}

	resolve(context, path, request, resolveContext, callback) {
		if (typeof callback != "function")
			callback = deprecatedResolveContextInCallback(resolveContext);

		const obj = { context: context, path: path, request: request },

			message = "resolve '" + request + "' in '" + path + "'";

		return this.doResolve(
			this.hooks.resolve,
			obj,
			message,
			{ missing: resolveContext.missing, stack: resolveContext.stack },
			(err, result) => {
				if (!err && result)
					return callback(
						null,
						result.path !== false && result.path + (result.query || ""),
						result
					);

				const localMissing = new Set();
				localMissing.push = item => deprecatedPushToMissing(localMissing, item);
				const log = [];

				return this.doResolve(
					this.hooks.resolve,
					obj,
					message,
					{
						log: msg => {
							resolveContext.log && resolveContext.log(msg);

							log.push(msg);
						},
						missing: localMissing,
						stack: resolveContext.stack
					},
					(err, result) => {
						if (err) return callback(err);

						const error = new Error("Can't " + message);
						error.details = log.join("\n");
						error.missing = Array.from(localMissing);
						this.hooks.noResolve.call(obj, error);
						return callback(error);
					}
				);
			}
		);
	}

	doResolve(hook, request, message, resolveContext, callback) {
		if (typeof callback != "function")
			callback = deprecatedResolveContextInCallback(resolveContext);

		if (typeof hook == "string") {
			const name = toCamelCase(hook);
			if (!(hook = deprecatedHookAsString(this.hooks[name])))
				throw new Error(`Hook "${name}" doesn't exist`);
		}
		if (typeof callback != "function")
			throw new Error("callback is not a function " + Array.from(arguments));
		if (!resolveContext)
			throw new Error("resolveContext is not an object " + Array.from(arguments));

		const stackLine =
			hook.name +
			": (" +
			request.path +
			") " +
			(request.request || "") +
			(request.query || "") +
			(request.directory ? " directory" : "") +
			(request.module ? " module" : "");

		let newStack;
		if (resolveContext.stack) {
			newStack = new Set(resolveContext.stack);
			if (resolveContext.stack.has(stackLine)) {
				const recursionError = new Error(
					"Recursion in resolving\nStack:\n  " + Array.from(newStack).join("\n  ")
				);
				recursionError.recursion = true;
				resolveContext.log && resolveContext.log("abort resolving because of recursion");
				return callback(recursionError);
			}
			newStack.add(stackLine);
		} else newStack = new Set([stackLine]);

		this.hooks.resolveStep.call(hook, request);

		if (hook.isUsed()) {
			const innerContext = createInnerContext(
				{ log: resolveContext.log, missing: resolveContext.missing, stack: newStack },
				message
			);
			return hook.callAsync(request, innerContext, (err, result) => {
				if (err) return callback(err);
				if (result) return callback(null, result);
				callback();
			});
		}
		callback();
	}

	parse(identifier) {
		if (identifier === "") return null;
		const part = {
			request: "",
			query: "",
			module: false,
			directory: false,
			file: false
		};
		const idxQuery = identifier.indexOf("?");
		if (idxQuery === 0) part.query = identifier;
		else if (idxQuery > 0) {
			part.request = identifier.slice(0, idxQuery);
			part.query = identifier.slice(idxQuery);
		} else part.request = identifier;

		if (part.request) {
			part.module = this.isModule(part.request);
			part.directory = this.isDirectory(part.request);
			if (part.directory) part.request = part.request.substr(0, part.request.length - 1);
		}
		return part;
	}

	isModule(path) {
		return !REGEXP_NOT_MODULE.test(path);
	}

	isDirectory(path) {
		return REGEXP_DIRECTORY.test(path);
	}

	join(path, request) {
		let cacheEntry,
			pathCache = memoizedJoin.get(path);
		if (pathCache === void 0) memoizedJoin.set(path, (pathCache = new Map()));
		else {
			cacheEntry = pathCache.get(request);
			if (cacheEntry !== void 0) return cacheEntry;
		}
		cacheEntry = join(path, request);
		pathCache.set(request, cacheEntry);
		return cacheEntry;
	}

	normalize(path) {
		return normalize(path);
	}
}

function SyncAsyncFileSystemDecorator(fs) {
	this.fs = fs;
	if (fs.statSync)
		this.stat = function(arg, callback) {
			let result;
			try {
				result = fs.statSync(arg);
			} catch (e) {
				return callback(e);
			}
			callback(null, result);
		};

	if (fs.readdirSync)
		this.readdir = function(arg, callback) {
			let result;
			try {
				result = fs.readdirSync(arg);
			} catch (e) {
				return callback(e);
			}
			callback(null, result);
		};

	if (fs.readFileSync)
		this.readFile = function(arg, callback) {
			let result;
			try {
				result = fs.readFileSync(arg);
			} catch (e) {
				return callback(e);
			}
			callback(null, result);
		};

	if (fs.readlinkSync)
		this.readlink = function(arg, callback) {
			let result;
			try {
				result = fs.readlinkSync(arg);
			} catch (e) {
				return callback(e);
			}
			callback(null, result);
		};

	if (fs.readJsonSync)
		this.readJson = function(arg, callback) {
			let result;
			try {
				result = fs.readJsonSync(arg);
			} catch (e) {
				return callback(e);
			}
			callback(null, result);
		};
}

class ParsePlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ParsePlugin", (request, resolveContext, callback) => {
				const parsed = resolver.parse(request.request),
					obj = Object.assign({}, request, parsed);
				if (request.query && !parsed.query) obj.query = request.query;

				if (parsed && resolveContext.log) {
					parsed.module && resolveContext.log("Parsed request is a module");
					parsed.directory && resolveContext.log("Parsed request is a directory");
				}
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
}

function forEachBail(array, iterator, callback) {
	if (array.length === 0) return callback();
	let currentResult,
		currentPos = array.length,
		done = [];
	for (let i = 0; i < array.length; i++) {
		const itCb = createIteratorCallback(i);
		iterator(array[i], itCb);
		if (currentPos === 0) break;
	}

	function createIteratorCallback(i) {
		return (...args) => {
			if (i >= currentPos) return;
			done.push(i);
			if (args.length > 0) {
				currentPos = i + 1;
				done = done.filter(item => item <= i);
				currentResult = args;
			}
			if (done.length === currentPos) {
				callback.apply(null, currentResult);
				currentPos = 0;
			}
		};
	}
}

function forEachBailWithIndex(array, iterator, callback) {
	if (array.length === 0) return callback();
	let currentResult,
		currentPos = array.length,
		done = [];
	for (let i = 0; i < array.length; i++) {
		const itCb = createIteratorCallback(i);
		iterator(array[i], i, itCb);
		if (currentPos === 0) break;
	}

	function createIteratorCallback(i) {
		return (...args) => {
			if (i >= currentPos) return;
			done.push(i);
			if (args.length > 0) {
				currentPos = i + 1;
				done = done.filter(item => item <= i);
				currentResult = args;
			}
			if (done.length === currentPos) {
				callback.apply(null, currentResult);
				currentPos = 0;
			}
		};
	}
}

function loadDescriptionFile(resolver, directory, filenames, resolveContext, callback) {
	!(function findDescriptionFile() {
		forEachBail(
			filenames,
			(filename, callback) => {
				const descriptionFilePath = resolver.join(directory, filename);
				if (resolver.fileSystem.readJson)
					resolver.fileSystem.readJson(descriptionFilePath, (err, content) => {
						if (err) return err.code !== void 0 ? callback() : onJson(err);

						onJson(null, content);
					});
				else
					resolver.fileSystem.readFile(descriptionFilePath, (err, content) => {
						if (err) return callback();
						let json;
						try {
							json = JSON.parse(content);
						} catch (e) {
							return onJson(e);
						}
						onJson(null, json);
					});

				function onJson(err, content) {
					if (err) {
						resolveContext.log
							? resolveContext.log(
									descriptionFilePath + " (directory description file): " + err
								)
							: (err.message =
									descriptionFilePath + " (directory description file): " + err);
						return callback(err);
					}
					callback(null, {
						content: content,
						directory: directory,
						path: descriptionFilePath
					});
				}
			},
			(err, result) =>
				err
					? callback(err)
					: result
					? callback(null, result)
					: !(directory = cdUp(directory))
					? callback()
					: findDescriptionFile()
		);
	})();
}

function getField(content, field) {
	if (!content) return void 0;
	if (Array.isArray(field)) {
		let current = content;
		for (let j = 0; j < field.length; j++) {
			if (current === null || typeof current != "object") {
				current = null;
				break;
			}
			current = current[field[j]];
		}
		if (typeof current == "object") return current;
	} else if (typeof content[field] == "object") return content[field];
}

function cdUp(directory) {
	if (directory === "/") return null;
	const i = directory.lastIndexOf("/"),
		j = directory.lastIndexOf("\\"),
		p = i < 0 ? j : j < 0 ? i : i < j ? j : i;
	return p < 0 ? null : directory.substr(0, p || 1);
}

class DescriptionFilePlugin {
	constructor(source, filenames, target) {
		this.source = source;
		this.filenames = [].concat(filenames);
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("DescriptionFilePlugin", (request, resolveContext, callback) => {
				const directory = request.path;
				loadDescriptionFile(
					resolver,
					directory,
					this.filenames,
					resolveContext,
					(err, result) => {
						if (err) return callback(err);
						if (!result) {
							resolveContext.missing &&
								this.filenames.forEach(filename => {
									resolveContext.missing.add(resolver.join(directory, filename));
								});

							resolveContext.log && resolveContext.log("No description file found");
							return callback();
						}
						const relativePath =
							"." + request.path.substr(result.directory.length).replace(/\\/g, "/");
						const obj = Object.assign({}, request, {
							descriptionFilePath: result.path,
							descriptionFileData: result.content,
							descriptionFileRoot: result.directory,
							relativePath: relativePath
						});
						resolver.doResolve(
							target,
							obj,
							"using description file: " + result.path + " (relative path: " + relativePath + ")",
							resolveContext,
							(err, result) => {
								if (err) return callback(err);

								if (result === void 0) return callback(null, null);
								callback(null, result);
							}
						);
					}
				);
			});
	}
}

class NextPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("NextPlugin", (request, resolveContext, callback) => {
				resolver.doResolve(target, request, null, resolveContext, callback);
			});
	}
}

class TryNextPlugin {
	constructor(source, message, target) {
		this.source = source;
		this.message = message;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("TryNextPlugin", (request, resolveContext, callback) => {
				resolver.doResolve(target, request, this.message, resolveContext, callback);
			});
	}
}

class ModuleKindPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ModuleKindPlugin", (request, resolveContext, callback) => {
				if (!request.module) return callback();
				const obj = Object.assign({}, request);
				delete obj.module;
				resolver.doResolve(
					target,
					obj,
					"resolve as module",
					resolveContext,
					(err, result) => {
						if (err) return callback(err);

						if (result === void 0) return callback(null, null);
						callback(null, result);
					}
				);
			});
	}
}

class FileKindPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("FileKindPlugin", (request, resolveContext, callback) => {
				if (request.directory) return callback();
				const obj = Object.assign({}, request);
				delete obj.directory;
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
}

class JoinRequestPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("JoinRequestPlugin", (request, resolveContext, callback) => {
				const obj = Object.assign({}, request, {
					path: resolver.join(request.path, request.request),
					relativePath:
						request.relativePath && resolver.join(request.relativePath, request.request),
					request: void 0
				});
				resolver.doResolve(target, obj, null, resolveContext, callback);
			});
	}
}

function getPaths(path) {
	const parts = path.split(/(.*?[\\/]+)/),
		paths = [path],
		seqments = [parts[parts.length - 1]];
	let part = parts[parts.length - 1];
	path = path.substr(0, path.length - part.length - 1);
	for (let i = parts.length - 2; i > 2; i -= 2) {
		paths.push(path);
		part = parts[i];
		path = path.substr(0, path.length - part.length) || "/";
		seqments.push(part.substr(0, part.length - 1));
	}
	part = parts[1];
	seqments.push(part);
	paths.push(part);
	return { paths: paths, seqments: seqments };
}

class ModulesInHierachicDirectoriesPlugin {
	constructor(source, directories, target) {
		this.source = source;
		this.directories = [].concat(directories);
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync(
				"ModulesInHierachicDirectoriesPlugin",
				(request, resolveContext, callback) => {
					const fs = resolver.fileSystem;
					forEachBail(
						getPaths(request.path)
							.paths.map(p => this.directories.map(d => resolver.join(p, d)))
							.reduce((array, p) => (array.push.apply(array, p), array), []),
						(addr, callback) => {
							fs.stat(addr, (err, stat) => {
								if (!err && stat && stat.isDirectory()) {
									const obj = Object.assign({}, request, {
										path: addr,
										request: "./" + request.request
									});
									const message = "looking for modules in " + addr;
									return resolver.doResolve(
										target,
										obj,
										message,
										resolveContext,
										callback
									);
								}
								resolveContext.log &&
									resolveContext.log(addr + " doesn't exist or is not a directory");
								resolveContext.missing && resolveContext.missing.add(addr);
								return callback();
							});
						},
						callback
					);
				}
			);
	}
}

class ModulesInRootPlugin {
	constructor(source, path, target) {
		this.source = source;
		this.path = path;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ModulesInRootPlugin", (request, resolveContext, callback) => {
				const obj = Object.assign({}, request, {
					path: this.path,
					request: "./" + request.request
				});
				resolver.doResolve(
					target,
					obj,
					"looking for modules in " + this.path,
					resolveContext,
					callback
				);
			});
	}
}

function startsWith(string, searchString) {
	const stringLength = string.length,
		searchLength = searchString.length;

	if (searchLength > stringLength) return false;

	for (let index = -1; ++index < searchLength; )
		if (string.charCodeAt(index) !== searchString.charCodeAt(index)) return false;

	return true;
}

class AliasPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.options = Array.isArray(options) ? options : [options];
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AliasPlugin", (request, resolveContext, callback) => {
				const innerRequest = request.request || request.path;
				if (!innerRequest) return callback();
				for (const item of this.options)
					if (
						(innerRequest === item.name ||
						(!item.onlyModule && startsWith(innerRequest, item.name + "/"))) &&
						innerRequest !== item.alias && !startsWith(innerRequest, item.alias + "/")
					) {
						const newRequestStr = item.alias + innerRequest.substr(item.name.length),
							obj = Object.assign({}, request, { request: newRequestStr });
						return resolver.doResolve(
							target,
							obj,
							"aliased with mapping '" + item.name + "': '" + item.alias + "' to '" + newRequestStr + "'",
							resolveContext,
							(err, result) => {
								if (err) return callback(err);

								if (result === void 0) return callback(null, null);
								callback(null, result);
							}
						);
					}

				return callback();
			});
	}
}

function getInnerRequest(resolver, request) {
	if (
		typeof request.__innerRequest == "string" &&
		request.__innerRequest_request === request.request &&
		request.__innerRequest_relativePath === request.relativePath
	)
		return request.__innerRequest;
	let innerRequest;
	if (request.request) {
		innerRequest = request.request;
		if (/^\.\.?\//.test(innerRequest) && request.relativePath)
			innerRequest = resolver.join(request.relativePath, innerRequest);
	} else innerRequest = request.relativePath;

	request.__innerRequest_request = request.request;
	request.__innerRequest_relativePath = request.relativePath;
	return (request.__innerRequest = innerRequest);
}

class AliasFieldPlugin {
	constructor(source, field, target) {
		this.source = source;
		this.field = field;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AliasFieldPlugin", (request, resolveContext, callback) => {
				if (!request.descriptionFileData) return callback();
				const innerRequest = getInnerRequest(resolver, request);
				if (!innerRequest) return callback();
				const fieldData = getField(request.descriptionFileData, this.field);
				if (typeof fieldData != "object") {
					resolveContext.log &&
						resolveContext.log(
							"Field '" + this.field + "' doesn't contain a valid alias configuration"
						);
					return callback();
				}
				const data1 = fieldData[innerRequest],
					data2 = fieldData[innerRequest.replace(/^\.\//, "")],
					data = data1 !== void 0 ? data1 : data2;
				if (data === innerRequest) return callback();
				if (data === void 0) return callback();
				if (data === false) {
					const ignoreObj = Object.assign({}, request, { path: false });
					return callback(null, ignoreObj);
				}
				const obj = Object.assign({}, request, {
					path: request.descriptionFileRoot,
					request: data
				});
				resolver.doResolve(
					target,
					obj,
					"aliased from description file " + request.descriptionFilePath + " with mapping '" + innerRequest + "' to '" + data + "'",
					resolveContext,
					(err, result) => {
						if (err) return callback(err);

						if (result === void 0) return callback(null, null);
						callback(null, result);
					}
				);
			});
	}
}

function globToRegExp(glob) {
	if (/^\(.+\)$/.test(glob)) return new RegExp(glob.substr(1, glob.length - 2));

	const tokens = tokenize(glob),
		process = createRoot(),
		regExpStr = tokens.map(process).join("");
	return new RegExp("^" + regExpStr + "$");
}

const SIMPLE_TOKENS = {
	"@(": "one",
	"?(": "zero-one",
	"+(": "one-many",
	"*(": "zero-many",
	"|": "segment-sep",
	"/**/": "any-path-segments",
	"**": "any-path",
	"*": "any-path-segment",
	"?": "any-char",
	"{": "or",
	"/": "path-sep",
	",": "comma",
	")": "closing-segment",
	"}": "closing-or"
};

function tokenize(glob) {
	return glob
		.split(/([@?+*]\(|\/\*\*\/|\*\*|[?*]|\[[!^]?(?:[^\]\\]|\\.)+\]|\{|,|\/|[|)}])/g)
		.map(item => {
			if (!item) return null;
			const t = SIMPLE_TOKENS[item];
			return t
				? { type: t }

				: item[0] === "["
				? item[1] === "^" || item[1] === "!"
					? { type: "inverted-char-set", value: item.substr(2, item.length - 3) }
					: { type: "char-set", value: item.substr(1, item.length - 2) }

				: { type: "string", value: item };
		})
		.filter(Boolean)
		.concat({ type: "end" });
}

function createRoot() {
	const inOr = [],
		process = createSeqment();
	let initial = true;
	return function(token) {
		switch (token.type) {
			case "or":
				inOr.push(initial);
				return "(";
			case "comma":
				if (inOr.length) {
					initial = inOr[inOr.length - 1];
					return "|";
				}
				return process({ type: "string", value: "," }, initial);

			case "closing-or":
				if (inOr.length === 0) throw new Error("Unmatched '}'");
				inOr.pop();
				return ")";
			case "end":
				if (inOr.length) throw new Error("Unmatched '{'");
				return process(token, initial);
			default:
				const result = process(token, initial);
				initial = false;
				return result;
		}
	};
}

function createSeqment() {
	const inSeqment = [],
		process = createSimple();
	return function(token, initial) {
		switch (token.type) {
			case "one":
			case "one-many":
			case "zero-many":
			case "zero-one":
				inSeqment.push(token.type);
				return "(";
			case "segment-sep":
				return inSeqment.length ? "|" : process({ type: "string", value: "|" }, initial);

			case "closing-segment":
				const segment = inSeqment.pop();
				switch (segment) {
					case "one":
						return ")";
					case "one-many":
						return ")+";
					case "zero-many":
						return ")*";
					case "zero-one":
						return ")?";
				}
				throw new Error("Unexcepted segment " + segment);

			case "end":
				if (inSeqment.length > 0) throw new Error("Unmatched segment, missing ')'");

				return process(token, initial);
			default:
				return process(token, initial);
		}
	};
}

function createSimple() {
	return function(token, initial) {
		switch (token.type) {
			case "path-sep":
				return "[\\\\/]+";
			case "any-path-segments":
				return "[\\\\/]+(?:(.+)[\\\\/]+)?";
			case "any-path":
				return "(.*)";
			case "any-path-segment":
				return initial ? "\\.[\\\\/]+(?:.*[\\\\/]+)?([^\\\\/]+)" : "([^\\\\/]*)";

			case "any-char":
				return "[^\\\\/]";
			case "inverted-char-set":
				return "[^" + token.value + "]";
			case "char-set":
				return "[" + token.value + "]";
			case "string":
				return token.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
			case "end":
				return "";
			default:
				throw new Error("Unsupported token '" + token.type + "'");
		}
	};
}

function parseType(type) {
	const items = type.split("+"),
		t = items.shift();
	return { type: t === "*" ? null : t, features: items };
}

function isTypeMatched(baseType, testedType) {
	if (typeof baseType == "string") baseType = parseType(baseType);
	if (typeof testedType == "string") testedType = parseType(testedType);
	return (!testedType.type || testedType.type === baseType.type) &&
		testedType.features.every(
			requiredFeature => baseType.features.indexOf(requiredFeature) >= 0
		);
}

function isResourceTypeMatched(baseType, testedType) {
	baseType = baseType.split("/");
	testedType = testedType.split("/");
	if (baseType.length !== testedType.length) return false;
	for (let i = 0; i < baseType.length; i++)
		if (!isTypeMatched(baseType[i], testedType[i])) return false;

	return true;
}

function isResourceTypeSupported(context, type) {
	return (
		context.supportedResourceTypes &&
		context.supportedResourceTypes.some(supportedType =>
			isResourceTypeMatched(supportedType, type)
		)
	);
}

function isEnvironment(context, env) {
	return (
		context.environments &&
		context.environments.every(environment => isTypeMatched(environment, env))
	);
}

const globCache = {};

function getGlobRegExp(glob) {
	return globCache[glob] || (globCache[glob] = globToRegExp(glob));
}

function matchGlob(glob, relativePath) {
	return getGlobRegExp(glob).exec(relativePath);
}

function isGlobMatched(glob, relativePath) {
	return !!matchGlob(glob, relativePath);
}

function isConditionMatched(context, condition) {
	return condition.split("|").some(function testFn(item) {
		item = item.trim();
		if (/^!/.test(item)) return !testFn(item.substr(1));
		if (/^[a-z]+:/.test(item)) {
			const match = /^([a-z]+):\s*/.exec(item),
				value = item.substr(match[0].length);
			return match[1] === "referrer" && isGlobMatched(value, context.referrer);
		}
		return item.indexOf("/") >= 0
			? isResourceTypeSupported(context, item)
			: isEnvironment(context, item);
	});
}

function isKeyMatched(context, key) {
	for (;;) {
		const match = /^\[([^\]]+)\]\s*/.exec(key);
		if (!match) return key;
		key = key.substr(match[0].length);
		if (!isConditionMatched(context, match[1])) return false;
	}
}

function getField$1(context, configuration, field) {
	let value;
	Object.keys(configuration).forEach(key => {
		if (isKeyMatched(context, key) === field) value = configuration[key];
	});
	return value;
}

function getMain(context, configuration) {
	return getField$1(context, configuration, "main");
}

function getExtensions(context, configuration) {
	return getField$1(context, configuration, "extensions");
}

function matchModule(context, configuration, request) {
	const modulesField = getField$1(context, configuration, "modules");
	if (!modulesField) return request;
	let newRequest = request;
	const keys = Object.keys(modulesField);
	let match, index;
	for (let iteration = 0, i = 0; i < keys.length; i++) {
		const key = keys[i],
			pureKey = isKeyMatched(context, key);
		match = matchGlob(pureKey, newRequest);
		if (match) {
			const value = modulesField[key];
			if (typeof value != "string") return value;
			if (/^\(.+\)$/.test(pureKey))
				newRequest = newRequest.replace(getGlobRegExp(pureKey), value);
			else {
				index = 1;
				newRequest = value.replace(/(\/?\*)?\*/g, replaceMatcher);
			}
			i = -1;
			if (iteration++ > keys.length)
				throw new Error("Request '" + request + "' matches recursively");
		}
	}
	return newRequest;

	function replaceMatcher(find) {
		switch (find) {
			case "/**":
				const m = match[index++];
				return m ? "/" + m : "";

			case "**":
			case "*":
				return match[index++];
		}
	}
}

class ConcordExtensionsPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.options = options;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ConcordExtensionsPlugin", (request, resolveContext, callback) => {
				const concordField = getField(request.descriptionFileData, "concord");
				if (!concordField) return callback();
				const extensions = getExtensions(request.context, concordField);
				if (!extensions) return callback();
				forEachBail(
					extensions,
					(appending, callback) => {
						const obj = Object.assign({}, request, {
							path: request.path + appending,
							relativePath: request.relativePath && request.relativePath + appending
						});
						resolver.doResolve(
							target,
							obj,
							"concord extension: " + appending,
							resolveContext,
							callback
						);
					},
					(err, result) => {
						if (err) return callback(err);

						if (result === void 0) return callback(null, null);
						callback(null, result);
					}
				);
			});
	}
}

class ConcordMainPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.options = options;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ConcordMainPlugin", (request, resolveContext, callback) => {
				if (request.path !== request.descriptionFileRoot) return callback();
				const concordField = getField(request.descriptionFileData, "concord");
				if (!concordField) return callback();
				const mainModule = getMain(request.context, concordField);
				if (!mainModule) return callback();
				const obj = Object.assign({}, request, { request: mainModule }),
					filename = path.basename(request.descriptionFilePath);
				return resolver.doResolve(
					target,
					obj,
					"use " + mainModule + " from " + filename,
					resolveContext,
					callback
				);
			});
	}
}

class ConcordModulesPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.options = options;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ConcordModulesPlugin", (request, resolveContext, callback) => {
				const innerRequest = getInnerRequest(resolver, request);
				if (!innerRequest) return callback();
				const concordField = getField(request.descriptionFileData, "concord");
				if (!concordField) return callback();
				const data = matchModule(request.context, concordField, innerRequest);
				if (data === innerRequest) return callback();
				if (data === void 0) return callback();
				if (data === false) {
					const ignoreObj = Object.assign({}, request, { path: false });
					return callback(null, ignoreObj);
				}
				const obj = Object.assign({}, request, {
					path: request.descriptionFileRoot,
					request: data
				});
				resolver.doResolve(
					target,
					obj,
					"aliased from description file " + request.descriptionFilePath + " with mapping '" + innerRequest + "' to '" + data + "'",
					resolveContext,
					(err, result) => {
						if (err) return callback(err);

						if (result === void 0) return callback(null, null);
						callback(null, result);
					}
				);
			});
	}
}

class DirectoryExistsPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("DirectoryExistsPlugin", (request, resolveContext, callback) => {
				const fs = resolver.fileSystem,
					directory = request.path;
				fs.stat(directory, (err, stat) => {
					if (err || !stat) {
						resolveContext.missing && resolveContext.missing.add(directory);
						resolveContext.log && resolveContext.log(directory + " doesn't exist");
						return callback();
					}
					if (!stat.isDirectory()) {
						resolveContext.missing && resolveContext.missing.add(directory);
						resolveContext.log && resolveContext.log(directory + " is not a directory");
						return callback();
					}
					resolver.doResolve(
						target,
						request,
						"existing directory",
						resolveContext,
						callback
					);
				});
			});
	}
}

class FileExistsPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target),
			fs = resolver.fileSystem;
		resolver
			.getHook(this.source)
			.tapAsync("FileExistsPlugin", (request, resolveContext, callback) => {
				const file = request.path;
				fs.stat(file, (err, stat) => {
					if (err || !stat) {
						resolveContext.missing && resolveContext.missing.add(file);
						resolveContext.log && resolveContext.log(file + " doesn't exist");
						return callback();
					}
					if (!stat.isFile()) {
						resolveContext.missing && resolveContext.missing.add(file);
						resolveContext.log && resolveContext.log(file + " is not a file");
						return callback();
					}
					resolver.doResolve(
						target,
						request,
						"existing file: " + file,
						resolveContext,
						callback
					);
				});
			});
	}
}

class SymlinkPlugin {
	constructor(source, target) {
		this.source = source;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target),
			fs = resolver.fileSystem;
		resolver
			.getHook(this.source)
			.tapAsync("SymlinkPlugin", (request, resolveContext, callback) => {
				const pathsResult = getPaths(request.path),
					pathSeqments = pathsResult.seqments,
					paths = pathsResult.paths;

				let containsSymlink = false;
				forEachBailWithIndex(
					paths,
					(path, idx, callback) => {
						fs.readlink(path, (err, result) => {
							if (!err && result) {
								pathSeqments[idx] = result;
								containsSymlink = true;
								if (/^(\/|[a-zA-Z]:($|\\))/.test(result)) return callback(null, idx);
							}
							callback();
						});
					},
					(err, idx) => {
						if (!containsSymlink) return callback();
						const result = (
							typeof idx == "number"
								? pathSeqments.slice(0, idx + 1)
								: pathSeqments.slice()
						).reverse().reduce((a, b) => resolver.join(a, b));
						const obj = Object.assign({}, request, { path: result });
						resolver.doResolve(
							target,
							obj,
							"resolved symlink to " + result,
							resolveContext,
							callback
						);
					}
				);
			});
	}
}

class MainFieldPlugin {
	constructor(source, options, target) {
		this.source = source;
		this.options = options;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("MainFieldPlugin", (request, resolveContext, callback) => {
				if (
					request.path !== request.descriptionFileRoot ||
					request.alreadyTriedMainField === request.descriptionFilePath
				)
					return callback();
				const content = request.descriptionFileData,
					filename = path.basename(request.descriptionFilePath);
				let mainModule;
				const field = this.options.name;
				if (Array.isArray(field)) {
					let current = content;
					for (let j = 0; j < field.length; j++) {
						if (current === null || typeof current != "object") {
							current = null;
							break;
						}
						current = current[field[j]];
					}
					if (typeof current == "string") mainModule = current;
				} else if (typeof content[field] == "string") mainModule = content[field];

				if (!mainModule) return callback();
				if (this.options.forceRelative && !/^\.\.?\//.test(mainModule))
					mainModule = "./" + mainModule;
				const obj = Object.assign({}, request, {
					request: mainModule,
					alreadyTriedMainField: request.descriptionFilePath
				});
				return resolver.doResolve(
					target,
					obj,
					"use " + mainModule + " from " + this.options.name + " in " + filename,
					resolveContext,
					callback
				);
			});
	}
}

class UseFilePlugin {
	constructor(source, filename, target) {
		this.source = source;
		this.filename = filename;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("UseFilePlugin", (request, resolveContext, callback) => {
				const filePath = resolver.join(request.path, this.filename);
				const obj = Object.assign({}, request, {
					path: filePath,
					relativePath:
						request.relativePath && resolver.join(request.relativePath, this.filename)
				});
				resolver.doResolve(
					target,
					obj,
					"using path: " + filePath,
					resolveContext,
					callback
				);
			});
	}
}

class AppendPlugin {
	constructor(source, appending, target) {
		this.source = source;
		this.appending = appending;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("AppendPlugin", (request, resolveContext, callback) => {
				const obj = Object.assign({}, request, {
					path: request.path + this.appending,
					relativePath: request.relativePath && request.relativePath + this.appending
				});
				resolver.doResolve(target, obj, this.appending, resolveContext, callback);
			});
	}
}

class RootPlugin {
	constructor(source, root, target, ignoreErrors) {
		this.root = root;
		this.source = source;
		this.target = target;
		this._ignoreErrors = ignoreErrors;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);

		resolver
			.getHook(this.source)
			.tapAsync("RootPlugin", (request, resolveContext, callback) => {
				const req = request.request;
				if (!req) return callback();
				if (!req.startsWith("/")) return callback();

				const path = resolver.join(this.root, req.slice(1)),
					obj = Object.assign(request, {
						path,
						relativePath: request.relativePath && path
					});
				resolver.doResolve(
					target,
					obj,
					"root path " + this.root,
					resolveContext,
					this._ignoreErrors
						? (err, result) => {
								if (err) {
									resolveContext.log &&
										resolveContext.log(
											"Ignored fatal error while resolving root path:\n" + err
										);

									return callback();
								}
								if (result) return callback(null, result);
								callback();
							}
						: callback
				);
			});
	}
}

const slashCode = "/".charCodeAt(0),
	backslashCode = "\\".charCodeAt(0);

const isInside = (path, parent) => {
	if (!path.startsWith(parent)) return false;
	if (path.length === parent.length) return true;
	const charCode = path.charCodeAt(parent.length);
	return charCode === slashCode || charCode === backslashCode;
};

class RestrictionsPlugin {
	constructor(source, restrictions) {
		this.source = source;
		this.restrictions = restrictions;
	}

	apply(resolver) {
		resolver
			.getHook(this.source)
			.tapAsync("RestrictionsPlugin", (request, resolveContext, callback) => {
				if (typeof request.path == "string") {
					const path = request.path;

					for (let i = 0; i < this.restrictions.length; i++) {
						const rule = this.restrictions[i];
						if (typeof rule == "string") {
							if (!isInside(path, rule)) {
								resolveContext.log &&
									resolveContext.log(`${path} is not inside of the restriction ${rule}`);

								return callback(null, null);
							}
						} else if (!rule.test(path)) {
							resolveContext.log &&
								resolveContext.log(`${path} doesn't match the restriction ${rule}`);

							return callback(null, null);
						}
					}
				}

				callback();
			});
	}
}

class ResultPlugin {
	constructor(source) {
		this.source = source;
	}

	apply(resolver) {
		this.source.tapAsync("ResultPlugin", (request, resolverContext, callback) => {
			const obj = Object.assign({}, request);
			resolverContext.log && resolverContext.log("reporting result " + obj.path);
			resolver.hooks.result.callAsync(obj, resolverContext, err => {
				if (err) return callback(err);
				callback(null, obj);
			});
		});
	}
}

class ModuleAppendPlugin {
	constructor(source, appending, target) {
		this.source = source;
		this.appending = appending;
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("ModuleAppendPlugin", (request, resolveContext, callback) => {
				const i = request.request.indexOf("/"),
					j = request.request.indexOf("\\"),
					p = i < 0 ? j : j < 0 || i < j ? i : j;
				let moduleName, remainingRequest;
				if (p < 0) {
					moduleName = request.request;
					remainingRequest = "";
				} else {
					moduleName = request.request.substr(0, p);
					remainingRequest = request.request.substr(p);
				}
				if (moduleName === "." || moduleName === "..") return callback();
				const moduleFinalName = moduleName + this.appending,
					obj = Object.assign({}, request, {
						request: moduleFinalName + remainingRequest
					});
				resolver.doResolve(
					target,
					obj,
					"module variation " + moduleFinalName,
					resolveContext,
					callback
				);
			});
	}
}

function getCacheId(request, withContext) {
	return JSON.stringify({
		context: withContext ? request.context : "",
		path: request.path,
		query: request.query,
		request: request.request
	});
}

class UnsafeCachePlugin {
	constructor(source, filterPredicate, cache, withContext, target) {
		this.source = source;
		this.filterPredicate = filterPredicate;
		this.withContext = withContext;
		this.cache = cache || {};
		this.target = target;
	}

	apply(resolver) {
		const target = resolver.ensureHook(this.target);
		resolver
			.getHook(this.source)
			.tapAsync("UnsafeCachePlugin", (request, resolveContext, callback) => {
				if (!this.filterPredicate(request)) return callback();
				const cacheId = getCacheId(request, this.withContext),
					cacheEntry = this.cache[cacheId];
				if (cacheEntry) return callback(null, cacheEntry);

				resolver.doResolve(target, request, null, resolveContext, (err, result) => {
					if (err) return callback(err);
					if (result) return callback(null, (this.cache[cacheId] = result));
					callback();
				});
			});
	}
}

function createResolver(options) {
	let modules = options.modules || ["node_modules"];

	const descriptionFiles = options.descriptionFiles || ["package.json"],

		plugins = (options.plugins && options.plugins.slice()) || [];

	let mainFields = options.mainFields || ["main"];

	const aliasFields = options.aliasFields || [],
		mainFiles = options.mainFiles || ["index"];

	let extensions = options.extensions || [".js", ".json", ".node"];

	const enforceExtension = options.enforceExtension || false;
	let moduleExtensions = options.moduleExtensions || [];
	const enforceModuleExtension = options.enforceModuleExtension || false;

	let alias = options.alias || [];

	const symlinks = options.symlinks === void 0 || options.symlinks,

		resolveToContext = options.resolveToContext || false,
		roots = options.roots || [],
		ignoreRootsErrors = options.ignoreRootsErrors || false,
		preferAbsolute = options.preferAbsolute || false,
		restrictions = options.restrictions || [];

	let unsafeCache = options.unsafeCache || false;

	const cacheWithContext =
			options.cacheWithContext === void 0 || options.cacheWithContext,

		enableConcord = options.concord || false,
		cachePredicate = options.cachePredicate || (() => true),

		fileSystem = options.fileSystem,
		useSyncFileSystemCalls = options.useSyncFileSystemCalls;

	let resolver = options.resolver;

	resolver ||
		(resolver = new Resolver(
			useSyncFileSystemCalls ? new SyncAsyncFileSystemDecorator(fileSystem) : fileSystem
		));

	extensions = [].concat(extensions);
	moduleExtensions = [].concat(moduleExtensions);

	modules = mergeFilteredToArray([].concat(modules), item => !isAbsolutePath(item));

	mainFields = mainFields.map(item => {
		if (typeof item == "string" || Array.isArray(item))
			item = { name: item, forceRelative: true };

		return item;
	});

	if (typeof alias == "object" && !Array.isArray(alias))
		alias = Object.keys(alias).map(key => {
			let onlyModule = false,
				obj = alias[key];
			if (/\$$/.test(key)) {
				onlyModule = true;
				key = key.substr(0, key.length - 1);
			}
			if (typeof obj == "string") obj = { alias: obj };

			obj = Object.assign({ name: key, onlyModule: onlyModule }, obj);
			return obj;
		});

	if (unsafeCache && typeof unsafeCache != "object") unsafeCache = {};

	resolver.ensureHook("resolve");
	resolver.ensureHook("parsedResolve");
	resolver.ensureHook("describedResolve");
	resolver.ensureHook("rawModule");
	resolver.ensureHook("module");
	resolver.ensureHook("relative");
	resolver.ensureHook("describedRelative");
	resolver.ensureHook("directory");
	resolver.ensureHook("existingDirectory");
	resolver.ensureHook("undescribedRawFile");
	resolver.ensureHook("rawFile");
	resolver.ensureHook("file");
	resolver.ensureHook("existingFile");
	resolver.ensureHook("resolved");

	if (unsafeCache) {
		plugins.push(
			new UnsafeCachePlugin(
				"resolve",
				cachePredicate,
				unsafeCache,
				cacheWithContext,
				"new-resolve"
			)
		);
		plugins.push(new ParsePlugin("new-resolve", "parsed-resolve"));
	} else plugins.push(new ParsePlugin("resolve", "parsed-resolve"));

	plugins.push(
		new DescriptionFilePlugin("parsed-resolve", descriptionFiles, "described-resolve")
	);
	plugins.push(new NextPlugin("after-parsed-resolve", "described-resolve"));

	alias.length > 0 &&
		plugins.push(new AliasPlugin("described-resolve", alias, "resolve"));
	enableConcord &&
		plugins.push(new ConcordModulesPlugin("described-resolve", {}, "resolve"));

	aliasFields.forEach(item => {
		plugins.push(new AliasFieldPlugin("described-resolve", item, "resolve"));
	});
	plugins.push(new ModuleKindPlugin("after-described-resolve", "raw-module"));
	preferAbsolute &&
		plugins.push(new JoinRequestPlugin("after-described-resolve", "relative"));

	roots.forEach(root => {
		plugins.push(
			new RootPlugin("after-described-resolve", root, "relative", ignoreRootsErrors)
		);
	});
	preferAbsolute ||
		plugins.push(new JoinRequestPlugin("after-described-resolve", "relative"));

	moduleExtensions.forEach(item => {
		plugins.push(new ModuleAppendPlugin("raw-module", item, "module"));
	});
	enforceModuleExtension ||
		plugins.push(new TryNextPlugin("raw-module", null, "module"));

	modules.forEach(item => {
		Array.isArray(item)
			? plugins.push(new ModulesInHierachicDirectoriesPlugin("module", item, "resolve"))
			: plugins.push(new ModulesInRootPlugin("module", item, "resolve"));
	});

	plugins.push(
		new DescriptionFilePlugin("relative", descriptionFiles, "described-relative")
	);
	plugins.push(new NextPlugin("after-relative", "described-relative"));

	plugins.push(new FileKindPlugin("described-relative", "raw-file"));
	plugins.push(new TryNextPlugin("described-relative", "as directory", "directory"));

	plugins.push(new DirectoryExistsPlugin("directory", "existing-directory"));

	if (resolveToContext) plugins.push(new NextPlugin("existing-directory", "resolved"));
	else {
		enableConcord &&
			plugins.push(new ConcordMainPlugin("existing-directory", {}, "resolve"));

		mainFields.forEach(item => {
			plugins.push(new MainFieldPlugin("existing-directory", item, "resolve"));
		});
		mainFiles.forEach(item => {
			plugins.push(
				new UseFilePlugin("existing-directory", item, "undescribed-raw-file")
			);
		});

		plugins.push(
			new DescriptionFilePlugin("undescribed-raw-file", descriptionFiles, "raw-file")
		);
		plugins.push(new NextPlugin("after-undescribed-raw-file", "raw-file"));

		enforceExtension ||
			plugins.push(new TryNextPlugin("raw-file", "no extension", "file"));

		enableConcord && plugins.push(new ConcordExtensionsPlugin("raw-file", {}, "file"));

		extensions.forEach(item => {
			plugins.push(new AppendPlugin("raw-file", item, "file"));
		});

		alias.length > 0 && plugins.push(new AliasPlugin("file", alias, "resolve"));
		enableConcord && plugins.push(new ConcordModulesPlugin("file", {}, "resolve"));

		aliasFields.forEach(item => {
			plugins.push(new AliasFieldPlugin("file", item, "resolve"));
		});
		symlinks && plugins.push(new SymlinkPlugin("file", "relative"));
		plugins.push(new FileExistsPlugin("file", "existing-file"));

		plugins.push(new NextPlugin("existing-file", "resolved"));
	}

	restrictions.length > 0 &&
		plugins.push(new RestrictionsPlugin(resolver.hooks.resolved, restrictions));

	plugins.push(new ResultPlugin(resolver.hooks.resolved));

	plugins.forEach(plugin => {
		plugin.apply(resolver);
	});

	return resolver;
}

function mergeFilteredToArray(array, filter) {
	return array.reduce((array, item) => {
		if (filter(item)) {
			const lastElement = array[array.length - 1];
			Array.isArray(lastElement) ? lastElement.push(item) : array.push([item]);

			return array;
		}
		array.push(item);
		return array;
	}, []);
}

function isAbsolutePath(path) {
	return /^[A-Z]:|^\//.test(path);
}

const ResolverFactory = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	createResolver: createResolver
});

class NodeJsInputFileSystem {
	readdir(path, callback) {
		fs.readdir(path, (err, files) => {
			callback(
				err,
				files && files.map(file => (file.normalize ? file.normalize("NFC") : file))
			);
		});
	}

	readdirSync(path) {
		const files = fs.readdirSync(path);
		return files && files.map(file => (file.normalize ? file.normalize("NFC") : file));
	}
}

const fsMethods = [
	"stat",
	"statSync",
	"readFile",
	"readFileSync",
	"readlink",
	"readlinkSync"
];

for (const key of fsMethods)
	Object.defineProperty(NodeJsInputFileSystem.prototype, key, {
		configurable: true,
		writable: true,
		value: fs[key].bind(fs)
	});

class Storage {
	constructor(duration) {
		this.duration = duration;
		this.running = new Map();
		this.data = new Map();
		this.levels = [];
		if (duration > 0) {
			this.levels.push(
				new Set(),
				new Set(),
				new Set(),
				new Set(),
				new Set(),
				new Set(),
				new Set(),
				new Set(),
				new Set()
			);
			for (let i = 8000; i < duration; i += 500) this.levels.push(new Set());
		}
		this.count = 0;
		this.interval = null;
		this.needTickCheck = false;
		this.nextTick = null;
		this.passive = true;
		this.tick = this.tick.bind(this);
	}

	ensureTick() {
		if (!this.interval && this.duration > 0 && !this.nextTick)
			this.interval = setInterval(
				this.tick,
				Math.floor(this.duration / this.levels.length)
			);
	}

	finished(name, err, result) {
		const callbacks = this.running.get(name);
		this.running.delete(name);
		if (this.duration > 0) {
			this.data.set(name, [err, result]);
			const levelData = this.levels[0];
			this.count -= levelData.size;
			levelData.add(name);
			this.count += levelData.size;
			this.ensureTick();
		}
		for (let i = 0; i < callbacks.length; i++) callbacks[i](err, result);
	}

	finishedSync(name, err, result) {
		if (this.duration > 0) {
			this.data.set(name, [err, result]);
			const levelData = this.levels[0];
			this.count -= levelData.size;
			levelData.add(name);
			this.count += levelData.size;
			this.ensureTick();
		}
	}

	provide(name, provider, callback) {
		if (typeof name != "string") {
			callback(new TypeError("path must be a string"));
			return;
		}
		let running = this.running.get(name);
		if (running) {
			running.push(callback);
			return;
		}
		if (this.duration > 0) {
			this.checkTicks();
			const data = this.data.get(name);
			if (data)
				return process.nextTick(() => {
					callback.apply(null, data);
				});
		}
		this.running.set(name, (running = [callback]));
		provider(name, (err, result) => {
			this.finished(name, err, result);
		});
	}

	provideSync(name, provider) {
		if (typeof name != "string") throw new TypeError("path must be a string");

		if (this.duration > 0) {
			this.checkTicks();
			const data = this.data.get(name);
			if (data) {
				if (data[0]) throw data[0];
				return data[1];
			}
		}
		let result;
		try {
			result = provider(name);
		} catch (e) {
			this.finishedSync(name, e);
			throw e;
		}
		this.finishedSync(name, null, result);
		return result;
	}

	tick() {
		const decay = this.levels.pop();
		for (let item of decay) this.data.delete(item);

		this.count -= decay.size;
		decay.clear();
		this.levels.unshift(decay);
		if (this.count === 0) {
			clearInterval(this.interval);
			this.interval = null;
			this.nextTick = null;
			return true;
		}
		if (this.nextTick) {
			this.nextTick += Math.floor(this.duration / this.levels.length);
			const time = new Date().getTime();
			if (this.nextTick > time) {
				this.nextTick = null;
				this.interval = setInterval(
					this.tick,
					Math.floor(this.duration / this.levels.length)
				);
				return true;
			}
		} else if (this.passive) {
			clearInterval(this.interval);
			this.interval = null;
			this.nextTick =
				new Date().getTime() + Math.floor(this.duration / this.levels.length);
		} else this.passive = true;
	}

	checkTicks() {
		this.passive = false;
		if (this.nextTick) while (!this.tick());
	}

	purge(what) {
		if (!what) {
			this.count = 0;
			clearInterval(this.interval);
			this.nextTick = null;
			this.data.clear();
			this.levels.forEach(level => {
				level.clear();
			});
		} else if (typeof what == "string")
			for (let key of this.data.keys()) key.startsWith(what) && this.data.delete(key);
		else for (let i = what.length - 1; i >= 0; i--) this.purge(what[i]);
	}
}

class CachedInputFileSystem {
	constructor(fileSystem, duration) {
		this.fileSystem = fileSystem;
		this._statStorage = new Storage(duration);
		this._readdirStorage = new Storage(duration);
		this._readFileStorage = new Storage(duration);
		this._readJsonStorage = new Storage(duration);
		this._readlinkStorage = new Storage(duration);

		this._stat = this.fileSystem.stat
			? this.fileSystem.stat.bind(this.fileSystem)
			: null;
		this._stat || (this.stat = null);

		this._statSync = this.fileSystem.statSync
			? this.fileSystem.statSync.bind(this.fileSystem)
			: null;
		this._statSync || (this.statSync = null);

		this._readdir = this.fileSystem.readdir
			? this.fileSystem.readdir.bind(this.fileSystem)
			: null;
		this._readdir || (this.readdir = null);

		this._readdirSync = this.fileSystem.readdirSync
			? this.fileSystem.readdirSync.bind(this.fileSystem)
			: null;
		this._readdirSync || (this.readdirSync = null);

		this._readFile = this.fileSystem.readFile
			? this.fileSystem.readFile.bind(this.fileSystem)
			: null;
		this._readFile || (this.readFile = null);

		this._readFileSync = this.fileSystem.readFileSync
			? this.fileSystem.readFileSync.bind(this.fileSystem)
			: null;
		this._readFileSync || (this.readFileSync = null);

		if (this.fileSystem.readJson)
			this._readJson = this.fileSystem.readJson.bind(this.fileSystem);
		else if (this.readFile)
			this._readJson = (path, callback) => {
				this.readFile(path, (err, buffer) => {
					if (err) return callback(err);
					let data;
					try {
						data = JSON.parse(buffer.toString("utf-8"));
					} catch (e) {
						return callback(e);
					}
					callback(null, data);
				});
			};
		else this.readJson = null;

		if (this.fileSystem.readJsonSync)
			this._readJsonSync = this.fileSystem.readJsonSync.bind(this.fileSystem);
		else if (this.readFileSync)
			this._readJsonSync = path => {
				const buffer = this.readFileSync(path);
				return JSON.parse(buffer.toString("utf-8"));
			};
		else this.readJsonSync = null;

		this._readlink = this.fileSystem.readlink
			? this.fileSystem.readlink.bind(this.fileSystem)
			: null;
		this._readlink || (this.readlink = null);

		this._readlinkSync = this.fileSystem.readlinkSync
			? this.fileSystem.readlinkSync.bind(this.fileSystem)
			: null;
		this._readlinkSync || (this.readlinkSync = null);
	}

	stat(path, callback) {
		this._statStorage.provide(path, this._stat, callback);
	}

	readdir(path, callback) {
		this._readdirStorage.provide(path, this._readdir, callback);
	}

	readFile(path, callback) {
		this._readFileStorage.provide(path, this._readFile, callback);
	}

	readJson(path, callback) {
		this._readJsonStorage.provide(path, this._readJson, callback);
	}

	readlink(path, callback) {
		this._readlinkStorage.provide(path, this._readlink, callback);
	}

	statSync(path) {
		return this._statStorage.provideSync(path, this._statSync);
	}

	readdirSync(path) {
		return this._readdirStorage.provideSync(path, this._readdirSync);
	}

	readFileSync(path) {
		return this._readFileStorage.provideSync(path, this._readFileSync);
	}

	readJsonSync(path) {
		return this._readJsonStorage.provideSync(path, this._readJsonSync);
	}

	readlinkSync(path) {
		return this._readlinkStorage.provideSync(path, this._readlinkSync);
	}

	purge(what) {
		this._statStorage.purge(what);
		this._readdirStorage.purge(what);
		this._readFileStorage.purge(what);
		this._readlinkStorage.purge(what);
		this._readJsonStorage.purge(what);
	}
}

const nodeFileSystem = new CachedInputFileSystem(new NodeJsInputFileSystem(), 4000),

	nodeContext = { environments: ["node+es3+es5+process+native"] };

const asyncResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	fileSystem: nodeFileSystem
});
function resolve(context, path, request, resolveContext, callback) {
	if (typeof context == "string") {
		callback = resolveContext;
		resolveContext = request;
		request = path;
		path = context;
		context = nodeContext;
	}
	if (typeof callback != "function") callback = resolveContext;

	asyncResolver.resolve(context, path, request, resolveContext, callback);
}

const syncResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	useSyncFileSystemCalls: true,
	fileSystem: nodeFileSystem
});
function resolveSync(context, path, request) {
	if (typeof context == "string") {
		request = path;
		path = context;
		context = nodeContext;
	}
	return syncResolver.resolveSync(context, path, request);
}

const asyncContextResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	resolveToContext: true,
	fileSystem: nodeFileSystem
});
function resolveContext(context, path, request, resolveContext, callback) {
	if (typeof context == "string") {
		callback = resolveContext;
		resolveContext = request;
		request = path;
		path = context;
		context = nodeContext;
	}
	if (typeof callback != "function") callback = resolveContext;

	asyncContextResolver.resolve(context, path, request, resolveContext, callback);
}

const syncContextResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	resolveToContext: true,
	useSyncFileSystemCalls: true,
	fileSystem: nodeFileSystem
});
function resolveContextSync(context, path, request) {
	if (typeof context == "string") {
		request = path;
		path = context;
		context = nodeContext;
	}
	return syncContextResolver.resolveSync(context, path, request);
}

const asyncLoaderResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	moduleExtensions: ["-loader"],
	mainFields: ["loader", "main"],
	fileSystem: nodeFileSystem
});
function resolveLoader(context, path, request, resolveContext, callback) {
	if (typeof context == "string") {
		callback = resolveContext;
		resolveContext = request;
		request = path;
		path = context;
		context = nodeContext;
	}
	if (typeof callback != "function") callback = resolveContext;

	asyncLoaderResolver.resolve(context, path, request, resolveContext, callback);
}

const syncLoaderResolver = createResolver({
	extensions: [".js", ".json", ".node"],
	moduleExtensions: ["-loader"],
	mainFields: ["loader", "main"],
	useSyncFileSystemCalls: true,
	fileSystem: nodeFileSystem
});
function resolveLoaderSync(context, path, request) {
	if (typeof context == "string") {
		request = path;
		path = context;
		context = nodeContext;
	}
	return syncLoaderResolver.resolveSync(context, path, request);
}

function create(options) {
	const resolver = createResolver(
		(options = Object.assign({ fileSystem: nodeFileSystem }, options))
	);
	return function(context, path, request, resolveContext, callback) {
		if (typeof context == "string") {
			callback = resolveContext;
			resolveContext = request;
			request = path;
			path = context;
			context = nodeContext;
		}
		if (typeof callback != "function") callback = resolveContext;

		resolver.resolve(context, path, request, resolveContext, callback);
	};
}

function createSync(options) {
	options = Object.assign(
		{ useSyncFileSystemCalls: true, fileSystem: nodeFileSystem },
		options
	);
	const resolver = createResolver(options);
	return function(context, path, request) {
		if (typeof context == "string") {
			request = path;
			path = context;
			context = nodeContext;
		}
		return resolver.resolveSync(context, path, request);
	};
}

exports = module.exports = resolve;
exports.default = resolve;

exports.sync = resolveSync;
exports.context = resolveContext;
exports.context.sync = resolveContextSync;
exports.loader = resolveLoader;
exports.loader.sync = resolveLoaderSync;
exports.create = create;
exports.create.sync = createSync;

exports.ResolverFactory = ResolverFactory;
exports.AliasPlugin = AliasPlugin;
exports.NodeJsInputFileSystem = NodeJsInputFileSystem;
exports.CachedInputFileSystem = CachedInputFileSystem;

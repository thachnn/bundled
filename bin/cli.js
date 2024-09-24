#!/usr/bin/env node
"use strict";

!(function(modules) {
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
	__webpack_require__(9);
})([
// 0
function(module) {

module.exports = require("path");

},
// 1
function(module) {

module.exports = require("webpack");

},
// 2
function(module) {

module.exports = require("fs");

},
// 3
function(module) {

const NON_COMPILATION_ARGS = ["init", "migrate", "serve", "generate-loader", "generate-plugin", "info"];

const GROUPS = {
	CONFIG_GROUP: "Config options:",
	BASIC_GROUP: "Basic options:",
	MODULE_GROUP: "Module options:",
	OUTPUT_GROUP: "Output options:",
	ADVANCED_GROUP: "Advanced options:",
	RESOLVE_GROUP: "Resolving options:",
	OPTIMIZE_GROUP: "Optimizing options:",
	DISPLAY_GROUP: "Stats options:"
};

const WEBPACK_OPTIONS_FLAG = "WEBPACK_OPTIONS";

module.exports = { NON_COMPILATION_ARGS, GROUPS, WEBPACK_OPTIONS_FLAG };

},
// 4
function(module) {

module.exports = require("os");

},
// 5
function(module) {

module.exports = require("child_process");

},
// 6
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  prefix = __webpack_require__(20);
let gm;

function getPath() {
  return process.platform === 'win32' || process.env.OSTYPE === 'msys' || process.env.OSTYPE === 'cygwin'
    ? path.resolve(prefix, 'node_modules')
    : path.resolve(prefix, 'lib/node_modules');
}

module.exports = gm || (gm = getPath());

},
// 7
function(module, exports, __webpack_require__) {

const os = __webpack_require__(4),
	hasFlag = __webpack_require__(31),

	env = process.env;

let forceColor;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false') || hasFlag('color=never'))
	forceColor = 0;
else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true') || hasFlag('color=always'))
	forceColor = 1;

if ('FORCE_COLOR' in env)
	forceColor =
		env.FORCE_COLOR === true || env.FORCE_COLOR === 'true'
			? 1
			: env.FORCE_COLOR === false || env.FORCE_COLOR === 'false'
			? 0
			: env.FORCE_COLOR.length === 0
			? 1
			: Math.min(parseInt(env.FORCE_COLOR, 10), 3);

function translateLevel(level) {
	return level !== 0 && { level, hasBasic: true, has256: level >= 2, has16m: level >= 3 };
}

function supportsColor(stream) {
	if (forceColor === 0) return 0;

	if (hasFlag('color=16m') || hasFlag('color=full') || hasFlag('color=truecolor')) return 3;

	if (hasFlag('color=256')) return 2;

	if (stream && !stream.isTTY && forceColor === void 0) return 0;

	const min = forceColor || 0;
	if (env.TERM === 'dumb') return min;

	if (process.platform === 'win32') {
		const osRelease = os.release().split('.');
		return Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
			? (Number(osRelease[2]) >= 14931 ? 3 : 2)
			: 1;
	}

	if ('CI' in env)
		return ['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship'
			? 1
			: min;

	if ('TEAMCITY_VERSION' in env) return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;

	if (env.COLORTERM === 'truecolor') return 3;

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
		}
	}

	return /-256(color)?$/i.test(env.TERM)
		? 2
		: /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM) || 'COLORTERM' in env
		? 1
		: min;
}

function getSupportLevel(stream) {
	return translateLevel(supportsColor(stream));
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};

},
// 8
function(module) {

module.exports = function(module) {
	if (module.webpackPolyfill) return module;

	module.deprecate = function() {};
	module.paths = [];
	module.children || (module.children = []);
	Object.defineProperty(module, "loaded", { enumerable: true, get: () => module.l });
	Object.defineProperty(module, "id", { enumerable: true, get: () => module.i });

	module.webpackPolyfill = 1;
	return module;
};

},
// 9
function(module, exports, __webpack_require__) {

const { NON_COMPILATION_ARGS } = __webpack_require__(3);

if (__webpack_require__(10)(__filename)) return;

require("../vendor/v8-compile-cache");

const ErrorHelpers = __webpack_require__(18);

const NON_COMPILATION_CMD = process.argv.find(arg => {
	if (arg === "serve") {
		global.process.argv = global.process.argv.filter(a => a !== "serve");
		process.argv = global.process.argv;
	}
	return NON_COMPILATION_ARGS.find(a => a === arg);
});

if (NON_COMPILATION_CMD) return __webpack_require__(19)(NON_COMPILATION_CMD, ...process.argv);

const yargs = __webpack_require__(27).usage(
	`webpack-cli ${__webpack_require__(28).version}

Usage: webpack-cli [options]
       webpack-cli [options] --entry <entry> --output <output>
       webpack-cli [options] <entries...> --output <output>
       webpack-cli <command> [options]

For more information, see https://webpack.js.org/api/cli/.`
);

__webpack_require__(29)(yargs);

yargs.parse(process.argv.slice(2), (err, argv, output) => {
	Error.stackTraceLimit = 30;

	if (err && output) {
		console.error(output);
		process.exitCode = 1;
		return;
	}

	if (output) {
		console.log(output);
		return;
	}

	if (argv.verbose) argv.display = "verbose";

	let options;
	try {
		options = __webpack_require__(32)(argv);
	} catch (err) {
		if (err.code === "MODULE_NOT_FOUND") {
			const moduleName = err.message.split("'")[1];
			let instructions = "",
				errorMessage = "";

			if (moduleName === "webpack") {
				errorMessage = `\n${moduleName} not installed`;
				instructions = `Install webpack to start bundling: \x1b[32m\n  $ npm install --save-dev ${moduleName}\n`;

				if (process.env.npm_execpath !== void 0 && process.env.npm_execpath.includes("yarn"))
					instructions = `Install webpack to start bundling: \x1b[32m\n $ yarn add ${moduleName} --dev\n`;

				Error.stackTraceLimit = 1;
				console.error(`${errorMessage}\n\n${instructions}`);
				process.exitCode = 1;
				return;
			}
		}

		if (err.name !== "ValidationError") throw err;

		const stack = ErrorHelpers.cleanUpWebpackOptions(err.stack, err.message),
			message = err.message + "\n" + stack;

		console.error(argv.color ? `\x1b[1m\x1b[31m${message}\x1b[39m\x1b[22m` : message);

		process.exitCode = 1;
		return;
	}

	const stdout = argv.silent ? { write: () => {} } : process.stdout;

	function ifArg(name, fn, init) {
		if (Array.isArray(argv[name])) {
			init && init();
			argv[name].forEach(fn);
		} else if (argv[name] !== void 0) {
			init && init();
			fn(argv[name], -1);
		}
	}

	function processOptions(options) {
		if (typeof options.then == "function") {
			options.then(processOptions).catch(function(err) {
				console.error(err.stack || err);
				process.exit(1);
			});
			return;
		}

		const firstOptions = [].concat(options)[0],
			statsPresetToOptions = __webpack_require__(1).Stats.presetToOptions;

		let outputOptions = options.stats;
		typeof outputOptions == "boolean" || typeof outputOptions == "string"
			? (outputOptions = statsPresetToOptions(outputOptions))
			: outputOptions || (outputOptions = {});

		ifArg("display", function(preset) {
			outputOptions = statsPresetToOptions(preset);
		});

		outputOptions = Object.create(outputOptions);
		if (Array.isArray(options) && !outputOptions.children)
			outputOptions.children = options.map(o => o.stats);

		if (outputOptions.context === void 0) outputOptions.context = firstOptions.context;

		ifArg("env", function(value) {
			if (outputOptions.env) outputOptions._env = value;
		});

		ifArg("json", function(bool) {
			if (bool) {
				outputOptions.json = bool;
				outputOptions.modules = bool;
			}
		});

		if (outputOptions.colors === void 0) outputOptions.colors = __webpack_require__(7).stdout;

		ifArg("sort-modules-by", function(value) {
			outputOptions.modulesSort = value;
		});

		ifArg("sort-chunks-by", function(value) {
			outputOptions.chunksSort = value;
		});

		ifArg("sort-assets-by", function(value) {
			outputOptions.assetsSort = value;
		});

		ifArg("display-exclude", function(value) {
			outputOptions.exclude = value;
		});

		if (!outputOptions.json) {
			if (outputOptions.cached === void 0) outputOptions.cached = false;
			if (outputOptions.cachedAssets === void 0) outputOptions.cachedAssets = false;

			ifArg("display-chunks", function(bool) {
				if (bool) {
					outputOptions.modules = false;
					outputOptions.chunks = true;
					outputOptions.chunkModules = true;
				}
			});

			ifArg("display-entrypoints", function(bool) {
				outputOptions.entrypoints = bool;
			});

			ifArg("display-reasons", function(bool) {
				if (bool) outputOptions.reasons = true;
			});

			ifArg("display-depth", function(bool) {
				if (bool) outputOptions.depth = true;
			});

			ifArg("display-used-exports", function(bool) {
				if (bool) outputOptions.usedExports = true;
			});

			ifArg("display-provided-exports", function(bool) {
				if (bool) outputOptions.providedExports = true;
			});

			ifArg("display-optimization-bailout", function(bool) {
				if (bool) outputOptions.optimizationBailout = bool;
			});

			ifArg("display-error-details", function(bool) {
				if (bool) outputOptions.errorDetails = true;
			});

			ifArg("display-origins", function(bool) {
				if (bool) outputOptions.chunkOrigins = true;
			});

			ifArg("display-max-modules", function(value) {
				outputOptions.maxModules = +value;
			});

			ifArg("display-cached", function(bool) {
				if (bool) outputOptions.cached = true;
			});

			ifArg("display-cached-assets", function(bool) {
				if (bool) outputOptions.cachedAssets = true;
			});

			outputOptions.exclude || (outputOptions.exclude = ["node_modules", "bower_components", "components"]);

			if (argv["display-modules"]) {
				outputOptions.maxModules = Infinity;
				outputOptions.exclude = void 0;
				outputOptions.modules = true;
			}
		}

		ifArg("hide-modules", function(bool) {
			if (bool) {
				outputOptions.modules = false;
				outputOptions.chunkModules = false;
			}
		});

		ifArg("info-verbosity", function(value) {
			outputOptions.infoVerbosity = value;
		});

		ifArg("build-delimiter", function(value) {
			outputOptions.buildDelimiter = value;
		});

		const webpack = __webpack_require__(1);

		let compiler,
			lastHash = null;
		try {
			compiler = webpack(options);
		} catch (err) {
			if (err.name === "WebpackOptionsValidationError") {
				console.error(argv.color ? `\x1b[1m\x1b[31m${err.message}\x1b[39m\x1b[22m` : err.message);
				process.exit(1);
			}

			throw err;
		}

		argv.progress &&
			new (0, __webpack_require__(1).ProgressPlugin)({ profile: argv.profile }).apply(compiler);

		if (outputOptions.infoVerbosity === "verbose") {
			compiler.hooks[argv.w ? "watchRun" : "beforeRun"].tap("WebpackInfo", compilation => {
				const compilationName = compilation.name ? compilation.name : "";
				console.error("\nCompilation " + compilationName + " starting\u2026\n");
			});

			compiler.hooks.done.tap("WebpackInfo", compilation => {
				const compilationName = compilation.name ? compilation.name : "";
				console.error("\nCompilation " + compilationName + " finished\n");
			});
		}

		function compilerCallback(err, stats) {
			(options.watch && !err) || compiler.purgeInputFileSystem();

			if (err) {
				lastHash = null;
				console.error(err.stack || err);
				err.details && console.error(err.details);
				process.exitCode = 1;
				return;
			}
			if (outputOptions.json) stdout.write(JSON.stringify(stats.toJson(outputOptions), null, 2) + "\n");
			else if (stats.hash !== lastHash) {
				lastHash = stats.hash;
				if (stats.compilation && stats.compilation.errors.length > 0 &&
						stats.compilation.errors[0].name === "EntryModuleNotFoundError") {
					console.error("\n\x1b[1m\x1b[31mInsufficient number of arguments or no entry found.");
					console.error(
						"\x1b[1m\x1b[31mAlternatively, run 'webpack(-cli) --help' for usage info.\x1b[39m\x1b[22m\n"
					);
				}

				const statsString = stats.toString(outputOptions),
					delimiter = outputOptions.buildDelimiter ? outputOptions.buildDelimiter + "\n" : "";
				statsString && stdout.write(`${statsString}\n${delimiter}`);
			}
			if (!options.watch && stats.hasErrors()) process.exitCode = 2;
		}
		if (firstOptions.watch || options.watch) {
			const watchOptions =
				firstOptions.watchOptions || options.watchOptions || firstOptions.watch || options.watch || {};
			if (watchOptions.stdin) {
				process.stdin.on("end", function(_) {
					process.exit();
				});
				process.stdin.resume();
			}
			compiler.watch(watchOptions, compilerCallback);
			outputOptions.infoVerbosity === "none" || console.error("\nwebpack is watching the files\u2026\n");
		} else
			compiler.run((err, stats) => {
				compiler.close
					? compiler.close(err2 => {
							compilerCallback(err || err2, stats);
					  })
					: compilerCallback(err, stats);
			});
	}
	processOptions(options);
});

},
// 10
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	resolveCwd = __webpack_require__(11),
	pkgDir = __webpack_require__(14);

module.exports = filename => {
	const globalDir = pkgDir.sync(path.dirname(filename)),
		relativePath = path.relative(globalDir, filename),
		pkg = require(path.join(globalDir, 'package.json')),
		localFile = resolveCwd.silent(path.join(pkg.name, relativePath));

	return localFile && path.relative(localFile, filename) !== '' ? require(localFile) : null;
};

},
// 11
function(module, exports, __webpack_require__) {

const resolveFrom = __webpack_require__(12);

module.exports = moduleId => resolveFrom(process.cwd(), moduleId);
module.exports.silent = moduleId => resolveFrom.silent(process.cwd(), moduleId);

},
// 12
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	Module = __webpack_require__(13);

const resolveFrom = (fromDir, moduleId, silent) => {
	if (typeof fromDir != 'string')
		throw new TypeError('Expected `fromDir` to be of type `string`, got `' + typeof fromDir + '`');

	if (typeof moduleId != 'string')
		throw new TypeError('Expected `moduleId` to be of type `string`, got `' + typeof moduleId + '`');

	fromDir = path.resolve(fromDir);
	const fromFile = path.join(fromDir, 'noop.js');

	const resolveFileName = () => Module._resolveFilename(moduleId, {
		id: fromFile,
		filename: fromFile,
		paths: Module._nodeModulePaths(fromDir)
	});

	if (silent)
		try {
			return resolveFileName();
		} catch (_) {
			return null;
		}

	return resolveFileName();
};

module.exports = (fromDir, moduleId) => resolveFrom(fromDir, moduleId);
module.exports.silent = (fromDir, moduleId) => resolveFrom(fromDir, moduleId, true);

},
// 13
function(module) {

module.exports = require("module");

},
// 14
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	findUp = __webpack_require__(15);

module.exports = cwd => findUp('package.json', { cwd }).then(fp => (fp ? path.dirname(fp) : null));

module.exports.sync = cwd => {
	const fp = findUp.sync('package.json', { cwd });
	return fp ? path.dirname(fp) : null;
};

},
// 15
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	locatePath = __webpack_require__(16);

module.exports = (filename, opts = {}) => {
	const startDir = path.resolve(opts.cwd || ''),
		{ root } = path.parse(startDir),

		filenames = [].concat(filename);

	return new Promise(resolve => {
		!(function find(dir) {
			locatePath(filenames, { cwd: dir }).then(file => {
				file ? resolve(path.join(dir, file)) : dir === root ? resolve(null) : find(path.dirname(dir));
			});
		})(startDir);
	});
};

module.exports.sync = (filename, opts = {}) => {
	let dir = path.resolve(opts.cwd || '');
	const { root } = path.parse(dir),

		filenames = [].concat(filename);

	while (1) {
		const file = locatePath.sync(filenames, { cwd: dir });

		if (file) return path.join(dir, file);

		if (dir === root) return null;

		dir = path.dirname(dir);
	}
};

},
// 16
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	pathExists = __webpack_require__(17),
	pLocate = () => Promise.resolve();

module.exports = (iterable, options) => {
	options = Object.assign({ cwd: process.cwd() }, options);
	return pLocate(iterable, el => pathExists(path.resolve(options.cwd, el)), options);
};

module.exports.sync = (iterable, options) => {
	options = Object.assign({ cwd: process.cwd() }, options);

	for (const el of iterable) if (pathExists.sync(path.resolve(options.cwd, el))) return el;
};

},
// 17
function(module, exports, __webpack_require__) {

const fs = __webpack_require__(2);

module.exports = fp => new Promise(resolve => {
	fs.access(fp, err => {
		resolve(!err);
	});
});

module.exports.sync = fp => {
	try {
		fs.accessSync(fp);
		return true;
	} catch (_) {
		return false;
	}
};

},
// 18
function(module, exports, __webpack_require__) {

const { WEBPACK_OPTIONS_FLAG } = __webpack_require__(3);

exports.cutOffByFlag = (stack, flag) => {
	stack = stack.split("\n");
	for (let i = 0; i < stack.length; i++) if (stack[i].indexOf(flag) >= 0) stack.length = i;
	return stack.join("\n");
};

exports.cutOffWebpackOptions = stack => exports.cutOffByFlag(stack, WEBPACK_OPTIONS_FLAG);

exports.cutOffMultilineMessage = (stack, message) => {
	stack = stack.split("\n");
	message = message.split("\n");

	return stack
		.reduce(
			(acc, line, idx) => (line === message[idx] || line === "Error: " + message[idx] ? acc : acc.concat(line)),
			[]
		)
		.join("\n");
};

exports.cleanUpWebpackOptions = (stack, message) => {
	stack = exports.cutOffWebpackOptions(stack);
	return exports.cutOffMultilineMessage(stack, message);
};

},
// 19
function(module, exports, __webpack_require__) {

const runCommand = (command, args) => {
	const cp = __webpack_require__(5);
	return new Promise((resolve, reject) => {
		const executedCommand = cp.spawn(command, args, { stdio: "inherit", shell: true });

		executedCommand.on("error", error => {
			reject(error);
		});

		executedCommand.on("exit", code => {
			code === 0 ? resolve() : reject();
		});
	});
};

const npmGlobalRoot = () => {
	const cp = __webpack_require__(5);
	return new Promise((resolve, reject) => {
		const command = cp.spawn("npm", ["root", "-g"]);
		command.on("error", error => reject(error));
		command.stdout.on("data", data => resolve(data.toString()));
		command.stderr.on("data", data => reject(data));
	});
};

const runWhenInstalled = (packages, pathForCmd, ...args) => {
	const func = require(pathForCmd).default;
	if (typeof func != "function")
		throw new Error(`@webpack-cli/${packages} failed to export a default function`);

	return func(...args);
};

module.exports = function(packages, ...args) {
	const nameOfPackage = "@webpack-cli/" + packages;
	let pathForCmd,
		packageIsInstalled = false;
	try {
		const path = __webpack_require__(0),
			fs = __webpack_require__(2);
		pathForCmd = path.resolve(process.cwd(), "node_modules", "@webpack-cli", packages);
		if (!fs.existsSync(pathForCmd)) {
			const globalModules = __webpack_require__(6);
			pathForCmd = globalModules + "/@webpack-cli/" + packages;
		}
		require.resolve(pathForCmd);

		packageIsInstalled = true;
	} catch (_err) {
		packageIsInstalled = false;
	}
	if (packageIsInstalled) return runWhenInstalled(packages, pathForCmd, ...args);

	const path = __webpack_require__(0),
		fs = __webpack_require__(2),
		readLine = __webpack_require__(26),
		isYarn = fs.existsSync(path.resolve(process.cwd(), "yarn.lock")),

		packageManager = isYarn ? "yarn" : "npm",
		options = ["install", "-D", nameOfPackage];

	if (isYarn) options[0] = "add";

	if (packages === "init")
		if (isYarn) {
			options.splice(1, 1);
			options.splice(0, 0, "global");
		} else options[1] = "-g";

	const commandToBeRun = `${packageManager} ${options.join(" ")}`,

		question = `Would you like to install ${packages}? (That will run ${commandToBeRun}) (yes/NO) : `;

	console.error("The command moved into a separate package: " + nameOfPackage);
	const questionInterface = readLine.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	questionInterface.question(question, answer => {
		questionInterface.close();
		switch (answer.toLowerCase()) {
			case "y":
			case "yes":
			case "1":
				runCommand(packageManager, options)
					.then(_ => {
						if (packages !== "init") {
							pathForCmd = path.resolve(process.cwd(), "node_modules", "@webpack-cli", packages);
							return runWhenInstalled(packages, pathForCmd, ...args);
						}

						npmGlobalRoot()
							.then(root => path.resolve(root.trim(), "@webpack-cli", "init"))
							.then(pathForInit => require(pathForInit).default(...args))
							.catch(error => {
								console.error(error);
								process.exitCode = 1;
							});
					})
					.catch(error => {
						console.error(error);
						process.exitCode = 1;
					});
				break;

			default:
				console.error(nameOfPackage + " needs to be installed in order to run the command.");
				process.exitCode = 1;
				break;
		}
	});
};

},
// 20
function(module, exports, __webpack_require__) {

const fs = __webpack_require__(2),
  os = __webpack_require__(4),
  path = __webpack_require__(0),
  ini = __webpack_require__(21);
let prefix;

const getPrefix = () => {
  if (process.env.PREFIX) return process.env.PREFIX;
  if (prefix) return prefix;

  let home = os.homedir();
  if (home) prefix = tryConfigPath(path.resolve(home, '.npmrc'));

  if (prefix) return prefix;

  let npm = tryNpmPath();
  if (npm) {
    prefix = tryConfigPath(path.resolve(npm, '..', '..', 'npmrc'));

    if (prefix) prefix = tryConfigPath(path.resolve(prefix, 'etc', 'npmrc')) || prefix;
  }

  if (!prefix) {
    let { APPDATA, DESTDIR, OSTYPE } = process.env;

    if (process.platform === 'win32' || OSTYPE === 'msys' || OSTYPE === 'cygwin') {
      prefix = APPDATA ? path.join(APPDATA, 'npm') : path.dirname(process.execPath);
      return prefix;
    }

    prefix = path.dirname(path.dirname(process.execPath));

    if (DESTDIR) prefix = path.join(DESTDIR, prefix);
  }

  return prefix;
}

function tryNpmPath() {
  try {
    return fs.realpathSync(__webpack_require__(22).sync('npm'));
  } catch (_) {}
}

function tryConfigPath(configPath) {
  try {
    return ini.parse(fs.readFileSync(configPath, 'utf-8')).prefix;
  } catch (_) {}
}

module.exports = getPrefix();

},
// 21
function(module, exports) {

exports.parse = exports.decode = decode
exports.unsafe = unsafe

function dotSplit(str) {
  return str.replace(/\1/g, '\x02LITERAL\\1LITERAL\x02')
    .replace(/\\\./g, '\x01')
    .split(/\./).map(function(part) {
      return part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, '\x01')
    })
}

function decode(str) {
  var out = {},
    p = out,
    section = null,
    re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i

  str.split(/[\r\n]+/g).forEach(function(line, _, __) {
    if (!line || line.match(/^\s*[;#]/)) return
    var match = line.match(re)
    if (!match) return
    if (match[1] !== void 0) {
      p = (section = unsafe(match[1])) === '__proto__' ? {} : (out[section] = out[section] || {})
      return
    }
    var key = unsafe(match[2])
    if (key === '__proto__') return
    var value = !match[3] || unsafe(match[4])
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    if (key.length > 2 && key.slice(-2) === '[]') {
      if ((key = key.substring(0, key.length - 2)) === '__proto__') return
      p[key] ? Array.isArray(p[key]) || (p[key] = [p[key]]) : (p[key] = [])
    }

    Array.isArray(p[key]) ? p[key].push(value) : (p[key] = value)
  })

  Object.keys(out).filter(function(k, _, __) {
    if (!out[k] || typeof out[k] != 'object' || Array.isArray(out[k])) return false

    var parts = dotSplit(k),
      p = out,
      l = parts.pop(),
      nl = l.replace(/\\\./g, '.')
    parts.forEach(function(part, _, __) {
      if (part === '__proto__') return
      (p[part] && typeof p[part] == 'object') || (p[part] = {})
      p = p[part]
    })
    if (p === out && nl === l) return false

    p[nl] = out[k]
    return true
  }).forEach(function(del, _, __) {
    delete out[del]
  })

  return out
}

function isQuoted(val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

function unsafe(val, doUnesc) {
  if (isQuoted((val = (val || '').trim()))) {
    if (val.charAt(0) === "'") val = val.substr(1, val.length - 2)

    try {
      val = JSON.parse(val)
    } catch (_) {}
    return val
  }

  var esc = false,
    unesc = ''
  for (var i = 0, l = val.length; i < l; i++) {
    var c = val.charAt(i)
    if (esc) {
      '\\;#'.indexOf(c) > -1 ? (unesc += c) : (unesc += '\\' + c)

      esc = false
    } else if (';#'.indexOf(c) > -1) break
    else c === '\\' ? (esc = true) : (unesc += c)
  }
  if (esc) unesc += '\\'

  return unesc.trim()
}

},
// 22
function(module, exports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys',

  path = __webpack_require__(0),
  COLON = isWindows ? ';' : ':',
  isexe = __webpack_require__(23)

function getNotFoundError(cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo(cmd, opt) {
  var colon = opt.colon || COLON,
    pathEnv = opt.path || process.env.PATH || '',
    pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExt = (pathExtExe = opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM').split(colon)

    cmd.indexOf('.') < 0 || pathExt[0] === '' || pathExt.unshift('')
  }

  if (cmd.match(/\//) || (isWindows && cmd.match(/\\/))) pathEnv = ['']

  return { env: pathEnv, ext: pathExt, extExe: pathExtExe }
}

function which(cmd, opt, cb) {
  if (typeof opt == 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt),
    pathEnv = info.env,
    pathExt = info.ext,
    pathExtExe = info.extExe,
    found = []

  !(function F(i, l) {
    if (i === l) return opt.all && found.length ? cb(null, found) : cb(getNotFoundError(cmd))

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) p = cmd.slice(0, 2) + p

    !(function E(ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function(er, is) {
        if (!er && is) {
          if (!opt.all) return cb(null, p + ext)

          found.push(p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync(cmd, opt) {
  var info = getPathInfo(cmd, (opt = opt || {})),
    pathEnv = info.env,
    pathExt = info.ext,
    pathExtExe = info.extExe,
    found = []

  for (var i = 0, l = pathEnv.length; i < l; i++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"') pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) p = cmd.slice(0, 2) + p

    for (var j = 0, ll = pathExt.length; j < ll; j++) {
      var cur = p + pathExt[j]
      try {
        if (isexe.sync(cur, { pathExt: pathExtExe })) {
          if (!opt.all) return cur

          found.push(cur)
        }
      } catch (_) {}
    }
  }

  if (opt.all && found.length) return found
  if (opt.nothrow) return null

  throw getNotFoundError(cmd)
}

},
// 23
function(module, exports, __webpack_require__) {

var core = __webpack_require__(process.platform === 'win32' || global.TESTING_WINDOWS ? 24 : 25)

module.exports = isexe
isexe.sync = sync

function isexe(path, options, cb) {
  if (typeof options == 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise != 'function') throw new TypeError('callback not provided')

    return new Promise(function(resolve, reject) {
      isexe(path, options || {}, function(er, is) {
        er ? reject(er) : resolve(is)
      })
    })
  }

  core(path, options || {}, function(er, is) {
    if (er && (er.code === 'EACCES' || (options && options.ignoreErrors))) {
      er = null
      is = false
    }
    cb(er, is)
  })
}

function sync(path, options) {
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if ((options && options.ignoreErrors) || er.code === 'EACCES') return false
    throw er
  }
}

},
// 24
function(module, exports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(2)

function checkPathExt(path, options) {
  var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT

  if (!pathext || (pathext = pathext.split(';')).indexOf('') > -1) return true

  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) return true
  }
  return false
}

function checkStat(stat, path, options) {
  return !!(stat.isSymbolicLink() || stat.isFile()) && checkPathExt(path, options)
}

function isexe(path, options, cb) {
  fs.stat(path, function(er, stat) {
    cb(er, !er && checkStat(stat, path, options))
  })
}

function sync(path, options) {
  return checkStat(fs.statSync(path), path, options)
}

},
// 25
function(module, exports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(2)

function isexe(path, options, cb) {
  fs.stat(path, function(er, stat) {
    cb(er, !er && checkStat(stat, options))
  })
}

function sync(path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat(stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode(stat, options) {
  var mod = stat.mode,
    uid = stat.uid,
    gid = stat.gid,

    myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid(),
    myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid(),

    u = parseInt('100', 8),
    g = parseInt('010', 8),
    o = parseInt('001', 8)

  return mod & o ||
    (mod & g && gid === myGid) ||
    (mod & u && uid === myUid) ||
    (mod & (u | g) && myUid === 0)
}

},
// 26
function(module) {

module.exports = require("readline");

},
// 27
function(module) {

module.exports = require("../vendor/yargs");

},
// 28
function(module) {

module.exports = { name: "webpack-cli", version: "3.3.12", description: "CLI for webpack & friends" };

},
// 29
function(module, exports, __webpack_require__) {

const optionsSchema = __webpack_require__(30),

	{ GROUPS } = __webpack_require__(3);

const {
	CONFIG_GROUP,
	BASIC_GROUP,
	MODULE_GROUP,
	OUTPUT_GROUP,
	ADVANCED_GROUP,
	RESOLVE_GROUP,
	OPTIMIZE_GROUP,
	DISPLAY_GROUP
} = GROUPS;

const nestedProperties = ["anyOf", "oneOf", "allOf"];

const resolveSchema = schema => {
	let current = schema;
	if (schema && typeof schema == "object" && "$ref" in schema) {
		const path = schema.$ref.split("/");
		for (const element of path) current = element === "#" ? optionsSchema : current[element];
	}
	return current;
};

const findPropertyInSchema = (schema, property, subProperty) => {
	if (!schema) return null;
	if (subProperty) {
		if (schema[property] && typeof schema[property] == "object" && subProperty in schema[property])
			return resolveSchema(schema[property][subProperty]);
	} else if (property in schema) return resolveSchema(schema[property]);

	for (const name of nestedProperties)
		if (schema[name])
			for (const item of schema[name]) {
				const resolvedItem = resolveSchema(item),
					result = findPropertyInSchema(resolvedItem, property, subProperty);
				if (result) return result;
			}

	return void 0;
};

const getSchemaInfo = (path, property, subProperty) => {
	const pathSegments = path.split(".");
	let current = optionsSchema;
	for (const segment of pathSegments) {
		current = segment === "*"
			? findPropertyInSchema(current, "additionalProperties") || findPropertyInSchema(current, "items")
			: findPropertyInSchema(current, "properties", segment);

		if (!current) return void 0;
	}
	return findPropertyInSchema(current, property, subProperty);
};

module.exports = function(yargs) {
	yargs
		.help("help")
		.alias("help", "h")
		.version()
		.alias("version", "v")
		.options({
			config: {
				type: "string",
				describe: "Path to the config file",
				group: CONFIG_GROUP,
				defaultDescription: "webpack.config.js or webpackfile.js",
				requiresArg: true
			},
			"config-register": {
				type: "array",
				alias: "r",
				describe: "Preload one or more modules before loading the webpack configuration",
				group: CONFIG_GROUP,
				defaultDescription: "module id or path",
				requiresArg: true
			},
			"config-name": {
				type: "string",
				describe: "Name of the config to use",
				group: CONFIG_GROUP,
				requiresArg: true
			},
			env: { describe: "Environment passed to the config, when it is a function", group: CONFIG_GROUP },
			mode: {
				type: getSchemaInfo("mode", "type"),
				choices: getSchemaInfo("mode", "enum"),
				describe: getSchemaInfo("mode", "description"),
				group: CONFIG_GROUP,
				requiresArg: true
			},
			context: {
				type: getSchemaInfo("context", "type"),
				describe: getSchemaInfo("context", "description"),
				group: BASIC_GROUP,
				defaultDescription: "The current directory",
				requiresArg: true
			},
			entry: {
				type: "string",
				describe: getSchemaInfo("entry", "description"),
				group: BASIC_GROUP,
				requiresArg: true
			},
			"no-cache": { type: "boolean", describe: "Disables cached builds", group: BASIC_GROUP },
			"module-bind": {
				type: "string",
				describe: "Bind an extension to a loader",
				group: MODULE_GROUP,
				requiresArg: true
			},
			"module-bind-post": {
				type: "string",
				describe: "Bind an extension to a post loader",
				group: MODULE_GROUP,
				requiresArg: true
			},
			"module-bind-pre": {
				type: "string",
				describe: "Bind an extension to a pre loader",
				group: MODULE_GROUP,
				requiresArg: true
			},
			output: {
				alias: "o",
				describe: "The output path and file for compilation assets",
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"output-path": {
				type: "string",
				describe: getSchemaInfo("output.path", "description"),
				group: OUTPUT_GROUP,
				defaultDescription: "The current directory",
				requiresArg: true
			},
			"output-filename": {
				type: "string",
				describe: getSchemaInfo("output.filename", "description"),
				group: OUTPUT_GROUP,
				defaultDescription: "[name].js",
				requiresArg: true
			},
			"output-chunk-filename": {
				type: "string",
				describe: getSchemaInfo("output.chunkFilename", "description"),
				group: OUTPUT_GROUP,
				defaultDescription: "filename with [id] instead of [name] or [id] prefixed",
				requiresArg: true
			},
			"output-source-map-filename": {
				type: "string",
				describe: getSchemaInfo("output.sourceMapFilename", "description"),
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"output-public-path": {
				type: "string",
				describe: getSchemaInfo("output.publicPath", "description"),
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"output-jsonp-function": {
				type: "string",
				describe: getSchemaInfo("output.jsonpFunction", "description"),
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"output-pathinfo": {
				type: "boolean",
				describe: getSchemaInfo("output.pathinfo", "description"),
				group: OUTPUT_GROUP
			},
			"output-library": {
				type: "array",
				describe: "Expose the exports of the entry point as library",
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"output-library-target": {
				type: "string",
				describe: getSchemaInfo("output.libraryTarget", "description"),
				choices: getSchemaInfo("output.libraryTarget", "enum"),
				group: OUTPUT_GROUP,
				requiresArg: true
			},
			"records-input-path": {
				type: "string",
				describe: getSchemaInfo("recordsInputPath", "description"),
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			"records-output-path": {
				type: "string",
				describe: getSchemaInfo("recordsOutputPath", "description"),
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			"records-path": {
				type: "string",
				describe: getSchemaInfo("recordsPath", "description"),
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			define: {
				type: "string",
				describe: "Define any free var in the bundle",
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			target: {
				type: "string",
				describe: getSchemaInfo("target", "description"),
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			cache: {
				type: "boolean",
				describe: getSchemaInfo("cache", "description"),
				default: null,
				group: ADVANCED_GROUP,
				defaultDescription: "It's enabled by default when watching"
			},
			watch: {
				type: "boolean",
				alias: "w",
				describe: getSchemaInfo("watch", "description"),
				group: BASIC_GROUP
			},
			"watch-stdin": {
				type: "boolean",
				alias: "stdin",
				describe: getSchemaInfo("watchOptions.stdin", "description"),
				group: ADVANCED_GROUP
			},
			"watch-aggregate-timeout": {
				describe: getSchemaInfo("watchOptions.aggregateTimeout", "description"),
				type: getSchemaInfo("watchOptions.aggregateTimeout", "type"),
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			"watch-poll": {
				type: "string",
				describe: getSchemaInfo("watchOptions.poll", "description"),
				group: ADVANCED_GROUP
			},
			hot: { type: "boolean", describe: "Enables Hot Module Replacement", group: ADVANCED_GROUP },
			debug: { type: "boolean", describe: "Switch loaders to debug mode", group: BASIC_GROUP },
			devtool: {
				type: "string",
				describe: getSchemaInfo("devtool", "description"),
				group: BASIC_GROUP,
				requiresArg: true
			},
			"resolve-alias": {
				type: "string",
				describe: getSchemaInfo("resolve.alias", "description"),
				group: RESOLVE_GROUP,
				requiresArg: true
			},
			"resolve-extensions": {
				type: "array",
				describe: getSchemaInfo("resolve.alias", "description"),
				group: RESOLVE_GROUP,
				requiresArg: true
			},
			"resolve-loader-alias": {
				type: "string",
				describe: "Setup a loader alias for resolving",
				group: RESOLVE_GROUP,
				requiresArg: true
			},
			"optimize-max-chunks": {
				describe: "Try to keep the chunk count below a limit",
				group: OPTIMIZE_GROUP,
				requiresArg: true
			},
			"optimize-min-chunk-size": {
				describe: getSchemaInfo("optimization.splitChunks.minSize", "description"),
				group: OPTIMIZE_GROUP,
				requiresArg: true
			},
			"optimize-minimize": {
				type: "boolean",
				describe: getSchemaInfo("optimization.minimize", "description"),
				group: OPTIMIZE_GROUP
			},
			prefetch: {
				type: "string",
				describe: "Prefetch this request (Example: --prefetch ./file.js)",
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			provide: {
				type: "string",
				describe: "Provide these modules as free vars in all modules (Example: --provide jQuery=jquery)",
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			"labeled-modules": { type: "boolean", describe: "Enables labeled modules", group: ADVANCED_GROUP },
			plugin: {
				type: "string",
				describe: "Load this plugin",
				group: ADVANCED_GROUP,
				requiresArg: true
			},
			bail: {
				type: getSchemaInfo("bail", "type"),
				describe: getSchemaInfo("bail", "description"),
				group: ADVANCED_GROUP,
				default: null
			},
			profile: {
				type: "boolean",
				describe: getSchemaInfo("profile", "description"),
				group: ADVANCED_GROUP,
				default: null
			},
			d: {
				type: "boolean",
				describe: "shortcut for --debug --devtool eval-cheap-module-source-map --output-pathinfo",
				group: BASIC_GROUP
			},
			p: {
				type: "boolean",
				describe: 'shortcut for --optimize-minimize --define process.env.NODE_ENV="production"',
				group: BASIC_GROUP
			},
			silent: { type: "boolean", describe: "Prevent output from being displayed in stdout" },
			json: { type: "boolean", alias: "j", describe: "Prints the result as JSON." },
			progress: {
				type: "boolean",
				describe: "Print compilation progress in percentage",
				group: BASIC_GROUP
			},
			color: {
				type: "boolean",
				alias: "colors",
				default: function() {
					return __webpack_require__(7).stdout;
				},
				group: DISPLAY_GROUP,
				describe: "Force colors on the console"
			},
			"no-color": {
				type: "boolean",
				alias: "no-colors",
				group: DISPLAY_GROUP,
				describe: "Force no colors on the console"
			},
			"sort-modules-by": {
				type: "string",
				group: DISPLAY_GROUP,
				describe: "Sorts the modules list by property in module"
			},
			"sort-chunks-by": {
				type: "string",
				group: DISPLAY_GROUP,
				describe: "Sorts the chunks list by property in chunk"
			},
			"sort-assets-by": {
				type: "string",
				group: DISPLAY_GROUP,
				describe: "Sorts the assets list by property in asset"
			},
			"hide-modules": { type: "boolean", group: DISPLAY_GROUP, describe: "Hides info about modules" },
			"display-exclude": { type: "string", group: DISPLAY_GROUP, describe: "Exclude modules in the output" },
			"display-modules": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display even excluded modules in the output"
			},
			"display-max-modules": {
				type: "number",
				group: DISPLAY_GROUP,
				describe: "Sets the maximum number of visible modules in output"
			},
			"display-chunks": { type: "boolean", group: DISPLAY_GROUP, describe: "Display chunks in the output" },
			"display-entrypoints": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display entry points in the output"
			},
			"display-origins": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display origins of chunks in the output"
			},
			"display-cached": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display also cached modules in the output"
			},
			"display-cached-assets": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display also cached assets in the output"
			},
			"display-reasons": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display reasons about module inclusion in the output"
			},
			"display-depth": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display distance from entry point for each module"
			},
			"display-used-exports": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display information about used exports in modules (Tree Shaking)"
			},
			"display-provided-exports": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display information about exports provided from modules"
			},
			"display-optimization-bailout": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display information about why optimization bailed out for modules"
			},
			"display-error-details": {
				type: "boolean",
				group: DISPLAY_GROUP,
				describe: "Display details about errors"
			},
			display: {
				type: "string",
				choices: ["", "verbose", "detailed", "normal", "minimal", "errors-only", "none"],
				group: DISPLAY_GROUP,
				describe: "Select display preset"
			},
			verbose: { type: "boolean", group: DISPLAY_GROUP, describe: "Show more details" },
			"info-verbosity": {
				type: "string",
				default: "info",
				choices: ["none", "info", "verbose"],
				group: DISPLAY_GROUP,
				describe: "Controls the output of lifecycle messaging e.g. Started watching files..."
			},
			"build-delimiter": {
				type: "string",
				group: DISPLAY_GROUP,
				describe: "Display custom text after build output"
			}
		});
};

},
// 30
function(module) {

module.exports = require("./optionsSchema.json");

},
// 31
function(module) {

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : flag.length === 1 ? '-' : '--',
		pos = argv.indexOf(prefix + flag),
		terminatorPos = argv.indexOf('--');
	return pos > -1 && (terminatorPos < 0 || pos < terminatorPos);
};

},
// 32
function(module, exports, __webpack_require__) {

__webpack_require__(8)(module);

const path = __webpack_require__(0),
	fs = __webpack_require__(2);
fs.existsSync = fs.existsSync || path.existsSync;
const interpret = __webpack_require__(33),
	prepareOptions = __webpack_require__(34),
	findup = __webpack_require__(35),
	validateOptions = __webpack_require__(42);

module.exports = function(...args) {
	const argv = args[1] || args[0],
		options = [];
	if (argv.d) {
		argv.debug = true;
		argv["output-pathinfo"] = true;
		argv.devtool || (argv.devtool = "eval-cheap-module-source-map");

		argv.mode || (argv.mode = "development");
	}
	if (argv.p) {
		argv["optimize-minimize"] = true;
		argv.define = [].concat(argv.define || []).concat('process.env.NODE_ENV="production"');
		argv.mode || (argv.mode = "production");
	}

	if (argv.output) {
		let output = argv.output;
		path.isAbsolute(argv.o) || (output = path.resolve(process.cwd(), output));

		argv["output-filename"] = path.basename(output);
		argv["output-path"] = path.dirname(output);
	}

	let configFileLoaded = false,
		configFiles = [];
	const extensions = Object.keys(interpret.extensions).sort(function(a, b) {
		return a === ".js" ? -1 : b === ".js" ? 1 : a.length - b.length;
	});

	let i;
	if (argv.config) {
		const getConfigExtension = function(configPath) {
			for (i = extensions.length - 1; i >= 0; i--) {
				const tmpExt = extensions[i];
				if (configPath.indexOf(tmpExt, configPath.length - tmpExt.length) > -1) return tmpExt;
			}
			return path.extname(configPath);
		};

		const mapConfigArg = function(configArg) {
			const resolvedPath = path.resolve(configArg);
			return { path: resolvedPath, ext: getConfigExtension(resolvedPath) };
		};

		configFiles = (Array.isArray(argv.config) ? argv.config : [argv.config]).map(mapConfigArg);
	} else {
		const defaultConfigFileNames = ["webpack.config", "webpackfile"].join("|"),
			webpackConfigFileRegExp = `(${defaultConfigFileNames})(${extensions.join("|")})`,
			pathToWebpackConfig = findup(webpackConfigFileRegExp);

		if (pathToWebpackConfig) {
			const resolvedPath = path.resolve(pathToWebpackConfig),
				ext = path.basename(resolvedPath).replace(new RegExp(defaultConfigFileNames), "");
			configFiles.push({ path: resolvedPath, ext });
		}
	}
	if (configFiles.length > 0) {
		const registerCompiler = function registerCompiler(moduleDescriptor) {
			if (moduleDescriptor)
				if (typeof moduleDescriptor == "string") require(moduleDescriptor);
				else if (!Array.isArray(moduleDescriptor))
					moduleDescriptor.register(require(moduleDescriptor.module));
				else
					for (let i = 0; i < moduleDescriptor.length; i++)
						try {
							registerCompiler(moduleDescriptor[i]);
							break;
						} catch (_) {}
		};

		const requireConfig = function(configPath) {
			let options = /* WEBPACK_OPTIONS */ (function() {
				if (argv.configRegister && argv.configRegister.length) {
					module.paths.unshift(path.resolve(process.cwd(), "node_modules"), process.cwd());
					argv.configRegister.forEach(dep => {
						require(dep);
					});
				}
				return require(path.resolve(process.cwd(), configPath));
			})();
			options = prepareOptions(options, argv);
			return options;
		};

		configFiles.forEach(function(file) {
			registerCompiler(interpret.extensions[file.ext]);
			options.push(requireConfig(file.path));
		});
		configFileLoaded = true;
	}

	return configFileLoaded
		? processConfiguredOptions(options.length === 1 ? options[0] : options)
		: processConfiguredOptions();

	function processConfiguredOptions(options) {
		options ? validateOptions(options) : (options = {});

		if (typeof options.then == "function") return options.then(processConfiguredOptions);

		if (typeof options == "object" && typeof options.default == "object")
			return processConfiguredOptions(options.default);

		if (Array.isArray(options) && argv["config-name"]) {
			const namedOptions = options.filter(function(opt) {
				return opt.name === argv["config-name"];
			});
			if (namedOptions.length === 0) {
				console.error("Configuration with name '" + argv["config-name"] + "' was not found.");
				process.exit(-1);
			} else if (namedOptions.length === 1) return processConfiguredOptions(namedOptions[0]);

			options = namedOptions;
		}

		Array.isArray(options) ? options.forEach(processOptions) : processOptions(options);

		if (argv.context) options.context = path.resolve(argv.context);

		options.context || (options.context = process.cwd());

		if (argv.watch) options.watch = true;

		if (argv["watch-aggregate-timeout"]) {
			options.watchOptions = options.watchOptions || {};
			options.watchOptions.aggregateTimeout = +argv["watch-aggregate-timeout"];
		}

		if (argv["watch-poll"] !== void 0) {
			options.watchOptions = options.watchOptions || {};
			argv["watch-poll"] === "true" || argv["watch-poll"] === ""
				? (options.watchOptions.poll = true)
				: isNaN(argv["watch-poll"]) || (options.watchOptions.poll = +argv["watch-poll"]);
		}

		if (argv["watch-stdin"]) {
			options.watchOptions = options.watchOptions || {};
			options.watchOptions.stdin = true;
			options.watch = true;
		}

		return options;
	}

	function processOptions(options) {
		function ifArg(name, fn, init, finalize) {
			const isArray = Array.isArray(argv[name]),
				isSet = argv[name] !== void 0 && argv[name] !== null;
			if (!isArray && !isSet) return;

			init && init();
			isArray ? argv[name].forEach(fn) : isSet && fn(argv[name], -1);
			finalize && finalize();
		}

		function ifArgPair(name, fn, init, finalize) {
			ifArg(
				name,
				function(content, idx) {
					const i = content.indexOf("=");
					return i < 0 ? fn(null, content, idx) : fn(content.substr(0, i), content.substr(i + 1), idx);
				},
				init,
				finalize
			);
		}

		function ifBooleanArg(name, fn) {
			ifArg(name, function(bool) {
				bool && fn();
			});
		}

		function mapArgToBoolean(name, optionName) {
			ifArg(name, function(bool) {
				if (typeof bool == "boolean") options[optionName || name] = bool;
			});
		}

		function loadPlugin(name) {
			let args, path, Plugin;
			try {
				const p = (name || "").indexOf("?");
				if (p > -1) {
					args = __webpack_require__(44).parseQuery(name.substring(p));
					name = name.substring(0, p);
				}
			} catch (e) {
				console.log("Invalid plugin arguments " + name + " (" + e + ").");
				process.exit(-1);
			}

			try {
				path = __webpack_require__(45).sync(process.cwd(), name);
			} catch (_e) {
				console.log("Cannot resolve plugin " + name + ".");
				process.exit(-1);
			}
			try {
				Plugin = require(path);
			} catch (e) {
				console.log("Cannot load plugin " + name + ". (" + path + ")");
				throw e;
			}
			try {
				return new Plugin(args);
			} catch (e) {
				console.log("Cannot instantiate plugin " + name + ". (" + path + ")");
				throw e;
			}
		}

		function ensureObject(parent, name, force) {
			if (force || typeof parent[name] != "object" || parent[name] === null) parent[name] = {};
		}

		function ensureArray(parent, name) {
			Array.isArray(parent[name]) || (parent[name] = []);
		}

		function addPlugin(options, plugin) {
			ensureArray(options, "plugins");
			options.plugins.unshift(plugin);
		}

		ifArg("mode", function(value) {
			options.mode = value;
		});

		ifArgPair(
			"entry",
			function(name, entry) {
				options.entry[name] !== void 0 && options.entry[name] !== null
					? (options.entry[name] = [].concat(options.entry[name]).concat(entry))
					: (options.entry[name] = entry);
			},
			function() {
				ensureObject(options, "entry", true);
			}
		);

		function bindRules(arg) {
			ifArgPair(
				arg,
				function(name, binding) {
					if (name === null) {
						name = binding;
						binding += "-loader";
					}
					const rule = {
						test: new RegExp("\\." + name.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + "$"),
						loader: binding
					};
					if (arg === "module-bind-pre") rule.enforce = "pre";
					else if (arg === "module-bind-post") rule.enforce = "post";

					options.module.rules.push(rule);
				},
				function() {
					ensureObject(options, "module");
					ensureArray(options.module, "rules");
				}
			);
		}
		bindRules("module-bind");
		bindRules("module-bind-pre");
		bindRules("module-bind-post");

		let defineObject;
		ifArgPair(
			"define",
			function(name, value) {
				if (name === null) {
					name = value;
					value = true;
				}
				defineObject[name] = value;
			},
			function() {
				defineObject = {};
			},
			function() {
				const DefinePlugin = __webpack_require__(1).DefinePlugin;
				addPlugin(options, new DefinePlugin(defineObject));
			}
		);

		ifArg("output-path", function(value) {
			ensureObject(options, "output");
			options.output.path = path.resolve(value);
		});

		ifArg("output-filename", function(value) {
			ensureObject(options, "output");

			options.output.filename = value;
		});

		ifArg("output-chunk-filename", function(value) {
			ensureObject(options, "output");
			options.output.chunkFilename = value;
		});

		ifArg("output-source-map-filename", function(value) {
			ensureObject(options, "output");
			options.output.sourceMapFilename = value;
		});

		ifArg("output-public-path", function(value) {
			ensureObject(options, "output");
			options.output.publicPath = value;
		});

		ifArg("output-jsonp-function", function(value) {
			ensureObject(options, "output");
			options.output.jsonpFunction = value;
		});

		ifBooleanArg("output-pathinfo", function() {
			ensureObject(options, "output");
			options.output.pathinfo = true;
		});

		ifArg("output-library", function(value) {
			ensureObject(options, "output");
			ensureArray(options.output, "library");
			options.output.library.push(value);
		});

		ifArg("output-library-target", function(value) {
			ensureObject(options, "output");
			options.output.libraryTarget = value;
		});

		ifArg("records-input-path", function(value) {
			options.recordsInputPath = path.resolve(value);
		});

		ifArg("records-output-path", function(value) {
			options.recordsOutputPath = path.resolve(value);
		});

		ifArg("records-path", function(value) {
			options.recordsPath = path.resolve(value);
		});

		ifArg("target", function(value) {
			options.target = value;
		});

		mapArgToBoolean("cache");

		ifBooleanArg("hot", function() {
			const HotModuleReplacementPlugin = __webpack_require__(1).HotModuleReplacementPlugin;
			addPlugin(options, new HotModuleReplacementPlugin());
		});

		ifBooleanArg("no-cache", function() {
			options.cache = false;
		});

		ifBooleanArg("debug", function() {
			const LoaderOptionsPlugin = __webpack_require__(1).LoaderOptionsPlugin;
			addPlugin(options, new LoaderOptionsPlugin({ debug: true }));
		});

		ifArg("devtool", function(value) {
			options.devtool = value;
		});

		function processResolveAlias(arg, key) {
			ifArgPair(arg, function(name, value) {
				if (!name) throw new Error("--" + arg + " <string>=<string>");

				ensureObject(options, key);
				ensureObject(options[key], "alias");
				options[key].alias[name] = value;
			});
		}
		processResolveAlias("resolve-alias", "resolve");
		processResolveAlias("resolve-loader-alias", "resolveLoader");

		ifArg("resolve-extensions", function(value) {
			ensureObject(options, "resolve");
			options.resolve.extensions = Array.isArray(value) ? value : value.split(/,\s*/);
		});

		ifArg("optimize-max-chunks", function(value) {
			const LimitChunkCountPlugin = __webpack_require__(1).optimize.LimitChunkCountPlugin;
			addPlugin(options, new LimitChunkCountPlugin({ maxChunks: parseInt(value, 10) }));
		});

		ifArg("optimize-min-chunk-size", function(value) {
			const MinChunkSizePlugin = __webpack_require__(1).optimize.MinChunkSizePlugin;
			addPlugin(options, new MinChunkSizePlugin({ minChunkSize: parseInt(value, 10) }));
		});

		ifBooleanArg("optimize-minimize", function() {
			const LoaderOptionsPlugin = __webpack_require__(1).LoaderOptionsPlugin;
			addPlugin(options, new LoaderOptionsPlugin({ minimize: true }));
		});

		ifArg("prefetch", function(request) {
			const PrefetchPlugin = __webpack_require__(1).PrefetchPlugin;
			addPlugin(options, new PrefetchPlugin(request));
		});

		ifArg("provide", function(value) {
			const idx = value.indexOf("=");
			let name;
			if (idx >= 0) {
				name = value.substr(0, idx);
				value = value.substr(idx + 1);
			} else name = value;

			const ProvidePlugin = __webpack_require__(1).ProvidePlugin;
			addPlugin(options, new ProvidePlugin(name, value));
		});

		ifArg("plugin", function(value) {
			addPlugin(options, loadPlugin(value));
		});

		mapArgToBoolean("bail");

		mapArgToBoolean("profile");

		if (argv._.length > 0) {
			ensureObject(options, "entry", true);

			const addTo = function(name, entry) {
				if (options.entry[name]) {
					Array.isArray(options.entry[name]) || (options.entry[name] = [options.entry[name]]);

					options.entry[name].push(entry);
				} else options.entry[name] = entry;
			};
			argv._.forEach(function(content) {
				const i = content.indexOf("="),
					j = content.indexOf("?");
				if (i < 0 || (j >= 0 && j < i)) {
					const resolved = path.resolve(content);
					fs.existsSync(resolved)
						? addTo("main", `${resolved}${fs.statSync(resolved).isDirectory() ? path.sep : ""}`)
						: addTo("main", content);
				} else addTo(content.substr(0, i), content.substr(i + 1));
			});
		}
	}
};

},
// 33
function(module, exports, __webpack_require__) {

__webpack_require__(8)(module);

var extensions = {
  '.babel.js': [
    {
      module: '@babel/register',
      register: function(hook) {
        hook({ extensions: '.js' });
      }
    },
    {
      module: 'babel-register',
      register: function(hook) {
        hook({ extensions: '.js' });
      }
    },
    {
      module: 'babel-core/register',
      register: function(hook) {
        hook({ extensions: '.js' });
      }
    },
    {
      module: 'babel/register',
      register: function(hook) {
        hook({ extensions: '.js' });
      }
    }
  ],
  '.babel.ts': [
    {
      module: '@babel/register',
      register: function(hook) {
        hook({ extensions: '.ts' });
      }
    }
  ],
  '.buble.js': 'buble/register',
  '.cirru': 'cirru-script/lib/register',
  '.cjsx': 'node-cjsx/register',
  '.co': 'coco',
  '.coffee': ['coffeescript/register', 'coffee-script/register', 'coffeescript', 'coffee-script'],
  '.coffee.md': ['coffeescript/register', 'coffee-script/register', 'coffeescript', 'coffee-script'],
  '.csv': 'require-csv',
  '.eg': 'earlgrey/register',
  '.esm.js': {
    module: 'esm',
    register: function(hook) {
      var esmLoader = hook(module);
      require.extensions['.js'] = esmLoader('module')._extensions['.js'];
    }
  },
  '.iced': ['iced-coffee-script/register', 'iced-coffee-script'],
  '.iced.md': 'iced-coffee-script/register',
  '.ini': 'require-ini',
  '.js': null,
  '.json': null,
  '.json5': 'json5/lib/require',
  '.jsx': [
    {
      module: '@babel/register',
      register: function(hook) {
        hook({ extensions: '.jsx' });
      }
    },
    {
      module: 'babel-register',
      register: function(hook) {
        hook({ extensions: '.jsx' });
      }
    },
    {
      module: 'babel-core/register',
      register: function(hook) {
        hook({ extensions: '.jsx' });
      }
    },
    {
      module: 'babel/register',
      register: function(hook) {
        hook({ extensions: '.jsx' });
      }
    },
    {
      module: 'node-jsx',
      register: function(hook) {
        hook.install({ extension: '.jsx', harmony: true });
      }
    }
  ],
  '.litcoffee': ['coffeescript/register', 'coffee-script/register', 'coffeescript', 'coffee-script'],
  '.liticed': 'iced-coffee-script/register',
  '.ls': ['livescript', 'LiveScript'],
  '.mjs': null,
  '.node': null,
  '.toml': {
    module: 'toml-require',
    register: function(hook) {
      hook.install();
    }
  },
  '.ts': [
    'ts-node/register',
    'typescript-node/register',
    'typescript-register',
    'typescript-require',
    'sucrase/register/ts',
    {
      module: '@babel/register',
      register: function(hook) {
        hook({ extensions: '.ts' });
      }
    }
  ],
  '.tsx': [
    'ts-node/register',
    'typescript-node/register',
    'sucrase/register',
    {
      module: '@babel/register',
      register: function(hook) {
        hook({ extensions: '.tsx' });
      }
    }
  ],
  '.wisp': 'wisp/engine/node',
  '.xml': 'require-xml',
  '.yaml': 'require-yaml',
  '.yml': 'require-yaml'
};

var jsVariantExtensions = [
  '.js',
  '.babel.js',
  '.babel.ts',
  '.buble.js',
  '.cirru',
  '.cjsx',
  '.co',
  '.coffee',
  '.coffee.md',
  '.eg',
  '.esm.js',
  '.iced',
  '.iced.md',
  '.jsx',
  '.litcoffee',
  '.liticed',
  '.ls',
  '.mjs',
  '.ts',
  '.tsx',
  '.wisp'
];

module.exports = {
  extensions: extensions,
  jsVariants: jsVariantExtensions.reduce(function(result, ext) {
    result[ext] = extensions[ext];
    return result;
  }, {})
};

},
// 34
function(module) {

module.exports = function(options, argv) {
	argv = argv || {};
	options = handleExport(options);

	return Array.isArray(options)
		? options.map(_options => handleFunction(_options, argv))
		: handleFunction(options, argv);
};

function handleExport(options) {
	return typeof options == "object" && options !== null && options.default !== void 0
		? options.default
		: options;
}

function handleFunction(options, argv) {
	if (typeof options == "function") options = options(argv.env, argv);

	return options;
}

},
// 35
function(module, exports, __webpack_require__) {

var fs = __webpack_require__(2),
  path = __webpack_require__(0),
  isGlob = __webpack_require__(36),
  resolveDir = __webpack_require__(38),
  detect = __webpack_require__(40),
  mm = __webpack_require__(41);

module.exports = function(patterns, options) {
  options = options || {};
  var cwd = path.resolve(resolveDir(options.cwd || ''));

  if (typeof patterns == 'string') return lookup(cwd, [patterns], options);

  if (!Array.isArray(patterns))
    throw new TypeError('findup-sync expects a string or array as the first argument.');

  return lookup(cwd, patterns, options);
};

function lookup(cwd, patterns, options) {
  for (var res, len = patterns.length, idx = -1; ++idx < len; ) {
    res = isGlob(patterns[idx])
      ? matchFile(cwd, patterns[idx], options)
      : findFile(cwd, patterns[idx], options);

    if (res) return res;
  }

  var dir = path.dirname(cwd);
  return dir === cwd ? null : lookup(dir, patterns, options);
}

function matchFile(cwd, pattern, opts) {
  var isMatch = mm.matcher(pattern, opts),
    files = tryReaddirSync(cwd);

  for (var len = files.length, idx = -1; ++idx < len; ) {
    var name = files[idx],
      fp = path.join(cwd, name);
    if (isMatch(name) || isMatch(fp)) return fp;
  }
  return null;
}

function findFile(cwd, filename, options) {
  var fp = cwd ? path.resolve(cwd, filename) : filename;
  return detect(fp, options);
}

function tryReaddirSync(fp) {
  try {
    return fs.readdirSync(fp);
  } catch (_) {}
  return [];
}

},
// 36
function(module, exports, __webpack_require__) {

var isExtglob = __webpack_require__(37),
  chars = { '{': '}', '(': ')', '[': ']' };
var strictCheck = function(str) {
  if (str[0] === '!') return true;

  var pipeIndex = -2,
    closeSquareIndex = -2,
    closeCurlyIndex = -2,
    closeParenIndex = -2,
    backSlashIndex = -2;
  for (var index = 0; index < str.length; ) {
    if (str[index] === '*' || (str[index + 1] === '?' && /[\].+)]/.test(str[index])))
      return true;

    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
      if (closeSquareIndex < index) closeSquareIndex = str.indexOf(']', index);

      if (closeSquareIndex > index && (
        backSlashIndex === -1 || backSlashIndex > closeSquareIndex ||
        (backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeSquareIndex
      ))
        return true;
    }

    if (
      closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}' &&
      (closeCurlyIndex = str.indexOf('}', index)) > index &&
      ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeCurlyIndex)
    )
      return true;

    if (
      closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' &&
      /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')' &&
      (closeParenIndex = str.indexOf(')', index)) > index &&
      ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeParenIndex)
    )
      return true;

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) pipeIndex = str.indexOf('|', index);

      if (
        pipeIndex !== -1 && str[pipeIndex + 1] !== ')' &&
        (closeParenIndex = str.indexOf(')', pipeIndex)) > pipeIndex &&
        ((backSlashIndex = str.indexOf('\\', pipeIndex)) < 0 || backSlashIndex > closeParenIndex)
      )
        return true;
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        n < 0 || (index = n + 1);
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

var relaxedCheck = function(str) {
  if (str[0] === '!') return true;

  for (var index = 0; index < str.length; ) {
    if (/[*?{}()[\]]/.test(str[index])) return true;

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        n < 0 || (index = n + 1);
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

module.exports = function(str, options) {
  if (typeof str != 'string' || str === '') return false;

  if (isExtglob(str)) return true;

  var check = strictCheck;
  if (options && options.strict === false) check = relaxedCheck;

  return check(str);
};

},
// 37
function(module) {

module.exports = function(str) {
  if (typeof str != 'string' || str === '') return false;

  for (var match; (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)); ) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};

},
// 38
function(module, exports, __webpack_require__) {

var path = __webpack_require__(0),
  expand = __webpack_require__(39),
  gm = __webpack_require__(6);

module.exports = function(dir) {
  if (dir.charAt(0) === '~') dir = expand(dir);

  if (dir.charAt(0) === '@') dir = path.join(gm, dir.slice(1));

  return dir;
};

},
// 39
function(module, exports, __webpack_require__) {

var homedir = __webpack_require__(4).homedir,
  path = __webpack_require__(0);

module.exports = function(filepath) {
  var home = homedir();

  return filepath.charCodeAt(0) === 126
    ? filepath.charCodeAt(1) === 43
      ? path.join(process.cwd(), filepath.slice(2))
      : home ? path.join(home, filepath.slice(1)) : filepath
    : filepath;
};

},
// 40
function(module, exports, __webpack_require__) {

var fs = __webpack_require__(2),
  path = __webpack_require__(0);

module.exports = function(filepath, options) {
  return !filepath || typeof filepath != 'string'
    ? null
    : fs.existsSync(filepath)
    ? path.resolve(filepath)
    : (options = options || {}).nocase === true
    ? nocase(filepath)
    : null;
};

function nocase(filepath) {
  var res = tryReaddir((filepath = path.resolve(filepath)));
  if (res === null) return null;

  if (res.path === filepath) return res.path;

  for (var upper = filepath.toUpperCase(), len = res.files.length, idx = -1; ++idx < len; ) {
    var fp = path.resolve(res.path, res.files[idx]);
    if (filepath === fp || upper === fp) return fp;

    var fpUpper = fp.toUpperCase();
    if (filepath === fpUpper || upper === fpUpper) return fp;
  }

  return null;
}

function tryReaddir(filepath) {
  var ctx = { path: filepath, files: [] };
  try {
    ctx.files = fs.readdirSync(filepath);
    return ctx;
  } catch (_) {}
  try {
    ctx.path = path.dirname(filepath);
    ctx.files = fs.readdirSync(ctx.path);
    return ctx;
  } catch (_) {}
  return null;
}

},
// 41
function(module) {

module.exports = require("../vendor/micromatch");

},
// 42
function(module, exports, __webpack_require__) {

const webpackConfigurationSchema = __webpack_require__(43),
	validateSchema = __webpack_require__(1).validateSchema;

module.exports = function(options) {
	let error;
	try {
		const errors = validateSchema(webpackConfigurationSchema, options);
		if (errors && errors.length > 0) {
			const { WebpackOptionsValidationError } = __webpack_require__(1);
			error = new WebpackOptionsValidationError(errors);
		}
	} catch (err) {
		error = err;
	}

	if (error) {
		console.error(error.message);
		process.exit(-1);
	}
};

},
// 43
function(module) {

module.exports = JSON.parse(
	'{"anyOf":[{"type":"object","description":"A webpack configuration object."},{"type":"array","description":"An array of webpack configuration objects.","items":{"description":"A webpack configuration object.","type":"object"}},{"instanceof":"Promise","description":"A promise that resolves with a configuration object, or an array of configuration objects."}]}'
);

},
// 44
function(module) {

module.exports = require("../lib/loader-utils");

},
// 45
function(module) {

module.exports = require("../lib/enhanced-resolve");

}
]);

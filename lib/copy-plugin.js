"use strict";
module.exports = function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: !1,
      exports: {}
    };
    return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
    module.l = !0, module.exports;
  }
  return __webpack_require__(12);
}([ function(module, exports) {
  module.exports = require("path");
}, function(module, exports, __webpack_require__) {
  const noop = () => {}, levels = Symbol("levels"), instance = Symbol("instance");
  module.exports = class {
    constructor(logger) {
      this[levels] = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        SILENT: 5
      }, this[instance] = logger;
    }
    set logger(logger) {
      this[instance] = logger;
    }
    get logger() {
      return this[instance];
    }
    get levels() {
      return this[levels];
    }
    get methods() {
      return Object.keys(this.levels).map(key => key.toLowerCase()).filter(key => "silent" !== key);
    }
    distillLevel(level) {
      let result = level;
      if ("string" == typeof result && void 0 !== this.levels[result.toUpperCase()] && (result = this.levels[result.toUpperCase()]), 
      this.levelValid(result)) return result;
    }
    levelValid(level) {
      return "number" == typeof level && level >= 0 && level <= this.levels.SILENT;
    }
    make(method) {
      return "debug" === method && (method = "log"), void 0 !== console[method] ? this.bindMethod(console, method) : void 0 !== console.log ? this.bindMethod(console, "log") : noop;
    }
    bindMethod(obj, name) {
      const method = obj[name];
      if ("function" == typeof method.bind) return method.bind(obj);
      try {
        return Function.prototype.bind.call(method, obj);
      } catch (err) {
        return function() {
          return Function.prototype.apply.apply(method, [ obj, arguments ]);
        };
      }
    }
    replaceMethods(logLevel) {
      const level = this.distillLevel(logLevel);
      if (null == level) throw new Error("loglevel: replaceMethods() called with invalid level: " + logLevel);
      if (!this.logger || "LogLevel" !== this.logger.type) throw new TypeError("loglevel: Logger is undefined or invalid. Please specify a valid Logger instance.");
      this.methods.forEach(method => {
        this.logger[method] = this.levels[method.toUpperCase()] < level ? noop : this.make(method);
      }), this.logger.log = this.logger.debug;
    }
  };
}, function(module, exports, __webpack_require__) {
  const processFn = (fn, opts) => function() {
    const P = opts.promiseModule, args = new Array(arguments.length);
    for (let i = 0; i < arguments.length; i++) args[i] = arguments[i];
    return new P((resolve, reject) => {
      opts.errorFirst ? args.push((function(err, result) {
        if (opts.multiArgs) {
          const results = new Array(arguments.length - 1);
          for (let i = 1; i < arguments.length; i++) results[i - 1] = arguments[i];
          err ? (results.unshift(err), reject(results)) : resolve(results);
        } else err ? reject(err) : resolve(result);
      })) : args.push((function(result) {
        if (opts.multiArgs) {
          const results = new Array(arguments.length - 1);
          for (let i = 0; i < arguments.length; i++) results[i] = arguments[i];
          resolve(results);
        } else resolve(result);
      })), fn.apply(this, args);
    });
  };
  module.exports = (obj, opts) => {
    opts = Object.assign({
      exclude: [ /.+(Sync|Stream)$/ ],
      errorFirst: !0,
      promiseModule: Promise
    }, opts);
    const filter = key => {
      const match = pattern => "string" == typeof pattern ? key === pattern : pattern.test(key);
      return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
    };
    let ret;
    ret = "function" == typeof obj ? function() {
      return opts.excludeMain ? obj.apply(this, arguments) : processFn(obj, opts).apply(this, arguments);
    } : Object.create(Object.getPrototypeOf(obj));
    for (const key in obj) {
      const x = obj[key];
      ret[key] = "function" == typeof x && filter(key) ? processFn(x, opts) : x;
    }
    return ret;
  };
}, function(module, exports) {
  module.exports = require("crypto");
}, function(module, exports, __webpack_require__) {
  const MethodFactory = __webpack_require__(1), defaults = {
    name: options => options.logger.name,
    time: () => (new Date).toTimeString().split(" ")[0],
    level: options => `[${options.level}]`,
    template: "{{time}} {{level}} "
  };
  module.exports = class extends MethodFactory {
    constructor(logger, options) {
      super(logger), this.options = Object.assign({}, defaults, options);
    }
    interpolate(level) {
      return this.options.template.replace(/{{([^{}]*)}}/g, (stache, prop) => {
        const fn = this.options[prop];
        return fn ? fn({
          level: level,
          logger: this.logger
        }) : stache;
      });
    }
    make(method) {
      const og = super.make(method);
      return (...args) => {
        const [first] = args, output = this.interpolate(method);
        "string" == typeof first ? args[0] = output + first : args.unshift(output), og(...args);
      };
    }
  };
}, function(module, exports) {
  module.exports = function(str) {
    if ("string" != typeof str || "" === str) return !1;
    for (var match; match = /(\\).|([@?!+*]\(.*\))/g.exec(str); ) {
      if (match[2]) return !0;
      str = str.slice(match.index + match[0].length);
    }
    return !1;
  };
}, function(module, exports) {
  module.exports = require("os");
}, function(module, exports) {
  module.exports = function(path, stripTrailing) {
    if ("string" != typeof path) throw new TypeError("expected path to be a string");
    if ("\\" === path || "/" === path) return "/";
    var len = path.length;
    if (len <= 1) return path;
    var prefix = "";
    if (len > 4 && "\\" === path[3]) {
      var ch = path[2];
      "?" !== ch && "." !== ch || "\\\\" !== path.slice(0, 2) || (path = path.slice(2), 
      prefix = "//");
    }
    var segs = path.split(/[/\\]+/);
    return !1 !== stripTrailing && "" === segs[segs.length - 1] && segs.pop(), prefix + segs.join("/");
  };
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = void 0;
  exports.default = val => "[object Object]" === Object.prototype.toString.call(val);
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.readFile = exports.stat = void 0;
  exports.stat = (inputFileSystem, path) => new Promise((resolve, reject) => {
    inputFileSystem.stat(path, (err, stats) => {
      err && reject(err), resolve(stats);
    });
  });
  exports.readFile = (inputFileSystem, path) => new Promise((resolve, reject) => {
    inputFileSystem.readFile(path, (err, stats) => {
      err && reject(err), resolve(stats);
    });
  });
}, function(module, exports) {
  module.exports = require("../vendor/glob");
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var _path = __webpack_require__(0), validateOptions = __webpack_require__(13), _webpackLog = __webpack_require__(14), _options = __webpack_require__(22), _preProcessPattern = __webpack_require__(23).default, _processPattern = __webpack_require__(31).default, _postProcessPattern = __webpack_require__(43).default;
  class CopyPlugin {
    constructor(patterns = [], options = {}) {
      validateOptions(_options, patterns, this.constructor.name), this.patterns = patterns, 
      this.options = options;
    }
    apply(compiler) {
      const fileDependencies = new Set, contextDependencies = new Set, written = {};
      let context;
      this.options.context ? _path.isAbsolute(this.options.context) ? ({context: context} = this.options) : context = _path.join(compiler.options.context, this.options.context) : ({context: context} = compiler.options);
      const logger = _webpackLog({
        name: "copy-webpack-plugin",
        level: this.options.logLevel || "warn"
      }), plugin = {
        name: "CopyPlugin"
      };
      compiler.hooks.emit.tapAsync(plugin, (compilation, callback) => {
        logger.debug("starting emit");
        const globalRef = {
          logger: logger,
          compilation: compilation,
          written: written,
          fileDependencies: fileDependencies,
          contextDependencies: contextDependencies,
          context: context,
          inputFileSystem: compiler.inputFileSystem,
          output: compiler.options.output.path,
          ignore: this.options.ignore || [],
          copyUnmodified: this.options.copyUnmodified,
          concurrency: this.options.concurrency
        };
        "/" === globalRef.output && compiler.options.devServer && compiler.options.devServer.outputPath && (globalRef.output = compiler.options.devServer.outputPath);
        const {patterns: patterns} = this;
        Promise.all(patterns.map(pattern => Promise.resolve().then(() => _preProcessPattern(globalRef, pattern)).then(pattern => _processPattern(globalRef, pattern).then(files => files ? Promise.all(files.filter(Boolean).map(file => _postProcessPattern(globalRef, pattern, file))) : Promise.resolve())))).catch(error => {
          compilation.errors.push(error);
        }).then(() => {
          logger.debug("finishing emit"), callback();
        });
      }), compiler.hooks.afterEmit.tapAsync(plugin, (compilation, callback) => {
        if (logger.debug("starting after-emit"), "addAll" in compilation.fileDependencies) compilation.fileDependencies.addAll(fileDependencies); else for (const fileDependency of fileDependencies) compilation.fileDependencies.add(fileDependency);
        if ("addAll" in compilation.contextDependencies) compilation.contextDependencies.addAll(contextDependencies); else for (const contextDependency of contextDependencies) compilation.contextDependencies.add(contextDependency);
        logger.debug("finishing after-emit"), callback();
      });
    }
  }
  module.exports = CopyPlugin, module.exports.default = CopyPlugin;
}, function(module, exports) {
  module.exports = require("./schema-utils");
}, function(module, exports, __webpack_require__) {
  const uuid = __webpack_require__(15), colors = __webpack_require__(18), loglevel = __webpack_require__(20), symbols = {
    trace: colors.grey("₸"),
    debug: colors.cyan("➤"),
    info: colors.blue(colors.symbols.info),
    warn: colors.yellow(colors.symbols.warning),
    error: colors.red(colors.symbols.cross)
  }, defaults = {
    name: "<unknown>",
    level: "info",
    unique: !0
  }, prefix = {
    level: options => symbols[options.level],
    template: `{{level}} ${colors.gray("｢{{name}}｣")}: `
  };
  module.exports = function(options) {
    const opts = Object.assign({}, defaults, options), {id: id} = options;
    opts.prefix = Object.assign({}, prefix, options.prefix), delete opts.id, Object.defineProperty(opts, "id", {
      get() {
        return id || this.name + (opts.unique ? "-" + uuid() : "");
      }
    }), opts.timestamp && (opts.prefix.template = "[{{time}}] " + opts.prefix.template);
    const log = loglevel.getLogger(opts);
    return Object.prototype.hasOwnProperty.call(log, "id") || Object.defineProperty(log, "id", {
      get: () => opts.id
    }), log;
  }, module.exports.colors = colors, module.exports.delLogger = function(name) {
    delete loglevel.loggers[name];
  }, module.exports.factories = loglevel.factories;
}, function(module, exports, __webpack_require__) {
  var rng = __webpack_require__(16), bytesToUuid = __webpack_require__(17);
  module.exports = function(options, buf, offset) {
    var i = buf && offset || 0;
    "string" == typeof options && (buf = "binary" === options ? new Array(16) : null, 
    options = null);
    var rnds = (options = options || {}).random || (options.rng || rng)();
    if (rnds[6] = 15 & rnds[6] | 64, rnds[8] = 63 & rnds[8] | 128, buf) for (var ii = 0; ii < 16; ++ii) buf[i + ii] = rnds[ii];
    return buf || bytesToUuid(rnds);
  };
}, function(module, exports, __webpack_require__) {
  var crypto = __webpack_require__(3);
  module.exports = function() {
    return crypto.randomBytes(16);
  };
}, function(module, exports) {
  for (var byteToHex = [], i = 0; i < 256; ++i) byteToHex[i] = (i + 256).toString(16).substr(1);
  module.exports = function(buf, offset) {
    var i = offset || 0, bth = byteToHex;
    return [ bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], "-", bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]] ].join("");
  };
}, function(module, exports, __webpack_require__) {
  const colors = {
    enabled: !0,
    visible: !0,
    styles: {},
    keys: {}
  };
  "FORCE_COLOR" in process.env && (colors.enabled = "0" !== process.env.FORCE_COLOR);
  const wrap = (style, str, nl) => {
    let {open: open, close: close, regex: regex} = style;
    return str = open + (str.includes(close) ? str.replace(regex, close + open) : str) + close, 
    nl ? str.replace(/\r?\n/g, `${close}$&${open}`) : str;
  }, define = (name, codes, type) => {
    colors.styles[name] = (style => (style.open = `[${style.codes[0]}m`, style.close = `[${style.codes[1]}m`, 
    style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, "g"), style))({
      name: name,
      codes: codes
    }), (colors.keys[type] || (colors.keys[type] = [])).push(name), Reflect.defineProperty(colors, name, {
      get() {
        let color = input => ((input, stack) => {
          if ("" === input || null == input) return "";
          if (!1 === colors.enabled) return input;
          if (!1 === colors.visible) return "";
          let str = "" + input, nl = str.includes("\n"), n = stack.length;
          for (;n-- > 0; ) str = wrap(colors.styles[stack[n]], str, nl);
          return str;
        })(input, color.stack);
        return Reflect.setPrototypeOf(color, colors), color.stack = this.stack ? this.stack.concat(name) : [ name ], 
        color;
      }
    });
  };
  define("reset", [ 0, 0 ], "modifier"), define("bold", [ 1, 22 ], "modifier"), define("dim", [ 2, 22 ], "modifier"), 
  define("italic", [ 3, 23 ], "modifier"), define("underline", [ 4, 24 ], "modifier"), 
  define("inverse", [ 7, 27 ], "modifier"), define("hidden", [ 8, 28 ], "modifier"), 
  define("strikethrough", [ 9, 29 ], "modifier"), define("black", [ 30, 39 ], "color"), 
  define("red", [ 31, 39 ], "color"), define("green", [ 32, 39 ], "color"), define("yellow", [ 33, 39 ], "color"), 
  define("blue", [ 34, 39 ], "color"), define("magenta", [ 35, 39 ], "color"), define("cyan", [ 36, 39 ], "color"), 
  define("white", [ 37, 39 ], "color"), define("gray", [ 90, 39 ], "color"), define("grey", [ 90, 39 ], "color"), 
  define("bgBlack", [ 40, 49 ], "bg"), define("bgRed", [ 41, 49 ], "bg"), define("bgGreen", [ 42, 49 ], "bg"), 
  define("bgYellow", [ 43, 49 ], "bg"), define("bgBlue", [ 44, 49 ], "bg"), define("bgMagenta", [ 45, 49 ], "bg"), 
  define("bgCyan", [ 46, 49 ], "bg"), define("bgWhite", [ 47, 49 ], "bg"), define("blackBright", [ 90, 39 ], "bright"), 
  define("redBright", [ 91, 39 ], "bright"), define("greenBright", [ 92, 39 ], "bright"), 
  define("yellowBright", [ 93, 39 ], "bright"), define("blueBright", [ 94, 39 ], "bright"), 
  define("magentaBright", [ 95, 39 ], "bright"), define("cyanBright", [ 96, 39 ], "bright"), 
  define("whiteBright", [ 97, 39 ], "bright"), define("bgBlackBright", [ 100, 49 ], "bgBright"), 
  define("bgRedBright", [ 101, 49 ], "bgBright"), define("bgGreenBright", [ 102, 49 ], "bgBright"), 
  define("bgYellowBright", [ 103, 49 ], "bgBright"), define("bgBlueBright", [ 104, 49 ], "bgBright"), 
  define("bgMagentaBright", [ 105, 49 ], "bgBright"), define("bgCyanBright", [ 106, 49 ], "bgBright"), 
  define("bgWhiteBright", [ 107, 49 ], "bgBright");
  const re = colors.ansiRegex = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;
  colors.hasColor = colors.hasAnsi = str => (re.lastIndex = 0, !!str && "string" == typeof str && re.test(str)), 
  colors.unstyle = str => (re.lastIndex = 0, "string" == typeof str ? str.replace(re, "") : str), 
  colors.none = colors.clear = colors.noop = str => str, colors.stripColor = colors.unstyle, 
  colors.symbols = __webpack_require__(19), colors.define = define, module.exports = colors;
}, function(module, exports, __webpack_require__) {
  const isWindows = "win32" === process.platform, isLinux = "linux" === process.platform, windows = {
    bullet: "•",
    check: "√",
    cross: "×",
    ellipsis: "...",
    heart: "❤",
    info: "i",
    line: "─",
    middot: "·",
    minus: "－",
    plus: "＋",
    question: "?",
    questionSmall: "﹖",
    pointer: ">",
    pointerSmall: "»",
    warning: "‼"
  }, other = {
    ballotCross: "✘",
    bullet: "•",
    check: "✔",
    cross: "✖",
    ellipsis: "…",
    heart: "❤",
    info: "ℹ",
    line: "─",
    middot: "·",
    minus: "－",
    plus: "＋",
    question: "?",
    questionFull: "？",
    questionSmall: "﹖",
    pointer: isLinux ? "▸" : "❯",
    pointerSmall: isLinux ? "‣" : "›",
    warning: "⚠"
  };
  module.exports = isWindows ? windows : other, Reflect.defineProperty(module.exports, "windows", {
    enumerable: !1,
    value: windows
  }), Reflect.defineProperty(module.exports, "other", {
    enumerable: !1,
    value: other
  });
}, function(module, exports, __webpack_require__) {
  const LogLevel = __webpack_require__(21), MethodFactory = __webpack_require__(1), PrefixFactory = __webpack_require__(4), defaultLogger = new LogLevel({
    name: "default"
  }), cache = {
    default: defaultLogger
  }, existing = "undefined" != typeof window ? window.log : null, loglevel = Object.assign(defaultLogger, {
    get factories() {
      return {
        MethodFactory: MethodFactory,
        PrefixFactory: PrefixFactory
      };
    },
    get loggers() {
      return cache;
    },
    getLogger(options) {
      "string" == typeof options && (options = {
        name: options
      }), options.id || (options.id = options.name);
      const {name: name, id: id} = options, defaults = {
        level: defaultLogger.level
      };
      if ("string" != typeof name || !name || !name.length) throw new TypeError("You must supply a name when creating a logger");
      let logger = cache[id];
      return logger || (logger = new LogLevel(Object.assign({}, defaults, options)), cache[id] = logger), 
      logger;
    },
    noConflict: () => ("undefined" != typeof window && window.log === defaultLogger && (window.log = existing), 
    defaultLogger)
  });
  module.exports = loglevel;
}, function(module, exports, __webpack_require__) {
  const PrefixFactory = __webpack_require__(4), MethodFactory = __webpack_require__(1), defaults = {
    name: +new Date,
    level: "warn",
    prefix: null,
    factory: null
  };
  module.exports = class {
    constructor(options) {
      if (this.type = "LogLevel", this.options = Object.assign({}, defaults, options), 
      this.methodFactory = options.factory, !this.methodFactory) {
        const factory = options.prefix ? new PrefixFactory(this, options.prefix) : new MethodFactory(this);
        this.methodFactory = factory;
      }
      this.methodFactory.logger || (this.methodFactory.logger = this), this.name = options.name || "<unknown>", 
      this.level = this.options.level;
    }
    get factory() {
      return this.methodFactory;
    }
    set factory(factory) {
      factory.logger = this, this.methodFactory = factory, this.methodFactory.replaceMethods(this.level);
    }
    enable() {
      this.level = this.levels.TRACE;
    }
    disable() {
      this.level = this.levels.SILENT;
    }
    get level() {
      return this.currentLevel;
    }
    set level(logLevel) {
      const level = this.methodFactory.distillLevel(logLevel);
      if (null == level) throw new Error("loglevel: setLevel() called with invalid level: " + logLevel);
      this.currentLevel = level, this.methodFactory.replaceMethods(level), "undefined" == typeof console && level < this.levels.SILENT && console.warn("loglevel: console is undefined. The log will produce no output");
    }
    get levels() {
      return this.methodFactory.levels;
    }
  };
}, function(module) {
  module.exports = JSON.parse('{"definitions":{"ObjectPattern":{"type":"object","properties":{"from":{"anyOf":[{"type":"string","minLength":1},{"type":"object"}]},"to":{"type":"string"},"context":{"type":"string"},"toType":{"enum":["dir","file","template"]},"test":{"anyOf":[{"type":"string"},{"instanceof":"RegExp"}]},"force":{"type":"boolean"},"ignore":{"type":"array","items":{"anyOf":[{"type":"string"},{"type":"object"}]}},"flatten":{"type":"boolean"},"cache":{"anyOf":[{"type":"boolean"},{"type":"object"}]},"transform":{"instanceof":"Function"},"transformPath":{"instanceof":"Function"}},"required":["from"]},"StringPattern":{"type":"string","minLength":1}},"type":"array","items":{"anyOf":[{"$ref":"#/definitions/StringPattern"},{"$ref":"#/definitions/ObjectPattern"}]}}');
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = function(globalRef, pattern) {
    const {logger: logger, context: context, inputFileSystem: inputFileSystem, fileDependencies: fileDependencies, contextDependencies: contextDependencies, compilation: compilation} = globalRef;
    (pattern = "string" == typeof pattern ? {
      from: pattern
    } : Object.assign({}, pattern)).to = pattern.to || "", pattern.context = pattern.context || context, 
    _path.isAbsolute(pattern.context) || (pattern.context = _path.join(context, pattern.context));
    const isFromGlobPatten = _isObject(pattern.from) && pattern.from.glob || pattern.globOptions, isToDirectory = "" === _path.extname(pattern.to) || pattern.to.slice(-1) === _path.sep;
    switch (pattern.from = isFromGlobPatten ? pattern.from : _path.normalize(pattern.from), 
    pattern.context = _path.normalize(pattern.context), pattern.to = _path.normalize(pattern.to), 
    pattern.ignore = globalRef.ignore.concat(pattern.ignore || []), logger.debug(`processing from: '${pattern.from}' to: '${pattern.to}'`), 
    !0) {
     case !!pattern.toType:
      break;

     case _isTemplateLike(pattern.to):
      pattern.toType = "template";
      break;

     case isToDirectory:
      pattern.toType = "dir";
      break;

     default:
      pattern.toType = "file";
    }
    if (isFromGlobPatten) {
      logger.debug(`determined '${pattern.absoluteFrom}' is a glob`), pattern.fromType = "glob";
      const globOptions = Object.assign({}, pattern.globOptions ? pattern.globOptions : pattern.from);
      return delete globOptions.glob, pattern.absoluteFrom = _path.resolve(pattern.context, pattern.globOptions ? pattern.from : pattern.from.glob), 
      pattern.glob = _normalize(pattern.context, pattern.globOptions ? pattern.from : pattern.from.glob), 
      pattern.globOptions = globOptions, Promise.resolve(pattern);
    }
    _path.isAbsolute(pattern.from) ? pattern.absoluteFrom = pattern.from : pattern.absoluteFrom = _path.resolve(pattern.context, pattern.from);
    logger.debug(`determined '${pattern.from}' to be read from '${pattern.absoluteFrom}'`);
    const noStatsHandler = () => {
      if (_isGlob(pattern.from) || pattern.from.includes("*")) logger.debug(`determined '${pattern.absoluteFrom}' is a glob`), 
      pattern.fromType = "glob", pattern.glob = _normalize(pattern.context, pattern.from), 
      contextDependencies.add(_path.normalize(_globParent(pattern.absoluteFrom))); else {
        const newWarning = new Error(`unable to locate '${pattern.from}' at '${pattern.absoluteFrom}'`);
        compilation.warnings.some(warning => warning.message === newWarning.message) || (logger.warn(newWarning.message), 
        compilation.warnings.push(newWarning)), pattern.fromType = "nonexistent";
      }
    };
    return logger.debug(`getting stats for '${pattern.absoluteFrom}' to determinate 'fromType'`), 
    _promisify.stat(inputFileSystem, pattern.absoluteFrom).catch(() => noStatsHandler()).then(stats => stats ? (stats.isDirectory() ? (logger.debug(`determined '${pattern.absoluteFrom}' is a directory`), 
    contextDependencies.add(pattern.absoluteFrom), pattern.fromType = "dir", pattern.context = pattern.absoluteFrom, 
    pattern.glob = _normalize(pattern.absoluteFrom, "**/*"), pattern.absoluteFrom = _path.join(pattern.absoluteFrom, "**/*"), 
    pattern.globOptions = {
      dot: !0
    }) : stats.isFile() ? (logger.debug(`determined '${pattern.absoluteFrom}' is a file`), 
    fileDependencies.add(pattern.absoluteFrom), pattern.stats = stats, pattern.fromType = "file", 
    pattern.context = _path.dirname(pattern.absoluteFrom), pattern.glob = _normalize(pattern.absoluteFrom), 
    pattern.globOptions = {
      dot: !0
    }) : pattern.fromType || logger.warn("unrecognized file type for " + pattern.from), 
    pattern) : (noStatsHandler(), pattern));
  };
  var _path = __webpack_require__(0), _isGlob = __webpack_require__(24), _globParent = __webpack_require__(25), _normalize = __webpack_require__(29).default, _isTemplateLike = __webpack_require__(30).default, _isObject = __webpack_require__(8).default, _promisify = __webpack_require__(9);
}, function(module, exports, __webpack_require__) {
  var isExtglob = __webpack_require__(5), chars = {
    "{": "}",
    "(": ")",
    "[": "]"
  }, strictCheck = function(str) {
    if ("!" === str[0]) return !0;
    for (var index = 0, pipeIndex = -2, closeSquareIndex = -2, closeCurlyIndex = -2, closeParenIndex = -2, backSlashIndex = -2; index < str.length; ) {
      if ("*" === str[index]) return !0;
      if ("?" === str[index + 1] && /[\].+)]/.test(str[index])) return !0;
      if (-1 !== closeSquareIndex && "[" === str[index] && "]" !== str[index + 1] && (closeSquareIndex < index && (closeSquareIndex = str.indexOf("]", index)), 
      closeSquareIndex > index)) {
        if (-1 === backSlashIndex || backSlashIndex > closeSquareIndex) return !0;
        if (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeSquareIndex) return !0;
      }
      if (-1 !== closeCurlyIndex && "{" === str[index] && "}" !== str[index + 1] && (closeCurlyIndex = str.indexOf("}", index)) > index && (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeCurlyIndex)) return !0;
      if (-1 !== closeParenIndex && "(" === str[index] && "?" === str[index + 1] && /[:!=]/.test(str[index + 2]) && ")" !== str[index + 3] && (closeParenIndex = str.indexOf(")", index)) > index && (-1 === (backSlashIndex = str.indexOf("\\", index)) || backSlashIndex > closeParenIndex)) return !0;
      if (-1 !== pipeIndex && "(" === str[index] && "|" !== str[index + 1] && (pipeIndex < index && (pipeIndex = str.indexOf("|", index)), 
      -1 !== pipeIndex && ")" !== str[pipeIndex + 1] && (closeParenIndex = str.indexOf(")", pipeIndex)) > pipeIndex && (-1 === (backSlashIndex = str.indexOf("\\", pipeIndex)) || backSlashIndex > closeParenIndex))) return !0;
      if ("\\" === str[index]) {
        var open = str[index + 1];
        index += 2;
        var close = chars[open];
        if (close) {
          var n = str.indexOf(close, index);
          -1 !== n && (index = n + 1);
        }
        if ("!" === str[index]) return !0;
      } else index++;
    }
    return !1;
  }, relaxedCheck = function(str) {
    if ("!" === str[0]) return !0;
    for (var index = 0; index < str.length; ) {
      if (/[*?{}()[\]]/.test(str[index])) return !0;
      if ("\\" === str[index]) {
        var open = str[index + 1];
        index += 2;
        var close = chars[open];
        if (close) {
          var n = str.indexOf(close, index);
          -1 !== n && (index = n + 1);
        }
        if ("!" === str[index]) return !0;
      } else index++;
    }
    return !1;
  };
  module.exports = function(str, options) {
    if ("string" != typeof str || "" === str) return !1;
    if (isExtglob(str)) return !0;
    var check = strictCheck;
    return options && !1 === options.strict && (check = relaxedCheck), check(str);
  };
}, function(module, exports, __webpack_require__) {
  __webpack_require__(0);
  var isglob = __webpack_require__(26), pathDirname = __webpack_require__(27), isWin32 = "win32" === __webpack_require__(6).platform();
  module.exports = function(str) {
    isWin32 && str.indexOf("/") < 0 && (str = str.split("\\").join("/")), /[\{\[].*[\/]*.*[\}\]]$/.test(str) && (str += "/"), 
    str += "a";
    do {
      str = pathDirname.posix(str);
    } while (isglob(str) || /(^|[^\\])([\{\[]|\([^\)]+$)/.test(str));
    return str.replace(/\\([\*\?\|\[\]\(\)\{\}])/g, "$1");
  };
}, function(module, exports, __webpack_require__) {
  var isExtglob = __webpack_require__(5);
  module.exports = function(str) {
    if ("string" != typeof str || "" === str) return !1;
    if (isExtglob(str)) return !0;
    for (var match, regex = /(\\).|([*?]|\[.*\]|\{.*\}|\(.*\|.*\)|^!)/; match = regex.exec(str); ) {
      if (match[2]) return !0;
      str = str.slice(match.index + match[0].length);
    }
    return !1;
  };
}, function(module, exports, __webpack_require__) {
  __webpack_require__(0);
  var inspect = __webpack_require__(28).inspect;
  function assertPath(path) {
    if ("string" != typeof path) throw new TypeError("Path must be a string. Received " + inspect(path));
  }
  function posix(path) {
    if (assertPath(path), 0 === path.length) return ".";
    for (var code = path.charCodeAt(0), hasRoot = 47 === code, end = -1, matchedSlash = !0, i = path.length - 1; i >= 1; --i) if (47 === (code = path.charCodeAt(i))) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else matchedSlash = !1;
    return -1 === end ? hasRoot ? "/" : "." : hasRoot && 1 === end ? "//" : path.slice(0, end);
  }
  function win32(path) {
    assertPath(path);
    var len = path.length;
    if (0 === len) return ".";
    var rootEnd = -1, end = -1, matchedSlash = !0, offset = 0, code = path.charCodeAt(0);
    if (len > 1) if (47 === code || 92 === code) {
      if (rootEnd = offset = 1, 47 === (code = path.charCodeAt(1)) || 92 === code) {
        for (var j = 2, last = j; j < len && (47 !== (code = path.charCodeAt(j)) && 92 !== code); ++j) ;
        if (j < len && j !== last) {
          for (last = j; j < len && (47 === (code = path.charCodeAt(j)) || 92 === code); ++j) ;
          if (j < len && j !== last) {
            for (last = j; j < len && (47 !== (code = path.charCodeAt(j)) && 92 !== code); ++j) ;
            if (j === len) return path;
            j !== last && (rootEnd = offset = j + 1);
          }
        }
      }
    } else (code >= 65 && code <= 90 || code >= 97 && code <= 122) && (code = path.charCodeAt(1), 
    58 === path.charCodeAt(1) && (rootEnd = offset = 2, len > 2 && (47 !== (code = path.charCodeAt(2)) && 92 !== code || (rootEnd = offset = 3)))); else if (47 === code || 92 === code) return path[0];
    for (var i = len - 1; i >= offset; --i) if (47 === (code = path.charCodeAt(i)) || 92 === code) {
      if (!matchedSlash) {
        end = i;
        break;
      }
    } else matchedSlash = !1;
    if (-1 === end) {
      if (-1 === rootEnd) return ".";
      end = rootEnd;
    }
    return path.slice(0, end);
  }
  module.exports = "win32" === process.platform ? win32 : posix, module.exports.posix = posix, 
  module.exports.win32 = win32;
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = function(context, from) {
    return _normalizePath(function(context, from) {
      if (from && _path.isAbsolute(from)) return from;
      const absoluteContext = _path.resolve(context).replace(/[\*|\?|\!|\(|\)|\[|\]|\{|\}]/g, substring => `[${substring}]`);
      if (!from) return absoluteContext;
      if (absoluteContext.endsWith("/")) return `${absoluteContext}${from}`;
      return `${absoluteContext}/${from}`;
    }(context, from));
  };
  var _path = __webpack_require__(0), _normalizePath = __webpack_require__(7);
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = void 0;
  exports.default = pattern => /(\[ext\])|(\[name\])|(\[path\])|(\[folder\])|(\[emoji(?::(\d+))?\])|(\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?\])|(\[\d+\])/.test(pattern);
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = function(globalRef, pattern) {
    const {logger: logger, output: output, concurrency: concurrency, compilation: compilation} = globalRef, globOptions = Object.assign({
      cwd: pattern.context,
      follow: !0
    }, pattern.globOptions || {});
    if ("nonexistent" === pattern.fromType) return Promise.resolve();
    const limit = _pLimit(concurrency || 100);
    return logger.info(`begin globbing '${pattern.glob}' with a context of '${pattern.context}'`), 
    _globby(pattern.glob, globOptions).then(paths => Promise.all(paths.map(from => limit(() => {
      const file = {
        force: pattern.force,
        absoluteFrom: _path.resolve(pattern.context, from)
      };
      file.relativeFrom = _path.relative(pattern.context, file.absoluteFrom), pattern.flatten && (file.relativeFrom = _path.basename(file.relativeFrom)), 
      logger.debug("found " + from);
      let il = pattern.ignore.length;
      for (;il--; ) {
        const ignoreGlob = pattern.ignore[il];
        let glob, globParams = {
          dot: !0,
          matchBase: !0
        };
        if ("string" == typeof ignoreGlob) glob = ignoreGlob; else if (_isObject(ignoreGlob)) {
          glob = ignoreGlob.glob || "";
          const ignoreGlobParams = Object.assign({}, ignoreGlob);
          delete ignoreGlobParams.glob, globParams = Object.assign(globParams, ignoreGlobParams);
        } else glob = "";
        if (logger.debug(`testing ${glob} against ${file.relativeFrom}`), _minimatch(file.relativeFrom, glob, globParams)) return logger.info(`ignoring '${file.relativeFrom}', because it matches the ignore glob '${glob}'`), 
        Promise.resolve();
        logger.debug(`${glob} doesn't match ${file.relativeFrom}`);
      }
      if ("dir" === pattern.toType ? file.webpackTo = _path.join(pattern.to, file.relativeFrom) : "file" === pattern.toType ? file.webpackTo = pattern.to || file.relativeFrom : "template" === pattern.toType && (file.webpackTo = pattern.to, 
      file.webpackToRegExp = pattern.test), _path.isAbsolute(file.webpackTo)) {
        if ("/" === output) {
          const message = "using older versions of webpack-dev-server, devServer.outputPath must be defined to write to absolute paths";
          logger.error(message), compilation.errors.push(new Error(message));
        }
        file.webpackTo = _path.relative(output, file.webpackTo);
      }
      return logger.info(`determined that '${from}' should write to '${file.webpackTo}'`), 
      file;
    }))));
  };
  var _path = __webpack_require__(0), _globby = __webpack_require__(32), _pLimit = __webpack_require__(40), _minimatch = __webpack_require__(42), _isObject = __webpack_require__(8).default;
}, function(module, exports, __webpack_require__) {
  const arrayUnion = __webpack_require__(33), glob = __webpack_require__(10), pify = __webpack_require__(2), dirGlob = __webpack_require__(35), gitignore = __webpack_require__(37), globP = pify(glob), DEFAULT_FILTER = () => !1, isNegative = pattern => "!" === pattern[0], generateGlobTasks = (patterns, taskOpts) => {
    (patterns => {
      if (!patterns.every(x => "string" == typeof x)) throw new TypeError("Patterns must be a string or an array of strings");
    })(patterns = [].concat(patterns));
    const globTasks = [];
    return taskOpts = Object.assign({
      cache: Object.create(null),
      statCache: Object.create(null),
      realpathCache: Object.create(null),
      symlinks: Object.create(null),
      ignore: [],
      expandDirectories: !0,
      nodir: !0
    }, taskOpts), patterns.forEach((pattern, i) => {
      if (isNegative(pattern)) return;
      const ignore = patterns.slice(i).filter(isNegative).map(pattern => pattern.slice(1)), opts = Object.assign({}, taskOpts, {
        ignore: taskOpts.ignore.concat(ignore)
      });
      globTasks.push({
        pattern: pattern,
        opts: opts
      });
    }), globTasks;
  }, getPattern = (task, fn) => task.opts.expandDirectories ? ((task, fn) => Array.isArray(task.opts.expandDirectories) ? fn(task.pattern, {
    files: task.opts.expandDirectories
  }) : "object" == typeof task.opts.expandDirectories ? fn(task.pattern, task.opts.expandDirectories) : fn(task.pattern))(task, fn) : [ task.pattern ];
  module.exports = (patterns, opts) => {
    let globTasks;
    try {
      globTasks = generateGlobTasks(patterns, opts);
    } catch (err) {
      return Promise.reject(err);
    }
    const getTasks = Promise.all(globTasks.map(task => Promise.resolve(getPattern(task, dirGlob)).then(globs => Promise.all(globs.map(glob => ({
      pattern: glob,
      opts: task.opts
    })))))).then(tasks => arrayUnion.apply(null, tasks));
    return Promise.resolve(opts && opts.gitignore ? gitignore({
      cwd: opts.cwd,
      ignore: opts.ignore
    }) : DEFAULT_FILTER).then(filter => getTasks.then(tasks => Promise.all(tasks.map(task => globP(task.pattern, task.opts)))).then(paths => arrayUnion.apply(null, paths)).then(paths => paths.filter(p => !filter(p))));
  }, module.exports.sync = (patterns, opts) => {
    const tasks = generateGlobTasks(patterns, opts).reduce((tasks, task) => {
      const newTask = getPattern(task, dirGlob.sync).map(glob => ({
        pattern: glob,
        opts: task.opts
      }));
      return tasks.concat(newTask);
    }, []), filter = opts && opts.gitignore ? gitignore.sync({
      cwd: opts.cwd,
      ignore: opts.ignore
    }) : DEFAULT_FILTER;
    return tasks.reduce((matches, task) => arrayUnion(matches, glob.sync(task.pattern, task.opts)), []).filter(p => !filter(p));
  }, module.exports.generateGlobTasks = generateGlobTasks, module.exports.hasMagic = (patterns, opts) => [].concat(patterns).some(pattern => glob.hasMagic(pattern, opts)), 
  module.exports.gitignore = gitignore;
}, function(module, exports, __webpack_require__) {
  var arrayUniq = __webpack_require__(34);
  module.exports = function() {
    return arrayUniq([].concat.apply([], arguments));
  };
}, function(module, exports, __webpack_require__) {
  var ret;
  "Set" in global ? "function" == typeof Set.prototype.forEach && (ret = !1, new Set([ !0 ]).forEach((function(el) {
    ret = el;
  })), !0 === ret) ? module.exports = function(arr) {
    var ret = [];
    return new Set(arr).forEach((function(el) {
      ret.push(el);
    })), ret;
  } : module.exports = function(arr) {
    var seen = new Set;
    return arr.filter((function(el) {
      return !seen.has(el) && (seen.add(el), !0);
    }));
  } : module.exports = function(arr) {
    for (var ret = [], i = 0; i < arr.length; i++) -1 === ret.indexOf(arr[i]) && ret.push(arr[i]);
    return ret;
  };
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), pathType = __webpack_require__(36), getExtensions = extensions => extensions.length > 1 ? `{${extensions.join(",")}}` : extensions[0], getPath = (filepath, cwd) => {
    const pth = "!" === filepath[0] ? filepath.slice(1) : filepath;
    return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
  }, getGlob = (dir, opts) => {
    if (opts.files && !Array.isArray(opts.files)) throw new TypeError(`Expected \`files\` to be of type \`Array\` but received type \`${typeof opts.files}\``);
    if (opts.extensions && !Array.isArray(opts.extensions)) throw new TypeError(`Expected \`extensions\` to be of type \`Array\` but received type \`${typeof opts.extensions}\``);
    return opts.files && opts.extensions ? opts.files.map(x => {
      return path.join(dir, (file = x, extensions = opts.extensions, path.extname(file) ? "**/" + file : `**/${file}.${getExtensions(extensions)}`));
      var file, extensions;
    }) : opts.files ? opts.files.map(x => path.join(dir, "**/" + x)) : opts.extensions ? [ path.join(dir, "**/*." + getExtensions(opts.extensions)) ] : [ path.join(dir, "**") ];
  };
  module.exports = (input, opts) => "string" != typeof (opts = Object.assign({
    cwd: process.cwd()
  }, opts)).cwd ? Promise.reject(new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof opts.cwd}\``)) : Promise.all([].concat(input).map(x => pathType.dir(getPath(x, opts.cwd)).then(isDir => isDir ? getGlob(x, opts) : x))).then(globs => [].concat.apply([], globs)), 
  module.exports.sync = (input, opts) => {
    if ("string" != typeof (opts = Object.assign({
      cwd: process.cwd()
    }, opts)).cwd) throw new TypeError(`Expected \`cwd\` to be of type \`string\` but received type \`${typeof opts.cwd}\``);
    const globs = [].concat(input).map(x => pathType.dirSync(getPath(x, opts.cwd)) ? getGlob(x, opts) : x);
    return [].concat.apply([], globs);
  };
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(11), pify = __webpack_require__(2);
  function type(fn, fn2, fp) {
    return "string" != typeof fp ? Promise.reject(new TypeError("Expected a string, got " + typeof fp)) : pify(fs[fn])(fp).then(stats => stats[fn2]()).catch(err => {
      if ("ENOENT" === err.code) return !1;
      throw err;
    });
  }
  function typeSync(fn, fn2, fp) {
    if ("string" != typeof fp) throw new TypeError("Expected a string, got " + typeof fp);
    try {
      return fs[fn](fp)[fn2]();
    } catch (err) {
      if ("ENOENT" === err.code) return !1;
      throw err;
    }
  }
  exports.file = type.bind(null, "stat", "isFile"), exports.dir = type.bind(null, "stat", "isDirectory"), 
  exports.symlink = type.bind(null, "lstat", "isSymbolicLink"), exports.fileSync = typeSync.bind(null, "statSync", "isFile"), 
  exports.dirSync = typeSync.bind(null, "statSync", "isDirectory"), exports.symlinkSync = typeSync.bind(null, "lstatSync", "isSymbolicLink");
}, function(module, exports, __webpack_require__) {
  const fs = __webpack_require__(11), path = __webpack_require__(0), glob = __webpack_require__(10), gitIgnore = __webpack_require__(38), pify = __webpack_require__(2), slash = __webpack_require__(39), globP = pify(glob), readFileP = pify(fs.readFile), parseGitIgnore = (content, opts) => {
    const base = slash(path.relative(opts.cwd, path.dirname(opts.fileName)));
    return content.split(/\r?\n/).filter(Boolean).filter(l => "#" !== l.charAt(0)).map((base => ignore => ignore.startsWith("!") ? "!" + path.posix.join(base, ignore.substr(1)) : path.posix.join(base, ignore))(base));
  }, reduceIgnore = files => files.reduce((ignores, file) => (ignores.add(parseGitIgnore(file.content, {
    cwd: file.cwd,
    fileName: file.filePath
  })), ignores), gitIgnore()), getIsIgnoredPredecate = (ignores, cwd) => p => ignores.ignores(slash(path.relative(cwd, p))), normalizeOpts = opts => ({
    ignore: (opts = opts || {}).ignore || [],
    cwd: opts.cwd || process.cwd()
  });
  module.exports = o => {
    const opts = normalizeOpts(o);
    return globP("**/.gitignore", {
      ignore: opts.ignore,
      cwd: opts.cwd
    }).then(paths => Promise.all(paths.map(file => ((file, cwd) => {
      const filePath = path.join(cwd, file);
      return readFileP(filePath, "utf8").then(content => ({
        content: content,
        cwd: cwd,
        filePath: filePath
      }));
    })(file, opts.cwd)))).then(files => reduceIgnore(files)).then(ignores => getIsIgnoredPredecate(ignores, opts.cwd));
  }, module.exports.sync = o => {
    const opts = normalizeOpts(o), files = glob.sync("**/.gitignore", {
      ignore: opts.ignore,
      cwd: opts.cwd
    }).map(file => ((file, cwd) => {
      const filePath = path.join(cwd, file);
      return {
        content: fs.readFileSync(filePath, "utf8"),
        cwd: cwd,
        filePath: filePath
      };
    })(file, opts.cwd)), ignores = reduceIgnore(files);
    return getIsIgnoredPredecate(ignores, opts.cwd);
  };
}, function(module, exports, __webpack_require__) {
  var _createClass = function() {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
        "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    return function(Constructor, protoProps, staticProps) {
      return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
      Constructor;
    };
  }();
  function make_array(subject) {
    return Array.isArray(subject) ? subject : [ subject ];
  }
  module.exports = function() {
    return new IgnoreBase;
  };
  var REGEX_BLANK_LINE = /^\s+$/, REGEX_LEADING_EXCAPED_EXCLAMATION = /^\\\!/, REGEX_LEADING_EXCAPED_HASH = /^\\#/, KEY_IGNORE = "undefined" != typeof Symbol ? Symbol.for("node-ignore") : "node-ignore", IgnoreBase = function() {
    function IgnoreBase() {
      !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
      }(this, IgnoreBase), this._rules = [], this[KEY_IGNORE] = !0, this._initCache();
    }
    return _createClass(IgnoreBase, [ {
      key: "_initCache",
      value: function() {
        this._cache = {};
      }
    }, {
      key: "add",
      value: function(pattern) {
        return this._added = !1, "string" == typeof pattern && (pattern = pattern.split(/\r?\n/g)), 
        make_array(pattern).forEach(this._addPattern, this), this._added && this._initCache(), 
        this;
      }
    }, {
      key: "addPattern",
      value: function(pattern) {
        return this.add(pattern);
      }
    }, {
      key: "_addPattern",
      value: function(pattern) {
        if (pattern && pattern[KEY_IGNORE]) return this._rules = this._rules.concat(pattern._rules), 
        void (this._added = !0);
        if (this._checkPattern(pattern)) {
          var rule = this._createRule(pattern);
          this._added = !0, this._rules.push(rule);
        }
      }
    }, {
      key: "_checkPattern",
      value: function(pattern) {
        return pattern && "string" == typeof pattern && !REGEX_BLANK_LINE.test(pattern) && 0 !== pattern.indexOf("#");
      }
    }, {
      key: "filter",
      value: function(paths) {
        var _this = this;
        return make_array(paths).filter((function(path) {
          return _this._filter(path);
        }));
      }
    }, {
      key: "createFilter",
      value: function() {
        var _this2 = this;
        return function(path) {
          return _this2._filter(path);
        };
      }
    }, {
      key: "ignores",
      value: function(path) {
        return !this._filter(path);
      }
    }, {
      key: "_createRule",
      value: function(pattern) {
        var origin = pattern, negative = !1;
        return 0 === pattern.indexOf("!") && (negative = !0, pattern = pattern.substr(1)), 
        {
          origin: origin,
          pattern: pattern = pattern.replace(REGEX_LEADING_EXCAPED_EXCLAMATION, "!").replace(REGEX_LEADING_EXCAPED_HASH, "#"),
          negative: negative,
          regex: function(pattern, negative) {
            var r = cache[pattern];
            if (r) return r;
            var source = (negative ? NEGATIVE_REPLACERS : POSITIVE_REPLACERS).reduce((function(prev, current) {
              return prev.replace(current[0], current[1].bind(pattern));
            }), pattern);
            return cache[pattern] = new RegExp(source, "i");
          }(pattern, negative)
        };
      }
    }, {
      key: "_filter",
      value: function(path, slices) {
        return !!path && (path in this._cache ? this._cache[path] : (slices || (slices = path.split("/")), 
        slices.pop(), this._cache[path] = slices.length ? this._filter(slices.join("/") + "/", slices) && this._test(path) : this._test(path)));
      }
    }, {
      key: "_test",
      value: function(path) {
        var matched = 0;
        return this._rules.forEach((function(rule) {
          matched ^ rule.negative || (matched = rule.negative ^ rule.regex.test(path));
        })), !matched;
      }
    } ]), IgnoreBase;
  }(), DEFAULT_REPLACER_PREFIX = [ [ /\\?\s+$/, function(match) {
    return 0 === match.indexOf("\\") ? " " : "";
  } ], [ /\\\s/g, function() {
    return " ";
  } ], [ /[\\\^$.|?*+()\[{]/g, function(match) {
    return "\\" + match;
  } ], [ /^\//, function() {
    return "^";
  } ], [ /\//g, function() {
    return "\\/";
  } ], [ /^\^*\\\*\\\*\\\//, function() {
    return "^(?:.*\\/)?";
  } ] ], DEFAULT_REPLACER_SUFFIX = [ [ /^(?=[^\^])/, function() {
    return /\/(?!$)/.test(this) ? "^" : "(?:^|\\/)";
  } ], [ /\\\/\\\*\\\*(?=\\\/|$)/g, function(match, index, str) {
    return index + 6 < str.length ? "(?:\\/[^\\/]+)*" : "\\/.+";
  } ], [ /(^|[^\\]+)\\\*(?=.+)/g, function(match, p1) {
    return p1 + "[^\\/]*";
  } ], [ /(\^|\\\/)?\\\*$/, function(match, p1) {
    return (p1 ? p1 + "[^/]+" : "[^/]*") + "(?=$|\\/$)";
  } ], [ /\\\\\\/g, function() {
    return "\\";
  } ] ], POSITIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [ [ /(?:[^*\/])$/, function(match) {
    return match + "(?=$|\\/)";
  } ] ], DEFAULT_REPLACER_SUFFIX), NEGATIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [ [ /(?:[^*])$/, function(match) {
    return match + "(?=$|\\/$)";
  } ] ], DEFAULT_REPLACER_SUFFIX), cache = {};
  if ("undefined" != typeof process && (process.env && process.env.IGNORE_TEST_WIN32 || "win32" === process.platform)) {
    var filter = IgnoreBase.prototype._filter;
    IgnoreBase.prototype._filter = function(path, slices) {
      var str;
      return path = /^\\\\\?\\/.test(str = path) || /[^\x00-\x80]+/.test(str) ? str : str.replace(/\\/g, "/"), 
      filter.call(this, path, slices);
    };
  }
}, function(module, exports, __webpack_require__) {
  module.exports = function(str) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(str), hasNonAscii = /[^\x00-\x80]+/.test(str);
    return isExtendedLengthPath || hasNonAscii ? str : str.replace(/\\/g, "/");
  };
}, function(module, exports, __webpack_require__) {
  const pTry = __webpack_require__(41), pLimit = concurrency => {
    if (!Number.isInteger(concurrency) && concurrency !== 1 / 0 || !(concurrency > 0)) return Promise.reject(new TypeError("Expected `concurrency` to be a number from 1 and up"));
    const queue = [];
    let activeCount = 0;
    const next = () => {
      activeCount--, queue.length > 0 && queue.shift()();
    }, run = (fn, resolve, ...args) => {
      activeCount++;
      const result = pTry(fn, ...args);
      resolve(result), result.then(next, next);
    }, generator = (fn, ...args) => new Promise(resolve => ((fn, resolve, ...args) => {
      activeCount < concurrency ? run(fn, resolve, ...args) : queue.push(run.bind(null, fn, resolve, ...args));
    })(fn, resolve, ...args));
    return Object.defineProperties(generator, {
      activeCount: {
        get: () => activeCount
      },
      pendingCount: {
        get: () => queue.length
      },
      clearQueue: {
        value: () => {
          queue.length = 0;
        }
      }
    }), generator;
  };
  module.exports = pLimit, module.exports.default = pLimit;
}, function(module, exports, __webpack_require__) {
  const pTry = (fn, ...arguments_) => new Promise(resolve => {
    resolve(fn(...arguments_));
  });
  module.exports = pTry, module.exports.default = pTry;
}, function(module, exports) {
  module.exports = require("../vendor/minimatch");
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = function(globalRef, pattern, file) {
    const {logger: logger, compilation: compilation, fileDependencies: fileDependencies, written: written, inputFileSystem: inputFileSystem, copyUnmodified: copyUnmodified} = globalRef;
    logger.debug(`getting stats for '${file.absoluteFrom}' to write to assets`);
    return (pattern.stats ? Promise.resolve().then(() => pattern.stats) : _promisify.stat(inputFileSystem, file.absoluteFrom)).then(stats => stats.isDirectory() ? (logger.debug(`skipping '${file.absoluteFrom}' because it is empty directory`), 
    Promise.resolve()) : ("glob" === pattern.fromType && fileDependencies.add(file.absoluteFrom), 
    logger.debug(`reading '${file.absoluteFrom}' to write to assets`), _promisify.readFile(inputFileSystem, file.absoluteFrom).then(content => {
      if (pattern.transform) {
        logger.info(`transforming content for '${file.absoluteFrom}'`);
        const transform = (content, absoluteFrom) => pattern.transform(content, absoluteFrom);
        if (pattern.cache) {
          globalRef.cacheDir || (globalRef.cacheDir = _findCacheDir({
            name: "copy-webpack-plugin"
          }) || _os.tmpdir());
          const cacheKey = pattern.cache.key ? pattern.cache.key : _serializeJavascript({
            name: _package.name,
            version: _package.version,
            pattern: pattern,
            hash: _crypto.createHash("md4").update(content).digest("hex")
          });
          return _cacache.get(globalRef.cacheDir, cacheKey).then(result => (logger.debug(`getting cached transformation for '${file.absoluteFrom}'`), 
          result.data), () => Promise.resolve().then(() => transform(content, file.absoluteFrom)).then(content => (logger.debug(`caching transformation for '${file.absoluteFrom}'`), 
          _cacache.put(globalRef.cacheDir, cacheKey, content).then(() => content))));
        }
        content = transform(content, file.absoluteFrom);
      }
      return content;
    }).then(content => ("template" === pattern.toType && (logger.info(`interpolating template '${file.webpackTo}' for '${file.relativeFrom}'`), 
    _path.extname(file.relativeFrom) || (file.webpackTo = file.webpackTo.replace(/\.?\[ext\]/g, "")), 
    file.webpackTo = _loaderUtils.interpolateName({
      resourcePath: file.absoluteFrom
    }, file.webpackTo, {
      content: content,
      regExp: file.webpackToRegExp,
      context: pattern.context
    }), file.webpackTo = _path.normalize(file.webpackTo)), content)).then(content => pattern.transformPath ? (logger.info(`transforming path '${file.webpackTo}' for '${file.absoluteFrom}'`), 
    Promise.resolve().then(() => pattern.transformPath(file.webpackTo, file.absoluteFrom)).then(newPath => (file.webpackTo = newPath, 
    content))) : content).then(content => {
      const hash = _loaderUtils.getHashDigest(content), targetPath = _normalizePath(file.webpackTo), targetAbsolutePath = _normalizePath(file.absoluteFrom);
      !copyUnmodified && written[targetPath] && written[targetPath][targetAbsolutePath] && written[targetPath][targetAbsolutePath] === hash ? logger.info(`skipping '${file.webpackTo}', because content hasn't changed`) : (logger.debug(`adding '${file.webpackTo}' for tracking content changes`), 
      written[targetPath] || (written[targetPath] = {}), written[targetPath][targetAbsolutePath] = hash, 
      !compilation.assets[targetPath] || file.force ? (logger.info(`writing '${file.webpackTo}' to compilation assets from '${file.absoluteFrom}'`), 
      compilation.assets[targetPath] = {
        size: () => stats.size,
        source: () => content
      }) : logger.info(`skipping '${file.webpackTo}', because it already exists`));
    })));
  };
  var _path = __webpack_require__(0), _os = __webpack_require__(6), _crypto = __webpack_require__(3), _loaderUtils = __webpack_require__(44), _cacache = __webpack_require__(45), _serializeJavascript = __webpack_require__(46), _findCacheDir = __webpack_require__(47), _normalizePath = __webpack_require__(7), _package = __webpack_require__(48), _promisify = __webpack_require__(9);
}, function(module, exports) {
  module.exports = require("./loader-utils");
}, function(module, exports) {
  module.exports = require("../vendor/cacache");
}, function(module, exports, __webpack_require__) {
  var UID = Math.floor(1099511627776 * Math.random()).toString(16), PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R|D|M|S|U)-' + UID + '-(\\d+)__@"', "g"), IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g, IS_PURE_FUNCTION = /function.*?\(/, IS_ARROW_FUNCTION = /.*?=>.*?/, UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g, RESERVED_SYMBOLS = [ "*", "async" ], ESCAPED_CHARS = {
    "<": "\\u003C",
    ">": "\\u003E",
    "/": "\\u002F",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  function escapeUnsafeChars(unsafeChar) {
    return ESCAPED_CHARS[unsafeChar];
  }
  module.exports = function serialize(obj, options) {
    options || (options = {}), "number" != typeof options && "string" != typeof options || (options = {
      space: options
    });
    var str, functions = [], regexps = [], dates = [], maps = [], sets = [], undefs = [];
    return options.ignoreFunction && "function" == typeof obj && (obj = void 0), void 0 === obj ? String(obj) : "string" != typeof (str = options.isJSON && !options.space ? JSON.stringify(obj) : JSON.stringify(obj, options.isJSON ? null : function(key, value) {
      if (options.ignoreFunction && function(obj) {
        var functionKeys = [];
        for (var key in obj) "function" == typeof obj[key] && functionKeys.push(key);
        for (var i = 0; i < functionKeys.length; i++) delete obj[functionKeys[i]];
      }(value), !value && void 0 !== value) return value;
      var origValue = this[key], type = typeof origValue;
      if ("object" === type) {
        if (origValue instanceof RegExp) return "@__R-" + UID + "-" + (regexps.push(origValue) - 1) + "__@";
        if (origValue instanceof Date) return "@__D-" + UID + "-" + (dates.push(origValue) - 1) + "__@";
        if (origValue instanceof Map) return "@__M-" + UID + "-" + (maps.push(origValue) - 1) + "__@";
        if (origValue instanceof Set) return "@__S-" + UID + "-" + (sets.push(origValue) - 1) + "__@";
      }
      return "function" === type ? "@__F-" + UID + "-" + (functions.push(origValue) - 1) + "__@" : "undefined" === type ? "@__U-" + UID + "-" + (undefs.push(origValue) - 1) + "__@" : value;
    }, options.space)) ? String(str) : (!0 !== options.unsafe && (str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars)), 
    0 === functions.length && 0 === regexps.length && 0 === dates.length && 0 === maps.length && 0 === sets.length && 0 === undefs.length ? str : str.replace(PLACE_HOLDER_REGEXP, (function(match, type, valueIndex) {
      return "D" === type ? 'new Date("' + dates[valueIndex].toISOString() + '")' : "R" === type ? "new RegExp(" + serialize(regexps[valueIndex].source) + ', "' + regexps[valueIndex].flags + '")' : "M" === type ? "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")" : "S" === type ? "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")" : "U" === type ? "undefined" : function(fn) {
        var serializedFn = fn.toString();
        if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) throw new TypeError("Serializing native function: " + fn.name);
        if (IS_PURE_FUNCTION.test(serializedFn)) return serializedFn;
        if (IS_ARROW_FUNCTION.test(serializedFn)) return serializedFn;
        var argsStartsAt = serializedFn.indexOf("("), def = serializedFn.substr(0, argsStartsAt).trim().split(" ").filter((function(val) {
          return val.length > 0;
        }));
        return def.filter((function(val) {
          return -1 === RESERVED_SYMBOLS.indexOf(val);
        })).length > 0 ? (def.indexOf("async") > -1 ? "async " : "") + "function" + (def.join("").indexOf("*") > -1 ? "*" : "") + serializedFn.substr(argsStartsAt) : serializedFn;
      }(functions[valueIndex]);
    })));
  };
}, function(module, exports) {
  module.exports = require("../vendor/find-cache-dir");
}, function(module) {
  module.exports = JSON.parse('{"name":"copy-webpack-plugin","version":"5.1.1","description":"Copy files && directories with webpack"}');
} ]);
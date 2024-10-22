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
  return __webpack_require__(12);
})([
// 0
function (module) {

module.exports = require('path');

},
// 1
function (module) {

module.exports = require('crypto');

},
// 2
function (module) {

const noop = () => {},

  levels = Symbol('levels'),
  instance = Symbol('instance');

class MethodFactory {
  constructor(logger) {
    this[levels] = { TRACE: 0, DEBUG: 1, INFO: 2, WARN: 3, ERROR: 4, SILENT: 5 };

    this[instance] = logger;
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
    return Object.keys(this.levels)
      .map((key) => key.toLowerCase())
      .filter((key) => key !== 'silent');
  }

  distillLevel(level) {
    let result = level;

    if (typeof result == 'string' && this.levels[result.toUpperCase()] !== void 0)
      result = this.levels[result.toUpperCase()];

    if (this.levelValid(result)) return result;
  }

  levelValid(level) {
    return typeof level == 'number' && level >= 0 && level <= this.levels.SILENT;
  }
  make(method) {
    if (method === 'debug') method = 'log';

    return console[method] !== void 0
      ? this.bindMethod(console, method)
      : console.log !== void 0
      ? this.bindMethod(console, 'log')
      : noop;
  }

  bindMethod(obj, name) {
    const method = obj[name];

    if (typeof method.bind == 'function') return method.bind(obj);

    try {
      return Function.prototype.bind.call(method, obj);
    } catch (_err) {
      return function () {
        return Function.prototype.apply.apply(method, [obj, arguments]);
      };
    }
  }

  replaceMethods(logLevel) {
    const level = this.distillLevel(logLevel);

    if (level == null)
      throw new Error('loglevel: replaceMethods() called with invalid level: ' + logLevel);

    if (!this.logger || this.logger.type !== 'LogLevel')
      throw new TypeError(
        'loglevel: Logger is undefined or invalid. Please specify a valid Logger instance.'
      );

    this.methods.forEach((method) => {
      this.logger[method] = this.levels[method.toUpperCase()] < level ? noop : this.make(method);
    });

    this.logger.log = this.logger.debug;
  }
}

module.exports = MethodFactory;

},
// 3
function (module) {

const processFn = (fn, opts) => function () {
  const P = opts.promiseModule,
    args = [].slice.call(arguments);

  return new P((resolve, reject) => {
    if (opts.errorFirst)
      args.push(function (err, result) {
        if (opts.multiArgs) {
          const results = [].slice.call(arguments, 1);

          if (err) {
            results.unshift(err);
            reject(results);
          } else resolve(results);
        } else err ? reject(err) : resolve(result);
      });
    else
      args.push(function (result) {
        if (opts.multiArgs) {
          const results = [].slice.call(arguments);

          resolve(results);
        } else resolve(result);
      });

    fn.apply(this, args);
  });
};

module.exports = (obj, opts) => {
  opts = Object.assign({
    exclude: [/.+(Sync|Stream)$/],
    errorFirst: true,
    promiseModule: Promise
  }, opts);

  const filter = key => {
    const match = pattern => (typeof pattern == 'string' ? key === pattern : pattern.test(key));
    return opts.include ? opts.include.some(match) : !opts.exclude.some(match);
  };

  let ret =
    typeof obj == 'function'
    ? function () {
        return opts.excludeMain
          ? obj.apply(this, arguments)
          : processFn(obj, opts).apply(this, arguments);
      }
    : Object.create(Object.getPrototypeOf(obj));

  for (const key in obj) {
    const x = obj[key];
    ret[key] = typeof x == 'function' && filter(key) ? processFn(x, opts) : x;
  }

  return ret;
};

},
// 4
function (module, exports, __webpack_require__) {

const MethodFactory = __webpack_require__(2);

const defaults = {
  name: options => options.logger.name,
  time: () => new Date().toTimeString().split(' ')[0],
  level: options => `[${options.level}]`,
  template: '{{time}} {{level}} '
};

class PrefixFactory extends MethodFactory {
  constructor(logger, options) {
    super(logger);

    this.options = Object.assign({}, defaults, options);
  }

  interpolate(level) {
    return this.options.template.replace(/{{([^{}]*)}}/g, (stache, prop) => {
      const fn = this.options[prop];

      return fn ? fn({ level, logger: this.logger }) : stache;
    });
  }

  make(method) {
    const og = super.make(method);

    return (...args) => {
      const [first] = args,

        output = this.interpolate(method);

      typeof first == 'string' ? (args[0] = output + first) : args.unshift(output);

      og(...args);
    };
  }
}

module.exports = PrefixFactory;

},
// 5
function (module) {

module.exports = function (str) {
  if (typeof str != 'string' || str === '') return false;

  for (var match; (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)); ) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};

},
// 6
function (module) {

module.exports = require('os');

},
// 7
function (module) {

module.exports = function (path, stripTrailing) {
  if (typeof path != 'string') throw new TypeError('expected path to be a string');

  if (path === '\\' || path === '/') return '/';

  var len = path.length;
  if (len <= 1) return path;

  var prefix = '';
  if (len > 4 && path[3] === '\\') {
    var ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  var segs = path.split(/[/\\]+/);
  stripTrailing === false || segs[segs.length - 1] !== '' || segs.pop();

  return prefix + segs.join('/');
};

},
// 8
function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

exports.default = val => Object.prototype.toString.call(val) === '[object Object]';

},
// 9
function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

exports.stat = (inputFileSystem, path) => new Promise((resolve, reject) => {
  inputFileSystem.stat(path, (err, stats) => {
    err ? reject(err) : resolve(stats);
  });
});

exports.readFile = (inputFileSystem, path) => new Promise((resolve, reject) => {
  inputFileSystem.readFile(path, (err, stats) => {
    err ? reject(err) : resolve(stats);
  });
});

},
// 10
function (module) {

module.exports = require('../vendor/glob');

},
// 11
function (module) {

module.exports = require('fs');

},
// 12
function (module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = void 0;

var _path = __webpack_require__(0),
  _schemaUtils = __webpack_require__(13),
  _webpackLog = __webpack_require__(14),

  _options = __webpack_require__(22),
  _preProcessPattern = __webpack_require__(23).default,
  _processPattern = __webpack_require__(31).default,
  _postProcessPattern = __webpack_require__(43).default;

class CopyPlugin {
  constructor(patterns = [], options = {}) {
    _schemaUtils(_options, patterns, this.constructor.name);
    this.patterns = patterns;
    this.options = options;
  }

  apply(compiler) {
    const fileDependencies = new Set(),
      contextDependencies = new Set(),
      written = {};

    let context = !this.options.context
      ? compiler.options.context
      : !_path.isAbsolute(this.options.context)
      ? _path.join(compiler.options.context, this.options.context)
      : this.options.context;

    const logger = _webpackLog({ name: 'copy-webpack-plugin', level: this.options.logLevel || 'warn' }),
      plugin = { name: 'CopyPlugin' };
    compiler.hooks.emit.tapAsync(plugin, (compilation, callback) => {
      logger.debug('starting emit');
      const globalRef = {
        logger,
        compilation,
        written,
        fileDependencies,
        contextDependencies,
        context,
        inputFileSystem: compiler.inputFileSystem,
        output: compiler.options.output.path,
        ignore: this.options.ignore || [],
        copyUnmodified: this.options.copyUnmodified,
        concurrency: this.options.concurrency
      };

      if (globalRef.output === '/' && compiler.options.devServer && compiler.options.devServer.outputPath)
        globalRef.output = compiler.options.devServer.outputPath;

      const { patterns } = this;
      Promise.all(patterns.map(pattern => Promise.resolve()
        .then(() => _preProcessPattern(globalRef, pattern))
        .then(pattern => _processPattern(globalRef, pattern).then(files =>
          !files
            ? Promise.resolve()
            : Promise.all(files.filter(Boolean).map(file => _postProcessPattern(globalRef, pattern, file)))
        ))
      )).catch(error => {
        compilation.errors.push(error);
      }).then(() => {
        logger.debug('finishing emit');
        callback();
      });
    });
    compiler.hooks.afterEmit.tapAsync(plugin, (compilation, callback) => {
      logger.debug('starting after-emit');

      if ('addAll' in compilation.fileDependencies)
        compilation.fileDependencies.addAll(fileDependencies);
      else
        for (const fileDependency of fileDependencies) compilation.fileDependencies.add(fileDependency);

      if ('addAll' in compilation.contextDependencies)
        compilation.contextDependencies.addAll(contextDependencies);
      else
        for (const contextDependency of contextDependencies)
          compilation.contextDependencies.add(contextDependency);

      logger.debug('finishing after-emit');
      callback();
    });
  }
}

exports = module.exports = CopyPlugin;
exports.default = CopyPlugin;

},
// 13
function (module) {

module.exports = require('./schema-utils');

},
// 14
function (module, exports, __webpack_require__) {

const uuid = __webpack_require__(15),
  /** @type {Object.<string, *>} */ colors = __webpack_require__(18),
  loglevel = __webpack_require__(20);

const symbols = {
  trace: colors.grey('₸'),
  debug: colors.cyan('➤'),
  info: colors.blue(colors.symbols.info),
  warn: colors.yellow(colors.symbols.warning),
  error: colors.red(colors.symbols.cross)
};

const defaults = { name: '<unknown>', level: 'info', unique: true };

const prefix = {
  level: options => symbols[options.level],
  template: `{{level}} ${colors.gray('｢{{name}}｣')}: `
};

function log(options) {
  const opts = Object.assign({}, defaults, options),
    { id } = options;

  opts.prefix = Object.assign({}, prefix, options.prefix);
  delete opts.id;

  Object.defineProperty(opts, 'id', {
    get() {
      return id || this.name + (opts.unique ? '-' + uuid() : '');
    }
  });

  if (opts.timestamp) opts.prefix.template = '[{{time}}] ' + opts.prefix.template;

  const log = loglevel.getLogger(opts);

  Object.prototype.hasOwnProperty.call(log, 'id') ||
    Object.defineProperty(log, 'id', { get: () => opts.id });

  return log;
}

module.exports = log;
module.exports.colors = colors;
module.exports.delLogger = function (name) {
  delete loglevel.loggers[name];
};

module.exports.factories = loglevel.factories;

},
// 15
function (module, exports, __webpack_require__) {

var rng = __webpack_require__(16),
  bytesToUuid = __webpack_require__(17);

function v4(options, buf, offset) {
  var i = (buf && offset) || 0;

  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }

  var rnds = (options = options || {}).random || (options.rng || rng)();

  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  if (buf) for (var ii = 0; ii < 16; ++ii) buf[i + ii] = rnds[ii];

  return buf || bytesToUuid(rnds);
}

module.exports = v4;

},
// 16
function (module, exports, __webpack_require__) {

var crypto = __webpack_require__(1);

module.exports = function () {
  return crypto.randomBytes(16);
};

},
// 17
function (module) {

var byteToHex = [];
for (var i = 0; i < 256; ++i) byteToHex[i] = (i + 0x100).toString(16).substr(1);

function bytesToUuid(buf, offset) {
  var i = offset || 0,
    bth = byteToHex;
  return [
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]], '-',
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]],
    bth[buf[i++]], bth[buf[i++]]
  ].join('');
}

module.exports = bytesToUuid;

},
// 18
function (module, exports, __webpack_require__) {

const colors = { enabled: true, visible: true, styles: {}, keys: {} };

if ('FORCE_COLOR' in process.env) colors.enabled = process.env.FORCE_COLOR !== '0';

const ansi = style => {
  style.open = `\x1b[${style.codes[0]}m`;
  style.close = `\x1b[${style.codes[1]}m`;
  style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g');
  return style;
};

const wrap = (style, str, nl) => {
  let { open, close, regex } = style;
  str = open + (str.includes(close) ? str.replace(regex, close + open) : str) + close;
  return nl ? str.replace(/\r?\n/g, `${close}$&${open}`) : str;
};

const style = (input, stack) => {
  if (input === '' || input == null) return '';
  if (colors.enabled === false) return input;
  if (colors.visible === false) return '';
  let str = '' + input,
    nl = str.includes('\n');
  for (let n = stack.length; n-- > 0; ) str = wrap(colors.styles[stack[n]], str, nl);
  return str;
};

const define = (name, codes, type) => {
  colors.styles[name] = ansi({ name, codes });
  (colors.keys[type] || (colors.keys[type] = [])).push(name);

  Reflect.defineProperty(colors, name, {
    get() {
      let color = input => style(input, color.stack);
      Reflect.setPrototypeOf(color, colors);
      color.stack = this.stack ? this.stack.concat(name) : [name];
      return color;
    }
  });
};

define('reset', [0, 0], 'modifier');
define('bold', [1, 22], 'modifier');
define('dim', [2, 22], 'modifier');
define('italic', [3, 23], 'modifier');
define('underline', [4, 24], 'modifier');
define('inverse', [7, 27], 'modifier');
define('hidden', [8, 28], 'modifier');
define('strikethrough', [9, 29], 'modifier');

define('black', [30, 39], 'color');
define('red', [31, 39], 'color');
define('green', [32, 39], 'color');
define('yellow', [33, 39], 'color');
define('blue', [34, 39], 'color');
define('magenta', [35, 39], 'color');
define('cyan', [36, 39], 'color');
define('white', [37, 39], 'color');
define('gray', [90, 39], 'color');
define('grey', [90, 39], 'color');

define('bgBlack', [40, 49], 'bg');
define('bgRed', [41, 49], 'bg');
define('bgGreen', [42, 49], 'bg');
define('bgYellow', [43, 49], 'bg');
define('bgBlue', [44, 49], 'bg');
define('bgMagenta', [45, 49], 'bg');
define('bgCyan', [46, 49], 'bg');
define('bgWhite', [47, 49], 'bg');

define('blackBright', [90, 39], 'bright');
define('redBright', [91, 39], 'bright');
define('greenBright', [92, 39], 'bright');
define('yellowBright', [93, 39], 'bright');
define('blueBright', [94, 39], 'bright');
define('magentaBright', [95, 39], 'bright');
define('cyanBright', [96, 39], 'bright');
define('whiteBright', [97, 39], 'bright');

define('bgBlackBright', [100, 49], 'bgBright');
define('bgRedBright', [101, 49], 'bgBright');
define('bgGreenBright', [102, 49], 'bgBright');
define('bgYellowBright', [103, 49], 'bgBright');
define('bgBlueBright', [104, 49], 'bgBright');
define('bgMagentaBright', [105, 49], 'bgBright');
define('bgCyanBright', [106, 49], 'bgBright');
define('bgWhiteBright', [107, 49], 'bgBright');

const re = (colors.ansiRegex =
  /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g);

colors.hasColor = colors.hasAnsi = str => {
  re.lastIndex = 0;
  return !!str && typeof str == 'string' && re.test(str);
};

colors.unstyle = str => {
  re.lastIndex = 0;
  return typeof str == 'string' ? str.replace(re, '') : str;
};

colors.none = colors.clear = colors.noop = str => str;
colors.stripColor = colors.unstyle;
colors.symbols = __webpack_require__(19);
colors.define = define;
module.exports = colors;

},
// 19
function (module) {

const isWindows = process.platform === 'win32',
  isLinux = process.platform === 'linux';

const windows = {
  bullet: '•',
  check: '√',
  cross: '×',
  ellipsis: '...',
  heart: '❤',
  info: 'i',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionSmall: '﹖',
  pointer: '>',
  pointerSmall: '»',
  warning: '‼'
};

const other = {
  ballotCross: '✘',
  bullet: '•',
  check: '✔',
  cross: '✖',
  ellipsis: '…',
  heart: '❤',
  info: 'ℹ',
  line: '─',
  middot: '·',
  minus: '－',
  plus: '＋',
  question: '?',
  questionFull: '？',
  questionSmall: '﹖',
  pointer: isLinux ? '▸' : '❯',
  pointerSmall: isLinux ? '‣' : '›',
  warning: '⚠'
};

module.exports = isWindows ? windows : other;
Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });

},
// 20
function (module, exports, __webpack_require__) {

const LogLevel = __webpack_require__(21),
  MethodFactory = __webpack_require__(2),
  PrefixFactory = __webpack_require__(4),

  defaultLogger = new LogLevel({ name: 'default' }),
  cache = { default: defaultLogger },

  existing = typeof window != 'undefined' ? window.log : null;

module.exports = Object.assign(defaultLogger, {
  get factories() {
    return { MethodFactory, PrefixFactory };
  },
  get loggers() {
    return cache;
  },
  getLogger(options) {
    if (typeof options == 'string') options = { name: options };

    options.id || (options.id = options.name);

    const { name, id } = options,
      defaults = { level: defaultLogger.level };

    if (typeof name != 'string' || !name || !name.length)
      throw new TypeError('You must supply a name when creating a logger');

    let logger = cache[id];

    if (!logger) {
      logger = new LogLevel(Object.assign({}, defaults, options));

      cache[id] = logger;
    }

    return logger;
  },
  noConflict() {
    if (typeof window != 'undefined' && window.log === defaultLogger) window.log = existing;

    return defaultLogger;
  }
});

},
// 21
function (module, exports, __webpack_require__) {

const PrefixFactory = __webpack_require__(4),
  MethodFactory = __webpack_require__(2);

const defaults = {
  name: +new Date(),
  level: 'warn',
  prefix: null,
  factory: null
};

class LogLevel {
  constructor(options) {
    this.type = 'LogLevel';
    this.options = Object.assign({}, defaults, options);
    this.methodFactory = options.factory;

    if (!this.methodFactory) {
      this.methodFactory = options.prefix
        ? new PrefixFactory(this, options.prefix)
        : new MethodFactory(this);
    }

    this.methodFactory.logger || (this.methodFactory.logger = this);

    this.name = options.name || '<unknown>';
    this.level = this.options.level;
  }

  get factory() {
    return this.methodFactory;
  }

  set factory(factory) {
    factory.logger = this;

    this.methodFactory = factory;
    this.methodFactory.replaceMethods(this.level);
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

    if (level == null)
      throw new Error('loglevel: setLevel() called with invalid level: ' + logLevel);

    this.currentLevel = level;
    this.methodFactory.replaceMethods(level);

    typeof console == 'undefined' && level < this.levels.SILENT &&
      console.warn('loglevel: console is undefined. The log will produce no output');
  }

  get levels() {
    return this.methodFactory.levels;
  }
}

module.exports = LogLevel;

},
// 22
function (module) {

module.exports = JSON.parse(
  '{"definitions":{"ObjectPattern":{"type":"object","properties":{"from":{"anyOf":[{"type":"string","minLength":1},{"type":"object"}]},"to":{"type":"string"},"context":{"type":"string"},"toType":{"enum":["dir","file","template"]},"test":{"anyOf":[{"type":"string"},{"instanceof":"RegExp"}]},"force":{"type":"boolean"},"ignore":{"type":"array","items":{"anyOf":[{"type":"string"},{"type":"object"}]}},"flatten":{"type":"boolean"},"cache":{"anyOf":[{"type":"boolean"},{"type":"object"}]},"transform":{"instanceof":"Function"},"transformPath":{"instanceof":"Function"}},"required":["from"]},"StringPattern":{"type":"string","minLength":1}},"type":"array","items":{"anyOf":[{"$ref":"#/definitions/StringPattern"},{"$ref":"#/definitions/ObjectPattern"}]}}'
);

},
// 23
function (module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = preProcessPattern;

var _path = __webpack_require__(0),
  _isGlob = __webpack_require__(24),
  _globParent = __webpack_require__(25),

  _normalize = __webpack_require__(29).default,
  _isTemplateLike = __webpack_require__(30).default,
  _isObject = __webpack_require__(8).default,

  _promisify = __webpack_require__(9);

function preProcessPattern(globalRef, pattern) {
  const {
    logger,
    context,
    inputFileSystem,
    fileDependencies,
    contextDependencies,
    compilation
  } = globalRef;
  (pattern = typeof pattern == 'string' ? { from: pattern } : Object.assign({}, pattern)).to ||
    (pattern.to = '');
  pattern.context = pattern.context || context;

  _path.isAbsolute(pattern.context) || (pattern.context = _path.join(context, pattern.context));

  const isFromGlobPatten = (_isObject(pattern.from) && pattern.from.glob) || pattern.globOptions,

    isToDirectory = _path.extname(pattern.to) === '' || pattern.to.slice(-1) === _path.sep;

  pattern.from = isFromGlobPatten ? pattern.from : _path.normalize(pattern.from);
  pattern.context = _path.normalize(pattern.context);
  pattern.to = _path.normalize(pattern.to);
  pattern.ignore = globalRef.ignore.concat(pattern.ignore || []);
  logger.debug(`processing from: '${pattern.from}' to: '${pattern.to}'`);

  switch (true) {
    case !!pattern.toType:
      break;

    case _isTemplateLike(pattern.to):
      pattern.toType = 'template';
      break;

    case isToDirectory:
      pattern.toType = 'dir';
      break;

    default:
      pattern.toType = 'file';
  }

  if (isFromGlobPatten) {
    logger.debug(`determined '${pattern.absoluteFrom}' is a glob`);
    pattern.fromType = 'glob';
    const globOptions = Object.assign({}, pattern.globOptions ? pattern.globOptions : pattern.from);
    delete globOptions.glob;
    pattern.absoluteFrom = _path.resolve(
      pattern.context, pattern.globOptions ? pattern.from : pattern.from.glob
    );
    pattern.glob = _normalize(pattern.context, pattern.globOptions ? pattern.from : pattern.from.glob);
    pattern.globOptions = globOptions;
    return Promise.resolve(pattern);
  }

  pattern.absoluteFrom = _path.isAbsolute(pattern.from)
    ? pattern.from
    : _path.resolve(pattern.context, pattern.from);

  logger.debug(`determined '${pattern.from}' to be read from '${pattern.absoluteFrom}'`);

  const noStatsHandler = () => {
    if (_isGlob(pattern.from) || pattern.from.includes('*')) {
      logger.debug(`determined '${pattern.absoluteFrom}' is a glob`);
      pattern.fromType = 'glob';
      pattern.glob = _normalize(pattern.context, pattern.from);

      contextDependencies.add(_path.normalize(_globParent(pattern.absoluteFrom)));
    } else {
      const newWarning = new Error(`unable to locate '${pattern.from}' at '${pattern.absoluteFrom}'`);

      if (!compilation.warnings.some(warning => warning.message === newWarning.message)) {
        logger.warn(newWarning.message);
        compilation.warnings.push(newWarning);
      }

      pattern.fromType = 'nonexistent';
    }
  };

  logger.debug(`getting stats for '${pattern.absoluteFrom}' to determinate 'fromType'`);
  return _promisify.stat(inputFileSystem, pattern.absoluteFrom).catch(() => noStatsHandler()).then(stats => {
    if (!stats) {
      noStatsHandler();
      return pattern;
    }

    if (stats.isDirectory()) {
      logger.debug(`determined '${pattern.absoluteFrom}' is a directory`);
      contextDependencies.add(pattern.absoluteFrom);
      pattern.fromType = 'dir';
      pattern.context = pattern.absoluteFrom;
      pattern.glob = _normalize(pattern.absoluteFrom, '**/*');
      pattern.absoluteFrom = _path.join(pattern.absoluteFrom, '**/*');
      pattern.globOptions = { dot: true };
    } else if (stats.isFile()) {
      logger.debug(`determined '${pattern.absoluteFrom}' is a file`);
      fileDependencies.add(pattern.absoluteFrom);
      pattern.stats = stats;
      pattern.fromType = 'file';
      pattern.context = _path.dirname(pattern.absoluteFrom);
      pattern.glob = _normalize(pattern.absoluteFrom);
      pattern.globOptions = { dot: true };
    } else pattern.fromType || logger.warn('unrecognized file type for ' + pattern.from);

    return pattern;
  });
}

},
// 24
function (module, exports, __webpack_require__) {

var isExtglob = __webpack_require__(5),
  chars = { '{': '}', '(': ')', '[': ']' };
var strictCheck = function (str) {
  if (str[0] === '!') return true;

  var pipeIndex = -2,
    closeSquareIndex = -2,
    closeCurlyIndex = -2,
    closeParenIndex = -2,
    backSlashIndex = -2;
  for (var index = 0; index < str.length; ) {
    if (str[index] === '*' || (str[index + 1] === '?' && /[\].+)]/.test(str[index]))) return true;

    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
      if (closeSquareIndex < index) closeSquareIndex = str.indexOf(']', index);

      if (closeSquareIndex > index &&
          (backSlashIndex === -1 || backSlashIndex > closeSquareIndex ||
          (backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeSquareIndex))
        return true;
    }

    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}' &&
        (closeCurlyIndex = str.indexOf('}', index)) > index &&
        ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeCurlyIndex))
      return true;

    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' &&
        /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')' &&
        (closeParenIndex = str.indexOf(')', index)) > index &&
        ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeParenIndex))
      return true;

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) pipeIndex = str.indexOf('|', index);

      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')' &&
          (closeParenIndex = str.indexOf(')', pipeIndex)) > pipeIndex &&
          ((backSlashIndex = str.indexOf('\\', pipeIndex)) < 0 || backSlashIndex > closeParenIndex))
        return true;
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) index = n + 1;
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

var relaxedCheck = function (str) {
  if (str[0] === '!') return true;

  for (var index = 0; index < str.length; ) {
    if (/[*?{}()[\]]/.test(str[index])) return true;

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n !== -1) index = n + 1;
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

module.exports = function (str, options) {
  if (typeof str != 'string' || str === '') return false;

  if (isExtglob(str)) return true;

  var check = strictCheck;

  if (options && options.strict === false) check = relaxedCheck;

  return check(str);
};

},
// 25
function (module, exports, __webpack_require__) {

var isglob = __webpack_require__(26),
  pathDirname = __webpack_require__(27),
  isWin32 = __webpack_require__(6).platform() === 'win32';

module.exports = function (str) {
  if (isWin32 && str.indexOf('/') < 0) str = str.split('\\').join('/');

  if (/[{\[].*[\/]*.*[}\]]$/.test(str)) str += '/';

  str += 'a';

  do {
    str = pathDirname.posix(str);
  } while (isglob(str) || /(^|[^\\])([{\[]|\([^)]+$)/.test(str));

  return str.replace(/\\([*?|\[\](){}])/g, '$1');
};

},
// 26
function (module, exports, __webpack_require__) {

var isExtglob = __webpack_require__(5);

module.exports = function (str) {
  if (typeof str != 'string' || str === '') return false;

  if (isExtglob(str)) return true;

  for (var match, regex = /(\\).|([*?]|\[.*]|{.*}|\(.*\|.*\)|^!)/; (match = regex.exec(str)); ) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }
  return false;
};

},
// 27
function (module, exports, __webpack_require__) {

var inspect = __webpack_require__(28).inspect;

function assertPath(path) {
  if (typeof path != 'string')
    throw new TypeError('Path must be a string. Received ' + inspect(path));
}

function posix(path) {
  assertPath(path);
  if (path.length === 0) return '.';
  var code = path.charCodeAt(0),
    hasRoot = code === 47,
    end = -1;
  for (var matchedSlash = true, i = path.length - 1; i >= 1; --i)
    if ((code = path.charCodeAt(i)) !== 47) matchedSlash = false;
    else if (!matchedSlash) {
      end = i;
      break;
    }

  return end === -1 ? (hasRoot ? '/' : '.') : hasRoot && end === 1 ? '//' : path.slice(0, end);
}

function win32(path) {
  assertPath(path);
  var len = path.length;
  if (len === 0) return '.';
  var rootEnd = -1,
    end = -1,
    matchedSlash = true,
    offset = 0,
    code = path.charCodeAt(0);

  if (len > 1) {
    if (code === 47 || code === 92) {
      rootEnd = offset = 1;

      if ((code = path.charCodeAt(1)) === 47 || code === 92) {
        var j = 2,
          last = j;
        for (; j < len && (code = path.charCodeAt(j)) !== 47 && code !== 92; ++j);

        if (j < len && j !== last) {
          last = j;
          for (; j < len && ((code = path.charCodeAt(j)) === 47 || code === 92); ++j);

          if (j < len && j !== last) {
            last = j;
            for (; j < len && (code = path.charCodeAt(j)) !== 47 && code !== 92; ++j);

            if (j === len) return path;

            if (j !== last) rootEnd = offset = j + 1;
          }
        }
      }
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      code = path.charCodeAt(1);
      if (path.charCodeAt(1) === 58) {
        rootEnd = offset = 2;
        if (len > 2 && ((code = path.charCodeAt(2)) === 47 || code === 92)) rootEnd = offset = 3;
      }
    }
  } else if (code === 47 || code === 92) return path[0];

  for (var i = len - 1; i >= offset; --i)
    if ((code = path.charCodeAt(i)) !== 47 && code !== 92) matchedSlash = false;
    else if (!matchedSlash) {
      end = i;
      break;
    }

  if (end === -1) {
    if (rootEnd === -1) return '.';

    end = rootEnd;
  }
  return path.slice(0, end);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;

},
// 28
function (module) {

module.exports = require('util');

},
// 29
function (module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = normalize;

var _path = __webpack_require__(0),
  _normalizePath = __webpack_require__(7);

function escape(context, from) {
  if (from && _path.isAbsolute(from)) return from;

  const absoluteContext = _path.resolve(context)
    .replace(/[*|?!()\[\]{}]/g, substring => `[${substring}]`);

  return !from
    ? absoluteContext
    : absoluteContext.endsWith('/')
    ? `${absoluteContext}${from}`
    : `${absoluteContext}/${from}`;
}

function normalize(context, from) {
  return _normalizePath(escape(context, from));
}

},
// 30
function (module, exports) {

Object.defineProperty(exports, '__esModule', { value: true });

exports.default = pattern =>
  /(\[ext])|(\[name])|(\[path])|(\[folder])|(\[emoji(?::(\d+))?])|(\[(?:([^:\]]+):)?(?:hash|contenthash)(?::([a-z]+\d*))?(?::(\d+))?])|(\[\d+])/.test(pattern);

},
// 31
function (module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = processPattern;

var _path = __webpack_require__(0),
  _globby = __webpack_require__(32),
  _pLimit = __webpack_require__(40),
  _minimatch = __webpack_require__(42),

  _isObject = __webpack_require__(8).default;

function processPattern(globalRef, pattern) {
  const { logger, output, concurrency, compilation } = globalRef,
    globOptions = Object.assign({ cwd: pattern.context, follow: true }, pattern.globOptions || {});

  if (pattern.fromType === 'nonexistent') return Promise.resolve();

  const limit = _pLimit(concurrency || 100);
  logger.info(`begin globbing '${pattern.glob}' with a context of '${pattern.context}'`);
  return _globby(pattern.glob, globOptions).then(paths => Promise.all(paths.map(from => limit(() => {
    const file = {
      force: pattern.force,
      absoluteFrom: _path.resolve(pattern.context, from)
    };
    file.relativeFrom = _path.relative(pattern.context, file.absoluteFrom);

    if (pattern.flatten) file.relativeFrom = _path.basename(file.relativeFrom);

    logger.debug('found ' + from);

    for (let il = pattern.ignore.length; il--; ) {
      const ignoreGlob = pattern.ignore[il];
      let glob,
        globParams = { dot: true, matchBase: true };

      if (typeof ignoreGlob == 'string') glob = ignoreGlob;
      else if (_isObject(ignoreGlob)) {
        glob = ignoreGlob.glob || '';
        const ignoreGlobParams = Object.assign({}, ignoreGlob);
        delete ignoreGlobParams.glob;

        globParams = Object.assign(globParams, ignoreGlobParams);
      } else glob = '';

      logger.debug(`testing ${glob} against ${file.relativeFrom}`);

      if (_minimatch(file.relativeFrom, glob, globParams)) {
        logger.info(`ignoring '${file.relativeFrom}', because it matches the ignore glob '${glob}'`);
        return Promise.resolve();
      }

      logger.debug(`${glob} doesn't match ${file.relativeFrom}`);
    }

    if (pattern.toType === 'dir') file.webpackTo = _path.join(pattern.to, file.relativeFrom);
    else if (pattern.toType === 'file') file.webpackTo = pattern.to || file.relativeFrom;
    else if (pattern.toType === 'template') {
      file.webpackTo = pattern.to;
      file.webpackToRegExp = pattern.test;
    }

    if (_path.isAbsolute(file.webpackTo)) {
      if (output === '/') {
        const message =
          'using older versions of webpack-dev-server, devServer.outputPath must be defined to write to absolute paths';
        logger.error(message);
        compilation.errors.push(new Error(message));
      }

      file.webpackTo = _path.relative(output, file.webpackTo);
    }

    logger.info(`determined that '${from}' should write to '${file.webpackTo}'`);
    return file;
  }))));
}

},
// 32
function (module, exports, __webpack_require__) {

const arrayUnion = __webpack_require__(33),
  glob = __webpack_require__(10),
  pify = __webpack_require__(3),
  dirGlob = __webpack_require__(35),
  gitignore = __webpack_require__(37),

  globP = pify(glob),
  DEFAULT_FILTER = (_) => false,

  isNegative = pattern => pattern[0] === '!';

const assertPatternsInput = patterns => {
  if (patterns.some(x => typeof x != 'string'))
    throw new TypeError('Patterns must be a string or an array of strings');
};

const generateGlobTasks = (patterns, taskOpts) => {
  patterns = [].concat(patterns);
  assertPatternsInput(patterns);

  const globTasks = [];

  taskOpts = Object.assign({
    cache: Object.create(null),
    statCache: Object.create(null),
    realpathCache: Object.create(null),
    symlinks: Object.create(null),
    ignore: [],
    expandDirectories: true,
    nodir: true
  }, taskOpts);

  patterns.forEach((pattern, i) => {
    if (isNegative(pattern)) return;

    const ignore = patterns
      .slice(i)
      .filter(isNegative)
      .map(pattern => pattern.slice(1));

    const opts = Object.assign({}, taskOpts, { ignore: taskOpts.ignore.concat(ignore) });

    globTasks.push({ pattern, opts });
  });

  return globTasks;
};

const globDirs = (task, fn) =>
  Array.isArray(task.opts.expandDirectories)
    ? fn(task.pattern, { files: task.opts.expandDirectories })
    : typeof task.opts.expandDirectories == 'object'
    ? fn(task.pattern, task.opts.expandDirectories)
    : fn(task.pattern);

const getPattern = (task, fn) => (task.opts.expandDirectories ? globDirs(task, fn) : [task.pattern]);

module.exports = (patterns, opts) => {
  let globTasks;

  try {
    globTasks = generateGlobTasks(patterns, opts);
  } catch (err) {
    return Promise.reject(err);
  }

  const getTasks = Promise.all(globTasks.map(task =>
    Promise.resolve(getPattern(task, dirGlob)).then(globs =>
      Promise.all(globs.map(glob => ({ pattern: glob, opts: task.opts })))
    )
  )).then(tasks => arrayUnion.apply(null, tasks));

  return (() => Promise.resolve(
    opts && opts.gitignore ? gitignore({ cwd: opts.cwd, ignore: opts.ignore }) : DEFAULT_FILTER
  ))().then(filter =>
    getTasks
      .then(tasks => Promise.all(tasks.map(task => globP(task.pattern, task.opts))))
      .then(paths => arrayUnion.apply(null, paths))
      .then(paths => paths.filter(p => !filter(p)))
  );
};

module.exports.sync = (patterns, opts) => {
  const getFilter = () =>
    opts && opts.gitignore ? gitignore.sync({ cwd: opts.cwd, ignore: opts.ignore }) : DEFAULT_FILTER;

  const tasks = generateGlobTasks(patterns, opts).reduce((tasks, task) => {
    const newTask = getPattern(task, dirGlob.sync).map(glob => ({ pattern: glob, opts: task.opts }));
    return tasks.concat(newTask);
  }, []);

  const filter = getFilter();

  return tasks
    .reduce((matches, task) => arrayUnion(matches, glob.sync(task.pattern, task.opts)), [])
    .filter(p => !filter(p));
};

module.exports.generateGlobTasks = generateGlobTasks;

module.exports.hasMagic = (patterns, opts) =>
  [].concat(patterns).some(pattern => glob.hasMagic(pattern, opts));

module.exports.gitignore = gitignore;

},
// 33
function (module, exports, __webpack_require__) {

var arrayUniq = __webpack_require__(34);

module.exports = function () {
  return arrayUniq([].concat.apply([], arguments));
};

},
// 34
function (module) {

function uniqNoSet(arr) {
  var ret = [];

  for (var i = 0; i < arr.length; i++) ret.indexOf(arr[i]) < 0 && ret.push(arr[i]);

  return ret;
}

function uniqSet(arr) {
  var seen = new Set();

  return arr.filter(function (el) {
    if (!seen.has(el)) {
      seen.add(el);
      return true;
    }

    return false;
  });
}

function uniqSetWithForEach(arr) {
  var ret = [];

  new Set(arr).forEach(function (el) {
    ret.push(el);
  });

  return ret;
}

function doesForEachActuallyWork() {
  var ret = false;

  new Set([true]).forEach(function (el) {
    ret = el;
  });

  return ret === true;
}

module.exports = 'Set' in global
  ? typeof Set.prototype.forEach == 'function' && doesForEachActuallyWork()
    ? uniqSetWithForEach
    : uniqSet
  : uniqNoSet;

},
// 35
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  pathType = __webpack_require__(36),

  getExtensions = extensions => (extensions.length > 1 ? `{${extensions.join(',')}}` : extensions[0]);

const getPath = (filepath, cwd) => {
  const pth = filepath[0] === '!' ? filepath.slice(1) : filepath;
  return path.isAbsolute(pth) ? pth : path.join(cwd, pth);
};

const addExtensions = (file, extensions) =>
  path.extname(file) ? '**/' + file : `**/${file}.${getExtensions(extensions)}`;

const getGlob = (dir, opts) => {
  if (opts.files && !Array.isArray(opts.files))
    throw new TypeError(
      'Expected `files` to be of type `Array` but received type `' + typeof opts.files + '`'
    );

  if (opts.extensions && !Array.isArray(opts.extensions))
    throw new TypeError(
      'Expected `extensions` to be of type `Array` but received type `' + typeof opts.extensions + '`'
    );

  return opts.files && opts.extensions
    ? opts.files.map(x => path.join(dir, addExtensions(x, opts.extensions)))

    : opts.files
    ? opts.files.map(x => path.join(dir, '**/' + x))

    : opts.extensions
    ? [path.join(dir, '**/*.' + getExtensions(opts.extensions))]

    : [path.join(dir, '**')];
};

module.exports = (input, opts) =>
  typeof (opts = Object.assign({ cwd: process.cwd() }, opts)).cwd != 'string'
    ? Promise.reject(
        new TypeError('Expected `cwd` to be of type `string` but received type `' + typeof opts.cwd + '`')
      )

    : Promise.all([].concat(input)
        .map(x => pathType.dir(getPath(x, opts.cwd)).then(isDir => (isDir ? getGlob(x, opts) : x)))
      ).then(globs => [].concat.apply([], globs));

module.exports.sync = (input, opts) => {
  if (typeof (opts = Object.assign({ cwd: process.cwd() }, opts)).cwd != 'string')
    throw new TypeError(
      'Expected `cwd` to be of type `string` but received type `' + typeof opts.cwd + '`'
    );

  const globs = [].concat(input)
    .map(x => (pathType.dirSync(getPath(x, opts.cwd)) ? getGlob(x, opts) : x));
  return [].concat.apply([], globs);
};

},
// 36
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(11),
  pify = __webpack_require__(3);

function type(fn, fn2, fp) {
  if (typeof fp != 'string')
    return Promise.reject(new TypeError('Expected a string, got ' + typeof fp));

  return pify(fs[fn])(fp)
    .then(stats => stats[fn2]())
    .catch(err => {
      if (err.code === 'ENOENT') return false;

      throw err;
    });
}

function typeSync(fn, fn2, fp) {
  if (typeof fp != 'string') throw new TypeError('Expected a string, got ' + typeof fp);

  try {
    return fs[fn](fp)[fn2]();
  } catch (err) {
    if (err.code === 'ENOENT') return false;

    throw err;
  }
}

exports.file = type.bind(null, 'stat', 'isFile');
exports.dir = type.bind(null, 'stat', 'isDirectory');
exports.symlink = type.bind(null, 'lstat', 'isSymbolicLink');
exports.fileSync = typeSync.bind(null, 'statSync', 'isFile');
exports.dirSync = typeSync.bind(null, 'statSync', 'isDirectory');
exports.symlinkSync = typeSync.bind(null, 'lstatSync', 'isSymbolicLink');

},
// 37
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(11),
  path = __webpack_require__(0),
  glob = __webpack_require__(10),
  gitIgnore = __webpack_require__(38),
  pify = __webpack_require__(3),
  slash = __webpack_require__(39),

  globP = pify(glob),
  readFileP = pify(fs.readFile);

const mapGitIgnorePatternTo = base => ignore =>
  ignore.startsWith('!')
    ? '!' + path.posix.join(base, ignore.substr(1))
    : path.posix.join(base, ignore);

const parseGitIgnore = (content, opts) => {
  const base = slash(path.relative(opts.cwd, path.dirname(opts.fileName)));

  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(l => l.charAt(0) !== '#')
    .map(mapGitIgnorePatternTo(base));
};

const reduceIgnore = files =>
  files.reduce((ignores, file) => {
    ignores.add(parseGitIgnore(file.content, { cwd: file.cwd, fileName: file.filePath }));
    return ignores;
  }, gitIgnore());

const getIsIgnoredPredicate = (ignores, cwd) => p => ignores.ignores(slash(path.relative(cwd, p)));

const getFile = (file, cwd) => {
  const filePath = path.join(cwd, file);
  return readFileP(filePath, 'utf8').then(content => ({ content, cwd, filePath }));
};

const getFileSync = (file, cwd) => {
  const filePath = path.join(cwd, file);

  return { content: fs.readFileSync(filePath, 'utf8'), cwd, filePath };
};

const normalizeOpts = opts => ({
  ignore: (opts = opts || {}).ignore || [],
  cwd: opts.cwd || process.cwd()
});

module.exports = o => {
  const opts = normalizeOpts(o);

  return globP('**/.gitignore', { ignore: opts.ignore, cwd: opts.cwd })
    .then(paths => Promise.all(paths.map(file => getFile(file, opts.cwd))))
    .then(files => reduceIgnore(files))
    .then(ignores => getIsIgnoredPredicate(ignores, opts.cwd));
};

module.exports.sync = o => {
  const opts = normalizeOpts(o),

    files = glob
      .sync('**/.gitignore', { ignore: opts.ignore, cwd: opts.cwd })
      .map(file => getFileSync(file, opts.cwd)),
    ignores = reduceIgnore(files);
  return getIsIgnoredPredicate(ignores, opts.cwd);
};

},
// 38
function (module) {

module.exports = function () {
  return new IgnoreBase();
};

function make_array(subject) {
  return Array.isArray(subject) ? subject : [subject];
}

var REGEX_BLANK_LINE = /^\s+$/,
  REGEX_LEADING_ESCAPED_EXCLAMATION = /^\\!/,
  REGEX_LEADING_ESCAPED_HASH = /^\\#/,
  SLASH = '/',
  KEY_IGNORE = typeof Symbol != 'undefined' ? Symbol.for('node-ignore') : 'node-ignore';

class IgnoreBase {
  constructor() {
    this._rules = [];
    this[KEY_IGNORE] = true;
    this._initCache();
  }

  _initCache() {
    this._cache = {};
  }

  add(pattern) {
    this._added = false;

    if (typeof pattern == 'string') pattern = pattern.split(/\r?\n/g);

    make_array(pattern).forEach(this._addPattern, this);

    this._added && this._initCache();

    return this;
  }

  addPattern(pattern) {
    return this.add(pattern);
  }

  _addPattern(pattern) {
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules);
      this._added = true;
      return;
    }

    if (this._checkPattern(pattern)) {
      var rule = this._createRule(pattern);
      this._added = true;
      this._rules.push(rule);
    }
  }

  _checkPattern(pattern) {
    return pattern && typeof pattern == 'string' &&
      !REGEX_BLANK_LINE.test(pattern) && pattern.indexOf('#') !== 0;
  }

  filter(paths) {
    var _this = this;

    return make_array(paths).filter(function (path) {
      return _this._filter(path);
    });
  }

  createFilter() {
    var _this2 = this;

    return function (path) {
      return _this2._filter(path);
    };
  }

  ignores(path) {
    return !this._filter(path);
  }

  _createRule(pattern) {
    var origin = pattern,
      negative = false;

    if (pattern.indexOf('!') === 0) {
      negative = true;
      pattern = pattern.substr(1);
    }

    return {
      origin: origin,
      pattern: (pattern = pattern
        .replace(REGEX_LEADING_ESCAPED_EXCLAMATION, '!')
        .replace(REGEX_LEADING_ESCAPED_HASH, '#')),
      negative: negative,
      regex: make_regex(pattern, negative)
    };
  }

  _filter(path, slices) {
    if (!path) return false;

    if (path in this._cache) return this._cache[path];

    slices || (slices = path.split(SLASH));

    slices.pop();

    return (this._cache[path] = slices.length
      ? this._filter(slices.join(SLASH) + SLASH, slices) && this._test(path)
      : this._test(path));
  }

  _test(path) {
    var matched = 0;

    this._rules.forEach(function (rule) {
      matched ^ rule.negative || (matched = rule.negative ^ rule.regex.test(path));
    });

    return !matched;
  }
}

var DEFAULT_REPLACER_PREFIX = [
  [/\\?\s+$/, function (match) {
    return match.indexOf('\\') === 0 ? ' ' : '';
  }],

  [/\\\s/g, function () {
    return ' ';
  }],

  [/[\\^$.|?*+()\[{]/g, function (match) {
    return '\\' + match;
  }],

  [/^\//, function () {
    return '^';
  }],

  [/\//g, function () {
    return '\\/';
  }],
  [/^\^*\\\*\\\*\\\//, function () {
    return '^(?:.*\\/)?';
  }]
];

var DEFAULT_REPLACER_SUFFIX = [
  [/^(?=[^\^])/, function () {
    return !/\/(?!$)/.test(this) ? '(?:^|\\/)' : '^';
  }],

  [/\\\/\\\*\\\*(?=\\\/|$)/g, function (match, index, str) {
    return index + 6 < str.length ? '(?:\\/[^\\/]+)*' : '\\/.+';
  }],

  [/(^|[^\\]+)\\\*(?=.+)/g, function (match, p1) {
    return p1 + '[^\\/]*';
  }],

  [/(\^|\\\/)?\\\*$/, function (match, p1) {
    return (p1 ? p1 + '[^/]+' : '[^/]*') + '(?=$|\\/$)';
  }],
  [/\\\\\\/g, function () {
    return '\\';
  }]
];

var POSITIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [
  [/(?:[^*\/])$/, function (match) {
    return match + '(?=$|\\/)';
  }]
], DEFAULT_REPLACER_SUFFIX);

var NEGATIVE_REPLACERS = [].concat(DEFAULT_REPLACER_PREFIX, [
  [/(?:[^*])$/, function (match) {
    return match + '(?=$|\\/$)';
  }]
], DEFAULT_REPLACER_SUFFIX);

var cache = {};

function make_regex(pattern, negative) {
  var r = cache[pattern];
  if (r) return r;

  var source = (negative ? NEGATIVE_REPLACERS : POSITIVE_REPLACERS).reduce(function (prev, current) {
    return prev.replace(current[0], current[1].bind(pattern));
  }, pattern);

  return (cache[pattern] = new RegExp(source, 'i'));
}

if (typeof process != 'undefined' &&
    ((process.env && process.env.IGNORE_TEST_WIN32) || process.platform === 'win32')) {
  var filter = IgnoreBase.prototype._filter;
  var make_posix = function (str) {
    return /^\\\\\?\\/.test(str) || /[^\x00-\x80]+/.test(str) ? str : str.replace(/\\/g, '/');
  };

  IgnoreBase.prototype._filter = function (path, slices) {
    path = make_posix(path);
    return filter.call(this, path, slices);
  };
}

},
// 39
function (module) {

module.exports = function (str) {
  var isExtendedLengthPath = /^\\\\\?\\/.test(str),
    hasNonAscii = /[^\x00-\x80]+/.test(str);

  return isExtendedLengthPath || hasNonAscii ? str : str.replace(/\\/g, '/');
};

},
// 40
function (module, exports, __webpack_require__) {

const pTry = __webpack_require__(41);

const pLimit = concurrency => {
  if ((!Number.isInteger(concurrency) && concurrency !== Infinity) || concurrency < 1)
    return Promise.reject(new TypeError('Expected `concurrency` to be a number from 1 and up'));

  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;

    queue.length > 0 && queue.shift()();
  };

  const run = (fn, resolve, ...args) => {
    activeCount++;

    const result = pTry(fn, ...args);

    resolve(result);

    result.then(next, next);
  };

  const enqueue = (fn, resolve, ...args) => {
    activeCount < concurrency
      ? run(fn, resolve, ...args)
      : queue.push(run.bind(null, fn, resolve, ...args));
  };

  const generator = (fn, ...args) => new Promise(resolve => enqueue(fn, resolve, ...args));
  Object.defineProperties(generator, {
    activeCount: { get: () => activeCount },
    pendingCount: { get: () => queue.length },
    clearQueue: {
      value: () => {
        queue.length = 0;
      }
    }
  });

  return generator;
};

module.exports = pLimit;
module.exports.default = pLimit;

},
// 41
function (module) {

const pTry = (fn, ...arguments_) => new Promise(resolve => {
  resolve(fn(...arguments_));
});

module.exports = pTry;
module.exports.default = pTry;

},
// 42
function (module) {

module.exports = require('../vendor/minimatch');

},
// 43
function (module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = postProcessPattern;

var _path = __webpack_require__(0),
  _os = __webpack_require__(6),
  _crypto = __webpack_require__(1),
  _loaderUtils = __webpack_require__(44),
  _cacache = __webpack_require__(45),
  _serializeJavascript = __webpack_require__(46),
  _findCacheDir = __webpack_require__(48),
  _normalizePath = __webpack_require__(7),

  _package = __webpack_require__(49),
  _promisify = __webpack_require__(9);

function postProcessPattern(globalRef, pattern, file) {
  const {
    logger,
    compilation,
    fileDependencies,
    written,
    inputFileSystem,
    copyUnmodified
  } = globalRef;
  logger.debug(`getting stats for '${file.absoluteFrom}' to write to assets`);
  return (
    pattern.stats
      ? Promise.resolve().then(() => pattern.stats)
      : _promisify.stat(inputFileSystem, file.absoluteFrom)
  ).then(stats => {
    if (stats.isDirectory()) {
      logger.debug(`skipping '${file.absoluteFrom}' because it is empty directory`);
      return Promise.resolve();
    }

    pattern.fromType !== 'glob' || fileDependencies.add(file.absoluteFrom);

    logger.debug(`reading '${file.absoluteFrom}' to write to assets`);
    return _promisify.readFile(inputFileSystem, file.absoluteFrom).then(content => {
      if (!pattern.transform) return content;

      logger.info(`transforming content for '${file.absoluteFrom}'`);
      const transform = (content, absoluteFrom) => pattern.transform(content, absoluteFrom);

      if (pattern.cache) {
        globalRef.cacheDir ||
          (globalRef.cacheDir = _findCacheDir({ name: 'copy-webpack-plugin' }) || _os.tmpdir());

        const cacheKey = pattern.cache.key ? pattern.cache.key : _serializeJavascript({
          name: _package.name,
          version: _package.version,
          pattern,
          hash: _crypto.createHash('md4').update(content).digest('hex')
        });
        return _cacache.get(globalRef.cacheDir, cacheKey).then(result => {
          logger.debug(`getting cached transformation for '${file.absoluteFrom}'`);
          return result.data;
        }, () => Promise.resolve().then(() => transform(content, file.absoluteFrom)).then(content => {
          logger.debug(`caching transformation for '${file.absoluteFrom}'`);
          return _cacache.put(globalRef.cacheDir, cacheKey, content).then(() => content);
        }));
      }

      return transform(content, file.absoluteFrom);
    }).then(content => {
      if (pattern.toType === 'template') {
        logger.info(`interpolating template '${file.webpackTo}' for '${file.relativeFrom}'`);

        _path.extname(file.relativeFrom) ||
          (file.webpackTo = file.webpackTo.replace(/\.?\[ext]/g, ''));

        file.webpackTo = _loaderUtils.interpolateName(
          { resourcePath: file.absoluteFrom },
          file.webpackTo,
          { content, regExp: file.webpackToRegExp, context: pattern.context }
        );

        file.webpackTo = _path.normalize(file.webpackTo);
      }

      return content;
    }).then(content => {
      if (pattern.transformPath) {
        logger.info(`transforming path '${file.webpackTo}' for '${file.absoluteFrom}'`);
        return Promise.resolve()
          .then(() => pattern.transformPath(file.webpackTo, file.absoluteFrom))
          .then(newPath => {
            file.webpackTo = newPath;
            return content;
          });
      }

      return content;
    }).then(content => {
      const hash = _loaderUtils.getHashDigest(content),

        targetPath = _normalizePath(file.webpackTo),
        targetAbsolutePath = _normalizePath(file.absoluteFrom);

      if (!copyUnmodified && written[targetPath] && written[targetPath][targetAbsolutePath] &&
          written[targetPath][targetAbsolutePath] === hash) {
        logger.info(`skipping '${file.webpackTo}', because content hasn't changed`);
        return;
      }

      logger.debug(`adding '${file.webpackTo}' for tracking content changes`);

      written[targetPath] || (written[targetPath] = {});

      written[targetPath][targetAbsolutePath] = hash;

      if (compilation.assets[targetPath] && !file.force) {
        logger.info(`skipping '${file.webpackTo}', because it already exists`);
        return;
      }

      logger.info(`writing '${file.webpackTo}' to compilation assets from '${file.absoluteFrom}'`);

      compilation.assets[targetPath] = { size: () => stats.size, source: () => content };
    });
  });
}

},
// 44
function (module) {

module.exports = require('./loader-utils');

},
// 45
function (module) {

module.exports = require('../vendor/cacache');

},
// 46
function (module, exports, __webpack_require__) {

var randomBytes = __webpack_require__(47),

  UID_LENGTH = 16,
  UID = generateUID(),
  PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|U|I|B)-' + UID + '-(\\d+)__@"', 'g'),

  IS_NATIVE_CODE_REGEXP = /{\s*\[native code]\s*}/g,
  IS_PURE_FUNCTION = /function.*?\(/,
  IS_ARROW_FUNCTION = /.*?=>.*?/,
  UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g,

  RESERVED_SYMBOLS = ['*', 'async'];

var ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}

function generateUID() {
  var bytes = randomBytes(UID_LENGTH),
    result = '';
  for (var i = 0; i < UID_LENGTH; ++i) result += bytes[i].toString(16);

  return result;
}

function deleteFunctions(obj) {
  var functionKeys = [];
  for (var key in obj) typeof obj[key] != 'function' || functionKeys.push(key);

  for (var i = 0; i < functionKeys.length; i++) delete obj[functionKeys[i]];
}

module.exports = function serialize(obj, options) {
  options || (options = {});

  if (typeof options == 'number' || typeof options == 'string') options = { space: options };

  var functions = [],
    regexps = [],
    dates = [],
    maps = [],
    sets = [],
    undefs = [],
    infinities = [],
    bigInts = [];

  function replacer(key, value) {
    options.ignoreFunction && deleteFunctions(value);

    if (!value && value !== void 0) return value;

    var origValue = this[key],
      type = typeof origValue;

    if (type === 'object') {
      if (origValue instanceof RegExp)
        return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';

      if (origValue instanceof Date) return '@__D-' + UID + '-' + (dates.push(origValue) - 1) + '__@';

      if (origValue instanceof Map) return '@__M-' + UID + '-' + (maps.push(origValue) - 1) + '__@';

      if (origValue instanceof Set) return '@__S-' + UID + '-' + (sets.push(origValue) - 1) + '__@';
    }

    return type === 'function'
      ? '@__F-' + UID + '-' + (functions.push(origValue) - 1) + '__@'

      : type === 'undefined'
      ? '@__U-' + UID + '-' + (undefs.push(origValue) - 1) + '__@'

      : type === 'number' && !isNaN(origValue) && !isFinite(origValue)
      ? '@__I-' + UID + '-' + (infinities.push(origValue) - 1) + '__@'

      : type === 'bigint'
      ? '@__B-' + UID + '-' + (bigInts.push(origValue) - 1) + '__@'

      : value;
  }

  function serializeFunc(fn) {
    var serializedFn = fn.toString();
    if (IS_NATIVE_CODE_REGEXP.test(serializedFn))
      throw new TypeError('Serializing native function: ' + fn.name);

    if (IS_PURE_FUNCTION.test(serializedFn) || IS_ARROW_FUNCTION.test(serializedFn))
      return serializedFn;

    var argsStartsAt = serializedFn.indexOf('(');
    var def = serializedFn.substr(0, argsStartsAt)
      .trim()
      .split(' ')
      .filter(function (val) { return val.length > 0; });

    return def.filter(function (val) {
      return RESERVED_SYMBOLS.indexOf(val) < 0;
    }).length > 0
      ? (def.indexOf('async') > -1 ? 'async ' : '') + 'function' +
        (def.join('').indexOf('*') > -1 ? '*' : '') +
        serializedFn.substr(argsStartsAt)

      : serializedFn;
  }

  if (options.ignoreFunction && typeof obj == 'function') obj = void 0;

  if (obj === void 0) return String(obj);

  var str = options.isJSON && !options.space
    ? JSON.stringify(obj)
    : JSON.stringify(obj, options.isJSON ? null : replacer, options.space);

  if (typeof str != 'string') return String(str);

  if (options.unsafe !== true) str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

  if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 &&
      sets.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0)
    return str;

  return str.replace(PLACE_HOLDER_REGEXP, function (match, backSlash, type, valueIndex) {
    return backSlash
      ? match

      : type === 'D'
      ? 'new Date("' + dates[valueIndex].toISOString() + '")'
      : type === 'R'
      ? 'new RegExp(' + serialize(regexps[valueIndex].source) + ', "' + regexps[valueIndex].flags + '")'
      : type === 'M'
      ? 'new Map(' + serialize(Array.from(maps[valueIndex].entries()), options) + ')'
      : type === 'S'
      ? 'new Set(' + serialize(Array.from(sets[valueIndex].values()), options) + ')'
      : type === 'U'
      ? 'undefined'
      : type === 'I'
      ? infinities[valueIndex]
      : type === 'B'
      ? 'BigInt("' + bigInts[valueIndex] + '")'

      : serializeFunc(functions[valueIndex]);
  });
};

},
// 47
function (module, exports, __webpack_require__) {

module.exports = __webpack_require__(1).randomBytes;

},
// 48
function (module) {

module.exports = require('../vendor/find-cache-dir');

},
// 49
function (module) {

module.exports = {
  name: 'copy-webpack-plugin',
  version: '5.1.2',
  description: 'Copy files & directories with webpack'
};

}
]);

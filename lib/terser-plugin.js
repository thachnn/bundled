'use strict';

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
  return __webpack_require__(4);
})([
// 0
function(module) {

module.exports = require("crypto");

},
// 1
function(module) {

module.exports = require("path");

},
// 2
function(module, exports, __webpack_require__) {

var randomBytes = __webpack_require__(10);

var UID_LENGTH = 16,
  UID = generateUID(),
  PLACE_HOLDER_REGEXP = new RegExp('(\\\\)?"@__(F|R|D|M|S|U|I|B)-' + UID + '-(\\d+)__@"', 'g'),

  IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g,
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
  var result = '';
  for (var bytes = randomBytes(UID_LENGTH), i = 0; i < UID_LENGTH; ++i)
    result += bytes[i].toString(16);

  return result;
}

function deleteFunctions(obj) {
  var functionKeys = [];
  for (var key in obj) typeof obj[key] != "function" || functionKeys.push(key);

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
      if (origValue instanceof RegExp) return '@__R-' + UID + '-' + (regexps.push(origValue) - 1) + '__@';

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

    var argsStartsAt = serializedFn.indexOf('('),
      def = serializedFn.substr(0, argsStartsAt).trim().split(' ').filter(function(val) {
        return val.length > 0;
      });

    return def.filter(function(val) {
      return RESERVED_SYMBOLS.indexOf(val) < 0;
    }).length > 0
      ? (def.indexOf('async') > -1 ? 'async ' : '') + 'function' +
        (def.join('').indexOf('*') > -1 ? '*' : '') + serializedFn.substr(argsStartsAt)

      : serializedFn;
  }

  if (options.ignoreFunction && typeof obj == "function") obj = void 0;

  if (obj === void 0) return String(obj);

  var str = options.isJSON && !options.space
    ? JSON.stringify(obj)
    : JSON.stringify(obj, options.isJSON ? null : replacer, options.space);

  if (typeof str != 'string') return String(str);

  if (options.unsafe !== true) str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

  if (functions.length === 0 && regexps.length === 0 && dates.length === 0 && maps.length === 0 &&
      sets.length === 0 && undefs.length === 0 && infinities.length === 0 && bigInts.length === 0)
    return str;

  return str.replace(PLACE_HOLDER_REGEXP, function(match, backSlash, type, valueIndex) {
    return backSlash
      ? match

      : type === 'D'
      ? 'new Date("' + dates[valueIndex].toISOString() + '")'
      : type === 'R'
      ? "new RegExp(" + serialize(regexps[valueIndex].source) + ', "' + regexps[valueIndex].flags + '")'
      : type === 'M'
      ? "new Map(" + serialize(Array.from(maps[valueIndex].entries()), options) + ")"
      : type === 'S'
      ? "new Set(" + serialize(Array.from(sets[valueIndex].values()), options) + ")"
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
// 3
function(module) {

module.exports = require("os");

},
// 4
function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;

var _crypto = __webpack_require__(0),
  _path = __webpack_require__(1),

  _sourceMap = __webpack_require__(5),
  _webpackSources = __webpack_require__(6),

  _RequestShortener = __webpack_require__(7),
  _ModuleFilenameHelpers = __webpack_require__(8),

  _schemaUtils = __webpack_require__(9),
  _serializeJavascript = __webpack_require__(2),

  _package = __webpack_require__(11),
  _options = __webpack_require__(12),

  _TaskRunner = __webpack_require__(13).default;

const warningRegex = /\[.+:([0-9]+),([0-9]+)\]/;

class TerserPlugin {
  constructor(options = {}) {
    _schemaUtils(_options, options, 'Terser Plugin');
    const {
      minify,
      terserOptions = {},
      test = /\.m?js(\?.*)?$/i,
      chunkFilter = () => true,
      warningsFilter = () => true,
      extractComments = false,
      sourceMap = false,
      cache = false,
      cacheKeys = defaultCacheKeys => defaultCacheKeys,
      parallel = false,
      include,
      exclude
    } = options;
    this.options = {
      test,
      chunkFilter,
      warningsFilter,
      extractComments,
      sourceMap,
      cache,
      cacheKeys,
      parallel,
      include,
      exclude,
      minify,
      terserOptions: Object.assign({}, terserOptions, {
        output: Object.assign(
          { comments: !extractComments && /^\**!|@preserve|@license|@cc_on/i },
          terserOptions.output
        )
      })
    };
  }

  static isSourceMap(input) {
    return !!(
      input && input.version && input.sources && Array.isArray(input.sources) &&
      typeof input.mappings == 'string'
    );
  }

  static buildSourceMap(inputSourceMap) {
    return !inputSourceMap || !TerserPlugin.isSourceMap(inputSourceMap)
      ? null
      : new _sourceMap.SourceMapConsumer(inputSourceMap);
  }

  static buildError(err, file, sourceMap, requestShortener) {
    if (err.line) {
      const original = sourceMap && sourceMap.originalPositionFor({ line: err.line, column: err.col });

      return original && original.source && requestShortener
        ? new Error(
            `${file} from Terser\n${err.message} [${requestShortener.shorten(original.source)}:${
              original.line
            },${original.column}][${file}:${err.line},${err.col}]`
          )
        : new Error(`${file} from Terser\n${err.message} [${file}:${err.line},${err.col}]`);
    }
    return err.stack
      ? new Error(`${file} from Terser\n${err.stack}`)

      : new Error(`${file} from Terser\n${err.message}`);
  }

  static buildWarning(warning, file, sourceMap, requestShortener, warningsFilter) {
    let warningMessage = warning,
      locationMessage = '',
      source = null;

    if (sourceMap) {
      const match = warningRegex.exec(warning);

      if (match) {
        const line = +match[1],
          column = +match[2],
          original = sourceMap.originalPositionFor({ line, column });

        if (original && original.source && original.source !== file && requestShortener) {
          ({ source } = original);
          warningMessage = warningMessage.replace(warningRegex, '');
          locationMessage = `[${requestShortener.shorten(source)}:${original.line},${original.column}]`;
        }
      }
    }

    return warningsFilter && !warningsFilter(warning, source)
      ? null
      : `Terser Plugin: ${warningMessage}${locationMessage}`;
  }

  apply(compiler) {
    const buildModuleFn = moduleArg => {
      moduleArg.useSourceMap = true;
    };

    const optimizeFn = (compilation, chunks, callback) => {
      const taskRunner = new _TaskRunner({ cache: this.options.cache, parallel: this.options.parallel }),
        processedAssets = new WeakSet(),
        tasks = [],
        { chunkFilter } = this.options;
      Array.from(chunks)
      .filter(chunk => chunkFilter && chunkFilter(chunk))
      .reduce((acc, chunk) => acc.concat(chunk.files || []), [])
      .concat(compilation.additionalChunkAssets || [])
      .filter(_ModuleFilenameHelpers.matchObject.bind(null, this.options))
      .forEach(file => {
        let inputSourceMap;
        const asset = compilation.assets[file];

        if (processedAssets.has(asset)) return;

        try {
          let input;

          if (this.options.sourceMap && asset.sourceAndMap) {
            const { source, map } = asset.sourceAndMap();
            input = source;

            if (TerserPlugin.isSourceMap(map)) inputSourceMap = map;
            else {
              inputSourceMap = map;
              compilation.warnings.push(new Error(file + ' contains invalid source map'));
            }
          } else {
            input = asset.source();
            inputSourceMap = null;
          }

          let commentsFile = false;

          if (this.options.extractComments) {
            commentsFile = this.options.extractComments.filename || file + '.LICENSE';

            if (typeof commentsFile == 'function') commentsFile = commentsFile(file);
          }

          const task = {
            file,
            input,
            inputSourceMap,
            commentsFile,
            extractComments: this.options.extractComments,
            terserOptions: this.options.terserOptions,
            minify: this.options.minify
          };

          if (this.options.cache) {
            const defaultCacheKeys = {
              terser: _package.version,
              node_version: process.version,
              'terser-webpack-plugin': __webpack_require__(21).version,
              'terser-webpack-plugin-options': this.options,
              hash: _crypto.createHash('md4').update(input).digest('hex')
            };
            task.cacheKeys = this.options.cacheKeys(defaultCacheKeys, file);
          }

          tasks.push(task);
        } catch (error) {
          compilation.errors.push(TerserPlugin.buildError(
            error, file,
            TerserPlugin.buildSourceMap(inputSourceMap),
            new _RequestShortener(compiler.context)
          ));
        }
      });
      taskRunner.run(tasks, (tasksError, results) => {
        if (tasksError) {
          compilation.errors.push(tasksError);
          return;
        }

        results.forEach((data, index) => {
          const { file, input, inputSourceMap, commentsFile } = tasks[index],
            { error, map, code, warnings } = data;
          let { extractedComments } = data,
            sourceMap = null;

          if (error || (warnings && warnings.length > 0))
            sourceMap = TerserPlugin.buildSourceMap(inputSourceMap);

          if (error) {
            compilation.errors.push(
              TerserPlugin.buildError(error, file, sourceMap, new _RequestShortener(compiler.context))
            );
            return;
          }

          let outputSource = map
            ? new _webpackSources.SourceMapSource(code, file, JSON.parse(map), input, inputSourceMap, true)
            : new _webpackSources.RawSource(code);

          if (commentsFile && extractedComments && extractedComments.length > 0) {
            if (commentsFile in compilation.assets) {
              const commentsFileSource = compilation.assets[commentsFile].source();
              extractedComments = extractedComments.filter(
                comment => !commentsFileSource.includes(comment)
              );
            }

            if (extractedComments.length > 0) {
              if (this.options.extractComments.banner !== false) {
                let banner = this.options.extractComments.banner ||
                  'For license information please see ' + _path.posix.basename(commentsFile);

                if (typeof banner == 'function') banner = banner(commentsFile);

                if (banner)
                  outputSource = new _webpackSources.ConcatSource(`/*! ${banner} */\n`, outputSource);
              }

              const commentsSource = new _webpackSources.RawSource(extractedComments.join('\n\n') + '\n');

              if (commentsFile in compilation.assets)
                if (compilation.assets[commentsFile] instanceof _webpackSources.ConcatSource) {
                  compilation.assets[commentsFile].add('\n');
                  compilation.assets[commentsFile].add(commentsSource);
                } else
                  compilation.assets[commentsFile] = new _webpackSources.ConcatSource(
                    compilation.assets[commentsFile], '\n', commentsSource
                  );
              else compilation.assets[commentsFile] = commentsSource;
            }
          }

          processedAssets.add((compilation.assets[file] = outputSource));

          warnings && warnings.length > 0 &&
            warnings.forEach(warning => {
              const builtWarning = TerserPlugin.buildWarning(
                warning, file, sourceMap,
                new _RequestShortener(compiler.context),
                this.options.warningsFilter
              );

              builtWarning && compilation.warnings.push(builtWarning);
            });
        });
        taskRunner.exit();
        callback();
      });
    };

    const plugin = { name: this.constructor.name };
    compiler.hooks.compilation.tap(plugin, compilation => {
      this.options.sourceMap && compilation.hooks.buildModule.tap(plugin, buildModuleFn);

      const { mainTemplate, chunkTemplate } = compilation;

      for (const template of [mainTemplate, chunkTemplate])
        template.hooks.hashForChunk.tap(plugin, hash => {
          const data = _serializeJavascript({
            terser: _package.version,
            terserOptions: this.options.terserOptions
          });
          hash.update('TerserPlugin');
          hash.update(data);
        });

      compilation.hooks.optimizeChunkAssets.tapAsync(plugin, optimizeFn.bind(this, compilation));
    });
  }
}

(exports = module.exports = TerserPlugin).default = TerserPlugin;

},
// 5
function(module) {

module.exports = require("../vendor/source-map");

},
// 6
function(module) {

module.exports = require("./webpack-sources");

},
// 7
function(module, exports, __webpack_require__) {

const path = __webpack_require__(1),
  NORMALIZE_SLASH_DIRECTION_REGEXP = /\\/g,
  PATH_CHARS_REGEXP = /[-[\]{}()*+?.,\\^$|#\s]/g,
  SEPARATOR_REGEXP = /[/\\]$/,
  FRONT_OR_BACK_BANG_REGEXP = /^!|!$/g,
  INDEX_JS_REGEXP = /\/index.js(!|\?|\(query\))/g,
  MATCH_RESOURCE_REGEXP = /!=!/,

  normalizeBackSlashDirection = request => request.replace(NORMALIZE_SLASH_DIRECTION_REGEXP, "/");

const createRegExpForPath = path => {
  const regexpTypePartial = path.replace(PATH_CHARS_REGEXP, "\\$&");
  return new RegExp("(^|!)" + regexpTypePartial, "g");
};

class RequestShortener {
  constructor(directory) {
    directory = normalizeBackSlashDirection(directory);
    if (SEPARATOR_REGEXP.test(directory)) directory = directory.substr(0, directory.length - 1);

    if (directory) this.currentDirectoryRegExp = createRegExpForPath(directory);

    const dirname = path.dirname(directory),
      parentDirectory = SEPARATOR_REGEXP.test(dirname) ? dirname.substr(0, dirname.length - 1) : dirname;
    if (parentDirectory && parentDirectory !== directory)
      this.parentDirectoryRegExp = createRegExpForPath(parentDirectory + "/");

    if (__dirname.length >= 2) {
      const buildins = normalizeBackSlashDirection(path.join(__dirname, "..")),
        buildinsAsModule = this.currentDirectoryRegExp && this.currentDirectoryRegExp.test(buildins);
      this.buildinsAsModule = buildinsAsModule;
      this.buildinsRegExp = createRegExpForPath(buildins);
    }

    this.cache = new Map();
  }

  shorten(request) {
    if (!request) return request;
    const cacheEntry = this.cache.get(request);
    if (cacheEntry !== void 0) return cacheEntry;

    let result = normalizeBackSlashDirection(request);
    if (this.buildinsAsModule && this.buildinsRegExp)
      result = result.replace(this.buildinsRegExp, "!(webpack)");

    if (this.currentDirectoryRegExp) result = result.replace(this.currentDirectoryRegExp, "!.");

    if (this.parentDirectoryRegExp) result = result.replace(this.parentDirectoryRegExp, "!../");

    if (!this.buildinsAsModule && this.buildinsRegExp)
      result = result.replace(this.buildinsRegExp, "!(webpack)");

    result = result.replace(INDEX_JS_REGEXP, "$1")
      .replace(FRONT_OR_BACK_BANG_REGEXP, "")
      .replace(MATCH_RESOURCE_REGEXP, " = ");
    this.cache.set(request, result);
    return result;
  }
}

module.exports = RequestShortener;

},
// 8
function(module, exports) {

const ModuleFilenameHelpers = exports;

const asRegExp = test =>
  typeof test == "string" ? new RegExp("^" + test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")) : test;

ModuleFilenameHelpers.matchPart = (str, test) => {
  if (!test) return true;
  test = asRegExp(test);
  return Array.isArray(test) ? test.map(asRegExp).some(regExp => regExp.test(str)) : test.test(str);
};

ModuleFilenameHelpers.matchObject = (obj, str) =>
  (!obj.test || ModuleFilenameHelpers.matchPart(str, obj.test)) &&
  (!obj.include || ModuleFilenameHelpers.matchPart(str, obj.include)) &&
  !(obj.exclude && ModuleFilenameHelpers.matchPart(str, obj.exclude));

},
// 9
function(module) {

module.exports = require("./schema-utils");

},
// 10
function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0).randomBytes;

},
// 11
function(module) {

module.exports = {
  name: "terser",
  description: "JavaScript parser, mangler/compressor and beautifier toolkit for ES6+",
  license: "BSD-2-Clause",
  version: "4.8.1-0"
};

},
// 12
function(module) {

module.exports = JSON.parse(
  '{"additionalProperties":false,"definitions":{"file-conditions":{"anyOf":[{"instanceof":"RegExp"},{"type":"string"}]}},"properties":{"test":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"include":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"exclude":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"chunkFilter":{"instanceof":"Function"},"cache":{"anyOf":[{"type":"boolean"},{"type":"string"}]},"cacheKeys":{"instanceof":"Function"},"parallel":{"anyOf":[{"type":"boolean"},{"type":"integer"}]},"sourceMap":{"type":"boolean"},"minify":{"instanceof":"Function"},"terserOptions":{"additionalProperties":true,"type":"object"},"extractComments":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"RegExp"},{"instanceof":"Function"},{"additionalProperties":false,"properties":{"condition":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"RegExp"},{"instanceof":"Function"}]},"filename":{"anyOf":[{"type":"string"},{"instanceof":"Function"}]},"banner":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"Function"}]}},"type":"object"}]},"warningsFilter":{"instanceof":"Function"}},"type":"object"}'
);

},
// 13
function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;

var _os = __webpack_require__(3),

  _cacache = __webpack_require__(14),
  _findCacheDir = __webpack_require__(15),

  _workerFarm = __webpack_require__(16),
  _serializeJavascript = __webpack_require__(2),
  _isWsl = __webpack_require__(17),

  _minify = __webpack_require__(19).default;

const worker = require.resolve('./terser-worker');

class TaskRunner {
  constructor(options = {}) {
    const { cache, parallel } = options;
    this.cacheDir =
      cache === true ? _findCacheDir({ name: 'terser-webpack-plugin' }) || _os.tmpdir() : cache;

    const cpus = _os.cpus() || { length: 1 };

    this.maxConcurrentWorkers = _isWsl ? 1
      : parallel === true ? cpus.length - 1 : Math.min(Number(parallel) || 0, cpus.length - 1);
  }

  run(tasks, callback) {
    if (!tasks.length) {
      callback(null, []);
      return;
    }

    if (this.maxConcurrentWorkers > 1) {
      const workerOptions = process.platform === 'win32'
        ? { maxConcurrentWorkers: this.maxConcurrentWorkers, maxConcurrentCallsPerWorker: 1 }
        : { maxConcurrentWorkers: this.maxConcurrentWorkers };
      this.workers = _workerFarm(workerOptions, worker);

      this.boundWorkers = (options, cb) => {
        try {
          this.workers(_serializeJavascript(options), cb);
        } catch (error) {
          cb(error);
        }
      };
    } else
      this.boundWorkers = (options, cb) => {
        try {
          cb(null, _minify(options));
        } catch (error) {
          cb(error);
        }
      };

    let toRun = tasks.length;
    const results = [];

    const step = (index, data) => {
      toRun -= 1;
      results[index] = data;

      toRun || callback(null, results);
    };

    tasks.forEach((task, index) => {
      const enqueue = () => {
        this.boundWorkers(task, (error, data) => {
          const result = error ? { error } : data,

            done = () => step(index, result);

          this.cacheDir && !result.error
            ? _cacache
                .put(this.cacheDir, _serializeJavascript(task.cacheKeys), JSON.stringify(data))
                .then(done, done)
            : done();
        });
      };

      this.cacheDir
        ? _cacache
            .get(this.cacheDir, _serializeJavascript(task.cacheKeys))
            .then(({ data }) => step(index, JSON.parse(data)), enqueue)
        : enqueue();
    });
  }

  exit() {
    this.workers && _workerFarm.end(this.workers);
  }
}

exports.default = TaskRunner;

},
// 14
function(module) {

module.exports = require("../vendor/cacache");

},
// 15
function(module) {

module.exports = require("../vendor/find-cache-dir");

},
// 16
function(module) {

module.exports = require("../vendor/worker-farm");

},
// 17
function(module, exports, __webpack_require__) {

const os = __webpack_require__(3),
  fs = __webpack_require__(18);

const isWsl = () => {
  if (process.platform !== 'linux') return false;

  if (os.release().includes('Microsoft')) return true;

  try {
    return fs.readFileSync('/proc/version', 'utf8').includes('Microsoft');
  } catch (_) {
    return false;
  }
};

module.exports = process.env.__IS_WSL_TEST__ ? isWsl : isWsl();

},
// 18
function(module) {

module.exports = require("fs");

},
// 19
function(module, exports, __webpack_require__) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;

var _terser = __webpack_require__(20);

const buildTerserOptions = ({
  ecma,
  warnings,
  parse = {},
  compress = {},
  mangle,
  module,
  output,
  toplevel,
  nameCache,
  ie8,

  keep_classnames,
  keep_fnames,

  safari10
} = {}) => ({
  ecma,
  warnings,
  parse: Object.assign({}, parse),
  compress: typeof compress == 'boolean' ? compress : Object.assign({}, compress),
  mangle: mangle == null || (typeof mangle == 'boolean' ? mangle : Object.assign({}, mangle)),
  output: Object.assign({
    shebang: true,
    comments: false,
    beautify: false,
    semicolons: true
  }, output),
  module,
  sourceMap: null,
  toplevel,
  nameCache,
  ie8,
  keep_classnames,
  keep_fnames,
  safari10
});

const buildComments = (options, terserOptions, extractedComments) => {
  const condition = {},
    commentsOpts = terserOptions.output.comments;

  if (typeof options.extractComments == 'boolean') {
    condition.preserve = commentsOpts;
    condition.extract = /^\**!|@preserve|@license|@cc_on/i;
  } else if (typeof options.extractComments == 'string' || options.extractComments instanceof RegExp) {
    condition.preserve = commentsOpts;
    condition.extract = options.extractComments;
  } else if (typeof options.extractComments == 'function') {
    condition.preserve = commentsOpts;
    condition.extract = options.extractComments;
  } else if (Object.prototype.hasOwnProperty.call(options.extractComments, 'condition')) {
    condition.preserve = commentsOpts;
    condition.extract = options.extractComments.condition;
  } else {
    condition.preserve = false;
    condition.extract = commentsOpts;
  }

  ['preserve', 'extract'].forEach(key => {
    let regexStr, regex;

    switch (typeof condition[key]) {
      case 'boolean':
        condition[key] = condition[key] ? () => true : () => false;
        break;

      case 'function':
        break;

      case 'string':
        if (condition[key] === 'all') {
          condition[key] = () => true;

          break;
        }

        if (condition[key] === 'some') {
          condition[key] = (astNode, comment) =>
            comment.type === 'comment2' && /^\**!|@preserve|@license|@cc_on/i.test(comment.value);

          break;
        }

        regexStr = condition[key];

        condition[key] = (astNode, comment) => new RegExp(regexStr).test(comment.value);

        break;

      default:
        regex = condition[key];

        condition[key] = (astNode, comment) => regex.test(comment.value);
    }
  });

  return (astNode, comment) => {
    if (condition.extract(astNode, comment)) {
      const commentText = comment.type === 'comment2' ? `/*${comment.value}*/` : '//' + comment.value;

      extractedComments.includes(commentText) || extractedComments.push(commentText);
    }

    return condition.preserve(astNode, comment);
  };
};

const minify = options => {
  const { file, input, inputSourceMap, extractComments, minify: minifyFn } = options;

  if (minifyFn) return minifyFn({ [file]: input }, inputSourceMap);

  const terserOptions = buildTerserOptions(options.terserOptions);

  if (inputSourceMap) terserOptions.sourceMap = true;

  const extractedComments = [];

  if (extractComments)
    terserOptions.output.comments = buildComments(options, terserOptions, extractedComments);

  const { error, map, code, warnings } = _terser.minify({ [file]: input }, terserOptions);
  return { error, map, code, warnings, extractedComments };
};

exports.default = minify;

},
// 20
function(module) {

module.exports = require("../vendor/terser");

},
// 21
function(module) {

module.exports = {
  name: "terser-webpack-plugin",
  version: "1.4.5",
  description: "Terser plugin for webpack",
  license: "MIT"
};

}
]);

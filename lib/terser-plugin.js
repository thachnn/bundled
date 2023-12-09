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
  return __webpack_require__(3);
}([ function(module, exports) {
  module.exports = require("path");
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
  module.exports = require("os");
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  var _crypto = __webpack_require__(4), _path = __webpack_require__(0), _sourceMap = __webpack_require__(5), _webpackSources = __webpack_require__(6), RequestShortener = __webpack_require__(7), matchObject = __webpack_require__(8).matchObject, validateOptions = __webpack_require__(9), _serializeJavascript = __webpack_require__(1), terserVersion = __webpack_require__(10).version, _options = __webpack_require__(11), TaskRunner = __webpack_require__(12).default;
  const warningRegex = /\[.+:([0-9]+),([0-9]+)\]/;
  class TerserPlugin {
    constructor(options = {}) {
      validateOptions(_options, options, "Terser Plugin");
      const {minify: minify, terserOptions: terserOptions = {}, test: test = /\.m?js(\?.*)?$/i, chunkFilter: chunkFilter = (() => !0), warningsFilter: warningsFilter = (() => !0), extractComments: extractComments = !1, sourceMap: sourceMap = !1, cache: cache = !1, cacheKeys: cacheKeys = (defaultCacheKeys => defaultCacheKeys), parallel: parallel = !1, include: include, exclude: exclude} = options;
      this.options = {
        test: test,
        chunkFilter: chunkFilter,
        warningsFilter: warningsFilter,
        extractComments: extractComments,
        sourceMap: sourceMap,
        cache: cache,
        cacheKeys: cacheKeys,
        parallel: parallel,
        include: include,
        exclude: exclude,
        minify: minify,
        terserOptions: Object.assign({
          output: {
            comments: !extractComments && /^\**!|@preserve|@license|@cc_on/i
          }
        }, terserOptions)
      };
    }
    static isSourceMap(input) {
      return Boolean(input && input.version && input.sources && Array.isArray(input.sources) && "string" == typeof input.mappings);
    }
    static buildSourceMap(inputSourceMap) {
      return inputSourceMap && TerserPlugin.isSourceMap(inputSourceMap) ? new _sourceMap.SourceMapConsumer(inputSourceMap) : null;
    }
    static buildError(err, file, sourceMap, requestShortener) {
      if (err.line) {
        const original = sourceMap && sourceMap.originalPositionFor({
          line: err.line,
          column: err.col
        });
        return original && original.source && requestShortener ? new Error(`${file} from Terser\n${err.message} [${requestShortener.shorten(original.source)}:${original.line},${original.column}][${file}:${err.line},${err.col}]`) : new Error(`${file} from Terser\n${err.message} [${file}:${err.line},${err.col}]`);
      }
      return err.stack ? new Error(`${file} from Terser\n${err.stack}`) : new Error(`${file} from Terser\n${err.message}`);
    }
    static buildWarning(warning, file, sourceMap, requestShortener, warningsFilter) {
      let warningMessage = warning, locationMessage = "", source = null;
      if (sourceMap) {
        const match = warningRegex.exec(warning);
        if (match) {
          const line = +match[1], column = +match[2], original = sourceMap.originalPositionFor({
            line: line,
            column: column
          });
          original && original.source && original.source !== file && requestShortener && (({source: source} = original), 
          warningMessage = "" + warningMessage.replace(warningRegex, ""), locationMessage = `[${requestShortener.shorten(original.source)}:${original.line},${original.column}]`);
        }
      }
      return warningsFilter && !warningsFilter(warning, source) ? null : `Terser Plugin: ${warningMessage}${locationMessage}`;
    }
    apply(compiler) {
      const buildModuleFn = moduleArg => {
        moduleArg.useSourceMap = !0;
      }, optimizeFn = (compilation, chunks, callback) => {
        const taskRunner = new TaskRunner({
          cache: this.options.cache,
          parallel: this.options.parallel
        }), processedAssets = new WeakSet, tasks = [], {chunkFilter: chunkFilter} = this.options;
        Array.from(chunks).filter(chunk => chunkFilter && chunkFilter(chunk)).reduce((acc, chunk) => acc.concat(chunk.files || []), []).concat(compilation.additionalChunkAssets || []).filter(matchObject.bind(null, this.options)).forEach(file => {
          let inputSourceMap;
          const asset = compilation.assets[file];
          if (!processedAssets.has(asset)) try {
            let input;
            if (this.options.sourceMap && asset.sourceAndMap) {
              const {source: source, map: map} = asset.sourceAndMap();
              input = source, TerserPlugin.isSourceMap(map) ? inputSourceMap = map : (inputSourceMap = map, 
              compilation.warnings.push(new Error(file + " contains invalid source map")));
            } else input = asset.source(), inputSourceMap = null;
            let commentsFile = !1;
            this.options.extractComments && (commentsFile = this.options.extractComments.filename || file + ".LICENSE", 
            "function" == typeof commentsFile && (commentsFile = commentsFile(file)));
            const task = {
              file: file,
              input: input,
              inputSourceMap: inputSourceMap,
              commentsFile: commentsFile,
              extractComments: this.options.extractComments,
              terserOptions: this.options.terserOptions,
              minify: this.options.minify
            };
            if (this.options.cache) {
              const defaultCacheKeys = {
                terser: terserVersion,
                node_version: process.version,
                "terser-webpack-plugin": __webpack_require__(20).version,
                "terser-webpack-plugin-options": this.options,
                hash: _crypto.createHash("md4").update(input).digest("hex")
              };
              task.cacheKeys = this.options.cacheKeys(defaultCacheKeys, file);
            }
            tasks.push(task);
          } catch (error) {
            compilation.errors.push(TerserPlugin.buildError(error, file, TerserPlugin.buildSourceMap(inputSourceMap), new RequestShortener(compiler.context)));
          }
        }), taskRunner.run(tasks, (tasksError, results) => {
          tasksError ? compilation.errors.push(tasksError) : (results.forEach((data, index) => {
            const {file: file, input: input, inputSourceMap: inputSourceMap, commentsFile: commentsFile} = tasks[index], {error: error, map: map, code: code, warnings: warnings} = data;
            let outputSource, {extractedComments: extractedComments} = data, sourceMap = null;
            if ((error || warnings && warnings.length > 0) && (sourceMap = TerserPlugin.buildSourceMap(inputSourceMap)), 
            error) compilation.errors.push(TerserPlugin.buildError(error, file, sourceMap, new RequestShortener(compiler.context))); else {
              if (outputSource = map ? new _webpackSources.SourceMapSource(code, file, JSON.parse(map), input, inputSourceMap, !0) : new _webpackSources.RawSource(code), 
              commentsFile && extractedComments && extractedComments.length > 0) {
                if (commentsFile in compilation.assets) {
                  const commentsFileSource = compilation.assets[commentsFile].source();
                  extractedComments = extractedComments.filter(comment => !commentsFileSource.includes(comment));
                }
                if (extractedComments.length > 0) {
                  if (!1 !== this.options.extractComments.banner) {
                    let banner = this.options.extractComments.banner || "For license information please see " + _path.posix.basename(commentsFile);
                    "function" == typeof banner && (banner = banner(commentsFile)), banner && (outputSource = new _webpackSources.ConcatSource(`/*! ${banner} */\n`, outputSource));
                  }
                  const commentsSource = new _webpackSources.RawSource(extractedComments.join("\n\n") + "\n");
                  commentsFile in compilation.assets ? compilation.assets[commentsFile] instanceof _webpackSources.ConcatSource ? (compilation.assets[commentsFile].add("\n"), 
                  compilation.assets[commentsFile].add(commentsSource)) : compilation.assets[commentsFile] = new _webpackSources.ConcatSource(compilation.assets[commentsFile], "\n", commentsSource) : compilation.assets[commentsFile] = commentsSource;
                }
              }
              processedAssets.add(compilation.assets[file] = outputSource), warnings && warnings.length > 0 && warnings.forEach(warning => {
                const builtWarning = TerserPlugin.buildWarning(warning, file, sourceMap, new RequestShortener(compiler.context), this.options.warningsFilter);
                builtWarning && compilation.warnings.push(builtWarning);
              });
            }
          }), taskRunner.exit(), callback());
        });
      }, plugin = {
        name: this.constructor.name
      };
      compiler.hooks.compilation.tap(plugin, compilation => {
        this.options.sourceMap && compilation.hooks.buildModule.tap(plugin, buildModuleFn);
        const {mainTemplate: mainTemplate, chunkTemplate: chunkTemplate} = compilation;
        for (const template of [ mainTemplate, chunkTemplate ]) template.hooks.hashForChunk.tap(plugin, hash => {
          const data = _serializeJavascript({
            terser: terserVersion,
            terserOptions: this.options.terserOptions
          });
          hash.update("TerserPlugin"), hash.update(data);
        });
        compilation.hooks.optimizeChunkAssets.tapAsync(plugin, optimizeFn.bind(this, compilation));
      });
    }
  }
  module.exports = TerserPlugin, module.exports.default = TerserPlugin;
}, function(module, exports) {
  module.exports = require("crypto");
}, function(module, exports) {
  module.exports = require("../vendor/source-map");
}, function(module, exports) {
  module.exports = require("./webpack-sources");
}, function(module, exports, __webpack_require__) {
  const path = __webpack_require__(0), NORMALIZE_SLASH_DIRECTION_REGEXP = /\\/g, PATH_CHARS_REGEXP = /[-[\]{}()*+?.,\\^$|#\s]/g, SEPARATOR_REGEXP = /[/\\]$/, FRONT_OR_BACK_BANG_REGEXP = /^!|!$/g, INDEX_JS_REGEXP = /\/index.js(!|\?|\(query\))/g, MATCH_RESOURCE_REGEXP = /!=!/, normalizeBackSlashDirection = request => request.replace(NORMALIZE_SLASH_DIRECTION_REGEXP, "/"), createRegExpForPath = path => {
    const regexpTypePartial = path.replace(PATH_CHARS_REGEXP, "\\$&");
    return new RegExp("(^|!)" + regexpTypePartial, "g");
  };
  module.exports = class {
    constructor(directory) {
      directory = normalizeBackSlashDirection(directory), SEPARATOR_REGEXP.test(directory) && (directory = directory.substr(0, directory.length - 1)), 
      directory && (this.currentDirectoryRegExp = createRegExpForPath(directory));
      const dirname = path.dirname(directory), parentDirectory = SEPARATOR_REGEXP.test(dirname) ? dirname.substr(0, dirname.length - 1) : dirname;
      if (parentDirectory && parentDirectory !== directory && (this.parentDirectoryRegExp = createRegExpForPath(parentDirectory + "/")), 
      __dirname.length >= 2) {
        const buildins = normalizeBackSlashDirection(path.join(__dirname, "..")), buildinsAsModule = this.currentDirectoryRegExp && this.currentDirectoryRegExp.test(buildins);
        this.buildinsAsModule = buildinsAsModule, this.buildinsRegExp = createRegExpForPath(buildins);
      }
      this.cache = new Map;
    }
    shorten(request) {
      if (!request) return request;
      const cacheEntry = this.cache.get(request);
      if (void 0 !== cacheEntry) return cacheEntry;
      let result = normalizeBackSlashDirection(request);
      return this.buildinsAsModule && this.buildinsRegExp && (result = result.replace(this.buildinsRegExp, "!(webpack)")), 
      this.currentDirectoryRegExp && (result = result.replace(this.currentDirectoryRegExp, "!.")), 
      this.parentDirectoryRegExp && (result = result.replace(this.parentDirectoryRegExp, "!../")), 
      !this.buildinsAsModule && this.buildinsRegExp && (result = result.replace(this.buildinsRegExp, "!(webpack)")), 
      result = result.replace(INDEX_JS_REGEXP, "$1"), result = result.replace(FRONT_OR_BACK_BANG_REGEXP, ""), 
      result = result.replace(MATCH_RESOURCE_REGEXP, " = "), this.cache.set(request, result), 
      result;
    }
  };
}, function(module, exports, __webpack_require__) {
  const ModuleFilenameHelpers = exports, asRegExp = test => ("string" == typeof test && (test = new RegExp("^" + test.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"))), 
  test);
  ModuleFilenameHelpers.matchPart = (str, test) => !test || (test = asRegExp(test), 
  Array.isArray(test) ? test.map(asRegExp).some(regExp => regExp.test(str)) : test.test(str)), 
  ModuleFilenameHelpers.matchObject = (obj, str) => !(obj.test && !ModuleFilenameHelpers.matchPart(str, obj.test)) && (!(obj.include && !ModuleFilenameHelpers.matchPart(str, obj.include)) && (!obj.exclude || !ModuleFilenameHelpers.matchPart(str, obj.exclude)));
}, function(module, exports) {
  module.exports = require("./schema-utils");
}, function(module) {
  module.exports = JSON.parse('{"name":"terser","version":"4.8.1"}');
}, function(module) {
  module.exports = JSON.parse('{"additionalProperties":false,"definitions":{"file-conditions":{"anyOf":[{"instanceof":"RegExp"},{"type":"string"}]}},"properties":{"test":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"include":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"exclude":{"anyOf":[{"$ref":"#/definitions/file-conditions"},{"items":{"anyOf":[{"$ref":"#/definitions/file-conditions"}]},"type":"array"}]},"chunkFilter":{"instanceof":"Function"},"cache":{"anyOf":[{"type":"boolean"},{"type":"string"}]},"cacheKeys":{"instanceof":"Function"},"parallel":{"anyOf":[{"type":"boolean"},{"type":"integer"}]},"sourceMap":{"type":"boolean"},"minify":{"instanceof":"Function"},"terserOptions":{"additionalProperties":true,"type":"object"},"extractComments":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"RegExp"},{"instanceof":"Function"},{"additionalProperties":false,"properties":{"condition":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"RegExp"},{"instanceof":"Function"}]},"filename":{"anyOf":[{"type":"string"},{"instanceof":"Function"}]},"banner":{"anyOf":[{"type":"boolean"},{"type":"string"},{"instanceof":"Function"}]}},"type":"object"}]},"warningsFilter":{"instanceof":"Function"}},"type":"object"}');
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = void 0;
  var _os = __webpack_require__(2), _cacache = __webpack_require__(13), _findCacheDir = __webpack_require__(14), _workerFarm = __webpack_require__(15), _serializeJavascript = __webpack_require__(1), _isWsl = __webpack_require__(16), _minify = __webpack_require__(18).default;
  const worker = require.resolve("./terser-worker");
  exports.default = class {
    constructor(options = {}) {
      const {cache: cache, parallel: parallel} = options;
      this.cacheDir = !0 === cache ? _findCacheDir({
        name: "terser-webpack-plugin"
      }) || _os.tmpdir() : cache;
      const cpus = _os.cpus() || {
        length: 1
      };
      this.maxConcurrentWorkers = _isWsl ? 1 : !0 === parallel ? cpus.length - 1 : Math.min(Number(parallel) || 0, cpus.length - 1);
    }
    run(tasks, callback) {
      if (!tasks.length) return void callback(null, []);
      if (this.maxConcurrentWorkers > 1) {
        const workerOptions = "win32" === process.platform ? {
          maxConcurrentWorkers: this.maxConcurrentWorkers,
          maxConcurrentCallsPerWorker: 1
        } : {
          maxConcurrentWorkers: this.maxConcurrentWorkers
        };
        this.workers = _workerFarm(workerOptions, worker), this.boundWorkers = (options, cb) => {
          try {
            this.workers(_serializeJavascript(options), cb);
          } catch (error) {
            cb(error);
          }
        };
      } else this.boundWorkers = (options, cb) => {
        try {
          cb(null, _minify(options));
        } catch (error) {
          cb(error);
        }
      };
      let toRun = tasks.length;
      const results = [], step = (index, data) => {
        toRun -= 1, results[index] = data, toRun || callback(null, results);
      };
      tasks.forEach((task, index) => {
        const enqueue = () => {
          this.boundWorkers(task, (error, data) => {
            const result = error ? {
              error: error
            } : data, done = () => step(index, result);
            this.cacheDir && !result.error ? _cacache.put(this.cacheDir, _serializeJavascript(task.cacheKeys), JSON.stringify(data)).then(done, done) : done();
          });
        };
        this.cacheDir ? _cacache.get(this.cacheDir, _serializeJavascript(task.cacheKeys)).then(({data: data}) => step(index, JSON.parse(data)), enqueue) : enqueue();
      });
    }
    exit() {
      this.workers && _workerFarm.end(this.workers);
    }
  };
}, function(module, exports) {
  module.exports = require("../vendor/cacache");
}, function(module, exports) {
  module.exports = require("../vendor/find-cache-dir");
}, function(module, exports) {
  module.exports = require("../vendor/worker-farm");
}, function(module, exports, __webpack_require__) {
  const os = __webpack_require__(2), fs = __webpack_require__(17), isWsl = () => {
    if ("linux" !== process.platform) return !1;
    if (os.release().includes("Microsoft")) return !0;
    try {
      return fs.readFileSync("/proc/version", "utf8").includes("Microsoft");
    } catch (err) {
      return !1;
    }
  };
  process.env.__IS_WSL_TEST__ ? module.exports = isWsl : module.exports = isWsl();
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = void 0;
  var _terser = __webpack_require__(19);
  const minify = options => {
    const {file: file, input: input, inputSourceMap: inputSourceMap, extractComments: extractComments, minify: minifyFn} = options;
    if (minifyFn) return minifyFn({
      [file]: input
    }, inputSourceMap);
    const terserOptions = (({ecma: ecma, warnings: warnings, parse: parse = {}, compress: compress = {}, mangle: mangle, module: module, output: output, toplevel: toplevel, nameCache: nameCache, ie8: ie8, keep_classnames: keep_classnames, keep_fnames: keep_fnames, safari10: safari10} = {}) => ({
      ecma: ecma,
      warnings: warnings,
      parse: Object.assign({}, parse),
      compress: "boolean" == typeof compress ? compress : Object.assign({}, compress),
      mangle: null == mangle || ("boolean" == typeof mangle ? mangle : Object.assign({}, mangle)),
      output: Object.assign({
        shebang: !0,
        comments: !1,
        beautify: !1,
        semicolons: !0
      }, output),
      module: module,
      sourceMap: null,
      toplevel: toplevel,
      nameCache: nameCache,
      ie8: ie8,
      keep_classnames: keep_classnames,
      keep_fnames: keep_fnames,
      safari10: safari10
    }))(options.terserOptions);
    inputSourceMap && (terserOptions.sourceMap = !0);
    const extractedComments = [];
    extractComments && (terserOptions.output.comments = ((options, terserOptions, extractedComments) => {
      const condition = {}, commentsOpts = terserOptions.output.comments;
      return "boolean" == typeof options.extractComments ? (condition.preserve = commentsOpts, 
      condition.extract = /^\**!|@preserve|@license|@cc_on/i) : "string" == typeof options.extractComments || options.extractComments instanceof RegExp || "function" == typeof options.extractComments ? (condition.preserve = commentsOpts, 
      condition.extract = options.extractComments) : Object.prototype.hasOwnProperty.call(options.extractComments, "condition") ? (condition.preserve = commentsOpts, 
      condition.extract = options.extractComments.condition) : (condition.preserve = !1, 
      condition.extract = commentsOpts), [ "preserve", "extract" ].forEach(key => {
        let regexStr, regex;
        switch (typeof condition[key]) {
         case "boolean":
          condition[key] = condition[key] ? () => !0 : () => !1;
          break;

         case "function":
          break;

         case "string":
          if ("all" === condition[key]) {
            condition[key] = () => !0;
            break;
          }
          if ("some" === condition[key]) {
            condition[key] = (astNode, comment) => "comment2" === comment.type && /^\**!|@preserve|@license|@cc_on/i.test(comment.value);
            break;
          }
          regexStr = condition[key], condition[key] = (astNode, comment) => new RegExp(regexStr).test(comment.value);
          break;

         default:
          regex = condition[key], condition[key] = (astNode, comment) => regex.test(comment.value);
        }
      }), (astNode, comment) => {
        if (condition.extract(astNode, comment)) {
          const commentText = "comment2" === comment.type ? `/*${comment.value}*/` : "//" + comment.value;
          extractedComments.includes(commentText) || extractedComments.push(commentText);
        }
        return condition.preserve(astNode, comment);
      };
    })(options, terserOptions, extractedComments));
    const {error: error, map: map, code: code, warnings: warnings} = _terser.minify({
      [file]: input
    }, terserOptions);
    return {
      error: error,
      map: map,
      code: code,
      warnings: warnings,
      extractedComments: extractedComments
    };
  };
  exports.default = minify;
}, function(module, exports) {
  module.exports = require("../vendor/terser");
}, function(module) {
  module.exports = JSON.parse('{"name":"terser-webpack-plugin","version":"1.4.3"}');
} ]);
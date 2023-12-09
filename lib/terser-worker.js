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
  return __webpack_require__(0);
}([ function(module, exports, __webpack_require__) {
  (function(module) {
    var _minify = __webpack_require__(2).default;
    module.exports = (options, callback) => {
      try {
        options = new Function("exports", "require", "__webpack_require__", "module", "__filename", "__dirname", "'use strict'\nreturn " + options)(exports, require, __webpack_require__, module, __filename, __dirname), 
        callback(null, _minify(options));
      } catch (errors) {
        callback(errors);
      }
    };
  }).call(this, __webpack_require__(1)(module));
}, function(module, exports) {
  module.exports = function(module) {
    return module.webpackPolyfill || (module.deprecate = function() {}, module.paths = [], 
    module.children || (module.children = []), Object.defineProperty(module, "loaded", {
      enumerable: !0,
      get: function() {
        return module.l;
      }
    }), Object.defineProperty(module, "id", {
      enumerable: !0,
      get: function() {
        return module.i;
      }
    }), module.webpackPolyfill = 1), module;
  };
}, function(module, exports, __webpack_require__) {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  }), exports.default = void 0;
  var _terser = __webpack_require__(3);
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
} ]);
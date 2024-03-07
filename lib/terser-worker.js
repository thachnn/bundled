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
  return __webpack_require__(0);
})([
// 0
function(module, exports, __webpack_require__) {

__webpack_require__(1)(module);

var _minify = __webpack_require__(2).default;

module.exports = (options, callback) => {
  try {
    options = new Function(
      'exports',
      'require',
      '__webpack_require__',
      'module',
      '__filename',
      '__dirname',
      "'use strict'\nreturn " + options
    )(exports, require, __webpack_require__, module, __filename, __dirname);
    callback(null, _minify(options));
  } catch (errors) {
    callback(errors);
  }
};

},
// 1
function(module) {

module.exports = function(module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function() {};
    module.paths = [];
    module.children || (module.children = []);
    Object.defineProperty(module, 'loaded', { enumerable: true, get: () => module.l });
    Object.defineProperty(module, 'id', { enumerable: true, get: () => module.i });
    module.webpackPolyfill = 1;
  }
  return module;
};

},
// 2
function(module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });
exports.default = void 0;

var _terser = __webpack_require__(3);

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

exports.default = options => {
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

},
// 3
function(module) {

module.exports = require('../vendor/terser');

}
]);

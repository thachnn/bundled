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
  const getOptionsArray = __webpack_require__(1), replace = __webpack_require__(4);
  module.exports = function(source, map) {
    this.cacheable();
    const optionsArray = getOptionsArray(this);
    let newSource = source;
    for (const options of optionsArray) newSource = replace(newSource, options);
    this.callback(null, newSource, map);
  };
}, function(module, exports, __webpack_require__) {
  const {getOptions: getOptions} = __webpack_require__(2), validateOptions = __webpack_require__(3), optionsSchema = {
    type: "object",
    properties: {
      search: {
        anyOf: [ {
          instanceof: "RegExp"
        }, {
          type: "string"
        } ]
      },
      replace: {
        anyOf: [ {
          instanceof: "Function"
        }, {
          type: "string"
        } ]
      },
      flags: {
        type: "string"
      },
      strict: {
        type: "boolean"
      }
    },
    additionalProperties: !1
  }, defaultOptions = {
    search: null,
    replace: null,
    flags: null,
    strict: !1
  };
  module.exports = function(config) {
    const rawOptions = getOptions(config), rawOptionsArray = void 0 !== rawOptions.multiple ? rawOptions.multiple : [ rawOptions ], optionsArray = [];
    for (const optionsIndex in rawOptionsArray) validateOptions(optionsSchema, rawOptionsArray[optionsIndex], "string-replace-loader"), 
    optionsArray[optionsIndex] = Object.assign({}, defaultOptions, rawOptionsArray[optionsIndex]);
    return optionsArray;
  };
}, function(module, exports) {
  module.exports = require("./loader-utils");
}, function(module, exports) {
  module.exports = require("./schema-utils");
}, function(module, exports) {
  module.exports = function(source, options) {
    const {replace: replace, flags: flags, strict: strict} = options;
    let search;
    if (search = options.search instanceof RegExp ? options.search : null !== flags ? new RegExp(options.search, flags) : options.search, 
    strict && (null == search || null == replace)) throw new Error("Replace failed (strict mode) : options.search and options.replace are required");
    const newSource = source.replace(search, replace);
    if (strict && newSource === source) throw new Error("Replace failed (strict mode) : " + options.search + " → " + options.replace);
    return newSource;
  };
} ]);
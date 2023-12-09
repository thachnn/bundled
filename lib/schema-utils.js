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
  const fs = __webpack_require__(1), path = __webpack_require__(2), Ajv = __webpack_require__(3), errors = __webpack_require__(4), keywords = __webpack_require__(6), ValidationError = __webpack_require__(7), ajv = new Ajv({
    allErrors: !0,
    jsonPointers: !0
  });
  errors(ajv), keywords(ajv, [ "instanceof", "typeof" ]);
  module.exports = (schema, options, name) => {
    if ("string" == typeof schema && (schema = fs.readFileSync(path.resolve(schema), "utf8"), 
    schema = JSON.parse(schema)), !ajv.validate(schema, options)) throw new ValidationError(ajv.errors, name);
    return !0;
  };
}, function(module, exports) {
  module.exports = require("fs");
}, function(module, exports) {
  module.exports = require("path");
}, function(module, exports) {
  module.exports = require("../vendor/ajv");
}, function(module, exports, __webpack_require__) {
  module.exports = function(ajv, options) {
    if (!ajv._opts.allErrors) throw new Error("ajv-errors: Ajv option allErrors must be true");
    return ajv._opts.jsonPointers || (console.warn("ajv-errors: Ajv option jsonPointers changed to true"), 
    ajv._opts.jsonPointers = !0), ajv.addKeyword("errorMessage", {
      inline: __webpack_require__(5),
      statements: !0,
      valid: !0,
      errors: "full",
      config: {
        KEYWORD_PROPERTY_PARAMS: {
          required: "missingProperty",
          dependencies: "property"
        },
        options: options || {}
      },
      metaSchema: {
        type: [ "string", "object" ],
        properties: {
          properties: {
            $ref: "#/definitions/stringMap"
          },
          items: {
            $ref: "#/definitions/stringList"
          },
          required: {
            $ref: "#/definitions/stringOrMap"
          },
          dependencies: {
            $ref: "#/definitions/stringOrMap"
          }
        },
        additionalProperties: {
          type: "string"
        },
        definitions: {
          stringMap: {
            type: [ "object" ],
            additionalProperties: {
              type: "string"
            }
          },
          stringOrMap: {
            type: [ "string", "object" ],
            additionalProperties: {
              type: "string"
            }
          },
          stringList: {
            type: [ "array" ],
            items: {
              type: "string"
            }
          }
        }
      }
    }), ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(it, $keyword, $ruleType) {
    var out = " ", $lvl = it.level, $dataLvl = it.dataLevel, $schema = it.schema[$keyword], $schemaPath = it.schemaPath + it.util.getProperty($keyword), $data = (it.errSchemaPath, 
    it.opts.allErrors, "data" + ($dataLvl || ""));
    if (!1 !== it.createErrors) {
      var INTERPOLATION = /\$\{[^\}]+\}/, INTERPOLATION_REPLACE = /\$\{([^\}]+)\}/g, EMPTY_STR = /^\'\'\s*\+\s*|\s*\+\s*\'\'$/g, $config = it.self.getKeyword($keyword).config, $dataPath = "_em_dataPath" + $lvl, $i = "_em_i" + $lvl, $key = "_em_key" + $lvl, $keyProp = "_em_keyProp" + $lvl, $err = "_em_err" + $lvl, $child = "_em_child" + $lvl, $childKeyword = "_em_childKeyword" + $lvl, $matches = "_em_matches" + $lvl, $isArray = "_em_isArray" + $lvl, $errors = "_em_errors" + $lvl, $message = "_em_message" + $lvl, $paramsErrors = "_em_paramsErrors" + $lvl, $propParam = "_em_propParam" + $lvl, $keywordPropParams = "_em_keywordPropParams" + $lvl, $templates = "_em_templates" + $lvl, $errSchemaPathString = it.util.toQuotedString(it.errSchemaPath);
      if (out += " if (errors > 0) { var " + $dataPath + " = (dataPath || '') + " + it.errorPath + "; var " + $i + ", " + $err + ", " + $errors + "; ", 
      "object" == typeof $schema) {
        var $keywordErrors = {}, $keywordPropErrors = {}, $childErrors = {
          properties: {},
          items: {}
        }, $hasKeywordProps = !1, $hasProperties = !1, $hasItems = !1;
        for (var $k in $schema) switch ($k) {
         case "properties":
          for (var $prop in $schema.properties) $hasProperties = !0, $childErrors.properties[$prop] = [];
          break;

         case "items":
          for (var $item = 0; $item < $schema.items.length; $item++) $hasItems = !0, $childErrors.items[$item] = [];
          break;

         default:
          if ("object" == typeof $schema[$k]) for (var $prop in $hasKeywordProps = !0, $keywordPropErrors[$k] = {}, 
          $schema[$k]) $keywordPropErrors[$k][$prop] = []; else $keywordErrors[$k] = [];
        }
        var $keywordErrorsArr = Object.keys($keywordErrors);
        if ($keywordErrorsArr.length) {
          out += " " + $i + " = 0; " + $errors + " = " + JSON.stringify($keywordErrors) + ";  var " + $templates + " = { ";
          var $comma = !1, arr1 = $keywordErrorsArr;
          if (arr1) for (var i1 = -1, l1 = arr1.length - 1; i1 < l1; ) $k = arr1[i1 += 1], 
          INTERPOLATION.test($schema[$k]) && ($comma && (out += ","), out += it.util.toQuotedString($k) + ": " + templateFunc($schema[$k]) + " ", 
          $comma = !0);
          out += " }; while (" + $i + " < errors) { " + $err + " = vErrors[" + $i + "]; if (  " + $err + ".keyword != '" + $keyword + "' ", 
          $config.options.keepErrors && (out += " && !" + $err + ".emUsed "), out += " && " + $err + ".keyword in " + $errors + " && " + $err + ".dataPath == " + $dataPath + " && " + $err + ".schemaPath.indexOf(" + $errSchemaPathString + ") == 0 && /^\\/[^\\/]*$/.test(" + $err + ".schemaPath.slice(" + it.errSchemaPath.length + "))) { " + $errors + "[" + $err + ".keyword].push(" + $err + ");  ", 
          $config.options.keepErrors ? out += " " + $err + ".emUsed = true; " : out += " vErrors.splice(" + $i + ", 1); errors--; ", 
          out += " } else { " + $i + "++; } } ", $config.options.singleError && (out += " var " + $message + " = ''; var " + $paramsErrors + " = []; "), 
          out += " for (var " + $key + " in " + $errors + ") { if (" + $errors + "[" + $key + "].length) { ", 
          $config.options.singleError ? (out += " if (" + $message + ") { " + $message + " += ", 
          "string" == typeof $config.options.singleError ? out += " " + it.util.toQuotedString($config.options.singleError) + " " : out += " '; ' ", 
          out += "; } " + $message + " +=   " + $key + " in " + $templates + " ? " + $templates + "[" + $key + "] () : validate.schema" + $schemaPath + "[" + $key + "]; " + $paramsErrors + " = " + $paramsErrors + ".concat(" + $errors + "[" + $key + "]); } } ") : out += " var " + $message + " =   " + $key + " in " + $templates + " ? " + $templates + "[" + $key + "] () : validate.schema" + $schemaPath + "[" + $key + "]; var " + $paramsErrors + " = " + $errors + "[" + $key + "]; ", 
          out += "  var err = { keyword: '" + $keyword + "' , dataPath: " + $dataPath + " , schemaPath: " + $errSchemaPathString + " + '/" + $keyword + "' , params: { errors: " + $paramsErrors + " } , message: " + $message + " ", 
          it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
          out += " };  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", 
          $config.options.singleError || (out += " } } ");
        }
        if ($hasKeywordProps) {
          out += " " + $i + " = 0; " + $errors + " = " + JSON.stringify($keywordPropErrors) + "; var " + $paramsErrors + ", " + $propParam + "; var " + $keywordPropParams + " = " + JSON.stringify($config.KEYWORD_PROPERTY_PARAMS) + ";  var " + $templates + " = { ";
          $comma = !1;
          var arr2 = Object.keys($keywordPropErrors);
          if (arr2) for (var i2 = -1, l2 = arr2.length - 1; i2 < l2; ) {
            var $keywordMsgs = $schema[$k = arr2[i2 += 1]];
            $comma && (out += ","), out += it.util.toQuotedString($k) + ": { ", $comma = !0;
            var $innerComma = !1, arr3 = Object.keys($keywordMsgs);
            if (arr3) for (var i3 = -1, l3 = arr3.length - 1; i3 < l3; ) $prop = arr3[i3 += 1], 
            INTERPOLATION.test($keywordMsgs[$prop]) && ($innerComma && (out += ","), out += it.util.toQuotedString($prop) + ": " + templateFunc($keywordMsgs[$prop]) + " ", 
            $innerComma = !0);
            out += " } ";
          }
          out += " }; while (" + $i + " < errors) { " + $err + " = vErrors[" + $i + "]; if (  " + $err + ".keyword != '" + $keyword + "' ", 
          $config.options.keepErrors && (out += " && !" + $err + ".emUsed "), out += " && " + $err + ".keyword in " + $errors + " && " + $err + ".dataPath == " + $dataPath + " && " + $err + ".schemaPath.indexOf(" + $errSchemaPathString + ") == 0 && /^\\/[^\\/]*$/.test(" + $err + ".schemaPath.slice(" + it.errSchemaPath.length + "))) { " + $propParam + " = " + $keywordPropParams + "[" + $err + ".keyword]; " + $paramsErrors + " = " + $errors + "[" + $err + ".keyword][" + $err + ".params[" + $propParam + "]]; if (" + $paramsErrors + ") { " + $paramsErrors + ".push(" + $err + ");  ", 
          $config.options.keepErrors ? out += " " + $err + ".emUsed = true; " : out += " vErrors.splice(" + $i + ", 1); errors--; ", 
          out += " } else { " + $i + "++; } } else { " + $i + "++; } } for (var " + $key + " in " + $errors + ") { for (var " + $keyProp + " in " + $errors + "[" + $key + "]) { " + $paramsErrors + " = " + $errors + "[" + $key + "][" + $keyProp + "]; if (" + $paramsErrors + ".length) { var " + $message + " =   " + $key + " in " + $templates + " && " + $keyProp + " in " + $templates + "[" + $key + "] ? " + $templates + "[" + $key + "][" + $keyProp + "] () : validate.schema" + $schemaPath + "[" + $key + "][" + $keyProp + "];  var err = { keyword: '" + $keyword + "' , dataPath: " + $dataPath + " , schemaPath: " + $errSchemaPathString + " + '/" + $keyword + "' , params: { errors: " + $paramsErrors + " } , message: " + $message + " ", 
          it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
          out += " };  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } } ";
        }
        if ($hasProperties || $hasItems) {
          if (out += " var " + $isArray + " = Array.isArray(" + $data + "); if ", $hasProperties && $hasItems) {
            out += " (typeof " + $data + " == 'object') { ";
            var $childProp = "[" + $childKeyword + "]";
            out += " " + $i + " = 0; if (" + $isArray + ") { var " + $childKeyword + " = 'items'; " + $errors + " = " + JSON.stringify($childErrors.items) + ";    ", 
            out += " var " + $templates + " = { ";
            $comma = !1;
            var arr4 = Object.keys($childErrors.items);
            if (arr4) for (var i4 = -1, l4 = arr4.length - 1; i4 < l4; ) $k = arr4[i4 += 1], 
            INTERPOLATION.test($schema.items[$k]) && ($comma && (out += ","), out += it.util.toQuotedString($k) + ": " + templateFunc($schema.items[$k]) + " ", 
            $comma = !0);
            out += " }; } else { var " + $childKeyword + " = 'properties'; " + $errors + " =  " + JSON.stringify($childErrors.properties) + ";    ", 
            out += " var " + $templates + " = { ";
            $comma = !1;
            var arr5 = Object.keys($childErrors.properties);
            if (arr5) for (var i5 = -1, l5 = arr5.length - 1; i5 < l5; ) $k = arr5[i5 += 1], 
            INTERPOLATION.test($schema.properties[$k]) && ($comma && (out += ","), out += it.util.toQuotedString($k) + ": " + templateFunc($schema.properties[$k]) + " ", 
            $comma = !0);
            out += " }; } ";
          } else if ($hasProperties) {
            out += " (typeof " + $data + " == 'object' && !" + $isArray + ") { ";
            $childProp = ".properties";
            out += " " + $i + " = 0; " + $errors + " = " + JSON.stringify($childErrors.properties) + ";  ", 
            out += " var " + $templates + " = { ";
            $comma = !1;
            var arr6 = Object.keys($childErrors.properties);
            if (arr6) for (var i6 = -1, l6 = arr6.length - 1; i6 < l6; ) $k = arr6[i6 += 1], 
            INTERPOLATION.test($schema.properties[$k]) && ($comma && (out += ","), out += it.util.toQuotedString($k) + ": " + templateFunc($schema.properties[$k]) + " ", 
            $comma = !0);
            out += " }; ";
          } else {
            out += " (" + $isArray + ") { ";
            $childProp = ".items";
            out += " " + $i + " = 0; " + $errors + " = " + JSON.stringify($childErrors.items) + ";  ", 
            out += " var " + $templates + " = { ";
            $comma = !1;
            var arr7 = Object.keys($childErrors.items);
            if (arr7) for (var i7 = -1, l7 = arr7.length - 1; i7 < l7; ) $k = arr7[i7 += 1], 
            INTERPOLATION.test($schema.items[$k]) && ($comma && (out += ","), out += it.util.toQuotedString($k) + ": " + templateFunc($schema.items[$k]) + " ", 
            $comma = !0);
            out += " }; ";
          }
          out += " var " + $child + ", " + $matches + "; while (" + $i + " < errors) { " + $err + " = vErrors[" + $i + "]; if (  " + $err + ".keyword != '" + $keyword + "' ", 
          $config.options.keepErrors && (out += " && !" + $err + ".emUsed "), out += " && " + $err + ".dataPath.indexOf(" + $dataPath + ") == 0 && (" + $matches + " = " + $err + ".dataPath.slice(" + $dataPath + ".length).match(/^\\/([^\\/]*)(?:\\/|$)/), " + $child + " = " + $matches + " && " + $matches + "[1].replace(/~1/g, '/').replace(/~0/g, '~') ) !== undefined && " + $child + " in " + $errors + ") { " + $errors + "[" + $child + "].push(" + $err + ");  ", 
          $config.options.keepErrors ? out += " " + $err + ".emUsed = true; " : out += " vErrors.splice(" + $i + ", 1); errors--; ", 
          out += " } else { " + $i + "++; } } for (var " + $key + " in " + $errors + ") { if (" + $errors + "[" + $key + "].length) { var err = { keyword: '" + $keyword + "' , dataPath: " + $dataPath + " + '/' + " + $key + ".replace(/~/g, '~0').replace(/\\//g, '~1') , schemaPath: " + $errSchemaPathString + " + '/" + $keyword + "' , params: { errors: " + $errors + "[" + $key + "] } , message: " + $key + " in " + $templates + " ? " + $templates + "[" + $key + "] () : validate.schema" + $schemaPath + $childProp + "[" + $key + "] ", 
          it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
          out += " };  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } }  }  ";
        }
      }
      var $schemaMessage = "string" == typeof $schema ? $schema : $schema._;
      $schemaMessage && (out += " " + $i + " = 0; " + $errors + " = []; while (" + $i + " < errors) { " + $err + " = vErrors[" + $i + "]; if (  " + $err + ".keyword != '" + $keyword + "' ", 
      $config.options.keepErrors && (out += " && !" + $err + ".emUsed "), out += " && (" + $err + ".dataPath == " + $dataPath + " || (" + $err + ".dataPath.indexOf(" + $dataPath + ") == 0 && " + $err + ".dataPath[" + $dataPath + ".length] == '/')) && " + $err + ".schemaPath.indexOf(" + $errSchemaPathString + ") == 0 && " + $err + ".schemaPath[" + it.errSchemaPath.length + "] == '/') { " + $errors + ".push(" + $err + ");  ", 
      $config.options.keepErrors ? out += " " + $err + ".emUsed = true; " : out += " vErrors.splice(" + $i + ", 1); errors--; ", 
      out += " } else { " + $i + "++; } } if (" + $errors + ".length) { var err = { keyword: '" + $keyword + "' , dataPath: " + $dataPath + " , schemaPath: " + $errSchemaPathString + " + '/" + $keyword + "' , params: { errors: " + $errors + " } , message: " + templateExpr($schemaMessage) + " ", 
      it.opts.verbose && (out += " , schema: " + it.util.toQuotedString($schemaMessage) + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
      out += " };  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } "), 
      out += " }";
    }
    function templateExpr(str) {
      return str = it.util.escapeQuotes(str), INTERPOLATION.test(str) ? ("'" + str.replace(INTERPOLATION_REPLACE, (function($0, $1) {
        return "' + JSON.stringify(" + it.util.getData($1, $dataLvl, it.dataPathArr) + ") + '";
      })) + "'").replace(EMPTY_STR, "") : "'" + str + "'";
    }
    function templateFunc(str) {
      return "function() { return " + templateExpr(str) + "; }";
    }
    return out;
  };
}, function(module, exports) {
  module.exports = require("../vendor/ajv-keywords");
}, function(module, exports, __webpack_require__) {
  class ValidationError extends Error {
    constructor(errors, name) {
      super(), this.name = "ValidationError", this.message = (name || "") + " Invalid Options\n\n", 
      this.errors = errors.map(err => (err.dataPath = err.dataPath.replace(/\//g, "."), 
      err)), this.errors.forEach(err => {
        this.message += `options${err.dataPath} ${err.message}\n`;
      }), Error.captureStackTrace(this, this.constructor);
    }
  }
  module.exports = ValidationError;
} ]);
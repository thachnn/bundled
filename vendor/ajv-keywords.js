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
  return __webpack_require__(2);
}([ function(module, exports, __webpack_require__) {
  module.exports = {
    metaSchemaRef: function(ajv) {
      var defaultMeta = ajv._opts.defaultMeta;
      return "string" == typeof defaultMeta ? {
        $ref: defaultMeta
      } : ajv.getSchema("http://json-schema.org/draft-07/schema") ? {
        $ref: "http://json-schema.org/draft-07/schema"
      } : (console.warn("meta schema not defined"), {});
    }
  };
}, function(module, exports, __webpack_require__) {
  var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i, DATE_TIME_SEPARATOR = /t|\s/i, COMPARE_FORMATS = {
    date: compareDate,
    time: compareTime,
    "date-time": function(dt1, dt2) {
      if (!dt1 || !dt2) return;
      dt1 = dt1.split(DATE_TIME_SEPARATOR), dt2 = dt2.split(DATE_TIME_SEPARATOR);
      var res = compareDate(dt1[0], dt2[0]);
      if (void 0 === res) return;
      return res || compareTime(dt1[1], dt2[1]);
    }
  }, $dataMetaSchema = {
    type: "object",
    required: [ "$data" ],
    properties: {
      $data: {
        type: "string",
        anyOf: [ {
          format: "relative-json-pointer"
        }, {
          format: "json-pointer"
        } ]
      }
    },
    additionalProperties: !1
  };
  function compareDate(d1, d2) {
    if (d1 && d2) return d1 > d2 ? 1 : d1 < d2 ? -1 : d1 === d2 ? 0 : void 0;
  }
  function compareTime(t1, t2) {
    if (t1 && t2 && (t1 = t1.match(TIME), t2 = t2.match(TIME), t1 && t2)) return (t1 = t1[1] + t1[2] + t1[3] + (t1[4] || "")) > (t2 = t2[1] + t2[2] + t2[3] + (t2[4] || "")) ? 1 : t1 < t2 ? -1 : t1 === t2 ? 0 : void 0;
  }
  module.exports = function(minMax) {
    var keyword = "format" + minMax;
    return function defFunc(ajv) {
      return defFunc.definition = {
        type: "string",
        inline: __webpack_require__(17),
        statements: !0,
        errors: "full",
        dependencies: [ "format" ],
        metaSchema: {
          anyOf: [ {
            type: "string"
          }, $dataMetaSchema ]
        }
      }, ajv.addKeyword(keyword, defFunc.definition), ajv.addKeyword("formatExclusive" + minMax, {
        dependencies: [ "format" + minMax ],
        metaSchema: {
          anyOf: [ {
            type: "boolean"
          }, $dataMetaSchema ]
        }
      }), function(ajv) {
        var formats = ajv._formats;
        for (var name in COMPARE_FORMATS) {
          var format = formats[name];
          ("object" != typeof format || format instanceof RegExp || !format.validate) && (format = formats[name] = {
            validate: format
          }), format.compare || (format.compare = COMPARE_FORMATS[name]);
        }
      }(ajv), ajv;
    };
  };
}, function(module, exports, __webpack_require__) {
  var KEYWORDS = __webpack_require__(3);
  function defineKeywords(ajv, keyword) {
    if (Array.isArray(keyword)) {
      for (var i = 0; i < keyword.length; i++) get(keyword[i])(ajv);
      return ajv;
    }
    if (keyword) return get(keyword)(ajv), ajv;
    for (keyword in KEYWORDS) get(keyword)(ajv);
    return ajv;
  }
  function get(keyword) {
    var defFunc = KEYWORDS[keyword];
    if (!defFunc) throw new Error("Unknown keyword " + keyword);
    return defFunc;
  }
  module.exports = defineKeywords, defineKeywords.get = get;
}, function(module, exports, __webpack_require__) {
  module.exports = {
    instanceof: __webpack_require__(4),
    range: __webpack_require__(5),
    regexp: __webpack_require__(6),
    typeof: __webpack_require__(7),
    dynamicDefaults: __webpack_require__(8),
    allRequired: __webpack_require__(9),
    anyRequired: __webpack_require__(10),
    oneRequired: __webpack_require__(11),
    prohibited: __webpack_require__(12),
    uniqueItemProperties: __webpack_require__(13),
    deepProperties: __webpack_require__(14),
    deepRequired: __webpack_require__(15),
    formatMinimum: __webpack_require__(16),
    formatMaximum: __webpack_require__(18),
    patternRequired: __webpack_require__(19),
    switch: __webpack_require__(21),
    select: __webpack_require__(23),
    transform: __webpack_require__(24)
  };
}, function(module, exports, __webpack_require__) {
  var CONSTRUCTORS = {
    Object: Object,
    Array: Array,
    Function: Function,
    Number: Number,
    String: String,
    Date: Date,
    RegExp: RegExp
  };
  module.exports = function defFunc(ajv) {
    return "undefined" != typeof Buffer && (CONSTRUCTORS.Buffer = Buffer), "undefined" != typeof Promise && (CONSTRUCTORS.Promise = Promise), 
    defFunc.definition = {
      compile: function(schema) {
        if ("string" == typeof schema) {
          var Constructor = getConstructor(schema);
          return function(data) {
            return data instanceof Constructor;
          };
        }
        var constructors = schema.map(getConstructor);
        return function(data) {
          for (var i = 0; i < constructors.length; i++) if (data instanceof constructors[i]) return !0;
          return !1;
        };
      },
      CONSTRUCTORS: CONSTRUCTORS,
      metaSchema: {
        anyOf: [ {
          type: "string"
        }, {
          type: "array",
          items: {
            type: "string"
          }
        } ]
      }
    }, ajv.addKeyword("instanceof", defFunc.definition), ajv;
    function getConstructor(c) {
      var Constructor = CONSTRUCTORS[c];
      if (Constructor) return Constructor;
      throw new Error('invalid "instanceof" keyword value ' + c);
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "number",
      macro: function(schema, parentSchema) {
        var min = schema[0], max = schema[1], exclusive = parentSchema.exclusiveRange;
        return function(min, max, exclusive) {
          if (void 0 !== exclusive && "boolean" != typeof exclusive) throw new Error("Invalid schema for exclusiveRange keyword, should be boolean");
          if (min > max || exclusive && min == max) throw new Error("There are no numbers in range");
        }(min, max, exclusive), !0 === exclusive ? {
          exclusiveMinimum: min,
          exclusiveMaximum: max
        } : {
          minimum: min,
          maximum: max
        };
      },
      metaSchema: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: {
          type: "number"
        }
      }
    }, ajv.addKeyword("range", defFunc.definition), ajv.addKeyword("exclusiveRange"), 
    ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "string",
      inline: function(it, keyword, schema) {
        return function() {
          try {
            if ("object" == typeof schema) return new RegExp(schema.pattern, schema.flags);
            var rx = schema.match(/^\/(.*)\/([gimuy]*)$/);
            if (rx) return new RegExp(rx[1], rx[2]);
            throw new Error("cannot parse string into RegExp");
          } catch (e) {
            throw console.error("regular expression", schema, "is invalid"), e;
          }
        }() + ".test(data" + (it.dataLevel || "") + ")";
      },
      metaSchema: {
        type: [ "string", "object" ],
        properties: {
          pattern: {
            type: "string"
          },
          flags: {
            type: "string"
          }
        },
        required: [ "pattern" ],
        additionalProperties: !1
      }
    }, ajv.addKeyword("regexp", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  var KNOWN_TYPES = [ "undefined", "string", "number", "object", "function", "boolean", "symbol" ];
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      inline: function(it, keyword, schema) {
        var data = "data" + (it.dataLevel || "");
        return "string" == typeof schema ? "typeof " + data + ' == "' + schema + '"' : (schema = "validate.schema" + it.schemaPath + "." + keyword) + ".indexOf(typeof " + data + ") >= 0";
      },
      metaSchema: {
        anyOf: [ {
          type: "string",
          enum: KNOWN_TYPES
        }, {
          type: "array",
          items: {
            type: "string",
            enum: KNOWN_TYPES
          }
        } ]
      }
    }, ajv.addKeyword("typeof", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  var sequences = {}, DEFAULTS = {
    timestamp: function() {
      return Date.now();
    },
    datetime: function() {
      return (new Date).toISOString();
    },
    date: function() {
      return (new Date).toISOString().slice(0, 10);
    },
    time: function() {
      return (new Date).toISOString().slice(11);
    },
    random: function() {
      return Math.random();
    },
    randomint: function(args) {
      var limit = args && args.max || 2;
      return function() {
        return Math.floor(Math.random() * limit);
      };
    },
    seq: function(args) {
      var name = args && args.name || "";
      return sequences[name] = sequences[name] || 0, function() {
        return sequences[name]++;
      };
    }
  };
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      compile: function(schema, parentSchema, it) {
        var funcs = {};
        for (var key in schema) {
          var d = schema[key], func = getDefault("string" == typeof d ? d : d.func);
          funcs[key] = func.length ? func(d.args) : func;
        }
        return it.opts.useDefaults && !it.compositeRule ? function(data) {
          for (var prop in schema) void 0 !== data[prop] && ("empty" != it.opts.useDefaults || null !== data[prop] && "" !== data[prop]) || (data[prop] = funcs[prop]());
          return !0;
        } : function() {
          return !0;
        };
      },
      DEFAULTS: DEFAULTS,
      metaSchema: {
        type: "object",
        additionalProperties: {
          type: [ "string", "object" ],
          additionalProperties: !1,
          required: [ "func", "args" ],
          properties: {
            func: {
              type: "string"
            },
            args: {
              type: "object"
            }
          }
        }
      }
    }, ajv.addKeyword("dynamicDefaults", defFunc.definition), ajv;
    function getDefault(d) {
      var def = DEFAULTS[d];
      if (def) return def;
      throw new Error('invalid "dynamicDefaults" keyword property value: ' + d);
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      macro: function(schema, parentSchema) {
        if (!schema) return !0;
        var properties = Object.keys(parentSchema.properties);
        return 0 == properties.length || {
          required: properties
        };
      },
      metaSchema: {
        type: "boolean"
      },
      dependencies: [ "properties" ]
    }, ajv.addKeyword("allRequired", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      macro: function(schema) {
        return 0 == schema.length || (1 == schema.length ? {
          required: schema
        } : {
          anyOf: schema.map((function(prop) {
            return {
              required: [ prop ]
            };
          }))
        });
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }, ajv.addKeyword("anyRequired", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      macro: function(schema) {
        return 0 == schema.length || (1 == schema.length ? {
          required: schema
        } : {
          oneOf: schema.map((function(prop) {
            return {
              required: [ prop ]
            };
          }))
        });
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }, ajv.addKeyword("oneRequired", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      macro: function(schema) {
        return 0 == schema.length || (1 == schema.length ? {
          not: {
            required: schema
          }
        } : {
          not: {
            anyOf: schema.map((function(prop) {
              return {
                required: [ prop ]
              };
            }))
          }
        });
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }, ajv.addKeyword("prohibited", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  var SCALAR_TYPES = [ "number", "integer", "string", "boolean", "null" ];
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "array",
      compile: function(keys, parentSchema, it) {
        var equal = it.util.equal, scalar = function(keys, schema) {
          return keys.map((function(key) {
            var properties = schema.items && schema.items.properties, propType = properties && properties[key] && properties[key].type;
            return Array.isArray(propType) ? propType.indexOf("object") < 0 && propType.indexOf("array") < 0 : SCALAR_TYPES.indexOf(propType) >= 0;
          }));
        }(keys, parentSchema);
        return function(data) {
          if (data.length > 1) for (var k = 0; k < keys.length; k++) {
            var i, key = keys[k];
            if (scalar[k]) {
              var hash = {};
              for (i = data.length; i--; ) if (data[i] && "object" == typeof data[i]) {
                var prop = data[i][key];
                if (!prop || "object" != typeof prop) {
                  if ("string" == typeof prop && (prop = '"' + prop), hash[prop]) return !1;
                  hash[prop] = !0;
                }
              }
            } else for (i = data.length; i--; ) if (data[i] && "object" == typeof data[i]) for (var j = i; j--; ) if (data[j] && "object" == typeof data[j] && equal(data[i][key], data[j][key])) return !1;
          }
          return !0;
        };
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string"
        }
      }
    }, ajv.addKeyword("uniqueItemProperties", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(0);
  function getSchema(jsonPointer, schema) {
    for (var segments = jsonPointer.split("/"), rootSchema = {}, pointerSchema = rootSchema, i = 1; i < segments.length; i++) {
      var segment = segments[i], isLast = i == segments.length - 1;
      segment = segment.replace(/~1/g, "/").replace(/~0/g, "~");
      var properties = pointerSchema.properties = {}, items = void 0;
      if (/[0-9]+/.test(segment)) {
        var count = +segment;
        for (items = pointerSchema.items = []; count--; ) items.push({});
      }
      pointerSchema = isLast ? schema : {}, properties[segment] = pointerSchema, items && items.push(pointerSchema);
    }
    return rootSchema;
  }
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      macro: function(schema) {
        var schemas = [];
        for (var pointer in schema) schemas.push(getSchema(pointer, schema[pointer]));
        return {
          allOf: schemas
        };
      },
      metaSchema: {
        type: "object",
        propertyNames: {
          type: "string",
          format: "json-pointer"
        },
        additionalProperties: util.metaSchemaRef(ajv)
      }
    }, ajv.addKeyword("deepProperties", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  function getData(jsonPointer, lvl) {
    var data = "data" + (lvl || "");
    if (!jsonPointer) return data;
    for (var key, expr = data, segments = jsonPointer.split("/"), i = 1; i < segments.length; i++) {
      var segment = segments[i];
      expr += " && " + (data += (key = segment.replace(/~1/g, "/").replace(/~0/g, "~"), 
      INTEGER.test(key) ? "[" + key + "]" : IDENTIFIER.test(key) ? "." + key : "['" + key.replace(SINGLE_QUOTE, "\\$&") + "']"));
    }
    return expr;
  }
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      inline: function(it, keyword, schema) {
        for (var expr = "", i = 0; i < schema.length; i++) i && (expr += " && "), expr += "(" + getData(schema[i], it.dataLevel) + " !== undefined)";
        return expr;
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string",
          format: "json-pointer"
        }
      }
    }, ajv.addKeyword("deepRequired", defFunc.definition), ajv;
  };
  var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i, INTEGER = /^[0-9]+$/, SINGLE_QUOTE = /'|\\/g;
}, function(module, exports, __webpack_require__) {
  module.exports = __webpack_require__(1)("Minimum");
}, function(module, exports, __webpack_require__) {
  module.exports = function(it, $keyword, $ruleType) {
    var out = " ", $lvl = it.level, $dataLvl = it.dataLevel, $schema = it.schema[$keyword], $schemaPath = it.schemaPath + it.util.getProperty($keyword), $errSchemaPath = it.errSchemaPath + "/" + $keyword, $breakOnError = !it.opts.allErrors, $data = "data" + ($dataLvl || ""), $valid = "valid" + $lvl;
    if (out += "var " + $valid + " = undefined;", !1 === it.opts.format) return out += " " + $valid + " = true; ";
    var $schemaFormat = it.schema.format, $isDataFormat = it.opts.$data && $schemaFormat.$data, $closingBraces = "";
    if ($isDataFormat) {
      out += " var " + ($format = "format" + $lvl) + " = formats[" + it.util.getData($schemaFormat.$data, $dataLvl, it.dataPathArr) + "] , " + ($compare = "compare" + $lvl) + " = " + $format + " && " + $format + ".compare;";
    } else {
      var $format;
      if (!($format = it.formats[$schemaFormat]) || !$format.compare) return out += "  " + $valid + " = true; ";
      var $compare = "formats" + it.util.getProperty($schemaFormat) + ".compare";
    }
    var $schemaValue, $isMax = "formatMaximum" == $keyword, $exclusiveKeyword = "formatExclusive" + ($isMax ? "Maximum" : "Minimum"), $schemaExcl = it.schema[$exclusiveKeyword], $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data, $op = $isMax ? "<" : ">", $result = "result" + $lvl, $isData = it.opts.$data && $schema && $schema.$data;
    if ($isData ? (out += " var schema" + $lvl + " = " + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + "; ", 
    $schemaValue = "schema" + $lvl) : $schemaValue = $schema, $isDataExcl) {
      var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr), $exclusive = "exclusive" + $lvl, $opStr = "' + " + ($opExpr = "op" + $lvl) + " + '";
      out += " var schemaExcl" + $lvl + " = " + $schemaValueExcl + "; ", out += " if (typeof " + ($schemaValueExcl = "schemaExcl" + $lvl) + " != 'boolean' && " + $schemaValueExcl + " !== undefined) { " + $valid + " = false; ";
      var $errorKeyword = $exclusiveKeyword;
      ($$outStack = $$outStack || []).push(out), out = "", !1 !== it.createErrors ? (out += " { keyword: '" + ($errorKeyword || "_formatExclusiveLimit") + "' , dataPath: (dataPath || '') + " + it.errorPath + " , schemaPath: " + it.util.toQuotedString($errSchemaPath) + " , params: {} ", 
      !1 !== it.opts.messages && (out += " , message: '" + $exclusiveKeyword + " should be boolean' "), 
      it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
      out += " } ") : out += " {} ";
      var __err = out;
      out = $$outStack.pop(), !it.compositeRule && $breakOnError ? it.async ? out += " throw new ValidationError([" + __err + "]); " : out += " validate.errors = [" + __err + "]; return false; " : out += " var err = " + __err + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", 
      out += " }  ", $breakOnError && ($closingBraces += "}", out += " else { "), $isData && (out += " if (" + $schemaValue + " === undefined) " + $valid + " = true; else if (typeof " + $schemaValue + " != 'string') " + $valid + " = false; else { ", 
      $closingBraces += "}"), $isDataFormat && (out += " if (!" + $compare + ") " + $valid + " = true; else { ", 
      $closingBraces += "}"), out += " var " + $result + " = " + $compare + "(" + $data + ",  ", 
      out += $isData ? "" + $schemaValue : "" + it.util.toQuotedString($schema), out += " ); if (" + $result + " === undefined) " + $valid + " = false; var " + $exclusive + " = " + $schemaValueExcl + " === true; if (" + $valid + " === undefined) { " + $valid + " = " + $exclusive + " ? " + $result + " " + $op + " 0 : " + $result + " " + $op + "= 0; } if (!" + $valid + ") var op" + $lvl + " = " + $exclusive + " ? '" + $op + "' : '" + $op + "=';";
    } else {
      $opStr = $op;
      ($exclusive = !0 === $schemaExcl) || ($opStr += "=");
      var $opExpr = "'" + $opStr + "'";
      $isData && (out += " if (" + $schemaValue + " === undefined) " + $valid + " = true; else if (typeof " + $schemaValue + " != 'string') " + $valid + " = false; else { ", 
      $closingBraces += "}"), $isDataFormat && (out += " if (!" + $compare + ") " + $valid + " = true; else { ", 
      $closingBraces += "}"), out += " var " + $result + " = " + $compare + "(" + $data + ",  ", 
      out += $isData ? "" + $schemaValue : "" + it.util.toQuotedString($schema), out += " ); if (" + $result + " === undefined) " + $valid + " = false; if (" + $valid + " === undefined) " + $valid + " = " + $result + " " + $op, 
      $exclusive || (out += "="), out += " 0;";
    }
    out += $closingBraces + "if (!" + $valid + ") { ";
    var $$outStack;
    $errorKeyword = $keyword;
    ($$outStack = $$outStack || []).push(out), out = "", !1 !== it.createErrors ? (out += " { keyword: '" + ($errorKeyword || "_formatLimit") + "' , dataPath: (dataPath || '') + " + it.errorPath + " , schemaPath: " + it.util.toQuotedString($errSchemaPath) + " , params: { comparison: " + $opExpr + ", limit:  ", 
    out += $isData ? "" + $schemaValue : "" + it.util.toQuotedString($schema), out += " , exclusive: " + $exclusive + " } ", 
    !1 !== it.opts.messages && (out += " , message: 'should be " + $opStr + ' "', out += $isData ? "' + " + $schemaValue + " + '" : "" + it.util.escapeQuotes($schema), 
    out += "\"' "), it.opts.verbose && (out += " , schema:  ", out += $isData ? "validate.schema" + $schemaPath : "" + it.util.toQuotedString($schema), 
    out += "         , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
    out += " } ") : out += " {} ";
    __err = out;
    return out = $$outStack.pop(), !it.compositeRule && $breakOnError ? it.async ? out += " throw new ValidationError([" + __err + "]); " : out += " validate.errors = [" + __err + "]; return false; " : out += " var err = " + __err + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ", 
    out += "}";
  };
}, function(module, exports, __webpack_require__) {
  module.exports = __webpack_require__(1)("Maximum");
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    return defFunc.definition = {
      type: "object",
      inline: __webpack_require__(20),
      statements: !0,
      errors: "full",
      metaSchema: {
        type: "array",
        items: {
          type: "string",
          format: "regex"
        },
        uniqueItems: !0
      }
    }, ajv.addKeyword("patternRequired", defFunc.definition), ajv;
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(it, $keyword, $ruleType) {
    var out = " ", $lvl = it.level, $dataLvl = it.dataLevel, $schema = it.schema[$keyword], $schemaPath = it.schemaPath + it.util.getProperty($keyword), $errSchemaPath = it.errSchemaPath + "/" + $keyword, $breakOnError = !it.opts.allErrors, $data = "data" + ($dataLvl || ""), $valid = "valid" + $lvl, $key = "key" + $lvl, $idx = "idx" + $lvl, $matched = "patternMatched" + $lvl, $dataProperties = "dataProperties" + $lvl, $closingBraces = "", $ownProperties = it.opts.ownProperties;
    out += "var " + $valid + " = true;", $ownProperties && (out += " var " + $dataProperties + " = undefined;");
    var arr1 = $schema;
    if (arr1) for (var $pProperty, i1 = -1, l1 = arr1.length - 1; i1 < l1; ) {
      $pProperty = arr1[i1 += 1], out += " var " + $matched + " = false;  ", out += $ownProperties ? " " + $dataProperties + " = " + $dataProperties + " || Object.keys(" + $data + "); for (var " + $idx + "=0; " + $idx + "<" + $dataProperties + ".length; " + $idx + "++) { var " + $key + " = " + $dataProperties + "[" + $idx + "]; " : " for (var " + $key + " in " + $data + ") { ", 
      out += " " + $matched + " = " + it.usePattern($pProperty) + ".test(" + $key + "); if (" + $matched + ") break; } ";
      var $missingPattern = it.util.escapeQuotes($pProperty);
      out += " if (!" + $matched + ") { " + $valid + " = false;  var err =   ", !1 !== it.createErrors ? (out += " { keyword: 'patternRequired' , dataPath: (dataPath || '') + " + it.errorPath + " , schemaPath: " + it.util.toQuotedString($errSchemaPath) + " , params: { missingPattern: '" + $missingPattern + "' } ", 
      !1 !== it.opts.messages && (out += " , message: 'should have property matching pattern \\'" + $missingPattern + "\\'' "), 
      it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
      out += " } ") : out += " {} ", out += ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; }   ", 
      $breakOnError && ($closingBraces += "}", out += " else { ");
    }
    return out += "" + $closingBraces;
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(0);
  module.exports = function defFunc(ajv) {
    if (!ajv.RULES.keywords.switch || !ajv.RULES.keywords.if) {
      var metaSchemaRef = util.metaSchemaRef(ajv);
      return defFunc.definition = {
        inline: __webpack_require__(22),
        statements: !0,
        errors: "full",
        metaSchema: {
          type: "array",
          items: {
            required: [ "then" ],
            properties: {
              if: metaSchemaRef,
              then: {
                anyOf: [ {
                  type: "boolean"
                }, metaSchemaRef ]
              },
              continue: {
                type: "boolean"
              }
            },
            additionalProperties: !1,
            dependencies: {
              continue: [ "if" ]
            }
          }
        }
      }, ajv.addKeyword("switch", defFunc.definition), ajv;
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function(it, $keyword, $ruleType) {
    var out = " ", $lvl = it.level, $dataLvl = it.dataLevel, $schema = it.schema[$keyword], $schemaPath = it.schemaPath + it.util.getProperty($keyword), $errSchemaPath = it.errSchemaPath + "/" + $keyword, $breakOnError = !it.opts.allErrors, $data = "data" + ($dataLvl || ""), $valid = "valid" + $lvl, $errs = "errs__" + $lvl, $it = it.util.copy(it), $closingBraces = "";
    $it.level++;
    var $shouldContinue, $nextValid = "valid" + $it.level, $ifPassed = "ifPassed" + it.level, $currentBaseId = $it.baseId;
    out += "var " + $ifPassed + ";";
    var arr1 = $schema;
    if (arr1) for (var $sch, $caseIndex = -1, l1 = arr1.length - 1; $caseIndex < l1; ) {
      if ($sch = arr1[$caseIndex += 1], $caseIndex && !$shouldContinue && (out += " if (!" + $ifPassed + ") { ", 
      $closingBraces += "}"), $sch.if && (it.opts.strictKeywords ? "object" == typeof $sch.if && Object.keys($sch.if).length > 0 : it.util.schemaHasRules($sch.if, it.RULES.all))) {
        out += " var " + $errs + " = errors;   ";
        var $wasComposite = it.compositeRule;
        if (it.compositeRule = $it.compositeRule = !0, $it.createErrors = !1, $it.schema = $sch.if, 
        $it.schemaPath = $schemaPath + "[" + $caseIndex + "].if", $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/if", 
        out += "  " + it.validate($it) + " ", $it.baseId = $currentBaseId, $it.createErrors = !0, 
        it.compositeRule = $it.compositeRule = $wasComposite, out += " " + $ifPassed + " = " + $nextValid + "; if (" + $ifPassed + ") {  ", 
        "boolean" == typeof $sch.then) {
          if (!1 === $sch.then) {
            ($$outStack = $$outStack || []).push(out), out = "", !1 !== it.createErrors ? (out += " { keyword: 'switch' , dataPath: (dataPath || '') + " + it.errorPath + " , schemaPath: " + it.util.toQuotedString($errSchemaPath) + " , params: { caseIndex: " + $caseIndex + " } ", 
            !1 !== it.opts.messages && (out += " , message: 'should pass \"switch\" keyword validation' "), 
            it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
            out += " } ") : out += " {} ";
            var __err = out;
            out = $$outStack.pop(), !it.compositeRule && $breakOnError ? it.async ? out += " throw new ValidationError([" + __err + "]); " : out += " validate.errors = [" + __err + "]; return false; " : out += " var err = " + __err + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
          }
          out += " var " + $nextValid + " = " + $sch.then + "; ";
        } else $it.schema = $sch.then, $it.schemaPath = $schemaPath + "[" + $caseIndex + "].then", 
        $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/then", out += "  " + it.validate($it) + " ", 
        $it.baseId = $currentBaseId;
        out += "  } else {  errors = " + $errs + "; if (vErrors !== null) { if (" + $errs + ") vErrors.length = " + $errs + "; else vErrors = null; } } ";
      } else if (out += " " + $ifPassed + " = true;  ", "boolean" == typeof $sch.then) {
        if (!1 === $sch.then) {
          var $$outStack;
          ($$outStack = $$outStack || []).push(out), out = "", !1 !== it.createErrors ? (out += " { keyword: 'switch' , dataPath: (dataPath || '') + " + it.errorPath + " , schemaPath: " + it.util.toQuotedString($errSchemaPath) + " , params: { caseIndex: " + $caseIndex + " } ", 
          !1 !== it.opts.messages && (out += " , message: 'should pass \"switch\" keyword validation' "), 
          it.opts.verbose && (out += " , schema: validate.schema" + $schemaPath + " , parentSchema: validate.schema" + it.schemaPath + " , data: " + $data + " "), 
          out += " } ") : out += " {} ";
          __err = out;
          out = $$outStack.pop(), !it.compositeRule && $breakOnError ? it.async ? out += " throw new ValidationError([" + __err + "]); " : out += " validate.errors = [" + __err + "]; return false; " : out += " var err = " + __err + ";  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ";
        }
        out += " var " + $nextValid + " = " + $sch.then + "; ";
      } else $it.schema = $sch.then, $it.schemaPath = $schemaPath + "[" + $caseIndex + "].then", 
      $it.errSchemaPath = $errSchemaPath + "/" + $caseIndex + "/then", out += "  " + it.validate($it) + " ", 
      $it.baseId = $currentBaseId;
      $shouldContinue = $sch.continue;
    }
    return out += $closingBraces + "var " + $valid + " = " + $nextValid + ";";
  };
}, function(module, exports, __webpack_require__) {
  var util = __webpack_require__(0);
  module.exports = function defFunc(ajv) {
    if (!ajv._opts.$data) return console.warn("keyword select requires $data option"), 
    ajv;
    var metaSchemaRef = util.metaSchemaRef(ajv), compiledCaseSchemas = [];
    return defFunc.definition = {
      validate: function v(schema, data, parentSchema) {
        if (void 0 === parentSchema.selectCases) throw new Error('keyword "selectCases" is absent');
        var compiled = getCompiledSchemas(parentSchema, !1), validate = compiled.cases[schema];
        if (void 0 === validate && (validate = compiled.default), "boolean" == typeof validate) return validate;
        var valid = validate(data);
        return valid || (v.errors = validate.errors), valid;
      },
      $data: !0,
      metaSchema: {
        type: [ "string", "number", "boolean", "null" ]
      }
    }, ajv.addKeyword("select", defFunc.definition), ajv.addKeyword("selectCases", {
      compile: function(schemas, parentSchema) {
        var compiled = getCompiledSchemas(parentSchema);
        for (var value in schemas) compiled.cases[value] = compileOrBoolean(schemas[value]);
        return function() {
          return !0;
        };
      },
      valid: !0,
      metaSchema: {
        type: "object",
        additionalProperties: metaSchemaRef
      }
    }), ajv.addKeyword("selectDefault", {
      compile: function(schema, parentSchema) {
        return getCompiledSchemas(parentSchema).default = compileOrBoolean(schema), function() {
          return !0;
        };
      },
      valid: !0,
      metaSchema: metaSchemaRef
    }), ajv;
    function getCompiledSchemas(parentSchema, create) {
      var compiled;
      return compiledCaseSchemas.some((function(c) {
        if (c.parentSchema === parentSchema) return compiled = c, !0;
      })), compiled || !1 === create || (compiled = {
        parentSchema: parentSchema,
        cases: {},
        default: !0
      }, compiledCaseSchemas.push(compiled)), compiled;
    }
    function compileOrBoolean(schema) {
      return "boolean" == typeof schema ? schema : ajv.compile(schema);
    }
  };
}, function(module, exports, __webpack_require__) {
  module.exports = function defFunc(ajv) {
    var transform = {
      trimLeft: function(value) {
        return value.replace(/^[\s]+/, "");
      },
      trimRight: function(value) {
        return value.replace(/[\s]+$/, "");
      },
      trim: function(value) {
        return value.trim();
      },
      toLowerCase: function(value) {
        return value.toLowerCase();
      },
      toUpperCase: function(value) {
        return value.toUpperCase();
      },
      toEnumCase: function(value, cfg) {
        return cfg.hash[makeHashTableKey(value)] || value;
      }
    };
    return defFunc.definition = {
      type: "string",
      errors: !1,
      modifying: !0,
      valid: !0,
      compile: function(schema, parentSchema) {
        var cfg;
        if (-1 !== schema.indexOf("toEnumCase")) {
          if (cfg = {
            hash: {}
          }, !parentSchema.enum) throw new Error('Missing enum. To use `transform:["toEnumCase"]`, `enum:[...]` is required.');
          for (var i = parentSchema.enum.length; i--; i) {
            var v = parentSchema.enum[i];
            if ("string" == typeof v) {
              var k = makeHashTableKey(v);
              if (cfg.hash[k]) throw new Error('Invalid enum uniqueness. To use `transform:["toEnumCase"]`, all values must be unique when case insensitive.');
              cfg.hash[k] = v;
            }
          }
        }
        return function(data, dataPath, object, key) {
          if (object) {
            for (var j = 0, l = schema.length; j < l; j++) data = transform[schema[j]](data, cfg);
            object[key] = data;
          }
        };
      },
      metaSchema: {
        type: "array",
        items: {
          type: "string",
          enum: [ "trimLeft", "trimRight", "trim", "toLowerCase", "toUpperCase", "toEnumCase" ]
        }
      }
    }, ajv.addKeyword("transform", defFunc.definition), ajv;
    function makeHashTableKey(value) {
      return value.toLowerCase();
    }
  };
} ]);
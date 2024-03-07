'use strict';

module.exports = (function (modules) {
  var installedModules = {};

  function __webpack_require__(moduleId) {
    var module = installedModules[moduleId];
    if (module) return module.exports;

    installedModules[moduleId] = module = {i: moduleId, l: false, exports: {}};
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;
    return module.exports;
  }

  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  return __webpack_require__(2);
})([
// 0
function (module) {

module.exports = {metaSchemaRef: metaSchemaRef};

var META_SCHEMA_ID = 'http://json-schema.org/draft-07/schema';

function metaSchemaRef(ajv) {
  var defaultMeta = ajv._opts.defaultMeta;
  if (typeof defaultMeta == 'string') return {$ref: defaultMeta};
  if (ajv.getSchema(META_SCHEMA_ID)) return {$ref: META_SCHEMA_ID};
  console.warn('meta schema not defined');
  return {};
}

},
// 1
function (module, exports, __webpack_require__) {

var TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d:\d\d)?$/i,
  DATE_TIME_SEPARATOR = /t|\s/i,

  COMPARE_FORMATS = {date: compareDate, time: compareTime, 'date-time': compareDateTime};

var $dataMetaSchema = {
  type: 'object',
  required: ['$data'],
  properties: {
    $data: {
      type: 'string',
      anyOf: [{format: 'relative-json-pointer'}, {format: 'json-pointer'}]
    }
  },
  additionalProperties: false
};

module.exports = function (minMax) {
  var keyword = 'format' + minMax;
  return function defFunc(ajv) {
    defFunc.definition = {
      type: 'string',
      inline: __webpack_require__(17),
      statements: true,
      errors: 'full',
      dependencies: ['format'],
      metaSchema: {anyOf: [{type: 'string'}, $dataMetaSchema]}
    };

    ajv.addKeyword(keyword, defFunc.definition);
    ajv.addKeyword('formatExclusive' + minMax, {
      dependencies: ['format' + minMax],
      metaSchema: {anyOf: [{type: 'boolean'}, $dataMetaSchema]}
    });
    extendFormats(ajv);
    return ajv;
  };
};

function extendFormats(ajv) {
  var formats = ajv._formats;
  for (var name in COMPARE_FORMATS) {
    var format = formats[name];
    if (typeof format != 'object' || format instanceof RegExp || !format.validate)
      format = formats[name] = {validate: format};
    format.compare || (format.compare = COMPARE_FORMATS[name]);
  }
}

function compareDate(d1, d2) {
  if (d1 && d2) return d1 > d2 ? 1 : d1 < d2 ? -1 : d1 === d2 ? 0 : void 0;
}

function compareTime(t1, t2) {
  if (!t1 || !t2) return;
  t1 = t1.match(TIME);
  t2 = t2.match(TIME);
  if (!t1 || !t2) return;
  t1 = t1[1] + t1[2] + t1[3] + (t1[4] || '');
  t2 = t2[1] + t2[2] + t2[3] + (t2[4] || '');
  return t1 > t2 ? 1 : t1 < t2 ? -1 : t1 === t2 ? 0 : void 0;
}

function compareDateTime(dt1, dt2) {
  if (!dt1 || !dt2) return;
  dt1 = dt1.split(DATE_TIME_SEPARATOR);
  dt2 = dt2.split(DATE_TIME_SEPARATOR);
  var res = compareDate(dt1[0], dt2[0]);
  if (res !== void 0) return res || compareTime(dt1[1], dt2[1]);
}

},
// 2
function (module, exports, __webpack_require__) {

var KEYWORDS = __webpack_require__(3);

module.exports = defineKeywords;

function defineKeywords(ajv, keyword) {
  if (Array.isArray(keyword)) for (var i = 0; i < keyword.length; i++) get(keyword[i])(ajv);
  else if (keyword) get(keyword)(ajv);
  else for (keyword in KEYWORDS) get(keyword)(ajv);
  return ajv;
}

defineKeywords.get = get;

function get(keyword) {
  var defFunc = KEYWORDS[keyword];
  if (!defFunc) throw new Error('Unknown keyword ' + keyword);
  return defFunc;
}

},
// 3
function (module, exports, __webpack_require__) {

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

},
// 4
function (module) {

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
  if (typeof Buffer != 'undefined') CONSTRUCTORS.Buffer = Buffer;

  if (typeof Promise != 'undefined') CONSTRUCTORS.Promise = Promise;

  defFunc.definition = {
    compile: function (schema) {
      if (typeof schema == 'string') {
        var Constructor = getConstructor(schema);
        return function (data) {
          return data instanceof Constructor;
        };
      }

      var constructors = schema.map(getConstructor);
      return function (data) {
        for (var i = 0; i < constructors.length; i++)
          if (data instanceof constructors[i]) return true;
        return false;
      };
    },
    CONSTRUCTORS: CONSTRUCTORS,
    metaSchema: {
      anyOf: [{type: 'string'}, {type: 'array', items: {type: 'string'}}]
    }
  };

  ajv.addKeyword('instanceof', defFunc.definition);
  return ajv;

  function getConstructor(c) {
    var Constructor = CONSTRUCTORS[c];
    if (Constructor) return Constructor;
    throw new Error('invalid "instanceof" keyword value ' + c);
  }
};

},
// 5
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'number',
    macro: function (schema, parentSchema) {
      var min = schema[0],
        max = schema[1],
        exclusive = parentSchema.exclusiveRange;

      validateRangeSchema(min, max, exclusive);

      return exclusive === true
        ? {exclusiveMinimum: min, exclusiveMaximum: max}
        : {minimum: min, maximum: max};
    },
    metaSchema: {type: 'array', minItems: 2, maxItems: 2, items: {type: 'number'}}
  };

  ajv.addKeyword('range', defFunc.definition);
  ajv.addKeyword('exclusiveRange');
  return ajv;

  function validateRangeSchema(min, max, exclusive) {
    if (exclusive !== void 0 && typeof exclusive != 'boolean')
      throw new Error('Invalid schema for exclusiveRange keyword, should be boolean');

    if (min > max || (exclusive && min == max)) throw new Error('There are no numbers in range');
  }
};

},
// 6
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'string',
    inline: function (it, keyword, schema) {
      return getRegExp() + '.test(data' + (it.dataLevel || '') + ')';

      function getRegExp() {
        try {
          if (typeof schema == 'object') return new RegExp(schema.pattern, schema.flags);

          var rx = schema.match(/^\/(.*)\/([gimuy]*)$/);
          if (rx) return new RegExp(rx[1], rx[2]);
          throw new Error('cannot parse string into RegExp');
        } catch (e) {
          console.error('regular expression', schema, 'is invalid');
          throw e;
        }
      }
    },
    metaSchema: {
      type: ['string', 'object'],
      properties: {pattern: {type: 'string'}, flags: {type: 'string'}},
      required: ['pattern'],
      additionalProperties: false
    }
  };

  ajv.addKeyword('regexp', defFunc.definition);
  return ajv;
};

},
// 7
function (module) {

var KNOWN_TYPES = ['undefined', 'string', 'number', 'object', 'function', 'boolean', 'symbol'];

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    inline: function (it, keyword, schema) {
      var data = 'data' + (it.dataLevel || '');
      return typeof schema == 'string'
        ? 'typeof ' + data + ' == "' + schema + '"'
        : 'validate.schema' + it.schemaPath + '.' + keyword + '.indexOf(typeof ' + data + ') >= 0';
    },
    metaSchema: {
      anyOf: [
        {type: 'string', enum: KNOWN_TYPES},
        {type: 'array', items: {type: 'string', enum: KNOWN_TYPES}}
      ]
    }
  };

  ajv.addKeyword('typeof', defFunc.definition);
  return ajv;
};

},
// 8
function (module) {

var sequences = {};

var DEFAULTS = {
  timestamp: function () { return Date.now(); },
  datetime: function () { return new Date().toISOString(); },
  date: function () { return new Date().toISOString().slice(0, 10); },
  time: function () { return new Date().toISOString().slice(11); },
  random: function () { return Math.random(); },
  randomint: function (args) {
    var limit = (args && args.max) || 2;
    return function () { return Math.floor(Math.random() * limit); };
  },
  seq: function (args) {
    var name = (args && args.name) || '';
    sequences[name] = sequences[name] || 0;
    return function () { return sequences[name]++; };
  }
};

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    compile: function (schema, parentSchema, it) {
      var funcs = {};

      for (var key in schema) {
        var d = schema[key],
          func = getDefault(typeof d == 'string' ? d : d.func);
        funcs[key] = func.length ? func(d.args) : func;
      }

      return it.opts.useDefaults && !it.compositeRule ? assignDefaults : noop;

      function assignDefaults(data) {
        for (var prop in schema)
          (data[prop] !== void 0 &&
            (it.opts.useDefaults != 'empty' || (data[prop] !== null && data[prop] !== ''))) ||
            (data[prop] = funcs[prop]());

        return true;
      }

      function noop() { return true; }
    },
    DEFAULTS: DEFAULTS,
    metaSchema: {
      type: 'object',
      additionalProperties: {
        type: ['string', 'object'],
        additionalProperties: false,
        required: ['func', 'args'],
        properties: {func: {type: 'string'}, args: {type: 'object'}}
      }
    }
  };

  ajv.addKeyword('dynamicDefaults', defFunc.definition);
  return ajv;

  function getDefault(d) {
    var def = DEFAULTS[d];
    if (def) return def;
    throw new Error('invalid "dynamicDefaults" keyword property value: ' + d);
  }
};

},
// 9
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema, parentSchema) {
      if (!schema) return true;
      var properties = Object.keys(parentSchema.properties);
      return properties.length == 0 || {required: properties};
    },
    metaSchema: {type: 'boolean'},
    dependencies: ['properties']
  };

  ajv.addKeyword('allRequired', defFunc.definition);
  return ajv;
};

},
// 10
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema) {
      return schema.length == 0 ||
        (schema.length == 1 ? {required: schema} : {
          anyOf: schema.map(function (prop) {
            return {required: [prop]};
          })
        });
    },
    metaSchema: {type: 'array', items: {type: 'string'}}
  };

  ajv.addKeyword('anyRequired', defFunc.definition);
  return ajv;
};

},
// 11
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema) {
      return schema.length == 0 ||
        (schema.length == 1 ? {required: schema} : {
          oneOf: schema.map(function (prop) {
            return {required: [prop]};
          })
        });
    },
    metaSchema: {type: 'array', items: {type: 'string'}}
  };

  ajv.addKeyword('oneRequired', defFunc.definition);
  return ajv;
};

},
// 12
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema) {
      return schema.length == 0 ||
        (schema.length == 1 ? {not: {required: schema}} : {
          not: {
            anyOf: schema.map(function (prop) {
              return {required: [prop]};
            })
          }
        });
    },
    metaSchema: {type: 'array', items: {type: 'string'}}
  };

  ajv.addKeyword('prohibited', defFunc.definition);
  return ajv;
};

},
// 13
function (module) {

var SCALAR_TYPES = ['number', 'integer', 'string', 'boolean', 'null'];

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'array',
    compile: function (keys, parentSchema, it) {
      var equal = it.util.equal,
        scalar = getScalarKeys(keys, parentSchema);

      return function (data) {
        if (data.length <= 1) return true;

        for (var k = 0; k < keys.length; k++) {
          var i, key = keys[k];
          if (scalar[k]) {
            var hash = {};
            for (i = data.length; i--; ) {
              if (!data[i] || typeof data[i] != 'object') continue;
              var prop = data[i][key];
              if (prop && typeof prop == 'object') continue;
              if (typeof prop == 'string') prop = '"' + prop;
              if (hash[prop]) return false;
              hash[prop] = true;
            }
          } else
            for (i = data.length; i--; ) if (data[i] && typeof data[i] == 'object')
              for (var j = i; j--; )
                if (data[j] && typeof data[j] == 'object' && equal(data[i][key], data[j][key]))
                  return false;
        }
        return true;
      };
    },
    metaSchema: {type: 'array', items: {type: 'string'}}
  };

  ajv.addKeyword('uniqueItemProperties', defFunc.definition);
  return ajv;
};

function getScalarKeys(keys, schema) {
  return keys.map(function (key) {
    var properties = schema.items && schema.items.properties,
      propType = properties && properties[key] && properties[key].type;
    return Array.isArray(propType)
      ? propType.indexOf('object') < 0 && propType.indexOf('array') < 0
      : SCALAR_TYPES.indexOf(propType) >= 0;
  });
}

},
// 14
function (module, exports, __webpack_require__) {

var util = __webpack_require__(0);

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    macro: function (schema) {
      var schemas = [];
      for (var pointer in schema) schemas.push(getSchema(pointer, schema[pointer]));
      return {allOf: schemas};
    },
    metaSchema: {
      type: 'object',
      propertyNames: {type: 'string', format: 'json-pointer'},
      additionalProperties: util.metaSchemaRef(ajv)
    }
  };

  ajv.addKeyword('deepProperties', defFunc.definition);
  return ajv;
};

function getSchema(jsonPointer, schema) {
  var segments = jsonPointer.split('/'),
    rootSchema = {};
  for (var pointerSchema = rootSchema, i = 1; i < segments.length; i++) {
    var segment = segments[i],
      isLast = i == segments.length - 1;
    segment = unescapeJsonPointer(segment);
    var properties = (pointerSchema.properties = {}),
      items = void 0;
    if (/[0-9]+/.test(segment)) {
      var count = +segment;
      items = pointerSchema.items = [];
      while (count--) items.push({});
    }
    pointerSchema = isLast ? schema : {};
    properties[segment] = pointerSchema;
    items && items.push(pointerSchema);
  }
  return rootSchema;
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}

},
// 15
function (module) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    inline: function (it, keyword, schema) {
      var expr = '';
      for (var i = 0; i < schema.length; i++) {
        if (i) expr += ' && ';
        expr += '(' + getData(schema[i], it.dataLevel) + ' !== undefined)';
      }
      return expr;
    },
    metaSchema: {type: 'array', items: {type: 'string', format: 'json-pointer'}}
  };

  ajv.addKeyword('deepRequired', defFunc.definition);
  return ajv;
};

function getData(jsonPointer, lvl) {
  var data = 'data' + (lvl || '');
  if (!jsonPointer) return data;

  var expr = data;
  for (var segments = jsonPointer.split('/'), i = 1; i < segments.length; i++)
    expr += ' && ' + (data += getProperty(unescapeJsonPointer(segments[i])));

  return expr;
}

var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i,
  INTEGER = /^[0-9]+$/,
  SINGLE_QUOTE = /['\\]/g;
function getProperty(key) {
  return INTEGER.test(key)
    ? '[' + key + ']'
    : IDENTIFIER.test(key)
    ? '.' + key
    : "['" + key.replace(SINGLE_QUOTE, '\\$&') + "']";
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}

},
// 16
function (module, exports, __webpack_require__) {

module.exports = __webpack_require__(1)('Minimum');

},
// 17
function (module) {

module.exports = function (it, $keyword, _$ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl;
  out += 'var ' + $valid + ' = undefined;';
  if (it.opts.format === false) return out + ' ' + $valid + ' = true; ';

  var $format,
    $schemaFormat = it.schema.format,
    $isDataFormat = it.opts.$data && $schemaFormat.$data,
    $closingBraces = '';
  if ($isDataFormat)
    out += ' var ' + ($format = 'format' + $lvl) + ' = formats[' + it.util.getData($schemaFormat.$data, $dataLvl, it.dataPathArr) + '] , ' + ($compare = 'compare' + $lvl) + ' = ' + $format + ' && ' + $format + '.compare;';
  else {
    if (!($format = it.formats[$schemaFormat]) || !$format.compare) return out + '  ' + $valid + ' = true; ';

    var $compare = 'formats' + it.util.getProperty($schemaFormat) + '.compare';
  }
  var $schemaValue,
    $$outStack,
    $isMax = $keyword == 'formatMaximum',
    $exclusiveKeyword = 'formatExclusive' + ($isMax ? 'Maximum' : 'Minimum'),
    $schemaExcl = it.schema[$exclusiveKeyword],
    $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,
    $op = $isMax ? '<' : '>',
    $result = 'result' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if ($isDataExcl) {
    var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr),
      $exclusive = 'exclusive' + $lvl,
      $opStr = "' + " + ($opExpr = 'op' + $lvl) + " + '";
    out += ' var schemaExcl' + $lvl + ' = ' + $schemaValueExcl + '; ';
    out += ' if (typeof ' + ($schemaValueExcl = 'schemaExcl' + $lvl) + " != 'boolean' && " + $schemaValueExcl + ' !== undefined) { ' + $valid + ' = false; ';
    var $errorKeyword = $exclusiveKeyword;
    ($$outStack = $$outStack || []).push(out);
    out = '';
    if (it.createErrors !== false) {
      out += " { keyword: '" + ($errorKeyword || '_formatExclusiveLimit') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) out += " , message: '" + $exclusiveKeyword + " should be boolean' ";

      if (it.opts.verbose)
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

      out += ' } ';
    } else out += ' {} ';

    var __err = out;
    out = $$outStack.pop();
    out += it.compositeRule || !$breakOnError
      ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
      : it.async
      ? ' throw new ValidationError([' + __err + ']); '
      : ' validate.errors = [' + __err + ']; return false; ';

    out += ' }  ';
    if ($breakOnError) {
      $closingBraces += '}';
      out += ' else { ';
    }
    if ($isData) {
      out += ' if (' + $schemaValue + ' === undefined) ' + $valid + ' = true; else if (typeof ' + $schemaValue + " != 'string') " + $valid + ' = false; else { ';
      $closingBraces += '}';
    }
    if ($isDataFormat) {
      out += ' if (!' + $compare + ') ' + $valid + ' = true; else { ';
      $closingBraces += '}';
    }
    out += ' var ' + $result + ' = ' + $compare + '(' + $data + ',  ';
    out += $isData ? '' + $schemaValue : '' + it.util.toQuotedString($schema);

    out += ' ); if (' + $result + ' === undefined) ' + $valid + ' = false; var ' + $exclusive + ' = ' + $schemaValueExcl + ' === true; if (' + $valid + ' === undefined) { ' + $valid + ' = ' + $exclusive + ' ? ' + $result + ' ' + $op + ' 0 : ' + $result + ' ' + $op + '= 0; } if (!' + $valid + ') var op' + $lvl + ' = ' + $exclusive + " ? '" + $op + "' : '" + $op + "=';";
  } else {
    $opStr = $op;
    ($exclusive = $schemaExcl === true) || ($opStr += '=');
    var $opExpr = "'" + $opStr + "'";
    if ($isData) {
      out += ' if (' + $schemaValue + ' === undefined) ' + $valid + ' = true; else if (typeof ' + $schemaValue + " != 'string') " + $valid + ' = false; else { ';
      $closingBraces += '}';
    }
    if ($isDataFormat) {
      out += ' if (!' + $compare + ') ' + $valid + ' = true; else { ';
      $closingBraces += '}';
    }
    out += ' var ' + $result + ' = ' + $compare + '(' + $data + ',  ';
    out += $isData ? '' + $schemaValue : '' + it.util.toQuotedString($schema);

    out += ' ); if (' + $result + ' === undefined) ' + $valid + ' = false; if (' + $valid + ' === undefined) ' + $valid + ' = ' + $result + ' ' + $op;
    $exclusive || (out += '=');

    out += ' 0;';
  }
  out += $closingBraces + 'if (!' + $valid + ') { ';
  $errorKeyword = $keyword;
  ($$outStack = $$outStack || []).push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || '_formatLimit') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { comparison: ' + $opExpr + ', limit:  ';
    out += $isData ? '' + $schemaValue : '' + it.util.toQuotedString($schema);

    out += ' , exclusive: ' + $exclusive + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should be " + $opStr + ' "';
      out += $isData ? "' + " + $schemaValue + " + '" : '' + it.util.escapeQuotes($schema);

      out += '"\' ';
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + it.util.toQuotedString($schema);

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  return out + '}';
};

},
// 18
function (module, exports, __webpack_require__) {

module.exports = __webpack_require__(1)('Maximum');

},
// 19
function (module, exports, __webpack_require__) {

module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',
    inline: __webpack_require__(20),
    statements: true,
    errors: 'full',
    metaSchema: {type: 'array', items: {type: 'string', format: 'regex'}, uniqueItems: true}
  };

  ajv.addKeyword('patternRequired', defFunc.definition);
  return ajv;
};

},
// 20
function (module) {

module.exports = function (it, $keyword, _$ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $key = 'key' + $lvl,
    $idx = 'idx' + $lvl,
    $matched = 'patternMatched' + $lvl,
    $dataProperties = 'dataProperties' + $lvl,
    $closingBraces = '',
    $ownProperties = it.opts.ownProperties;
  out += 'var ' + $valid + ' = true;';
  if ($ownProperties) out += ' var ' + $dataProperties + ' = undefined;';

  var arr1 = $schema;
  if (arr1)
    for (var $pProperty, i1 = -1, l1 = arr1.length - 1; i1 < l1; ) {
      $pProperty = arr1[++i1];
      out += ' var ' + $matched + ' = false;  ';
      out += $ownProperties
        ? ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; '
        : ' for (var ' + $key + ' in ' + $data + ') { ';

      out += ' ' + $matched + ' = ' + it.usePattern($pProperty) + '.test(' + $key + '); if (' + $matched + ') break; } ';
      var $missingPattern = it.util.escapeQuotes($pProperty);
      out += ' if (!' + $matched + ') { ' + $valid + ' = false;  var err =   ';
      if (it.createErrors !== false) {
        out += " { keyword: 'patternRequired' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingPattern: '" + $missingPattern + "' } ";
        if (it.opts.messages !== false)
          out += " , message: 'should have property matching pattern \\'" + $missingPattern + "\\'' ";

        if (it.opts.verbose)
          out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

        out += ' } ';
      } else out += ' {} ';

      out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; }   ';
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }

  return out + $closingBraces;
};

},
// 21
function (module, exports, __webpack_require__) {

var util = __webpack_require__(0);

module.exports = function defFunc(ajv) {
  if (ajv.RULES.keywords.switch && ajv.RULES.keywords.if) return;

  var metaSchemaRef = util.metaSchemaRef(ajv);

  defFunc.definition = {
    inline: __webpack_require__(22),
    statements: true,
    errors: 'full',
    metaSchema: {
      type: 'array',
      items: {
        required: ['then'],
        properties: {
          if: metaSchemaRef,
          then: {anyOf: [{type: 'boolean'}, metaSchemaRef]},
          continue: {type: 'boolean'}
        },
        additionalProperties: false,
        dependencies: {continue: ['if']}
      }
    }
  };

  ajv.addKeyword('switch', defFunc.definition);
  return ajv;
};

},
// 22
function (module) {

module.exports = function (it, $keyword, _$ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs__' + $lvl,
    $it = it.util.copy(it),
    $closingBraces = '';
  $it.level++;
  var $shouldContinue,
    $nextValid = 'valid' + $it.level,
    $ifPassed = 'ifPassed' + it.level,
    $currentBaseId = $it.baseId;
  out += 'var ' + $ifPassed + ';';
  var arr1 = $schema;
  if (arr1)
    for (var $sch, $caseIndex = -1, l1 = arr1.length - 1; $caseIndex < l1; ) {
      $sch = arr1[++$caseIndex];
      if ($caseIndex && !$shouldContinue) {
        out += ' if (!' + $ifPassed + ') { ';
        $closingBraces += '}';
      }
      var $$outStack;
      if ($sch.if && (it.opts.strictKeywords
          ? typeof $sch.if == 'object' && Object.keys($sch.if).length > 0
          : it.util.schemaHasRules($sch.if, it.RULES.all))) {
        out += ' var ' + $errs + ' = errors;   ';
        var $wasComposite = it.compositeRule;
        it.compositeRule = $it.compositeRule = true;
        $it.createErrors = false;
        $it.schema = $sch.if;
        $it.schemaPath = $schemaPath + '[' + $caseIndex + '].if';
        $it.errSchemaPath = $errSchemaPath + '/' + $caseIndex + '/if';
        out += '  ' + it.validate($it) + ' ';
        $it.baseId = $currentBaseId;
        $it.createErrors = true;
        it.compositeRule = $it.compositeRule = $wasComposite;
        out += ' ' + $ifPassed + ' = ' + $nextValid + '; if (' + $ifPassed + ') {  ';
        if (typeof $sch.then == 'boolean') {
          if ($sch.then === false) {
            ($$outStack = $$outStack || []).push(out);
            out = '';
            if (it.createErrors !== false) {
              out += " { keyword: 'switch' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { caseIndex: ' + $caseIndex + ' } ';
              if (it.opts.messages !== false) out += ' , message: \'should pass "switch" keyword validation\' ';

              if (it.opts.verbose)
                out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

              out += ' } ';
            } else out += ' {} ';

            var __err = out;
            out = $$outStack.pop();
            out += it.compositeRule || !$breakOnError
              ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
              : it.async
              ? ' throw new ValidationError([' + __err + ']); '
              : ' validate.errors = [' + __err + ']; return false; ';
          }
          out += ' var ' + $nextValid + ' = ' + $sch.then + '; ';
        } else {
          $it.schema = $sch.then;
          $it.schemaPath = $schemaPath + '[' + $caseIndex + '].then';
          $it.errSchemaPath = $errSchemaPath + '/' + $caseIndex + '/then';
          out += '  ' + it.validate($it) + ' ';
          $it.baseId = $currentBaseId;
        }
        out += '  } else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } } ';
      } else {
        out += ' ' + $ifPassed + ' = true;  ';
        if (typeof $sch.then == 'boolean') {
          if ($sch.then === false) {
            ($$outStack = $$outStack || []).push(out);
            out = '';
            if (it.createErrors !== false) {
              out += " { keyword: 'switch' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { caseIndex: ' + $caseIndex + ' } ';
              if (it.opts.messages !== false) out += ' , message: \'should pass "switch" keyword validation\' ';

              if (it.opts.verbose)
                out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

              out += ' } ';
            } else out += ' {} ';

            __err = out;
            out = $$outStack.pop();
            out += it.compositeRule || !$breakOnError
              ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
              : it.async
              ? ' throw new ValidationError([' + __err + ']); '
              : ' validate.errors = [' + __err + ']; return false; ';
          }
          out += ' var ' + $nextValid + ' = ' + $sch.then + '; ';
        } else {
          $it.schema = $sch.then;
          $it.schemaPath = $schemaPath + '[' + $caseIndex + '].then';
          $it.errSchemaPath = $errSchemaPath + '/' + $caseIndex + '/then';
          out += '  ' + it.validate($it) + ' ';
          $it.baseId = $currentBaseId;
        }
      }
      $shouldContinue = $sch.continue;
    }

  return out + $closingBraces + 'var ' + $valid + ' = ' + $nextValid + ';';
};

},
// 23
function (module, exports, __webpack_require__) {

var util = __webpack_require__(0);

module.exports = function defFunc(ajv) {
  if (!ajv._opts.$data) {
    console.warn('keyword select requires $data option');
    return ajv;
  }
  var metaSchemaRef = util.metaSchemaRef(ajv),
    compiledCaseSchemas = [];

  defFunc.definition = {
    validate: function v(schema, data, parentSchema) {
      if (parentSchema.selectCases === void 0) throw new Error('keyword "selectCases" is absent');
      var compiled = getCompiledSchemas(parentSchema, false),
        validate = compiled.cases[schema];
      if (validate === void 0) validate = compiled.default;
      if (typeof validate == 'boolean') return validate;
      var valid = validate(data);
      valid || (v.errors = validate.errors);
      return valid;
    },
    $data: true,
    metaSchema: {type: ['string', 'number', 'boolean', 'null']}
  };

  ajv.addKeyword('select', defFunc.definition);
  ajv.addKeyword('selectCases', {
    compile: function (schemas, parentSchema) {
      var compiled = getCompiledSchemas(parentSchema);
      for (var value in schemas) compiled.cases[value] = compileOrBoolean(schemas[value]);
      return function () { return true; };
    },
    valid: true,
    metaSchema: {type: 'object', additionalProperties: metaSchemaRef}
  });
  ajv.addKeyword('selectDefault', {
    compile: function (schema, parentSchema) {
      getCompiledSchemas(parentSchema).default = compileOrBoolean(schema);
      return function () { return true; };
    },
    valid: true,
    metaSchema: metaSchemaRef
  });
  return ajv;

  function getCompiledSchemas(parentSchema, create) {
    var compiled;
    compiledCaseSchemas.some(function (c) {
      if (c.parentSchema === parentSchema) {
        compiled = c;
        return true;
      }
    });
    if (!compiled && create !== false) {
      compiled = {parentSchema: parentSchema, cases: {}, default: true};
      compiledCaseSchemas.push(compiled);
    }
    return compiled;
  }

  function compileOrBoolean(schema) {
    return typeof schema == 'boolean' ? schema : ajv.compile(schema);
  }
};

},
// 24
function (module) {

module.exports = function defFunc(ajv) {
  var transform = {
    trimLeft: function (value) {
      return value.replace(/^[\s]+/, '');
    },
    trimRight: function (value) {
      return value.replace(/[\s]+$/, '');
    },
    trim: function (value) {
      return value.trim();
    },
    toLowerCase: function (value) {
      return value.toLowerCase();
    },
    toUpperCase: function (value) {
      return value.toUpperCase();
    },
    toEnumCase: function (value, cfg) {
      return cfg.hash[makeHashTableKey(value)] || value;
    }
  };

  defFunc.definition = {
    type: 'string',
    errors: false,
    modifying: true,
    valid: true,
    compile: function (schema, parentSchema) {
      var cfg;

      if (schema.indexOf('toEnumCase') !== -1) {
        cfg = {hash: {}};

        if (!parentSchema.enum)
          throw new Error('Missing enum. To use `transform:["toEnumCase"]`, `enum:[...]` is required.');
        for (var i = parentSchema.enum.length; i--; ) {
          var v = parentSchema.enum[i];
          if (typeof v != 'string') continue;
          var k = makeHashTableKey(v);
          if (cfg.hash[k])
            throw new Error('Invalid enum uniqueness. To use `transform:["toEnumCase"]`, all values must be unique when case insensitive.');
          cfg.hash[k] = v;
        }
      }

      return function (data, dataPath, object, key) {
        if (!object) return;

        for (var j = 0, l = schema.length; j < l; j++) data = transform[schema[j]](data, cfg);

        object[key] = data;
      };
    },
    metaSchema: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['trimLeft', 'trimRight', 'trim', 'toLowerCase', 'toUpperCase', 'toEnumCase']
      }
    }
  };

  ajv.addKeyword('transform', defFunc.definition);
  return ajv;

  function makeHashTableKey(value) {
    return value.toLowerCase();
  }
};

}
]);

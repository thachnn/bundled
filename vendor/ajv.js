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
function (module, exports, __webpack_require__) {

module.exports = {
  copy: copy,
  checkDataType: checkDataType,
  checkDataTypes: checkDataTypes,
  coerceToTypes: coerceToTypes,
  toHash: toHash,
  getProperty: getProperty,
  escapeQuotes: escapeQuotes,
  equal: __webpack_require__(2),
  ucs2length: __webpack_require__(15),
  varOccurences: varOccurences,
  varReplace: varReplace,
  schemaHasRules: schemaHasRules,
  schemaHasRulesExcept: schemaHasRulesExcept,
  schemaUnknownRules: schemaUnknownRules,
  toQuotedString: toQuotedString,
  getPathExpr: getPathExpr,
  getPath: getPath,
  getData: getData,
  unescapeFragment: unescapeFragment,
  unescapeJsonPointer: unescapeJsonPointer,
  escapeFragment: escapeFragment,
  escapeJsonPointer: escapeJsonPointer
};

function copy(o, to) {
  to = to || {};
  for (var key in o) to[key] = o[key];
  return to;
}

function checkDataType(dataType, data, strictNumbers, negate) {
  var EQUAL = negate ? ' !== ' : ' === ',
    AND = negate ? ' || ' : ' && ',
    OK = negate ? '!' : '',
    NOT = negate ? '' : '!';
  switch (dataType) {
    case 'null': return data + EQUAL + 'null';
    case 'array': return OK + 'Array.isArray(' + data + ')';
    case 'object':
      return '(' + OK + data + AND + 'typeof ' + data + EQUAL + '"object"' + AND +
        NOT + 'Array.isArray(' + data + '))';
    case 'integer':
      return '(typeof ' + data + EQUAL + '"number"' + AND + NOT + '(' + data + ' % 1)' +
        AND + data + EQUAL + data +
        (strictNumbers ? AND + OK + 'isFinite(' + data + ')' : '') + ')';
    case 'number':
      return '(typeof ' + data + EQUAL + '"' + dataType + '"' +
        (strictNumbers ? AND + OK + 'isFinite(' + data + ')' : '') + ')';
    default: return 'typeof ' + data + EQUAL + '"' + dataType + '"';
  }
}

function checkDataTypes(dataTypes, data, strictNumbers) {
  switch (dataTypes.length) {
    case 1: return checkDataType(dataTypes[0], data, strictNumbers, true);
    default:
      var code = '',
        types = toHash(dataTypes);
      if (types.array && types.object) {
        code = types.null ? '(' : '(!' + data + ' || ';
        code += 'typeof ' + data + ' !== "object")';
        delete types.null;
        delete types.array;
        delete types.object;
      }
      types.number && delete types.integer;
      for (var t in types)
        code += (code ? ' && ' : '') + checkDataType(t, data, strictNumbers, true);

      return code;
  }
}

var COERCE_TO_TYPES = toHash(['string', 'number', 'integer', 'boolean', 'null']);
function coerceToTypes(optionCoerceTypes, dataTypes) {
  if (Array.isArray(dataTypes)) {
    var types = [];
    for (var i = 0; i < dataTypes.length; i++) {
      var t = dataTypes[i];
      if (COERCE_TO_TYPES[t] || (optionCoerceTypes === 'array' && t === 'array')) types[types.length] = t;
    }
    if (types.length) return types;
  } else {
    if (COERCE_TO_TYPES[dataTypes]) return [dataTypes];
    if (optionCoerceTypes === 'array' && dataTypes === 'array') return ['array'];
  }
}

function toHash(arr) {
  var hash = {};
  for (var i = 0; i < arr.length; i++) hash[arr[i]] = true;
  return hash;
}

var IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i,
  SINGLE_QUOTE = /'|\\/g;
function getProperty(key) {
  return typeof key == 'number'
    ? '[' + key + ']'
    : IDENTIFIER.test(key)
    ? '.' + key
    : "['" + escapeQuotes(key) + "']";
}

function escapeQuotes(str) {
  return str.replace(SINGLE_QUOTE, '\\$&')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\f/g, '\\f')
    .replace(/\t/g, '\\t');
}

function varOccurences(str, dataVar) {
  dataVar += '[^0-9]';
  var matches = str.match(new RegExp(dataVar, 'g'));
  return matches ? matches.length : 0;
}

function varReplace(str, dataVar, expr) {
  dataVar += '([^0-9])';
  expr = expr.replace(/\$/g, '$$$$');
  return str.replace(new RegExp(dataVar, 'g'), expr + '$1');
}

function schemaHasRules(schema, rules) {
  if (typeof schema == 'boolean') return !schema;
  for (var key in schema) if (rules[key]) return true;
}

function schemaHasRulesExcept(schema, rules, exceptKeyword) {
  if (typeof schema == 'boolean') return !schema && exceptKeyword != 'not';
  for (var key in schema) if (key != exceptKeyword && rules[key]) return true;
}

function schemaUnknownRules(schema, rules) {
  if (typeof schema != 'boolean') for (var key in schema) if (!rules[key]) return key;
}

function toQuotedString(str) {
  return "'" + escapeQuotes(str) + "'";
}

function getPathExpr(currentPath, expr, jsonPointers, isNumber) {
  return joinPaths(currentPath,
    jsonPointers
      ? "'/' + " + expr + (isNumber ? '' : ".replace(/~/g, '~0').replace(/\\//g, '~1')")
      : isNumber ? "'[' + " + expr + " + ']'" : "'[\\'' + " + expr + " + '\\']'"
  );
}

function getPath(currentPath, prop, jsonPointers) {
  return joinPaths(currentPath, toQuotedString(jsonPointers ? '/' + escapeJsonPointer(prop) : getProperty(prop)));
}

var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/,
  RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData($data, lvl, paths) {
  var up, jsonPointer, data, matches;
  if ($data === '') return 'rootData';
  if ($data[0] == '/') {
    if (!JSON_POINTER.test($data)) throw new Error('Invalid JSON-pointer: ' + $data);
    jsonPointer = $data;
    data = 'rootData';
  } else {
    if (!(matches = $data.match(RELATIVE_JSON_POINTER))) throw new Error('Invalid JSON-pointer: ' + $data);
    up = +matches[1];
    if ((jsonPointer = matches[2]) == '#') {
      if (up >= lvl) throw new Error('Cannot access property/index ' + up + ' levels up, current level is ' + lvl);
      return paths[lvl - up];
    }

    if (up > lvl) throw new Error('Cannot access data ' + up + ' levels up, current level is ' + lvl);
    data = 'data' + (lvl - up || '');
    if (!jsonPointer) return data;
  }

  var expr = data;
  for (var segments = jsonPointer.split('/'), i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment) expr += ' && ' + (data += getProperty(unescapeJsonPointer(segment)));
  }
  return expr;
}

function joinPaths(a, b) {
  return a == '""' ? b : (a + ' + ' + b).replace(/([^\\])' \+ '/g, '$1');
}

function unescapeFragment(str) {
  return unescapeJsonPointer(decodeURIComponent(str));
}

function escapeFragment(str) {
  return encodeURIComponent(escapeJsonPointer(str));
}

function escapeJsonPointer(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

function unescapeJsonPointer(str) {
  return str.replace(/~1/g, '/').replace(/~0/g, '~');
}

},
// 1
function (module, exports, __webpack_require__) {

var URI = __webpack_require__(14),
  equal = __webpack_require__(2),
  util = __webpack_require__(0),
  SchemaObject = __webpack_require__(4),
  traverse = __webpack_require__(16);

module.exports = resolve;

resolve.normalizeId = normalizeId;
resolve.fullPath = getFullPath;
resolve.url = resolveUrl;
resolve.ids = resolveIds;
resolve.inlineRef = inlineRef;
resolve.schema = resolveSchema;

function resolve(compile, root, ref) {
  var refVal = this._refs[ref];
  if (typeof refVal == 'string') {
    if (!this._refs[refVal]) return resolve.call(this, compile, root, refVal);
    refVal = this._refs[refVal];
  }

  if ((refVal = refVal || this._schemas[ref]) instanceof SchemaObject)
    return inlineRef(refVal.schema, this._opts.inlineRefs)
      ? refVal.schema
      : refVal.validate || this._compile(refVal);

  var schema, v, baseId,
    res = resolveSchema.call(this, root, ref);
  if (res) {
    schema = res.schema;
    root = res.root;
    baseId = res.baseId;
  }

  if (schema instanceof SchemaObject)
    v = schema.validate || compile.call(this, schema.schema, root, void 0, baseId);
  else if (schema !== void 0)
    v = inlineRef(schema, this._opts.inlineRefs)
      ? schema
      : compile.call(this, schema, root, void 0, baseId);

  return v;
}

function resolveSchema(root, ref) {
  var p = URI.parse(ref),
    refPath = _getFullPath(p),
    baseId = getFullPath(this._getId(root.schema));
  if (Object.keys(root.schema).length === 0 || refPath !== baseId) {
    var id = normalizeId(refPath),
      refVal = this._refs[id];
    if (typeof refVal == 'string') return resolveRecursive.call(this, root, refVal, p);
    if (refVal instanceof SchemaObject) {
      refVal.validate || this._compile(refVal);
      root = refVal;
    } else if ((refVal = this._schemas[id]) instanceof SchemaObject) {
      refVal.validate || this._compile(refVal);
      if (id == normalizeId(ref)) return { schema: refVal, root: root, baseId: baseId };
      root = refVal;
    } else return;
    if (!root.schema) return;
    baseId = getFullPath(this._getId(root.schema));
  }
  return getJsonPointer.call(this, p, baseId, root.schema, root);
}

function resolveRecursive(root, ref, parsedRef) {
  var res = resolveSchema.call(this, root, ref);
  if (res) {
    var schema = res.schema,
      baseId = res.baseId;
    root = res.root;
    var id = this._getId(schema);
    if (id) baseId = resolveUrl(baseId, id);
    return getJsonPointer.call(this, parsedRef, baseId, schema, root);
  }
}

var PREVENT_SCOPE_CHANGE = util.toHash(['properties', 'patternProperties', 'enum', 'dependencies', 'definitions']);
function getJsonPointer(parsedRef, baseId, schema, root) {
  parsedRef.fragment = parsedRef.fragment || '';
  if (parsedRef.fragment.slice(0, 1) != '/') return;

  for (var parts = parsedRef.fragment.split('/'), i = 1; i < parts.length; i++) {
    var part = parts[i];
    if (!part) continue;
    if ((schema = schema[(part = util.unescapeFragment(part))]) === void 0) break;
    var id;
    if (PREVENT_SCOPE_CHANGE[part]) continue;
    if ((id = this._getId(schema))) baseId = resolveUrl(baseId, id);
    if (schema.$ref) {
      var $ref = resolveUrl(baseId, schema.$ref),
        res = resolveSchema.call(this, root, $ref);
      if (res) {
        schema = res.schema;
        root = res.root;
        baseId = res.baseId;
      }
    }
  }
  if (schema !== void 0 && schema !== root.schema)
    return { schema: schema, root: root, baseId: baseId };
}

var SIMPLE_INLINED = util.toHash([
  'type', 'format', 'pattern',
  'maxLength', 'minLength',
  'maxProperties', 'minProperties',
  'maxItems', 'minItems',
  'maximum', 'minimum',
  'uniqueItems', 'multipleOf',
  'required', 'enum'
]);
function inlineRef(schema, limit) {
  return limit !== false &&
    (limit === void 0 || limit === true ? checkNoRef(schema) : limit ? countKeys(schema) <= limit : void 0);
}

function checkNoRef(schema) {
  var item;
  if (Array.isArray(schema)) {
    for (var i = 0; i < schema.length; i++)
      if (typeof (item = schema[i]) == 'object' && !checkNoRef(item)) return false;
  } else
    for (var key in schema)
      if (key == '$ref' || (typeof (item = schema[key]) == 'object' && !checkNoRef(item))) return false;

  return true;
}

function countKeys(schema) {
  var item, count = 0;
  if (Array.isArray(schema))
    for (var i = 0; i < schema.length; i++) {
      if (typeof (item = schema[i]) == 'object') count += countKeys(item);
      if (count == Infinity) return Infinity;
    }
  else
    for (var key in schema) {
      if (key == '$ref') return Infinity;
      if (SIMPLE_INLINED[key]) count++;
      else {
        if (typeof (item = schema[key]) == 'object') count += countKeys(item) + 1;
        if (count == Infinity) return Infinity;
      }
    }

  return count;
}

function getFullPath(id, normalize) {
  if (normalize !== false) id = normalizeId(id);
  return _getFullPath(URI.parse(id));
}

function _getFullPath(p) {
  return URI.serialize(p).split('#')[0] + '#';
}

var TRAILING_SLASH_HASH = /#\/?$/;
function normalizeId(id) {
  return id ? id.replace(TRAILING_SLASH_HASH, '') : '';
}

function resolveUrl(baseId, id) {
  id = normalizeId(id);
  return URI.resolve(baseId, id);
}

function resolveIds(schema) {
  var schemaId = normalizeId(this._getId(schema)),
    baseIds = { '': schemaId },
    fullPaths = { '': getFullPath(schemaId, false) },
    localRefs = {},
    self = this;

  traverse(schema, { allKeys: true }, function (sch, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (jsonPtr === '') return;
    var id = self._getId(sch),
      baseId = baseIds[parentJsonPtr],
      fullPath = fullPaths[parentJsonPtr] + '/' + parentKeyword;
    if (keyIndex !== void 0)
      fullPath += '/' + (typeof keyIndex == 'number' ? keyIndex : util.escapeFragment(keyIndex));

    if (typeof id == 'string') {
      id = baseId = normalizeId(baseId ? URI.resolve(baseId, id) : id);

      var refVal = self._refs[id];
      if (typeof refVal == 'string') refVal = self._refs[refVal];
      if (refVal && refVal.schema) {
        if (!equal(sch, refVal.schema))
          throw new Error('id "' + id + '" resolves to more than one schema');
      } else if (id != normalizeId(fullPath))
        if (id[0] == '#') {
          if (localRefs[id] && !equal(sch, localRefs[id]))
            throw new Error('id "' + id + '" resolves to more than one schema');
          localRefs[id] = sch;
        } else self._refs[id] = fullPath;
    }
    baseIds[jsonPtr] = baseId;
    fullPaths[jsonPtr] = fullPath;
  });

  return localRefs;
}

},
// 2
function (module) {

module.exports = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      if ((length = a.length) != b.length) return false;
      for (i = length; i-- != 0; ) if (!equal(a[i], b[i])) return false;
      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    if ((length = (keys = Object.keys(a)).length) !== Object.keys(b).length) return false;

    for (i = length; i-- != 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- != 0; ) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  return a !== a && b !== b;
};

},
// 3
function (module, exports, __webpack_require__) {

var resolve = __webpack_require__(1);

module.exports = {
  Validation: errorSubclass(ValidationError),
  MissingRef: errorSubclass(MissingRefError)
};

function ValidationError(errors) {
  this.message = 'validation failed';
  this.errors = errors;
  this.ajv = this.validation = true;
}

MissingRefError.message = function (baseId, ref) {
  return "can't resolve reference " + ref + ' from id ' + baseId;
};

function MissingRefError(baseId, ref, message) {
  this.message = message || MissingRefError.message(baseId, ref);
  this.missingRef = resolve.url(baseId, ref);
  this.missingSchema = resolve.normalizeId(resolve.fullPath(this.missingRef));
}

function errorSubclass(Subclass) {
  Subclass.prototype = Object.create(Error.prototype);
  Subclass.prototype.constructor = Subclass;
  return Subclass;
}

},
// 4
function (module, exports, __webpack_require__) {

var util = __webpack_require__(0);

module.exports = SchemaObject;

function SchemaObject(obj) {
  util.copy(obj, this);
}

},
// 5
function (module) {

module.exports = function (data, opts) {
  opts || (opts = {});
  if (typeof opts == 'function') opts = { cmp: opts };
  var cycles = typeof opts.cycles == 'boolean' && opts.cycles;

  var cmp = opts.cmp && (function (f) {
    return function (node) {
      return function (a, b) {
        var aobj = { key: a, value: node[a] },
          bobj = { key: b, value: node[b] };
        return f(aobj, bobj);
      };
    };
  })(opts.cmp);

  var seen = [];
  return (function stringify(node) {
    if (node && node.toJSON && typeof node.toJSON == 'function') node = node.toJSON();

    if (node === void 0) return;
    if (typeof node == 'number') return isFinite(node) ? '' + node : 'null';
    if (typeof node != 'object') return JSON.stringify(node);

    var i, out;
    if (Array.isArray(node)) {
      out = '[';
      for (i = 0; i < node.length; i++) {
        if (i) out += ',';
        out += stringify(node[i]) || 'null';
      }
      return out + ']';
    }

    if (node === null) return 'null';

    if (seen.indexOf(node) !== -1) {
      if (cycles) return JSON.stringify('__cycle__');
      throw new TypeError('Converting circular structure to JSON');
    }

    var seenIndex = seen.push(node) - 1,
      keys = Object.keys(node).sort(cmp && cmp(node));
    out = '';
    for (i = 0; i < keys.length; i++) {
      var key = keys[i],
        value = stringify(node[key]);

      if (!value) continue;
      if (out) out += ',';
      out += JSON.stringify(key) + ':' + value;
    }
    seen.splice(seenIndex, 1);
    return '{' + out + '}';
  })(data);
};

},
// 6
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $errorKeyword,
    $$outStack,
    out = '',
    $async = it.schema.$async === true,
    $refKeywords = it.util.schemaHasRulesExcept(it.schema, it.RULES.all, '$ref'),
    $id = it.self._getId(it.schema);
  if (it.opts.strictKeywords) {
    var $unknownKwd = it.util.schemaUnknownRules(it.schema, it.RULES.keywords);
    if ($unknownKwd) {
      var $keywordsMsg = 'unknown keyword: ' + $unknownKwd;
      if (it.opts.strictKeywords !== 'log') throw new Error($keywordsMsg);
      it.logger.warn($keywordsMsg);
    }
  }
  if (it.isTop) {
    out += ' var validate = ';
    if ($async) {
      it.async = true;
      out += 'async ';
    }
    out += "function(data, dataPath, parentData, parentDataProperty, rootData) { 'use strict'; ";
    if ($id && (it.opts.sourceCode || it.opts.processCode)) out += ' /*# sourceURL=' + $id + ' */ ';
  }
  if (typeof it.schema == 'boolean' || (!$refKeywords && !it.schema.$ref)) {
    $keyword = 'false schema';
    var $lvl = it.level,
      $dataLvl = it.dataLevel,
      $schema = it.schema[$keyword],
      $schemaPath = it.schemaPath + it.util.getProperty($keyword),
      $errSchemaPath = it.errSchemaPath + '/' + $keyword,
      $breakOnError = !it.opts.allErrors,
      $data = 'data' + ($dataLvl || ''),
      $valid = 'valid' + $lvl;
    if (it.schema === false) {
      it.isTop ? ($breakOnError = true) : (out += ' var ' + $valid + ' = false; ');

      ($$outStack = $$outStack || []).push(out);
      out = '';
      if (it.createErrors !== false) {
        out += " { keyword: '" + ($errorKeyword || 'false schema') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
        if (it.opts.messages !== false) out += " , message: 'boolean schema is false' ";

        if (it.opts.verbose)
          out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

        out += ' } ';
      } else out += ' {} ';

      var __err = out;
      out = $$outStack.pop();
      out += it.compositeRule || !$breakOnError
        ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
        : it.async
        ? ' throw new ValidationError([' + __err + ']); '
        : ' validate.errors = [' + __err + ']; return false; ';
    } else
      out += it.isTop
        ? ($async ? ' return data; ' : ' validate.errors = null; return true; ')
        : ' var ' + $valid + ' = true; ';

    if (it.isTop) out += ' }; return validate; ';

    return out;
  }
  if (it.isTop) {
    var $top = it.isTop;
    $lvl = it.level = 0;
    $dataLvl = it.dataLevel = 0;
    $data = 'data';
    it.rootId = it.resolve.fullPath(it.self._getId(it.root.schema));
    it.baseId = it.baseId || it.rootId;
    delete it.isTop;
    it.dataPathArr = [''];
    if (it.schema.default !== void 0 && it.opts.useDefaults && it.opts.strictDefaults) {
      var $defaultMsg = 'default is ignored in the schema root';
      if (it.opts.strictDefaults !== 'log') throw new Error($defaultMsg);
      it.logger.warn($defaultMsg);
    }
    out += ' var vErrors = null; ';
    out += ' var errors = 0;     ';
    out += ' if (rootData === undefined) rootData = data; ';
  } else {
    $lvl = it.level;
    $data = 'data' + (($dataLvl = it.dataLevel) || '');
    if ($id) it.baseId = it.resolve.url(it.baseId, $id);
    if ($async && !it.async) throw new Error('async schema in sync schema');
    out += ' var errs_' + $lvl + ' = errors;';
  }
  $valid = 'valid' + $lvl;
  $breakOnError = !it.opts.allErrors;
  var $closingBraces1 = '',
    $closingBraces2 = '',
    $typeSchema = it.schema.type,
    $typeIsArray = Array.isArray($typeSchema);
  if ($typeSchema && it.opts.nullable && it.schema.nullable === true)
    if ($typeIsArray) $typeSchema.indexOf('null') != -1 || ($typeSchema = $typeSchema.concat('null'));
    else if ($typeSchema != 'null') {
      $typeSchema = [$typeSchema, 'null'];
      $typeIsArray = true;
    }

  if ($typeIsArray && $typeSchema.length == 1) {
    $typeSchema = $typeSchema[0];
    $typeIsArray = false;
  }
  if (it.schema.$ref && $refKeywords) {
    if (it.opts.extendRefs == 'fail')
      throw new Error('$ref: validation keywords used in schema at path "' + it.errSchemaPath + '" (see option extendRefs)');
    if (it.opts.extendRefs !== true) {
      $refKeywords = false;
      it.logger.warn('$ref: keywords ignored in schema at path "' + it.errSchemaPath + '"');
    }
  }
  if (it.schema.$comment && it.opts.$comment) out += ' ' + it.RULES.all.$comment.code(it, '$comment');

  if ($typeSchema) {
    if (it.opts.coerceTypes) var $coerceToTypes = it.util.coerceToTypes(it.opts.coerceTypes, $typeSchema);

    var $rulesGroup = it.RULES.types[$typeSchema];
    if ($coerceToTypes || $typeIsArray || $rulesGroup === true || ($rulesGroup && !$shouldUseGroup($rulesGroup))) {
      $schemaPath = it.schemaPath + '.type';
      $errSchemaPath = it.errSchemaPath + '/type';
      var $method = $typeIsArray ? 'checkDataTypes' : 'checkDataType';
      out += ' if (' + it.util[$method]($typeSchema, $data, it.opts.strictNumbers, true) + ') { ';
      if ($coerceToTypes) {
        var $dataType = 'dataType' + $lvl,
          $coerced = 'coerced' + $lvl;
        out += ' var ' + $dataType + ' = typeof ' + $data + '; var ' + $coerced + ' = undefined; ';
        if (it.opts.coerceTypes == 'array')
          out += ' if (' + $dataType + " == 'object' && Array.isArray(" + $data + ') && ' + $data + '.length == 1) { ' + $data + ' = ' + $data + '[0]; ' + $dataType + ' = typeof ' + $data + '; if (' + it.util.checkDataType(it.schema.type, $data, it.opts.strictNumbers) + ') ' + $coerced + ' = ' + $data + '; } ';

        out += ' if (' + $coerced + ' !== undefined) ; ';
        var arr1 = $coerceToTypes;
        if (arr1)
          for (var $type, $i = -1, l1 = arr1.length - 1; $i < l1; )
            if (($type = arr1[++$i]) == 'string')
              out += ' else if (' + $dataType + " == 'number' || " + $dataType + " == 'boolean') " + $coerced + " = '' + " + $data + '; else if (' + $data + ' === null) ' + $coerced + " = ''; ";
            else if ($type == 'number' || $type == 'integer') {
              out += ' else if (' + $dataType + " == 'boolean' || " + $data + ' === null || (' + $dataType + " == 'string' && " + $data + ' && ' + $data + ' == +' + $data + ' ';
              if ($type == 'integer') out += ' && !(' + $data + ' % 1)';

              out += ')) ' + $coerced + ' = +' + $data + '; ';
            } else if ($type == 'boolean')
              out += ' else if (' + $data + " === 'false' || " + $data + ' === 0 || ' + $data + ' === null) ' + $coerced + ' = false; else if (' + $data + " === 'true' || " + $data + ' === 1) ' + $coerced + ' = true; ';
            else if ($type == 'null')
              out += ' else if (' + $data + " === '' || " + $data + ' === 0 || ' + $data + ' === false) ' + $coerced + ' = null; ';
            else if (it.opts.coerceTypes == 'array' && $type == 'array')
              out += ' else if (' + $dataType + " == 'string' || " + $dataType + " == 'number' || " + $dataType + " == 'boolean' || " + $data + ' == null) ' + $coerced + ' = [' + $data + ']; ';

        out += ' else {   ';
        ($$outStack = $$outStack || []).push(out);
        out = '';
        if (it.createErrors !== false) {
          out += " { keyword: '" + ($errorKeyword || 'type') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { type: '";
          out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

          out += "' } ";
          if (it.opts.messages !== false) {
            out += " , message: 'should be ";
            out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

            out += "' ";
          }
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

        out += ' } if (' + $coerced + ' !== undefined) {  ';
        var $parentData = $dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData';
        out += ' ' + $data + ' = ' + $coerced + '; ';
        $dataLvl || (out += 'if (' + $parentData + ' !== undefined)');

        out += ' ' + $parentData + '[' + ($dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty') + '] = ' + $coerced + '; } ';
      } else {
        ($$outStack = $$outStack || []).push(out);
        out = '';
        if (it.createErrors !== false) {
          out += " { keyword: '" + ($errorKeyword || 'type') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { type: '";
          out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

          out += "' } ";
          if (it.opts.messages !== false) {
            out += " , message: 'should be ";
            out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

            out += "' ";
          }
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
      out += ' } ';
    }
  }
  if (it.schema.$ref && !$refKeywords) {
    out += ' ' + it.RULES.all.$ref.code(it, '$ref') + ' ';
    if ($breakOnError) {
      out += ' } if (errors === ';
      out += $top ? '0' : 'errs_' + $lvl;

      out += ') { ';
      $closingBraces2 += '}';
    }
  } else {
    var arr2 = it.RULES;
    if (arr2)
      for (var i2 = -1, l2 = arr2.length - 1; i2 < l2; ) {
        if (!$shouldUseGroup(($rulesGroup = arr2[++i2]))) continue;

        if ($rulesGroup.type)
          out += ' if (' + it.util.checkDataType($rulesGroup.type, $data, it.opts.strictNumbers) + ') { ';

        if (it.opts.useDefaults)
          if ($rulesGroup.type == 'object' && it.schema.properties) {
            $schema = it.schema.properties;
            var arr3 = Object.keys($schema);
            if (arr3)
              for (var $propertyKey, i3 = -1, l3 = arr3.length - 1; i3 < l3; ) {
                if (($sch = $schema[($propertyKey = arr3[++i3])]).default === void 0) continue;

                var $passData = $data + it.util.getProperty($propertyKey);
                if (it.compositeRule) {
                  if (it.opts.strictDefaults) {
                    $defaultMsg = 'default is ignored for: ' + $passData;
                    if (it.opts.strictDefaults !== 'log') throw new Error($defaultMsg);
                    it.logger.warn($defaultMsg);
                  }
                } else {
                  out += ' if (' + $passData + ' === undefined ';
                  if (it.opts.useDefaults == 'empty')
                    out += ' || ' + $passData + ' === null || ' + $passData + " === '' ";

                  out += ' ) ' + $passData + ' = ';
                  out += it.opts.useDefaults == 'shared'
                    ? ' ' + it.useDefault($sch.default) + ' '
                    : ' ' + JSON.stringify($sch.default) + ' ';

                  out += '; ';
                }
              }
          } else if ($rulesGroup.type == 'array' && Array.isArray(it.schema.items)) {
            var arr4 = it.schema.items;
            if (arr4)
              for (var $sch, l4 = (($i = -1), arr4.length - 1); $i < l4; ) {
                if (($sch = arr4[++$i]).default === void 0) continue;

                $passData = $data + '[' + $i + ']';
                if (it.compositeRule) {
                  if (it.opts.strictDefaults) {
                    $defaultMsg = 'default is ignored for: ' + $passData;
                    if (it.opts.strictDefaults !== 'log') throw new Error($defaultMsg);
                    it.logger.warn($defaultMsg);
                  }
                } else {
                  out += ' if (' + $passData + ' === undefined ';
                  if (it.opts.useDefaults == 'empty')
                    out += ' || ' + $passData + ' === null || ' + $passData + " === '' ";

                  out += ' ) ' + $passData + ' = ';
                  out += it.opts.useDefaults == 'shared'
                    ? ' ' + it.useDefault($sch.default) + ' '
                    : ' ' + JSON.stringify($sch.default) + ' ';

                  out += '; ';
                }
              }
          }

        var arr5 = $rulesGroup.rules;
        if (arr5)
          for (var $rule, i5 = -1, l5 = arr5.length - 1; i5 < l5; )
            if ($shouldUseRule(($rule = arr5[++i5]))) {
              var $code = $rule.code(it, $rule.keyword, $rulesGroup.type);
              if ($code) {
                out += ' ' + $code + ' ';
                if ($breakOnError) $closingBraces1 += '}';
              }
            }

        if ($breakOnError) {
          out += ' ' + $closingBraces1 + ' ';
          $closingBraces1 = '';
        }
        if ($rulesGroup.type) {
          out += ' } ';
          if ($typeSchema && $typeSchema === $rulesGroup.type && !$coerceToTypes) {
            out += ' else { ';
            $schemaPath = it.schemaPath + '.type';
            $errSchemaPath = it.errSchemaPath + '/type';
            ($$outStack = $$outStack || []).push(out);
            out = '';
            if (it.createErrors !== false) {
              out += " { keyword: '" + ($errorKeyword || 'type') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { type: '";
              out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

              out += "' } ";
              if (it.opts.messages !== false) {
                out += " , message: 'should be ";
                out += $typeIsArray ? '' + $typeSchema.join(',') : '' + $typeSchema;

                out += "' ";
              }
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

            out += ' } ';
          }
        }
        if ($breakOnError) {
          out += ' if (errors === ';
          out += $top ? '0' : 'errs_' + $lvl;

          out += ') { ';
          $closingBraces2 += '}';
        }
      }
  }
  if ($breakOnError) out += ' ' + $closingBraces2 + ' ';

  if ($top) {
    if ($async) {
      out += ' if (errors === 0) return data;           ';
      out += ' else throw new ValidationError(vErrors); ';
    } else {
      out += ' validate.errors = vErrors; ';
      out += ' return errors === 0;       ';
    }
    out += ' }; return validate;';
  } else out += ' var ' + $valid + ' = errors === errs_' + $lvl + ';';

  function $shouldUseGroup($rulesGroup) {
    for (var rules = $rulesGroup.rules, i = 0; i < rules.length; i++)
      if ($shouldUseRule(rules[i])) return true;
  }

  function $shouldUseRule($rule) {
    return it.schema[$rule.keyword] !== void 0 || ($rule.implements && $ruleImplementsSomeKeyword($rule));
  }

  function $ruleImplementsSomeKeyword($rule) {
    for (var impl = $rule.implements, i = 0; i < impl.length; i++)
      if (it.schema[impl[i]] !== void 0) return true;
  }
  return out;
};

},
// 7
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  var $$outStack,
    $isMax = $keyword == 'maximum',
    $exclusiveKeyword = $isMax ? 'exclusiveMaximum' : 'exclusiveMinimum',
    $schemaExcl = it.schema[$exclusiveKeyword],
    $isDataExcl = it.opts.$data && $schemaExcl && $schemaExcl.$data,
    $op = $isMax ? '<' : '>',
    $notOp = $isMax ? '>' : '<',
    $errorKeyword = void 0;
  if (!$isData && typeof $schema != 'number' && $schema !== void 0)
    throw new Error($keyword + ' must be number');

  if (!$isDataExcl && $schemaExcl !== void 0 && typeof $schemaExcl != 'number' && typeof $schemaExcl != 'boolean')
    throw new Error($exclusiveKeyword + ' must be number or boolean');

  if ($isDataExcl) {
    var $schemaValueExcl = it.util.getData($schemaExcl.$data, $dataLvl, it.dataPathArr),
      $exclusive = 'exclusive' + $lvl,
      $exclType = 'exclType' + $lvl,
      $exclIsNumber = 'exclIsNumber' + $lvl,
      $opStr = "' + " + ($opExpr = 'op' + $lvl) + " + '";
    out += ' var schemaExcl' + $lvl + ' = ' + $schemaValueExcl + '; ';
    out += ' var ' + $exclusive + '; var ' + $exclType + ' = typeof ' + ($schemaValueExcl = 'schemaExcl' + $lvl) + '; if (' + $exclType + " != 'boolean' && " + $exclType + " != 'undefined' && " + $exclType + " != 'number') { ";
    $errorKeyword = $exclusiveKeyword;
    ($$outStack = $$outStack || []).push(out);
    out = '';
    if (it.createErrors !== false) {
      out += " { keyword: '" + ($errorKeyword || '_exclusiveLimit') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
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

    out += ' } else if ( ';
    if ($isData)
      out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

    out += ' ' + $exclType + " == 'number' ? ( (" + $exclusive + ' = ' + $schemaValue + ' === undefined || ' + $schemaValueExcl + ' ' + $op + '= ' + $schemaValue + ') ? ' + $data + ' ' + $notOp + '= ' + $schemaValueExcl + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) : ( (' + $exclusive + ' = ' + $schemaValueExcl + ' === true) ? ' + $data + ' ' + $notOp + '= ' + $schemaValue + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) || ' + $data + ' !== ' + $data + ') { var op' + $lvl + ' = ' + $exclusive + " ? '" + $op + "' : '" + $op + "='; ";
    if ($schema === void 0) {
      $errorKeyword = $exclusiveKeyword;
      $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
      $schemaValue = $schemaValueExcl;
      $isData = $isDataExcl;
    }
  } else {
    $opStr = $op;
    if (($exclIsNumber = typeof $schemaExcl == 'number') && $isData) {
      var $opExpr = "'" + $opStr + "'";
      out += ' if ( ';
      if ($isData)
        out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

      out += ' ( ' + $schemaValue + ' === undefined || ' + $schemaExcl + ' ' + $op + '= ' + $schemaValue + ' ? ' + $data + ' ' + $notOp + '= ' + $schemaExcl + ' : ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' ) || ' + $data + ' !== ' + $data + ') { ';
    } else {
      if ($exclIsNumber && $schema === void 0) {
        $exclusive = true;
        $errorKeyword = $exclusiveKeyword;
        $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
        $schemaValue = $schemaExcl;
        $notOp += '=';
      } else {
        if ($exclIsNumber) $schemaValue = Math[$isMax ? 'min' : 'max']($schemaExcl, $schema);
        if ($schemaExcl === (!$exclIsNumber || $schemaValue)) {
          $exclusive = true;
          $errorKeyword = $exclusiveKeyword;
          $errSchemaPath = it.errSchemaPath + '/' + $exclusiveKeyword;
          $notOp += '=';
        } else {
          $exclusive = false;
          $opStr += '=';
        }
      }
      $opExpr = "'" + $opStr + "'";
      out += ' if ( ';
      if ($isData)
        out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

      out += ' ' + $data + ' ' + $notOp + ' ' + $schemaValue + ' || ' + $data + ' !== ' + $data + ') { ';
    }
  }
  $errorKeyword = $errorKeyword || $keyword;
  ($$outStack = $$outStack || []).push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || '_limit') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { comparison: ' + $opExpr + ', limit: ' + $schemaValue + ', exclusive: ' + $exclusive + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should be " + $opStr + ' ';
      out += $isData ? "' + " + $schemaValue : $schemaValue + "'";
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

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

  out += ' } ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 8
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if (!$isData && typeof $schema != 'number') throw new Error($keyword + ' must be number');

  out += 'if ( ';
  if ($isData)
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

  out += ' ' + $data + '.length ' + ($keyword == 'maxItems' ? '>' : '<') + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword,
    $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || '_limitItems') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should NOT have ";
      out += $keyword == 'maxItems' ? 'more' : 'fewer';

      out += ' than ';
      out += $isData ? "' + " + $schemaValue + " + '" : '' + $schema;

      out += " items' ";
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += '} ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 9
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if (!$isData && typeof $schema != 'number') throw new Error($keyword + ' must be number');

  var $op = $keyword == 'maxLength' ? '>' : '<';
  out += 'if ( ';
  if ($isData)
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

  out += it.opts.unicode === false ? ' ' + $data + '.length ' : ' ucs2length(' + $data + ') ';

  out += ' ' + $op + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword,
    $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || '_limitLength') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should NOT be ";
      out += $keyword == 'maxLength' ? 'longer' : 'shorter';

      out += ' than ';
      out += $isData ? "' + " + $schemaValue + " + '" : '' + $schema;

      out += " characters' ";
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += '} ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 10
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if (!$isData && typeof $schema != 'number') throw new Error($keyword + ' must be number');

  out += 'if ( ';
  if ($isData)
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'number') || ";

  out += ' Object.keys(' + $data + ').length ' + ($keyword == 'maxProperties' ? '>' : '<') + ' ' + $schemaValue + ') { ';
  var $errorKeyword = $keyword,
    $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || '_limitProperties') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should NOT have ";
      out += $keyword == 'maxProperties' ? 'more' : 'fewer';

      out += ' than ';
      out += $isData ? "' + " + $schemaValue + " + '" : '' + $schema;

      out += " properties' ";
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += '} ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 11
function (module) {

module.exports = JSON.parse(
  '{"$schema":"http://json-schema.org/draft-07/schema#","$id":"http://json-schema.org/draft-07/schema#","title":"Core schema meta-schema","definitions":{"schemaArray":{"type":"array","minItems":1,"items":{"$ref":"#"}},"nonNegativeInteger":{"type":"integer","minimum":0},"nonNegativeIntegerDefault0":{"allOf":[{"$ref":"#/definitions/nonNegativeInteger"},{"default":0}]},"simpleTypes":{"enum":["array","boolean","integer","null","number","object","string"]},"stringArray":{"type":"array","items":{"type":"string"},"uniqueItems":true,"default":[]}},"type":["object","boolean"],"properties":{"$id":{"type":"string","format":"uri-reference"},"$schema":{"type":"string","format":"uri"},"$ref":{"type":"string","format":"uri-reference"},"$comment":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"default":true,"readOnly":{"type":"boolean","default":false},"examples":{"type":"array","items":true},"multipleOf":{"type":"number","exclusiveMinimum":0},"maximum":{"type":"number"},"exclusiveMaximum":{"type":"number"},"minimum":{"type":"number"},"exclusiveMinimum":{"type":"number"},"maxLength":{"$ref":"#/definitions/nonNegativeInteger"},"minLength":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"pattern":{"type":"string","format":"regex"},"additionalItems":{"$ref":"#"},"items":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/schemaArray"}],"default":true},"maxItems":{"$ref":"#/definitions/nonNegativeInteger"},"minItems":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"uniqueItems":{"type":"boolean","default":false},"contains":{"$ref":"#"},"maxProperties":{"$ref":"#/definitions/nonNegativeInteger"},"minProperties":{"$ref":"#/definitions/nonNegativeIntegerDefault0"},"required":{"$ref":"#/definitions/stringArray"},"additionalProperties":{"$ref":"#"},"definitions":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"properties":{"type":"object","additionalProperties":{"$ref":"#"},"default":{}},"patternProperties":{"type":"object","additionalProperties":{"$ref":"#"},"propertyNames":{"format":"regex"},"default":{}},"dependencies":{"type":"object","additionalProperties":{"anyOf":[{"$ref":"#"},{"$ref":"#/definitions/stringArray"}]}},"propertyNames":{"$ref":"#"},"const":true,"enum":{"type":"array","items":true,"minItems":1,"uniqueItems":true},"type":{"anyOf":[{"$ref":"#/definitions/simpleTypes"},{"type":"array","items":{"$ref":"#/definitions/simpleTypes"},"minItems":1,"uniqueItems":true}]},"format":{"type":"string"},"contentMediaType":{"type":"string"},"contentEncoding":{"type":"string"},"if":{"$ref":"#"},"then":{"$ref":"#"},"else":{"$ref":"#"},"allOf":{"$ref":"#/definitions/schemaArray"},"anyOf":{"$ref":"#/definitions/schemaArray"},"oneOf":{"$ref":"#/definitions/schemaArray"},"not":{"$ref":"#"}},"default":true}'
);

},
// 12
function (module, exports, __webpack_require__) {

var compileSchema = __webpack_require__(13),
  resolve = __webpack_require__(1),
  Cache = __webpack_require__(17),
  SchemaObject = __webpack_require__(4),
  stableStringify = __webpack_require__(5),
  formats = __webpack_require__(18),
  rules = __webpack_require__(19),
  $dataMetaSchema = __webpack_require__(40),
  util = __webpack_require__(0);

module.exports = Ajv;

Ajv.prototype.validate = validate;
Ajv.prototype.compile = compile;
Ajv.prototype.addSchema = addSchema;
Ajv.prototype.addMetaSchema = addMetaSchema;
Ajv.prototype.validateSchema = validateSchema;
Ajv.prototype.getSchema = getSchema;
Ajv.prototype.removeSchema = removeSchema;
Ajv.prototype.addFormat = addFormat;
Ajv.prototype.errorsText = errorsText;

Ajv.prototype._addSchema = _addSchema;
Ajv.prototype._compile = _compile;

Ajv.prototype.compileAsync = __webpack_require__(41);
var customKeyword = __webpack_require__(42);
Ajv.prototype.addKeyword = customKeyword.add;
Ajv.prototype.getKeyword = customKeyword.get;
Ajv.prototype.removeKeyword = customKeyword.remove;
Ajv.prototype.validateKeyword = customKeyword.validate;

var errorClasses = __webpack_require__(3);
Ajv.ValidationError = errorClasses.Validation;
Ajv.MissingRefError = errorClasses.MissingRef;
Ajv.$dataMetaSchema = $dataMetaSchema;

var META_SCHEMA_ID = 'http://json-schema.org/draft-07/schema',

  META_IGNORE_OPTIONS = ['removeAdditional', 'useDefaults', 'coerceTypes', 'strictDefaults'],
  META_SUPPORT_DATA = ['/properties'];

function Ajv(opts) {
  if (!(this instanceof Ajv)) return new Ajv(opts);
  opts = this._opts = util.copy(opts) || {};
  setLogger(this);
  this._schemas = {};
  this._refs = {};
  this._fragments = {};
  this._formats = formats(opts.format);

  this._cache = opts.cache || new Cache();
  this._loadingSchemas = {};
  this._compilations = [];
  this.RULES = rules();
  this._getId = chooseGetId(opts);

  opts.loopRequired = opts.loopRequired || Infinity;
  if (opts.errorDataPath == 'property') opts._errorDataPathProperty = true;
  if (opts.serialize === void 0) opts.serialize = stableStringify;
  this._metaOpts = getMetaSchemaOptions(this);

  opts.formats && addInitialFormats(this);
  opts.keywords && addInitialKeywords(this);
  addDefaultMetaSchema(this);
  typeof opts.meta == 'object' && this.addMetaSchema(opts.meta);
  opts.nullable && this.addKeyword('nullable', { metaSchema: { type: 'boolean' } });
  addInitialSchemas(this);
}

function validate(schemaKeyRef, data) {
  var v;
  if (typeof schemaKeyRef == 'string') {
    if (!(v = this.getSchema(schemaKeyRef)))
      throw new Error('no schema with key or ref "' + schemaKeyRef + '"');
  } else {
    var schemaObj = this._addSchema(schemaKeyRef);
    v = schemaObj.validate || this._compile(schemaObj);
  }

  var valid = v(data);
  if (v.$async !== true) this.errors = v.errors;
  return valid;
}

function compile(schema, _meta) {
  var schemaObj = this._addSchema(schema, void 0, _meta);
  return schemaObj.validate || this._compile(schemaObj);
}

function addSchema(schema, key, _skipValidation, _meta) {
  if (Array.isArray(schema)) {
    for (var i = 0; i < schema.length; i++) this.addSchema(schema[i], void 0, _skipValidation, _meta);
    return this;
  }
  var id = this._getId(schema);
  if (id !== void 0 && typeof id != 'string') throw new Error('schema id must be string');
  checkUnique(this, (key = resolve.normalizeId(key || id)));
  this._schemas[key] = this._addSchema(schema, _skipValidation, _meta, true);
  return this;
}

function addMetaSchema(schema, key, skipValidation) {
  this.addSchema(schema, key, skipValidation, true);
  return this;
}

function validateSchema(schema, throwOrLogError) {
  var $schema = schema.$schema;
  if ($schema !== void 0 && typeof $schema != 'string') throw new Error('$schema must be a string');
  if (!($schema = $schema || this._opts.defaultMeta || defaultMeta(this))) {
    this.logger.warn('meta-schema not available');
    this.errors = null;
    return true;
  }
  var valid = this.validate($schema, schema);
  if (!valid && throwOrLogError) {
    var message = 'schema is invalid: ' + this.errorsText();
    if (this._opts.validateSchema != 'log') throw new Error(message);
    this.logger.error(message);
  }
  return valid;
}

function defaultMeta(self) {
  var meta = self._opts.meta;
  self._opts.defaultMeta = typeof meta == 'object'
    ? self._getId(meta) || meta
    : self.getSchema(META_SCHEMA_ID)
    ? META_SCHEMA_ID
    : void 0;
  return self._opts.defaultMeta;
}

function getSchema(keyRef) {
  var schemaObj = _getSchemaObj(this, keyRef);
  switch (typeof schemaObj) {
    case 'object': return schemaObj.validate || this._compile(schemaObj);
    case 'string': return this.getSchema(schemaObj);
    case 'undefined': return _getSchemaFragment(this, keyRef);
  }
}

function _getSchemaFragment(self, ref) {
  var res = resolve.schema.call(self, { schema: {} }, ref);
  if (res) {
    var schema = res.schema,
      root = res.root,
      baseId = res.baseId,
      v = compileSchema.call(self, schema, root, void 0, baseId);
    self._fragments[ref] = new SchemaObject({
      ref: ref,
      fragment: true,
      schema: schema,
      root: root,
      baseId: baseId,
      validate: v
    });
    return v;
  }
}

function _getSchemaObj(self, keyRef) {
  keyRef = resolve.normalizeId(keyRef);
  return self._schemas[keyRef] || self._refs[keyRef] || self._fragments[keyRef];
}

function removeSchema(schemaKeyRef) {
  if (schemaKeyRef instanceof RegExp) {
    _removeAllSchemas(this, this._schemas, schemaKeyRef);
    _removeAllSchemas(this, this._refs, schemaKeyRef);
    return this;
  }
  switch (typeof schemaKeyRef) {
    case 'undefined':
      _removeAllSchemas(this, this._schemas);
      _removeAllSchemas(this, this._refs);
      this._cache.clear();
      return this;
    case 'string':
      var schemaObj = _getSchemaObj(this, schemaKeyRef);
      schemaObj && this._cache.del(schemaObj.cacheKey);
      delete this._schemas[schemaKeyRef];
      delete this._refs[schemaKeyRef];
      return this;
    case 'object':
      var serialize = this._opts.serialize,
        cacheKey = serialize ? serialize(schemaKeyRef) : schemaKeyRef;
      this._cache.del(cacheKey);
      var id = this._getId(schemaKeyRef);
      if (id) {
        id = resolve.normalizeId(id);
        delete this._schemas[id];
        delete this._refs[id];
      }
  }
  return this;
}

function _removeAllSchemas(self, schemas, regex) {
  for (var keyRef in schemas) {
    var schemaObj = schemas[keyRef];
    if (!schemaObj.meta && (!regex || regex.test(keyRef))) {
      self._cache.del(schemaObj.cacheKey);
      delete schemas[keyRef];
    }
  }
}

function _addSchema(schema, skipValidation, meta, shouldAddSchema) {
  if (typeof schema != 'object' && typeof schema != 'boolean')
    throw new Error('schema should be object or boolean');
  var serialize = this._opts.serialize,
    cacheKey = serialize ? serialize(schema) : schema,
    cached = this._cache.get(cacheKey);
  if (cached) return cached;

  shouldAddSchema = shouldAddSchema || this._opts.addUsedSchema !== false;

  var id = resolve.normalizeId(this._getId(schema));
  id && shouldAddSchema && checkUnique(this, id);

  var recursiveMeta,
    willValidate = this._opts.validateSchema !== false && !skipValidation;
  willValidate && !(recursiveMeta = id && id == resolve.normalizeId(schema.$schema)) &&
    this.validateSchema(schema, true);

  var localRefs = resolve.ids.call(this, schema);

  var schemaObj = new SchemaObject({
    id: id,
    schema: schema,
    localRefs: localRefs,
    cacheKey: cacheKey,
    meta: meta
  });

  if (id[0] != '#' && shouldAddSchema) this._refs[id] = schemaObj;
  this._cache.put(cacheKey, schemaObj);

  willValidate && recursiveMeta && this.validateSchema(schema, true);

  return schemaObj;
}

function _compile(schemaObj, root) {
  if (schemaObj.compiling) {
    schemaObj.validate = callValidate;
    callValidate.schema = schemaObj.schema;
    callValidate.errors = null;
    callValidate.root = root || callValidate;
    if (schemaObj.schema.$async === true) callValidate.$async = true;
    return callValidate;
  }
  schemaObj.compiling = true;

  var currentOpts, v;
  if (schemaObj.meta) {
    currentOpts = this._opts;
    this._opts = this._metaOpts;
  }

  try {
    v = compileSchema.call(this, schemaObj.schema, root, schemaObj.localRefs);
  } catch (e) {
    delete schemaObj.validate;
    throw e;
  } finally {
    schemaObj.compiling = false;
    if (schemaObj.meta) this._opts = currentOpts;
  }

  schemaObj.validate = v;
  schemaObj.refs = v.refs;
  schemaObj.refVal = v.refVal;
  schemaObj.root = v.root;
  return v;

  function callValidate() {
    var _validate = schemaObj.validate,
      result = _validate.apply(this, arguments);
    callValidate.errors = _validate.errors;
    return result;
  }
}

function chooseGetId(opts) {
  switch (opts.schemaId) {
    case 'auto': return _get$IdOrId;
    case 'id': return _getId;
    default: return _get$Id;
  }
}

function _getId(schema) {
  schema.$id && this.logger.warn('schema $id ignored', schema.$id);
  return schema.id;
}

function _get$Id(schema) {
  schema.id && this.logger.warn('schema id ignored', schema.id);
  return schema.$id;
}

function _get$IdOrId(schema) {
  if (schema.$id && schema.id && schema.$id != schema.id)
    throw new Error('schema $id is different from id');
  return schema.$id || schema.id;
}

function errorsText(errors, options) {
  if (!(errors = errors || this.errors)) return 'No errors';
  var separator = (options = options || {}).separator === void 0 ? ', ' : options.separator,
    dataVar = options.dataVar === void 0 ? 'data' : options.dataVar,

    text = '';
  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    if (e) text += dataVar + e.dataPath + ' ' + e.message + separator;
  }
  return text.slice(0, -separator.length);
}

function addFormat(name, format) {
  if (typeof format == 'string') format = new RegExp(format);
  this._formats[name] = format;
  return this;
}

function addDefaultMetaSchema(self) {
  var $dataSchema;
  if (self._opts.$data) {
    $dataSchema = __webpack_require__(45);
    self.addMetaSchema($dataSchema, $dataSchema.$id, true);
  }
  if (self._opts.meta === false) return;
  var metaSchema = __webpack_require__(11);
  if (self._opts.$data) metaSchema = $dataMetaSchema(metaSchema, META_SUPPORT_DATA);
  self.addMetaSchema(metaSchema, META_SCHEMA_ID, true);
  self._refs['http://json-schema.org/schema'] = META_SCHEMA_ID;
}

function addInitialSchemas(self) {
  var optsSchemas = self._opts.schemas;
  if (!optsSchemas) return;
  if (Array.isArray(optsSchemas)) self.addSchema(optsSchemas);
  else for (var key in optsSchemas) self.addSchema(optsSchemas[key], key);
}

function addInitialFormats(self) {
  for (var name in self._opts.formats) {
    var format = self._opts.formats[name];
    self.addFormat(name, format);
  }
}

function addInitialKeywords(self) {
  for (var name in self._opts.keywords) {
    var keyword = self._opts.keywords[name];
    self.addKeyword(name, keyword);
  }
}

function checkUnique(self, id) {
  if (self._schemas[id] || self._refs[id])
    throw new Error('schema with key or id "' + id + '" already exists');
}

function getMetaSchemaOptions(self) {
  var metaOpts = util.copy(self._opts);
  for (var i = 0; i < META_IGNORE_OPTIONS.length; i++) delete metaOpts[META_IGNORE_OPTIONS[i]];
  return metaOpts;
}

function setLogger(self) {
  var logger = self._opts.logger;
  if (logger === false) self.logger = { log: noop, warn: noop, error: noop };
  else {
    if (logger === void 0) logger = console;
    if (!(typeof logger == 'object' && logger.log && logger.warn && logger.error))
      throw new Error('logger must implement log, warn and error methods');
    self.logger = logger;
  }
}

function noop() {}

},
// 13
function (module, exports, __webpack_require__) {

var resolve = __webpack_require__(1),
  util = __webpack_require__(0),
  errorClasses = __webpack_require__(3),
  stableStringify = __webpack_require__(5),

  validateGenerator = __webpack_require__(6),

  ucs2length = util.ucs2length,
  equal = __webpack_require__(2),

  ValidationError = errorClasses.Validation;

module.exports = compile;

function compile(schema, root, localRefs, baseId) {
  var self = this,
    opts = this._opts,
    refVal = [void 0],
    refs = {},
    patterns = [],
    patternsHash = {},
    defaults = [],
    defaultsHash = {},
    customRules = [];

  root = root || { schema: schema, refVal: refVal, refs: refs };

  var c = checkCompiling.call(this, schema, root, baseId),
    compilation = this._compilations[c.index];
  if (c.compiling) return (compilation.callValidate = callValidate);

  var formats = this._formats,
    RULES = this.RULES;

  try {
    var v = localCompile(schema, root, localRefs, baseId);
    compilation.validate = v;
    var cv = compilation.callValidate;
    if (cv) {
      cv.schema = v.schema;
      cv.errors = null;
      cv.refs = v.refs;
      cv.refVal = v.refVal;
      cv.root = v.root;
      cv.$async = v.$async;
      if (opts.sourceCode) cv.source = v.source;
    }
    return v;
  } finally {
    endCompiling.call(this, schema, root, baseId);
  }

  function callValidate() {
    var validate = compilation.validate,
      result = validate.apply(this, arguments);
    callValidate.errors = validate.errors;
    return result;
  }

  function localCompile(_schema, _root, localRefs, baseId) {
    var isRoot = !_root || (_root && _root.schema == _schema);
    if (_root.schema != root.schema) return compile.call(self, _schema, _root, localRefs, baseId);

    var validate,
      $async = _schema.$async === true;

    var sourceCode = validateGenerator({
      isTop: true,
      schema: _schema,
      isRoot: isRoot,
      baseId: baseId,
      root: _root,
      schemaPath: '',
      errSchemaPath: '#',
      errorPath: '""',
      MissingRefError: errorClasses.MissingRef,
      RULES: RULES,
      validate: validateGenerator,
      util: util,
      resolve: resolve,
      resolveRef: resolveRef,
      usePattern: usePattern,
      useDefault: useDefault,
      useCustomRule: useCustomRule,
      opts: opts,
      formats: formats,
      logger: self.logger,
      self: self
    });

    sourceCode = vars(refVal, refValCode) + vars(patterns, patternCode) +
      vars(defaults, defaultCode) + vars(customRules, customRuleCode) + sourceCode;

    if (opts.processCode) sourceCode = opts.processCode(sourceCode, _schema);
    try {
      validate = new Function(
        'self', 'RULES', 'formats', 'root', 'refVal', 'defaults', 'customRules', 'equal', 'ucs2length', 'ValidationError',
        sourceCode
      )(
        self, RULES, formats, root, refVal, defaults, customRules, equal, ucs2length, ValidationError
      );

      refVal[0] = validate;
    } catch (e) {
      self.logger.error('Error compiling schema, function code:', sourceCode);
      throw e;
    }

    validate.schema = _schema;
    validate.errors = null;
    validate.refs = refs;
    validate.refVal = refVal;
    validate.root = isRoot ? validate : _root;
    if ($async) validate.$async = true;
    if (opts.sourceCode === true)
      validate.source = { code: sourceCode, patterns: patterns, defaults: defaults };

    return validate;
  }

  function resolveRef(baseId, ref, isRoot) {
    ref = resolve.url(baseId, ref);
    var _refVal, refCode,
      refIndex = refs[ref];
    if (refIndex !== void 0)
      return resolvedRef((_refVal = refVal[refIndex]), (refCode = 'refVal[' + refIndex + ']')); // redundant

    if (!isRoot && root.refs) {
      var rootRefId = root.refs[ref];
      if (rootRefId !== void 0)
        return resolvedRef((_refVal = root.refVal[rootRefId]), (refCode = addLocalRef(ref, _refVal)));
    }

    refCode = addLocalRef(ref);
    var v = resolve.call(self, localCompile, root, ref);
    if (v === void 0) {
      var localSchema = localRefs && localRefs[ref];
      if (localSchema)
        v = resolve.inlineRef(localSchema, opts.inlineRefs)
          ? localSchema
          : compile.call(self, localSchema, root, localRefs, baseId);
    }

    if (v === void 0) removeLocalRef(ref);
    else {
      replaceLocalRef(ref, v);
      return resolvedRef(v, refCode);
    }
  }

  function addLocalRef(ref, v) {
    var refId = refVal.length;
    refVal[refId] = v;
    refs[ref] = refId;
    return 'refVal' + refId;
  }

  function removeLocalRef(ref) {
    delete refs[ref];
  }

  function replaceLocalRef(ref, v) {
    var refId = refs[ref];
    refVal[refId] = v;
  }

  function resolvedRef(refVal, code) {
    return typeof refVal == 'object' || typeof refVal == 'boolean'
      ? { code: code, schema: refVal, inline: true }
      : { code: code, $async: refVal && !!refVal.$async };
  }

  function usePattern(regexStr) {
    var index = patternsHash[regexStr];
    if (index === void 0) {
      index = patternsHash[regexStr] = patterns.length;
      patterns[index] = regexStr;
    }
    return 'pattern' + index;
  }

  function useDefault(value) {
    switch (typeof value) {
      case 'boolean':
      case 'number':
        return '' + value;
      case 'string':
        return util.toQuotedString(value);
      case 'object':
        if (value === null) return 'null';
        var valueStr = stableStringify(value),
          index = defaultsHash[valueStr];
        if (index === void 0) {
          index = defaultsHash[valueStr] = defaults.length;
          defaults[index] = value;
        }
        return 'default' + index;
    }
  }

  function useCustomRule(rule, schema, parentSchema, it) {
    if (self._opts.validateSchema !== false) {
      var deps = rule.definition.dependencies;
      if (deps && !deps.every(function (keyword) {
        return Object.prototype.hasOwnProperty.call(parentSchema, keyword);
      }))
        throw new Error('parent schema must have all required keywords: ' + deps.join(','));

      var validateSchema = rule.definition.validateSchema;
      if (validateSchema && !validateSchema(schema)) {
        var message = 'keyword schema is invalid: ' + self.errorsText(validateSchema.errors);
        if (self._opts.validateSchema != 'log') throw new Error(message);
        self.logger.error(message);
      }
    }

    var validate,
      compile = rule.definition.compile,
      inline = rule.definition.inline,
      macro = rule.definition.macro;

    if (compile) validate = compile.call(self, schema, parentSchema, it);
    else if (macro) {
      validate = macro.call(self, schema, parentSchema, it);
      opts.validateSchema === false || self.validateSchema(validate, true);
    } else if (inline) validate = inline.call(self, it, rule.keyword, schema, parentSchema);
    else if (!(validate = rule.definition.validate)) return;

    if (validate === void 0)
      throw new Error('custom keyword "' + rule.keyword + '"failed to compile');

    var index = customRules.length;
    customRules[index] = validate;

    return { code: 'customRule' + index, validate: validate };
  }
}

function checkCompiling(schema, root, baseId) {
  var index = compIndex.call(this, schema, root, baseId);
  if (index >= 0) return { index: index, compiling: true };
  index = this._compilations.length;
  this._compilations[index] = { schema: schema, root: root, baseId: baseId };
  return { index: index, compiling: false };
}

function endCompiling(schema, root, baseId) {
  var i = compIndex.call(this, schema, root, baseId);
  i < 0 || this._compilations.splice(i, 1);
}

function compIndex(schema, root, baseId) {
  for (var i = 0; i < this._compilations.length; i++) {
    var c = this._compilations[i];
    if (c.schema == schema && c.root == root && c.baseId == baseId) return i;
  }
  return -1;
}

function patternCode(i, patterns) {
  return 'var pattern' + i + ' = new RegExp(' + util.toQuotedString(patterns[i]) + ');';
}

function defaultCode(i) {
  return 'var default' + i + ' = defaults[' + i + '];';
}

function refValCode(i, refVal) {
  return refVal[i] === void 0 ? '' : 'var refVal' + i + ' = refVal[' + i + '];';
}

function customRuleCode(i) {
  return 'var customRule' + i + ' = customRules[' + i + '];';
}

function vars(arr, statement) {
  if (!arr.length) return '';
  var code = '';
  for (var i = 0; i < arr.length; i++) code += statement(i, arr);
  return code;
}

},
// 14
function (module) {

module.exports = require('./uri-js');

},
// 15
function (module) {

module.exports = function (str) {
  var length = 0;
  for (var value, len = str.length, pos = 0; pos < len; ) {
    length++;
    (value = str.charCodeAt(pos++)) >= 0xD800 && value <= 0xDBFF && pos < len &&
      ((value = str.charCodeAt(pos)) & 0xFC00) == 0xDC00 && pos++;
  }
  return length;
};

},
// 16
function (module) {

var traverse = (module.exports = function (schema, opts, cb) {
  if (typeof opts == 'function') {
    cb = opts;
    opts = {};
  }

  var pre = typeof (cb = opts.cb || cb) == 'function' ? cb : cb.pre || function () {};

  _traverse(opts, pre, cb.post || function () {}, schema, '', schema);
});

traverse.keywords = {
  additionalItems: true,
  items: true,
  contains: true,
  additionalProperties: true,
  propertyNames: true,
  not: true
};

traverse.arrayKeywords = {
  items: true,
  allOf: true,
  anyOf: true,
  oneOf: true
};

traverse.propsKeywords = {
  definitions: true,
  properties: true,
  patternProperties: true,
  dependencies: true
};

traverse.skipKeywords = {
  default: true,
  enum: true,
  const: true,
  required: true,
  maximum: true,
  minimum: true,
  exclusiveMaximum: true,
  exclusiveMinimum: true,
  multipleOf: true,
  maxLength: true,
  minLength: true,
  pattern: true,
  format: true,
  maxItems: true,
  minItems: true,
  uniqueItems: true,
  maxProperties: true,
  minProperties: true
};

function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
  if (schema && typeof schema == 'object' && !Array.isArray(schema)) {
    pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    for (var key in schema) {
      var sch = schema[key];
      if (Array.isArray(sch)) {
        if (key in traverse.arrayKeywords)
          for (var i = 0; i < sch.length; i++)
            _traverse(opts, pre, post, sch[i], jsonPtr + '/' + key + '/' + i, rootSchema, jsonPtr, key, schema, i);
      } else if (key in traverse.propsKeywords) {
        if (sch && typeof sch == 'object')
          for (var prop in sch)
            _traverse(opts, pre, post, sch[prop], jsonPtr + '/' + key + '/' + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
      } else if (key in traverse.keywords || (opts.allKeys && !(key in traverse.skipKeywords)))
        _traverse(opts, pre, post, sch, jsonPtr + '/' + key, rootSchema, jsonPtr, key, schema);
    }
    post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
  }
}

function escapeJsonPtr(str) {
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}

},
// 17
function (module) {

var Cache = (module.exports = function () {
  this._cache = {};
});

Cache.prototype.put = function (key, value) {
  this._cache[key] = value;
};

Cache.prototype.get = function (key) {
  return this._cache[key];
};

Cache.prototype.del = function (key) {
  delete this._cache[key];
};

Cache.prototype.clear = function () {
  this._cache = {};
};

},
// 18
function (module, exports, __webpack_require__) {

var util = __webpack_require__(0);

var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/,
  DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  TIME = /^(\d\d):(\d\d):(\d\d)(\.\d+)?(z|[+-]\d\d(?::?\d\d)?)?$/i,
  HOSTNAME = /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
  URI =
    /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  URIREF =
    /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
  URITEMPLATE = /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
  URL =
    /^(?:(?:http[s\u017F]?|ftp):\/\/)(?:(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+(?::(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?@)?(?:(?!10(?:\.[0-9]{1,3}){3})(?!127(?:\.[0-9]{1,3}){3})(?!169\.254(?:\.[0-9]{1,3}){2})(?!192\.168(?:\.[0-9]{1,3}){2})(?!172\.(?:1[6-9]|2[0-9]|3[01])(?:\.[0-9]{1,3}){2})(?:[1-9][0-9]?|1[0-9][0-9]|2[01][0-9]|22[0-3])(?:\.(?:1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){2}(?:\.(?:[1-9][0-9]?|1[0-9][0-9]|2[0-4][0-9]|25[0-4]))|(?:(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)(?:\.(?:(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+-)*(?:[0-9a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+)*(?:\.(?:(?:[a-z\xA1-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]){2,})))(?::[0-9]{2,5})?(?:\/(?:[\0-\x08\x0E-\x1F!-\x9F\xA1-\u167F\u1681-\u1FFF\u200B-\u2027\u202A-\u202E\u2030-\u205E\u2060-\u2FFF\u3001-\uD7FF\uE000-\uFEFE\uFF00-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*)?$/i,
  UUID = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
  JSON_POINTER = /^(?:\/(?:[^~/]|~0|~1)*)*$/,
  JSON_POINTER_URI_FRAGMENT = /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
  RELATIVE_JSON_POINTER = /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/;

module.exports = formats;

function formats(mode) {
  mode = mode == 'full' ? 'full' : 'fast';
  return util.copy(formats[mode]);
}

formats.fast = {
  date: /^\d\d\d\d-[0-1]\d-[0-3]\d$/,
  time: /^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i,
  'date-time': /^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i,
  uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
  'uri-reference': /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
  'uri-template': URITEMPLATE,
  url: URL,
  email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  hostname: HOSTNAME,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  uuid: UUID,
  'json-pointer': JSON_POINTER,
  'json-pointer-uri-fragment': JSON_POINTER_URI_FRAGMENT,
  'relative-json-pointer': RELATIVE_JSON_POINTER
};

formats.full = {
  date: date,
  time: time,
  'date-time': date_time,
  uri: uri,
  'uri-reference': URIREF,
  'uri-template': URITEMPLATE,
  url: URL,
  email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  hostname: HOSTNAME,
  ipv4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  ipv6: /^\s*(?:(?:(?:[0-9a-f]{1,4}:){7}(?:[0-9a-f]{1,4}|:))|(?:(?:[0-9a-f]{1,4}:){6}(?::[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){5}(?:(?:(?::[0-9a-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9a-f]{1,4}:){4}(?:(?:(?::[0-9a-f]{1,4}){1,3})|(?:(?::[0-9a-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){3}(?:(?:(?::[0-9a-f]{1,4}){1,4})|(?:(?::[0-9a-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){2}(?:(?:(?::[0-9a-f]{1,4}){1,5})|(?:(?::[0-9a-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9a-f]{1,4}:){1}(?:(?:(?::[0-9a-f]{1,4}){1,6})|(?:(?::[0-9a-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9a-f]{1,4}){1,7})|(?:(?::[0-9a-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$/i,
  regex: regex,
  uuid: UUID,
  'json-pointer': JSON_POINTER,
  'json-pointer-uri-fragment': JSON_POINTER_URI_FRAGMENT,
  'relative-json-pointer': RELATIVE_JSON_POINTER
};

function isLeapYear(year) {
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
}

function date(str) {
  var matches = str.match(DATE);
  if (!matches) return false;

  var year = +matches[1],
    month = +matches[2],
    day = +matches[3];

  return month >= 1 && month <= 12 && day >= 1 &&
    day <= (month == 2 && isLeapYear(year) ? 29 : DAYS[month]);
}

function time(str, full) {
  var matches = str.match(TIME);
  if (!matches) return false;

  var hour = matches[1],
    minute = matches[2],
    second = matches[3],
    timeZone = matches[5];
  return ((hour <= 23 && minute <= 59 && second <= 59) ||
    (hour == 23 && minute == 59 && second == 60)) && (!full || timeZone);
}

var DATE_TIME_SEPARATOR = /t|\s/i;
function date_time(str) {
  var dateTime = str.split(DATE_TIME_SEPARATOR);
  return dateTime.length == 2 && date(dateTime[0]) && time(dateTime[1], true);
}

var NOT_URI_FRAGMENT = /\/|:/;
function uri(str) {
  return NOT_URI_FRAGMENT.test(str) && URI.test(str);
}

var Z_ANCHOR = /[^\\]\\Z/;
function regex(str) {
  if (Z_ANCHOR.test(str)) return false;
  try {
    new RegExp(str);
    return true;
  } catch (e) {
    return false;
  }
}

},
// 19
function (module, exports, __webpack_require__) {

var ruleModules = __webpack_require__(20),
  toHash = __webpack_require__(0).toHash;

module.exports = function () {
  var RULES = [
    {
      type: 'number',
      rules: [
        { maximum: ['exclusiveMaximum'] }, { minimum: ['exclusiveMinimum'] }, 'multipleOf', 'format'
      ]
    },
    { type: 'string', rules: ['maxLength', 'minLength', 'pattern', 'format'] },
    { type: 'array', rules: ['maxItems', 'minItems', 'items', 'contains', 'uniqueItems'] },
    {
      type: 'object',
      rules: [
        'maxProperties', 'minProperties', 'required', 'dependencies', 'propertyNames',
        { properties: ['additionalProperties', 'patternProperties'] }
      ]
    },
    { rules: ['$ref', 'const', 'enum', 'not', 'anyOf', 'oneOf', 'allOf', 'if'] }
  ];

  var ALL = ['type', '$comment'];
  var KEYWORDS = [
    '$schema', '$id', 'id', '$data', '$async', 'title',
    'description', 'default', 'definitions',
    'examples', 'readOnly', 'writeOnly',
    'contentMediaType', 'contentEncoding',
    'additionalItems', 'then', 'else'
  ];
  var TYPES = ['number', 'integer', 'string', 'array', 'object', 'boolean', 'null'];
  RULES.all = toHash(ALL);
  RULES.types = toHash(TYPES);

  RULES.forEach(function (group) {
    group.rules = group.rules.map(function (keyword) {
      var implKeywords;
      if (typeof keyword == 'object') {
        var key = Object.keys(keyword)[0];
        implKeywords = keyword[key];
        keyword = key;
        implKeywords.forEach(function (k) {
          ALL.push(k);
          RULES.all[k] = true;
        });
      }
      ALL.push(keyword);
      return (RULES.all[keyword] = {
        keyword: keyword,
        code: ruleModules[keyword],
        implements: implKeywords
      });
    });

    RULES.all.$comment = { keyword: '$comment', code: ruleModules.$comment };

    if (group.type) RULES.types[group.type] = group;
  });

  RULES.keywords = toHash(ALL.concat(KEYWORDS));
  RULES.custom = {};

  return RULES;
};

},
// 20
function (module, exports, __webpack_require__) {

module.exports = {
  $ref: __webpack_require__(21),
  allOf: __webpack_require__(22),
  anyOf: __webpack_require__(23),
  $comment: __webpack_require__(24),
  const: __webpack_require__(25),
  contains: __webpack_require__(26),
  dependencies: __webpack_require__(27),
  enum: __webpack_require__(28),
  format: __webpack_require__(29),
  if: __webpack_require__(30),
  items: __webpack_require__(31),
  maximum: __webpack_require__(7),
  minimum: __webpack_require__(7),
  maxItems: __webpack_require__(8),
  minItems: __webpack_require__(8),
  maxLength: __webpack_require__(9),
  minLength: __webpack_require__(9),
  maxProperties: __webpack_require__(10),
  minProperties: __webpack_require__(10),
  multipleOf: __webpack_require__(32),
  not: __webpack_require__(33),
  oneOf: __webpack_require__(34),
  pattern: __webpack_require__(35),
  properties: __webpack_require__(36),
  propertyNames: __webpack_require__(37),
  required: __webpack_require__(38),
  uniqueItems: __webpack_require__(39),
  validate: __webpack_require__(6)
};

},
// 21
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $async, $refCode, $$outStack,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl;
  if ($schema == '#' || $schema == '#/')
    if (it.isRoot) {
      $async = it.async;
      $refCode = 'validate';
    } else {
      $async = it.root.schema.$async === true;
      $refCode = 'root.refVal[0]';
    }
  else {
    var $refVal = it.resolveRef(it.baseId, $schema, it.isRoot);
    if ($refVal === void 0) {
      var $message = it.MissingRefError.message(it.baseId, $schema);
      if (it.opts.missingRefs == 'fail') {
        it.logger.error($message);
        ($$outStack = $$outStack || []).push(out);
        out = '';
        if (it.createErrors !== false) {
          out += " { keyword: '$ref' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { ref: '" + it.util.escapeQuotes($schema) + "' } ";
          if (it.opts.messages !== false)
            out += " , message: 'can\\'t resolve reference " + it.util.escapeQuotes($schema) + "' ";

          if (it.opts.verbose)
            out += ' , schema: ' + it.util.toQuotedString($schema) + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

          out += ' } ';
        } else out += ' {} ';

        var __err = out;
        out = $$outStack.pop();
        out += it.compositeRule || !$breakOnError
          ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
          : it.async
          ? ' throw new ValidationError([' + __err + ']); '
          : ' validate.errors = [' + __err + ']; return false; ';

        if ($breakOnError) out += ' if (false) { ';
      } else if (it.opts.missingRefs == 'ignore') {
        it.logger.warn($message);
        if ($breakOnError) out += ' if (true) { ';
      } else throw new it.MissingRefError(it.baseId, $schema, $message);
    } else if ($refVal.inline) {
      var $it = it.util.copy(it);
      $it.level++;
      var $nextValid = 'valid' + $it.level;
      $it.schema = $refVal.schema;
      $it.schemaPath = '';
      $it.errSchemaPath = $schema;
      out += ' ' + it.validate($it).replace(/validate\.schema/g, $refVal.code) + ' ';
      if ($breakOnError) out += ' if (' + $nextValid + ') { ';
    } else {
      $async = $refVal.$async === true || (it.async && $refVal.$async !== false);
      $refCode = $refVal.code;
    }
  }
  if (!$refCode) return out;

  ($$outStack = $$outStack || []).push(out);
  out = '';
  out += it.opts.passContext ? ' ' + $refCode + '.call(this, ' : ' ' + $refCode + '( ';

  out += ' ' + $data + ", (dataPath || '')";
  if (it.errorPath != '""') out += ' + ' + it.errorPath;

  var __callValidate = (out += ' , ' + ($dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData') + ' , ' + ($dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty') + ', rootData)  ');
  out = $$outStack.pop();
  if ($async) {
    if (!it.async) throw new Error('async schema referenced by sync schema');
    if ($breakOnError) out += ' var ' + $valid + '; ';

    out += ' try { await ' + __callValidate + '; ';
    if ($breakOnError) out += ' ' + $valid + ' = true; ';

    out += ' } catch (e) { if (!(e instanceof ValidationError)) throw e; if (vErrors === null) vErrors = e.errors; else vErrors = vErrors.concat(e.errors); errors = vErrors.length; ';
    if ($breakOnError) out += ' ' + $valid + ' = false; ';

    out += ' } ';
    if ($breakOnError) out += ' if (' + $valid + ') { ';
  } else {
    out += ' if (!' + __callValidate + ') { if (vErrors === null) vErrors = ' + $refCode + '.errors; else vErrors = vErrors.concat(' + $refCode + '.errors); errors = vErrors.length; } ';
    if ($breakOnError) out += ' else { ';
  }

  return out;
};

},
// 22
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $it = it.util.copy(it),
    $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level,
    $currentBaseId = $it.baseId,
    $allSchemasEmpty = true,
    arr1 = $schema;
  if (arr1)
    for (var $sch, $i = -1, l1 = arr1.length - 1; $i < l1; ) {
      $sch = arr1[++$i];
      if (!(it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)))
        continue;
      $allSchemasEmpty = false;
      $it.schema = $sch;
      $it.schemaPath = $schemaPath + '[' + $i + ']';
      $it.errSchemaPath = $errSchemaPath + '/' + $i;
      out += '  ' + it.validate($it) + ' ';
      $it.baseId = $currentBaseId;
      if ($breakOnError) {
        out += ' if (' + $nextValid + ') { ';
        $closingBraces += '}';
      }
    }

  if ($breakOnError) out += $allSchemasEmpty ? ' if (true) { ' : ' ' + $closingBraces.slice(0, -1) + ' ';

  return out;
};

},
// 23
function (module) {

module.exports = function (it, $keyword, $ruleType) {
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
  var $nextValid = 'valid' + $it.level;
  if (!$schema.every(function ($sch) {
    return it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all);
  })) {
    if ($breakOnError) out += ' if (true) { ';

    return out;
  }
  var $currentBaseId = $it.baseId;
  out += ' var ' + $errs + ' = errors; var ' + $valid + ' = false;  ';
  var $wasComposite = it.compositeRule;
  it.compositeRule = $it.compositeRule = true;
  var arr1 = $schema;
  if (arr1)
    for (var $sch, $i = -1, l1 = arr1.length - 1; $i < l1; ) {
      $sch = arr1[++$i];
      $it.schema = $sch;
      $it.schemaPath = $schemaPath + '[' + $i + ']';
      $it.errSchemaPath = $errSchemaPath + '/' + $i;
      out += '  ' + it.validate($it) + ' ';
      $it.baseId = $currentBaseId;
      out += ' ' + $valid + ' = ' + $valid + ' || ' + $nextValid + '; if (!' + $valid + ') { ';
      $closingBraces += '}';
    }

  it.compositeRule = $it.compositeRule = $wasComposite;
  out += ' ' + $closingBraces + ' if (!' + $valid + ') {   var err =   ';
  if (it.createErrors !== false) {
    out += " { keyword: 'anyOf' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
    if (it.opts.messages !== false) out += " , message: 'should match some schema in anyOf' ";

    if (it.opts.verbose)
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

    out += ' } ';
  } else out += ' {} ';

  out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  if (!it.compositeRule && $breakOnError)
    out += it.async
      ? ' throw new ValidationError(vErrors); '
      : ' validate.errors = vErrors; return false; ';

  out += ' } else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';
  if (it.opts.allErrors) out += ' } ';

  return out;
};

},
// 24
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $schema = it.schema[$keyword],
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $comment = it.util.toQuotedString($schema);
  if (it.opts.$comment === true)
    out += ' console.log(' + $comment + ');';
  else if (typeof it.opts.$comment == 'function')
    out += ' self._opts.$comment(' + $comment + ', ' + it.util.toQuotedString($errSchemaPath) + ', validate.root.schema);';

  return out;
};

},
// 25
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData)
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';

  $isData || (out += ' var schema' + $lvl + ' = validate.schema' + $schemaPath + ';');

  out += 'var ' + $valid + ' = equal(' + $data + ', schema' + $lvl + '); if (!' + $valid + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'const' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { allowedValue: schema' + $lvl + ' } ';
    if (it.opts.messages !== false) out += " , message: 'should be equal to constant' ";

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

  out += ' }';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 26
function (module) {

module.exports = function (it, $keyword, $ruleType) {
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
  var $nextValid = 'valid' + $it.level,
    $idx = 'i' + $lvl,
    $dataNxt = ($it.dataLevel = it.dataLevel + 1),
    $nextData = 'data' + $dataNxt,
    $currentBaseId = it.baseId,
    $nonEmptySchema = it.opts.strictKeywords ? (typeof $schema == 'object' && Object.keys($schema).length > 0) || $schema === false : it.util.schemaHasRules($schema, it.RULES.all);
  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if ($nonEmptySchema) {
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + $nextValid + ' = false; for (var ' + $idx + ' = 0; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    var $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    out += it.util.varOccurences($code, $nextData) < 2
      ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
      : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

    out += ' if (' + $nextValid + ') break; }  ';
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + $closingBraces + ' if (!' + $nextValid + ') {';
  } else out += ' if (' + $data + '.length == 0) {';

  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'contains' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
    if (it.opts.messages !== false) out += " , message: 'should contain a valid item' ";

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

  out += ' } else { ';
  if ($nonEmptySchema)
    out += '  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';

  if (it.opts.allErrors) out += ' } ';

  return out;
};

},
// 27
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $errs = 'errs__' + $lvl,
    $it = it.util.copy(it),
    $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level,
    $schemaDeps = {},
    $propertyDeps = {},
    $ownProperties = it.opts.ownProperties;
  for ($property in $schema) {
    if ($property == '__proto__') continue;
    var $sch = $schema[$property],
      $deps = Array.isArray($sch) ? $propertyDeps : $schemaDeps;
    $deps[$property] = $sch;
  }
  out += 'var ' + $errs + ' = errors;';
  var $currentErrorPath = it.errorPath;
  out += 'var missing' + $lvl + ';';
  for (var $property in $propertyDeps) {
    if (!($deps = $propertyDeps[$property]).length) continue;

    out += ' if ( ' + $data + it.util.getProperty($property) + ' !== undefined ';
    if ($ownProperties)
      out += ' && Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($property) + "') ";

    if ($breakOnError) {
      out += ' && ( ';
      var arr1 = $deps;
      if (arr1)
        for (var $i = -1, l1 = arr1.length - 1; $i < l1; ) {
          $propertyKey = arr1[++$i];
          if ($i) out += ' || ';

          out += ' ( ( ' + ($useData = $data + ($prop = it.util.getProperty($propertyKey))) + ' === undefined ';
          if ($ownProperties)
            out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

          out += ') && (missing' + $lvl + ' = ' + it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop) + ') ) ';
        }

      out += ')) {  ';
      var $propertyPath = 'missing' + $lvl,
        $missingProperty = "' + " + $propertyPath + " + '";
      if (it.opts._errorDataPathProperty)
        it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;

      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = '';
      if (it.createErrors !== false) {
        out += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { property: '" + it.util.escapeQuotes($property) + "', missingProperty: '" + $missingProperty + "', depsCount: " + $deps.length + ", deps: '" + it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(', ')) + "' } ";
        if (it.opts.messages !== false) {
          out += " , message: 'should have ";
          out += $deps.length == 1
            ? 'property ' + it.util.escapeQuotes($deps[0])
            : 'properties ' + it.util.escapeQuotes($deps.join(', '));

          out += ' when property ' + it.util.escapeQuotes($property) + " is present' ";
        }
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
    } else {
      out += ' ) { ';
      var arr2 = $deps;
      if (arr2)
        for (var $propertyKey, i2 = -1, l2 = arr2.length - 1; i2 < l2; ) {
          $propertyKey = arr2[++i2];
          var $prop = it.util.getProperty($propertyKey),
            $useData = (($missingProperty = it.util.escapeQuotes($propertyKey)), $data + $prop);
          if (it.opts._errorDataPathProperty)
            it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);

          out += ' if ( ' + $useData + ' === undefined ';
          if ($ownProperties)
            out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

          out += ') {  var err =   ';
          if (it.createErrors !== false) {
            out += " { keyword: 'dependencies' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { property: '" + it.util.escapeQuotes($property) + "', missingProperty: '" + $missingProperty + "', depsCount: " + $deps.length + ", deps: '" + it.util.escapeQuotes($deps.length == 1 ? $deps[0] : $deps.join(', ')) + "' } ";
            if (it.opts.messages !== false) {
              out += " , message: 'should have ";
              out += $deps.length == 1
                ? 'property ' + it.util.escapeQuotes($deps[0])
                : 'properties ' + it.util.escapeQuotes($deps.join(', '));

              out += ' when property ' + it.util.escapeQuotes($property) + " is present' ";
            }
            if (it.opts.verbose)
              out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

            out += ' } ';
          } else out += ' {} ';

          out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
        }
    }
    out += ' }   ';
    if ($breakOnError) {
      $closingBraces += '}';
      out += ' else { ';
    }
  }
  it.errorPath = $currentErrorPath;
  var $currentBaseId = $it.baseId;
  for (var $property in $schemaDeps) {
    $sch = $schemaDeps[$property];
    if (!(it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)))
      continue;
    out += ' ' + $nextValid + ' = true; if ( ' + $data + it.util.getProperty($property) + ' !== undefined ';
    if ($ownProperties)
      out += ' && Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($property) + "') ";

    out += ') { ';
    $it.schema = $sch;
    $it.schemaPath = $schemaPath + it.util.getProperty($property);
    $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($property);
    out += '  ' + it.validate($it) + ' ';
    $it.baseId = $currentBaseId;
    out += ' }  ';
    if ($breakOnError) {
      out += ' if (' + $nextValid + ') { ';
      $closingBraces += '}';
    }
  }
  if ($breakOnError) out += '   ' + $closingBraces + ' if (' + $errs + ' == errors) {';

  return out;
};

},
// 28
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData)
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';

  var $i = 'i' + $lvl,
    $vSchema = 'schema' + $lvl;
  $isData || (out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + ';');

  out += 'var ' + $valid + ';';
  if ($isData)
    out += ' if (schema' + $lvl + ' === undefined) ' + $valid + ' = true; else if (!Array.isArray(schema' + $lvl + ')) ' + $valid + ' = false; else {';

  out += $valid + ' = false;for (var ' + $i + '=0; ' + $i + '<' + $vSchema + '.length; ' + $i + '++) if (equal(' + $data + ', ' + $vSchema + '[' + $i + '])) { ' + $valid + ' = true; break; }';
  if ($isData) out += '  }  ';

  out += ' if (!' + $valid + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'enum' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { allowedValues: schema' + $lvl + ' } ';
    if (it.opts.messages !== false) out += " , message: 'should be equal to one of the allowed values' ";

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

  out += ' }';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 29
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || '');
  if (it.opts.format === false) {
    if ($breakOnError) out += ' if (true) { ';

    return out;
  }
  var $schemaValue,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  var $format, $isObject,
    $unknownFormats = it.opts.unknownFormats,
    $allowUnknown = Array.isArray($unknownFormats);
  if ($isData) {
    out += ' var ' + ($format = 'format' + $lvl) + ' = formats[' + $schemaValue + ']; var ' + ($isObject = 'isObject' + $lvl) + ' = typeof ' + $format + " == 'object' && !(" + $format + ' instanceof RegExp) && ' + $format + '.validate; var ' + ($formatType = 'formatType' + $lvl) + ' = ' + $isObject + ' && ' + $format + ".type || 'string'; if (" + $isObject + ') { ';
    if (it.async) out += ' var async' + $lvl + ' = ' + $format + '.async; ';

    out += ' ' + $format + ' = ' + $format + '.validate; } if (  ';
    if ($isData)
      out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'string') || ";

    out += ' (';
    if ($unknownFormats != 'ignore') {
      out += ' (' + $schemaValue + ' && !' + $format + ' ';
      if ($allowUnknown) out += ' && self._opts.unknownFormats.indexOf(' + $schemaValue + ') == -1 ';

      out += ') || ';
    }
    out += ' (' + $format + ' && ' + $formatType + " == '" + $ruleType + "' && !(typeof " + $format + " == 'function' ? ";
    out += it.async
      ? ' (async' + $lvl + ' ? await ' + $format + '(' + $data + ') : ' + $format + '(' + $data + ')) '
      : ' ' + $format + '(' + $data + ') ';

    out += ' : ' + $format + '.test(' + $data + '))))) {';
  } else {
    if (!($format = it.formats[$schema])) {
      if ($unknownFormats == 'ignore') {
        it.logger.warn('unknown format "' + $schema + '" ignored in schema at path "' + it.errSchemaPath + '"');
        if ($breakOnError) out += ' if (true) { ';

        return out;
      }
      if ($allowUnknown && $unknownFormats.indexOf($schema) >= 0) {
        if ($breakOnError) out += ' if (true) { ';

        return out;
      }
      throw new Error('unknown format "' + $schema + '" is used in schema at path "' + it.errSchemaPath + '"');
    }
    var $formatType = (($isObject = typeof $format == 'object' && !($format instanceof RegExp) && $format.validate) && $format.type) || 'string';
    if ($isObject) {
      var $async = $format.async === true;
      $format = $format.validate;
    }
    if ($formatType != $ruleType) {
      if ($breakOnError) out += ' if (true) { ';

      return out;
    }
    if ($async) {
      if (!it.async) throw new Error('async format in sync schema');
      out += ' if (!(await ' + ($formatRef = 'formats' + it.util.getProperty($schema) + '.validate') + '(' + $data + '))) { ';
    } else {
      out += ' if (! ';
      var $formatRef = 'formats' + it.util.getProperty($schema);
      if ($isObject) $formatRef += '.validate';
      out += typeof $format == 'function'
        ? ' ' + $formatRef + '(' + $data + ') '
        : ' ' + $formatRef + '.test(' + $data + ') ';

      out += ') { ';
    }
  }
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'format' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { format:  ';
    out += $isData ? '' + $schemaValue : '' + it.util.toQuotedString($schema);

    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match format "';
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

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += ' } ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 30
function (module) {

module.exports = function (it, $keyword, $ruleType) {
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
    $it = it.util.copy(it);
  $it.level++;
  var $nextValid = 'valid' + $it.level,
    $thenSch = it.schema.then,
    $elseSch = it.schema.else,
    $thenPresent = $thenSch !== void 0 && (it.opts.strictKeywords ? (typeof $thenSch == 'object' && Object.keys($thenSch).length > 0) || $thenSch === false : it.util.schemaHasRules($thenSch, it.RULES.all)),
    $elsePresent = $elseSch !== void 0 && (it.opts.strictKeywords ? (typeof $elseSch == 'object' && Object.keys($elseSch).length > 0) || $elseSch === false : it.util.schemaHasRules($elseSch, it.RULES.all)),
    $currentBaseId = $it.baseId;
  if (!($thenPresent || $elsePresent)) {
    if ($breakOnError) out += ' if (true) { ';

    return out;
  }
  var $ifClause;
  $it.createErrors = false;
  $it.schema = $schema;
  $it.schemaPath = $schemaPath;
  $it.errSchemaPath = $errSchemaPath;
  out += ' var ' + $errs + ' = errors; var ' + $valid + ' = true;  ';
  var $wasComposite = it.compositeRule;
  it.compositeRule = $it.compositeRule = true;
  out += '  ' + it.validate($it) + ' ';
  $it.baseId = $currentBaseId;
  $it.createErrors = true;
  out += '  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; }  ';
  it.compositeRule = $it.compositeRule = $wasComposite;
  if ($thenPresent) {
    out += ' if (' + $nextValid + ') {  ';
    $it.schema = it.schema.then;
    $it.schemaPath = it.schemaPath + '.then';
    $it.errSchemaPath = it.errSchemaPath + '/then';
    out += '  ' + it.validate($it) + ' ';
    $it.baseId = $currentBaseId;
    out += ' ' + $valid + ' = ' + $nextValid + '; ';
    if ($thenPresent && $elsePresent) out += ' var ' + ($ifClause = 'ifClause' + $lvl) + " = 'then'; ";
    else $ifClause = "'then'";

    out += ' } ';
    if ($elsePresent) out += ' else { ';
  } else out += ' if (!' + $nextValid + ') { ';

  if ($elsePresent) {
    $it.schema = it.schema.else;
    $it.schemaPath = it.schemaPath + '.else';
    $it.errSchemaPath = it.errSchemaPath + '/else';
    out += '  ' + it.validate($it) + ' ';
    $it.baseId = $currentBaseId;
    out += ' ' + $valid + ' = ' + $nextValid + '; ';
    if ($thenPresent && $elsePresent) out += ' var ' + ($ifClause = 'ifClause' + $lvl) + " = 'else'; ";
    else $ifClause = "'else'";

    out += ' } ';
  }
  out += ' if (!' + $valid + ') {   var err =   ';
  if (it.createErrors !== false) {
    out += " { keyword: 'if' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { failingKeyword: ' + $ifClause + ' } ';
    if (it.opts.messages !== false)
      out += " , message: 'should match \"' + " + $ifClause + " + '\" schema' ";

    if (it.opts.verbose)
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

    out += ' } ';
  } else out += ' {} ';

  out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  if (!it.compositeRule && $breakOnError)
    out += it.async
      ? ' throw new ValidationError(vErrors); '
      : ' validate.errors = vErrors; return false; ';

  out += ' }   ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 31
function (module) {

module.exports = function (it, $keyword, $ruleType) {
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
  var $nextValid = 'valid' + $it.level,
    $idx = 'i' + $lvl,
    $dataNxt = ($it.dataLevel = it.dataLevel + 1),
    $nextData = 'data' + $dataNxt,
    $currentBaseId = it.baseId;
  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if (Array.isArray($schema)) {
    var $additionalItems = it.schema.additionalItems;
    if ($additionalItems === false) {
      out += ' ' + $valid + ' = ' + $data + '.length <= ' + $schema.length + '; ';
      var $currErrSchemaPath = $errSchemaPath;
      $errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += '  if (!' + $valid + ') {   ';
      var $$outStack = $$outStack || [];
      $$outStack.push(out);
      out = '';
      if (it.createErrors !== false) {
        out += " { keyword: 'additionalItems' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { limit: ' + $schema.length + ' } ';
        if (it.opts.messages !== false)
          out += " , message: 'should NOT have more than " + $schema.length + " items' ";

        if (it.opts.verbose)
          out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

        out += ' } ';
      } else out += ' {} ';

      var __err = out;
      out = $$outStack.pop();
      out += it.compositeRule || !$breakOnError
        ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
        : it.async
        ? ' throw new ValidationError([' + __err + ']); '
        : ' validate.errors = [' + __err + ']; return false; ';

      out += ' } ';
      $errSchemaPath = $currErrSchemaPath;
      if ($breakOnError) {
        $closingBraces += '}';
        out += ' else { ';
      }
    }
    var arr1 = $schema;
    if (arr1)
      for (var $sch, $i = -1, l1 = arr1.length - 1; $i < l1; ) {
        $sch = arr1[++$i];
        if (!(it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)))
          continue;
        out += ' ' + $nextValid + ' = true; if (' + $data + '.length > ' + $i + ') { ';
        var $passData = $data + '[' + $i + ']';
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        $it.errorPath = it.util.getPathExpr(it.errorPath, $i, it.opts.jsonPointers, true);
        $it.dataPathArr[$dataNxt] = $i;
        var $code = it.validate($it);
        $it.baseId = $currentBaseId;
        out += it.util.varOccurences($code, $nextData) < 2
          ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
          : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

        out += ' }  ';
        if ($breakOnError) {
          out += ' if (' + $nextValid + ') { ';
          $closingBraces += '}';
        }
      }

    if (typeof $additionalItems == 'object' && (it.opts.strictKeywords ? (typeof $additionalItems == 'object' && Object.keys($additionalItems).length > 0) || $additionalItems === false : it.util.schemaHasRules($additionalItems, it.RULES.all))) {
      $it.schema = $additionalItems;
      $it.schemaPath = it.schemaPath + '.additionalItems';
      $it.errSchemaPath = it.errSchemaPath + '/additionalItems';
      out += ' ' + $nextValid + ' = true; if (' + $data + '.length > ' + $schema.length + ') {  for (var ' + $idx + ' = ' + $schema.length + '; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
      $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
      $passData = $data + '[' + $idx + ']';
      $it.dataPathArr[$dataNxt] = $idx;
      $code = it.validate($it);
      $it.baseId = $currentBaseId;
      out += it.util.varOccurences($code, $nextData) < 2
        ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
        : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

      if ($breakOnError) out += ' if (!' + $nextValid + ') break; ';

      out += ' } }  ';
      if ($breakOnError) {
        out += ' if (' + $nextValid + ') { ';
        $closingBraces += '}';
      }
    }
  } else if (it.opts.strictKeywords ? (typeof $schema == 'object' && Object.keys($schema).length > 0) || $schema === false : it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += '  for (var ' + $idx + ' = 0; ' + $idx + ' < ' + $data + '.length; ' + $idx + '++) { ';
    $it.errorPath = it.util.getPathExpr(it.errorPath, $idx, it.opts.jsonPointers, true);
    $passData = $data + '[' + $idx + ']';
    $it.dataPathArr[$dataNxt] = $idx;
    $code = it.validate($it);
    $it.baseId = $currentBaseId;
    out += it.util.varOccurences($code, $nextData) < 2
      ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
      : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

    if ($breakOnError) out += ' if (!' + $nextValid + ') break; ';

    out += ' }';
  }
  if ($breakOnError) out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';

  return out;
};

},
// 32
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if (!$isData && typeof $schema != 'number') throw new Error($keyword + ' must be number');

  out += 'var division' + $lvl + ';if (';
  if ($isData)
    out += ' ' + $schemaValue + ' !== undefined && ( typeof ' + $schemaValue + " != 'number' || ";

  out += ' (division' + $lvl + ' = ' + $data + ' / ' + $schemaValue + ', ';
  out += it.opts.multipleOfPrecision
    ? ' Math.abs(Math.round(division' + $lvl + ') - division' + $lvl + ') > 1e-' + it.opts.multipleOfPrecision + ' '
    : ' division' + $lvl + ' !== parseInt(division' + $lvl + ') ';

  out += ' ) ';
  if ($isData) out += '  )  ';

  out += ' ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'multipleOf' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { multipleOf: ' + $schemaValue + ' } ';
    if (it.opts.messages !== false) {
      out += " , message: 'should be multiple of ";
      out += $isData ? "' + " + $schemaValue : $schemaValue + "'";
    }
    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += '} ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 33
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $errs = 'errs__' + $lvl,
    $it = it.util.copy(it);
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  if (it.opts.strictKeywords ? (typeof $schema == 'object' && Object.keys($schema).length > 0) || $schema === false : it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    out += ' var ' + $errs + ' = errors;  ';
    var $allErrorsOption,
      $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    $it.createErrors = false;
    if ($it.opts.allErrors) {
      $allErrorsOption = $it.opts.allErrors;
      $it.opts.allErrors = false;
    }
    out += ' ' + it.validate($it) + ' ';
    $it.createErrors = true;
    if ($allErrorsOption) $it.opts.allErrors = $allErrorsOption;
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (' + $nextValid + ') {   ';
    var $$outStack = $$outStack || [];
    $$outStack.push(out);
    out = '';
    if (it.createErrors !== false) {
      out += " { keyword: 'not' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) out += " , message: 'should NOT be valid' ";

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

    out += ' } else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; } ';
    if (it.opts.allErrors) out += ' } ';
  } else {
    out += '  var err =   ';
    if (it.createErrors !== false) {
      out += " { keyword: 'not' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: {} ';
      if (it.opts.messages !== false) out += " , message: 'should NOT be valid' ";

      if (it.opts.verbose)
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

      out += ' } ';
    } else out += ' {} ';

    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if ($breakOnError) out += ' if (false) { ';
  }
  return out;
};

},
// 34
function (module) {

module.exports = function (it, $keyword, $ruleType) {
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
  var $nextValid = 'valid' + $it.level,
    $currentBaseId = $it.baseId,
    $prevValid = 'prevValid' + $lvl,
    $passingSchemas = 'passingSchemas' + $lvl;
  out += 'var ' + $errs + ' = errors , ' + $prevValid + ' = false , ' + $valid + ' = false , ' + $passingSchemas + ' = null; ';
  var $wasComposite = it.compositeRule;
  it.compositeRule = $it.compositeRule = true;
  var arr1 = $schema;
  if (arr1)
    for (var $sch, $i = -1, l1 = arr1.length - 1; $i < l1; ) {
      $sch = arr1[++$i];
      if (it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)) {
        $it.schema = $sch;
        $it.schemaPath = $schemaPath + '[' + $i + ']';
        $it.errSchemaPath = $errSchemaPath + '/' + $i;
        out += '  ' + it.validate($it) + ' ';
        $it.baseId = $currentBaseId;
      } else out += ' var ' + $nextValid + ' = true; ';

      if ($i) {
        out += ' if (' + $nextValid + ' && ' + $prevValid + ') { ' + $valid + ' = false; ' + $passingSchemas + ' = [' + $passingSchemas + ', ' + $i + ']; } else { ';
        $closingBraces += '}';
      }
      out += ' if (' + $nextValid + ') { ' + $valid + ' = ' + $prevValid + ' = true; ' + $passingSchemas + ' = ' + $i + '; }';
    }

  it.compositeRule = $it.compositeRule = $wasComposite;
  out += $closingBraces + 'if (!' + $valid + ') {   var err =   ';
  if (it.createErrors !== false) {
    out += " { keyword: 'oneOf' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { passingSchemas: ' + $passingSchemas + ' } ';
    if (it.opts.messages !== false) out += " , message: 'should match exactly one schema in oneOf' ";

    if (it.opts.verbose)
      out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

    out += ' } ';
  } else out += ' {} ';

  out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
  if (!it.compositeRule && $breakOnError)
    out += it.async
      ? ' throw new ValidationError(vErrors); '
      : ' validate.errors = vErrors; return false; ';

  out += '} else {  errors = ' + $errs + '; if (vErrors !== null) { if (' + $errs + ') vErrors.length = ' + $errs + '; else vErrors = null; }';
  if (it.opts.allErrors) out += ' } ';

  return out;
};

},
// 35
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  out += 'if ( ';
  if ($isData)
    out += ' (' + $schemaValue + ' !== undefined && typeof ' + $schemaValue + " != 'string') || ";

  out += ' !' + ($isData ? '(new RegExp(' + $schemaValue + '))' : it.usePattern($schema)) + '.test(' + $data + ') ) {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'pattern' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { pattern:  ';
    out += $isData ? '' + $schemaValue : '' + it.util.toQuotedString($schema);

    out += '  } ';
    if (it.opts.messages !== false) {
      out += ' , message: \'should match pattern "';
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

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += '} ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 36
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $errs = 'errs__' + $lvl,
    $it = it.util.copy(it),
    $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level,
    $key = 'key' + $lvl,
    $idx = 'idx' + $lvl,
    $dataNxt = ($it.dataLevel = it.dataLevel + 1),
    $nextData = 'data' + $dataNxt,
    $dataProperties = 'dataProperties' + $lvl,
    $schemaKeys = Object.keys($schema || {}).filter(notProto),
    $pProperties = it.schema.patternProperties || {},
    $pPropertyKeys = Object.keys($pProperties).filter(notProto),
    $aProperties = it.schema.additionalProperties,
    $someProperties = $schemaKeys.length || $pPropertyKeys.length,
    $noAdditional = $aProperties === false,
    $additionalIsSchema = typeof $aProperties == 'object' && Object.keys($aProperties).length,
    $removeAdditional = it.opts.removeAdditional,
    $checkAdditional = $noAdditional || $additionalIsSchema || $removeAdditional,
    $ownProperties = it.opts.ownProperties,
    $currentBaseId = it.baseId,
    $required = it.schema.required;
  if ($required && (!it.opts.$data || !$required.$data) && $required.length < it.opts.loopRequired)
    var $requiredHash = it.util.toHash($required);

  function notProto(p) {
    return p !== '__proto__';
  }
  out += 'var ' + $errs + ' = errors;var ' + $nextValid + ' = true;';
  if ($ownProperties) out += ' var ' + $dataProperties + ' = undefined;';

  var $$outStack;
  if ($checkAdditional) {
    out += $ownProperties
      ? ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; '
      : ' for (var ' + $key + ' in ' + $data + ') { ';

    if ($someProperties) {
      out += ' var isAdditional' + $lvl + ' = !(false ';
      if ($schemaKeys.length)
        if ($schemaKeys.length > 8)
          out += ' || validate.schema' + $schemaPath + '.hasOwnProperty(' + $key + ') ';
        else {
          var arr1 = $schemaKeys;
          if (arr1)
            for (var i1 = -1, l1 = arr1.length - 1; i1 < l1; ) {
              $propertyKey = arr1[++i1];
              out += ' || ' + $key + ' == ' + it.util.toQuotedString($propertyKey) + ' ';
            }
        }

      if ($pPropertyKeys.length) {
        var arr2 = $pPropertyKeys;
        if (arr2)
          for (var $i = -1, l2 = arr2.length - 1; $i < l2; ) {
            $pProperty = arr2[++$i];
            out += ' || ' + it.usePattern($pProperty) + '.test(' + $key + ') ';
          }
      }
      out += ' ); if (isAdditional' + $lvl + ') { ';
    }
    if ($removeAdditional == 'all') out += ' delete ' + $data + '[' + $key + ']; ';
    else {
      var $currentErrorPath = it.errorPath,
        $additionalProperty = "' + " + $key + " + '";
      if (it.opts._errorDataPathProperty)
        it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);

      if ($noAdditional)
        if ($removeAdditional) out += ' delete ' + $data + '[' + $key + ']; ';
        else {
          out += ' ' + $nextValid + ' = false; ';
          var $currErrSchemaPath = $errSchemaPath;
          $errSchemaPath = it.errSchemaPath + '/additionalProperties';
          ($$outStack = $$outStack || []).push(out);
          out = '';
          if (it.createErrors !== false) {
            out += " { keyword: 'additionalProperties' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { additionalProperty: '" + $additionalProperty + "' } ";
            if (it.opts.messages !== false) {
              out += " , message: '";
              out += it.opts._errorDataPathProperty
                ? 'is an invalid additional property'
                : 'should NOT have additional properties';

              out += "' ";
            }
            if (it.opts.verbose)
              out += ' , schema: false , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

            out += ' } ';
          } else out += ' {} ';

          var __err = out;
          out = $$outStack.pop();
          out += it.compositeRule || !$breakOnError
            ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
            : it.async
            ? ' throw new ValidationError([' + __err + ']); '
            : ' validate.errors = [' + __err + ']; return false; ';

          $errSchemaPath = $currErrSchemaPath;
          if ($breakOnError) out += ' break; ';
        }
      else if ($additionalIsSchema)
        if ($removeAdditional == 'failing') {
          out += ' var ' + $errs + ' = errors;  ';
          var $wasComposite = it.compositeRule;
          it.compositeRule = $it.compositeRule = true;
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          var $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          var $code = it.validate($it);
          $it.baseId = $currentBaseId;
          out += it.util.varOccurences($code, $nextData) < 2
            ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
            : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

          out += ' if (!' + $nextValid + ') { errors = ' + $errs + '; if (validate.errors !== null) { if (errors) validate.errors.length = errors; else validate.errors = null; } delete ' + $data + '[' + $key + ']; }  ';
          it.compositeRule = $it.compositeRule = $wasComposite;
        } else {
          $it.schema = $aProperties;
          $it.schemaPath = it.schemaPath + '.additionalProperties';
          $it.errSchemaPath = it.errSchemaPath + '/additionalProperties';
          $it.errorPath = it.opts._errorDataPathProperty ? it.errorPath : it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
          $passData = $data + '[' + $key + ']';
          $it.dataPathArr[$dataNxt] = $key;
          $code = it.validate($it);
          $it.baseId = $currentBaseId;
          out += it.util.varOccurences($code, $nextData) < 2
            ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
            : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

          if ($breakOnError) out += ' if (!' + $nextValid + ') break; ';
        }

      it.errorPath = $currentErrorPath;
    }
    if ($someProperties) out += ' } ';

    out += ' }  ';
    if ($breakOnError) {
      out += ' if (' + $nextValid + ') { ';
      $closingBraces += '}';
    }
  }
  var $useDefaults = it.opts.useDefaults && !it.compositeRule;
  if ($schemaKeys.length) {
    var arr3 = $schemaKeys;
    if (arr3)
      for (var $propertyKey, i3 = -1, l3 = arr3.length - 1; i3 < l3; ) {
        var $sch = $schema[($propertyKey = arr3[++i3])];
        if (it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)) {
          var $prop = it.util.getProperty($propertyKey),
            $hasDefault = (($passData = $data + $prop), $useDefaults && $sch.default !== void 0);
          $it.schema = $sch;
          $it.schemaPath = $schemaPath + $prop;
          $it.errSchemaPath = $errSchemaPath + '/' + it.util.escapeFragment($propertyKey);
          $it.errorPath = it.util.getPath(it.errorPath, $propertyKey, it.opts.jsonPointers);
          $it.dataPathArr[$dataNxt] = it.util.toQuotedString($propertyKey);
          $code = it.validate($it);
          $it.baseId = $currentBaseId;
          if (it.util.varOccurences($code, $nextData) < 2) {
            $code = it.util.varReplace($code, $nextData, $passData);
            var $useData = $passData;
          } else {
            $useData = $nextData;
            out += ' var ' + $nextData + ' = ' + $passData + '; ';
          }
          if ($hasDefault) out += ' ' + $code + ' ';
          else {
            if ($requiredHash && $requiredHash[$propertyKey]) {
              out += ' if ( ' + $useData + ' === undefined ';
              if ($ownProperties)
                out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

              out += ') { ' + $nextValid + ' = false; ';
              $currentErrorPath = it.errorPath;
              $currErrSchemaPath = $errSchemaPath;
              var $missingProperty = it.util.escapeQuotes($propertyKey);
              if (it.opts._errorDataPathProperty)
                it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);

              $errSchemaPath = it.errSchemaPath + '/required';
              ($$outStack = $$outStack || []).push(out);
              out = '';
              if (it.createErrors !== false) {
                out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
                if (it.opts.messages !== false) {
                  out += " , message: '";
                  out += it.opts._errorDataPathProperty
                    ? 'is a required property'
                    : "should have required property \\'" + $missingProperty + "\\'";

                  out += "' ";
                }
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

              $errSchemaPath = $currErrSchemaPath;
              it.errorPath = $currentErrorPath;
              out += ' } else { ';
            } else if ($breakOnError) {
              out += ' if ( ' + $useData + ' === undefined ';
              if ($ownProperties)
                out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

              out += ') { ' + $nextValid + ' = true; } else { ';
            } else {
              out += ' if (' + $useData + ' !== undefined ';
              if ($ownProperties)
                out += ' &&   Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

              out += ' ) { ';
            }
            out += ' ' + $code + ' } ';
          }
        }
        if ($breakOnError) {
          out += ' if (' + $nextValid + ') { ';
          $closingBraces += '}';
        }
      }
  }
  if ($pPropertyKeys.length) {
    var arr4 = $pPropertyKeys;
    if (arr4)
      for (var $pProperty, i4 = -1, l4 = arr4.length - 1; i4 < l4; ) {
        $sch = $pProperties[($pProperty = arr4[++i4])];
        if (!(it.opts.strictKeywords ? (typeof $sch == 'object' && Object.keys($sch).length > 0) || $sch === false : it.util.schemaHasRules($sch, it.RULES.all)))
          continue;
        $it.schema = $sch;
        $it.schemaPath = it.schemaPath + '.patternProperties' + it.util.getProperty($pProperty);
        $it.errSchemaPath = it.errSchemaPath + '/patternProperties/' + it.util.escapeFragment($pProperty);
        out += $ownProperties
          ? ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; '
          : ' for (var ' + $key + ' in ' + $data + ') { ';

        out += ' if (' + it.usePattern($pProperty) + '.test(' + $key + ')) { ';
        $it.errorPath = it.util.getPathExpr(it.errorPath, $key, it.opts.jsonPointers);
        $passData = $data + '[' + $key + ']';
        $it.dataPathArr[$dataNxt] = $key;
        $code = it.validate($it);
        $it.baseId = $currentBaseId;
        out += it.util.varOccurences($code, $nextData) < 2
          ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
          : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

        if ($breakOnError) out += ' if (!' + $nextValid + ') break; ';

        out += ' } ';
        if ($breakOnError) out += ' else ' + $nextValid + ' = true; ';

        out += ' }  ';
        if ($breakOnError) {
          out += ' if (' + $nextValid + ') { ';
          $closingBraces += '}';
        }
      }
  }
  if ($breakOnError) out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';

  return out;
};

},
// 37
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $errs = 'errs__' + $lvl,
    $it = it.util.copy(it),
    $closingBraces = '';
  $it.level++;
  var $nextValid = 'valid' + $it.level;
  out += 'var ' + $errs + ' = errors;';
  if (it.opts.strictKeywords ? (typeof $schema == 'object' && Object.keys($schema).length > 0) || $schema === false : it.util.schemaHasRules($schema, it.RULES.all)) {
    $it.schema = $schema;
    $it.schemaPath = $schemaPath;
    $it.errSchemaPath = $errSchemaPath;
    var $key = 'key' + $lvl,
      $idx = 'idx' + $lvl,
      $i = 'i' + $lvl,
      $invalidName = "' + " + $key + " + '",
      $nextData = 'data' + ($it.dataLevel = it.dataLevel + 1),
      $dataProperties = 'dataProperties' + $lvl,
      $ownProperties = it.opts.ownProperties,
      $currentBaseId = it.baseId;
    if ($ownProperties) out += ' var ' + $dataProperties + ' = undefined; ';

    out += $ownProperties
      ? ' ' + $dataProperties + ' = ' + $dataProperties + ' || Object.keys(' + $data + '); for (var ' + $idx + '=0; ' + $idx + '<' + $dataProperties + '.length; ' + $idx + '++) { var ' + $key + ' = ' + $dataProperties + '[' + $idx + ']; '
      : ' for (var ' + $key + ' in ' + $data + ') { ';

    out += ' var startErrs' + $lvl + ' = errors; ';
    var $passData = $key,
      $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it);
    $it.baseId = $currentBaseId;
    out += it.util.varOccurences($code, $nextData) < 2
      ? ' ' + it.util.varReplace($code, $nextData, $passData) + ' '
      : ' var ' + $nextData + ' = ' + $passData + '; ' + $code + ' ';

    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' if (!' + $nextValid + ') { for (var ' + $i + '=startErrs' + $lvl + '; ' + $i + '<errors; ' + $i + '++) { vErrors[' + $i + '].propertyName = ' + $key + '; }   var err =   ';
    if (it.createErrors !== false) {
      out += " { keyword: 'propertyNames' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { propertyName: '" + $invalidName + "' } ";
      if (it.opts.messages !== false)
        out += " , message: 'property name \\'" + $invalidName + "\\' is invalid' ";

      if (it.opts.verbose)
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

      out += ' } ';
    } else out += ' {} ';

    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError)
      out += it.async
        ? ' throw new ValidationError(vErrors); '
        : ' validate.errors = vErrors; return false; ';

    if ($breakOnError) out += ' break; ';

    out += ' } }';
  }
  if ($breakOnError) out += ' ' + $closingBraces + ' if (' + $errs + ' == errors) {';

  return out;
};

},
// 38
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData)
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';

  var $vSchema = 'schema' + $lvl;
  if (!$isData)
    if ($schema.length < it.opts.loopRequired && it.schema.properties && Object.keys(it.schema.properties).length) {
      var $required = [],
        arr1 = $schema;
      if (arr1)
        for (var $property, i1 = -1, l1 = arr1.length - 1; i1 < l1; ) {
          $property = arr1[++i1];
          var $propertySch = it.schema.properties[$property];
          ($propertySch && (it.opts.strictKeywords ? (typeof $propertySch == 'object' && Object.keys($propertySch).length > 0) || $propertySch === false : it.util.schemaHasRules($propertySch, it.RULES.all))) ||
            ($required[$required.length] = $property);
        }
    } else $required = $schema;

  if (!($isData || $required.length)) {
    if ($breakOnError) out += ' if (true) {';

    return out;
  }
  var $propertyPath,
    $$outStack,
    $currentErrorPath = it.errorPath,
    $loopRequired = $isData || $required.length >= it.opts.loopRequired,
    $ownProperties = it.opts.ownProperties;
  if ($breakOnError) {
    out += ' var missing' + $lvl + '; ';
    if ($loopRequired) {
      $isData || (out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + '; ');

      var $missingProperty = "' + " + ($propertyPath = 'schema' + $lvl + '[' + ($i = 'i' + $lvl) + ']') + " + '";
      if (it.opts._errorDataPathProperty)
        it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);

      out += ' var ' + $valid + ' = true; ';
      if ($isData)
        out += ' if (schema' + $lvl + ' === undefined) ' + $valid + ' = true; else if (!Array.isArray(schema' + $lvl + ')) ' + $valid + ' = false; else {';

      out += ' for (var ' + $i + ' = 0; ' + $i + ' < ' + $vSchema + '.length; ' + $i + '++) { ' + $valid + ' = ' + $data + '[' + $vSchema + '[' + $i + ']] !== undefined ';
      if ($ownProperties)
        out += ' &&   Object.prototype.hasOwnProperty.call(' + $data + ', ' + $vSchema + '[' + $i + ']) ';

      out += '; if (!' + $valid + ') break; } ';
      if ($isData) out += '  }  ';

      out += '  if (!' + $valid + ') {   ';
      ($$outStack = $$outStack || []).push(out);
      out = '';
      if (it.createErrors !== false) {
        out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
        if (it.opts.messages !== false) {
          out += " , message: '";
          out += it.opts._errorDataPathProperty
            ? 'is a required property'
            : "should have required property \\'" + $missingProperty + "\\'";

          out += "' ";
        }
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

      out += ' } else { ';
    } else {
      out += ' if ( ';
      var arr2 = $required;
      if (arr2)
        for (var $i = -1, l2 = arr2.length - 1; $i < l2; ) {
          $propertyKey = arr2[++$i];
          if ($i) out += ' || ';

          out += ' ( ( ' + ($useData = $data + ($prop = it.util.getProperty($propertyKey))) + ' === undefined ';
          if ($ownProperties)
            out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

          out += ') && (missing' + $lvl + ' = ' + it.util.toQuotedString(it.opts.jsonPointers ? $propertyKey : $prop) + ') ) ';
        }

      out += ') {  ';
      $missingProperty = "' + " + ($propertyPath = 'missing' + $lvl) + " + '";
      if (it.opts._errorDataPathProperty)
        it.errorPath = it.opts.jsonPointers ? it.util.getPathExpr($currentErrorPath, $propertyPath, true) : $currentErrorPath + ' + ' + $propertyPath;

      ($$outStack = $$outStack || []).push(out);
      out = '';
      if (it.createErrors !== false) {
        out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
        if (it.opts.messages !== false) {
          out += " , message: '";
          out += it.opts._errorDataPathProperty
            ? 'is a required property'
            : "should have required property \\'" + $missingProperty + "\\'";

          out += "' ";
        }
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

      out += ' } else { ';
    }
  } else if ($loopRequired) {
    $isData || (out += ' var ' + $vSchema + ' = validate.schema' + $schemaPath + '; ');

    $missingProperty = "' + " + ($propertyPath = 'schema' + $lvl + '[' + ($i = 'i' + $lvl) + ']') + " + '";
    if (it.opts._errorDataPathProperty)
      it.errorPath = it.util.getPathExpr($currentErrorPath, $propertyPath, it.opts.jsonPointers);

    if ($isData) {
      out += ' if (' + $vSchema + ' && !Array.isArray(' + $vSchema + ')) {  var err =   ';
      if (it.createErrors !== false) {
        out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
        if (it.opts.messages !== false) {
          out += " , message: '";
          out += it.opts._errorDataPathProperty
            ? 'is a required property'
            : "should have required property \\'" + $missingProperty + "\\'";

          out += "' ";
        }
        if (it.opts.verbose)
          out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

        out += ' } ';
      } else out += ' {} ';

      out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } else if (' + $vSchema + ' !== undefined) { ';
    }
    out += ' for (var ' + $i + ' = 0; ' + $i + ' < ' + $vSchema + '.length; ' + $i + '++) { if (' + $data + '[' + $vSchema + '[' + $i + ']] === undefined ';
    if ($ownProperties)
      out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ', ' + $vSchema + '[' + $i + ']) ';

    out += ') {  var err =   ';
    if (it.createErrors !== false) {
      out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
      if (it.opts.messages !== false) {
        out += " , message: '";
        out += it.opts._errorDataPathProperty
          ? 'is a required property'
          : "should have required property \\'" + $missingProperty + "\\'";

        out += "' ";
      }
      if (it.opts.verbose)
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

      out += ' } ';
    } else out += ' {} ';

    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } } ';
    if ($isData) out += '  }  ';
  } else {
    var arr3 = $required;
    if (arr3)
      for (var $propertyKey, i3 = -1, l3 = arr3.length - 1; i3 < l3; ) {
        $propertyKey = arr3[++i3];
        var $prop = it.util.getProperty($propertyKey),
          $useData = (($missingProperty = it.util.escapeQuotes($propertyKey)), $data + $prop);
        if (it.opts._errorDataPathProperty)
          it.errorPath = it.util.getPath($currentErrorPath, $propertyKey, it.opts.jsonPointers);

        out += ' if ( ' + $useData + ' === undefined ';
        if ($ownProperties)
          out += ' || ! Object.prototype.hasOwnProperty.call(' + $data + ", '" + it.util.escapeQuotes($propertyKey) + "') ";

        out += ') {  var err =   ';
        if (it.createErrors !== false) {
          out += " { keyword: 'required' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { missingProperty: '" + $missingProperty + "' } ";
          if (it.opts.messages !== false) {
            out += " , message: '";
            out += it.opts._errorDataPathProperty
              ? 'is a required property'
              : "should have required property \\'" + $missingProperty + "\\'";

            out += "' ";
          }
          if (it.opts.verbose)
            out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

          out += ' } ';
        } else out += ' {} ';

        out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; } ';
      }
  }
  it.errorPath = $currentErrorPath;

  return out;
};

},
// 39
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  if (!($schema || $isData) || it.opts.uniqueItems === false) {
    if ($breakOnError) out += ' if (true) { ';

    return out;
  }
  if ($isData)
    out += ' var ' + $valid + '; if (' + $schemaValue + ' === false || ' + $schemaValue + ' === undefined) ' + $valid + ' = true; else if (typeof ' + $schemaValue + " != 'boolean') " + $valid + ' = false; else { ';

  out += ' var i = ' + $data + '.length , ' + $valid + ' = true , j; if (i > 1) { ';
  var $itemType = it.schema.items && it.schema.items.type,
    $typeIsArray = Array.isArray($itemType);
  if (!$itemType || $itemType == 'object' || $itemType == 'array' || ($typeIsArray && ($itemType.indexOf('object') >= 0 || $itemType.indexOf('array') >= 0)))
    out += ' outer: for (;i--;) { for (j = i; j--;) { if (equal(' + $data + '[i], ' + $data + '[j])) { ' + $valid + ' = false; break outer; } } } ';
  else {
    out += ' var itemIndices = {}, item; for (;i--;) { var item = ' + $data + '[i]; ';
    var $method = 'checkDataType' + ($typeIsArray ? 's' : '');
    out += ' if (' + it.util[$method]($itemType, 'item', it.opts.strictNumbers, true) + ') continue; ';
    if ($typeIsArray) out += " if (typeof item == 'string') item = '\"' + item; ";

    out += " if (typeof itemIndices[item] == 'number') { " + $valid + ' = false; j = itemIndices[item]; break; } itemIndices[item] = i; } ';
  }
  out += ' } ';
  if ($isData) out += '  }  ';

  out += ' if (!' + $valid + ') {   ';
  var $$outStack = $$outStack || [];
  $$outStack.push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: 'uniqueItems' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + ' , params: { i: i, j: j } ';
    if (it.opts.messages !== false)
      out += " , message: 'should NOT have duplicate items (items ## ' + j + ' and ' + i + ' are identical)' ";

    if (it.opts.verbose) {
      out += ' , schema:  ';
      out += $isData ? 'validate.schema' + $schemaPath : '' + $schema;

      out += '         , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';
    }
    out += ' } ';
  } else out += ' {} ';

  var __err = out;
  out = $$outStack.pop();
  out += it.compositeRule || !$breakOnError
    ? ' var err = ' + __err + ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; '
    : it.async
    ? ' throw new ValidationError([' + __err + ']); '
    : ' validate.errors = [' + __err + ']; return false; ';

  out += ' } ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 40
function (module) {

var KEYWORDS = [
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'maxProperties',
  'minProperties',
  'required',
  'additionalProperties',
  'enum',
  'format',
  'const'
];

module.exports = function (metaSchema, keywordsJsonPointers) {
  for (var i = 0; i < keywordsJsonPointers.length; i++) {
    metaSchema = JSON.parse(JSON.stringify(metaSchema));
    var j,
      segments = keywordsJsonPointers[i].split('/'),
      keywords = metaSchema;
    for (j = 1; j < segments.length; j++) keywords = keywords[segments[j]];

    for (j = 0; j < KEYWORDS.length; j++) {
      var key = KEYWORDS[j],
        schema = keywords[key];
      if (schema)
        keywords[key] = {
          anyOf: [
            schema,
            { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' }
          ]
        };
    }
  }

  return metaSchema;
};

},
// 41
function (module, exports, __webpack_require__) {

var MissingRefError = __webpack_require__(3).MissingRef;

module.exports = compileAsync;

function compileAsync(schema, meta, callback) {
  var self = this;
  if (typeof this._opts.loadSchema != 'function')
    throw new Error('options.loadSchema should be a function');

  if (typeof meta == 'function') {
    callback = meta;
    meta = void 0;
  }

  var p = loadMetaSchemaOf(schema).then(function () {
    var schemaObj = self._addSchema(schema, void 0, meta);
    return schemaObj.validate || _compileAsync(schemaObj);
  });

  callback &&
    p.then(function (v) {
      callback(null, v);
    }, callback);

  return p;

  function loadMetaSchemaOf(sch) {
    var $schema = sch.$schema;
    return $schema && !self.getSchema($schema)
      ? compileAsync.call(self, { $ref: $schema }, true)
      : Promise.resolve();
  }

  function _compileAsync(schemaObj) {
    try {
      return self._compile(schemaObj);
    } catch (e) {
      if (e instanceof MissingRefError) return loadMissingSchema(e);
      throw e;
    }

    function loadMissingSchema(e) {
      var ref = e.missingSchema;
      if (added(ref))
        throw new Error('Schema ' + ref + ' is loaded but ' + e.missingRef + ' cannot be resolved');

      var schemaPromise = self._loadingSchemas[ref];
      schemaPromise ||
        (schemaPromise = self._loadingSchemas[ref] = self._opts.loadSchema(ref)).then(removePromise, removePromise);

      return schemaPromise.then(function (sch) {
        if (!added(ref))
          return loadMetaSchemaOf(sch).then(function () {
            added(ref) || self.addSchema(sch, ref, void 0, meta);
          });
      }).then(function () {
        return _compileAsync(schemaObj);
      });

      function removePromise() {
        delete self._loadingSchemas[ref];
      }

      function added(ref) {
        return self._refs[ref] || self._schemas[ref];
      }
    }
  }
}

},
// 42
function (module, exports, __webpack_require__) {

var IDENTIFIER = /^[a-z_$][a-z0-9_$-]*$/i;
var customRuleCode = __webpack_require__(43),
  definitionSchema = __webpack_require__(44);

module.exports = {
  add: addKeyword,
  get: getKeyword,
  remove: removeKeyword,
  validate: validateKeyword
};

function addKeyword(keyword, definition) {
  var RULES = this.RULES;
  if (RULES.keywords[keyword]) throw new Error('Keyword ' + keyword + ' is already defined');

  if (!IDENTIFIER.test(keyword)) throw new Error('Keyword ' + keyword + ' is not a valid identifier');

  if (definition) {
    this.validateKeyword(definition, true);

    var dataType = definition.type;
    if (Array.isArray(dataType))
      for (var i = 0; i < dataType.length; i++) _addRule(keyword, dataType[i], definition);
    else _addRule(keyword, dataType, definition);

    var metaSchema = definition.metaSchema;
    if (metaSchema) {
      if (definition.$data && this._opts.$data)
        metaSchema = {
          anyOf: [
            metaSchema,
            { $ref: 'https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#' }
          ]
        };

      definition.validateSchema = this.compile(metaSchema, true);
    }
  }

  RULES.keywords[keyword] = RULES.all[keyword] = true;

  function _addRule(keyword, dataType, definition) {
    var ruleGroup;
    for (var i = 0; i < RULES.length; i++) {
      var rg = RULES[i];
      if (rg.type == dataType) {
        ruleGroup = rg;
        break;
      }
    }

    if (!ruleGroup) {
      ruleGroup = { type: dataType, rules: [] };
      RULES.push(ruleGroup);
    }

    var rule = {
      keyword: keyword,
      definition: definition,
      custom: true,
      code: customRuleCode,
      implements: definition.implements
    };
    ruleGroup.rules.push(rule);
    RULES.custom[keyword] = rule;
  }

  return this;
}

function getKeyword(keyword) {
  var rule = this.RULES.custom[keyword];
  return rule ? rule.definition : this.RULES.keywords[keyword] || false;
}

function removeKeyword(keyword) {
  var RULES = this.RULES;
  delete RULES.keywords[keyword];
  delete RULES.all[keyword];
  delete RULES.custom[keyword];
  for (var i = 0; i < RULES.length; i++)
    for (var rules = RULES[i].rules, j = 0; j < rules.length; j++)
      if (rules[j].keyword == keyword) {
        rules.splice(j, 1);
        break;
      }

  return this;
}

function validateKeyword(definition, throwError) {
  validateKeyword.errors = null;
  var v = (this._validateKeyword = this._validateKeyword || this.compile(definitionSchema, true));

  if (v(definition)) return true;
  validateKeyword.errors = v.errors;
  if (throwError)
    throw new Error('custom keyword definition is invalid: ' + this.errorsText(v.errors));

  return false;
}

},
// 43
function (module) {

module.exports = function (it, $keyword, $ruleType) {
  var $errorKeyword,
    $schemaValue,
    out = ' ',
    $lvl = it.level,
    $dataLvl = it.dataLevel,
    $schema = it.schema[$keyword],
    $schemaPath = it.schemaPath + it.util.getProperty($keyword),
    $errSchemaPath = it.errSchemaPath + '/' + $keyword,
    $breakOnError = !it.opts.allErrors,
    $data = 'data' + ($dataLvl || ''),
    $valid = 'valid' + $lvl,
    $errs = 'errs__' + $lvl,
    $isData = it.opts.$data && $schema && $schema.$data;
  if ($isData) {
    out += ' var schema' + $lvl + ' = ' + it.util.getData($schema.$data, $dataLvl, it.dataPathArr) + '; ';
    $schemaValue = 'schema' + $lvl;
  } else $schemaValue = $schema;

  var $compile, $inline, $macro, $ruleValidate, $validateCode;
  var $rule = this,
    $definition = 'definition' + $lvl,
    $rDef = $rule.definition,
    $closingBraces = '';
  if ($isData && $rDef.$data) {
    $validateCode = 'keywordValidate' + $lvl;
    var $validateSchema = $rDef.validateSchema;
    out += ' var ' + $definition + " = RULES.custom['" + $keyword + "'].definition; var " + $validateCode + ' = ' + $definition + '.validate;';
  } else {
    if (!($ruleValidate = it.useCustomRule($rule, $schema, it.schema, it))) return;
    $schemaValue = 'validate.schema' + $schemaPath;
    $validateCode = $ruleValidate.code;
    $compile = $rDef.compile;
    $inline = $rDef.inline;
    $macro = $rDef.macro;
  }
  var $$outStack,
    $ruleErrs = $validateCode + '.errors',
    $i = 'i' + $lvl,
    $ruleErr = 'ruleErr' + $lvl,
    $asyncKeyword = $rDef.async;
  if ($asyncKeyword && !it.async) throw new Error('async keyword in sync schema');
  $inline || $macro || (out += $ruleErrs + ' = null;');

  out += 'var ' + $errs + ' = errors;var ' + $valid + ';';
  if ($isData && $rDef.$data) {
    $closingBraces += '}';
    out += ' if (' + $schemaValue + ' === undefined) { ' + $valid + ' = true; } else { ';
    if ($validateSchema) {
      $closingBraces += '}';
      out += ' ' + $valid + ' = ' + $definition + '.validateSchema(' + $schemaValue + '); if (' + $valid + ') { ';
    }
  }
  if ($inline)
    out += $rDef.statements
      ? ' ' + $ruleValidate.validate + ' '
      : ' ' + $valid + ' = ' + $ruleValidate.validate + '; ';
  else if ($macro) {
    var $it = it.util.copy(it);
    $closingBraces = '';
    $it.level++;
    var $nextValid = 'valid' + $it.level;
    $it.schema = $ruleValidate.validate;
    $it.schemaPath = '';
    var $wasComposite = it.compositeRule;
    it.compositeRule = $it.compositeRule = true;
    var $code = it.validate($it).replace(/validate\.schema/g, $validateCode);
    it.compositeRule = $it.compositeRule = $wasComposite;
    out += ' ' + $code;
  } else {
    ($$outStack = $$outStack || []).push(out);
    out = '';
    out += '  ' + $validateCode + '.call( ';
    out += it.opts.passContext ? 'this' : 'self';

    out += $compile || $rDef.schema === false
      ? ' , ' + $data + ' '
      : ' , ' + $schemaValue + ' , ' + $data + ' , validate.schema' + it.schemaPath + ' ';

    out += " , (dataPath || '')";
    if (it.errorPath != '""') out += ' + ' + it.errorPath;

    var $parentData = $dataLvl ? 'data' + ($dataLvl - 1 || '') : 'parentData',
      $parentDataProperty = $dataLvl ? it.dataPathArr[$dataLvl] : 'parentDataProperty',
      def_callRuleValidate = (out += ' , ' + $parentData + ' , ' + $parentDataProperty + ' , rootData )  ');
    out = $$outStack.pop();
    if ($rDef.errors === false) {
      out += ' ' + $valid + ' = ';
      if ($asyncKeyword) out += 'await ';

      out += def_callRuleValidate + '; ';
    } else
      out += $asyncKeyword
        ? ' var ' + ($ruleErrs = 'customErrors' + $lvl) + ' = null; try { ' + $valid + ' = await ' + def_callRuleValidate + '; } catch (e) { ' + $valid + ' = false; if (e instanceof ValidationError) ' + $ruleErrs + ' = e.errors; else throw e; } '
        : ' ' + $ruleErrs + ' = null; ' + $valid + ' = ' + def_callRuleValidate + '; ';
  }
  if ($rDef.modifying)
    out += ' if (' + $parentData + ') ' + $data + ' = ' + $parentData + '[' + $parentDataProperty + '];';

  out += '' + $closingBraces;
  if ($rDef.valid) {
    if ($breakOnError) out += ' if (true) { ';

    return out;
  }
  out += ' if ( ';
  if ($rDef.valid === void 0) {
    out += ' !';
    out += $macro ? '' + $nextValid : '' + $valid;
  } else out += ' ' + !$rDef.valid + ' ';

  out += ') { ';
  $errorKeyword = $rule.keyword;
  ($$outStack = $$outStack || []).push(out);
  out = '';
  ($$outStack = $$outStack || []).push(out);
  out = '';
  if (it.createErrors !== false) {
    out += " { keyword: '" + ($errorKeyword || 'custom') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { keyword: '" + $rule.keyword + "' } ";
    if (it.opts.messages !== false)
      out += ' , message: \'should pass "' + $rule.keyword + '" keyword validation\' ';

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

  var def_customError = out;
  out = $$outStack.pop();
  if ($inline)
    if ($rDef.errors) {
      if ($rDef.errors != 'full') {
        out += '  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + ".dataPath = (dataPath || '') + " + it.errorPath + '; if (' + $ruleErr + '.schemaPath === undefined) { ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '"; } ';
        if (it.opts.verbose)
          out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';

        out += ' } ';
      }
    } else if ($rDef.errors === false) out += ' ' + def_customError + ' ';
    else {
      out += ' if (' + $errs + ' == errors) { ' + def_customError + ' } else {  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + ".dataPath = (dataPath || '') + " + it.errorPath + '; if (' + $ruleErr + '.schemaPath === undefined) { ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '"; } ';
      if (it.opts.verbose)
        out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';

      out += ' } } ';
    }
  else if ($macro) {
    out += '   var err =   ';
    if (it.createErrors !== false) {
      out += " { keyword: '" + ($errorKeyword || 'custom') + "' , dataPath: (dataPath || '') + " + it.errorPath + ' , schemaPath: ' + it.util.toQuotedString($errSchemaPath) + " , params: { keyword: '" + $rule.keyword + "' } ";
      if (it.opts.messages !== false)
        out += ' , message: \'should pass "' + $rule.keyword + '" keyword validation\' ';

      if (it.opts.verbose)
        out += ' , schema: validate.schema' + $schemaPath + ' , parentSchema: validate.schema' + it.schemaPath + ' , data: ' + $data + ' ';

      out += ' } ';
    } else out += ' {} ';

    out += ';  if (vErrors === null) vErrors = [err]; else vErrors.push(err); errors++; ';
    if (!it.compositeRule && $breakOnError)
      out += it.async
        ? ' throw new ValidationError(vErrors); '
        : ' validate.errors = vErrors; return false; ';
  } else if ($rDef.errors === false) out += ' ' + def_customError + ' ';
  else {
    out += ' if (Array.isArray(' + $ruleErrs + ')) { if (vErrors === null) vErrors = ' + $ruleErrs + '; else vErrors = vErrors.concat(' + $ruleErrs + '); errors = vErrors.length;  for (var ' + $i + '=' + $errs + '; ' + $i + '<errors; ' + $i + '++) { var ' + $ruleErr + ' = vErrors[' + $i + ']; if (' + $ruleErr + '.dataPath === undefined) ' + $ruleErr + ".dataPath = (dataPath || '') + " + it.errorPath + ';  ' + $ruleErr + '.schemaPath = "' + $errSchemaPath + '";  ';
    if (it.opts.verbose)
      out += ' ' + $ruleErr + '.schema = ' + $schemaValue + '; ' + $ruleErr + '.data = ' + $data + '; ';

    out += ' } } else { ' + def_customError + ' } ';
  }
  out += ' } ';
  if ($breakOnError) out += ' else { ';

  return out;
};

},
// 44
function (module, exports, __webpack_require__) {

var metaSchema = __webpack_require__(11);

module.exports = {
  $id: 'https://github.com/ajv-validator/ajv/blob/master/lib/definition_schema.js',
  definitions: { simpleTypes: metaSchema.definitions.simpleTypes },
  type: 'object',
  dependencies: {
    schema: ['validate'],
    $data: ['validate'],
    statements: ['inline'],
    valid: { not: { required: ['macro'] } }
  },
  properties: {
    type: metaSchema.properties.type,
    schema: { type: 'boolean' },
    statements: { type: 'boolean' },
    dependencies: { type: 'array', items: { type: 'string' } },
    metaSchema: { type: 'object' },
    modifying: { type: 'boolean' },
    valid: { type: 'boolean' },
    $data: { type: 'boolean' },
    async: { type: 'boolean' },
    errors: { anyOf: [{ type: 'boolean' }, { const: 'full' }] }
  }
};

},
// 45
function (module) {

module.exports = JSON.parse(
  '{"$schema":"http://json-schema.org/draft-07/schema#","$id":"https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#","description":"Meta-schema for $data reference (JSON Schema extension proposal)","type":"object","required":["$data"],"properties":{"$data":{"type":"string","anyOf":[{"format":"relative-json-pointer"},{"format":"json-pointer"}]}},"additionalProperties":false}'
);

}
]);

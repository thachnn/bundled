"use strict";

var _t = require('./types'),
  generator = require('./generator'),
  template = require('./template'),
  parser = require('./parser');

const ReferencedIdentifier = ["Identifier", "JSXIdentifier"],
  ReferencedMemberExpression = ["MemberExpression"],
  BindingIdentifier = ["Identifier"],
  Statement = ["Statement"],
  Expression = ["Expression"],
  Scope$1 = ["Scopable", "Pattern"],
  Referenced = null,
  BlockScoped = null,
  Var = ["VariableDeclaration"],
  User = null,
  Generated = null,
  Pure = null,
  Flow = ["Flow", "ImportDeclaration", "ExportDeclaration", "ImportSpecifier"],
  RestProperty = ["RestElement"],
  SpreadProperty = ["RestElement"],
  ExistentialTypeParam = ["ExistsTypeAnnotation"],
  NumericLiteralTypeAnnotation = ["NumberLiteralTypeAnnotation"],
  ForAwaitStatement = ["ForOfStatement"];

var virtualTypes = Object.freeze({
  __proto__: null,
  BindingIdentifier,
  BlockScoped,
  ExistentialTypeParam,
  Expression,
  Flow,
  ForAwaitStatement,
  Generated,
  NumericLiteralTypeAnnotation,
  Pure,
  Referenced,
  ReferencedIdentifier,
  ReferencedMemberExpression,
  RestProperty,
  Scope: Scope$1,
  SpreadProperty,
  Statement,
  User,
  Var
});

const {
  DEPRECATED_KEYS,
  DEPRECATED_ALIASES,
  FLIPPED_ALIAS_KEYS,
  TYPES,
  __internal__deprecationWarning: deprecationWarning
} = _t;
function isVirtualType(type) {
  return type in virtualTypes;
}
function isExplodedVisitor(visitor) {
  return visitor == null ? void 0 : visitor._exploded;
}
function explode(visitor) {
  if (isExplodedVisitor(visitor)) return visitor;
  visitor._exploded = true;
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    const parts = nodeType.split("|");
    if (parts.length === 1) continue;
    const fns = visitor[nodeType];
    delete visitor[nodeType];
    for (const part of parts) visitor[part] = fns;
  }
  verify(visitor);
  delete visitor.__esModule;
  ensureEntranceObjects(visitor);
  ensureCallbackArrays(visitor);
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType) || !isVirtualType(nodeType)) continue;
    const fns = visitor[nodeType];
    for (const type of Object.keys(fns)) fns[type] = wrapCheck(nodeType, fns[type]);

    delete visitor[nodeType];
    const types = virtualTypes[nodeType];
    if (types !== null)
      for (const type of types) visitor[type] ? mergePair(visitor[type], fns) : (visitor[type] = fns);
    else mergePair(visitor, fns);
  }
  for (const nodeType of Object.keys(visitor)) {
    if (shouldIgnoreKey(nodeType)) continue;
    let aliases = FLIPPED_ALIAS_KEYS[nodeType];
    if (nodeType in DEPRECATED_KEYS) {
      const deprecatedKey = DEPRECATED_KEYS[nodeType];
      deprecationWarning(nodeType, deprecatedKey, "Visitor ");
      aliases = [deprecatedKey];
    } else if (nodeType in DEPRECATED_ALIASES) {
      const deprecatedAlias = DEPRECATED_ALIASES[nodeType];
      deprecationWarning(nodeType, deprecatedAlias, "Visitor ");
      aliases = FLIPPED_ALIAS_KEYS[deprecatedAlias];
    }
    if (!aliases) continue;
    const fns = visitor[nodeType];
    delete visitor[nodeType];
    for (const alias of aliases) {
      const existing = visitor[alias];
      existing ? mergePair(existing, fns) : (visitor[alias] = Object.assign({}, fns));
    }
  }
  for (const nodeType of Object.keys(visitor)) shouldIgnoreKey(nodeType) || ensureCallbackArrays(visitor[nodeType]);

  return visitor;
}
function verify(visitor) {
  if (visitor._verified) return;
  if (typeof visitor == "function")
    throw new Error(
      "You passed `traverse()` a function when it expected a visitor object, are you sure you didn't mean `{ enter: Function }`?"
    );

  for (const nodeType of Object.keys(visitor)) {
    (nodeType !== "enter" && nodeType !== "exit") || validateVisitorMethods(nodeType, visitor[nodeType]);

    if (shouldIgnoreKey(nodeType)) continue;
    if (TYPES.indexOf(nodeType) < 0)
      throw new Error(`You gave us a visitor for the node type ${nodeType} but it's not a valid type`);

    const visitors = visitor[nodeType];
    if (typeof visitors == "object")
      for (const visitorKey of Object.keys(visitors))
        if (visitorKey !== "enter" && visitorKey !== "exit")
          throw new Error(
            `You passed \`traverse()\` a visitor object with the property ${nodeType} that has the invalid property ${visitorKey}`
          );
        else validateVisitorMethods(`${nodeType}.${visitorKey}`, visitors[visitorKey]);
  }
  visitor._verified = true;
}
function validateVisitorMethods(path, val) {
  const fns = [].concat(val);
  for (const fn of fns)
    if (typeof fn != "function") throw new TypeError(`Non-function found defined in ${path} with type ${typeof fn}`);
}
function merge(visitors, states = [], wrapper) {
  const mergedVisitor = {};
  for (let i = 0; i < visitors.length; i++) {
    const visitor = explode(visitors[i]),
      state = states[i];
    let topVisitor = visitor;
    if (state || wrapper) topVisitor = wrapWithStateOrWrapper(topVisitor, state, wrapper);

    mergePair(mergedVisitor, topVisitor);
    for (const key of Object.keys(visitor)) {
      if (shouldIgnoreKey(key)) continue;
      let typeVisitor = visitor[key];
      if (state || wrapper) typeVisitor = wrapWithStateOrWrapper(typeVisitor, state, wrapper);

      mergePair(mergedVisitor[key] || (mergedVisitor[key] = {}), typeVisitor);
    }
  }
  return mergedVisitor;
}
function wrapWithStateOrWrapper(oldVisitor, state, wrapper) {
  const newVisitor = {};
  for (const phase of ["enter", "exit"]) {
    let fns = oldVisitor[phase];
    if (!Array.isArray(fns)) continue;
    fns = fns.map(function (fn) {
      let newFn = fn;
      if (state)
        newFn = function (path) {
          fn.call(state, path, state);
        };

      if (wrapper) newFn = wrapper(state == null ? void 0 : state.key, phase, newFn);

      if (newFn !== fn) newFn.toString = () => fn.toString();

      return newFn;
    });
    newVisitor[phase] = fns;
  }
  return newVisitor;
}
function ensureEntranceObjects(obj) {
  for (const key of Object.keys(obj)) {
    if (shouldIgnoreKey(key)) continue;
    const fns = obj[key];
    if (typeof fns == "function") obj[key] = { enter: fns };
  }
}
function ensureCallbackArrays(obj) {
  if (obj.enter && !Array.isArray(obj.enter)) obj.enter = [obj.enter];
  if (obj.exit && !Array.isArray(obj.exit)) obj.exit = [obj.exit];
}
function wrapCheck(nodeType, fn) {
  const newFn = function (path) {
    if (path["is" + nodeType]()) return fn.apply(this, arguments);
  };
  newFn.toString = () => fn.toString();
  return newFn;
}
function shouldIgnoreKey(key) {
  return (
    key[0] === "_" ||
    key === "enter" || key === "exit" || key === "shouldSkip" ||
    key === "denylist" || key === "noScope" || key === "skipKeys" ||
    key === "blacklist"
  );
}
function mergePair(dest, src) {
  for (const phase of ["enter", "exit"]) if (src[phase]) dest[phase] = [].concat(dest[phase] || [], src[phase]);
}

var visitors = Object.freeze({
  __proto__: null,
  explode,
  isExplodedVisitor,
  merge,
  verify
});

let pathsCache = new WeakMap(),
  scope = new WeakMap();
function clear() {
  clearPath();
  clearScope();
}
function clearPath() {
  pathsCache = new WeakMap();
}
function clearScope() {
  scope = new WeakMap();
}
const nullHub = Object.freeze({});
function getCachedPaths(hub, parent) {
  var _pathsCache$get, _hub;
  hub = null;

  return (_pathsCache$get = pathsCache.get((_hub = hub) != null ? _hub : nullHub)) == null
    ? void 0
    : _pathsCache$get.get(parent);
}
function getOrCreateCachedPaths(hub, parent) {
  var _hub2, _hub3;
  hub = null;

  let parents = pathsCache.get((_hub2 = hub) != null ? _hub2 : nullHub);
  parents || pathsCache.set((_hub3 = hub) != null ? _hub3 : nullHub, (parents = new WeakMap()));
  let paths = parents.get(parent);
  paths || parents.set(parent, (paths = new Map()));
  return paths;
}

var cache = Object.freeze({
  __proto__: null,
  clear,
  clearPath,
  clearScope,
  getCachedPaths,
  getOrCreateCachedPaths,
  get path() { return pathsCache; },
  get scope() { return scope; }
});

var s = 1000,
  m = s * 60,
  h = m * 60,
  d = h * 24,
  w = d * 7,
  y = d * 365.25;
var ms = function (val, /** Object.<string, *> */ options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) return parse(val);
  if (type === 'number' && isFinite(val)) return options.long ? fmtLong(val) : fmtShort(val);

  throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
};
function parse(str) {
  if ((str = String(str)).length > 100) return;

  var match =
    /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;

  var n = parseFloat(match[1]);
  switch ((match[2] || 'ms').toLowerCase()) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return void 0;
  }
}
function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  return msAbs >= d
    ? Math.round(ms / d) + 'd'
    : msAbs >= h
    ? Math.round(ms / h) + 'h'
    : msAbs >= m
    ? Math.round(ms / m) + 'm'
    : msAbs >= s
    ? Math.round(ms / s) + 's'
    : ms + 'ms';
}
function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  return msAbs >= d
    ? plural(ms, msAbs, d, 'day')
    : msAbs >= h
    ? plural(ms, msAbs, h, 'hour')
    : msAbs >= m
    ? plural(ms, msAbs, m, 'minute')
    : msAbs >= s
    ? plural(ms, msAbs, s, 'second')
    : ms + ' ms';
}
function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

function setup$1(env) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = ms;
  createDebug.destroy = destroy;
  Object.keys(env).forEach(key => {
    createDebug[key] = env[key];
  });
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  function selectColor(namespace) {
    let hash = 0;
    for (let i = 0; i < namespace.length; i++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0;
    }
    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;
  function createDebug(namespace) {
    let prevTime,
      namespacesCache,
      enabledCache,
      enableOverride = null;
    function debug(...args) {
      if (!debug.enabled) return;

      const self = debug,
        curr = Number(new Date());
      self.diff = curr - (prevTime || curr);
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      typeof args[0] == 'string' || args.unshift('%O');

      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        if (match === '%%') return '%';

        index++;
        const formatter = createDebug.formatters[format];
        if (typeof formatter == 'function') {
          const val = args[index];
          match = formatter.call(self, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      createDebug.formatArgs.call(self, args);
      (self.log || createDebug.log).apply(self, args);
    }
    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy;
    Object.defineProperty(debug, 'enabled', {
      enumerable: true,
      configurable: false,
      get: () => {
        if (enableOverride !== null) return enableOverride;

        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }
        return enabledCache;
      },
      set: v => {
        enableOverride = v;
      }
    });
    typeof createDebug.init != 'function' || createDebug.init(debug);

    return debug;
  }
  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (delimiter === void 0 ? ':' : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    let i;
    const split = (typeof namespaces == 'string' ? namespaces : '').split(/[\s,]+/),
      len = split.length;
    for (i = 0; i < len; i++)
      if (split[i])
        (namespaces = split[i].replace(/\*/g, '.*?'))[0] === '-'
          ? createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'))
          : createDebug.names.push(new RegExp('^' + namespaces + '$'));
  }
  function disable() {
    const namespaces = [
      ...createDebug.names.map(toNamespace),
      ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
    ].join(',');
    createDebug.enable('');
    return namespaces;
  }
  function enabled(name) {
    if (name[name.length - 1] === '*') return true;

    let i, len;
    for (i = 0, len = createDebug.skips.length; i < len; i++) if (createDebug.skips[i].test(name)) return false;

    for (i = 0, len = createDebug.names.length; i < len; i++) if (createDebug.names[i].test(name)) return true;

    return false;
  }
  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
  }
  function coerce(val) {
    return val instanceof Error ? val.stack || val.message : val;
  }
  function destroy() {
    console.warn(
      'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
    );
  }
  createDebug.enable(createDebug.load());
  return createDebug;
}

let _debug = { formatArgs, save, load, useColors, storage: localstorage() };
_debug.destroy = (() => {
  let warned = false;
  return () => {
    if (!warned) {
      warned = true;
      console.warn(
        'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
      );
    }
  };
})();
_debug.colors = [
  '#0000CC',
  '#0000FF',
  '#0033CC',
  '#0033FF',
  '#0066CC',
  '#0066FF',
  '#0099CC',
  '#0099FF',
  '#00CC00',
  '#00CC33',
  '#00CC66',
  '#00CC99',
  '#00CCCC',
  '#00CCFF',
  '#3300CC',
  '#3300FF',
  '#3333CC',
  '#3333FF',
  '#3366CC',
  '#3366FF',
  '#3399CC',
  '#3399FF',
  '#33CC00',
  '#33CC33',
  '#33CC66',
  '#33CC99',
  '#33CCCC',
  '#33CCFF',
  '#6600CC',
  '#6600FF',
  '#6633CC',
  '#6633FF',
  '#66CC00',
  '#66CC33',
  '#9900CC',
  '#9900FF',
  '#9933CC',
  '#9933FF',
  '#99CC00',
  '#99CC33',
  '#CC0000',
  '#CC0033',
  '#CC0066',
  '#CC0099',
  '#CC00CC',
  '#CC00FF',
  '#CC3300',
  '#CC3333',
  '#CC3366',
  '#CC3399',
  '#CC33CC',
  '#CC33FF',
  '#CC6600',
  '#CC6633',
  '#CC9900',
  '#CC9933',
  '#CCCC00',
  '#CCCC33',
  '#FF0000',
  '#FF0033',
  '#FF0066',
  '#FF0099',
  '#FF00CC',
  '#FF00FF',
  '#FF3300',
  '#FF3333',
  '#FF3366',
  '#FF3399',
  '#FF33CC',
  '#FF33FF',
  '#FF6600',
  '#FF6633',
  '#FF9900',
  '#FF9933',
  '#FFCC00',
  '#FFCC33'
];
function useColors() {
  // noinspection JSUnresolvedVariable
  return !(
    typeof window == 'undefined' || !window.process || (window.process.type !== 'renderer' && !window.process.__nwjs)
  ) || (
    (typeof navigator == 'undefined' || !/(Edge|Trident)\/\d+/i.test(navigator.userAgent)) &&
    ((typeof document != 'undefined' && document.documentElement &&
        document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
      (typeof window != 'undefined' && window.console &&
        (window.console.firebug || (window.console.exception && window.console.table))) ||
      (typeof navigator != 'undefined' && /Firefox\/(\d\d\d+|[4-9]\d|3[1-9])/i.test(navigator.userAgent)) ||
      (typeof navigator != 'undefined' && /AppleWebKit\/\d+/i.test(navigator.userAgent)))
  );
}
function formatArgs(args) {
  args[0] =
    (this.useColors ? '%c' : '') +
    this.namespace +
    (this.useColors ? ' %c' : ' ') +
    args[0] +
    (this.useColors ? '%c ' : ' ') +
    '+' +
    _debug.humanize(this.diff);
  if (!this.useColors) return;

  const c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');
  let index = 0,
    lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, match => {
    if (match === '%%') return;

    index++;
    if (match === '%c') lastC = index;
  });
  args.splice(lastC, 0, c);
}
_debug.log = console.debug || console.log || (() => {});
function save(namespaces) {
  try {
    namespaces ? _debug.storage.setItem('debug', namespaces) : _debug.storage.removeItem('debug');
  } catch (_error) {}
}
function load() {
  let r;
  try {
    r = _debug.storage.getItem('debug');
  } catch (_error) {}
  if (!r && typeof process != 'undefined' && 'env' in process) r = process.env.DEBUG;

  return r;
}
function localstorage() {
  try {
    return localStorage;
  } catch (_error) {}
}
var buildDebug = (_debug = setup$1(_debug));
const { formatters } = _debug;
formatters.j = function (v) {
  try {
    return JSON.stringify(v);
  } catch (error) {
    return '[UnexpectedJSONParseError]: ' + error.message;
  }
};

const {
  cloneNode: cloneNode$5,
  exportNamedDeclaration,
  exportSpecifier,
  identifier: identifier$6,
  variableDeclaration: variableDeclaration$2,
  variableDeclarator: variableDeclarator$2
} = _t;
function splitExportDeclaration(exportDeclaration) {
  if (!exportDeclaration.isExportDeclaration() || exportDeclaration.isExportAllDeclaration())
    throw new Error("Only default and named export declarations can be split.");

  if (exportDeclaration.isExportDefaultDeclaration()) {
    const declaration = exportDeclaration.get("declaration"),
      standaloneDeclaration = declaration.isFunctionDeclaration() || declaration.isClassDeclaration(),
      exportExpr = declaration.isFunctionExpression() || declaration.isClassExpression(),
      scope = declaration.isScope() ? declaration.scope.parent : declaration.scope;
    let id = declaration.node.id,
      needBindingRegistration = false;
    if (!id) {
      needBindingRegistration = true;
      id = scope.generateUidIdentifier("default");
      if (standaloneDeclaration || exportExpr) declaration.node.id = cloneNode$5(id);
    } else if (exportExpr && scope.hasBinding(id.name)) {
      needBindingRegistration = true;
      id = scope.generateUidIdentifier(id.name);
    }
    const updatedDeclaration = standaloneDeclaration
      ? declaration.node
      : variableDeclaration$2("var", [variableDeclarator$2(cloneNode$5(id), declaration.node)]);
    const updatedExportDeclaration = exportNamedDeclaration(null, [
      exportSpecifier(cloneNode$5(id), identifier$6("default"))
    ]);
    exportDeclaration.insertAfter(updatedExportDeclaration);
    exportDeclaration.replaceWith(updatedDeclaration);
    needBindingRegistration && scope.registerDeclaration(exportDeclaration);

    return exportDeclaration;
  }
  if (exportDeclaration.get("specifiers").length > 0)
    throw new Error("It doesn't make sense to split exported specifiers.");

  const declaration = exportDeclaration.get("declaration"),
    bindingIdentifiers = declaration.getOuterBindingIdentifiers(),
    specifiers = Object.keys(bindingIdentifiers).map(name => exportSpecifier(identifier$6(name), identifier$6(name))),
    aliasDeclar = exportNamedDeclaration(null, specifiers);
  exportDeclaration.insertAfter(aliasDeclar);
  exportDeclaration.replaceWith(declaration.node);
  return exportDeclaration;
}

function requeueComputedKeyAndDecorators(path) {
  const { context, node } = path;
  node.computed && context.maybeQueue(path.get("key"));

  if (node.decorators) for (const decorator of path.get("decorators")) context.maybeQueue(decorator);
}
const visitor$2 = {
  FunctionParent(path) {
    if (path.isArrowFunctionExpression()) return;

    path.skip();
    path.isMethod() && requeueComputedKeyAndDecorators(path);
  },
  Property(path) {
    if (path.isObjectProperty()) return;

    path.skip();
    requeueComputedKeyAndDecorators(path);
  }
};

const renameVisitor = {
  ReferencedIdentifier({ node }, state) {
    if (node.name === state.oldName) node.name = state.newName;
  },
  Scope(path, state) {
    if (!path.scope.bindingIdentifierEquals(state.oldName, state.binding.identifier)) {
      path.skip();
      path.isMethod() && requeueComputedKeyAndDecorators(path);
    }
  },
  ObjectProperty({ node, scope }, state) {
    const { name } = node.key;
    if (
      node.shorthand &&
      (name === state.oldName || name === state.newName) &&
      scope.getBindingIdentifier(name) === state.binding.identifier
    ) {
      var _node$extra;
      node.shorthand = false;
      if ((_node$extra = node.extra) != null && _node$extra.shorthand) node.extra.shorthand = false;
    }
  },
  "AssignmentExpression|Declaration|VariableDeclarator"(path, state) {
    if (path.isVariableDeclaration()) return;
    const ids = path.getOuterBindingIdentifiers();
    for (const name in ids) if (name === state.oldName) ids[name].name = state.newName;
  }
};
class Renamer {
  constructor(binding, oldName, newName) {
    this.newName = newName;
    this.oldName = oldName;
    this.binding = binding;
  }
  maybeConvertFromExportDeclaration(parentDeclar) {
    const maybeExportDeclar = parentDeclar.parentPath;
    if (!maybeExportDeclar.isExportDeclaration()) return;

    if (maybeExportDeclar.isExportDefaultDeclaration()) {
      const { declaration } = maybeExportDeclar.node;
      if (_t.isDeclaration(declaration) && !declaration.id) return;
    }

    maybeExportDeclar.isExportAllDeclaration() || splitExportDeclaration(maybeExportDeclar);
  }
  maybeConvertFromClassFunctionDeclaration(path) {
    return path;
  }
  maybeConvertFromClassFunctionExpression(path) {
    return path;
  }
  rename() {
    const { binding, oldName, newName } = this,
      { scope, path } = binding,
      parentDeclar = path.find(path => path.isDeclaration() || path.isFunctionExpression() || path.isClassExpression());
    parentDeclar &&
      parentDeclar.getOuterBindingIdentifiers()[oldName] === binding.identifier &&
      this.maybeConvertFromExportDeclaration(parentDeclar);

    traverseNode(arguments[0] || scope.block, explode(renameVisitor), scope, this, scope.path, { discriminant: true });
    if (!arguments[0]) {
      scope.removeOwnBinding(oldName);
      scope.bindings[newName] = binding;
      this.binding.identifier.name = newName;
    }
    if (parentDeclar) {
      this.maybeConvertFromClassFunctionDeclaration(path);
      this.maybeConvertFromClassFunctionExpression(path);
    }
  }
}

class Binding {
  constructor({ identifier, scope, path, kind }) {
    this.identifier = void 0;
    this.scope = void 0;
    this.path = void 0;
    this.kind = void 0;
    this.constantViolations = [];
    this.constant = true;
    this.referencePaths = [];
    this.referenced = false;
    this.references = 0;
    this.identifier = identifier;
    this.scope = scope;
    this.path = path;
    this.kind = kind;
    (kind !== "var" && kind !== "hoisted") || !isDeclaredInLoop(path) || this.reassign(path);

    this.clearValue();
  }
  // noinspection JSUnusedGlobalSymbols
  deoptValue() {
    this.clearValue();
    this.hasDeoptedValue = true;
  }
  setValue(value) {
    if (this.hasDeoptedValue) return;
    this.hasValue = true;
    this.value = value;
  }
  clearValue() {
    this.hasDeoptedValue = false;
    this.hasValue = false;
    this.value = null;
  }
  reassign(path) {
    this.constant = false;

    this.constantViolations.indexOf(path) > -1 || this.constantViolations.push(path);
  }
  reference(path) {
    if (this.referencePaths.indexOf(path) > -1) return;

    this.referenced = true;
    this.references++;
    this.referencePaths.push(path);
  }
  dereference() {
    this.references--;
    this.referenced = !!this.references;
  }
}
function isDeclaredInLoop(path) {
  for (let { parentPath, key } = path; parentPath; { parentPath, key } = parentPath) {
    if (parentPath.isFunctionParent()) return false;
    if (parentPath.isWhile() || parentPath.isForXStatement() || (parentPath.isForStatement() && key === "body"))
      return true;
  }
  return false;
}

var builtin = {
  Array: false,
  ArrayBuffer: false,
  Atomics: false,
  BigInt: false,
  BigInt64Array: false,
  BigUint64Array: false,
  Boolean: false,
  constructor: false,
  DataView: false,
  Date: false,
  decodeURI: false,
  decodeURIComponent: false,
  encodeURI: false,
  encodeURIComponent: false,
  Error: false,
  escape: false,
  eval: false,
  EvalError: false,
  Float32Array: false,
  Float64Array: false,
  Function: false,
  globalThis: false,
  hasOwnProperty: false,
  Infinity: false,
  Int16Array: false,
  Int32Array: false,
  Int8Array: false,
  isFinite: false,
  isNaN: false,
  isPrototypeOf: false,
  JSON: false,
  Map: false,
  Math: false,
  NaN: false,
  Number: false,
  Object: false,
  parseFloat: false,
  parseInt: false,
  Promise: false,
  propertyIsEnumerable: false,
  Proxy: false,
  RangeError: false,
  ReferenceError: false,
  Reflect: false,
  RegExp: false,
  Set: false,
  SharedArrayBuffer: false,
  String: false,
  Symbol: false,
  SyntaxError: false,
  toLocaleString: false,
  toString: false,
  TypeError: false,
  Uint16Array: false,
  Uint32Array: false,
  Uint8Array: false,
  Uint8ClampedArray: false,
  undefined: false,
  unescape: false,
  URIError: false,
  valueOf: false,
  WeakMap: false,
  WeakSet: false
};
var es5 = {
  Array: false,
  Boolean: false,
  constructor: false,
  Date: false,
  decodeURI: false,
  decodeURIComponent: false,
  encodeURI: false,
  encodeURIComponent: false,
  Error: false,
  escape: false,
  eval: false,
  EvalError: false,
  Function: false,
  hasOwnProperty: false,
  Infinity: false,
  isFinite: false,
  isNaN: false,
  isPrototypeOf: false,
  JSON: false,
  Math: false,
  NaN: false,
  Number: false,
  Object: false,
  parseFloat: false,
  parseInt: false,
  propertyIsEnumerable: false,
  RangeError: false,
  ReferenceError: false,
  RegExp: false,
  String: false,
  SyntaxError: false,
  toLocaleString: false,
  toString: false,
  TypeError: false,
  undefined: false,
  unescape: false,
  URIError: false,
  valueOf: false
};
var es2015 = {
  Array: false,
  ArrayBuffer: false,
  Boolean: false,
  constructor: false,
  DataView: false,
  Date: false,
  decodeURI: false,
  decodeURIComponent: false,
  encodeURI: false,
  encodeURIComponent: false,
  Error: false,
  escape: false,
  eval: false,
  EvalError: false,
  Float32Array: false,
  Float64Array: false,
  Function: false,
  hasOwnProperty: false,
  Infinity: false,
  Int16Array: false,
  Int32Array: false,
  Int8Array: false,
  isFinite: false,
  isNaN: false,
  isPrototypeOf: false,
  JSON: false,
  Map: false,
  Math: false,
  NaN: false,
  Number: false,
  Object: false,
  parseFloat: false,
  parseInt: false,
  Promise: false,
  propertyIsEnumerable: false,
  Proxy: false,
  RangeError: false,
  ReferenceError: false,
  Reflect: false,
  RegExp: false,
  Set: false,
  String: false,
  Symbol: false,
  SyntaxError: false,
  toLocaleString: false,
  toString: false,
  TypeError: false,
  Uint16Array: false,
  Uint32Array: false,
  Uint8Array: false,
  Uint8ClampedArray: false,
  undefined: false,
  unescape: false,
  URIError: false,
  valueOf: false,
  WeakMap: false,
  WeakSet: false
};
var es2017 = {
  Array: false,
  ArrayBuffer: false,
  Atomics: false,
  Boolean: false,
  constructor: false,
  DataView: false,
  Date: false,
  decodeURI: false,
  decodeURIComponent: false,
  encodeURI: false,
  encodeURIComponent: false,
  Error: false,
  escape: false,
  eval: false,
  EvalError: false,
  Float32Array: false,
  Float64Array: false,
  Function: false,
  hasOwnProperty: false,
  Infinity: false,
  Int16Array: false,
  Int32Array: false,
  Int8Array: false,
  isFinite: false,
  isNaN: false,
  isPrototypeOf: false,
  JSON: false,
  Map: false,
  Math: false,
  NaN: false,
  Number: false,
  Object: false,
  parseFloat: false,
  parseInt: false,
  Promise: false,
  propertyIsEnumerable: false,
  Proxy: false,
  RangeError: false,
  ReferenceError: false,
  Reflect: false,
  RegExp: false,
  Set: false,
  SharedArrayBuffer: false,
  String: false,
  Symbol: false,
  SyntaxError: false,
  toLocaleString: false,
  toString: false,
  TypeError: false,
  Uint16Array: false,
  Uint32Array: false,
  Uint8Array: false,
  Uint8ClampedArray: false,
  undefined: false,
  unescape: false,
  URIError: false,
  valueOf: false,
  WeakMap: false,
  WeakSet: false
};
var browser = {
  AbortController: false,
  AbortSignal: false,
  addEventListener: false,
  alert: false,
  AnalyserNode: false,
  Animation: false,
  AnimationEffectReadOnly: false,
  AnimationEffectTiming: false,
  AnimationEffectTimingReadOnly: false,
  AnimationEvent: false,
  AnimationPlaybackEvent: false,
  AnimationTimeline: false,
  applicationCache: false,
  ApplicationCache: false,
  ApplicationCacheErrorEvent: false,
  atob: false,
  Attr: false,
  Audio: false,
  AudioBuffer: false,
  AudioBufferSourceNode: false,
  AudioContext: false,
  AudioDestinationNode: false,
  AudioListener: false,
  AudioNode: false,
  AudioParam: false,
  AudioProcessingEvent: false,
  AudioScheduledSourceNode: false,
  "AudioWorkletGlobalScope ": false,
  AudioWorkletNode: false,
  AudioWorkletProcessor: false,
  BarProp: false,
  BaseAudioContext: false,
  BatteryManager: false,
  BeforeUnloadEvent: false,
  BiquadFilterNode: false,
  Blob: false,
  BlobEvent: false,
  blur: false,
  BroadcastChannel: false,
  btoa: false,
  BudgetService: false,
  ByteLengthQueuingStrategy: false,
  Cache: false,
  caches: false,
  CacheStorage: false,
  cancelAnimationFrame: false,
  cancelIdleCallback: false,
  CanvasCaptureMediaStreamTrack: false,
  CanvasGradient: false,
  CanvasPattern: false,
  CanvasRenderingContext2D: false,
  ChannelMergerNode: false,
  ChannelSplitterNode: false,
  CharacterData: false,
  clearInterval: false,
  clearTimeout: false,
  clientInformation: false,
  ClipboardEvent: false,
  close: false,
  closed: false,
  CloseEvent: false,
  Comment: false,
  CompositionEvent: false,
  confirm: false,
  console: false,
  ConstantSourceNode: false,
  ConvolverNode: false,
  CountQueuingStrategy: false,
  createImageBitmap: false,
  Credential: false,
  CredentialsContainer: false,
  crypto: false,
  Crypto: false,
  CryptoKey: false,
  CSS: false,
  CSSConditionRule: false,
  CSSFontFaceRule: false,
  CSSGroupingRule: false,
  CSSImportRule: false,
  CSSKeyframeRule: false,
  CSSKeyframesRule: false,
  CSSMediaRule: false,
  CSSNamespaceRule: false,
  CSSPageRule: false,
  CSSRule: false,
  CSSRuleList: false,
  CSSStyleDeclaration: false,
  CSSStyleRule: false,
  CSSStyleSheet: false,
  CSSSupportsRule: false,
  CustomElementRegistry: false,
  customElements: false,
  CustomEvent: false,
  DataTransfer: false,
  DataTransferItem: false,
  DataTransferItemList: false,
  defaultstatus: false,
  defaultStatus: false,
  DelayNode: false,
  DeviceMotionEvent: false,
  DeviceOrientationEvent: false,
  devicePixelRatio: false,
  dispatchEvent: false,
  document: false,
  Document: false,
  DocumentFragment: false,
  DocumentType: false,
  DOMError: false,
  DOMException: false,
  DOMImplementation: false,
  DOMMatrix: false,
  DOMMatrixReadOnly: false,
  DOMParser: false,
  DOMPoint: false,
  DOMPointReadOnly: false,
  DOMQuad: false,
  DOMRect: false,
  DOMRectReadOnly: false,
  DOMStringList: false,
  DOMStringMap: false,
  DOMTokenList: false,
  DragEvent: false,
  DynamicsCompressorNode: false,
  Element: false,
  ErrorEvent: false,
  event: false,
  Event: false,
  EventSource: false,
  EventTarget: false,
  external: false,
  fetch: false,
  File: false,
  FileList: false,
  FileReader: false,
  find: false,
  focus: false,
  FocusEvent: false,
  FontFace: false,
  FontFaceSetLoadEvent: false,
  FormData: false,
  frameElement: false,
  frames: false,
  GainNode: false,
  Gamepad: false,
  GamepadButton: false,
  GamepadEvent: false,
  getComputedStyle: false,
  getSelection: false,
  HashChangeEvent: false,
  Headers: false,
  history: false,
  History: false,
  HTMLAllCollection: false,
  HTMLAnchorElement: false,
  HTMLAreaElement: false,
  HTMLAudioElement: false,
  HTMLBaseElement: false,
  HTMLBodyElement: false,
  HTMLBRElement: false,
  HTMLButtonElement: false,
  HTMLCanvasElement: false,
  HTMLCollection: false,
  HTMLContentElement: false,
  HTMLDataElement: false,
  HTMLDataListElement: false,
  HTMLDetailsElement: false,
  HTMLDialogElement: false,
  HTMLDirectoryElement: false,
  HTMLDivElement: false,
  HTMLDListElement: false,
  HTMLDocument: false,
  HTMLElement: false,
  HTMLEmbedElement: false,
  HTMLFieldSetElement: false,
  HTMLFontElement: false,
  HTMLFormControlsCollection: false,
  HTMLFormElement: false,
  HTMLFrameElement: false,
  HTMLFrameSetElement: false,
  HTMLHeadElement: false,
  HTMLHeadingElement: false,
  HTMLHRElement: false,
  HTMLHtmlElement: false,
  HTMLIFrameElement: false,
  HTMLImageElement: false,
  HTMLInputElement: false,
  HTMLLabelElement: false,
  HTMLLegendElement: false,
  HTMLLIElement: false,
  HTMLLinkElement: false,
  HTMLMapElement: false,
  HTMLMarqueeElement: false,
  HTMLMediaElement: false,
  HTMLMenuElement: false,
  HTMLMetaElement: false,
  HTMLMeterElement: false,
  HTMLModElement: false,
  HTMLObjectElement: false,
  HTMLOListElement: false,
  HTMLOptGroupElement: false,
  HTMLOptionElement: false,
  HTMLOptionsCollection: false,
  HTMLOutputElement: false,
  HTMLParagraphElement: false,
  HTMLParamElement: false,
  HTMLPictureElement: false,
  HTMLPreElement: false,
  HTMLProgressElement: false,
  HTMLQuoteElement: false,
  HTMLScriptElement: false,
  HTMLSelectElement: false,
  HTMLShadowElement: false,
  HTMLSlotElement: false,
  HTMLSourceElement: false,
  HTMLSpanElement: false,
  HTMLStyleElement: false,
  HTMLTableCaptionElement: false,
  HTMLTableCellElement: false,
  HTMLTableColElement: false,
  HTMLTableElement: false,
  HTMLTableRowElement: false,
  HTMLTableSectionElement: false,
  HTMLTemplateElement: false,
  HTMLTextAreaElement: false,
  HTMLTimeElement: false,
  HTMLTitleElement: false,
  HTMLTrackElement: false,
  HTMLUListElement: false,
  HTMLUnknownElement: false,
  HTMLVideoElement: false,
  IDBCursor: false,
  IDBCursorWithValue: false,
  IDBDatabase: false,
  IDBFactory: false,
  IDBIndex: false,
  IDBKeyRange: false,
  IDBObjectStore: false,
  IDBOpenDBRequest: false,
  IDBRequest: false,
  IDBTransaction: false,
  IDBVersionChangeEvent: false,
  IdleDeadline: false,
  IIRFilterNode: false,
  Image: false,
  ImageBitmap: false,
  ImageBitmapRenderingContext: false,
  ImageCapture: false,
  ImageData: false,
  indexedDB: false,
  innerHeight: false,
  innerWidth: false,
  InputEvent: false,
  IntersectionObserver: false,
  IntersectionObserverEntry: false,
  Intl: false,
  isSecureContext: false,
  KeyboardEvent: false,
  KeyframeEffect: false,
  KeyframeEffectReadOnly: false,
  length: false,
  localStorage: false,
  location: true,
  Location: false,
  locationbar: false,
  matchMedia: false,
  MediaDeviceInfo: false,
  MediaDevices: false,
  MediaElementAudioSourceNode: false,
  MediaEncryptedEvent: false,
  MediaError: false,
  MediaKeyMessageEvent: false,
  MediaKeySession: false,
  MediaKeyStatusMap: false,
  MediaKeySystemAccess: false,
  MediaList: false,
  MediaQueryList: false,
  MediaQueryListEvent: false,
  MediaRecorder: false,
  MediaSettingsRange: false,
  MediaSource: false,
  MediaStream: false,
  MediaStreamAudioDestinationNode: false,
  MediaStreamAudioSourceNode: false,
  MediaStreamEvent: false,
  MediaStreamTrack: false,
  MediaStreamTrackEvent: false,
  menubar: false,
  MessageChannel: false,
  MessageEvent: false,
  MessagePort: false,
  MIDIAccess: false,
  MIDIConnectionEvent: false,
  MIDIInput: false,
  MIDIInputMap: false,
  MIDIMessageEvent: false,
  MIDIOutput: false,
  MIDIOutputMap: false,
  MIDIPort: false,
  MimeType: false,
  MimeTypeArray: false,
  MouseEvent: false,
  moveBy: false,
  moveTo: false,
  MutationEvent: false,
  MutationObserver: false,
  MutationRecord: false,
  name: false,
  NamedNodeMap: false,
  NavigationPreloadManager: false,
  navigator: false,
  Navigator: false,
  NetworkInformation: false,
  Node: false,
  NodeFilter: false,
  NodeIterator: false,
  NodeList: false,
  Notification: false,
  OfflineAudioCompletionEvent: false,
  OfflineAudioContext: false,
  offscreenBuffering: false,
  OffscreenCanvas: true,
  onabort: true,
  onafterprint: true,
  onanimationend: true,
  onanimationiteration: true,
  onanimationstart: true,
  onappinstalled: true,
  onauxclick: true,
  onbeforeinstallprompt: true,
  onbeforeprint: true,
  onbeforeunload: true,
  onblur: true,
  oncancel: true,
  oncanplay: true,
  oncanplaythrough: true,
  onchange: true,
  onclick: true,
  onclose: true,
  oncontextmenu: true,
  oncuechange: true,
  ondblclick: true,
  ondevicemotion: true,
  ondeviceorientation: true,
  ondeviceorientationabsolute: true,
  ondrag: true,
  ondragend: true,
  ondragenter: true,
  ondragleave: true,
  ondragover: true,
  ondragstart: true,
  ondrop: true,
  ondurationchange: true,
  onemptied: true,
  onended: true,
  onerror: true,
  onfocus: true,
  ongotpointercapture: true,
  onhashchange: true,
  oninput: true,
  oninvalid: true,
  onkeydown: true,
  onkeypress: true,
  onkeyup: true,
  onlanguagechange: true,
  onload: true,
  onloadeddata: true,
  onloadedmetadata: true,
  onloadstart: true,
  onlostpointercapture: true,
  onmessage: true,
  onmessageerror: true,
  onmousedown: true,
  onmouseenter: true,
  onmouseleave: true,
  onmousemove: true,
  onmouseout: true,
  onmouseover: true,
  onmouseup: true,
  onmousewheel: true,
  onoffline: true,
  ononline: true,
  onpagehide: true,
  onpageshow: true,
  onpause: true,
  onplay: true,
  onplaying: true,
  onpointercancel: true,
  onpointerdown: true,
  onpointerenter: true,
  onpointerleave: true,
  onpointermove: true,
  onpointerout: true,
  onpointerover: true,
  onpointerup: true,
  onpopstate: true,
  onprogress: true,
  onratechange: true,
  onrejectionhandled: true,
  onreset: true,
  onresize: true,
  onscroll: true,
  onsearch: true,
  onseeked: true,
  onseeking: true,
  onselect: true,
  onstalled: true,
  onstorage: true,
  onsubmit: true,
  onsuspend: true,
  ontimeupdate: true,
  ontoggle: true,
  ontransitionend: true,
  onunhandledrejection: true,
  onunload: true,
  onvolumechange: true,
  onwaiting: true,
  onwheel: true,
  open: false,
  openDatabase: false,
  opener: false,
  Option: false,
  origin: false,
  OscillatorNode: false,
  outerHeight: false,
  outerWidth: false,
  PageTransitionEvent: false,
  pageXOffset: false,
  pageYOffset: false,
  PannerNode: false,
  parent: false,
  Path2D: false,
  PaymentAddress: false,
  PaymentRequest: false,
  PaymentRequestUpdateEvent: false,
  PaymentResponse: false,
  performance: false,
  Performance: false,
  PerformanceEntry: false,
  PerformanceLongTaskTiming: false,
  PerformanceMark: false,
  PerformanceMeasure: false,
  PerformanceNavigation: false,
  PerformanceNavigationTiming: false,
  PerformanceObserver: false,
  PerformanceObserverEntryList: false,
  PerformancePaintTiming: false,
  PerformanceResourceTiming: false,
  PerformanceTiming: false,
  PeriodicWave: false,
  Permissions: false,
  PermissionStatus: false,
  personalbar: false,
  PhotoCapabilities: false,
  Plugin: false,
  PluginArray: false,
  PointerEvent: false,
  PopStateEvent: false,
  postMessage: false,
  Presentation: false,
  PresentationAvailability: false,
  PresentationConnection: false,
  PresentationConnectionAvailableEvent: false,
  PresentationConnectionCloseEvent: false,
  PresentationConnectionList: false,
  PresentationReceiver: false,
  PresentationRequest: false,
  print: false,
  ProcessingInstruction: false,
  ProgressEvent: false,
  PromiseRejectionEvent: false,
  prompt: false,
  PushManager: false,
  PushSubscription: false,
  PushSubscriptionOptions: false,
  queueMicrotask: false,
  RadioNodeList: false,
  Range: false,
  ReadableStream: false,
  registerProcessor: false,
  RemotePlayback: false,
  removeEventListener: false,
  Request: false,
  requestAnimationFrame: false,
  requestIdleCallback: false,
  resizeBy: false,
  ResizeObserver: false,
  ResizeObserverEntry: false,
  resizeTo: false,
  Response: false,
  RTCCertificate: false,
  RTCDataChannel: false,
  RTCDataChannelEvent: false,
  RTCDtlsTransport: false,
  RTCIceCandidate: false,
  RTCIceGatherer: false,
  RTCIceTransport: false,
  RTCPeerConnection: false,
  RTCPeerConnectionIceEvent: false,
  RTCRtpContributingSource: false,
  RTCRtpReceiver: false,
  RTCRtpSender: false,
  RTCSctpTransport: false,
  RTCSessionDescription: false,
  RTCStatsReport: false,
  RTCTrackEvent: false,
  screen: false,
  Screen: false,
  screenLeft: false,
  ScreenOrientation: false,
  screenTop: false,
  screenX: false,
  screenY: false,
  ScriptProcessorNode: false,
  scroll: false,
  scrollbars: false,
  scrollBy: false,
  scrollTo: false,
  scrollX: false,
  scrollY: false,
  SecurityPolicyViolationEvent: false,
  Selection: false,
  self: false,
  ServiceWorker: false,
  ServiceWorkerContainer: false,
  ServiceWorkerRegistration: false,
  sessionStorage: false,
  setInterval: false,
  setTimeout: false,
  ShadowRoot: false,
  SharedWorker: false,
  SourceBuffer: false,
  SourceBufferList: false,
  speechSynthesis: false,
  SpeechSynthesisEvent: false,
  SpeechSynthesisUtterance: false,
  StaticRange: false,
  status: false,
  statusbar: false,
  StereoPannerNode: false,
  stop: false,
  Storage: false,
  StorageEvent: false,
  StorageManager: false,
  styleMedia: false,
  StyleSheet: false,
  StyleSheetList: false,
  SubtleCrypto: false,
  SVGAElement: false,
  SVGAngle: false,
  SVGAnimatedAngle: false,
  SVGAnimatedBoolean: false,
  SVGAnimatedEnumeration: false,
  SVGAnimatedInteger: false,
  SVGAnimatedLength: false,
  SVGAnimatedLengthList: false,
  SVGAnimatedNumber: false,
  SVGAnimatedNumberList: false,
  SVGAnimatedPreserveAspectRatio: false,
  SVGAnimatedRect: false,
  SVGAnimatedString: false,
  SVGAnimatedTransformList: false,
  SVGAnimateElement: false,
  SVGAnimateMotionElement: false,
  SVGAnimateTransformElement: false,
  SVGAnimationElement: false,
  SVGCircleElement: false,
  SVGClipPathElement: false,
  SVGComponentTransferFunctionElement: false,
  SVGDefsElement: false,
  SVGDescElement: false,
  SVGDiscardElement: false,
  SVGElement: false,
  SVGEllipseElement: false,
  SVGFEBlendElement: false,
  SVGFEColorMatrixElement: false,
  SVGFEComponentTransferElement: false,
  SVGFECompositeElement: false,
  SVGFEConvolveMatrixElement: false,
  SVGFEDiffuseLightingElement: false,
  SVGFEDisplacementMapElement: false,
  SVGFEDistantLightElement: false,
  SVGFEDropShadowElement: false,
  SVGFEFloodElement: false,
  SVGFEFuncAElement: false,
  SVGFEFuncBElement: false,
  SVGFEFuncGElement: false,
  SVGFEFuncRElement: false,
  SVGFEGaussianBlurElement: false,
  SVGFEImageElement: false,
  SVGFEMergeElement: false,
  SVGFEMergeNodeElement: false,
  SVGFEMorphologyElement: false,
  SVGFEOffsetElement: false,
  SVGFEPointLightElement: false,
  SVGFESpecularLightingElement: false,
  SVGFESpotLightElement: false,
  SVGFETileElement: false,
  SVGFETurbulenceElement: false,
  SVGFilterElement: false,
  SVGForeignObjectElement: false,
  SVGGElement: false,
  SVGGeometryElement: false,
  SVGGradientElement: false,
  SVGGraphicsElement: false,
  SVGImageElement: false,
  SVGLength: false,
  SVGLengthList: false,
  SVGLinearGradientElement: false,
  SVGLineElement: false,
  SVGMarkerElement: false,
  SVGMaskElement: false,
  SVGMatrix: false,
  SVGMetadataElement: false,
  SVGMPathElement: false,
  SVGNumber: false,
  SVGNumberList: false,
  SVGPathElement: false,
  SVGPatternElement: false,
  SVGPoint: false,
  SVGPointList: false,
  SVGPolygonElement: false,
  SVGPolylineElement: false,
  SVGPreserveAspectRatio: false,
  SVGRadialGradientElement: false,
  SVGRect: false,
  SVGRectElement: false,
  SVGScriptElement: false,
  SVGSetElement: false,
  SVGStopElement: false,
  SVGStringList: false,
  SVGStyleElement: false,
  SVGSVGElement: false,
  SVGSwitchElement: false,
  SVGSymbolElement: false,
  SVGTextContentElement: false,
  SVGTextElement: false,
  SVGTextPathElement: false,
  SVGTextPositioningElement: false,
  SVGTitleElement: false,
  SVGTransform: false,
  SVGTransformList: false,
  SVGTSpanElement: false,
  SVGUnitTypes: false,
  SVGUseElement: false,
  SVGViewElement: false,
  TaskAttributionTiming: false,
  Text: false,
  TextDecoder: false,
  TextEncoder: false,
  TextEvent: false,
  TextMetrics: false,
  TextTrack: false,
  TextTrackCue: false,
  TextTrackCueList: false,
  TextTrackList: false,
  TimeRanges: false,
  toolbar: false,
  top: false,
  Touch: false,
  TouchEvent: false,
  TouchList: false,
  TrackEvent: false,
  TransitionEvent: false,
  TreeWalker: false,
  UIEvent: false,
  URL: false,
  URLSearchParams: false,
  ValidityState: false,
  visualViewport: false,
  VisualViewport: false,
  VTTCue: false,
  WaveShaperNode: false,
  WebAssembly: false,
  WebGL2RenderingContext: false,
  WebGLActiveInfo: false,
  WebGLBuffer: false,
  WebGLContextEvent: false,
  WebGLFramebuffer: false,
  WebGLProgram: false,
  WebGLQuery: false,
  WebGLRenderbuffer: false,
  WebGLRenderingContext: false,
  WebGLSampler: false,
  WebGLShader: false,
  WebGLShaderPrecisionFormat: false,
  WebGLSync: false,
  WebGLTexture: false,
  WebGLTransformFeedback: false,
  WebGLUniformLocation: false,
  WebGLVertexArrayObject: false,
  WebSocket: false,
  WheelEvent: false,
  window: false,
  Window: false,
  Worker: false,
  WritableStream: false,
  XMLDocument: false,
  XMLHttpRequest: false,
  XMLHttpRequestEventTarget: false,
  XMLHttpRequestUpload: false,
  XMLSerializer: false,
  XPathEvaluator: false,
  XPathExpression: false,
  XPathResult: false,
  XSLTProcessor: false
};
var worker = {
  addEventListener: false,
  applicationCache: false,
  atob: false,
  Blob: false,
  BroadcastChannel: false,
  btoa: false,
  Cache: false,
  caches: false,
  clearInterval: false,
  clearTimeout: false,
  close: true,
  console: false,
  fetch: false,
  FileReaderSync: false,
  FormData: false,
  Headers: false,
  IDBCursor: false,
  IDBCursorWithValue: false,
  IDBDatabase: false,
  IDBFactory: false,
  IDBIndex: false,
  IDBKeyRange: false,
  IDBObjectStore: false,
  IDBOpenDBRequest: false,
  IDBRequest: false,
  IDBTransaction: false,
  IDBVersionChangeEvent: false,
  ImageData: false,
  importScripts: true,
  indexedDB: false,
  location: false,
  MessageChannel: false,
  MessagePort: false,
  name: false,
  navigator: false,
  Notification: false,
  onclose: true,
  onconnect: true,
  onerror: true,
  onlanguagechange: true,
  onmessage: true,
  onoffline: true,
  ononline: true,
  onrejectionhandled: true,
  onunhandledrejection: true,
  performance: false,
  Performance: false,
  PerformanceEntry: false,
  PerformanceMark: false,
  PerformanceMeasure: false,
  PerformanceNavigation: false,
  PerformanceResourceTiming: false,
  PerformanceTiming: false,
  postMessage: true,
  Promise: false,
  queueMicrotask: false,
  removeEventListener: false,
  Request: false,
  Response: false,
  self: true,
  ServiceWorkerRegistration: false,
  setInterval: false,
  setTimeout: false,
  TextDecoder: false,
  TextEncoder: false,
  URL: false,
  URLSearchParams: false,
  WebSocket: false,
  Worker: false,
  WorkerGlobalScope: false,
  XMLHttpRequest: false
};
var node = {
  __dirname: false,
  __filename: false,
  Buffer: false,
  clearImmediate: false,
  clearInterval: false,
  clearTimeout: false,
  console: false,
  exports: true,
  global: false,
  Intl: false,
  module: false,
  process: false,
  queueMicrotask: false,
  require: false,
  setImmediate: false,
  setInterval: false,
  setTimeout: false,
  TextDecoder: false,
  TextEncoder: false,
  URL: false,
  URLSearchParams: false
};
var commonjs = { exports: true, global: false, module: false, require: false },
  amd = { define: false, require: false };
var mocha = {
  after: false,
  afterEach: false,
  before: false,
  beforeEach: false,
  context: false,
  describe: false,
  it: false,
  mocha: false,
  run: false,
  setup: false,
  specify: false,
  suite: false,
  suiteSetup: false,
  suiteTeardown: false,
  teardown: false,
  test: false,
  xcontext: false,
  xdescribe: false,
  xit: false,
  xspecify: false
};
var jasmine = {
  afterAll: false,
  afterEach: false,
  beforeAll: false,
  beforeEach: false,
  describe: false,
  expect: false,
  fail: false,
  fdescribe: false,
  fit: false,
  it: false,
  jasmine: false,
  pending: false,
  runs: false,
  spyOn: false,
  spyOnProperty: false,
  waits: false,
  waitsFor: false,
  xdescribe: false,
  xit: false
};
var jest = {
  afterAll: false,
  afterEach: false,
  beforeAll: false,
  beforeEach: false,
  describe: false,
  expect: false,
  fdescribe: false,
  fit: false,
  it: false,
  jest: false,
  pit: false,
  require: false,
  test: false,
  xdescribe: false,
  xit: false,
  xtest: false
};
var qunit = {
  asyncTest: false,
  deepEqual: false,
  equal: false,
  expect: false,
  module: false,
  notDeepEqual: false,
  notEqual: false,
  notOk: false,
  notPropEqual: false,
  notStrictEqual: false,
  ok: false,
  propEqual: false,
  QUnit: false,
  raises: false,
  start: false,
  stop: false,
  strictEqual: false,
  test: false,
  throws: false
};
var phantomjs = { console: true, exports: true, phantom: true, require: true, WebPage: true };
var couch = {
  emit: false,
  exports: false,
  getRow: false,
  log: false,
  module: false,
  provides: false,
  require: false,
  respond: false,
  send: false,
  start: false,
  sum: false
};
var rhino = {
  defineClass: false,
  deserialize: false,
  gc: false,
  help: false,
  importClass: false,
  importPackage: false,
  java: false,
  load: false,
  loadClass: false,
  Packages: false,
  print: false,
  quit: false,
  readFile: false,
  readUrl: false,
  runCommand: false,
  seal: false,
  serialize: false,
  spawn: false,
  sync: false,
  toint32: false,
  version: false
};
var nashorn = {
  __DIR__: false,
  __FILE__: false,
  __LINE__: false,
  com: false,
  edu: false,
  exit: false,
  java: false,
  Java: false,
  javafx: false,
  JavaImporter: false,
  javax: false,
  JSAdapter: false,
  load: false,
  loadWithNewGlobal: false,
  org: false,
  Packages: false,
  print: false,
  quit: false
};
var wsh = {
  ActiveXObject: true,
  Enumerator: true,
  GetObject: true,
  ScriptEngine: true,
  ScriptEngineBuildVersion: true,
  ScriptEngineMajorVersion: true,
  ScriptEngineMinorVersion: true,
  VBArray: true,
  WScript: true,
  WSH: true,
  XDomainRequest: true
};
var jquery = { $: false, jQuery: false },
  yui = { YAHOO: false, YAHOO_config: false, YUI: false, YUI_config: false };
var shelljs = {
  cat: false,
  cd: false,
  chmod: false,
  config: false,
  cp: false,
  dirs: false,
  echo: false,
  env: false,
  error: false,
  exec: false,
  exit: false,
  find: false,
  grep: false,
  ln: false,
  ls: false,
  mkdir: false,
  mv: false,
  popd: false,
  pushd: false,
  pwd: false,
  rm: false,
  sed: false,
  set: false,
  target: false,
  tempdir: false,
  test: false,
  touch: false,
  which: false
};
var prototypejs = {
  $: false,
  $$: false,
  $A: false,
  $break: false,
  $continue: false,
  $F: false,
  $H: false,
  $R: false,
  $w: false,
  Abstract: false,
  Ajax: false,
  Autocompleter: false,
  Builder: false,
  Class: false,
  Control: false,
  Draggable: false,
  Draggables: false,
  Droppables: false,
  Effect: false,
  Element: false,
  Enumerable: false,
  Event: false,
  Field: false,
  Form: false,
  Hash: false,
  Insertion: false,
  ObjectRange: false,
  PeriodicalExecuter: false,
  Position: false,
  Prototype: false,
  Scriptaculous: false,
  Selector: false,
  Sortable: false,
  SortableObserver: false,
  Sound: false,
  Template: false,
  Toggle: false,
  Try: false
};
var meteor = {
  _: false,
  $: false,
  Accounts: false,
  AccountsClient: false,
  AccountsCommon: false,
  AccountsServer: false,
  App: false,
  Assets: false,
  Blaze: false,
  check: false,
  Cordova: false,
  DDP: false,
  DDPRateLimiter: false,
  DDPServer: false,
  Deps: false,
  EJSON: false,
  Email: false,
  HTTP: false,
  Log: false,
  Match: false,
  Meteor: false,
  Mongo: false,
  MongoInternals: false,
  Npm: false,
  Package: false,
  Plugin: false,
  process: false,
  Random: false,
  ReactiveDict: false,
  ReactiveVar: false,
  Router: false,
  ServiceConfiguration: false,
  Session: false,
  share: false,
  Spacebars: false,
  Template: false,
  Tinytest: false,
  Tracker: false,
  UI: false,
  Utils: false,
  WebApp: false,
  WebAppInternals: false
};
var mongo = {
  _isWindows: false,
  _rand: false,
  BulkWriteResult: false,
  cat: false,
  cd: false,
  connect: false,
  db: false,
  getHostName: false,
  getMemInfo: false,
  hostname: false,
  ISODate: false,
  listFiles: false,
  load: false,
  ls: false,
  md5sumFile: false,
  mkdir: false,
  Mongo: false,
  NumberInt: false,
  NumberLong: false,
  ObjectId: false,
  PlanCache: false,
  print: false,
  printjson: false,
  pwd: false,
  quit: false,
  removeFile: false,
  rs: false,
  sh: false,
  UUID: false,
  version: false,
  WriteResult: false
};
var applescript = {
  $: false,
  Application: false,
  Automation: false,
  console: false,
  delay: false,
  Library: false,
  ObjC: false,
  ObjectSpecifier: false,
  Path: false,
  Progress: false,
  Ref: false
};
var serviceworker = {
  addEventListener: false,
  applicationCache: false,
  atob: false,
  Blob: false,
  BroadcastChannel: false,
  btoa: false,
  Cache: false,
  caches: false,
  CacheStorage: false,
  clearInterval: false,
  clearTimeout: false,
  Client: false,
  clients: false,
  Clients: false,
  close: true,
  console: false,
  ExtendableEvent: false,
  ExtendableMessageEvent: false,
  fetch: false,
  FetchEvent: false,
  FileReaderSync: false,
  FormData: false,
  Headers: false,
  IDBCursor: false,
  IDBCursorWithValue: false,
  IDBDatabase: false,
  IDBFactory: false,
  IDBIndex: false,
  IDBKeyRange: false,
  IDBObjectStore: false,
  IDBOpenDBRequest: false,
  IDBRequest: false,
  IDBTransaction: false,
  IDBVersionChangeEvent: false,
  ImageData: false,
  importScripts: false,
  indexedDB: false,
  location: false,
  MessageChannel: false,
  MessagePort: false,
  name: false,
  navigator: false,
  Notification: false,
  onclose: true,
  onconnect: true,
  onerror: true,
  onfetch: true,
  oninstall: true,
  onlanguagechange: true,
  onmessage: true,
  onmessageerror: true,
  onnotificationclick: true,
  onnotificationclose: true,
  onoffline: true,
  ononline: true,
  onpush: true,
  onpushsubscriptionchange: true,
  onrejectionhandled: true,
  onsync: true,
  onunhandledrejection: true,
  performance: false,
  Performance: false,
  PerformanceEntry: false,
  PerformanceMark: false,
  PerformanceMeasure: false,
  PerformanceNavigation: false,
  PerformanceResourceTiming: false,
  PerformanceTiming: false,
  postMessage: true,
  Promise: false,
  queueMicrotask: false,
  registration: false,
  removeEventListener: false,
  Request: false,
  Response: false,
  self: false,
  ServiceWorker: false,
  ServiceWorkerContainer: false,
  ServiceWorkerGlobalScope: false,
  ServiceWorkerMessageEvent: false,
  ServiceWorkerRegistration: false,
  setInterval: false,
  setTimeout: false,
  skipWaiting: false,
  TextDecoder: false,
  TextEncoder: false,
  URL: false,
  URLSearchParams: false,
  WebSocket: false,
  WindowClient: false,
  Worker: false,
  WorkerGlobalScope: false,
  XMLHttpRequest: false
};
var atomtest = {
  advanceClock: false,
  fakeClearInterval: false,
  fakeClearTimeout: false,
  fakeSetInterval: false,
  fakeSetTimeout: false,
  resetTimeouts: false,
  waitsForPromise: false
};
var embertest = {
  andThen: false,
  click: false,
  currentPath: false,
  currentRouteName: false,
  currentURL: false,
  fillIn: false,
  find: false,
  findAll: false,
  findWithAssert: false,
  keyEvent: false,
  pauseTest: false,
  resumeTest: false,
  triggerEvent: false,
  visit: false,
  wait: false
};
var protractor = {
  $: false,
  $$: false,
  browser: false,
  by: false,
  By: false,
  DartObject: false,
  element: false,
  protractor: false
};
var webextensions = { browser: false, chrome: false, opr: false };
var greasemonkey = {
  cloneInto: false,
  createObjectIn: false,
  exportFunction: false,
  GM: false,
  GM_addStyle: false,
  GM_deleteValue: false,
  GM_getResourceText: false,
  GM_getResourceURL: false,
  GM_getValue: false,
  GM_info: false,
  GM_listValues: false,
  GM_log: false,
  GM_openInTab: false,
  GM_registerMenuCommand: false,
  GM_setClipboard: false,
  GM_setValue: false,
  GM_xmlhttpRequest: false,
  unsafeWindow: false
};
var devtools = {
  $: false,
  $_: false,
  $$: false,
  $0: false,
  $1: false,
  $2: false,
  $3: false,
  $4: false,
  $x: false,
  chrome: false,
  clear: false,
  copy: false,
  debug: false,
  dir: false,
  dirxml: false,
  getEventListeners: false,
  inspect: false,
  keys: false,
  monitor: false,
  monitorEvents: false,
  profile: false,
  profileEnd: false,
  queryObjects: false,
  table: false,
  undebug: false,
  unmonitor: false,
  unmonitorEvents: false,
  values: false
};
var require$$0 = {
  builtin,
  es5,
  es2015,
  es2017,
  browser,
  worker,
  node,
  commonjs,
  amd,
  mocha,
  jasmine,
  jest,
  qunit,
  phantomjs,
  couch,
  rhino,
  nashorn,
  wsh,
  jquery,
  yui,
  shelljs,
  prototypejs,
  meteor,
  mongo,
  applescript,
  serviceworker,
  atomtest,
  embertest,
  protractor,
  "shared-node-browser": {
    clearInterval: false,
    clearTimeout: false,
    console: false,
    setInterval: false,
    setTimeout: false,
    URL: false,
    URLSearchParams: false
  },
  webextensions,
  greasemonkey,
  devtools
};

var globals = require$$0;

const {
  NOT_LOCAL_BINDING: NOT_LOCAL_BINDING$1,
  callExpression: callExpression$3,
  cloneNode: cloneNode$4,
  getBindingIdentifiers: getBindingIdentifiers$1,
  identifier: identifier$5,
  isArrayExpression,
  isBinary,
  isClass,
  isClassBody,
  isClassDeclaration,
  isExportAllDeclaration,
  isExportDefaultDeclaration,
  isExportNamedDeclaration: isExportNamedDeclaration$1,
  isFunctionDeclaration,
  isIdentifier: isIdentifier$7,
  isImportDeclaration: isImportDeclaration$1,
  isLiteral: isLiteral$2,
  isMethod,
  isModuleSpecifier,
  isNullLiteral: isNullLiteral$1,
  isObjectExpression,
  isProperty,
  isPureish,
  isRegExpLiteral: isRegExpLiteral$1,
  isSuper: isSuper$1,
  isTaggedTemplateExpression,
  isTemplateLiteral: isTemplateLiteral$1,
  isThisExpression,
  isUnaryExpression,
  isVariableDeclaration: isVariableDeclaration$1,
  matchesPattern: matchesPattern$1,
  memberExpression: memberExpression$1,
  numericLiteral: numericLiteral$2,
  toIdentifier,
  unaryExpression: unaryExpression$2,
  variableDeclaration: variableDeclaration$1,
  variableDeclarator: variableDeclarator$1,
  isRecordExpression,
  isTupleExpression,
  isObjectProperty: isObjectProperty$1,
  isTopicReference,
  isMetaProperty,
  isPrivateName,
  isExportDeclaration: isExportDeclaration$1
} = _t;
function gatherNodeParts(node, parts) {
  switch (node == null ? void 0 : node.type) {
    default:
      if (isImportDeclaration$1(node) || isExportDeclaration$1(node)) {
        var _node$specifiers;
        if (
          (isExportAllDeclaration(node) || isExportNamedDeclaration$1(node) || isImportDeclaration$1(node)) &&
          node.source
        )
          gatherNodeParts(node.source, parts);
        else if (
          (isExportNamedDeclaration$1(node) || isImportDeclaration$1(node)) &&
          (_node$specifiers = node.specifiers) != null &&
          _node$specifiers.length
        )
          for (const e of node.specifiers) gatherNodeParts(e, parts);
        else
          (isExportDefaultDeclaration(node) || isExportNamedDeclaration$1(node)) && node.declaration &&
            gatherNodeParts(node.declaration, parts);
      } else
        isModuleSpecifier(node)
          ? gatherNodeParts(node.local, parts)
          : !isLiteral$2(node) || isNullLiteral$1(node) || isRegExpLiteral$1(node) || isTemplateLiteral$1(node) ||
            parts.push(node.value);

      break;
    case "MemberExpression":
    case "OptionalMemberExpression":
    case "JSXMemberExpression":
      gatherNodeParts(node.object, parts);
      gatherNodeParts(node.property, parts);
      break;
    case "Identifier":
    case "JSXIdentifier":
      parts.push(node.name);
      break;
    case "CallExpression":
    case "OptionalCallExpression":
    case "NewExpression":
      gatherNodeParts(node.callee, parts);
      break;
    case "ObjectExpression":
    case "ObjectPattern":
      for (const e of node.properties) gatherNodeParts(e, parts);

      break;
    case "SpreadElement":
    case "RestElement":
      gatherNodeParts(node.argument, parts);
      break;
    case "ObjectProperty":
    case "ObjectMethod":
    case "ClassProperty":
    case "ClassMethod":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
      gatherNodeParts(node.key, parts);
      break;
    case "ThisExpression":
      parts.push("this");
      break;
    case "Super":
      parts.push("super");
      break;
    case "Import":
      parts.push("import");
      break;
    case "DoExpression":
      parts.push("do");
      break;
    case "YieldExpression":
      parts.push("yield");
      gatherNodeParts(node.argument, parts);
      break;
    case "AwaitExpression":
      parts.push("await");
      gatherNodeParts(node.argument, parts);
      break;
    case "AssignmentExpression":
      gatherNodeParts(node.left, parts);
      break;
    case "VariableDeclarator":
      gatherNodeParts(node.id, parts);
      break;
    case "FunctionExpression":
    case "FunctionDeclaration":
    case "ClassExpression":
    case "ClassDeclaration":
    case "PrivateName":
      gatherNodeParts(node.id, parts);
      break;
    case "ParenthesizedExpression":
      gatherNodeParts(node.expression, parts);
      break;
    case "UnaryExpression":
    case "UpdateExpression":
      gatherNodeParts(node.argument, parts);
      break;
    case "MetaProperty":
      gatherNodeParts(node.meta, parts);
      gatherNodeParts(node.property, parts);
      break;
    case "JSXElement":
      gatherNodeParts(node.openingElement, parts);
      break;
    case "JSXOpeningElement":
      gatherNodeParts(node.name, parts);
      break;
    case "JSXFragment":
      gatherNodeParts(node.openingFragment, parts);
      break;
    case "JSXOpeningFragment":
      parts.push("Fragment");
      break;
    case "JSXNamespacedName":
      gatherNodeParts(node.namespace, parts);
      gatherNodeParts(node.name, parts);
      break;
  }
}
const collectorVisitor = {
  ForStatement(path) {
    const declar = path.get("init");
    if (declar.isVar()) {
      const { scope } = path;
      (scope.getFunctionParent() || scope.getProgramParent()).registerBinding("var", declar);
    }
  },
  Declaration(path) {
    path.isBlockScoped() ||
      path.isImportDeclaration() ||
      path.isExportDeclaration() ||
      (path.scope.getFunctionParent() || path.scope.getProgramParent()).registerDeclaration(path);
  },
  ImportDeclaration(path) {
    path.scope.getBlockParent().registerDeclaration(path);
  },
  ReferencedIdentifier(path, state) {
    state.references.push(path);
  },
  ForXStatement(path, state) {
    const left = path.get("left");
    if (left.isPattern() || left.isIdentifier()) state.constantViolations.push(path);
    else if (left.isVar()) {
      const { scope } = path;
      (scope.getFunctionParent() || scope.getProgramParent()).registerBinding("var", left);
    }
  },
  ExportDeclaration: {
    exit(path) {
      const { node, scope } = path;
      if (isExportAllDeclaration(node)) return;
      const declar = node.declaration;
      if (isClassDeclaration(declar) || isFunctionDeclaration(declar)) {
        const id = declar.id;
        if (!id) return;
        const binding = scope.getBinding(id.name);
        binding == null || binding.reference(path);
      } else if (isVariableDeclaration$1(declar))
        for (const decl of declar.declarations)
          for (const name of Object.keys(getBindingIdentifiers$1(decl))) {
            const binding = scope.getBinding(name);
            binding == null || binding.reference(path);
          }
    }
  },
  LabeledStatement(path) {
    path.scope.getBlockParent().registerDeclaration(path);
  },
  AssignmentExpression(path, state) {
    state.assignments.push(path);
  },
  UpdateExpression(path, state) {
    state.constantViolations.push(path);
  },
  UnaryExpression(path, state) {
    path.node.operator !== "delete" || state.constantViolations.push(path);
  },
  BlockScoped(path) {
    let scope = path.scope;
    if (scope.path === path) scope = scope.parent;
    scope.getBlockParent().registerDeclaration(path);
    if (path.isClassDeclaration() && path.node.id) {
      const name = path.node.id.name;
      path.scope.bindings[name] = path.scope.parent.getBinding(name);
    }
  },
  CatchClause(path) {
    path.scope.registerBinding("let", path);
  },
  Function(path) {
    const params = path.get("params");
    for (const param of params) path.scope.registerBinding("param", param);

    path.isFunctionExpression() && path.has("id") && !path.get("id").node[NOT_LOCAL_BINDING$1] &&
      path.scope.registerBinding("local", path.get("id"), path);
  },
  ClassExpression(path) {
    !path.has("id") || path.get("id").node[NOT_LOCAL_BINDING$1] || path.scope.registerBinding("local", path);
  }
};
let uid = 0;
// noinspection JSUnusedGlobalSymbols
class Scope {
  constructor(path) {
    this.uid = void 0;
    this.path = void 0;
    this.block = void 0;
    this.labels = void 0;
    this.inited = void 0;
    this.bindings = void 0;
    this.references = void 0;
    this.globals = void 0;
    this.uids = void 0;
    this.data = void 0;
    this.crawling = void 0;
    const { node } = path,
      cached = scope.get(node);
    if ((cached == null ? void 0 : cached.path) === path) return cached;

    scope.set(node, this);
    this.uid = uid++;
    this.block = node;
    this.path = path;
    this.labels = new Map();
    this.inited = false;
  }
  get parent() {
    var _parent;
    let parent,
      path = this.path;
    do {
      const shouldSkip = path.key === "key" || path.listKey === "decorators";
      path = path.parentPath;
      if (shouldSkip && path.isMethod()) path = path.parentPath;
      if (path && path.isScope()) parent = path;
    } while (path && !parent);
    return (_parent = parent) == null ? void 0 : _parent.scope;
  }
  get parentBlock() {
    return this.path.parent;
  }
  get hub() {
    return this.path.hub;
  }
  traverse(node, opts, state) {
    traverse(node, opts, this, state, this.path);
  }
  generateDeclaredUidIdentifier(name) {
    const id = this.generateUidIdentifier(name);
    this.push({ id });
    return cloneNode$4(id);
  }
  generateUidIdentifier(name) {
    return identifier$5(this.generateUid(name));
  }
  generateUid(name = "temp") {
    name = toIdentifier(name).replace(/^_+/, "").replace(/[0-9]+$/g, "");
    let uid,
      i = 1;
    do {
      uid = this._generateUid(name, i);
      i++;
    } while (this.hasLabel(uid) || this.hasBinding(uid) || this.hasGlobal(uid) || this.hasReference(uid));
    const program = this.getProgramParent();
    program.references[uid] = true;
    program.uids[uid] = true;
    return uid;
  }
  _generateUid(name, i) {
    let id = name;
    if (i > 1) id += i;
    return "_" + id;
  }
  generateUidBasedOnNode(node, defaultName) {
    const parts = [];
    gatherNodeParts(node, parts);
    let id = parts.join("$");
    id = id.replace(/^_/, "") || defaultName || "ref";
    return this.generateUid(id.slice(0, 20));
  }
  generateUidIdentifierBasedOnNode(node, defaultName) {
    return identifier$5(this.generateUidBasedOnNode(node, defaultName));
  }
  isStatic(node) {
    if (isThisExpression(node) || isSuper$1(node) || isTopicReference(node)) return true;

    if (isIdentifier$7(node)) {
      const binding = this.getBinding(node.name);
      return binding ? binding.constant : this.hasBinding(node.name);
    }
    return false;
  }
  maybeGenerateMemoised(node, dontPush) {
    if (this.isStatic(node)) return null;

    const id = this.generateUidIdentifierBasedOnNode(node);
    if (!dontPush) {
      this.push({ id });
      return cloneNode$4(id);
    }
    return id;
  }
  checkBlockScopedCollisions(local, kind, name, id) {
    if (
      kind !== "param" &&
      local.kind !== "local" &&
      (kind === "let" ||
        local.kind === "let" ||
        local.kind === "const" ||
        local.kind === "module" ||
        (local.kind === "param" && kind === "const"))
    )
      throw this.hub.buildError(id, `Duplicate declaration "${name}"`, TypeError);
  }
  rename(oldName, newName) {
    const binding = this.getBinding(oldName);
    if (binding) {
      newName || (newName = this.generateUidIdentifier(oldName).name);

      new Renamer(binding, oldName, newName).rename(arguments[2]);
    }
  }
  _renameFromMap(map, oldName, newName, value) {
    if (map[oldName]) {
      map[newName] = value;
      map[oldName] = null;
    }
  }
  dump() {
    const sep = "-".repeat(60);
    console.log(sep);
    let scope = this;
    do {
      console.log("#", scope.block.type);
      for (const name of Object.keys(scope.bindings)) {
        const binding = scope.bindings[name];
        console.log(" -", name, {
          constant: binding.constant,
          references: binding.references,
          violations: binding.constantViolations.length,
          kind: binding.kind
        });
      }
    } while ((scope = scope.parent));
    console.log(sep);
  }
  toArray(node, i, arrayLikeIsIterable) {
    if (isIdentifier$7(node)) {
      const binding = this.getBinding(node.name);
      if (binding != null && binding.constant && binding.path.isGenericType("Array")) return node;
    }
    if (isArrayExpression(node)) return node;

    if (isIdentifier$7(node, { name: "arguments" }))
      return callExpression$3(memberExpression$1(
        memberExpression$1(
          memberExpression$1(identifier$5("Array"), identifier$5("prototype")),
          identifier$5("slice")
        ),
        identifier$5("call")
      ), [node]);

    let helperName;
    const args = [node];
    if (i === true) helperName = "toConsumableArray";
    else if (typeof i == "number") {
      args.push(numericLiteral$2(i));
      helperName = "slicedToArray";
    } else helperName = "toArray";

    if (arrayLikeIsIterable) {
      args.unshift(this.hub.addHelper(helperName));
      helperName = "maybeArrayLike";
    }
    return callExpression$3(this.hub.addHelper(helperName), args);
  }
  hasLabel(name) {
    return !!this.getLabel(name);
  }
  getLabel(name) {
    return this.labels.get(name);
  }
  registerLabel(path) {
    this.labels.set(path.node.label.name, path);
  }
  registerDeclaration(path) {
    if (path.isLabeledStatement()) this.registerLabel(path);
    else if (path.isFunctionDeclaration()) this.registerBinding("hoisted", path.get("id"), path);
    else if (path.isVariableDeclaration()) {
      const declarations = path.get("declarations"),
        { kind } = path.node;
      for (const declar of declarations)
        this.registerBinding(kind === "using" || kind === "await using" ? "const" : kind, declar);
    } else if (path.isClassDeclaration()) {
      if (path.node.declare) return;
      this.registerBinding("let", path);
    } else if (path.isImportDeclaration()) {
      const isTypeDeclaration = path.node.importKind === "type" || path.node.importKind === "typeof",
        specifiers = path.get("specifiers");
      for (const specifier of specifiers) {
        const isTypeSpecifier =
          isTypeDeclaration ||
          (specifier.isImportSpecifier() &&
            (specifier.node.importKind === "type" || specifier.node.importKind === "typeof"));
        this.registerBinding(isTypeSpecifier ? "unknown" : "module", specifier);
      }
    } else if (path.isExportDeclaration()) {
      const declar = path.get("declaration");
      if (declar.isClassDeclaration() || declar.isFunctionDeclaration() || declar.isVariableDeclaration())
        this.registerDeclaration(declar);
    } else this.registerBinding("unknown", path);
  }
  buildUndefinedNode() {
    return unaryExpression$2("void", numericLiteral$2(0), true);
  }
  registerConstantViolation(path) {
    const ids = path.getBindingIdentifiers();
    for (const name of Object.keys(ids)) {
      var _this$getBinding;
      (_this$getBinding = this.getBinding(name)) == null || _this$getBinding.reassign(path);
    }
  }
  registerBinding(kind, path, bindingPath = path) {
    if (!kind) throw new ReferenceError("no `kind`");
    if (path.isVariableDeclaration()) {
      const declarators = path.get("declarations");
      for (const declar of declarators) this.registerBinding(kind, declar);

      return;
    }
    const parent = this.getProgramParent(),
      ids = path.getOuterBindingIdentifiers(true);
    for (const name of Object.keys(ids)) {
      parent.references[name] = true;
      for (const id of ids[name]) {
        const local = this.getOwnBinding(name);
        if (local) {
          if (local.identifier === id) continue;
          this.checkBlockScopedCollisions(local, kind, name, id);
        }
        local
          ? this.registerConstantViolation(bindingPath)
          : (this.bindings[name] = new Binding({ identifier: id, scope: this, path: bindingPath, kind }));
      }
    }
  }
  addGlobal(node) {
    this.globals[node.name] = node;
  }
  hasUid(name) {
    let scope = this;
    do {
      if (scope.uids[name]) return true;
    } while ((scope = scope.parent));
    return false;
  }
  hasGlobal(name) {
    let scope = this;
    do {
      if (scope.globals[name]) return true;
    } while ((scope = scope.parent));
    return false;
  }
  hasReference(name) {
    return !!this.getProgramParent().references[name];
  }
  isPure(node, constantsOnly) {
    if (isIdentifier$7(node)) {
      const binding = this.getBinding(node.name);
      return !!binding && (!constantsOnly || binding.constant);
    }
    if (isThisExpression(node) || isMetaProperty(node) || isTopicReference(node) || isPrivateName(node)) return true;
    if (isClass(node)) {
      var _node$decorators;
      return (
        !(node.superClass && !this.isPure(node.superClass, constantsOnly)) &&
        ((_node$decorators = node.decorators) == null ? void 0 : _node$decorators.length) <= 0 &&
        this.isPure(node.body, constantsOnly)
      );
    }
    if (isClassBody(node)) {
      for (const method of node.body) if (!this.isPure(method, constantsOnly)) return false;

      return true;
    }
    if (isBinary(node)) return this.isPure(node.left, constantsOnly) && this.isPure(node.right, constantsOnly);
    if (isArrayExpression(node) || isTupleExpression(node)) {
      for (const elem of node.elements) if (elem !== null && !this.isPure(elem, constantsOnly)) return false;

      return true;
    }
    if (isObjectExpression(node) || isRecordExpression(node)) {
      for (const prop of node.properties) if (!this.isPure(prop, constantsOnly)) return false;

      return true;
    }
    if (isMethod(node)) {
      var _node$decorators2;
      return !(
        (node.computed && !this.isPure(node.key, constantsOnly)) ||
        ((_node$decorators2 = node.decorators) == null ? void 0 : _node$decorators2.length) > 0
      );
    }
    if (isProperty(node)) {
      var _node$decorators3;
      return !(
        (node.computed && !this.isPure(node.key, constantsOnly)) ||
        ((_node$decorators3 = node.decorators) == null ? void 0 : _node$decorators3.length) > 0 ||
        ((isObjectProperty$1(node) || node.static) && node.value !== null && !this.isPure(node.value, constantsOnly))
      );
    }
    if (isUnaryExpression(node)) return this.isPure(node.argument, constantsOnly);
    if (isTaggedTemplateExpression(node))
      return (
        matchesPattern$1(node.tag, "String.raw") &&
        !this.hasBinding("String", true) &&
        this.isPure(node.quasi, constantsOnly)
      );
    if (isTemplateLiteral$1(node)) {
      for (const expression of node.expressions) if (!this.isPure(expression, constantsOnly)) return false;

      return true;
    }
    return isPureish(node);
  }
  setData(key, val) {
    return (this.data[key] = val);
  }
  getData(key) {
    let scope = this;
    do {
      const data = scope.data[key];
      if (data != null) return data;
    } while ((scope = scope.parent));
  }
  removeData(key) {
    let scope = this;
    do {
      if (scope.data[key] != null) scope.data[key] = null;
    } while ((scope = scope.parent));
  }
  init() {
    if (!this.inited) {
      this.inited = true;
      this.crawl();
    }
  }
  crawl() {
    const path = this.path;
    this.references = Object.create(null);
    this.bindings = Object.create(null);
    this.globals = Object.create(null);
    this.uids = Object.create(null);
    this.data = Object.create(null);
    const programParent = this.getProgramParent();
    if (programParent.crawling) return;
    const state = { references: [], constantViolations: [], assignments: [] };
    this.crawling = true;
    if (path.type !== "Program" && isExplodedVisitor(collectorVisitor)) {
      for (const visit of collectorVisitor.enter) visit.call(state, path, state);

      const typeVisitors = collectorVisitor[path.type];
      if (typeVisitors) for (const visit of typeVisitors.enter) visit.call(state, path, state);
    }
    path.traverse(collectorVisitor, state);
    this.crawling = false;
    for (const path of state.assignments) {
      const ids = path.getBindingIdentifiers();
      for (const name of Object.keys(ids)) path.scope.getBinding(name) || programParent.addGlobal(ids[name]);

      path.scope.registerConstantViolation(path);
    }
    for (const ref of state.references) {
      const binding = ref.scope.getBinding(ref.node.name);
      binding ? binding.reference(ref) : programParent.addGlobal(ref.node);
    }
    for (const path of state.constantViolations) path.scope.registerConstantViolation(path);
  }
  push(opts) {
    let path = this.path;
    path.isPattern()
      ? (path = this.getPatternParent().path)
      : path.isBlockStatement() || path.isProgram() || (path = this.getBlockParent().path);

    if (path.isSwitchStatement()) path = (this.getFunctionParent() || this.getProgramParent()).path;

    const { init, unique, kind = "var", id } = opts;
    if (
      !init &&
      !unique &&
      (kind === "var" || kind === "let") &&
      path.isFunction() &&
      !path.node.name &&
      _t.isCallExpression(path.parent, { callee: path.node }) &&
      path.parent.arguments.length <= path.node.params.length &&
      _t.isIdentifier(id)
    ) {
      path.pushContainer("params", id);
      path.scope.registerBinding("param", path.get("params")[path.node.params.length - 1]);
      return;
    }
    if (path.isLoop() || path.isCatchClause() || path.isFunction()) {
      path.ensureBlock();
      path = path.get("body");
    }
    const blockHoist = opts._blockHoist == null ? 2 : opts._blockHoist,
      dataKey = `declaration:${kind}:${blockHoist}`;
    let declarPath = !unique && path.getData(dataKey);
    if (!declarPath) {
      const declar = variableDeclaration$1(kind, []);
      declar._blockHoist = blockHoist;
      [declarPath] = path.unshiftContainer("body", [declar]);
      unique || path.setData(dataKey, declarPath);
    }
    const declarator = variableDeclarator$1(id, init),
      len = declarPath.node.declarations.push(declarator);
    path.scope.registerBinding(kind, declarPath.get("declarations")[len - 1]);
  }
  getProgramParent() {
    let scope = this;
    do {
      if (scope.path.isProgram()) return scope;
    } while ((scope = scope.parent));
    throw new Error("Couldn't find a Program");
  }
  getFunctionParent() {
    let scope = this;
    do {
      if (scope.path.isFunctionParent()) return scope;
    } while ((scope = scope.parent));
    return null;
  }
  getBlockParent() {
    let scope = this;
    do {
      if (scope.path.isBlockParent()) return scope;
    } while ((scope = scope.parent));
    throw new Error("We couldn't find a BlockStatement, For, Switch, Function, Loop or Program...");
  }
  getPatternParent() {
    let scope = this;
    do {
      if (!scope.path.isPattern()) return scope.getBlockParent();
    } while ((scope = scope.parent.parent));
    throw new Error("We couldn't find a BlockStatement, For, Switch, Function, Loop or Program...");
  }
  getAllBindings() {
    const ids = Object.create(null);
    let scope = this;
    do {
      for (const key of Object.keys(scope.bindings)) key in ids || (ids[key] = scope.bindings[key]);

      scope = scope.parent;
    } while (scope);
    return ids;
  }
  getAllBindingsOfKind(...kinds) {
    const ids = Object.create(null);
    for (const kind of kinds) {
      let scope = this;
      do {
        for (const name of Object.keys(scope.bindings)) {
          const binding = scope.bindings[name];
          if (binding.kind === kind) ids[name] = binding;
        }
        scope = scope.parent;
      } while (scope);
    }
    return ids;
  }
  bindingIdentifierEquals(name, node) {
    return this.getBindingIdentifier(name) === node;
  }
  getBinding(name) {
    let previousPath = void 0,
      scope = this;
    do {
      const binding = scope.getOwnBinding(name);
      if (binding) {
        var _previousPath;
        if (
          (_previousPath = previousPath) == null ||
          !_previousPath.isPattern() ||
          binding.kind === "param" ||
          binding.kind === "local"
        )
          return binding;
      } else if (!binding && name === "arguments" && scope.path.isFunction() && !scope.path.isArrowFunctionExpression())
        break;

      previousPath = scope.path;
    } while ((scope = scope.parent));
  }
  getOwnBinding(name) {
    return this.bindings[name];
  }
  getBindingIdentifier(name) {
    var _this$getBinding2;
    return (_this$getBinding2 = this.getBinding(name)) == null ? void 0 : _this$getBinding2.identifier;
  }
  getOwnBindingIdentifier(name) {
    const binding = this.bindings[name];
    return binding == null ? void 0 : binding.identifier;
  }
  hasOwnBinding(name) {
    return !!this.getOwnBinding(name);
  }
  hasBinding(name, opts) {
    var _opts, _opts2, _opts3;
    if (!name) return false;
    if (this.hasOwnBinding(name)) return true;

    if (typeof opts == "boolean") opts = { noGlobals: opts };

    return !(
      !this.parentHasBinding(name, opts) &&
      (((_opts = opts) != null && _opts.noUids) || !this.hasUid(name)) &&
      (((_opts2 = opts) != null && _opts2.noGlobals) || !Scope.globals.includes(name)) &&
      (((_opts3 = opts) != null && _opts3.noGlobals) || !Scope.contextVariables.includes(name))
    );
  }
  parentHasBinding(name, opts) {
    var _this$parent;
    return (_this$parent = this.parent) == null ? void 0 : _this$parent.hasBinding(name, opts);
  }
  moveBindingTo(name, scope) {
    const info = this.getBinding(name);
    if (info) {
      info.scope.removeOwnBinding(name);
      info.scope = scope;
      scope.bindings[name] = info;
    }
  }
  removeOwnBinding(name) {
    delete this.bindings[name];
  }
  removeBinding(name) {
    var _this$getBinding3;
    (_this$getBinding3 = this.getBinding(name)) == null || _this$getBinding3.scope.removeOwnBinding(name);
    let scope = this;
    do {
      if (scope.uids[name]) scope.uids[name] = false;
    } while ((scope = scope.parent));
  }
}
Scope.globals = Object.keys(globals.builtin);
Scope.contextVariables = ["arguments", "undefined", "Infinity", "NaN"];

const { VISITOR_KEYS: VISITOR_KEYS$4 } = _t;
function findParent(callback) {
  for (let path = this; (path = path.parentPath); ) if (callback(path)) return path;

  return null;
}
function find(callback) {
  let path = this;
  do {
    if (callback(path)) return path;
  } while ((path = path.parentPath));
  return null;
}
function getFunctionParent() {
  return this.findParent(p => p.isFunction());
}
function getStatementParent() {
  let path = this;
  do {
    if (!path.parentPath || (Array.isArray(path.container) && path.isStatement())) break;

    path = path.parentPath;
  } while (path);
  if (path && (path.isProgram() || path.isFile()))
    throw new Error("File/Program node, we can't possibly find a statement parent to this");

  return path;
}
function getEarliestCommonAncestorFrom(paths) {
  return this.getDeepestCommonAncestorFrom(paths, function (deepest, i, ancestries) {
    let earliest = void 0;
    const keys = VISITOR_KEYS$4[deepest.type];
    for (const ancestry of ancestries) {
      const path = ancestry[i + 1];

      if (!earliest) earliest = path;
      else if (path.listKey && earliest.listKey === path.listKey && path.key < earliest.key) earliest = path;
      else if (keys.indexOf(earliest.parentKey) > keys.indexOf(path.parentKey)) earliest = path;
    }
    return earliest;
  });
}
function getDeepestCommonAncestorFrom(paths, filter) {
  if (!paths.length) return this;
  if (paths.length === 1) return paths[0];

  let lastCommonIndex, lastCommon,
    minDepth = Infinity;
  const ancestries = paths.map(path => {
    const ancestry = [];
    do {
      ancestry.unshift(path);
    } while ((path = path.parentPath) && path !== this);
    if (ancestry.length < minDepth) minDepth = ancestry.length;

    return ancestry;
  });
  const first = ancestries[0];
  depthLoop: for (let i = 0; i < minDepth; i++) {
    const shouldMatch = first[i];
    for (const ancestry of ancestries) if (ancestry[i] !== shouldMatch) break depthLoop;

    lastCommonIndex = i;
    lastCommon = shouldMatch;
  }
  if (lastCommon) return filter ? filter(lastCommon, lastCommonIndex, ancestries) : lastCommon;

  throw new Error("Couldn't find intersection");
}
function getAncestry() {
  let path = this;
  const paths = [];
  do {
    paths.push(path);
  } while ((path = path.parentPath));
  return paths;
}
function isAncestor(maybeDescendant) {
  return maybeDescendant.isDescendant(this);
}
function isDescendant(maybeAncestor) {
  return !!this.findParent(parent => parent === maybeAncestor);
}
function inType(...candidateTypes) {
  for (let path = this; path; ) {
    for (const type of candidateTypes) if (path.node.type === type) return true;

    path = path.parentPath;
  }
  return false;
}

var NodePath_ancestry = Object.freeze({
  __proto__: null,
  find,
  findParent,
  getAncestry,
  getDeepestCommonAncestorFrom,
  getEarliestCommonAncestorFrom,
  getFunctionParent,
  getStatementParent,
  inType,
  isAncestor,
  isDescendant
});

const { createFlowUnionType, createTSUnionType, createUnionTypeAnnotation, isFlowType /*, isTSType */ } = _t;
function createUnionType(types) {
  return isFlowType(types[0])
    ? createFlowUnionType
      ? createFlowUnionType(types)
      : createUnionTypeAnnotation(types)
    : createTSUnionType
    ? createTSUnionType(types)
    : void 0;
}

const {
  BOOLEAN_NUMBER_BINARY_OPERATORS,
  createTypeAnnotationBasedOnTypeof,
  numberTypeAnnotation: numberTypeAnnotation$1,
  voidTypeAnnotation: voidTypeAnnotation$2
} = _t;
function infererReference(node) {
  if (!this.isReferenced()) return;
  const binding = this.scope.getBinding(node.name);
  if (binding)
    return binding.identifier.typeAnnotation
      ? binding.identifier.typeAnnotation
      : getTypeAnnotationBindingConstantViolations(binding, this, node.name);

  if (node.name === "undefined") return voidTypeAnnotation$2();
  if (node.name === "NaN" || node.name === "Infinity") return numberTypeAnnotation$1();
  //if (node.name === "arguments");
}
function getTypeAnnotationBindingConstantViolations(binding, path, name) {
  const types = [],
    functionConstantViolations = [];
  let constantViolations = getConstantViolationsBefore(binding, path, functionConstantViolations);
  const testType = getConditionalAnnotation(binding, path, name);
  if (testType) {
    const testConstantViolations = getConstantViolationsBefore(binding, testType.ifStatement);
    constantViolations = constantViolations.filter(path => testConstantViolations.indexOf(path) < 0);
    types.push(testType.typeAnnotation);
  }
  if (constantViolations.length) {
    constantViolations.push(...functionConstantViolations);
    for (const violation of constantViolations) types.push(violation.getTypeAnnotation());
  }

  if (types.length) return createUnionType(types);
}
function getConstantViolationsBefore(binding, path, functions) {
  const violations = binding.constantViolations.slice();
  violations.unshift(binding.path);
  return violations.filter(violation => {
    const status = (violation = violation.resolve())._guessExecutionStatusRelativeTo(path);
    functions && status === "unknown" && functions.push(violation);
    return status === "before";
  });
}
function inferAnnotationFromBinaryExpression(name, path) {
  const operator = path.node.operator,
    right = path.get("right").resolve(),
    left = path.get("left").resolve();

  let target, typeofPath, typePath;
  if (left.isIdentifier({ name })) target = right;
  else if (right.isIdentifier({ name })) target = left;

  if (target)
    return operator === "==="
      ? target.getTypeAnnotation()
      : BOOLEAN_NUMBER_BINARY_OPERATORS.indexOf(operator) >= 0
      ? numberTypeAnnotation$1()
      : void 0;

  if (operator !== "===" && operator !== "==") return;
  if (left.isUnaryExpression({ operator: "typeof" })) {
    typeofPath = left;
    typePath = right;
  } else if (right.isUnaryExpression({ operator: "typeof" })) {
    typeofPath = right;
    typePath = left;
  }
  if (!typeofPath || !typeofPath.get("argument").isIdentifier({ name })) return;
  typePath = typePath.resolve();
  if (!typePath.isLiteral()) return;
  const typeValue = typePath.node.value;
  return typeof typeValue != "string" ? void 0 : createTypeAnnotationBasedOnTypeof(typeValue);
}
function getParentConditionalPath(binding, path, name) {
  for (let parentPath; (parentPath = path.parentPath); ) {
    if (parentPath.isIfStatement() || parentPath.isConditionalExpression()) {
      if (path.key === "test") return;

      return parentPath;
    }
    if (parentPath.isFunction() && parentPath.parentPath.scope.getBinding(name) !== binding) return;

    path = parentPath;
  }
}
function getConditionalAnnotation(binding, path, name) {
  const ifStatement = getParentConditionalPath(binding, path, name);
  if (!ifStatement) return;
  const paths = [ifStatement.get("test")],
    types = [];
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    if (path.isLogicalExpression()) {
      if (path.node.operator === "&&") {
        paths.push(path.get("left"));
        paths.push(path.get("right"));
      }
    } else if (path.isBinaryExpression()) {
      const type = inferAnnotationFromBinaryExpression(name, path);
      type && types.push(type);
    }
  }
  return types.length
    ? { typeAnnotation: createUnionType(types), ifStatement }
    : getConditionalAnnotation(binding, ifStatement, name);
}

const {
  BOOLEAN_BINARY_OPERATORS,
  BOOLEAN_UNARY_OPERATORS,
  NUMBER_BINARY_OPERATORS,
  NUMBER_UNARY_OPERATORS,
  STRING_UNARY_OPERATORS,
  anyTypeAnnotation: anyTypeAnnotation$1,
  arrayTypeAnnotation,
  booleanTypeAnnotation,
  buildMatchMemberExpression,
  genericTypeAnnotation,
  identifier: identifier$4,
  nullLiteralTypeAnnotation,
  numberTypeAnnotation,
  stringTypeAnnotation: stringTypeAnnotation$1,
  tupleTypeAnnotation,
  unionTypeAnnotation,
  voidTypeAnnotation: voidTypeAnnotation$1,
  isIdentifier: isIdentifier$6
} = _t;
function VariableDeclarator() {
  if (this.get("id").isIdentifier()) return this.get("init").getTypeAnnotation();
}
function TypeCastExpression(node) {
  return node.typeAnnotation;
}
TypeCastExpression.validParent = true;
function TSAsExpression(node) {
  return node.typeAnnotation;
}
TSAsExpression.validParent = true;
function TSNonNullExpression() {
  return this.get("expression").getTypeAnnotation();
}
function NewExpression(node) {
  if (node.callee.type === "Identifier") return genericTypeAnnotation(node.callee);
}
function TemplateLiteral() {
  return stringTypeAnnotation$1();
}
function UnaryExpression(node) {
  const operator = node.operator;
  return operator === "void"
    ? voidTypeAnnotation$1()
    : NUMBER_UNARY_OPERATORS.indexOf(operator) >= 0
    ? numberTypeAnnotation()
    : STRING_UNARY_OPERATORS.indexOf(operator) >= 0
    ? stringTypeAnnotation$1()
    : BOOLEAN_UNARY_OPERATORS.indexOf(operator) >= 0
    ? booleanTypeAnnotation()
    : void 0;
}
function BinaryExpression(node) {
  const operator = node.operator;
  if (NUMBER_BINARY_OPERATORS.indexOf(operator) >= 0) return numberTypeAnnotation();
  if (BOOLEAN_BINARY_OPERATORS.indexOf(operator) >= 0) return booleanTypeAnnotation();
  if (operator === "+") {
    const right = this.get("right"),
      left = this.get("left");

    return left.isBaseType("number") && right.isBaseType("number")
      ? numberTypeAnnotation()
      : left.isBaseType("string") || right.isBaseType("string")
      ? stringTypeAnnotation$1()
      : unionTypeAnnotation([stringTypeAnnotation$1(), numberTypeAnnotation()]);
  }
}
function LogicalExpression() {
  return createUnionType([this.get("left").getTypeAnnotation(), this.get("right").getTypeAnnotation()]);
}
function ConditionalExpression() {
  return createUnionType([this.get("consequent").getTypeAnnotation(), this.get("alternate").getTypeAnnotation()]);
}
function SequenceExpression() {
  return this.get("expressions").pop().getTypeAnnotation();
}
function ParenthesizedExpression() {
  return this.get("expression").getTypeAnnotation();
}
function AssignmentExpression() {
  return this.get("right").getTypeAnnotation();
}
function UpdateExpression(node) {
  const operator = node.operator;
  if (operator === "++" || operator === "--") return numberTypeAnnotation();
}
function StringLiteral() {
  return stringTypeAnnotation$1();
}
function NumericLiteral() {
  return numberTypeAnnotation();
}
function BooleanLiteral() {
  return booleanTypeAnnotation();
}
function NullLiteral() {
  return nullLiteralTypeAnnotation();
}
function RegExpLiteral() {
  return genericTypeAnnotation(identifier$4("RegExp"));
}
function ObjectExpression() {
  return genericTypeAnnotation(identifier$4("Object"));
}
function ArrayExpression() {
  return genericTypeAnnotation(identifier$4("Array"));
}
function RestElement() {
  return ArrayExpression();
}
RestElement.validParent = true;
function Func() {
  return genericTypeAnnotation(identifier$4("Function"));
}
const isArrayFrom = buildMatchMemberExpression("Array.from"),
  isObjectKeys = buildMatchMemberExpression("Object.keys"),
  isObjectValues = buildMatchMemberExpression("Object.values"),
  isObjectEntries = buildMatchMemberExpression("Object.entries");
function CallExpression() {
  const { callee } = this.node;
  return isObjectKeys(callee)
    ? arrayTypeAnnotation(stringTypeAnnotation$1())
    : isArrayFrom(callee) || isObjectValues(callee) || isIdentifier$6(callee, { name: "Array" })
    ? arrayTypeAnnotation(anyTypeAnnotation$1())
    : isObjectEntries(callee)
    ? arrayTypeAnnotation(tupleTypeAnnotation([stringTypeAnnotation$1(), anyTypeAnnotation$1()]))
    : resolveCall(this.get("callee"));
}
function TaggedTemplateExpression() {
  return resolveCall(this.get("tag"));
}
function resolveCall(callee) {
  if ((callee = callee.resolve()).isFunction()) {
    const { node } = callee;
    if (node.async)
      return node.generator
        ? genericTypeAnnotation(identifier$4("AsyncIterator"))
        : genericTypeAnnotation(identifier$4("Promise"));

    if (node.generator) return genericTypeAnnotation(identifier$4("Iterator"));
    if (callee.node.returnType) return callee.node.returnType;
  }
}

var inferers = Object.freeze({
  __proto__: null,
  ArrayExpression,
  ArrowFunctionExpression: Func,
  AssignmentExpression,
  BinaryExpression,
  BooleanLiteral,
  CallExpression,
  ClassDeclaration: Func,
  ClassExpression: Func,
  ConditionalExpression,
  FunctionDeclaration: Func,
  FunctionExpression: Func,
  Identifier: infererReference,
  LogicalExpression,
  NewExpression,
  NullLiteral,
  NumericLiteral,
  ObjectExpression,
  ParenthesizedExpression,
  RegExpLiteral,
  RestElement,
  SequenceExpression,
  StringLiteral,
  TSAsExpression,
  TSNonNullExpression,
  TaggedTemplateExpression,
  TemplateLiteral,
  TypeCastExpression,
  UnaryExpression,
  UpdateExpression,
  VariableDeclarator
});

const {
  anyTypeAnnotation,
  isAnyTypeAnnotation,
  isArrayTypeAnnotation,
  isBooleanTypeAnnotation,
  isEmptyTypeAnnotation,
  isFlowBaseAnnotation,
  isGenericTypeAnnotation,
  isIdentifier: isIdentifier$5,
  isMixedTypeAnnotation,
  isNumberTypeAnnotation,
  isStringTypeAnnotation,
  isTSArrayType,
  isTSTypeAnnotation,
  isTSTypeReference,
  isTupleTypeAnnotation,
  isTypeAnnotation,
  isUnionTypeAnnotation,
  isVoidTypeAnnotation,
  stringTypeAnnotation,
  voidTypeAnnotation
} = _t;
function getTypeAnnotation() {
  let type = this.getData("typeAnnotation");
  if (type != null) return type;

  type = this._getTypeAnnotation() || anyTypeAnnotation();
  if (isTypeAnnotation(type) || isTSTypeAnnotation(type)) type = type.typeAnnotation;

  this.setData("typeAnnotation", type);
  return type;
}
const typeAnnotationInferringNodes = new WeakSet();
function _getTypeAnnotation() {
  const node = this.node;
  if (!node) {
    if (this.key !== "init" || !this.parentPath.isVariableDeclarator()) return;

    const declar = this.parentPath.parentPath,
      declarParent = declar.parentPath;

    return declar.key === "left" && declarParent.isForInStatement()
      ? stringTypeAnnotation()
      : declar.key === "left" && declarParent.isForOfStatement()
      ? anyTypeAnnotation()
      : voidTypeAnnotation();
  }
  if (node.typeAnnotation) return node.typeAnnotation;

  if (typeAnnotationInferringNodes.has(node)) return;

  typeAnnotationInferringNodes.add(node);
  try {
    var _inferer;
    let inferer = inferers[node.type];
    if (inferer) return inferer.call(this, node);

    inferer = inferers[this.parentPath.type];
    if ((_inferer = inferer) != null && _inferer.validParent) return this.parentPath.getTypeAnnotation();
  } finally {
    typeAnnotationInferringNodes.delete(node);
  }
}
function isBaseType(baseName, soft) {
  return _isBaseType(baseName, this.getTypeAnnotation(), soft);
}
function _isBaseType(baseName, type, soft) {
  if (baseName === "string") return isStringTypeAnnotation(type);
  if (baseName === "number") return isNumberTypeAnnotation(type);
  if (baseName === "boolean") return isBooleanTypeAnnotation(type);
  if (baseName === "any") return isAnyTypeAnnotation(type);
  if (baseName === "mixed") return isMixedTypeAnnotation(type);
  if (baseName === "empty") return isEmptyTypeAnnotation(type);
  if (baseName === "void") return isVoidTypeAnnotation(type);

  if (soft) return false;
  throw new Error("Unknown base type " + baseName);
}
function couldBeBaseType(name) {
  const type = this.getTypeAnnotation();
  if (isAnyTypeAnnotation(type)) return true;
  if (isUnionTypeAnnotation(type)) {
    for (const type2 of type.types) if (isAnyTypeAnnotation(type2) || _isBaseType(name, type2, true)) return true;

    return false;
  }
  return _isBaseType(name, type, true);
}
function baseTypeStrictlyMatches(rightArg) {
  const left = this.getTypeAnnotation(),
    right = rightArg.getTypeAnnotation();

  return !(isAnyTypeAnnotation(left) || !isFlowBaseAnnotation(left)) && right.type === left.type;
}
function isGenericType(genericName) {
  const type = this.getTypeAnnotation();
  return (
    !(genericName !== "Array" ||
      !(isTSArrayType(type) || isArrayTypeAnnotation(type) || isTupleTypeAnnotation(type))) ||
    (isGenericTypeAnnotation(type) && isIdentifier$5(type.id, { name: genericName })) ||
    (isTSTypeReference(type) && isIdentifier$5(type.typeName, { name: genericName }))
  );
}

var NodePath_inference = Object.freeze({
  __proto__: null,
  _getTypeAnnotation,
  baseTypeStrictlyMatches,
  couldBeBaseType,
  getTypeAnnotation,
  isBaseType,
  isGenericType
});

const {
  assignmentExpression: assignmentExpression$3,
  expressionStatement: expressionStatement$3,
  identifier: identifier$3
} = _t;
const visitor$1 = {
  Scope(path, state) {
    state.kind !== "let" || path.skip();
  },
  FunctionParent(path) {
    path.skip();
  },
  VariableDeclaration(path, state) {
    if (state.kind && path.node.kind !== state.kind) return;
    const nodes = [],
      declarations = path.get("declarations");
    let firstId;
    for (const declar of declarations) {
      firstId = declar.node.id;
      declar.node.init &&
        nodes.push(expressionStatement$3(assignmentExpression$3("=", declar.node.id, declar.node.init)));

      for (const name of Object.keys(declar.getBindingIdentifiers()))
        state.emit(identifier$3(name), name, declar.node.init !== null);
    }
    path.parentPath.isFor({ left: path.node }) ? path.replaceWith(firstId) : path.replaceWithMultiple(nodes);
  }
};
function hoistVariables(path, emit, kind = "var") {
  path.traverse(visitor$1, { kind, emit });
}

const {
  FUNCTION_TYPES,
  arrowFunctionExpression: arrowFunctionExpression$2,
  assignmentExpression: assignmentExpression$2,
  awaitExpression,
  blockStatement: blockStatement$2,
  callExpression: callExpression$2,
  cloneNode: cloneNode$3,
  expressionStatement: expressionStatement$2,
  identifier: identifier$2,
  inheritLeadingComments,
  inheritTrailingComments,
  inheritsComments,
  isExpression: isExpression$3,
  isProgram,
  isStatement: isStatement$1,
  removeComments,
  returnStatement: returnStatement$1,
  toSequenceExpression,
  validate: validate$1,
  yieldExpression
} = _t;
function replaceWithMultiple(nodes) {
  var _getCachedPaths;
  this.resync();
  nodes = this._verifyNodeList(nodes);
  inheritLeadingComments(nodes[0], this.node);
  inheritTrailingComments(nodes[nodes.length - 1], this.node);
  (_getCachedPaths = getCachedPaths(this.hub, this.parent)) == null || _getCachedPaths.delete(this.node);
  this.node = this.container[this.key] = null;
  const paths = this.insertAfter(nodes);
  this.node ? this.requeue() : this.remove();

  return paths;
}
function replaceWithSourceString(replacement) {
  this.resync();
  let ast;
  try {
    replacement = `(${replacement})`;
    ast = parser.parse(replacement);
  } catch (err) {
    const loc = err.loc;
    if (loc) {
      err.message +=
        " - make sure this is an expression.\n" +
        template.codeFrameColumns(replacement, { start: { line: loc.line, column: loc.column + 1 } });
      err.code = "BABEL_REPLACE_SOURCE_ERROR";
    }
    throw err;
  }
  const expressionAST = ast.program.body[0].expression;
  traverse.removeProperties(expressionAST);
  return this.replaceWith(expressionAST);
}
function replaceWith(replacementPath) {
  this.resync();
  if (this.removed) throw new Error("You can't replace this node, we've already removed it");

  let replacement = replacementPath instanceof NodePath ? replacementPath.node : replacementPath;
  if (!replacement) throw new Error("You passed `path.replaceWith()` a falsy node, use `path.remove()` instead");

  if (this.node === replacement) return [this];

  if (this.isProgram() && !isProgram(replacement))
    throw new Error("You can only replace a Program root node with another Program node");

  if (Array.isArray(replacement))
    throw new Error("Don't use `path.replaceWith()` with an array of nodes, use `path.replaceWithMultiple()`");

  if (typeof replacement == "string")
    throw new Error("Don't use `path.replaceWith()` with a source string, use `path.replaceWithSourceString()`");

  let nodePath = "";
  if (
    this.isNodeType("Statement") && isExpression$3(replacement) &&
    !this.canHaveVariableDeclarationOrExpression() &&
    !this.canSwapBetweenExpressionAndStatement(replacement) &&
    !this.parentPath.isExportDefaultDeclaration()
  ) {
    replacement = expressionStatement$2(replacement);
    nodePath = "expression";
  }

  if (
    this.isNodeType("Expression") && isStatement$1(replacement) &&
    !this.canHaveVariableDeclarationOrExpression() && !this.canSwapBetweenExpressionAndStatement(replacement)
  )
    return this.replaceExpressionWithStatements([replacement]);

  const oldNode = this.node;
  if (oldNode) {
    inheritsComments(replacement, oldNode);
    removeComments(oldNode);
  }
  this._replaceWith(replacement);
  this.type = replacement.type;
  this.setScope();
  this.requeue();
  return [nodePath ? this.get(nodePath) : this];
}
function _replaceWith(node) {
  var _getCachedPaths2;
  if (!this.container) throw new ReferenceError("Container is falsy");

  this.inList ? validate$1(this.parent, this.key, [node]) : validate$1(this.parent, this.key, node);

  this.debug(`Replace with ${node == null ? void 0 : node.type}`);
  (_getCachedPaths2 = getCachedPaths(this.hub, this.parent)) == null ||
    _getCachedPaths2.set(node, this).delete(this.node);
  this.node = this.container[this.key] = node;
}
function replaceExpressionWithStatements(nodes) {
  this.resync();
  const nodesAsSequenceExpression = toSequenceExpression(nodes, this.scope);
  if (nodesAsSequenceExpression) return this.replaceWith(nodesAsSequenceExpression)[0].get("expressions");

  const functionParent = this.getFunctionParent(),
    isParentAsync = functionParent == null ? void 0 : functionParent.is("async"),
    isParentGenerator = functionParent == null ? void 0 : functionParent.is("generator"),
    container = arrowFunctionExpression$2([], blockStatement$2(nodes));
  this.replaceWith(callExpression$2(container, []));
  const callee = this.get("callee");
  hoistVariables(
    callee.get("body"),
    id => {
      this.scope.push({ id });
    },
    "var"
  );
  const completionRecords = this.get("callee").getCompletionRecords();
  for (const path of completionRecords) {
    if (!path.isExpressionStatement()) continue;
    const loop = path.findParent(path => path.isLoop());
    if (loop) {
      let uid = loop.getData("expressionReplacementReturnUid");
      if (!uid) {
        uid = callee.scope.generateDeclaredUidIdentifier("ret");
        callee.get("body").pushContainer("body", returnStatement$1(cloneNode$3(uid)));
        loop.setData("expressionReplacementReturnUid", uid);
      } else uid = identifier$2(uid.name);

      path.get("expression").replaceWith(assignmentExpression$2("=", cloneNode$3(uid), path.node.expression));
    } else path.replaceWith(returnStatement$1(path.node.expression));
  }
  callee.arrowFunctionToExpression();
  const newCallee = callee,
    needToAwaitFunction =
      isParentAsync && traverse.hasType(this.get("callee.body").node, "AwaitExpression", FUNCTION_TYPES),
    needToYieldFunction =
      isParentGenerator && traverse.hasType(this.get("callee.body").node, "YieldExpression", FUNCTION_TYPES);
  if (needToAwaitFunction) {
    newCallee.set("async", true);
    needToYieldFunction || this.replaceWith(awaitExpression(this.node));
  }
  if (needToYieldFunction) {
    newCallee.set("generator", true);
    this.replaceWith(yieldExpression(this.node, true));
  }
  return newCallee.get("body.body");
}
function replaceInline(nodes) {
  this.resync();
  if (Array.isArray(nodes)) {
    if (Array.isArray(this.container)) {
      nodes = this._verifyNodeList(nodes);
      const paths = this._containerInsertAfter(nodes);
      this.remove();
      return paths;
    }
    return this.replaceWithMultiple(nodes);
  }
  return this.replaceWith(nodes);
}

var NodePath_replacement = Object.freeze({
  __proto__: null,
  _replaceWith,
  replaceExpressionWithStatements,
  replaceInline,
  replaceWith,
  replaceWithMultiple,
  replaceWithSourceString
});

const VALID_CALLEES = ["String", "Number", "Math"],
  INVALID_METHODS = ["random"];
function isValidCallee(val) {
  return VALID_CALLEES.includes(val);
}
function isInvalidMethod(val) {
  return INVALID_METHODS.includes(val);
}
function evaluateTruthy() {
  const res = this.evaluate();
  if (res.confident) return !!res.value;
}
function deopt(path, state) {
  if (!state.confident) return;
  state.deoptPath = path;
  state.confident = false;
}
const Globals = new Map([
  ["undefined", void 0],
  ["Infinity", Infinity],
  ["NaN", NaN]
]);
function evaluateCached(path, state) {
  const { node } = path,
    { seen } = state;
  if (!seen.has(node)) {
    const item = { resolved: false };
    seen.set(node, item);
    const val = _evaluate(path, state);
    if (state.confident) {
      item.resolved = true;
      item.value = val;
    }
    return val;
  }

  const existing = seen.get(node);
  if (existing.resolved) return existing.value;

  deopt(path, state);
}
function _evaluate(path, state) {
  if (!state.confident) return;
  if (path.isSequenceExpression()) {
    const exprs = path.get("expressions");
    return evaluateCached(exprs[exprs.length - 1], state);
  }
  if (path.isStringLiteral() || path.isNumericLiteral() || path.isBooleanLiteral()) return path.node.value;

  if (path.isNullLiteral()) return null;

  if (path.isTemplateLiteral()) return evaluateQuasis(path, path.node.quasis, state);

  if (path.isTaggedTemplateExpression() && path.get("tag").isMemberExpression()) {
    const object = path.get("tag.object"),
      { node: { name } } = object,
      property = path.get("tag.property");
    if (
      object.isIdentifier() &&
      name === "String" &&
      !path.scope.getBinding(name) &&
      property.isIdentifier() &&
      property.node.name === "raw"
    )
      return evaluateQuasis(path, path.node.quasi.quasis, state, true);
  }
  if (path.isConditionalExpression()) {
    const testResult = evaluateCached(path.get("test"), state);
    if (!state.confident) return;
    return evaluateCached(testResult ? path.get("consequent") : path.get("alternate"), state);
  }
  if (path.isExpressionWrapper()) return evaluateCached(path.get("expression"), state);

  if (path.isMemberExpression() && !path.parentPath.isCallExpression({ callee: path.node })) {
    const property = path.get("property"),
      object = path.get("object");
    if (object.isLiteral()) {
      const value = object.node.value,
        type = typeof value;
      let key = null;
      if (path.node.computed) {
        key = evaluateCached(property, state);
        if (!state.confident) return;
      } else if (property.isIdentifier()) key = property.node.name;

      if ((type === "number" || type === "string") && key != null && (typeof key == "number" || typeof key == "string"))
        return value[key];
    }
  }
  if (path.isReferencedIdentifier()) {
    const binding = path.scope.getBinding(path.node.name);
    if (binding) {
      if (binding.constantViolations.length > 0 || path.node.start < binding.path.node.end) {
        deopt(binding.path, state);
        return;
      }
      if (binding.hasValue) return binding.value;
    }
    const name = path.node.name;
    if (Globals.has(name)) {
      if (!binding) return Globals.get(name);

      deopt(binding.path, state);
      return;
    }
    const resolved = path.resolve();
    if (resolved === path) {
      deopt(path, state);
      return;
    }
    return evaluateCached(resolved, state);
  }
  if (path.isUnaryExpression({ prefix: true })) {
    if (path.node.operator === "void") return void 0;

    const argument = path.get("argument");
    if (path.node.operator === "typeof" && (argument.isFunction() || argument.isClass())) return "function";

    const arg = evaluateCached(argument, state);
    if (!state.confident) return;
    switch (path.node.operator) {
      case "!":
        return !arg;
      case "+":
        return +arg;
      case "-":
        return -arg;
      case "~":
        return ~arg;
      case "typeof":
        return typeof arg;
    }
  }
  if (path.isArrayExpression()) {
    const arr = [],
      elems = path.get("elements");
    for (const elem of elems) {
      const elemValue = elem.evaluate();
      if (!elemValue.confident) {
        deopt(elemValue.deopt, state);
        return;
      }
      arr.push(elemValue.value);
    }
    return arr;
  }
  if (path.isObjectExpression()) {
    const obj = {},
      props = path.get("properties");
    for (const prop of props) {
      if (prop.isObjectMethod() || prop.isSpreadElement()) {
        deopt(prop, state);
        return;
      }
      const keyPath = prop.get("key");
      let key;
      if (prop.node.computed) {
        key = keyPath.evaluate();
        if (!key.confident) {
          deopt(key.deopt, state);
          return;
        }
        key = key.value;
      } else key = keyPath.isIdentifier() ? keyPath.node.name : keyPath.node.value;

      let value = prop.get("value").evaluate();
      if (!value.confident) {
        deopt(value.deopt, state);
        return;
      }
      value = value.value;
      obj[key] = value;
    }
    return obj;
  }
  if (path.isLogicalExpression()) {
    // noinspection UnnecessaryLocalVariableJS
    const wasConfident = state.confident,
      left = evaluateCached(path.get("left"), state),
      leftConfident = state.confident;
    state.confident = wasConfident;
    const right = evaluateCached(path.get("right"), state),
      rightConfident = state.confident;
    switch (path.node.operator) {
      case "||":
        state.confident = leftConfident && (!!left || rightConfident);
        if (!state.confident) return;
        return left || right;
      case "&&":
        state.confident = leftConfident && (!left || rightConfident);
        if (!state.confident) return;
        return left && right;
      case "??":
        state.confident = leftConfident && (left != null || rightConfident);
        if (!state.confident) return;
        return left != null ? left : right;
    }
  }
  if (path.isBinaryExpression()) {
    const left = evaluateCached(path.get("left"), state);
    if (!state.confident) return;
    const right = evaluateCached(path.get("right"), state);
    if (!state.confident) return;
    switch (path.node.operator) {
      case "-":
        return left - right;
      case "+":
        return left + right;
      case "/":
        return left / right;
      case "*":
        return left * right;
      case "%":
        return left % right;
      case "**":
        return Math.pow(left, right);
      case "<":
        return left < right;
      case ">":
        return left > right;
      case "<=":
        return left <= right;
      case ">=":
        return left >= right;
      case "==":
        return left == right;
      case "!=":
        return left != right;
      case "===":
        return left === right;
      case "!==":
        return left !== right;
      case "|":
        return left | right;
      case "&":
        return left & right;
      case "^":
        return left ^ right;
      case "<<":
        return left << right;
      case ">>":
        return left >> right;
      case ">>>":
        return left >>> right;
    }
  }
  if (path.isCallExpression()) {
    const callee = path.get("callee");
    let context, func;
    if (callee.isIdentifier() && !path.scope.getBinding(callee.node.name) && isValidCallee(callee.node.name))
      func = global[callee.node.name];

    if (callee.isMemberExpression()) {
      const object = callee.get("object"),
        property = callee.get("property");
      if (
        object.isIdentifier() &&
        property.isIdentifier() &&
        isValidCallee(object.node.name) &&
        !isInvalidMethod(property.node.name)
      ) {
        context = global[object.node.name];
        func = context[property.node.name];
      }
      if (object.isLiteral() && property.isIdentifier()) {
        const type = typeof object.node.value;
        if (type === "string" || type === "number") {
          context = object.node.value;
          func = context[property.node.name];
        }
      }
    }
    if (func) {
      const args = path.get("arguments").map(arg => evaluateCached(arg, state));
      if (!state.confident) return;
      return func.apply(context, args);
    }
  }
  deopt(path, state);
}
function evaluateQuasis(path, quasis, state, raw = false) {
  let str = "",
    i = 0;
  const exprs = path.isTemplateLiteral() ? path.get("expressions") : path.get("quasi.expressions");
  for (const elem of quasis) {
    if (!state.confident) break;
    str += raw ? elem.value.raw : elem.value.cooked;
    const expr = exprs[i++];
    if (expr) str += String(evaluateCached(expr, state));
  }
  if (state.confident) return str;
}
function evaluate() {
  const state = { confident: true, deoptPath: null, seen: new Map() };
  let value = evaluateCached(this, state);
  state.confident || (value = void 0);
  return { confident: state.confident, deopt: state.deoptPath, value };
}

var NodePath_evaluation = Object.freeze({
  __proto__: null,
  evaluate,
  evaluateTruthy
});

const {
  NOT_LOCAL_BINDING,
  cloneNode: cloneNode$2,
  identifier: identifier$1,
  isAssignmentExpression: isAssignmentExpression$1,
  isAssignmentPattern,
  isFunction,
  isIdentifier: isIdentifier$4,
  isLiteral: isLiteral$1,
  isNullLiteral,
  isObjectMethod,
  isObjectProperty,
  isRegExpLiteral,
  isRestElement,
  isTemplateLiteral,
  isVariableDeclarator,
  toBindingIdentifierName
} = _t;
function getFunctionArity(node) {
  const count = node.params.findIndex(param => isAssignmentPattern(param) || isRestElement(param));
  return count < 0 ? node.params.length : count;
}
const buildPropertyMethodAssignmentWrapper = template.statement(`
  (function (FUNCTION_KEY) {
    function FUNCTION_ID() {
      return FUNCTION_KEY.apply(this, arguments);
    }

    FUNCTION_ID.toString = function () {
      return FUNCTION_KEY.toString();
    }

    return FUNCTION_ID;
  })(FUNCTION)
`);
const buildGeneratorPropertyMethodAssignmentWrapper = template.statement(`
  (function (FUNCTION_KEY) {
    function* FUNCTION_ID() {
      return yield* FUNCTION_KEY.apply(this, arguments);
    }

    FUNCTION_ID.toString = function () {
      return FUNCTION_KEY.toString();
    };

    return FUNCTION_ID;
  })(FUNCTION)
`);
const visitor = {
  "ReferencedIdentifier|BindingIdentifier"(path, state) {
    if (path.node.name !== state.name || path.scope.getBindingIdentifier(state.name) !== state.outerDeclar) return;

    state.selfReference = true;
    path.stop();
  }
};
function getNameFromLiteralId(id) {
  return isNullLiteral(id)
    ? "null"
    : isRegExpLiteral(id)
    ? `_${id.pattern}_${id.flags}`
    : isTemplateLiteral(id)
    ? id.quasis.map(quasi => quasi.value.raw).join("")
    : id.value !== void 0
    ? id.value + ""
    : "";
}
function wrap(state, method, id, scope) {
  if (state.selfReference) {
    if (!scope.hasBinding(id.name) || scope.hasGlobal(id.name)) {
      if (!isFunction(method)) return;
      let build = buildPropertyMethodAssignmentWrapper;
      if (method.generator) build = buildGeneratorPropertyMethodAssignmentWrapper;

      const template = build({
        FUNCTION: method,
        FUNCTION_ID: id,
        FUNCTION_KEY: scope.generateUidIdentifier(id.name)
      }).expression;
      const params = template.callee.body.body[0].params;
      for (let i = 0, len = getFunctionArity(method); i < len; i++) params.push(scope.generateUidIdentifier("x"));

      return template;
    }
    scope.rename(id.name);
  }
  method.id = id;
  scope.getProgramParent().references[id.name] = true;
}
function visit$1(node, name, scope) {
  const state = { selfAssignment: false, selfReference: false, outerDeclar: scope.getBindingIdentifier(name), name },
    binding = scope.getOwnBinding(name);
  if (binding) {
    if (binding.kind === "param") state.selfReference = true;
  } else if (state.outerDeclar || scope.hasGlobal(name)) scope.traverse(node, visitor, state);

  return state;
}
function nameFunction({ node, parent, scope, id }, localBinding = false, supportUnicodeId = false) {
  if (node.id) return;
  if (
    (isObjectProperty(parent) || isObjectMethod(parent, { kind: "method" })) &&
    (!parent.computed || isLiteral$1(parent.key))
  )
    id = parent.key;
  else if (isVariableDeclarator(parent)) {
    id = parent.id;
    if (isIdentifier$4(id) && !localBinding) {
      const binding = scope.parent.getBinding(id.name);
      if (binding && binding.constant && scope.getBinding(id.name) === binding) {
        node.id = cloneNode$2(id);
        node.id[NOT_LOCAL_BINDING] = true;
        return;
      }
    }
  } else if (isAssignmentExpression$1(parent, { operator: "=" })) id = parent.left;
  else if (!id) return;

  let name;
  if (id && isLiteral$1(id)) name = getNameFromLiteralId(id);
  else if (id && isIdentifier$4(id)) name = id.name;

  if (name === void 0) return;

  if (!supportUnicodeId && isFunction(node) && /[\uD800-\uDFFF]/.test(name)) return;

  name = toBindingIdentifierName(name);
  const newId = identifier$1(name);
  newId[NOT_LOCAL_BINDING] = true;
  return wrap(visit$1(node, name, scope), node, newId, scope) || node;
}

const {
  arrowFunctionExpression: arrowFunctionExpression$1,
  assignmentExpression: assignmentExpression$1,
  binaryExpression,
  blockStatement: blockStatement$1,
  callExpression: callExpression$1,
  conditionalExpression,
  expressionStatement: expressionStatement$1,
  identifier,
  isIdentifier: isIdentifier$3,
  jsxIdentifier,
  logicalExpression,
  LOGICAL_OPERATORS,
  memberExpression,
  metaProperty,
  numericLiteral: numericLiteral$1,
  objectExpression,
  restElement,
  returnStatement,
  sequenceExpression,
  spreadElement,
  stringLiteral,
  super: _super,
  thisExpression: thisExpression$1,
  toExpression,
  unaryExpression: unaryExpression$1
} = _t;
function toComputedKey() {
  let key;
  if (this.isMemberExpression()) key = this.node.property;
  else if (this.isProperty() || this.isMethod()) key = this.node.key;
  else throw new ReferenceError("todo");

  if (!this.node.computed && isIdentifier$3(key)) key = stringLiteral(key.name);

  return key;
}
function ensureBlock() {
  const body = this.get("body"),
    bodyNode = body.node;
  if (Array.isArray(body)) throw new Error("Can't convert array path to a block statement");

  if (!bodyNode) throw new Error("Can't convert node without a body");

  if (body.isBlockStatement()) return bodyNode;

  const statements = [];
  let key,
    listKey,
    stringPath = "body";
  if (body.isStatement()) {
    listKey = "body";
    key = 0;
    statements.push(body.node);
  } else {
    stringPath += ".body.0";
    if (this.isFunction()) {
      key = "argument";
      statements.push(returnStatement(body.node));
    } else {
      key = "expression";
      statements.push(expressionStatement$1(body.node));
    }
  }
  this.node.body = blockStatement$1(statements);
  const parentPath = this.get(stringPath);
  body.setup(parentPath, listKey ? parentPath.node[listKey] : parentPath.node, listKey, key);
  return this.node;
}
function unwrapFunctionEnvironment() {
  if (!this.isArrowFunctionExpression() && !this.isFunctionExpression() && !this.isFunctionDeclaration())
    throw this.buildCodeFrameError("Can only unwrap the environment of a function.");

  hoistFunctionEnvironment(this);
}
function setType(path, type) {
  path.node.type = type;
}
function arrowFunctionToExpression({
  allowInsertArrow = true,
  allowInsertArrowWithRest = allowInsertArrow,
  noNewArrows = !(_arguments$ => ((_arguments$ = arguments[0]) == null ? void 0 : _arguments$.specCompliant))()
} = {}) {
  if (!this.isArrowFunctionExpression())
    throw this.buildCodeFrameError("Cannot convert non-arrow function to a function expression.");

  const { thisBinding, fnPath: fn } = hoistFunctionEnvironment(
    this,
    noNewArrows,
    allowInsertArrow,
    allowInsertArrowWithRest
  );
  fn.ensureBlock();
  setType(fn, "FunctionExpression");
  if (!noNewArrows) {
    const checkBinding = thisBinding ? null : fn.scope.generateUidIdentifier("arrowCheckId");
    checkBinding && fn.parentPath.scope.push({ id: checkBinding, init: objectExpression([]) });

    fn.get("body").unshiftContainer("body",
      expressionStatement$1(
        callExpression$1(this.hub.addHelper("newArrowCheck"), [
          thisExpression$1(),
          identifier(checkBinding ? checkBinding.name : thisBinding)
        ])
      )
    );
    fn.replaceWith(
      callExpression$1(memberExpression(nameFunction(this, true) || fn.node, identifier("bind")), [
        checkBinding ? identifier(checkBinding.name) : thisExpression$1()
      ])
    );
    return fn.get("callee.object");
  }
  return fn;
}
const getSuperCallsVisitor = merge([{
  CallExpression(child, { allSuperCalls }) {
    child.get("callee").isSuper() && allSuperCalls.push(child);
  }
}, visitor$2]);
function hoistFunctionEnvironment(
  fnPath,
  noNewArrows = true,
  allowInsertArrow = true,
  allowInsertArrowWithRest = true
) {
  let arrowParent;
  let thisEnvFn = fnPath.findParent(p => {
    if (p.isArrowFunctionExpression()) {
      arrowParent != null || (arrowParent = p);
      return false;
    }
    return (
      p.isFunction() ||
      p.isProgram() ||
      p.isClassProperty({ static: false }) ||
      p.isClassPrivateProperty({ static: false })
    );
  });
  const inConstructor = thisEnvFn.isClassMethod({ kind: "constructor" });
  if (thisEnvFn.isClassProperty() || thisEnvFn.isClassPrivateProperty())
    if (arrowParent) thisEnvFn = arrowParent;
    else {
      if (!allowInsertArrow) throw fnPath.buildCodeFrameError("Unable to transform arrow inside class property");

      fnPath.replaceWith(callExpression$1(arrowFunctionExpression$1([], toExpression(fnPath.node)), []));
      thisEnvFn = fnPath.get("callee");
      fnPath = thisEnvFn.get("body");
    }

  const { thisPaths, argumentsPaths, newTargetPaths, superProps, superCalls } = getScopeInformation(fnPath);
  if (inConstructor && superCalls.length > 0) {
    if (!allowInsertArrow)
      throw superCalls[0].buildCodeFrameError(
        "When using '@babel/plugin-transform-arrow-functions', it's not possible to compile `super()` in an arrow function without compiling classes.\n\
Please add '@babel/plugin-transform-classes' to your Babel configuration."
      );

    if (!allowInsertArrowWithRest)
      throw superCalls[0].buildCodeFrameError(
        "When using '@babel/plugin-transform-parameters', it's not possible to compile `super()` in an arrow function with default or rest parameters without compiling classes.\n\
Please add '@babel/plugin-transform-classes' to your Babel configuration."
      );

    const allSuperCalls = [];
    thisEnvFn.traverse(getSuperCallsVisitor, { allSuperCalls });
    const superBinding = getSuperBinding(thisEnvFn);
    allSuperCalls.forEach(superCall => {
      const callee = identifier(superBinding);
      callee.loc = superCall.node.callee.loc;
      superCall.get("callee").replaceWith(callee);
    });
  }
  if (argumentsPaths.length > 0) {
    const argumentsBinding = getBinding(thisEnvFn, "arguments", () => {
      const args = () => identifier("arguments");
      return thisEnvFn.scope.path.isProgram()
        ? conditionalExpression(
            binaryExpression("===", unaryExpression$1("typeof", args()), stringLiteral("undefined")),
            thisEnvFn.scope.buildUndefinedNode(),
            args()
          )
        : args();
    });
    argumentsPaths.forEach(argumentsChild => {
      const argsRef = identifier(argumentsBinding);
      argsRef.loc = argumentsChild.node.loc;
      argumentsChild.replaceWith(argsRef);
    });
  }
  if (newTargetPaths.length > 0) {
    const newTargetBinding = getBinding(thisEnvFn, "newtarget", () =>
      metaProperty(identifier("new"), identifier("target"))
    );
    newTargetPaths.forEach(targetChild => {
      const targetRef = identifier(newTargetBinding);
      targetRef.loc = targetChild.node.loc;
      targetChild.replaceWith(targetRef);
    });
  }
  if (superProps.length > 0) {
    if (!allowInsertArrow)
      throw superProps[0].buildCodeFrameError(
        "When using '@babel/plugin-transform-arrow-functions', it's not possible to compile `super.prop` in an arrow function without compiling classes.\n\
Please add '@babel/plugin-transform-classes' to your Babel configuration."
      );

    superProps.reduce((acc, superProp) => acc.concat(standardizeSuperProperty(superProp)), []).forEach(superProp => {
      const key = superProp.node.computed ? "" : superProp.get("property").node.name,
        superParentPath = superProp.parentPath,
        isAssignment = superParentPath.isAssignmentExpression({ left: superProp.node }),
        isCall = superParentPath.isCallExpression({ callee: superProp.node }),
        isTaggedTemplate = superParentPath.isTaggedTemplateExpression({ tag: superProp.node }),
        superBinding = getSuperPropBinding(thisEnvFn, isAssignment, key),
        args = [];
      superProp.node.computed && args.push(superProp.get("property").node);

      if (isAssignment) {
        const value = superParentPath.node.right;
        args.push(value);
      }
      const call = callExpression$1(identifier(superBinding), args);
      if (isCall) {
        superParentPath.unshiftContainer("arguments", thisExpression$1());
        superProp.replaceWith(memberExpression(call, identifier("call")));
        thisPaths.push(superParentPath.get("arguments.0"));
      } else if (isAssignment) superParentPath.replaceWith(call);
      else if (isTaggedTemplate) {
        superProp.replaceWith(
          callExpression$1(memberExpression(call, identifier("bind"), false), [thisExpression$1()])
        );
        thisPaths.push(superProp.get("arguments.0"));
      } else superProp.replaceWith(call);
    });
  }
  let thisBinding;
  if (thisPaths.length > 0 || !noNewArrows) {
    thisBinding = getThisBinding(thisEnvFn, inConstructor);
    if (noNewArrows || (inConstructor && hasSuperClass(thisEnvFn))) {
      thisPaths.forEach(thisChild => {
        const thisRef = thisChild.isJSX() ? jsxIdentifier(thisBinding) : identifier(thisBinding);
        thisRef.loc = thisChild.node.loc;
        thisChild.replaceWith(thisRef);
      });
      noNewArrows || (thisBinding = null);
    }
  }
  return { thisBinding, fnPath };
}
function isLogicalOp(op) {
  return LOGICAL_OPERATORS.includes(op);
}
function standardizeSuperProperty(superProp) {
  if (superProp.parentPath.isAssignmentExpression() && superProp.parentPath.node.operator !== "=") {
    const assignmentPath = superProp.parentPath,
      op = assignmentPath.node.operator.slice(0, -1),
      value = assignmentPath.node.right,
      isLogicalAssignment = isLogicalOp(op);
    if (superProp.node.computed) {
      const tmp = superProp.scope.generateDeclaredUidIdentifier("tmp"),
        object = superProp.node.object,
        property = superProp.node.property;
      assignmentPath.get("left").replaceWith(memberExpression(object, assignmentExpression$1("=", tmp, property), true));
      assignmentPath.get("right").replaceWith(
        rightExpression(isLogicalAssignment ? "=" : op, memberExpression(object, identifier(tmp.name), true), value)
      );
    } else {
      const object = superProp.node.object,
        property = superProp.node.property;
      assignmentPath.get("left").replaceWith(memberExpression(object, property));
      assignmentPath.get("right").replaceWith(
        rightExpression(isLogicalAssignment ? "=" : op, memberExpression(object, identifier(property.name)), value)
      );
    }
    isLogicalAssignment
      ? assignmentPath.replaceWith(logicalExpression(op, assignmentPath.node.left, assignmentPath.node.right))
      : (assignmentPath.node.operator = "=");

    return [assignmentPath.get("left"), assignmentPath.get("right").get("left")];
  }
  if (superProp.parentPath.isUpdateExpression()) {
    const updateExpr = superProp.parentPath,
      tmp = superProp.scope.generateDeclaredUidIdentifier("tmp"),
      computedKey = superProp.node.computed ? superProp.scope.generateDeclaredUidIdentifier("prop") : null;
    const parts = [
      assignmentExpression$1("=", tmp,
        memberExpression(
          superProp.node.object,
          computedKey ? assignmentExpression$1("=", computedKey, superProp.node.property) : superProp.node.property,
          superProp.node.computed
        )
      ),
      assignmentExpression$1("=",
        memberExpression(
          superProp.node.object,
          computedKey ? identifier(computedKey.name) : superProp.node.property,
          superProp.node.computed
        ),
        binaryExpression(superProp.parentPath.node.operator[0], identifier(tmp.name), numericLiteral$1(1))
      )
    ];

    superProp.parentPath.node.prefix || parts.push(identifier(tmp.name));

    updateExpr.replaceWith(sequenceExpression(parts));
    return [updateExpr.get("expressions.0.right"), updateExpr.get("expressions.1.left")];
  }
  return [superProp];
  function rightExpression(op, left, right) {
    return op === "=" ? assignmentExpression$1("=", left, right) : binaryExpression(op, left, right);
  }
}
function hasSuperClass(thisEnvFn) {
  return thisEnvFn.isClassMethod() && !!thisEnvFn.parentPath.parentPath.node.superClass;
}
const assignSuperThisVisitor = merge([{
  CallExpression(child, { supers, thisBinding }) {
    if (!child.get("callee").isSuper() || supers.has(child.node)) return;
    supers.add(child.node);
    child.replaceWithMultiple([child.node, assignmentExpression$1("=", identifier(thisBinding), identifier("this"))]);
  }
}, visitor$2]);
function getThisBinding(thisEnvFn, inConstructor) {
  return getBinding(thisEnvFn, "this", thisBinding => {
    if (!inConstructor || !hasSuperClass(thisEnvFn)) return thisExpression$1();
    thisEnvFn.traverse(assignSuperThisVisitor, { supers: new WeakSet(), thisBinding });
  });
}
function getSuperBinding(thisEnvFn) {
  return getBinding(thisEnvFn, "supercall", () => {
    const argsBinding = thisEnvFn.scope.generateUidIdentifier("args");
    return arrowFunctionExpression$1(
      [restElement(argsBinding)],
      callExpression$1(_super(), [spreadElement(identifier(argsBinding.name))])
    );
  });
}
function getSuperPropBinding(thisEnvFn, isAssignment, propName) {
  return getBinding(thisEnvFn, `superprop_${isAssignment ? "set" : "get"}:${propName || ""}`, () => {
    const argsList = [];
    let fnBody;
    if (propName) fnBody = memberExpression(_super(), identifier(propName));
    else {
      const method = thisEnvFn.scope.generateUidIdentifier("prop");
      argsList.unshift(method);
      fnBody = memberExpression(_super(), identifier(method.name), true);
    }
    if (isAssignment) {
      const valueIdent = thisEnvFn.scope.generateUidIdentifier("value");
      argsList.push(valueIdent);
      fnBody = assignmentExpression$1("=", fnBody, identifier(valueIdent.name));
    }
    return arrowFunctionExpression$1(argsList, fnBody);
  });
}
function getBinding(thisEnvFn, key, init) {
  const cacheKey = "binding:" + key;
  let data = thisEnvFn.getData(cacheKey);
  if (!data) {
    const id = thisEnvFn.scope.generateUidIdentifier(key);
    data = id.name;
    thisEnvFn.setData(cacheKey, data);
    thisEnvFn.scope.push({ id, init: init(data) });
  }
  return data;
}
const getScopeInformationVisitor = merge([{
  ThisExpression(child, { thisPaths }) {
    thisPaths.push(child);
  },
  JSXIdentifier(child, { thisPaths }) {
    child.node.name === "this" &&
      (child.parentPath.isJSXMemberExpression({ object: child.node }) ||
        child.parentPath.isJSXOpeningElement({ name: child.node })) &&
      thisPaths.push(child);
  },
  CallExpression(child, { superCalls }) {
    child.get("callee").isSuper() && superCalls.push(child);
  },
  MemberExpression(child, { superProps }) {
    child.get("object").isSuper() && superProps.push(child);
  },
  Identifier(child, { argumentsPaths }) {
    if (!child.isReferencedIdentifier({ name: "arguments" })) return;
    let curr = child.scope;
    do {
      if (curr.hasOwnBinding("arguments")) {
        curr.rename("arguments");
        return;
      }
      if (curr.path.isFunction() && !curr.path.isArrowFunctionExpression()) break;
    } while ((curr = curr.parent));
    argumentsPaths.push(child);
  },
  MetaProperty(child, { newTargetPaths }) {
    child.get("meta").isIdentifier({ name: "new" }) &&
      child.get("property").isIdentifier({ name: "target" }) &&
      newTargetPaths.push(child);
  }
}, visitor$2]);
function getScopeInformation(fnPath) {
  const thisPaths = [],
    argumentsPaths = [],
    newTargetPaths = [],
    superProps = [],
    superCalls = [];
  fnPath.traverse(getScopeInformationVisitor, { thisPaths, argumentsPaths, newTargetPaths, superProps, superCalls });
  return { thisPaths, argumentsPaths, newTargetPaths, superProps, superCalls };
}

var NodePath_conversion = Object.freeze({
  __proto__: null,
  arrowFunctionToExpression,
  ensureBlock,
  toComputedKey,
  unwrapFunctionEnvironment
});

const {
  STATEMENT_OR_BLOCK_KEYS,
  VISITOR_KEYS: VISITOR_KEYS$3,
  isBlockStatement,
  isExpression: isExpression$2,
  isIdentifier: isIdentifier$2,
  isLiteral,
  isStringLiteral,
  isType,
  matchesPattern: _matchesPattern
} = _t;
function matchesPattern(pattern, allowPartial) {
  return _matchesPattern(this.node, pattern, allowPartial);
}
function has(key) {
  const val = this.node && this.node[key];
  return val && Array.isArray(val) ? !!val.length : !!val;
}
function isStatic() {
  return this.scope.isStatic(this.node);
}
const is = has;
function isnt(key) {
  return !this.has(key);
}
function equals(key, value) {
  return this.node[key] === value;
}
function isNodeType(type) {
  return isType(this.type, type);
}
function canHaveVariableDeclarationOrExpression() {
  return (this.key === "init" || this.key === "left") && this.parentPath.isFor();
}
function canSwapBetweenExpressionAndStatement(replacement) {
  return (
    !(this.key !== "body" || !this.parentPath.isArrowFunctionExpression()) &&
    (this.isExpression() ? isBlockStatement(replacement) : !!this.isBlockStatement() && isExpression$2(replacement))
  );
}
function isCompletionRecord(allowInsideFunction) {
  let path = this,
    first = true;
  do {
    const { type, container } = path;
    if (!first && (path.isFunction() || type === "StaticBlock")) return !!allowInsideFunction;

    first = false;
    if (Array.isArray(container) && path.key !== container.length - 1) return false;
  } while ((path = path.parentPath) && !path.isProgram() && !path.isDoExpression());
  return true;
}
function isStatementOrBlock() {
  return (
    !this.parentPath.isLabeledStatement() && !isBlockStatement(this.container) &&
    STATEMENT_OR_BLOCK_KEYS.includes(this.key)
  );
}
function referencesImport(moduleSource, importName) {
  if (!this.isReferencedIdentifier()) {
    if (
      (this.isJSXMemberExpression() && this.node.property.name === importName) ||
      ((this.isMemberExpression() || this.isOptionalMemberExpression()) &&
        (this.node.computed
          ? isStringLiteral(this.node.property, { value: importName })
          : this.node.property.name === importName))
    ) {
      const object = this.get("object");
      return object.isReferencedIdentifier() && object.referencesImport(moduleSource, "*");
    }
    return false;
  }
  const binding = this.scope.getBinding(this.node.name);
  if (!binding || binding.kind !== "module") return false;
  const path = binding.path,
    parent = path.parentPath;
  return !(
    !parent.isImportDeclaration() ||
    parent.node.source.value !== moduleSource ||
    (importName &&
      (!path.isImportDefaultSpecifier() || importName !== "default") &&
      (!path.isImportNamespaceSpecifier() || importName !== "*") &&
      (!path.isImportSpecifier() || !isIdentifier$2(path.node.imported, { name: importName })))
  );
}
function getSource() {
  const node = this.node;
  if (node.end) {
    const code = this.hub.getCode();
    if (code) return code.slice(node.start, node.end);
  }
  return "";
}
function willIMaybeExecuteBefore(target) {
  return this._guessExecutionStatusRelativeTo(target) !== "after";
}
function getOuterFunction(path) {
  return path.isProgram()
    ? path
    : (path.parentPath.scope.getFunctionParent() || path.parentPath.scope.getProgramParent()).path;
}
function isExecutionUncertain(type, key) {
  switch (type) {
    case "LogicalExpression":
      return key === "right";
    case "ConditionalExpression":
    case "IfStatement":
      return key === "consequent" || key === "alternate";
    case "WhileStatement":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForOfStatement":
      return key === "body";
    case "ForStatement":
      return key === "body" || key === "update";
    case "SwitchStatement":
      return key === "cases";
    case "TryStatement":
      return key === "handler";
    case "AssignmentPattern":
      return key === "right";
    case "OptionalMemberExpression":
      return key === "property";
    case "OptionalCallExpression":
      return key === "arguments";
    default:
      return false;
  }
}
function isExecutionUncertainInList(paths, maxIndex) {
  for (let i = 0; i < maxIndex; i++) {
    const path = paths[i];
    if (isExecutionUncertain(path.parent.type, path.parentKey)) return true;
  }
  return false;
}
const SYMBOL_CHECKING = Symbol();
function _guessExecutionStatusRelativeTo(target) {
  return _guessExecutionStatusRelativeToCached(this, target, new Map());
}
function _guessExecutionStatusRelativeToCached(base, target, cache) {
  const funcParent = { this: getOuterFunction(base), target: getOuterFunction(target) };
  if (funcParent.target.node !== funcParent.this.node)
    return _guessExecutionStatusRelativeToDifferentFunctionsCached(base, funcParent.target, cache);

  const paths = { target: target.getAncestry(), this: base.getAncestry() };
  if (paths.target.indexOf(base) >= 0) return "after";
  if (paths.this.indexOf(target) >= 0) return "before";
  let commonPath;
  const commonIndex = { target: 0, this: 0 };
  while (!commonPath && commonIndex.this < paths.this.length) {
    const path = paths.this[commonIndex.this];
    commonIndex.target = paths.target.indexOf(path);
    commonIndex.target >= 0 ? (commonPath = path) : commonIndex.this++;
  }
  if (!commonPath)
    throw new Error("Internal Babel error - The two compared nodes don't appear to belong to the same program.");

  if (
    isExecutionUncertainInList(paths.this, commonIndex.this - 1) ||
    isExecutionUncertainInList(paths.target, commonIndex.target - 1)
  )
    return "unknown";

  const divergence = { this: paths.this[commonIndex.this - 1], target: paths.target[commonIndex.target - 1] };
  if (divergence.target.listKey && divergence.this.listKey && divergence.target.container === divergence.this.container)
    return divergence.target.key > divergence.this.key ? "before" : "after";

  const keys = VISITOR_KEYS$3[commonPath.type];
  const keyPosition = {
    this: keys.indexOf(divergence.this.parentKey),
    target: keys.indexOf(divergence.target.parentKey)
  };
  return keyPosition.target > keyPosition.this ? "before" : "after";
}
function _guessExecutionStatusRelativeToDifferentFunctionsInternal(base, target, cache) {
  if (!target.isFunctionDeclaration())
    return _guessExecutionStatusRelativeToCached(base, target, cache) === "before" ? "before" : "unknown";

  if (target.parentPath.isExportDeclaration()) return "unknown";

  const binding = target.scope.getBinding(target.node.id.name);
  if (!binding.references) return "before";
  const referencePaths = binding.referencePaths;
  let allStatus;
  for (const path of referencePaths) {
    if (path.find(path => path.node === target.node)) continue;
    if (path.key !== "callee" || !path.parentPath.isCallExpression()) return "unknown";

    const status = _guessExecutionStatusRelativeToCached(base, path, cache);
    if (allStatus && allStatus !== status) return "unknown";

    allStatus = status;
  }
  return allStatus;
}
function _guessExecutionStatusRelativeToDifferentFunctionsCached(base, target, cache) {
  let cached,
    nodeMap = cache.get(base.node);
  if (!nodeMap) cache.set(base.node, (nodeMap = new Map()));
  else if ((cached = nodeMap.get(target.node))) return cached === SYMBOL_CHECKING ? "unknown" : cached;

  nodeMap.set(target.node, SYMBOL_CHECKING);
  const result = _guessExecutionStatusRelativeToDifferentFunctionsInternal(base, target, cache);
  nodeMap.set(target.node, result);
  return result;
}
function resolve(dangerous, resolved) {
  return this._resolve(dangerous, resolved) || this;
}
function _resolve(dangerous, resolved) {
  if (resolved && resolved.indexOf(this) >= 0) return;
  (resolved = resolved || []).push(this);
  if (this.isVariableDeclarator()) {
    if (this.get("id").isIdentifier()) return this.get("init").resolve(dangerous, resolved);
  } else if (this.isReferencedIdentifier()) {
    const binding = this.scope.getBinding(this.node.name);
    if (!binding || !binding.constant || binding.kind === "module") return;
    if (binding.path !== this) {
      const ret = binding.path.resolve(dangerous, resolved);
      if (this.find(parent => parent.node === ret.node)) return;
      return ret;
    }
  } else if (this.isTypeCastExpression()) return this.get("expression").resolve(dangerous, resolved);
  else if (dangerous && this.isMemberExpression()) {
    const targetKey = this.toComputedKey();
    if (!isLiteral(targetKey)) return;
    const targetName = targetKey.value,
      target = this.get("object").resolve(dangerous, resolved);
    if (target.isObjectExpression()) {
      const props = target.get("properties");
      for (const prop of props) {
        if (!prop.isProperty()) continue;
        const key = prop.get("key");
        let match = prop.isnt("computed") && key.isIdentifier({ name: targetName });
        match = match || key.isLiteral({ value: targetName });
        if (match) return prop.get("value").resolve(dangerous, resolved);
      }
    } else if (target.isArrayExpression() && !isNaN(+targetName)) {
      const elem = target.get("elements")[targetName];
      if (elem) return elem.resolve(dangerous, resolved);
    }
  }
}
function isConstantExpression() {
  if (this.isIdentifier()) {
    const binding = this.scope.getBinding(this.node.name);
    return !!binding && binding.constant;
  }
  if (this.isLiteral())
    return (
      !this.isRegExpLiteral() &&
      (!this.isTemplateLiteral() || this.get("expressions").every(expression => expression.isConstantExpression()))
    );

  if (this.isUnaryExpression()) return this.node.operator === "void" && this.get("argument").isConstantExpression();

  if (this.isBinaryExpression()) {
    const { operator } = this.node;
    return (
      operator !== "in" &&
      operator !== "instanceof" &&
      this.get("left").isConstantExpression() &&
      this.get("right").isConstantExpression()
    );
  }
  return false;
}
function isInStrictMode() {
  return !!(this.isProgram() ? this : this.parentPath).find(path => {
    if (path.isProgram({ sourceType: "module" }) || path.isClass()) return true;
    if (path.isArrowFunctionExpression() && !path.get("body").isBlockStatement()) return false;

    let body;
    if (path.isFunction()) body = path.node.body;
    else if (path.isProgram()) body = path.node;
    else return false;

    for (const directive of body.directives) if (directive.value.value === "use strict") return true;
  });
}

var NodePath_introspection = Object.freeze({
  __proto__: null,
  _guessExecutionStatusRelativeTo,
  _resolve,
  canHaveVariableDeclarationOrExpression,
  canSwapBetweenExpressionAndStatement,
  equals,
  getSource,
  has,
  is,
  isCompletionRecord,
  isConstantExpression,
  isInStrictMode,
  isNodeType,
  isStatementOrBlock,
  isStatic,
  isnt,
  matchesPattern,
  referencesImport,
  resolve,
  willIMaybeExecuteBefore
});

function call(key) {
  const opts = this.opts;
  this.debug(key);
  if (this.node && this._call(opts[key])) return true;

  if (this.node) {
    var _opts$this$node$type;
    return this._call((_opts$this$node$type = opts[this.node.type]) == null ? void 0 : _opts$this$node$type[key]);
  }
  return false;
}
function _call(fns) {
  if (!fns) return false;
  for (const fn of fns) {
    if (!fn) continue;
    const node = this.node;
    if (!node) return true;
    const ret = fn.call(this.state, this, this.state);
    if (ret && typeof ret == "object" && typeof ret.then == "function")
      throw new Error(
        "You appear to be using a plugin with an async traversal visitor, which your current version of Babel does not support. If you're using a published plugin, you may need to upgrade your @babel/core version."
      );

    if (ret) throw new Error("Unexpected return value from visitor method " + fn);

    if (this.node !== node || this._traverseFlags > 0) return true;
  }
  return false;
}
function isDenylisted() {
  var _this$opts$denylist;
  const denylist = (_this$opts$denylist = this.opts.denylist) != null ? _this$opts$denylist : this.opts.blacklist;
  return denylist && denylist.indexOf(this.node.type) > -1;
}
function restoreContext(path, context) {
  if (path.context !== context) {
    path.context = context;
    path.state = context.state;
    path.opts = context.opts;
  }
}
function visit() {
  var _this$opts$shouldSkip, _this$opts;
  if (!this.node || this.isDenylisted()) return false;

  if (
    (_this$opts$shouldSkip = (_this$opts = this.opts).shouldSkip) != null &&
    _this$opts$shouldSkip.call(_this$opts, this)
  )
    return false;

  const currentContext = this.context;
  if (this.shouldSkip || this.call("enter")) {
    this.debug("Skip...");
    return this.shouldStop;
  }
  restoreContext(this, currentContext);
  this.debug("Recursing into...");
  this.shouldStop = traverseNode(this.node, this.opts, this.scope, this.state, this, this.skipKeys);
  restoreContext(this, currentContext);
  this.call("exit");
  return this.shouldStop;
}
function skip() {
  this.shouldSkip = true;
}
function skipKey(key) {
  if (this.skipKeys == null) this.skipKeys = {};

  this.skipKeys[key] = true;
}
function stop() {
  this._traverseFlags |= SHOULD_SKIP | SHOULD_STOP;
}
function setScope() {
  var _this$opts2, _this$scope;
  if ((_this$opts2 = this.opts) != null && _this$opts2.noScope) return;
  let path = this.parentPath;
  if (
    ((this.key === "key" || this.listKey === "decorators") && path.isMethod()) ||
    (this.key === "discriminant" && path.isSwitchStatement())
  )
    path = path.parentPath;

  let target;
  while (path && !target) {
    var _path$opts;
    if ((_path$opts = path.opts) != null && _path$opts.noScope) return;
    target = path.scope;
    path = path.parentPath;
  }
  this.scope = this.getScope(target);
  (_this$scope = this.scope) == null || _this$scope.init();
}
function setContext(context) {
  if (this.skipKeys != null) this.skipKeys = {};

  this._traverseFlags = 0;
  if (context) {
    this.context = context;
    this.state = context.state;
    this.opts = context.opts;
  }
  this.setScope();
  return this;
}
function resync() {
  if (this.removed) return;
  this._resyncParent();
  this._resyncList();
  this._resyncKey();
}
function _resyncParent() {
  if (this.parentPath) this.parent = this.parentPath.node;
}
function _resyncKey() {
  if (!this.container || this.node === this.container[this.key]) return;

  if (Array.isArray(this.container)) {
    for (let i = 0; i < this.container.length; i++)
      if (this.container[i] === this.node) {
        this.setKey(i);
        return;
      }
  } else
    for (const key of Object.keys(this.container))
      if (this.container[key] === this.node) {
        this.setKey(key);
        return;
      }

  this.key = null;
}
function _resyncList() {
  if (!this.parent || !this.inList) return;
  const newContainer = this.parent[this.listKey];
  if (this.container !== newContainer) this.container = newContainer || null;
}
function _resyncRemoved() {
  (this.key != null && this.container && this.container[this.key] === this.node) || this._markRemoved();
}
function popContext() {
  this.contexts.pop();
  this.contexts.length > 0 ? this.setContext(this.contexts[this.contexts.length - 1]) : this.setContext(void 0);
}
function pushContext(context) {
  this.contexts.push(context);
  this.setContext(context);
}
function setup(parentPath, container, listKey, key) {
  this.listKey = listKey;
  this.container = container;
  this.parentPath = parentPath || this.parentPath;
  this.setKey(key);
}
function setKey(key) {
  var _this$node;
  this.key = key;
  this.node = this.container[this.key];
  this.type = (_this$node = this.node) == null ? void 0 : _this$node.type;
}
function requeue(pathToQueue = this) {
  if (pathToQueue.removed) return;
  const contexts = this.contexts;
  for (const context of contexts) context.maybeQueue(pathToQueue);
}
function _getQueueContexts() {
  let path = this,
    contexts = this.contexts;
  while (!contexts.length) {
    path = path.parentPath;
    if (!path) break;
    contexts = path.contexts;
  }
  return contexts;
}

var NodePath_context = Object.freeze({
  __proto__: null,
  _call,
  _getQueueContexts,
  _resyncKey,
  _resyncList,
  _resyncParent,
  _resyncRemoved,
  call,
  isBlacklisted: isDenylisted,
  isDenylisted,
  popContext,
  pushContext,
  requeue,
  resync,
  setContext,
  setKey,
  setScope,
  setup,
  skip,
  skipKey,
  stop,
  visit
});

const hooks = [function (self, parent) {
  if (
    (self.key === "test" && (parent.isWhile() || parent.isSwitchCase())) ||
    (self.key === "declaration" && parent.isExportDeclaration()) ||
    (self.key === "body" && parent.isLabeledStatement()) ||
    (self.listKey === "declarations" && parent.isVariableDeclaration() && parent.node.declarations.length === 1) ||
    (self.key === "expression" && parent.isExpressionStatement())
  ) {
    parent.remove();
    return true;
  }
}, function (self, parent) {
  if (parent.isSequenceExpression() && parent.node.expressions.length === 1) {
    parent.replaceWith(parent.node.expressions[0]);
    return true;
  }
}, function (self, parent) {
  if (parent.isBinary()) {
    self.key === "left" ? parent.replaceWith(parent.node.right) : parent.replaceWith(parent.node.left);

    return true;
  }
}, function (self, parent) {
  if (
    (parent.isIfStatement() && self.key === "consequent") ||
    (self.key === "body" && (parent.isLoop() || parent.isArrowFunctionExpression()))
  ) {
    self.replaceWith({ type: "BlockStatement", body: [] });
    return true;
  }
}];

function remove() {
  var _this$opts;
  this._assertUnremoved();
  this.resync();
  ((_this$opts = this.opts) != null && _this$opts.noScope) || this._removeFromScope();

  if (this._callRemovalHooks()) {
    this._markRemoved();
    return;
  }
  this.shareCommentsWithSiblings();
  this._remove();
  this._markRemoved();
}
function _removeFromScope() {
  const bindings = this.getBindingIdentifiers();
  Object.keys(bindings).forEach(name => this.scope.removeBinding(name));
}
function _callRemovalHooks() {
  for (const fn of hooks) if (fn(this, this.parentPath)) return true;
}
function _remove() {
  if (Array.isArray(this.container)) {
    this.container.splice(this.key, 1);
    this.updateSiblingKeys(this.key, -1);
  } else this._replaceWith(null);
}
function _markRemoved() {
  this._traverseFlags |= SHOULD_SKIP | REMOVED;
  this.parent && getCachedPaths(this.hub, this.parent).delete(this.node);

  this.node = null;
}
function _assertUnremoved() {
  if (this.removed) throw this.buildCodeFrameError("NodePath has been removed so is read-only.");
}

var NodePath_removal = Object.freeze({
  __proto__: null,
  _assertUnremoved,
  _callRemovalHooks,
  _markRemoved,
  _remove,
  _removeFromScope,
  remove
});

const { react: react$1 } = _t,
  { cloneNode: cloneNode$1, jsxExpressionContainer, variableDeclaration, variableDeclarator } = _t;
const referenceVisitor = {
  ReferencedIdentifier(path, state) {
    if (path.isJSXIdentifier() && react$1.isCompatTag(path.node.name) && !path.parentPath.isJSXMemberExpression())
      return;

    if (path.node.name === "this") {
      let scope = path.scope;
      do {
        if (scope.path.isFunction() && !scope.path.isArrowFunctionExpression()) break;
      } while ((scope = scope.parent));
      scope && state.breakOnScopePaths.push(scope.path);
    }
    const binding = path.scope.getBinding(path.node.name);
    if (!binding) return;
    for (const violation of binding.constantViolations)
      if (violation.scope !== binding.path.scope) {
        state.mutableBinding = true;
        path.stop();
        return;
      }

    if (binding === state.scope.getBinding(path.node.name)) state.bindings[path.node.name] = binding;
  }
};
class PathHoister {
  constructor(path, scope) {
    this.breakOnScopePaths = void 0;
    this.bindings = void 0;
    this.mutableBinding = void 0;
    this.scopes = void 0;
    this.scope = void 0;
    this.path = void 0;
    this.attachAfter = void 0;
    this.breakOnScopePaths = [];
    this.bindings = {};
    this.mutableBinding = false;
    this.scopes = [];
    this.scope = scope;
    this.path = path;
    this.attachAfter = false;
  }
  isCompatibleScope(scope) {
    for (const key of Object.keys(this.bindings)) {
      const binding = this.bindings[key];
      if (!scope.bindingIdentifierEquals(key, binding.identifier)) return false;
    }
    return true;
  }
  getCompatibleScopes() {
    let scope = this.path.scope;
    do {
      if (!this.isCompatibleScope(scope)) break;
      this.scopes.push(scope);

      if (this.breakOnScopePaths.indexOf(scope.path) >= 0) break;
    } while ((scope = scope.parent));
  }
  getAttachmentPath() {
    let path = this._getAttachmentPath();
    if (!path) return;
    let targetScope = path.scope;
    if (targetScope.path === path) targetScope = path.scope.parent;

    if (targetScope.path.isProgram() || targetScope.path.isFunction())
      for (const name of Object.keys(this.bindings)) {
        if (!targetScope.hasOwnBinding(name)) continue;
        const binding = this.bindings[name];
        if (
          binding.kind !== "param" && binding.path.parentKey !== "params" &&
          this.getAttachmentParentForPath(binding.path).key >= path.key
        ) {
          this.attachAfter = true;
          path = binding.path;
          for (const violationPath of binding.constantViolations)
            if (this.getAttachmentParentForPath(violationPath).key > path.key) path = violationPath;
        }
      }

    return path;
  }
  _getAttachmentPath() {
    const scope = this.scopes.pop();
    if (!scope) return;
    if (scope.path.isFunction()) {
      if (!this.hasOwnParamBindings(scope)) return this.getNextScopeAttachmentParent();

      if (this.scope === scope) return;
      const bodies = scope.path.get("body").get("body");
      for (let i = 0; i < bodies.length; i++)
        if (!bodies[i].node._blockHoist) return bodies[i];
    } else if (scope.path.isProgram()) return this.getNextScopeAttachmentParent();
  }
  getNextScopeAttachmentParent() {
    const scope = this.scopes.pop();
    if (scope) return this.getAttachmentParentForPath(scope.path);
  }
  getAttachmentParentForPath(path) {
    do {
      if (!path.parentPath || (Array.isArray(path.container) && path.isStatement())) return path;
    } while ((path = path.parentPath));
  }
  hasOwnParamBindings(scope) {
    for (const name of Object.keys(this.bindings)) {
      if (!scope.hasOwnBinding(name)) continue;
      const binding = this.bindings[name];
      if (binding.kind === "param" && binding.constant) return true;
    }
    return false;
  }
  run() {
    this.path.traverse(referenceVisitor, this);
    if (this.mutableBinding) return;
    this.getCompatibleScopes();
    const attachTo = this.getAttachmentPath();
    if (!attachTo || attachTo.getFunctionParent() === this.path.getFunctionParent()) return;
    let uid = attachTo.scope.generateUidIdentifier("ref");
    const declarator = variableDeclarator(uid, this.path.node),
      insertFn = this.attachAfter ? "insertAfter" : "insertBefore",
      [attached] = attachTo[insertFn]([
        attachTo.isVariableDeclarator() ? declarator : variableDeclaration("var", [declarator])
      ]),
      parent = this.path.parentPath;
    if (parent.isJSXElement() && this.path.container === parent.node.children) uid = jsxExpressionContainer(uid);

    this.path.replaceWith(cloneNode$1(uid));
    return attachTo.isVariableDeclarator() ? attached.get("init") : attached.get("declarations.0.init");
  }
}

const {
  arrowFunctionExpression,
  assertExpression,
  assignmentExpression,
  blockStatement,
  callExpression,
  cloneNode,
  expressionStatement,
  isAssignmentExpression,
  isCallExpression,
  isExportNamedDeclaration,
  isExpression: isExpression$1,
  isIdentifier: isIdentifier$1,
  isSequenceExpression,
  isSuper,
  thisExpression
} = _t;
function insertBefore(nodes_) {
  this._assertUnremoved();
  const nodes = this._verifyNodeList(nodes_),
    { parentPath, parent } = this;
  if (
    parentPath.isExpressionStatement() ||
    parentPath.isLabeledStatement() ||
    isExportNamedDeclaration(parent) ||
    (parentPath.isExportDefaultDeclaration() && this.isDeclaration())
  )
    return parentPath.insertBefore(nodes);
  if ((this.isNodeType("Expression") && !this.isJSXElement()) || (parentPath.isForStatement() && this.key === "init")) {
    this.node && nodes.push(this.node);
    return this.replaceExpressionWithStatements(nodes);
  }
  if (Array.isArray(this.container)) return this._containerInsertBefore(nodes);
  if (this.isStatementOrBlock()) {
    const node = this.node,
      shouldInsertCurrentNode = node && (!this.isExpressionStatement() || node.expression != null);
    this.replaceWith(blockStatement(shouldInsertCurrentNode ? [node] : []));
    return this.unshiftContainer("body", nodes);
  }
  throw new Error(
    "We don't know what to do with this node type. We were previously a Statement but we can't fit in here?"
  );
}
function _containerInsert(from, nodes) {
  this.updateSiblingKeys(from, nodes.length);
  const paths = [];
  this.container.splice(from, 0, ...nodes);
  for (let i = 0; i < nodes.length; i++) {
    var _this$context;
    const to = from + i,
      path = this.getSibling(to);
    paths.push(path);
    (_this$context = this.context) != null && _this$context.queue && path.pushContext(this.context);
  }
  const contexts = this._getQueueContexts();
  for (const path of paths) {
    path.setScope();
    path.debug("Inserted.");
    for (const context of contexts) context.maybeQueue(path, true);
  }
  return paths;
}
function _containerInsertBefore(nodes) {
  return this._containerInsert(this.key, nodes);
}
function _containerInsertAfter(nodes) {
  return this._containerInsert(this.key + 1, nodes);
}
const last = arr => arr[arr.length - 1];
function isHiddenInSequenceExpression(path) {
  return (
    isSequenceExpression(path.parent) &&
    (last(path.parent.expressions) !== path.node || isHiddenInSequenceExpression(path.parentPath))
  );
}
function isAlmostConstantAssignment(node, scope) {
  if (!isAssignmentExpression(node) || !isIdentifier$1(node.left)) return false;

  const blockScope = scope.getBlockParent();
  return (
    blockScope.hasOwnBinding(node.left.name) && blockScope.getOwnBinding(node.left.name).constantViolations.length <= 1
  );
}
function insertAfter(nodes_) {
  this._assertUnremoved();
  if (this.isSequenceExpression()) return last(this.get("expressions")).insertAfter(nodes_);

  const nodes = this._verifyNodeList(nodes_),
    { parentPath, parent } = this;
  if (
    parentPath.isExpressionStatement() ||
    parentPath.isLabeledStatement() ||
    isExportNamedDeclaration(parent) ||
    (parentPath.isExportDefaultDeclaration() && this.isDeclaration())
  )
    return parentPath.insertAfter(nodes.map(node => (isExpression$1(node) ? expressionStatement(node) : node)));
  if (
    (this.isNodeType("Expression") && !this.isJSXElement() && !parentPath.isJSXElement()) ||
    (parentPath.isForStatement() && this.key === "init")
  ) {
    if (this.node) {
      const node = this.node;
      let { scope } = this;
      if (scope.path.isPattern()) {
        assertExpression(node);
        this.replaceWith(callExpression(arrowFunctionExpression([], node), []));
        this.get("callee.body").insertAfter(nodes);
        return [this];
      }
      if (isHiddenInSequenceExpression(this)) nodes.unshift(node);
      else if (isCallExpression(node) && isSuper(node.callee)) {
        nodes.unshift(node);
        nodes.push(thisExpression());
      } else if (isAlmostConstantAssignment(node, scope)) {
        nodes.unshift(node);
        nodes.push(cloneNode(node.left));
      } else if (scope.isPure(node, true)) nodes.push(node);
      else {
        if (parentPath.isMethod({ computed: true, key: node })) scope = scope.parent;

        const temp = scope.generateDeclaredUidIdentifier();
        nodes.unshift(expressionStatement(assignmentExpression("=", cloneNode(temp), node)));
        nodes.push(expressionStatement(cloneNode(temp)));
      }
    }
    return this.replaceExpressionWithStatements(nodes);
  }
  if (Array.isArray(this.container)) return this._containerInsertAfter(nodes);
  if (this.isStatementOrBlock()) {
    const node = this.node,
      shouldInsertCurrentNode = node && (!this.isExpressionStatement() || node.expression != null);
    this.replaceWith(blockStatement(shouldInsertCurrentNode ? [node] : []));
    return this.pushContainer("body", nodes);
  }
  throw new Error(
    "We don't know what to do with this node type. We were previously a Statement but we can't fit in here?"
  );
}
function updateSiblingKeys(fromIndex, incrementBy) {
  if (!this.parent) return;
  const paths = getCachedPaths(this.hub, this.parent) || [];
  for (const [, path] of paths) if (typeof path.key == "number" && path.key >= fromIndex) path.key += incrementBy;
}
function _verifyNodeList(nodes) {
  if (!nodes) return [];

  Array.isArray(nodes) || (nodes = [nodes]);

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    let msg;
    if (!node) msg = "has falsy node";
    else if (typeof node != "object") msg = "contains a non-object node";
    else if (!node.type) msg = "without a type";
    else if (node instanceof NodePath) msg = "has a NodePath when it expected a raw object";

    if (msg) {
      const type = Array.isArray(node) ? "array" : typeof node;
      throw new Error(`Node list ${msg} with the index of ${i} and type of ${type}`);
    }
  }
  return nodes;
}
function unshiftContainer(listKey, nodes) {
  this._assertUnremoved();
  nodes = this._verifyNodeList(nodes);
  return NodePath.get({ parentPath: this, parent: this.node, container: this.node[listKey], listKey, key: 0 })
    .setContext(this.context)
    ._containerInsertBefore(nodes);
}
function pushContainer(listKey, nodes) {
  this._assertUnremoved();
  const verifiedNodes = this._verifyNodeList(nodes),
    container = this.node[listKey];
  return NodePath.get({ parentPath: this, parent: this.node, container, listKey, key: container.length })
    .setContext(this.context)
    .replaceWithMultiple(verifiedNodes);
}
function hoist(scope = this.scope) {
  return new PathHoister(this, scope).run();
}

var NodePath_modification = Object.freeze({
  __proto__: null,
  _containerInsert,
  _containerInsertAfter,
  _containerInsertBefore,
  _verifyNodeList,
  hoist,
  insertAfter,
  insertBefore,
  pushContainer,
  unshiftContainer,
  updateSiblingKeys
});

const {
  getBindingIdentifiers: _getBindingIdentifiers,
  getOuterBindingIdentifiers: _getOuterBindingIdentifiers,
  isDeclaration,
  numericLiteral,
  unaryExpression
} = _t;
const NORMAL_COMPLETION = 0,
  BREAK_COMPLETION = 1;
function NormalCompletion(path) {
  return { type: NORMAL_COMPLETION, path };
}
function BreakCompletion(path) {
  return { type: BREAK_COMPLETION, path };
}
function getOpposite() {
  return this.key === "left" ? this.getSibling("right") : this.key === "right" ? this.getSibling("left") : null;
}
function addCompletionRecords(path, records, context) {
  path && records.push(..._getCompletionRecords(path, context));

  return records;
}
function completionRecordForSwitch(cases, records, context) {
  let lastNormalCompletions = [];
  for (let i = 0; i < cases.length; i++) {
    const caseCompletions = _getCompletionRecords(cases[i], context),
      normalCompletions = [],
      breakCompletions = [];
    for (const c of caseCompletions) {
      c.type !== NORMAL_COMPLETION || normalCompletions.push(c);

      c.type !== BREAK_COMPLETION || breakCompletions.push(c);
    }
    if (normalCompletions.length) lastNormalCompletions = normalCompletions;

    records.push(...breakCompletions);
  }
  records.push(...lastNormalCompletions);
  return records;
}
function normalCompletionToBreak(completions) {
  completions.forEach(c => {
    c.type = BREAK_COMPLETION;
  });
}
function replaceBreakStatementInBreakCompletion(completions, reachable) {
  completions.forEach(c => {
    if (c.path.isBreakStatement({ label: null }))
      reachable ? c.path.replaceWith(unaryExpression("void", numericLiteral(0))) : c.path.remove();
  });
}
function getStatementListCompletion(paths, context) {
  const completions = [];
  if (context.canHaveBreak) {
    let lastNormalCompletions = [];
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i],
        newContext = Object.assign({}, context, { inCaseClause: false });
      path.isBlockStatement() && (context.inCaseClause || context.shouldPopulateBreak)
        ? (newContext.shouldPopulateBreak = true)
        : (newContext.shouldPopulateBreak = false);

      const statementCompletions = _getCompletionRecords(path, newContext);
      if (statementCompletions.length > 0 && statementCompletions.every(c => c.type === BREAK_COMPLETION)) {
        if (
          lastNormalCompletions.length > 0 &&
          statementCompletions.every(c => c.path.isBreakStatement({ label: null }))
        ) {
          normalCompletionToBreak(lastNormalCompletions);
          completions.push(...lastNormalCompletions);
          if (lastNormalCompletions.some(c => c.path.isDeclaration())) {
            completions.push(...statementCompletions);
            replaceBreakStatementInBreakCompletion(statementCompletions, true);
          }
          replaceBreakStatementInBreakCompletion(statementCompletions, false);
        } else {
          completions.push(...statementCompletions);
          context.shouldPopulateBreak || replaceBreakStatementInBreakCompletion(statementCompletions, true);
        }
        break;
      }
      if (i === paths.length - 1) completions.push(...statementCompletions);
      else {
        lastNormalCompletions = [];
        for (let i = 0; i < statementCompletions.length; i++) {
          const c = statementCompletions[i];
          c.type !== BREAK_COMPLETION || completions.push(c);

          c.type !== NORMAL_COMPLETION || lastNormalCompletions.push(c);
        }
      }
    }
  } else if (paths.length)
    for (let i = paths.length - 1; i >= 0; i--) {
      const pathCompletions = _getCompletionRecords(paths[i], context);
      if (
        pathCompletions.length > 1 ||
        (pathCompletions.length === 1 && !pathCompletions[0].path.isVariableDeclaration())
      ) {
        completions.push(...pathCompletions);
        break;
      }
    }

  return completions;
}
function _getCompletionRecords(path, context) {
  let records = [];
  if (path.isIfStatement()) {
    records = addCompletionRecords(path.get("consequent"), records, context);
    records = addCompletionRecords(path.get("alternate"), records, context);
  } else if (path.isDoExpression() || path.isFor() || path.isWhile() || path.isLabeledStatement())
    return addCompletionRecords(path.get("body"), records, context);
  else if (path.isProgram() || path.isBlockStatement())
    return getStatementListCompletion(path.get("body"), context);
  else if (path.isFunction()) return _getCompletionRecords(path.get("body"), context);
  else if (path.isTryStatement()) {
    records = addCompletionRecords(path.get("block"), records, context);
    records = addCompletionRecords(path.get("handler"), records, context);
  } else if (path.isCatchClause()) return addCompletionRecords(path.get("body"), records, context);
  else if (path.isSwitchStatement()) return completionRecordForSwitch(path.get("cases"), records, context);
  else if (path.isSwitchCase())
    return getStatementListCompletion(path.get("consequent"), {
      canHaveBreak: true,
      shouldPopulateBreak: false,
      inCaseClause: true
    });
  else path.isBreakStatement() ? records.push(BreakCompletion(path)) : records.push(NormalCompletion(path));

  return records;
}
function getCompletionRecords() {
  return _getCompletionRecords(this, { canHaveBreak: false, shouldPopulateBreak: false, inCaseClause: false }).map(
    r => r.path
  );
}
function getSibling(key) {
  return NodePath.get({
    parentPath: this.parentPath,
    parent: this.parent,
    container: this.container,
    listKey: this.listKey,
    key
  }).setContext(this.context);
}
function getPrevSibling() {
  return this.getSibling(this.key - 1);
}
function getNextSibling() {
  return this.getSibling(this.key + 1);
}
function getAllNextSiblings() {
  const siblings = [];
  for (let _key = this.key, sibling = this.getSibling(++_key); sibling.node; ) {
    siblings.push(sibling);
    sibling = this.getSibling(++_key);
  }
  return siblings;
}
function getAllPrevSiblings() {
  const siblings = [];
  for (let _key = this.key, sibling = this.getSibling(--_key); sibling.node; ) {
    siblings.push(sibling);
    sibling = this.getSibling(--_key);
  }
  return siblings;
}
function get(key, context = true) {
  if (context === true) context = this.context;
  const parts = key.split(".");
  return parts.length === 1 ? this._getKey(key, context) : this._getPattern(parts, context);
}
function _getKey(key, context) {
  const node = this.node,
    container = node[key];
  return Array.isArray(container)
    ? container.map((_, i) =>
        NodePath.get({ listKey: key, parentPath: this, parent: node, container, key: i }).setContext(context)
      )
    : NodePath.get({ parentPath: this, parent: node, container: node, key }).setContext(context);
}
function _getPattern(parts, context) {
  let path = this;
  for (const part of parts)
    path = part === "." ? path.parentPath : Array.isArray(path) ? path[part] : path.get(part, context);

  return path;
}
function getBindingIdentifiers(duplicates) {
  return _getBindingIdentifiers(this.node, duplicates);
}
function getOuterBindingIdentifiers(duplicates) {
  return _getOuterBindingIdentifiers(this.node, duplicates);
}
function getBindingIdentifierPaths(duplicates = false, outerOnly = false) {
  const search = [this],
    ids = Object.create(null);
  while (search.length) {
    const id = search.shift();
    if (!id || !id.node) continue;
    const keys = _getBindingIdentifiers.keys[id.node.type];
    if (id.isIdentifier()) {
      duplicates ? (ids[id.node.name] = ids[id.node.name] || []).push(id) : (ids[id.node.name] = id);

      continue;
    }
    if (id.isExportDeclaration()) {
      const declaration = id.get("declaration");
      isDeclaration(declaration) && search.push(declaration);

      continue;
    }
    if (outerOnly) {
      if (id.isFunctionDeclaration()) {
        search.push(id.get("id"));
        continue;
      }
      if (id.isFunctionExpression()) continue;
    }
    if (keys)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i],
          child = id.get(key);
        Array.isArray(child) ? search.push(...child) : child.node && search.push(child);
      }
  }
  return ids;
}
function getOuterBindingIdentifierPaths(duplicates = false) {
  return this.getBindingIdentifierPaths(duplicates, true);
}

var NodePath_family = Object.freeze({
  __proto__: null,
  _getKey,
  _getPattern,
  get,
  getAllNextSiblings,
  getAllPrevSiblings,
  getBindingIdentifierPaths,
  getBindingIdentifiers,
  getCompletionRecords,
  getNextSibling,
  getOpposite,
  getOuterBindingIdentifierPaths,
  getOuterBindingIdentifiers,
  getPrevSibling,
  getSibling
});

const { addComment: _addComment, addComments: _addComments } = _t;
function shareCommentsWithSiblings() {
  if (typeof this.key == "string") return;
  const node = this.node;
  if (!node) return;
  const trailing = node.trailingComments,
    leading = node.leadingComments;
  if (!trailing && !leading) return;
  const prev = this.getSibling(this.key - 1),
    next = this.getSibling(this.key + 1),
    hasPrev = Boolean(prev.node),
    hasNext = Boolean(next.node);
  if (hasPrev) {
    leading && prev.addComments("trailing", removeIfExisting(leading, prev.node.trailingComments));

    !trailing || hasNext || prev.addComments("trailing", trailing);
  }
  if (hasNext) {
    trailing && next.addComments("leading", removeIfExisting(trailing, next.node.leadingComments));

    !leading || hasPrev || next.addComments("leading", leading);
  }
}
function removeIfExisting(list, toRemove) {
  if (!toRemove) return list;
  let lastFoundIndex = -1;
  return list.filter(el => {
    const i = toRemove.indexOf(el, lastFoundIndex);
    if (i < 0) return true;
    lastFoundIndex = i;
  });
}
function addComment(type, content, line) {
  _addComment(this.node, type, content, line);
}
function addComments(type, comments) {
  _addComments(this.node, type, comments);
}

var NodePath_comments = Object.freeze({
  __proto__: null,
  addComment,
  addComments,
  shareCommentsWithSiblings
});

const {
  isBinding,
  isBlockScoped: nodeIsBlockScoped,
  isExportDeclaration,
  isExpression: nodeIsExpression,
  isFlow: nodeIsFlow,
  isForStatement,
  isForXStatement,
  isIdentifier,
  isImportDeclaration,
  isImportSpecifier,
  isJSXIdentifier,
  isJSXMemberExpression,
  isMemberExpression,
  isRestElement: nodeIsRestElement,
  isReferenced: nodeIsReferenced,
  isScope: nodeIsScope,
  isStatement: nodeIsStatement,
  isVar: nodeIsVar,
  isVariableDeclaration,
  react,
  isForOfStatement
} = _t;
const { isCompatTag } = react;
function isReferencedIdentifier(opts) {
  const { node, parent } = this;
  if (!isIdentifier(node, opts) && !isJSXMemberExpression(parent, opts))
    if (!isJSXIdentifier(node, opts) || isCompatTag(node.name)) return false;

  return nodeIsReferenced(node, parent, this.parentPath.parent);
}
function isReferencedMemberExpression() {
  const { node, parent } = this;
  return isMemberExpression(node) && nodeIsReferenced(node, parent);
}
function isBindingIdentifier() {
  const { node, parent } = this,
    grandparent = this.parentPath.parent;
  return isIdentifier(node) && isBinding(node, parent, grandparent);
}
function isStatement() {
  const { node, parent } = this;
  if (nodeIsStatement(node)) {
    if (isVariableDeclaration(node))
      if (isForXStatement(parent, { left: node }) || isForStatement(parent, { init: node })) return false;

    return true;
  }
  return false;
}
function isExpression() {
  return this.isIdentifier() ? this.isReferencedIdentifier() : nodeIsExpression(this.node);
}
function isScope() {
  return nodeIsScope(this.node, this.parent);
}
function isReferenced() {
  return nodeIsReferenced(this.node, this.parent);
}
function isBlockScoped() {
  return nodeIsBlockScoped(this.node);
}
function isVar() {
  return nodeIsVar(this.node);
}
function isUser() {
  return this.node && !!this.node.loc;
}
function isGenerated() {
  return !this.isUser();
}
function isPure(constantsOnly) {
  return this.scope.isPure(this.node, constantsOnly);
}
function isFlow() {
  const { node } = this;
  return !(
    !nodeIsFlow(node) &&
    (isImportDeclaration(node)
      ? node.importKind !== "type" && node.importKind !== "typeof"
      : isExportDeclaration(node)
      ? node.exportKind !== "type"
      : !isImportSpecifier(node) || (node.importKind !== "type" && node.importKind !== "typeof"))
  );
}
function isRestProperty() {
  return nodeIsRestElement(this.node) && this.parentPath && this.parentPath.isObjectPattern();
}
function isSpreadProperty() {
  return nodeIsRestElement(this.node) && this.parentPath && this.parentPath.isObjectExpression();
}
function isForAwaitStatement() {
  return isForOfStatement(this.node, { await: true });
}

var NodePath_virtual_types_validator = Object.freeze({
  __proto__: null,
  isBindingIdentifier,
  isBlockScoped,
  isExpression,
  isFlow,
  isForAwaitStatement,
  isGenerated,
  isPure,
  isReferenced,
  isReferencedIdentifier,
  isReferencedMemberExpression,
  isRestProperty,
  isScope,
  isSpreadProperty,
  isStatement,
  isUser,
  isVar
});

const { validate } = _t,
  debug = buildDebug("babel"),
  REMOVED = 1,
  SHOULD_STOP = 2,
  SHOULD_SKIP = 4;
class NodePath {
  constructor(hub, parent) {
    this.contexts = [];
    this.state = null;
    this.opts = null;
    this._traverseFlags = 0;
    this.skipKeys = null;
    this.parentPath = null;
    this.container = null;
    this.listKey = null;
    this.key = null;
    this.node = null;
    this.type = null;
    this.parent = parent;
    this.hub = hub;
    this.data = null;
    this.context = null;
    this.scope = null;
  }
  static get({ hub, parentPath, parent, container, listKey, key }) {
    if (!hub && parentPath) hub = parentPath.hub;

    if (!parent) throw new Error("To get a node path the parent needs to exist");

    const targetNode = container[key],
      paths = getOrCreateCachedPaths(hub, parent);
    let path = paths.get(targetNode);
    if (!path) {
      path = new NodePath(hub, parent);
      targetNode && paths.set(targetNode, path);
    }
    path.setup(parentPath, container, listKey, key);
    return path;
  }
  getScope(scope) {
    return this.isScope() ? new Scope(this) : scope;
  }
  setData(key, val) {
    if (this.data == null) this.data = Object.create(null);

    return (this.data[key] = val);
  }
  getData(key, def) {
    if (this.data == null) this.data = Object.create(null);

    let val = this.data[key];
    if (val === void 0 && def !== void 0) val = this.data[key] = def;
    return val;
  }
  hasNode() {
    return this.node != null;
  }
  buildCodeFrameError(msg, Error = SyntaxError) {
    return this.hub.buildError(this.node, msg, Error);
  }
  traverse(visitor, state) {
    traverse(this.node, visitor, this.scope, state, this);
  }
  set(key, node) {
    validate(this.node, key, node);
    this.node[key] = node;
  }
  getPathLocation() {
    const parts = [];
    let path = this;
    do {
      let key = path.key;
      if (path.inList) key = `${path.listKey}[${key}]`;
      parts.unshift(key);
    } while ((path = path.parentPath));
    return parts.join(".");
  }
  debug(message) {
    debug.enabled && debug(`${this.getPathLocation()} ${this.type}: ${message}`);
  }
  toString() {
    return generator.default(this.node).code;
  }
  get inList() {
    return !!this.listKey;
  }
  set inList(inList) {
    inList || (this.listKey = null);
  }
  get parentKey() {
    return this.listKey || this.key;
  }
  get shouldSkip() {
    return !!(this._traverseFlags & SHOULD_SKIP);
  }
  set shouldSkip(v) {
    v ? (this._traverseFlags |= SHOULD_SKIP) : (this._traverseFlags &= ~SHOULD_SKIP);
  }
  get shouldStop() {
    return !!(this._traverseFlags & SHOULD_STOP);
  }
  set shouldStop(v) {
    v ? (this._traverseFlags |= SHOULD_STOP) : (this._traverseFlags &= ~SHOULD_STOP);
  }
  get removed() {
    return !!(this._traverseFlags & REMOVED);
  }
  set removed(v) {
    v ? (this._traverseFlags |= REMOVED) : (this._traverseFlags &= ~REMOVED);
  }
}
Object.assign(
  NodePath.prototype,
  NodePath_ancestry,
  NodePath_inference,
  NodePath_replacement,
  NodePath_evaluation,
  NodePath_conversion,
  NodePath_introspection,
  NodePath_context,
  NodePath_removal,
  NodePath_modification,
  NodePath_family,
  NodePath_comments
);
// noinspection JSUnusedGlobalSymbols
NodePath.prototype._guessExecutionStatusRelativeToDifferentFunctions = _guessExecutionStatusRelativeTo;

for (const type of _t.TYPES) {
  const typeKey = "is" + type,
    fn = _t[typeKey];
  NodePath.prototype[typeKey] = function (opts) {
    return fn(this.node, opts);
  };
  NodePath.prototype["assert" + type] = function (opts) {
    if (!fn(this.node, opts)) throw new TypeError("Expected node path of type " + type);
  };
}
Object.assign(NodePath.prototype, NodePath_virtual_types_validator);
for (const type of Object.keys(virtualTypes)) type[0] === "_" || _t.TYPES.includes(type) || _t.TYPES.push(type);

const { VISITOR_KEYS: VISITOR_KEYS$2 } = _t;
class TraversalContext {
  constructor(scope, opts, state, parentPath) {
    this.queue = null;
    this.priorityQueue = null;
    this.parentPath = parentPath;
    this.scope = scope;
    this.state = state;
    this.opts = opts;
  }
  shouldVisit(node) {
    const opts = this.opts;
    if (opts.enter || opts.exit || opts[node.type]) return true;
    const keys = VISITOR_KEYS$2[node.type];
    if (keys == null || !keys.length) return false;
    for (const key of keys) if (node[key]) return true;

    return false;
  }
  create(node, container, key, listKey) {
    return NodePath.get({ parentPath: this.parentPath, parent: node, container, key, listKey });
  }
  maybeQueue(path, notPriority) {
    if (this.queue) notPriority ? this.queue.push(path) : this.priorityQueue.push(path);
  }
  visitMultiple(container, parent, listKey) {
    if (container.length === 0) return false;
    const queue = [];
    for (let key = 0; key < container.length; key++) {
      const node = container[key];
      node && this.shouldVisit(node) && queue.push(this.create(parent, container, key, listKey));
    }
    return this.visitQueue(queue);
  }
  visitSingle(node, key) {
    return !!this.shouldVisit(node[key]) && this.visitQueue([this.create(node, node, key)]);
  }
  visitQueue(queue) {
    this.queue = queue;
    this.priorityQueue = [];
    const visited = new WeakSet();
    let stop = false;
    for (const path of queue) {
      path.resync();
      (path.contexts.length > 0 && path.contexts[path.contexts.length - 1] === this) || path.pushContext(this);

      if (path.key === null) continue;
      const { node } = path;
      if (visited.has(node)) continue;
      node && visited.add(node);
      if (path.visit()) {
        stop = true;
        break;
      }
      if (this.priorityQueue.length) {
        stop = this.visitQueue(this.priorityQueue);
        this.priorityQueue = [];
        this.queue = queue;
        if (stop) break;
      }
    }
    for (const path of queue) path.popContext();

    this.queue = null;
    return stop;
  }
  visit(node, key) {
    const nodes = node[key];
    return !!nodes && (Array.isArray(nodes) ? this.visitMultiple(nodes, node, key) : this.visitSingle(node, key));
  }
}

const { VISITOR_KEYS: VISITOR_KEYS$1 } = _t;
function traverseNode(node, opts, scope, state, path, skipKeys, visitSelf) {
  const keys = VISITOR_KEYS$1[node.type];
  if (!keys) return false;
  const context = new TraversalContext(scope, opts, state, path);
  if (visitSelf) return (skipKeys == null || !skipKeys[path.parentKey]) && context.visitQueue([path]);

  for (const key of keys) if ((skipKeys == null || !skipKeys[key]) && context.visit(node, key)) return true;

  return false;
}

class Hub {
  getCode() {}
  getScope() {}
  addHelper() {
    throw new Error("Helpers are not supported by the default hub.");
  }
  buildError(node, msg, Error = TypeError) {
    return new Error(msg);
  }
}

const { VISITOR_KEYS, removeProperties, traverseFast } = _t;
function traverse(parent, opts = {}, scope, state, parentPath, visitSelf) {
  if (!parent) return;
  if (!opts.noScope && !scope && parent.type !== "Program" && parent.type !== "File")
    throw new Error(
      `You must pass a scope and parentPath unless traversing a Program/File. Instead of that you tried to traverse a ${parent.type} node without passing scope and parentPath.`
    );

  if (!parentPath && visitSelf) throw new Error("visitSelf can only be used when providing a NodePath.");

  if (!VISITOR_KEYS[parent.type]) return;

  explode(opts);
  traverseNode(parent, opts, scope, state, parentPath, null, visitSelf);
}
traverse.visitors = visitors;
traverse.verify = verify;
traverse.explode = explode;
traverse.cheap = function (node, enter) {
  traverseFast(node, enter);
};
traverse.node = function (node, opts, scope, state, path, skipKeys) {
  traverseNode(node, opts, scope, state, path, skipKeys);
};
traverse.clearNode = function (node, opts) {
  removeProperties(node, opts);
};
traverse.removeProperties = function (tree, opts) {
  traverseFast(tree, traverse.clearNode, opts);
  return tree;
};
function hasDenylistedType(path, state) {
  if (path.node.type === state.type) {
    state.has = true;
    path.stop();
  }
}
traverse.hasType = function (tree, type, denylistTypes) {
  if (denylistTypes != null && denylistTypes.includes(tree.type)) return false;
  if (tree.type === type) return true;
  const state = { has: false, type };
  traverse(tree, { noScope: true, denylist: denylistTypes, enter: hasDenylistedType }, null, state);
  return state.has;
};
traverse.cache = cache;

exports = module.exports = traverse;
exports.Hub = Hub;
exports.NodePath = NodePath;
exports.Scope = Scope;
exports.buildDebug = buildDebug;
exports.default = traverse;
exports.globals = globals;
exports.visitors = visitors;

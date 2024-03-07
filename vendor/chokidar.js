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
  return __webpack_require__(10);
})([
// 0
function(module) {

module.exports = require('path');

},
// 1
function(module) {

module.exports = require('util');

},
// 2
function(module) {

module.exports = require('fs');

},
// 3
function(module, exports, __webpack_require__) {

const utils = __webpack_require__(4);

module.exports = (ast, options = {}) => {
  let stringify = (node, parent = {}) => {
    let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent),
      invalidNode = node.invalid === true && options.escapeInvalid === true,
      output = '';

    if (node.value)
      return (invalidBlock || invalidNode) && utils.isOpenOrClose(node)
        ? '\\' + node.value
        : node.value;

    if (node.value) return node.value;

    if (node.nodes) for (let child of node.nodes) output += stringify(child);

    return output;
  };

  return stringify(ast);
};

},
// 4
function(module, exports) {

exports.isInteger = num =>
  typeof num == 'number' ? Number.isInteger(num)
    : typeof num == 'string' && num.trim() !== '' && Number.isInteger(Number(num));

exports.find = (node, type) => node.nodes.find(node => node.type === type);

exports.exceedsLimit = (min, max, step = 1, limit) =>
  limit !== false && !(!exports.isInteger(min) || !exports.isInteger(max)) &&
  (Number(max) - Number(min)) / Number(step) >= limit;

exports.escapeNode = (block, n = 0, type) => {
  let node = block.nodes[n];
  if (
    node &&
    ((type && node.type === type) || node.type === 'open' || node.type === 'close') &&
    node.escaped !== true
  ) {
    node.value = '\\' + node.value;
    node.escaped = true;
  }
};

exports.encloseBrace = node => {
  if (node.type !== 'brace') return false;
  if ((node.commas >> (0 + node.ranges)) >> 0 == 0) {
    node.invalid = true;
    return true;
  }
  return false;
};

exports.isInvalidBrace = block => {
  if (block.type !== 'brace') return false;
  if (block.invalid === true || block.dollar) return true;
  if ((block.commas >> (0 + block.ranges)) >> 0 == 0 ||
      block.open !== true || block.close !== true) {
    block.invalid = true;
    return true;
  }
  return false;
};

exports.isOpenOrClose = node =>
  node.type === 'open' || node.type === 'close' || node.open === true || node.close === true;

exports.reduce = nodes => nodes.reduce((acc, node) => {
  node.type !== 'text' || acc.push(node.value);
  if (node.type === 'range') node.type = 'text';
  return acc;
}, []);

exports.flatten = (...args) => {
  const result = [];
  const flat = arr => {
    for (let i = 0; i < arr.length; i++) {
      let ele = arr[i];
      Array.isArray(ele) ? flat(ele, result) : ele === void 0 || result.push(ele);
    }
    return result;
  };
  flat(args);
  return result;
};

},
// 5
function(module, exports, __webpack_require__) {

const { sep } = __webpack_require__(0),
  { platform } = process;

exports.EV_ALL = 'all';
exports.EV_READY = 'ready';
exports.EV_ADD = 'add';
exports.EV_CHANGE = 'change';
exports.EV_ADD_DIR = 'addDir';
exports.EV_UNLINK = 'unlink';
exports.EV_UNLINK_DIR = 'unlinkDir';
exports.EV_RAW = 'raw';
exports.EV_ERROR = 'error';

exports.STR_DATA = 'data';
exports.STR_END = 'end';
exports.STR_CLOSE = 'close';

exports.FSEVENT_CREATED = 'created';
exports.FSEVENT_MODIFIED = 'modified';
exports.FSEVENT_DELETED = 'deleted';
exports.FSEVENT_MOVED = 'moved';
exports.FSEVENT_CLONED = 'cloned';
exports.FSEVENT_UNKNOWN = 'unknown';
exports.FSEVENT_TYPE_FILE = 'file';
exports.FSEVENT_TYPE_DIRECTORY = 'directory';
exports.FSEVENT_TYPE_SYMLINK = 'symlink';

exports.KEY_LISTENERS = 'listeners';
exports.KEY_ERR = 'errHandlers';
exports.KEY_RAW = 'rawEmitters';
exports.HANDLER_KEYS = [exports.KEY_LISTENERS, exports.KEY_ERR, exports.KEY_RAW];

exports.DOT_SLASH = '.' + sep;

exports.BACK_SLASH_RE = /\\/g;
exports.DOUBLE_SLASH_RE = /\/\//;
exports.SLASH_OR_BACK_SLASH_RE = /[/\\]/;
exports.DOT_RE = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
exports.REPLACER_RE = /^\.[/\\]/;

exports.SLASH = '/';
exports.SLASH_SLASH = '//';
exports.BRACE_START = '{';
exports.BANG = '!';
exports.ONE_DOT = '.';
exports.TWO_DOTS = '..';
exports.STAR = '*';
exports.GLOBSTAR = '**';
exports.ROOT_GLOBSTAR = '/**/*';
exports.SLASH_GLOBSTAR = '/**';
exports.DIR_SUFFIX = 'Dir';
exports.ANYMATCH_OPTS = { dot: true };
exports.STRING_TYPE = 'string';
exports.FUNCTION_TYPE = 'function';
exports.EMPTY_STR = '';
exports.EMPTY_FN = () => {};
exports.IDENTITY_FN = val => val;

exports.isWindows = platform === 'win32';
exports.isMacos = platform === 'darwin';
exports.isLinux = platform === 'linux';

},
// 6
function(module) {

module.exports = require('./picomatch');

},
// 7
function(module) {

module.exports = function(path, stripTrailing) {
  if (typeof path != 'string') throw new TypeError('expected path to be a string');

  if (path === '\\' || path === '/') return '/';

  var len = path.length;
  if (len <= 1) return path;

  var prefix = '';
  if (len > 4 && path[3] === '\\') {
    var ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  var segs = path.split(/[/\\]+/);
  stripTrailing === false || segs[segs.length - 1] !== '' || segs.pop();

  return prefix + segs.join('/');
};

},
// 8
function(module, exports, __webpack_require__) {

var isExtglob = __webpack_require__(16),
  chars = { '{': '}', '(': ')', '[': ']' };
var strictCheck = function(str) {
  if (str[0] === '!') return true;

  var pipeIndex = -2,
    closeSquareIndex = -2,
    closeCurlyIndex = -2,
    closeParenIndex = -2,
    backSlashIndex = -2;
  for (var index = 0; index < str.length; ) {
    if (str[index] === '*' || (str[index + 1] === '?' && /[\].+)]/.test(str[index])))
      return true;

    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
      if (closeSquareIndex < index) closeSquareIndex = str.indexOf(']', index);

      if (closeSquareIndex > index &&
          (backSlashIndex === -1 || backSlashIndex > closeSquareIndex ||
          (backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeSquareIndex))
        return true;
    }

    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}' &&
        (closeCurlyIndex = str.indexOf('}', index)) > index &&
        ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeCurlyIndex))
      return true;

    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' &&
        /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')' &&
        (closeParenIndex = str.indexOf(')', index)) > index &&
        ((backSlashIndex = str.indexOf('\\', index)) < 0 || backSlashIndex > closeParenIndex))
      return true;

    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
      if (pipeIndex < index) pipeIndex = str.indexOf('|', index);

      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')' &&
          (closeParenIndex = str.indexOf(')', pipeIndex)) > pipeIndex &&
          ((backSlashIndex = str.indexOf('\\', pipeIndex)) < 0 || backSlashIndex > closeParenIndex))
        return true;
    }

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n > -1) index = n + 1;
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

var relaxedCheck = function(str) {
  if (str[0] === '!') return true;

  for (var index = 0; index < str.length; ) {
    if (/[*?{}()[\]]/.test(str[index])) return true;

    if (str[index] === '\\') {
      var open = str[index + 1];
      index += 2;
      var close = chars[open];

      if (close) {
        var n = str.indexOf(close, index);
        if (n > -1) index = n + 1;
      }

      if (str[index] === '!') return true;
    } else index++;
  }
  return false;
};

module.exports = function(str, options) {
  if (typeof str != 'string' || str === '') return false;

  if (isExtglob(str)) return true;

  var check = strictCheck;

  if (options && options.strict === false) check = relaxedCheck;

  return check(str);
};

},
// 9
function(module, exports, __webpack_require__) {

const util = __webpack_require__(1),
  toRegexRange = __webpack_require__(20),

  isObject = val => val !== null && typeof val == 'object' && !Array.isArray(val),

  transform = toNumber => value => toNumber === true ? Number(value) : String(value),

  isValidValue = value => typeof value == 'number' || (typeof value == 'string' && value !== ''),

  isNumber = num => Number.isInteger(+num);

const zeros = input => {
  let value = '' + input,
    index = -1;
  if (value[0] === '-') value = value.slice(1);
  if (value === '0') return false;
  while (value[++index] === '0');
  return index > 0;
};

const stringify = (start, end, options) =>
  typeof start == 'string' || typeof end == 'string' || options.stringify === true;

const pad = (input, maxLength, toNumber) => {
  if (maxLength > 0) {
    let dash = input[0] === '-' ? '-' : '';
    if (dash) input = input.slice(1);
    input = dash + input.padStart(dash ? maxLength - 1 : maxLength, '0');
  }
  return toNumber === false ? String(input) : input;
};

const toMaxLen = (input, maxLength) => {
  let negative = input[0] === '-' ? '-' : '';
  if (negative) {
    input = input.slice(1);
    maxLength--;
  }
  while (input.length < maxLength) input = '0' + input;
  return negative ? '-' + input : input;
};

const toSequence = (parts, options) => {
  parts.negatives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  parts.positives.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  let result,
    prefix = options.capture ? '' : '?:',
    positives = '',
    negatives = '';

  if (parts.positives.length) positives = parts.positives.join('|');

  if (parts.negatives.length) negatives = `-(${prefix}${parts.negatives.join('|')})`;

  result = positives && negatives ? `${positives}|${negatives}` : positives || negatives;

  return options.wrap ? `(${prefix}${result})` : result;
};

const toRange = (a, b, isNumbers, options) => {
  if (isNumbers) return toRegexRange(a, b, { wrap: false, ...options });

  let start = String.fromCharCode(a);

  return a === b ? start : `[${start}-${String.fromCharCode(b)}]`;
};

const toRegex = (start, end, options) => {
  if (Array.isArray(start)) {
    let wrap = options.wrap === true,
      prefix = options.capture ? '' : '?:';
    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
  }
  return toRegexRange(start, end, options);
};

const rangeError = (...args) => new RangeError('Invalid range arguments: ' + util.inspect(...args));

const invalidRange = (start, end, options) => {
  if (options.strictRanges === true) throw rangeError([start, end]);
  return [];
};

const invalidStep = (step, options) => {
  if (options.strictRanges === true)
    throw new TypeError(`Expected step "${step}" to be a number`);

  return [];
};

const fillNumbers = (start, end, step = 1, options = {}) => {
  let a = Number(start),
    b = Number(end);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    if (options.strictRanges === true) throw rangeError([start, end]);
    return [];
  }

  if (a === 0) a = 0;
  if (b === 0) b = 0;

  let descending = a > b,
    startString = String(start),
    endString = String(end),
    stepString = String(step);
  step = Math.max(Math.abs(step), 1);

  let padded = zeros(startString) || zeros(endString) || zeros(stepString),
    maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0,
    toNumber = padded === false && stringify(start, end, options) === false,
    format = options.transform || transform(toNumber);

  if (options.toRegex && step === 1)
    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);

  let parts = { negatives: [], positives: [] },
    push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num)),
    range = [];

  for (let index = 0; descending ? a >= b : a <= b; ) {
    options.toRegex === true && step > 1
      ? push(a)
      : range.push(pad(format(a, index), maxLen, toNumber));

    a = descending ? a - step : a + step;
    index++;
  }

  return options.toRegex === true
    ? step > 1
      ? toSequence(parts, options)
      : toRegex(range, null, { wrap: false, ...options })
    : range;
};

const fillLetters = (start, end, step = 1, options = {}) => {
  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1))
    return invalidRange(start, end, options);

  let format = options.transform || (val => String.fromCharCode(val)),
    a = `${start}`.charCodeAt(0),
    b = `${end}`.charCodeAt(0),

    descending = a > b,
    min = Math.min(a, b),
    max = Math.max(a, b);

  if (options.toRegex && step === 1) return toRange(min, max, false, options);

  let range = [];

  for (let index = 0; descending ? a >= b : a <= b; ) {
    range.push(format(a, index));
    a = descending ? a - step : a + step;
    index++;
  }

  return options.toRegex === true ? toRegex(range, null, { wrap: false, options }) : range;
};

const fill = (start, end, step, options = {}) => {
  if (end == null && isValidValue(start)) return [start];

  if (!isValidValue(start) || !isValidValue(end)) return invalidRange(start, end, options);

  if (typeof step == 'function') return fill(start, end, 1, { transform: step });

  if (isObject(step)) return fill(start, end, 0, step);

  let opts = { ...options };
  if (opts.capture === true) opts.wrap = true;
  step = step || opts.step || 1;

  return !isNumber(step)
    ? step != null && !isObject(step) ? invalidStep(step, opts)
      : fill(start, end, 1, step)

    : isNumber(start) && isNumber(end)
    ? fillNumbers(start, end, step, opts)

    : fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};

module.exports = fill;

},
// 10
function(module, exports, __webpack_require__) {

const { EventEmitter } = __webpack_require__(11),
  fs = __webpack_require__(2),
  sysPath = __webpack_require__(0),
  { promisify } = __webpack_require__(1),
  readdirp = __webpack_require__(12),
  anymatch = __webpack_require__(14).default,
  globParent = __webpack_require__(15),
  isGlob = __webpack_require__(8),
  braces = __webpack_require__(18),
  normalizePath = __webpack_require__(7),

  NodeFsHandler = __webpack_require__(25),
  FsEventsHandler = __webpack_require__(28);
const {
  EV_ALL,
  EV_READY,
  EV_ADD,
  EV_CHANGE,
  EV_UNLINK,
  EV_ADD_DIR,
  EV_UNLINK_DIR,
  EV_RAW,
  EV_ERROR,

  STR_CLOSE,
  STR_END,

  BACK_SLASH_RE,
  DOUBLE_SLASH_RE,
  SLASH_OR_BACK_SLASH_RE,
  DOT_RE,
  REPLACER_RE,

  SLASH,
  SLASH_SLASH,
  BRACE_START,
  BANG,
  ONE_DOT,
  TWO_DOTS,
  GLOBSTAR,
  SLASH_GLOBSTAR,
  ANYMATCH_OPTS,
  STRING_TYPE,
  FUNCTION_TYPE,
  EMPTY_STR,
  EMPTY_FN,

  isWindows,
  isMacos
} = __webpack_require__(5);

const stat = promisify(fs.stat),
  readdir = promisify(fs.readdir),

  arrify = (value = []) => (Array.isArray(value) ? value : [value]);
const flatten = (list, result = []) => {
  list.forEach(item => {
    Array.isArray(item) ? flatten(item, result) : result.push(item);
  });
  return result;
};

const unifyPaths = (paths_) => {
  const paths = flatten(arrify(paths_));
  if (paths.some(p => typeof p !== STRING_TYPE))
    throw new TypeError('Non-string provided as watch path: ' + paths);

  return paths.map(normalizePathToUnix);
};

const toUnix = (string) => {
  let str = string.replace(BACK_SLASH_RE, SLASH),
    prepend = false;
  if (str.startsWith(SLASH_SLASH)) prepend = true;

  while (str.match(DOUBLE_SLASH_RE)) str = str.replace(DOUBLE_SLASH_RE, SLASH);

  if (prepend) str = SLASH + str;

  return str;
};

const normalizePathToUnix = (path) => toUnix(sysPath.normalize(toUnix(path)));

const normalizeIgnored = (cwd = EMPTY_STR) => (path) =>
  typeof path !== STRING_TYPE ? path
    : normalizePathToUnix(sysPath.isAbsolute(path) ? path : sysPath.join(cwd, path));

const getAbsolutePath = (path, cwd) =>
  sysPath.isAbsolute(path)
    ? path
    : path.startsWith(BANG)
    ? BANG + sysPath.join(cwd, path.slice(1))
    : sysPath.join(cwd, path);

const undef = (opts, key) => opts[key] === void 0;

class DirEntry {
  constructor(dir, removeWatcher) {
    this.path = dir;
    this._removeWatcher = removeWatcher;
    this.items = new Set();
  }

  add(item) {
    const { items } = this;
    items && item !== ONE_DOT && item !== TWO_DOTS && items.add(item);
  }

  async remove(item) {
    const { items } = this;
    if (!items) return;
    items.delete(item);
    if (items.size > 0) return;

    const dir = this.path;
    try {
      await readdir(dir);
    } catch (_err) {
      this._removeWatcher &&
        this._removeWatcher(sysPath.dirname(dir), sysPath.basename(dir));
    }
  }

  has(item) {
    const { items } = this;
    if (items) return items.has(item);
  }

  getChildren() {
    const { items } = this;
    if (items) return [...items.values()];
  }

  dispose() {
    this.items.clear();
    delete this.path;
    delete this._removeWatcher;
    delete this.items;
    Object.freeze(this);
  }
}

const STAT_METHOD_F = 'stat',
  STAT_METHOD_L = 'lstat';
class WatchHelper {
  constructor(path, watchPath, follow, fsw) {
    this.fsw = fsw;
    this.path = path = path.replace(REPLACER_RE, EMPTY_STR);
    this.watchPath = watchPath;
    this.fullWatchPath = sysPath.resolve(watchPath);
    this.hasGlob = watchPath !== path;
    if (path === EMPTY_STR) this.hasGlob = false;
    this.globSymlink = !(!this.hasGlob || !follow) && void 0;
    this.globFilter = !!this.hasGlob && anymatch(path, void 0, ANYMATCH_OPTS);
    this.dirParts = this.getDirParts(path);
    this.dirParts.forEach((parts) => {
      parts.length > 1 && parts.pop();
    });
    this.followSymlinks = follow;
    this.statMethod = follow ? STAT_METHOD_F : STAT_METHOD_L;
  }

  checkGlobSymlink(entry) {
    if (this.globSymlink === void 0)
      this.globSymlink = entry.fullParentDir !== this.fullWatchPath && {
        realPath: entry.fullParentDir,
        linkPath: this.fullWatchPath
      };

    return this.globSymlink
      ? entry.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath)
      : entry.fullPath;
  }

  entryPath(entry) {
    return sysPath.join(this.watchPath,
      sysPath.relative(this.watchPath, this.checkGlobSymlink(entry))
    );
  }

  filterPath(entry) {
    const { stats } = entry;
    if (stats && stats.isSymbolicLink()) return this.filterDir(entry);
    const resolvedPath = this.entryPath(entry);
    return (
      (!this.hasGlob || typeof this.globFilter !== FUNCTION_TYPE || this.globFilter(resolvedPath)) &&
      this.fsw._isntIgnored(resolvedPath, stats) &&
      this.fsw._hasReadPermissions(stats)
    );
  }

  getDirParts(path) {
    if (!this.hasGlob) return [];
    const parts = [];
    (path.includes(BRACE_START) ? braces.expand(path) : [path]).forEach((path) => {
      parts.push(sysPath.relative(this.watchPath, path).split(SLASH_OR_BACK_SLASH_RE));
    });
    return parts;
  }

  filterDir(entry) {
    if (this.hasGlob) {
      const entryParts = this.getDirParts(this.checkGlobSymlink(entry));
      let globstar = false;
      this.unmatchedGlob = !this.dirParts.some((parts) =>
        parts.every((part, i) => {
          if (part === GLOBSTAR) globstar = true;
          return globstar || !entryParts[0][i] || anymatch(part, entryParts[0][i], ANYMATCH_OPTS);
        })
      );
    }
    return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(entry), entry.stats);
  }
}

class FSWatcher extends EventEmitter {

constructor(_opts) {
  super();

  const opts = {};
  _opts && Object.assign(opts, _opts);

  this._watched = new Map();
  this._closers = new Map();
  this._ignoredPaths = new Set();

  this._throttled = new Map();

  this._symlinkPaths = new Map();

  this._streams = new Set();
  this.closed = false;

  if (undef(opts, 'persistent')) opts.persistent = true;
  if (undef(opts, 'ignoreInitial')) opts.ignoreInitial = false;
  if (undef(opts, 'ignorePermissionErrors')) opts.ignorePermissionErrors = false;
  if (undef(opts, 'interval')) opts.interval = 100;
  if (undef(opts, 'binaryInterval')) opts.binaryInterval = 300;
  if (undef(opts, 'disableGlobbing')) opts.disableGlobbing = false;
  opts.enableBinaryInterval = opts.binaryInterval !== opts.interval;

  if (undef(opts, 'useFsEvents')) opts.useFsEvents = !opts.usePolling;

  FsEventsHandler.canUse() || (opts.useFsEvents = false);

  if (undef(opts, 'usePolling') && !opts.useFsEvents) opts.usePolling = isMacos;

  const envPoll = process.env.CHOKIDAR_USEPOLLING;
  if (envPoll !== void 0) {
    const envLower = envPoll.toLowerCase();

    opts.usePolling = envLower !== 'false' && envLower !== '0' &&
      (envLower === 'true' || envLower === '1' || !!envLower);
  }
  const envInterval = process.env.CHOKIDAR_INTERVAL;
  if (envInterval) opts.interval = Number.parseInt(envInterval, 10);

  if (undef(opts, 'atomic')) opts.atomic = !opts.usePolling && !opts.useFsEvents;
  if (opts.atomic) this._pendingUnlinks = new Map();

  if (undef(opts, 'followSymlinks')) opts.followSymlinks = true;

  if (undef(opts, 'awaitWriteFinish')) opts.awaitWriteFinish = false;
  if (opts.awaitWriteFinish === true) opts.awaitWriteFinish = {};
  const awf = opts.awaitWriteFinish;
  if (awf) {
    awf.stabilityThreshold || (awf.stabilityThreshold = 2000);
    awf.pollInterval || (awf.pollInterval = 100);
    this._pendingWrites = new Map();
  }
  if (opts.ignored) opts.ignored = arrify(opts.ignored);

  let readyCalls = 0;
  this._emitReady = () => {
    readyCalls++;
    if (readyCalls >= this._readyCount) {
      this._emitReady = EMPTY_FN;
      this._readyEmitted = true;
      process.nextTick(() => this.emit(EV_READY));
    }
  };
  this._emitRaw = (...args) => this.emit(EV_RAW, ...args);
  this._readyEmitted = false;
  this.options = opts;

  opts.useFsEvents
    ? (this._fsEventsHandler = new FsEventsHandler(this))
    : (this._nodeFsHandler = new NodeFsHandler(this));

  Object.freeze(opts);
}

add(paths_, _origAdd, _internal) {
  const { cwd, disableGlobbing } = this.options;
  this.closed = false;
  let paths = unifyPaths(paths_);
  if (cwd)
    paths = paths.map((path) => {
      const absPath = getAbsolutePath(path, cwd);

      return disableGlobbing || !isGlob(path) ? absPath : normalizePath(absPath);
    });

  paths = paths.filter((path) => {
    if (path.startsWith(BANG)) {
      this._ignoredPaths.add(path.slice(1));
      return false;
    }

    this._ignoredPaths.delete(path);
    this._ignoredPaths.delete(path + SLASH_GLOBSTAR);

    this._userIgnored = void 0;

    return true;
  });

  if (this.options.useFsEvents && this._fsEventsHandler) {
    this._readyCount || (this._readyCount = paths.length);
    if (this.options.persistent) this._readyCount *= 2;
    paths.forEach((path) => this._fsEventsHandler._addToFsEvents(path));
  } else {
    this._readyCount || (this._readyCount = 0);
    this._readyCount += paths.length;
    Promise.all(
      paths.map(async path => {
        const res = await this._nodeFsHandler._addToNodeFs(path, !_internal, 0, 0, _origAdd);
        res && this._emitReady();
        return res;
      })
    ).then(results => {
      if (this.closed) return;
      results.filter(item => item).forEach(item => {
        this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
      });
    });
  }

  return this;
}

unwatch(paths_) {
  if (this.closed) return this;
  const paths = unifyPaths(paths_),
    { cwd } = this.options;

  paths.forEach((path) => {
    if (!sysPath.isAbsolute(path) && !this._closers.has(path)) {
      if (cwd) path = sysPath.join(cwd, path);
      path = sysPath.resolve(path);
    }

    this._closePath(path);

    this._ignoredPaths.add(path);
    this._watched.has(path) && this._ignoredPaths.add(path + SLASH_GLOBSTAR);

    this._userIgnored = void 0;
  });

  return this;
}

close() {
  if (this.closed) return this._closePromise;
  this.closed = true;

  this.removeAllListeners();
  const closers = [];
  this._closers.forEach(closerList => closerList.forEach(closer => {
    const promise = closer();
    promise instanceof Promise && closers.push(promise);
  }));
  this._streams.forEach(stream => stream.destroy());
  this._userIgnored = void 0;
  this._readyCount = 0;
  this._readyEmitted = false;
  this._watched.forEach(dirent => dirent.dispose());
  ['closers', 'watched', 'streams', 'symlinkPaths', 'throttled'].forEach(key => {
    this['_' + key].clear();
  });

  this._closePromise = closers.length ? Promise.all(closers).then(() => {}) : Promise.resolve();
  return this._closePromise;
}

getWatched() {
  const watchList = {};
  this._watched.forEach((entry, dir) => {
    const key = this.options.cwd ? sysPath.relative(this.options.cwd, dir) : dir;
    watchList[key || ONE_DOT] = entry.getChildren().sort();
  });
  return watchList;
}

emitWithAll(event, args) {
  this.emit(...args);
  event === EV_ERROR || this.emit(EV_ALL, ...args);
}

async _emit(event, path, val1, val2, val3) {
  if (this.closed) return;

  const opts = this.options;
  if (isWindows) path = sysPath.normalize(path);
  if (opts.cwd) path = sysPath.relative(opts.cwd, path);
  const args = [event, path];
  val3 !== void 0 ? args.push(val1, val2, val3)
    : val2 !== void 0 ? args.push(val1, val2)
    : val1 === void 0 || args.push(val1);

  const awf = opts.awaitWriteFinish;
  let pw;
  if (awf && (pw = this._pendingWrites.get(path))) {
    pw.lastChange = new Date();
    return this;
  }

  if (opts.atomic) {
    if (event === EV_UNLINK) {
      this._pendingUnlinks.set(path, args);
      setTimeout(() => {
        this._pendingUnlinks.forEach((entry, path) => {
          this.emit(...entry);
          this.emit(EV_ALL, ...entry);
          this._pendingUnlinks.delete(path);
        });
      }, typeof opts.atomic == 'number' ? opts.atomic : 100);
      return this;
    }
    if (event === EV_ADD && this._pendingUnlinks.has(path)) {
      event = args[0] = EV_CHANGE;
      this._pendingUnlinks.delete(path);
    }
  }

  if (awf && (event === EV_ADD || event === EV_CHANGE) && this._readyEmitted) {
    const awfEmit = (err, stats) => {
      if (err) {
        event = args[0] = EV_ERROR;
        args[1] = err;
        this.emitWithAll(event, args);
      } else if (stats) {
        args.length > 2 ? (args[2] = stats) : args.push(stats);

        this.emitWithAll(event, args);
      }
    };

    this._awaitWriteFinish(path, awf.stabilityThreshold, event, awfEmit);
    return this;
  }

  if (event === EV_CHANGE && !this._throttle(EV_CHANGE, path, 50)) return this;

  if (
    opts.alwaysStat && val1 === void 0 &&
    (event === EV_ADD || event === EV_ADD_DIR || event === EV_CHANGE)
  ) {
    const fullPath = opts.cwd ? sysPath.join(opts.cwd, path) : path;
    let stats;
    try {
      stats = await stat(fullPath);
    } catch (_) {}
    if (!stats || this.closed) return;
    args.push(stats);
  }
  this.emitWithAll(event, args);

  return this;
}

_handleError(error) {
  const code = error && error.code;
  error && code !== 'ENOENT' && code !== 'ENOTDIR' &&
    (!this.options.ignorePermissionErrors || (code !== 'EPERM' && code !== 'EACCES')) &&
    this.emit(EV_ERROR, error);

  return error || this.closed;
}

_throttle(actionType, path, timeout) {
  this._throttled.has(actionType) || this._throttled.set(actionType, new Map());

  const action = this._throttled.get(actionType),
    actionPath = action.get(path);

  if (actionPath) {
    actionPath.count++;
    return false;
  }

  let timeoutObject;
  const clear = () => {
    const item = action.get(path),
      count = item ? item.count : 0;
    action.delete(path);
    clearTimeout(timeoutObject);
    item && clearTimeout(item.timeoutObject);
    return count;
  };
  timeoutObject = setTimeout(clear, timeout);
  const thr = { timeoutObject, clear, count: 0 };
  action.set(path, thr);
  return thr;
}

_incrReadyCount() {
  return this._readyCount++;
}

_awaitWriteFinish(path, threshold, event, awfEmit) {
  let timeoutHandler,

    fullPath = path;
  if (this.options.cwd && !sysPath.isAbsolute(path))
    fullPath = sysPath.join(this.options.cwd, path);

  const now = new Date();

  const awaitWriteFinish = (prevStat) => {
    fs.stat(fullPath, (err, curStat) => {
      if (err || !this._pendingWrites.has(path)) {
        err && err.code !== 'ENOENT' && awfEmit(err);
        return;
      }

      const now = Number(new Date());

      if (prevStat && curStat.size !== prevStat.size)
        this._pendingWrites.get(path).lastChange = now;

      if (now - this._pendingWrites.get(path).lastChange >= threshold) {
        this._pendingWrites.delete(path);
        awfEmit(void 0, curStat);
      } else
        timeoutHandler = setTimeout(
          awaitWriteFinish,
          this.options.awaitWriteFinish.pollInterval,
          curStat
        );
    });
  };

  if (!this._pendingWrites.has(path)) {
    this._pendingWrites.set(path, {
      lastChange: now,
      cancelWait: () => {
        this._pendingWrites.delete(path);
        clearTimeout(timeoutHandler);
        return event;
      }
    });
    timeoutHandler = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval);
  }
}

_getGlobIgnored() {
  return [...this._ignoredPaths.values()];
}

_isIgnored(path, stats) {
  if (this.options.atomic && DOT_RE.test(path)) return true;
  if (!this._userIgnored) {
    const { cwd } = this.options,
      ign = this.options.ignored,

      ignored = ign && ign.map(normalizeIgnored(cwd)),
      paths = arrify(ignored)
        .filter((path) => typeof path === STRING_TYPE && !isGlob(path))
        .map((path) => path + SLASH_GLOBSTAR),
      list = this._getGlobIgnored().map(normalizeIgnored(cwd)).concat(ignored, paths);
    this._userIgnored = anymatch(list, void 0, ANYMATCH_OPTS);
  }

  return this._userIgnored([path, stats]);
}

_isntIgnored(path, stat) {
  return !this._isIgnored(path, stat);
}

_getWatchHelpers(path, depth) {
  const watchPath =
      depth || this.options.disableGlobbing || !isGlob(path) ? path : globParent(path),
    follow = this.options.followSymlinks;

  return new WatchHelper(path, watchPath, follow, this);
}

_getWatchedDir(directory) {
  this._boundRemove || (this._boundRemove = this._remove.bind(this));
  const dir = sysPath.resolve(directory);
  this._watched.has(dir) || this._watched.set(dir, new DirEntry(dir, this._boundRemove));
  return this._watched.get(dir);
}

_hasReadPermissions(stats) {
  if (this.options.ignorePermissionErrors) return true;

  const st = (stats && Number.parseInt(stats.mode, 10)) & 0o777,
    it = Number.parseInt(st.toString(8)[0], 10);
  return Boolean(4 & it);
}

_remove(directory, item, isDirectory) {
  const path = sysPath.join(directory, item),
    fullPath = sysPath.resolve(path);
  isDirectory =
    isDirectory != null ? isDirectory : this._watched.has(path) || this._watched.has(fullPath);

  if (!this._throttle('remove', path, 100)) return;

  isDirectory || this.options.useFsEvents || this._watched.size !== 1 ||
    this.add(directory, item, true);

  this._getWatchedDir(path).getChildren().forEach(nested => this._remove(path, nested));

  const parent = this._getWatchedDir(directory),
    wasTracked = parent.has(item);
  parent.remove(item);

  let relPath = path;
  if (this.options.cwd) relPath = sysPath.relative(this.options.cwd, path);
  if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath) &&
      this._pendingWrites.get(relPath).cancelWait() === EV_ADD)
    return;

  this._watched.delete(path);
  this._watched.delete(fullPath);
  const eventName = isDirectory ? EV_UNLINK_DIR : EV_UNLINK;
  !wasTracked || this._isIgnored(path) || this._emit(eventName, path);

  this.options.useFsEvents || this._closePath(path);
}

_closePath(path) {
  this._closeFile(path);
  const dir = sysPath.dirname(path);
  this._getWatchedDir(dir).remove(sysPath.basename(path));
}

_closeFile(path) {
  const closers = this._closers.get(path);
  if (!closers) return;
  closers.forEach(closer => closer());
  this._closers.delete(path);
}

_addPathCloser(path, closer) {
  if (!closer) return;
  let list = this._closers.get(path);
  if (!list) {
    list = [];
    this._closers.set(path, list);
  }
  list.push(closer);
}

_readdirp(root, opts) {
  if (this.closed) return;
  const options = { type: EV_ALL, alwaysStat: true, lstat: true, ...opts };
  let stream = readdirp(root, options);
  this._streams.add(stream);
  stream.once(STR_CLOSE, () => {
    stream = void 0;
  });
  stream.once(STR_END, () => {
    if (stream) {
      this._streams.delete(stream);
      stream = void 0;
    }
  });
  return stream;
}

}

exports.FSWatcher = FSWatcher;

exports.watch = (paths, options) => {
  const watcher = new FSWatcher(options);
  watcher.add(paths);
  return watcher;
};

},
// 11
function(module) {

module.exports = require('events');

},
// 12
function(module, exports, __webpack_require__) {

const fs = __webpack_require__(2),
  { Readable } = __webpack_require__(13),
  sysPath = __webpack_require__(0),
  { promisify } = __webpack_require__(1),
  picomatch = __webpack_require__(6),

  readdir = promisify(fs.readdir),
  stat = promisify(fs.stat),
  lstat = promisify(fs.lstat),
  realpath = promisify(fs.realpath),

  BANG = '!',
  NORMAL_FLOW_ERRORS = new Set(['ENOENT', 'EPERM', 'EACCES', 'ELOOP']),
  FILE_TYPE = 'files',
  DIR_TYPE = 'directories',
  FILE_DIR_TYPE = 'files_directories',
  EVERYTHING_TYPE = 'all',
  ALL_TYPES = [FILE_TYPE, DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE],

  isNormalFlowError = error => NORMAL_FLOW_ERRORS.has(error.code);

const normalizeFilter = filter => {
  if (filter === void 0) return;
  if (typeof filter == 'function') return filter;

  if (typeof filter == 'string') {
    const glob = picomatch(filter.trim());
    return entry => glob(entry.basename);
  }

  if (Array.isArray(filter)) {
    const positive = [],
      negative = [];
    for (const item of filter) {
      const trimmed = item.trim();
      trimmed.charAt(0) === BANG
        ? negative.push(picomatch(trimmed.slice(1)))
        : positive.push(picomatch(trimmed));
    }

    return negative.length > 0
      ? positive.length > 0
        ? entry => positive.some(f => f(entry.basename)) && !negative.some(f => f(entry.basename))
        : entry => !negative.some(f => f(entry.basename))
      : entry => positive.some(f => f(entry.basename));
  }
};

class ReaddirpStream extends Readable {
  static get defaultOptions() {
    return {
      root: '.',
      fileFilter: (_path) => true,
      directoryFilter: (_path) => true,
      type: FILE_TYPE,
      lstat: false,
      depth: 2147483648,
      alwaysStat: false
    };
  }

  constructor(options = {}) {
    super({ objectMode: true, autoDestroy: true, highWaterMark: options.highWaterMark || 4096 });
    const opts = { ...ReaddirpStream.defaultOptions, ...options },
      { root, type } = opts;

    this._fileFilter = normalizeFilter(opts.fileFilter);
    this._directoryFilter = normalizeFilter(opts.directoryFilter);

    const statMethod = opts.lstat ? lstat : stat;
    this._stat = process.platform === 'win32' && stat.length === 3
      ? path => statMethod(path, { bigint: true })
      : statMethod;

    this._maxDepth = opts.depth;
    this._wantsDir = [DIR_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsFile = [FILE_TYPE, FILE_DIR_TYPE, EVERYTHING_TYPE].includes(type);
    this._wantsEverything = type === EVERYTHING_TYPE;
    this._root = sysPath.resolve(root);
    this._isDirent = 'Dirent' in fs && !opts.alwaysStat;
    this._statsProp = this._isDirent ? 'dirent' : 'stats';
    this._rdOptions = { encoding: 'utf8', withFileTypes: this._isDirent };

    this.parents = [this._exploreDir(root, 1)];
    this.reading = false;
    this.parent = void 0;
  }

  async _read(batch) {
    if (this.reading) return;
    this.reading = true;

    try {
      while (!this.destroyed && batch > 0) {
        const { path, depth, files = [] } = this.parent || {};

        if (files.length > 0) {
          const slice = files.splice(0, batch).map(dirent => this._formatEntry(dirent, path));
          for (const entry of await Promise.all(slice)) {
            if (this.destroyed) return;

            const entryType = await this._getEntryType(entry);
            if (entryType === 'directory' && this._directoryFilter(entry)) {
              depth > this._maxDepth ||
                this.parents.push(this._exploreDir(entry.fullPath, depth + 1));

              if (this._wantsDir) {
                this.push(entry);
                batch--;
              }
            } else if ((entryType === 'file' || this._includeAsFile(entry)) &&
                this._fileFilter(entry) && this._wantsFile) {
              this.push(entry);
              batch--;
            }
          }
        } else {
          const parent = this.parents.pop();
          if (!parent) {
            this.push(null);
            break;
          }
          this.parent = await parent;
          if (this.destroyed) return;
        }
      }
    } catch (error) {
      this.destroy(error);
    } finally {
      this.reading = false;
    }
  }

  async _exploreDir(path, depth) {
    let files;
    try {
      files = await readdir(path, this._rdOptions);
    } catch (error) {
      this._onError(error);
    }
    return { files, depth, path };
  }

  async _formatEntry(dirent, path) {
    let entry;
    try {
      const basename = this._isDirent ? dirent.name : dirent,
        fullPath = sysPath.resolve(sysPath.join(path, basename));
      entry = { path: sysPath.relative(this._root, fullPath), fullPath, basename };
      entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
    } catch (err) {
      this._onError(err);
    }
    return entry;
  }

  _onError(err) {
    isNormalFlowError(err) && !this.destroyed ? this.emit('warn', err) : this.destroy(err);
  }

  async _getEntryType(entry) {
    const /** @type {Stats} */ stats = entry && entry[this._statsProp];
    if (!stats) return;

    if (stats.isFile()) return 'file';
    if (stats.isDirectory()) return 'directory';

    if (stats && stats.isSymbolicLink()) {
      const full = entry.fullPath;
      try {
        const entryRealPath = await realpath(full),
          /** @type {Stats} */ entryRealPathStats = await lstat(entryRealPath);
        if (entryRealPathStats.isFile()) return 'file';

        if (entryRealPathStats.isDirectory()) {
          const len = entryRealPath.length;
          return full.startsWith(entryRealPath) && full.substr(len, 1) === sysPath.sep
            ? this._onError(
                new Error(`Circular symlink detected: "${full}" points to "${entryRealPath}"`)
              )
            : 'directory';
        }
      } catch (error) {
        this._onError(error);
      }
    }
  }

  _includeAsFile(entry) {
    const stats = entry && entry[this._statsProp];

    return stats && this._wantsEverything && !stats.isDirectory();
  }
}

const readdirp = (root, options = {}) => {
  let type = options.entryType || options.type;
  if (type === 'both') type = FILE_DIR_TYPE;
  if (type) options.type = type;
  if (!root)
    throw new Error('readdirp: root argument is required. Usage: readdirp(root, options)');
  if (typeof root != 'string')
    throw new TypeError('readdirp: root argument must be a string. Usage: readdirp(root, options)');
  if (type && !ALL_TYPES.includes(type))
    throw new Error('readdirp: Invalid type passed. Use one of ' + ALL_TYPES.join(', '));

  options.root = root;
  return new ReaddirpStream(options);
};

readdirp.promise = (root, options = {}) =>
  new Promise((resolve, reject) => {
    const files = [];
    readdirp(root, options)
      .on('data', entry => files.push(entry))
      .on('end', () => resolve(files))
      .on('error', error => reject(error));
  });

readdirp.ReaddirpStream = ReaddirpStream;
readdirp.default = readdirp;

module.exports = readdirp;

},
// 13
function(module) {

module.exports = require('stream');

},
// 14
function(module, exports, __webpack_require__) {

Object.defineProperty(exports, '__esModule', { value: true });

const picomatch = __webpack_require__(6),
  normalizePath = __webpack_require__(7),

  BANG = '!',
  DEFAULT_OPTIONS = { returnIndex: false },
  arrify = (item) => (Array.isArray(item) ? item : [item]);

const createPattern = (matcher, options) => {
  if (typeof matcher == 'function') return matcher;

  if (typeof matcher == 'string') {
    const glob = picomatch(matcher, options);
    return (string) => matcher === string || glob(string);
  }
  return matcher instanceof RegExp ? (string) => matcher.test(string) : (_string) => false;
};

const matchPatterns = (patterns, negPatterns, args, returnIndex) => {
  const isList = Array.isArray(args),
    _path = isList ? args[0] : args;
  if (!isList && typeof _path != 'string')
    throw new TypeError(
      'anymatch: second argument must be a string: got ' + Object.prototype.toString.call(_path)
    );

  const path = normalizePath(_path);

  for (let index = 0; index < negPatterns.length; index++)
    if ((0, negPatterns[index])(path)) return !!returnIndex && -1;

  const applied = isList && [path].concat(args.slice(1));
  for (let index = 0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (isList ? pattern(...applied) : pattern(path)) return !returnIndex || index;
  }

  return !!returnIndex && -1;
};

const anymatch = (matchers, testString, options = DEFAULT_OPTIONS) => {
  if (matchers == null) throw new TypeError('anymatch: specify first argument');

  const opts = typeof options == 'boolean' ? { returnIndex: options } : options,
    returnIndex = opts.returnIndex || false,

    mtchers = arrify(matchers);
  const negatedGlobs = mtchers
    .filter(item => typeof item == 'string' && item.charAt(0) === BANG)
    .map(item => item.slice(1))
    .map(item => picomatch(item, opts));
  const patterns = mtchers
    .filter(item => typeof item != 'string' || item.charAt(0) !== BANG)
    .map(matcher => createPattern(matcher, opts));

  return testString == null
    ? (testString, ri = false) =>
        matchPatterns(patterns, negatedGlobs, testString, typeof ri == 'boolean' && ri)
    : matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};

anymatch.default = anymatch;
module.exports = anymatch;

},
// 15
function(module, exports, __webpack_require__) {

var isGlob = __webpack_require__(8),
  pathPosixDirname = __webpack_require__(0).posix.dirname,
  isWin32 = __webpack_require__(17).platform() === 'win32',

  slash = '/',
  backslash = /\\/g,
  enclosure = /[{\[].*[}\]]$/,
  globby = /(^|[^\\])([{\[]|\([^)]+$)/,
  escaped = /\\([!*?|\[\](){}])/g;

module.exports = function(str, opts) {
  if (
    Object.assign({ flipBackslashes: true }, opts).flipBackslashes &&
    isWin32 && str.indexOf(slash) < 0
  )
    str = str.replace(backslash, slash);

  if (enclosure.test(str)) str += slash;

  str += 'a';

  do {
    str = pathPosixDirname(str);
  } while (isGlob(str) || globby.test(str));

  return str.replace(escaped, '$1');
};

},
// 16
function(module) {

module.exports = function(str) {
  if (typeof str != 'string' || str === '') return false;

  for (var match; (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)); ) {
    if (match[2]) return true;
    str = str.slice(match.index + match[0].length);
  }

  return false;
};

},
// 17
function(module) {

module.exports = require('os');

},
// 18
function(module, exports, __webpack_require__) {

const stringify = __webpack_require__(3),
  compile = __webpack_require__(19),
  expand = __webpack_require__(22),
  parse = __webpack_require__(23);

const braces = (input, options = {}) => {
  let output = [];

  if (Array.isArray(input))
    for (let pattern of input) {
      let result = braces.create(pattern, options);
      Array.isArray(result) ? output.push(...result) : output.push(result);
    }
  else output = [].concat(braces.create(input, options));

  if (options && options.expand === true && options.nodupes === true)
    output = [...new Set(output)];

  return output;
};

braces.parse = (input, options = {}) => parse(input, options);

braces.stringify = (input, options = {}) =>
  stringify(typeof input == 'string' ? braces.parse(input, options) : input, options);

braces.compile = (input, options = {}) => {
  if (typeof input == 'string') input = braces.parse(input, options);

  return compile(input, options);
};

braces.expand = (input, options = {}) => {
  if (typeof input == 'string') input = braces.parse(input, options);

  let result = expand(input, options);

  if (options.noempty === true) result = result.filter(Boolean);

  if (options.nodupes === true) result = [...new Set(result)];

  return result;
};

braces.create = (input, options = {}) =>
  input === '' || input.length < 3
    ? [input]
    : options.expand !== true
    ? braces.compile(input, options)
    : braces.expand(input, options);

module.exports = braces;

},
// 19
function(module, exports, __webpack_require__) {

const fill = __webpack_require__(9),
  utils = __webpack_require__(4);

module.exports = (ast, options = {}) => {
  let walk = (node, parent = {}) => {
    let invalidBlock = utils.isInvalidBrace(parent),
      invalidNode = node.invalid === true && options.escapeInvalid === true,
      invalid = invalidBlock === true || invalidNode === true,
      prefix = options.escapeInvalid === true ? '\\' : '',
      output = '';

    if (node.isOpen === true) return prefix + node.value;
    if (node.isClose === true) return prefix + node.value;

    if (node.type === 'open') return invalid ? prefix + node.value : '(';

    if (node.type === 'close') return invalid ? prefix + node.value : ')';

    if (node.type === 'comma')
      return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';

    if (node.value) return node.value;

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes),
        range = fill(...args, { ...options, wrap: false, toRegex: true });

      if (range.length !== 0)
        return args.length > 1 && range.length > 1 ? `(${range})` : range;
    }

    if (node.nodes) for (let child of node.nodes) output += walk(child, node);

    return output;
  };

  return walk(ast);
};

},
// 20
function(module, exports, __webpack_require__) {

const isNumber = __webpack_require__(21);

const toRegexRange = (min, max, options) => {
  if (isNumber(min) === false)
    throw new TypeError('toRegexRange: expected the first argument to be a number');

  if (max === void 0 || min === max) return String(min);

  if (isNumber(max) === false)
    throw new TypeError('toRegexRange: expected the second argument to be a number.');

  let opts = { relaxZeros: true, ...options };
  if (typeof opts.strictZeros == 'boolean') opts.relaxZeros = opts.strictZeros === false;

  let cacheKey = min + ':' + max + '=' +
    String(opts.relaxZeros) + String(opts.shorthand) + String(opts.capture) + String(opts.wrap);

  if (toRegexRange.cache.hasOwnProperty(cacheKey)) return toRegexRange.cache[cacheKey].result;

  let a = Math.min(min, max),
    b = Math.max(min, max);

  if (Math.abs(a - b) === 1) {
    let result = min + '|' + max;
    return opts.capture ? `(${result})` : opts.wrap === false ? result : `(?:${result})`;
  }

  let isPadded = hasPadding(min) || hasPadding(max),
    state = { min, max, a, b },
    positives = [],
    negatives = [];

  if (isPadded) {
    state.isPadded = isPadded;
    state.maxLen = String(state.max).length;
  }

  if (a < 0) {
    negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), state, opts);
    a = state.a = 0;
  }

  if (b >= 0) positives = splitToPatterns(a, b, state, opts);

  state.negatives = negatives;
  state.positives = positives;
  state.result = collatePatterns(negatives, positives, opts);

  if (opts.capture === true) state.result = `(${state.result})`;
  else if (opts.wrap !== false && positives.length + negatives.length > 1)
    state.result = `(?:${state.result})`;

  toRegexRange.cache[cacheKey] = state;
  return state.result;
};

function collatePatterns(neg, pos, options) {
  let onlyNegative = filterPatterns(neg, pos, '-', false, options) || [],
    onlyPositive = filterPatterns(pos, neg, '', false, options) || [],
    intersected = filterPatterns(neg, pos, '-?', true, options) || [];
  return onlyNegative.concat(intersected).concat(onlyPositive).join('|');
}

function splitToRanges(min, max) {
  let nines = 1,
    zeros = 1,

    stop = countNines(min, nines),
    stops = new Set([max]);

  while (min <= stop && stop <= max) {
    stops.add(stop);
    nines += 1;
    stop = countNines(min, nines);
  }

  stop = countZeros(max + 1, zeros) - 1;

  while (min < stop && stop <= max) {
    stops.add(stop);
    zeros += 1;
    stop = countZeros(max + 1, zeros) - 1;
  }

  stops = [...stops];
  stops.sort(compare);
  return stops;
}

function rangeToPattern(start, stop, options) {
  if (start === stop) return { pattern: start, count: [], digits: 0 };

  let zipped = zip(start, stop),
    digits = zipped.length,
    pattern = '',
    count = 0;

  for (let i = 0; i < digits; i++) {
    let [startDigit, stopDigit] = zipped[i];

    startDigit === stopDigit
      ? (pattern += startDigit)
      : startDigit !== '0' || stopDigit !== '9'
      ? (pattern += toCharacterClass(startDigit, stopDigit, options))
      : count++;
  }

  if (count) pattern += options.shorthand === true ? '\\d' : '[0-9]';

  return { pattern, count: [count], digits };
}

function splitToPatterns(min, max, tok, options) {
  let ranges = splitToRanges(min, max),
    tokens = [];

  for (let prev = void 0, start = min, i = 0; i < ranges.length; i++) {
    let max = ranges[i],
      obj = rangeToPattern(String(start), String(max), options),
      zeros = '';

    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
      prev.count.length > 1 && prev.count.pop();

      prev.count.push(obj.count[0]);
      prev.string = prev.pattern + toQuantifier(prev.count);
      start = max + 1;
      continue;
    }

    if (tok.isPadded) zeros = padZeros(max, tok, options);

    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
    tokens.push(obj);
    start = max + 1;
    prev = obj;
  }

  return tokens;
}

function filterPatterns(arr, comparison, prefix, intersection, _options) {
  let result = [];

  for (let ele of arr) {
    let { string } = ele;

    intersection || contains(comparison, 'string', string) || result.push(prefix + string);

    intersection && contains(comparison, 'string', string) && result.push(prefix + string);
  }
  return result;
}

function zip(a, b) {
  let arr = [];
  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
  return arr;
}

function compare(a, b) {
  return a > b ? 1 : b > a ? -1 : 0;
}

function contains(arr, key, val) {
  return arr.some(ele => ele[key] === val);
}

function countNines(min, len) {
  return Number(String(min).slice(0, -len) + '9'.repeat(len));
}

function countZeros(integer, zeros) {
  return integer - (integer % Math.pow(10, zeros));
}

function toQuantifier(digits) {
  let [start = 0, stop = ''] = digits;
  return stop || start > 1 ? `{${start + (stop ? ',' + stop : '')}}` : '';
}

function toCharacterClass(a, b, _options) {
  return `[${a}${b - a == 1 ? '' : '-'}${b}]`;
}

function hasPadding(str) {
  return /^-?(0+)\d/.test(str);
}

function padZeros(value, tok, options) {
  if (!tok.isPadded) return value;

  let diff = Math.abs(tok.maxLen - String(value).length),
    relax = options.relaxZeros !== false;

  switch (diff) {
    case 0:
      return '';
    case 1:
      return relax ? '0?' : '0';
    case 2:
      return relax ? '0{0,2}' : '00';
    default:
      return relax ? `0{0,${diff}}` : `0{${diff}}`;
  }
}

toRegexRange.cache = {};
toRegexRange.clearCache = () => (toRegexRange.cache = {});

module.exports = toRegexRange;

},
// 21
function(module) {

module.exports = function(num) {
  return typeof num == 'number'
    ? num === num
    : typeof num == 'string' && num.trim() !== '' &&
      (Number.isFinite ? Number.isFinite(+num) : isFinite(+num));
};

},
// 22
function(module, exports, __webpack_require__) {

const fill = __webpack_require__(9),
  stringify = __webpack_require__(3),
  utils = __webpack_require__(4);

const append = (queue = '', stash = '', enclose = false) => {
  let result = [];

  queue = [].concat(queue);

  if (!(stash = [].concat(stash)).length) return queue;
  if (!queue.length) return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;

  for (let item of queue)
    if (Array.isArray(item))
      for (let value of item) result.push(append(value, stash, enclose));
    else
      for (let ele of stash) {
        if (enclose === true && typeof ele == 'string') ele = `{${ele}}`;
        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
      }

  return utils.flatten(result);
};

module.exports = (ast, options = {}) => {
  let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;

  let walk = (node, parent = {}) => {
    node.queue = [];

    let p = parent,
      q = parent.queue;

    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
      p = p.parent;
      q = p.queue;
    }

    if (node.invalid || node.dollar) {
      q.push(append(q.pop(), stringify(node, options)));
      return;
    }

    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
      q.push(append(q.pop(), ['{}']));
      return;
    }

    if (node.nodes && node.ranges > 0) {
      let args = utils.reduce(node.nodes);

      if (utils.exceedsLimit(...args, options.step, rangeLimit))
        throw new RangeError(
          'expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.'
        );

      let range = fill(...args, options);
      if (range.length === 0) range = stringify(node, options);

      q.push(append(q.pop(), range));
      node.nodes = [];
      return;
    }

    let enclose = utils.encloseBrace(node),
      queue = node.queue,
      block = node;

    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
      block = block.parent;
      queue = block.queue;
    }

    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i];

      if (child.type === 'comma' && node.type === 'brace') {
        i !== 1 || queue.push('');
        queue.push('');
      } else
        child.type === 'close'
          ? q.push(append(q.pop(), queue, enclose))
          : child.value && child.type !== 'open'
          ? queue.push(append(queue.pop(), child.value))
          : child.nodes && walk(child, node);
    }

    return queue;
  };

  return utils.flatten(walk(ast));
};

},
// 23
function(module, exports, __webpack_require__) {

const stringify = __webpack_require__(3);

const {
  MAX_LENGTH,
  CHAR_BACKSLASH,
  CHAR_BACKTICK,
  CHAR_COMMA,
  CHAR_DOT,
  CHAR_LEFT_PARENTHESES,
  CHAR_RIGHT_PARENTHESES,
  CHAR_LEFT_CURLY_BRACE,
  CHAR_RIGHT_CURLY_BRACE,
  CHAR_LEFT_SQUARE_BRACKET,
  CHAR_RIGHT_SQUARE_BRACKET,
  CHAR_DOUBLE_QUOTE,
  CHAR_SINGLE_QUOTE,
  CHAR_NO_BREAK_SPACE,
  CHAR_ZERO_WIDTH_NOBREAK_SPACE
} = __webpack_require__(24);

module.exports = (input, options = {}) => {
  if (typeof input != 'string') throw new TypeError('Expected a string');

  let opts = options || {},
    max = typeof opts.maxLength == 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  if (input.length > max)
    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);

  let value,
    ast = { type: 'root', input, nodes: [] },
    stack = [ast],
    block = ast,
    prev = ast,
    brackets = 0,
    length = input.length,
    index = 0,
    depth = 0;

  const advance = () => input[index++];
  const push = node => {
    if (node.type === 'text' && prev.type === 'dot') prev.type = 'text';

    if (prev && prev.type === 'text' && node.type === 'text') {
      prev.value += node.value;
      return;
    }

    block.nodes.push(node);
    node.parent = block;
    node.prev = prev;
    prev = node;
    return node;
  };

  push({ type: 'bos' });

  while (index < length) {
    block = stack[stack.length - 1];
    value = advance();

    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) continue;

    if (value === CHAR_BACKSLASH) {
      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
      continue;
    }

    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
      push({ type: 'text', value: '\\' + value });
      continue;
    }

    if (value === CHAR_LEFT_SQUARE_BRACKET) {
      brackets++;

      let next;

      while (index < length && (next = advance())) {
        value += next;

        if (next === CHAR_LEFT_SQUARE_BRACKET) brackets++;
        else if (next === CHAR_BACKSLASH) value += advance();
        else if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          brackets--;

          if (brackets === 0) break;
        }
      }

      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_LEFT_PARENTHESES) {
      block = push({ type: 'paren', nodes: [] });
      stack.push(block);
      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_RIGHT_PARENTHESES) {
      if (block.type !== 'paren') {
        push({ type: 'text', value });
        continue;
      }
      block = stack.pop();
      push({ type: 'text', value });
      block = stack[stack.length - 1];
      continue;
    }

    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
      let next,
        open = value;

      if (options.keepQuotes !== true) value = '';

      while (index < length && (next = advance()))
        if (next === CHAR_BACKSLASH) value += next + advance();
        else {
          if (next === open) {
            if (options.keepQuotes === true) value += next;
            break;
          }

          value += next;
        }

      push({ type: 'text', value });
      continue;
    }

    if (value === CHAR_LEFT_CURLY_BRACE) {
      depth++;

      let dollar = (prev.value && prev.value.slice(-1) === '$') || block.dollar === true;
      block = push({
        type: 'brace',
        open: true,
        close: false,
        dollar,
        depth,
        commas: 0,
        ranges: 0,
        nodes: []
      });

      stack.push(block);
      push({ type: 'open', value });
      continue;
    }

    if (value === CHAR_RIGHT_CURLY_BRACE) {
      if (block.type !== 'brace') {
        push({ type: 'text', value });
        continue;
      }

      let type = 'close';
      block = stack.pop();
      block.close = true;

      push({ type, value });
      depth--;

      block = stack[stack.length - 1];
      continue;
    }

    if (value === CHAR_COMMA && depth > 0) {
      if (block.ranges > 0) {
        block.ranges = 0;
        let open = block.nodes.shift();
        block.nodes = [open, { type: 'text', value: stringify(block) }];
      }

      push({ type: 'comma', value });
      block.commas++;
      continue;
    }

    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
      let siblings = block.nodes;

      if (depth === 0 || siblings.length === 0) {
        push({ type: 'text', value });
        continue;
      }

      if (prev.type === 'dot') {
        block.range = [];
        prev.value += value;
        prev.type = 'range';

        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
          block.invalid = true;
          block.ranges = 0;
          prev.type = 'text';
          continue;
        }

        block.ranges++;
        block.args = [];
        continue;
      }

      if (prev.type === 'range') {
        siblings.pop();

        let before = siblings[siblings.length - 1];
        before.value += prev.value + value;
        prev = before;
        block.ranges--;
        continue;
      }

      push({ type: 'dot', value });
      continue;
    }

    push({ type: 'text', value });
  }

  do {
    block = stack.pop();

    if (block.type === 'root') continue;

    block.nodes.forEach(node => {
      if (node.nodes) return;

      if (node.type === 'open') node.isOpen = true;
      if (node.type === 'close') node.isClose = true;
      node.nodes || (node.type = 'text');
      node.invalid = true;
    });

    let parent = stack[stack.length - 1],
      index = parent.nodes.indexOf(block);
    parent.nodes.splice(index, 1, ...block.nodes);
  } while (stack.length > 0);

  push({ type: 'eos' });
  return ast;
};

},
// 24
function(module) {

module.exports = {
  MAX_LENGTH: 65536,

  CHAR_0: '0',
  CHAR_9: '9',

  CHAR_UPPERCASE_A: 'A',
  CHAR_LOWERCASE_A: 'a',
  CHAR_UPPERCASE_Z: 'Z',
  CHAR_LOWERCASE_Z: 'z',

  CHAR_LEFT_PARENTHESES: '(',
  CHAR_RIGHT_PARENTHESES: ')',

  CHAR_ASTERISK: '*',

  CHAR_AMPERSAND: '&',
  CHAR_AT: '@',
  CHAR_BACKSLASH: '\\',
  CHAR_BACKTICK: '`',
  CHAR_CARRIAGE_RETURN: '\r',
  CHAR_CIRCUMFLEX_ACCENT: '^',
  CHAR_COLON: ':',
  CHAR_COMMA: ',',
  CHAR_DOLLAR: '$',
  CHAR_DOT: '.',
  CHAR_DOUBLE_QUOTE: '"',
  CHAR_EQUAL: '=',
  CHAR_EXCLAMATION_MARK: '!',
  CHAR_FORM_FEED: '\f',
  CHAR_FORWARD_SLASH: '/',
  CHAR_HASH: '#',
  CHAR_HYPHEN_MINUS: '-',
  CHAR_LEFT_ANGLE_BRACKET: '<',
  CHAR_LEFT_CURLY_BRACE: '{',
  CHAR_LEFT_SQUARE_BRACKET: '[',
  CHAR_LINE_FEED: '\n',
  CHAR_NO_BREAK_SPACE: '\xA0',
  CHAR_PERCENT: '%',
  CHAR_PLUS: '+',
  CHAR_QUESTION_MARK: '?',
  CHAR_RIGHT_ANGLE_BRACKET: '>',
  CHAR_RIGHT_CURLY_BRACE: '}',
  CHAR_RIGHT_SQUARE_BRACKET: ']',
  CHAR_SEMICOLON: ';',
  CHAR_SINGLE_QUOTE: "'",
  CHAR_SPACE: ' ',
  CHAR_TAB: '\t',
  CHAR_UNDERSCORE: '_',
  CHAR_VERTICAL_LINE: '|',
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF'
};

},
// 25
function(module, exports, __webpack_require__) {

const fs = __webpack_require__(2),
  sysPath = __webpack_require__(0),
  { promisify } = __webpack_require__(1),
  isBinaryPath = __webpack_require__(26);
const {
  isWindows,
  isLinux,
  EMPTY_FN,
  EMPTY_STR,
  KEY_LISTENERS,
  KEY_ERR,
  KEY_RAW,
  HANDLER_KEYS,
  EV_CHANGE,
  EV_ADD,
  EV_ADD_DIR,
  EV_ERROR,
  STR_DATA,
  STR_END,
  BRACE_START,
  STAR
} = __webpack_require__(5);

const THROTTLE_MODE_WATCH = 'watch',

  open = promisify(fs.open),
  stat = promisify(fs.stat),
  lstat = promisify(fs.lstat),
  close = promisify(fs.close),
  fsrealpath = promisify(fs.realpath),

  statMethods = { lstat, stat };

const foreach = (val, fn) => {
  val instanceof Set ? val.forEach(fn) : fn(val);
};

const addAndConvert = (main, prop, item) => {
  let container = main[prop];
  container instanceof Set || (main[prop] = container = new Set([container]));

  container.add(item);
};

const clearItem = cont => key => {
  const set = cont[key];
  set instanceof Set ? set.clear() : delete cont[key];
};

const delFromSet = (main, prop, item) => {
  const container = main[prop];
  container instanceof Set ? container.delete(item) : container !== item || delete main[prop];
};

const isEmptySet = (val) => (val instanceof Set ? val.size === 0 : !val),

  FsWatchInstances = new Map();

function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
  const handleEvent = (rawEvent, evPath) => {
    listener(path);
    emitRaw(rawEvent, evPath, { watchedPath: path });

    evPath && path !== evPath &&
      fsWatchBroadcast(sysPath.resolve(path, evPath), KEY_LISTENERS, sysPath.join(path, evPath));
  };
  try {
    return fs.watch(path, options, handleEvent);
  } catch (error) {
    errHandler(error);
  }
}

const fsWatchBroadcast = (fullPath, type, val1, val2, val3) => {
  const cont = FsWatchInstances.get(fullPath);
  cont &&
    foreach(cont[type], (listener) => {
      listener(val1, val2, val3);
    });
};

const setFsWatchListener = (path, fullPath, options, handlers) => {
  const { listener, errHandler, rawEmitter } = handlers;
  let watcher,
    cont = FsWatchInstances.get(fullPath);

  if (!options.persistent) {
    watcher = createFsWatchInstance(path, options, listener, errHandler, rawEmitter);
    return watcher.close.bind(watcher);
  }
  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_ERR, errHandler);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    watcher = createFsWatchInstance(
      path,
      options,
      fsWatchBroadcast.bind(null, fullPath, KEY_LISTENERS),
      errHandler,
      fsWatchBroadcast.bind(null, fullPath, KEY_RAW)
    );
    if (!watcher) return;
    watcher.on(EV_ERROR, async (error) => {
      const broadcastErr = fsWatchBroadcast.bind(null, fullPath, KEY_ERR);
      cont.watcherUnusable = true;
      if (isWindows && error.code === 'EPERM')
        try {
          const fd = await open(path, 'r');
          await close(fd);
          broadcastErr(error);
        } catch (_) {}
      else broadcastErr(error);
    });
    cont = { listeners: listener, errHandlers: errHandler, rawEmitters: rawEmitter, watcher };
    FsWatchInstances.set(fullPath, cont);
  }

  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_ERR, errHandler);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      cont.watcher.close();
      FsWatchInstances.delete(fullPath);
      HANDLER_KEYS.forEach(clearItem(cont));
      cont.watcher = void 0;
      Object.freeze(cont);
    }
  };
};

const FsWatchFileInstances = new Map();

const setFsWatchFileListener = (path, fullPath, options, handlers) => {
  const { listener, rawEmitter } = handlers;
  let cont = FsWatchFileInstances.get(fullPath),

    listeners = new Set(),
    rawEmitters = new Set();

  const copts = cont && cont.options;
  if (copts && (copts.persistent < options.persistent || copts.interval > options.interval)) {
    listeners = cont.listeners;
    rawEmitters = cont.rawEmitters;
    fs.unwatchFile(fullPath);
    cont = void 0;
  }

  if (cont) {
    addAndConvert(cont, KEY_LISTENERS, listener);
    addAndConvert(cont, KEY_RAW, rawEmitter);
  } else {
    cont = {
      listeners: listener,
      rawEmitters: rawEmitter,
      options,
      watcher: fs.watchFile(fullPath, options, (curr, prev) => {
        foreach(cont.rawEmitters, (rawEmitter) => {
          rawEmitter(EV_CHANGE, fullPath, { curr, prev });
        });
        const currmtime = curr.mtimeMs;
        if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0)
          foreach(cont.listeners, (listener) => listener(path, curr));
      })
    };
    FsWatchFileInstances.set(fullPath, cont);
  }

  return () => {
    delFromSet(cont, KEY_LISTENERS, listener);
    delFromSet(cont, KEY_RAW, rawEmitter);
    if (isEmptySet(cont.listeners)) {
      FsWatchFileInstances.delete(fullPath);
      fs.unwatchFile(fullPath);
      cont.options = cont.watcher = void 0;
      Object.freeze(cont);
    }
  };
};

class NodeFsHandler {

constructor(fsW) {
  this.fsw = fsW;
  this._boundHandleError = (error) => fsW._handleError(error);
}

_watchWithNodeFs(path, listener) {
  const opts = this.fsw.options,
    directory = sysPath.dirname(path),
    basename = sysPath.basename(path);
  this.fsw._getWatchedDir(directory).add(basename);
  const absolutePath = sysPath.resolve(path),
    options = { persistent: opts.persistent };
  listener || (listener = EMPTY_FN);

  let closer;
  if (opts.usePolling) {
    options.interval =
      opts.enableBinaryInterval && isBinaryPath(basename) ? opts.binaryInterval : opts.interval;
    closer = setFsWatchFileListener(path, absolutePath, options, {
      listener,
      rawEmitter: this.fsw._emitRaw
    });
  } else
    closer = setFsWatchListener(path, absolutePath, options, {
      listener,
      errHandler: this._boundHandleError,
      rawEmitter: this.fsw._emitRaw
    });

  return closer;
}

_handleFile(file, stats, initialAdd) {
  if (this.fsw.closed) return;

  const dirname = sysPath.dirname(file),
    basename = sysPath.basename(file),
    parent = this.fsw._getWatchedDir(dirname);
  let prevStats = stats;

  if (parent.has(basename)) return;

  const listener = async (path, newStats) => {
    if (!this.fsw._throttle(THROTTLE_MODE_WATCH, file, 5)) return;
    if (!newStats || newStats.mtimeMs === 0)
      try {
        const newStats = await stat(file);
        if (this.fsw.closed) return;
        const at = newStats.atimeMs,
          mt = newStats.mtimeMs;
        (at && at > mt && mt === prevStats.mtimeMs) ||
          (await this.fsw._emit(EV_CHANGE, file, newStats));

        if (isLinux && prevStats.ino !== newStats.ino) {
          this.fsw._closeFile(path);
          prevStats = newStats;
          this.fsw._addPathCloser(path, this._watchWithNodeFs(file, listener));
        } else prevStats = newStats;
      } catch (_error) {
        this.fsw._remove(dirname, basename);
      }
    else if (parent.has(basename)) {
      const at = newStats.atimeMs,
        mt = newStats.mtimeMs;
      (at && at > mt && mt === prevStats.mtimeMs) ||
        (await this.fsw._emit(EV_CHANGE, file, newStats));

      prevStats = newStats;
    }
  };
  const closer = this._watchWithNodeFs(file, listener);

  if ((!initialAdd || !this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
    if (!this.fsw._throttle(EV_ADD, file, 0)) return;
    this.fsw._emit(EV_ADD, file, stats);
  }

  return closer;
}

async _handleSymlink(entry, directory, path, item) {
  if (this.fsw.closed) return;

  const full = entry.fullPath,
    dir = this.fsw._getWatchedDir(directory);

  if (!this.fsw.options.followSymlinks) {
    this.fsw._incrReadyCount();
    const linkPath = await fsrealpath(path);
    if (this.fsw.closed) return;
    if (dir.has(item)) {
      if (this.fsw._symlinkPaths.get(full) !== linkPath) {
        this.fsw._symlinkPaths.set(full, linkPath);
        await this.fsw._emit(EV_CHANGE, path, entry.stats);
      }
    } else {
      dir.add(item);
      this.fsw._symlinkPaths.set(full, linkPath);
      await this.fsw._emit(EV_ADD, path, entry.stats);
    }
    this.fsw._emitReady();
    return true;
  }

  if (this.fsw._symlinkPaths.has(full)) return true;

  this.fsw._symlinkPaths.set(full, true);
}

_handleRead(directory, initialAdd, wh, target, dir, depth, throttler) {
  directory = sysPath.join(directory, EMPTY_STR);

  if (!wh.hasGlob && !(throttler = this.fsw._throttle('readdir', directory, 1000))) return;

  const previous = this.fsw._getWatchedDir(wh.path),
    current = new Set();

  let stream = this.fsw._readdirp(directory, {
    fileFilter: entry => wh.filterPath(entry),
    directoryFilter: entry => wh.filterDir(entry),
    depth: 0
  }).on(STR_DATA, async (entry) => {
    if (this.fsw.closed) {
      stream = void 0;
      return;
    }
    const item = entry.path;
    let path = sysPath.join(directory, item);
    current.add(item);

    if (entry.stats.isSymbolicLink() && (await this._handleSymlink(entry, directory, path, item)))
      return;

    if (this.fsw.closed) {
      stream = void 0;
      return;
    }
    if (item === target || (!target && !previous.has(item))) {
      this.fsw._incrReadyCount();

      path = sysPath.join(dir, sysPath.relative(dir, path));

      await this._addToNodeFs(path, initialAdd, wh, depth + 1);
    }
  }).on(EV_ERROR, this._boundHandleError);

  return new Promise(resolve =>
    stream.once(STR_END, () => {
      if (this.fsw.closed) {
        stream = void 0;
        return;
      }
      const wasThrottled = !!throttler && throttler.clear();

      resolve();

      previous.getChildren().filter((item) =>
        item !== directory &&
        !current.has(item) &&
        (!wh.hasGlob || wh.filterPath({ fullPath: sysPath.resolve(directory, item) }))
      ).forEach((item) => {
        this.fsw._remove(directory, item);
      });

      stream = void 0;

      wasThrottled && this._handleRead(directory, false, wh, target, dir, depth, throttler);
    })
  );
}

async _handleDir(dir, stats, initialAdd, depth, target, wh, realpath) {
  const parentDir = this.fsw._getWatchedDir(sysPath.dirname(dir)),
    tracked = parentDir.has(sysPath.basename(dir));
  (initialAdd && this.fsw.options.ignoreInitial) || target || tracked ||
    (wh.hasGlob && !wh.globFilter(dir)) ||
    (await this.fsw._emit(EV_ADD_DIR, dir, stats));

  parentDir.add(sysPath.basename(dir));
  this.fsw._getWatchedDir(dir);
  let throttler, closer;

  const oDepth = this.fsw.options.depth;
  if ((oDepth == null || depth <= oDepth) && !this.fsw._symlinkPaths.has(realpath)) {
    if (!target) {
      await this._handleRead(dir, initialAdd, wh, target, dir, depth, throttler);
      if (this.fsw.closed) return;
    }

    closer = this._watchWithNodeFs(dir, (dirPath, stats) => {
      if (stats && stats.mtimeMs === 0) return;

      this._handleRead(dirPath, false, wh, target, dir, depth, throttler);
    });
  }
  return closer;
}

async _addToNodeFs(path, initialAdd, priorWh, depth, target) {
  const ready = this.fsw._emitReady;
  if (this.fsw._isIgnored(path) || this.fsw.closed) {
    ready();
    return false;
  }

  const wh = this.fsw._getWatchHelpers(path, depth);
  if (!wh.hasGlob && priorWh) {
    wh.hasGlob = priorWh.hasGlob;
    wh.globFilter = priorWh.globFilter;
    wh.filterPath = entry => priorWh.filterPath(entry);
    wh.filterDir = entry => priorWh.filterDir(entry);
  }

  try {
    const /** @type {Stats} */ stats = await statMethods[wh.statMethod](wh.watchPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(wh.watchPath, stats)) {
      ready();
      return false;
    }

    const follow =
      this.fsw.options.followSymlinks && !path.includes(STAR) && !path.includes(BRACE_START);
    let closer;
    if (stats.isDirectory()) {
      const targetPath = follow ? await fsrealpath(path) : path;
      if (this.fsw.closed) return;
      closer = await this._handleDir(wh.watchPath, stats, initialAdd, depth, target, wh, targetPath);
      if (this.fsw.closed) return;
      path === targetPath || targetPath === void 0 || this.fsw._symlinkPaths.set(targetPath, true);
    } else if (stats.isSymbolicLink()) {
      const targetPath = follow ? await fsrealpath(path) : path;
      if (this.fsw.closed) return;
      const parent = sysPath.dirname(wh.watchPath);
      this.fsw._getWatchedDir(parent).add(wh.watchPath);
      await this.fsw._emit(EV_ADD, wh.watchPath, stats);
      closer = await this._handleDir(parent, stats, initialAdd, depth, path, wh, targetPath);
      if (this.fsw.closed) return;

      targetPath === void 0 || this.fsw._symlinkPaths.set(sysPath.resolve(path), targetPath);
    } else closer = this._handleFile(wh.watchPath, stats, initialAdd);

    ready();

    this.fsw._addPathCloser(path, closer);
    return false;
  } catch (error) {
    if (this.fsw._handleError(error)) {
      ready();
      return path;
    }
  }
}

}

module.exports = NodeFsHandler;

},
// 26
function(module, exports, __webpack_require__) {

const path = __webpack_require__(0),
  binaryExtensions = __webpack_require__(27),

  extensions = new Set(binaryExtensions);

module.exports = filePath => extensions.has(path.extname(filePath).slice(1).toLowerCase());

},
// 27
function(module) {

module.exports = JSON.parse(
  '["3dm","3ds","3g2","3gp","7z","a","aac","adp","ai","aif","aiff","alz","ape","apk","appimage","ar","arj","asf","au","avi","bak","baml","bh","bin","bk","bmp","btif","bz2","bzip2","cab","caf","cgm","class","cmx","cpio","cr2","cur","dat","dcm","deb","dex","djvu","dll","dmg","dng","doc","docm","docx","dot","dotm","dra","DS_Store","dsk","dts","dtshd","dvb","dwg","dxf","ecelp4800","ecelp7470","ecelp9600","egg","eol","eot","epub","exe","f4v","fbs","fh","fla","flac","flatpak","fli","flv","fpx","fst","fvt","g3","gh","gif","graffle","gz","gzip","h261","h263","h264","icns","ico","ief","img","ipa","iso","jar","jpeg","jpg","jpgv","jpm","jxr","key","ktx","lha","lib","lvp","lz","lzh","lzma","lzo","m3u","m4a","m4v","mar","mdi","mht","mid","midi","mj2","mka","mkv","mmr","mng","mobi","mov","movie","mp3","mp4","mp4a","mpeg","mpg","mpga","mxu","nef","npx","numbers","nupkg","o","odp","ods","odt","oga","ogg","ogv","otf","ott","pages","pbm","pcx","pdb","pdf","pea","pgm","pic","png","pnm","pot","potm","potx","ppa","ppam","ppm","pps","ppsm","ppsx","ppt","pptm","pptx","psd","pya","pyc","pyo","pyv","qt","rar","ras","raw","resources","rgb","rip","rlc","rmf","rmvb","rpm","rtf","rz","s3m","s7z","scpt","sgi","shar","snap","sil","sketch","slk","smv","snk","so","stl","suo","sub","swf","tar","tbz","tbz2","tga","tgz","thmx","tif","tiff","tlz","ttc","ttf","txz","udf","uvh","uvi","uvm","uvp","uvs","uvu","viv","vob","war","wav","wax","wbmp","wdp","weba","webm","webp","whl","wim","wm","wma","wmv","wmx","woff","woff2","wrm","wvx","xbm","xif","xla","xlam","xls","xlsb","xlsm","xlsx","xlt","xltm","xltx","xm","xmind","xpi","xpm","xwd","xz","z","zip","zipx"]'
);

},
// 28
function(module, exports, __webpack_require__) {

const fs = __webpack_require__(2),
  sysPath = __webpack_require__(0),
  { promisify } = __webpack_require__(1);

/** @type {Object.<string, *>} */ let fsevents;
try {
  fsevents = __webpack_require__(29);
} catch (error) {
  process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR && console.error(error);
}

if (fsevents && /^v?([0-7]\.|8\.(\d|1[0-5])\b)/.test(process.version)) // < v8.16
  fsevents = void 0;

const {
  EV_ADD,
  EV_CHANGE,
  EV_ADD_DIR,
  EV_UNLINK,
  EV_ERROR,
  STR_DATA,
  STR_END,
  FSEVENT_CREATED,
  FSEVENT_MODIFIED,
  FSEVENT_DELETED,
  FSEVENT_MOVED,
  FSEVENT_UNKNOWN,
  FSEVENT_TYPE_FILE,
  FSEVENT_TYPE_DIRECTORY,
  FSEVENT_TYPE_SYMLINK,

  ROOT_GLOBSTAR,
  DIR_SUFFIX,
  DOT_SLASH,
  FUNCTION_TYPE,
  EMPTY_FN,
  IDENTITY_FN
} = __webpack_require__(5);

const Depth = (value) => (isNaN(value) ? {} : { depth: value }),

  stat = promisify(fs.stat),
  lstat = promisify(fs.lstat),
  realpath = promisify(fs.realpath),

  statMethods = { stat, lstat },

  FSEventsWatchers = new Map(),

  consolidateThreshold = 10,

  wrongEventFlags = new Set([69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912]),

  createFSEventsInstance = (path, callback) => ({ stop: fsevents.watch(path, callback) });

function setFSEventsListener(path, realPath, listener, rawEmitter) {
  let watchPath = sysPath.extname(path) ? sysPath.dirname(path) : path;
  const parentPath = sysPath.dirname(watchPath);
  let cont = FSEventsWatchers.get(watchPath);

  if (couldConsolidate(parentPath)) watchPath = parentPath;

  const resolvedPath = sysPath.resolve(path),
    hasSymlink = resolvedPath !== realPath;

  const filteredListener = (fullPath, flags, info) => {
    if (hasSymlink) fullPath = fullPath.replace(realPath, resolvedPath);
    (fullPath !== resolvedPath && fullPath.indexOf(resolvedPath + sysPath.sep)) ||
      listener(fullPath, flags, info);
  };

  let watchedParent = false;
  for (const watchedPath of FSEventsWatchers.keys())
    if (realPath.indexOf(sysPath.resolve(watchedPath) + sysPath.sep) === 0) {
      watchPath = watchedPath;
      cont = FSEventsWatchers.get(watchPath);
      watchedParent = true;
      break;
    }

  if (cont || watchedParent) cont.listeners.add(filteredListener);
  else {
    cont = {
      listeners: new Set([filteredListener]),
      rawEmitter,
      watcher: createFSEventsInstance(watchPath, (fullPath, flags) => {
        if (!cont.listeners.size) return;
        const info = fsevents.getInfo(fullPath, flags);
        cont.listeners.forEach(list => {
          list(fullPath, flags, info);
        });

        cont.rawEmitter(info.event, fullPath, info);
      })
    };
    FSEventsWatchers.set(watchPath, cont);
  }

  return () => {
    const lst = cont.listeners;

    lst.delete(filteredListener);
    if (!lst.size) {
      FSEventsWatchers.delete(watchPath);
      if (cont.watcher) return cont.watcher.stop().then(() => {
        cont.rawEmitter = cont.watcher = void 0;
        Object.freeze(cont);
      });
    }
  };
}

const couldConsolidate = (path) => {
  let count = 0;
  for (const watchPath of FSEventsWatchers.keys())
    if (watchPath.indexOf(path) === 0) {
      count++;
      if (count >= consolidateThreshold) return true;
    }

  return false;
};

const canUse = () => fsevents && FSEventsWatchers.size < 128;

const calcDepth = (path, root) => {
  let i = 0;
  while (!path.indexOf(root) && (path = sysPath.dirname(path)) !== root) i++;
  return i;
};

const sameTypes = (info, stats) =>
  (info.type === FSEVENT_TYPE_DIRECTORY && stats.isDirectory()) ||
  (info.type === FSEVENT_TYPE_SYMLINK && stats.isSymbolicLink()) ||
  (info.type === FSEVENT_TYPE_FILE && stats.isFile());

class FsEventsHandler {

constructor(fsw) {
  this.fsw = fsw;
}
checkIgnored(path, stats) {
  const ipaths = this.fsw._ignoredPaths;
  if (this.fsw._isIgnored(path, stats)) {
    ipaths.add(path);
    stats && stats.isDirectory() && ipaths.add(path + ROOT_GLOBSTAR);

    return true;
  }

  ipaths.delete(path);
  ipaths.delete(path + ROOT_GLOBSTAR);
}

addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  const event = watchedDir.has(item) ? EV_CHANGE : EV_ADD;
  this.handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts);
}

async checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  try {
    const stats = await stat(path);
    if (this.fsw.closed) return;
    sameTypes(info, stats)
      ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts)
      : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
  } catch (error) {
    error.code === 'EACCES'
      ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts)
      : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
  }
}

handleEvent(event, path, fullPath, realPath, parent, watchedDir, item, info, opts) {
  if (this.fsw.closed || this.checkIgnored(path)) return;

  if (event === EV_UNLINK) {
    const isDirectory = info.type === FSEVENT_TYPE_DIRECTORY;
    if (isDirectory || watchedDir.has(item)) this.fsw._remove(parent, item, isDirectory);
  } else {
    if (event === EV_ADD) {
      info.type !== FSEVENT_TYPE_DIRECTORY || this.fsw._getWatchedDir(path);

      if (info.type === FSEVENT_TYPE_SYMLINK && opts.followSymlinks) {
        const curDepth = opts.depth === void 0 ? void 0 : calcDepth(fullPath, realPath) + 1;
        return this._addToFsEvents(path, false, true, curDepth);
      }

      this.fsw._getWatchedDir(parent).add(item);
    }
    const eventName = info.type === FSEVENT_TYPE_DIRECTORY ? event + DIR_SUFFIX : event;
    this.fsw._emit(eventName, path);
    eventName !== EV_ADD_DIR || this._addToFsEvents(path, false, true);
  }
}

_watchWithFsEvents(watchPath, realPath, transform, globFilter) {
  if (this.fsw.closed || this.fsw._isIgnored(watchPath)) return;
  const opts = this.fsw.options;

  const closer = setFSEventsListener(watchPath, realPath, async (fullPath, flags, info) => {
    if (this.fsw.closed || (opts.depth !== void 0 && calcDepth(fullPath, realPath) > opts.depth))
      return;
    const path = transform(sysPath.join(watchPath, sysPath.relative(watchPath, fullPath)));
    if (globFilter && !globFilter(path)) return;
    const parent = sysPath.dirname(path),
      item = sysPath.basename(path),
      watchedDir = this.fsw._getWatchedDir(
        info.type === FSEVENT_TYPE_DIRECTORY ? path : parent
      );

    if (wrongEventFlags.has(flags) || info.event === FSEVENT_UNKNOWN)
      if (typeof opts.ignored === FUNCTION_TYPE) {
        let stats;
        try {
          stats = await stat(path);
        } catch (_) {}
        if (this.fsw.closed || this.checkIgnored(path, stats)) return;
        sameTypes(info, stats)
          ? this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts)
          : this.handleEvent(EV_UNLINK, path, fullPath, realPath, parent, watchedDir, item, info, opts);
      } else await this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts);
    else
      switch (info.event) {
      case FSEVENT_CREATED:
      case FSEVENT_MODIFIED:
        return this.addOrChange(path, fullPath, realPath, parent, watchedDir, item, info, opts);
      case FSEVENT_DELETED:
      case FSEVENT_MOVED:
        return this.checkExists(path, fullPath, realPath, parent, watchedDir, item, info, opts);
      }
  }, this.fsw._emitRaw);

  this.fsw._emitReady();
  return closer;
}

async _handleFsEventsSymlink(linkPath, fullPath, transform, curDepth) {
  if (this.fsw.closed || this.fsw._symlinkPaths.has(fullPath)) return;

  this.fsw._symlinkPaths.set(fullPath, true);
  this.fsw._incrReadyCount();

  try {
    const linkTarget = await realpath(linkPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(linkTarget)) return this.fsw._emitReady();

    this.fsw._incrReadyCount();

    await this._addToFsEvents(linkTarget || linkPath, (path) => {
      let aliasedPath =
        linkTarget && linkTarget !== DOT_SLASH
        ? path.replace(linkTarget, linkPath)
        : path !== DOT_SLASH
        ? sysPath.join(linkPath, path)
        : linkPath;
      return transform(aliasedPath);
    }, false, curDepth);
  } catch (error) {
    if (this.fsw._handleError(error)) return this.fsw._emitReady();
  }
}

emitAdd(newPath, stats, processPath, opts, forceAdd) {
  const pp = processPath(newPath),
    isDir = stats.isDirectory(),
    dirObj = this.fsw._getWatchedDir(sysPath.dirname(pp)),
    base = sysPath.basename(pp);

  isDir && this.fsw._getWatchedDir(pp);
  if (dirObj.has(base)) return;
  dirObj.add(base);

  (opts.ignoreInitial && forceAdd !== true) ||
    this.fsw._emit(isDir ? EV_ADD_DIR : EV_ADD, pp, stats);
}

initWatch(realPath, path, wh, processPath) {
  if (this.fsw.closed) return;
  const closer = this._watchWithFsEvents(
    wh.watchPath,
    sysPath.resolve(realPath || wh.watchPath),
    processPath,
    wh.globFilter
  );
  this.fsw._addPathCloser(path, closer);
}

async _addToFsEvents(path, transform, forceAdd, priorDepth) {
  if (this.fsw.closed) return;

  const opts = this.fsw.options,
    processPath = typeof transform === FUNCTION_TYPE ? transform : IDENTITY_FN,

    wh = this.fsw._getWatchHelpers(path);

  try {
    const /** @type {Stats} */ stats = await statMethods[wh.statMethod](wh.watchPath);
    if (this.fsw.closed) return;
    if (this.fsw._isIgnored(wh.watchPath, stats)) throw null;

    if (stats.isDirectory()) {
      wh.globFilter || this.emitAdd(processPath(path), stats, processPath, opts, forceAdd);

      if (priorDepth && priorDepth > opts.depth) return;

      this.fsw._readdirp(wh.watchPath, {
        fileFilter: entry => wh.filterPath(entry),
        directoryFilter: entry => wh.filterDir(entry),
        ...Depth(opts.depth - (priorDepth || 0))
      }).on(STR_DATA, (entry) => {
        if (this.fsw.closed || (entry.stats.isDirectory() && !wh.filterPath(entry))) return;

        const joinedPath = sysPath.join(wh.watchPath, entry.path),
          { fullPath } = entry;

        if (wh.followSymlinks && entry.stats.isSymbolicLink()) {
          const curDepth = opts.depth === void 0
            ? void 0 : calcDepth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;

          this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
        } else this.emitAdd(joinedPath, entry.stats, processPath, opts, forceAdd);
      }).on(EV_ERROR, EMPTY_FN).on(STR_END, () => {
        this.fsw._emitReady();
      });
    } else {
      this.emitAdd(wh.watchPath, stats, processPath, opts, forceAdd);
      this.fsw._emitReady();
    }
  } catch (error) {
    if (!error || this.fsw._handleError(error)) {
      this.fsw._emitReady();
      this.fsw._emitReady();
    }
  }

  if (opts.persistent && forceAdd !== true)
    if (typeof transform === FUNCTION_TYPE) this.initWatch(void 0, path, wh, processPath);
    else {
      let realPath;
      try {
        realPath = await realpath(wh.watchPath);
      } catch (_) {}
      this.initWatch(realPath, path, wh, processPath);
    }
}

}

module.exports = FsEventsHandler;
module.exports.canUse = canUse;

},
// 29
function(module) {

// noinspection NpmUsedModulesInstalled
module.exports = require('fsevents');

}
]);

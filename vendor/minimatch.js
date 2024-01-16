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
  return __webpack_require__(0);
})([
// 0
function (module, exports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __webpack_require__(1) } catch (_) {} })() || { sep: '/' }
minimatch.sep = path.sep

var GLOBSTAR = (minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}),
  expand = __webpack_require__(2)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)' },
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

var qmark = '[^/]',
  star = qmark + '*?',

  twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?',
  twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?',

  reSpecials = charSet('().*{}+?[]^$\\!')

function charSet(s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

var slashSplit = /\/+/

minimatch.filter = filter
function filter(pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext(a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def != 'object' || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch(p, pattern, options) {
  assertValidPattern(pattern)

  options || (options = {})

  return !(!options.nocomment && pattern.charAt(0) === '#') &&
    new Minimatch(pattern, options).match(p)
}

function Minimatch(pattern, options) {
  if (!(this instanceof Minimatch)) return new Minimatch(pattern, options)

  assertValidPattern(pattern)

  options || (options = {})

  pattern = pattern.trim()

  options.allowWindowsEscape || path.sep === '/' ||
    (pattern = pattern.split(path.sep).join('/'))

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make() {
  var pattern = this.pattern,
    options = this.options

  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  this.parseNegate()

  var set = (this.globSet = this.braceExpand())

  if (options.debug) this.debug = function () { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate() {
  var pattern = this.pattern,
    negate = false,
    negateOffset = 0

  if (this.options.nonegate) return

  for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand(pattern, options) {
  options || (options = this instanceof Minimatch ? this.options : {})

  pattern = pattern === void 0 ? this.pattern : pattern

  assertValidPattern(pattern)

  return options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern) ? [pattern] : expand(pattern)
}

var MAX_PATTERN_LENGTH = 65536
var assertValidPattern = function (pattern) {
  if (typeof pattern != 'string') throw new TypeError('invalid pattern')

  if (pattern.length > MAX_PATTERN_LENGTH) throw new TypeError('pattern is too long')
}

Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse(pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  if (pattern === '**') {
    if (!options.noglobstar) return GLOBSTAR

    pattern = '*'
  }
  if (pattern === '') return ''

  var stateChar,
    re = '',
    hasMagic = !!options.nocase,
    escaping = false,
    patternListStack = [],
    negativeLists = [],
    inClass = false,
    reClassStart = -1,
    classStart = -1
  var patternStart =
    pattern.charAt(0) === '.' ? '' : options.dot ? '(?!(?:^|\\/)\\.{1,2}(?:$|\\/))' : '(?!\\.)'
  var self = this

  function clearStateChar() {
    if (stateChar) {
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
          break
        case '?':
          re += qmark
          hasMagic = true
          break
        default:
          re += '\\' + stateChar
          break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var c, i = 0, len = pattern.length; i < len && (c = pattern.charAt(i)); i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        return false

      case '\\':
        clearStateChar()
        escaping = true
        continue

      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        options.noext && clearStateChar()
        continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }
        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
        continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        re += pl.close
        pl.type !== '!' || negativeLists.push(pl)

        pl.reEnd = re.length
        continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
        continue

      case '[':
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
        continue

      case ']':
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (_er) {
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        hasMagic = true
        inClass = false
        re += c
        continue

      default:
        clearStateChar()

        escaping ? (escaping = false)
          : !reSpecials[c] || (c === '^' && inClass) || (re += '\\')

        re += c
    }
  }

  if (inClass) {
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      $2 || ($2 = '\\')

      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star : pl.type === '?' ? qmark : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  clearStateChar()
  if (escaping) re += '\\\\'

  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n],

      nlBefore = re.slice(0, nl.reStart),
      nlFirst = re.slice(nl.reStart, nl.reEnd - 8),
      nlLast = re.slice(nl.reEnd - 8, nl.reEnd),
      nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    var openParensBefore = nlBefore.split('(').length - 1,
      cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')

    var dollar = ''
    if ((nlAfter = cleanAfter) === '' && isSub !== SUBPARSE) dollar = '$'

    re = nlBefore + nlFirst + nlAfter + dollar + nlLast
  }

  if (re !== '' && hasMagic) re = '(?=.)' + re

  if (addPatternStart) re = patternStart + re

  if (isSub === SUBPARSE) return [re, hasMagic]

  if (!hasMagic) return globUnescape(pattern)

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (_) {
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe() {
  if (this.regexp || this.regexp === false) return this.regexp

  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options,

    twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot,
    flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return p === GLOBSTAR ? twoStar : typeof p == 'string' ? regExpEscape(p) : p._src
    }).join('\\/')
  }).join('|')

  re = '^(?:' + re + ')$'

  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (_) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  var mm = new Minimatch(pattern, (options = options || {}))
  list = list.filter(function (f) {
    return mm.match(f)
  })
  !mm.options.nonull || list.length || list.push(pattern)

  return list
}

Minimatch.prototype.match = function (f, partial) {
  if (partial === void 0) partial = this.partial
  this.debug('match', f, this.pattern)
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  if (path.sep !== '/') f = f.split(path.sep).join('/')

  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  var filename, i,
    set = this.set
  this.debug(this.pattern, 'set', set)

  for (i = f.length - 1; i >= 0 && !(filename = f[i]); i--);

  for (i = 0; i < set.length; i++) {
    var pattern = set[i],
      file = f
    if (options.matchBase && pattern.length === 1) file = [filename]

    if (this.matchOne(file, pattern, partial)) return !!options.flipNegate || !this.negate
  }

  return !options.flipNegate && this.negate
}

Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne', { this: this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (
    var fi = 0, pi = 0, fl = file.length, pl = pattern.length;
    fi < fl && pi < pl;
    fi++, pi++
  ) {
    this.debug('matchOne loop')
    var hit,
      p = pattern[pi],
      f = file[fi]

    this.debug(pattern, p, f)

    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      var fr = fi,
        pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        for (; fi < fl; fi++)
          if (file[fi] === '.' || file[fi] === '..' ||
              (!options.dot && file[fi].charAt(0) === '.')) return false

        return true
      }

      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          return true
        }
        if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
          this.debug('dot detected!', file, fr, pattern, pr)
          break
        }

        this.debug('globstar swallow a segment, and continue')
        fr++
      }

      if (partial) {
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    if (typeof p == 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  if (fi === fl && pi === pl) return true
  if (fi === fl) return partial
  if (pi === pl) return fi === fl - 1 && file[fi] === ''

  throw new Error('wtf?')
}

function globUnescape(s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape(s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

},
// 1
function (module) {

module.exports = require('path');

},
// 2
function (module, exports, __webpack_require__) {

var concatMap = __webpack_require__(3),
  balanced = __webpack_require__(4);

module.exports = expandTop;

var escSlash = '\0SLASH' + Math.random() + '\0',
  escOpen = '\0OPEN' + Math.random() + '\0',
  escClose = '\0CLOSE' + Math.random() + '\0',
  escComma = '\0COMMA' + Math.random() + '\0',
  escPeriod = '\0PERIOD' + Math.random() + '\0';

function numeric(str) {
  return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
    .split('\\{').join(escOpen)
    .split('\\}').join(escClose)
    .split('\\,').join(escComma)
    .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
    .split(escOpen).join('{')
    .split(escClose).join('}')
    .split(escComma).join(',')
    .split(escPeriod).join('.');
}

function parseCommaParts(str) {
  if (!str) return [''];

  var parts = [],
    m = balanced('{', '}', str);

  if (!m) return str.split(',');

  var pre = m.pre,
    body = m.body,
    post = m.post,
    p = pre.split(',');

  p[p.length - 1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length - 1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str) return [];

  if (str.substr(0, 2) === '{}') str = '\\{\\}' + str.substr(2);

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [],

    m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var n,
    isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body),
    isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body),
    isSequence = isNumericSequence || isAlphaSequence,
    isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions)
    return m.post.match(/,.*\}/)
      ? expand((str = m.pre + '{' + m.body + escClose + m.post)) // redundant
      : [str];

  if (isSequence) n = m.body.split(/\.\./);
  else if ((n = parseCommaParts(m.body)).length === 1 &&
      (n = expand(n[0], false).map(embrace)).length === 1)
    return (post = m.post.length ? expand(m.post, false) : ['']).map(function (p) {
      return m.pre + n[0] + p;
    });

  var N,

    pre = m.pre,
    post = m.post.length ? expand(m.post, false) : [''];

  if (isSequence) {
    var x = numeric(n[0]),
      y = numeric(n[1]),
      width = Math.max(n[0].length, n[1].length),
      incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1,
      test = lte;
    if (y < x) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) (c = String.fromCharCode(i)) !== '\\' || (c = '');
      else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            c = i < 0 ? '-' + z + c.slice(1) : z + c;
          }
        }
      }
      N.push(c);
    }
  } else N = concatMap(n, function (el) { return expand(el, false); });

  for (var j = 0; j < N.length; j++)
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion) expansions.push(expansion);
    }

  return expansions;
}

},
// 3
function (module) {

module.exports = function (xs, fn) {
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    var x = fn(xs[i], i);
    isArray(x) ? res.push.apply(res, x) : res.push(x);
  }
  return res;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},
// 4
function (module) {

'use strict';

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a),
    bi = str.indexOf(b, ai + 1),
    i = ai;

  if (ai >= 0 && bi > 0) {
    if (a === b) return [ai, bi];

    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) result = [begs.pop(), bi];
      else {
        if ((beg = begs.pop()) < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) result = [left, right];
  }

  return result;
}

}
]);

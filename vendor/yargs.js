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
  return __webpack_require__(14);
})([
// 0
function (module) {

module.exports = require('path');

},
// 1
function (module) {

module.exports = require('fs');

},
// 2
function (module) {

function YError(msg) {
  this.name = 'YError'
  this.message = msg || 'yargs error'
  Error.captureStackTrace(this, YError)
}

YError.prototype = Object.create(Error.prototype)
YError.prototype.constructor = YError

module.exports = YError

},
// 3
function (module, exports, __webpack_require__) {

module.exports = argsert
const command = __webpack_require__(8)(),
  YError = __webpack_require__(2),

  positionName = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
function argsert(expected, callerArguments, length) {
  try {
    let position = 0,
      parsed = {demanded: [], optional: []}
    if (typeof expected == 'object') {
      length = callerArguments
      callerArguments = expected
    } else parsed = command.parseCommand('cmd ' + expected)

    const args = [].slice.call(callerArguments)

    while (args.length && args[args.length - 1] === void 0) args.pop()

    if ((length = length || args.length) < parsed.demanded.length)
      throw new YError(
        `Not enough arguments provided. Expected ${parsed.demanded.length} but received ${args.length}.`
      )

    const totalCommands = parsed.demanded.length + parsed.optional.length
    if (length > totalCommands)
      throw new YError(`Too many arguments provided. Expected max ${totalCommands} but received ${length}.`)

    parsed.demanded.forEach((demanded) => {
      const observedType = guessType(args.shift())
      demanded.cmd.filter(type => type === observedType || type === '*').length > 0 ||
        argumentTypeError(observedType, demanded.cmd, position, false)
      position += 1
    })

    parsed.optional.forEach((optional) => {
      if (args.length === 0) return
      const observedType = guessType(args.shift())
      optional.cmd.filter(type => type === observedType || type === '*').length > 0 ||
        argumentTypeError(observedType, optional.cmd, position, true)
      position += 1
    })
  } catch (err) {
    console.warn(err.stack)
  }
}

function guessType(arg) {
  return Array.isArray(arg) ? 'array' : arg === null ? 'null' : typeof arg
}

function argumentTypeError(observedType, allowedTypes, position, optional) {
  throw new YError(
    `Invalid ${positionName[position] || 'manyith'} argument. Expected ${allowedTypes.join(' or ')} but received ${observedType}.`
  )
}

},
// 4
function (module) {

module.exports = require('util');

},
// 5
function (module, exports, __webpack_require__) {

const stripAnsi = __webpack_require__(6),
	isFullwidthCodePoint = __webpack_require__(26),
	emojiRegex = __webpack_require__(27)();

module.exports = input => {
	if (typeof (input = input.replace(emojiRegex, '  ')) != 'string' || input.length === 0)
		return 0;

	input = stripAnsi(input);

	let width = 0;

	for (let i = 0; i < input.length; i++) {
		const code = input.codePointAt(i);

		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F) || (code >= 0x300 && code <= 0x36F))
			continue;

		code > 0xFFFF && i++;

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

},
// 6
function (module, exports, __webpack_require__) {

const ansiRegex = __webpack_require__(25),

  stripAnsi = string => (typeof string == 'string' ? string.replace(ansiRegex(), '') : string);

module.exports = stripAnsi;
module.exports.default = stripAnsi;

},
// 7
function (module) {

module.exports = function (original, filter) {
  const obj = {}
  filter || (filter = (_k, _v) => true)
  Object.keys(original || {}).forEach((key) => {
    if (filter(key, original[key])) obj[key] = original[key]
  })
  return obj
}

},
// 8
function (module, exports, __webpack_require__) {

const inspect = __webpack_require__(4).inspect,
  isPromise = __webpack_require__(9),
  {applyMiddleware, commandMiddlewareFactory} = __webpack_require__(10),
  path = __webpack_require__(0),
  Parser = __webpack_require__(11),

  DEFAULT_MARKER = /(^\*)|(^\$0)/

module.exports = function (yargs, usage, validation, globalMiddleware) {
  const self = {}
  let defaultCommand,
    handlers = {},
    aliasMap = {}
  globalMiddleware = globalMiddleware || []

  self.addHandler = function (cmd, description, builder, handler, commandMiddleware) {
    let aliases = []
    const middlewares = commandMiddlewareFactory(commandMiddleware)
    handler = handler || (() => {})

    if (Array.isArray(cmd)) {
      aliases = cmd.slice(1)
      cmd = cmd[0]
    } else if (typeof cmd == 'object') {
      let command = Array.isArray(cmd.command) || typeof cmd.command == 'string' ? cmd.command : moduleName(cmd)
      if (cmd.aliases) command = [].concat(command).concat(cmd.aliases)
      self.addHandler(command, extractDesc(cmd), cmd.builder, cmd.handler, cmd.middlewares)
      return
    }

    if (typeof builder == 'object' && builder.builder && typeof builder.handler == 'function') {
      self.addHandler([cmd].concat(aliases), description, builder.builder, builder.handler, builder.middlewares)
      return
    }

    const parsedCommand = self.parseCommand(cmd)

    aliases = aliases.map(alias => self.parseCommand(alias).cmd)

    let isDefault = false
    const parsedAliases = [parsedCommand.cmd].concat(aliases).filter((c) => {
      if (!DEFAULT_MARKER.test(c)) return true

      isDefault = true
      return false
    })

    parsedAliases.length > 0 || !isDefault || parsedAliases.push('$0')

    if (isDefault) {
      parsedCommand.cmd = parsedAliases[0]
      aliases = parsedAliases.slice(1)
      cmd = cmd.replace(DEFAULT_MARKER, parsedCommand.cmd)
    }

    aliases.forEach((alias) => {
      aliasMap[alias] = parsedCommand.cmd
    })

    description === false || usage.command(cmd, description, isDefault, aliases)

    handlers[parsedCommand.cmd] = {
      original: cmd,
      description: description,
      handler,
      builder: builder || {},
      middlewares: middlewares || [],
      demanded: parsedCommand.demanded,
      optional: parsedCommand.optional
    }

    if (isDefault) defaultCommand = handlers[parsedCommand.cmd]
  }

  self.addDirectory = function (dir, context, req, callerFile, opts) {
    if (typeof (opts = opts || {}).recurse != 'boolean') opts.recurse = false
    Array.isArray(opts.extensions) || (opts.extensions = ['js'])
    const parentVisit = typeof opts.visit == 'function' ? opts.visit : o => o
    opts.visit = function (obj, joined, filename) {
      const visited = parentVisit(obj, joined, filename)
      if (visited) {
        if (~context.files.indexOf(joined)) return visited
        context.files.push(joined)
        self.addHandler(visited)
      }
      return visited
    }
    __webpack_require__(19)({require: req, filename: callerFile}, dir, opts)
  }

  function moduleName(obj) {
    const mod = __webpack_require__(20)(obj)
    if (!mod) throw new Error('No command name given for module: ' + inspect(obj))
    return commandFromFilename(mod.filename)
  }

  function commandFromFilename(filename) {
    return path.basename(filename, path.extname(filename))
  }

  function extractDesc(obj) {
    for (let test, keys = ['describe', 'description', 'desc'], i = 0, l = keys.length; i < l; i++) {
      test = obj[keys[i]]
      if (typeof test == 'string' || typeof test == 'boolean') return test
    }
    return false
  }

  self.parseCommand = function (cmd) {
    const splitCommand = cmd.replace(/\s{2,}/g, ' ').split(/\s+(?![^[]*]|[^<]*>)/),
      bregex = /\.*[\][<>]/g,
      parsedCommand = {cmd: splitCommand.shift().replace(bregex, ''), demanded: [], optional: []}
    splitCommand.forEach((cmd, i) => {
      let variadic = false
      cmd = cmd.replace(/\s/g, '')
      if (/\.+[\]>]/.test(cmd) && i === splitCommand.length - 1) variadic = true

      parsedCommand[/^\[/.test(cmd) ? 'optional' : 'demanded'].push({
        cmd: cmd.replace(bregex, '').split('|'),
        variadic
      })
    })
    return parsedCommand
  }

  self.getCommands = () => Object.keys(handlers).concat(Object.keys(aliasMap))

  self.getCommandHandlers = () => handlers

  self.hasDefaultCommand = () => !!defaultCommand

  self.runCommand = function (command, yargs, parsed, commandIndex) {
    let aliases = parsed.aliases
    const commandHandler = handlers[command] || handlers[aliasMap[command]] || defaultCommand,
      currentContext = yargs.getContext()
    let numFiles = currentContext.files.length
    const parentCommands = currentContext.commands.slice()

    let innerArgv = parsed.argv,
      innerYargs = null,
      positionalMap = {}
    if (command) {
      currentContext.commands.push(command)
      currentContext.fullCommands.push(commandHandler.original)
    }
    if (typeof commandHandler.builder == 'function') {
      innerYargs = commandHandler.builder(yargs.reset(parsed.aliases))
      if (yargs.parsed === false) {
        shouldUpdateUsage(yargs) &&
          yargs.getUsageInstance().usage(
            usageFromParentCommandsCommandHandler(parentCommands, commandHandler),
            commandHandler.description
          )

        innerArgv = innerYargs
          ? innerYargs._parseArgs(null, null, true, commandIndex)
          : yargs._parseArgs(null, null, true, commandIndex)
      } else innerArgv = yargs.parsed.argv

      aliases = innerYargs && yargs.parsed === false ? innerYargs.parsed.aliases : yargs.parsed.aliases
    } else if (typeof commandHandler.builder == 'object') {
      innerYargs = yargs.reset(parsed.aliases)
      shouldUpdateUsage(innerYargs) &&
        innerYargs.getUsageInstance().usage(
          usageFromParentCommandsCommandHandler(parentCommands, commandHandler),
          commandHandler.description
        )

      Object.keys(commandHandler.builder).forEach((key) => {
        innerYargs.option(key, commandHandler.builder[key])
      })
      innerArgv = innerYargs._parseArgs(null, null, true, commandIndex)
      aliases = innerYargs.parsed.aliases
    }

    yargs._hasOutput() ||
      (positionalMap = populatePositionals(commandHandler, innerArgv, currentContext, yargs))

    const middlewares = globalMiddleware.slice(0).concat(commandHandler.middlewares || [])
    applyMiddleware(innerArgv, yargs, middlewares, true)

    yargs._hasOutput() || yargs._runValidation(innerArgv, aliases, positionalMap, yargs.parsed.error)

    if (commandHandler.handler && !yargs._hasOutput()) {
      yargs._setHasOutput()

      innerArgv = applyMiddleware(innerArgv, yargs, middlewares, false)

      const handlerResult = isPromise(innerArgv)
        ? innerArgv.then(argv => commandHandler.handler(argv))
        : commandHandler.handler(innerArgv)

      isPromise(handlerResult) && handlerResult.catch(error => yargs.getUsageInstance().fail(null, error))
    }

    if (command) {
      currentContext.commands.pop()
      currentContext.fullCommands.pop()
    }
    numFiles = currentContext.files.length - numFiles
    numFiles > 0 && currentContext.files.splice(numFiles * -1, numFiles)

    return innerArgv
  }

  function shouldUpdateUsage(yargs) {
    return !yargs.getUsageInstance().getUsageDisabled() && yargs.getUsageInstance().getUsage().length === 0
  }

  function usageFromParentCommandsCommandHandler(parentCommands, commandHandler) {
    const c = DEFAULT_MARKER.test(commandHandler.original)
        ? commandHandler.original.replace(DEFAULT_MARKER, '').trim()
        : commandHandler.original,
      pc = parentCommands.filter((c) => !DEFAULT_MARKER.test(c))
    pc.push(c)
    return '$0 ' + pc.join(' ')
  }

  self.runDefaultBuilderOn = function (yargs) {
    if (shouldUpdateUsage(yargs)) {
      const commandString = DEFAULT_MARKER.test(defaultCommand.original)
        ? defaultCommand.original
        : defaultCommand.original.replace(/^[^[\]<>]*/, '$0 ')
      yargs.getUsageInstance().usage(commandString, defaultCommand.description)
    }
    const builder = defaultCommand.builder
    typeof builder == 'function'
      ? builder(yargs)
      : Object.keys(builder).forEach((key) => {
          yargs.option(key, builder[key])
        })
  }

  function populatePositionals(commandHandler, argv, context, yargs) {
    argv._ = argv._.slice(context.commands.length)
    const demanded = commandHandler.demanded.slice(0),
      optional = commandHandler.optional.slice(0),
      positionalMap = {}

    validation.positionalCount(demanded.length, argv._.length)

    while (demanded.length) populatePositional(demanded.shift(), argv, positionalMap)

    while (optional.length) populatePositional(optional.shift(), argv, positionalMap)

    argv._ = context.commands.concat(argv._)

    postProcessPositionals(argv, positionalMap, self.cmdToParseOptions(commandHandler.original))

    return positionalMap
  }

  function populatePositional(positional, argv, positionalMap, parseOptions) {
    const cmd = positional.cmd[0]
    if (positional.variadic) positionalMap[cmd] = argv._.splice(0).map(String)
    else if (argv._.length) positionalMap[cmd] = [String(argv._.shift())]
  }

  function postProcessPositionals(argv, positionalMap, parseOptions) {
    const options = Object.assign({}, yargs.getOptions())
    options.default = Object.assign(parseOptions.default, options.default)
    options.alias = Object.assign(parseOptions.alias, options.alias)
    options.array = options.array.concat(parseOptions.array)
    delete options.config

    const unparsed = []
    Object.keys(positionalMap).forEach((key) => {
      positionalMap[key].map((value) => {
        unparsed.push('--' + key)
        unparsed.push(value)
      })
    })

    if (!unparsed.length) return

    const parsed = Parser.detailed(unparsed, options)

    if (parsed.error) yargs.getUsageInstance().fail(parsed.error.message, parsed.error)
    else {
      const positionalKeys = Object.keys(positionalMap)
      Object.keys(positionalMap).forEach((key) => {
        ;[].push.apply(positionalKeys, parsed.aliases[key])
      })

      Object.keys(parsed.argv).forEach((key) => {
        if (positionalKeys.indexOf(key) > -1) {
          positionalMap[key] || (positionalMap[key] = parsed.argv[key])
          argv[key] = parsed.argv[key]
        }
      })
    }
  }

  self.cmdToParseOptions = function (cmdString) {
    const parseOptions = {array: [], default: {}, alias: {}, demand: {}},

      parsed = self.parseCommand(cmdString)
    parsed.demanded.forEach((d) => {
      const cmds = d.cmd.slice(0),
        cmd = cmds.shift()
      if (d.variadic) {
        parseOptions.array.push(cmd)
        parseOptions.default[cmd] = []
      }
      cmds.forEach((c) => {
        parseOptions.alias[cmd] = c
      })
      parseOptions.demand[cmd] = true
    })

    parsed.optional.forEach((o) => {
      const cmds = o.cmd.slice(0),
        cmd = cmds.shift()
      if (o.variadic) {
        parseOptions.array.push(cmd)
        parseOptions.default[cmd] = []
      }
      cmds.forEach((c) => {
        parseOptions.alias[cmd] = c
      })
    })

    return parseOptions
  }

  self.reset = () => {
    handlers = {}
    aliasMap = {}
    defaultCommand = void 0
    return self
  }

  let frozen
  self.freeze = () => {
    frozen = {}
    frozen.handlers = handlers
    frozen.aliasMap = aliasMap
    frozen.defaultCommand = defaultCommand
  }
  self.unfreeze = () => {
    handlers = frozen.handlers
    aliasMap = frozen.aliasMap
    defaultCommand = frozen.defaultCommand
    frozen = void 0
  }

  return self
}

},
// 9
function (module) {

module.exports = function (maybePromise) {
  return maybePromise instanceof Promise
}

},
// 10
function (module, exports, __webpack_require__) {

module.exports = {applyMiddleware, commandMiddlewareFactory, globalMiddlewareFactory}
const isPromise = __webpack_require__(9),
  argsert = __webpack_require__(3)

function globalMiddlewareFactory(globalMiddleware, context) {
  return function (callback, applyBeforeValidation = false) {
    argsert('<array|function> [boolean]', [callback, applyBeforeValidation], arguments.length)
    if (Array.isArray(callback)) {
      for (let i = 0; i < callback.length; i++) {
        if (typeof callback[i] != 'function') throw Error('middleware must be a function')

        callback[i].applyBeforeValidation = applyBeforeValidation
      }
      Array.prototype.push.apply(globalMiddleware, callback)
    } else if (typeof callback == 'function') {
      callback.applyBeforeValidation = applyBeforeValidation
      globalMiddleware.push(callback)
    }
    return context
  }
}

function commandMiddlewareFactory(commandMiddleware) {
  return !commandMiddleware ? [] : commandMiddleware.map(middleware => {
    middleware.applyBeforeValidation = false
    return middleware
  })
}

function applyMiddleware(argv, yargs, middlewares, beforeValidation) {
  const beforeValidationError = new Error('middleware cannot return a promise when applyBeforeValidation is true')
  return middlewares.reduce((accumulation, middleware) => {
    if (middleware.applyBeforeValidation !== beforeValidation && !isPromise(accumulation))
      return accumulation

    if (isPromise(accumulation))
      return accumulation
        .then(initialObj => Promise.all([initialObj, middleware(initialObj, yargs)]))
        .then(([initialObj, middlewareObj]) => Object.assign(initialObj, middlewareObj))

    const result = middleware(argv, yargs)
    if (beforeValidation && isPromise(result)) throw beforeValidationError

    return isPromise(result)
      ? result.then(middlewareObj => Object.assign(accumulation, middlewareObj))
      : Object.assign(accumulation, result)
  }, argv)
}

},
// 11
function (module, exports, __webpack_require__) {

var camelCase = __webpack_require__(16),
  decamelize = __webpack_require__(17),
  path = __webpack_require__(0),
  tokenizeArgString = __webpack_require__(18),
  util = __webpack_require__(4)

function parse(args, opts) {
  opts || (opts = {})
  args = tokenizeArgString(args)

  var aliases = combineAliases(opts.alias || {})
  var configuration = Object.assign({
    'short-option-groups': true,
    'camel-case-expansion': true,
    'dot-notation': true,
    'parse-numbers': true,
    'boolean-negation': true,
    'negation-prefix': 'no-',
    'duplicate-arguments-array': true,
    'flatten-duplicate-arrays': true,
    'populate--': false,
    'combine-arrays': false,
    'set-placeholder-key': false,
    'halt-at-non-option': false,
    'strip-aliased': false,
    'strip-dashed': false
  }, opts.configuration)
  var defaults = opts.default || {},
    configObjects = opts.configObjects || [],
    envPrefix = opts.envPrefix,
    notFlagsOption = configuration['populate--'],
    notFlagsArgv = notFlagsOption ? '--' : '_',
    newAliases = {},
    __ = opts.__ || util.format,
    error = null
  var flags = {
    aliases: {},
    arrays: {},
    bools: {},
    strings: {},
    numbers: {},
    counts: {},
    normalize: {},
    configs: {},
    defaulted: {},
    nargs: {},
    coercions: {},
    keys: []
  }
  var negative = /^-[0-9]+(\.[0-9]+)?/,
    negatedBoolean = new RegExp('^--' + configuration['negation-prefix'] + '(.+)')

  ;[].concat(opts.array).filter(Boolean).forEach(function (opt) {
    var key = opt.key || opt

    const assignment = Object.keys(opt).map(function (key) {
      return {boolean: 'bools', string: 'strings', number: 'numbers'}[key]
    }).filter(Boolean).pop()

    if (assignment) flags[assignment][key] = true

    flags.arrays[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.boolean).filter(Boolean).forEach(function (key) {
    flags.bools[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.string).filter(Boolean).forEach(function (key) {
    flags.strings[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.number).filter(Boolean).forEach(function (key) {
    flags.numbers[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.count).filter(Boolean).forEach(function (key) {
    flags.counts[key] = true
    flags.keys.push(key)
  })

  ;[].concat(opts.normalize).filter(Boolean).forEach(function (key) {
    flags.normalize[key] = true
    flags.keys.push(key)
  })

  Object.keys(opts.narg || {}).forEach(function (k) {
    flags.nargs[k] = opts.narg[k]
    flags.keys.push(k)
  })

  Object.keys(opts.coerce || {}).forEach(function (k) {
    flags.coercions[k] = opts.coerce[k]
    flags.keys.push(k)
  })

  Array.isArray(opts.config) || typeof opts.config == 'string'
    ? [].concat(opts.config).filter(Boolean).forEach(function (key) {
        flags.configs[key] = true
      })
    : Object.keys(opts.config || {}).forEach(function (k) {
        flags.configs[k] = opts.config[k]
      })

  extendAliases(opts.key, aliases, opts.default, flags.arrays)

  Object.keys(defaults).forEach(function (key) {
    ;(flags.aliases[key] || []).forEach(function (alias) {
      defaults[alias] = defaults[key]
    })
  })

  var argv = {_: []}

  Object.keys(flags.bools).forEach(function (key) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      setArg(key, defaults[key])
      setDefaulted(key)
    }
  })

  var notFlags = []

  for (var i = 0; i < args.length; i++) {
    var arg = args[i]
    var broken, key, letters, m, next, value

    if (arg.match(/^--.+=/) || (!configuration['short-option-groups'] && arg.match(/^-.+=/)))
      if (checkAllAliases((m = arg.match(/^--?([^=]+)=([\s\S]*)$/))[1], flags.nargs)) {
        args.splice(i + 1, 0, m[2])
        i = eatNargs(i, m[1], args)
      } else if (checkAllAliases(m[1], flags.arrays) && args.length > i + 1) {
        args.splice(i + 1, 0, m[2])
        i = eatArray(i, m[1], args)
      } else setArg(m[1], m[2])
    else if (arg.match(negatedBoolean) && configuration['boolean-negation'])
      setArg((key = arg.match(negatedBoolean)[1]), false)
    else if (arg.match(/^--.+/) || (!configuration['short-option-groups'] && arg.match(/^-[^-]+/)))
      if (checkAllAliases((key = arg.match(/^--?(.+)/)[1]), flags.nargs)) i = eatNargs(i, key, args)
      else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) i = eatArray(i, key, args)
      else if (
        (next = flags.nargs[key] === 0 ? void 0 : args[i + 1]) !== void 0 &&
        (!next.match(/^-/) || next.match(negative)) &&
        !checkAllAliases(key, flags.bools) &&
        !checkAllAliases(key, flags.counts)
      ) {
        setArg(key, next)
        i++
      } else if (/^(true|false)$/.test(next)) {
        setArg(key, next)
        i++
      } else setArg(key, defaultValue(key))
    else if (arg.match(/^-.\..+=/)) setArg((m = arg.match(/^-([^=]+)=([\s\S]*)$/))[1], m[2])
    else if (arg.match(/^-.\..+/)) {
      next = args[i + 1]
      key = arg.match(/^-(.\..+)/)[1]

      if (
        next !== void 0 && !next.match(/^-/) &&
        !checkAllAliases(key, flags.bools) &&
        !checkAllAliases(key, flags.counts)
      ) {
        setArg(key, next)
        i++
      } else setArg(key, defaultValue(key))
    } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
      letters = arg.slice(1, -1).split('')
      broken = false

      for (var j = 0; j < letters.length; j++) {
        next = arg.slice(j + 2)

        if (letters[j + 1] && letters[j + 1] === '=') {
          value = arg.slice(j + 3)

          if (checkAllAliases((key = letters[j]), flags.nargs)) {
            args.splice(i + 1, 0, value)
            i = eatNargs(i, key, args)
          } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
            args.splice(i + 1, 0, value)
            i = eatArray(i, key, args)
          } else setArg(key, value)

          broken = true
          break
        }

        if (next === '-') {
          setArg(letters[j], next)
          continue
        }

        if (/[A-Za-z]/.test(letters[j]) && /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
          setArg(letters[j], next)
          broken = true
          break
        }

        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
          setArg(letters[j], next)
          broken = true
          break
        }

        setArg(letters[j], defaultValue(letters[j]))
      }

      key = arg.slice(-1)[0]

      if (!broken && key !== '-')
        if (checkAllAliases(key, flags.nargs)) i = eatNargs(i, key, args)
        else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) i = eatArray(i, key, args)
        else if (
          (next = args[i + 1]) !== void 0 &&
          (!/^(-|--)[^-]/.test(next) || next.match(negative)) &&
          !checkAllAliases(key, flags.bools) &&
          !checkAllAliases(key, flags.counts)
        ) {
          setArg(key, next)
          i++
        } else if (/^(true|false)$/.test(next)) {
          setArg(key, next)
          i++
        } else setArg(key, defaultValue(key))
    } else if (arg === '--') {
      notFlags = args.slice(i + 1)
      break
    } else if (configuration['halt-at-non-option']) {
      notFlags = args.slice(i)
      break
    } else argv._.push(maybeCoerceNumber('_', arg))
  }

  applyEnvVars(argv, true)
  applyEnvVars(argv, false)
  setConfig(argv)
  setConfigObjects()
  applyDefaultsAndAliases(argv, flags.aliases, defaults)
  applyCoercions(argv)
  configuration['set-placeholder-key'] && setPlaceholderKeys(argv)

  Object.keys(flags.counts).forEach(function (key) {
    hasKey(argv, key.split('.')) || setArg(key, 0)
  })

  if (notFlagsOption && notFlags.length) argv[notFlagsArgv] = []
  notFlags.forEach(function (key) {
    argv[notFlagsArgv].push(key)
  })

  configuration['camel-case-expansion'] && configuration['strip-dashed'] &&
    Object.keys(argv).filter(key => key !== '--' && key.includes('-')).forEach(key => {
      delete argv[key]
    })

  configuration['strip-aliased'] &&
    [].concat(...Object.keys(aliases).map(k => aliases[k])).forEach(alias => {
      configuration['camel-case-expansion'] &&
        delete argv[alias.split('.').map(prop => camelCase(prop)).join('.')]

      delete argv[alias]
    })

  function eatNargs(i, key, args) {
    var ii
    const toEat = checkAllAliases(key, flags.nargs)

    var available = 0
    for (ii = i + 1; ii < args.length && !args[ii].match(/^-[^0-9]/); ii++) available++

    if (available < toEat) error = Error(__('Not enough arguments following: %s', key))

    const consumed = Math.min(available, toEat)
    for (ii = i + 1; ii < consumed + i + 1; ii++) setArg(key, args[ii])

    return i + consumed
  }

  function eatArray(i, key, args) {
    var start = i + 1,
      argsToSet = [],
      multipleArrayFlag = i > 0
    for (var ii = i + 1; ii < args.length; ii++) {
      if (/^-/.test(args[ii]) && !negative.test(args[ii])) {
        ii !== start || setArg(key, defaultForType('array'))

        multipleArrayFlag = true
        break
      }
      i = ii
      argsToSet.push(args[ii])
    }
    multipleArrayFlag
      ? setArg(key, argsToSet.map(function (arg) {
          return processValue(key, arg)
        }))
      : argsToSet.forEach(function (arg) {
          setArg(key, arg)
        })

    return i
  }

  function setArg(key, val) {
    unsetDefaulted(key)

    if (/-/.test(key) && configuration['camel-case-expansion']) {
      var alias = key.split('.').map(function (prop) {
        return camelCase(prop)
      }).join('.')
      addNewAlias(key, alias)
    }

    var value = processValue(key, val),

      splitKey = key.split('.')
    setKey(argv, splitKey, value)

    flags.aliases[key] && flags.aliases[key].forEach &&
      flags.aliases[key].forEach(function (x) {
        x = x.split('.')
        setKey(argv, x, value)
      })

    splitKey.length > 1 && configuration['dot-notation'] &&
      (flags.aliases[splitKey[0]] || []).forEach(function (x) {
        x = x.split('.')

        var a = [].concat(splitKey)
        a.shift()
        x = x.concat(a)

        setKey(argv, x, value)
      })

    checkAllAliases(key, flags.normalize) && !checkAllAliases(key, flags.arrays) &&
      [key].concat(flags.aliases[key] || []).forEach(function (key) {
        argv.__defineSetter__(key, function (v) {
          val = path.normalize(v)
        })

        argv.__defineGetter__(key, function () {
          return typeof val == 'string' ? path.normalize(val) : val
        })
      })
  }

  function addNewAlias(key, alias) {
    if (!flags.aliases[key] || !flags.aliases[key].length) {
      flags.aliases[key] = [alias]
      newAliases[alias] = true
    }
    ;(flags.aliases[alias] && flags.aliases[alias].length) || addNewAlias(alias, key)
  }

  function processValue(key, val) {
    if (typeof val == 'string' && (val[0] === "'" || val[0] === '"') && val[val.length - 1] === val[0])
      val = val.substring(1, val.length - 1)

    if ((checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) && typeof val == 'string')
      val = val === 'true'

    var value = maybeCoerceNumber(key, val)

    if (checkAllAliases(key, flags.counts) && (isUndefined(value) || typeof value == 'boolean'))
      value = increment

    if (checkAllAliases(key, flags.normalize) && checkAllAliases(key, flags.arrays))
      value = Array.isArray(val) ? val.map(path.normalize) : path.normalize(val)

    return value
  }

  function maybeCoerceNumber(key, value) {
    if (
      !checkAllAliases(key, flags.strings) && !checkAllAliases(key, flags.coercions) &&
      ((isNumber(value) && configuration['parse-numbers'] && Number.isSafeInteger(Math.floor(value))) ||
        (!isUndefined(value) && checkAllAliases(key, flags.numbers)))
    )
      value = Number(value)

    return value
  }

  function setConfig(argv) {
    var configLookup = {}

    applyDefaultsAndAliases(configLookup, flags.aliases, defaults)

    Object.keys(flags.configs).forEach(function (configKey) {
      var configPath = argv[configKey] || configLookup[configKey]
      if (!configPath) return

      try {
        var config = null,
          resolvedConfigPath = path.resolve(process.cwd(), configPath)

        if (typeof flags.configs[configKey] == 'function') {
          try {
            config = flags.configs[configKey](resolvedConfigPath)
          } catch (e) {
            config = e
          }
          if (config instanceof Error) {
            error = config
            return
          }
        } else config = require(resolvedConfigPath)

        setConfigObject(config)
      } catch (_ex) {
        if (argv[configKey]) error = Error(__('Invalid JSON config file: %s', configPath))
      }
    })
  }

  function setConfigObject(config, prev) {
    Object.keys(config).forEach(function (key) {
      var value = config[key],
        fullKey = prev ? prev + '.' + key : key

      typeof value == 'object' && value !== null && !Array.isArray(value) && configuration['dot-notation']
        ? setConfigObject(value, fullKey)
        : (!hasKey(argv, fullKey.split('.')) || flags.defaulted[fullKey] ||
            (flags.arrays[fullKey] && configuration['combine-arrays'])) &&
          setArg(fullKey, value)
    })
  }

  function setConfigObjects() {
    if (configObjects === void 0) return
    configObjects.forEach(function (configObject) {
      setConfigObject(configObject)
    })
  }

  function applyEnvVars(argv, configOnly) {
    if (envPrefix === void 0) return

    var prefix = typeof envPrefix == 'string' ? envPrefix : ''
    Object.keys(process.env).forEach(function (envVar) {
      if (prefix !== '' && envVar.lastIndexOf(prefix, 0) !== 0) return

      var keys = envVar.split('__').map(function (key, i) {
        if (i === 0) key = key.substring(prefix.length)

        return camelCase(key)
      })

      !((configOnly && flags.configs[keys.join('.')]) || !configOnly) ||
        (hasKey(argv, keys) && !flags.defaulted[keys.join('.')]) ||
        setArg(keys.join('.'), process.env[envVar])
    })
  }

  function applyCoercions(argv) {
    var coerce,
      applied = {}
    Object.keys(argv).forEach(function (key) {
      if (applied.hasOwnProperty(key) || typeof (coerce = checkAllAliases(key, flags.coercions)) != 'function')
        return

      try {
        var value = coerce(argv[key])
        ;[].concat(flags.aliases[key] || [], key).forEach(ali => {
          applied[ali] = argv[ali] = value
        })
      } catch (err) {
        error = err
      }
    })
  }

  function setPlaceholderKeys(argv) {
    flags.keys.forEach((key) => {
      ~key.indexOf('.') || argv[key] !== void 0 || (argv[key] = void 0)
    })
    return argv
  }

  function applyDefaultsAndAliases(obj, aliases, defaults) {
    Object.keys(defaults).forEach(function (key) {
      if (hasKey(obj, key.split('.'))) return

      setKey(obj, key.split('.'), defaults[key])

      ;(aliases[key] || []).forEach(function (x) {
        hasKey(obj, x.split('.')) || setKey(obj, x.split('.'), defaults[key])
      })
    })
  }

  function hasKey(obj, keys) {
    var o = obj

    configuration['dot-notation'] || (keys = [keys.join('.')])

    keys.slice(0, -1).forEach(function (key) {
      o = o[key] || {}
    })

    var key = keys[keys.length - 1]

    return typeof o == 'object' && key in o
  }

  function setKey(obj, keys, value) {
    var o = obj

    configuration['dot-notation'] || (keys = [keys.join('.')])

    keys.slice(0, -1).forEach(function (key, index) {
      key = sanitizeKey(key)

      if (typeof o == 'object' && o[key] === void 0) o[key] = {}

      if (typeof o[key] != 'object' || Array.isArray(o[key])) {
        Array.isArray(o[key]) ? o[key].push({}) : (o[key] = [o[key], {}])

        o = o[key][o[key].length - 1]
      } else o = o[key]
    })

    const key = sanitizeKey(keys[keys.length - 1]),

      isTypeArray = checkAllAliases(keys.join('.'), flags.arrays),
      isValueArray = Array.isArray(value)
    let duplicate = configuration['duplicate-arguments-array']

    if (!duplicate && checkAllAliases(key, flags.nargs)) {
      duplicate = true
      if (
        (!isUndefined(o[key]) && flags.nargs[key] === 1) ||
        (Array.isArray(o[key]) && o[key].length === flags.nargs[key])
      )
        o[key] = void 0
    }

    value === increment
      ? (o[key] = increment(o[key]))
      : Array.isArray(o[key])
      ? duplicate && isTypeArray && isValueArray
        ? (o[key] = configuration['flatten-duplicate-arrays']
            ? o[key].concat(value)
            : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value]))
        : duplicate || Boolean(isTypeArray) !== Boolean(isValueArray)
        ? (o[key] = o[key].concat([value]))
        : (o[key] = value)
      : o[key] === void 0 && isTypeArray
      ? (o[key] = isValueArray ? value : [value])
      : duplicate && o[key] !== void 0 && !checkAllAliases(key, flags.bools) &&
        !checkAllAliases(keys.join('.'), flags.bools) && !checkAllAliases(key, flags.counts)
      ? (o[key] = [o[key], value])
      : (o[key] = value)
  }

  function extendAliases(...args) {
    args.forEach(function (obj) {
      Object.keys(obj || {}).forEach(function (key) {
        if (flags.aliases[key]) return

        flags.aliases[key] = [].concat(aliases[key] || [])
        flags.aliases[key].concat(key).forEach(function (x) {
          if (/-/.test(x) && configuration['camel-case-expansion']) {
            var c = camelCase(x)
            if (c !== key && flags.aliases[key].indexOf(c) < 0) {
              flags.aliases[key].push(c)
              newAliases[c] = true
            }
          }
        })
        flags.aliases[key].concat(key).forEach(function (x) {
          if (x.length > 1 && /[A-Z]/.test(x) && configuration['camel-case-expansion']) {
            var c = decamelize(x, '-')
            if (c !== key && flags.aliases[key].indexOf(c) < 0) {
              flags.aliases[key].push(c)
              newAliases[c] = true
            }
          }
        })
        flags.aliases[key].forEach(function (x) {
          flags.aliases[x] = [key].concat(flags.aliases[key].filter(function (y) {
            return x !== y
          }))
        })
      })
    })
  }

  function checkAllAliases(key, flag) {
    var isSet = false

    ;[].concat(flags.aliases[key] || [], key).forEach(function (key) {
      if (flag[key]) isSet = flag[key]
    })

    return isSet
  }

  function setDefaulted(key) {
    ;[].concat(flags.aliases[key] || [], key).forEach(function (k) {
      flags.defaulted[k] = true
    })
  }

  function unsetDefaulted(key) {
    ;[].concat(flags.aliases[key] || [], key).forEach(function (k) {
      delete flags.defaulted[k]
    })
  }

  function defaultValue(key) {
    return !checkAllAliases(key, flags.bools) && !checkAllAliases(key, flags.counts) && '' + key in defaults
      ? defaults[key]
      : defaultForType(guessType(key))
  }

  function defaultForType(type) {
    return {boolean: true, string: '', number: void 0, array: []}[type]
  }

  function guessType(key) {
    return checkAllAliases(key, flags.strings)
      ? 'string'
      : checkAllAliases(key, flags.numbers)
      ? 'number'
      : checkAllAliases(key, flags.arrays)
      ? 'array'
      : 'boolean'
  }

  function isNumber(x) {
    return x !== null && x !== void 0 && (
      typeof x == 'number' || /^0x[0-9a-f]+$/i.test(x) ||
      ((x.length < 2 || x[0] !== '0') && /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x))
    )
  }

  function isUndefined(num) {
    return num === void 0
  }

  return {
    argv: argv,
    error: error,
    aliases: flags.aliases,
    newAliases: newAliases,
    configuration: configuration
  }
}

function combineAliases(aliases) {
  var aliasArrays = [],
    change = true,
    combined = {}

  Object.keys(aliases).forEach(function (key) {
    aliasArrays.push([].concat(aliases[key], key))
  })

  while (change) {
    change = false
    for (var i = 0; i < aliasArrays.length; i++)
      for (var ii = i + 1; ii < aliasArrays.length; ii++)
        if (aliasArrays[i].some(function (v) {
          return aliasArrays[ii].indexOf(v) > -1
        })) {
          aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii])
          aliasArrays.splice(ii, 1)
          change = true
          break
        }
  }

  aliasArrays.forEach(function (aliasArray) {
    aliasArray = aliasArray.filter(function (v, i, self) {
      return self.indexOf(v) === i
    })
    combined[aliasArray.pop()] = aliasArray
  })

  return combined
}

function increment(orig) {
  return orig !== void 0 ? orig + 1 : 1
}

function Parser(args, opts) {
  return parse(args.slice(), opts).argv
}

Parser.detailed = function (args, opts) {
  return parse(args.slice(), opts)
}

function sanitizeKey(key) {
  return key === '__proto__' ? '___proto___' : key
}

module.exports = Parser

},
// 12
function (module) {

module.exports = function (blocking) {
  ;[process.stdout, process.stderr].forEach(function (stream) {
    stream._handle && stream.isTTY && typeof stream._handle.setBlocking == 'function' &&
      stream._handle.setBlocking(blocking)
  })
}

},
// 13
function (module, exports, __webpack_require__) {

var cssKeywords = __webpack_require__(32),

	reverseKeywords = {};
for (var key in cssKeywords)
	if (cssKeywords.hasOwnProperty(key)) reverseKeywords[cssKeywords[key]] = key;

var convert = (module.exports = {
	rgb: {channels: 3, labels: 'rgb'},
	hsl: {channels: 3, labels: 'hsl'},
	hsv: {channels: 3, labels: 'hsv'},
	hwb: {channels: 3, labels: 'hwb'},
	cmyk: {channels: 4, labels: 'cmyk'},
	xyz: {channels: 3, labels: 'xyz'},
	lab: {channels: 3, labels: 'lab'},
	lch: {channels: 3, labels: 'lch'},
	hex: {channels: 1, labels: ['hex']},
	keyword: {channels: 1, labels: ['keyword']},
	ansi16: {channels: 1, labels: ['ansi16']},
	ansi256: {channels: 1, labels: ['ansi256']},
	hcg: {channels: 3, labels: ['h', 'c', 'g']},
	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
	gray: {channels: 1, labels: ['gray']}
});

for (var model in convert)
	if (convert.hasOwnProperty(model)) {
		if (!('channels' in convert[model])) throw new Error('missing channels property: ' + model);

		if (!('labels' in convert[model])) throw new Error('missing channel labels property: ' + model);

		if (convert[model].labels.length !== convert[model].channels)
			throw new Error('channel and label counts mismatch: ' + model);

		var channels = convert[model].channels,
			labels = convert[model].labels;
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}

convert.rgb.hsl = function (rgb) {
	var h, l,
		r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,
		min = Math.min(r, g, b),
		max = Math.max(r, g, b),
		delta = max - min;

	if (max === min) h = 0;
	else if (r === max) h = (g - b) / delta;
	else if (g === max) h = 2 + (b - r) / delta;
	else if (b === max) h = 4 + (r - g) / delta;

	if ((h = Math.min(h * 60, 360)) < 0) h += 360;

	l = (min + max) / 2;

	return [h, 100 * (max === min ? 0 : l <= 0.5 ? delta / (max + min) : delta / (2 - max - min)), l * 100];
};

convert.rgb.hsv = function (rgb) {
	var rdif, gdif, bdif, h, s;

	var r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,
		v = Math.max(r, g, b),
		diff = v - Math.min(r, g, b),
		diffc = function (c) {
			return (v - c) / 6 / diff + 0.5;
		};

	if (diff === 0) h = s = 0;
	else {
		s = diff / v;
		rdif = diffc(r);
		gdif = diffc(g);
		bdif = diffc(b);

		if (r === v) h = bdif - gdif;
		else if (g === v) h = 1 / 3 + rdif - bdif;
		else if (b === v) h = 2 / 3 + gdif - rdif;

		if (h < 0) h += 1;
		else if (h > 1) h -= 1;
	}

	return [h * 360, s * 100, v * 100];
};

convert.rgb.hwb = function (rgb) {
	var r = rgb[0],
		g = rgb[1],
		b = rgb[2];

	return [
		convert.rgb.hsl(rgb)[0],
		(1 / 255) * Math.min(r, g, b) * 100,
		100 * (b = 1 - (1 / 255) * Math.max(r, g, b)) // redundant
	];
};

convert.rgb.cmyk = function (rgb) {
	var r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,

		k = Math.min(1 - r, 1 - g, 1 - b);

	return [
		((1 - r - k) / (1 - k) || 0) * 100,
		((1 - g - k) / (1 - k) || 0) * 100,
		((1 - b - k) / (1 - k) || 0) * 100,
		k * 100
	];
};

function comparativeDistance(x, y) {
	return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
}

convert.rgb.keyword = function (rgb) {
	var reversed = reverseKeywords[rgb];
	if (reversed) return reversed;

	var currentClosestKeyword,
		currentClosestDistance = Infinity;

	for (var keyword in cssKeywords)
		if (cssKeywords.hasOwnProperty(keyword)) {
			var distance = comparativeDistance(rgb, cssKeywords[keyword]);

			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}

	return currentClosestKeyword;
};

convert.keyword.rgb = function (keyword) {
	return cssKeywords[keyword];
};

convert.rgb.xyz = function (rgb) {
	var r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255;

	r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	return [
		100 * (r * 0.4124 + g * 0.3576 + b * 0.1805),
		100 * (r * 0.2126 + g * 0.7152 + b * 0.0722),
		100 * (r * 0.0193 + g * 0.1192 + b * 0.9505)
	];
};

convert.rgb.lab = function (rgb) {
	var xyz = convert.rgb.xyz(rgb),
		x = xyz[0],
		y = xyz[1],
		z = xyz[2];

	y /= 100;
	z /= 108.883;

	x = (x /= 95.047) > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;

	return [
		116 * (y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116) - 16,
		500 * (x - y),
		200 * (y - (z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116))
	];
};

convert.hsl.rgb = function (hsl) {
	var t1, t2, t3, rgb, val;
	var h = hsl[0] / 360,
		s = hsl[1] / 100,
		l = hsl[2] / 100;

	if (s === 0) return [(val = l * 255), val, val];

	t1 = 2 * l - (t2 = l < 0.5 ? l * (1 + s) : l + s - l * s);

	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		;(t3 = h + (1 / 3) * -(i - 1)) < 0 && t3++;

		t3 > 1 && t3--;

		val = 6 * t3 < 1
			? t1 + 6 * (t2 - t1) * t3
			: 2 * t3 < 1
			? t2
			: 3 * t3 < 2
			? t1 + (t2 - t1) * (2 / 3 - t3) * 6
			: t1;

		rgb[i] = val * 255;
	}

	return rgb;
};

convert.hsl.hsv = function (hsl) {
	var h = hsl[0],
		s = hsl[1] / 100,
		l = hsl[2] / 100,
		smin = s,
		lmin = Math.max(l, 0.01);

	s *= (l *= 2) <= 1 ? l : 2 - l;
	smin *= lmin <= 1 ? lmin : 2 - lmin;

	return [h, 100 * (l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)), ((l + s) / 2) * 100];
};

convert.hsv.rgb = function (hsv) {
	var h = hsv[0] / 60,
		s = hsv[1] / 100,
		v = hsv[2] / 100,
		hi = Math.floor(h) % 6,

		f = h - Math.floor(h),
		p = 255 * v * (1 - s),
		q = 255 * v * (1 - s * f),
		t = 255 * v * (1 - s * (1 - f));
	v *= 255;

	switch (hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
};

convert.hsv.hsl = function (hsv) {
	var lmin, sl, l,
		h = hsv[0],
		s = hsv[1] / 100,
		v = hsv[2] / 100,
		vmin = Math.max(v, 0.01);

	l = (2 - s) * v;
	lmin = (2 - s) * vmin;
	sl = s * vmin;

	return [h, (sl = (sl /= lmin <= 1 ? lmin : 2 - lmin) || 0) * 100, 100 * (l /= 2)];
};

convert.hwb.rgb = function (hwb) {
	var i, v, f, n, r, g, b;
	var h = hwb[0] / 360,
		wh = hwb[1] / 100,
		bl = hwb[2] / 100,
		ratio = wh + bl;

	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}

	f = 6 * h - (i = Math.floor(6 * h));

	if ((i & 0x01) != 0) f = 1 - f;

	n = wh + f * ((v = 1 - bl) - wh);

	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}

	return [r * 255, g * 255, b * 255];
};

convert.cmyk.rgb = function (cmyk) {
	var c = cmyk[0] / 100,
		m = cmyk[1] / 100,
		y = cmyk[2] / 100,
		k = cmyk[3] / 100;

	return [
		255 * (1 - Math.min(1, c * (1 - k) + k)),
		255 * (1 - Math.min(1, m * (1 - k) + k)),
		255 * (1 - Math.min(1, y * (1 - k) + k))
	];
};

convert.xyz.rgb = function (xyz) {
	var r, g, b,
		x = xyz[0] / 100,
		y = xyz[1] / 100,
		z = xyz[2] / 100;

	r = x * 3.2406 + y * -1.5372 + z * -0.4986;
	g = x * -0.9689 + y * 1.8758 + z * 0.0415;
	b = x * 0.0557 + y * -0.204 + z * 1.057;

	r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : r * 12.92;
	g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : g * 12.92;
	b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : b * 12.92;

	return [
		(r = Math.min(Math.max(0, r), 1)) * 255,
		(g = Math.min(Math.max(0, g), 1)) * 255,
		(b = Math.min(Math.max(0, b), 1)) * 255
	];
};

convert.xyz.lab = function (xyz) {
	var x = xyz[0],
		y = xyz[1],
		z = xyz[2];

	y /= 100;
	z /= 108.883;

	x = (x /= 95.047) > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;

	return [
		116 * (y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116) - 16,
		500 * (x - y),
		200 * (y - (z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116))
	];
};

convert.lab.xyz = function (lab) {
	var x, y, z,
		l = lab[0],
		a = lab[1],
		b = lab[2];

	x = a / 500 + (y = (l + 16) / 116);
	z = y - b / 200;

	var y2 = Math.pow(y, 3),
		x2 = Math.pow(x, 3),
		z2 = Math.pow(z, 3);
	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

	return [(x *= 95.047), (y *= 100), (z *= 108.883)];
};

convert.lab.lch = function (lab) {
	var h,
		l = lab[0],
		a = lab[1],
		b = lab[2];

	if ((h = (Math.atan2(b, a) * 360) / 2 / Math.PI) < 0) h += 360;

	return [l, Math.sqrt(a * a + b * b), h];
};

convert.lch.lab = function (lch) {
	var l = lch[0],
		c = lch[1],
		h = lch[2],

		hr = (h / 360) * 2 * Math.PI;

	return [l, c * Math.cos(hr), c * Math.sin(hr)];
};

convert.rgb.ansi16 = function (args) {
	var r = args[0],
		g = args[1],
		b = args[2],
		value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2];

	if ((value = Math.round(value / 50)) === 0) return 30;

	var ansi = 30 + ((Math.round(b / 255) << 2) | (Math.round(g / 255) << 1) | Math.round(r / 255));

	if (value === 2) ansi += 60;

	return ansi;
};

convert.hsv.ansi16 = function (args) {
	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
};

convert.rgb.ansi256 = function (args) {
	var r = args[0],
		g = args[1],
		b = args[2];

	return r === g && g === b
		? r < 8
			? 16
			: r > 248
			? 231
			: Math.round(((r - 8) / 247) * 24) + 232
		: 16 + 36 * Math.round((r / 255) * 5) + 6 * Math.round((g / 255) * 5) + Math.round((b / 255) * 5);
};

convert.ansi16.rgb = function (args) {
	var color = args % 10;

	if (color === 0 || color === 7) {
		if (args > 50) color += 3.5;

		return [(color = (color / 10.5) * 255), color, color];
	}

	var mult = 0.5 * (1 + ~~(args > 50));

	return [(color & 1) * mult * 255, ((color >> 1) & 1) * mult * 255, ((color >> 2) & 1) * mult * 255];
};

convert.ansi256.rgb = function (args) {
	if (args >= 232) {
		var c = 10 * (args - 232) + 8;
		return [c, c, c];
	}

	args -= 16;

	var rem;

	return [
		(Math.floor(args / 36) / 5) * 255,
		(Math.floor((rem = args % 36) / 6) / 5) * 255,
		((rem % 6) / 5) * 255
	];
};

convert.rgb.hex = function (args) {
	var string = (
		((Math.round(args[0]) & 0xFF) << 16) + ((Math.round(args[1]) & 0xFF) << 8) + (Math.round(args[2]) & 0xFF)
	).toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.hex.rgb = function (args) {
	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
	if (!match) return [0, 0, 0];

	var colorString = match[0];

	if (colorString.length === 3)
		colorString = colorString.split('').map(function (char) {
			return char + char;
		}).join('');

	var integer = parseInt(colorString, 16);

	return [(integer >> 16) & 0xFF, (integer >> 8) & 0xFF, integer & 0xFF];
};

convert.rgb.hcg = function (rgb) {
	var hue,
		r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,
		max = Math.max(r, g, b),
		min = Math.min(r, g, b),
		chroma = max - min;

	hue = chroma <= 0
		? 0
		: max === r
		? ((g - b) / chroma) % 6
		: max === g
		? 2 + (b - r) / chroma
		: 4 + (r - g) / chroma + 4;

	hue /= 6;

	return [360 * (hue %= 1), chroma * 100, 100 * (chroma < 1 ? min / (1 - chroma) : 0)];
};

convert.hsl.hcg = function (hsl) {
	var s = hsl[1] / 100,
		l = hsl[2] / 100,
		c = 1,
		f = 0;

	if ((c = l < 0.5 ? 2.0 * s * l : 2.0 * s * (1.0 - l)) < 1.0)
		f = (l - 0.5 * c) / (1.0 - c);

	return [hsl[0], c * 100, f * 100];
};

convert.hsv.hcg = function (hsv) {
	var s = hsv[1] / 100,
		v = hsv[2] / 100,

		c = s * v,
		f = 0;

	if (c < 1.0) f = (v - c) / (1 - c);

	return [hsv[0], c * 100, f * 100];
};

convert.hcg.rgb = function (hcg) {
	var h = hcg[0] / 360,
		c = hcg[1] / 100,
		g = hcg[2] / 100;

	if (c === 0.0) return [g * 255, g * 255, g * 255];

	var pure = [0, 0, 0],
		hi = (h % 1) * 6,
		v = hi % 1,
		w = 1 - v,
		mg = 0;

	switch (Math.floor(hi)) {
		case 0:
			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
		case 1:
			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
		case 2:
			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
		case 3:
			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
		case 4:
			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
		default:
			pure[0] = 1; pure[1] = 0; pure[2] = w;
	}

	mg = (1.0 - c) * g;

	return [(c * pure[0] + mg) * 255, (c * pure[1] + mg) * 255, (c * pure[2] + mg) * 255];
};

convert.hcg.hsv = function (hcg) {
	var c = hcg[1] / 100,

		v = c + (hcg[2] / 100) * (1.0 - c),
		f = 0;

	if (v > 0.0) f = c / v;

	return [hcg[0], f * 100, v * 100];
};

convert.hcg.hsl = function (hcg) {
	var c = hcg[1] / 100,

		l = (hcg[2] / 100) * (1.0 - c) + 0.5 * c,
		s = 0;

	if (l > 0.0 && l < 0.5) s = c / (2 * l);
	else if (l >= 0.5 && l < 1.0) s = c / (2 * (1 - l));

	return [hcg[0], s * 100, l * 100];
};

convert.hcg.hwb = function (hcg) {
	var c = hcg[1] / 100,
		v = c + (hcg[2] / 100) * (1.0 - c);
	return [hcg[0], 100 * (v - c), 100 * (1 - v)];
};

convert.hwb.hcg = function (hwb) {
	var w = hwb[1] / 100,
		v = 1 - hwb[2] / 100,
		c = v - w,
		g = 0;

	if (c < 1) g = (v - c) / (1 - c);

	return [hwb[0], c * 100, g * 100];
};

convert.apple.rgb = function (apple) {
	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
};

convert.rgb.apple = function (rgb) {
	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
};

convert.gray.rgb = function (args) {
	return [(args[0] / 100) * 255, (args[0] / 100) * 255, (args[0] / 100) * 255];
};

convert.gray.hsl = convert.gray.hsv = function (args) {
	return [0, 0, args[0]];
};

convert.gray.hwb = function (gray) {
	return [0, 100, gray[0]];
};

convert.gray.cmyk = function (gray) {
	return [0, 0, 0, gray[0]];
};

convert.gray.lab = function (gray) {
	return [gray[0], 0, 0];
};

convert.gray.hex = function (gray) {
	var val = Math.round((gray[0] / 100) * 255) & 0xFF,

		string = ((val << 16) + (val << 8) + val).toString(16).toUpperCase();
	return '000000'.substring(string.length) + string;
};

convert.rgb.gray = function (rgb) {
	return [((rgb[0] + rgb[1] + rgb[2]) / 3 / 255) * 100];
};

},
// 14
function (module, exports, __webpack_require__) {

const yargs = __webpack_require__(15)

Argv(process.argv.slice(2))

module.exports = Argv

function Argv(processArgs, cwd) {
  const argv = yargs(processArgs, cwd, require)
  singletonify(argv)
  return argv
}

function singletonify(inst) {
  Object.keys(inst).forEach((key) => {
    key === 'argv'
      ? Argv.__defineGetter__(key, inst.__lookupGetter__(key))
      : (Argv[key] = typeof inst[key] == 'function' ? inst[key].bind(inst) : inst[key])
  })
}

},
// 15
function (module, exports, __webpack_require__) {

const argsert = __webpack_require__(3),
  fs = __webpack_require__(1),
  Command = __webpack_require__(8),
  Completion = __webpack_require__(21),
  Parser = __webpack_require__(11),
  path = __webpack_require__(0),
  Usage = __webpack_require__(23),
  Validation = __webpack_require__(34),
  Y18n = __webpack_require__(36),
  objFilter = __webpack_require__(7),
  setBlocking = __webpack_require__(12),
  applyExtends = __webpack_require__(37),
  {globalMiddlewareFactory} = __webpack_require__(10),
  YError = __webpack_require__(2)

exports = module.exports = Yargs
function Yargs(processArgs, cwd, parentRequire) {
  processArgs = processArgs || []

  const self = {}
  let command = null,
    completion = null,
    groups = {},
    globalMiddleware = [],
    output = '',
    preservedGroups = {},
    usage = null,
    validation = null

  const y18n = Y18n({
    directory: path.resolve(__dirname, './locales'),
    fallbackToLanguage: false,
    updateFiles: false
  })

  self.middleware = globalMiddlewareFactory(globalMiddleware, self)

  cwd || (cwd = process.cwd())

  self.scriptName = function (scriptName) {
    self.$0 = scriptName
    return self
  }

  ;/\b(node|iojs|electron)(\.exe)?$/.test(process.argv[0])
    ? (self.$0 = process.argv.slice(1, 2))
    : (self.$0 = process.argv.slice(0, 1))

  self.$0 = self.$0
    .map((x, i) => {
      const b = rebase(cwd, x)
      return x.match(/^(\/|([a-zA-Z]:)?\\)/) && b.length < x.length ? b : x
    })
    .join(' ').trim()

  if (process.env._ !== void 0 && process.argv[1] === process.env._)
    self.$0 = process.env._.replace(path.dirname(process.execPath) + '/', '')

  const context = {resets: -1, commands: [], fullCommands: [], files: []}
  self.getContext = () => context

  let options
  self.resetOptions = self.reset = function (aliases) {
    context.resets++
    aliases = aliases || {}
    options = options || {}
    const tmpOptions = {}
    tmpOptions.local = options.local ? options.local : []
    tmpOptions.configObjects = options.configObjects ? options.configObjects : []

    const localLookup = {}
    tmpOptions.local.forEach((l) => {
      localLookup[l] = true
      ;(aliases[l] || []).forEach((a) => {
        localLookup[a] = true
      })
    })

    preservedGroups = Object.keys(groups).reduce((acc, groupName) => {
      const keys = groups[groupName].filter(key => !(key in localLookup))
      if (keys.length > 0) acc[groupName] = keys

      return acc
    }, {})
    groups = {}

    const objectOptions = [
      'narg', 'key', 'alias', 'default', 'defaultDescription',
      'config', 'choices', 'demandedOptions', 'demandedCommands', 'coerce'
    ]

    ;[
      'array', 'boolean', 'string', 'skipValidation', 'count', 'normalize', 'number', 'hiddenOptions'
    ].forEach((k) => {
      tmpOptions[k] = (options[k] || []).filter(k => !localLookup[k])
    })

    objectOptions.forEach((k) => {
      tmpOptions[k] = objFilter(options[k], (k, v) => !localLookup[k])
    })

    tmpOptions.envPrefix = options.envPrefix
    options = tmpOptions

    usage = usage ? usage.reset(localLookup) : Usage(self, y18n)
    validation = validation ? validation.reset(localLookup) : Validation(self, usage, y18n)
    command = command ? command.reset() : Command(self, usage, validation, globalMiddleware)
    completion || (completion = Completion(self, usage, command))

    completionCommand = null
    output = ''
    exitError = null
    hasOutput = false
    self.parsed = false

    return self
  }
  self.resetOptions()

  let frozen
  function freeze() {
    frozen = {}
    frozen.options = options
    frozen.configObjects = options.configObjects.slice(0)
    frozen.exitProcess = exitProcess
    frozen.groups = groups
    usage.freeze()
    validation.freeze()
    command.freeze()
    frozen.strict = strict
    frozen.completionCommand = completionCommand
    frozen.output = output
    frozen.exitError = exitError
    frozen.hasOutput = hasOutput
    frozen.parsed = self.parsed
  }
  function unfreeze() {
    options = frozen.options
    options.configObjects = frozen.configObjects
    exitProcess = frozen.exitProcess
    groups = frozen.groups
    output = frozen.output
    exitError = frozen.exitError
    hasOutput = frozen.hasOutput
    self.parsed = frozen.parsed
    usage.unfreeze()
    validation.unfreeze()
    command.unfreeze()
    strict = frozen.strict
    completionCommand = frozen.completionCommand
    parseFn = null
    parseContext = null
    frozen = void 0
  }

  self.boolean = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('boolean', keys)
    return self
  }

  self.array = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('array', keys)
    return self
  }

  self.number = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('number', keys)
    return self
  }

  self.normalize = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('normalize', keys)
    return self
  }

  self.count = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('count', keys)
    return self
  }

  self.string = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('string', keys)
    return self
  }

  self.requiresArg = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintObject(self.nargs, false, 'narg', keys, 1)
    return self
  }

  self.skipValidation = function (keys) {
    argsert('<array|string>', [keys], arguments.length)
    populateParserHintArray('skipValidation', keys)
    return self
  }

  function populateParserHintArray(type, keys, value) {
    ;(keys = [].concat(keys)).forEach((key) => {
      key = sanitizeKey(key)
      options[type].push(key)
    })
  }

  self.nargs = function (key, value) {
    argsert('<string|object|array> [number]', [key, value], arguments.length)
    populateParserHintObject(self.nargs, false, 'narg', key, value)
    return self
  }

  self.choices = function (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(self.choices, true, 'choices', key, value)
    return self
  }

  self.alias = function (key, value) {
    argsert('<object|string|array> [string|array]', [key, value], arguments.length)
    populateParserHintObject(self.alias, true, 'alias', key, value)
    return self
  }

  self.default = self.defaults = function (key, value, defaultDescription) {
    argsert('<object|string|array> [*] [string]', [key, value, defaultDescription], arguments.length)
    if (defaultDescription) options.defaultDescription[key] = defaultDescription
    if (typeof value == 'function') {
      options.defaultDescription[key] || (options.defaultDescription[key] = usage.functionDescription(value))
      value = value.call()
    }
    populateParserHintObject(self.default, false, 'default', key, value)
    return self
  }

  self.describe = function (key, desc) {
    argsert('<object|string|array> [string]', [key, desc], arguments.length)
    populateParserHintObject(self.describe, false, 'key', key, true)
    usage.describe(key, desc)
    return self
  }

  self.demandOption = function (keys, msg) {
    argsert('<object|string|array> [string]', [keys, msg], arguments.length)
    populateParserHintObject(self.demandOption, false, 'demandedOptions', keys, msg)
    return self
  }

  self.coerce = function (keys, value) {
    argsert('<object|string|array> [function]', [keys, value], arguments.length)
    populateParserHintObject(self.coerce, false, 'coerce', keys, value)
    return self
  }

  function populateParserHintObject(builder, isArray, type, key, value) {
    if (Array.isArray(key)) {
      const temp = Object.create(null)
      key.forEach((k) => {
        temp[k] = value
      })
      builder(temp)
    } else if (typeof key == 'object')
      Object.keys(key).forEach((k) => {
        builder(k, key[k])
      })
    else {
      key = sanitizeKey(key)
      options[type][key] = isArray ? (options[type][key] || []).concat(value) : value
    }
  }

  function sanitizeKey(key) {
    return key === '__proto__' ? '___proto___' : key
  }

  function deleteFromParserHintObject(optionKey) {
    Object.keys(options).forEach((hintKey) => {
      const hint = options[hintKey]
      Array.isArray(hint)
        ? ~hint.indexOf(optionKey) && hint.splice(hint.indexOf(optionKey), 1)
        : typeof hint != 'object' || delete hint[optionKey]
    })
    delete usage.getDescriptions()[optionKey]
  }

  self.config = function (key, msg, parseFn) {
    argsert('[object|string] [string|function] [function]', [key, msg, parseFn], arguments.length)
    if (typeof key == 'object') {
      key = applyExtends(key, cwd)
      options.configObjects = (options.configObjects || []).concat(key)
      return self
    }

    if (typeof msg == 'function') {
      parseFn = msg
      msg = null
    }

    key = key || 'config'
    self.describe(key, msg || usage.deferY18nLookup('Path to JSON config file'))
    ;(Array.isArray(key) ? key : [key]).forEach((k) => {
      options.config[k] = parseFn || true
    })

    return self
  }

  self.example = function (cmd, description) {
    argsert('<string> [string]', [cmd, description], arguments.length)
    usage.example(cmd, description)
    return self
  }

  self.command = function (cmd, description, builder, handler, middlewares) {
    argsert(
      '<string|array|object> [string|boolean] [function|object] [function] [array]',
      [cmd, description, builder, handler, middlewares],
      arguments.length
    )
    command.addHandler(cmd, description, builder, handler, middlewares)
    return self
  }

  self.commandDir = function (dir, opts) {
    argsert('<string> [object]', [dir, opts], arguments.length)
    const req = parentRequire || require
    command.addDirectory(dir, self.getContext(), req, __webpack_require__(38)(), opts)
    return self
  }

  self.demand = self.required = self.require = function (keys, max, msg) {
    if (Array.isArray(max)) {
      max.forEach((key) => {
        self.demandOption(key, msg)
      })
      max = Infinity
    } else if (typeof max != 'number') {
      msg = max
      max = Infinity
    }

    typeof keys == 'number'
      ? self.demandCommand(keys, max, msg, msg)
      : Array.isArray(keys)
      ? keys.forEach((key) => {
          self.demandOption(key, msg)
        })
      : typeof msg == 'string'
      ? self.demandOption(keys, msg)
      : (msg !== true && msg !== void 0) || self.demandOption(keys)

    return self
  }

  self.demandCommand = function (min, max, minMsg, maxMsg) {
    argsert(
      '[number] [number|string] [string|null|undefined] [string|null|undefined]',
      [min, max, minMsg, maxMsg],
      arguments.length
    )

    if (min === void 0) min = 1

    if (typeof max != 'number') {
      minMsg = max
      max = Infinity
    }

    self.global('_', false)

    options.demandedCommands._ = {min, max, minMsg, maxMsg}

    return self
  }

  self.getDemandedOptions = () => {
    argsert([], 0)
    return options.demandedOptions
  }

  self.getDemandedCommands = () => {
    argsert([], 0)
    return options.demandedCommands
  }

  self.implies = function (key, value) {
    argsert('<string|object> [number|string|array]', [key, value], arguments.length)
    validation.implies(key, value)
    return self
  }

  self.conflicts = function (key1, key2) {
    argsert('<string|object> [string|array]', [key1, key2], arguments.length)
    validation.conflicts(key1, key2)
    return self
  }

  self.usage = function (msg, description, builder, handler) {
    argsert(
      '<string|null|undefined> [string|boolean] [function|object] [function]',
      [msg, description, builder, handler],
      arguments.length
    )

    if (description !== void 0) {
      if ((msg || '').match(/^\$0( |$)/)) return self.command(msg, description, builder, handler)

      throw new YError('.usage() description must start with $0 if being used as alias for .command()')
    }

    usage.usage(msg)
    return self
  }

  self.epilogue = self.epilog = function (msg) {
    argsert('<string>', [msg], arguments.length)
    usage.epilog(msg)
    return self
  }

  self.fail = function (f) {
    argsert('<function>', [f], arguments.length)
    usage.failFn(f)
    return self
  }

  self.check = function (f, _global) {
    argsert('<function> [boolean]', [f, _global], arguments.length)
    validation.check(f, _global !== false)
    return self
  }

  self.global = function (globals, global) {
    argsert('<string|array> [boolean]', [globals, global], arguments.length)
    globals = [].concat(globals)
    global !== false
      ? (options.local = options.local.filter(l => globals.indexOf(l) < 0))
      : globals.forEach((g) => {
          options.local.indexOf(g) < 0 && options.local.push(g)
        })

    return self
  }

  self.pkgConf = function (key, rootPath) {
    argsert('<string> [string]', [key, rootPath], arguments.length)
    let conf = null
    const obj = pkgUp(rootPath || cwd)

    if (obj[key] && typeof obj[key] == 'object') {
      conf = applyExtends(obj[key], rootPath || cwd)
      options.configObjects = (options.configObjects || []).concat(conf)
    }

    return self
  }

  const pkgs = {}
  function pkgUp(rootPath) {
    const npath = rootPath || '*'
    if (pkgs[npath]) return pkgs[npath]
    const findUp = __webpack_require__(39)

    let obj = {}
    try {
      let startDir = rootPath || __webpack_require__(42)(parentRequire || require)

      if (!rootPath && path.extname(startDir)) startDir = path.dirname(startDir)

      const pkgJsonPath = findUp.sync('package.json', {cwd: startDir})
      obj = JSON.parse(fs.readFileSync(pkgJsonPath))
    } catch (_noop) {}

    pkgs[npath] = obj || {}
    return pkgs[npath]
  }

  let parseFn = null,
    parseContext = null
  self.parse = function (args, shortCircuit, _parseFn) {
    argsert('[string|array] [function|boolean|object] [function]', [args, shortCircuit, _parseFn], arguments.length)
    if (args === void 0) return self._parseArgs(processArgs)

    if (typeof shortCircuit == 'object') {
      parseContext = shortCircuit
      shortCircuit = _parseFn
    }

    if (typeof shortCircuit == 'function') {
      parseFn = shortCircuit
      shortCircuit = null
    }
    shortCircuit || (processArgs = args)

    freeze()
    if (parseFn) exitProcess = false

    const parsed = self._parseArgs(args, shortCircuit)
    parseFn && parseFn(exitError, parsed, output)
    unfreeze()

    return parsed
  }

  self._getParseContext = () => parseContext || {}

  self._hasParseCallback = () => !!parseFn

  self.option = self.options = function (key, opt) {
    argsert('<string|object> [object]', [key, opt], arguments.length)
    if (typeof key == 'object')
      Object.keys(key).forEach((k) => {
        self.options(k, key[k])
      })
    else {
      if (typeof opt != 'object') opt = {}

      options.key[key] = true

      opt.alias && self.alias(key, opt.alias)

      const demand = opt.demand || opt.required || opt.require

      demand && self.demand(key, demand)

      opt.demandOption &&
        self.demandOption(key, typeof opt.demandOption == 'string' ? opt.demandOption : void 0)

      'conflicts' in opt && self.conflicts(key, opt.conflicts)

      'default' in opt && self.default(key, opt.default)

      'implies' in opt && self.implies(key, opt.implies)

      'nargs' in opt && self.nargs(key, opt.nargs)

      opt.config && self.config(key, opt.configParser)

      opt.normalize && self.normalize(key)

      'choices' in opt && self.choices(key, opt.choices)

      'coerce' in opt && self.coerce(key, opt.coerce)

      'group' in opt && self.group(key, opt.group)

      if (opt.boolean || opt.type === 'boolean') {
        self.boolean(key)
        opt.alias && self.boolean(opt.alias)
      }

      if (opt.array || opt.type === 'array') {
        self.array(key)
        opt.alias && self.array(opt.alias)
      }

      if (opt.number || opt.type === 'number') {
        self.number(key)
        opt.alias && self.number(opt.alias)
      }

      if (opt.string || opt.type === 'string') {
        self.string(key)
        opt.alias && self.string(opt.alias)
      }

      if (opt.count || opt.type === 'count') self.count(key)

      typeof opt.global != 'boolean' || self.global(key, opt.global)

      if (opt.defaultDescription) options.defaultDescription[key] = opt.defaultDescription

      opt.skipValidation && self.skipValidation(key)

      const desc = opt.describe || opt.description || opt.desc
      self.describe(key, desc)
      opt.hidden && self.hide(key)

      opt.requiresArg && self.requiresArg(key)
    }

    return self
  }
  self.getOptions = () => options

  self.positional = function (key, opts) {
    argsert('<string> <object>', [key, opts], arguments.length)
    if (context.resets === 0) throw new YError(".positional() can only be called in a command's builder function")

    const supportedOpts = [
      'default', 'defaultDescription', 'implies', 'normalize',
      'choices', 'conflicts', 'coerce', 'type', 'describe', 'desc', 'description', 'alias'
    ]
    opts = objFilter(opts, (k, v) => {
      let accept = supportedOpts.indexOf(k) > -1
      if (k === 'type' && ['string', 'number', 'boolean'].indexOf(v) < 0) accept = false
      return accept
    })

    const fullCommand = context.fullCommands[context.fullCommands.length - 1],
      parseOptions = fullCommand
        ? command.cmdToParseOptions(fullCommand)
        : {array: [], alias: {}, default: {}, demand: {}}
    Object.keys(parseOptions).forEach((pk) => {
      Array.isArray(parseOptions[pk])
        ? parseOptions[pk].indexOf(key) < 0 || (opts[pk] = true)
        : !parseOptions[pk][key] || pk in opts || (opts[pk] = parseOptions[pk][key])
    })
    self.group(key, usage.getPositionalGroupName())
    return self.option(key, opts)
  }

  self.group = function (opts, groupName) {
    argsert('<string|array> <string>', [opts, groupName], arguments.length)
    const existing = preservedGroups[groupName] || groups[groupName]
    preservedGroups[groupName] && delete preservedGroups[groupName]

    const seen = {}
    groups[groupName] = (existing || []).concat(opts).filter((key) => !seen[key] && (seen[key] = true))
    return self
  }
  self.getGroups = () => Object.assign({}, groups, preservedGroups)

  self.env = function (prefix) {
    argsert('[string|boolean]', [prefix], arguments.length)
    options.envPrefix = prefix === false ? void 0 : prefix || ''
    return self
  }

  self.wrap = function (cols) {
    argsert('<number|null|undefined>', [cols], arguments.length)
    usage.wrap(cols)
    return self
  }

  let strict = false
  self.strict = function (enabled) {
    argsert('[boolean]', [enabled], arguments.length)
    strict = enabled !== false
    return self
  }
  self.getStrict = () => strict

  let parserConfig = {}
  self.parserConfiguration = function (config) {
    argsert('<object>', [config], arguments.length)
    parserConfig = config
    return self
  }
  self.getParserConfiguration = () => parserConfig

  self.showHelp = function (level) {
    argsert('[string|function]', [level], arguments.length)
    self.parsed || self._parseArgs(processArgs)
    if (command.hasDefaultCommand()) {
      context.resets++
      command.runDefaultBuilderOn(self, true)
    }
    usage.showHelp(level)
    return self
  }

  let versionOpt = null
  self.version = function (opt, msg, ver) {
    const defaultVersionOpt = 'version'
    argsert('[boolean|string] [string] [string]', [opt, msg, ver], arguments.length)

    if (versionOpt) {
      deleteFromParserHintObject(versionOpt)
      usage.version(void 0)
      versionOpt = null
    }

    if (arguments.length === 0) {
      ver = guessVersion()
      opt = defaultVersionOpt
    } else if (arguments.length === 1) {
      if (opt === false) return self

      ver = opt
      opt = defaultVersionOpt
    } else if (arguments.length === 2) {
      ver = msg
      msg = null
    }

    versionOpt = typeof opt == 'string' ? opt : defaultVersionOpt
    msg = msg || usage.deferY18nLookup('Show version number')

    usage.version(ver || void 0)
    self.boolean(versionOpt)
    self.describe(versionOpt, msg)
    return self
  }

  function guessVersion() {
    return pkgUp().version || 'unknown'
  }

  let helpOpt = null
  self.addHelpOpt = self.help = function (opt, msg) {
    const defaultHelpOpt = 'help'
    argsert('[string|boolean] [string]', [opt, msg], arguments.length)

    if (helpOpt) {
      deleteFromParserHintObject(helpOpt)
      helpOpt = null
    }

    if (arguments.length === 1 && opt === false) return self

    helpOpt = typeof opt == 'string' ? opt : defaultHelpOpt
    self.boolean(helpOpt)
    self.describe(helpOpt, msg || usage.deferY18nLookup('Show help'))
    return self
  }

  const defaultShowHiddenOpt = 'show-hidden'
  options.showHiddenOpt = defaultShowHiddenOpt
  self.addShowHiddenOpt = self.showHidden = function (opt, msg) {
    argsert('[string|boolean] [string]', [opt, msg], arguments.length)

    if (arguments.length === 1 && opt === false) return self

    const showHiddenOpt = typeof opt == 'string' ? opt : defaultShowHiddenOpt
    self.boolean(showHiddenOpt)
    self.describe(showHiddenOpt, msg || usage.deferY18nLookup('Show hidden options'))
    options.showHiddenOpt = showHiddenOpt
    return self
  }

  self.hide = function (key) {
    argsert('<string|object>', [key], arguments.length)
    options.hiddenOptions.push(key)
    return self
  }

  self.showHelpOnFail = function (enabled, message) {
    argsert('[boolean|string] [string]', [enabled, message], arguments.length)
    usage.showHelpOnFail(enabled, message)
    return self
  }

  var exitProcess = true
  self.exitProcess = function (enabled) {
    argsert('[boolean]', [enabled], arguments.length)
    if (typeof enabled != 'boolean') enabled = true

    exitProcess = enabled
    return self
  }
  self.getExitProcess = () => exitProcess

  var completionCommand = null
  self.completion = function (cmd, desc, fn) {
    argsert('[string] [string|boolean|function] [function]', [cmd, desc, fn], arguments.length)

    if (typeof desc == 'function') {
      fn = desc
      desc = null
    }

    completionCommand = cmd || 'completion'
    desc || desc === false || (desc = 'generate completion script')

    self.command(completionCommand, desc)

    fn && completion.registerFunction(fn)

    return self
  }

  self.showCompletionScript = function ($0) {
    argsert('[string]', [$0], arguments.length)
    $0 = $0 || self.$0
    _logger.log(completion.generateCompletionScript($0, completionCommand))
    return self
  }

  self.getCompletion = function (args, done) {
    argsert('<array> <function>', [args, done], arguments.length)
    completion.getCompletion(args, done)
  }

  self.locale = function (locale) {
    argsert('[string]', [locale], arguments.length)
    if (arguments.length === 0) {
      guessLocale()
      return y18n.getLocale()
    }
    detectLocale = false
    y18n.setLocale(locale)
    return self
  }

  self.updateStrings = self.updateLocale = function (obj) {
    argsert('<object>', [obj], arguments.length)
    detectLocale = false
    y18n.updateLocale(obj)
    return self
  }

  let detectLocale = true
  self.detectLocale = function (detect) {
    argsert('<boolean>', [detect], arguments.length)
    detectLocale = detect
    return self
  }
  self.getDetectLocale = () => detectLocale

  var hasOutput = false,
    exitError = null
  self.exit = (code, err) => {
    hasOutput = true
    exitError = err
    exitProcess && process.exit(code)
  }

  const _logger = {
    log() {
      const args = []
      for (let i = 0; i < arguments.length; i++) args.push(arguments[i])
      self._hasParseCallback() || console.log.apply(console, args)
      hasOutput = true
      if (output.length) output += '\n'
      output += args.join(' ')
    },
    error() {
      const args = []
      for (let i = 0; i < arguments.length; i++) args.push(arguments[i])
      self._hasParseCallback() || console.error.apply(console, args)
      hasOutput = true
      if (output.length) output += '\n'
      output += args.join(' ')
    }
  }
  self._getLoggerInstance = () => _logger
  self._hasOutput = () => hasOutput

  self._setHasOutput = () => {
    hasOutput = true
  }

  let recommendCommands
  self.recommendCommands = function (recommend) {
    argsert('[boolean]', [recommend], arguments.length)
    recommendCommands = typeof recommend != 'boolean' || recommend
    return self
  }

  self.getUsageInstance = () => usage
  self.getValidationInstance = () => validation
  self.getCommandInstance = () => command

  self.terminalWidth = () => {
    argsert([], 0)
    return process.stdout.columns !== void 0 ? process.stdout.columns : null
  }

  Object.defineProperty(self, 'argv', {get: () => self._parseArgs(processArgs), enumerable: true})

  self._parseArgs = function (args, shortCircuit, _skipValidation, commandIndex) {
    let skipValidation = !!_skipValidation
    args = args || processArgs

    options.__ = y18n.__
    options.configuration = self.getParserConfiguration()

    let pkgConfig = pkgUp().yargs
    if (pkgConfig) {
      console.warn(
        'Configuring yargs through package.json is deprecated and will be removed in the next major release, please use the JS API instead.'
      )
      options.configuration = Object.assign({}, pkgConfig, options.configuration)
    }

    const parsed = Parser.detailed(args, options)
    let argv = parsed.argv
    if (parseContext) argv = Object.assign({}, argv, parseContext)
    const aliases = parsed.aliases

    argv.$0 = self.$0
    self.parsed = parsed

    try {
      guessLocale()

      if (shortCircuit) return argv

      if (
        helpOpt &&
        ~[helpOpt].concat(aliases[helpOpt] || []).filter(k => k.length > 1).indexOf(argv._[argv._.length - 1])
      ) {
        argv._.pop()
        argv[helpOpt] = true
      }

      const handlerKeys = command.getCommands(),
        requestCompletions = completion.completionKey in argv,
        skipRecommendation = argv[helpOpt] || requestCompletions,
        skipDefaultCommand = skipRecommendation && (handlerKeys.length > 1 || handlerKeys[0] !== '$0')

      if (argv._.length) {
        if (handlerKeys.length) {
          let firstUnknownCommand
          for (let cmd, i = commandIndex || 0; argv._[i] !== void 0; i++) {
            cmd = String(argv._[i])
            if (~handlerKeys.indexOf(cmd) && cmd !== completionCommand)
              return command.runCommand(cmd, self, parsed, i + 1)
            if (!firstUnknownCommand && cmd !== completionCommand) {
              firstUnknownCommand = cmd
              break
            }
          }

          if (command.hasDefaultCommand() && !skipDefaultCommand)
            return command.runCommand(null, self, parsed)

          recommendCommands && firstUnknownCommand && !skipRecommendation &&
            validation.recommendCommands(firstUnknownCommand, handlerKeys)
        }

        if (completionCommand && ~argv._.indexOf(completionCommand) && !requestCompletions) {
          exitProcess && setBlocking(true)
          self.showCompletionScript()
          self.exit(0)
        }
      } else if (command.hasDefaultCommand() && !skipDefaultCommand)
        return command.runCommand(null, self, parsed)

      if (requestCompletions) {
        exitProcess && setBlocking(true)

        const completionArgs = args.slice(args.indexOf('--' + completion.completionKey) + 1)
        completion.getCompletion(completionArgs, (completions) => {
          ;(completions || []).forEach((completion) => {
            _logger.log(completion)
          })

          self.exit(0)
        })
        return argv
      }

      hasOutput ||
        Object.keys(argv).forEach((key) => {
          if (key === helpOpt && argv[key]) {
            exitProcess && setBlocking(true)

            skipValidation = true
            self.showHelp('log')
            self.exit(0)
          } else if (key === versionOpt && argv[key]) {
            exitProcess && setBlocking(true)

            skipValidation = true
            usage.showVersion()
            self.exit(0)
          }
        })

      if (!skipValidation && options.skipValidation.length > 0)
        skipValidation = Object.keys(argv).some(
          key => options.skipValidation.indexOf(key) >= 0 && argv[key] === true
        )

      if (!skipValidation) {
        if (parsed.error) throw new YError(parsed.error.message)

        requestCompletions || self._runValidation(argv, aliases, {}, parsed.error)
      }
    } catch (err) {
      if (!(err instanceof YError)) throw err
      usage.fail(err.message, err)
    }

    return argv
  }

  self._runValidation = function (argv, aliases, positionalMap, parseErrors) {
    if (parseErrors) throw new YError(parseErrors.message || parseErrors)
    validation.nonOptionCount(argv)
    validation.requiredArguments(argv)
    strict && validation.unknownArguments(argv, aliases, positionalMap)
    validation.customChecks(argv, aliases)
    validation.limitedChoices(argv)
    validation.implications(argv)
    validation.conflicting(argv)
  }

  function guessLocale() {
    if (!detectLocale) return

    try {
      const env = process.env,
        locale = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE || 'en_US'
      self.locale(locale.replace(/[.:].*/, ''))
    } catch (_) {}
  }

  self.help()
  self.version()

  return self
}

exports.rebase = rebase
function rebase(base, dir) {
  return path.relative(base, dir)
}

},
// 16
function (module) {

const preserveCamelCase = string => {
	let isLastCharLower = false,
		isLastCharUpper = false,
		isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && /[a-zA-Z]/.test(character) && character.toUpperCase() === character) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (
			isLastCharUpper && isLastLastCharUpper && /[a-zA-Z]/.test(character) && character.toLowerCase() === character
		) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = character.toLowerCase() === character && character.toUpperCase() !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = character.toUpperCase() === character && character.toLowerCase() !== character;
		}
	}

	return string;
};

const camelCase = (input, options) => {
	if (typeof input != 'string' && !Array.isArray(input))
		throw new TypeError('Expected the input to be `string | string[]`');

	options = Object.assign({pascalCase: false}, options);

	const postProcess = x => (options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x);

	input = Array.isArray(input)
		? input.map(x => x.trim()).filter(x => x.length).join('-')
		: input.trim();

	if (input.length === 0) return '';

	if (input.length === 1) return options.pascalCase ? input.toUpperCase() : input.toLowerCase();

	if (input !== input.toLowerCase()) input = preserveCamelCase(input);

	input = input
		.replace(/^[_.\- ]+/, '')
		.toLowerCase()
		.replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
		.replace(/\d+(\w|$)/g, m => m.toUpperCase());

	return postProcess(input);
};

module.exports = camelCase;
module.exports.default = camelCase;

},
// 17
function (module) {

module.exports = function (str, sep) {
	if (typeof str != 'string') throw new TypeError('Expected a string');

	sep = sep === void 0 ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};

},
// 18
function (module) {

module.exports = function (argString) {
  if (Array.isArray(argString)) return argString.map(e => (typeof e != 'string' ? e + '' : e))

  argString = argString.trim()

  var args = []

  for (var i = 0, prevC = null, c = null, opening = null, ii = 0; ii < argString.length; ii++) {
    prevC = c

    if ((c = argString.charAt(ii)) === ' ' && !opening) {
      prevC === ' ' || i++

      continue
    }

    c === opening ? (opening = null) : (c !== "'" && c !== '"') || opening || (opening = c)

    args[i] || (args[i] = '')
    args[i] += c
  }

  return args
}

},
// 19
function (module, exports, __webpack_require__) {

var fs = __webpack_require__(1),
  join = __webpack_require__(0).join,
  resolve = __webpack_require__(0).resolve,
  dirname = __webpack_require__(0).dirname;
var defaultOptions = {
  extensions: ['js', 'json', 'coffee'],
  recurse: true,
  rename: function (name) {
    return name;
  },
  visit: function (obj) {
    return obj;
  }
};

function checkFileInclusion(path, filename, options) {
  return (
    new RegExp('\\.(' + options.extensions.join('|') + ')$', 'i').test(filename) &&
    !(options.include && options.include instanceof RegExp && !options.include.test(path)) &&
    !(options.include && typeof options.include == 'function' && !options.include(path, filename)) &&
    !(options.exclude && options.exclude instanceof RegExp && options.exclude.test(path)) &&
    !(options.exclude && typeof options.exclude == 'function' && options.exclude(path, filename))
  );
}

function requireDirectory(m, path, options) {
  var retval = {};

  if (path && !options && typeof path != 'string') {
    options = path;
    path = null;
  }

  options = options || {};
  for (var prop in defaultOptions) if (options[prop] === void 0) options[prop] = defaultOptions[prop];

  path = path ? resolve(dirname(m.filename), path) : dirname(m.filename);

  fs.readdirSync(path).forEach(function (filename) {
    var files, key, obj,
      joined = join(path, filename);

    if (fs.statSync(joined).isDirectory() && options.recurse) {
      files = requireDirectory(m, joined, options);
      if (Object.keys(files).length) retval[options.rename(filename, joined, filename)] = files;
    } else if (joined !== m.filename && checkFileInclusion(joined, filename, options)) {
      key = filename.substring(0, filename.lastIndexOf('.'));
      obj = m.require(joined);
      retval[options.rename(key, joined, filename)] = options.visit(obj, joined, filename) || obj;
    }
  });

  return retval;
}

module.exports = requireDirectory;
module.exports.defaults = defaultOptions;

},
// 20
function (module, exports, __webpack_require__) {

module.exports = function (exported) {
  for (var mod, i = 0, files = Object.keys(__webpack_require__.c); i < files.length; i++)
    if ((mod = __webpack_require__.c[files[i]]).exports === exported) return mod

  return null
}

},
// 21
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0)

module.exports = function (yargs, usage, command) {
  const self = {completionKey: 'get-yargs-completions'},

    zshShell = process.env.SHELL && process.env.SHELL.indexOf('zsh') > -1
  self.getCompletion = function (args, done) {
    const completions = [],
      current = args.length ? args[args.length - 1] : '',
      argv = yargs.parse(args, true),
      aliases = yargs.parsed.aliases,
      parentCommands = yargs.getContext().commands

    if (completionFunction) {
      if (completionFunction.length < 3) {
        const result = completionFunction(current, argv)

        return typeof result.then == 'function'
          ? result.then((list) => {
              process.nextTick(() => { done(list) })
            }).catch((err) => {
              process.nextTick(() => { throw err })
            })
          : done(result)
      }
      return completionFunction(current, argv, (completions) => {
        done(completions)
      })
    }

    const handlers = command.getCommandHandlers()
    for (let i = 0, ii = args.length; i < ii; ++i)
      if (handlers[args[i]] && handlers[args[i]].builder) {
        const builder = handlers[args[i]].builder
        if (typeof builder == 'function') {
          const y = yargs.reset()
          builder(y)
          return y.argv
        }
      }

    current.match(/^-/) || parentCommands[parentCommands.length - 1] === current ||
      usage.getCommands().forEach((usageCommand) => {
        const commandName = command.parseCommand(usageCommand[0]).cmd
        if (args.indexOf(commandName) < 0)
          if (zshShell) {
            const desc = usageCommand[1] || ''
            completions.push(commandName.replace(/:/g, '\\:') + ':' + desc)
          } else completions.push(commandName)
      })

    if (current.match(/^-/) || (current === '' && completions.length === 0)) {
      const descs = usage.getDescriptions()
      Object.keys(yargs.getOptions().key).forEach((key) => {
        if ([key].concat(aliases[key] || []).every(val => args.indexOf('--' + val) < 0))
          if (zshShell) {
            const desc = descs[key] || ''
            completions.push(`--${key.replace(/:/g, '\\:')}:${desc.replace('__yargsString__:', '')}`)
          } else completions.push('--' + key)
      })
    }

    done(completions)
  }

  self.generateCompletionScript = function ($0, cmd) {
    const templates = __webpack_require__(22)
    let script = zshShell ? templates.completionZshTemplate : templates.completionShTemplate
    const name = path.basename($0)

    if ($0.match(/\.js$/)) $0 = './' + $0

    script = script.replace(/{{app_name}}/g, name)
    script = script.replace(/{{completion_command}}/g, cmd)
    return script.replace(/{{app_path}}/g, $0)
  }

  let completionFunction = null
  self.registerFunction = (fn) => {
    completionFunction = fn
  }

  return self
}

},
// 22
function (module, exports) {

exports.completionShTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_yargs_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask yargs to generate completions.
    type_list=$({{app_path}} --get-yargs-completions "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o default -F _yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`

exports.completionZshTemplate = `###-begin-{{app_name}}-completions-###
#
# yargs command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zsh_profile on OSX.
#
_{{app_name}}_yargs_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} --get-yargs-completions "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_yargs_completions {{app_name}}
###-end-{{app_name}}-completions-###
`

},
// 23
function (module, exports, __webpack_require__) {

const decamelize = __webpack_require__(24),
  stringWidth = __webpack_require__(5),
  objFilter = __webpack_require__(7),
  path = __webpack_require__(0),
  setBlocking = __webpack_require__(12),
  YError = __webpack_require__(2)

module.exports = function (yargs, y18n) {
  const __ = y18n.__,
    self = {},

    fails = []
  self.failFn = function (f) {
    fails.push(f)
  }

  let failMessage = null,
    showHelpOnFail = true
  self.showHelpOnFail = function (enabled, message) {
    if (typeof enabled == 'string') {
      message = enabled
      enabled = true
    } else if (enabled === void 0) enabled = true

    failMessage = message
    showHelpOnFail = enabled
    return self
  }

  let failureOutput = false
  self.fail = function (msg, err) {
    const logger = yargs._getLoggerInstance()

    if (!fails.length) {
      yargs.getExitProcess() && setBlocking(true)

      if (!failureOutput) {
        failureOutput = true
        if (showHelpOnFail) {
          yargs.showHelp('error')
          logger.error()
        }
        if (msg || err) logger.error(msg || err)
        if (failMessage) {
          if (msg || err) logger.error('')
          logger.error(failMessage)
        }
      }

      err = err || new YError(msg)
      if (yargs.getExitProcess()) return yargs.exit(1)
      if (yargs._hasParseCallback()) return yargs.exit(1, err)

      throw err
    }
    for (let i = fails.length - 1; i >= 0; --i) fails[i](msg, err, self)
  }

  let usages = [],
    usageDisabled = false
  self.usage = (msg, description) => {
    if (msg === null) {
      usageDisabled = true
      usages = []
      return
    }
    usageDisabled = false
    usages.push([msg, description || ''])
    return self
  }
  self.getUsage = () => usages
  self.getUsageDisabled = () => usageDisabled

  self.getPositionalGroupName = () => __('Positionals:')

  let examples = []
  self.example = (cmd, description) => {
    examples.push([cmd, description || ''])
  }

  let commands = []
  self.command = function (cmd, description, isDefault, aliases) {
    if (isDefault)
      commands = commands.map((cmdArray) => {
        cmdArray[2] = false
        return cmdArray
      })

    commands.push([cmd, description || '', isDefault, aliases])
  }
  self.getCommands = () => commands

  let descriptions = {}
  self.describe = function (key, desc) {
    typeof key == 'object'
      ? Object.keys(key).forEach((k) => {
          self.describe(k, key[k])
        })
      : (descriptions[key] = desc)
  }
  self.getDescriptions = () => descriptions

  let epilog
  self.epilog = (msg) => {
    epilog = msg
  }

  let wrap,
    wrapSet = false
  self.wrap = (cols) => {
    wrapSet = true
    wrap = cols
  }

  function getWrap() {
    if (!wrapSet) {
      wrap = windowWidth()
      wrapSet = true
    }

    return wrap
  }

  const deferY18nLookupPrefix = '__yargsString__:'
  self.deferY18nLookup = str => deferY18nLookupPrefix + str

  const defaultGroup = 'Options:'
  self.help = function () {
    normalizeAliases()

    const base$0 = path.basename(yargs.$0),
      demandedOptions = yargs.getDemandedOptions(),
      demandedCommands = yargs.getDemandedCommands(),
      groups = yargs.getGroups(),
      options = yargs.getOptions()

    let keys = []
    keys = keys.concat(Object.keys(descriptions))
    keys = keys.concat(Object.keys(demandedOptions))
    keys = keys.concat(Object.keys(demandedCommands))
    keys = keys.concat(Object.keys(options.default))
    keys = keys.filter(filterHiddenOptions)
    keys = Object.keys(keys.reduce((acc, key) => {
      if (key !== '_') acc[key] = true
      return acc
    }, {}))

    const theWrap = getWrap(),
      ui = __webpack_require__(28)({width: theWrap, wrap: !!theWrap})

    if (!usageDisabled)
      if (usages.length) {
        usages.forEach((usage) => {
          ui.div('' + usage[0].replace(/\$0/g, base$0))
          usage[1] && ui.div({text: '' + usage[1], padding: [1, 0, 0, 0]})
        })
        ui.div()
      } else if (commands.length) {
        let u = demandedCommands._ ? `${base$0} <${__('command')}>\n` : `${base$0} [${__('command')}]\n`

        ui.div('' + u)
      }

    if (commands.length) {
      ui.div(__('Commands:'))

      const context = yargs.getContext(),
        parentCommands = context.commands.length ? context.commands.join(' ') + ' ' : ''

      if (yargs.getParserConfiguration()['sort-commands'] === true)
        commands = commands.sort((a, b) => a[0].localeCompare(b[0]))

      commands.forEach((command) => {
        const commandString = `${base$0} ${parentCommands}${command[0].replace(/^\$0 ?/, '')}`
        ui.span(
          {
            text: commandString,
            padding: [0, 2, 0, 2],
            width: maxWidth(commands, theWrap, `${base$0}${parentCommands}`) + 4
          },
          {text: command[1]}
        )
        const hints = []
        command[2] && hints.push(`[${__('default:').slice(0, -1)}]`)
        command[3] && command[3].length && hints.push(`[${__('aliases:')} ${command[3].join(', ')}]`)

        hints.length ? ui.div({text: hints.join(' '), padding: [0, 0, 0, 2], align: 'right'}) : ui.div()
      })

      ui.div()
    }

    const aliasKeys = (Object.keys(options.alias) || []).concat(Object.keys(yargs.parsed.newAliases) || [])

    keys = keys.filter(key =>
      !yargs.parsed.newAliases[key] && aliasKeys.every(alias => (options.alias[alias] || []).indexOf(key) < 0)
    )

    groups[defaultGroup] || (groups[defaultGroup] = [])
    addUngroupedKeys(keys, options.alias, groups)

    Object.keys(groups).forEach((groupName) => {
      if (!groups[groupName].length) return

      const normalizedKeys = groups[groupName].filter(filterHiddenOptions).map((key) => {
        if (~aliasKeys.indexOf(key)) return key
        for (let aliasKey, i = 0; (aliasKey = aliasKeys[i]) !== void 0; i++)
          if (~(options.alias[aliasKey] || []).indexOf(key)) return aliasKey

        return key
      })

      if (normalizedKeys.length < 1) return

      ui.div(__(groupName))

      const switches = normalizedKeys.reduce((acc, key) => {
        acc[key] = [key].concat(options.alias[key] || [])
          .map(sw => (groupName === self.getPositionalGroupName() ? sw : (sw.length > 1 ? '--' : '-') + sw))
          .join(', ')

        return acc
      }, {})

      normalizedKeys.forEach((key) => {
        const kswitch = switches[key]
        let desc = descriptions[key] || '',
          type = null

        if (~desc.lastIndexOf(deferY18nLookupPrefix)) desc = __(desc.substring(deferY18nLookupPrefix.length))

        if (~options.boolean.indexOf(key)) type = `[${__('boolean')}]`
        if (~options.count.indexOf(key)) type = `[${__('count')}]`
        if (~options.string.indexOf(key)) type = `[${__('string')}]`
        if (~options.normalize.indexOf(key)) type = `[${__('string')}]`
        if (~options.array.indexOf(key)) type = `[${__('array')}]`
        if (~options.number.indexOf(key)) type = `[${__('number')}]`

        const extra = [
          type,
          key in demandedOptions ? `[${__('required')}]` : null,
          options.choices && options.choices[key]
            ? `[${__('choices:')} ${self.stringifiedValues(options.choices[key])}]`
            : null,
          defaultString(options.default[key], options.defaultDescription[key])
        ].filter(Boolean).join(' ')

        ui.span({text: kswitch, padding: [0, 2, 0, 2], width: maxWidth(switches, theWrap) + 4}, desc)

        extra ? ui.div({text: extra, padding: [0, 0, 0, 2], align: 'right'}) : ui.div()
      })

      ui.div()
    })

    if (examples.length) {
      ui.div(__('Examples:'))

      examples.forEach((example) => {
        example[0] = example[0].replace(/\$0/g, base$0)
      })

      examples.forEach((example) => {
        example[1] === ''
          ? ui.div({text: example[0], padding: [0, 2, 0, 2]})
          : ui.div(
              {text: example[0], padding: [0, 2, 0, 2], width: maxWidth(examples, theWrap) + 4},
              {text: example[1]}
            )
      })

      ui.div()
    }

    if (epilog) {
      const e = epilog.replace(/\$0/g, base$0)
      ui.div(e + '\n')
    }

    return ui.toString().replace(/\s*$/, '')
  }

  function maxWidth(table, theWrap, modifier) {
    let width = 0

    Array.isArray(table) || (table = Object.keys(table).map(key => [table[key]]))

    table.forEach((v) => {
      width = Math.max(stringWidth(modifier ? `${modifier} ${v[0]}` : v[0]), width)
    })

    if (theWrap) width = Math.min(width, parseInt(theWrap * 0.5, 10))

    return width
  }

  function normalizeAliases() {
    const demandedOptions = yargs.getDemandedOptions(),
      options = yargs.getOptions()

    ;(Object.keys(options.alias) || []).forEach((key) => {
      options.alias[key].forEach((alias) => {
        descriptions[alias] && self.describe(key, descriptions[alias])
        alias in demandedOptions && yargs.demandOption(key, demandedOptions[alias])
        ~options.boolean.indexOf(alias) && yargs.boolean(key)
        ~options.count.indexOf(alias) && yargs.count(key)
        ~options.string.indexOf(alias) && yargs.string(key)
        ~options.normalize.indexOf(alias) && yargs.normalize(key)
        ~options.array.indexOf(alias) && yargs.array(key)
        ~options.number.indexOf(alias) && yargs.number(key)
      })
    })
  }

  function addUngroupedKeys(keys, aliases, groups) {
    let groupedKeys = [],
      toCheck = null
    Object.keys(groups).forEach((group) => {
      groupedKeys = groupedKeys.concat(groups[group])
    })

    keys.forEach((key) => {
      toCheck = [key].concat(aliases[key])
      toCheck.some(k => groupedKeys.indexOf(k) > -1) || groups[defaultGroup].push(key)
    })
    return groupedKeys
  }

  function filterHiddenOptions(key) {
    return yargs.getOptions().hiddenOptions.indexOf(key) < 0 || yargs.parsed.argv[yargs.getOptions().showHiddenOpt]
  }

  self.showHelp = (level) => {
    const logger = yargs._getLoggerInstance()
    level || (level = 'error')
    ;(typeof level == 'function' ? level : logger[level])(self.help())
  }

  self.functionDescription = (fn) => ['(', fn.name ? decamelize(fn.name, '-') : __('generated-value'), ')'].join('')

  self.stringifiedValues = function (values, separator) {
    let string = ''
    const sep = separator || ', ',
      array = [].concat(values)

    if (!values || !array.length) return string

    array.forEach((value) => {
      if (string.length) string += sep
      string += JSON.stringify(value)
    })

    return string
  }

  function defaultString(value, defaultDescription) {
    let string = `[${__('default:')} `

    if (value === void 0 && !defaultDescription) return null

    if (defaultDescription) string += defaultDescription
    else
      switch (typeof value) {
        case 'string':
          string += `"${value}"`
          break
        case 'object':
          string += JSON.stringify(value)
          break
        default:
          string += value
      }

    return string + ']'
  }

  function windowWidth() {
    const maxWidth = 80
    return typeof process == 'object' && process.stdout && process.stdout.columns
      ? Math.min(maxWidth, process.stdout.columns)
      : maxWidth
  }

  let version = null
  self.version = (ver) => {
    version = ver
  }

  self.showVersion = () => {
    yargs._getLoggerInstance().log(version)
  }

  self.reset = function (localLookup) {
    failMessage = null
    failureOutput = false
    usages = []
    usageDisabled = false
    epilog = void 0
    examples = []
    commands = []
    descriptions = objFilter(descriptions, (k, v) => !localLookup[k])
    return self
  }

  let frozen
  self.freeze = function () {
    frozen = {}
    frozen.failMessage = failMessage
    frozen.failureOutput = failureOutput
    frozen.usages = usages
    frozen.usageDisabled = usageDisabled
    frozen.epilog = epilog
    frozen.examples = examples
    frozen.commands = commands
    frozen.descriptions = descriptions
  }
  self.unfreeze = function () {
    failMessage = frozen.failMessage
    failureOutput = frozen.failureOutput
    usages = frozen.usages
    usageDisabled = frozen.usageDisabled
    epilog = frozen.epilog
    examples = frozen.examples
    commands = frozen.commands
    descriptions = frozen.descriptions
    frozen = void 0
  }

  return self
}

},
// 24
function (module) {

module.exports = (text, separator) => {
  separator = separator === void 0 ? '_' : separator

  return text
    .replace(/([a-z\d])([A-Z])/g, `$1${separator}$2`)
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, `$1${separator}$2`)
    .toLowerCase()
}

},
// 25
function (module) {

module.exports = options => {
	options = Object.assign({onlyFirst: false}, options);

	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, options.onlyFirst ? void 0 : 'g');
};

},
// 26
function (module) {

module.exports = x =>
	!Number.isNaN(x) &&
	x >= 0x1100 &&
	(x <= 0x115f ||
		x === 0x2329 ||
		x === 0x232a ||
		(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
		(0x3250 <= x && x <= 0x4dbf) ||
		(0x4e00 <= x && x <= 0xa4c6) ||
		(0xa960 <= x && x <= 0xa97c) ||
		(0xac00 <= x && x <= 0xd7a3) ||
		(0xf900 <= x && x <= 0xfaff) ||
		(0xfe10 <= x && x <= 0xfe19) ||
		(0xfe30 <= x && x <= 0xfe6b) ||
		(0xff01 <= x && x <= 0xff60) ||
		(0xffe0 <= x && x <= 0xffe6) ||
		(0x1b000 <= x && x <= 0x1b001) ||
		(0x1f200 <= x && x <= 0x1f251) ||
		(0x20000 <= x && x <= 0x3fffd));

},
// 27
function (module) {

module.exports = function () {
  return /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g;
};

},
// 28
function (module, exports, __webpack_require__) {

var stringWidth = __webpack_require__(5),
  stripAnsi = __webpack_require__(6),
  wrap = __webpack_require__(29),
  align = {right: alignRight, center: alignCenter},
  top = 0,
  right = 1,
  bottom = 2,
  left = 3

function UI(opts) {
  this.width = opts.width
  this.wrap = opts.wrap
  this.rows = []
}

UI.prototype.span = function () {
  this.div.apply(this, arguments).span = true
}

UI.prototype.resetOutput = function () {
  this.rows = []
}

UI.prototype.div = function () {
  arguments.length > 0 || this.div('')
  if (this.wrap && this._shouldApplyLayoutDSL.apply(this, arguments))
    return this._applyLayoutDSL(arguments[0])

  var cols = []

  for (var arg, i = 0; (arg = arguments[i]) !== void 0; i++)
    typeof arg == 'string' ? cols.push(this._colFromString(arg)) : cols.push(arg)

  this.rows.push(cols)
  return cols
}

UI.prototype._shouldApplyLayoutDSL = function () {
  return arguments.length === 1 && typeof arguments[0] == 'string' && /[\t\n]/.test(arguments[0])
}

UI.prototype._applyLayoutDSL = function (str) {
  var _this = this,
    rows = str.split('\n'),
    leftColumnWidth = 0

  rows.forEach(function (row) {
    var columns = row.split('\t')
    if (columns.length > 1 && stringWidth(columns[0]) > leftColumnWidth)
      leftColumnWidth = Math.min(Math.floor(_this.width * 0.5), stringWidth(columns[0]))
  })

  rows.forEach(function (row) {
    var columns = row.split('\t')
    _this.div.apply(_this, columns.map(function (r, i) {
      return {
        text: r.trim(),
        padding: _this._measurePadding(r),
        width: i === 0 && columns.length > 1 ? leftColumnWidth : void 0
      }
    }))
  })

  return this.rows[this.rows.length - 1]
}

UI.prototype._colFromString = function (str) {
  return {text: str, padding: this._measurePadding(str)}
}

UI.prototype._measurePadding = function (str) {
  var noAnsi = stripAnsi(str)
  return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length]
}

UI.prototype.toString = function () {
  var _this = this,
    lines = []

  _this.rows.forEach(function (row, i) {
    _this.rowToString(row, lines)
  })

  return (lines = lines.filter(function (line) { // redundant
    return !line.hidden
  })).map(function (line) {
    return line.text
  }).join('\n')
}

UI.prototype.rowToString = function (row, lines) {
  var padding,
    ts,
    width,
    wrapWidth,
    _this = this,
    rrows = this._rasterize(row),
    str = ''

  rrows.forEach(function (rrow, r) {
    str = ''
    rrow.forEach(function (col, c) {
      ts = ''
      width = row[c].width
      wrapWidth = _this._negatePadding(row[c])

      ts += col

      for (var i = 0; i < wrapWidth - stringWidth(col); i++) ts += ' '

      if (row[c].align && row[c].align !== 'left' && _this.wrap) {
        ts = align[row[c].align](ts, wrapWidth)
        if (stringWidth(ts) < wrapWidth) ts += new Array(width - stringWidth(ts)).join(' ')
      }

      if ((padding = row[c].padding || [0, 0, 0, 0])[left]) str += new Array(padding[left] + 1).join(' ')
      str += addBorder(row[c], ts, '| ')
      str += ts
      str += addBorder(row[c], ts, ' |')
      if (padding[right]) str += new Array(padding[right] + 1).join(' ')

      if (r === 0 && lines.length > 0) str = _this._renderInline(str, lines[lines.length - 1])
    })

    lines.push({text: str.replace(/ +$/, ''), span: row.span})
  })

  return lines
}

function addBorder(col, ts, style) {
  return col.border ? (/[.']-+[.']/.test(ts) ? '' : ts.trim().length ? style : '  ') : ''
}

UI.prototype._renderInline = function (source, previousLine) {
  var leadingWhitespace = source.match(/^ */)[0].length,
    target = previousLine.text,
    targetTextWidth = stringWidth(target.trimRight())

  if (!previousLine.span) return source

  if (!this.wrap) {
    previousLine.hidden = true
    return target + source
  }

  if (leadingWhitespace < targetTextWidth) return source

  previousLine.hidden = true

  return target.trimRight() + new Array(leadingWhitespace - targetTextWidth + 1).join(' ') + source.trimLeft()
}

UI.prototype._rasterize = function (row) {
  var i,
    rrow,
    wrapped,
    _this = this,
    rrows = [],
    widths = this._columnWidths(row)

  row.forEach(function (col, c) {
    col.width = widths[c]
    wrapped = _this.wrap
      ? wrap(col.text, _this._negatePadding(col), {hard: true}).split('\n')
      : col.text.split('\n')

    if (col.border) {
      wrapped.unshift('.' + new Array(_this._negatePadding(col) + 3).join('-') + '.')
      wrapped.push("'" + new Array(_this._negatePadding(col) + 3).join('-') + "'")
    }

    if (col.padding) {
      for (i = 0; i < (col.padding[top] || 0); i++) wrapped.unshift('')
      for (i = 0; i < (col.padding[bottom] || 0); i++) wrapped.push('')
    }

    wrapped.forEach(function (str, r) {
      rrows[r] || rrows.push([])

      rrow = rrows[r]

      for (var i = 0; i < c; i++) rrow[i] !== void 0 || rrow.push('')

      rrow.push(str)
    })
  })

  return rrows
}

UI.prototype._negatePadding = function (col) {
  var wrapWidth = col.width
  if (col.padding) wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0)
  if (col.border) wrapWidth -= 4
  return wrapWidth
}

UI.prototype._columnWidths = function (row) {
  var unsetWidth,
    _this = this,
    widths = [],
    unset = row.length,
    remainingWidth = this.width

  row.forEach(function (col, i) {
    if (col.width) {
      unset--
      widths[i] = col.width
      remainingWidth -= col.width
    } else widths[i] = void 0
  })

  if (unset) unsetWidth = Math.floor(remainingWidth / unset)
  widths.forEach(function (w, i) {
    if (!_this.wrap) widths[i] = row[i].width || stringWidth(row[i].text)
    else if (w === void 0) widths[i] = Math.max(unsetWidth, _minWidth(row[i]))
  })

  return widths
}

function _minWidth(col) {
  var padding = col.padding || [],
    minWidth = 1 + (padding[left] || 0) + (padding[right] || 0)
  if (col.border) minWidth += 4
  return minWidth
}

function getWindowWidth() {
  if (typeof process == 'object' && process.stdout && process.stdout.columns) return process.stdout.columns
}

function alignRight(str, width) {
  str = str.trim()
  var padding = '',
    strWidth = stringWidth(str)

  if (strWidth < width) padding = new Array(width - strWidth + 1).join(' ')

  return padding + str
}

function alignCenter(str, width) {
  str = str.trim()
  var padding = '',
    strWidth = stringWidth(str)

  if (strWidth < width) padding = new Array(parseInt((width - strWidth) / 2, 10) + 1).join(' ')

  return padding + str
}

module.exports = function (opts) {
  return new UI({
    width: (opts = opts || {}).width || getWindowWidth() || 80,
    wrap: typeof opts.wrap != 'boolean' || opts.wrap
  })
}

},
// 29
function (module, exports, __webpack_require__) {

const stringWidth = __webpack_require__(5),
	stripAnsi = __webpack_require__(6),
	ansiStyles = __webpack_require__(30),

	ESCAPES = new Set(['\x1B', '\x9B']),
	END_CODE = 39,

	wrapAnsi = code => `${ESCAPES.values().next().value}[${code}m`,

	wordLengths = string => string.split(' ').map(character => stringWidth(character));

const wrapWord = (rows, word, columns) => {
	const characters = [...word];

	let insideEscape = false,
		visible = stringWidth(stripAnsi(rows[rows.length - 1]));

	for (const [index, character] of characters.entries()) {
		const characterLength = stringWidth(character);

		if (visible + characterLength <= columns) rows[rows.length - 1] += character;
		else {
			rows.push(character);
			visible = 0;
		}

		if (ESCAPES.has(character)) insideEscape = true;
		else if (insideEscape && character === 'm') {
			insideEscape = false;
			continue;
		}

		if (!insideEscape) {
			visible += characterLength;

			if (visible === columns && index < characters.length - 1) {
				rows.push('');
				visible = 0;
			}
		}
	}

	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1)
		rows[rows.length - 2] += rows.pop();
};

const stringVisibleTrimSpacesRight = str => {
	const words = str.split(' ');
	let last = words.length;

	while (last > 0 && stringWidth(words[last - 1]) <= 0) last--;

	return last === words.length ? str : words.slice(0, last).join(' ') + words.slice(last).join('');
};

const exec = (string, columns, options = {}) => {
	if (options.trim !== false && string.trim() === '') return '';

	let escapeCode,
		pre = '',
		ret = '';

	const lengths = wordLengths(string);
	let rows = [''];

	for (const [index, word] of string.split(' ').entries()) {
		if (options.trim !== false) rows[rows.length - 1] = rows[rows.length - 1].trimLeft();

		let rowLength = stringWidth(rows[rows.length - 1]);

		if (index !== 0) {
			if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
				rows.push('');
				rowLength = 0;
			}

			if (rowLength > 0 || options.trim === false) {
				rows[rows.length - 1] += ' ';
				rowLength++;
			}
		}

		if (options.hard && lengths[index] > columns) {
			const remainingColumns = columns - rowLength,
				breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
			Math.floor((lengths[index] - 1) / columns) < breaksStartingThisLine && rows.push('');

			wrapWord(rows, word, columns);
			continue;
		}

		if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
			if (options.wordWrap === false && rowLength < columns) {
				wrapWord(rows, word, columns);
				continue;
			}

			rows.push('');
		}

		rowLength + lengths[index] > columns && options.wordWrap === false
			? wrapWord(rows, word, columns)
			: (rows[rows.length - 1] += word);
	}

	if (options.trim !== false) rows = rows.map(stringVisibleTrimSpacesRight);

	pre = rows.join('\n');

	for (const [index, character] of [...pre].entries()) {
		ret += character;

		if (ESCAPES.has(character)) {
			const code = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
			escapeCode = code === END_CODE ? null : code;
		}

		const code = ansiStyles.codes.get(Number(escapeCode));

		if (escapeCode && code)
			if (pre[index + 1] === '\n') ret += wrapAnsi(code);
			else if (character === '\n') ret += wrapAnsi(escapeCode);
	}

	return ret;
};

module.exports = (string, columns, options) =>
	String(string)
		.normalize()
		.split('\n')
		.map(line => exec(line, columns, options))
		.join('\n');

},
// 30
function (module, exports, __webpack_require__) {

const colorConvert = __webpack_require__(31);

const wrapAnsi16 = (fn, offset) => function () {
	return `\x1B[${fn.apply(colorConvert, arguments) + offset}m`;
};

const wrapAnsi256 = (fn, offset) => function () {
	const code = fn.apply(colorConvert, arguments);
	return `\x1B[${38 + offset};5;${code}m`;
};

const wrapAnsi16m = (fn, offset) => function () {
	const rgb = fn.apply(colorConvert, arguments);
	return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
};

function assembleStyles() {
	const codes = new Map();
	const styles = {
		modifier: {
			reset: [0, 0],
			bold: [1, 22],
			dim: [2, 22],
			italic: [3, 23],
			underline: [4, 24],
			inverse: [7, 27],
			hidden: [8, 28],
			strikethrough: [9, 29]
		},
		color: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39],

			redBright: [91, 39],
			greenBright: [92, 39],
			yellowBright: [93, 39],
			blueBright: [94, 39],
			magentaBright: [95, 39],
			cyanBright: [96, 39],
			whiteBright: [97, 39]
		},
		bgColor: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49],

			bgBlackBright: [100, 49],
			bgRedBright: [101, 49],
			bgGreenBright: [102, 49],
			bgYellowBright: [103, 49],
			bgBlueBright: [104, 49],
			bgMagentaBright: [105, 49],
			bgCyanBright: [106, 49],
			bgWhiteBright: [107, 49]
		}
	};

	styles.color.grey = styles.color.gray;

	for (const groupName of Object.keys(styles)) {
		const group = styles[groupName];

		for (const styleName of Object.keys(group)) {
			const style = group[styleName];

			styles[styleName] = {open: `\x1B[${style[0]}m`, close: `\x1B[${style[1]}m`};

			group[styleName] = styles[styleName];

			codes.set(style[0], style[1]);
		}

		Object.defineProperty(styles, groupName, {value: group, enumerable: false});

		Object.defineProperty(styles, 'codes', {value: codes, enumerable: false});
	}

	const ansi2ansi = n => n,
		rgb2rgb = (r, g, b) => [r, g, b];

	styles.color.close = '\x1B[39m';
	styles.bgColor.close = '\x1B[49m';

	styles.color.ansi = {ansi: wrapAnsi16(ansi2ansi, 0)};
	styles.color.ansi256 = {ansi256: wrapAnsi256(ansi2ansi, 0)};
	styles.color.ansi16m = {rgb: wrapAnsi16m(rgb2rgb, 0)};

	styles.bgColor.ansi = {ansi: wrapAnsi16(ansi2ansi, 10)};
	styles.bgColor.ansi256 = {ansi256: wrapAnsi256(ansi2ansi, 10)};
	styles.bgColor.ansi16m = {rgb: wrapAnsi16m(rgb2rgb, 10)};

	for (let key of Object.keys(colorConvert)) {
		if (typeof colorConvert[key] != 'object') continue;

		const suite = colorConvert[key];

		if (key === 'ansi16') key = 'ansi';

		if ('ansi16' in suite) {
			styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0);
			styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10);
		}

		if ('ansi256' in suite) {
			styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0);
			styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10);
		}

		if ('rgb' in suite) {
			styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0);
			styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10);
		}
	}

	return styles;
}

module.exports = assembleStyles();

},
// 31
function (module, exports, __webpack_require__) {

var conversions = __webpack_require__(13),
	route = __webpack_require__(33),

	convert = {};

function wrapRaw(fn) {
	var wrappedFn = function (args) {
		if (args === void 0 || args === null) return args;

		if (arguments.length > 1) args = Array.prototype.slice.call(arguments);

		return fn(args);
	};

	if ('conversion' in fn) wrappedFn.conversion = fn.conversion;

	return wrappedFn;
}

function wrapRounded(fn) {
	var wrappedFn = function (args) {
		if (args === void 0 || args === null) return args;

		if (arguments.length > 1) args = Array.prototype.slice.call(arguments);

		var result = fn(args);

		if (typeof result == 'object')
			for (var len = result.length, i = 0; i < len; i++) result[i] = Math.round(result[i]);

		return result;
	};

	if ('conversion' in fn) wrappedFn.conversion = fn.conversion;

	return wrappedFn;
}

Object.keys(conversions).forEach(function (fromModel) {
	convert[fromModel] = {};

	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

	var routes = route(fromModel);

	Object.keys(routes).forEach(function (toModel) {
		var fn = routes[toModel];

		convert[fromModel][toModel] = wrapRounded(fn);
		convert[fromModel][toModel].raw = wrapRaw(fn);
	});
});

module.exports = convert;

},
// 32
function (module) {

module.exports = {
	aliceblue: [240, 248, 255],
	antiquewhite: [250, 235, 215],
	aqua: [0, 255, 255],
	aquamarine: [127, 255, 212],
	azure: [240, 255, 255],
	beige: [245, 245, 220],
	bisque: [255, 228, 196],
	black: [0, 0, 0],
	blanchedalmond: [255, 235, 205],
	blue: [0, 0, 255],
	blueviolet: [138, 43, 226],
	brown: [165, 42, 42],
	burlywood: [222, 184, 135],
	cadetblue: [95, 158, 160],
	chartreuse: [127, 255, 0],
	chocolate: [210, 105, 30],
	coral: [255, 127, 80],
	cornflowerblue: [100, 149, 237],
	cornsilk: [255, 248, 220],
	crimson: [220, 20, 60],
	cyan: [0, 255, 255],
	darkblue: [0, 0, 139],
	darkcyan: [0, 139, 139],
	darkgoldenrod: [184, 134, 11],
	darkgray: [169, 169, 169],
	darkgreen: [0, 100, 0],
	darkgrey: [169, 169, 169],
	darkkhaki: [189, 183, 107],
	darkmagenta: [139, 0, 139],
	darkolivegreen: [85, 107, 47],
	darkorange: [255, 140, 0],
	darkorchid: [153, 50, 204],
	darkred: [139, 0, 0],
	darksalmon: [233, 150, 122],
	darkseagreen: [143, 188, 143],
	darkslateblue: [72, 61, 139],
	darkslategray: [47, 79, 79],
	darkslategrey: [47, 79, 79],
	darkturquoise: [0, 206, 209],
	darkviolet: [148, 0, 211],
	deeppink: [255, 20, 147],
	deepskyblue: [0, 191, 255],
	dimgray: [105, 105, 105],
	dimgrey: [105, 105, 105],
	dodgerblue: [30, 144, 255],
	firebrick: [178, 34, 34],
	floralwhite: [255, 250, 240],
	forestgreen: [34, 139, 34],
	fuchsia: [255, 0, 255],
	gainsboro: [220, 220, 220],
	ghostwhite: [248, 248, 255],
	gold: [255, 215, 0],
	goldenrod: [218, 165, 32],
	gray: [128, 128, 128],
	green: [0, 128, 0],
	greenyellow: [173, 255, 47],
	grey: [128, 128, 128],
	honeydew: [240, 255, 240],
	hotpink: [255, 105, 180],
	indianred: [205, 92, 92],
	indigo: [75, 0, 130],
	ivory: [255, 255, 240],
	khaki: [240, 230, 140],
	lavender: [230, 230, 250],
	lavenderblush: [255, 240, 245],
	lawngreen: [124, 252, 0],
	lemonchiffon: [255, 250, 205],
	lightblue: [173, 216, 230],
	lightcoral: [240, 128, 128],
	lightcyan: [224, 255, 255],
	lightgoldenrodyellow: [250, 250, 210],
	lightgray: [211, 211, 211],
	lightgreen: [144, 238, 144],
	lightgrey: [211, 211, 211],
	lightpink: [255, 182, 193],
	lightsalmon: [255, 160, 122],
	lightseagreen: [32, 178, 170],
	lightskyblue: [135, 206, 250],
	lightslategray: [119, 136, 153],
	lightslategrey: [119, 136, 153],
	lightsteelblue: [176, 196, 222],
	lightyellow: [255, 255, 224],
	lime: [0, 255, 0],
	limegreen: [50, 205, 50],
	linen: [250, 240, 230],
	magenta: [255, 0, 255],
	maroon: [128, 0, 0],
	mediumaquamarine: [102, 205, 170],
	mediumblue: [0, 0, 205],
	mediumorchid: [186, 85, 211],
	mediumpurple: [147, 112, 219],
	mediumseagreen: [60, 179, 113],
	mediumslateblue: [123, 104, 238],
	mediumspringgreen: [0, 250, 154],
	mediumturquoise: [72, 209, 204],
	mediumvioletred: [199, 21, 133],
	midnightblue: [25, 25, 112],
	mintcream: [245, 255, 250],
	mistyrose: [255, 228, 225],
	moccasin: [255, 228, 181],
	navajowhite: [255, 222, 173],
	navy: [0, 0, 128],
	oldlace: [253, 245, 230],
	olive: [128, 128, 0],
	olivedrab: [107, 142, 35],
	orange: [255, 165, 0],
	orangered: [255, 69, 0],
	orchid: [218, 112, 214],
	palegoldenrod: [238, 232, 170],
	palegreen: [152, 251, 152],
	paleturquoise: [175, 238, 238],
	palevioletred: [219, 112, 147],
	papayawhip: [255, 239, 213],
	peachpuff: [255, 218, 185],
	peru: [205, 133, 63],
	pink: [255, 192, 203],
	plum: [221, 160, 221],
	powderblue: [176, 224, 230],
	purple: [128, 0, 128],
	rebeccapurple: [102, 51, 153],
	red: [255, 0, 0],
	rosybrown: [188, 143, 143],
	royalblue: [65, 105, 225],
	saddlebrown: [139, 69, 19],
	salmon: [250, 128, 114],
	sandybrown: [244, 164, 96],
	seagreen: [46, 139, 87],
	seashell: [255, 245, 238],
	sienna: [160, 82, 45],
	silver: [192, 192, 192],
	skyblue: [135, 206, 235],
	slateblue: [106, 90, 205],
	slategray: [112, 128, 144],
	slategrey: [112, 128, 144],
	snow: [255, 250, 250],
	springgreen: [0, 255, 127],
	steelblue: [70, 130, 180],
	tan: [210, 180, 140],
	teal: [0, 128, 128],
	thistle: [216, 191, 216],
	tomato: [255, 99, 71],
	turquoise: [64, 224, 208],
	violet: [238, 130, 238],
	wheat: [245, 222, 179],
	white: [255, 255, 255],
	whitesmoke: [245, 245, 245],
	yellow: [255, 255, 0],
	yellowgreen: [154, 205, 50]
};

},
// 33
function (module, exports, __webpack_require__) {

var conversions = __webpack_require__(13);

function buildGraph() {
	var graph = {};

	for (var models = Object.keys(conversions), len = models.length, i = 0; i < len; i++)
		graph[models[i]] = {distance: -1, parent: null};

	return graph;
}

function deriveBFS(fromModel) {
	var graph = buildGraph(),
		queue = [fromModel];

	graph[fromModel].distance = 0;

	while (queue.length) {
		var current = queue.pop(),
			adjacents = Object.keys(conversions[current]);

		for (var len = adjacents.length, i = 0; i < len; i++) {
			var adjacent = adjacents[i],
				node = graph[adjacent];

			if (node.distance === -1) {
				node.distance = graph[current].distance + 1;
				node.parent = current;
				queue.unshift(adjacent);
			}
		}
	}

	return graph;
}

function link(from, to) {
	return function (args) {
		return to(from(args));
	};
}

function wrapConversion(toModel, graph) {
	var path = [graph[toModel].parent, toModel],
		fn = conversions[graph[toModel].parent][toModel];

	for (var cur = graph[toModel].parent; graph[cur].parent; ) {
		path.unshift(graph[cur].parent);
		fn = link(conversions[graph[cur].parent][cur], fn);
		cur = graph[cur].parent;
	}

	fn.conversion = path;
	return fn;
}

module.exports = function (fromModel) {
	var graph = deriveBFS(fromModel),
		conversion = {};

	for (var models = Object.keys(graph), len = models.length, i = 0; i < len; i++) {
		var toModel = models[i];

		if (graph[toModel].parent !== null) conversion[toModel] = wrapConversion(toModel, graph);
	}

	return conversion;
};

},
// 34
function (module, exports, __webpack_require__) {

const argsert = __webpack_require__(3),
  objFilter = __webpack_require__(7),
  specialKeys = ['$0', '--', '_']

module.exports = function (yargs, usage, y18n) {
  const __ = y18n.__,
    __n = y18n.__n,
    self = {}

  self.nonOptionCount = function (argv) {
    const demandedCommands = yargs.getDemandedCommands(),
      _s = argv._.length - yargs.getContext().commands.length

    if (demandedCommands._ && (_s < demandedCommands._.min || _s > demandedCommands._.max))
      if (_s < demandedCommands._.min)
        demandedCommands._.minMsg !== void 0
          ? usage.fail(
              demandedCommands._.minMsg
                ? demandedCommands._.minMsg.replace(/\$0/g, _s).replace(/\$1/, demandedCommands._.min)
                : null
            )
          : usage.fail(__('Not enough non-option arguments: got %s, need at least %s', _s, demandedCommands._.min))
      else if (_s > demandedCommands._.max)
        demandedCommands._.maxMsg !== void 0
          ? usage.fail(
              demandedCommands._.maxMsg
                ? demandedCommands._.maxMsg.replace(/\$0/g, _s).replace(/\$1/, demandedCommands._.max)
                : null
            )
          : usage.fail(__('Too many non-option arguments: got %s, maximum of %s', _s, demandedCommands._.max))
  }

  self.positionalCount = function (required, observed) {
    observed < required &&
      usage.fail(__('Not enough non-option arguments: got %s, need at least %s', observed, required))
  }

  self.requiredArguments = function (argv) {
    const demandedOptions = yargs.getDemandedOptions()
    let missing = null

    Object.keys(demandedOptions).forEach((key) => {
      if (!argv.hasOwnProperty(key) || argv[key] === void 0) {
        missing = missing || {}
        missing[key] = demandedOptions[key]
      }
    })

    if (missing) {
      const customMsgs = []
      Object.keys(missing).forEach((key) => {
        const msg = missing[key]
        msg && customMsgs.indexOf(msg) < 0 && customMsgs.push(msg)
      })

      const customMsg = customMsgs.length ? '\n' + customMsgs.join('\n') : ''

      usage.fail(__n(
        'Missing required argument: %s',
        'Missing required arguments: %s',
        Object.keys(missing).length,
        Object.keys(missing).join(', ') + customMsg
      ))
    }
  }

  self.unknownArguments = function (argv, aliases, positionalMap) {
    const commandKeys = yargs.getCommandInstance().getCommands(),
      unknown = [],
      currentContext = yargs.getContext()

    Object.keys(argv).forEach((key) => {
      specialKeys.indexOf(key) > -1 ||
        positionalMap.hasOwnProperty(key) ||
        yargs._getParseContext().hasOwnProperty(key) ||
        aliases.hasOwnProperty(key) ||
        unknown.push(key)
    })

    commandKeys.length > 0 &&
      argv._.slice(currentContext.commands.length).forEach((key) => {
        commandKeys.indexOf(key) < 0 && unknown.push(key)
      })

    unknown.length > 0 &&
      usage.fail(__n('Unknown argument: %s', 'Unknown arguments: %s', unknown.length, unknown.join(', ')))
  }

  self.limitedChoices = function (argv) {
    const options = yargs.getOptions(),
      invalid = {}

    if (!Object.keys(options.choices).length) return

    Object.keys(argv).forEach((key) => {
      specialKeys.indexOf(key) < 0 && options.choices.hasOwnProperty(key) &&
        [].concat(argv[key]).forEach((value) => {
          if (options.choices[key].indexOf(value) < 0 && value !== void 0)
            invalid[key] = (invalid[key] || []).concat(value)
        })
    })

    const invalidKeys = Object.keys(invalid)
    if (!invalidKeys.length) return

    let msg = __('Invalid values:')
    invalidKeys.forEach((key) => {
      msg += '\n  ' + __(
        'Argument: %s, Given: %s, Choices: %s',
        key,
        usage.stringifiedValues(invalid[key]),
        usage.stringifiedValues(options.choices[key])
      )
    })
    usage.fail(msg)
  }

  let checks = []
  self.check = function (f, global) {
    checks.push({func: f, global})
  }

  self.customChecks = function (argv, aliases) {
    for (let f, i = 0; (f = checks[i]) !== void 0; i++) {
      const func = f.func
      let result = null
      try {
        result = func(argv, aliases)
      } catch (err) {
        usage.fail(err.message ? err.message : err, err)
        continue
      }

      !result
        ? usage.fail(__('Argument check failed: %s', func.toString()))
        : (typeof result == 'string' || result instanceof Error) && usage.fail(result.toString(), result)
    }
  }

  let implied = {}
  self.implies = function (key, value) {
    argsert('<string|object> [array|number|string]', [key, value], arguments.length)

    if (typeof key == 'object')
      Object.keys(key).forEach((k) => {
        self.implies(k, key[k])
      })
    else {
      yargs.global(key)
      implied[key] || (implied[key] = [])

      Array.isArray(value) ? value.forEach((i) => self.implies(key, i)) : implied[key].push(value)
    }
  }
  self.getImplied = function () {
    return implied
  }

  self.implications = function (argv) {
    const implyFail = []

    Object.keys(implied).forEach((key) => {
      const origKey = key
      ;(implied[key] || []).forEach((value) => {
        let num,
          key = origKey
        const origValue = value

        num = Number(key)
        key = isNaN(num) ? key : num

        if (typeof key == 'number') key = argv._.length >= key
        else if (key.match(/^--no-.+/)) {
          key = key.match(/^--no-(.+)/)[1]
          key = !argv[key]
        } else key = argv[key]

        num = Number(value)

        if (typeof (value = isNaN(num) ? value : num) == 'number') value = argv._.length >= value
        else if (value.match(/^--no-.+/)) {
          value = value.match(/^--no-(.+)/)[1]
          value = !argv[value]
        } else value = argv[value]

        !key || value || implyFail.push(` ${origKey} -> ${origValue}`)
      })
    })

    if (implyFail.length) {
      let msg = __('Implications failed:') + '\n'

      implyFail.forEach((value) => {
        msg += value
      })

      usage.fail(msg)
    }
  }

  let conflicting = {}
  self.conflicts = function (key, value) {
    argsert('<string|object> [array|string]', [key, value], arguments.length)

    if (typeof key == 'object')
      Object.keys(key).forEach((k) => {
        self.conflicts(k, key[k])
      })
    else {
      yargs.global(key)
      conflicting[key] || (conflicting[key] = [])

      Array.isArray(value) ? value.forEach((i) => self.conflicts(key, i)) : conflicting[key].push(value)
    }
  }
  self.getConflicting = () => conflicting

  self.conflicting = function (argv) {
    Object.keys(argv).forEach((key) => {
      conflicting[key] &&
        conflicting[key].forEach((value) => {
          value && argv[key] !== void 0 && argv[value] !== void 0 &&
            usage.fail(__('Arguments %s and %s are mutually exclusive', key, value))
        })
    })
  }

  self.recommendCommands = function (cmd, potentialCommands) {
    const distance = __webpack_require__(35),
      threshold = 3
    potentialCommands = potentialCommands.sort((a, b) => b.length - a.length)

    let recommended = null,
      bestDistance = Infinity
    for (let candidate, i = 0; (candidate = potentialCommands[i]) !== void 0; i++) {
      const d = distance(cmd, candidate)
      if (d <= threshold && d < bestDistance) {
        bestDistance = d
        recommended = candidate
      }
    }
    recommended && usage.fail(__('Did you mean %s?', recommended))
  }

  self.reset = function (localLookup) {
    implied = objFilter(implied, (k, v) => !localLookup[k])
    conflicting = objFilter(conflicting, (k, v) => !localLookup[k])
    checks = checks.filter(c => c.global)
    return self
  }

  let frozen
  self.freeze = function () {
    frozen = {}
    frozen.implied = implied
    frozen.checks = checks
    frozen.conflicting = conflicting
  }
  self.unfreeze = function () {
    implied = frozen.implied
    checks = frozen.checks
    conflicting = frozen.conflicting
    frozen = void 0
  }

  return self
}

},
// 35
function (module) {

module.exports = function (a, b) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []

  let i, j
  for (i = 0; i <= b.length; i++) matrix[i] = [i]

  for (j = 0; j <= a.length; j++) matrix[0][j] = j

  for (i = 1; i <= b.length; i++)
    for (j = 1; j <= a.length; j++)
      b.charAt(i - 1) === a.charAt(j - 1)
        ? (matrix[i][j] = matrix[i - 1][j - 1])
        : (matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1))

  return matrix[b.length][a.length]
}

},
// 36
function (module, exports, __webpack_require__) {

var fs = __webpack_require__(1),
  path = __webpack_require__(0),
  util = __webpack_require__(4)

function Y18N(opts) {
  opts = opts || {}
  this.directory = opts.directory || './locales'
  this.updateFiles = typeof opts.updateFiles != 'boolean' || opts.updateFiles
  this.locale = opts.locale || 'en'
  this.fallbackToLanguage = typeof opts.fallbackToLanguage != 'boolean' || opts.fallbackToLanguage

  this.cache = Object.create(null)
  this.writeQueue = []
}

Y18N.prototype.__ = function () {
  if (typeof arguments[0] != 'string') return this._taggedLiteral.apply(this, arguments)

  var args = Array.prototype.slice.call(arguments),
    str = args.shift(),
    cb = function () {}

  if (typeof args[args.length - 1] == 'function') cb = args.pop()
  //cb = cb || function () {}

  this.cache[this.locale] || this._readLocaleFile()

  if (!this.cache[this.locale][str] && this.updateFiles) {
    this.cache[this.locale][str] = str

    this._enqueueWrite([this.directory, this.locale, cb])
  } else cb()

  return util.format.apply(util, [this.cache[this.locale][str] || str].concat(args))
}

Y18N.prototype._taggedLiteral = function (parts) {
  var args = arguments,
    str = ''
  parts.forEach(function (part, i) {
    var arg = args[i + 1]
    str += part
    if (arg !== void 0) str += '%s'
  })
  return this.__.apply(null, [str].concat([].slice.call(arguments, 1)))
}

Y18N.prototype._enqueueWrite = function (work) {
  this.writeQueue.push(work)
  this.writeQueue.length !== 1 || this._processWriteQueue()
}

Y18N.prototype._processWriteQueue = function () {
  var _this = this,
    work = this.writeQueue[0],

    directory = work[0],
    locale = work[1],
    cb = work[2],

    languageFile = this._resolveLocaleFile(directory, locale),
    serializedLocale = JSON.stringify(this.cache[locale], null, 2)

  fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
    _this.writeQueue.shift()
    _this.writeQueue.length > 0 && _this._processWriteQueue()
    cb(err)
  })
}

Y18N.prototype._readLocaleFile = function () {
  var localeLookup = {}
  /*
  var languageFile = this._resolveLocaleFile(this.directory, this.locale)

  try {
    localeLookup = JSON.parse(fs.readFileSync(languageFile, 'utf-8'))
  } catch (err) {
    if (err instanceof SyntaxError) err.message = 'syntax error in ' + languageFile

    if (err.code !== 'ENOENT') throw err
    localeLookup = {}
  }
  */
  this.cache[this.locale] = localeLookup
}

Y18N.prototype._resolveLocaleFile = function (directory, locale) {
  var file = path.resolve(directory, './', locale + '.json')
  if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
    var languageFile = path.resolve(directory, './', locale.split('_')[0] + '.json')
    if (this._fileExistsSync(languageFile)) file = languageFile
  }
  return file
}

Y18N.prototype._fileExistsSync = function (file) {
  try {
    return fs.statSync(file).isFile()
  } catch (_) {
    return false
  }
}

Y18N.prototype.__n = function () {
  var args = Array.prototype.slice.call(arguments),
    singular = args.shift(),
    plural = args.shift(),
    quantity = args.shift(),

    cb = function () {}
  if (typeof args[args.length - 1] == 'function') cb = args.pop()

  this.cache[this.locale] || this._readLocaleFile()

  var str = quantity === 1 ? singular : plural
  if (this.cache[this.locale][singular])
    str = this.cache[this.locale][singular][quantity === 1 ? 'one' : 'other']

  if (!this.cache[this.locale][singular] && this.updateFiles) {
    this.cache[this.locale][singular] = {one: singular, other: plural}

    this._enqueueWrite([this.directory, this.locale, cb])
  } else cb()

  var values = [str]
  ~str.indexOf('%d') && values.push(quantity)

  return util.format.apply(util, values.concat(args))
}

Y18N.prototype.setLocale = function (locale) {
  this.locale = locale
}

Y18N.prototype.getLocale = function () {
  return this.locale
}

Y18N.prototype.updateLocale = function (obj) {
  this.cache[this.locale] || this._readLocaleFile()

  for (var key in obj) this.cache[this.locale][key] = obj[key]
}

module.exports = function (opts) {
  var y18n = new Y18N(opts)

  for (var key in y18n) if (typeof y18n[key] == 'function') y18n[key] = y18n[key].bind(y18n)

  return y18n
}

},
// 37
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(1),
  path = __webpack_require__(0),
  YError = __webpack_require__(2)

let previouslyVisitedConfigs = []

function checkForCircularExtends(cfgPath) {
  if (previouslyVisitedConfigs.indexOf(cfgPath) > -1)
    throw new YError(`Circular extended configurations: '${cfgPath}'.`)
}

function getPathToDefaultConfig(cwd, pathToExtend) {
  return path.resolve(cwd, pathToExtend)
}

function applyExtends(config, cwd) {
  let defaultConfig = {}

  if (config.hasOwnProperty('extends')) {
    if (typeof config.extends != 'string') return defaultConfig
    const isPath = /\.json|\..*rc$/.test(config.extends)
    let pathToDefault = null
    if (!isPath)
      try {
        pathToDefault = require.resolve(config.extends)
      } catch (_) {}
    else pathToDefault = getPathToDefaultConfig(cwd, config.extends)

    if (!pathToDefault && !isPath) return config

    checkForCircularExtends(pathToDefault)

    previouslyVisitedConfigs.push(pathToDefault)

    defaultConfig = isPath ? JSON.parse(fs.readFileSync(pathToDefault, 'utf8')) : require(config.extends)
    delete config.extends
    defaultConfig = applyExtends(defaultConfig, path.dirname(pathToDefault))
  }

  previouslyVisitedConfigs = []

  return Object.assign({}, defaultConfig, config)
}

module.exports = applyExtends

},
// 38
function (module) {

module.exports = function (position) {
  if (position === void 0) position = 2;
  if (position >= Error.stackTraceLimit)
    throw new TypeError(
      'getCallerFile(position) requires position be less then Error.stackTraceLimit but position was: `' +
        position + '` and Error.stackTraceLimit was: `' + Error.stackTraceLimit + '`'
    );

  var oldPrepareStackTrace = Error.prepareStackTrace;
  Error.prepareStackTrace = function (_, stack) { return stack; };
  var stack = new Error().stack;
  Error.prepareStackTrace = oldPrepareStackTrace;
  if (stack !== null && typeof stack == 'object')
    return stack[position] ? stack[position].getFileName() : void 0;
};

},
// 39
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	locatePath = __webpack_require__(40);

module.exports = (filename, opts = {}) => {
	const startDir = path.resolve(opts.cwd || ''),
		{root} = path.parse(startDir),

		filenames = [].concat(filename);

	return new Promise(resolve => {
		!(function find(dir) {
			locatePath(filenames, {cwd: dir}).then(file => {
				file ? resolve(path.join(dir, file)) : dir === root ? resolve(null) : find(path.dirname(dir));
			});
		})(startDir);
	});
};

module.exports.sync = (filename, opts = {}) => {
	let dir = path.resolve(opts.cwd || '');
	const {root} = path.parse(dir),

		filenames = [].concat(filename);

	while (1) {
		const file = locatePath.sync(filenames, {cwd: dir});

		if (file) return path.join(dir, file);
		if (dir === root) return null;

		dir = path.dirname(dir);
	}
};

},
// 40
function (module, exports, __webpack_require__) {

const path = __webpack_require__(0),
	pathExists = __webpack_require__(41),
	pLocate = () => Promise.resolve();

module.exports = (iterable, options) => {
	options = Object.assign({cwd: process.cwd()}, options);

	return pLocate(iterable, el => pathExists(path.resolve(options.cwd, el)), options);
};

module.exports.sync = (iterable, options) => {
	options = Object.assign({cwd: process.cwd()}, options);

	for (const el of iterable) if (pathExists.sync(path.resolve(options.cwd, el))) return el;
};

},
// 41
function (module, exports, __webpack_require__) {

const fs = __webpack_require__(1);

module.exports = fp => new Promise(resolve => {
	fs.access(fp, err => {
		resolve(!err);
	});
});

module.exports.sync = fp => {
	try {
		fs.accessSync(fp);
		return true;
	} catch (_) {
		return false;
	}
};

},
// 42
function (module) {

module.exports = function (_require) {
  var main = (_require = _require || require).main
  return main && isIISNode(main) ? handleIISNode(main) : main ? main.filename : process.cwd()
}

function isIISNode(main) {
  return /\\iisnode\\/.test(main.filename)
}

function handleIISNode(main) {
  return main.children.length ? main.children[0].filename : main.filename
}

}
]);

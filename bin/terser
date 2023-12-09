#!/usr/bin/env node
!function(modules) {
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
  __webpack_require__(2);
}([ function(module, exports) {
  module.exports = require("fs");
}, function(module, exports) {
  module.exports = require("path");
}, function(module, exports, __webpack_require__) {
  "use strict";
  __webpack_require__(3);
  var fs = __webpack_require__(0), info = __webpack_require__(4), path = __webpack_require__(1), program = __webpack_require__(5), Terser = __webpack_require__(9);
  try {
    __webpack_require__(10).install();
  } catch (err) {}
  const skip_keys = new Set([ "cname", "parent_scope", "scope", "uses_eval", "uses_with", "_var_name_cache" ]);
  var files = {}, options = {
    compress: !1,
    mangle: !1
  };
  if (program.version(info.name + " " + info.version), program.parseArgv = program.parse, 
  program.parse = void 0, process.argv.includes("ast") ? program.helpInformation = function() {
    var out = Terser.OutputStream({
      beautify: !0
    });
    return function doitem(ctor) {
      out.print("AST_" + ctor.TYPE);
      var props = ctor.SELF_PROPS.filter((function(prop) {
        return !/^\$/.test(prop);
      }));
      props.length > 0 && (out.space(), out.with_parens((function() {
        props.forEach((function(prop, i) {
          i && out.space(), out.print(prop);
        }));
      })));
      ctor.documentation && (out.space(), out.print_string(ctor.documentation));
      ctor.SUBCLASSES.length > 0 && (out.space(), out.with_block((function() {
        ctor.SUBCLASSES.forEach((function(ctor, i) {
          out.indent(), doitem(ctor), out.newline();
        }));
      })));
    }(Terser.AST_Node), out + "\n";
  } : process.argv.includes("options") && (program.helpInformation = function() {
    var text = [], options = Terser.default_options();
    for (var option in options) text.push("--" + ("output" === option ? "beautify" : "sourceMap" === option ? "source-map" : option) + " options:"), 
    text.push(format_object(options[option])), text.push("");
    return text.join("\n");
  }), program.option("-p, --parse <options>", "Specify parser options.", parse_js()), 
  program.option("-c, --compress [options]", "Enable compressor/specify compressor options.", parse_js()), 
  program.option("-m, --mangle [options]", "Mangle names/specify mangler options.", parse_js()), 
  program.option("--mangle-props [options]", "Mangle properties/specify mangler options.", parse_js()), 
  program.option("-b, --beautify [options]", "Beautify output/specify output options.", parse_js()), 
  program.option("-o, --output <file>", "Output file (default STDOUT)."), program.option("--comments [filter]", "Preserve copyright comments in the output."), 
  program.option("--config-file <file>", "Read minify() options from JSON file."), 
  program.option("-d, --define <expr>[=value]", "Global definitions.", parse_js("define")), 
  program.option("--ecma <version>", "Specify ECMAScript release: 5, 2015, 2016 or 2017..."), 
  program.option("-e, --enclose [arg[,...][:value[,...]]]", "Embed output in a big function with configurable arguments and values."), 
  program.option("--ie8", "Support non-standard Internet Explorer 8."), program.option("--keep-classnames", "Do not mangle/drop class names."), 
  program.option("--keep-fnames", "Do not mangle/drop function names. Useful for code relying on Function.prototype.name."), 
  program.option("--module", "Input is an ES6 module"), program.option("--name-cache <file>", "File to hold mangled name mappings."), 
  program.option("--rename", "Force symbol expansion."), program.option("--no-rename", "Disable symbol expansion."), 
  program.option("--safari10", "Support non-standard Safari 10."), program.option("--source-map [options]", "Enable source map/specify source map options.", parse_js()), 
  program.option("--timings", "Display operations run time on STDERR."), program.option("--toplevel", "Compress and/or mangle variables in toplevel scope."), 
  program.option("--verbose", "Print diagnostic messages."), program.option("--warn", "Print warning messages."), 
  program.option("--wrap <name>", "Embed everything as a function with “exports” corresponding to “name” globally."), 
  program.arguments("[files...]").parseArgv(process.argv), program.configFile && (options = JSON.parse(read_file(program.configFile))), 
  !program.output && program.sourceMap && "inline" != program.sourceMap.url && fatal("ERROR: cannot write source map to STDOUT"), 
  [ "compress", "enclose", "ie8", "mangle", "module", "safari10", "sourceMap", "toplevel", "wrap" ].forEach((function(name) {
    name in program && (options[name] = program[name]);
  })), "ecma" in program) {
    program.ecma != (0 | program.ecma) && fatal("ERROR: ecma must be an integer");
    const ecma = 0 | program.ecma;
    options.ecma = ecma > 5 && ecma < 2015 ? ecma + 2009 : ecma;
  }
  if (program.beautify && (options.output = "object" == typeof program.beautify ? program.beautify : {}, 
  "beautify" in options.output || (options.output.beautify = !0)), program.comments && ("object" != typeof options.output && (options.output = {}), 
  options.output.comments = "string" == typeof program.comments ? "false" != program.comments && program.comments : "some"), 
  program.define) for (var expr in "object" != typeof options.compress && (options.compress = {}), 
  "object" != typeof options.compress.global_defs && (options.compress.global_defs = {}), 
  program.define) options.compress.global_defs[expr] = program.define[expr];
  program.keepClassnames && (options.keep_classnames = !0), program.keepFnames && (options.keep_fnames = !0), 
  program.mangleProps && (program.mangleProps.domprops ? delete program.mangleProps.domprops : ("object" != typeof program.mangleProps && (program.mangleProps = {}), 
  Array.isArray(program.mangleProps.reserved) || (program.mangleProps.reserved = [])), 
  "object" != typeof options.mangle && (options.mangle = {}), options.mangle.properties = program.mangleProps), 
  program.nameCache && (options.nameCache = JSON.parse(read_file(program.nameCache, "{}"))), 
  "ast" == program.output && (options.output = {
    ast: !0,
    code: !1
  }), program.parse && (program.parse.acorn || program.parse.spidermonkey ? program.sourceMap && "inline" == program.sourceMap.content && fatal("ERROR: inline source map only works with built-in parser") : options.parse = program.parse), 
  ~program.rawArgs.indexOf("--rename") ? options.rename = !0 : program.rename || (options.rename = !1);
  var base, convert_path = function(name) {
    return name;
  };
  let filesList;
  if ("object" == typeof program.sourceMap && "base" in program.sourceMap && (base = program.sourceMap.base, 
  delete options.sourceMap.base, convert_path = function(name) {
    return path.relative(base, name);
  }), program.verbose ? options.warnings = "verbose" : program.warn && (options.warnings = !0), 
  options.files && options.files.length ? (filesList = options.files, delete options.files) : program.args.length && (filesList = program.args), 
  filesList) (function simple_glob(glob) {
    if (Array.isArray(glob)) return [].concat.apply([], glob.map(simple_glob));
    if (glob && glob.match(/[*?]/)) {
      var dir = path.dirname(glob);
      try {
        var entries = fs.readdirSync(dir);
      } catch (ex) {}
      if (entries) {
        var pattern = "^" + path.basename(glob).replace(/[.+^$[\]\\(){}]/g, "\\$&").replace(/\*/g, "[^/\\\\]*").replace(/\?/g, "[^/\\\\]") + "$", mod = "win32" === process.platform ? "i" : "", rx = new RegExp(pattern, mod), results = entries.filter((function(name) {
          return rx.test(name);
        })).map((function(name) {
          return path.join(dir, name);
        }));
        if (results.length) return results;
      }
    }
    return [ glob ];
  })(filesList).forEach((function(name) {
    files[convert_path(name)] = read_file(name);
  })), run(); else {
    var chunks = [];
    process.stdin.setEncoding("utf8"), process.stdin.on("data", (function(chunk) {
      chunks.push(chunk);
    })).on("end", (function() {
      files = [ chunks.join("") ], run();
    })), process.stdin.resume();
  }
  function convert_ast(fn) {
    return Terser.AST_Node.from_mozilla_ast(Object.keys(files).reduce(fn, null));
  }
  function run() {
    Terser.AST_Node.warn_function = function(msg) {
      print_error("WARN: " + msg);
    };
    var content = program.sourceMap && program.sourceMap.content;
    content && "inline" !== content && (options.sourceMap.content = read_file(content, content)), 
    program.timings && (options.timings = !0);
    try {
      program.parse && (program.parse.acorn ? files = convert_ast((function(toplevel, name) {
        return __webpack_require__(13).parse(files[name], {
          ecmaVersion: 2018,
          locations: !0,
          program: toplevel,
          sourceFile: name,
          sourceType: options.module || program.parse.module ? "module" : "script"
        });
      })) : program.parse.spidermonkey && (files = convert_ast((function(toplevel, name) {
        var obj = JSON.parse(files[name]);
        return toplevel ? (toplevel.body = toplevel.body.concat(obj.body), toplevel) : obj;
      }))));
    } catch (ex) {
      fatal(ex);
    }
    var result = Terser.minify(files, options);
    if (result.error) {
      var ex = result.error;
      if ("SyntaxError" == ex.name) {
        print_error("Parse error at " + ex.filename + ":" + ex.line + "," + ex.col);
        var col = ex.col, lines = files[ex.filename].split(/\r?\n/), line = lines[ex.line - 1];
        if (line || col || (col = (line = lines[ex.line - 2]).length), line) {
          col > 70 && (line = line.slice(col - 70), col = 70), print_error(line.slice(0, 80)), 
          print_error(line.slice(0, col).replace(/\S/g, " ") + "^");
        }
      }
      ex.defs && (print_error("Supported options:"), print_error(format_object(ex.defs))), 
      fatal(ex);
    } else "ast" == program.output ? (options.compress || options.mangle || result.ast.figure_out_scope({}), 
    print(JSON.stringify(result.ast, (function(key, value) {
      if (value) switch (key) {
       case "thedef":
        return symdef(value);

       case "enclosed":
        return value.length ? value.map(symdef) : void 0;

       case "variables":
       case "functions":
       case "globals":
        return value.size ? function(map, callback) {
          var result = [];
          return map.forEach((function(def) {
            result.push(callback(def));
          })), result;
        }(value, symdef) : void 0;
      }
      if (!skip_keys.has(key) && !(value instanceof Terser.AST_Token || value instanceof Map)) {
        if (value instanceof Terser.AST_Node) {
          var result = {
            _class: "AST_" + value.TYPE
          };
          return value.block_scope && (result.variables = value.block_scope.variables, result.functions = value.block_scope.functions, 
          result.enclosed = value.block_scope.enclosed), value.CTOR.PROPS.forEach((function(prop) {
            "block_scope" !== prop && (result[prop] = value[prop]);
          })), result;
        }
        return value;
      }
    }), 2))) : "spidermonkey" == program.output ? print(JSON.stringify(Terser.minify(result.code, {
      compress: !1,
      mangle: !1,
      output: {
        ast: !0,
        code: !1
      }
    }).ast.to_mozilla_ast(), null, 2)) : program.output ? (fs.writeFileSync(program.output, result.code), 
    "inline" !== options.sourceMap.url && result.map && fs.writeFileSync(program.output + ".map", result.map)) : print(result.code);
    if (program.nameCache && fs.writeFileSync(program.nameCache, JSON.stringify(options.nameCache)), 
    result.timings) for (var phase in result.timings) print_error("- " + phase + ": " + result.timings[phase].toFixed(3) + "s");
  }
  function fatal(message) {
    message instanceof Error && (message = message.stack.replace(/^\S*?Error:/, "ERROR:")), 
    print_error(message), process.exit(1);
  }
  function read_file(path, default_value) {
    try {
      return fs.readFileSync(path, "utf8");
    } catch (ex) {
      if (("ENOENT" == ex.code || "ENAMETOOLONG" == ex.code) && null != default_value) return default_value;
      fatal(ex);
    }
  }
  function parse_js(flag) {
    return function(value, options) {
      options = options || {};
      try {
        Terser.parse(value, {
          expression: !0
        }).walk(new Terser.TreeWalker((function(node) {
          if (node instanceof Terser.AST_Assign) {
            var name = node.left.print_to_string(), value = node.right;
            return flag ? options[name] = value : value instanceof Terser.AST_Array ? options[name] = value.elements.map(to_string) : value instanceof Terser.AST_RegExp ? (value = value.value, 
            options[name] = new RegExp(value.source, value.flags)) : options[name] = to_string(value), 
            !0;
          }
          if (node instanceof Terser.AST_Symbol || node instanceof Terser.AST_PropAccess) {
            name = node.print_to_string();
            return options[name] = !0, !0;
          }
          if (!(node instanceof Terser.AST_Sequence)) throw node;
          function to_string(value) {
            return value instanceof Terser.AST_Constant ? value.getValue() : value.print_to_string({
              quote_keys: !0
            });
          }
        })));
      } catch (ex) {
        flag ? fatal("Error parsing arguments for '" + flag + "': " + value) : options[value] = null;
      }
      return options;
    };
  }
  function symdef(def) {
    var ret = 1e6 + def.id + " " + def.name;
    return def.mangled_name && (ret += " " + def.mangled_name), ret;
  }
  function format_object(obj) {
    var lines = [], padding = "";
    return Object.keys(obj).map((function(name) {
      return padding.length < name.length && (padding = Array(name.length + 1).join(" ")), 
      [ name, JSON.stringify(obj[name]) ];
    })).forEach((function(tokens) {
      lines.push("  " + tokens[0] + padding.slice(tokens[0].length - 2) + tokens[1]);
    })), lines.join("\n");
  }
  function print_error(msg) {
    process.stderr.write(msg), process.stderr.write("\n");
  }
  function print(txt) {
    process.stdout.write(txt), process.stdout.write("\n");
  }
}, function(module, exports) {
  var exit = process.exit;
  process.exit = function() {
    var args = [].slice.call(arguments);
    throw process.once("uncaughtException", (function() {
      !function callback() {
        process.stdout.bufferSize || process.stderr.bufferSize ? setImmediate(callback) : exit.apply(process, args);
      }();
    })), exit;
  };
}, function(module) {
  module.exports = JSON.parse('{"name":"terser","description":"JavaScript parser, mangler/compressor and beautifier toolkit for ES6+","homepage":"https://terser.org","author":"Mihai Bazon <mihai.bazon@gmail.com> (http://lisperator.net/)","license":"BSD-2-Clause","version":"4.8.1"}');
}, function(module, exports, __webpack_require__) {
  var EventEmitter = __webpack_require__(6).EventEmitter, spawn = __webpack_require__(7).spawn, path = __webpack_require__(1), dirname = path.dirname, basename = path.basename, fs = __webpack_require__(0);
  function Option(flags, description) {
    this.flags = flags, this.required = flags.indexOf("<") >= 0, this.optional = flags.indexOf("[") >= 0, 
    this.bool = -1 === flags.indexOf("-no-"), (flags = flags.split(/[ ,|]+/)).length > 1 && !/^[[<]/.test(flags[1]) && (this.short = flags.shift()), 
    this.long = flags.shift(), this.description = description || "";
  }
  function Command(name) {
    this.commands = [], this.options = [], this._execs = {}, this._allowUnknownOption = !1, 
    this._args = [], this._name = name || "";
  }
  function pad(str, width) {
    var len = Math.max(0, width - str.length);
    return str + Array(len + 1).join(" ");
  }
  function outputHelpIfNecessary(cmd, options) {
    options = options || [];
    for (var i = 0; i < options.length; i++) "--help" !== options[i] && "-h" !== options[i] || (cmd.outputHelp(), 
    process.exit(0));
  }
  function humanReadableArgName(arg) {
    var nameOutput = arg.name + (!0 === arg.variadic ? "..." : "");
    return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
  }
  function exists(file) {
    try {
      if (fs.statSync(file).isFile()) return !0;
    } catch (e) {
      return !1;
    }
  }
  __webpack_require__(8).inherits(Command, EventEmitter), (exports = module.exports = new Command).Command = Command, 
  exports.Option = Option, Option.prototype.name = function() {
    return this.long.replace("--", "").replace("no-", "");
  }, Option.prototype.attributeName = function() {
    return this.name().split("-").reduce((function(str, word) {
      return str + word[0].toUpperCase() + word.slice(1);
    }));
  }, Option.prototype.is = function(arg) {
    return this.short === arg || this.long === arg;
  }, Command.prototype.command = function(name, desc, opts) {
    "object" == typeof desc && null !== desc && (opts = desc, desc = null), opts = opts || {};
    var args = name.split(/ +/), cmd = new Command(args.shift());
    return desc && (cmd.description(desc), this.executables = !0, this._execs[cmd._name] = !0, 
    opts.isDefault && (this.defaultExecutable = cmd._name)), cmd._noHelp = !!opts.noHelp, 
    this.commands.push(cmd), cmd.parseExpectedArgs(args), cmd.parent = this, desc ? this : cmd;
  }, Command.prototype.arguments = function(desc) {
    return this.parseExpectedArgs(desc.split(/ +/));
  }, Command.prototype.addImplicitHelpCommand = function() {
    this.command("help [cmd]", "display help for [cmd]");
  }, Command.prototype.parseExpectedArgs = function(args) {
    if (args.length) {
      var self = this;
      return args.forEach((function(arg) {
        var argDetails = {
          required: !1,
          name: "",
          variadic: !1
        };
        switch (arg[0]) {
         case "<":
          argDetails.required = !0, argDetails.name = arg.slice(1, -1);
          break;

         case "[":
          argDetails.name = arg.slice(1, -1);
        }
        argDetails.name.length > 3 && "..." === argDetails.name.slice(-3) && (argDetails.variadic = !0, 
        argDetails.name = argDetails.name.slice(0, -3)), argDetails.name && self._args.push(argDetails);
      })), this;
    }
  }, Command.prototype.action = function(fn) {
    var self = this, listener = function(args, unknown) {
      args = args || [], unknown = unknown || [];
      var parsed = self.parseOptions(unknown);
      outputHelpIfNecessary(self, parsed.unknown), parsed.unknown.length > 0 && self.unknownOption(parsed.unknown[0]), 
      parsed.args.length && (args = parsed.args.concat(args)), self._args.forEach((function(arg, i) {
        arg.required && null == args[i] ? self.missingArgument(arg.name) : arg.variadic && (i !== self._args.length - 1 && self.variadicArgNotLast(arg.name), 
        args[i] = args.splice(i));
      })), self._args.length ? args[self._args.length] = self : args.push(self), fn.apply(self, args);
    }, parent = this.parent || this, name = parent === this ? "*" : this._name;
    return parent.on("command:" + name, listener), this._alias && parent.on("command:" + this._alias, listener), 
    this;
  }, Command.prototype.option = function(flags, description, fn, defaultValue) {
    var self = this, option = new Option(flags, description), oname = option.name(), name = option.attributeName();
    if ("function" != typeof fn) if (fn instanceof RegExp) {
      var regex = fn;
      fn = function(val, def) {
        var m = regex.exec(val);
        return m ? m[0] : def;
      };
    } else defaultValue = fn, fn = null;
    return (!option.bool || option.optional || option.required) && (option.bool || (defaultValue = !0), 
    void 0 !== defaultValue && (self[name] = defaultValue, option.defaultValue = defaultValue)), 
    this.options.push(option), this.on("option:" + oname, (function(val) {
      null !== val && fn && (val = fn(val, void 0 === self[name] ? defaultValue : self[name])), 
      "boolean" == typeof self[name] || void 0 === self[name] ? self[name] = null == val ? !!option.bool && (defaultValue || !0) : val : null !== val && (self[name] = val);
    })), this;
  }, Command.prototype.allowUnknownOption = function(arg) {
    return this._allowUnknownOption = 0 === arguments.length || arg, this;
  }, Command.prototype.parse = function(argv) {
    this.executables && this.addImplicitHelpCommand(), this.rawArgs = argv, this._name = this._name || basename(argv[1], ".js"), 
    this.executables && argv.length < 3 && !this.defaultExecutable && argv.push("--help");
    var parsed = this.parseOptions(this.normalize(argv.slice(2))), args = this.args = parsed.args, result = this.parseArgs(this.args, parsed.unknown), name = result.args[0], aliasCommand = null;
    return name && (aliasCommand = this.commands.filter((function(command) {
      return command.alias() === name;
    }))[0]), !0 === this._execs[name] ? this.executeSubCommand(argv, args, parsed.unknown) : aliasCommand ? (args[0] = aliasCommand._name, 
    this.executeSubCommand(argv, args, parsed.unknown)) : this.defaultExecutable ? (args.unshift(this.defaultExecutable), 
    this.executeSubCommand(argv, args, parsed.unknown)) : result;
  }, Command.prototype.executeSubCommand = function(argv, args, unknown) {
    (args = args.concat(unknown)).length || this.help(), "help" === args[0] && 1 === args.length && this.help(), 
    "help" === args[0] && (args[0] = args[1], args[1] = "--help");
    var baseDir, f = argv[1], bin = basename(f, path.extname(f)) + "-" + args[0], resolvedLink = fs.realpathSync(f);
    baseDir = dirname(resolvedLink);
    var proc, localBin = path.join(baseDir, bin), isExplicitJS = !1;
    exists(localBin + ".js") ? (bin = localBin + ".js", isExplicitJS = !0) : exists(localBin + ".ts") ? (bin = localBin + ".ts", 
    isExplicitJS = !0) : exists(localBin) && (bin = localBin), args = args.slice(1), 
    "win32" !== process.platform ? isExplicitJS ? (args.unshift(bin), args = (process.execArgv || []).concat(args), 
    proc = spawn(process.argv[0], args, {
      stdio: "inherit",
      customFds: [ 0, 1, 2 ]
    })) : proc = spawn(bin, args, {
      stdio: "inherit",
      customFds: [ 0, 1, 2 ]
    }) : (args.unshift(bin), proc = spawn(process.execPath, args, {
      stdio: "inherit"
    }));
    [ "SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP" ].forEach((function(signal) {
      process.on(signal, (function() {
        !1 === proc.killed && null === proc.exitCode && proc.kill(signal);
      }));
    })), proc.on("close", process.exit.bind(process)), proc.on("error", (function(err) {
      "ENOENT" === err.code ? console.error("error: %s(1) does not exist, try --help", bin) : "EACCES" === err.code && console.error("error: %s(1) not executable. try chmod or run with root", bin), 
      process.exit(1);
    })), this.runningCommand = proc;
  }, Command.prototype.normalize = function(args) {
    for (var arg, lastOpt, index, ret = [], i = 0, len = args.length; i < len; ++i) {
      if (arg = args[i], i > 0 && (lastOpt = this.optionFor(args[i - 1])), "--" === arg) {
        ret = ret.concat(args.slice(i));
        break;
      }
      lastOpt && lastOpt.required ? ret.push(arg) : arg.length > 1 && "-" === arg[0] && "-" !== arg[1] ? arg.slice(1).split("").forEach((function(c) {
        ret.push("-" + c);
      })) : /^--/.test(arg) && ~(index = arg.indexOf("=")) ? ret.push(arg.slice(0, index), arg.slice(index + 1)) : ret.push(arg);
    }
    return ret;
  }, Command.prototype.parseArgs = function(args, unknown) {
    var name;
    return args.length ? (name = args[0], this.listeners("command:" + name).length ? this.emit("command:" + args.shift(), args, unknown) : this.emit("command:*", args)) : (outputHelpIfNecessary(this, unknown), 
    unknown.length > 0 && this.unknownOption(unknown[0]), 0 === this.commands.length && 0 === this._args.filter((function(a) {
      return a.required;
    })).length && this.emit("command:*")), this;
  }, Command.prototype.optionFor = function(arg) {
    for (var i = 0, len = this.options.length; i < len; ++i) if (this.options[i].is(arg)) return this.options[i];
  }, Command.prototype.parseOptions = function(argv) {
    for (var literal, option, arg, args = [], len = argv.length, unknownOptions = [], i = 0; i < len; ++i) if (arg = argv[i], 
    literal) args.push(arg); else if ("--" !== arg) if (option = this.optionFor(arg)) if (option.required) {
      if (null == (arg = argv[++i])) return this.optionMissingArgument(option);
      this.emit("option:" + option.name(), arg);
    } else option.optional ? (null == (arg = argv[i + 1]) || "-" === arg[0] && "-" !== arg ? arg = null : ++i, 
    this.emit("option:" + option.name(), arg)) : this.emit("option:" + option.name()); else arg.length > 1 && "-" === arg[0] ? (unknownOptions.push(arg), 
    i + 1 < argv.length && "-" !== argv[i + 1][0] && unknownOptions.push(argv[++i])) : args.push(arg); else literal = !0;
    return {
      args: args,
      unknown: unknownOptions
    };
  }, Command.prototype.opts = function() {
    for (var result = {}, len = this.options.length, i = 0; i < len; i++) {
      var key = this.options[i].attributeName();
      result[key] = key === this._versionOptionName ? this._version : this[key];
    }
    return result;
  }, Command.prototype.missingArgument = function(name) {
    console.error("error: missing required argument `%s'", name), process.exit(1);
  }, Command.prototype.optionMissingArgument = function(option, flag) {
    flag ? console.error("error: option `%s' argument missing, got `%s'", option.flags, flag) : console.error("error: option `%s' argument missing", option.flags), 
    process.exit(1);
  }, Command.prototype.unknownOption = function(flag) {
    this._allowUnknownOption || (console.error("error: unknown option `%s'", flag), 
    process.exit(1));
  }, Command.prototype.variadicArgNotLast = function(name) {
    console.error("error: variadic arguments must be last `%s'", name), process.exit(1);
  }, Command.prototype.version = function(str, flags) {
    if (0 === arguments.length) return this._version;
    this._version = str;
    var versionOption = new Option(flags = flags || "-V, --version", "output the version number");
    return this._versionOptionName = versionOption.long.substr(2) || "version", this.options.push(versionOption), 
    this.on("option:" + this._versionOptionName, (function() {
      process.stdout.write(str + "\n"), process.exit(0);
    })), this;
  }, Command.prototype.description = function(str, argsDescription) {
    return 0 === arguments.length ? this._description : (this._description = str, this._argsDescription = argsDescription, 
    this);
  }, Command.prototype.alias = function(alias) {
    var command = this;
    if (0 !== this.commands.length && (command = this.commands[this.commands.length - 1]), 
    0 === arguments.length) return command._alias;
    if (alias === command._name) throw new Error("Command alias can't be the same as its name");
    return command._alias = alias, this;
  }, Command.prototype.usage = function(str) {
    var args = this._args.map((function(arg) {
      return humanReadableArgName(arg);
    })), usage = "[options]" + (this.commands.length ? " [command]" : "") + (this._args.length ? " " + args.join(" ") : "");
    return 0 === arguments.length ? this._usage || usage : (this._usage = str, this);
  }, Command.prototype.name = function(str) {
    return 0 === arguments.length ? this._name : (this._name = str, this);
  }, Command.prototype.prepareCommands = function() {
    return this.commands.filter((function(cmd) {
      return !cmd._noHelp;
    })).map((function(cmd) {
      var args = cmd._args.map((function(arg) {
        return humanReadableArgName(arg);
      })).join(" ");
      return [ cmd._name + (cmd._alias ? "|" + cmd._alias : "") + (cmd.options.length ? " [options]" : "") + (args ? " " + args : ""), cmd._description ];
    }));
  }, Command.prototype.largestCommandLength = function() {
    return this.prepareCommands().reduce((function(max, command) {
      return Math.max(max, command[0].length);
    }), 0);
  }, Command.prototype.largestOptionLength = function() {
    var options = [].slice.call(this.options);
    return options.push({
      flags: "-h, --help"
    }), options.reduce((function(max, option) {
      return Math.max(max, option.flags.length);
    }), 0);
  }, Command.prototype.largestArgLength = function() {
    return this._args.reduce((function(max, arg) {
      return Math.max(max, arg.name.length);
    }), 0);
  }, Command.prototype.padWidth = function() {
    var width = this.largestOptionLength();
    return this._argsDescription && this._args.length && this.largestArgLength() > width && (width = this.largestArgLength()), 
    this.commands && this.commands.length && this.largestCommandLength() > width && (width = this.largestCommandLength()), 
    width;
  }, Command.prototype.optionHelp = function() {
    var width = this.padWidth();
    return this.options.map((function(option) {
      return pad(option.flags, width) + "  " + option.description + (option.bool && void 0 !== option.defaultValue ? " (default: " + JSON.stringify(option.defaultValue) + ")" : "");
    })).concat([ pad("-h, --help", width) + "  output usage information" ]).join("\n");
  }, Command.prototype.commandHelp = function() {
    if (!this.commands.length) return "";
    var commands = this.prepareCommands(), width = this.padWidth();
    return [ "Commands:", commands.map((function(cmd) {
      var desc = cmd[1] ? "  " + cmd[1] : "";
      return (desc ? pad(cmd[0], width) : cmd[0]) + desc;
    })).join("\n").replace(/^/gm, "  "), "" ].join("\n");
  }, Command.prototype.helpInformation = function() {
    var desc = [];
    if (this._description) {
      desc = [ this._description, "" ];
      var argsDescription = this._argsDescription;
      if (argsDescription && this._args.length) {
        var width = this.padWidth();
        desc.push("Arguments:"), desc.push(""), this._args.forEach((function(arg) {
          desc.push("  " + pad(arg.name, width) + "  " + argsDescription[arg.name]);
        })), desc.push("");
      }
    }
    var cmdName = this._name;
    this._alias && (cmdName = cmdName + "|" + this._alias);
    var usage = [ "Usage: " + cmdName + " " + this.usage(), "" ], cmds = [], commandHelp = this.commandHelp();
    commandHelp && (cmds = [ commandHelp ]);
    var options = [ "Options:", "" + this.optionHelp().replace(/^/gm, "  "), "" ];
    return usage.concat(desc).concat(options).concat(cmds).join("\n");
  }, Command.prototype.outputHelp = function(cb) {
    cb || (cb = function(passthru) {
      return passthru;
    }), process.stdout.write(cb(this.helpInformation())), this.emit("--help");
  }, Command.prototype.help = function(cb) {
    this.outputHelp(cb), process.exit();
  };
}, function(module, exports) {
  module.exports = require("events");
}, function(module, exports) {
  module.exports = require("child_process");
}, function(module, exports) {
  module.exports = require("util");
}, function(module, exports) {
  module.exports = require("../vendor/terser");
}, function(module, exports, __webpack_require__) {
  var fs, SourceMapConsumer = __webpack_require__(11).SourceMapConsumer, path = __webpack_require__(1);
  try {
    (fs = __webpack_require__(0)).existsSync && fs.readFileSync || (fs = null);
  } catch (err) {}
  var bufferFrom = __webpack_require__(12);
  var errorFormatterInstalled = !1, uncaughtShimInstalled = !1, emptyCacheBetweenOperations = !1, environment = "auto", fileContentsCache = {}, sourceMapCache = {}, reSourceMap = /^data:application\/json[^,]+base64,/, retrieveFileHandlers = [], retrieveMapHandlers = [];
  function isInBrowser() {
    return "browser" === environment || "node" !== environment && ("undefined" != typeof window && "function" == typeof XMLHttpRequest && !(window.require && window.module && window.process && "renderer" === window.process.type));
  }
  function handlerExec(list) {
    return function(arg) {
      for (var i = 0; i < list.length; i++) {
        var ret = list[i](arg);
        if (ret) return ret;
      }
      return null;
    };
  }
  var retrieveFile = handlerExec(retrieveFileHandlers);
  function supportRelativeURL(file, url) {
    if (!file) return url;
    var dir = path.dirname(file), match = /^\w+:\/\/[^\/]*/.exec(dir), protocol = match ? match[0] : "", startPath = dir.slice(protocol.length);
    return protocol && /^\/\w\:/.test(startPath) ? (protocol += "/") + path.resolve(dir.slice(protocol.length), url).replace(/\\/g, "/") : protocol + path.resolve(dir.slice(protocol.length), url);
  }
  retrieveFileHandlers.push((function(path) {
    if (path = path.trim(), /^file:/.test(path) && (path = path.replace(/file:\/\/\/(\w:)?/, (function(protocol, drive) {
      return drive ? "" : "/";
    }))), path in fileContentsCache) return fileContentsCache[path];
    var contents = "";
    try {
      if (fs) fs.existsSync(path) && (contents = fs.readFileSync(path, "utf8")); else {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", path, !1), xhr.send(null), 4 === xhr.readyState && 200 === xhr.status && (contents = xhr.responseText);
      }
    } catch (er) {}
    return fileContentsCache[path] = contents;
  }));
  var retrieveSourceMap = handlerExec(retrieveMapHandlers);
  function mapSourcePosition(position) {
    var sourceMap = sourceMapCache[position.source];
    if (!sourceMap) {
      var urlAndMap = retrieveSourceMap(position.source);
      urlAndMap ? (sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      }).map.sourcesContent && sourceMap.map.sources.forEach((function(source, i) {
        var contents = sourceMap.map.sourcesContent[i];
        if (contents) {
          var url = supportRelativeURL(sourceMap.url, source);
          fileContentsCache[url] = contents;
        }
      })) : sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
    if (sourceMap && sourceMap.map && "function" == typeof sourceMap.map.originalPositionFor) {
      var originalPosition = sourceMap.map.originalPositionFor(position);
      if (null !== originalPosition.source) return originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source), 
      originalPosition;
    }
    return position;
  }
  function CallSiteToString() {
    var fileName, fileLocation = "";
    if (this.isNative()) fileLocation = "native"; else {
      !(fileName = this.getScriptNameOrSourceURL()) && this.isEval() && (fileLocation = this.getEvalOrigin(), 
      fileLocation += ", "), fileLocation += fileName || "<anonymous>";
      var lineNumber = this.getLineNumber();
      if (null != lineNumber) {
        fileLocation += ":" + lineNumber;
        var columnNumber = this.getColumnNumber();
        columnNumber && (fileLocation += ":" + columnNumber);
      }
    }
    var line = "", functionName = this.getFunctionName(), addSuffix = !0, isConstructor = this.isConstructor();
    if (!(this.isToplevel() || isConstructor)) {
      var typeName = this.getTypeName();
      "[object Object]" === typeName && (typeName = "null");
      var methodName = this.getMethodName();
      functionName ? (typeName && 0 != functionName.indexOf(typeName) && (line += typeName + "."), 
      line += functionName, methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1 && (line += " [as " + methodName + "]")) : line += typeName + "." + (methodName || "<anonymous>");
    } else isConstructor ? line += "new " + (functionName || "<anonymous>") : functionName ? line += functionName : (line += fileLocation, 
    addSuffix = !1);
    return addSuffix && (line += " (" + fileLocation + ")"), line;
  }
  function cloneCallSite(frame) {
    var object = {};
    return Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach((function(name) {
      object[name] = /^(?:is|get)/.test(name) ? function() {
        return frame[name].call(frame);
      } : frame[name];
    })), object.toString = CallSiteToString, object;
  }
  function wrapCallSite(frame, state) {
    if (void 0 === state && (state = {
      nextPosition: null,
      curPosition: null
    }), frame.isNative()) return state.curPosition = null, frame;
    var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
    if (source) {
      var line = frame.getLineNumber(), column = frame.getColumnNumber() - 1, headerLength = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/.test("object" == typeof process && null !== process ? process.version : "") ? 0 : 62;
      1 === line && column > headerLength && !isInBrowser() && !frame.isEval() && (column -= headerLength);
      var position = mapSourcePosition({
        source: source,
        line: line,
        column: column
      });
      state.curPosition = position;
      var originalFunctionName = (frame = cloneCallSite(frame)).getFunctionName;
      return frame.getFunctionName = function() {
        return null == state.nextPosition ? originalFunctionName() : state.nextPosition.name || originalFunctionName();
      }, frame.getFileName = function() {
        return position.source;
      }, frame.getLineNumber = function() {
        return position.line;
      }, frame.getColumnNumber = function() {
        return position.column + 1;
      }, frame.getScriptNameOrSourceURL = function() {
        return position.source;
      }, frame;
    }
    var origin = frame.isEval() && frame.getEvalOrigin();
    return origin ? (origin = function mapEvalOrigin(origin) {
      var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
      if (match) {
        var position = mapSourcePosition({
          source: match[2],
          line: +match[3],
          column: match[4] - 1
        });
        return "eval at " + match[1] + " (" + position.source + ":" + position.line + ":" + (position.column + 1) + ")";
      }
      return (match = /^eval at ([^(]+) \((.+)\)$/.exec(origin)) ? "eval at " + match[1] + " (" + mapEvalOrigin(match[2]) + ")" : origin;
    }(origin), (frame = cloneCallSite(frame)).getEvalOrigin = function() {
      return origin;
    }, frame) : frame;
  }
  function prepareStackTrace(error, stack) {
    emptyCacheBetweenOperations && (fileContentsCache = {}, sourceMapCache = {});
    for (var errorString = (error.name || "Error") + ": " + (error.message || ""), state = {
      nextPosition: null,
      curPosition: null
    }, processedStack = [], i = stack.length - 1; i >= 0; i--) processedStack.push("\n    at " + wrapCallSite(stack[i], state)), 
    state.nextPosition = state.curPosition;
    return state.curPosition = state.nextPosition = null, errorString + processedStack.reverse().join("");
  }
  function getErrorSource(error) {
    var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
    if (match) {
      var source = match[1], line = +match[2], column = +match[3], contents = fileContentsCache[source];
      if (!contents && fs && fs.existsSync(source)) try {
        contents = fs.readFileSync(source, "utf8");
      } catch (er) {
        contents = "";
      }
      if (contents) {
        var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
        if (code) return source + ":" + line + "\n" + code + "\n" + new Array(column).join(" ") + "^";
      }
    }
    return null;
  }
  function printErrorAndExit(error) {
    var source = getErrorSource(error), stderr = function() {
      if ("object" == typeof process && null !== process) return process.stderr;
    }();
    stderr && stderr._handle && stderr._handle.setBlocking && stderr._handle.setBlocking(!0), 
    source && (console.error(), console.error(source)), console.error(error.stack), 
    function(code) {
      if ("object" == typeof process && null !== process && "function" == typeof process.exit) process.exit(code);
    }(1);
  }
  retrieveMapHandlers.push((function(source) {
    var sourceMapData, sourceMappingURL = function(source) {
      var fileData;
      if (isInBrowser()) try {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", source, !1), xhr.send(null), fileData = 4 === xhr.readyState ? xhr.responseText : null;
        var sourceMapHeader = xhr.getResponseHeader("SourceMap") || xhr.getResponseHeader("X-SourceMap");
        if (sourceMapHeader) return sourceMapHeader;
      } catch (e) {}
      fileData = retrieveFile(source);
      for (var lastMatch, match, re = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm; match = re.exec(fileData); ) lastMatch = match;
      return lastMatch ? lastMatch[1] : null;
    }(source);
    if (!sourceMappingURL) return null;
    if (reSourceMap.test(sourceMappingURL)) {
      var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
      sourceMapData = bufferFrom(rawData, "base64").toString(), sourceMappingURL = source;
    } else sourceMappingURL = supportRelativeURL(source, sourceMappingURL), sourceMapData = retrieveFile(sourceMappingURL);
    return sourceMapData ? {
      url: sourceMappingURL,
      map: sourceMapData
    } : null;
  }));
  var originalRetrieveFileHandlers = retrieveFileHandlers.slice(0), originalRetrieveMapHandlers = retrieveMapHandlers.slice(0);
  exports.wrapCallSite = wrapCallSite, exports.getErrorSource = getErrorSource, exports.mapSourcePosition = mapSourcePosition, 
  exports.retrieveSourceMap = retrieveSourceMap, exports.install = function(options) {
    if ((options = options || {}).environment && (environment = options.environment, 
    -1 === [ "node", "browser", "auto" ].indexOf(environment))) throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}");
    if (options.retrieveFile && (options.overrideRetrieveFile && (retrieveFileHandlers.length = 0), 
    retrieveFileHandlers.unshift(options.retrieveFile)), options.retrieveSourceMap && (options.overrideRetrieveSourceMap && (retrieveMapHandlers.length = 0), 
    retrieveMapHandlers.unshift(options.retrieveSourceMap)), options.hookRequire && !isInBrowser()) {
      var Module = require("module"), $compile = Module.prototype._compile;
      $compile.__sourceMapSupport || (Module.prototype._compile = function(content, filename) {
        return fileContentsCache[filename] = content, sourceMapCache[filename] = void 0, 
        $compile.call(this, content, filename);
      }, Module.prototype._compile.__sourceMapSupport = !0);
    }
    if (emptyCacheBetweenOperations || (emptyCacheBetweenOperations = "emptyCacheBetweenOperations" in options && options.emptyCacheBetweenOperations), 
    errorFormatterInstalled || (errorFormatterInstalled = !0, Error.prepareStackTrace = prepareStackTrace), 
    !uncaughtShimInstalled) {
      var installHandler = !("handleUncaughtExceptions" in options) || options.handleUncaughtExceptions;
      try {
        !1 === require("worker_threads").isMainThread && (installHandler = !1);
      } catch (e) {}
      installHandler && "object" == typeof process && null !== process && "function" == typeof process.on && (uncaughtShimInstalled = !0, 
      origEmit = process.emit, process.emit = function(type) {
        if ("uncaughtException" === type) {
          var hasStack = arguments[1] && arguments[1].stack, hasListeners = this.listeners(type).length > 0;
          if (hasStack && !hasListeners) return printErrorAndExit(arguments[1]);
        }
        return origEmit.apply(this, arguments);
      });
    }
    var origEmit;
  }, exports.resetRetrieveHandlers = function() {
    retrieveFileHandlers.length = 0, retrieveMapHandlers.length = 0, retrieveFileHandlers = originalRetrieveFileHandlers.slice(0), 
    retrieveMapHandlers = originalRetrieveMapHandlers.slice(0), retrieveSourceMap = handlerExec(retrieveMapHandlers), 
    retrieveFile = handlerExec(retrieveFileHandlers);
  };
}, function(module, exports) {
  module.exports = require("../vendor/source-map");
}, function(module, exports) {
  var toString = Object.prototype.toString, isModern = "undefined" != typeof Buffer && "function" == typeof Buffer.alloc && "function" == typeof Buffer.allocUnsafe && "function" == typeof Buffer.from;
  module.exports = function(value, encodingOrOffset, length) {
    if ("number" == typeof value) throw new TypeError('"value" argument must not be a number');
    return input = value, "ArrayBuffer" === toString.call(input).slice(8, -1) ? function(obj, byteOffset, length) {
      byteOffset >>>= 0;
      var maxLength = obj.byteLength - byteOffset;
      if (maxLength < 0) throw new RangeError("'offset' is out of bounds");
      if (void 0 === length) length = maxLength; else if ((length >>>= 0) > maxLength) throw new RangeError("'length' is out of bounds");
      return isModern ? Buffer.from(obj.slice(byteOffset, byteOffset + length)) : new Buffer(new Uint8Array(obj.slice(byteOffset, byteOffset + length)));
    }(value, encodingOrOffset, length) : "string" == typeof value ? function(string, encoding) {
      if ("string" == typeof encoding && "" !== encoding || (encoding = "utf8"), !Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
      return isModern ? Buffer.from(string, encoding) : new Buffer(string, encoding);
    }(value, encodingOrOffset) : isModern ? Buffer.from(value) : new Buffer(value);
    var input;
  };
}, function(module, exports) {
  module.exports = require("../vendor/acorn");
} ]);
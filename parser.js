"use strict";

var common = require('./common.js');

function _objectWithoutPropertiesLoose(source, excluded) {
  return source == null ? {} : Object.keys(source).reduce(function (target, key) {
    if (excluded.indexOf(key) < 0) target[key] = source[key];
    return target;
  }, {});
}

class Position {
  constructor(line, col, index) {
    this.line = void 0;
    this.column = void 0;
    this.index = void 0;
    this.line = line;
    this.column = col;
    this.index = index;
  }
}
class SourceLocation {
  constructor(start, end) {
    this.start = void 0;
    this.end = void 0;
    this.filename = void 0;
    this.identifierName = void 0;
    this.start = start;
    this.end = end;
  }
}
function createPositionWithColumnOffset(position, columnOffset) {
  const { line, column, index } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}

const code = "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";
var ModuleErrors = {
  ImportMetaOutsideModule: { message: "import.meta may appear only with 'sourceType: \"module\"'", code },
  ImportOutsideModule: { message: "'import' and 'export' may appear only with 'sourceType: \"module\"'", code }
};

const NodeDescriptions = {
  ArrayPattern: "array destructuring pattern",
  AssignmentExpression: "assignment expression",
  AssignmentPattern: "assignment expression",
  ArrowFunctionExpression: "arrow function expression",
  ConditionalExpression: "conditional expression",
  CatchClause: "catch clause",
  ForOfStatement: "for-of statement",
  ForInStatement: "for-in statement",
  ForStatement: "for-loop",
  FormalParameters: "function parameter list",
  Identifier: "identifier",
  ImportSpecifier: "import specifier",
  ImportDefaultSpecifier: "import default specifier",
  ImportNamespaceSpecifier: "import namespace specifier",
  ObjectPattern: "object destructuring pattern",
  ParenthesizedExpression: "parenthesized expression",
  RestElement: "rest element",
  UpdateExpression: { true: "prefix operation", false: "postfix operation" },
  VariableDeclarator: "variable declaration",
  YieldExpression: "yield expression"
};
const toNodeDescription = ({ type, prefix }) =>
  type === "UpdateExpression" ? NodeDescriptions.UpdateExpression[String(prefix)] : NodeDescriptions[type];

var StandardErrors = {
  AccessorIsGenerator: ({ kind }) => `A ${kind}ter cannot be a generator.`,
  ArgumentsInClass: "'arguments' is only allowed in functions and class methods.",
  AsyncFunctionInSingleStatementContext: "Async functions can only be declared at the top level or inside a block.",
  AwaitBindingIdentifier: "Can not use 'await' as identifier inside an async function.",
  AwaitBindingIdentifierInStaticBlock: "Can not use 'await' as identifier inside a static block.",
  AwaitExpressionFormalParameter: "'await' is not allowed in async function parameters.",
  AwaitUsingNotInAsyncContext: "'await using' is only allowed within async functions and at the top levels of modules.",
  AwaitNotInAsyncContext: "'await' is only allowed within async functions and at the top levels of modules.",
  AwaitNotInAsyncFunction: "'await' is only allowed within async functions.",
  BadGetterArity: "A 'get' accessor must not have any formal parameters.",
  BadSetterArity: "A 'set' accessor must have exactly one formal parameter.",
  BadSetterRestParameter: "A 'set' accessor function argument must not be a rest parameter.",
  ConstructorClassField: "Classes may not have a field named 'constructor'.",
  ConstructorClassPrivateField: "Classes may not have a private field named '#constructor'.",
  ConstructorIsAccessor: "Class constructor may not be an accessor.",
  ConstructorIsAsync: "Constructor can't be an async function.",
  ConstructorIsGenerator: "Constructor can't be a generator.",
  DeclarationMissingInitializer: ({ kind }) => `Missing initializer in ${kind} declaration.`,
  DecoratorArgumentsOutsideParentheses:
    "Decorator arguments must be moved inside parentheses: use '@(decorator(args))' instead of '@(decorator)(args)'.",
  DecoratorBeforeExport:
    "Decorators must be placed *before* the 'export' keyword. Remove the 'decoratorsBeforeExport: true' option to use the 'export @decorator class {}' syntax.",
  DecoratorsBeforeAfterExport:
    "Decorators can be placed *either* before or after the 'export' keyword, but not in both locations at the same time.",
  DecoratorConstructor: "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  DecoratorExportClass:
    "Decorators must be placed *after* the 'export' keyword. Remove the 'decoratorsBeforeExport: false' option to use the '@decorator export class {}' syntax.",
  DecoratorSemicolon: "Decorators must not be followed by a semicolon.",
  DecoratorStaticBlock: "Decorators can't be used with a static block.",
  DeletePrivateField: "Deleting a private field is not allowed.",
  DestructureNamedImport:
    "ES2015 named imports do not destructure. Use another statement for destructuring after the import.",
  DuplicateConstructor: "Duplicate constructor in the same class.",
  DuplicateDefaultExport: "Only one default export allowed per module.",
  DuplicateExport: ({ exportName }) =>
    `\`${exportName}\` has already been exported. Exported identifiers must be unique.`,
  DuplicateProto: "Redefinition of __proto__ property.",
  DuplicateRegExpFlags: "Duplicate regular expression flag.",
  ElementAfterRest: "Rest element must be last element.",
  EscapedCharNotAnIdentifier: "Invalid Unicode escape.",
  ExportBindingIsString: ({ localName, exportName }) =>
    `A string literal cannot be used as an exported binding without \`from\`.\n- Did you mean \`export { '${localName}' as '${exportName}' } from 'some-module'\`?`,
  ExportDefaultFromAsIdentifier: "'from' is not allowed as an identifier after 'export default'.",
  ForInOfLoopInitializer: ({ type }) =>
    `'${type === "ForInStatement" ? "for-in" : "for-of"}' loop variable declaration may not have an initializer.`,
  ForInUsing: "For-in loop may not start with 'using' declaration.",
  ForOfAsync: "The left-hand side of a for-of loop may not be 'async'.",
  ForOfLet: "The left-hand side of a for-of loop may not start with 'let'.",
  GeneratorInSingleStatementContext: "Generators can only be declared at the top level or inside a block.",
  IllegalBreakContinue: ({ type }) => `Unsyntactic ${type === "BreakStatement" ? "break" : "continue"}.`,
  IllegalLanguageModeDirective: "Illegal 'use strict' directive in function with non-simple parameter list.",
  IllegalReturn: "'return' outside of function.",
  ImportAttributesUseAssert:
    "The `assert` keyword in import attributes is deprecated and it has been replaced by the `with` keyword. You can enable the `deprecatedAssertSyntax: true` option in the import attributes plugin to suppress this error.",
  ImportBindingIsString: ({ importName }) =>
    `A string literal cannot be used as an imported binding.\n- Did you mean \`import { "${importName}" as foo }\`?`,
  ImportCallArgumentTrailingComma: "Trailing comma is disallowed inside import(...) arguments.",
  ImportCallArity: ({ maxArgumentCount }) =>
    `\`import()\` requires exactly ${maxArgumentCount === 1 ? "one argument" : "one or two arguments"}.`,
  ImportCallNotNewExpression: "Cannot use new with import(...).",
  ImportCallSpreadArgument: "`...` is not allowed in `import()`.",
  ImportJSONBindingNotDefault: "A JSON module can only be imported with `default`.",
  ImportReflectionHasAssertion: "`import module x` cannot have assertions.",
  ImportReflectionNotBinding: 'Only `import module x from "./module"` is valid.',
  IncompatibleRegExpUVFlags: "The 'u' and 'v' regular expression flags cannot be enabled at the same time.",
  InvalidBigIntLiteral: "Invalid BigIntLiteral.",
  InvalidCodePoint: "Code point out of bounds.",
  InvalidCoverInitializedName: "Invalid shorthand property initializer.",
  InvalidDecimal: "Invalid decimal.",
  InvalidDigit: ({ radix }) => `Expected number in radix ${radix}.`,
  InvalidEscapeSequence: "Bad character escape sequence.",
  InvalidEscapeSequenceTemplate: "Invalid escape sequence in template.",
  InvalidEscapedReservedWord: ({ reservedWord }) => `Escape sequence in keyword ${reservedWord}.`,
  InvalidIdentifier: ({ identifierName }) => `Invalid identifier ${identifierName}.`,
  InvalidLhs: ({ ancestor }) => `Invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidLhsBinding: ({ ancestor }) => `Binding invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidNumber: "Invalid number.",
  InvalidOrMissingExponent: "Floating-point numbers require a valid exponent after the 'e'.",
  InvalidOrUnexpectedToken: ({ unexpected }) => `Unexpected character '${unexpected}'.`,
  InvalidParenthesizedAssignment: "Invalid parenthesized assignment pattern.",
  InvalidPrivateFieldResolution: ({ identifierName }) => `Private name #${identifierName} is not defined.`,
  InvalidPropertyBindingPattern: "Binding member expression.",
  InvalidRecordProperty: "Only properties and spread elements are allowed in record definitions.",
  InvalidRestAssignmentPattern: "Invalid rest operator's argument.",
  LabelRedeclaration: ({ labelName }) => `Label '${labelName}' is already declared.`,
  LetInLexicalBinding: "'let' is disallowed as a lexically bound name.",
  LineTerminatorBeforeArrow: "No line break is allowed before '=>'.",
  MalformedRegExpFlags: "Invalid regular expression flag.",
  MissingClassName: "A class name is required.",
  MissingEqInAssignment: "Only '=' operator can be used for specifying default value.",
  MissingSemicolon: "Missing semicolon.",
  MissingPlugin: ({ missingPlugin }) =>
    `This experimental syntax requires enabling the parser plugin: ${missingPlugin
      .map(name => JSON.stringify(name)).join(", ")}.`,
  MissingOneOfPlugins: ({ missingPlugin }) =>
    `This experimental syntax requires enabling one of the following parser plugin(s): ${missingPlugin
      .map(name => JSON.stringify(name)).join(", ")}.`,
  MissingUnicodeEscape: "Expecting Unicode escape sequence \\uXXXX.",
  MixingCoalesceWithLogical: "Nullish coalescing operator(??) requires parens when mixing with logical operators.",
  ModuleAttributeDifferentFromType: "The only accepted module attribute is `type`.",
  ModuleAttributeInvalidValue: "Only string literals are allowed as module attribute values.",
  ModuleAttributesWithDuplicateKeys: ({ key }) => `Duplicate key "${key}" is not allowed in module attributes.`,
  /** @param {{ surrogateCharCode: number }} _ */
  ModuleExportNameHasLoneSurrogate: ({ surrogateCharCode }) =>
    `An export name cannot include a lone surrogate, found '\\u${surrogateCharCode.toString(16)}'.`,
  ModuleExportUndefined: ({ localName }) => `Export '${localName}' is not defined.`,
  MultipleDefaultsInSwitch: "Multiple default clauses.",
  NewlineAfterThrow: "Illegal newline after throw.",
  NoCatchOrFinally: "Missing catch or finally clause.",
  NumberIdentifier: "Identifier directly after number.",
  NumericSeparatorInEscapeSequence:
    "Numeric separators are not allowed inside unicode escape sequences or hex escape sequences.",
  ObsoleteAwaitStar: "'await*' has been removed from the async functions proposal. Use Promise.all() instead.",
  OptionalChainingNoNew: "Constructors in/after an Optional Chain are not allowed.",
  OptionalChainingNoTemplate: "Tagged Template Literals are not allowed in optionalChain.",
  OverrideOnConstructor: "'override' modifier cannot appear on a constructor declaration.",
  ParamDupe: "Argument name clash.",
  PatternHasAccessor: "Object pattern can't contain getter or setter.",
  PatternHasMethod: "Object pattern can't contain methods.",
  PrivateInExpectedIn: ({ identifierName }) =>
    `Private names are only allowed in property accesses (\`obj.#${identifierName}\`) or in \`in\` expressions (\`#${identifierName} in obj\`).`,
  PrivateNameRedeclaration: ({ identifierName }) => `Duplicate private name #${identifierName}.`,
  RecordExpressionBarIncorrectEndSyntaxType:
    "Record expressions ending with '|}' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  RecordExpressionBarIncorrectStartSyntaxType:
    "Record expressions starting with '{|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  RecordExpressionHashIncorrectStartSyntaxType:
    "Record expressions starting with '#{' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  RecordNoProto: "'__proto__' is not allowed in Record expressions.",
  RestTrailingComma: "Unexpected trailing comma after rest element.",
  SloppyFunction: "In non-strict mode code, functions can only be declared at top level or inside a block.",
  SloppyFunctionAnnexB:
    "In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement.",
  StaticPrototype: "Classes may not have static property named prototype.",
  SuperNotAllowed:
    "`super()` is only valid inside a class constructor of a subclass. Maybe a typo in the method name ('constructor') or not extending another class?",
  SuperPrivateField: "Private fields can't be accessed on super.",
  TrailingDecorator: "Decorators must be attached to a class element.",
  TupleExpressionBarIncorrectEndSyntaxType:
    "Tuple expressions ending with '|]' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  TupleExpressionBarIncorrectStartSyntaxType:
    "Tuple expressions starting with '[|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  TupleExpressionHashIncorrectStartSyntaxType:
    "Tuple expressions starting with '#[' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  UnexpectedArgumentPlaceholder: "Unexpected argument placeholder.",
  UnexpectedAwaitAfterPipelineBody:
    'Unexpected "await" after pipeline body; await must have parentheses in minimal proposal.',
  UnexpectedDigitAfterHash: "Unexpected digit after hash token.",
  UnexpectedImportExport: "'import' and 'export' may only appear at the top level.",
  UnexpectedKeyword: ({ keyword }) => `Unexpected keyword '${keyword}'.`,
  UnexpectedLeadingDecorator: "Leading decorators must be attached to a class declaration.",
  UnexpectedLexicalDeclaration: "Lexical declaration cannot appear in a single-statement context.",
  UnexpectedNewTarget: "`new.target` can only be used in functions or class properties.",
  UnexpectedNumericSeparator: "A numeric separator is only allowed between two digits.",
  UnexpectedPrivateField: "Unexpected private name.",
  UnexpectedReservedWord: ({ reservedWord }) => `Unexpected reserved word '${reservedWord}'.`,
  UnexpectedSuper: "'super' is only allowed in object methods and classes.",
  UnexpectedToken: ({ expected, unexpected }) =>
    `Unexpected token${unexpected ? ` '${unexpected}'.` : ""}${expected ? `, expected "${expected}"` : ""}`,
  UnexpectedTokenUnaryExponentiation:
    "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.",
  UnexpectedUsingDeclaration: "Using declaration cannot appear in the top level when source type is `script`.",
  UnsupportedBind: "Binding should be performed on object property.",
  UnsupportedDecoratorExport: "A decorated export must export a class declaration.",
  UnsupportedDefaultExport: "Only expressions, functions or classes are allowed as the `default` export.",
  UnsupportedImport: "`import` can only be used in `import()` or `import.meta`.",
  UnsupportedMetaProperty: ({ target, onlyValidPropertyName }) =>
    `The only valid meta property for ${target} is ${target}.${onlyValidPropertyName}.`,
  UnsupportedParameterDecorator: "Decorators cannot be used to decorate parameters.",
  UnsupportedPropertyDecorator: "Decorators cannot be used to decorate object literal properties.",
  UnsupportedSuper:
    "'super' can only be used with function calls (i.e. super()) or in property accesses (i.e. super.prop or super[prop]).",
  UnterminatedComment: "Unterminated comment.",
  UnterminatedRegExp: "Unterminated regular expression.",
  UnterminatedString: "Unterminated string constant.",
  UnterminatedTemplate: "Unterminated template.",
  UsingDeclarationHasBindingPattern: "Using declaration cannot have destructuring patterns.",
  VarRedeclaration: ({ identifierName }) => `Identifier '${identifierName}' has already been declared.`,
  YieldBindingIdentifier: "Can not use 'yield' as identifier inside a generator.",
  YieldInParameter: "Yield expression is not allowed in formal parameters.",
  ZeroDigitNumericSeparator: "Numeric separator can not be used after leading 0."
};

var StrictModeErrors = {
  StrictDelete: "Deleting local variable in strict mode.",
  StrictEvalArguments: ({ referenceName }) => `Assigning to '${referenceName}' in strict mode.`,
  StrictEvalArgumentsBinding: ({ bindingName }) => `Binding '${bindingName}' in strict mode.`,
  StrictFunction: "In strict mode code, functions can only be declared at top level or inside a block.",
  StrictNumericEscape: "The only valid numeric escape in strict mode is '\\0'.",
  StrictOctalLiteral: "Legacy octal literals are not allowed in strict mode.",
  StrictWith: "'with' in strict mode."
};

const UnparenthesizedPipeBodyDescriptions = new Set([
  "ArrowFunctionExpression",
  "AssignmentExpression",
  "ConditionalExpression",
  "YieldExpression"
]);
var PipelineOperatorErrors = {
  PipeBodyIsTighter:
    "Unexpected yield after pipeline body; any yield expression acting as Hack-style pipe body must be parenthesized due to its loose operator precedence.",
  PipeTopicRequiresHackPipes:
    'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
  PipeTopicUnbound: "Topic reference is unbound; it must be inside a pipe body.",
  PipeTopicUnconfiguredToken: ({ token }) =>
    `Invalid topic token ${token}. In order to use ${token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "${token}" }.`,
  PipeTopicUnused:
    "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  PipeUnparenthesizedBody: ({ type }) =>
    `Hack-style pipe body cannot be an unparenthesized ${toNodeDescription({ type })}; please wrap it in parentheses.`,
  PipelineBodyNoArrow:
    'Unexpected arrow "=>" after pipeline body; arrow function in pipeline body must be parenthesized.',
  PipelineBodySequenceExpression: "Pipeline body may not be a comma-separated sequence expression.",
  PipelineHeadSequenceExpression: "Pipeline head should not be a comma-separated sequence expression.",
  PipelineTopicUnused: "Pipeline is in topic style but does not use topic reference.",
  PrimaryTopicNotAllowed: "Topic reference was used in a lexical context without topic binding.",
  PrimaryTopicRequiresSmartPipeline:
    'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.'
};

function defineHidden(obj, key, value) {
  Object.defineProperty(obj, key, { enumerable: false, configurable: true, value });
}
function toParseErrorConstructor(_ref) {
  let { toMessage } = _ref,
    properties = _objectWithoutPropertiesLoose(_ref, ["toMessage"]);
  return function constructor({ loc, details }) {
    const error = new SyntaxError();
    Object.assign(error, properties, { loc, pos: loc.index });
    "missingPlugin" in details && Object.assign(error, { missingPlugin: details.missingPlugin });

    defineHidden(error, "clone", function (overrides = {}) {
      var _overrides$loc;
      const { line, column, index } = (_overrides$loc = overrides.loc) != null ? _overrides$loc : loc;
      return constructor({
        loc: new Position(line, column, index),
        details: Object.assign({}, details, overrides.details)
      });
    });
    defineHidden(error, "details", details);
    Object.defineProperty(error, "message", {
      configurable: true,
      get() {
        const message = `${toMessage(details)} (${loc.line}:${loc.column})`;
        this.message = message;
        return message;
      },
      set(value) {
        Object.defineProperty(this, "message", { value, writable: true });
      }
    });
    return error;
  };
}
function ParseErrorEnum(argument, syntaxPlugin) {
  if (Array.isArray(argument)) return parseErrorTemplates => ParseErrorEnum(parseErrorTemplates, argument[0]);

  const ParseErrorConstructors = {};
  for (const reasonCode of Object.keys(argument)) {
    const template = argument[reasonCode];
    const _ref2 = typeof template == "string"
      ? { message: () => template }
      : typeof template == "function"
      ? { message: template }
      : template;
    const { message } = _ref2,
      rest = _objectWithoutPropertiesLoose(_ref2, ["message"]),
      toMessage = typeof message == "string" ? () => message : message;
    ParseErrorConstructors[reasonCode] = toParseErrorConstructor(Object.assign(
      { code: "BABEL_PARSER_SYNTAX_ERROR", reasonCode, toMessage },
      syntaxPlugin ? { syntaxPlugin } : {},
      rest
    ));
  }
  return ParseErrorConstructors;
}
const Errors = Object.assign(
  {},
  ParseErrorEnum(ModuleErrors),
  ParseErrorEnum(StandardErrors),
  ParseErrorEnum(StrictModeErrors),
  ParseErrorEnum`pipelineOperator`(PipelineOperatorErrors)
);

const { defineProperty } = Object,
  toUnenumerable = (object, key) => defineProperty(object, key, { enumerable: false, value: object[key] });
function toESTreeLocation(node) {
  node.loc.start && toUnenumerable(node.loc.start, "index");
  node.loc.end && toUnenumerable(node.loc.end, "index");
  return node;
}
// noinspection JSUnusedGlobalSymbols
var estree = superClass => class extends superClass {
  parse() {
    const file = toESTreeLocation(super.parse());
    if (this.options.tokens) file.tokens = file.tokens.map(toESTreeLocation);

    return file;
  }
  parseRegExpLiteral({ pattern, flags }) {
    let regex = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch (_) {}
    const node = this.estreeParseLiteral(regex);
    node.regex = { pattern, flags };
    return node;
  }
  parseBigIntLiteral(value) {
    let bigInt;
    try {
      bigInt = BigInt(value);
    } catch (_unused) {
      bigInt = null;
    }
    const node = this.estreeParseLiteral(bigInt);
    node.bigint = String(node.value || value);
    return node;
  }
  parseDecimalLiteral(value) {
    const decimal = null,
      node = this.estreeParseLiteral(decimal);
    node.decimal = String(node.value || value);
    return node;
  }
  estreeParseLiteral(value) {
    return this.parseLiteral(value, "Literal");
  }
  parseStringLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNumericLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNullLiteral() {
    return this.estreeParseLiteral(null);
  }
  parseBooleanLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  directiveToStmt(directive) {
    const expression = directive.value;
    delete directive.value;
    expression.type = "Literal";
    expression.raw = expression.extra.raw;
    expression.value = expression.extra.expressionValue;
    const stmt = directive;
    stmt.type = "ExpressionStatement";
    stmt.expression = expression;
    stmt.directive = expression.extra.rawValue;
    delete expression.extra;
    return stmt;
  }
  initFunction(node, isAsync) {
    super.initFunction(node, isAsync);
    node.expression = false;
  }
  checkDeclaration(node) {
    node != null && this.isObjectProperty(node) ? this.checkDeclaration(node.value) : super.checkDeclaration(node);
  }
  getObjectOrClassMethodParams(method) {
    return method.value.params;
  }
  isValidDirective(stmt) {
    var _stmt$expression$extr;
    return (
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "Literal" &&
      typeof stmt.expression.value == "string" &&
      !((_stmt$expression$extr = stmt.expression.extra) != null && _stmt$expression$extr.parenthesized)
    );
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    super.parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse);
    const directiveStatements = node.directives.map(d => this.directiveToStmt(d));
    node.body = directiveStatements.concat(node.body);
    delete node.directives;
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true);
    if (method.typeParameters) {
      method.value.typeParameters = method.typeParameters;
      delete method.typeParameters;
    }
    classBody.body.push(method);
  }
  parsePrivateName() {
    const node = super.parsePrivateName();

    return this.getPluginOption("estree", "classFeatures") ? this.convertPrivateNameToPrivateIdentifier(node) : node;
  }
  convertPrivateNameToPrivateIdentifier(node) {
    const name = super.getPrivateNameSV(node);
    delete node.id; // as any
    node.name = name;
    node.type = "PrivateIdentifier";
    return node;
  }
  isPrivateName(node) {
    return this.getPluginOption("estree", "classFeatures")
      ? node.type === "PrivateIdentifier"
      : super.isPrivateName(node);
  }
  getPrivateNameSV(node) {
    return this.getPluginOption("estree", "classFeatures") ? node.name : super.getPrivateNameSV(node);
  }
  parseLiteral(value, type) {
    const node = super.parseLiteral(value, type);
    node.raw = node.extra.raw;
    delete node.extra;
    return node;
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    super.parseFunctionBody(node, allowExpression, isMethod);
    node.expression = node.body.type !== "BlockStatement";
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    let funcNode = this.startNode();
    funcNode.kind = node.kind;
    funcNode = super.parseMethod(funcNode, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    funcNode.type = "FunctionExpression";
    delete funcNode.kind;
    node.value = funcNode;
    if (type === "ClassPrivateMethod") node.computed = false;

    return this.finishNode(node, "MethodDefinition");
  }
  parseClassProperty(...args) {
    const propertyNode = super.parseClassProperty(...args);

    if (!this.getPluginOption("estree", "classFeatures")) return propertyNode;

    propertyNode.type = "PropertyDefinition";
    return propertyNode;
  }
  parseClassPrivateProperty(...args) {
    const propertyNode = super.parseClassPrivateProperty(...args);

    if (!this.getPluginOption("estree", "classFeatures")) return propertyNode;

    propertyNode.type = "PropertyDefinition";
    propertyNode.computed = false;
    return propertyNode;
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    const node = super.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor);
    if (node) {
      node.type = "Property";
      if (node.kind === "method") node.kind = "init";

      node.shorthand = false;
    }
    return node;
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    const node = super.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (node) {
      node.kind = "init";
      node.type = "Property";
    }
    return node;
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return type === "Property" ? "value" : super.isValidLVal(type, isUnparenthesizedInAssign, binding);
  }
  isAssignable(node, isBinding) {
    return node != null && this.isObjectProperty(node)
      ? this.isAssignable(node.value, isBinding)
      : super.isAssignable(node, isBinding);
  }
  toAssignable(node, isLHS = false) {
    if (node != null && this.isObjectProperty(node)) {
      const { key, value } = node;
      this.isPrivateName(key) && this.classScope.usePrivateName(this.getPrivateNameSV(key), key.loc.start);

      this.toAssignable(value, isLHS);
    } else super.toAssignable(node, isLHS);
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    prop.kind === "get" || prop.kind === "set"
      ? this.raise(Errors.PatternHasAccessor, { at: prop.key })
      : prop.method
      ? this.raise(Errors.PatternHasMethod, { at: prop.key })
      : super.toAssignableObjectExpressionProp(prop, isLast, isLHS);
  }
  finishCallExpression(unfinished, optional) {
    const node = super.finishCallExpression(unfinished, optional);
    if (node.callee.type === "Import") {
      node.type = "ImportExpression";
      node.source = node.arguments[0];
      if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) {
        var _node$arguments$;
        node.attributes = (_node$arguments$ = node.arguments[1]) != null ? _node$arguments$ : null;
      }
      delete node.arguments;
      delete node.callee;
    }
    return node;
  }
  toReferencedArguments(node) {
    node.type === "ImportExpression" || super.toReferencedArguments(node);
  }
  parseExport(unfinished, decorators) {
    const exportStartLoc = this.state.lastTokStartLoc,
      node = super.parseExport(unfinished, decorators);
    switch (node.type) {
      case "ExportAllDeclaration":
        node.exported = null;
        break;
      case "ExportNamedDeclaration":
        if (node.specifiers.length === 1 && node.specifiers[0].type === "ExportNamespaceSpecifier") {
          node.type = "ExportAllDeclaration";
          node.exported = node.specifiers[0].exported;
          delete node.specifiers;
        }
      case "ExportDefaultDeclaration":
        var _declaration$decorato;
        const { declaration } = node;

        (declaration == null ? void 0 : declaration.type) === "ClassDeclaration" &&
          ((_declaration$decorato = declaration.decorators) == null ? void 0 : _declaration$decorato.length) > 0 &&
          declaration.start === node.start &&
          this.resetStartLocation(node, exportStartLoc);

        break;
    }
    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const node = super.parseSubscript(base, startLoc, noCalls, state);
    if (state.optionalChainMember) {
      if (node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression")
        node.type = node.type.substring(8);

      if (state.stop) {
        const chain = this.startNodeAtNode(node);
        chain.expression = node;
        return this.finishNode(chain, "ChainExpression");
      }
    } else if (node.type === "MemberExpression" || node.type === "CallExpression") node.optional = false;

    return node;
  }
  hasPropertyAsPrivateName(node) {
    if (node.type === "ChainExpression") node = node.expression;

    return super.hasPropertyAsPrivateName(node);
  }
  isObjectProperty(node) {
    return node.type === "Property" && node.kind === "init" && !node.method;
  }
  isObjectMethod(node) {
    return node.method || node.kind === "get" || node.kind === "set";
  }
  finishNodeAt(node, type, endLoc) {
    return toESTreeLocation(super.finishNodeAt(node, type, endLoc));
  }
  resetStartLocation(node, startLoc) {
    super.resetStartLocation(node, startLoc);
    toESTreeLocation(node);
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    super.resetEndLocation(node, endLoc);
    toESTreeLocation(node);
  }
};

class TokContext {
  constructor(token, preserveSpace) {
    this.token = void 0;
    this.preserveSpace = void 0;
    this.token = token;
    this.preserveSpace = !!preserveSpace;
  }
}
const types = {
  brace: new TokContext("{"),
  j_oTag: new TokContext("<tag"),
  j_cTag: new TokContext("</tag"),
  j_expr: new TokContext("<tag>...</tag>", true)
};
types.template = new TokContext("`", true);

const beforeExpr = true,
  startsExpr = true,
  isLoop = true,
  isAssign = true,
  prefix = true,
  postfix = true;
class ExportedTokenType {
  constructor(label, conf = {}) {
    this.label = void 0;
    this.keyword = void 0;
    this.beforeExpr = void 0;
    this.startsExpr = void 0;
    this.rightAssociative = void 0;
    this.isLoop = void 0;
    this.isAssign = void 0;
    this.prefix = void 0;
    this.postfix = void 0;
    this.binop = void 0;
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop != null ? conf.binop : null;

    this.updateContext = null;
  }
}
const keywords = new Map();
function createKeyword(name, options = {}) {
  options.keyword = name;
  const token = createToken(name, options);
  keywords.set(name, token);
  return token;
}
function createBinop(name, binop) {
  return createToken(name, { beforeExpr, binop });
}
let tokenTypeCounter = -1;
const tokenTypes = [],
  tokenLabels = [],
  tokenBinops = [],
  tokenBeforeExprs = [],
  tokenStartsExprs = [],
  tokenPrefixes = [];
function createToken(name, options = {}) {
  var _options$binop, _options$beforeExpr, _options$startsExpr, _options$prefix;
  ++tokenTypeCounter;
  tokenLabels.push(name);
  tokenBinops.push((_options$binop = options.binop) != null ? _options$binop : -1);
  tokenBeforeExprs.push((_options$beforeExpr = options.beforeExpr) != null && _options$beforeExpr);
  tokenStartsExprs.push((_options$startsExpr = options.startsExpr) != null && _options$startsExpr);
  tokenPrefixes.push((_options$prefix = options.prefix) != null && _options$prefix);
  tokenTypes.push(new ExportedTokenType(name, options));
  return tokenTypeCounter;
}
function createKeywordLike(name, options = {}) {
  var _options$binop2, _options$beforeExpr2, _options$startsExpr2, _options$prefix2;
  ++tokenTypeCounter;
  keywords.set(name, tokenTypeCounter);
  tokenLabels.push(name);
  tokenBinops.push((_options$binop2 = options.binop) != null ? _options$binop2 : -1);
  tokenBeforeExprs.push((_options$beforeExpr2 = options.beforeExpr) != null && _options$beforeExpr2);
  tokenStartsExprs.push((_options$startsExpr2 = options.startsExpr) != null && _options$startsExpr2);
  tokenPrefixes.push((_options$prefix2 = options.prefix) != null && _options$prefix2);
  tokenTypes.push(new ExportedTokenType("name", options));
  return tokenTypeCounter;
}
const tt = {
  bracketL: createToken("[", { beforeExpr, startsExpr }),
  bracketHashL: createToken("#[", { beforeExpr, startsExpr }),
  bracketBarL: createToken("[|", { beforeExpr, startsExpr }),
  bracketR: createToken("]"),
  bracketBarR: createToken("|]"),
  braceL: createToken("{", { beforeExpr, startsExpr }),
  braceBarL: createToken("{|", { beforeExpr, startsExpr }),
  braceHashL: createToken("#{", { beforeExpr, startsExpr }),
  braceR: createToken("}"),
  braceBarR: createToken("|}"),
  parenL: createToken("(", { beforeExpr, startsExpr }),
  parenR: createToken(")"),
  comma: createToken(",", { beforeExpr }),
  semi: createToken(";", { beforeExpr }),
  colon: createToken(":", { beforeExpr }),
  doubleColon: createToken("::", { beforeExpr }),
  dot: createToken("."),
  question: createToken("?", { beforeExpr }),
  questionDot: createToken("?."),
  arrow: createToken("=>", { beforeExpr }),
  template: createToken("template"),
  ellipsis: createToken("...", { beforeExpr }),
  backQuote: createToken("`", { startsExpr }),
  dollarBraceL: createToken("${", { beforeExpr, startsExpr }),
  templateTail: createToken("...`", { startsExpr }),
  templateNonTail: createToken("...${", { beforeExpr, startsExpr }),
  at: createToken("@"),
  hash: createToken("#", { startsExpr }),
  interpreterDirective: createToken("#!..."),
  eq: createToken("=", { beforeExpr, isAssign }),
  assign: createToken("_=", { beforeExpr, isAssign }),
  slashAssign: createToken("_=", { beforeExpr, isAssign }),
  xorAssign: createToken("_=", { beforeExpr, isAssign }),
  moduloAssign: createToken("_=", { beforeExpr, isAssign }),
  incDec: createToken("++/--", { prefix, postfix, startsExpr }),
  bang: createToken("!", { beforeExpr, prefix, startsExpr }),
  tilde: createToken("~", { beforeExpr, prefix, startsExpr }),
  doubleCaret: createToken("^^", { startsExpr }),
  doubleAt: createToken("@@", { startsExpr }),
  pipeline: createBinop("|>", 0),
  nullishCoalescing: createBinop("??", 1),
  logicalOR: createBinop("||", 1),
  logicalAND: createBinop("&&", 2),
  bitwiseOR: createBinop("|", 3),
  bitwiseXOR: createBinop("^", 4),
  bitwiseAND: createBinop("&", 5),
  equality: createBinop("==/!=/===/!==", 6),
  lt: createBinop("</>/<=/>=", 7),
  gt: createBinop("</>/<=/>=", 7),
  relational: createBinop("</>/<=/>=", 7),
  bitShift: createBinop("<</>>/>>>", 8),
  bitShiftL: createBinop("<</>>/>>>", 8),
  bitShiftR: createBinop("<</>>/>>>", 8),
  plusMin: createToken("+/-", { beforeExpr, binop: 9, prefix, startsExpr }),
  modulo: createToken("%", { binop: 10, startsExpr }),
  star: createToken("*", { binop: 10 }),
  slash: createBinop("/", 10),
  exponent: createToken("**", { beforeExpr, binop: 11, rightAssociative: true }),
  _in: createKeyword("in", { beforeExpr, binop: 7 }),
  _instanceof: createKeyword("instanceof", { beforeExpr, binop: 7 }),
  _break: createKeyword("break"),
  _case: createKeyword("case", { beforeExpr }),
  _catch: createKeyword("catch"),
  _continue: createKeyword("continue"),
  _debugger: createKeyword("debugger"),
  _default: createKeyword("default", { beforeExpr }),
  _else: createKeyword("else", { beforeExpr }),
  _finally: createKeyword("finally"),
  _function: createKeyword("function", { startsExpr }),
  _if: createKeyword("if"),
  _return: createKeyword("return", { beforeExpr }),
  _switch: createKeyword("switch"),
  _throw: createKeyword("throw", { beforeExpr, prefix, startsExpr }),
  _try: createKeyword("try"),
  _var: createKeyword("var"),
  _const: createKeyword("const"),
  _with: createKeyword("with"),
  _new: createKeyword("new", { beforeExpr, startsExpr }),
  _this: createKeyword("this", { startsExpr }),
  _super: createKeyword("super", { startsExpr }),
  _class: createKeyword("class", { startsExpr }),
  _extends: createKeyword("extends", { beforeExpr }),
  _export: createKeyword("export"),
  _import: createKeyword("import", { startsExpr }),
  _null: createKeyword("null", { startsExpr }),
  _true: createKeyword("true", { startsExpr }),
  _false: createKeyword("false", { startsExpr }),
  _typeof: createKeyword("typeof", { beforeExpr, prefix, startsExpr }),
  _void: createKeyword("void", { beforeExpr, prefix, startsExpr }),
  _delete: createKeyword("delete", { beforeExpr, prefix, startsExpr }),
  _do: createKeyword("do", { isLoop, beforeExpr }),
  _for: createKeyword("for", { isLoop }),
  _while: createKeyword("while", { isLoop }),
  _as: createKeywordLike("as", { startsExpr }),
  _assert: createKeywordLike("assert", { startsExpr }),
  _async: createKeywordLike("async", { startsExpr }),
  _await: createKeywordLike("await", { startsExpr }),
  _from: createKeywordLike("from", { startsExpr }),
  _get: createKeywordLike("get", { startsExpr }),
  _let: createKeywordLike("let", { startsExpr }),
  _meta: createKeywordLike("meta", { startsExpr }),
  _of: createKeywordLike("of", { startsExpr }),
  _sent: createKeywordLike("sent", { startsExpr }),
  _set: createKeywordLike("set", { startsExpr }),
  _static: createKeywordLike("static", { startsExpr }),
  _using: createKeywordLike("using", { startsExpr }),
  _yield: createKeywordLike("yield", { startsExpr }),
  _asserts: createKeywordLike("asserts", { startsExpr }),
  _checks: createKeywordLike("checks", { startsExpr }),
  _exports: createKeywordLike("exports", { startsExpr }),
  _global: createKeywordLike("global", { startsExpr }),
  _implements: createKeywordLike("implements", { startsExpr }),
  _intrinsic: createKeywordLike("intrinsic", { startsExpr }),
  _infer: createKeywordLike("infer", { startsExpr }),
  _is: createKeywordLike("is", { startsExpr }),
  _mixins: createKeywordLike("mixins", { startsExpr }),
  _proto: createKeywordLike("proto", { startsExpr }),
  _require: createKeywordLike("require", { startsExpr }),
  _satisfies: createKeywordLike("satisfies", { startsExpr }),
  _keyof: createKeywordLike("keyof", { startsExpr }),
  _readonly: createKeywordLike("readonly", { startsExpr }),
  _unique: createKeywordLike("unique", { startsExpr }),
  _abstract: createKeywordLike("abstract", { startsExpr }),
  _declare: createKeywordLike("declare", { startsExpr }),
  _enum: createKeywordLike("enum", { startsExpr }),
  _module: createKeywordLike("module", { startsExpr }),
  _namespace: createKeywordLike("namespace", { startsExpr }),
  _interface: createKeywordLike("interface", { startsExpr }),
  _type: createKeywordLike("type", { startsExpr }),
  _opaque: createKeywordLike("opaque", { startsExpr }),
  name: createToken("name", { startsExpr }),
  string: createToken("string", { startsExpr }),
  num: createToken("num", { startsExpr }),
  bigint: createToken("bigint", { startsExpr }),
  decimal: createToken("decimal", { startsExpr }),
  regexp: createToken("regexp", { startsExpr }),
  privateName: createToken("#name", { startsExpr }),
  eof: createToken("eof"),
  jsxName: createToken("jsxName"),
  jsxText: createToken("jsxText", { beforeExpr: true }),
  jsxTagStart: createToken("jsxTagStart", { startsExpr: true }),
  jsxTagEnd: createToken("jsxTagEnd"),
  placeholder: createToken("%%", { startsExpr: true })
};
function tokenIsIdentifier(token) {
  return token >= 93 && token <= 130;
}
function tokenKeywordOrIdentifierIsKeyword(token) {
  return token <= 92;
}
function tokenIsKeywordOrIdentifier(token) {
  return token >= 58 && token <= 130;
}
function tokenIsLiteralPropertyName(token) {
  return token >= 58 && token <= 134;
}
function tokenComesBeforeExpression(token) {
  return tokenBeforeExprs[token];
}
function tokenCanStartExpression(token) {
  return tokenStartsExprs[token];
}
function tokenIsAssignment(token) {
  return token >= 29 && token <= 33;
}
function tokenIsFlowInterfaceOrTypeOrOpaque(token) {
  return token >= 127 && token <= 129;
}
function tokenIsLoop(token) {
  return token >= 90 && token <= 92;
}
function tokenIsKeyword(token) {
  return token >= 58 && token <= 92;
}
function tokenIsOperator(token) {
  return token >= 39 && token <= 59;
}
function tokenIsPostfix(token) {
  return token === 34;
}
function tokenIsPrefix(token) {
  return tokenPrefixes[token];
}
function tokenIsTSTypeOperator(token) {
  return token >= 119 && token <= 121;
}
function tokenIsTSDeclarationStart(token) {
  return token >= 122 && token <= 128;
}
function tokenLabelName(token) {
  return tokenLabels[token];
}
function tokenOperatorPrecedence(token) {
  return tokenBinops[token];
}
function tokenIsRightAssociative(token) {
  return token === 57;
}
function tokenIsTemplate(token) {
  return token >= 24 && token <= 25;
}
function getExportedToken(token) {
  return tokenTypes[token];
}

tokenTypes[8].updateContext = context => {
  context.pop();
};
tokenTypes[5].updateContext = tokenTypes[7].updateContext = tokenTypes[23].updateContext = context => {
  context.push(types.brace);
};
tokenTypes[22].updateContext = context => {
  context[context.length - 1] === types.template ? context.pop() : context.push(types.template);
};
tokenTypes[140].updateContext = context => {
  context.push(types.j_expr, types.j_oTag);
};

function isIteratorStart(current, next, next2) {
  return current === 64 && next === 64 && common.isIdentifierStart(next2);
}
const reservedWordLikeSet = new Set([
  "break",
  "case",
  "catch",
  "continue",
  "debugger",
  "default",
  "do",
  "else",
  "finally",
  "for",
  "function",
  "if",
  "return",
  "switch",
  "throw",
  "try",
  "var",
  "const",
  "while",
  "with",
  "new",
  "this",
  "super",
  "class",
  "extends",
  "export",
  "import",
  "null",
  "true",
  "false",
  "in",
  "instanceof",
  "typeof",
  "void",
  "delete",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",
  "eval",
  "arguments",
  "enum",
  "await"
]);
function canBeReservedWord(word) {
  return reservedWordLikeSet.has(word);
}

var ScopeFlag = {
  OTHER: 0,
  PROGRAM: 1,
  FUNCTION: 2,
  ARROW: 4,
  SIMPLE_CATCH: 8,
  SUPER: 16,
  DIRECT_SUPER: 32,
  CLASS: 64,
  STATIC_BLOCK: 128,
  TS_MODULE: 256,
  VAR: 387
};
var BindingFlag = {
  KIND_VALUE: 1,
  KIND_TYPE: 2,
  SCOPE_VAR: 4,
  SCOPE_LEXICAL: 8,
  SCOPE_FUNCTION: 16,
  SCOPE_OUTSIDE: 32,
  FLAG_NONE: 64,
  FLAG_CLASS: 128,
  FLAG_TS_ENUM: 256,
  FLAG_TS_CONST_ENUM: 512,
  FLAG_TS_EXPORT_ONLY: 1024,
  FLAG_FLOW_DECLARE_FN: 2048,
  FLAG_TS_IMPORT: 4096,
  FLAG_NO_LET_IN_LEXICAL: 8192,
  TYPE_CLASS: 8331,
  TYPE_LEXICAL: 8201,
  TYPE_CATCH_PARAM: 9,
  TYPE_VAR: 5,
  TYPE_FUNCTION: 17,
  TYPE_TS_INTERFACE: 130,
  TYPE_TS_TYPE: 2,
  TYPE_TS_ENUM: 8459,
  TYPE_TS_AMBIENT: 1024,
  TYPE_NONE: 64,
  TYPE_OUTSIDE: 65,
  TYPE_TS_CONST_ENUM: 8971,
  TYPE_TS_NAMESPACE: 1024,
  TYPE_TS_TYPE_IMPORT: 4098,
  TYPE_TS_VALUE_IMPORT: 4096,
  TYPE_FLOW_DECLARE_FN: 2048
};
var ClassElementType = {
  OTHER: 0,
  FLAG_STATIC: 4,
  KIND_GETTER: 2,
  KIND_SETTER: 1,
  KIND_ACCESSOR: 3,
  STATIC_GETTER: 6,
  STATIC_SETTER: 5,
  INSTANCE_GETTER: 2,
  INSTANCE_SETTER: 1
};

class Scope {
  constructor(flags) {
    this.var = new Set();
    this.lexical = new Set();
    this.functions = new Set();
    this.flags = flags;
  }
}
class ScopeHandler {
  constructor(parser, inModule) {
    this.parser = void 0;
    this.scopeStack = [];
    this.inModule = void 0;
    this.undefinedExports = new Map();
    this.parser = parser;
    this.inModule = inModule;
  }
  get inTopLevel() {
    return (this.currentScope().flags & ScopeFlag.PROGRAM) > 0;
  }
  get inFunction() {
    return (this.currentVarScopeFlags() & ScopeFlag.FUNCTION) > 0;
  }
  get allowSuper() {
    return (this.currentThisScopeFlags() & ScopeFlag.SUPER) > 0;
  }
  get allowDirectSuper() {
    return (this.currentThisScopeFlags() & ScopeFlag.DIRECT_SUPER) > 0;
  }
  get inClass() {
    return (this.currentThisScopeFlags() & ScopeFlag.CLASS) > 0;
  }
  get inClassAndNotInNonArrowFunction() {
    const flags = this.currentThisScopeFlags();
    return (flags & ScopeFlag.CLASS) > 0 && (flags & ScopeFlag.FUNCTION) == 0;
  }
  get inStaticBlock() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (flags & ScopeFlag.STATIC_BLOCK) return true;

      if (flags & (ScopeFlag.VAR | ScopeFlag.CLASS)) return false;
    }
  }
  get inNonArrowFunction() {
    return (this.currentThisScopeFlags() & ScopeFlag.FUNCTION) > 0;
  }
  get treatFunctionsAsVar() {
    return this.treatFunctionsAsVarInScope(this.currentScope());
  }
  createScope(flags) {
    return new Scope(flags);
  }
  enter(flags) {
    this.scopeStack.push(this.createScope(flags));
  }
  exit() {
    return this.scopeStack.pop().flags;
  }
  treatFunctionsAsVarInScope(scope) {
    return !!(
      scope.flags & (ScopeFlag.FUNCTION | ScopeFlag.STATIC_BLOCK) ||
      (!this.parser.inModule && scope.flags & ScopeFlag.PROGRAM)
    );
  }
  declareName(name, bindingType, loc) {
    let scope = this.currentScope();
    if (bindingType & BindingFlag.SCOPE_LEXICAL || bindingType & BindingFlag.SCOPE_FUNCTION) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      bindingType & BindingFlag.SCOPE_FUNCTION ? scope.functions.add(name) : scope.lexical.add(name);

      bindingType & BindingFlag.SCOPE_LEXICAL && this.maybeExportDefined(scope, name);
    } else if (bindingType & BindingFlag.SCOPE_VAR)
      for (let i = this.scopeStack.length - 1; i >= 0; --i) {
        scope = this.scopeStack[i];
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        scope.var.add(name);
        this.maybeExportDefined(scope, name);
        if (scope.flags & ScopeFlag.VAR) break;
      }

    this.parser.inModule && scope.flags & ScopeFlag.PROGRAM && this.undefinedExports.delete(name);
  }
  maybeExportDefined(scope, name) {
    this.parser.inModule && scope.flags & ScopeFlag.PROGRAM && this.undefinedExports.delete(name);
  }
  checkRedeclarationInScope(scope, name, bindingType, loc) {
    this.isRedeclaredInScope(scope, name, bindingType) &&
      this.parser.raise(Errors.VarRedeclaration, { at: loc, identifierName: name });
  }
  isRedeclaredInScope(scope, name, bindingType) {
    return (
      !!(bindingType & BindingFlag.KIND_VALUE) &&
      (bindingType & BindingFlag.SCOPE_LEXICAL
        ? scope.lexical.has(name) || scope.functions.has(name) || scope.var.has(name)
        : bindingType & BindingFlag.SCOPE_FUNCTION
        ? scope.lexical.has(name) || (!this.treatFunctionsAsVarInScope(scope) && scope.var.has(name))
        : (scope.lexical.has(name) &&
            !(scope.flags & ScopeFlag.SIMPLE_CATCH && scope.lexical.values().next().value === name)) ||
          (!this.treatFunctionsAsVarInScope(scope) && scope.functions.has(name)))
    );
  }
  checkLocalExport(id) {
    const { name } = id,
      topLevelScope = this.scopeStack[0];
    topLevelScope.lexical.has(name) || topLevelScope.var.has(name) || topLevelScope.functions.has(name) ||
      this.undefinedExports.set(name, id.loc.start);
  }
  currentScope() {
    return this.scopeStack[this.scopeStack.length - 1];
  }
  currentVarScopeFlags() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (flags & ScopeFlag.VAR) return flags;
    }
  }
  currentThisScopeFlags() {
    for (let i = this.scopeStack.length - 1; ; i--) {
      const { flags } = this.scopeStack[i];
      if (flags & (ScopeFlag.VAR | ScopeFlag.CLASS) && !(flags & ScopeFlag.ARROW)) return flags;
    }
  }
}

class FlowScope extends Scope {
  constructor(...args) {
    super(...args);
    this.declareFunctions = new Set();
  }
}
class FlowScopeHandler extends ScopeHandler {
  createScope(flags) {
    return new FlowScope(flags);
  }
  declareName(name, bindingType, loc) {
    const scope = this.currentScope();
    if (bindingType & BindingFlag.FLAG_FLOW_DECLARE_FN) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      this.maybeExportDefined(scope, name);
      scope.declareFunctions.add(name);
    } else super.declareName(name, bindingType, loc);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    return (
      !!super.isRedeclaredInScope(scope, name, bindingType) ||
      (!!(bindingType & BindingFlag.FLAG_FLOW_DECLARE_FN) &&
        !scope.declareFunctions.has(name) && (scope.lexical.has(name) || scope.functions.has(name)))
    );
  }
  checkLocalExport(id) {
    this.scopeStack[0].declareFunctions.has(id.name) || super.checkLocalExport(id);
  }
}

class BaseParser {
  constructor() {
    this.sawUnambiguousESM = false;
    this.ambiguousScriptDifferentAst = false;
  }
  hasPlugin(pluginConfig) {
    if (typeof pluginConfig == "string") return this.plugins.has(pluginConfig);

    const [pluginName, pluginOptions] = pluginConfig;
    if (!this.hasPlugin(pluginName)) return false;

    const actualOptions = this.plugins.get(pluginName);
    for (const key of Object.keys(pluginOptions))
      if ((actualOptions == null ? void 0 : actualOptions[key]) !== pluginOptions[key]) return false;

    return true;
  }
  getPluginOption(plugin, name) {
    var _this$plugins$get;
    return (_this$plugins$get = this.plugins.get(plugin)) == null ? void 0 : _this$plugins$get[name];
  }
}

function setTrailingComments(node, comments) {
  node.trailingComments === void 0 ? (node.trailingComments = comments) : node.trailingComments.unshift(...comments);
}
function setLeadingComments(node, comments) {
  node.leadingComments === void 0 ? (node.leadingComments = comments) : node.leadingComments.unshift(...comments);
}
function setInnerComments(node, comments) {
  node.innerComments === void 0 ? (node.innerComments = comments) : node.innerComments.unshift(...comments);
}
function adjustInnerComments(node, elements, commentWS) {
  let lastElement = /** @type {*} */ null;
  for (let i = elements.length; lastElement === null && i > 0; ) lastElement = elements[--i];

  lastElement === null || lastElement.start > commentWS.start
    ? setInnerComments(node, commentWS.comments)
    : setTrailingComments(lastElement, commentWS.comments);
}
class CommentsParser extends BaseParser {
  addComment(comment) {
    if (this.filename) comment.loc.filename = this.filename;
    this.state.comments.push(comment);
  }
  processComment(node) {
    const { commentStack } = this.state,
      commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    const lastCommentWS = commentStack[i];
    if (lastCommentWS.start === node.end) {
      lastCommentWS.leadingNode = node;
      i--;
    }
    const { start: nodeStart } = node;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i],
        commentEnd = commentWS.end;
      if (commentEnd <= nodeStart) {
        if (commentEnd === nodeStart) commentWS.trailingNode = node;

        break;
      }

      commentWS.containingNode = node;
      this.finalizeComment(commentWS);
      commentStack.splice(i, 1);
    }
  }
  finalizeComment(commentWS) {
    const { comments } = commentWS;
    if (commentWS.leadingNode !== null || commentWS.trailingNode !== null) {
      commentWS.leadingNode === null || setTrailingComments(commentWS.leadingNode, comments);

      commentWS.trailingNode === null || setLeadingComments(commentWS.trailingNode, comments);
    } else {
      const { containingNode: node, start: commentStart } = commentWS;
      if (this.input.charCodeAt(commentStart - 1) === 44)
        switch (node.type) {
          case "ObjectExpression":
          case "ObjectPattern":
          case "RecordExpression":
            adjustInnerComments(node, node.properties, commentWS);
            break;
          case "CallExpression":
          case "OptionalCallExpression":
            adjustInnerComments(node, node.arguments, commentWS);
            break;
          case "FunctionDeclaration":
          case "FunctionExpression":
          case "ArrowFunctionExpression":
          case "ObjectMethod":
          case "ClassMethod":
          case "ClassPrivateMethod":
            adjustInnerComments(node, node.params, commentWS);
            break;
          case "ArrayExpression":
          case "ArrayPattern":
          case "TupleExpression":
            adjustInnerComments(node, node.elements, commentWS);
            break;
          case "ExportNamedDeclaration":
          case "ImportDeclaration":
            adjustInnerComments(node, node.specifiers, commentWS);
            break;
          default:
            setInnerComments(node, comments);
        }
      else setInnerComments(node, comments);
    }
  }
  finalizeRemainingComments() {
    const { commentStack } = this.state;
    for (let i = commentStack.length - 1; i >= 0; i--) this.finalizeComment(commentStack[i]);

    this.state.commentStack = [];
  }
  resetPreviousNodeTrailingComments(node) {
    const { commentStack } = this.state,
      { length } = commentStack;
    if (length === 0) return;
    const commentWS = commentStack[length - 1];
    if (commentWS.leadingNode === node) commentWS.leadingNode = null;
  }
  resetPreviousIdentifierLeadingComments(node) {
    const { commentStack } = this.state,
      { length } = commentStack;
    if (length === 0) return;
    if (commentStack[length - 1].trailingNode === node) commentStack[length - 1].trailingNode = null;
    else if (length >= 2 && commentStack[length - 2].trailingNode === node)
      commentStack[length - 2].trailingNode = null;
  }
  takeSurroundingComments(node, start, end) {
    const { commentStack } = this.state,
      commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i],
        commentEnd = commentWS.end;
      if (commentWS.start === end) commentWS.leadingNode = node;
      else if (commentEnd === start) commentWS.trailingNode = node;
      else if (commentEnd < start) break;
    }
  }
}

const lineBreak = /\r\n?|[\n\u2028\u2029]/,
  lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  switch (code) {
    case 10:
    case 13:
    case 8232:
    case 8233:
      return true;
    default:
      return false;
  }
}
const skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
  skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/g;
const skipWhiteSpaceToLineBreak = new RegExp(
  "(?=(" + skipWhiteSpaceInLine.source + "))\\1" + /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source,
  "y"
);
function isWhitespace(code) {
  switch (code) {
    case 0x0009:
    case 0x000b:
    case 0x000c:
    case 32:
    case 160:
    case 5760:
    case 0x2000:
    case 0x2001:
    case 0x2002:
    case 0x2003:
    case 0x2004:
    case 0x2005:
    case 0x2006:
    case 0x2007:
    case 0x2008:
    case 0x2009:
    case 0x200a:
    case 0x202f:
    case 0x205f:
    case 0x3000:
    case 0xfeff:
      return true;
    default:
      return false;
  }
}

class State {
  constructor() {
    this.strict = void 0;
    this.curLine = void 0;
    this.lineStart = void 0;
    this.startLoc = void 0;
    this.endLoc = void 0;
    this.errors = [];
    this.potentialArrowAt = -1;
    this.noArrowAt = [];
    this.noArrowParamsConversionAt = [];
    this.maybeInArrowParameters = false;
    this.inType = false;
    this.noAnonFunctionType = false;
    this.hasFlowComment = false;
    this.isAmbientContext = false;
    this.inAbstractClass = false;
    this.inDisallowConditionalTypesContext = false;
    this.topicContext = { maxNumOfResolvableTopics: 0, maxTopicIndex: null };
    this.soloAwait = false;
    this.inFSharpPipelineDirectBody = false;
    this.labels = [];
    this.comments = [];
    this.commentStack = [];
    this.pos = 0;
    this.type = 137;
    this.value = null;
    this.start = 0;
    this.end = 0;
    this.lastTokEndLoc = null;
    this.lastTokStartLoc = null;
    this.lastTokStart = 0;
    this.context = [types.brace];
    this.canStartJSXElement = true;
    this.containsEsc = false;
    this.firstInvalidTemplateEscapePos = null;
    this.strictErrors = new Map();
    this.tokensLength = 0;
  }
  init({ strictMode, sourceType, startLine, startColumn }) {
    this.strict = strictMode !== false && (strictMode === true || sourceType === "module");
    this.curLine = startLine;
    this.lineStart = -startColumn;
    this.startLoc = this.endLoc = new Position(startLine, startColumn, 0);
  }
  curPosition() {
    return new Position(this.curLine, this.pos - this.lineStart, this.pos);
  }
  clone(skipArrays) {
    const state = new State(),
      keys = Object.keys(this);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      let val = this[key];
      if (!skipArrays && Array.isArray(val)) val = val.slice();

      state[key] = val;
    }
    return state;
  }
}

function buildPosition(pos, lineStart, curLine) {
  return new Position(curLine, pos - lineStart, pos);
}
const VALID_REGEX_FLAGS = new Set([103, 109, 115, 105, 121, 117, 100, 118]);
class Token {
  constructor(state) {
    this.type = state.type;
    this.value = state.value;
    this.start = state.start;
    this.end = state.end;
    this.loc = new SourceLocation(state.startLoc, state.endLoc);
  }
}
class Tokenizer extends CommentsParser {
  constructor(options, input) {
    super();
    this.isLookahead = void 0;
    this.tokens = [];
    this.errorHandlers_readInt = {
      invalidDigit: (pos, lineStart, curLine, radix) => {
        if (!this.options.errorRecovery) return false;
        this.raise(Errors.InvalidDigit, { at: buildPosition(pos, lineStart, curLine), radix });
        return true;
      },
      numericSeparatorInEscapeSequence: this.errorBuilder(Errors.NumericSeparatorInEscapeSequence),
      unexpectedNumericSeparator: this.errorBuilder(Errors.UnexpectedNumericSeparator)
    };
    this.errorHandlers_readCodePoint = Object.assign({}, this.errorHandlers_readInt, {
      invalidEscapeSequence: this.errorBuilder(Errors.InvalidEscapeSequence),
      invalidCodePoint: this.errorBuilder(Errors.InvalidCodePoint)
    });
    this.errorHandlers_readStringContents_string = Object.assign({}, this.errorHandlers_readCodePoint, {
      strictNumericEscape: (pos, lineStart, curLine) => {
        this.recordStrictModeErrors(Errors.StrictNumericEscape, { at: buildPosition(pos, lineStart, curLine) });
      },
      unterminated: (pos, lineStart, curLine) => {
        throw this.raise(Errors.UnterminatedString, { at: buildPosition(pos - 1, lineStart, curLine) });
      }
    });
    this.errorHandlers_readStringContents_template = Object.assign({}, this.errorHandlers_readCodePoint, {
      strictNumericEscape: this.errorBuilder(Errors.StrictNumericEscape),
      unterminated: (pos, lineStart, curLine) => {
        throw this.raise(Errors.UnterminatedTemplate, { at: buildPosition(pos, lineStart, curLine) });
      }
    });
    this.state = new State();
    this.state.init(options);
    this.input = input;
    this.length = input.length;
    this.isLookahead = false;
  }
  pushToken(token) {
    this.tokens.length = this.state.tokensLength;
    this.tokens.push(token);
    ++this.state.tokensLength;
  }
  next() {
    this.checkKeywordEscapes();
    this.options.tokens && this.pushToken(new Token(this.state));

    this.state.lastTokStart = this.state.start;
    this.state.lastTokEndLoc = this.state.endLoc;
    this.state.lastTokStartLoc = this.state.startLoc;
    this.nextToken();
  }
  eat(type) {
    if (this.match(type)) {
      this.next();
      return true;
    }
    return false;
  }
  match(type) {
    return this.state.type === type;
  }
  createLookaheadState(state) {
    return /** @type {State} */ {
      pos: state.pos,
      value: null,
      type: state.type,
      start: state.start,
      end: state.end,
      context: [this.curContext()],
      inType: state.inType,
      startLoc: state.startLoc,
      lastTokEndLoc: state.lastTokEndLoc,
      curLine: state.curLine,
      lineStart: state.lineStart,
      curPosition: state.curPosition
    };
  }
  lookahead() {
    const old = this.state;
    this.state = this.createLookaheadState(old);
    this.isLookahead = true;
    this.nextToken();
    this.isLookahead = false;
    const curr = this.state;
    this.state = old;
    return curr;
  }
  nextTokenStart() {
    return this.nextTokenStartSince(this.state.pos);
  }
  nextTokenStartSince(pos) {
    skipWhiteSpace.lastIndex = pos;
    return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos;
  }
  lookaheadCharCode() {
    return this.input.charCodeAt(this.nextTokenStart());
  }
  nextTokenInLineStart() {
    return this.nextTokenInLineStartSince(this.state.pos);
  }
  nextTokenInLineStartSince(pos) {
    skipWhiteSpaceInLine.lastIndex = pos;
    return skipWhiteSpaceInLine.test(this.input) ? skipWhiteSpaceInLine.lastIndex : pos;
  }
  lookaheadInLineCharCode() {
    return this.input.charCodeAt(this.nextTokenInLineStart());
  }
  codePointAtPos(pos) {
    let cp = this.input.charCodeAt(pos);
    if ((cp & 0xfc00) == 0xd800 && ++pos < this.input.length) {
      const trail = this.input.charCodeAt(pos);
      if ((trail & 0xfc00) == 0xdc00) cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
    }
    return cp;
  }
  setStrict(strict) {
    this.state.strict = strict;
    if (strict) {
      this.state.strictErrors.forEach(([toParseError, at]) => this.raise(toParseError, { at }));
      this.state.strictErrors.clear();
    }
  }
  curContext() {
    return this.state.context[this.state.context.length - 1];
  }
  nextToken() {
    this.skipSpace();
    this.state.start = this.state.pos;
    this.isLookahead || (this.state.startLoc = this.state.curPosition());
    this.state.pos >= this.length
      ? this.finishToken(137)
      : this.getTokenFromCode(this.codePointAtPos(this.state.pos));
  }
  skipBlockComment(commentEnd) {
    let startLoc;
    this.isLookahead || (startLoc = this.state.curPosition());
    const start = this.state.pos,
      end = this.input.indexOf(commentEnd, start + 2);
    if (end < 0) throw this.raise(Errors.UnterminatedComment, { at: this.state.curPosition() });

    this.state.pos = end + commentEnd.length;
    lineBreakG.lastIndex = start + 2;
    while (lineBreakG.test(this.input) && lineBreakG.lastIndex <= end) {
      ++this.state.curLine;
      this.state.lineStart = lineBreakG.lastIndex;
    }
    if (this.isLookahead) return;
    const comment = {
      type: "CommentBlock",
      value: this.input.slice(start + 2, end),
      start,
      end: end + commentEnd.length,
      loc: new SourceLocation(startLoc, this.state.curPosition())
    };
    this.options.tokens && this.pushToken(comment);
    return comment;
  }
  skipLineComment(startSkip) {
    const start = this.state.pos;
    let startLoc;
    this.isLookahead || (startLoc = this.state.curPosition());
    let ch = this.input.charCodeAt((this.state.pos += startSkip));
    if (this.state.pos < this.length)
      while (!isNewLine(ch) && ++this.state.pos < this.length) ch = this.input.charCodeAt(this.state.pos);

    if (this.isLookahead) return;
    const end = this.state.pos;
    const comment = {
      type: "CommentLine",
      value: this.input.slice(start + startSkip, end),
      start,
      end,
      loc: new SourceLocation(startLoc, this.state.curPosition())
    };
    this.options.tokens && this.pushToken(comment);
    return comment;
  }
  skipSpace() {
    const spaceStart = this.state.pos,
      comments = [];
    loop: while (this.state.pos < this.length) {
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 32:
        case 160:
        case 9:
          ++this.state.pos;
          break;
        case 13:
          this.input.charCodeAt(this.state.pos + 1) !== 10 || ++this.state.pos;

        case 10:
        case 8232:
        case 8233:
          ++this.state.pos;
          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
          break;
        case 47:
          switch (this.input.charCodeAt(this.state.pos + 1)) {
            case 42: {
              const comment = this.skipBlockComment("*/");
              if (comment !== void 0) {
                this.addComment(comment);
                this.options.attachComment && comments.push(comment);
              }
              break;
            }
            case 47: {
              const comment = this.skipLineComment(2);
              if (comment !== void 0) {
                this.addComment(comment);
                this.options.attachComment && comments.push(comment);
              }
              break;
            }
            default:
              break loop;
          }
          break;
        default:
          if (isWhitespace(ch)) ++this.state.pos;
          else if (ch === 45 && !this.inModule && this.options.annexB) {
            const pos = this.state.pos;
            if (
              this.input.charCodeAt(pos + 1) !== 45 ||
              this.input.charCodeAt(pos + 2) !== 62 ||
              !(spaceStart === 0 || this.state.lineStart > spaceStart)
            )
              break loop;

            const comment = this.skipLineComment(3);
            if (comment !== void 0) {
              this.addComment(comment);
              this.options.attachComment && comments.push(comment);
            }
          } else if (ch === 60 && !this.inModule && this.options.annexB) {
            const pos = this.state.pos;
            if (
              this.input.charCodeAt(pos + 1) !== 33 ||
              this.input.charCodeAt(pos + 2) !== 45 ||
              this.input.charCodeAt(pos + 3) !== 45
            )
              break loop;

            const comment = this.skipLineComment(4);
            if (comment !== void 0) {
              this.addComment(comment);
              this.options.attachComment && comments.push(comment);
            }
          } else break loop;
      }
    }
    if (comments.length > 0) {
      const commentWhitespace = {
        start: spaceStart,
        end: this.state.pos,
        comments,
        leadingNode: null,
        trailingNode: null,
        containingNode: null
      };
      this.state.commentStack.push(commentWhitespace);
    }
  }
  finishToken(type, val) {
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    const prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;
    this.isLookahead || this.updateContext(prevType);
  }
  replaceToken(type) {
    this.state.type = type;
    this.updateContext();
  }
  readToken_numberSign() {
    if (this.state.pos === 0 && this.readToken_interpreter()) return;

    const nextPos = this.state.pos + 1,
      next = this.codePointAtPos(nextPos);
    if (next >= 48 && next <= 57)
      throw this.raise(Errors.UnexpectedDigitAfterHash, { at: this.state.curPosition() });

    if (next === 123 || (next === 91 && this.hasPlugin("recordAndTuple"))) {
      this.expectPlugin("recordAndTuple");
      if (this.getPluginOption("recordAndTuple", "syntaxType") === "bar")
        throw this.raise(
          next === 123
            ? Errors.RecordExpressionHashIncorrectStartSyntaxType
            : Errors.TupleExpressionHashIncorrectStartSyntaxType,
          { at: this.state.curPosition() }
        );

      this.state.pos += 2;
      next === 123 ? this.finishToken(7) : this.finishToken(1);
    } else if (common.isIdentifierStart(next)) {
      ++this.state.pos;
      this.finishToken(136, this.readWord1(next));
    } else if (next === 92) {
      ++this.state.pos;
      this.finishToken(136, this.readWord1());
    } else this.finishOp(27, 1);
  }
  readToken_dot() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= 48 && next <= 57) this.readNumber(true);
    else if (next === 46 && this.input.charCodeAt(this.state.pos + 2) === 46) {
      this.state.pos += 3;
      this.finishToken(21);
    } else {
      ++this.state.pos;
      this.finishToken(16);
    }
  }
  readToken_slash() {
    this.input.charCodeAt(this.state.pos + 1) === 61 ? this.finishOp(31, 2) : this.finishOp(56, 1);
  }
  readToken_interpreter() {
    if (this.state.pos !== 0 || this.length < 2) return false;
    let ch = this.input.charCodeAt(this.state.pos + 1);
    if (ch !== 33) return false;
    const start = this.state.pos;
    this.state.pos += 1;
    while (!isNewLine(ch) && ++this.state.pos < this.length) ch = this.input.charCodeAt(this.state.pos);

    const value = this.input.slice(start + 2, this.state.pos);
    this.finishToken(28, value);
    return true;
  }
  readToken_mult_modulo(code) {
    let type = code === 42 ? 55 : 54,
      width = 1,
      next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 42 && next === 42) {
      width++;
      next = this.input.charCodeAt(this.state.pos + 2);
      type = 57;
    }
    if (next === 61 && !this.state.inType) {
      width++;
      type = code === 37 ? 33 : 30;
    }
    this.finishOp(type, width);
  }
  readToken_pipe_amp(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === code) {
      this.input.charCodeAt(this.state.pos + 2) === 61
        ? this.finishOp(30, 3)
        : this.finishOp(code === 124 ? 41 : 42, 2);

      return;
    }
    if (code === 124) {
      if (next === 62) {
        this.finishOp(39, 2);
        return;
      }
      if (this.hasPlugin("recordAndTuple") && next === 125) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar")
          throw this.raise(Errors.RecordExpressionBarIncorrectEndSyntaxType, { at: this.state.curPosition() });

        this.state.pos += 2;
        this.finishToken(9);
        return;
      }
      if (this.hasPlugin("recordAndTuple") && next === 93) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar")
          throw this.raise(Errors.TupleExpressionBarIncorrectEndSyntaxType, { at: this.state.curPosition() });

        this.state.pos += 2;
        this.finishToken(4);
        return;
      }
    }
    next === 61 ? this.finishOp(30, 2) : this.finishOp(code === 124 ? 43 : 45, 1);
  }
  readToken_caret() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61 && !this.state.inType) this.finishOp(32, 2);
    else if (next === 94 && this.hasPlugin(["pipelineOperator", { proposal: "hack", topicToken: "^^" }])) {
      this.finishOp(37, 2);
      this.input.codePointAt(this.state.pos) !== 94 || this.unexpected();
    } else this.finishOp(44, 1);
  }
  readToken_atSign() {
    this.input.charCodeAt(this.state.pos + 1) === 64 &&
    this.hasPlugin(["pipelineOperator", { proposal: "hack", topicToken: "@@" }])
      ? this.finishOp(38, 2)
      : this.finishOp(26, 1);
  }
  readToken_plus_min(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    next === code ? this.finishOp(34, 2) : next === 61 ? this.finishOp(30, 2) : this.finishOp(53, 1);
  }
  readToken_lt() {
    const { pos } = this.state,
      next = this.input.charCodeAt(pos + 1);
    if (next === 60) {
      if (this.input.charCodeAt(pos + 2) === 61) {
        this.finishOp(30, 3);
        return;
      }
      this.finishOp(51, 2);
    } else next === 61 ? this.finishOp(49, 2) : this.finishOp(47, 1);
  }
  readToken_gt() {
    const { pos } = this.state,
      next = this.input.charCodeAt(pos + 1);
    if (next === 62) {
      const size = this.input.charCodeAt(pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(pos + size) === 61) {
        this.finishOp(30, size + 1);
        return;
      }
      this.finishOp(52, size);
    } else next === 61 ? this.finishOp(49, 2) : this.finishOp(48, 1);
  }
  readToken_eq_excl(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61) this.finishOp(46, this.input.charCodeAt(this.state.pos + 2) === 61 ? 3 : 2);
    else if (code === 61 && next === 62) {
      this.state.pos += 2;
      this.finishToken(19);
    } else this.finishOp(code === 61 ? 29 : 35, 1);
  }
  readToken_question() {
    const next = this.input.charCodeAt(this.state.pos + 1),
      next2 = this.input.charCodeAt(this.state.pos + 2);
    if (next === 63) next2 === 61 ? this.finishOp(30, 3) : this.finishOp(40, 2);
    else if (next !== 46 || (next2 >= 48 && next2 <= 57)) {
      ++this.state.pos;
      this.finishToken(17);
    } else {
      this.state.pos += 2;
      this.finishToken(18);
    }
  }
  getTokenFromCode(code) {
    switch (code) {
      case 46:
        this.readToken_dot();
        return;
      case 40:
        ++this.state.pos;
        this.finishToken(10);
        return;
      case 41:
        ++this.state.pos;
        this.finishToken(11);
        return;
      case 59:
        ++this.state.pos;
        this.finishToken(13);
        return;
      case 44:
        ++this.state.pos;
        this.finishToken(12);
        return;
      case 91:
        if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === 124) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar")
            throw this.raise(Errors.TupleExpressionBarIncorrectStartSyntaxType, { at: this.state.curPosition() });

          this.state.pos += 2;
          this.finishToken(2);
        } else {
          ++this.state.pos;
          this.finishToken(0);
        }
        return;
      case 93:
        ++this.state.pos;
        this.finishToken(3);
        return;
      case 123:
        if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === 124) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar")
            throw this.raise(Errors.RecordExpressionBarIncorrectStartSyntaxType, { at: this.state.curPosition() });

          this.state.pos += 2;
          this.finishToken(6);
        } else {
          ++this.state.pos;
          this.finishToken(5);
        }
        return;
      case 125:
        ++this.state.pos;
        this.finishToken(8);
        return;
      case 58:
        if (this.hasPlugin("functionBind") && this.input.charCodeAt(this.state.pos + 1) === 58) this.finishOp(15, 2);
        else {
          ++this.state.pos;
          this.finishToken(14);
        }
        return;
      case 63:
        this.readToken_question();
        return;
      case 96:
        this.readTemplateToken();
        return;
      case 48: {
        const next = this.input.charCodeAt(this.state.pos + 1);
        if (next === 120 || next === 88) {
          this.readRadixNumber(16);
          return;
        }
        if (next === 111 || next === 79) {
          this.readRadixNumber(8);
          return;
        }
        if (next === 98 || next === 66) {
          this.readRadixNumber(2);
          return;
        }
      }
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.readNumber(false);
        return;
      case 34:
      case 39:
        this.readString(code);
        return;
      case 47:
        this.readToken_slash();
        return;
      case 37:
      case 42:
        this.readToken_mult_modulo(code);
        return;
      case 124:
      case 38:
        this.readToken_pipe_amp(code);
        return;
      case 94:
        this.readToken_caret();
        return;
      case 43:
      case 45:
        this.readToken_plus_min(code);
        return;
      case 60:
        this.readToken_lt();
        return;
      case 62:
        this.readToken_gt();
        return;
      case 61:
      case 33:
        this.readToken_eq_excl(code);
        return;
      case 126:
        this.finishOp(36, 1);
        return;
      case 64:
        this.readToken_atSign();
        return;
      case 35:
        this.readToken_numberSign();
        return;
      case 92:
        this.readWord();
        return;
      default:
        if (common.isIdentifierStart(code)) {
          this.readWord(code);
          return;
        }
    }
    throw this.raise(Errors.InvalidOrUnexpectedToken, {
      at: this.state.curPosition(),
      unexpected: String.fromCodePoint(code)
    });
  }
  finishOp(type, size) {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
  readRegexp() {
    const startLoc = this.state.startLoc,
      start = this.state.start + 1;
    let escaped, inClass,
      { pos } = this.state;
    for (; ; ++pos) {
      if (pos >= this.length)
        throw this.raise(Errors.UnterminatedRegExp, { at: createPositionWithColumnOffset(startLoc, 1) });

      const ch = this.input.charCodeAt(pos);
      if (isNewLine(ch))
        throw this.raise(Errors.UnterminatedRegExp, { at: createPositionWithColumnOffset(startLoc, 1) });

      if (escaped) escaped = false;
      else {
        if (ch === 91) inClass = true;
        else if (ch === 93 && inClass) inClass = false;
        else if (ch === 47 && !inClass) break;

        escaped = ch === 92;
      }
    }
    const content = this.input.slice(start, pos);
    ++pos;
    let mods = "";
    const nextPos = () => createPositionWithColumnOffset(startLoc, pos + 2 - start);
    while (pos < this.length) {
      const cp = this.codePointAtPos(pos),
        char = String.fromCharCode(cp);
      if (VALID_REGEX_FLAGS.has(cp)) {
        cp === 118
          ? mods.includes("u") && this.raise(Errors.IncompatibleRegExpUVFlags, { at: nextPos() })
          : cp === 117 && mods.includes("v") && this.raise(Errors.IncompatibleRegExpUVFlags, { at: nextPos() });

        mods.includes(char) && this.raise(Errors.DuplicateRegExpFlags, { at: nextPos() });
      } else if (!common.isIdentifierChar(cp) && cp !== 92) break;
      else this.raise(Errors.MalformedRegExpFlags, { at: nextPos() });

      ++pos;
      mods += char;
    }
    this.state.pos = pos;
    this.finishToken(135, { pattern: content, flags: mods });
  }
  /** @returns {?number} */
  readInt(radix, len, forceLen = false, allowNumSeparator = true) {
    const { n, pos } = common.readInt(
      this.input,
      this.state.pos,
      this.state.lineStart,
      this.state.curLine,
      radix,
      len,
      forceLen,
      allowNumSeparator,
      this.errorHandlers_readInt,
      false
    );
    this.state.pos = pos;
    return n;
  }
  readRadixNumber(radix) {
    const startLoc = this.state.curPosition();
    let isBigInt = false;
    this.state.pos += 2;
    const val = this.readInt(radix);
    val == null && this.raise(Errors.InvalidDigit, { at: createPositionWithColumnOffset(startLoc, 2), radix });

    const next = this.input.charCodeAt(this.state.pos);
    if (next === 110) {
      ++this.state.pos;
      isBigInt = true;
    } else if (next === 109) throw this.raise(Errors.InvalidDecimal, { at: startLoc });

    if (common.isIdentifierStart(this.codePointAtPos(this.state.pos)))
      throw this.raise(Errors.NumberIdentifier, { at: this.state.curPosition() });

    if (isBigInt) {
      const str = this.input.slice(startLoc.index, this.state.pos).replace(/[_n]/g, "");
      this.finishToken(133, str);
    } else this.finishToken(132, val);
  }
  readNumber(startsWithDot) {
    const start = this.state.pos,
      startLoc = this.state.curPosition();
    let isFloat = false,
      isBigInt = false,
      isDecimal = false,
      hasExponent = false,
      isOctal = false;
    startsWithDot || this.readInt(10) !== null || this.raise(Errors.InvalidNumber, { at: this.state.curPosition() });

    const hasLeadingZero = this.state.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (hasLeadingZero) {
      const integer = this.input.slice(start, this.state.pos);
      this.recordStrictModeErrors(Errors.StrictOctalLiteral, { at: startLoc });
      if (!this.state.strict) {
        const underscorePos = integer.indexOf("_");
        underscorePos > 0 &&
          this.raise(Errors.ZeroDigitNumericSeparator, { at: createPositionWithColumnOffset(startLoc, underscorePos) });
      }
      isOctal = hasLeadingZero && !/[89]/.test(integer);
    }
    let next = this.input.charCodeAt(this.state.pos);
    if (next === 46 && !isOctal) {
      ++this.state.pos;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    if ((next === 69 || next === 101) && !isOctal) {
      next = this.input.charCodeAt(++this.state.pos);
      if (next === 43 || next === 45) ++this.state.pos;

      this.readInt(10) !== null || this.raise(Errors.InvalidOrMissingExponent, { at: startLoc });

      isFloat = true;
      hasExponent = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    if (next === 110) {
      if (isFloat || hasLeadingZero) this.raise(Errors.InvalidBigIntLiteral, { at: startLoc });

      ++this.state.pos;
      isBigInt = true;
    }
    if (next === 109) {
      this.expectPlugin("decimal", this.state.curPosition());
      if (hasExponent || hasLeadingZero) this.raise(Errors.InvalidDecimal, { at: startLoc });

      ++this.state.pos;
      isDecimal = true;
    }
    if (common.isIdentifierStart(this.codePointAtPos(this.state.pos)))
      throw this.raise(Errors.NumberIdentifier, { at: this.state.curPosition() });

    const str = this.input.slice(start, this.state.pos).replace(/[_mn]/g, "");
    if (isBigInt) {
      this.finishToken(133, str);
      return;
    }
    if (isDecimal) {
      this.finishToken(134, str);
      return;
    }
    const val = isOctal ? parseInt(str, 8) : parseFloat(str);
    this.finishToken(132, val);
  }
  /** @returns {?number} */
  readCodePoint(throwOnInvalid) {
    const { code, pos } = common.readCodePoint(
      this.input,
      this.state.pos,
      this.state.lineStart,
      this.state.curLine,
      throwOnInvalid,
      this.errorHandlers_readCodePoint
    );
    this.state.pos = pos;
    return code;
  }
  readString(quote) {
    const { str, pos, curLine, lineStart } = common.readStringContents(
      quote === 34 ? "double" : "single",
      this.input,
      this.state.pos + 1,
      this.state.lineStart,
      this.state.curLine,
      this.errorHandlers_readStringContents_string
    );
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    this.finishToken(131, str);
  }
  readTemplateContinuation() {
    this.match(8) || this.unexpected(null, 8);

    this.state.pos--;
    this.readTemplateToken();
  }
  readTemplateToken() {
    const opening = this.input[this.state.pos];
    const { str, firstInvalidLoc, pos, curLine, lineStart } = common.readStringContents(
      "template",
      this.input,
      this.state.pos + 1,
      this.state.lineStart,
      this.state.curLine,
      this.errorHandlers_readStringContents_template
    );
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    if (firstInvalidLoc)
      this.state.firstInvalidTemplateEscapePos = new Position(
        firstInvalidLoc.curLine,
        firstInvalidLoc.pos - firstInvalidLoc.lineStart,
        firstInvalidLoc.pos
      );

    if (this.input.codePointAt(pos) === 96) this.finishToken(24, firstInvalidLoc ? null : opening + str + "`");
    else {
      this.state.pos++;
      this.finishToken(25, firstInvalidLoc ? null : opening + str + "${");
    }
  }
  recordStrictModeErrors(toParseError, { at }) {
    const index = at.index;
    this.state.strict && !this.state.strictErrors.has(index)
      ? this.raise(toParseError, { at })
      : this.state.strictErrors.set(index, [toParseError, at]);
  }
  readWord1(firstCode) {
    this.state.containsEsc = false;
    let word = "";
    const start = this.state.pos;
    let chunkStart = this.state.pos;
    if (firstCode !== void 0) this.state.pos += firstCode <= 0xffff ? 1 : 2;

    while (this.state.pos < this.length) {
      const ch = this.codePointAtPos(this.state.pos);
      if (common.isIdentifierChar(ch)) this.state.pos += ch <= 0xffff ? 1 : 2;
      else if (ch === 92) {
        this.state.containsEsc = true;
        word += this.input.slice(chunkStart, this.state.pos);
        const escStart = this.state.curPosition(),
          identifierCheck = this.state.pos === start ? common.isIdentifierStart : common.isIdentifierChar;
        if (this.input.charCodeAt(++this.state.pos) !== 117) {
          this.raise(Errors.MissingUnicodeEscape, { at: this.state.curPosition() });
          chunkStart = this.state.pos - 1;
          continue;
        }
        ++this.state.pos;
        const esc = this.readCodePoint(true);
        if (esc !== null) {
          identifierCheck(esc) || this.raise(Errors.EscapedCharNotAnIdentifier, { at: escStart });

          word += String.fromCodePoint(esc);
        }
        chunkStart = this.state.pos;
      } else break;
    }
    return word + this.input.slice(chunkStart, this.state.pos);
  }
  readWord(firstCode) {
    const word = this.readWord1(firstCode),
      type = keywords.get(word);
    type !== void 0 ? this.finishToken(type, tokenLabelName(type)) : this.finishToken(130, word);
  }
  checkKeywordEscapes() {
    const { type } = this.state;
    tokenIsKeyword(type) && this.state.containsEsc &&
      this.raise(Errors.InvalidEscapedReservedWord, { at: this.state.startLoc, reservedWord: tokenLabelName(type) });
  }
  raise(toParseError, raiseProperties) {
    const { at } = raiseProperties,
      details = _objectWithoutPropertiesLoose(raiseProperties, ["at"]),
      error = toParseError({ loc: at instanceof Position ? at : at.loc.start, details });
    if (!this.options.errorRecovery) throw error;
    this.isLookahead || this.state.errors.push(error);
    return error;
  }
  raiseOverwrite(toParseError, raiseProperties) {
    const { at } = raiseProperties,
      details = _objectWithoutPropertiesLoose(raiseProperties, ["at"]),
      loc = at instanceof Position ? at : at.loc.start,
      pos = loc.index,
      errors = this.state.errors;
    for (let i = errors.length - 1; i >= 0; i--) {
      const error = errors[i];
      if (error.loc.index === pos) return (errors[i] = toParseError({ loc, details }));

      if (error.loc.index < pos) break;
    }
    return this.raise(toParseError, raiseProperties);
  }
  /** @param {number} [prevType] */
  updateContext(prevType) {}
  unexpected(loc, type) {
    throw this.raise(Errors.UnexpectedToken, {
      expected: type ? tokenLabelName(type) : null,
      at: loc != null ? loc : this.state.startLoc
    });
  }
  expectPlugin(pluginName, loc) {
    if (this.hasPlugin(pluginName)) return true;

    throw this.raise(Errors.MissingPlugin, {
      at: loc != null ? loc : this.state.startLoc,
      missingPlugin: [pluginName]
    });
  }
  expectOnePlugin(pluginNames) {
    if (!pluginNames.some(name => this.hasPlugin(name)))
      throw this.raise(Errors.MissingOneOfPlugins, { at: this.state.startLoc, missingPlugin: pluginNames });
  }
  errorBuilder(error) {
    return (pos, lineStart, curLine) => {
      this.raise(error, { at: buildPosition(pos, lineStart, curLine) });
    };
  }
}

class ClassScope {
  constructor() {
    this.privateNames = new Set();
    this.loneAccessors = new Map();
    this.undefinedPrivateNames = new Map();
  }
}
class ClassScopeHandler {
  constructor(parser) {
    this.parser = void 0;
    this.stack = [];
    this.undefinedPrivateNames = new Map();
    this.parser = parser;
  }
  current() {
    return this.stack[this.stack.length - 1];
  }
  enter() {
    this.stack.push(new ClassScope());
  }
  exit() {
    const oldClassScope = this.stack.pop(),
      current = this.current();
    for (const [name, loc] of Array.from(oldClassScope.undefinedPrivateNames))
      current
        ? current.undefinedPrivateNames.has(name) || current.undefinedPrivateNames.set(name, loc)
        : this.parser.raise(Errors.InvalidPrivateFieldResolution, { at: loc, identifierName: name });
  }
  declarePrivateName(name, elementType, loc) {
    const { privateNames, loneAccessors, undefinedPrivateNames } = this.current();
    let redefined = privateNames.has(name);
    if (elementType & ClassElementType.KIND_ACCESSOR) {
      const accessor = redefined && loneAccessors.get(name);
      if (accessor) {
        const oldStatic = accessor & ClassElementType.FLAG_STATIC,
          newStatic = elementType & ClassElementType.FLAG_STATIC;
        redefined =
          (accessor & ClassElementType.KIND_ACCESSOR) == (elementType & ClassElementType.KIND_ACCESSOR) ||
          oldStatic !== newStatic;
        redefined || loneAccessors.delete(name);
      } else redefined || loneAccessors.set(name, elementType);
    }
    redefined && this.parser.raise(Errors.PrivateNameRedeclaration, { at: loc, identifierName: name });

    privateNames.add(name);
    undefinedPrivateNames.delete(name);
  }
  usePrivateName(name, loc) {
    let classScope;
    for (classScope of this.stack) if (classScope.privateNames.has(name)) return;

    classScope
      ? classScope.undefinedPrivateNames.set(name, loc)
      : this.parser.raise(Errors.InvalidPrivateFieldResolution, { at: loc, identifierName: name });
  }
}

class ExpressionScope {
  constructor(type = 0) {
    this.type = type;
  }
  canBeArrowParameterDeclaration() {
    return this.type === 2 || this.type === 1;
  }
  isCertainlyParameterDeclaration() {
    return this.type === 3;
  }
}
class ArrowHeadParsingScope extends ExpressionScope {
  constructor(type) {
    super(type);
    this.declarationErrors = new Map();
  }
  recordDeclarationError(ParsingErrorClass, { at }) {
    const index = at.index;
    this.declarationErrors.set(index, [ParsingErrorClass, at]);
  }
  clearDeclarationError(index) {
    this.declarationErrors.delete(index);
  }
  iterateErrors(iterator) {
    this.declarationErrors.forEach(iterator);
  }
}
class ExpressionScopeHandler {
  constructor(parser) {
    this.parser = void 0;
    this.stack = [new ExpressionScope()];
    this.parser = parser;
  }
  enter(scope) {
    this.stack.push(scope);
  }
  exit() {
    this.stack.pop();
  }
  recordParameterInitializerError(toParseError, { at: node }) {
    const origin = { at: node.loc.start },
      { stack } = this;
    for (let i = stack.length - 1, scope = stack[i]; !scope.isCertainlyParameterDeclaration(); ) {
      if (!scope.canBeArrowParameterDeclaration()) return;

      scope.recordDeclarationError(toParseError, origin);
      scope = stack[--i];
    }
    this.parser.raise(toParseError, origin);
  }
  recordArrowParameterBindingError(error, { at: node }) {
    const { stack } = this,
      scope = stack[stack.length - 1],
      origin = { at: node.loc.start };
    if (scope.isCertainlyParameterDeclaration()) this.parser.raise(error, origin);
    else if (scope.canBeArrowParameterDeclaration()) scope.recordDeclarationError(error, origin);
    //else return;
  }
  recordAsyncArrowParametersError({ at }) {
    const { stack } = this;
    for (let i = stack.length - 1, scope = stack[i]; scope.canBeArrowParameterDeclaration(); ) {
      scope.type !== 2 || scope.recordDeclarationError(Errors.AwaitBindingIdentifier, { at });

      scope = stack[--i];
    }
  }
  validateAsPattern() {
    const { stack } = this,
      currentScope = stack[stack.length - 1];
    if (!currentScope.canBeArrowParameterDeclaration()) return;
    currentScope.iterateErrors(([toParseError, loc]) => {
      this.parser.raise(toParseError, { at: loc });
      for (let i = stack.length - 2, scope = stack[i]; scope.canBeArrowParameterDeclaration(); ) {
        scope.clearDeclarationError(loc.index);
        scope = stack[--i];
      }
    });
  }
}
function newParameterDeclarationScope() {
  return new ExpressionScope(3);
}
function newArrowHeadScope() {
  return new ArrowHeadParsingScope(1);
}
function newAsyncArrowScope() {
  return new ArrowHeadParsingScope(2);
}
function newExpressionScope() {
  return new ExpressionScope();
}

const PARAM = 0b0000,
  PARAM_YIELD = 0b0001,
  PARAM_AWAIT = 0b0010,
  PARAM_RETURN = 0b0100,
  PARAM_IN = 0b1000;
class ProductionParameterHandler {
  constructor() {
    this.stacks = [];
  }
  enter(flags) {
    this.stacks.push(flags);
  }
  exit() {
    this.stacks.pop();
  }
  currentFlags() {
    return this.stacks[this.stacks.length - 1];
  }
  get hasAwait() {
    return (this.currentFlags() & PARAM_AWAIT) > 0;
  }
  get hasYield() {
    return (this.currentFlags() & PARAM_YIELD) > 0;
  }
  get hasReturn() {
    return (this.currentFlags() & PARAM_RETURN) > 0;
  }
  get hasIn() {
    return (this.currentFlags() & PARAM_IN) > 0;
  }
}
function functionFlags(isAsync, isGenerator) {
  return (isAsync ? PARAM_AWAIT : 0) | (isGenerator ? PARAM_YIELD : 0);
}

class UtilParser extends Tokenizer {
  addExtra(node, key, value, enumerable = true) {
    if (!node) return;
    /**
     * @prop {*} expressionValue
     * @prop {*} rawValue
     * @prop {*} parenthesized
     * @prop {*} trailingCommaLoc
     * @prop {*} trailingComma
     */
    const extra = (node.extra = node.extra || {});
    enumerable ? (extra[key] = value) : Object.defineProperty(extra, key, { enumerable, value });
  }
  isContextual(token) {
    return this.state.type === token && !this.state.containsEsc;
  }
  isUnparsedContextual(nameStart, name) {
    const nameEnd = nameStart + name.length;
    if (this.input.slice(nameStart, nameEnd) === name) {
      const nextCh = this.input.charCodeAt(nameEnd);
      return !(common.isIdentifierChar(nextCh) || (nextCh & 0xfc00) == 0xd800);
    }
    return false;
  }
  isLookaheadContextual(name) {
    const next = this.nextTokenStart();
    return this.isUnparsedContextual(next, name);
  }
  eatContextual(token) {
    if (this.isContextual(token)) {
      this.next();
      return true;
    }
    return false;
  }
  expectContextual(token, toParseError) {
    if (!this.eatContextual(token)) {
      if (toParseError != null) throw this.raise(toParseError, { at: this.state.startLoc });

      this.unexpected(null, token);
    }
  }
  canInsertSemicolon() {
    return this.match(137) || this.match(8) || this.hasPrecedingLineBreak();
  }
  hasPrecedingLineBreak() {
    return lineBreak.test(this.input.slice(this.state.lastTokEndLoc.index, this.state.start));
  }
  hasFollowingLineBreak() {
    skipWhiteSpaceToLineBreak.lastIndex = this.state.end;
    return skipWhiteSpaceToLineBreak.test(this.input);
  }
  isLineTerminator() {
    return this.eat(13) || this.canInsertSemicolon();
  }
  semicolon(allowAsi = true) {
    (allowAsi ? this.isLineTerminator() : this.eat(13)) ||
      this.raise(Errors.MissingSemicolon, { at: this.state.lastTokEndLoc });
  }
  expect(type, loc) {
    this.eat(type) || this.unexpected(loc, type);
  }
  tryParse(fn, oldState = this.state.clone()) {
    const abortSignal = { node: null };
    try {
      const node = fn((node = null) => {
        abortSignal.node = node;
        throw abortSignal;
      });
      if (this.state.errors.length > oldState.errors.length) {
        const failState = this.state;
        this.state = oldState;
        this.state.tokensLength = failState.tokensLength;
        return { node, error: failState.errors[oldState.errors.length], thrown: false, aborted: false, failState };
      }
      return { node, error: null, thrown: false, aborted: false, failState: null };
    } catch (error) {
      const failState = this.state;
      this.state = oldState;
      if (error instanceof SyntaxError) return { node: null, error, thrown: true, aborted: false, failState };
      if (error === abortSignal)
        return { node: abortSignal.node, error: null, thrown: false, aborted: true, failState };

      throw error;
    }
  }
  checkExpressionErrors(refExpressionErrors, andThrow) {
    if (!refExpressionErrors) return false;
    const { shorthandAssignLoc, doubleProtoLoc, privateKeyLoc, optionalParametersLoc } = refExpressionErrors;
    if (!andThrow) return !!(shorthandAssignLoc || doubleProtoLoc || optionalParametersLoc || privateKeyLoc);

    shorthandAssignLoc == null || this.raise(Errors.InvalidCoverInitializedName, { at: shorthandAssignLoc });

    doubleProtoLoc == null || this.raise(Errors.DuplicateProto, { at: doubleProtoLoc });

    privateKeyLoc == null || this.raise(Errors.UnexpectedPrivateField, { at: privateKeyLoc });

    optionalParametersLoc == null || this.unexpected(optionalParametersLoc);
  }
  isLiteralPropertyName() {
    return tokenIsLiteralPropertyName(this.state.type);
  }
  isPrivateName(node) {
    return node.type === "PrivateName";
  }
  getPrivateNameSV(node) {
    return node.id.name;
  }
  hasPropertyAsPrivateName(node) {
    return (
      (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") &&
      this.isPrivateName(node.property)
    );
  }
  isObjectProperty(node) {
    return node.type === "ObjectProperty";
  }
  isObjectMethod(node) {
    return node.type === "ObjectMethod";
  }
  initializeScopes(inModule = this.options.sourceType === "module") {
    const oldLabels = this.state.labels;
    this.state.labels = [];
    const oldExportedIdentifiers = this.exportedIdentifiers;
    this.exportedIdentifiers = new Set();
    const oldInModule = this.inModule;
    this.inModule = inModule;
    const oldScope = this.scope,
      ScopeHandler = this.getScopeHandler();
    this.scope = new ScopeHandler(this, inModule);
    const oldProdParam = this.prodParam;
    this.prodParam = new ProductionParameterHandler();
    const oldClassScope = this.classScope;
    this.classScope = new ClassScopeHandler(this);
    const oldExpressionScope = this.expressionScope;
    this.expressionScope = new ExpressionScopeHandler(this);
    return () => {
      this.state.labels = oldLabels;
      this.exportedIdentifiers = oldExportedIdentifiers;
      this.inModule = oldInModule;
      this.scope = oldScope;
      this.prodParam = oldProdParam;
      this.classScope = oldClassScope;
      this.expressionScope = oldExpressionScope;
    };
  }
  enterInitialScopes() {
    let paramFlags = PARAM;
    if (this.inModule) paramFlags |= PARAM_AWAIT;

    this.scope.enter(ScopeFlag.PROGRAM);
    this.prodParam.enter(paramFlags);
  }
  checkDestructuringPrivate(refExpressionErrors) {
    const { privateKeyLoc } = refExpressionErrors;
    privateKeyLoc === null || this.expectPlugin("destructuringPrivate", privateKeyLoc);
  }
}
class ExpressionErrors {
  constructor() {
    this.shorthandAssignLoc = null;
    this.doubleProtoLoc = null;
    this.privateKeyLoc = null;
    this.optionalParametersLoc = null;
  }
}

class Node {
  constructor(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new SourceLocation(loc);
    if (parser != null && parser.options.ranges) this.range = [pos, 0];
    if (parser != null && parser.filename) this.loc.filename = parser.filename;
  }
}
const NodePrototype = Node.prototype;
NodePrototype.__clone = function () {
  const newNode = new Node(void 0, this.start, this.loc.start),
    keys = Object.keys(this);
  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i];
    if (key !== "leadingComments" && key !== "trailingComments" && key !== "innerComments") newNode[key] = this[key];
  }
  return newNode;
};

function clonePlaceholder(node) {
  return cloneIdentifier(node);
}
function cloneIdentifier(node) {
  const { type, start, end, loc, range, extra, name } = node,
    cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  cloned.extra = extra;
  cloned.name = name;
  if (type === "Placeholder") cloned.expectedNode = node.expectedNode;

  return cloned;
}
function cloneStringLiteral(node) {
  const { type, start, end, loc, range, extra } = node;
  if (type === "Placeholder") return clonePlaceholder(node);

  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  node.raw !== void 0 ? (cloned.raw = node.raw) : (cloned.extra = extra);

  cloned.value = node.value;
  return cloned;
}
class NodeUtils extends UtilParser {
  startNode() {
    return new Node(this, this.state.start, this.state.startLoc);
  }
  startNodeAt(loc) {
    return new Node(this, loc.index, loc);
  }
  startNodeAtNode(type) {
    return this.startNodeAt(type.loc.start);
  }
  finishNode(node, type) {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc);
  }
  finishNodeAt(node, type, endLoc) {
    node.type = type;
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
    this.options.attachComment && this.processComment(node);
    return node;
  }
  resetStartLocation(node, startLoc) {
    node.start = startLoc.index;
    node.loc.start = startLoc;
    if (this.options.ranges) node.range[0] = startLoc.index;
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
  }
  resetStartLocationFromNode(node, locationNode) {
    this.resetStartLocation(node, locationNode.loc.start);
  }
}

const reservedTypes = new Set([
  "_",
  "any",
  "bool",
  "boolean",
  "empty",
  "extends",
  "false",
  "interface",
  "mixed",
  "null",
  "number",
  "static",
  "string",
  "true",
  "typeof",
  "void"
]);
const FlowErrors = ParseErrorEnum`flow`({
  AmbiguousConditionalArrow: "Ambiguous expression: wrap the arrow functions in parentheses to disambiguate.",
  AmbiguousDeclareModuleKind:
    "Found both `declare module.exports` and `declare export` in the same module. Modules can only have 1 since they are either an ES module or they are a CommonJS module.",
  AssignReservedType: ({ reservedType }) => `Cannot overwrite reserved type ${reservedType}.`,
  DeclareClassElement: "The `declare` modifier can only appear on class fields.",
  DeclareClassFieldInitializer: "Initializers are not allowed in fields with the `declare` modifier.",
  DuplicateDeclareModuleExports: "Duplicate `declare module.exports` statement.",
  EnumBooleanMemberNotInitialized: ({ memberName, enumName }) =>
    `Boolean enum members need to be initialized. Use either \`${memberName} = true,\` or \`${memberName} = false,\` in enum \`${enumName}\`.`,
  EnumDuplicateMemberName: ({ memberName, enumName }) =>
    `Enum member names need to be unique, but the name \`${memberName}\` has already been used before in enum \`${enumName}\`.`,
  EnumInconsistentMemberValues: ({ enumName }) =>
    `Enum \`${enumName}\` has inconsistent member initializers. Either use no initializers, or consistently use literals (either booleans, numbers, or strings) for all member initializers.`,
  EnumInvalidExplicitType: ({ invalidEnumType, enumName }) =>
    `Enum type \`${invalidEnumType}\` is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidExplicitTypeUnknownSupplied: ({ enumName }) =>
    `Supplied enum type is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerPrimaryType: ({ enumName, memberName, explicitType }) =>
    `Enum \`${enumName}\` has type \`${explicitType}\`, so the initializer of \`${memberName}\` needs to be a ${explicitType} literal.`,
  EnumInvalidMemberInitializerSymbolType: ({ enumName, memberName }) =>
    `Symbol enum members cannot be initialized. Use \`${memberName},\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerUnknownType: ({ enumName, memberName }) =>
    `The enum member initializer for \`${memberName}\` needs to be a literal (either a boolean, number, or string) in enum \`${enumName}\`.`,
  EnumInvalidMemberName: ({ enumName, memberName, suggestion }) =>
    `Enum member names cannot start with lowercase 'a' through 'z'. Instead of using \`${memberName}\`, consider using \`${suggestion}\`, in enum \`${enumName}\`.`,
  EnumNumberMemberNotInitialized: ({ enumName, memberName }) =>
    `Number enum members need to be initialized, e.g. \`${memberName} = 1\` in enum \`${enumName}\`.`,
  EnumStringMemberInconsistentlyInitialized: ({ enumName }) =>
    `String enum members need to consistently either all use initializers, or use no initializers, in enum \`${enumName}\`.`,
  GetterMayNotHaveThisParam: "A getter cannot have a `this` parameter.",
  ImportReflectionHasImportType: "An `import module` declaration can not use `type` or `typeof` keyword.",
  ImportTypeShorthandOnlyInPureImport:
    "The `type` and `typeof` keywords on named imports can only be used on regular `import` statements. It cannot be used with `import type` or `import typeof` statements.",
  InexactInsideExact: "Explicit inexact syntax cannot appear inside an explicit exact object type.",
  InexactInsideNonObject: "Explicit inexact syntax cannot appear in class or interface definitions.",
  InexactVariance: "Explicit inexact syntax cannot have variance.",
  InvalidNonTypeImportInDeclareModule:
    "Imports within a `declare module` body must always be `import type` or `import typeof`.",
  MissingTypeParamDefault:
    "Type parameter declaration needs a default, since a preceding type parameter declaration has a default.",
  NestedDeclareModule: "`declare module` cannot be used inside another `declare module`.",
  NestedFlowComment: "Cannot have a flow comment inside another flow comment.",
  PatternIsOptional: Object.assign(
    { message: "A binding pattern parameter cannot be optional in an implementation signature." },
    { reasonCode: "OptionalBindingPattern" }
  ),
  SetterMayNotHaveThisParam: "A setter cannot have a `this` parameter.",
  SpreadVariance: "Spread properties cannot have variance.",
  ThisParamAnnotationRequired: "A type annotation is required for the `this` parameter.",
  ThisParamBannedInConstructor:
    "Constructors cannot have a `this` parameter; constructors don't bind `this` like other functions.",
  ThisParamMayNotBeOptional: "The `this` parameter cannot be optional.",
  ThisParamMustBeFirst: "The `this` parameter must be the first function parameter.",
  ThisParamNoDefault: "The `this` parameter may not have a default value.",
  TypeBeforeInitializer:
    "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeCastInPattern: "The type cast expression is expected to be wrapped with parenthesis.",
  UnexpectedExplicitInexactInObject: "Explicit inexact syntax must appear at the end of an inexact object.",
  UnexpectedReservedType: ({ reservedType }) => `Unexpected reserved type ${reservedType}.`,
  UnexpectedReservedUnderscore: "`_` is only allowed as a type argument to call or new.",
  UnexpectedSpaceBetweenModuloChecks: "Spaces between `%` and `checks` are not allowed here.",
  UnexpectedSpreadType: "Spread operator cannot appear in class or interface definitions.",
  UnexpectedSubtractionOperand: 'Unexpected token, expected "number" or "bigint".',
  UnexpectedTokenAfterTypeParameter: "Expected an arrow function after this type parameter declaration.",
  UnexpectedTypeParameterBeforeAsyncArrowFunction:
    "Type parameters must come after the async keyword, e.g. instead of `<T> async () => {}`, use `async <T>() => {}`.",
  UnsupportedDeclareExportKind: ({ unsupportedExportKind, suggestion }) =>
    `\`declare export ${unsupportedExportKind}\` is not supported. Use \`${suggestion}\` instead.`,
  UnsupportedStatementInDeclareModule: "Only declares and type imports are allowed inside declare module.",
  UnterminatedFlowComment: "Unterminated flow-comment."
});
function isEsModuleType(bodyElement) {
  return (
    bodyElement.type === "DeclareExportAllDeclaration" ||
    (bodyElement.type === "DeclareExportDeclaration" &&
      (!bodyElement.declaration ||
        (bodyElement.declaration.type !== "TypeAlias" && bodyElement.declaration.type !== "InterfaceDeclaration")))
  );
}
function hasTypeImportKind(node) {
  return node.importKind === "type" || node.importKind === "typeof";
}
const exportSuggestions = {
  const: "declare export var",
  let: "declare export var",
  type: "export type",
  interface: "export interface"
};
function partition(list, test) {
  const list1 = [],
    list2 = [];
  for (let i = 0; i < list.length; i++) (test(list[i], i, list) ? list1 : list2).push(list[i]);

  return [list1, list2];
}
const FLOW_PRAGMA_REGEX = /\*?\s*@((?:no)?flow)\b/;
// noinspection JSUnusedGlobalSymbols
/** @prop {?string} flowPragma */
var flow = superClass => class extends superClass {
  constructor(...args) {
    super(...args);
    this.flowPragma = void 0;
  }
  getScopeHandler() {
    return FlowScopeHandler;
  }
  shouldParseTypes() {
    return this.getPluginOption("flow", "all") || this.flowPragma === "flow";
  }
  shouldParseEnums() {
    return !!this.getPluginOption("flow", "enums");
  }
  finishToken(type, val) {
    if (type !== 131 && type !== 13 && type !== 28 && this.flowPragma === void 0) this.flowPragma = null;

    super.finishToken(type, val);
  }
  addComment(comment) {
    if (this.flowPragma === void 0) {
      const matches = FLOW_PRAGMA_REGEX.exec(comment.value);
      if (matches)
        if (matches[1] === "flow") this.flowPragma = "flow";
        else if (matches[1] === "noflow") this.flowPragma = "noflow";
        else throw new Error("Unexpected flow pragma");
    }
    super.addComment(comment);
  }
  flowParseTypeInitialiser(tok) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(tok || 14);
    const type = this.flowParseType();
    this.state.inType = oldInType;
    return type;
  }
  flowParsePredicate() {
    const node = this.startNode(),
      moduloLoc = this.state.startLoc;
    this.next();
    this.expectContextual(108);
    this.state.lastTokStart > moduloLoc.index + 1 &&
      this.raise(FlowErrors.UnexpectedSpaceBetweenModuloChecks, { at: moduloLoc });

    if (this.eat(10)) {
      node.value = super.parseExpression();
      this.expect(11);
      return this.finishNode(node, "DeclaredPredicate");
    }
    return this.finishNode(node, "InferredPredicate");
  }
  flowParseTypeAndPredicateInitialiser() {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(14);
    let type = null,
      predicate = null;
    if (this.match(54)) {
      this.state.inType = oldInType;
      predicate = this.flowParsePredicate();
    } else {
      type = this.flowParseType();
      this.state.inType = oldInType;
      if (this.match(54)) predicate = this.flowParsePredicate();
    }
    return [type, predicate];
  }
  flowParseDeclareClass(node) {
    this.next();
    this.flowParseInterfaceish(node, true);
    return this.finishNode(node, "DeclareClass");
  }
  flowParseDeclareFunction(node) {
    this.next();
    const id = (node.id = this.parseIdentifier()),
      typeNode = this.startNode(),
      typeContainer = this.startNode();
    this.match(47)
      ? (typeNode.typeParameters = this.flowParseTypeParameterDeclaration())
      : (typeNode.typeParameters = null);

    this.expect(10);
    const tmp = this.flowParseFunctionTypeParams();
    typeNode.params = tmp.params;
    typeNode.rest = tmp.rest;
    typeNode.this = tmp._this;
    this.expect(11);
    [typeNode.returnType, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
    typeContainer.typeAnnotation = this.finishNode(typeNode, "FunctionTypeAnnotation");
    id.typeAnnotation = this.finishNode(typeContainer, "TypeAnnotation");
    this.resetEndLocation(id);
    this.semicolon();
    this.scope.declareName(node.id.name, BindingFlag.TYPE_FLOW_DECLARE_FN, node.id.loc.start);
    return this.finishNode(node, "DeclareFunction");
  }
  flowParseDeclare(node, insideModule) {
    if (this.match(80)) return this.flowParseDeclareClass(node);
    if (this.match(68)) return this.flowParseDeclareFunction(node);
    if (this.match(74)) return this.flowParseDeclareVariable(node);
    if (this.eatContextual(125)) {
      if (this.match(16)) return this.flowParseDeclareModuleExports(node);

      insideModule && this.raise(FlowErrors.NestedDeclareModule, { at: this.state.lastTokStartLoc });

      return this.flowParseDeclareModule(node);
    }
    if (this.isContextual(128)) return this.flowParseDeclareTypeAlias(node);
    if (this.isContextual(129)) return this.flowParseDeclareOpaqueType(node);
    if (this.isContextual(127)) return this.flowParseDeclareInterface(node);
    if (this.match(82)) return this.flowParseDeclareExportDeclaration(node, insideModule);

    this.unexpected();
  }
  flowParseDeclareVariable(node) {
    this.next();
    node.id = this.flowParseTypeAnnotatableIdentifier(true);
    this.scope.declareName(node.id.name, BindingFlag.TYPE_VAR, node.id.loc.start);
    this.semicolon();
    return this.finishNode(node, "DeclareVariable");
  }
  flowParseDeclareModule(node) {
    this.scope.enter(ScopeFlag.OTHER);
    this.match(131) ? (node.id = super.parseExprAtom()) : (node.id = this.parseIdentifier());

    const bodyNode = (node.body = this.startNode()),
      body = (bodyNode.body = []);
    this.expect(5);
    while (!this.match(8)) {
      let bodyNode = this.startNode();
      if (this.match(83)) {
        this.next();
        this.isContextual(128) || this.match(87) ||
          this.raise(FlowErrors.InvalidNonTypeImportInDeclareModule, { at: this.state.lastTokStartLoc });

        super.parseImport(bodyNode);
      } else {
        this.expectContextual(123, FlowErrors.UnsupportedStatementInDeclareModule);
        bodyNode = this.flowParseDeclare(bodyNode, true);
      }
      body.push(bodyNode);
    }
    this.scope.exit();
    this.expect(8);
    this.finishNode(bodyNode, "BlockStatement");
    let kind = null,
      hasModuleExport = false;
    body.forEach(bodyElement => {
      if (isEsModuleType(bodyElement)) {
        kind !== "CommonJS" || this.raise(FlowErrors.AmbiguousDeclareModuleKind, { at: bodyElement });

        kind = "ES";
      } else if (bodyElement.type === "DeclareModuleExports") {
        hasModuleExport && this.raise(FlowErrors.DuplicateDeclareModuleExports, { at: bodyElement });

        kind !== "ES" || this.raise(FlowErrors.AmbiguousDeclareModuleKind, { at: bodyElement });

        kind = "CommonJS";
        hasModuleExport = true;
      }
    });
    node.kind = kind || "CommonJS";
    return this.finishNode(node, "DeclareModule");
  }
  flowParseDeclareExportDeclaration(node, insideModule) {
    this.expect(82);
    if (this.eat(65)) {
      if (this.match(68) || this.match(80)) node.declaration = this.flowParseDeclare(this.startNode());
      else {
        node.declaration = this.flowParseType();
        this.semicolon();
      }
      node.default = true;
      return this.finishNode(node, "DeclareExportDeclaration");
    }
    if (this.match(75) || this.isLet() || ((this.isContextual(128) || this.isContextual(127)) && !insideModule)) {
      const label = this.state.value;
      throw this.raise(FlowErrors.UnsupportedDeclareExportKind, {
        at: this.state.startLoc,
        unsupportedExportKind: label,
        suggestion: exportSuggestions[label]
      });
    }
    if (this.match(74) || this.match(68) || this.match(80) || this.isContextual(129)) {
      node.declaration = this.flowParseDeclare(this.startNode());
      node.default = false;
      return this.finishNode(node, "DeclareExportDeclaration");
    }
    if (
      this.match(55) ||
      this.match(5) ||
      this.isContextual(127) ||
      this.isContextual(128) ||
      this.isContextual(129)
    ) {
      if ((node = this.parseExport(node, null)).type === "ExportNamedDeclaration") {
        node.type = "ExportDeclaration";
        node.default = false;
        delete node.exportKind;
      }
      node.type = "Declare" + node.type;
      return node;
    }

    this.unexpected();
  }
  flowParseDeclareModuleExports(node) {
    this.next();
    this.expectContextual(109);
    node.typeAnnotation = this.flowParseTypeAnnotation();
    this.semicolon();
    return this.finishNode(node, "DeclareModuleExports");
  }
  flowParseDeclareTypeAlias(node) {
    this.next();
    const finished = this.flowParseTypeAlias(node);
    finished.type = "DeclareTypeAlias";
    return finished;
  }
  flowParseDeclareOpaqueType(node) {
    this.next();
    const finished = this.flowParseOpaqueType(node, true);
    finished.type = "DeclareOpaqueType";
    return finished;
  }
  flowParseDeclareInterface(node) {
    this.next();
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "DeclareInterface");
  }
  flowParseInterfaceish(node, isClass) {
    node.id = this.flowParseRestrictedIdentifier(!isClass, true);
    this.scope.declareName(
      node.id.name,
      isClass ? BindingFlag.TYPE_FUNCTION : BindingFlag.TYPE_LEXICAL,
      node.id.loc.start
    );
    this.match(47) ? (node.typeParameters = this.flowParseTypeParameterDeclaration()) : (node.typeParameters = null);

    node.extends = [];
    if (this.eat(81))
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (!isClass && this.eat(12));

    if (isClass) {
      node.implements = [];
      node.mixins = [];
      if (this.eatContextual(115))
        do {
          node.mixins.push(this.flowParseInterfaceExtends());
        } while (this.eat(12));

      if (this.eatContextual(111))
        do {
          node.implements.push(this.flowParseInterfaceExtends());
        } while (this.eat(12));
    }
    node.body = this.flowParseObjectType({
      allowStatic: isClass,
      allowExact: false,
      allowSpread: false,
      allowProto: isClass,
      allowInexact: false
    });
  }
  flowParseInterfaceExtends() {
    const node = this.startNode();
    node.id = this.flowParseQualifiedTypeIdentifier();
    this.match(47)
      ? (node.typeParameters = this.flowParseTypeParameterInstantiation())
      : (node.typeParameters = null);

    return this.finishNode(node, "InterfaceExtends");
  }
  flowParseInterface(node) {
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "InterfaceDeclaration");
  }
  checkNotUnderscore(word) {
    word !== "_" || this.raise(FlowErrors.UnexpectedReservedUnderscore, { at: this.state.startLoc });
  }
  checkReservedType(word, startLoc, declaration) {
    reservedTypes.has(word) &&
      this.raise(declaration ? FlowErrors.AssignReservedType : FlowErrors.UnexpectedReservedType, {
        at: startLoc,
        reservedType: word
      });
  }
  flowParseRestrictedIdentifier(liberal, declaration) {
    this.checkReservedType(this.state.value, this.state.startLoc, declaration);
    return this.parseIdentifier(liberal);
  }
  flowParseTypeAlias(node) {
    node.id = this.flowParseRestrictedIdentifier(false, true);
    this.scope.declareName(node.id.name, BindingFlag.TYPE_LEXICAL, node.id.loc.start);
    this.match(47) ? (node.typeParameters = this.flowParseTypeParameterDeclaration()) : (node.typeParameters = null);

    node.right = this.flowParseTypeInitialiser(29);
    this.semicolon();
    return this.finishNode(node, "TypeAlias");
  }
  flowParseOpaqueType(node, declare) {
    this.expectContextual(128);
    node.id = this.flowParseRestrictedIdentifier(true, true);
    this.scope.declareName(node.id.name, BindingFlag.TYPE_LEXICAL, node.id.loc.start);
    this.match(47) ? (node.typeParameters = this.flowParseTypeParameterDeclaration()) : (node.typeParameters = null);

    node.supertype = null;
    if (this.match(14)) node.supertype = this.flowParseTypeInitialiser(14);

    node.impltype = null;
    declare || (node.impltype = this.flowParseTypeInitialiser(29));

    this.semicolon();
    return this.finishNode(node, "OpaqueType");
  }
  flowParseTypeParameter(requireDefault = false) {
    const nodeStartLoc = this.state.startLoc,
      node = this.startNode(),
      variance = this.flowParseVariance(),
      ident = this.flowParseTypeAnnotatableIdentifier();
    node.name = ident.name;
    node.variance = variance;
    node.bound = ident.typeAnnotation;
    if (this.match(29)) {
      this.eat(29);
      node.default = this.flowParseType();
    } else requireDefault && this.raise(FlowErrors.MissingTypeParamDefault, { at: nodeStartLoc });

    return this.finishNode(node, "TypeParameter");
  }
  flowParseTypeParameterDeclaration() {
    const oldInType = this.state.inType,
      node = this.startNode();
    node.params = [];
    this.state.inType = true;
    this.match(47) || this.match(140) ? this.next() : this.unexpected();

    let defaultRequired = false;
    do {
      const typeParameter = this.flowParseTypeParameter(defaultRequired);
      node.params.push(typeParameter);
      if (typeParameter.default) defaultRequired = true;

      this.match(48) || this.expect(12);
    } while (!this.match(48));
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterDeclaration");
  }
  flowParseTypeParameterInstantiation() {
    const node = this.startNode(),
      oldInType = this.state.inType;
    node.params = [];
    this.state.inType = true;
    this.expect(47);
    const oldNoAnonFunctionType = this.state.noAnonFunctionType;
    this.state.noAnonFunctionType = false;
    while (!this.match(48)) {
      node.params.push(this.flowParseType());
      this.match(48) || this.expect(12);
    }
    this.state.noAnonFunctionType = oldNoAnonFunctionType;
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseTypeParameterInstantiationCallOrNew() {
    const node = this.startNode(),
      oldInType = this.state.inType;
    node.params = [];
    this.state.inType = true;
    this.expect(47);
    while (!this.match(48)) {
      node.params.push(this.flowParseTypeOrImplicitInstantiation());
      this.match(48) || this.expect(12);
    }
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseInterfaceType() {
    const node = this.startNode();
    this.expectContextual(127);
    node.extends = [];
    if (this.eat(81))
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (this.eat(12));

    node.body = this.flowParseObjectType({
      allowStatic: false,
      allowExact: false,
      allowSpread: false,
      allowProto: false,
      allowInexact: false
    });
    return this.finishNode(node, "InterfaceTypeAnnotation");
  }
  flowParseObjectPropertyKey() {
    return this.match(132) || this.match(131) ? super.parseExprAtom() : this.parseIdentifier(true);
  }
  flowParseObjectTypeIndexer(node, isStatic, variance) {
    node.static = isStatic;
    if (this.lookahead().type === 14) {
      node.id = this.flowParseObjectPropertyKey();
      node.key = this.flowParseTypeInitialiser();
    } else {
      node.id = null;
      node.key = this.flowParseType();
    }
    this.expect(3);
    node.value = this.flowParseTypeInitialiser();
    node.variance = variance;
    return this.finishNode(node, "ObjectTypeIndexer");
  }
  flowParseObjectTypeInternalSlot(node, isStatic) {
    node.static = isStatic;
    node.id = this.flowParseObjectPropertyKey();
    this.expect(3);
    this.expect(3);
    if (this.match(47) || this.match(10)) {
      node.method = true;
      node.optional = false;
      node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.loc.start));
    } else {
      node.method = false;
      if (this.eat(17)) node.optional = true;

      node.value = this.flowParseTypeInitialiser();
    }
    return this.finishNode(node, "ObjectTypeInternalSlot");
  }
  flowParseObjectTypeMethodish(node) {
    node.params = [];
    node.rest = null;
    node.typeParameters = null;
    node.this = null;
    if (this.match(47)) node.typeParameters = this.flowParseTypeParameterDeclaration();

    this.expect(10);
    if (this.match(78)) {
      node.this = this.flowParseFunctionTypeParam(true);
      node.this.name = null;
      this.match(11) || this.expect(12);
    }
    while (!this.match(11) && !this.match(21)) {
      node.params.push(this.flowParseFunctionTypeParam(false));
      this.match(11) || this.expect(12);
    }
    if (this.eat(21)) node.rest = this.flowParseFunctionTypeParam(false);

    this.expect(11);
    node.returnType = this.flowParseTypeInitialiser();
    return this.finishNode(node, "FunctionTypeAnnotation");
  }
  flowParseObjectTypeCallProperty(node, isStatic) {
    const valueNode = this.startNode();
    node.static = isStatic;
    node.value = this.flowParseObjectTypeMethodish(valueNode);
    return this.finishNode(node, "ObjectTypeCallProperty");
  }
  flowParseObjectType({ allowStatic, allowExact, allowSpread, allowProto, allowInexact }) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const nodeStart = this.startNode();
    nodeStart.callProperties = [];
    nodeStart.properties = [];
    nodeStart.indexers = [];
    nodeStart.internalSlots = [];
    let endDelim,
      exact,
      inexact = false;
    if (allowExact && this.match(6)) {
      this.expect(6);
      endDelim = 9;
      exact = true;
    } else {
      this.expect(5);
      endDelim = 8;
      exact = false;
    }
    nodeStart.exact = exact;
    while (!this.match(endDelim)) {
      let isStatic = false,
        protoStartLoc = null,
        inexactStartLoc = null;
      const node = this.startNode();
      if (allowProto && this.isContextual(116)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 14 && lookahead.type !== 17) {
          this.next();
          protoStartLoc = this.state.startLoc;
          allowStatic = false;
        }
      }
      if (allowStatic && this.isContextual(104)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 14 && lookahead.type !== 17) {
          this.next();
          isStatic = true;
        }
      }
      const variance = this.flowParseVariance();
      if (this.eat(0)) {
        protoStartLoc == null || this.unexpected(protoStartLoc);

        if (this.eat(0)) {
          variance && this.unexpected(variance.loc.start);

          nodeStart.internalSlots.push(this.flowParseObjectTypeInternalSlot(node, isStatic));
        } else nodeStart.indexers.push(this.flowParseObjectTypeIndexer(node, isStatic, variance));
      } else if (this.match(10) || this.match(47)) {
        protoStartLoc == null || this.unexpected(protoStartLoc);

        variance && this.unexpected(variance.loc.start);

        nodeStart.callProperties.push(this.flowParseObjectTypeCallProperty(node, isStatic));
      } else {
        let kind = "init";
        if ((this.isContextual(98) || this.isContextual(103)) && tokenIsLiteralPropertyName(this.lookahead().type)) {
          kind = this.state.value;
          this.next();
        }
        const propOrInexact = this.flowParseObjectTypeProperty(
          node,
          isStatic,
          protoStartLoc,
          variance,
          kind,
          allowSpread,
          allowInexact != null ? allowInexact : !exact
        );
        if (propOrInexact === null) {
          inexact = true;
          inexactStartLoc = this.state.lastTokStartLoc;
        } else nodeStart.properties.push(propOrInexact);
      }
      this.flowObjectTypeSemicolon();
      !inexactStartLoc || this.match(8) || this.match(9) ||
        this.raise(FlowErrors.UnexpectedExplicitInexactInObject, { at: inexactStartLoc });
    }
    this.expect(endDelim);
    if (allowSpread) nodeStart.inexact = inexact;

    const out = this.finishNode(nodeStart, "ObjectTypeAnnotation");
    this.state.inType = oldInType;
    return out;
  }
  flowParseObjectTypeProperty(node, isStatic, protoStartLoc, variance, kind, allowSpread, allowInexact) {
    if (this.eat(21)) {
      if (this.match(12) || this.match(13) || this.match(8) || this.match(9)) {
        allowSpread
          ? allowInexact || this.raise(FlowErrors.InexactInsideExact, { at: this.state.lastTokStartLoc })
          : this.raise(FlowErrors.InexactInsideNonObject, { at: this.state.lastTokStartLoc });

        variance && this.raise(FlowErrors.InexactVariance, { at: variance });

        return null;
      }
      allowSpread || this.raise(FlowErrors.UnexpectedSpreadType, { at: this.state.lastTokStartLoc });

      protoStartLoc == null || this.unexpected(protoStartLoc);
      variance && this.raise(FlowErrors.SpreadVariance, { at: variance });

      node.argument = this.flowParseType();
      return this.finishNode(node, "ObjectTypeSpreadProperty");
    }
    //{
    node.key = this.flowParseObjectPropertyKey();
    node.static = isStatic;
    node.proto = protoStartLoc != null;
    node.kind = kind;
    let optional = false;
    if (this.match(47) || this.match(10)) {
      node.method = true;
      protoStartLoc == null || this.unexpected(protoStartLoc);
      variance && this.unexpected(variance.loc.start);

      node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.loc.start));
      if (kind === "get" || kind === "set") this.flowCheckGetterSetterParams(node);

      allowSpread || node.key.name !== "constructor" || !node.value.this ||
        this.raise(FlowErrors.ThisParamBannedInConstructor, { at: node.value.this });
    } else {
      kind === "init" || this.unexpected();
      node.method = false;
      if (this.eat(17)) optional = true;

      node.value = this.flowParseTypeInitialiser();
      node.variance = variance;
    }
    node.optional = optional;
    return this.finishNode(node, "ObjectTypeProperty");
    //}
  }
  flowCheckGetterSetterParams(property) {
    const paramCount = property.kind === "get" ? 0 : 1,
      length = property.value.params.length + (property.value.rest ? 1 : 0);
    property.value.this &&
      this.raise(
        property.kind === "get" ? FlowErrors.GetterMayNotHaveThisParam : FlowErrors.SetterMayNotHaveThisParam,
        { at: property.value.this }
      );

    length === paramCount ||
      this.raise(property.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, { at: property });

    property.kind === "set" && property.value.rest && this.raise(Errors.BadSetterRestParameter, { at: property });
  }
  flowObjectTypeSemicolon() {
    this.eat(13) || this.eat(12) || this.match(8) || this.match(9) || this.unexpected();
  }
  flowParseQualifiedTypeIdentifier(startLoc, id) {
    startLoc != null || (startLoc = this.state.startLoc);
    let node = id || this.flowParseRestrictedIdentifier(true);
    while (this.eat(16)) {
      const node2 = this.startNodeAt(startLoc);
      node2.qualification = node;
      node2.id = this.flowParseRestrictedIdentifier(true);
      node = this.finishNode(node2, "QualifiedTypeIdentifier");
    }
    return node;
  }
  flowParseGenericType(startLoc, id) {
    const node = this.startNodeAt(startLoc);
    node.typeParameters = null;
    node.id = this.flowParseQualifiedTypeIdentifier(startLoc, id);
    if (this.match(47)) node.typeParameters = this.flowParseTypeParameterInstantiation();

    return this.finishNode(node, "GenericTypeAnnotation");
  }
  flowParseTypeofType() {
    const node = this.startNode();
    this.expect(87);
    node.argument = this.flowParsePrimaryType();
    return this.finishNode(node, "TypeofTypeAnnotation");
  }
  flowParseTupleType() {
    const node = this.startNode();
    node.types = [];
    this.expect(0);
    while (this.state.pos < this.length && !this.match(3)) {
      node.types.push(this.flowParseType());
      if (this.match(3)) break;
      this.expect(12);
    }
    this.expect(3);
    return this.finishNode(node, "TupleTypeAnnotation");
  }
  flowParseFunctionTypeParam(first) {
    let name = null,
      optional = false,
      typeAnnotation; //= null
    const node = this.startNode(),
      lh = this.lookahead(),
      isThis = this.state.type === 78;
    if (lh.type === 14 || lh.type === 17) {
      !isThis || first || this.raise(FlowErrors.ThisParamMustBeFirst, { at: node });

      name = this.parseIdentifier(isThis);
      if (this.eat(17)) {
        optional = true;
        isThis && this.raise(FlowErrors.ThisParamMayNotBeOptional, { at: node });
      }
      typeAnnotation = this.flowParseTypeInitialiser();
    } else typeAnnotation = this.flowParseType();

    node.name = name;
    node.optional = optional;
    node.typeAnnotation = typeAnnotation;
    return this.finishNode(node, "FunctionTypeParam");
  }
  reinterpretTypeAsFunctionTypeParam(type) {
    const node = this.startNodeAt(type.loc.start);
    node.name = null;
    node.optional = false;
    node.typeAnnotation = type;
    return this.finishNode(node, "FunctionTypeParam");
  }
  flowParseFunctionTypeParams(params = []) {
    let rest = null,
      _this = null;
    if (this.match(78)) {
      _this = this.flowParseFunctionTypeParam(true);
      _this.name = null;
      this.match(11) || this.expect(12);
    }
    while (!this.match(11) && !this.match(21)) {
      params.push(this.flowParseFunctionTypeParam(false));
      this.match(11) || this.expect(12);
    }
    if (this.eat(21)) rest = this.flowParseFunctionTypeParam(false);

    return { params, rest, _this };
  }
  flowIdentToTypeAnnotation(startLoc, node, id) {
    switch (id.name) {
      case "any":
        return this.finishNode(node, "AnyTypeAnnotation");
      case "bool":
      case "boolean":
        return this.finishNode(node, "BooleanTypeAnnotation");
      case "mixed":
        return this.finishNode(node, "MixedTypeAnnotation");
      case "empty":
        return this.finishNode(node, "EmptyTypeAnnotation");
      case "number":
        return this.finishNode(node, "NumberTypeAnnotation");
      case "string":
        return this.finishNode(node, "StringTypeAnnotation");
      case "symbol":
        return this.finishNode(node, "SymbolTypeAnnotation");
      default:
        this.checkNotUnderscore(id.name);
        return this.flowParseGenericType(startLoc, id);
    }
  }
  flowParsePrimaryType() {
    const startLoc = this.state.startLoc,
      node = this.startNode();
    let tmp,
      type,
      isGroupedType = false;
    const oldNoAnonFunctionType = this.state.noAnonFunctionType;
    switch (this.state.type) {
      case 5:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: false,
          allowSpread: true,
          allowProto: false,
          allowInexact: true
        });
      case 6:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: true,
          allowSpread: true,
          allowProto: false,
          allowInexact: false
        });
      case 0:
        this.state.noAnonFunctionType = false;
        type = this.flowParseTupleType();
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        return type;
      case 47:
        node.typeParameters = this.flowParseTypeParameterDeclaration();
        this.expect(10);
        tmp = this.flowParseFunctionTypeParams();
        node.params = tmp.params;
        node.rest = tmp.rest;
        node.this = tmp._this;
        this.expect(11);
        this.expect(19);
        node.returnType = this.flowParseType();
        return this.finishNode(node, "FunctionTypeAnnotation");
      case 10:
        this.next();
        if (!this.match(11) && !this.match(21))
          if (tokenIsIdentifier(this.state.type) || this.match(78)) {
            const token = this.lookahead().type;
            isGroupedType = token !== 17 && token !== 14;
          } else isGroupedType = true;

        if (isGroupedType) {
          this.state.noAnonFunctionType = false;
          type = this.flowParseType();
          this.state.noAnonFunctionType = oldNoAnonFunctionType;
          if (
            this.state.noAnonFunctionType ||
            !(this.match(12) || (this.match(11) && this.lookahead().type === 19))
          ) {
            this.expect(11);
            return type;
          }

          this.eat(12);
        }
        tmp = type
          ? this.flowParseFunctionTypeParams([this.reinterpretTypeAsFunctionTypeParam(type)])
          : this.flowParseFunctionTypeParams();

        node.params = tmp.params;
        node.rest = tmp.rest;
        node.this = tmp._this;
        this.expect(11);
        this.expect(19);
        node.returnType = this.flowParseType();
        node.typeParameters = null;
        return this.finishNode(node, "FunctionTypeAnnotation");
      case 131:
        return this.parseLiteral(this.state.value, "StringLiteralTypeAnnotation");
      case 85:
      case 86:
        node.value = this.match(85);
        this.next();
        return this.finishNode(node, "BooleanLiteralTypeAnnotation");
      case 53:
        if (this.state.value === "-") {
          this.next();
          if (this.match(132)) return this.parseLiteralAtNode(-this.state.value, "NumberLiteralTypeAnnotation", node);

          if (this.match(133)) return this.parseLiteralAtNode(-this.state.value, "BigIntLiteralTypeAnnotation", node);

          throw this.raise(FlowErrors.UnexpectedSubtractionOperand, { at: this.state.startLoc });
        }
        this.unexpected();
        return;
      case 132:
        return this.parseLiteral(this.state.value, "NumberLiteralTypeAnnotation");
      case 133:
        return this.parseLiteral(this.state.value, "BigIntLiteralTypeAnnotation");
      case 88:
        this.next();
        return this.finishNode(node, "VoidTypeAnnotation");
      case 84:
        this.next();
        return this.finishNode(node, "NullLiteralTypeAnnotation");
      case 78:
        this.next();
        return this.finishNode(node, "ThisTypeAnnotation");
      case 55:
        this.next();
        return this.finishNode(node, "ExistsTypeAnnotation");
      case 87:
        return this.flowParseTypeofType();
      default:
        if (tokenIsKeyword(this.state.type)) {
          const label = tokenLabelName(this.state.type);
          this.next();
          return super.createIdentifier(node, label);
        }
        if (tokenIsIdentifier(this.state.type))
          return this.isContextual(127)
            ? this.flowParseInterfaceType()
            : this.flowIdentToTypeAnnotation(startLoc, node, this.parseIdentifier());
    }
    this.unexpected();
  }
  flowParsePostfixType() {
    const startLoc = this.state.startLoc;
    let type = this.flowParsePrimaryType(),
      seenOptionalIndexedAccess = false;
    while ((this.match(0) || this.match(18)) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startLoc),
        optional = this.eat(18);
      seenOptionalIndexedAccess = seenOptionalIndexedAccess || optional;
      this.expect(0);
      if (!optional && this.match(3)) {
        node.elementType = type;
        this.next();
        type = this.finishNode(node, "ArrayTypeAnnotation");
      } else {
        node.objectType = type;
        node.indexType = this.flowParseType();
        this.expect(3);
        if (seenOptionalIndexedAccess) {
          node.optional = optional;
          type = this.finishNode(node, "OptionalIndexedAccessType");
        } else type = this.finishNode(node, "IndexedAccessType");
      }
    }
    return type;
  }
  flowParsePrefixType() {
    const node = this.startNode();
    if (this.eat(17)) {
      node.typeAnnotation = this.flowParsePrefixType();
      return this.finishNode(node, "NullableTypeAnnotation");
    }
    return this.flowParsePostfixType();
  }
  flowParseAnonFunctionWithoutParens() {
    const param = this.flowParsePrefixType();
    if (!this.state.noAnonFunctionType && this.eat(19)) {
      const node = this.startNodeAt(param.loc.start);
      node.params = [this.reinterpretTypeAsFunctionTypeParam(param)];
      node.rest = null;
      node.this = null;
      node.returnType = this.flowParseType();
      node.typeParameters = null;
      return this.finishNode(node, "FunctionTypeAnnotation");
    }
    return param;
  }
  flowParseIntersectionType() {
    const node = this.startNode();
    this.eat(45);
    const type = this.flowParseAnonFunctionWithoutParens();
    node.types = [type];
    while (this.eat(45)) node.types.push(this.flowParseAnonFunctionWithoutParens());

    return node.types.length === 1 ? type : this.finishNode(node, "IntersectionTypeAnnotation");
  }
  flowParseUnionType() {
    const node = this.startNode();
    this.eat(43);
    const type = this.flowParseIntersectionType();
    node.types = [type];
    while (this.eat(43)) node.types.push(this.flowParseIntersectionType());

    return node.types.length === 1 ? type : this.finishNode(node, "UnionTypeAnnotation");
  }
  flowParseType() {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const type = this.flowParseUnionType();
    this.state.inType = oldInType;
    return type;
  }
  flowParseTypeOrImplicitInstantiation() {
    if (this.state.type === 130 && this.state.value === "_") {
      const startLoc = this.state.startLoc,
        node = this.parseIdentifier();
      return this.flowParseGenericType(startLoc, node);
    }
    return this.flowParseType();
  }
  flowParseTypeAnnotation() {
    const node = this.startNode();
    node.typeAnnotation = this.flowParseTypeInitialiser();
    return this.finishNode(node, "TypeAnnotation");
  }
  flowParseTypeAnnotatableIdentifier(allowPrimitiveOverride) {
    const ident = allowPrimitiveOverride ? this.parseIdentifier() : this.flowParseRestrictedIdentifier();
    if (this.match(14)) {
      ident.typeAnnotation = this.flowParseTypeAnnotation();
      this.resetEndLocation(ident);
    }
    return ident;
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocation(node.expression, node.typeAnnotation.loc.end);
    return node.expression;
  }
  flowParseVariance() {
    let variance = null;
    if (this.match(53)) {
      variance = this.startNode();
      this.state.value === "+" ? (variance.kind = "plus") : (variance.kind = "minus");

      this.next();
      return this.finishNode(variance, "Variance");
    }
    return variance;
  }
  parseFunctionBody(node, allowExpressionBody, isMethod = false) {
    allowExpressionBody
      ? this.forwardNoArrowParamsConversionAt(node, () => super.parseFunctionBody(node, true, isMethod))
      : super.parseFunctionBody(node, false, isMethod);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(14)) {
      const typeNode = this.startNode();
      [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
      node.returnType = typeNode.typeAnnotation ? this.finishNode(typeNode, "TypeAnnotation") : null;
    }
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  parseStatementLike(flags) {
    if (this.state.strict && this.isContextual(127)) {
      if (tokenIsKeywordOrIdentifier(this.lookahead().type)) {
        const node = this.startNode();
        this.next();
        return this.flowParseInterface(node);
      }
    } else if (this.shouldParseEnums() && this.isContextual(124)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    const stmt = super.parseStatementLike(flags);
    this.flowPragma !== void 0 || this.isValidDirective(stmt) || (this.flowPragma = null);

    return stmt;
  }
  parseExpressionStatement(node, expr, decorators) {
    if (expr.type === "Identifier")
      if (expr.name === "declare") {
        if (
          this.match(80) ||
          tokenIsIdentifier(this.state.type) ||
          this.match(68) ||
          this.match(74) ||
          this.match(82)
        )
          return this.flowParseDeclare(node);
      } else if (tokenIsIdentifier(this.state.type)) {
        if (expr.name === "interface") return this.flowParseInterface(node);
        if (expr.name === "type") return this.flowParseTypeAlias(node);
        if (expr.name === "opaque") return this.flowParseOpaqueType(node, false);
      }

    return super.parseExpressionStatement(node, expr, decorators);
  }
  shouldParseExportDeclaration() {
    const { type } = this.state;
    return tokenIsFlowInterfaceOrTypeOrOpaque(type) || (this.shouldParseEnums() && type === 124)
      ? !this.state.containsEsc
      : super.shouldParseExportDeclaration();
  }
  isExportDefaultSpecifier() {
    const { type } = this.state;
    return tokenIsFlowInterfaceOrTypeOrOpaque(type) || (this.shouldParseEnums() && type === 124)
      ? this.state.containsEsc
      : super.isExportDefaultSpecifier();
  }
  parseExportDefaultExpression() {
    if (this.shouldParseEnums() && this.isContextual(124)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    return super.parseExportDefaultExpression();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.match(17)) return expr;
    if (this.state.maybeInArrowParameters) {
      const nextCh = this.lookaheadCharCode();
      if (nextCh === 44 || nextCh === 61 || nextCh === 58 || nextCh === 41) {
        this.setOptionalParametersError(refExpressionErrors);
        return expr;
      }
    }
    this.expect(17);
    const state = this.state.clone(),
      originalNoArrowAt = this.state.noArrowAt,
      node = this.startNodeAt(startLoc);
    let { consequent, failed } = this.tryParseConditionalConsequent(),
      [valid, invalid] = this.getArrowLikeExpressions(consequent);
    if (failed || invalid.length > 0) {
      const noArrowAt = [...originalNoArrowAt];
      if (invalid.length > 0) {
        this.state = state;
        this.state.noArrowAt = noArrowAt;
        for (let i = 0; i < invalid.length; i++) noArrowAt.push(invalid[i].start);

        ({ consequent, failed } = this.tryParseConditionalConsequent());
        [valid, invalid] = this.getArrowLikeExpressions(consequent);
      }
      failed && valid.length > 1 && this.raise(FlowErrors.AmbiguousConditionalArrow, { at: state.startLoc });

      if (failed && valid.length === 1) {
        this.state = state;
        noArrowAt.push(valid[0].start);
        this.state.noArrowAt = noArrowAt;
        ({ consequent, failed } = this.tryParseConditionalConsequent());
      }
    }
    this.getArrowLikeExpressions(consequent, true);
    this.state.noArrowAt = originalNoArrowAt;
    this.expect(14);
    node.test = expr;
    node.consequent = consequent;
    node.alternate = this.forwardNoArrowParamsConversionAt(node, () => this.parseMaybeAssign(void 0, void 0));
    return this.finishNode(node, "ConditionalExpression");
  }
  tryParseConditionalConsequent() {
    this.state.noArrowParamsConversionAt.push(this.state.start);
    const consequent = this.parseMaybeAssignAllowIn(),
      failed = !this.match(14);
    this.state.noArrowParamsConversionAt.pop();
    return { consequent, failed };
  }
  getArrowLikeExpressions(node, disallowInvalid) {
    const stack = [node],
      arrows = [];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node.type === "ArrowFunctionExpression") {
        node.typeParameters || !node.returnType ? this.finishArrowValidation(node) : arrows.push(node);

        stack.push(node.body);
      } else if (node.type === "ConditionalExpression") {
        stack.push(node.consequent);
        stack.push(node.alternate);
      }
    }
    if (disallowInvalid) {
      arrows.forEach(node => this.finishArrowValidation(node));
      return [arrows, []];
    }
    return partition(arrows, node => node.params.every(param => this.isAssignable(param, true)));
  }
  finishArrowValidation(node) {
    var _node$extra;
    this.toAssignableList(
      node.params,
      (_node$extra = node.extra) == null ? void 0 : _node$extra.trailingCommaLoc,
      false
    );
    this.scope.enter(ScopeFlag.FUNCTION | ScopeFlag.ARROW);
    super.checkParams(node, false, true);
    this.scope.exit();
  }
  forwardNoArrowParamsConversionAt(node, parse) {
    let result;
    if (this.state.noArrowParamsConversionAt.indexOf(node.start) > -1) {
      this.state.noArrowParamsConversionAt.push(this.state.start);
      result = parse();
      this.state.noArrowParamsConversionAt.pop();
    } else result = parse();

    return result;
  }
  parseParenItem(node, startLoc) {
    node = super.parseParenItem(node, startLoc);
    if (this.eat(17)) {
      node.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(14)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = node;
      typeCastNode.typeAnnotation = this.flowParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TypeCastExpression");
    }
    return node;
  }
  assertModuleNodeAllowed(node) {
    (node.type === "ImportDeclaration" && (node.importKind === "type" || node.importKind === "typeof")) ||
      (node.type === "ExportNamedDeclaration" && node.exportKind === "type") ||
      (node.type === "ExportAllDeclaration" && node.exportKind === "type") ||
      super.assertModuleNodeAllowed(node);
  }
  parseExportDeclaration(node) {
    if (this.isContextual(128)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      if (this.match(5)) {
        node.specifiers = this.parseExportSpecifiers(true);
        super.parseExportFrom(node);
        return null;
      }

      return this.flowParseTypeAlias(declarationNode);
    }
    if (this.isContextual(129)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseOpaqueType(declarationNode, false);
    }
    if (this.isContextual(127)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseInterface(declarationNode);
    }
    if (this.shouldParseEnums() && this.isContextual(124)) {
      node.exportKind = "value";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(declarationNode);
    }

    return super.parseExportDeclaration(node);
  }
  eatExportStar(node) {
    if (super.eatExportStar(node)) return true;
    if (this.isContextual(128) && this.lookahead().type === 55) {
      node.exportKind = "type";
      this.next();
      this.next();
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    const { startLoc } = this.state,
      hasNamespace = super.maybeParseExportNamespaceSpecifier(node);
    hasNamespace && node.exportKind === "type" && this.unexpected(startLoc);

    return hasNamespace;
  }
  parseClassId(node, isStatement, optionalId) {
    super.parseClassId(node, isStatement, optionalId);
    if (this.match(47)) node.typeParameters = this.flowParseTypeParameterDeclaration();
  }
  parseClassMember(classBody, member, state) {
    const { startLoc } = this.state;
    if (this.isContextual(123)) {
      if (super.parseClassMemberFromModifier(classBody, member)) return;

      member.declare = true;
    }
    super.parseClassMember(classBody, member, state);
    if (member.declare)
      member.type !== "ClassProperty" &&
      member.type !== "ClassPrivateProperty" &&
      member.type !== "PropertyDefinition"
        ? this.raise(FlowErrors.DeclareClassElement, { at: startLoc })
        : member.value && this.raise(FlowErrors.DeclareClassFieldInitializer, { at: member.value });
  }
  isIterator(word) {
    return word === "iterator" || word === "asyncIterator";
  }
  readIterator() {
    const word = super.readWord1(),
      fullWord = "@@" + word;
    (this.isIterator(word) && this.state.inType) ||
      this.raise(Errors.InvalidIdentifier, { at: this.state.curPosition(), identifierName: fullWord });

    this.finishToken(130, fullWord);
  }
  getTokenFromCode(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 123 && next === 124) this.finishOp(6, 2);
    else if (this.state.inType && (code === 62 || code === 60)) this.finishOp(code === 62 ? 48 : 47, 1);
    else if (this.state.inType && code === 63) next === 46 ? this.finishOp(18, 2) : this.finishOp(17, 1);
    else if (isIteratorStart(code, next, this.input.charCodeAt(this.state.pos + 2))) {
      this.state.pos += 2;
      this.readIterator();
    } else super.getTokenFromCode(code);
  }
  isAssignable(node, isBinding) {
    return node.type === "TypeCastExpression"
      ? this.isAssignable(node.expression, isBinding)
      : super.isAssignable(node, isBinding);
  }
  toAssignable(node, isLHS = false) {
    isLHS || node.type !== "AssignmentExpression" || node.left.type !== "TypeCastExpression" ||
      (node.left = this.typeCastToParameter(node.left));

    super.toAssignable(node, isLHS);
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i];
      if ((expr == null ? void 0 : expr.type) === "TypeCastExpression") exprList[i] = this.typeCastToParameter(expr);
    }
    super.toAssignableList(exprList, trailingCommaLoc, isLHS);
  }
  toReferencedList(exprList, isParenthesizedExpr) {
    for (let i = 0; i < exprList.length; i++) {
      var _expr$extra;
      const expr = exprList[i];

      !expr ||
        expr.type !== "TypeCastExpression" ||
        ((_expr$extra = expr.extra) != null && _expr$extra.parenthesized) ||
        (exprList.length <= 1 && isParenthesizedExpr) ||
        this.raise(FlowErrors.TypeCastInPattern, { at: expr.typeAnnotation });
    }
    return exprList;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    const node = super.parseArrayLike(close, canBePattern, isTuple, refExpressionErrors);
    !canBePattern || this.state.maybeInArrowParameters || this.toReferencedList(node.elements);

    return node;
  }
  isValidLVal(type, isParenthesized, binding) {
    return type === "TypeCastExpression" || super.isValidLVal(type, isParenthesized, binding);
  }
  parseClassProperty(node) {
    if (this.match(14)) node.typeAnnotation = this.flowParseTypeAnnotation();

    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    if (this.match(14)) node.typeAnnotation = this.flowParseTypeAnnotation();

    return super.parseClassPrivateProperty(node);
  }
  isClassMethod() {
    return this.match(47) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(14) || super.isClassProperty();
  }
  isNonstaticConstructor(method) {
    return !this.match(14) && super.isNonstaticConstructor(method);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    method.variance && this.unexpected(method.variance.loc.start);

    delete method.variance;
    if (this.match(47)) method.typeParameters = this.flowParseTypeParameterDeclaration();

    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
    if (method.params && isConstructor) {
      const params = method.params;
      params.length > 0 && this.isThisParam(params[0]) &&
        this.raise(FlowErrors.ThisParamBannedInConstructor, { at: method });
    } else if (method.type === "MethodDefinition" && isConstructor && method.value.params) {
      const params = method.value.params;
      params.length > 0 && this.isThisParam(params[0]) &&
        this.raise(FlowErrors.ThisParamBannedInConstructor, { at: method });
    }
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    method.variance && this.unexpected(method.variance.loc.start);

    delete method.variance;
    if (this.match(47)) method.typeParameters = this.flowParseTypeParameterDeclaration();

    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass && this.match(47)) node.superTypeParameters = this.flowParseTypeParameterInstantiation();

    if (this.isContextual(111)) {
      this.next();
      // noinspection JSMismatchedCollectionQueryUpdate
      const implemented = (node.implements = []);
      do {
        const node = this.startNode();
        node.id = this.flowParseRestrictedIdentifier(true);
        this.match(47)
          ? (node.typeParameters = this.flowParseTypeParameterInstantiation())
          : (node.typeParameters = null);

        implemented.push(this.finishNode(node, "ClassImplements"));
      } while (this.eat(12));
    }
  }
  checkGetterSetterParams(method) {
    super.checkGetterSetterParams(method);
    const params = this.getObjectOrClassMethodParams(method);
    if (params.length > 0) {
      const param = params[0];
      this.isThisParam(param) && method.kind === "get"
        ? this.raise(FlowErrors.GetterMayNotHaveThisParam, { at: param })
        : this.isThisParam(param) && this.raise(FlowErrors.SetterMayNotHaveThisParam, { at: param });
    }
  }
  parsePropertyNamePrefixOperator(node) {
    node.variance = this.flowParseVariance();
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    prop.variance && this.unexpected(prop.variance.loc.start);

    delete prop.variance;
    let typeParameters;
    if (this.match(47) && !isAccessor) {
      typeParameters = this.flowParseTypeParameterDeclaration();
      this.match(10) || this.unexpected();
    }
    const result = super.parseObjPropValue(
      prop,
      startLoc,
      isGenerator,
      isAsync,
      isPattern,
      isAccessor,
      refExpressionErrors
    );
    if (typeParameters) (result.value || result).typeParameters = typeParameters;

    return result;
  }
  parseAssignableListItemTypes(param) {
    if (this.eat(17)) {
      param.type === "Identifier" || this.raise(FlowErrors.PatternIsOptional, { at: param });

      this.isThisParam(param) && this.raise(FlowErrors.ThisParamMayNotBeOptional, { at: param });

      param.optional = true;
    }
    this.match(14)
      ? (param.typeAnnotation = this.flowParseTypeAnnotation())
      : this.isThisParam(param) && this.raise(FlowErrors.ThisParamAnnotationRequired, { at: param });

    this.match(29) && this.isThisParam(param) && this.raise(FlowErrors.ThisParamNoDefault, { at: param });

    this.resetEndLocation(param);
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start &&
      this.raise(FlowErrors.TypeBeforeInitializer, { at: node.typeAnnotation });

    return node;
  }
  checkImportReflection(node) {
    super.checkImportReflection(node);
    node.module && node.importKind !== "value" &&
      this.raise(FlowErrors.ImportReflectionHasImportType, { at: node.specifiers[0].loc.start });
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = hasTypeImportKind(node)
      ? this.flowParseRestrictedIdentifier(true, true)
      : this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(128)) {
      if (!isExport) return true;
      const ch = this.lookaheadCharCode();
      return ch === 123 || ch === 42;
    }
    return !isExport && this.isContextual(87);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    if (isExport) {
      if (!phase && this.match(65)) return;

      node.exportKind = phase === "type" ? phase : "value";
    } else {
      phase === "type" && this.match(55) && this.unexpected();
      node.importKind = phase === "type" || phase === "typeof" ? phase : "value";
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, _bindingType) {
    const firstIdent = specifier.imported;
    let specifierTypeKind = null;
    if (firstIdent.type === "Identifier")
      if (firstIdent.name === "type") specifierTypeKind = "type";
      else if (firstIdent.name === "typeof") specifierTypeKind = "typeof";

    let isBinding = false;
    if (this.isContextual(93) && !this.isLookaheadContextual("as")) {
      const as_ident = this.parseIdentifier(true);
      if (specifierTypeKind === null || tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = firstIdent;
        specifier.importKind = null;
        specifier.local = this.parseIdentifier();
      } else {
        specifier.imported = as_ident;
        specifier.importKind = specifierTypeKind;
        specifier.local = cloneIdentifier(as_ident);
      }
    } else {
      if (specifierTypeKind !== null && tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = this.parseIdentifier(true);
        specifier.importKind = specifierTypeKind;
      } else {
        if (importedIsString)
          throw this.raise(Errors.ImportBindingIsString, { at: specifier, importName: firstIdent.value });

        specifier.imported = firstIdent;
        specifier.importKind = null;
      }
      if (this.eatContextual(93)) specifier.local = this.parseIdentifier();
      else {
        isBinding = true;
        specifier.local = cloneIdentifier(specifier.imported);
      }
    }
    const specifierIsTypeImport = hasTypeImportKind(specifier);
    isInTypeOnlyImport && specifierIsTypeImport &&
      this.raise(FlowErrors.ImportTypeShorthandOnlyInPureImport, { at: specifier });

    if (isInTypeOnlyImport || specifierIsTypeImport)
      this.checkReservedType(specifier.local.name, specifier.local.loc.start, true);

    !isBinding || isInTypeOnlyImport || specifierIsTypeImport ||
      this.checkReservedWord(specifier.local.name, specifier.loc.start, true, true);

    return this.finishImportSpecifier(specifier, "ImportSpecifier");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 78:
        return this.parseIdentifier(true);
      default:
        return super.parseBindingAtom();
    }
  }
  parseFunctionParams(node, isConstructor) {
    const kind = node.kind;
    if (kind !== "get" && kind !== "set" && this.match(47))
      node.typeParameters = this.flowParseTypeParameterDeclaration();

    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (this.match(14)) {
      decl.id.typeAnnotation = this.flowParseTypeAnnotation();
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(14)) {
      const oldNoAnonFunctionType = this.state.noAnonFunctionType;
      this.state.noAnonFunctionType = true;
      node.returnType = this.flowParseTypeAnnotation();
      this.state.noAnonFunctionType = oldNoAnonFunctionType;
    }
    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  shouldParseAsyncArrow() {
    return this.match(14) || super.shouldParseAsyncArrow();
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    var _jsx;
    let jsx,
      state = null;
    if (this.hasPlugin("jsx") && (this.match(140) || this.match(47))) {
      state = this.state.clone();
      jsx = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx.error) return jsx.node;
      const { context } = this.state,
        currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) context.pop();
    }
    if (((_jsx = jsx) != null && _jsx.error) || this.match(47)) {
      var _jsx2, _jsx3;
      state = state || this.state.clone();
      let typeParameters = void 0;
      const arrow = this.tryParse(abort => {
        var _arrowExpression$extr;
        typeParameters = this.flowParseTypeParameterDeclaration();
        const arrowExpression = this.forwardNoArrowParamsConversionAt(typeParameters, () => {
          const result = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
          this.resetStartLocationFromNode(result, typeParameters);
          return result;
        });
        (_arrowExpression$extr = arrowExpression.extra) != null && _arrowExpression$extr.parenthesized && abort();
        const expr = this.maybeUnwrapTypeCastExpression(arrowExpression);
        expr.type === "ArrowFunctionExpression" || abort();
        expr.typeParameters = typeParameters;
        this.resetStartLocationFromNode(expr, typeParameters);
        return arrowExpression;
      }, state);
      let arrowExpression = null;
      if (arrow.node && this.maybeUnwrapTypeCastExpression(arrow.node).type === "ArrowFunctionExpression") {
        if (!arrow.error && !arrow.aborted) {
          arrow.node.async &&
            this.raise(FlowErrors.UnexpectedTypeParameterBeforeAsyncArrowFunction, { at: typeParameters });

          return arrow.node;
        }
        arrowExpression = arrow.node;
      }
      if ((_jsx2 = jsx) != null && _jsx2.node) {
        this.state = jsx.failState;
        return jsx.node;
      }
      if (arrowExpression) {
        this.state = arrow.failState;
        return arrowExpression;
      }
      if ((_jsx3 = jsx) != null && _jsx3.thrown) throw jsx.error;
      if (arrow.thrown) throw arrow.error;
      throw this.raise(FlowErrors.UnexpectedTokenAfterTypeParameter, { at: typeParameters });
    }
    return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
  }
  parseArrow(node) {
    if (this.match(14)) {
      const result = this.tryParse(() => {
        const oldNoAnonFunctionType = this.state.noAnonFunctionType;
        this.state.noAnonFunctionType = true;
        const typeNode = this.startNode();
        [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        this.canInsertSemicolon() && this.unexpected();
        this.match(19) || this.unexpected();
        return typeNode;
      });
      if (result.thrown) return null;
      if (result.error) this.state = result.failState;
      node.returnType = result.node.typeAnnotation ? this.finishNode(result.node, "TypeAnnotation") : null;
    }
    return super.parseArrow(node);
  }
  shouldParseArrow(params) {
    return this.match(14) || super.shouldParseArrow(params);
  }
  setArrowFunctionParameters(node, params) {
    this.state.noArrowParamsConversionAt.indexOf(node.start) > -1
      ? (node.params = params)
      : super.setArrowFunctionParameters(node, params);
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    if (isArrowFunction && this.state.noArrowParamsConversionAt.indexOf(node.start) > -1) return;

    for (let i = 0; i < node.params.length; i++)
      this.isThisParam(node.params[i]) && i > 0 &&
        this.raise(FlowErrors.ThisParamMustBeFirst, { at: node.params[i] });

    super.checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged);
  }
  parseParenAndDistinguishExpression(canBeArrow) {
    return super.parseParenAndDistinguishExpression(canBeArrow && this.state.noArrowAt.indexOf(this.state.start) < 0);
  }
  parseSubscripts(base, startLoc, noCalls) {
    if (base.type === "Identifier" && base.name === "async" && this.state.noArrowAt.indexOf(startLoc.index) > -1) {
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      // noinspection JSAnnotator
      node.arguments = super.parseCallExpressionArguments(11, false);
      base = this.finishNode(node, "CallExpression");
    } else if (base.type === "Identifier" && base.name === "async" && this.match(47)) {
      const state = this.state.clone(),
        arrow = this.tryParse(abort => this.parseAsyncArrowWithTypeParameters(startLoc) || abort(), state);
      if (!arrow.error && !arrow.aborted) return arrow.node;
      const result = this.tryParse(() => super.parseSubscripts(base, startLoc, noCalls), state);
      if (result.node && !result.error) return result.node;
      if (arrow.node) {
        this.state = arrow.failState;
        return arrow.node;
      }
      if (result.node) {
        this.state = result.failState;
        return result.node;
      }
      throw arrow.error || result.error;
    }
    return super.parseSubscripts(base, startLoc, noCalls);
  }
  parseSubscript(base, startLoc, noCalls, subscriptState) {
    if (this.match(18) && this.isLookaheadToken_lt()) {
      subscriptState.optionalChainMember = true;
      if (noCalls) {
        subscriptState.stop = true;
        return base;
      }
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      node.typeArguments = this.flowParseTypeParameterInstantiation();
      this.expect(10);
      // noinspection JSAnnotator
      node.arguments = this.parseCallExpressionArguments(11, false);
      node.optional = true;
      return this.finishCallExpression(node, true);
    }
    if (!noCalls && this.shouldParseTypes() && this.match(47)) {
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      const result = this.tryParse(() => {
        node.typeArguments = this.flowParseTypeParameterInstantiationCallOrNew();
        this.expect(10);
        // noinspection JSAnnotator
        node.arguments = super.parseCallExpressionArguments(11, false);
        if (subscriptState.optionalChainMember) node.optional = false;

        return this.finishCallExpression(node, subscriptState.optionalChainMember);
      });
      if (result.node) {
        if (result.error) this.state = result.failState;
        return result.node;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, subscriptState);
  }
  parseNewCallee(node) {
    super.parseNewCallee(node);
    let targs = null;
    if (this.shouldParseTypes() && this.match(47))
      targs = this.tryParse(() => this.flowParseTypeParameterInstantiationCallOrNew()).node;

    node.typeArguments = targs;
  }
  parseAsyncArrowWithTypeParameters(startLoc) {
    const node = this.startNodeAt(startLoc);
    this.parseFunctionParams(node, false);
    if (this.parseArrow(node)) return super.parseArrowExpression(node, void 0, true);
  }
  readToken_mult_modulo(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 42 && next === 47 && this.state.hasFlowComment) {
      this.state.hasFlowComment = false;
      this.state.pos += 2;
      this.nextToken();
    } else super.readToken_mult_modulo(code);
  }
  readToken_pipe_amp(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    code === 124 && next === 125 ? this.finishOp(9, 2) : super.readToken_pipe_amp(code);
  }
  parseTopLevel(file, program) {
    const fileNode = super.parseTopLevel(file, program);
    this.state.hasFlowComment && this.raise(FlowErrors.UnterminatedFlowComment, { at: this.state.curPosition() });

    return fileNode;
  }
  skipBlockComment() {
    if (!this.hasPlugin("flowComments") || !this.skipFlowComment())
      return super.skipBlockComment(this.state.hasFlowComment ? "*-/" : "*/");

    if (this.state.hasFlowComment) throw this.raise(FlowErrors.NestedFlowComment, { at: this.state.startLoc });

    this.hasFlowCommentCompletion();
    const commentSkip = this.skipFlowComment();
    if (commentSkip) {
      this.state.pos += commentSkip;
      this.state.hasFlowComment = true;
    }
  }
  skipFlowComment() {
    const { pos } = this.state;
    let shiftToFirstNonWhiteSpace = 2;
    while ([32, 9].includes(this.input.charCodeAt(pos + shiftToFirstNonWhiteSpace))) shiftToFirstNonWhiteSpace++;

    const ch2 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos),
      ch3 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos + 1);

    return ch2 === 58 && ch3 === 58
      ? shiftToFirstNonWhiteSpace + 2
      : this.input.slice(shiftToFirstNonWhiteSpace + pos, shiftToFirstNonWhiteSpace + pos + 12) === "flow-include"
      ? shiftToFirstNonWhiteSpace + 12
      : ch2 === 58 && ch3 !== 58 && shiftToFirstNonWhiteSpace;
  }
  hasFlowCommentCompletion() {
    if (this.input.indexOf("*/", this.state.pos) < 0)
      throw this.raise(Errors.UnterminatedComment, { at: this.state.curPosition() });
  }
  flowEnumErrorBooleanMemberNotInitialized(loc, { enumName, memberName }) {
    this.raise(FlowErrors.EnumBooleanMemberNotInitialized, { at: loc, memberName, enumName });
  }
  flowEnumErrorInvalidMemberInitializer(loc, enumContext) {
    return this.raise(
      !enumContext.explicitType
        ? FlowErrors.EnumInvalidMemberInitializerUnknownType
        : enumContext.explicitType === "symbol"
        ? FlowErrors.EnumInvalidMemberInitializerSymbolType
        : FlowErrors.EnumInvalidMemberInitializerPrimaryType,
      Object.assign({ at: loc }, enumContext)
    );
  }
  flowEnumErrorNumberMemberNotInitialized(loc, { enumName, memberName }) {
    this.raise(FlowErrors.EnumNumberMemberNotInitialized, { at: loc, enumName, memberName });
  }
  flowEnumErrorStringMemberInconsistentlyInitialized(node, { enumName }) {
    this.raise(FlowErrors.EnumStringMemberInconsistentlyInitialized, { at: node, enumName });
  }
  flowEnumMemberInit() {
    const startLoc = this.state.startLoc,
      endOfInit = () => this.match(12) || this.match(8);
    switch (this.state.type) {
      case 132: {
        const literal = this.parseNumericLiteral(this.state.value);
        return endOfInit()
          ? { type: "number", loc: literal.loc.start, value: literal }
          : { type: "invalid", loc: startLoc };
      }
      case 131: {
        const literal = this.parseStringLiteral(this.state.value);
        return endOfInit()
          ? { type: "string", loc: literal.loc.start, value: literal }
          : { type: "invalid", loc: startLoc };
      }
      case 85:
      case 86: {
        const literal = this.parseBooleanLiteral(this.match(85));
        return endOfInit()
          ? { type: "boolean", loc: literal.loc.start, value: literal }
          : { type: "invalid", loc: startLoc };
      }
      default:
        return { type: "invalid", loc: startLoc };
    }
  }
  flowEnumMemberRaw() {
    const loc = this.state.startLoc;
    return {
      id: this.parseIdentifier(true),
      init: this.eat(29) ? this.flowEnumMemberInit() : { type: "none", loc }
    };
  }
  flowEnumCheckExplicitTypeMismatch(loc, context, expectedType) {
    const { explicitType } = context;
    explicitType === null ||
      explicitType === expectedType ||
      this.flowEnumErrorInvalidMemberInitializer(loc, context);
  }
  flowEnumMembers({ enumName, explicitType }) {
    const seenNames = new Set(),
      members = { booleanMembers: [], numberMembers: [], stringMembers: [], defaultedMembers: [] };
    let hasUnknownMembers = false;
    while (!this.match(8)) {
      if (this.eat(21)) {
        hasUnknownMembers = true;
        break;
      }
      const memberNode = this.startNode(),
        { id, init } = this.flowEnumMemberRaw(),
        memberName = id.name;
      if (memberName === "") continue;

      /^[a-z]/.test(memberName) &&
        this.raise(FlowErrors.EnumInvalidMemberName, {
          at: id,
          memberName,
          suggestion: memberName[0].toUpperCase() + memberName.slice(1),
          enumName
        });

      seenNames.has(memberName) && this.raise(FlowErrors.EnumDuplicateMemberName, { at: id, memberName, enumName });

      seenNames.add(memberName);
      const context = { enumName, explicitType, memberName };
      memberNode.id = id;
      switch (init.type) {
        case "boolean":
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "boolean");
          memberNode.init = init.value;
          members.booleanMembers.push(this.finishNode(memberNode, "EnumBooleanMember"));
          break;

        case "number":
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "number");
          memberNode.init = init.value;
          members.numberMembers.push(this.finishNode(memberNode, "EnumNumberMember"));
          break;

        case "string":
          this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "string");
          memberNode.init = init.value;
          members.stringMembers.push(this.finishNode(memberNode, "EnumStringMember"));
          break;

        case "invalid":
          throw this.flowEnumErrorInvalidMemberInitializer(init.loc, context);

        case "none":
          switch (explicitType) {
            case "boolean":
              this.flowEnumErrorBooleanMemberNotInitialized(init.loc, context);
              break;
            case "number":
              this.flowEnumErrorNumberMemberNotInitialized(init.loc, context);
              break;
            default:
              members.defaultedMembers.push(this.finishNode(memberNode, "EnumDefaultedMember"));
          }
      }
      this.match(8) || this.expect(12);
    }
    return { members, hasUnknownMembers };
  }
  flowEnumStringMembers(initializedMembers, defaultedMembers, { enumName }) {
    if (initializedMembers.length === 0) return defaultedMembers;
    if (defaultedMembers.length === 0) return initializedMembers;
    if (defaultedMembers.length > initializedMembers.length) {
      for (const member of initializedMembers)
        this.flowEnumErrorStringMemberInconsistentlyInitialized(member, { enumName });

      return defaultedMembers;
    }
    for (const member of defaultedMembers)
      this.flowEnumErrorStringMemberInconsistentlyInitialized(member, { enumName });

    return initializedMembers;
  }
  flowEnumParseExplicitType({ enumName }) {
    if (!this.eatContextual(101)) return null;
    if (!tokenIsIdentifier(this.state.type))
      throw this.raise(FlowErrors.EnumInvalidExplicitTypeUnknownSupplied, { at: this.state.startLoc, enumName });

    const { value } = this.state;
    this.next();
    value === "boolean" || value === "number" || value === "string" || value === "symbol" ||
      this.raise(FlowErrors.EnumInvalidExplicitType, { at: this.state.startLoc, enumName, invalidEnumType: value });

    return value;
  }
  flowEnumBody(node, id) {
    const enumName = id.name,
      nameLoc = id.loc.start,
      explicitType = this.flowEnumParseExplicitType({ enumName });
    this.expect(5);
    const { members, hasUnknownMembers } = this.flowEnumMembers({ enumName, explicitType });
    node.hasUnknownMembers = hasUnknownMembers;
    switch (explicitType) {
      case "boolean":
        node.explicitType = true;
        node.members = members.booleanMembers;
        this.expect(8);
        return this.finishNode(node, "EnumBooleanBody");
      case "number":
        node.explicitType = true;
        node.members = members.numberMembers;
        this.expect(8);
        return this.finishNode(node, "EnumNumberBody");
      case "string":
        node.explicitType = true;
        node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, { enumName });
        this.expect(8);
        return this.finishNode(node, "EnumStringBody");
      case "symbol":
        node.members = members.defaultedMembers;
        this.expect(8);
        return this.finishNode(node, "EnumSymbolBody");
      default: {
        const empty = () => {
          node.members = [];
          this.expect(8);
          return this.finishNode(node, "EnumStringBody");
        };
        node.explicitType = false;
        const boolsLen = members.booleanMembers.length,
          numsLen = members.numberMembers.length,
          strsLen = members.stringMembers.length,
          defaultedLen = members.defaultedMembers.length;
        if (!(boolsLen || numsLen || strsLen || defaultedLen)) return empty();
        if (!boolsLen && !numsLen) {
          node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, { enumName });
          this.expect(8);
          return this.finishNode(node, "EnumStringBody");
        }
        if (!numsLen && !strsLen && boolsLen >= defaultedLen) {
          for (const member of members.defaultedMembers)
            this.flowEnumErrorBooleanMemberNotInitialized(member.loc.start, { enumName, memberName: member.id.name });

          node.members = members.booleanMembers;
          this.expect(8);
          return this.finishNode(node, "EnumBooleanBody");
        }
        if (!boolsLen && !strsLen && numsLen >= defaultedLen) {
          for (const member of members.defaultedMembers)
            this.flowEnumErrorNumberMemberNotInitialized(member.loc.start, { enumName, memberName: member.id.name });

          node.members = members.numberMembers;
          this.expect(8);
          return this.finishNode(node, "EnumNumberBody");
        }

        this.raise(FlowErrors.EnumInconsistentMemberValues, { at: nameLoc, enumName });
        return empty();
      }
    }
  }
  flowParseEnumDeclaration(node) {
    const id = this.parseIdentifier();
    node.id = id;
    node.body = this.flowEnumBody(this.startNode(), id);
    return this.finishNode(node, "EnumDeclaration");
  }
  isLookaheadToken_lt() {
    const next = this.nextTokenStart();
    if (this.input.charCodeAt(next) === 60) {
      const afterNext = this.input.charCodeAt(next + 1);
      return afterNext !== 60 && afterNext !== 61;
    }
    return false;
  }
  maybeUnwrapTypeCastExpression(node) {
    return node.type === "TypeCastExpression" ? node.expression : node;
  }
};

// noinspection SpellCheckingInspection
const entities = {
  __proto__: null,
  quot: '"',
  amp: "&",
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: "\xA0",
  iexcl: "\xA1",
  cent: "\xA2",
  pound: "\xA3",
  curren: "\xA4",
  yen: "\xA5",
  brvbar: "\xA6",
  sect: "\xA7",
  uml: "\xA8",
  copy: "\xA9",
  ordf: "\xAA",
  laquo: "\xAB",
  not: "\xAC",
  shy: "\xAD",
  reg: "\xAE",
  macr: "\xAF",
  deg: "\xB0",
  plusmn: "\xB1",
  sup2: "\xB2",
  sup3: "\xB3",
  acute: "\xB4",
  micro: "\xB5",
  para: "\xB6",
  middot: "\xB7",
  cedil: "\xB8",
  sup1: "\xB9",
  ordm: "\xBA",
  raquo: "\xBB",
  frac14: "\xBC",
  frac12: "\xBD",
  frac34: "\xBE",
  iquest: "\xBF",
  Agrave: "\xC0",
  Aacute: "\xC1",
  Acirc: "\xC2",
  Atilde: "\xC3",
  Auml: "\xC4",
  Aring: "\xC5",
  AElig: "\xC6",
  Ccedil: "\xC7",
  Egrave: "\xC8",
  Eacute: "\xC9",
  Ecirc: "\xCA",
  Euml: "\xCB",
  Igrave: "\xCC",
  Iacute: "\xCD",
  Icirc: "\xCE",
  Iuml: "\xCF",
  ETH: "\xD0",
  Ntilde: "\xD1",
  Ograve: "\xD2",
  Oacute: "\xD3",
  Ocirc: "\xD4",
  Otilde: "\xD5",
  Ouml: "\xD6",
  times: "\xD7",
  Oslash: "\xD8",
  Ugrave: "\xD9",
  Uacute: "\xDA",
  Ucirc: "\xDB",
  Uuml: "\xDC",
  Yacute: "\xDD",
  THORN: "\xDE",
  szlig: "\xDF",
  agrave: "\xE0",
  aacute: "\xE1",
  acirc: "\xE2",
  atilde: "\xE3",
  auml: "\xE4",
  aring: "\xE5",
  aelig: "\xE6",
  ccedil: "\xE7",
  egrave: "\xE8",
  eacute: "\xE9",
  ecirc: "\xEA",
  euml: "\xEB",
  igrave: "\xEC",
  iacute: "\xED",
  icirc: "\xEE",
  iuml: "\xEF",
  eth: "\xF0",
  ntilde: "\xF1",
  ograve: "\xF2",
  oacute: "\xF3",
  ocirc: "\xF4",
  otilde: "\xF5",
  ouml: "\xF6",
  divide: "\xF7",
  oslash: "\xF8",
  ugrave: "\xF9",
  uacute: "\xFA",
  ucirc: "\xFB",
  uuml: "\xFC",
  yacute: "\xFD",
  thorn: "\xFE",
  yuml: "\xFF",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  fnof: "\u0192",
  circ: "\u02C6",
  tilde: "\u02DC",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  bull: "\u2022",
  hellip: "\u2026",
  permil: "\u2030",
  prime: "\u2032",
  Prime: "\u2033",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  oline: "\u203E",
  frasl: "\u2044",
  euro: "\u20AC",
  image: "\u2111",
  weierp: "\u2118",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666"
};

const JsxErrors = ParseErrorEnum`jsx`({
  AttributeIsEmpty: "JSX attributes must only be assigned a non-empty expression.",
  MissingClosingTagElement: ({ openingTagName }) => `Expected corresponding JSX closing tag for <${openingTagName}>.`,
  MissingClosingTagFragment: "Expected corresponding JSX closing tag for <>.",
  UnexpectedSequenceExpression:
    "Sequence expressions cannot be directly nested inside JSX. Did you mean to wrap it in parentheses (...)?",
  UnexpectedToken: ({ unexpected, HTMLEntity }) =>
    `Unexpected token \`${unexpected}\`. Did you mean \`${HTMLEntity}\` or \`{'${unexpected}'}\`?`,
  UnsupportedJsxValue: "JSX value should be either an expression or a quoted JSX text.",
  UnterminatedJsxContent: "Unterminated JSX contents.",
  UnwrappedAdjacentJSXElements:
    "Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?"
});
function isFragment(object) {
  return !!object && (object.type === "JSXOpeningFragment" || object.type === "JSXClosingFragment");
}
function getQualifiedJSXName(object) {
  if (object.type === "JSXIdentifier") return object.name;
  if (object.type === "JSXNamespacedName") return object.namespace.name + ":" + object.name.name;
  if (object.type === "JSXMemberExpression")
    return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);

  throw new Error("Node had unexpected type: " + object.type);
}
var jsx = superClass => class extends superClass {
  jsxReadToken() {
    let out = "",
      chunkStart = this.state.pos;
    for (;;) {
      if (this.state.pos >= this.length)
        throw this.raise(JsxErrors.UnterminatedJsxContent, { at: this.state.startLoc });

      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 60:
        case 123:
          if (this.state.pos === this.state.start) {
            if (ch === 60 && this.state.canStartJSXElement) {
              ++this.state.pos;
              this.finishToken(140);
            } else super.getTokenFromCode(ch);

            return;
          }
          out += this.input.slice(chunkStart, this.state.pos);
          this.finishToken(139, out);
          return;
        case 38:
          out += this.input.slice(chunkStart, this.state.pos);
          out += this.jsxReadEntity();
          chunkStart = this.state.pos;
          break;
        case 62:
        case 125:
        default:
          if (isNewLine(ch)) {
            out += this.input.slice(chunkStart, this.state.pos);
            out += this.jsxReadNewLine(true);
            chunkStart = this.state.pos;
          } else ++this.state.pos;
      }
    }
  }
  jsxReadNewLine(normalizeCRLF) {
    const ch = this.input.charCodeAt(this.state.pos);
    let out;
    ++this.state.pos;
    if (ch === 13 && this.input.charCodeAt(this.state.pos) === 10) {
      ++this.state.pos;
      out = normalizeCRLF ? "\n" : "\r\n";
    } else out = String.fromCharCode(ch);

    ++this.state.curLine;
    this.state.lineStart = this.state.pos;
    return out;
  }
  jsxReadString(quote) {
    let out = "",
      chunkStart = ++this.state.pos;
    for (;;) {
      if (this.state.pos >= this.length) throw this.raise(Errors.UnterminatedString, { at: this.state.startLoc });

      const ch = this.input.charCodeAt(this.state.pos);
      if (ch === quote) break;
      if (ch === 38) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadEntity();
        chunkStart = this.state.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadNewLine(false);
        chunkStart = this.state.pos;
      } else ++this.state.pos;
    }
    out += this.input.slice(chunkStart, this.state.pos++);
    this.finishToken(131, out);
  }
  jsxReadEntity() {
    const startPos = ++this.state.pos;
    if (this.codePointAtPos(this.state.pos) === 35) {
      ++this.state.pos;
      let radix = 10;
      if (this.codePointAtPos(this.state.pos) === 120) {
        radix = 16;
        ++this.state.pos;
      }
      const codePoint = this.readInt(radix, void 0, false, "bail");
      if (codePoint !== null && this.codePointAtPos(this.state.pos) === 59) {
        ++this.state.pos;
        return String.fromCodePoint(codePoint);
      }
    } else {
      let count = 0,
        semi = false;
      while (count++ < 10 && this.state.pos < this.length && !(semi = this.codePointAtPos(this.state.pos) == 59))
        ++this.state.pos;

      if (semi) {
        const desc = this.input.slice(startPos, this.state.pos),
          entity = entities[desc];
        ++this.state.pos;
        if (entity) return entity;
      }
    }
    this.state.pos = startPos;
    return "&";
  }
  jsxReadWord() {
    let ch;
    const start = this.state.pos;
    do {
      ch = this.input.charCodeAt(++this.state.pos);
    } while (common.isIdentifierChar(ch) || ch === 45);
    this.finishToken(138, this.input.slice(start, this.state.pos));
  }
  jsxParseIdentifier() {
    const node = this.startNode();
    this.match(138)
      ? (node.name = this.state.value)
      : tokenIsKeyword(this.state.type)
      ? (node.name = tokenLabelName(this.state.type))
      : this.unexpected();

    this.next();
    return this.finishNode(node, "JSXIdentifier");
  }
  jsxParseNamespacedName() {
    const startLoc = this.state.startLoc,
      name = this.jsxParseIdentifier();
    if (!this.eat(14)) return name;
    const node = this.startNodeAt(startLoc);
    node.namespace = name;
    node.name = this.jsxParseIdentifier();
    return this.finishNode(node, "JSXNamespacedName");
  }
  jsxParseElementName() {
    const startLoc = this.state.startLoc;
    let node = this.jsxParseNamespacedName();
    if (node.type === "JSXNamespacedName") return node;

    while (this.eat(16)) {
      const newNode = this.startNodeAt(startLoc);
      newNode.object = node;
      newNode.property = this.jsxParseIdentifier();
      node = this.finishNode(newNode, "JSXMemberExpression");
    }
    return node;
  }
  jsxParseAttributeValue() {
    let node;
    switch (this.state.type) {
      case 5:
        node = this.startNode();
        this.setContext(types.brace);
        this.next();
        node = this.jsxParseExpressionContainer(node, types.j_oTag);
        node.expression.type !== "JSXEmptyExpression" || this.raise(JsxErrors.AttributeIsEmpty, { at: node });

        return node;
      case 140:
      case 131:
        return this.parseExprAtom();
      default:
        throw this.raise(JsxErrors.UnsupportedJsxValue, { at: this.state.startLoc });
    }
  }
  jsxParseEmptyExpression() {
    const node = this.startNodeAt(this.state.lastTokEndLoc);
    return this.finishNodeAt(node, "JSXEmptyExpression", this.state.startLoc);
  }
  jsxParseSpreadChild(node) {
    this.next();
    node.expression = this.parseExpression();
    this.setContext(types.j_expr);
    this.state.canStartJSXElement = true;
    this.expect(8);
    return this.finishNode(node, "JSXSpreadChild");
  }
  jsxParseExpressionContainer(node, previousContext) {
    if (this.match(8)) node.expression = this.jsxParseEmptyExpression();
    else node.expression = this.parseExpression();

    this.setContext(previousContext);
    this.state.canStartJSXElement = true;
    this.expect(8);
    return this.finishNode(node, "JSXExpressionContainer");
  }
  jsxParseAttribute() {
    const node = this.startNode();
    if (this.match(5)) {
      this.setContext(types.brace);
      this.next();
      this.expect(21);
      node.argument = this.parseMaybeAssignAllowIn();
      this.setContext(types.j_oTag);
      this.state.canStartJSXElement = true;
      this.expect(8);
      return this.finishNode(node, "JSXSpreadAttribute");
    }
    node.name = this.jsxParseNamespacedName();
    node.value = this.eat(29) ? this.jsxParseAttributeValue() : null;
    return this.finishNode(node, "JSXAttribute");
  }
  jsxParseOpeningElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    if (this.eat(141)) return this.finishNode(node, "JSXOpeningFragment");

    node.name = this.jsxParseElementName();
    return this.jsxParseOpeningElementAfterName(node);
  }
  jsxParseOpeningElementAfterName(node) {
    const attributes = [];
    while (!this.match(56) && !this.match(141)) attributes.push(this.jsxParseAttribute());

    node.attributes = attributes;
    node.selfClosing = this.eat(56);
    this.expect(141);
    return this.finishNode(node, "JSXOpeningElement");
  }
  jsxParseClosingElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    if (this.eat(141)) return this.finishNode(node, "JSXClosingFragment");

    node.name = this.jsxParseElementName();
    this.expect(141);
    return this.finishNode(node, "JSXClosingElement");
  }
  jsxParseElementAt(startLoc) {
    const node = this.startNodeAt(startLoc),
      children = [],
      openingElement = this.jsxParseOpeningElementAt(startLoc);
    let closingElement = null;
    if (!openingElement.selfClosing) {
      contents: for (;;)
        switch (this.state.type) {
          case 140:
            startLoc = this.state.startLoc;
            this.next();
            if (this.eat(56)) {
              closingElement = this.jsxParseClosingElementAt(startLoc);
              break contents;
            }
            children.push(this.jsxParseElementAt(startLoc));
            break;
          case 139:
            children.push(this.parseExprAtom());
            break;
          case 5: {
            const node = this.startNode();
            this.setContext(types.brace);
            this.next();
            this.match(21)
              ? children.push(this.jsxParseSpreadChild(node))
              : children.push(this.jsxParseExpressionContainer(node, types.j_expr));

            break;
          }
          default:
            this.unexpected();
        }

      // noinspection JSObjectNullOrUndefined
      isFragment(openingElement) && !isFragment(closingElement) && closingElement !== null
        ? this.raise(JsxErrors.MissingClosingTagFragment, { at: closingElement })
        : !isFragment(openingElement) && isFragment(closingElement)
        ? this.raise(JsxErrors.MissingClosingTagElement, {
            at: closingElement,
            openingTagName: getQualifiedJSXName(openingElement.name)
          })
        : isFragment(openingElement) || isFragment(closingElement) ||
          getQualifiedJSXName(closingElement.name) === getQualifiedJSXName(openingElement.name) ||
          this.raise(JsxErrors.MissingClosingTagElement, {
            at: closingElement,
            openingTagName: getQualifiedJSXName(openingElement.name)
          });
    }
    if (isFragment(openingElement)) {
      node.openingFragment = openingElement;
      node.closingFragment = closingElement;
    } else {
      node.openingElement = openingElement;
      node.closingElement = closingElement;
    }
    node.children = children;
    if (this.match(47)) throw this.raise(JsxErrors.UnwrappedAdjacentJSXElements, { at: this.state.startLoc });

    return isFragment(openingElement) ? this.finishNode(node, "JSXFragment") : this.finishNode(node, "JSXElement");
  }
  jsxParseElement() {
    const startLoc = this.state.startLoc;
    this.next();
    return this.jsxParseElementAt(startLoc);
  }
  setContext(newContext) {
    const { context } = this.state;
    context[context.length - 1] = newContext;
  }
  parseExprAtom(refExpressionErrors) {
    if (this.match(139)) return this.parseLiteral(this.state.value, "JSXText");
    if (this.match(140)) return this.jsxParseElement();
    if (this.match(47) && this.input.charCodeAt(this.state.pos) !== 33) {
      this.replaceToken(140);
      return this.jsxParseElement();
    }
    return super.parseExprAtom(refExpressionErrors);
  }
  // noinspection JSUnusedGlobalSymbols
  skipSpace() {
    this.curContext().preserveSpace || super.skipSpace();
  }
  getTokenFromCode(code) {
    const context = this.curContext();
    if (context === types.j_expr) {
      this.jsxReadToken();
      return;
    }
    if (context === types.j_oTag || context === types.j_cTag) {
      if (common.isIdentifierStart(code)) {
        this.jsxReadWord();
        return;
      }
      if (code === 62) {
        ++this.state.pos;
        this.finishToken(141);
        return;
      }
      if ((code === 34 || code === 39) && context === types.j_oTag) {
        this.jsxReadString(code);
        return;
      }
    }
    if (code === 60 && this.state.canStartJSXElement && this.input.charCodeAt(this.state.pos + 1) !== 33) {
      ++this.state.pos;
      this.finishToken(140);
      return;
    }
    super.getTokenFromCode(code);
  }
  updateContext(prevType) {
    const { context, type } = this.state;
    if (type === 56 && prevType === 140) {
      context.splice(-2, 2, types.j_cTag);
      this.state.canStartJSXElement = false;
    } else if (type === 140) context.push(types.j_oTag);
    else if (type === 141) {
      const out = context[context.length - 1];
      if ((out === types.j_oTag && prevType === 56) || out === types.j_cTag) {
        context.pop();
        this.state.canStartJSXElement = context[context.length - 1] === types.j_expr;
      } else {
        this.setContext(types.j_expr);
        this.state.canStartJSXElement = true;
      }
    } else this.state.canStartJSXElement = tokenComesBeforeExpression(type);
  }
};

class TypeScriptScope extends Scope {
  constructor(...args) {
    super(...args);
    this.types = new Set();
    this.enums = new Set();
    this.constEnums = new Set();
    this.classes = new Set();
    this.exportOnlyBindings = new Set();
  }
}
class TypeScriptScopeHandler extends ScopeHandler {
  constructor(...args) {
    super(...args);
    this.importsStack = [];
  }
  createScope(flags) {
    this.importsStack.push(new Set());
    return new TypeScriptScope(flags);
  }
  enter(flags) {
    flags != ScopeFlag.TS_MODULE || this.importsStack.push(new Set());

    super.enter(flags);
  }
  exit() {
    const flags = super.exit();
    flags != ScopeFlag.TS_MODULE || this.importsStack.pop();

    return flags;
  }
  hasImport(name, allowShadow) {
    const len = this.importsStack.length;
    if (this.importsStack[len - 1].has(name)) return true;

    if (!allowShadow && len > 1) for (let i = 0; i < len - 1; i++) if (this.importsStack[i].has(name)) return true;

    return false;
  }
  declareName(name, bindingType, loc) {
    if (bindingType & BindingFlag.FLAG_TS_IMPORT) {
      this.hasImport(name, true) && this.parser.raise(Errors.VarRedeclaration, { at: loc, identifierName: name });

      this.importsStack[this.importsStack.length - 1].add(name);
      return;
    }
    const scope = this.currentScope();
    if (bindingType & BindingFlag.FLAG_TS_EXPORT_ONLY) {
      this.maybeExportDefined(scope, name);
      scope.exportOnlyBindings.add(name);
      return;
    }
    super.declareName(name, bindingType, loc);
    if (bindingType & BindingFlag.KIND_TYPE) {
      if (!(bindingType & BindingFlag.KIND_VALUE)) {
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        this.maybeExportDefined(scope, name);
      }
      scope.types.add(name);
    }
    bindingType & BindingFlag.FLAG_TS_ENUM && scope.enums.add(name);
    bindingType & BindingFlag.FLAG_TS_CONST_ENUM && scope.constEnums.add(name);

    bindingType & BindingFlag.FLAG_CLASS && scope.classes.add(name);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    return scope.enums.has(name)
      ? !(bindingType & BindingFlag.FLAG_TS_ENUM) ||
        !!(bindingType & BindingFlag.FLAG_TS_CONST_ENUM) !== scope.constEnums.has(name)
      : bindingType & BindingFlag.FLAG_CLASS && scope.classes.has(name)
      ? !!scope.lexical.has(name) && !!(bindingType & BindingFlag.KIND_VALUE)
      : !!(bindingType & BindingFlag.KIND_TYPE && scope.types.has(name)) ||
        super.isRedeclaredInScope(scope, name, bindingType);
  }
  checkLocalExport(id) {
    const { name } = id;
    if (this.hasImport(name)) return;
    for (let i = this.scopeStack.length - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      if (scope.types.has(name) || scope.exportOnlyBindings.has(name)) return;
    }
    super.checkLocalExport(id);
  }
}

const getOwn$1 = (object, key) => Object.hasOwnProperty.call(object, key) && object[key],
  unwrapParenthesizedExpression = node =>
    node.type === "ParenthesizedExpression" ? unwrapParenthesizedExpression(node.expression) : node;
var ParseBindingListFlags = {
  ALLOW_EMPTY: 1,
  IS_FUNCTION_PARAMS: 2,
  IS_CONSTRUCTOR_PARAMS: 4
};
class LValParser extends NodeUtils {
  toAssignable(node, isLHS = false) {
    var _node$extra, _node$extra3;
    let parenthesized = void 0;
    if (node.type === "ParenthesizedExpression" || ((_node$extra = node.extra) != null && _node$extra.parenthesized)) {
      parenthesized = unwrapParenthesizedExpression(node);
      isLHS
        ? parenthesized.type === "Identifier"
          ? this.expressionScope.recordArrowParameterBindingError(Errors.InvalidParenthesizedAssignment, { at: node })
          : parenthesized.type === "MemberExpression" ||
            this.raise(Errors.InvalidParenthesizedAssignment, { at: node })
        : this.raise(Errors.InvalidParenthesizedAssignment, { at: node });
    }
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        for (let i = 0, length = node.properties.length, last = length - 1; i < length; i++) {
          var _node$extra2;
          const prop = node.properties[i],
            isLast = i === last;
          this.toAssignableObjectExpressionProp(prop, isLast, isLHS);

          isLast &&
            prop.type === "RestElement" &&
            (_node$extra2 = node.extra) != null &&
            _node$extra2.trailingCommaLoc &&
            this.raise(Errors.RestTrailingComma, { at: node.extra.trailingCommaLoc });
        }
        break;
      case "ObjectProperty": {
        const { key, value } = node;
        this.isPrivateName(key) && this.classScope.usePrivateName(this.getPrivateNameSV(key), key.loc.start);

        this.toAssignable(value, isLHS);
        break;
      }
      case "SpreadElement":
        throw new Error(
          "Internal @babel/parser error (this is a bug, please report it). SpreadElement should be converted by .toAssignable's caller."
        );

      case "ArrayExpression":
        node.type = "ArrayPattern";
        this.toAssignableList(
          node.elements,
          (_node$extra3 = node.extra) == null ? void 0 : _node$extra3.trailingCommaLoc,
          isLHS
        );
        break;
      case "AssignmentExpression":
        node.operator === "=" || this.raise(Errors.MissingEqInAssignment, { at: node.left.loc.end });

        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isLHS);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(parenthesized, isLHS);
        break;
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.type === "ObjectMethod")
      this.raise(prop.kind === "get" || prop.kind === "set" ? Errors.PatternHasAccessor : Errors.PatternHasMethod, {
        at: prop.key
      });
    else if (prop.type === "SpreadElement") {
      prop.type = "RestElement";
      const arg = prop.argument;
      this.checkToRestConversion(arg, false);
      this.toAssignable(arg, isLHS);
      isLast || this.raise(Errors.RestTrailingComma, { at: prop });
    } else this.toAssignable(prop, isLHS);
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    const end = exprList.length - 1;
    for (let i = 0; i <= end; i++) {
      const elt = exprList[i];
      if (!elt) continue;
      if (elt.type === "SpreadElement") {
        elt.type = "RestElement";
        const arg = elt.argument;
        this.checkToRestConversion(arg, true);
        this.toAssignable(arg, isLHS);
      } else this.toAssignable(elt, isLHS);

      if (elt.type === "RestElement")
        i < end
          ? this.raise(Errors.RestTrailingComma, { at: elt })
          : trailingCommaLoc && this.raise(Errors.RestTrailingComma, { at: trailingCommaLoc });
    }
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        return true;
      case "ObjectExpression": {
        const last = node.properties.length - 1;
        return node.properties.every(
          (prop, i) =>
            prop.type !== "ObjectMethod" && (i === last || prop.type !== "SpreadElement") && this.isAssignable(prop)
        );
      }
      case "ObjectProperty":
        return this.isAssignable(node.value);
      case "SpreadElement":
        return this.isAssignable(node.argument);
      case "ArrayExpression":
        return node.elements.every(element => element === null || this.isAssignable(element));
      case "AssignmentExpression":
        return node.operator === "=";
      case "ParenthesizedExpression":
        return this.isAssignable(node.expression);
      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding;
      default:
        return false;
    }
  }
  toReferencedList(exprList, _isParenthesizedExpr) {
    return exprList;
  }
  toReferencedListDeep(exprList, isParenthesizedExpr) {
    this.toReferencedList(exprList, isParenthesizedExpr);
    for (const expr of exprList)
      (expr == null ? void 0 : expr.type) !== "ArrayExpression" || this.toReferencedListDeep(expr.elements);
  }
  parseSpread(refExpressionErrors) {
    const node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssignAllowIn(refExpressionErrors, void 0);
    return this.finishNode(node, "SpreadElement");
  }
  parseRestBinding() {
    const node = this.startNode();
    this.next();
    node.argument = this.parseBindingAtom();
    return this.finishNode(node, "RestElement");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 0: {
        const node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(3, 93, ParseBindingListFlags.ALLOW_EMPTY);
        return this.finishNode(node, "ArrayPattern");
      }
      case 5:
        return this.parseObjectLike(8, true);
    }
    return this.parseIdentifier();
  }
  parseBindingList(close, closeCharCode, flags) {
    const allowEmpty = flags & ParseBindingListFlags.ALLOW_EMPTY,
      elts = [];
    for (let first = true; !this.eat(close); ) {
      first ? (first = false) : this.expect(12);

      if (allowEmpty && this.match(12)) elts.push(null);
      else if (this.eat(close)) break;
      else if (this.match(21)) {
        elts.push(this.parseAssignableListItemTypes(this.parseRestBinding(), flags));
        if (!this.checkCommaAfterRest(closeCharCode)) {
          this.expect(close);
          break;
        }
      } else {
        const decorators = [];
        this.match(26) && this.hasPlugin("decorators") &&
          this.raise(Errors.UnsupportedParameterDecorator, { at: this.state.startLoc });

        while (this.match(26)) decorators.push(this.parseDecorator());

        elts.push(this.parseAssignableListItem(flags, decorators));
      }
    }
    return elts;
  }
  parseBindingRestProperty(prop) {
    this.next();
    prop.argument = this.parseIdentifier();
    this.checkCommaAfterRest(125);
    return this.finishNode(prop, "RestElement");
  }
  parseBindingProperty() {
    const prop = this.startNode(),
      { type, startLoc } = this.state;
    if (type === 21) return this.parseBindingRestProperty(prop);
    if (type === 136) {
      this.expectPlugin("destructuringPrivate", startLoc);
      this.classScope.usePrivateName(this.state.value, startLoc);
      prop.key = this.parsePrivateName();
    } else this.parsePropertyName(prop);

    prop.method = false;
    return this.parseObjPropValue(prop, startLoc, false, false, true, false);
  }
  parseAssignableListItem(flags, decorators) {
    const left = this.parseMaybeDefault();
    this.parseAssignableListItemTypes(left, flags);
    const elt = this.parseMaybeDefault(left.loc.start, left);
    if (decorators.length) left.decorators = decorators;

    return elt;
  }
  parseAssignableListItemTypes(param, _flags) {
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    var _left;
    startLoc != null || (startLoc = this.state.startLoc);
    left = (_left = left) != null ? _left : this.parseBindingAtom();
    if (!this.eat(29)) return left;
    const node = this.startNodeAt(startLoc);
    node.left = left;
    node.right = this.parseMaybeAssignAllowIn();
    return this.finishNode(node, "AssignmentPattern");
  }
  isValidLVal(type, isUnparenthesizedInAssign, _binding) {
    return getOwn$1({
      AssignmentPattern: "left",
      RestElement: "argument",
      ObjectProperty: "value",
      ParenthesizedExpression: "expression",
      ArrayPattern: "elements",
      ObjectPattern: "properties"
    }, type);
  }
  checkLVal(
    expression,
    {
      in: ancestor,
      binding = BindingFlag.TYPE_NONE,
      checkClashes = false,
      strictModeChanged = false,
      hasParenthesizedAncestor = false
    }
  ) {
    var _expression$extra;
    const type = expression.type;
    if (this.isObjectMethod(expression)) return;
    if (type === "MemberExpression") {
      binding === BindingFlag.TYPE_NONE || this.raise(Errors.InvalidPropertyBindingPattern, { at: expression });

      return;
    }
    if (type === "Identifier") {
      this.checkIdentifier(expression, binding, strictModeChanged);
      const { name } = expression;
      if (checkClashes)
        checkClashes.has(name) ? this.raise(Errors.ParamDupe, { at: expression }) : checkClashes.add(name);

      return;
    }
    const validity = this.isValidLVal(
      type,
      !hasParenthesizedAncestor &&
        ((_expression$extra = expression.extra) == null || !_expression$extra.parenthesized) &&
        ancestor.type === "AssignmentExpression",
      binding
    );
    if (validity === true) return;
    if (validity === false) {
      const ParseErrorClass = binding === BindingFlag.TYPE_NONE ? Errors.InvalidLhs : Errors.InvalidLhsBinding;
      this.raise(ParseErrorClass, { at: expression, ancestor });
      return;
    }
    const [key, isParenthesizedExpression] = Array.isArray(validity)
      ? validity
      : [validity, type === "ParenthesizedExpression"];
    const nextAncestor =
      type === "ArrayPattern" || type === "ObjectPattern" || type === "ParenthesizedExpression" ? { type } : ancestor;
    for (const child of [].concat(expression[key]))
      child &&
        this.checkLVal(child, {
          in: nextAncestor,
          binding,
          checkClashes,
          strictModeChanged,
          hasParenthesizedAncestor: isParenthesizedExpression
        });
  }
  checkIdentifier(at, bindingType, strictModeChanged = false) {
    this.state.strict &&
      (strictModeChanged
        ? common.isStrictBindReservedWord(at.name, this.inModule)
        : common.isStrictBindOnlyReservedWord(at.name)) &&
      (bindingType === BindingFlag.TYPE_NONE
        ? this.raise(Errors.StrictEvalArguments, { at, referenceName: at.name })
        : this.raise(Errors.StrictEvalArgumentsBinding, { at, bindingName: at.name }));

    bindingType & BindingFlag.FLAG_NO_LET_IN_LEXICAL && at.name === "let" &&
      this.raise(Errors.LetInLexicalBinding, { at });

    bindingType & BindingFlag.TYPE_NONE || this.declareNameFromIdentifier(at, bindingType);
  }
  declareNameFromIdentifier(identifier, binding) {
    this.scope.declareName(identifier.name, binding, identifier.loc.start);
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.checkToRestConversion(node.expression, allowPattern);
        break;
      case "Identifier":
      case "MemberExpression":
        break;
      case "ArrayExpression":
      case "ObjectExpression":
        if (allowPattern) break;
      default:
        this.raise(Errors.InvalidRestAssignmentPattern, { at: node });
    }
  }
  checkCommaAfterRest(close) {
    if (!this.match(12)) return false;

    this.raise(this.lookaheadCharCode() === close ? Errors.RestTrailingComma : Errors.ElementAfterRest, {
      at: this.state.startLoc
    });
    return true;
  }
}

const getOwn = (object, key) => Object.hasOwnProperty.call(object, key) && object[key];
function nonNull(x) {
  if (x == null) throw new Error(`Unexpected ${x} value.`);

  return x;
}
function assert(x) {
  if (!x) throw new Error("Assert fail");
}
// noinspection JSUnusedGlobalSymbols
const TSErrors = ParseErrorEnum`typescript`({
  AbstractMethodHasImplementation: ({ methodName }) =>
    `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
  AbstractPropertyHasInitializer: ({ propertyName }) =>
    `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
  AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  AccessorCannotBeOptional: "An 'accessor' property cannot be declared optional.",
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference:
    "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
  ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: ({ kind }) => `'declare' is not allowed in ${kind}ters.`,
  DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
  DuplicateAccessibilityModifier: ({ modifier: _ }) => "Accessibility modifier already seen.",
  DuplicateModifier: ({ modifier }) => `Duplicate modifier: '${modifier}'.`,
  EmptyHeritageClauseType: ({ token }) => `'${token}' list cannot be empty.`,
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  ImportReflectionHasImportType: "An `import module` declaration can not use `type` modifier",
  IncompatibleModifiers: ({ modifiers }) =>
    `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
  IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: ({ modifier }) =>
    `Index signatures cannot have an accessibility modifier ('${modifier}').`,
  IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
  InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.",
  InvalidModifierOnTypeMember: ({ modifier }) => `'${modifier}' modifier cannot appear on a type member.`,
  InvalidModifierOnTypeParameter: ({ modifier }) => `'${modifier}' modifier cannot appear on a type parameter.`,
  InvalidModifierOnTypeParameterPositions: ({ modifier }) =>
    `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
  InvalidModifiersOrder: ({ orderedModifiers }) =>
    `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
  InvalidPropertyAccessAfterInstantiationExpression:
    "Invalid property access after an instantiation expression. You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
  InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
  MissingInterfaceName: "'interface' declarations must be followed by an identifier.",
  MixedLabeledAndUnlabeledElements: "Tuple members must all have names or all not have names.",
  NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifer:
    "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
  OverrideNotInSubClass:
    "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: ({ modifier }) =>
    `Private elements cannot have an accessibility modifier ('${modifier}').`,
  ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
  ReservedArrowTypeParam:
    "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
  ReservedTypeAssertion:
    "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
  SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
  SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
  SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
  SingleTypeParameterWithoutTrailingComma: ({ typeParameterName }) =>
    `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
  StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
  TupleOptionalAfterType:
    "A labeled tuple optional element must be declared using a question mark after the name and before the colon (`name?: type`), rather than after the type (`name: type?`).",
  TypeAnnotationAfterAssign:
    "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed:
    "A type-only import can specify a default import or named bindings, but not both.",
  TypeModifierIsUsedInTypeExports:
    "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
  TypeModifierIsUsedInTypeImports:
    "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
  UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: ({ type }) =>
    `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`
});
function keywordTypeFromName(value) {
  switch (value) {
    case "any":
      return "TSAnyKeyword";
    case "boolean":
      return "TSBooleanKeyword";
    case "bigint":
      return "TSBigIntKeyword";
    case "never":
      return "TSNeverKeyword";
    case "number":
      return "TSNumberKeyword";
    case "object":
      return "TSObjectKeyword";
    case "string":
      return "TSStringKeyword";
    case "symbol":
      return "TSSymbolKeyword";
    case "undefined":
      return "TSUndefinedKeyword";
    case "unknown":
      return "TSUnknownKeyword";
    default:
      return void 0;
  }
}
function tsIsAccessModifier(modifier) {
  return modifier === "private" || modifier === "public" || modifier === "protected";
}
function tsIsVarianceAnnotations(modifier) {
  return modifier === "in" || modifier === "out";
}
// noinspection JSUnusedGlobalSymbols
/**
 * @prop {Function} tsParseInOutModifiers
 * @prop {Function} tsParseConstModifier
 * @prop {Function} tsParseInOutConstModifiers
 */
var typescript = superClass => class extends superClass {
  constructor(...args) {
    super(...args);
    this.tsParseInOutModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out"],
      disallowedModifiers: ["const", "public", "private", "protected", "readonly", "declare", "abstract", "override"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter
    });
    this.tsParseConstModifier = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["const"],
      disallowedModifiers: ["in", "out"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
    });
    this.tsParseInOutConstModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out", "const"],
      disallowedModifiers: ["public", "private", "protected", "readonly", "declare", "abstract", "override"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter
    });
  }
  getScopeHandler() {
    return TypeScriptScopeHandler;
  }
  tsIsIdentifier() {
    return tokenIsIdentifier(this.state.type);
  }
  tsTokenCanFollowModifier() {
    return (
      (this.match(0) ||
        this.match(5) ||
        this.match(55) ||
        this.match(21) ||
        this.match(136) ||
        this.isLiteralPropertyName()) &&
      !this.hasPrecedingLineBreak()
    );
  }
  tsNextTokenCanFollowModifier() {
    this.next();
    return this.tsTokenCanFollowModifier();
  }
  tsParseModifier(allowedModifiers, stopOnStartOfClassStaticBlock) {
    if (!tokenIsIdentifier(this.state.type) && this.state.type !== 58 && this.state.type !== 75) return void 0;

    const modifier = this.state.value;
    if (allowedModifiers.indexOf(modifier) > -1) {
      if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) return void 0;

      if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) return modifier;
    }
    return void 0;
  }
  tsParseModifiers(
    {
      allowedModifiers,
      disallowedModifiers,
      stopOnStartOfClassStaticBlock,
      errorTemplate = TSErrors.InvalidModifierOnTypeMember
    },
    modified
  ) {
    const enforceOrder = (loc, modifier, before, after) => {
      modifier === before && modified[after] &&
        this.raise(TSErrors.InvalidModifiersOrder, { at: loc, orderedModifiers: [before, after] });
    };
    const incompatible = (loc, modifier, mod1, mod2) => {
      if ((modified[mod1] && modifier === mod2) || (modified[mod2] && modifier === mod1))
        this.raise(TSErrors.IncompatibleModifiers, { at: loc, modifiers: [mod1, mod2] });
    };
    for (;;) {
      const { startLoc } = this.state;
      const modifier = this.tsParseModifier(
        allowedModifiers.concat(disallowedModifiers != null ? disallowedModifiers : []),
        stopOnStartOfClassStaticBlock
      );
      if (!modifier) break;
      if (tsIsAccessModifier(modifier))
        if (modified.accessibility) this.raise(TSErrors.DuplicateAccessibilityModifier, { at: startLoc, modifier });
        else {
          enforceOrder(startLoc, modifier, modifier, "override");
          enforceOrder(startLoc, modifier, modifier, "static");
          enforceOrder(startLoc, modifier, modifier, "readonly");
          modified.accessibility = modifier;
        }
      else if (tsIsVarianceAnnotations(modifier)) {
        modified[modifier] && this.raise(TSErrors.DuplicateModifier, { at: startLoc, modifier });

        modified[modifier] = true;
        enforceOrder(startLoc, modifier, "in", "out");
      } else {
        if (Object.hasOwnProperty.call(modified, modifier))
          this.raise(TSErrors.DuplicateModifier, { at: startLoc, modifier });
        else {
          enforceOrder(startLoc, modifier, "static", "readonly");
          enforceOrder(startLoc, modifier, "static", "override");
          enforceOrder(startLoc, modifier, "override", "readonly");
          enforceOrder(startLoc, modifier, "abstract", "override");
          incompatible(startLoc, modifier, "declare", "override");
          incompatible(startLoc, modifier, "static", "abstract");
        }
        modified[modifier] = true;
      }
      disallowedModifiers != null && disallowedModifiers.includes(modifier) &&
        this.raise(errorTemplate, { at: startLoc, modifier });
    }
  }
  tsIsListTerminator(kind) {
    switch (kind) {
      case "EnumMembers":
      case "TypeMembers":
        return this.match(8);
      case "HeritageClauseElement":
        return this.match(5);
      case "TupleElementTypes":
        return this.match(3);
      case "TypeParametersOrArguments":
        return this.match(48);
    }
  }
  tsParseList(kind, parseElement) {
    const result = [];
    while (!this.tsIsListTerminator(kind)) result.push(parseElement());

    return result;
  }
  tsParseDelimitedList(kind, parseElement, refTrailingCommaPos) {
    return nonNull(this.tsParseDelimitedListWorker(kind, parseElement, true, refTrailingCommaPos));
  }
  tsParseDelimitedListWorker(kind, parseElement, expectSuccess, refTrailingCommaPos) {
    const result = [];
    let trailingCommaPos = -1;
    for (; !this.tsIsListTerminator(kind); ) {
      trailingCommaPos = -1;
      const element = parseElement();
      if (element == null) return void 0;

      result.push(element);
      if (!this.eat(12)) {
        if (this.tsIsListTerminator(kind)) break;

        expectSuccess && this.expect(12);

        return void 0;
      }

      trailingCommaPos = this.state.lastTokStart;
    }
    if (refTrailingCommaPos) refTrailingCommaPos.value = trailingCommaPos;

    return result;
  }
  tsParseBracketedList(kind, parseElement, bracket, skipFirstToken, refTrailingCommaPos) {
    skipFirstToken || (bracket ? this.expect(0) : this.expect(47));

    const result = this.tsParseDelimitedList(kind, parseElement, refTrailingCommaPos);
    bracket ? this.expect(3) : this.expect(48);

    return result;
  }
  tsParseImportType() {
    const node = this.startNode();
    this.expect(83);
    this.expect(10);
    this.match(131) || this.raise(TSErrors.UnsupportedImportTypeArgument, { at: this.state.startLoc });

    node.argument = super.parseExprAtom();
    this.expect(11);
    if (this.eat(16)) node.qualifier = this.tsParseEntityName();
    if (this.match(47)) node.typeParameters = this.tsParseTypeArguments();

    return this.finishNode(node, "TSImportType");
  }
  tsParseEntityName(allowReservedWords = true) {
    let entity = this.parseIdentifier(allowReservedWords);
    while (this.eat(16)) {
      const node = this.startNodeAtNode(entity);
      node.left = entity;
      node.right = this.parseIdentifier(allowReservedWords);
      entity = this.finishNode(node, "TSQualifiedName");
    }
    return entity;
  }
  tsParseTypeReference() {
    const node = this.startNode();
    node.typeName = this.tsParseEntityName();
    if (!this.hasPrecedingLineBreak() && this.match(47)) node.typeParameters = this.tsParseTypeArguments();

    return this.finishNode(node, "TSTypeReference");
  }
  tsParseThisTypePredicate(lhs) {
    this.next();
    const node = this.startNodeAtNode(lhs);
    node.parameterName = lhs;
    node.typeAnnotation = this.tsParseTypeAnnotation(false);
    node.asserts = false;
    return this.finishNode(node, "TSTypePredicate");
  }
  tsParseThisTypeNode() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "TSThisType");
  }
  tsParseTypeQuery() {
    const node = this.startNode();
    this.expect(87);
    this.match(83) ? (node.exprName = this.tsParseImportType()) : (node.exprName = this.tsParseEntityName());

    if (!this.hasPrecedingLineBreak() && this.match(47)) node.typeParameters = this.tsParseTypeArguments();

    return this.finishNode(node, "TSTypeQuery");
  }
  tsParseTypeParameter(parseModifiers) {
    const node = this.startNode();
    parseModifiers(node);
    node.name = this.tsParseTypeParameterName();
    node.constraint = this.tsEatThenParseType(81);
    node.default = this.tsEatThenParseType(29);
    return this.finishNode(node, "TSTypeParameter");
  }
  tsTryParseTypeParameters(parseModifiers) {
    if (this.match(47)) return this.tsParseTypeParameters(parseModifiers);
  }
  tsParseTypeParameters(parseModifiers) {
    const node = this.startNode();
    this.match(47) || this.match(140) ? this.next() : this.unexpected();

    const refTrailingCommaPos = { value: -1 };
    node.params = this.tsParseBracketedList(
      "TypeParametersOrArguments",
      this.tsParseTypeParameter.bind(this, parseModifiers),
      false,
      true,
      refTrailingCommaPos
    );
    node.params.length > 0 || this.raise(TSErrors.EmptyTypeParameters, { at: node });

    refTrailingCommaPos.value === -1 || this.addExtra(node, "trailingComma", refTrailingCommaPos.value);

    return this.finishNode(node, "TSTypeParameterDeclaration");
  }
  tsFillSignature(returnToken, signature) {
    const returnTokenRequired = returnToken === 19,
      paramsKey = "parameters",
      returnTypeKey = "typeAnnotation";
    signature.typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    this.expect(10);
    signature[paramsKey] = this.tsParseBindingListForSignature();
    if (returnTokenRequired) signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
    else if (this.match(returnToken))
      signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
  }
  tsParseBindingListForSignature() {
    const list = super.parseBindingList(11, 41, ParseBindingListFlags.IS_FUNCTION_PARAMS);
    for (const pattern of list) {
      const { type } = pattern;
      if (type === "AssignmentPattern" || type === "TSParameterProperty")
        this.raise(TSErrors.UnsupportedSignatureParameterKind, { at: pattern, type });
    }
    return list;
  }
  tsParseTypeMemberSemicolon() {
    this.eat(12) || this.isLineTerminator() || this.expect(13);
  }
  tsParseSignatureMember(kind, node) {
    this.tsFillSignature(14, node);
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, kind);
  }
  tsIsUnambiguouslyIndexSignature() {
    this.next();
    if (tokenIsIdentifier(this.state.type)) {
      this.next();
      return this.match(14);
    }
    return false;
  }
  tsTryParseIndexSignature(node) {
    if (!this.match(0) || !this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this))) return;

    this.expect(0);
    const id = this.parseIdentifier();
    id.typeAnnotation = this.tsParseTypeAnnotation();
    this.resetEndLocation(id);
    this.expect(3);
    node.parameters = [id];
    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, "TSIndexSignature");
  }
  tsParsePropertyOrMethodSignature(node, readonly) {
    if (this.eat(17)) node.optional = true;
    const nodeAny = node;
    if (this.match(10) || this.match(47)) {
      readonly && this.raise(TSErrors.ReadonlyForMethodSignature, { at: node });

      const method = nodeAny;
      method.kind && this.match(47) &&
        this.raise(TSErrors.AccesorCannotHaveTypeParameters, { at: this.state.curPosition() });

      this.tsFillSignature(14, method);
      this.tsParseTypeMemberSemicolon();
      const paramsKey = "parameters",
        returnTypeKey = "typeAnnotation";
      if (method.kind === "get") {
        if (method[paramsKey].length > 0) {
          this.raise(Errors.BadGetterArity, { at: this.state.curPosition() });
          this.isThisParam(method[paramsKey][0]) &&
            this.raise(TSErrors.AccesorCannotDeclareThisParameter, { at: this.state.curPosition() });
        }
      } else if (method.kind === "set") {
        if (method[paramsKey].length !== 1) this.raise(Errors.BadSetterArity, { at: this.state.curPosition() });
        else {
          const firstParameter = method[paramsKey][0];
          this.isThisParam(firstParameter) &&
            this.raise(TSErrors.AccesorCannotDeclareThisParameter, { at: this.state.curPosition() });

          firstParameter.type === "Identifier" && firstParameter.optional &&
            this.raise(TSErrors.SetAccesorCannotHaveOptionalParameter, { at: this.state.curPosition() });

          firstParameter.type !== "RestElement" ||
            this.raise(TSErrors.SetAccesorCannotHaveRestParameter, { at: this.state.curPosition() });
        }
        method[returnTypeKey] && this.raise(TSErrors.SetAccesorCannotHaveReturnType, { at: method[returnTypeKey] });
      } else method.kind = "method";

      return this.finishNode(method, "TSMethodSignature");
    }
    //{
    const property = nodeAny;
    if (readonly) property.readonly = true;
    const type = this.tsTryParseTypeAnnotation();
    if (type) property.typeAnnotation = type;
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(property, "TSPropertySignature");
    //}
  }
  tsParseTypeMember() {
    const node = this.startNode();
    if (this.match(10) || this.match(47)) return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);

    if (this.match(77)) {
      const id = this.startNode();
      this.next();
      if (this.match(10) || this.match(47))
        return this.tsParseSignatureMember("TSConstructSignatureDeclaration", node);

      node.key = this.createIdentifier(id, "new");
      return this.tsParsePropertyOrMethodSignature(node, false);
    }
    this.tsParseModifiers({
      allowedModifiers: ["readonly"],
      disallowedModifiers: ["declare", "abstract", "private", "protected", "public", "static", "override"]
    }, node);
    const idx = this.tsTryParseIndexSignature(node);
    if (idx) return idx;

    super.parsePropertyName(node);
    if (
      !node.computed &&
      node.key.type === "Identifier" &&
      (node.key.name === "get" || node.key.name === "set") &&
      this.tsTokenCanFollowModifier()
    ) {
      node.kind = node.key.name;
      super.parsePropertyName(node);
    }
    return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
  }
  tsParseTypeLiteral() {
    const node = this.startNode();
    node.members = this.tsParseObjectTypeMembers();
    return this.finishNode(node, "TSTypeLiteral");
  }
  tsParseObjectTypeMembers() {
    this.expect(5);
    const members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
    this.expect(8);
    return members;
  }
  tsIsStartOfMappedType() {
    this.next();
    if (this.eat(53)) return this.isContextual(120);

    this.isContextual(120) && this.next();
    if (!this.match(0)) return false;

    this.next();
    if (!this.tsIsIdentifier()) return false;

    this.next();
    return this.match(58);
  }
  tsParseMappedTypeParameter() {
    const node = this.startNode();
    node.name = this.tsParseTypeParameterName();
    node.constraint = this.tsExpectThenParseType(58);
    return this.finishNode(node, "TSTypeParameter");
  }
  tsParseMappedType() {
    const node = this.startNode();
    this.expect(5);
    if (this.match(53)) {
      node.readonly = this.state.value;
      this.next();
      this.expectContextual(120);
    } else if (this.eatContextual(120)) node.readonly = true;

    this.expect(0);
    node.typeParameter = this.tsParseMappedTypeParameter();
    node.nameType = this.eatContextual(93) ? this.tsParseType() : null;
    this.expect(3);
    if (this.match(53)) {
      node.optional = this.state.value;
      this.next();
      this.expect(17);
    } else if (this.eat(17)) node.optional = true;

    node.typeAnnotation = this.tsTryParseType();
    this.semicolon();
    this.expect(8);
    return this.finishNode(node, "TSMappedType");
  }
  tsParseTupleType() {
    const node = this.startNode();
    node.elementTypes = this.tsParseBracketedList(
      "TupleElementTypes",
      this.tsParseTupleElementType.bind(this),
      true,
      false
    );
    let seenOptionalElement = false,
      labeledElements = null;
    node.elementTypes.forEach(elementNode => {
      const { type } = elementNode;

      !seenOptionalElement ||
        type === "TSRestType" ||
        type === "TSOptionalType" ||
        (type === "TSNamedTupleMember" && elementNode.optional) ||
        this.raise(TSErrors.OptionalTypeBeforeRequired, { at: elementNode });

      seenOptionalElement ||
        (seenOptionalElement = (type === "TSNamedTupleMember" && elementNode.optional) || type === "TSOptionalType");
      let checkType = type;
      if (type === "TSRestType") checkType = (elementNode = elementNode.typeAnnotation).type;

      const isLabeled = checkType === "TSNamedTupleMember";
      labeledElements != null || (labeledElements = isLabeled);
      labeledElements === isLabeled || this.raise(TSErrors.MixedLabeledAndUnlabeledElements, { at: elementNode });
    });
    return this.finishNode(node, "TSTupleType");
  }
  tsParseTupleElementType() {
    const { startLoc } = this.state,
      rest = this.eat(21);
    let labeled, label, optional, type;
    const chAfterWord = tokenIsKeywordOrIdentifier(this.state.type) ? this.lookaheadCharCode() : null;
    if (chAfterWord === 58) {
      labeled = true;
      optional = false;
      label = this.parseIdentifier(true);
      this.expect(14);
      type = this.tsParseType();
    } else if (chAfterWord === 63) {
      optional = true;
      const startLoc = this.state.startLoc,
        wordName = this.state.value,
        typeOrLabel = this.tsParseNonArrayType();
      if (this.lookaheadCharCode() === 58) {
        labeled = true;
        label = this.createIdentifier(this.startNodeAt(startLoc), wordName);
        this.expect(17);
        this.expect(14);
        type = this.tsParseType();
      } else {
        labeled = false;
        type = typeOrLabel;
        this.expect(17);
      }
    } else {
      type = this.tsParseType();
      optional = this.eat(17);
      labeled = this.eat(14);
    }
    if (labeled) {
      let labeledNode;
      if (label) {
        labeledNode = this.startNodeAtNode(label);
        labeledNode.optional = optional;
        labeledNode.label = label;
        labeledNode.elementType = type;
        if (this.eat(17)) {
          labeledNode.optional = true;
          this.raise(TSErrors.TupleOptionalAfterType, { at: this.state.lastTokStartLoc });
        }
      } else {
        labeledNode = this.startNodeAtNode(type);
        labeledNode.optional = optional;
        this.raise(TSErrors.InvalidTupleMemberLabel, { at: type });
        labeledNode.label = type;
        labeledNode.elementType = this.tsParseType();
      }
      type = this.finishNode(labeledNode, "TSNamedTupleMember");
    } else if (optional) {
      const optionalTypeNode = this.startNodeAtNode(type);
      optionalTypeNode.typeAnnotation = type;
      type = this.finishNode(optionalTypeNode, "TSOptionalType");
    }
    if (rest) {
      const restNode = this.startNodeAt(startLoc);
      restNode.typeAnnotation = type;
      type = this.finishNode(restNode, "TSRestType");
    }
    return type;
  }
  tsParseParenthesizedType() {
    const node = this.startNode();
    this.expect(10);
    node.typeAnnotation = this.tsParseType();
    this.expect(11);
    return this.finishNode(node, "TSParenthesizedType");
  }
  tsParseFunctionOrConstructorType(type, abstract) {
    const node = this.startNode();
    if (type === "TSConstructorType") {
      node.abstract = !!abstract;
      abstract && this.next();
      this.next();
    }
    this.tsInAllowConditionalTypesContext(() => this.tsFillSignature(19, node));
    return this.finishNode(node, type);
  }
  tsParseLiteralTypeNode() {
    const node = this.startNode();
    switch (this.state.type) {
      case 132:
      case 133:
      case 131:
      case 85:
      case 86:
        node.literal = super.parseExprAtom();
        break;
      default:
        this.unexpected();
    }
    return this.finishNode(node, "TSLiteralType");
  }
  tsParseTemplateLiteralType() {
    const node = this.startNode();
    node.literal = super.parseTemplate(false);
    return this.finishNode(node, "TSLiteralType");
  }
  parseTemplateSubstitution() {
    return this.state.inType ? this.tsParseType() : super.parseTemplateSubstitution();
  }
  tsParseThisTypeOrThisTypePredicate() {
    const thisKeyword = this.tsParseThisTypeNode();
    return this.isContextual(114) && !this.hasPrecedingLineBreak()
      ? this.tsParseThisTypePredicate(thisKeyword)
      : thisKeyword;
  }
  tsParseNonArrayType() {
    switch (this.state.type) {
      case 131:
      case 132:
      case 133:
      case 85:
      case 86:
        return this.tsParseLiteralTypeNode();
      case 53:
        if (this.state.value === "-") {
          const node = this.startNode(),
            nextToken = this.lookahead();
          nextToken.type === 132 || nextToken.type === 133 || this.unexpected();

          node.literal = this.parseMaybeUnary();
          return this.finishNode(node, "TSLiteralType");
        }
        break;
      case 78:
        return this.tsParseThisTypeOrThisTypePredicate();
      case 87:
        return this.tsParseTypeQuery();
      case 83:
        return this.tsParseImportType();
      case 5:
        return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this))
          ? this.tsParseMappedType()
          : this.tsParseTypeLiteral();
      case 0:
        return this.tsParseTupleType();
      case 10:
        return this.tsParseParenthesizedType();
      case 25:
      case 24:
        return this.tsParseTemplateLiteralType();
      default: {
        const { type } = this.state;
        if (tokenIsIdentifier(type) || type === 88 || type === 84) {
          const nodeType =
            type === 88 ? "TSVoidKeyword" : type === 84 ? "TSNullKeyword" : keywordTypeFromName(this.state.value);
          if (nodeType !== void 0 && this.lookaheadCharCode() !== 46) {
            const node = this.startNode();
            this.next();
            return this.finishNode(node, nodeType);
          }
          return this.tsParseTypeReference();
        }
      }
    }
    this.unexpected();
  }
  tsParseArrayTypeOrHigher() {
    let type = this.tsParseNonArrayType();
    while (!this.hasPrecedingLineBreak() && this.eat(0))
      if (this.match(3)) {
        const node = this.startNodeAtNode(type);
        node.elementType = type;
        this.expect(3);
        type = this.finishNode(node, "TSArrayType");
      } else {
        const node = this.startNodeAtNode(type);
        node.objectType = type;
        node.indexType = this.tsParseType();
        this.expect(3);
        type = this.finishNode(node, "TSIndexedAccessType");
      }

    return type;
  }
  tsParseTypeOperator() {
    const node = this.startNode(),
      operator = this.state.value;
    this.next();
    node.operator = operator;
    node.typeAnnotation = this.tsParseTypeOperatorOrHigher();
    operator !== "readonly" || this.tsCheckTypeAnnotationForReadOnly(node);

    return this.finishNode(node, "TSTypeOperator");
  }
  tsCheckTypeAnnotationForReadOnly(node) {
    switch (node.typeAnnotation.type) {
      case "TSTupleType":
      case "TSArrayType":
        return;
      default:
        this.raise(TSErrors.UnexpectedReadonly, { at: node });
    }
  }
  tsParseInferType() {
    const node = this.startNode();
    this.expectContextual(113);
    const typeParameter = this.startNode();
    typeParameter.name = this.tsParseTypeParameterName();
    typeParameter.constraint = this.tsTryParse(() => this.tsParseConstraintForInferType());
    node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
    return this.finishNode(node, "TSInferType");
  }
  tsParseConstraintForInferType() {
    if (this.eat(81)) {
      const constraint = this.tsInDisallowConditionalTypesContext(() => this.tsParseType());
      if (this.state.inDisallowConditionalTypesContext || !this.match(17)) return constraint;
    }
  }
  tsParseTypeOperatorOrHigher() {
    return tokenIsTSTypeOperator(this.state.type) && !this.state.containsEsc
      ? this.tsParseTypeOperator()
      : this.isContextual(113)
      ? this.tsParseInferType()
      : this.tsInAllowConditionalTypesContext(() => this.tsParseArrayTypeOrHigher());
  }
  tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
    const node = this.startNode(),
      hasLeadingOperator = this.eat(operator),
      types = [];
    do {
      types.push(parseConstituentType());
    } while (this.eat(operator));
    if (types.length === 1 && !hasLeadingOperator) return types[0];

    node.types = types;
    return this.finishNode(node, kind);
  }
  tsParseIntersectionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), 45);
  }
  tsParseUnionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), 43);
  }
  tsIsStartOfFunctionType() {
    return (
      !!this.match(47) || (this.match(10) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this)))
    );
  }
  tsSkipParameterStart() {
    if (tokenIsIdentifier(this.state.type) || this.match(78)) {
      this.next();
      return true;
    }
    if (this.match(5)) {
      const { errors } = this.state,
        previousErrorCount = errors.length;
      try {
        this.parseObjectLike(8, true);
        return errors.length === previousErrorCount;
      } catch (_unused) {
        return false;
      }
    }
    if (this.match(0)) {
      this.next();
      const { errors } = this.state,
        previousErrorCount = errors.length;
      try {
        super.parseBindingList(3, 93, ParseBindingListFlags.ALLOW_EMPTY);
        return errors.length === previousErrorCount;
      } catch (_unused2) {
        return false;
      }
    }
    return false;
  }
  tsIsUnambiguouslyStartOfFunctionType() {
    this.next();
    if (this.match(11) || this.match(21)) return true;

    if (this.tsSkipParameterStart()) {
      if (this.match(14) || this.match(12) || this.match(17) || this.match(29)) return true;

      if (this.match(11)) {
        this.next();
        if (this.match(19)) return true;
      }
    }
    return false;
  }
  tsParseTypeOrTypePredicateAnnotation(returnToken) {
    return this.tsInType(() => {
      const t = this.startNode();
      this.expect(returnToken);
      const node = this.startNode(),
        asserts = !!this.tsTryParse(this.tsParseTypePredicateAsserts.bind(this));
      if (asserts && this.match(78)) {
        let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
        if (thisTypePredicate.type === "TSThisType") {
          node.parameterName = thisTypePredicate;
          node.asserts = true;
          node.typeAnnotation = null;
          thisTypePredicate = this.finishNode(node, "TSTypePredicate");
        } else {
          this.resetStartLocationFromNode(thisTypePredicate, node);
          thisTypePredicate.asserts = true;
        }
        t.typeAnnotation = thisTypePredicate;
        return this.finishNode(t, "TSTypeAnnotation");
      }
      const typePredicateVariable =
        this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
      if (!typePredicateVariable) {
        if (!asserts) return this.tsParseTypeAnnotation(false, t);

        node.parameterName = this.parseIdentifier();
        node.asserts = asserts;
        node.typeAnnotation = null;
        t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
        return this.finishNode(t, "TSTypeAnnotation");
      }
      const type = this.tsParseTypeAnnotation(false);
      node.parameterName = typePredicateVariable;
      node.typeAnnotation = type;
      node.asserts = asserts;
      t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
      return this.finishNode(t, "TSTypeAnnotation");
    });
  }
  tsTryParseTypeOrTypePredicateAnnotation() {
    if (this.match(14)) return this.tsParseTypeOrTypePredicateAnnotation(14);
  }
  tsTryParseTypeAnnotation() {
    if (this.match(14)) return this.tsParseTypeAnnotation();
  }
  tsTryParseType() {
    return this.tsEatThenParseType(14);
  }
  tsParseTypePredicatePrefix() {
    const id = this.parseIdentifier();
    if (this.isContextual(114) && !this.hasPrecedingLineBreak()) {
      this.next();
      return id;
    }
  }
  tsParseTypePredicateAsserts() {
    if (this.state.type !== 107) return false;

    const containsEsc = this.state.containsEsc;
    this.next();
    if (!tokenIsIdentifier(this.state.type) && !this.match(78)) return false;

    containsEsc &&
      this.raise(Errors.InvalidEscapedReservedWord, { at: this.state.lastTokStartLoc, reservedWord: "asserts" });

    return true;
  }
  tsParseTypeAnnotation(eatColon = true, t = this.startNode()) {
    this.tsInType(() => {
      eatColon && this.expect(14);
      t.typeAnnotation = this.tsParseType();
    });
    return this.finishNode(t, "TSTypeAnnotation");
  }
  tsParseType() {
    assert(this.state.inType);
    const type = this.tsParseNonConditionalType();
    if (this.state.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(81)) return type;

    const node = this.startNodeAtNode(type);
    node.checkType = type;
    node.extendsType = this.tsInDisallowConditionalTypesContext(() => this.tsParseNonConditionalType());
    this.expect(17);
    node.trueType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    this.expect(14);
    node.falseType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    return this.finishNode(node, "TSConditionalType");
  }
  isAbstractConstructorSignature() {
    return this.isContextual(122) && this.lookahead().type === 77;
  }
  tsParseNonConditionalType() {
    return this.tsIsStartOfFunctionType()
      ? this.tsParseFunctionOrConstructorType("TSFunctionType")
      : this.match(77)
      ? this.tsParseFunctionOrConstructorType("TSConstructorType")
      : this.isAbstractConstructorSignature()
      ? this.tsParseFunctionOrConstructorType("TSConstructorType", true)
      : this.tsParseUnionTypeOrHigher();
  }
  tsParseTypeAssertion() {
    this.getPluginOption("typescript", "disallowAmbiguousJSXLike") &&
      this.raise(TSErrors.ReservedTypeAssertion, { at: this.state.startLoc });

    const node = this.startNode();
    node.typeAnnotation = this.tsInType(() => {
      this.next();
      return this.match(75) ? this.tsParseTypeReference() : this.tsParseType();
    });
    this.expect(48);
    node.expression = this.parseMaybeUnary();
    return this.finishNode(node, "TSTypeAssertion");
  }
  tsParseHeritageClause(token) {
    const originalStartLoc = this.state.startLoc;
    const delimitedList = this.tsParseDelimitedList("HeritageClauseElement", () => {
      const node = this.startNode();
      node.expression = this.tsParseEntityName();
      if (this.match(47)) node.typeParameters = this.tsParseTypeArguments();

      return this.finishNode(node, "TSExpressionWithTypeArguments");
    });
    delimitedList.length || this.raise(TSErrors.EmptyHeritageClauseType, { at: originalStartLoc, token });

    return delimitedList;
  }
  tsParseInterfaceDeclaration(node, properties = {}) {
    if (this.hasFollowingLineBreak()) return null;
    this.expectContextual(127);
    if (properties.declare) node.declare = true;
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      this.checkIdentifier(node.id, BindingFlag.TYPE_TS_INTERFACE);
    } else {
      node.id = null;
      this.raise(TSErrors.MissingInterfaceName, { at: this.state.startLoc });
    }
    node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (this.eat(81)) node.extends = this.tsParseHeritageClause("extends");

    const body = this.startNode();
    body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
    node.body = this.finishNode(body, "TSInterfaceBody");
    return this.finishNode(node, "TSInterfaceDeclaration");
  }
  tsParseTypeAliasDeclaration(node) {
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, BindingFlag.TYPE_TS_TYPE);
    node.typeAnnotation = this.tsInType(() => {
      node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers);
      this.expect(29);
      if (this.isContextual(112) && this.lookahead().type !== 16) {
        const node = this.startNode();
        this.next();
        return this.finishNode(node, "TSIntrinsicKeyword");
      }
      return this.tsParseType();
    });
    this.semicolon();
    return this.finishNode(node, "TSTypeAliasDeclaration");
  }
  tsInNoContext(cb) {
    const oldContext = this.state.context;
    this.state.context = [oldContext[0]];
    try {
      return cb();
    } finally {
      this.state.context = oldContext;
    }
  }
  tsInType(cb) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    try {
      return cb();
    } finally {
      this.state.inType = oldInType;
    }
  }
  tsInDisallowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = true;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsInAllowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = false;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsEatThenParseType(token) {
    if (this.match(token)) return this.tsNextThenParseType();
  }
  tsExpectThenParseType(token) {
    return this.tsInType(() => {
      this.expect(token);
      return this.tsParseType();
    });
  }
  tsNextThenParseType() {
    return this.tsInType(() => {
      this.next();
      return this.tsParseType();
    });
  }
  tsParseEnumMember() {
    const node = this.startNode();
    node.id = this.match(131) ? super.parseStringLiteral(this.state.value) : this.parseIdentifier(true);
    if (this.eat(29)) node.initializer = super.parseMaybeAssignAllowIn();

    return this.finishNode(node, "TSEnumMember");
  }
  tsParseEnumDeclaration(node, properties = {}) {
    if (properties.const) node.const = true;
    if (properties.declare) node.declare = true;
    this.expectContextual(124);
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, node.const ? BindingFlag.TYPE_TS_CONST_ENUM : BindingFlag.TYPE_TS_ENUM);
    this.expect(5);
    node.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this));
    this.expect(8);
    return this.finishNode(node, "TSEnumDeclaration");
  }
  tsParseModuleBlock() {
    const node = this.startNode();
    this.scope.enter(ScopeFlag.OTHER);
    this.expect(5);
    super.parseBlockOrModuleBlockBody((node.body = []), void 0, true, 8);
    this.scope.exit();
    return this.finishNode(node, "TSModuleBlock");
  }
  tsParseModuleOrNamespaceDeclaration(node, nested = false) {
    node.id = this.parseIdentifier();
    nested || this.checkIdentifier(node.id, BindingFlag.TYPE_TS_NAMESPACE);

    if (this.eat(16)) {
      const inner = this.startNode();
      this.tsParseModuleOrNamespaceDeclaration(inner, true);
      node.body = inner;
    } else {
      this.scope.enter(ScopeFlag.TS_MODULE);
      this.prodParam.enter(PARAM);
      node.body = this.tsParseModuleBlock();
      this.prodParam.exit();
      this.scope.exit();
    }
    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseAmbientExternalModuleDeclaration(node) {
    if (this.isContextual(110)) {
      node.global = true;
      node.id = this.parseIdentifier();
    } else this.match(131) ? (node.id = super.parseStringLiteral(this.state.value)) : this.unexpected();

    if (this.match(5)) {
      this.scope.enter(ScopeFlag.TS_MODULE);
      this.prodParam.enter(PARAM);
      node.body = this.tsParseModuleBlock();
      this.prodParam.exit();
      this.scope.exit();
    } else this.semicolon();

    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier, isExport) {
    node.isExport = isExport || false;
    node.id = maybeDefaultIdentifier || this.parseIdentifier();
    this.checkIdentifier(node.id, BindingFlag.TYPE_TS_VALUE_IMPORT);
    this.expect(29);
    const moduleReference = this.tsParseModuleReference();
    node.importKind !== "type" || moduleReference.type === "TSExternalModuleReference" ||
      this.raise(TSErrors.ImportAliasHasImportType, { at: moduleReference });

    node.moduleReference = moduleReference;
    this.semicolon();
    return this.finishNode(node, "TSImportEqualsDeclaration");
  }
  tsIsExternalModuleReference() {
    return this.isContextual(117) && this.lookaheadCharCode() === 40;
  }
  tsParseModuleReference() {
    return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(false);
  }
  tsParseExternalModuleReference() {
    const node = this.startNode();
    this.expectContextual(117);
    this.expect(10);
    this.match(131) || this.unexpected();

    node.expression = super.parseExprAtom();
    this.expect(11);
    this.sawUnambiguousESM = true;
    return this.finishNode(node, "TSExternalModuleReference");
  }
  tsLookAhead(f) {
    // noinspection UnnecessaryLocalVariableJS
    const state = this.state.clone(),
      res = f();
    this.state = state;
    return res;
  }
  tsTryParseAndCatch(f) {
    const result = this.tryParse(abort => f() || abort());
    if (result.aborted || !result.node) return;
    if (result.error) this.state = result.failState;
    return result.node;
  }
  tsTryParse(f) {
    const state = this.state.clone(),
      result = f();
    if (result !== void 0 && result !== false) return result;

    this.state = state;
  }
  tsTryParseDeclare(nany) {
    if (this.isLineTerminator()) return;

    let kind,
      startType = this.state.type;
    if (this.isContextual(99)) {
      startType = 74;
      kind = "let";
    }
    return this.tsInAmbientContext(() => {
      switch (startType) {
        case 68:
          nany.declare = true;
          return super.parseFunctionStatement(nany, false, false);
        case 80:
          nany.declare = true;
          return this.parseClass(nany, true, false);
        case 124:
          return this.tsParseEnumDeclaration(nany, { declare: true });
        case 110:
          return this.tsParseAmbientExternalModuleDeclaration(nany);
        case 75:
        case 74:
          if (!this.match(75) || !this.isLookaheadContextual("enum")) {
            nany.declare = true;
            return this.parseVarStatement(nany, kind || this.state.value, true);
          }
          this.expect(75);
          return this.tsParseEnumDeclaration(nany, { const: true, declare: true });
        case 127: {
          const result = this.tsParseInterfaceDeclaration(nany, { declare: true });
          if (result) return result;
        }
        default:
          if (tokenIsIdentifier(startType)) return this.tsParseDeclaration(nany, this.state.value, true, null);
      }
    });
  }
  tsTryParseExportDeclaration() {
    return this.tsParseDeclaration(this.startNode(), this.state.value, true, null);
  }
  tsParseExpressionStatement(node, expr, decorators) {
    switch (expr.name) {
      case "declare": {
        const declaration = this.tsTryParseDeclare(node);
        if (declaration) declaration.declare = true;

        return declaration;
      }
      case "global":
        if (this.match(5)) {
          this.scope.enter(ScopeFlag.TS_MODULE);
          this.prodParam.enter(PARAM);
          const mod = node;
          mod.global = true;
          mod.id = expr;
          mod.body = this.tsParseModuleBlock();
          this.scope.exit();
          this.prodParam.exit();
          return this.finishNode(mod, "TSModuleDeclaration");
        }
        break;
      default:
        return this.tsParseDeclaration(node, expr.name, false, decorators);
    }
  }
  tsParseDeclaration(node, value, next, decorators) {
    switch (value) {
      case "abstract":
        if (this.tsCheckLineTerminator(next) && (this.match(80) || tokenIsIdentifier(this.state.type)))
          return this.tsParseAbstractDeclaration(node, decorators);

        break;
      case "module":
        if (this.tsCheckLineTerminator(next)) {
          if (this.match(131)) return this.tsParseAmbientExternalModuleDeclaration(node);

          if (tokenIsIdentifier(this.state.type)) return this.tsParseModuleOrNamespaceDeclaration(node);
        }
        break;
      case "namespace":
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type))
          return this.tsParseModuleOrNamespaceDeclaration(node);

        break;
      case "type":
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type))
          return this.tsParseTypeAliasDeclaration(node);

        break;
    }
  }
  tsCheckLineTerminator(next) {
    if (next) {
      if (this.hasFollowingLineBreak()) return false;
      this.next();
      return true;
    }
    return !this.isLineTerminator();
  }
  tsTryParseGenericAsyncArrowFunction(startLoc) {
    if (!this.match(47)) return;
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    this.state.maybeInArrowParameters = true;
    const res = this.tsTryParseAndCatch(() => {
      const node = this.startNodeAt(startLoc);
      node.typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      super.parseFunctionParams(node);
      node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
      this.expect(19);
      return node;
    });
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return res ? super.parseArrowExpression(res, null, true) : void 0;
  }
  tsParseTypeArgumentsInExpression() {
    if (this.reScan_lt() === 47) return this.tsParseTypeArguments();
  }
  tsParseTypeArguments() {
    const node = this.startNode();
    node.params = this.tsInType(() => this.tsInNoContext(() => {
      this.expect(47);
      return this.tsParseDelimitedList("TypeParametersOrArguments", this.tsParseType.bind(this));
    }));
    node.params.length === 0
      ? this.raise(TSErrors.EmptyTypeArguments, { at: node })
      : this.state.inType || this.curContext() !== types.brace || this.reScan_lt_gt();

    this.expect(48);
    return this.finishNode(node, "TSTypeParameterInstantiation");
  }
  tsIsDeclarationStart() {
    return tokenIsTSDeclarationStart(this.state.type);
  }
  isExportDefaultSpecifier() {
    return !this.tsIsDeclarationStart() && super.isExportDefaultSpecifier();
  }
  parseAssignableListItem(flags, decorators) {
    const startLoc = this.state.startLoc,
      modified = {};
    this.tsParseModifiers({ allowedModifiers: ["public", "private", "protected", "override", "readonly"] }, modified);
    const accessibility = modified.accessibility,
      override = modified.override,
      readonly = modified.readonly;
    flags & ParseBindingListFlags.IS_CONSTRUCTOR_PARAMS || !(accessibility || readonly || override) ||
      this.raise(TSErrors.UnexpectedParameterModifier, { at: startLoc });

    const left = this.parseMaybeDefault();
    this.parseAssignableListItemTypes(left, flags);
    const elt = this.parseMaybeDefault(left.loc.start, left);
    if (accessibility || readonly || override) {
      const pp = this.startNodeAt(startLoc);
      if (decorators.length) pp.decorators = decorators;

      if (accessibility) pp.accessibility = accessibility;
      if (readonly) pp.readonly = readonly;
      if (override) pp.override = override;
      elt.type === "Identifier" || elt.type === "AssignmentPattern" ||
        this.raise(TSErrors.UnsupportedParameterPropertyKind, { at: pp });

      pp.parameter = elt;
      return this.finishNode(pp, "TSParameterProperty");
    }
    if (decorators.length) left.decorators = decorators;

    return elt;
  }
  isSimpleParameter(node) {
    return (
      (node.type === "TSParameterProperty" && super.isSimpleParameter(node.parameter)) ||
      super.isSimpleParameter(node)
    );
  }
  tsDisallowOptionalPattern(node) {
    for (const param of node.params)
      param.type === "Identifier" || !param.optional || this.state.isAmbientContext ||
        this.raise(TSErrors.PatternIsOptional, { at: param });
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    super.setArrowFunctionParameters(node, params, trailingCommaLoc);
    this.tsDisallowOptionalPattern(node);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(14)) node.returnType = this.tsParseTypeOrTypePredicateAnnotation(14);

    const bodilessType = type === "FunctionDeclaration"
      ? "TSDeclareFunction"
      : type === "ClassMethod" || type === "ClassPrivateMethod"
      ? "TSDeclareMethod"
      : void 0;
    if (bodilessType && !this.match(5) && this.isLineTerminator()) return this.finishNode(node, bodilessType);

    if (bodilessType === "TSDeclareFunction" && this.state.isAmbientContext) {
      this.raise(TSErrors.DeclareFunctionHasImplementation, { at: node });
      if (node.declare) return super.parseFunctionBodyAndFinish(node, bodilessType, isMethod);
    }
    this.tsDisallowOptionalPattern(node);
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  registerFunctionStatementId(node) {
    !node.body && node.id
      ? this.checkIdentifier(node.id, BindingFlag.TYPE_TS_AMBIENT)
      : super.registerFunctionStatementId(node);
  }
  tsCheckForInvalidTypeCasts(items) {
    items.forEach(node => {
      (node == null ? void 0 : node.type) !== "TSTypeCastExpression" ||
        this.raise(TSErrors.UnexpectedTypeAnnotation, { at: node.typeAnnotation });
    });
  }
  toReferencedList(exprList, _isInParens) {
    this.tsCheckForInvalidTypeCasts(exprList);
    return exprList;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    const node = super.parseArrayLike(close, canBePattern, isTuple, refExpressionErrors);
    node.type !== "ArrayExpression" || this.tsCheckForInvalidTypeCasts(node.elements);

    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    if (!this.hasPrecedingLineBreak() && this.match(35)) {
      this.state.canStartJSXElement = false;
      this.next();
      const nonNullExpression = this.startNodeAt(startLoc);
      nonNullExpression.expression = base;
      return this.finishNode(nonNullExpression, "TSNonNullExpression");
    }
    let isOptionalCall = false;
    if (this.match(18) && this.lookaheadCharCode() === 60) {
      if (noCalls) {
        state.stop = true;
        return base;
      }
      state.optionalChainMember = isOptionalCall = true;
      this.next();
    }
    if (this.match(47) || this.match(51)) {
      let missingParenErrorLoc;
      const result = this.tsTryParseAndCatch(() => {
        if (!noCalls && this.atPossibleAsyncArrow(base)) {
          const asyncArrowFn = this.tsTryParseGenericAsyncArrowFunction(startLoc);
          if (asyncArrowFn) return asyncArrowFn;
        }
        const typeArguments = this.tsParseTypeArgumentsInExpression();
        if (!typeArguments) return;
        if (isOptionalCall && !this.match(10)) {
          missingParenErrorLoc = this.state.curPosition();
          return;
        }
        if (tokenIsTemplate(this.state.type)) {
          const result = super.parseTaggedTemplateExpression(base, startLoc, state);
          result.typeParameters = typeArguments;
          return result;
        }
        if (!noCalls && this.eat(10)) {
          const node = this.startNodeAt(startLoc);
          node.callee = base;
          // noinspection JSAnnotator
          this.tsCheckForInvalidTypeCasts((node.arguments = this.parseCallExpressionArguments(11, false)));
          node.typeParameters = typeArguments;
          if (state.optionalChainMember) node.optional = isOptionalCall;

          return this.finishCallExpression(node, state.optionalChainMember);
        }
        const tokenType = this.state.type;
        if (
          tokenType === 48 ||
          tokenType === 52 ||
          (tokenType !== 10 && tokenCanStartExpression(tokenType) && !this.hasPrecedingLineBreak())
        )
          return;

        const node = this.startNodeAt(startLoc);
        node.expression = base;
        node.typeParameters = typeArguments;
        return this.finishNode(node, "TSInstantiationExpression");
      });
      missingParenErrorLoc && this.unexpected(missingParenErrorLoc, 10);

      if (result) {
        result.type === "TSInstantiationExpression" &&
          (this.match(16) || (this.match(18) && this.lookaheadCharCode() !== 40)) &&
          this.raise(TSErrors.InvalidPropertyAccessAfterInstantiationExpression, { at: this.state.startLoc });

        return result;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, state);
  }
  parseNewCallee(node) {
    var _callee$extra;
    super.parseNewCallee(node);
    const { callee } = node;
    if (
      callee.type === "TSInstantiationExpression" &&
      ((_callee$extra = callee.extra) == null || !_callee$extra.parenthesized)
    ) {
      node.typeParameters = callee.typeParameters;
      node.callee = callee.expression;
    }
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    let isSatisfies;
    if (
      tokenOperatorPrecedence(58) > minPrec &&
      !this.hasPrecedingLineBreak() &&
      (this.isContextual(93) || (isSatisfies = this.isContextual(118)))
    ) {
      const node = this.startNodeAt(leftStartLoc);
      node.expression = left;
      node.typeAnnotation = this.tsInType(() => {
        this.next();
        if (this.match(75)) {
          isSatisfies && this.raise(Errors.UnexpectedKeyword, { at: this.state.startLoc, keyword: "const" });

          return this.tsParseTypeReference();
        }
        return this.tsParseType();
      });
      this.finishNode(node, isSatisfies ? "TSSatisfiesExpression" : "TSAsExpression");
      this.reScan_lt_gt();
      return this.parseExprOp(node, leftStartLoc, minPrec);
    }
    return super.parseExprOp(left, leftStartLoc, minPrec);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    this.state.isAmbientContext || super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
  }
  checkImportReflection(node) {
    super.checkImportReflection(node);
    node.module && node.importKind !== "value" &&
      this.raise(TSErrors.ImportReflectionHasImportType, { at: node.specifiers[0].loc.start });
  }
  checkDuplicateExports() {}
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(128)) {
      const ch = this.lookaheadCharCode();
      return isExport ? ch === 123 || ch === 42 : ch !== 61;
    }
    return !isExport && this.isContextual(87);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    isExport
      ? (node.exportKind = phase === "type" ? "type" : "value")
      : (node.importKind = phase === "type" || phase === "typeof" ? phase : "value");
  }
  parseImport(node) {
    if (this.match(131)) {
      node.importKind = "value";
      return super.parseImport(node);
    }
    let importNode;
    if (tokenIsIdentifier(this.state.type) && this.lookaheadCharCode() === 61) {
      node.importKind = "value";
      return this.tsParseImportEqualsDeclaration(node);
    }
    if (this.isContextual(128)) {
      const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, false);
      if (this.lookaheadCharCode() === 61) return this.tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier);

      importNode = super.parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier);
    } else importNode = super.parseImport(node);

    importNode.importKind === "type" &&
      importNode.specifiers.length > 1 &&
      importNode.specifiers[0].type === "ImportDefaultSpecifier" &&
      this.raise(TSErrors.TypeImportCannotSpecifyDefaultAndNamed, { at: importNode });

    return importNode;
  }
  parseExport(node, decorators) {
    if (this.match(83)) {
      this.next();
      let maybeDefaultIdentifier = null;
      this.isContextual(128) && this.isPotentialImportPhase(false)
        ? (maybeDefaultIdentifier = this.parseMaybeImportPhase(node, false))
        : (node.importKind = "value");

      return this.tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier, true);
    }
    if (this.eat(29)) {
      const assign = node;
      assign.expression = super.parseExpression();
      this.semicolon();
      this.sawUnambiguousESM = true;
      return this.finishNode(assign, "TSExportAssignment");
    }
    if (this.eatContextual(93)) {
      const decl = node;
      this.expectContextual(126);
      decl.id = this.parseIdentifier();
      this.semicolon();
      return this.finishNode(decl, "TSNamespaceExportDeclaration");
    }

    return super.parseExport(node, decorators);
  }
  isAbstractClass() {
    return this.isContextual(122) && this.lookahead().type === 80;
  }
  parseExportDefaultExpression() {
    if (this.isAbstractClass()) {
      const cls = this.startNode();
      this.next();
      cls.abstract = true;
      return this.parseClass(cls, true, true);
    }
    if (this.match(127)) {
      const result = this.tsParseInterfaceDeclaration(this.startNode());
      if (result) return result;
    }
    return super.parseExportDefaultExpression();
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    const { isAmbientContext } = this.state,
      declaration = super.parseVarStatement(node, kind, allowMissingInitializer || isAmbientContext);
    if (!isAmbientContext) return declaration;
    for (const { id, init } of declaration.declarations)
      if (init)
        kind !== "const" || id.typeAnnotation
          ? this.raise(TSErrors.InitializerNotAllowedInAmbientContext, { at: init })
          : isValidAmbientConstInitializer(init, this.hasPlugin("estree")) ||
            this.raise(TSErrors.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference, { at: init });

    return declaration;
  }
  parseStatementContent(flags, decorators) {
    if (this.match(75) && this.isLookaheadContextual("enum")) {
      const node = this.startNode();
      this.expect(75);
      return this.tsParseEnumDeclaration(node, { const: true });
    }
    if (this.isContextual(124)) return this.tsParseEnumDeclaration(this.startNode());

    if (this.isContextual(127)) {
      const result = this.tsParseInterfaceDeclaration(this.startNode());
      if (result) return result;
    }
    return super.parseStatementContent(flags, decorators);
  }
  parseAccessModifier() {
    return this.tsParseModifier(["public", "protected", "private"]);
  }
  tsHasSomeModifiers(member, modifiers) {
    return modifiers.some(modifier =>
      tsIsAccessModifier(modifier) ? member.accessibility === modifier : !!member[modifier]
    );
  }
  tsIsStartOfStaticBlocks() {
    return this.isContextual(104) && this.lookaheadCharCode() === 123;
  }
  parseClassMember(classBody, member, state) {
    const modifiers = ["declare", "private", "public", "protected", "override", "abstract", "readonly", "static"];
    this.tsParseModifiers({
      allowedModifiers: modifiers,
      disallowedModifiers: ["in", "out"],
      stopOnStartOfClassStaticBlock: true,
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
    }, member);
    const callParseClassMemberWithIsStatic = () => {
      if (this.tsIsStartOfStaticBlocks()) {
        this.next();
        this.next();
        this.tsHasSomeModifiers(member, modifiers) &&
          this.raise(TSErrors.StaticBlockCannotHaveModifier, { at: this.state.curPosition() });

        super.parseClassStaticBlock(classBody, member);
      } else this.parseClassMemberWithIsStatic(classBody, member, state, !!member.static);
    };
    member.declare ? this.tsInAmbientContext(callParseClassMemberWithIsStatic) : callParseClassMemberWithIsStatic();
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const idx = this.tsTryParseIndexSignature(member);
    if (idx) {
      classBody.body.push(idx);
      member.abstract && this.raise(TSErrors.IndexSignatureHasAbstract, { at: member });
      member.accessibility &&
        this.raise(TSErrors.IndexSignatureHasAccessibility, { at: member, modifier: member.accessibility });

      member.declare && this.raise(TSErrors.IndexSignatureHasDeclare, { at: member });
      member.override && this.raise(TSErrors.IndexSignatureHasOverride, { at: member });

      return;
    }
    this.state.inAbstractClass || !member.abstract ||
      this.raise(TSErrors.NonAbstractClassHasAbstractMethod, { at: member });

    !member.override || state.hadSuperClass || this.raise(TSErrors.OverrideNotInSubClass, { at: member });

    super.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parsePostMemberNameModifiers(methodOrProp) {
    if (this.eat(17)) methodOrProp.optional = true;
    methodOrProp.readonly && this.match(10) && this.raise(TSErrors.ClassMethodHasReadonly, { at: methodOrProp });

    methodOrProp.declare && this.match(10) && this.raise(TSErrors.ClassMethodHasDeclare, { at: methodOrProp });
  }
  parseExpressionStatement(node, expr, decorators) {
    return (
      (expr.type === "Identifier" ? this.tsParseExpressionStatement(node, expr, decorators) : void 0) ||
      super.parseExpressionStatement(node, expr, decorators)
    );
  }
  shouldParseExportDeclaration() {
    return !!this.tsIsDeclarationStart() || super.shouldParseExportDeclaration();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.state.maybeInArrowParameters || !this.match(17))
      return super.parseConditional(expr, startLoc, refExpressionErrors);

    const result = this.tryParse(() => super.parseConditional(expr, startLoc));
    if (!result.node) {
      result.error && super.setOptionalParametersError(refExpressionErrors, result.error);

      return expr;
    }
    if (result.error) this.state = result.failState;
    return result.node;
  }
  parseParenItem(node, startLoc) {
    node = super.parseParenItem(node, startLoc);
    if (this.eat(17)) {
      node.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(14)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = node;
      typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TSTypeCastExpression");
    }
    return node;
  }
  parseExportDeclaration(node) {
    if (!this.state.isAmbientContext && this.isContextual(123))
      return this.tsInAmbientContext(() => this.parseExportDeclaration(node));

    const startLoc = this.state.startLoc,
      isDeclare = this.eatContextual(123);
    if (isDeclare && (this.isContextual(123) || !this.shouldParseExportDeclaration()))
      throw this.raise(TSErrors.ExpectedAmbientAfterExportDeclare, { at: this.state.startLoc });

    const declaration =
      (tokenIsIdentifier(this.state.type) && this.tsTryParseExportDeclaration()) ||
      super.parseExportDeclaration(node);
    if (!declaration) return null;
    if (declaration.type === "TSInterfaceDeclaration" || declaration.type === "TSTypeAliasDeclaration" || isDeclare)
      node.exportKind = "type";

    if (isDeclare) {
      this.resetStartLocation(declaration, startLoc);
      declaration.declare = true;
    }
    return declaration;
  }
  parseClassId(node, isStatement, optionalId, _bindingType) {
    if ((!isStatement || optionalId) && this.isContextual(111)) return;

    super.parseClassId(
      node,
      isStatement,
      optionalId,
      node.declare ? BindingFlag.TYPE_TS_AMBIENT : BindingFlag.TYPE_CLASS
    );
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (typeParameters) node.typeParameters = typeParameters;
  }
  parseClassPropertyAnnotation(node) {
    if (!node.optional)
      if (this.eat(35)) node.definite = true;
      else if (this.eat(17)) node.optional = true;

    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
  }
  parseClassProperty(node) {
    this.parseClassPropertyAnnotation(node);
    this.state.isAmbientContext && (!node.readonly || node.typeAnnotation) && this.match(29) &&
      this.raise(TSErrors.DeclareClassFieldHasInitializer, { at: this.state.startLoc });

    if (node.abstract && this.match(29)) {
      const { key } = node;
      this.raise(TSErrors.AbstractPropertyHasInitializer, {
        at: this.state.startLoc,
        propertyName:
          key.type !== "Identifier" || node.computed ? `[${this.input.slice(key.start, key.end)}]` : key.name
      });
    }
    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    node.abstract && this.raise(TSErrors.PrivateElementHasAbstract, { at: node });
    node.accessibility &&
      this.raise(TSErrors.PrivateElementHasAccessibility, { at: node, modifier: node.accessibility });

    this.parseClassPropertyAnnotation(node);
    return super.parseClassPrivateProperty(node);
  }
  parseClassAccessorProperty(node) {
    this.parseClassPropertyAnnotation(node);
    node.optional && this.raise(TSErrors.AccessorCannotBeOptional, { at: node });

    return super.parseClassAccessorProperty(node);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    typeParameters && isConstructor && this.raise(TSErrors.ConstructorHasTypeParameters, { at: typeParameters });

    const { declare = false, kind } = method;
    !declare || (kind !== "get" && kind !== "set") || this.raise(TSErrors.DeclareAccessor, { at: method, kind });

    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  declareClassPrivateMethodInScope(node, kind) {
    node.type === "TSDeclareMethod" ||
      (node.type === "MethodDefinition" && !node.value.body) ||
      super.declareClassPrivateMethodInScope(node, kind);
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass && (this.match(47) || this.match(51)))
      node.superTypeParameters = this.tsParseTypeArgumentsInExpression();

    if (this.eatContextual(111)) node.implements = this.tsParseHeritageClause("implements");
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) prop.typeParameters = typeParameters;
    return super.parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
  }
  parseFunctionParams(node, isConstructor) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) node.typeParameters = typeParameters;
    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (decl.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.eat(35)) decl.definite = true;

    const type = this.tsTryParseTypeAnnotation();
    if (type) {
      decl.id.typeAnnotation = type;
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(14)) node.returnType = this.tsParseTypeAnnotation();

    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    var _jsx, _jsx2, _typeCast, _jsx3, _typeCast2;
    let state, jsx, typeCast, typeParameters;
    if (this.hasPlugin("jsx") && (this.match(140) || this.match(47))) {
      state = this.state.clone();
      jsx = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx.error) return jsx.node;
      const { context } = this.state,
        currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) context.pop();
    }
    if (!(((_jsx = jsx) != null && _jsx.error) || this.match(47)))
      return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);

    if (!state || state === this.state) state = this.state.clone();
    const arrow = this.tryParse(abort => {
      var _expr$extra, _typeParameters;
      typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      const expr = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);

      (expr.type !== "ArrowFunctionExpression" ||
        ((_expr$extra = expr.extra) != null && _expr$extra.parenthesized)) &&
        abort();

      ((_typeParameters = typeParameters) == null ? void 0 : _typeParameters.params.length) === 0 ||
        this.resetStartLocationFromNode(expr, typeParameters);

      expr.typeParameters = typeParameters;
      return expr;
    }, state);
    if (!arrow.error && !arrow.aborted) {
      typeParameters && this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if (!jsx) {
      assert(!this.hasPlugin("jsx"));
      typeCast = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!typeCast.error) return typeCast.node;
    }
    if ((_jsx2 = jsx) != null && _jsx2.node) {
      this.state = jsx.failState;
      return jsx.node;
    }
    if (arrow.node) {
      this.state = arrow.failState;
      typeParameters && this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if ((_typeCast = typeCast) != null && _typeCast.node) {
      this.state = typeCast.failState;
      return typeCast.node;
    }
    throw (
      ((_jsx3 = jsx) == null ? void 0 : _jsx3.error) ||
      arrow.error ||
      ((_typeCast2 = typeCast) == null ? void 0 : _typeCast2.error)
    );
  }
  reportReservedArrowTypeParam(node) {
    var _node$extra;
    node.params.length !== 1 ||
      node.params[0].constraint ||
      ((_node$extra = node.extra) != null && _node$extra.trailingComma) ||
      !this.getPluginOption("typescript", "disallowAmbiguousJSXLike") ||
      this.raise(TSErrors.ReservedArrowTypeParam, { at: node });
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    return !this.hasPlugin("jsx") && this.match(47)
      ? this.tsParseTypeAssertion()
      : super.parseMaybeUnary(refExpressionErrors, sawUnary);
  }
  parseArrow(node) {
    if (this.match(14)) {
      const result = this.tryParse(abort => {
        const returnType = this.tsParseTypeOrTypePredicateAnnotation(14);
        (!this.canInsertSemicolon() && this.match(19)) || abort();
        return returnType;
      });
      if (result.aborted) return;
      if (!result.thrown) {
        if (result.error) this.state = result.failState;
        node.returnType = result.node;
      }
    }
    return super.parseArrow(node);
  }
  parseAssignableListItemTypes(param, flags) {
    if (!(flags & ParseBindingListFlags.IS_FUNCTION_PARAMS)) return param;
    if (this.eat(17)) param.optional = true;

    const type = this.tsTryParseTypeAnnotation();
    if (type) param.typeAnnotation = type;
    this.resetEndLocation(param);
    return param;
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "TSTypeCastExpression":
        return this.isAssignable(node.expression, isBinding);
      case "TSParameterProperty":
        return true;
      default:
        return super.isAssignable(node, isBinding);
    }
  }
  toAssignable(node, isLHS = false) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.toAssignableParenthesizedExpression(node, isLHS);
        break;
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
        isLHS
          ? this.expressionScope.recordArrowParameterBindingError(TSErrors.UnexpectedTypeCastInParameter, { at: node })
          : this.raise(TSErrors.UnexpectedTypeCastInParameter, { at: node });

        this.toAssignable(node.expression, isLHS);
        break;
      case "AssignmentExpression":
        isLHS || node.left.type !== "TSTypeCastExpression" || (node.left = this.typeCastToParameter(node.left));

      default:
        super.toAssignable(node, isLHS);
    }
  }
  toAssignableParenthesizedExpression(node, isLHS) {
    switch (node.expression.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isLHS);
        break;
      default:
        super.toAssignable(node, isLHS);
    }
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSTypeAssertion":
      case "TSNonNullExpression":
        this.checkToRestConversion(node.expression, false);
        break;
      default:
        super.checkToRestConversion(node, allowPattern);
    }
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return getOwn(
      {
        TSTypeCastExpression: true,
        TSParameterProperty: "parameter",
        TSNonNullExpression: "expression",
        TSAsExpression: (binding !== BindingFlag.TYPE_NONE || !isUnparenthesizedInAssign) && ["expression", true],
        TSSatisfiesExpression: (binding !== BindingFlag.TYPE_NONE || !isUnparenthesizedInAssign) && [
          "expression",
          true
        ],
        TSTypeAssertion: (binding !== BindingFlag.TYPE_NONE || !isUnparenthesizedInAssign) && ["expression", true]
      },
      type
    ) || super.isValidLVal(type, isUnparenthesizedInAssign, binding);
  }
  parseBindingAtom() {
    return this.state.type === 78 ? this.parseIdentifier(true) : super.parseBindingAtom();
  }
  parseMaybeDecoratorArguments(expr) {
    if (this.match(47) || this.match(51)) {
      const typeArguments = this.tsParseTypeArgumentsInExpression();
      if (this.match(10)) {
        const call = super.parseMaybeDecoratorArguments(expr);
        call.typeParameters = typeArguments;
        return call;
      }
      this.unexpected(null, 10);
    }
    return super.parseMaybeDecoratorArguments(expr);
  }
  checkCommaAfterRest(close) {
    if (this.state.isAmbientContext && this.match(12) && this.lookaheadCharCode() === close) {
      this.next();
      return false;
    }
    return super.checkCommaAfterRest(close);
  }
  isClassMethod() {
    return this.match(47) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(35) || this.match(14) || super.isClassProperty();
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start &&
      this.raise(TSErrors.TypeAnnotationAfterAssign, { at: node.typeAnnotation });

    return node;
  }
  getTokenFromCode(code) {
    if (this.state.inType) {
      if (code === 62) {
        this.finishOp(48, 1);
        return;
      }
      if (code === 60) {
        this.finishOp(47, 1);
        return;
      }
    }
    super.getTokenFromCode(code);
  }
  reScan_lt_gt() {
    const { type } = this.state;
    if (type === 47) {
      this.state.pos -= 1;
      this.readToken_lt();
    } else if (type === 48) {
      this.state.pos -= 1;
      this.readToken_gt();
    }
  }
  reScan_lt() {
    const { type } = this.state;
    if (type === 51) {
      this.state.pos -= 2;
      this.finishOp(47, 1);
      return 47;
    }
    return type;
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i];
      if ((expr == null ? void 0 : expr.type) === "TSTypeCastExpression")
        exprList[i] = this.typeCastToParameter(expr);
    }
    super.toAssignableList(exprList, trailingCommaLoc, isLHS);
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocation(node.expression, node.typeAnnotation.loc.end);
    return node.expression;
  }
  shouldParseArrow(params) {
    return this.match(14) ? params.every(expr => this.isAssignable(expr, true)) : super.shouldParseArrow(params);
  }
  shouldParseAsyncArrow() {
    return this.match(14) || super.shouldParseAsyncArrow();
  }
  canHaveLeadingDecorator() {
    return super.canHaveLeadingDecorator() || this.isAbstractClass();
  }
  jsxParseOpeningElementAfterName(node) {
    if (this.match(47) || this.match(51)) {
      const typeArguments = this.tsTryParseAndCatch(() => this.tsParseTypeArgumentsInExpression());
      if (typeArguments) node.typeParameters = typeArguments;
    }
    return super.jsxParseOpeningElementAfterName(node);
  }
  getGetterSetterExpectedParamCount(method) {
    const baseCount = super.getGetterSetterExpectedParamCount(method),
      firstParam = this.getObjectOrClassMethodParams(method)[0];
    return firstParam && this.isThisParam(firstParam) ? baseCount + 1 : baseCount;
  }
  parseCatchClauseParam() {
    const param = super.parseCatchClauseParam(),
      type = this.tsTryParseTypeAnnotation();
    if (type) {
      param.typeAnnotation = type;
      this.resetEndLocation(param);
    }
    return param;
  }
  tsInAmbientContext(cb) {
    const oldIsAmbientContext = this.state.isAmbientContext;
    this.state.isAmbientContext = true;
    try {
      return cb();
    } finally {
      this.state.isAmbientContext = oldIsAmbientContext;
    }
  }
  parseClass(node, isStatement, optionalId) {
    const oldInAbstractClass = this.state.inAbstractClass;
    this.state.inAbstractClass = !!node.abstract;
    try {
      return super.parseClass(node, isStatement, optionalId);
    } finally {
      this.state.inAbstractClass = oldInAbstractClass;
    }
  }
  tsParseAbstractDeclaration(node, decorators) {
    if (this.match(80)) {
      node.abstract = true;
      return this.maybeTakeDecorators(decorators, this.parseClass(node, true, false));
    }
    if (this.isContextual(127)) {
      if (!this.hasFollowingLineBreak()) {
        node.abstract = true;
        this.raise(TSErrors.NonClassMethodPropertyHasAbstractModifer, { at: node });
        return this.tsParseInterfaceDeclaration(node);
      }
    } else this.unexpected(null, 80);
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope) {
    const method = super.parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    if (method.abstract && (this.hasPlugin("estree") ? method.value.body : method.body)) {
      const { key } = method;
      this.raise(TSErrors.AbstractMethodHasImplementation, {
        at: method,
        methodName:
          key.type !== "Identifier" || method.computed ? `[${this.input.slice(key.start, key.end)}]` : key.name
      });
    }
    return method;
  }
  tsParseTypeParameterName() {
    return this.parseIdentifier().name;
  }
  shouldParseAsAmbientContext() {
    return !!this.getPluginOption("typescript", "dts");
  }
  parse() {
    if (this.shouldParseAsAmbientContext()) this.state.isAmbientContext = true;

    return super.parse();
  }
  getExpression() {
    if (this.shouldParseAsAmbientContext()) this.state.isAmbientContext = true;

    return super.getExpression();
  }
  parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly) {
    if (!isString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(node, false, isInTypeExport);
      return this.finishNode(node, "ExportSpecifier");
    }
    node.exportKind = "value";
    return super.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly);
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, _bindingType) {
    if (!importedIsString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(specifier, true, isInTypeOnlyImport);
      return this.finishNode(specifier, "ImportSpecifier");
    }
    specifier.importKind = "value";
    return super.parseImportSpecifier(
      specifier,
      importedIsString,
      isInTypeOnlyImport,
      isMaybeTypeOnly,
      isInTypeOnlyImport ? BindingFlag.TYPE_TS_TYPE_IMPORT : BindingFlag.TYPE_TS_VALUE_IMPORT
    );
  }
  parseTypeOnlyImportExportSpecifier(node, isImport, isInTypeOnlyImportExport) {
    const leftOfAsKey = isImport ? "imported" : "local",
      rightOfAsKey = isImport ? "local" : "exported";
    let rightOfAs,
      leftOfAs = node[leftOfAsKey],
      hasTypeSpecifier = false,
      canParseAsKeyword = true;
    const loc = leftOfAs.loc.start;
    if (this.isContextual(93)) {
      const firstAs = this.parseIdentifier();
      if (this.isContextual(93)) {
        const secondAs = this.parseIdentifier();
        if (tokenIsKeywordOrIdentifier(this.state.type)) {
          hasTypeSpecifier = true;
          leftOfAs = firstAs;
          rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
          canParseAsKeyword = false;
        } else {
          rightOfAs = secondAs;
          canParseAsKeyword = false;
        }
      } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
        canParseAsKeyword = false;
        rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
      } else {
        hasTypeSpecifier = true;
        leftOfAs = firstAs;
      }
    } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
      hasTypeSpecifier = true;
      if (isImport) {
        leftOfAs = this.parseIdentifier(true);
        this.isContextual(93) || this.checkReservedWord(leftOfAs.name, leftOfAs.loc.start, true, true);
      } else leftOfAs = this.parseModuleExportName();
    }
    hasTypeSpecifier && isInTypeOnlyImportExport &&
      this.raise(isImport ? TSErrors.TypeModifierIsUsedInTypeImports : TSErrors.TypeModifierIsUsedInTypeExports, {
        at: loc
      });

    node[leftOfAsKey] = leftOfAs;
    node[rightOfAsKey] = rightOfAs;
    node[isImport ? "importKind" : "exportKind"] = hasTypeSpecifier ? "type" : "value";
    if (canParseAsKeyword && this.eatContextual(93))
      node[rightOfAsKey] = isImport ? this.parseIdentifier() : this.parseModuleExportName();

    node[rightOfAsKey] || (node[rightOfAsKey] = cloneIdentifier(node[leftOfAsKey]));

    isImport &&
      this.checkIdentifier(
        node[rightOfAsKey],
        hasTypeSpecifier ? BindingFlag.TYPE_TS_TYPE_IMPORT : BindingFlag.TYPE_TS_VALUE_IMPORT
      );
  }
};
function isPossiblyLiteralEnum(expression) {
  if (expression.type !== "MemberExpression") return false;
  const { computed, property } = expression;
  return (
    (!computed ||
      property.type === "StringLiteral" ||
      !(property.type !== "TemplateLiteral" || property.expressions.length > 0)) &&
    isUncomputedMemberExpressionChain(expression.object)
  );
}
function isValidAmbientConstInitializer(expression, estree) {
  var _expression$extra;
  const { type } = expression;
  if ((_expression$extra = expression.extra) != null && _expression$extra.parenthesized) return false;

  if (estree) {
    if (type === "Literal") {
      const { value } = expression;
      if (typeof value == "string" || typeof value == "boolean") return true;
    }
  } else if (type === "StringLiteral" || type === "BooleanLiteral") return true;

  return (
    !(!isNumber(expression, estree) && !isNegativeNumber(expression, estree)) ||
    (type === "TemplateLiteral" && expression.expressions.length === 0) ||
    !!isPossiblyLiteralEnum(expression)
  );
}
function isNumber(expression, estree) {
  return estree
    ? expression.type === "Literal" && (typeof expression.value == "number" || "bigint" in expression)
    : expression.type === "NumericLiteral" || expression.type === "BigIntLiteral";
}
function isNegativeNumber(expression, estree) {
  if (expression.type === "UnaryExpression") {
    const { operator, argument } = expression;
    if (operator === "-" && isNumber(argument, estree)) return true;
  }
  return false;
}
function isUncomputedMemberExpressionChain(expression) {
  return (
    expression.type === "Identifier" ||
    (expression.type === "MemberExpression" && !expression.computed &&
      isUncomputedMemberExpressionChain(expression.object))
  );
}

const PlaceholderErrors = ParseErrorEnum`placeholders`({
  ClassNameIsRequired: "A class name is required.",
  UnexpectedSpace: "Unexpected space in placeholder."
});
// noinspection JSUnusedGlobalSymbols
var placeholders = superClass => class extends superClass {
  parsePlaceholder(expectedNode) {
    if (this.match(142)) {
      const node = this.startNode();
      this.next();
      this.assertNoSpace();
      node.name = super.parseIdentifier(true);
      this.assertNoSpace();
      this.expect(142);
      return this.finishPlaceholder(node, expectedNode);
    }
  }
  finishPlaceholder(node, expectedNode) {
    const isFinished = !(!node.expectedNode || node.type !== "Placeholder");
    node.expectedNode = expectedNode;
    return isFinished ? node : this.finishNode(node, "Placeholder");
  }
  getTokenFromCode(code) {
    code === 37 && this.input.charCodeAt(this.state.pos + 1) === 37
      ? this.finishOp(142, 2)
      : super.getTokenFromCode(code);
  }
  parseExprAtom(refExpressionErrors) {
    return this.parsePlaceholder("Expression") || super.parseExprAtom(refExpressionErrors);
  }
  parseIdentifier(liberal) {
    return this.parsePlaceholder("Identifier") || super.parseIdentifier(liberal);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    word === void 0 || super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
  }
  parseBindingAtom() {
    return this.parsePlaceholder("Pattern") || super.parseBindingAtom();
  }
  isValidLVal(type, isParenthesized, binding) {
    return type === "Placeholder" || super.isValidLVal(type, isParenthesized, binding);
  }
  toAssignable(node, isLHS) {
    node && node.type === "Placeholder" && node.expectedNode === "Expression"
      ? (node.expectedNode = "Pattern")
      : super.toAssignable(node, isLHS);
  }
  chStartsBindingIdentifier(ch, pos) {
    return !!super.chStartsBindingIdentifier(ch, pos) || this.lookahead().type === 142;
  }
  verifyBreakContinue(node, isBreak) {
    (node.label && node.label.type === "Placeholder") || super.verifyBreakContinue(node, isBreak);
  }
  parseExpressionStatement(node, expr) {
    var _expr$extra;
    if (expr.type !== "Placeholder" || ((_expr$extra = expr.extra) != null && _expr$extra.parenthesized))
      return super.parseExpressionStatement(node, expr);

    if (this.match(14)) {
      const stmt = node;
      stmt.label = this.finishPlaceholder(expr, "Identifier");
      this.next();
      stmt.body = super.parseStatementOrSloppyAnnexBFunctionDeclaration();
      return this.finishNode(stmt, "LabeledStatement");
    }
    this.semicolon();
    node.name = expr.name;
    return this.finishPlaceholder(node, "Statement");
  }
  parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse) {
    return (
      this.parsePlaceholder("BlockStatement") ||
      super.parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse)
    );
  }
  parseFunctionId(requireId) {
    return this.parsePlaceholder("Identifier") || super.parseFunctionId(requireId);
  }
  parseClass(node, isStatement, optionalId) {
    const type = isStatement ? "ClassDeclaration" : "ClassExpression";
    this.next();
    const oldStrict = this.state.strict,
      placeholder = this.parsePlaceholder("Identifier");
    if (placeholder) {
      if (this.match(81) || this.match(142) || this.match(5)) node.id = placeholder;
      else if (optionalId || !isStatement) {
        node.id = null;
        node.body = this.finishPlaceholder(placeholder, "ClassBody");
        return this.finishNode(node, type);
      } else throw this.raise(PlaceholderErrors.ClassNameIsRequired, { at: this.state.startLoc });
    } else this.parseClassId(node, isStatement, optionalId);

    super.parseClassSuper(node);
    node.body = this.parsePlaceholder("ClassBody") || super.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, type);
  }
  parseExport(node, decorators) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseExport(node, decorators);
    if (!this.isContextual(97) && !this.match(12)) {
      node.specifiers = [];
      node.source = null;
      node.declaration = this.finishPlaceholder(placeholder, "Declaration");
      return this.finishNode(node, "ExportNamedDeclaration");
    }
    this.expectPlugin("exportDefaultFrom");
    const specifier = this.startNode();
    specifier.exported = placeholder;
    node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
    return super.parseExport(node, decorators);
  }
  isExportDefaultSpecifier() {
    if (this.match(65)) {
      const next = this.nextTokenStart();
      if (this.isUnparsedContextual(next, "from") &&
          this.input.startsWith(tokenLabelName(142), this.nextTokenStartSince(next + 4)))
        return true;
    }
    return super.isExportDefaultSpecifier();
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    var _specifiers;
    return (
      !((_specifiers = node.specifiers) == null || !_specifiers.length) ||
      super.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier)
    );
  }
  checkExport(node) {
    const { specifiers } = node;
    if (specifiers != null && specifiers.length)
      node.specifiers = specifiers.filter(node => node.exported.type === "Placeholder");

    super.checkExport(node);
    node.specifiers = specifiers;
  }
  parseImport(node) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseImport(node);
    node.specifiers = [];
    if (!this.isContextual(97) && !this.match(12)) {
      node.source = this.finishPlaceholder(placeholder, "StringLiteral");
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    }
    const specifier = this.startNodeAtNode(placeholder);
    specifier.local = placeholder;
    node.specifiers.push(this.finishNode(specifier, "ImportDefaultSpecifier"));
    !this.eat(12) || this.maybeParseStarImportSpecifier(node) || this.parseNamedImportSpecifiers(node);

    this.expectContextual(97);
    node.source = this.parseImportSource();
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    return this.parsePlaceholder("StringLiteral") || super.parseImportSource();
  }
  assertNoSpace() {
    this.state.start > this.state.lastTokEndLoc.index &&
      this.raise(PlaceholderErrors.UnexpectedSpace, { at: this.state.lastTokEndLoc });
  }
};

var v8intrinsic = superClass => class extends superClass {
  parseV8Intrinsic() {
    if (this.match(54)) {
      const v8IntrinsicStartLoc = this.state.startLoc,
        node = this.startNode();
      this.next();
      if (tokenIsIdentifier(this.state.type)) {
        const name = this.parseIdentifierName(),
          identifier = this.createIdentifier(node, name);
        identifier.type = "V8IntrinsicIdentifier";
        if (this.match(10)) return identifier;
      }
      this.unexpected(v8IntrinsicStartLoc);
    }
  }
  parseExprAtom(refExpressionErrors) {
    return this.parseV8Intrinsic() || super.parseExprAtom(refExpressionErrors);
  }
};

function hasPlugin(plugins, expectedConfig) {
  const [expectedName, expectedOptions] = typeof expectedConfig == "string" ? [expectedConfig, {}] : expectedConfig,
    expectedKeys = Object.keys(expectedOptions),
    expectedOptionsIsEmpty = expectedKeys.length === 0;
  return plugins.some(p => {
    if (typeof p == "string") return expectedOptionsIsEmpty && p === expectedName;

    const [pluginName, pluginOptions] = p;
    if (pluginName !== expectedName) return false;

    for (const key of expectedKeys) if (pluginOptions[key] !== expectedOptions[key]) return false;

    return true;
  });
}
/** @returns {?string} */
function getPluginOption(plugins, name, option) {
  const plugin = plugins.find(plugin => (Array.isArray(plugin) ? plugin[0] === name : plugin === name));
  return plugin && Array.isArray(plugin) && plugin.length > 1 ? plugin[1][option] : null;
}
const PIPELINE_PROPOSALS = ["minimal", "fsharp", "hack", "smart"],
  TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"],
  RECORD_AND_TUPLE_SYNTAX_TYPES = ["hash", "bar"];
function validatePlugins(plugins) {
  if (hasPlugin(plugins, "decorators")) {
    if (hasPlugin(plugins, "decorators-legacy"))
      throw new Error("Cannot use the decorators and decorators-legacy plugin together");

    const decoratorsBeforeExport = getPluginOption(plugins, "decorators", "decoratorsBeforeExport");
    if (decoratorsBeforeExport != null && typeof decoratorsBeforeExport != "boolean")
      throw new Error("'decoratorsBeforeExport' must be a boolean, if specified.");

    const allowCallParenthesized = getPluginOption(plugins, "decorators", "allowCallParenthesized");
    if (allowCallParenthesized != null && typeof allowCallParenthesized != "boolean")
      throw new Error("'allowCallParenthesized' must be a boolean.");
  }
  if (hasPlugin(plugins, "flow") && hasPlugin(plugins, "typescript"))
    throw new Error("Cannot combine flow and typescript plugins.");

  if (hasPlugin(plugins, "placeholders") && hasPlugin(plugins, "v8intrinsic"))
    throw new Error("Cannot combine placeholders and v8intrinsic plugins.");

  if (hasPlugin(plugins, "pipelineOperator")) {
    const proposal = getPluginOption(plugins, "pipelineOperator", "proposal");
    if (!PIPELINE_PROPOSALS.includes(proposal)) {
      const proposalList = PIPELINE_PROPOSALS.map(p => `"${p}"`).join(", ");
      throw new Error(`"pipelineOperator" requires "proposal" option whose value must be one of: ${proposalList}.`);
    }
    const tupleSyntaxIsHash = hasPlugin(plugins, ["recordAndTuple", { syntaxType: "hash" }]);
    if (proposal === "hack") {
      if (hasPlugin(plugins, "placeholders"))
        throw new Error("Cannot combine placeholders plugin and Hack-style pipes.");

      if (hasPlugin(plugins, "v8intrinsic"))
        throw new Error("Cannot combine v8intrinsic plugin and Hack-style pipes.");

      const topicToken = getPluginOption(plugins, "pipelineOperator", "topicToken");
      if (!TOPIC_TOKENS.includes(topicToken)) {
        const tokenList = TOPIC_TOKENS.map(t => `"${t}"`).join(", ");
        throw new Error(
          `"pipelineOperator" in "proposal": "hack" mode also requires a "topicToken" option whose value must be one of: ${tokenList}.`
        );
      }
      if (topicToken === "#" && tupleSyntaxIsHash)
        throw new Error(
          'Plugin conflict between `["pipelineOperator", { proposal: "hack", topicToken: "#" }]` and `["recordAndtuple", { syntaxType: "hash"}]`.'
        );
    } else if (proposal === "smart" && tupleSyntaxIsHash)
      throw new Error(
        'Plugin conflict between `["pipelineOperator", { proposal: "smart" }]` and `["recordAndtuple", { syntaxType: "hash"}]`.'
      );
  }
  if (hasPlugin(plugins, "moduleAttributes")) {
    if (hasPlugin(plugins, "importAssertions") || hasPlugin(plugins, "importAttributes"))
      throw new Error("Cannot combine importAssertions, importAttributes and moduleAttributes plugins.");

    if (getPluginOption(plugins, "moduleAttributes", "version") !== "may-2020")
      throw new Error(
        "The 'moduleAttributes' plugin requires a 'version' option, representing the last proposal update. Currently, the only supported value is 'may-2020'."
      );
  }
  if (hasPlugin(plugins, "importAssertions") && hasPlugin(plugins, "importAttributes"))
    throw new Error("Cannot combine importAssertions and importAttributes plugins.");

  if (
    hasPlugin(plugins, "recordAndTuple") &&
    getPluginOption(plugins, "recordAndTuple", "syntaxType") != null &&
    !RECORD_AND_TUPLE_SYNTAX_TYPES.includes(getPluginOption(plugins, "recordAndTuple", "syntaxType"))
  )
    throw new Error(
      "The 'syntaxType' option of the 'recordAndTuple' plugin must be one of: " +
        RECORD_AND_TUPLE_SYNTAX_TYPES.map(p => `'${p}'`).join(", ")
    );

  if (hasPlugin(plugins, "asyncDoExpressions") && !hasPlugin(plugins, "doExpressions")) {
    const error = new Error(
      "'asyncDoExpressions' requires 'doExpressions', please add 'doExpressions' to parser plugins."
    );
    error.missingPlugins = "doExpressions";
    throw error;
  }
}
const mixinPlugins = { estree, jsx, flow, typescript, v8intrinsic, placeholders },
  mixinPluginNames = Object.keys(mixinPlugins);

const defaultOptions = {
  sourceType: "script",
  sourceFilename: void 0,
  startColumn: 0,
  startLine: 1,
  allowAwaitOutsideFunction: false,
  allowReturnOutsideFunction: false,
  allowNewTargetOutsideFunction: false,
  allowImportExportEverywhere: false,
  allowSuperOutsideMethod: false,
  allowUndeclaredExports: false,
  plugins: [],
  strictMode: null,
  ranges: false,
  tokens: false,
  createParenthesizedExpressions: false,
  errorRecovery: false,
  attachComment: true,
  annexB: true
};
function getOptions(opts) {
  if (opts == null) return Object.assign({}, defaultOptions);

  if (opts.annexB != null && opts.annexB !== false)
    throw new Error("The `annexB` option can only be set to `false`.");

  const options = {};
  for (const key of Object.keys(defaultOptions)) {
    var _opts$key;
    options[key] = (_opts$key = opts[key]) != null ? _opts$key : defaultOptions[key];
  }
  return options;
}

class ExpressionParser extends LValParser {
  checkProto(prop, isRecord, protoRef, refExpressionErrors) {
    if (prop.type === "SpreadElement" || this.isObjectMethod(prop) || prop.computed || prop.shorthand) return;

    const key = prop.key;
    if ((key.type === "Identifier" ? key.name : key.value) === "__proto__") {
      if (isRecord) {
        this.raise(Errors.RecordNoProto, { at: key });
        return;
      }
      if (protoRef.used)
        if (refExpressionErrors) {
          if (refExpressionErrors.doubleProtoLoc === null) refExpressionErrors.doubleProtoLoc = key.loc.start;
        } else this.raise(Errors.DuplicateProto, { at: key });

      protoRef.used = true;
    }
  }
  shouldExitDescending(expr, potentialArrowAt) {
    return expr.type === "ArrowFunctionExpression" && expr.start === potentialArrowAt;
  }
  getExpression() {
    this.enterInitialScopes();
    this.nextToken();
    const expr = this.parseExpression();
    this.match(137) || this.unexpected();

    this.finalizeRemainingComments();
    expr.comments = this.state.comments;
    expr.errors = this.state.errors;
    if (this.options.tokens) expr.tokens = this.tokens;

    return expr;
  }
  parseExpression(disallowIn, refExpressionErrors) {
    return disallowIn
      ? this.disallowInAnd(() => this.parseExpressionBase(refExpressionErrors))
      : this.allowInAnd(() => this.parseExpressionBase(refExpressionErrors));
  }
  parseExpressionBase(refExpressionErrors) {
    const startLoc = this.state.startLoc,
      expr = this.parseMaybeAssign(refExpressionErrors);
    if (this.match(12)) {
      const node = this.startNodeAt(startLoc);
      node.expressions = [expr];
      while (this.eat(12)) node.expressions.push(this.parseMaybeAssign(refExpressionErrors));

      this.toReferencedList(node.expressions);
      return this.finishNode(node, "SequenceExpression");
    }
    return expr;
  }
  parseMaybeAssignDisallowIn(refExpressionErrors, afterLeftParse) {
    return this.disallowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse) {
    return this.allowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  setOptionalParametersError(refExpressionErrors, resultError) {
    var _resultError$loc;
    refExpressionErrors.optionalParametersLoc =
      (_resultError$loc = resultError == null ? void 0 : resultError.loc) != null ? _resultError$loc : this.state.startLoc;
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    const startLoc = this.state.startLoc;
    if (this.isContextual(106) && this.prodParam.hasYield) {
      let left = this.parseYield();
      if (afterLeftParse) left = afterLeftParse.call(this, left, startLoc);

      return left;
    }
    let ownExpressionErrors;
    if (refExpressionErrors) ownExpressionErrors = false;
    else {
      refExpressionErrors = new ExpressionErrors();
      ownExpressionErrors = true;
    }
    const { type } = this.state;
    if (type === 10 || tokenIsIdentifier(type)) this.state.potentialArrowAt = this.state.start;

    let left = this.parseMaybeConditional(refExpressionErrors);
    if (afterLeftParse) left = afterLeftParse.call(this, left, startLoc);

    if (tokenIsAssignment(this.state.type)) {
      const node = this.startNodeAt(startLoc);
      node.operator = this.state.value;
      if (this.match(29)) {
        this.toAssignable(left, true);
        node.left = left;
        const startIndex = startLoc.index;
        if (refExpressionErrors.doubleProtoLoc != null && refExpressionErrors.doubleProtoLoc.index >= startIndex)
          refExpressionErrors.doubleProtoLoc = null;

        if (
          refExpressionErrors.shorthandAssignLoc != null &&
          refExpressionErrors.shorthandAssignLoc.index >= startIndex
        )
          refExpressionErrors.shorthandAssignLoc = null;

        if (refExpressionErrors.privateKeyLoc != null && refExpressionErrors.privateKeyLoc.index >= startIndex) {
          this.checkDestructuringPrivate(refExpressionErrors);
          refExpressionErrors.privateKeyLoc = null;
        }
      } else node.left = left;

      this.next();
      node.right = this.parseMaybeAssign();
      this.checkLVal(left, { in: this.finishNode(node, "AssignmentExpression") });
      return node;
    }
    ownExpressionErrors && this.checkExpressionErrors(refExpressionErrors, true);

    return left;
  }
  parseMaybeConditional(refExpressionErrors) {
    const startLoc = this.state.startLoc,
      potentialArrowAt = this.state.potentialArrowAt,
      expr = this.parseExprOps(refExpressionErrors);
    return this.shouldExitDescending(expr, potentialArrowAt)
      ? expr
      : this.parseConditional(expr, startLoc, refExpressionErrors);
  }
  parseConditional(expr, startLoc, _refExpressionErrors) {
    if (this.eat(17)) {
      const node = this.startNodeAt(startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssignAllowIn();
      this.expect(14);
      node.alternate = this.parseMaybeAssign();
      return this.finishNode(node, "ConditionalExpression");
    }
    return expr;
  }
  parseMaybeUnaryOrPrivate(refExpressionErrors) {
    return this.match(136) ? this.parsePrivateName() : this.parseMaybeUnary(refExpressionErrors);
  }
  parseExprOps(refExpressionErrors) {
    const startLoc = this.state.startLoc,
      potentialArrowAt = this.state.potentialArrowAt,
      expr = this.parseMaybeUnaryOrPrivate(refExpressionErrors);
    return this.shouldExitDescending(expr, potentialArrowAt) ? expr : this.parseExprOp(expr, startLoc, -1);
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    if (this.isPrivateName(left)) {
      const value = this.getPrivateNameSV(left);
      (minPrec < tokenOperatorPrecedence(58) && this.prodParam.hasIn && this.match(58)) ||
        this.raise(Errors.PrivateInExpectedIn, { at: left, identifierName: value });

      this.classScope.usePrivateName(value, left.loc.start);
    }
    const op = this.state.type;
    if (tokenIsOperator(op) && (this.prodParam.hasIn || !this.match(58))) {
      let prec = tokenOperatorPrecedence(op);
      if (prec > minPrec) {
        if (op === 39) {
          this.expectPlugin("pipelineOperator");
          if (this.state.inFSharpPipelineDirectBody) return left;

          this.checkPipelineAtInfixOperator(left, leftStartLoc);
        }
        const node = this.startNodeAt(leftStartLoc);
        node.left = left;
        node.operator = this.state.value;
        const logical = op === 41 || op === 42,
          coalesce = op === 40;
        if (coalesce) prec = tokenOperatorPrecedence(42);

        this.next();
        if (op === 39 && this.hasPlugin(["pipelineOperator", { proposal: "minimal" }]) &&
            this.state.type === 96 && this.prodParam.hasAwait)
          throw this.raise(Errors.UnexpectedAwaitAfterPipelineBody, { at: this.state.startLoc });

        node.right = this.parseExprOpRightExpr(op, prec);
        const finishedNode = this.finishNode(node, logical || coalesce ? "LogicalExpression" : "BinaryExpression"),
          nextOp = this.state.type;
        if ((coalesce && (nextOp === 41 || nextOp === 42)) || (logical && nextOp === 40))
          throw this.raise(Errors.MixingCoalesceWithLogical, { at: this.state.startLoc });

        return this.parseExprOp(finishedNode, leftStartLoc, minPrec);
      }
    }
    return left;
  }
  parseExprOpRightExpr(op, prec) {
    const startLoc = this.state.startLoc;
    switch (op) {
      case 39:
        switch (this.getPluginOption("pipelineOperator", "proposal")) {
          case "hack":
            return this.withTopicBindingContext(() => this.parseHackPipeBody());
          case "smart":
            return this.withTopicBindingContext(() => {
              if (this.prodParam.hasYield && this.isContextual(106))
                throw this.raise(Errors.PipeBodyIsTighter, { at: this.state.startLoc });

              return this.parseSmartPipelineBodyInStyle(this.parseExprOpBaseRightExpr(op, prec), startLoc);
            });
          case "fsharp":
            return this.withSoloAwaitPermittingContext(() => this.parseFSharpPipelineBody(prec));
        }
      default:
        return this.parseExprOpBaseRightExpr(op, prec);
    }
  }
  parseExprOpBaseRightExpr(op, prec) {
    const startLoc = this.state.startLoc;
    return this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, tokenIsRightAssociative(op) ? prec - 1 : prec);
  }
  parseHackPipeBody() {
    var _body$extra;
    const { startLoc } = this.state,
      body = this.parseMaybeAssign();
    !UnparenthesizedPipeBodyDescriptions.has(body.type) ||
      ((_body$extra = body.extra) != null && _body$extra.parenthesized) ||
      this.raise(Errors.PipeUnparenthesizedBody, { at: startLoc, type: body.type });

    this.topicReferenceWasUsedInCurrentContext() || this.raise(Errors.PipeTopicUnused, { at: startLoc });

    return body;
  }
  checkExponentialAfterUnary(node) {
    this.match(57) && this.raise(Errors.UnexpectedTokenUnaryExponentiation, { at: node.argument });
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    const startLoc = this.state.startLoc,
      isAwait = this.isContextual(96);
    if (isAwait && this.isAwaitAllowed()) {
      this.next();
      const expr = this.parseAwait(startLoc);
      sawUnary || this.checkExponentialAfterUnary(expr);
      return expr;
    }
    const update = this.match(34),
      node = this.startNode();
    if (tokenIsPrefix(this.state.type)) {
      node.operator = this.state.value;
      node.prefix = true;
      this.match(72) && this.expectPlugin("throwExpressions");

      const isDelete = this.match(89);
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refExpressionErrors, true);
      if (this.state.strict && isDelete) {
        const arg = node.argument;
        arg.type === "Identifier"
          ? this.raise(Errors.StrictDelete, { at: node })
          : this.hasPropertyAsPrivateName(arg) && this.raise(Errors.DeletePrivateField, { at: node });
      }
      if (!update) {
        sawUnary || this.checkExponentialAfterUnary(node);

        return this.finishNode(node, "UnaryExpression");
      }
    }
    const expr = this.parseUpdate(node, update, refExpressionErrors);
    if (isAwait) {
      const { type } = this.state;
      if (
        (this.hasPlugin("v8intrinsic")
          ? tokenCanStartExpression(type)
          : tokenCanStartExpression(type) && !this.match(54)) &&
        !this.isAmbiguousAwait()
      ) {
        this.raiseOverwrite(Errors.AwaitNotInAsyncContext, { at: startLoc });
        return this.parseAwait(startLoc);
      }
    }
    return expr;
  }
  parseUpdate(node, update, refExpressionErrors) {
    if (update) {
      const updateExpressionNode = node;
      this.checkLVal(updateExpressionNode.argument, { in: this.finishNode(updateExpressionNode, "UpdateExpression") });
      return node;
    }
    const startLoc = this.state.startLoc;
    let expr = this.parseExprSubscripts(refExpressionErrors);
    if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;
    while (tokenIsPostfix(this.state.type) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startLoc);
      node.operator = this.state.value;
      node.prefix = false;
      node.argument = expr;
      this.next();
      this.checkLVal(expr, { in: (expr = this.finishNode(node, "UpdateExpression")) });
    }
    return expr;
  }
  parseExprSubscripts(refExpressionErrors) {
    const startLoc = this.state.startLoc,
      potentialArrowAt = this.state.potentialArrowAt,
      expr = this.parseExprAtom(refExpressionErrors);
    return this.shouldExitDescending(expr, potentialArrowAt) ? expr : this.parseSubscripts(expr, startLoc);
  }
  parseSubscripts(base, startLoc, noCalls) {
    const state = { optionalChainMember: false, maybeAsyncArrow: this.atPossibleAsyncArrow(base), stop: false };
    do {
      base = this.parseSubscript(base, startLoc, noCalls, state);
      state.maybeAsyncArrow = false;
    } while (!state.stop);
    return base;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const { type } = this.state;
    if (!noCalls && type === 15) return this.parseBind(base, startLoc, noCalls, state);
    if (tokenIsTemplate(type)) return this.parseTaggedTemplateExpression(base, startLoc, state);

    let optional = false;
    if (type === 18) {
      if (noCalls) {
        this.raise(Errors.OptionalChainingNoNew, { at: this.state.startLoc });
        if (this.lookaheadCharCode() === 40) {
          state.stop = true;
          return base;
        }
      }
      state.optionalChainMember = optional = true;
      this.next();
    }
    if (!noCalls && this.match(10)) return this.parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional);
    //{
    const computed = this.eat(0);
    if (computed || optional || this.eat(16)) return this.parseMember(base, startLoc, state, computed, optional);

    state.stop = true;
    return base;
    //}
  }
  parseMember(base, startLoc, state, computed, optional) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    node.computed = computed;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(3);
    } else if (this.match(136)) {
      base.type !== "Super" || this.raise(Errors.SuperPrivateField, { at: startLoc });

      this.classScope.usePrivateName(this.state.value, this.state.startLoc);
      node.property = this.parsePrivateName();
    } else node.property = this.parseIdentifier(true);

    if (state.optionalChainMember) {
      node.optional = optional;
      return this.finishNode(node, "OptionalMemberExpression");
    }

    return this.finishNode(node, "MemberExpression");
  }
  parseBind(base, startLoc, noCalls, state) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    this.next();
    node.callee = this.parseNoCallExpr();
    state.stop = true;
    return this.parseSubscripts(this.finishNode(node, "BindExpression"), startLoc, noCalls);
  }
  parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional) {
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    let refExpressionErrors = null;
    this.state.maybeInArrowParameters = true;
    this.next();
    const node = this.startNodeAt(startLoc);
    node.callee = base;
    const { maybeAsyncArrow, optionalChainMember } = state;
    if (maybeAsyncArrow) {
      this.expressionScope.enter(newAsyncArrowScope());
      refExpressionErrors = new ExpressionErrors();
    }
    if (optionalChainMember) node.optional = optional;

    node.arguments = optional
      ? this.parseCallExpressionArguments(11)
      : this.parseCallExpressionArguments(11, base.type === "Import", base.type !== "Super", node, refExpressionErrors);

    let finishedNode = this.finishCallExpression(node, optionalChainMember);
    if (maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
      state.stop = true;
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      finishedNode = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startLoc), finishedNode);
    } else {
      if (maybeAsyncArrow) {
        this.checkExpressionErrors(refExpressionErrors, true);
        this.expressionScope.exit();
      }
      this.toReferencedArguments(finishedNode);
    }
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return finishedNode;
  }
  toReferencedArguments(node, isParenthesizedExpr) {
    this.toReferencedListDeep(node.arguments, isParenthesizedExpr);
  }
  parseTaggedTemplateExpression(base, startLoc, state) {
    const node = this.startNodeAt(startLoc);
    node.tag = base;
    node.quasi = this.parseTemplate(true);
    state.optionalChainMember && this.raise(Errors.OptionalChainingNoTemplate, { at: startLoc });

    return this.finishNode(node, "TaggedTemplateExpression");
  }
  atPossibleAsyncArrow(base) {
    return (
      base.type === "Identifier" &&
      base.name === "async" &&
      this.state.lastTokEndLoc.index === base.end &&
      !this.canInsertSemicolon() &&
      base.end - base.start == 5 &&
      base.start === this.state.potentialArrowAt
    );
  }
  expectImportAttributesPlugin() {
    this.hasPlugin("importAssertions") || this.expectPlugin("importAttributes");
  }
  finishCallExpression(node, optional) {
    if (node.callee.type === "Import") {
      node.arguments.length !== 2 || this.hasPlugin("moduleAttributes") || this.expectImportAttributesPlugin();

      if (node.arguments.length === 0 || node.arguments.length > 2)
        this.raise(Errors.ImportCallArity, {
          at: node,
          maxArgumentCount:
            this.hasPlugin("importAttributes") ||
            this.hasPlugin("importAssertions") ||
            this.hasPlugin("moduleAttributes")
              ? 2 : 1
        });
      else
        for (const arg of node.arguments)
          arg.type !== "SpreadElement" || this.raise(Errors.ImportCallSpreadArgument, { at: arg });
    }
    return this.finishNode(node, optional ? "OptionalCallExpression" : "CallExpression");
  }
  parseCallExpressionArguments(close, dynamicImport, allowPlaceholder, nodeForExtra, refExpressionErrors) {
    const elts = [];
    let first = true;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    while (!this.eat(close)) {
      if (first) first = false;
      else {
        this.expect(12);
        if (this.match(close)) {
          !dynamicImport ||
            this.hasPlugin("importAttributes") ||
            this.hasPlugin("importAssertions") ||
            this.hasPlugin("moduleAttributes") ||
            this.raise(Errors.ImportCallArgumentTrailingComma, { at: this.state.lastTokStartLoc });

          nodeForExtra && this.addTrailingCommaExtraToNode(nodeForExtra);

          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(false, refExpressionErrors, allowPlaceholder));
    }
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return elts;
  }
  shouldParseAsyncArrow() {
    return this.match(19) && !this.canInsertSemicolon();
  }
  parseAsyncArrowFromCallExpression(node, call) {
    var _call$extra;
    this.resetPreviousNodeTrailingComments(call);
    this.expect(19);
    this.parseArrowExpression(
      node,
      call.arguments,
      true,
      (_call$extra = call.extra) == null ? void 0 : _call$extra.trailingCommaLoc
    );
    call.innerComments && setInnerComments(node, call.innerComments);
    call.callee.trailingComments && setInnerComments(node, call.callee.trailingComments);

    return node;
  }
  parseNoCallExpr() {
    const startLoc = this.state.startLoc;
    return this.parseSubscripts(this.parseExprAtom(), startLoc, true);
  }
  parseExprAtom(refExpressionErrors) {
    let node,
      decorators = null;
    const { type } = this.state;
    switch (type) {
      case 79:
        return this.parseSuper();
      case 83:
        node = this.startNode();
        this.next();
        if (this.match(16)) return this.parseImportMetaProperty(node);

        this.match(10) || this.raise(Errors.UnsupportedImport, { at: this.state.lastTokStartLoc });

        return this.finishNode(node, "Import");
      case 78:
        node = this.startNode();
        this.next();
        return this.finishNode(node, "ThisExpression");
      case 90:
        return this.parseDo(this.startNode(), false);

      case 56:
      case 31:
        this.readRegexp();
        return this.parseRegExpLiteral(this.state.value);

      case 132:
        return this.parseNumericLiteral(this.state.value);
      case 133:
        return this.parseBigIntLiteral(this.state.value);
      case 134:
        return this.parseDecimalLiteral(this.state.value);
      case 131:
        return this.parseStringLiteral(this.state.value);
      case 84:
        return this.parseNullLiteral();
      case 85:
        return this.parseBooleanLiteral(true);
      case 86:
        return this.parseBooleanLiteral(false);
      case 10: {
        const canBeArrow = this.state.potentialArrowAt === this.state.start;
        return this.parseParenAndDistinguishExpression(canBeArrow);
      }
      case 2:
      case 1:
        return this.parseArrayLike(this.state.type === 2 ? 4 : 3, false, true);

      case 0:
        return this.parseArrayLike(3, true, false, refExpressionErrors);

      case 6:
      case 7:
        return this.parseObjectLike(this.state.type === 6 ? 9 : 8, false, true);

      case 5:
        return this.parseObjectLike(8, false, false, refExpressionErrors);

      case 68:
        return this.parseFunctionOrFunctionSent();
      case 26:
        decorators = this.parseDecorators();
      case 80:
        return this.parseClass(this.maybeTakeDecorators(decorators, this.startNode()), false);
      case 77:
        return this.parseNewOrNewTarget();
      case 25:
      case 24:
        return this.parseTemplate(false);
      case 15: {
        node = this.startNode();
        this.next();
        node.object = null;
        const callee = (node.callee = this.parseNoCallExpr());
        if (callee.type === "MemberExpression") return this.finishNode(node, "BindExpression");

        throw this.raise(Errors.UnsupportedBind, { at: callee });
      }
      case 136:
        this.raise(Errors.PrivateInExpectedIn, { at: this.state.startLoc, identifierName: this.state.value });
        return this.parsePrivateName();

      case 33:
        return this.parseTopicReferenceThenEqualsSign(54, "%");

      case 32:
        return this.parseTopicReferenceThenEqualsSign(44, "^");

      case 37:
      case 38:
        return this.parseTopicReference("hack");

      case 44:
      case 54:
      case 27: {
        const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
        if (pipeProposal) return this.parseTopicReference(pipeProposal);

        this.unexpected();
        break;
      }
      case 47: {
        const lookaheadCh = this.input.codePointAt(this.nextTokenStart());
        common.isIdentifierStart(lookaheadCh) || lookaheadCh === 62
          ? this.expectOnePlugin(["jsx", "flow", "typescript"])
          : this.unexpected();

        break;
      }
      default:
        if (tokenIsIdentifier(type)) {
          if (this.isContextual(125) && this.lookaheadInLineCharCode() === 123) return this.parseModuleExpression();

          const canBeArrow = this.state.potentialArrowAt === this.state.start,
            containsEsc = this.state.containsEsc,
            id = this.parseIdentifier();
          if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
            const { type } = this.state;
            if (type === 68) {
              this.resetPreviousNodeTrailingComments(id);
              this.next();
              return this.parseAsyncFunctionExpression(this.startNodeAtNode(id));
            }
            if (tokenIsIdentifier(type))
              return this.lookaheadCharCode() === 61
                ? this.parseAsyncArrowUnaryFunction(this.startNodeAtNode(id))
                : id;
            if (type === 90) {
              this.resetPreviousNodeTrailingComments(id);
              return this.parseDo(this.startNodeAtNode(id), true);
            }
          }
          if (canBeArrow && this.match(19) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
          }
          return id;
        }

        this.unexpected();
    }
  }
  parseTopicReferenceThenEqualsSign(topicTokenType, topicTokenValue) {
    const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
    if (pipeProposal) {
      this.state.type = topicTokenType;
      this.state.value = topicTokenValue;
      this.state.pos--;
      this.state.end--;
      this.state.endLoc = createPositionWithColumnOffset(this.state.endLoc, -1);
      return this.parseTopicReference(pipeProposal);
    }

    this.unexpected();
  }
  parseTopicReference(pipeProposal) {
    const node = this.startNode(),
      startLoc = this.state.startLoc,
      tokenType = this.state.type;
    this.next();
    return this.finishTopicReference(node, startLoc, pipeProposal, tokenType);
  }
  finishTopicReference(node, startLoc, pipeProposal, tokenType) {
    if (this.testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType)) {
      const nodeType = pipeProposal === "smart" ? "PipelinePrimaryTopicReference" : "TopicReference";
      this.topicReferenceIsAllowedInCurrentContext() ||
        this.raise(pipeProposal === "smart" ? Errors.PrimaryTopicNotAllowed : Errors.PipeTopicUnbound, {
          at: startLoc
        });

      this.registerTopicReference();
      return this.finishNode(node, nodeType);
    }

    throw this.raise(Errors.PipeTopicUnconfiguredToken, { at: startLoc, token: tokenLabelName(tokenType) });
  }
  testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType) {
    switch (pipeProposal) {
      case "hack":
        return this.hasPlugin(["pipelineOperator", { topicToken: tokenLabelName(tokenType) }]);

      case "smart":
        return tokenType === 27;
      default:
        throw this.raise(Errors.PipeTopicRequiresHackPipes, { at: startLoc });
    }
  }
  parseAsyncArrowUnaryFunction(node) {
    this.prodParam.enter(functionFlags(true, this.prodParam.hasYield));
    const params = [this.parseIdentifier()];
    this.prodParam.exit();
    this.hasPrecedingLineBreak() && this.raise(Errors.LineTerminatorBeforeArrow, { at: this.state.curPosition() });

    this.expect(19);
    return this.parseArrowExpression(node, params, true);
  }
  parseDo(node, isAsync) {
    this.expectPlugin("doExpressions");
    isAsync && this.expectPlugin("asyncDoExpressions");

    node.async = isAsync;
    this.next();
    const oldLabels = this.state.labels;
    this.state.labels = [];
    if (isAsync) {
      this.prodParam.enter(PARAM_AWAIT);
      node.body = this.parseBlock();
      this.prodParam.exit();
    } else node.body = this.parseBlock();

    this.state.labels = oldLabels;
    return this.finishNode(node, "DoExpression");
  }
  parseSuper() {
    const node = this.startNode();
    this.next();
    !this.match(10) || this.scope.allowDirectSuper || this.options.allowSuperOutsideMethod
      ? this.scope.allowSuper || this.options.allowSuperOutsideMethod ||
        this.raise(Errors.UnexpectedSuper, { at: node })
      : this.raise(Errors.SuperNotAllowed, { at: node });

    this.match(10) || this.match(0) || this.match(16) || this.raise(Errors.UnsupportedSuper, { at: node });

    return this.finishNode(node, "Super");
  }
  parsePrivateName() {
    const node = this.startNode(),
      id = this.startNodeAt(createPositionWithColumnOffset(this.state.startLoc, 1)),
      name = this.state.value;
    this.next();
    node.id = this.createIdentifier(id, name);
    return this.finishNode(node, "PrivateName");
  }
  parseFunctionOrFunctionSent() {
    const node = this.startNode();
    this.next();
    if (this.prodParam.hasYield && this.match(16)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "function");
      this.next();
      this.match(102) ? this.expectPlugin("functionSent") : this.hasPlugin("functionSent") || this.unexpected();

      return this.parseMetaProperty(node, meta, "sent");
    }
    return this.parseFunction(node);
  }
  parseMetaProperty(node, meta, propertyName) {
    node.meta = meta;
    const containsEsc = this.state.containsEsc;
    node.property = this.parseIdentifier(true);
    if (node.property.name !== propertyName || containsEsc)
      this.raise(Errors.UnsupportedMetaProperty, {
        at: node.property,
        target: meta.name,
        onlyValidPropertyName: propertyName
      });

    return this.finishNode(node, "MetaProperty");
  }
  parseImportMetaProperty(node) {
    const id = this.createIdentifier(this.startNodeAtNode(node), "import");
    this.next();
    if (this.isContextual(100)) {
      this.inModule || this.raise(Errors.ImportMetaOutsideModule, { at: id });

      this.sawUnambiguousESM = true;
    }
    return this.parseMetaProperty(node, id, "meta");
  }
  parseLiteralAtNode(value, type, node) {
    this.addExtra(node, "rawValue", value);
    this.addExtra(node, "raw", this.input.slice(node.start, this.state.end));
    node.value = value;
    this.next();
    return this.finishNode(node, type);
  }
  parseLiteral(value, type) {
    const node = this.startNode();
    return this.parseLiteralAtNode(value, type, node);
  }
  parseStringLiteral(value) {
    return this.parseLiteral(value, "StringLiteral");
  }
  parseNumericLiteral(value) {
    return this.parseLiteral(value, "NumericLiteral");
  }
  parseBigIntLiteral(value) {
    return this.parseLiteral(value, "BigIntLiteral");
  }
  parseDecimalLiteral(value) {
    return this.parseLiteral(value, "DecimalLiteral");
  }
  parseRegExpLiteral(value) {
    const node = this.parseLiteral(value.value, "RegExpLiteral");
    node.pattern = value.pattern;
    node.flags = value.flags;
    return node;
  }
  parseBooleanLiteral(value) {
    const node = this.startNode();
    node.value = value;
    this.next();
    return this.finishNode(node, "BooleanLiteral");
  }
  parseNullLiteral() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "NullLiteral");
  }
  parseParenAndDistinguishExpression(canBeArrow) {
    const startLoc = this.state.startLoc;
    let val;
    this.next();
    this.expressionScope.enter(newArrowHeadScope());
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters,
      oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.maybeInArrowParameters = true;
    this.state.inFSharpPipelineDirectBody = false;
    const innerStartLoc = this.state.startLoc,
      exprList = [],
      refExpressionErrors = new ExpressionErrors();
    let spreadStartLoc,
      optionalCommaStartLoc,
      first = true;
    while (!this.match(11)) {
      if (first) first = false;
      else {
        this.expect(12,
          refExpressionErrors.optionalParametersLoc === null ? null : refExpressionErrors.optionalParametersLoc
        );
        if (this.match(11)) {
          optionalCommaStartLoc = this.state.startLoc;
          break;
        }
      }
      if (this.match(21)) {
        const spreadNodeStartLoc = this.state.startLoc;
        spreadStartLoc = this.state.startLoc;
        exprList.push(this.parseParenItem(this.parseRestBinding(), spreadNodeStartLoc));
        if (!this.checkCommaAfterRest(41)) break;
      } else exprList.push(this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem));
    }
    const innerEndLoc = this.state.lastTokEndLoc;
    this.expect(11);
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let arrowNode = this.startNodeAt(startLoc);
    if (canBeArrow && this.shouldParseArrow(exprList) && (arrowNode = this.parseArrow(arrowNode))) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      this.parseArrowExpression(arrowNode, exprList, false);
      return arrowNode;
    }
    this.expressionScope.exit();
    exprList.length || this.unexpected(this.state.lastTokStartLoc);

    optionalCommaStartLoc && this.unexpected(optionalCommaStartLoc);
    spreadStartLoc && this.unexpected(spreadStartLoc);
    this.checkExpressionErrors(refExpressionErrors, true);
    this.toReferencedListDeep(exprList, true);
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartLoc);
      val.expressions = exprList;
      this.finishNode(val, "SequenceExpression");
      this.resetEndLocation(val, innerEndLoc);
    } else val = exprList[0];

    return this.wrapParenthesis(startLoc, val);
  }
  wrapParenthesis(startLoc, expression) {
    if (!this.options.createParenthesizedExpressions) {
      this.addExtra(expression, "parenthesized", true);
      this.addExtra(expression, "parenStart", startLoc.index);
      this.takeSurroundingComments(expression, startLoc.index, this.state.lastTokEndLoc.index);
      return expression;
    }
    const parenExpression = this.startNodeAt(startLoc);
    parenExpression.expression = expression;
    return this.finishNode(parenExpression, "ParenthesizedExpression");
  }
  /** @param {Array} params */
  shouldParseArrow(params) {
    return !this.canInsertSemicolon();
  }
  parseArrow(node) {
    if (this.eat(19)) return node;
  }
  parseParenItem(node, _startLoc) {
    return node;
  }
  parseNewOrNewTarget() {
    const node = this.startNode();
    this.next();
    if (this.match(16)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "new");
      this.next();
      const metaProp = this.parseMetaProperty(node, meta, "target");
      this.scope.inNonArrowFunction || this.scope.inClass || this.options.allowNewTargetOutsideFunction ||
        this.raise(Errors.UnexpectedNewTarget, { at: metaProp });

      return metaProp;
    }
    return this.parseNew(node);
  }
  parseNew(node) {
    this.parseNewCallee(node);
    if (this.eat(10)) {
      const args = this.parseExprList(11);
      this.toReferencedList(args);
      node.arguments = args;
    } else node.arguments = [];

    return this.finishNode(node, "NewExpression");
  }
  parseNewCallee(node) {
    node.callee = this.parseNoCallExpr();
    node.callee.type !== "Import" || this.raise(Errors.ImportCallNotNewExpression, { at: node.callee });
  }
  parseTemplateElement(isTagged) {
    const { start, startLoc, end, value } = this.state,
      elemStart = start + 1,
      elem = this.startNodeAt(createPositionWithColumnOffset(startLoc, 1));
    value !== null ||
      isTagged ||
      this.raise(Errors.InvalidEscapeSequenceTemplate, {
        at: createPositionWithColumnOffset(this.state.firstInvalidTemplateEscapePos, 1)
      });

    const isTail = this.match(24),
      endOffset = isTail ? -1 : -2,
      elemEnd = end + endOffset;
    elem.value = {
      raw: this.input.slice(elemStart, elemEnd).replace(/\r\n?/g, "\n"),
      cooked: value === null ? null : value.slice(1, endOffset)
    };
    elem.tail = isTail;
    this.next();
    const finishedNode = this.finishNode(elem, "TemplateElement");
    this.resetEndLocation(finishedNode, createPositionWithColumnOffset(this.state.lastTokEndLoc, endOffset));
    return finishedNode;
  }
  parseTemplate(isTagged) {
    const node = this.startNode();
    node.expressions = [];
    let curElt = this.parseTemplateElement(isTagged);
    node.quasis = [curElt];
    while (!curElt.tail) {
      node.expressions.push(this.parseTemplateSubstitution());
      this.readTemplateContinuation();
      node.quasis.push((curElt = this.parseTemplateElement(isTagged)));
    }
    return this.finishNode(node, "TemplateLiteral");
  }
  parseTemplateSubstitution() {
    return this.parseExpression();
  }
  parseObjectLike(close, isPattern, isRecord, refExpressionErrors) {
    isRecord && this.expectPlugin("recordAndTuple");

    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const propHash = Object.create(null);
    let first = true;
    const node = this.startNode();
    node.properties = [];
    this.next();
    while (!this.match(close)) {
      if (first) first = false;
      else {
        this.expect(12);
        if (this.match(close)) {
          this.addTrailingCommaExtraToNode(node);
          break;
        }
      }
      let prop;
      if (isPattern) prop = this.parseBindingProperty();
      else {
        prop = this.parsePropertyDefinition(refExpressionErrors);
        this.checkProto(prop, isRecord, propHash, refExpressionErrors);
      }
      !isRecord || this.isObjectProperty(prop) || prop.type === "SpreadElement" ||
        this.raise(Errors.InvalidRecordProperty, { at: prop });

      prop.shorthand && this.addExtra(prop, "shorthand", true);

      node.properties.push(prop);
    }
    this.next();
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let type = "ObjectExpression";
    if (isPattern) type = "ObjectPattern";
    else if (isRecord) type = "RecordExpression";

    return this.finishNode(node, type);
  }
  addTrailingCommaExtraToNode(node) {
    this.addExtra(node, "trailingComma", this.state.lastTokStart);
    this.addExtra(node, "trailingCommaLoc", this.state.lastTokStartLoc, false);
  }
  maybeAsyncOrAccessorProp(prop) {
    return (
      !prop.computed &&
      prop.key.type === "Identifier" &&
      (this.isLiteralPropertyName() || this.match(0) || this.match(55))
    );
  }
  parsePropertyDefinition(refExpressionErrors) {
    let decorators = [];
    if (this.match(26)) {
      this.hasPlugin("decorators") && this.raise(Errors.UnsupportedPropertyDecorator, { at: this.state.startLoc });

      while (this.match(26)) decorators.push(this.parseDecorator());
    }
    const prop = this.startNode();
    let startLoc,
      isAsync = false,
      isAccessor = false;
    if (this.match(21)) {
      decorators.length && this.unexpected();
      return this.parseSpread();
    }
    if (decorators.length) {
      prop.decorators = decorators;
      decorators = [];
    }
    prop.method = false;
    if (refExpressionErrors) startLoc = this.state.startLoc;

    let isGenerator = this.eat(55);
    this.parsePropertyNamePrefixOperator(prop);
    const containsEsc = this.state.containsEsc,
      key = this.parsePropertyName(prop, refExpressionErrors);
    if (!isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
      const keyName = key.name;
      if (keyName === "async" && !this.hasPrecedingLineBreak()) {
        isAsync = true;
        this.resetPreviousNodeTrailingComments(key);
        isGenerator = this.eat(55);
        this.parsePropertyName(prop);
      }
      if (keyName === "get" || keyName === "set") {
        isAccessor = true;
        this.resetPreviousNodeTrailingComments(key);
        prop.kind = keyName;
        if (this.match(55)) {
          isGenerator = true;
          this.raise(Errors.AccessorIsGenerator, { at: this.state.curPosition(), kind: keyName });
          this.next();
        }
        this.parsePropertyName(prop);
      }
    }
    return this.parseObjPropValue(prop, startLoc, isGenerator, isAsync, false, isAccessor, refExpressionErrors);
  }
  getGetterSetterExpectedParamCount(method) {
    return method.kind === "get" ? 0 : 1;
  }
  getObjectOrClassMethodParams(method) {
    return method.params;
  }
  checkGetterSetterParams(method) {
    var _params;
    const paramCount = this.getGetterSetterExpectedParamCount(method),
      params = this.getObjectOrClassMethodParams(method);
    params.length === paramCount ||
      this.raise(method.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, { at: method });

    method.kind !== "set" ||
      ((_params = params[params.length - 1]) == null ? void 0 : _params.type) !== "RestElement" ||
      this.raise(Errors.BadSetterRestParameter, { at: method });
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    if (isAccessor) {
      const finishedProp = this.parseMethod(prop, isGenerator, false, false, false, "ObjectMethod");
      this.checkGetterSetterParams(finishedProp);
      return finishedProp;
    }
    if (isAsync || isGenerator || this.match(10)) {
      isPattern && this.unexpected();
      prop.kind = "method";
      prop.method = true;
      return this.parseMethod(prop, isGenerator, isAsync, false, false, "ObjectMethod");
    }
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    prop.shorthand = false;
    if (this.eat(14)) {
      prop.value = isPattern
        ? this.parseMaybeDefault(this.state.startLoc)
        : this.parseMaybeAssignAllowIn(refExpressionErrors);
      return this.finishNode(prop, "ObjectProperty");
    }
    if (!prop.computed && prop.key.type === "Identifier") {
      this.checkReservedWord(prop.key.name, prop.key.loc.start, true, false);
      if (isPattern) prop.value = this.parseMaybeDefault(startLoc, cloneIdentifier(prop.key));
      else if (this.match(29)) {
        const shorthandAssignLoc = this.state.startLoc;
        if (refExpressionErrors != null) {
          if (refExpressionErrors.shorthandAssignLoc === null)
            refExpressionErrors.shorthandAssignLoc = shorthandAssignLoc;
        } else this.raise(Errors.InvalidCoverInitializedName, { at: shorthandAssignLoc });

        prop.value = this.parseMaybeDefault(startLoc, cloneIdentifier(prop.key));
      } else prop.value = cloneIdentifier(prop.key);

      prop.shorthand = true;
      return this.finishNode(prop, "ObjectProperty");
    }
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const node =
      this.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) ||
      this.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    node || this.unexpected();
    return node;
  }
  parsePropertyName(prop, refExpressionErrors) {
    if (this.eat(0)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssignAllowIn();
      this.expect(3);
    } else {
      const { type, value } = this.state;
      let key;
      if (tokenIsKeywordOrIdentifier(type)) key = this.parseIdentifier(true);
      else
        switch (type) {
          case 132:
            key = this.parseNumericLiteral(value);
            break;
          case 131:
            key = this.parseStringLiteral(value);
            break;
          case 133:
            key = this.parseBigIntLiteral(value);
            break;
          case 134:
            key = this.parseDecimalLiteral(value);
            break;
          case 136: {
            const privateKeyLoc = this.state.startLoc;
            if (refExpressionErrors != null) {
              if (refExpressionErrors.privateKeyLoc === null) refExpressionErrors.privateKeyLoc = privateKeyLoc;
            } else this.raise(Errors.UnexpectedPrivateField, { at: privateKeyLoc });

            key = this.parsePrivateName();
            break;
          }
          default:
            this.unexpected();
        }

      prop.key = key;
      if (type !== 136) prop.computed = false;
    }
    return prop.key;
  }
  initFunction(node, isAsync) {
    node.id = null;
    node.generator = false;
    node.async = isAsync;
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    this.initFunction(node, isAsync);
    node.generator = isGenerator;
    this.scope.enter(
      ScopeFlag.FUNCTION |
        ScopeFlag.SUPER |
        (inClassScope ? ScopeFlag.CLASS : 0) |
        (allowDirectSuper ? ScopeFlag.DIRECT_SUPER : 0)
    );
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    this.parseFunctionParams(node, isConstructor);
    const finishedNode = this.parseFunctionBodyAndFinish(node, type, true);
    this.prodParam.exit();
    this.scope.exit();
    return finishedNode;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    isTuple && this.expectPlugin("recordAndTuple");

    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const node = this.startNode();
    this.next();
    node.elements = this.parseExprList(close, !isTuple, refExpressionErrors, node);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return this.finishNode(node, isTuple ? "TupleExpression" : "ArrayExpression");
  }
  parseArrowExpression(node, params, isAsync, trailingCommaLoc) {
    this.scope.enter(ScopeFlag.FUNCTION | ScopeFlag.ARROW);
    let flags = functionFlags(isAsync, false);
    if (!this.match(5) && this.prodParam.hasIn) flags |= PARAM_IN;

    this.prodParam.enter(flags);
    this.initFunction(node, isAsync);
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    if (params) {
      this.state.maybeInArrowParameters = true;
      this.setArrowFunctionParameters(node, params, trailingCommaLoc);
    }
    this.state.maybeInArrowParameters = false;
    this.parseFunctionBody(node, true);
    this.prodParam.exit();
    this.scope.exit();
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return this.finishNode(node, "ArrowFunctionExpression");
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    this.toAssignableList(params, trailingCommaLoc, false);
    node.params = params;
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    this.parseFunctionBody(node, false, isMethod);
    return this.finishNode(node, type);
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    const isExpression = allowExpression && !this.match(5);
    this.expressionScope.enter(newExpressionScope());
    if (isExpression) {
      node.body = this.parseMaybeAssign();
      this.checkParams(node, false, allowExpression, false);
    } else {
      const oldStrict = this.state.strict,
        oldLabels = this.state.labels;
      this.state.labels = [];
      this.prodParam.enter(this.prodParam.currentFlags() | PARAM_RETURN);
      node.body = this.parseBlock(true, false, hasStrictModeDirective => {
        const nonSimple = !this.isSimpleParamList(node.params);
        hasStrictModeDirective && nonSimple &&
          this.raise(Errors.IllegalLanguageModeDirective, {
            at: (node.kind !== "method" && node.kind !== "constructor") || !node.key ? node : node.key.loc.end
          });

        const strictModeChanged = !oldStrict && this.state.strict;
        this.checkParams(
          node,
          !(this.state.strict || allowExpression || isMethod || nonSimple),
          allowExpression,
          strictModeChanged
        );
        this.state.strict && node.id && this.checkIdentifier(node.id, BindingFlag.TYPE_OUTSIDE, strictModeChanged);
      });
      this.prodParam.exit();
      this.state.labels = oldLabels;
    }
    this.expressionScope.exit();
  }
  isSimpleParameter(node) {
    return node.type === "Identifier";
  }
  isSimpleParamList(params) {
    for (let i = 0, len = params.length; i < len; i++) if (!this.isSimpleParameter(params[i])) return false;

    return true;
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    const checkClashes = !allowDuplicates && new Set(),
      formalParameters = { type: "FormalParameters" };
    for (const param of node.params)
      this.checkLVal(param, { in: formalParameters, binding: BindingFlag.TYPE_VAR, checkClashes, strictModeChanged });
  }
  parseExprList(close, allowEmpty, refExpressionErrors, nodeForExtra) {
    const elts = [];
    for (let first = true; !this.eat(close); ) {
      if (first) first = false;
      else {
        this.expect(12);
        if (this.match(close)) {
          nodeForExtra && this.addTrailingCommaExtraToNode(nodeForExtra);

          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(allowEmpty, refExpressionErrors));
    }
    return elts;
  }
  parseExprListItem(allowEmpty, refExpressionErrors, allowPlaceholder) {
    let elt;
    if (this.match(12)) {
      allowEmpty || this.raise(Errors.UnexpectedToken, { at: this.state.curPosition(), unexpected: "," });

      elt = null;
    } else if (this.match(21)) {
      const spreadNodeStartLoc = this.state.startLoc;
      elt = this.parseParenItem(this.parseSpread(refExpressionErrors), spreadNodeStartLoc);
    } else if (this.match(17)) {
      this.expectPlugin("partialApplication");
      allowPlaceholder || this.raise(Errors.UnexpectedArgumentPlaceholder, { at: this.state.startLoc });

      const node = this.startNode();
      this.next();
      elt = this.finishNode(node, "ArgumentPlaceholder");
    } else elt = this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem);

    return elt;
  }
  parseIdentifier(liberal) {
    const node = this.startNode(),
      name = this.parseIdentifierName(liberal);
    return this.createIdentifier(node, name);
  }
  createIdentifier(node, name) {
    node.name = name;
    node.loc.identifierName = name;
    return this.finishNode(node, "Identifier");
  }
  parseIdentifierName(liberal) {
    let name;
    const { startLoc, type } = this.state;
    tokenIsKeywordOrIdentifier(type) ? (name = this.state.value) : this.unexpected();

    const tokenIsKeyword = tokenKeywordOrIdentifierIsKeyword(type);
    liberal
      ? tokenIsKeyword && this.replaceToken(130)
      : this.checkReservedWord(name, startLoc, tokenIsKeyword, false);

    this.next();
    return name;
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (word.length > 10 || !canBeReservedWord(word)) return;

    if (checkKeywords && common.isKeyword(word))
      this.raise(Errors.UnexpectedKeyword, { at: startLoc, keyword: word });
    else if (
      (!this.state.strict
        ? common.isReservedWord
        : isBinding
        ? common.isStrictBindReservedWord
        : common.isStrictReservedWord)(word, this.inModule)
    )
      this.raise(Errors.UnexpectedReservedWord, { at: startLoc, reservedWord: word });
    else if (word === "yield") {
      if (this.prodParam.hasYield) {
        this.raise(Errors.YieldBindingIdentifier, { at: startLoc });
        //return;
      }
    } else if (word === "await") {
      if (this.prodParam.hasAwait) {
        this.raise(Errors.AwaitBindingIdentifier, { at: startLoc });
        return;
      }
      if (this.scope.inStaticBlock) {
        this.raise(Errors.AwaitBindingIdentifierInStaticBlock, { at: startLoc });
        return;
      }
      this.expressionScope.recordAsyncArrowParametersError({ at: startLoc });
    } else if (word === "arguments" && this.scope.inClassAndNotInNonArrowFunction) {
      this.raise(Errors.ArgumentsInClass, { at: startLoc });
      //return;
    }
  }
  isAwaitAllowed() {
    return !!this.prodParam.hasAwait || !(!this.options.allowAwaitOutsideFunction || this.scope.inFunction);
  }
  parseAwait(startLoc) {
    const node = this.startNodeAt(startLoc);
    this.expressionScope.recordParameterInitializerError(Errors.AwaitExpressionFormalParameter, { at: node });
    this.eat(55) && this.raise(Errors.ObsoleteAwaitStar, { at: node });

    this.scope.inFunction || this.options.allowAwaitOutsideFunction ||
      (this.isAmbiguousAwait() ? (this.ambiguousScriptDifferentAst = true) : (this.sawUnambiguousESM = true));

    this.state.soloAwait || (node.argument = this.parseMaybeUnary(null, true));

    return this.finishNode(node, "AwaitExpression");
  }
  isAmbiguousAwait() {
    if (this.hasPrecedingLineBreak()) return true;
    const { type } = this.state;
    return (
      type === 53 ||
      type === 10 ||
      type === 0 ||
      tokenIsTemplate(type) ||
      (type === 101 && !this.state.containsEsc) ||
      type === 135 ||
      type === 56 ||
      (this.hasPlugin("v8intrinsic") && type === 54)
    );
  }
  parseYield() {
    const node = this.startNode();
    this.expressionScope.recordParameterInitializerError(Errors.YieldInParameter, { at: node });
    this.next();
    let delegating = false,
      argument = null;
    if (!this.hasPrecedingLineBreak()) {
      delegating = this.eat(55);
      switch (this.state.type) {
        case 13:
        case 137:
        case 8:
        case 11:
        case 3:
        case 9:
        case 14:
        case 12:
          if (!delegating) break;
        default:
          argument = this.parseMaybeAssign();
      }
    }
    node.delegate = delegating;
    node.argument = argument;
    return this.finishNode(node, "YieldExpression");
  }
  checkPipelineAtInfixOperator(left, leftStartLoc) {
    this.hasPlugin(["pipelineOperator", { proposal: "smart" }]) &&
      left.type === "SequenceExpression" &&
      this.raise(Errors.PipelineHeadSequenceExpression, { at: leftStartLoc });
  }
  parseSmartPipelineBodyInStyle(childExpr, startLoc) {
    if (this.isSimpleReference(childExpr)) {
      const bodyNode = this.startNodeAt(startLoc);
      bodyNode.callee = childExpr;
      return this.finishNode(bodyNode, "PipelineBareFunction");
    }
    //{
    const bodyNode = this.startNodeAt(startLoc);
    this.checkSmartPipeTopicBodyEarlyErrors(startLoc);
    bodyNode.expression = childExpr;
    return this.finishNode(bodyNode, "PipelineTopicExpression");
    //}
  }
  isSimpleReference(expression) {
    switch (expression.type) {
      case "MemberExpression":
        return !expression.computed && this.isSimpleReference(expression.object);
      case "Identifier":
        return true;
      default:
        return false;
    }
  }
  checkSmartPipeTopicBodyEarlyErrors(startLoc) {
    if (this.match(19)) throw this.raise(Errors.PipelineBodyNoArrow, { at: this.state.startLoc });

    this.topicReferenceWasUsedInCurrentContext() || this.raise(Errors.PipelineTopicUnused, { at: startLoc });
  }
  withTopicBindingContext(callback) {
    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = { maxNumOfResolvableTopics: 1, maxTopicIndex: null };
    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }
  withSmartMixTopicForbiddingContext(callback) {
    if (!this.hasPlugin(["pipelineOperator", { proposal: "smart" }])) return callback();

    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = { maxNumOfResolvableTopics: 0, maxTopicIndex: null };
    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }
  withSoloAwaitPermittingContext(callback) {
    const outerContextSoloAwaitState = this.state.soloAwait;
    this.state.soloAwait = true;
    try {
      return callback();
    } finally {
      this.state.soloAwait = outerContextSoloAwaitState;
    }
  }
  allowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    if (PARAM_IN & ~flags) {
      this.prodParam.enter(flags | PARAM_IN);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  disallowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    if (PARAM_IN & flags) {
      this.prodParam.enter(flags & ~PARAM_IN);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  registerTopicReference() {
    this.state.topicContext.maxTopicIndex = 0;
  }
  topicReferenceIsAllowedInCurrentContext() {
    return this.state.topicContext.maxNumOfResolvableTopics >= 1;
  }
  topicReferenceWasUsedInCurrentContext() {
    return this.state.topicContext.maxTopicIndex != null && this.state.topicContext.maxTopicIndex >= 0;
  }
  parseFSharpPipelineBody(prec) {
    const startLoc = this.state.startLoc;
    this.state.potentialArrowAt = this.state.start;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = true;
    const ret = this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, prec);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return ret;
  }
  parseModuleExpression() {
    this.expectPlugin("moduleBlocks");
    const node = this.startNode();
    this.next();
    this.match(5) || this.unexpected(null, 5);

    const program = this.startNodeAt(this.state.endLoc);
    this.next();
    const revertScopes = this.initializeScopes(true);
    this.enterInitialScopes();
    try {
      node.body = this.parseProgram(program, 8, "module");
    } finally {
      revertScopes();
    }
    return this.finishNode(node, "ModuleExpression");
  }
  /** @param {*} prop */
  parsePropertyNamePrefixOperator(prop) {}
}

const loopLabel = { kind: "loop" },
  switchLabel = { kind: "switch" };
var ParseFunctionFlag = {
  Expression: 0,
  Declaration: 1,
  HangingDeclaration: 2,
  NullableId: 4,
  Async: 8
};
var ParseStatementFlag = {
  StatementOnly: 0,
  AllowImportExport: 1,
  AllowDeclaration: 2,
  AllowFunctionDeclaration: 4,
  AllowLabeledFunction: 8
};
const loneSurrogate = /[\uD800-\uDFFF]/u,
  keywordRelationalOperator = /in(?:stanceof)?/y;
function babel7CompatTokens(tokens, input) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i],
      { type } = token;
    if (typeof type == "number") {
      if (type === 136) {
        const { loc, start, value, end } = token,
          hashEndPos = start + 1,
          hashEndLoc = createPositionWithColumnOffset(loc.start, 1);
        tokens.splice(i, 1,
          new Token({
            type: getExportedToken(27),
            value: "#",
            start,
            end: hashEndPos,
            startLoc: loc.start,
            endLoc: hashEndLoc
          }),
          new Token({
            type: getExportedToken(130),
            value,
            start: hashEndPos,
            end,
            startLoc: hashEndLoc,
            endLoc: loc.end
          })
        );
        i++;
        continue;
      }
      if (tokenIsTemplate(type)) {
        const { loc, start, value, end } = token,
          backquoteEnd = start + 1,
          backquoteEndLoc = createPositionWithColumnOffset(loc.start, 1);
        let startToken =
          input.charCodeAt(start) === 96
          ? new Token({
              type: getExportedToken(22),
              value: "`",
              start,
              end: backquoteEnd,
              startLoc: loc.start,
              endLoc: backquoteEndLoc
            })
          : new Token({
              type: getExportedToken(8),
              value: "}",
              start,
              end: backquoteEnd,
              startLoc: loc.start,
              endLoc: backquoteEndLoc
            });

        let templateValue, templateElementEnd, templateElementEndLoc, endToken;
        if (type === 24) {
          templateElementEnd = end - 1;
          templateElementEndLoc = createPositionWithColumnOffset(loc.end, -1);
          templateValue = value === null ? null : value.slice(1, -1);
          endToken = new Token({
            type: getExportedToken(22),
            value: "`",
            start: templateElementEnd,
            end,
            startLoc: templateElementEndLoc,
            endLoc: loc.end
          });
        } else {
          templateElementEnd = end - 2;
          templateElementEndLoc = createPositionWithColumnOffset(loc.end, -2);
          templateValue = value === null ? null : value.slice(1, -2);
          endToken = new Token({
            type: getExportedToken(23),
            value: "${",
            start: templateElementEnd,
            end,
            startLoc: templateElementEndLoc,
            endLoc: loc.end
          });
        }
        tokens.splice(i, 1, startToken, new Token({
          type: getExportedToken(20),
          value: templateValue,
          start: backquoteEnd,
          end: templateElementEnd,
          startLoc: backquoteEndLoc,
          endLoc: templateElementEndLoc
        }), endToken);
        i += 2;
        continue;
      }

      token.type = getExportedToken(type);
    }
  }
  return tokens;
}
class StatementParser extends ExpressionParser {
  parseTopLevel(file, program) {
    file.program = this.parseProgram(program);
    file.comments = this.state.comments;
    if (this.options.tokens) file.tokens = babel7CompatTokens(this.tokens, this.input);

    return this.finishNode(file, "File");
  }
  parseProgram(program, end = 137, sourceType = this.options.sourceType) {
    program.sourceType = sourceType;
    program.interpreter = this.parseInterpreterDirective();
    this.parseBlockBody(program, true, true, end);
    if (this.inModule && !this.options.allowUndeclaredExports && this.scope.undefinedExports.size > 0)
      for (const [localName, at] of Array.from(this.scope.undefinedExports))
        this.raise(Errors.ModuleExportUndefined, { at, localName });

    return end === 137
      ? this.finishNode(program, "Program")
      : this.finishNodeAt(program, "Program", createPositionWithColumnOffset(this.state.startLoc, -1));
  }
  stmtToDirective(stmt) {
    const directive = stmt;
    directive.type = "Directive";
    directive.value = directive.expression;
    delete directive.expression;
    const directiveLiteral = directive.value,
      expressionValue = directiveLiteral.value,
      raw = this.input.slice(directiveLiteral.start, directiveLiteral.end),
      val = (directiveLiteral.value = raw.slice(1, -1));
    this.addExtra(directiveLiteral, "raw", raw);
    this.addExtra(directiveLiteral, "rawValue", val);
    this.addExtra(directiveLiteral, "expressionValue", expressionValue);
    directiveLiteral.type = "DirectiveLiteral";
    return directive;
  }
  parseInterpreterDirective() {
    if (!this.match(28)) return null;

    const node = this.startNode();
    node.value = this.state.value;
    this.next();
    return this.finishNode(node, "InterpreterDirective");
  }
  isLet() {
    return !!this.isContextual(99) && this.hasFollowingBindingAtom();
  }
  chStartsBindingIdentifier(ch, pos) {
    if (common.isIdentifierStart(ch)) {
      keywordRelationalOperator.lastIndex = pos;
      if (keywordRelationalOperator.test(this.input)) {
        const endCh = this.codePointAtPos(keywordRelationalOperator.lastIndex);
        if (!common.isIdentifierChar(endCh) && endCh !== 92) return false;
      }
      return true;
    }
    return ch === 92;
  }
  chStartsBindingPattern(ch) {
    return ch === 91 || ch === 123;
  }
  hasFollowingBindingAtom() {
    const next = this.nextTokenStart(),
      nextCh = this.codePointAtPos(next);
    return this.chStartsBindingPattern(nextCh) || this.chStartsBindingIdentifier(nextCh, next);
  }
  hasInLineFollowingBindingIdentifier() {
    const next = this.nextTokenInLineStart(),
      nextCh = this.codePointAtPos(next);
    return this.chStartsBindingIdentifier(nextCh, next);
  }
  startsUsingForOf() {
    const { type, containsEsc } = this.lookahead();
    if (type === 101 && !containsEsc) return false;
    if (tokenIsIdentifier(type) && !this.hasFollowingLineBreak()) {
      this.expectPlugin("explicitResourceManagement");
      return true;
    }
  }
  startsAwaitUsing() {
    let next = this.nextTokenInLineStart();
    if (this.isUnparsedContextual(next, "using")) {
      next = this.nextTokenInLineStartSince(next + 5);
      const nextCh = this.codePointAtPos(next);
      if (this.chStartsBindingIdentifier(nextCh, next)) {
        this.expectPlugin("explicitResourceManagement");
        return true;
      }
    }
    return false;
  }
  parseModuleItem() {
    return this.parseStatementLike(
      ParseStatementFlag.AllowImportExport |
        ParseStatementFlag.AllowDeclaration |
        ParseStatementFlag.AllowFunctionDeclaration |
        ParseStatementFlag.AllowLabeledFunction
    );
  }
  parseStatementListItem() {
    return this.parseStatementLike(
      ParseStatementFlag.AllowDeclaration |
        ParseStatementFlag.AllowFunctionDeclaration |
        (!this.options.annexB || this.state.strict ? 0 : ParseStatementFlag.AllowLabeledFunction)
    );
  }
  parseStatementOrSloppyAnnexBFunctionDeclaration(allowLabeledFunction = false) {
    let flags = ParseStatementFlag.StatementOnly;
    if (this.options.annexB && !this.state.strict) {
      flags |= ParseStatementFlag.AllowFunctionDeclaration;
      if (allowLabeledFunction) flags |= ParseStatementFlag.AllowLabeledFunction;
    }
    return this.parseStatementLike(flags);
  }
  parseStatement() {
    return this.parseStatementLike(ParseStatementFlag.StatementOnly);
  }
  parseStatementLike(flags) {
    let decorators = null;
    if (this.match(26)) decorators = this.parseDecorators(true);

    return this.parseStatementContent(flags, decorators);
  }
  parseStatementContent(flags, decorators) {
    const starttype = this.state.type,
      node = this.startNode(),
      allowDeclaration = !!(flags & ParseStatementFlag.AllowDeclaration),
      allowFunctionDeclaration = !!(flags & ParseStatementFlag.AllowFunctionDeclaration),
      topLevel = flags & ParseStatementFlag.AllowImportExport;
    switch (starttype) {
      case 60:
        return this.parseBreakContinueStatement(node, true);
      case 63:
        return this.parseBreakContinueStatement(node, false);
      case 64:
        return this.parseDebuggerStatement(node);
      case 90:
        return this.parseDoWhileStatement(node);
      case 91:
        return this.parseForStatement(node);
      case 68:
        if (this.lookaheadCharCode() === 46) break;
        allowFunctionDeclaration ||
          this.raise(
            this.state.strict
              ? Errors.StrictFunction
              : this.options.annexB
              ? Errors.SloppyFunctionAnnexB
              : Errors.SloppyFunction,
            { at: this.state.startLoc }
          );

        return this.parseFunctionStatement(node, false, !allowDeclaration && allowFunctionDeclaration);
      case 80:
        allowDeclaration || this.unexpected();
        return this.parseClass(this.maybeTakeDecorators(decorators, node), true);
      case 69:
        return this.parseIfStatement(node);
      case 70:
        return this.parseReturnStatement(node);
      case 71:
        return this.parseSwitchStatement(node);
      case 72:
        return this.parseThrowStatement(node);
      case 73:
        return this.parseTryStatement(node);
      case 96:
        if (!this.state.containsEsc && this.startsAwaitUsing()) {
          this.isAwaitAllowed()
            ? allowDeclaration || this.raise(Errors.UnexpectedLexicalDeclaration, { at: node })
            : this.raise(Errors.AwaitUsingNotInAsyncContext, { at: node });

          this.next();
          return this.parseVarStatement(node, "await using");
        }
        break;
      case 105:
        if (this.state.containsEsc || !this.hasInLineFollowingBindingIdentifier()) break;

        this.expectPlugin("explicitResourceManagement");
        !this.scope.inModule && this.scope.inTopLevel
          ? this.raise(Errors.UnexpectedUsingDeclaration, { at: this.state.startLoc })
          : allowDeclaration || this.raise(Errors.UnexpectedLexicalDeclaration, { at: this.state.startLoc });

        return this.parseVarStatement(node, "using");
      case 99: {
        if (this.state.containsEsc) break;

        const next = this.nextTokenStart(),
          nextCh = this.codePointAtPos(next);
        if (nextCh !== 91) {
          if (!allowDeclaration && this.hasFollowingLineBreak()) break;
          if (!this.chStartsBindingIdentifier(nextCh, next) && nextCh !== 123) break;
        }
      }
      case 75:
        allowDeclaration || this.raise(Errors.UnexpectedLexicalDeclaration, { at: this.state.startLoc });

      case 74: {
        const kind = this.state.value;
        return this.parseVarStatement(node, kind);
      }
      case 92:
        return this.parseWhileStatement(node);
      case 76:
        return this.parseWithStatement(node);
      case 5:
        return this.parseBlock();
      case 13:
        return this.parseEmptyStatement(node);
      case 83: {
        const nextTokenCharCode = this.lookaheadCharCode();
        if (nextTokenCharCode === 40 || nextTokenCharCode === 46) break;
      }
      case 82: {
        this.options.allowImportExportEverywhere || topLevel ||
          this.raise(Errors.UnexpectedImportExport, { at: this.state.startLoc });

        this.next();
        let result;
        if (starttype === 83) {
          result = this.parseImport(node);
          result.type !== "ImportDeclaration" || (result.importKind && result.importKind !== "value") ||
            (this.sawUnambiguousESM = true);
        } else {
          result = this.parseExport(node, decorators);

          ((result.type !== "ExportNamedDeclaration" || (result.exportKind && result.exportKind !== "value")) &&
            (result.type !== "ExportAllDeclaration" || (result.exportKind && result.exportKind !== "value")) &&
            result.type !== "ExportDefaultDeclaration") ||
            (this.sawUnambiguousESM = true);
        }
        this.assertModuleNodeAllowed(result);
        return result;
      }
      default:
        if (this.isAsyncFunction()) {
          allowDeclaration || this.raise(Errors.AsyncFunctionInSingleStatementContext, { at: this.state.startLoc });

          this.next();
          return this.parseFunctionStatement(node, true, !allowDeclaration && allowFunctionDeclaration);
        }
    }
    const maybeName = this.state.value,
      expr = this.parseExpression();

    return tokenIsIdentifier(starttype) && expr.type === "Identifier" && this.eat(14)
      ? this.parseLabeledStatement(node, maybeName, expr, flags)
      : this.parseExpressionStatement(node, expr, decorators);
  }
  assertModuleNodeAllowed(node) {
    this.options.allowImportExportEverywhere || this.inModule || this.raise(Errors.ImportOutsideModule, { at: node });
  }
  decoratorsEnabledBeforeExport() {
    return !!this.hasPlugin("decorators-legacy") ||
      (this.hasPlugin("decorators") && this.getPluginOption("decorators", "decoratorsBeforeExport") !== false);
  }
  maybeTakeDecorators(maybeDecorators, classNode, exportNode) {
    if (maybeDecorators) {
      if (classNode.decorators && classNode.decorators.length > 0) {
        typeof this.getPluginOption("decorators", "decoratorsBeforeExport") == "boolean" ||
          this.raise(Errors.DecoratorsBeforeAfterExport, { at: classNode.decorators[0] });

        classNode.decorators.unshift(...maybeDecorators);
      } else classNode.decorators = maybeDecorators;

      this.resetStartLocationFromNode(classNode, maybeDecorators[0]);
      exportNode && this.resetStartLocationFromNode(exportNode, classNode);
    }
    return classNode;
  }
  canHaveLeadingDecorator() {
    return this.match(80);
  }
  parseDecorators(allowExport) {
    const decorators = [];
    do {
      decorators.push(this.parseDecorator());
    } while (this.match(26));
    if (this.match(82)) {
      allowExport || this.unexpected();

      this.decoratorsEnabledBeforeExport() || this.raise(Errors.DecoratorExportClass, { at: this.state.startLoc });
    } else if (!this.canHaveLeadingDecorator())
      throw this.raise(Errors.UnexpectedLeadingDecorator, { at: this.state.startLoc });

    return decorators;
  }
  parseDecorator() {
    this.expectOnePlugin(["decorators", "decorators-legacy"]);
    const node = this.startNode();
    this.next();
    if (this.hasPlugin("decorators")) {
      const startLoc = this.state.startLoc;
      let expr;
      if (this.match(10)) {
        const startLoc = this.state.startLoc;
        this.next();
        expr = this.parseExpression();
        this.expect(11);
        expr = this.wrapParenthesis(startLoc, expr);
        const paramsStartLoc = this.state.startLoc;
        node.expression = this.parseMaybeDecoratorArguments(expr);
        this.getPluginOption("decorators", "allowCallParenthesized") !== false || node.expression === expr ||
          this.raise(Errors.DecoratorArgumentsOutsideParentheses, { at: paramsStartLoc });
      } else {
        expr = this.parseIdentifier(false);
        while (this.eat(16)) {
          const node = this.startNodeAt(startLoc);
          node.object = expr;
          if (this.match(136)) {
            this.classScope.usePrivateName(this.state.value, this.state.startLoc);
            node.property = this.parsePrivateName();
          } else node.property = this.parseIdentifier(true);

          node.computed = false;
          expr = this.finishNode(node, "MemberExpression");
        }
        node.expression = this.parseMaybeDecoratorArguments(expr);
      }
    } else node.expression = this.parseExprSubscripts();

    return this.finishNode(node, "Decorator");
  }
  parseMaybeDecoratorArguments(expr) {
    if (this.eat(10)) {
      const node = this.startNodeAtNode(expr);
      node.callee = expr;
      node.arguments = this.parseCallExpressionArguments(11, false);
      this.toReferencedList(node.arguments);
      return this.finishNode(node, "CallExpression");
    }
    return expr;
  }
  parseBreakContinueStatement(node, isBreak) {
    this.next();
    if (this.isLineTerminator()) node.label = null;
    else {
      node.label = this.parseIdentifier();
      this.semicolon();
    }
    this.verifyBreakContinue(node, isBreak);
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
  }
  verifyBreakContinue(node, isBreak) {
    let i;
    for (i = 0; i < this.state.labels.length; ++i) {
      const lab = this.state.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
        if (node.label && isBreak) break;
      }
    }
    if (i === this.state.labels.length) {
      const type = isBreak ? "BreakStatement" : "ContinueStatement";
      this.raise(Errors.IllegalBreakContinue, { at: node, type });
    }
  }
  parseDebuggerStatement(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement");
  }
  parseHeaderExpression() {
    this.expect(10);
    const val = this.parseExpression();
    this.expect(11);
    return val;
  }
  parseDoWhileStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.state.labels.pop();
    this.expect(92);
    node.test = this.parseHeaderExpression();
    this.eat(13);
    return this.finishNode(node, "DoWhileStatement");
  }
  parseForStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    let awaitAt = null;
    if (this.isAwaitAllowed() && this.eatContextual(96)) awaitAt = this.state.lastTokStartLoc;

    this.scope.enter(ScopeFlag.OTHER);
    this.expect(10);
    if (this.match(13)) {
      awaitAt === null || this.unexpected(awaitAt);

      return this.parseFor(node, null);
    }
    const startsWithLet = this.isContextual(99);
    //{
    const startsWithAwaitUsing = this.isContextual(96) && this.startsAwaitUsing(),
      starsWithUsingDeclaration = startsWithAwaitUsing || (this.isContextual(105) && this.startsUsingForOf()),
      isLetOrUsing = (startsWithLet && this.hasFollowingBindingAtom()) || starsWithUsingDeclaration;
    if (this.match(74) || this.match(75) || isLetOrUsing) {
      const initNode = this.startNode();
      let kind;
      if (startsWithAwaitUsing) {
        kind = "await using";
        this.isAwaitAllowed() || this.raise(Errors.AwaitUsingNotInAsyncContext, { at: this.state.startLoc });

        this.next();
      } else kind = this.state.value;

      this.next();
      this.parseVar(initNode, true, kind);
      const init = this.finishNode(initNode, "VariableDeclaration"),
        isForIn = this.match(58);
      isForIn && starsWithUsingDeclaration && this.raise(Errors.ForInUsing, { at: init });

      if ((isForIn || this.isContextual(101)) && init.declarations.length === 1)
        return this.parseForIn(node, init, awaitAt);

      awaitAt === null || this.unexpected(awaitAt);

      return this.parseFor(node, init);
    }
    //}
    const startsWithAsync = this.isContextual(95),
      refExpressionErrors = new ExpressionErrors(),
      init = this.parseExpression(true, refExpressionErrors),
      isForOf = this.isContextual(101);
    if (isForOf) {
      startsWithLet && this.raise(Errors.ForOfLet, { at: init });

      awaitAt === null && startsWithAsync && init.type === "Identifier" &&
        this.raise(Errors.ForOfAsync, { at: init });
    }
    if (isForOf || this.match(58)) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.toAssignable(init, true);
      const type = isForOf ? "ForOfStatement" : "ForInStatement";
      this.checkLVal(init, { in: { type } });
      return this.parseForIn(node, init, awaitAt);
    }
    this.checkExpressionErrors(refExpressionErrors, true);

    awaitAt === null || this.unexpected(awaitAt);

    return this.parseFor(node, init);
  }
  parseFunctionStatement(node, isAsync, isHangingDeclaration) {
    this.next();
    return this.parseFunction(
      node,
      ParseFunctionFlag.Declaration |
        (isHangingDeclaration ? ParseFunctionFlag.HangingDeclaration : 0) |
        (isAsync ? ParseFunctionFlag.Async : 0)
    );
  }
  parseIfStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    node.consequent = this.parseStatementOrSloppyAnnexBFunctionDeclaration();
    node.alternate = this.eat(66) ? this.parseStatementOrSloppyAnnexBFunctionDeclaration() : null;
    return this.finishNode(node, "IfStatement");
  }
  parseReturnStatement(node) {
    this.prodParam.hasReturn || this.options.allowReturnOutsideFunction ||
      this.raise(Errors.IllegalReturn, { at: this.state.startLoc });

    this.next();
    if (this.isLineTerminator()) node.argument = null;
    else {
      node.argument = this.parseExpression();
      this.semicolon();
    }
    return this.finishNode(node, "ReturnStatement");
  }
  parseSwitchStatement(node) {
    this.next();
    node.discriminant = this.parseHeaderExpression();
    // noinspection JSMismatchedCollectionQueryUpdate
    const cases = (node.cases = []);
    this.expect(5);
    this.state.labels.push(switchLabel);
    this.scope.enter(ScopeFlag.OTHER);
    let cur;
    for (let sawDefault; !this.match(8); )
      if (this.match(61) || this.match(65)) {
        const isCase = this.match(61);
        cur && this.finishNode(cur, "SwitchCase");
        cases.push((cur = this.startNode()));
        cur.consequent = [];
        this.next();
        if (isCase) cur.test = this.parseExpression();
        else {
          sawDefault && this.raise(Errors.MultipleDefaultsInSwitch, { at: this.state.lastTokStartLoc });

          sawDefault = true;
          cur.test = null;
        }
        this.expect(14);
      } else cur ? cur.consequent.push(this.parseStatementListItem()) : this.unexpected();

    this.scope.exit();
    cur && this.finishNode(cur, "SwitchCase");
    this.next();
    this.state.labels.pop();
    return this.finishNode(node, "SwitchStatement");
  }
  parseThrowStatement(node) {
    this.next();
    this.hasPrecedingLineBreak() && this.raise(Errors.NewlineAfterThrow, { at: this.state.lastTokEndLoc });

    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement");
  }
  parseCatchClauseParam() {
    const param = this.parseBindingAtom();
    this.scope.enter(this.options.annexB && param.type === "Identifier" ? ScopeFlag.SIMPLE_CATCH : 0);
    this.checkLVal(param, { in: { type: "CatchClause" }, binding: BindingFlag.TYPE_CATCH_PARAM });
    return param;
  }
  parseTryStatement(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.match(62)) {
      const clause = this.startNode();
      this.next();
      if (this.match(10)) {
        this.expect(10);
        clause.param = this.parseCatchClauseParam();
        this.expect(11);
      } else {
        clause.param = null;
        this.scope.enter(ScopeFlag.OTHER);
      }
      clause.body = this.withSmartMixTopicForbiddingContext(() => this.parseBlock(false, false));
      this.scope.exit();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(67) ? this.parseBlock() : null;
    node.handler || node.finalizer || this.raise(Errors.NoCatchOrFinally, { at: node });

    return this.finishNode(node, "TryStatement");
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    this.next();
    this.parseVar(node, false, kind, allowMissingInitializer);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration");
  }
  parseWhileStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    this.state.labels.push(loopLabel);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.state.labels.pop();
    return this.finishNode(node, "WhileStatement");
  }
  parseWithStatement(node) {
    this.state.strict && this.raise(Errors.StrictWith, { at: this.state.startLoc });

    this.next();
    node.object = this.parseHeaderExpression();
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    return this.finishNode(node, "WithStatement");
  }
  parseEmptyStatement(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement");
  }
  parseLabeledStatement(node, maybeName, expr, flags) {
    for (const label of this.state.labels)
      label.name !== maybeName || this.raise(Errors.LabelRedeclaration, { at: expr, labelName: maybeName });

    const kind = tokenIsLoop(this.state.type) ? "loop" : this.match(71) ? "switch" : null;
    for (let i = this.state.labels.length - 1; i >= 0; i--) {
      const label = this.state.labels[i];
      if (label.statementStart !== node.start) break;

      label.statementStart = this.state.start;
      label.kind = kind;
    }
    this.state.labels.push({ name: maybeName, kind, statementStart: this.state.start });
    node.body =
      flags & ParseStatementFlag.AllowLabeledFunction
        ? this.parseStatementOrSloppyAnnexBFunctionDeclaration(true)
        : this.parseStatement();
    this.state.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement");
  }
  parseExpressionStatement(node, expr, _decorators) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement");
  }
  parseBlock(allowDirectives = false, createNewLexicalScope = true, afterBlockParse) {
    const node = this.startNode();
    allowDirectives && this.state.strictErrors.clear();

    this.expect(5);
    createNewLexicalScope && this.scope.enter(ScopeFlag.OTHER);

    this.parseBlockBody(node, allowDirectives, false, 8, afterBlockParse);
    createNewLexicalScope && this.scope.exit();

    return this.finishNode(node, "BlockStatement");
  }
  isValidDirective(stmt) {
    return (
      stmt.type === "ExpressionStatement" &&
      stmt.expression.type === "StringLiteral" &&
      !stmt.expression.extra.parenthesized
    );
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    const body = (node.body = []),
      directives = (node.directives = []);
    this.parseBlockOrModuleBlockBody(body, allowDirectives ? directives : void 0, topLevel, end, afterBlockParse);
  }
  parseBlockOrModuleBlockBody(body, directives, topLevel, end, afterBlockParse) {
    const oldStrict = this.state.strict;
    let hasStrictModeDirective = false,
      parsedNonDirective = false;
    while (!this.match(end)) {
      const stmt = topLevel ? this.parseModuleItem() : this.parseStatementListItem();
      if (directives && !parsedNonDirective) {
        if (this.isValidDirective(stmt)) {
          const directive = this.stmtToDirective(stmt);
          directives.push(directive);
          if (!hasStrictModeDirective && directive.value.value === "use strict") {
            hasStrictModeDirective = true;
            this.setStrict(true);
          }
          continue;
        }
        parsedNonDirective = true;
        this.state.strictErrors.clear();
      }
      body.push(stmt);
    }
    afterBlockParse == null || afterBlockParse.call(this, hasStrictModeDirective);
    oldStrict || this.setStrict(false);

    this.next();
  }
  parseFor(node, init) {
    node.init = init;
    this.semicolon(false);
    node.test = this.match(13) ? null : this.parseExpression();
    this.semicolon(false);
    node.update = this.match(11) ? null : this.parseExpression();
    this.expect(11);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, "ForStatement");
  }
  parseForIn(node, init, awaitAt) {
    const isForIn = this.match(58);
    this.next();
    isForIn ? awaitAt === null || this.unexpected(awaitAt) : (node.await = awaitAt !== null);

    init.type !== "VariableDeclaration" ||
      init.declarations[0].init == null ||
      (isForIn &&
        this.options.annexB &&
        !this.state.strict &&
        init.kind === "var" &&
        init.declarations[0].id.type === "Identifier") ||
      this.raise(Errors.ForInOfLoopInitializer, { at: init, type: isForIn ? "ForInStatement" : "ForOfStatement" });

    init.type !== "AssignmentPattern" ||
      this.raise(Errors.InvalidLhs, { at: init, ancestor: { type: "ForStatement" } });

    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssignAllowIn();
    this.expect(11);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
  }
  parseVar(node, isFor, kind, allowMissingInitializer = false) {
    // noinspection JSMismatchedCollectionQueryUpdate
    const declarations = (node.declarations = []);
    node.kind = kind;
    for (;;) {
      const decl = this.startNode();
      this.parseVarId(decl, kind);
      decl.init = !this.eat(29) ? null : isFor ? this.parseMaybeAssignDisallowIn() : this.parseMaybeAssignAllowIn();
      decl.init !== null || allowMissingInitializer ||
        (decl.id.type !== "Identifier" && !(isFor && (this.match(58) || this.isContextual(101)))
          ? this.raise(Errors.DeclarationMissingInitializer, { at: this.state.lastTokEndLoc, kind: "destructuring" })
          : kind !== "const" || this.match(58) || this.isContextual(101) ||
            this.raise(Errors.DeclarationMissingInitializer, { at: this.state.lastTokEndLoc, kind: "const" }));

      declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(12)) break;
    }
    return node;
  }
  parseVarId(decl, kind) {
    const id = this.parseBindingAtom();
    this.checkLVal(id, {
      in: { type: "VariableDeclarator" },
      binding: kind === "var" ? BindingFlag.TYPE_VAR : BindingFlag.TYPE_LEXICAL
    });
    decl.id = id;
  }
  parseAsyncFunctionExpression(node) {
    return this.parseFunction(node, ParseFunctionFlag.Async);
  }
  parseFunction(node, flags = ParseFunctionFlag.Expression) {
    const hangingDeclaration = flags & ParseFunctionFlag.HangingDeclaration,
      isDeclaration = !!(flags & ParseFunctionFlag.Declaration),
      requireId = isDeclaration && !(flags & ParseFunctionFlag.NullableId),
      isAsync = !!(flags & ParseFunctionFlag.Async);
    this.initFunction(node, isAsync);
    if (this.match(55)) {
      hangingDeclaration && this.raise(Errors.GeneratorInSingleStatementContext, { at: this.state.startLoc });

      this.next();
      node.generator = true;
    }
    if (isDeclaration) node.id = this.parseFunctionId(requireId);

    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    this.state.maybeInArrowParameters = false;
    this.scope.enter(ScopeFlag.FUNCTION);
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    isDeclaration || (node.id = this.parseFunctionId());

    this.parseFunctionParams(node, false);
    this.withSmartMixTopicForbiddingContext(() => {
      this.parseFunctionBodyAndFinish(node, isDeclaration ? "FunctionDeclaration" : "FunctionExpression");
    });
    this.prodParam.exit();
    this.scope.exit();
    !isDeclaration || hangingDeclaration || this.registerFunctionStatementId(node);

    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return node;
  }
  parseFunctionId(requireId) {
    return requireId || tokenIsIdentifier(this.state.type) ? this.parseIdentifier() : null;
  }
  parseFunctionParams(node, isConstructor) {
    this.expect(10);
    this.expressionScope.enter(newParameterDeclarationScope());
    node.params = this.parseBindingList(11, 41,
      ParseBindingListFlags.IS_FUNCTION_PARAMS | (isConstructor ? ParseBindingListFlags.IS_CONSTRUCTOR_PARAMS : 0)
    );
    this.expressionScope.exit();
  }
  registerFunctionStatementId(node) {
    if (!node.id) return;
    this.scope.declareName(
      node.id.name,
      !this.options.annexB || this.state.strict || node.generator || node.async
        ? this.scope.treatFunctionsAsVar
          ? BindingFlag.TYPE_VAR
          : BindingFlag.TYPE_LEXICAL
        : BindingFlag.TYPE_FUNCTION,
      node.id.loc.start
    );
  }
  parseClass(node, isStatement, optionalId) {
    this.next();
    const oldStrict = this.state.strict;
    this.state.strict = true;
    this.parseClassId(node, isStatement, optionalId);
    this.parseClassSuper(node);
    node.body = this.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
  }
  isClassProperty() {
    return this.match(29) || this.match(13) || this.match(8);
  }
  isClassMethod() {
    return this.match(10);
  }
  isNonstaticConstructor(method) {
    return !(
      method.computed || method.static || (method.key.name !== "constructor" && method.key.value !== "constructor")
    );
  }
  parseClassBody(hadSuperClass, oldStrict) {
    this.classScope.enter();
    const state = { hadConstructor: false, hadSuperClass };
    let decorators = [];
    const classBody = this.startNode();
    classBody.body = [];
    this.expect(5);
    this.withSmartMixTopicForbiddingContext(() => {
      while (!this.match(8)) {
        if (this.eat(13)) {
          if (decorators.length > 0) throw this.raise(Errors.DecoratorSemicolon, { at: this.state.lastTokEndLoc });

          continue;
        }
        if (this.match(26)) {
          decorators.push(this.parseDecorator());
          continue;
        }
        const member = this.startNode();
        if (decorators.length) {
          member.decorators = decorators;
          this.resetStartLocationFromNode(member, decorators[0]);
          decorators = [];
        }
        this.parseClassMember(classBody, member, state);
        member.kind === "constructor" && member.decorators && member.decorators.length > 0 &&
          this.raise(Errors.DecoratorConstructor, { at: member });
      }
    });
    this.state.strict = oldStrict;
    this.next();
    if (decorators.length) throw this.raise(Errors.TrailingDecorator, { at: this.state.startLoc });

    this.classScope.exit();
    return this.finishNode(classBody, "ClassBody");
  }
  parseClassMemberFromModifier(classBody, member) {
    const key = this.parseIdentifier(true);
    if (this.isClassMethod()) {
      const method = member;
      method.kind = "method";
      method.computed = false;
      method.key = key;
      method.static = false;
      this.pushClassMethod(classBody, method, false, false, false, false);
      return true;
    }
    if (this.isClassProperty()) {
      const prop = member;
      prop.computed = false;
      prop.key = key;
      prop.static = false;
      classBody.body.push(this.parseClassProperty(prop));
      return true;
    }
    this.resetPreviousNodeTrailingComments(key);
    return false;
  }
  parseClassMember(classBody, member, state) {
    const isStatic = this.isContextual(104);
    if (isStatic) {
      if (this.parseClassMemberFromModifier(classBody, member)) return;

      if (this.eat(5)) {
        this.parseClassStaticBlock(classBody, member);
        return;
      }
    }
    this.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const publicMethod = member,
      privateMethod = member,
      publicProp = member,
      privateProp = member,
      accessorProp = member,
      method = publicMethod,
      publicMember = publicMethod;
    member.static = isStatic;
    this.parsePropertyNamePrefixOperator(member);
    if (this.eat(55)) {
      method.kind = "method";
      const isPrivateName = this.match(136);
      this.parseClassElementName(method);
      if (isPrivateName) {
        this.pushClassPrivateMethod(classBody, privateMethod, true, false);
        return;
      }
      this.isNonstaticConstructor(publicMethod) &&
        this.raise(Errors.ConstructorIsGenerator, { at: publicMethod.key });

      this.pushClassMethod(classBody, publicMethod, true, false, false, false);
      return;
    }
    const isContextual = tokenIsIdentifier(this.state.type) && !this.state.containsEsc,
      isPrivate = this.match(136),
      key = this.parseClassElementName(member),
      maybeQuestionTokenStartLoc = this.state.startLoc;
    this.parsePostMemberNameModifiers(publicMember);
    if (this.isClassMethod()) {
      method.kind = "method";
      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
        return;
      }
      const isConstructor = this.isNonstaticConstructor(publicMethod);
      let allowsDirectSuper = false;
      if (isConstructor) {
        publicMethod.kind = "constructor";
        !state.hadConstructor || this.hasPlugin("typescript") || this.raise(Errors.DuplicateConstructor, { at: key });

        isConstructor && this.hasPlugin("typescript") && member.override &&
          this.raise(Errors.OverrideOnConstructor, { at: key });

        state.hadConstructor = true;
        allowsDirectSuper = state.hadSuperClass;
      }
      this.pushClassMethod(classBody, publicMethod, false, false, isConstructor, allowsDirectSuper);
    } else if (this.isClassProperty())
      isPrivate
        ? this.pushClassPrivateProperty(classBody, privateProp)
        : this.pushClassProperty(classBody, publicProp);
    else if (isContextual && key.name === "async" && !this.isLineTerminator()) {
      this.resetPreviousNodeTrailingComments(key);
      const isGenerator = this.eat(55);
      publicMember.optional && this.unexpected(maybeQuestionTokenStartLoc);

      method.kind = "method";
      const isPrivate = this.match(136);
      this.parseClassElementName(method);
      this.parsePostMemberNameModifiers(publicMember);
      if (isPrivate) this.pushClassPrivateMethod(classBody, privateMethod, isGenerator, true);
      else {
        this.isNonstaticConstructor(publicMethod) && this.raise(Errors.ConstructorIsAsync, { at: publicMethod.key });

        this.pushClassMethod(classBody, publicMethod, isGenerator, true, false, false);
      }
    } else if (
      isContextual &&
      (key.name === "get" || key.name === "set") &&
      !(this.match(55) && this.isLineTerminator())
    ) {
      this.resetPreviousNodeTrailingComments(key);
      method.kind = key.name;
      const isPrivate = this.match(136);
      this.parseClassElementName(publicMethod);
      if (isPrivate) this.pushClassPrivateMethod(classBody, privateMethod, false, false);
      else {
        this.isNonstaticConstructor(publicMethod) &&
          this.raise(Errors.ConstructorIsAccessor, { at: publicMethod.key });

        this.pushClassMethod(classBody, publicMethod, false, false, false, false);
      }
      this.checkGetterSetterParams(publicMethod);
    } else if (isContextual && key.name === "accessor" && !this.isLineTerminator()) {
      this.expectPlugin("decoratorAutoAccessors");
      this.resetPreviousNodeTrailingComments(key);
      const isPrivate = this.match(136);
      this.parseClassElementName(publicProp);
      this.pushClassAccessorProperty(classBody, accessorProp, isPrivate);
    } else
      this.isLineTerminator()
      ? isPrivate
        ? this.pushClassPrivateProperty(classBody, privateProp)
        : this.pushClassProperty(classBody, publicProp)
      : this.unexpected();
  }
  parseClassElementName(member) {
    const { type, value } = this.state;
    (type !== 130 && type !== 131) || !member.static || value !== "prototype" ||
      this.raise(Errors.StaticPrototype, { at: this.state.startLoc });

    if (type === 136) {
      value !== "constructor" || this.raise(Errors.ConstructorClassPrivateField, { at: this.state.startLoc });

      const key = this.parsePrivateName();
      member.key = key;
      return key;
    }
    return this.parsePropertyName(member);
  }
  parseClassStaticBlock(classBody, member) {
    var _member$decorators;
    this.scope.enter(ScopeFlag.CLASS | ScopeFlag.STATIC_BLOCK | ScopeFlag.SUPER);
    const oldLabels = this.state.labels;
    this.state.labels = [];
    this.prodParam.enter(PARAM);
    const body = (member.body = []);
    this.parseBlockOrModuleBlockBody(body, void 0, false, 8);
    this.prodParam.exit();
    this.scope.exit();
    this.state.labels = oldLabels;
    classBody.body.push(this.finishNode(member, "StaticBlock"));
    (_member$decorators = member.decorators) != null && _member$decorators.length &&
      this.raise(Errors.DecoratorStaticBlock, { at: member });
  }
  pushClassProperty(classBody, prop) {
    prop.computed || (prop.key.name !== "constructor" && prop.key.value !== "constructor") ||
      this.raise(Errors.ConstructorClassField, { at: prop.key });

    classBody.body.push(this.parseClassProperty(prop));
  }
  pushClassPrivateProperty(classBody, prop) {
    const node = this.parseClassPrivateProperty(prop);
    classBody.body.push(node);
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), ClassElementType.OTHER, node.key.loc.start);
  }
  pushClassAccessorProperty(classBody, prop, isPrivate) {
    if (!isPrivate && !prop.computed) {
      const key = prop.key;
      (key.name !== "constructor" && key.value !== "constructor") ||
        this.raise(Errors.ConstructorClassField, { at: key });
    }
    const node = this.parseClassAccessorProperty(prop);
    classBody.body.push(node);
    isPrivate &&
      this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), ClassElementType.OTHER, node.key.loc.start);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    classBody.body.push(
      this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true)
    );
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const node = this.parseMethod(method, isGenerator, isAsync, false, false, "ClassPrivateMethod", true);
    classBody.body.push(node);
    const kind = node.kind === "get"
      ? node.static
        ? ClassElementType.STATIC_GETTER
        : ClassElementType.INSTANCE_GETTER
      : node.kind === "set"
      ? node.static
        ? ClassElementType.STATIC_SETTER
        : ClassElementType.INSTANCE_SETTER
      : ClassElementType.OTHER;
    this.declareClassPrivateMethodInScope(node, kind);
  }
  declareClassPrivateMethodInScope(node, kind) {
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), kind, node.key.loc.start);
  }
  /** @param {*} methodOrProp */
  parsePostMemberNameModifiers(methodOrProp) {}
  parseClassPrivateProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassPrivateProperty");
  }
  parseClassProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassProperty");
  }
  parseClassAccessorProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassAccessorProperty");
  }
  parseInitializer(node) {
    this.scope.enter(ScopeFlag.CLASS | ScopeFlag.SUPER);
    this.expressionScope.enter(newExpressionScope());
    this.prodParam.enter(PARAM);
    node.value = this.eat(29) ? this.parseMaybeAssignAllowIn() : null;
    this.expressionScope.exit();
    this.prodParam.exit();
    this.scope.exit();
  }
  parseClassId(node, isStatement, optionalId, bindingType = BindingFlag.TYPE_CLASS) {
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      isStatement && this.declareNameFromIdentifier(node.id, bindingType);
    } else {
      if (!optionalId && isStatement) throw this.raise(Errors.MissingClassName, { at: this.state.startLoc });

      node.id = null;
    }
  }
  parseClassSuper(node) {
    node.superClass = this.eat(81) ? this.parseExprSubscripts() : null;
  }
  parseExport(node, decorators) {
    const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, true),
      hasDefault = this.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier),
      parseAfterDefault = !hasDefault || this.eat(12),
      hasStar = parseAfterDefault && this.eatExportStar(node),
      hasNamespace = hasStar && this.maybeParseExportNamespaceSpecifier(node),
      parseAfterNamespace = parseAfterDefault && (!hasNamespace || this.eat(12)),
      isFromRequired = hasDefault || hasStar;
    if (hasStar && !hasNamespace) {
      hasDefault && this.unexpected();
      if (decorators) throw this.raise(Errors.UnsupportedDecoratorExport, { at: node });

      this.parseExportFrom(node, true);
      return this.finishNode(node, "ExportAllDeclaration");
    }
    const hasSpecifiers = this.maybeParseExportNamedSpecifiers(node);
    !hasDefault || !parseAfterDefault || hasStar || hasSpecifiers || this.unexpected(null, 5);

    hasNamespace && parseAfterNamespace && this.unexpected(null, 97);

    let hasDeclaration;
    if (isFromRequired || hasSpecifiers) {
      hasDeclaration = false;
      if (decorators) throw this.raise(Errors.UnsupportedDecoratorExport, { at: node });

      this.parseExportFrom(node, isFromRequired);
    } else hasDeclaration = this.maybeParseExportDeclaration(node);

    if (isFromRequired || hasSpecifiers || hasDeclaration) {
      var _node2$declaration;
      const node2 = node;
      this.checkExport(node2, true, false, !!node2.source);
      if (((_node2$declaration = node2.declaration) == null ? void 0 : _node2$declaration.type) === "ClassDeclaration")
        this.maybeTakeDecorators(decorators, node2.declaration, node2);
      else if (decorators) throw this.raise(Errors.UnsupportedDecoratorExport, { at: node });

      return this.finishNode(node2, "ExportNamedDeclaration");
    }
    if (this.eat(65)) {
      const node2 = node,
        decl = this.parseExportDefaultExpression();
      node2.declaration = decl;
      if (decl.type === "ClassDeclaration") this.maybeTakeDecorators(decorators, decl, node2);
      else if (decorators) throw this.raise(Errors.UnsupportedDecoratorExport, { at: node });

      this.checkExport(node2, true, true);
      return this.finishNode(node2, "ExportDefaultDeclaration");
    }
    this.unexpected(null, 5);
  }
  /** @param {*} node */
  eatExportStar(node) {
    return this.eat(55);
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier || this.isExportDefaultSpecifier()) {
      this.expectPlugin(
        "exportDefaultFrom",
        maybeDefaultIdentifier == null ? void 0 : maybeDefaultIdentifier.loc.start
      );
      const id = maybeDefaultIdentifier || this.parseIdentifier(true),
        specifier = this.startNodeAtNode(id);
      specifier.exported = id;
      node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    if (this.isContextual(93)) {
      node.specifiers || (node.specifiers = []);
      const specifier = this.startNodeAt(this.state.lastTokStartLoc);
      this.next();
      specifier.exported = this.parseModuleExportName();
      node.specifiers.push(this.finishNode(specifier, "ExportNamespaceSpecifier"));
      return true;
    }
    return false;
  }
  maybeParseExportNamedSpecifiers(node) {
    if (this.match(5)) {
      node.specifiers || (node.specifiers = []);
      const isTypeExport = node.exportKind === "type";
      node.specifiers.push(...this.parseExportSpecifiers(isTypeExport));
      node.source = null;
      node.declaration = null;
      if (this.hasPlugin("importAssertions")) node.assertions = [];

      return true;
    }
    return false;
  }
  maybeParseExportDeclaration(node) {
    if (this.shouldParseExportDeclaration()) {
      node.specifiers = [];
      node.source = null;
      if (this.hasPlugin("importAssertions")) node.assertions = [];

      node.declaration = this.parseExportDeclaration(node);
      return true;
    }
    return false;
  }
  isAsyncFunction() {
    if (!this.isContextual(95)) return false;
    const next = this.nextTokenInLineStart();
    return this.isUnparsedContextual(next, "function");
  }
  parseExportDefaultExpression() {
    const expr = this.startNode();
    if (this.match(68)) {
      this.next();
      return this.parseFunction(expr, ParseFunctionFlag.Declaration | ParseFunctionFlag.NullableId);
    }
    if (this.isAsyncFunction()) {
      this.next();
      this.next();
      return this.parseFunction(
        expr,
        ParseFunctionFlag.Declaration | ParseFunctionFlag.NullableId | ParseFunctionFlag.Async
      );
    }
    if (this.match(80)) return this.parseClass(expr, true, true);

    if (this.match(26)) {
      this.hasPlugin("decorators") && this.getPluginOption("decorators", "decoratorsBeforeExport") === true &&
        this.raise(Errors.DecoratorBeforeExport, { at: this.state.startLoc });

      return this.parseClass(this.maybeTakeDecorators(this.parseDecorators(false), this.startNode()), true, true);
    }
    if (this.match(75) || this.match(74) || this.isLet())
      throw this.raise(Errors.UnsupportedDefaultExport, { at: this.state.startLoc });

    const res = this.parseMaybeAssignAllowIn();
    this.semicolon();
    return res;
  }
  /** @param {*} node */
  parseExportDeclaration(node) {
    return this.match(80) ? this.parseClass(this.startNode(), true, false) : this.parseStatementListItem();
  }
  isExportDefaultSpecifier() {
    const { type } = this.state;
    if (tokenIsIdentifier(type)) {
      if ((type === 95 && !this.state.containsEsc) || type === 99) return false;

      if ((type === 128 || type === 127) && !this.state.containsEsc) {
        const { type: nextType } = this.lookahead();
        if ((tokenIsIdentifier(nextType) && nextType !== 97) || nextType === 5) {
          this.expectOnePlugin(["flow", "typescript"]);
          return false;
        }
      }
    } else if (!this.match(65)) return false;

    const next = this.nextTokenStart(),
      hasFrom = this.isUnparsedContextual(next, "from");
    if (this.input.charCodeAt(next) === 44 || (tokenIsIdentifier(this.state.type) && hasFrom)) return true;

    if (this.match(65) && hasFrom) {
      const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
      return nextAfterFrom === 34 || nextAfterFrom === 39;
    }
    return false;
  }
  parseExportFrom(node, expect) {
    if (this.eatContextual(97)) {
      node.source = this.parseImportSource();
      this.checkExport(node);
      this.maybeParseImportAttributes(node);
      this.checkJSONModuleImport(node);
    } else expect && this.unexpected();

    this.semicolon();
  }
  shouldParseExportDeclaration() {
    const { type } = this.state;
    if (type === 26) {
      this.expectOnePlugin(["decorators", "decorators-legacy"]);
      if (this.hasPlugin("decorators")) {
        this.getPluginOption("decorators", "decoratorsBeforeExport") !== true ||
          this.raise(Errors.DecoratorBeforeExport, { at: this.state.startLoc });

        return true;
      }
    }
    return type === 74 || type === 75 || type === 68 || type === 80 || this.isLet() || this.isAsyncFunction();
  }
  checkExport(node, checkNames, isDefault, isFrom) {
    if (checkNames) {
      var _node$specifiers;
      if (isDefault) {
        this.checkDuplicateExports(node, "default");
        if (this.hasPlugin("exportDefaultFrom")) {
          var _declaration$extra;
          const declaration = node.declaration;

          declaration.type !== "Identifier" ||
            declaration.name !== "from" ||
            declaration.end - declaration.start != 4 ||
            ((_declaration$extra = declaration.extra) != null && _declaration$extra.parenthesized) ||
            this.raise(Errors.ExportDefaultFromAsIdentifier, { at: declaration });
        }
      } else if ((_node$specifiers = node.specifiers) != null && _node$specifiers.length)
        for (const specifier of node.specifiers) {
          const { exported } = specifier,
            exportName = exported.type === "Identifier" ? exported.name : exported.value;
          this.checkDuplicateExports(specifier, exportName);
          if (!isFrom && specifier.local) {
            const { local } = specifier;
            if (local.type !== "Identifier")
              this.raise(Errors.ExportBindingIsString, { at: specifier, localName: local.value, exportName });
            else {
              this.checkReservedWord(local.name, local.loc.start, true, false);
              this.scope.checkLocalExport(local);
            }
          }
        }
      else if (node.declaration)
        if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
          const id = node.declaration.id;
          if (!id) throw new Error("Assertion failure");
          this.checkDuplicateExports(node, id.name);
        } else if (node.declaration.type === "VariableDeclaration")
          for (const declaration of node.declaration.declarations) this.checkDeclaration(declaration.id);
    }
  }
  checkDeclaration(node) {
    if (node.type === "Identifier") this.checkDuplicateExports(node, node.name);
    else if (node.type === "ObjectPattern") for (const prop of node.properties) this.checkDeclaration(prop);
    else if (node.type === "ArrayPattern") for (const elem of node.elements) elem && this.checkDeclaration(elem);
    else node.type === "ObjectProperty"
      ? this.checkDeclaration(node.value)
      : node.type === "RestElement"
      ? this.checkDeclaration(node.argument)
      : node.type !== "AssignmentPattern" || this.checkDeclaration(node.left);
  }
  checkDuplicateExports(node, exportName) {
    if (this.exportedIdentifiers.has(exportName))
      exportName === "default"
        ? this.raise(Errors.DuplicateDefaultExport, { at: node })
        : this.raise(Errors.DuplicateExport, { at: node, exportName });

    this.exportedIdentifiers.add(exportName);
  }
  parseExportSpecifiers(isInTypeExport) {
    const nodes = [];
    let first = true;
    this.expect(5);
    while (!this.eat(8)) {
      if (first) first = false;
      else {
        this.expect(12);
        if (this.eat(8)) break;
      }
      const isMaybeTypeOnly = this.isContextual(128),
        isString = this.match(131),
        node = this.startNode();
      node.local = this.parseModuleExportName();
      nodes.push(this.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly));
    }
    return nodes;
  }
  parseExportSpecifier(node, isString, isInTypeExport, _isMaybeTypeOnly) {
    this.eatContextual(93)
      ? (node.exported = this.parseModuleExportName())
      : isString
      ? (node.exported = cloneStringLiteral(node.local))
      : node.exported || (node.exported = cloneIdentifier(node.local));

    return this.finishNode(node, "ExportSpecifier");
  }
  parseModuleExportName() {
    if (this.match(131)) {
      const result = this.parseStringLiteral(this.state.value),
        surrogate = result.value.match(loneSurrogate);
      surrogate &&
        this.raise(Errors.ModuleExportNameHasLoneSurrogate, {
          at: result,
          surrogateCharCode: surrogate[0].charCodeAt(0)
        });

      return result;
    }
    return this.parseIdentifier(true);
  }
  isJSONModuleImport(node) {
    return (
      node.assertions != null &&
      node.assertions.some(({ key, value }) =>
        value.value === "json" && (key.type === "Identifier" ? key.name === "type" : key.value === "type")
      )
    );
  }
  checkImportReflection(node) {
    if (node.module) {
      var _node$assertions;
      (node.specifiers.length === 1 && node.specifiers[0].type === "ImportDefaultSpecifier") ||
        this.raise(Errors.ImportReflectionNotBinding, { at: node.specifiers[0].loc.start });

      ((_node$assertions = node.assertions) == null ? void 0 : _node$assertions.length) > 0 &&
        this.raise(Errors.ImportReflectionHasAssertion, { at: node.specifiers[0].loc.start });
    }
  }
  checkJSONModuleImport(node) {
    if (this.isJSONModuleImport(node) && node.type !== "ExportAllDeclaration") {
      const { specifiers } = node;
      if (specifiers != null) {
        const nonDefaultNamedSpecifier = specifiers.find(specifier => {
          let imported;
          if (specifier.type === "ExportSpecifier") imported = specifier.local;
          else if (specifier.type === "ImportSpecifier") imported = specifier.imported;

          if (imported !== void 0)
            return imported.type === "Identifier" ? imported.name !== "default" : imported.value !== "default";
        });
        nonDefaultNamedSpecifier === void 0 ||
          this.raise(Errors.ImportJSONBindingNotDefault, { at: nonDefaultNamedSpecifier.loc.start });
      }
    }
  }
  isPotentialImportPhase(isExport) {
    return !isExport && this.isContextual(125);
  }
  applyImportPhase(node, isExport, phase, loc) {
    if (isExport) return;

    if (phase === "module") {
      this.expectPlugin("importReflection", loc);
      node.module = true;
    } else if (this.hasPlugin("importReflection")) node.module = false;
  }
  parseMaybeImportPhase(node, isExport) {
    if (!this.isPotentialImportPhase(isExport)) {
      this.applyImportPhase(node, isExport, null);
      return null;
    }
    const phaseIdentifier = this.parseIdentifier(true),
      { type } = this.state;
    if (tokenIsKeywordOrIdentifier(type) ? type !== 97 || this.lookaheadCharCode() === 102 : type !== 12) {
      this.resetPreviousIdentifierLeadingComments(phaseIdentifier);
      this.applyImportPhase(node, isExport, phaseIdentifier.name, phaseIdentifier.loc.start);
      return null;
    }

    this.applyImportPhase(node, isExport, null);
    return phaseIdentifier;
  }
  // noinspection JSUnusedGlobalSymbols
  isPrecedingIdImportPhase(_phase) {
    const { type } = this.state;
    return tokenIsIdentifier(type) ? type !== 97 || this.lookaheadCharCode() === 102 : type !== 12;
  }
  parseImport(node) {
    return this.match(131)
      ? this.parseImportSourceAndAttributes(node)
      : this.parseImportSpecifiersAndAfter(node, this.parseMaybeImportPhase(node, false));
  }
  parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier) {
    node.specifiers = [];
    const parseNext = !this.maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier) || this.eat(12),
      hasStar = parseNext && this.maybeParseStarImportSpecifier(node);
    !parseNext || hasStar || this.parseNamedImportSpecifiers(node);
    this.expectContextual(97);
    return this.parseImportSourceAndAttributes(node);
  }
  parseImportSourceAndAttributes(node) {
    node.specifiers != null || (node.specifiers = []);
    node.source = this.parseImportSource();
    this.maybeParseImportAttributes(node);
    this.checkImportReflection(node);
    this.checkJSONModuleImport(node);
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    this.match(131) || this.unexpected();
    return this.parseExprAtom();
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  finishImportSpecifier(specifier, type, bindingType = BindingFlag.TYPE_LEXICAL) {
    this.checkLVal(specifier.local, { in: { type }, binding: bindingType });
    return this.finishNode(specifier, type);
  }
  parseImportAttributes() {
    this.expect(5);
    const attrs = [],
      attrNames = new Set();
    do {
      if (this.match(8)) break;

      const node = this.startNode(),
        keyName = this.state.value;
      attrNames.has(keyName) &&
        this.raise(Errors.ModuleAttributesWithDuplicateKeys, { at: this.state.startLoc, key: keyName });

      attrNames.add(keyName);
      this.match(131) ? (node.key = this.parseStringLiteral(keyName)) : (node.key = this.parseIdentifier(true));

      this.expect(14);
      if (!this.match(131)) throw this.raise(Errors.ModuleAttributeInvalidValue, { at: this.state.startLoc });

      node.value = this.parseStringLiteral(this.state.value);
      attrs.push(this.finishNode(node, "ImportAttribute"));
    } while (this.eat(12));
    this.expect(8);
    return attrs;
  }
  parseModuleAttributes() {
    const attrs = [],
      attributes = new Set();
    do {
      const node = this.startNode();
      node.key = this.parseIdentifier(true);
      node.key.name === "type" || this.raise(Errors.ModuleAttributeDifferentFromType, { at: node.key });

      attributes.has(node.key.name) &&
        this.raise(Errors.ModuleAttributesWithDuplicateKeys, { at: node.key, key: node.key.name });

      attributes.add(node.key.name);
      this.expect(14);
      if (!this.match(131)) throw this.raise(Errors.ModuleAttributeInvalidValue, { at: this.state.startLoc });

      node.value = this.parseStringLiteral(this.state.value);
      attrs.push(this.finishNode(node, "ImportAttribute"));
    } while (this.eat(12));
    return attrs;
  }
  maybeParseImportAttributes(node) {
    let attributes,
      useWith = false;
    if (this.match(76)) {
      if (this.hasPrecedingLineBreak() && this.lookaheadCharCode() === 40) return;

      this.next();

      if (this.hasPlugin("moduleAttributes")) attributes = this.parseModuleAttributes();
      else {
        this.expectImportAttributesPlugin();
        attributes = this.parseImportAttributes();
      }

      useWith = true;
    } else if (this.isContextual(94) && !this.hasPrecedingLineBreak()) {
      if (this.hasPlugin("importAttributes")) {
        this.getPluginOption("importAttributes", "deprecatedAssertSyntax") === true ||
          this.raise(Errors.ImportAttributesUseAssert, { at: this.state.startLoc });

        this.addExtra(node, "deprecatedAssertSyntax", true);
      } else this.expectOnePlugin(["importAttributes", "importAssertions"]);

      this.next();
      attributes = this.parseImportAttributes();
    } else if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) attributes = [];
    else if (this.hasPlugin("moduleAttributes")) attributes = [];
    else return;

    !useWith && this.hasPlugin("importAssertions") ? (node.assertions = attributes) : (node.attributes = attributes);
  }
  maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier) {
      const specifier = this.startNodeAtNode(maybeDefaultIdentifier);
      specifier.local = maybeDefaultIdentifier;
      node.specifiers.push(this.finishImportSpecifier(specifier, "ImportDefaultSpecifier"));
      return true;
    }
    if (tokenIsKeywordOrIdentifier(this.state.type)) {
      this.parseImportSpecifierLocal(node, this.startNode(), "ImportDefaultSpecifier");
      return true;
    }
    return false;
  }
  maybeParseStarImportSpecifier(node) {
    if (this.match(55)) {
      const specifier = this.startNode();
      this.next();
      this.expectContextual(93);
      this.parseImportSpecifierLocal(node, specifier, "ImportNamespaceSpecifier");
      return true;
    }
    return false;
  }
  parseNamedImportSpecifiers(node) {
    this.expect(5);
    for (let first = true; !this.eat(8); ) {
      if (first) first = false;
      else {
        if (this.eat(14)) throw this.raise(Errors.DestructureNamedImport, { at: this.state.startLoc });

        this.expect(12);
        if (this.eat(8)) break;
      }
      const specifier = this.startNode(),
        importedIsString = this.match(131),
        isMaybeTypeOnly = this.isContextual(128);
      specifier.imported = this.parseModuleExportName();
      const importSpecifier = this.parseImportSpecifier(
        specifier,
        importedIsString,
        node.importKind === "type" || node.importKind === "typeof",
        isMaybeTypeOnly,
        void 0
      );
      node.specifiers.push(importSpecifier);
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    if (this.eatContextual(93)) specifier.local = this.parseIdentifier();
    else {
      const { imported } = specifier;
      if (importedIsString)
        throw this.raise(Errors.ImportBindingIsString, { at: specifier, importName: imported.value });

      this.checkReservedWord(imported.name, specifier.loc.start, true, true);
      specifier.local || (specifier.local = cloneIdentifier(imported));
    }
    return this.finishImportSpecifier(specifier, "ImportSpecifier", bindingType);
  }
  isThisParam(param) {
    return param.type === "Identifier" && param.name === "this";
  }
}

class Parser extends StatementParser {
  constructor(options, input) {
    super((options = getOptions(options)), input);
    this.options = options;
    this.initializeScopes();
    this.plugins = pluginsMap(this.options.plugins);
    this.filename = options.sourceFilename;
  }
  getScopeHandler() {
    return ScopeHandler;
  }
  parse() {
    this.enterInitialScopes();
    const file = this.startNode(),
      program = this.startNode();
    this.nextToken();
    file.errors = null;
    this.parseTopLevel(file, program);
    file.errors = this.state.errors;
    return file;
  }
}
function pluginsMap(plugins) {
  const pluginMap = new Map();
  for (const plugin of plugins) {
    const [name, options] = Array.isArray(plugin) ? plugin : [plugin, {}];
    pluginMap.has(name) || pluginMap.set(name, options || {});
  }
  return pluginMap;
}

function parse(input, options) {
  var _options;
  if (((_options = options) == null ? void 0 : _options.sourceType) !== "unambiguous")
    return getParser(options, input).parse();

  options = Object.assign({}, options);
  try {
    options.sourceType = "module";
    const parser = getParser(options, input),
      ast = parser.parse();
    if (parser.sawUnambiguousESM) return ast;

    if (parser.ambiguousScriptDifferentAst)
      try {
        options.sourceType = "script";
        return getParser(options, input).parse();
      } catch (_unused) {}
    else ast.program.sourceType = "script";

    return ast;
  } catch (moduleError) {
    try {
      options.sourceType = "script";
      return getParser(options, input).parse();
    } catch (_unused2) {}
    throw moduleError;
  }
}
function parseExpression(input, options) {
  const parser = getParser(options, input);
  if (parser.options.strictMode) parser.state.strict = true;

  return parser.getExpression();
}
function generateExportedTokenTypes(internalTokenTypes) {
  const tokenTypes = {};
  for (const typeName of Object.keys(internalTokenTypes))
    tokenTypes[typeName] = getExportedToken(internalTokenTypes[typeName]);

  return tokenTypes;
}
const tokTypes = generateExportedTokenTypes(tt);
function getParser(options, input) {
  let cls = Parser;
  if (options != null && options.plugins) {
    validatePlugins(options.plugins);
    cls = getParserClass(options.plugins);
  }
  return new cls(options, input);
}
const parserClassCache = {};
function getParserClass(pluginsFromOptions) {
  const pluginList = mixinPluginNames.filter(name => hasPlugin(pluginsFromOptions, name)),
    key = pluginList.join("/");
  let cls = parserClassCache[key];
  if (!cls) {
    cls = Parser;
    for (const plugin of pluginList) cls = mixinPlugins[plugin](cls);

    parserClassCache[key] = cls;
  }
  return cls;
}

exports = module.exports = parse;
exports.parse = parse;
exports.parseExpression = parseExpression;
exports.tokTypes = tokTypes;

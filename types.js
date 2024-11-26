"use strict";

var common = require('./common.js');

function shallowEqual(actual, expected) {
  const keys = Object.keys(expected);
  for (const key of keys) if (actual[key] !== expected[key]) return false;

  return true;
}

const warnings = new Set();
function deprecationWarning(oldName, newName, prefix = "") {
  if (warnings.has(oldName)) return;
  warnings.add(oldName);
  const { internal, trace } = captureShortStackTrace(1, 2);
  internal ||
    console.warn(`${prefix}\`${oldName}\` has been deprecated, please migrate to \`${newName}\`\n${trace}`);
}
function captureShortStackTrace(skip, length) {
  const { stackTraceLimit, prepareStackTrace } = Error;
  let stackTrace;
  Error.stackTraceLimit = 1 + skip + length;
  Error.prepareStackTrace = function (err, stack) {
    stackTrace = stack;
  };
  new Error().stack;
  Error.stackTraceLimit = stackTraceLimit;
  Error.prepareStackTrace = prepareStackTrace;
  if (!stackTrace) return { internal: false, trace: "" };
  const shortStackTrace = stackTrace.slice(1 + skip, 1 + skip + length);
  return {
    internal: /[\\/]@babel[\\/]/.test(shortStackTrace[1].getFileName()),
    trace: shortStackTrace.map(frame => "    at " + frame).join("\n")
  };
}

function isArrayExpression(node, opts) {
  return !!node && node.type === "ArrayExpression" && (opts == null || shallowEqual(node, opts));
}
function isAssignmentExpression(node, opts) {
  return !!node && node.type === "AssignmentExpression" && (opts == null || shallowEqual(node, opts));
}
function isBinaryExpression(node, opts) {
  return !!node && node.type === "BinaryExpression" && (opts == null || shallowEqual(node, opts));
}
function isInterpreterDirective(node, opts) {
  return !!node && node.type === "InterpreterDirective" && (opts == null || shallowEqual(node, opts));
}
function isDirective(node, opts) {
  return !!node && node.type === "Directive" && (opts == null || shallowEqual(node, opts));
}
function isDirectiveLiteral(node, opts) {
  return !!node && node.type === "DirectiveLiteral" && (opts == null || shallowEqual(node, opts));
}
function isBlockStatement(node, opts) {
  return !!node && node.type === "BlockStatement" && (opts == null || shallowEqual(node, opts));
}
function isBreakStatement(node, opts) {
  return !!node && node.type === "BreakStatement" && (opts == null || shallowEqual(node, opts));
}
function isCallExpression(node, opts) {
  return !!node && node.type === "CallExpression" && (opts == null || shallowEqual(node, opts));
}
function isCatchClause(node, opts) {
  return !!node && node.type === "CatchClause" && (opts == null || shallowEqual(node, opts));
}
function isConditionalExpression(node, opts) {
  return !!node && node.type === "ConditionalExpression" && (opts == null || shallowEqual(node, opts));
}
function isContinueStatement(node, opts) {
  return !!node && node.type === "ContinueStatement" && (opts == null || shallowEqual(node, opts));
}
function isDebuggerStatement(node, opts) {
  return !!node && node.type === "DebuggerStatement" && (opts == null || shallowEqual(node, opts));
}
function isDoWhileStatement(node, opts) {
  return !!node && node.type === "DoWhileStatement" && (opts == null || shallowEqual(node, opts));
}
function isEmptyStatement(node, opts) {
  return !!node && node.type === "EmptyStatement" && (opts == null || shallowEqual(node, opts));
}
function isExpressionStatement(node, opts) {
  return !!node && node.type === "ExpressionStatement" && (opts == null || shallowEqual(node, opts));
}
function isFile(node, opts) {
  return !!node && node.type === "File" && (opts == null || shallowEqual(node, opts));
}
function isForInStatement(node, opts) {
  return !!node && node.type === "ForInStatement" && (opts == null || shallowEqual(node, opts));
}
function isForStatement(node, opts) {
  return !!node && node.type === "ForStatement" && (opts == null || shallowEqual(node, opts));
}
function isFunctionDeclaration(node, opts) {
  return !!node && node.type === "FunctionDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isFunctionExpression(node, opts) {
  return !!node && node.type === "FunctionExpression" && (opts == null || shallowEqual(node, opts));
}
function isIdentifier(node, opts) {
  return !!node && node.type === "Identifier" && (opts == null || shallowEqual(node, opts));
}
function isIfStatement(node, opts) {
  return !!node && node.type === "IfStatement" && (opts == null || shallowEqual(node, opts));
}
function isLabeledStatement(node, opts) {
  return !!node && node.type === "LabeledStatement" && (opts == null || shallowEqual(node, opts));
}
function isStringLiteral(node, opts) {
  return !!node && node.type === "StringLiteral" && (opts == null || shallowEqual(node, opts));
}
function isNumericLiteral(node, opts) {
  return !!node && node.type === "NumericLiteral" && (opts == null || shallowEqual(node, opts));
}
function isNullLiteral(node, opts) {
  return !!node && node.type === "NullLiteral" && (opts == null || shallowEqual(node, opts));
}
function isBooleanLiteral(node, opts) {
  return !!node && node.type === "BooleanLiteral" && (opts == null || shallowEqual(node, opts));
}
function isRegExpLiteral(node, opts) {
  return !!node && node.type === "RegExpLiteral" && (opts == null || shallowEqual(node, opts));
}
function isLogicalExpression(node, opts) {
  return !!node && node.type === "LogicalExpression" && (opts == null || shallowEqual(node, opts));
}
function isMemberExpression(node, opts) {
  return !!node && node.type === "MemberExpression" && (opts == null || shallowEqual(node, opts));
}
function isNewExpression(node, opts) {
  return !!node && node.type === "NewExpression" && (opts == null || shallowEqual(node, opts));
}
function isProgram(node, opts) {
  return !!node && node.type === "Program" && (opts == null || shallowEqual(node, opts));
}
function isObjectExpression(node, opts) {
  return !!node && node.type === "ObjectExpression" && (opts == null || shallowEqual(node, opts));
}
function isObjectMethod(node, opts) {
  return !!node && node.type === "ObjectMethod" && (opts == null || shallowEqual(node, opts));
}
function isObjectProperty(node, opts) {
  return !!node && node.type === "ObjectProperty" && (opts == null || shallowEqual(node, opts));
}
function isRestElement(node, opts) {
  return !!node && node.type === "RestElement" && (opts == null || shallowEqual(node, opts));
}
function isReturnStatement(node, opts) {
  return !!node && node.type === "ReturnStatement" && (opts == null || shallowEqual(node, opts));
}
function isSequenceExpression(node, opts) {
  return !!node && node.type === "SequenceExpression" && (opts == null || shallowEqual(node, opts));
}
function isParenthesizedExpression(node, opts) {
  return !!node && node.type === "ParenthesizedExpression" && (opts == null || shallowEqual(node, opts));
}
function isSwitchCase(node, opts) {
  return !!node && node.type === "SwitchCase" && (opts == null || shallowEqual(node, opts));
}
function isSwitchStatement(node, opts) {
  return !!node && node.type === "SwitchStatement" && (opts == null || shallowEqual(node, opts));
}
function isThisExpression(node, opts) {
  return !!node && node.type === "ThisExpression" && (opts == null || shallowEqual(node, opts));
}
function isThrowStatement(node, opts) {
  return !!node && node.type === "ThrowStatement" && (opts == null || shallowEqual(node, opts));
}
function isTryStatement(node, opts) {
  return !!node && node.type === "TryStatement" && (opts == null || shallowEqual(node, opts));
}
function isUnaryExpression(node, opts) {
  return !!node && node.type === "UnaryExpression" && (opts == null || shallowEqual(node, opts));
}
function isUpdateExpression(node, opts) {
  return !!node && node.type === "UpdateExpression" && (opts == null || shallowEqual(node, opts));
}
function isVariableDeclaration(node, opts) {
  return !!node && node.type === "VariableDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isVariableDeclarator(node, opts) {
  return !!node && node.type === "VariableDeclarator" && (opts == null || shallowEqual(node, opts));
}
function isWhileStatement(node, opts) {
  return !!node && node.type === "WhileStatement" && (opts == null || shallowEqual(node, opts));
}
function isWithStatement(node, opts) {
  return !!node && node.type === "WithStatement" && (opts == null || shallowEqual(node, opts));
}
function isAssignmentPattern(node, opts) {
  return !!node && node.type === "AssignmentPattern" && (opts == null || shallowEqual(node, opts));
}
function isArrayPattern(node, opts) {
  return !!node && node.type === "ArrayPattern" && (opts == null || shallowEqual(node, opts));
}
function isArrowFunctionExpression(node, opts) {
  return !!node && node.type === "ArrowFunctionExpression" && (opts == null || shallowEqual(node, opts));
}
function isClassBody(node, opts) {
  return !!node && node.type === "ClassBody" && (opts == null || shallowEqual(node, opts));
}
function isClassExpression(node, opts) {
  return !!node && node.type === "ClassExpression" && (opts == null || shallowEqual(node, opts));
}
function isClassDeclaration(node, opts) {
  return !!node && node.type === "ClassDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isExportAllDeclaration(node, opts) {
  return !!node && node.type === "ExportAllDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isExportDefaultDeclaration(node, opts) {
  return !!node && node.type === "ExportDefaultDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isExportNamedDeclaration(node, opts) {
  return !!node && node.type === "ExportNamedDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isExportSpecifier(node, opts) {
  return !!node && node.type === "ExportSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isForOfStatement(node, opts) {
  return !!node && node.type === "ForOfStatement" && (opts == null || shallowEqual(node, opts));
}
function isImportDeclaration(node, opts) {
  return !!node && node.type === "ImportDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isImportDefaultSpecifier(node, opts) {
  return !!node && node.type === "ImportDefaultSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isImportNamespaceSpecifier(node, opts) {
  return !!node && node.type === "ImportNamespaceSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isImportSpecifier(node, opts) {
  return !!node && node.type === "ImportSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isMetaProperty(node, opts) {
  return !!node && node.type === "MetaProperty" && (opts == null || shallowEqual(node, opts));
}
function isClassMethod(node, opts) {
  return !!node && node.type === "ClassMethod" && (opts == null || shallowEqual(node, opts));
}
function isObjectPattern(node, opts) {
  return !!node && node.type === "ObjectPattern" && (opts == null || shallowEqual(node, opts));
}
function isSpreadElement(node, opts) {
  return !!node && node.type === "SpreadElement" && (opts == null || shallowEqual(node, opts));
}
function isSuper(node, opts) {
  return !!node && node.type === "Super" && (opts == null || shallowEqual(node, opts));
}
function isTaggedTemplateExpression(node, opts) {
  return !!node && node.type === "TaggedTemplateExpression" && (opts == null || shallowEqual(node, opts));
}
function isTemplateElement(node, opts) {
  return !!node && node.type === "TemplateElement" && (opts == null || shallowEqual(node, opts));
}
function isTemplateLiteral(node, opts) {
  return !!node && node.type === "TemplateLiteral" && (opts == null || shallowEqual(node, opts));
}
function isYieldExpression(node, opts) {
  return !!node && node.type === "YieldExpression" && (opts == null || shallowEqual(node, opts));
}
function isAwaitExpression(node, opts) {
  return !!node && node.type === "AwaitExpression" && (opts == null || shallowEqual(node, opts));
}
function isImport(node, opts) {
  return !!node && node.type === "Import" && (opts == null || shallowEqual(node, opts));
}
function isBigIntLiteral(node, opts) {
  return !!node && node.type === "BigIntLiteral" && (opts == null || shallowEqual(node, opts));
}
function isExportNamespaceSpecifier(node, opts) {
  return !!node && node.type === "ExportNamespaceSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isOptionalMemberExpression(node, opts) {
  return !!node && node.type === "OptionalMemberExpression" && (opts == null || shallowEqual(node, opts));
}
function isOptionalCallExpression(node, opts) {
  return !!node && node.type === "OptionalCallExpression" && (opts == null || shallowEqual(node, opts));
}
function isClassProperty(node, opts) {
  return !!node && node.type === "ClassProperty" && (opts == null || shallowEqual(node, opts));
}
function isClassAccessorProperty(node, opts) {
  return !!node && node.type === "ClassAccessorProperty" && (opts == null || shallowEqual(node, opts));
}
function isClassPrivateProperty(node, opts) {
  return !!node && node.type === "ClassPrivateProperty" && (opts == null || shallowEqual(node, opts));
}
function isClassPrivateMethod(node, opts) {
  return !!node && node.type === "ClassPrivateMethod" && (opts == null || shallowEqual(node, opts));
}
function isPrivateName(node, opts) {
  return !!node && node.type === "PrivateName" && (opts == null || shallowEqual(node, opts));
}
function isStaticBlock(node, opts) {
  return !!node && node.type === "StaticBlock" && (opts == null || shallowEqual(node, opts));
}
function isAnyTypeAnnotation(node, opts) {
  return !!node && node.type === "AnyTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isArrayTypeAnnotation(node, opts) {
  return !!node && node.type === "ArrayTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isBooleanTypeAnnotation(node, opts) {
  return !!node && node.type === "BooleanTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isBooleanLiteralTypeAnnotation(node, opts) {
  return !!node && node.type === "BooleanLiteralTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isNullLiteralTypeAnnotation(node, opts) {
  return !!node && node.type === "NullLiteralTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isClassImplements(node, opts) {
  return !!node && node.type === "ClassImplements" && (opts == null || shallowEqual(node, opts));
}
function isDeclareClass(node, opts) {
  return !!node && node.type === "DeclareClass" && (opts == null || shallowEqual(node, opts));
}
function isDeclareFunction(node, opts) {
  return !!node && node.type === "DeclareFunction" && (opts == null || shallowEqual(node, opts));
}
function isDeclareInterface(node, opts) {
  return !!node && node.type === "DeclareInterface" && (opts == null || shallowEqual(node, opts));
}
function isDeclareModule(node, opts) {
  return !!node && node.type === "DeclareModule" && (opts == null || shallowEqual(node, opts));
}
function isDeclareModuleExports(node, opts) {
  return !!node && node.type === "DeclareModuleExports" && (opts == null || shallowEqual(node, opts));
}
function isDeclareTypeAlias(node, opts) {
  return !!node && node.type === "DeclareTypeAlias" && (opts == null || shallowEqual(node, opts));
}
function isDeclareOpaqueType(node, opts) {
  return !!node && node.type === "DeclareOpaqueType" && (opts == null || shallowEqual(node, opts));
}
function isDeclareVariable(node, opts) {
  return !!node && node.type === "DeclareVariable" && (opts == null || shallowEqual(node, opts));
}
function isDeclareExportDeclaration(node, opts) {
  return !!node && node.type === "DeclareExportDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isDeclareExportAllDeclaration(node, opts) {
  return !!node && node.type === "DeclareExportAllDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isDeclaredPredicate(node, opts) {
  return !!node && node.type === "DeclaredPredicate" && (opts == null || shallowEqual(node, opts));
}
function isExistsTypeAnnotation(node, opts) {
  return !!node && node.type === "ExistsTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isFunctionTypeAnnotation(node, opts) {
  return !!node && node.type === "FunctionTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isFunctionTypeParam(node, opts) {
  return !!node && node.type === "FunctionTypeParam" && (opts == null || shallowEqual(node, opts));
}
function isGenericTypeAnnotation(node, opts) {
  return !!node && node.type === "GenericTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isInferredPredicate(node, opts) {
  return !!node && node.type === "InferredPredicate" && (opts == null || shallowEqual(node, opts));
}
function isInterfaceExtends(node, opts) {
  return !!node && node.type === "InterfaceExtends" && (opts == null || shallowEqual(node, opts));
}
function isInterfaceDeclaration(node, opts) {
  return !!node && node.type === "InterfaceDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isInterfaceTypeAnnotation(node, opts) {
  return !!node && node.type === "InterfaceTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isIntersectionTypeAnnotation(node, opts) {
  return !!node && node.type === "IntersectionTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isMixedTypeAnnotation(node, opts) {
  return !!node && node.type === "MixedTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isEmptyTypeAnnotation(node, opts) {
  return !!node && node.type === "EmptyTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isNullableTypeAnnotation(node, opts) {
  return !!node && node.type === "NullableTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isNumberLiteralTypeAnnotation(node, opts) {
  return !!node && node.type === "NumberLiteralTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isNumberTypeAnnotation(node, opts) {
  return !!node && node.type === "NumberTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeAnnotation(node, opts) {
  return !!node && node.type === "ObjectTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeInternalSlot(node, opts) {
  return !!node && node.type === "ObjectTypeInternalSlot" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeCallProperty(node, opts) {
  return !!node && node.type === "ObjectTypeCallProperty" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeIndexer(node, opts) {
  return !!node && node.type === "ObjectTypeIndexer" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeProperty(node, opts) {
  return !!node && node.type === "ObjectTypeProperty" && (opts == null || shallowEqual(node, opts));
}
function isObjectTypeSpreadProperty(node, opts) {
  return !!node && node.type === "ObjectTypeSpreadProperty" && (opts == null || shallowEqual(node, opts));
}
function isOpaqueType(node, opts) {
  return !!node && node.type === "OpaqueType" && (opts == null || shallowEqual(node, opts));
}
function isQualifiedTypeIdentifier(node, opts) {
  return !!node && node.type === "QualifiedTypeIdentifier" && (opts == null || shallowEqual(node, opts));
}
function isStringLiteralTypeAnnotation(node, opts) {
  return !!node && node.type === "StringLiteralTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isStringTypeAnnotation(node, opts) {
  return !!node && node.type === "StringTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isSymbolTypeAnnotation(node, opts) {
  return !!node && node.type === "SymbolTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isThisTypeAnnotation(node, opts) {
  return !!node && node.type === "ThisTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isTupleTypeAnnotation(node, opts) {
  return !!node && node.type === "TupleTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isTypeofTypeAnnotation(node, opts) {
  return !!node && node.type === "TypeofTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isTypeAlias(node, opts) {
  return !!node && node.type === "TypeAlias" && (opts == null || shallowEqual(node, opts));
}
function isTypeAnnotation(node, opts) {
  return !!node && node.type === "TypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isTypeCastExpression(node, opts) {
  return !!node && node.type === "TypeCastExpression" && (opts == null || shallowEqual(node, opts));
}
function isTypeParameter(node, opts) {
  return !!node && node.type === "TypeParameter" && (opts == null || shallowEqual(node, opts));
}
function isTypeParameterDeclaration(node, opts) {
  return !!node && node.type === "TypeParameterDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTypeParameterInstantiation(node, opts) {
  return !!node && node.type === "TypeParameterInstantiation" && (opts == null || shallowEqual(node, opts));
}
function isUnionTypeAnnotation(node, opts) {
  return !!node && node.type === "UnionTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isVariance(node, opts) {
  return !!node && node.type === "Variance" && (opts == null || shallowEqual(node, opts));
}
function isVoidTypeAnnotation(node, opts) {
  return !!node && node.type === "VoidTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isEnumDeclaration(node, opts) {
  return !!node && node.type === "EnumDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isEnumBooleanBody(node, opts) {
  return !!node && node.type === "EnumBooleanBody" && (opts == null || shallowEqual(node, opts));
}
function isEnumNumberBody(node, opts) {
  return !!node && node.type === "EnumNumberBody" && (opts == null || shallowEqual(node, opts));
}
function isEnumStringBody(node, opts) {
  return !!node && node.type === "EnumStringBody" && (opts == null || shallowEqual(node, opts));
}
function isEnumSymbolBody(node, opts) {
  return !!node && node.type === "EnumSymbolBody" && (opts == null || shallowEqual(node, opts));
}
function isEnumBooleanMember(node, opts) {
  return !!node && node.type === "EnumBooleanMember" && (opts == null || shallowEqual(node, opts));
}
function isEnumNumberMember(node, opts) {
  return !!node && node.type === "EnumNumberMember" && (opts == null || shallowEqual(node, opts));
}
function isEnumStringMember(node, opts) {
  return !!node && node.type === "EnumStringMember" && (opts == null || shallowEqual(node, opts));
}
function isEnumDefaultedMember(node, opts) {
  return !!node && node.type === "EnumDefaultedMember" && (opts == null || shallowEqual(node, opts));
}
function isIndexedAccessType(node, opts) {
  return !!node && node.type === "IndexedAccessType" && (opts == null || shallowEqual(node, opts));
}
function isOptionalIndexedAccessType(node, opts) {
  return !!node && node.type === "OptionalIndexedAccessType" && (opts == null || shallowEqual(node, opts));
}
function isJSXAttribute(node, opts) {
  return !!node && node.type === "JSXAttribute" && (opts == null || shallowEqual(node, opts));
}
function isJSXClosingElement(node, opts) {
  return !!node && node.type === "JSXClosingElement" && (opts == null || shallowEqual(node, opts));
}
function isJSXElement(node, opts) {
  return !!node && node.type === "JSXElement" && (opts == null || shallowEqual(node, opts));
}
function isJSXEmptyExpression(node, opts) {
  return !!node && node.type === "JSXEmptyExpression" && (opts == null || shallowEqual(node, opts));
}
function isJSXExpressionContainer(node, opts) {
  return !!node && node.type === "JSXExpressionContainer" && (opts == null || shallowEqual(node, opts));
}
function isJSXSpreadChild(node, opts) {
  return !!node && node.type === "JSXSpreadChild" && (opts == null || shallowEqual(node, opts));
}
function isJSXIdentifier(node, opts) {
  return !!node && node.type === "JSXIdentifier" && (opts == null || shallowEqual(node, opts));
}
function isJSXMemberExpression(node, opts) {
  return !!node && node.type === "JSXMemberExpression" && (opts == null || shallowEqual(node, opts));
}
function isJSXNamespacedName(node, opts) {
  return !!node && node.type === "JSXNamespacedName" && (opts == null || shallowEqual(node, opts));
}
function isJSXOpeningElement(node, opts) {
  return !!node && node.type === "JSXOpeningElement" && (opts == null || shallowEqual(node, opts));
}
function isJSXSpreadAttribute(node, opts) {
  return !!node && node.type === "JSXSpreadAttribute" && (opts == null || shallowEqual(node, opts));
}
function isJSXText(node, opts) {
  return !!node && node.type === "JSXText" && (opts == null || shallowEqual(node, opts));
}
function isJSXFragment(node, opts) {
  return !!node && node.type === "JSXFragment" && (opts == null || shallowEqual(node, opts));
}
function isJSXOpeningFragment(node, opts) {
  return !!node && node.type === "JSXOpeningFragment" && (opts == null || shallowEqual(node, opts));
}
function isJSXClosingFragment(node, opts) {
  return !!node && node.type === "JSXClosingFragment" && (opts == null || shallowEqual(node, opts));
}
function isNoop(node, opts) {
  return !!node && node.type === "Noop" && (opts == null || shallowEqual(node, opts));
}
function isPlaceholder(node, opts) {
  return !!node && node.type === "Placeholder" && (opts == null || shallowEqual(node, opts));
}
function isV8IntrinsicIdentifier(node, opts) {
  return !!node && node.type === "V8IntrinsicIdentifier" && (opts == null || shallowEqual(node, opts));
}
function isArgumentPlaceholder(node, opts) {
  return !!node && node.type === "ArgumentPlaceholder" && (opts == null || shallowEqual(node, opts));
}
function isBindExpression(node, opts) {
  return !!node && node.type === "BindExpression" && (opts == null || shallowEqual(node, opts));
}
function isImportAttribute(node, opts) {
  return !!node && node.type === "ImportAttribute" && (opts == null || shallowEqual(node, opts));
}
function isDecorator(node, opts) {
  return !!node && node.type === "Decorator" && (opts == null || shallowEqual(node, opts));
}
function isDoExpression(node, opts) {
  return !!node && node.type === "DoExpression" && (opts == null || shallowEqual(node, opts));
}
function isExportDefaultSpecifier(node, opts) {
  return !!node && node.type === "ExportDefaultSpecifier" && (opts == null || shallowEqual(node, opts));
}
function isRecordExpression(node, opts) {
  return !!node && node.type === "RecordExpression" && (opts == null || shallowEqual(node, opts));
}
function isTupleExpression(node, opts) {
  return !!node && node.type === "TupleExpression" && (opts == null || shallowEqual(node, opts));
}
function isDecimalLiteral(node, opts) {
  return !!node && node.type === "DecimalLiteral" && (opts == null || shallowEqual(node, opts));
}
function isModuleExpression(node, opts) {
  return !!node && node.type === "ModuleExpression" && (opts == null || shallowEqual(node, opts));
}
function isTopicReference(node, opts) {
  return !!node && node.type === "TopicReference" && (opts == null || shallowEqual(node, opts));
}
function isPipelineTopicExpression(node, opts) {
  return !!node && node.type === "PipelineTopicExpression" && (opts == null || shallowEqual(node, opts));
}
function isPipelineBareFunction(node, opts) {
  return !!node && node.type === "PipelineBareFunction" && (opts == null || shallowEqual(node, opts));
}
function isPipelinePrimaryTopicReference(node, opts) {
  return !!node && node.type === "PipelinePrimaryTopicReference" && (opts == null || shallowEqual(node, opts));
}
function isTSParameterProperty(node, opts) {
  return !!node && node.type === "TSParameterProperty" && (opts == null || shallowEqual(node, opts));
}
function isTSDeclareFunction(node, opts) {
  return !!node && node.type === "TSDeclareFunction" && (opts == null || shallowEqual(node, opts));
}
function isTSDeclareMethod(node, opts) {
  return !!node && node.type === "TSDeclareMethod" && (opts == null || shallowEqual(node, opts));
}
function isTSQualifiedName(node, opts) {
  return !!node && node.type === "TSQualifiedName" && (opts == null || shallowEqual(node, opts));
}
function isTSCallSignatureDeclaration(node, opts) {
  return !!node && node.type === "TSCallSignatureDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSConstructSignatureDeclaration(node, opts) {
  return !!node && node.type === "TSConstructSignatureDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSPropertySignature(node, opts) {
  return !!node && node.type === "TSPropertySignature" && (opts == null || shallowEqual(node, opts));
}
function isTSMethodSignature(node, opts) {
  return !!node && node.type === "TSMethodSignature" && (opts == null || shallowEqual(node, opts));
}
function isTSIndexSignature(node, opts) {
  return !!node && node.type === "TSIndexSignature" && (opts == null || shallowEqual(node, opts));
}
function isTSAnyKeyword(node, opts) {
  return !!node && node.type === "TSAnyKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSBooleanKeyword(node, opts) {
  return !!node && node.type === "TSBooleanKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSBigIntKeyword(node, opts) {
  return !!node && node.type === "TSBigIntKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSIntrinsicKeyword(node, opts) {
  return !!node && node.type === "TSIntrinsicKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSNeverKeyword(node, opts) {
  return !!node && node.type === "TSNeverKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSNullKeyword(node, opts) {
  return !!node && node.type === "TSNullKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSNumberKeyword(node, opts) {
  return !!node && node.type === "TSNumberKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSObjectKeyword(node, opts) {
  return !!node && node.type === "TSObjectKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSStringKeyword(node, opts) {
  return !!node && node.type === "TSStringKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSSymbolKeyword(node, opts) {
  return !!node && node.type === "TSSymbolKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSUndefinedKeyword(node, opts) {
  return !!node && node.type === "TSUndefinedKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSUnknownKeyword(node, opts) {
  return !!node && node.type === "TSUnknownKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSVoidKeyword(node, opts) {
  return !!node && node.type === "TSVoidKeyword" && (opts == null || shallowEqual(node, opts));
}
function isTSThisType(node, opts) {
  return !!node && node.type === "TSThisType" && (opts == null || shallowEqual(node, opts));
}
function isTSFunctionType(node, opts) {
  return !!node && node.type === "TSFunctionType" && (opts == null || shallowEqual(node, opts));
}
function isTSConstructorType(node, opts) {
  return !!node && node.type === "TSConstructorType" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeReference(node, opts) {
  return !!node && node.type === "TSTypeReference" && (opts == null || shallowEqual(node, opts));
}
function isTSTypePredicate(node, opts) {
  return !!node && node.type === "TSTypePredicate" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeQuery(node, opts) {
  return !!node && node.type === "TSTypeQuery" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeLiteral(node, opts) {
  return !!node && node.type === "TSTypeLiteral" && (opts == null || shallowEqual(node, opts));
}
function isTSArrayType(node, opts) {
  return !!node && node.type === "TSArrayType" && (opts == null || shallowEqual(node, opts));
}
function isTSTupleType(node, opts) {
  return !!node && node.type === "TSTupleType" && (opts == null || shallowEqual(node, opts));
}
function isTSOptionalType(node, opts) {
  return !!node && node.type === "TSOptionalType" && (opts == null || shallowEqual(node, opts));
}
function isTSRestType(node, opts) {
  return !!node && node.type === "TSRestType" && (opts == null || shallowEqual(node, opts));
}
function isTSNamedTupleMember(node, opts) {
  return !!node && node.type === "TSNamedTupleMember" && (opts == null || shallowEqual(node, opts));
}
function isTSUnionType(node, opts) {
  return !!node && node.type === "TSUnionType" && (opts == null || shallowEqual(node, opts));
}
function isTSIntersectionType(node, opts) {
  return !!node && node.type === "TSIntersectionType" && (opts == null || shallowEqual(node, opts));
}
function isTSConditionalType(node, opts) {
  return !!node && node.type === "TSConditionalType" && (opts == null || shallowEqual(node, opts));
}
function isTSInferType(node, opts) {
  return !!node && node.type === "TSInferType" && (opts == null || shallowEqual(node, opts));
}
function isTSParenthesizedType(node, opts) {
  return !!node && node.type === "TSParenthesizedType" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeOperator(node, opts) {
  return !!node && node.type === "TSTypeOperator" && (opts == null || shallowEqual(node, opts));
}
function isTSIndexedAccessType(node, opts) {
  return !!node && node.type === "TSIndexedAccessType" && (opts == null || shallowEqual(node, opts));
}
function isTSMappedType(node, opts) {
  return !!node && node.type === "TSMappedType" && (opts == null || shallowEqual(node, opts));
}
function isTSLiteralType(node, opts) {
  return !!node && node.type === "TSLiteralType" && (opts == null || shallowEqual(node, opts));
}
function isTSExpressionWithTypeArguments(node, opts) {
  return !!node && node.type === "TSExpressionWithTypeArguments" && (opts == null || shallowEqual(node, opts));
}
function isTSInterfaceDeclaration(node, opts) {
  return !!node && node.type === "TSInterfaceDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSInterfaceBody(node, opts) {
  return !!node && node.type === "TSInterfaceBody" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeAliasDeclaration(node, opts) {
  return !!node && node.type === "TSTypeAliasDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSInstantiationExpression(node, opts) {
  return !!node && node.type === "TSInstantiationExpression" && (opts == null || shallowEqual(node, opts));
}
function isTSAsExpression(node, opts) {
  return !!node && node.type === "TSAsExpression" && (opts == null || shallowEqual(node, opts));
}
function isTSSatisfiesExpression(node, opts) {
  return !!node && node.type === "TSSatisfiesExpression" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeAssertion(node, opts) {
  return !!node && node.type === "TSTypeAssertion" && (opts == null || shallowEqual(node, opts));
}
function isTSEnumDeclaration(node, opts) {
  return !!node && node.type === "TSEnumDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSEnumMember(node, opts) {
  return !!node && node.type === "TSEnumMember" && (opts == null || shallowEqual(node, opts));
}
function isTSModuleDeclaration(node, opts) {
  return !!node && node.type === "TSModuleDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSModuleBlock(node, opts) {
  return !!node && node.type === "TSModuleBlock" && (opts == null || shallowEqual(node, opts));
}
function isTSImportType(node, opts) {
  return !!node && node.type === "TSImportType" && (opts == null || shallowEqual(node, opts));
}
function isTSImportEqualsDeclaration(node, opts) {
  return !!node && node.type === "TSImportEqualsDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSExternalModuleReference(node, opts) {
  return !!node && node.type === "TSExternalModuleReference" && (opts == null || shallowEqual(node, opts));
}
function isTSNonNullExpression(node, opts) {
  return !!node && node.type === "TSNonNullExpression" && (opts == null || shallowEqual(node, opts));
}
function isTSExportAssignment(node, opts) {
  return !!node && node.type === "TSExportAssignment" && (opts == null || shallowEqual(node, opts));
}
function isTSNamespaceExportDeclaration(node, opts) {
  return !!node && node.type === "TSNamespaceExportDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeAnnotation(node, opts) {
  return !!node && node.type === "TSTypeAnnotation" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeParameterInstantiation(node, opts) {
  return !!node && node.type === "TSTypeParameterInstantiation" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeParameterDeclaration(node, opts) {
  return !!node && node.type === "TSTypeParameterDeclaration" && (opts == null || shallowEqual(node, opts));
}
function isTSTypeParameter(node, opts) {
  return !!node && node.type === "TSTypeParameter" && (opts == null || shallowEqual(node, opts));
}
function isStandardized(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "InterpreterDirective":
    case "Directive":
    case "DirectiveLiteral":
    case "BlockStatement":
    case "BreakStatement":
    case "CallExpression":
    case "CatchClause":
    case "ConditionalExpression":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "File":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Identifier":
    case "IfStatement":
    case "LabeledStatement":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "Program":
    case "ObjectExpression":
    case "ObjectMethod":
    case "ObjectProperty":
    case "RestElement":
    case "ReturnStatement":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "SwitchCase":
    case "SwitchStatement":
    case "ThisExpression":
    case "ThrowStatement":
    case "TryStatement":
    case "UnaryExpression":
    case "UpdateExpression":
    case "VariableDeclaration":
    case "VariableDeclarator":
    case "WhileStatement":
    case "WithStatement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ArrowFunctionExpression":
    case "ClassBody":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ExportSpecifier":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "MetaProperty":
    case "ClassMethod":
    case "ObjectPattern":
    case "SpreadElement":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateElement":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "ExportNamespaceSpecifier":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
    case "StaticBlock":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Identifier":
        case "StringLiteral":
        case "BlockStatement":
        case "ClassBody":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isExpression(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ArrayExpression":
    case "AssignmentExpression":
    case "BinaryExpression":
    case "CallExpression":
    case "ConditionalExpression":
    case "FunctionExpression":
    case "Identifier":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "LogicalExpression":
    case "MemberExpression":
    case "NewExpression":
    case "ObjectExpression":
    case "SequenceExpression":
    case "ParenthesizedExpression":
    case "ThisExpression":
    case "UnaryExpression":
    case "UpdateExpression":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "MetaProperty":
    case "Super":
    case "TaggedTemplateExpression":
    case "TemplateLiteral":
    case "YieldExpression":
    case "AwaitExpression":
    case "Import":
    case "BigIntLiteral":
    case "OptionalMemberExpression":
    case "OptionalCallExpression":
    case "TypeCastExpression":
    case "JSXElement":
    case "JSXFragment":
    case "BindExpression":
    case "DoExpression":
    case "RecordExpression":
    case "TupleExpression":
    case "DecimalLiteral":
    case "ModuleExpression":
    case "TopicReference":
    case "PipelineTopicExpression":
    case "PipelineBareFunction":
    case "PipelinePrimaryTopicReference":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Expression":
        case "Identifier":
        case "StringLiteral":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isBinary(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BinaryExpression":
    case "LogicalExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isScopable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ClassExpression":
    case "ClassDeclaration":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isBlockParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "CatchClause":
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "Program":
    case "ObjectMethod":
    case "SwitchStatement":
    case "WhileStatement":
    case "ArrowFunctionExpression":
    case "ForOfStatement":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isBlock(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "Program":
    case "TSModuleBlock":
      break;
    case "Placeholder":
      if (node.expectedNode === "BlockStatement") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BlockStatement":
    case "BreakStatement":
    case "ContinueStatement":
    case "DebuggerStatement":
    case "DoWhileStatement":
    case "EmptyStatement":
    case "ExpressionStatement":
    case "ForInStatement":
    case "ForStatement":
    case "FunctionDeclaration":
    case "IfStatement":
    case "LabeledStatement":
    case "ReturnStatement":
    case "SwitchStatement":
    case "ThrowStatement":
    case "TryStatement":
    case "VariableDeclaration":
    case "WhileStatement":
    case "WithStatement":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ForOfStatement":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
    case "TSImportEqualsDeclaration":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Statement":
        case "Declaration":
        case "BlockStatement":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTerminatorless(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
    case "YieldExpression":
    case "AwaitExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isCompletionStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "BreakStatement":
    case "ContinueStatement":
    case "ReturnStatement":
    case "ThrowStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isConditional(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ConditionalExpression":
    case "IfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isLoop(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "ForInStatement":
    case "ForStatement":
    case "WhileStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isWhile(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DoWhileStatement":
    case "WhileStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isExpressionWrapper(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExpressionStatement":
    case "ParenthesizedExpression":
    case "TypeCastExpression":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isForXStatement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ForInStatement":
    case "ForOfStatement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFunction(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFunctionParent(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ObjectMethod":
    case "ArrowFunctionExpression":
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "StaticBlock":
    case "TSModuleBlock":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isPureish(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "ArrowFunctionExpression":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "FunctionDeclaration":
    case "VariableDeclaration":
    case "ClassDeclaration":
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
    case "EnumDeclaration":
    case "TSDeclareFunction":
    case "TSInterfaceDeclaration":
    case "TSTypeAliasDeclaration":
    case "TSEnumDeclaration":
    case "TSModuleDeclaration":
      break;
    case "Placeholder":
      if (node.expectedNode === "Declaration") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isPatternLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isLVal(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "MemberExpression":
    case "RestElement":
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
    case "TSParameterProperty":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSNonNullExpression":
      break;
    case "Placeholder":
      switch (node.expectedNode) {
        case "Pattern":
        case "Identifier":
          break;
        default:
          return false;
      }
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTSEntityName(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Identifier":
    case "TSQualifiedName":
      break;
    case "Placeholder":
      if (node.expectedNode === "Identifier") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isLiteral(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "NullLiteral":
    case "BooleanLiteral":
    case "RegExpLiteral":
    case "TemplateLiteral":
    case "BigIntLiteral":
    case "DecimalLiteral":
      break;
    case "Placeholder":
      if (node.expectedNode === "StringLiteral") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isUserWhitespacable(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isMethod(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ClassMethod":
    case "ClassPrivateMethod":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isObjectMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectMethod":
    case "ObjectProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isProperty(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ObjectProperty":
    case "ClassProperty":
    case "ClassAccessorProperty":
    case "ClassPrivateProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isUnaryLike(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isPattern(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AssignmentPattern":
    case "ArrayPattern":
    case "ObjectPattern":
      break;
    case "Placeholder":
      if (node.expectedNode === "Pattern") break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isClass(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassExpression":
    case "ClassDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isImportOrExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
    case "ImportDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isExportDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportAllDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isModuleSpecifier(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ExportSpecifier":
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isAccessor(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassAccessorProperty":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isPrivate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "ClassPrivateProperty":
    case "ClassPrivateMethod":
    case "PrivateName":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFlow(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ClassImplements":
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "DeclaredPredicate":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "FunctionTypeParam":
    case "GenericTypeAnnotation":
    case "InferredPredicate":
    case "InterfaceExtends":
    case "InterfaceDeclaration":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "ObjectTypeInternalSlot":
    case "ObjectTypeCallProperty":
    case "ObjectTypeIndexer":
    case "ObjectTypeProperty":
    case "ObjectTypeSpreadProperty":
    case "OpaqueType":
    case "QualifiedTypeIdentifier":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "TypeAlias":
    case "TypeAnnotation":
    case "TypeCastExpression":
    case "TypeParameter":
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
    case "UnionTypeAnnotation":
    case "Variance":
    case "VoidTypeAnnotation":
    case "EnumDeclaration":
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFlowType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "ArrayTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "BooleanLiteralTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "ExistsTypeAnnotation":
    case "FunctionTypeAnnotation":
    case "GenericTypeAnnotation":
    case "InterfaceTypeAnnotation":
    case "IntersectionTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NullableTypeAnnotation":
    case "NumberLiteralTypeAnnotation":
    case "NumberTypeAnnotation":
    case "ObjectTypeAnnotation":
    case "StringLiteralTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "TupleTypeAnnotation":
    case "TypeofTypeAnnotation":
    case "UnionTypeAnnotation":
    case "VoidTypeAnnotation":
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFlowBaseAnnotation(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "AnyTypeAnnotation":
    case "BooleanTypeAnnotation":
    case "NullLiteralTypeAnnotation":
    case "MixedTypeAnnotation":
    case "EmptyTypeAnnotation":
    case "NumberTypeAnnotation":
    case "StringTypeAnnotation":
    case "SymbolTypeAnnotation":
    case "ThisTypeAnnotation":
    case "VoidTypeAnnotation":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFlowDeclaration(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclareClass":
    case "DeclareFunction":
    case "DeclareInterface":
    case "DeclareModule":
    case "DeclareModuleExports":
    case "DeclareTypeAlias":
    case "DeclareOpaqueType":
    case "DeclareVariable":
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
    case "InterfaceDeclaration":
    case "OpaqueType":
    case "TypeAlias":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isFlowPredicate(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "DeclaredPredicate":
    case "InferredPredicate":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isEnumBody(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isEnumMember(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
    case "EnumDefaultedMember":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isJSX(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "JSXAttribute":
    case "JSXClosingElement":
    case "JSXElement":
    case "JSXEmptyExpression":
    case "JSXExpressionContainer":
    case "JSXSpreadChild":
    case "JSXIdentifier":
    case "JSXMemberExpression":
    case "JSXNamespacedName":
    case "JSXOpeningElement":
    case "JSXSpreadAttribute":
    case "JSXText":
    case "JSXFragment":
    case "JSXOpeningFragment":
    case "JSXClosingFragment":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isMiscellaneous(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "Noop":
    case "Placeholder":
    case "V8IntrinsicIdentifier":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTypeScript(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSParameterProperty":
    case "TSDeclareFunction":
    case "TSDeclareMethod":
    case "TSQualifiedName":
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSNamedTupleMember":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSInterfaceDeclaration":
    case "TSInterfaceBody":
    case "TSTypeAliasDeclaration":
    case "TSInstantiationExpression":
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSTypeAssertion":
    case "TSEnumDeclaration":
    case "TSEnumMember":
    case "TSModuleDeclaration":
    case "TSModuleBlock":
    case "TSImportType":
    case "TSImportEqualsDeclaration":
    case "TSExternalModuleReference":
    case "TSNonNullExpression":
    case "TSExportAssignment":
    case "TSNamespaceExportDeclaration":
    case "TSTypeAnnotation":
    case "TSTypeParameterInstantiation":
    case "TSTypeParameterDeclaration":
    case "TSTypeParameter":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTSTypeElement(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSCallSignatureDeclaration":
    case "TSConstructSignatureDeclaration":
    case "TSPropertySignature":
    case "TSMethodSignature":
    case "TSIndexSignature":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTSType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSFunctionType":
    case "TSConstructorType":
    case "TSTypeReference":
    case "TSTypePredicate":
    case "TSTypeQuery":
    case "TSTypeLiteral":
    case "TSArrayType":
    case "TSTupleType":
    case "TSOptionalType":
    case "TSRestType":
    case "TSUnionType":
    case "TSIntersectionType":
    case "TSConditionalType":
    case "TSInferType":
    case "TSParenthesizedType":
    case "TSTypeOperator":
    case "TSIndexedAccessType":
    case "TSMappedType":
    case "TSLiteralType":
    case "TSExpressionWithTypeArguments":
    case "TSImportType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isTSBaseType(node, opts) {
  if (!node) return false;
  switch (node.type) {
    case "TSAnyKeyword":
    case "TSBooleanKeyword":
    case "TSBigIntKeyword":
    case "TSIntrinsicKeyword":
    case "TSNeverKeyword":
    case "TSNullKeyword":
    case "TSNumberKeyword":
    case "TSObjectKeyword":
    case "TSStringKeyword":
    case "TSSymbolKeyword":
    case "TSUndefinedKeyword":
    case "TSUnknownKeyword":
    case "TSVoidKeyword":
    case "TSThisType":
    case "TSLiteralType":
      break;
    default:
      return false;
  }
  return opts == null || shallowEqual(node, opts);
}
function isNumberLiteral(node, opts) {
  deprecationWarning("isNumberLiteral", "isNumericLiteral");
  return !!node && node.type === "NumberLiteral" && (opts == null || shallowEqual(node, opts));
}
function isRegexLiteral(node, opts) {
  deprecationWarning("isRegexLiteral", "isRegExpLiteral");
  return !!node && node.type === "RegexLiteral" && (opts == null || shallowEqual(node, opts));
}
function isRestProperty(node, opts) {
  deprecationWarning("isRestProperty", "isRestElement");
  return !!node && node.type === "RestProperty" && (opts == null || shallowEqual(node, opts));
}
function isSpreadProperty(node, opts) {
  deprecationWarning("isSpreadProperty", "isSpreadElement");
  return !!node && node.type === "SpreadProperty" && (opts == null || shallowEqual(node, opts));
}
function isModuleDeclaration(node, opts) {
  deprecationWarning("isModuleDeclaration", "isImportOrExportDeclaration");
  return isImportOrExportDeclaration(node, opts);
}

function matchesPattern(member, match, allowPartial) {
  if (!isMemberExpression(member)) return false;
  const parts = Array.isArray(match) ? match : match.split("."),
    nodes = [];
  let node;
  for (node = member; isMemberExpression(node); node = node.object) nodes.push(node.property);

  nodes.push(node);
  if (nodes.length < parts.length) return false;
  if (!allowPartial && nodes.length > parts.length) return false;
  for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
    const node = nodes[j];
    let value;
    if (isIdentifier(node)) value = node.name;
    else if (isStringLiteral(node)) value = node.value;
    else if (isThisExpression(node)) value = "this";
    else return false;

    if (parts[i] !== value) return false;
  }
  return true;
}

function buildMatchMemberExpression(match, allowPartial) {
  const parts = match.split(".");
  return member => matchesPattern(member, parts, allowPartial);
}

const isReactComponent = buildMatchMemberExpression("React.Component");

function isCompatTag(tagName) {
  return !!tagName && /^[a-z]/.test(tagName);
}

let fastProto = null;
function FastObject(o) {
  if (fastProto !== null && typeof fastProto.property) {
    const result = fastProto;
    fastProto = FastObject.prototype = null;
    return result;
  }
  fastProto = FastObject.prototype = o == null ? Object.create(null) : o;
  return new FastObject();
}
FastObject();
var toFastProperties = function (o) {
  return FastObject(o);
};

function isType(nodeType, targetType) {
  if (nodeType === targetType) return true;
  if (nodeType == null || ALIAS_KEYS[targetType]) return false;
  const aliases = FLIPPED_ALIAS_KEYS[targetType];
  if (aliases) {
    if (aliases[0] === nodeType) return true;
    for (const alias of aliases) if (nodeType === alias) return true;
  }
  return false;
}

function isPlaceholderType(placeholderType, targetType) {
  if (placeholderType === targetType) return true;
  const aliases = PLACEHOLDERS_ALIAS[placeholderType];
  if (aliases) for (const alias of aliases) if (targetType === alias) return true;

  return false;
}

function is(type, node, opts) {
  return (
    !!node &&
    (isType(node.type, type)
      ? opts === void 0 || shallowEqual(node, opts)
      : !opts && node.type === "Placeholder" && type in FLIPPED_ALIAS_KEYS &&
        isPlaceholderType(node.expectedNode, type))
  );
}

function isValidIdentifier(name, reserved = true) {
  return (
    typeof name == "string" &&
    (!reserved || (!common.isKeyword(name) && !common.isStrictReservedWord(name, true))) &&
    common.isIdentifierName(name)
  );
}

const STATEMENT_OR_BLOCK_KEYS = ["consequent", "body", "alternate"],
  FLATTENABLE_KEYS = ["body", "expressions"],
  FOR_INIT_KEYS = ["left", "init"],
  COMMENT_KEYS = ["leadingComments", "trailingComments", "innerComments"],
  LOGICAL_OPERATORS = ["||", "&&", "??"],
  UPDATE_OPERATORS = ["++", "--"],
  BOOLEAN_NUMBER_BINARY_OPERATORS = [">", "<", ">=", "<="],
  EQUALITY_BINARY_OPERATORS = ["==", "===", "!=", "!=="],
  COMPARISON_BINARY_OPERATORS = [...EQUALITY_BINARY_OPERATORS, "in", "instanceof"],
  BOOLEAN_BINARY_OPERATORS = [...COMPARISON_BINARY_OPERATORS, ...BOOLEAN_NUMBER_BINARY_OPERATORS],
  NUMBER_BINARY_OPERATORS = ["-", "/", "%", "*", "**", "&", "|", ">>", ">>>", "<<", "^"],
  BINARY_OPERATORS = ["+", ...NUMBER_BINARY_OPERATORS, ...BOOLEAN_BINARY_OPERATORS, "|>"];
const ASSIGNMENT_OPERATORS = [
  "=",
  "+=",
  ...NUMBER_BINARY_OPERATORS.map(op => op + "="),
  ...LOGICAL_OPERATORS.map(op => op + "=")
];
const BOOLEAN_UNARY_OPERATORS = ["delete", "!"],
  NUMBER_UNARY_OPERATORS = ["+", "-", "~"],
  STRING_UNARY_OPERATORS = ["typeof"];
const UNARY_OPERATORS = [
  "void",
  "throw",
  ...BOOLEAN_UNARY_OPERATORS,
  ...NUMBER_UNARY_OPERATORS,
  ...STRING_UNARY_OPERATORS
];
const INHERIT_KEYS = {
  optional: ["typeAnnotation", "typeParameters", "returnType"],
  force: ["start", "loc", "end"]
};
const BLOCK_SCOPED_SYMBOL = Symbol.for("var used to be block scoped"),
  NOT_LOCAL_BINDING = Symbol.for("should not be considered a local binding"),

  VISITOR_KEYS = {},
  ALIAS_KEYS = {},
  FLIPPED_ALIAS_KEYS = {},
  NODE_FIELDS = {},
  BUILDER_KEYS = {},
  DEPRECATED_KEYS = {},
  NODE_PARENT_VALIDATIONS = {};
function getType(val) {
  return Array.isArray(val) ? "array" : val === null ? "null" : typeof val;
}
function validate$1(validate) {
  return { validate };
}
function typeIs(typeName) {
  return typeof typeName == "string" ? assertNodeType(typeName) : assertNodeType(...typeName);
}
function validateType(typeName) {
  return validate$1(typeIs(typeName));
}
function validateOptional(validate) {
  return { validate, optional: true };
}
function validateOptionalType(typeName) {
  return { validate: typeIs(typeName), optional: true };
}
function arrayOf(elementType) {
  return chain(assertValueType("array"), assertEach(elementType));
}
function arrayOfType(typeName) {
  return arrayOf(typeIs(typeName));
}
function validateArrayOfType(typeName) {
  return validate$1(arrayOfType(typeName));
}
function assertEach(callback) {
  function validator(node, key, val) {
    if (!Array.isArray(val)) return;
    for (let i = 0; i < val.length; i++) {
      const subkey = `${key}[${i}]`,
        v = val[i];
      callback(node, subkey, v);
      process.env.BABEL_TYPES_8_BREAKING && validateChild(node, subkey, v);
    }
  }
  validator.each = callback;
  return validator;
}
function assertOneOf(...values) {
  function validate(node, key, val) {
    if (values.indexOf(val) < 0)
      throw new TypeError(
        `Property ${key} expected value to be one of ${JSON.stringify(values)} but got ${JSON.stringify(val)}`
      );
  }
  validate.oneOf = values;
  return validate;
}
function assertNodeType(...types) {
  function validate(node, key, val) {
    for (const type of types)
      if (is(type, val)) {
        validateChild(node, key, val);
        return;
      }

    throw new TypeError(
      `Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(
        types
      )} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`
    );
  }
  validate.oneOfNodeTypes = types;
  return validate;
}
function assertNodeOrValueType(...types) {
  function validate(node, key, val) {
    for (const type of types)
      if (getType(val) === type || is(type, val)) {
        validateChild(node, key, val);
        return;
      }

    throw new TypeError(
      `Property ${key} of ${node.type} expected node to be of a type ${JSON.stringify(
        types
      )} but instead got ${JSON.stringify(val == null ? void 0 : val.type)}`
    );
  }
  validate.oneOfNodeOrValueTypes = types;
  return validate;
}
function assertValueType(type) {
  function validate(node, key, val) {
    if (getType(val) !== type)
      throw new TypeError(`Property ${key} expected type of ${type} but got ${getType(val)}`);
  }
  validate.type = type;
  return validate;
}
function assertShape(shape) {
  function validate(node, key, val) {
    const errors = [];
    for (const property of Object.keys(shape))
      try {
        validateField(node, property, val[property], shape[property]);
      } catch (error) {
        if (error instanceof TypeError) {
          errors.push(error.message);
          continue;
        }
        throw error;
      }

    if (errors.length)
      throw new TypeError(`Property ${key} of ${node.type} expected to have the following:\n${errors.join("\n")}`);
  }
  validate.shapeOf = shape;
  return validate;
}
function assertOptionalChainStart() {
  function validate(node) {
    var _current;
    let current = node;
    while (node) {
      const { type } = current;
      if (type === "OptionalCallExpression") {
        if (current.optional) return;
        current = current.callee;
      } else if (type === "OptionalMemberExpression") {
        if (current.optional) return;
        current = current.object;
      } else break;
    }
    throw new TypeError(
      `Non-optional ${node.type} must chain from an optional OptionalMemberExpression or OptionalCallExpression. Found chain from ${
        (_current = current) == null ? void 0 : _current.type
      }`
    );
  }
  return validate;
}
function chain(...fns) {
  function validate(...args) {
    for (const fn of fns) fn(...args);
  }
  validate.chainOf = fns;
  if (fns.length >= 2 && "type" in fns[0] && fns[0].type === "array" && !("each" in fns[1]))
    throw new Error('An assertValueType("array") validator can only be followed by an assertEach(...) validator.');

  return validate;
}
const validTypeOpts = ["aliases", "builder", "deprecatedAlias", "fields", "inherits", "visitor", "validate"],
  validFieldKeys = ["default", "optional", "deprecated", "validate"],
  store = {};
function defineAliasedType(...aliases) {
  return (type, opts = {}) => {
    let defined = opts.aliases;
    if (!defined) {
      var _store$opts$inherits$;
      if (opts.inherits)
        defined =
          (_store$opts$inherits$ = store[opts.inherits].aliases) == null ? void 0 : _store$opts$inherits$.slice();
      defined != null || (defined = []);
      opts.aliases = defined;
    }
    const additional = aliases.filter(a => !defined.includes(a));
    defined.unshift(...additional);
    defineType$5(type, opts);
  };
}
function defineType$5(type, opts = {}) {
  const inherits = (opts.inherits && store[opts.inherits]) || {};
  let fields = opts.fields;
  if (!fields) {
    fields = {};
    if (inherits.fields) {
      const keys = Object.getOwnPropertyNames(inherits.fields);
      for (const key of keys) {
        const field = inherits.fields[key],
          def = field.default;
        if (Array.isArray(def) ? def.length > 0 : def && typeof def == "object")
          throw new Error("field defaults can only be primitives or empty arrays currently");

        fields[key] = {
          default: Array.isArray(def) ? [] : def,
          optional: field.optional,
          deprecated: field.deprecated,
          validate: field.validate
        };
      }
    }
  }
  const visitor = opts.visitor || inherits.visitor || [],
    aliases = opts.aliases || inherits.aliases || [],
    builder = opts.builder || inherits.builder || opts.visitor || [];
  for (const k of Object.keys(opts))
    if (validTypeOpts.indexOf(k) < 0) throw new Error(`Unknown type option "${k}" on ${type}`);

  if (opts.deprecatedAlias) DEPRECATED_KEYS[opts.deprecatedAlias] = type;

  for (const key of visitor.concat(builder)) fields[key] = fields[key] || {};

  for (const key of Object.keys(fields)) {
    const field = fields[key];
    if (field.default !== void 0 && builder.indexOf(key) < 0) field.optional = true;

    field.default === void 0
      ? (field.default = null)
      : field.validate || field.default == null || (field.validate = assertValueType(getType(field.default)));

    for (const k of Object.keys(field))
      if (validFieldKeys.indexOf(k) < 0) throw new Error(`Unknown field key "${k}" on ${type}.${key}`);
  }
  VISITOR_KEYS[type] = opts.visitor = visitor;
  BUILDER_KEYS[type] = opts.builder = builder;
  NODE_FIELDS[type] = opts.fields = fields;
  ALIAS_KEYS[type] = opts.aliases = aliases;
  aliases.forEach(alias => {
    FLIPPED_ALIAS_KEYS[alias] = FLIPPED_ALIAS_KEYS[alias] || [];
    FLIPPED_ALIAS_KEYS[alias].push(type);
  });
  if (opts.validate) NODE_PARENT_VALIDATIONS[type] = opts.validate;

  store[type] = opts;
}

const defineType$4 = defineAliasedType("Standardized");
defineType$4("ArrayExpression", {
  fields: {
    elements: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeOrValueType("null", "Expression", "SpreadElement"))
      ),
      default: process.env.BABEL_TYPES_8_BREAKING ? void 0 : []
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
defineType$4("AssignmentExpression", {
  fields: {
    operator: {
      validate: (function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) return assertValueType("string");

        const identifier = assertOneOf(...ASSIGNMENT_OPERATORS),
          pattern = assertOneOf("=");
        return function (node, key, val) {
          (is("Pattern", node.left) ? pattern : identifier)(node, key, val);
        };
      })()
    },
    left: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? assertNodeType(
            "Identifier",
            "MemberExpression",
            "ArrayPattern",
            "ObjectPattern",
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSTypeAssertion",
            "TSNonNullExpression"
          )
        : assertNodeType("LVal")
    },
    right: { validate: assertNodeType("Expression") }
  },
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Expression"]
});
defineType$4("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: { validate: assertOneOf(...BINARY_OPERATORS) },
    left: {
      validate: (function () {
        const expression = assertNodeType("Expression"),
          inOp = assertNodeType("Expression", "PrivateName");
        return Object.assign(
          function (node, key, val) {
            (node.operator === "in" ? inOp : expression)(node, key, val);
          },
          { oneOfNodeTypes: ["Expression", "PrivateName"] }
        );
      })()
    },
    right: { validate: assertNodeType("Expression") }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
defineType$4("InterpreterDirective", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } }
});
defineType$4("Directive", {
  visitor: ["value"],
  fields: { value: { validate: assertNodeType("DirectiveLiteral") } }
});
defineType$4("DirectiveLiteral", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } }
});
defineType$4("BlockStatement", {
  builder: ["body", "directives"],
  visitor: ["directives", "body"],
  fields: {
    directives: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Directive"))), default: [] },
    body: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Statement"))) }
  },
  aliases: ["Scopable", "BlockParent", "Block", "Statement"]
});
defineType$4("BreakStatement", {
  visitor: ["label"],
  fields: { label: { validate: assertNodeType("Identifier"), optional: true } },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType$4("CallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments"],
  aliases: ["Expression"],
  fields: Object.assign(
    {
      callee: { validate: assertNodeType("Expression", "Super", "V8IntrinsicIdentifier") },
      arguments: {
        validate: chain(
          assertValueType("array"),
          assertEach(assertNodeType("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder"))
        )
      }
    },
    process.env.BABEL_TYPES_8_BREAKING ? {} : { optional: { validate: assertOneOf(true, false), optional: true } },
    {
      typeArguments: { validate: assertNodeType("TypeParameterInstantiation"), optional: true },
      typeParameters: { validate: assertNodeType("TSTypeParameterInstantiation"), optional: true }
    }
  )
});
defineType$4("CatchClause", {
  visitor: ["param", "body"],
  fields: {
    param: { validate: assertNodeType("Identifier", "ArrayPattern", "ObjectPattern"), optional: true },
    body: { validate: assertNodeType("BlockStatement") }
  },
  aliases: ["Scopable", "BlockParent"]
});
defineType$4("ConditionalExpression", {
  visitor: ["test", "consequent", "alternate"],
  fields: {
    test: { validate: assertNodeType("Expression") },
    consequent: { validate: assertNodeType("Expression") },
    alternate: { validate: assertNodeType("Expression") }
  },
  aliases: ["Expression", "Conditional"]
});
defineType$4("ContinueStatement", {
  visitor: ["label"],
  fields: { label: { validate: assertNodeType("Identifier"), optional: true } },
  aliases: ["Statement", "Terminatorless", "CompletionStatement"]
});
defineType$4("DebuggerStatement", { aliases: ["Statement"] });
defineType$4("DoWhileStatement", {
  visitor: ["test", "body"],
  fields: { test: { validate: assertNodeType("Expression") }, body: { validate: assertNodeType("Statement") } },
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"]
});
defineType$4("EmptyStatement", { aliases: ["Statement"] });
defineType$4("ExpressionStatement", {
  visitor: ["expression"],
  fields: { expression: { validate: assertNodeType("Expression") } },
  aliases: ["Statement", "ExpressionWrapper"]
});
defineType$4("File", {
  builder: ["program", "comments", "tokens"],
  visitor: ["program"],
  fields: {
    program: { validate: assertNodeType("Program") },
    comments: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? assertEach(assertNodeType("CommentBlock", "CommentLine"))
        : Object.assign(() => {}, { each: { oneOfNodeTypes: ["CommentBlock", "CommentLine"] } }),
      optional: true
    },
    tokens: { validate: assertEach(Object.assign(() => {}, { type: "any" })), optional: true }
  }
});
defineType$4("ForInStatement", {
  visitor: ["left", "right", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? assertNodeType(
            "VariableDeclaration",
            "Identifier",
            "MemberExpression",
            "ArrayPattern",
            "ObjectPattern",
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSTypeAssertion",
            "TSNonNullExpression"
          )
        : assertNodeType("VariableDeclaration", "LVal")
    },
    right: { validate: assertNodeType("Expression") },
    body: { validate: assertNodeType("Statement") }
  }
});
defineType$4("ForStatement", {
  visitor: ["init", "test", "update", "body"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop"],
  fields: {
    init: { validate: assertNodeType("VariableDeclaration", "Expression"), optional: true },
    test: { validate: assertNodeType("Expression"), optional: true },
    update: { validate: assertNodeType("Expression"), optional: true },
    body: { validate: assertNodeType("Statement") }
  }
});
const functionCommon = () => ({
  params: {
    validate: chain(assertValueType("array"), assertEach(assertNodeType("Identifier", "Pattern", "RestElement")))
  },
  generator: { default: false },
  async: { default: false }
});
const functionTypeAnnotationCommon = () => ({
  returnType: { validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation", "Noop"), optional: true },
  typeParameters: {
    validate: assertNodeType("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
    optional: true
  }
});
const functionDeclarationCommon = () =>
  Object.assign({}, functionCommon(), {
    declare: { validate: assertValueType("boolean"), optional: true },
    id: { validate: assertNodeType("Identifier"), optional: true }
  });
defineType$4("FunctionDeclaration", {
  builder: ["id", "params", "body", "generator", "async"],
  visitor: ["id", "params", "body", "returnType", "typeParameters"],
  fields: Object.assign({}, functionDeclarationCommon(), functionTypeAnnotationCommon(), {
    body: { validate: assertNodeType("BlockStatement") },
    predicate: { validate: assertNodeType("DeclaredPredicate", "InferredPredicate"), optional: true }
  }),
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Statement", "Pureish", "Declaration"],
  validate: (function () {
    if (!process.env.BABEL_TYPES_8_BREAKING) return () => {};
    const identifier = assertNodeType("Identifier");
    return function (parent, key, node) {
      is("ExportDefaultDeclaration", parent) || identifier(node, "id", node.id);
    };
  })()
});
defineType$4("FunctionExpression", {
  inherits: "FunctionDeclaration",
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    id: { validate: assertNodeType("Identifier"), optional: true },
    body: { validate: assertNodeType("BlockStatement") },
    predicate: { validate: assertNodeType("DeclaredPredicate", "InferredPredicate"), optional: true }
  })
});
const patternLikeCommon = () => ({
  typeAnnotation: { validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation", "Noop"), optional: true },
  optional: { validate: assertValueType("boolean"), optional: true },
  decorators: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))), optional: true }
});
defineType$4("Identifier", {
  builder: ["name"],
  visitor: ["typeAnnotation", "decorators"],
  aliases: ["Expression", "PatternLike", "LVal", "TSEntityName"],
  fields: Object.assign({}, patternLikeCommon(), {
    name: {
      validate: chain(
        assertValueType("string"),
        Object.assign(
          function (node, key, val) {
            if (process.env.BABEL_TYPES_8_BREAKING && !isValidIdentifier(val, false))
              throw new TypeError(`"${val}" is not a valid identifier name`);
          },
          { type: "string" }
        )
      )
    }
  }),
  validate(parent, key, node) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /\.(\w+)$/.exec(key);
    if (!match) return;
    const [, parentKey] = match,
      nonComp = { computed: false };
    if (parentKey === "property") {
      if (is("MemberExpression", parent, nonComp) || is("OptionalMemberExpression", parent, nonComp)) return;
    } else if (parentKey === "key") {
      if (is("Property", parent, nonComp) || is("Method", parent, nonComp)) return;
    } else if (parentKey === "exported") {
      if (is("ExportSpecifier", parent)) return;
    } else if (parentKey === "imported") {
      if (is("ImportSpecifier", parent, { imported: node })) return;
    } else if (parentKey === "meta" && is("MetaProperty", parent, { meta: node })) return;

    if ((common.isKeyword(node.name) || common.isReservedWord(node.name, false)) && node.name !== "this")
      throw new TypeError(`"${node.name}" is not a valid identifier`);
  }
});
defineType$4("IfStatement", {
  visitor: ["test", "consequent", "alternate"],
  aliases: ["Statement", "Conditional"],
  fields: {
    test: { validate: assertNodeType("Expression") },
    consequent: { validate: assertNodeType("Statement") },
    alternate: { optional: true, validate: assertNodeType("Statement") }
  }
});
defineType$4("LabeledStatement", {
  visitor: ["label", "body"],
  aliases: ["Statement"],
  fields: { label: { validate: assertNodeType("Identifier") }, body: { validate: assertNodeType("Statement") } }
});
defineType$4("StringLiteral", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType$4("NumericLiteral", {
  builder: ["value"],
  deprecatedAlias: "NumberLiteral",
  fields: {
    value: {
      validate: chain(
        assertValueType("number"),
        Object.assign(function (node, key, val) {}, { type: "number" })
      )
    }
  },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType$4("NullLiteral", { aliases: ["Expression", "Pureish", "Literal", "Immutable"] });
defineType$4("BooleanLiteral", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("boolean") } },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType$4("RegExpLiteral", {
  builder: ["pattern", "flags"],
  deprecatedAlias: "RegexLiteral",
  aliases: ["Expression", "Pureish", "Literal"],
  fields: {
    pattern: { validate: assertValueType("string") },
    flags: {
      validate: chain(
        assertValueType("string"),
        Object.assign(
          function (node, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;
            const invalid = /[^gimsuy]/.exec(val);
            if (invalid) throw new TypeError(`"${invalid[0]}" is not a valid RegExp flag`);
          },
          { type: "string" }
        )
      ),
      default: ""
    }
  }
});
defineType$4("LogicalExpression", {
  builder: ["operator", "left", "right"],
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"],
  fields: {
    operator: { validate: assertOneOf(...LOGICAL_OPERATORS) },
    left: { validate: assertNodeType("Expression") },
    right: { validate: assertNodeType("Expression") }
  }
});
defineType$4("MemberExpression", {
  builder: ["object", "property", "computed", ...(process.env.BABEL_TYPES_8_BREAKING ? [] : ["optional"])],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: Object.assign(
    {
      object: { validate: assertNodeType("Expression", "Super") },
      property: {
        validate: (function () {
          const normal = assertNodeType("Identifier", "PrivateName"),
            computed = assertNodeType("Expression");
          const validator = function (node, key, val) {
            (node.computed ? computed : normal)(node, key, val);
          };
          validator.oneOfNodeTypes = ["Expression", "Identifier", "PrivateName"];
          return validator;
        })()
      },
      computed: { default: false }
    },
    process.env.BABEL_TYPES_8_BREAKING ? {} : { optional: { validate: assertOneOf(true, false), optional: true } }
  )
});
defineType$4("NewExpression", { inherits: "CallExpression" });
defineType$4("Program", {
  visitor: ["directives", "body"],
  builder: ["body", "directives", "sourceType", "interpreter"],
  fields: {
    sourceFile: { validate: assertValueType("string") },
    sourceType: { validate: assertOneOf("script", "module"), default: "script" },
    interpreter: { validate: assertNodeType("InterpreterDirective"), default: null, optional: true },
    directives: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Directive"))), default: [] },
    body: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Statement"))) }
  },
  aliases: ["Scopable", "BlockParent", "Block"]
});
defineType$4("ObjectExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("ObjectMethod", "ObjectProperty", "SpreadElement"))
      )
    }
  }
});
defineType$4("ObjectMethod", {
  builder: ["kind", "key", "params", "body", "computed", "generator", "async"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    kind: Object.assign(
      { validate: assertOneOf("method", "get", "set") },
      process.env.BABEL_TYPES_8_BREAKING ? {} : { default: "method" }
    ),
    computed: { default: false },
    key: {
      validate: (function () {
        const normal = assertNodeType("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral"),
          computed = assertNodeType("Expression");
        const validator = function (node, key, val) {
          (node.computed ? computed : normal)(node, key, val);
        };
        validator.oneOfNodeTypes = ["Expression", "Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral"];
        return validator;
      })()
    },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    body: { validate: assertNodeType("BlockStatement") }
  }),
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["UserWhitespacable", "Function", "Scopable", "BlockParent", "FunctionParent", "Method", "ObjectMember"]
});
defineType$4("ObjectProperty", {
  builder: ["key", "value", "computed", "shorthand", ...(process.env.BABEL_TYPES_8_BREAKING ? [] : ["decorators"])],
  fields: {
    computed: { default: false },
    key: {
      validate: (function () {
        const normal = assertNodeType(
          "Identifier",
          "StringLiteral",
          "NumericLiteral",
          "BigIntLiteral",
          "DecimalLiteral",
          "PrivateName"
        );
        const computed = assertNodeType("Expression");
        return Object.assign(
          function (node, key, val) {
            (node.computed ? computed : normal)(node, key, val);
          },
          {
            oneOfNodeTypes: [
              "Expression",
              "Identifier",
              "StringLiteral",
              "NumericLiteral",
              "BigIntLiteral",
              "DecimalLiteral",
              "PrivateName"
            ]
          }
        );
      })()
    },
    value: { validate: assertNodeType("Expression", "PatternLike") },
    shorthand: {
      validate: chain(
        assertValueType("boolean"),
        Object.assign(
          function (node, key, val) {
            if (process.env.BABEL_TYPES_8_BREAKING && val && node.computed)
              throw new TypeError("Property shorthand of ObjectProperty cannot be true if computed is true");
          },
          { type: "boolean" }
        ),
        function (node, key, val) {
          if (process.env.BABEL_TYPES_8_BREAKING && val && !is("Identifier", node.key))
            throw new TypeError("Property shorthand of ObjectProperty cannot be true if key is not an Identifier");
        }
      ),
      default: false
    },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    }
  },
  visitor: ["key", "value", "decorators"],
  aliases: ["UserWhitespacable", "Property", "ObjectMember"],
  validate: (function () {
    const pattern = assertNodeType(
      "Identifier",
      "Pattern",
      "TSAsExpression",
      "TSSatisfiesExpression",
      "TSNonNullExpression",
      "TSTypeAssertion"
    );
    const expression = assertNodeType("Expression");
    return function (parent, key, node) {
      process.env.BABEL_TYPES_8_BREAKING &&
        (is("ObjectPattern", parent) ? pattern : expression)(node, "value", node.value);
    };
  })()
});
defineType$4("RestElement", {
  visitor: ["argument", "typeAnnotation"],
  builder: ["argument"],
  aliases: ["LVal", "PatternLike"],
  deprecatedAlias: "RestProperty",
  fields: Object.assign({}, patternLikeCommon(), {
    argument: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? assertNodeType(
            "Identifier",
            "ArrayPattern",
            "ObjectPattern",
            "MemberExpression",
            "TSAsExpression",
            "TSSatisfiesExpression",
            "TSTypeAssertion",
            "TSNonNullExpression"
          )
        : assertNodeType("LVal")
    }
  }),
  validate(parent, key) {
    if (!process.env.BABEL_TYPES_8_BREAKING) return;
    const match = /(\w+)\[(\d+)\]/.exec(key);
    if (!match) throw new Error("Internal Babel error: malformed key.");
    const [, listKey, index] = match;
    if (parent[listKey].length > +index + 1) throw new TypeError("RestElement must be last element of " + listKey);
  }
});
defineType$4("ReturnStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: { argument: { validate: assertNodeType("Expression"), optional: true } }
});
defineType$4("SequenceExpression", {
  visitor: ["expressions"],
  fields: { expressions: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Expression"))) } },
  aliases: ["Expression"]
});
defineType$4("ParenthesizedExpression", {
  visitor: ["expression"],
  aliases: ["Expression", "ExpressionWrapper"],
  fields: { expression: { validate: assertNodeType("Expression") } }
});
defineType$4("SwitchCase", {
  visitor: ["test", "consequent"],
  fields: {
    test: { validate: assertNodeType("Expression"), optional: true },
    consequent: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Statement"))) }
  }
});
defineType$4("SwitchStatement", {
  visitor: ["discriminant", "cases"],
  aliases: ["Statement", "BlockParent", "Scopable"],
  fields: {
    discriminant: { validate: assertNodeType("Expression") },
    cases: { validate: chain(assertValueType("array"), assertEach(assertNodeType("SwitchCase"))) }
  }
});
defineType$4("ThisExpression", { aliases: ["Expression"] });
defineType$4("ThrowStatement", {
  visitor: ["argument"],
  aliases: ["Statement", "Terminatorless", "CompletionStatement"],
  fields: { argument: { validate: assertNodeType("Expression") } }
});
defineType$4("TryStatement", {
  visitor: ["block", "handler", "finalizer"],
  aliases: ["Statement"],
  fields: {
    block: {
      validate: chain(
        assertNodeType("BlockStatement"),
        Object.assign(
          function (node) {
            if (process.env.BABEL_TYPES_8_BREAKING && !node.handler && !node.finalizer)
              throw new TypeError("TryStatement expects either a handler or finalizer, or both");
          },
          { oneOfNodeTypes: ["BlockStatement"] }
        )
      )
    },
    handler: { optional: true, validate: assertNodeType("CatchClause") },
    finalizer: { optional: true, validate: assertNodeType("BlockStatement") }
  }
});
defineType$4("UnaryExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: { default: true },
    argument: { validate: assertNodeType("Expression") },
    operator: { validate: assertOneOf(...UNARY_OPERATORS) }
  },
  visitor: ["argument"],
  aliases: ["UnaryLike", "Expression"]
});
defineType$4("UpdateExpression", {
  builder: ["operator", "argument", "prefix"],
  fields: {
    prefix: { default: false },
    argument: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? assertNodeType("Identifier", "MemberExpression")
        : assertNodeType("Expression")
    },
    operator: { validate: assertOneOf(...UPDATE_OPERATORS) }
  },
  visitor: ["argument"],
  aliases: ["Expression"]
});
defineType$4("VariableDeclaration", {
  builder: ["kind", "declarations"],
  visitor: ["declarations"],
  aliases: ["Statement", "Declaration"],
  fields: {
    declare: { validate: assertValueType("boolean"), optional: true },
    kind: { validate: assertOneOf("var", "let", "const", "using", "await using") },
    declarations: { validate: chain(assertValueType("array"), assertEach(assertNodeType("VariableDeclarator"))) }
  },
  validate(parent, key, node) {
    if (
      process.env.BABEL_TYPES_8_BREAKING &&
      is("ForXStatement", parent, { left: node }) &&
      node.declarations.length !== 1
    )
      throw new TypeError("Exactly one VariableDeclarator is required in the VariableDeclaration of a " + parent.type);
  }
});
defineType$4("VariableDeclarator", {
  visitor: ["id", "init"],
  fields: {
    id: {
      validate: (function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) return assertNodeType("LVal");

        const normal = assertNodeType("Identifier", "ArrayPattern", "ObjectPattern"),
          without = assertNodeType("Identifier");
        return function (node, key, val) {
          (node.init ? normal : without)(node, key, val);
        };
      })()
    },
    definite: { optional: true, validate: assertValueType("boolean") },
    init: { optional: true, validate: assertNodeType("Expression") }
  }
});
defineType$4("WhileStatement", {
  visitor: ["test", "body"],
  aliases: ["Statement", "BlockParent", "Loop", "While", "Scopable"],
  fields: { test: { validate: assertNodeType("Expression") }, body: { validate: assertNodeType("Statement") } }
});
defineType$4("WithStatement", {
  visitor: ["object", "body"],
  aliases: ["Statement"],
  fields: { object: { validate: assertNodeType("Expression") }, body: { validate: assertNodeType("Statement") } }
});
defineType$4("AssignmentPattern", {
  visitor: ["left", "right", "decorators"],
  builder: ["left", "right"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    left: {
      validate: assertNodeType(
        "Identifier",
        "ObjectPattern",
        "ArrayPattern",
        "MemberExpression",
        "TSAsExpression",
        "TSSatisfiesExpression",
        "TSTypeAssertion",
        "TSNonNullExpression"
      )
    },
    right: { validate: assertNodeType("Expression") },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    }
  })
});
defineType$4("ArrayPattern", {
  visitor: ["elements", "typeAnnotation"],
  builder: ["elements"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    elements: {
      validate: chain(assertValueType("array"), assertEach(assertNodeOrValueType("null", "PatternLike", "LVal")))
    }
  })
});
defineType$4("ArrowFunctionExpression", {
  builder: ["params", "body", "async"],
  visitor: ["params", "body", "returnType", "typeParameters"],
  aliases: ["Scopable", "Function", "BlockParent", "FunctionParent", "Expression", "Pureish"],
  fields: Object.assign({}, functionCommon(), functionTypeAnnotationCommon(), {
    expression: { validate: assertValueType("boolean") },
    body: { validate: assertNodeType("BlockStatement", "Expression") },
    predicate: { validate: assertNodeType("DeclaredPredicate", "InferredPredicate"), optional: true }
  })
});
defineType$4("ClassBody", {
  visitor: ["body"],
  fields: {
    body: {
      validate: chain(
        assertValueType("array"),
        assertEach(
          assertNodeType(
            "ClassMethod",
            "ClassPrivateMethod",
            "ClassProperty",
            "ClassPrivateProperty",
            "ClassAccessorProperty",
            "TSDeclareMethod",
            "TSIndexSignature",
            "StaticBlock"
          )
        )
      )
    }
  }
});
defineType$4("ClassExpression", {
  builder: ["id", "superClass", "body", "decorators"],
  visitor: ["id", "body", "superClass", "mixins", "typeParameters", "superTypeParameters", "implements", "decorators"],
  aliases: ["Scopable", "Class", "Expression"],
  fields: {
    id: { validate: assertNodeType("Identifier"), optional: true },
    typeParameters: {
      validate: assertNodeType("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: { validate: assertNodeType("ClassBody") },
    superClass: { optional: true, validate: assertNodeType("Expression") },
    superTypeParameters: {
      validate: assertNodeType("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("TSExpressionWithTypeArguments", "ClassImplements"))
      ),
      optional: true
    },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    mixins: { validate: assertNodeType("InterfaceExtends"), optional: true }
  }
});
defineType$4("ClassDeclaration", {
  inherits: "ClassExpression",
  aliases: ["Scopable", "Class", "Statement", "Declaration"],
  fields: {
    id: { validate: assertNodeType("Identifier"), optional: true },
    typeParameters: {
      validate: assertNodeType("TypeParameterDeclaration", "TSTypeParameterDeclaration", "Noop"),
      optional: true
    },
    body: { validate: assertNodeType("ClassBody") },
    superClass: { optional: true, validate: assertNodeType("Expression") },
    superTypeParameters: {
      validate: assertNodeType("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    },
    implements: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("TSExpressionWithTypeArguments", "ClassImplements"))
      ),
      optional: true
    },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    mixins: { validate: assertNodeType("InterfaceExtends"), optional: true },
    declare: { validate: assertValueType("boolean"), optional: true },
    abstract: { validate: assertValueType("boolean"), optional: true }
  },
  validate: (function () {
    const identifier = assertNodeType("Identifier");
    return function (parent, key, node) {
      !process.env.BABEL_TYPES_8_BREAKING || is("ExportDefaultDeclaration", parent) || identifier(node, "id", node.id);
    };
  })()
});
defineType$4("ExportAllDeclaration", {
  builder: ["source"],
  visitor: ["source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    source: { validate: assertNodeType("StringLiteral") },
    exportKind: validateOptional(assertOneOf("type", "value")),
    attributes: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    }
  }
});
defineType$4("ExportDefaultDeclaration", {
  visitor: ["declaration"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      validate: assertNodeType("TSDeclareFunction", "FunctionDeclaration", "ClassDeclaration", "Expression")
    },
    exportKind: validateOptional(assertOneOf("value"))
  }
});
defineType$4("ExportNamedDeclaration", {
  builder: ["declaration", "specifiers", "source"],
  visitor: ["declaration", "specifiers", "source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration", "ExportDeclaration"],
  fields: {
    declaration: {
      optional: true,
      validate: chain(
        assertNodeType("Declaration"),
        Object.assign(
          function (node, key, val) {
            if (process.env.BABEL_TYPES_8_BREAKING && val && node.specifiers.length)
              throw new TypeError("Only declaration or specifiers is allowed on ExportNamedDeclaration");
          },
          { oneOfNodeTypes: ["Declaration"] }
        ),
        function (node, key, val) {
          if (process.env.BABEL_TYPES_8_BREAKING && val && node.source)
            throw new TypeError("Cannot export a declaration from a source");
        }
      )
    },
    attributes: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    },
    specifiers: {
      default: [],
      validate: chain(
        assertValueType("array"),
        assertEach(
          (function () {
            const sourced = assertNodeType("ExportSpecifier", "ExportDefaultSpecifier", "ExportNamespaceSpecifier"),
              sourceless = assertNodeType("ExportSpecifier");
            if (!process.env.BABEL_TYPES_8_BREAKING) return sourced;
            return function (node, key, val) {
              (node.source ? sourced : sourceless)(node, key, val);
            };
          })()
        )
      )
    },
    source: { validate: assertNodeType("StringLiteral"), optional: true },
    exportKind: validateOptional(assertOneOf("type", "value"))
  }
});
defineType$4("ExportSpecifier", {
  visitor: ["local", "exported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: { validate: assertNodeType("Identifier") },
    exported: { validate: assertNodeType("Identifier", "StringLiteral") },
    exportKind: { validate: assertOneOf("type", "value"), optional: true }
  }
});
defineType$4("ForOfStatement", {
  visitor: ["left", "right", "body"],
  builder: ["left", "right", "body", "await"],
  aliases: ["Scopable", "Statement", "For", "BlockParent", "Loop", "ForXStatement"],
  fields: {
    left: {
      validate: (function () {
        if (!process.env.BABEL_TYPES_8_BREAKING) return assertNodeType("VariableDeclaration", "LVal");

        const declaration = assertNodeType("VariableDeclaration");
        const lval = assertNodeType(
          "Identifier",
          "MemberExpression",
          "ArrayPattern",
          "ObjectPattern",
          "TSAsExpression",
          "TSSatisfiesExpression",
          "TSTypeAssertion",
          "TSNonNullExpression"
        );
        return function (node, key, val) {
          is("VariableDeclaration", val) ? declaration(node, key, val) : lval(node, key, val);
        };
      })()
    },
    right: { validate: assertNodeType("Expression") },
    body: { validate: assertNodeType("Statement") },
    await: { default: false }
  }
});
defineType$4("ImportDeclaration", {
  builder: ["specifiers", "source"],
  visitor: ["specifiers", "source", "attributes", "assertions"],
  aliases: ["Statement", "Declaration", "ImportOrExportDeclaration"],
  fields: {
    attributes: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    },
    assertions: {
      optional: true,
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ImportAttribute")))
    },
    module: { optional: true, validate: assertValueType("boolean") },
    specifiers: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("ImportSpecifier", "ImportDefaultSpecifier", "ImportNamespaceSpecifier"))
      )
    },
    source: { validate: assertNodeType("StringLiteral") },
    importKind: { validate: assertOneOf("type", "typeof", "value"), optional: true }
  }
});
defineType$4("ImportDefaultSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: { local: { validate: assertNodeType("Identifier") } }
});
defineType$4("ImportNamespaceSpecifier", {
  visitor: ["local"],
  aliases: ["ModuleSpecifier"],
  fields: { local: { validate: assertNodeType("Identifier") } }
});
defineType$4("ImportSpecifier", {
  visitor: ["local", "imported"],
  aliases: ["ModuleSpecifier"],
  fields: {
    local: { validate: assertNodeType("Identifier") },
    imported: { validate: assertNodeType("Identifier", "StringLiteral") },
    importKind: { validate: assertOneOf("type", "typeof", "value"), optional: true }
  }
});
defineType$4("MetaProperty", {
  visitor: ["meta", "property"],
  aliases: ["Expression"],
  fields: {
    meta: {
      validate: chain(
        assertNodeType("Identifier"),
        Object.assign(
          function (node, key, val) {
            if (!process.env.BABEL_TYPES_8_BREAKING) return;
            let property;
            switch (val.name) {
              case "function":
                property = "sent";
                break;
              case "new":
                property = "target";
                break;
              case "import":
                property = "meta";
                break;
            }
            if (!is("Identifier", node.property, { name: property }))
              throw new TypeError("Unrecognised MetaProperty");
          },
          { oneOfNodeTypes: ["Identifier"] }
        )
      )
    },
    property: { validate: assertNodeType("Identifier") }
  }
});
const classMethodOrPropertyCommon = () => ({
  abstract: { validate: assertValueType("boolean"), optional: true },
  accessibility: { validate: assertOneOf("public", "private", "protected"), optional: true },
  static: { default: false },
  override: { default: false },
  computed: { default: false },
  optional: { validate: assertValueType("boolean"), optional: true },
  key: {
    validate: chain(
      (function () {
        const normal = assertNodeType("Identifier", "StringLiteral", "NumericLiteral"),
          computed = assertNodeType("Expression");
        return function (node, key, val) {
          (node.computed ? computed : normal)(node, key, val);
        };
      })(),
      assertNodeType("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression")
    )
  }
});
const classMethodOrDeclareMethodCommon = () =>
  Object.assign({}, functionCommon(), classMethodOrPropertyCommon(), {
    params: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Identifier", "Pattern", "RestElement", "TSParameterProperty"))
      )
    },
    kind: { validate: assertOneOf("get", "set", "method", "constructor"), default: "method" },
    access: {
      validate: chain(assertValueType("string"), assertOneOf("public", "private", "protected")),
      optional: true
    },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    }
  });
defineType$4("ClassMethod", {
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method"],
  builder: ["kind", "key", "params", "body", "computed", "static", "generator", "async"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    body: { validate: assertNodeType("BlockStatement") }
  })
});
defineType$4("ObjectPattern", {
  visitor: ["properties", "typeAnnotation", "decorators"],
  builder: ["properties"],
  aliases: ["Pattern", "PatternLike", "LVal"],
  fields: Object.assign({}, patternLikeCommon(), {
    properties: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("RestElement", "ObjectProperty")))
    }
  })
});
defineType$4("SpreadElement", {
  visitor: ["argument"],
  aliases: ["UnaryLike"],
  deprecatedAlias: "SpreadProperty",
  fields: { argument: { validate: assertNodeType("Expression") } }
});
defineType$4("Super", { aliases: ["Expression"] });
defineType$4("TaggedTemplateExpression", {
  visitor: ["tag", "quasi", "typeParameters"],
  builder: ["tag", "quasi"],
  aliases: ["Expression"],
  fields: {
    tag: { validate: assertNodeType("Expression") },
    quasi: { validate: assertNodeType("TemplateLiteral") },
    typeParameters: {
      validate: assertNodeType("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType$4("TemplateElement", {
  builder: ["value", "tail"],
  fields: {
    value: {
      validate: chain(
        assertShape({
          raw: { validate: assertValueType("string") },
          cooked: { validate: assertValueType("string"), optional: true }
        }),
        function (node) {
          const raw = node.value.raw;
          let unterminatedCalled = false;
          const error = () => {
            throw new Error("Internal @babel/types error.");
          };
          const { str, firstInvalidLoc } = common.readStringContents("template", raw, 0, 0, 0, {
            unterminated() {
              unterminatedCalled = true;
            },
            strictNumericEscape: error,
            invalidEscapeSequence: error,
            numericSeparatorInEscapeSequence: error,
            unexpectedNumericSeparator: error,
            invalidDigit: error,
            invalidCodePoint: error
          });
          if (!unterminatedCalled) throw new Error("Invalid raw");
          node.value.cooked = firstInvalidLoc ? null : str;
        }
      )
    },
    tail: { default: false }
  }
});
defineType$4("TemplateLiteral", {
  visitor: ["quasis", "expressions"],
  aliases: ["Expression", "Literal"],
  fields: {
    quasis: { validate: chain(assertValueType("array"), assertEach(assertNodeType("TemplateElement"))) },
    expressions: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Expression", "TSType")),
        function (node, key, val) {
          if (node.quasis.length !== val.length + 1)
            throw new TypeError(
              `Number of ${node.type} quasis should be exactly one more than the number of expressions.\nExpected ${
                val.length + 1
              } quasis but got ${node.quasis.length}`
            );
        }
      )
    }
  }
});
defineType$4("YieldExpression", {
  builder: ["argument", "delegate"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: {
    delegate: {
      validate: chain(
        assertValueType("boolean"),
        Object.assign(
          function (node, key, val) {
            if (process.env.BABEL_TYPES_8_BREAKING && val && !node.argument)
              throw new TypeError("Property delegate of YieldExpression cannot be true if there is no argument");
          },
          { type: "boolean" }
        )
      ),
      default: false
    },
    argument: { optional: true, validate: assertNodeType("Expression") }
  }
});
defineType$4("AwaitExpression", {
  builder: ["argument"],
  visitor: ["argument"],
  aliases: ["Expression", "Terminatorless"],
  fields: { argument: { validate: assertNodeType("Expression") } }
});
defineType$4("Import", { aliases: ["Expression"] });
defineType$4("BigIntLiteral", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType$4("ExportNamespaceSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: { exported: { validate: assertNodeType("Identifier") } }
});
defineType$4("OptionalMemberExpression", {
  builder: ["object", "property", "computed", "optional"],
  visitor: ["object", "property"],
  aliases: ["Expression"],
  fields: {
    object: { validate: assertNodeType("Expression") },
    property: {
      validate: (function () {
        const normal = assertNodeType("Identifier"),
          computed = assertNodeType("Expression");
        return Object.assign(
          function (node, key, val) {
            (node.computed ? computed : normal)(node, key, val);
          },
          { oneOfNodeTypes: ["Expression", "Identifier"] }
        );
      })()
    },
    computed: { default: false },
    optional: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? chain(assertValueType("boolean"), assertOptionalChainStart())
        : assertValueType("boolean")
    }
  }
});
defineType$4("OptionalCallExpression", {
  visitor: ["callee", "arguments", "typeParameters", "typeArguments"],
  builder: ["callee", "arguments", "optional"],
  aliases: ["Expression"],
  fields: {
    callee: { validate: assertNodeType("Expression") },
    arguments: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("Expression", "SpreadElement", "JSXNamespacedName", "ArgumentPlaceholder"))
      )
    },
    optional: {
      validate: process.env.BABEL_TYPES_8_BREAKING
        ? chain(assertValueType("boolean"), assertOptionalChainStart())
        : assertValueType("boolean")
    },
    typeArguments: { validate: assertNodeType("TypeParameterInstantiation"), optional: true },
    typeParameters: { validate: assertNodeType("TSTypeParameterInstantiation"), optional: true }
  }
});
defineType$4("ClassProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    value: { validate: assertNodeType("Expression"), optional: true },
    definite: { validate: assertValueType("boolean"), optional: true },
    typeAnnotation: { validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation", "Noop"), optional: true },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    readonly: { validate: assertValueType("boolean"), optional: true },
    declare: { validate: assertValueType("boolean"), optional: true },
    variance: { validate: assertNodeType("Variance"), optional: true }
  })
});
defineType$4("ClassAccessorProperty", {
  visitor: ["key", "value", "typeAnnotation", "decorators"],
  builder: ["key", "value", "typeAnnotation", "decorators", "computed", "static"],
  aliases: ["Property", "Accessor"],
  fields: Object.assign({}, classMethodOrPropertyCommon(), {
    key: {
      validate: chain(
        (function () {
          const normal = assertNodeType(
            "Identifier",
            "StringLiteral",
            "NumericLiteral",
            "BigIntLiteral",
            "PrivateName"
          );
          const computed = assertNodeType("Expression");
          return function (node, key, val) {
            (node.computed ? computed : normal)(node, key, val);
          };
        })(),
        assertNodeType("Identifier", "StringLiteral", "NumericLiteral", "BigIntLiteral", "Expression", "PrivateName")
      )
    },
    value: { validate: assertNodeType("Expression"), optional: true },
    definite: { validate: assertValueType("boolean"), optional: true },
    typeAnnotation: { validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation", "Noop"), optional: true },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    readonly: { validate: assertValueType("boolean"), optional: true },
    declare: { validate: assertValueType("boolean"), optional: true },
    variance: { validate: assertNodeType("Variance"), optional: true }
  })
});
defineType$4("ClassPrivateProperty", {
  visitor: ["key", "value", "decorators", "typeAnnotation"],
  builder: ["key", "value", "decorators", "static"],
  aliases: ["Property", "Private"],
  fields: {
    key: { validate: assertNodeType("PrivateName") },
    value: { validate: assertNodeType("Expression"), optional: true },
    typeAnnotation: { validate: assertNodeType("TypeAnnotation", "TSTypeAnnotation", "Noop"), optional: true },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    },
    static: { validate: assertValueType("boolean"), default: false },
    readonly: { validate: assertValueType("boolean"), optional: true },
    definite: { validate: assertValueType("boolean"), optional: true },
    variance: { validate: assertNodeType("Variance"), optional: true }
  }
});
defineType$4("ClassPrivateMethod", {
  builder: ["kind", "key", "params", "body", "static"],
  visitor: ["key", "params", "body", "decorators", "returnType", "typeParameters"],
  aliases: ["Function", "Scopable", "BlockParent", "FunctionParent", "Method", "Private"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), functionTypeAnnotationCommon(), {
    kind: { validate: assertOneOf("get", "set", "method"), default: "method" },
    key: { validate: assertNodeType("PrivateName") },
    body: { validate: assertNodeType("BlockStatement") }
  })
});
defineType$4("PrivateName", {
  visitor: ["id"],
  aliases: ["Private"],
  fields: { id: { validate: assertNodeType("Identifier") } }
});
defineType$4("StaticBlock", {
  visitor: ["body"],
  fields: { body: { validate: chain(assertValueType("array"), assertEach(assertNodeType("Statement"))) } },
  aliases: ["Scopable", "BlockParent", "FunctionParent"]
});

const defineType$3 = defineAliasedType("Flow");
const defineInterfaceishType = name => {
  const isDeclareClass = name === "DeclareClass";
  defineType$3(name, {
    builder: ["id", "typeParameters", "extends", "body"],
    visitor: ["id", "typeParameters", "extends", ...(isDeclareClass ? ["mixins", "implements"] : []), "body"],
    aliases: ["FlowDeclaration", "Statement", "Declaration"],
    fields: Object.assign(
      {
        id: validateType("Identifier"),
        typeParameters: validateOptionalType("TypeParameterDeclaration"),
        extends: validateOptional(arrayOfType("InterfaceExtends"))
      },
      isDeclareClass
        ? {
            mixins: validateOptional(arrayOfType("InterfaceExtends")),
            implements: validateOptional(arrayOfType("ClassImplements"))
          }
        : {},
      { body: validateType("ObjectTypeAnnotation") }
    )
  });
};
defineType$3("AnyTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("ArrayTypeAnnotation", {
  visitor: ["elementType"],
  aliases: ["FlowType"],
  fields: { elementType: validateType("FlowType") }
});
defineType$3("BooleanTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("BooleanLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: { value: validate$1(assertValueType("boolean")) }
});
defineType$3("NullLiteralTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("ClassImplements", {
  visitor: ["id", "typeParameters"],
  fields: { id: validateType("Identifier"), typeParameters: validateOptionalType("TypeParameterInstantiation") }
});
defineInterfaceishType("DeclareClass");
defineType$3("DeclareFunction", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: { id: validateType("Identifier"), predicate: validateOptionalType("DeclaredPredicate") }
});
defineInterfaceishType("DeclareInterface");
defineType$3("DeclareModule", {
  builder: ["id", "body", "kind"],
  visitor: ["id", "body"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType(["Identifier", "StringLiteral"]),
    body: validateType("BlockStatement"),
    kind: validateOptional(assertOneOf("CommonJS", "ES"))
  }
});
defineType$3("DeclareModuleExports", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: { typeAnnotation: validateType("TypeAnnotation") }
});
defineType$3("DeclareTypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    right: validateType("FlowType")
  }
});
defineType$3("DeclareOpaqueType", {
  visitor: ["id", "typeParameters", "supertype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    supertype: validateOptionalType("FlowType"),
    impltype: validateOptionalType("FlowType")
  }
});
defineType$3("DeclareVariable", {
  visitor: ["id"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: { id: validateType("Identifier") }
});
defineType$3("DeclareExportDeclaration", {
  visitor: ["declaration", "specifiers", "source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    declaration: validateOptionalType("Flow"),
    specifiers: validateOptional(arrayOfType(["ExportSpecifier", "ExportNamespaceSpecifier"])),
    source: validateOptionalType("StringLiteral"),
    default: validateOptional(assertValueType("boolean"))
  }
});
defineType$3("DeclareExportAllDeclaration", {
  visitor: ["source"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: { source: validateType("StringLiteral"), exportKind: validateOptional(assertOneOf("type", "value")) }
});
defineType$3("DeclaredPredicate", {
  visitor: ["value"],
  aliases: ["FlowPredicate"],
  fields: { value: validateType("Flow") }
});
defineType$3("ExistsTypeAnnotation", { aliases: ["FlowType"] });
defineType$3("FunctionTypeAnnotation", {
  visitor: ["typeParameters", "params", "rest", "returnType"],
  aliases: ["FlowType"],
  fields: {
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    params: validate$1(arrayOfType("FunctionTypeParam")),
    rest: validateOptionalType("FunctionTypeParam"),
    this: validateOptionalType("FunctionTypeParam"),
    returnType: validateType("FlowType")
  }
});
defineType$3("FunctionTypeParam", {
  visitor: ["name", "typeAnnotation"],
  fields: {
    name: validateOptionalType("Identifier"),
    typeAnnotation: validateType("FlowType"),
    optional: validateOptional(assertValueType("boolean"))
  }
});
defineType$3("GenericTypeAnnotation", {
  visitor: ["id", "typeParameters"],
  aliases: ["FlowType"],
  fields: {
    id: validateType(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: validateOptionalType("TypeParameterInstantiation")
  }
});
defineType$3("InferredPredicate", { aliases: ["FlowPredicate"] });
defineType$3("InterfaceExtends", {
  visitor: ["id", "typeParameters"],
  fields: {
    id: validateType(["Identifier", "QualifiedTypeIdentifier"]),
    typeParameters: validateOptionalType("TypeParameterInstantiation")
  }
});
defineInterfaceishType("InterfaceDeclaration");
defineType$3("InterfaceTypeAnnotation", {
  visitor: ["extends", "body"],
  aliases: ["FlowType"],
  fields: { extends: validateOptional(arrayOfType("InterfaceExtends")), body: validateType("ObjectTypeAnnotation") }
});
defineType$3("IntersectionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: { types: validate$1(arrayOfType("FlowType")) }
});
defineType$3("MixedTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("EmptyTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("NullableTypeAnnotation", {
  visitor: ["typeAnnotation"],
  aliases: ["FlowType"],
  fields: { typeAnnotation: validateType("FlowType") }
});
defineType$3("NumberLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: { value: validate$1(assertValueType("number")) }
});
defineType$3("NumberTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("ObjectTypeAnnotation", {
  visitor: ["properties", "indexers", "callProperties", "internalSlots"],
  aliases: ["FlowType"],
  builder: ["properties", "indexers", "callProperties", "internalSlots", "exact"],
  fields: {
    properties: validate$1(arrayOfType(["ObjectTypeProperty", "ObjectTypeSpreadProperty"])),
    indexers: { validate: arrayOfType("ObjectTypeIndexer"), optional: true, default: [] },
    callProperties: { validate: arrayOfType("ObjectTypeCallProperty"), optional: true, default: [] },
    internalSlots: { validate: arrayOfType("ObjectTypeInternalSlot"), optional: true, default: [] },
    exact: { validate: assertValueType("boolean"), default: false },
    inexact: validateOptional(assertValueType("boolean"))
  }
});
defineType$3("ObjectTypeInternalSlot", {
  visitor: ["id", "value", "optional", "static", "method"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: validateType("Identifier"),
    value: validateType("FlowType"),
    optional: validate$1(assertValueType("boolean")),
    static: validate$1(assertValueType("boolean")),
    method: validate$1(assertValueType("boolean"))
  }
});
defineType$3("ObjectTypeCallProperty", {
  visitor: ["value"],
  aliases: ["UserWhitespacable"],
  fields: { value: validateType("FlowType"), static: validate$1(assertValueType("boolean")) }
});
defineType$3("ObjectTypeIndexer", {
  visitor: ["id", "key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    id: validateOptionalType("Identifier"),
    key: validateType("FlowType"),
    value: validateType("FlowType"),
    static: validate$1(assertValueType("boolean")),
    variance: validateOptionalType("Variance")
  }
});
defineType$3("ObjectTypeProperty", {
  visitor: ["key", "value", "variance"],
  aliases: ["UserWhitespacable"],
  fields: {
    key: validateType(["Identifier", "StringLiteral"]),
    value: validateType("FlowType"),
    kind: validate$1(assertOneOf("init", "get", "set")),
    static: validate$1(assertValueType("boolean")),
    proto: validate$1(assertValueType("boolean")),
    optional: validate$1(assertValueType("boolean")),
    variance: validateOptionalType("Variance"),
    method: validate$1(assertValueType("boolean"))
  }
});
defineType$3("ObjectTypeSpreadProperty", {
  visitor: ["argument"],
  aliases: ["UserWhitespacable"],
  fields: { argument: validateType("FlowType") }
});
defineType$3("OpaqueType", {
  visitor: ["id", "typeParameters", "supertype", "impltype"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    supertype: validateOptionalType("FlowType"),
    impltype: validateType("FlowType")
  }
});
defineType$3("QualifiedTypeIdentifier", {
  visitor: ["id", "qualification"],
  fields: { id: validateType("Identifier"), qualification: validateType(["Identifier", "QualifiedTypeIdentifier"]) }
});
defineType$3("StringLiteralTypeAnnotation", {
  builder: ["value"],
  aliases: ["FlowType"],
  fields: { value: validate$1(assertValueType("string")) }
});
defineType$3("StringTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("SymbolTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("ThisTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("TupleTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: { types: validate$1(arrayOfType("FlowType")) }
});
defineType$3("TypeofTypeAnnotation", {
  visitor: ["argument"],
  aliases: ["FlowType"],
  fields: { argument: validateType("FlowType") }
});
defineType$3("TypeAlias", {
  visitor: ["id", "typeParameters", "right"],
  aliases: ["FlowDeclaration", "Statement", "Declaration"],
  fields: {
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TypeParameterDeclaration"),
    right: validateType("FlowType")
  }
});
defineType$3("TypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: { typeAnnotation: validateType("FlowType") }
});
defineType$3("TypeCastExpression", {
  visitor: ["expression", "typeAnnotation"],
  aliases: ["ExpressionWrapper", "Expression"],
  fields: { expression: validateType("Expression"), typeAnnotation: validateType("TypeAnnotation") }
});
defineType$3("TypeParameter", {
  visitor: ["bound", "default", "variance"],
  fields: {
    name: validate$1(assertValueType("string")),
    bound: validateOptionalType("TypeAnnotation"),
    default: validateOptionalType("FlowType"),
    variance: validateOptionalType("Variance")
  }
});
defineType$3("TypeParameterDeclaration", {
  visitor: ["params"],
  fields: { params: validate$1(arrayOfType("TypeParameter")) }
});
defineType$3("TypeParameterInstantiation", {
  visitor: ["params"],
  fields: { params: validate$1(arrayOfType("FlowType")) }
});
defineType$3("UnionTypeAnnotation", {
  visitor: ["types"],
  aliases: ["FlowType"],
  fields: { types: validate$1(arrayOfType("FlowType")) }
});
defineType$3("Variance", { builder: ["kind"], fields: { kind: validate$1(assertOneOf("minus", "plus")) } });
defineType$3("VoidTypeAnnotation", { aliases: ["FlowType", "FlowBaseAnnotation"] });
defineType$3("EnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    id: validateType("Identifier"),
    body: validateType(["EnumBooleanBody", "EnumNumberBody", "EnumStringBody", "EnumSymbolBody"])
  }
});
defineType$3("EnumBooleanBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate$1(assertValueType("boolean")),
    members: validateArrayOfType("EnumBooleanMember"),
    hasUnknownMembers: validate$1(assertValueType("boolean"))
  }
});
defineType$3("EnumNumberBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate$1(assertValueType("boolean")),
    members: validateArrayOfType("EnumNumberMember"),
    hasUnknownMembers: validate$1(assertValueType("boolean"))
  }
});
defineType$3("EnumStringBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    explicitType: validate$1(assertValueType("boolean")),
    members: validateArrayOfType(["EnumStringMember", "EnumDefaultedMember"]),
    hasUnknownMembers: validate$1(assertValueType("boolean"))
  }
});
defineType$3("EnumSymbolBody", {
  aliases: ["EnumBody"],
  visitor: ["members"],
  fields: {
    members: validateArrayOfType("EnumDefaultedMember"),
    hasUnknownMembers: validate$1(assertValueType("boolean"))
  }
});
defineType$3("EnumBooleanMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: { id: validateType("Identifier"), init: validateType("BooleanLiteral") }
});
defineType$3("EnumNumberMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: { id: validateType("Identifier"), init: validateType("NumericLiteral") }
});
defineType$3("EnumStringMember", {
  aliases: ["EnumMember"],
  visitor: ["id", "init"],
  fields: { id: validateType("Identifier"), init: validateType("StringLiteral") }
});
defineType$3("EnumDefaultedMember", {
  aliases: ["EnumMember"],
  visitor: ["id"],
  fields: { id: validateType("Identifier") }
});
defineType$3("IndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: { objectType: validateType("FlowType"), indexType: validateType("FlowType") }
});
defineType$3("OptionalIndexedAccessType", {
  visitor: ["objectType", "indexType"],
  aliases: ["FlowType"],
  fields: {
    objectType: validateType("FlowType"),
    indexType: validateType("FlowType"),
    optional: validate$1(assertValueType("boolean"))
  }
});

const defineType$2 = defineAliasedType("JSX");
defineType$2("JSXAttribute", {
  visitor: ["name", "value"],
  aliases: ["Immutable"],
  fields: {
    name: { validate: assertNodeType("JSXIdentifier", "JSXNamespacedName") },
    value: {
      optional: true,
      validate: assertNodeType("JSXElement", "JSXFragment", "StringLiteral", "JSXExpressionContainer")
    }
  }
});
defineType$2("JSXClosingElement", {
  visitor: ["name"],
  aliases: ["Immutable"],
  fields: { name: { validate: assertNodeType("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName") } }
});
defineType$2("JSXElement", {
  builder: ["openingElement", "closingElement", "children", "selfClosing"],
  visitor: ["openingElement", "children", "closingElement"],
  aliases: ["Immutable", "Expression"],
  fields: Object.assign(
    {
      openingElement: { validate: assertNodeType("JSXOpeningElement") },
      closingElement: { optional: true, validate: assertNodeType("JSXClosingElement") },
      children: {
        validate: chain(
          assertValueType("array"),
          assertEach(assertNodeType("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment"))
        )
      }
    },
    { selfClosing: { validate: assertValueType("boolean"), optional: true } }
  )
});
defineType$2("JSXEmptyExpression", {});
defineType$2("JSXExpressionContainer", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: { expression: { validate: assertNodeType("Expression", "JSXEmptyExpression") } }
});
defineType$2("JSXSpreadChild", {
  visitor: ["expression"],
  aliases: ["Immutable"],
  fields: { expression: { validate: assertNodeType("Expression") } }
});
defineType$2("JSXIdentifier", { builder: ["name"], fields: { name: { validate: assertValueType("string") } } });
defineType$2("JSXMemberExpression", {
  visitor: ["object", "property"],
  fields: {
    object: { validate: assertNodeType("JSXMemberExpression", "JSXIdentifier") },
    property: { validate: assertNodeType("JSXIdentifier") }
  }
});
defineType$2("JSXNamespacedName", {
  visitor: ["namespace", "name"],
  fields: {
    namespace: { validate: assertNodeType("JSXIdentifier") },
    name: { validate: assertNodeType("JSXIdentifier") }
  }
});
defineType$2("JSXOpeningElement", {
  builder: ["name", "attributes", "selfClosing"],
  visitor: ["name", "attributes"],
  aliases: ["Immutable"],
  fields: {
    name: { validate: assertNodeType("JSXIdentifier", "JSXMemberExpression", "JSXNamespacedName") },
    selfClosing: { default: false },
    attributes: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("JSXAttribute", "JSXSpreadAttribute")))
    },
    typeParameters: {
      validate: assertNodeType("TypeParameterInstantiation", "TSTypeParameterInstantiation"),
      optional: true
    }
  }
});
defineType$2("JSXSpreadAttribute", {
  visitor: ["argument"],
  fields: { argument: { validate: assertNodeType("Expression") } }
});
defineType$2("JSXText", {
  aliases: ["Immutable"],
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } }
});
defineType$2("JSXFragment", {
  builder: ["openingFragment", "closingFragment", "children"],
  visitor: ["openingFragment", "children", "closingFragment"],
  aliases: ["Immutable", "Expression"],
  fields: {
    openingFragment: { validate: assertNodeType("JSXOpeningFragment") },
    closingFragment: { validate: assertNodeType("JSXClosingFragment") },
    children: {
      validate: chain(
        assertValueType("array"),
        assertEach(assertNodeType("JSXText", "JSXExpressionContainer", "JSXSpreadChild", "JSXElement", "JSXFragment"))
      )
    }
  }
});
defineType$2("JSXOpeningFragment", { aliases: ["Immutable"] });
defineType$2("JSXClosingFragment", { aliases: ["Immutable"] });

const PLACEHOLDERS = [
  "Identifier",
  "StringLiteral",
  "Expression",
  "Statement",
  "Declaration",
  "BlockStatement",
  "ClassBody",
  "Pattern"
];
const PLACEHOLDERS_ALIAS = { Declaration: ["Statement"], Pattern: ["PatternLike", "LVal"] };
for (const type of PLACEHOLDERS) {
  const alias = ALIAS_KEYS[type];
  if (alias != null && alias.length) PLACEHOLDERS_ALIAS[type] = alias;
}
const PLACEHOLDERS_FLIPPED_ALIAS = {};
Object.keys(PLACEHOLDERS_ALIAS).forEach(type => {
  PLACEHOLDERS_ALIAS[type].forEach(alias => {
    Object.hasOwnProperty.call(PLACEHOLDERS_FLIPPED_ALIAS, alias) || (PLACEHOLDERS_FLIPPED_ALIAS[alias] = []);

    PLACEHOLDERS_FLIPPED_ALIAS[alias].push(type);
  });
});

const defineType$1 = defineAliasedType("Miscellaneous");
defineType$1("Noop", { visitor: [] });

defineType$1("Placeholder", {
  visitor: [],
  builder: ["expectedNode", "name"],
  fields: {
    name: { validate: assertNodeType("Identifier") },
    expectedNode: { validate: assertOneOf(...PLACEHOLDERS) }
  }
});
defineType$1("V8IntrinsicIdentifier", {
  builder: ["name"],
  fields: { name: { validate: assertValueType("string") } }
});

defineType$5("ArgumentPlaceholder", {});
defineType$5("BindExpression", {
  visitor: ["object", "callee"],
  aliases: ["Expression"],
  fields: process.env.BABEL_TYPES_8_BREAKING
    ? { object: { validate: assertNodeType("Expression") }, callee: { validate: assertNodeType("Expression") } }
    : {
        object: { validate: Object.assign(() => {}, { oneOfNodeTypes: ["Expression"] }) },
        callee: { validate: Object.assign(() => {}, { oneOfNodeTypes: ["Expression"] }) }
      }
});
defineType$5("ImportAttribute", {
  visitor: ["key", "value"],
  fields: {
    key: { validate: assertNodeType("Identifier", "StringLiteral") },
    value: { validate: assertNodeType("StringLiteral") }
  }
});
defineType$5("Decorator", {
  visitor: ["expression"],
  fields: { expression: { validate: assertNodeType("Expression") } }
});
defineType$5("DoExpression", {
  visitor: ["body"],
  builder: ["body", "async"],
  aliases: ["Expression"],
  fields: {
    body: { validate: assertNodeType("BlockStatement") },
    async: { validate: assertValueType("boolean"), default: false }
  }
});
defineType$5("ExportDefaultSpecifier", {
  visitor: ["exported"],
  aliases: ["ModuleSpecifier"],
  fields: { exported: { validate: assertNodeType("Identifier") } }
});
defineType$5("RecordExpression", {
  visitor: ["properties"],
  aliases: ["Expression"],
  fields: {
    properties: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("ObjectProperty", "SpreadElement")))
    }
  }
});
defineType$5("TupleExpression", {
  fields: {
    elements: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Expression", "SpreadElement"))),
      default: []
    }
  },
  visitor: ["elements"],
  aliases: ["Expression"]
});
defineType$5("DecimalLiteral", {
  builder: ["value"],
  fields: { value: { validate: assertValueType("string") } },
  aliases: ["Expression", "Pureish", "Literal", "Immutable"]
});
defineType$5("ModuleExpression", {
  visitor: ["body"],
  fields: { body: { validate: assertNodeType("Program") } },
  aliases: ["Expression"]
});
defineType$5("TopicReference", { aliases: ["Expression"] });
defineType$5("PipelineTopicExpression", {
  builder: ["expression"],
  visitor: ["expression"],
  fields: { expression: { validate: assertNodeType("Expression") } },
  aliases: ["Expression"]
});
defineType$5("PipelineBareFunction", {
  builder: ["callee"],
  visitor: ["callee"],
  fields: { callee: { validate: assertNodeType("Expression") } },
  aliases: ["Expression"]
});
defineType$5("PipelinePrimaryTopicReference", { aliases: ["Expression"] });

const defineType = defineAliasedType("TypeScript"),
  bool = assertValueType("boolean");
const tSFunctionTypeAnnotationCommon = () => ({
  returnType: { validate: assertNodeType("TSTypeAnnotation", "Noop"), optional: true },
  typeParameters: { validate: assertNodeType("TSTypeParameterDeclaration", "Noop"), optional: true }
});
defineType("TSParameterProperty", {
  aliases: ["LVal"],
  visitor: ["parameter"],
  fields: {
    accessibility: { validate: assertOneOf("public", "private", "protected"), optional: true },
    readonly: { validate: assertValueType("boolean"), optional: true },
    parameter: { validate: assertNodeType("Identifier", "AssignmentPattern") },
    override: { validate: assertValueType("boolean"), optional: true },
    decorators: {
      validate: chain(assertValueType("array"), assertEach(assertNodeType("Decorator"))),
      optional: true
    }
  }
});
defineType("TSDeclareFunction", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, functionDeclarationCommon(), tSFunctionTypeAnnotationCommon())
});
defineType("TSDeclareMethod", {
  visitor: ["decorators", "key", "typeParameters", "params", "returnType"],
  fields: Object.assign({}, classMethodOrDeclareMethodCommon(), tSFunctionTypeAnnotationCommon())
});
defineType("TSQualifiedName", {
  aliases: ["TSEntityName"],
  visitor: ["left", "right"],
  fields: { left: validateType("TSEntityName"), right: validateType("Identifier") }
});
const signatureDeclarationCommon = () => ({
  typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
  parameters: validateArrayOfType(["ArrayPattern", "Identifier", "ObjectPattern", "RestElement"]),
  typeAnnotation: validateOptionalType("TSTypeAnnotation")
});
const callConstructSignatureDeclaration = {
  aliases: ["TSTypeElement"],
  visitor: ["typeParameters", "parameters", "typeAnnotation"],
  fields: signatureDeclarationCommon()
};
defineType("TSCallSignatureDeclaration", callConstructSignatureDeclaration);
defineType("TSConstructSignatureDeclaration", callConstructSignatureDeclaration);
const namedTypeElementCommon = () => ({
  key: validateType("Expression"),
  computed: { default: false },
  optional: validateOptional(bool)
});
defineType("TSPropertySignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeAnnotation", "initializer"],
  fields: Object.assign({}, namedTypeElementCommon(), {
    readonly: validateOptional(bool),
    typeAnnotation: validateOptionalType("TSTypeAnnotation"),
    initializer: validateOptionalType("Expression"),
    kind: { validate: assertOneOf("get", "set") }
  })
});
defineType("TSMethodSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["key", "typeParameters", "parameters", "typeAnnotation"],
  fields: Object.assign({}, signatureDeclarationCommon(), namedTypeElementCommon(), {
    kind: { validate: assertOneOf("method", "get", "set") }
  })
});
defineType("TSIndexSignature", {
  aliases: ["TSTypeElement"],
  visitor: ["parameters", "typeAnnotation"],
  fields: {
    readonly: validateOptional(bool),
    static: validateOptional(bool),
    parameters: validateArrayOfType("Identifier"),
    typeAnnotation: validateOptionalType("TSTypeAnnotation")
  }
});
const tsKeywordTypes = [
  "TSAnyKeyword",
  "TSBooleanKeyword",
  "TSBigIntKeyword",
  "TSIntrinsicKeyword",
  "TSNeverKeyword",
  "TSNullKeyword",
  "TSNumberKeyword",
  "TSObjectKeyword",
  "TSStringKeyword",
  "TSSymbolKeyword",
  "TSUndefinedKeyword",
  "TSUnknownKeyword",
  "TSVoidKeyword"
];
for (const type of tsKeywordTypes) defineType(type, { aliases: ["TSType", "TSBaseType"], visitor: [], fields: {} });

defineType("TSThisType", { aliases: ["TSType", "TSBaseType"], visitor: [], fields: {} });
const fnOrCtrBase = { aliases: ["TSType"], visitor: ["typeParameters", "parameters", "typeAnnotation"] };
defineType("TSFunctionType", Object.assign({}, fnOrCtrBase, { fields: signatureDeclarationCommon() }));
defineType(
  "TSConstructorType",
  Object.assign({}, fnOrCtrBase, {
    fields: Object.assign({}, signatureDeclarationCommon(), { abstract: validateOptional(bool) })
  })
);
defineType("TSTypeReference", {
  aliases: ["TSType"],
  visitor: ["typeName", "typeParameters"],
  fields: {
    typeName: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation")
  }
});
defineType("TSTypePredicate", {
  aliases: ["TSType"],
  visitor: ["parameterName", "typeAnnotation"],
  builder: ["parameterName", "typeAnnotation", "asserts"],
  fields: {
    parameterName: validateType(["Identifier", "TSThisType"]),
    typeAnnotation: validateOptionalType("TSTypeAnnotation"),
    asserts: validateOptional(bool)
  }
});
defineType("TSTypeQuery", {
  aliases: ["TSType"],
  visitor: ["exprName", "typeParameters"],
  fields: {
    exprName: validateType(["TSEntityName", "TSImportType"]),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation")
  }
});
defineType("TSTypeLiteral", {
  aliases: ["TSType"],
  visitor: ["members"],
  fields: { members: validateArrayOfType("TSTypeElement") }
});
defineType("TSArrayType", {
  aliases: ["TSType"],
  visitor: ["elementType"],
  fields: { elementType: validateType("TSType") }
});
defineType("TSTupleType", {
  aliases: ["TSType"],
  visitor: ["elementTypes"],
  fields: { elementTypes: validateArrayOfType(["TSType", "TSNamedTupleMember"]) }
});
defineType("TSOptionalType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: { typeAnnotation: validateType("TSType") }
});
defineType("TSRestType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: { typeAnnotation: validateType("TSType") }
});
defineType("TSNamedTupleMember", {
  visitor: ["label", "elementType"],
  builder: ["label", "elementType", "optional"],
  fields: {
    label: validateType("Identifier"),
    optional: { validate: bool, default: false },
    elementType: validateType("TSType")
  }
});
const unionOrIntersection = {
  aliases: ["TSType"],
  visitor: ["types"],
  fields: { types: validateArrayOfType("TSType") }
};
defineType("TSUnionType", unionOrIntersection);
defineType("TSIntersectionType", unionOrIntersection);
defineType("TSConditionalType", {
  aliases: ["TSType"],
  visitor: ["checkType", "extendsType", "trueType", "falseType"],
  fields: {
    checkType: validateType("TSType"),
    extendsType: validateType("TSType"),
    trueType: validateType("TSType"),
    falseType: validateType("TSType")
  }
});
defineType("TSInferType", {
  aliases: ["TSType"],
  visitor: ["typeParameter"],
  fields: { typeParameter: validateType("TSTypeParameter") }
});
defineType("TSParenthesizedType", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: { typeAnnotation: validateType("TSType") }
});
defineType("TSTypeOperator", {
  aliases: ["TSType"],
  visitor: ["typeAnnotation"],
  fields: { operator: validate$1(assertValueType("string")), typeAnnotation: validateType("TSType") }
});
defineType("TSIndexedAccessType", {
  aliases: ["TSType"],
  visitor: ["objectType", "indexType"],
  fields: { objectType: validateType("TSType"), indexType: validateType("TSType") }
});
defineType("TSMappedType", {
  aliases: ["TSType"],
  visitor: ["typeParameter", "typeAnnotation", "nameType"],
  fields: {
    readonly: validateOptional(assertOneOf(true, false, "+", "-")),
    typeParameter: validateType("TSTypeParameter"),
    optional: validateOptional(assertOneOf(true, false, "+", "-")),
    typeAnnotation: validateOptionalType("TSType"),
    nameType: validateOptionalType("TSType")
  }
});
defineType("TSLiteralType", {
  aliases: ["TSType", "TSBaseType"],
  visitor: ["literal"],
  fields: {
    literal: {
      validate: (function () {
        const unaryExpression = assertNodeType("NumericLiteral", "BigIntLiteral"),
          unaryOperator = assertOneOf("-");
        const literal = assertNodeType(
          "NumericLiteral",
          "StringLiteral",
          "BooleanLiteral",
          "BigIntLiteral",
          "TemplateLiteral"
        );
        function validator(parent, key, node) {
          if (is("UnaryExpression", node)) {
            unaryOperator(node, "operator", node.operator);
            unaryExpression(node, "argument", node.argument);
          } else literal(parent, key, node);
        }
        validator.oneOfNodeTypes = [
          "NumericLiteral",
          "StringLiteral",
          "BooleanLiteral",
          "BigIntLiteral",
          "TemplateLiteral",
          "UnaryExpression"
        ];
        return validator;
      })()
    }
  }
});
defineType("TSExpressionWithTypeArguments", {
  aliases: ["TSType"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: validateType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation")
  }
});
defineType("TSInterfaceDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "extends", "body"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
    extends: validateOptional(arrayOfType("TSExpressionWithTypeArguments")),
    body: validateType("TSInterfaceBody")
  }
});
defineType("TSInterfaceBody", { visitor: ["body"], fields: { body: validateArrayOfType("TSTypeElement") } });
defineType("TSTypeAliasDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "typeParameters", "typeAnnotation"],
  fields: {
    declare: validateOptional(bool),
    id: validateType("Identifier"),
    typeParameters: validateOptionalType("TSTypeParameterDeclaration"),
    typeAnnotation: validateType("TSType")
  }
});
defineType("TSInstantiationExpression", {
  aliases: ["Expression"],
  visitor: ["expression", "typeParameters"],
  fields: {
    expression: validateType("Expression"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation")
  }
});
const TSTypeExpression = {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression", "typeAnnotation"],
  fields: { expression: validateType("Expression"), typeAnnotation: validateType("TSType") }
};
defineType("TSAsExpression", TSTypeExpression);
defineType("TSSatisfiesExpression", TSTypeExpression);
defineType("TSTypeAssertion", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["typeAnnotation", "expression"],
  fields: { typeAnnotation: validateType("TSType"), expression: validateType("Expression") }
});
defineType("TSEnumDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "members"],
  fields: {
    declare: validateOptional(bool),
    const: validateOptional(bool),
    id: validateType("Identifier"),
    members: validateArrayOfType("TSEnumMember"),
    initializer: validateOptionalType("Expression")
  }
});
defineType("TSEnumMember", {
  visitor: ["id", "initializer"],
  fields: { id: validateType(["Identifier", "StringLiteral"]), initializer: validateOptionalType("Expression") }
});
defineType("TSModuleDeclaration", {
  aliases: ["Statement", "Declaration"],
  visitor: ["id", "body"],
  fields: {
    declare: validateOptional(bool),
    global: validateOptional(bool),
    id: validateType(["Identifier", "StringLiteral"]),
    body: validateType(["TSModuleBlock", "TSModuleDeclaration"])
  }
});
defineType("TSModuleBlock", {
  aliases: ["Scopable", "Block", "BlockParent", "FunctionParent"],
  visitor: ["body"],
  fields: { body: validateArrayOfType("Statement") }
});
defineType("TSImportType", {
  aliases: ["TSType"],
  visitor: ["argument", "qualifier", "typeParameters"],
  fields: {
    argument: validateType("StringLiteral"),
    qualifier: validateOptionalType("TSEntityName"),
    typeParameters: validateOptionalType("TSTypeParameterInstantiation")
  }
});
defineType("TSImportEqualsDeclaration", {
  aliases: ["Statement"],
  visitor: ["id", "moduleReference"],
  fields: {
    isExport: validate$1(bool),
    id: validateType("Identifier"),
    moduleReference: validateType(["TSEntityName", "TSExternalModuleReference"]),
    importKind: { validate: assertOneOf("type", "value"), optional: true }
  }
});
defineType("TSExternalModuleReference", {
  visitor: ["expression"],
  fields: { expression: validateType("StringLiteral") }
});
defineType("TSNonNullExpression", {
  aliases: ["Expression", "LVal", "PatternLike"],
  visitor: ["expression"],
  fields: { expression: validateType("Expression") }
});
defineType("TSExportAssignment", {
  aliases: ["Statement"],
  visitor: ["expression"],
  fields: { expression: validateType("Expression") }
});
defineType("TSNamespaceExportDeclaration", {
  aliases: ["Statement"],
  visitor: ["id"],
  fields: { id: validateType("Identifier") }
});
defineType("TSTypeAnnotation", {
  visitor: ["typeAnnotation"],
  fields: { typeAnnotation: { validate: assertNodeType("TSType") } }
});
defineType("TSTypeParameterInstantiation", {
  visitor: ["params"],
  fields: { params: { validate: chain(assertValueType("array"), assertEach(assertNodeType("TSType"))) } }
});
defineType("TSTypeParameterDeclaration", {
  visitor: ["params"],
  fields: { params: { validate: chain(assertValueType("array"), assertEach(assertNodeType("TSTypeParameter"))) } }
});
defineType("TSTypeParameter", {
  builder: ["constraint", "default", "name"],
  visitor: ["constraint", "default"],
  fields: {
    name: { validate: assertValueType("string") },
    in: { validate: assertValueType("boolean"), optional: true },
    out: { validate: assertValueType("boolean"), optional: true },
    const: { validate: assertValueType("boolean"), optional: true },
    constraint: { validate: assertNodeType("TSType"), optional: true },
    default: { validate: assertNodeType("TSType"), optional: true }
  }
});

const DEPRECATED_ALIASES = { ModuleDeclaration: "ImportOrExportDeclaration" };

Object.keys(DEPRECATED_ALIASES).forEach(deprecatedAlias => {
  FLIPPED_ALIAS_KEYS[deprecatedAlias] = FLIPPED_ALIAS_KEYS[DEPRECATED_ALIASES[deprecatedAlias]];
});
toFastProperties(VISITOR_KEYS);
toFastProperties(ALIAS_KEYS);
toFastProperties(FLIPPED_ALIAS_KEYS);
toFastProperties(NODE_FIELDS);
toFastProperties(BUILDER_KEYS);
toFastProperties(DEPRECATED_KEYS);
toFastProperties(PLACEHOLDERS_ALIAS);
toFastProperties(PLACEHOLDERS_FLIPPED_ALIAS);
const TYPES = [].concat(Object.keys(VISITOR_KEYS), Object.keys(FLIPPED_ALIAS_KEYS), Object.keys(DEPRECATED_KEYS));

function validate(node, key, val) {
  if (!node) return;
  const fields = NODE_FIELDS[node.type];
  if (!fields) return;
  validateField(node, key, val, fields[key]);
  validateChild(node, key, val);
}
function validateField(node, key, val, field) {
  field == null || !field.validate || (field.optional && val == null) || field.validate(node, key, val);
}
function validateChild(node, key, val) {
  if (val == null) return;
  const validate = NODE_PARENT_VALIDATIONS[val.type];
  validate && validate(node, key, val);
}

function validateNode(node) {
  const keys = BUILDER_KEYS[node.type];
  for (const key of keys) validate(node, key, node[key]);

  return node;
}

function arrayExpression(elements = []) {
  return validateNode({ type: "ArrayExpression", elements });
}
function assignmentExpression(operator, left, right) {
  return validateNode({ type: "AssignmentExpression", operator, left, right });
}
function binaryExpression(operator, left, right) {
  return validateNode({ type: "BinaryExpression", operator, left, right });
}
function interpreterDirective(value) {
  return validateNode({ type: "InterpreterDirective", value });
}
function directive(value) {
  return validateNode({ type: "Directive", value });
}
function directiveLiteral(value) {
  return validateNode({ type: "DirectiveLiteral", value });
}
function blockStatement(body, directives = []) {
  return validateNode({ type: "BlockStatement", body, directives });
}
function breakStatement(label = null) {
  return validateNode({ type: "BreakStatement", label });
}
function callExpression(callee, _arguments) {
  return validateNode({ type: "CallExpression", callee, arguments: _arguments });
}
function catchClause(param = null, body) {
  return validateNode({ type: "CatchClause", param, body });
}
function conditionalExpression(test, consequent, alternate) {
  return validateNode({ type: "ConditionalExpression", test, consequent, alternate });
}
function continueStatement(label = null) {
  return validateNode({ type: "ContinueStatement", label });
}
function debuggerStatement() {
  return { type: "DebuggerStatement" };
}
function doWhileStatement(test, body) {
  return validateNode({ type: "DoWhileStatement", test, body });
}
function emptyStatement() {
  return { type: "EmptyStatement" };
}
function expressionStatement(expression) {
  return validateNode({ type: "ExpressionStatement", expression });
}
function file(program, comments = null, tokens = null) {
  return validateNode({ type: "File", program, comments, tokens });
}
function forInStatement(left, right, body) {
  return validateNode({ type: "ForInStatement", left, right, body });
}
function forStatement(init = null, test = null, update = null, body) {
  return validateNode({ type: "ForStatement", init, test, update, body });
}
function functionDeclaration(id = null, params, body, generator = false, async = false) {
  return validateNode({ type: "FunctionDeclaration", id, params, body, generator, async });
}
function functionExpression(id = null, params, body, generator = false, async = false) {
  return validateNode({ type: "FunctionExpression", id, params, body, generator, async });
}
function identifier(name) {
  return validateNode({ type: "Identifier", name });
}
function ifStatement(test, consequent, alternate = null) {
  return validateNode({ type: "IfStatement", test, consequent, alternate });
}
function labeledStatement(label, body) {
  return validateNode({ type: "LabeledStatement", label, body });
}
function stringLiteral(value) {
  return validateNode({ type: "StringLiteral", value });
}
function numericLiteral(value) {
  return validateNode({ type: "NumericLiteral", value });
}
function nullLiteral() {
  return { type: "NullLiteral" };
}
function booleanLiteral(value) {
  return validateNode({ type: "BooleanLiteral", value });
}
function regExpLiteral(pattern, flags = "") {
  return validateNode({ type: "RegExpLiteral", pattern, flags });
}
function logicalExpression(operator, left, right) {
  return validateNode({ type: "LogicalExpression", operator, left, right });
}
function memberExpression(object, property, computed = false, optional = null) {
  return validateNode({ type: "MemberExpression", object, property, computed, optional });
}
function newExpression(callee, _arguments) {
  return validateNode({ type: "NewExpression", callee, arguments: _arguments });
}
function program(body, directives = [], sourceType = "script", interpreter = null) {
  return validateNode({ type: "Program", body, directives, sourceType, interpreter, sourceFile: null });
}
function objectExpression(properties) {
  return validateNode({ type: "ObjectExpression", properties });
}
function objectMethod(kind = "method", key, params, body, computed = false, generator = false, async = false) {
  return validateNode({ type: "ObjectMethod", kind, key, params, body, computed, generator, async });
}
function objectProperty(key, value, computed = false, shorthand = false, decorators = null) {
  return validateNode({ type: "ObjectProperty", key, value, computed, shorthand, decorators });
}
function restElement(argument) {
  return validateNode({ type: "RestElement", argument });
}
function returnStatement(argument = null) {
  return validateNode({ type: "ReturnStatement", argument });
}
function sequenceExpression(expressions) {
  return validateNode({ type: "SequenceExpression", expressions });
}
function parenthesizedExpression(expression) {
  return validateNode({ type: "ParenthesizedExpression", expression });
}
function switchCase(test = null, consequent) {
  return validateNode({ type: "SwitchCase", test, consequent });
}
function switchStatement(discriminant, cases) {
  return validateNode({ type: "SwitchStatement", discriminant, cases });
}
function thisExpression() {
  return { type: "ThisExpression" };
}
function throwStatement(argument) {
  return validateNode({ type: "ThrowStatement", argument });
}
function tryStatement(block, handler = null, finalizer = null) {
  return validateNode({ type: "TryStatement", block, handler, finalizer });
}
function unaryExpression(operator, argument, prefix = true) {
  return validateNode({ type: "UnaryExpression", operator, argument, prefix });
}
function updateExpression(operator, argument, prefix = false) {
  return validateNode({ type: "UpdateExpression", operator, argument, prefix });
}
function variableDeclaration(kind, declarations) {
  return validateNode({ type: "VariableDeclaration", kind, declarations });
}
function variableDeclarator(id, init = null) {
  return validateNode({ type: "VariableDeclarator", id, init });
}
function whileStatement(test, body) {
  return validateNode({ type: "WhileStatement", test, body });
}
function withStatement(object, body) {
  return validateNode({ type: "WithStatement", object, body });
}
function assignmentPattern(left, right) {
  return validateNode({ type: "AssignmentPattern", left, right });
}
function arrayPattern(elements) {
  return validateNode({ type: "ArrayPattern", elements });
}
function arrowFunctionExpression(params, body, async = false) {
  return validateNode({ type: "ArrowFunctionExpression", params, body, async, expression: null });
}
function classBody(body) {
  return validateNode({ type: "ClassBody", body });
}
function classExpression(id = null, superClass = null, body, decorators = null) {
  return validateNode({ type: "ClassExpression", id, superClass, body, decorators });
}
function classDeclaration(id = null, superClass = null, body, decorators = null) {
  return validateNode({ type: "ClassDeclaration", id, superClass, body, decorators });
}
function exportAllDeclaration(source) {
  return validateNode({ type: "ExportAllDeclaration", source });
}
function exportDefaultDeclaration(declaration) {
  return validateNode({ type: "ExportDefaultDeclaration", declaration });
}
function exportNamedDeclaration(declaration = null, specifiers = [], source = null) {
  return validateNode({ type: "ExportNamedDeclaration", declaration, specifiers, source });
}
function exportSpecifier(local, exported) {
  return validateNode({ type: "ExportSpecifier", local, exported });
}
function forOfStatement(left, right, body, _await = false) {
  return validateNode({ type: "ForOfStatement", left, right, body, await: _await });
}
function importDeclaration(specifiers, source) {
  return validateNode({ type: "ImportDeclaration", specifiers, source });
}
function importDefaultSpecifier(local) {
  return validateNode({ type: "ImportDefaultSpecifier", local });
}
function importNamespaceSpecifier(local) {
  return validateNode({ type: "ImportNamespaceSpecifier", local });
}
function importSpecifier(local, imported) {
  return validateNode({ type: "ImportSpecifier", local, imported });
}
function metaProperty(meta, property) {
  return validateNode({ type: "MetaProperty", meta, property });
}
function classMethod(
  kind = "method",
  key,
  params,
  body,
  computed = false,
  _static = false,
  generator = false,
  async = false
) {
  return validateNode({ type: "ClassMethod", kind, key, params, body, computed, static: _static, generator, async });
}
function objectPattern(properties) {
  return validateNode({ type: "ObjectPattern", properties });
}
function spreadElement(argument) {
  return validateNode({ type: "SpreadElement", argument });
}
function _super() {
  return { type: "Super" };
}
function taggedTemplateExpression(tag, quasi) {
  return validateNode({ type: "TaggedTemplateExpression", tag, quasi });
}
function templateElement(value, tail = false) {
  return validateNode({ type: "TemplateElement", value, tail });
}
function templateLiteral(quasis, expressions) {
  return validateNode({ type: "TemplateLiteral", quasis, expressions });
}
function yieldExpression(argument = null, delegate = false) {
  return validateNode({ type: "YieldExpression", argument, delegate });
}
function awaitExpression(argument) {
  return validateNode({ type: "AwaitExpression", argument });
}
function _import() {
  return { type: "Import" };
}
function bigIntLiteral(value) {
  return validateNode({ type: "BigIntLiteral", value });
}
function exportNamespaceSpecifier(exported) {
  return validateNode({ type: "ExportNamespaceSpecifier", exported });
}
function optionalMemberExpression(object, property, computed = false, optional) {
  return validateNode({ type: "OptionalMemberExpression", object, property, computed, optional });
}
function optionalCallExpression(callee, _arguments, optional) {
  return validateNode({ type: "OptionalCallExpression", callee, arguments: _arguments, optional });
}
function classProperty(key, value = null, typeAnnotation = null, decorators = null, computed = false, _static = false) {
  return validateNode({ type: "ClassProperty", key, value, typeAnnotation, decorators, computed, static: _static });
}
function classAccessorProperty(
  key,
  value = null,
  typeAnnotation = null,
  decorators = null,
  computed = false,
  _static = false
) {
  return validateNode({
    type: "ClassAccessorProperty",
    key,
    value,
    typeAnnotation,
    decorators,
    computed,
    static: _static
  });
}
function classPrivateProperty(key, value = null, decorators = null, _static = false) {
  return validateNode({ type: "ClassPrivateProperty", key, value, decorators, static: _static });
}
function classPrivateMethod(kind = "method", key, params, body, _static = false) {
  return validateNode({ type: "ClassPrivateMethod", kind, key, params, body, static: _static });
}
function privateName(id) {
  return validateNode({ type: "PrivateName", id });
}
function staticBlock(body) {
  return validateNode({ type: "StaticBlock", body });
}
function anyTypeAnnotation() {
  return { type: "AnyTypeAnnotation" };
}
function arrayTypeAnnotation(elementType) {
  return validateNode({ type: "ArrayTypeAnnotation", elementType });
}
function booleanTypeAnnotation() {
  return { type: "BooleanTypeAnnotation" };
}
function booleanLiteralTypeAnnotation(value) {
  return validateNode({ type: "BooleanLiteralTypeAnnotation", value });
}
function nullLiteralTypeAnnotation() {
  return { type: "NullLiteralTypeAnnotation" };
}
function classImplements(id, typeParameters = null) {
  return validateNode({ type: "ClassImplements", id, typeParameters });
}
function declareClass(id, typeParameters = null, _extends = null, body) {
  return validateNode({ type: "DeclareClass", id, typeParameters, extends: _extends, body });
}
function declareFunction(id) {
  return validateNode({ type: "DeclareFunction", id });
}
function declareInterface(id, typeParameters = null, _extends = null, body) {
  return validateNode({ type: "DeclareInterface", id, typeParameters, extends: _extends, body });
}
function declareModule(id, body, kind = null) {
  return validateNode({ type: "DeclareModule", id, body, kind });
}
function declareModuleExports(typeAnnotation) {
  return validateNode({ type: "DeclareModuleExports", typeAnnotation });
}
function declareTypeAlias(id, typeParameters = null, right) {
  return validateNode({ type: "DeclareTypeAlias", id, typeParameters, right });
}
function declareOpaqueType(id, typeParameters = null, supertype = null) {
  return validateNode({ type: "DeclareOpaqueType", id, typeParameters, supertype });
}
function declareVariable(id) {
  return validateNode({ type: "DeclareVariable", id });
}
function declareExportDeclaration(declaration = null, specifiers = null, source = null) {
  return validateNode({ type: "DeclareExportDeclaration", declaration, specifiers, source });
}
function declareExportAllDeclaration(source) {
  return validateNode({ type: "DeclareExportAllDeclaration", source });
}
function declaredPredicate(value) {
  return validateNode({ type: "DeclaredPredicate", value });
}
function existsTypeAnnotation() {
  return { type: "ExistsTypeAnnotation" };
}
function functionTypeAnnotation(typeParameters = null, params, rest = null, returnType) {
  return validateNode({ type: "FunctionTypeAnnotation", typeParameters, params, rest, returnType });
}
function functionTypeParam(name = null, typeAnnotation) {
  return validateNode({ type: "FunctionTypeParam", name, typeAnnotation });
}
function genericTypeAnnotation(id, typeParameters = null) {
  return validateNode({ type: "GenericTypeAnnotation", id, typeParameters });
}
function inferredPredicate() {
  return { type: "InferredPredicate" };
}
function interfaceExtends(id, typeParameters = null) {
  return validateNode({ type: "InterfaceExtends", id, typeParameters });
}
function interfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return validateNode({ type: "InterfaceDeclaration", id, typeParameters, extends: _extends, body });
}
function interfaceTypeAnnotation(_extends = null, body) {
  return validateNode({ type: "InterfaceTypeAnnotation", extends: _extends, body });
}
function intersectionTypeAnnotation(types) {
  return validateNode({ type: "IntersectionTypeAnnotation", types });
}
function mixedTypeAnnotation() {
  return { type: "MixedTypeAnnotation" };
}
function emptyTypeAnnotation() {
  return { type: "EmptyTypeAnnotation" };
}
function nullableTypeAnnotation(typeAnnotation) {
  return validateNode({ type: "NullableTypeAnnotation", typeAnnotation });
}
function numberLiteralTypeAnnotation(value) {
  return validateNode({ type: "NumberLiteralTypeAnnotation", value });
}
function numberTypeAnnotation() {
  return { type: "NumberTypeAnnotation" };
}
function objectTypeAnnotation(properties, indexers = [], callProperties = [], internalSlots = [], exact = false) {
  return validateNode({ type: "ObjectTypeAnnotation", properties, indexers, callProperties, internalSlots, exact });
}
function objectTypeInternalSlot(id, value, optional, _static, method) {
  return validateNode({ type: "ObjectTypeInternalSlot", id, value, optional, static: _static, method });
}
function objectTypeCallProperty(value) {
  return validateNode({ type: "ObjectTypeCallProperty", value, static: null });
}
function objectTypeIndexer(id = null, key, value, variance = null) {
  return validateNode({ type: "ObjectTypeIndexer", id, key, value, variance, static: null });
}
function objectTypeProperty(key, value, variance = null) {
  return validateNode({
    type: "ObjectTypeProperty",
    key,
    value,
    variance,
    kind: null,
    method: null,
    optional: null,
    proto: null,
    static: null
  });
}
function objectTypeSpreadProperty(argument) {
  return validateNode({ type: "ObjectTypeSpreadProperty", argument });
}
function opaqueType(id, typeParameters = null, supertype = null, impltype) {
  return validateNode({ type: "OpaqueType", id, typeParameters, supertype, impltype });
}
function qualifiedTypeIdentifier(id, qualification) {
  return validateNode({ type: "QualifiedTypeIdentifier", id, qualification });
}
function stringLiteralTypeAnnotation(value) {
  return validateNode({ type: "StringLiteralTypeAnnotation", value });
}
function stringTypeAnnotation() {
  return { type: "StringTypeAnnotation" };
}
function symbolTypeAnnotation() {
  return { type: "SymbolTypeAnnotation" };
}
function thisTypeAnnotation() {
  return { type: "ThisTypeAnnotation" };
}
function tupleTypeAnnotation(types) {
  return validateNode({ type: "TupleTypeAnnotation", types });
}
function typeofTypeAnnotation(argument) {
  return validateNode({ type: "TypeofTypeAnnotation", argument });
}
function typeAlias(id, typeParameters = null, right) {
  return validateNode({ type: "TypeAlias", id, typeParameters, right });
}
function typeAnnotation(typeAnnotation) {
  return validateNode({ type: "TypeAnnotation", typeAnnotation });
}
function typeCastExpression(expression, typeAnnotation) {
  return validateNode({ type: "TypeCastExpression", expression, typeAnnotation });
}
function typeParameter(bound = null, _default = null, variance = null) {
  return validateNode({ type: "TypeParameter", bound, default: _default, variance, name: null });
}
function typeParameterDeclaration(params) {
  return validateNode({ type: "TypeParameterDeclaration", params });
}
function typeParameterInstantiation(params) {
  return validateNode({ type: "TypeParameterInstantiation", params });
}
function unionTypeAnnotation(types) {
  return validateNode({ type: "UnionTypeAnnotation", types });
}
function variance(kind) {
  return validateNode({ type: "Variance", kind });
}
function voidTypeAnnotation() {
  return { type: "VoidTypeAnnotation" };
}
function enumDeclaration(id, body) {
  return validateNode({ type: "EnumDeclaration", id, body });
}
function enumBooleanBody(members) {
  return validateNode({ type: "EnumBooleanBody", members, explicitType: null, hasUnknownMembers: null });
}
function enumNumberBody(members) {
  return validateNode({ type: "EnumNumberBody", members, explicitType: null, hasUnknownMembers: null });
}
function enumStringBody(members) {
  return validateNode({ type: "EnumStringBody", members, explicitType: null, hasUnknownMembers: null });
}
function enumSymbolBody(members) {
  return validateNode({ type: "EnumSymbolBody", members, hasUnknownMembers: null });
}
function enumBooleanMember(id) {
  return validateNode({ type: "EnumBooleanMember", id, init: null });
}
function enumNumberMember(id, init) {
  return validateNode({ type: "EnumNumberMember", id, init });
}
function enumStringMember(id, init) {
  return validateNode({ type: "EnumStringMember", id, init });
}
function enumDefaultedMember(id) {
  return validateNode({ type: "EnumDefaultedMember", id });
}
function indexedAccessType(objectType, indexType) {
  return validateNode({ type: "IndexedAccessType", objectType, indexType });
}
function optionalIndexedAccessType(objectType, indexType) {
  return validateNode({ type: "OptionalIndexedAccessType", objectType, indexType, optional: null });
}
function jsxAttribute(name, value = null) {
  return validateNode({ type: "JSXAttribute", name, value });
}
function jsxClosingElement(name) {
  return validateNode({ type: "JSXClosingElement", name });
}
function jsxElement(openingElement, closingElement = null, children, selfClosing = null) {
  return validateNode({ type: "JSXElement", openingElement, closingElement, children, selfClosing });
}
function jsxEmptyExpression() {
  return { type: "JSXEmptyExpression" };
}
function jsxExpressionContainer(expression) {
  return validateNode({ type: "JSXExpressionContainer", expression });
}
function jsxSpreadChild(expression) {
  return validateNode({ type: "JSXSpreadChild", expression });
}
function jsxIdentifier(name) {
  return validateNode({ type: "JSXIdentifier", name });
}
function jsxMemberExpression(object, property) {
  return validateNode({ type: "JSXMemberExpression", object, property });
}
function jsxNamespacedName(namespace, name) {
  return validateNode({ type: "JSXNamespacedName", namespace, name });
}
function jsxOpeningElement(name, attributes, selfClosing = false) {
  return validateNode({ type: "JSXOpeningElement", name, attributes, selfClosing });
}
function jsxSpreadAttribute(argument) {
  return validateNode({ type: "JSXSpreadAttribute", argument });
}
function jsxText(value) {
  return validateNode({ type: "JSXText", value });
}
function jsxFragment(openingFragment, closingFragment, children) {
  return validateNode({ type: "JSXFragment", openingFragment, closingFragment, children });
}
function jsxOpeningFragment() {
  return { type: "JSXOpeningFragment" };
}
function jsxClosingFragment() {
  return { type: "JSXClosingFragment" };
}
function noop() {
  return { type: "Noop" };
}
function placeholder(expectedNode, name) {
  return validateNode({ type: "Placeholder", expectedNode, name });
}
function v8IntrinsicIdentifier(name) {
  return validateNode({ type: "V8IntrinsicIdentifier", name });
}
function argumentPlaceholder() {
  return { type: "ArgumentPlaceholder" };
}
function bindExpression(object, callee) {
  return validateNode({ type: "BindExpression", object, callee });
}
function importAttribute(key, value) {
  return validateNode({ type: "ImportAttribute", key, value });
}
function decorator(expression) {
  return validateNode({ type: "Decorator", expression });
}
function doExpression(body, async = false) {
  return validateNode({ type: "DoExpression", body, async });
}
function exportDefaultSpecifier(exported) {
  return validateNode({ type: "ExportDefaultSpecifier", exported });
}
function recordExpression(properties) {
  return validateNode({ type: "RecordExpression", properties });
}
function tupleExpression(elements = []) {
  return validateNode({ type: "TupleExpression", elements });
}
function decimalLiteral(value) {
  return validateNode({ type: "DecimalLiteral", value });
}
function moduleExpression(body) {
  return validateNode({ type: "ModuleExpression", body });
}
function topicReference() {
  return { type: "TopicReference" };
}
function pipelineTopicExpression(expression) {
  return validateNode({ type: "PipelineTopicExpression", expression });
}
function pipelineBareFunction(callee) {
  return validateNode({ type: "PipelineBareFunction", callee });
}
function pipelinePrimaryTopicReference() {
  return { type: "PipelinePrimaryTopicReference" };
}
function tsParameterProperty(parameter) {
  return validateNode({ type: "TSParameterProperty", parameter });
}
function tsDeclareFunction(id = null, typeParameters = null, params, returnType = null) {
  return validateNode({ type: "TSDeclareFunction", id, typeParameters, params, returnType });
}
function tsDeclareMethod(decorators = null, key, typeParameters = null, params, returnType = null) {
  return validateNode({ type: "TSDeclareMethod", decorators, key, typeParameters, params, returnType });
}
function tsQualifiedName(left, right) {
  return validateNode({ type: "TSQualifiedName", left, right });
}
function tsCallSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return validateNode({ type: "TSCallSignatureDeclaration", typeParameters, parameters, typeAnnotation });
}
function tsConstructSignatureDeclaration(typeParameters = null, parameters, typeAnnotation = null) {
  return validateNode({ type: "TSConstructSignatureDeclaration", typeParameters, parameters, typeAnnotation });
}
function tsPropertySignature(key, typeAnnotation = null, initializer = null) {
  return validateNode({ type: "TSPropertySignature", key, typeAnnotation, initializer, kind: null });
}
function tsMethodSignature(key, typeParameters = null, parameters, typeAnnotation = null) {
  return validateNode({ type: "TSMethodSignature", key, typeParameters, parameters, typeAnnotation, kind: null });
}
function tsIndexSignature(parameters, typeAnnotation = null) {
  return validateNode({ type: "TSIndexSignature", parameters, typeAnnotation });
}
function tsAnyKeyword() {
  return { type: "TSAnyKeyword" };
}
function tsBooleanKeyword() {
  return { type: "TSBooleanKeyword" };
}
function tsBigIntKeyword() {
  return { type: "TSBigIntKeyword" };
}
function tsIntrinsicKeyword() {
  return { type: "TSIntrinsicKeyword" };
}
function tsNeverKeyword() {
  return { type: "TSNeverKeyword" };
}
function tsNullKeyword() {
  return { type: "TSNullKeyword" };
}
function tsNumberKeyword() {
  return { type: "TSNumberKeyword" };
}
function tsObjectKeyword() {
  return { type: "TSObjectKeyword" };
}
function tsStringKeyword() {
  return { type: "TSStringKeyword" };
}
function tsSymbolKeyword() {
  return { type: "TSSymbolKeyword" };
}
function tsUndefinedKeyword() {
  return { type: "TSUndefinedKeyword" };
}
function tsUnknownKeyword() {
  return { type: "TSUnknownKeyword" };
}
function tsVoidKeyword() {
  return { type: "TSVoidKeyword" };
}
function tsThisType() {
  return { type: "TSThisType" };
}
function tsFunctionType(typeParameters = null, parameters, typeAnnotation = null) {
  return validateNode({ type: "TSFunctionType", typeParameters, parameters, typeAnnotation });
}
function tsConstructorType(typeParameters = null, parameters, typeAnnotation = null) {
  return validateNode({ type: "TSConstructorType", typeParameters, parameters, typeAnnotation });
}
function tsTypeReference(typeName, typeParameters = null) {
  return validateNode({ type: "TSTypeReference", typeName, typeParameters });
}
function tsTypePredicate(parameterName, typeAnnotation = null, asserts = null) {
  return validateNode({ type: "TSTypePredicate", parameterName, typeAnnotation, asserts });
}
function tsTypeQuery(exprName, typeParameters = null) {
  return validateNode({ type: "TSTypeQuery", exprName, typeParameters });
}
function tsTypeLiteral(members) {
  return validateNode({ type: "TSTypeLiteral", members });
}
function tsArrayType(elementType) {
  return validateNode({ type: "TSArrayType", elementType });
}
function tsTupleType(elementTypes) {
  return validateNode({ type: "TSTupleType", elementTypes });
}
function tsOptionalType(typeAnnotation) {
  return validateNode({ type: "TSOptionalType", typeAnnotation });
}
function tsRestType(typeAnnotation) {
  return validateNode({ type: "TSRestType", typeAnnotation });
}
function tsNamedTupleMember(label, elementType, optional = false) {
  return validateNode({ type: "TSNamedTupleMember", label, elementType, optional });
}
function tsUnionType(types) {
  return validateNode({ type: "TSUnionType", types });
}
function tsIntersectionType(types) {
  return validateNode({ type: "TSIntersectionType", types });
}
function tsConditionalType(checkType, extendsType, trueType, falseType) {
  return validateNode({ type: "TSConditionalType", checkType, extendsType, trueType, falseType });
}
function tsInferType(typeParameter) {
  return validateNode({ type: "TSInferType", typeParameter });
}
function tsParenthesizedType(typeAnnotation) {
  return validateNode({ type: "TSParenthesizedType", typeAnnotation });
}
function tsTypeOperator(typeAnnotation) {
  return validateNode({ type: "TSTypeOperator", typeAnnotation, operator: null });
}
function tsIndexedAccessType(objectType, indexType) {
  return validateNode({ type: "TSIndexedAccessType", objectType, indexType });
}
function tsMappedType(typeParameter, typeAnnotation = null, nameType = null) {
  return validateNode({ type: "TSMappedType", typeParameter, typeAnnotation, nameType });
}
function tsLiteralType(literal) {
  return validateNode({ type: "TSLiteralType", literal });
}
function tsExpressionWithTypeArguments(expression, typeParameters = null) {
  return validateNode({ type: "TSExpressionWithTypeArguments", expression, typeParameters });
}
function tsInterfaceDeclaration(id, typeParameters = null, _extends = null, body) {
  return validateNode({ type: "TSInterfaceDeclaration", id, typeParameters, extends: _extends, body });
}
function tsInterfaceBody(body) {
  return validateNode({ type: "TSInterfaceBody", body });
}
function tsTypeAliasDeclaration(id, typeParameters = null, typeAnnotation) {
  return validateNode({ type: "TSTypeAliasDeclaration", id, typeParameters, typeAnnotation });
}
function tsInstantiationExpression(expression, typeParameters = null) {
  return validateNode({ type: "TSInstantiationExpression", expression, typeParameters });
}
function tsAsExpression(expression, typeAnnotation) {
  return validateNode({ type: "TSAsExpression", expression, typeAnnotation });
}
function tsSatisfiesExpression(expression, typeAnnotation) {
  return validateNode({ type: "TSSatisfiesExpression", expression, typeAnnotation });
}
function tsTypeAssertion(typeAnnotation, expression) {
  return validateNode({ type: "TSTypeAssertion", typeAnnotation, expression });
}
function tsEnumDeclaration(id, members) {
  return validateNode({ type: "TSEnumDeclaration", id, members });
}
function tsEnumMember(id, initializer = null) {
  return validateNode({ type: "TSEnumMember", id, initializer });
}
function tsModuleDeclaration(id, body) {
  return validateNode({ type: "TSModuleDeclaration", id, body });
}
function tsModuleBlock(body) {
  return validateNode({ type: "TSModuleBlock", body });
}
function tsImportType(argument, qualifier = null, typeParameters = null) {
  return validateNode({ type: "TSImportType", argument, qualifier, typeParameters });
}
function tsImportEqualsDeclaration(id, moduleReference) {
  return validateNode({ type: "TSImportEqualsDeclaration", id, moduleReference, isExport: null });
}
function tsExternalModuleReference(expression) {
  return validateNode({ type: "TSExternalModuleReference", expression });
}
function tsNonNullExpression(expression) {
  return validateNode({ type: "TSNonNullExpression", expression });
}
function tsExportAssignment(expression) {
  return validateNode({ type: "TSExportAssignment", expression });
}
function tsNamespaceExportDeclaration(id) {
  return validateNode({ type: "TSNamespaceExportDeclaration", id });
}
function tsTypeAnnotation(typeAnnotation) {
  return validateNode({ type: "TSTypeAnnotation", typeAnnotation });
}
function tsTypeParameterInstantiation(params) {
  return validateNode({ type: "TSTypeParameterInstantiation", params });
}
function tsTypeParameterDeclaration(params) {
  return validateNode({ type: "TSTypeParameterDeclaration", params });
}
function tsTypeParameter(constraint = null, _default = null, name) {
  return validateNode({ type: "TSTypeParameter", constraint, default: _default, name });
}
function NumberLiteral(value) {
  deprecationWarning("NumberLiteral", "NumericLiteral", "The node type ");
  return numericLiteral(value);
}
function RegexLiteral(pattern, flags = "") {
  deprecationWarning("RegexLiteral", "RegExpLiteral", "The node type ");
  return regExpLiteral(pattern, flags);
}
function RestProperty(argument) {
  deprecationWarning("RestProperty", "RestElement", "The node type ");
  return restElement(argument);
}
function SpreadProperty(argument) {
  deprecationWarning("SpreadProperty", "SpreadElement", "The node type ");
  return spreadElement(argument);
}

function cleanJSXElementLiteralChild(child, args) {
  const lines = child.value.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) if (lines[i].match(/[^ \t]/)) lastNonEmptyLine = i;

  let str = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i],
      isFirstLine = i === 0,
      isLastLine = i === lines.length - 1,
      isLastNonEmptyLine = i === lastNonEmptyLine;
    let trimmedLine = line.replace(/\t/g, " ");
    isFirstLine || (trimmedLine = trimmedLine.replace(/^[ ]+/, ""));

    isLastLine || (trimmedLine = trimmedLine.replace(/[ ]+$/, ""));

    if (trimmedLine) {
      isLastNonEmptyLine || (trimmedLine += " ");

      str += trimmedLine;
    }
  }
  str && args.push(inherits(stringLiteral(str), child));
}

function buildChildren(node) {
  const elements = [];
  for (let i = 0; i < node.children.length; i++) {
    let child = node.children[i];
    if (isJSXText(child)) {
      cleanJSXElementLiteralChild(child, elements);
      continue;
    }
    if (isJSXExpressionContainer(child)) child = child.expression;
    isJSXEmptyExpression(child) || elements.push(child);
  }
  return elements;
}

function isNode(node) {
  return !(!node || !VISITOR_KEYS[node.type]);
}

function assertNode(node) {
  if (!isNode(node)) {
    var _node$type;
    const type = (_node$type = node == null ? void 0 : node.type) != null ? _node$type : JSON.stringify(node);
    throw new TypeError(`Not a valid node of type "${type}"`);
  }
}

function assert(type, node, opts) {
  if (!is(type, node, opts))
    throw new Error(`Expected type "${type}" with option ${JSON.stringify(opts)}, but instead got "${node.type}".`);
}
function assertArrayExpression(node, opts) {
  assert("ArrayExpression", node, opts);
}
function assertAssignmentExpression(node, opts) {
  assert("AssignmentExpression", node, opts);
}
function assertBinaryExpression(node, opts) {
  assert("BinaryExpression", node, opts);
}
function assertInterpreterDirective(node, opts) {
  assert("InterpreterDirective", node, opts);
}
function assertDirective(node, opts) {
  assert("Directive", node, opts);
}
function assertDirectiveLiteral(node, opts) {
  assert("DirectiveLiteral", node, opts);
}
function assertBlockStatement(node, opts) {
  assert("BlockStatement", node, opts);
}
function assertBreakStatement(node, opts) {
  assert("BreakStatement", node, opts);
}
function assertCallExpression(node, opts) {
  assert("CallExpression", node, opts);
}
function assertCatchClause(node, opts) {
  assert("CatchClause", node, opts);
}
function assertConditionalExpression(node, opts) {
  assert("ConditionalExpression", node, opts);
}
function assertContinueStatement(node, opts) {
  assert("ContinueStatement", node, opts);
}
function assertDebuggerStatement(node, opts) {
  assert("DebuggerStatement", node, opts);
}
function assertDoWhileStatement(node, opts) {
  assert("DoWhileStatement", node, opts);
}
function assertEmptyStatement(node, opts) {
  assert("EmptyStatement", node, opts);
}
function assertExpressionStatement(node, opts) {
  assert("ExpressionStatement", node, opts);
}
function assertFile(node, opts) {
  assert("File", node, opts);
}
function assertForInStatement(node, opts) {
  assert("ForInStatement", node, opts);
}
function assertForStatement(node, opts) {
  assert("ForStatement", node, opts);
}
function assertFunctionDeclaration(node, opts) {
  assert("FunctionDeclaration", node, opts);
}
function assertFunctionExpression(node, opts) {
  assert("FunctionExpression", node, opts);
}
function assertIdentifier(node, opts) {
  assert("Identifier", node, opts);
}
function assertIfStatement(node, opts) {
  assert("IfStatement", node, opts);
}
function assertLabeledStatement(node, opts) {
  assert("LabeledStatement", node, opts);
}
function assertStringLiteral(node, opts) {
  assert("StringLiteral", node, opts);
}
function assertNumericLiteral(node, opts) {
  assert("NumericLiteral", node, opts);
}
function assertNullLiteral(node, opts) {
  assert("NullLiteral", node, opts);
}
function assertBooleanLiteral(node, opts) {
  assert("BooleanLiteral", node, opts);
}
function assertRegExpLiteral(node, opts) {
  assert("RegExpLiteral", node, opts);
}
function assertLogicalExpression(node, opts) {
  assert("LogicalExpression", node, opts);
}
function assertMemberExpression(node, opts) {
  assert("MemberExpression", node, opts);
}
function assertNewExpression(node, opts) {
  assert("NewExpression", node, opts);
}
function assertProgram(node, opts) {
  assert("Program", node, opts);
}
function assertObjectExpression(node, opts) {
  assert("ObjectExpression", node, opts);
}
function assertObjectMethod(node, opts) {
  assert("ObjectMethod", node, opts);
}
function assertObjectProperty(node, opts) {
  assert("ObjectProperty", node, opts);
}
function assertRestElement(node, opts) {
  assert("RestElement", node, opts);
}
function assertReturnStatement(node, opts) {
  assert("ReturnStatement", node, opts);
}
function assertSequenceExpression(node, opts) {
  assert("SequenceExpression", node, opts);
}
function assertParenthesizedExpression(node, opts) {
  assert("ParenthesizedExpression", node, opts);
}
function assertSwitchCase(node, opts) {
  assert("SwitchCase", node, opts);
}
function assertSwitchStatement(node, opts) {
  assert("SwitchStatement", node, opts);
}
function assertThisExpression(node, opts) {
  assert("ThisExpression", node, opts);
}
function assertThrowStatement(node, opts) {
  assert("ThrowStatement", node, opts);
}
function assertTryStatement(node, opts) {
  assert("TryStatement", node, opts);
}
function assertUnaryExpression(node, opts) {
  assert("UnaryExpression", node, opts);
}
function assertUpdateExpression(node, opts) {
  assert("UpdateExpression", node, opts);
}
function assertVariableDeclaration(node, opts) {
  assert("VariableDeclaration", node, opts);
}
function assertVariableDeclarator(node, opts) {
  assert("VariableDeclarator", node, opts);
}
function assertWhileStatement(node, opts) {
  assert("WhileStatement", node, opts);
}
function assertWithStatement(node, opts) {
  assert("WithStatement", node, opts);
}
function assertAssignmentPattern(node, opts) {
  assert("AssignmentPattern", node, opts);
}
function assertArrayPattern(node, opts) {
  assert("ArrayPattern", node, opts);
}
function assertArrowFunctionExpression(node, opts) {
  assert("ArrowFunctionExpression", node, opts);
}
function assertClassBody(node, opts) {
  assert("ClassBody", node, opts);
}
function assertClassExpression(node, opts) {
  assert("ClassExpression", node, opts);
}
function assertClassDeclaration(node, opts) {
  assert("ClassDeclaration", node, opts);
}
function assertExportAllDeclaration(node, opts) {
  assert("ExportAllDeclaration", node, opts);
}
function assertExportDefaultDeclaration(node, opts) {
  assert("ExportDefaultDeclaration", node, opts);
}
function assertExportNamedDeclaration(node, opts) {
  assert("ExportNamedDeclaration", node, opts);
}
function assertExportSpecifier(node, opts) {
  assert("ExportSpecifier", node, opts);
}
function assertForOfStatement(node, opts) {
  assert("ForOfStatement", node, opts);
}
function assertImportDeclaration(node, opts) {
  assert("ImportDeclaration", node, opts);
}
function assertImportDefaultSpecifier(node, opts) {
  assert("ImportDefaultSpecifier", node, opts);
}
function assertImportNamespaceSpecifier(node, opts) {
  assert("ImportNamespaceSpecifier", node, opts);
}
function assertImportSpecifier(node, opts) {
  assert("ImportSpecifier", node, opts);
}
function assertMetaProperty(node, opts) {
  assert("MetaProperty", node, opts);
}
function assertClassMethod(node, opts) {
  assert("ClassMethod", node, opts);
}
function assertObjectPattern(node, opts) {
  assert("ObjectPattern", node, opts);
}
function assertSpreadElement(node, opts) {
  assert("SpreadElement", node, opts);
}
function assertSuper(node, opts) {
  assert("Super", node, opts);
}
function assertTaggedTemplateExpression(node, opts) {
  assert("TaggedTemplateExpression", node, opts);
}
function assertTemplateElement(node, opts) {
  assert("TemplateElement", node, opts);
}
function assertTemplateLiteral(node, opts) {
  assert("TemplateLiteral", node, opts);
}
function assertYieldExpression(node, opts) {
  assert("YieldExpression", node, opts);
}
function assertAwaitExpression(node, opts) {
  assert("AwaitExpression", node, opts);
}
function assertImport(node, opts) {
  assert("Import", node, opts);
}
function assertBigIntLiteral(node, opts) {
  assert("BigIntLiteral", node, opts);
}
function assertExportNamespaceSpecifier(node, opts) {
  assert("ExportNamespaceSpecifier", node, opts);
}
function assertOptionalMemberExpression(node, opts) {
  assert("OptionalMemberExpression", node, opts);
}
function assertOptionalCallExpression(node, opts) {
  assert("OptionalCallExpression", node, opts);
}
function assertClassProperty(node, opts) {
  assert("ClassProperty", node, opts);
}
function assertClassAccessorProperty(node, opts) {
  assert("ClassAccessorProperty", node, opts);
}
function assertClassPrivateProperty(node, opts) {
  assert("ClassPrivateProperty", node, opts);
}
function assertClassPrivateMethod(node, opts) {
  assert("ClassPrivateMethod", node, opts);
}
function assertPrivateName(node, opts) {
  assert("PrivateName", node, opts);
}
function assertStaticBlock(node, opts) {
  assert("StaticBlock", node, opts);
}
function assertAnyTypeAnnotation(node, opts) {
  assert("AnyTypeAnnotation", node, opts);
}
function assertArrayTypeAnnotation(node, opts) {
  assert("ArrayTypeAnnotation", node, opts);
}
function assertBooleanTypeAnnotation(node, opts) {
  assert("BooleanTypeAnnotation", node, opts);
}
function assertBooleanLiteralTypeAnnotation(node, opts) {
  assert("BooleanLiteralTypeAnnotation", node, opts);
}
function assertNullLiteralTypeAnnotation(node, opts) {
  assert("NullLiteralTypeAnnotation", node, opts);
}
function assertClassImplements(node, opts) {
  assert("ClassImplements", node, opts);
}
function assertDeclareClass(node, opts) {
  assert("DeclareClass", node, opts);
}
function assertDeclareFunction(node, opts) {
  assert("DeclareFunction", node, opts);
}
function assertDeclareInterface(node, opts) {
  assert("DeclareInterface", node, opts);
}
function assertDeclareModule(node, opts) {
  assert("DeclareModule", node, opts);
}
function assertDeclareModuleExports(node, opts) {
  assert("DeclareModuleExports", node, opts);
}
function assertDeclareTypeAlias(node, opts) {
  assert("DeclareTypeAlias", node, opts);
}
function assertDeclareOpaqueType(node, opts) {
  assert("DeclareOpaqueType", node, opts);
}
function assertDeclareVariable(node, opts) {
  assert("DeclareVariable", node, opts);
}
function assertDeclareExportDeclaration(node, opts) {
  assert("DeclareExportDeclaration", node, opts);
}
function assertDeclareExportAllDeclaration(node, opts) {
  assert("DeclareExportAllDeclaration", node, opts);
}
function assertDeclaredPredicate(node, opts) {
  assert("DeclaredPredicate", node, opts);
}
function assertExistsTypeAnnotation(node, opts) {
  assert("ExistsTypeAnnotation", node, opts);
}
function assertFunctionTypeAnnotation(node, opts) {
  assert("FunctionTypeAnnotation", node, opts);
}
function assertFunctionTypeParam(node, opts) {
  assert("FunctionTypeParam", node, opts);
}
function assertGenericTypeAnnotation(node, opts) {
  assert("GenericTypeAnnotation", node, opts);
}
function assertInferredPredicate(node, opts) {
  assert("InferredPredicate", node, opts);
}
function assertInterfaceExtends(node, opts) {
  assert("InterfaceExtends", node, opts);
}
function assertInterfaceDeclaration(node, opts) {
  assert("InterfaceDeclaration", node, opts);
}
function assertInterfaceTypeAnnotation(node, opts) {
  assert("InterfaceTypeAnnotation", node, opts);
}
function assertIntersectionTypeAnnotation(node, opts) {
  assert("IntersectionTypeAnnotation", node, opts);
}
function assertMixedTypeAnnotation(node, opts) {
  assert("MixedTypeAnnotation", node, opts);
}
function assertEmptyTypeAnnotation(node, opts) {
  assert("EmptyTypeAnnotation", node, opts);
}
function assertNullableTypeAnnotation(node, opts) {
  assert("NullableTypeAnnotation", node, opts);
}
function assertNumberLiteralTypeAnnotation(node, opts) {
  assert("NumberLiteralTypeAnnotation", node, opts);
}
function assertNumberTypeAnnotation(node, opts) {
  assert("NumberTypeAnnotation", node, opts);
}
function assertObjectTypeAnnotation(node, opts) {
  assert("ObjectTypeAnnotation", node, opts);
}
function assertObjectTypeInternalSlot(node, opts) {
  assert("ObjectTypeInternalSlot", node, opts);
}
function assertObjectTypeCallProperty(node, opts) {
  assert("ObjectTypeCallProperty", node, opts);
}
function assertObjectTypeIndexer(node, opts) {
  assert("ObjectTypeIndexer", node, opts);
}
function assertObjectTypeProperty(node, opts) {
  assert("ObjectTypeProperty", node, opts);
}
function assertObjectTypeSpreadProperty(node, opts) {
  assert("ObjectTypeSpreadProperty", node, opts);
}
function assertOpaqueType(node, opts) {
  assert("OpaqueType", node, opts);
}
function assertQualifiedTypeIdentifier(node, opts) {
  assert("QualifiedTypeIdentifier", node, opts);
}
function assertStringLiteralTypeAnnotation(node, opts) {
  assert("StringLiteralTypeAnnotation", node, opts);
}
function assertStringTypeAnnotation(node, opts) {
  assert("StringTypeAnnotation", node, opts);
}
function assertSymbolTypeAnnotation(node, opts) {
  assert("SymbolTypeAnnotation", node, opts);
}
function assertThisTypeAnnotation(node, opts) {
  assert("ThisTypeAnnotation", node, opts);
}
function assertTupleTypeAnnotation(node, opts) {
  assert("TupleTypeAnnotation", node, opts);
}
function assertTypeofTypeAnnotation(node, opts) {
  assert("TypeofTypeAnnotation", node, opts);
}
function assertTypeAlias(node, opts) {
  assert("TypeAlias", node, opts);
}
function assertTypeAnnotation(node, opts) {
  assert("TypeAnnotation", node, opts);
}
function assertTypeCastExpression(node, opts) {
  assert("TypeCastExpression", node, opts);
}
function assertTypeParameter(node, opts) {
  assert("TypeParameter", node, opts);
}
function assertTypeParameterDeclaration(node, opts) {
  assert("TypeParameterDeclaration", node, opts);
}
function assertTypeParameterInstantiation(node, opts) {
  assert("TypeParameterInstantiation", node, opts);
}
function assertUnionTypeAnnotation(node, opts) {
  assert("UnionTypeAnnotation", node, opts);
}
function assertVariance(node, opts) {
  assert("Variance", node, opts);
}
function assertVoidTypeAnnotation(node, opts) {
  assert("VoidTypeAnnotation", node, opts);
}
function assertEnumDeclaration(node, opts) {
  assert("EnumDeclaration", node, opts);
}
function assertEnumBooleanBody(node, opts) {
  assert("EnumBooleanBody", node, opts);
}
function assertEnumNumberBody(node, opts) {
  assert("EnumNumberBody", node, opts);
}
function assertEnumStringBody(node, opts) {
  assert("EnumStringBody", node, opts);
}
function assertEnumSymbolBody(node, opts) {
  assert("EnumSymbolBody", node, opts);
}
function assertEnumBooleanMember(node, opts) {
  assert("EnumBooleanMember", node, opts);
}
function assertEnumNumberMember(node, opts) {
  assert("EnumNumberMember", node, opts);
}
function assertEnumStringMember(node, opts) {
  assert("EnumStringMember", node, opts);
}
function assertEnumDefaultedMember(node, opts) {
  assert("EnumDefaultedMember", node, opts);
}
function assertIndexedAccessType(node, opts) {
  assert("IndexedAccessType", node, opts);
}
function assertOptionalIndexedAccessType(node, opts) {
  assert("OptionalIndexedAccessType", node, opts);
}
function assertJSXAttribute(node, opts) {
  assert("JSXAttribute", node, opts);
}
function assertJSXClosingElement(node, opts) {
  assert("JSXClosingElement", node, opts);
}
function assertJSXElement(node, opts) {
  assert("JSXElement", node, opts);
}
function assertJSXEmptyExpression(node, opts) {
  assert("JSXEmptyExpression", node, opts);
}
function assertJSXExpressionContainer(node, opts) {
  assert("JSXExpressionContainer", node, opts);
}
function assertJSXSpreadChild(node, opts) {
  assert("JSXSpreadChild", node, opts);
}
function assertJSXIdentifier(node, opts) {
  assert("JSXIdentifier", node, opts);
}
function assertJSXMemberExpression(node, opts) {
  assert("JSXMemberExpression", node, opts);
}
function assertJSXNamespacedName(node, opts) {
  assert("JSXNamespacedName", node, opts);
}
function assertJSXOpeningElement(node, opts) {
  assert("JSXOpeningElement", node, opts);
}
function assertJSXSpreadAttribute(node, opts) {
  assert("JSXSpreadAttribute", node, opts);
}
function assertJSXText(node, opts) {
  assert("JSXText", node, opts);
}
function assertJSXFragment(node, opts) {
  assert("JSXFragment", node, opts);
}
function assertJSXOpeningFragment(node, opts) {
  assert("JSXOpeningFragment", node, opts);
}
function assertJSXClosingFragment(node, opts) {
  assert("JSXClosingFragment", node, opts);
}
function assertNoop(node, opts) {
  assert("Noop", node, opts);
}
function assertPlaceholder(node, opts) {
  assert("Placeholder", node, opts);
}
function assertV8IntrinsicIdentifier(node, opts) {
  assert("V8IntrinsicIdentifier", node, opts);
}
function assertArgumentPlaceholder(node, opts) {
  assert("ArgumentPlaceholder", node, opts);
}
function assertBindExpression(node, opts) {
  assert("BindExpression", node, opts);
}
function assertImportAttribute(node, opts) {
  assert("ImportAttribute", node, opts);
}
function assertDecorator(node, opts) {
  assert("Decorator", node, opts);
}
function assertDoExpression(node, opts) {
  assert("DoExpression", node, opts);
}
function assertExportDefaultSpecifier(node, opts) {
  assert("ExportDefaultSpecifier", node, opts);
}
function assertRecordExpression(node, opts) {
  assert("RecordExpression", node, opts);
}
function assertTupleExpression(node, opts) {
  assert("TupleExpression", node, opts);
}
function assertDecimalLiteral(node, opts) {
  assert("DecimalLiteral", node, opts);
}
function assertModuleExpression(node, opts) {
  assert("ModuleExpression", node, opts);
}
function assertTopicReference(node, opts) {
  assert("TopicReference", node, opts);
}
function assertPipelineTopicExpression(node, opts) {
  assert("PipelineTopicExpression", node, opts);
}
function assertPipelineBareFunction(node, opts) {
  assert("PipelineBareFunction", node, opts);
}
function assertPipelinePrimaryTopicReference(node, opts) {
  assert("PipelinePrimaryTopicReference", node, opts);
}
function assertTSParameterProperty(node, opts) {
  assert("TSParameterProperty", node, opts);
}
function assertTSDeclareFunction(node, opts) {
  assert("TSDeclareFunction", node, opts);
}
function assertTSDeclareMethod(node, opts) {
  assert("TSDeclareMethod", node, opts);
}
function assertTSQualifiedName(node, opts) {
  assert("TSQualifiedName", node, opts);
}
function assertTSCallSignatureDeclaration(node, opts) {
  assert("TSCallSignatureDeclaration", node, opts);
}
function assertTSConstructSignatureDeclaration(node, opts) {
  assert("TSConstructSignatureDeclaration", node, opts);
}
function assertTSPropertySignature(node, opts) {
  assert("TSPropertySignature", node, opts);
}
function assertTSMethodSignature(node, opts) {
  assert("TSMethodSignature", node, opts);
}
function assertTSIndexSignature(node, opts) {
  assert("TSIndexSignature", node, opts);
}
function assertTSAnyKeyword(node, opts) {
  assert("TSAnyKeyword", node, opts);
}
function assertTSBooleanKeyword(node, opts) {
  assert("TSBooleanKeyword", node, opts);
}
function assertTSBigIntKeyword(node, opts) {
  assert("TSBigIntKeyword", node, opts);
}
function assertTSIntrinsicKeyword(node, opts) {
  assert("TSIntrinsicKeyword", node, opts);
}
function assertTSNeverKeyword(node, opts) {
  assert("TSNeverKeyword", node, opts);
}
function assertTSNullKeyword(node, opts) {
  assert("TSNullKeyword", node, opts);
}
function assertTSNumberKeyword(node, opts) {
  assert("TSNumberKeyword", node, opts);
}
function assertTSObjectKeyword(node, opts) {
  assert("TSObjectKeyword", node, opts);
}
function assertTSStringKeyword(node, opts) {
  assert("TSStringKeyword", node, opts);
}
function assertTSSymbolKeyword(node, opts) {
  assert("TSSymbolKeyword", node, opts);
}
function assertTSUndefinedKeyword(node, opts) {
  assert("TSUndefinedKeyword", node, opts);
}
function assertTSUnknownKeyword(node, opts) {
  assert("TSUnknownKeyword", node, opts);
}
function assertTSVoidKeyword(node, opts) {
  assert("TSVoidKeyword", node, opts);
}
function assertTSThisType(node, opts) {
  assert("TSThisType", node, opts);
}
function assertTSFunctionType(node, opts) {
  assert("TSFunctionType", node, opts);
}
function assertTSConstructorType(node, opts) {
  assert("TSConstructorType", node, opts);
}
function assertTSTypeReference(node, opts) {
  assert("TSTypeReference", node, opts);
}
function assertTSTypePredicate(node, opts) {
  assert("TSTypePredicate", node, opts);
}
function assertTSTypeQuery(node, opts) {
  assert("TSTypeQuery", node, opts);
}
function assertTSTypeLiteral(node, opts) {
  assert("TSTypeLiteral", node, opts);
}
function assertTSArrayType(node, opts) {
  assert("TSArrayType", node, opts);
}
function assertTSTupleType(node, opts) {
  assert("TSTupleType", node, opts);
}
function assertTSOptionalType(node, opts) {
  assert("TSOptionalType", node, opts);
}
function assertTSRestType(node, opts) {
  assert("TSRestType", node, opts);
}
function assertTSNamedTupleMember(node, opts) {
  assert("TSNamedTupleMember", node, opts);
}
function assertTSUnionType(node, opts) {
  assert("TSUnionType", node, opts);
}
function assertTSIntersectionType(node, opts) {
  assert("TSIntersectionType", node, opts);
}
function assertTSConditionalType(node, opts) {
  assert("TSConditionalType", node, opts);
}
function assertTSInferType(node, opts) {
  assert("TSInferType", node, opts);
}
function assertTSParenthesizedType(node, opts) {
  assert("TSParenthesizedType", node, opts);
}
function assertTSTypeOperator(node, opts) {
  assert("TSTypeOperator", node, opts);
}
function assertTSIndexedAccessType(node, opts) {
  assert("TSIndexedAccessType", node, opts);
}
function assertTSMappedType(node, opts) {
  assert("TSMappedType", node, opts);
}
function assertTSLiteralType(node, opts) {
  assert("TSLiteralType", node, opts);
}
function assertTSExpressionWithTypeArguments(node, opts) {
  assert("TSExpressionWithTypeArguments", node, opts);
}
function assertTSInterfaceDeclaration(node, opts) {
  assert("TSInterfaceDeclaration", node, opts);
}
function assertTSInterfaceBody(node, opts) {
  assert("TSInterfaceBody", node, opts);
}
function assertTSTypeAliasDeclaration(node, opts) {
  assert("TSTypeAliasDeclaration", node, opts);
}
function assertTSInstantiationExpression(node, opts) {
  assert("TSInstantiationExpression", node, opts);
}
function assertTSAsExpression(node, opts) {
  assert("TSAsExpression", node, opts);
}
function assertTSSatisfiesExpression(node, opts) {
  assert("TSSatisfiesExpression", node, opts);
}
function assertTSTypeAssertion(node, opts) {
  assert("TSTypeAssertion", node, opts);
}
function assertTSEnumDeclaration(node, opts) {
  assert("TSEnumDeclaration", node, opts);
}
function assertTSEnumMember(node, opts) {
  assert("TSEnumMember", node, opts);
}
function assertTSModuleDeclaration(node, opts) {
  assert("TSModuleDeclaration", node, opts);
}
function assertTSModuleBlock(node, opts) {
  assert("TSModuleBlock", node, opts);
}
function assertTSImportType(node, opts) {
  assert("TSImportType", node, opts);
}
function assertTSImportEqualsDeclaration(node, opts) {
  assert("TSImportEqualsDeclaration", node, opts);
}
function assertTSExternalModuleReference(node, opts) {
  assert("TSExternalModuleReference", node, opts);
}
function assertTSNonNullExpression(node, opts) {
  assert("TSNonNullExpression", node, opts);
}
function assertTSExportAssignment(node, opts) {
  assert("TSExportAssignment", node, opts);
}
function assertTSNamespaceExportDeclaration(node, opts) {
  assert("TSNamespaceExportDeclaration", node, opts);
}
function assertTSTypeAnnotation(node, opts) {
  assert("TSTypeAnnotation", node, opts);
}
function assertTSTypeParameterInstantiation(node, opts) {
  assert("TSTypeParameterInstantiation", node, opts);
}
function assertTSTypeParameterDeclaration(node, opts) {
  assert("TSTypeParameterDeclaration", node, opts);
}
function assertTSTypeParameter(node, opts) {
  assert("TSTypeParameter", node, opts);
}
function assertStandardized(node, opts) {
  assert("Standardized", node, opts);
}
function assertExpression(node, opts) {
  assert("Expression", node, opts);
}
function assertBinary(node, opts) {
  assert("Binary", node, opts);
}
function assertScopable(node, opts) {
  assert("Scopable", node, opts);
}
function assertBlockParent(node, opts) {
  assert("BlockParent", node, opts);
}
function assertBlock(node, opts) {
  assert("Block", node, opts);
}
function assertStatement(node, opts) {
  assert("Statement", node, opts);
}
function assertTerminatorless(node, opts) {
  assert("Terminatorless", node, opts);
}
function assertCompletionStatement(node, opts) {
  assert("CompletionStatement", node, opts);
}
function assertConditional(node, opts) {
  assert("Conditional", node, opts);
}
function assertLoop(node, opts) {
  assert("Loop", node, opts);
}
function assertWhile(node, opts) {
  assert("While", node, opts);
}
function assertExpressionWrapper(node, opts) {
  assert("ExpressionWrapper", node, opts);
}
function assertFor(node, opts) {
  assert("For", node, opts);
}
function assertForXStatement(node, opts) {
  assert("ForXStatement", node, opts);
}
function assertFunction(node, opts) {
  assert("Function", node, opts);
}
function assertFunctionParent(node, opts) {
  assert("FunctionParent", node, opts);
}
function assertPureish(node, opts) {
  assert("Pureish", node, opts);
}
function assertDeclaration(node, opts) {
  assert("Declaration", node, opts);
}
function assertPatternLike(node, opts) {
  assert("PatternLike", node, opts);
}
function assertLVal(node, opts) {
  assert("LVal", node, opts);
}
function assertTSEntityName(node, opts) {
  assert("TSEntityName", node, opts);
}
function assertLiteral(node, opts) {
  assert("Literal", node, opts);
}
function assertImmutable(node, opts) {
  assert("Immutable", node, opts);
}
function assertUserWhitespacable(node, opts) {
  assert("UserWhitespacable", node, opts);
}
function assertMethod(node, opts) {
  assert("Method", node, opts);
}
function assertObjectMember(node, opts) {
  assert("ObjectMember", node, opts);
}
function assertProperty(node, opts) {
  assert("Property", node, opts);
}
function assertUnaryLike(node, opts) {
  assert("UnaryLike", node, opts);
}
function assertPattern(node, opts) {
  assert("Pattern", node, opts);
}
function assertClass(node, opts) {
  assert("Class", node, opts);
}
function assertImportOrExportDeclaration(node, opts) {
  assert("ImportOrExportDeclaration", node, opts);
}
function assertExportDeclaration(node, opts) {
  assert("ExportDeclaration", node, opts);
}
function assertModuleSpecifier(node, opts) {
  assert("ModuleSpecifier", node, opts);
}
function assertAccessor(node, opts) {
  assert("Accessor", node, opts);
}
function assertPrivate(node, opts) {
  assert("Private", node, opts);
}
function assertFlow(node, opts) {
  assert("Flow", node, opts);
}
function assertFlowType(node, opts) {
  assert("FlowType", node, opts);
}
function assertFlowBaseAnnotation(node, opts) {
  assert("FlowBaseAnnotation", node, opts);
}
function assertFlowDeclaration(node, opts) {
  assert("FlowDeclaration", node, opts);
}
function assertFlowPredicate(node, opts) {
  assert("FlowPredicate", node, opts);
}
function assertEnumBody(node, opts) {
  assert("EnumBody", node, opts);
}
function assertEnumMember(node, opts) {
  assert("EnumMember", node, opts);
}
function assertJSX(node, opts) {
  assert("JSX", node, opts);
}
function assertMiscellaneous(node, opts) {
  assert("Miscellaneous", node, opts);
}
function assertTypeScript(node, opts) {
  assert("TypeScript", node, opts);
}
function assertTSTypeElement(node, opts) {
  assert("TSTypeElement", node, opts);
}
function assertTSType(node, opts) {
  assert("TSType", node, opts);
}
function assertTSBaseType(node, opts) {
  assert("TSBaseType", node, opts);
}
function assertNumberLiteral(node, opts) {
  deprecationWarning("assertNumberLiteral", "assertNumericLiteral");
  assert("NumberLiteral", node, opts);
}
function assertRegexLiteral(node, opts) {
  deprecationWarning("assertRegexLiteral", "assertRegExpLiteral");
  assert("RegexLiteral", node, opts);
}
function assertRestProperty(node, opts) {
  deprecationWarning("assertRestProperty", "assertRestElement");
  assert("RestProperty", node, opts);
}
function assertSpreadProperty(node, opts) {
  deprecationWarning("assertSpreadProperty", "assertSpreadElement");
  assert("SpreadProperty", node, opts);
}
function assertModuleDeclaration(node, opts) {
  deprecationWarning("assertModuleDeclaration", "assertImportOrExportDeclaration");
  assert("ModuleDeclaration", node, opts);
}

function createTypeAnnotationBasedOnTypeof(type) {
  switch (type) {
    case "string":
      return stringTypeAnnotation();
    case "number":
      return numberTypeAnnotation();
    case "undefined":
      return voidTypeAnnotation();
    case "boolean":
      return booleanTypeAnnotation();
    case "function":
      return genericTypeAnnotation(identifier("Function"));
    case "object":
      return genericTypeAnnotation(identifier("Object"));
    case "symbol":
      return genericTypeAnnotation(identifier("Symbol"));
    case "bigint":
      return anyTypeAnnotation();
  }
  throw new Error("Invalid typeof value: " + type);
}

function getQualifiedName$1(node) {
  return isIdentifier(node) ? node.name : `${node.id.name}.${getQualifiedName$1(node.qualification)}`;
}
function removeTypeDuplicates$1(nodesIn) {
  const nodes = Array.from(nodesIn),
    generics = new Map(),
    bases = new Map(),
    typeGroups = new Set(),
    types = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || types.indexOf(node) >= 0) continue;

    if (isAnyTypeAnnotation(node)) return [node];

    if (isFlowBaseAnnotation(node)) bases.set(node.type, node);
    else if (isUnionTypeAnnotation(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
    } else if (isGenericTypeAnnotation(node)) {
      const name = getQualifiedName$1(node.id);
      if (generics.has(name)) {
        let existing = generics.get(name);
        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params.push(...node.typeParameters.params);
            existing.typeParameters.params = removeTypeDuplicates$1(existing.typeParameters.params);
          }
        } else existing = node.typeParameters;
      } else generics.set(name, node);
    } else types.push(node);
  }
  for (const [, baseType] of bases) types.push(baseType);

  for (const [, genericName] of generics) types.push(genericName);

  return types;
}

function createFlowUnionType(types) {
  const flattened = removeTypeDuplicates$1(types);
  return flattened.length === 1 ? flattened[0] : unionTypeAnnotation(flattened);
}

function getQualifiedName(node) {
  return isIdentifier(node) ? node.name : `${node.right.name}.${getQualifiedName(node.left)}`;
}
function removeTypeDuplicates(nodesIn) {
  const nodes = Array.from(nodesIn),
    generics = new Map(),
    bases = new Map(),
    typeGroups = new Set(),
    types = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || types.indexOf(node) >= 0) continue;

    if (isTSAnyKeyword(node)) return [node];

    if (isTSBaseType(node)) bases.set(node.type, node);
    else if (isTSUnionType(node)) {
      if (!typeGroups.has(node.types)) {
        nodes.push(...node.types);
        typeGroups.add(node.types);
      }
    } else if (isTSTypeReference(node) && node.typeParameters) {
      const name = getQualifiedName(node.typeName);
      if (generics.has(name)) {
        let existing = generics.get(name);
        if (existing.typeParameters) {
          if (node.typeParameters) {
            existing.typeParameters.params.push(...node.typeParameters.params);
            existing.typeParameters.params = removeTypeDuplicates(existing.typeParameters.params);
          }
        } else existing = node.typeParameters;
      } else generics.set(name, node);
    } else types.push(node);
  }
  for (const [, baseType] of bases) types.push(baseType);

  for (const [, genericName] of generics) types.push(genericName);

  return types;
}

function createTSUnionType(typeAnnotations) {
  const flattened = removeTypeDuplicates(
    typeAnnotations.map(type => (isTSTypeAnnotation(type) ? type.typeAnnotation : type))
  );
  return flattened.length === 1 ? flattened[0] : tsUnionType(flattened);
}

const has = Function.call.bind(Object.prototype.hasOwnProperty);
function cloneIfNode(obj, deep, withoutLoc, commentsCache) {
  return obj && typeof obj.type == "string" ? cloneNodeInternal(obj, deep, withoutLoc, commentsCache) : obj;
}
function cloneIfNodeOrArray(obj, deep, withoutLoc, commentsCache) {
  return Array.isArray(obj)
    ? obj.map(node => cloneIfNode(node, deep, withoutLoc, commentsCache))
    : cloneIfNode(obj, deep, withoutLoc, commentsCache);
}
function cloneNode(node, deep = true, withoutLoc = false) {
  return cloneNodeInternal(node, deep, withoutLoc, new Map());
}
function cloneNodeInternal(node, deep = true, withoutLoc = false, commentsCache) {
  if (!node) return node;
  const { type } = node,
    newNode = { type: node.type };
  if (isIdentifier(node)) {
    newNode.name = node.name;
    if (has(node, "optional") && typeof node.optional == "boolean") newNode.optional = node.optional;

    if (has(node, "typeAnnotation"))
      newNode.typeAnnotation = deep
        ? cloneIfNodeOrArray(node.typeAnnotation, true, withoutLoc, commentsCache)
        : node.typeAnnotation;
  } else {
    if (!has(NODE_FIELDS, type)) throw new Error(`Unknown node type: "${type}"`);

    for (const field of Object.keys(NODE_FIELDS[type]))
      if (has(node, field))
        newNode[field] = deep
          ? isFile(node) && field === "comments"
            ? maybeCloneComments(node.comments, deep, withoutLoc, commentsCache)
            : cloneIfNodeOrArray(node[field], true, withoutLoc, commentsCache)
          : node[field];
  }
  if (has(node, "loc")) newNode.loc = withoutLoc ? null : node.loc;

  if (has(node, "leadingComments"))
    newNode.leadingComments = maybeCloneComments(node.leadingComments, deep, withoutLoc, commentsCache);
  if (has(node, "innerComments"))
    newNode.innerComments = maybeCloneComments(node.innerComments, deep, withoutLoc, commentsCache);
  if (has(node, "trailingComments"))
    newNode.trailingComments = maybeCloneComments(node.trailingComments, deep, withoutLoc, commentsCache);

  if (has(node, "extra")) newNode.extra = Object.assign({}, node.extra);

  return newNode;
}
function maybeCloneComments(comments, deep, withoutLoc, commentsCache) {
  if (!comments || !deep) return comments;

  return comments.map(comment => {
    const cache = commentsCache.get(comment);
    if (cache) return cache;
    const { type, value, loc } = comment,
      ret = { type, value, loc };
    if (withoutLoc) ret.loc = null;

    commentsCache.set(comment, ret);
    return ret;
  });
}

function clone(node) {
  return cloneNode(node, false);
}

function cloneDeep(node) {
  return cloneNode(node);
}

function cloneDeepWithoutLoc(node) {
  return cloneNode(node, true, true);
}

function cloneWithoutLoc(node) {
  return cloneNode(node, false, true);
}

function addComments(node, type, comments) {
  if (!comments || !node) return node;
  const key = type + "Comments";
  node[key]
    ? type === "leading"
      ? (node[key] = comments.concat(node[key]))
      : node[key].push(...comments)
    : (node[key] = comments);

  return node;
}

function addComment(node, type, content, line) {
  return addComments(node, type, [{ type: line ? "CommentLine" : "CommentBlock", value: content }]);
}

function inherit(key, child, parent) {
  if (child && parent) child[key] = Array.from(new Set([].concat(child[key], parent[key]).filter(Boolean)));
}

function inheritInnerComments(child, parent) {
  inherit("innerComments", child, parent);
}

function inheritLeadingComments(child, parent) {
  inherit("leadingComments", child, parent);
}

function inheritTrailingComments(child, parent) {
  inherit("trailingComments", child, parent);
}

function inheritsComments(child, parent) {
  inheritTrailingComments(child, parent);
  inheritLeadingComments(child, parent);
  inheritInnerComments(child, parent);
  return child;
}

function removeComments(node) {
  COMMENT_KEYS.forEach(key => {
    node[key] = null;
  });
  return node;
}

const STANDARDIZED_TYPES = FLIPPED_ALIAS_KEYS.Standardized,
  EXPRESSION_TYPES = FLIPPED_ALIAS_KEYS.Expression,
  BINARY_TYPES = FLIPPED_ALIAS_KEYS.Binary,
  SCOPABLE_TYPES = FLIPPED_ALIAS_KEYS.Scopable,
  BLOCKPARENT_TYPES = FLIPPED_ALIAS_KEYS.BlockParent,
  BLOCK_TYPES = FLIPPED_ALIAS_KEYS.Block,
  STATEMENT_TYPES = FLIPPED_ALIAS_KEYS.Statement,
  TERMINATORLESS_TYPES = FLIPPED_ALIAS_KEYS.Terminatorless,
  COMPLETIONSTATEMENT_TYPES = FLIPPED_ALIAS_KEYS.CompletionStatement,
  CONDITIONAL_TYPES = FLIPPED_ALIAS_KEYS.Conditional,
  LOOP_TYPES = FLIPPED_ALIAS_KEYS.Loop,
  WHILE_TYPES = FLIPPED_ALIAS_KEYS.While,
  EXPRESSIONWRAPPER_TYPES = FLIPPED_ALIAS_KEYS.ExpressionWrapper,
  FOR_TYPES = FLIPPED_ALIAS_KEYS.For,
  FORXSTATEMENT_TYPES = FLIPPED_ALIAS_KEYS.ForXStatement,
  FUNCTION_TYPES = FLIPPED_ALIAS_KEYS.Function,
  FUNCTIONPARENT_TYPES = FLIPPED_ALIAS_KEYS.FunctionParent,
  PUREISH_TYPES = FLIPPED_ALIAS_KEYS.Pureish,
  DECLARATION_TYPES = FLIPPED_ALIAS_KEYS.Declaration,
  PATTERNLIKE_TYPES = FLIPPED_ALIAS_KEYS.PatternLike,
  LVAL_TYPES = FLIPPED_ALIAS_KEYS.LVal,
  TSENTITYNAME_TYPES = FLIPPED_ALIAS_KEYS.TSEntityName,
  LITERAL_TYPES = FLIPPED_ALIAS_KEYS.Literal,
  IMMUTABLE_TYPES = FLIPPED_ALIAS_KEYS.Immutable,
  USERWHITESPACABLE_TYPES = FLIPPED_ALIAS_KEYS.UserWhitespacable,
  METHOD_TYPES = FLIPPED_ALIAS_KEYS.Method,
  OBJECTMEMBER_TYPES = FLIPPED_ALIAS_KEYS.ObjectMember,
  PROPERTY_TYPES = FLIPPED_ALIAS_KEYS.Property,
  UNARYLIKE_TYPES = FLIPPED_ALIAS_KEYS.UnaryLike,
  PATTERN_TYPES = FLIPPED_ALIAS_KEYS.Pattern,
  CLASS_TYPES = FLIPPED_ALIAS_KEYS.Class,
  IMPORTOREXPORTDECLARATION_TYPES = FLIPPED_ALIAS_KEYS.ImportOrExportDeclaration,
  EXPORTDECLARATION_TYPES = FLIPPED_ALIAS_KEYS.ExportDeclaration,
  MODULESPECIFIER_TYPES = FLIPPED_ALIAS_KEYS.ModuleSpecifier,
  ACCESSOR_TYPES = FLIPPED_ALIAS_KEYS.Accessor,
  PRIVATE_TYPES = FLIPPED_ALIAS_KEYS.Private,
  FLOW_TYPES = FLIPPED_ALIAS_KEYS.Flow,
  FLOWTYPE_TYPES = FLIPPED_ALIAS_KEYS.FlowType,
  FLOWBASEANNOTATION_TYPES = FLIPPED_ALIAS_KEYS.FlowBaseAnnotation,
  FLOWDECLARATION_TYPES = FLIPPED_ALIAS_KEYS.FlowDeclaration,
  FLOWPREDICATE_TYPES = FLIPPED_ALIAS_KEYS.FlowPredicate,
  ENUMBODY_TYPES = FLIPPED_ALIAS_KEYS.EnumBody,
  ENUMMEMBER_TYPES = FLIPPED_ALIAS_KEYS.EnumMember,
  JSX_TYPES = FLIPPED_ALIAS_KEYS.JSX,
  MISCELLANEOUS_TYPES = FLIPPED_ALIAS_KEYS.Miscellaneous,
  TYPESCRIPT_TYPES = FLIPPED_ALIAS_KEYS.TypeScript,
  TSTYPEELEMENT_TYPES = FLIPPED_ALIAS_KEYS.TSTypeElement,
  TSTYPE_TYPES = FLIPPED_ALIAS_KEYS.TSType,
  TSBASETYPE_TYPES = FLIPPED_ALIAS_KEYS.TSBaseType,
  MODULEDECLARATION_TYPES = IMPORTOREXPORTDECLARATION_TYPES;

function toBlock(node, parent) {
  if (isBlockStatement(node)) return node;

  let blockNodes = [];
  if (isEmptyStatement(node)) blockNodes = [];
  else {
    isStatement(node) || (node = isFunction(parent) ? returnStatement(node) : expressionStatement(node));

    blockNodes = [node];
  }
  return blockStatement(blockNodes);
}

function ensureBlock(node, key = "body") {
  const result = toBlock(node[key], node);
  node[key] = result;
  return result;
}

function toIdentifier(input) {
  input += "";
  let name = "";
  for (const c of input) name += common.isIdentifierChar(c.codePointAt(0)) ? c : "-";

  name = name.replace(/^[-0-9]+/, "");
  name = name.replace(/[-\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : "";
  });
  isValidIdentifier(name) || (name = "_" + name);

  return name || "_";
}

function toBindingIdentifierName(name) {
  if ((name = toIdentifier(name)) === "eval" || name === "arguments") name = "_" + name;
  return name;
}

function toComputedKey(node, key = node.key || node.property) {
  if (!node.computed && isIdentifier(key)) key = stringLiteral(key.name);
  return key;
}

function toExpression(node) {
  if (isExpressionStatement(node)) node = node.expression;
  if (isExpression(node)) return node;

  if (isClass(node)) node.type = "ClassExpression";
  else if (isFunction(node)) node.type = "FunctionExpression";

  if (!isExpression(node)) throw new Error(`cannot turn ${node.type} to an expression`);

  return node;
}

function traverseFast(node, enter, opts) {
  if (!node) return;
  const keys = VISITOR_KEYS[node.type];
  if (!keys) return;
  enter(node, (opts = opts || {}));
  for (const key of keys) {
    const subNode = node[key];
    if (Array.isArray(subNode)) for (const node of subNode) traverseFast(node, enter, opts);
    else traverseFast(subNode, enter, opts);
  }
}

const CLEAR_KEYS = ["tokens", "start", "end", "loc", "raw", "rawValue"],
  CLEAR_KEYS_PLUS_COMMENTS = [...COMMENT_KEYS, "comments", ...CLEAR_KEYS];
function removeProperties(node, opts = {}) {
  const map = opts.preserveComments ? CLEAR_KEYS : CLEAR_KEYS_PLUS_COMMENTS;
  for (const key of map) if (node[key] != null) node[key] = void 0;

  for (const key of Object.keys(node)) if (key[0] === "_" && node[key] != null) node[key] = void 0;

  const symbols = Object.getOwnPropertySymbols(node);
  for (const sym of symbols) node[sym] = null;
}

function removePropertiesDeep(tree, opts) {
  traverseFast(tree, removeProperties, opts);
  return tree;
}

function toKeyAlias(node, key = node.key) {
  let alias;
  if (node.kind === "method") return toKeyAlias.increment() + "";
  alias = isIdentifier(key)
    ? key.name
    : isStringLiteral(key)
    ? JSON.stringify(key.value)
    : JSON.stringify(removePropertiesDeep(cloneNode(key)));

  if (node.computed) alias = `[${alias}]`;
  if (node.static) alias = "static:" + alias;

  return alias;
}
toKeyAlias.uid = 0;
toKeyAlias.increment = function () {
  return toKeyAlias.uid >= Number.MAX_SAFE_INTEGER ? (toKeyAlias.uid = 0) : toKeyAlias.uid++;
};

function getBindingIdentifiers(node, duplicates, outerOnly) {
  const search = [].concat(node),
    ids = Object.create(null);
  while (search.length) {
    const id = search.shift();
    if (!id) continue;
    const keys = getBindingIdentifiers.keys[id.type];
    if (isIdentifier(id)) duplicates ? (ids[id.name] = ids[id.name] || []).push(id) : (ids[id.name] = id);
    else if (!isExportDeclaration(id) || isExportAllDeclaration(id)) {
      if (outerOnly) {
        if (isFunctionDeclaration(id)) {
          search.push(id.id);
          continue;
        }
        if (isFunctionExpression(id)) continue;
      }
      if (keys)
        for (let i = 0; i < keys.length; i++) {
          const nodes = id[keys[i]];
          if (nodes) Array.isArray(nodes) ? search.push(...nodes) : search.push(nodes);
        }
    } else isDeclaration(id.declaration) && search.push(id.declaration);
  }
  return ids;
}
getBindingIdentifiers.keys = {
  DeclareClass: ["id"],
  DeclareFunction: ["id"],
  DeclareModule: ["id"],
  DeclareVariable: ["id"],
  DeclareInterface: ["id"],
  DeclareTypeAlias: ["id"],
  DeclareOpaqueType: ["id"],
  InterfaceDeclaration: ["id"],
  TypeAlias: ["id"],
  OpaqueType: ["id"],
  CatchClause: ["param"],
  LabeledStatement: ["label"],
  UnaryExpression: ["argument"],
  AssignmentExpression: ["left"],
  ImportSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ImportDefaultSpecifier: ["local"],
  ImportDeclaration: ["specifiers"],
  ExportSpecifier: ["exported"],
  ExportNamespaceSpecifier: ["exported"],
  ExportDefaultSpecifier: ["exported"],
  FunctionDeclaration: ["id", "params"],
  FunctionExpression: ["id", "params"],
  ArrowFunctionExpression: ["params"],
  ObjectMethod: ["params"],
  ClassMethod: ["params"],
  ClassPrivateMethod: ["params"],
  ForInStatement: ["left"],
  ForOfStatement: ["left"],
  ClassDeclaration: ["id"],
  ClassExpression: ["id"],
  RestElement: ["argument"],
  UpdateExpression: ["argument"],
  ObjectProperty: ["value"],
  AssignmentPattern: ["left"],
  ArrayPattern: ["elements"],
  ObjectPattern: ["properties"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id"]
};

function gatherSequenceExpressions(nodes, scope, declars) {
  const exprs = [];
  let ensureLastUndefined = true;
  for (const node of nodes) {
    isEmptyStatement(node) || (ensureLastUndefined = false);

    if (isExpression(node)) exprs.push(node);
    else if (isExpressionStatement(node)) exprs.push(node.expression);
    else if (isVariableDeclaration(node)) {
      if (node.kind !== "var") return;
      for (const declar of node.declarations) {
        const bindings = getBindingIdentifiers(declar);
        for (const key of Object.keys(bindings)) declars.push({ kind: node.kind, id: cloneNode(bindings[key]) });

        declar.init && exprs.push(assignmentExpression("=", declar.id, declar.init));
      }
      ensureLastUndefined = true;
    } else if (isIfStatement(node)) {
      const consequent = node.consequent
        ? gatherSequenceExpressions([node.consequent], scope, declars)
        : scope.buildUndefinedNode();
      const alternate = node.alternate
        ? gatherSequenceExpressions([node.alternate], scope, declars)
        : scope.buildUndefinedNode();
      if (!consequent || !alternate) return;
      exprs.push(conditionalExpression(node.test, consequent, alternate));
    } else if (isBlockStatement(node)) {
      const body = gatherSequenceExpressions(node.body, scope, declars);
      if (!body) return;
      exprs.push(body);
    } else {
      if (!isEmptyStatement(node)) return;
      if (nodes.indexOf(node) === 0) ensureLastUndefined = true;
    }
  }
  ensureLastUndefined && exprs.push(scope.buildUndefinedNode());

  return exprs.length === 1 ? exprs[0] : sequenceExpression(exprs);
}

function toSequenceExpression(nodes, scope) {
  if (nodes == null || !nodes.length) return;
  const declars = [],
    result = gatherSequenceExpressions(nodes, scope, declars);
  if (!result) return;
  for (const declar of declars) scope.push(declar);

  return result;
}

function toStatement(node, ignore) {
  if (isStatement(node)) return node;

  let newType,
    mustHaveId = false;
  if (isClass(node)) {
    mustHaveId = true;
    newType = "ClassDeclaration";
  } else if (isFunction(node)) {
    mustHaveId = true;
    newType = "FunctionDeclaration";
  } else if (isAssignmentExpression(node)) return expressionStatement(node);

  if (mustHaveId && !node.id) newType = false;

  if (!newType) {
    if (ignore) return false;

    throw new Error(`cannot turn ${node.type} to a statement`);
  }
  node.type = newType;
  return node;
}

const objectToString = Function.call.bind(Object.prototype.toString);
function isRegExp(value) {
  return objectToString(value) === "[object RegExp]";
}
function isPlainObject(value) {
  if (typeof value != "object" || value === null || Object.prototype.toString.call(value) !== "[object Object]")
    return false;

  const proto = Object.getPrototypeOf(value);
  return proto === null || Object.getPrototypeOf(proto) === null;
}
function valueToNode(value) {
  if (value === void 0) return identifier("undefined");
  if (value === true || value === false) return booleanLiteral(value);
  if (value === null) return nullLiteral();
  if (typeof value == "string") return stringLiteral(value);

  if (typeof value == "number") {
    let result;
    if (Number.isFinite(value)) result = numericLiteral(Math.abs(value));
    else {
      let numerator = Number.isNaN(value) ? numericLiteral(0) : numericLiteral(1);

      result = binaryExpression("/", numerator, numericLiteral(0));
    }
    if (value < 0 || Object.is(value, -0)) result = unaryExpression("-", result);

    return result;
  }
  if (isRegExp(value)) return regExpLiteral(value.source, value.toString().match(/\/([a-z]+|)$/)[1]);

  if (Array.isArray(value)) return arrayExpression(value.map(valueToNode));

  if (isPlainObject(value)) {
    const props = [];
    for (const key of Object.keys(value)) {
      let nodeKey = isValidIdentifier(key) ? identifier(key) : stringLiteral(key);

      props.push(objectProperty(nodeKey, valueToNode(value[key])));
    }
    return objectExpression(props);
  }
  throw new Error("don't know how to turn this value into a node");
}

function appendToMemberExpression(member, append, computed = false) {
  member.object = memberExpression(member.object, member.property, member.computed);
  member.property = append;
  member.computed = !!computed;
  return member;
}

function inherits(child, parent) {
  if (!child || !parent) return child;
  for (const key of INHERIT_KEYS.optional) if (child[key] == null) child[key] = parent[key];

  for (const key of Object.keys(parent)) if (key[0] === "_" && key !== "__clone") child[key] = parent[key];

  for (const key of INHERIT_KEYS.force) child[key] = parent[key];

  inheritsComments(child, parent);
  return child;
}

function prependToMemberExpression(member, prepend) {
  if (isSuper(member.object)) throw new Error("Cannot prepend node to super property access (`super.foo`).");

  member.object = memberExpression(prepend, member.object);
  return member;
}

function getOuterBindingIdentifiers(node, duplicates) {
  return getBindingIdentifiers(node, duplicates, true);
}

function traverse(node, handlers, state) {
  if (typeof handlers == "function") handlers = { enter: handlers };

  const { enter, exit } = handlers;
  traverseSimpleImpl(node, enter, exit, state, []);
}
function traverseSimpleImpl(node, enter, exit, state, ancestors) {
  const keys = VISITOR_KEYS[node.type];
  if (!keys) return;
  enter && enter(node, ancestors, state);
  for (const key of keys) {
    const subNode = node[key];
    if (Array.isArray(subNode))
      for (let i = 0; i < subNode.length; i++) {
        const child = subNode[i];
        if (!child) continue;
        ancestors.push({ node, key, index: i });
        traverseSimpleImpl(child, enter, exit, state, ancestors);
        ancestors.pop();
      }
    else if (subNode) {
      ancestors.push({ node, key });
      traverseSimpleImpl(subNode, enter, exit, state, ancestors);
      ancestors.pop();
    }
  }
  exit && exit(node, ancestors, state);
}

function isBinding(node, parent, grandparent) {
  if (
    grandparent &&
    node.type === "Identifier" &&
    parent.type === "ObjectProperty" &&
    grandparent.type === "ObjectExpression"
  )
    return false;

  const keys = getBindingIdentifiers.keys[parent.type];
  if (keys)
    for (let i = 0; i < keys.length; i++) {
      const val = parent[keys[i]];
      if (Array.isArray(val)) {
        if (val.indexOf(node) >= 0) return true;
      } else if (val === node) return true;
    }

  return false;
}

function isLet(node) {
  return isVariableDeclaration(node) && (node.kind !== "var" || node[BLOCK_SCOPED_SYMBOL]);
}

function isBlockScoped(node) {
  return isFunctionDeclaration(node) || isClassDeclaration(node) || isLet(node);
}

function isImmutable(node) {
  return !!isType(node.type, "Immutable") || (!!isIdentifier(node) && node.name === "undefined");
}

function isNodesEquivalent(a, b) {
  if (typeof a != "object" || typeof b != "object" || a == null || b == null) return a === b;
  if (a.type !== b.type) return false;

  const fields = Object.keys(NODE_FIELDS[a.type] || a.type),
    visitorKeys = VISITOR_KEYS[a.type];
  for (const field of fields) {
    const val_a = a[field],
      val_b = b[field];
    if (typeof val_a != typeof val_b) return false;

    if (val_a == null && val_b == null) continue;
    if (val_a == null || val_b == null) return false;

    if (Array.isArray(val_a)) {
      if (!Array.isArray(val_b) || val_a.length !== val_b.length) return false;

      for (let i = 0; i < val_a.length; i++) if (!isNodesEquivalent(val_a[i], val_b[i])) return false;
    } else if (typeof val_a == "object" && (visitorKeys == null || !visitorKeys.includes(field))) {
      for (const key of Object.keys(val_a)) if (val_a[key] !== val_b[key]) return false;
    } else if (!isNodesEquivalent(val_a, val_b)) return false;
  }
  return true;
}

function isReferenced(node, parent, grandparent) {
  switch (parent.type) {
    case "MemberExpression":
    case "OptionalMemberExpression":
      return parent.property === node ? !!parent.computed : parent.object === node;
    case "JSXMemberExpression":
      return parent.object === node;
    case "VariableDeclarator":
      return parent.init === node;
    case "ArrowFunctionExpression":
      return parent.body === node;
    case "PrivateName":
      return false;
    case "ClassMethod":
    case "ClassPrivateMethod":
    case "ObjectMethod":
      return parent.key === node && !!parent.computed;
    case "ObjectProperty":
      return parent.key === node ? !!parent.computed : !grandparent || grandparent.type !== "ObjectPattern";
    case "ClassProperty":
    case "ClassAccessorProperty":
      return parent.key !== node || !!parent.computed;
    case "ClassPrivateProperty":
      return parent.key !== node;
    case "ClassDeclaration":
    case "ClassExpression":
      return parent.superClass === node;
    case "AssignmentExpression":
    case "AssignmentPattern":
      return parent.right === node;
    case "LabeledStatement":
    case "CatchClause":
    case "RestElement":
    case "BreakStatement":
    case "ContinueStatement":
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "ExportNamespaceSpecifier":
    case "ExportDefaultSpecifier":
      return false;
    case "ExportSpecifier":
      return (grandparent == null || !grandparent.source) && parent.local === node;
    case "ImportDefaultSpecifier":
    case "ImportNamespaceSpecifier":
    case "ImportSpecifier":
    case "ImportAttribute":
    case "JSXAttribute":
    case "ObjectPattern":
    case "ArrayPattern":
    case "MetaProperty":
      return false;
    case "ObjectTypeProperty":
      return parent.key !== node;
    case "TSEnumMember":
      return parent.id !== node;
    case "TSPropertySignature":
      return parent.key !== node || !!parent.computed;
  }
  return true;
}

function isScope(node, parent) {
  return (
    (!isBlockStatement(node) || (!isFunction(parent) && !isCatchClause(parent))) &&
    (!(!isPattern(node) || (!isFunction(parent) && !isCatchClause(parent))) || isScopable(node))
  );
}

function isSpecifierDefault(specifier) {
  return (
    isImportDefaultSpecifier(specifier) || isIdentifier(specifier.imported || specifier.exported, { name: "default" })
  );
}

const RESERVED_WORDS_ES3_ONLY = new Set([
  "abstract",
  "boolean",
  "byte",
  "char",
  "double",
  "enum",
  "final",
  "float",
  "goto",
  "implements",
  "int",
  "interface",
  "long",
  "native",
  "package",
  "private",
  "protected",
  "public",
  "short",
  "static",
  "synchronized",
  "throws",
  "transient",
  "volatile"
]);
function isValidES3Identifier(name) {
  return isValidIdentifier(name) && !RESERVED_WORDS_ES3_ONLY.has(name);
}

function isVar(node) {
  return isVariableDeclaration(node, { kind: "var" }) && !node[BLOCK_SCOPED_SYMBOL];
}

const react = { isReactComponent, isCompatTag, buildChildren };

module.exports = {
  ACCESSOR_TYPES,
  ALIAS_KEYS,
  ASSIGNMENT_OPERATORS,
  AnyTypeAnnotation: anyTypeAnnotation,
  ArgumentPlaceholder: argumentPlaceholder,
  ArrayExpression: arrayExpression,
  ArrayPattern: arrayPattern,
  ArrayTypeAnnotation: arrayTypeAnnotation,
  ArrowFunctionExpression: arrowFunctionExpression,
  AssignmentExpression: assignmentExpression,
  AssignmentPattern: assignmentPattern,
  AwaitExpression: awaitExpression,
  BINARY_OPERATORS,
  BINARY_TYPES,
  BLOCKPARENT_TYPES,
  BLOCK_SCOPED_SYMBOL,
  BLOCK_TYPES,
  BOOLEAN_BINARY_OPERATORS,
  BOOLEAN_NUMBER_BINARY_OPERATORS,
  BOOLEAN_UNARY_OPERATORS,
  BUILDER_KEYS,
  BigIntLiteral: bigIntLiteral,
  BinaryExpression: binaryExpression,
  BindExpression: bindExpression,
  BlockStatement: blockStatement,
  BooleanLiteral: booleanLiteral,
  BooleanLiteralTypeAnnotation: booleanLiteralTypeAnnotation,
  BooleanTypeAnnotation: booleanTypeAnnotation,
  BreakStatement: breakStatement,
  CLASS_TYPES,
  COMMENT_KEYS,
  COMPARISON_BINARY_OPERATORS,
  COMPLETIONSTATEMENT_TYPES,
  CONDITIONAL_TYPES,
  CallExpression: callExpression,
  CatchClause: catchClause,
  ClassAccessorProperty: classAccessorProperty,
  ClassBody: classBody,
  ClassDeclaration: classDeclaration,
  ClassExpression: classExpression,
  ClassImplements: classImplements,
  ClassMethod: classMethod,
  ClassPrivateMethod: classPrivateMethod,
  ClassPrivateProperty: classPrivateProperty,
  ClassProperty: classProperty,
  ConditionalExpression: conditionalExpression,
  ContinueStatement: continueStatement,
  DECLARATION_TYPES,
  DEPRECATED_ALIASES,
  DEPRECATED_KEYS,
  DebuggerStatement: debuggerStatement,
  DecimalLiteral: decimalLiteral,
  DeclareClass: declareClass,
  DeclareExportAllDeclaration: declareExportAllDeclaration,
  DeclareExportDeclaration: declareExportDeclaration,
  DeclareFunction: declareFunction,
  DeclareInterface: declareInterface,
  DeclareModule: declareModule,
  DeclareModuleExports: declareModuleExports,
  DeclareOpaqueType: declareOpaqueType,
  DeclareTypeAlias: declareTypeAlias,
  DeclareVariable: declareVariable,
  DeclaredPredicate: declaredPredicate,
  Decorator: decorator,
  Directive: directive,
  DirectiveLiteral: directiveLiteral,
  DoExpression: doExpression,
  DoWhileStatement: doWhileStatement,
  ENUMBODY_TYPES,
  ENUMMEMBER_TYPES,
  EQUALITY_BINARY_OPERATORS,
  EXPORTDECLARATION_TYPES,
  EXPRESSIONWRAPPER_TYPES,
  EXPRESSION_TYPES,
  EmptyStatement: emptyStatement,
  EmptyTypeAnnotation: emptyTypeAnnotation,
  EnumBooleanBody: enumBooleanBody,
  EnumBooleanMember: enumBooleanMember,
  EnumDeclaration: enumDeclaration,
  EnumDefaultedMember: enumDefaultedMember,
  EnumNumberBody: enumNumberBody,
  EnumNumberMember: enumNumberMember,
  EnumStringBody: enumStringBody,
  EnumStringMember: enumStringMember,
  EnumSymbolBody: enumSymbolBody,
  ExistsTypeAnnotation: existsTypeAnnotation,
  ExportAllDeclaration: exportAllDeclaration,
  ExportDefaultDeclaration: exportDefaultDeclaration,
  ExportDefaultSpecifier: exportDefaultSpecifier,
  ExportNamedDeclaration: exportNamedDeclaration,
  ExportNamespaceSpecifier: exportNamespaceSpecifier,
  ExportSpecifier: exportSpecifier,
  ExpressionStatement: expressionStatement,
  FLATTENABLE_KEYS,
  FLIPPED_ALIAS_KEYS,
  FLOWBASEANNOTATION_TYPES,
  FLOWDECLARATION_TYPES,
  FLOWPREDICATE_TYPES,
  FLOWTYPE_TYPES,
  FLOW_TYPES,
  FORXSTATEMENT_TYPES,
  FOR_INIT_KEYS,
  FOR_TYPES,
  FUNCTIONPARENT_TYPES,
  FUNCTION_TYPES,
  File: file,
  ForInStatement: forInStatement,
  ForOfStatement: forOfStatement,
  ForStatement: forStatement,
  FunctionDeclaration: functionDeclaration,
  FunctionExpression: functionExpression,
  FunctionTypeAnnotation: functionTypeAnnotation,
  FunctionTypeParam: functionTypeParam,
  GenericTypeAnnotation: genericTypeAnnotation,
  IMMUTABLE_TYPES,
  IMPORTOREXPORTDECLARATION_TYPES,
  INHERIT_KEYS,
  Identifier: identifier,
  IfStatement: ifStatement,
  Import: _import,
  ImportAttribute: importAttribute,
  ImportDeclaration: importDeclaration,
  ImportDefaultSpecifier: importDefaultSpecifier,
  ImportNamespaceSpecifier: importNamespaceSpecifier,
  ImportSpecifier: importSpecifier,
  IndexedAccessType: indexedAccessType,
  InferredPredicate: inferredPredicate,
  InterfaceDeclaration: interfaceDeclaration,
  InterfaceExtends: interfaceExtends,
  InterfaceTypeAnnotation: interfaceTypeAnnotation,
  InterpreterDirective: interpreterDirective,
  IntersectionTypeAnnotation: intersectionTypeAnnotation,
  JSXAttribute: jsxAttribute,
  JSXClosingElement: jsxClosingElement,
  JSXClosingFragment: jsxClosingFragment,
  JSXElement: jsxElement,
  JSXEmptyExpression: jsxEmptyExpression,
  JSXExpressionContainer: jsxExpressionContainer,
  JSXFragment: jsxFragment,
  JSXIdentifier: jsxIdentifier,
  JSXMemberExpression: jsxMemberExpression,
  JSXNamespacedName: jsxNamespacedName,
  JSXOpeningElement: jsxOpeningElement,
  JSXOpeningFragment: jsxOpeningFragment,
  JSXSpreadAttribute: jsxSpreadAttribute,
  JSXSpreadChild: jsxSpreadChild,
  JSXText: jsxText,
  JSX_TYPES,
  LITERAL_TYPES,
  LOGICAL_OPERATORS,
  LOOP_TYPES,
  LVAL_TYPES,
  LabeledStatement: labeledStatement,
  LogicalExpression: logicalExpression,
  METHOD_TYPES,
  MISCELLANEOUS_TYPES,
  MODULEDECLARATION_TYPES,
  MODULESPECIFIER_TYPES,
  MemberExpression: memberExpression,
  MetaProperty: metaProperty,
  MixedTypeAnnotation: mixedTypeAnnotation,
  ModuleExpression: moduleExpression,
  NODE_FIELDS,
  NODE_PARENT_VALIDATIONS,
  NOT_LOCAL_BINDING,
  NUMBER_BINARY_OPERATORS,
  NUMBER_UNARY_OPERATORS,
  NewExpression: newExpression,
  Noop: noop,
  NullLiteral: nullLiteral,
  NullLiteralTypeAnnotation: nullLiteralTypeAnnotation,
  NullableTypeAnnotation: nullableTypeAnnotation,
  NumberLiteral,
  NumberLiteralTypeAnnotation: numberLiteralTypeAnnotation,
  NumberTypeAnnotation: numberTypeAnnotation,
  NumericLiteral: numericLiteral,
  OBJECTMEMBER_TYPES,
  ObjectExpression: objectExpression,
  ObjectMethod: objectMethod,
  ObjectPattern: objectPattern,
  ObjectProperty: objectProperty,
  ObjectTypeAnnotation: objectTypeAnnotation,
  ObjectTypeCallProperty: objectTypeCallProperty,
  ObjectTypeIndexer: objectTypeIndexer,
  ObjectTypeInternalSlot: objectTypeInternalSlot,
  ObjectTypeProperty: objectTypeProperty,
  ObjectTypeSpreadProperty: objectTypeSpreadProperty,
  OpaqueType: opaqueType,
  OptionalCallExpression: optionalCallExpression,
  OptionalIndexedAccessType: optionalIndexedAccessType,
  OptionalMemberExpression: optionalMemberExpression,
  PATTERNLIKE_TYPES,
  PATTERN_TYPES,
  PLACEHOLDERS,
  PLACEHOLDERS_ALIAS,
  PLACEHOLDERS_FLIPPED_ALIAS,
  PRIVATE_TYPES,
  PROPERTY_TYPES,
  PUREISH_TYPES,
  ParenthesizedExpression: parenthesizedExpression,
  PipelineBareFunction: pipelineBareFunction,
  PipelinePrimaryTopicReference: pipelinePrimaryTopicReference,
  PipelineTopicExpression: pipelineTopicExpression,
  Placeholder: placeholder,
  PrivateName: privateName,
  Program: program,
  QualifiedTypeIdentifier: qualifiedTypeIdentifier,
  RecordExpression: recordExpression,
  RegExpLiteral: regExpLiteral,
  RegexLiteral,
  RestElement: restElement,
  RestProperty,
  ReturnStatement: returnStatement,
  SCOPABLE_TYPES,
  STANDARDIZED_TYPES,
  STATEMENT_OR_BLOCK_KEYS,
  STATEMENT_TYPES,
  STRING_UNARY_OPERATORS,
  SequenceExpression: sequenceExpression,
  SpreadElement: spreadElement,
  SpreadProperty,
  StaticBlock: staticBlock,
  StringLiteral: stringLiteral,
  StringLiteralTypeAnnotation: stringLiteralTypeAnnotation,
  StringTypeAnnotation: stringTypeAnnotation,
  Super: _super,
  SwitchCase: switchCase,
  SwitchStatement: switchStatement,
  SymbolTypeAnnotation: symbolTypeAnnotation,
  TERMINATORLESS_TYPES,
  TSAnyKeyword: tsAnyKeyword,
  TSArrayType: tsArrayType,
  TSAsExpression: tsAsExpression,
  TSBASETYPE_TYPES,
  TSBigIntKeyword: tsBigIntKeyword,
  TSBooleanKeyword: tsBooleanKeyword,
  TSCallSignatureDeclaration: tsCallSignatureDeclaration,
  TSConditionalType: tsConditionalType,
  TSConstructSignatureDeclaration: tsConstructSignatureDeclaration,
  TSConstructorType: tsConstructorType,
  TSDeclareFunction: tsDeclareFunction,
  TSDeclareMethod: tsDeclareMethod,
  TSENTITYNAME_TYPES,
  TSEnumDeclaration: tsEnumDeclaration,
  TSEnumMember: tsEnumMember,
  TSExportAssignment: tsExportAssignment,
  TSExpressionWithTypeArguments: tsExpressionWithTypeArguments,
  TSExternalModuleReference: tsExternalModuleReference,
  TSFunctionType: tsFunctionType,
  TSImportEqualsDeclaration: tsImportEqualsDeclaration,
  TSImportType: tsImportType,
  TSIndexSignature: tsIndexSignature,
  TSIndexedAccessType: tsIndexedAccessType,
  TSInferType: tsInferType,
  TSInstantiationExpression: tsInstantiationExpression,
  TSInterfaceBody: tsInterfaceBody,
  TSInterfaceDeclaration: tsInterfaceDeclaration,
  TSIntersectionType: tsIntersectionType,
  TSIntrinsicKeyword: tsIntrinsicKeyword,
  TSLiteralType: tsLiteralType,
  TSMappedType: tsMappedType,
  TSMethodSignature: tsMethodSignature,
  TSModuleBlock: tsModuleBlock,
  TSModuleDeclaration: tsModuleDeclaration,
  TSNamedTupleMember: tsNamedTupleMember,
  TSNamespaceExportDeclaration: tsNamespaceExportDeclaration,
  TSNeverKeyword: tsNeverKeyword,
  TSNonNullExpression: tsNonNullExpression,
  TSNullKeyword: tsNullKeyword,
  TSNumberKeyword: tsNumberKeyword,
  TSObjectKeyword: tsObjectKeyword,
  TSOptionalType: tsOptionalType,
  TSParameterProperty: tsParameterProperty,
  TSParenthesizedType: tsParenthesizedType,
  TSPropertySignature: tsPropertySignature,
  TSQualifiedName: tsQualifiedName,
  TSRestType: tsRestType,
  TSSatisfiesExpression: tsSatisfiesExpression,
  TSStringKeyword: tsStringKeyword,
  TSSymbolKeyword: tsSymbolKeyword,
  TSTYPEELEMENT_TYPES,
  TSTYPE_TYPES,
  TSThisType: tsThisType,
  TSTupleType: tsTupleType,
  TSTypeAliasDeclaration: tsTypeAliasDeclaration,
  TSTypeAnnotation: tsTypeAnnotation,
  TSTypeAssertion: tsTypeAssertion,
  TSTypeLiteral: tsTypeLiteral,
  TSTypeOperator: tsTypeOperator,
  TSTypeParameter: tsTypeParameter,
  TSTypeParameterDeclaration: tsTypeParameterDeclaration,
  TSTypeParameterInstantiation: tsTypeParameterInstantiation,
  TSTypePredicate: tsTypePredicate,
  TSTypeQuery: tsTypeQuery,
  TSTypeReference: tsTypeReference,
  TSUndefinedKeyword: tsUndefinedKeyword,
  TSUnionType: tsUnionType,
  TSUnknownKeyword: tsUnknownKeyword,
  TSVoidKeyword: tsVoidKeyword,
  TYPES,
  TYPESCRIPT_TYPES,
  TaggedTemplateExpression: taggedTemplateExpression,
  TemplateElement: templateElement,
  TemplateLiteral: templateLiteral,
  ThisExpression: thisExpression,
  ThisTypeAnnotation: thisTypeAnnotation,
  ThrowStatement: throwStatement,
  TopicReference: topicReference,
  TryStatement: tryStatement,
  TupleExpression: tupleExpression,
  TupleTypeAnnotation: tupleTypeAnnotation,
  TypeAlias: typeAlias,
  TypeAnnotation: typeAnnotation,
  TypeCastExpression: typeCastExpression,
  TypeParameter: typeParameter,
  TypeParameterDeclaration: typeParameterDeclaration,
  TypeParameterInstantiation: typeParameterInstantiation,
  TypeofTypeAnnotation: typeofTypeAnnotation,
  UNARYLIKE_TYPES,
  UNARY_OPERATORS,
  UPDATE_OPERATORS,
  USERWHITESPACABLE_TYPES,
  UnaryExpression: unaryExpression,
  UnionTypeAnnotation: unionTypeAnnotation,
  UpdateExpression: updateExpression,
  V8IntrinsicIdentifier: v8IntrinsicIdentifier,
  VISITOR_KEYS,
  VariableDeclaration: variableDeclaration,
  VariableDeclarator: variableDeclarator,
  Variance: variance,
  VoidTypeAnnotation: voidTypeAnnotation,
  WHILE_TYPES,
  WhileStatement: whileStatement,
  WithStatement: withStatement,
  YieldExpression: yieldExpression,
  __internal__deprecationWarning: deprecationWarning,
  addComment,
  addComments,
  anyTypeAnnotation,
  appendToMemberExpression,
  argumentPlaceholder,
  arrayExpression,
  arrayPattern,
  arrayTypeAnnotation,
  arrowFunctionExpression,
  assertAccessor,
  assertAnyTypeAnnotation,
  assertArgumentPlaceholder,
  assertArrayExpression,
  assertArrayPattern,
  assertArrayTypeAnnotation,
  assertArrowFunctionExpression,
  assertAssignmentExpression,
  assertAssignmentPattern,
  assertAwaitExpression,
  assertBigIntLiteral,
  assertBinary,
  assertBinaryExpression,
  assertBindExpression,
  assertBlock,
  assertBlockParent,
  assertBlockStatement,
  assertBooleanLiteral,
  assertBooleanLiteralTypeAnnotation,
  assertBooleanTypeAnnotation,
  assertBreakStatement,
  assertCallExpression,
  assertCatchClause,
  assertClass,
  assertClassAccessorProperty,
  assertClassBody,
  assertClassDeclaration,
  assertClassExpression,
  assertClassImplements,
  assertClassMethod,
  assertClassPrivateMethod,
  assertClassPrivateProperty,
  assertClassProperty,
  assertCompletionStatement,
  assertConditional,
  assertConditionalExpression,
  assertContinueStatement,
  assertDebuggerStatement,
  assertDecimalLiteral,
  assertDeclaration,
  assertDeclareClass,
  assertDeclareExportAllDeclaration,
  assertDeclareExportDeclaration,
  assertDeclareFunction,
  assertDeclareInterface,
  assertDeclareModule,
  assertDeclareModuleExports,
  assertDeclareOpaqueType,
  assertDeclareTypeAlias,
  assertDeclareVariable,
  assertDeclaredPredicate,
  assertDecorator,
  assertDirective,
  assertDirectiveLiteral,
  assertDoExpression,
  assertDoWhileStatement,
  assertEmptyStatement,
  assertEmptyTypeAnnotation,
  assertEnumBody,
  assertEnumBooleanBody,
  assertEnumBooleanMember,
  assertEnumDeclaration,
  assertEnumDefaultedMember,
  assertEnumMember,
  assertEnumNumberBody,
  assertEnumNumberMember,
  assertEnumStringBody,
  assertEnumStringMember,
  assertEnumSymbolBody,
  assertExistsTypeAnnotation,
  assertExportAllDeclaration,
  assertExportDeclaration,
  assertExportDefaultDeclaration,
  assertExportDefaultSpecifier,
  assertExportNamedDeclaration,
  assertExportNamespaceSpecifier,
  assertExportSpecifier,
  assertExpression,
  assertExpressionStatement,
  assertExpressionWrapper,
  assertFile,
  assertFlow,
  assertFlowBaseAnnotation,
  assertFlowDeclaration,
  assertFlowPredicate,
  assertFlowType,
  assertFor,
  assertForInStatement,
  assertForOfStatement,
  assertForStatement,
  assertForXStatement,
  assertFunction,
  assertFunctionDeclaration,
  assertFunctionExpression,
  assertFunctionParent,
  assertFunctionTypeAnnotation,
  assertFunctionTypeParam,
  assertGenericTypeAnnotation,
  assertIdentifier,
  assertIfStatement,
  assertImmutable,
  assertImport,
  assertImportAttribute,
  assertImportDeclaration,
  assertImportDefaultSpecifier,
  assertImportNamespaceSpecifier,
  assertImportOrExportDeclaration,
  assertImportSpecifier,
  assertIndexedAccessType,
  assertInferredPredicate,
  assertInterfaceDeclaration,
  assertInterfaceExtends,
  assertInterfaceTypeAnnotation,
  assertInterpreterDirective,
  assertIntersectionTypeAnnotation,
  assertJSX,
  assertJSXAttribute,
  assertJSXClosingElement,
  assertJSXClosingFragment,
  assertJSXElement,
  assertJSXEmptyExpression,
  assertJSXExpressionContainer,
  assertJSXFragment,
  assertJSXIdentifier,
  assertJSXMemberExpression,
  assertJSXNamespacedName,
  assertJSXOpeningElement,
  assertJSXOpeningFragment,
  assertJSXSpreadAttribute,
  assertJSXSpreadChild,
  assertJSXText,
  assertLVal,
  assertLabeledStatement,
  assertLiteral,
  assertLogicalExpression,
  assertLoop,
  assertMemberExpression,
  assertMetaProperty,
  assertMethod,
  assertMiscellaneous,
  assertMixedTypeAnnotation,
  assertModuleDeclaration,
  assertModuleExpression,
  assertModuleSpecifier,
  assertNewExpression,
  assertNode,
  assertNoop,
  assertNullLiteral,
  assertNullLiteralTypeAnnotation,
  assertNullableTypeAnnotation,
  assertNumberLiteral,
  assertNumberLiteralTypeAnnotation,
  assertNumberTypeAnnotation,
  assertNumericLiteral,
  assertObjectExpression,
  assertObjectMember,
  assertObjectMethod,
  assertObjectPattern,
  assertObjectProperty,
  assertObjectTypeAnnotation,
  assertObjectTypeCallProperty,
  assertObjectTypeIndexer,
  assertObjectTypeInternalSlot,
  assertObjectTypeProperty,
  assertObjectTypeSpreadProperty,
  assertOpaqueType,
  assertOptionalCallExpression,
  assertOptionalIndexedAccessType,
  assertOptionalMemberExpression,
  assertParenthesizedExpression,
  assertPattern,
  assertPatternLike,
  assertPipelineBareFunction,
  assertPipelinePrimaryTopicReference,
  assertPipelineTopicExpression,
  assertPlaceholder,
  assertPrivate,
  assertPrivateName,
  assertProgram,
  assertProperty,
  assertPureish,
  assertQualifiedTypeIdentifier,
  assertRecordExpression,
  assertRegExpLiteral,
  assertRegexLiteral,
  assertRestElement,
  assertRestProperty,
  assertReturnStatement,
  assertScopable,
  assertSequenceExpression,
  assertSpreadElement,
  assertSpreadProperty,
  assertStandardized,
  assertStatement,
  assertStaticBlock,
  assertStringLiteral,
  assertStringLiteralTypeAnnotation,
  assertStringTypeAnnotation,
  assertSuper,
  assertSwitchCase,
  assertSwitchStatement,
  assertSymbolTypeAnnotation,
  assertTSAnyKeyword,
  assertTSArrayType,
  assertTSAsExpression,
  assertTSBaseType,
  assertTSBigIntKeyword,
  assertTSBooleanKeyword,
  assertTSCallSignatureDeclaration,
  assertTSConditionalType,
  assertTSConstructSignatureDeclaration,
  assertTSConstructorType,
  assertTSDeclareFunction,
  assertTSDeclareMethod,
  assertTSEntityName,
  assertTSEnumDeclaration,
  assertTSEnumMember,
  assertTSExportAssignment,
  assertTSExpressionWithTypeArguments,
  assertTSExternalModuleReference,
  assertTSFunctionType,
  assertTSImportEqualsDeclaration,
  assertTSImportType,
  assertTSIndexSignature,
  assertTSIndexedAccessType,
  assertTSInferType,
  assertTSInstantiationExpression,
  assertTSInterfaceBody,
  assertTSInterfaceDeclaration,
  assertTSIntersectionType,
  assertTSIntrinsicKeyword,
  assertTSLiteralType,
  assertTSMappedType,
  assertTSMethodSignature,
  assertTSModuleBlock,
  assertTSModuleDeclaration,
  assertTSNamedTupleMember,
  assertTSNamespaceExportDeclaration,
  assertTSNeverKeyword,
  assertTSNonNullExpression,
  assertTSNullKeyword,
  assertTSNumberKeyword,
  assertTSObjectKeyword,
  assertTSOptionalType,
  assertTSParameterProperty,
  assertTSParenthesizedType,
  assertTSPropertySignature,
  assertTSQualifiedName,
  assertTSRestType,
  assertTSSatisfiesExpression,
  assertTSStringKeyword,
  assertTSSymbolKeyword,
  assertTSThisType,
  assertTSTupleType,
  assertTSType,
  assertTSTypeAliasDeclaration,
  assertTSTypeAnnotation,
  assertTSTypeAssertion,
  assertTSTypeElement,
  assertTSTypeLiteral,
  assertTSTypeOperator,
  assertTSTypeParameter,
  assertTSTypeParameterDeclaration,
  assertTSTypeParameterInstantiation,
  assertTSTypePredicate,
  assertTSTypeQuery,
  assertTSTypeReference,
  assertTSUndefinedKeyword,
  assertTSUnionType,
  assertTSUnknownKeyword,
  assertTSVoidKeyword,
  assertTaggedTemplateExpression,
  assertTemplateElement,
  assertTemplateLiteral,
  assertTerminatorless,
  assertThisExpression,
  assertThisTypeAnnotation,
  assertThrowStatement,
  assertTopicReference,
  assertTryStatement,
  assertTupleExpression,
  assertTupleTypeAnnotation,
  assertTypeAlias,
  assertTypeAnnotation,
  assertTypeCastExpression,
  assertTypeParameter,
  assertTypeParameterDeclaration,
  assertTypeParameterInstantiation,
  assertTypeScript,
  assertTypeofTypeAnnotation,
  assertUnaryExpression,
  assertUnaryLike,
  assertUnionTypeAnnotation,
  assertUpdateExpression,
  assertUserWhitespacable,
  assertV8IntrinsicIdentifier,
  assertVariableDeclaration,
  assertVariableDeclarator,
  assertVariance,
  assertVoidTypeAnnotation,
  assertWhile,
  assertWhileStatement,
  assertWithStatement,
  assertYieldExpression,
  assignmentExpression,
  assignmentPattern,
  awaitExpression,
  bigIntLiteral,
  binaryExpression,
  bindExpression,
  blockStatement,
  booleanLiteral,
  booleanLiteralTypeAnnotation,
  booleanTypeAnnotation,
  breakStatement,
  buildMatchMemberExpression,
  callExpression,
  catchClause,
  classAccessorProperty,
  classBody,
  classDeclaration,
  classExpression,
  classImplements,
  classMethod,
  classPrivateMethod,
  classPrivateProperty,
  classProperty,
  clone,
  cloneDeep,
  cloneDeepWithoutLoc,
  cloneNode,
  cloneWithoutLoc,
  conditionalExpression,
  continueStatement,
  createFlowUnionType,
  createTSUnionType,
  createTypeAnnotationBasedOnTypeof,
  createUnionTypeAnnotation: createFlowUnionType,
  debuggerStatement,
  decimalLiteral,
  declareClass,
  declareExportAllDeclaration,
  declareExportDeclaration,
  declareFunction,
  declareInterface,
  declareModule,
  declareModuleExports,
  declareOpaqueType,
  declareTypeAlias,
  declareVariable,
  declaredPredicate,
  decorator,
  directive,
  directiveLiteral,
  doExpression,
  doWhileStatement,
  emptyStatement,
  emptyTypeAnnotation,
  ensureBlock,
  enumBooleanBody,
  enumBooleanMember,
  enumDeclaration,
  enumDefaultedMember,
  enumNumberBody,
  enumNumberMember,
  enumStringBody,
  enumStringMember,
  enumSymbolBody,
  existsTypeAnnotation,
  exportAllDeclaration,
  exportDefaultDeclaration,
  exportDefaultSpecifier,
  exportNamedDeclaration,
  exportNamespaceSpecifier,
  exportSpecifier,
  expressionStatement,
  file,
  forInStatement,
  forOfStatement,
  forStatement,
  functionDeclaration,
  functionExpression,
  functionTypeAnnotation,
  functionTypeParam,
  genericTypeAnnotation,
  getBindingIdentifiers,
  getOuterBindingIdentifiers,
  identifier,
  ifStatement,
  import: _import,
  importAttribute,
  importDeclaration,
  importDefaultSpecifier,
  importNamespaceSpecifier,
  importSpecifier,
  indexedAccessType,
  inferredPredicate,
  inheritInnerComments,
  inheritLeadingComments,
  inheritTrailingComments,
  inherits,
  inheritsComments,
  interfaceDeclaration,
  interfaceExtends,
  interfaceTypeAnnotation,
  interpreterDirective,
  intersectionTypeAnnotation,
  is,
  isAccessor,
  isAnyTypeAnnotation,
  isArgumentPlaceholder,
  isArrayExpression,
  isArrayPattern,
  isArrayTypeAnnotation,
  isArrowFunctionExpression,
  isAssignmentExpression,
  isAssignmentPattern,
  isAwaitExpression,
  isBigIntLiteral,
  isBinary,
  isBinaryExpression,
  isBindExpression,
  isBinding,
  isBlock,
  isBlockParent,
  isBlockScoped,
  isBlockStatement,
  isBooleanLiteral,
  isBooleanLiteralTypeAnnotation,
  isBooleanTypeAnnotation,
  isBreakStatement,
  isCallExpression,
  isCatchClause,
  isClass,
  isClassAccessorProperty,
  isClassBody,
  isClassDeclaration,
  isClassExpression,
  isClassImplements,
  isClassMethod,
  isClassPrivateMethod,
  isClassPrivateProperty,
  isClassProperty,
  isCompletionStatement,
  isConditional,
  isConditionalExpression,
  isContinueStatement,
  isDebuggerStatement,
  isDecimalLiteral,
  isDeclaration,
  isDeclareClass,
  isDeclareExportAllDeclaration,
  isDeclareExportDeclaration,
  isDeclareFunction,
  isDeclareInterface,
  isDeclareModule,
  isDeclareModuleExports,
  isDeclareOpaqueType,
  isDeclareTypeAlias,
  isDeclareVariable,
  isDeclaredPredicate,
  isDecorator,
  isDirective,
  isDirectiveLiteral,
  isDoExpression,
  isDoWhileStatement,
  isEmptyStatement,
  isEmptyTypeAnnotation,
  isEnumBody,
  isEnumBooleanBody,
  isEnumBooleanMember,
  isEnumDeclaration,
  isEnumDefaultedMember,
  isEnumMember,
  isEnumNumberBody,
  isEnumNumberMember,
  isEnumStringBody,
  isEnumStringMember,
  isEnumSymbolBody,
  isExistsTypeAnnotation,
  isExportAllDeclaration,
  isExportDeclaration,
  isExportDefaultDeclaration,
  isExportDefaultSpecifier,
  isExportNamedDeclaration,
  isExportNamespaceSpecifier,
  isExportSpecifier,
  isExpression,
  isExpressionStatement,
  isExpressionWrapper,
  isFile,
  isFlow,
  isFlowBaseAnnotation,
  isFlowDeclaration,
  isFlowPredicate,
  isFlowType,
  isFor,
  isForInStatement,
  isForOfStatement,
  isForStatement,
  isForXStatement,
  isFunction,
  isFunctionDeclaration,
  isFunctionExpression,
  isFunctionParent,
  isFunctionTypeAnnotation,
  isFunctionTypeParam,
  isGenericTypeAnnotation,
  isIdentifier,
  isIfStatement,
  isImmutable,
  isImport,
  isImportAttribute,
  isImportDeclaration,
  isImportDefaultSpecifier,
  isImportNamespaceSpecifier,
  isImportOrExportDeclaration,
  isImportSpecifier,
  isIndexedAccessType,
  isInferredPredicate,
  isInterfaceDeclaration,
  isInterfaceExtends,
  isInterfaceTypeAnnotation,
  isInterpreterDirective,
  isIntersectionTypeAnnotation,
  isJSX,
  isJSXAttribute,
  isJSXClosingElement,
  isJSXClosingFragment,
  isJSXElement,
  isJSXEmptyExpression,
  isJSXExpressionContainer,
  isJSXFragment,
  isJSXIdentifier,
  isJSXMemberExpression,
  isJSXNamespacedName,
  isJSXOpeningElement,
  isJSXOpeningFragment,
  isJSXSpreadAttribute,
  isJSXSpreadChild,
  isJSXText,
  isLVal,
  isLabeledStatement,
  isLet,
  isLiteral,
  isLogicalExpression,
  isLoop,
  isMemberExpression,
  isMetaProperty,
  isMethod,
  isMiscellaneous,
  isMixedTypeAnnotation,
  isModuleDeclaration,
  isModuleExpression,
  isModuleSpecifier,
  isNewExpression,
  isNode,
  isNodesEquivalent,
  isNoop,
  isNullLiteral,
  isNullLiteralTypeAnnotation,
  isNullableTypeAnnotation,
  isNumberLiteral,
  isNumberLiteralTypeAnnotation,
  isNumberTypeAnnotation,
  isNumericLiteral,
  isObjectExpression,
  isObjectMember,
  isObjectMethod,
  isObjectPattern,
  isObjectProperty,
  isObjectTypeAnnotation,
  isObjectTypeCallProperty,
  isObjectTypeIndexer,
  isObjectTypeInternalSlot,
  isObjectTypeProperty,
  isObjectTypeSpreadProperty,
  isOpaqueType,
  isOptionalCallExpression,
  isOptionalIndexedAccessType,
  isOptionalMemberExpression,
  isParenthesizedExpression,
  isPattern,
  isPatternLike,
  isPipelineBareFunction,
  isPipelinePrimaryTopicReference,
  isPipelineTopicExpression,
  isPlaceholder,
  isPlaceholderType,
  isPrivate,
  isPrivateName,
  isProgram,
  isProperty,
  isPureish,
  isQualifiedTypeIdentifier,
  isRecordExpression,
  isReferenced,
  isRegExpLiteral,
  isRegexLiteral,
  isRestElement,
  isRestProperty,
  isReturnStatement,
  isScopable,
  isScope,
  isSequenceExpression,
  isSpecifierDefault,
  isSpreadElement,
  isSpreadProperty,
  isStandardized,
  isStatement,
  isStaticBlock,
  isStringLiteral,
  isStringLiteralTypeAnnotation,
  isStringTypeAnnotation,
  isSuper,
  isSwitchCase,
  isSwitchStatement,
  isSymbolTypeAnnotation,
  isTSAnyKeyword,
  isTSArrayType,
  isTSAsExpression,
  isTSBaseType,
  isTSBigIntKeyword,
  isTSBooleanKeyword,
  isTSCallSignatureDeclaration,
  isTSConditionalType,
  isTSConstructSignatureDeclaration,
  isTSConstructorType,
  isTSDeclareFunction,
  isTSDeclareMethod,
  isTSEntityName,
  isTSEnumDeclaration,
  isTSEnumMember,
  isTSExportAssignment,
  isTSExpressionWithTypeArguments,
  isTSExternalModuleReference,
  isTSFunctionType,
  isTSImportEqualsDeclaration,
  isTSImportType,
  isTSIndexSignature,
  isTSIndexedAccessType,
  isTSInferType,
  isTSInstantiationExpression,
  isTSInterfaceBody,
  isTSInterfaceDeclaration,
  isTSIntersectionType,
  isTSIntrinsicKeyword,
  isTSLiteralType,
  isTSMappedType,
  isTSMethodSignature,
  isTSModuleBlock,
  isTSModuleDeclaration,
  isTSNamedTupleMember,
  isTSNamespaceExportDeclaration,
  isTSNeverKeyword,
  isTSNonNullExpression,
  isTSNullKeyword,
  isTSNumberKeyword,
  isTSObjectKeyword,
  isTSOptionalType,
  isTSParameterProperty,
  isTSParenthesizedType,
  isTSPropertySignature,
  isTSQualifiedName,
  isTSRestType,
  isTSSatisfiesExpression,
  isTSStringKeyword,
  isTSSymbolKeyword,
  isTSThisType,
  isTSTupleType,
  isTSType,
  isTSTypeAliasDeclaration,
  isTSTypeAnnotation,
  isTSTypeAssertion,
  isTSTypeElement,
  isTSTypeLiteral,
  isTSTypeOperator,
  isTSTypeParameter,
  isTSTypeParameterDeclaration,
  isTSTypeParameterInstantiation,
  isTSTypePredicate,
  isTSTypeQuery,
  isTSTypeReference,
  isTSUndefinedKeyword,
  isTSUnionType,
  isTSUnknownKeyword,
  isTSVoidKeyword,
  isTaggedTemplateExpression,
  isTemplateElement,
  isTemplateLiteral,
  isTerminatorless,
  isThisExpression,
  isThisTypeAnnotation,
  isThrowStatement,
  isTopicReference,
  isTryStatement,
  isTupleExpression,
  isTupleTypeAnnotation,
  isType,
  isTypeAlias,
  isTypeAnnotation,
  isTypeCastExpression,
  isTypeParameter,
  isTypeParameterDeclaration,
  isTypeParameterInstantiation,
  isTypeScript,
  isTypeofTypeAnnotation,
  isUnaryExpression,
  isUnaryLike,
  isUnionTypeAnnotation,
  isUpdateExpression,
  isUserWhitespacable,
  isV8IntrinsicIdentifier,
  isValidES3Identifier,
  isValidIdentifier,
  isVar,
  isVariableDeclaration,
  isVariableDeclarator,
  isVariance,
  isVoidTypeAnnotation,
  isWhile,
  isWhileStatement,
  isWithStatement,
  isYieldExpression,
  jSXAttribute: jsxAttribute,
  jSXClosingElement: jsxClosingElement,
  jSXClosingFragment: jsxClosingFragment,
  jSXElement: jsxElement,
  jSXEmptyExpression: jsxEmptyExpression,
  jSXExpressionContainer: jsxExpressionContainer,
  jSXFragment: jsxFragment,
  jSXIdentifier: jsxIdentifier,
  jSXMemberExpression: jsxMemberExpression,
  jSXNamespacedName: jsxNamespacedName,
  jSXOpeningElement: jsxOpeningElement,
  jSXOpeningFragment: jsxOpeningFragment,
  jSXSpreadAttribute: jsxSpreadAttribute,
  jSXSpreadChild: jsxSpreadChild,
  jSXText: jsxText,
  jsxAttribute,
  jsxClosingElement,
  jsxClosingFragment,
  jsxElement,
  jsxEmptyExpression,
  jsxExpressionContainer,
  jsxFragment,
  jsxIdentifier,
  jsxMemberExpression,
  jsxNamespacedName,
  jsxOpeningElement,
  jsxOpeningFragment,
  jsxSpreadAttribute,
  jsxSpreadChild,
  jsxText,
  labeledStatement,
  logicalExpression,
  matchesPattern,
  memberExpression,
  metaProperty,
  mixedTypeAnnotation,
  moduleExpression,
  newExpression,
  noop,
  nullLiteral,
  nullLiteralTypeAnnotation,
  nullableTypeAnnotation,
  numberLiteral: NumberLiteral,
  numberLiteralTypeAnnotation,
  numberTypeAnnotation,
  numericLiteral,
  objectExpression,
  objectMethod,
  objectPattern,
  objectProperty,
  objectTypeAnnotation,
  objectTypeCallProperty,
  objectTypeIndexer,
  objectTypeInternalSlot,
  objectTypeProperty,
  objectTypeSpreadProperty,
  opaqueType,
  optionalCallExpression,
  optionalIndexedAccessType,
  optionalMemberExpression,
  parenthesizedExpression,
  pipelineBareFunction,
  pipelinePrimaryTopicReference,
  pipelineTopicExpression,
  placeholder,
  prependToMemberExpression,
  privateName,
  program,
  qualifiedTypeIdentifier,
  react,
  recordExpression,
  regExpLiteral,
  regexLiteral: RegexLiteral,
  removeComments,
  removeProperties,
  removePropertiesDeep,
  removeTypeDuplicates: removeTypeDuplicates$1,
  restElement,
  restProperty: RestProperty,
  returnStatement,
  sequenceExpression,
  shallowEqual,
  spreadElement,
  spreadProperty: SpreadProperty,
  staticBlock,
  stringLiteral,
  stringLiteralTypeAnnotation,
  stringTypeAnnotation,
  super: _super,
  switchCase,
  switchStatement,
  symbolTypeAnnotation,
  tSAnyKeyword: tsAnyKeyword,
  tSArrayType: tsArrayType,
  tSAsExpression: tsAsExpression,
  tSBigIntKeyword: tsBigIntKeyword,
  tSBooleanKeyword: tsBooleanKeyword,
  tSCallSignatureDeclaration: tsCallSignatureDeclaration,
  tSConditionalType: tsConditionalType,
  tSConstructSignatureDeclaration: tsConstructSignatureDeclaration,
  tSConstructorType: tsConstructorType,
  tSDeclareFunction: tsDeclareFunction,
  tSDeclareMethod: tsDeclareMethod,
  tSEnumDeclaration: tsEnumDeclaration,
  tSEnumMember: tsEnumMember,
  tSExportAssignment: tsExportAssignment,
  tSExpressionWithTypeArguments: tsExpressionWithTypeArguments,
  tSExternalModuleReference: tsExternalModuleReference,
  tSFunctionType: tsFunctionType,
  tSImportEqualsDeclaration: tsImportEqualsDeclaration,
  tSImportType: tsImportType,
  tSIndexSignature: tsIndexSignature,
  tSIndexedAccessType: tsIndexedAccessType,
  tSInferType: tsInferType,
  tSInstantiationExpression: tsInstantiationExpression,
  tSInterfaceBody: tsInterfaceBody,
  tSInterfaceDeclaration: tsInterfaceDeclaration,
  tSIntersectionType: tsIntersectionType,
  tSIntrinsicKeyword: tsIntrinsicKeyword,
  tSLiteralType: tsLiteralType,
  tSMappedType: tsMappedType,
  tSMethodSignature: tsMethodSignature,
  tSModuleBlock: tsModuleBlock,
  tSModuleDeclaration: tsModuleDeclaration,
  tSNamedTupleMember: tsNamedTupleMember,
  tSNamespaceExportDeclaration: tsNamespaceExportDeclaration,
  tSNeverKeyword: tsNeverKeyword,
  tSNonNullExpression: tsNonNullExpression,
  tSNullKeyword: tsNullKeyword,
  tSNumberKeyword: tsNumberKeyword,
  tSObjectKeyword: tsObjectKeyword,
  tSOptionalType: tsOptionalType,
  tSParameterProperty: tsParameterProperty,
  tSParenthesizedType: tsParenthesizedType,
  tSPropertySignature: tsPropertySignature,
  tSQualifiedName: tsQualifiedName,
  tSRestType: tsRestType,
  tSSatisfiesExpression: tsSatisfiesExpression,
  tSStringKeyword: tsStringKeyword,
  tSSymbolKeyword: tsSymbolKeyword,
  tSThisType: tsThisType,
  tSTupleType: tsTupleType,
  tSTypeAliasDeclaration: tsTypeAliasDeclaration,
  tSTypeAnnotation: tsTypeAnnotation,
  tSTypeAssertion: tsTypeAssertion,
  tSTypeLiteral: tsTypeLiteral,
  tSTypeOperator: tsTypeOperator,
  tSTypeParameter: tsTypeParameter,
  tSTypeParameterDeclaration: tsTypeParameterDeclaration,
  tSTypeParameterInstantiation: tsTypeParameterInstantiation,
  tSTypePredicate: tsTypePredicate,
  tSTypeQuery: tsTypeQuery,
  tSTypeReference: tsTypeReference,
  tSUndefinedKeyword: tsUndefinedKeyword,
  tSUnionType: tsUnionType,
  tSUnknownKeyword: tsUnknownKeyword,
  tSVoidKeyword: tsVoidKeyword,
  taggedTemplateExpression,
  templateElement,
  templateLiteral,
  thisExpression,
  thisTypeAnnotation,
  throwStatement,
  toBindingIdentifierName,
  toBlock,
  toComputedKey,
  toExpression,
  toIdentifier,
  toKeyAlias,
  toSequenceExpression,
  toStatement,
  topicReference,
  traverse,
  traverseFast,
  tryStatement,
  tsAnyKeyword,
  tsArrayType,
  tsAsExpression,
  tsBigIntKeyword,
  tsBooleanKeyword,
  tsCallSignatureDeclaration,
  tsConditionalType,
  tsConstructSignatureDeclaration,
  tsConstructorType,
  tsDeclareFunction,
  tsDeclareMethod,
  tsEnumDeclaration,
  tsEnumMember,
  tsExportAssignment,
  tsExpressionWithTypeArguments,
  tsExternalModuleReference,
  tsFunctionType,
  tsImportEqualsDeclaration,
  tsImportType,
  tsIndexSignature,
  tsIndexedAccessType,
  tsInferType,
  tsInstantiationExpression,
  tsInterfaceBody,
  tsInterfaceDeclaration,
  tsIntersectionType,
  tsIntrinsicKeyword,
  tsLiteralType,
  tsMappedType,
  tsMethodSignature,
  tsModuleBlock,
  tsModuleDeclaration,
  tsNamedTupleMember,
  tsNamespaceExportDeclaration,
  tsNeverKeyword,
  tsNonNullExpression,
  tsNullKeyword,
  tsNumberKeyword,
  tsObjectKeyword,
  tsOptionalType,
  tsParameterProperty,
  tsParenthesizedType,
  tsPropertySignature,
  tsQualifiedName,
  tsRestType,
  tsSatisfiesExpression,
  tsStringKeyword,
  tsSymbolKeyword,
  tsThisType,
  tsTupleType,
  tsTypeAliasDeclaration,
  tsTypeAnnotation,
  tsTypeAssertion,
  tsTypeLiteral,
  tsTypeOperator,
  tsTypeParameter,
  tsTypeParameterDeclaration,
  tsTypeParameterInstantiation,
  tsTypePredicate,
  tsTypeQuery,
  tsTypeReference,
  tsUndefinedKeyword,
  tsUnionType,
  tsUnknownKeyword,
  tsVoidKeyword,
  tupleExpression,
  tupleTypeAnnotation,
  typeAlias,
  typeAnnotation,
  typeCastExpression,
  typeParameter,
  typeParameterDeclaration,
  typeParameterInstantiation,
  typeofTypeAnnotation,
  unaryExpression,
  unionTypeAnnotation,
  updateExpression,
  v8IntrinsicIdentifier,
  validate,
  valueToNode,
  variableDeclaration,
  variableDeclarator,
  variance,
  voidTypeAnnotation,
  whileStatement,
  withStatement,
  yieldExpression
};

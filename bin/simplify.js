#!/usr/bin/env node
'use strict';

const fs = require('fs'),
  parser = require('../parser'),
  generate = require('../generator'),
  t = require('../types'),
  traverse = require('../traverse');

// Parse arguments
let args = new Set(process.argv.slice(2)),
  format = { comments: false };

args.delete('--minify') ? (format.concise = true) : (format.retainLines = true);

const VOID_0 = t.unaryExpression('void', t.numericLiteral(0), true);

let visitor = {
  BlockStatement(path) {
    const { body, directives } = path.node,
      { parent } = path;

    (directives && directives.length) ||
      (!t.isIfStatement(parent) && !t.isLoop(parent)) ||
      body.length !== 1 ||
      t.isVariableDeclaration(body[0], { kind: 'let' }) ||
      t.isVariableDeclaration(body[0], { kind: 'const' }) ||
      t.isFunctionDeclaration(body[0]) ||
      path.replaceWith(body[0]);
  },
  ReferencedIdentifier(path) {
    path.node.name !== 'undefined' || path.replaceWith(VOID_0);
  },
  BinaryExpression(path) {
    const { node } = path,
      op = node.operator;
    let leftTypes, rightTypes;

    (op !== '===' && op !== '!==') ||
      t.isAnyTypeAnnotation((leftTypes = path.get('left').getTypeAnnotation())) ||
      t.isAnyTypeAnnotation((rightTypes = path.get('right').getTypeAnnotation())) ||
      leftTypes.type !== rightTypes.type ||
      (node.operator = op.slice(0, -1));
  }
};

args.forEach(filename => {
  let data = fs.readFileSync(filename, 'utf8');

  const ast = parser.parse(data);
  traverse(ast, visitor);
  data = generate(ast, format, data);

  console.log(data.code);
});

!(function (global, factory) {
  // prettier-ignore
  typeof exports == 'object' && typeof module != 'undefined' ? (module.exports = factory(require)) :
  typeof define == 'function' && define.amd ? define(['require'], factory) :
  ((global = typeof globalThis != 'undefined' ? globalThis : global || self).VueTemplateCompiler =
    factory(function (mod) {
      return mod === './build' ? global.VueTemplateCompiler : mod === 'acorn-walk' ? global.acorn.walk : global[mod]
    }))
})(this, function (require) {
  'use strict'

  var acorn,
    compiler = require('./build'),
    original = {}

  ;['compile', 'ssrCompile'].forEach(function (method) {
    original[method] = compiler[method]

    compiler[method] = function (template, options) {
      var result = original[method].apply(compiler, arguments)

      if ((!result.errors || !result.errors.length) && options && options.stripWith) {
        result.render = stripWithStatement(result.render)
        result.staticRenderFns = result.staticRenderFns.map(stripWithStatement)
      }

      return result
    }
  })

  Object.defineProperty(compiler, 'stripWithStatement', { value: stripWithStatement })
  return compiler

  function stripWithStatement(source) {
    if (!/^\s*with\s*\(\s*this\s*\)/.test(source)) return source

    acorn || (acorn = require('acorn'))
    acorn.walk || (acorn.walk = require('acorn-walk'))

    source = '(function (){' + source + '})()'
    var ast = acorn.parse(source, { ecmaVersion: 13 })

    var changes = prefixIdentifiers(ast)
    changes.sort(function (a, b) {
      return a[0] - b[0]
    })

    // StringBuilder
    var s = [],
      lastIndex = 13
    changes.forEach(function (ins, val) {
      if ((val = ins[0]) > lastIndex) {
        s.push(source.slice(lastIndex, val))
        lastIndex = val
      }
      typeof (val = ins[1]) == 'number' ? (lastIndex = val) : s.push(val)
    })
    s.push(source.slice(lastIndex, -4))

    return s.join('')
  }

  function doNotPrefix(_name) {
    var names =
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,' +
      'require,' + // for Webpack
      'arguments,' + // parsed as identifier but is a special keyword...
      '_c' // cached to save property access

    var hash = Object.create(null)
    names.split(',').forEach(function (name) {
      hash[name] = true
    })

    return (doNotPrefix = function (name) {
      return hash[name]
    }).apply(null, arguments)
  }

  function prefixIdentifiers(ast) {
    // Resolve local scopes
    acorn.walk.ancestor(ast, {
      VariableDeclaration: onVariableDeclaration,
      FunctionDeclaration: onFunctionDeclaration,
      Function: declareFunction,
      TryStatement: onTryStatement
    })

    var changes = []
    acorn.walk.ancestor(ast, {
      Identifier: onIdentifier,
      //CallExpression: onCallExpression,
      WithStatement: onWithStatement
    })
    return changes

    function onWithStatement(node) {
      // Remove surrounding with block
      changes.push([node.start, node.body.start + 1])
      changes.push([node.end - 1, node.end])

      changes.push([node.body.start + 1, 'var _vm=this,_c=_vm._self._c;'])
    }

    function onIdentifier(node, parents) {
      var parent = parents[parents.length - 2]
      if (
        // not a key of Property
        (parent.type === 'Property' && !parent.computed && parent.key === node) ||
        // not a property of a MemberExpression
        (parent.type === 'MemberExpression' && !parent.computed && parent.property === node) ||
        // not in an Object destructure pattern
        (parents.length > 2 && parents[parents.length - 3].type === 'ObjectPattern') ||
        // skip globals + commonly used shorthands
        doNotPrefix(node.name) ||
        // not already in scope
        isReferenced(node.name, parents)
      )
        return

      parent.type === 'Property' && !parent.computed && parent.shorthand
        ? changes.push([node.start, node.name + ': _vm.'])
        : changes.push([node.start, '_vm.'])
    }
  }

  // Is in local scope?
  function isReferenced(name, parents) {
    for (var i = parents.length - 2; i >= 0; i--)
      if (parents[i].locals && parents[i].locals[name]) return true

    return false
  }

  function declareFunction(node) {
    node.locals || (node.locals = {})
    node.params.forEach(function (param) {
      declarationPattern(param, node)
    })
    if (node.id) node.locals[node.id.name] = true
  }

  function declarationPattern(node, parent) {
    switch (node.type) {
      // Actual identifier name:
      case 'Identifier':
        parent.locals[node.name] = true
        break
      // `var { a, b: c } = { a: 10, b: 20 }` || `var { ...o } = {}`
      case 'ObjectPattern':
        node.properties.forEach(function (prop) {
          declarationPattern(prop.value || prop.argument, parent)
        })
        break
      // `var [x, y] = [10, 20]`
      case 'ArrayPattern':
        node.elements.forEach(function (elem) {
          elem && declarationPattern(elem, parent)
        })
        break
      // `var [x, y, ...z] = [10, 20, 30, 40, 50]` || `var [...z] = []`
      case 'RestElement':
        declarationPattern(node.argument, parent)
        break
      // `var [x = 5, y = 7] = [1]`
      case 'AssignmentPattern':
        declarationPattern(node.left, parent)
      //break
    }
  }

  function onVariableDeclaration(node, parents) {
    for (var parent, i = parents.length - 2; i >= 0; i--)
      if ((node.kind !== 'var' && parents[i].type === 'BlockStatement') || isScope(parents[i])) {
        parent = parents[i]
        break
      }

    parent.locals || (parent.locals = {})
    node.declarations.forEach(function (decl) {
      declarationPattern(decl.id, parent)
    })
  }

  function onFunctionDeclaration(node, parents) {
    for (var parent, i = parents.length - 2; i >= 0; i--)
      if (isScope(parents[i])) {
        parent = parents[i]
        break
      }

    parent.locals || (parent.locals = {})
    if (node.id) parent.locals[node.id.name] = true

    declareFunction(node)
  }

  function onTryStatement(node) {
    var handler = node.handler
    if (handler && handler.param)
      (handler.locals || (handler.locals = {}))[handler.param.name] = true
  }

  function isScope(node) {
    // Function or Global scopes
    return /Function(Expression|Declaration)$/.test(node.type) || node.type === 'Program'
  }
})

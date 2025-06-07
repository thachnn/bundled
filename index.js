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

  var compiler = require('./build'),
    original = {}

  ;['compile', 'ssrCompile'].forEach(function (method) {
    original[method] = compiler[method]

    compiler[method] = function (template, options) {
      var result = original[method].apply(compiler, arguments)

      // TODO if (options && options.stripWith) result.render = prefixIdentifiers()

      return result
    }
  })

  //stripWithStatement

  return compiler
})

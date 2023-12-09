module.exports = function(originalModule) {
  if (!originalModule.webpackPolyfill) {
    var module = Object.create(originalModule);
    module.children || (module.children = []), Object.defineProperty(module, "loaded", {
      enumerable: !0,
      get: function() {
        return module.l;
      }
    }), Object.defineProperty(module, "id", {
      enumerable: !0,
      get: function() {
        return module.i;
      }
    }), Object.defineProperty(module, "exports", {
      enumerable: !0
    }), module.webpackPolyfill = 1;
  }
  return module;
};
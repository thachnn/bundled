var g;

g = function() {
  return this;
}();

try {
  g = g || new Function("return this")();
} catch (e) {
  "object" == typeof window && (g = window);
}

module.exports = g;
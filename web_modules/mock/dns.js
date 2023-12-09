exports.lookup = exports.resolve4 = exports.resolve6 = exports.resolveCname = exports.resolveMx = exports.resolveNs = exports.resolveTxt = exports.resolveSrv = exports.resolveNaptr = exports.reverse = exports.resolve = function() {
  if (arguments.length) {
    var callback = arguments[arguments.length - 1];
    callback && "function" == typeof callback && callback(null, "0.0.0.0");
  }
};
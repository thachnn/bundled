'use strict';

const isObject = (obj) => obj != null && typeof obj == 'object';

/**
 * @param {Object} target
 * @param {?Object} source
 * @returns {Object}
 */
function mergeDeep(target, source) {
  if (isObject(source))
    for (const key in source) {
      const v = source[key],
        t = target[key];

      Array.isArray(t) ? (target[key] = t.concat(v)) : isObject(t) ? mergeDeep(t, v) : (target[key] = v);
    }

  return target;
}

/**
 * @param {Object} target
 * @param {...?Object} _sources
 * @returns {Object}
 */
module.exports = function (target, _sources) {
  return Array.prototype.slice.call(arguments, 1).reduce((dest, src) => mergeDeep(dest, src), target);
};

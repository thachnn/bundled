'use strict';

const isObject = (obj) => obj && typeof obj == 'object';

Object.defineProperty(Object.prototype, 'mergeDeep', {
  value: function (/** @type {?Object} */ obj) {
    if (isObject(obj))
      for (const key in obj) {
        const val = obj[key],
          t = this[key];

        Array.isArray(t) ? (this[key] = t.concat(val)) : isObject(t) ? t.mergeDeep(val) : (this[key] = val);
      }

    return this;
  },
});

/**
 * @param {...Array.<?Object>} _objects
 * @return {Object}
 */
function mergeDeep(_objects) {
  return Array.prototype.reduce.call(arguments, (dest, src) => dest.mergeDeep(src), {});
}

module.exports = mergeDeep;

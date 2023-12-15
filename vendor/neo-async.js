'use strict';

function noop() {}
function throwError() {
  throw new Error('Callback was already called.');
}

var DEFAULT_TIMES = 5,
  DEFAULT_INTERVAL = 0;

var obj = 'object',
  func = 'function',
  isArray = Array.isArray,
  nativeKeys = Object.keys,
  nativePush = Array.prototype.push,
  iteratorSymbol = typeof Symbol === func && Symbol.iterator;

var nextTick, asyncNextTick, asyncSetImmediate;
createImmediate();

var each = createEach(arrayEach, baseEach, symbolEach),

  map = createMap(arrayEachIndex, baseEachIndex, symbolEachIndex, true),
  mapValues = createMap(arrayEachIndex, baseEachKey, symbolEachKey, false),

  filter = createFilter(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue, true),
  filterSeries = createFilterSeries(true),
  filterLimit = createFilterLimit(true),

  reject = createFilter(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue, false),
  rejectSeries = createFilterSeries(false),
  rejectLimit = createFilterLimit(false),

  detect = createDetect(arrayEachValue, baseEachValue, symbolEachValue, true),
  detectSeries = createDetectSeries(true),
  detectLimit = createDetectLimit(true),

  every = createEvery(arrayEachValue, baseEachValue, symbolEachValue),
  everySeries = createEverySeries(),
  everyLimit = createEveryLimit(),

  pick = createPick(arrayEachIndexValue, baseEachKeyValue, symbolEachKeyValue, true),
  pickSeries = createPickSeries(true),
  pickLimit = createPickLimit(true),

  omit = createPick(arrayEachIndexValue, baseEachKeyValue, symbolEachKeyValue, false),
  omitSeries = createPickSeries(false),
  omitLimit = createPickLimit(false),

  transform = createTransform(arrayEachResult, baseEachResult, symbolEachResult),

  sortBy = createSortBy(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue),
  concat = createConcat(arrayEachIndex, baseEachIndex, symbolEachIndex),
  groupBy = createGroupBy(arrayEachValue, baseEachValue, symbolEachValue),

  parallel = createParallel(arrayEachFunc, baseEachFunc),

  applyEach = createApplyEach(map),
  applyEachSeries = createApplyEach(mapSeries),

  log = createLogger('log'),
  dir = createLogger('dir');

var index = {
  VERSION: '2.6.2',

  each: each,
  eachSeries: eachSeries,
  eachLimit: eachLimit,
  forEach: each,
  forEachSeries: eachSeries,
  forEachLimit: eachLimit,
  eachOf: each,
  eachOfSeries: eachSeries,
  eachOfLimit: eachLimit,
  forEachOf: each,
  forEachOfSeries: eachSeries,
  forEachOfLimit: eachLimit,
  map: map,
  mapSeries: mapSeries,
  mapLimit: mapLimit,
  mapValues: mapValues,
  mapValuesSeries: mapValuesSeries,
  mapValuesLimit: mapValuesLimit,
  filter: filter,
  filterSeries: filterSeries,
  filterLimit: filterLimit,
  select: filter,
  selectSeries: filterSeries,
  selectLimit: filterLimit,
  reject: reject,
  rejectSeries: rejectSeries,
  rejectLimit: rejectLimit,
  detect: detect,
  detectSeries: detectSeries,
  detectLimit: detectLimit,
  find: detect,
  findSeries: detectSeries,
  findLimit: detectLimit,
  pick: pick,
  pickSeries: pickSeries,
  pickLimit: pickLimit,
  omit: omit,
  omitSeries: omitSeries,
  omitLimit: omitLimit,
  reduce: reduce,
  inject: reduce,
  foldl: reduce,
  reduceRight: reduceRight,
  foldr: reduceRight,
  transform: transform,
  transformSeries: transformSeries,
  transformLimit: transformLimit,
  sortBy: sortBy,
  sortBySeries: sortBySeries,
  sortByLimit: sortByLimit,
  some: some,
  someSeries: someSeries,
  someLimit: someLimit,
  any: some,
  anySeries: someSeries,
  anyLimit: someLimit,
  every: every,
  everySeries: everySeries,
  everyLimit: everyLimit,
  all: every,
  allSeries: everySeries,
  allLimit: everyLimit,
  concat: concat,
  concatSeries: concatSeries,
  concatLimit: concatLimit,
  groupBy: groupBy,
  groupBySeries: groupBySeries,
  groupByLimit: groupByLimit,

  parallel: parallel,
  series: series,
  parallelLimit: parallelLimit,
  tryEach: tryEach,
  waterfall: waterfall,
  angelFall: angelFall,
  angelfall: angelFall,
  whilst: whilst,
  doWhilst: doWhilst,
  until: until,
  doUntil: doUntil,
  during: during,
  doDuring: doDuring,
  forever: forever,
  compose: compose,
  seq: seq,
  applyEach: applyEach,
  applyEachSeries: applyEachSeries,
  queue: queue,
  priorityQueue: priorityQueue,
  cargo: cargo,
  auto: auto,
  autoInject: autoInject,
  retry: retry,
  retryable: retryable,
  iterator: iterator,
  times: times,
  timesSeries: timesSeries,
  timesLimit: timesLimit,
  race: race,

  apply: apply,
  nextTick: asyncNextTick,
  setImmediate: asyncSetImmediate,
  memoize: memoize,
  unmemoize: unmemoize,
  ensureAsync: ensureAsync,
  constant: constant,
  asyncify: asyncify,
  wrapSync: asyncify,
  log: log,
  dir: dir,
  reflect: reflect,
  reflectAll: reflectAll,
  timeout: timeout,
  createLogger: createLogger,

  safe: safe,
  fast: fast
};

exports.default = index;
baseEachSync(
  index,
  function(func, key) {
    exports[key] = func;
  },
  nativeKeys(index)
);

function createImmediate(safeMode) {
  var delay = function(fn) {
    var args = slice(arguments, 1);
    setTimeout(function() {
      fn.apply(null, args);
    });
  };
  asyncSetImmediate = typeof setImmediate === func ? setImmediate : delay;
  if (typeof process === obj && typeof process.nextTick === func) {
    nextTick = /^v0.10/.test(process.version) ? asyncSetImmediate : process.nextTick;
    asyncNextTick = /^v0/.test(process.version) ? asyncSetImmediate : process.nextTick;
  } else asyncNextTick = nextTick = asyncSetImmediate;

  if (safeMode === false)
    nextTick = function(cb) {
      cb();
    };
}

function createArray(array) {
  var size = array.length,
    result = Array(size);

  for (var index = -1; ++index < size; ) result[index] = array[index];

  return result;
}

function slice(array, start) {
  var size = array.length - start;
  if (size <= 0) return [];

  var result = Array(size);

  for (var index = -1; ++index < size; ) result[index] = array[index + start];

  return result;
}

function objectClone(object) {
  var result = {};

  for (var keys = nativeKeys(object), size = keys.length, index = -1; ++index < size; ) {
    var key = keys[index];
    result[key] = object[key];
  }
  return result;
}

function compact(array) {
  var result = [];

  for (var index = -1, size = array.length; ++index < size; ) {
    var value = array[index];
    if (value) result[result.length] = value;
  }
  return result;
}

function reverse(array) {
  var size = array.length,
    result = Array(size);

  for (var index = -1, resIndex = size; ++index < size; ) result[--resIndex] = array[index];

  return result;
}

function has(object, key) {
  return object.hasOwnProperty(key);
}

function notInclude(array, target) {
  for (var index = -1, size = array.length; ++index < size; )
    if (array[index] === target) return false;

  return true;
}

function arrayEachSync(array, iterator) {
  for (var index = -1, size = array.length; ++index < size; ) iterator(array[index], index);

  return array;
}

function baseEachSync(object, iterator, keys) {
  for (var index = -1, size = keys.length; ++index < size; ) {
    var key = keys[index];
    iterator(object[key], key);
  }
  return object;
}

function timesSync(n, iterator) {
  for (var index = -1; ++index < n; ) iterator(index);
}

function sortByCriteria(array, criteria) {
  var i,
    l = array.length,
    indices = Array(l);
  for (i = 0; i < l; i++) indices[i] = i;

  quickSort(criteria, 0, l - 1, indices);
  var result = Array(l);
  for (var n = 0; n < l; n++) {
    i = indices[n];
    result[n] = i === void 0 ? array[n] : array[i];
  }
  return result;
}

function partition(array, i, j, mid, indices) {
  var l = i;
  for (var r = j; l <= r; ) {
    i = l;
    while (l < r && array[l] < mid) l++;

    while (r >= i && array[r] >= mid) r--;

    if (l > r) break;

    swap(array, indices, l++, r--);
  }
  return l;
}

function swap(array, indices, l, r) {
  var n = array[l];
  array[l] = array[r];
  array[r] = n;
  var i = indices[l];
  indices[l] = indices[r];
  indices[r] = i;
}

function quickSort(array, i, j, indices) {
  if (i === j) return;

  var k = i;
  while (++k <= j && array[i] === array[k]) {
    var l = k - 1;
    if (indices[l] > indices[k]) {
      var index = indices[l];
      indices[l] = indices[k];
      indices[k] = index;
    }
  }
  if (k > j) return;

  k = partition(array, i, j, array[array[i] > array[k] ? i : k], indices);
  quickSort(array, i, k - 1, indices);
  quickSort(array, k, j, indices);
}

function makeConcatResult(array) {
  var result = [];
  arrayEachSync(array, function(value) {
    if (value === noop) return;

    isArray(value) ? nativePush.apply(result, value) : result.push(value);
  });
  return result;
}

function arrayEach(array, iterator, callback) {
  var index = -1,
    size = array.length;

  if (iterator.length === 3)
    while (++index < size) iterator(array[index], index, onlyOnce(callback));
  else while (++index < size) iterator(array[index], onlyOnce(callback));
}

function baseEach(object, iterator, callback, keys) {
  var key,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size) iterator(object[(key = keys[index])], key, onlyOnce(callback));
  else while (++index < size) iterator(object[keys[index]], onlyOnce(callback));
}

function symbolEach(collection, iterator, callback) {
  var item,
    iter = collection[iteratorSymbol](),
    index = 0;
  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator(item.value, index++, onlyOnce(callback));
  else
    while ((item = iter.next()).done === false) {
      index++;
      iterator(item.value, onlyOnce(callback));
    }

  return index;
}

function arrayEachResult(array, result, iterator, callback) {
  var index = -1,
    size = array.length;

  if (iterator.length === 4)
    while (++index < size) iterator(result, array[index], index, onlyOnce(callback));
  else while (++index < size) iterator(result, array[index], onlyOnce(callback));
}

function baseEachResult(object, result, iterator, callback, keys) {
  var key,
    index = -1,
    size = keys.length;

  if (iterator.length === 4)
    while (++index < size)
      iterator(result, object[(key = keys[index])], key, onlyOnce(callback));
  else while (++index < size) iterator(result, object[keys[index]], onlyOnce(callback));
}

function symbolEachResult(collection, result, iterator, callback) {
  var item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 4)
    while ((item = iter.next()).done === false)
      iterator(result, item.value, index++, onlyOnce(callback));
  else
    while ((item = iter.next()).done === false) {
      index++;
      iterator(result, item.value, onlyOnce(callback));
    }

  return index;
}

function arrayEachFunc(array, createCallback) {
  for (var index = -1, size = array.length; ++index < size; )
    array[index](createCallback(index));
}

function baseEachFunc(object, createCallback, keys) {
  for (var key, index = -1, size = keys.length; ++index < size; )
    object[(key = keys[index])](createCallback(key));
}

function arrayEachIndex(array, iterator, createCallback) {
  var index = -1,
    size = array.length;

  if (iterator.length === 3)
    while (++index < size) iterator(array[index], index, createCallback(index));
  else while (++index < size) iterator(array[index], createCallback(index));
}

function baseEachIndex(object, iterator, createCallback, keys) {
  var key,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size) iterator(object[(key = keys[index])], key, createCallback(index));
  else while (++index < size) iterator(object[keys[index]], createCallback(index));
}

function symbolEachIndex(collection, iterator, createCallback) {
  var item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator(item.value, index, createCallback(index++));
  else
    while ((item = iter.next()).done === false) iterator(item.value, createCallback(index++));

  return index;
}

function baseEachKey(object, iterator, createCallback, keys) {
  var key,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size) iterator(object[(key = keys[index])], key, createCallback(key));
  else while (++index < size) iterator(object[(key = keys[index])], createCallback(key));
}

function symbolEachKey(collection, iterator, createCallback) {
  var item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator(item.value, index, createCallback(index++));
  else
    while ((item = iter.next()).done === false) iterator(item.value, createCallback(index++));

  return index;
}

function arrayEachValue(array, iterator, createCallback) {
  var value,
    index = -1,
    size = array.length;

  if (iterator.length === 3)
    while (++index < size) iterator((value = array[index]), index, createCallback(value));
  else while (++index < size) iterator((value = array[index]), createCallback(value));
}

function baseEachValue(object, iterator, createCallback, keys) {
  var key, value,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size)
      iterator((value = object[(key = keys[index])]), key, createCallback(value));
  else
    while (++index < size) iterator((value = object[keys[index]]), createCallback(value));
}

function symbolEachValue(collection, iterator, createCallback) {
  var value, item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator((value = item.value), index++, createCallback(value));
  else
    while ((item = iter.next()).done === false) {
      index++;
      iterator((value = item.value), createCallback(value));
    }

  return index;
}

function arrayEachIndexValue(array, iterator, createCallback) {
  var value,
    index = -1,
    size = array.length;

  if (iterator.length === 3)
    while (++index < size)
      iterator((value = array[index]), index, createCallback(index, value));
  else
    while (++index < size) iterator((value = array[index]), createCallback(index, value));
}

function baseEachIndexValue(object, iterator, createCallback, keys) {
  var key, value,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size)
      iterator((value = object[(key = keys[index])]), key, createCallback(index, value));
  else
    while (++index < size)
      iterator((value = object[keys[index]]), createCallback(index, value));
}

function symbolEachIndexValue(collection, iterator, createCallback) {
  var value, item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator((value = item.value), index, createCallback(index++, value));
  else
    while ((item = iter.next()).done === false)
      iterator((value = item.value), createCallback(index++, value));

  return index;
}

function baseEachKeyValue(object, iterator, createCallback, keys) {
  var key, value,
    index = -1,
    size = keys.length;

  if (iterator.length === 3)
    while (++index < size)
      iterator((value = object[(key = keys[index])]), key, createCallback(key, value));
  else
    while (++index < size)
      iterator((value = object[(key = keys[index])]), createCallback(key, value));
}

function symbolEachKeyValue(collection, iterator, createCallback) {
  var value, item,
    index = 0,
    iter = collection[iteratorSymbol]();

  if (iterator.length === 3)
    while ((item = iter.next()).done === false)
      iterator((value = item.value), index, createCallback(index++, value));
  else
    while ((item = iter.next()).done === false)
      iterator((value = item.value), createCallback(index++, value));

  return index;
}

function onlyOnce(func) {
  return function(err, res) {
    var fn = func;
    func = throwError;
    fn(err, res);
  };
}

function once(func) {
  return function(err, res) {
    var fn = func;
    func = noop;
    fn(err, res);
  };
}

function createEach(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    callback = once(callback || noop);
    var size, keys,
      completed = 0;
    if (isArray(collection)) {
      size = collection.length;
      arrayEach(collection, iterator, done);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol])
      (size = symbolEach(collection, iterator, done)) && size === completed && callback(null);
    else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      baseEach(collection, iterator, done, keys);
    }
    size || callback(null);

    function done(err, bool) {
      err
        ? (callback = once(callback))(err)
        : ++completed === size
        ? callback(null)
        : bool !== false || (callback = once(callback))(null);
    }
  };
}

function createMap(arrayEach, baseEach, symbolEach, useArray) {
  var init, clone;
  if (useArray) {
    init = Array;
    clone = createArray;
  } else {
    init = function() {
      return {};
    };
    clone = objectClone;
  }

  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, keys, result,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      result = init(size);
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      result = init(0);
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, result);
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      result = init(size);
      baseEach(collection, iterator, createCallback, keys);
    }
    size || callback(null, init());

    function createCallback(key) {
      return function(err, res) {
        key !== null || throwError();

        if (err) {
          key = null;
          (callback = once(callback))(err, clone(result));
          return;
        }
        result[key] = res;
        key = null;
        ++completed !== size || callback(null, result);
      };
    }
  };
}

function createFilter(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, keys, result,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      result = Array(size);
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      result = [];
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, compact(result));
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      result = Array(size);
      baseEach(collection, iterator, createCallback, keys);
    }
    if (!size) return callback(null, []);

    function createCallback(index, value) {
      return function(err, res) {
        index !== null || throwError();

        if (err) {
          index = null;
          (callback = once(callback))(err);
          return;
        }
        if (!!res === bool) result[index] = value;

        index = null;
        ++completed !== size || callback(null, compact(result));
      };
    }
  };
}

function createFilterSeries(bool) {
  return function(collection, iterator, callback) {
    callback = onlyOnce(callback || noop);
    var size, key, value, keys, iter, item, iterate;
    var sync = false,
      completed = 0,
      result = [];

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size) return callback(null, []);

    iterate();

    function arrayIterator() {
      value = collection[completed];
      iterator(value, done);
    }

    function arrayIteratorWithIndex() {
      value = collection[completed];
      iterator(value, completed, done);
    }

    function symbolIterator() {
      item = iter.next();
      value = item.value;
      item.done ? callback(null, result) : iterator(value, done);
    }

    function symbolIteratorWithKey() {
      item = iter.next();
      value = item.value;
      item.done ? callback(null, result) : iterator(value, completed, done);
    }

    function objectIterator() {
      key = keys[completed];
      value = collection[key];
      iterator(value, done);
    }

    function objectIteratorWithKey() {
      key = keys[completed];
      value = collection[key];
      iterator(value, key, done);
    }

    function done(err, res) {
      if (err) {
        callback(err);
        return;
      }
      if (!!res === bool) result[result.length] = value;

      if (++completed === size) {
        iterate = throwError;
        callback(null, result);
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    }
  };
}

function createFilterLimit(bool) {
  return function(collection, limit, iterator, callback) {
    callback = callback || noop;
    var size, index, key, value, keys, iter, item, iterate, result;
    var sync = false,
      started = 0,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      result = [];
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size || isNaN(limit) || limit < 1) return callback(null, []);

    result = result || Array(size);
    timesSync(limit > size ? size : limit, iterate);

    function arrayIterator() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, createCallback(value, index));
      }
    }

    function arrayIteratorWithIndex() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, index, createCallback(value, index));
      }
    }

    function symbolIterator() {
      if ((item = iter.next()).done === false) {
        value = item.value;
        iterator(value, createCallback(value, started++));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null, compact(result));
      }
    }

    function symbolIteratorWithKey() {
      if ((item = iter.next()).done === false) {
        value = item.value;
        iterator(value, started, createCallback(value, started++));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null, compact(result));
      }
    }

    function objectIterator() {
      if ((index = started++) < size) {
        value = collection[keys[index]];
        iterator(value, createCallback(value, index));
      }
    }

    function objectIteratorWithKey() {
      if ((index = started++) < size) {
        key = keys[index];
        value = collection[key];
        iterator(value, key, createCallback(value, index));
      }
    }

    function createCallback(value, index) {
      return function(err, res) {
        index !== null || throwError();

        if (err) {
          index = null;
          iterate = noop;
          (callback = once(callback))(err);
          return;
        }
        if (!!res === bool) result[index] = value;

        index = null;
        if (++completed === size) (callback = onlyOnce(callback))(null, compact(result));
        else if (sync) nextTick(iterate);
        else {
          sync = true;
          iterate();
        }
        sync = false;
      };
    }
  };
}

function eachSeries(collection, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var size, key, keys, iter, item, iterate;
  var sync = false,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null);

  iterate();

  function arrayIterator() {
    iterator(collection[completed], done);
  }

  function arrayIteratorWithIndex() {
    iterator(collection[completed], completed, done);
  }

  function symbolIterator() {
    (item = iter.next()).done ? callback(null) : iterator(item.value, done);
  }

  function symbolIteratorWithKey() {
    (item = iter.next()).done ? callback(null) : iterator(item.value, completed, done);
  }

  function objectIterator() {
    iterator(collection[keys[completed]], done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    iterator(collection[key], key, done);
  }

  function done(err, bool) {
    if (err) callback(err);
    else if (++completed === size || bool === false) {
      iterate = throwError;
      callback(null);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function eachLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, index, key, keys, iter, item, iterate;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else {
    if (typeof collection !== obj) return callback(null);

    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }

  if (!size || isNaN(limit) || limit < 1) return callback(null);

  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    started < size && iterator(collection[started++], done);
  }

  function arrayIteratorWithIndex() {
    (index = started++) < size && iterator(collection[index], index, done);
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) {
      started++;
      iterator(item.value, done);
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null);
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false) iterator(item.value, started++, done);
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null);
    }
  }

  function objectIterator() {
    started < size && iterator(collection[keys[started++]], done);
  }

  function objectIteratorWithKey() {
    if ((index = started++) < size) {
      key = keys[index];
      iterator(collection[key], key, done);
    }
  }

  function done(err, bool) {
    if (err || bool === false) {
      iterate = noop;
      (callback = once(callback))(err);
    } else if (++completed === size) {
      iterator = noop;
      iterate = throwError;
      (callback = onlyOnce(callback))(null);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function mapSeries(collection, iterator, callback) {
  callback = callback || noop;
  var size, key, keys, iter, item, result, iterate;
  var sync = false,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    result = [];
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, []);

  result = result || Array(size);
  iterate();

  function arrayIterator() {
    iterator(collection[completed], done);
  }

  function arrayIteratorWithIndex() {
    iterator(collection[completed], completed, done);
  }

  function symbolIterator() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }

  function symbolIteratorWithKey() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  }

  function objectIterator() {
    iterator(collection[keys[completed]], done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    iterator(collection[key], key, done);
  }

  function done(err, res) {
    if (err) {
      iterate = throwError;
      (callback = onlyOnce(callback))(err, createArray(result));
      return;
    }
    result[completed] = res;
    if (++completed === size) {
      iterate = throwError;
      callback(null, result);
      callback = throwError;
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function mapLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, index, key, keys, iter, item, result, iterate;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    result = [];
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, []);

  result = result || Array(size);
  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    (index = started++) < size && iterator(collection[index], createCallback(index));
  }

  function arrayIteratorWithIndex() {
    (index = started++) < size && iterator(collection[index], index, createCallback(index));
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) iterator(item.value, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false)
      iterator(item.value, started, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function objectIterator() {
    (index = started++) < size && iterator(collection[keys[index]], createCallback(index));
  }

  function objectIteratorWithKey() {
    if ((index = started++) < size) {
      key = keys[index];
      iterator(collection[key], key, createCallback(index));
    }
  }

  function createCallback(index) {
    return function(err, res) {
      index !== null || throwError();

      if (err) {
        index = null;
        iterate = noop;
        (callback = once(callback))(err, createArray(result));
        return;
      }
      result[index] = res;
      index = null;
      if (++completed === size) {
        iterate = throwError;
        callback(null, result);
        callback = throwError;
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function mapValuesSeries(collection, iterator, callback) {
  callback = callback || noop;
  var size, key, keys, iter, item, iterate;
  var sync = false,
    result = {},
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, result);

  iterate();

  function arrayIterator() {
    key = completed;
    iterator(collection[completed], done);
  }

  function arrayIteratorWithIndex() {
    key = completed;
    iterator(collection[completed], completed, done);
  }

  function symbolIterator() {
    key = completed;
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }

  function symbolIteratorWithKey() {
    key = completed;
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  }

  function objectIterator() {
    key = keys[completed];
    iterator(collection[key], done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    iterator(collection[key], key, done);
  }

  function done(err, res) {
    if (err) {
      iterate = throwError;
      (callback = onlyOnce(callback))(err, objectClone(result));
      return;
    }
    result[key] = res;
    if (++completed === size) {
      iterate = throwError;
      callback(null, result);
      callback = throwError;
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function mapValuesLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, index, key, keys, iter, item, iterate;
  var sync = false,
    result = {},
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, result);

  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    (index = started++) < size && iterator(collection[index], createCallback(index));
  }

  function arrayIteratorWithIndex() {
    (index = started++) < size && iterator(collection[index], index, createCallback(index));
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) iterator(item.value, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false)
      iterator(item.value, started, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function objectIterator() {
    if ((index = started++) < size) {
      key = keys[index];
      iterator(collection[key], createCallback(key));
    }
  }

  function objectIteratorWithKey() {
    if ((index = started++) < size) {
      key = keys[index];
      iterator(collection[key], key, createCallback(key));
    }
  }

  function createCallback(key) {
    return function(err, res) {
      key !== null || throwError();

      if (err) {
        key = null;
        iterate = noop;
        (callback = once(callback))(err, objectClone(result));
        return;
      }
      result[key] = res;
      key = null;
      if (++completed === size) callback(null, result);
      else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function createDetect(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, keys,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null);
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      baseEach(collection, iterator, createCallback, keys);
    }
    size || callback(null);

    function createCallback(value) {
      var called = false;
      return function(err, res) {
        called && throwError();

        called = true;
        err
          ? (callback = once(callback))(err)
          : !!res === bool
          ? (callback = once(callback))(null, value)
          : ++completed !== size || callback(null);
      };
    }
  };
}

function createDetectSeries(bool) {
  return function(collection, iterator, callback) {
    callback = onlyOnce(callback || noop);
    var size, key, value, keys, iter, item, iterate;
    var sync = false,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size) return callback(null);

    iterate();

    function arrayIterator() {
      value = collection[completed];
      iterator(value, done);
    }

    function arrayIteratorWithIndex() {
      value = collection[completed];
      iterator(value, completed, done);
    }

    function symbolIterator() {
      item = iter.next();
      value = item.value;
      item.done ? callback(null) : iterator(value, done);
    }

    function symbolIteratorWithKey() {
      item = iter.next();
      value = item.value;
      item.done ? callback(null) : iterator(value, completed, done);
    }

    function objectIterator() {
      value = collection[keys[completed]];
      iterator(value, done);
    }

    function objectIteratorWithKey() {
      key = keys[completed];
      value = collection[key];
      iterator(value, key, done);
    }

    function done(err, res) {
      if (err) callback(err);
      else if (!!res === bool) {
        iterate = throwError;
        callback(null, value);
      } else if (++completed === size) {
        iterate = throwError;
        callback(null);
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    }
  };
}

function createDetectLimit(bool) {
  return function(collection, limit, iterator, callback) {
    callback = callback || noop;
    var size, index, key, value, keys, iter, item, iterate;
    var sync = false,
      started = 0,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size || isNaN(limit) || limit < 1) return callback(null);

    timesSync(limit > size ? size : limit, iterate);

    function arrayIterator() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, createCallback(value));
      }
    }

    function arrayIteratorWithIndex() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, index, createCallback(value));
      }
    }

    function symbolIterator() {
      if ((item = iter.next()).done === false) {
        started++;
        value = item.value;
        iterator(value, createCallback(value));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null);
      }
    }

    function symbolIteratorWithKey() {
      if ((item = iter.next()).done === false) {
        value = item.value;
        iterator(value, started++, createCallback(value));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null);
      }
    }

    function objectIterator() {
      if ((index = started++) < size) {
        value = collection[keys[index]];
        iterator(value, createCallback(value));
      }
    }

    function objectIteratorWithKey() {
      if (started < size) {
        key = keys[started++];
        value = collection[key];
        iterator(value, key, createCallback(value));
      }
    }

    function createCallback(value) {
      var called = false;
      return function(err, res) {
        called && throwError();

        called = true;
        if (err) {
          iterate = noop;
          (callback = once(callback))(err);
        } else if (!!res === bool) {
          iterate = noop;
          (callback = once(callback))(null, value);
        } else if (++completed === size) callback(null);
        else if (sync) nextTick(iterate);
        else {
          sync = true;
          iterate();
        }
        sync = false;
      };
    }
  };
}

function createPick(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, keys,
      completed = 0,
      result = {};

    if (isArray(collection)) {
      size = collection.length;
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, result);
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      baseEach(collection, iterator, createCallback, keys);
    }
    if (!size) return callback(null, {});

    function createCallback(key, value) {
      return function(err, res) {
        key !== null || throwError();

        if (err) {
          key = null;
          (callback = once(callback))(err, objectClone(result));
          return;
        }
        if (!!res === bool) result[key] = value;

        key = null;
        ++completed !== size || callback(null, result);
      };
    }
  };
}

function createPickSeries(bool) {
  return function(collection, iterator, callback) {
    callback = onlyOnce(callback || noop);
    var size, key, value, keys, iter, item, iterate;
    var sync = false,
      result = {},
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size) return callback(null, {});

    iterate();

    function arrayIterator() {
      key = completed;
      value = collection[completed];
      iterator(value, done);
    }

    function arrayIteratorWithIndex() {
      key = completed;
      value = collection[completed];
      iterator(value, completed, done);
    }

    function symbolIterator() {
      key = completed;
      item = iter.next();
      value = item.value;
      item.done ? callback(null, result) : iterator(value, done);
    }

    function symbolIteratorWithKey() {
      key = completed;
      item = iter.next();
      value = item.value;
      item.done ? callback(null, result) : iterator(value, key, done);
    }

    function objectIterator() {
      key = keys[completed];
      value = collection[key];
      iterator(value, done);
    }

    function objectIteratorWithKey() {
      key = keys[completed];
      value = collection[key];
      iterator(value, key, done);
    }

    function done(err, res) {
      if (err) {
        callback(err, result);
        return;
      }
      if (!!res === bool) result[key] = value;

      if (++completed === size) {
        iterate = throwError;
        callback(null, result);
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    }
  };
}

function createPickLimit(bool) {
  return function(collection, limit, iterator, callback) {
    callback = callback || noop;
    var size, index, key, value, keys, iter, item, iterate;
    var sync = false,
      result = {},
      started = 0,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = Infinity;
      iter = collection[iteratorSymbol]();
      iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
    }
    if (!size || isNaN(limit) || limit < 1) return callback(null, {});

    timesSync(limit > size ? size : limit, iterate);

    function arrayIterator() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, createCallback(value, index));
      }
    }

    function arrayIteratorWithIndex() {
      if ((index = started++) < size) {
        value = collection[index];
        iterator(value, index, createCallback(value, index));
      }
    }

    function symbolIterator() {
      if ((item = iter.next()).done === false) {
        value = item.value;
        iterator(value, createCallback(value, started++));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null, result);
      }
    }

    function symbolIteratorWithKey() {
      if ((item = iter.next()).done === false) {
        value = item.value;
        iterator(value, started, createCallback(value, started++));
      } else if (completed === started && iterator !== noop) {
        iterator = noop;
        callback(null, result);
      }
    }

    function objectIterator() {
      if (started < size) {
        key = keys[started++];
        value = collection[key];
        iterator(value, createCallback(value, key));
      }
    }

    function objectIteratorWithKey() {
      if (started < size) {
        key = keys[started++];
        value = collection[key];
        iterator(value, key, createCallback(value, key));
      }
    }

    function createCallback(value, key) {
      return function(err, res) {
        key !== null || throwError();

        if (err) {
          key = null;
          iterate = noop;
          (callback = once(callback))(err, objectClone(result));
          return;
        }
        if (!!res === bool) result[key] = value;

        key = null;
        if (++completed === size) {
          iterate = throwError;
          (callback = onlyOnce(callback))(null, result);
        } else if (sync) nextTick(iterate);
        else {
          sync = true;
          iterate();
        }
        sync = false;
      };
    }
  };
}

function reduce(collection, result, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var size, key, keys, iter, item, iterate;
  var sync = false,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 4 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, result);

  iterate(result);

  function arrayIterator(result) {
    iterator(result, collection[completed], done);
  }

  function arrayIteratorWithIndex(result) {
    iterator(result, collection[completed], completed, done);
  }

  function symbolIterator(result) {
    (item = iter.next()).done ? callback(null, result) : iterator(result, item.value, done);
  }

  function symbolIteratorWithKey(result) {
    item = iter.next();
    item.done ? callback(null, result) : iterator(result, item.value, completed, done);
  }

  function objectIterator(result) {
    iterator(result, collection[keys[completed]], done);
  }

  function objectIteratorWithKey(result) {
    key = keys[completed];
    iterator(result, collection[key], key, done);
  }

  function done(err, result) {
    if (err) callback(err, result);
    else if (++completed === size) {
      iterator = throwError;
      callback(null, result);
    } else if (sync)
      nextTick(function() {
        iterate(result);
      });
    else {
      sync = true;
      iterate(result);
    }
    sync = false;
  }
}

function reduceRight(collection, result, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var resIndex, index, key, keys, iter, item, col, iterate;
  var sync = false;

  if (isArray(collection)) {
    resIndex = collection.length;
    iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    col = [];
    iter = collection[iteratorSymbol]();
    index = -1;
    while ((item = iter.next()).done === false) col[++index] = item.value;

    collection = col;
    resIndex = col.length;
    iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    resIndex = keys.length;
    iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
  }
  if (!resIndex) return callback(null, result);

  iterate(result);

  function arrayIterator(result) {
    iterator(result, collection[--resIndex], done);
  }

  function arrayIteratorWithIndex(result) {
    iterator(result, collection[--resIndex], resIndex, done);
  }

  function objectIterator(result) {
    iterator(result, collection[keys[--resIndex]], done);
  }

  function objectIteratorWithKey(result) {
    key = keys[--resIndex];
    iterator(result, collection[key], key, done);
  }

  function done(err, result) {
    if (err) callback(err, result);
    else if (resIndex === 0) {
      iterate = throwError;
      callback(null, result);
    } else if (sync)
      nextTick(function() {
        iterate(result);
      });
    else {
      sync = true;
      iterate(result);
    }
    sync = false;
  }
}

function createTransform(arrayEach, baseEach, symbolEach) {
  return function(collection, accumulator, iterator, callback) {
    if (arguments.length === 3) {
      callback = iterator;
      iterator = accumulator;
      accumulator = void 0;
    }
    callback = callback || noop;
    var size, keys, result,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      result = accumulator !== void 0 ? accumulator : [];
      arrayEach(collection, result, iterator, done);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      result = accumulator !== void 0 ? accumulator : {};
      size = symbolEach(collection, result, iterator, done);
      size && size === completed && callback(null, result);
    } else if (typeof collection === obj) {
      keys = nativeKeys(collection);
      size = keys.length;
      result = accumulator !== void 0 ? accumulator : {};
      baseEach(collection, result, iterator, done, keys);
    }
    size || callback(null, accumulator !== void 0 ? accumulator : result || {});

    function done(err, bool) {
      if (err) {
        callback = once(callback);
        callback(err, isArray(result) ? createArray(result) : objectClone(result));
      } else if (++completed === size) callback(null, result);
      else if (bool === false) {
        callback = once(callback);
        callback(null, isArray(result) ? createArray(result) : objectClone(result));
      }
    }
  };
}

function transformSeries(collection, accumulator, iterator, callback) {
  if (arguments.length === 3) {
    callback = iterator;
    iterator = accumulator;
    accumulator = void 0;
  }
  callback = onlyOnce(callback || noop);
  var size, key, keys, iter, item, iterate, result;
  var sync = false,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    result = accumulator !== void 0 ? accumulator : [];
    iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    result = accumulator !== void 0 ? accumulator : {};
    iterate = iterator.length === 4 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    result = accumulator !== void 0 ? accumulator : {};
    iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, accumulator !== void 0 ? accumulator : result || {});

  iterate();

  function arrayIterator() {
    iterator(result, collection[completed], done);
  }

  function arrayIteratorWithIndex() {
    iterator(result, collection[completed], completed, done);
  }

  function symbolIterator() {
    (item = iter.next()).done ? callback(null, result) : iterator(result, item.value, done);
  }

  function symbolIteratorWithKey() {
    item = iter.next();
    item.done ? callback(null, result) : iterator(result, item.value, completed, done);
  }

  function objectIterator() {
    iterator(result, collection[keys[completed]], done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    iterator(result, collection[key], key, done);
  }

  function done(err, bool) {
    if (err) callback(err, result);
    else if (++completed === size || bool === false) {
      iterate = throwError;
      callback(null, result);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function transformLimit(collection, limit, accumulator, iterator, callback) {
  if (arguments.length === 4) {
    callback = iterator;
    iterator = accumulator;
    accumulator = void 0;
  }
  callback = callback || noop;
  var size, index, key, keys, iter, item, iterate, result;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    result = accumulator !== void 0 ? accumulator : [];
    iterate = iterator.length === 4 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    result = accumulator !== void 0 ? accumulator : {};
    iterate = iterator.length === 4 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    result = accumulator !== void 0 ? accumulator : {};
    iterate = iterator.length === 4 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1)
    return callback(null, accumulator !== void 0 ? accumulator : result || {});

  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    (index = started++) < size && iterator(result, collection[index], onlyOnce(done));
  }

  function arrayIteratorWithIndex() {
    (index = started++) < size && iterator(result, collection[index], index, onlyOnce(done));
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) {
      started++;
      iterator(result, item.value, onlyOnce(done));
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false)
      iterator(result, item.value, started++, onlyOnce(done));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function objectIterator() {
    (index = started++) < size && iterator(result, collection[keys[index]], onlyOnce(done));
  }

  function objectIteratorWithKey() {
    if ((index = started++) < size) {
      key = keys[index];
      iterator(result, collection[key], key, onlyOnce(done));
    }
  }

  function done(err, bool) {
    if (err || bool === false) {
      iterate = noop;
      callback(err || null, isArray(result) ? createArray(result) : objectClone(result));
      callback = noop;
    } else if (++completed === size) {
      iterator = noop;
      callback(null, result);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function createSortBy(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, array, criteria,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      array = Array(size);
      criteria = Array(size);
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      array = [];
      criteria = [];
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, sortByCriteria(array, criteria));
    } else if (typeof collection === obj) {
      var keys = nativeKeys(collection);
      size = keys.length;
      array = Array(size);
      criteria = Array(size);
      baseEach(collection, iterator, createCallback, keys);
    }
    size || callback(null, []);

    function createCallback(index, value) {
      var called = false;
      array[index] = value;
      return function(err, criterion) {
        called && throwError();

        called = true;
        criteria[index] = criterion;
        err
          ? (callback = once(callback))(err)
          : ++completed !== size || callback(null, sortByCriteria(array, criteria));
      };
    }
  };
}

function sortBySeries(collection, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var size, key, value, keys, iter, item, array, criteria, iterate;
  var sync = false,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    array = collection;
    criteria = Array(size);
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    array = [];
    criteria = [];
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    array = Array(size);
    criteria = Array(size);
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, []);

  iterate();

  function arrayIterator() {
    value = collection[completed];
    iterator(value, done);
  }

  function arrayIteratorWithIndex() {
    value = collection[completed];
    iterator(value, completed, done);
  }

  function symbolIterator() {
    if ((item = iter.next()).done) return callback(null, sortByCriteria(array, criteria));

    value = item.value;
    array[completed] = value;
    iterator(value, done);
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done) return callback(null, sortByCriteria(array, criteria));

    value = item.value;
    array[completed] = value;
    iterator(value, completed, done);
  }

  function objectIterator() {
    value = collection[keys[completed]];
    array[completed] = value;
    iterator(value, done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    value = collection[key];
    array[completed] = value;
    iterator(value, key, done);
  }

  function done(err, criterion) {
    criteria[completed] = criterion;
    if (err) callback(err);
    else if (++completed === size) {
      iterate = throwError;
      callback(null, sortByCriteria(array, criteria));
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function sortByLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, index, key, value, array, keys, iter, item, criteria, iterate;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    array = collection;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    array = [];
    criteria = [];
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    array = Array(size);
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, []);

  criteria = criteria || Array(size);
  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    if (started < size) {
      value = collection[started];
      iterator(value, createCallback(value, started++));
    }
  }

  function arrayIteratorWithIndex() {
    if ((index = started++) < size) {
      value = collection[index];
      iterator(value, index, createCallback(value, index));
    }
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) {
      value = item.value;
      array[started] = value;
      iterator(value, createCallback(value, started++));
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, sortByCriteria(array, criteria));
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false) {
      value = item.value;
      array[started] = value;
      iterator(value, started, createCallback(value, started++));
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, sortByCriteria(array, criteria));
    }
  }

  function objectIterator() {
    if (started < size) {
      value = collection[keys[started]];
      array[started] = value;
      iterator(value, createCallback(value, started++));
    }
  }

  function objectIteratorWithKey() {
    if (started < size) {
      key = keys[started];
      value = collection[key];
      array[started] = value;
      iterator(value, key, createCallback(value, started++));
    }
  }

  function createCallback(value, index) {
    var called = false;
    return function(err, criterion) {
      called && throwError();

      called = true;
      criteria[index] = criterion;
      if (err) {
        iterate = noop;
        callback(err);
        callback = noop;
      } else if (++completed === size) callback(null, sortByCriteria(array, criteria));
      else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function some(collection, iterator, callback) {
  callback = callback || noop;
  detect(collection, iterator, done);

  function done(err, res) {
    if (err) return callback(err);

    callback(null, !!res);
  }
}

function someSeries(collection, iterator, callback) {
  callback = callback || noop;
  detectSeries(collection, iterator, done);

  function done(err, res) {
    if (err) return callback(err);

    callback(null, !!res);
  }
}

function someLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  detectLimit(collection, limit, iterator, done);

  function done(err, res) {
    if (err) return callback(err);

    callback(null, !!res);
  }
}

function createEvery(arrayEach, baseEach, symbolEach) {
  var deny = createDetect(arrayEach, baseEach, symbolEach, false);

  return function(collection, iterator, callback) {
    callback = callback || noop;
    deny(collection, iterator, done);

    function done(err, res) {
      if (err) return callback(err);

      callback(null, !res);
    }
  };
}

function createEverySeries() {
  var denySeries = createDetectSeries(false);

  return function(collection, iterator, callback) {
    callback = callback || noop;
    denySeries(collection, iterator, done);

    function done(err, res) {
      if (err) return callback(err);

      callback(null, !res);
    }
  };
}

function createEveryLimit() {
  var denyLimit = createDetectLimit(false);

  return function(collection, limit, iterator, callback) {
    callback = callback || noop;
    denyLimit(collection, limit, iterator, done);

    function done(err, res) {
      if (err) return callback(err);

      callback(null, !res);
    }
  };
}

function createConcat(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size, result,
      completed = 0;

    if (isArray(collection)) {
      size = collection.length;
      result = Array(size);
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      result = [];
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, result);
    } else if (typeof collection === obj) {
      var keys = nativeKeys(collection);
      size = keys.length;
      result = Array(size);
      baseEach(collection, iterator, createCallback, keys);
    }
    size || callback(null, []);

    function createCallback(index) {
      return function(err, res) {
        index !== null || throwError();

        if (err) {
          index = null;
          callback = once(callback);
          arrayEachSync(result, function(array, index) {
            if (array === void 0) result[index] = noop;
          });
          callback(err, makeConcatResult(result));
          return;
        }
        switch (arguments.length) {
          case 0:
          case 1:
            result[index] = noop;
            break;
          case 2:
            result[index] = res;
            break;
          default:
            result[index] = slice(arguments, 1);
            break;
        }
        index = null;
        ++completed !== size || callback(null, makeConcatResult(result));
      };
    }
  };
}

function concatSeries(collection, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var size, key, keys, iter, item, iterate;
  var sync = false,
    result = [],
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, result);

  iterate();

  function arrayIterator() {
    iterator(collection[completed], done);
  }

  function arrayIteratorWithIndex() {
    iterator(collection[completed], completed, done);
  }

  function symbolIterator() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }

  function symbolIteratorWithKey() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  }

  function objectIterator() {
    iterator(collection[keys[completed]], done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    iterator(collection[key], key, done);
  }

  function done(err, array) {
    isArray(array)
      ? nativePush.apply(result, array)
      : arguments.length < 2 || nativePush.apply(result, slice(arguments, 1));

    if (err) callback(err, result);
    else if (++completed === size) {
      iterate = throwError;
      callback(null, result);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function concatLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, key, iter, item, iterate, result;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    result = [];
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    var keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, []);

  result = result || Array(size);
  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    started < size && iterator(collection[started], createCallback(started++));
  }

  function arrayIteratorWithIndex() {
    started < size && iterator(collection[started], started, createCallback(started++));
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) iterator(item.value, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, makeConcatResult(result));
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false)
      iterator(item.value, started, createCallback(started++));
    else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, makeConcatResult(result));
    }
  }

  function objectIterator() {
    started < size && iterator(collection[keys[started]], createCallback(started++));
  }

  function objectIteratorWithKey() {
    if (started < size) {
      key = keys[started];
      iterator(collection[key], key, createCallback(started++));
    }
  }

  function createCallback(index) {
    return function(err, res) {
      index !== null || throwError();

      if (err) {
        index = null;
        iterate = noop;
        callback = once(callback);
        arrayEachSync(result, function(array, index) {
          if (array === void 0) result[index] = noop;
        });
        callback(err, makeConcatResult(result));
        return;
      }
      switch (arguments.length) {
        case 0:
        case 1:
          result[index] = noop;
          break;
        case 2:
          result[index] = res;
          break;
        default:
          result[index] = slice(arguments, 1);
          break;
      }
      index = null;
      if (++completed === size) {
        iterate = throwError;
        callback(null, makeConcatResult(result));
        callback = throwError;
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function createGroupBy(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    callback = callback || noop;
    var size,
      completed = 0,
      result = {};

    if (isArray(collection)) {
      size = collection.length;
      arrayEach(collection, iterator, createCallback);
    } else if (!collection);
    else if (iteratorSymbol && collection[iteratorSymbol]) {
      size = symbolEach(collection, iterator, createCallback);
      size && size === completed && callback(null, result);
    } else if (typeof collection === obj) {
      var keys = nativeKeys(collection);
      size = keys.length;
      baseEach(collection, iterator, createCallback, keys);
    }
    size || callback(null, {});

    function createCallback(value) {
      var called = false;
      return function(err, key) {
        called && throwError();

        called = true;
        if (err) {
          (callback = once(callback))(err, objectClone(result));
          return;
        }
        var array = result[key];
        !array ? (result[key] = [value]) : array.push(value);

        ++completed !== size || callback(null, result);
      };
    }
  };
}

function groupBySeries(collection, iterator, callback) {
  callback = onlyOnce(callback || noop);
  var size, key, value, keys, iter, item, iterate;
  var sync = false,
    completed = 0,
    result = {};

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size) return callback(null, result);

  iterate();

  function arrayIterator() {
    value = collection[completed];
    iterator(value, done);
  }

  function arrayIteratorWithIndex() {
    value = collection[completed];
    iterator(value, completed, done);
  }

  function symbolIterator() {
    item = iter.next();
    value = item.value;
    item.done ? callback(null, result) : iterator(value, done);
  }

  function symbolIteratorWithKey() {
    item = iter.next();
    value = item.value;
    item.done ? callback(null, result) : iterator(value, completed, done);
  }

  function objectIterator() {
    value = collection[keys[completed]];
    iterator(value, done);
  }

  function objectIteratorWithKey() {
    key = keys[completed];
    value = collection[key];
    iterator(value, key, done);
  }

  function done(err, key) {
    if (err) {
      iterate = throwError;
      (callback = onlyOnce(callback))(err, objectClone(result));
      return;
    }
    var array = result[key];
    !array ? (result[key] = [value]) : array.push(value);

    if (++completed === size) {
      iterate = throwError;
      callback(null, result);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function groupByLimit(collection, limit, iterator, callback) {
  callback = callback || noop;
  var size, index, key, value, keys, iter, item, iterate;
  var sync = false,
    started = 0,
    completed = 0,
    result = {};

  if (isArray(collection)) {
    size = collection.length;
    iterate = iterator.length === 3 ? arrayIteratorWithIndex : arrayIterator;
  } else if (!collection);
  else if (iteratorSymbol && collection[iteratorSymbol]) {
    size = Infinity;
    iter = collection[iteratorSymbol]();
    iterate = iterator.length === 3 ? symbolIteratorWithKey : symbolIterator;
  } else if (typeof collection === obj) {
    keys = nativeKeys(collection);
    size = keys.length;
    iterate = iterator.length === 3 ? objectIteratorWithKey : objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, result);

  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    if (started < size) {
      value = collection[started++];
      iterator(value, createCallback(value));
    }
  }

  function arrayIteratorWithIndex() {
    if ((index = started++) < size) {
      value = collection[index];
      iterator(value, index, createCallback(value));
    }
  }

  function symbolIterator() {
    if ((item = iter.next()).done === false) {
      started++;
      value = item.value;
      iterator(value, createCallback(value));
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function symbolIteratorWithKey() {
    if ((item = iter.next()).done === false) {
      value = item.value;
      iterator(value, started++, createCallback(value));
    } else if (completed === started && iterator !== noop) {
      iterator = noop;
      callback(null, result);
    }
  }

  function objectIterator() {
    if (started < size) {
      value = collection[keys[started++]];
      iterator(value, createCallback(value));
    }
  }

  function objectIteratorWithKey() {
    if (started < size) {
      key = keys[started++];
      value = collection[key];
      iterator(value, key, createCallback(value));
    }
  }

  function createCallback(value) {
    var called = false;
    return function(err, key) {
      called && throwError();

      called = true;
      if (err) {
        iterate = noop;
        (callback = once(callback))(err, objectClone(result));
        return;
      }
      var array = result[key];
      !array ? (result[key] = [value]) : array.push(value);

      if (++completed === size) callback(null, result);
      else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function createParallel(arrayEach, baseEach) {
  return function(tasks, callback) {
    callback = callback || noop;
    var size, keys, result,
      completed = 0;

    if (isArray(tasks)) {
      size = tasks.length;
      result = Array(size);
      arrayEach(tasks, createCallback);
    } else if (tasks && typeof tasks === obj) {
      keys = nativeKeys(tasks);
      size = keys.length;
      result = {};
      baseEach(tasks, createCallback, keys);
    }
    size || callback(null, result);

    function createCallback(key) {
      return function(err, res) {
        key !== null || throwError();

        if (err) {
          key = null;
          (callback = once(callback))(err, result);
          return;
        }
        result[key] = arguments.length <= 2 ? res : slice(arguments, 1);
        key = null;
        ++completed !== size || callback(null, result);
      };
    }
  };
}

function series(tasks, callback) {
  callback = callback || noop;
  var size, key, keys, result, iterate;
  var sync = false,
    completed = 0;

  if (isArray(tasks)) {
    size = tasks.length;
    result = Array(size);
    iterate = arrayIterator;
  } else {
    if (!tasks || typeof tasks !== obj) return callback(null);

    keys = nativeKeys(tasks);
    size = keys.length;
    result = {};
    iterate = objectIterator;
  }

  if (!size) return callback(null, result);

  iterate();

  function arrayIterator() {
    key = completed;
    tasks[completed](done);
  }

  function objectIterator() {
    key = keys[completed];
    tasks[key](done);
  }

  function done(err, res) {
    if (err) {
      iterate = throwError;
      (callback = onlyOnce(callback))(err, result);
      return;
    }
    result[key] = arguments.length <= 2 ? res : slice(arguments, 1);
    if (++completed === size) {
      iterate = throwError;
      callback(null, result);
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function parallelLimit(tasks, limit, callback) {
  callback = callback || noop;
  var size, index, key, keys, result, iterate;
  var sync = false,
    started = 0,
    completed = 0;

  if (isArray(tasks)) {
    size = tasks.length;
    result = Array(size);
    iterate = arrayIterator;
  } else if (tasks && typeof tasks === obj) {
    keys = nativeKeys(tasks);
    size = keys.length;
    result = {};
    iterate = objectIterator;
  }
  if (!size || isNaN(limit) || limit < 1) return callback(null, result);

  timesSync(limit > size ? size : limit, iterate);

  function arrayIterator() {
    (index = started++) < size && tasks[index](createCallback(index));
  }

  function objectIterator() {
    if (started < size) {
      key = keys[started++];
      tasks[key](createCallback(key));
    }
  }

  function createCallback(key) {
    return function(err, res) {
      key !== null || throwError();

      if (err) {
        key = null;
        iterate = noop;
        (callback = once(callback))(err, result);
        return;
      }
      result[key] = arguments.length <= 2 ? res : slice(arguments, 1);
      key = null;
      if (++completed === size) callback(null, result);
      else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function tryEach(tasks, callback) {
  callback = callback || noop;
  var size, keys, iterate,
    sync = false, // FIXME unused
    completed = 0;

  if (isArray(tasks)) {
    size = tasks.length;
    iterate = arrayIterator;
  } else if (tasks && typeof tasks === obj) {
    keys = nativeKeys(tasks);
    size = keys.length;
    iterate = objectIterator;
  }
  if (!size) return callback(null);

  iterate();

  function arrayIterator() {
    tasks[completed](done);
  }

  function objectIterator() {
    tasks[keys[completed]](done);
  }

  function done(err, res) {
    !err
      ? callback(null, arguments.length <= 2 ? res : slice(arguments, 1))
      : ++completed === size
      ? callback(err)
      : (sync = true) && iterate();

    sync = false;
  }
}

function checkWaterfallTasks(tasks, callback) {
  if (!isArray(tasks)) {
    callback(new Error('First argument to waterfall must be an array of functions'));
    return false;
  }
  if (tasks.length === 0) {
    callback(null);
    return false;
  }
  return true;
}

function waterfallIterator(func, args, next) {
  switch (args.length) {
    case 0:
    case 1:
      return func(next);
    case 2:
      return func(args[1], next);
    case 3:
      return func(args[1], args[2], next);
    case 4:
      return func(args[1], args[2], args[3], next);
    case 5:
      return func(args[1], args[2], args[3], args[4], next);
    case 6:
      return func(args[1], args[2], args[3], args[4], args[5], next);
    default:
      (args = slice(args, 1)).push(next);
      return func.apply(null, args);
  }
}

function waterfall(tasks, callback) {
  if (!checkWaterfallTasks(tasks, (callback = callback || noop))) return;

  var func, args, done, sync;
  var completed = 0,
    size = tasks.length;
  waterfallIterator(tasks[0], [], createCallback(0));

  function iterate() {
    waterfallIterator(func, args, createCallback(func));
  }

  function createCallback(index) {
    return function(err, res) {
      if (index === void 0) {
        callback = noop;
        throwError();
      }
      index = void 0;
      if (err) {
        done = callback;
        callback = throwError;
        done(err);
        return;
      }
      if (++completed === size) {
        done = callback;
        callback = throwError;
        arguments.length <= 2 ? done(err, res) : done.apply(null, createArray(arguments));

        return;
      }
      if (sync) {
        args = arguments;
        func = tasks[completed] || throwError;
        nextTick(iterate);
      } else {
        sync = true;
        waterfallIterator(tasks[completed] || throwError, arguments, createCallback(completed));
      }
      sync = false;
    };
  }
}

function angelFall(tasks, callback) {
  if (!checkWaterfallTasks(tasks, (callback = callback || noop))) return;

  var completed = 0,
    sync = false,
    size = tasks.length,
    func = tasks[completed],
    args = [];
  var iterate = function() {
    switch (func.length) {
      case 0:
        try {
          next(null, func());
        } catch (e) {
          next(e);
        }
        return;
      case 1:
        return func(next);
      case 2:
        return func(args[1], next);
      case 3:
        return func(args[1], args[2], next);
      case 4:
        return func(args[1], args[2], args[3], next);
      case 5:
        return func(args[1], args[2], args[3], args[4], next);
      default:
        (args = slice(args, 1))[func.length - 1] = next;
        return func.apply(null, args);
    }
  };
  iterate();

  function next(err, res) {
    if (err) {
      iterate = throwError;
      (callback = onlyOnce(callback))(err);
      return;
    }
    if (++completed === size) {
      iterate = throwError;
      var done = callback;
      callback = throwError;
      arguments.length === 2 ? done(err, res) : done.apply(null, createArray(arguments));

      return;
    }
    func = tasks[completed];
    args = arguments;
    if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function whilst(test, iterator, callback) {
  callback = callback || noop;
  var sync = false;
  test() ? iterate() : callback(null);

  function iterate() {
    if (sync) nextTick(next);
    else {
      sync = true;
      iterator(done);
    }
    sync = false;
  }

  function next() {
    iterator(done);
  }

  function done(err, arg) {
    if (err) return callback(err);

    if (arguments.length <= 2) {
      test(arg) ? iterate() : callback(null, arg);

      return;
    }
    arg = slice(arguments, 1);
    test.apply(null, arg) ? iterate() : callback.apply(null, [null].concat(arg));
  }
}

function doWhilst(iterator, test, callback) {
  callback = callback || noop;
  var sync = false;
  next();

  function iterate() {
    if (sync) nextTick(next);
    else {
      sync = true;
      iterator(done);
    }
    sync = false;
  }

  function next() {
    iterator(done);
  }

  function done(err, arg) {
    if (err) return callback(err);

    if (arguments.length <= 2) {
      test(arg) ? iterate() : callback(null, arg);

      return;
    }
    arg = slice(arguments, 1);
    test.apply(null, arg) ? iterate() : callback.apply(null, [null].concat(arg));
  }
}

function until(test, iterator, callback) {
  callback = callback || noop;
  var sync = false;
  !test() ? iterate() : callback(null);

  function iterate() {
    if (sync) nextTick(next);
    else {
      sync = true;
      iterator(done);
    }
    sync = false;
  }

  function next() {
    iterator(done);
  }

  function done(err, arg) {
    if (err) return callback(err);

    if (arguments.length <= 2) {
      !test(arg) ? iterate() : callback(null, arg);

      return;
    }
    arg = slice(arguments, 1);
    !test.apply(null, arg) ? iterate() : callback.apply(null, [null].concat(arg));
  }
}

function doUntil(iterator, test, callback) {
  callback = callback || noop;
  var sync = false;
  next();

  function iterate() {
    if (sync) nextTick(next);
    else {
      sync = true;
      iterator(done);
    }
    sync = false;
  }

  function next() {
    iterator(done);
  }

  function done(err, arg) {
    if (err) return callback(err);

    if (arguments.length <= 2) {
      !test(arg) ? iterate() : callback(null, arg);

      return;
    }
    arg = slice(arguments, 1);
    !test.apply(null, arg) ? iterate() : callback.apply(null, [null].concat(arg));
  }
}

function during(test, iterator, callback) {
  callback = callback || noop;
  _test();

  function _test() {
    test(iterate);
  }

  function iterate(err, truth) {
    if (err) return callback(err);

    truth ? iterator(done) : callback(null);
  }

  function done(err) {
    if (err) return callback(err);

    _test();
  }
}

function doDuring(iterator, test, callback) {
  callback = callback || noop;
  iterate(null, true);

  function iterate(err, truth) {
    if (err) return callback(err);

    truth ? iterator(done) : callback(null);
  }

  function done(err, res) {
    if (err) return callback(err);

    switch (arguments.length) {
      case 0:
      case 1:
        test(iterate);
        break;
      case 2:
        test(res, iterate);
        break;
      default:
        var args = slice(arguments, 1);
        args.push(iterate);
        test.apply(null, args);
        break;
    }
  }
}

function forever(iterator, callback) {
  var sync = false;
  iterate();

  function iterate() {
    iterator(next);
  }

  function next(err) {
    if (err) {
      if (callback) return callback(err);

      throw err;
    }
    if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function compose() {
  return seq.apply(null, reverse(arguments));
}

function seq() {
  var fns = createArray(arguments);

  return function() {
    var self = this,
      args = createArray(arguments),
      callback = args[args.length - 1];
    typeof callback === func ? args.pop() : (callback = noop);

    reduce(fns, args, iterator, done);

    function iterator(newargs, fn, callback) {
      var func = function(err) {
        var nextargs = slice(arguments, 1);
        callback(err, nextargs);
      };
      newargs.push(func);
      fn.apply(self, newargs);
    }

    function done(err, res) {
      (res = isArray(res) ? res : [res]).unshift(err);
      callback.apply(self, res);
    }
  };
}

function createApplyEach(func) {
  return function(fns) {
    var go = function() {
      var self = this,
        args = createArray(arguments),
        callback = args.pop() || noop;
      return func(fns, iterator, callback);

      function iterator(fn, done) {
        fn.apply(self, args.concat([done]));
      }
    };
    if (arguments.length > 1) {
      var args = slice(arguments, 1);
      return go.apply(this, args);
    }
    return go;
  };
}

function DLL() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

DLL.prototype._removeLink = function(node) {
  var prev = node.prev,
    next = node.next;
  prev ? (prev.next = next) : (this.head = next);

  next ? (next.prev = prev) : (this.tail = prev);

  node.prev = null;
  node.next = null;
  this.length--;
  return node;
};

DLL.prototype.empty = DLL;

DLL.prototype._setInitial = function(node) {
  this.length = 1;
  this.head = this.tail = node;
};

DLL.prototype.insertBefore = function(node, newNode) {
  newNode.prev = node.prev;
  newNode.next = node;
  node.prev ? (node.prev.next = newNode) : (this.head = newNode);

  node.prev = newNode;
  this.length++;
};

DLL.prototype.unshift = function(node) {
  this.head ? this.insertBefore(this.head, node) : this._setInitial(node);
};

DLL.prototype.push = function(node) {
  var tail = this.tail;
  if (tail) {
    node.prev = tail;
    node.next = tail.next;
    this.tail = node;
    tail.next = node;
    this.length++;
  } else this._setInitial(node);
};

DLL.prototype.shift = function() {
  return this.head && this._removeLink(this.head);
};

DLL.prototype.splice = function(end) {
  var task,
    tasks = [];
  while (end-- && (task = this.shift())) tasks.push(task);

  return tasks;
};

DLL.prototype.remove = function(test) {
  for (var node = this.head; node; ) {
    test(node) && this._removeLink(node);

    node = node.next;
  }
  return this;
};

function baseQueue(isQueue, worker, concurrency, payload) {
  if (concurrency === void 0) concurrency = 1;
  else if (isNaN(concurrency) || concurrency < 1)
    throw new Error('Concurrency must not be zero');

  var _callback, _unshift,
    workers = 0,
    workersList = [];

  var q = {
    _tasks: new DLL(),
    concurrency: concurrency,
    payload: payload,
    saturated: noop,
    unsaturated: noop,
    buffer: concurrency / 4,
    empty: noop,
    drain: noop,
    error: noop,
    started: false,
    paused: false,
    push: push,
    kill: kill,
    unshift: unshift,
    remove: remove,
    process: isQueue ? runQueue : runCargo,
    length: getLength,
    running: running,
    workersList: getWorkersList,
    idle: idle,
    pause: pause,
    resume: resume,
    _worker: worker
  };
  return q;

  function push(tasks, callback) {
    _insert(tasks, callback);
  }

  function unshift(tasks, callback) {
    _insert(tasks, callback, true);
  }

  function _exec(task) {
    var item = { data: task, callback: _callback };
    _unshift ? q._tasks.unshift(item) : q._tasks.push(item);

    nextTick(q.process);
  }

  function _insert(tasks, callback, unshift) {
    if (callback == null) callback = noop;
    else if (typeof callback != 'function')
      throw new Error('task callback must be a function');

    q.started = true;
    var _tasks = isArray(tasks) ? tasks : [tasks];

    if (tasks === void 0 || !_tasks.length) {
      q.idle() && nextTick(q.drain);

      return;
    }

    _unshift = unshift;
    _callback = callback;
    arrayEachSync(_tasks, _exec);
    _callback = void 0;
  }

  function kill() {
    q.drain = noop;
    q._tasks.empty();
  }

  function _next(q, tasks) {
    var called = false;
    return function(err, res) {
      called && throwError();

      called = true;

      workers--;
      var task,
        index = -1,
        size = workersList.length,
        taskIndex = -1,
        taskSize = tasks.length,
        useApply = arguments.length > 2,
        args = useApply && createArray(arguments);
      while (++taskIndex < taskSize) {
        task = tasks[taskIndex];
        while (++index < size)
          if (workersList[index] === task) {
            index === 0 ? workersList.shift() : workersList.splice(index, 1);

            index = size;
            size--;
          }

        index = -1;
        useApply ? task.callback.apply(task, args) : task.callback(err, res);

        err && q.error(err, task.data);
      }

      workers > q.concurrency - q.buffer || q.unsaturated();

      q._tasks.length + workers !== 0 || q.drain();

      q.process();
    };
  }

  function runQueue() {
    while (!q.paused && workers < q.concurrency && q._tasks.length) {
      var task = q._tasks.shift();
      workers++;
      workersList.push(task);
      q._tasks.length !== 0 || q.empty();

      workers !== q.concurrency || q.saturated();

      var done = _next(q, [task]);
      worker(task.data, done);
    }
  }

  function runCargo() {
    while (!q.paused && workers < q.concurrency && q._tasks.length) {
      var tasks = q._tasks.splice(q.payload || q._tasks.length),
        index = -1,
        size = tasks.length,
        data = Array(size);
      while (++index < size) data[index] = tasks[index].data;

      workers++;
      nativePush.apply(workersList, tasks);
      q._tasks.length !== 0 || q.empty();

      workers !== q.concurrency || q.saturated();

      var done = _next(q, tasks);
      worker(data, done);
    }
  }

  function getLength() {
    return q._tasks.length;
  }

  function running() {
    return workers;
  }

  function getWorkersList() {
    return workersList;
  }

  function idle() {
    return q.length() + workers === 0;
  }

  function pause() {
    q.paused = true;
  }

  function _resume() {
    nextTick(q.process);
  }

  function resume() {
    if (q.paused === false) return;

    q.paused = false;
    timesSync(q.concurrency < q._tasks.length ? q.concurrency : q._tasks.length, _resume);
  }

  function remove(test) {
    q._tasks.remove(test);
  }
}

function queue(worker, concurrency) {
  return baseQueue(true, worker, concurrency);
}

function priorityQueue(worker, concurrency) {
  var q = baseQueue(true, worker, concurrency);
  q.push = push;
  delete q.unshift;
  return q;

  function push(tasks, priority, callback) {
    q.started = true;
    priority = priority || 0;
    var _tasks = isArray(tasks) ? tasks : [tasks],
      taskSize = _tasks.length;

    if (tasks === void 0 || taskSize === 0) {
      q.idle() && nextTick(q.drain);

      return;
    }

    callback = typeof callback === func ? callback : noop;
    var nextNode = q._tasks.head;
    while (nextNode && priority >= nextNode.priority) nextNode = nextNode.next;

    while (taskSize--) {
      var item = { data: _tasks[taskSize], priority: priority, callback: callback };
      nextNode ? q._tasks.insertBefore(nextNode, item) : q._tasks.push(item);

      nextTick(q.process);
    }
  }
}

function cargo(worker, payload) {
  return baseQueue(false, worker, 1, payload);
}

function auto(tasks, concurrency, callback) {
  if (typeof concurrency === func) {
    callback = concurrency;
    concurrency = null;
  }
  var keys = nativeKeys(tasks),
    rest = keys.length,
    results = {};
  if (rest === 0) return callback(null, results);

  var runningTasks = 0,
    readyTasks = new DLL(),
    listeners = Object.create(null);
  callback = onlyOnce(callback || noop);
  concurrency = concurrency || rest;

  baseEachSync(tasks, iterator, keys);
  proceedQueue();

  function iterator(task, key) {
    var _task, _taskSize;
    if (!isArray(task)) {
      _task = task;
      _taskSize = 0;
      readyTasks.push([_task, _taskSize, done]);
      return;
    }
    var dependencySize = task.length - 1;
    _task = task[dependencySize];
    _taskSize = dependencySize;
    if (dependencySize === 0) {
      readyTasks.push([_task, _taskSize, done]);
      return;
    }
    for (var index = -1; ++index < dependencySize; ) {
      var dependencyName = task[index];
      if (notInclude(keys, dependencyName)) {
        var msg =
          'async.auto task `' +
          key +
          '` has non-existent dependency `' +
          dependencyName +
          '` in ' +
          task.join(', ');
        throw new Error(msg);
      }
      var taskListeners = listeners[dependencyName];
      taskListeners || (taskListeners = listeners[dependencyName] = []);

      taskListeners.push(taskListener);
    }

    function done(err, arg) {
      key !== null || throwError();

      arg = arguments.length <= 2 ? arg : slice(arguments, 1);
      if (err) {
        rest = 0;
        runningTasks = 0;
        readyTasks.length = 0;
        var safeResults = objectClone(results);
        safeResults[key] = arg;
        key = null;
        var _callback = callback;
        callback = noop;
        _callback(err, safeResults);
        return;
      }
      runningTasks--;
      rest--;
      results[key] = arg;
      taskComplete(key);
      key = null;
    }

    function taskListener() {
      --dependencySize != 0 || readyTasks.push([_task, _taskSize, done]);
    }
  }

  function proceedQueue() {
    if (readyTasks.length === 0 && runningTasks === 0) {
      if (rest !== 0) throw new Error('async.auto task has cyclic dependencies');

      return callback(null, results);
    }
    while (readyTasks.length && runningTasks < concurrency && callback !== noop) {
      runningTasks++;
      var array = readyTasks.shift();
      array[1] === 0 ? array[0](array[2]) : array[0](results, array[2]);
    }
  }

  function taskComplete(key) {
    arrayEachSync(listeners[key] || [], function(task) {
      task();
    });
    proceedQueue();
  }
}

var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m,
  FN_ARG_SPLIT = /,/,
  FN_ARG = /(=.+)?(\s*)$/,
  STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

function parseParams(func) {
  func = func.toString().replace(STRIP_COMMENTS, '').match(FN_ARGS)[2].replace(' ', '');
  return (func ? func.split(FN_ARG_SPLIT) : []).map(function(arg) {
    return arg.replace(FN_ARG, '').trim();
  });
}

function autoInject(tasks, concurrency, callback) {
  var newTasks = {};
  baseEachSync(tasks, iterator, nativeKeys(tasks));
  auto(newTasks, concurrency, callback);

  function iterator(task, key) {
    var params,
      taskLength = task.length;

    if (isArray(task)) {
      if (taskLength === 0)
        throw new Error('autoInject task functions require explicit parameters.');

      params = createArray(task);
      taskLength = params.length - 1;
      task = params[taskLength];
      if (taskLength === 0) {
        newTasks[key] = task;
        return;
      }
    } else if (taskLength === 1) {
      newTasks[key] = task;
      return;
    } else {
      params = parseParams(task);
      if (taskLength === 0 && params.length === 0)
        throw new Error('autoInject task functions require explicit parameters.');

      taskLength = params.length - 1;
    }
    params[taskLength] = newTask;
    newTasks[key] = params;

    function newTask(results, done) {
      switch (taskLength) {
        case 1:
          task(results[params[0]], done);
          break;
        case 2:
          task(results[params[0]], results[params[1]], done);
          break;
        case 3:
          task(results[params[0]], results[params[1]], results[params[2]], done);
          break;
        default:
          var i = -1;
          while (++i < taskLength) params[i] = results[params[i]];

          params[i] = done;
          task.apply(null, params);
          break;
      }
    }
  }
}

function retry(opts, task, callback) {
  var times, intervalFunc, errorFilter,
    count = 0;
  if (arguments.length < 3 && typeof opts === func) {
    callback = task || noop;
    task = opts;
    opts = null;
    times = DEFAULT_TIMES;
  } else {
    callback = callback || noop;
    switch (typeof opts) {
      case 'object':
        if (typeof opts.errorFilter === func) errorFilter = opts.errorFilter;

        var interval = opts.interval;
        switch (typeof interval) {
          case func:
            intervalFunc = interval;
            break;
          case 'string':
          case 'number':
            intervalFunc = (interval = +interval)
              ? function() {
                  return interval;
                }
              : function() {
                  return DEFAULT_INTERVAL;
                };
            break;
        }
        times = +opts.times || DEFAULT_TIMES;
        break;
      case 'number':
        times = opts || DEFAULT_TIMES;
        break;
      case 'string':
        times = +opts || DEFAULT_TIMES;
        break;
      default:
        throw new Error('Invalid arguments for async.retry');
    }
  }
  if (typeof task != 'function') throw new Error('Invalid arguments for async.retry');

  task(intervalFunc ? intervalCallback : simpleCallback);

  function simpleIterator() {
    task(simpleCallback);
  }

  function simpleCallback(err, res) {
    if (++count === times || !err || (errorFilter && !errorFilter(err))) {
      if (arguments.length <= 2) return callback(err, res);

      var args = createArray(arguments);
      return callback.apply(null, args);
    }
    simpleIterator();
  }

  function intervalIterator() {
    task(intervalCallback);
  }

  function intervalCallback(err, res) {
    if (++count === times || !err || (errorFilter && !errorFilter(err))) {
      if (arguments.length <= 2) return callback(err, res);

      var args = createArray(arguments);
      return callback.apply(null, args);
    }
    setTimeout(intervalIterator, intervalFunc(count));
  }
}

function retryable(opts, task) {
  if (!task) {
    task = opts;
    opts = null;
  }
  return done;

  function done() {
    var taskFn,
      args = createArray(arguments),
      lastIndex = args.length - 1,
      callback = args[lastIndex];
    switch (task.length) {
      case 1:
        taskFn = task1;
        break;
      case 2:
        taskFn = task2;
        break;
      case 3:
        taskFn = task3;
        break;
      default:
        taskFn = task4;
    }
    opts ? retry(opts, taskFn, callback) : retry(taskFn, callback);

    function task1(done) {
      task(done);
    }

    function task2(done) {
      task(args[0], done);
    }

    function task3(done) {
      task(args[0], args[1], done);
    }

    function task4(callback) {
      args[lastIndex] = callback;
      task.apply(null, args);
    }
  }
}

function iterator(tasks) {
  var size = 0,
    keys = [];
  if (isArray(tasks)) size = tasks.length;
  else {
    keys = nativeKeys(tasks);
    size = keys.length;
  }
  return makeCallback(0);

  function makeCallback(index) {
    var fn = function() {
      if (size) {
        var key = keys[index] || index;
        tasks[key].apply(null, createArray(arguments));
      }
      return fn.next();
    };
    fn.next = function() {
      return index < size - 1 ? makeCallback(index + 1) : null;
    };
    return fn;
  }
}

function apply(func) {
  switch (arguments.length) {
    case 0:
    case 1:
      return func;
    case 2:
      return func.bind(null, arguments[1]);
    case 3:
      return func.bind(null, arguments[1], arguments[2]);
    case 4:
      return func.bind(null, arguments[1], arguments[2], arguments[3]);
    case 5:
      return func.bind(null, arguments[1], arguments[2], arguments[3], arguments[4]);
    default:
      var size = arguments.length,
        index = 0,
        args = Array(size);
      args[index] = null;
      while (++index < size) args[index] = arguments[index];

      return func.bind.apply(func, args);
  }
}

function timeout(func, millisec, info) {
  var callback, timer;
  return wrappedFunc;

  function wrappedFunc() {
    timer = setTimeout(timeoutCallback, millisec);
    var args = createArray(arguments),
      lastIndex = args.length - 1;
    callback = args[lastIndex];
    args[lastIndex] = injectedCallback;
    simpleApply(func, args);
  }

  function timeoutCallback() {
    var name = func.name || 'anonymous',
      err = new Error('Callback function "' + name + '" timed out.');
    err.code = 'ETIMEDOUT';
    if (info) err.info = info;

    timer = null;
    callback(err);
  }

  function injectedCallback() {
    if (timer !== null) {
      simpleApply(callback, createArray(arguments));
      clearTimeout(timer);
    }
  }

  function simpleApply(func, args) {
    switch (args.length) {
      case 0:
        func();
        break;
      case 1:
        func(args[0]);
        break;
      case 2:
        func(args[0], args[1]);
        break;
      default:
        func.apply(null, args);
        break;
    }
  }
}

function times(n, iterator, callback) {
  callback = callback || noop;
  n = +n;
  if (isNaN(n) || n < 1) return callback(null, []);

  var result = Array(n);
  timesSync(n, iterate);

  function iterate(num) {
    iterator(num, createCallback(num));
  }

  function createCallback(index) {
    return function(err, res) {
      index !== null || throwError();

      result[index] = res;
      index = null;
      if (err) {
        callback(err);
        callback = noop;
      } else --n != 0 || callback(null, result);
    };
  }
}

function timesSeries(n, iterator, callback) {
  callback = callback || noop;
  n = +n;
  if (isNaN(n) || n < 1) return callback(null, []);

  var result = Array(n),
    sync = false,
    completed = 0;
  iterate();

  function iterate() {
    iterator(completed, done);
  }

  function done(err, res) {
    result[completed] = res;
    if (err) {
      callback(err);
      callback = throwError;
    } else if (++completed >= n) {
      callback(null, result);
      callback = throwError;
    } else if (sync) nextTick(iterate);
    else {
      sync = true;
      iterate();
    }
    sync = false;
  }
}

function timesLimit(n, limit, iterator, callback) {
  callback = callback || noop;
  n = +n;
  if (isNaN(n) || n < 1 || isNaN(limit) || limit < 1) return callback(null, []);

  var result = Array(n),
    sync = false,
    started = 0,
    completed = 0;
  timesSync(limit > n ? n : limit, iterate);

  function iterate() {
    var index = started++;
    index < n && iterator(index, createCallback(index));
  }

  function createCallback(index) {
    return function(err, res) {
      index !== null || throwError();

      result[index] = res;
      index = null;
      if (err) {
        callback(err);
        callback = noop;
      } else if (++completed >= n) {
        callback(null, result);
        callback = throwError;
      } else if (sync) nextTick(iterate);
      else {
        sync = true;
        iterate();
      }
      sync = false;
    };
  }
}

function race(tasks, callback) {
  callback = once(callback || noop);
  var size, keys,
    index = -1;
  if (isArray(tasks)) {
    size = tasks.length;
    while (++index < size) tasks[index](callback);
  } else if (tasks && typeof tasks === obj) {
    size = (keys = nativeKeys(tasks)).length;
    while (++index < size) tasks[keys[index]](callback);
  } else
    return callback(new TypeError('First argument to race must be a collection of functions'));

  size || callback(null);
}

function memoize(fn, hasher) {
  hasher ||
    (hasher = function(hash) {
      return hash;
    });

  var memo = {},
    queues = {};
  var memoized = function() {
    var args = createArray(arguments),
      callback = args.pop(),
      key = hasher.apply(null, args);
    if (has(memo, key)) {
      nextTick(function() {
        callback.apply(null, memo[key]);
      });
      return;
    }
    if (has(queues, key)) return queues[key].push(callback);

    queues[key] = [callback];
    args.push(done);
    fn.apply(null, args);

    function done(err) {
      var args = createArray(arguments);
      err || (memo[key] = args);

      var q = queues[key];
      delete queues[key];

      for (var i = -1, size = q.length; ++i < size; ) q[i].apply(null, args);
    }
  };
  memoized.memo = memo;
  memoized.unmemoized = fn;
  return memoized;
}

function unmemoize(fn) {
  return function() {
    return (fn.unmemoized || fn).apply(null, arguments);
  };
}

function ensureAsync(fn) {
  return function() {
    var args = createArray(arguments),
      lastIndex = args.length - 1,
      callback = args[lastIndex],
      sync = true;
    args[lastIndex] = done;
    fn.apply(this, args);
    sync = false;

    function done() {
      var innerArgs = createArray(arguments);
      if (sync)
        nextTick(function() {
          callback.apply(null, innerArgs);
        });
      else callback.apply(null, innerArgs);
    }
  };
}

function constant() {
  var args = [null].concat(createArray(arguments));
  return function(callback) {
    (callback = arguments[arguments.length - 1]).apply(this, args);
  };
}

function asyncify(fn) {
  return function() {
    var result,
      args = createArray(arguments),
      callback = args.pop();
    try {
      result = fn.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    if (result && typeof result.then === func)
      result.then(
        function(value) {
          invokeCallback(callback, null, value);
        },
        function(err) {
          invokeCallback(callback, err && err.message ? err : new Error(err));
        }
      );
    else callback(null, result);
  };
}

function invokeCallback(callback, err, value) {
  try {
    callback(err, value);
  } catch (e) {
    nextTick(rethrow, e);
  }
}

function rethrow(error) {
  throw error;
}

function reflect(func) {
  return function() {
    var callback;
    switch (arguments.length) {
      case 1:
        callback = arguments[0];
        return func(done);
      case 2:
        callback = arguments[1];
        return func(arguments[0], done);
      default:
        var args = createArray(arguments),
          lastIndex = args.length - 1;
        callback = args[lastIndex];
        args[lastIndex] = done;
        func.apply(this, args);
    }

    function done(err, res) {
      if (err) return callback(null, { error: err });

      if (arguments.length > 2) res = slice(arguments, 1);

      callback(null, { value: res });
    }
  };
}

function reflectAll(tasks) {
  var newTasks, keys;
  if (isArray(tasks)) {
    newTasks = Array(tasks.length);
    arrayEachSync(tasks, iterate);
  } else if (tasks && typeof tasks === obj) {
    keys = nativeKeys(tasks);
    newTasks = {};
    baseEachSync(tasks, iterate, keys);
  }
  return newTasks;

  function iterate(func, key) {
    newTasks[key] = reflect(func);
  }
}

function createLogger(name) {
  return function(fn) {
    var args = slice(arguments, 1);
    args.push(done);
    fn.apply(null, args);
  };

  function done(err) {
    if (typeof console === obj) {
      if (err) {
        console.error && console.error(err);

        return;
      }
      console[name] &&
        arrayEachSync(slice(arguments, 1), function(arg) {
          console[name](arg);
        });
    }
  }
}

function safe() {
  createImmediate();
  return exports;
}

function fast() {
  createImmediate(false);
  return exports;
}

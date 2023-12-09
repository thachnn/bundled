"use strict";

var nextTick, asyncNextTick, asyncSetImmediate, noop = function() {}, throwError = function() {
  throw new Error("Callback was already called.");
}, DEFAULT_TIMES = 5, DEFAULT_INTERVAL = 0, obj = "object", func = "function", isArray = Array.isArray, nativeKeys = Object.keys, nativePush = Array.prototype.push, iteratorSymbol = typeof Symbol === func && Symbol.iterator;

createImmediate();

var each = createEach(arrayEach, baseEach, symbolEach), map = createMap(arrayEachIndex, baseEachIndex, symbolEachIndex, !0), mapValues = createMap(arrayEachIndex, baseEachKey, symbolEachKey, !1), filter = createFilter(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue, !0), filterSeries = createFilterSeries(!0), filterLimit = createFilterLimit(!0), reject = createFilter(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue, !1), rejectSeries = createFilterSeries(!1), rejectLimit = createFilterLimit(!1), detect = createDetect(arrayEachValue, baseEachValue, symbolEachValue, !0), detectSeries = createDetectSeries(!0), detectLimit = createDetectLimit(!0), every = createEvery(arrayEachValue, baseEachValue, symbolEachValue), everySeries = createEverySeries(), everyLimit = createEveryLimit(), pick = createPick(arrayEachIndexValue, baseEachKeyValue, symbolEachKeyValue, !0), pickSeries = createPickSeries(!0), pickLimit = createPickLimit(!0), omit = createPick(arrayEachIndexValue, baseEachKeyValue, symbolEachKeyValue, !1), omitSeries = createPickSeries(!1), omitLimit = createPickLimit(!1), transform = createTransform(arrayEachResult, baseEachResult, symbolEachResult), sortBy = createSortBy(arrayEachIndexValue, baseEachIndexValue, symbolEachIndexValue), concat = createConcat(arrayEachIndex, baseEachIndex, symbolEachIndex), groupBy = createGroupBy(arrayEachValue, baseEachValue, symbolEachValue), parallel = createParallel(arrayEachFunc, baseEachFunc), applyEach = createApplyEach(map), applyEachSeries = createApplyEach(mapSeries), log = createLogger("log"), dir = createLogger("dir"), index = {
  VERSION: "2.6.2",
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

function createImmediate(safeMode) {
  asyncSetImmediate = typeof setImmediate === func ? setImmediate : function(fn) {
    var args = slice(arguments, 1);
    setTimeout((function() {
      fn.apply(null, args);
    }));
  }, typeof process === obj && typeof process.nextTick === func ? (nextTick = /^v0.10/.test(process.version) ? asyncSetImmediate : process.nextTick, 
  asyncNextTick = /^v0/.test(process.version) ? asyncSetImmediate : process.nextTick) : asyncNextTick = nextTick = asyncSetImmediate, 
  !1 === safeMode && (nextTick = function(cb) {
    cb();
  });
}

function createArray(array) {
  for (var index = -1, size = array.length, result = Array(size); ++index < size; ) result[index] = array[index];
  return result;
}

function slice(array, start) {
  var index = -1, size = array.length - start;
  if (size <= 0) return [];
  for (var result = Array(size); ++index < size; ) result[index] = array[index + start];
  return result;
}

function objectClone(object) {
  for (var keys = nativeKeys(object), size = keys.length, index = -1, result = {}; ++index < size; ) {
    var key = keys[index];
    result[key] = object[key];
  }
  return result;
}

function compact(array) {
  for (var index = -1, size = array.length, result = []; ++index < size; ) {
    var value = array[index];
    value && (result[result.length] = value);
  }
  return result;
}

function reverse(array) {
  for (var index = -1, size = array.length, result = Array(size), resIndex = size; ++index < size; ) result[--resIndex] = array[index];
  return result;
}

function has(object, key) {
  return object.hasOwnProperty(key);
}

function notInclude(array, target) {
  for (var index = -1, size = array.length; ++index < size; ) if (array[index] === target) return !1;
  return !0;
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
  var i, l = array.length, indices = Array(l);
  for (i = 0; i < l; i++) indices[i] = i;
  quickSort(criteria, 0, l - 1, indices);
  for (var result = Array(l), n = 0; n < l; n++) i = indices[n], result[n] = void 0 === i ? array[n] : array[i];
  return result;
}

function partition(array, i, j, mid, indices) {
  for (var l = i, r = j; l <= r; ) {
    for (i = l; l < r && array[l] < mid; ) l++;
    for (;r >= i && array[r] >= mid; ) r--;
    if (l > r) break;
    swap(array, indices, l++, r--);
  }
  return l;
}

function swap(array, indices, l, r) {
  var n = array[l];
  array[l] = array[r], array[r] = n;
  var i = indices[l];
  indices[l] = indices[r], indices[r] = i;
}

function quickSort(array, i, j, indices) {
  if (i !== j) {
    for (var k = i; ++k <= j && array[i] === array[k]; ) {
      var l = k - 1;
      if (indices[l] > indices[k]) {
        var index = indices[l];
        indices[l] = indices[k], indices[k] = index;
      }
    }
    if (!(k > j)) quickSort(array, i, (k = partition(array, i, j, array[array[i] > array[k] ? i : k], indices)) - 1, indices), 
    quickSort(array, k, j, indices);
  }
}

function makeConcatResult(array) {
  var result = [];
  return arrayEachSync(array, (function(value) {
    value !== noop && (isArray(value) ? nativePush.apply(result, value) : result.push(value));
  })), result;
}

function arrayEach(array, iterator, callback) {
  var index = -1, size = array.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(array[index], index, onlyOnce(callback)); else for (;++index < size; ) iterator(array[index], onlyOnce(callback));
}

function baseEach(object, iterator, callback, keys) {
  var key, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(object[key = keys[index]], key, onlyOnce(callback)); else for (;++index < size; ) iterator(object[keys[index]], onlyOnce(callback));
}

function symbolEach(collection, iterator, callback) {
  var item, iter = collection[iteratorSymbol](), index = 0;
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(item.value, index++, onlyOnce(callback)); else for (;!1 === (item = iter.next()).done; ) index++, 
  iterator(item.value, onlyOnce(callback));
  return index;
}

function arrayEachResult(array, result, iterator, callback) {
  var index = -1, size = array.length;
  if (4 === iterator.length) for (;++index < size; ) iterator(result, array[index], index, onlyOnce(callback)); else for (;++index < size; ) iterator(result, array[index], onlyOnce(callback));
}

function baseEachResult(object, result, iterator, callback, keys) {
  var key, index = -1, size = keys.length;
  if (4 === iterator.length) for (;++index < size; ) iterator(result, object[key = keys[index]], key, onlyOnce(callback)); else for (;++index < size; ) iterator(result, object[keys[index]], onlyOnce(callback));
}

function symbolEachResult(collection, result, iterator, callback) {
  var item, index = 0, iter = collection[iteratorSymbol]();
  if (4 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(result, item.value, index++, onlyOnce(callback)); else for (;!1 === (item = iter.next()).done; ) index++, 
  iterator(result, item.value, onlyOnce(callback));
  return index;
}

function arrayEachFunc(array, createCallback) {
  for (var index = -1, size = array.length; ++index < size; ) array[index](createCallback(index));
}

function baseEachFunc(object, createCallback, keys) {
  for (var key, index = -1, size = keys.length; ++index < size; ) object[key = keys[index]](createCallback(key));
}

function arrayEachIndex(array, iterator, createCallback) {
  var index = -1, size = array.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(array[index], index, createCallback(index)); else for (;++index < size; ) iterator(array[index], createCallback(index));
}

function baseEachIndex(object, iterator, createCallback, keys) {
  var key, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(object[key = keys[index]], key, createCallback(index)); else for (;++index < size; ) iterator(object[keys[index]], createCallback(index));
}

function symbolEachIndex(collection, iterator, createCallback) {
  var item, index = 0, iter = collection[iteratorSymbol]();
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(item.value, index, createCallback(index++)); else for (;!1 === (item = iter.next()).done; ) iterator(item.value, createCallback(index++));
  return index;
}

function baseEachKey(object, iterator, createCallback, keys) {
  var key, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(object[key = keys[index]], key, createCallback(key)); else for (;++index < size; ) iterator(object[key = keys[index]], createCallback(key));
}

function symbolEachKey(collection, iterator, createCallback) {
  var item, index = 0, iter = collection[iteratorSymbol]();
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(item.value, index, createCallback(index++)); else for (;!1 === (item = iter.next()).done; ) iterator(item.value, createCallback(index++));
  return index;
}

function arrayEachValue(array, iterator, createCallback) {
  var value, index = -1, size = array.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(value = array[index], index, createCallback(value)); else for (;++index < size; ) iterator(value = array[index], createCallback(value));
}

function baseEachValue(object, iterator, createCallback, keys) {
  var key, value, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(value = object[key = keys[index]], key, createCallback(value)); else for (;++index < size; ) iterator(value = object[keys[index]], createCallback(value));
}

function symbolEachValue(collection, iterator, createCallback) {
  var value, item, index = 0, iter = collection[iteratorSymbol]();
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(value = item.value, index++, createCallback(value)); else for (;!1 === (item = iter.next()).done; ) index++, 
  iterator(value = item.value, createCallback(value));
  return index;
}

function arrayEachIndexValue(array, iterator, createCallback) {
  var value, index = -1, size = array.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(value = array[index], index, createCallback(index, value)); else for (;++index < size; ) iterator(value = array[index], createCallback(index, value));
}

function baseEachIndexValue(object, iterator, createCallback, keys) {
  var key, value, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(value = object[key = keys[index]], key, createCallback(index, value)); else for (;++index < size; ) iterator(value = object[keys[index]], createCallback(index, value));
}

function symbolEachIndexValue(collection, iterator, createCallback) {
  var value, item, index = 0, iter = collection[iteratorSymbol]();
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(value = item.value, index, createCallback(index++, value)); else for (;!1 === (item = iter.next()).done; ) iterator(value = item.value, createCallback(index++, value));
  return index;
}

function baseEachKeyValue(object, iterator, createCallback, keys) {
  var key, value, index = -1, size = keys.length;
  if (3 === iterator.length) for (;++index < size; ) iterator(value = object[key = keys[index]], key, createCallback(key, value)); else for (;++index < size; ) iterator(value = object[key = keys[index]], createCallback(key, value));
}

function symbolEachKeyValue(collection, iterator, createCallback) {
  var value, item, index = 0, iter = collection[iteratorSymbol]();
  if (3 === iterator.length) for (;!1 === (item = iter.next()).done; ) iterator(value = item.value, index, createCallback(index++, value)); else for (;!1 === (item = iter.next()).done; ) iterator(value = item.value, createCallback(index++, value));
  return index;
}

function onlyOnce(func) {
  return function(err, res) {
    var fn = func;
    func = throwError, fn(err, res);
  };
}

function once(func) {
  return function(err, res) {
    var fn = func;
    func = noop, fn(err, res);
  };
}

function createEach(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    var size, keys;
    callback = once(callback || noop);
    var completed = 0;
    function done(err, bool) {
      err ? (callback = once(callback))(err) : ++completed === size ? callback(null) : !1 === bool && (callback = once(callback))(null);
    }
    isArray(collection) ? (size = collection.length, arrayEach(collection, iterator, done)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = symbolEach(collection, iterator, done)) && size === completed && callback(null) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, baseEach(collection, iterator, done, keys))), size || callback(null);
  };
}

function createMap(arrayEach, baseEach, symbolEach, useArray) {
  var init, clone;
  return useArray ? (init = Array, clone = createArray) : (init = function() {
    return {};
  }, clone = objectClone), function(collection, iterator, callback) {
    var size, keys, result;
    callback = callback || noop;
    var completed = 0;
    function createCallback(key) {
      return function(err, res) {
        if (null === key && throwError(), err) return key = null, void (callback = once(callback))(err, clone(result));
        result[key] = res, key = null, ++completed === size && callback(null, result);
      };
    }
    isArray(collection) ? (size = collection.length, result = init(size), arrayEach(collection, iterator, createCallback)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (result = init(0), 
    (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, result)) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, result = init(size), baseEach(collection, iterator, createCallback, keys))), 
    size || callback(null, init());
  };
}

function createFilter(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    var size, keys, result;
    callback = callback || noop;
    var completed = 0;
    if (isArray(collection) ? (size = collection.length, result = Array(size), arrayEach(collection, iterator, createCallback)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (result = [], 
    (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, compact(result))) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, result = Array(size), baseEach(collection, iterator, createCallback, keys))), 
    !size) return callback(null, []);
    function createCallback(index, value) {
      return function(err, res) {
        if (null === index && throwError(), err) return index = null, void (callback = once(callback))(err);
        !!res === bool && (result[index] = value), index = null, ++completed === size && callback(null, compact(result));
      };
    }
  };
}

function createFilterSeries(bool) {
  return function(collection, iterator, callback) {
    var size, key, value, keys, iter, item, iterate;
    callback = onlyOnce(callback || noop);
    var sync = !1, completed = 0, result = [];
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      value = collection[completed], iterator(value, completed, done);
    } : function() {
      value = collection[completed], iterator(value, done);
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, completed, done);
    } : function() {
      item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, done);
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      key = keys[completed], value = collection[key], iterator(value, key, done);
    } : function() {
      key = keys[completed], value = collection[key], iterator(value, done);
    })), !size) return callback(null, []);
    function done(err, res) {
      err ? callback(err) : (!!res === bool && (result[result.length] = value), ++completed === size ? (iterate = throwError, 
      callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1);
    }
    iterate();
  };
}

function createFilterLimit(bool) {
  return function(collection, limit, iterator, callback) {
    var size, index, key, value, keys, iter, item, iterate, result;
    callback = callback || noop;
    var sync = !1, started = 0, completed = 0;
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      (index = started++) < size && (value = collection[index], iterator(value, index, createCallback(value, index)));
    } : function() {
      (index = started++) < size && (value = collection[index], iterator(value, createCallback(value, index)));
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    result = [], iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      !1 === (item = iter.next()).done ? (value = item.value, iterator(value, started, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, compact(result)));
    } : function() {
      !1 === (item = iter.next()).done ? (value = item.value, iterator(value, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, compact(result)));
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      (index = started++) < size && (key = keys[index], value = collection[key], iterator(value, key, createCallback(value, index)));
    } : function() {
      (index = started++) < size && (value = collection[keys[index]], iterator(value, createCallback(value, index)));
    })), !size || isNaN(limit) || limit < 1) return callback(null, []);
    function createCallback(value, index) {
      return function(err, res) {
        if (null === index && throwError(), err) return index = null, iterate = noop, void (callback = once(callback))(err);
        !!res === bool && (result[index] = value), index = null, ++completed === size ? (callback = onlyOnce(callback))(null, compact(result)) : sync ? nextTick(iterate) : (sync = !0, 
        iterate()), sync = !1;
      };
    }
    result = result || Array(size), timesSync(limit > size ? size : limit, iterate);
  };
}

function eachSeries(collection, iterator, callback) {
  var size, key, keys, iter, item, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    iterator(collection[completed], completed, done);
  } : function() {
    iterator(collection[completed], done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    (item = iter.next()).done ? callback(null) : iterator(item.value, completed, done);
  } : function() {
    (item = iter.next()).done ? callback(null) : iterator(item.value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    key = keys[completed], iterator(collection[key], key, done);
  } : function() {
    iterator(collection[keys[completed]], done);
  })), !size) return callback(null);
  function done(err, bool) {
    err ? callback(err) : ++completed === size || !1 === bool ? (iterate = throwError, 
    callback(null)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function eachLimit(collection, limit, iterator, callback) {
  var size, index, key, keys, iter, item, iterate;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(collection)) size = collection.length, iterate = 3 === iterator.length ? function() {
    (index = started++) < size && iterator(collection[index], index, done);
  } : function() {
    started < size && iterator(collection[started++], done);
  }; else if (collection) if (iteratorSymbol && collection[iteratorSymbol]) size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    !1 === (item = iter.next()).done ? iterator(item.value, started++, done) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null));
  } : function() {
    !1 === (item = iter.next()).done ? (started++, iterator(item.value, done)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null));
  }; else {
    if (typeof collection !== obj) return callback(null);
    keys = nativeKeys(collection), size = keys.length, iterate = 3 === iterator.length ? function() {
      (index = started++) < size && (key = keys[index], iterator(collection[key], key, done));
    } : function() {
      started < size && iterator(collection[keys[started++]], done);
    };
  } else ;
  if (!size || isNaN(limit) || limit < 1) return callback(null);
  function done(err, bool) {
    err || !1 === bool ? (iterate = noop, (callback = once(callback))(err)) : ++completed === size ? (iterator = noop, 
    iterate = throwError, (callback = onlyOnce(callback))(null)) : sync ? nextTick(iterate) : (sync = !0, 
    iterate()), sync = !1;
  }
  timesSync(limit > size ? size : limit, iterate);
}

function mapSeries(collection, iterator, callback) {
  var size, key, keys, iter, item, result, iterate;
  callback = callback || noop;
  var sync = !1, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    iterator(collection[completed], completed, done);
  } : function() {
    iterator(collection[completed], done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  result = [], iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  } : function() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    key = keys[completed], iterator(collection[key], key, done);
  } : function() {
    iterator(collection[keys[completed]], done);
  })), !size) return callback(null, []);
  function done(err, res) {
    if (err) return iterate = throwError, void (callback = onlyOnce(callback))(err, createArray(result));
    result[completed] = res, ++completed === size ? (iterate = throwError, callback(null, result), 
    callback = throwError) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  result = result || Array(size), iterate();
}

function mapLimit(collection, limit, iterator, callback) {
  var size, index, key, keys, iter, item, result, iterate;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    (index = started++) < size && iterator(collection[index], index, createCallback(index));
  } : function() {
    (index = started++) < size && iterator(collection[index], createCallback(index));
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  result = [], iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    !1 === (item = iter.next()).done ? iterator(item.value, started, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  } : function() {
    !1 === (item = iter.next()).done ? iterator(item.value, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    (index = started++) < size && (key = keys[index], iterator(collection[key], key, createCallback(index)));
  } : function() {
    (index = started++) < size && iterator(collection[keys[index]], createCallback(index));
  })), !size || isNaN(limit) || limit < 1) return callback(null, []);
  function createCallback(index) {
    return function(err, res) {
      if (null === index && throwError(), err) return index = null, iterate = noop, void (callback = once(callback))(err, createArray(result));
      result[index] = res, index = null, ++completed === size ? (iterate = throwError, 
      callback(null, result), callback = throwError) : sync ? nextTick(iterate) : (sync = !0, 
      iterate()), sync = !1;
    };
  }
  result = result || Array(size), timesSync(limit > size ? size : limit, iterate);
}

function mapValuesSeries(collection, iterator, callback) {
  var size, key, keys, iter, item, iterate;
  callback = callback || noop;
  var sync = !1, result = {}, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    key = completed, iterator(collection[completed], completed, done);
  } : function() {
    key = completed, iterator(collection[completed], done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    key = completed, (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  } : function() {
    key = completed, (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    key = keys[completed], iterator(collection[key], key, done);
  } : function() {
    key = keys[completed], iterator(collection[key], done);
  })), !size) return callback(null, result);
  function done(err, res) {
    if (err) return iterate = throwError, void (callback = onlyOnce(callback))(err, objectClone(result));
    result[key] = res, ++completed === size ? (iterate = throwError, callback(null, result), 
    callback = throwError) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function mapValuesLimit(collection, limit, iterator, callback) {
  var size, index, key, keys, iter, item, iterate;
  callback = callback || noop;
  var sync = !1, result = {}, started = 0, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    (index = started++) < size && iterator(collection[index], index, createCallback(index));
  } : function() {
    (index = started++) < size && iterator(collection[index], createCallback(index));
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    !1 === (item = iter.next()).done ? iterator(item.value, started, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  } : function() {
    !1 === (item = iter.next()).done ? iterator(item.value, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    (index = started++) < size && (key = keys[index], iterator(collection[key], key, createCallback(key)));
  } : function() {
    (index = started++) < size && (key = keys[index], iterator(collection[key], createCallback(key)));
  })), !size || isNaN(limit) || limit < 1) return callback(null, result);
  function createCallback(key) {
    return function(err, res) {
      if (null === key && throwError(), err) return key = null, iterate = noop, void (callback = once(callback))(err, objectClone(result));
      result[key] = res, key = null, ++completed === size ? callback(null, result) : sync ? nextTick(iterate) : (sync = !0, 
      iterate()), sync = !1;
    };
  }
  timesSync(limit > size ? size : limit, iterate);
}

function createDetect(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    var size, keys;
    callback = callback || noop;
    var completed = 0;
    function createCallback(value) {
      var called = !1;
      return function(err, res) {
        called && throwError(), called = !0, err ? (callback = once(callback))(err) : !!res === bool ? (callback = once(callback))(null, value) : ++completed === size && callback(null);
      };
    }
    isArray(collection) ? (size = collection.length, arrayEach(collection, iterator, createCallback)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, baseEach(collection, iterator, createCallback, keys))), size || callback(null);
  };
}

function createDetectSeries(bool) {
  return function(collection, iterator, callback) {
    var size, key, value, keys, iter, item, iterate;
    callback = onlyOnce(callback || noop);
    var sync = !1, completed = 0;
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      value = collection[completed], iterator(value, completed, done);
    } : function() {
      value = collection[completed], iterator(value, done);
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      item = iter.next(), value = item.value, item.done ? callback(null) : iterator(value, completed, done);
    } : function() {
      item = iter.next(), value = item.value, item.done ? callback(null) : iterator(value, done);
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      key = keys[completed], value = collection[key], iterator(value, key, done);
    } : function() {
      value = collection[keys[completed]], iterator(value, done);
    })), !size) return callback(null);
    function done(err, res) {
      err ? callback(err) : !!res === bool ? (iterate = throwError, callback(null, value)) : ++completed === size ? (iterate = throwError, 
      callback(null)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
    }
    iterate();
  };
}

function createDetectLimit(bool) {
  return function(collection, limit, iterator, callback) {
    var size, index, key, value, keys, iter, item, iterate;
    callback = callback || noop;
    var sync = !1, started = 0, completed = 0;
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      (index = started++) < size && (value = collection[index], iterator(value, index, createCallback(value)));
    } : function() {
      (index = started++) < size && (value = collection[index], iterator(value, createCallback(value)));
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      !1 === (item = iter.next()).done ? (value = item.value, iterator(value, started++, createCallback(value))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null));
    } : function() {
      !1 === (item = iter.next()).done ? (started++, value = item.value, iterator(value, createCallback(value))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null));
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      started < size && (key = keys[started++], value = collection[key], iterator(value, key, createCallback(value)));
    } : function() {
      (index = started++) < size && (value = collection[keys[index]], iterator(value, createCallback(value)));
    })), !size || isNaN(limit) || limit < 1) return callback(null);
    function createCallback(value) {
      var called = !1;
      return function(err, res) {
        called && throwError(), called = !0, err ? (iterate = noop, (callback = once(callback))(err)) : !!res === bool ? (iterate = noop, 
        (callback = once(callback))(null, value)) : ++completed === size ? callback(null) : sync ? nextTick(iterate) : (sync = !0, 
        iterate()), sync = !1;
      };
    }
    timesSync(limit > size ? size : limit, iterate);
  };
}

function createPick(arrayEach, baseEach, symbolEach, bool) {
  return function(collection, iterator, callback) {
    var size, keys;
    callback = callback || noop;
    var completed = 0, result = {};
    if (isArray(collection) ? (size = collection.length, arrayEach(collection, iterator, createCallback)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, result) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, baseEach(collection, iterator, createCallback, keys))), !size) return callback(null, {});
    function createCallback(key, value) {
      return function(err, res) {
        if (null === key && throwError(), err) return key = null, void (callback = once(callback))(err, objectClone(result));
        !!res === bool && (result[key] = value), key = null, ++completed === size && callback(null, result);
      };
    }
  };
}

function createPickSeries(bool) {
  return function(collection, iterator, callback) {
    var size, key, value, keys, iter, item, iterate;
    callback = onlyOnce(callback || noop);
    var sync = !1, result = {}, completed = 0;
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      key = completed, value = collection[completed], iterator(value, completed, done);
    } : function() {
      key = completed, value = collection[completed], iterator(value, done);
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      key = completed, item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, key, done);
    } : function() {
      key = completed, item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, done);
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      key = keys[completed], value = collection[key], iterator(value, key, done);
    } : function() {
      key = keys[completed], value = collection[key], iterator(value, done);
    })), !size) return callback(null, {});
    function done(err, res) {
      err ? callback(err, result) : (!!res === bool && (result[key] = value), ++completed === size ? (iterate = throwError, 
      callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1);
    }
    iterate();
  };
}

function createPickLimit(bool) {
  return function(collection, limit, iterator, callback) {
    var size, index, key, value, keys, iter, item, iterate;
    callback = callback || noop;
    var sync = !1, result = {}, started = 0, completed = 0;
    if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
      (index = started++) < size && (value = collection[index], iterator(value, index, createCallback(value, index)));
    } : function() {
      (index = started++) < size && (value = collection[index], iterator(value, createCallback(value, index)));
    }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
    iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
      !1 === (item = iter.next()).done ? (value = item.value, iterator(value, started, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, result));
    } : function() {
      !1 === (item = iter.next()).done ? (value = item.value, iterator(value, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, result));
    }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
    iterate = 3 === iterator.length ? function() {
      started < size && (key = keys[started++], value = collection[key], iterator(value, key, createCallback(value, key)));
    } : function() {
      started < size && (key = keys[started++], value = collection[key], iterator(value, createCallback(value, key)));
    })), !size || isNaN(limit) || limit < 1) return callback(null, {});
    function createCallback(value, key) {
      return function(err, res) {
        if (null === key && throwError(), err) return key = null, iterate = noop, void (callback = once(callback))(err, objectClone(result));
        !!res === bool && (result[key] = value), key = null, ++completed === size ? (iterate = throwError, 
        (callback = onlyOnce(callback))(null, result)) : sync ? nextTick(iterate) : (sync = !0, 
        iterate()), sync = !1;
      };
    }
    timesSync(limit > size ? size : limit, iterate);
  };
}

function reduce(collection, result, iterator, callback) {
  var size, key, keys, iter, item, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1, completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 4 === iterator.length ? function(result) {
    iterator(result, collection[completed], completed, done);
  } : function(result) {
    iterator(result, collection[completed], done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 4 === iterator.length ? function(result) {
    (item = iter.next()).done ? callback(null, result) : iterator(result, item.value, completed, done);
  } : function(result) {
    (item = iter.next()).done ? callback(null, result) : iterator(result, item.value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 4 === iterator.length ? function(result) {
    key = keys[completed], iterator(result, collection[key], key, done);
  } : function(result) {
    iterator(result, collection[keys[completed]], done);
  })), !size) return callback(null, result);
  function done(err, result) {
    err ? callback(err, result) : ++completed === size ? (iterator = throwError, callback(null, result)) : sync ? nextTick((function() {
      iterate(result);
    })) : (sync = !0, iterate(result)), sync = !1;
  }
  iterate(result);
}

function reduceRight(collection, result, iterator, callback) {
  var resIndex, index, key, keys, iter, item, col, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1;
  if (isArray(collection)) resIndex = collection.length, iterate = 4 === iterator.length ? arrayIteratorWithIndex : arrayIterator; else if (collection) if (iteratorSymbol && collection[iteratorSymbol]) {
    for (col = [], iter = collection[iteratorSymbol](), index = -1; !1 === (item = iter.next()).done; ) col[++index] = item.value;
    collection = col, resIndex = col.length, iterate = 4 === iterator.length ? arrayIteratorWithIndex : arrayIterator;
  } else typeof collection === obj && (keys = nativeKeys(collection), resIndex = keys.length, 
  iterate = 4 === iterator.length ? function(result) {
    key = keys[--resIndex], iterator(result, collection[key], key, done);
  } : function(result) {
    iterator(result, collection[keys[--resIndex]], done);
  }); else ;
  if (!resIndex) return callback(null, result);
  function arrayIterator(result) {
    iterator(result, collection[--resIndex], done);
  }
  function arrayIteratorWithIndex(result) {
    iterator(result, collection[--resIndex], resIndex, done);
  }
  function done(err, result) {
    err ? callback(err, result) : 0 === resIndex ? (iterate = throwError, callback(null, result)) : sync ? nextTick((function() {
      iterate(result);
    })) : (sync = !0, iterate(result)), sync = !1;
  }
  iterate(result);
}

function createTransform(arrayEach, baseEach, symbolEach) {
  return function(collection, accumulator, iterator, callback) {
    var size, keys, result;
    3 === arguments.length && (callback = iterator, iterator = accumulator, accumulator = void 0), 
    callback = callback || noop;
    var completed = 0;
    function done(err, bool) {
      err ? (callback = once(callback))(err, isArray(result) ? createArray(result) : objectClone(result)) : ++completed === size ? callback(null, result) : !1 === bool && (callback = once(callback))(null, isArray(result) ? createArray(result) : objectClone(result));
    }
    isArray(collection) ? (size = collection.length, arrayEach(collection, result = void 0 !== accumulator ? accumulator : [], iterator, done)) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = symbolEach(collection, result = void 0 !== accumulator ? accumulator : {}, iterator, done)) && size === completed && callback(null, result) : typeof collection === obj && (keys = nativeKeys(collection), 
    size = keys.length, baseEach(collection, result = void 0 !== accumulator ? accumulator : {}, iterator, done, keys))), 
    size || callback(null, void 0 !== accumulator ? accumulator : result || {});
  };
}

function transformSeries(collection, accumulator, iterator, callback) {
  var size, key, keys, iter, item, iterate, result;
  3 === arguments.length && (callback = iterator, iterator = accumulator, accumulator = void 0), 
  callback = onlyOnce(callback || noop);
  var sync = !1, completed = 0;
  if (isArray(collection) ? (size = collection.length, result = void 0 !== accumulator ? accumulator : [], 
  iterate = 4 === iterator.length ? arrayIteratorWithIndex : arrayIterator) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), result = void 0 !== accumulator ? accumulator : {}, 
  iterate = 4 === iterator.length ? symbolIteratorWithKey : symbolIterator) : typeof collection === obj && (keys = nativeKeys(collection), 
  size = keys.length, result = void 0 !== accumulator ? accumulator : {}, iterate = 4 === iterator.length ? objectIteratorWithKey : objectIterator)), 
  !size) return callback(null, void 0 !== accumulator ? accumulator : result || {});
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
    (item = iter.next()).done ? callback(null, result) : iterator(result, item.value, completed, done);
  }
  function objectIterator() {
    iterator(result, collection[keys[completed]], done);
  }
  function objectIteratorWithKey() {
    key = keys[completed], iterator(result, collection[key], key, done);
  }
  function done(err, bool) {
    err ? callback(err, result) : ++completed === size || !1 === bool ? (iterate = throwError, 
    callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function transformLimit(collection, limit, accumulator, iterator, callback) {
  var size, index, key, keys, iter, item, iterate, result;
  4 === arguments.length && (callback = iterator, iterator = accumulator, accumulator = void 0), 
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(collection) ? (size = collection.length, result = void 0 !== accumulator ? accumulator : [], 
  iterate = 4 === iterator.length ? arrayIteratorWithIndex : arrayIterator) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), result = void 0 !== accumulator ? accumulator : {}, 
  iterate = 4 === iterator.length ? symbolIteratorWithKey : symbolIterator) : typeof collection === obj && (keys = nativeKeys(collection), 
  size = keys.length, result = void 0 !== accumulator ? accumulator : {}, iterate = 4 === iterator.length ? objectIteratorWithKey : objectIterator)), 
  !size || isNaN(limit) || limit < 1) return callback(null, void 0 !== accumulator ? accumulator : result || {});
  function arrayIterator() {
    (index = started++) < size && iterator(result, collection[index], onlyOnce(done));
  }
  function arrayIteratorWithIndex() {
    (index = started++) < size && iterator(result, collection[index], index, onlyOnce(done));
  }
  function symbolIterator() {
    !1 === (item = iter.next()).done ? (started++, iterator(result, item.value, onlyOnce(done))) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  }
  function symbolIteratorWithKey() {
    !1 === (item = iter.next()).done ? iterator(result, item.value, started++, onlyOnce(done)) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  }
  function objectIterator() {
    (index = started++) < size && iterator(result, collection[keys[index]], onlyOnce(done));
  }
  function objectIteratorWithKey() {
    (index = started++) < size && (key = keys[index], iterator(result, collection[key], key, onlyOnce(done)));
  }
  function done(err, bool) {
    err || !1 === bool ? (iterate = noop, callback(err || null, isArray(result) ? createArray(result) : objectClone(result)), 
    callback = noop) : ++completed === size ? (iterator = noop, callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, 
    iterate()), sync = !1;
  }
  timesSync(limit > size ? size : limit, iterate);
}

function createSortBy(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    var size, array, criteria;
    callback = callback || noop;
    var completed = 0;
    if (isArray(collection)) size = collection.length, array = Array(size), criteria = Array(size), 
    arrayEach(collection, iterator, createCallback); else if (collection) {
      if (iteratorSymbol && collection[iteratorSymbol]) array = [], criteria = [], (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, sortByCriteria(array, criteria)); else if (typeof collection === obj) {
        var keys = nativeKeys(collection);
        size = keys.length, array = Array(size), criteria = Array(size), baseEach(collection, iterator, createCallback, keys);
      }
    } else ;
    function createCallback(index, value) {
      var called = !1;
      return array[index] = value, function(err, criterion) {
        called && throwError(), called = !0, criteria[index] = criterion, err ? (callback = once(callback))(err) : ++completed === size && callback(null, sortByCriteria(array, criteria));
      };
    }
    size || callback(null, []);
  };
}

function sortBySeries(collection, iterator, callback) {
  var size, key, value, keys, iter, item, array, criteria, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1, completed = 0;
  if (isArray(collection) ? (size = collection.length, array = collection, criteria = Array(size), 
  iterate = 3 === iterator.length ? function() {
    value = collection[completed], iterator(value, completed, done);
  } : function() {
    value = collection[completed], iterator(value, done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  array = [], criteria = [], iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    if ((item = iter.next()).done) return callback(null, sortByCriteria(array, criteria));
    value = item.value, array[completed] = value, iterator(value, completed, done);
  } : function() {
    if ((item = iter.next()).done) return callback(null, sortByCriteria(array, criteria));
    value = item.value, array[completed] = value, iterator(value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  array = Array(size), criteria = Array(size), iterate = 3 === iterator.length ? function() {
    key = keys[completed], value = collection[key], array[completed] = value, iterator(value, key, done);
  } : function() {
    value = collection[keys[completed]], array[completed] = value, iterator(value, done);
  })), !size) return callback(null, []);
  function done(err, criterion) {
    criteria[completed] = criterion, err ? callback(err) : ++completed === size ? (iterate = throwError, 
    callback(null, sortByCriteria(array, criteria))) : sync ? nextTick(iterate) : (sync = !0, 
    iterate()), sync = !1;
  }
  iterate();
}

function sortByLimit(collection, limit, iterator, callback) {
  var size, index, key, value, array, keys, iter, item, criteria, iterate;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(collection) ? (size = collection.length, array = collection, iterate = 3 === iterator.length ? function() {
    (index = started++) < size && (value = collection[index], iterator(value, index, createCallback(value, index)));
  } : function() {
    started < size && (value = collection[started], iterator(value, createCallback(value, started++)));
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), array = [], criteria = [], iterate = 3 === iterator.length ? function() {
    !1 === (item = iter.next()).done ? (value = item.value, array[started] = value, 
    iterator(value, started, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, sortByCriteria(array, criteria)));
  } : function() {
    !1 === (item = iter.next()).done ? (value = item.value, array[started] = value, 
    iterator(value, createCallback(value, started++))) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, sortByCriteria(array, criteria)));
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  array = Array(size), iterate = 3 === iterator.length ? function() {
    started < size && (key = keys[started], value = collection[key], array[started] = value, 
    iterator(value, key, createCallback(value, started++)));
  } : function() {
    started < size && (value = collection[keys[started]], array[started] = value, iterator(value, createCallback(value, started++)));
  })), !size || isNaN(limit) || limit < 1) return callback(null, []);
  function createCallback(value, index) {
    var called = !1;
    return function(err, criterion) {
      called && throwError(), called = !0, criteria[index] = criterion, err ? (iterate = noop, 
      callback(err), callback = noop) : ++completed === size ? callback(null, sortByCriteria(array, criteria)) : sync ? nextTick(iterate) : (sync = !0, 
      iterate()), sync = !1;
    };
  }
  criteria = criteria || Array(size), timesSync(limit > size ? size : limit, iterate);
}

function some(collection, iterator, callback) {
  callback = callback || noop, detect(collection, iterator, (function(err, res) {
    if (err) return callback(err);
    callback(null, !!res);
  }));
}

function someSeries(collection, iterator, callback) {
  callback = callback || noop, detectSeries(collection, iterator, (function(err, res) {
    if (err) return callback(err);
    callback(null, !!res);
  }));
}

function someLimit(collection, limit, iterator, callback) {
  callback = callback || noop, detectLimit(collection, limit, iterator, (function(err, res) {
    if (err) return callback(err);
    callback(null, !!res);
  }));
}

function createEvery(arrayEach, baseEach, symbolEach) {
  var deny = createDetect(arrayEach, baseEach, symbolEach, !1);
  return function(collection, iterator, callback) {
    callback = callback || noop, deny(collection, iterator, (function(err, res) {
      if (err) return callback(err);
      callback(null, !res);
    }));
  };
}

function createEverySeries() {
  var denySeries = createDetectSeries(!1);
  return function(collection, iterator, callback) {
    callback = callback || noop, denySeries(collection, iterator, (function(err, res) {
      if (err) return callback(err);
      callback(null, !res);
    }));
  };
}

function createEveryLimit() {
  var denyLimit = createDetectLimit(!1);
  return function(collection, limit, iterator, callback) {
    callback = callback || noop, denyLimit(collection, limit, iterator, (function(err, res) {
      if (err) return callback(err);
      callback(null, !res);
    }));
  };
}

function createConcat(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    var size, result;
    callback = callback || noop;
    var completed = 0;
    if (isArray(collection)) size = collection.length, result = Array(size), arrayEach(collection, iterator, createCallback); else if (collection) {
      if (iteratorSymbol && collection[iteratorSymbol]) result = [], (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, result); else if (typeof collection === obj) {
        var keys = nativeKeys(collection);
        size = keys.length, result = Array(size), baseEach(collection, iterator, createCallback, keys);
      }
    } else ;
    function createCallback(index) {
      return function(err, res) {
        if (null === index && throwError(), err) return index = null, callback = once(callback), 
        arrayEachSync(result, (function(array, index) {
          void 0 === array && (result[index] = noop);
        })), void callback(err, makeConcatResult(result));
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
        }
        index = null, ++completed === size && callback(null, makeConcatResult(result));
      };
    }
    size || callback(null, []);
  };
}

function concatSeries(collection, iterator, callback) {
  var size, key, keys, iter, item, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1, result = [], completed = 0;
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    iterator(collection[completed], completed, done);
  } : function() {
    iterator(collection[completed], done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, completed, done);
  } : function() {
    (item = iter.next()).done ? callback(null, result) : iterator(item.value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    key = keys[completed], iterator(collection[key], key, done);
  } : function() {
    iterator(collection[keys[completed]], done);
  })), !size) return callback(null, result);
  function done(err, array) {
    isArray(array) ? nativePush.apply(result, array) : arguments.length >= 2 && nativePush.apply(result, slice(arguments, 1)), 
    err ? callback(err, result) : ++completed === size ? (iterate = throwError, callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, 
    iterate()), sync = !1;
  }
  iterate();
}

function concatLimit(collection, limit, iterator, callback) {
  var size, key, iter, item, iterate, result;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(collection)) size = collection.length, iterate = 3 === iterator.length ? function() {
    started < size && iterator(collection[started], started, createCallback(started++));
  } : function() {
    started < size && iterator(collection[started], createCallback(started++));
  }; else if (collection) {
    if (iteratorSymbol && collection[iteratorSymbol]) size = 1 / 0, result = [], iter = collection[iteratorSymbol](), 
    iterate = 3 === iterator.length ? function() {
      !1 === (item = iter.next()).done ? iterator(item.value, started, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, makeConcatResult(result)));
    } : function() {
      !1 === (item = iter.next()).done ? iterator(item.value, createCallback(started++)) : completed === started && iterator !== noop && (iterator = noop, 
      callback(null, makeConcatResult(result)));
    }; else if (typeof collection === obj) {
      var keys = nativeKeys(collection);
      size = keys.length, iterate = 3 === iterator.length ? function() {
        started < size && (key = keys[started], iterator(collection[key], key, createCallback(started++)));
      } : function() {
        started < size && iterator(collection[keys[started]], createCallback(started++));
      };
    }
  } else ;
  if (!size || isNaN(limit) || limit < 1) return callback(null, []);
  function createCallback(index) {
    return function(err, res) {
      if (null === index && throwError(), err) return index = null, iterate = noop, callback = once(callback), 
      arrayEachSync(result, (function(array, index) {
        void 0 === array && (result[index] = noop);
      })), void callback(err, makeConcatResult(result));
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
      }
      index = null, ++completed === size ? (iterate = throwError, callback(null, makeConcatResult(result)), 
      callback = throwError) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
    };
  }
  result = result || Array(size), timesSync(limit > size ? size : limit, iterate);
}

function createGroupBy(arrayEach, baseEach, symbolEach) {
  return function(collection, iterator, callback) {
    var size;
    callback = callback || noop;
    var completed = 0, result = {};
    if (isArray(collection)) size = collection.length, arrayEach(collection, iterator, createCallback); else if (collection) {
      if (iteratorSymbol && collection[iteratorSymbol]) (size = symbolEach(collection, iterator, createCallback)) && size === completed && callback(null, result); else if (typeof collection === obj) {
        var keys = nativeKeys(collection);
        size = keys.length, baseEach(collection, iterator, createCallback, keys);
      }
    } else ;
    function createCallback(value) {
      var called = !1;
      return function(err, key) {
        if (called && throwError(), called = !0, err) (callback = once(callback))(err, objectClone(result)); else {
          var array = result[key];
          array ? array.push(value) : result[key] = [ value ], ++completed === size && callback(null, result);
        }
      };
    }
    size || callback(null, {});
  };
}

function groupBySeries(collection, iterator, callback) {
  var size, key, value, keys, iter, item, iterate;
  callback = onlyOnce(callback || noop);
  var sync = !1, completed = 0, result = {};
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    value = collection[completed], iterator(value, completed, done);
  } : function() {
    value = collection[completed], iterator(value, done);
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, completed, done);
  } : function() {
    item = iter.next(), value = item.value, item.done ? callback(null, result) : iterator(value, done);
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    key = keys[completed], value = collection[key], iterator(value, key, done);
  } : function() {
    value = collection[keys[completed]], iterator(value, done);
  })), !size) return callback(null, result);
  function done(err, key) {
    if (err) return iterate = throwError, void (callback = onlyOnce(callback))(err, objectClone(result));
    var array = result[key];
    array ? array.push(value) : result[key] = [ value ], ++completed === size ? (iterate = throwError, 
    callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function groupByLimit(collection, limit, iterator, callback) {
  var size, index, key, value, keys, iter, item, iterate;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0, result = {};
  if (isArray(collection) ? (size = collection.length, iterate = 3 === iterator.length ? function() {
    (index = started++) < size && (value = collection[index], iterator(value, index, createCallback(value)));
  } : function() {
    started < size && (value = collection[started++], iterator(value, createCallback(value)));
  }) : collection && (iteratorSymbol && collection[iteratorSymbol] ? (size = 1 / 0, 
  iter = collection[iteratorSymbol](), iterate = 3 === iterator.length ? function() {
    !1 === (item = iter.next()).done ? (value = item.value, iterator(value, started++, createCallback(value))) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  } : function() {
    !1 === (item = iter.next()).done ? (started++, value = item.value, iterator(value, createCallback(value))) : completed === started && iterator !== noop && (iterator = noop, 
    callback(null, result));
  }) : typeof collection === obj && (keys = nativeKeys(collection), size = keys.length, 
  iterate = 3 === iterator.length ? function() {
    started < size && (key = keys[started++], value = collection[key], iterator(value, key, createCallback(value)));
  } : function() {
    started < size && (value = collection[keys[started++]], iterator(value, createCallback(value)));
  })), !size || isNaN(limit) || limit < 1) return callback(null, result);
  function createCallback(value) {
    var called = !1;
    return function(err, key) {
      if (called && throwError(), called = !0, err) return iterate = noop, void (callback = once(callback))(err, objectClone(result));
      var array = result[key];
      array ? array.push(value) : result[key] = [ value ], ++completed === size ? callback(null, result) : sync ? nextTick(iterate) : (sync = !0, 
      iterate()), sync = !1;
    };
  }
  timesSync(limit > size ? size : limit, iterate);
}

function createParallel(arrayEach, baseEach) {
  return function(tasks, callback) {
    var size, keys, result;
    callback = callback || noop;
    var completed = 0;
    function createCallback(key) {
      return function(err, res) {
        if (null === key && throwError(), err) return key = null, void (callback = once(callback))(err, result);
        result[key] = arguments.length <= 2 ? res : slice(arguments, 1), key = null, ++completed === size && callback(null, result);
      };
    }
    isArray(tasks) ? (size = tasks.length, result = Array(size), arrayEach(tasks, createCallback)) : tasks && typeof tasks === obj && (keys = nativeKeys(tasks), 
    size = keys.length, result = {}, baseEach(tasks, createCallback, keys)), size || callback(null, result);
  };
}

function series(tasks, callback) {
  var size, key, keys, result, iterate;
  callback = callback || noop;
  var sync = !1, completed = 0;
  if (isArray(tasks)) size = tasks.length, result = Array(size), iterate = function() {
    key = completed, tasks[completed](done);
  }; else {
    if (!tasks || typeof tasks !== obj) return callback(null);
    keys = nativeKeys(tasks), size = keys.length, result = {}, iterate = function() {
      key = keys[completed], tasks[key](done);
    };
  }
  if (!size) return callback(null, result);
  function done(err, res) {
    if (err) return iterate = throwError, void (callback = onlyOnce(callback))(err, result);
    result[key] = arguments.length <= 2 ? res : slice(arguments, 1), ++completed === size ? (iterate = throwError, 
    callback(null, result)) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function parallelLimit(tasks, limit, callback) {
  var size, index, key, keys, result, iterate;
  callback = callback || noop;
  var sync = !1, started = 0, completed = 0;
  if (isArray(tasks) ? (size = tasks.length, result = Array(size), iterate = function() {
    (index = started++) < size && tasks[index](createCallback(index));
  }) : tasks && typeof tasks === obj && (keys = nativeKeys(tasks), size = keys.length, 
  result = {}, iterate = function() {
    started < size && (key = keys[started++], tasks[key](createCallback(key)));
  }), !size || isNaN(limit) || limit < 1) return callback(null, result);
  function createCallback(key) {
    return function(err, res) {
      if (null === key && throwError(), err) return key = null, iterate = noop, void (callback = once(callback))(err, result);
      result[key] = arguments.length <= 2 ? res : slice(arguments, 1), key = null, ++completed === size ? callback(null, result) : sync ? nextTick(iterate) : (sync = !0, 
      iterate()), sync = !1;
    };
  }
  timesSync(limit > size ? size : limit, iterate);
}

function tryEach(tasks, callback) {
  var size, keys, iterate;
  callback = callback || noop;
  var completed = 0;
  if (isArray(tasks) ? (size = tasks.length, iterate = function() {
    tasks[completed](done);
  }) : tasks && typeof tasks === obj && (keys = nativeKeys(tasks), size = keys.length, 
  iterate = function() {
    tasks[keys[completed]](done);
  }), !size) return callback(null);
  function done(err, res) {
    err ? ++completed === size ? callback(err) : (!0, iterate()) : callback(null, arguments.length <= 2 ? res : slice(arguments, 1)), 
    !1;
  }
  iterate();
}

function checkWaterfallTasks(tasks, callback) {
  return isArray(tasks) ? 0 !== tasks.length || (callback(null), !1) : (callback(new Error("First argument to waterfall must be an array of functions")), 
  !1);
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
    return (args = slice(args, 1)).push(next), func.apply(null, args);
  }
}

function waterfall(tasks, callback) {
  if (checkWaterfallTasks(tasks, callback = callback || noop)) {
    var func, args, done, sync, completed = 0, size = tasks.length;
    waterfallIterator(tasks[0], [], createCallback(0));
  }
  function iterate() {
    waterfallIterator(func, args, createCallback(func));
  }
  function createCallback(index) {
    return function(err, res) {
      return void 0 === index && (callback = noop, throwError()), index = void 0, err ? (done = callback, 
      callback = throwError, void done(err)) : ++completed === size ? (done = callback, 
      callback = throwError, void (arguments.length <= 2 ? done(err, res) : done.apply(null, createArray(arguments)))) : (sync ? (args = arguments, 
      func = tasks[completed] || throwError, nextTick(iterate)) : (sync = !0, waterfallIterator(tasks[completed] || throwError, arguments, createCallback(completed))), 
      void (sync = !1));
    };
  }
}

function angelFall(tasks, callback) {
  if (checkWaterfallTasks(tasks, callback = callback || noop)) {
    var completed = 0, sync = !1, size = tasks.length, func = tasks[completed], args = [], iterate = function() {
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
        return (args = slice(args, 1))[func.length - 1] = next, func.apply(null, args);
      }
    };
    iterate();
  }
  function next(err, res) {
    if (err) return iterate = throwError, void (callback = onlyOnce(callback))(err);
    if (++completed === size) {
      iterate = throwError;
      var done = callback;
      return callback = throwError, void (2 === arguments.length ? done(err, res) : done.apply(null, createArray(arguments)));
    }
    func = tasks[completed], args = arguments, sync ? nextTick(iterate) : (sync = !0, 
    iterate()), sync = !1;
  }
}

function whilst(test, iterator, callback) {
  callback = callback || noop;
  var sync = !1;
  function iterate() {
    sync ? nextTick(next) : (sync = !0, iterator(done)), sync = !1;
  }
  function next() {
    iterator(done);
  }
  function done(err, arg) {
    if (err) return callback(err);
    arguments.length <= 2 ? test(arg) ? iterate() : callback(null, arg) : (arg = slice(arguments, 1), 
    test.apply(null, arg) ? iterate() : callback.apply(null, [ null ].concat(arg)));
  }
  test() ? iterate() : callback(null);
}

function doWhilst(iterator, test, callback) {
  callback = callback || noop;
  var sync = !1;
  function iterate() {
    sync ? nextTick(next) : (sync = !0, iterator(done)), sync = !1;
  }
  function next() {
    iterator(done);
  }
  function done(err, arg) {
    if (err) return callback(err);
    arguments.length <= 2 ? test(arg) ? iterate() : callback(null, arg) : (arg = slice(arguments, 1), 
    test.apply(null, arg) ? iterate() : callback.apply(null, [ null ].concat(arg)));
  }
  next();
}

function until(test, iterator, callback) {
  callback = callback || noop;
  var sync = !1;
  function iterate() {
    sync ? nextTick(next) : (sync = !0, iterator(done)), sync = !1;
  }
  function next() {
    iterator(done);
  }
  function done(err, arg) {
    if (err) return callback(err);
    arguments.length <= 2 ? test(arg) ? callback(null, arg) : iterate() : (arg = slice(arguments, 1), 
    test.apply(null, arg) ? callback.apply(null, [ null ].concat(arg)) : iterate());
  }
  test() ? callback(null) : iterate();
}

function doUntil(iterator, test, callback) {
  callback = callback || noop;
  var sync = !1;
  function iterate() {
    sync ? nextTick(next) : (sync = !0, iterator(done)), sync = !1;
  }
  function next() {
    iterator(done);
  }
  function done(err, arg) {
    if (err) return callback(err);
    arguments.length <= 2 ? test(arg) ? callback(null, arg) : iterate() : (arg = slice(arguments, 1), 
    test.apply(null, arg) ? callback.apply(null, [ null ].concat(arg)) : iterate());
  }
  next();
}

function during(test, iterator, callback) {
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
  callback = callback || noop, _test();
}

function doDuring(iterator, test, callback) {
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
      args.push(iterate), test.apply(null, args);
    }
  }
  callback = callback || noop, iterate(null, !0);
}

function forever(iterator, callback) {
  var sync = !1;
  function iterate() {
    iterator(next);
  }
  function next(err) {
    if (err) {
      if (callback) return callback(err);
      throw err;
    }
    sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function compose() {
  return seq.apply(null, reverse(arguments));
}

function seq() {
  var fns = createArray(arguments);
  return function() {
    var self = this, args = createArray(arguments), callback = args[args.length - 1];
    function iterator(newargs, fn, callback) {
      newargs.push((function(err) {
        var nextargs = slice(arguments, 1);
        callback(err, nextargs);
      })), fn.apply(self, newargs);
    }
    function done(err, res) {
      (res = isArray(res) ? res : [ res ]).unshift(err), callback.apply(self, res);
    }
    typeof callback === func ? args.pop() : callback = noop, reduce(fns, args, iterator, done);
  };
}

function createApplyEach(func) {
  return function(fns) {
    var go = function() {
      var self = this, args = createArray(arguments), callback = args.pop() || noop;
      return func(fns, iterator, callback);
      function iterator(fn, done) {
        fn.apply(self, args.concat([ done ]));
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
  this.head = null, this.tail = null, this.length = 0;
}

function baseQueue(isQueue, worker, concurrency, payload) {
  if (void 0 === concurrency) concurrency = 1; else if (isNaN(concurrency) || concurrency < 1) throw new Error("Concurrency must not be zero");
  var _callback, _unshift, workers = 0, workersList = [], q = {
    _tasks: new DLL,
    concurrency: concurrency,
    payload: payload,
    saturated: noop,
    unsaturated: noop,
    buffer: concurrency / 4,
    empty: noop,
    drain: noop,
    error: noop,
    started: !1,
    paused: !1,
    push: function(tasks, callback) {
      _insert(tasks, callback);
    },
    kill: function() {
      q.drain = noop, q._tasks.empty();
    },
    unshift: function(tasks, callback) {
      _insert(tasks, callback, !0);
    },
    remove: function(test) {
      q._tasks.remove(test);
    },
    process: isQueue ? function() {
      for (;!q.paused && workers < q.concurrency && q._tasks.length; ) {
        var task = q._tasks.shift();
        workers++, workersList.push(task), 0 === q._tasks.length && q.empty(), workers === q.concurrency && q.saturated();
        var done = _next(q, [ task ]);
        worker(task.data, done);
      }
    } : function() {
      for (;!q.paused && workers < q.concurrency && q._tasks.length; ) {
        for (var tasks = q._tasks.splice(q.payload || q._tasks.length), index = -1, size = tasks.length, data = Array(size); ++index < size; ) data[index] = tasks[index].data;
        workers++, nativePush.apply(workersList, tasks), 0 === q._tasks.length && q.empty(), 
        workers === q.concurrency && q.saturated();
        var done = _next(q, tasks);
        worker(data, done);
      }
    },
    length: function() {
      return q._tasks.length;
    },
    running: function() {
      return workers;
    },
    workersList: function() {
      return workersList;
    },
    idle: function() {
      return q.length() + workers === 0;
    },
    pause: function() {
      q.paused = !0;
    },
    resume: function() {
      if (!1 === q.paused) return;
      q.paused = !1, timesSync(q.concurrency < q._tasks.length ? q.concurrency : q._tasks.length, _resume);
    },
    _worker: worker
  };
  return q;
  function _exec(task) {
    var item = {
      data: task,
      callback: _callback
    };
    _unshift ? q._tasks.unshift(item) : q._tasks.push(item), nextTick(q.process);
  }
  function _insert(tasks, callback, unshift) {
    if (null == callback) callback = noop; else if ("function" != typeof callback) throw new Error("task callback must be a function");
    q.started = !0;
    var _tasks = isArray(tasks) ? tasks : [ tasks ];
    void 0 !== tasks && _tasks.length ? (_unshift = unshift, _callback = callback, arrayEachSync(_tasks, _exec), 
    _callback = void 0) : q.idle() && nextTick(q.drain);
  }
  function _next(q, tasks) {
    var called = !1;
    return function(err, res) {
      var task;
      called && throwError(), called = !0, workers--;
      for (var index = -1, size = workersList.length, taskIndex = -1, taskSize = tasks.length, useApply = arguments.length > 2, args = useApply && createArray(arguments); ++taskIndex < taskSize; ) {
        for (task = tasks[taskIndex]; ++index < size; ) workersList[index] === task && (0 === index ? workersList.shift() : workersList.splice(index, 1), 
        index = size, size--);
        index = -1, useApply ? task.callback.apply(task, args) : task.callback(err, res), 
        err && q.error(err, task.data);
      }
      workers <= q.concurrency - q.buffer && q.unsaturated(), q._tasks.length + workers === 0 && q.drain(), 
      q.process();
    };
  }
  function _resume() {
    nextTick(q.process);
  }
}

function queue(worker, concurrency) {
  return baseQueue(!0, worker, concurrency);
}

function priorityQueue(worker, concurrency) {
  var q = baseQueue(!0, worker, concurrency);
  return q.push = function(tasks, priority, callback) {
    q.started = !0, priority = priority || 0;
    var _tasks = isArray(tasks) ? tasks : [ tasks ], taskSize = _tasks.length;
    if (void 0 === tasks || 0 === taskSize) return void (q.idle() && nextTick(q.drain));
    callback = typeof callback === func ? callback : noop;
    var nextNode = q._tasks.head;
    for (;nextNode && priority >= nextNode.priority; ) nextNode = nextNode.next;
    for (;taskSize--; ) {
      var item = {
        data: _tasks[taskSize],
        priority: priority,
        callback: callback
      };
      nextNode ? q._tasks.insertBefore(nextNode, item) : q._tasks.push(item), nextTick(q.process);
    }
  }, delete q.unshift, q;
}

function cargo(worker, payload) {
  return baseQueue(!1, worker, 1, payload);
}

function auto(tasks, concurrency, callback) {
  typeof concurrency === func && (callback = concurrency, concurrency = null);
  var keys = nativeKeys(tasks), rest = keys.length, results = {};
  if (0 === rest) return callback(null, results);
  var runningTasks = 0, readyTasks = new DLL, listeners = Object.create(null);
  function proceedQueue() {
    if (0 === readyTasks.length && 0 === runningTasks) {
      if (0 !== rest) throw new Error("async.auto task has cyclic dependencies");
      return callback(null, results);
    }
    for (;readyTasks.length && runningTasks < concurrency && callback !== noop; ) {
      runningTasks++;
      var array = readyTasks.shift();
      0 === array[1] ? array[0](array[2]) : array[0](results, array[2]);
    }
  }
  function taskComplete(key) {
    arrayEachSync(listeners[key] || [], (function(task) {
      task();
    })), proceedQueue();
  }
  callback = onlyOnce(callback || noop), concurrency = concurrency || rest, baseEachSync(tasks, (function(task, key) {
    var _task, _taskSize;
    if (!isArray(task)) return _task = task, _taskSize = 0, void readyTasks.push([ _task, _taskSize, done ]);
    var dependencySize = task.length - 1;
    if (_task = task[dependencySize], _taskSize = dependencySize, 0 === dependencySize) return void readyTasks.push([ _task, _taskSize, done ]);
    var index = -1;
    for (;++index < dependencySize; ) {
      var dependencyName = task[index];
      if (notInclude(keys, dependencyName)) {
        var msg = "async.auto task `" + key + "` has non-existent dependency `" + dependencyName + "` in " + task.join(", ");
        throw new Error(msg);
      }
      var taskListeners = listeners[dependencyName];
      taskListeners || (taskListeners = listeners[dependencyName] = []), taskListeners.push(taskListener);
    }
    function done(err, arg) {
      if (null === key && throwError(), arg = arguments.length <= 2 ? arg : slice(arguments, 1), 
      err) {
        rest = 0, runningTasks = 0, readyTasks.length = 0;
        var safeResults = objectClone(results);
        safeResults[key] = arg, key = null;
        var _callback = callback;
        return callback = noop, void _callback(err, safeResults);
      }
      runningTasks--, rest--, results[key] = arg, taskComplete(key), key = null;
    }
    function taskListener() {
      0 == --dependencySize && readyTasks.push([ _task, _taskSize, done ]);
    }
  }), keys), proceedQueue();
}

exports.default = index, baseEachSync(index, (function(func, key) {
  exports[key] = func;
}), nativeKeys(index)), DLL.prototype._removeLink = function(node) {
  var prev = node.prev, next = node.next;
  return prev ? prev.next = next : this.head = next, next ? next.prev = prev : this.tail = prev, 
  node.prev = null, node.next = null, this.length--, node;
}, DLL.prototype.empty = DLL, DLL.prototype._setInitial = function(node) {
  this.length = 1, this.head = this.tail = node;
}, DLL.prototype.insertBefore = function(node, newNode) {
  newNode.prev = node.prev, newNode.next = node, node.prev ? node.prev.next = newNode : this.head = newNode, 
  node.prev = newNode, this.length++;
}, DLL.prototype.unshift = function(node) {
  this.head ? this.insertBefore(this.head, node) : this._setInitial(node);
}, DLL.prototype.push = function(node) {
  var tail = this.tail;
  tail ? (node.prev = tail, node.next = tail.next, this.tail = node, tail.next = node, 
  this.length++) : this._setInitial(node);
}, DLL.prototype.shift = function() {
  return this.head && this._removeLink(this.head);
}, DLL.prototype.splice = function(end) {
  for (var task, tasks = []; end-- && (task = this.shift()); ) tasks.push(task);
  return tasks;
}, DLL.prototype.remove = function(test) {
  for (var node = this.head; node; ) test(node) && this._removeLink(node), node = node.next;
  return this;
};

var FN_ARGS = /^(function)?\s*[^\(]*\(\s*([^\)]*)\)/m, FN_ARG_SPLIT = /,/, FN_ARG = /(=.+)?(\s*)$/, STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

function parseParams(func) {
  return func = (func = (func = (func = func.toString().replace(STRIP_COMMENTS, "")).match(FN_ARGS)[2].replace(" ", "")) ? func.split(FN_ARG_SPLIT) : []).map((function(arg) {
    return arg.replace(FN_ARG, "").trim();
  }));
}

function autoInject(tasks, concurrency, callback) {
  var newTasks = {};
  baseEachSync(tasks, (function(task, key) {
    var params, taskLength = task.length;
    if (isArray(task)) {
      if (0 === taskLength) throw new Error("autoInject task functions require explicit parameters.");
      if (params = createArray(task), taskLength = params.length - 1, task = params[taskLength], 
      0 === taskLength) return void (newTasks[key] = task);
    } else {
      if (1 === taskLength) return void (newTasks[key] = task);
      if (params = parseParams(task), 0 === taskLength && 0 === params.length) throw new Error("autoInject task functions require explicit parameters.");
      taskLength = params.length - 1;
    }
    params[taskLength] = function(results, done) {
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
        for (var i = -1; ++i < taskLength; ) params[i] = results[params[i]];
        params[i] = done, task.apply(null, params);
      }
    }, newTasks[key] = params;
  }), nativeKeys(tasks)), auto(newTasks, concurrency, callback);
}

function retry(opts, task, callback) {
  var times, intervalFunc, errorFilter, count = 0;
  if (arguments.length < 3 && typeof opts === func) callback = task || noop, task = opts, 
  opts = null, times = DEFAULT_TIMES; else switch (callback = callback || noop, typeof opts) {
   case "object":
    typeof opts.errorFilter === func && (errorFilter = opts.errorFilter);
    var interval = opts.interval;
    switch (typeof interval) {
     case func:
      intervalFunc = interval;
      break;

     case "string":
     case "number":
      intervalFunc = (interval = +interval) ? function() {
        return interval;
      } : function() {
        return DEFAULT_INTERVAL;
      };
    }
    times = +opts.times || DEFAULT_TIMES;
    break;

   case "number":
    times = opts || DEFAULT_TIMES;
    break;

   case "string":
    times = +opts || DEFAULT_TIMES;
    break;

   default:
    throw new Error("Invalid arguments for async.retry");
  }
  if ("function" != typeof task) throw new Error("Invalid arguments for async.retry");
  function simpleIterator() {
    task(simpleCallback);
  }
  function simpleCallback(err, res) {
    if (++count === times || !err || errorFilter && !errorFilter(err)) {
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
    if (++count === times || !err || errorFilter && !errorFilter(err)) {
      if (arguments.length <= 2) return callback(err, res);
      var args = createArray(arguments);
      return callback.apply(null, args);
    }
    setTimeout(intervalIterator, intervalFunc(count));
  }
  task(intervalFunc ? intervalCallback : simpleCallback);
}

function retryable(opts, task) {
  return task || (task = opts, opts = null), function() {
    var taskFn, args = createArray(arguments), lastIndex = args.length - 1, callback = args[lastIndex];
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
      args[lastIndex] = callback, task.apply(null, args);
    }
  };
}

function iterator(tasks) {
  var size = 0, keys = [];
  return isArray(tasks) ? size = tasks.length : (keys = nativeKeys(tasks), size = keys.length), 
  function makeCallback(index) {
    var fn = function() {
      if (size) {
        var key = keys[index] || index;
        tasks[key].apply(null, createArray(arguments));
      }
      return fn.next();
    };
    return fn.next = function() {
      return index < size - 1 ? makeCallback(index + 1) : null;
    }, fn;
  }(0);
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
    var size = arguments.length, index = 0, args = Array(size);
    for (args[index] = null; ++index < size; ) args[index] = arguments[index];
    return func.bind.apply(func, args);
  }
}

function timeout(func, millisec, info) {
  var callback, timer;
  return function() {
    timer = setTimeout(timeoutCallback, millisec);
    var args = createArray(arguments), lastIndex = args.length - 1;
    callback = args[lastIndex], args[lastIndex] = injectedCallback, simpleApply(func, args);
  };
  function timeoutCallback() {
    var name = func.name || "anonymous", err = new Error('Callback function "' + name + '" timed out.');
    err.code = "ETIMEDOUT", info && (err.info = info), timer = null, callback(err);
  }
  function injectedCallback() {
    null !== timer && (simpleApply(callback, createArray(arguments)), clearTimeout(timer));
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
    }
  }
}

function times(n, iterator, callback) {
  if (callback = callback || noop, n = +n, isNaN(n) || n < 1) return callback(null, []);
  var result = Array(n);
  timesSync(n, (function(num) {
    iterator(num, function(index) {
      return function(err, res) {
        null === index && throwError(), result[index] = res, index = null, err ? (callback(err), 
        callback = noop) : 0 == --n && callback(null, result);
      };
    }(num));
  }));
}

function timesSeries(n, iterator, callback) {
  if (callback = callback || noop, n = +n, isNaN(n) || n < 1) return callback(null, []);
  var result = Array(n), sync = !1, completed = 0;
  function iterate() {
    iterator(completed, done);
  }
  function done(err, res) {
    result[completed] = res, err ? (callback(err), callback = throwError) : ++completed >= n ? (callback(null, result), 
    callback = throwError) : sync ? nextTick(iterate) : (sync = !0, iterate()), sync = !1;
  }
  iterate();
}

function timesLimit(n, limit, iterator, callback) {
  if (callback = callback || noop, n = +n, isNaN(n) || n < 1 || isNaN(limit) || limit < 1) return callback(null, []);
  var result = Array(n), sync = !1, started = 0, completed = 0;
  function iterate() {
    var index = started++;
    index < n && iterator(index, function(index) {
      return function(err, res) {
        null === index && throwError(), result[index] = res, index = null, err ? (callback(err), 
        callback = noop) : ++completed >= n ? (callback(null, result), callback = throwError) : sync ? nextTick(iterate) : (sync = !0, 
        iterate()), sync = !1;
      };
    }(index));
  }
  timesSync(limit > n ? n : limit, iterate);
}

function race(tasks, callback) {
  var size, keys;
  callback = once(callback || noop);
  var index = -1;
  if (isArray(tasks)) for (size = tasks.length; ++index < size; ) tasks[index](callback); else {
    if (!tasks || typeof tasks !== obj) return callback(new TypeError("First argument to race must be a collection of functions"));
    for (size = (keys = nativeKeys(tasks)).length; ++index < size; ) tasks[keys[index]](callback);
  }
  size || callback(null);
}

function memoize(fn, hasher) {
  hasher = hasher || function(hash) {
    return hash;
  };
  var memo = {}, queues = {}, memoized = function() {
    var args = createArray(arguments), callback = args.pop(), key = hasher.apply(null, args);
    if (has(memo, key)) nextTick((function() {
      callback.apply(null, memo[key]);
    })); else {
      if (has(queues, key)) return queues[key].push(callback);
      queues[key] = [ callback ], args.push(done), fn.apply(null, args);
    }
    function done(err) {
      var args = createArray(arguments);
      err || (memo[key] = args);
      var q = queues[key];
      delete queues[key];
      for (var i = -1, size = q.length; ++i < size; ) q[i].apply(null, args);
    }
  };
  return memoized.memo = memo, memoized.unmemoized = fn, memoized;
}

function unmemoize(fn) {
  return function() {
    return (fn.unmemoized || fn).apply(null, arguments);
  };
}

function ensureAsync(fn) {
  return function() {
    var args = createArray(arguments), lastIndex = args.length - 1, callback = args[lastIndex], sync = !0;
    function done() {
      var innerArgs = createArray(arguments);
      sync ? nextTick((function() {
        callback.apply(null, innerArgs);
      })) : callback.apply(null, innerArgs);
    }
    args[lastIndex] = done, fn.apply(this, args), sync = !1;
  };
}

function constant() {
  var args = [ null ].concat(createArray(arguments));
  return function(callback) {
    (callback = arguments[arguments.length - 1]).apply(this, args);
  };
}

function asyncify(fn) {
  return function() {
    var result, args = createArray(arguments), callback = args.pop();
    try {
      result = fn.apply(this, args);
    } catch (e) {
      return callback(e);
    }
    result && typeof result.then === func ? result.then((function(value) {
      invokeCallback(callback, null, value);
    }), (function(err) {
      invokeCallback(callback, err && err.message ? err : new Error(err));
    })) : callback(null, result);
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
      return callback = arguments[0], func(done);

     case 2:
      return callback = arguments[1], func(arguments[0], done);

     default:
      var args = createArray(arguments), lastIndex = args.length - 1;
      callback = args[lastIndex], args[lastIndex] = done, func.apply(this, args);
    }
    function done(err, res) {
      if (err) return callback(null, {
        error: err
      });
      arguments.length > 2 && (res = slice(arguments, 1)), callback(null, {
        value: res
      });
    }
  };
}

function reflectAll(tasks) {
  var newTasks, keys;
  return isArray(tasks) ? (newTasks = Array(tasks.length), arrayEachSync(tasks, iterate)) : tasks && typeof tasks === obj && (keys = nativeKeys(tasks), 
  newTasks = {}, baseEachSync(tasks, iterate, keys)), newTasks;
  function iterate(func, key) {
    newTasks[key] = reflect(func);
  }
}

function createLogger(name) {
  return function(fn) {
    var args = slice(arguments, 1);
    args.push(done), fn.apply(null, args);
  };
  function done(err) {
    if (typeof console === obj) {
      if (err) return void (console.error && console.error(err));
      if (console[name]) {
        var args = slice(arguments, 1);
        arrayEachSync(args, (function(arg) {
          console[name](arg);
        }));
      }
    }
  }
}

function safe() {
  return createImmediate(), exports;
}

function fast() {
  return createImmediate(!1), exports;
}
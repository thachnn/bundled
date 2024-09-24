'use strict';

const Module = require('module'),
  crypto = require('crypto'),
  fs = require('fs'),
  path = require('path'),
  vm = require('vm'),
  os = require('os'),

  hasOwnProperty = Object.prototype.hasOwnProperty;

class FileSystemBlobStore {
  constructor(directory, prefix) {
    const name = prefix ? slashEscape(prefix + '.') : '';
    this._blobFilename = path.join(directory, name + 'BLOB');
    this._mapFilename = path.join(directory, name + 'MAP');
    this._lockFilename = path.join(directory, name + 'LOCK');
    this._directory = directory;
    this._load();
  }

  has(key, invalidationKey) {
    return hasOwnProperty.call(this._memoryBlobs, key)
      ? this._invalidationKeys[key] === invalidationKey
      : !!hasOwnProperty.call(this._storedMap, key) &&
          this._storedMap[key][0] === invalidationKey;
  }

  get(key, invalidationKey) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      if (this._invalidationKeys[key] === invalidationKey)
        return this._memoryBlobs[key];
    } else if (hasOwnProperty.call(this._storedMap, key)) {
      const mapping = this._storedMap[key];
      if (mapping[0] === invalidationKey)
        return this._storedBlob.slice(mapping[1], mapping[2]);
    }
  }

  set(key, invalidationKey, buffer) {
    this._invalidationKeys[key] = invalidationKey;
    this._memoryBlobs[key] = buffer;
    this._dirty = true;
  }

  delete(key) {
    if (hasOwnProperty.call(this._memoryBlobs, key)) {
      this._dirty = true;
      delete this._memoryBlobs[key];
    }
    if (hasOwnProperty.call(this._invalidationKeys, key)) {
      this._dirty = true;
      delete this._invalidationKeys[key];
    }
    if (hasOwnProperty.call(this._storedMap, key)) {
      this._dirty = true;
      delete this._storedMap[key];
    }
  }

  isDirty() {
    return this._dirty;
  }

  save() {
    const dump = this._getDump(),
      blobToStore = Buffer.concat(dump[0]),
      mapToStore = JSON.stringify(dump[1]);

    try {
      mkdirpSync(this._directory);
      fs.writeFileSync(this._lockFilename, 'LOCK', {flag: 'wx'});
    } catch (_error) {
      return false;
    }

    try {
      fs.writeFileSync(this._blobFilename, blobToStore);
      fs.writeFileSync(this._mapFilename, mapToStore);
    } finally {
      fs.unlinkSync(this._lockFilename);
    }

    return true;
  }

  _load() {
    try {
      this._storedBlob = fs.readFileSync(this._blobFilename);
      this._storedMap = JSON.parse(fs.readFileSync(this._mapFilename));
    } catch (_) {
      this._storedBlob = Buffer.alloc(0);
      this._storedMap = {};
    }
    this._dirty = false;
    this._memoryBlobs = {};
    this._invalidationKeys = {};
  }

  _getDump() {
    const buffers = [],
      newMap = {};
    let offset = 0;

    function push(key, invalidationKey, buffer) {
      buffers.push(buffer);
      newMap[key] = [invalidationKey, offset, offset + buffer.length];
      offset += buffer.length;
    }

    for (const key of Object.keys(this._memoryBlobs)) {
      const buffer = this._memoryBlobs[key];
      push(key, this._invalidationKeys[key], buffer);
    }

    for (const key of Object.keys(this._storedMap)) {
      if (hasOwnProperty.call(newMap, key)) continue;
      const mapping = this._storedMap[key],
        buffer = this._storedBlob.slice(mapping[1], mapping[2]);
      push(key, mapping[0], buffer);
    }

    return [buffers, newMap];
  }
}

class NativeCompileCache {
  constructor() {
    this._cacheStore = null;
    this._previousModuleCompile = null;
  }

  setCacheStore(cacheStore) {
    this._cacheStore = cacheStore;
  }

  install() {
    const self = this,
      hasRequireResolvePaths = typeof require.resolve.paths == 'function';
    this._previousModuleCompile = Module.prototype._compile;
    Module.prototype._compile = function(content, filename) {
      const mod = this;

      function require(id) {
        return mod.require(id);
      }

      function resolve(request, options) {
        return Module._resolveFilename(request, mod, false, options);
      }
      require.resolve = resolve;

      if (hasRequireResolvePaths)
        resolve.paths = function(request) {
          return Module._resolveLookupPaths(request, mod, true);
        };

      require.main = process.mainModule;

      require.extensions = Module._extensions;
      require.cache = Module._cache;

      const dirname = path.dirname(filename),

        compiledWrapper = self._moduleCompile(filename, content),

        args = [mod.exports, require, mod, filename, dirname, process, global, Buffer];
      return compiledWrapper.apply(mod.exports, args);
    };
  }

  uninstall() {
    Module.prototype._compile = this._previousModuleCompile;
  }

  _moduleCompile(filename, content) {
    var contLen = content.length;
    if (contLen >= 2 && content.charCodeAt(0) === 35 && content.charCodeAt(1) === 33)
      if (contLen === 2) content = '';
      else {
        var i = 2;
        for (; i < contLen; ++i) {
          var code = content.charCodeAt(i);
          if (code === 10 || code === 13) break;
        }
        content = i === contLen ? '' : content.slice(i);
      }

    var wrapper = Module.wrap(content),

      invalidationKey = crypto.createHash('sha1').update(content, 'utf8').digest('hex'),

      buffer = this._cacheStore.get(filename, invalidationKey);

    var script = new vm.Script(wrapper, {
      filename: filename,
      lineOffset: 0,
      displayErrors: true,
      cachedData: buffer,
      produceCachedData: true,
    });

    script.cachedDataProduced
      ? this._cacheStore.set(filename, invalidationKey, script.cachedData)
      : script.cachedDataRejected && this._cacheStore.delete(filename);

    return script.runInThisContext({
      filename: filename,
      lineOffset: 0,
      columnOffset: 0,
      displayErrors: true,
    });
  }
}

function mkdirpSync(p_) {
  _mkdirpSync(path.resolve(p_), 0o777);
}

function _mkdirpSync(p, mode) {
  try {
    fs.mkdirSync(p, mode);
  } catch (err0) {
    if (err0.code === 'ENOENT') {
      _mkdirpSync(path.dirname(p));
      _mkdirpSync(p);
    } else {
      try {
        if (fs.statSync(p).isDirectory()) return;
      } catch (_err1) {}
      throw err0;
    }
  }
}

function slashEscape(str) {
  const ESCAPE_LOOKUP = {'\\': 'zB', ':': 'zC', '/': 'zS', '\0': 'z0', z: 'zZ'},
    ESCAPE_REGEX = /[\\:/\x00z]/g;
  return str.replace(ESCAPE_REGEX, match => ESCAPE_LOOKUP[match]);
}

function supportsCachedData() {
  return new vm.Script('""', {produceCachedData: true}).cachedDataProduced === true;
}

function getCacheDir() {
  const v8_compile_cache_cache_dir = process.env.V8_COMPILE_CACHE_CACHE_DIR;
  if (v8_compile_cache_cache_dir) return v8_compile_cache_cache_dir;

  const dirname = typeof process.getuid == 'function'
    ? 'v8-compile-cache-' + process.getuid()
    : 'v8-compile-cache';
  const version = typeof process.versions.v8 == 'string'
    ? process.versions.v8
    : typeof process.versions.chakracore == 'string'
      ? 'chakracore-' + process.versions.chakracore
      : 'node-' + process.version;
  return path.join(os.tmpdir(), dirname, version);
}

function getMainName() {
  return require.main && typeof require.main.filename == 'string'
    ? require.main.filename
    : process.cwd();
}

if (!process.env.DISABLE_V8_COMPILE_CACHE && supportsCachedData()) {
  const blobStore = new FileSystemBlobStore(getCacheDir(), getMainName()),

    nativeCompileCache = new NativeCompileCache();
  nativeCompileCache.setCacheStore(blobStore);
  nativeCompileCache.install();

  process.once('exit', () => {
    blobStore.isDirty() && blobStore.save();

    nativeCompileCache.uninstall();
  });
}

module.exports.__TEST__ = {
  FileSystemBlobStore,
  NativeCompileCache,
  mkdirpSync,
  slashEscape,
  supportsCachedData,
  getCacheDir,
  getMainName,
};

"use strict";

const fs = require("fs"),
  { resolve, normalize, sep, relative, dirname, basename } = require("path");

function cleanPath(path) {
  let normalized = normalize(path);

  // we have to remove the last path separator
  // to account for / root path
  if (normalized.length > 1 && normalized[normalized.length - 1] === sep)
    normalized = normalized.substring(0, normalized.length - 1);

  return normalized;
}

const SLASHES_REGEX = /[\\/]/g;
function convertSlashes(path, separator) {
  return path.replace(SLASHES_REGEX, separator);
}

function isRootDirectory(path) {
  return path === "/" || /^[a-z]:\\$/i.test(path);
}

function normalizePath(path, options) {
  const { resolvePaths, normalizePath, pathSeparator } = options;
  const pathNeedsCleaning =
    (process.platform === "win32" && path.includes("/")) ||
    path.startsWith(".");

  if (resolvePaths) path = resolve(path);
  if (normalizePath || pathNeedsCleaning) path = cleanPath(path);

  if (path === ".") return "";

  const needsSeparator = path[path.length - 1] !== pathSeparator;
  return convertSlashes(
    needsSeparator ? path + pathSeparator : path,
    pathSeparator
  );
}

const empty = () => {};

function joinPathWithBasePath(filename, directoryPath) {
  return directoryPath + filename;
}

function joinPathWithRelativePath(root, options) {
  return function (filename, directoryPath) {
    const sameRoot = directoryPath.startsWith(root);
    if (sameRoot) return directoryPath.replace(root, "") + filename;
    else
      return (
        convertSlashes(relative(root, directoryPath), options.pathSeparator) +
        options.pathSeparator +
        filename
      );
  };
}

function joinPath(filename) {
  return filename;
}

function joinDirectoryPath(filename, directoryPath, separator) {
  return directoryPath + filename + separator;
}

function build$7(root, options) {
  const { relativePaths, includeBasePath } = options;

  return relativePaths && root
    ? joinPathWithRelativePath(root, options)
    : includeBasePath
      ? joinPathWithBasePath
      : joinPath;
}

function pushDirectoryWithRelativePath(root) {
  return function (directoryPath, paths) {
    paths.push(directoryPath.substring(root.length) || ".");
  };
}

function pushDirectoryFilterWithRelativePath(root) {
  return function (directoryPath, paths, filters) {
    const relativePath = directoryPath.substring(root.length) || ".";
    if (filters.every((filter) => filter(relativePath, true))) {
      paths.push(relativePath);
    }
  };
}

const pushDirectory = (directoryPath, paths) => {
  paths.push(directoryPath || ".");
};

const pushDirectoryFilter = (directoryPath, paths, filters) => {
  const path = directoryPath || ".";
  if (filters.every((filter) => filter(path, true))) {
    paths.push(path);
  }
};

function build$6(root, options) {
  const { includeDirs, filters, relativePaths } = options;
  if (!includeDirs) return empty;

  if (relativePaths)
    return filters && filters.length
      ? pushDirectoryFilterWithRelativePath(root)
      : pushDirectoryWithRelativePath(root);
  return filters && filters.length ? pushDirectoryFilter : pushDirectory;
}

const pushFileFilterAndCount = (filename, _paths, counts, filters) => {
  if (filters.every((filter) => filter(filename, false))) counts.files++;
};

const pushFileFilter = (filename, paths, _counts, filters) => {
  if (filters.every((filter) => filter(filename, false))) paths.push(filename);
};

const pushFileCount = (_filename, _paths, counts, _filters) => {
  counts.files++;
};

const pushFile = (filename, paths) => {
  paths.push(filename);
};

function build$5(options) {
  const { excludeFiles, filters, onlyCounts } = options;
  if (excludeFiles) return empty;

  if (filters && filters.length) {
    return onlyCounts ? pushFileFilterAndCount : pushFileFilter;
  } else if (onlyCounts) {
    return pushFileCount;
  } else {
    return pushFile;
  }
}

const getArray = (paths) => {
  return paths;
};

const getArrayGroup = () => {
  return [""].slice(0, 0);
};

function build$4(options) {
  return options.group ? getArrayGroup : getArray;
}

const groupFiles = (groups, directory, files) => {
  groups.push({ directory, files, dir: directory });
};

function build$3(options) {
  return options.group ? groupFiles : empty;
}

const resolveSymlinksAsync = function (path, state, callback) {
  const {
    queue,
    options: { suppressErrors },
  } = state;
  queue.enqueue();

  fs.realpath(path, (error, resolvedPath) => {
    if (error) return queue.dequeue(suppressErrors ? null : error, state);

    fs.stat(resolvedPath, (error, stat) => {
      if (error) return queue.dequeue(suppressErrors ? null : error, state);

      if (stat.isDirectory() && isRecursive(path, resolvedPath, state))
        return queue.dequeue(null, state);

      callback(stat, resolvedPath);
      queue.dequeue(null, state);
    });
  });
};

const resolveSymlinks = function (path, state, callback) {
  const {
    queue,
    options: { suppressErrors },
  } = state;
  queue.enqueue();

  try {
    const resolvedPath = fs.realpathSync(path);
    const stat = fs.statSync(resolvedPath);

    if (stat.isDirectory() && isRecursive(path, resolvedPath, state)) return;

    callback(stat, resolvedPath);
  } catch (e) {
    if (!suppressErrors) throw e;
  }
};

function build$2(options, isSynchronous) {
  if (!options.resolveSymlinks || options.excludeSymlinks) return null;

  return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}

function isRecursive(path, resolved, state) {
  if (state.options.useRealPaths)
    return isRecursiveUsingRealPaths(resolved, state);

  let parent = dirname(path);
  let depth = 1;
  while (parent !== state.root && depth < 2) {
    const resolvedPath = state.symlinks.get(parent);
    const isSameRoot =
      !!resolvedPath &&
      (resolvedPath === resolved ||
        resolvedPath.startsWith(resolved) ||
        resolved.startsWith(resolvedPath));
    if (isSameRoot) depth++;
    else parent = dirname(parent);
  }
  state.symlinks.set(path, resolved);
  return depth > 1;
}

function isRecursiveUsingRealPaths(resolved, state) {
  return state.visited.includes(resolved + state.options.pathSeparator);
}

const onlyCountsSync = (state) => {
  return state.counts;
};

const groupsSync = (state) => {
  return state.groups;
};

const defaultSync = (state) => {
  return state.paths;
};

const limitFilesSync = (state) => {
  return state.paths.slice(0, state.options.maxFiles);
};

const onlyCountsAsync = (state, error, callback) => {
  report(error, callback, state.counts, state.options.suppressErrors);
  return null;
};

const defaultAsync = (state, error, callback) => {
  report(error, callback, state.paths, state.options.suppressErrors);
  return null;
};

const limitFilesAsync = (state, error, callback) => {
  report(
    error,
    callback,
    state.paths.slice(0, state.options.maxFiles),
    state.options.suppressErrors
  );
  return null;
};

const groupsAsync = (state, error, callback) => {
  report(error, callback, state.groups, state.options.suppressErrors);
  return null;
};

function report(error, callback, output, suppressErrors) {
  if (error && !suppressErrors) callback(error, output);
  else callback(null, output);
}

function build$1(options, isSynchronous) {
  const { onlyCounts, group, maxFiles } = options;

  if (onlyCounts) return isSynchronous ? onlyCountsSync : onlyCountsAsync;
  else if (group) return isSynchronous ? groupsSync : groupsAsync;
  else if (maxFiles) return isSynchronous ? limitFilesSync : limitFilesAsync;
  else return isSynchronous ? defaultSync : defaultAsync;
}

const readdirOpts = { withFileTypes: true };

const walkAsync = (state, crawlPath, directoryPath, currentDepth, callback) => {
  if (currentDepth < 0) return state.queue.dequeue(null, state);

  state.visited.push(crawlPath);
  state.counts.directories++;
  state.queue.enqueue();

  // Perf: Node >= 10 introduced withFileTypes that helps us
  // skip an extra fs.stat call.
  fs.readdir(crawlPath || ".", readdirOpts, (error, entries = []) => {
    callback(entries, directoryPath, currentDepth);

    state.queue.dequeue(state.options.suppressErrors ? null : error, state);
  });
};

const walkSync = (state, crawlPath, directoryPath, currentDepth, callback) => {
  if (currentDepth < 0) return;
  state.visited.push(crawlPath);
  state.counts.directories++;

  let entries = [];
  try {
    entries = fs.readdirSync(crawlPath || ".", readdirOpts);
  } catch (e) {
    if (!state.options.suppressErrors) throw e;
  }
  callback(entries, directoryPath, currentDepth);
};

function build(isSynchronous) {
  return isSynchronous ? walkSync : walkAsync;
}

/**
 * This is a custom stateless queue to track concurrent async fs calls.
 * It increments a counter whenever a call is queued and decrements it
 * as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
 */
class Queue {
  constructor(onQueueEmpty) {
    this.onQueueEmpty = onQueueEmpty;
    this.count = 0;
  }

  enqueue() {
    this.count++;
  }

  dequeue(error, output) {
    if (--this.count <= 0 || error) this.onQueueEmpty(error, output);
  }
}

class Counter {
  constructor() {
    this._files = 0;
    this._directories = 0;
  }

  set files(num) {
    this._files = num;
  }

  get files() {
    return this._files;
  }

  set directories(num) {
    this._directories = num;
  }

  get directories() {
    return this._directories;
  }

  /**
   * @deprecated use `directories` instead
   */
  /* c8 ignore next 3 */
  get dirs() {
    return this._directories;
  }
}

class Walker {
  constructor(root, options, callback) {
    this.isSynchronous = !callback;
    this.callbackInvoker = build$1(options, this.isSynchronous);

    this.root = normalizePath(root, options);
    this.state = {
      root: isRootDirectory(this.root) ? this.root : this.root.slice(0, -1),
      // Perf: we explicitly tell the compiler to optimize for String arrays
      paths: [""].slice(0, 0),
      groups: [],
      counts: new Counter(),
      options,
      queue: new Queue((error, state) =>
        this.callbackInvoker(state, error, callback)
      ),
      /** @type {Map<string, string>} */
      symlinks: new Map(),
      visited: [""].slice(0, 0),
    };

    /*
     * Perf: We conditionally change functions according to options. This gives a slight
     * performance boost. Since these functions are so small, they are automatically inlined
     * by the javascript engine so there's no function call overhead (in most cases).
     */
    this.joinPath = build$7(this.root, options);
    this.pushDirectory = build$6(this.root, options);
    this.pushFile = build$5(options);
    this.getArray = build$4(options);
    this.groupFiles = build$3(options);
    this.resolveSymlink = build$2(options, this.isSynchronous);
    this.walkDirectory = build(this.isSynchronous);
  }

  start() {
    this.walkDirectory(
      this.state,
      this.root,
      this.root,
      this.state.options.maxDepth,
      this.walk
    );
    return this.isSynchronous ? this.callbackInvoker(this.state, null) : null;
  }

  walk(entries, directoryPath, depth) {
    const {
      paths,
      options: {
        filters,
        resolveSymlinks,
        excludeSymlinks,
        exclude,
        maxFiles,
        signal,
        useRealPaths,
        pathSeparator,
      },
    } = this.state;

    if ((signal && signal.aborted) || (maxFiles && paths.length > maxFiles))
      return;

    this.pushDirectory(directoryPath, paths, filters);

    const files = this.getArray(this.state.paths);
    for (let i = 0; i < entries.length; ++i) {
      const entry = entries[i];

      if (
        entry.isFile() ||
        (entry.isSymbolicLink() && !resolveSymlinks && !excludeSymlinks)
      ) {
        const filename = this.joinPath(entry.name, directoryPath);
        this.pushFile(filename, files, this.state.counts, filters);
      } else if (entry.isDirectory()) {
        let path = joinDirectoryPath(
          entry.name,
          directoryPath,
          this.state.options.pathSeparator
        );
        if (exclude && exclude(entry.name, path)) continue;
        this.walkDirectory(this.state, path, path, depth - 1, this.walk);
      } else if (entry.isSymbolicLink() && this.resolveSymlink) {
        let path = joinPathWithBasePath(entry.name, directoryPath);
        this.resolveSymlink(path, this.state, (stat, resolvedPath) => {
          if (stat.isDirectory()) {
            resolvedPath = normalizePath(resolvedPath, this.state.options);
            if (
              exclude &&
              exclude(
                entry.name,
                useRealPaths ? resolvedPath : path + pathSeparator
              )
            )
              return;

            this.walkDirectory(
              this.state,
              resolvedPath,
              useRealPaths ? resolvedPath : path + pathSeparator,
              depth - 1,
              this.walk
            );
          } else {
            resolvedPath = useRealPaths ? resolvedPath : path;
            const filename = basename(resolvedPath);
            const directoryPath = normalizePath(
              dirname(resolvedPath),
              this.state.options
            );
            resolvedPath = this.joinPath(filename, directoryPath);
            this.pushFile(resolvedPath, files, this.state.counts, filters);
          }
        });
      }
    }

    this.groupFiles(this.state.groups, directoryPath, files);
  }
}

function promise(root, options) {
  return new Promise((resolve, reject) => {
    callback(root, options, (err, output) => {
      if (err) return reject(err);
      resolve(output);
    });
  });
}

function callback(root, options, callback) {
  let walker = new Walker(root, options, callback);
  walker.start();
}

function sync(root, options) {
  const walker = new Walker(root, options);
  return walker.start();
}

class APIBuilder {
  constructor(root, options) {
    this.root = root;
    this.options = options;
  }

  withPromise() {
    return promise(this.root, this.options);
  }

  withCallback(cb) {
    callback(this.root, this.options, cb);
  }

  sync() {
    return sync(this.root, this.options);
  }
}

let pm = null;
/* c8 ignore next 6 */
try {
  //require.resolve("picomatch");
  pm = require("picomatch");
} catch (_e) {
  // do nothing
}

class Builder {
  constructor(options) {
    this.globCache = {};
    this.options = {
      maxDepth: Infinity,
      suppressErrors: true,
      pathSeparator: sep,
      filters: [],
    };

    this.options = { ...this.options, ...options };
    this.globFunction = this.options.globFunction;
  }

  group() {
    this.options.group = true;
    return this;
  }

  withPathSeparator(separator) {
    this.options.pathSeparator = separator;
    return this;
  }

  withBasePath() {
    this.options.includeBasePath = true;
    return this;
  }

  withRelativePaths() {
    this.options.relativePaths = true;
    return this;
  }

  withDirs() {
    this.options.includeDirs = true;
    return this;
  }

  withMaxDepth(depth) {
    this.options.maxDepth = depth;
    return this;
  }

  withMaxFiles(limit) {
    this.options.maxFiles = limit;
    return this;
  }

  withFullPaths() {
    this.options.resolvePaths = true;
    this.options.includeBasePath = true;
    return this;
  }

  withErrors() {
    this.options.suppressErrors = false;
    return this;
  }

  withSymlinks({ resolvePaths = true } = {}) {
    this.options.resolveSymlinks = true;
    this.options.useRealPaths = resolvePaths;
    return this.withFullPaths();
  }

  withAbortSignal(signal) {
    this.options.signal = signal;
    return this;
  }

  normalize() {
    this.options.normalizePath = true;
    return this;
  }

  filter(predicate) {
    this.options.filters.push(predicate);
    return this;
  }

  onlyDirs() {
    this.options.excludeFiles = true;
    this.options.includeDirs = true;
    return this;
  }

  exclude(predicate) {
    this.options.exclude = predicate;
    return this;
  }

  onlyCounts() {
    this.options.onlyCounts = true;
    return this;
  }

  crawl(root) {
    return new APIBuilder(root || ".", this.options);
  }

  withGlobFunction(fn) {
    // cast this since we don't have the new type params yet
    this.globFunction = fn;
    return this;
  }

  /**
   * @deprecated Pass options using the constructor instead:
   * ```ts
   * new fdir(options).crawl("/path/to/root");
   * ```
   * This method will be removed in v7.0
   */
  /* c8 ignore next 4 */
  crawlWithOptions(root, options) {
    this.options = { ...this.options, ...options };
    return new APIBuilder(root || ".", this.options);
  }

  glob(...patterns) {
    if (this.globFunction) {
      return this.globWithOptions(patterns);
    }
    return this.globWithOptions(patterns, { dot: true });
  }

  globWithOptions(patterns, ...options) {
    const globFn = this.globFunction || pm;
    /* c8 ignore next 5 */
    if (!globFn) {
      throw new Error("Please specify a glob function to use glob matching.");
    }

    let isMatch = this.globCache[patterns.join("\0")];
    if (!isMatch) {
      isMatch = globFn(patterns, ...options);
      this.globCache[patterns.join("\0")] = isMatch;
    }
    this.options.filters.push((path) => isMatch(path));
    return this;
  }
}

exports.fdir = Builder;
Object.defineProperty(exports, "__esModule", { value: true });

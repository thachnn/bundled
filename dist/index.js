'use strict';

const path = require('path'),
  { posix } = path;
const { fdir } = require('fdir');
const picomatch = require('picomatch');

// #region PARTIAL MATCHER
const ONLY_PARENT_DIRECTORIES = /^(\/?\.\.)+$/;

// the result of over 4 months of figuring stuff out and a LOT of help
function getPartialMatcher(patterns, options) {
  // you might find this code pattern odd, but apparently it's faster than using `.push()`
  const patternsCount = patterns.length;
  const patternsParts = Array(patternsCount);
  const regexes = Array(patternsCount);
  for (let i = 0; i < patternsCount; i++) {
    const parts = splitPattern(patterns[i]);
    patternsParts[i] = parts;
    const partsCount = parts.length;
    const partRegexes = Array(partsCount);
    for (let j = 0; j < partsCount; j++) {
      partRegexes[j] = picomatch.makeRe(parts[j], options);
    }
    regexes[i] = partRegexes;
  }
  return (input) => {
    // no need to `splitPattern` as this is indeed not a pattern
    const inputParts = input.split('/');
    // if we only have patterns like `src/*` but the input is `../..`
    // normally the parent directory would not get crawled
    // and as such wrong results would be returned
    // to avoid this always return true if the input only consists of .. ../.. etc
    if (inputParts[0] === '..' && ONLY_PARENT_DIRECTORIES.test(input)) {
      return true;
    }
    for (let i = 0; i < patterns.length; i++) {
      const patternParts = patternsParts[i];
      const regex = regexes[i];
      const inputPatternCount = inputParts.length;
      const minParts = Math.min(inputPatternCount, patternParts.length);
      let j = 0;
      while (j < minParts) {
        const part = patternParts[j];

        // handling slashes in parts is very hard, not even fast-glob does it
        // unlike fast-glob we should return true in this case
        // for us, better to have a false positive than a false negative here
        if (part.includes('/')) {
          return true;
        }

        const match = regex[j].test(inputParts[j]);

        if (!match) {
          break;
        }

        // unlike popular belief, `**` doesn't return true in *all* cases
        // some examples are when matching it to `.a` with dot: false or `..`
        // so it needs to match to return early
        if (part === '**') {
          return true;
        }

        j++;
      }
      if (j === inputPatternCount) {
        return true;
      }
    }

    return false;
  };
}
// #endregion

// #region splitPattern
// make options a global constant to reduce GC work
const splitPatternOptions = { parts: true };

// if a pattern has no slashes outside glob symbols, results.parts is []
function splitPattern(path) {
  const result = picomatch.scan(path, splitPatternOptions).parts;
  return result != null && result.length ? result : [path];
}
// #endregion

const isWin = process.platform === 'win32';

// #region convertPathToPattern
const ESCAPED_WIN32_BACKSLASHES = /\\(?![()[\]{}!+@])/g;
function convertPosixPathToPattern(path) {
  return escapePosixPath(path);
}

function convertWin32PathToPattern(path) {
  return escapeWin32Path(path).replace(ESCAPED_WIN32_BACKSLASHES, '/');
}

const convertPathToPattern = isWin ? convertWin32PathToPattern : convertPosixPathToPattern;
// #endregion

// #region escapePath
/*
  Matches the following unescaped symbols:
  `(){}[]`, `!+@` before `(`, `!` at the beginning,
  plus the following platform-specific symbols:

  Posix: `*?|`, `\\` before non-special characters.
*/
const POSIX_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}*?|]|^!|[!+@](?=\()|\\(?![()[\]{}!*+?@|]))/g;
const WIN32_UNESCAPED_GLOB_SYMBOLS = /(?<!\\)([()[\]{}]|^!|[!+@](?=\())/g;

const escapePosixPath = (path) => path.replace(POSIX_UNESCAPED_GLOB_SYMBOLS, '\\$&');
const escapeWin32Path = (path) => path.replace(WIN32_UNESCAPED_GLOB_SYMBOLS, '\\$&');

const escapePath = isWin ? escapeWin32Path : escapePosixPath;
// #endregion

// #region isDynamicPattern
/*
  Has a few minor differences with `fast-glob` for better accuracy:

  Doesn't necessarily return false on patterns that include `\\`.

  Returns true if the pattern includes parentheses,
  regardless of them representing one single pattern or not.

  Returns true for unfinished glob extensions i.e. `(h`, `+(h`.

  Returns true for unfinished brace expansions as long as they include `,` or `..`.
*/
function isDynamicPattern(pattern, options) {
  if (options != null && options.caseSensitiveMatch === false) {
    return true;
  }

  const scan = picomatch.scan(pattern);
  return scan.isGlob || scan.negated;
}
// #endregion

// #region log
function log(...tasks) {
  console.log(`[tinyglobby ${new Date().toLocaleTimeString('es')}]`, ...tasks);
}
// #endregion

// src/index.ts
const PARENT_DIRECTORY = /^(\/?\.\.)+/;
const ESCAPING_BACKSLASHES = /\\(?=[()[\]{}!*+?@|])/g;
const BACKSLASHES = /\\/g;

function normalizePattern(pattern, expandDirectories, cwd, props, isIgnore) {
  let result = pattern;
  if (pattern.endsWith('/')) {
    result = pattern.slice(0, -1);
  }
  // using a directory as entry should match all files inside it
  if (!result.endsWith('*') && expandDirectories) {
    result += '/**';
  }

  if (path.isAbsolute(result.replace(ESCAPING_BACKSLASHES, ''))) {
    result = posix.relative(escapePath(cwd), result);
  } else {
    result = posix.normalize(result);
  }

  const parentDirectoryMatch = PARENT_DIRECTORY.exec(result);
  if (parentDirectoryMatch != null && parentDirectoryMatch[0]) {
    const potentialRoot = posix.join(cwd, parentDirectoryMatch[0]);
    if (props.root.length > potentialRoot.length) {
      props.root = potentialRoot;
      props.depthOffset = -(parentDirectoryMatch[0].length + 1) / 3;
    }
  } else if (!isIgnore && props.depthOffset >= 0) {
    const parts = splitPattern(result);
    props.commonPath != null || (props.commonPath = parts);

    const newCommonPath = [];
    const length = Math.min(props.commonPath.length, parts.length);

    for (let i = 0; i < length; i++) {
      const part = parts[i];

      if (part === '**' && !parts[i + 1]) {
        newCommonPath.pop();
        break;
      }

      if (part !== props.commonPath[i] || isDynamicPattern(part) || i === parts.length - 1) {
        break;
      }

      newCommonPath.push(part);
    }

    props.depthOffset = newCommonPath.length;
    props.commonPath = newCommonPath;

    props.root = newCommonPath.length > 0 ? path.posix.join(cwd, ...newCommonPath) : cwd;
  }

  return result;
}

function processPatterns({ patterns, ignore = [], expandDirectories = true }, cwd, props) {
  if (typeof patterns === 'string') {
    patterns = [patterns];
  } else if (!patterns) {
    // tinyglobby exclusive behavior, should be considered deprecated
    patterns = ['**/*'];
  }

  if (typeof ignore === 'string') {
    ignore = [ignore];
  }

  const matchPatterns = [];
  const ignorePatterns = [];

  for (const pattern of ignore) {
    if (!pattern) {
      continue;
    }
    // don't handle negated patterns here for consistency with fast-glob
    if (pattern[0] !== '!' || pattern[1] === '(') {
      ignorePatterns.push(normalizePattern(pattern, expandDirectories, cwd, props, true));
    }
  }

  for (const pattern of patterns) {
    if (!pattern) {
      continue;
    }
    if (pattern[0] !== '!' || pattern[1] === '(') {
      matchPatterns.push(normalizePattern(pattern, expandDirectories, cwd, props, false));
    } else if (pattern[1] !== '!' || pattern[2] === '(') {
      ignorePatterns.push(normalizePattern(pattern.slice(1), expandDirectories, cwd, props, true));
    }
  }

  return { match: matchPatterns, ignore: ignorePatterns };
}

// TODO: this is slow, find a better way to do this
function getRelativePath(path, cwd, root) {
  return posix.relative(cwd, `${root}/${path}`) || '.';
}

function processPath(path, cwd, root, isDirectory, absolute) {
  const relativePath = absolute ? path.slice(root === '/' ? 1 : root.length + 1) || '.' : path;

  if (root === cwd) {
    return isDirectory && relativePath !== '.' ? relativePath.slice(0, -1) : relativePath;
  }

  return getRelativePath(relativePath, cwd, root);
}

function formatPaths(paths, cwd, root) {
  for (let i = paths.length - 1; i >= 0; i--) {
    const path = paths[i];
    paths[i] = getRelativePath(path, cwd, root) + (!path || path.endsWith('/') ? '/' : '');
  }
  return paths;
}

function crawl(options, cwd, sync) {
  if (process.env.TINYGLOBBY_DEBUG) {
    options.debug = true;
  }

  if (options.debug) {
    log('globbing with options:', options, 'cwd:', cwd);
  }

  if (Array.isArray(options.patterns) && options.patterns.length === 0) {
    return sync ? [] : Promise.resolve([]);
  }

  const props = {
    root: cwd,
    commonPath: null,
    depthOffset: 0
  };

  const processed = processPatterns(options, cwd, props);
  const nocase = options.caseSensitiveMatch === false;

  if (options.debug) {
    log('internal processing patterns:', processed);
  }

  const matcher = picomatch(processed.match, {
    dot: options.dot,
    nocase,
    ignore: processed.ignore
  });

  const ignore = picomatch(processed.ignore, {
    dot: options.dot,
    nocase
  });

  const partialMatcher = getPartialMatcher(processed.match, {
    dot: options.dot,
    nocase
  });

  const fdirOptions = {
    // use relative paths in the matcher
    filters: [
      options.debug
        ? (p, isDirectory) => {
            const path = processPath(p, cwd, props.root, isDirectory, options.absolute);
            const matches = matcher(path);

            if (matches) {
              log(`matched ${path}`);
            }

            return matches;
          }
        : (p, isDirectory) => matcher(processPath(p, cwd, props.root, isDirectory, options.absolute))
    ],
    exclude: options.debug
      ? (_, p) => {
          const relativePath = processPath(p, cwd, props.root, true, true);
          const skipped = (relativePath !== '.' && !partialMatcher(relativePath)) || ignore(relativePath);

          if (skipped) {
            log(`skipped ${p}`);
          } else {
            log(`crawling ${p}`);
          }

          return skipped;
        }
      : (_, p) => {
          const relativePath = processPath(p, cwd, props.root, true, true);
          return (relativePath !== '.' && !partialMatcher(relativePath)) || ignore(relativePath);
        },
    pathSeparator: '/',
    relativePaths: true,
    resolveSymlinks: true
  };

  if (options.deep) {
    fdirOptions.maxDepth = Math.round(options.deep - props.depthOffset);
  }

  if (options.absolute) {
    fdirOptions.relativePaths = false;
    fdirOptions.resolvePaths = true;
    fdirOptions.includeBasePath = true;
  }

  if (options.followSymbolicLinks === false) {
    fdirOptions.resolveSymlinks = false;
    fdirOptions.excludeSymlinks = true;
  }

  if (options.onlyDirectories) {
    fdirOptions.excludeFiles = true;
    fdirOptions.includeDirs = true;
  } else if (options.onlyFiles === false) {
    fdirOptions.includeDirs = true;
  }

  props.root = props.root.replace(BACKSLASHES, '');
  const root = props.root;

  if (options.debug) {
    log('internal properties:', props);
  }

  const api = new fdir(fdirOptions).crawl(root);

  if (cwd === root || options.absolute) {
    return sync ? api.sync() : api.withPromise();
  }

  return sync ? formatPaths(api.sync(), cwd, root) : api.withPromise().then((paths) => formatPaths(paths, cwd, root));
}

function _glob(patternsOrOptions, options, sync) {
  if (patternsOrOptions && options != null && options.patterns) {
    throw new Error('Cannot pass patterns as both an argument and an option');
  }

  const opts =
    Array.isArray(patternsOrOptions) || typeof patternsOrOptions === 'string'
      ? { ...options, patterns: patternsOrOptions }
      : patternsOrOptions;
  const cwd = opts.cwd ? path.resolve(opts.cwd).replace(BACKSLASHES, '/') : process.cwd().replace(BACKSLASHES, '/');

  return crawl(opts, cwd, sync);
}

async function glob(patternsOrOptions, options) {
  return _glob(patternsOrOptions, options, false);
}

function globSync(patternsOrOptions, options) {
  return _glob(patternsOrOptions, options, true);
}

module.exports = { glob, globSync, convertPathToPattern, escapePath, isDynamicPattern };

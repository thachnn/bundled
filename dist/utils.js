import { sep, normalize, resolve } from "path";
export function cleanPath(path) {
    let normalized = normalize(path);
    // we have to remove the last path separator
    // to account for / root path
    if (normalized.length > 1 && normalized[normalized.length - 1] === sep)
        normalized = normalized.substring(0, normalized.length - 1);
    return normalized;
}
const SLASHES_REGEX = /[\\/]/g;
export function convertSlashes(path, separator) {
    return path.replace(SLASHES_REGEX, separator);
}
export function isRootDirectory(path) {
    return path === "/" || /^[a-z]:\\$/i.test(path);
}
export function normalizePath(path, options) {
    const { resolvePaths, normalizePath, pathSeparator } = options;
    const pathNeedsCleaning = (process.platform === "win32" && path.includes("/")) ||
        path.startsWith(".");
    if (resolvePaths)
        path = resolve(path);
    if (normalizePath || pathNeedsCleaning)
        path = cleanPath(path);
    if (path === ".")
        return "";
    const needsSeparator = path[path.length - 1] !== pathSeparator;
    return convertSlashes(needsSeparator ? path + pathSeparator : path, pathSeparator);
}

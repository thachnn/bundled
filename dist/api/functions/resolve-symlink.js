import fs from "fs";
import { dirname } from "path";
const resolveSymlinksAsync = function (path, state, callback) {
    const { queue, options: { suppressErrors }, } = state;
    queue.enqueue();
    fs.realpath(path, (error, resolvedPath) => {
        if (error)
            return queue.dequeue(suppressErrors ? null : error, state);
        fs.stat(resolvedPath, (error, stat) => {
            if (error)
                return queue.dequeue(suppressErrors ? null : error, state);
            if (stat.isDirectory() && isRecursive(path, resolvedPath, state))
                return queue.dequeue(null, state);
            callback(stat, resolvedPath);
            queue.dequeue(null, state);
        });
    });
};
const resolveSymlinks = function (path, state, callback) {
    const { queue, options: { suppressErrors }, } = state;
    queue.enqueue();
    try {
        const resolvedPath = fs.realpathSync(path);
        const stat = fs.statSync(resolvedPath);
        if (stat.isDirectory() && isRecursive(path, resolvedPath, state))
            return;
        callback(stat, resolvedPath);
    }
    catch (e) {
        if (!suppressErrors)
            throw e;
    }
};
export function build(options, isSynchronous) {
    if (!options.resolveSymlinks || options.excludeSymlinks)
        return null;
    return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}
function isRecursive(path, resolved, state) {
    if (state.options.useRealPaths)
        return isRecursiveUsingRealPaths(resolved, state);
    let parent = dirname(path);
    let depth = 1;
    while (parent !== state.root && depth < 2) {
        const resolvedPath = state.symlinks.get(parent);
        const isSameRoot = !!resolvedPath &&
            (resolvedPath === resolved ||
                resolvedPath.startsWith(resolved) ||
                resolved.startsWith(resolvedPath));
        if (isSameRoot)
            depth++;
        else
            parent = dirname(parent);
    }
    state.symlinks.set(path, resolved);
    return depth > 1;
}
function isRecursiveUsingRealPaths(resolved, state) {
    return state.visited.includes(resolved + state.options.pathSeparator);
}

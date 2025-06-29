import { relative } from "path";
import { convertSlashes } from "../../utils";
export function joinPathWithBasePath(filename, directoryPath) {
    return directoryPath + filename;
}
function joinPathWithRelativePath(root, options) {
    return function (filename, directoryPath) {
        const sameRoot = directoryPath.startsWith(root);
        if (sameRoot)
            return directoryPath.replace(root, "") + filename;
        else
            return (convertSlashes(relative(root, directoryPath), options.pathSeparator) +
                options.pathSeparator +
                filename);
    };
}
function joinPath(filename) {
    return filename;
}
export function joinDirectoryPath(filename, directoryPath, separator) {
    return directoryPath + filename + separator;
}
export function build(root, options) {
    const { relativePaths, includeBasePath } = options;
    return relativePaths && root
        ? joinPathWithRelativePath(root, options)
        : includeBasePath
            ? joinPathWithBasePath
            : joinPath;
}

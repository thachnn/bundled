import fs from "fs";
const readdirOpts = { withFileTypes: true };
const walkAsync = (state, crawlPath, directoryPath, currentDepth, callback) => {
    if (currentDepth < 0)
        return state.queue.dequeue(null, state);
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
    if (currentDepth < 0)
        return;
    state.visited.push(crawlPath);
    state.counts.directories++;
    let entries = [];
    try {
        entries = fs.readdirSync(crawlPath || ".", readdirOpts);
    }
    catch (e) {
        if (!state.options.suppressErrors)
            throw e;
    }
    callback(entries, directoryPath, currentDepth);
};
export function build(isSynchronous) {
    return isSynchronous ? walkSync : walkAsync;
}

import { callback, promise } from "../api/async";
import { sync } from "../api/sync";
export class APIBuilder {
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

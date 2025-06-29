import { Walker } from "./walker";
export function promise(root, options) {
    return new Promise((resolve, reject) => {
        callback(root, options, (err, output) => {
            if (err)
                return reject(err);
            resolve(output);
        });
    });
}
export function callback(root, options, callback) {
    let walker = new Walker(root, options, callback);
    walker.start();
}

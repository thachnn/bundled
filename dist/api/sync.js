import { Walker } from "./walker";
export function sync(root, options) {
    const walker = new Walker(root, options);
    return walker.start();
}

const getArray = (paths) => {
    return paths;
};
const getArrayGroup = () => {
    return [""].slice(0, 0);
};
export function build(options) {
    return options.group ? getArrayGroup : getArray;
}

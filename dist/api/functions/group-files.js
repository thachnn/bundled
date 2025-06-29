const groupFiles = (groups, directory, files) => {
    groups.push({ directory, files, dir: directory });
};
const empty = () => { };
export function build(options) {
    return options.group ? groupFiles : empty;
}

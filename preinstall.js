// More info:
// https://github.com/arcanis/pmm/issues/6

if (process.env.npm_config_global) {
    var cp = require('child_process'),
        fs = require('fs'),
        path = require('path');

    try {
        var targetPath = cp.execFileSync(process.execPath, [process.env.npm_execpath, 'bin', '-g'], {
            encoding: 'utf8',
            stdio: ['ignore', void 0, 'ignore'],
        }).replace(/\n/g, '');

        var manifest = require('./package.json');
        var binNames = typeof manifest.bin == 'string'
            ? [manifest.name.replace(/^@[^/]+\//, '')]
            : typeof manifest.bin == 'object' && manifest.bin !== null
            ? Object.keys(manifest.bin)
            : [];

        binNames.forEach(function (binName) {
            var binPath = path.join(targetPath, binName);

            try {
                var binTarget = fs.readlinkSync(binPath);

                binTarget.startsWith('../lib/node_modules/corepack/') && fs.unlinkSync(binPath);
            } catch (_err) {}
        });
    } catch (_err) {}
}

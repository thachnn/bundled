exports.endianness = function () { return 'LE'; };

exports.hostname = function () {
  return typeof location != 'undefined' ? location.hostname : '';
};

exports.loadavg = function () { return []; };

exports.uptime = function () { return 0; };

exports.freemem = function () {
  return Number.MAX_VALUE;
};

exports.totalmem = function () {
  return Number.MAX_VALUE;
};

exports.cpus = function () { return []; };

exports.type = function () { return 'Browser'; };

exports.release = function () {
  return typeof navigator != 'undefined' ? navigator.appVersion : '';
};

exports.networkInterfaces = exports.getNetworkInterfaces = function () {
  return {};
};

exports.arch = function () { return 'javascript'; };

exports.platform = function () { return 'browser'; };

exports.tmpdir = exports.tmpDir = function () {
  return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
  return '/';
};

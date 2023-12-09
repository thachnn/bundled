module.exports = Stream;

var EE = require("events").EventEmitter, inherits = require("./util").inherits;

function Stream() {
  EE.call(this);
}

inherits(Stream, EE), Stream.Readable = require("./readable-stream/readable.js"), 
Stream.Writable = require("./readable-stream/writable.js"), Stream.Duplex = require("./readable-stream/duplex.js"), 
Stream.Transform = require("./readable-stream/transform.js"), Stream.PassThrough = require("./readable-stream/passthrough.js"), 
Stream.Stream = Stream, Stream.prototype.pipe = function(dest, options) {
  var source = this;
  function ondata(chunk) {
    dest.writable && !1 === dest.write(chunk) && source.pause && source.pause();
  }
  function ondrain() {
    source.readable && source.resume && source.resume();
  }
  source.on("data", ondata), dest.on("drain", ondrain), dest._isStdio || options && !1 === options.end || (source.on("end", onend), 
  source.on("close", onclose));
  var didOnEnd = !1;
  function onend() {
    didOnEnd || (didOnEnd = !0, dest.end());
  }
  function onclose() {
    didOnEnd || (didOnEnd = !0, "function" == typeof dest.destroy && dest.destroy());
  }
  function onerror(er) {
    if (cleanup(), 0 === EE.listenerCount(this, "error")) throw er;
  }
  function cleanup() {
    source.removeListener("data", ondata), dest.removeListener("drain", ondrain), source.removeListener("end", onend), 
    source.removeListener("close", onclose), source.removeListener("error", onerror), 
    dest.removeListener("error", onerror), source.removeListener("end", cleanup), source.removeListener("close", cleanup), 
    dest.removeListener("close", cleanup);
  }
  return source.on("error", onerror), dest.on("error", onerror), source.on("end", cleanup), 
  source.on("close", cleanup), dest.on("close", cleanup), dest.emit("pipe", source), 
  dest;
};
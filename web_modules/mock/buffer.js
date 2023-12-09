function Buffer() {
  throw new Error("Buffer is not included.");
}

Buffer.isBuffer = function() {
  return !1;
}, exports.INSPECT_MAX_BYTES = 50, exports.SlowBuffer = Buffer, exports.Buffer = Buffer;
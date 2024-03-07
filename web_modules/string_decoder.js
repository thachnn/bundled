'use strict';

var Buffer = require('buffer').Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  switch (!(encoding = '' + encoding) || encoding.toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  for (var retried; ; )
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return;
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
}

function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc != 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc)))
    throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = (Buffer.allocUnsafe || Buffer)(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r, i;
  if (this.lastNeed) {
    if ((r = this.fillLast(buf)) === void 0) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else i = 0;

  return i < buf.length ? (r ? r + this.text(buf, i) : this.text(buf, i)) : r || '';
};

StringDecoder.prototype.end = utf8End;

StringDecoder.prototype.text = utf8Text;

StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

function utf8CheckByte(byte) {
  return byte <= 0x7F ? 0
    : byte >> 5 == 0x06 ? 2
    : byte >> 4 == 0x0E ? 3
    : byte >> 3 == 0x1E ? 4
    : byte >> 6 == 0x02 ? -1 : -2;
}

function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  if ((nb = utf8CheckByte(buf[j])) >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  if ((nb = utf8CheckByte(buf[j])) >= 0) {
    if (nb > 0) nb === 2 ? (nb = 0) : (self.lastNeed = nb - 3);

    return nb;
  }
  return 0;
}

function utf8CheckExtraBytes(self, buf, _p) {
  if ((buf[0] & 0xC0) != 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) != 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2 && (buf[2] & 0xC0) != 0x80) {
      self.lastNeed = 2;
      return '\ufffd';
    }
  }
}

function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed,
    r = utf8CheckExtraBytes(this, buf, p);
  if (r !== void 0) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

function utf8Text(/** Buffer */ buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  return this.lastNeed ? r + '\ufffd' : r;
}

function utf16Text(/** Buffer */ buf, i) {
  if ((buf.length - i) % 2 == 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(/** Buffer */ buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) this.lastChar[0] = buf[buf.length - 1];
  else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  return this.lastNeed ? r + this.lastChar.toString('base64', 0, 3 - this.lastNeed) : r;
}

function simpleWrite(/** Buffer */ buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

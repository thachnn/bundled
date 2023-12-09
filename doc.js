(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.doc = factory());
}(this, (function () { 'use strict';



  function concat(parts) {


    return {
      type: "concat",
      parts
    };
  }


  function indent$1(contents) {

    return {
      type: "indent",
      contents
    };
  }


  function align(widthOrString, contents) {

    return {
      type: "align",
      contents,
      n: widthOrString
    };
  }


  function group(contents, opts = {}) {

    return {
      type: "group",
      id: opts.id,
      contents,
      break: Boolean(opts.shouldBreak),
      expandedStates: opts.expandedStates
    };
  }


  function dedentToRoot(contents) {
    return align(Number.NEGATIVE_INFINITY, contents);
  }


  function markAsRoot(contents) {
    return align({
      type: "root"
    }, contents);
  }


  function dedent(contents) {
    return align(-1, contents);
  }


  function conditionalGroup(states, opts) {
    return group(states[0], Object.assign(Object.assign({}, opts), {}, {
      expandedStates: states
    }));
  }


  function fill$1(parts) {

    return {
      type: "fill",
      parts
    };
  }


  function ifBreak(breakContents, flatContents, opts = {}) {

    return {
      type: "if-break",
      breakContents,
      flatContents,
      groupId: opts.groupId
    };
  }


  function indentIfBreak(contents, opts) {
    return {
      type: "indent-if-break",
      contents,
      groupId: opts.groupId,
      negate: opts.negate
    };
  }


  function lineSuffix(contents) {

    return {
      type: "line-suffix",
      contents
    };
  }

  const lineSuffixBoundary = {
    type: "line-suffix-boundary"
  };
  const breakParent = {
    type: "break-parent"
  };
  const trim$1 = {
    type: "trim"
  };
  const hardlineWithoutBreakParent = {
    type: "line",
    hard: true
  };
  const literallineWithoutBreakParent = {
    type: "line",
    hard: true,
    literal: true
  };
  const line = {
    type: "line"
  };
  const softline = {
    type: "line",
    soft: true
  };

  const hardline = concat([hardlineWithoutBreakParent, breakParent]);

  const literalline$1 = concat([literallineWithoutBreakParent, breakParent]);
  const cursor$1 = {
    type: "cursor",
    placeholder: Symbol("cursor")
  };

  function join$1(sep, arr) {
    const res = [];

    for (let i = 0; i < arr.length; i++) {
      if (i !== 0) {
        res.push(sep);
      }

      res.push(arr[i]);
    }


    return concat(res);
  }


  function addAlignmentToDoc(doc, size, tabWidth) {
    let aligned = doc;

    if (size > 0) {
      for (let i = 0; i < Math.floor(size / tabWidth); ++i) {
        aligned = indent$1(aligned);
      }


      aligned = align(size % tabWidth, aligned);

      aligned = align(Number.NEGATIVE_INFINITY, aligned);
    }

    return aligned;
  }

  function label(label, contents) {
    return {
      type: "label",
      label,
      contents
    };
  }

  var docBuilders = {
    concat,
    join: join$1,
    line,
    softline,
    hardline,
    literalline: literalline$1,
    group,
    conditionalGroup,
    fill: fill$1,
    lineSuffix,
    lineSuffixBoundary,
    cursor: cursor$1,
    breakParent,
    ifBreak,
    trim: trim$1,
    indent: indent$1,
    indentIfBreak,
    align,
    addAlignmentToDoc,
    markAsRoot,
    dedentToRoot,
    dedent,
    hardlineWithoutBreakParent,
    literallineWithoutBreakParent,
    label
  };

  var ansiRegex = ({
    onlyFirst = false
  } = {}) => {
    const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'].join('|');
    return new RegExp(pattern, onlyFirst ? undefined : 'g');
  };

  var stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


  const isFullwidthCodePoint = codePoint => {
    if (Number.isNaN(codePoint)) {
      return false;
    }


    if (codePoint >= 0x1100 && (codePoint <= 0x115F ||
    codePoint === 0x2329 ||
    codePoint === 0x232A ||
    0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F ||
    0x3250 <= codePoint && codePoint <= 0x4DBF ||
    0x4E00 <= codePoint && codePoint <= 0xA4C6 ||
    0xA960 <= codePoint && codePoint <= 0xA97C ||
    0xAC00 <= codePoint && codePoint <= 0xD7A3 ||
    0xF900 <= codePoint && codePoint <= 0xFAFF ||
    0xFE10 <= codePoint && codePoint <= 0xFE19 ||
    0xFE30 <= codePoint && codePoint <= 0xFE6B ||
    0xFF01 <= codePoint && codePoint <= 0xFF60 || 0xFFE0 <= codePoint && codePoint <= 0xFFE6 ||
    0x1B000 <= codePoint && codePoint <= 0x1B001 ||
    0x1F200 <= codePoint && codePoint <= 0x1F251 ||
    0x20000 <= codePoint && codePoint <= 0x3FFFD)) {
      return true;
    }

    return false;
  };

  var isFullwidthCodePoint_1 = isFullwidthCodePoint;
  var _default$1 = isFullwidthCodePoint;
  isFullwidthCodePoint_1.default = _default$1;

  var emojiRegex = function () {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };

  const stringWidth = string => {
    if (typeof string !== 'string' || string.length === 0) {
      return 0;
    }

    string = stripAnsi(string);

    if (string.length === 0) {
      return 0;
    }

    string = string.replace(emojiRegex(), '  ');
    let width = 0;

    for (let i = 0; i < string.length; i++) {
      const code = string.codePointAt(i);

      if (code <= 0x1F || code >= 0x7F && code <= 0x9F) {
        continue;
      }


      if (code >= 0x300 && code <= 0x36F) {
        continue;
      }


      if (code > 0xFFFF) {
        i++;
      }

      width += isFullwidthCodePoint_1(code) ? 2 : 1;
    }

    return width;
  };

  var stringWidth_1 = stringWidth;

  var _default = stringWidth;
  stringWidth_1.default = _default;

  var escapeStringRegexp = string => {
    if (typeof string !== 'string') {
      throw new TypeError('Expected a string');
    }


    return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
  };

  const getLast$1 = arr => arr[arr.length - 1];

  var getLast_1 = getLast$1;

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var check = function (it) {
    return it && it.Math == Math && it;
  };

  var global$2 =
    check(typeof globalThis == 'object' && globalThis) ||
    check(typeof window == 'object' && window) ||
    check(typeof self == 'object' && self) ||
    check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    (function () { return this; })() || Function('return this')();

  var fails = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var descriptors = !fails(function () {
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$4
  };

  var createPropertyDescriptor = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var split = ''.split;

  var indexedObject = fails(function () {
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };




  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var toPrimitive = function (input, PREFERRED_STRING) {
    if (!isObject(input)) return input;
    var fn, val;
    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var toObject = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var hasOwnProperty = {}.hasOwnProperty;

  var has$1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty.call(toObject(it), key);
  };

  var document$1 = global$2.document;
  var EXISTS = isObject(document$1) && isObject(document$1.createElement);

  var documentCreateElement = function (it) {
    return EXISTS ? document$1.createElement(it) : {};
  };

  var ie8DomDefine = !descriptors && !fails(function () {
    return Object.defineProperty(documentCreateElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  var f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) { }
    if (has$1(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$3
  };

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
  };

  var $defineProperty = Object.defineProperty;

  var f$2 = descriptors ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (ie8DomDefine) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var objectDefineProperty = {
  	f: f$2
  };

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var setGlobal = function (key, value) {
    try {
      createNonEnumerableProperty(global$2, key, value);
    } catch (error) {
      global$2[key] = value;
    } return value;
  };

  var SHARED = '__core-js_shared__';
  var store$1 = global$2[SHARED] || setGlobal(SHARED, {});

  var sharedStore = store$1;

  var functionToString = Function.toString;

  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap$2 = global$2.WeakMap;

  var nativeWeakMap = typeof WeakMap$2 === 'function' && /native code/.test(inspectSource(WeakMap$2));

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.14.0',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });
  });

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var keys = shared('keys');

  var sharedKey = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$1 = {};

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var WeakMap$1 = global$2.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (nativeWeakMap || sharedStore.state) {
    var store = sharedStore.state || (sharedStore.state = new WeakMap$1());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey('state');
    hiddenKeys$1[STATE] = true;
    set = function (it, metadata) {
      if (has$1(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return has$1(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return has$1(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var redefine = createCommonjsModule(function (module) {
  var getInternalState = internalState.get;
  var enforceInternalState = internalState.enforce;
  var TEMPLATE = String(String).split('String');

  (module.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var state;
    if (typeof value == 'function') {
      if (typeof key == 'string' && !has$1(value, 'name')) {
        createNonEnumerableProperty(value, 'name', key);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
      }
    }
    if (O === global$2) {
      if (simple) O[key] = value;
      else setGlobal(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty(O, key, value);
  })(Function.prototype, 'toString', function toString() {
    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
  });
  });

  var path = global$2;

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global$2[namespace])
      : path[namespace] && path[namespace][method] || global$2[namespace] && global$2[namespace][method];
  };

  var ceil = Math.ceil;
  var floor$1 = Math.floor;

  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor$1 : ceil)(argument);
  };

  var min$1 = Math.min;

  var toLength = function (argument) {
    return argument > 0 ? min$1(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0;
  };

  var max = Math.max;
  var min = Math.min;

  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min(integer, length);
  };

  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        if (value != value) return true;
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    includes: createMethod(true),
    indexOf: createMethod(false)
  };

  var indexOf = arrayIncludes.indexOf;


  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !has$1(hiddenKeys$1, key) && has$1(O, key) && result.push(key);
    while (names.length > i) if (has$1(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  var enumBugKeys = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var hiddenKeys = enumBugKeys.concat('length', 'prototype');

  var f$1 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys);
  };

  var objectGetOwnPropertyNames = {
  	f: f$1
  };

  var f = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f
  };

  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = objectDefineProperty.f;
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!has$1(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var replacement = /#|\.prototype\./;

  var isForced = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : typeof detection == 'function' ? fails(detection)
      : !!detection;
  };

  var normalize = isForced.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced.data = {};
  var NATIVE = isForced.NATIVE = 'N';
  var POLYFILL = isForced.POLYFILL = 'P';

  var isForced_1 = isForced;

  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$2;
    } else if (STATIC) {
      target = global$2[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$2[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty(sourceProperty, 'sham', true);
      }
      redefine(target, key, sourceProperty, options);
    }
  };

  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
  };

  var aFunction = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    } return it;
  };

  var functionBindContext = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 0: return function () {
        return fn.call(that);
      };
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function () {
      return fn.apply(that, arguments);
    };
  };

  var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
    var targetIndex = start;
    var sourceIndex = 0;
    var mapFn = mapper ? functionBindContext(mapper, thisArg, 3) : false;
    var element;

    while (sourceIndex < sourceLen) {
      if (sourceIndex in source) {
        element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

        if (depth > 0 && isArray(element)) {
          targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
        } else {
          if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
          target[targetIndex] = element;
        }

        targetIndex++;
      }
      sourceIndex++;
    }
    return targetIndex;
  };

  var flattenIntoArray_1 = flattenIntoArray;

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var process = global$2.process;
  var versions$1 = process && process.versions;
  var v8 = versions$1 && versions$1.v8;
  var match, version$2;

  if (v8) {
    match = v8.split('.');
    version$2 = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (engineUserAgent) {
    match = engineUserAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = engineUserAgent.match(/Chrome\/(\d+)/);
      if (match) version$2 = match[1];
    }
  }

  var engineV8Version = version$2 && +version$2;


  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
    var symbol = Symbol();
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      !Symbol.sham && engineV8Version && engineV8Version < 41;
  });


  var useSymbolAsUid = nativeSymbol
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var WellKnownSymbolsStore = shared('wks');
  var Symbol$1 = global$2.Symbol;
  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

  var wellKnownSymbol = function (name) {
    if (!has$1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (nativeSymbol && has$1(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var SPECIES = wellKnownSymbol('species');

  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  _export({ target: 'Array', proto: true }, {
    flatMap: function flatMap(callbackfn) {
      var O = toObject(this);
      var sourceLen = toLength(O.length);
      var A;
      aFunction(callbackfn);
      A = arraySpeciesCreate(O, 0);
      A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
      return A;
    }
  });

  var floor = Math.floor;

  var mergeSort = function (array, comparefn) {
    var length = array.length;
    var middle = floor(length / 2);
    return length < 8 ? insertionSort(array, comparefn) : merge(
      mergeSort(array.slice(0, middle), comparefn),
      mergeSort(array.slice(middle), comparefn),
      comparefn
    );
  };

  var insertionSort = function (array, comparefn) {
    var length = array.length;
    var i = 1;
    var element, j;

    while (i < length) {
      j = i;
      element = array[i];
      while (j && comparefn(array[j - 1], element) > 0) {
        array[j] = array[--j];
      }
      if (j !== i++) array[j] = element;
    } return array;
  };

  var merge = function (left, right, comparefn) {
    var llength = left.length;
    var rlength = right.length;
    var lindex = 0;
    var rindex = 0;
    var result = [];

    while (lindex < llength || rindex < rlength) {
      if (lindex < llength && rindex < rlength) {
        result.push(comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]);
      } else {
        result.push(lindex < llength ? left[lindex++] : right[rindex++]);
      }
    } return result;
  };

  var arraySort = mergeSort;

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

  var engineFfVersion = !!firefox && +firefox[1];

  var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

  var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

  var engineWebkitVersion = !!webkit && +webkit[1];

  var test$1 = [];
  var nativeSort = test$1.sort;

  var FAILS_ON_UNDEFINED = fails(function () {
    test$1.sort(undefined);
  });
  var FAILS_ON_NULL = fails(function () {
    test$1.sort(null);
  });
  var STRICT_METHOD = arrayMethodIsStrict('sort');

  var STABLE_SORT = !fails(function () {
    if (engineV8Version) return engineV8Version < 70;
    if (engineFfVersion && engineFfVersion > 3) return;
    if (engineIsIeOrEdge) return true;
    if (engineWebkitVersion) return engineWebkitVersion < 603;

    var result = '';
    var code, chr, value, index;

    for (code = 65; code < 76; code++) {
      chr = String.fromCharCode(code);

      switch (code) {
        case 66: case 69: case 70: case 72: value = 3; break;
        case 68: case 71: value = 4; break;
        default: value = 2;
      }

      for (index = 0; index < 47; index++) {
        test$1.push({ k: chr + index, v: value });
      }
    }

    test$1.sort(function (a, b) { return b.v - a.v; });

    for (index = 0; index < test$1.length; index++) {
      chr = test$1[index].k.charAt(0);
      if (result.charAt(result.length - 1) !== chr) result += chr;
    }

    return result !== 'DGBEFHACIJK';
  });

  var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

  var getSortCompare = function (comparefn) {
    return function (x, y) {
      if (y === undefined) return -1;
      if (x === undefined) return 1;
      if (comparefn !== undefined) return +comparefn(x, y) || 0;
      return String(x) > String(y) ? 1 : -1;
    };
  };

  _export({ target: 'Array', proto: true, forced: FORCED }, {
    sort: function sort(comparefn) {
      if (comparefn !== undefined) aFunction(comparefn);

      var array = toObject(this);

      if (STABLE_SORT) return comparefn === undefined ? nativeSort.call(array) : nativeSort.call(array, comparefn);

      var items = [];
      var arrayLength = toLength(array.length);
      var itemsLength, index;

      for (index = 0; index < arrayLength; index++) {
        if (index in array) items.push(array[index]);
      }

      items = arraySort(items, getSortCompare(comparefn));
      itemsLength = items.length;
      index = 0;

      while (index < itemsLength) array[index] = items[index++];
      while (index < arrayLength) delete array[index++];

      return array;
    }
  });

  var iterators = {};

  var ITERATOR$1 = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$1] === it);
  };

  var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
  var test = {};

  test[TO_STRING_TAG$1] = 'z';

  var toStringTagSupport = String(test) === '[object z]';

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (error) { }
  };

  var classof = toStringTagSupport ? classofRaw : function (it) {
    var O, tag, result;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
      : CORRECT_ARGUMENTS ? classofRaw(O)
      : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
  };

  var ITERATOR = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR]
      || it['@@iterator']
      || iterators[classof(it)];
  };

  var iteratorClose = function (iterator) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) {
      return anObject(returnMethod.call(iterator)).value;
    }
  };

  var Result = function (stopped, result) {
    this.stopped = stopped;
    this.result = result;
  };

  var iterate = function (iterable, unboundFunction, options) {
    var that = options && options.that;
    var AS_ENTRIES = !!(options && options.AS_ENTRIES);
    var IS_ITERATOR = !!(options && options.IS_ITERATOR);
    var INTERRUPTED = !!(options && options.INTERRUPTED);
    var fn = functionBindContext(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
    var iterator, iterFn, index, length, result, next, step;

    var stop = function (condition) {
      if (iterator) iteratorClose(iterator);
      return new Result(true, condition);
    };

    var callFn = function (value) {
      if (AS_ENTRIES) {
        anObject(value);
        return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
      } return INTERRUPTED ? fn(value, stop) : fn(value);
    };

    if (IS_ITERATOR) {
      iterator = iterable;
    } else {
      iterFn = getIteratorMethod(iterable);
      if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
      if (isArrayIteratorMethod(iterFn)) {
        for (index = 0, length = toLength(iterable.length); length > index; index++) {
          result = callFn(iterable[index]);
          if (result && result instanceof Result) return result;
        } return new Result(false);
      }
      iterator = iterFn.call(iterable);
    }

    next = iterator.next;
    while (!(step = next.call(iterator)).done) {
      try {
        result = callFn(step.value);
      } catch (error) {
        iteratorClose(iterator);
        throw error;
      }
      if (typeof result == 'object' && result && result instanceof Result) return result;
    } return new Result(false);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  _export({ target: 'Object', stat: true }, {
    fromEntries: function fromEntries(iterable) {
      var obj = {};
      iterate(iterable, function (k, v) {
        createProperty(obj, k, v);
      }, { AS_ENTRIES: true });
      return obj;
    }
  });

  var global$1 = (typeof global$1 !== "undefined" ? global$1 :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window : {});


  function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
  }
  function defaultClearTimeout () {
      throw new Error('clearTimeout has not been defined');
  }
  var cachedSetTimeout = defaultSetTimout;
  var cachedClearTimeout = defaultClearTimeout;
  if (typeof global$1.setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
  }
  if (typeof global$1.clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
  }

  function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
          return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
          cachedSetTimeout = setTimeout;
          return setTimeout(fun, 0);
      }
      try {
          return cachedSetTimeout(fun, 0);
      } catch(e){
          try {
              return cachedSetTimeout.call(null, fun, 0);
          } catch(e){
              return cachedSetTimeout.call(this, fun, 0);
          }
      }


  }
  function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
          return clearTimeout(marker);
      }
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
          cachedClearTimeout = clearTimeout;
          return clearTimeout(marker);
      }
      try {
          return cachedClearTimeout(marker);
      } catch (e){
          try {
              return cachedClearTimeout.call(null, marker);
          } catch (e){
              return cachedClearTimeout.call(this, marker);
          }
      }



  }
  var queue = [];
  var draining = false;
  var currentQueue;
  var queueIndex = -1;

  function cleanUpNextTick() {
      if (!draining || !currentQueue) {
          return;
      }
      draining = false;
      if (currentQueue.length) {
          queue = currentQueue.concat(queue);
      } else {
          queueIndex = -1;
      }
      if (queue.length) {
          drainQueue();
      }
  }

  function drainQueue() {
      if (draining) {
          return;
      }
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;

      var len = queue.length;
      while(len) {
          currentQueue = queue;
          queue = [];
          while (++queueIndex < len) {
              if (currentQueue) {
                  currentQueue[queueIndex].run();
              }
          }
          queueIndex = -1;
          len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
  }
  function nextTick(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
          for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
          }
      }
      queue.push(new Item(fun, args));
      if (queue.length === 1 && !draining) {
          runTimeout(drainQueue);
      }
  }
  function Item(fun, array) {
      this.fun = fun;
      this.array = array;
  }
  Item.prototype.run = function () {
      this.fun.apply(null, this.array);
  };
  var title = 'browser';
  var platform = 'browser';
  var browser$1 = true;
  var env = {};
  var argv = [];
  var version$1 = '';
  var versions = {};
  var release = {};
  var config = {};

  function noop() {}

  var on = noop;
  var addListener = noop;
  var once = noop;
  var off = noop;
  var removeListener = noop;
  var removeAllListeners = noop;
  var emit = noop;

  function binding(name) {
      throw new Error('process.binding is not supported');
  }

  function cwd () { return '/' }
  function chdir (dir) {
      throw new Error('process.chdir is not supported');
  }function umask() { return 0; }

  var performance = global$1.performance || {};
  var performanceNow =
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  function hrtime(previousTimestamp){
    var clocktime = performanceNow.call(performance)*1e-3;
    var seconds = Math.floor(clocktime);
    var nanoseconds = Math.floor((clocktime%1)*1e9);
    if (previousTimestamp) {
      seconds = seconds - previousTimestamp[0];
      nanoseconds = nanoseconds - previousTimestamp[1];
      if (nanoseconds<0) {
        seconds--;
        nanoseconds += 1e9;
      }
    }
    return [seconds,nanoseconds]
  }

  var startTime = new Date();
  function uptime() {
    var currentTime = new Date();
    var dif = currentTime - startTime;
    return dif / 1000;
  }

  var browser$1$1 = {
    nextTick: nextTick,
    title: title,
    browser: browser$1,
    env: env,
    argv: argv,
    version: version$1,
    versions: versions,
    on: on,
    addListener: addListener,
    once: once,
    off: off,
    removeListener: removeListener,
    removeAllListeners: removeAllListeners,
    emit: emit,
    binding: binding,
    cwd: cwd,
    chdir: chdir,
    umask: umask,
    hrtime: hrtime,
    platform: platform,
    release: release,
    config: config,
    uptime: uptime
  };

  const debug = typeof browser$1$1 === 'object' && browser$1$1.env && browser$1$1.env.NODE_DEBUG && /\bsemver\b/i.test(browser$1$1.env.NODE_DEBUG) ? (...args) => console.error('SEMVER', ...args) : () => {};
  var debug_1 = debug;

  const SEMVER_SPEC_VERSION = '2.0.0';
  const MAX_LENGTH$1 = 256;
  const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
  9007199254740991;

  const MAX_SAFE_COMPONENT_LENGTH = 16;
  var constants = {
    SEMVER_SPEC_VERSION,
    MAX_LENGTH: MAX_LENGTH$1,
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
    MAX_SAFE_COMPONENT_LENGTH
  };

  var re_1 = createCommonjsModule(function (module, exports) {
    const {
      MAX_SAFE_COMPONENT_LENGTH
    } = constants;
    exports = module.exports = {};

    const re = exports.re = [];
    const src = exports.src = [];
    const t = exports.t = {};
    let R = 0;

    const createToken = (name, value, isGlobal) => {
      const index = R++;
      debug_1(index, value);
      t[name] = index;
      src[index] = value;
      re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
    };


    createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
    createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

    createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

    createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
    createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

    createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);

    createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

    createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

    createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

    createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken('FULL', `^${src[t.FULLPLAIN]}$`);

    createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
    createToken('GTLT', '((?:<|>)?=?)');

    createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
    createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
    createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

    createToken('COERCE', `${'(^|[^\\d])' + '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:$|[^\\d])`);
    createToken('COERCERTL', src[t.COERCE], true);

    createToken('LONETILDE', '(?:~>?)');
    createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports.tildeTrimReplace = '$1~';
    createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

    createToken('LONECARET', '(?:\\^)');
    createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports.caretTrimReplace = '$1^';
    createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

    createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

    createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports.comparatorTrimReplace = '$1$2$3';

    createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
    createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);

    createToken('STAR', '(<|>)?=?\\s*\\*');

    createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
    createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');
  });

  const opts = ['includePrerelease', 'loose', 'rtl'];

  const parseOptions = options => !options ? {} : typeof options !== 'object' ? {
    loose: true
  } : opts.filter(k => options[k]).reduce((options, k) => {
    options[k] = true;
    return options;
  }, {});

  var parseOptions_1 = parseOptions;

  const numeric = /^[0-9]+$/;

  const compareIdentifiers$1 = (a, b) => {
    const anum = numeric.test(a);
    const bnum = numeric.test(b);

    if (anum && bnum) {
      a = +a;
      b = +b;
    }

    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };

  const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);

  var identifiers = {
    compareIdentifiers: compareIdentifiers$1,
    rcompareIdentifiers
  };

  const {
    MAX_LENGTH,
    MAX_SAFE_INTEGER
  } = constants;
  const {
    re,
    t
  } = re_1;
  const {
    compareIdentifiers
  } = identifiers;

  class SemVer {
    constructor(version, options) {
      options = parseOptions_1(options);

      if (version instanceof SemVer) {
        if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
          return version;
        } else {
          version = version.version;
        }
      } else if (typeof version !== 'string') {
        throw new TypeError(`Invalid Version: ${version}`);
      }

      if (version.length > MAX_LENGTH) {
        throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
      }

      debug_1('SemVer', version, options);
      this.options = options;
      this.loose = !!options.loose;

      this.includePrerelease = !!options.includePrerelease;
      const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);

      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`);
      }

      this.raw = version;

      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];

      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError('Invalid major version');
      }

      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError('Invalid minor version');
      }

      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError('Invalid patch version');
      }


      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split('.').map(id => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;

            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }

          return id;
        });
      }

      this.build = m[5] ? m[5].split('.') : [];
      this.format();
    }

    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;

      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join('.')}`;
      }

      return this.version;
    }

    toString() {
      return this.version;
    }

    compare(other) {
      debug_1('SemVer.compare', this.version, this.options, other);

      if (!(other instanceof SemVer)) {
        if (typeof other === 'string' && other === this.version) {
          return 0;
        }

        other = new SemVer(other, this.options);
      }

      if (other.version === this.version) {
        return 0;
      }

      return this.compareMain(other) || this.comparePre(other);
    }

    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }

      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    }

    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }


      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }

      let i = 0;

      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug_1('prerelease compare', i, a, b);

        if (a === undefined && b === undefined) {
          return 0;
        } else if (b === undefined) {
          return 1;
        } else if (a === undefined) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }

    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }

      let i = 0;

      do {
        const a = this.build[i];
        const b = other.build[i];
        debug_1('prerelease compare', i, a, b);

        if (a === undefined && b === undefined) {
          return 0;
        } else if (b === undefined) {
          return 1;
        } else if (a === undefined) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }


    inc(release, identifier) {
      switch (release) {
        case 'premajor':
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc('pre', identifier);
          break;

        case 'preminor':
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc('pre', identifier);
          break;

        case 'prepatch':
          this.prerelease.length = 0;
          this.inc('patch', identifier);
          this.inc('pre', identifier);
          break;

        case 'prerelease':
          if (this.prerelease.length === 0) {
            this.inc('patch', identifier);
          }

          this.inc('pre', identifier);
          break;

        case 'major':
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }

          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;

        case 'minor':
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }

          this.patch = 0;
          this.prerelease = [];
          break;

        case 'patch':
          if (this.prerelease.length === 0) {
            this.patch++;
          }

          this.prerelease = [];
          break;

        case 'pre':
          if (this.prerelease.length === 0) {
            this.prerelease = [0];
          } else {
            let i = this.prerelease.length;

            while (--i >= 0) {
              if (typeof this.prerelease[i] === 'number') {
                this.prerelease[i]++;
                i = -2;
              }
            }

            if (i === -1) {
              this.prerelease.push(0);
            }
          }

          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0];
              }
            } else {
              this.prerelease = [identifier, 0];
            }
          }

          break;

        default:
          throw new Error(`invalid increment argument: ${release}`);
      }

      this.format();
      this.raw = this.version;
      return this;
    }

  }

  var semver$1 = SemVer;

  const compare = (a, b, loose) => new semver$1(a, loose).compare(new semver$1(b, loose));

  var compare_1 = compare;

  const lt = (a, b, loose) => compare_1(a, b, loose) < 0;

  var lt_1 = lt;

  const gte = (a, b, loose) => compare_1(a, b, loose) >= 0;

  var gte_1 = gte;

  var arrayify = (object, keyName) => Object.entries(object).map(([key, value]) => Object.assign({
    [keyName]: key
  }, value));

  var name = "prettier";
  var version = "2.3.2";
  var description = "Prettier is an opinionated code formatter";
  var bin = "./bin/prettier.js";
  var repository = "prettier/prettier";
  var homepage = "https://prettier.io";
  var author = "James Long";
  var license = "MIT";
  var main = "./index.js";
  var browser = "./standalone.js";
  var unpkg = "./standalone.js";
  var engines = {
  	node: ">=12.17.0"
  };
  var files = [
  	"index.js",
  	"standalone.js",
  	"src",
  	"bin"
  ];
  var dependencies = {
  	"@angular/compiler": "12.0.5",
  	"@babel/code-frame": "7.14.5",
  	"@babel/parser": "7.14.6",
  	"@glimmer/syntax": "0.79.3",
  	"@iarna/toml": "2.2.5",
  	"@typescript-eslint/typescript-estree": "4.27.0",
  	"angular-estree-parser": "2.4.0",
  	"angular-html-parser": "1.8.0",
  	camelcase: "6.2.0",
  	chalk: "4.1.1",
  	"ci-info": "3.2.0",
  	"cjk-regex": "2.0.1",
  	cosmiconfig: "7.0.0",
  	dashify: "2.0.0",
  	diff: "5.0.0",
  	editorconfig: "0.15.3",
  	"editorconfig-to-prettier": "0.2.0",
  	"escape-string-regexp": "4.0.0",
  	espree: "7.3.1",
  	esutils: "2.0.3",
  	"fast-glob": "3.2.5",
  	"fast-json-stable-stringify": "2.1.0",
  	"find-parent-dir": "0.3.1",
  	"flow-parser": "0.153.0",
  	"get-stdin": "8.0.0",
  	globby: "11.0.4",
  	graphql: "15.5.0",
  	"html-element-attributes": "2.3.0",
  	"html-styles": "1.0.0",
  	"html-tag-names": "1.1.5",
  	"html-void-elements": "1.0.5",
  	ignore: "4.0.6",
  	"jest-docblock": "27.0.1",
  	json5: "2.2.0",
  	leven: "3.1.0",
  	"lines-and-columns": "1.1.6",
  	"linguist-languages": "7.15.0",
  	lodash: "4.17.21",
  	mem: "8.1.1",
  	meriyah: "4.1.5",
  	minimatch: "3.0.4",
  	minimist: "1.2.5",
  	"n-readlines": "1.0.1",
  	outdent: "0.8.0",
  	"parse-srcset": "ikatyang/parse-srcset#54eb9c1cb21db5c62b4d0e275d7249516df6f0ee",
  	"please-upgrade-node": "3.2.0",
  	"postcss-less": "3.1.4",
  	"postcss-media-query-parser": "0.2.3",
  	"postcss-scss": "2.1.1",
  	"postcss-selector-parser": "2.2.3",
  	"postcss-values-parser": "2.0.1",
  	"regexp-util": "1.2.2",
  	"remark-footnotes": "2.0.0",
  	"remark-math": "3.0.1",
  	"remark-parse": "8.0.3",
  	resolve: "1.20.0",
  	semver: "7.3.5",
  	"string-width": "4.2.2",
  	"strip-ansi": "6.0.0",
  	typescript: "4.3.4",
  	"unicode-regex": "3.0.0",
  	unified: "9.2.1",
  	vnopts: "1.0.2",
  	wcwidth: "1.0.1",
  	"yaml-unist-parser": "1.3.1"
  };
  var devDependencies = {
  	"@babel/core": "7.14.6",
  	"@babel/preset-env": "7.14.5",
  	"@babel/types": "7.14.5",
  	"@glimmer/reference": "0.79.3",
  	"@rollup/plugin-alias": "3.1.2",
  	"@rollup/plugin-babel": "5.3.0",
  	"@rollup/plugin-commonjs": "18.1.0",
  	"@rollup/plugin-json": "4.1.0",
  	"@rollup/plugin-node-resolve": "13.0.0",
  	"@rollup/plugin-replace": "2.4.2",
  	"@types/estree": "0.0.48",
  	"babel-jest": "27.0.2",
  	"babel-loader": "8.2.2",
  	benchmark: "2.1.4",
  	"builtin-modules": "3.2.0",
  	"core-js": "3.14.0",
  	"cross-env": "7.0.3",
  	cspell: "4.2.8",
  	eslint: "7.29.0",
  	"eslint-config-prettier": "8.3.0",
  	"eslint-formatter-friendly": "7.0.0",
  	"eslint-plugin-import": "2.23.4",
  	"eslint-plugin-jest": "24.3.6",
  	"eslint-plugin-prettier-internal-rules": "link:scripts/tools/eslint-plugin-prettier-internal-rules",
  	"eslint-plugin-react": "7.24.0",
  	"eslint-plugin-regexp": "0.12.1",
  	"eslint-plugin-unicorn": "33.0.1",
  	"esm-utils": "1.1.0",
  	execa: "5.1.1",
  	jest: "27.0.4",
  	"jest-snapshot-serializer-ansi": "1.0.0",
  	"jest-snapshot-serializer-raw": "1.2.0",
  	"jest-watch-typeahead": "0.6.4",
  	"npm-run-all": "4.1.5",
  	"path-browserify": "1.0.1",
  	prettier: "2.3.1",
  	"pretty-bytes": "5.6.0",
  	rimraf: "3.0.2",
  	rollup: "2.52.1",
  	"rollup-plugin-polyfill-node": "0.6.2",
  	"rollup-plugin-terser": "7.0.2",
  	shelljs: "0.8.4",
  	"snapshot-diff": "0.9.0",
  	tempy: "1.0.1",
  	"terser-webpack-plugin": "5.1.3",
  	webpack: "5.39.1"
  };
  var scripts = {
  	prepublishOnly: "echo \"Error: must publish from dist/\" && exit 1",
  	"prepare-release": "yarn && yarn build && yarn test:dist",
  	test: "jest",
  	"test:dev-package": "cross-env INSTALL_PACKAGE=1 jest",
  	"test:dist": "cross-env NODE_ENV=production jest",
  	"test:dist-standalone": "cross-env NODE_ENV=production TEST_STANDALONE=1 jest",
  	"test:integration": "jest tests/integration",
  	"perf:repeat": "yarn && yarn build && cross-env NODE_ENV=production node ./dist/bin-prettier.js --debug-repeat ${PERF_REPEAT:-1000} --loglevel debug ${PERF_FILE:-./index.js} > /dev/null",
  	"perf:repeat-inspect": "yarn && yarn build && cross-env NODE_ENV=production node --inspect-brk ./dist/bin-prettier.js --debug-repeat ${PERF_REPEAT:-1000} --loglevel debug ${PERF_FILE:-./index.js} > /dev/null",
  	"perf:benchmark": "yarn && yarn build && cross-env NODE_ENV=production node ./dist/bin-prettier.js --debug-benchmark --loglevel debug ${PERF_FILE:-./index.js} > /dev/null",
  	lint: "run-p lint:*",
  	"lint:typecheck": "tsc",
  	"lint:eslint": "cross-env EFF_NO_LINK_RULES=true eslint . --format friendly",
  	"lint:changelog": "node ./scripts/lint-changelog.mjs",
  	"lint:prettier": "prettier . \"!test*\" --check",
  	"lint:dist": "eslint --no-eslintrc --no-ignore --no-inline-config --env=es6,browser --parser-options=ecmaVersion:2019 \"dist/!(bin-prettier|index|third-party).js\"",
  	"lint:spellcheck": "cspell \"**/*\" \".github/**/*\"",
  	"lint:deps": "node ./scripts/check-deps.mjs",
  	fix: "run-s fix:eslint fix:prettier",
  	"fix:eslint": "yarn lint:eslint --fix",
  	"fix:prettier": "yarn lint:prettier --write",
  	build: "node --max-old-space-size=3072 ./scripts/build/build.mjs",
  	"build-docs": "node ./scripts/build-docs.mjs"
  };
  var require$$3 = {
  	name: name,
  	version: version,
  	description: description,
  	bin: bin,
  	repository: repository,
  	homepage: homepage,
  	author: author,
  	license: license,
  	main: main,
  	browser: browser,
  	unpkg: unpkg,
  	engines: engines,
  	files: files,
  	dependencies: dependencies,
  	devDependencies: devDependencies,
  	scripts: scripts
  };

  var lib = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.outdent = void 0;

    function noop() {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
    }

    function createWeakMap() {
      if (typeof WeakMap !== "undefined") {
        return new WeakMap();
      } else {
        return fakeSetOrMap();
      }
    }


    function fakeSetOrMap() {
      return {
        add: noop,
        delete: noop,
        get: noop,
        set: noop,
        has: function (k) {
          return false;
        }
      };
    }


    var hop = Object.prototype.hasOwnProperty;

    var has = function (obj, prop) {
      return hop.call(obj, prop);
    };


    function extend(target, source) {
      for (var prop in source) {
        if (has(source, prop)) {
          target[prop] = source[prop];
        }
      }

      return target;
    }

    var reLeadingNewline = /^[ \t]*(?:\r\n|\r|\n)/;
    var reTrailingNewline = /(?:\r\n|\r|\n)[ \t]*$/;
    var reStartsWithNewlineOrIsEmpty = /^(?:[\r\n]|$)/;
    var reDetectIndentation = /(?:\r\n|\r|\n)([ \t]*)(?:[^ \t\r\n]|$)/;
    var reOnlyWhitespaceWithAtLeastOneNewline = /^[ \t]*[\r\n][ \t\r\n]*$/;

    function _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options) {
      var indentationLevel = 0;
      var match = strings[0].match(reDetectIndentation);

      if (match) {
        indentationLevel = match[1].length;
      }

      var reSource = "(\\r\\n|\\r|\\n).{0," + indentationLevel + "}";
      var reMatchIndent = new RegExp(reSource, "g");

      if (firstInterpolatedValueSetsIndentationLevel) {
        strings = strings.slice(1);
      }

      var newline = options.newline,
          trimLeadingNewline = options.trimLeadingNewline,
          trimTrailingNewline = options.trimTrailingNewline;
      var normalizeNewlines = typeof newline === "string";
      var l = strings.length;
      var outdentedStrings = strings.map(function (v, i) {
        v = v.replace(reMatchIndent, "$1");

        if (i === 0 && trimLeadingNewline) {
          v = v.replace(reLeadingNewline, "");
        }


        if (i === l - 1 && trimTrailingNewline) {
          v = v.replace(reTrailingNewline, "");
        }


        if (normalizeNewlines) {
          v = v.replace(/\r\n|\n|\r/g, function (_) {
            return newline;
          });
        }

        return v;
      });
      return outdentedStrings;
    }

    function concatStringsAndValues(strings, values) {
      var ret = "";

      for (var i = 0, l = strings.length; i < l; i++) {
        ret += strings[i];

        if (i < l - 1) {
          ret += values[i];
        }
      }

      return ret;
    }

    function isTemplateStringsArray(v) {
      return has(v, "raw") && has(v, "length");
    }


    function createInstance(options) {
      var arrayAutoIndentCache = createWeakMap();

      var arrayFirstInterpSetsIndentCache = createWeakMap();

      function outdent(stringsOrOptions) {
        var values = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          values[_i - 1] = arguments[_i];
        }


        if (isTemplateStringsArray(stringsOrOptions)) {
          var strings = stringsOrOptions;

          var firstInterpolatedValueSetsIndentationLevel = (values[0] === outdent || values[0] === defaultOutdent) && reOnlyWhitespaceWithAtLeastOneNewline.test(strings[0]) && reStartsWithNewlineOrIsEmpty.test(strings[1]);

          var cache = firstInterpolatedValueSetsIndentationLevel ? arrayFirstInterpSetsIndentCache : arrayAutoIndentCache;
          var renderedArray = cache.get(strings);

          if (!renderedArray) {
            renderedArray = _outdentArray(strings, firstInterpolatedValueSetsIndentationLevel, options);
            cache.set(strings, renderedArray);
          }


          if (values.length === 0) {
            return renderedArray[0];
          }


          var rendered = concatStringsAndValues(renderedArray, firstInterpolatedValueSetsIndentationLevel ? values.slice(1) : values);
          return rendered;
        } else {
          return createInstance(extend(extend({}, options), stringsOrOptions || {}));
        }
      }

      var fullOutdent = extend(outdent, {
        string: function (str) {
          return _outdentArray([str], false, options)[0];
        }
      });
      return fullOutdent;
    }

    var defaultOutdent = createInstance({
      trimLeadingNewline: true,
      trimTrailingNewline: true
    });
    exports.outdent = defaultOutdent;

    exports.default = defaultOutdent;

    {
      try {
        module.exports = defaultOutdent;
        Object.defineProperty(defaultOutdent, "__esModule", {
          value: true
        });
        defaultOutdent.default = defaultOutdent;
        defaultOutdent.outdent = defaultOutdent;
      } catch (e) {}
    }
  });

  const {
    outdent
  } = lib;
  const CATEGORY_CONFIG = "Config";
  const CATEGORY_EDITOR = "Editor";
  const CATEGORY_FORMAT = "Format";
  const CATEGORY_OTHER = "Other";
  const CATEGORY_OUTPUT = "Output";
  const CATEGORY_GLOBAL = "Global";
  const CATEGORY_SPECIAL = "Special";


  const options = {
    cursorOffset: {
      since: "1.4.0",
      category: CATEGORY_SPECIAL,
      type: "int",
      default: -1,
      range: {
        start: -1,
        end: Number.POSITIVE_INFINITY,
        step: 1
      },
      description: outdent`
      Print (to stderr) where a cursor at the given position would move to after formatting.
      This option cannot be used with --range-start and --range-end.
    `,
      cliCategory: CATEGORY_EDITOR
    },
    endOfLine: {
      since: "1.15.0",
      category: CATEGORY_GLOBAL,
      type: "choice",
      default: [{
        since: "1.15.0",
        value: "auto"
      }, {
        since: "2.0.0",
        value: "lf"
      }],
      description: "Which end of line characters to apply.",
      choices: [{
        value: "lf",
        description: "Line Feed only (\\n), common on Linux and macOS as well as inside git repos"
      }, {
        value: "crlf",
        description: "Carriage Return + Line Feed characters (\\r\\n), common on Windows"
      }, {
        value: "cr",
        description: "Carriage Return character only (\\r), used very rarely"
      }, {
        value: "auto",
        description: outdent`
          Maintain existing
          (mixed values within one file are normalised by looking at what's used after the first line)
        `
      }]
    },
    filepath: {
      since: "1.4.0",
      category: CATEGORY_SPECIAL,
      type: "path",
      description: "Specify the input filepath. This will be used to do parser inference.",
      cliName: "stdin-filepath",
      cliCategory: CATEGORY_OTHER,
      cliDescription: "Path to the file to pretend that stdin comes from."
    },
    insertPragma: {
      since: "1.8.0",
      category: CATEGORY_SPECIAL,
      type: "boolean",
      default: false,
      description: "Insert @format pragma into file's first docblock comment.",
      cliCategory: CATEGORY_OTHER
    },
    parser: {
      since: "0.0.10",
      category: CATEGORY_GLOBAL,
      type: "choice",
      default: [{
        since: "0.0.10",
        value: "babylon"
      }, {
        since: "1.13.0",
        value: undefined
      }],
      description: "Which parser to use.",
      exception: value => typeof value === "string" || typeof value === "function",
      choices: [{
        value: "flow",
        description: "Flow"
      }, {
        value: "babel",
        since: "1.16.0",
        description: "JavaScript"
      }, {
        value: "babel-flow",
        since: "1.16.0",
        description: "Flow"
      }, {
        value: "babel-ts",
        since: "2.0.0",
        description: "TypeScript"
      }, {
        value: "typescript",
        since: "1.4.0",
        description: "TypeScript"
      }, {
        value: "espree",
        since: "2.2.0",
        description: "JavaScript"
      }, {
        value: "meriyah",
        since: "2.2.0",
        description: "JavaScript"
      }, {
        value: "css",
        since: "1.7.1",
        description: "CSS"
      }, {
        value: "less",
        since: "1.7.1",
        description: "Less"
      }, {
        value: "scss",
        since: "1.7.1",
        description: "SCSS"
      }, {
        value: "json",
        since: "1.5.0",
        description: "JSON"
      }, {
        value: "json5",
        since: "1.13.0",
        description: "JSON5"
      }, {
        value: "json-stringify",
        since: "1.13.0",
        description: "JSON.stringify"
      }, {
        value: "graphql",
        since: "1.5.0",
        description: "GraphQL"
      }, {
        value: "markdown",
        since: "1.8.0",
        description: "Markdown"
      }, {
        value: "mdx",
        since: "1.15.0",
        description: "MDX"
      }, {
        value: "vue",
        since: "1.10.0",
        description: "Vue"
      }, {
        value: "yaml",
        since: "1.14.0",
        description: "YAML"
      }, {
        value: "glimmer",
        since: "2.3.0",
        description: "Ember / Handlebars"
      }, {
        value: "html",
        since: "1.15.0",
        description: "HTML"
      }, {
        value: "angular",
        since: "1.15.0",
        description: "Angular"
      }, {
        value: "lwc",
        since: "1.17.0",
        description: "Lightning Web Components"
      }]
    },
    plugins: {
      since: "1.10.0",
      type: "path",
      array: true,
      default: [{
        value: []
      }],
      category: CATEGORY_GLOBAL,
      description: "Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",
      exception: value => typeof value === "string" || typeof value === "object",
      cliName: "plugin",
      cliCategory: CATEGORY_CONFIG
    },
    pluginSearchDirs: {
      since: "1.13.0",
      type: "path",
      array: true,
      default: [{
        value: []
      }],
      category: CATEGORY_GLOBAL,
      description: outdent`
      Custom directory that contains prettier plugins in node_modules subdirectory.
      Overrides default behavior when plugins are searched relatively to the location of Prettier.
      Multiple values are accepted.
    `,
      exception: value => typeof value === "string" || typeof value === "object",
      cliName: "plugin-search-dir",
      cliCategory: CATEGORY_CONFIG
    },
    printWidth: {
      since: "0.0.0",
      category: CATEGORY_GLOBAL,
      type: "int",
      default: 80,
      description: "The line length where Prettier will try wrap.",
      range: {
        start: 0,
        end: Number.POSITIVE_INFINITY,
        step: 1
      }
    },
    rangeEnd: {
      since: "1.4.0",
      category: CATEGORY_SPECIAL,
      type: "int",
      default: Number.POSITIVE_INFINITY,
      range: {
        start: 0,
        end: Number.POSITIVE_INFINITY,
        step: 1
      },
      description: outdent`
      Format code ending at a given character offset (exclusive).
      The range will extend forwards to the end of the selected statement.
      This option cannot be used with --cursor-offset.
    `,
      cliCategory: CATEGORY_EDITOR
    },
    rangeStart: {
      since: "1.4.0",
      category: CATEGORY_SPECIAL,
      type: "int",
      default: 0,
      range: {
        start: 0,
        end: Number.POSITIVE_INFINITY,
        step: 1
      },
      description: outdent`
      Format code starting at a given character offset.
      The range will extend backwards to the start of the first line containing the selected statement.
      This option cannot be used with --cursor-offset.
    `,
      cliCategory: CATEGORY_EDITOR
    },
    requirePragma: {
      since: "1.7.0",
      category: CATEGORY_SPECIAL,
      type: "boolean",
      default: false,
      description: outdent`
      Require either '@prettier' or '@format' to be present in the file's first docblock comment
      in order for it to be formatted.
    `,
      cliCategory: CATEGORY_OTHER
    },
    tabWidth: {
      type: "int",
      category: CATEGORY_GLOBAL,
      default: 2,
      description: "Number of spaces per indentation level.",
      range: {
        start: 0,
        end: Number.POSITIVE_INFINITY,
        step: 1
      }
    },
    useTabs: {
      since: "1.0.0",
      category: CATEGORY_GLOBAL,
      type: "boolean",
      default: false,
      description: "Indent with tabs instead of spaces."
    },
    embeddedLanguageFormatting: {
      since: "2.1.0",
      category: CATEGORY_GLOBAL,
      type: "choice",
      default: [{
        since: "2.1.0",
        value: "auto"
      }],
      description: "Control how Prettier formats quoted code embedded in the file.",
      choices: [{
        value: "auto",
        description: "Format embedded code if Prettier can automatically identify it."
      }, {
        value: "off",
        description: "Never automatically format embedded code."
      }]
    }
  };
  var coreOptions$1 = {
    CATEGORY_CONFIG,
    CATEGORY_EDITOR,
    CATEGORY_FORMAT,
    CATEGORY_OTHER,
    CATEGORY_OUTPUT,
    CATEGORY_GLOBAL,
    CATEGORY_SPECIAL,
    options
  };

  const _excluded = ["cliName", "cliCategory", "cliDescription"];

  const semver = {
    compare: compare_1,
    lt: lt_1,
    gte: gte_1
  };
  const currentVersion = require$$3.version;
  const coreOptions = coreOptions$1.options;

  function getSupportInfo$1({
    plugins = [],
    showUnreleased = false,
    showDeprecated = false,
    showInternal = false
  } = {}) {
    const version = currentVersion.split("-", 1)[0];
    const languages = plugins.flatMap(plugin => plugin.languages || []).filter(filterSince);
    const options = arrayify(Object.assign({}, ...plugins.map(({
      options
    }) => options), coreOptions), "name").filter(option => filterSince(option) && filterDeprecated(option)).sort((a, b) => a.name === b.name ? 0 : a.name < b.name ? -1 : 1).map(mapInternal).map(option => {
      option = Object.assign({}, option);

      if (Array.isArray(option.default)) {
        option.default = option.default.length === 1 ? option.default[0].value : option.default.filter(filterSince).sort((info1, info2) => semver.compare(info2.since, info1.since))[0].value;
      }

      if (Array.isArray(option.choices)) {
        option.choices = option.choices.filter(option => filterSince(option) && filterDeprecated(option));

        if (option.name === "parser") {
          collectParsersFromLanguages(option, languages, plugins);
        }
      }

      const pluginDefaults = Object.fromEntries(plugins.filter(plugin => plugin.defaultOptions && plugin.defaultOptions[option.name] !== undefined).map(plugin => [plugin.name, plugin.defaultOptions[option.name]]));
      return Object.assign(Object.assign({}, option), {}, {
        pluginDefaults
      });
    });
    return {
      languages,
      options
    };

    function filterSince(object) {
      return showUnreleased || !("since" in object) || object.since && semver.gte(version, object.since);
    }

    function filterDeprecated(object) {
      return showDeprecated || !("deprecated" in object) || object.deprecated && semver.lt(version, object.deprecated);
    }

    function mapInternal(object) {
      if (showInternal) {
        return object;
      }

      const newObject = _objectWithoutProperties(object, _excluded);

      return newObject;
    }
  }

  function collectParsersFromLanguages(option, languages, plugins) {
    const existingValues = new Set(option.choices.map(choice => choice.value));

    for (const language of languages) {
      if (language.parsers) {
        for (const value of language.parsers) {
          if (!existingValues.has(value)) {
            existingValues.add(value);
            const plugin = plugins.find(plugin => plugin.parsers && plugin.parsers[value]);
            let description = language.name;

            if (plugin && plugin.name) {
              description += ` (plugin: ${plugin.name})`;
            }

            option.choices.push({
              value,
              description
            });
          }
        }
      }
    }
  }

  var support = {
    getSupportInfo: getSupportInfo$1
  };

  const {
    getSupportInfo
  } = support;
  const notAsciiRegex = /[^\x20-\x7F]/;

  const getPenultimate = arr => arr[arr.length - 2];



  function skip(chars) {
    return (text, index, opts) => {
      const backwards = opts && opts.backwards;


      if (index === false) {
        return false;
      }

      const {
        length
      } = text;
      let cursor = index;

      while (cursor >= 0 && cursor < length) {
        const c = text.charAt(cursor);

        if (chars instanceof RegExp) {
          if (!chars.test(c)) {
            return cursor;
          }
        } else if (!chars.includes(c)) {
          return cursor;
        }

        backwards ? cursor-- : cursor++;
      }

      if (cursor === -1 || cursor === length) {
        return cursor;
      }

      return false;
    };
  }


  const skipWhitespace = skip(/\s/);

  const skipSpaces = skip(" \t");

  const skipToLineEnd = skip(",; \t");

  const skipEverythingButNewLine = skip(/[^\n\r]/);

  function skipInlineComment(text, index) {
    if (index === false) {
      return false;
    }

    if (text.charAt(index) === "/" && text.charAt(index + 1) === "*") {
      for (let i = index + 2; i < text.length; ++i) {
        if (text.charAt(i) === "*" && text.charAt(i + 1) === "/") {
          return i + 2;
        }
      }
    }

    return index;
  }


  function skipTrailingComment(text, index) {
    if (index === false) {
      return false;
    }

    if (text.charAt(index) === "/" && text.charAt(index + 1) === "/") {
      return skipEverythingButNewLine(text, index);
    }

    return index;
  }



  function skipNewline(text, index, opts) {
    const backwards = opts && opts.backwards;

    if (index === false) {
      return false;
    }

    const atIndex = text.charAt(index);

    if (backwards) {

      if (text.charAt(index - 1) === "\r" && atIndex === "\n") {
        return index - 2;
      }

      if (atIndex === "\n" || atIndex === "\r" || atIndex === "\u2028" || atIndex === "\u2029") {
        return index - 1;
      }
    } else {

      if (atIndex === "\r" && text.charAt(index + 1) === "\n") {
        return index + 2;
      }

      if (atIndex === "\n" || atIndex === "\r" || atIndex === "\u2028" || atIndex === "\u2029") {
        return index + 1;
      }
    }

    return index;
  }


  function hasNewline(text, index, opts = {}) {
    const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
    const idx2 = skipNewline(text, idx, opts);
    return idx !== idx2;
  }


  function hasNewlineInRange(text, start, end) {
    for (let i = start; i < end; ++i) {
      if (text.charAt(i) === "\n") {
        return true;
      }
    }

    return false;
  }



  function isPreviousLineEmpty(text, node, locStart) {
    let idx = locStart(node) - 1;
    idx = skipSpaces(text, idx, {
      backwards: true
    });
    idx = skipNewline(text, idx, {
      backwards: true
    });
    idx = skipSpaces(text, idx, {
      backwards: true
    });
    const idx2 = skipNewline(text, idx, {
      backwards: true
    });
    return idx !== idx2;
  }


  function isNextLineEmptyAfterIndex(text, index) {
    let oldIdx = null;

    let idx = index;

    while (idx !== oldIdx) {
      oldIdx = idx;
      idx = skipToLineEnd(text, idx);
      idx = skipInlineComment(text, idx);
      idx = skipSpaces(text, idx);
    }

    idx = skipTrailingComment(text, idx);
    idx = skipNewline(text, idx);
    return idx !== false && hasNewline(text, idx);
  }


  function isNextLineEmpty(text, node, locEnd) {
    return isNextLineEmptyAfterIndex(text, locEnd(node));
  }


  function getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, idx) {
    let oldIdx = null;

    let nextIdx = idx;

    while (nextIdx !== oldIdx) {
      oldIdx = nextIdx;
      nextIdx = skipSpaces(text, nextIdx);
      nextIdx = skipInlineComment(text, nextIdx);
      nextIdx = skipTrailingComment(text, nextIdx);
      nextIdx = skipNewline(text, nextIdx);
    }

    return nextIdx;
  }


  function getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd) {
    return getNextNonSpaceNonCommentCharacterIndexWithStartIndex(text, locEnd(node));
  }


  function getNextNonSpaceNonCommentCharacter(text, node, locEnd) {
    return text.charAt(
    getNextNonSpaceNonCommentCharacterIndex(text, node, locEnd));
  }




  function hasSpaces(text, index, opts = {}) {
    const idx = skipSpaces(text, opts.backwards ? index - 1 : index, opts);
    return idx !== index;
  }


  function getAlignmentSize(value, tabWidth, startIndex = 0) {
    let size = 0;

    for (let i = startIndex; i < value.length; ++i) {
      if (value[i] === "\t") {
        size = size + tabWidth - size % tabWidth;
      } else {
        size++;
      }
    }

    return size;
  }


  function getIndentSize(value, tabWidth) {
    const lastNewlineIndex = value.lastIndexOf("\n");

    if (lastNewlineIndex === -1) {
      return 0;
    }

    return getAlignmentSize(
    value.slice(lastNewlineIndex + 1).match(/^[\t ]*/)[0], tabWidth);
  }



  function getPreferredQuote(raw, preferredQuote) {
    const rawContent = raw.slice(1, -1);

    const double = {
      quote: '"',
      regex: /"/g
    };

    const single = {
      quote: "'",
      regex: /'/g
    };
    const preferred = preferredQuote === "'" ? single : double;
    const alternate = preferred === single ? double : single;
    let result = preferred.quote;

    if (rawContent.includes(preferred.quote) || rawContent.includes(alternate.quote)) {
      const numPreferredQuotes = (rawContent.match(preferred.regex) || []).length;
      const numAlternateQuotes = (rawContent.match(alternate.regex) || []).length;
      result = numPreferredQuotes > numAlternateQuotes ? alternate.quote : preferred.quote;
    }

    return result;
  }

  function printString(raw, options) {
    const rawContent = raw.slice(1, -1);

    const enclosingQuote = options.parser === "json" || options.parser === "json5" && options.quoteProps === "preserve" && !options.singleQuote ? '"' : options.__isInHtmlAttribute ? "'" : getPreferredQuote(raw, options.singleQuote ? "'" : '"');

    return makeString(rawContent, enclosingQuote, !(options.parser === "css" || options.parser === "less" || options.parser === "scss" || options.__embeddedInHtml));
  }


  function makeString(rawContent, enclosingQuote, unescapeUnnecessaryEscapes) {
    const otherQuote = enclosingQuote === '"' ? "'" : '"';

    const regex = /\\(.)|(["'])/gs;

    const newContent = rawContent.replace(regex, (match, escaped, quote) => {
      if (escaped === otherQuote) {
        return escaped;
      }


      if (quote === enclosingQuote) {
        return "\\" + quote;
      }

      if (quote) {
        return quote;
      }


      return unescapeUnnecessaryEscapes && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(escaped) ? escaped : "\\" + escaped;
    });
    return enclosingQuote + newContent + enclosingQuote;
  }

  function printNumber(rawNumber) {
    return rawNumber.toLowerCase()
    .replace(/^([+-]?[\d.]+e)(?:\+|(-))?0*(\d)/, "$1$2$3")
    .replace(/^([+-]?[\d.]+)e[+-]?0+$/, "$1")
    .replace(/^([+-])?\./, "$10.")
    .replace(/(\.\d+?)0+(?=e|$)/, "$1")
    .replace(/\.(?=e|$)/, "");
  }


  function getMaxContinuousCount(str, target) {
    const results = str.match(new RegExp(`(${escapeStringRegexp(target)})+`, "g"));

    if (results === null) {
      return 0;
    }

    return results.reduce((maxCount, result) => Math.max(maxCount, result.length / target.length), 0);
  }

  function getMinNotPresentContinuousCount(str, target) {
    const matches = str.match(new RegExp(`(${escapeStringRegexp(target)})+`, "g"));

    if (matches === null) {
      return 0;
    }

    const countPresent = new Map();
    let max = 0;

    for (const match of matches) {
      const count = match.length / target.length;
      countPresent.set(count, true);

      if (count > max) {
        max = count;
      }
    }

    for (let i = 1; i < max; i++) {
      if (!countPresent.get(i)) {
        return i;
      }
    }

    return max + 1;
  }


  function getStringWidth$1(text) {
    if (!text) {
      return 0;
    }


    if (!notAsciiRegex.test(text)) {
      return text.length;
    }

    return stringWidth_1(text);
  }

  function addCommentHelper(node, comment) {
    const comments = node.comments || (node.comments = []);
    comments.push(comment);
    comment.printed = false;
    comment.nodeDescription = describeNodeForDebugging(node);
  }

  function addLeadingComment(node, comment) {
    comment.leading = true;
    comment.trailing = false;
    addCommentHelper(node, comment);
  }

  function addDanglingComment(node, comment, marker) {
    comment.leading = false;
    comment.trailing = false;

    if (marker) {
      comment.marker = marker;
    }

    addCommentHelper(node, comment);
  }

  function addTrailingComment(node, comment) {
    comment.leading = false;
    comment.trailing = true;
    addCommentHelper(node, comment);
  }

  function inferParserByLanguage(language, options) {
    const {
      languages
    } = getSupportInfo({
      plugins: options.plugins
    });
    const matched = languages.find(({
      name
    }) => name.toLowerCase() === language) || languages.find(({
      aliases
    }) => Array.isArray(aliases) && aliases.includes(language)) || languages.find(({
      extensions
    }) => Array.isArray(extensions) && extensions.includes(`.${language}`));
    return matched && matched.parsers[0];
  }

  function isFrontMatterNode(node) {
    return node && node.type === "front-matter";
  }

  function getShebang(text) {
    if (!text.startsWith("#!")) {
      return "";
    }

    const index = text.indexOf("\n");

    if (index === -1) {
      return text;
    }

    return text.slice(0, index);
  }


  function isNonEmptyArray(object) {
    return Array.isArray(object) && object.length > 0;
  }


  function createGroupIdMapper(description) {
    const groupIds = new WeakMap();
    return function (node) {
      if (!groupIds.has(node)) {
        groupIds.set(node, Symbol(description));
      }

      return groupIds.get(node);
    };
  }

  function describeNodeForDebugging(node) {
    const nodeType = node.type || node.kind || "(unknown type)";
    let nodeName = String(node.name || node.id && (typeof node.id === "object" ? node.id.name : node.id) || node.key && (typeof node.key === "object" ? node.key.name : node.key) || node.value && (typeof node.value === "object" ? "" : String(node.value)) || node.operator || "");

    if (nodeName.length > 20) {
      nodeName = nodeName.slice(0, 19) + "…";
    }

    return nodeType + (nodeName ? " " + nodeName : "");
  }

  var util = {
    inferParserByLanguage,
    getStringWidth: getStringWidth$1,
    getMaxContinuousCount,
    getMinNotPresentContinuousCount,
    getPenultimate,
    getLast: getLast_1,
    getNextNonSpaceNonCommentCharacterIndexWithStartIndex,
    getNextNonSpaceNonCommentCharacterIndex,
    getNextNonSpaceNonCommentCharacter,
    skip,
    skipWhitespace,
    skipSpaces,
    skipToLineEnd,
    skipEverythingButNewLine,
    skipInlineComment,
    skipTrailingComment,
    skipNewline,
    isNextLineEmptyAfterIndex,
    isNextLineEmpty,
    isPreviousLineEmpty,
    hasNewline,
    hasNewlineInRange,
    hasSpaces,
    getAlignmentSize,
    getIndentSize,
    getPreferredQuote,
    printString,
    printNumber,
    makeString,
    addLeadingComment,
    addDanglingComment,
    addTrailingComment,
    isFrontMatterNode,
    getShebang,
    isNonEmptyArray,
    createGroupIdMapper
  };

  function guessEndOfLine(text) {
    const index = text.indexOf("\r");

    if (index >= 0) {
      return text.charAt(index + 1) === "\n" ? "crlf" : "cr";
    }

    return "lf";
  }

  function convertEndOfLineToChars$1(value) {
    switch (value) {
      case "cr":
        return "\r";

      case "crlf":
        return "\r\n";

      default:
        return "\n";
    }
  }

  function countEndOfLineChars(text, eol) {
    let regex;

    if (eol === "\n") {
      regex = /\n/g;
    } else if (eol === "\r") {
      regex = /\r/g;
    } else if (eol === "\r\n") {
      regex = /\r\n/g;
    } else {
      throw new Error(`Unexpected "eol" ${JSON.stringify(eol)}.`);
    }

    const endOfLines = text.match(regex);
    return endOfLines ? endOfLines.length : 0;
  }

  function normalizeEndOfLine(text) {
    return text.replace(/\r\n?/g, "\n");
  }

  var endOfLine = {
    guessEndOfLine,
    convertEndOfLineToChars: convertEndOfLineToChars$1,
    countEndOfLineChars,
    normalizeEndOfLine
  };

  const {
    literalline,
    join
  } = docBuilders;

  const isConcat$2 = doc => Array.isArray(doc) || doc && doc.type === "concat";

  const getDocParts$2 = doc => {
    if (Array.isArray(doc)) {
      return doc;
    }


    if (doc.type !== "concat" && doc.type !== "fill") {
      throw new Error("Expect doc type to be `concat` or `fill`.");
    }

    return doc.parts;
  };


  const traverseDocOnExitStackMarker = {};

  function traverseDoc(doc, onEnter, onExit, shouldTraverseConditionalGroups) {
    const docsStack = [doc];

    while (docsStack.length > 0) {
      const doc = docsStack.pop();

      if (doc === traverseDocOnExitStackMarker) {
        onExit(docsStack.pop());
        continue;
      }

      if (onExit) {
        docsStack.push(doc, traverseDocOnExitStackMarker);
      }

      if (
      !onEnter || onEnter(doc) !== false) {
        if (isConcat$2(doc) || doc.type === "fill") {
          const parts = getDocParts$2(doc);

          for (let ic = parts.length, i = ic - 1; i >= 0; --i) {
            docsStack.push(parts[i]);
          }
        } else if (doc.type === "if-break") {
          if (doc.flatContents) {
            docsStack.push(doc.flatContents);
          }

          if (doc.breakContents) {
            docsStack.push(doc.breakContents);
          }
        } else if (doc.type === "group" && doc.expandedStates) {
          if (shouldTraverseConditionalGroups) {
            for (let ic = doc.expandedStates.length, i = ic - 1; i >= 0; --i) {
              docsStack.push(doc.expandedStates[i]);
            }
          } else {
            docsStack.push(doc.contents);
          }
        } else if (doc.contents) {
          docsStack.push(doc.contents);
        }
      }
    }
  }

  function mapDoc(doc, cb) {
    const mapped = new Map();
    return rec(doc);

    function rec(doc) {
      if (mapped.has(doc)) {
        return mapped.get(doc);
      }

      const result = process(doc);
      mapped.set(doc, result);
      return result;
    }

    function process(doc) {
      if (Array.isArray(doc)) {
        return cb(doc.map(rec));
      }

      if (doc.type === "concat" || doc.type === "fill") {
        const parts = doc.parts.map(rec);
        return cb(Object.assign(Object.assign({}, doc), {}, {
          parts
        }));
      }

      if (doc.type === "if-break") {
        const breakContents = doc.breakContents && rec(doc.breakContents);
        const flatContents = doc.flatContents && rec(doc.flatContents);
        return cb(Object.assign(Object.assign({}, doc), {}, {
          breakContents,
          flatContents
        }));
      }

      if (doc.type === "group" && doc.expandedStates) {
        const expandedStates = doc.expandedStates.map(rec);
        const contents = expandedStates[0];
        return cb(Object.assign(Object.assign({}, doc), {}, {
          contents,
          expandedStates
        }));
      }

      if (doc.contents) {
        const contents = rec(doc.contents);
        return cb(Object.assign(Object.assign({}, doc), {}, {
          contents
        }));
      }

      return cb(doc);
    }
  }

  function findInDoc(doc, fn, defaultValue) {
    let result = defaultValue;
    let hasStopped = false;

    function findInDocOnEnterFn(doc) {
      const maybeResult = fn(doc);

      if (maybeResult !== undefined) {
        hasStopped = true;
        result = maybeResult;
      }

      if (hasStopped) {
        return false;
      }
    }

    traverseDoc(doc, findInDocOnEnterFn);
    return result;
  }

  function willBreakFn(doc) {
    if (doc.type === "group" && doc.break) {
      return true;
    }

    if (doc.type === "line" && doc.hard) {
      return true;
    }

    if (doc.type === "break-parent") {
      return true;
    }
  }

  function willBreak(doc) {
    return findInDoc(doc, willBreakFn, false);
  }

  function breakParentGroup(groupStack) {
    if (groupStack.length > 0) {
      const parentGroup = getLast_1(groupStack);

      if (!parentGroup.expandedStates && !parentGroup.break) {
        parentGroup.break = "propagated";
      }
    }

    return null;
  }

  function propagateBreaks(doc) {
    const alreadyVisitedSet = new Set();
    const groupStack = [];

    function propagateBreaksOnEnterFn(doc) {
      if (doc.type === "break-parent") {
        breakParentGroup(groupStack);
      }

      if (doc.type === "group") {
        groupStack.push(doc);

        if (alreadyVisitedSet.has(doc)) {
          return false;
        }

        alreadyVisitedSet.add(doc);
      }
    }

    function propagateBreaksOnExitFn(doc) {
      if (doc.type === "group") {
        const group = groupStack.pop();

        if (group.break) {
          breakParentGroup(groupStack);
        }
      }
    }

    traverseDoc(doc, propagateBreaksOnEnterFn, propagateBreaksOnExitFn,
    true);
  }

  function removeLinesFn(doc) {
    if (doc.type === "line" && !doc.hard) {
      return doc.soft ? "" : " ";
    }

    if (doc.type === "if-break") {
      return doc.flatContents || "";
    }

    return doc;
  }

  function removeLines(doc) {
    return mapDoc(doc, removeLinesFn);
  }

  const isHardline = (doc, nextDoc) => doc && doc.type === "line" && doc.hard && nextDoc && nextDoc.type === "break-parent";

  function stripDocTrailingHardlineFromDoc(doc) {
    if (!doc) {
      return doc;
    }

    if (isConcat$2(doc) || doc.type === "fill") {
      const parts = getDocParts$2(doc);

      while (parts.length > 1 && isHardline(...parts.slice(-2))) {
        parts.length -= 2;
      }

      if (parts.length > 0) {
        const lastPart = stripDocTrailingHardlineFromDoc(getLast_1(parts));
        parts[parts.length - 1] = lastPart;
      }

      return Array.isArray(doc) ? parts : Object.assign(Object.assign({}, doc), {}, {
        parts
      });
    }

    switch (doc.type) {
      case "align":
      case "indent":
      case "indent-if-break":
      case "group":
      case "line-suffix":
      case "label":
        {
          const contents = stripDocTrailingHardlineFromDoc(doc.contents);
          return Object.assign(Object.assign({}, doc), {}, {
            contents
          });
        }

      case "if-break":
        {
          const breakContents = stripDocTrailingHardlineFromDoc(doc.breakContents);
          const flatContents = stripDocTrailingHardlineFromDoc(doc.flatContents);
          return Object.assign(Object.assign({}, doc), {}, {
            breakContents,
            flatContents
          });
        }
    }

    return doc;
  }

  function stripTrailingHardline(doc) {
    return stripDocTrailingHardlineFromDoc(cleanDoc(doc));
  }

  function cleanDocFn(doc) {
    switch (doc.type) {
      case "fill":
        if (doc.parts.length === 0 || doc.parts.every(part => part === "")) {
          return "";
        }

        break;

      case "group":
        if (!doc.contents && !doc.id && !doc.break && !doc.expandedStates) {
          return "";
        }


        if (doc.contents.type === "group" && doc.contents.id === doc.id && doc.contents.break === doc.break && doc.contents.expandedStates === doc.expandedStates) {
          return doc.contents;
        }

        break;

      case "align":
      case "indent":
      case "indent-if-break":
      case "line-suffix":
        if (!doc.contents) {
          return "";
        }

        break;

      case "if-break":
        if (!doc.flatContents && !doc.breakContents) {
          return "";
        }

        break;
    }

    if (!isConcat$2(doc)) {
      return doc;
    }

    const parts = [];

    for (const part of getDocParts$2(doc)) {
      if (!part) {
        continue;
      }

      const [currentPart, ...restParts] = isConcat$2(part) ? getDocParts$2(part) : [part];

      if (typeof currentPart === "string" && typeof getLast_1(parts) === "string") {
        parts[parts.length - 1] += currentPart;
      } else {
        parts.push(currentPart);
      }

      parts.push(...restParts);
    }

    if (parts.length === 0) {
      return "";
    }

    if (parts.length === 1) {
      return parts[0];
    }

    return Array.isArray(doc) ? parts : Object.assign(Object.assign({}, doc), {}, {
      parts
    });
  }


  function cleanDoc(doc) {
    return mapDoc(doc, currentDoc => cleanDocFn(currentDoc));
  }

  function normalizeParts(parts) {
    const newParts = [];
    const restParts = parts.filter(Boolean);

    while (restParts.length > 0) {
      const part = restParts.shift();

      if (!part) {
        continue;
      }

      if (isConcat$2(part)) {
        restParts.unshift(...getDocParts$2(part));
        continue;
      }

      if (newParts.length > 0 && typeof getLast_1(newParts) === "string" && typeof part === "string") {
        newParts[newParts.length - 1] += part;
        continue;
      }

      newParts.push(part);
    }

    return newParts;
  }

  function normalizeDoc(doc) {
    return mapDoc(doc, currentDoc => {
      if (Array.isArray(currentDoc)) {
        return normalizeParts(currentDoc);
      }

      if (!currentDoc.parts) {
        return currentDoc;
      }

      return Object.assign(Object.assign({}, currentDoc), {}, {
        parts: normalizeParts(currentDoc.parts)
      });
    });
  }

  function replaceNewlinesWithLiterallines(doc) {
    return mapDoc(doc, currentDoc => typeof currentDoc === "string" && currentDoc.includes("\n") ? join(literalline, currentDoc.split("\n")) : currentDoc);
  }


  function replaceEndOfLineWith(text, replacement) {
    return join(replacement, text.split("\n")).parts;
  }

  var docUtils = {
    isConcat: isConcat$2,
    getDocParts: getDocParts$2,
    willBreak,
    traverseDoc,
    findInDoc,
    mapDoc,
    propagateBreaks,
    removeLines,
    stripTrailingHardline,
    normalizeParts,
    normalizeDoc,
    cleanDoc,
    replaceEndOfLineWith,
    replaceNewlinesWithLiterallines
  };

  const {
    getStringWidth,
    getLast
  } = util;
  const {
    convertEndOfLineToChars
  } = endOfLine;
  const {
    fill,
    cursor,
    indent
  } = docBuilders;
  const {
    isConcat: isConcat$1,
    getDocParts: getDocParts$1
  } = docUtils;

  let groupModeMap;
  const MODE_BREAK = 1;
  const MODE_FLAT = 2;

  function rootIndent() {
    return {
      value: "",
      length: 0,
      queue: []
    };
  }

  function makeIndent(ind, options) {
    return generateInd(ind, {
      type: "indent"
    }, options);
  }

  function makeAlign(indent, widthOrDoc, options) {
    if (widthOrDoc === Number.NEGATIVE_INFINITY) {
      return indent.root || rootIndent();
    }

    if (widthOrDoc < 0) {
      return generateInd(indent, {
        type: "dedent"
      }, options);
    }

    if (!widthOrDoc) {
      return indent;
    }

    if (widthOrDoc.type === "root") {
      return Object.assign(Object.assign({}, indent), {}, {
        root: indent
      });
    }

    const alignType = typeof widthOrDoc === "string" ? "stringAlign" : "numberAlign";
    return generateInd(indent, {
      type: alignType,
      n: widthOrDoc
    }, options);
  }

  function generateInd(ind, newPart, options) {
    const queue = newPart.type === "dedent" ? ind.queue.slice(0, -1) : [...ind.queue, newPart];
    let value = "";
    let length = 0;
    let lastTabs = 0;
    let lastSpaces = 0;

    for (const part of queue) {
      switch (part.type) {
        case "indent":
          flush();

          if (options.useTabs) {
            addTabs(1);
          } else {
            addSpaces(options.tabWidth);
          }

          break;

        case "stringAlign":
          flush();
          value += part.n;
          length += part.n.length;
          break;

        case "numberAlign":
          lastTabs += 1;
          lastSpaces += part.n;
          break;


        default:
          throw new Error(`Unexpected type '${part.type}'`);
      }
    }

    flushSpaces();
    return Object.assign(Object.assign({}, ind), {}, {
      value,
      length,
      queue
    });

    function addTabs(count) {
      value += "\t".repeat(count);
      length += options.tabWidth * count;
    }

    function addSpaces(count) {
      value += " ".repeat(count);
      length += count;
    }

    function flush() {
      if (options.useTabs) {
        flushTabs();
      } else {
        flushSpaces();
      }
    }

    function flushTabs() {
      if (lastTabs > 0) {
        addTabs(lastTabs);
      }

      resetLast();
    }

    function flushSpaces() {
      if (lastSpaces > 0) {
        addSpaces(lastSpaces);
      }

      resetLast();
    }

    function resetLast() {
      lastTabs = 0;
      lastSpaces = 0;
    }
  }

  function trim(out) {
    if (out.length === 0) {
      return 0;
    }

    let trimCount = 0;

    while (out.length > 0 && typeof getLast(out) === "string" && /^[\t ]*$/.test(getLast(out))) {
      trimCount += out.pop().length;
    }

    if (out.length > 0 && typeof getLast(out) === "string") {
      const trimmed = getLast(out).replace(/[\t ]*$/, "");
      trimCount += getLast(out).length - trimmed.length;
      out[out.length - 1] = trimmed;
    }

    return trimCount;
  }

  function fits(next, restCommands, width, options, hasLineSuffix, mustBeFlat) {
    let restIdx = restCommands.length;
    const cmds = [next];

    const out = [];

    while (width >= 0) {
      if (cmds.length === 0) {
        if (restIdx === 0) {
          return true;
        }

        cmds.push(restCommands[restIdx - 1]);
        restIdx--;
        continue;
      }

      const [ind, mode, doc] = cmds.pop();

      if (typeof doc === "string") {
        out.push(doc);
        width -= getStringWidth(doc);
      } else if (isConcat$1(doc)) {
        const parts = getDocParts$1(doc);

        for (let i = parts.length - 1; i >= 0; i--) {
          cmds.push([ind, mode, parts[i]]);
        }
      } else {
        switch (doc.type) {
          case "indent":
            cmds.push([makeIndent(ind, options), mode, doc.contents]);
            break;

          case "align":
            cmds.push([makeAlign(ind, doc.n, options), mode, doc.contents]);
            break;

          case "trim":
            width += trim(out);
            break;

          case "group":
            {
              if (mustBeFlat && doc.break) {
                return false;
              }

              const groupMode = doc.break ? MODE_BREAK : mode;
              cmds.push([ind, groupMode,
              doc.expandedStates && groupMode === MODE_BREAK ? getLast(doc.expandedStates) : doc.contents]);

              if (doc.id) {
                groupModeMap[doc.id] = groupMode;
              }

              break;
            }

          case "fill":
            for (let i = doc.parts.length - 1; i >= 0; i--) {
              cmds.push([ind, mode, doc.parts[i]]);
            }

            break;

          case "if-break":
          case "indent-if-break":
            {
              const groupMode = doc.groupId ? groupModeMap[doc.groupId] : mode;

              if (groupMode === MODE_BREAK) {
                const breakContents = doc.type === "if-break" ? doc.breakContents : doc.negate ? doc.contents : indent(doc.contents);

                if (breakContents) {
                  cmds.push([ind, mode, breakContents]);
                }
              }

              if (groupMode === MODE_FLAT) {
                const flatContents = doc.type === "if-break" ? doc.flatContents : doc.negate ? indent(doc.contents) : doc.contents;

                if (flatContents) {
                  cmds.push([ind, mode, flatContents]);
                }
              }

              break;
            }

          case "line":
            switch (mode) {
              case MODE_FLAT:
                if (!doc.hard) {
                  if (!doc.soft) {
                    out.push(" ");
                    width -= 1;
                  }

                  break;
                }

                return true;

              case MODE_BREAK:
                return true;
            }

            break;

          case "line-suffix":
            hasLineSuffix = true;
            break;

          case "line-suffix-boundary":
            if (hasLineSuffix) {
              return false;
            }

            break;

          case "label":
            cmds.push([ind, mode, doc.contents]);
            break;
        }
      }
    }

    return false;
  }

  function printDocToString(doc, options) {
    groupModeMap = {};
    const width = options.printWidth;
    const newLine = convertEndOfLineToChars(options.endOfLine);
    let pos = 0;

    const cmds = [[rootIndent(), MODE_BREAK, doc]];
    const out = [];
    let shouldRemeasure = false;
    let lineSuffix = [];

    while (cmds.length > 0) {
      const [ind, mode, doc] = cmds.pop();

      if (typeof doc === "string") {
        const formatted = newLine !== "\n" ? doc.replace(/\n/g, newLine) : doc;
        out.push(formatted);
        pos += getStringWidth(formatted);
      } else if (isConcat$1(doc)) {
        const parts = getDocParts$1(doc);

        for (let i = parts.length - 1; i >= 0; i--) {
          cmds.push([ind, mode, parts[i]]);
        }
      } else {
        switch (doc.type) {
          case "cursor":
            out.push(cursor.placeholder);
            break;

          case "indent":
            cmds.push([makeIndent(ind, options), mode, doc.contents]);
            break;

          case "align":
            cmds.push([makeAlign(ind, doc.n, options), mode, doc.contents]);
            break;

          case "trim":
            pos -= trim(out);
            break;

          case "group":
            switch (mode) {
              case MODE_FLAT:
                if (!shouldRemeasure) {
                  cmds.push([ind, doc.break ? MODE_BREAK : MODE_FLAT, doc.contents]);
                  break;
                }


              case MODE_BREAK:
                {
                  shouldRemeasure = false;
                  const next = [ind, MODE_FLAT, doc.contents];
                  const rem = width - pos;
                  const hasLineSuffix = lineSuffix.length > 0;

                  if (!doc.break && fits(next, cmds, rem, options, hasLineSuffix)) {
                    cmds.push(next);
                  } else {
                    if (doc.expandedStates) {
                      const mostExpanded = getLast(doc.expandedStates);

                      if (doc.break) {
                        cmds.push([ind, MODE_BREAK, mostExpanded]);
                        break;
                      } else {
                        for (let i = 1; i < doc.expandedStates.length + 1; i++) {
                          if (i >= doc.expandedStates.length) {
                            cmds.push([ind, MODE_BREAK, mostExpanded]);
                            break;
                          } else {
                            const state = doc.expandedStates[i];
                            const cmd = [ind, MODE_FLAT, state];

                            if (fits(cmd, cmds, rem, options, hasLineSuffix)) {
                              cmds.push(cmd);
                              break;
                            }
                          }
                        }
                      }
                    } else {
                      cmds.push([ind, MODE_BREAK, doc.contents]);
                    }
                  }

                  break;
                }
            }

            if (doc.id) {
              groupModeMap[doc.id] = getLast(cmds)[1];
            }

            break;

          case "fill":
            {
              const rem = width - pos;
              const {
                parts
              } = doc;

              if (parts.length === 0) {
                break;
              }

              const [content, whitespace] = parts;
              const contentFlatCmd = [ind, MODE_FLAT, content];
              const contentBreakCmd = [ind, MODE_BREAK, content];
              const contentFits = fits(contentFlatCmd, [], rem, options, lineSuffix.length > 0, true);

              if (parts.length === 1) {
                if (contentFits) {
                  cmds.push(contentFlatCmd);
                } else {
                  cmds.push(contentBreakCmd);
                }

                break;
              }

              const whitespaceFlatCmd = [ind, MODE_FLAT, whitespace];
              const whitespaceBreakCmd = [ind, MODE_BREAK, whitespace];

              if (parts.length === 2) {
                if (contentFits) {
                  cmds.push(whitespaceFlatCmd, contentFlatCmd);
                } else {
                  cmds.push(whitespaceBreakCmd, contentBreakCmd);
                }

                break;
              }


              parts.splice(0, 2);
              const remainingCmd = [ind, mode, fill(parts)];
              const secondContent = parts[0];
              const firstAndSecondContentFlatCmd = [ind, MODE_FLAT, [content, whitespace, secondContent]];
              const firstAndSecondContentFits = fits(firstAndSecondContentFlatCmd, [], rem, options, lineSuffix.length > 0, true);

              if (firstAndSecondContentFits) {
                cmds.push(remainingCmd, whitespaceFlatCmd, contentFlatCmd);
              } else if (contentFits) {
                cmds.push(remainingCmd, whitespaceBreakCmd, contentFlatCmd);
              } else {
                cmds.push(remainingCmd, whitespaceBreakCmd, contentBreakCmd);
              }

              break;
            }

          case "if-break":
          case "indent-if-break":
            {
              const groupMode = doc.groupId ? groupModeMap[doc.groupId] : mode;

              if (groupMode === MODE_BREAK) {
                const breakContents = doc.type === "if-break" ? doc.breakContents : doc.negate ? doc.contents : indent(doc.contents);

                if (breakContents) {
                  cmds.push([ind, mode, breakContents]);
                }
              }

              if (groupMode === MODE_FLAT) {
                const flatContents = doc.type === "if-break" ? doc.flatContents : doc.negate ? indent(doc.contents) : doc.contents;

                if (flatContents) {
                  cmds.push([ind, mode, flatContents]);
                }
              }

              break;
            }

          case "line-suffix":
            lineSuffix.push([ind, mode, doc.contents]);
            break;

          case "line-suffix-boundary":
            if (lineSuffix.length > 0) {
              cmds.push([ind, mode, {
                type: "line",
                hard: true
              }]);
            }

            break;

          case "line":
            switch (mode) {
              case MODE_FLAT:
                if (!doc.hard) {
                  if (!doc.soft) {
                    out.push(" ");
                    pos += 1;
                  }

                  break;
                } else {
                  shouldRemeasure = true;
                }


              case MODE_BREAK:
                if (lineSuffix.length > 0) {
                  cmds.push([ind, mode, doc], ...lineSuffix.reverse());
                  lineSuffix = [];
                  break;
                }

                if (doc.literal) {
                  if (ind.root) {
                    out.push(newLine, ind.root.value);
                    pos = ind.root.length;
                  } else {
                    out.push(newLine);
                    pos = 0;
                  }
                } else {
                  pos -= trim(out);
                  out.push(newLine + ind.value);
                  pos = ind.length;
                }

                break;
            }

            break;

          case "label":
            cmds.push([ind, mode, doc.contents]);
            break;
        }
      }


      if (cmds.length === 0 && lineSuffix.length > 0) {
        cmds.push(...lineSuffix.reverse());
        lineSuffix = [];
      }
    }

    const cursorPlaceholderIndex = out.indexOf(cursor.placeholder);

    if (cursorPlaceholderIndex !== -1) {
      const otherCursorPlaceholderIndex = out.indexOf(cursor.placeholder, cursorPlaceholderIndex + 1);
      const beforeCursor = out.slice(0, cursorPlaceholderIndex).join("");
      const aroundCursor = out.slice(cursorPlaceholderIndex + 1, otherCursorPlaceholderIndex).join("");
      const afterCursor = out.slice(otherCursorPlaceholderIndex + 1).join("");
      return {
        formatted: beforeCursor + aroundCursor + afterCursor,
        cursorNodeStart: beforeCursor.length,
        cursorNodeText: aroundCursor
      };
    }

    return {
      formatted: out.join("")
    };
  }

  var docPrinter = {
    printDocToString
  };

  const {
    isConcat,
    getDocParts
  } = docUtils;

  function flattenDoc(doc) {
    if (!doc) {
      return "";
    }

    if (isConcat(doc)) {
      const res = [];

      for (const part of getDocParts(doc)) {
        if (isConcat(part)) {
          res.push(...flattenDoc(part).parts);
        } else {
          const flattened = flattenDoc(part);

          if (flattened !== "") {
            res.push(flattened);
          }
        }
      }

      return {
        type: "concat",
        parts: res
      };
    }

    if (doc.type === "if-break") {
      return Object.assign(Object.assign({}, doc), {}, {
        breakContents: flattenDoc(doc.breakContents),
        flatContents: flattenDoc(doc.flatContents)
      });
    }

    if (doc.type === "group") {
      return Object.assign(Object.assign({}, doc), {}, {
        contents: flattenDoc(doc.contents),
        expandedStates: doc.expandedStates && doc.expandedStates.map(flattenDoc)
      });
    }

    if (doc.type === "fill") {
      return {
        type: "fill",
        parts: doc.parts.map(flattenDoc)
      };
    }

    if (doc.contents) {
      return Object.assign(Object.assign({}, doc), {}, {
        contents: flattenDoc(doc.contents)
      });
    }

    return doc;
  }

  function printDocToDebug(doc) {
    const printedSymbols = Object.create(null);

    const usedKeysForSymbols = new Set();
    return printDoc(flattenDoc(doc));

    function printDoc(doc, index, parentParts) {
      if (typeof doc === "string") {
        return JSON.stringify(doc);
      }

      if (isConcat(doc)) {
        const printed = getDocParts(doc).map(printDoc).filter(Boolean);
        return printed.length === 1 ? printed[0] : `[${printed.join(", ")}]`;
      }

      if (doc.type === "line") {
        const withBreakParent = Array.isArray(parentParts) && parentParts[index + 1] && parentParts[index + 1].type === "break-parent";

        if (doc.literal) {
          return withBreakParent ? "literalline" : "literallineWithoutBreakParent";
        }

        if (doc.hard) {
          return withBreakParent ? "hardline" : "hardlineWithoutBreakParent";
        }

        if (doc.soft) {
          return "softline";
        }

        return "line";
      }

      if (doc.type === "break-parent") {
        const afterHardline = Array.isArray(parentParts) && parentParts[index - 1] && parentParts[index - 1].type === "line" && parentParts[index - 1].hard;
        return afterHardline ? undefined : "breakParent";
      }

      if (doc.type === "trim") {
        return "trim";
      }

      if (doc.type === "indent") {
        return "indent(" + printDoc(doc.contents) + ")";
      }

      if (doc.type === "align") {
        return doc.n === Number.NEGATIVE_INFINITY ? "dedentToRoot(" + printDoc(doc.contents) + ")" : doc.n < 0 ? "dedent(" + printDoc(doc.contents) + ")" : doc.n.type === "root" ? "markAsRoot(" + printDoc(doc.contents) + ")" : "align(" + JSON.stringify(doc.n) + ", " + printDoc(doc.contents) + ")";
      }

      if (doc.type === "if-break") {
        return "ifBreak(" + printDoc(doc.breakContents) + (doc.flatContents ? ", " + printDoc(doc.flatContents) : "") + (doc.groupId ? (!doc.flatContents ? ', ""' : "") + `, { groupId: ${printGroupId(doc.groupId)} }` : "") + ")";
      }

      if (doc.type === "indent-if-break") {
        const optionsParts = [];

        if (doc.negate) {
          optionsParts.push("negate: true");
        }

        if (doc.groupId) {
          optionsParts.push(`groupId: ${printGroupId(doc.groupId)}`);
        }

        const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";
        return `indentIfBreak(${printDoc(doc.contents)}${options})`;
      }

      if (doc.type === "group") {
        const optionsParts = [];

        if (doc.break && doc.break !== "propagated") {
          optionsParts.push("shouldBreak: true");
        }

        if (doc.id) {
          optionsParts.push(`id: ${printGroupId(doc.id)}`);
        }

        const options = optionsParts.length > 0 ? `, { ${optionsParts.join(", ")} }` : "";

        if (doc.expandedStates) {
          return `conditionalGroup([${doc.expandedStates.map(part => printDoc(part)).join(",")}]${options})`;
        }

        return `group(${printDoc(doc.contents)}${options})`;
      }

      if (doc.type === "fill") {
        return `fill([${doc.parts.map(part => printDoc(part)).join(", ")}])`;
      }

      if (doc.type === "line-suffix") {
        return "lineSuffix(" + printDoc(doc.contents) + ")";
      }

      if (doc.type === "line-suffix-boundary") {
        return "lineSuffixBoundary";
      }

      if (doc.type === "label") {
        return `label(${JSON.stringify(doc.label)}, ${printDoc(doc.contents)})`;
      }

      throw new Error("Unknown doc type " + doc.type);
    }

    function printGroupId(id) {
      if (typeof id !== "symbol") {
        return JSON.stringify(String(id));
      }

      if (id in printedSymbols) {
        return printedSymbols[id];
      }


      const prefix = String(id).slice(7, -1) || "symbol";

      for (let counter = 0;; counter++) {
        const key = prefix + (counter > 0 ? ` #${counter}` : "");

        if (!usedKeysForSymbols.has(key)) {
          usedKeysForSymbols.add(key);
          return printedSymbols[id] = `Symbol.for(${JSON.stringify(key)})`;
        }
      }
    }
  }

  var docDebug = {
    printDocToDebug
  };



  var document = {
    builders: docBuilders,
    printer: docPrinter,
    utils: docUtils,
    debug: docDebug
  };

  return document;

})));

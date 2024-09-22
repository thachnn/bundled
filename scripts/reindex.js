#!/usr/bin/env node
'use strict';

const fs = require('fs');

let data = fs.readFileSync(process.argv[2], 'utf8');

const idMap = data.match(/(?<=^\/\/ )\b\d+$/gm);

if (idMap) {
  idMap.forEach((id, idx) => {
    if (+id !== idx)
      data = data
        .replace(new RegExp(`\\b(__webpack_require__\\()${id}\\)`, 'g'), `$1-${idx})`)
        .replace(new RegExp(`^// ${id}$`, 'gm'), '// -' + idx);
  });

  data = data.replace(/\b(__webpack_require__\()-(\d+\))/g, '$1$2').replace(/^(\/\/ )-(\d+)$/gm, '$1$2');

  console.log(data);
}

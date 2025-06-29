'use strict';

import pico from './posix';
import * as utils from './lib/utils';

function picomatch(glob, options, returnState = false) {
  // default to os.platform()
  if (options && options.windows == null) {
    // don't mutate the original options object
    options = { ...options, windows: utils.isWindows() };
  }

  return pico(glob, options, returnState);
}

Object.assign(picomatch, pico);
export default picomatch;

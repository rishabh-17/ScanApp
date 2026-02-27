const util = require('util');

if (!util.styleText) {
  util.styleText = (format, text) => {
    // Basic ANSI colors map
    const colors = {
      red: 31,
      green: 32,
      yellow: 33,
      blue: 34,
      magenta: 35,
      cyan: 36,
      white: 37,
      gray: 90,
      bold: 1,
      italic: 3,
      underline: 4,
    };
    
    // Handle array of formats
    const formats = Array.isArray(format) ? format : [format];
    
    let open = '';
    let close = '\x1b[0m';
    
    for (const fmt of formats) {
      if (colors[fmt]) {
        open += `\x1b[${colors[fmt]}m`;
      }
    }
    
    return `${open}${text}${close}`;
  };
}

if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function () {
    return this.slice().reverse();
  };
}
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function (compareFn) {
    return this.slice().sort(compareFn);
  };
}
if (!Array.prototype.toSpliced) {
  Array.prototype.toSpliced = function (start, deleteCount, ...items) {
    const copy = this.slice();
    copy.splice(start, deleteCount, ...items);
    return copy;
  };
}
if (!Array.prototype.with) {
  Array.prototype.with = function (index, value) {
    const copy = this.slice();
    copy[index] = value;
    return copy;
  };
}

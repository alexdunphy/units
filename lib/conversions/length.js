/* eslint-env browser, node */

'use strict';

// Imports
var utilities = require('./../utilities');
var viewport = require('viewport-dimensions');

var length = {
  '_default': 'px'
};

// Supported units:
// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw

length[''] = {
  'px': function(value, element, property) {
    return parseFloat(getComputedStyle(element, '').fontSize) * value;
  }
};

length['%'] = {
  'px': function(value, element, property) {
    return (value * utilities.getRelativeElementDimension(element, property)) / 100;
  }
};

length.ch = {
  'px': function(value, element, property) {
    return value * utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
  }
};

length.cm = {
  'px': function(value, element, property) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI);
  }
};

length.em = {
  'px': function(value, element, property) {
    return value * utilities.getElementFontSize(element);
  }
};

length.ex = {
  'px': function(value, element, property) {
    return value * utilities.getCreatedElementHeight(element, null, 'x');
  }
};

length['in'] = {
  'px': function(value, element, property) {
    return value * utilities.DPI;
  }
};

length.mm = {
  'px': function(value, element, property) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI) / 10;
  }
};

length.pc = {
  'px': function(value, element, property) {
    return value * ((utilities.DPI / 72) * 12);
  }
};

length.pt = {
  'px': function(value, element, property) {
    return value * utilities.DPI / 72;
  }
};

length.px = {
  '': function(value, element, property) {
    return value / parseFloat(getComputedStyle(element, '').fontSize);
  },

  '%': function(value, element, property) {
    return (value / utilities.ifZeroThenOne(utilities.getRelativeElementDimension(element, property))) * 100;
  },

  'ch': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
  },

  'cm': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.DPI) * 2.54;
  },

  'em': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(element));
  },

  'ex': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.getCreatedElementHeight(element, null, 'x'));
  },

  'in': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.DPI);
  },

  'mm': function(value, element, property) {
    return value * 2.54 / utilities.ifZeroThenOne(utilities.DPI) * 10;
  },

  'pc': function(value, element, property) {
    return value / ((utilities.DPI / 72) * 12);
  },

  'pt': function(value, element, property) {
    return value * 72 / utilities.DPI;
  },

  'rem': function(value, element, property) {
    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(document.documentElement));
  },

  'vh': function(value, element, property) {
    return value / utilities.ifZeroThenOne((viewport.height() / 100));
  },

  'vmax': function(value, element, property) {
    return value / utilities.ifZeroThenOne((viewport.max() / 100));
  },

  'vmin': function(value, element, property) {
    return value / utilities.ifZeroThenOne((viewport.min() / 100));
  },

  'vw': function(value, element, property) {
    return value / utilities.ifZeroThenOne((viewport.width() / 100));
  }
};

length.rem = {
  'px': function(value, element, property) {
    return value * utilities.getElementFontSize(document.documentElement);
  }
};

length.vh = {
  'px': function(value, element, property) {
    return value * (viewport.height() / 100);
  }
};

length.vmax = {
  'px': function(value, element, property) {
    return value * (viewport.max() / 100);
  }
};

length.vmin = {
  'px': function(value, element, property) {
    return value * (viewport.min() / 100);
  }
};

length.vw = {
  'px': function(value, element, property) {
    return value * (viewport.width() / 100);
  }
};

// Exports
module.exports = length;

/* eslint-env browser, node */

'use strict';

// Imports
var utilities = require('./../utilities');
var viewport = require('viewport-dimensions');

var length = {'_default': 'px'};

// Supported units:
// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw

length[''] = {
  'px': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getElementFontSize(element)

    return value * element;
  }
};

length['%'] = {
  'px': function(value, element, property) {
    if(typeof element !== 'number')
      element = utilities.getRelativeElementDimension(element, property)

    return value * element / 100;
  }
};

length.ch = {
  'px': function(value, element) {
    if(typeof element !== 'number')
      element = typeof document !== 'undefined'
        ? utilities.getCreatedElementWidth(element, null, '0')
        : 8;

    return value * utilities.ifZeroThenOne(element);
  }
};

length.cm = {
  'px': function(value) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI);
  }
};

length.em = {
  'px': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getElementFontSize(element)

    return value * element;
  }
};

length.ex = {
  'px': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getCreatedElementHeight(element, null, 'x')

    return value * element;
  }
};

length['in'] = {
  'px': function(value) {
    return value * utilities.DPI;
  }
};

length.mm = {
  'px': function(value) {
    return value / 2.54 * utilities.ifZeroThenOne(utilities.DPI) / 10;
  }
};

length.pc = {
  'px': function(value) {
    return value * utilities.DPI / 72 * 12;
  }
};

length.pt = {
  'px': function(value) {
    return value * utilities.DPI / 72;
  }
};

length.px = {
  '': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getElementFontSize(element)

    return value / element;
  },

  '%': function(value, element, property) {
    if(typeof element !== 'number')
      element = utilities.getRelativeElementDimension(element, property)

    return value / utilities.ifZeroThenOne(element) * 100;
  },

  'ch': function(value, element) {
    if(typeof element !== 'number')
      element = typeof document !== 'undefined'
        ? utilities.getCreatedElementWidth(element, null, '0')
        : 8;

    return value / utilities.ifZeroThenOne(element);
  },

  'cm': function(value) {
    return value / utilities.ifZeroThenOne(utilities.DPI) * 2.54;
  },

  'em': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getElementFontSize(element)

    return value / utilities.ifZeroThenOne(element);
  },

  'ex': function(value, element) {
    if(typeof element !== 'number')
      element = utilities.getCreatedElementHeight(element, null, 'x')

    return value / utilities.ifZeroThenOne(element);
  },

  'in': function(value) {
    return value / utilities.ifZeroThenOne(utilities.DPI);
  },

  'mm': function(value) {
    return value * 2.54 / utilities.ifZeroThenOne(utilities.DPI) * 10;
  },

  'pc': function(value) {
    return value / utilities.DPI / 72 * 12;
  },

  'pt': function(value) {
    return value * 72 / utilities.DPI;
  },

  'rem': function(value) {
    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(document.documentElement));
  },

  'vh': function(value) {
    return value / utilities.ifZeroThenOne(viewport.height() / 100);
  },

  'vmax': function(value) {
    return value / utilities.ifZeroThenOne(viewport.max() / 100);
  },

  'vmin': function(value) {
    return value / utilities.ifZeroThenOne(viewport.min() / 100);
  },

  'vw': function(value) {
    return value / utilities.ifZeroThenOne(viewport.width() / 100);
  }
};

length.rem = {
  'px': function(value) {
    return value * utilities.getElementFontSize(document.documentElement);
  }
};

length.vh = {
  'px': function(value) {
    return value * viewport.height() / 100;
  }
};

length.vmax = {
  'px': function(value) {
    return value * viewport.max() / 100;
  }
};

length.vmin = {
  'px': function(value) {
    return value * viewport.min() / 100;
  }
};

length.vw = {
  'px': function(value) {
    return value * viewport.width() / 100;
  }
};

// Exports
module.exports = length;

/* eslint-env browser, node */

'use strict';

// Imports
var utilities = require('./../utilities');
var viewport = require('viewport-dimensions');

var length = {'_default': 'px'};

// Supported units:
// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw


function idem(value) {
  return value;
}

function getCreatedElementWidth(element)
{
  if(typeof element === 'number') return element

  return (element != null && typeof document !== 'undefined')
    ? utilities.getCreatedElementWidth(element, null, '0')
    : utilities.CHAR_WIDTH;
}

function cm2px(value) {
  return in2px(value / 2.54);
}

function em2px(value, element) {
  if(typeof element !== 'number')
    element = utilities.getElementFontSize(element)

  return value * element;
}

function in2px(value) {
  return value * utilities.DPI;
}

function px2cm(value) {
  return px2in(value) * 2.54;
}

function px2em(value, element) {
  if(typeof element !== 'number')
    element = utilities.getElementFontSize(element)

  return value / utilities.ifZeroThenOne(element);
}

function pt2px(value) {
  return in2px(value / 72);
}

function px2in(value) {
  return value / utilities.ifZeroThenOne(utilities.DPI);
}

function px2pt(value) {
  return px2in(value) * 72;
}


length[''] = {
  'ch': idem,
  'px': em2px
};

length['%'] = {
  'px': function(value, element, property) {
    if(element == null) return

    if(typeof element !== 'number')
      element = utilities.getRelativeElementDimension(element, property)

    return value * element / 100;
  }
};

length.ch = {
  'em': idem,

  'px': function(value, element) {
    return value * getCreatedElementWidth(element);
  }
};

length.cm = {
  'px': cm2px
};

length.em = {
  'ch': idem,
  'px': em2px
};

length.ex = {
  'px': function(value, element) {
    if(element == null) return

    if(typeof element !== 'number')
      element = utilities.getCreatedElementHeight(element, null, 'x')

    return value * element;
  }
};

length['in'] = {
  'px': in2px
};

length.mm = {
  'px': function(value) {
    return cm2px(value / 10);
  }
};

length.pc = {
  'px': function(value) {
    return pt2px(value * 12);
  }
};

length.pt = {
  'px': pt2px
};

length.px = {
  '': px2em,

  '%': function(value, element, property) {
    if(element == null) return

    if(typeof element !== 'number')
      element = utilities.getRelativeElementDimension(element, property)

    return value / utilities.ifZeroThenOne(element) * 100;
  },

  'ch': function(value, element) {
    return value / utilities.ifZeroThenOne(getCreatedElementWidth(element));
  },

  'cm': px2cm,
  'em': px2em,

  'ex': function(value, element) {
    if(element == null) return

    if(typeof element !== 'number')
      element = utilities.getCreatedElementHeight(element, null, 'x')

    return value / utilities.ifZeroThenOne(element);
  },

  'in': px2in,

  'mm': function(value) {
    return px2cm(value) * 10;
  },

  'pc': function(value) {
    return px2pt(value) * 12;
  },

  'pt': px2pt,

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

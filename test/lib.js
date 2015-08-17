var units =
webpackJsonpunits([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	module.exports = __webpack_require__(2);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Imports
	var conversions = __webpack_require__(3);
	var isNumeric = __webpack_require__(8);

	var units = {};


	//  Public interface
	//------------------------------------------------------------------------------

	units.convert = function(to, value, element, property) {
	  var parts = units.parse(value, property);
	  var values;
	  var len;
	  var i;

	  if (Array.isArray(parts)) {
	    values = [];

	    if (!Array.isArray(to)) {
	      to = [to];
	    }

	    for (i = 0, len = parts.length; i < len; i++) {
	      if (typeof to[i] === 'undefined') {
	        to[i] = units.getDefaultUnit(property);
	      }

	      values.push(units.convert(to[i], parts[i].value + parts[i].unit, element, property));
	    }

	    return values;
	  }

	  return {
	    'value': to === parts.unit
	      ? parts.value
	      : units.processConversion(parts.unit, to, parts.value, element, property),
	    'unit': to
	  };
	};

	units.parse = function(value, property) {
	  var stringValue = value.toString().trim();
	  var parts;
	  var matches;
	  var values;
	  var len;
	  var i;

	  if (/\s/g.test(value)) {
	    values = stringValue.split(/\s/);
	    parts = [];

	    for (i = 0, len = values.length; i < len; i++) {
	      parts.push(units.parse(values[i], property));
	    }

	    return parts;
	  }

	  parts = {
	    'value': units.getDefaultValue(property),
	    'unit': units.getDefaultUnit(property)
	  };

	  matches = stringValue.toString().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);

	  if (typeof units.properties[property] !== 'undefined' && units.properties[property].defaultUnit !== parts.unit) {
	    parts.unit = units.properties[property].defaultUnit;
	  }

	  if (matches === null) {
	    isNumeric(value)
	      ? parts.value = value
	      : parts.unit = value;
	  } else {
	    parts.value = matches[1];
	    parts.unit = matches[2];
	  }

	  parts.value = parseFloat(parts.value);

	  return parts;
	};

	units.getDefault = function(property) {
	  return units.getDefaultValue(property) + units.getDefaultUnit(property);
	};

	units.getDefaultValue = function(property) {
	  return typeof units.properties[property] !== 'undefined' && typeof units.properties[property].defaultValue !== 'undefined'
	    ? units.properties[property].defaultValue
	    : 0;
	};

	units.getDefaultUnit = function(property) {
	  return typeof units.properties[property] !== 'undefined' && typeof units.properties[property].defaultUnit !== 'undefined'
	    ? units.properties[property].defaultUnit
	    : 'px';
	};


	//  Protected methods
	//------------------------------------------------------------------------------

	units.processConversion = function(fromUnits, toUnits, value, element, property) {
	  var type = units.getConversionType(fromUnits);
	  var method;

	  if (typeof type[fromUnits][toUnits] === 'function') {
	    method = type[fromUnits][toUnits];
	  } else {
	    method = type[type._default][toUnits];
	    value = type[fromUnits][type._default](value, element, property); // Use px conversion as an interstitial step
	  }

	  return method(value, element, property);
	};

	units.getConversionType = function(fromUnits) {
	  var property;
	  var type = null;

	  for (property in units.conversions) {
	    if (!units.conversions.hasOwnProperty(property)) continue;

	    if (typeof units.conversions[property][fromUnits] !== 'undefined') {
	      type = units.conversions[property];
	      break;
	    }
	  }

	  return type;
	};


	//  Expose conversion functions
	//------------------------------------------------------------------------------

	units.conversions = conversions;


	//  Properties with non default unit/value
	//------------------------------------------------------------------------------

	units.properties = {
	  'opacity': {
	    'defaultUnit': '',
	    'defaultValue': 1
	  },
	  'rotateX': {
	    'defaultUnit': 'deg'
	  },
	  'rotateY': {
	    'defaultUnit': 'deg'
	  },
	  'rotateZ': {
	    'defaultUnit': 'deg'
	  },
	  'skewX': {
	    'defaultUnit': 'deg'
	  },
	  'skewY': {
	    'defaultUnit': 'deg'
	  },
	  'scaleX': {
	    'defaultUnit': '',
	    'defaultValue': 1
	  },
	  'scaleY': {
	    'defaultUnit': '',
	    'defaultValue': 1
	  },
	  'scaleZ': {
	    'defaultUnit': '',
	    'defaultValue': 1
	  },
	  'line-height': {
	    'defaultUnit': '',
	    'defaultValue': 1
	  }
	};

	// Exports
	module.exports = units;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Exports
	module.exports = {
	  'length': __webpack_require__(4),
	  'angle': __webpack_require__(7)
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/* eslint-env browser, node */

	'use strict';

	// Imports
	var utilities = __webpack_require__(5);
	var viewport = __webpack_require__(6);

	var length = {
	  '_default': 'px'
	};

	// Supported units:
	// %, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw

	length[''] = {
	  'px': function(value, element, property) {
	    return parseFloat(getComputedStyle(element, '')['font-size']) * value;
	  }
	};

	length['%'] = {
	  'px': function(value, element, property) {
	    return (value * utilities.getRelativeElementDimension(element, property)) / 100;
	  }
	};

	length.ch = {
	  'px': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
	  }
	};

	length.cm = {
	  'px': function(value, element, property) {
	    return value / 2.54 * utilities.ifZeroThenOne(utilities.dpi);
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
	    return value * utilities.dpi;
	  }
	};

	length.mm = {
	  'px': function(value, element, property) {
	    return value / 2.54 * utilities.ifZeroThenOne(utilities.dpi) / 10;
	  }
	};

	length.pc = {
	  'px': function(value, element, property) {
	    return value * ((utilities.dpi / 72) * 12);
	  }
	};

	length.pt = {
	  'px': function(value, element, property) {
	    return value * utilities.dpi / 72;
	  }
	};

	length.px = {
	  '': function(value, element, property) {
	    return value / parseFloat(getComputedStyle(element, '')['font-size']);
	  },

	  '%': function(value, element, property) {
	    return (value / utilities.ifZeroThenOne(utilities.getRelativeElementDimension(element, property))) * 100;
	  },

	  'ch': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getCreatedElementWidth(element, null, '0'));
	  },

	  'cm': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.dpi) * 2.54;
	  },

	  'em': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(element));
	  },

	  'ex': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getCreatedElementHeight(element, null, 'x'));
	  },

	  'in': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.dpi);
	  },

	  'mm': function(value, element, property) {
	    return value * 2.54 / utilities.ifZeroThenOne(utilities.dpi) * 10;
	  },

	  'pc': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(element));
	  },

	  'pt': function(value, element, property) {
	    return value * 72 / 96;
	  },

	  'rem': function(value, element, property) {
	    return value / utilities.ifZeroThenOne(utilities.getElementFontSize(document.documentElement));
	  },

	  'vh': function(value, element, property) {
	    return value / utilities.ifZeroThenOne((viewport.getHeight() / 100));
	  },

	  'vmax': function(value, element, property) {
	    return value / utilities.ifZeroThenOne((viewport.getMax() / 100));
	  },

	  'vmin': function(value, element, property) {
	    return value / utilities.ifZeroThenOne((viewport.getMin() / 100));
	  },

	  'vw': function(value, element, property) {
	    return value / utilities.ifZeroThenOne((viewport.getWidth() / 100));
	  }
	};

	length.rem = {
	  'px': function(value, element, property) {
	    return value * utilities.getElementFontSize(document.documentElement);
	  }
	};

	length.vh = {
	  'px': function(value, element, property) {
	    return value * (viewport.getHeight() / 100);
	  }
	};

	length.vmax = {
	  'px': function(value, element, property) {
	    return value * (viewport.getMax() / 100);
	  }
	};

	length.vmin = {
	  'px': function(value, element, property) {
	    return value * (viewport.getMin() / 100);
	  }
	};

	length.vw = {
	  'px': function(value, element, property) {
	    return value * (viewport.getWidth() / 100);
	  }
	};

	// Exports
	module.exports = length;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* eslint-env browser, node */

	'use strict';

	var utilities = {};

	utilities.selfReferenceTriggers = [
	  'perspective',
	  'translate',
	  'translateX',
	  'translateY',
	  'translateZ',
	  'transformOrigin'
	];

	utilities.layoutYTriggers = [
	  'height',
	  'top',
	  'translateY'
	];

	utilities.getElementFontSize = function(element) {
	  return parseFloat(getComputedStyle(element, '').fontSize);
	};

	utilities.getCreatedElementDimensions = function(parent, properties, content) {
	  var element = document.createElement('div');
	  var dimensions;
	  var property;

	  element.style.position = 'absolute';
	  element.style.left = '100%';
	  element.style.top = '100%';
	  element.style.visibility = 'hidden';

	  if (typeof properties !== 'undefined') {
	    for (property in properties) {
	      if (!properties.hasOwnProperty(property)) continue;
	      element.style[property] = properties[property];
	    }
	  }

	  if (typeof content !== 'undefined') {
	    element.innerHTML = content;
	  }

	  parent.appendChild(element);

	  dimensions = [
	    element.offsetWidth,
	    element.offsetHeight
	  ];

	  parent.removeChild(element);

	  return dimensions;
	};

	utilities.getCreatedElementWidth = function(parent, properties, content) {
	  return utilities.getCreatedElementDimensions.apply(null, arguments)[0];
	};

	utilities.getCreatedElementHeight = function(parent, properties, content) {
	  return utilities.getCreatedElementDimensions.apply(null, arguments)[1];
	};

	utilities.getRelativeElementDimension = function(element, property) {
	  var reference;
	  var dimension;
	  var referenceComputedStyle;
	  var elementPosition;

	  reference = utilities.selfReferenceTriggers.indexOf(property) === -1
	    ? element.offsetParent || element.parentNode || document.body
	    : element;

	  dimension = utilities.layoutYTriggers.indexOf(property) !== -1
	    ? reference.offsetHeight
	    : reference.offsetWidth;

	  // If using ancestor as reference
	  if (reference !== element) {
	    elementPosition = getComputedStyle(element, '').position;

	    if (elementPosition === 'absolute' || elementPosition === 'fixed') {
	      referenceComputedStyle = getComputedStyle(reference, '');

	      dimension -= useXOrY === 'x'
	        ? parseFloat(computed.paddingRight) + parseFloat(computed.paddingLeft)
	        : parseFloat(computed.paddingTop) + parseFloat(computed.paddingBottom);
	    }
	  }

	  return dimension;
	};

	utilities.dpi = (function () {
	  // Preserve dpi-reliant conversion functionality when not running in browser environment
	  if (typeof window === 'undefined') {
	    return 96;
	  }

	  return utilities.getCreatedElementWidth(document.getElementsByTagName('body')[0], {
	    'width': '1in'
	  });
	}());

	/**
	 * ifZeroThenOne Get a non-zero value (to avoid division by zero in calling code)
	 * @param {Number} value Number to return, converting to one if zero
	 * @returns {undefined} No return value
	 */
	utilities.ifZeroThenOne = function(value) {
	  return value === 0
	    ? 1
	    : value;
	};

	// Exports
	module.exports = utilities;


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	/* eslint-env browser, node */

	'use strict';

	var angle = {
	  '_default': 'deg'
	};

	// Supported units:
	// deg, grad, rad, turn

	angle.deg = {
	  'grad': function(value, element, property) {
	    return value / 0.9;
	  },

	  'rad': function(value, element, property) {
	    return value * (Math.PI / 180);
	  },

	  'turn': function(value, element, property) {
	    return value / 360;
	  }
	};

	angle.grad = {
	  'deg': function(value, element, property) {
	    return value * 0.9;
	  }
	};

	angle.rad = {
	  'deg': function(value, element, property) {
	    return value / (Math.PI / 180);
	  }
	};

	angle.turn = {
	  'deg': function(value, element, property) {
	    return value * 360;
	  }
	};

	// Exports
	module.exports = angle;


/***/ }
]);
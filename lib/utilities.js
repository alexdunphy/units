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
    /* istanbul ignore next */
    return 96;
  }

  return utilities.getCreatedElementWidth(document.body, {
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

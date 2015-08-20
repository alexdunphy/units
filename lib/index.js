/* eslint-env browser, node */

'use strict';

// Imports
var conversions = require('./conversions');
var isNumeric = require('isnumeric/isNumeric');

var units = {};


//  Public interface
//------------------------------------------------------------------------------

units.convert = function(to, value, element, property) {
  var parts = units.parse(value, property);

  return {
    'value': to === parts.unit
      ? parts.value
      : units.processConversion(parts.unit, to, parts.value, element, property),
    'unit': to
  };
};

units.parse = function(value, property) {
  var stringValue = value.toString().trim();
  var matches = stringValue.toString().match(/^(-?[\d+\.\-]+)([a-z]+|%)$/i);
  var parts = {};

  if (matches === null) {
    if (isNumeric(value)) {
      parts.value = value;
      parts.unit = units.getDefaultUnit(property);
    } else {
      parts.value = units.getDefaultValue(property);
      parts.unit = value;
    }
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
  return typeof units.properties[property] !== 'undefined'
    ? units.properties[property].defaultValue
    : 0;
};

units.getDefaultUnit = function(property) {
  return typeof units.properties[property] !== 'undefined'
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

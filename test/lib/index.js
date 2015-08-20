/* eslint-env browser, mocha */
/* global expect, sinon, units */
/* eslint no-unused-expressions: 0 */

'use strict';

describe('units', function() {
  var lengthUnits = ['%', 'ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'rem', 'vh', 'vmax', 'vmin', 'vw'];
  var angleUnits = ['deg', 'grad', 'rad', 'turn'];
  var MAX_SAFE_INTEGER = 9007199254740991;

  it('should be defined as an object', function() {
    expect(units).to.be.an('object');
  });

  var parseValid = function(value, unit, property, valueNumber) {
    expect(units.parse(value + unit)).to.deep.equal({
      'value': typeof valueNumber === 'number'
        ? valueNumber
        : value,
      'unit': unit
    });
  };

  it('should parse valid length values', function() {
    for (var i = 0; i < lengthUnits.length; i++) {
      parseValid(0, lengthUnits[i], 'width');
      parseValid(1, lengthUnits[i], 'width');
      parseValid(-1, lengthUnits[i], 'width');
      parseValid(MAX_SAFE_INTEGER, lengthUnits[i], 'width');
      parseValid(-MAX_SAFE_INTEGER, lengthUnits[i], 'width');
      parseValid(0.000001, lengthUnits[i], 'width');
      parseValid('.000001', lengthUnits[i], 'width', 0.000001);
      parseValid(-0.000001, lengthUnits[i], 'width');
      parseValid('-.000001', lengthUnits[i], 'width', -0.000001);
    }
  });

  it('should parse valid angle values', function() {
    for (var i = 0; i < angleUnits.length; i++) {
      parseValid(0, angleUnits[i], 'rotateX');
      parseValid(1, angleUnits[i], 'rotateX');
      parseValid(-1, angleUnits[i], 'rotateX');
      parseValid(MAX_SAFE_INTEGER, angleUnits[i], 'rotateX');
      parseValid(-MAX_SAFE_INTEGER, angleUnits[i], 'rotateX');
      parseValid(0.000001, angleUnits[i], 'rotateX');
      parseValid('.000001', angleUnits[i], 'rotateX', 0.000001);
      parseValid(-0.000001, angleUnits[i], 'rotateX');
      parseValid('-.000001', angleUnits[i], 'rotateX', -0.000001);
    }
  });
});

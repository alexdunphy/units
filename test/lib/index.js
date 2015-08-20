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

  var parseValid = function(value, unit, property, valueNumber, valueUnit) {
    expect(units.parse(value + unit, property)).to.deep.equal({
      'value': typeof valueNumber === 'number'
        ? valueNumber
        : value,
      'unit': typeof valueUnit !== 'undefined'
        ? valueUnit
        : unit
    });
  };

  it('should parse valid length values in units#parse', function() {
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

  it('should parse valid angle values in units#parse', function() {
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

  it('should use correct default units when numeric values are passed to units#parse', function() {
    parseValid(0, '', 'width', null, 'px');
    parseValid(0, '', 'opacity', null, '');
    parseValid(0, '', 'rotateX', null, 'deg');
    parseValid(0, '', 'rotateY', null, 'deg');
    parseValid(0, '', 'rotateZ', null, 'deg');
    parseValid(0, '', 'skewX', null, 'deg');
    parseValid(0, '', 'skewY', null, 'deg');
    parseValid(0, '', 'scaleX', null, '');
    parseValid(0, '', 'scaleY', null, '');
    parseValid(0, '', 'scaleZ', null, '');
    parseValid(0, '', 'line-height', null, '');
  });

  it('should use correct default values when non-numeric values are passed to units#parse', function() {
    parseValid('', 'px', 'width', 0, 'px');
    parseValid('', '', 'opacity', 1, '');
    parseValid('', '', 'scaleX', 1, '');
    parseValid('', '', 'scaleY', 1, '');
    parseValid('', '', 'scaleZ', 1, '');
    parseValid('', '', 'line-height', 1, '');
  });

  it('should return correct defaults in units#getDefault', function() {
    expect(units.getDefault('width')).to.equal('0px');
    expect(units.getDefault('opacity')).to.equal('1');
    expect(units.getDefault('rotateX')).to.equal('0deg');
    expect(units.getDefault('rotateY')).to.equal('0deg');
    expect(units.getDefault('rotateZ')).to.equal('0deg');
    expect(units.getDefault('skewX')).to.equal('0deg');
    expect(units.getDefault('skewY')).to.equal('0deg');
    expect(units.getDefault('scaleX')).to.equal('1');
    expect(units.getDefault('scaleY')).to.equal('1');
    expect(units.getDefault('scaleZ')).to.equal('1');
    expect(units.getDefault('line-height')).to.equal('1');
  });
});

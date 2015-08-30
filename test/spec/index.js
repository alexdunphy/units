/* eslint-env browser, mocha */
/* global expect, units */
/* eslint no-unused-expressions: 0 */

'use strict';

describe('units', function() {
  // Setup
  //------------------------------------------------------------------------------

  var MAX_SAFE_INTEGER = 9007199254740991;
  var VALUE = 10;
  var DOCUMENT_FONT_SIZE = parseFloat(getComputedStyle(document.documentElement, '').fontSize);
  var element = document.createElement('div');
  var resetElement = function() {
    element.style.position = null;
    element.innerHTML = null;
    element.style.height = '100px';
    element.style.width = '100px';
  };
  var ELEMENT_FONT_SIZE;
  var DPI;

  document.body.appendChild(element);
  document.body.style.height = '100px';
  element.style.width = '1in';
  DPI = element.offsetWidth;
  ELEMENT_FONT_SIZE = parseFloat(getComputedStyle(element, '').fontSize);
  resetElement();


  // Library
  //------------------------------------------------------------------------------

  it('should be defined as an object', function() {
    expect(units).to.be.an('object');
  });


  // units#parse
  //------------------------------------------------------------------------------

  var parse = function(value, unit, property, valueNumber, valueUnit) {
    expect(units.parse(value + unit, property)).to.deep.equal({
      'value': typeof valueNumber === 'number'
        ? valueNumber
        : value,
      'unit': typeof valueUnit !== 'undefined'
        ? valueUnit
        : unit
    });

    expect(units.parse(value)).to.deep.equal({
      'value': typeof valueNumber === 'number'
        ? valueNumber
        : value,
      'unit': ''
    });

    expect(units.parse(unit)).to.deep.equal({
      'value': 0,
      'unit': typeof valueUnit !== 'undefined'
        ? valueUnit
        : unit
    });
  };

  it('should parse valid length values in units#parse', function() {
    var lengthUnits = ['%', 'ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'rem', 'vh', 'vmax', 'vmin', 'vw'];
    var i;

    for (i = 0; i < lengthUnits.length; i++) {
      parse(0, lengthUnits[i], 'width');
      parse(1, lengthUnits[i], 'width');
      parse(-1, lengthUnits[i], 'width');
      parse(MAX_SAFE_INTEGER, lengthUnits[i], 'width');
      parse(-MAX_SAFE_INTEGER, lengthUnits[i], 'width');
      parse(0.000001, lengthUnits[i], 'width');
      parse('.000001', lengthUnits[i], 'width', 0.000001);
      parse(-0.000001, lengthUnits[i], 'width');
      parse('-.000001', lengthUnits[i], 'width', -0.000001);
    }
  });

  it('should parse valid angle values in units#parse', function() {
    var angleUnits = ['deg', 'grad', 'rad', 'turn'];
    var i;

    for (i = 0; i < angleUnits.length; i++) {
      parse(0, angleUnits[i], 'rotateX');
      parse(1, angleUnits[i], 'rotateX');
      parse(-1, angleUnits[i], 'rotateX');
      parse(MAX_SAFE_INTEGER, angleUnits[i], 'rotateX');
      parse(-MAX_SAFE_INTEGER, angleUnits[i], 'rotateX');
      parse(0.000001, angleUnits[i], 'rotateX');
      parse('.000001', angleUnits[i], 'rotateX', 0.000001);
      parse(-0.000001, angleUnits[i], 'rotateX');
      parse('-.000001', angleUnits[i], 'rotateX', -0.000001);
    }
  });

  it('should use correct default values when non-numeric values are passed to units#parse', function() {
    parse('', 'px', 'width', 0, 'px');
  });


  // units#getDefault
  //------------------------------------------------------------------------------

  it('should return correct default values in units#getDefaultValue', function() {
    expect(units.getDefaultValue('width')).to.equal(0);
    expect(units.getDefaultValue('opacity')).to.equal(1);
    expect(units.getDefaultValue('scale')).to.equal(1);
    expect(units.getDefaultValue('scale3d')).to.equal(1);
    expect(units.getDefaultValue('scaleX')).to.equal(1);
    expect(units.getDefaultValue('scaleY')).to.equal(1);
    expect(units.getDefaultValue('scaleZ')).to.equal(1);
    expect(units.getDefaultValue('lineHeight')).to.equal(1);
  });

  it('should return correct default units in units#getDefaultUnit', function() {
    expect(units.getDefaultUnit('width')).to.equal('px');
    expect(units.getDefaultUnit('opacity')).to.equal('');
    expect(units.getDefaultUnit('rotate')).to.equal('deg');
    expect(units.getDefaultUnit('rotate3d')).to.equal('deg');
    expect(units.getDefaultUnit('rotateX')).to.equal('deg');
    expect(units.getDefaultUnit('rotateY')).to.equal('deg');
    expect(units.getDefaultUnit('rotateZ')).to.equal('deg');
    expect(units.getDefaultUnit('skew')).to.equal('deg');
    expect(units.getDefaultUnit('skewX')).to.equal('deg');
    expect(units.getDefaultUnit('skewY')).to.equal('deg');
    expect(units.getDefaultUnit('scale')).to.equal('');
    expect(units.getDefaultUnit('scaleX')).to.equal('');
    expect(units.getDefaultUnit('scaleY')).to.equal('');
    expect(units.getDefaultUnit('scaleZ')).to.equal('');
    expect(units.getDefaultUnit('lineHeight')).to.equal('');
  });


  // units#convert (length)
  //------------------------------------------------------------------------------

  var convert = function(to, value, property, expectedValue) {
    expect(units.convert(to, value, element, property)).to.equal(expectedValue);
  };

  it('should convert valid px (default) length units in units#convert', function() {
    convert('px', VALUE + 'px', 'width', VALUE);
    convert('', VALUE + 'px', 'width', VALUE / ELEMENT_FONT_SIZE);
    convert('%', VALUE + 'px', 'width', (VALUE / element.parentNode.offsetWidth) * 100);
    convert('cm', VALUE + 'px', 'width', VALUE / DPI * 2.54);
    convert('em', VALUE + 'px', 'width', VALUE / ELEMENT_FONT_SIZE);
    convert('in', VALUE + 'px', 'width', VALUE / DPI);
    convert('mm', VALUE + 'px', 'width', VALUE * 2.54 / DPI * 10);
    convert('pc', VALUE + 'px', 'width', VALUE / ((DPI / 72) * 12));
    convert('pt', VALUE + 'px', 'width', VALUE * 72 / DPI);
    convert('rem', VALUE + 'px', 'width', VALUE / DOCUMENT_FONT_SIZE);
    convert('vh', VALUE + 'px', 'width', VALUE / (document.documentElement.clientHeight / 100));
    convert('vmax', VALUE + 'px', 'width', VALUE / (Math.max(document.documentElement.clientHeight, document.documentElement.clientWidth) / 100));
    convert('vmin', VALUE + 'px', 'width', VALUE / (Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth) / 100));
    convert('vw', VALUE + 'px', 'width', VALUE / (document.documentElement.clientWidth / 100));

    // Setup + tests + tear-down for units dependent on element content
    element.style.width = null;
    element.style.height = null;
    element.style.position = 'absolute';
    element.innerHTML = '0';
    convert('ch', VALUE + 'px', 'width', VALUE / element.offsetWidth);
    element.innerHTML = 'x';
    convert('ex', VALUE + 'px', 'width', VALUE / element.offsetHeight);
    resetElement();

    // Cover utilities#getRelativeElementDimension branches
    convert('%', VALUE + 'px', 'translateY', (VALUE / element.offsetHeight) * 100);
    element.style.position = 'absolute';
    convert('%', VALUE + 'px', 'width', (VALUE / element.offsetParent.offsetWidth) * 100);
    convert('%', VALUE + 'px', 'height', (VALUE / element.offsetParent.offsetHeight) * 100);
    resetElement();

    // Cover utilities#ifZeroThenOne branches
    document.documentElement.style.fontSize = 0;
    convert('rem', VALUE + 'px', 'width', VALUE);
    document.documentElement.style.fontSize = null;
  });

  it('should convert valid blank length units in units#convert', function() {
    var px = ELEMENT_FONT_SIZE * VALUE;

    convert('px', VALUE + '', 'lineHeight', px);
    convert('%', VALUE + '', 'lineHeight', (px / element.parentNode.offsetWidth) * 100);
  });

  it('should convert valid % length units in units#convert', function() {
    convert('px', VALUE + '%', 'width', (VALUE * element.parentNode.offsetWidth) / 100);
  });

  it('should convert valid ch length units in units#convert', function() {
    element.style.width = null;
    element.style.position = 'absolute';
    element.innerHTML = '0';
    convert('px', VALUE + 'ch', 'width', VALUE * element.offsetWidth);
    resetElement();
  });

  it('should convert valid cm length units in units#convert', function() {
    convert('px', VALUE + 'cm', 'width', VALUE / 2.54 * DPI);
  });

  it('should convert valid em length units in units#convert', function() {
    convert('px', VALUE + 'em', 'width', VALUE * ELEMENT_FONT_SIZE);
  });

  it('should convert valid ex length units in units#convert', function() {
    element.style.height = null;
    element.style.position = 'absolute';
    element.innerHTML = 'x';
    convert('px', VALUE + 'ex', 'width', VALUE * element.offsetHeight);
    resetElement();
  });

  it('should convert valid in length units in units#convert', function() {
    convert('px', VALUE + 'in', 'width', VALUE * DPI);
  });

  it('should convert valid mm length units in units#convert', function() {
    convert('px', VALUE + 'mm', 'width', VALUE / 2.54 * DPI / 10);
  });

  it('should convert valid pc length units in units#convert', function() {
    convert('px', VALUE + 'pc', 'width', VALUE * ((DPI / 72) * 12));
  });

  it('should convert valid pt length units in units#convert', function() {
    convert('px', VALUE + 'pt', 'width', VALUE * DPI / 72);
  });

  it('should convert valid rem length units in units#convert', function() {
    convert('px', VALUE + 'rem', 'width', VALUE * DOCUMENT_FONT_SIZE);
  });

  it('should convert valid vh length units in units#convert', function() {
    convert('px', VALUE + 'vh', 'width', VALUE * (document.documentElement.clientHeight / 100));
  });

  it('should convert valid vmax length units in units#convert', function() {
    convert('px', VALUE + 'vmax', 'width', VALUE * (Math.max(document.documentElement.clientHeight, document.documentElement.clientWidth) / 100));
  });

  it('should convert valid vmin length units in units#convert', function() {
    convert('px', VALUE + 'vmin', 'width', VALUE * (Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth) / 100));
  });

  it('should convert valid vw length units in units#convert', function() {
    convert('px', VALUE + 'vw', 'width', VALUE * (document.documentElement.clientWidth / 100));
  });


  // units#convert (angle)
  //------------------------------------------------------------------------------

  it('should convert valid deg (default) length units in units#convert', function() {
    convert('grad', VALUE + 'deg', 'rotateZ', VALUE / 0.9);
    convert('rad', VALUE + 'deg', 'rotateZ', VALUE * (Math.PI / 180));
    convert('turn', VALUE + 'deg', 'rotateZ', VALUE / 360);
  });

  it('should convert valid grad length units in units#convert', function() {
    convert('deg', VALUE + 'grad', 'rotateZ', VALUE * 0.9);
  });

  it('should convert valid rad length units in units#convert', function() {
    convert('deg', VALUE + 'rad', 'rotateZ', VALUE / (Math.PI / 180));
  });

  it('should convert valid turn length units in units#convert', function() {
    convert('deg', VALUE + 'turn', 'rotateZ', VALUE * 360);
  });
});

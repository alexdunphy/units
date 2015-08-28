/* eslint-env browser, mocha */
/* global expect, sinon, units */
/* eslint no-unused-expressions: 0 */

'use strict';

describe('units', function() {
  // Setup
  //------------------------------------------------------------------------------

  var lengthUnits = ['%', 'ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'rem', 'vh', 'vmax', 'vmin', 'vw'];
  var angleUnits = ['deg', 'grad', 'rad', 'turn'];
  var MAX_SAFE_INTEGER = 9007199254740991;
  var VALUE = 10;
  var DOCUMENT_FONT_SIZE = parseFloat(getComputedStyle(document.documentElement, '').fontSize);
  var element = document.createElement('div');
  document.body.appendChild(element);
  document.body.style.height = '100px';
  element.style.width = '1in';
  var DPI = element.offsetWidth;
  var ELEMENT_FONT_SIZE = parseFloat(getComputedStyle(element, '').fontSize);
  var resetElement = function() {
    element.style.position = null;
    element.innerHTML = null;
    element.style.height = '100px';
    element.style.width = '100px';
  };
  resetElement();


  // Library
  //------------------------------------------------------------------------------

  it('should be defined as an object', function() {
    expect(units).to.be.an('object');
  });


  // units#parse
  //------------------------------------------------------------------------------

  var parse = function(value, unit, property, VALUENumber, VALUEUnit) {
    expect(units.parse(value + unit, property)).to.deep.equal({
      'value': typeof VALUENumber === 'number'
        ? VALUENumber
        : value,
      'unit': typeof VALUEUnit !== 'undefined'
        ? VALUEUnit
        : unit
    });
  };

  it('should parse valid length values in units#parse', function() {
    for (var i = 0; i < lengthUnits.length; i++) {
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
    for (var i = 0; i < angleUnits.length; i++) {
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

  it('should use correct default units when numeric values are passed to units#parse', function() {
    parse(0, '', 'width', null, 'px');
    parse(0, '', 'opacity', null, '');
    parse(0, '', 'rotateX', null, 'deg');
    parse(0, '', 'rotateY', null, 'deg');
    parse(0, '', 'rotateZ', null, 'deg');
    parse(0, '', 'skewX', null, 'deg');
    parse(0, '', 'skewY', null, 'deg');
    parse(0, '', 'scaleX', null, '');
    parse(0, '', 'scaleY', null, '');
    parse(0, '', 'scaleZ', null, '');
    parse(0, '', 'lineHeight', null, '');
  });

  it('should use correct default values when non-numeric values are passed to units#parse', function() {
    parse('', 'px', 'width', 0, 'px');
    parse('', '', 'opacity', 1, '');
    parse('', '', 'scaleX', 1, '');
    parse('', '', 'scaleY', 1, '');
    parse('', '', 'scaleZ', 1, '');
    parse('', '', 'lineHeight', 1, '');
  });


  // units#getDefault
  //------------------------------------------------------------------------------

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
    expect(units.getDefault('lineHeight')).to.equal('1');
  });


  // units#convert (length)
  //------------------------------------------------------------------------------

  var convert = function(to, value, property, expectedValue) {
    expect(units.convert(to, value, element, property)).to.deep.equal({
      'value': expectedValue,
      'unit': to
    });
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

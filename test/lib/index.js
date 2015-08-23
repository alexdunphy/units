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
  var element = document.createElement('div');
  document.body.appendChild(element);
  document.body.style.height = '100px';
  element.style.height = '100px';
  element.style.width = '1in';
  var DPI = element.offsetWidth;


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


  // units#convert
  //------------------------------------------------------------------------------

  var convert = function(to, value, property, expectedValue) {
    expect(units.convert(to, value, element, property)).to.deep.equal({
      'value': expectedValue,
      'unit': to
    });
  };

  it('should convert valid px length units in units#convert', function() {
    var value = 10;
    var elementFontSize = parseFloat(getComputedStyle(element, '').fontSize);

    convert('px', value + 'px', 'width', value);
    convert('', value + 'px', 'width', value / elementFontSize);
    convert('%', value + 'px', 'width', (value / element.parentNode.offsetWidth) * 100);
    convert('cm', value + 'px', 'width', value / DPI * 2.54);
    convert('em', value + 'px', 'width', value / elementFontSize);
    convert('in', value + 'px', 'width', value / DPI);
    convert('mm', value + 'px', 'width', value * 2.54 / DPI * 10);
    convert('pc', value + 'px', 'width', value / ((DPI / 72) * 12));
    convert('pt', value + 'px', 'width', value * 72 / DPI);
    convert('rem', value + 'px', 'width', value / parseFloat(getComputedStyle(document.documentElement, '').fontSize));

    // Setup + tests + tear-down for units dependent on element content
    element.style.width = null;
    element.style.height = null;
    element.style.position = 'absolute';
    element.innerHTML = '0';
    convert('ch', value + 'px', 'width', value / element.offsetWidth);
    element.innerHTML = 'x';
    convert('ex', value + 'px', 'width', value / element.offsetHeight);
    element.style.height = '100px';
    element.style.position = null;
    element.innerHTML = null;

    // Cover utilities#getRelativeElementDimension branches
    convert('%', value + 'px', 'translateY', (value / element.offsetHeight) * 100);
    element.style.position = 'absolute';
    convert('%', value + 'px', 'width', (value / element.offsetParent.offsetWidth) * 100);
    convert('%', value + 'px', 'height', (value / element.offsetParent.offsetHeight) * 100);
    element.style.position = null;

    // Cover utilities#ifZeroThenOne branches
    document.documentElement.style.fontSize = 0;
    convert('rem', value + 'px', 'width', value);
    document.documentElement.style.fontSize = null;
  });

  it('should convert valid blank length units in units#convert', function() {
    var value = 10;
    var px = parseFloat(getComputedStyle(element, '').fontSize) * value

    convert('px', value + '', 'lineHeight', px);
    convert('%', value + '', 'lineHeight', (px / element.parentNode.offsetWidth) * 100);
  });
});

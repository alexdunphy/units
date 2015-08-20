/* eslint-env browser, mocha */
/* global expect, sinon, units */
/* eslint no-unused-expressions: 0 */

'use strict';

describe('units', function() {
  var lengthUnits = ['%', 'ch', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'rem', 'vh', 'vmax', 'vmin', 'vw'];
  var parseValid = function(value, unit) {
    expect(units.parse(value + unit)).to.deep.equal({'value': value, 'unit': unit});
  };

  it('should be defined as an object', function() {
    expect(units).to.be.an('object');
  });

  it('should parse valid length values', function() {
    for (var i = 0; i < lengthUnits.length; i++) {
      parseValid(0, lengthUnits[i]);
      parseValid(1, lengthUnits[i]);
      parseValid(-1, lengthUnits[i]);
      parseValid(9007199254740991, lengthUnits[i]);
      parseValid(-9007199254740991, lengthUnits[i]);
      parseValid(0.000001, lengthUnits[i]);
      parseValid(-0.000001, lengthUnits[i]);
    }
  });
});

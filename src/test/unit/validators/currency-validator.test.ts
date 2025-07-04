import { isValidCurrency, isValidPay, isValidPension } from '../../../main/validators/currency-validator';

describe('Validation', () => {
  describe('isValidPension()', () => {
    it.each([
      { mockRef: '1', expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '20.', expected: 'invalid' },
      { mockRef: '100', expected: undefined },
      { mockRef: '20.00', expected: undefined },
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidPension(mockRef)).toEqual(expected);
    });
  });

  describe('isValidPay()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: '0', expected: 'minLengthRequired' },
      { mockRef: '1', expected: 'minLengthRequired' },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '-120', expected: 'notANumber' },
      { mockRef: '20,00', expected: 'notANumber' },
      { mockRef: '100,00', expected: 'notANumber' },
      { mockRef: '123456,890', expected: 'notANumber' },
      { mockRef: '1234567890123', expected: 'notANumber' },
      { mockRef: '123456789012.12', expected: 'minLengthRequired' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidPay(mockRef)).toEqual(expected);
    });
  });

  describe('isValidCurrency()', () => {
    it.each([
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
      { mockRef: '0', expected: undefined },
      { mockRef: '1', expected: undefined },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: 'a', expected: 'invalidCurrency' },
      { mockRef: '%', expected: 'invalidCurrency' },
      { mockRef: '25a', expected: 'invalidCurrency' },
      { mockRef: '-120', expected: 'invalidCurrency' },
      { mockRef: '20,00', expected: 'invalidCurrency' },
      { mockRef: '100,00', expected: 'invalidCurrency' },
      { mockRef: '123456,890', expected: 'invalidCurrency' },
      { mockRef: '1234567890123', expected: 'invalidCurrency' },
      { mockRef: '123456789012.12', expected: 'invalidCurrency' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });
});

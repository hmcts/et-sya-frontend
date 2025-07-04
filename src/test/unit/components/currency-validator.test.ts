import { isValidCurrency, isValidPay, isValidPension } from '../../../main/components/form/currency-validator';

describe('Validation', () => {
  describe('isValidPension()', () => {
    it.each([
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
      { mockRef: '1', expected: 'invalid' },
      { mockRef: '1.1', expected: 'invalid' },
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '20.', expected: 'invalid' },
      { mockRef: '10000', expected: undefined },
      { mockRef: '10,000', expected: 'invalid' },
      { mockRef: '10.1', expected: undefined },
      { mockRef: '10.12', expected: undefined },
      { mockRef: '10.123', expected: 'invalid' },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidPension(mockRef)).toEqual(expected);
    });
  });

  describe('isValidPay()', () => {
    it.each([
      { mockRef: undefined, expected: undefined },
      { mockRef: '', expected: undefined },
      { mockRef: '0', expected: 'minLengthRequired' },
      { mockRef: '1', expected: 'minLengthRequired' },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: '1,123,456,789.12', expected: undefined },
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '-120', expected: 'invalid' },
      { mockRef: '20,00', expected: 'invalid' },
      { mockRef: '100,00', expected: 'invalid' },
      { mockRef: '123456,890', expected: 'invalid' },
      { mockRef: '1234567890123', expected: 'invalid' },
      { mockRef: '123456789012.12', expected: 'minLengthRequired' },
      { mockRef: '10.1', expected: undefined },
      { mockRef: '10.12', expected: undefined },
      { mockRef: '10.123', expected: 'invalid' },
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
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '-120', expected: 'invalid' },
      { mockRef: '20,00', expected: 'invalid' },
      { mockRef: '100,00', expected: 'invalid' },
      { mockRef: '123456,890', expected: 'invalid' },
      { mockRef: '1234567890123', expected: 'invalid' },
      { mockRef: '123456789012.12', expected: 'invalid' },
      { mockRef: '10.1', expected: undefined },
      { mockRef: '10.12', expected: undefined },
      { mockRef: '10.123', expected: 'invalid' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });
});

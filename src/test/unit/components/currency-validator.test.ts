import { isValidCurrency, isValidDoubleCurrency } from '../../../main/components/form/currency-validator';

describe('Validation', () => {
  type ValidationTestCase = {
    mockRef: string;
    expected: string;
  };

  const emptyCases: ValidationTestCase[] = [
    { mockRef: undefined, expected: undefined },
    { mockRef: '', expected: undefined },
    { mockRef: '   ', expected: undefined },
  ];

  const validCases: ValidationTestCase[] = [
    { mockRef: '10', expected: undefined },
    { mockRef: ' 10 ', expected: undefined },
    { mockRef: '1000', expected: undefined },
    { mockRef: '1,000', expected: undefined },
    { mockRef: '10.4', expected: undefined },
    { mockRef: '10.40', expected: undefined },
    { mockRef: '10,000.40', expected: undefined },
    { mockRef: '1,123,456,789.12', expected: undefined },
    { mockRef: '1123456789.12', expected: undefined },
  ];

  const invalidCases: ValidationTestCase[] = [
    { mockRef: 'abc', expected: 'invalid' },
    { mockRef: '$10', expected: 'invalid' },
    { mockRef: '25a', expected: 'invalid' },
    { mockRef: '%', expected: 'invalid' },
    { mockRef: '-100', expected: 'invalid' },
    { mockRef: '10,00', expected: 'invalid' },
    { mockRef: '100.', expected: 'invalid' },
    { mockRef: '10.123', expected: 'invalid' },
    { mockRef: '1 0', expected: 'invalid' },
  ];

  const lessThan10Cases: ValidationTestCase[] = [
    { mockRef: '0', expected: 'minLengthRequired' },
    { mockRef: '1', expected: 'minLengthRequired' },
    { mockRef: '1.1', expected: 'minLengthRequired' },
    { mockRef: '9.99', expected: 'minLengthRequired' },
  ];

  describe('isValidDoubleCurrency()', () => {
    it.each([...emptyCases, ...validCases, ...invalidCases, ...lessThan10Cases])(
      'Check double currency amount is valid when %o',
      ({ mockRef, expected }) => {
        expect(isValidDoubleCurrency(mockRef)).toEqual(expected);
      }
    );
  });

  describe('isValidCurrency()', () => {
    it.each([...emptyCases, ...validCases, ...invalidCases])(
      'Check currency amount is valid when %o',
      ({ mockRef, expected }) => {
        expect(isValidCurrency(mockRef)).toEqual(expected);
      }
    );
  });
});

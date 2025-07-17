import { isValidCurrency } from '../../../main/components/form/currency-validator';

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
    { mockRef: '1000000', expected: undefined },
    { mockRef: '1,000', expected: undefined },
    { mockRef: '10.', expected: undefined },
    { mockRef: '10.1', expected: undefined },
    { mockRef: '10.12', expected: undefined },
    { mockRef: '10,000.40', expected: undefined },
    { mockRef: '0.01', expected: undefined },
    { mockRef: '9,999,999.99', expected: undefined },
    { mockRef: '9999999.99', expected: undefined },
    { mockRef: '£100', expected: undefined },
  ];

  const invalidCurrency: ValidationTestCase[] = [
    { mockRef: 'abc', expected: 'invalidCurrency' },
    { mockRef: '$10', expected: 'invalidCurrency' },
    { mockRef: '25a', expected: 'invalidCurrency' },
    { mockRef: '%', expected: 'invalidCurrency' },
    { mockRef: '-100', expected: 'invalidCurrency' },
    { mockRef: '10,00', expected: 'invalidCurrency' },
    { mockRef: '100,10.12', expected: 'invalidCurrency' },
    { mockRef: '1234,567', expected: 'invalidCurrency' },
    { mockRef: '10.123', expected: 'invalidCurrency' },
    { mockRef: '1 0', expected: 'invalidCurrency' },
    { mockRef: '0', expected: 'invalidCurrency' },
  ];

  const tooHighCurrency: ValidationTestCase[] = [
    { mockRef: '10,000,000', expected: 'tooHighCurrency' },
    { mockRef: '10000000', expected: 'tooHighCurrency' },
  ];

  describe('isValidCurrency()', () => {
    it.each([...emptyCases, ...validCases, ...invalidCurrency, ...tooHighCurrency])(
      'Check currency amount is valid when %o',
      ({ mockRef, expected }) => {
        expect(isValidCurrency(mockRef)).toEqual(expected);
      }
    );
  });
});

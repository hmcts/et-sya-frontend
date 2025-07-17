import {
  isValidAddressFirstLine,
  isValidAddressSecondLine,
  isValidCountryTownOrCity,
  isValidUKPostcode,
} from '../../../main/components/form/address-validator';
import { ValidationErrors } from '../../../main/definitions/constants';

describe('Validation', () => {
  describe('isValidUKPostcode()', () => {
    it.each([
      { mockRef: '', expected: ValidationErrors.REQUIRED },
      { mockRef: '1', expected: ValidationErrors.INVALID_VALUE },
      { mockRef: '12345', expected: ValidationErrors.INVALID_VALUE },
      { mockRef: '@£$£@$%', expected: ValidationErrors.INVALID_VALUE },
      { mockRef: 'not a postcode', expected: ValidationErrors.INVALID_VALUE },
      { mockRef: 'SW1A 1AA', expected: undefined },
      { mockRef: 'SW1A1AA', expected: undefined },
      { mockRef: 'sw1a1aa', expected: undefined },
      { mockRef: 'sw1a 1aa', expected: undefined },
      { mockRef: 'SW1A!1AA', expected: ValidationErrors.INVALID_VALUE },
    ])('validates the help with fees ref when %o', ({ mockRef, expected }) => {
      expect(isValidUKPostcode(mockRef, null)).toEqual(expected);
    });
  });
  describe('isValidAddressFirstLine', () => {
    it.each([
      { mockRef: '', expected: ValidationErrors.REQUIRED },
      { mockRef: 'a', expected: undefined },
      {
        mockRef:
          'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolore.' +
          'Aenean massa. Cum sociis natoque penatibus et magnis dis pa',
        expected: ValidationErrors.INVALID_VALUE,
      },
      { mockRef: "1 King's Road", expected: undefined },
      { mockRef: 'Kingston-upon-Thames', expected: undefined },
    ])('check work address line one is valid', ({ mockRef, expected }) => {
      expect(isValidAddressFirstLine(mockRef, null)).toEqual(expected);
    });
  });
  describe('isValidAddressSecondLine', () => {
    it.each([
      { mockRef: 'a', expected: undefined },
      {
        mockRef:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et al',
        expected: ValidationErrors.INVALID_VALUE,
      },
      { mockRef: "1 King's Road", expected: undefined },
      { mockRef: 'Kingston-upon-Thames', expected: undefined },
    ])('check work address line one is valid', ({ mockRef, expected }) => {
      expect(isValidAddressSecondLine(mockRef, null)).toEqual(expected);
    });
  });
  describe('isValidTownOrCity', () => {
    it.each([
      { mockRef: '', expected: ValidationErrors.REQUIRED },
      { mockRef: 'aa', expected: undefined },
      {
        mockRef: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
        expected: ValidationErrors.INVALID_VALUE,
      },
      { mockRef: "1 King's Road", expected: undefined },
      { mockRef: 'Kingston-upon-Thames', expected: undefined },
    ])('check work address town is valid', ({ mockRef, expected }) => {
      expect(isValidCountryTownOrCity(mockRef, null)).toEqual(expected);
    });
  });
});

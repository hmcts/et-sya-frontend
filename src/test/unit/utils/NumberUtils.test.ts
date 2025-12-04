import { DefaultValues } from '../../../main/definitions/constants';
import NumberUtils from '../../../main/utils/NumberUtils';

describe('NumberUtils tests', () => {
  describe('isEmptyOrZero tests', () => {
    it.each([
      { value: undefined, result: true },
      { value: 0, result: true },
      { value: null, result: true },
      { value: 1, result: false },
    ])('check if given value is empty or zero: %o', ({ value, result }) => {
      expect(NumberUtils.isEmptyOrZero(value)).toStrictEqual(result);
    });
  });
  describe('isNotEmptyOrZero tests', () => {
    it.each([
      { value: undefined, result: false },
      { value: 0, result: false },
      { value: null, result: false },
      { value: 1, result: true },
    ])('check if given value value is not empty or zero: %o', ({ value, result }) => {
      expect(NumberUtils.isNotEmptyOrZero(value)).toStrictEqual(result);
    });
  });
  describe('formatAcasNumberDashToUnderscore tests', () => {
    it.each([
      { value: undefined, result: DefaultValues.STRING_EMPTY },
      { value: DefaultValues.STRING_EMPTY, result: DefaultValues.STRING_EMPTY },
      { value: null, result: DefaultValues.STRING_EMPTY },
      { value: 'R123456/78/90', result: 'R123456_78_90' },
    ])('check if Acas Number is formatted to underscore', ({ value, result }) => {
      expect(NumberUtils.formatAcasNumberDashToUnderscore(value)).toStrictEqual(result);
    });
  });
  describe('formatAcasNumberDashToEmptyString tests', () => {
    it.each([
      { value: undefined, result: DefaultValues.STRING_EMPTY },
      { value: DefaultValues.STRING_EMPTY, result: DefaultValues.STRING_EMPTY },
      { value: null, result: DefaultValues.STRING_EMPTY },
      { value: 'R123456/78/90', result: 'R1234567890' },
    ])('check if Acas Number is formatted to empty string', ({ value, result }) => {
      expect(NumberUtils.formatAcasNumberDashToEmptyString(value)).toStrictEqual(result);
    });
  });
  describe('isNumericValue tests', () => {
    it.each([
      { value: undefined, result: false },
      { value: DefaultValues.STRING_EMPTY, result: false },
      { value: '0.1', result: true },
      { value: null, result: false },
      { value: 'dummy', result: false },
      { value: '1', result: true },
    ])('check if given string value is numeric: %o', ({ value, result }) => {
      expect(NumberUtils.isNumericValue(value)).toStrictEqual(result);
    });
  });
  describe('isNonNumericValue tests', () => {
    it.each([
      { value: undefined, result: true },
      { value: DefaultValues.STRING_EMPTY, result: true },
      { value: '0.1', result: false },
      { value: null, result: true },
      { value: 'dummy', result: true },
      { value: '1', result: false },
    ])('check if given string value is non numeric: %o', ({ value, result }) => {
      expect(NumberUtils.isNonNumericValue(value)).toStrictEqual(result);
    });
  });
  describe('isNotEmpty tests', () => {
    it.each([
      { value: undefined, result: false },
      { value: 0, result: true },
      { value: 0.1, result: true },
      { value: null, result: false },
      { value: 1, result: true },
      { value: 9999999999999, result: true },
    ])('check if given number value is not empty: %o', ({ value, result }) => {
      expect(NumberUtils.isNotEmpty(value)).toStrictEqual(result);
    });
  });
  describe('isEmpty tests', () => {
    it.each([
      { value: undefined, result: true },
      { value: 0, result: false },
      { value: 0.1, result: false },
      { value: null, result: true },
      { value: 1, result: false },
      { value: 9999999999999, result: false },
    ])('check if given number value is empty: %o', ({ value, result }) => {
      expect(NumberUtils.isEmpty(value)).toStrictEqual(result);
    });
  });
  describe('convertStringToNumber tests', () => {
    it.each([
      { value: undefined, result: undefined },
      { value: '', result: undefined },
      { value: ' ', result: undefined },
      { value: null, result: undefined },
      { value: 'test dummy value', result: undefined },
      { value: '12345value', result: undefined },
      { value: 'test12345', result: undefined },
      { value: '45000.3.2', result: undefined },
      { value: '9999999999999', result: 9999999999999 },
      { value: '45000.32', result: 45000.32 },
    ])('check if given string value is converted to number: %o', ({ value, result }) => {
      expect(NumberUtils.convertStringToNumber(value)).toStrictEqual(result);
    });
  });
});

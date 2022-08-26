import {
  arePayValuesNull,
  atLeastOneFieldIsChecked,
  hasValidFileFormat,
  isContent2500CharsOrLess,
  isContentBetween3And100Chars,
  isFieldFilledIn,
  isInvalidPostcode,
  isJobTitleValid,
  isOptionSelected,
  isPayIntervalNull,
  isValidAvgWeeklyHours,
  isValidCurrency,
  isValidNoticeLength,
  isValidPay,
  isValidPension,
  isValidTwoDigitInteger,
  isValidUKTelNumber,
  isWorkAddressLineOneValid,
  isWorkAddressTownValid,
  validateTitlePreference,
} from '../../../main/components/form/validator';

describe('Validation', () => {
  describe('isFieldFilledIn()', () => {
    it('Should check if value exist', () => {
      const isValid = isFieldFilledIn('Yes');

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = isFieldFilledIn(undefined);

      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isFieldFilledIn('    ');

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isContent2500CharsOrLess()', () => {
    it('should not warn when content is 2500 characters or less', () => {
      expect(isContent2500CharsOrLess(undefined)).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('')).toStrictEqual(undefined);
      expect(isContent2500CharsOrLess('1'.repeat(2500))).toStrictEqual(undefined);
    });

    it('should warn when content longer than 2500 characters', () => {
      expect(isContent2500CharsOrLess('1'.repeat(2501))).toStrictEqual('tooLong');
    });
  });

  describe('isContentBetween3And100Chars()', () => {
    it('should not warn when content is valid length', () => {
      expect(isContentBetween3And100Chars('abc')).toStrictEqual(undefined);
      expect(isContentBetween3And100Chars('1'.repeat(100))).toStrictEqual(undefined);
    });

    it('should warn when content shorter than 3 characters', () => {
      expect(isContentBetween3And100Chars('12')).toStrictEqual('invalidLength');
    });

    it('should warn when content longer than 100 characters', () => {
      expect(isContentBetween3And100Chars('1'.repeat(101))).toStrictEqual('invalidLength');
    });
  });

  describe('isOptionSelected()', () => {
    it('Should correctly identify an option was selected', () => {
      expect(isOptionSelected('anything')).toStrictEqual(undefined);
    });

    it('Should correctly identify an option was not selected', () => {
      expect(isOptionSelected('notSelected')).toStrictEqual('required');
    });
  });

  describe('atLeastOneFieldIsChecked()', () => {
    it('Should check if value exist', () => {
      const isValid = atLeastOneFieldIsChecked(['Yes']);

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const isValid = atLeastOneFieldIsChecked([]);

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('validateTitlePreference()', () => {
    it.each([
      { title: '', expectedError: undefined },
      { title: 'ab', expectedError: undefined },
      { title: 'a', expectedError: 'lengthError' },
      { title: 'a1', expectedError: 'numberError' },
      { title: ' 12', expectedError: 'numberError' },
      { title: '1a', expectedError: 'numberError' },
    ])('Should check if other title preference is valid: %o', ({ title, expectedError }) => {
      const isValid = validateTitlePreference(title);
      expect(isValid).toStrictEqual(expectedError);
    });
  });

  describe('isInvalidPostcode()', () => {
    it.each([
      { mockRef: '', expected: 'required' },
      { mockRef: '1', expected: 'invalid' },
      { mockRef: '12345', expected: 'invalid' },
      { mockRef: '@£$£@$%', expected: 'invalid' },
      { mockRef: 'not a postcode', expected: 'invalid' },
      { mockRef: 'SW1A 1AA', expected: undefined },
      { mockRef: 'SW1A1AA', expected: undefined },
      { mockRef: 'sw1a1aa', expected: undefined },
      { mockRef: 'sw1a 1aa', expected: undefined },
      { mockRef: 'SW1A!1AA', expected: 'invalid' },
    ])('validates the help with fees ref when %o', ({ mockRef, expected }) => {
      expect(isInvalidPostcode(mockRef)).toEqual(expected);
    });
  });

  describe('isValidUKTelNumber()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: null, expected: undefined },
      { mockRef: '12345', expected: 'invalid' },
      { mockRef: '@£$£@$%', expected: 'invalid' },
      { mockRef: 'not a phone number', expected: 'invalid' },
      { mockRef: '01234!567890', expected: 'invalid' },
      { mockRef: '00361234567890', expected: 'invalid' },
      { mockRef: '01234 567 890', expected: undefined },
      { mockRef: '01234 567890', expected: undefined },
      { mockRef: '+441234567890', expected: undefined },
      { mockRef: '+4401234567890', expected: undefined },
      { mockRef: '00441234567890', expected: undefined },
      { mockRef: '004401234567890', expected: undefined },
      { mockRef: '01234567890', expected: undefined },
      { mockRef: '1234567890', expected: undefined },
    ])('check telephone number validity when %o', ({ mockRef, expected }) => {
      expect(isValidUKTelNumber(mockRef)).toEqual(expected);
    });
  });

  describe('isJobTitleValid()', () => {
    it.each([
      { mockRef: '', expected: undefined },
      { mockRef: null, expected: undefined },
      { mockRef: 'a', expected: 'invalid-length' },
      {
        mockRef:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et al.',
        expected: 'invalid-length',
      },
      { mockRef: 'CEO', expected: undefined },
      { mockRef: 'Developer', expected: undefined },
      { mockRef: 'ex-mayor', expected: undefined },
      { mockRef: 'Lorry Driver', expected: undefined },
      { mockRef: 'I.T. technician', expected: undefined },
      { mockRef: 'Manager', expected: undefined },
    ])('check job title is valid', ({ mockRef, expected }) => {
      expect(isJobTitleValid(mockRef)).toEqual(expected);
    });
  });

  describe('isValidTwoDigitInteger()', () => {
    it.each([
      { mockRef: '', expected: 'invalid' },
      { mockRef: null, expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
      { mockRef: '20', expected: undefined },
    ])('check two digit input is valid', ({ mockRef, expected }) => {
      expect(isValidTwoDigitInteger(mockRef)).toEqual(expected);
    });
  });

  describe('isValidNoticeLength()', () => {
    it.each([
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '2a', expected: 'notANumber' },
    ])('check notice length is valid', ({ mockRef, expected }) => {
      expect(isValidNoticeLength(mockRef)).toEqual(expected);
    });
  });

  describe('isWorkAddressLineOneValid', () => {
    it.each([
      { mockRef: '', expected: 'required' },
      { mockRef: 'a', expected: undefined },
      {
        mockRef:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et al.',
        expected: 'required',
      },
      { mockRef: "1 King's Road", expected: undefined },
      { mockRef: 'Kingston-upon-Thames', expected: undefined },
    ])('check work address line one is valid', ({ mockRef, expected }) => {
      expect(isWorkAddressLineOneValid(mockRef)).toEqual(expected);
    });
  });

  describe('isWorkAddressTownValid', () => {
    it.each([
      { mockRef: '', expected: 'required' },
      { mockRef: 'aa', expected: 'required' },
      {
        mockRef: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
        expected: 'required',
      },
      { mockRef: "1 King's Road", expected: undefined },
      { mockRef: 'Kingston-upon-Thames', expected: undefined },
    ])('check work addrss town is valid', ({ mockRef, expected }) => {
      expect(isWorkAddressTownValid(mockRef)).toEqual(expected);
    });
  });

  describe('isValidAvgWeeklyHours()', () => {
    it.each([
      { mockRef: '00', expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '20.00', expected: 'invalid' },
      { mockRef: '169', expected: 'exceeded' },
      { mockRef: '-4', expected: 'negativeNumber' },
      { mockRef: '35', expected: undefined },
      { mockRef: '2', expected: undefined },
      { mockRef: null, expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidAvgWeeklyHours(mockRef)).toEqual(expected);
    });
  });

  describe('isValidPension()', () => {
    it.each([
      { mockRef: '1', expected: 'invalid' },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
      { mockRef: '20.', expected: 'invalid' },
      { mockRef: '100', expected: undefined },
      { mockRef: '20.00', expected: undefined },
      { mockRef: undefined, expected: 'required' },
      { mockRef: '', expected: 'required' },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidPension(mockRef)).toEqual(expected);
    });
  });

  describe('isPayIntervalNull()', () => {
    it('Should check if value exists', () => {
      const isValid = isPayIntervalNull('Weekly' || 'Monthly' || 'Annual');
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      const value = '';
      const isValid = isPayIntervalNull(value);
      expect(isValid).toStrictEqual('required');
    });
  });

  describe('arePayValuesNull()', () => {
    it('Should check if pay values exists', () => {
      const isValid = arePayValuesNull(['123', '123']);
      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if pay values do not exist', () => {
      const value = ['', ''];
      const isValid = arePayValuesNull(value);
      expect(isValid).toStrictEqual('required');
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

  describe('hasValidFileFormat()', () => {
    it.each([
      { fileName: undefined, expected: undefined },
      { fileName: '', expected: undefined },
      { fileName: '.csv', expected: undefined },
      { fileName: '..csv', expected: undefined },
      { fileName: 'file.csv', expected: undefined },
      { fileName: 'file.file.csv', expected: undefined },
      { fileName: 'file.csv.csv', expected: undefined },
      { fileName: 'file', expected: 'invalidFileFormat' },
      { fileName: 'csv', expected: 'invalidFileFormat' },
      { fileName: 'file.', expected: 'invalidFileFormat' },
      { fileName: 'file.invalidFormat', expected: 'invalidFileFormat' },
    ])('Check file format %o', ({ fileName, expected }) => {
      expect(hasValidFileFormat(fileName)).toEqual(expected);
    });
  });
});

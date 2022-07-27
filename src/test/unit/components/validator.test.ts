import {
  arePayValuesNull,
  atLeastOneFieldIsChecked,
  isFieldFilledIn,
  isInvalidPostcode,
  isJobTitleValid,
  isOptionSelected,
  isPayIntervalNull,
  isValidAvgWeeklyHours,
  isValidCurrency,
  isValidNoticeLength,
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
    it('Should check if value is not blank', () => {
      const isValid = validateTitlePreference('');
      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value does not contain number', () => {
      const isValid = validateTitlePreference('1234');
      expect(isValid).toStrictEqual('numberError');
    });

    it('Should check if value has no space is and number', () => {
      const isValid = validateTitlePreference('  1234');
      expect(isValid).toStrictEqual('numberError');
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
      { mockRef: '1', expected: 'minLengthRequired' },
      { mockRef: '20,00', expected: 'minLengthRequired' },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
      { mockRef: 'a', expected: 'notANumber' },
      { mockRef: '%', expected: 'notANumber' },
      { mockRef: '25a', expected: 'notANumber' },
    ])('Check pay amount is valid when %o', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });
});

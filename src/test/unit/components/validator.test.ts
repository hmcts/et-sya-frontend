import {
  areDateFieldsFilledIn,
  arePayValuesNull,
  atLeastOneFieldIsChecked,
  isDateInputInvalid,
  isFieldFilledIn,
  isFutureDate,
  isInvalidPostcode,
  isJobTitleValid,
  isPayIntervalNull,
  isValidAvgWeeklyHours,
  isValidCurrency,
  isValidInteger,
  isValidPension,
  isValidUKTelNumber,
  isWorkAddressLineOneValid,
  isWorkAddressTownValid,
} from '../../../main/components/form/validator';
import { CaseDate } from '../../../main/definitions/case';

describe('Validation', () => {
  describe('isFieldFilledIn()', () => {
    it('Should check if value exist', () => {
      const isValid = isFieldFilledIn('Yes');

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', () => {
      let value;
      const isValid = isFieldFilledIn(value);

      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value is only whitespaces', () => {
      const isValid = isFieldFilledIn('    ');

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('areFieldsFilledIn()', () => {
    it('Should check if values in object exist', () => {
      const isValid = areDateFieldsFilledIn({
        day: '1',
        month: '1',
        year: '1',
      });

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if values in object does not exist', () => {
      const isValid = areDateFieldsFilledIn({ day: '', month: '', year: '' });

      expect(isValid).toStrictEqual({
        error: 'required',
        fieldName: 'day',
      });
    });
  });

  describe('isFutureDate()', () => {
    it.each([
      { dateObj: new Date(), expected: undefined },
      { dateObj: undefined, expected: undefined },
    ])('Should check if date entered is future date when %o', ({ dateObj, expected }) => {
      const date = dateObj
        ? {
            day: dateObj.getUTCDate().toString(),
            month: dateObj.getUTCMonth().toString(),
            year: (dateObj.getUTCFullYear() - 1).toString(),
          }
        : undefined;
      let isValid = isFutureDate(date);

      expect(isValid).toStrictEqual(expected);

      if (date) {
        date.year += '1';
        isValid = isFutureDate(date);

        // eslint-disable-next-line jest/no-conditional-expect
        expect(isValid).toStrictEqual({
          error: 'invalidDateInFuture',
          fieldName: 'day',
        });
      }
    });
  });

  describe('isDateInputInvalid()', () => {
    const dateGreaterThan100 = new Date(1922, 3, 17);
    dateGreaterThan100.setFullYear(dateGreaterThan100.getFullYear() - 100);

    it.each([
      { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
      { date: { day: 31, month: 12, year: 2000 }, expected: undefined },

      {
        date: { day: 31, month: 12, year: 123 },
        expected: { error: 'invalidYear', fieldName: 'year' },
      },
      {
        date: {
          day: dateGreaterThan100.getDay(),
          month: dateGreaterThan100.getMonth(),
          year: dateGreaterThan100.getFullYear(),
        },
        expected: { error: 'invalidDateTooFarInPast', fieldName: 'year' },
      },
      {
        date: { day: 31, month: 12, year: 19 },
        expected: { error: 'invalidYear', fieldName: 'year' },
      },
      {
        date: { day: 1, month: 1, year: 1 },
        expected: { error: 'invalidYear', fieldName: 'year' },
      },
      {
        date: { day: -31, month: 12, year: 2000 },
        expected: { error: 'invalidDate', fieldName: 'day' },
      },
      {
        date: { day: 31, month: -12, year: 2000 },
        expected: { error: 'invalidDate', fieldName: 'month' },
      },
      {
        date: { day: 32, month: 12, year: 2000 },
        expected: { error: 'invalidDate', fieldName: 'day' },
      },
      {
        date: { day: 31, month: 13, year: 2000 },
        expected: { error: 'invalidDate', fieldName: 'month' },
      },
      {
        date: { day: 'no', month: '!%', year: 'way' },
        expected: { error: 'invalidDate', fieldName: 'day' },
      },
      { date: undefined, expected: 'invalidDate' },
      {
        date: { day: 31, month: 11, year: 2000 },
        expected: { error: 'invalidDate', fieldName: 'month' },
      },
      {
        date: { day: 29, month: 2, year: 2001 },
        expected: { error: 'invalidDate', fieldName: 'month' },
      },
    ])('checks dates validity when %o', ({ date, expected }) => {
      const isValid = isDateInputInvalid(date as unknown as CaseDate);

      expect(isValid).toStrictEqual(expected);
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

  describe('isValidInteger()', () => {
    it.each([
      { mockRef: '', expected: 'invalid' },
      { mockRef: null, expected: 'invalid' },
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '20', expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidInteger(mockRef)).toEqual(expected);
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

  describe('isPayIntervalNull()', () => {
    it('Should check if pay interval value is null', () => {
      const isValid = isPayIntervalNull(['']);

      expect(isValid).toStrictEqual(undefined);
    });
  });

  describe('arePayValuesNull()', () => {
    it('Should check if pay values are null', () => {
      const isValid = arePayValuesNull(['']);

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isValidAvgWeeklyHours()', () => {
    it.each([
      { mockRef: '00', expected: 'invalid' },
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '20.00', expected: 'invalid' },
      { mockRef: '169', expected: 'exceeded' },
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
      { mockRef: 'a', expected: 'invalid' },
      { mockRef: '%', expected: 'invalid' },
      { mockRef: '25a', expected: 'invalid' },
      { mockRef: '20.', expected: 'invalid' },
      { mockRef: '100', expected: undefined },
      { mockRef: '20.00', expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidPension(mockRef)).toEqual(expected);
    });
  });

  describe('isValidCurrency()', () => {
    it.each([
      { mockRef: '1', expected: 'required' },
      { mockRef: 'a', expected: 'required' },
      { mockRef: '%', expected: 'required' },
      { mockRef: '25a', expected: 'required' },
      { mockRef: '20,00', expected: 'required' },
      { mockRef: '100', expected: undefined },
      { mockRef: '10,000', expected: undefined },
    ])('check integer input is valid', ({ mockRef, expected }) => {
      expect(isValidCurrency(mockRef)).toEqual(expected);
    });
  });
});

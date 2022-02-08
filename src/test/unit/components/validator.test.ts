import {
  areDateFieldsFilledIn,
  atLeastOneFieldIsChecked,
  isDateInputInvalid,
  isFieldFilledIn,
  isFutureDate,
  isInvalidPostcode,
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
    it.each([
      { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
      { date: { day: 31, month: 12, year: 2000 }, expected: undefined },
      {
        date: { day: 31, month: 12, year: 123 },
        expected: { error: 'invalidYear', fieldName: 'year' },
      },
      {
        date: { day: 31, month: 12, year: 1800 },
        expected: { error: 'invalidDateTooFarInPast', fieldName: 'year' },
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
});

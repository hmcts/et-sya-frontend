import { CaseDate } from 'definitions/case';
import { areDateFieldsFilledIn, isDateInputInvalid, isFieldFilledIn, isFutureDate } from '../../../main/components/form/validator';

describe('Validation', () => {
  describe('isFieldFilledIn()', () => {
    it('Should check if value exist', async () => {
      const isValid = isFieldFilledIn('Yes');

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if value does not exist', async () => {
      let value;
      const isValid = isFieldFilledIn(value);

      expect(isValid).toStrictEqual('required');
    });

    it('Should check if value is only whitespaces', async () => {
      const isValid = isFieldFilledIn('    ');

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('areFieldsFilledIn()', () => {
    it('Should check if values in object exist', async () => {
      const isValid = areDateFieldsFilledIn({ day: '1', month: '1', year: '1' });

      expect(isValid).toStrictEqual(undefined);
    });

    it('Should check if values in object does not exist', async () => {
      const isValid = areDateFieldsFilledIn({ day: '', month: '', year: '' });

      expect(isValid).toStrictEqual('required');
    });
  });

  describe('isFutureDate()', () => {
    it('Should check if date entered is future date', async () => {
      const dateObj = new Date();
      const date = {
        day: dateObj.getUTCDate().toString(),
        month: dateObj.getUTCMonth().toString(),
        year: (dateObj.getUTCFullYear() - 1).toString(),
      };
      let isValid = isFutureDate(date);

      expect(isValid).toStrictEqual(undefined);

      date.year += '1';
      isValid = isFutureDate(date);

      expect(isValid).toStrictEqual('invalidDateInFuture');
    });
  });

  describe('isDateInputInvalid()', () => {
    it.each([
      { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
      { date: { day: 31, month: 12, year: 2000 }, expected: undefined },
      { date: { day: 31, month: 12, year: 123 }, expected: 'invalidYear' },
      { date: { day: 31, month: 12, year: 1800 }, expected: 'invalidDateTooFarInPast' },
      { date: { day: 1, month: 1, year: 1 }, expected: 'invalidYear' },
      { date: { day: -31, month: 12, year: 2000 }, expected: 'invalidDate' },
      { date: { day: 31, month: -12, year: 2000 }, expected: 'invalidDate' },
      { date: { day: 32, month: 12, year: 2000 }, expected: 'invalidDate' },
      { date: { day: 31, month: 13, year: 2000 }, expected: 'invalidDate' },
      { date: { day: 'no', month: '!%', year: 'way' }, expected: 'invalidDate' },
    ])('checks dates validity when %o', ({ date, expected }) => {
      const isValid = isDateInputInvalid(date as unknown as CaseDate);

      expect(isValid).toStrictEqual(expected);
    });
  });
});

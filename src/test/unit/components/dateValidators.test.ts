import {
  areDateFieldsFilledIn,
  isDateEmpty,
  isDateInputInvalid,
  isDateNotInFuture,
  isDateNotPartial,
  isDateTenYearsInFuture,
  isDateTenYearsInPast,
  isPastDate,
} from '../../../main/components/form/dateValidators';
import { CaseDate } from '../../../main/definitions/case';

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

describe('isDateNotPartial()', () => {
  it.each([
    { date: { day: '', month: '', year: '' }, error: undefined },
    { date: { day: '' }, error: undefined },
    { date: { month: '' }, error: undefined },
    { date: { year: '' }, error: undefined },
    { date: { day: '1', month: '1', year: '2000' }, error: undefined },
    { date: { day: '', month: '1', year: '2000' }, error: { error: 'dayRequired', fieldName: 'day' } },
    { date: { day: '1', month: '', year: '2000' }, error: { error: 'monthRequired', fieldName: 'month' } },
    { date: { day: '1', month: '1', year: '' }, error: { error: 'yearRequired', fieldName: 'year' } },
  ])('check if date is not partial: %o', ({ date, error }) => {
    expect(isDateNotPartial(date as unknown as CaseDate)).toStrictEqual(error);
  });
});

describe('isDateEmpty()', () => {
  it.each([
    { date: { day: '', month: '', year: '' }, empty: true },
    { date: { day: '' }, empty: true },
    { date: { day: undefined, month: undefined, year: undefined }, empty: true },
    { date: { day: undefined }, empty: true },
    { date: { day: undefined, month: '' }, empty: true },
    { date: { month: '' }, empty: true },
    { date: { year: '' }, empty: true },
    { date: { day: '1' }, empty: false },
    { date: { month: '1' }, empty: false },
    { date: { year: '1' }, empty: false },
    { date: { day: '1', month: '' }, empty: false },
    { date: { day: '1', month: undefined }, empty: false },
  ])('check if date is not partial: %o', ({ date, empty }) => {
    expect(isDateEmpty(date as unknown as CaseDate)).toStrictEqual(empty);
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
    let isValid = isDateNotInFuture(date);

    expect(isValid).toStrictEqual(expected);

    if (date) {
      date.year += '1';
      isValid = isDateNotInFuture(date);

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
      expected: { error: 'dayInvalid', fieldName: 'day' },
    },
    {
      date: { day: 31, month: -12, year: 2000 },
      expected: { error: 'monthInvalid', fieldName: 'month' },
    },
    {
      date: { day: 32, month: 12, year: 2000 },
      expected: { error: 'dayInvalid', fieldName: 'day' },
    },
    {
      date: { day: 31, month: 13, year: 2000 },
      expected: { error: 'monthInvalid', fieldName: 'month' },
    },
    {
      date: { day: 'no', month: '!%', year: 'way' },
      expected: { error: 'dayNotANumber', fieldName: 'day' },
    },
    {
      date: { day: 1, month: '!%', year: 2022 },
      expected: { error: 'monthNotANumber', fieldName: 'month' },
    },
    {
      date: { day: 1, month: 12, year: 'way' },
      expected: { error: 'yearNotANumber', fieldName: 'year' },
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

describe('isDateMoreThan10Years()', () => {
  const dateGreaterThan100 = new Date(1922, 3, 17);
  dateGreaterThan100.setFullYear(dateGreaterThan100.getFullYear() - 100);

  it.each([
    { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
    { date: { day: 31, month: 12, year: 2000 }, expected: undefined },
  ])('checks dates validity when %o', ({ date, expected }) => {
    const isValid = isDateInputInvalid(date as unknown as CaseDate);

    expect(isValid).toStrictEqual(expected);
  });
});

describe('isPastDate()', () => {
  it.each([
    { dateObj: new Date(), expected: undefined },
    { dateObj: undefined, expected: undefined },
  ])('Should check if date entered is past date when %o', ({ dateObj, expected }) => {
    const date = dateObj
      ? {
          day: dateObj.getUTCDate().toString(),
          month: dateObj.getUTCMonth().toString(),
          year: (dateObj.getUTCFullYear() + 1).toString(),
        }
      : undefined;
    let isValid = isPastDate(date);

    expect(isValid).toStrictEqual(expected);

    if (date) {
      date.year = '1';
      isValid = isPastDate(date);

      // eslint-disable-next-line jest/no-conditional-expect
      expect(isValid).toStrictEqual({
        error: 'invalidDateInPast',
        fieldName: 'day',
      });
    }
  });
});

describe('isDateTenYearsInPast()', () => {
  const currentDate = new Date();

  it.each([
    {
      dateObj: {
        day: currentDate.getDay(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear() - 5,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDay(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear() - 15,
      },
      expected: { error: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' },
    },
  ])('Should check if date entered is ten year in the past when %o', ({ dateObj, expected }) => {
    const isValid = isDateTenYearsInPast(dateObj as unknown as CaseDate);
    expect(isValid).toStrictEqual(expected);
  });
});

describe('isDateTenYearsInFuture()', () => {
  const currentDate = new Date();

  it.each([
    {
      dateObj: {
        day: currentDate.getDay(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear() + 5,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDay(),
        month: currentDate.getMonth(),
        year: currentDate.getFullYear() + 15,
      },
      expected: { error: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    },
  ])('Should check if date entered is ten year in the future when %o', ({ dateObj, expected }) => {
    const isValid = isDateTenYearsInFuture(dateObj as unknown as CaseDate);
    expect(isValid).toStrictEqual(expected);
  });
});

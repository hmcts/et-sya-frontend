import {
  areDateFieldsFilledIn,
  areDates10YearsApartOrMore,
  isDateEmpty,
  isDateInPast,
  isDateInputInvalid,
  isDateNotPartial,
  isDateTenYearsInFuture,
  isDateTenYearsInPast,
  isFirstDateBeforeSecond,
  isNotPastDate,
} from '../../../main/components/form/dateValidators';
import { CaseDate } from '../../../main/definitions/case';
import { convertDateToCaseDate } from '../../../main/definitions/dates';

describe('areDateFieldsFilledIn()', () => {
  it('Should check if values in object exist', () => {
    const isValid = areDateFieldsFilledIn({
      day: '1',
      month: '1',
      year: '1',
    });

    expect(isValid).toStrictEqual(undefined);
  });

  it('Should return required when no fields are filled in', () => {
    const isValid = areDateFieldsFilledIn(undefined);

    expect(isValid).toStrictEqual({
      error: 'required',
      fieldName: undefined,
    });
  });

  it('Should check if values in object does not exist', () => {
    const isValid = areDateFieldsFilledIn({ day: '', month: '', year: '' });

    expect(isValid).toStrictEqual({
      error: 'required',
      fieldName: 'day',
    });
  });

  it('Should check if one value in object does not exist', () => {
    const isValid = areDateFieldsFilledIn({ day: '5', month: '', year: '2000' });

    expect(isValid).toStrictEqual({
      error: 'monthRequired',
      fieldName: 'month',
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

describe('isDateInputInvalid()', () => {
  const date100YearsAgo = new Date();
  date100YearsAgo.setFullYear(date100YearsAgo.getFullYear() - 100);

  const dateMoreThan100YearsAgo = new Date();
  dateMoreThan100YearsAgo.setFullYear(dateMoreThan100YearsAgo.getFullYear() - 100);
  dateMoreThan100YearsAgo.setDate(dateMoreThan100YearsAgo.getDate() - 1);

  it.each([
    { date: { day: 1, month: 1, year: 1970 }, expected: undefined },
    { date: { day: 31, month: 12, year: 2000 }, expected: undefined },
    {
      date: { day: 31, month: 12, year: 123 },
      expected: { error: 'invalidYear', fieldName: 'year' },
    },
    {
      date: convertDateToCaseDate(date100YearsAgo),
      expected: undefined,
    },
    {
      date: convertDateToCaseDate(dateMoreThan100YearsAgo),
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

describe('areDates10YearsApartOrMore()', () => {
  it.each([
    {
      date1: { day: '1', month: '1', year: '1970' },
      date2: { day: '1', month: '1', year: '1970' },
      expected: { error: 'invalidDateTooRecent', fieldName: 'day' },
    },
    {
      date1: { day: '28', month: '7', year: '2022' },
      date2: { day: '29', month: '7', year: '2012' },
      expected: { error: 'invalidDateTooRecent', fieldName: 'day' },
    },
    {
      date1: { day: '29', month: '7', year: '2012' },
      date2: { day: '28', month: '7', year: '2022' },
      expected: { error: 'invalidDateTooRecent', fieldName: 'day' },
    },
    {
      date1: { day: '1', month: '1', year: '1970' },
      date2: { day: '1', month: '1', year: '1980' },
      expected: undefined,
    },
    {
      date1: { day: '31', month: '12', year: '2000' },
      date2: { day: '1', month: '1', year: '1970' },
      expected: undefined,
    },
    {
      date1: { day: '1', month: '1', year: '1970' },
      date2: { day: '31', month: '12', year: '2000' },
      expected: undefined,
    },
  ])('checks dates validity when %o', ({ date1, date2, expected }) => {
    expect(areDates10YearsApartOrMore(date1, date2)).toStrictEqual(expected);
  });
});

describe('isDateTenYearsInPast()', () => {
  const currentDate = new Date();

  it.each([
    {
      dateObj: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() - 5,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() - 10,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDate() - 1,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() - 10,
      },
      expected: { error: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' },
    },
    {
      dateObj: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
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
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() + 5,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() + 10,
      },
      expected: undefined,
    },
    {
      dateObj: {
        day: currentDate.getDate() + 1,
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() + 10,
      },
      expected: { error: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    },
    {
      dateObj: {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear() + 15,
      },
      expected: { error: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' },
    },
  ])('Should check if date entered is ten year in the future when %o', ({ dateObj, expected }) => {
    const isValid = isDateTenYearsInFuture(dateObj as unknown as CaseDate);
    expect(isValid).toStrictEqual(expected);
  });
});

describe('isDateInPast()', () => {
  const currDate = convertDateToCaseDate(new Date());
  it.each([
    { date: undefined, expected: undefined },
    { date: {} as CaseDate, expected: undefined },
    { date: { ...currDate, day: `${+currDate.day - 1}` }, undefined },
    { date: { ...currDate, month: `${+currDate.month - 1}` }, undefined },
    { date: { ...currDate, year: `${+currDate.year - 1}` }, undefined },
    { date: currDate, expected: { error: 'invalidDateInFuture', fieldName: 'day' } },
    {
      date: { ...currDate, day: `${+currDate.day + 1}` },
      expected: { error: 'invalidDateInFuture', fieldName: 'day' },
    },
    {
      date: { ...currDate, month: `${+currDate.month + 1}` },
      expected: { error: 'invalidDateInFuture', fieldName: 'day' },
    },
    {
      date: { ...currDate, year: `${+currDate.year + 1}` },
      expected: { error: 'invalidDateInFuture', fieldName: 'day' },
    },
  ])('Should check if date entered is past date when %o', ({ date, expected }) => {
    expect(isDateInPast(date)).toStrictEqual(expected);
  });
});

describe('isNotPastDate()', () => {
  const currDate = convertDateToCaseDate(new Date());
  it.each([
    { date: undefined, expected: undefined },
    { date: {} as CaseDate, expected: undefined },
    { date: currDate, expected: undefined },
    { date: { ...currDate, day: `${+currDate.day + 1}` }, expected: undefined },
    { date: { ...currDate, month: `${+currDate.month + 1}` }, expected: undefined },
    { date: { ...currDate, year: `${+currDate.year + 1}` }, expected: undefined },
    {
      date: { ...currDate, day: `${+currDate.day - 1}` },
      expected: { error: 'invalidDateInPast', fieldName: 'day' },
    },
    {
      date: { ...currDate, month: `${+currDate.month - 1}` },
      expected: { error: 'invalidDateInPast', fieldName: 'day' },
    },
    {
      date: { ...currDate, year: `${+currDate.year - 1}` },
      expected: { error: 'invalidDateInPast', fieldName: 'day' },
    },
  ])('Should check if date entered is not a date in the past when %o', ({ date, expected }) => {
    expect(isNotPastDate(date)).toStrictEqual(expected);
  });
});

describe('isFirstDateBeforeSecond()', () => {
  it.each([
    { date1: { day: '1', month: '1', year: '1970' }, date2: { day: '2', month: '1', year: '1970' }, isBefore: true },
    { date1: { day: '1', month: '1', year: '1970' }, date2: { day: '1', month: '2', year: '1970' }, isBefore: true },
    { date1: { day: '1', month: '1', year: '1970' }, date2: { day: '1', month: '1', year: '1971' }, isBefore: true },
    { date1: { day: '2', month: '1', year: '1970' }, date2: { day: '1', month: '1', year: '1970' }, isBefore: false },
    { date1: { day: '1', month: '2', year: '1970' }, date2: { day: '1', month: '1', year: '1970' }, isBefore: false },
    { date1: { day: '1', month: '1', year: '1971' }, date2: { day: '1', month: '1', year: '1970' }, isBefore: false },
    { date1: { day: '1', month: '1', year: '2000' }, date2: { day: '1', month: '1', year: '2000' }, isBefore: false },
    { date1: { day: '1', month: '12', year: '2000' }, date2: { day: '1', month: '12', year: '2000' }, isBefore: false },
  ])('should check correctly the order between the two dates: %o', ({ date1, date2, isBefore }) => {
    expect(isFirstDateBeforeSecond(date1, date2)).toBe(isBefore);
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

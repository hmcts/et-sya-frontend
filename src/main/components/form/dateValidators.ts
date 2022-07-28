import dayjs from 'dayjs';

import { CaseDate } from '../../definitions/case';
import { convertDateToCaseDate } from '../../definitions/dates';
import { InvalidField } from '../../definitions/form';

export type DateValidator = (
  value: CaseDate | undefined,
  value2?: CaseDate | undefined
) => void | string | InvalidField;

export const areDateFieldsFilledIn: DateValidator = (fields: CaseDate | undefined) => {
  if (
    typeof fields !== 'object' ||
    Object.keys(fields).length !== 3 ||
    Object.values(fields).every(e => e === null || e === '')
  ) {
    return {
      error: 'required',
      fieldName: fields ? Object.keys(fields)[0] : undefined,
    };
  }
  for (const [fieldName, field] of Object.entries(fields)) {
    if (!field) {
      return {
        error: `${fieldName}Required`,
        fieldName,
      };
    }
  }
};

export const isDateNotPartial: DateValidator = (date: CaseDate | undefined) => {
  if (date === undefined || isDateEmpty(date) || !Object.values(date).some(e => e === null || e === '')) {
    return;
  }
  for (const [fieldName, field] of Object.entries(date)) {
    if (!field) {
      return {
        error: `${fieldName}Required`,
        fieldName,
      };
    }
  }
};

export const isDateEmpty = (date: CaseDate): boolean => {
  return date === undefined || Object.values(date).every(e => e === undefined || e === '');
};

export const isDateInputInvalid: DateValidator = (date: CaseDate | undefined) => {
  const invalid = 'invalidDate';
  if (!date) {
    return invalid;
  }

  for (const [fieldName, value] of Object.entries(date)) {
    if (isNaN(+value)) {
      return {
        error: `${fieldName}NotANumber`,
        fieldName,
      };
    }
  }

  const year = parseInt(date.year, 10) || 0;
  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  if (day < 1 || day > 31) {
    return {
      error: 'dayInvalid',
      fieldName: 'day',
    };
  }

  if (month < 1 || month > 12) {
    return {
      error: 'monthInvalid',
      fieldName: 'month',
    };
  }

  if (year < 1000) {
    return {
      error: 'invalidYear',
      fieldName: 'year',
    };
  }

  const enteredDate = new Date(+date.year, +date.month, +date.day);
  const dateMinus100 = new Date();
  dateMinus100.setFullYear(dateMinus100.getFullYear() - 100);

  if (enteredDate < dateMinus100) {
    return { error: 'invalidDateTooFarInPast', fieldName: 'year' };
  }

  if (validateDayInTheMonth(date)) {
    return { error: invalid, fieldName: validateDayInTheMonth(date) as string };
  }
};

export const validateDayInTheMonth = (date: CaseDate): string | boolean => {
  const year = parseInt(date.year, 10) || 0;

  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  const jsDate = dayjs(new Date(year, month - 1, day));

  const yearValid = jsDate.year() === year;
  const monthValid = jsDate.month() + 1 === month;
  const dayValid = jsDate.date() === day;

  return !yearValid ? 'year' : !monthValid ? 'month' : !dayValid ? 'day' : false;
};

export const areDates10YearsApartOrMore: DateValidator = (
  caseDate1: CaseDate | undefined,
  caseDate2: CaseDate | undefined
) => {
  const date1 = new Date(+caseDate1.year, +caseDate1.month, +caseDate1.day);
  const date2 = new Date(+caseDate2.year, +caseDate2.month, +caseDate2.day);
  const yearsBetweenDates = Math.abs(new Date(date1.getTime() - date2.getTime()).getFullYear() - 1970);

  if (yearsBetweenDates < 10) {
    return { error: 'invalidDateTooRecent', fieldName: 'day' };
  }
};

export const isDateTenYearsInPast: DateValidator = (date: CaseDate | undefined) => {
  const enteredDate = new Date(+date.year, +date.month, +date.day);
  const dateMinus10 = new Date();
  dateMinus10.setFullYear(dateMinus10.getFullYear() - 10);

  if (enteredDate < dateMinus10) {
    return { error: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' };
  }
};

export const isDateNotInFuture: DateValidator = date => {
  if (!date) {
    return;
  }

  const enteredDate = new Date(+date.year, +date.month, +date.day);
  if (new Date() < enteredDate) {
    return { error: 'invalidDateInFuture', fieldName: 'day' };
  }
};

export const isDateTenYearsInFuture: DateValidator = (date: CaseDate | undefined) => {
  const enteredDate = new Date(+date.year, +date.month, +date.day);
  const datePlus10 = new Date();
  datePlus10.setFullYear(datePlus10.getFullYear() + 10);

  if (enteredDate > datePlus10) {
    return { error: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' };
  }
};

export const isPastDate: DateValidator = date => {
  if (!date) {
    return;
  }

  if (isFirstDateBeforeSecond(date, convertDateToCaseDate(new Date()))) {
    return { error: 'invalidDateInPast', fieldName: 'day' };
  }
};

export const isFirstDateBeforeSecond = (value1: CaseDate, value2: CaseDate): boolean => {
  return new Date(+value1.year, +value1.month, +value1.day) < new Date(+value2.year, +value2.month, +value2.day);
};

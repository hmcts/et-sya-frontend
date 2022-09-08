import dayjs from 'dayjs';

import { CaseDate } from '../../definitions/case';
import { InvalidField } from '../../definitions/form';

/**
 * All validators assume that date1 (and date2 if provided) are not null / undefined
 * and contain all the CaseData fields (though they might be empty strings).
 */
export type DateValidator = (date1: CaseDate, date2?: CaseDate) => void | string | InvalidField;

export const areDateFieldsFilledIn: DateValidator = (date: CaseDate) => {
  if (isDateEmpty(date)) {
    return { error: 'required', fieldName: 'day' };
  }

  return getErrorsForEmptyFields(date);
};

export const isDateNotPartial: DateValidator = (date: CaseDate) => {
  if (isDateEmpty(date) || Object.values(date).every(e => e !== '')) {
    return;
  }

  return getErrorsForEmptyFields(date);
};

const getErrorsForEmptyFields: DateValidator = (date: CaseDate) => {
  for (const [fieldName, field] of Object.entries(date)) {
    if (!field) {
      return { error: `${fieldName}Required`, fieldName };
    }
  }
};

export const isDateInputInvalid: DateValidator = (date: CaseDate) => {
  if (isDateEmpty(date)) {
    return;
  }

  for (const [fieldName, value] of Object.entries(date)) {
    if (isNaN(+value) && value) {
      return { error: `${fieldName}NotANumber`, fieldName };
    }
  }

  for (const [fieldName, value] of Object.entries(date)) {
    if (!value) {
      return { error: `${fieldName}Required`, fieldName };
    }
  }

  const year = parseInt(date.year, 10) || 0;
  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  if ((day && day < 1) || day > 31) {
    return { error: 'dayInvalid', fieldName: 'day' };
  }

  if ((month && month < 1) || month > 12) {
    return { error: 'monthInvalid', fieldName: 'month' };
  }

  if (month && year < 1000) {
    return { error: 'yearInvalid', fieldName: 'year' };
  }

  const dateMinus100 = new Date();
  dateMinus100.setFullYear(dateMinus100.getFullYear() - 100);
  dateMinus100.setHours(0, 0, 0, 0);

  if (convertCaseDateToDate(date) < dateMinus100) {
    return { error: 'invalidDateTooFarInPast', fieldName: 'year' };
  }

  if (validateDayInTheMonth(date)) {
    return { error: 'invalidDate', fieldName: validateDayInTheMonth(date) as string };
  }
};

const validateDayInTheMonth = (date: CaseDate): string | boolean => {
  const year = parseInt(date.year, 10) || 0;

  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  const jsDate = dayjs(new Date(year, month - 1, day));

  const yearValid = jsDate.year() === year;
  const monthValid = jsDate.month() + 1 === month;
  const dayValid = jsDate.date() === day;

  return !yearValid ? 'year' : !monthValid ? 'month' : !dayValid ? 'day' : false;
};

export const areDates10YearsApartOrMore: DateValidator = (caseDate1: CaseDate, caseDate2: CaseDate) => {
  if (isDateEmpty(caseDate1) || isDateEmpty(caseDate2)) {
    return;
  }

  const date1 = convertCaseDateToDate(caseDate1);
  const date2 = convertCaseDateToDate(caseDate2);
  const yearsBetweenDates = new Date(Math.abs(date1.getTime() - date2.getTime())).getUTCFullYear() - 1970;

  if (yearsBetweenDates < 10) {
    return { error: 'invalidDateTooRecent', fieldName: 'day' };
  }
};

export const isDateInLastTenYears: DateValidator = (date: CaseDate) => {
  if (isDateEmpty(date)) {
    return;
  }

  const dateMinus10 = new Date();
  dateMinus10.setFullYear(dateMinus10.getFullYear() - 10);
  dateMinus10.setHours(0, 0, 0, 0);

  if (convertCaseDateToDate(date) < dateMinus10) {
    return { error: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' };
  }
};

export const isDateInNextTenYears: DateValidator = (date: CaseDate) => {
  if (isDateEmpty(date)) {
    return;
  }

  const datePlus10 = new Date();
  datePlus10.setFullYear(datePlus10.getFullYear() + 10);

  if (convertCaseDateToDate(date) > datePlus10) {
    return { error: 'invalidDateMoreThanTenYearsInFuture', fieldName: 'year' };
  }
};

export const isDateInPast: DateValidator = date => {
  if (!isDateEmpty(date) && !isFirstDateBeforeSecond(date, convertDateToCaseDate(new Date()))) {
    return { error: 'invalidDateInFuture', fieldName: 'day' };
  }
};

export const isDateNotInPast: DateValidator = date => {
  if (!isDateEmpty(date) && isFirstDateBeforeSecond(date, convertDateToCaseDate(new Date()))) {
    return { error: 'invalidDateInPast', fieldName: 'day' };
  }
};

export const isFirstDateBeforeSecond = (date1: CaseDate, date2: CaseDate): boolean => {
  return convertCaseDateToDate(date1) < convertCaseDateToDate(date2);
};

export const isDateEmpty = (date: CaseDate): boolean => {
  return Object.values(date).every(e => e === '');
};

export const convertDateToCaseDate = (date: Date): CaseDate => {
  return { day: `${date.getDate()}`, month: `${date.getMonth() + 1}`, year: `${date.getFullYear()}` };
};

export const convertCaseDateToDate = (date: CaseDate): Date => {
  return new Date(+date.year, +date.month - 1, +date.day);
};

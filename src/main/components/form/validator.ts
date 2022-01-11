import dayjs from 'dayjs';
import { CaseDate } from 'definitions/case';

export type Validator = (value: string | string[] | undefined) => void | string
export type DateValidator = (value: CaseDate | undefined) => void | string

export const isFieldFilledIn: Validator = (value) => {
  if (!value || (value as string).trim().length === 0) {
    return 'required';
  }
};

export const atLeastOneFieldIsChecked: Validator = (fields: string[]) => {
  if (!fields || (fields as []).length === 0) {
    return 'required';
  }
};

export const areDateFieldsFilledIn: DateValidator = (fields: CaseDate | undefined) => {
  if (typeof fields !== 'object' || Object.keys(fields).length !== 3) {
    return 'required';
  }

  for (const [, field] of Object.entries(fields)) {
    if (!field) {
      return 'required';
    }
  }
};

export const isDateInputInvalid: DateValidator = (date: CaseDate | undefined) => {
  const invalid = 'invalidDate';
  if (!date) {
    return invalid;
  }

  for (const [, value] of Object.entries(date)) {
    if (isNaN(+value)) {
      return invalid;
    }
  }

  const year = parseInt(date.year, 10) || 0;
  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  const jsDate = dayjs(new Date(year, month - 1, day));
  const validDayInTheMonth = jsDate.year() == year && jsDate.month() + 1 == month && jsDate.date() == day;
  
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return invalid;
  }

  if (year < 1900) {
    if (year < 1000) {
      return 'invalidYear';
    }
    return 'invalidDateTooFarInPast';
  }

  if (!validDayInTheMonth) {
    return invalid;
  }
};

export const isFutureDate: DateValidator = (date) => {
  if (!date) {
    return;
  }

  const enteredDate = new Date(+date.year, +date.month, +date.day);
  if (new Date() < enteredDate) {
    return 'invalidDateInFuture';
  }
};

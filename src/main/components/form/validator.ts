import dayjs from 'dayjs';
import { CaseDate } from 'definitions/case';
import { InvalidField } from 'definitions/form';

export type Validator = (value: string | string[] | undefined) => void | string
export type DateValidator = (
  value: CaseDate | undefined
) => void | string | InvalidField

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

export const areDateFieldsFilledIn: DateValidator = (
  fields: CaseDate | undefined,
) => {
  if (
    typeof fields !== 'object' ||
    Object.keys(fields).length !== 3 ||
    Object.values(fields).every((e) => e === null || e === '')
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
        fieldName: fieldName,
      };
    }
  }
};

export const isDateInputInvalid: DateValidator = (
  date: CaseDate | undefined,
) => {
  const invalid = 'invalidDate';
  if (!date) {
    return invalid;
  }

  for (const [fieldName, value] of Object.entries(date)) {
    if (isNaN(+value)) {
      return {
        error: invalid,
        fieldName,
      };
    }
  }

  const year = parseInt(date.year, 10) || 0;
  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return {
      error: invalid,
      fieldName:
        month < 1 || month > 12 ? 'month' : day < 1 || day > 31 ? 'day' : '',
    };
  }

  if (year < 1900) {
    if (year < 1000) {
      return { error: 'invalidYear', fieldName: 'year' };
    }
    return { error: 'invalidDateTooFarInPast', fieldName: 'year' };
  }

  if (validateDayInTheMonth(date)) {
    return { error: invalid, fieldName: validateDayInTheMonth(date) as string };
  }
};

export const isFutureDate: DateValidator = (date) => {
  if (!date) {
    return;
  }

  const enteredDate = new Date(+date.year, +date.month, +date.day);
  if (new Date() < enteredDate) {
    return { error: 'invalidDateInFuture', fieldName: 'day' };
  }
};

export const validateDayInTheMonth = (date: CaseDate): string | boolean => {
  const year = parseInt(date.year, 10) || 0;

  const month = parseInt(date.month, 10) || 0;
  const day = parseInt(date.day, 10) || 0;

  const jsDate = dayjs(new Date(year, month - 1, day));

  const yearValid = jsDate.year() == year;
  const monthValid = jsDate.month() + 1 == month;
  const dayValid = jsDate.date() == day;

  return !yearValid ? 'year' : !monthValid ? 'month' : !dayValid ? 'day' : false;
};

export const isInvalidPostcode: Validator = value => {
  const fieldNotFilledIn = isFieldFilledIn(value);
  if (fieldNotFilledIn) {
    return fieldNotFilledIn;
  }

  if (!(value as string).match(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i)) {
    return 'invalid';
  }
};

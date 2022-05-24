import dayjs from 'dayjs';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { CaseDate } from '../../definitions/case';
import { InvalidField } from '../../definitions/form';

export type Validator = (value: string | string[] | undefined) => void | string;
export type DateValidator = (
  value: CaseDate | undefined,
  value2?: CaseDate | undefined
) => void | string | InvalidField;

export const isFieldFilledIn: Validator = value => {
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

export const isDateInputInvalid: DateValidator = (date: CaseDate | undefined) => {
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
      fieldName: month < 1 || month > 12 ? 'month' : day < 1 || day > 31 ? 'day' : '',
    };
  }

  if (year < 1000) {
    return { error: 'invalidYear', fieldName: 'year' };
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

export const isDateTenYearsInPast: DateValidator = (date: CaseDate | undefined) => {
  const enteredDate = new Date(+date.year, +date.month, +date.day);
  const dateMinus10 = new Date();
  dateMinus10.setFullYear(dateMinus10.getFullYear() - 10);

  if (enteredDate < dateMinus10) {
    return { error: 'invalidDateMoreThanTenYearsInPast', fieldName: 'year' };
  }
};

export const isFutureDate: DateValidator = date => {
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

  const yearValid = jsDate.year() === year;
  const monthValid = jsDate.month() + 1 === month;
  const dayValid = jsDate.date() === day;

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

export const isValidUKTelNumber: Validator = value => {
  if (value === null || value === '') {
    return;
  }

  try {
    const phoneUtil = PhoneNumberUtil.getInstance();
    if (!phoneUtil.isValidNumberForRegion(phoneUtil.parse(value as string, 'GB'), 'GB')) {
      return 'invalid';
    }
  } catch (e) {
    return 'invalid';
  }
};

export const isJobTitleValid: Validator = value => {
  if (typeof value === 'string') {
    const inputStrLength = (value as string).trim().length;
    if (inputStrLength === 0) {
      return;
    }

    if (inputStrLength === 1 || inputStrLength > 100) {
      return 'invalid-length';
    }
  }
};

export const isValidInteger: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'invalid';
  }

  if (/^\d+$/.test(value as string)) {
    return;
  } else {
    return 'invalid';
  }
};

export const isWorkAddressLineOneValid: Validator = value => {
  if (typeof value === 'string') {
    const inputStrLength = (value as string).trim().length;
    if (inputStrLength === 0 || inputStrLength > 100) {
      return 'required';
    }
  }
};

export const isWorkAddressTownValid: Validator = value => {
  if (typeof value === 'string') {
    const inputStrLength = (value as string).trim().length;

    if (inputStrLength < 3 || inputStrLength > 60) {
      return 'required';
    }
  }
};

export const isAfterDateOfBirth: DateValidator = (value1: CaseDate | undefined, value2: CaseDate | undefined) => {
  if (!value1) {
    return;
  }

  const enteredDate = new Date(+value1.year, +value1.month, +value1.day);
  const otherDate = new Date(+value2.year, +value2.month, +value2.day);

  if (otherDate > enteredDate) {
    return 'invalidDateBeforeDOB';
  } else {
    return;
  }
};

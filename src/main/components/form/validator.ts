import dayjs from 'dayjs';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { CaseDate } from '../../definitions/case';
import { ALLOWED_FILE_FORMATS } from '../../definitions/constants';
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

export const isContent2500CharsOrLess: Validator = value => {
  if (value !== undefined && (value as string).trim().length > 2500) {
    return 'tooLong';
  }
};

export const isContentBetween3And100Chars: Validator = value => {
  if (!value) {
    return 'required';
  }

  const nameLength = (value as string).trim().length;
  if (nameLength < 3 || nameLength > 100) {
    return 'invalidLength';
  }
};

export const isOptionSelected: Validator = value => {
  if (!value || (value as string).trim() === 'notSelected') {
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

  const enteredDate = new Date(+date.year, +date.month, +date.day);

  if (new Date() > enteredDate) {
    return { error: 'invalidDateInPast', fieldName: 'day' };
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

  if (!(value as string).match(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i)) {
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

export const isValidTwoDigitInteger: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'invalid';
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return 'notANumber';
  }
};

export const isValidNoticeLength: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  if (!/^\d{1,2}$/.test(value as string)) {
    return 'notANumber';
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

export const isPayIntervalNull: Validator = (value: string) => {
  if (!value) {
    return 'required';
  }
};

export const arePayValuesNull: Validator = (value: string[]) => {
  if (value && value.every(element => !element)) {
    return 'required';
  }
};

export const isValidAvgWeeklyHours: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
  }

  if (/^\D+$/.test(value as string) || /^\d+[^\d.]+$/.test(value as string)) {
    return 'notANumber';
  }

  if (((value as string).startsWith('0') && (value as string).trim().length > 1) || (value as string).includes('.')) {
    return 'invalid';
  }

  const maxValue = 168;
  const minValue = 0;
  const hours = parseInt(value as string);

  if (hours > maxValue) {
    return 'exceeded';
  } else if (hours < minValue) {
    return 'negativeNumber';
  }

  if (/^\d+$/.test(value as string)) {
    return;
  } else {
    return 'invalid';
  }
};

export const isValidPension: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return 'required';
  }

  if (/^\D+$/.test(value as string) || /^\d+[^\d.]+$/.test(value as string)) {
    return 'notANumber';
  }

  if ((value as string).trim().length < 2) {
    return 'invalid';
  }

  if (/^\d{2,}$/.test(value as string) || /^\d{2,}\.\d+$/.test(value as string)) {
    return;
  } else {
    return 'invalid';
  }
};

export const isValidCurrency: Validator = value => {
  if (!value) {
    return;
  }

  value = (value as string).trim();
  const digitCount = value.replace(/\D/g, '').length;
  const correctFormat = /^\d{1,3}((,\d{3}){0,3}|(\d{3}){0,3})(\.\d{2})?$/.test(value);

  if (digitCount <= 12 && correctFormat) {
    return;
  }

  return 'invalidCurrency';
};

let otherGenderTitle: string | string[];

export const validateGenderTitle: Validator = value => {
  otherGenderTitle = value;
};

export const validatePreferredOther: Validator = value => {
  let outcome: string = undefined;
  if (otherGenderTitle === 'Other') {
    if ((value as string).trim().length === 0) {
      outcome = 'required';
    } else if (/^\d+$/.test(value as string) || /^\s*\d/.test(value as string)) {
      outcome = 'numberError';
    }
    return outcome;
  }
};

export const hasValidFileFormat: Validator = value => {
  if (!value) {
    return;
  }

  value = (value as string).trim();
  for (const format of ALLOWED_FILE_FORMATS) {
    if (value.endsWith('.' + format)) {
      return;
    }
  }

  return 'invalidFileFormat';
};

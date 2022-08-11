import { PhoneNumberUtil } from 'google-libphonenumber';

import { ALLOWED_FILE_FORMATS } from '../../definitions/constants';

export type Validator = (value: string | string[] | undefined) => void | string;

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

export const validateTitlePreference: Validator = (value: string) => {
  if (value.trim().length === 0) {
    return 'required';
  } else if (value.trim().length < 2) {
    return 'lengthError';
  } else if (/^\d+$/.test(value) || /^\D*\d/.test(value)) {
    return 'numberError';
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

import { ValidationErrors } from '../../definitions/constants';

import { Validator } from './validator';

export const isValidPension: Validator = value => {
  const str = (value as string)?.trim();
  if (!str || str.length === 0) {
    return;
  }

  const validPattern = /^\d{2,}(\.\d{1,2})?$/;
  if (!validPattern.test(str)) {
    return ValidationErrors.INVALID_VALUE;
  }

  return;
};

const getDigitCount = (value: string | string[]): number => {
  value = (value as string).trim();
  return value.replace(/\D/g, '').length;
};

const getCorrectFormat = (value: string | string[]): boolean => {
  value = (value as string).trim();

  if (!/^[0-9.,]+$/.test(value)) {
    return false;
  }

  const regex = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/;
  return regex.test(value);
};

export const isValidPay: Validator = value => {
  if (!value) {
    return;
  }

  const correctFormat = getCorrectFormat(value);
  if (!correctFormat) {
    return ValidationErrors.INVALID_VALUE;
  }

  const digitCount = getDigitCount(value);
  if (digitCount < 2 || digitCount > 12) {
    return 'minLengthRequired';
  }
};

export const isValidCurrency: Validator = value => {
  if (!value) {
    return;
  }
  const digitCount = getDigitCount(value);
  const correctFormat = getCorrectFormat(value);
  if (digitCount <= 12 && correctFormat) {
    return;
  }
  return ValidationErrors.INVALID_VALUE;
};

import { ValidationErrors } from '../../definitions/constants';

import { Validator } from './validator';

const validNumberPattern = /^[0-9.,]+$/;
const validCurrencyPattern = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/;

const isEmpty = (value: string): boolean => {
  const str = (value as string)?.trim();
  return !str || str.length === 0;
};

const isInvalidNumber = (value: string): boolean => {
  const str = (value as string)?.trim();
  return !validNumberPattern.test(str) || !validCurrencyPattern.test(str);
};

const isNumberLessThan10 = (value: string): boolean => {
  const str = (value as string)?.trim();
  const numericValue = parseFloat(str.replace(/,/g, ''));
  return numericValue < 10;
};

export const isValidPension: Validator = value => {
  const str = (value as string)?.trim();
  if (isEmpty(str)) {
    return;
  }

  if (isInvalidNumber(str)) {
    return ValidationErrors.INVALID_VALUE;
  }

  if (isNumberLessThan10(str)) {
    return ValidationErrors.MIN_LENGTH_REQUIRED;
  }
};

export const isValidPay: Validator = value => {
  const str = (value as string)?.trim();
  if (isEmpty(str)) {
    return;
  }

  if (isInvalidNumber(str)) {
    return ValidationErrors.INVALID_VALUE;
  }

  if (isNumberLessThan10(str)) {
    return ValidationErrors.MIN_LENGTH_REQUIRED;
  }
};

export const isValidCurrency: Validator = value => {
  const str = (value as string)?.trim();
  if (isEmpty(str)) {
    return;
  }

  if (isInvalidNumber(str)) {
    return ValidationErrors.INVALID_VALUE;
  }
};

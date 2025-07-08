import { ValidationErrors } from '../../definitions/constants';

import { Validator } from './validator';

const validNumberPattern = /^[0-9.,]+$/;
const validCurrencyPattern = /^(\d{1,3}(,\d{3})+|\d+)(\.\d{1,2})?$/;

const isEmpty = (value: string | string[]): boolean => {
  value = (value as string)?.trim();
  return !value || value.length === 0;
};

const isInvalidNumber = (value: string | string[]): boolean => {
  value = (value as string)?.trim();
  return !validNumberPattern.test(value) || !validCurrencyPattern.test(value);
};

const isNumberLessThan10 = (value: string | string[]): boolean => {
  value = (value as string)?.trim();
  const numericValue = parseFloat(value.replace(/,/g, ''));
  return numericValue < 10;
};

export const isValidDoubleCurrency: Validator = value => {
  if (isEmpty(value)) {
    return;
  }

  if (isInvalidNumber(value)) {
    return ValidationErrors.INVALID_VALUE;
  }

  if (isNumberLessThan10(value)) {
    return ValidationErrors.MIN_LENGTH_REQUIRED;
  }
};

export const isValidCurrency: Validator = value => {
  if (isEmpty(value)) {
    return;
  }

  if (isInvalidNumber(value)) {
    return ValidationErrors.INVALID_VALUE;
  }
};

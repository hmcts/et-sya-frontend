import { Validator } from '../components/form/validator';

export const isValidPension: Validator = value => {
  if (!value || (value as string).trim().length === 0) {
    return;
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

export const currencyValidation = (value: string | string[]): [digitCount: number, correctFormat: boolean] => {
  value = (value as string).trim();
  const digitCount = value.replace(/\D/g, '').length;
  const correctFormat = /^\d{1,3}((,\d{3}){0,3}|(\d{3}){0,3})(\.\d{2})?$/.test(value);
  return [digitCount, correctFormat];
};
export const isValidPay: Validator = value => {
  if (!value) {
    return;
  }
  const validatedValues: [digitCount: number, correctFormat: boolean] = currencyValidation(value);
  if (!validatedValues[1]) {
    return 'notANumber';
  }
  if (validatedValues[0] < 2 || validatedValues[0] > 12) {
    return 'minLengthRequired';
  }
};

export const isValidCurrency: Validator = value => {
  if (!value) {
    return;
  }
  const validatedValues: [digitCount: number, correctFormat: boolean] = currencyValidation(value);
  if (validatedValues[0] <= 12 && validatedValues[1]) {
    return;
  }
  return 'invalidCurrency';
};

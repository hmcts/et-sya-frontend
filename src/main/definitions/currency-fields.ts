import { isValidCurrency, isValidPay } from '../components/form/currency-validator';

import { AnyRecord } from './util-types';

export type CurrencyFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  attributes: object;
};

export const DefaultCurrencyFormFields = {
  classes: 'govuk-input--width-10',
  type: 'currency',
  attributes: { maxLength: 16 }, // longest amount is of the form x,xxx,xxx,xxx.xx
  validator: isValidPay,
};

export const DefaultCompensationCurrencyFormFields = {
  classes: 'govuk-input--width-10',
  type: 'currency',
  attributes: { maxLength: 16 }, // longest amount is of the form x,xxx,xxx,xxx.xx
  validator: isValidCurrency,
};

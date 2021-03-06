import { isValidCurrency } from '../components/form/validator';

import { AnyRecord } from './util-types';

export type CurrencyFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  attributes: object;
};

export const DefaultCurrencyFormFields = {
  classes: 'govuk-input--width-5',
  type: 'currency',
  attributes: { maxLength: 12 },
  validator: isValidCurrency,
};

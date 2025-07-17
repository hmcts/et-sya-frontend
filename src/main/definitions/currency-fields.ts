import { isValidCurrency } from '../components/form/currency-validator';
import { Validator } from '../components/form/validator';

import { AnyRecord } from './util-types';

export type CurrencyFormFields = {
  id: string;
  type: string;
  classes: string;
  label: (l: AnyRecord) => string;
  attributes: object;
  validator?: Validator;
};

export const DefaultCurrencyFormFields = {
  classes: 'govuk-input--width-10',
  type: 'currency',
  attributes: { maxLength: 13 },
  validator: isValidCurrency,
};

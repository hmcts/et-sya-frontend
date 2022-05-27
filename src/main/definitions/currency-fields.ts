import { Validator, isFieldFilledIn } from '../components/form/validator';

import { AnyRecord } from './util-types';

export const CurrencyValues = [
  {
    attributes: { maxLength: 12 },
  },
];

export type CurrencyFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  values: typeof CurrencyValues;
  validator: Validator;
};

export const DefaultCurrencyFormFields = {
  classes: 'govuk-input--width-5',
  type: 'currency',
  label: (l: AnyRecord): string => l.label,
  values: CurrencyValues,
  validator: isFieldFilledIn,
};

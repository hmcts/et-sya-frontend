import { Validator, isFieldFilledIn } from '../components/form/validator';

import { AnyRecord } from './util-types';

export const CurrencyValues = [
  {
    label: (l: AnyRecord): string => l.payBeforeTax,
    attributes: { maxLength: 12 },
  },
  {
    label: (l: AnyRecord): string => l.payAfterTax,
    attributes: { maxLength: 12 },
  },
  {
    label: (l: AnyRecord): string => l.payIntervalRadios,
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

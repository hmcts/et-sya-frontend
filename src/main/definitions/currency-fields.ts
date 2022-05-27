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
  label: (l: AnyRecord): string => l.label,
  attributes: { maxlength: 12 },
};

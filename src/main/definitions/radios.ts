import { Validator, isFieldFilledIn } from '../components/form/validator';

import { PayInterval, YesOrNo } from './case';
import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

export const PayIntervalRadioValues = [
  {
    label: (l: AnyRecord): string => l.weekly,
    value: PayInterval.WEEKLY,
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.monthly,
    value: PayInterval.MONTHLY,
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.annual,
    value: PayInterval.ANNUAL,
    attributes: { maxLength: 2 },
  },
];

export const YesNoRadioValues = [
  {
    label: (l: AnyRecord): string => l.yes,
    name: 'radioYes',
    value: YesOrNo.YES,
    attributes: { maxLength: 2 },
  },
  {
    label: (l: AnyRecord): string => l.no,
    name: 'radioNo',
    value: YesOrNo.NO,
    attributes: { maxLength: 2 },
  },
];

export const submitButton: SubmitButton = {
  text: (l: AnyRecord): string => l.submit,
  classes: 'govuk-!-margin-right-2',
};

export const saveForLaterButton: SubmitButton = {
  text: (l: AnyRecord): string => l.saveForLater,
  classes: 'govuk-button--secondary',
};

export type RadioFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  values: typeof YesNoRadioValues;
  validator: Validator;
};

export const DefaultRadioFormFields = {
  type: 'radios',
  label: (l: AnyRecord): string => l.label,
  values: YesNoRadioValues,
  validator: isFieldFilledIn,
};

export const DefaultInlineRadioFormFields = {
  classes: 'govuk-radios--inline',
  type: 'radios',
  label: (l: AnyRecord): string => l.label,
  values: YesNoRadioValues,
  validator: isFieldFilledIn,
};

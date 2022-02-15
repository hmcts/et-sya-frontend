import { Validator, isFieldFilledIn } from '../components/form/validator';

import { YesOrNo } from './case';
import { SubmitButton } from './form';
import { AnyRecord } from './util-types';

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
  classes: 'govuk-radios',
  type: 'radios',
  label: (l: AnyRecord): string => l.label,
  values: YesNoRadioValues,
  validator: isFieldFilledIn,
};

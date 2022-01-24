import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isValidUKTelNumber } from '../../components/form/validator';

export const telNumberContent: FormContent = {
  fields: {
    telNumber : {
      id: 'telephone-number',
      name: 'telephone-number',
      type: 'tel',
      classes: 'govuk-input--width-20',
      label: (l: AnyRecord): string => l.telNumber,
      attributes: {
        autocomplete: 'tel',
      },
      validator: isValidUKTelNumber,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.submit,
    classes: 'govuk-!-margin-right-2',
  },
  saveForLater: {
    text: (l: AnyRecord): string => l.saveForLater,
    classes: 'govuk-button--secondary',
  },
};

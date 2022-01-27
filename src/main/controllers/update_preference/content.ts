import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isFieldFilledIn } from '../../components/form/validator';

export const updatePrefFormContent: FormContent = {
  fields: {
    updatePreference: {
      classes: 'govuk-radios--inline',
      id: 'update-preference',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          name: 'radio1',
          value: 'Yes',
          attributes: { maxLength: 2 },
        },
        {
          label: (l: AnyRecord): string => l.no,
          name: 'radio2',
          value: 'No',
          attributes: { maxLength: 2 },
        },
      ],
      validator: isFieldFilledIn,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.continue,
    classes: 'govuk-!-margin-right-2',
  },
};
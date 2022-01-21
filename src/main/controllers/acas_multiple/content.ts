import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isFieldFilledIn } from '../../components/form/validator';

export const acasFormContent: FormContent = {
  fields: {
    acasButtons: {
      classes: 'govuk-radios--inline',
      id: 'acas-multiple',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.radio1,
          name: 'radio1',
          value: 'Yes',
          attributes: { maxLength: 2 },
        },
        {
          label: (l: AnyRecord): string => l.radio2,
          value:'No',
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
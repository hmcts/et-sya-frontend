import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from 'definitions/case';

export const acasFormContent: FormContent = {
  fields: {
    acasButtons: {
      classes: 'govuk-radios--inline',
      id: 'acas-multiple',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          name: 'yes',
          value: YesOrNo.YES,
          attributes: { maxLength: 2 },
        },
        {
          label: (l: AnyRecord): string => l.no,
          name: 'no',
          value: YesOrNo.NO,
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


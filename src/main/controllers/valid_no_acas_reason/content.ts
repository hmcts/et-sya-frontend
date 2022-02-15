import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const validNoAcasReasonFormContent: FormContent = {
  fields: {
    validNoAcasReason: {
      classes: 'govuk-radios--inline',
      id: 'valid-no-acas-reason',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          name: 'radio1',
          value: YesOrNo.YES,
        },
        {
          label: (l: AnyRecord): string => l.no,
          name: 'radio2',
          value: YesOrNo.NO,
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

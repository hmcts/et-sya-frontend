import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from 'definitions/case';

export const acasSingleClaimFormContent: FormContent = {
  fields: {
    isAcasSingle: {
      classes: 'govuk-radios--inline',
      id: 'acas-single',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          value: YesOrNo.YES,
        },
        {
          label: (l: AnyRecord): string => l.no,
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

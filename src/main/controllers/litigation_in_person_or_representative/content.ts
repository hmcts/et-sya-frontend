import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const lipOrRepContent: FormContent = {
  fields: {
    representingMyself: {
      type: 'radios',
      classes: 'govuk-radios',
      id: 'lip-or-representative',
      values: [
        {
          label: (l: AnyRecord): string => l.radio1,
          value: YesOrNo.YES,
        },
        {
          label: (l: AnyRecord): string => l.radio2,
          value: YesOrNo.NO,
        },
      ],
      validator: isFieldFilledIn,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.continue,
  },
};

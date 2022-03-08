import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const multipleRespondentContent: FormContent = {
  fields: {
    isMultipleRespondent: {
      id: 'more_than_one_respondent',
      type: 'radios',
      classes: 'govuk-radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          name: 'radio_multiple',
          label: (l: AnyRecord): string => l.radio1,
          value: YesOrNo.YES,
          selected: false,
        },
        {
          name: 'radio_single',
          label: (l: AnyRecord): string => l.radio2,
          value: YesOrNo.NO,
          selected: false,
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

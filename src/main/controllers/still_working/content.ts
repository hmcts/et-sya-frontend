import { isFieldFilledIn } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const stillWorkingContent: FormContent = {
  fields: {
    isStillWorking: {
      classes: 'govuk-radios--inline',
      id: 'still-working',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          name: 'working',
          label: (l: AnyRecord): string => l.optionText1,
          value: 1,
          selected: false,
        },
        {
          name: 'working_notice',
          label: (l: AnyRecord): string => l.optionText2,
          value: 2,
          selected: false,
        },
        {
          name: 'not_working',
          label: (l: AnyRecord): string => l.optionText3,
          value: 3,
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

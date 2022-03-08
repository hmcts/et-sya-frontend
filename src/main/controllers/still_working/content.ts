import { isFieldFilledIn } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const stillWorkingContent: FormContent = {
  fields: {
    isStillWorking: {
      classes: 'govuk-radios',
      id: 'still-working',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          name: 'working',
          label: (l: AnyRecord): string => l.optionText1,
          value: 'WORKING',
          selected: false,
        },
        {
          name: 'working_notice',
          label: (l: AnyRecord): string => l.optionText2,
          value: 'NOTICE',
          selected: false,
        },
        {
          name: 'not_working',
          label: (l: AnyRecord): string => l.optionText3,
          value: 'NO LONGER WORKING',
          selected: false,
        },
      ],
      validator: isFieldFilledIn,
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

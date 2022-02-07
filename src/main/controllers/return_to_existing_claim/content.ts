import { YesOrNo } from 'definitions/case';

import { isFieldFilledIn } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const returnToExistingContent: FormContent = {
  fields: {
    returnToExisting: {
      id: 'return_number_or_account',
      type: 'radios',
      classes: 'govuk-date-input',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          name: 'have_return_number',
          label: (l: AnyRecord): string => l.optionText1,
          value: YesOrNo.YES,
          selected: false,
        },
        {
          name: 'have_account',
          label: (l: AnyRecord): string => l.optionText2,
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

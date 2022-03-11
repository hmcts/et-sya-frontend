import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const reasonableAdjustmentsContent: FormContent = {
  fields: {
    reasonableAdjustments: {
      id: 'reasonableAdjustments',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'reasonableAdjustments',
          label: l => l.checkbox1,
          value: 'one',
        },
        {
          name: 'reasonableAdjustments',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'reasonableAdjustments',
          label: l => l.checkbox1,
          value: 'three',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

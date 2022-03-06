import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const supportContent: FormContent = {
  fields: {
    support: {
      id: 'support',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'support',
          label: l => l.checkbox1,
          value: 'one',
        },
        {
          name: 'support',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'support',
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

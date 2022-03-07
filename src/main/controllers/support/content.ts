import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const supportContent: FormContent = {
  fields: {
    support: {
      id: 'support',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      hint: l => l.hint,
      labelSize: 'l',
      isPageHeading: true,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'support',
          label: l => l.checkbox1,
          value: 'support1',
        },
        {
          name: 'support',
          label: l => l.checkbox1,
          value: 'support2',
        },
        {
          name: 'support',
          label: l => l.checkbox1,
          value: 'support3',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

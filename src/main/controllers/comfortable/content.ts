import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const comfortableContent: FormContent = {
  fields: {
    comfortable: {
      id: 'comfortable',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'comfortable-one',
        },
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'comfortable-two',
        },
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'comfortable-three',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

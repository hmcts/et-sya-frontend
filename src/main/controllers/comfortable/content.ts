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
          value: 'one',
        },
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'comfortable',
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

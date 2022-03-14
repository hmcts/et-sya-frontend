import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const comfortableContent: FormContent = {
  fields: {
    comfortable: {
      id: 'comfortable',
      type: 'checkboxes',
      label: l => l.h1,
      labelHidden: false,
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
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'comfortable-four',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const communicatingContent: FormContent = {
  fields: {
    communicating: {
      id: 'communicating',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'communicating',
          label: l => l.checkbox1,
          value: 'one',
        },
        {
          name: 'communicating',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'communicating',
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

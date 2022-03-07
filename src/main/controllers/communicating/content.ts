import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const communicatingContent: FormContent = {
  fields: {
    communicating: {
      id: 'communicating',
      type: 'checkboxes',
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      labelHidden: false,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'communicating',
          label: l => l.checkbox1,
          value: 'val1',
        },
        {
          name: 'communicating',
          label: l => l.checkbox1,
          value: 'val2',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

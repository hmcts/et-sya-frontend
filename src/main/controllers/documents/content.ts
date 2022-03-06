import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const documentsContent: FormContent = {
  fields: {
    documents: {
      id: 'documents',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'documents',
          label: l => l.checkbox1,
          value: 'one',
        },
        {
          name: 'documents',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'documents',
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

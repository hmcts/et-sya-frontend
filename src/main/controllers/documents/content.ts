import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const documentsContent: FormContent = {
  fields: {
    documents: {
      id: 'documents',
      type: 'checkboxes',
      validator: atLeastOneFieldIsChecked,
      isPageHeading: true,
      labelHidden: false,
      labelSize: 'l',
      hint: l => l.hint,
      label: l => l.h1,
      values: [
        {
          name: 'documents',
          label: l => l.checkbox1,
          value: 'value1',
        },
        {
          name: 'documents',
          label: l => l.checkbox1,
          value: 'value2',
        },
        {
          name: 'documents',
          label: l => l.checkbox1,
          value: 'value3',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

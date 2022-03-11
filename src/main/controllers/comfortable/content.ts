import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const comfortableContent: FormContent = {
  fields: {
    comfortable: {
      id: 'comfortable',
      type: 'checkboxes',
      labelSize: 'l',
      isPageHeading: true,
      labelHidden: false,
      label: l => l.h1,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'updateThisValue1',
        },
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'updateThisValue2',
        },
        {
          name: 'comfortable',
          label: l => l.checkbox1,
          value: 'updateThisValue3',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

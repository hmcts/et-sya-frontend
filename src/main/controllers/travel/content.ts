import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const travelContent: FormContent = {
  fields: {
    travel: {
      id: 'travel',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'l',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: 'one',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: 'two',
        },
        {
          name: 'travel',
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

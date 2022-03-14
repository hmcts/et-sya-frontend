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
      hint: l => l.hint,
      isPageHeading: true,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: 'travel-val-one',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: 'travel-val-two',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

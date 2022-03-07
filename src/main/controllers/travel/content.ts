import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';

export const travelContent: FormContent = {
  fields: {
    travel: {
      id: 'travel',
      type: 'checkboxes',
      label: l => l.h1,
      labelHidden: false,
      hint: l => l.hint,
      labelSize: 'l',
      isPageHeading: true,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: '1',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: '2',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: '3',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: '4',
        },
        {
          name: 'travel',
          label: l => l.checkbox1,
          value: '5',
        },
      ],
    },
  },
  submit: {
    text: l => l.submit,
  },
};

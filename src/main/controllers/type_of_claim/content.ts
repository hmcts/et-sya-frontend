import { atLeastOneFieldIsChecked } from '../../components/form/validator';
import { TypesOfClaim } from '../../definitions/definition';
import { FormContent } from '../../definitions/form';

export const typeOfClaimFormContent: FormContent = {
  fields: {
    typeOfClaim: {
      id: 'typeOfClaim',
      type: 'checkboxes',
      labelHidden: false,
      label: l => l.h1,
      labelSize: 'xl',
      isPageHeading: true,
      hint: l => l.hint,
      validator: atLeastOneFieldIsChecked,
      values: [
        {
          id: 'typeOfClaim',
          name: 'typeOfClaim',
          label: l => l.breachOfContract.checkbox,
          value: TypesOfClaim.BREACH_OF_CONTRACT,
        },
      ],
    },
  },
  submit: {
    text: l => l.continue,
  },
};

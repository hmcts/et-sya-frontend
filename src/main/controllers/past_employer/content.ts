import { DefaultRadioFormFields, RadioFormFields, saveForLaterButton, submitButton } from '../../definitions/radios';
import { FormContent } from '../../definitions/form';

const past_employer: RadioFormFields = {
  ...DefaultRadioFormFields,
  id: 'past-employer',
  classes: 'govuk-radios--inline',
};

export const pastEmployerFormContent: FormContent = {
  fields: { pastEmployer: past_employer  },
  submit: submitButton,
  saveForLater: saveForLaterButton,
};

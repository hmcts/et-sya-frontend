import { FormContent } from '../../definitions/form';
import { DefaultRadioFormFields, RadioFormFields, saveForLaterButton, submitButton } from '../../definitions/radios';

const present_employer: RadioFormFields = {
  ...DefaultRadioFormFields,
  id: 'present-employer',
  classes: 'govuk-radios',
};

export const presentEmployerFormContent: FormContent = {
  fields: { presentEmployer: present_employer },
  submit: submitButton,
  saveForLater: saveForLaterButton,
};

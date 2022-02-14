import { isJobTitleValid } from '../../components/form/validator';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const jobTitleContent: FormContent = {
  fields: {
    jobTitle: {
      id: 'job-title',
      name: 'job-title',
      type: 'text',
      classes: 'govuk-!-width-one-half',
      label: (l: AnyRecord): string => l.jobTitle,
      hint: (l: AnyRecord): string => l.hint,
      attributes: {
        autocomplete: 'organization-title',
      },
      validator: isJobTitleValid,
    },
  },
  submit: {
    text: (l: AnyRecord): string => l.submit,
    classes: 'govuk-!-margin-right-2',
  },
  saveForLater: {
    text: (l: AnyRecord): string => l.saveForLater,
    classes: 'govuk-button--secondary',
  },
};

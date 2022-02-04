import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from 'definitions/case';

export const presentEmployerFormContent: FormContent = {
  fields: {
    presentEmployer: {
      classes: 'govuk-radios',
      id: 'present-employer',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: "Yes - I'm working my notice period",
          name: 'radio1',
          value: YesOrNo.YES,
          attributes: { maxLength: 2 },
        },
        {
          label: "No - I'm no longer working for them",
          name: 'radio2',
          value: YesOrNo.NO,
          attributes: { maxLength: 2 },
        },
      ],
      validator: isFieldFilledIn,
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

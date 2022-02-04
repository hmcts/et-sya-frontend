import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const presentEmployerFormContent: FormContent = {
  fields: {
    presentEmployer: {
      classes: 'govuk-radios',
      id: 'present-employer',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          name: 'radioYes',
          value: YesOrNo.YES,
          attributes: { maxLength: 2 },
        },
        {
          label: (l: AnyRecord): string => l.no,
          name: 'radioNo',
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

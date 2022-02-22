import { isFieldFilledIn } from '../../components/form/validator';
import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const updatePrefFormContent: FormContent = {
  fields: {
    updatePreference: {
      classes: 'govuk-radios',
      id: 'update-preference',
      type: 'radios',
      label: (l: AnyRecord): string => l.label,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          name: 'radio1',
          value: YesOrNo.YES,
          attributes: { maxLength: 2 },
        },
        {
          label: (l: AnyRecord): string => l.no,
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

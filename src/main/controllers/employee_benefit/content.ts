import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const employeeBenefitContent: FormContent = {
  fields: {
    receiveEmployeeBenefit: {
      id: 'receive-employee-benefit',
      type: 'radios',
      classes: 'govuk-radios',
      hint: (l: AnyRecord): string => l.hint,
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          value: YesOrNo.YES,
          selected: false,
          subFields: {
            employeeBenefit: {
              id: 'employee-benefit',
              type: 'text',
              label: (l: AnyRecord): string => l.tellUsAboutBenefit,
            },
          },
        },

        {
          label: (l: AnyRecord): string => l.no,
          value: YesOrNo.NO,
          selected: false,
        },
      ],
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

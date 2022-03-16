import { YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const employeeBenefitContent: FormContent = {
  fields: {
    employeeBenefit: {
      id: 'employee_benefit_title',
      name: 'employee_benefit_title',
      type: 'text',
      // classes: 'govuk-!-width-one-half',
      label: (l: AnyRecord): string => l.employee_benefit_title,
      hint: (l: AnyRecord): string => l.hint,
      // attributes: {
      //     autocomplete: 'employee-benefits'
      // },
    },

    receiveEmployeeBenefit: {
      id: 'receive-employee-benefit',
      type: 'radios',
      classes: 'govuk-radios',
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          value: YesOrNo.YES,
          selected: false,
        },

        {
          label: (l: AnyRecord): string => l.no,
          value: YesOrNo.NO,
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

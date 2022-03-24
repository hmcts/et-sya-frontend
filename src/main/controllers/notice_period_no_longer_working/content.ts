import { WeeksOrMonths, YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const noticePeriodFormContent: FormContent = {
  fields: {
    noticePeriodLength: {
      id: 'notice-period-length',
      type: 'radios',
      classes: 'govuk-radios',
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          value: YesOrNo.YES,
          selected: false,
          subFields: {
            noticePeriodUnit: {
              id: 'notice-period-unit',
              type: 'option',
              classes: 'govuk-radios--inline',
              label: (l: AnyRecord): string => l.hint1,
              values: [
                {
                  label: (l: AnyRecord): string => l.empty,
                  value: 1,
                },
              ],
            },
            noticePeriodUnit2: {
              id: 'notice-period-unit2',
              type: 'radios',
              classes: 'govuk-radios--inline',
              values: [
                {
                  label: (l: AnyRecord): string => l.weeks,
                  value: WeeksOrMonths.WEEKS,
                },
                {
                  label: (l: AnyRecord): string => l.months,
                  value: WeeksOrMonths.MONTHS,
                },
              ],
            },

            noticePeriodPaid: {
              id: 'notice-period-paid',
              type: 'option',
              classes: 'govuk-radios--inline',
              label: (l: AnyRecord): string => l.hint2,
              values: [
                {
                  label: (l: AnyRecord): string => l.empty,
                  value: 1,
                },
              ],
            },
            noticePeriodPaid2: {
              id: 'notice-period-paid2',
              type: 'radios',
              classes: 'govuk-radios--inline',
              values: [
                {
                  label: (l: AnyRecord): string => l.weeks,
                  value: WeeksOrMonths.WEEKS,
                },
                {
                  label: (l: AnyRecord): string => l.months,
                  value: WeeksOrMonths.MONTHS,
                },
              ],
            },
          },
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

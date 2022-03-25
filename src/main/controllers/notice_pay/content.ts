import { WeeksOrMonths, YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const noticePayContent: FormContent = {
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
                  // classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                  value: 1,
                },
              ],
            },
            noticePeriodPaid: {
              id: 'notice-period-paid',
              type: 'radios',
              classes: 'govuk-radios--inline',
              name: 'notice-period-pay',
              values: [
                {
                  label: (l: AnyRecord): string => l.weeks,
                  value: WeeksOrMonths.WEEKS,
                  selected: false,
                },
                {
                  label: (l: AnyRecord): string => l.months,
                  value: WeeksOrMonths.MONTHS,
                  selected: false,
                },
              ],
            },

            noticePeriodUnit2: {
              id: 'notice-period-unit',
              type: 'option',
              classes: 'govuk-radios--inline',
              label: (l: AnyRecord): string => l.hint2,
              values: [
                {
                  label: (l: AnyRecord): string => l.empty,
                  // classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                  value: 1,
                },
              ],
            },
            noticePeriodPaid2: {
              id: 'notice-period-paid',
              type: 'radios',
              classes: 'govuk-radios--inline',
              name: 'notice-period-pay',
              values: [
                {
                  label: (l: AnyRecord): string => l.weeks,
                  value: WeeksOrMonths.WEEKS,
                  selected: false,
                },
                {
                  label: (l: AnyRecord): string => l.months,
                  value: WeeksOrMonths.MONTHS,
                  selected: false,
                },
              ],
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

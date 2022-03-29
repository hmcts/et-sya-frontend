import { WeeksOrMonths } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { DefaultRadioFormFields, RadioFormFields, saveForLaterButton, submitButton } from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';

const notice_period: RadioFormFields = {
  ...DefaultRadioFormFields,
  id: 'notice-period',
  classes: 'govuk-radios--inline',
};

export const noticePeriodFormContent: FormContent = {
  fields: {
    noticePeriodLength: {
      id: 'notice-period-length',
      type: 'radios',
      classes: 'govuk-radios--inline',
      values: [
        {
          label: notice_period.values[0].value,
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
          label: notice_period.values[1].value,
        },
      ],
    },
  },
  submit: submitButton,
  saveForLater: saveForLaterButton,
};

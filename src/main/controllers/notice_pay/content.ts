import { YesOrNo } from '../../definitions/case';
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
              type: 'date',
              label: (l: AnyRecord): string => l.hint1,
              values: [
                {
                  label: (l: AnyRecord): string => l.empty,
                  name: 'day',
                  classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                  value: 1,
                },
                {
                  label: (l: AnyRecord): string => l.dateFormat.month,
                  name: 'month',
                  classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                },
                {
                  label: (l: AnyRecord): string => l.dateFormat.year,
                  name: 'year',
                  classes: 'govuk-input--width-4',
                  attributes: { maxLength: 4 },
                },
              ],
            },
            noticePeriodPaid: {
              id: 'notice-period-paid',
              type: 'date',
              label: (l: AnyRecord): string => l.hint2,
              values: [
                {
                  label: (l: AnyRecord): string => l.empty,
                  name: 'day',
                  classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                  value: 1,
                },
                {
                  label: (l: AnyRecord): string => l.dateFormat.month,
                  name: 'month',
                  classes: 'govuk-input--width-2',
                  attributes: { maxLength: 2 },
                },
                {
                  label: (l: AnyRecord): string => l.dateFormat.year,
                  name: 'year',
                  classes: 'govuk-input--width-4',
                  attributes: { maxLength: 4 },
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

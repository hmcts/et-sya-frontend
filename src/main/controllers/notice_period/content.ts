import { isFieldFilledIn, isValidInteger } from '../../components/form/validator';
import { WeeksOrMonths, YesOrNo } from '../../definitions/case';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const noticePeriodFormContent: FormContent = {
  fields: {
    noticePeriod: {
      id: 'notice-period',
      type: 'radios',
      classes: 'govuk-radios',
      values: [
        {
          label: (l: AnyRecord): string => l.yes,
          value: YesOrNo.YES,
          conditionalText: (l: AnyRecord): string => l.insetText,
          subFields: {
            noticePeriodUnit: {
              id: 'notice-period-unit',
              type: 'radios',
              classes: 'govuk-radios--inline',
              label: (l: AnyRecord): string => l.unitLabel,
              labelSize: null,
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
              validator: isFieldFilledIn,
            },
            noticePeriodLength: {
              id: 'notice-period-length',
              type: 'input',
              classes: 'govuk-input--width-2',
              label: (l: AnyRecord): string => l.lengthLabel,
              labelSize: null,
              attributes: {
                autocomplete: 'notice-period-length',
                maxLength: 2,
              },
              validator: isFieldFilledIn && isValidInteger,
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

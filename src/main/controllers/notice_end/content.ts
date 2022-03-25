import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';

export const noticeEndContent: FormContent = {
  fields: {
    noticeEnd: {
      id: 'notice-end',
      type: 'date',
      classes: 'govuk-date-input',
      label: (l: AnyRecord): string => l.label,
      labelHidden: true,
      values: [
        {
          label: (l: AnyRecord): string => l.dateFormat.day,
          name: 'day',
          classes: 'govuk-input--width-2',
          attributes: { maxLength: 2 },
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
  submit: {
    text: (l: AnyRecord): string => l.submit,
    classes: 'govuk-!-margin-right-2',
  },
  saveForLater: {
    text: (l: AnyRecord): string => l.saveForLater,
    classes: 'govuk-button--secondary',
  },
};

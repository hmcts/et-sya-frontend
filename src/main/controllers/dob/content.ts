import { convertToDateObject } from '../../components/form/parser';
import {
  areDateFieldsFilledIn,
  isDateInputInvalid,
  isFutureDate,
} from '../../components/form/validator';
import { CaseDate } from '../../definitions/case';
import { FormContent, InvalidField } from '../../definitions/form';
import { AnyRecord, UnknownRecord } from '../../definitions/util-types';

export const dobFormContent: FormContent = {
  fields: {
    dobDate: {
      id: 'dob',
      type: 'date',
      classes: 'govuk-date-input',
      label: (l: AnyRecord): string => l.label,
      labelHidden: true,
      hint: (l: AnyRecord): string => l.hint,
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
      parser: (body: UnknownRecord): any =>
        convertToDateObject('dobDate', body),
      validator: (value: CaseDate): string | void | InvalidField =>
        areDateFieldsFilledIn(value) ||
        isDateInputInvalid(value) ||
        isFutureDate(value),
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

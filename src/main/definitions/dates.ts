import {
  DateValidator,
  areDateFieldsFilledIn,
  areDates10YearsApartOrMore,
  convertDateToCaseDate,
  isDateEmpty,
  isDateInLastTenYears,
  isDateInNextTenYears,
  isDateInPast,
  isDateInputInvalid,
  isDateNotInPast,
  isDateNotPartial,
} from '../components/form/date-validator';

import { CaseDate } from './case';
import { InvalidField } from './form';
import { AnyRecord, UnknownRecord } from './util-types';

export const DateValues = [
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
];

export type DateFormFields = {
  id: string;
  classes: string;
  type: string;
  label: (l: AnyRecord) => string;
  labelSize?: string;
  labelHidden: boolean;
  hint: (l: AnyRecord) => string;
  values: typeof DateValues;
  parser: (body: UnknownRecord) => CaseDate;
  validator: DateValidator;
};

type DateTypes = string | void | InvalidField;

export const BirthDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    isDateNotPartial(value) ||
    (isDateEmpty(value) ? '' : isDateInputInvalid(value)) ||
    isDateInPast(value) ||
    areDates10YearsApartOrMore(value, convertDateToCaseDate(new Date())),
};

export const EndDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateInPast(value) || isDateInLastTenYears(value),
};

export const NewJobDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  values: DateValues,
  validator: (value: CaseDate): DateTypes => isDateInputInvalid(value) || isDateInNextTenYears(value),
};

export const NoticeEndDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateNotInPast(value) || isDateInNextTenYears(value),
};

export const StartDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.legend,
  labelHidden: false,
  labelSize: 'l',
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isDateInPast(value),
};

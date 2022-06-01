import {
  DateValidator,
  areDateFieldsFilledIn,
  isDateInputInvalid,
  isDateTenYearsInFuture,
  isDateTenYearsInPast,
  isFutureDate,
  isPastDate,
} from '../components/form/validator';

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
  hint: (l: AnyRecord) => string;
  values: typeof DateValues;
  parser: (body: UnknownRecord) => CaseDate;
  validator: DateValidator;
};

type DateTypes = string | void | InvalidField;

export const DefaultDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.label,
  labelHidden: true,
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isFutureDate(value),
};

export const EndDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.label,
  labelHidden: true,
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isFutureDate(value) || isDateTenYearsInPast(value),
};

export const NewJobDateFormFields = {
  classes: 'govuk-date-input',
  type: 'date',
  label: (l: AnyRecord): string => l.label,
  labelHidden: true,
  hint: (l: AnyRecord): string => l.hint,
  values: DateValues,
  validator: (value: CaseDate): DateTypes =>
    areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isPastDate(value) || isDateTenYearsInFuture(value),
};

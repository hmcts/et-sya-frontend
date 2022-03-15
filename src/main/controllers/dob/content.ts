import { convertToDateObject } from '../../components/form/parser';
import { CaseDate } from '../../definitions/case';
import { DateFormFields, DefaultDateFormFields } from '../../definitions/dates';
import { FormContent } from '../../definitions/form';
import { AnyRecord, UnknownRecord } from '../../definitions/util-types';

const dob_date: DateFormFields = {
  ...DefaultDateFormFields,
  id: 'dob',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('dobDate', body),
};

export const dobFormContent: FormContent = {
  fields: {
    dobDate: dob_date,
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

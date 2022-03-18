import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { areDateFieldsFilledIn, isDateInputInvalid, isFutureDate } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields, InvalidField } from '../definitions/form';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class DobController {
  private readonly form: Form;
  private readonly dobFormContent: FormContent = {
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
        parser: (body: UnknownRecord): CaseDate => convertToDateObject('dobDate', body),
        validator: (value: CaseDate): string | void | InvalidField =>
          areDateFieldsFilledIn(value) || isDateInputInvalid(value) || isFutureDate(value),
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

  constructor() {
    this.form = new Form(<FormFields>this.dobFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.GENDER_DETAILS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.dobFormContent, [TranslationKeys.COMMON, TranslationKeys.DATE_OF_BIRTH]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DATE_OF_BIRTH, {
      ...content,
    });
  };
}

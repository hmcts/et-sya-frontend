import { Response } from 'express';
import { LoggerInstance } from 'winston';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { BirthDateFormFields, DateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

const dob_date: DateFormFields = {
  ...BirthDateFormFields,
  id: 'dobDate',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('dobDate', body),
};

export default class DobController {
  private readonly form: Form;
  private readonly dobFormContent: FormContent = {
    fields: { dobDate: dob_date },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.dobFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = setUrlLanguage(req, PageUrls.SEX_AND_TITLE);
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    dob_date.values = [
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
    this.dobFormContent.fields = { dobDate: dob_date };
    const content = getPageContent(req, this.dobFormContent, [TranslationKeys.COMMON, TranslationKeys.DATE_OF_BIRTH]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DATE_OF_BIRTH, {
      ...content,
    });
  };
}

import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { BirthDateFormFields, DateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { AnyRecord, UnknownRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { checkCaseStateAndRedirect, handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const dob_date: DateFormFields = {
  ...BirthDateFormFields,
  id: 'dobDate',
  parser: (body: UnknownRecord): CaseDate => convertToDateObject('dobDate', body),
};

const logger = getLogger('DobController');

export default class DobController {
  private readonly form: Form;
  private readonly dobFormContent: FormContent = {
    fields: { dobDate: dob_date },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.dobFormContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.SEX_AND_TITLE);
  };

  public get = (req: AppRequest, res: Response): void => {
    if (checkCaseStateAndRedirect(req, res)) {
      return;
    }
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

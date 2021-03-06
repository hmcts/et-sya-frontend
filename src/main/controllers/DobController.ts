import { Response } from 'express';

import { Form } from '../components/form/form';
import { convertToDateObject } from '../components/form/parser';
import { AppRequest } from '../definitions/appRequest';
import { CaseDate } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DateFormFields, DefaultDateFormFields } from '../definitions/dates';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { UnknownRecord } from '../definitions/util-types';
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

const dob_date: DateFormFields = {
  ...DefaultDateFormFields,
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

  constructor() {
    this.form = new Form(<FormFields>this.dobFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        logger.info(error);
      });

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

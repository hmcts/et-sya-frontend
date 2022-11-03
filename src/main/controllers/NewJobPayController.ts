import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CurrencyFormFields, DefaultCurrencyFormFields } from '../definitions/currency-fields';
import { FormContent, FormFields } from '../definitions/form';
import {
  DefaultPayIntervalRadioFormFields,
  PayIntervalRadioFormFields,
  saveForLaterButton,
  submitButton,
} from '../definitions/radios';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { returnNextPage } from './helpers/RouterHelpers';

const pay_before_tax: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'new-pay-before-tax',
  label: (l: AnyRecord): string => l.payBeforeTax,
};

const pay_interval: PayIntervalRadioFormFields = {
  ...DefaultPayIntervalRadioFormFields,
  id: 'new-job-pay-interval',
  label: (l: AnyRecord): string => l.weeklyMonthlyAnnual,
};

const logger = getLogger('NewJobPayController');

export default class NewJobPayController {
  private readonly form: Form;
  private readonly newJobPayContent: FormContent = {
    fields: {
      newJobPay: pay_before_tax,
      newJobPayInterval: pay_interval,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.newJobPayContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    returnNextPage(req, res, PageUrls.FIRST_RESPONDENT_NAME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.newJobPayContent, [TranslationKeys.COMMON, TranslationKeys.NEW_JOB_PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB_PAY, {
      ...content,
    });
  };
}

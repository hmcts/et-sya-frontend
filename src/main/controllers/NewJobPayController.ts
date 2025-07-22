import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
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

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

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

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.newJobPay = undefined;
      req.session.userCase.newJobPayInterval = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.FIRST_RESPONDENT_NAME);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.newJobPayContent, [TranslationKeys.COMMON, TranslationKeys.NEW_JOB_PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB_PAY, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

import { Response } from 'express';
import { LoggerInstance } from 'winston';

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
import { getCaseApi } from '../services/CaseService';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

const pay_before_tax: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'pay-before-tax',
  label: (l: AnyRecord): string => l.payBeforeTax,
};

const pay_after_tax: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'pay-after-tax',
  label: (l: AnyRecord): string => l.payAfterTax,
};

const pay_interval: PayIntervalRadioFormFields = {
  ...DefaultPayIntervalRadioFormFields,
  id: 'pay-interval',
  label: (l: AnyRecord): string => l.weeklyMonthlyAnnual,
};

export default class PayController {
  private readonly form: Form;
  private readonly payContent: FormContent = {
    fields: {
      payBeforeTax: pay_before_tax,
      payAfterTax: pay_after_tax,
      payInterval: pay_interval,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor(private logger: LoggerInstance) {
    this.form = new Form(<FormFields>this.payContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    getCaseApi(req.session.user?.accessToken)
      .updateDraftCase(req.session.userCase)
      .then(() => {
        this.logger.info(`Updated draft case id: ${req.session.userCase.id}`);
      })
      .catch(error => {
        this.logger.info(error);
      });
    handleSessionErrors(req, res, this.form, PageUrls.PENSION);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.payContent, [TranslationKeys.COMMON, TranslationKeys.PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY, {
      ...content,
    });
  };
}

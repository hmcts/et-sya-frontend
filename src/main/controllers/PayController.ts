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

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

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
    handleSessionErrors(req, res, this.form, PageUrls.PENSION);
    handleUpdateDraftCase(req, this.logger);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.payContent, [TranslationKeys.COMMON, TranslationKeys.PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY, {
      ...content,
    });
  };
}

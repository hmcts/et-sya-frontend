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

const payBeforeTaxField: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'pay-before-tax',
  label: (l: AnyRecord): string => l.payBeforeTax,
};

const payAfterTaxField: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'pay-after-tax',
  label: (l: AnyRecord): string => l.payAfterTax,
};

const payIntervalField: PayIntervalRadioFormFields = {
  ...DefaultPayIntervalRadioFormFields,
  id: 'pay-interval',
  label: (l: AnyRecord): string => l.weeklyMonthlyAnnual,
};

const logger = getLogger('PayController');

export default class PayController {
  private readonly form: Form;
  private readonly payContent: FormContent = {
    fields: {
      payBeforeTax: payBeforeTaxField,
      payAfterTax: payAfterTaxField,
      payInterval: payIntervalField,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.payContent.fields);
  }

  public clearSelection = (req: AppRequest): void => {
    if (req.session.userCase !== undefined) {
      req.session.userCase.payInterval = undefined;
      req.session.userCase.payAfterTax = undefined;
      req.session.userCase.payBeforeTax = undefined;
    }
  };

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.PENSION);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    if (req.query !== undefined && req.query.redirect === 'clearSelection') {
      this.clearSelection(req);
    }
    const content = getPageContent(req, this.payContent, [TranslationKeys.COMMON, TranslationKeys.PAY]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.PAY, {
      ...content,
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

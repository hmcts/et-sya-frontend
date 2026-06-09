import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { CurrencyFormFields, DefaultCurrencyFormFields } from '../../definitions/currency-fields';
import { FormContent, FormFields } from '../../definitions/form';
import {
  DefaultPayIntervalRadioFormFields,
  PayIntervalRadioFormFields,
  saveForLaterButton,
  submitButton,
} from '../../definitions/radios';
import { AnyRecord } from '../../definitions/util-types';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { clearFields, handleClearSelection, renderPage } from '../helpers/NonHmctsControllerHelper';
import { getLanguageParam } from '../helpers/RouterHelpers';

const logger = getLogger('ClaimantNewJobPayController');

const payBeforeTaxField: CurrencyFormFields = {
  ...DefaultCurrencyFormFields,
  id: 'new-pay-before-tax',
  label: (l: AnyRecord): string => l.payBeforeTax,
};

const payIntervalField: PayIntervalRadioFormFields = {
  ...DefaultPayIntervalRadioFormFields,
  id: 'new-job-pay-interval',
  label: (l: AnyRecord): string => l.weeklyMonthlyAnnual,
};

export default class ClaimantNewJobPayController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      newJobPay: payBeforeTaxField,
      newJobPayInterval: payIntervalField,
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_RESPONDENT_NAME);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'newJobPay', 'newJobPayInterval'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_NEW_JOB_PAY, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

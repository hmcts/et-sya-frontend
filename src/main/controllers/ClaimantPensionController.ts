import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { getPensionFormField } from './helpers/FormHelpers';
import { clearFields, handleClearSelection, renderPage } from './helpers/NonHmctsControllerHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantPensionController');

export default class ClaimantPensionController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimantPensionContribution: getPensionFormField('claimant-pension'),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    await handlePostLogic(req, res, this.form, logger, PageUrls.CLAIMANT_BENEFITS);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'claimantPensionContribution', 'claimantPensionWeeklyContribution'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_PENSION, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { getYesNoInlineRadioField, renderPage } from './helpers/NonHmctsControllerHelper';
import { conditionalRedirect } from './helpers/RouterHelpers';

const logger = getLogger('DidClaimantWorkForEmployerController');

export default class DidClaimantWorkForEmployerController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      pastEmployer: getYesNoInlineRadioField('did-claimant-work-for-employer', l => l.heading),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.IS_CLAIMANT_STILL_WORKING
      : PageUrls.FIRST_RESPONDENT_NAME;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.DID_CLAIMANT_WORK_FOR_EMPLOYER);
  };
}

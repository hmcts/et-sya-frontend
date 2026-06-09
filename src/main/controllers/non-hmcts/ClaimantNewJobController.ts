import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import {
  clearFields,
  getYesNoInlineRadioField,
  handleClearSelection,
  renderPage,
} from '../helpers/NonHmctsControllerHelper';
import { conditionalRedirect, getLanguageParam } from '../helpers/RouterHelpers';

const logger = getLogger('ClaimantNewJobController');

export default class ClaimantNewJobController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      newJob: getYesNoInlineRadioField('claimant-new-job', l => l.h1),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIMANT_NEW_JOB_START_DATE
      : PageUrls.CLAIMANT_RESPONDENT_NAME;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'newJob'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_NEW_JOB, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

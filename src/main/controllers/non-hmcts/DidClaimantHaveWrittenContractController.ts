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

const logger = getLogger('DidClaimantHaveWrittenContractController');

export default class DidClaimantHaveWrittenContractController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      claimantWrittenContract: getYesNoInlineRadioField('did-claimant-have-written-contract', l => l.heading),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIMANT_NOTICE_TYPE
      : PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    handleClearSelection(req, r => clearFields(r, 'claimantWrittenContract'));
    renderPage(req, res, this.form, this.formContent, TranslationKeys.DID_CLAIMANT_HAVE_WRITTEN_CONTRACT, {
      languageParam: getLanguageParam(req.url).replace('?', ''),
    });
  };
}

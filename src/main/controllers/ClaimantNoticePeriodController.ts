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

const logger = getLogger('ClaimantNoticePeriodController');

export default class ClaimantNoticePeriodController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      noticePeriod: getYesNoInlineRadioField('claimant-notice-period', l => l.legend),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.CLAIMANT_PAST_NOTICE_TYPE
      : PageUrls.CLAIMANT_AVERAGE_WEEKLY_HOURS;
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_NOTICE_PERIOD);
  };
}

import { Response } from 'express';

import { Form } from '../components/form/form';
import { CaseStateCheck } from '../decorators/CaseStateCheck';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormFields } from '../definitions/form';
import { getLogger } from '../logger';

import { handlePostLogicForRespondent } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { getNoAcasFormContent } from './helpers/NonHmctsControllerHelper';
import { getRespondentIndex } from './helpers/RespondentHelpers';

const logger = getLogger('NoAcasNumberController');

export default class NoAcasNumberController {
  private readonly form: Form;
  private readonly noAcasNumberContent = getNoAcasFormContent();

  constructor() {
    this.form = new Form(<FormFields>this.noAcasNumberContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    let redirectUrl;
    if (req.body.saveForLater) {
      redirectUrl = PageUrls.CLAIM_SAVED;
    } else {
      redirectUrl = req.session.respondentRedirectCheckAnswer
        ? PageUrls.CHECK_ANSWERS
        : PageUrls.RESPONDENT_DETAILS_CHECK;
    }
    await handlePostLogicForRespondent(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const respondentIndex = getRespondentIndex(req);
    const content = getPageContent(
      req,
      this.noAcasNumberContent,
      [TranslationKeys.COMMON, TranslationKeys.NO_ACAS_NUMBER],
      respondentIndex
    );
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NO_ACAS_NUMBER, { ...content });
  };
}

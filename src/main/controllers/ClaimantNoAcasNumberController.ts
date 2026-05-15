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

const logger = getLogger('ClaimantNoAcasNumberController');

export default class ClaimantNoAcasNumberController {
  private readonly form: Form;
  private readonly formContent = getNoAcasFormContent();

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.params.respondentNumber = '1';
    await handlePostLogicForRespondent(req, res, this.form, logger, PageUrls.CLAIMANT_RESPONDENT_DETAILS_CHECK);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_NO_ACAS_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_NO_ACAS_NUMBER, { ...content });
  };
}

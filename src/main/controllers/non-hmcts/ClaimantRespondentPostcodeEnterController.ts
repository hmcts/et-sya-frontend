import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormFields } from '../../definitions/form';
import { getLogger } from '../../logger';
import { handlePostLogicForRespondent } from '../helpers/CaseHelpers';
import { assignFormData, getPageContent } from '../helpers/FormHelpers';
import { getPostcodeEnterFormContent } from '../helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantRespondentPostcodeEnterController');

export default class ClaimantRespondentPostcodeEnterController {
  private readonly form: Form;
  private readonly formContent = getPostcodeEnterFormContent('respondentEnterPostcode');

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    req.params.respondentNumber = req.session.claimantRespondentNumber ?? '1';
    await handlePostLogicForRespondent(req, res, this.form, logger, PageUrls.CLAIMANT_RESPONDENT_POSTCODE_SELECT, true);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      TranslationKeys.COMMON,
      TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_ENTER,
    ]);
    const respondentName = req.session.userCase?.respondents?.[0]?.respondentName ?? '';
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_ENTER, { ...content, respondentName });
  };
}

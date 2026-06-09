import { Response } from 'express';

import { Form } from '../../components/form/form';
import { CaseStateCheck } from '../../decorators/CaseStateCheck';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../definitions/definition';
import { FormContent, FormFields } from '../../definitions/form';
import { saveForLaterButton, submitButton } from '../../definitions/radios';
import { getLogger } from '../../logger';
import { handlePostLogic } from '../helpers/CaseHelpers';
import { getTellUsWhatYouWantFormField } from '../helpers/FormHelpers';
import { renderPage } from '../helpers/NonHmctsControllerHelper';

const logger = getLogger('ClaimantTellUsWhatYouWantController');

export default class ClaimantTellUsWhatYouWantController {
  private readonly form: Form;
  private readonly formContent: FormContent = {
    fields: {
      tellUsWhatYouWant: getTellUsWhatYouWantFormField(),
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = async (req: AppRequest, res: Response): Promise<void> => {
    const selected = req.body?.tellUsWhatYouWant;
    const includes = (val: string): boolean => (Array.isArray(selected) ? selected.includes(val) : selected === val);
    let redirectUrl: string;
    if (includes(TellUsWhatYouWant.COMPENSATION_ONLY)) {
      redirectUrl = PageUrls.CLAIMANT_COMPENSATION;
    } else if (includes(TellUsWhatYouWant.TRIBUNAL_RECOMMENDATION)) {
      redirectUrl = PageUrls.CLAIMANT_TRIBUNAL_RECOMMENDATION;
    } else if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      redirectUrl = PageUrls.WHISTLEBLOWING_CLAIMS;
    } else {
      redirectUrl = PageUrls.CLAIMANT_LINKED_CASES;
    }
    await handlePostLogic(req, res, this.form, logger, redirectUrl);
  };

  @CaseStateCheck()
  public get = (req: AppRequest, res: Response): void => {
    renderPage(req, res, this.form, this.formContent, TranslationKeys.CLAIMANT_TELL_US_WHAT_YOU_WANT);
  };
}

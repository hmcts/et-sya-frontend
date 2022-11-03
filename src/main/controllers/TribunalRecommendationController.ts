import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handleUpdateDraftCase, setUserCase } from './helpers/CaseHelpers';
import { handleSessionErrors } from './helpers/ErrorHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';
import { returnNextPage } from './helpers/RouterHelpers';

const logger = getLogger('TribunalRecommendationController');

export default class TribunalRecommendationController {
  private readonly form: Form;
  private readonly tribunalRecommendationFormContent: FormContent = {
    fields: {
      tribunalRecommendationRequest: {
        id: 'tribunalRecommendationRequest',
        label: l => l.hint,
        labelHidden: true,
        type: 'textarea',
        hint: l => l.hint,
        maxlength: 2500,
        validator: isContent2500CharsOrLess,
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.tribunalRecommendationFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    handleSessionErrors(req, res, this.form);
    setUserCase(req, this.form);
    handleUpdateDraftCase(req, logger);
    if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      returnNextPage(req, res, PageUrls.WHISTLEBLOWING_CLAIMS);
    } else {
      returnNextPage(req, res, PageUrls.CLAIM_DETAILS_CHECK);
    }
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.tribunalRecommendationFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_RECOMMENDATION,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TRIBUNAL_RECOMMENDATION, {
      ...content,
    });
  };
}

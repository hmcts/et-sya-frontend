import { Response } from 'express';

import { Form } from '../components/form/form';
import { isContent2500CharsOrLess } from '../components/form/validator';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';
import { getLogger } from '../logger';

import { handlePostLogic } from './helpers/CaseHelpers';
import { assignFormData, getPageContent } from './helpers/FormHelpers';

const logger = getLogger('TribunalRecommendationController');

export default class TribunalRecommendationController {
  private readonly form: Form;
  private readonly tribunalRecommendationFormContent: FormContent = {
    fields: {
      tribunalRecommendationRequest: {
        id: 'tribunalRecommendationRequest',
        label: l => l.legend,
        labelHidden: false,
        labelSize: 'l',
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
    let redirectUrl;
    if (req.session.userCase.typeOfClaim?.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      redirectUrl = PageUrls.WHISTLEBLOWING_CLAIMS;
    } else {
      redirectUrl = PageUrls.CLAIM_DETAILS_CHECK;
    }
    handlePostLogic(req, res, this.form, logger, redirectUrl);
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

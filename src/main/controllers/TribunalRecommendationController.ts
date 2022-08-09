import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

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
      },
    },
    submit: submitButton,
    saveForLater: saveForLaterButton,
  };

  constructor() {
    this.form = new Form(<FormFields>this.tribunalRecommendationFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    if (req.session.userCase.typeOfClaim.includes(TypesOfClaim.WHISTLE_BLOWING.toString())) {
      handleSessionErrors(req, res, this.form, PageUrls.WHISTLEBLOWING_CLAIMS);
    } else {
      handleSessionErrors(req, res, this.form, PageUrls.CLAIM_DETAILS_CHECK);
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

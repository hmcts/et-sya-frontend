import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { saveForLaterButton, submitButton } from '../definitions/radios';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class TribunalRecommendationController {
  private readonly form: Form;
  private readonly tribunalRecommendationFormContent: FormContent = {
    fields: {
      tribunalRecommendationRequest: {
        id: 'tribunalRecommendationRequest',
        type: 'textarea',
        hint: l => l.hint,
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
    handleSessionErrors(req, res, this.form, PageUrls.WHISTLEBLOWING_CLAIMS);
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

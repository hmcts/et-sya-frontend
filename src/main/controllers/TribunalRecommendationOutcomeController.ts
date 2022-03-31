import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class TribunalRecommendationOutcomeController {
  private readonly form: Form;
  private readonly tribunalRecommendationOutcomeContent: FormContent = {
    fields: {
      tribunalRecommendationOutcome: {
        id: 'tribunal-recommendation-outcome',
        name: 'tribunal-recommendation-outcome',
        type: 'charactercount',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.textInputHint,
        maxlength: 1000,
      },
    },
    submit: {
      text: (l: AnyRecord): string => l.submit,
      classes: 'govuk-!-margin-right-2',
    },
    saveForLater: {
      text: (l: AnyRecord): string => l.saveForLater,
      classes: 'govuk-button--secondary',
    },
  };

  constructor() {
    this.form = new Form(<FormFields>this.tribunalRecommendationOutcomeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.tribunalRecommendationOutcomeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_RECOMMENDATION_OUTCOME,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TRIBUNAL_RECOMMENDATION_OUTCOME, {
      ...content,
    });
  };
}

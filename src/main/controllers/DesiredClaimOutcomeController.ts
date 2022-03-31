import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimOutcomes } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class DesiredClaimOutcomeController {
  private readonly form: Form;
  private readonly desiredClaimOutcomeContent: FormContent = {
    fields: {
      claimOutcome: {
        id: 'desired-outcome',
        name: 'desired-outcome',
        type: 'checkboxes',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.checkboxHint,
        values: [
          {
            id: 'compensation',
            name: 'compensation',
            label: l => l.compensation.text,
            hint: l => l.compensation.hint,
            value: ClaimOutcomes.COMPENSATION,
          },
          {
            id: 'tribunal-recommendation',
            name: 'tribunal-recommendation',
            label: l => l.tribunalRecommendation.text,
            hint: l => l.tribunalRecommendation.hint,
            value: ClaimOutcomes.TRIBUNAL_RECOMMENDATION,
          },
          {
            id: 'old-job',
            name: 'old-job',
            label: l => l.oldJob.text,
            value: ClaimOutcomes.OLD_JOB,
          },
          {
            id: 'another-job',
            name: 'another-job',
            label: l => l.anotherJob.text,
            value: ClaimOutcomes.ANOTHER_JOB,
          },
        ],
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
    this.form = new Form(<FormFields>this.desiredClaimOutcomeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), ClaimOutcomes.COMPENSATION)
      ? PageUrls.COMPENSATION_OUTCOME
      : conditionalRedirect(req, this.form.getFormFields(), ClaimOutcomes.TRIBUNAL_RECOMMENDATION)
      ? PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME
      : PageUrls.CLAIM_STEPS;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.desiredClaimOutcomeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.DESIRED_CLAIM_OUTCOME,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.DESIRED_CLAIM_OUTCOME, {
      ...content,
    });
  };
}

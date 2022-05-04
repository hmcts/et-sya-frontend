import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimOutcomes } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class DesiredClaimOutcomeController {
  private readonly form: Form;
  private readonly desiredClaimOutcomeContent: FormContent = {
    fields: {
      claimOutcome: {
        id: 'claimOutcome',
        type: 'checkboxes',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.checkboxHint,
        values: [
          {
            id: 'claimOutcome',
            name: 'claimOutcome',
            label: l => l.compensation.text,
            hint: l => l.compensation.hint,
            value: ClaimOutcomes.COMPENSATION,
          },
          {
            id: 'claimOutcome',
            name: 'claimOutcome',
            label: l => l.tribunalRecommendation.text,
            hint: l => l.tribunalRecommendation.hint,
            value: ClaimOutcomes.TRIBUNAL_RECOMMENDATION,
          },
          {
            id: 'claimOutcome',
            name: 'claimOutcome',
            label: l => l.oldJob.text,
            value: ClaimOutcomes.OLD_JOB,
          },
          {
            id: 'claimOutcome',
            name: 'claimOutcome',
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
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, getRedirectUrl(req));
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

function getRedirectUrl(req: AppRequest<Partial<AnyRecord>>) {
  if (req.body.claimOutcome && req.body.claimOutcome.includes(ClaimOutcomes.COMPENSATION)) {
    return PageUrls.COMPENSATION_OUTCOME;
  }

  return req.body.claimOutcome && req.body.claimOutcome.includes(ClaimOutcomes.TRIBUNAL_RECOMMENDATION)
    ? PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME
    : PageUrls.CLAIM_STEPS;
}

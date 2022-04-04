import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimOutcomes } from '../definitions/definition';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class CompensationOutcomeController {
  private readonly form: Form;
  private readonly compensationOutcomeContent: FormContent = {
    fields: {
      compensationOutcome: {
        id: 'compensation-outcome',
        name: 'compensation-outcome',
        type: 'charactercount',
        classes: 'govuk-label',
        label: l => l.label,
        labelHidden: true,
        hint: l => l.textInputHint,
        maxlength: 1000,
      },
      compensationAmount: {
        id: 'compensation-amount',
        name: 'compensation-amount',
        type: 'currency',
        classes: 'govuk-input--width-5',
        label: (l: AnyRecord): string => l.amountLabel,
        attributes: { maxLength: 12 },
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
    this.form = new Form(<FormFields>this.compensationOutcomeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl =
      req.session.userCase && req.session.userCase.claimOutcome.includes(ClaimOutcomes.TRIBUNAL_RECOMMENDATION)
        ? PageUrls.TRIBUNAL_RECOMMENDATION_OUTCOME
        : PageUrls.CLAIM_STEPS;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.compensationOutcomeContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COMPENSATION_OUTCOME,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.COMPENSATION_OUTCOME, {
      ...content,
    });
  };
}

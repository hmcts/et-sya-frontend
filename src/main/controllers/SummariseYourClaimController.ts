import { Response } from 'express';

import { Form } from '../components/form/form';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent, FormFields } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from './helpers';

export default class SummariseYourClaimController {
  private readonly form: Form;
  private readonly summariseYourClaimContent: FormContent = {
    fields: {},
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
    this.form = new Form(<FormFields>this.summariseYourClaimContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.DESIRED_CLAIM_OUTCOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.summariseYourClaimContent, [
      TranslationKeys.COMMON,
      TranslationKeys.SUMMARISE_YOUR_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.SUMMARISE_YOUR_CLAIM, {
      ...content,
    });
  };
}

import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class DesiredClaimOutcomeController {
  private readonly form: Form;

  constructor(private readonly desiredClaimOutcomeContent: FormContent) {
    this.form = new Form(<FormFields>this.desiredClaimOutcomeContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
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

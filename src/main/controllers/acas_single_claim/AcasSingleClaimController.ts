import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class AcasSingleClaimController {
  private readonly form: Form;

  constructor(private readonly acasSingleClaimFormContent: FormContent) {
    this.form = new Form(<FormFields>this.acasSingleClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? PageUrls.TYPE_OF_CLAIM
      : PageUrls.NO_ACAS_NUMBER;
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasSingleClaimFormContent, [
      TranslationKeys.COMMON,
      TranslationKeys.ACAS_SINGLE_CLAIM,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.ACAS_SINGLE_CLAIM, {
      ...content,
    });
  };
}

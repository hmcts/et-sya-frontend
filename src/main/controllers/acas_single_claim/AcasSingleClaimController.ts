import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, conditionalRedirect, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class AcasSingleClaimController {
  private readonly form: Form;

  constructor(private readonly acasSingleClaimFormContent: FormContent) {
    this.form = new Form(<FormFields>this.acasSingleClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // TODO(Tautvydas): Change to the correct redirect url
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES)
      ? '/type-of-claim'
      : '/do-you-have-a-valid-no-acas-reason';

    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasSingleClaimFormContent, ['common', 'acas-single-claim']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('acas-single-claim', {
      ...content,
    });
  };
}

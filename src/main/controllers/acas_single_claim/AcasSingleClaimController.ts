import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import {
  assignFormData,
  conditionalRedirect,
  getPageContent,
  handleSessionErrors,
  setUserCase,
} from '../helpers';
import { YesOrNo } from 'definitions/case';

export default class AcasSingleClaimController {
  private readonly form: Form

  constructor(private readonly acasSingleClaimFormContent: FormContent) {
    this.form = new Form(<FormFields>this.acasSingleClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // TODO(Tautvydas): Change to the correct redirect url
    const redirectUrl = conditionalRedirect(req, this.form.getFormFields(), YesOrNo.YES) ? '/' : '/';
    
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, redirectUrl);
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasSingleClaimFormContent, [
      'common',
      'acas-single-claim',
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('acas-single-claim', {
      ...content,
    });
  }
}

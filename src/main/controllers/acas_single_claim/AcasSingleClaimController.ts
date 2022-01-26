import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import {
  assignFormData,
  getPageContent,
  handleSessionErrors,
  setUserCase,
} from '../helpers';

export default class AcasSingleClaimController {
  private readonly form: Form

  constructor(private readonly acasSingleClaimFormContent: FormContent) {
    this.form = new Form(<FormFields>this.acasSingleClaimFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
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

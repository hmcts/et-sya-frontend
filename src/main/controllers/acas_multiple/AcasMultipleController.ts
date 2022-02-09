import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class AcasMultipleController {
  private readonly form: Form;

  constructor(private readonly acasFormContent: FormContent) {
    this.form = new Form(<FormFields>this.acasFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.acasFormContent, ['common', 'acas-multiple']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('acas-multiple', {
      ...content,
    });
  };
}

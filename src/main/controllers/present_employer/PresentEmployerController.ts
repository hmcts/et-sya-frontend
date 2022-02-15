import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class PresentEmployerController {
  private readonly form: Form;

  constructor(private readonly presentEmployerFormContent: FormContent) {
    this.form = new Form(<FormFields>this.presentEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.presentEmployerFormContent, ['common', 'present-employer']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('present-employer', {
      ...content,
    });
  };
}

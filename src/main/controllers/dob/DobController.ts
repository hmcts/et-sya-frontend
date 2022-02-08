import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class DobController {
  private readonly form: Form;

  constructor(private readonly dobFormContent: FormContent) {
    this.form = new Form(<FormFields>this.dobFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/gender-details');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.dobFormContent, ['common', 'date-of-birth']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('date-of-birth', {
      ...content,
    });
  };
}

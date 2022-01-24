import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import { Response } from 'express';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class TelNumberController {
  private readonly form: Form

  constructor(private readonly telNumberContent: FormContent) {
    this.form = new Form(<FormFields>this.telNumberContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.telNumberContent, [
      'common',
      'telephone-number',
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('telephone-number', {
      ...content,
    });
  }
}

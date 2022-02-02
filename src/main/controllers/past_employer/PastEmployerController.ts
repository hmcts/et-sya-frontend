import { Response } from 'express';
import { Form } from '../../components/form/form';
import { FormContent, FormFields } from '../../definitions/form';
import { AppRequest } from '../../definitions/appRequest';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class pastEmployerController {
  private readonly form: Form;

  constructor(private readonly pastEmployerFormContent: FormContent) {
    this.form = new Form(<FormFields>this.pastEmployerFormContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.pastEmployerFormContent, [
      'common',
      'past-employer',
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('past-employer', {
      ...content,
    });
  };
}

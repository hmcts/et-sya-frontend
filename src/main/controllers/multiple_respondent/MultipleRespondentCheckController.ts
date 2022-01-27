import { Form } from '../../components/form/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../../controllers/helpers';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';
import { Response } from 'express';

export default class MultipleRespondentCheckController {
  private readonly form: Form;

  constructor(private readonly formContent: FormContent) {
    this.form = new Form(<FormFields>this.formContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  }

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.formContent, [
      'common',
      'multiple-respondent-check',
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('multiple-respondent-check', {
      ...content,
    });
  }
}
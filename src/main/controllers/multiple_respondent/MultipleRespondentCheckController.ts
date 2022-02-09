import { Response } from 'express';

import { Form } from '../../components/form/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../../controllers/helpers';
import { AppRequest } from '../../definitions/appRequest';
import { FormContent, FormFields } from '../../definitions/form';

export default class MultipleRespondentCheckController {
  private readonly form: Form;

  constructor(private readonly multipleRespondentContent: FormContent) {
    this.form = new Form(<FormFields>this.multipleRespondentContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, '/');
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.multipleRespondentContent, ['common', 'multiple-respondent-check']);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('multiple-respondent-check', {
      ...content,
    });
  };
}

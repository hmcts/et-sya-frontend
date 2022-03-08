import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class NewJobStartDateController {
  private readonly form: Form;

  constructor(private readonly newJobStartDateContent: FormContent) {
    this.form = new Form(<FormFields>this.newJobStartDateContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.NEW_JOB_PAY);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.newJobStartDateContent, [
      TranslationKeys.COMMON,
      TranslationKeys.NEW_JOB_START_DATE,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.NEW_JOB, {
      ...content,
    });
  };
}

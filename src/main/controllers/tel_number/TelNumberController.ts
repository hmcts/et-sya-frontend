import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class TelNumberController {
  private readonly form: Form;

  constructor(private readonly telNumberContent: FormContent) {
    this.form = new Form(<FormFields>this.telNumberContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.UPDATE_PREFERENCES);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.telNumberContent, [
      TranslationKeys.COMMON,
      TranslationKeys.TELEPHONE_NUMBER,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.TELEPHONE_NUMBER, {
      ...content,
    });
  };
}

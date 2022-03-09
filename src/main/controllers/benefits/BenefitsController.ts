import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors, setUserCase } from '../helpers';

export default class benefitsController {
  private readonly form: Form;

  constructor(private readonly benefitsContent: FormContent) {
    this.form = new Form(<FormFields>this.benefitsContent.fields);
  }
  public post = (req: AppRequest, res: Response): void => {
    setUserCase(req, this.form);
    handleSessionErrors(req, res, this.form, PageUrls.HOME);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.benefitsContent, [TranslationKeys.COMMON, TranslationKeys.BENEFITS]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render(TranslationKeys.BENEFITS, {
      ...content,
    });
  };
}

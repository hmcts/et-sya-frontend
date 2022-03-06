import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors } from '../helpers';

export default class ComfortableController {
  private readonly form: Form;

  constructor(private readonly comfortableContent: FormContent) {
    this.form = new Form(<FormFields>this.comfortableContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // add setUserCase here if requried
    handleSessionErrors(req, res, this.form, PageUrls.TRAVEL);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.comfortableContent, [TranslationKeys.COMMON, TranslationKeys.COMFORTABLE]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}

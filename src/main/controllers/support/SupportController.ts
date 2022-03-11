import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors } from '../helpers';

export default class SupportController {
  private readonly form: Form;

  constructor(private readonly supportContent: FormContent) {
    this.form = new Form(<FormFields>this.supportContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // add setUserCase here if requried
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.supportContent, [TranslationKeys.COMMON, TranslationKeys.SUPPORT]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}

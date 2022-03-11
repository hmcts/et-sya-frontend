import { Response } from 'express';

import { Form } from '../../components/form/form';
import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent, FormFields } from '../../definitions/form';
import { assignFormData, getPageContent, handleSessionErrors } from '../helpers';

export default class CommunicatingController {
  private readonly form: Form;

  constructor(private readonly communicatingContent: FormContent) {
    this.form = new Form(<FormFields>this.communicatingContent.fields);
  }

  public post = (req: AppRequest, res: Response): void => {
    // add setUserCase here if requried
    handleSessionErrors(req, res, this.form, PageUrls.CLAIM_STEPS);
  };

  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, this.communicatingContent, [
      TranslationKeys.COMMON,
      TranslationKeys.COMMUNICATING,
    ]);
    assignFormData(req.session.userCase, this.form.getFormFields());
    res.render('generic-form-template', {
      ...content,
    });
  };
}
